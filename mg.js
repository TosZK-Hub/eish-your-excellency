// Eish, Your Excellency - Dumb-Ways-style microgames. Pure canvas, no assets.
(function(){
"use strict";
var cv,ctx,W=360,H=640,dpr=1,raf=0,last=0,shake=0,parts=[],flashT=0;
var ptr={x:180,y:500,down:false,taps:[]};
var AC=null;
function blip(f,d,type){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain();o.type=type||"square";o.frequency.value=f;g.gain.value=0.06;o.connect(g);g.connect(AC.destination);var t=AC.currentTime;g.gain.exponentialRampToValueAtTime(0.0001,t+(d||0.1));o.start(t);o.stop(t+(d||0.1))}catch(e){}}
function rnd(a,b){return a+Math.random()*(b-a)}
function rr(x,y,w,h,r,fill){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke()}
function circ(x,y,r,fill,lw){ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function ell(x,y,rx,ry,fill,lw){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function txt(s,x,y,size,fill,rot){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font="900 "+size+"px 'Trebuchet MS',Impact,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";ctx.lineWidth=Math.max(4,size/6);ctx.strokeStyle="#111";ctx.strokeText(s,0,0);ctx.fillStyle=fill||"#fff";ctx.fillText(s,0,0);ctx.restore()}
function wrap(s,x,y,size,maxW,fill){ctx.font="900 "+size+"px 'Trebuchet MS',sans-serif";var w=s.split(" "),line="",lines=[];w.forEach(function(k){var t=line?line+" "+k:k;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=k}else line=t});lines.push(line);lines.forEach(function(l,i){txt(l,x,y+i*size*1.2,size,fill)})}
function burst(x,y,col,n){for(var i=0;i<(n||10);i++)parts.push({x:x,y:y,vx:rnd(-220,220),vy:rnd(-260,60),l:0.5,c:col})}
function bean(x,y,r,col,face){ // cute bean character
 ell(x,y,r*0.8,r,col);
 if(face==="x"){ctx.lineWidth=4;ctx.strokeStyle="#111";[[-0.3],[0.3]].forEach(function(o){var ex=x+o[0]*r,ey=y-0.25*r;ctx.beginPath();ctx.moveTo(ex-6,ey-6);ctx.lineTo(ex+6,ey+6);ctx.moveTo(ex+6,ey-6);ctx.lineTo(ex-6,ey+6);ctx.stroke()})}
 else{circ(x-0.28*r,y-0.25*r,r*0.16,"#fff",3);circ(x+0.28*r,y-0.25*r,r*0.16,"#fff",3);circ(x-0.26*r,y-0.23*r,r*0.07,"#111",0);circ(x+0.3*r,y-0.23*r,r*0.07,"#111",0)}
 ctx.beginPath();if(face==="x"){ctx.moveTo(x-r*0.2,y+r*0.25);ctx.lineTo(x+r*0.2,y+r*0.25)}else ctx.arc(x,y+r*0.12,r*0.25,0.2,Math.PI-0.2);ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();
}
function bakkie(x,y){rr(x-30,y-50,60,100,12,"#fff");rr(x-24,y-38,48,26,6,"#4fc3f7");rr(x-26,y+2,52,40,6,"#e0e0e0");circ(x-10,y+20,5,"#e53935",0);circ(x+10,y+20,5,"#43a047",0)}
function uncleFace(x,y,s,fed){circ(x,y,30*s,"#f1c27d");ell(x,y+8*s,16*s,5*s,"#6d4c41",3);circ(x-10*s,y-6*s,4*s,"#111",0);circ(x+10*s,y-6*s,4*s,"#111",0);
 if(fed){rr(x-26*s,y+12*s,52*s,12*s,6,"#c0392b");rr(x-30*s,y+10*s,60*s,7*s,4,"#f5deb3")}else{ell(x,y+20*s,8*s,7*s,"#7b1f1f",3)}}

// ----- microgames: each returns {word,dur,cap:[...],death,bg,update(dt),draw(t),fail,done,timeoutWin} -----
var G={};
G.pothole=function(sp){var g={word:"DODGE!",dur:4,bg:"#555",death:"hole",timeoutWin:true,meter:"roads",
 cap:["Tried to fix the pothole himself","Stopped the bakkie to argue about the taxi fare","Swerved for a goat, met its whole family"],
 cx:180,obs:[],sp0:0.45,t:0,road:0};
 g.update=function(dt){g.t+=dt;g.road=(g.road+dt*420*sp)%80;g.cx+=(ptr.x-g.cx)*Math.min(1,dt*14);g.cx=Math.max(50,Math.min(310,g.cx));
  g.sp0-=dt;if(g.sp0<=0){g.sp0=0.55/sp;var k=["hole","hole","cone","goat","taxi"][Math.floor(Math.random()*5)];g.obs.push({x:Math.random()<0.5?g.cx+rnd(-30,30):rnd(50,310),y:-40,k:k})}
  var by=H-140;g.obs.forEach(function(o){o.y+=dt*360*sp;if(Math.abs(o.y-by)<48&&Math.abs(o.x-g.cx)<(o.k==="taxi"?52:42)){g.fail=true;g.capI=o.k==="taxi"?1:o.k==="goat"?2:0}})};
 g.draw=function(){ctx.fillStyle="#7cb342";ctx.fillRect(0,0,W,H);ctx.fillStyle="#555";ctx.fillRect(30,0,300,H);ctx.fillStyle="#fff";for(var y=-80+g.road;y<H;y+=80)ctx.fillRect(176,y,8,40);
  g.obs.forEach(function(o){if(o.k==="hole"){ell(o.x,o.y,36,20,"#222")}else if(o.k==="cone"){ctx.beginPath();ctx.moveTo(o.x,o.y-26);ctx.lineTo(o.x+18,o.y+18);ctx.lineTo(o.x-18,o.y+18);ctx.closePath();ctx.fillStyle="#ff6d00";ctx.fill();ctx.lineWidth=4;ctx.stroke()}
   else if(o.k==="goat"){ell(o.x,o.y,26,18,"#fafafa");circ(o.x+22,o.y-14,11,"#fafafa");ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.x+18,o.y-24);ctx.lineTo(o.x+12,o.y-34);ctx.stroke()}
   else{rr(o.x-36,o.y-40,72,80,10,"#fff176");rr(o.x-28,o.y-30,56,20,4,"#4fc3f7");txt("TAXI",o.x,o.y+14,14,"#e53935")}});
  bakkie(g.cx,H-140)};return g};
G.lights=function(sp){var n=Math.min(6,3+Math.floor(sp)),g={word:"TAP!",dur:4,bg:"#1a237e",death:"zap",timeoutWin:false,meter:"power",
 cap:["Licked the plug to see if load-shedding was over","Touched the braai grid to check if it was hot","Tried to charge the phone on a potato"],houses:[],left:n};
 var pos=[[90,220],[270,220],[90,380],[270,380],[90,540],[270,540]];for(var i=0;i<n;i++)g.houses.push({x:pos[i][0],y:pos[i][1]*H/640,on:false,f:Math.random()});
 g.update=function(dt){ptr.taps.forEach(function(p){g.houses.forEach(function(h){if(!h.on&&Math.abs(p.x-h.x)<70&&Math.abs(p.y-h.y)<70){h.on=true;g.left--;burst(h.x,h.y-30,"#ffee58");blip(660+g.left*80,0.08)}})});g.houses.forEach(function(h){h.f+=dt*9});if(g.left<=0)g.done=true};
 g.draw=function(){ctx.fillStyle="#1a237e";ctx.fillRect(0,0,W,H);g.houses.forEach(function(h){var lit=h.on||Math.sin(h.f*3)>0.7;if(h.on)circ(h.x,h.y,70,"rgba(255,238,88,.25)",0);
  ctx.beginPath();ctx.moveTo(h.x-50,h.y-10);ctx.lineTo(h.x,h.y-55);ctx.lineTo(h.x+50,h.y-10);ctx.closePath();ctx.fillStyle="#e53935";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();
  rr(h.x-42,h.y-12,84,62,4,"#fff8e1");rr(h.x-30,h.y,24,22,3,lit?"#ffee58":"#263238");rr(h.x+6,h.y,24,22,3,lit?"#ffee58":"#263238")})};return g};
G.uncle=function(sp){var g={word:"FEED!",dur:4.5,bg:"#8d6e63",death:"zzz",timeoutWin:false,meter:"uncles",
 cap:["Asked Uncle a question at the wedding","Said 'just quickly' to Uncle at the braai","Made eye contact during Uncle's 'few words'"],need:Math.min(7,3+Math.floor(sp*1.2)),got:0,u:[],sp0:0};
 var spots=[[80,230],[180,200],[280,230],[80,420],[180,390],[280,420]];
 g.update=function(dt){g.sp0-=dt;if(g.sp0<=0){g.sp0=0.4/sp;var free=spots.filter(function(s){return!g.u.some(function(u){return u.s===s})});if(free.length)g.u.push({s:free[Math.floor(Math.random()*free.length)],l:1.3/sp,fed:0})}
  ptr.taps.forEach(function(p){g.u.forEach(function(u){var y=u.s[1]*H/640;if(!u.fed&&Math.abs(p.x-u.s[0])<50&&Math.abs(p.y-y)<55){u.fed=0.4;g.got++;burst(u.s[0],y,"#c0392b",8);blip(520+g.got*60,0.07)}})});
  g.u.forEach(function(u){if(u.fed)u.fed-=dt;else u.l-=dt});g.u=g.u.filter(function(u){return u.fed?u.fed>0:u.l>0});if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#8d6e63";ctx.fillRect(0,0,W,H);rr(40,H-170,280,60,10,"#424242");for(var i=0;i<6;i++){ctx.fillStyle="#ff7043";ctx.fillRect(60+i*45,H-160,30,12)}
  g.u.forEach(function(u){var y=u.s[1]*H/640;uncleFace(u.s[0],y,1,u.fed>0);if(!u.fed){rr(u.s[0]-62,y-72,124,26,8,"#fff");ctx.font="bold 11px sans-serif";ctx.fillStyle="#111";ctx.textAlign="center";ctx.fillText("Just a few words...",u.s[0],y-58)}});
  txt(g.got+"/"+g.need+" fed",180,H-60,26,"#ffee58")};return g};
G.budget=function(sp){var g={word:"CATCH!",dur:4.5,bg:"#2e7d32",death:"broke",timeoutWin:false,meter:"treasury",
 cap:["Hired a consultant to count the consultants","Let a 'consultant' hold the briefcase quickly","Paid R2 million for a PowerPoint about PowerPoints"],need:Math.min(8,4+Math.floor(sp)),got:0,it:[],sp0:0,cx:180};
 g.update=function(dt){g.cx+=(ptr.x-g.cx)*Math.min(1,dt*16);g.sp0-=dt;if(g.sp0<=0){g.sp0=0.32/sp;g.it.push({x:rnd(40,320),y:-30,c:Math.random()<0.3})}
  var by=H-110;g.it.forEach(function(o){o.y+=dt*300*sp;if(!o.g&&Math.abs(o.y-by)<36&&Math.abs(o.x-g.cx)<50){o.g=1;if(o.c){g.fail=true}else{g.got++;burst(o.x,o.y,"#69f0ae",6);blip(700+g.got*40,0.06)}}});g.it=g.it.filter(function(o){return!o.g&&o.y<H+40});if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#2e7d32";ctx.fillRect(0,0,W,H);g.it.forEach(function(o){if(o.c){ell(o.x,o.y+10,20,24,"#607d8b");circ(o.x,o.y-20,14,"#ffcc80");ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(o.x-18,o.y);ctx.lineTo(o.x-34,o.y-20);ctx.moveTo(o.x+18,o.y);ctx.lineTo(o.x+34,o.y-20);ctx.stroke()}else{rr(o.x-24,o.y-12,48,24,4,"#a5d6a7");txt("R",o.x,o.y,14,"#1b5e20")}});
  rr(g.cx-48,H-130,96,56,8,"#6d4c41");rr(g.cx-14,H-142,28,14,4,"#4e342e");txt(g.got+"/"+g.need,180,60,28,"#ffee58")};return g};
G.mozzie=function(sp){var g={word:"SWAT!",dur:3.5,bg:"#311b92",death:"bumps",timeoutWin:false,meter:"mood",cap:["Slept with the window open in December","Said 'one mozzie can't hurt'","Clapped at the mozzie, hit the sunburn"],t:rnd(0,6),x:180,y:300};
 g.update=function(dt){g.t+=dt*2.2*sp;g.x=180+Math.sin(g.t*1.3)*130;g.y=H*0.45+Math.sin(g.t*2.1)*H*0.25;ptr.taps.forEach(function(p){if(Math.hypot(p.x-g.x,p.y-g.y)<48){g.done=true;burst(g.x,g.y,"#fff",12);blip(900,0.1)}else{shake=0.1;blip(150,0.05)}})};
 g.draw=function(){ctx.fillStyle="#311b92";ctx.fillRect(0,0,W,H);rr(60,H-200,240,120,20,"#90caf9");bean(180,H-200,40,"#ffa726");ell(g.x-10,g.y-12,12,7,"rgba(255,255,255,.7)",2);ell(g.x+10,g.y-12,12,7,"rgba(255,255,255,.7)",2);ell(g.x,g.y,10,6,"#212121",2);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(g.x-10,g.y);ctx.lineTo(g.x-24,g.y+6);ctx.stroke()};return g};
G.snack=function(sp){var g={word:"CATCH!",dur:3.5,bg:"#ff7043",death:"tears",timeoutWin:false,meter:"mood",cap:["Dropped the last NakNak at the braai","Let the dog 'hold' the chips","Shared the NakNaks with the cousins"],x:rnd(60,300),y:-40,t:0,cx:180,vy:0,wait:rnd(0.2,0.8)};
 g.update=function(dt){g.cx+=(ptr.x-g.cx)*Math.min(1,dt*16);g.wait-=dt;if(g.wait>0)return;g.t+=dt;g.y+=dt*(260+g.t*200)*sp;g.x+=Math.sin(g.t*6)*dt*160*sp;g.x=Math.max(30,Math.min(330,g.x));
  if(Math.abs(g.y-(H-130))<30&&Math.abs(g.x-g.cx)<55){g.done=true;burst(g.x,g.y,"#ffee58",12);blip(800,0.1)}else if(g.y>H-90)g.fail=true};
 g.draw=function(){ctx.fillStyle="#ff7043";ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.sin(g.t*8)*0.4);rr(-26,-34,52,68,8,"#ffd600");txt("NAK",0,-8,15,"#e53935");txt("NAKS",0,12,13,"#e53935");ctx.restore();rr(g.cx-50,H-125,100,30,15,"#ffcc80");txt("Catch the snack!",180,60,18,"#fff")};return g};
G.rugby=function(sp){var g={word:"DUCK!",dur:3.5,bg:"#43a047",death:"bonk",timeoutWin:true,meter:"mood",cap:["Stood behind the posts at the school rugby","Shouted 'kick it here, boet!'","Watched the ball instead of ducking"],bx:420,wait:rnd(0.4,1.2),duck:0,ok:0};
 g.update=function(dt){if(ptr.taps.length&&g.duck<=0){g.duck=0.55;blip(300,0.06)}g.duck-=dt;g.wait-=dt;if(g.wait<=0){g.bx-=dt*520*sp;if(g.bx<-40){g.bx=420+rnd(100,400);g.wait=0;g.ok++;}if(Math.abs(g.bx-120)<30&&g.duck<=0)g.fail=true}};
 g.draw=function(){ctx.fillStyle="#43a047";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.fillRect(250,H*0.25,10,H*0.5);ctx.fillRect(330,H*0.25,10,H*0.5);ctx.fillRect(250,H*0.5,90,10);var d=g.duck>0;
  if(d)ell(120,H*0.6+30,60,30,"#29b6f6");else bean(120,H*0.6-10,60,"#29b6f6");ctx.save();ctx.translate(g.bx,H*0.6-40);ctx.rotate(g.bx/30);ell(0,0,30,18,"#8d4925");ctx.restore();txt("Tap to duck",180,H-80,20,"#fff")};return g};
G.fence=function(sp){var g={word:"DON'T TOUCH!",dur:3,bg:"#263238",death:"zap",timeoutWin:true,meter:"power",cap:["Touched the electric fence to see if load-shedding was on","Climbed the fence for a 'FREE BILTONG' sign","Used the fence to dry his socks"],t:0};
 g.update=function(dt){g.t+=dt*sp;if(ptr.taps.length){g.fail=true}};
 g.draw=function(){ctx.fillStyle="#263238";ctx.fillRect(0,0,W,H);ctx.lineWidth=4;ctx.strokeStyle="#bdbdbd";for(var i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,H*0.3+i*40);ctx.lineTo(W,H*0.3+i*40);ctx.stroke()}
  if(Math.sin(g.t*20)>0.3){ctx.strokeStyle="#ffee58";ctx.beginPath();var x=rnd(20,340),y=H*0.3+Math.floor(rnd(0,6))*40;ctx.moveTo(x,y);ctx.lineTo(x+10,y-12);ctx.lineTo(x+18,y+4);ctx.stroke()}
  var bob=Math.sin(g.t*5)*8;rr(110,H*0.42+bob,140,70,10,"#ffeb3b");txt("FREE",180,H*0.42+20+bob,22,"#e53935");txt("BILTONG",180,H*0.42+48+bob,20,"#e53935");txt("Hands off. Really.",180,H-80,20,"#fff")};return g};
var LIST=Object.keys(G);

function deathDraw(kind,t){
 var cx=180,cy=H*0.42;ctx.fillStyle="#fff59d";ctx.fillRect(0,0,W,H);
 for(var i=0;i<14;i++){ctx.fillStyle=i%2?"#ffe082":"#fff59d";ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,900,i*0.449+t*0.3,(i+1)*0.449+t*0.3);ctx.fill()}
 if(kind==="hole"){ell(cx,cy+60,110,40,"#222");ctx.save();ctx.beginPath();ctx.rect(0,0,W,cy+60);ctx.clip();bean(cx,cy+60-Math.max(0,50-t*40),60,"#ff8a65","x");ctx.restore();txt("?",cx+80,cy-50,40,"#fff")}
 else if(kind==="zap"){ctx.lineWidth=4;ctx.strokeStyle="#111";for(var j=0;j<9;j++){ctx.beginPath();var a=-2.6+j*0.3;ctx.moveTo(cx+Math.cos(a)*50,cy-30+Math.sin(a)*50);ctx.lineTo(cx+Math.cos(a)*85,cy-30+Math.sin(a)*85);ctx.stroke()}bean(cx,cy+(Math.sin(t*40)*3),60,"#ffd54f","x");if(Math.sin(t*20)>0)txt("ZZZT!",cx,cy-120,36,"#ffee58")}
 else if(kind==="zzz"){ell(cx,cy+40,90,40,"#81c784");circ(cx-30,cy+30,6,"#111",0);txt("Z",cx+60,cy-30-((t*30)%40),30,"#fff");txt("Z",cx+90,cy-70-((t*30)%40),22,"#fff");rr(20,cy-150,200,46,12,"#fff");ctx.font="bold 14px sans-serif";ctx.fillStyle="#111";ctx.textAlign="center";ctx.fillText("...and ANOTHER thing...",120,cy-127)}
 else if(kind==="bumps"){bean(cx,cy,60,"#ba68c8","x");for(var k=0;k<9;k++)circ(cx+Math.cos(k*2.4)*36,cy+Math.sin(k*1.7)*48,6,"#e53935",2)}
 else if(kind==="tears"){bean(cx,cy,60,"#4dd0e1");var ty=(t*120)%60;ell(cx-17,cy+ty,6,10,"#29b6f6",2);ell(cx+17,cy+((ty+30)%60),6,10,"#29b6f6",2);rr(cx+60,cy+50,40,50,6,"#ffd600")}
 else if(kind==="bonk"){bean(cx,cy,60,"#29b6f6","x");circ(cx+10,cy-62,16,"#ef9a9a");for(var s=0;s<3;s++){var a2=t*4+s*2.1;txt("*",cx+Math.cos(a2)*60,cy-80+Math.sin(a2)*16,30,"#ffee58")}}
 else{bean(cx,cy,60,"#aed581","x");ctx.lineWidth=4;rr(cx-80,cy+20,30,30,4,"#fff");rr(cx+50,cy+20,30,30,4,"#fff");txt("R0.00",cx,cy-110,30,"#e53935")}
}

var run=null; // {mode, phase, pt, game, id, ...}
function frame(now){raf=requestAnimationFrame(frame);var dt=Math.min(0.05,(now-(last||now))/1000);last=now;if(!run)return;step(dt);if(run)draw();ptr.taps.length=0}
function step(dt){var r=run;r.pt+=dt;shake=Math.max(0,shake-dt);flashT=Math.max(0,flashT-dt);
 parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt});parts=parts.filter(function(p){return p.l>0});
 if(r.phase==="intro"){if(r.pt>=r.introT){r.phase="play";r.pt=0;ptr.taps.length=0}return}
 if(r.phase==="play"){var g=r.g;g.update(dt);var dur=g.dur/Math.pow(r.sp,0.5);r.left=Math.max(0,dur-r.pt);
  if(g.fail){end(false)}else if(g.done){end(true)}else if(r.pt>=dur){end(g.timeoutWin)}return}
 if(r.phase==="res"&&r.pt>=r.resT){var cb=r.cb;r.phase="wait";cb(r.win,r)}}
function end(win){var r=run;r.win=win;r.phase="res";r.pt=0;r.cap=r.g.cap[r.g.capI!=null?r.g.capI:Math.floor(Math.random()*r.g.cap.length)];
 if(win){r.resT=r.mode==="pres"?1.6:0.55;flashT=0.3;blip(880,0.08);setTimeout(function(){blip(1320,0.12)},80)}else{r.resT=r.mode==="pres"?2.4:1.9;shake=0.4;blip(200,0.3,"sawtooth");if(navigator.vibrate)try{navigator.vibrate(120)}catch(e){}}}
function draw(){var r=run;ctx.setTransform(dpr*cv.width/(W*dpr),0,0,dpr*cv.width/(W*dpr),0,0);var sc=cv.width/W;ctx.setTransform(sc,0,0,sc,0,0);
 if(shake>0)ctx.translate(rnd(-8,8)*shake*3,rnd(-8,8)*shake*3);
 if(r.phase==="intro"){ctx.fillStyle=r.g.bg;ctx.fillRect(0,0,W,H);var p=Math.min(1,r.pt/0.15);txt(r.g.word,180,H*0.42,r.g.word.length>8?44:64*(0.6+0.4*p),"#ffee58",-0.06);if(r.title)txt(r.title,180,H*0.42-80,22,"#fff");if(r.sub)wrap(r.sub,180,H*0.42+70,18,320,"#fff")}
 else if(r.phase==="play"||(r.phase==="res"&&r.win)||r.phase==="wait"&&r.win){r.g.draw();
  var dur=r.g.dur/Math.pow(r.sp,0.5),f=(r.left||0)/dur;rr(16,H-34,328,18,9,"#fff");if(f>0)rr(16,H-34,Math.max(18,328*f),18,9,f<0.3?"#e53935":"#ffb300");
  if(r.phase!=="play"){txt(r.mode==="pres"?r.winLine:"NICE!",180,H*0.4,r.mode==="pres"?30:56,"#69f0ae",-0.08)}}
 else{deathDraw(r.g.death,r.pt);wrap(r.cap,180,H*0.68,24,320,"#fff");if(r.mode==="surv")txt(r.lives>0?"-1 LIFE":"GAME OVER",180,H*0.85,30,"#e53935");else wrap(r.loseLine||"",180,H*0.84,17,320,"#ffee58")}
 parts.forEach(function(p){ctx.globalAlpha=Math.max(0,p.l*2);circ(p.x,p.y,6,p.c,2)});ctx.globalAlpha=1;
 if(flashT>0){ctx.fillStyle="rgba(255,255,255,"+flashT+")";ctx.fillRect(0,0,W,H)}
 if(r.mode==="surv"&&r.phase!=="res"||r.mode==="surv"&&r.win){var h="";for(var i=0;i<3;i++)h+=i<r.lives?"\u2665":"\u2661";txt(h,70,30,28,"#e53935");txt(String(r.score),300,30,30,"#fff")}
}
function toL(e){var b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*W/b.width}}
function resize(){var b=cv.getBoundingClientRect();if(!b.width)return;dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(b.width*dpr);cv.height=Math.round(b.height*dpr);H=W*b.height/b.width}
function init(){cv=document.getElementById("mgc");ctx=cv.getContext("2d");
 cv.addEventListener("pointerdown",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;ptr.down=true;ptr.taps.push(p)});
 cv.addEventListener("pointermove",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y});
 window.addEventListener("pointerup",function(){ptr.down=false});window.addEventListener("resize",resize)}
function start(r){document.getElementById("mg").classList.add("on");resize();ptr.x=180;parts=[];run=r;r.phase="intro";r.pt=0;if(!raf){last=0;raf=requestAnimationFrame(frame)}}
function stop(){document.getElementById("mg").classList.remove("on");run=null;cancelAnimationFrame(raf);raf=0}

var NAMES={pothole:["Pothole Dash","Steer the bakkie. Dodge potholes, cones, goats and taxis."],lights:["Keep the Lights On","Tap every flickering house before the grid trips."],uncle:["Shut Up Uncle","Tap each Cabinet Uncle to hand him a boerewors roll."],budget:["Catch the Budget","Catch the rand. Avoid the 'consultants'."],mozzie:["Swat the Mozzie","Tap the mozzie. Just once. Please."],snack:["Save the NakNaks","Catch the last packet before it hits the floor."],rugby:["Duck!","Tap to duck the stray rugby ball."],fence:["Don't Touch the Fence","Don't. Touch. Anything."]};
var WIN={pothole:"Arrived alive! Roads steadied.",lights:"Grid saved! Power steadied.",uncle:"Silence! The Uncles are munching.",budget:"Budget caught! Treasury steadied.",mozzie:"Got him! Everyone slept.",snack:"Snack saved! Morale up.",rugby:"Ducked! Nation impressed.",fence:"Didn't touch it. Growth!"};
// Presidency: single microgame with longer intro and outcome lines
function single(id,days,cb){var sp=1+Math.min(1.2,days/500),g=G[id](sp);start({mode:"pres",g:g,sp:sp,introT:2,title:NAMES[id][0],sub:NAMES[id][1],winLine:WIN[id],loseLine:"Your approval rating fell into the same hole.",cb:function(win,r){stop();cb(win,g.meter,r.cap)}})}
// Survival: endless rapid-fire, 3 lives, rising speed
function survival(onOver){var state={lives:3,score:0,bag:[]};
 function nextG(){if(!state.bag.length)state.bag=LIST.slice().sort(function(){return Math.random()-0.5});var id=state.bag.pop(),sp=Math.min(2.4,1+state.score*0.06),g=G[id](sp);
  start({mode:"surv",g:g,sp:sp,introT:Math.max(0.45,0.8/sp),lives:state.lives,score:state.score,cb:function(win,r){if(win){state.score++;nextG()}else{state.lives--;if(state.lives<=0){stop();onOver(state.score,r.cap)}else nextG()}}});
  run.lives=state.lives;run.score=state.score;
  var ow=run.cb;run.cb=function(win,r){ow(win,r)};
 }
 // update lives display at fail moment
 var oe=end;nextG();return state}
window.MG={init:init,single:single,survival:survival,list:LIST,names:NAMES,_run:function(){return run},stop:stop};
// patch end to adjust lives display immediately for survival
var _end=end;end=function(win){if(run&&run.mode==="surv"&&!win)run.lives--;_end(win)};
})();
