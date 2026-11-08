// Loads Three.js (MIT) then the game. A failed import surfaces on the page.
import * as THREE from "three";

window.THREE = THREE;

var boot = document.getElementById("boot");
var fail = document.getElementById("glfail");
var why = document.getElementById("glwhy");

function showFail(msg) {
  if (boot) boot.hidden = true;
  if (fail) fail.hidden = false;
  if (why) why.textContent = msg || "WebGL did not start.";
}

var probe = document.createElement("canvas");
var gl = null;
try {
  gl = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) || probe.getContext("webgl");
} catch (err) {
  gl = null;
}
if (!gl) {
  showFail("This browser has no WebGL, so the 3D street cannot be drawn.");
} else {
  var script = document.createElement("script");
  script.src = "game.js";
  script.onerror = function () { showFail("The game script did not load."); };
  document.body.appendChild(script);
}

window.addEventListener("error", function (ev) {
  if (!window.__EISH_OK) showFail(ev.message || "The 3D street hit an error while starting.");
});
