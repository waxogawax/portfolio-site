export const STOPWORDS = new Set<string>([
  // Japanese particles and auxiliaries
  'を', 'は', 'が', 'の', 'に', 'で', 'と', 'も', 'や', 'か', 'へ', 'て',
  'な', 'だ', 'い', 'う', 'ず', 'ぬ', 'し', 'ば', 'けど', 'けれど',
  'ので', 'から', 'まで', 'より', 'でも', 'ても', 'として', 'について',
  'において', 'によって', 'にわたって', 'をめぐって',
  // Demonstratives and interrogatives
  'これ', 'それ', 'あれ', 'この', 'その', 'あの', 'こんな', 'そんな', 'あんな',
  'ここ', 'そこ', 'あそこ', 'こちら', 'そちら', 'あちら',
  'どう', 'どんな', 'どこ', 'いつ', 'だれ', 'なに', 'なぜ', 'どれ',
  // Common function words
  'ため', 'よう', 'もの', 'こと', 'ところ', 'とき', 'まま', 'うえ',
  'した', 'まえ', 'なか', 'ほか', 'なか', 'あいだ',
  // Conjunctions
  'しかし', 'また', 'そして', 'または', 'ただ', 'さらに', 'つまり',
  'しかも', 'それに', 'ならば', 'すでに', 'まず', 'ともに', 'むしろ',
  'たとえば', 'すなわち', 'いわば', 'いずれ', 'もしくは', 'あるいは',
  'ならびに', 'および', 'ただし', 'もっとも', 'なお',
  // Verb stems that appear as word-like segments
  'する', 'なる', 'いう', 'みる', 'くる', 'ある', 'いる', 'おく',
  'くれる', 'もらう', 'させる', 'られる', 'できる', 'おわる',
  'おもう', 'かんがえる', 'みえる', 'きこえる', 'なれる',
  'つくる', 'おこなう', 'かける', 'つける', 'とる',
  // Hiragana-only common words
  'ので', 'から', 'まで', 'より', 'しながら', 'ながら', 'たり',
  'つつ', 'ほど', 'くらい', 'ごろ', 'あたり',
  // Date/count units
  '年', '月', '日', '時', '分', '秒',
  '個', '枚', '本', '冊', '台', '人', '回', '番', '号',
  // System and meta words
  'page', 'entry', 'sample', 'markdown', 'src', 'content',
  'draft', 'false', 'true', 'null', 'undefined',
  'md', 'astro', 'index', 'slug', 'data', 'type',
  // Content collection tag noise and sample content keywords
  'diary', 'test', 'solo', 'group', 'other', 'design', 'web', 'gallery',
  'works', 'collection', 'artist', 'curator', 'work', 'writing',
  'サンプル', 'テスト', 'エントリ', 'ワーク',
  // Locations used as tags (too generic for cross-page linking)
  'tokyo', 'japan', 'osaka', 'kyoto',
  // Academic publishing / bibliography noise
  'les', 'presses', 'reel', 'du', 'de', 'la', 'le', 'koenig', 'verso', 'press',
  'mit', 'cahier', 'trans', 'vol', 'pp', 'ibid', 'op', 'cit', 'eds', 'ed',
  'books', 'october', 'open', 'flow', 'power',
  // Generic English academic terms (too broad to be useful cross-links)
  'contemporary', 'aesthetics', 'relational', 'radical', 'antagonism', 'participation',
  // English stopwords
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'this', 'that', 'it', 'its', 'not', 'no', 'so', 'if',
  'about', 'into', 'after', 'over', 'under', 'between', 'through', 'while',
  'each', 'all', 'both', 'some', 'any', 'can', 'we', 'they', 'he', 'she',
]);
