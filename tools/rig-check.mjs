// Builds the three runners without WebGL and checks they are solid people, not flat cards.
import * as THREE from "../vendor/three.module.js";
import vm from "node:vm";
import fs from "node:fs";

globalThis.THREE = THREE;
globalThis.window = globalThis;
globalThis.document = { createElement: function () { return { getContext: function () { return null; }, width: 0, height: 0 }; } };
vm.runInThisContext(fs.readFileSync(new URL("../src/10-art.js", import.meta.url), "utf8"));

var fails = 0;
function assert(cond, msg) {
  if (!cond) { fails++; console.error("FAIL: " + msg); }
}

var MESH = globalThis.MESH;
assert(MESH && MESH.CAST.length === 3, "three runners");
for (var i = 0; i < 3; i++) {
  var rig = MESH.buildRunner(i);
  var box = new THREE.Box3().setFromObject(rig.object);
  var size = box.getSize(new THREE.Vector3());
  assert(size.y > 1.45 && size.y < 2.15, MESH.CAST[i].name + " height " + size.y.toFixed(2));
  assert(size.x > 0.35 && size.z > 0.2, MESH.CAST[i].name + " has volume " + size.x.toFixed(2) + " " + size.z.toFixed(2));
  var verts = 0;
  var meshes = 0;
  rig.object.traverse(function (o) {
    if (o.isMesh && o.geometry && o.geometry.getAttribute("position")) {
      meshes++;
      verts += o.geometry.getAttribute("position").count;
    }
  });
  assert(meshes > 20, MESH.CAST[i].name + " mesh parts " + meshes);
  assert(verts > 1500, MESH.CAST[i].name + " verts " + verts);
  rig.animate({ mode: "run", phase: 0.25, t: 0 });
  var posed = new THREE.Box3().setFromObject(rig.object).getSize(new THREE.Vector3());
  assert(posed.z > 0.25, MESH.CAST[i].name + " stride has depth " + posed.z.toFixed(2));
}

["buildTaxi", "buildDrums", "buildBarrier", "buildScaffold", "buildSign", "buildBranch", "buildFare", "buildCoin"].forEach(function (name) {
  var obj = MESH[name](0);
  var box = new THREE.Box3().setFromObject(obj);
  var size = box.getSize(new THREE.Vector3());
  var dims = [size.x, size.y, size.z].sort(function (a, b) { return b - a; });
  assert(dims[0] > 0.15 && dims[1] > 0.05, name + " bounds " + dims.map(function (n) { return n.toFixed(2); }).join(" "));
});

if (fails) {
  console.error(fails + " failure(s)");
  process.exit(1);
}
console.log("rig-check: runners and props are solid meshes");
