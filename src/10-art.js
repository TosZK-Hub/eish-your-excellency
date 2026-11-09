// EISH! Jozi Run — volumetric cast and props.
// Three.js meshes with a joint rig (hips, spine, shoulders, elbows, hips, knees).
// +rotation.x on a limb swings it toward -Z, which is forward down the street.
// Next pass: tune cycle amplitudes in poseRun() and the CAST colours.
(function (root) {
  "use strict";
  function three() { return root.THREE; }

  var CAST = [
    {
      id: "lerato", name: "Lerato", place: "Braamfontein",
      line: "Teal tracksuit, coral bun. She takes the jump before the rank fills.",
      skin: "#c4845c", skinDeep: "#8d5340",
      hair: "#1b140f", band: "#ff6b4a",
      cloth: "#14988e", clothDeep: "#0c645e",
      accent: "#ff6b4a", pants: "#173632", shoe: "#f4f1ea", kick: "#ff6b4a",
      style: "bun", bob: 1.12, arm: 1.05, lean: 0.16
    },
    {
      id: "jabu", name: "Jabu", place: "Yeoville",
      line: "Red golf shirt, khaki shorts. He slips the gap between the minibuses.",
      skin: "#e0aa78", skinDeep: "#b67c4c",
      hair: "#16120e", band: "#f7f4ee",
      cloth: "#d4534a", clothDeep: "#9a302c",
      accent: "#f7f4ee", pants: "#c6a15a", shoe: "#f7f4ee", kick: "#d4534a",
      style: "fade", bob: 0.82, arm: 0.88, lean: 0.1
    },
    {
      id: "naledi", name: "Naledi", place: "Maboneng",
      line: "A sun on her jacket, beads in her twists. She runs the streets she paints.",
      skin: "#6e3e2e", skinDeep: "#4a271e",
      hair: "#140e0c", band: "#f0c14d",
      cloth: "#2d439e", clothDeep: "#1c2d74",
      accent: "#ffb703", pants: "#e2a12b", shoe: "#ff5d8f", kick: "#fffaf2",
      style: "twists", bob: 1.0, arm: 1.18, lean: 0.12,
      beads: ["#c46bdc", "#ffb703", "#ff6b4a", "#49c2b0"]
    }
  ];

  var GEO = {};
  function T() { return three(); }
  function geoCapsule(r, len) {
    var key = "c" + r + ":" + len;
    if (!GEO[key]) GEO[key] = new (T()).CapsuleGeometry(r, Math.max(0.02, len), 4, 8);
    return GEO[key];
  }
  function geoSphere(r, w, h) {
    var key = "s" + r + ":" + (w || 16) + ":" + (h || 12);
    if (!GEO[key]) GEO[key] = new (T()).SphereGeometry(r, w || 16, h || 12);
    return GEO[key];
  }
  function geoBox(x, y, z) {
    var key = "b" + x + ":" + y + ":" + z;
    if (!GEO[key]) GEO[key] = new (T()).BoxGeometry(x, y, z);
    return GEO[key];
  }
  var MAT = {};
  function mat(color, rough, metal, extra) {
    var key = color + ":" + rough + ":" + metal + ":" + (extra || "");
    if (!MAT[key]) {
      var opt = { color: color, roughness: rough, metalness: metal };
      if (extra === "skin") opt.emissive = color, opt.emissiveIntensity = 0.035;
      MAT[key] = new (T()).MeshStandardMaterial(opt);
    }
    return MAT[key];
  }
  function glassMat() {
    if (!MAT.glass) {
      MAT.glass = new (T()).MeshStandardMaterial({
        color: "#1c2838", roughness: 0.15, metalness: 0.6,
        transparent: true, opacity: 0.72
      });
    }
    return MAT.glass;
  }
  function add(parent, geometry, material, x, y, z) {
    var mesh = new (T()).Mesh(geometry, material);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function pivot(parent, x, y, z) {
    var g = new (T()).Group();
    g.position.set(x || 0, y || 0, z || 0);
    parent.add(g);
    return g;
  }
  function limb(parent, len, radius, material) {
    var mesh = add(parent, geoCapsule(radius, Math.max(0.02, len - radius * 2)), material, 0, -len * 0.5, 0);
    return mesh;
  }

  function torsoGeo(who) {
    var key = "torso" + who;
    if (GEO[key]) return GEO[key];
    var hip = who === 1 ? 0.145 : 0.132;
    var waist = who === 1 ? 0.118 : 0.1;
    var chest = who === 1 ? 0.155 : who === 2 ? 0.132 : 0.128;
    var height = 0.46;
    var pts = [];
    var i;
    for (i = 0; i <= 12; i++) {
      var t = i / 12;
      var y = -0.02 + t * height;
      var r;
      if (t < 0.42) r = hip + (waist - hip) * (t / 0.42);
      else r = waist + (chest - waist) * ((t - 0.42) / 0.58);
      var ease = Math.sin(t * Math.PI);
      r *= 0.92 + 0.08 * ease;
      pts.push(new (T()).Vector2(Math.max(0.06, r), y));
    }
    GEO[key] = new (T()).LatheGeometry(pts, 18);
    return GEO[key];
  }

  function buildRunner(index) {
    var THREE = T();
    var c = CAST[index];
    var skin = mat(c.skin, 0.58, 0.02, "skin");
    var cloth = mat(c.cloth, 0.72, 0.04);
    var clothD = mat(c.clothDeep, 0.78, 0.03);
    var pants = mat(c.pants, 0.74, 0.02);
    var hair = mat(c.hair, 0.8, 0.04);
    var shoe = mat(c.shoe, 0.45, 0.08);
    var kick = mat(c.kick, 0.4, 0.12);
    var accent = mat(c.accent, 0.5, 0.08);
    var gold = mat("#f0c14d", 0.28, 0.85);
    var root = new THREE.Group();
    root.name = c.id;

    var hips = pivot(root, 0, 0.92, 0);
    var torso = add(hips, torsoGeo(index), cloth, 0, 0, 0);
    torso.castShadow = true;

    var stripe = add(hips, geoBox(0.18, 0.04, 0.03), accent, 0, c.style === "fade" ? 0.36 : 0.22, -0.12);
    stripe.castShadow = false;
    if (c.style === "fade") {
      add(hips, geoCapsule(0.018, 0.1), accent, -0.16, 0.28, 0);
      add(hips, geoCapsule(0.018, 0.1), accent, 0.16, 0.28, 0);
    } else if (c.style === "twists") {
      var sun = add(hips, geoSphere(0.055, 16, 12), accent, 0, 0.24, -0.115);
      sun.scale.z = 0.45;
      add(hips, geoSphere(0.022, 10, 8), mat("#fff6d0", 0.4, 0.05), -0.012, 0.25, -0.132);
    }

    var neck = pivot(hips, 0, 0.46, 0);
    limb(neck, 0.08, 0.055, skin);
    var headP = pivot(neck, 0, 0.1, 0);
    var skull = add(headP, geoSphere(0.145, 24, 18), skin, 0, 0.02, 0);
    skull.scale.set(1, 1.06, 0.98);

    function eye(x) {
      var dir = new THREE.Vector3(x, 0.035, -1).normalize().multiplyScalar(0.15);
      var g = pivot(headP, dir.x, 0.02 + dir.y, dir.z);
      var white = add(g, geoSphere(0.038, 16, 12), mat("#f7f4ee", 0.28, 0.02), 0, 0, 0);
      white.scale.z = 0.55;
      var iris = add(g, geoSphere(0.02, 12, 10), mat("#3a2418", 0.35, 0.04), 0, 0, -0.012);
      add(g, geoSphere(0.01, 10, 8), mat("#120c0a", 0.3, 0.05), 0, 0, -0.02);
      var catchL = add(g, geoSphere(0.007, 8, 6), mat("#ffffff", 0.15, 0), -0.008, 0.01, -0.024);
      catchL.castShadow = false;
      return { group: g, white: white, iris: iris };
    }
    var eyeL = eye(-0.048);
    var eyeR = eye(0.05);
    function brow(x, tilt) {
      var b = add(headP, geoCapsule(0.011, 0.045), hair, x, 0.105, -0.125);
      b.rotation.z = tilt;
    }
    brow(-0.05, c.style === "fade" ? 0.2 : -0.4);
    brow(0.052, c.style === "fade" ? -0.08 : 0.45);
    var nose = add(headP, geoSphere(0.026, 12, 10), skin, 0, -0.01, -0.155);
    nose.scale.set(c.style === "fade" ? 1.1 : 0.8, 0.65, 0.7);
    var mouth = add(headP, new THREE.TorusGeometry(0.03, 0.007, 8, 16, Math.PI), mat(c.style === "twists" ? "#8d4038" : "#b15d62", 0.45, 0.02), 0, -0.062, -0.145);
    mouth.rotation.z = Math.PI;
    mouth.rotation.x = 0.2;
    add(headP, geoSphere(0.028, 10, 8), mat(c.skin, 0.5, 0), -0.055, -0.01, -0.08).scale.set(1, 0.55, 0.4);
    add(headP, geoSphere(0.028, 10, 8), mat(c.skin, 0.5, 0), 0.058, -0.01, -0.08).scale.set(1, 0.55, 0.4);
    // ears
    add(headP, geoSphere(0.04, 12, 10), skin, -0.14, 0.0, 0.01).scale.set(0.45, 0.7, 0.55);
    add(headP, geoSphere(0.04, 12, 10), skin, 0.145, 0.0, 0.01).scale.set(0.45, 0.7, 0.55);
    if (c.style !== "fade") add(headP, geoSphere(0.018, 10, 8), gold, c.style === "bun" ? -0.155 : 0.16, -0.02, -0.02);
    if (c.style === "twists") {
      var paint = add(headP, geoSphere(0.02, 8, 6), mat("#49c2b0", 0.5, 0.02), 0.07, -0.02, -0.11);
      paint.scale.set(1.4, 0.5, 0.3);
    }

    // Hair sits behind and above the face so the eyes stay visible from the front.
    if (c.style === "bun") {
      var bun = add(headP, geoSphere(0.085, 16, 12), hair, 0.0, 0.18, 0.04);
      bun.scale.set(1, 0.85, 1);
      var wrap = add(headP, new THREE.TorusGeometry(0.05, 0.014, 8, 16), mat(c.band, 0.45, 0.05), 0, 0.175, 0.04);
      wrap.rotation.x = Math.PI / 2;
      add(headP, geoSphere(0.055, 12, 10), hair, -0.1, 0.11, 0.02);
      add(headP, geoSphere(0.04, 12, 10), hair, 0.09, 0.12, 0.01);
    } else if (c.style === "fade") {
      var cap = add(headP, geoSphere(0.148, 20, 14), hair, 0, 0.06, 0.02);
      cap.scale.set(1.02, 0.62, 0.95);
    } else {
      var beads = c.beads;
      var ti;
      for (ti = 0; ti < 8; ti++) {
        var a = -2.4 + ti * 0.62;
        var len = 0.16 + (ti % 3) * 0.035;
        var tw = pivot(headP, Math.sin(a) * 0.06, 0.1, Math.cos(a) * 0.04);
        tw.rotation.z = a * 0.35;
        tw.rotation.x = -0.8 - (ti % 2) * 0.25;
        var strand = add(tw, geoCapsule(0.018, len), hair, 0, len * 0.45, 0);
        strand.castShadow = false;
        var bead = add(tw, geoSphere(0.022, 8, 6), mat(beads[ti % beads.length], 0.35, 0.15), 0, len + 0.02, 0);
        bead.castShadow = false;
      }
    }

    function arm(side) {
      var s = side < 0 ? -1 : 1;
      var shoulder = pivot(hips, s * 0.145, 0.38, 0);
      add(shoulder, geoSphere(0.042, 12, 10), cloth, 0, 0, 0);
      var upper = pivot(shoulder, s * 0.02, -0.02, 0);
      limb(upper, 0.26, 0.048, cloth);
      var elbow = pivot(upper, 0, -0.26, 0);
      add(elbow, geoSphere(0.04, 10, 8), skin, 0, 0, 0);
      var fore = pivot(elbow, 0, -0.02, 0);
      limb(fore, 0.24, 0.04, skin);
      var hand = add(fore, geoSphere(0.042, 12, 10), skin, 0, -0.26, 0);
      hand.scale.set(0.85, 1, 0.65);
      return { upper: upper, fore: fore };
    }
    var aL = arm(-1);
    var aR = arm(1);

    function leg(side) {
      var s = side < 0 ? -1 : 1;
      var hipJ = pivot(hips, s * (c.style === "fade" ? 0.09 : 0.08), -0.02, 0);
      var thighMat = c.style === "fade" ? pants : pants;
      limb(hipJ, 0.4, c.style === "fade" ? 0.078 : 0.07, thighMat);
      var knee = pivot(hipJ, 0, -0.4, 0);
      add(knee, geoSphere(0.05, 10, 8), c.style === "fade" ? skin : pants, 0, 0, 0);
      var shin = pivot(knee, 0, -0.02, 0);
      limb(shin, 0.38, 0.045, c.style === "fade" ? skin : pants);
      var ankle = pivot(shin, 0, -0.38, 0);
      var foot = add(ankle, geoCapsule(0.045, 0.08), shoe, 0, -0.02, -0.06);
      foot.rotation.x = Math.PI / 2;
      var sole = add(ankle, geoBox(0.07, 0.025, 0.16), mat("#241820", 0.7, 0.05), 0, -0.06, -0.05);
      sole.castShadow = true;
      var stripe = add(ankle, geoBox(0.05, 0.02, 0.08), kick, 0, -0.02, -0.08);
      stripe.castShadow = false;
      return { thigh: hipJ, shin: shin, ankle: ankle };
    }
    var lL = leg(-1);
    var lR = leg(1);

    function ease(t) { return t * t * (3 - 2 * t); }
    function sample(keys, t) {
      t = ((t % 1) + 1) % 1;
      var i, n = keys.length;
      for (i = 0; i < n; i++) {
        var a = keys[i], b = keys[(i + 1) % n];
        var end = b.p <= a.p ? b.p + 1 : b.p;
        var cur = t < a.p ? t + 1 : t;
        if (cur >= a.p && cur <= end + 0.0001) {
          var span = end - a.p || 1;
          return a.v + (b.v - a.v) * ease(Math.max(0, Math.min(1, (cur - a.p) / span)));
        }
      }
      return keys[0].v;
    }
    var THIGH = [
      { p: 0.00, v: 0.55 }, { p: 0.16, v: 0.12 }, { p: 0.38, v: -0.68 },
      { p: 0.55, v: -0.18 }, { p: 0.74, v: 0.98 }, { p: 1.00, v: 0.55 }
    ];
    var KNEE = [
      { p: 0.00, v: -0.18 }, { p: 0.16, v: -0.62 }, { p: 0.36, v: -0.16 },
      { p: 0.52, v: -1.25 }, { p: 0.72, v: -0.85 }, { p: 0.90, v: -0.28 }, { p: 1.00, v: -0.18 }
    ];
    var smoothed = null;

    function apply(info) {
      var phase = info.phase || 0;
      var dt = info.dt || 0.016;
      var mode = info.mode || "run";
      var cycle = phase;
      var thighL, thighR, kneeL, kneeR, armL, armR, foreL, foreR, lean, hipY, hipTwist, spineTwist, roll, headX, headY, footFlat;
      if (mode === "jump") {
        var k = Math.sin(Math.min(1, info.air || 0) * Math.PI);
        thighL = 1.15 * k; thighR = 1.2 * k;
        kneeL = -1.35 * k; kneeR = -1.4 * k;
        armL = -1.25 * k; armR = -1.15 * k;
        foreL = -0.45; foreR = -0.5;
        lean = 0.02; hipY = 0.9; hipTwist = 0; spineTwist = 0; roll = 0;
        headX = -0.15 * k; headY = 0; footFlat = 0.35;
      } else if (mode === "slide") {
        thighL = 1.25; kneeL = -0.45; thighR = 0.05; kneeR = -1.25;
        armL = 0.45; armR = 0.15; foreL = -0.25; foreR = -1.15;
        lean = -0.62; hipY = 0.58; hipTwist = 0; spineTwist = 0; roll = 0.08;
        headX = 0.28; headY = 0.15; footFlat = 0.7;
      } else if (mode === "hit") {
        thighL = 0.2; thighR = -0.4; kneeL = -0.25; kneeR = -0.35;
        armL = -1.35; armR = -0.85; foreL = -0.45; foreR = -0.55;
        lean = -0.28; hipY = 0.88; hipTwist = 0; spineTwist = 0; roll = 0;
        headX = -0.25; headY = 0; footFlat = 0.8;
      } else if (mode === "idle") {
        var w = Math.sin((info.t || 0) * 1.6);
        thighL = 0.05; thighR = -0.02; kneeL = -0.16; kneeR = -0.1;
        armL = 0.1 + w * 0.04; armR = -0.06; foreL = -0.32; foreR = -0.38;
        lean = 0.05; hipY = 0.92 + w * 0.01; hipTwist = w * 0.02; spineTwist = -w * 0.02; roll = 0;
        headX = -0.05; headY = 0.12; footFlat = 1;
      } else {
        thighL = sample(THIGH, cycle);
        thighR = sample(THIGH, cycle + 0.5);
        kneeL = sample(KNEE, cycle);
        kneeR = sample(KNEE, cycle + 0.5);
        armL = -sample(THIGH, cycle) * 1.05 * c.arm;
        armR = -sample(THIGH, cycle + 0.5) * 1.05 * c.arm;
        foreL = -0.28 - 0.75 * Math.max(0, -armL);
        foreR = -0.28 - 0.75 * Math.max(0, -armR);
        var weight = Math.cos(cycle * Math.PI * 2);
        lean = c.lean + 0.05 * weight;
        hipY = 0.9 - 0.045 * Math.cos(cycle * Math.PI * 4) * c.bob;
        hipTwist = -0.1 * weight;
        spineTwist = 0.16 * weight;
        roll = 0.07 * weight;
        headX = 0.06; headY = -0.06 * weight;
        footFlat = 1;
      }
      if (!smoothed) smoothed = { thighL: thighL, thighR: thighR, kneeL: kneeL, kneeR: kneeR, armL: armL, armR: armR, foreL: foreL, foreR: foreR, lean: lean, hipY: hipY, hipTwist: hipTwist, spineTwist: spineTwist, roll: roll, headX: headX, headY: headY };
      var blend = 1 - Math.exp(-22 * dt);
      var key;
      var next = { thighL: thighL, thighR: thighR, kneeL: kneeL, kneeR: kneeR, armL: armL, armR: armR, foreL: foreL, foreR: foreR, lean: lean, hipY: hipY, hipTwist: hipTwist, spineTwist: spineTwist, roll: roll, headX: headX, headY: headY };
      for (key in next) smoothed[key] = smoothed[key] + (next[key] - smoothed[key]) * blend;
      hips.position.y = smoothed.hipY;
      hips.position.x = smoothed.roll * 0.04;
      hips.rotation.y = smoothed.hipTwist;
      hips.rotation.x = smoothed.lean;
      hips.rotation.z = smoothed.roll;
      torso.rotation.y = smoothed.spineTwist;
      lL.thigh.rotation.x = smoothed.thighL;
      lR.thigh.rotation.x = smoothed.thighR;
      lL.shin.rotation.x = smoothed.kneeL;
      lR.shin.rotation.x = smoothed.kneeR;
      aL.upper.rotation.x = smoothed.armL;
      aR.upper.rotation.x = smoothed.armR;
      aL.upper.rotation.z = 0.08;
      aR.upper.rotation.z = -0.07;
      aL.fore.rotation.x = smoothed.foreL;
      aR.fore.rotation.x = smoothed.foreR;
      lL.ankle.rotation.x = -(smoothed.thighL + smoothed.kneeL) * 0.85 * footFlat + Math.max(0, -smoothed.thighL) * 0.35;
      lR.ankle.rotation.x = -(smoothed.thighR + smoothed.kneeR) * 0.85 * footFlat + Math.max(0, -smoothed.thighR) * 0.35;
      headP.rotation.x = smoothed.headX;
      headP.rotation.y = smoothed.headY;
      var blink = info.blink ? 0.12 : 1;
      eyeL.white.scale.y = blink;
      eyeR.white.scale.y = blink;
      eyeL.iris.scale.y = blink;
      eyeR.iris.scale.y = blink;
    }

    apply({ mode: "idle", phase: 0, t: 0 });
    return { object: root, animate: apply, cast: c };
  }

  function stripeMat(color) { return mat(color, 0.4, 0.2); }
  var STRIPES = ["#1f8f5a", "#2a6fbf", "#d4534a", "#e2a12b", "#7a4ad4"];

  function buildTaxi(variant) {
    var THREE = T();
    var g = new THREE.Group();
    var body = add(g, geoBox(0.98, 1.15, 2.15), mat("#f4f1ea", 0.42, 0.18), 0, 0.95, 0);
    var cabin = add(g, geoBox(0.9, 0.48, 1.15), glassMat(), 0, 1.28, -0.05);
    cabin.castShadow = false;
    var band = add(g, geoBox(1.0, 0.12, 2.16), stripeMat(STRIPES[(variant || 0) % STRIPES.length]), 0, 1.05, 0);
    band.castShadow = false;
    add(g, geoBox(0.86, 0.42, 0.06), glassMat(), 0, 1.22, 1.06);
    add(g, geoSphere(0.07, 10, 8), mat("#e23b3b", 0.4, 0.1), -0.36, 0.95, 1.08);
    add(g, geoSphere(0.07, 10, 8), mat("#e23b3b", 0.4, 0.1), 0.36, 0.95, 1.08);
    add(g, geoBox(0.28, 0.1, 0.02), mat("#f0c14d", 0.5, 0.1), 0, 0.72, 1.09);
    add(g, geoBox(1.02, 0.12, 0.12), mat("#2a2428", 0.6, 0.3), 0, 0.48, 1.02);
    add(g, geoBox(0.7, 0.08, 0.35), mat("#d9d3c8", 0.7, 0.1), 0, 1.62, -0.15);
    function wheel(x, z) {
      var w = add(g, new THREE.CylinderGeometry(0.22, 0.22, 0.14, 12), mat("#1a1618", 0.7, 0.2), x, 0.22, z);
      w.rotation.z = Math.PI / 2;
    }
    wheel(-0.48, 0.7);
    wheel(0.48, 0.7);
    wheel(-0.48, -0.7);
    wheel(0.48, -0.7);
    g.userData.kind = "taxi";
    return g;
  }

  function buildDrums() {
    var THREE = T();
    var g = new THREE.Group();
    function drum(x, color) {
      add(g, new THREE.CylinderGeometry(0.22, 0.24, 0.7, 12), mat(color, 0.55, 0.08), x, 0.35, 0);
      var band = add(g, new THREE.CylinderGeometry(0.245, 0.245, 0.08, 12), mat("#f7f4ee", 0.5, 0.05), x, 0.48, 0);
      band.castShadow = false;
    }
    drum(-0.28, "#f08a24");
    drum(0.28, "#2a6fbf");
    return g;
  }

  function buildBarrier() {
    var THREE = T();
    if (!GEO.barrier) {
      var shape = new THREE.Shape();
      shape.moveTo(-0.42, 0);
      shape.lineTo(-0.26, 0.62);
      shape.lineTo(0.26, 0.62);
      shape.lineTo(0.42, 0);
      shape.closePath();
      GEO.barrier = new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
      GEO.barrier.translate(0, 0, -0.35);
    }
    var g = new THREE.Group();
    add(g, GEO.barrier, mat("#d7d1c6", 0.72, 0.04), 0, 0, 0);
    add(g, geoBox(0.36, 0.08, 0.74), mat("#f0c14d", 0.5, 0.08), 0, 0.36, 0);
    return g;
  }

  function buildPothole() {
    var THREE = T();
    var g = new THREE.Group();
    var rim = add(g, new THREE.TorusGeometry(0.38, 0.06, 8, 16), mat("#5c564e", 0.8, 0.05), 0, 0.04, 0);
    rim.rotation.x = Math.PI / 2;
    var hole = add(g, new THREE.CircleGeometry(0.34, 16), mat("#1a1614", 0.9, 0.02), 0, 0.045, 0);
    hole.rotation.x = -Math.PI / 2;
    hole.castShadow = false;
    return g;
  }

  function buildScaffold() {
    var THREE = T();
    var g = new THREE.Group();
    add(g, new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8), mat("#c5c8ce", 0.45, 0.4), -0.55, 1.05, 0);
    add(g, new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8), mat("#c5c8ce", 0.45, 0.4), 0.55, 1.05, 0);
    add(g, new THREE.CylinderGeometry(0.045, 0.045, 1.2, 8), mat("#f0c14d", 0.4, 0.35), 0, 1.22, 0).rotation.z = Math.PI / 2;
    var i;
    for (i = 0; i < 4; i++) {
      add(g, geoBox(0.12, 0.05, 0.08), mat(i % 2 ? "#241820" : "#e23b3b", 0.5, 0.1), -0.36 + i * 0.24, 1.22, 0);
    }
    return g;
  }

  function buildSign() {
    var THREE = T();
    var g = new THREE.Group();
    add(g, new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), mat("#c5c8ce", 0.4, 0.4), -0.28, 1.7, 0);
    add(g, new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), mat("#c5c8ce", 0.4, 0.4), 0.28, 1.7, 0);
    add(g, geoBox(1.15, 0.42, 0.08), mat("#fffaf2", 0.55, 0.05), 0, 1.28, 0);
    add(g, geoBox(0.7, 0.12, 0.02), mat("#d4534a", 0.5, 0.08), 0, 1.28, -0.05);
    return g;
  }

  function buildBranch() {
    var THREE = T();
    var g = new THREE.Group();
    var limb1 = add(g, geoCapsule(0.035, 0.5), mat("#6b4a32", 0.8, 0.02), 0.15, 1.55, 0);
    limb1.rotation.z = 0.9;
    var blossom = add(g, geoSphere(0.28, 14, 12), mat("#9b59b6", 0.7, 0.02), -0.15, 1.25, 0);
    blossom.scale.set(1.3, 0.7, 1);
    add(g, geoSphere(0.16, 12, 10), mat("#d7a4e2", 0.65, 0.02), 0.05, 1.4, -0.05);
    add(g, geoSphere(0.12, 10, 8), mat("#7d3c98", 0.7, 0.02), -0.28, 1.18, 0.05);
    return g;
  }

  function buildBoom(open) {
    var THREE = T();
    var g = new THREE.Group();
    add(g, geoBox(0.08, 1.7, 0.08), mat("#2c3138", 0.5, 0.3), 0.42, 0.85, 0);
    var cols = open ? ["#3a2424", "#3a3420", "#1fa971"] : ["#e23b3b", "#3a3420", "#1d3a2c"];
    var i;
    for (i = 0; i < 3; i++) {
      var lamp = add(g, geoSphere(0.055, 10, 8), mat(cols[i], 0.4, 0.1), 0.42, 1.45 - i * 0.16, -0.02);
      if ((open && i === 2) || (!open && i === 0)) {
        lamp.material = lamp.material.clone();
        lamp.material.emissive = new (T()).Color(cols[i]);
        lamp.material.emissiveIntensity = 0.85;
      }
    }
    var arm = pivot(g, -0.15, 1.15, 0);
    add(arm, geoBox(0.85, 0.07, 0.06), mat("#f0c14d", 0.45, 0.15), 0.4, 0, 0);
    var k;
    for (k = 0; k < 4; k++) add(arm, geoBox(0.08, 0.075, 0.065), mat("#241820", 0.6, 0.1), 0.18 + k * 0.18, 0, 0);
    arm.rotation.z = open ? -1.15 : 0;
    g.userData.arm = arm;
    return g;
  }

  function buildFare(variant) {
    var THREE = T();
    var shirts = ["#ffb703", "#49c2b0", "#d4534a"];
    var skins = ["#e0aa78", "#6e3e2e", "#c4845c"];
    var g = new THREE.Group();
    var shirt = mat(shirts[variant % 3], 0.6, 0.05);
    var skin = mat(skins[variant % 3], 0.58, 0.02, "skin");
    var hips = pivot(g, 0, 0.72, 0);
    add(hips, geoCapsule(0.11, 0.28), shirt, 0, 0.12, 0);
    add(hips, geoSphere(0.11, 14, 12), skin, 0, 0.42, 0);
    add(hips, geoSphere(0.09, 10, 8), mat("#1b140f", 0.8, 0.04), 0, 0.5, 0.01);
    var arm = pivot(hips, 0.12, 0.28, 0);
    limb(arm, 0.28, 0.035, shirt);
    g.userData.arm = arm;
    limb(pivot(hips, -0.08, 0, 0), 0.34, 0.045, mat("#24507a", 0.7, 0.02));
    limb(pivot(hips, 0.08, 0, 0), 0.34, 0.045, mat("#24507a", 0.7, 0.02));
    var ring = add(g, new THREE.TorusGeometry(0.28, 0.025, 8, 16), mat("#f0c14d", 0.4, 0.3), 0, 0.04, 0);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = false;
    return g;
  }

  function buildCoin() {
    var THREE = T();
    var g = new THREE.Group();
    var disc = add(g, new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), mat("#f0c14d", 0.32, 0.75).clone(), 0, 0.9, 0);
    disc.material.emissive = new THREE.Color("#a97820");
    disc.material.emissiveIntensity = 0.15;
    return g;
  }

  function buildShield() {
    var THREE = T();
    var g = new THREE.Group();
    var cols = ["#fffaf2", "#d4534a", "#2d439e", "#128f86", "#ffb703"];
    var i;
    for (i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2;
      add(g, geoSphere(0.045, 8, 6), mat(cols[i % cols.length], 0.4, 0.1), Math.cos(a) * 0.16, 1.15 + Math.sin(a) * 0.16, 0);
    }
    return g;
  }

  function buildKota() {
    var g = new (T()).Group();
    add(g, geoSphere(0.16, 14, 12), mat("#e6c48a", 0.7, 0.02), 0, 0.85, 0).scale.set(1.3, 0.7, 0.9);
    add(g, geoBox(0.16, 0.04, 0.12), mat("#f2d15a", 0.6, 0.02), 0, 0.9, -0.02);
    add(g, geoBox(0.16, 0.035, 0.12), mat("#d4534a", 0.6, 0.02), 0, 0.94, -0.02);
    return g;
  }

  function buildChevron() {
    var THREE = T();
    var g = new THREE.Group();
    var cone = add(g, new THREE.ConeGeometry(0.12, 0.28, 4), mat("#f0c14d", 0.4, 0.1).clone(), 0, 0.08, 0);
    cone.rotation.x = Math.PI / 2;
    g.userData.cone = cone;
    return g;
  }

  root.MESH = {
    CAST: CAST,
    STRIPES: STRIPES,
    buildRunner: buildRunner,
    buildTaxi: buildTaxi,
    buildDrums: buildDrums,
    buildBarrier: buildBarrier,
    buildPothole: buildPothole,
    buildScaffold: buildScaffold,
    buildSign: buildSign,
    buildBranch: buildBranch,
    buildBoom: buildBoom,
    buildFare: buildFare,
    buildCoin: buildCoin,
    buildShield: buildShield,
    buildKota: buildKota,
    buildChevron: buildChevron,
    mat: mat
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
