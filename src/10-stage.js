// Stage: intro, HUD, deaths, the run loop.
var run=null,S=null,Q=new URLSearchParams(location.search),BOT=Q.get("bot")==="1"&&Q.get("fair")!=="1";
var DPRMAX=Math.min(1.75,window.devicePixelRatio||1),DPRC=clamp(LS.get("q",DPRMAX),1,DPRMAX),FEMA=16,FBAD=0,FGOOD=0;
function adapt(ms){if(ms>250)return;FEMA+=(ms-FEMA)*0.12;if(FEMA>22&&DPRC>1.05){FGOOD=0;if(++FBAD>8){DPRC=Math.max(1,DPRC-0.25);FBAD=0;FEMA=16;resize();LS.set("q",DPRC)}}else{FBAD=0;if(FEMA<14&&DPRC<DPRMAX&&++FGOOD>180){DPRC=Math.min(DPRMAX,DPRC+0.25);FGOOD=0;resize();LS.set("q",DPRC)}}}
function readInset(){
 var sat=$("sat"),sab=$("sab");
 var bw=cv?cv.getBoundingClientRect().width:360;
 var sc=bw?W/bw:1;
 SAT=sat?sat.getBoundingClientRect().height*sc:0;
 SAB=sab?sab.getBoundingClientRect().height*sc:0;
}
function resize(){if(!cv)return;var b=cv.getBoundingClientRect();if(!b.width)return;cv.width=Math.round(b.width*DPRC);cv.height=Math.round(b.height*DPRC);if(BGC){BGC.width=cv.width;BGC.height=cv.height;BGCUR=""}H=W*b.height/Math.max(1,b.width);readInset()}
function toL(e){var b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*W/b.width}}

function meter(x,y,w,h,f,lo,hi){
 rr(x,y,w,h,8,PAPER);ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke();
 var inner=h-8, top=y+4;
 ctx.fillStyle="#d7efe0";ctx.fillRect(x+4, top+inner*(1-hi), w-8, inner*(hi-lo));
 ctx.fillStyle=GOLD;var fh=inner*clamp(f,0,1);ctx.fillRect(x+6, top+inner-fh, w-12, fh);
 ctx.strokeStyle="#146c2e";ctx.lineWidth=3;ctx.beginPath();
 ctx.moveTo(x+2, top+inner*(1-hi));ctx.lineTo(x+w-2, top+inner*(1-hi));
 ctx.moveTo(x+2, top+inner*(1-lo));ctx.lineTo(x+w-2, top+inner*(1-lo));ctx.stroke();
}
function hand(x,y,t,kind){
 var p=(t*1.3)%1,dx=0,dy=0;
 if(kind==="swipe")dy=-28+56*p;
 else if(kind==="drag")dx=-36+72*smooth(p);
 else if(kind==="circle"){dx=Math.cos(t*5)*26;dy=Math.sin(t*5)*18}
 else if(kind==="hold")dy=Math.sin(t*7)*2;
 else dy=-Math.abs(Math.sin(t*6))*14;
 ctx.save();ctx.translate(x+dx,y+dy);ctx.rotate(-0.2);
 rr(-14,-26,30,36,12,"#f3c9a4");ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke();
 ctx.restore();
}
function drawIntro(r){
 var d=DEF[r.id];
 backdrop(d.bg||"kitchen");
 ctx.fillStyle="rgba(28,18,16,.28)";ctx.fillRect(0,0,W,H);
 var y=H*0.28;
 rr(28,y,304,168,14,PAPER);ctx.lineWidth=4;ctx.strokeStyle=INK;ctx.stroke();
 if(ART.bead){ctx.save();ctx.beginPath();rr(36,y+8,288,16,4);ctx.clip();for(var bx=36;bx<330;bx+=32)ctx.drawImage(ART.bead,bx,y+8,32,16);ctx.restore()}
 var wd=d.word;stxt(wd,180,y+78,wd.length>8?36:52,GOLD,-0.03);
 marker(d.name,180,y+118,18,INK);
 if(d.hint)marker(d.hint,180,y+146,13,"#6a3d78");
 if(d.how)hand(300,y+150,r.pt,d.how);
 var k=SET.rm?1:easeOutBack(clamp(r.pt/0.45,0,1));
 paintChar(d.who,"happy",180,H*0.92,Math.min(280,H*0.34),{sy:k,sx:k});
 if(r.boss)stxt("BOSS SPEED",180,y-28,28,"#ff8a80",-0.04);
}
function drawTimer(r){
 var dur=r.g.dur,f=clamp((r.left==null?dur:r.left)/dur,0,1);
 var y=H-28-SAB,x0=24,w=W-48,lo=f<0.28;
 rr(x0-4,y-10,w+8,20,8,PAPER);ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke();
 ctx.save();ctx.beginPath();ctx.rect(x0,y-6,Math.max(0,w*f),12);ctx.clip();
 ctx.fillStyle=lo?"#e23b3b":GOLD;ctx.fillRect(x0,y-6,w,12);ctx.restore();
}
function hud(r){
 if(!S)return;
 for(var i=0;i<3;i++)heart(26+SAT*0+i*28,22+SAT,20,i<S.lives);
 stxt(String(S.score),W-28,22+SAT,26,PAPER);
 if(S.daily)marker("DAILY "+(S.score+S.lost)+"/"+S.list.length,180,20+SAT,13,PAPER);
}
function capOf(id){var d=DEF[id];if(!d)return "";return CAST[d.who].name+" "+d.cap.charAt(0).toLowerCase()+d.cap.slice(1)+"."}
function showDeath(r,t){
 var d=DEF[r.id];
 if(d.paintDeath)d.paintDeath(t);
 scrim();
 stxt(d.title,180,64+SAT,d.title.length>8?36:48,d.tcol||GOLD,-0.04);
 marker(d.sub,180,104+SAT,15,INK);
 var y=H*0.70;
 rr(18,y,324,86,12,PAPER);ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke();
 ctx.save();wrapInk(capOf(r.id),180,y+42,16,292);ctx.restore();
 stxt(S&&S.lives>0?"-1 LIFE":"GAME OVER",180,H*0.88,30,"#e23b3b",-0.03);
 if(r.newDeath)marker("NEW STICKER FOR THE ALBUM",180,H*0.94,14,"#6a3d78");
}
function draw(){
 var sc=cv.width/W,shx=0,shy=0;
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
 BGUSE=0;ctx.setTransform(sc,0,0,sc,0,0);
 if(shake>0&&!SET.rm){shx=(Math.random()*2-1)*shake*16;shy=(Math.random()*2-1)*shake*16;ctx.translate(shx,shy)}
 var r=run;
 if(!r)return;
 if(r.phase==="intro")drawIntro(r);
 else if(r.phase==="play"||r.win){
  r.g.draw();scrim();
  if(r.phase!=="play")stxt(r.winWord,180,H*0.36,46,"#b6e2a1",-0.05);
  drawTimer(r);hud(r);
 } else {
  if(r.pt<0.12){r.g.draw();ctx.fillStyle="rgba(255,250,240,"+(0.85-r.pt*4)+")";ctx.fillRect(0,0,W,H);stxt("EISH!",180,H*0.4,64,GOLD,-0.08)}
  else showDeath(r,r.pt);
  hud(r);
 }
 drawParts();
 if(window.__box&&r&&r.phase==="play"&&r.g&&r.g.pub&&r.g.pub.dbg){ctx.save();ctx.strokeStyle="#ff2bd6";ctx.lineWidth=2;ctx.setLineDash([5,3]);
  for(var bi=0;bi<r.g.pub.dbg.length;bi++){var b=r.g.pub.dbg[bi];if(!b)continue;ctx.strokeRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h)}
  ctx.setLineDash([]);ctx.fillStyle="#00e5ff";ctx.beginPath();ctx.arc(ptr.x,ptr.y,6,0,7);ctx.fill();ctx.restore()}
 if(flashT>0&&!SET.rm){ctx.fillStyle="rgba(255,250,240,"+(flashT*1.3)+")";ctx.fillRect(0,0,W,H)}
 if(BGC){BGC.style.display=BGUSE?"block":"none";var cs=(cv.clientWidth||1)/W;BGC.style.transform=shx||shy?"translate("+(shx*cs).toFixed(1)+"px,"+(shy*cs).toFixed(1)+"px)":""}
}
function end(win){
 var r=run;if(!r||r.phase!=="play")return;
 r.win=win;r.phase="res";r.pt=0;HIT=0;
 if(win){r.resT=0.78;flashT=SET.rm?0:0.14;sfx(Math.random()<0.7?"win":"coin");vib(12);burst(180,H*0.4,GOLD,10)}
 else{r.resT=2.2;shake=SET.rm?0:0.4;hitStop(0.08);sfx("fail");vib([28,36,70]);
  if(!SIM&&S){S.lives--;S.deaths.push(r.id);var col=LS.get("dead",{});if(!col[r.id]){col[r.id]=1;LS.set("dead",col);r.newDeath=true;S.newD.push(r.id)}}}
}
function stepLogic(dt){
 var r=run;if(!r)return;
 if(r.phase==="intro"){r.pt+=dt;if(r.pt>=r.introT){r.phase="play";r.pt=0;r.grace=SIM?0:0.22;ptr.taps.length=0;ptr.swipes.length=0;ptr.stroke=null;ptr.wasDown=ptr.down}return}
 if(r.phase==="play"){
  if(window.__freeze)return;
  if(BOT&&r.g.bot)r.g.bot(BOTI);
  ptr.pressed=ptr.down&&!ptr.wasDown;ptr.released=!ptr.down&&ptr.wasDown;
  if(r.grace>0){r.grace-=dt;ptr.pressed=false;ptr.released=false;if(r.grace<=0&&ptr.down)ptr.pressed=true}
  if(ptr.pressed&&ptr.stamp){LAT.push(performance.now()-ptr.stamp);if(LAT.length>120)LAT.shift();ptr.stamp=0}
  var pdt=(HIT>0&&!SET.rm)?dt*0.55:dt;HIT=Math.max(0,HIT-dt);
  var prev=RNG;RNG=r.rng||Math.random;r.g.update(pdt);RNG=prev;
  ptr.wasDown=ptr.down;r.pt+=pdt;
  var dur=r.g.dur;r.left=Math.max(0,dur-r.pt);
  if(r.g.fail)end(false);else if(r.g.done)end(true);else if(r.pt>=dur)end(!!r.g.timeoutWin);
  ptr.taps.length=0;ptr.swipes.length=0;if(ptr.stroke&&ptr.stroke.up)ptr.stroke=null;return}
 if(r.phase==="res"){r.pt+=dt;if(r.pt>=r.resT&&!SIM){var cb=r.cb;r.phase="wait";cb(r.win)}}
}
function frame(now){
 raf=requestAnimationFrame(frame);
 if(document.hidden){last=now;return}
 if(last){var ms=now-last;adapt(ms);if(run){FT.push(ms);if(FT.length>240)FT.shift()}}
 var dt=Math.min(0.05,(now-(last||now))/1000);last=now;
 if(!isFinite(CLK))CLK=0;CLK+=dt;shake=SET.rm?0:Math.max(0,shake-dt*1.4);flashT=Math.max(0,flashT-dt);stepParts(dt);
 if(!run)return;stepLogic(dt);draw();
}
var BOTI={
 tap:function(x,y){ptr.x=x;ptr.y=y;ptr.taps.push({x:x,y:y});ptr.down=false},
 move:function(x,y){ptr.x=x;ptr.y=y},
 hold:function(on,x,y){ptr.down=!!on;if(x!=null){ptr.x=x;ptr.y=y}},
 swipe:function(x,y,dx,dy){ptr.swipes.push({x:x,y:y,dx:dx,dy:dy})}
};
function play(id,sp,boss,cb,seed){
 parts.length=0;ptr.down=false;ptr.wasDown=false;ptr.taps.length=0;ptr.swipes.length=0;RNG=seed!=null?seeded(seed):Math.random;
 var g=G[id](sp);var rng=RNG;RNG=Math.random;
 var d=DEF[id];
 run={id:id,g:g,rng:rng,sp:sp,boss:!!boss,phase:"intro",pt:0,introT:boss?1.05:Math.max(0.72,1.05/Math.sqrt(sp))+(S&&S.score===0?0.35:0),cb:cb,left:g.dur,winWord:d.win||pick(["LEKKER!","SHARP!","YOH, NICE!","HOWZIT!"])};
 BGCUR="";if(!raf){last=0;raf=requestAnimationFrame(frame)}
}
function sim(id,sp,seed){
 var prev=run,ps=SIM;SIM=1;
 var lives=S?S.lives:3;
 RNG=seed!=null?seeded(seed|0):Math.random;
 var g=G[id](sp);var rng=RNG;RNG=Math.random;
 run={id:id,g:g,rng:rng,sp:sp,boss:false,phase:"play",pt:0,cb:function(){},left:g.dur,winWord:"OK",resT:9};
 ptr.down=false;ptr.wasDown=false;ptr.taps.length=0;ptr.swipes.length=0;HIT=0;
 var n=0,dt=1/30;
 while(run.phase==="play"&&n<30*16){n++;CLK+=dt;stepLogic(dt)}
 var out={id:id,sp:sp,seed:seed,win:!!run.win,why:g.fail?"fail":g.done?"done":"timeout",n:n};
 run=prev;SIM=ps;if(S)S.lives=lives;
 return out;
}
