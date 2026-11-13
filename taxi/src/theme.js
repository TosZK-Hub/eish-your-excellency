/**
 * Taxi Rank Rush theme.
 * Swap this module and `assets/art/` together for a later "City Rush" reskin.
 * Strings, palette, and colour ids are the only theme surface the game reads.
 */

export const theme = {
  id: 'taxi-rank',
  title: 'Taxi Rank Rush',
  short: 'Rank Rush',
  subtitle: 'Pull the minibuses out. Match the queue.',
  vehicle: 'taxi',
  vehiclePlural: 'taxis',
  place: 'rank',
  bay: 'loading bay',
  vip: 'Gaartjie',
  coin: 'coin',
  dailyName: 'Rush Hour',
  footnote: 'A fictional rank. No real companies, no real routes.',
};

export const ink = '#3B2416';
export const INK = 0x3b2416;

export const palette = {
  ink: '#1C2430',
  inkSoft: '#5C6B7A',
  cream: '#FFFFFF',
  creamDeep: '#E7EEF5',
  ochre: '#FF8A1F',
  ochreDeep: '#D46500',
  ground: '#4E5968',
  groundDeep: '#3E4652',
  sky: '#B7DEF2',
  canopy: '#F4F7FB',
  good: '#3E9B4F',
  danger: '#E23D3D',
  white: '#F4F7FB',
};

/** Index order is the level-data colour id. Do not reorder. */
export const COLORS = [
  { id: 'red', name: 'Red', hex: '#E23D3D', emoji: '🟥' },
  { id: 'blue', name: 'Blue', hex: '#2F6FED', emoji: '🟦' },
  { id: 'yellow', name: 'Yellow', hex: '#F2C14E', emoji: '🟨' },
  { id: 'green', name: 'Green', hex: '#3E9B4F', emoji: '🟩' },
  { id: 'purple', name: 'Purple', hex: '#7A4E9A', emoji: '🟪' },
  { id: 'orange', name: 'Orange', hex: '#F07A2A', emoji: '🟧' },
  { id: 'teal', name: 'Teal', hex: '#1F8A84', emoji: '🩵' },
  { id: 'pink', name: 'Pink', hex: '#E56AA8', emoji: '🩷' },
];

export const SPARE_COLOR = 7;
export const DIR_NAME = ['up', 'right', 'down', 'left'];

export const DIR_EMOJI = ['⬆️', '➡️', '⬇️', '⬅️'];

export const LIVERIES = [
  { id: 'plain', name: 'Rank plain', price: 0, blurb: 'White combi, one stripe.' },
  { id: 'stripes', name: 'Extra stripes', price: 20, blurb: 'Another band on the side.' },
  { id: 'chequers', name: 'Chequers', price: 50, blurb: 'A checked belt.' },
  { id: 'stars', name: 'Stars', price: 90, blurb: 'Little stars on the panel.' },
  { id: 'zigzag', name: 'Zigzag', price: 140, blurb: 'A lightning stripe.' },
  { id: 'flowers', name: 'Flowers', price: 180, blurb: 'Blooms along the roof.' },
  { id: 'flames', name: 'Flames', price: 220, blurb: 'Hot rods for the rank.' },
];

export const COPY = {
  play: 'Play',
  levels: 'Levels',
  daily: 'Rush Hour',
  shop: 'Liveries',
  back: 'Back',
  next: 'Next',
  retry: 'Try again',
  map: 'Level map',
  share: 'Share',
  copied: 'Copied',
  watch: 'Watch',
  notNow: 'Not now',
  equip: 'Equip',
  equipped: 'Equipped',
  buy: 'Buy',
  locked: 'Locked',
  hoot: 'Hoot!',
  brake: 'Brake off',
  win: 'Rank cleared!',
  winDaily: 'Rush Hour cleared!',
  loseFull: 'The bays are full',
  loseJam: 'The rank is jammed',
  loseHint: 'No stress. Line them up another way.',
  adTitle: 'Watch a short ad?',
  adBody: 'Placeholder only. No real advert plays.',
  adWatching: 'Watching…',
  extraBay: 'Extra bay',
  undo: 'Undo',
  shuffle: 'Shuffle',
  queue: 'Queue',
  moves: 'Moves',
  par: 'Par',
  coins: 'Coins',
  youHave: 'You have',
  streak: 'Streak',
  dailyLead: 'One puzzle for everyone, seeded by today\'s date.',
  dailyDone: 'You already cleared today. Share the grid, or play it again for fun.',
  spareIntro: 'A spare combi has no queue. Park one and it sits in the bay.',
  gaartjieIntro: 'The gaartjie jumps the queue onto the first taxi of their colour.',
  hiddenIntro: 'A tarp hides the colour until a neighbour leaves, or you tap it.',
  lockIntro: 'Hand brake on. Tap once to release, again to drive.',
  how1: 'Tap a taxi. If the lane to the edge is clear, it pulls into a bay.',
  how2: 'Passengers board a matching colour. Full taxis leave. Wrong lane? It hoots.',
};

export const LEVEL_NAMES = [
  'First in line', 'After you', 'Three colours', 'Under the tarp', 'Side step',
  'Bay lesson', 'Peek', 'Hand brake', 'Double tap', 'Short hold',
  'Morning rank', 'Gaartjie says', 'Jump the line', 'Whistle', 'Two brakes',
  'Tarp and brake', 'Colour mix', 'Spare key', 'Leave the grey', 'Hold two',
  'VIP hop', 'Hidden row', 'Spare me', 'All three', 'Ochre hour',
  'Canopy', 'Queue hop', 'Tight corner', 'Second brake', 'Gaartjie again',
  'Deep tarp', 'Full dots', 'Sticky pedal', 'Two spares', 'Almost full',
  'Whistle wind', 'Geometry', 'Lock step', 'Friday feeling', 'No spare seat',
  'Long queue', 'Jump twice', 'Side mirror', 'Double lock', 'Grey pair',
  'Five colours', 'Patience', 'VIP tarp', 'Last brake', 'Golden hour',
  'Big rank', 'Hidden pair', 'Now now', 'Final whistle', 'Hand brake two',
  'Sharp left', 'Spare corner', 'Nearly home', 'One more hoot', 'Rank champion',
];

export const LEVEL_INTROS = {
  1: COPY.how1,
  2: COPY.how2,
  4: COPY.hiddenIntro,
  8: COPY.lockIntro,
  12: COPY.gaartjieIntro,
  18: COPY.spareIntro,
};

export const SIGNS = [
  { id: 'town', label: 'Town' },
  { id: 'local', label: 'Local' },
  { id: 'rank', label: 'To the rank' },
  { id: 'thumb', label: 'Thumb' },
  { id: 'peace', label: 'Peace' },
  { id: 'fist', label: 'Fist' },
  { id: 'point', label: 'Point' },
  { id: 'wave', label: 'Wave' },
];

export const CB_HEX = ['#0072B2', '#E69F00', '#F0E442', '#009E73', '#56B4E9', '#D55E00', '#111111', '#CC79A7'];

export function colorHex(index, colorblind) {
  const hex = colorblind ? (CB_HEX[index] || CB_HEX[0]) : (COLORS[index] || COLORS[0]).hex;
  return Number.parseInt(hex.slice(1), 16);
}

export const REGIONS = [
  { id: 'durban', name: 'Durban', sky: '#B7DEF2', ground: '#4E5968', grass: '#7DBE6A' },
  { id: 'joburg', name: 'Joburg', sky: '#F0D7A0', ground: '#5A5348', grass: '#C2A15A' },
  { id: 'cape', name: 'Cape Town', sky: '#8EC6E6', ground: '#3D4A55', grass: '#3E9B6A' },
  { id: 'gqeberha', name: 'Gqeberha', sky: '#C5DFF0', ground: '#4A5560', grass: '#6AAA78' },
  { id: 'bloem', name: 'Bloemfontein', sky: '#F6E2B8', ground: '#6A5A48', grass: '#D2B56A' },
];

export const RANKS = [
  { id: 'dirt', name: 'Dirt lot', cost: 0 },
  { id: 'shelter', name: 'Shelter', cost: 40 },
  { id: 'stall', name: 'Food stall', cost: 90 },
  { id: 'mural', name: 'Mural wall', cost: 150 },
  { id: 'sound', name: 'Sound system', cost: 230 },
  { id: 'solar', name: 'Solar lights', cost: 330 },
  { id: 'roof', name: 'Roof', cost: 460 },
];

export const HORNS = [
  { id: 'hoot', name: 'Rank hoot', price: 0 },
  { id: 'sharp', name: 'Sharp', price: 40 },
  { id: 'low', name: 'Low note', price: 40 },
  { id: 'bell', name: 'Bell', price: 70 },
];

export const SHOUTS = ['Sharp!', 'Yebo!', 'Hau!', 'Lekker!'];

export function colorById(id) {
  return COLORS.find((c) => c.id === id) || COLORS[0];
}

export function hexNum(hex) {
  return Number.parseInt(hex.slice(1), 16);
}
