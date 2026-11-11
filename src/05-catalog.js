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
    wash: { shadow: [0.55, 0.2], scale: 0.34, file: "washing_line" },
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
    { id: "farmer", route: [[7.5, 1.5], [6.5, 1.5]], speed: 11000 },
    { id: "doek", route: [[3.5, 6.5], [2.5, 6.5]], speed: 11000 },
    { id: "jersey", route: [[4.5, 0.5], [5.5, 0.5]], speed: 8000 },
    { id: "gogo", route: [[1.5, 5.5], [2.5, 5.5]], speed: 13000 },
    { id: "kid", at: [4.5, 6.5] },
    { id: "basotho", route: [[3.5, 7.5], [4.5, 7.5]], speed: 15000 },
    { id: "taxi", route: [[15.5, 9.5], [14.5, 9.5]], speed: 10000 },
    { id: "hen", route: [[7.5, 3.5], [7.5, 4.5]], speed: 7200 },
    { id: "dog", route: [[4.5, 1.5], [5.5, 1.5]], speed: 6400 },
    { id: "cow", route: [[9.5, 4.5], [10.5, 4.5]], speed: 12000 },
    { id: "goat", route: [[10.5, 0.5], [11.5, 0.5]], speed: 8600 }
  ],
  // One clump cut from each crop sheet. Four of these sit inside the bed.
  plantSpots: [[0.50, 0.50], [0.40, 0.42], [0.62, 0.40], [0.40, 0.62], [0.62, 0.60]],
  plant: {
    maize_sown: { x: 88, y: 36, w: 72, h: 52, kind: "sown" },
    maize_growing: { x: 96, y: 18, w: 64, h: 70, kind: "grow" },
    maize_ready: { x: 100, y: 6, w: 58, h: 78, kind: "ready" },
    morogo_sown: { x: 90, y: 34, w: 70, h: 50, kind: "sown" },
    morogo_growing: { x: 92, y: 22, w: 68, h: 58, kind: "grow" },
    morogo_ready: { x: 88, y: 12, w: 72, h: 64, kind: "ready" },
    morogo_ready_basket: { x: 86, y: 8, w: 76, h: 68, kind: "ready" },
    pumpkin_sown: { x: 90, y: 36, w: 70, h: 52, kind: "sown" },
    pumpkin_growing: { x: 88, y: 24, w: 74, h: 62, kind: "grow" },
    pumpkin_fruiting: { x: 84, y: 16, w: 80, h: 70, kind: "ready" },
    pumpkin_ready: { x: 82, y: 12, w: 84, h: 74, kind: "ready" },
    aloe: { x: 40, y: 20, w: 110, h: 140, kind: "ready" }
  },
  stages: {
    maize: ["maize_sown", "maize_growing", "maize_ready"],
    morogo: ["morogo_sown", "morogo_growing", "morogo_ready_basket"],
    pumpkin: ["pumpkin_sown", "pumpkin_growing", "pumpkin_fruiting", "pumpkin_ready"],
    spinach: ["morogo_sown", "morogo_growing", "morogo_ready_basket"],
    tomato: ["pumpkin_sown", "pumpkin_growing", "pumpkin_fruiting", "pumpkin_ready"],
    aloe: ["aloe"]
  },
  px: {
    bed_empty: [256, 167], home_l1: [400, 311], home_l2: [460, 376], home_l3: [560, 431],
    spaza: [480, 389], workshop: [480, 397], rain_tank: [240, 327], solar_stand: [320, 436],
    aloe: [190, 270], washing_line: [320, 323], wheelbarrow: [200, 198], soccer_goal: [280, 235],
    braai_drum: [220, 277], potjie: [190, 201], imbawula: [130, 201], mielie_cart: [240, 329],
    chicken_coop: [300, 315], pumpkin_patch: [300, 201], kraal: [420, 353], taxi: [360, 326]
  },
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

LOOK.plantDraw = function (file, tw) {
  var spec = LOOK.plant[file];
  if (!spec) return null;
  var capW = spec.kind === "sown" ? 0.11 : spec.kind === "grow" ? 0.15 : 0.17;
  var capH = spec.kind === "sown" ? 0.09 : spec.kind === "grow" ? 0.12 : 0.145;
  var dw = tw * capW;
  var dh = dw * (spec.h / spec.w);
  if (dh > tw * capH) {
    dw *= (tw * capH) / dh;
    dh = tw * capH;
  }
  return { dw: dw, dh: dh, spots: LOOK.plantSpots };
};

LOOK.actorPx = {
  farmer: [171, 256], doek: [116, 256], gogo: [146, 256], kid: [122, 215],
  jersey: [129, 256], basotho: [139, 256], taxi: [173, 256],
  hen: [67, 96], dog: [93, 120], cow: [175, 170], goat: [106, 130]
};

LOOK.spriteBox = function (file, ax, ay, scale, pivot, tw) {
  var size = (LOOK.px && LOOK.px[file]) || [256, 256];
  var k = (tw / 256) * (scale || 1);
  var dw = size[0] * k;
  var dh = size[1] * k;
  var fx = pivot ? pivot[0] : 0.5;
  var fy = pivot ? pivot[1] : 1;
  var left = ax - fx * dw;
  var top = ay - fy * dh;
  return { l: left, t: top, r: left + dw, b: top + dh, dw: dw, dh: dh };
};

LOOK.overlapAudit = function (state, tw) {
  tw = tw || 64;
  var problems = [];
  function at(x, y) {
    return { x: (x - y) * tw / 2, y: (x + y) * tw / 4 };
  }
  function cellAt(sx, sy) {
    var a = sx / (tw / 2);
    var b = sy / (tw / 4);
    return { x: Math.floor((a + b) / 2), y: Math.floor((b - a) / 2) };
  }
  function plantsOf(b, file) {
    var draw = LOOK.plantDraw(file, tw);
    if (!draw) return [];
    var out = [];
    var i, spot, p;
    for (i = 0; i < draw.spots.length; i++) {
      spot = draw.spots[i];
      p = at(b.x + spot[0], b.y + spot[1]);
      out.push({
        l: p.x - draw.dw / 2, t: p.y - draw.dh, r: p.x + draw.dw / 2, b: p.y,
        who: file + " on " + b.x + "," + b.y, x: b.x, y: b.y
      });
    }
    return out;
  }
  var beds = [];
  var i, b, files, f, boxes, n, box, inset, corners, k, hit, a, c, ix, iy;
  for (i = 0; i < state.buildings.length; i++) if (state.buildings[i].type === "bed") beds.push(state.buildings[i]);
  boxes = [];
  for (i = 0; i < beds.length; i++) {
    b = beds[i];
    files = (LOOK.stages && LOOK.stages[b.crop || "maize"]) || ["maize_ready"];
    if (!b.crop) files = ["maize_sown", "maize_growing", "maize_ready", "morogo_ready_basket", "pumpkin_ready"];
    for (f = 0; f < files.length; f++) {
      var added = plantsOf(b, files[f]);
      for (n = 0; n < added.length; n++) {
        box = added[n];
        boxes.push(box);
        inset = 3;
        corners = [
          [box.l + inset, box.t + inset],
          [box.r - inset, box.t + inset],
          [box.l + inset, box.b - inset],
          [box.r - inset, box.b - inset]
        ];
        for (k = 0; k < corners.length; k++) {
          hit = cellAt(corners[k][0], corners[k][1]);
          if (hit.x !== b.x || hit.y !== b.y) {
            problems.push(box.who + " spills onto " + hit.x + "," + hit.y);
          }
        }
      }
    }
  }
  for (a = 0; a < boxes.length; a++) {
    for (c = a + 1; c < boxes.length; c++) {
      if (boxes[a].x === boxes[c].x && boxes[a].y === boxes[c].y) continue;
      ix = Math.min(boxes[a].r, boxes[c].r) - Math.max(boxes[a].l, boxes[c].l);
      iy = Math.min(boxes[a].b, boxes[c].b) - Math.max(boxes[a].t, boxes[c].t);
      if (ix > 4 && iy > 4) problems.push(boxes[a].who + " overlaps " + boxes[c].who + " by " + Math.round(ix) + "x" + Math.round(iy));
    }
  }
  var khaya = typeof KHAYA !== "undefined" ? KHAYA : (typeof global !== "undefined" ? global.KHAYA : null);
  var tall = [];
  var labels = [];
  function overlaps(box, other) {
    var ox = Math.min(box.r, other.r) - Math.max(box.l, other.l);
    var oy = Math.min(box.b, other.b) - Math.max(box.t, other.t);
    return ox > 4 && oy > 4;
  }
  function pushTall(who, box) {
    box.who = who;
    tall.push(box);
  }
  var spec, file, pivot, tiles, scale, anchor, home;
  for (i = 0; i < state.buildings.length; i++) {
    b = state.buildings[i];
    spec = (LOOK.buildings && LOOK.buildings[b.type]) || {};
    file = spec.file || b.type;
    if (spec.levels) file = spec.levels[Math.max(0, Math.min(spec.levels.length, b.level || 1) - 1)];
    if (b.type === "bed") file = "bed_empty";
    pivot = (LOOK.pivot && LOOK.pivot[file]) || [0.5, 1, 256];
    tiles = ((b.w || 1) + (b.h || 1)) / 2;
    scale = spec.fit ? (tiles * 256) / (pivot[2] || 256) : Math.min(spec.scale || 1, (tiles * 0.72 * 256) / (pivot[2] || 256));
    anchor = spec.fit ? at(b.x + b.w, b.y + b.h) : at(b.x + b.w / 2, b.y + b.h / 2);
    pushTall(b.type + "@" + b.x + "," + b.y, LOOK.spriteBox(file, anchor.x, anchor.y, scale, pivot, tw));
    if (b.type === "bed") {
      var top = anchor.y - (pivot[1] || 1) * (LOOK.spriteBox(file, anchor.x, anchor.y, scale, pivot, tw).dh);
      var mid = at(b.x + b.w / 2, b.y + b.h / 2);
      var ly = top - 10;
      if (ly < 10) ly = 10;
      labels.push({ l: mid.x - 18, t: ly - 12, r: mid.x + 18, b: ly + 8, who: "label@" + b.x + "," + b.y, owner: b.x + "," + b.y });
    }
  }
  var props = khaya && khaya.PROPS ? khaya.PROPS : [];
  for (i = 0; i < props.length; i++) {
    var prop = props[i];
    pivot = (LOOK.pivot && LOOK.pivot[prop.file]) || [0.5, 1, 256];
    if (prop.id === "taxi") {
      scale = (0.95 * 256) / (pivot[2] || 327);
      anchor = at(prop.x + prop.w, prop.y + prop.h);
    } else {
      spec = (LOOK.buildings && LOOK.buildings[prop.id]) || {};
      tiles = ((prop.w || 1) + (prop.h || 1)) / 2;
      scale = Math.min(spec.scale || 1, (tiles * 0.72 * 256) / (pivot[2] || 256));
      anchor = at(prop.x + prop.w / 2, prop.y + prop.h / 2);
    }
    pushTall(prop.id, LOOK.spriteBox(prop.file, anchor.x, anchor.y, scale, pivot, tw));
  }
  var cast = LOOK.cast || [];
  for (i = 0; i < cast.length; i++) {
    var entry = cast[i];
    var actor = LOOK.actors && LOOK.actors[entry.id];
    var stand = entry.at || (entry.route && entry.route[0]);
    if (!actor || !stand) continue;
    var ap = LOOK.actorPx[entry.id] || [140, 256];
    LOOK.px[entry.id] = ap;
    var foot = at(stand[0], stand[1]);
    pushTall(entry.id + " at rest", LOOK.spriteBox(entry.id, foot.x, foot.y, actor.scale || 0.7, [0.5, 1], tw));
  }
  for (a = 0; a < tall.length; a++) {
    for (c = a + 1; c < tall.length; c++) {
      if (overlaps(tall[a], tall[c])) problems.push(tall[a].who + " covers " + tall[c].who);
    }
    for (n = 0; n < boxes.length; n++) {
      if (tall[a].who.indexOf("bed@") === 0 && boxes[n].who.indexOf(" on " + tall[a].who.slice(4)) > -1) continue;
      if (overlaps(tall[a], boxes[n])) problems.push(tall[a].who + " covers " + boxes[n].who);
    }
    for (n = 0; n < labels.length; n++) {
      if (tall[a].who.indexOf("@" + labels[n].owner) === 0) continue;
      if (overlaps(tall[a], labels[n])) problems.push(tall[a].who + " covers " + labels[n].who);
    }
  }
  return { ok: problems.length === 0, problems: problems };
};

if (typeof module !== "undefined" && module.exports) module.exports = LOOK;
