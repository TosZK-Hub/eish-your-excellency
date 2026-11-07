// Meta screens, saves, album, wardrobe. Progress keys stay ewg_*.
var LIST=Object.keys(DEF);
var LEGACY={
 uncle:{name:"Shut Up Uncle",who:"tannie",title:"YOH",cap:"Asked Uncle Fanie a question at the wedding"},
 change:{name:"Catch the Change",who:"gaatjie",title:"BUTTONS",cap:"Lent R50 to the cousin 'until Friday'"},
 snack:{name:"Save the Chippies",who:"boet",title:"NOOO",cap:"Dropped the last packet of chippies at the braai"},
 koeksister:{name:"Koeksister Dip",who:"tannie",title:"STICKY",cap:"Grabbed a koeksister straight out of the syrup"},
 rugby:{name:"Duck the Ball",who:"gaatjie",title:"BONK",cap:"Stood behind the poles at a school rugby game"},
 lolly:{name:"Frozen Stoep Lolly",who:"boet",title:"STUCK",cap:"Licked a frozen lolly straight out of the deep freeze"},
 mud:{name:"Bakkie in the Mud",who:"tannie",title:"STUCK",cap:"Took the shortcut through the farm road after rain"},
 unplug:{name:"Unplug Everything",who:"auntie",title:"BANG",cap:"Didn't unplug before the power came back with a BANG"},
 umbrella:{name:"Highveld Storm",who:"gaatjie",title:"ZAP",cap:"Held a metal umbrella up in a Highveld storm"},
 sauce:{name:"Stuck Sauce",who:"uncle",title:"SPLAT",cap:"Shook the tomato sauce with the lid loose"},
 hawker:{name:"Robot Hawker",who:"uncle",title:"SOLD",cap:"Made eye contact with every hawker at the robot"},
 spaza:{name:"Spaza Queue",who:"tannie",title:"FORGOT",cap:"Forgot the list at the front of the spaza queue"}
};
var HATS={
 none:{name:"No hat",need:null},
 beanie:{name:"Bead beanie",need:["tot",8],txt:"Survive 8 microgames in total"},
 shades:{name:"Stoep shades",need:["dead",4],txt:"Collect 4 ways to go"},
 sunhat:{name:"Straw sunhat",need:["tot",30],txt:"Survive 30 microgames in total"},
 crown:{name:"Paper crown",need:["best",8],txt:"Score 8 in one run"},
 chef:{name:"Braai chef hat",need:["daily",1],txt:"Finish a daily challenge"},
 flowers:{name:"Flower crown",need:["dead",8],txt:"Collect 8 ways to go"},
 bucket:{name:"Bucket hat",need:["tot",80],txt:"Survive 80 microgames in total"},
 party:{name:"Party hat",need:["all",1],txt:"Collect every way to go in this set"}
};
function hatUnlocked(h){var n=HATS[h].need;if(!n)return true;if(n[0]==="all")return LIST.every(function(id){return LS.get("dead",{})[id]});var v=n[0]==="dead"?Object.keys(LS.get("dead",{})).length:LS.get(n[0],0);return v>=n[1]}
function today(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function dailyList(day){var r=seeded(day*7+3),a=LIST.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a.slice(0,8)}
function activeDead(){var col=LS.get("dead",{});return LIST.filter(function(id){return col[id]}).length}

function startRun(opt){
 opt=opt||{};show("play");resize();
 var day=today(),max=Q.get("max")?+Q.get("max"):0,base=Q.get("seed");
 S={lives:3,score:0,lost:0,deaths:[],newD:[],daily:!!opt.daily,list:opt.daily?dailyList(day):null,day:day,only:opt.only,max:max};
 var bag=[];ac();music(true,Math.random()<0.5?0:1);
 (function next(){
  var i=S.score+S.lost;
  if(max&&i>=max){over();return}
  var id;if(S.daily){if(i>=S.list.length){over();return}id=S.list[i]}
  else id=S.only||(bag.length?bag.pop():(bag=LIST.slice().sort(function(){return Math.random()-0.5}),bag.pop()));
  var boss=!S.only&&S.score>0&&(S.score+1)%10===0;
  var sp=Math.min(3.1,1+S.score*0.07)+(boss?0.35:0);
  if(boss){music(false);music(true,2)}else if(SONG===SONGS[2]){music(false);music(true,0)}
  var seed=base!=null?(+base+i*17):(S.daily?day*31+i:null);
  play(id,sp,boss,function(win){if(!S)return;if(win)S.score++;else S.lost++;if(S.lives<=0)over();else next()},seed);
 })();
}
function over(){
 var sc=S.score,best=LS.get("best",0),tot=LS.get("tot",0)+sc,before=Object.keys(HATS).filter(hatUnlocked);
 if(raf){cancelAnimationFrame(raf);raf=0}run=null;music(false);LS.set("tot",tot);
 if(sc>best)LS.set("best",sc);
 if(S.daily){var db=LS.get("dbest",{});if(db[S.day]==null||sc>db[S.day])db[S.day]=sc;LS.set("dbest",db);
  if(S.lives>0||S.score+S.lost>=S.list.length)LS.set("daily",LS.get("daily",0)+1);
  var st=LS.get("streak",{d:0,n:0});var y=new Date();y.setDate(y.getDate()-1);var yd=y.getFullYear()*10000+(y.getMonth()+1)*100+y.getDate();
  if(st.d!==S.day){st.n=st.d===yd?st.n+1:1;st.d=S.day;LS.set("streak",st)}}
 var after=Object.keys(HATS).filter(hatUnlocked),hats=after.filter(function(h){return before.indexOf(h)<0});
 $("sScore").textContent=sc;$("sUnit").textContent=sc===1?"chaos":"chaoses";
 $("sBest").textContent=sc>best?"NEW BEST!":"Best: "+Math.max(best,sc);
 $("sDaily").textContent=S.daily?"Daily "+fmtDay(S.day)+" · streak "+LS.get("streak",{n:1}).n:"";
 var lastId=S.deaths[S.deaths.length-1];$("sCap").textContent=lastId&&DEF[lastId]?capOf(lastId):"";
 var nd=$("sNew");nd.innerHTML="";
 if(S.newD.length){var h=document.createElement("p");h.className="small";h.textContent="New stickers:";nd.appendChild(h);S.newD.forEach(function(id){nd.appendChild(thumb(id))})}
 if(hats.length){var p2=document.createElement("p");p2.className="unl";p2.textContent="Unlocked: "+hats.map(function(h){return HATS[h].name}).join(", ");nd.appendChild(p2)}
 SHARE={score:sc,id:lastId,daily:S.daily,day:S.day};$("toast").textContent="";
 var was=S.daily;S=null;refresh();show("over");$("againBtn").onclick=function(){startRun({daily:was})};sfx(sc>best?"fanfare":"win");
}
function fmtDay(d){var s=String(d);return s.slice(6,8)+"/"+s.slice(4,6)}
var SHARE=null;
function shareCard(cb){
 var c=document.createElement("canvas");c.width=1080;c.height=1350;var oc=ctx,oh=H;ctx=c.getContext("2d");H=450;ctx.setTransform(3,0,0,3,0,0);DIRECT=1;
 try{ctx.fillStyle="#f4e2c4";ctx.fillRect(0,0,W,H);stxt("EISH!",120,48,40,"#e23b3b",-0.06);marker("Ways to Go",250,50,18,INK);
  if(SHARE&&SHARE.id&&DEF[SHARE.id]){ctx.save();ctx.beginPath();ctx.rect(24,80,312,220);ctx.clip();DEF[SHARE.id].paintDeath(1);ctx.restore()}
  stxt(String(SHARE?SHARE.score:0),120,340,60,GOLD);marker("chaoses survived",240,336,16,INK);
 }finally{DIRECT=0;ctx=oc;H=oh}
 c.toBlob(function(b){cb(b)},"image/png");
}
function share(){
 var url=location.href.split("?")[0].split("#")[0];
 var t="I survived "+(SHARE?SHARE.score:0)+" Mzansi chaoses in EISH! Ways to Go. "+url;
 shareCard(function(b){var f=b&&typeof File!=="undefined"?new File([b],"eish-score.png",{type:"image/png"}):null;
  if(f&&navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"EISH! Ways to Go",text:t}).catch(function(){});
  else if(navigator.share)navigator.share({title:"EISH! Ways to Go",text:t,url:url}).catch(function(){});
  else if(b){var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="eish-score.png";a.click()}});
}
function show(id){Array.prototype.forEach.call(document.querySelectorAll(".screen"),function(s){s.classList.toggle("active",s.id===id)});if(id!=="album")stopModal()}
function withCtx(c,w,h,fn){var oc=ctx,oh=H,od=DIRECT;ctx=c.getContext("2d");H=h;DIRECT=1;ctx.setTransform(c.width/W,0,0,c.width/W,0,0);try{fn()}finally{ctx=oc;H=oh;DIRECT=od}}
function refresh(){var n=activeDead();$("collCount").textContent=n;$("collTotal").textContent=LIST.length;$("bestTitle").textContent=LS.get("best",0);var db=LS.get("dbest",{})[today()];$("dailyInfo").textContent=db!=null?"today's best: "+db:"new set today!"}
function thumb(id){var c=document.createElement("canvas");c.width=180;c.height=140;c.className="thumb";withCtx(c,360,280,function(){if(DEF[id])DEF[id].paintDeath(1);else legacyCard(id,1)});return c}
function legacyCard(id,t){var L=LEGACY[id]||{who:"gogo",title:"EISH",cap:id};ctx.fillStyle="#f4e2c4";ctx.fillRect(0,0,W,H);cameo(L.who,180,H*0.78,260,"panic",t||1);stxt(L.title,180,70,42,GOLD)}
var CR=null;
function castRow(){
 var c=$("castc");if(!c)return;var ids=Object.keys(CAST),A=ids.map(function(k,i){return actor(i)}),busy=ids.map(function(){return 0});
 function size(){var b=c.getBoundingClientRect(),d=Math.min(DPRC,1.5);c.width=Math.round((b.width||360)*d);c.height=Math.round((b.height||200)*d)}size();window.addEventListener("resize",size);
 c.addEventListener("pointerdown",function(e){var b=c.getBoundingClientRect(),x=(e.clientX-b.left)*360/b.width,i=clamp(Math.floor(x/60),0,5);playOuch(A[i]);busy[i]=0.7;ac();sfx("pop",i)});
 var last2=0;(function loop(now){CR=requestAnimationFrame(loop);var dt=Math.min(0.05,(now-(last2||now))/1000);last2=now;if(!$("title").classList.contains("active"))return;CLK+=dt;A.forEach(function(a,i){tick(a,dt);if(busy[i]>0){busy[i]-=dt;if(busy[i]<=0)clipTo(a,[{t:0,sy:1,sx:1,y:0,rot:0,pose:"calm"}])}});
  withCtx(c,360,c.height*360/Math.max(1,c.width),function(){ctx.clearRect(0,0,W,H);A.forEach(function(a,i){drawActor(ids[i],a,32+i*56,H-6,H*0.78,{hat:"none"})})})})();
}
var MOD=null;function stopModal(){if(MOD){cancelAnimationFrame(MOD);MOD=null}var m=$("modal");if(m)m.classList.remove("on")}
function showAlbum(){
 var col=LS.get("dead",{}),box=$("collList");box.innerHTML="";$("albumCount").textContent=activeDead()+"/"+LIST.length;
 LIST.forEach(function(id,ix){var d=DEF[id],div=document.createElement("button");div.className="slot"+(col[id]?"":" locked");div.style.setProperty("--r",(((ix*37)%7)-3)*0.5+"deg");
  if(col[id]){div.appendChild(thumb(id));var p=document.createElement("b");p.textContent=d.title;div.appendChild(p);div.onclick=function(){openModal(id)}}
  else{var q=document.createElement("span");q.className="q";q.textContent="?";div.appendChild(q);var p2=document.createElement("b");p2.textContent=d.name;div.appendChild(p2)}
  box.appendChild(div)});
 var legacy=Object.keys(LEGACY).filter(function(id){return col[id]});
 var old=$("legacyWrap");if(old)old.remove();
 if(legacy.length){var wrap=document.createElement("div");wrap.id="legacyWrap";var h=document.createElement("h2");h.className="h2s";h.textContent="Kept from earlier sets";wrap.appendChild(h);
  legacy.forEach(function(id){var b=document.createElement("p");b.className="small";b.textContent=LEGACY[id].name+" — "+LEGACY[id].cap;wrap.appendChild(b)});
  box.parentNode.insertBefore(wrap,$("castList").previousSibling);}
 var cast="";Object.keys(CAST).forEach(function(k){cast+="<li><b>"+CAST[k].name+"</b> — "+CAST[k].line+"</li>"});$("castList").innerHTML=cast;show("album");
}
function openModal(id){stopModal();$("modal").classList.add("on");$("modCap").textContent=DEF[id]?capOf(id):(LEGACY[id]?LEGACY[id].cap:"");var c=$("modc");c.width=600;c.height=760;var t=0,l=0;sfx("pop");
 (function lp(now){MOD=requestAnimationFrame(lp);var dt=Math.min(0.05,(now-(l||now))/1000);l=now;t+=dt;if(t>5)t=0.4;
  withCtx(c,360,456,function(){ctx.clearRect(0,0,W,H);if(DEF[id])DEF[id].paintDeath(t);else legacyCard(id,t)})})();
}
var WSEL="boet";
function showWard(){
 var tabs=$("wTabs");tabs.innerHTML="";Object.keys(CAST).forEach(function(k){var b=document.createElement("button");b.textContent=CAST[k].name.split(" ")[0];b.className=k===WSEL?"on":"";b.onclick=function(){WSEL=k;showWard()};tabs.appendChild(b)});
 var hl=$("wHats");hl.innerHTML="";Object.keys(HATS).forEach(function(h){var ok=hatUnlocked(h),b=document.createElement("button");b.className="hat"+(ok?"":" locked")+((OUT[WSEL]||"none")===h?" on":"");
  var c=document.createElement("canvas");c.width=120;c.height=140;b.appendChild(c);
  withCtx(c,360,420,function(){ctx.fillStyle=ok?"#fff6e8":"#ddd2c0";ctx.fillRect(0,0,W,H);paintChar(WSEL,"calm",180,400,340,{hat:h})});
  var s=document.createElement("small");s.textContent=ok?HATS[h].name:HATS[h].txt;b.appendChild(s);
  b.onclick=function(){if(!ok){$("wNote").textContent=HATS[h].txt;sfx("tick");return}OUT[WSEL]=h;LS.set("out",OUT);sfx("pop");showWard()};
  hl.appendChild(b)});
 var pc=$("wPrev");withCtx(pc,360,300,function(){ctx.clearRect(0,0,W,H);paintChar(WSEL,"happy",180,290,250,{hat:OUT[WSEL]||"none"})});
 $("wNote").textContent="Hats are just for looks.";show("ward");
}
function showSet(){
 [["sSound","mute",true],["sMusic","music"],["sVib","vib"],["sRm","rm"]].forEach(function(o){
  var el=$(o[0]),v=SET[o[1]];if(o[2])v=!v;el.checked=!!v;
  el.onchange=function(){var nv=o[2]?!el.checked:el.checked;SET[o[1]]=nv;LS.set(o[1],nv);if(o[1]==="mute"){muted=nv;if(master)master.gain.value=nv?0:0.45;if(nv)music(false)}if(o[1]==="rm")document.body.classList.toggle("rm",nv);if(o[1]==="vib"&&nv)vib(16)};
 });
 show("set");
}
var OBI=0,OBD=[
 ["One word. Do the gesture.","Each round is one physical move: let go, swipe, drag, fan, steer. The hand on the card shows which.","drag"],
 ["The picture is the rule.","Gold means go. Green is the safe band. If it sparkles, that is the one. You can see the danger before it lands.","swipe"],
 ["Three lives. Silly stickers.","Miss, and the cast meets a cartoon fate. Each new one stays in the album.","tap"]
];
function showOnb(after){
 OBI=0;function paint(){$("obT").textContent=OBD[OBI][0];$("obP").textContent=OBD[OBI][1];$("obN").textContent=OBI<2?"Next":"Let's go!";$("obDots").textContent=["● ○ ○","○ ● ○","○ ○ ●"][OBI]}paint();
 var c=$("obc"),t0=0,l=0,raf2=0;
 (function lp(now){raf2=requestAnimationFrame(lp);var dt=Math.min(0.05,(now-(l||now))/1000);l=now;t0+=dt;if(!$("onb").classList.contains("active")){cancelAnimationFrame(raf2);return}
  withCtx(c,360,240,function(){ctx.clearRect(0,0,W,H);paintChar(["tannie","gogo","boet"][OBI],"happy",120,220,200);hand(250,140,t0,OBD[OBI][2])})})();
 $("obN").onclick=function(){sfx("pop");if(OBI<2){OBI++;paint()}else{LS.set("seen",1);cancelAnimationFrame(raf2);after()}};
 $("obSkip").onclick=function(){LS.set("seen",1);after()};show("onb");
}
function go(opt){ac();if(!LS.get("seen",0)&&!opt.skipOnb)showOnb(function(){startRun(opt)});else startRun(opt)}
function boot(){
 document.body.classList.toggle("rm",SET.rm);
 refresh();castRow();
 var sp=$("splash");if(sp){sp.classList.add("gone");setTimeout(function(){sp.remove()},400)}
 var dm=Q.get("mg"),dd=Q.get("death");
 if(dd&&DEF[dd]){show("play");resize();S={lives:1,score:0,lost:0,deaths:[],newD:[true]};play(dd,1,false,function(){});run.phase="res";run.win=false;run.pt=0.6;run.resT=99;run.newDeath=true}
 else if(dm==="survival")startRun({});
 else if(dm==="daily")startRun({daily:true});
 else if(dm&&G[dm]){show("play");resize();S={lives:3,score:0,lost:0,deaths:[],newD:[]};play(dm,+(Q.get("sp")||1),false,function(win){window.__last={id:dm,win:win};if(!Q.get("stay"))over()},Q.get("seed")!=null?+Q.get("seed"):null)}
 window.__box=Q.get("box")==="1";
 window.__ewg={ready:true,list:LIST,run:function(){return run},sim:sim,def:DEF,perf:function(){return {ft:FT.slice(),lat:LAT.slice(),dpr:DPRC}},resetPerf:function(){FT.length=0;LAT.length=0}};
 if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0&&!BOT)navigator.serviceWorker.register("sw.js").catch(function(){});
}
function init(){
 cv=$("mgc");ctx=cv.getContext("2d");MAINX=ctx;BGC=$("bgc");if(BGC)BGX=BGC.getContext("2d",{alpha:false});
 var pid=null;
 function strokeTo(p,up){if(!ptr.stroke)ptr.stroke={gid:ptr.gid,x0:p.x,y0:p.y,x:p.x,y:p.y,dx:0,dy:0,up:false};ptr.stroke.x=p.x;ptr.stroke.y=p.y;ptr.stroke.dx=p.x-ptr.stroke.x0;ptr.stroke.dy=p.y-ptr.stroke.y0;if(up)ptr.stroke.up=true}
 cv.addEventListener("pointerdown",function(e){if(pid!=null)return;pid=e.pointerId;var p=toL(e);ptr.gid=(ptr.gid||0)+1;ptr.x=p.x;ptr.y=p.y;ptr.down=true;ptr.taps.push(p);ptr.stamp=performance.now();ptr.stroke={gid:ptr.gid,x0:p.x,y0:p.y,x:p.x,y:p.y,dx:0,dy:0,up:false};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
 cv.addEventListener("pointermove",function(e){if(pid!=null&&e.pointerId!==pid)return;var p=toL(e);ptr.x=p.x;ptr.y=p.y;if(ptr.down)strokeTo(p,false)});
 cv.addEventListener("pointerup",function(e){if(pid!=null&&e.pointerId!==pid)return;var p=toL(e);ptr.x=p.x;ptr.y=p.y;if(ptr.down)strokeTo(p,true);ptr.down=false;pid=null});
 cv.addEventListener("pointercancel",function(e){if(pid!=null&&e.pointerId!==pid)return;ptr.down=false;if(ptr.stroke)ptr.stroke.up=true;pid=null});
 window.addEventListener("resize",resize);
 document.addEventListener("visibilitychange",function(){if(document.hidden)music(false)});
 $("playBtn").onclick=function(){go({})};$("dailyBtn").onclick=function(){go({daily:true})};
 $("shareBtn").onclick=share;$("menuBtn").onclick=function(){refresh();show("title")};
 $("collBtn").onclick=showAlbum;$("overColl").onclick=showAlbum;$("collBack").onclick=function(){refresh();show("title")};
 $("modal").onclick=stopModal;$("wardBtn").onclick=showWard;$("wBack").onclick=function(){show("title")};
 $("setBtn").onclick=showSet;$("setBack").onclick=function(){show("title")};
 $("muteBtn").onclick=function(){ac();muted=!muted;SET.mute=muted;LS.set("mute",muted);if(master)master.gain.value=muted?0:0.45;if(muted)music(false);$("muteBtn").textContent=muted?"🔇":"🔊"};
 $("muteBtn").textContent=muted?"🔇":"🔊";
 var sp=$("splash");if(sp){var n=sp.querySelector("p");if(n)n.textContent="mixing the paint..."}
 loadArt().then(boot).catch(function(err){if(sp){var n=sp.querySelector("p");if(n)n.textContent="Could not load art: "+err.message}});
}
init();
})();
