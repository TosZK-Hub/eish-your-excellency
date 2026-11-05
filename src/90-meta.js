// ---------- v1.0 meta: runner, input, bots, screens ----------
var LIST=Object.keys(DEF),S=null,bag=[],Q=new URLSearchParams(location.search),BOT=Q.get("bot")==="1";
var DPRMAX=Math.min(2,window.devicePixelRatio||1),DPRC=clamp(LS.get("q",DPRMAX),1,DPRMAX),FEMA=16,FBAD=0,FGOOD=0;
function adapt(ms){if(ms>250)return;FEMA+=(ms-FEMA)*0.15;if(FEMA>20&&DPRC>1.01){FGOOD=0;if(++FBAD>10){DPRC=Math.max(1,DPRC-(DPRC>1.5?0.5:0.25));FBAD=0;FEMA=16;resize();LS.set("q",DPRC)}}else{FBAD=0;if(FEMA<14&&DPRC<DPRMAX){if(++FGOOD>240){DPRC=Math.min(DPRMAX,DPRC+0.25);FGOOD=0;resize();LS.set("q",DPRC)}}else FGOOD=0}}
ptr.down=false;ptr.swipes=[];
var BOTI={tap:function(x,y){ptr.x=x;ptr.y=y;ptr.taps.push({x:x,y:y})},move:function(x,y){ptr.x=x;ptr.y=y},hold:function(on,x,y){ptr.down=!!on;if(x!=null){ptr.x=x;ptr.y=y}},swipe:function(x,y,dx,dy){ptr.swipes.push({x:x,y:y,dx:dx,dy:dy})}};
function frame(now){raf=requestAnimationFrame(frame);if(last)adapt(now-last);var dt=Math.min(0.05,(now-(last||now))/1000);last=now;if(!run)return;CLK+=dt;step(dt);if(run)draw();ptr.taps.length=0;ptr.swipes.length=0}
function step(dt){var r=run;r.pt+=dt;shake=SET.rm?0:Math.max(0,shake-dt);flashT=Math.max(0,flashT-dt);stepParts(dt);
 if(r.phase==="intro"){if(r.pt>=r.introT){r.phase="play";r.pt=0;ptr.taps.length=0;ptr.swipes.length=0;RNG=r.rng}return}
 if(r.phase==="play"){if(BOT&&r.g.bot&&r.pt>0.05)r.g.bot(BOTI);r.g.update(dt);var dur=r.g.dur/Math.pow(r.sp,0.5);r.left=Math.max(0,dur-r.pt);if(r.g.fail)end(false);else if(r.g.done)end(true);else if(r.pt>=dur)end(!!r.g.timeoutWin);return}
 if(r.phase==="res"&&r.pt>=r.resT){r.phase="wait";if(BOT)ptr.down=false;r.cb(r.win)}}
function end(win){var r=run;r.win=win;r.phase="res";r.pt=0;RNG=Math.random;
 if(win){r.resT=0.75;flashT=SET.rm?0:0.18;confetti(180,H*0.4,22);sfx(pick(["win","win","coin"]),3);vib(12)}
 else{r.resT=2.4;shake=SET.rm?0:0.35;sfx("fail");vib([40,30,90]);
  if(S){S.lives--;S.deaths.push(r.id);var col=LS.get("dead",{});if(!col[r.id]){col[r.id]=1;LS.set("dead",col);r.newDeath=true;S.newD.push(r.id)}}}}
function capOf(id){var d=DEF[id];return CAST[d.who].name+" "+d.cap.charAt(0).toLowerCase()+d.cap.slice(1)+"."}
function hud(r){if(S){for(var i=0;i<3;i++)heart(28+i*30,34+(i===S.lives?Math.sin(CLK*20)*2:0),22,i<S.lives);stxt(String(S.score),W-34,34,30,"#fffaf0",0.04);if(S.daily)marker("DAILY "+(S.score+S.lost)+"/"+S.list.length,180,30,15,"#fffaf0",0)}}
function drawTimer(r){var dur=r.g.dur/Math.pow(r.sp,0.5),f=clamp((r.left==null?dur:r.left)/dur,0,1),y=H-30,x0=22,w=W-44,lo=f<0.3,wob=lo&&!SET.rm?Math.sin(CLK*40)*1.5:0;
 ctx.save();ctx.translate(0,wob);spr("tm|"+Math.round(H),x0-30,y-30,w+60,60,function(){tornRect(x0-4,y-11,w+8,22,"#fffaf0",3,0);tape(x0+4,y,26,-0.5)});ctx.restore();ctx.save();ctx.beginPath();ctx.rect(x0,y-6+wob,w*f,12);ctx.clip();ctx.fillStyle=lo?"#e53935":"#f2c230";ctx.fillRect(x0,y-6+wob,w,12);
 if(BEAD.complete&&BEAD.naturalWidth&&!lo){ctx.globalAlpha=0.9;ctx.translate(x0,y-6+wob);ctx.scale(0.5,0.5);ctx.fillStyle=beadPat();ctx.fillRect(0,0,w*2,24)}ctx.restore();ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.strokeRect(x0,y-6+wob,w,12)}
function kraftBg(){paper("#e8d3a6");confettiDots(11,["#c9ad72","#fffaf0","#d9bf86"],30)}
function intro(r){var p=r.pt;if(r.boss){scene("bossbg",function(){burstBg("#d50000","#ff1744")});stxt("BOSS SPEED!",180,H*0.16,34,"#f2c230",0.05,popK(p))}else{scene("kraft",kraftBg);if(!SET.rm)speedLines(180,H*0.42,p,"rgba(255,250,240,.6)")}
 spr("card|"+Math.round(H)+"|"+(BEAD.naturalWidth?1:0),0,H*0.3-30,W,220,function(){tornRect(30,H*0.3,300,170,"#fffaf0",11,-0.035);if(BEAD.complete&&BEAD.naturalWidth){ctx.save();ctx.translate(30,H*0.3+4);ctx.rotate(-0.035);ctx.fillStyle=beadPat();ctx.scale(0.75,0.75);ctx.fillRect(0,0,400,24);ctx.restore()}tape(52,H*0.3+6,60,-0.5);tape(306,H*0.3-2,60,0.45)});
 var wd=r.g.word;stxt(wd,180,H*0.3+80,wd.length>9?36:wd.length>7?46:62,"#f2c230",-0.06,popK(p));marker(r.g.name,180,H*0.3+128,20,INK,0.02,popK(p-0.08));if(r.g.hint)marker(r.g.hint,180,H*0.3+154,14,"#7b1fa2",0.0,popK(p-0.14));
 if(r.g.how&&r.g.how!=="none")hand(282,H*0.3+150,p,r.g.how==="circle"?"circle":r.g.how);else if(r.g.how==="none")stxt("HANDS OFF",280,H*0.3+176,16,"#e53935",0.1,popK(p-0.2));
 drawChar(r.g.who,180,H*0.94,Math.min(230,H*0.3),"happy",p,{pop:popK(p-0.05)})}
function deathDraw(id,t){var d=DEF[id].dv;scene("d|"+id,d.bg);d.fg(t);stxt(d.title,180,H*0.11,d.title.length>7?44:54,d.col,-0.06,popK(t-0.1));marker(d.sub,180,H*0.19,18,INK,0.03,popK(t-0.25))}
function deathScreen(r,t){deathDraw(r.id,t);var y=H*0.66,cap=capOf(r.id);spr("cap|"+cap+"|"+Math.round(H),0,y-20,W,140,function(){tornRect(16,y,328,92,"#fffaf0",r.id.length*7,-0.025);tape(34,y+2,54,-0.5);tape(328,y+2,54,0.5);
 ctx.save();ctx.translate(180,y+46);ctx.rotate(-0.025);ctx.font="19px "+FT;ctx.fillStyle=INK;ctx.textAlign="center";ctx.textBaseline="middle";var wds=cap.split(" "),ln="",out=[];wds.forEach(function(k){var tt=ln?ln+" "+k:k;if(ctx.measureText(tt).width>296&&ln){out.push(ln);ln=k}else ln=tt});out.push(ln);out.forEach(function(l,i){ctx.fillText(l,0,(i-(out.length-1)/2)*23)});ctx.restore()});
 stxt(S&&S.lives>0?"-1 LIFE":"GAME OVER",180,H*0.86,36,"#e53935",-0.05,popK(t-0.35));if(r.newDeath)marker("NEW STICKER FOR THE ALBUM!",180,H*0.93,17,"#7b1fa2",0.03,popK(t-0.55))}
function draw(){var r=run,sc=cv.width/W,shx=0,shy=0;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);BGUSE=0;ctx.setTransform(sc,0,0,sc,0,0);if(shake>0){shx=rnd(-1,1)*shake*20;shy=rnd(-1,1)*shake*20;ctx.translate(shx,shy)}try{draw1(r)}finally{FORCESPR=0;if(BGC){var on=BGUSE?"block":"none";if(BGC.style.display!==on)BGC.style.display=on;var cs=cv.clientWidth/W;BGC.style.transform=shx||shy?"translate("+(shx*cs).toFixed(1)+"px,"+(shy*cs).toFixed(1)+"px)":""}}}
function draw1(r){
 if(r.phase==="intro")intro(r);
 else if(r.phase==="play"||r.win){r.g.draw();drawTimer(r);
  if(r.phase==="play"&&r.pt<0.24){ctx.save();tearPath(H*(1-easeInOut(r.pt/0.24))-10,5);ctx.fillStyle="#e8d3a6";ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=CUT;ctx.stroke();ctx.restore()}
  if(r.phase!=="play")stxt(r.winWord,180,H*0.38,60,"#86d27f",-0.08,popK(r.pt))}
 else{var t=r.pt;if(t<0.16){r.g.draw();ctx.fillStyle=t<0.05?"rgba(255,250,240,.85)":"rgba(43,27,51,.35)";ctx.fillRect(0,0,W,H);if(!SET.rm)speedLines(r.g.ix||180,r.g.iy||H/2,t,"#fffaf0");stxt("EISH!",clamp(r.g.ix||180,90,270),clamp((r.g.iy||H/2)-70,60,H-60),64,"#f2c230",-0.1,popK(t*2.5))}
  else if(t<0.46){var k=easeOut((t-0.16)/0.3);r.g.draw();ctx.save();tearPath(H*k+10,9);ctx.clip();FORCESPR=1;deathScreen(r,t-0.16);FORCESPR=0;ctx.restore();ctx.save();tearPath(H*k+10,9);ctx.lineWidth=6;ctx.strokeStyle=CUT;ctx.stroke();ctx.restore()}
  else deathScreen(r,t-0.16)}
 drawParts();if(flashT>0){ctx.fillStyle="rgba(255,250,240,"+flashT+")";ctx.fillRect(0,0,W,H)}if(r.phase!=="intro")hud(r)}
function toL(e){var b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*W/b.width}}
function resize(){var b=cv.getBoundingClientRect();if(!b.width)return;var dpr=DPRC;cv.width=Math.round(b.width*dpr);cv.height=Math.round(b.height*dpr);if(BGC){BGC.width=cv.width;BGC.height=cv.height;BGKEY=""}H=W*b.height/b.width}
function play(id,sp,boss,cb,seed){parts.length=0;RNG=seed!=null?seeded(seed):Math.random;var g=G[id](sp);var rng=RNG;RNG=Math.random;run={id:id,g:g,rng:rng,sp:sp,boss:boss,phase:"intro",pt:0,introT:boss?1.15:Math.max(0.7,1.0/Math.sqrt(sp))+(S&&S.score===0?0.4:0),cb:cb,winWord:pick(["LEKKER!","SHARP!","YOH, NICE!","HOWZIT!","EASY!"])};if(!raf){last=0;raf=requestAnimationFrame(frame)}}
// ---- daily challenge ----
function today(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function dailyList(day){var r=seeded(day*7+3),a=LIST.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a.slice(0,12)}
function startRun(opt){opt=opt||{};show("play");resize();var day=today();S={lives:3,score:0,lost:0,deaths:[],newD:[],daily:!!opt.daily,list:opt.daily?dailyList(day):null,day:day,only:opt.only};bag=[];ac();music(true,Math.random()<0.5?0:1);
 (function next(){var i=S.score+S.lost,id;if(S.daily){if(i>=S.list.length){over();return}id=S.list[i]}else id=S.only||(bag.length?bag.pop():(bag=LIST.slice().sort(function(){return Math.random()-0.5}),bag.pop()));
  var boss=!S.only&&S.score>0&&(S.score+1)%10===0,sp=Math.min(3.1,1+S.score*0.07)+(boss?0.4:0);if(boss)music(false),music(true,2);else if(SONG===SONGS[2])music(false),music(true,0);
  play(id,sp,boss,function(win){if(win)S.score++;else S.lost++;if(S.lives<=0)over();else next()},S.daily?day*31+i:null)})()}
function over(){var sc=S.score,best=LS.get("best",0),tot=LS.get("tot",0)+sc,before=Object.keys(HATS).filter(hatUnlocked);cancelAnimationFrame(raf);raf=0;var lastId=S.deaths[S.deaths.length-1]||run&&run.id;run=null;music(false);LS.set("tot",tot);
 if(sc>best)LS.set("best",sc);if(S.daily){var db=LS.get("dbest",{});var prev=db[S.day];if(prev==null||sc>prev)db[S.day]=sc;LS.set("dbest",db);if(S.lives>0||S.score+S.lost>=S.list.length){LS.set("daily",LS.get("daily",0)+1)}var st=LS.get("streak",{d:0,n:0});var y=new Date();y.setDate(y.getDate()-1);var yd=y.getFullYear()*10000+(y.getMonth()+1)*100+y.getDate();if(st.d!==S.day){st.n=st.d===yd?st.n+1:1;st.d=S.day;LS.set("streak",st)}}
 var after=Object.keys(HATS).filter(hatUnlocked),newHats=after.filter(function(h){return before.indexOf(h)<0});
 $("sScore").textContent=sc;$("sUnit").textContent=sc===1?"chaos":"chaoses";$("sCap").textContent=lastId?capOf(lastId):"";$("sBest").textContent=sc>best?"NEW BEST!":"Best: "+Math.max(best,sc);$("sDaily").textContent=S.daily?"Daily challenge "+fmtDay(S.day)+" · streak "+LS.get("streak",{n:1}).n:"";
 var nd=$("sNew");nd.innerHTML="";if(S.newD.length){var h=document.createElement("p");h.className="small";h.textContent="New stickers for the album:";nd.appendChild(h);S.newD.forEach(function(id){nd.appendChild(thumb(id,96,80))})}
 if(newHats.length){var p2=document.createElement("p");p2.className="unl";p2.textContent="Unlocked: "+newHats.map(function(h){return HATS[h].name}).join(", ")+"! Try it in the wardrobe.";nd.appendChild(p2)}
 SHARE={score:sc,id:lastId,daily:S.daily,day:S.day};$("toast").textContent="";var wasDaily=S.daily;S=null;refresh();show("over");$("againBtn").onclick=function(){startRun({daily:wasDaily})};sfx(sc>best?"fanfare":"win")}
function fmtDay(d){var s=String(d);return s.slice(6,8)+"/"+s.slice(4,6)}
// ---- shareable sticker-card PNG ----
var SHARE=null;
function shareCard(cb){var c=document.createElement("canvas");c.width=1080;c.height=1350;var oc=ctx,oh=H,ok=MAINX;ctx=c.getContext("2d");H=450;ctx.setTransform(3,0,0,3,0,0);FORCESPR=1;
 try{paper("#e8d3a6");confettiDots(5,["#c9ad72","#fffaf0","#f2c230"],40);if(BEAD.complete&&BEAD.naturalWidth){ctx.save();ctx.scale(0.5,0.5);ctx.fillStyle=beadPat();ctx.fillRect(0,0,W*2,24);ctx.fillRect(0,H*2-24,W*2,24);ctx.restore()}
  stxt("EISH!",120,52,44,"#e53935",-0.08);marker("Ways to Go",250,56,20,INK,0.03);tornRect(30,90,300,210,"#fffaf0",9,-0.02);
  if(SHARE&&SHARE.id){var t=document.createElement("canvas");t.width=840;t.height=600;var H0=H;ctx.save();var c2=ctx;ctx=t.getContext("2d");H=640;ctx.setTransform(840/360,0,0,840/360,0,0);ctx.beginPath();ctx.rect(0,0,W,H*0.64);ctx.clip();deathDraw(SHARE.id,1.2);ctx=c2;H=H0;ctx.restore();ctx.save();ctx.translate(180,195);ctx.rotate(-0.02);ctx.drawImage(t,0,0,840,600,-140,-100,280,200);ctx.restore()}
  tape(50,94,60,-0.5);tape(310,94,60,0.5);stxt(String(SHARE?SHARE.score:0),110,350,64,"#f2c230",-0.05);marker((SHARE&&SHARE.score===1?"chaos":"chaoses")+" survived",230,345,20,INK,0.02);
  if(SHARE&&SHARE.id){ctx.save();ctx.font="14px "+FT;ctx.fillStyle=INK;ctx.textAlign="center";ctx.fillText(capOf(SHARE.id).slice(0,64),180,392);ctx.restore()}marker(SHARE&&SHARE.daily?"Daily "+fmtDay(SHARE.day)+" - can you beat me?":"Can you beat me?",180,420,18,"#7b1fa2",-0.02)}finally{FORCESPR=0;ctx=oc;H=oh}
 c.toBlob(function(b){cb(b,c)},"image/png")}
function share(){var url=location.href.split("?")[0].split("#")[0],t="I survived "+(SHARE?SHARE.score:0)+" Mzansi chaoses in EISH! Ways to Go. Can you beat me? "+url;
 shareCard(function(b){var f=b&&typeof File!=="undefined"?new File([b],"eish-score.png",{type:"image/png"}):null;
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"EISH! Ways to Go",text:t}).catch(function(){})}
  else if(navigator.share){navigator.share({title:"EISH! Ways to Go",text:t,url:url}).catch(function(){})}
  else if(b){var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="eish-score.png";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);$("toast").textContent="Score card saved - send it to the family group!"}})}
// ---------- screens ----------
function show(id){Array.prototype.forEach.call(document.querySelectorAll(".screen"),function(s){s.classList.toggle("active",s.id===id)});if(id!=="album")stopModal()}
function withCtx(c,w,h,fn){var oc=ctx,oh=H;ctx=c.getContext("2d");H=h;ctx.setTransform(c.width/W,0,0,c.width/W,0,0);try{fn()}finally{ctx=oc;H=oh}}
function refresh(){var col=LS.get("dead",{});$("collCount").textContent=Object.keys(col).length;$("collTotal").textContent=LIST.length;$("bestTitle").textContent=LS.get("best",0);var db=LS.get("dbest",{})[today()];$("dailyInfo").textContent=db!=null?"today's best: "+db:"new set today!"}
function thumb(id,w,h){var c=document.createElement("canvas");c.width=w*2;c.height=h*2;c.className="thumb";withCtx(c,360,360*h/w/0.64,function(){FORCESPR=1;deathDraw(id,1);FORCESPR=0});return c}
var CR=null;function castRow(){var c=$("castc");if(!c)return;var ids=Object.keys(CAST),A=ids.map(function(k){return actor(k)}),busy=ids.map(function(){return 0}),t0=0;
 function size(){var b=c.getBoundingClientRect(),d=Math.min(DPRC,1.5);c.width=Math.round((b.width||360)*d);c.height=Math.round((b.height||150)*d)}size();window.addEventListener("resize",size);
 c.addEventListener("pointerdown",function(e){var b=c.getBoundingClientRect(),x=(e.clientX-b.left)*360/b.width,i=clamp(Math.floor((x-6)/58),0,5);setM(A[i],"panic");busy[i]=0.9;ac();sfx("pop",i)});
 var last2=0,lastF=-1;function loop(now){CR=requestAnimationFrame(loop);var dt=Math.min(0.05,(now-(last2||now))/1000);last2=now;if(!$("title").classList.contains("active"))return;t0+=dt;
  if(Math.random()<dt*0.5){var i=Math.floor(Math.random()*6);if(busy[i]<=0){setM(A[i],"happy");busy[i]=0.7}}
  A.forEach(function(a,i){a.mt+=dt;if(busy[i]>0){busy[i]-=dt;if(busy[i]<=0)setM(a,"calm")}});var fn=Math.floor(t0*12);if(fn===lastF)return;lastF=fn;
  withCtx(c,360,c.height*360/c.width,function(){ctx.clearRect(0,0,W,H);var hh=H;A.forEach(function(a,i){var x=36+i*57.6,big=i%2===0;drawChar(a.id,x,hh-8-(big?0:10),hh*0.86,"calm",t0,{actor:a,ph:i*1.7,flip:i>=3})})})}
 CR=requestAnimationFrame(loop)}
// sticker album
var MOD=null;function stopModal(){if(MOD){cancelAnimationFrame(MOD);MOD=null}var m=$("modal");if(m)m.classList.remove("on")}
function showAlbum(){var col=LS.get("dead",{}),box=$("collList");box.innerHTML="";$("albumCount").textContent=Object.keys(col).length+"/"+LIST.length;
 LIST.forEach(function(id,ix){var d=DEF[id],div=document.createElement("button");div.className="slot"+(col[id]?"":" locked");div.style.setProperty("--r",(((ix*37)%7)-3)*0.6+"deg");
  if(col[id]){div.appendChild(thumb(id,150,110));var p=document.createElement("b");p.textContent=d.dv.title;div.appendChild(p);div.onclick=function(){openModal(id)}}
  else{var q=document.createElement("span");q.className="q";q.textContent="?";div.appendChild(q);var p2=document.createElement("b");p2.textContent=d.name;div.appendChild(p2)}box.appendChild(div)});
 var cast="";Object.keys(CAST).forEach(function(k){cast+="<li><b>"+CAST[k].name+"</b> "+CAST[k].line+"</li>"});$("castList").innerHTML=cast;show("album")}
function openModal(id){stopModal();var m=$("modal"),c=$("modc");m.classList.add("on");$("modCap").textContent=capOf(id);c.width=600;c.height=Math.round(600*0.64*1.0);var t=0,l=0;sfx("pop",3);
 (function lp(now){MOD=requestAnimationFrame(lp);var dt=Math.min(0.05,(now-(l||now))/1000);l=now;t+=dt;if(t>4)t=0.5;withCtx(c,360,640,function(){FORCESPR=1;ctx.clearRect(0,0,W,H);deathDraw(id,t);FORCESPR=0})})()}
// wardrobe
var WSEL="boet";function showWard(){var tabs=$("wTabs");tabs.innerHTML="";Object.keys(CAST).forEach(function(k){var b=document.createElement("button");b.textContent=CAST[k].name.split(" ")[0]+(k==="gogo"?"":"");b.className=k===WSEL?"on":"";b.onclick=function(){WSEL=k;showWard()};tabs.appendChild(b)});
 var hl=$("wHats");hl.innerHTML="";Object.keys(HATS).forEach(function(h){var ok=hatUnlocked(h),b=document.createElement("button");b.className="hat"+(ok?"":" locked")+((OUT[WSEL]||"none")===h?" on":"");var c=document.createElement("canvas");c.width=120;c.height=120;b.appendChild(c);
  withCtx(c,360,360,function(){ctx.fillStyle=ok?"#fffaf0":"#cfc2a8";ctx.fillRect(0,0,W,H);drawChar(WSEL,180,600,560,"calm",0.3,{hat:h,ground:false})});var s=document.createElement("small");s.textContent=ok?HATS[h].name:HATS[h].txt;b.appendChild(s);
  b.onclick=function(){if(!ok){$("wNote").textContent="Locked: "+HATS[h].txt+".";sfx("tick");return}OUT[WSEL]=h;LS.set("out",OUT);sfx("pop",4);vib(8);showWard()};hl.appendChild(b)});
 var pc=$("wPrev");withCtx(pc,360,300,function(){ctx.clearRect(0,0,W,H);drawChar(WSEL,180,290,270,"happy",0.4,{})});$("wNote").textContent="Hats are just for looks. Earn them by playing.";show("ward")}
// settings
function showSet(){[["sSound","mute",true],["sMusic","music"],["sVib","vib"],["sRm","rm"]].forEach(function(o){var el=$(o[0]),v=SET[o[1]];if(o[2])v=!v;el.checked=v;el.onchange=function(){var nv=o[2]?!el.checked:el.checked;SET[o[1]]=nv;LS.set(o[1],nv);if(o[1]==="mute")setMute(nv);if(o[1]==="vib"&&nv)vib(20);if(o[1]==="rm")document.body.classList.toggle("rm",nv)}});show("set")}
function setMute(m){muted=m;SET.mute=m;LS.set("mute",m);if(master)master.gain.value=m?0:0.5;if(m)music(false)}
// onboarding
var OBI=0,OBD=[["One word. Do it. Fast!","Every microgame flashes ONE word: TAP!, DODGE!, HOLD!... The little hand shows you how.","tap"],["Beat the bead timer","Win before the beads run out. Some games you win just by surviving.","hold"],["3 lives. Silly ways to go.","Mess up and the cast meets a cartoon fate. Each new one is a sticker for your album.","swipe"]];
function showOnb(after){OBI=0;var c=$("obc"),t0=0,raf2=0;function paint(){$("obT").textContent=OBD[OBI][0];$("obP").textContent=OBD[OBI][1];$("obN").textContent=OBI<2?"Next":"Let's go!";$("obDots").textContent=["● ○ ○","○ ● ○","○ ○ ●"][OBI]}paint();
 var l=0;(function lp(now){raf2=requestAnimationFrame(lp);var dt=Math.min(0.05,(now-(l||now))/1000);l=now;t0+=dt;if(!$("onb").classList.contains("active")){cancelAnimationFrame(raf2);return}withCtx(c,360,240,function(){ctx.clearRect(0,0,W,H);var w=["boet","auntie","gogo"][OBI];drawChar(w,120,230,200,OBI===2?"dizzy":"happy",t0,{});hand(250,150,t0,OBD[OBI][2]);if(OBI===0)stxt("TAP!",250,60,40,"#f2c230",-0.06);if(OBI===1){ctx.fillStyle="#f2c230";ctx.fillRect(200,90,140*(1-(t0%3)/3),12);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(200,90,140,12)}if(OBI===2)for(var i=0;i<3;i++)heart(220+i*30,60,22,i<2)})})();
 $("obN").onclick=function(){sfx("pop",OBI);if(OBI<2){OBI++;paint()}else{LS.set("seen",1);after()}};$("obSkip").onclick=function(){LS.set("seen",1);after()};show("onb")}
function go(opt){ac();if(!LS.get("seen",0))showOnb(function(){startRun(opt)});else startRun(opt)}
function init(){cv=$("mgc");ctx=cv.getContext("2d");MAINX=ctx;BGC=$("bgc");if(BGC)BGX=BGC.getContext("2d",{alpha:false});try{Promise.all([document.fonts.load("20px Lucky"),document.fonts.load("20px Marker")]).then(function(){FOK=1})}catch(e){FOK=1}
 var anc=null;cv.addEventListener("pointerdown",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;ptr.down=true;ptr.taps.push(p);anc={x:p.x,y:p.y,t:performance.now()};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
 cv.addEventListener("pointermove",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;if(ptr.down&&anc){var dx=p.x-anc.x,dy=p.y-anc.y,now=performance.now();if(Math.hypot(dx,dy)>40){if(now-anc.t<350)ptr.swipes.push({x:anc.x,y:anc.y,dx:dx,dy:dy});anc={x:p.x,y:p.y,t:now}}}});
 ["pointerup","pointercancel","lostpointercapture"].forEach(function(ev){cv.addEventListener(ev,function(){ptr.down=false;anc=null})});window.addEventListener("resize",resize);
 document.addEventListener("visibilitychange",function(){if(document.hidden)music(false)});
 $("playBtn").onclick=function(){go({})};$("dailyBtn").onclick=function(){go({daily:true})};$("shareBtn").onclick=share;$("menuBtn").onclick=function(){refresh();show("title")};
 $("collBtn").onclick=showAlbum;$("overColl").onclick=showAlbum;$("collBack").onclick=function(){refresh();show("title")};$("modal").onclick=stopModal;
 $("wardBtn").onclick=showWard;$("wBack").onclick=function(){show("title")};$("setBtn").onclick=showSet;$("setBack").onclick=function(){show("title")};
 $("muteBtn").onclick=function(){ac();setMute(!muted);$("muteBtn").textContent=muted?"🔇":"🔊"};$("muteBtn").textContent=muted?"🔇":"🔊";if(SET.rm)document.body.classList.add("rm");
 refresh();castRow();var sp=$("splash");if(sp)setTimeout(function(){sp.classList.add("gone");setTimeout(function(){sp.remove()},400)},Q.get("mg")||Q.get("death")?0:700);
 var dm=Q.get("mg"),dd=Q.get("death");
 if(dd&&G[dd]){show("play");resize();S={lives:0,score:3,lost:0,deaths:[],newD:[]};play(dd,1,false,function(){});run.phase="res";run.win=false;run.pt=+(Q.get("t")||0.9)+0.16;run.resT=99;run.newDeath=true;if(Q.get("freeze")){var ft=run.pt;setInterval(function(){if(run)run.pt=ft},5)}}
 if(dm==="survival")startRun({});else if(dm==="daily")startRun({daily:true});else if(dm&&G[dm]){show("play");resize();S={lives:1,score:0,lost:0,deaths:[],newD:[]};play(dm,+(Q.get("sp")||1),false,function(win){window.__last={id:dm,win:win};if(!Q.get("stay"))over()})}
 if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0&&!BOT)navigator.serviceWorker.register("sw.js").catch(function(){});
 window.__ewg={list:LIST,run:function(){return run},state:function(){return S},play:function(id,sp,cb){show("play");resize();S={lives:1,score:0,lost:0,deaths:[],newD:[]};play(id,sp,false,function(w){cb&&cb(w)})},share:shareCard,def:DEF,icon:function(sz,mask){var c=document.createElement("canvas");c.width=c.height=sz;var oc=ctx,oh=H;ctx=c.getContext("2d");H=360;ctx.setTransform(sz/360,0,0,sz/360,0,0);FORCESPR=1;
 try{if(!mask){ctx.save();ctx.beginPath();ctx.arc(180,180,176,0,7);ctx.clip()}burstBg("#f2c230","#e8b020",180,200);if(mask){ctx.translate(180,180);ctx.scale(0.78,0.78);ctx.translate(-180,-180)}
  drawChar("gogo",180,352,250,"shock",0.35,{ground:false});stxt("EISH!",180,74,78,"#e53935",-0.08);if(!mask){ctx.restore();ctx.lineWidth=8;ctx.strokeStyle=INK;ctx.beginPath();ctx.arc(180,180,174,0,7);ctx.stroke()}}
 finally{FORCESPR=0;ctx=oc;H=oh}return c.toDataURL("image/png")}}}
init();
})();
