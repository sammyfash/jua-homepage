export type Outcome = { name: string; pct: number };

export type ArtKind = 'ng' | 'ke' | 'ke-podium' | 'nairobi' | 'lagos' | 'niger' | 'ipo' | 'btc' | 'football' | 'globe' | 'atom';

export type Market = {
  id: string;
  title: string;
  /** Short label for compact places (carousel, tiles). */
  short: string;
  img: string;
  art: ArtKind;
  cat: string;
  tags: string[];
  /** Lifetime volume in KES. */
  vol: number;
  closes: string;
  outcomes: Outcome[];
  /** Outcomes not listed in `outcomes`. */
  extra?: number;
};

const IMG = 'https://tlborelytahqfliaejrc.supabase.co/storage/v1/object/public/market-images/';
const mk = (id: string) => `${IMG}markets/${id}/cover.webp`;

export type Category = { label: string; icon: string };

export const CATEGORIES: Category[] = [
  { label: 'Trending', icon: 'trending' },
  { label: 'Kenya Elections 2027', icon: 'flag-ke' },
  { label: 'Nigeria Elections 2027', icon: 'flag-ng' },
  { label: 'Global politics and sports', icon: 'globe' },
  { label: 'Politics', icon: 'ballot' },
  { label: 'Sports', icon: 'ball' },
  { label: 'Crypto', icon: 'coin' },
  { label: 'Geopolitics', icon: 'compass' },
  { label: 'Tech', icon: 'chip' },
  { label: 'Culture', icon: 'spark' },
  { label: 'General', icon: 'grid' },
];

export const MARKETS: Market[] = [
  { id: 'nig', title: 'Nigeria presidential election winner', short: 'Nigeria presidential winner', art: 'ng', img: mk('c54d2d9f-86c9-4316-a566-ac88434069f0'), cat: 'Politics', tags: ['Nigeria Elections 2027', 'Politics'], vol: 448500, closes: '3 months', outcomes: [{ name: 'Bola Tinubu', pct: 40 }, { name: 'Peter Obi', pct: 27 }, { name: 'Atiku Abubakar', pct: 23 }, { name: 'Sowore Omoyele', pct: 10 }] },
  { id: 'ruto', title: 'Will Ruto win 2027 presidential election', short: 'Ruto wins in 2027?', art: 'ke', img: mk('2ced564b-0d8b-4c2d-8dfb-046bdfc93146'), cat: 'Politics', tags: ['Kenya Elections 2027', 'Politics'], vol: 651200, closes: '10 months', outcomes: [{ name: 'Yes', pct: 54 }] },
  { id: 'anth', title: 'Anthropic will IPO by ?', short: 'Anthropic IPO date', art: 'ipo', img: `${IMG}event-proposals/a6b06648-e340-475b-83a2-fa661e9fbd39/cover.webp`, cat: 'Tech', tags: ['Tech', 'General'], vol: 11700000, closes: '2 months', outcomes: [{ name: 'Mar 31, 2027', pct: 62 }, { name: 'Dec 31, 2026', pct: 50 }, { name: 'Nov 30, 2026', pct: 50 }], extra: 2 },
  { id: 'niger', title: 'Niger, Nigeria Governor Election Winner', short: 'Niger State governor', art: 'niger', img: mk('c31244f4-6348-4764-8c48-e3b691c64a09'), cat: 'Politics', tags: ['Nigeria Elections 2027', 'Politics'], vol: 130000, closes: '4 months', outcomes: [{ name: 'Muhammed Umaru Bago', pct: 80 }, { name: 'Muhammed Kpautagi', pct: 11 }, { name: 'Abubakar Suleiman', pct: 9 }] },
  { id: 'btc', title: 'Will Bitcoin price hit $120K before 31 December 2026', short: 'Bitcoin $120K by year end?', art: 'btc', img: mk('debad25a-6691-4d52-aaf2-beec0fe87ec3'), cat: 'Crypto', tags: ['Crypto', 'General'], vol: 156100, closes: '2 months', outcomes: [{ name: 'Yes', pct: 48 }] },
  { id: 'lagos', title: 'Lagos, Nigeria Governor Election Winner', short: 'Lagos governor', art: 'lagos', img: mk('273fb467-f539-4760-8455-536470e1940e'), cat: 'Politics', tags: ['Nigeria Elections 2027', 'Politics'], vol: 543000, closes: '4 months', outcomes: [{ name: 'Obefami Hamzat', pct: 81 }, { name: 'Adedeji Doherty', pct: 5 }], extra: 5 },
  { id: 'sif', title: 'Will Edwin Sifuna be a presidential candidate in Kenya 2027 election', short: 'Sifuna runs for president?', art: 'ke-podium', img: mk('f3cb7f5d-d159-4410-92db-fba0a5f200ee'), cat: 'Politics', tags: ['Kenya Elections 2027', 'Politics'], vol: 261300, closes: '7 months', outcomes: [{ name: 'Yes', pct: 64 }] },
  { id: 'gach', title: 'Will Gachagua be a presidential candidate in the Kenya 2027 elections?', short: 'Gachagua runs for president?', art: 'ke-podium', img: mk('9588e547-99c9-44e7-a4b5-d311288d8fc1'), cat: 'Politics', tags: ['Kenya Elections 2027', 'Politics'], vol: 143000, closes: '7 months', outcomes: [{ name: 'Yes', pct: 47 }] },
  { id: 'epl', title: 'EPL 2027 Champion', short: 'EPL 2027 champion', art: 'football', img: mk('9449dd00-9f82-4ca5-8bbe-45b1430ba49a'), cat: 'Sports', tags: ['Global politics and sports', 'Sports', 'Culture'], vol: 104100, closes: '7 months', outcomes: [{ name: 'Arsenal', pct: 35 }, { name: 'Manchester City', pct: 29 }], extra: 8 },
  { id: 'nbo', title: 'Who will be the next Nairobi governor', short: 'Next Nairobi governor', art: 'nairobi', img: mk('d69fc95d-83c3-4f6f-94ba-728ffd8c3121'), cat: 'Politics', tags: ['Kenya Elections 2027', 'Politics'], vol: 85800, closes: '10 months', outcomes: [{ name: 'Babu Owino', pct: 40 }, { name: 'Ronald Karauri', pct: 35 }], extra: 1 },
  { id: 'mat', title: "Will Matiang'i be a presidential candidate in 2027 elections?", short: "Matiang'i runs for president?", art: 'ke-podium', img: mk('dab54899-fcd8-44ff-8d4e-b444758c87ae'), cat: 'Politics', tags: ['Kenya Elections 2027', 'Politics'], vol: 111800, closes: '7 months', outcomes: [{ name: 'Yes', pct: 50 }] },
  { id: 'iran', title: 'Will the U.S. invade Iran before 2027?', short: 'U.S. invades Iran before 2027?', art: 'globe', img: mk('5aa5ff4f-bf0a-4040-afff-9b8bdd7ae023'), cat: 'Geopolitics', tags: ['Global politics and sports', 'Geopolitics', 'General'], vol: 104000, closes: '2 months', outcomes: [{ name: 'Yes', pct: 40 }] },
  { id: 'rus', title: 'Will Russia detonate a nuclear device in 2026?', short: 'Russian nuclear test in 2026?', art: 'atom', img: mk('91518318-4fed-4e68-b60a-7868dc68adaa'), cat: 'Geopolitics', tags: ['Global politics and sports', 'Geopolitics', 'General'], vol: 85800, closes: '2 months', outcomes: [{ name: 'Yes', pct: 50 }] },
];

/** Markets cycled by the hero carousel, in order. */
export const FEATURED_IDS = ['ruto', 'nig', 'btc', 'anth', 'lagos'];

/** Chart style per featured slide, so consecutive slides look different. */
export const FEATURED_KINDS = ['area', 'line', 'area', 'step', 'line'] as const;

/** [name, lifetime volume in KES, art] */
export const HOT_TOPICS: [string, number, ArtKind][] = [
  ['Anthropic will IPO by ?', 23400000, 'ipo'],
  ['Kenya Elections 2027', 2500000, 'ke'],
  ['Nigeria Elections 2027', 1600000, 'ng'],
  ['Crypto, Finance & Economics', 1000000, 'btc'],
  ['Crypto', 839100, 'atom'],
  ['Global politics and sports', 372100, 'globe'],
];

/** Outcome colours on the hero stage, by index. Tokens, so they suit the light and the dark stage. */
export const STAGE_COLORS = ['var(--s0)', 'var(--s1)', 'var(--s2)', 'var(--s3)'];

/** Outcome colours on page surfaces, by index. Theme tokens so they flip with light/dark. */
export const SERIES_COLORS = ['var(--gold-ink)', 'var(--lilac-ink)', 'var(--ink3)', 'var(--mint)'];

/** Carousel dwell time per slide, in ms. Kept in sync with the progress bar animation. */
export const SLIDE_MS = 8000;

export const FAQ: [string, string][] = [
  ['What is a prediction market?', 'A place to buy and sell shares in the outcome of a real event. Each share pays out KSh 130 (1 USDC) if that outcome happens and nothing if it does not, so its price shows how likely people think it is.'],
  ['What does "54% chance" mean?', 'Yes shares are trading at 54% of their payout. Put simply, the people trading this market think it is a little more likely to happen than not. The number moves as people buy and sell.'],
  ['How much do I need to start?', 'You can buy from as little as KSh 1. New predictors may also get KSh 50.00 of free credit when they sign up.'],
  ['Can I get out before the result?', 'Yes. You can sell your shares at the current price any time before the market closes, to lock in a profit or cut a loss.'],
  ['Who decides the result?', 'Every market lists its resolution source up front, such as the official electoral body or an exchange price. When the result is confirmed, correct shares are paid automatically.'],
];

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=160`;

/**
 * Candidate portraits from Wikimedia Commons, keyed by outcome name. Only people whose
 * identity we could match with confidence are listed; everyone else keeps their initials.
 * Licences are on each file's Commons page; credit is shown in the footer.
 */
export const PEOPLE: Record<string, { photo: string; credit: string }> = {
  'Bola Tinubu': { photo: commons('Bola Tinubu portrait (cropped).jpg'), credit: 'Nosa Asemota, CC BY-SA 4.0' },
  'Peter Obi': { photo: commons('Peter Obi 2022.jpg'), credit: 'Voice of America, public domain' },
  'Atiku Abubakar': { photo: commons('Atiku Abubakar-2010 (cropped).jpg'), credit: 'Atiku Abubakar on Flickr, CC BY 2.0' },
  'Sowore Omoyele': { photo: commons('Omoyele Sowore (29682338514).jpg'), credit: 'Wikimedia Commons (via Flickr)' },
  'Muhammed Umaru Bago': { photo: commons('UMARU-MOHAMMED-BAGO.jpg'), credit: 'Wikimedia Commons' },
  'Ronald Karauri': { photo: commons('Ronald Karauri.jpg'), credit: 'Wikimedia Commons' },
};
