(function(){
"use strict";
var M=[["power","Power"],["roads","Roads"],["mood","Mood"],["treasury","Treasury"],["uncles","Uncles"]];
var ICON={
 power:'<path d="M19 6a9 9 0 0 0-5 16v4h10v-4a9 9 0 0 0-5-16z" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M15 30h8" stroke="#fff" stroke-width="2.5"/>',
 roads:'<path d="M19 5l-9 26h18z" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M13 22h12" stroke="#fff" stroke-width="2.5"/>',
 mood:'<circle cx="19" cy="19" r="12" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="15" cy="16" r="1.8" fill="#fff"/><circle cx="23" cy="16" r="1.8" fill="#fff"/><path d="M13 22q6 6 12 0" fill="none" stroke="#fff" stroke-width="2.5"/>',
 treasury:'<ellipse cx="19" cy="12" rx="10" ry="4" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M9 12v14c0 5 20 5 20 0V12M9 19c0 5 20 5 20 0" fill="none" stroke="#fff" stroke-width="2.5"/>',
 uncles:'<circle cx="19" cy="15" r="7" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M14 18q5 3 10 0" stroke="#fff" stroke-width="3"/><path d="M8 33q11-12 22 0" fill="none" stroke="#fff" stroke-width="2.5"/>'
};
var $=function(id){return document.getElementById(id)};
var LS={get:function(k,d){try{var v=localStorage.getItem("eye_"+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem("eye_"+k,JSON.stringify(v))}catch(e){}}};
var S,cur,lastEnd,mode="pres",survScore=0,survCap="";
var TUT=[{id:"tut1",who:"spokes",text:"Welcome, Your Excellency! Swipe the card left or right to decide. (Or tap the buttons.) Try it.",left:{label:"Okay",fx:{}},right:{label:"Lekker",fx:{}}},{id:"tut2",who:"spokes",text:"Watch the five meters up top. Dots show what a choice will move. Hit EMPTY or FULL and your term is over.",left:{label:"Eish",fx:{}},right:{label:"Got it",fx:{}}},{id:"tut3",who:"spokes",text:"Every few cards, chaos needs you in person. Quick action games! Win to steady a meter. Ready?",left:{label:"Not really",fx:{}},right:{label:"Bring it!",fx:{},mg:"pothole"}}];

function portrait(key){
 var c=CHARACTERS[key]||{skin:"#c68642",shirt:"#888",hat:"none",acc:"none"};
 var s='<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="'+(key==="johan"?"#ff8a65":key==="taxi"?"#fff176":"#4fc3f7")+'"/>';
 s+='<path d="M12 100q38-40 76 0" fill="'+c.shirt+'" stroke="#111" stroke-width="3"/>';
 s+='<ellipse cx="50" cy="48" rx="22" ry="26" fill="'+c.skin+'" stroke="#111" stroke-width="3"/>';
 s+='<circle cx="42" cy="46" r="3" fill="#111"/><circle cx="58" cy="46" r="3" fill="#111"/>';
 s+='<path d="M41 60q9 7 18 0" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/>';
 if(c.hat==="hardhat")s+='<path d="M26 34q24-26 48 0z" fill="#fdd835" stroke="#111" stroke-width="3"/><rect x="22" y="32" width="56" height="6" rx="3" fill="#fdd835" stroke="#111" stroke-width="3"/>';
 if(c.hat==="doek")s+='<path d="M26 38q24-34 48 0q-24-8-48 0z" fill="#e91e63" stroke="#111" stroke-width="3"/><circle cx="72" cy="30" r="6" fill="#e91e63" stroke="#111" stroke-width="3"/>';
 if(c.hat==="cap")s+='<path d="M28 34q22-22 44 0z" fill="'+c.shirt+'" stroke="#111" stroke-width="3"/><path d="M60 33h22" stroke="#111" stroke-width="5" stroke-linecap="round"/>';
 if(c.acc==="glasses")s+='<circle cx="42" cy="46" r="7" fill="none" stroke="#111" stroke-width="2.5"/><circle cx="58" cy="46" r="7" fill="none" stroke="#111" stroke-width="2.5"/><path d="M49 46h2" stroke="#111" stroke-width="2.5"/>';
 if(c.acc==="shades")s+='<rect x="33" y="41" width="15" height="9" rx="3" fill="#111"/><rect x="52" y="41" width="15" height="9" rx="3" fill="#111"/><path d="M48 44h4" stroke="#111" stroke-width="3"/>';
 if(c.acc==="moustache")s+='<path d="M38 57q6-6 12 0q6-6 12 0q-6 5-12 1q-6 4-12-1z" fill="#6d4c41" stroke="#111" stroke-width="2"/>';
 if(c.acc==="whistle")s+='<path d="M50 72v10" stroke="#111" stroke-width="2"/><rect x="45" y="82" width="10" height="6" rx="2" fill="#bdbdbd" stroke="#111" stroke-width="2"/>';
 if(c.acc==="mic")s+='<rect x="72" y="60" width="7" height="22" rx="2" fill="#424242" stroke="#111" stroke-width="2"/><circle cx="75.5" cy="58" r="6" fill="#9e9e9e" stroke="#111" stroke-width="2"/>';
 if(c.acc==="torch")s+='<rect x="70" y="66" width="8" height="18" rx="2" fill="#424242" stroke="#111" stroke-width="2"/><path d="M70 66l-6-10h20l-6 10z" fill="#ffee58" stroke="#111" stroke-width="2"/>';
 return s+'</svg>';
}

function buildMeters(){
 var h="";M.forEach(function(m){h+='<div class="meter" id="m_'+m[0]+'"><div class="dot" id="d_'+m[0]+'"></div><div class="micon"><div class="mask"><div class="fill" id="f_'+m[0]+'"></div></div><svg viewBox="0 0 38 38">'+ICON[m[0]]+'</svg></div>'+m[1]+'</div>'});
 $("meters").innerHTML=h;
}
function renderMeters(){M.forEach(function(m){$("f_"+m[0]).style.height=Math.max(0,Math.min(100,S.m[m[0]]))+"%"})}
function show(id){Array.prototype.forEach.call(document.querySelectorAll(".screen"),function(s){s.classList.toggle("active",s.id===id)})}

function newGame(){
 S={m:{power:50,roads:50,mood:50,treasury:50,uncles:50},flags:{},seen:{},recent:[],days:1,tut:LS.get("tut",0)?3:0,since:0,gap:4+Math.floor(Math.random()*3),dec:0};
 renderMeters();$("dayN").textContent=1;show("game");next();
}
function eligible(c){return(!c.req||S.flags[c.req])&&!(c.once&&S.seen[c.id])&&S.recent.indexOf(c.id)<0}
function next(){
 if(S.tut<3){cur=TUT[S.tut++];if(S.tut>=3)LS.set("tut",1);paint();return}
 var pool=CARDS.filter(eligible);
 var chain=pool.filter(function(c){return c.req});
 if(!pool.length){S.recent=[];pool=CARDS.filter(eligible)}
 cur=(chain.length&&Math.random()<0.6)?chain[0]:pool[Math.floor(Math.random()*pool.length)];
 S.seen[cur.id]=1;S.recent.push(cur.id);if(S.recent.length>12)S.recent.shift();paint()}
function paint(){
 $("who").textContent=CHARACTERS[cur.who].name;$("portrait").innerHTML=portrait(cur.who);$("text").textContent=cur.text;
 $("hintL").textContent=cur.left.label;$("hintR").textContent=cur.right.label;$("lblL").textContent=cur.left.label;$("lblR").textContent=cur.right.label;
 var card=$("card");card.classList.remove("anim");card.style.transform="translateY(-30px) rotate(0)";card.style.opacity="0";
 requestAnimationFrame(function(){card.classList.add("anim");card.style.transform="";card.style.opacity="1"});
 dots(null);
}
function dots(side){M.forEach(function(m){var d=$("d_"+m[0]);var v=side?(cur[side].fx[m[0]]||0):0;d.classList.toggle("on",!!v);d.classList.toggle("big",Math.abs(v)>=15)})}
function hint(side,a){$("hintL").style.opacity=side==="left"?a:0;$("hintR").style.opacity=side==="right"?a:0}

function choose(side){
 var o=cur[side],card=$("card");
 card.classList.add("anim");card.style.transform="translateX("+(side==="left"?-500:500)+"px) rotate("+(side==="left"?-30:30)+"deg)";card.style.opacity="0";
 Object.keys(o.fx).forEach(function(k){S.m[k]+=Math.round(o.fx[k]*0.6);var el=$("m_"+k);el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash")});
 if(o.set)S.flags[o.set]=1;var tut=cur.id.indexOf("tut")===0;if(!tut){S.dec++;S.since++}
 S.days+=3+Math.floor(Math.random()*10)+(o.skip?30:0);
 renderMeters();$("dayN").textContent=S.days;dots(null);hint(null,0);
 var end=null;M.some(function(m){var v=S.m[m[0]];if(v<=0){end=m[0]+"_0";return true}if(v>=100){end=m[0]+"_100";return true}});
 var mgId=o.mg||(!tut&&!end&&S.since>=S.gap?MG.list[Math.floor(Math.random()*MG.list.length)]:null);
 if(end){setTimeout(function(){finish(end)},320);return}
 if(mgId){S.since=0;S.gap=4+Math.floor(Math.random()*3);setTimeout(function(){MG.single(mgId,S.days,afterMg)},350);return}
 setTimeout(next,320);
}

function afterMg(win,meter,cap){
 var v=S.m[meter];
 if(win){S.m[meter]=v+(50-v)*0.6;S.m.mood=Math.min(95,S.m.mood+3)}else{S.m[meter]=v+(v>=50?12:-12);}
 S.m[meter]=Math.round(S.m[meter]);var el=$("m_"+meter);el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");renderMeters();show("game");
 if(!win){$("who").textContent="Breaking news";$("text").textContent="The President "+cap.charAt(0).toLowerCase()+cap.slice(1)+". Eish.";}
 var end=null;M.some(function(m){var x=S.m[m[0]];if(x<=0){end=m[0]+"_0";return true}if(x>=100){end=m[0]+"_100";return true}});
 setTimeout(function(){end?finish(end):next()},win?200:1400);
}
function startSurvival(){mode="surv";show("game");MG.survival(function(score,cap){survScore=score;survCap=cap;var b=LS.get("sbest",0);
 $("sScore").textContent=score;$("sCap").textContent="Cause of exit: "+cap+".";$("sBest").textContent=score>b?"New best!":"Best: "+b;if(score>b)LS.set("sbest",score);$("toast2").textContent="";refreshTitle();show("sover")})}
function shareSurv(){doShare("I survived "+survScore+" Mzansi chaoses before I "+survCap.charAt(0).toLowerCase()+survCap.slice(1)+". Eish. Can you beat me?",$("toast2"))}
function finish(key){mode="pres";
 lastEnd=key;var e=ENDINGS[key];var col=LS.get("coll",{});col[key]=1;LS.set("coll",col);
 var best=LS.get("best",0);$("newBest").textContent=S.days>best?"New best term!":"Best: "+best+" days";if(S.days>best)LS.set("best",S.days);
 $("endDays").textContent=S.days;$("endTitle").textContent=e.title;$("endLine").textContent=e.line;$("toast").textContent="";
 refreshTitle();show("end");
}
var SHARE={power_0:"before the lights went out for good",power_100:"before the country glowed too bright",roads_0:"before the potholes swallowed Parliament",roads_100:"before the taxis got bored of perfect roads",mood_0:"before the people held a braai without me",mood_100:"before I got suspiciously popular",treasury_0:"before Auntie Treasury sold the anthem",treasury_100:"before the uncles fought over the money",uncles_0:"before the Cabinet Uncles stopped pitching up",uncles_100:"before Uncle Johan's 'few words' finished me"};
function share(){doShare("I lasted "+S.days+" days ("+S.dec+" decisions) as President of Mzansiland "+SHARE[lastEnd]+". Eish. Can you beat me?",$("toast"))}
function doShare(t,toast){
 var url=location.href.split("#")[0];
 if(navigator.share){navigator.share({title:"Eish, Your Excellency",text:t,url:url}).catch(function(){})}
 else{var full=t+" "+url;(navigator.clipboard?navigator.clipboard.writeText(full):Promise.reject()).then(function(){toast.textContent="Copied! Paste it in the family group."},function(){toast.textContent=full})}
}
function refreshTitle(){$("sBestTitle").textContent=LS.get("sbest",0);var col=LS.get("coll",{});$("collCount").textContent=Object.keys(col).length;$("bestTitle").textContent=LS.get("best",0)}
function showColl(){var col=LS.get("coll",{}),h="";Object.keys(ENDINGS).forEach(function(k){var e=ENDINGS[k];h+=col[k]?'<div class="ce"><b>'+e.title+'</b>'+e.line+'</div>':'<div class="ce locked"><b>???</b>Not yet unlocked</div>'});$("collList").innerHTML=h;show("coll")}

// drag
var sx=null,dx=0;var card=$("card");
function down(x){if(!cur)return;sx=x;dx=0;card.classList.remove("anim")}
function move(x){if(sx===null)return;dx=x-sx;card.style.transform="translateX("+dx+"px) rotate("+(dx/12)+"deg)";var side=dx<-15?"left":dx>15?"right":null;hint(side,Math.min(1,Math.abs(dx)/80));dots(side)}
function up(){if(sx===null)return;sx=null;if(Math.abs(dx)>90){choose(dx<0?"left":"right")}else{card.classList.add("anim");card.style.transform="";hint(null,0);dots(null)}}
card.addEventListener("pointerdown",function(e){card.setPointerCapture(e.pointerId);down(e.clientX)});
card.addEventListener("pointermove",function(e){move(e.clientX)});
card.addEventListener("pointerup",up);card.addEventListener("pointercancel",up);
$("bL").onclick=function(){choose("left")};$("bR").onclick=function(){choose("right")};
["bL","bR"].forEach(function(id){var s=id==="bL"?"left":"right";$(id).onmouseenter=function(){dots(s)};$(id).onmouseleave=function(){dots(null)}});
$("startBtn").onclick=newGame;$("survBtn").onclick=startSurvival;$("sAgain").onclick=startSurvival;$("sShare").onclick=shareSurv;$("sMenu").onclick=function(){show("title")};$("endMenu").onclick=function(){show("title")};MG.init();$("againBtn").onclick=newGame;$("shareBtn").onclick=share;
$("collBtn").onclick=showColl;$("endColl").onclick=showColl;$("collBack").onclick=function(){refreshTitle();show("title")};
buildMeters();refreshTitle();$("titleport").innerHTML='<div style="width:100%;height:100%;border:4px solid #111;border-radius:50%;overflow:hidden">'+portrait("johan")+'</div>';
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0){navigator.serviceWorker.register("sw.js").catch(function(){})}
window.__eye={choose:choose,state:function(){return S},newGame:newGame};
var q=new URLSearchParams(location.search),dm=q.get("mg");
if(dm==="survival")startSurvival();else if(dm&&MG.list.indexOf(dm)>=0){newGame();S.tut=3;MG.single(dm,+(q.get("days")||1),afterMg)}
})();
