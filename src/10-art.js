// EISH! Jozi Run — original cast and props.
// Characters are sculpted meshes (displaced head, clothing shells, sneaker blocks),
// not a stack of balls and tubes. All geometry in this file is original.
// +rotation.x on a limb swings it toward -Z, forward down the street.
(function (root) {
  "use strict";
  function three() { return root.THREE; }

  var CAST = [
    {
      id: "lerato", name: "Lerato", place: "Braamfontein",
      line: "This review build is Lerato only. Jacket, trousers, and a run on the new rig.",
      skin: "#c4845c", skinDeep: "#8d5340",
      hair: "#1b140f", band: "#ff6b4a",
      cloth: "#14988e", clothDeep: "#0c645e",
      accent: "#ff6b4a", pants: "#173632", shoe: "#f4f1ea", kick: "#ff6b4a",
      style: "bun", bob: 1.12, arm: 1.05, lean: 0.16
    },
    {
      id: "jabu", name: "Jabu", place: "Yeoville",
      line: "Open red shirt, cuffed trousers. He slips the gap between the minibuses.",
      skin: "#e0aa78", skinDeep: "#b67c4c",
      hair: "#16120e", band: "#f7f4ee",
      cloth: "#d4534a", clothDeep: "#9a302c",
      accent: "#f7f4ee", pants: "#c6a15a", shoe: "#f7f4ee", kick: "#d4534a",
      style: "fade", bob: 0.82, arm: 0.88, lean: 0.1
    },
    {
      id: "naledi", name: "Naledi", place: "Maboneng",
      line: "Braids, a colour-block jacket, paint on one cuff. She runs the streets she paints.",
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

  function jacketGeo(wide) {
    var THREE = T();
    var key = "jack" + wide;
    if (GEO[key]) return GEO[key];
    var s = new THREE.Shape();
    var w = wide;
    s.moveTo(-w * 0.78, 0.02);
    s.quadraticCurveTo(-w * 0.95, 0.18, -w * 0.92, 0.3);
    s.quadraticCurveTo(-w * 0.7, 0.4, -w * 0.32, 0.42);
    s.lineTo(w * 0.32, 0.42);
    s.quadraticCurveTo(w * 0.7, 0.4, w * 0.92, 0.3);
    s.quadraticCurveTo(w * 0.95, 0.18, w * 0.78, 0.02);
    s.closePath();
    var g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 1 });
    g.translate(0, 0, -0.1);
    GEO[key] = g;
    return g;
  }

  function clothLathe(hip, waist, chest, height) {
    var THREE = T();
    var pts = [];
    var i;
    for (i = 0; i <= 14; i++) {
      var t = i / 14;
      var y = t * height;
      var r = t < 0.38 ? hip + (waist - hip) * (t / 0.38) : waist + (chest - waist) * ((t - 0.38) / 0.62);
      pts.push(new THREE.Vector2(Math.max(0.05, r), y));
    }
    return new THREE.LatheGeometry(pts, 18);
  }

  function sculptHead(opt) {
    var THREE = T();
    var key = "head" + opt.id;
    if (GEO[key]) return GEO[key];
    var geo = new THREE.SphereGeometry(1, 48, 36);
    var pos = geo.attributes.position;
    var dir = new THREE.Vector3();
    var nose = opt.nose || 1;
    var lip = opt.lip || 1;
    var jaw = opt.jaw || 1;
    var i;
    for (i = 0; i < pos.count; i++) {
      dir.fromBufferAttribute(pos, i).normalize();
      var x = dir.x, y = dir.y, z = dir.z;
      var px = x * 0.112;
      var py = y * 0.128;
      var pz = z * 0.108;
      if (y < 0.08) {
        var t = Math.min(1, (0.08 - y) / 0.95);
        var pinch = 1 - 0.38 * jaw * t * t;
        px *= pinch;
        pz *= 1 - 0.05 * t;
      }
      function blob(cx, cy, cz, ax, ay, az) {
        var dx = (x - cx) / ax, dy = (y - cy) / ay, dz = (z - cz) / az;
        var d = dx * dx + dy * dy + dz * dz;
        return d < 1 ? (1 - d) * (1 - d) : 0;
      }
      var socket = blob(0.34, 0.08, -0.62, 0.2, 0.14, 0.42) + blob(-0.34, 0.08, -0.62, 0.2, 0.14, 0.42);
      if (z < -0.05) pz += socket * 0.022;
      var brow = blob(0.32, 0.28, -0.7, 0.26, 0.1, 0.45) + blob(-0.32, 0.28, -0.7, 0.26, 0.1, 0.45);
      if (z < 0) pz -= brow * 0.014;
      var bridge = Math.exp(-(x * x) / 0.012) * Math.exp(-((y + 0.02) * (y + 0.02)) / 0.09) * Math.max(0, -z - 0.15);
      pz -= bridge * 0.038 * nose;
      var ala = blob(0.1, -0.16, -0.82, 0.09, 0.07, 0.16) + blob(-0.1, -0.16, -0.82, 0.09, 0.07, 0.16);
      pz -= ala * 0.012 * nose;
      var lips = Math.exp(-(x * x) / 0.018) * Math.exp(-((y + 0.42) * (y + 0.42)) / 0.015) * Math.max(0, -z);
      pz -= lips * 0.02 * lip;
      var crease = Math.exp(-(x * x) / 0.02) * Math.exp(-((y + 0.46) * (y + 0.46)) / 0.0035) * Math.max(0, -z);
      pz += crease * 0.008;
      var chin = Math.exp(-(x * x) / 0.03) * Math.exp(-((y + 0.72) * (y + 0.72)) / 0.05) * Math.max(0, -z);
      py -= chin * 0.01;
      pz -= chin * 0.012;
      var cheek = blob(0.55, -0.02, -0.35, 0.38, 0.32, 0.45) + blob(-0.55, -0.02, -0.35, 0.38, 0.32, 0.45);
      px += (x > 0 ? 1 : -1) * cheek * 0.006;
      pos.setXYZ(i, px, py, pz);
    }
    geo.computeVertexNormals();
    GEO[key] = geo;
    return geo;
  }

  function hairCap(id, lift) {
    var THREE = T();
    var key = "haircap" + id;
    if (GEO[key]) return GEO[key];
    var src = GEO["head" + id];
    var geo = src.clone();
    var pos = geo.attributes.position;
    var v = new THREE.Vector3();
    var keep = [];
    var i;
    for (i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      var face = v.z < -0.02 && v.y < 0.07;
      if (face) pos.setXYZ(i, v.x * 0.25, Math.min(v.y, 0.02), Math.min(0, v.z) * 0.25);
      else {
        var n = v.clone().normalize();
        var extra = v.y > 0.04 ? lift : lift * 0.65;
        pos.setXYZ(i, v.x + n.x * extra, v.y + n.y * extra + 0.006, v.z + n.z * extra);
      }
    }
    geo.computeVertexNormals();
    GEO[key] = geo;
    return geo;
  }

  function buildRunner(index) {
    var THREE = T();
    var c = CAST[index];
    var skin = mat(c.skin, 0.62, 0.02, "skin");
    var cloth = mat(c.cloth, 0.78, 0.04);
    var clothD = mat(c.clothDeep, 0.82, 0.03);
    var pants = mat(c.pants, 0.8, 0.02);
    var hair = mat(c.hair, 0.88, 0.03);
    var shoe = mat(c.shoe, 0.42, 0.06);
    var kick = mat(c.kick, 0.4, 0.1);
    var accent = mat(c.accent, 0.55, 0.06);
    var soleMat = mat("#241820", 0.75, 0.04);
    var lipMat = mat(c.style === "twists" ? "#6a302c" : "#a85a58", 0.5, 0.02);
    var root = new THREE.Group();
    root.name = c.id;

    var hips = pivot(root, 0, 0.96, 0);
    var torso = add(hips, jacketGeo(c.style === "fade" ? 0.17 : 0.15), cloth, 0, 0.02, 0);
    add(hips, geoBox(0.24, 0.1, 0.16), pants, 0, 0.02, 0);
    if (c.style === "bun") {
      var colL = add(hips, geoBox(0.05, 0.07, 0.03), clothD, -0.05, 0.38, -0.09);
      colL.rotation.z = 0.5;
      var colR = add(hips, geoBox(0.05, 0.07, 0.03), clothD, 0.05, 0.38, -0.09);
      colR.rotation.z = -0.5;
    } else if (c.style === "fade") {
      add(hips, geoBox(0.07, 0.05, 0.02), skin, 0, 0.38, -0.1);
      add(hips, geoBox(0.05, 0.045, 0.015), clothD, 0.07, 0.2, -0.105);
    } else {
      add(hips, geoBox(0.16, 0.1, 0.04), accent, -0.08, 0.34, -0.1);
      add(hips, geoBox(0.05, 0.04, 0.02), mat("#49c2b0", 0.5, 0.05), 0.12, 0.12, -0.1);
    }

    var neck = pivot(hips, 0, 0.46, 0);
    add(neck, geoCapsule(0.045, 0.05), skin, 0, 0.03, 0);
    var headP = pivot(neck, 0, 0.1, 0);
    var headOpt = {
      id: c.id,
      nose: c.style === "fade" ? 1.05 : c.style === "twists" ? 0.92 : 0.88,
      lip: c.style === "twists" ? 1.15 : 1,
      jaw: c.style === "fade" ? 0.92 : 1
    };
    sculptHead(headOpt);
    add(headP, sculptHead(headOpt), skin, 0, 0.02, 0);
    hairCap(c.id, c.style === "bun" ? 0.012 : 0.016);
    var cap = add(headP, hairCap(c.id, 0.014), hair, 0, 0.02, 0);
    cap.castShadow = true;

    function eye(x) {
      var g = pivot(headP, x, 0.028, -0.112);
      var white = add(g, geoSphere(0.02, 14, 12), mat("#f7f3ee", 0.3, 0.02), 0, 0, 0);
      white.scale.set(1.35, 0.62, 0.5);
      var iris = add(g, geoSphere(0.01, 12, 10), mat("#3b2318", 0.35, 0.04), 0, -0.001, -0.012);
      add(g, geoSphere(0.004, 8, 6), mat("#ffffff", 0.15, 0), -0.004, 0.004, -0.02).castShadow = false;
      var lid = add(g, geoSphere(0.024, 12, 10), skin, 0, 0.01, -0.004);
      lid.scale.set(1.2, 0.42, 0.55);
      return { white: white, iris: iris };
    }
    var eyeL = eye(-0.034);
    var eyeR = eye(0.034);
    function brow(x, tilt) {
      var b = add(headP, geoBox(0.038, 0.007, 0.01), hair, x, 0.055, -0.112);
      b.rotation.z = tilt;
    }
    brow(-0.038, c.style === "fade" ? -0.05 : 0.15);
    brow(0.04, c.style === "fade" ? 0.05 : -0.12);
    var nose = add(headP, geoSphere(0.018, 10, 8), skin, 0, -0.012, -0.125);
    nose.scale.set(0.7, 0.9, 1.3);
    var mouth = add(headP, geoBox(0.032, 0.008, 0.01), lipMat, 0, -0.048, -0.118);
    mouth.castShadow = false;
    add(headP, geoBox(0.026, 0.005, 0.008), skin, 0, -0.042, -0.12);
    add(headP, geoSphere(0.028, 10, 8), skin, -0.108, 0.0, 0.01).scale.set(0.38, 0.7, 0.45);
    add(headP, geoSphere(0.028, 10, 8), skin, 0.11, 0.0, 0.01).scale.set(0.38, 0.7, 0.45);
    if (c.style === "bun") {
      var hoop = add(headP, new THREE.TorusGeometry(0.016, 0.003, 6, 12), mat("#e6c36a", 0.3, 0.7), -0.118, -0.02, 0);
      hoop.rotation.y = Math.PI / 2;
    }

    if (c.style === "bun") {
      var puff = add(headP, geoSphere(0.095, 20, 16), hair, 0, 0.155, 0.01);
      puff.scale.set(1.2, 0.85, 1.08);
      var wrap = add(headP, new THREE.TorusGeometry(0.055, 0.012, 8, 18), accent, 0, 0.07, 0.01);
      wrap.rotation.x = Math.PI / 2.4;
      add(headP, geoSphere(0.04, 12, 10), hair, -0.07, 0.06, -0.02);
      add(headP, geoSphere(0.035, 12, 10), hair, 0.065, 0.055, -0.01);
    } else if (c.style === "fade") {
      cap.scale.set(1.02, 0.72, 0.98);
      cap.position.y = 0.055;
    } else {
      var bi;
      for (bi = 0; bi < 11; bi++) {
        var ang = -2.5 + bi * 0.48;
        var len = 0.28 + (bi % 3) * 0.05;
        var ax = Math.sin(ang) * 0.07;
        var az = Math.cos(ang) * 0.05;
        var curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(ax, 0.06, az),
          new THREE.Vector3(ax * 1.3, -len * 0.35, az * 0.4 + 0.02),
          new THREE.Vector3(ax * 0.8, -len, 0.03)
        );
        var tube = new THREE.TubeGeometry(curve, 5, 0.014, 5, false);
        add(headP, tube, hair, 0, 0.02, 0).castShadow = false;
        if (bi % 3 === 0) {
          add(headP, geoSphere(0.014, 8, 6), mat(c.beads[bi % c.beads.length], 0.4, 0.15), ax * 0.8, 0.02 - len, 0.03).castShadow = false;
        }
      }
    }

    function arm(side) {
      var s = side < 0 ? -1 : 1;
      var shoulder = pivot(hips, s * (c.style === "fade" ? 0.18 : 0.16), 0.34, 0);
      add(shoulder, geoSphere(0.05, 12, 10), cloth, 0, 0, 0);
      var upper = pivot(shoulder, s * 0.015, -0.02, 0);
      var sleeve = limb(upper, 0.28, c.style === "fade" ? 0.052 : 0.048, cloth);
      sleeve.scale.x = 1.05;
      if (c.style === "fade") add(upper, geoBox(0.09, 0.03, 0.09), clothD, 0, -0.24, 0);
      var elbow = pivot(upper, 0, -0.22, 0);
      var foreMat = c.style === "fade" ? skin : cloth;
      var fore = pivot(elbow, 0, -0.01, 0);
      limb(fore, 0.24, c.style === "fade" ? 0.04 : 0.042, foreMat);
      if (c.style !== "fade") add(fore, geoBox(0.07, 0.03, 0.07), clothD, 0, -0.2, 0);
      if (c.style === "twists" && s < 0) add(fore, geoBox(0.04, 0.02, 0.02), mat("#49c2b0", 0.45, 0.05), 0, -0.12, -0.03);
      var hand = add(fore, geoSphere(0.034, 12, 10), skin, s * 0.01, -0.24, 0);
      hand.scale.set(0.7, 0.95, 0.48);
      add(fore, geoSphere(0.014, 8, 6), skin, s * 0.03, -0.22, -0.02);
      return { upper: upper, fore: fore };
    }
    var aL = arm(-1);
    var aR = arm(1);

    function leg(side) {
      var s = side < 0 ? -1 : 1;
      var wide = c.style === "twists" ? 0.1 : 0.09;
      var hipJ = pivot(hips, s * wide, 0.02, 0);
      limb(hipJ, 0.46, c.style === "fade" ? 0.078 : 0.07, pants);
      var knee = pivot(hipJ, 0, -0.36, 0);
      var shin = pivot(knee, 0, -0.01, 0);
      limb(shin, 0.4, c.style === "twists" ? 0.055 : 0.048, pants);
      add(shin, geoBox(c.style === "twists" ? 0.12 : 0.1, 0.03, 0.1), clothD, 0, -0.36, 0);
      var ankle = pivot(shin, 0, -0.4, 0);
      add(ankle, geoBox(0.078, 0.02, 0.22), soleMat, 0, -0.055, -0.02);
      add(ankle, geoBox(0.07, 0.016, 0.2), shoe, 0, -0.038, -0.02);
      add(ankle, geoBox(0.062, 0.038, 0.13), shoe, 0, -0.012, -0.015);
      add(ankle, geoBox(0.064, 0.03, 0.05), shoe, 0, -0.01, -0.09);
      add(ankle, geoBox(0.05, 0.028, 0.025), kick, 0, 0.0, 0.055);
      add(ankle, geoBox(0.04, 0.008, 0.03), mat("#fffaf2", 0.5, 0.02), 0, 0.006, -0.02);
      add(ankle, geoBox(0.04, 0.008, 0.03), mat("#fffaf2", 0.5, 0.02), 0, 0.006, -0.05);
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
      { p: 0.00, v: 0.72 }, { p: 0.14, v: 0.1 }, { p: 0.36, v: -0.82 },
      { p: 0.52, v: -0.1 }, { p: 0.7, v: 1.2 }, { p: 1.00, v: 0.72 }
    ];
    var KNEE = [
      { p: 0.00, v: -0.2 }, { p: 0.14, v: -0.55 }, { p: 0.34, v: -0.18 },
      { p: 0.5, v: -1.6 }, { p: 0.68, v: -1.2 }, { p: 0.88, v: -0.32 }, { p: 1.00, v: -0.2 }
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
        thighL = 1.2 * k; thighR = 1.25 * k;
        kneeL = -1.45 * k; kneeR = -1.5 * k;
        armL = -1.35 * k; armR = -1.2 * k;
        foreL = -0.9; foreR = -0.85;
        lean = 0.04; hipY = 0.96; hipTwist = 0; spineTwist = 0; roll = 0;
        headX = -0.12 * k; headY = 0; footFlat = 0.3;
      } else if (mode === "slide") {
        thighL = 1.35; kneeL = -0.4; thighR = 0.1; kneeR = -1.35;
        armL = 0.4; armR = 0.2; foreL = -0.3; foreR = -1.2;
        lean = -0.7; hipY = 0.62; hipTwist = 0; spineTwist = 0; roll = 0;
        headX = 0.22; headY = 0.1; footFlat = 0.65;
      } else if (mode === "hit") {
        thighL = 0.2; thighR = -0.45; kneeL = -0.3; kneeR = -0.4;
        armL = -1.4; armR = -0.9; foreL = -0.5; foreR = -0.6;
        lean = -0.3; hipY = 0.92; hipTwist = 0; spineTwist = 0; roll = 0;
        headX = -0.2; headY = 0; footFlat = 0.8;
      } else if (mode === "idle") {
        var w = Math.sin((info.t || 0) * 1.6);
        thighL = 0.08; thighR = -0.02; kneeL = -0.12; kneeR = -0.08;
        armL = 0.08; armR = 0.06; foreL = -0.2; foreR = -0.18;
        lean = 0.04; hipY = 0.96 + w * 0.008; hipTwist = w * 0.02; spineTwist = -w * 0.02; roll = 0;
        headX = -0.04; headY = 0.08; footFlat = 1;
      } else {
        thighL = sample(THIGH, cycle);
        thighR = sample(THIGH, cycle + 0.5);
        kneeL = sample(KNEE, cycle);
        kneeR = sample(KNEE, cycle + 0.5);
        armL = -thighL * 0.95 * c.arm;
        armR = -thighR * 0.95 * c.arm;
        foreL = -0.2 - 1.05 * Math.max(0, -armL);
        foreR = -0.2 - 1.05 * Math.max(0, -armR);
        var weight = Math.cos(cycle * Math.PI * 2);
        lean = c.lean + 0.06 * weight;
        hipY = 0.96 - 0.05 * Math.cos(cycle * Math.PI * 4) * c.bob;
        hipTwist = -0.12 * weight;
        spineTwist = 0.18 * weight;
        roll = 0.08 * weight;
        headX = 0.04; headY = -0.05 * weight;
        footFlat = 1;
      }
      if (!smoothed) smoothed = { thighL: thighL, thighR: thighR, kneeL: kneeL, kneeR: kneeR, armL: armL, armR: armR, foreL: foreL, foreR: foreR, lean: lean, hipY: hipY, hipTwist: hipTwist, spineTwist: spineTwist, roll: roll, headX: headX, headY: headY };
      var blend = 1 - Math.exp(-26 * dt);
      var key;
      var next = { thighL: thighL, thighR: thighR, kneeL: kneeL, kneeR: kneeR, armL: armL, armR: armR, foreL: foreL, foreR: foreR, lean: lean, hipY: hipY, hipTwist: hipTwist, spineTwist: spineTwist, roll: roll, headX: headX, headY: headY };
      for (key in next) smoothed[key] = smoothed[key] + (next[key] - smoothed[key]) * blend;
      hips.position.y = smoothed.hipY;
      hips.position.x = smoothed.roll * 0.035;
      hips.rotation.y = smoothed.hipTwist;
      hips.rotation.x = smoothed.lean;
      hips.rotation.z = smoothed.roll;
      torso.rotation.y = smoothed.spineTwist;
      lL.thigh.rotation.x = smoothed.thighL;
      lR.thigh.rotation.x = smoothed.thighR;
      var liftL = Math.max(0, -smoothed.kneeL - 0.35);
      var liftR = Math.max(0, -smoothed.kneeR - 0.35);
      lL.thigh.rotation.z = 0.28 * liftL;
      lR.thigh.rotation.z = -0.28 * liftR;
      lL.shin.rotation.x = smoothed.kneeL;
      lR.shin.rotation.x = smoothed.kneeR;
      aL.upper.rotation.x = smoothed.armL;
      aR.upper.rotation.x = smoothed.armR;
      aL.upper.rotation.z = -0.22;
      aR.upper.rotation.z = 0.2;
      aL.fore.rotation.x = smoothed.foreL;
      aR.fore.rotation.x = smoothed.foreR;
      lL.ankle.rotation.x = -(smoothed.thighL + smoothed.kneeL) * 0.82 * footFlat + Math.max(0, -smoothed.thighL) * 0.3;
      lR.ankle.rotation.x = -(smoothed.thighR + smoothed.kneeR) * 0.82 * footFlat + Math.max(0, -smoothed.thighR) * 0.3;
      headP.rotation.x = smoothed.headX;
      headP.rotation.y = smoothed.headY;
      var blink = info.blink ? 0.15 : 1;
      eyeL.white.scale.y = blink;
      eyeR.white.scale.y = blink;
      eyeL.iris.scale.y = blink;
      eyeR.iris.scale.y = blink;
    }

    apply({ mode: "idle", phase: 0, t: 0, dt: 0.05 });
    return { object: root, animate: apply, cast: c };
  }

  function stripeMat(color) { return mat(color, 0.4, 0.2); }
  var STRIPES = ["#1f8f5a", "#2a6fbf", "#d4534a", "#e2a12b", "#7a4ad4"];

  function buildTaxi(variant) {
    var THREE = T();
    var g = new THREE.Group();
    var paint = mat("#f3efe6", 0.55, 0.08);
    var body = add(g, geoBox(1.05, 1.28, 2.55), paint, 0, 0.95, 0);
    var band = add(g, geoBox(1.08, 0.16, 2.57), stripeMat(STRIPES[(variant || 0) % STRIPES.length]), 0, 0.72, 0);
    band.castShadow = false;
    var glass = add(g, geoBox(0.98, 0.42, 1.7), glassMat(), 0, 1.28, -0.05);
    glass.castShadow = false;
    add(g, geoBox(0.9, 0.36, 0.06), glassMat(), 0, 1.22, 1.28);
    add(g, geoBox(0.04, 0.9, 2.2), mat("#d7d2c6", 0.6, 0.05), 0.52, 1.05, 0);
    add(g, geoBox(0.22, 0.08, 0.04), mat("#e23b3b", 0.45, 0.1), -0.28, 0.55, 1.28);
    add(g, geoBox(0.22, 0.08, 0.04), mat("#e23b3b", 0.45, 0.1), 0.28, 0.55, 1.28);
    add(g, geoBox(1.08, 0.08, 0.16), mat("#2a2428", 0.65, 0.2), 0, 0.38, 1.15);
    function wheel(x, z) {
      var w = add(g, new THREE.CylinderGeometry(0.22, 0.22, 0.14, 12), mat("#1a1618", 0.7, 0.2), x, 0.22, z);
      w.rotation.z = Math.PI / 2;
    }
    wheel(-0.52, 0.85);
    wheel(0.52, 0.85);
    wheel(-0.52, -0.85);
    wheel(0.52, -0.85);
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
