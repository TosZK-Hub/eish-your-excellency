// Khaya Lane starts from game.js. The old WebGL boot is not used.
var script = document.createElement("script");
script.src = "game.js";
script.onerror = function () {
  var boot = document.getElementById("boot");
  if (boot) boot.innerHTML = "<p>The lane did not load. Refresh the page.</p>";
};
document.body.appendChild(script);
