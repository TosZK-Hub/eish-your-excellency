// Illustrated Khaya Lane art.
//
// World scale. One tile is 256 source pixels wide (128 tall).
// Drawn size = source pixels × (tileWidth / 256) × scale.
// home_l1 is the ruler. Scale 1.08 makes that shack about 1.7 tiles wide,
// inside the 1.5–2 tile house band. Door-to-roof is about 0.9 of its bitmap,
// and every person, animal and prop below is a fraction of that door.
// A person is 60% of the door. A hen is a shin (ankle to knee). A dog stands
// at the knee. A cow reaches a person's shoulder. Props sit at waist height.
// Trees are 1.15–1.5× the full house, jacaranda tallest. The taxi is 1.2 tiles long.
var LOOK = {
  root: "assets/sprites/gen/",
  ext: ".webp",
  world: { tile: 256, house: "home_l1", houseScale: 1.08, houseTiles: 1.7, doorFraction: 0.9, person: 0.6 },
  buildings: {
    home: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [1.05, 0.38], scale: 1.08, yard: 1, levels: ["home_l1", "home_l2", "home_l3"] },
    bed: { anchor: [0.5, 0.58], offset: [0, 0], shadow: [0.72, 0.28], scale: 1, file: "bed_empty" },
    spaza: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.95, 0.36], scale: 0.9, yard: 1, levels: ["spaza", "spaza"] },
    tank: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [0.5, 0.2], scale: 0.85, file: "rain_tank" },
    workshop: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.9, 0.34], scale: 0.9, yard: 1, file: "workshop" },
    solar: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.62, 0.24], scale: 0.82, file: "solar_stand" },
    aloe_clump: { anchor: [0.5, 0.7], offset: [0, 0], shadow: [0.36, 0.16], scale: 0.47, file: "aloe" },
    palisade: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.5, 0.2], scale: 0.7, file: "soccer_goal" },
    braai: { anchor: [0.5, 0.68], offset: [0, 0], shadow: [0.42, 0.18], scale: 0.36, file: "braai_drum", smoke: "braai" },
    potjie: { anchor: [0.5, 0.7], offset: [0, 0], shadow: [0.36, 0.16], scale: 0.5, file: "potjie", smoke: "steam" },
    imbawula: { anchor: [0.5, 0.72], offset: [0, 0], shadow: [0.28, 0.14], scale: 0.5, file: "imbawula", smoke: "coal" },
    barrow: { anchor: [0.5, 0.68], offset: [0, 0], shadow: [0.4, 0.16], scale: 0.5, file: "wheelbarrow" },
    mielie: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [0.46, 0.18], scale: 0.48, file: "mielie_cart", smoke: "braai" },
    wash: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.55, 0.2], scale: 0.72, file: "washing_line" },
    coop: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.6, 0.22], scale: 0.85, file: "chicken_coop" },
    patch: { anchor: [0.5, 0.6], offset: [0, 0], shadow: [0.62, 0.24], scale: 0.9, file: "pumpkin_patch" },
    kraal: { anchor: [0.5, 0.6], offset: [0, 0], shadow: [1.05, 0.38], scale: 1, yard: 1, file: "kraal" }
  },
  actors: {
    farmer: { file: "char_farmer", scale: 0.71, shadow: [0.28, 0.12] },
    doek: { file: "char_woman_doek", scale: 0.71, shadow: [0.28, 0.12] },
    basotho: { file: "char_basotho_elder", scale: 0.71, shadow: [0.28, 0.12] },
    gogo: { file: "char_gogo", scale: 0.71, shadow: [0.28, 0.12] },
    kid: { file: "char_kid", scale: 0.68, shadow: [0.22, 0.1] },
    jersey: { file: "char_man_jersey", scale: 0.71, shadow: [0.28, 0.12] },
    taxi: { file: "char_taxi_driver", scale: 0.71, shadow: [0.28, 0.12] },
    hen: { file: "animal_hen", scale: 0.42, shadow: [0.16, 0.08] },
    dog: { file: "animal_dog", scale: 0.42, shadow: [0.2, 0.09] },
    cow: { file: "animal_cow", scale: 0.88, shadow: [0.36, 0.14] },
    goat: { file: "animal_goat", scale: 0.7, shadow: [0.24, 0.1] }
  },
  treeScale: { tree_jacaranda: 1.17, tree_acacia: 0.96, tree_marula: 1.03 },
  trees: ["tree_jacaranda", "tree_acacia", "tree_marula"],
  neighbours: ["neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"],
  // Trees line the road and the plot edges. One jacaranda frames the house.
  dress: [
    { file: "taxi", x: 1.35, y: 6.35, scale: 0.85 },
    { file: "washing_line", x: 3.15, y: 1.25, scale: 0.72 },
    { file: "wheelbarrow", x: 3.35, y: 4.15, scale: 0.5 },
    { file: "soccer_goal", x: 10.7, y: 2.4, scale: 0.85 },
    { file: "tree_acacia", x: 3.25, y: 0.75, scale: 0.96 },
    { file: "tree_jacaranda", x: 0.45, y: 5.15, scale: 1.17 },
    { file: "tree_marula", x: 5.35, y: 6.85, scale: 1.03 },
    { file: "tree_acacia", x: 11.15, y: 0.85, scale: 0.96 },
    { file: "tree_acacia", x: 12.75, y: 4.15, scale: 0.92 },
    { file: "tree_marula", x: 11.2, y: 6.7, scale: 1.0 },
    { file: "tree_acacia", x: 1.2, y: 9.55, scale: 0.96 },
    { file: "tree_marula", x: 6.55, y: 8.35, scale: 1.0 },
    { file: "aloe", x: 2.4, y: 1.15, scale: 0.47 },
    { file: "neighbour_mural", x: 9.6, y: 6.55, scale: 0.78 },
    { file: "neighbour_facebrick", x: 2.5, y: 11.45, scale: 0.78 }
  ],
  treeAt: {
    "0,0": "tree_acacia",
    "7,0": "tree_marula",
    "15,0": "tree_acacia",
    "7,8": "tree_acacia",
    "15,10": "tree_marula"
  },
  cast: [
    { id: "farmer", route: [[2, 4], [3, 5], [2, 5], [1, 5]], speed: 9000 },
    { id: "doek", route: [[7, 3], [7, 4], [7, 2], [6, 1]], speed: 11000 },
    { id: "jersey", route: [[4, 5], [3, 6], [2, 6], [1, 6]], speed: 8000 },
    { id: "gogo", route: [[1, 4], [1, 5], [2, 5], [2, 4]], speed: 13000 },
    { id: "kid", near: "home" },
    { id: "basotho", route: [[2, 4], [3, 4], [3, 5], [2, 5]], speed: 15000 },
    { id: "taxi", route: [[1, 6], [2, 6], [2, 5], [1, 5]], speed: 10000 },
    { id: "hen", spot: [2.35, 4.55], wobble: 0.22 },
    { id: "dog", spot: [3.6, 5.4], wobble: 0.2 },
    { id: "cow", spot: [7.4, 5.5], wobble: 0.08 },
    { id: "goat", spot: [6.6, 3.3], wobble: 0.16 }
  ],
  lineup: ["home_l1", "taxi", "tree_jacaranda", "tree_acacia", "aloe", "char_farmer", "char_kid", "animal_hen", "animal_dog", "animal_cow", "braai_drum", "potjie", "wheelbarrow"],
  first: [
    "tile_grass", "tile_dirt", "home_l1", "home_l2", "home_l3", "bed_empty",
    "maize_sown", "maize_growing", "maize_ready", "spaza", "workshop", "rain_tank", "solar_stand",
    "char_farmer", "animal_hen", "animal_dog",
    "tree_jacaranda", "tree_acacia", "tree_marula",
    "washing_line", "wheelbarrow", "taxi",
    "neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = LOOK;
