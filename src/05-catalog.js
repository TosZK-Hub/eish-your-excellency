// Illustrated Khaya Lane art. Sizes are in the sprite's own pixels.
// One ground tile is 256px wide and 128px tall. Sprites are anchored at their feet.
var LOOK = {
  root: "assets/sprites/gen/",
  ext: ".webp",
  buildings: {
    home: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [1.05, 0.38], scale: 1.12, levels: ["home_l1", "home_l2", "home_l3"] },
    bed: { anchor: [0.5, 0.58], offset: [0, 0], shadow: [0.72, 0.28], scale: 1, file: "bed_empty" },
    spaza: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.95, 0.36], scale: 0.78, levels: ["spaza", "spaza"] },
    tank: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [0.5, 0.2], scale: 1, file: "rain_tank" },
    workshop: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.9, 0.34], scale: 0.82, file: "workshop" },
    solar: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.62, 0.24], scale: 1, file: "solar_stand" },
    aloe_clump: { anchor: [0.5, 0.7], offset: [0, 0], shadow: [0.36, 0.16], scale: 1, file: "aloe" },
    palisade: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.5, 0.2], scale: 0.7, file: "soccer_goal" },
    braai: { anchor: [0.5, 0.68], offset: [0, 0], shadow: [0.42, 0.18], scale: 1, file: "braai_drum", smoke: "braai" },
    potjie: { anchor: [0.5, 0.7], offset: [0, 0], shadow: [0.36, 0.16], scale: 1, file: "potjie", smoke: "steam" },
    imbawula: { anchor: [0.5, 0.72], offset: [0, 0], shadow: [0.28, 0.14], scale: 1, file: "imbawula", smoke: "coal" },
    barrow: { anchor: [0.5, 0.68], offset: [0, 0], shadow: [0.4, 0.16], scale: 1, file: "wheelbarrow" },
    mielie: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [0.46, 0.18], scale: 1, file: "mielie_cart", smoke: "braai" },
    wash: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.55, 0.2], scale: 0.9, file: "washing_line" },
    coop: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.6, 0.22], scale: 1, file: "chicken_coop" },
    patch: { anchor: [0.5, 0.6], offset: [0, 0], shadow: [0.62, 0.24], scale: 1, file: "pumpkin_patch" },
    kraal: { anchor: [0.5, 0.6], offset: [0, 0], shadow: [1.05, 0.38], scale: 1, file: "kraal" }
  },
  actors: {
    farmer: { file: "char_farmer", scale: 0.72, shadow: [0.34, 0.14] },
    doek: { file: "char_woman_doek", scale: 0.72, shadow: [0.32, 0.13] },
    basotho: { file: "char_basotho_elder", scale: 0.72, shadow: [0.32, 0.13] },
    gogo: { file: "char_gogo", scale: 0.7, shadow: [0.32, 0.13] },
    kid: { file: "char_kid", scale: 0.7, shadow: [0.26, 0.11] },
    jersey: { file: "char_man_jersey", scale: 0.72, shadow: [0.32, 0.13] },
    taxi: { file: "char_taxi_driver", scale: 0.72, shadow: [0.34, 0.14] },
    hen: { file: "animal_hen", scale: 1.35, shadow: [0.22, 0.1] },
    dog: { file: "animal_dog", scale: 1.25, shadow: [0.28, 0.12] },
    cow: { file: "animal_cow", scale: 1, shadow: [0.4, 0.16] },
    goat: { file: "animal_goat", scale: 1.05, shadow: [0.3, 0.12] }
  },
  trees: ["tree_jacaranda", "tree_acacia", "tree_marula"],
  neighbours: ["neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"],
  dress: [
    { file: "taxi", x: 1.55, y: 6.55, scale: 1 },
    { file: "soccer_goal", x: 10.4, y: 3.4, scale: 1 },
    { file: "tree_marula", x: 12.2, y: 1.3, scale: 1 },
    { file: "tree_acacia", x: 13.4, y: 5.6, scale: 1 },
    { file: "tree_jacaranda", x: 5.2, y: 10.4, scale: 1 },
    { file: "aloe", x: 2.3, y: 1.15, scale: 1 },
    { file: "neighbour_mural", x: 9.4, y: 6.4, scale: 0.82 },
    { file: "neighbour_facebrick", x: 3.2, y: 11.3, scale: 0.82 }
  ],
  cast: [
    { id: "farmer", route: [[6, 3], [6, 4], [5, 4], [5, 3]], speed: 9000 },
    { id: "doek", route: [[6, 1], [6, 2], [5, 2], [5, 1]], speed: 11000 },
    { id: "jersey", route: [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [3, 6], [2, 6], [1, 6]], speed: 8000 },
    { id: "gogo", route: [[1, 5], [2, 5], [2, 4], [1, 4]], speed: 13000 },
    { id: "kid", near: "home" },
    { id: "basotho", route: [[2, 3], [3, 3], [3, 4], [2, 4]], speed: 15000 },
    { id: "taxi", route: [[1, 6], [2, 6], [2, 5], [1, 5]], speed: 10000 },
    { id: "hen", spot: [5.5, 4.5], wobble: 0.35 },
    { id: "dog", spot: [2.5, 4.3], wobble: 0.28 },
    { id: "cow", spot: [7.3, 5.4], wobble: 0.12 },
    { id: "goat", spot: [3.4, 5.5], wobble: 0.22 }
  ],
  first: [
    "tile_grass", "tile_dirt", "home_l1", "home_l2", "home_l3", "bed_empty",
    "maize_sown", "maize_growing", "maize_ready", "spaza", "workshop", "rain_tank", "solar_stand",
    "char_farmer", "animal_hen", "animal_dog",
    "tree_jacaranda", "tree_acacia", "tree_marula",
    "neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = LOOK;
