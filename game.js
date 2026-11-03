// EISH! Ways to Go - South African microgame chaos. Pure canvas + WebAudio, no external assets.
(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var LS={get:function(k,d){try{var v=localStorage.getItem("ewg_"+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem("ewg_"+k,JSON.stringify(v))}catch(e){}}};
var cv,ctx,W=360,H=640,raf=0,last=0,shake=0,parts=[],flashT=0,run=null;
var ptr={x:180,y:500,taps:[]};
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}

// ---------- audio: sfx + original amapiano-flavoured jingle ----------
var AC=null,master=null,muted=LS.get("mute",false),musicOn=false,nextT=0,stepN=0,timer=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:0.5;master.connect(AC.destination)}catch(e){}}if(AC&&AC.state==="suspended")AC.resume();return AC}
function tone(f,d,type,vol,t0,slide){if(!ac())return;var t=t0||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||"square";o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(vol||0.08,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.02)}
var noiseBuf=null;function hat(t,v){if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*0.05,AC.sampleRate);var d=noiseBuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}var s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type="highpass";f.frequency.value=7000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.04);s.connect(f);f.connect(g);g.connect(master);s.start(t)}
function blip(f,d,type){tone(f,d||0.08,type,0.07)}
// 2-bar loop, 16th steps at 113 bpm. A-minor pentatonic melody, log-drum bass on syncopated hits.
var MEL=[69,0,72,0,74,72,0,69,76,0,74,0,72,0,69,0, 67,0,69,0,72,0,74,76,0,74,0,72,69,0,67,0];
var LOG=[1,0,0,1,0,0,1,0,0,0,1,1,0,0,1,0, 1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0];
var BASSN=[45,45,45,43,43,43,41,41,41,41,43,43,43,43,45,45, 45,45,45,43,43,43,48,48,48,48,47,47,47,47,45,45];
function mtof(n){return 440*Math.pow(2,(n-69)/12)}
function sched(){if(!AC)return;var spb=60/113/4;while(nextT<AC.currentTime+0.12){var s=stepN%32,t=nextT;
 if(LOG[s])tone(mtof(BASSN[s]),0.28,"sine",0.22,t,mtof(BASSN[s])*0.55);
 hat(t,s%2?0.05:0.02);if(s%8===4)tone(180,0.12,"triangle",0.08,t,60);
 if(MEL[s])tone(mtof(MEL[s]),0.11,"square",0.035,t);
 if(s%16===0||s%16===10)[57,60,64].forEach(function(n){tone(mtof(n),0.35,"triangle",0.025,t)});
 nextT+=spb;stepN++}}
function music(on){if(!ac())return;if(on&&!musicOn){musicOn=true;nextT=AC.currentTime+0.05;timer=setInterval(sched,25)}else if(!on&&musicOn){musicOn=false;clearInterval(timer)}}
function setMute(m){muted=m;LS.set("mute",m);if(master)master.gain.value=m?0:0.5;$("muteBtn").textContent=m?"\uD83D\uDD07 Sound off":"\uD83D\uDD0A Sound on"}

// ---------- drawing helpers ----------
function rr(x,y,w,h,r,fill,lw){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function circ(x,y,r,fill,lw){ctx.beginPath();ctx.arc(x,y,Math.max(0.1,r),0,7);ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function ell(x,y,rx,ry,fill,lw){ctx.beginPath();ctx.ellipse(x,y,Math.max(0.1,rx),Math.max(0.1,ry),0,0,7);ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function line(a,b,c,d,w,col){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.lineWidth=w||4;ctx.strokeStyle=col||"#111";ctx.lineCap="round";ctx.stroke()}
function tri(a,b,c,d,e,f,fill){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.lineTo(e,f);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke()}
function txt(s,x,y,size,fill,rot){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font="900 "+size+"px 'Trebuchet MS',Impact,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";ctx.lineWidth=Math.max(4,size/6);ctx.strokeStyle="#111";ctx.strokeText(s,0,0);ctx.fillStyle=fill||"#fff";ctx.fillText(s,0,0);ctx.restore()}
function wrap(s,x,y,size,maxW,fill){ctx.font="900 "+size+"px 'Trebuchet MS',sans-serif";var w=s.split(" "),ln="",out=[];w.forEach(function(k){var t=ln?ln+" "+k:k;if(ctx.measureText(t).width>maxW&&ln){out.push(ln);ln=k}else ln=t});out.push(ln);out.forEach(function(l,i){txt(l,x,y+i*size*1.2,size,fill)})}
function burst(x,y,col,n){for(var i=0;i<(n||10);i++)parts.push({x:x,y:y,vx:rnd(-220,220),vy:rnd(-280,40),l:0.5,c:col})}
function sunburst(c1,c2,t){var cx=180,cy=H*0.42;ctx.fillStyle=c1;ctx.fillRect(0,0,W,H);ctx.fillStyle=c2;for(var i=0;i<14;i+=2){ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,900,i*0.449+t*0.3,(i+1)*0.449+t*0.3);ctx.fill()}}

// ---------- the cast: six bean characters ----------
var CAST={
 boet:{name:"Boet Bennie",col:"#43a047",line:"Rugby jersey, zero fear, even less planning."},
 auntie:{name:"Auntie Thandi",col:"#ec407a",line:"Doek on point. Knows everybody's business."},
 uncle:{name:"Uncle Fanie",col:"#ff9800",line:"Never without his braai tongs. Never short of a speech."},
 tannie:{name:"Tannie Sannie",col:"#ab47bc",line:"Pearls, hair bun, and a koeksister for every occasion."},
 gaatjie:{name:"Jabu the Gaatjie",col:"#fdd835",line:"Taxi gaatjie. Counts change faster than you can blink."},
 gogo:{name:"Gogo Nomsa",col:"#29b6f6",line:"Sees everything through those glasses. Salts everything too."}
};
function eyes(x,y,r,face){var ex=r*0.28,ey=y-r*0.25;
 if(face==="x"){[-1,1].forEach(function(s){var a=x+s*ex;line(a-6,ey-6,a+6,ey+6,4);line(a+6,ey-6,a-6,ey+6,4)})}
 else if(face==="spin"){[-1,1].forEach(function(s){ctx.beginPath();for(var k=0;k<14;k++){var a=k*0.9,rad=k*0.6;ctx.lineTo(x+s*ex+Math.cos(a)*rad,ey+Math.sin(a)*rad)}ctx.lineWidth=2.5;ctx.strokeStyle="#111";ctx.stroke()})}
 else if(face==="shut"){[-1,1].forEach(function(s){ctx.beginPath();ctx.arc(x+s*ex,ey,r*0.12,0,Math.PI);ctx.lineWidth=3.5;ctx.strokeStyle="#111";ctx.stroke()})}
 else{[-1,1].forEach(function(s){circ(x+s*ex,ey,r*0.17,"#fff",3);circ(x+s*ex+2,ey+1,r*0.075,"#111",0)})}}
function mouth(x,y,r,face){if(face==="x"||face==="spin"){ell(x,y+r*0.28,r*0.14,r*0.1,"#5d1010",3)}else if(face==="sad"){ctx.beginPath();ctx.arc(x,y+r*0.42,r*0.2,Math.PI+0.4,-0.4);ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke()}else if(face==="shut"){line(x-r*0.15,y+r*0.28,x+r*0.15,y+r*0.28,4)}else{ctx.beginPath();ctx.arc(x,y+r*0.12,r*0.24,0.25,Math.PI-0.25);ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke()}}
function bean(id,x,y,r,face,squash){var c=CAST[id]||CAST.boet,sq=squash||1;ctx.save();ctx.translate(x,y);ctx.scale(1/sq,sq);ctx.translate(-x,-y);
 if(id==="gogo"){ell(x,y+r*0.45,r*0.85,r*0.5,"#5e35b1")}            // shawl behind
 ell(x,y,r*0.78,r,c.col);
 if(id==="boet"){ctx.save();ctx.beginPath();ctx.ellipse(x,y,r*0.78,r,0,0,7);ctx.clip();for(var i=0;i<3;i++){ctx.fillStyle="#ffd600";ctx.fillRect(x-r,y+r*0.25+i*r*0.28,2*r,r*0.12)}ctx.restore();ctx.beginPath();ctx.ellipse(x,y,r*0.78,r,0,0,7);ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();ell(x,y-r*0.92,r*0.5,r*0.18,"#1b5e20",3)}
 if(id==="auntie"){ctx.beginPath();ctx.moveTo(x-r*0.8,y-r*0.55);ctx.quadraticCurveTo(x,y-r*1.7,x+r*0.8,y-r*0.55);ctx.quadraticCurveTo(x,y-r*0.85,x-r*0.8,y-r*0.55);ctx.fillStyle="#ffeb3b";ctx.fill();ctx.lineWidth=4;ctx.stroke();circ(x+r*0.65,y-r*1.05,r*0.2,"#ffeb3b",3)}
 if(id==="uncle"){ell(x,y+r*0.05,r*0.34,r*0.1,"#5d4037",3);line(x+r*0.75,y+r*0.2,x+r*1.25,y-r*0.3,5,"#9e9e9e");line(x+r*0.75,y+r*0.25,x+r*1.3,y-r*0.15,5,"#9e9e9e")}
 if(id==="tannie"){circ(x,y-r*1.05,r*0.3,"#795548",3);for(var p=-3;p<=3;p++)circ(x+p*r*0.17,y+r*0.62+Math.abs(p)*-2,r*0.07,"#fff",1.5)}
 if(id==="gaatjie"){ctx.beginPath();ctx.ellipse(x,y-r*0.72,r*0.6,r*0.32,0,Math.PI,0);ctx.fillStyle="#e53935";ctx.fill();ctx.lineWidth=4;ctx.stroke();line(x-r*0.4,y-r*0.72,x-r*1.0,y-r*0.6,6,"#e53935");rr(x+r*0.7,y-r*0.05,r*0.25,r*0.4,4,"#fff",3)}
 eyes(x,y,r,face);if(id==="gogo"){[-1,1].forEach(function(s){ctx.beginPath();ctx.arc(x+s*r*0.28,y-r*0.25,r*0.23,0,7);ctx.lineWidth=3;ctx.strokeStyle="#111";ctx.stroke()});line(x-r*0.05,y-r*0.25,x+r*0.05,y-r*0.25,3)}
 mouth(x,y,r,face);ctx.restore()}
function bakkie(x,y,who,tilt){ctx.save();ctx.translate(x,y);if(tilt)ctx.rotate(tilt);rr(-30,-52,60,104,12,"#fff");rr(-24,-40,48,26,6,"#4fc3f7");if(who){ctx.save();ctx.beginPath();ctx.rect(-24,-40,48,26);ctx.clip();bean(who,0,-14,18);ctx.restore()}rr(-26,2,52,42,6,"#e0e0e0");ctx.restore()}

// ---------- microgames ----------
// each: name, word, who, death, cap (verb phrase, no subject), dur, timeoutWin, update(dt), draw(t)
var G={},DEF={};
function def(id,meta,make){DEF[id]=meta;G[id]=function(sp){var g=make(sp);for(var k in meta)if(g[k]===undefined)g[k]=meta[k];return g}}

def("pothole",{name:"Pothole Dash",word:"DODGE!",who:"boet",death:"hole",cap:"Tried to fix the pothole with a spade and positive thinking",dur:4,timeoutWin:true,bg:"#555"},function(sp){
 var g={cx:180,obs:[],sp0:0.3,road:0};
 g.update=function(dt){g.road=(g.road+dt*420*sp)%80;g.cx+=(ptr.x-g.cx)*Math.min(1,dt*14);g.cx=Math.max(55,Math.min(305,g.cx));g.sp0-=dt;
  if(g.sp0<=0){g.sp0=0.55/sp;g.obs.push({x:Math.random()<0.5?g.cx+rnd(-25,25):rnd(55,305),y:-40,k:pick(["hole","hole","cone","goat"])})}
  g.obs.forEach(function(o){o.y+=dt*360*sp;if(Math.abs(o.y-(H-140))<46&&Math.abs(o.x-g.cx)<42)g.fail=true})};
 g.draw=function(){ctx.fillStyle="#7cb342";ctx.fillRect(0,0,W,H);ctx.fillStyle="#555";ctx.fillRect(30,0,300,H);ctx.fillStyle="#fff";for(var y=-80+g.road;y<H;y+=80)ctx.fillRect(176,y,8,40);
  g.obs.forEach(function(o){if(o.k==="hole")ell(o.x,o.y,36,20,"#222");else if(o.k==="cone")tri(o.x,o.y-26,o.x+18,o.y+18,o.x-18,o.y+18,"#ff6d00");else{ell(o.x,o.y,26,18,"#fafafa");circ(o.x+22,o.y-14,11,"#fafafa");line(o.x+18,o.y-24,o.x+12,o.y-34,3)}});
  bakkie(g.cx,H-140,"boet")};return g});
def("lights",{name:"Lights Back On",word:"TAP!",who:"auntie",death:"zap",cap:"Licked the plug to check if the power was back",dur:4,timeoutWin:false,bg:"#1a237e"},function(sp){
 var n=Math.min(6,3+Math.floor(sp)),g={h:[],left:n},pos=[[90,220],[270,220],[90,380],[270,380],[90,540],[270,540]];
 for(var i=0;i<n;i++)g.h.push({x:pos[i][0],y:pos[i][1]*H/640,on:false,f:Math.random()*5});
 g.update=function(dt){ptr.taps.forEach(function(p){g.h.forEach(function(h){if(!h.on&&Math.abs(p.x-h.x)<70&&Math.abs(p.y-h.y)<70){h.on=true;g.left--;burst(h.x,h.y-30,"#ffee58");blip(660+g.left*80)}})});g.h.forEach(function(h){h.f+=dt*9});if(g.left<=0)g.done=true};
 g.draw=function(){ctx.fillStyle="#1a237e";ctx.fillRect(0,0,W,H);g.h.forEach(function(h){var lit=h.on||Math.sin(h.f*3)>0.75;if(h.on)circ(h.x,h.y,70,"rgba(255,238,88,.25)",0);tri(h.x-50,h.y-10,h.x,h.y-55,h.x+50,h.y-10,"#e53935");rr(h.x-42,h.y-12,84,62,4,"#fff8e1");rr(h.x-30,h.y,24,22,3,lit?"#ffee58":"#263238");rr(h.x+6,h.y,24,22,3,lit?"#ffee58":"#263238")});bean("auntie",180,H-60,30,"sad")};return g});
def("uncle",{name:"Shut Up Uncle",word:"FEED!",who:"tannie",death:"zzz",cap:"Asked Uncle Fanie a question at the wedding",dur:4.5,timeoutWin:false,bg:"#8d6e63"},function(sp){
 var g={need:Math.min(7,3+Math.floor(sp*1.2)),got:0,u:[],sp0:0},spots=[[80,230],[180,200],[280,230],[80,420],[180,390],[280,420]];
 g.update=function(dt){g.sp0-=dt;if(g.sp0<=0){g.sp0=0.4/sp;var free=spots.filter(function(s){return!g.u.some(function(u){return u.s===s})});if(free.length)g.u.push({s:pick(free),l:1.3/sp,fed:0})}
  ptr.taps.forEach(function(p){g.u.forEach(function(u){var y=u.s[1]*H/640;if(!u.fed&&Math.abs(p.x-u.s[0])<50&&Math.abs(p.y-y)<55){u.fed=0.4;g.got++;burst(u.s[0],y,"#c0392b",8);blip(520+g.got*60)}})});
  g.u.forEach(function(u){if(u.fed)u.fed-=dt;else u.l-=dt});g.u=g.u.filter(function(u){return u.fed?u.fed>0:u.l>0});if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#8d6e63";ctx.fillRect(0,0,W,H);rr(40,H-170,280,60,10,"#424242");for(var i=0;i<6;i++){ctx.fillStyle="#ff7043";ctx.fillRect(60+i*45,H-160,30,12)}
  g.u.forEach(function(u){var y=u.s[1]*H/640;bean("uncle",u.s[0],y,32,u.fed>0?"shut":"");if(u.fed>0){rr(u.s[0]-26,y+4,52,12,6,"#c0392b");rr(u.s[0]-30,y+2,60,7,4,"#f5deb3")}else{rr(u.s[0]-62,y-76,124,26,8,"#fff");ctx.font="bold 11px sans-serif";ctx.fillStyle="#111";ctx.textAlign="center";ctx.fillText("Just a few words...",u.s[0],y-62)}});
  txt(g.got+"/"+g.need+" fed",180,H-60,26,"#ffee58")};return g});
def("change",{name:"Catch the Change",word:"CATCH!",who:"gaatjie",death:"broke",cap:"Lent R50 to the cousin 'until Friday'",dur:4.5,timeoutWin:false,bg:"#2e7d32"},function(sp){
 var g={need:Math.min(8,4+Math.floor(sp)),got:0,it:[],sp0:0,cx:180};
 g.update=function(dt){g.cx+=(ptr.x-g.cx)*Math.min(1,dt*16);g.sp0-=dt;if(g.sp0<=0){g.sp0=0.32/sp;g.it.push({x:rnd(40,320),y:-30,c:Math.random()<0.3})}
  g.it.forEach(function(o){o.y+=dt*300*sp;if(!o.g&&Math.abs(o.y-(H-110))<36&&Math.abs(o.x-g.cx)<50){o.g=1;if(o.c)g.fail=true;else{g.got++;burst(o.x,o.y,"#69f0ae",6);blip(700+g.got*40)}}});g.it=g.it.filter(function(o){return!o.g&&o.y<H+40});if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#2e7d32";ctx.fillRect(0,0,W,H);g.it.forEach(function(o){if(o.c){rr(o.x-20,o.y-14,40,40,12,"#ffcc80");txt("Borrow?",o.x,o.y-26,12,"#fff");line(o.x-16,o.y+20,o.x-30,o.y+36,5);line(o.x+16,o.y+20,o.x+30,o.y+36,5)}else{circ(o.x,o.y,16,"#ffd54f");txt("R5",o.x,o.y,12,"#795548")}});
  bean("gaatjie",g.cx,H-110,34);txt(g.got+"/"+g.need,180,60,28,"#ffee58")};return g});
def("mozzie",{name:"Swat the Mozzie",word:"SWAT!",who:"gogo",death:"bumps",cap:"Slept with the window open in December",dur:3.5,timeoutWin:false,bg:"#311b92"},function(sp){
 var g={t:rnd(0,6),x:180,y:300};
 g.update=function(dt){g.t+=dt*2.2*sp;g.x=180+Math.sin(g.t*1.3)*130;g.y=H*0.42+Math.sin(g.t*2.1)*H*0.24;ptr.taps.forEach(function(p){if(Math.hypot(p.x-g.x,p.y-g.y)<50){g.done=true;burst(g.x,g.y,"#fff",12);blip(900)}else{shake=0.1;blip(150,0.05)}})};
 g.draw=function(){ctx.fillStyle="#311b92";ctx.fillRect(0,0,W,H);rr(50,H-190,260,120,20,"#90caf9");bean("gogo",180,H-200,40,"shut");txt("z",230,H-260,24,"#fff");ell(g.x-10,g.y-12,12,7,"rgba(255,255,255,.7)",2);ell(g.x+10,g.y-12,12,7,"rgba(255,255,255,.7)",2);ell(g.x,g.y,10,6,"#212121",2);line(g.x-10,g.y,g.x-24,g.y+6,2)};return g});
def("snack",{name:"Save the NakNaks",word:"CATCH!",who:"boet",death:"tears",cap:"Dropped the last NakNak at the braai",dur:3.5,timeoutWin:false,bg:"#ff7043"},function(sp){
 var g={x:rnd(60,300),y:-40,t:0,cx:180,wait:rnd(0.2,0.6)};
 g.update=function(dt){g.cx+=(ptr.x-g.cx)*Math.min(1,dt*16);g.wait-=dt;if(g.wait>0)return;g.t+=dt;g.y+=dt*(260+g.t*200)*sp;g.x=Math.max(30,Math.min(330,g.x+Math.sin(g.t*6)*dt*160*sp));
  if(Math.abs(g.y-(H-150))<30&&Math.abs(g.x-g.cx)<55){g.done=true;burst(g.x,g.y,"#ffee58",12);blip(800)}else if(g.y>H-90)g.fail=true};
 g.draw=function(){ctx.fillStyle="#ff7043";ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.sin(g.t*8)*0.4);rr(-26,-34,52,68,8,"#ffd600");txt("NAK",0,-8,15,"#e53935");txt("NAKS",0,12,13,"#e53935");ctx.restore();bean("boet",g.cx,H-110,38)};return g});
def("rugby",{name:"Stray Rugby Ball",word:"DUCK!",who:"gaatjie",death:"bonk",cap:"Stood behind the posts at the school rugby",dur:3.5,timeoutWin:true,bg:"#43a047"},function(sp){
 var g={bx:420,wait:rnd(0.3,1.0),duck:0};
 g.update=function(dt){if(ptr.taps.length&&g.duck<=0){g.duck=0.55;blip(300)}g.duck-=dt;g.wait-=dt;if(g.wait<=0){g.bx-=dt*520*sp;if(g.bx<-40)g.bx=420+rnd(100,400);if(Math.abs(g.bx-120)<30&&g.duck<=0)g.fail=true}};
 g.draw=function(){ctx.fillStyle="#43a047";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.fillRect(250,H*0.25,10,H*0.5);ctx.fillRect(330,H*0.25,10,H*0.5);ctx.fillRect(250,H*0.5,90,10);
  if(g.duck>0)bean("gaatjie",120,H*0.6+25,55,"shut",0.55);else bean("gaatjie",120,H*0.6-10,55);ctx.save();ctx.translate(g.bx,H*0.6-40);ctx.rotate(g.bx/30);ell(0,0,30,18,"#8d4925");line(-10,0,10,0,3,"#fff");ctx.restore();txt("Tap to duck",180,H-80,20,"#fff")};return g});
def("fence",{name:"Electric Fence",word:"DON'T TOUCH!",who:"uncle",death:"frizz",cap:"Touched the electric fence to see if it was on",dur:3,timeoutWin:true,bg:"#263238"},function(sp){
 var g={t:0};g.update=function(dt){g.t+=dt*sp;if(ptr.taps.length)g.fail=true};
 g.draw=function(){ctx.fillStyle="#263238";ctx.fillRect(0,0,W,H);for(var i=0;i<6;i++)line(0,H*0.3+i*40,W,H*0.3+i*40,4,"#bdbdbd");if(Math.sin(g.t*20)>0.3){var x=rnd(20,340),y=H*0.3+Math.floor(rnd(0,6))*40;line(x,y,x+10,y-12,4,"#ffee58");line(x+10,y-12,x+18,y+4,4,"#ffee58")}
  var b=Math.sin(g.t*5)*8;rr(110,H*0.42+b,140,70,10,"#ffeb3b");txt("FREE",180,H*0.42+20+b,22,"#e53935");txt("BILTONG",180,H*0.42+48+b,20,"#e53935");bean("uncle",90,H-120,40);txt("Hands off. Really.",180,H-50,20,"#fff")};return g});
def("lolly",{name:"Frozen Stoep Lolly",word:"RESIST!",who:"boet",death:"stuck",cap:"Licked the frozen Ice-Pop off the stoep",dur:4,timeoutWin:true,bg:"#b3e5fc"},function(sp){
 var g={L:0};g.update=function(dt){g.L+=dt*95*sp;if(ptr.taps.length){g.L=Math.max(0,g.L-40*ptr.taps.length);blip(400,0.04)}if(g.L>=150)g.fail=true};
 g.draw=function(){ctx.fillStyle="#b3e5fc";ctx.fillRect(0,0,W,H);rr(0,H*0.62,W,H*0.38,0,"#bcaaa4",0);line(0,H*0.62,W,H*0.62,4);var bx=110,by=H*0.62-60;bean("boet",bx,by,50);
  rr(bx+18,by+8,g.L+6,14,7,"#f48fb1");rr(bx+175,by-30,34,60,10,"#e1f5fe");rr(bx+186,by+28,10,30,3,"#d7ccc8");txt("TAP TAP TAP!",180,H*0.25,24,"#fff");txt("Pull the tongue back",180,H*0.25+34,16,"#fff")};return g});
def("wors",{name:"Rescue the Wors",word:"GRAB!",who:"uncle",death:"dog",cap:"Turned his back on the wors 'for one second'",dur:3.5,timeoutWin:false,bg:"#ffcc80"},function(sp){
 var g={dx:400,wx:180,wy:H*0.5,mv:0};
 g.update=function(dt){g.dx-=dt*90*sp;g.mv-=dt;if(g.mv<=0){g.mv=0.45/sp;g.wx=rnd(70,260);g.wy=H*rnd(0.3,0.6)}ptr.taps.forEach(function(p){if(Math.hypot(p.x-g.wx,p.y-g.wy)<55){g.done=true;burst(g.wx,g.wy,"#c62828",12);blip(820)}});if(g.dx<g.wx+40)g.fail=true};
 g.draw=function(){ctx.fillStyle="#ffcc80";ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(g.wx,g.wy);ctx.beginPath();ctx.arc(0,0,28,0.3,5.5);ctx.lineWidth=16;ctx.strokeStyle="#111";ctx.stroke();ctx.lineWidth=10;ctx.strokeStyle="#c62828";ctx.stroke();ctx.restore();
  var x=Math.min(400,g.dx);ell(x+40,H*0.5+40,46,26,"#a1887f");circ(x,H*0.5+10,24,"#a1887f");ell(x-8,H*0.5-12,8,16,"#6d4c41",3);circ(x-10,H*0.5+8,4,"#111",0);ell(x-20,H*0.5+20,8,5,"#f48fb1",2);bean("uncle",70,H-90,36,"sad")};return g});
def("mud",{name:"Bakkie in the Mud",word:"MASH!",who:"tannie",death:"mud",cap:"Took the 'shortcut' through the farm road after rain",dur:4,timeoutWin:false,bg:"#6d4c41"},function(sp){
 var g={need:Math.round(8+sp*3),got:0,w:0};g.update=function(dt){g.w+=dt;ptr.taps.forEach(function(){g.got++;shake=0.06;burst(180+rnd(-40,40),H*0.6,"#4e342e",4);blip(200+g.got*20,0.05)});if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#90caf9";ctx.fillRect(0,0,W,H*0.5);ctx.fillStyle="#6d4c41";ctx.fillRect(0,H*0.5,W,H);var p=g.got/g.need;bakkie(180,H*0.62-p*120,"tannie",Math.sin(g.w*30)*0.05);ell(180,H*0.68,150,30,"#4e342e",0);rr(40,80,280,26,13,"#fff");rr(40,80,Math.max(26,280*p),26,13,"#ffb300");txt("MASH THE SCREEN!",180,140,24,"#fff")};return g});
def("unplug",{name:"Surge Incoming",word:"UNPLUG!",who:"auntie",death:"soot",cap:"Left the kettle plugged in when the power came back",dur:3.5,timeoutWin:false,bg:"#fff3e0"},function(sp){
 var n=Math.min(5,3+Math.floor(sp-0.5)),g={p:[]},it=["TV","KETTLE","FRIDGE","PC","TOASTER"];for(var i=0;i<n;i++)g.p.push({x:70+(i%3)*110,y:H*(0.3+Math.floor(i/3)*0.25),n:it[i],off:false});
 g.update=function(dt){ptr.taps.forEach(function(q){g.p.forEach(function(p){if(!p.off&&Math.abs(q.x-p.x)<55&&Math.abs(q.y-p.y)<60){p.off=true;burst(p.x,p.y,"#ffb300",6);blip(500)}})});if(g.p.every(function(p){return p.off}))g.done=true};
 g.draw=function(){ctx.fillStyle="#fff3e0";ctx.fillRect(0,0,W,H);txt("SURGE COMING!",180,80,28,"#e53935");g.p.forEach(function(p){rr(p.x-40,p.y-40,80,60,8,"#cfd8dc");txt(p.n,p.x,p.y-10,13,"#fff");line(p.x,p.y+20,p.x,p.y+60,5);if(p.off)rr(p.x-10,p.y+70,20,14,3,"#616161");else{rr(p.x-10,p.y+56,20,14,3,"#616161");if(Math.random()<0.3)line(p.x+12,p.y+60,p.x+24,p.y+50,3,"#ffd600")}});bean("auntie",180,H-70,32,"sad")};return g});
def("quantum",{name:"Taxi Rank Crossing",word:"CROSS!",who:"gogo",death:"flat",cap:"Stood in the taxi lane arguing about the fare",dur:4.5,timeoutWin:false,bg:"#616161"},function(sp){
 var g={lane:0,cars:[],hop:0};for(var i=1;i<=3;i++)g.cars.push({l:i,x:rnd(0,360),v:(i%2?1:-1)*rnd(140,200)*sp});
 function ly(l){return H-110-l*((H-220)/4)}
 g.update=function(dt){g.hop=Math.max(0,g.hop-dt);if(ptr.taps.length&&g.hop<=0){g.lane++;g.hop=0.12;blip(500+g.lane*100)}g.cars.forEach(function(c){c.x+=c.v*dt;if(c.x>440)c.x=-80;if(c.x<-80)c.x=440;if(c.l===g.lane&&Math.abs(c.x-180)<62)g.fail=true});if(g.lane>=4)g.done=true};
 g.draw=function(){ctx.fillStyle="#616161";ctx.fillRect(0,0,W,H);rr(0,ly(4)-40,W,80,0,"#9ccc65",0);rr(0,ly(0)-40,W,80,0,"#9ccc65",0);for(var l=1;l<4;l++){ctx.fillStyle="#fff";for(var x=0;x<W;x+=50)ctx.fillRect(x,ly(l)+40,25,4)}
  g.cars.forEach(function(c){var y=ly(c.l);rr(c.x-55,y-26,110,52,10,"#fafafa");rr(c.x-40,y-18,80,18,4,"#4fc3f7");rr(c.x-55,y+8,110,8,0,"#e53935",0);txt("Q",c.x,y+12,12,"#111")});bean("gogo",180,ly(g.lane),26);txt("Tap to hop a lane",180,40,18,"#fff")};return g});
def("salt",{name:"Over-Salted Pap",word:"STOP!",who:"tannie",death:"salty",cap:"Let Gogo season the pap 'just a little'",dur:4,timeoutWin:false,bg:"#fff9c4"},function(sp){
 var g={need:Math.min(6,3+Math.floor(sp)),got:0,s:null,sp0:0.2};
 g.update=function(dt){g.sp0-=dt;if(!g.s&&g.sp0<=0)g.s={x:rnd(80,280),y:H*rnd(0.25,0.45),l:0.9/sp};if(g.s){g.s.l-=dt;ptr.taps.forEach(function(p){if(g.s&&Math.hypot(p.x-g.s.x,p.y-g.s.y)<55){burst(g.s.x,g.s.y,"#fff",8);blip(700+g.got*60);g.got++;g.s=null;g.sp0=0.2/sp}});if(g.s&&g.s.l<=0)g.fail=true}if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#fff9c4";ctx.fillRect(0,0,W,H);ell(180,H*0.72,120,40,"#9e9e9e");ell(180,H*0.68,100,22,"#fffde7");bean("gogo",320,H*0.55,30);if(g.s){rr(g.s.x-16,g.s.y-26,32,52,8,"#eceff1");circ(g.s.x,g.s.y-22,10,"#90a4ae",3);for(var i=0;i<3;i++)circ(g.s.x+rnd(-6,6),g.s.y+40+i*20*(1-g.s.l),3,"#fff",1)}txt(g.got+"/"+g.need+" stopped",180,60,24,"#ff7043");bean("tannie",60,H-80,30,"sad")};return g});
def("umbrella",{name:"Highveld Storm",word:"MOVE!",who:"gaatjie",death:"soaked",cap:"Held a metal umbrella in a Highveld storm",dur:4,timeoutWin:true,bg:"#37474f"},function(sp){
 var g={cx:180,st:[],sp0:0.3};
 g.update=function(dt){g.cx+=(ptr.x-g.cx)*Math.min(1,dt*14);g.sp0-=dt;if(g.sp0<=0){g.sp0=0.7/sp;g.st.push({x:Math.random()<0.6?g.cx:rnd(40,320),w:0.55/sp,h:0})}
  g.st.forEach(function(s){if(s.w>0){s.w-=dt;if(s.w<=0){s.h=0.2;shake=0.15;flashT=0.2;blip(90,0.2,"sawtooth");if(Math.abs(s.x-g.cx)<45)g.fail=true}}else s.h-=dt});g.st=g.st.filter(function(s){return s.w>0||s.h>0})};
 g.draw=function(){ctx.fillStyle="#37474f";ctx.fillRect(0,0,W,H);ell(90,60,80,30,"#78909c",0);ell(260,50,100,34,"#78909c",0);g.st.forEach(function(s){if(s.w>0){ctx.fillStyle="rgba(255,235,59,.25)";ctx.fillRect(s.x-40,0,80,H)}else{ctx.beginPath();ctx.moveTo(s.x,0);for(var y=0;y<H-100;y+=40)ctx.lineTo(s.x+(y/40%2?18:-18),y);ctx.lineWidth=8;ctx.strokeStyle="#ffee58";ctx.stroke()}});
  ctx.beginPath();ctx.arc(g.cx,H-165,50,Math.PI,0);ctx.fillStyle="#e53935";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();line(g.cx,H-165,g.cx,H-120,4);bean("gaatjie",g.cx,H-95,32)};return g});
def("carseat",{name:"December Car Seat",word:"WAIT... SIT!",who:"boet",death:"hotseat",cap:"Sat on the black leather car seat in December",dur:4.5,timeoutWin:false,bg:"#ffe082"},function(sp){
 var g={heat:1,cool:rnd(1.2,2.4)/Math.sqrt(sp),t:0};
 g.update=function(dt){g.t+=dt;var c=g.t>g.cool&&g.t<g.cool+0.8/Math.sqrt(sp);g.heat=c?0:1;if(g.t>=g.cool+0.8/Math.sqrt(sp)){g.cool=g.t+rnd(0.8,1.4)/sp}
  if(ptr.taps.length){if(c){g.done=true;blip(900);burst(180,H*0.5,"#4fc3f7",10)}else g.fail=true}};
 g.draw=function(){ctx.fillStyle="#ffe082";ctx.fillRect(0,0,W,H);rr(90,H*0.35,180,200,30,g.heat?"#d32f2f":"#4fc3f7");rr(70,H*0.35+170,220,70,20,g.heat?"#b71c1c":"#29b6f6");if(g.heat){for(var i=0;i<3;i++){var x=130+i*50,o=(g.t*60+i*20)%60;line(x,H*0.32-o,x+8,H*0.28-o,4,"#fff")}}
  txt(g.heat?"TOO HOT!":"NOW!",180,H*0.2,40,g.heat?"#ff5252":"#69f0ae");bean("boet",60,H-80,30,g.heat?"sad":"")};return g});
def("sauce",{name:"Last Drop of Sauce",word:"SHAKE!",who:"uncle",death:"saucy",cap:"Shook the tomato sauce with the lid open",dur:4,timeoutWin:false,bg:"#fff"},function(sp){
 var g={need:Math.round(7+sp*3),got:0,w:0};g.update=function(dt){g.w=Math.max(0,g.w-dt*4);ptr.taps.forEach(function(){g.got++;g.w=1;shake=0.05;blip(300+g.got*25,0.04)});if(g.got>=g.need){g.done=true;burst(180,H*0.62,"#e53935",14)}};
 g.draw=function(){ctx.fillStyle="#fff";ctx.fillRect(0,0,W,H);ell(180,H*0.7,120,30,"#e0e0e0");var p=g.got/g.need;ell(180,H*0.7,60*p,14*p,"#e53935",0);ctx.save();ctx.translate(180,H*0.38);ctx.rotate(Math.PI+Math.sin(g.got*2)*0.3*g.w);rr(-30,-70,60,120,18,"#e53935");rr(-14,-95,28,30,6,"#fff");ctx.restore();bean("uncle",70,H-80,30);txt("SHAKE IT!",180,80,30,"#e53935")};return g});
def("koeksister",{name:"Flying Koeksister",word:"CATCH!",who:"tannie",death:"sticky",cap:"Tried to catch a hot koeksister with bare hands",dur:3.5,timeoutWin:false,bg:"#ffab91"},function(sp){
 var g={x:50,y:H*0.6,vx:rnd(90,200)*sp,vy:-rnd(520,640)*Math.sqrt(sp),cx:180,r:0,wait:0.3};
 g.update=function(dt){g.cx+=(ptr.x-g.cx)*Math.min(1,dt*16);g.wait-=dt;if(g.wait>0)return;g.r+=dt*10;g.x+=g.vx*dt;g.y+=g.vy*dt;g.vy+=700*sp*dt;if(g.x>330){g.x=330;g.vx*=-1}
  if(g.vy>0&&Math.abs(g.y-(H-140))<28&&Math.abs(g.x-g.cx)<60){g.done=true;burst(g.x,g.y,"#ffd54f",12);blip(880)}else if(g.y>H-80)g.fail=true};
 g.draw=function(){ctx.fillStyle="#ffab91";ctx.fillRect(0,0,W,H);rr(10,H*0.62,80,30,10,"#424242");ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.r);ell(-8,0,10,24,"#d4a017");ell(8,0,10,24,"#d4a017");ctx.restore();ell(g.cx,H-130,60,12,"#fff");bean("tannie",g.cx,H-80,34)};return g});
var LIST=Object.keys(G);

// ---------- death cartoons (one per microgame, unlockable) ----------
function deathDraw(id,t){var d=DEF[id],who=d.who,cx=180,cy=H*0.42,k=d.death;
 sunburst("#fff59d","#ffe082",t);
 if(k==="hole"){ell(cx,cy+60,110,40,"#222");ctx.save();ctx.beginPath();ctx.rect(0,0,W,cy+60);ctx.clip();bean(who,cx,cy+60-Math.max(10,60-t*30),60,"x");ctx.restore();line(cx+80,cy+40,cx+110,cy-30,6,"#8d6e63");txt("?",cx-90,cy-50,40,"#fff")}
 else if(k==="zap"||k==="frizz"){for(var j=0;j<11;j++){var a=-2.8+j*0.28;line(cx+Math.cos(a)*55,cy-30+Math.sin(a)*60,cx+Math.cos(a)*92,cy-30+Math.sin(a)*95,4)}bean(who,cx+Math.sin(t*40)*3,cy,60,"spin");if(Math.sin(t*20)>0)txt("ZZZT!",cx,cy-130,36,"#ffee58");if(k==="zap"){rr(cx+70,cy+20,30,20,4,"#fff");line(cx+80,cy+40,cx+80,cy+60,4)}}
 else if(k==="zzz"){bean(who,cx-30,cy+40,50,"shut",0.55);txt("Z",cx+40,cy-20-((t*30)%40),30,"#fff");txt("Z",cx+70,cy-60-((t*30)%40),22,"#fff");bean("uncle",cx+80,cy-130,36);rr(20,cy-190,190,40,12,"#fff");ctx.font="bold 13px sans-serif";ctx.fillStyle="#111";ctx.textAlign="center";ctx.fillText("...and ANOTHER thing...",115,cy-170)}
 else if(k==="broke"){bean(who,cx,cy,60,"sad");rr(cx-85,cy+20,26,26,4,"#fff");rr(cx+59,cy+20,26,26,4,"#fff");txt("R0.00",cx,cy-110,30,"#e53935");ell(cx+90,cy-60+Math.sin(t*6)*10,10,6,"#bdbdbd",2)}
 else if(k==="bumps"){bean(who,cx,cy,60,"x");for(var b=0;b<9;b++)circ(cx+Math.cos(b*2.4)*38,cy+Math.sin(b*1.7)*48,7,"#e53935",2);ell(cx+90+Math.sin(t*9)*20,cy-90,8,5,"#212121",2)}
 else if(k==="tears"){bean(who,cx,cy,60,"sad");var ty=(t*120)%60;ell(cx-17,cy+ty,6,10,"#29b6f6",2);ell(cx+17,cy+(ty+30)%60,6,10,"#29b6f6",2);rr(cx+60,cy+50,40,50,6,"#ffd600");ell(cx-80,cy+70,14,8,"#ffd600")}
 else if(k==="bonk"){bean(who,cx,cy,60,"spin");circ(cx+10,cy-62,16,"#ef9a9a");for(var s=0;s<3;s++){var a2=t*4+s*2.1;txt("*",cx+Math.cos(a2)*60,cy-80+Math.sin(a2)*16,30,"#ffee58")}ell(cx+100,cy+60,30,18,"#8d4925")}
 else if(k==="stuck"){bean(who,cx-40,cy,55,"x");rr(cx-20,cy+8,70,14,7,"#f48fb1");rr(cx+50,cy-25,34,60,10,"#e1f5fe");txt("STUCK!",cx,cy-110,32,"#4fc3f7")}
 else if(k==="dog"){bean(who,cx-60,cy,55,"sad");var dx=cx+60+Math.sin(t*12)*6;ell(dx+30,cy+30,40,24,"#a1887f");circ(dx,cy,22,"#a1887f");ctx.beginPath();ctx.arc(dx-20,cy+5,18,0.3,2.8);ctx.lineWidth=10;ctx.strokeStyle="#c62828";ctx.stroke();txt("WOOF!",dx,cy-70,26,"#fff")}
 else if(k==="mud"){ctx.fillStyle="#6d4c41";ctx.fillRect(0,cy+20,W,H);bean(who,cx,cy+20,60,"x");ctx.fillStyle="#6d4c41";ctx.fillRect(0,cy+30,W,H);for(var m=0;m<6;m++)circ(cx-60+m*24,cy+28,12,"#6d4c41",0);txt("BLUB",cx+90,cy-40-((t*30)%30),24,"#fff")}
 else if(k==="soot"){bean(who,cx,cy,60,"x");ctx.globalAlpha=0.75;ell(cx,cy,48,62,"#212121",0);ctx.globalAlpha=1;eyes(cx,cy,60,"");for(var c2=0;c2<4;c2++)circ(cx-40+c2*25,cy-90-((t*40+c2*15)%50),14,"#9e9e9e",0);txt("POOF!",cx,cy-140,32,"#fff")}
 else if(k==="flat"){ell(cx,cy+60,90,18,CAST[who].col);eyes(cx,cy+68,30,"x");rr(cx+40+t*120,cy-10,110,50,10,"#fafafa");txt("Q",cx+95+t*120,cy+20,14,"#111");txt("FLAT!",cx,cy-80,36,"#fff")}
 else if(k==="salty"){bean(who,cx,cy,60,"x",1.1);for(var q=0;q<12;q++)circ(cx+rnd(-80,80),cy-120+((t*150+q*30)%200),3,"#fff",1);txt("SALTY!",cx,cy-120,32,"#90a4ae")}
 else if(k==="soaked"){bean(who,cx,cy,60,"spin");ctx.beginPath();ctx.arc(cx+70,cy-70,40,0,Math.PI);ctx.fillStyle="#e53935";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();for(var r2=0;r2<10;r2++)line(cx-100+r2*22,cy-150+((t*300+r2*40)%200),cx-104+r2*22,cy-140+((t*300+r2*40)%200),3,"#29b6f6")}
 else if(k==="hotseat"){var jy=-Math.abs(Math.sin(t*6))*60;bean(who,cx,cy+jy,60,"x");for(var h2=0;h2<3;h2++)line(cx-30+h2*30,cy+70+jy,cx-26+h2*30,cy+90+jy,4,"#ff5252");txt("EINA!",cx,cy-130,40,"#ff5252")}
 else if(k==="saucy"){bean(who,cx,cy,60,"shut");for(var z=0;z<8;z++)circ(cx+Math.cos(z)*40,cy-20+Math.sin(z*2)*40,10,"#e53935",0);ell(cx,cy-60,40,20,"#e53935",0);txt("SPLAT!",cx,cy-130,36,"#e53935")}
 else{bean(who,cx,cy,60,"x");for(var y2=0;y2<5;y2++)line(cx-40+y2*20,cy-10,cx-40+y2*20,cy+30+((t*60+y2*10)%30),5,"#ffb300");ctx.save();ctx.translate(cx,cy-90);ctx.rotate(t*3);ell(-8,0,10,24,"#d4a017");ell(8,0,10,24,"#d4a017");ctx.restore();txt("SIES!",cx,cy-140,32,"#ffb300")}
}

// ---------- survival runner ----------
var S=null,bag=[];
function frame(now){raf=requestAnimationFrame(frame);var dt=Math.min(0.05,(now-(last||now))/1000);last=now;if(!run)return;step(dt);if(run)draw();ptr.taps.length=0}
function step(dt){var r=run;r.pt+=dt;shake=Math.max(0,shake-dt);flashT=Math.max(0,flashT-dt);parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt});parts=parts.filter(function(p){return p.l>0});
 if(r.phase==="intro"){if(r.pt>=r.introT){r.phase="play";r.pt=0;ptr.taps.length=0}return}
 if(r.phase==="play"){r.g.update(dt);var dur=r.g.dur/Math.pow(r.sp,0.5);r.left=Math.max(0,dur-r.pt);if(r.g.fail)end(false);else if(r.g.done)end(true);else if(r.pt>=dur)end(r.g.timeoutWin);return}
 if(r.phase==="res"&&r.pt>=r.resT){r.phase="wait";r.cb(r.win)}}
function end(win){var r=run;r.win=win;r.phase="res";r.pt=0;
 if(win){r.resT=0.55;flashT=0.3;blip(880);setTimeout(function(){blip(1320,0.12)},80)}
 else{r.resT=2;shake=0.4;tone(400,0.5,"sawtooth",0.08,0,80);try{navigator.vibrate&&navigator.vibrate(120)}catch(e){}
  if(S){S.lives--;var col=LS.get("dead",{});if(!col[r.id]){col[r.id]=1;LS.set("dead",col);r.newDeath=true}}}}
function draw(){var r=run,sc=cv.width/W;ctx.setTransform(sc,0,0,sc,0,0);if(shake>0)ctx.translate(rnd(-1,1)*shake*24,rnd(-1,1)*shake*24);
 if(r.phase==="intro"){ctx.fillStyle=r.g.bg;ctx.fillRect(0,0,W,H);var p=Math.min(1,r.pt/0.15);if(r.boss){sunburst("#d50000","#ff1744",r.pt*4);txt("BOSS SPEED!",180,H*0.22,36,"#ffee58",0.05)}
  txt(r.g.word,180,H*0.42,(r.g.word.length>8?40:64)*(0.6+0.4*p),"#ffee58",-0.06);txt(r.g.name,180,H*0.42+64,20,"#fff");bean(r.g.who,180,H*0.42+150,34)}
 else if(r.phase==="play"||r.win){r.g.draw();var dur=r.g.dur/Math.pow(r.sp,0.5),f=(r.left||0)/dur;rr(16,H-34,328,18,9,"#fff");if(f>0)rr(16,H-34,Math.max(18,328*f),18,9,f<0.3?"#e53935":"#ffb300");if(r.phase!=="play")txt(pick(["LEKKER!","SHARP!","YOH, NICE!"]).replace(/.*/,r.winWord),180,H*0.4,52,"#69f0ae",-0.08)}
 else{deathDraw(r.id,r.pt);wrap(CAST[r.g.who].name+" "+r.g.cap.charAt(0).toLowerCase()+r.g.cap.slice(1)+".",180,H*0.66,22,320,"#fff");txt(S&&S.lives>0?"-1 LIFE":"GAME OVER",180,H*0.86,30,"#e53935");if(r.newDeath)txt("NEW DEATH UNLOCKED!",180,H*0.92,18,"#ffee58")}
 parts.forEach(function(p){ctx.globalAlpha=Math.max(0,p.l*2);circ(p.x,p.y,6,p.c,2)});ctx.globalAlpha=1;if(flashT>0){ctx.fillStyle="rgba(255,255,255,"+flashT+")";ctx.fillRect(0,0,W,H)}
 if(S){var h="";for(var i=0;i<3;i++)h+=i<S.lives?"\u2665":"\u2661";txt(h,70,30,28,"#e53935");txt(String(S.score),300,30,32,"#fff")}}
function toL(e){var b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*W/b.width}}
function resize(){var b=cv.getBoundingClientRect();if(!b.width)return;var dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(b.width*dpr);cv.height=Math.round(b.height*dpr);H=W*b.height/b.width}
function play(id,sp,boss,cb){parts=[];run={id:id,g:G[id](sp),sp:sp,boss:boss,phase:"intro",pt:0,introT:boss?1.1:Math.max(0.5,0.85/Math.sqrt(sp)),cb:cb,winWord:pick(["LEKKER!","SHARP!","YOH, NICE!","HOWZIT!"])};if(!raf){last=0;raf=requestAnimationFrame(frame)}}
function startSurvival(only){show("play");resize();S={lives:3,score:0};bag=[];ac();music(!muted);
 (function next(){var id=only||(bag.length?bag.pop():(bag=LIST.slice().sort(function(){return Math.random()-0.5}),bag.pop()));var boss=!only&&S.score>0&&(S.score+1)%10===0;var sp=Math.min(2.6,1+S.score*0.05)+(boss?0.5:0);
  play(id,sp,boss,function(win){if(win)S.score++;if(S.lives<=0||(only&&!win&&false)){over(run.g)}else next()})})()}
function over(g){var sc=S.score,best=LS.get("best",0);cancelAnimationFrame(raf);raf=0;run=null;music(false);
 $("sScore").textContent=sc;$("sUnit").textContent=sc===1?"chaos":"chaoses";$("sCap").textContent=CAST[g.who].name+" "+g.cap.charAt(0).toLowerCase()+g.cap.slice(1)+".";
 $("sBest").textContent=sc>best?"New best!":"Best: "+best;if(sc>best)LS.set("best",sc);lastShare="I survived "+sc+" Mzansi "+(sc===1?"chaos":"chaoses")+" before I "+g.cap.charAt(0).toLowerCase()+g.cap.slice(1)+". Eish!";$("toast").textContent="";S=null;refresh();show("over")}
var lastShare="";
function share(){var url=location.href.split("?")[0].split("#")[0],t=lastShare+" Can you beat me?";
 if(navigator.share)navigator.share({title:"EISH! Ways to Go",text:t,url:url}).catch(function(){});
 else{var full=t+" "+url;(navigator.clipboard?navigator.clipboard.writeText(full):Promise.reject()).then(function(){$("toast").textContent="Copied! Paste it in the family group."},function(){$("toast").textContent=full})}}

// ---------- screens ----------
function show(id){Array.prototype.forEach.call(document.querySelectorAll(".screen"),function(s){s.classList.toggle("active",s.id===id)})}
function withCtx(c,w,h,fn){var oc=ctx,oh=H;ctx=c.getContext("2d");H=h;ctx.setTransform(c.width/W,0,0,c.width/W,0,0);fn();ctx=oc;H=oh}
function refresh(){var col=LS.get("dead",{});$("collCount").textContent=Object.keys(col).length;$("collTotal").textContent=LIST.length;$("bestTitle").textContent=LS.get("best",0)}
function castRow(){var c=$("castc");c.width=720;c.height=200;withCtx(c,360,100,function(){ctx.clearRect(0,0,W,100);Object.keys(CAST).forEach(function(k,i){bean(k,34+i*58,56,24,i%2?"":"shut")})})}
function showColl(){var col=LS.get("dead",{}),box=$("collList");box.innerHTML="";LIST.forEach(function(id){var d=DEF[id],div=document.createElement("div");div.className="ce"+(col[id]?"":" locked");var c=document.createElement("canvas");c.width=240;c.height=200;div.appendChild(c);
 var p=document.createElement("p");p.textContent=col[id]?CAST[d.who].name+" "+d.cap.charAt(0).toLowerCase()+d.cap.slice(1):"???  ("+d.name+")";div.appendChild(p);box.appendChild(div);
 withCtx(c,360,300,function(){if(col[id])deathDraw(id,0.8);else{ctx.fillStyle="#555";ctx.fillRect(0,0,W,300);txt("?",180,150,120,"#888")}})});
 var cast="";Object.keys(CAST).forEach(function(k){cast+="<li><b>"+CAST[k].name+"</b> "+CAST[k].line+"</li>"});$("castList").innerHTML=cast;show("coll")}

function init(){cv=$("mgc");ctx=cv.getContext("2d");
 cv.addEventListener("pointerdown",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;ptr.taps.push(p)});cv.addEventListener("pointermove",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y});window.addEventListener("resize",resize);
 $("playBtn").onclick=function(){startSurvival()};$("againBtn").onclick=function(){startSurvival()};$("shareBtn").onclick=share;$("menuBtn").onclick=function(){show("title")};
 $("collBtn").onclick=showColl;$("overColl").onclick=showColl;$("collBack").onclick=function(){refresh();show("title")};$("muteBtn").onclick=function(){ac();setMute(!muted);if(muted)music(false)};
 setMute(muted);refresh();castRow();
 var q=new URLSearchParams(location.search),dm=q.get("mg");
 if(dm==="survival")startSurvival();else if(dm&&G[dm]){show("play");resize();S={lives:1,score:0};play(dm,+(q.get("sp")||1),false,function(win){window.__last={id:dm,win:win};over(run.g)})}
 if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)navigator.serviceWorker.register("sw.js").catch(function(){});
 window.__ewg={list:LIST,run:function(){return run},state:function(){return S}}}
init();
})();
