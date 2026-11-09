// EISH! Jozi Run — real-time 3D street.
// The runner stays near the origin and faces -Z. The camera sits behind them.
// Buildings start ahead of the camera, inset from the lens, so a near wall cannot fill the screen.
// World Z = travel - mile. Ahead is negative Z.
(function (root) {
  "use strict";
  var BUILD_INSET = 3.55;
  var VIEW = { mobile: false };

  function three() { return root.THREE; }

  var renderer, scene, camera, sun, roadMat, world, runners, active, clockReady;
  var props = [];
  var trees = [];
  var buildings = [];
  var lamps = [];
  var skyline = [];
  var failReason = "";

  function facadeTexture(style) {
    var THREE = three();
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    var g = canvas.getContext("2d");
    var walls = ["#e7d3b0", "#e07a52", "#cfc8bc", "#f3e6c4", "#6a7580"];
    var accents = ["#d4534a", "#128f86", "#ffb703", "#7a4ad4", "#2a6fbf"];
    g.fillStyle = walls[style % walls.length];
    g.fillRect(0, 0, 256, 512);
    if (style === 4) {
      g.fillStyle = "#ffb703";
      g.beginPath();
      g.arc(128, 230, 70, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#128f86";
      g.beginPath();
      g.moveTo(40, 340);
      g.lineTo(128, 160);
      g.lineTo(216, 340);
      g.fill();
      g.fillStyle = accents[0];
      g.fillRect(96, 300, 64, 90);
    }
    var row, col;
    for (row = 0; row < 7; row++) {
      for (col = 0; col < 4; col++) {
        var lit = ((style * 3 + row * 5 + col * 2) % 7) === 0;
        g.fillStyle = lit ? "#ffe1a8" : "#243044";
        g.fillRect(28 + col * 56, 36 + row * 62, 34, 42);
        g.strokeStyle = "rgba(36,24,32,0.35)";
        g.strokeRect(28 + col * 56, 36 + row * 62, 34, 42);
      }
    }
    g.fillStyle = accents[style % accents.length];
    g.fillRect(18, 430, 220, 28);
    g.fillStyle = "#fffaf2";
    g.font = "700 22px Trebuchet MS, sans-serif";
    g.textAlign = "center";
    g.fillText(["KOTA", "RANK", "SHARP", "BEADS", "AIR"][style % 5], 128, 452);
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  function roadTexture() {
    var THREE = three();
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    var g = canvas.getContext("2d");
    g.fillStyle = "#3e3a36";
    g.fillRect(0, 0, 256, 512);
    var i;
    for (i = 0; i < 180; i++) {
      g.fillStyle = "rgba(255,255,255,0.015)";
      g.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
    }
    g.strokeStyle = "rgba(244,239,228,0.9)";
    g.lineWidth = 6;
    g.setLineDash([36, 28]);
    g.beginPath();
    g.moveTo(86, 0);
    g.lineTo(86, 512);
    g.moveTo(170, 0);
    g.lineTo(170, 512);
    g.stroke();
    g.setLineDash([]);
    g.strokeStyle = "#e2b84a";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(8, 0);
    g.lineTo(8, 512);
    g.moveTo(248, 0);
    g.lineTo(248, 512);
    g.stroke();
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 12);
    tex.anisotropy = 4;
    return tex;
  }

  function skyTexture() {
    var THREE = three();
    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 256;
    var g = canvas.getContext("2d");
    var grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, "#6eb6d6");
    grd.addColorStop(0.45, "#f3a36a");
    grd.addColorStop(0.75, "#f6c98a");
    grd.addColorStop(1, "#f3d7b0");
    g.fillStyle = grd;
    g.fillRect(0, 0, 16, 256);
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeBuilding(style) {
    var THREE = three();
    var tex = facadeTexture(style);
    var mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.86, metalness: 0.02 });
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    var roof = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 1.05), new THREE.MeshStandardMaterial({ color: "#cbb89a", roughness: 0.8 }));
    roof.position.y = 0.54;
    mesh.add(roof);
    var awning = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.05, 0.22), new THREE.MeshStandardMaterial({ color: style % 2 ? "#c4473a" : "#1f8f7a", roughness: 0.7 }));
    awning.position.set(0, -0.28, -0.58);
    mesh.add(awning);
    if (style % 3 !== 2) {
      var bal = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.16), new THREE.MeshStandardMaterial({ color: "#d9d3c7", roughness: 0.8 }));
      bal.position.set(0, 0.08, -0.55);
      mesh.add(bal);
    }
    if (style % 2 === 0) {
      var tank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 8), new THREE.MeshStandardMaterial({ color: "#8d9398", roughness: 0.5, metalness: 0.4 }));
      tank.position.set(0.2, 0.66, 0.1);
      mesh.add(tank);
    }
    return mesh;
  }

  function makeTree() {
    var THREE = three();
    var g = new THREE.Group();
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 1.6, 8), new THREE.MeshStandardMaterial({ color: "#6b4a32", roughness: 0.85 }));
    trunk.position.y = 0.8;
    trunk.castShadow = true;
    g.add(trunk);
    var cols = ["#8e4ea8", "#c98ad4", "#6d3488", "#e4c0ef"];
    var i;
    for (i = 0; i < 5; i++) {
      var canopy = new THREE.Mesh(new THREE.SphereGeometry(0.42 - (i % 3) * 0.06, 12, 10), new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.78 }));
      canopy.position.set((i - 2) * 0.22, 1.55 + (i % 2) * 0.22, (i % 3 - 1) * 0.12);
      canopy.scale.set(1.2, 0.7, 1);
      canopy.castShadow = true;
      g.add(canopy);
    }
    return g;
  }

  function init(container) {
    var THREE = three();
    failReason = "";
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch (err) {
      failReason = err && err.message ? err.message : "WebGL renderer failed.";
      return { ok: false, error: failReason };
    }
    if (!renderer || !renderer.getContext()) {
      failReason = "WebGL context was not created.";
      return { ok: false, error: failReason };
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xf3d7b0, 1);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = skyTexture();
    scene.fog = new THREE.Fog(0xf0c49a, 22, 68);

    camera = new THREE.PerspectiveCamera(62, 1, 0.1, 120);

    scene.add(new THREE.AmbientLight(0xfff2e0, 0.28));
    var hemi = new THREE.HemisphereLight(0x9fd0ea, 0xc4895c, 0.55);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(0xffe0b8, 2.5);
    sun.position.set(5, 14, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 36;
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -14;
    sun.shadow.bias = -0.0008;
    scene.add(sun);
    scene.add(sun.target);
    var rim = new THREE.DirectionalLight(0xffd2a8, 0.85);
    rim.position.set(-4, 3, 6);
    scene.add(rim);

    var map = roadTexture();
    roadMat = new THREE.MeshStandardMaterial({ map: map, roughness: 0.92, metalness: 0.02 });
    var road = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 140), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -15);
    road.receiveShadow = true;
    scene.add(road);

    var walkMat = new THREE.MeshStandardMaterial({ color: "#d9c4a4", roughness: 0.95 });
    var leftWalk = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 140), walkMat);
    leftWalk.rotation.x = -Math.PI / 2;
    leftWalk.position.set(-3.15, 0.02, -15);
    leftWalk.receiveShadow = true;
    scene.add(leftWalk);
    var rightWalk = leftWalk.clone();
    rightWalk.position.x = 3.15;
    scene.add(rightWalk);

    var i;
    for (i = 0; i < 5; i++) buildings.push(makeBuilding(i));
    for (i = 0; i < 16; i++) {
      var b = buildings[i % 5].clone();
      b.material = buildings[i % 5].material;
      scene.add(b);
      buildings[i] = b;
    }
    // The first 5 were templates also added? I pushed templates then overwrote. Templates not in scene except if I added them. I didn't add templates. Then I clone into buildings[i], but buildings[0..4] were templates and get replaced. The clones of early ones are fine. Wait: loop i=0 replaces buildings[0] which was a template, after clone. clone happens before replace. Good. But buildings.length was 5, then we set [0]..[15], so length becomes 16. Good.
    // Remove the unused extra references... OK.

    for (i = 0; i < 14; i++) {
      var tree = makeTree();
      scene.add(tree);
      trees.push(tree);
    }

    // Distant Jozi cues: a round tower and a pair of bridge pylons. Real meshes, far enough to stay small.
    var towerMat = new THREE.MeshStandardMaterial({ color: "#c98462", roughness: 0.7 });
    var tower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 22, 12), towerMat);
    tower.position.set(-16, 11, -78);
    scene.add(tower);
    skyline.push(tower);
    var pylonMat = new THREE.MeshStandardMaterial({ color: "#5d6a72", roughness: 0.55, metalness: 0.3 });
    var p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 16, 6), pylonMat);
    p1.position.set(8, 8, -70);
    p1.rotation.z = 0.18;
    scene.add(p1);
    var p2 = p1.clone();
    p2.position.x = 14;
    p2.rotation.z = -0.18;
    scene.add(p2);
    skyline.push(p1, p2);

    runners = [root.MESH.buildRunner(0), root.MESH.buildRunner(1), root.MESH.buildRunner(2)];
    for (i = 0; i < runners.length; i++) scene.add(runners[i].object);
    active = 0;

    var sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), new THREE.MeshBasicMaterial({ color: "#ffe7b0" }));
    sunMesh.position.set(18, 16, -40);
    scene.add(sunMesh);

    world = { travel: 0 };
    clockReady = true;
    return { ok: true, canvas: renderer.domElement };
  }

  function resize(w, h, dpr) {
    if (!renderer) return;
    VIEW.mobile = Math.min(w, h) < 760;
    var ratio = Math.min(dpr || 1, VIEW.mobile ? 1.35 : 1.75);
    renderer.setPixelRatio(ratio);
    renderer.setSize(Math.max(1, w), Math.max(1, h), false);
    camera.aspect = Math.max(1, w) / Math.max(1, h);
    camera.updateProjectionMatrix();
    var shadow = VIEW.mobile ? 1024 : 2048;
    if (sun && sun.shadow.mapSize.x !== shadow) {
      sun.shadow.mapSize.set(shadow, shadow);
      if (sun.shadow.map) sun.shadow.map.dispose();
      sun.shadow.map = null;
    }
  }

  function placeBuildings(travel) {
    var i;
    var base = Math.floor(travel / 11);
    for (i = 0; i < buildings.length; i++) {
      var index = base + i;
      var side = index % 2 === 0 ? -1 : 1;
      var mile = index * 11;
      var width = 4.2 + (index % 3) * 0.7;
      var depth = 5 + (index % 4);
      var height = 6 + (index % 5) * 3.2 + (index % 7 === 0 ? 8 : 0);
      var b = buildings[i];
      b.scale.set(width, height, depth);
      b.position.set(side * (BUILD_INSET + width * 0.5), height * 0.5, travel - mile - 8);
      b.visible = b.position.z < 3 && b.position.z > -72;
      b.rotation.y = side > 0 ? Math.PI : 0;
    }
  }

  function placeTrees(travel) {
    var i;
    var base = Math.floor(travel / 9);
    for (i = 0; i < trees.length; i++) {
      var index = base + i;
      var side = index % 2 === 0 ? 1 : -1;
      var mile = index * 9 + 3;
      trees[i].position.set(side * 2.65, 0, travel - mile);
      trees[i].visible = trees[i].position.z < 1.2 && trees[i].position.z > -60;
    }
  }

  function hideProps() {
    var i;
    for (i = 0; i < props.length; i++) props[i].used = false;
  }
  function takeProp(kind, variant) {
    var i;
    for (i = 0; i < props.length; i++) {
      if (!props[i].used && props[i].kind === kind && props[i].variant === variant) {
        props[i].used = true;
        props[i].object.visible = true;
        return props[i];
      }
    }
    var object = null;
    if (kind === "taxi") object = root.MESH.buildTaxi(variant);
    else if (kind === "drums") object = root.MESH.buildDrums();
    else if (kind === "barrier") object = root.MESH.buildBarrier();
    else if (kind === "pothole") object = root.MESH.buildPothole();
    else if (kind === "scaffold") object = root.MESH.buildScaffold();
    else if (kind === "sign") object = root.MESH.buildSign();
    else if (kind === "branch") object = root.MESH.buildBranch();
    else if (kind === "boom") object = root.MESH.buildBoom(variant === 1);
    else if (kind === "fare") object = root.MESH.buildFare(variant);
    else if (kind === "coin") object = root.MESH.buildCoin();
    else if (kind === "shield") object = root.MESH.buildShield();
    else if (kind === "kota") object = root.MESH.buildKota();
    else if (kind === "chev") object = root.MESH.buildChevron();
    if (!object) return null;
    scene.add(object);
    var slot = { kind: kind, variant: variant, object: object, used: true };
    props.push(slot);
    return slot;
  }

  function parkTaxis(travel) {
    var i;
    for (i = 0; i < 4; i++) {
      var slot = takeProp("taxi", i);
      if (!slot) continue;
      var side = i % 2 === 0 ? -1 : 1;
      var mile = Math.floor(travel / 22) * 22 + i * 22 + 6;
      slot.object.position.set(side * 2.15, 0, travel - mile);
      slot.object.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      slot.object.visible = slot.object.position.z < -2 && slot.object.position.z > -55;
    }
  }

  function syncEnt(e, travel, time) {
    var z = travel - e.z;
    if (z > 1.2 || z < -70) return;
    var kind = "drums";
    var variant = e.variant || 0;
    if (e.kind === "coin") kind = "coin";
    else if (e.kind === "fare") kind = "fare";
    else if (e.kind === "shield") kind = "shield";
    else if (e.kind === "kota") kind = "kota";
    else if (e.kind === "gate") {
      var lane;
      for (lane = 0; lane < 3; lane++) {
        var open = lane === e.lane ? 1 : 0;
        var boom = takeProp("boom", open);
        if (!boom) continue;
        boom.object.position.set(root.EISH.LANE_X[lane], 0, z);
        if (boom.object.userData.arm) boom.object.userData.arm.rotation.z = open ? -1.15 : 0.05;
      }
      var names = ["LEFT", "MID", "RIGHT"];
      return { banner: z > -28 ? names[e.lane] : "" };
    } else if (e.kind === "obs") {
      if (e.verb === "block") kind = "taxi";
      else if (e.verb === "low" && e.variant === 1) kind = "barrier";
      else if (e.verb === "low" && e.variant === 2) kind = "pothole";
      else if (e.verb === "low") kind = "drums";
      else if (e.verb === "high" && e.variant === 1) kind = "sign";
      else if (e.verb === "high" && e.variant === 2) kind = "branch";
      else kind = "scaffold";
      var chev = takeProp("chev", 0);
      if (chev) {
        chev.object.position.set(e.x, 0.02, z + 2.8);
        chev.object.scale.set(1.7, 1.7, 1.7);
        var color = e.verb === "low" ? "#f0c14d" : e.verb === "high" ? "#5aaadc" : "#e23b3b";
        if (chev.object.userData.cone) chev.object.userData.cone.material.color.set(color);
        chev.object.visible = true;
      }
    }
    var slot = takeProp(kind, kind === "taxi" ? (e.id || variant) % 5 : variant);
    if (!slot) return;
    slot.object.position.set(e.x, e.kind === "coin" || e.kind === "shield" || e.kind === "kota" ? 0 : 0, z);
    if (kind === "taxi") slot.object.rotation.y = 0;
    if (kind === "coin") {
          slot.object.rotation.y = time * 3;
          slot.object.position.y = (e.y > 1 ? 0.85 : 0.15) + Math.sin(time * 5 + e.z) * 0.06;
        }
    if (kind === "fare" && slot.object.userData.arm) slot.object.userData.arm.rotation.x = -0.8 + Math.sin(time * 6 + e.z) * 0.5;
    if (e.kind === "coin") slot.object.position.y = (e.y > 1 ? 0.85 : 0.15) + Math.sin(time * 5 + e.z) * 0.06;
    else slot.object.position.y = 0;
  }

  function verticalFov(hfovDeg, aspect) {
    var h = hfovDeg * Math.PI / 180;
    var v = 2 * Math.atan(Math.tan(h / 2) / Math.max(0.25, aspect));
    return Math.max(30, Math.min(108, v * 180 / Math.PI));
  }

  function frameCamera(app, px) {
    var wide = camera.aspect > 1.15;
    var title = app.screen === "title" || app.screen === "how";
    var hfov = title ? (wide ? 46 : 42) : (camera.aspect < 0.85 ? 52 : 66);
    if (title) {
      camera.position.set(0.62, 1.02, 3.25);
      camera.lookAt(-0.02, 0.86, 0);
    } else {
      var sway = app.reduced ? 0 : Math.sin((app.time || 0) * 1.5) * 0.02;
      if (camera.aspect < 0.85) {
        camera.position.set(px * 0.2 + 0.1, 1.38, 2.75);
        camera.lookAt(px * 0.32, 0.82 + sway, -2.6);
      } else {
        camera.position.set(px * 0.28 + 0.22, wide ? 1.85 : 1.7, wide ? 4.6 : 4.2);
        camera.lookAt(px * 0.45, 0.98 + sway, -6.2);
      }
    }
    camera.fov = verticalFov(hfov, camera.aspect);
    camera.updateProjectionMatrix();
  }

  function frameSheet(app) {
    var i;
    for (i = 0; i < buildings.length; i++) buildings[i].visible = false;
    for (i = 0; i < trees.length; i++) trees[i].visible = false;
    hideProps();
    for (i = 0; i < props.length; i++) props[i].object.visible = false;
    var mode = app.sheet === "run" ? "run" : "idle";
    var yaw = app.sheet === "back" ? 0 : app.sheet === "side" || app.sheet === "run" ? Math.PI / 2 : app.sheet === "three" ? Math.PI + 0.55 : Math.PI;
    var who = app.who || 0;
    var lineup = app.sheet !== "run" && app.sheet !== "side";
    for (i = 0; i < runners.length; i++) {
      var show = lineup || i === who;
      runners[i].object.visible = show;
      if (!show) continue;
      runners[i].animate({ mode: mode, phase: (app.time || 0) * 1.7, t: app.time, dt: app.dt || 0.016, blink: false });
      runners[i].object.position.set(lineup ? (i - 1) * 1.15 : 0, 0, 0);
      runners[i].object.rotation.y = yaw;
      runners[i].object.scale.set(1, 1, 1);
    }
    camera.position.set(app.sheet === "run" ? 2.4 : 0.15, 1.05, app.sheet === "run" ? 0.15 : 3.35);
    camera.lookAt(0, 0.95, 0);
    camera.fov = verticalFov(lineup ? 42 : 28, camera.aspect);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    return { banner: "" };
  }

  function frame(app) {
    if (!clockReady) return;
    if (app.sheet) return frameSheet(app);
    var travel = 0;
    var who = app.who || 0;
    var i;
    for (i = 0; i < runners.length; i++) runners[i].object.visible = i === who;
    var runner = runners[who];
    if (app.screen === "play" || app.screen === "pause" || app.screen === "over") {
      var sim = app.sim;
      if (sim) {
        travel = sim.travel;
        var mode = "run";
        if (!sim.alive) mode = "hit";
        else if (sim.air > 0) mode = "jump";
        else if (sim.slide > 0) mode = "slide";
        runner.animate({
          mode: mode,
          phase: sim.phase / 6,
          air: sim.air / (root.EISH.JUMP_DUR || 0.58),
          t: app.time,
          dt: app.dt || 0.016,
          blink: false
        });
        runner.object.position.set(sim.x, sim.y, 0);
        runner.object.rotation.y = 0;
        var squash = 1;
        if (sim.air > 0) squash = sim.air < 0.12 ? 0.9 : 1.06;
        else if (sim.slide > 0) squash = 0.86;
        runner.object.scale.set(1, squash, 1);
        frameCamera(app, sim.x);
        sun.target.position.set(sim.x, 0, -6);
      }
    } else {
      travel = app.menuT || 0;
      var blink = !app.reduced && Math.sin(app.time * 0.7) > 0.96;
      runner.animate({ mode: "idle", phase: 0, t: app.time, dt: app.dt || 0.016, blink: blink });
      runner.object.position.set(-0.12, 0, 0);
      runner.object.rotation.y = Math.PI + 0.32;
      frameCamera(app, 0);
      sun.target.position.set(0, 0, -4);
    }
    if (roadMat && roadMat.map) roadMat.map.offset.y = travel * 0.09;
    placeBuildings(travel);
    placeTrees(travel);
    hideProps();
    var banner = "";
    if (app.sim && (app.screen === "play" || app.screen === "pause" || app.screen === "over")) {
      var ents = app.sim.ents;
      for (i = 0; i < ents.length; i++) {
        if (ents[i].dead) continue;
        var found = syncEnt(ents[i], travel, app.time || 0);
        if (found && found.banner) banner = found.banner;
      }
    }
    parkTaxis(travel);
    for (i = 0; i < props.length; i++) if (!props[i].used) props[i].object.visible = false;
    renderer.render(scene, camera);
    return { banner: banner };
  }

  function metrics() {
    if (!renderer) return null;
    var canvas = renderer.domElement;
    var bw = canvas.width, bh = canvas.height;
    return {
      css: [canvas.clientWidth, canvas.clientHeight],
      buf: [bw, bh],
      cssAspect: canvas.clientHeight ? canvas.clientWidth / canvas.clientHeight : 0,
      bufAspect: bh ? (bw / bh) : 0,
      cameraAspect: camera ? camera.aspect : 0,
      fov: camera ? camera.fov : 0,
      hfov: camera ? (2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect) * 180 / Math.PI) : 0
    };
  }

  root.WORLD = {
    init: init,
    resize: resize,
    frame: frame,
    metrics: metrics,
    failReason: function () { return failReason; }
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
