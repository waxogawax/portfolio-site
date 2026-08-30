// Research page content — edit this file only. src/pages/research/index.astro
// reads from these arrays and re-sorts by year automatically; no markup changes needed.

export interface Bilingual {
  ja: string;
  en?: string | null;
}

export const profile = {
  name: { ja: '小川楽生', en: 'Rakuki Ogawa' } satisfies Bilingual,
  affiliations: [
    {
      org: '慶應義塾大学大学院 政策・メディア研究科',
      role: '後期博士課程',
      roleEn: 'Doctoral Program',
    },
    {
      org: '人間文化機構 総合地球環境学研究所',
      role: '共同研究員',
      roleEn: 'Collaborative Researcher',
    },
    {
      org: '科学技術振興機構（JST）次世代研究者挑戦的研究プログラム',
      role: 'フェロー',
      roleEn: 'Fellow',
    },
  ],
  statement:
    'キュレーションを、作品選択や展示設計にとどまらず、複数の知識・時間・主体を接続する実践として文化人類学的に研究しています。近年は、災害・危機的状況におけるcareや地域のresilienceに関心を広げ、セルビア・ベオグラードの現代美術館、および能登半島地震以後の地域社会を対象にフィールドワークを行っています。理論と展示実践を往復しながら、キュレーションの人類学的転回を探っています。',
};

export const researchInterests: Bilingual[] = [
  { ja: '人類学', en: 'Anthropology' },
  { ja: '詩学', en: 'Poetics' },
  { ja: 'キュレーション', en: 'Curation' },
  { ja: '社会参加型アート', en: 'Socially Engaged Art' },
];

export interface CurrentResearchItem {
  title: Bilingual;
  description: string;
  period?: string;
  location?: string;
  status?: string;
  link?: { label: string; url: string };
}

export const currentResearch: CurrentResearchItem[] = [
  {
    title: { ja: 'キュレーションの人類学', en: 'Curatorial Anthropology' },
    description:
      'キュレーションを、作品選択・展示設計だけでなく、複数の知識・時間・主体を接続する実践として研究。',
    period: '2023–現在',
    status: '進行中',
  },
  {
    title: { ja: 'ケアと危機', en: 'Care and Crisis' },
    description:
      '災害・危機状況におけるcare、unpaid care、community resilience等を文化人類学的に研究。',
    period: '2024–現在',
    status: '進行中',
  },
  {
    title: { ja: 'セルビア・美術館研究', en: 'Serbia / Museum Research' },
    description:
      'セルビア・ベオグラードの現代美術館および文化機関を対象としたフィールドワーク。',
    period: '2024',
    location: 'Belgrade, Serbia',
    status: 'フィールドワーク実施',
  },
  {
    title: { ja: '能登・災害研究', en: 'Noto / Disaster Research' },
    description:
      '能登半島地震以後の地域社会、ケア、文化実践、祭礼等を対象とした調査。',
    period: '2024–現在',
    location: 'Noto, Ishikawa',
    status: '進行中',
  },
];

export interface PeerReviewedPublication {
  year: number;
  titleJa: string;
  titleEn?: string | null;
  authors: string[];
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  peerReviewed: boolean;
  firstAuthor?: boolean;
  abstract?: string | null;
  url?: string | null;
  doi?: string | null;
  pdf?: string | null;
}

export const publicationsPeerReviewed: PeerReviewedPublication[] = [
  {
    year: 2023,
    titleJa:
      'SNSが書き換えた想像と信頼 : 半透明なエクリチュールが〈多〉−接続詞化させた「曖昧さ」について',
    titleEn: null,
    authors: ['小川楽生'],
    journal: 'Keio SFC journal',
    volume: '22',
    issue: '2',
    pages: '348–376',
    peerReviewed: true,
    firstAuthor: true,
    url: 'https://koara.lib.keio.ac.jp/xoonips/modules/xoonips/detail.php?koara_id=AA11671240-00220002-0348',
    doi: null,
    pdf: 'https://koara.lib.keio.ac.jp/xoonips/modules/xoonips/download.php/AA11671240-00220002-0348.pdf?file_id=173333',
  },
];

export interface MiscPublication {
  year: number;
  titleJa: string;
  publication: string;
  date?: string;
  abstract?: string | null;
  url?: string | null;
  pdf?: string | null;
}

export const publicationsMisc: MiscPublication[] = [
  {
    year: 2023,
    titleJa:
      '現代的映像の温度：後編 ジャン・ルーシュの『共有された人類学』から辿り直す',
    publication: 'prepar.art',
    date: '2023-09-19',
  },
  {
    year: 2023,
    titleJa:
      '現代的映像の温度：前編 断片的な映像から捉え返す、根拠のない信頼。映像人類学ワークショップから',
    publication: 'prepar.art',
    date: '2023-09-04',
  },
  {
    year: 2023,
    titleJa:
      '可能なことをつなぎ止めて、ともに覚悟を共有するアーティスト・ラン・レジデンス『6okken』 その定例ミーティングから。',
    publication: 'prepar.art',
    date: '2023-08-01',
  },
];

export interface Presentation {
  year: number;
  title: Bilingual;
  date?: string;
  institution?: string;
  event?: string;
  type?:
    | 'invited talk'
    | 'conference presentation'
    | 'workshop'
    | 'symposium'
    | 'lecture'
    | 'panel';
  abstract?: string | null;
  url?: string | null;
  doi?: string | null;
  pdf?: string | null;
}

export const presentations: Presentation[] = [
  {
    year: 2026,
    title: {
      ja: '多時間スケール型ケア・災害研究の超学際的構想',
      en: 'Trans-disciplinary Concept of Multi-temporal Scale Care Research',
    },
    institution: '明治大学',
    date: '2026-08-29',
  },
  {
    year: 2025,
    title: { ja: '展示でフィールドワークする2025 スリランカ編' },
    institution: '東京外国語大学 アジア・アフリカ言語文化研究所',
    date: '2025-02-17',
  },
  {
    year: 2022,
    title: { ja: 'みなとメディアミュージアム2020→2021実践報告' },
    event: '環境芸術学会第23回大会「その土地の発酵と循環」',
    date: '2022-10-02',
  },
];

export interface Grant {
  periodLabel: string;
  title: string;
  org: string;
  program?: string;
  startDate?: string;
  endDate?: string;
  pi: string;
  description?: string;
  amount?: string;
  link?: string;
  doi?: string | null;
  pdf?: string | null;
}

export const grants: Grant[] = [
  {
    periodLabel: '2024–2025',
    title: 'キュレーションにおける非構造的キャプションの構築',
    org: '森泰吉郎記念研究振興基金',
    program: '2024年度研究者育成費',
    startDate: '2024-05',
    endDate: '2025-02',
    pi: '小川楽生',
  },
  {
    periodLabel: '2023–2024',
    title: 'キュレーションの文化人類学的転回における理論と実践',
    org: '森泰吉郎記念研究振興基金',
    program: '2023年度研究者育成費',
    startDate: '2023-05',
    endDate: '2024-02',
    pi: '小川楽生',
  },
  {
    periodLabel: '2023–2024',
    title:
      '文化人類学的デザインを枠組みとした現代アートの展示設計実践: Artists-Run-Residence「6okken」との参加型リサーチを通じて',
    org: '慶應SFC学会研究助成金',
    startDate: '2023-09',
    endDate: '2024-01',
    pi: '小川楽生',
  },
  {
    periodLabel: '2022–2023',
    title:
      'Rizhomant（小川楽生・太田遥月・山田響己）Exhibition 2022 ——曖昧さによって紛争を解決するために——',
    org: 'KEIO SFC ACADEMIC SOCIETY GRANTS for RESEARCH PROJECTS',
    program: '研究集会の開催',
    startDate: '2022-04',
    endDate: '2023-02',
    pi: '小川楽生',
  },
];

export interface Award {
  year: number;
  title: string;
  org: string;
  workTitle?: string;
  recipients?: string[];
  date?: string;
  abstract?: string | null;
  url?: string | null;
  pdf?: string | null;
}

export const awards: Award[] = [
  {
    year: 2024,
    title: 'Audience Award',
    org: 'Terrace Art Shonan Award 2024',
    workTitle: 'イマジナリー・ファミレス湘南辻堂 テラスモール湘南店',
    recipients: ['小川楽生', '永田一樹', '菊地晴'],
    date: '2024-07',
  },
  {
    year: 2024,
    title: 'biscuit gallery curator projects 採択事業',
    org: 'biscuit gallery',
    workTitle: '帰路にまざまざと知る',
    date: '2024-02',
  },
  {
    year: 2023,
    title: 'ギャラリー無量キュレーション公募2024 採択',
    org: 'ギャラリー無量',
    workTitle: 'おもはゆいふかみ',
    date: '2023-10',
  },
];

export interface Teaching {
  year: number;
  title: string;
  institution: string;
  period?: string;
  role?: string;
}

export const teaching: Teaching[] = [
  {
    year: 2025,
    title: '芸術の対話',
    institution: '慶應義塾大学',
    period: '2025-04 – 2025-07',
  },
];

export interface Experience {
  periodLabel: string;
  org: string;
  department?: string;
  role: string;
  startDate?: string;
  endDate?: string;
}

export const experience: Experience[] = [
  {
    periodLabel: '2022–現在',
    org: '6okken',
    department: 'R&D Department',
    role: 'Curator',
    startDate: '2022-05',
  },
  {
    periodLabel: '2022–現在',
    org: 'NEORT++',
    role: 'Curator',
    startDate: '2022-05',
  },
  {
    periodLabel: '2019–2022',
    org: 'みなとメディアミュージアム',
    role: 'Curator',
    startDate: '2019-04',
    endDate: '2022-04',
  },
];

export interface Education {
  periodLabel: string;
  institutionJa: string;
  institutionEn?: string;
  departmentJa?: string;
  departmentEn?: string;
  startDate?: string;
  endDate?: string;
}

export const education: Education[] = [
  {
    periodLabel: '2023–現在',
    institutionJa: '慶應義塾大学大学院 政策・メディア研究科',
    institutionEn: 'Graduate School of Media and Governance, Keio University',
  },
  {
    periodLabel: '2019–2023',
    institutionJa: '慶應義塾大学 総合政策学部',
    institutionEn: 'Faculty of Policy Management, Keio University',
  },
  {
    periodLabel: '2019–2020',
    institutionJa: '東京大学',
    departmentJa:
      'AMSEA 社会を指向する芸術のためのアートマネジメント育成事業 第3期生',
    startDate: '2019-06',
    endDate: '2020-02',
  },
];

export interface AcademicService {
  year: number;
  title: string;
  role: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}

export const academicService: AcademicService[] = [
  {
    year: 2023,
    title: '慶應義塾大学SFC芸術祭2023',
    role: '審査・評価',
    institution: '慶應義塾大学',
    startDate: '2023-07-01',
    endDate: '2023-07-02',
  },
];
