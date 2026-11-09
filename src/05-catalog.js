// Sprite catalog for Khaya Lane. Swap LOOK.root (and the file names) when a new
// illustrated set lands in assets/sprites/gen/. Footprints, anchors, and offsets stay.
var LOOK = {
  root: "assets/khaya/",
  buildings: {
    home: { anchor: [0.5, 0.58], offset: [0, -6], shadow: [1.2, 0.42], scale: 1, levels: ["home1", "home2", "home3"] },
    bed: {
      anchor: [0.5, 0.56], offset: [0, 2], shadow: [0.7, 0.26], scale: 1,
      states: ["bed_empty", "bed_sown", "bed_maize_mid", "bed_maize_ready", "bed_spinach_mid", "bed_spinach_ready", "bed_tomato_mid", "bed_tomato_ready", "bed_aloe_mid", "bed_aloe_ready"]
    },
    spaza: { anchor: [0.5, 0.58], offset: [0, -4], shadow: [0.85, 0.32], scale: 1, levels: ["spaza1", "spaza2"] },
    tank: { anchor: [0.5, 0.62], offset: [0, -8], shadow: [0.55, 0.22], scale: 1, file: "tank" },
    workshop: { anchor: [0.5, 0.58], offset: [0, -4], shadow: [0.8, 0.3], scale: 1, file: "workshop" },
    solar: { anchor: [0.5, 0.6], offset: [0, -6], shadow: [0.7, 0.24], scale: 1, file: "solar" },
    aloe_clump: { anchor: [0.5, 0.7], offset: [0, 4], shadow: [0.4, 0.16], scale: 0.85, file: "aloeplant" },
    palisade: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.55, 0.18], scale: 0.9, file: "fence" }
  },
  actors: {
    farmer: { scale: 0.58, anchor: [0.5, 0.88], shadow: [0.36, 0.14], walk: "farmer_w", frames: 6, dirs: 4, water: ["farmer_water_0", "farmer_water_1", "farmer_water_2", "farmer_water_3"] },
    doek: { scale: 0.58, anchor: [0.5, 0.88], shadow: [0.36, 0.14], walk: "doek_w", frames: 6, dirs: 4 },
    jersey: { scale: 0.58, anchor: [0.5, 0.88], shadow: [0.36, 0.14], walk: "jersey_w", frames: 6, dirs: 4, wave: ["jersey_wave_0", "jersey_wave_1", "jersey_wave_2", "jersey_wave_3"] },
    gogo: { scale: 0.52, anchor: [0.5, 0.88], shadow: [0.34, 0.14], idle: ["gogo_0", "gogo_1", "gogo_2", "gogo_3"] },
    kid: { scale: 0.46, anchor: [0.5, 0.88], shadow: [0.28, 0.12], idle: ["kid_0", "kid_1", "kid_2", "kid_3"] },
    hen: { scale: 0.7, anchor: [0.5, 0.82], shadow: [0.32, 0.12], idle: ["hen_0", "hen_1", "hen_2", "hen_3"] },
    dog: { scale: 0.76, anchor: [0.5, 0.82], shadow: [0.4, 0.14], idle: ["dog_0", "dog_1", "dog_2", "dog_3"] }
  },
  scenery: {
    jacaranda: { file: "jacaranda", scale: 1, shadow: [0.9, 0.28] },
    acacia: { file: "acacia", scale: 1, shadow: [0.95, 0.26] },
    neighbours: { files: ["neighbour", "neighbour2", "neighbour3"], scale: 0.62, shadow: [0.7, 0.24] }
  },
  cast: [
    { id: "farmer", route: [[6, 3], [6, 4], [5, 4], [5, 3]], speed: 9000 },
    { id: "doek", route: [[6, 1], [6, 2], [5, 2], [5, 1]], speed: 11000 },
    { id: "jersey", route: [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [3, 6], [2, 6], [1, 6]], speed: 8000 },
    { id: "gogo", route: [[1, 5], [2, 5], [2, 4], [1, 4]], speed: 12000 },
    { id: "kid", near: "home", speed: 0 },
    { id: "hen", spot: [5.6, 4.4], wobble: 0.4 },
    { id: "dog", spot: [2.4, 4.2], wobble: 0.35 }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = LOOK;
