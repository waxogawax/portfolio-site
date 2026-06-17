// Explicit surface-form → canonical aliases.
// Only add when forms are truly interchangeable in this site's context.
// Do NOT conflate terms that have distinct meanings in criticism/curatorial discourse.
export const TERM_ALIASES: Record<string, string> = {
  // テキスト ↔ テクスト: the site uses テクスト as the scholarly/theoretical register
  'テキスト': 'テクスト',
  'text': 'テクスト',
  // 現代美術 / 現代アート: treat as aliases (same referent in this context)
  '現代美術': '現代アート',
  'コンテンポラリーアート': '現代アート',
  // English ↔ Japanese for key terms used in bilingual frontmatter
  'installation': 'インスタレーション',
  'curator': 'キュレーター',
  'curation': 'キュレーション',
  'typography': 'タイポグラフィ',
  'caption': 'キャプション',
  // Romanized names that appear in English-language frontmatter
  // (do NOT auto-translate proper nouns / artist names)
};
