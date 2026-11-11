// Illustrated Khaya Lane art.
//
// World scale. One tile is 256 source pixels wide (128 tall).
// Drawn size = source pixels × (tileWidth / 256) × scale.
// home_l1 is the ruler. Scale 1.22 makes that shack about 1.9 tiles wide,
// near the top of the 1.5–2 tile house band, so the home holds the yard.
// Door-to-roof is about 0.9 of its bitmap, and every person, animal and prop
// below is a fraction of that door. A person is 60% of the door. A hen is a
// shin (ankle to knee). A dog stands at the knee. A cow reaches a person's
// shoulder. Props sit at waist height. Acacia and marula canopies sit about
// as high as the roof. The jacaranda is the one hero tree, a little taller.
// Trees stand on the edges and the road, off the playable plot. The taxi is
// 1.2 tiles long.
var LOOK = {
  root: "assets/sprites/gen/",
  ext: ".webp",
  world: { tile: 256, house: "home_l1", houseScale: 1.22, houseTiles: 1.9, doorFraction: 0.9, person: 0.6 },
  // Foot pivot [x, y, baseWidth] measured from opaque pixels.
  // x,y are fractions of the bitmap. baseWidth is the ground diamond in pixels.
  // A fitted sprite maps that pivot onto the footprint's south corner and
  // scales baseWidth to the footprint's east-west span.
  pivot: {
    tile_grass: [0.498, 0.992, 256],
    tile_dirt: [0.498, 0.984, 252],
    bed_empty: [0.500, 0.994, 256],
    maize_sown: [0.498, 0.994, 256],
    maize_growing: [0.502, 0.995, 256],
    maize_ready: [0.502, 0.995, 256],
    morogo_sown: [0.500, 0.994, 256],
    morogo_growing: [0.502, 0.994, 256],
    morogo_ready: [0.498, 0.995, 256],
    morogo_ready_basket: [0.502, 0.995, 256],
    pumpkin_sown: [0.500, 0.995, 256],
    pumpkin_growing: [0.502, 0.995, 256],
    pumpkin_fruiting: [0.498, 0.995, 256],
    pumpkin_ready: [0.504, 0.995, 256],
    home_l1: [0.499, 0.994, 356],
    home_l2: [0.493, 0.896, 391],
    home_l3: [0.499, 0.993, 466],
    spaza: [0.506, 0.895, 406],
    workshop: [0.494, 0.882, 365],
    rain_tank: [0.498, 0.988, 240],
    solar_stand: [0.477, 0.998, 315],
    aloe: [0.503, 0.989, 155],
    washing_line: [0.520, 0.997, 270],
    wheelbarrow: [0.422, 0.995, 158],
    soccer_goal: [0.470, 0.953, 256],
    braai_drum: [0.491, 0.996, 215],
    potjie: [0.497, 0.915, 186],
    imbawula: [0.500, 0.990, 106],
    mielie_cart: [0.415, 0.997, 200],
    chicken_coop: [0.522, 0.949, 267],
    pumpkin_patch: [0.502, 0.995, 300],
    kraal: [0.513, 0.932, 396],
    taxi: [0.481, 0.997, 337],
    tree_jacaranda: [0.504, 0.979, 379],
    tree_acacia: [0.563, 0.998, 401],
    tree_marula: [0.543, 0.991, 363],
    neighbour_ndebele: [0.639, 0.994, 369],
    neighbour_mural: [0.499, 0.981, 343],
    neighbour_facebrick: [0.497, 0.991, 340],
    char_farmer: [0.485, 0.996, 136],
    animal_hen: [0.531, 0.990, 65],
    animal_dog: [0.351, 0.992, 83],
    animal_cow: [0.471, 0.994, 165],
    animal_goat: [0.510, 0.992, 102]
  },
  buildings: {
    home: { fit: 1, shadow: [1.12, 0.4], scale: 1.22, yard: 1, levels: ["home_l1", "home_l2", "home_l3"] },
    bed: { fit: 1, scale: 1, file: "bed_empty" },
    spaza: { fit: 1, shadow: [0.95, 0.36], scale: 0.9, yard: 1, levels: ["spaza", "spaza"] },
    tank: { fit: 1, shadow: [0.5, 0.2], scale: 0.85, file: "rain_tank" },
    workshop: { fit: 1, shadow: [0.9, 0.34], scale: 0.9, yard: 1, file: "workshop" },
    solar: { fit: 1, shadow: [0.62, 0.24], scale: 0.82, file: "solar_stand" },
    aloe_clump: { shadow: [0.36, 0.16], scale: 0.47, file: "aloe" },
    palisade: { shadow: [0.5, 0.2], scale: 0.7, file: "soccer_goal" },
    braai: { shadow: [0.42, 0.18], scale: 0.36, file: "braai_drum", smoke: "braai" },
    potjie: { shadow: [0.36, 0.16], scale: 0.5, file: "potjie", smoke: "steam" },
    imbawula: { shadow: [0.28, 0.14], scale: 0.5, file: "imbawula", smoke: "coal" },
    barrow: { shadow: [0.4, 0.16], scale: 0.5, file: "wheelbarrow" },
    mielie: { shadow: [0.46, 0.18], scale: 0.48, file: "mielie_cart", smoke: "braai" },
    wash: { shadow: [0.55, 0.2], scale: 0.72, file: "washing_line" },
    coop: { fit: 1, shadow: [0.6, 0.22], scale: 0.85, file: "chicken_coop" },
    patch: { fit: 1, shadow: [0.62, 0.24], scale: 0.9, file: "pumpkin_patch" },
    kraal: { fit: 1, shadow: [1.05, 0.38], scale: 1, yard: 1, file: "kraal" }
  },
  actors: {
    farmer: { file: "char_farmer", sheet: "char_farmer_anim", cells: 8, face: -1, scale: 0.71, shadow: [0.28, 0.12], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    doek: { file: "char_woman_doek", sheet: "char_doek_anim", cells: 8, face: -1, scale: 0.71, shadow: [0.28, 0.12], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    basotho: { file: "char_basotho_elder", sheet: "char_basotho_anim", cells: 8, face: -1, scale: 0.71, shadow: [0.28, 0.12], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    gogo: { file: "char_gogo", sheet: "char_gogo_anim", cells: 8, face: -1, scale: 0.71, shadow: [0.28, 0.12], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    kid: { file: "char_kid", sheet: "char_kid_anim", cells: 8, face: -1, scale: 0.68, shadow: [0.22, 0.1], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    jersey: { file: "char_man_jersey", sheet: "char_jersey_anim", cells: 8, face: -1, scale: 0.71, shadow: [0.28, 0.12], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    taxi: { file: "char_taxi_driver", sheet: "char_taxi_anim", cells: 8, face: -1, scale: 0.71, shadow: [0.28, 0.12], idle: [0, 1], walk: [2, 3, 4, 5], work: [6, 7] },
    hen: { file: "animal_hen", sheet: "animal_hen_anim", cells: 8, face: -1, scale: 0.42, shadow: [0.16, 0.08], idle: [0, 6], walk: [2, 3, 4, 5], work: [1, 0] },
    dog: { file: "animal_dog", sheet: "animal_dog_anim", cells: 8, face: -1, scale: 0.42, shadow: [0.2, 0.09], idle: [0, 1], walk: [2, 3, 4, 5] },
    cow: { file: "animal_cow", sheet: "animal_cow_anim", cells: 8, face: -1, scale: 0.88, shadow: [0.36, 0.14], idle: [0, 1], walk: [2, 3, 4, 5] },
    goat: { file: "animal_goat", sheet: "animal_goat_anim", cells: 8, face: -1, scale: 0.7, shadow: [0.24, 0.1], idle: [0, 1], walk: [2, 3, 4, 5] }
  },
  treeScale: { tree_jacaranda: 1.02, tree_acacia: 0.9, tree_marula: 0.84 },
  trees: ["tree_jacaranda", "tree_acacia", "tree_marula"],
  neighbours: ["neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"],
  // Yard props live on whole cells in KHAYA.PROPS. Horizon houses and trees
  // are drawn above the plot, not on these tiles.
  dress: [],
  // The tree cell at (8,8) stands just south of Thabo, so its canopy covers him.
  treeSkip: { "8,8": 1 },
  treeNudge: {
    "0,0": [-0.55, -0.55],
    "7,0": [0.35, -0.7],
    "15,0": [0.35, -0.4],
    "15,10": [0.3, 0.45]
  },
  treeAt: {
    "0,0": "tree_acacia",
    "7,0": "tree_marula",
    "15,0": "tree_acacia",
    "8,8": "tree_acacia",
    "15,10": "tree_marula"
  },
  // Cell centres. Consecutive points are neighbours, so the walk stays on free tiles.
  cast: [
    { id: "farmer", route: [[4.5, 2.5], [4.5, 3.5], [4.5, 4.5], [4.5, 5.5]], speed: 11000 },
    { id: "doek", route: [[7.5, 2.5], [7.5, 3.5], [7.5, 4.5], [7.5, 5.5]], speed: 11000 },
    { id: "jersey", route: [[5.5, 0.5], [6.5, 0.5], [6.5, 1.5], [5.5, 1.5]], speed: 8000 },
    { id: "gogo", route: [[0.5, 4.5], [0.5, 5.5]], speed: 13000 },
    { id: "kid", at: [0.5, 2.5] },
    { id: "basotho", route: [[2.5, 4.5], [2.5, 5.5]], speed: 15000 },
    { id: "taxi", route: [[3.5, 6.5], [4.5, 6.5]], speed: 10000 },
    { id: "hen", route: [[2.5, 0.5], [3.5, 0.5], [4.5, 0.5], [4.5, 1.5], [3.5, 1.5], [2.5, 1.5]], speed: 7200 },
    { id: "dog", route: [[6.5, 3.5], [6.5, 4.5]], speed: 6400 },
    { id: "cow", route: [[9.5, 6.5], [10.5, 6.5], [10.5, 7.5], [9.5, 7.5]], speed: 12000 },
    { id: "goat", route: [[9.5, 2.5], [10.5, 2.5], [10.5, 3.5], [9.5, 3.5]], speed: 8600 }
  ],
  lineup: ["home_l1", "taxi", "tree_jacaranda", "tree_acacia", "aloe", "char_farmer", "char_kid", "animal_hen", "animal_dog", "animal_cow", "braai_drum", "potjie", "wheelbarrow"],
  first: [
    "tile_grass", "tile_dirt", "home_l1", "home_l2", "home_l3", "bed_empty",
    "maize_sown", "maize_growing", "maize_ready",
    "morogo_sown", "morogo_growing", "morogo_ready_basket",
    "pumpkin_sown", "pumpkin_growing", "pumpkin_fruiting", "pumpkin_ready",
    "spaza", "workshop", "rain_tank", "solar_stand",
    "char_farmer", "char_farmer_anim", "animal_hen", "animal_hen_anim", "animal_dog", "animal_dog_anim",
    "tree_jacaranda", "tree_acacia", "tree_marula",
    "washing_line", "wheelbarrow", "taxi",
    "neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = LOOK;
