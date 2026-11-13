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
  ink: '#3B2416',
  inkSoft: '#5A3A28',
  cream: '#FFF6E4',
  creamDeep: '#F6E7C1',
  ochre: '#E6A23C',
  ochreDeep: '#C9842A',
  ground: '#E2C48A',
  groundDeep: '#C6A15A',
  sky: '#F6D7A8',
  canopy: '#F07A2A',
  good: '#3E9B4F',
  danger: '#E23D3D',
  white: '#FFFCFA',
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

export function colorById(id) {
  return COLORS.find((c) => c.id === id) || COLORS[0];
}

export function hexNum(hex) {
  return Number.parseInt(hex.slice(1), 16);
}
