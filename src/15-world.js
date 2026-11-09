// Crate Day and the spaza counter. Skill games, capped pay, one collect each.
var PLAY = (function () {
  var CROPS = ["maize", "spinach", "tomato"];

  function chip(crop) {
    return "<button type=\"button\" class=\"chip " + crop + "\" data-crop=\"" + crop + "\">" + KHAYA.CROPS[crop].name + "</button>";
  }

  function crateStart(body, done) {
    var order = [];
    var i;
    for (i = 0; i < 10; i++) order.push(CROPS[i % 3]);
    var round = { i: 0, correct: 0, order: order, over: false, token: "crate-" + Date.now() + "-" + Math.floor(Math.random() * 1e6) };
    var deadline = 0;
    var clock = 0;
    body.innerHTML = "<p class=\"rules\">Crate Day. A crop name lights up. Tap its crate before the bar runs out. Ten crops. No entry fee.</p><div class=\"meter\"><span id=\"crateBar\"></span></div><p id=\"crateShow\" class=\"show maize\">Maize</p><div class=\"crates\">" + CROPS.map(chip).join("") + "</div><p id=\"crateScore\" class=\"fine\">0 / 10</p>";
    var show = body.querySelector("#crateShow");
    var bar = body.querySelector("#crateBar");
    var score = body.querySelector("#crateScore");
    function present() {
      if (round.i >= round.order.length) return finish();
      deadline = clock + 8000;
      var crop = round.order[round.i];
      show.textContent = KHAYA.CROPS[crop].name;
      show.className = "show " + crop;
    }
    function finish() {
      round.over = true;
      var pay = KHAYA.cratePayout(round.correct);
      done(round.token, pay, "You sorted " + round.correct + " of 10.");
    }
    function answer(crop) {
      if (round.over) return;
      if (crop === round.order[round.i]) round.correct += 1;
      round.i += 1;
      score.textContent = round.correct + " right · " + round.i + " / 10";
      present();
    }
    body.querySelectorAll("[data-crop]").forEach(function (btn) {
      btn.addEventListener("click", function () { answer(btn.getAttribute("data-crop")); });
    });
    present();
    function frame(t) {
      if (round.over) return;
      clock = t;
      if (!deadline) deadline = t + 8000;
      var left = (deadline - t) / 8000;
      bar.style.transform = "scaleX(" + Math.max(0, Math.min(1, left)) + ")";
      if (left <= 0) {
        if (-left > 0.25) deadline = t + 8000;
        else answer("__timeout__");
      }
      if (!round.over) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return function stop() { round.over = true; };
  }

  function marketStart(body, done) {
    var slips = [
      ["maize", "maize", "spinach"],
      ["tomato", "maize"],
      ["spinach", "spinach"],
      ["tomato", "spinach", "maize"],
      ["aloe", "tomato"]
    ];
    var round = { i: 0, served: 0, picked: [], over: false, token: "market-" + Date.now() + "-" + Math.floor(Math.random() * 1e6) };
    var goods = ["maize", "spinach", "tomato", "aloe"];
    body.innerHTML = "<p class=\"rules\">Spaza counter. Tap every item on the slip, then hand it over. A wrong extra item sends that customer on. Five customers. No entry fee.</p><p id=\"slip\" class=\"slip\"></p><div class=\"crates\">" + goods.map(chip).join("") + "</div><p id=\"basket\" class=\"fine\">Basket: empty</p><button type=\"button\" class=\"hot\" id=\"hand\">Hand over</button>";
    var slip = body.querySelector("#slip");
    var basket = body.querySelector("#basket");
    function names(list) {
      var count = {};
      list.forEach(function (c) { count[c] = (count[c] || 0) + 1; });
      return Object.keys(count).map(function (k) { return count[k] + " " + KHAYA.CROPS[k].name; }).join(", ");
    }
    function present() {
      if (round.i >= slips.length) return finish();
      round.picked = [];
      slip.textContent = "Order: " + names(slips[round.i]);
      basket.textContent = "Basket: empty";
    }
    function same(a, b) {
      if (a.length !== b.length) return false;
      var as = a.slice().sort().join(",");
      var bs = b.slice().sort().join(",");
      return as === bs;
    }
    function finish() {
      round.over = true;
      var pay = KHAYA.marketPayout(round.served);
      done(round.token, pay, "You served " + round.served + " of 5 customers.");
    }
    body.querySelectorAll("[data-crop]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (round.over || round.i >= slips.length) return;
        if (round.picked.length >= 4) return;
        round.picked.push(btn.getAttribute("data-crop"));
        basket.textContent = "Basket: " + names(round.picked);
      });
    });
    body.querySelector("#hand").addEventListener("click", function () {
      if (round.over || round.i >= slips.length) return;
      if (same(round.picked, slips[round.i])) round.served += 1;
      round.i += 1;
      present();
    });
    present();
    return function stop() { round.over = true; };
  }

  return { crateStart: crateStart, marketStart: marketStart };
})();
