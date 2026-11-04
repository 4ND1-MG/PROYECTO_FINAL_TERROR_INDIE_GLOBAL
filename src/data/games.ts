import type { Language } from '@/i18n/translations';

export type HorrorGenre = 'Survival Horror' | 'Psicológico' | 'Retro/Lo-fi';

export type Tag = 'Gore' | 'Psicológico' | 'Pixel Art' | 'Sobrenatural' | 'Body Horror' | 'Found Footage' | 'Ethereal' | 'Cosmic Horror' | 'Stealth' | 'Puzzle' | 'Atmosférico' | 'Survival';

export interface Game {
  id: string;
  title: string;
  developer: string;
  cover: string;
  banner: string;
  description: string;
  genre: HorrorGenre;
  tags: Tag[];
  rating: number;
  ageRating: '+18' | '+16';
  featured?: boolean;
  releaseDate: string;
  localized: Record<'en' | 'ja', GameText>;
}

export interface GameText {
  title: string;
  description: string;
}

export const games: Game[] = [
  {
    id: 'hollow-veil',
    title: 'Hollow Veil',
    developer: 'Bleeding Pixel Studio',
    cover: 'https://images.pexels.com/photos/5427202/pexels-photo-5427202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/14648586/pexels-photo-14648586.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Despiertas en un pueblo donde los recuerdos se pudren más rápido que los cuerpos. Cada sombra recuerda algo que olvidaste.',
    genre: 'Psicológico',
    tags: ['Psicológico', 'Atmosférico', 'Stealth'],
    rating: 4.8,
    ageRating: '+18',
    featured: true,
    releaseDate: '2026-10-31',
    localized: {
      en: { title: 'Hollow Veil', description: 'You wake up in a town where memories rot faster than bodies. Every shadow remembers something you forgot.' },
      ja: { title: '虚ろなヴェール', description: '目覚めたのは、記憶が身体より速く朽ちていく町。どの影も、あなたが忘れた何かを覚えている。' },
    },
  },
  {
    id: 'last-ward',
    title: 'Last Ward',
    developer: 'Mortis Interactive',
    cover: 'https://images.pexels.com/photos/14198670/pexels-photo-14198670.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/6671106/pexels-photo-6671106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'El hospital cerró hace 40 años, pero los pacientes nunca se fueron. Solo tú puedes escucharlos ahora.',
    genre: 'Survival Horror',
    tags: ['Gore', 'Sobrenatural', 'Survival'],
    rating: 4.6,
    ageRating: '+18',
    releaseDate: '2026-09-12',
    localized: {
      en: { title: 'Last Ward', description: 'The hospital closed 40 years ago, but the patients never left. Only you can hear them now.' },
      ja: { title: '最後の病棟', description: '病院は40年前に閉鎖されたが、患者たちは一度も去らなかった。今、彼らの声が聞こえるのはあなただけだ。' },
    },
  },
  {
    id: 'the-quiet-room',
    title: 'The Quiet Room',
    developer: 'Nightmare Forge',
    cover: 'https://images.pexels.com/photos/40455058/pexels-photo-40455058.png?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/18634896/pexels-photo-18634896.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Una habitación. Una silla. Algo que no debería estar ahí. Tu mente es la única salida, y también la trampa.',
    genre: 'Psicológico',
    tags: ['Psicológico', 'Puzzle', 'Atmosférico'],
    rating: 4.9,
    ageRating: '+18',
    releaseDate: '2026-08-03',
    localized: {
      en: { title: 'The Quiet Room', description: 'One room. One chair. Something that should not be there. Your mind is the only way out, and the trap.' },
      ja: { title: '静かな部屋', description: '一つの部屋。一脚の椅子。そこにあるはずのない何か。出口はあなたの心だけ、そしてそれこそが罠だ。' },
    },
  },
  {
    id: 'signal-lost',
    title: 'Signal Lost',
    developer: 'Static Dreams',
    cover: 'https://images.pexels.com/photos/35659067/pexels-photo-35659067.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/6151406/pexels-photo-6151406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Grabas todo. Esa es tu maldición. Lo que encuentras en la cinta número 47 no debería existir.',
    genre: 'Retro/Lo-fi',
    tags: ['Found Footage', 'Pixel Art', 'Cosmic Horror'],
    rating: 4.5,
    ageRating: '+16',
    releaseDate: '2026-07-19',
    localized: {
      en: { title: 'Signal Lost', description: 'You record everything. That is your curse. What you find on tape number 47 should not exist.' },
      ja: { title: '途絶した信号', description: '何もかも録画してしまう。それがあなたの呪いだ。47番のテープに映っているものは、存在するはずがない。' },
    },
  },
  {
    id: 'marrow-hollow',
    title: 'Marrow Hollow',
    developer: 'Carrion Games',
    cover: 'https://images.pexels.com/photos/33835878/pexels-photo-33835878.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/6582560/pexels-photo-6582560.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'La muñeca en el rincón te pidió ayuda. Ahora tu cuerpo empieza a cambiar para parecerse a ella.',
    genre: 'Survival Horror',
    tags: ['Body Horror', 'Gore', 'Sobrenatural'],
    rating: 4.7,
    ageRating: '+18',
    releaseDate: '2026-06-28',
    localized: {
      en: { title: 'Marrow Hollow', description: 'The doll in the corner asked you for help. Now your body begins to change to look like hers.' },
      ja: { title: '髄の空洞', description: '隅の人形はあなたに助けを求めた。今、あなたの身体が彼女に似ていくように変わり始めている。' },
    },
  },
  {
    id: 'pale-harvest',
    title: 'Pale Harvest',
    developer: 'Ossuary Works',
    cover: 'https://images.pexels.com/photos/20875511/pexels-photo-20875511.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/9970896/pexels-photo-9970896.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Cosecha lo que el bosque te debe. Cuidado con lo que la cosecha pide a cambio.',
    genre: 'Retro/Lo-fi',
    tags: ['Pixel Art', 'Atmosférico', 'Survival'],
    rating: 4.4,
    ageRating: '+16',
    releaseDate: '2026-05-15',
    localized: {
      en: { title: 'Pale Harvest', description: 'Harvest what the forest owes you. Beware of what the harvest demands in return.' },
      ja: { title: '蒼白な収穫', description: '森があなたに借りているものを刈り取れ。その収穫が何を代償に求めるかに気をつけろ。' },
    },
  },
  {
    id: 'under-the-floor',
    title: 'Under The Floor',
    developer: 'Tenebrae Lab',
    cover: 'https://images.pexels.com/photos/7383258/pexels-photo-7383258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/6227194/pexels-photo-6227194.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Los ruidos comenzaron la semana que enterraste a tu hermano. No los hagas caso. No contestes.',
    genre: 'Psicológico',
    tags: ['Psicológico', 'Ethereal', 'Atmosférico'],
    rating: 4.6,
    ageRating: '+18',
    releaseDate: '2026-04-22',
    localized: {
      en: { title: 'Under The Floor', description: 'The noises started the week you buried your brother. Do not pay attention. Do not answer.' },
      ja: { title: '床下', description: '兄を埋葬した週から物音が始まった。気にしてはいけない。応えてもいけない。' },
    },
  },
  {
    id: 'attic-light',
    title: 'Attic Light',
    developer: 'Hollow Echo',
    cover: 'https://images.pexels.com/photos/8489903/pexels-photo-8489903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/6582560/pexels-photo-6582560.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Subes al ático por la luz que se enciende sola. Bajas con algo que ya no eres tú.',
    genre: 'Survival Horror',
    tags: ['Sobrenatural', 'Stealth', 'Gore'],
    rating: 4.3,
    ageRating: '+18',
    releaseDate: '2026-03-30',
    localized: {
      en: { title: 'Attic Light', description: 'You climb to the attic for the light that turns itself on. You come down with something that is no longer you.' },
      ja: { title: '屋根裏の光', description: '勝手に灯る光に導かれて屋根裏へ上がる。降りてくるのは、もうあなたではない何かだ。' },
    },
  },
  {
    id: 'dollhouse-protocol',
    title: 'Dollhouse Protocol',
    developer: 'Viscera Digital',
    cover: 'https://images.pexels.com/photos/38787225/pexels-photo-38787225.png?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/6671106/pexels-photo-6671106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'La casa de muñecas replica tu hogar. Cada noche que duermes, una pieza nueva aparece dentro.',
    genre: 'Retro/Lo-fi',
    tags: ['Pixel Art', 'Cosmic Horror', 'Puzzle'],
    rating: 4.8,
    ageRating: '+18',
    releaseDate: '2026-02-14',
    localized: {
      en: { title: 'Dollhouse Protocol', description: 'The dollhouse replicates your home. Every night you sleep, a new piece appears inside.' },
      ja: { title: 'ドールハウス・プロトコル', description: 'そのドールハウスは、あなたの家を忠実に再現する。眠るたびに、中に新しい部品が現れる。' },
    },
  },
  {
    id: 'salt-lantern',
    title: 'Linterna de Sal',
    developer: 'Brinehollow Games',
    cover: 'https://images.pexels.com/photos/9723176/pexels-photo-9723176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/12399616/pexels-photo-12399616.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'El faro se apag\u00f3 la noche de la tormenta. Ahora la niebla trae voces que llaman tu nombre desde el mar.',
    genre: 'Survival Horror',
    tags: ['Atmosf\u00e9rico', 'Sobrenatural', 'Survival'],
    rating: 4.5,
    ageRating: '+18',
    releaseDate: '2026-10-10',
    localized: {
      en: { title: 'Salt Lantern', description: 'The lighthouse went dark on the night of the storm. Now the fog carries voices calling your name from the sea.' },
      ja: { title: '\u5869\u306e\u706f\u53f0', description: '\u5d50\u306e\u591c\u3001\u706f\u53f0\u306e\u5149\u304c\u6d88\u3048\u305f\u3002\u4eca\u3001\u9727\u306f\u6d77\u306e\u5411\u3053\u3046\u304b\u3089\u3042\u306a\u305f\u306e\u540d\u3092\u547c\u3076\u58f0\u3092\u904b\u3093\u3067\u304f\u308b\u3002' },
    },
  },
  {
    id: 'choir-of-ash',
    title: 'Coro de Ceniza',
    developer: 'Vesper Chapel',
    cover: 'https://images.pexels.com/photos/39982988/pexels-photo-39982988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/20848264/pexels-photo-20848264.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Cada domingo el coro canta una nota m\u00e1s alta. Nadie en el pueblo recuerda qui\u00e9n dej\u00f3 de cantar.',
    genre: 'Psicol\u00f3gico',
    tags: ['Ethereal', 'Sobrenatural', 'Atmosf\u00e9rico'],
    rating: 4.2,
    ageRating: '+16',
    releaseDate: '2026-09-27',
    localized: {
      en: { title: 'Choir of Ash', description: 'Every Sunday the choir sings one note higher. No one in the village remembers who stopped singing.' },
      ja: { title: '\u7070\u306e\u8056\u6b4c\u968a', description: '\u65e5\u66dc\u3054\u3068\u306b\u8056\u6b4c\u968a\u306f\u4e00\u97f3\u305a\u3064\u9ad8\u304f\u6b4c\u3046\u3002\u8ab0\u304c\u6b4c\u3046\u306e\u3092\u3084\u3081\u305f\u306e\u304b\u3001\u6751\u306e\u8ab0\u3082\u899a\u3048\u3066\u3044\u306a\u3044\u3002' },
    },
  },
  {
    id: 'rewind-night',
    title: 'Rebobinar',
    developer: 'Tape Cartel Studio',
    cover: 'https://images.pexels.com/photos/9227548/pexels-photo-9227548.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/7193887/pexels-photo-7193887.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Trabajas en un videoclub que cierra a medianoche. Una cinta sin etiqueta se reproduce sola, y siempre empieza con tu voz.',
    genre: 'Retro/Lo-fi',
    tags: ['Found Footage', 'Pixel Art', 'Psicol\u00f3gico'],
    rating: 4.1,
    ageRating: '+18',
    releaseDate: '2026-08-21',
    localized: {
      en: { title: 'Rewind Night', description: 'You work the night shift at a video rental store. An unlabeled tape plays by itself, and it always starts with your voice.' },
      ja: { title: '\u5dfb\u304d\u623b\u3057\u306e\u591c', description: '\u6df1\u591c\u306e\u30ec\u30f3\u30bf\u30eb\u30d3\u30c7\u30aa\u5e97\u3067\u30d0\u30a4\u30c8\u3092\u3057\u3066\u3044\u308b\u3002\u30e9\u30d9\u30eb\u306e\u306a\u3044\u30c6\u30fc\u30d7\u304c\u3072\u3068\u308a\u3067\u306b\u518d\u751f\u3055\u308c\u3001\u3044\u3064\u3082\u3042\u306a\u305f\u306e\u58f0\u304b\u3089\u59cb\u307e\u308b\u3002' },
    },
  },
  {
    id: 'red-sand-crawl',
    title: 'Arrastre de Arena Roja',
    developer: 'Dune Marrow',
    cover: 'https://images.pexels.com/photos/40216737/pexels-photo-40216737.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/18018664/pexels-photo-18018664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Las ruinas del desierto no est\u00e1n vac\u00edas. Lo que vive bajo la arena ha aprendido a imitar a tus compa\u00f1eros.',
    genre: 'Survival Horror',
    tags: ['Gore', 'Body Horror', 'Survival'],
    rating: 4.4,
    ageRating: '+18',
    releaseDate: '2026-11-01',
    localized: {
      en: { title: 'Red Sand Crawl', description: 'The desert ruins are not empty. What lives beneath the sand has learned to mimic your companions.' },
      ja: { title: '\u8d64\u7802\u306e\u9019\u3044\u9053', description: '\u7802\u6f20\u306e\u9057\u8de1\u306f\u7a7a\u3063\u307d\u3067\u306f\u306a\u3044\u3002\u7802\u306e\u4e0b\u306b\u6f5c\u3080\u3082\u306e\u306f\u3001\u4ef2\u9593\u306e\u59ff\u3092\u771f\u4f3c\u308b\u8853\u3092\u899a\u3048\u305f\u3002' },
    },
  },
];

export const featuredGame = games.find((g) => g.featured) ?? games[0];

export function getGameText(game: Game, language: Language): GameText {
  return language === 'es' ? game : game.localized[language];
}
