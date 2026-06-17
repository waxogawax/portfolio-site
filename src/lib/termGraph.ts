import { getCollection } from 'astro:content';
import { STOPWORDS } from '../data/termStopwords.ts';
import { TERM_ALIASES } from '../data/termAliases.ts';
import { TERM_DICTIONARY } from '../data/termDictionary.ts';

// ── Public types ──────────────────────────────────────────────────────────────

export type TermGraph = {
  generatedAt: string;
  nodes: TermNode[];
  edges: TermEdge[];
  pages: Record<string, PageGraphData>;
};

export type TermNode = {
  id: string;
  label: string;
  kind: 'term' | 'page';
  weight: number;
  pages: string[];
};

export type TermEdge = {
  source: string;
  target: string;
  weight: number;
  pages: string[];
};

export type PageGraphData = {
  title: string;
  url: string;
  collection: string;
  date?: string;
  terms: Array<{ id: string; label: string; weight: number }>;
  relatedPages: Array<{ title: string; url: string; score: number; reasonTerms: string[] }>;
  relatedTerms: Array<{ id: string; label: string; weight: number }>;
};

// ── Internal types ────────────────────────────────────────────────────────────

type PageDoc = {
  id: string;
  url: string;
  title: string;
  collection: string;
  date?: string;
  frontmatter: {
    tags?: string[];
    description?: string;
    venue?: string;
    city?: string;
    artists?: string[];
    role?: string;
    relatedWorks?: string[];
    relatedWritings?: string[];
  };
  body: string;
};

type ProcessedPage = PageDoc & { termScores: Record<string, number> };

// ── Module-level singleton (shared across pages in a single Astro build) ──────

let _promise: Promise<TermGraph> | null = null;

export function buildTermGraph(): Promise<TermGraph> {
  if (!_promise) _promise = _build();
  return _promise;
}

// ── Text utilities ────────────────────────────────────────────────────────────

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}([^*_\n]+)[*_]{1,3}/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*\d+\.\s+/gm, ' ')
    .replace(/^\s*>\s+/gm, ' ')
    .replace(/^---+\s*$/gm, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractHeadings(body: string): string[] {
  return body
    .split('\n')
    .filter(l => /^#{1,6}\s/.test(l))
    .map(l => l.replace(/^#{1,6}\s+/, '').trim());
}

function extractParagraphs(body: string): string[] {
  return stripMarkdown(body)
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 10);
}

// ── Character utilities ───────────────────────────────────────────────────────

function isKatakanaOnly(s: string): boolean {
  return /^[゠-ヿーヽヾ]+$/.test(s);
}

function isHiraganaOnly(s: string): boolean {
  return /^[぀-ゟー]+$/.test(s);
}

function hasJapanese(s: string): boolean {
  return /[぀-鿿]/.test(s);
}

function isAsciiWord(s: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(s);
}

// Exclude mixed kanji+hiragana verb/adjective inflection forms.
// Pure kanji compounds (素材, 空間) and dictionary terms are not affected.
function isInflectedVerbForm(s: string): boolean {
  const hasKanji = /[一-龿]/.test(s);
  const endsHiragana = /[ぁ-ん]$/.test(s);
  if (!hasKanji || !endsHiragana) return false;
  // Allow known noun-suffix endings (み, さ, な, の, し can be nominal)
  // Exclude clear verb endings: る、す、く、ぐ、ぬ、ぶ、む、う、つ、ず、れ、て
  const lastChar = s[s.length - 1];
  const verbEndings = new Set(['る', 'す', 'く', 'ぐ', 'ぬ', 'ぶ', 'む', 'う', 'つ', 'ず', 'れ', 'て', 'で', 'せ', 'べ', 'め']);
  return verbEndings.has(lastChar);
}

function resolveAlias(term: string): string {
  return TERM_ALIASES[term] ?? term;
}

// ── Term extraction ───────────────────────────────────────────────────────────

function extractTermsFromText(text: string): Map<string, number> {
  const terms = new Map<string, number>();
  if (!text.trim()) return terms;

  const clean = stripMarkdown(text);

  // 1. Dictionary scan (longest-first to prefer compound forms)
  const coveredPositions = new Set<number>();
  for (const dictTerm of TERM_DICTIONARY) {
    let pos = 0;
    while (true) {
      const idx = clean.indexOf(dictTerm, pos);
      if (idx === -1) break;
      const canonical = resolveAlias(dictTerm);
      if (!STOPWORDS.has(canonical) && canonical.length >= 2) {
        terms.set(canonical, (terms.get(canonical) ?? 0) + 2);
        for (let i = idx; i < idx + dictTerm.length; i++) coveredPositions.add(i);
      }
      pos = idx + 1;
    }
  }

  // 2. Segmenter for remaining tokens
  let segmenter: Intl.Segmenter;
  try {
    segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
  } catch {
    return terms;
  }

  let charPos = 0;
  for (const { segment, isWordLike } of segmenter.segment(clean)) {
    const segStart = charPos;
    charPos += segment.length;

    if (!isWordLike) continue;
    // Skip if fully covered by a dictionary compound term
    if (coveredPositions.has(segStart)) continue;

    const raw = segment.trim();
    if (!raw || raw.length < 2) continue;

    // Filter by character type
    if (isHiraganaOnly(raw)) continue;
    if (isKatakanaOnly(raw) && raw.length < 3) continue;
    if (isAsciiWord(raw) && raw.length < 3) continue;
    if (!hasJapanese(raw) && !isAsciiWord(raw)) continue;

    // Stopword check
    if (STOPWORDS.has(raw) || STOPWORDS.has(raw.toLowerCase())) continue;

    // Skip pure punctuation / numerics / year-like strings
    if (/^[\d\s。、．，！？「」『』【】（）〔〕《》〈〉…―・]+$/.test(raw)) continue;

    // Skip inflected verb/adjective forms (okurigana pattern)
    if (isInflectedVerbForm(raw)) continue;

    const canonical = resolveAlias(raw);
    if (!canonical || canonical.length < 2) continue;
    if (STOPWORDS.has(canonical)) continue;

    terms.set(canonical, (terms.get(canonical) ?? 0) + 1);
  }

  return terms;
}

// ── Per-page term scoring ─────────────────────────────────────────────────────

function scoreTermsForPage(page: PageDoc): Record<string, number> {
  const scores: Record<string, number> = {};

  function add(label: string, w: number) {
    const c = resolveAlias(label.trim());
    if (!c || c.length < 2 || STOPWORDS.has(c) || STOPWORDS.has(c.toLowerCase())) return;
    scores[c] = (scores[c] ?? 0) + w;
  }

  function addFromText(text: string, w: number) {
    if (!text) return;
    for (const [t, cnt] of extractTermsFromText(text)) add(t, cnt * w);
  }

  // frontmatter tags: +5 (explicit, highest trust)
  // Skip tags that are pure numbers (e.g. "2024"), spaces, or system keywords
  for (const tag of page.frontmatter.tags ?? []) {
    if (/^\d+$/.test(tag)) continue; // year tags, pure numbers
    if (tag.includes(' ')) {
      // Multi-word tag: extract sub-terms only, don't add as whole
      addFromText(tag, 3);
      continue;
    }
    add(tag, 5);
    addFromText(tag, 2);
  }

  // title: +4
  addFromText(page.title, 4);

  // description: +2
  if (page.frontmatter.description) addFromText(page.frontmatter.description, 2);

  // Venue and city names are proper nouns / place names.
  // They don't contribute useful cross-page term links, so we skip them.
  // (e.g. "biscuit gallery" would fragment into noise terms)

  // Skip artist name extraction: names are proper nouns and often stored as
  // comma-separated multi-person strings (e.g. "田中小太郎、袁方洲、ペロンミ")
  // which the segmenter splits into unrelated name fragments.

  // role: +3 (e.g. "curator" → aliased to "キュレーター")
  if (page.frontmatter.role) add(page.frontmatter.role, 3);

  // headings in body: +3
  for (const h of extractHeadings(page.body)) addFromText(h, 3);

  // body text: +1
  addFromText(page.body, 1);

  // Drop very low-weight noise terms
  for (const k of Object.keys(scores)) {
    if (scores[k] < 1.5) delete scores[k];
  }

  return scores;
}

// ── Main build ────────────────────────────────────────────────────────────────

async function _build(): Promise<TermGraph> {
  const [diary, exhibitions, works, writings] = await Promise.all([
    getCollection('diary', e => !e.data.draft).catch(() => []),
    getCollection('exhibitions', e => !e.data.draft).catch(() => []),
    getCollection('works', e => !e.data.draft).catch(() => []),
    getCollection('writings', e => !e.data.draft).catch(() => []),
  ]);

  const pageDocs: PageDoc[] = [];

  for (const e of diary) {
    const id = e.id.replace(/\.md$/, '');
    pageDocs.push({
      id: `diary/${id}`, url: `/diary/${id}/`,
      title: e.data.title, collection: 'diary',
      date: e.data.date.toISOString(),
      frontmatter: { tags: e.data.tags, description: e.data.description },
      body: e.body ?? '',
    });
  }

  for (const e of exhibitions) {
    const id = e.id.replace(/\.md$/, '');
    pageDocs.push({
      id: `exhibitions/${id}`, url: `/exhibitions/${id}/`,
      title: e.data.title, collection: 'exhibitions',
      date: e.data.startDate.toISOString(),
      frontmatter: {
        tags: e.data.tags, description: e.data.description,
        venue: e.data.venue, city: e.data.city,
        artists: e.data.artists, role: e.data.role,
        relatedWorks: e.data.relatedWorks, relatedWritings: e.data.relatedWritings,
      },
      body: e.body ?? '',
    });
  }

  for (const e of works) {
    const id = e.id.replace(/\.md$/, '');
    pageDocs.push({
      id: `works/${id}`, url: `/works/${id}/`,
      title: e.data.title, collection: 'works',
      date: e.data.date.toISOString(),
      frontmatter: { tags: e.data.tags, description: e.data.description },
      body: e.body ?? '',
    });
  }

  for (const e of writings) {
    const id = e.id.replace(/\.md$/, '');
    pageDocs.push({
      id: `writings/${id}`, url: `/writings/${id}/`,
      title: e.data.title, collection: 'writings',
      date: e.data.date.toISOString(),
      frontmatter: { tags: e.data.tags, description: e.data.description },
      body: e.body ?? '',
    });
  }

  // Score terms for each page
  const processed: ProcessedPage[] = pageDocs.map(p => ({
    ...p, termScores: scoreTermsForPage(p),
  }));

  // Global term index
  const termPageMap = new Map<string, Set<string>>();
  const termGlobalWeight = new Map<string, number>();

  for (const page of processed) {
    for (const [term, w] of Object.entries(page.termScores)) {
      if (!termPageMap.has(term)) termPageMap.set(term, new Set());
      termPageMap.get(term)!.add(page.id);
      termGlobalWeight.set(term, (termGlobalWeight.get(term) ?? 0) + w);
    }
  }

  // IDF: penalize ubiquitous terms
  const N = Math.max(processed.length, 1);
  function idf(term: string): number {
    const df = termPageMap.get(term)?.size ?? 1;
    return Math.log((N + 1) / df) + 1;
  }

  // Related pages for each page
  function getRelatedPages(page: ProcessedPage): PageGraphData['relatedPages'] {
    const scores = new Map<string, { score: number; reasons: string[] }>();
    const mySlug = page.id.split('/').slice(1).join('/');

    for (const other of processed) {
      if (other.id === page.id) continue;

      let score = 0;
      const sharedTerms: string[] = [];

      for (const [term, myW] of Object.entries(page.termScores)) {
        const otherW = other.termScores[term];
        if (otherW === undefined) continue;
        score += Math.sqrt(myW * otherW) * idf(term);
        sharedTerms.push(term);
      }

      // Explicit cross-link bonuses
      const otherSlug = other.id.split('/').slice(1).join('/');
      if (page.frontmatter.relatedWorks?.includes(otherSlug)) score += 10;
      if (page.frontmatter.relatedWritings?.includes(otherSlug)) score += 10;
      if (other.frontmatter.relatedWorks?.includes(mySlug)) score += 5;
      if (other.frontmatter.relatedWritings?.includes(mySlug)) score += 5;

      if (score > 0) {
        const topReasons = sharedTerms
          .sort((a, b) => {
            const wa = (page.termScores[a] ?? 0) * (other.termScores[a] ?? 0);
            const wb = (page.termScores[b] ?? 0) * (other.termScores[b] ?? 0);
            return wb - wa;
          })
          .slice(0, 4);
        scores.set(other.id, { score, reasons: topReasons });
      }
    }

    return [...scores.entries()]
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 6)
      .map(([id, { score, reasons }]) => {
        const other = processed.find(p => p.id === id)!;
        return { title: other.title, url: other.url, score, reasonTerms: reasons };
      });
  }

  // Co-occurrence edges
  type EdgeAcc = { weight: number; pages: Set<string> };
  const edgeAcc = new Map<string, EdgeAcc>();

  function addEdge(a: string, b: string, w: number, pageId: string) {
    if (a === b) return;
    const key = a < b ? `${a}|||${b}` : `${b}|||${a}`;
    if (!edgeAcc.has(key)) edgeAcc.set(key, { weight: 0, pages: new Set() });
    const e = edgeAcc.get(key)!;
    e.weight += w;
    e.pages.add(pageId);
  }

  for (const page of processed) {
    const terms = Object.keys(page.termScores);

    // Page-level co-occurrence: +1
    for (let i = 0; i < terms.length; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        addEdge(terms[i], terms[j], 1, page.id);
      }
    }

    // Paragraph-level bonus: +2
    for (const para of extractParagraphs(page.body)) {
      const paraTerms = [...extractTermsFromText(para).keys()]
        .filter(t => page.termScores[t] !== undefined);
      for (let i = 0; i < paraTerms.length; i++) {
        for (let j = i + 1; j < paraTerms.length; j++) {
          addEdge(paraTerms[i], paraTerms[j], 2, page.id);
        }
      }
    }
  }

  const edges: TermEdge[] = [...edgeAcc.entries()]
    .filter(([, e]) => e.weight >= 2)
    .map(([key, e]) => {
      const [source, target] = key.split('|||');
      return { source, target, weight: e.weight, pages: [...e.pages] };
    })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 300);

  // Build pages record
  const pagesRecord: Record<string, PageGraphData> = {};

  for (const page of processed) {
    const sortedTerms = Object.entries(page.termScores)
      .map(([label, w]) => ({ id: label, label, weight: w * idf(label) }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 30);

    pagesRecord[page.id] = {
      title: page.title,
      url: page.url,
      collection: page.collection,
      date: page.date,
      terms: sortedTerms,
      relatedPages: getRelatedPages(page),
      relatedTerms: sortedTerms.slice(0, 15),
    };
  }

  // Global term nodes
  const nodes: TermNode[] = [...termPageMap.entries()]
    .map(([label, pages]) => ({
      id: label,
      label,
      kind: 'term' as const,
      weight: (termGlobalWeight.get(label) ?? 0) * idf(label),
      pages: [...pages],
    }))
    .sort((a, b) => b.weight - a.weight);

  return {
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
    pages: pagesRecord,
  };
}
