// EISH! Ways to Go - South African microgame chaos. Pure canvas + WebAudio, vector sticker-puppet cast + 2 WebP collage backgrounds.
(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var LS={get:function(k,d){try{var v=localStorage.getItem("ewg_"+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem("ewg_"+k,JSON.stringify(v))}catch(e){}}};
var cv,ctx,W=360,H=640,raf=0,last=0,shake=0,parts=[],flashT=0,HIT=0,popT=0,run=null;
var ptr={x:180,y:500,taps:[]};
// seeded RNG for the daily challenge (Math.random otherwise)
var RNG=Math.random;function seeded(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rnd(a,b){return a+RNG()*(b-a)}
function pick(a){return a[Math.floor(RNG()*a.length)]}
function frnd(a,b){return a+Math.random()*(b-a)}

// ---------- audio: sfx + original amapiano-flavoured jingle ----------
var AC=null,master=null,muted=LS.get("mute",false),musicOn=false,nextT=0,stepN=0,timer=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:0.5;master.connect(AC.destination)}catch(e){}}if(AC&&AC.state==="suspended")AC.resume();return AC}
function tone(f,d,type,vol,t0,slide){if(!ac())return;var t=t0||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||"square";o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(vol||0.08,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.02)}
var noiseBuf=null;function hat(t,v){if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*0.05,AC.sampleRate);var d=noiseBuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}var s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type="highpass";f.frequency.value=7000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.04);s.connect(f);f.connect(g);g.connect(master);s.start(t)}
function blip(f,d,type){tone(f,d||0.08,type,0.07)}
// original amapiano-flavoured jingle in 3 variations (A/B per run, C = boss); 16th steps
var SONGS=[{bpm:113,mel:[69,0,72,0,74,72,0,69,76,0,74,0,72,0,69,0, 67,0,69,0,72,0,74,76,0,74,0,72,69,0,67,0],log:[1,0,0,1,0,0,1,0,0,0,1,1,0,0,1,0, 1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0],bass:[45,45,45,43,43,43,41,41,41,41,43,43,43,43,45,45, 45,45,45,43,43,43,48,48,48,48,47,47,47,47,45,45],ch:[57,60,64]},
 {bpm:110,mel:[72,0,0,74,76,0,74,0,72,0,69,0,67,0,69,0, 72,0,0,74,76,0,79,0,76,0,74,0,72,0,0,0],log:[1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0, 1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0],bass:[48,48,48,48,45,45,45,45,41,41,41,41,43,43,43,43, 48,48,48,48,45,45,45,45,41,41,43,43,43,43,43,43],ch:[60,64,67]},
 {bpm:126,mel:[76,0,76,0,74,0,72,74,0,72,69,0,72,0,74,0, 76,0,79,0,76,0,74,72,0,74,0,76,0,74,72,0],log:[1,0,1,0,0,1,0,1,1,0,1,0,0,1,1,0, 1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,1],bass:[45,45,45,45,48,48,48,48,43,43,43,43,47,47,47,47, 45,45,45,45,48,48,48,48,50,50,50,50,47,47,47,47],ch:[57,60,64]}];
var SONG=SONGS[0],SET={mute:LS.get("mute",false),music:LS.get("music",true),vib:LS.get("vib",true),rm:LS.get("rm",false)};
function mtof(n){return 440*Math.pow(2,(n-69)/12)}
function sched(){if(!AC)return;var spb=60/SONG.bpm/4;while(nextT<AC.currentTime+0.12){var s=stepN%32,t=nextT;
 if(SONG.log[s])tone(mtof(SONG.bass[s]),0.28,"sine",0.22,t,mtof(SONG.bass[s])*0.55);
 hat(t,s%2?0.05:0.02);if(s%8===4)tone(180,0.12,"triangle",0.08,t,60);
 if(SONG.mel[s])tone(mtof(SONG.mel[s]),0.11,"square",0.03,t);
 if(s%16===0||s%16===10)SONG.ch.forEach(function(n){tone(mtof(n),0.35,"triangle",0.022,t)});
 nextT+=spb;stepN++}}
function music(on,v){if(v!=null)SONG=SONGS[v];if(!ac())return;if(on&&SET.music&&!muted&&!musicOn){musicOn=true;nextT=AC.currentTime+0.05;timer=setInterval(sched,25)}else if(!on&&musicOn){musicOn=false;clearInterval(timer)}}
// tiny synth SFX, zero bytes of audio files
var NB2=null;function noise(d,f0,f1,v,type,t0){if(!ac()||muted)return;var t=t0||AC.currentTime;if(!NB2){NB2=AC.createBuffer(1,AC.sampleRate*0.6,AC.sampleRate);var q=NB2.getChannelData(0);for(var i=0;i<q.length;i++)q[i]=Math.random()*2-1}
 var s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB2;f.type=type||"bandpass";f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(v||0.15,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+0.02)}
var SFX={pop:function(k){tone(520+(k||0)*60,0.07,"triangle",0.09,0,900+(k||0)*60)},coin:function(k){var t=AC&&AC.currentTime;tone(988+(k||0)*40,0.06,"square",0.05,t);tone(1319+(k||0)*40,0.12,"square",0.05,t+0.06)},
 swish:function(){noise(0.14,600,3000,0.12)},thud:function(){tone(140,0.16,"sine",0.25,0,50);noise(0.08,400,100,0.1,"lowpass")},splat:function(){noise(0.2,900,200,0.2,"lowpass");tone(220,0.1,"square",0.04,0,90)},
 zap:function(){tone(1200,0.18,"sawtooth",0.05,0,180);noise(0.18,4000,800,0.08)},boing:function(){tone(220,0.25,"sine",0.18,0,660)},toot:function(f,d){tone(f||233,d||0.22,"sawtooth",0.07,0,(f||233)*0.98)},
 thunder:function(){noise(0.7,300,60,0.35,"lowpass")},sizzle:function(){noise(0.3,5000,2000,0.06,"highpass")},honk:function(){var t=AC&&AC.currentTime;tone(392,0.12,"square",0.06,t);tone(330,0.18,"square",0.06,t+0.13)},
 bark:function(){tone(500,0.08,"sawtooth",0.08,0,250);noise(0.08,900,500,0.1)},buzz:function(){tone(640,0.12,"sawtooth",0.025,0,700)},whoosh:function(){noise(0.3,200,2000,0.12)},
 slurp:function(){tone(300,0.2,"sine",0.12,0,900)},puff:function(){noise(0.25,1200,300,0.12)},bell:function(){var t=AC&&AC.currentTime;tone(1568,0.25,"sine",0.08,t);tone(2093,0.3,"sine",0.05,t+0.04)},
 tick:function(){tone(1800,0.02,"square",0.03)},fail:function(){var t=AC&&AC.currentTime;tone(392,0.16,"square",0.06,t);tone(311,0.16,"square",0.06,t+0.16);tone(262,0.4,"sawtooth",0.06,t+0.32,130)},
 win:function(){var t=AC&&AC.currentTime,b=SONG.ch[0]+12;[0,4,7,12].forEach(function(n,i){tone(mtof(b+n),0.1,"square",0.05,t+i*0.06)})},
 fanfare:function(){var t=AC&&AC.currentTime;[0,4,7,12,7,12,16].forEach(function(n,i){tone(mtof(64+n),0.14,"square",0.05,t+i*0.09);tone(mtof(52+n),0.14,"triangle",0.05,t+i*0.09)})}};
function sfx(n,a,b){try{if(ac()&&!muted&&SFX[n])SFX[n](a,b)}catch(e){}}
function vib(p){if(!SET.vib)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function hitStop(sec){if(SET.rm)return;HIT=Math.max(HIT,sec||0.06)}
function goodTap(x,y,col){burst(x,y,col||"#f2c230",6);popT=SET.rm?0:0.1;sfx("pop");vib(8)}
function punch(x,y){hitStop(0.07);shake=Math.max(shake,0.22);burst(x,y,"#fffaf0",8);star(x,y-20,10,CLK*4);vib(18)}

// ---------- drawing helpers ----------
function rr(x,y,w,h,r,fill,lw){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function circ(x,y,r,fill,lw){ctx.beginPath();ctx.arc(x,y,Math.max(0.1,r),0,7);ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function ell(x,y,rx,ry,fill,lw){ctx.beginPath();ctx.ellipse(x,y,Math.max(0.1,rx),Math.max(0.1,ry),0,0,7);ctx.fillStyle=fill;ctx.fill();if(lw!==0){ctx.lineWidth=lw||4;ctx.strokeStyle="#111";ctx.stroke()}}
function line(a,b,c,d,w,col){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.lineWidth=w||4;ctx.strokeStyle=col||"#111";ctx.lineCap="round";ctx.stroke()}
function tri(a,b,c,d,e,f,fill){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.lineTo(e,f);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke()}
function txt(s,x,y,size,fill,rot){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font="900 "+size+"px 'Trebuchet MS',Impact,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";ctx.lineWidth=Math.max(4,size/6);ctx.strokeStyle="#111";ctx.strokeText(s,0,0);ctx.fillStyle=fill||"#fff";ctx.fillText(s,0,0);ctx.restore()}
function wrap(s,x,y,size,maxW,fill){ctx.font="900 "+size+"px 'Trebuchet MS',sans-serif";var w=s.split(" "),ln="",out=[];w.forEach(function(k){var t=ln?ln+" "+k:k;if(ctx.measureText(t).width>maxW&&ln){out.push(ln);ln=k}else ln=t});out.push(ln);out.forEach(function(l,i){txt(l,x,y+i*size*1.2,size,fill)})}
function burst(x,y,col,n){for(var i=0;i<(n||10);i++)parts.push({x:x,y:y,vx:rnd(-220,220),vy:rnd(-300,20),l:rnd(0.4,0.65),c:col,r:rnd(0,6),vr:rnd(-14,14),w:rnd(6,11),h:rnd(4,7),paper:1})}
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
function bean(id,x,y,r,face,squash){var FM2={"":"calm",x:"shock",spin:"dizzy",sad:"sad",shut:"calm"};drawChar(id,x,y+r*1.25,r*2.6,FM2[face||""]||"calm",CLK,{sy:squash||1,sx:1/(squash||1),ph:x*0.013})}

// ---------- v0.5 sticker-puppet art: vector cut-out rig (one shared model, real limbs), crisp at any DPR ----------
var ART={},CLK=0,FT="'Lucky','Arial Black',Impact,sans-serif",FM="'Marker','Comic Sans MS',cursive";
["bg-braai","bg-road"].forEach(function(n){var i=new Image();i.onload=function(){ART[n]=i;window.__artN=Object.keys(ART).length};i.src="art/"+n+".webp"});
var BEAD=new Image();BEAD.src="art/beadband.svg";
function img(n){return ART[n]||null}
function sq12(t){return Math.floor(t*12)/12}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function easeOutBack(p){p=clamp(p,0,1);var c=1.9;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)}
function easeOut(p){p=clamp(p,0,1);return 1-Math.pow(1-p,3)}
function easeInOut(p){p=clamp(p,0,1);return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2}
function popK(t){return t>=0.4?1:Math.max(0.01,easeOutBack(t/0.4))}
var INK="#2b1b33",CUT="#fffaf0",SH="rgba(43,27,51,.28)",MODE="draw",_s=1,HT=null;
var SPR=new Map(),SPRPX=0,SPRMAX=10e6,SPRD=1;
function pxs(){var m=ctx.getTransform();return Math.sqrt(m.a*m.a+m.b*m.b)}
function spr(key,L,T,w,h,fn){var d=pxs(),k=key+"@"+Math.round(d*16),e=SPR.get(k);
 if(e){SPR.delete(k);SPR.set(k,e)}else{var cw=Math.max(1,Math.ceil(w*d)),ch=Math.max(1,Math.ceil(h*d)),c=mkC(cw,ch);var oc=ctx,s0=_s,M0=MODE;ctx=c.getContext("2d");SPRD=d;ctx.setTransform(d,0,0,d,-L*d,-T*d);fn();SPRD=1;_s=s0;MODE=M0;ctx=oc;e={c:bmp(c),px:cw*ch};SPR.set(k,e);SPRPX+=e.px;
  while(SPRPX>SPRMAX&&SPR.size>1){var f=SPR.keys().next().value;var ev=SPR.get(f);SPRPX-=ev.px;if(ev.c.close)ev.c.close();SPR.delete(f)}}
 ctx.drawImage(e.c,L,T,w,h)}
// cached sprites become ImageBitmaps (no per-draw canvas snapshot); falls back to plain canvases
var OFF=typeof OffscreenCanvas!=="undefined"&&!!OffscreenCanvas.prototype.transferToImageBitmap;
function mkC(w,h){if(OFF){try{return new OffscreenCanvas(w,h)}catch(e){OFF=false}}var c=document.createElement("canvas");c.width=w;c.height=h;return c}
function bmp(c){return OFF&&c.transferToImageBitmap?c.transferToImageBitmap():c}
// character groups: one sprite holds the group shadow + the group itself (half the draws)
function cgspr(key,L,T,w,h,fn){if(MODE==="shadow")return;var ss=_s;gspr(key,L,T,w+6,h+6,function(){MODE="shadow";ctx.save();ctx.translate(3.5/ss,4.5/ss);fn();ctx.restore();MODE="draw";fn()})}
function gspr(key,L,T,w,h,fn){var m=ctx.getTransform(),d=Math.max(Math.sqrt(m.a*m.a+m.b*m.b),Math.sqrt(m.c*m.c+m.d*m.d)),dq=Math.pow(2,Math.ceil(Math.log2(d)*4)/4),k=key+"#"+dq,e=SPR.get(k);
 if(e){SPR.delete(k);SPR.set(k,e)}else{var cw=Math.max(1,Math.ceil(w*dq)),ch=Math.max(1,Math.ceil(h*dq)),c=mkC(cw,ch);var oc=ctx,s0=_s,M0=MODE;ctx=c.getContext("2d");SPRD=dq;ctx.setTransform(dq,0,0,dq,-L*dq,-T*dq);fn();SPRD=1;_s=s0;MODE=M0;ctx=oc;e={c:bmp(c),px:cw*ch};SPR.set(k,e);SPRPX+=e.px;
  while(SPRPX>SPRMAX&&SPR.size>1){var f=SPR.keys().next().value;var ev=SPR.get(f);SPRPX-=ev.px;if(ev.c.close)ev.c.close();SPR.delete(f)}}
 ctx.drawImage(e.c,L,T,w,h)}
function pkey(P){var o="";for(var k in P){var v=P[k];o+=typeof v==="number"?Math.round(v*30):v;o+=","}return o}
function htPat(){if(!HT){HT=document.createElement("canvas");HT.width=HT.height=6;var x=HT.getContext("2d");x.fillStyle="rgba(43,27,51,.16)";x.beginPath();x.arc(1.5,1.5,1,0,7);x.arc(4.5,4.5,1,0,7);x.fill()}return ctx.createPattern(HT,"repeat")}
// closed paper part: die-cut white edge, flat fill, detail (clipped), soft shade + halftone, unified ink line
function part(path,fill,det,bb){ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();path();
 if(MODE==="shadow"){ctx.fillStyle=SH;ctx.fill();ctx.lineWidth=10/_s;ctx.strokeStyle=SH;ctx.stroke();return}
 ctx.lineWidth=(8.5)/_s;ctx.strokeStyle=CUT;ctx.stroke();ctx.fillStyle=fill;ctx.fill();
 if(det){ctx.save();ctx.clip();det();ctx.restore();ctx.beginPath();path()}if(bb){var g=ctx.createLinearGradient(bb[0],bb[1],bb[2],bb[3]);g.addColorStop(0,"rgba(255,255,255,.18)");g.addColorStop(0.45,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(43,10,60,.26)");ctx.fillStyle=g;ctx.fill()}
 var hp=htPat();if(hp.setTransform)hp.setTransform(ctx.getTransform().inverse().scale(SPRD,SPRD));ctx.fillStyle=hp;ctx.fill();
 ctx.lineWidth=2.4/_s;ctx.strokeStyle=INK;ctx.stroke()}
// bendy limb (rubber-hose paper strip)
function limb(pts,w,col){ctx.lineJoin="round";ctx.lineCap="round";function p(){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);ctx.quadraticCurveTo(pts[2],pts[3],pts[4],pts[5])}
 if(MODE==="shadow"){p();ctx.lineWidth=w+10/_s;ctx.strokeStyle=SH;ctx.stroke();return}
 p();ctx.lineWidth=w+(8.5+4.8)/_s;ctx.strokeStyle=CUT;ctx.stroke();p();ctx.lineWidth=w+4.8/_s;ctx.strokeStyle=INK;ctx.stroke();p();ctx.lineWidth=w;ctx.strokeStyle=col;ctx.stroke()}
function inkLine(pts,w,col){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.lineWidth=(w||2.4)/_s;ctx.strokeStyle=MODE==="shadow"?SH:(col||INK);ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke()}
function E(x,y,rx,ry,rot){return function(){ctx.ellipse(x,y,rx,ry,rot||0,0,Math.PI*2)}}
function RR(x,y,w,h,r){return function(){ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}}
// ---- the shared model (all six use one skeleton, one line weight, one palette logic) ----
var LOOK={
 boet:{skin:"#86d27f",top:"#1f7a43",bot:"#f4efe3",shoe:"#2b2b33",pat:"hoops",pat2:"#f2c230",hair:"tuft",hc:"#2e2a2a",prop:"ball"},
 auntie:{skin:"#f39bbd",top:"#2f6fd6",bot:"#2f6fd6",shoe:"#f2c230",pat:"flowers",pat2:"#f2c230",hair:"doek",hc:"#f2c230",hc2:"#e53977",prop:"bag",dress:1},
 uncle:{skin:"#ffab5c",top:"#fbf6ea",bot:"#4f6fa8",shoe:"#7a4a2a",pat:"apron",pat2:"#2e8a4a",hair:"bald",hc:"#6b4a3a",prop:"tongs",tache:1},
 tannie:{skin:"#c7aef0",top:"#ff8fb8",bot:"#8a4fc4",shoe:"#8a4fc4",pat:"cardi",pat2:"#8a4fc4",hair:"bun",hc:"#5a2f5e",prop:"plate",dress:1,pearls:1},
 gaatjie:{skin:"#ffd84a",top:"#e23b3b",bot:"#e23b3b",shoe:"#fbf6ea",pat:"track",pat2:"#fbf6ea",hair:"cap",hc:"#e23b3b",prop:"cash"},
 gogo:{skin:"#67c9ef",top:"#7a4fc6",bot:"#7a4fc6",shoe:"#7a4fc6",pat:"shawl",pat2:"#b48ef0",hair:"white",hc:"#f4f1f6",prop:"stick",dress:1,specs:1}
};
function dirv(a,side){return[side*Math.sin(a),Math.cos(a)]}
// pose library (t already stop-motion quantised)
function poseOf(m,t,ph){var s=Math.sin,P={lean:0,head:0,lift:0,sx:1,sy:1,aL:0.28,bL:0.35,aR:0.28,bR:0.35,lL:0.06,lR:0.06,face:"calm",look:0,sec:0};
 if(m==="calm"){P.sy=1+0.03*s(t*2.6+ph);P.sx=2-P.sy;P.lean=0.04*s(t*1.4+ph);P.head=0.08*s(t*1.7+ph);P.aR=0.32+0.1*s(t*2+ph);P.aL=0.24-0.08*s(t*2+ph);P.sec=s(t*1.7-0.8+ph);P.look=0.85*s(t*0.55+ph)}
 else if(m==="happy"){var j=Math.abs(s(t*8+ph));P.lift=j*9;P.sy=0.9+0.16*j;P.sx=2-P.sy;P.aL=2.55+0.25*s(t*16);P.aR=2.55-0.25*s(t*16);P.bL=P.bR=-0.5;P.lL=0.25*j;P.lR=-0.25*j;P.head=0.1*s(t*8);P.face="happy";P.sec=s(t*8-1)}
 else if(m==="panic"||m==="run"){var f=m==="run"?17:15;P.lean=m==="run"?0.16:0.06*s(t*9+ph);P.head=0.14*s(t*11+ph);P.aL=2.3+0.55*s(t*f+ph);P.aR=2.3+0.55*s(t*f+2+ph);P.bL=0.7*s(t*f+1);P.bR=0.7*s(t*f+3);
  P.lL=0.75*s(t*f+ph);P.lR=-0.75*s(t*f+ph);P.lift=Math.abs(s(t*f+ph))*4;P.sy=1+0.05*s(t*f*2);P.sx=2-P.sy;P.face="panic";P.sec=s(t*f-1.2)}
 else if(m==="reach"){P.lean=-0.12;P.aR=1.85+0.12*s(t*14);P.bR=0.1;P.aL=2.2+0.4*s(t*14);P.bL=0.6;P.lL=0.4;P.lR=-0.3;P.face="panic";P.head=-0.08+0.06*s(t*12);P.sec=s(t*12-1)}
 else if(m==="sad"){P.sy=0.95;P.sx=1.04;P.head=0.16;P.lean=0.05;P.aL=0.05;P.aR=0.08;P.bL=P.bR=0.1;P.face="sad";P.sec=0.3*s(t*2)}
 else if(m==="shock"||m==="dizzy"){P.aL=1.5+0.1*s(t*6);P.aR=1.5-0.1*s(t*6);P.bL=P.bR=0.2;P.lL=0.5;P.lR=-0.5;P.face=m==="shock"?"x":"spin";P.head=0.12*s(t*5)}
 else if(m==="sleep"){P.face="sleep";P.head=0.32+0.04*s(t*2);P.sy=0.95+0.02*s(t*2);P.sx=2-P.sy;P.aL=0.1;P.aR=0.12;P.bL=P.bR=0.3;P.lean=0.06}
 else if(m==="duck"){P.sy=0.66;P.sx=1.22;P.aL=2.7;P.aR=2.7;P.bL=P.bR=-0.9;P.lL=0.7;P.lR=-0.7;P.face="panic";P.head=0.1*s(t*20)}
 else if(m==="cheer"){var j2=Math.abs(s(t*7+ph));P.lift=j2*5;P.aL=2.7;P.aR=2.7;P.bL=P.bR=-0.3;P.face="happy";P.sy=0.95+0.08*j2;P.sx=2-P.sy}
 else if(m==="chew"){P.face="chew";P.sy=1+0.04*s(t*16);P.sx=2-P.sy;P.head=0.05*s(t*16)}
 else if(m==="blow"){P.face="blow";P.aR=1.75;P.bR=1.2;P.aL=1.6;P.bL=1.3;P.sy=1.04+0.03*s(t*20);P.sx=2-P.sy}
 else if(m==="hold"){P.aL=1.35;P.bL=1.0;P.aR=1.35;P.bR=1.0;P.face="panic";P.lean=0.04*s(t*8)}
 return P}
function mixP(a,b,k){var o={};for(var key in b)o[key]=typeof b[key]==="number"?a[key]+(b[key]-a[key])*k:(k>0.35?b[key]:a[key]);return o}
// actor: smooth eased transitions between poses + anticipation impulses
function actor(id){return{id:id,m:"calm",pm:"calm",mt:9,imp:0,it:9}}
function setM(a,m){if(a.m===m)return;a.pm=a.m;a.m=m;a.mt=0;a.it=0;
 // anticipation: squash into the new mood for a beat
 a.imp=(m==="shock"||m==="dizzy"||m==="duck")?1.1:(m==="happy"||m==="cheer")?0.7:(m==="panic"||m==="run"||m==="reach")?0.85:(m==="sad"||m==="sleep")?0.4:0.55}
function face(C,P,t){var bl=((P.face==="calm"||P.face==="happy"||P.face==="reach")&&((t+P.look)%(P.face==="calm"?2.6:3.4))<0.09),lx=P.look*1.4;
 // eyes
 [-1,1].forEach(function(sd){var ex=sd*8.5,ey=-83;
  if(P.face==="x"){inkLine([ex-4,ey-4,ex+4,ey+4],3);inkLine([ex+4,ey-4,ex-4,ey+4],3);return}
  if(P.face==="spin"){ctx.beginPath();for(var k=0;k<16;k++){var a=k*0.8+t*9*sd,r=k*0.38;ctx.lineTo(ex+Math.cos(a)*r,ey+Math.sin(a)*r)}ctx.lineWidth=1.8/_s;ctx.strokeStyle=INK;ctx.stroke();return}
  if(P.face==="sleep"||P.face==="chew"||P.face==="blow"){ctx.beginPath();ctx.arc(ex,ey-1,4.5,0.15*Math.PI,0.85*Math.PI);ctx.lineWidth=3/_s;ctx.strokeStyle=INK;ctx.stroke();return}
  if(P.face==="happy"){ctx.beginPath();ctx.arc(ex,ey+2,4.5,Math.PI*1.1,Math.PI*1.9);ctx.lineWidth=3/_s;ctx.strokeStyle=INK;ctx.stroke();return}
  if(bl){inkLine([ex-4.5,ey,ex+4.5,ey],2.6);return}
  var big=P.face==="panic";ctx.beginPath();ctx.ellipse(ex,ey,big?6.6:5.4,big?8:6.6,0,0,7);ctx.fillStyle="#fff";ctx.fill();ctx.lineWidth=2/_s;ctx.strokeStyle=INK;ctx.stroke();
  ctx.beginPath();ctx.arc(ex+(big?0:lx)+0.6,ey+(big?0:1),big?1.7:2.8,0,7);ctx.fillStyle=INK;ctx.fill();if(!big){ctx.beginPath();ctx.arc(ex+lx+1.5,ey-0.4,0.9,0,7);ctx.fillStyle="#fff";ctx.fill()}
  // brows
  var by=ey-(big?11:9.5),tilt=P.face==="panic"?-0.45:P.face==="sad"?-0.3:0.12;inkLine([ex-4*sd,by+tilt*4*sd*sd*(sd>0?1:1)+(P.face==="sad"?-1:0)*0,ex+4*sd,by-tilt*3],2.6)});
 // blush + nose
 ctx.fillStyle="rgba(255,90,120,.28)";[-1,1].forEach(function(sd){ctx.beginPath();ctx.ellipse(sd*14,-75,4,2.6,0,0,7);ctx.fill()});
 ctx.beginPath();ctx.ellipse(0.5,-77,C.tache?3.6:2.6,C.tache?3:2.2,0,0,7);ctx.fillStyle="rgba(43,27,51,.18)";ctx.fill();
 // mouth
 var f=P.face;ctx.lineWidth=2.4/_s;ctx.strokeStyle=INK;
 if(f==="sleep"){ctx.beginPath();ctx.ellipse(0,-68,3,3.6,0,0,7);ctx.fillStyle="#5a1630";ctx.fill();ctx.stroke()}
 else if(f==="chew"||f==="blow"){ctx.fillStyle=C.skin;[-1,1].forEach(function(sd){ctx.beginPath();ctx.ellipse(sd*12,-70,7,6,0,0,7);ctx.fill();ctx.stroke()});if(f==="blow"){ctx.beginPath();ctx.ellipse(0,-68,3.6,3.6,0,0,7);ctx.fillStyle="#5a1630";ctx.fill();ctx.stroke()}else{ctx.beginPath();ctx.moveTo(-5,-70);ctx.quadraticCurveTo(-2,-67,0,-70);ctx.quadraticCurveTo(2,-73,5,-70);ctx.stroke()}}
 else if(f==="panic"||f==="x"||f==="spin"){var o=f==="panic"?1+0.18*Math.sin(t*30):0.6;ctx.beginPath();ctx.ellipse(0,-68.5,5.2*o,6*o,0,0,7);ctx.fillStyle="#5a1630";ctx.fill();ctx.stroke();if(f==="panic"){ctx.save();ctx.clip();ctx.fillStyle="#fff";ctx.fillRect(-6,-75.5,12,3);ctx.fillStyle="#ff7a9a";ctx.beginPath();ctx.ellipse(0,-64,4,2.5,0,0,7);ctx.fill();ctx.restore()}}
 else if(f==="happy"){ctx.beginPath();ctx.moveTo(-7,-71);ctx.quadraticCurveTo(0,-60,7,-71);ctx.closePath();ctx.fillStyle="#5a1630";ctx.fill();ctx.stroke()}
 else if(f==="sad"){ctx.beginPath();ctx.arc(0,-64.5,4.5,Math.PI*1.15,Math.PI*1.85);ctx.stroke()}
 else{ctx.beginPath();ctx.arc(0,-73,5,0.35,Math.PI-0.35);ctx.stroke()}
 if(C.tache){part(function(){ctx.moveTo(0,-73.5);ctx.quadraticCurveTo(-9,-76,-13,-70);ctx.quadraticCurveTo(-6,-71.5,0,-71);ctx.quadraticCurveTo(6,-71.5,13,-70);ctx.quadraticCurveTo(9,-76,0,-73.5)},C.hc)}
 if(C.specs){[-1,1].forEach(function(sd){ctx.beginPath();ctx.arc(sd*8.5,-83,8,0,7);ctx.lineWidth=2.4/_s;ctx.strokeStyle=INK;ctx.stroke();ctx.fillStyle="rgba(255,255,255,.18)";ctx.fill()});inkLine([-0.5,-84,0.5,-84],2.4)}}
function hairBack(C,P){var sc=P.sec;
 if(C.hair==="bun"){part(E(2,-110,10,10),C.hc,null,[-8,-120,12,-100]);part(E(0,-101,7,4),"#ffd84a")}
 if(C.hair==="white"){part(E(0,-104,8,7),C.hc,null,[-8,-112,8,-96])}
 if(C.hair==="doek"){ctx.save();ctx.translate(17,-97);ctx.rotate(0.3+sc*0.15);part(function(){ctx.moveTo(0,0);ctx.quadraticCurveTo(14,-14,18,2);ctx.quadraticCurveTo(10,6,0,0);ctx.moveTo(0,0);ctx.quadraticCurveTo(16,10,8,18);ctx.quadraticCurveTo(2,10,0,0)},C.hc2);ctx.restore()}
 if(C.hair==="cap"){ctx.save();ctx.translate(18,-92);ctx.rotate(-0.1+sc*0.05);part(RR(-4,-3,16,7,3),C.hc);ctx.restore()}}
function hairFront(C,P){
 if(C.hair==="tuft"){part(function(){ctx.moveTo(-16,-96);ctx.quadraticCurveTo(-12,-108,-4,-103);ctx.quadraticCurveTo(0,-112,6,-103);ctx.quadraticCurveTo(14,-108,16,-96);ctx.quadraticCurveTo(0,-100,-16,-96)},C.hc)}
 if(C.hair==="doek"){part(function(){ctx.moveTo(-23,-86);ctx.quadraticCurveTo(-28,-118,0,-118);ctx.quadraticCurveTo(28,-118,23,-86);ctx.quadraticCurveTo(0,-96,-23,-86)},C.hc,function(){ctx.fillStyle=C.hc2;for(var i=0;i<7;i++){ctx.beginPath();ctx.arc(-18+i*6,-102+(i%2)*6,2.2,0,7);ctx.fill()}inkLine([-22,-92,22,-92],2,C.hc2)},[-20,-118,20,-86])}
 if(C.hair==="bald"){ctx.fillStyle="rgba(255,255,255,.5)";ctx.beginPath();ctx.ellipse(-8,-96,5,2.5,-0.5,0,7);ctx.fill();[-1,1].forEach(function(sd){part(E(sd*20,-92,4,3.2,sd*0.5),"#9a8070")})}
 if(C.hair==="bun"){part(function(){ctx.moveTo(-22,-84);ctx.quadraticCurveTo(-22,-104,2,-103);ctx.quadraticCurveTo(22,-102,22,-84);ctx.quadraticCurveTo(10,-96,-4,-93);ctx.quadraticCurveTo(-14,-92,-22,-84)},C.hc,null,[-20,-104,20,-84])}
 if(C.hair==="white"){part(function(){ctx.moveTo(-23,-80);ctx.quadraticCurveTo(-27,-98,-12,-100);ctx.quadraticCurveTo(0,-106,12,-100);ctx.quadraticCurveTo(27,-98,23,-80);ctx.quadraticCurveTo(14,-93,0,-93);ctx.quadraticCurveTo(-14,-93,-23,-80)},C.hc,null,[-20,-104,20,-80])}
 if(C.hair==="cap"){part(function(){ctx.moveTo(-22,-88);ctx.quadraticCurveTo(-22,-110,0,-110);ctx.quadraticCurveTo(22,-110,22,-88);ctx.closePath()},C.hc,function(){inkLine([0,-110,0,-90],1.6,"#fff")},[-20,-110,20,-88]);part(E(0,-110,3,2),"#fff")}}
function torso(C,P){var pth=function(){ctx.moveTo(-14,-60);ctx.quadraticCurveTo(0,-64,14,-60);ctx.quadraticCurveTo(25,-40,(C.dress?24:21),-21);ctx.quadraticCurveTo(0,-14,-(C.dress?24:21),-21);ctx.quadraticCurveTo(-25,-40,-14,-60)};
 part(pth,C.top,function(){var p2=C.pat2;ctx.fillStyle=p2;
  if(C.pat==="hoops")for(var i=0;i<3;i++)ctx.fillRect(-30,-52+i*11,60,5);
  if(C.pat==="flowers")for(var i=0;i<9;i++){var x=-18+(i%3)*18+(Math.floor(i/3)%2)*6,y=-54+Math.floor(i/3)*12;ctx.beginPath();for(var k=0;k<5;k++){ctx.moveTo(x,y);ctx.arc(x+Math.cos(k*1.26)*2.6,y+Math.sin(k*1.26)*2.6,2,0,7)}ctx.fill();ctx.fillStyle="#e53977";ctx.beginPath();ctx.arc(x,y,1.3,0,7);ctx.fill();ctx.fillStyle=p2}
  if(C.pat==="apron"){ctx.beginPath();ctx.moveTo(-11,-54);ctx.lineTo(11,-54);ctx.lineTo(16,-16);ctx.lineTo(-16,-16);ctx.closePath();ctx.fill();ctx.lineWidth=2/_s;ctx.strokeStyle=INK;ctx.stroke();ctx.strokeStyle="rgba(255,255,255,.6)";ctx.strokeRect(-6,-40,12,8)}
  if(C.pat==="cardi"){ctx.fillRect(-5,-62,10,50);ctx.fillStyle="#fff";for(var i=0;i<3;i++){ctx.beginPath();ctx.arc(-8,-50+i*9,1.6,0,7);ctx.fill()}}
  if(C.pat==="track"){ctx.fillRect(-21,-60,4,44);ctx.fillRect(17,-60,4,44);inkLine([0,-60,0,-20],1.6,"#fff")}
  if(C.pat==="shawl"){ctx.beginPath();ctx.moveTo(-26,-58);ctx.quadraticCurveTo(0,-30,26,-58);ctx.lineTo(26,-46);ctx.quadraticCurveTo(0,-14,-26,-46);ctx.closePath();ctx.fill();ctx.fillStyle="#fff";for(var i=0;i<6;i++){ctx.beginPath();ctx.arc(-15+i*6,-34+Math.abs(i-2.5)*-2.4,1.2,0,7);ctx.fill()}}
 },[-20,-62,22,-16]);
 if(C.pearls){ctx.fillStyle="#fff";for(var i=-3;i<=3;i++){ctx.beginPath();ctx.arc(i*3.4,-58+Math.abs(i)*-0.6+3,1.9,0,7);ctx.fill();ctx.lineWidth=1/_s;ctx.strokeStyle=INK;ctx.stroke()}}}
function prop(C,hx,hy,ang){if(!C.prop)return;var r={ball:0.5,bag:0,tongs:-ang*0.6,plate:-ang*0.8+0.1,cash:-ang*0.5,stick:0.08}[C.prop]||0;ctx.save();ctx.translate(hx,hy);ctx.rotate(r);cgspr("pr|"+CID,-30,-34,60,64,function(){prop0(C)});ctx.restore()}
function prop0(C){ctx.save();
 if(C.prop==="ball"){part(E(0,4,10,7),"#a8643a",function(){inkLine([-5,4,5,4],1.6,"#fff");for(var i=-2;i<=2;i++)inkLine([i*2,2,i*2,6],1.2,"#fff")},[-10,-3,10,11])}
 if(C.prop==="bag"){part(RR(-9,2,18,14,4),"#e53977",function(){ctx.fillStyle="#f2c230";ctx.fillRect(-9,7,18,3)},[-9,2,9,16]);ctx.beginPath();ctx.arc(0,3,6,Math.PI,0);ctx.lineWidth=2.2/_s;ctx.strokeStyle=INK;ctx.stroke()}
 if(C.prop==="tongs"){[[0,0,12,-24],[3,0,17,-22]].forEach(function(q){inkLine(q,6.5,INK);inkLine(q,3.2,"#c8ccd2")})}
 if(C.prop==="plate"){part(E(8,-2,15,4.5),"#fff",null,null);part(function(){ctx.ellipse(3,-7,6,3.2,0.3,0,7)},"#e8a23a",function(){inkLine([0,-8,6,-6],1.2,"#9a5a1a")});part(function(){ctx.ellipse(13,-7,6,3.2,-0.3,0,7)},"#e8a23a",function(){inkLine([10,-6,16,-8],1.2,"#9a5a1a")})}
 if(C.prop==="cash"){for(var i=0;i<3;i++){ctx.save();ctx.rotate(-0.4+i*0.35);part(RR(-3,-18,8,16,1.5),"#6fbf5a",function(){ctx.fillStyle="rgba(255,255,255,.5)";ctx.fillRect(-1,-12,4,4)});ctx.restore()}}
 if(C.prop==="stick"){limb([0,-14,1,6,0,24],3.2,"#8a5a32");ctx.beginPath();ctx.arc(-4,-14,4,0,Math.PI,true);ctx.lineWidth=3.2/_s+2.4/_s;ctx.strokeStyle="#8a5a32";ctx.stroke()}
 ctx.restore()}
function body(C,P,t){var sd=1;ctx.translate(0,-P.lift);
 // legs from hips
 [[-1,P.lL],[1,P.lR]].forEach(function(L){var hx=L[0]*8,hy=-24,d=dirv(L[1],1),fx=hx+d[0]*20,fy=hy+d[1]*20;limb([hx,hy,hx+d[0]*10+L[1]*2,hy+d[1]*10,fx,fy],8.5,C.dress?C.skin:C.bot);ctx.save();ctx.translate(fx,fy);cgspr("sh|"+CID,-14,-14,32,28,function(){part(E(3,1,7,4),C.shoe,null,[-4,-3,8,5])});ctx.restore()});
 ctx.save();ctx.translate(0,-22);ctx.rotate(P.lean);ctx.translate(0,22);
 function arm(side,a,b,front){var sx=side*16,sy=-53,d1=dirv(a,side),ex=sx+d1[0]*12,ey=sy+d1[1]*12,d2=dirv(a+b,side),hx=ex+d2[0]*12,hy=ey+d2[1]*12;
  limb([sx,sy,ex,ey,hx,hy],7.5,C.top);ctx.save();ctx.translate(hx,hy);cgspr("hd|"+CID,-12,-12,24,24,function(){part(E(0,0,5,5),C.skin)});ctx.restore();if(front)prop(C,hx,hy,a*side)}
 arm(-1,P.aL,P.bL,false);
 cgspr("to|"+CID,-36,-74,72,66,function(){torso(C,P)});
 ctx.save();ctx.translate(0,-60);ctx.rotate(P.head);ctx.translate(0,60);
 var sq=Math.round(P.sec*3),lk=Math.round(P.look*2),ft=P.face==="spin"?P.fn/8*Math.PI*2/9:P.face==="panic"?P.fn/4*Math.PI*2/30:1;
 var hn=HATN;cgspr("he|"+CID+P.face+P.bl+"|"+sq+"|"+lk+"|"+P.fn,-48,-150,100,106,function(){var Q={sec:sq/3,look:lk/2,face:P.face};hairBack(C,Q);part(E(0,-82,23.5,22),C.skin,null,[-18,-100,20,-62]);[-1,1].forEach(function(e){if(C.hair!=="doek"&&C.hair!=="white")part(E(e*23,-80,4,5),C.skin)});
 hairFront(C,Q);face(C,Q,P.bl?0.05:ft);hatDraw(hn)});ctx.restore();
 arm(1,P.aR,P.bR,true);ctx.restore()}
// draw one character with feet at x,y, height h. o:{flip,pop,sx,sy,rot,ph,actor,ground}
var CID="",HATN="none";function drawChar(id,x,y,h,mood,t,o){o=o||{};var C=LOOK[id]||LOOK.boet,tq=sq12(t),ph=o.ph||0,P;
 var A=o.actor;if(A){var k=easeOut(A.mt/0.22);P=k<1?mixP(poseOf(A.pm,tq,ph),poseOf(A.m,tq,ph),k):poseOf(A.m,tq,ph);
  if(A.imp>0.02){var ik=Math.exp(-A.mt*12);P.sy*=1-0.14*A.imp*ik;P.sx*=1+0.12*A.imp*ik;P.lift=(P.lift||0)-3*A.imp*ik}}
 else P=poseOf(mood,tq,ph);
 if(o.P)for(var key in o.P)P[key]=o.P[key];
 var s0=h/112*(o.pop==null?1:o.pop),fx=o.flip?-1:1,sxx=P.sx*(o.sx||1),syy=P.sy*(o.sy||1);if(s0<0.02)return;
 ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);
 if(o.ground!==false){ctx.fillStyle="rgba(43,27,51,.2)";ctx.beginPath();ctx.ellipse(0,0,h*0.2*(1-Math.min(0.5,P.lift/40)),h*0.035,0,0,7);ctx.fill()}
 var n=Math.floor(t*12);P.bl=(P.face==="calm"&&(tq%3.1)<0.1)?1:0;P.fn=P.face==="spin"?n%8:P.face==="panic"?n%4:0;
 _s=s0;ctx.scale(s0*fx*sxx,s0*syy);_s=s0*Math.min(sxx,syy);HATN=o.hat!=null?o.hat:(OUT[id]||"none");CID=id+(HATN!=="none"?"/"+HATN:"");
 MODE="shadow";ctx.save();ctx.translate(3.5/_s,4.5/_s);body(C,P,tq);ctx.restore();MODE="draw";body(C,P,tq);
 ctx.restore()}
// ---- props in the same paper-puppet style ----
function drawWors(x,y,sz,t,o){o=o||{};var q=Math.max(2,Math.round(sz/2)*2);ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(sz/q,sz/q);spr("w|"+q,-0.75*q,-0.75*q,1.5*q,1.5*q,function(){drawWors0(q)});ctx.restore()}
function drawWors0(sz){_s=sz/60;ctx.save();ctx.scale(_s,_s);
 var pts=[];for(var i=0;i<=60;i++){var a=i/60*Math.PI*5,r=3+i/60*22;pts.push(Math.cos(a)*r,Math.sin(a)*r*0.92)}
 function sp(){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1])}
 ctx.lineJoin=ctx.lineCap="round";
 ctx.save();ctx.translate(3.5/_s,4.5/_s);sp();ctx.lineWidth=11+10/_s;ctx.strokeStyle=SH;ctx.stroke();ctx.restore();
 sp();ctx.lineWidth=11+(8.5+4.8)/_s;ctx.strokeStyle=CUT;ctx.stroke();sp();ctx.lineWidth=11+4.8/_s;ctx.strokeStyle=INK;ctx.stroke();sp();ctx.lineWidth=11;ctx.strokeStyle="#b2452c";ctx.stroke();
 ctx.save();ctx.translate(-1.3,-1.6);sp();ctx.lineWidth=3;ctx.strokeStyle="rgba(255,190,160,.55)";ctx.stroke();ctx.restore();
 for(var i=6;i<pts.length-2;i+=6){ctx.beginPath();ctx.arc(pts[i],pts[i+1],1.2,0,7);ctx.fillStyle="rgba(60,10,10,.45)";ctx.fill()}
 // two crossed skewers
 
 ctx.restore()}
function drawDog(x,y,h,t,o){o=o||{};var run=o.run!==false,n=Math.floor(t*12)%6;ctx.save();ctx.translate(x,y);spr("d|"+Math.round(h)+"|"+(o.flip?1:0)+"|"+run+"|"+n+"|"+(o.mouth?1:0),-h,-1.3*h,2*h,1.55*h,function(){drawDog0(0,0,h,n,o)});ctx.restore()}
function drawDog0(x,y,h,n,o){var u=n/6*Math.PI*2,run=o.run!==false,s=Math.sin;_s=h/60;ctx.save();ctx.translate(x,y);
 ctx.fillStyle="rgba(43,27,51,.2)";ctx.beginPath();ctx.ellipse(0,0,h*0.5,h*0.07,0,0,7);ctx.fill();
 ctx.scale(_s*(o.flip?-1:1),_s);var lift=run?Math.abs(s(u))*5:0;
 function D(){ctx.save();ctx.translate(0,-lift);ctx.rotate(run?0.06*s(u):0);
  [[-16,0],[ -10,2],[14,1],[20,3]].forEach(function(L,i){var a=(i%2?1:-1)*(run?0.7*s(u+i):0.1);limb([L[0],-18,L[0]+Math.sin(a)*5,-10,L[0]+Math.sin(a)*12,-1],5,i<2?"#9a6a3e":"#b07a4a")});
  ctx.save();ctx.translate(25,-28);ctx.rotate(-0.6+0.5*s(u));limb([0,0,8,-8,6,-16],4.5,"#b07a4a");ctx.restore(); // tail wag
  part(E(4,-26,24,12),"#b07a4a",function(){ctx.fillStyle="#7d4f2a";ctx.beginPath();ctx.ellipse(10,-32,9,6,0.3,0,7);ctx.fill()},[-18,-38,28,-14]);
  ctx.save();ctx.translate(-20,-36);ctx.rotate(0.08*s(u));
  part(E(0,0,16.5,14.5),"#b07a4a",null,[-12,-12,12,12]);part(E(-13,5,9.5,7),"#e3b98a");part(E(-21,2,3.6,3),INK);
  ctx.save();ctx.translate(8,-10);ctx.rotate(0.5+0.4*s(u-1.4));part(E(4,6,4.5,9,0.3),"#7d4f2a");ctx.restore(); // floppy ear lags
  ctx.beginPath();ctx.arc(-4,-3,2.4,0,7);ctx.fillStyle=INK;ctx.fill();ctx.beginPath();ctx.arc(-3.3,-3.7,0.8,0,7);ctx.fillStyle="#fff";ctx.fill();
  if(!o.mouth)part(E(-9,11,3,5+1.5*s(2*u)),"#ff7a9a");
  if(o.mouth)o.mouth();
  ctx.restore();ctx.restore()}
 MODE="shadow";ctx.save();ctx.translate(3.5/_s,4.5/_s);D();ctx.restore();MODE="draw";D();ctx.restore()}
var LIVERY=null;function drawTaxi(x,y,h,t,o){o=o||{};var n=Math.floor(t*12)%8,u=n/8*Math.PI*2,_s0=h/60,b=1.2*Math.abs(Math.sin(u+(o.ph||0))),sp=o.spin||0;ctx.save();ctx.translate(x,y);
 ctx.fillStyle="rgba(43,27,51,.25)";ctx.beginPath();ctx.ellipse(0,0,h*0.95,h*0.08,0,0,7);ctx.fill();ctx.scale(_s0*(o.flip?-1:1),_s0);_s=_s0;
 ["shadow","draw"].forEach(function(M){MODE=M;ctx.save();if(M==="shadow")ctx.translate(3.5/_s0,4.5/_s0);ctx.save();ctx.translate(0,-b);gspr("tb|"+M+(BEAD.naturalWidth?1:0),-70,-84,140,84,function(){_s=_s0;MODE=M;drawTaxi0(0,0,_s0*60,0,{body:1})});ctx.restore();
  [-36,36].forEach(function(wx){ctx.save();ctx.translate(wx,-8);ctx.rotate(sp);gspr("tw|"+M,-17,-17,34,34,function(){_s=_s0;MODE=M;drawTaxi0(0,0,_s0*60,0,{wheel:1})});ctx.restore()});ctx.restore()});MODE="draw";ctx.restore()}
function drawTaxi0(x,y,h,n,o){var u=0,s=Math.sin;_s=h/60;ctx.save();ctx.translate(x,y);
 ctx.save();var b=1.2*Math.abs(s(u+(o.ph||0)));
 function T(){if(o.body){ctx.save();
  part(function(){ctx.moveTo(-56,-14);ctx.lineTo(-56,-40);ctx.quadraticCurveTo(-54,-56,-36,-58);ctx.lineTo(50,-58);ctx.quadraticCurveTo(58,-58,58,-48);ctx.lineTo(58,-14);ctx.quadraticCurveTo(58,-8,52,-8);ctx.lineTo(-50,-8);ctx.quadraticCurveTo(-56,-8,-56,-14)},"#f6f2e8",function(){
   if(BEAD.complete&&BEAD.naturalWidth){ctx.save();ctx.translate(-60,-30);ctx.scale(0.5,0.5);ctx.fillStyle=beadPat();ctx.fillRect(0,0,240,24);ctx.restore()}else{ctx.fillStyle="#00acc1";ctx.fillRect(-60,-30,120,12)}
   ctx.fillStyle="#f2c230";ctx.fillRect(-60,-17,120,3)},[-56,-58,58,-8]);
  // windows with passengers
  part(function(){ctx.moveTo(-50,-36);ctx.lineTo(-46,-52);ctx.lineTo(-32,-52);ctx.lineTo(-32,-36);ctx.closePath()},"#3d5a78",function(){ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(-46,-52,4,16)});
  for(var i=0;i<4;i++){(function(i){part(RR(-26+i*20,-52,17,15,3),"#3d5a78",function(){ctx.fillStyle=["#86d27f","#f39bbd","#ffab5c","#ffd84a"][i];ctx.beginPath();ctx.arc(-17.5+i*20,-38+Math.abs(s(u+i))*1.5,5.5,0,7);ctx.fill();ctx.fillStyle="rgba(255,255,255,.3)";ctx.fillRect(-25+i*20,-52,3,15)})})(i)}
  part(E(-54,-18,3,3.5),"#ffe066");part(RR(54,-24,4,7,1),"#e23b3b");
  // roof rack + luggage
  inkLine([-30,-58,-30,-62,46,-62,46,-58],2.2);part(RR(-20,-71,22,10,2),"#e8a23a");part(RR(8,-69,16,8,2),"#2f6fd6");
  ctx.restore()}
  if(o.wheel)[0].forEach(function(wx){ctx.save();part(E(0,0,10,10),"#2b2b33");part(E(0,0,5,5),"#c8ccd2",function(){inkLine([-5,0,5,0],1.4);inkLine([0,-5,0,5],1.4)});ctx.restore()})}
 T();ctx.restore()}
// ---- collage UI helpers ----
function beadPat(){return ctx.__bp||(ctx.__bp=ctx.createPattern(BEAD,"repeat-x"))}
var BGC=null,BGX=null,BGKEY="",BGUSE=0,MAINX=null;function cover(n,dim){var i=img(n);if(!i)return false;if(BGC&&ctx===MAINX){BGUSE=1;var k=n+"|"+BGC.width+"|"+BGC.height;if(BGKEY!==k){BGKEY=k;var s=Math.max(BGC.width/i.width,BGC.height/i.height),w=i.width*s,h=i.height*s;BGX.drawImage(i,(BGC.width-w)/2,(BGC.height-h)/2,w,h)}return true}spr("bg|"+n+"|"+Math.round(H),0,0,W,H,function(){var s=Math.max(W/i.width,H/i.height),w=i.width*s,h=i.height*s;ctx.drawImage(i,(W-w)/2,(H-h)/2,w,h)});return true}
function tape(x,y,w,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.fillStyle="rgba(244,232,196,.88)";ctx.beginPath();ctx.moveTo(-w/2,-9);for(var k=0;k<=4;k++)ctx.lineTo(w/2+(k%2?3:-1),-9+k*4.5);ctx.lineTo(-w/2,9);for(k=0;k<=4;k++)ctx.lineTo(-w/2+(k%2?-3:1),9-k*4.5);ctx.fill();ctx.fillStyle="rgba(255,255,255,.25)";ctx.fillRect(-w/2,-9,w,4);ctx.restore()}
var FOK=0;function tbox(s,size){return[(s.length*0.75+1.2)*size,size*2.1]}
function marker(s,x,y,size,col,rot,pop){if(pop!=null&&pop<0.02)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);if(pop!=null)ctx.scale(pop,pop);var b=tbox(s,size);gspr("mk|"+s+"|"+size+"|"+col+"|"+FOK,-b[0]/2,-b[1]/2,b[0],b[1],function(){marker0(s,size,col)});ctx.restore()}
function marker0(s,size,col){ctx.save();ctx.font=size+"px "+FM;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";ctx.lineWidth=size/3;ctx.strokeStyle=CUT;ctx.strokeText(s,0,0);ctx.fillStyle=col||INK;ctx.fillText(s,0,0);ctx.restore()}
// sticker title text: die-cut + ink + fill, optional pop scale
function stxt(s,x,y,size,fill,rot,pop){if(pop!=null&&pop<0.02)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);if(pop!=null)ctx.scale(pop,pop);var b=tbox(s,size);gspr("st|"+s+"|"+size+"|"+fill+"|"+FOK,-b[0]/2,-b[1]/2+2,b[0]+4,b[1]+4,function(){stxt0(s,size,fill)});ctx.restore()}
function stxt0(s,size,fill){ctx.save();ctx.font=size+"px "+FT;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
 ctx.lineWidth=size*0.42;ctx.strokeStyle=SH;ctx.strokeText(s,3,4);ctx.strokeStyle=CUT;ctx.strokeText(s,0,0);ctx.lineWidth=size*0.2;ctx.strokeStyle=INK;ctx.strokeText(s,0,0);ctx.fillStyle=fill||"#fff";ctx.fillText(s,0,0);ctx.restore()}
function scribble(x,y,r,col,t){ctx.save();ctx.beginPath();var j=sq12(t||0)*7;for(var k=0;k<=30;k++){var a=k/30*Math.PI*2.2,r2=r+Math.sin(k*2.3+j)*3;ctx.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2*0.86)}ctx.lineWidth=4.5;ctx.lineCap="round";ctx.strokeStyle=CUT;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=col||"#e53935";ctx.stroke();ctx.restore()}
function arrow(x1,y1,x2,y2,col){ctx.save();ctx.lineCap="round";[[7,CUT],[3.5,col]].forEach(function(L){ctx.lineWidth=L[0];ctx.strokeStyle=L[1];var a=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+x2)/2,(y1+y2)/2-10,x2,y2);ctx.moveTo(x2,y2);ctx.lineTo(x2-13*Math.cos(a-0.5),y2-13*Math.sin(a-0.5));ctx.moveTo(x2,y2);ctx.lineTo(x2-13*Math.cos(a+0.5),y2-13*Math.sin(a+0.5));ctx.stroke()});ctx.restore()}
// torn paper strip (seeded jagged edges)
function tornRect(x,y,w,h,fill,seed,rot){ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);var r=seed||1;function j(){r=(r*9301+49297)%233280;return r/233280}
 ctx.beginPath();ctx.moveTo(-w/2,-h/2);for(var i=0;i<=w;i+=8)ctx.lineTo(-w/2+i,-h/2+j()*4-2);for(i=0;i<=h;i+=8)ctx.lineTo(w/2+j()*4-2,-h/2+i);for(i=w;i>=0;i-=8)ctx.lineTo(-w/2+i,h/2+j()*4-2);for(i=h;i>=0;i-=8)ctx.lineTo(-w/2+j()*4-2,-h/2+i);ctx.closePath();
 ctx.fillStyle=SH;ctx.save();ctx.translate(3,4);ctx.fill();ctx.restore();ctx.fillStyle=fill;ctx.fill();ctx.restore()}
// jagged tear edge path across the screen at height y
function tearPath(y,seed){var r=seed||7;function j(){r=(r*9301+49297)%233280;return r/233280}ctx.beginPath();ctx.moveTo(-20,-20);ctx.lineTo(W+20,-20);ctx.lineTo(W+20,y);for(var x=W+20;x>=-20;x-=12)ctx.lineTo(x,y+j()*14-7);ctx.closePath()}
function speedLines(cx,cy,t,col){ctx.save();ctx.strokeStyle=col||"rgba(255,250,240,.8)";ctx.lineCap="round";for(var i=0;i<22;i++){var a=i/22*Math.PI*2+sq12(t)*0.6,r1=90+(i%3)*25,r2=r1+180;ctx.lineWidth=i%2?3:6;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);ctx.stroke()}ctx.restore()}
function star(x,y,r,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);function p(){ctx.beginPath();for(var i=0;i<10;i++){var rr2=i%2?r*0.45:r,a=i*Math.PI/5-Math.PI/2;ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}ctx.closePath()}ctx.lineJoin="round";p();ctx.lineWidth=7;ctx.strokeStyle=CUT;ctx.stroke();p();ctx.fillStyle="#f2c230";ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=INK;ctx.stroke();ctx.restore()}
function heart(x,y,s,full){ctx.save();ctx.translate(x,y);ctx.scale(s/20,s/20);function p(){ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(-14,-4,-8,-16,0,-8);ctx.bezierCurveTo(8,-16,14,-4,0,6)}
 ctx.lineJoin="round";p();ctx.lineWidth=9;ctx.strokeStyle=CUT;ctx.stroke();p();ctx.fillStyle=full?"#e53935":"#d9cdb8";ctx.fill();ctx.lineWidth=2.6;ctx.strokeStyle=INK;ctx.stroke();if(full){ctx.fillStyle="rgba(255,255,255,.6)";ctx.beginPath();ctx.ellipse(-5,-6,2.5,1.6,-0.6,0,7);ctx.fill()}ctx.restore()}
function confetti(x,y,n,cols){cols=cols||["#e53935","#00acc1","#f2c230","#7b1fa2","#fffaf0","#86d27f"];for(var i=0;i<(n||14);i++)parts.push({x:x,y:y,vx:rnd(-260,260),vy:rnd(-420,-80),l:rnd(0.6,1.1),c:pick(cols),r:rnd(0,6),vr:rnd(-12,12),w:rnd(5,10),h:rnd(3,6),paper:1})}
function bakkie(x,y,who,tilt){ctx.save();ctx.translate(x,y);if(tilt)ctx.rotate(tilt);rr(-30,-52,60,104,12,"#fff");rr(-24,-40,48,26,6,"#4fc3f7");if(who){ctx.save();ctx.beginPath();ctx.rect(-24,-40,48,26);ctx.clip();bean(who,0,-14,18);ctx.restore()}rr(-26,2,52,42,6,"#e0e0e0");ctx.restore()}

// ---------- microgames ----------
// each: name, word, who, death, cap (verb phrase, no subject), dur, timeoutWin, update(dt), draw(t)
var G={},DEF={};
function def(id,meta,make){DEF[id]=meta;G[id]=function(sp){var g=make(sp);for(var k in meta)if(g[k]===undefined)g[k]=meta[k];return g}}
// ---------- v1.0 kit: sticker props, composed scenes, edge danger bands, particle pool, cosmetics ----------
// stk: draw a cached sticker prop (die-cut edge + ink + halftone + baked drop shadow). fn draws in local units with part()/limb().
function stk(key,x,y,s,rot,L,T,w,h,fn,flip){if(s<0.01)return;ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.scale(flip?-s:s,s);var s0=_s,sk=Math.round(s*40);
 gspr("k|"+key+"|"+sk,L-6,T-6,w+18,h+18,function(){_s=s;MODE="shadow";ctx.save();ctx.translate(3.5/s,4.5/s);fn();ctx.restore();MODE="draw";_s=s;fn()});_s=s0;ctx.restore()}
// flat (no shadow) cached piece, e.g. a glow or a scribble frame
function flat(key,x,y,s,rot,L,T,w,h,fn){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.scale(s,s);var s0=_s;gspr("f|"+key+"|"+Math.round(s*40),L,T,w,h,function(){_s=s;MODE="draw";fn()});_s=s0;ctx.restore()}
// composed background: drawn once into the separate bg layer (or cached as a sprite off-screen / in transitions)
var FORCESPR=0;function scene(key,fn){var k=key+"|"+Math.round(H);if(BGC&&ctx===MAINX&&!FORCESPR){BGUSE=1;var kk=k+"|"+BGC.width+"|"+BGC.height;if(BGKEY!==kk){BGKEY=kk;var oc=ctx,s0=_s,M0=MODE;ctx=BGX;var sc=BGC.width/W;ctx.setTransform(sc,0,0,sc,0,0);_s=1;MODE="draw";SPRD=sc;fn();SPRD=1;ctx=oc;_s=s0;MODE=M0}return}
 spr("sc|"+k,0,0,W,H,function(){_s=1;MODE="draw";fn()})}
// scene building blocks
function paper(col,ht){ctx.fillStyle=col;ctx.fillRect(0,0,W,H);if(ht!==false){var hp=htPat();ctx.fillStyle=hp;ctx.fillRect(0,0,W,H)}}
function band(y,h,col,seed){tornRect(-10,y,W+20,h,col,seed||3,0)}
function blob(x,y,rx,ry,col,rot){ctx.save();ctx.fillStyle=SH;ctx.beginPath();ctx.ellipse(x+3,y+4,rx,ry,rot||0,0,7);ctx.fill();ctx.fillStyle=CUT;ctx.beginPath();ctx.ellipse(x,y,rx+4,ry+4,rot||0,0,7);ctx.fill();ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);ctx.fill();ctx.restore()}
function burstBg(c1,c2,cx,cy){ctx.fillStyle=c1;ctx.fillRect(0,0,W,H);ctx.fillStyle=c2;cx=cx==null?180:cx;cy=cy==null?H*0.42:cy;for(var i=0;i<18;i+=2){ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,1200,i*0.349+0.1,(i+1)*0.349+0.1);ctx.fill()}var hp=htPat();ctx.fillStyle=hp;ctx.fillRect(0,0,W,H)}
function confettiDots(seed,cols,n){var r=seed;function j(){r=(r*9301+49297)%233280;return r/233280}for(var i=0;i<(n||26);i++){ctx.save();ctx.translate(j()*W,j()*H);ctx.rotate(j()*6);ctx.fillStyle=cols[i%cols.length];ctx.globalAlpha=0.55;ctx.fillRect(-4,-2,8,4);ctx.restore()}ctx.globalAlpha=1}
function beadStrip(y,sc){if(!(BEAD.complete&&BEAD.naturalWidth))return;ctx.save();ctx.translate(0,y);ctx.scale(sc||0.5,sc||0.5);ctx.fillStyle=beadPat();ctx.fillRect(0,0,W/(sc||0.5)+48,24);ctx.restore()}
function sceneLabel(s,x,y,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);marker0(s,15,col||INK);ctx.restore()}
// red danger edge bands (cheap: four thin strips, no full-screen fill)
function danger(k,t){if(k<=0.01)return;var a=clamp(k,0,1)*(0.55+0.45*Math.sin((t||CLK)*18)),d=10+14*k;ctx.save();ctx.globalAlpha=a;ctx.fillStyle="#e53935";ctx.fillRect(0,0,W,d);ctx.fillRect(0,H-d,W,d);ctx.fillRect(0,d,d,H-2*d);ctx.fillRect(W-d,d,d,H-2*d);
 ctx.globalAlpha=a*0.5;ctx.fillRect(0,d,W,6);ctx.fillRect(0,H-d-6,W,6);ctx.fillRect(d,d,6,H-2*d);ctx.fillRect(W-d-6,d,6,H-2*d);ctx.restore()}
// pre-rendered focal halo + scribble ring (6-frame stop-motion cycle)
function halo(x,y,r,col,t){var n=Math.floor((t||0)*12)%6;flat("halo|"+Math.round(r)+"|"+col+"|"+n,x,y,1,0,-r-10,-r-10,2*r+20,2*r+20,function(){ctx.fillStyle="rgba(255,250,240,.55)";ctx.beginPath();ctx.ellipse(0,0,r*0.93,r*0.82,0,0,7);ctx.fill();scribble(0,0,r,col,n*0.37)})}
// gesture hint: a paper hand that taps / holds / swipes
function hand(x,y,t,kind,rot){var k=kind||"tap",p=(t*1.6)%1,dx=0,dy=0,sq=1;if(k==="tap"){dy=-Math.max(0,Math.sin(p*Math.PI*2))*10;sq=p<0.5?1:0.92}else if(k==="swipe"){dx=-40+80*easeInOut(p)}else if(k==="drag"){dx=Math.sin(t*3)*50}else if(k==="circle"){dx=Math.cos(t*6)*28;dy=Math.sin(t*6)*22}else if(k==="hold"){sq=0.94}
 if((k==="tap"&&p>0.5)||k==="hold"){ctx.save();ctx.globalAlpha=0.6;ctx.strokeStyle=CUT;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+dx-6,y+dy-22,12+(k==="hold"?Math.sin(t*10)*3:(p-0.5)*30),0,7);ctx.stroke();ctx.restore()}
 stk("hand",x+dx,y+dy,sq,rot||-0.25,-16,-34,34,58,function(){part(function(){ctx.moveTo(-6,-26);ctx.quadraticCurveTo(-6,-32,-1,-32);ctx.quadraticCurveTo(4,-32,4,-26);ctx.lineTo(4,-8);ctx.lineTo(10,-6);ctx.quadraticCurveTo(15,-3,14,4);ctx.lineTo(12,16);ctx.quadraticCurveTo(9,22,0,22);ctx.lineTo(-6,22);ctx.quadraticCurveTo(-13,20,-13,12);ctx.lineTo(-13,-2);ctx.quadraticCurveTo(-12,-7,-6,-6);ctx.closePath()},"#fbe3c8",null,[-13,-30,14,22])})}
// particle pool (no per-frame allocation once warm)
var POOL=[],PMAX=90;function pnew(){var p=POOL.pop()||{};if(parts.length>=PMAX){var o=parts.shift();POOL.push(o)}parts.push(p);return p}
burst=function(x,y,col,n){for(var i=0;i<(n||10);i++){var p=pnew();p.x=x;p.y=y;p.vx=frnd(-220,220);p.vy=frnd(-300,20);p.l=frnd(0.4,0.65);p.c=col;p.r=frnd(0,6);p.vr=frnd(-14,14);p.w=frnd(6,11);p.h=frnd(4,7);p.paper=1;p.g=600}};
confetti=function(x,y,n,cols){cols=cols||["#e53935","#00acc1","#f2c230","#7b1fa2","#fffaf0","#86d27f"];if(SET.rm)n=Math.ceil((n||14)/3);for(var i=0;i<(n||14);i++){var p=pnew();p.x=x;p.y=y;p.vx=frnd(-260,260);p.vy=frnd(-420,-80);p.l=frnd(0.6,1.1);p.c=cols[i%cols.length];p.r=frnd(0,6);p.vr=frnd(-12,12);p.w=frnd(5,10);p.h=frnd(3,6);p.paper=1;p.g=600}};
function drops(x,y,col,n,up){for(var i=0;i<(n||6);i++){var p=pnew();p.x=x;p.y=y;p.vx=frnd(-140,140);p.vy=frnd(up?-320:-120,up?-120:40);p.l=frnd(0.35,0.6);p.c=col;p.r=0;p.vr=0;p.w=frnd(5,8);p.h=p.w;p.paper=2;p.g=900}}
function stepParts(dt){for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g||600)*dt;p.l-=dt;if(p.paper===1){p.r+=p.vr*dt;p.vx*=0.985}if(p.l<=0){parts.splice(i,1);POOL.push(p)}}}
function drawParts(){for(var i=0;i<parts.length;i++){var p=parts[i];ctx.globalAlpha=clamp(p.l*2.5,0,1);if(p.paper===2){ctx.fillStyle=CUT;ctx.beginPath();ctx.arc(p.x,p.y,p.w/2+1.5,0,7);ctx.fill();ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.w/2,0,7);ctx.fill()}else{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=CUT;ctx.fillRect(-p.w/2-1.5,-p.h/2-1.5,p.w+3,p.h+3);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()}}ctx.globalAlpha=1}
// counters / labels
function counter(n,need,x,y,col){stxt(n+"/"+need,x==null?W-40:x,y==null?78:y,26,col||"#f2c230",0.05)}
function bubble(s,x,y,w,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);gspr("bb|"+s+"|"+w+"|"+FOK+"|"+(col||""),-w/2-10,-30,w+20,64,function(){ctx.fillStyle=SH;ctx.beginPath();ctx.ellipse(3,4,w/2,20,0,0,7);ctx.fill();ctx.fillStyle=CUT;ctx.beginPath();ctx.ellipse(0,0,w/2+3,23,0,0,7);ctx.moveTo(-8,18);ctx.lineTo(-16,32);ctx.lineTo(4,20);ctx.fill();ctx.fillStyle=col||"#fff";ctx.beginPath();ctx.ellipse(0,0,w/2,20,0,0,7);ctx.fill();ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.stroke();ctx.font="14px "+FT;ctx.fillStyle=INK;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(s,0,1)});ctx.restore()}
// ---- cosmetics: hats (cosmetic only, unlocked by playing) ----
var HATS={
 none:{name:"No hat",need:null},
 beanie:{name:"Bead beanie",need:["tot",10],txt:"Survive 10 microgames in total"},
 shades:{name:"Stoep shades",need:["dead",5],txt:"Collect 5 ways to go"},
 sunhat:{name:"Straw sunhat",need:["tot",40],txt:"Survive 40 microgames in total"},
 crown:{name:"Paper crown",need:["best",12],txt:"Score 12 in one run"},
 chef:{name:"Braai chef hat",need:["daily",1],txt:"Finish a daily challenge"},
 flowers:{name:"Flower crown",need:["dead",12],txt:"Collect 12 ways to go"},
 bucket:{name:"Bucket hat",need:["tot",100],txt:"Survive 100 microgames in total"},
 party:{name:"Party hat",need:["dead",24],txt:"Collect all 24 ways to go"}};
var OUT=LS.get("out",{});
function hatUnlocked(h){var n=HATS[h].need;if(!n)return true;var v=n[0]==="dead"?Object.keys(LS.get("dead",{})).length:LS.get(n[0],0);return v>=n[1]}
function hatDraw(h){if(!h||h==="none")return;
 if(h==="beanie"){part(function(){ctx.moveTo(-24,-92);ctx.quadraticCurveTo(-24,-122,0,-122);ctx.quadraticCurveTo(24,-122,24,-92);ctx.closePath()},"#e53935",function(){ctx.fillStyle="#f2c230";ctx.fillRect(-30,-104,60,4);ctx.fillStyle="#00acc1";for(var i=-3;i<=3;i++)ctx.fillRect(i*7-2,-111,4,4)},[-24,-122,24,-92]);part(RR(-26,-98,52,9,4),"#fbf6ea");part(E(0,-124,6,6),"#f2c230")}
 if(h==="shades"){[-1,1].forEach(function(s){part(RR(s*8.5-8,-89,16,11,4),"#2b1b33",function(){ctx.fillStyle="rgba(255,255,255,.4)";ctx.fillRect(s*8.5-6,-88,4,3)})});inkLine([-1,-85,1,-85],2.5);inkLine([-16,-86,-24,-88],2.5);inkLine([16,-86,24,-88],2.5)}
 if(h==="sunhat"){part(E(0,-98,38,9),"#e8c46a",function(){ctx.strokeStyle="rgba(122,74,42,.4)";ctx.lineWidth=1;for(var i=-36;i<36;i+=5){ctx.beginPath();ctx.moveTo(i,-106);ctx.lineTo(i+3,-90);ctx.stroke()}});part(function(){ctx.moveTo(-17,-99);ctx.quadraticCurveTo(-16,-120,0,-120);ctx.quadraticCurveTo(16,-120,17,-99);ctx.closePath()},"#e8c46a",function(){ctx.fillStyle="#e53977";ctx.fillRect(-18,-106,36,5)})}
 if(h==="crown"){part(function(){ctx.moveTo(-20,-98);ctx.lineTo(-22,-122);ctx.lineTo(-11,-110);ctx.lineTo(0,-126);ctx.lineTo(11,-110);ctx.lineTo(22,-122);ctx.lineTo(20,-98);ctx.closePath()},"#f2c230",function(){ctx.fillStyle="#e53935";ctx.beginPath();ctx.arc(0,-106,3,0,7);ctx.fill();ctx.fillStyle="#00acc1";ctx.beginPath();ctx.arc(-12,-104,2.5,0,7);ctx.arc(12,-104,2.5,0,7);ctx.fill()})}
 if(h==="chef"){part(function(){ctx.moveTo(-15,-98);ctx.lineTo(-17,-112);ctx.quadraticCurveTo(-30,-118,-20,-130);ctx.quadraticCurveTo(-12,-140,0,-134);ctx.quadraticCurveTo(12,-140,20,-130);ctx.quadraticCurveTo(30,-118,17,-112);ctx.lineTo(15,-98);ctx.closePath()},"#fffdf7",function(){inkLine([-15,-104,15,-104],1.4,"rgba(43,27,51,.4)")})}
 if(h==="flowers"){["#e53977","#f2c230","#fbf6ea","#00acc1","#e53977"].forEach(function(c,i){var a=-2.6+i*0.4,x=Math.cos(a)*24,y=-86+Math.sin(a)*24;part(E(x,y,6,6),c,function(){ctx.fillStyle="#f2a23a";ctx.beginPath();ctx.arc(x,y,2.2,0,7);ctx.fill()})})}
 if(h==="bucket"){part(function(){ctx.moveTo(-30,-94);ctx.lineTo(-19,-118);ctx.quadraticCurveTo(0,-124,19,-118);ctx.lineTo(30,-94);ctx.quadraticCurveTo(0,-88,-30,-94)},"#2f6fd6",function(){ctx.fillStyle="#f2c230";for(var i=-3;i<=3;i++){ctx.beginPath();ctx.arc(i*8,-106+(i%2)*5,2.5,0,7);ctx.fill()}})}
 if(h==="party"){part(function(){ctx.moveTo(-14,-101);ctx.lineTo(4,-140);ctx.lineTo(16,-99);ctx.closePath()},"#7b1fa2",function(){ctx.fillStyle="#f2c230";for(var i=0;i<4;i++)ctx.fillRect(-14,-136+i*10,32,3)});part(E(4,-141,5,5),"#f2c230")}}
// ---------- microgames ----------
// def(id, meta, make): meta = name, word, who, cap (verb phrase), dur, timeoutWin, how (gesture hint), hint, dv (death vignette: bg, fg, title, col, sub)
var G={},DEF={};
function def(id,meta,make){DEF[id]=meta;G[id]=function(sp){var g=make(sp);g.t=g.t||0;for(var k in meta)if(g[k]===undefined)g[k]=meta[k];return g}}
var DG=0.6; // death ground line (fraction of H)
function dBurst(c1,c2,ground){return function(){burstBg(c1,c2,180,H*0.36);if(ground)band(H*DG-10,H*0.5,ground,7)}}
// ---- shared sticker props ----
function coneP(x,y,s,r){stk("cone",x,y,s,r||0,-22,-40,44,56,function(){part(RR(-20,6,40,8,3),"#e8571e");part(function(){ctx.moveTo(-14,8);ctx.lineTo(-4,-34);ctx.lineTo(4,-34);ctx.lineTo(14,8);ctx.closePath()},"#ff7a2a",function(){ctx.fillStyle="#fffaf0";ctx.fillRect(-20,-16,40,7);ctx.fillRect(-20,-2,40,5)},[-14,-34,14,8])})}
function pholeP(x,y,s){stk("phole",x,y,s,0,-42,-24,84,46,function(){part(function(){ctx.moveTo(-36,0);ctx.quadraticCurveTo(-34,-20,-6,-19);ctx.quadraticCurveTo(22,-22,36,-6);ctx.quadraticCurveTo(40,14,10,18);ctx.quadraticCurveTo(-30,22,-36,0)},"#4a4450",function(){ctx.fillStyle="#1e1a22";ctx.beginPath();ctx.ellipse(2,3,27,12,0,0,7);ctx.fill();ctx.fillStyle="rgba(255,255,255,.12)";ctx.beginPath();ctx.ellipse(-4,-4,12,3,0,0,7);ctx.fill()})})}
function goatP(x,y,s,flip,n){var k=n||0;stk("goat"+k,x,y,s,0,-46,-50,90,70,function(){[[-16,0.2],[-9,-0.2],[13,0.2],[20,-0.2]].forEach(function(L,i){var a=k?(i%2?0.35:-0.35):0;limb([L[0],-6,L[0]+a*8,4,L[0]+a*14,14],4.2,"#f4efe3")});
 part(E(2,-12,26,13),"#f4efe3",function(){ctx.fillStyle="#cfc2a8";ctx.beginPath();ctx.ellipse(10,-6,11,6,0,0,7);ctx.fill()},[-24,-25,28,1]);limb([26,-16,32,-22,30,-28],3,"#f4efe3");
 ctx.save();ctx.translate(-24,-24);ctx.rotate(-0.2);inkLine([-2,-8,-8,-20,-2,-24],3.4,"#8a6a4a");part(E(-6,0,11,9),"#f4efe3",function(){ctx.fillStyle="#f6c9c0";ctx.beginPath();ctx.ellipse(-14,4,4,3,0,0,7);ctx.fill()});part(E(5,-4,6,3,0.6),"#e8dcc4");
 ctx.beginPath();ctx.arc(-6,-2,2,0,7);ctx.fillStyle=INK;ctx.fill();inkLine([-10,8,-12,14],2.2,"#cfc2a8");ctx.restore()},flip)}
function bakkieTop(x,y,s,tilt,who){stk("bkt"+(who||""),x,y,s,tilt,-34,-58,68,116,function(){[[-31,-36],[23,-36],[-31,20],[23,20]].forEach(function(w){part(RR(w[0],w[1],8,18,3),"#2b2b33")});
 part(RR(-26,-54,52,108,12),"#fbf6ea",function(){ctx.fillStyle="#e53935";ctx.fillRect(-26,-4,52,4)},[-26,-54,26,54]);part(RR(-20,-44,40,15,5),"#7fb8e0",function(){ctx.fillStyle="rgba(255,255,255,.5)";ctx.fillRect(-16,-42,6,11)});
 var L=LOOK[who||"boet"];part(E(0,-16,10,10),L.skin,function(){ctx.fillStyle=L.hc;ctx.beginPath();ctx.ellipse(0,-20,10,6,0,0,7);ctx.fill()});
 part(RR(-20,6,40,42,4),"#d8cdb6",function(){ctx.strokeStyle="rgba(43,27,51,.22)";ctx.lineWidth=2;for(var i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-20,14+i*9);ctx.lineTo(20,14+i*9);ctx.stroke()}});part(RR(-13,12,14,12,2),"#e8a23a");part(RR(3,28,13,11,2),"#2f6fd6")})}
function bakkieSide(x,y,s,rot,who,mud){stk("bks"+(who||"")+(mud||0),x,y,s,rot||0,-78,-74,156,96,function(){
 part(function(){ctx.moveTo(-72,-6);ctx.lineTo(-72,-30);ctx.lineTo(-12,-30);ctx.lineTo(0,-60);ctx.quadraticCurveTo(4,-64,10,-64);ctx.lineTo(40,-64);ctx.quadraticCurveTo(52,-62,58,-34);ctx.lineTo(72,-30);ctx.quadraticCurveTo(76,-26,74,-8);ctx.quadraticCurveTo(72,-2,66,-2);ctx.lineTo(-66,-2);ctx.quadraticCurveTo(-72,-2,-72,-6)},"#fbf6ea",function(){ctx.fillStyle="#e53935";ctx.fillRect(-80,-22,160,5);if(mud){ctx.fillStyle="#6d4c32";ctx.beginPath();ctx.moveTo(-80,-12);for(var i=-80;i<=80;i+=10)ctx.lineTo(i,-14-((i*7)%9));ctx.lineTo(80,4);ctx.lineTo(-80,4);ctx.fill()}},[-72,-64,74,-2]);
 part(function(){ctx.moveTo(6,-34);ctx.lineTo(12,-56);ctx.lineTo(38,-56);ctx.quadraticCurveTo(46,-54,50,-34);ctx.closePath()},"#7fb8e0",function(){if(who){var L=LOOK[who];ctx.fillStyle=L.skin;ctx.beginPath();ctx.arc(28,-36,10,0,7);ctx.fill();ctx.fillStyle=L.hc;ctx.beginPath();ctx.arc(28,-46,7,0,7);ctx.fill()}ctx.fillStyle="rgba(255,255,255,.45)";ctx.fillRect(14,-55,5,20)});
 part(RR(-64,-46,20,16,2),"#e8a23a");part(RR(-40,-42,18,12,2),"#2f6fd6");part(E(70,-20,3,4),"#ffe066");
 [-44,44].forEach(function(wx){part(E(wx,-2,15,15),"#2b2b33",function(){ctx.fillStyle="#c8ccd2";ctx.beginPath();ctx.arc(wx,-2,6,0,7);ctx.fill()})})})}
function spadeP(x,y,s,r){stk("spade",x,y,s,r||0,-12,-70,24,96,function(){limb([0,-66,0,-30,0,4],4.5,"#a8743a");part(RR(-7,-70,14,7,3),"#7a4a2a");part(function(){ctx.moveTo(-11,2);ctx.lineTo(11,2);ctx.lineTo(10,18);ctx.quadraticCurveTo(0,28,-10,18);ctx.closePath()},"#c8ccd2",null,[-11,2,11,24])})}
function vetkoekP(x,y,s,r){stk("vetk",x,y,s,r||0,-22,-16,44,30,function(){part(E(0,0,19,12),"#d99a4e",function(){ctx.fillStyle="#b9702e";ctx.beginPath();ctx.ellipse(4,4,13,6,0,0,7);ctx.fill();ctx.fillStyle="rgba(255,255,255,.35)";ctx.beginPath();ctx.ellipse(-6,-5,7,3,-0.2,0,7);ctx.fill()},[-19,-12,19,12]);part(function(){ctx.moveTo(-14,-2);ctx.quadraticCurveTo(0,6,14,-2);ctx.lineTo(13,2);ctx.quadraticCurveTo(0,10,-13,2);ctx.closePath()},"#8a3a2a")})}
function coinP(x,y,s,k){stk("coin"+(k||0),x,y,s,0,-16,-16,32,32,function(){part(E(0,0,13,13),k?"#c8ccd2":"#f2c230",function(){ctx.strokeStyle="rgba(43,27,51,.3)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,9,0,7);ctx.stroke();ctx.fillStyle="rgba(43,27,51,.55)";ctx.font="11px "+FT;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(k?"R2":"R5",0,1)},[-13,-13,13,13])})}
function buttonP(x,y,s){stk("btn",x,y,s,0,-16,-16,32,32,function(){part(E(0,0,12,12),"#e53977",function(){ctx.fillStyle="rgba(43,27,51,.5)";[[-4,-4],[4,-4],[-4,4],[4,4]].forEach(function(q){ctx.beginPath();ctx.arc(q[0],q[1],2,0,7);ctx.fill()})},[-12,-12,12,12])})}
function bolt(x,y,s,r){stk("bolt",x,y,s,r||0,-16,-30,32,60,function(){part(function(){ctx.moveTo(4,-28);ctx.lineTo(-12,4);ctx.lineTo(0,4);ctx.lineTo(-6,28);ctx.lineTo(14,-6);ctx.lineTo(2,-6);ctx.closePath()},"#f2c230",null,[-12,-28,14,28])})}
function plugP(x,y,s,r){stk("plug",x,y,s,r||0,-16,-14,32,52,function(){inkLine([-5,-10,-5,-2],3.2,"#c8ccd2");inkLine([5,-10,5,-2],3.2,"#c8ccd2");part(RR(-11,-3,22,18,4),"#fbf6ea");limb([0,15,4,26,0,36],4,"#fbf6ea")})}
function chipsP(x,y,s,r){stk("chips",x,y,s,r||0,-26,-34,52,68,function(){part(function(){ctx.moveTo(-20,-28);ctx.lineTo(20,-28);ctx.lineTo(23,28);ctx.lineTo(-23,28);ctx.closePath()},"#e53977",function(){ctx.fillStyle="#f2c230";ctx.beginPath();ctx.arc(0,2,14,0,7);ctx.fill();ctx.fillStyle="#ff9a3c";for(var i=0;i<4;i++){ctx.save();ctx.translate(-6+i*4,0+(i%2)*4);ctx.rotate(i);ctx.fillRect(-5,-2,10,4);ctx.restore()}ctx.fillStyle="#fffaf0";ctx.fillRect(-24,-28,48,6);ctx.fillRect(-24,22,48,6)},[-23,-28,23,28]);if(MODE!=="shadow"){ctx.save();ctx.translate(0,-16);ctx.rotate(-0.05);marker0("CHIPPIES",8,"#fffaf0");ctx.restore()}})}
function rugbyP(x,y,s,r){stk("rugby",x,y,s,r||0,-26,-17,52,34,function(){part(E(0,0,23,13),"#a8643a",function(){inkLine([-9,0,9,0],1.8,"#fffaf0");for(var i=-2;i<=2;i++)inkLine([i*3.5,-3,i*3.5,3],1.4,"#fffaf0");ctx.strokeStyle="rgba(43,27,51,.35)";ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(0,0,13,12,0,-1.2,1.2);ctx.stroke()},[-23,-13,23,13])})}
function biltongP(x,y,s,r){stk("bilt",x,y,s,r||0,-14,-44,28,88,function(){part(function(){ctx.moveTo(-8,-38);ctx.quadraticCurveTo(-12,0,-6,38);ctx.lineTo(6,38);ctx.quadraticCurveTo(12,0,8,-38);ctx.closePath()},"#8a3a2a",function(){ctx.fillStyle="rgba(255,255,255,.18)";ctx.fillRect(-4,-36,3,70);ctx.fillStyle="rgba(250,230,200,.5)";for(var i=0;i<6;i++){ctx.beginPath();ctx.arc(-3+(i%2)*6,-28+i*11,1.5,0,7);ctx.fill()}},[-10,-38,10,38]);inkLine([0,-38,0,-44],2,INK)})}
function lollyP(x,y,s,r){stk("lolly",x,y,s,r||0,-18,-46,36,80,function(){part(RR(-3,14,6,22,2),"#e8c99a");part(function(){ctx.moveTo(-14,16);ctx.lineTo(-14,-30);ctx.quadraticCurveTo(-14,-42,0,-42);ctx.quadraticCurveTo(14,-42,14,-30);ctx.lineTo(14,16);ctx.closePath()},"#ff6fa3",function(){ctx.fillStyle="#ffd84a";ctx.fillRect(-16,-10,32,10);ctx.fillStyle="#7fd3f0";ctx.fillRect(-16,0,32,16);ctx.fillStyle="rgba(255,255,255,.6)";ctx.fillRect(-9,-36,4,40)},[-14,-42,14,16])})}
function kettleP(x,y,s,r,lid){stk("kettle"+(lid?1:0),x,y,s,r||0,-34,-58,68,66,function(){part(function(){ctx.moveTo(16,-30);ctx.quadraticCurveTo(30,-28,34,-44);ctx.lineTo(30,-46);ctx.quadraticCurveTo(26,-36,16,-38);ctx.closePath()},"#c8ccd2");part(function(){ctx.moveTo(-20,0);ctx.lineTo(-16,-40);ctx.quadraticCurveTo(0,-48,16,-40);ctx.lineTo(20,0);ctx.closePath()},"#e53935",function(){ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(-12,-36,4,30)},[-20,-46,20,0]);if(!lid){part(E(0,-44,10,4),"#c8ccd2");part(E(0,-50,4,3),INK)}ctx.beginPath();ctx.arc(-22,-22,12,1.5,4.7);ctx.lineWidth=4/_s;ctx.strokeStyle=MODE==="shadow"?SH:INK;ctx.stroke()})}
function saltP(x,y,s,r){stk("salt",x,y,s,r||0,-16,-34,32,64,function(){part(function(){ctx.moveTo(-11,26);ctx.lineTo(-13,-14);ctx.quadraticCurveTo(-12,-26,0,-28);ctx.quadraticCurveTo(12,-26,13,-14);ctx.lineTo(11,26);ctx.closePath()},"#f4f1f6",function(){ctx.fillStyle="#2f6fd6";ctx.fillRect(-14,0,28,10);ctx.fillStyle=INK;[[-4,-20],[3,-22],[0,-16]].forEach(function(q){ctx.beginPath();ctx.arc(q[0],q[1],1.4,0,7);ctx.fill()})},[-13,-28,13,26])})}
function potP(x,y,s,pile){stk("pot"+(pile||0),x,y,s,0,-70,-50,140,80,function(){part(RR(-74,-26,14,8,3),"#555b66");part(RR(60,-26,14,8,3),"#555b66");part(function(){ctx.moveTo(-60,-30);ctx.lineTo(60,-30);ctx.lineTo(54,20);ctx.quadraticCurveTo(0,30,-54,20);ctx.closePath()},"#7a8290",function(){ctx.fillStyle="rgba(255,255,255,.25)";ctx.fillRect(-50,-24,8,40)},[-60,-30,60,24]);part(E(0,-30,60,10),"#f7f2e2",function(){ctx.fillStyle="#efe6cc";ctx.beginPath();ctx.ellipse(-14,-30,22,4,0,0,7);ctx.fill();if(pile){ctx.fillStyle="#fff";ctx.beginPath();ctx.moveTo(-10*pile-6,-28);ctx.lineTo(0,-30-12*pile);ctx.lineTo(10*pile+6,-28);ctx.fill()}})})}
function umbrellaP(x,y,s,r,inv){stk("umb"+(inv?1:0),x,y,s,r||0,-52,-56,104,104,function(){limb([0,-30,0,10,0,40],3.2,"#2b2b33");ctx.beginPath();ctx.arc(-6,40,6,0,Math.PI);ctx.lineWidth=3.2/_s+2;ctx.strokeStyle=MODE==="shadow"?SH:INK;ctx.stroke();
 part(inv?function(){ctx.moveTo(-46,-50);ctx.quadraticCurveTo(-30,-8,0,-28);ctx.quadraticCurveTo(30,-8,46,-50);ctx.quadraticCurveTo(0,-40,-46,-50)}:function(){ctx.moveTo(-46,-24);ctx.quadraticCurveTo(-44,-56,0,-58);ctx.quadraticCurveTo(44,-56,46,-24);ctx.quadraticCurveTo(34,-30,23,-24);ctx.quadraticCurveTo(12,-30,0,-24);ctx.quadraticCurveTo(-12,-30,-23,-24);ctx.quadraticCurveTo(-34,-30,-46,-24)},"#e53935",function(){ctx.fillStyle="#f2c230";ctx.beginPath();ctx.moveTo(0,-60);ctx.lineTo(-14,-20);ctx.lineTo(14,-20);ctx.fill()},[-46,-58,46,-24])})}
function cloudP(x,y,s,col,k){stk("cloud"+(col||"")+(k||0),x,y,s,0,-70,-36,140,64,function(){part(function(){ctx.moveTo(-60,20);ctx.quadraticCurveTo(-74,0,-50,-6);ctx.quadraticCurveTo(-44,-32,-14,-24);ctx.quadraticCurveTo(4,-40,26,-22);ctx.quadraticCurveTo(56,-26,58,0);ctx.quadraticCurveTo(74,12,56,22);ctx.closePath()},col||"#fbf6ea",function(){ctx.fillStyle="rgba(43,27,51,.12)";ctx.fillRect(-80,8,160,20)},[-70,-34,70,24])})}
function sunP(x,y,s){stk("sun",x,y,s,0,-50,-50,100,100,function(){for(var i=0;i<10;i++){ctx.save();ctx.rotate(i*0.628);part(function(){ctx.moveTo(-6,-30);ctx.lineTo(0,-46);ctx.lineTo(6,-30);ctx.closePath()},"#ffb02e");ctx.restore()}part(E(0,0,30,30),"#f2c230",function(){ctx.fillStyle="rgba(255,255,255,.4)";ctx.beginPath();ctx.ellipse(-10,-12,9,5,-0.5,0,7);ctx.fill()},[-30,-30,30,30])})}
function sauceP(x,y,s,r,open){stk("sauce"+(open?1:0),x,y,s,r||0,-20,-60,40,110,function(){part(function(){ctx.moveTo(-14,40);ctx.lineTo(-15,-8);ctx.quadraticCurveTo(-14,-24,-6,-30);ctx.lineTo(-6,-42);ctx.lineTo(6,-42);ctx.lineTo(6,-30);ctx.quadraticCurveTo(14,-24,15,-8);ctx.lineTo(14,40);ctx.closePath()},"#e23b3b",function(){ctx.fillStyle="#fbf6ea";ctx.fillRect(-16,0,32,20);ctx.fillStyle="#2e8a4a";ctx.beginPath();ctx.arc(0,10,6,0,7);ctx.fill();ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(-10,-20,4,56)},[-15,-42,15,40]);if(!open)part(RR(-8,-52,16,11,3),"#fbf6ea")})}
function rollP(x,y,s,sauce){stk("roll"+(sauce?1:0),x,y,s,0,-60,-24,120,44,function(){part(function(){ctx.moveTo(-56,2);ctx.quadraticCurveTo(-56,-16,-30,-16);ctx.lineTo(30,-16);ctx.quadraticCurveTo(56,-16,56,2);ctx.quadraticCurveTo(56,16,30,16);ctx.lineTo(-30,16);ctx.quadraticCurveTo(-56,16,-56,2)},"#e8b06a",null,[-56,-16,56,16]);part(RR(-50,-8,100,12,6),"#8a3a24",function(){ctx.fillStyle="rgba(255,255,255,.25)";ctx.fillRect(-46,-6,92,3)});if(sauce)part(function(){ctx.moveTo(-40,-8);for(var i=-40;i<=40;i+=10)ctx.quadraticCurveTo(i+5,-16,i+10,-8);ctx.lineTo(40,-4);ctx.lineTo(-40,-4);ctx.closePath()},"#e23b3b")})}
function koekP(x,y,s,r){stk("koek",x,y,s,r||0,-20,-30,40,60,function(){part(function(){ctx.moveTo(-6,-26);ctx.quadraticCurveTo(-16,-10,-10,10);ctx.quadraticCurveTo(-6,24,0,24);ctx.quadraticCurveTo(6,24,10,10);ctx.quadraticCurveTo(16,-10,6,-26);ctx.quadraticCurveTo(0,-30,-6,-26)},"#d9822b",function(){ctx.strokeStyle="#9a4a14";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-26);ctx.quadraticCurveTo(-6,0,0,24);ctx.stroke();ctx.fillStyle="rgba(255,240,180,.55)";ctx.fillRect(-9,-18,3,30)},[-14,-28,14,24])})}
function forkP(x,y,s,r){stk("fork",x,y,s,r||0,-10,-80,20,90,function(){limb([0,-76,0,-40,0,-4],4,"#c8ccd2");[-4,0,4].forEach(function(dx){inkLine([dx,-4,dx,8],2.2,"#c8ccd2")})})}
function bowlP(x,y,s,col){stk("bowl"+(col||""),x,y,s,0,-56,-28,112,52,function(){part(function(){ctx.moveTo(-50,-10);ctx.lineTo(50,-10);ctx.quadraticCurveTo(46,22,0,22);ctx.quadraticCurveTo(-46,22,-50,-10)},"#2f6fd6",function(){ctx.fillStyle="#fbf6ea";ctx.fillRect(-60,0,120,4);ctx.fillStyle="#f2c230";for(var i=-40;i<=40;i+=16){ctx.beginPath();ctx.arc(i,10,3,0,7);ctx.fill()}},[-50,-10,50,22]);part(E(0,-10,50,8),col||"#e8a23a",function(){ctx.fillStyle="rgba(255,255,255,.4)";ctx.beginPath();ctx.ellipse(-16,-12,14,2.5,0,0,7);ctx.fill()})})}
// ===== 1. Pothole Dash =====
def("pothole",{name:"Pothole Dash",word:"DODGE!",who:"boet",cap:"Tried to fix the pothole with a spade and positive thinking",dur:4,timeoutWin:true,how:"drag",hint:"Drag to steer round the potholes",
 dv:{title:"POTHOLED!",col:"#f2c230",sub:"positive thinking!",bg:function(){burstBg("#ffd56b","#ffc94a");band(H*DG-14,H*0.5,"#5d5866",7);pholeP(180,H*DG+10,2.8)},
  fg:function(t){var gy=H*DG,k=easeOutBack(t/0.35);ctx.save();ctx.beginPath();ctx.rect(0,0,W,gy+12);ctx.clip();drawChar("boet",180,gy+100-72*k,170,"dizzy",t,{ground:false});ctx.restore();spadeP(262,gy-24,1.3,0.45+0.06*Math.sin(sq12(t)*6));coneP(64,gy-4,1.3,-0.1);
   for(var i=0;i<3;i++){var a=sq12(t)*4+i*2.09;star(180+Math.cos(a)*44,gy-150+Math.sin(a)*10,10,a)}}}},function(sp){
 var g={cx:180,obs:[],sp0:0.35,road:0,tilt:0};
 g.update=function(dt){g.t+=dt;g.road=(g.road+dt*(300+120*sp))%80;var nx=clamp(g.cx+(ptr.x-g.cx)*Math.min(1,dt*14),60,300);g.tilt=clamp((nx-g.cx)/(dt*900+0.001),-0.35,0.35);g.cx=nx;g.sp0-=dt;
  if(g.sp0<=0){g.sp0=Math.max(0.36,0.66/sp);g.obs.push({x:RNG()<0.4?clamp(g.cx+rnd(-25,25),60,300):rnd(60,300),y:-40,k:pick(["hole","hole","cone","goat"])})}
  g.obs.forEach(function(o){o.y+=dt*(300+120*sp);if(!o.hit&&Math.abs(o.y-(H-150))<44&&Math.abs(o.x-g.cx)<40){g.fail=true;g.ix=o.x;g.iy=o.y;punch(o.x,o.y);sfx("thud")}});g.obs=g.obs.filter(function(o){return o.y<H+60})};
 g.draw=function(){scene("pothole",function(){paper("#86b84a");ctx.fillStyle="rgba(60,110,40,.5)";for(var i=0;i<40;i++){var x=(i*53)%30,y=(i*97)%H;ctx.fillRect(i%2?x:W-30+x%26,y,3,8)}tornRect(28,-20,304,H+40,"#5d5866",4,0);for(var y=0;y<H;y+=28){ctx.fillStyle=(y/28)%2?"#e53935":"#fffaf0";ctx.fillRect(30,y,6,28);ctx.fillRect(324,y,6,28)}ctx.fillStyle="rgba(255,255,255,.06)";for(var k=0;k<60;k++)ctx.fillRect(40+(k*67)%280,(k*131)%H,3,3);sceneLabel("SLOW: POTHOLES",70,90,-1.57,"#fffaf0")});
  ctx.fillStyle="#fffaf0";for(var y=-80+g.road;y<H;y+=80)ctx.fillRect(177,y,6,40);
  g.obs.forEach(function(o){if(o.k==="hole"){pholeP(o.x,o.y,1.1);halo(o.x,o.y,32,"#e53935",g.t);ctx.save();ctx.globalAlpha=0.35;ctx.strokeStyle="#f2c230";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(o.x,o.y,28,12,0,0,7);ctx.stroke();ctx.restore()}else if(o.k==="cone")coneP(o.x,o.y,1);else goatP(o.x,o.y,0.8,o.x>180,Math.floor(g.t*6)%2)});
  bakkieTop(g.cx,H-150,1.05,g.tilt,"boet");if(g.t<1.5)hand(g.cx+50,H-120,g.t,"drag")};
 g.bot=function(B){var best=g.cx,bs=-1e9;for(var c=60;c<=300;c+=8){var m=999,bad=false;g.obs.forEach(function(o){if(o.y>H-470&&o.y<H-100)m=Math.min(m,Math.abs(o.x-c)+(H-150-o.y)*0.08);if(o.y>H-250&&o.y<H-110&&Math.min(c,g.cx)<o.x+46&&Math.max(c,g.cx)>o.x-46)bad=true});var sc=Math.min(m,90)-(bad?200:0)-Math.abs(c-g.cx)*0.05;if(sc>bs){bs=sc;best=c}}B.move(best,H-150)};
 return g});
// ===== 2. Lights Back On =====
function winP(x,y,s,lit){stk("win"+(lit?1:0),x,y,s,0,-30,-34,60,68,function(){part(RR(-26,-30,52,60,4),"#fbf6ea");part(RR(-21,-25,42,50,2),lit?"#ffd84a":"#24305e",function(){if(lit){ctx.fillStyle="#ffb02e";ctx.fillRect(-21,-25,10,50);ctx.fillRect(11,-25,10,50);ctx.fillStyle="rgba(255,255,255,.5)";ctx.beginPath();ctx.arc(0,-6,9,0,7);ctx.fill()}else{ctx.fillStyle="rgba(255,255,255,.12)";ctx.fillRect(-18,-22,6,44)}ctx.fillStyle=lit?"#e8a23a":"#1a2248";ctx.fillRect(-1.5,-25,3,50);ctx.fillRect(-21,-1.5,42,3)});part(RR(-30,28,60,6,2),"#e8a23a")})}
def("lights",{name:"Lights Back On",word:"TAP!",who:"auntie",cap:"Flipped every switch in the house when the power came back",dur:4,timeoutWin:false,how:"tap",hint:"Tap every dark window",
 dv:{title:"ZAP!",col:"#f2c230",sub:"everything ON at once",bg:dBurst("#3b4fd0","#2f3fb8","#24305e"),fg:function(t){var gy=H*DG,tq=sq12(t);for(var i=0;i<9;i++){var a=-Math.PI+i*0.39;ctx.save();ctx.translate(180,gy-150);ctx.rotate(a+Math.PI/2);part(function(){ctx.moveTo(-6,-40);ctx.lineTo(0,-80-((i*7+Math.floor(tq*12))%3)*8);ctx.lineTo(6,-40);ctx.closePath()},"#2b1b33");ctx.restore()}
  drawChar("auntie",180,gy,190,"shock",t,{pop:popK(t)});bolt(70,gy-170,1.4,-0.3+0.1*Math.sin(tq*20));bolt(296,gy-120,1.1,0.4);winP(60,gy-40,0.9,Math.floor(tq*8)%2);winP(300,gy-50,0.9,Math.floor(tq*8+1)%2)}}},function(sp){
 var n=Math.min(6,3+Math.floor(sp*0.8)),g={h:[],left:0,A:actor("auntie")},pos=[[80,0.24],[180,0.21],[280,0.24],[80,0.44],[180,0.41],[280,0.44]];setM(g.A,"panic");
 for(var i=0;i<6;i++){g.h.push({x:pos[i][0],y:pos[i][1]*H,on:i>=n,f:0});if(i<n)g.left++}
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;ptr.taps.forEach(function(p){g.h.forEach(function(h){if(!h.on&&Math.abs(p.x-h.x)<48&&Math.abs(p.y-h.y)<52){h.on=true;h.f=0;g.left--;confetti(h.x,h.y,6,["#ffd84a","#fffaf0"]);sfx("pop",n-g.left);vib(8)}})});g.h.forEach(function(h){h.f+=dt});if(g.left<=0&&!g.done){g.done=true;setM(g.A,"happy")}};
 g.draw=function(){scene("lights",function(){paper("#1c2350");ctx.fillStyle="#fffaf0";for(var i=0;i<30;i++){ctx.globalAlpha=0.4+((i*37)%5)/10;ctx.beginPath();ctx.arc((i*71)%W,(i*43)%(H*0.16),1.6,0,7);ctx.fill()}ctx.globalAlpha=1;blob(306,62,26,26,"#fff3c4");
   [[0,H*0.13,"#e86a4a"],[120,H*0.1,"#2f9fd6"],[240,H*0.13,"#86d27f"]].forEach(function(hh,i){tornRect(hh[0]+6,hh[1]+30,108,H*0.42,hh[2],i+3,0);ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(hh[0]-4,hh[1]+34);ctx.lineTo(hh[0]+60,hh[1]-8);ctx.lineTo(hh[0]+124,hh[1]+34);ctx.fill();ctx.fillStyle="#fffaf0";ctx.fillRect(hh[0]+20,hh[1]+30,80,4)});band(H*0.56,H*0.5,"#3a3f47",5);ctx.fillStyle="#e8a23a";ctx.fillRect(0,H*0.56+6,W,4)});
  g.h.forEach(function(h,i){if(i>=n)return;var k=h.on?popK(h.f):1;winP(h.x,h.y,k*(h.on?1:1+0.04*Math.sin(g.t*8+i)),h.on);if(!h.on&&g.t%1.2<0.6&&i===g.h.findIndex(function(q){return!q.on}))hand(h.x+18,h.y+40,g.t,"tap")});
  drawChar("auntie",180,H-70,170,"calm",g.t,{actor:g.A});counter(n-g.left,n)};
 g.bot=function(B){if(g.t%0.25<0.02)for(var i=0;i<n;i++)if(!g.h[i].on){B.tap(g.h[i].x,g.h[i].y);break}};
 return g});
// ===== 3. Shut Up Uncle =====
def("uncle",{name:"Shut Up Uncle",word:"FEED!",who:"tannie",cap:"Asked Uncle Fanie a question at the wedding",dur:4.5,timeoutWin:false,how:"tap",hint:"Tap Uncle Fanie to pop a vetkoek in",
 dv:{title:"ZZZ...",col:"#86d27f",sub:"...and ANOTHER thing...",bg:dBurst("#f7c9d8","#f2b6c9","#a86a4a"),fg:function(t){var gy=H*DG;drawChar("uncle",270,gy-30,150,"panic",t,{flip:true});bubble("...and in 1987...",244,gy-200,150,0.05);drawChar("tannie",130,gy+4,190,"sleep",t,{pop:popK(t)});
  for(var i=0;i<3;i++){var p=((t*0.6+i/3)%1);stxt("Z",100-p*30,gy-200-p*110,18+p*22,"#86d27f",-0.2,1)}}}},function(sp){
 var g={need:Math.min(4,2+Math.floor(sp*0.7)),got:0,u:null,sp0:0.15,U:actor("uncle")},spots=[[78,0.36],[180,0.3],[282,0.36]];
 g.update=function(dt){g.t+=dt;g.U.mt+=dt;g.sp0-=dt;if(!g.u&&g.sp0<=0){var s=pick(spots.filter(function(q){return!g.last||q!==g.last}));g.last=s;g.u={s:s,l:1.5/Math.sqrt(sp),L:1.5/Math.sqrt(sp),fed:0,a:0};setM(g.U,"panic")}
  if(g.u){var u=g.u,y=u.s[1]*H;u.a+=dt;ptr.taps.forEach(function(p){if(!u.fed&&Math.abs(p.x-u.s[0])<58&&p.y>y-170&&p.y<y+20){u.fed=0.22;g.got++;setM(g.U,"chew");confetti(u.s[0],y-110,8);sfx("pop",g.got);vib(10)}});
   if(u.fed){u.fed-=dt;if(u.fed<=0){g.u=null;g.sp0=0.06}}else{u.l-=dt;if(u.l<=0){g.fail=true;g.ix=u.s[0];g.iy=y-100}}}
  if(g.got>=g.need&&!g.done)g.done=true};
 g.draw=function(){scene("uncle",function(){paper("#f6e0c4");for(var i=0;i<9;i++){var x=i*45;ctx.fillStyle=["#e53977","#f2c230","#00acc1"][i%3];ctx.beginPath();ctx.moveTo(x,24);ctx.lineTo(x+40,24);ctx.lineTo(x+20,52);ctx.fill()}inkLine([0,22,W,22],2);
   ctx.fillStyle="rgba(232,162,58,.35)";for(var k=0;k<6;k++)ctx.fillRect(k*64+10,80,30,H*0.5);
   spots.forEach(function(s,i){var y=s[1]*H;tornRect(s[0]-62,y-6,124,64,"#fffaf0",i+9,0);ctx.fillStyle="#e53977";ctx.beginPath();ctx.arc(s[0]-30,y-2,8,0,7);ctx.arc(s[0]+28,y,7,0,7);ctx.fill()});band(H*0.62,H*0.5,"#c98a5a",4)});
  if(g.u){var u=g.u,y=u.s[1]*H,k=easeOutBack(u.a/0.18),f=u.fed>0;ctx.save();ctx.beginPath();ctx.rect(0,0,W,y+2);ctx.clip();drawChar("uncle",u.s[0],y+120-120*k,140,f?"chew":"panic",g.t,{actor:g.U,ground:false});ctx.restore();
   if(!f){bubble("Just a few words...",u.s[0]+(u.s[0]>200?-40:40),y-190,140,u.s[0]>200?0.06:-0.06);ctx.save();ctx.globalAlpha=0.9;ctx.fillStyle="#e53935";ctx.fillRect(u.s[0]-40,y+12,80*(u.l/u.L),6);ctx.restore()}else vetkoekP(u.s[0],y-62,0.9,0.2)}
  if(g.t<1.2&&g.u&&!g.u.fed)hand(g.u.s[0]+30,g.u.s[1]*H-40,g.t,"tap");
  drawChar("tannie",64,H-58,150,g.got>=g.need?"happy":"calm",g.t,{flip:true});vetkoekP(290,H-110,1.5,-0.2);counter(g.got,g.need)};
 g.bot=function(B){if(g.u&&!g.u.fed&&g.u.a>0.07)B.tap(g.u.s[0],g.u.s[1]*H-80)};
 return g});
// ===== 4. Catch the Change =====
def("change",{name:"Catch the Change",word:"CATCH!",who:"gaatjie",cap:"Lent R50 to the cousin 'until Friday'",dur:4.5,timeoutWin:false,how:"drag",hint:"Drag to catch coins. Not the buttons!",
 dv:{title:"BROKE!",col:"#86d27f",sub:"see you Friday, cuz!",bg:dBurst("#c6e8a8","#b4dc92","#7a9a5a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("gaatjie",170,gy,190,"sad",t,{pop:popK(t)});[-1,1].forEach(function(s){stk("pocket",170+s*34,gy-60,1,s*0.2,-14,-6,28,30,function(){part(function(){ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.lineTo(8,18);ctx.quadraticCurveTo(0,24,-8,18);ctx.closePath()},"#fbf6ea")})});
  var mx=240+Math.sin(tq*3)*30,my=gy-180-t*20;stk("moth"+(Math.floor(tq*12)%2),mx,my,1,0,-20,-14,40,28,function(){var w=Math.floor(tq*12)%2?8:14;part(E(-9,-2,10,w/1.4,-0.4),"#d9cdb8");part(E(9,-2,10,w/1.4,0.4),"#d9cdb8");part(E(0,0,4,8),"#8a7a6a")});
  stk("iou",80,gy-190,1,-0.2+0.05*Math.sin(tq*4),-34,-22,68,44,function(){part(RR(-30,-18,60,36,3),"#fffdf5",function(){ctx.font="18px "+FM;ctx.fillStyle=INK;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("IOU R50",0,0)})})}}},function(sp){
 var g={need:Math.min(5,3+Math.floor(sp*0.6)),got:0,it:[],sp0:0,cx:180,A:actor("gaatjie"),ft:0};
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;g.ft=Math.max(0,g.ft-dt);g.cx=clamp(g.cx+(ptr.x-g.cx)*Math.min(1,dt*16),40,320);g.sp0-=dt;if(g.sp0<=0){g.sp0=0.3/Math.sqrt(sp);g.it.push({x:rnd(40,320),y:-30,c:RNG()<0.28,r:rnd(0,6)})}
  var cy=H-190;g.it.forEach(function(o){o.y+=dt*(220+70*sp);o.r+=dt*4;if(!o.g&&Math.abs(o.y-cy)<30&&Math.abs(o.x-g.cx)<44){o.g=1;if(o.c){g.fail=true;g.ix=o.x;g.iy=o.y}else{g.got++;g.ft=0.15;burst(o.x,o.y,"#f2c230",5);sfx("coin",g.got);vib(6)}}});g.it=g.it.filter(function(o){return!o.g&&o.y<H+40});if(g.got>=g.need&&!g.done){g.done=true;setM(g.A,"happy")}};
 g.draw=function(){scene("change",function(){paper("#f0d79a");tornRect(-10,H*0.08,W+20,H*0.2,"#e8a23a",3,-0.02);for(var i=0;i<4;i++){ctx.fillStyle=["#e53935","#00acc1","#86d27f","#7b1fa2"][i];ctx.fillRect(10+i*88,H*0.1,70,H*0.05)}sceneLabel("TAXI RANK",180,H*0.2,-0.03,"#fffaf0");band(H*0.78,H*0.4,"#9a8a74",6);confettiDots(5,["#e8a23a","#fffaf0"],20)});
  g.it.forEach(function(o){if(o.c)buttonP(o.x,o.y,1.1);else coinP(o.x,o.y,1.1,(o.x|0)%3===0?1:0)});
  drawChar("gaatjie",g.cx,H-60,150,g.ft>0?"happy":"reach",g.t,{actor:g.A,P:{aL:2.6,aR:2.6,bL:-0.3,bR:-0.3}});
  if(g.t<1)hand(g.cx+40,H-120,g.t,"drag");counter(g.got,g.need)};
 g.bot=function(B){var cy=H-190,best=null;g.it.forEach(function(o){if(!o.c&&o.y<cy+10&&(!best||o.y>best.y))best=o});var tx=best?best.x:180;g.it.forEach(function(o){if(o.c&&Math.abs(o.y-cy)<90&&Math.abs(o.x-tx)<50)tx+=tx>o.x?60:-60});B.move(clamp(tx,40,320),H-150)};
 return g});
// ===== 5. Swat the Mozzie =====
function mozzieP(x,y,s,f,dz){stk("moz"+f+(dz?1:0),x,y,s,0,-30,-26,60,50,function(){[-1,1].forEach(function(sd){part(E(sd*10,-10-(f?4:0),12,f?5:7,sd*(f?0.9:0.4)),"rgba(220,240,255,.85)")});inkLine([-6,8,-12,18],1.8);inkLine([0,8,0,20],1.8);inkLine([6,8,12,18],1.8);part(E(4,2,14,7),"#6b5a7a",function(){ctx.fillStyle="#f2c230";ctx.fillRect(4,-6,3,16);ctx.fillRect(10,-6,3,16)});part(E(-12,-2,7,7),"#6b5a7a");inkLine([-18,0,-28,4],2);
 if(dz){inkLine([-15,-5,-11,-1],1.6,"#fff");inkLine([-11,-5,-15,-1],1.6,"#fff")}else{ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(-13,-3,2.4,0,7);ctx.fill();ctx.fillStyle=INK;ctx.beginPath();ctx.arc(-13.5,-3,1.2,0,7);ctx.fill()}})}
function swatP(x,y,s,r){stk("swat",x,y,s,r||0,-28,-30,56,110,function(){limb([0,20,0,50,0,76],4,"#2f6fd6");part(RR(-24,-26,48,48,8),"#00acc1",function(){ctx.strokeStyle="rgba(255,255,255,.45)";ctx.lineWidth=1.5;for(var i=-20;i<24;i+=8){ctx.beginPath();ctx.moveTo(i,-26);ctx.lineTo(i,22);ctx.stroke();ctx.beginPath();ctx.moveTo(-24,i);ctx.lineTo(24,i);ctx.stroke()}})})}
function bedScene(){paper("#2a2e6a");tornRect(210,40,120,150,"#4a56a8",5,0.02);blob(270,100,22,22,"#fff3c4");inkLine([270,40,270,190],3,"#fffaf0");inkLine([210,115,330,115],3,"#fffaf0");tornRect(-20,H*0.55,W+40,H*0.5,"#6a4a8a",8,0);tornRect(20,H*0.5,320,H*0.2,"#f39bbd",6,-0.01);ctx.fillStyle="#fffaf0";for(var i=0;i<8;i++){ctx.beginPath();ctx.arc(46+i*38,H*0.56,8,0,7);ctx.fill()}blob(80,H*0.47,46,24,"#fbf6ea",-0.05)}
def("mozzie",{name:"Swat the Mozzie",word:"SWAT!",who:"gogo",cap:"Slept with the window open in December",dur:3.5,timeoutWin:false,how:"tap",hint:"Tap the mozzie",
 dv:{title:"BZZZT!",col:"#f39bbd",sub:"itchy itchy itchy",bg:dBurst("#c7b8f0","#b8a6ea","#6a4a8a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("gogo",180,gy,200,"panic",t,{pop:popK(t)});
  for(var b=0;b<10;b++){var bx=180+Math.cos(b*2.4)*(18+b*2.4),by=gy-110+Math.sin(b*2.4)*(30+b*4);flat("bump",bx,by,1,0,-8,-8,16,16,function(){ctx.fillStyle="#ff6fa3";ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.fill();ctx.fillStyle="rgba(255,255,255,.6)";ctx.beginPath();ctx.arc(-1.5,-1.5,1.5,0,7);ctx.fill()})}
  for(var i=0;i<3;i++){var a=tq*3+i*2.1;mozzieP(180+Math.cos(a)*120,gy-130+Math.sin(a*1.3)*60,0.9,Math.floor(tq*24+i)%2)}}}},function(sp){
 var g={ph:rnd(0,6),x:180,y:300,sw:[],hit:0,miss:0};
 g.update=function(dt){g.t+=dt;if(g.hit){g.hit+=dt;g.y+=dt*300;return}g.ph+=dt*1.7*Math.sqrt(sp);g.x=180+Math.sin(g.ph*1.3)*125+Math.sin(g.ph*4.1)*14;g.y=H*0.34+Math.sin(g.ph*2.1)*H*0.17+Math.cos(g.ph*5.3)*10;if(Math.floor(g.t*8)!==Math.floor((g.t-dt)*8))sfx("buzz");
  ptr.taps.forEach(function(p){g.sw.push({x:p.x,y:p.y,a:0});if(Math.hypot(p.x-g.x,p.y-g.y)<52){g.hit=0.01;g.done=true;confetti(g.x,g.y,10);sfx("thud");vib(15)}else{g.miss++;sfx("swish")}});g.sw.forEach(function(s){s.a+=dt});g.sw=g.sw.filter(function(s){return s.a<0.25})};
 g.draw=function(){scene("mozzie",bedScene);drawChar("gogo",120,H*0.53,120,"sleep",g.t,{rot:-1.45,ground:false});
  mozzieP(g.x,g.y,1.2,g.hit?0:Math.floor(g.t*24)%2,!!g.hit);if(g.hit){for(var i=0;i<3;i++){var a=g.t*8+i*2.1;star(g.x+Math.cos(a)*22,g.y-24+Math.sin(a)*6,6,a)}}
  g.sw.forEach(function(s){swatP(s.x,s.y,1,-0.6+s.a*3)});if(g.t<1.1)hand(g.x+30,g.y+40,g.t,"tap");if(g.miss)marker("miss!",60,H*0.12,18,"#e53935",-0.1)};
 g.bot=function(B){if(g.t>0.3&&!g.hit&&g.t%0.3<0.02)B.tap(g.x,g.y)};
 return g});
// ===== 6. Save the Chippies (keepy-uppy) =====
function braaiYard(){paper("#9fd3e6");blob(300,70,30,30,"#ffe58a");cloudP?0:0;tornRect(-10,H*0.18,W+20,H*0.25,"#86b84a",2,0.01);for(var i=0;i<12;i++){ctx.fillStyle="#c98a5a";ctx.fillRect(i*32,H*0.2,22,H*0.16);ctx.fillStyle=INK;ctx.fillRect(i*32+8,H*0.2-6,6,6)}band(H*0.4,H*0.7,"#d8c08e",9);confettiDots(2,["#c9ad72","#fffaf0"],24)}
def("snack",{name:"Save the Chippies",word:"KEEP UP!",who:"boet",cap:"Dropped the last packet of chippies at the braai",dur:4,timeoutWin:true,how:"tap",hint:"Tap the packet to keep it in the air",
 dv:{title:"NOOO!",col:"#e53977",sub:"the LAST packet",bg:dBurst("#ffd0a6","#ffc08c","#d8c08e"),fg:function(t){var gy=H*DG;drawChar("boet",170,gy,190,"sad",t,{pop:popK(t)});if(Math.floor(t*12)%3===0){drops(150,gy-150,"#7fd3f0",1,true);drops(190,gy-150,"#7fd3f0",1,true)}chipsP(282,gy-16,1.1,1.45);
  for(var i=0;i<6;i++){stk("crumb",230+i*14,gy-4+(i%2)*6,1,i,-6,-4,12,8,function(){part(E(0,0,5,3),"#ff9a3c")})}}}},function(sp){
 var g={x:rnd(100,260),y:-30,vx:0,vy:120,r:0,need:sp<1.4?2:3,got:0,B:actor("boet"),wait:0.25};setM(g.B,"panic");
 g.update=function(dt){g.t+=dt;g.B.mt+=dt;g.wait-=dt;if(g.wait>0)return;var gr=520*Math.sqrt(sp);g.vy+=gr*dt;g.x+=g.vx*dt;g.y+=g.vy*dt;g.r+=g.vx*dt*0.02;if(g.x<40){g.x=40;g.vx=Math.abs(g.vx)}if(g.x>320){g.x=320;g.vx=-Math.abs(g.vx)}if(g.y<40&&g.vy<0)g.vy*=0.5;
  ptr.taps.forEach(function(p){if(Math.hypot(p.x-g.x,p.y-g.y)<66&&g.vy>-200){g.vy=-rnd(480,560)*Math.sqrt(sp)*0.95;g.vx=clamp((g.x-p.x)*4+rnd(-90,90),-160,160);g.got++;confetti(g.x,g.y+20,6,["#ff9a3c","#f2c230"]);sfx("boing");vib(8);if(g.got>=g.need)setM(g.B,"cheer")}});
  if(g.y>H-150){g.fail=true;g.ix=g.x;g.iy=g.y}};
 g.draw=function(){scene("snack",braaiYard);drawChar("boet",70,H-60,140,"calm",g.t,{actor:g.B});chipsP(g.x,g.y,1.25,g.r);
  ctx.fillStyle="rgba(43,27,51,.2)";var sh=clamp(1-(H-140-g.y)/600,0.2,1);ctx.beginPath();ctx.ellipse(g.x,H-140,30*sh,7*sh,0,0,7);ctx.fill();
  if(g.got<1&&g.wait<=0)hand(g.x+26,g.y+40,g.t,"tap");if(g.y>H*0.5)danger(clamp((g.y-H*0.5)/(H*0.3),0,1),g.t);counter(Math.min(g.got,g.need),g.need)};
 g.bot=function(B){if(g.vy>0&&g.y>H*0.45)B.tap(g.x,g.y)};
 return g});
// ===== 7. Koeksister Dip =====
function kitchen(){paper("#ffe9c9");for(var y=0;y<H*0.62;y+=30)for(var x=(y/30%2)*15;x<W;x+=30){ctx.fillStyle=((x+y)/15)%2?"rgba(0,172,193,.12)":"rgba(255,255,255,.3)";ctx.fillRect(x,y,28,28)}tornRect(-10,H*0.62,W+20,H*0.5,"#c98a5a",4,0);ctx.fillStyle="rgba(43,27,51,.12)";for(var i=0;i<5;i++)ctx.fillRect(0,H*0.66+i*26,W,3)}
def("koeksister",{name:"Koeksister Dip",word:"DIP!",who:"tannie",cap:"Grabbed a koeksister straight out of the syrup",dur:4,timeoutWin:false,how:"tap",hint:"Tap to drop it in the syrup",
 dv:{title:"STICKY!",col:"#e8a23a",sub:"syrup up to the elbows",bg:dBurst("#ffe0a6","#ffd38a","#c98a5a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("tannie",180,gy,190,"shock",t,{pop:popK(t),P:{aL:2.4,aR:2.4,bL:-0.2,bR:-0.2}});koekP(110,gy-200,1.3,-0.5);koekP(250,gy-200,1.3,0.5);koekP(180,gy-40,1,0.1);
  for(var i=0;i<4;i++){var y=gy-170+((tq*80+i*30)%90);flat("drip",100+i*48,y,1,0,-5,-8,10,16,function(){ctx.fillStyle="#e8a23a";ctx.beginPath();ctx.arc(0,3,4,0,7);ctx.moveTo(-3,2);ctx.lineTo(0,-7);ctx.lineTo(3,2);ctx.fill()})}
  var bx=270+Math.cos(tq*4)*40,by=gy-150+Math.sin(tq*6)*20;flat("bee"+(Math.floor(tq*24)%2),bx,by,1,0,-16,-14,32,28,function(){ctx.fillStyle="rgba(220,240,255,.85)";ctx.beginPath();ctx.ellipse(-2,-8,6,Math.floor(tq*24)%2?3:6,0,0,7);ctx.fill();ctx.fillStyle="#f2c230";ctx.beginPath();ctx.ellipse(0,0,10,7,0,0,7);ctx.fill();ctx.fillStyle=INK;ctx.fillRect(-3,-7,3,14);ctx.fillRect(3,-7,3,14)})}}},function(sp){
 var g={a:0,ph:rnd(0,6),bx:180,bph:rnd(0,6),k:null,T:actor("tannie"),hy:H*0.12,L:H*0.22};
 g.update=function(dt){g.t+=dt;g.T.mt+=dt;g.bph+=dt*1.6*Math.sqrt(sp);g.bx=180+Math.sin(g.bph)*(70+18*sp);
  if(!g.k){g.ph+=dt*2.4;g.a=Math.sin(g.ph)*0.6;if(ptr.taps.length&&g.t>0.25){var x=180+Math.sin(g.a)*g.L,y=g.hy+Math.cos(g.a)*g.L;g.k={x:x,y:y,vx:Math.cos(g.ph)*2.4*0.6*g.L*Math.cos(g.a),vy:0,r:g.a};sfx("swish")}}
  else if(!g.k.end){var k=g.k;k.vy+=1500*dt;k.x+=k.vx*dt;k.y+=k.vy*dt;k.r+=dt*2;var by=H*0.62;if(k.y>by-20){if(Math.abs(k.x-g.bx)<50){k.end=1;g.done=true;k.y=by-14;drops(k.x,by-20,"#e8a23a",8,true);sfx("slurp");vib(10);setM(g.T,"happy")}else{k.end=2;g.fail=true;g.ix=k.x;g.iy=by;sfx("splat")}}}};
 g.draw=function(){scene("koek",kitchen);inkLine([150,g.hy-30,210,g.hy-30],5,"#a8743a");
  if(!g.k){var x=180+Math.sin(g.a)*g.L,y=g.hy+Math.cos(g.a)*g.L;inkLine([180,g.hy-30,x,y-26],2,INK);koekP(x,y,1.3,g.a)}else{koekP(g.k.x,g.k.y,1.3,g.k.r)}
  bowlP(g.bx,H*0.62,1.1);drawChar("tannie",300,H-50,150,"calm",g.t,{actor:g.T,flip:true});if(!g.k&&g.t<1.4)hand(110,H*0.42,g.t,"tap");
  if(!g.k){ctx.save();ctx.globalAlpha=0.35;ctx.setLineDash([4,6]);inkLine([g.bx,H*0.62-24,g.bx,H*0.4],2,"#e53935");ctx.restore();ctx.setLineDash([])}};
 g.bot=function(B){if(g.k)return;var x=180+Math.sin(g.a)*g.L,y=g.hy+Math.cos(g.a)*g.L,vx=Math.cos(g.ph)*2.4*0.6*g.L*Math.cos(g.a),tt=Math.sqrt(2*(H*0.62-20-y)/1500),lx=x+vx*tt,bx=180+Math.sin(g.bph+tt*1.6*Math.sqrt(sp))*(70+18*sp);if(Math.abs(lx-bx)<22&&g.t>0.3)B.tap(180,300)};
 return g});
// ===== 8. Rugby duck =====
function fieldScene(){paper("#8fd0ef");blob(60,70,40,16,"#fbf6ea");blob(250,110,50,18,"#fbf6ea");for(var i=0;i<10;i++){ctx.fillStyle=["#e53935","#2f6fd6","#f2c230","#86d27f"][i%4];ctx.fillRect(i*38,H*0.26,30,H*0.08);ctx.fillStyle=INK;ctx.beginPath();ctx.arc(i*38+15,H*0.255,7,0,7);ctx.fill()}
 tornRect(-10,H*0.33,W+20,H*0.75,"#5fb04a",6,0);for(var k=0;k<6;k++){ctx.fillStyle=k%2?"rgba(255,255,255,.08)":"rgba(0,0,0,.05)";ctx.fillRect(0,H*0.33+k*H*0.11,W,H*0.11)}inkLine([300,H*0.12,300,H*0.5],5,"#fffaf0");inkLine([340,H*0.12,340,H*0.5],5,"#fffaf0");inkLine([300,H*0.36,340,H*0.36],5,"#fffaf0");sceneLabel("SCHOOL DERBY",110,H*0.22,-0.04,INK)}
def("rugby",{name:"Duck the Ball",word:"DUCK!",who:"gaatjie",cap:"Stood behind the poles at a school rugby game",dur:4,timeoutWin:true,how:"tap",hint:"Tap to duck when the ball comes",
 dv:{title:"BONK!",col:"#f2c230",sub:"right on the noggin",bg:dBurst("#bfe7a8","#aedd94","#5fb04a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("gaatjie",170,gy,190,"dizzy",t,{pop:popK(t),rot:0.15*Math.sin(tq*5)});
  flat("lump",186,gy-200,1,0,-14,-14,28,28,function(){ctx.fillStyle="#ff6fa3";ctx.beginPath();ctx.arc(0,4,10,Math.PI,0);ctx.fill()});for(var i=0;i<4;i++){var a=tq*5+i*1.57;star(176+Math.cos(a)*46,gy-200+Math.sin(a)*12,9,a)}
  var b=Math.abs(Math.sin(t*5))*80*Math.max(0,1-t*0.3);rugbyP(290,gy-14-b,1.3,t*6)}}},function(sp){
 var g={balls:[],sp0:0.5,dk:0,n:0,max:Math.min(4,2+Math.floor(sp*0.7)),A:actor("gaatjie"),hy:H-60-140};
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;g.dk=Math.max(0,g.dk-dt);setM(g.A,g.dk>0?"duck":"calm");g.sp0-=dt;if(g.sp0<=0&&g.n<g.max){g.n++;g.sp0=rnd(0.7,1.1)/Math.sqrt(sp);g.balls.push({x:W+30,v:300+90*sp,r:0})}
  if(ptr.taps.length&&g.dk<=0.1){g.dk=0.5;sfx("whoosh")}g.balls.forEach(function(b){b.x-=b.v*dt;b.r-=dt*10;if(!b.h&&b.x<200&&b.x>140){if(g.dk>0){b.h=1;sfx("swish")}else{g.fail=true;g.ix=150;g.iy=g.hy;sfx("thud")}}})};
 g.draw=function(){scene("rugby",fieldScene);var near=0;g.balls.forEach(function(b){if(b.x>200)near=Math.max(near,clamp(1-(b.x-200)/240,0,1));rugbyP(b.x,g.hy-(b.h?-20:0),1.2,b.r);if(b.x>W-10)stxt("!",W-26,g.hy-40,34,"#f2c230",0.1)});
  drawChar("gaatjie",160,H-60,160,"calm",g.t,{actor:g.A});danger(near*0.8,g.t);if(g.t<1.5)hand(250,H-110,g.t,"tap")};
 g.bot=function(B){g.balls.forEach(function(b){if(!b.h&&b.x>200&&b.x<200+b.v*0.2)B.tap(180,400)})};
 return g});
// ===== 9. Free Biltong (don't touch) =====
def("fence",{name:"Free Biltong",word:"DON'T TOUCH!",who:"uncle",cap:"Touched the electric fence to grab free biltong",dur:3,timeoutWin:true,how:"none",hint:"Don't tap anything!",
 dv:{title:"FRIZZ!",col:"#00acc1",sub:"it said FREE...",bg:dBurst("#bde8f0","#a6dfea","#5fb04a"),fg:function(t){var gy=H*DG,tq=sq12(t);stk("frizz",180,gy-182,1.6,0.04*Math.sin(tq*30),-60,-50,120,90,function(){part(function(){for(var i=0;i<=18;i++){var a=Math.PI+i/18*Math.PI,r=i%2?40:56;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r*0.8+10)}ctx.closePath()},"#6b4a3a")});
  drawChar("uncle",180,gy,190,"shock",t,{pop:popK(t),rot:0.04*Math.sin(tq*40)});for(var i=0;i<3;i++){var p=(t*0.7+i/3)%1;ctx.globalAlpha=1-p;blob(150+i*30,gy-260-p*60,10+p*10,8+p*8,"#bbb");ctx.globalAlpha=1}bolt(60,gy-140,1.2,-0.4);bolt(300,gy-160,1.2,0.4);biltongP(300,gy-30,1,0.6)}}},function(sp){
 var g={U:actor("uncle"),sp:[]};setM(g.U,"hold");
 g.update=function(dt){g.t+=dt;g.U.mt+=dt;g.urge=(g.urge||0);g.urge=Math.min(1,g.urge+dt*(0.18+0.06*sp));if(ptr.taps.length){g.fail=true;g.ix=180;g.iy=H*0.44;punch(180,H*0.44);sfx("zap");setM(g.U,"shock")}if(Math.floor(g.t*8)!==Math.floor((g.t-dt)*8))sfx("tick");if(g.urge>0.55&&g.U.m==="hold")setM(g.U,"reach");if(g.urge>0.85)setM(g.U,"panic")};
 g.draw=function(){scene("fence",function(){paper("#9fd3e6");tornRect(-10,H*0.3,W+20,H*0.8,"#86b84a",3,0);[40,180,320].forEach(function(x){part0(x,H*0.3,H*0.32)});[0.36,0.44,0.52].forEach(function(f){inkLine([0,H*f,W,H*f],2.2,"#8a8a8a")});
   stk("sign",180,H*0.18,1,-0.04,-90,-40,180,80,function(){part(RR(-80,-30,160,60,6),"#fffaf0",function(){ctx.fillStyle="#e53935";ctx.fillRect(-80,-30,160,10)});if(MODE!=="shadow"){ctx.save();ctx.translate(0,8);marker0("FREE BILTONG",16,"#e53935");ctx.restore()}})});
  for(var i=0;i<3;i++){var x=(g.t*160*(i%2?1:-1)+i*120+600)%W,f=[0.36,0.44,0.52][i];star(x,H*f,6+2*Math.sin(g.t*30),g.t*9)}biltongP(180,H*0.44,1.15+0.05*Math.sin(g.t*4),0.1*Math.sin(g.t*3));halo(180,H*0.44,40+(g.urge||0)*30,"#e53935",g.t);
  ctx.fillStyle=INK;ctx.fillRect(50,H*0.62,260,14);ctx.fillStyle="#e53935";ctx.fillRect(52,H*0.62+2,256*(g.urge||0),10);marker("TEMPTATION",180,H*0.62+30,14,INK,0);
  drawChar("uncle",180,H-58,165,(g.urge||0)>0.85?"panic":(g.urge||0)>0.55?"reach":"hold",g.t,{actor:g.U,rot:0.03*Math.sin(g.t*16),P:{aR:0.3+(g.urge||0)*1.4,bR:0.2}});danger(clamp(((g.urge||0)-0.5)*2,0,1),g.t);marker((g.urge||0)>0.7?"DON'T!":"hands off...",180,H*0.78,20,(g.urge||0)>0.7?"#e53935":INK,-0.04)};
 g.bot=function(B){};
 return g});
function part0(x,y,h){ctx.fillStyle="#a8743a";ctx.fillRect(x-5,y,10,h);ctx.fillStyle=INK;ctx.fillRect(x-5,y,10,3)}
// ===== 10. Frozen Stoep Lolly (resist) =====
def("lolly",{name:"Frozen Stoep Lolly",word:"RESIST!",who:"boet",cap:"Licked a frozen lolly straight out of the deep freeze",dur:4,timeoutWin:true,how:"tap",hint:"Tap to pull the tongue back",
 dv:{title:"STUCK!",col:"#7fd3f0",sub:"thlp... hewp...",bg:dBurst("#d6f0fa","#c4e9f7"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("boet",160,gy,190,"shock",t,{pop:popK(t),rot:0.05*Math.sin(tq*8)});limb([166,gy-142,210,gy-146,248,gy-136],8,"#ff6fa3");lollyP(268,gy-130,1.4,-1.4);
  for(var i=0;i<5;i++)flat("flake",80+i*50,(gy-260+((tq*60+i*47)%220)),1,i,-6,-6,12,12,function(){inkLine([-5,0,5,0],2,"#fff");inkLine([0,-5,0,5],2,"#fff")});marker("THLP!",280,gy-200,24,"#2f6fd6",0.1)}}},function(sp){
 var g={L:0,B:actor("boet"),pull:0};
 g.update=function(dt){g.t+=dt;g.B.mt+=dt;g.pull=Math.max(0,g.pull-dt);g.L+=dt*(0.42+0.16*sp);ptr.taps.forEach(function(){g.L=Math.max(0,g.L-0.24);g.pull=0.14;goodTap(200,H*0.45,"#7fd3f0")});if(g.L>=1){g.fail=true;g.ix=250;g.iy=H-200;punch(250,H-200)}};
 g.draw=function(){scene("lolly2",function(){paper("#d6eaf5");stk("freezer",240,H*0.38,1.2,0,-90,-80,180,160,function(){part(RR(-80,-60,160,120,8),"#c8ccd2");part(RR(-70,-50,140,70,4),"#7fd3f0",function(){ctx.fillStyle="rgba(255,255,255,.55)";for(var i=0;i<6;i++)ctx.fillRect(-60+i*22,-45,10,12)});part(function(){ctx.moveTo(-80,-60);ctx.lineTo(-90,-110);ctx.lineTo(70,-110);ctx.lineTo(80,-60);ctx.closePath()},"#a8b0b8")});band(H*0.72,H*0.4,"#c98a5a",2);sceneLabel("STOEP FREEZER",90,H*0.14,-0.04,"#2f6fd6")});
  for(var i=0;i<5;i++){var p=((g.t*0.5+i/5)%1);ctx.globalAlpha=0.5-0.4*p;blob(220+Math.sin(i+g.t)*20,H*0.28-p*80,8+p*10,6+p*8,"#fffaf0");ctx.globalAlpha=1}
  var mx=140,my=H-60-160*0.63,lx=250,ly=H*0.4,k=clamp(g.L,0,1);if(k>0.02)limb([mx,my,mx+(lx-mx)*k*0.55,my-16*k,mx+(lx-20-mx)*k,ly],9,"#ff6fa3");lollyP(lx,ly,1.35,-1.2);halo(lx,ly,28+k*20,"#7fd3f0",g.t);if(k>0.3){ctx.save();ctx.globalAlpha=0.15*k;ctx.fillStyle="#7fd3f0";ctx.fillRect(0,0,W,H);ctx.restore()}
  drawChar("boet",120,H-56,155,g.L>0.65?"panic":g.pull>0?"duck":"calm",g.t,{actor:g.B});setM(g.B,g.L>0.65?"panic":g.pull>0?"duck":"calm");ctx.fillStyle=INK;ctx.fillRect(40,H*0.78,280,12);ctx.fillStyle="#7fd3f0";ctx.fillRect(42,H*0.78+2,276*k,8);marker("TONGUE",180,H*0.78+28,14,INK,0);danger(clamp((g.L-0.45)*2,0,1),g.t);if(g.t<1.3)hand(90,H*0.42,g.t,"tap")};
 g.bot=function(B){if(g.L>0.4&&g.t%0.12<0.02)B.tap(180,300)};
 return g});
// ===== 11. Bakkie in the Mud (rock left/right) =====
def("mud",{name:"Bakkie in the Mud",word:"ROCK IT!",who:"tannie",cap:"Took the 'shortcut' through the farm road after rain",dur:4.5,timeoutWin:false,how:"tap",hint:"Tap LEFT, RIGHT, LEFT, RIGHT...",
 dv:{title:"SPLAT!",col:"#a8743a",sub:"blub blub blub",bg:dBurst("#e7cfa6","#dcc191"),fg:function(t){var gy=H*DG,k=easeOut(t/0.6);bakkieSide(250,gy-10+k*20,1.1,0.12,"",1);ctx.save();ctx.beginPath();ctx.rect(0,0,W,gy-30);ctx.clip();drawChar("tannie",130,gy+50*k,190,"shock",t,{ground:false,pop:popK(t)});ctx.restore();
  tornRect(-10,gy-40,W+20,H*0.3,"#6d4c32",7,0);for(var i=0;i<6;i++){var p=(t*0.8+i/6)%1;flat("bub",30+i*60,gy-36-p*30,1,0,-8,-8,16,16,function(){ctx.strokeStyle="#a8743a";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.stroke()})}}}},function(sp){
 var g={need:Math.round(6+sp*2.2),got:0,side:-1,rk:0,T:actor("tannie"),wr:0};setM(g.T,"reach");
 g.update=function(dt){g.t+=dt;g.T.mt+=dt;g.rk*=Math.pow(0.02,dt);g.wr=Math.max(0,g.wr-dt);ptr.taps.forEach(function(p){var s=p.x<180?-1:1;if(s!==g.side){g.side=s;g.got++;g.rk=s*0.22;drops(180+s*70,H*0.58,"#6d4c32",7,true);goodTap(180+s*110,H-80,"#f2c230");sfx("thud");vib(8)}else{g.wr=0.35;sfx("boing")}});if(g.got>=g.need&&!g.done){g.done=true;setM(g.T,"cheer");sfx("honk");confetti(180,H*0.45,12);punch(180,H*0.5)}};
 g.draw=function(){scene("mud",function(){paper("#9fd3e6");tornRect(-10,H*0.3,W+20,H*0.2,"#86b84a",4,0);band(H*0.48,H*0.6,"#6d4c32",8);ctx.fillStyle="rgba(255,255,255,.1)";for(var i=0;i<14;i++){ctx.beginPath();ctx.ellipse((i*61)%W,H*0.55+(i*37)%(H*0.3),18,4,0,0,7);ctx.fill()}});
  var pr=g.got/g.need;bakkieSide(180+pr*36,H*0.5,1.55,g.rk*(1+pr),"",1);star(140,H*0.56,6,g.t*14);star(230,H*0.56,6,-g.t*14);drawChar("tannie",55,H*0.56,125,"reach",g.t,{actor:g.T});
  [-1,1].forEach(function(s){var on=g.side!==s,x=180+s*110,y=H-80;stk("pad"+s,x,y,on?1.05+0.05*Math.sin(g.t*10):0.9,0,-56,-40,112,80,function(){part(RR(-50,-34,100,68,14),s<0?"#f2c230":"#00acc1");if(MODE!=="shadow"){ctx.save();marker0(s<0?"LEFT":"RIGHT",20,INK);ctx.restore()}})});
  if(g.wr)marker("other side!",180,H*0.72,20,"#e53935",-0.05);if(g.t<1.2)hand(180+(g.side<0?110:-110),H-60,g.t,"tap");counter(g.got,g.need)};
 g.bot=function(B){if(g.t%0.1<0.02)B.tap(g.side<0?290:70,H-80)};
 return g});
// ===== 12. Unplug before the surge =====
function appP(k,x,y,s){stk("app"+k,x,y,s,0,-40,-46,80,80,function(){if(k===0){kettleP(0,30,0.9)}else if(k===1){part(RR(-30,-14,60,40,10),"#c8ccd2",function(){ctx.fillStyle=INK;ctx.fillRect(-18,-14,10,6);ctx.fillRect(4,-14,10,6)});part(RR(-12,-28,10,16,3),"#e8b06a");part(RR(4,-30,10,18,3),"#e8b06a")}
 else if(k===2){part(RR(-34,-28,68,46,6),"#2b2b33",function(){ctx.fillStyle="#7fd3f0";ctx.fillRect(-28,-22,56,34)});inkLine([-14,18,-20,28],3);inkLine([14,18,20,28],3)}else{part(RR(-30,-16,60,40,8),"#e53977",function(){ctx.fillStyle=INK;ctx.beginPath();ctx.arc(-12,4,10,0,7);ctx.fill();ctx.fillStyle="#f2c230";ctx.fillRect(6,-6,16,6)});inkLine([16,-16,26,-36],2.4)}})}
def("unplug",{name:"Unplug Everything",word:"UNPLUG!",who:"auntie",cap:"Didn't unplug before the power came back with a BANG",dur:4.5,timeoutWin:false,how:"tap",hint:"Tap each plug to pull it out",
 dv:{title:"POOF!",col:"#7a8290",sub:"surge says hello",bg:dBurst("#e0dcea","#d2cce0"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("auntie",180,gy,190,"shock",t,{pop:popK(t)});
  [[160,gy-120],[200,gy-90],[170,gy-60],[150,gy-170]].forEach(function(s){flat("soot",s[0],s[1],1,s[0],-12,-8,24,16,function(){ctx.fillStyle="rgba(43,27,51,.55)";ctx.beginPath();ctx.ellipse(0,0,10,6,0.3,0,7);ctx.fill()})});
  for(var i=0;i<5;i++){var p=(t*0.6+i/5)%1;ctx.globalAlpha=1-p;blob(90+i*44,gy-230-p*80,12+p*14,10+p*10,"#9a9aa6");ctx.globalAlpha=1}kettleP(290,gy-180-Math.sin(tq*3)*20,1,0.5,1);stk("lidf",300,gy-260-t*30,1,tq*5,-14,-8,28,16,function(){part(E(0,0,10,4),"#c8ccd2")})}}},function(sp){
 var n=Math.min(4,2+Math.floor(sp*0.7)),g={p:[],left:n,surge:0,A:actor("auntie"),rate:1/(3.6/Math.sqrt(sp))};setM(g.A,"panic");
 for(var i=0;i<n;i++)g.p.push({k:i,x:[70,290,70,290][i],y:H*[0.24,0.24,0.46,0.46][i],out:0});
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;g.surge+=dt*g.rate;ptr.taps.forEach(function(q){g.p.forEach(function(p){if(!p.out&&Math.abs(q.x-(p.x+(p.x<180?54:-54)))<46&&Math.abs(q.y-p.y-30)<54){p.out=0.01;g.left--;goodTap(p.x+(p.x<180?54:-54),p.y+30,"#f2c230");sfx("pop",n-g.left)}})});g.p.forEach(function(p){if(p.out)p.out+=dt});
  if(g.left<=0&&!g.done){g.done=true;setM(g.A,"happy");confetti(180,H*0.4,14);punch(180,H*0.3)}if(g.surge>=1&&!g.done){g.fail=true;g.ix=180;g.iy=H*0.3;punch(180,H*0.3);sfx("zap")}};
 g.draw=function(){scene("unplug",function(){paper("#f6e7d0");for(var x=0;x<W;x+=24){ctx.fillStyle=(x/24)%2?"rgba(232,162,58,.18)":"rgba(255,255,255,.2)";ctx.fillRect(x,0,12,H*0.62)}tornRect(-10,H*0.62,W+20,H*0.5,"#a8743a",3,0);[H*0.24,H*0.46].forEach(function(y){tornRect(10,y+34,340,14,"#c98a5a",y|0,0)})});
  g.p.forEach(function(p){appP(p.k,p.x,p.y,1);var sx=p.x+(p.x<180?54:-54),sy=p.y+30;stk("sock",sx,sy-30,1,0,-16,-16,32,32,function(){part(RR(-13,-13,26,26,5),"#fbf6ea",function(){ctx.fillStyle=INK;ctx.fillRect(-5,-6,3,6);ctx.fillRect(2,-6,3,6)})});
   var o=p.out?easeOutBack(p.out/0.2):0;plugP(sx+(p.x<180?1:-1)*o*30,sy-30+o*18,1.1,o*0.8);if(!p.out)inkLine([sx,sy-14,(sx+p.x)/2,sy+6,p.x,p.y+20],3,INK)});
  stk("therm",40,H*0.12,1,0,-18,-50,36,110,function(){part(RR(-12,-48,24,90,8),"#fffaf0");part(RR(-8,20-80*clamp(g.surge,0,1),16,80*clamp(g.surge,0,1)+16,6),g.surge>0.7?"#e53935":"#f2c230");part(function(){ctx.arc(0,42,14,0,7)},g.surge>0.7?"#e53935":"#f2c230")});marker("SURGE",100,H*0.08,16,g.surge>0.7?"#e53935":INK,0);var focus=g.p.find(function(pp){return!pp.out});if(focus)halo(focus.x+(focus.x<180?54:-54),focus.y+10,34,"#f2c230",g.t);
  drawChar("auntie",180,H-56,150,"panic",g.t,{actor:g.A});danger(clamp((g.surge-0.6)*2.5,0,1),g.t);var f=g.p.find(function(p){return!p.out});if(f&&g.t<1.4)hand(f.x+(f.x<180?54:-54)+16,f.y+30,g.t,"tap");counter(n-g.left,n)};
 g.bot=function(B){if(g.t%0.22<0.02){var f=g.p.find(function(p){return!p.out});if(f)B.tap(f.x+(f.x<180?54:-54),f.y+30)}};
 return g});
// ===== 13. Over-Salted Pap (easy-ish) =====
def("salt",{name:"Over-Salted Pap",word:"STOP!",who:"tannie",cap:"Let Gogo season the pap 'just a little'",dur:5,timeoutWin:false,how:"tap",hint:"Tap the salt shaker before it pours",
 dv:{title:"SALTY!",col:"#2f6fd6",sub:"just a LITTLE, she said",bg:dBurst("#fff4b8","#ffeea0","#c98a5a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("tannie",130,gy,190,"shock",t,{pop:popK(t)});limb([130,gy-140,134,gy-128,130,gy-118],7,"#ff6fa3");potP(270,gy-20,0.9,3);saltP(300,gy-150,1.1,2.6);
  for(var i=0;i<3;i++){var p=(t*1.2+i/3)%1;flat("steam",110+i*20,gy-210-p*60,1,0,-6,-12,12,24,function(){ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,10);ctx.quadraticCurveTo(-6,0,0,-4);ctx.quadraticCurveTo(6,-8,0,-12);ctx.stroke()})}}}},function(sp){
 var g={need:Math.min(4,2+Math.floor(sp*0.6)),got:0,s:null,sp0:0.35,salt:0,T:actor("tannie")};
 g.update=function(dt){g.t+=dt;g.T.mt+=dt;g.sp0-=dt;if(!g.s&&g.sp0<=0&&g.got<g.need){var L=2/Math.sqrt(sp);g.s={x:rnd(110,250),y:H*rnd(0.2,0.3),l:L,L:L,a:0}}
  if(g.s){var s=g.s;s.a+=dt;s.l-=dt;if(s.l<s.L*0.5&&Math.floor(g.t*14)%2)drops(s.x,s.y+30,"#fff",1);ptr.taps.forEach(function(p){if(g.s&&Math.hypot(p.x-s.x,p.y-s.y)<85){confetti(s.x,s.y,8);sfx("pop",g.got);vib(8);g.got++;g.s=null;g.sp0=0.3}});if(g.s&&s.l<=0){g.fail=true;g.ix=s.x;g.iy=s.y}}
  if(g.got>=g.need&&!g.done){g.done=true;setM(g.T,"happy")}};
 g.draw=function(){scene("salt",function(){kitchen();stk("stove",180,H*0.66,1,0,-120,-20,240,40,function(){part(RR(-110,-14,220,26,6),"#2b2b33")})});potP(180,H*0.6,1.3,0);
  if(g.s){var s=g.s,k=easeOutBack(s.a/0.2),wob=s.l<s.L*0.5?Math.sin(g.t*40)*0.3:0;limb([s.x+60,s.y-70,s.x+30,s.y-50,s.x+8,s.y-18],9,LOOK.gogo.skin);saltP(s.x,s.y,1.4*k,2.8+wob);halo(s.x,s.y,48,s.l<s.L*0.5?"#e53935":"#f2c230",g.t);if(g.got===0&&g.t<2)hand(s.x+30,s.y+40,g.t,"tap")}
  drawChar("tannie",300,H-56,140,"calm",g.t,{actor:g.T,flip:true});counter(g.got,g.need)};
 g.bot=function(B){if(g.s&&g.s.a>0.25)B.tap(g.s.x,g.s.y)};
 return g});
// ===== 14. Umbrella in the storm (avoid lightning) =====
def("umbrella",{name:"Highveld Storm",word:"MOVE!",who:"gaatjie",cap:"Held a metal umbrella up in a Highveld storm",dur:4.5,timeoutWin:true,how:"drag",hint:"Drag away from the glowing spot",
 dv:{title:"KA-BOOM!",col:"#f2c230",sub:"metal umbrella, eish",bg:dBurst("#4a4f7a","#3e4370","#3a3f47"),fg:function(t){var gy=H*DG,tq=sq12(t);cloudP(180,gy-300,1.5,"#6a6f8a");drawChar("gaatjie",180,gy,190,"shock",t,{pop:popK(t)});umbrellaP(250,gy-170,1.1,0.4,1);if(Math.floor(tq*12)%4<2)bolt(210,gy-250,1.6,0.2);
  for(var i=0;i<12;i++){var y=(tq*500+i*53)%(gy);inkLine([30+i*28,y,24+i*28,y+16],2,"#9fd3e6")}}}},function(sp){
 var g={x:180,st:[],sp0:0.6,A:actor("gaatjie"),fl:0};setM(g.A,"panic");
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;g.fl=Math.max(0,g.fl-dt);g.x=clamp(g.x+(ptr.x-g.x)*Math.min(1,dt*12),40,320);g.sp0-=dt;if(g.sp0<=0){g.sp0=Math.max(0.6,1.1/sp);var tx=clamp(g.x+rnd(-30,30),40,320);g.st.push({x:tx,w:Math.max(0.68,1.05/Math.sqrt(sp)),a:0})}
  g.st.forEach(function(s){s.a+=dt;if(!s.hit&&s.a>=s.w){s.hit=1;g.fl=0.12;sfx("thunder");vib(20);shake=0.15;if(Math.abs(s.x-g.x)<46){g.fail=true;g.ix=s.x;g.iy=H-150}}});g.st=g.st.filter(function(s){return s.a<s.w+0.3})};
 g.draw=function(){scene("umb",function(){paper("#3e4370");tornRect(-10,-20,W+20,H*0.2,"#2b2f55",3,0);cloudP(70,H*0.08,1.3,"#6a6f8a");cloudP(260,H*0.1,1.5,"#6a6f8a");tornRect(-10,H*0.78,W+20,H*0.3,"#3a3f47",3,0);ctx.fillStyle="rgba(255,255,255,.1)";for(var i=0;i<10;i++)ctx.fillRect(i*40,H*0.8+(i%3)*10,22,3)});
  ctx.strokeStyle="rgba(159,211,230,.6)";ctx.lineWidth=2;ctx.beginPath();for(var i=0;i<22;i++){var x=(i*37+g.t*40)%W,y=(i*91+g.t*700)%H;ctx.moveTo(x,y);ctx.lineTo(x-5,y+16)}ctx.stroke();
  g.st.forEach(function(s){if(!s.hit){var k=s.a/s.w;ctx.save();ctx.globalAlpha=0.35+0.4*k;ctx.fillStyle="#f2c230";ctx.beginPath();ctx.ellipse(s.x,H-60,52*(0.6+0.4*k),12,0,0,7);ctx.fill();ctx.restore();scribble(s.x,H-60,40,"#f2c230",g.t)}else{ctx.save();ctx.strokeStyle="#fff7a0";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(s.x+20,0);ctx.lineTo(s.x-14,H*0.35);ctx.lineTo(s.x+16,H*0.45);ctx.lineTo(s.x-4,H-60);ctx.stroke();ctx.strokeStyle="#f2c230";ctx.lineWidth=3;ctx.stroke();ctx.restore()}});
  drawChar("gaatjie",g.x,H-60,140,"panic",g.t,{actor:g.A});umbrellaP(g.x+22,H-60-150,0.9,0.1);if(g.fl){ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(0,0,W,H)}if(g.t<1.2)hand(g.x+50,H-120,g.t,"drag")};
 g.bot=function(B){var live=g.st.filter(function(s){return!s.hit});if(!live.length)return;var bx=g.x,bs=-1;for(var x=40;x<=320;x+=10){var m=1e9;var bad=false;live.forEach(function(s){var rem=s.w-s.a,d=Math.abs(s.x-x);if(rem<0.4&&d<70)bad=true;if(rem<0.4&&Math.min(x,g.x)<s.x+50&&Math.max(x,g.x)>s.x-50)bad=true;m=Math.min(m,d+rem*120)});if(bad)continue;var sc=Math.min(m,160)-Math.abs(x-g.x)*0.05;if(sc>bs){bs=sc;bx=x}}B.move(bx,H-100)};
 return g});
// ===== 15. Hot car seat (wait for the cloud) =====
def("carseat",{name:"Hot Car Seat",word:"WAIT... SIT!",who:"boet",cap:"Sat on a vinyl car seat in January",dur:5,timeoutWin:false,how:"tap",hint:"Wait for the cloud, THEN tap",
 dv:{title:"EINA!",col:"#e53935",sub:"vinyl in January",bg:dBurst("#ffc59a","#ffb27e"),fg:function(t){var gy=H*DG,tq=sq12(t),j=Math.abs(Math.sin(tq*6))*60;stk("seat1",180,gy-20,1.4,0,-70,-70,140,100,function(){part(RR(-60,-60,120,80,18),"#e53935",function(){ctx.fillStyle="rgba(255,255,255,.2)";for(var i=-50;i<60;i+=20)ctx.fillRect(i,-60,6,80)})});
  drawChar("boet",180,gy-60-j,180,"shock",t,{ground:false,pop:popK(t)});for(var i=0;i<3;i++){var p=(t*1.5+i/3)%1;flat("steam",150+i*30,gy-50-p*50,1,0,-6,-12,12,24,function(){ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,10);ctx.quadraticCurveTo(-6,0,0,-4);ctx.quadraticCurveTo(6,-8,0,-12);ctx.stroke()})}}}},function(sp){
 var g={cx:-120,v:(70+30*sp)*rnd(0.9,1.1),B:actor("boet"),seat:0};setM(g.B,"panic");var sx=260,sy=H*0.14;
 g.update=function(dt){g.t+=dt;g.B.mt+=dt;g.cx+=g.v*dt;if(g.cx>W+140)g.cx=-140;var cov=Math.abs(g.cx-sx)<54;g.seat+=((cov?0:1)-g.seat)*Math.min(1,dt*(cov?5:2.5));g.cool=g.seat<0.35;
  ptr.taps.forEach(function(){if(g.done||g.fail)return;if(g.cool){g.done=true;setM(g.B,"happy");sfx("win");confetti(180,H*0.6,10)}else{g.fail=true;g.ix=180;g.iy=H*0.6;sfx("sizzle")}})};
 g.draw=function(){scene("seat",function(){paper("#9fd3e6");tornRect(-10,H*0.36,W+20,H*0.8,"#3a3f47",3,0);tornRect(20,H*0.3,320,H*0.3,"#5d5866",4,0);ctx.fillStyle="#7fb8e0";ctx.fillRect(40,H*0.32,280,H*0.1)});sunP(sx,sy,1);cloudP(g.cx,sy+6,1.1);
  var hot=g.seat;stk("seat"+(hot>0.35?1:0),180,H*0.58,1.5,0,-70,-70,140,100,function(){part(RR(-60,-60,120,80,18),hot>0.35?"#e53935":"#2f6fd6",function(){ctx.fillStyle="rgba(255,255,255,.2)";for(var i=-50;i<60;i+=20)ctx.fillRect(i,-60,6,80)})});
  if(hot>0.35){for(var i=0;i<3;i++){var p=(g.t*1.4+i/3)%1;ctx.globalAlpha=1-p;inkLine([140+i*40,H*0.5-p*40,146+i*40,H*0.5-12-p*40],3,"#ffb27e");ctx.globalAlpha=1}}
  drawChar("boet",80,H-56,150,g.cool?"calm":"panic",g.t,{actor:g.cool?null:g.B});stxt(g.cool?"NOW!":"HOT!",180,H*0.72,30,g.cool?"#86d27f":"#e53935",-0.05,g.cool?1+0.08*Math.sin(g.t*16):1);if(g.t<2)hand(250,H*0.7,g.t,"tap")};
 g.bot=function(B){if(g.cool&&g.t>0.2)B.tap(180,300)};
 return g});
// ===== 16. Tomato Sauce (shake) =====
def("sauce",{name:"Stuck Sauce",word:"SHAKE!",who:"uncle",cap:"Shook the tomato sauce with the lid loose",dur:4.5,timeoutWin:false,how:"swipe",hint:"Drag up & down to shake",
 dv:{title:"SAUCED!",col:"#e23b3b",sub:"the lid was loose",bg:dBurst("#ffe0c0","#ffd2a8","#c98a5a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("uncle",170,gy,190,"shock",t,{pop:popK(t)});
  [[150,gy-180,14],[196,gy-150,10],[160,gy-80,16],[210,gy-60,9],[130,gy-120,8]].forEach(function(s,i){flat("sp"+i,s[0],s[1],1,i,-20,-20,40,40,function(){ctx.fillStyle="#e23b3b";ctx.beginPath();for(var k=0;k<10;k++){var a=k*0.628,r=k%2?s[2]*0.6:s[2];ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.fill()})});sauceP(290,gy-40,1.1,1.4,1);stk("lidf2",280,gy-240-t*20,1,tq*6,-12,-8,24,16,function(){part(RR(-8,-6,16,11,3),"#fbf6ea")})}}},function(sp){
 var g={need:Math.round(5+sp*2),got:0,dir:0,ly:ptr.y,by:H*0.36,U:actor("uncle"),lim:0};
 g.update=function(dt){g.t+=dt;g.U.mt+=dt;var ny=clamp(ptr.y,H*0.2,H*0.55);var dy=ny-g.by;g.by=ny;if(Math.abs(dy)>2){var d=dy>0?1:-1;if(g.dir&&d!==g.dir){g.got++;goodTap(180,g.by,"#e23b3b");sfx("slurp");vib(6);if(g.got>=g.need&&!g.done){g.done=true;drops(180,H*0.7,"#e23b3b",10,true);setM(g.U,"happy");punch(180,H*0.5);confetti(180,H*0.4,10)}}g.dir=d}};
 g.draw=function(){scene("sauce",function(){kitchen();tornRect(40,H*0.7,280,30,"#fbf6ea",3,0)});rollP(180,H*0.7,1.4,g.done);sauceP(180,g.by,1.55,Math.PI,0);arrow(300,g.by,300,g.by+(g.dir>=0?-50:50),"#f2c230");halo(180,g.by,36,"#e23b3b",g.t);
  ctx.fillStyle=INK;ctx.fillRect(330,H*0.2,14,H*0.4);ctx.fillStyle="#e23b3b";var k=g.got/g.need;ctx.fillRect(333,H*0.6-H*0.4*k+3,8,H*0.4*k-6);
  drawChar("uncle",60,H-50,140,"panic",g.t,{actor:g.U});if(g.t<1.4)hand(240,H*0.38,g.t,"swipe",Math.PI/2);counter(Math.min(g.got,g.need),g.need)};
 g.bot=function(B){B.move(180,H*(Math.floor(g.t*10)%2?0.25:0.5))};
 return g});
// ===== 17. Rescue the Wors (kept, polished) =====
def("wors",{name:"Rescue the Wors",word:"GRAB!",who:"uncle",cap:"Turned his back on the wors 'for one second'",dur:3.5,timeoutWin:false,how:"tap",hint:"Grab the wors before the dog does",
 dv:{title:"WOOF!",col:"#a8743a",sub:"one second, he said",bg:dBurst("#f3d9a8","#ecca8c","#c9ad72"),fg:function(t){var gy=H*DG;drawChar("uncle",110,gy,180,"sad",t,{pop:popK(t)});drawDog(260,gy,110,t,{run:false,flip:true});drawWors(240,gy-60,50,t,{rot:0.3});stxt("woof",290,gy-140,22,"#fffaf0",0.1)}}},function(sp){
 var g={dx:440,wx:200,wy:H*0.5,mv:0.15,jt:0,U:actor("uncle")};setM(g.U,"reach");var GY=H*0.70;
 g.update=function(dt){g.t+=dt;g.jt+=dt;g.U.mt+=dt;g.dx-=dt*90*sp;g.mv-=dt;
  if(g.mv<=0){g.mv=0.5/sp;burst(g.wx,g.wy,"#d9c7a0",4);g.wx=rnd(80,270);g.wy=H*rnd(0.42,0.58);g.jt=0;sfx("boing")}
  ptr.taps.forEach(function(p){if(!g.done&&Math.hypot(p.x-g.wx,p.y-g.wy)<58){g.done=true;confetti(g.wx,g.wy,16);sfx("coin",3);setM(g.U,"happy")}});
  if(!g.done&&g.dx<g.wx+40){g.fail=true;g.ix=g.wx;g.iy=g.wy;sfx("bark")}};
 g.draw=function(){if(!cover("bg-braai"))paper("#e8d3a6");var x=Math.min(440,g.dx),near=clamp(1-(x-g.wx-40)/180,0,1),bob=Math.sin(sq12(g.t)*10)*3,pk=popK(g.jt);danger(near,g.t);
  halo(g.wx,g.wy+bob,Math.round(54*pk),"#e53935",g.t);drawWors(g.wx,g.wy+bob,76*pk,g.t,{rot:Math.sin(sq12(g.t)*8)*0.12});marker("GRAB!",g.wx+(g.wx>200?-44:44),g.wy-58+bob,22,"#e53935",g.wx>200?-0.12:0.12,pk);
  if(x<420){drawDog(x+18,GY,80,g.t,{});if(near>0.35)stxt("!",x-6,GY-92,34,"#f2c230",0.1)}drawChar("uncle",80,H-62,176,"reach",g.t,{actor:g.U});if(g.t<1)hand(g.wx+30,g.wy+40,g.t,"tap")};
 g.bot=function(B){if(g.jt>0.12)B.tap(g.wx,g.wy)};
 return g});
// ===== 18. Taxi Rank Crossing (kept) + redrawn FLAT death =====
def("quantum",{name:"Taxi Rank Crossing",word:"CROSS!",who:"gogo",cap:"Stood in the taxi lane arguing about the fare",dur:5,timeoutWin:false,how:"tap",hint:"Tap to hop one lane at a time",
 dv:{title:"FLAT!",col:"#f2c230",sub:"...but the fare, my child",bg:function(){paper("#3a3f47");ctx.fillStyle="#f2c230";for(var y=0;y<H;y+=60)ctx.fillRect(176,y,8,32);ctx.fillStyle="rgba(43,27,51,.35)";[150,210].forEach(function(x){ctx.fillRect(x,0,26,H)});},
  fg:function(t){var gy=H*DG,tq=sq12(t),k=easeOutBack(t/0.3);ctx.save();ctx.translate(292,gy-20);ctx.rotate(-1.5708);ctx.scale(0.42*k+0.01,1.25);drawChar("gogo",0,0,190,"dizzy",0,{ground:false});ctx.restore();ctx.save();ctx.globalAlpha=0.55;ctx.fillStyle="#2b1b33";for(var w=0;w<2;w++)for(var y=0;y<H*0.62;y+=14)ctx.fillRect(150+w*44,y,18,8);ctx.restore();
   drawTaxi(180,gy-260-t*140,60,t,{spin:t*30});speedLines(180,gy-300-t*140,t,"rgba(255,250,240,.6)");for(var i=0;i<4;i++){var a=tq*5+i*1.57;star(180+Math.cos(a)*70,gy-90+Math.sin(a)*14,9,a)}stk("stickg",280,gy-20,1,0.8,-6,-50,12,100,function(){limb([0,-46,0,0,0,46],4,"#a8743a")})}}},function(sp){
 var NL=4,g={lane:0,from:0,cars:[],hop:0,ht:9,G:actor("gogo")};for(var i=1;i<=NL;i++)g.cars.push({l:i,x:rnd(0,360),v:(i%2?1:-1)*rnd(120,165)*Math.pow(sp,0.35)*1.15});
 var LY=[0.925,0.756,0.58,0.40,0.218,0.05];function ly(l){return H*LY[Math.min(l,NL+1)]}g.ly=ly;g.NL=NL;
 g.update=function(dt){g.t+=dt;g.ht+=dt;g.G.mt+=dt;g.hop=Math.max(0,g.hop-dt);
  if(ptr.taps.length&&g.hop<=0&&g.lane<=NL){g.from=g.lane;g.lane++;g.hop=0.12;g.ht=0;sfx("boing");setM(g.G,g.lane>NL?"happy":"panic");if(g.lane>NL)confetti(180,ly(NL+1),16)}
  g.cars.forEach(function(c){c.x+=c.v*dt;if(c.x>440)c.x=-80;if(c.x<-80)c.x=440;if(c.l===g.lane&&Math.abs(c.x-180)<50){g.fail=true;g.ix=180;g.iy=ly(g.lane);sfx("honk")}});if(g.lane>NL)g.done=true};
 g.draw=function(){if(!cover("bg-road"))paper("#3a3f47");var p=clamp(g.ht/0.17,0,1),gy=ly(g.from)+(ly(g.lane)-ly(g.from))*easeOutBack(p)-Math.sin(Math.PI*p)*22,sy=p<1?1.14-0.1*p:1-0.2*Math.exp(-(g.ht-0.17)*18)*Math.cos((g.ht-0.17)*40);
  if(g.lane<=NL){var ny=ly(g.lane+1);ctx.save();ctx.globalAlpha=0.5+0.3*Math.sin(g.t*10);[0,1].forEach(function(k){arrow(180,ny+46-k*14,180,ny+28-k*14,"#f2c230")});ctx.restore()}
  stxt("SAFE!",180,ly(NL+1)+2,26,"#86d27f",-0.04);
  g.cars.slice().sort(function(a,b){return b.l-a.l}).forEach(function(c){var y=ly(c.l)+30;drawTaxi(c.x,y,54,g.t,{flip:c.v>0,ph:c.l,spin:c.x/9})});
  drawChar("gogo",180,gy+28,92,"calm",g.t,{actor:g.G,sy:sy,sx:2-sy});if(g.t<1.5)hand(W-60,H-90,g.t,"tap")};
 g.bot=function(B){if(g.hop>0)return;var nl=g.lane+1;if(nl>NL){B.tap(180,300);return}
  function clear(c,T){for(var s=0;s<=T;s+=0.02){var x=c.x+c.v*s;while(x>440)x-=520;while(x<-80)x+=520;if(Math.abs(x-180)<72)return false}return true}
  var cur=g.lane>0?g.cars[g.lane-1]:null,nxt=g.cars[nl-1];
  if(clear(nxt,0.35)||(cur&&!clear(cur,0.15)&&clear(nxt,0.12)))B.tap(180,300)};
 return g});
// ================= NEW v1.0 microgames =================
// ===== N1. Load-shedding Candle (HOLD) =====
function candleP(x,y,s,fl){stk("candle",x,y,s,0,-20,-10,40,100,function(){part(RR(-12,0,24,80,4),"#fbf6ea",function(){ctx.fillStyle="rgba(232,162,58,.25)";ctx.fillRect(4,0,5,80);ctx.fillStyle="#fbf6ea";ctx.beginPath();ctx.ellipse(-6,6,4,9,0,0,7);ctx.fill()});inkLine([0,0,0,-8],2,INK);part(RR(-24,78,48,10,4),"#c8ccd2")})}
function flameF(x,y,k,t){if(k<=0.02)return;var n=Math.floor(t*12)%3;flat("flame"+n+"|"+Math.round(k*5),x,y,1,0,-24,-60,48,70,function(){var h=(30+n*3)*(0.4+0.6*Math.round(k*5)/5);ctx.fillStyle="rgba(255,216,74,.25)";ctx.beginPath();ctx.arc(0,-h*0.4,h*0.8,0,7);ctx.fill();ctx.fillStyle="#ff9a2e";ctx.beginPath();ctx.moveTo(0,-h);ctx.quadraticCurveTo(12,-h*0.3,0,0);ctx.quadraticCurveTo(-12,-h*0.3,0,-h);ctx.fill();ctx.fillStyle="#ffe58a";ctx.beginPath();ctx.moveTo(0,-h*0.6);ctx.quadraticCurveTo(6,-h*0.2,0,0);ctx.quadraticCurveTo(-6,-h*0.2,0,-h*0.6);ctx.fill()})}
def("candle",{name:"Load-shedding Candle",word:"HOLD!",who:"gogo",cap:"Let the last candle blow out in Stage 6",dur:5,timeoutWin:true,how:"hold",hint:"HOLD to cup the flame when the wind blows",nw:1,
 dv:{title:"DARK!",col:"#f2c230",sub:"where's the torch?!",bg:function(){paper("#151938")},fg:function(t){var gy=H*DG,tq=sq12(t),bl=(tq%2.2)<0.1;
  var EY=function(){[-12,12].forEach(function(x){part(E(x,0,9,bl?1.5:9),"#fffaf0",function(){if(!bl){ctx.fillStyle=INK;ctx.beginPath();ctx.arc(x+2,1,4,0,7);ctx.fill()}})})};stk("eyes"+(bl?1:0),130,gy-170,1,0,-30,-16,60,32,EY);stk("eyes"+(bl?1:0),240,gy-120,0.8,0,-30,-16,60,32,EY);var cx=230,cy=gy-40;candleP(cx,cy,1,0);for(var i=0;i<3;i++){var p=(t*0.5+i/3)%1;ctx.globalAlpha=0.7*(1-p);inkLine([cx,cy-10-p*60,cx+8*Math.sin(p*8),cy-30-p*60],3,"#9a9aa6");ctx.globalAlpha=1}stxt("Stage 6",80,gy-20,22,"#f2c230",-0.08)}}},function(sp){
 var g={gs:[],sp0:0.9,air:1,fl:1,G:actor("gogo"),wind:0};
 g.update=function(dt){g.t+=dt;g.G.mt+=dt;g.sp0-=dt;if(g.sp0<=0){g.sp0=rnd(1.0,1.5)/Math.sqrt(sp);var w=Math.max(0.45,0.8/Math.sqrt(sp));g.gs.push({a:0,w:w,d:0.55})}
  var gust=false;g.gs.forEach(function(q){q.a+=dt;if(q.a>q.w&&q.a<q.w+q.d)gust=true});g.gs=g.gs.filter(function(q){return q.a<q.w+q.d+0.1});g.wind=gust;
  var held=ptr.down;setM(g.G,held?"hold":"calm");if(gust&&!held){g.fl-=dt*3.2;if(Math.floor(g.t*8)!==Math.floor((g.t-dt)*8))sfx("whoosh")}else g.fl=Math.min(1,g.fl+dt*0.8);
  if(held&&!gust){g.air-=dt*(0.5+0.12*sp)}else g.air=Math.min(1,g.air+dt*0.35);
  if(g.fl<=0){g.fail=true;g.ix=180;g.iy=H*0.4;sfx("puff")}if(g.air<=0){g.fail=true;g.ix=180;g.iy=H*0.4;sfx("puff")}};
 g.draw=function(){scene("candle",function(){paper("#20264f");tornRect(30,H*0.06,150,H*0.22,"#2f3a78",4,0.02);ctx.fillStyle="#fff3c4";for(var i=0;i<8;i++){ctx.beginPath();ctx.arc(50+(i*37)%120,H*0.08+(i*29)%(H*0.18),1.6,0,7);ctx.fill()}inkLine([105,H*0.06,105,H*0.28],3,"#c98a5a");tornRect(-10,H*0.62,W+20,H*0.5,"#5a3a2a",5,0);stk("eskom",270,H*0.16,1,0.06,-70,-34,140,68,function(){part(RR(-62,-26,124,52,6),"#fbf6ea");if(MODE!=="shadow"){ctx.save();ctx.translate(0,-6);marker0("STAGE 6",15,"#e53935");ctx.translate(0,20);marker0("18:00-20:30",11,INK);ctx.restore()}})});
  var fl=Math.max(0,g.fl),x=180,y=H*0.5,lean=g.wind?(ptr.down?0.1:0.5):0;ctx.save();ctx.globalAlpha=0.28*fl;ctx.fillStyle="#ffd84a";ctx.beginPath();ctx.arc(x,y-20,150*fl,0,7);ctx.fill();ctx.restore();
  candleP(x,y,1.2,1);ctx.save();ctx.translate(x,y-8);ctx.rotate(lean*Math.sin(g.t*30)*0.6+lean*0.4);flameF(0,0,fl,g.t);ctx.restore();
  g.gs.forEach(function(q){var k=q.a/q.w;if(k<1){ctx.save();ctx.globalAlpha=0.4+0.6*k;stxt("~ ~ ~",30+30*k,y-40,26,"#9fd3e6",0);ctx.restore()}else if(q.a<q.w+q.d){for(var i=0;i<4;i++){var gx=((q.a-q.w)*600+i*50)%W;inkLine([gx,y-60+i*16,gx+40,y-64+i*16],3,"#bfe7f7")}}});
  if(ptr.down){[-1,1].forEach(function(s){stk("cup",x+s*30,y-30,1,s*0.4,-20,-30,40,60,function(){part(function(){ctx.moveTo(-12,24);ctx.quadraticCurveTo(-16,-10,0,-26);ctx.quadraticCurveTo(14,-14,12,24);ctx.closePath()},LOOK.gogo.skin)},s>0)})}
  drawChar("gogo",70,H-50,150,"calm",g.t,{actor:g.G});ctx.fillStyle=INK;ctx.fillRect(250,H-150,90,14);ctx.fillStyle=g.air<0.3?"#e53935":"#7fd3f0";ctx.fillRect(253,H-147,84*clamp(g.air,0,1),8);marker("hands",295,H-168,14,"#fffaf0",0);
  danger(Math.max(clamp((0.5-fl)*2,0,1),clamp((0.3-g.air)*3,0,1)),g.t);if(g.t<2.2)hand(240,H*0.72,g.t,"hold")};
 g.bot=function(B){var soon=g.gs.some(function(q){return q.a>q.w-0.08&&q.a<q.w+q.d+0.02});B.hold(soon)};
 return g});
// ===== N2. Vuvuzela (RHYTHM TAP) =====
function vuvuP(x,y,s,r){stk("vuvu",x,y,s,r||0,-30,-90,60,120,function(){part(function(){ctx.moveTo(-4,24);ctx.lineTo(-24,-84);ctx.quadraticCurveTo(0,-92,24,-84);ctx.lineTo(4,24);ctx.closePath()},"#f2c230",function(){ctx.fillStyle="#2e8a4a";ctx.fillRect(-30,-60,60,8);ctx.fillRect(-30,-30,60,6)},[-24,-90,24,24]);part(E(0,24,6,4),"#2b2b33")})}
def("vuvu",{name:"Vuvuzela Blast",word:"TOOT!",who:"boet",cap:"Blew the vuvuzela right in the ref's ear",dur:5,timeoutWin:false,how:"tap",hint:"Tap when the ring hits the circle",nw:1,
 dv:{title:"BWAAAP!",col:"#f2c230",sub:"ears ringing till Tuesday",bg:dBurst("#c6e8a8","#b4dc92","#2e8a4a"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("boet",180,gy,190,"dizzy",t,{pop:popK(t)});vuvuP(250,gy-150,1.2,-0.9);
  for(var i=0;i<3;i++){var r=((tq*90+i*40)%120)+20;ctx.save();ctx.globalAlpha=1-r/140;ctx.strokeStyle="#fffaf0";ctx.lineWidth=4;ctx.beginPath();ctx.arc(310,gy-210,r,-1.2,0.5);ctx.stroke();ctx.restore()}stxt("BWAAP",280,gy-270,20,"#e53935",0.2)}}},function(sp){
 var bpm=95+20*sp,per=60/bpm,g={need:4,hit:0,miss:0,beats:[],nb:0.9,B:actor("boet"),fx:0,fxk:""};for(var i=0;i<10;i++)g.beats.push(0.9+i*per);
 var cx=180,cy=H*0.42;
 g.update=function(dt){g.t+=dt;g.B.mt+=dt;g.fx=Math.max(0,g.fx-dt);var win=0.13/Math.sqrt(sp)+0.03;
  ptr.taps.forEach(function(){var best=-1,bd=9;g.beats.forEach(function(b,i){var d=Math.abs(g.t-b);if(d<bd){bd=d;best=i}});if(bd<win){g.beats.splice(best,1);g.hit++;g.fx=0.25;g.fxk="TOOT!";sfx("toot",g.hit);setM(g.B,"blow");vib(10);confetti(cx,cy,6,["#f2c230","#2e8a4a"])}else{g.miss++;g.fx=0.25;g.fxk="off!";sfx("fail");setM(g.B,"panic")}});
  g.beats=g.beats.filter(function(b){if(g.t-b>win){g.miss++;g.fx=0.25;g.fxk="miss";return false}return true});if(g.hit>=g.need&&!g.done){g.done=true;setM(g.B,"cheer");sfx("fanfare")}if(g.miss>=3&&!g.done){g.fail=true;g.ix=cx;g.iy=cy}};
 g.draw=function(){scene("vuvu",function(){paper("#2e8a4a");for(var r=0;r<5;r++)for(var i=0;i<14;i++){ctx.fillStyle=["#f2c230","#e53935","#fbf6ea","#2f6fd6","#86d27f"][(i+r)%5];ctx.beginPath();ctx.arc(i*28+(r%2)*14,H*0.06+r*22,10,0,7);ctx.fill()}tornRect(-10,H*0.18,W+20,12,"#fbf6ea",2,0);tornRect(-10,H*0.6,W+20,H*0.5,"#5fb04a",3,0)});
  ctx.save();ctx.strokeStyle=CUT;ctx.lineWidth=10;ctx.beginPath();ctx.arc(cx,cy,46,0,7);ctx.stroke();ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.stroke();
  g.beats.forEach(function(b){var d=b-g.t;if(d<0||d>per*3)return;var r=46+d*160;ctx.globalAlpha=clamp(1-d/(per*3),0.2,1);ctx.strokeStyle="#f2c230";ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke()});ctx.restore();
  stk("ball",cx,cy,1+(g.fx?0.15*g.fx/0.25:0),0,-34,-34,68,68,function(){part(E(0,0,30,30),"#fbf6ea",function(){ctx.fillStyle=INK;ctx.beginPath();for(var k=0;k<5;k++){var a=k*1.2566-1.57;ctx.lineTo(Math.cos(a)*10,Math.sin(a)*10)}ctx.fill()})});
  if(g.fx)marker(g.fxk,cx+70,cy-50,22,g.fxk==="TOOT!"?"#f2c230":"#e53935",0.1);drawChar("boet",120,H-50,160,"calm",g.t,{actor:g.B});vuvuP(170,H-180,0.9,-1.1);
  for(var i=0;i<3;i++)heart(270+i*26,H-150,18,i>=g.miss);counter(g.hit,g.need);if(g.t<1.6)hand(cx+40,cy+70,g.t,"tap")};
 g.bot=function(B){var win=0.13/Math.sqrt(sp)+0.03;if(g.beats.some(function(b){return Math.abs(g.t-b)<win*0.5}))if(!g.lastb||g.t-g.lastb>per*0.6){g.lastb=g.t;B.tap(180,300)}};
 return g});
// ===== N3. Robot Hawker (SWIPE) =====
function hawkItem(k,x,y,s,r){stk("hk"+k,x,y,s,r||0,-40,-40,80,80,function(){if(k===0){part(RR(-26,-30,52,60,6),"#2b2b33",function(){ctx.fillStyle="#7fd3f0";ctx.fillRect(-20,-24,40,44)})}else if(k===1){part(RR(-34,-6,68,12,4),"#e53935");part(RR(-6,-30,12,60,4),"#f2c230")}else if(k===2){part(E(0,0,26,26),"#e86a4a",function(){ctx.fillStyle="#2e8a4a";ctx.fillRect(-3,-30,6,10)});part(E(0,-28,8,4),"#2e8a4a")}else{part(function(){ctx.moveTo(-28,-20);ctx.lineTo(28,-20);ctx.lineTo(22,26);ctx.lineTo(-22,26);ctx.closePath()},"#f2c230",function(){ctx.fillStyle="#e53977";ctx.fillRect(-26,-6,52,8)});inkLine([-12,-20,-8,-34,8,-34,12,-20],3)}})}
function robotP(x,y,s,c){stk("robot"+c,x,y,s,0,-24,-70,48,170,function(){part(RR(-5,20,10,80,3),"#555b66");part(RR(-20,-66,40,90,8),"#2b2b33",function(){["#e53935","#f2c230","#2e8a4a"].forEach(function(col,i){ctx.fillStyle=i===c?col:"rgba(255,255,255,.12)";ctx.beginPath();ctx.arc(0,-46+i*28,10,0,7);ctx.fill()})})})}
def("hawker",{name:"Robot Hawker",word:"NO THANKS!",who:"uncle",cap:"Made eye contact with every hawker at the robot",dur:5,timeoutWin:true,how:"swipe",hint:"Swipe each offer card away",nw:1,
 dv:{title:"SOLD!",col:"#00acc1",sub:"bought EVERYTHING",bg:dBurst("#c4e9f7","#b0e0f2","#5d5866"),fg:function(t){var gy=H*DG,tq=sq12(t);drawChar("uncle",180,gy,190,"sad",t,{pop:popK(t)});[[100,gy-200,0,-0.3],[260,gy-210,1,0.4],[80,gy-90,2,0.1],[280,gy-80,3,-0.2],[180,gy-250,1,0.9]].forEach(function(q,i){stk("hkd"+i,q[0],q[1],1,q[3],-24,-24,48,48,function(){part(RR(-18,-18,36,36,4),["#f2c230","#e53935","#86d27f","#00acc1"][i%4])})})}}},function(sp){
 var g={off:[],need:Math.min(5,3+Math.floor(sp*0.7)),got:0,sp0:0.25,A:actor("uncle"),botG:0};setM(g.A,"panic");
 var ITEMS=[["PHONE","#00acc1"],["HAT","#e53935"],["FRUIT","#86d27f"],["CABLE","#f2c230"],["SPEAKER","#7b1fa2"]];
 function robotP(x,y,green){stk("robo"+(green?1:0),x,y,1.3,0,-50,-70,100,140,function(){
  part(RR(-36,-60,72,90,8),green?"#86d27f":"#e53935",function(){part(RR(-26,-48,22,22,3),"#fffaf0");part(RR(4,-48,22,22,3),"#fffaf0");ctx.fillStyle=INK;ctx.beginPath();ctx.arc(-15,-37,4,0,7);ctx.arc(15,-37,4,0,7);ctx.fill();
   if(MODE!=="shadow"){ctx.font="11px "+FM;ctx.fillStyle="#fffaf0";ctx.textAlign="center";ctx.fillText(green?"GO":"WAIT",0,-8)}});
  limb([0,30,0,50,0,70],5,"#c8ccd2");limb([-20,20,-40,40,-50,55],4,"#c8ccd2");limb([20,20,40,40,50,55],4,"#c8ccd2")})}
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;g.sp0-=dt;if(g.sp0<=0&&g.got<g.need){g.sp0=Math.max(0.45,0.85/Math.sqrt(sp));var it=ITEMS[g.got%ITEMS.length];g.off.push({x:180,y:H*0.38,vx:0,vy:0,lab:it[0],col:it[1],life:1.6/Math.sqrt(sp),L:1.6/Math.sqrt(sp),gone:0})}
  g.off.forEach(function(o){if(o.gone){o.x+=o.vx*dt;o.y+=o.vy*dt;o.gone+=dt;return}o.life-=dt;
   ptr.swipes.forEach(function(sw){if(!o.gone&&Math.abs(sw.x-o.x)<70&&Math.abs(sw.y-o.y)<70){o.gone=0.01;o.vx=sw.dx*8;o.vy=sw.dy*8;g.got++;goodTap(o.x,o.y,o.col);setM(g.A,"happy")}});
   if(o.life<=0&&!o.gone){g.fail=true;g.ix=o.x;g.iy=o.y;punch(o.x,o.y)}});
  g.off=g.off.filter(function(o){return!o.gone||o.gone<0.45});
  g.botG=g.got/g.need;if(g.got>=g.need&&!g.done){g.done=true;setM(g.A,"cheer");confetti(180,H*0.4,16)}};
 g.draw=function(){scene("hawk2",function(){paper("#c9ad72");tornRect(-10,-10,W+20,H*0.28,"#7fb8e0",3,0);band(H*0.55,H*0.5,"#5d5866",5);
  ctx.fillStyle="#fffaf0";for(var i=0;i<6;i++)ctx.fillRect(i*70+10,H*0.58,40,6);sceneLabel("ROBOT",60,H*0.14,-0.05,"#fffaf0")});
  // traffic light pole
  stk("tl2",40,H*0.42,1,0,-16,-50,32,100,function(){limb([0,-40,0,0,0,40],6,"#2b1b33");[ -28,-8,12].forEach(function(yy,i){part(function(){ctx.arc(0,yy,10,0,7)},i===0?(g.botG>=1?"#86d27f":"#e53935"):"#5a4a4a")})});
  robotP(180,H*0.62,g.botG>=1);
  g.off.forEach(function(o){var k=o.gone?1:easeOutBack(Math.min(1,(o.L-o.life)/0.2));ctx.save();ctx.translate(o.x,o.y);ctx.scale(k,k);ctx.rotate(o.gone?o.gone*2:Math.sin(g.t*6)*0.05);
   stk("card"+o.lab,0,0,1.1,0,-55,-40,110,80,function(){part(RR(-48,-32,96,64,6),"#fffaf0",function(){ctx.fillStyle=o.col;ctx.fillRect(-48,-32,96,14);if(MODE!=="shadow"){ctx.font="20px "+FM;ctx.fillStyle=INK;ctx.textAlign="center";ctx.fillText(o.lab,0,8);ctx.font="14px "+FT;ctx.fillText("R50",0,28)}})});
   ctx.restore();if(!o.gone&&o.life<0.5)danger(1-o.life/0.5,g.t);halo(o.x,o.y,50,"#f2c230",g.t)});
  // swipe hint arrows on first card
  if(g.off[0]&&!g.off[0].gone&&g.t<2){var o=g.off[0];arrow(o.x-70,o.y,o.x-120,o.y-20,"#e53935");arrow(o.x+70,o.y,o.x+120,o.y-20,"#e53935")}
  drawChar("uncle",300,H-50,130,g.done?"cheer":"panic",g.t,{actor:g.A,flip:true});
  counter(g.got,g.need);marker(g.botG>=1?"GREEN!":"SWIPE AWAY",180,H*0.22,16,"#fffaf0",0);
  if(g.t<1.4&&g.off[0])hand(g.off[0].x+40,g.off[0].y,g.t,"swipe")};
 g.bot=function(B){var o=g.off.find(function(x){return!x.gone});if(o&&o.L-o.life>0.15)B.swipe(o.x,o.y,RNG()<0.5?-120:120,RNG()<0.5?-40:40)};
 return g});

def("door",{name:"Shut the Taxi Door",word:"SLIDE!",who:"gaatjie",cap:"Left the sliding door open on the highway",dur:4.5,timeoutWin:false,how:"drag",hint:"Drag the door shut against the spring",nw:1,
 dv:{title:"WAIT!!",col:"#e53935",sub:"the taxi left without him",bg:function(){paper("#3a3f47");ctx.fillStyle="#f2c230";for(var y=0;y<H;y+=60)ctx.fillRect(176,y,8,32);tornRect(-10,H*0.62,W+20,H*0.5,"#86b84a",3,0)},fg:function(t){var gy=H*DG,tq=sq12(t);drawTaxi(180,gy-280-t*120,60,t,{spin:t*30});drawChar("gaatjie",180,gy,190,"run",t,{pop:popK(t)});stxt("WAIT!",250,gy-210,26,"#fffaf0",0.15);for(var i=0;i<3;i++){var p=(t*2+i/3)%1;ctx.globalAlpha=1-p;blob(150+i*10,gy-6,8+p*12,5+p*6,"#9a8a74");ctx.globalAlpha=1}}}},function(sp){
 var g={p:1,A:actor("gaatjie"),hold:0};var x0=70,x1=280;g.stiff=0.48+0.18*sp;
 function taxiSide(ox,open){stk("taxside"+Math.round(open*8),ox,H*0.52,1.15,0,-150,-110,300,200,function(){
  part(RR(-140,-70,280,130,10),"#fbf6ea",function(){ctx.fillStyle="#e53935";ctx.fillRect(-140,-18,280,18);ctx.fillStyle="#2b1b33";ctx.fillRect(-130,40,260,8)});
  part(RR(-120,-58,70,40,4),"#7fb8e0");part(RR(-40,-58,50,40,4),"#7fb8e0");
  var gap=30+open*90;part(RR(20,-60,gap,100,2),"#3a3f47");if(MODE!=="shadow"){ctx.strokeStyle="#e53935";ctx.lineWidth=4;ctx.strokeRect(20,-60,gap,100)}
  part(RR(20+gap*0.15,-58,70,96,4),"#fffaf0",function(){part(RR(10,20,20,14,3),"#7fb8e0");ctx.fillStyle="#c8ccd2";ctx.fillRect(48,30,10,30)});
  [-90,90].forEach(function(wx){part(function(){ctx.arc(wx,62,22,0,7)},"#2b1b33");part(function(){ctx.arc(wx,62,10,0,7)},"#c8ccd2")});
  if(MODE!=="shadow"){ctx.fillStyle="#f2c230";for(var i=0;i<12;i++)ctx.fillRect(-130+i*22,-18,14,18)}
 })}
 g.update=function(dt){g.t+=dt;g.A.mt+=dt;var hx=x0+(x1-x0)*g.p;if(ptr.down&&Math.abs(ptr.y-H*0.48)<120&&(g.grab||Math.abs(ptr.x-hx)<80)){g.grab=1;var tp=clamp((ptr.x-x0)/(x1-x0),0,1);g.p+=(tp-g.p)*Math.min(1,dt*14)}else{g.grab=0;g.p=Math.min(1,g.p+dt*g.stiff*(0.55+0.45*Math.sin(g.t*6.5)))}
  if(g.p<0.06){g.hold+=dt;if(g.hold>0.12&&!g.done){g.done=true;punch(100,H*0.48);sfx("thud");setM(g.A,"happy");confetti(100,H*0.4,14)}}else g.hold=0;
  if(g.t>=g.dur-0.02&&!g.done){g.fail=true;g.ix=hx;g.iy=H*0.48}};
 g.draw=function(){scene("door2",function(){paper("#5a6a78");ctx.fillStyle="#3a3f47";ctx.fillRect(0,H*0.22,W,H*0.5);ctx.fillStyle="#f2c230";for(var i=0;i<8;i++){var y=H*0.44+((i*50+g.t*280)%400)-40;ctx.fillRect(172,y,16,28)}
  tornRect(-10,H*0.7,W+20,H*0.4,"#86b84a",4,0);sceneLabel("N1 HIGHWAY",70,H*0.18,-0.04,"#fffaf0")});
  if(g.p>0.3)speedLines(300,H*0.4,g.t*0.5,"rgba(255,250,240,.35)");
  taxiSide(180,g.p);var hx=x0+(x1-x0)*g.p;
  stk("hdl2",hx,H*0.48,1.4,0,-28,-20,56,40,function(){part(RR(-22,-14,44,28,8),"#f2c230",function(){part(RR(-14,-6,28,12,4),"#fffaf0")})});
  halo(hx,H*0.48,36,g.grab?"#86d27f":"#f2c230",g.t);
  if(g.p>0.15){ctx.save();ctx.globalAlpha=0.7+0.3*Math.sin(g.t*10);arrow(hx-10,H*0.62,hx-90,H*0.62,"#e53935");ctx.restore()}
  drawChar("gaatjie",60,H-48,130,g.done?"cheer":(g.grab?"reach":"panic"),g.t,{actor:g.A});
  marker(g.done?"SHUT!":Math.round(g.p*100)+"% OPEN",180,H*0.78,18,g.p<0.2?"#86d27f":"#fffaf0",0);
  danger(clamp((g.t-(g.dur-1.4))/1.4,0,1)*(g.done?0:1),g.t);if(g.t<1.6)hand(hx+10,H*0.52,g.t,"swipe")};
 g.bot=function(B){var hx=x0+(x1-x0)*g.p;if(!g.grab)B.hold(true,hx,H*0.48);else B.move(30,H*0.48)};
 return g});

def("braai",{name:"Fan the Braai",word:"FAN!",who:"uncle",cap:"Used petrol to 'help' the braai along",dur:5,timeoutWin:false,how:"circle",hint:"Draw circles over the coals",nw:1,
 dv:{title:"COUGH!",col:"#9a9aa6",sub:"just a splash, he said",bg:dBurst("#e0dcea","#d2cce0","#c9ad72"),fg:function(t){var gy=H*DG,tq=sq12(t);for(var i=0;i<6;i++){var p=(t*0.5+i/6)%1;ctx.globalAlpha=0.9-0.6*p;blob(180+Math.sin(i*2+p*3)*60,gy-80-p*260,26+p*30,22+p*20,"#8a8a96");ctx.globalAlpha=1}drawChar("uncle",180,gy,190,"shock",t,{pop:popK(t)});
  [[170,gy-120],[196,gy-100]].forEach(function(s){flat("soot",s[0],s[1],1,s[0],-12,-8,24,16,function(){ctx.fillStyle="rgba(43,27,51,.55)";ctx.beginPath();ctx.ellipse(0,0,10,6,0.3,0,7);ctx.fill()})});stxt("*cough*",90,gy-200,20,"#fffaf0",-0.1);stk("tongs2",270,gy-40,1,0.6,-8,-50,16,100,function(){limb([0,-46,2,0,0,46],4,"#c8ccd2")})}}},function(sp){
 var g={heat:0.25,need:1,ang:null,acc:0,U:actor("uncle"),dec:0.1};var cx=180,cy=H*0.5;setM(g.U,"panic");
 g.update=function(dt){g.t+=dt;g.U.mt+=dt;if(ptr.down){var a=Math.atan2(ptr.y-cy,ptr.x-cx),d=Math.hypot(ptr.x-cx,ptr.y-cy);if(d>25&&d<170&&g.ang!=null){var da=a-g.ang;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;g.acc+=Math.abs(da);g.heat+=Math.abs(da)*0.055/Math.pow(sp,0.2);if(Math.floor(g.acc/3)!==Math.floor((g.acc-Math.abs(da))/3)){sfx("whoosh");burst(cx+rnd(-40,40),cy,"#ff9a2e",3)}}g.ang=d>25?a:null}else g.ang=null;
  g.heat=Math.max(0,g.heat-dt*g.dec);if(g.heat>=1&&!g.done){g.done=true;setM(g.U,"cheer");sfx("sizzle");confetti(cx,cy-40,12,["#ff9a2e","#f2c230","#e53935"])}if(g.t>=g.dur-0.02&&!g.done){g.fail=true;g.ix=cx;g.iy=cy}};
 g.draw=function(){scene("braai",function(){braaiYard();stk("drum",180,H*0.6,1.5,0,-80,-40,160,110,function(){part(function(){ctx.moveTo(-66,-20);ctx.lineTo(66,-20);ctx.quadraticCurveTo(62,30,0,34);ctx.quadraticCurveTo(-62,30,-66,-20)},"#2b2b33");limb([-40,26,-50,50,-56,70],5,"#555b66");limb([40,26,50,50,56,70],5,"#555b66")})});
  var k=clamp(g.heat,0,1),n=Math.floor(g.t*12)%3;ctx.save();ctx.translate(cx,H*0.6-30);for(var i=0;i<7;i++){var x=-54+i*18;ctx.fillStyle=k>0.5?"#ff6a2e":"#5a4a4a";ctx.beginPath();ctx.arc(x,(i%2)*4,9,0,7);ctx.fill();ctx.fillStyle="rgba(255,200,80,"+(k*0.9)+")";ctx.beginPath();ctx.arc(x,(i%2)*4,5,0,7);ctx.fill()}ctx.restore();
  if(k>0.15)for(var j=0;j<3;j++)flameF(cx-36+j*36,H*0.6-34,k*(0.8+0.2*((j+n)%2)),g.t+j);else{ctx.globalAlpha=0.6;blob(cx,H*0.42+Math.sin(g.t*3)*6,18,12,"#9a9aa6");ctx.globalAlpha=1}
  ctx.save();ctx.globalAlpha=0.35;ctx.setLineDash([6,8]);ctx.strokeStyle="#fffaf0";ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,95,0,7);ctx.stroke();ctx.restore();ctx.setLineDash([]);
  stk("fan",ptr.down?ptr.x:cx+95,ptr.down?ptr.y:cy,1,ptr.down?Math.sin(g.t*30)*0.3:0.3,-30,-40,60,80,function(){part(E(0,-12,24,22),"#e53977",function(){ctx.strokeStyle="rgba(255,255,255,.4)";ctx.lineWidth=2;for(var i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(i*10,-30);ctx.stroke()}});limb([0,8,0,20,0,34],4,"#a8743a")});
  ctx.fillStyle=INK;ctx.fillRect(30,H*0.12,300,16);ctx.fillStyle=k>0.8?"#e53935":"#ff9a2e";ctx.fillRect(33,H*0.12+3,294*k,10);marker("HEAT",180,H*0.12+34,15,INK,0);drawChar("uncle",60,H-50,140,"calm",g.t,{actor:g.U});if(g.t<2)hand(cx,cy,g.t,"circle");danger(clamp((g.t-(g.dur-1.5))/1.5,0,1)*(g.done?0:1),g.t)};
 g.bot=function(B){var a=g.t*11;B.hold(true,cx+Math.cos(a)*95,cy+Math.sin(a)*95)};
 return g});
// ===== N6. Spaza Queue (ORDER: tap the list in sequence) =====
var SPZ=[["bread","#e8b06a"],["milk","#fbf6ea"],["eggs","#f2c230"],["airtime","#00acc1"],["sugar","#f39bbd"],["chips","#e53977"]];
function spzP(i,x,y,s,dim){stk("spz"+i+(dim?1:0),x,y,s,0,-34,-34,68,68,function(){var c=SPZ[i][1];if(dim)c="#9a9aa6";if(i===0){part(function(){ctx.moveTo(-26,20);ctx.lineTo(-26,-6);ctx.quadraticCurveTo(-26,-24,0,-24);ctx.quadraticCurveTo(26,-24,26,-6);ctx.lineTo(26,20);ctx.closePath()},c,function(){ctx.fillStyle="rgba(122,74,42,.35)";for(var k=-16;k<20;k+=10)ctx.fillRect(k,-20,3,10)})}
 else if(i===1){part(function(){ctx.moveTo(-16,26);ctx.lineTo(-16,-10);ctx.lineTo(0,-28);ctx.lineTo(16,-10);ctx.lineTo(16,26);ctx.closePath()},c,function(){ctx.fillStyle=dim?"#777":"#2f6fd6";ctx.fillRect(-16,0,32,10)})}else if(i===2){part(RR(-28,-14,56,30,6),dim?c:"#c8ccd2",function(){[-16,0,16].forEach(function(x){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,0,7,9,0,0,7);ctx.fill()})})}
 else if(i===3){part(RR(-24,-18,48,36,4),c,function(){ctx.fillStyle="#fffaf0";ctx.fillRect(-18,-4,36,8)})}else if(i===4){part(RR(-20,-26,40,52,6),c,function(){ctx.fillStyle="#fffaf0";ctx.fillRect(-20,-6,40,12)})}else{chipsP(0,0,0.85,0)}})}
def("spaza",{name:"Spaza Queue",word:"ORDER!",who:"tannie",cap:"Forgot the list at the front of the spaza queue",dur:5,timeoutWin:false,how:"tap",hint:"Tap the items in the list order",nw:1,
 dv:{title:"NEXT!",col:"#e86a4a",sub:"back of the queue, sisi",bg:dBurst("#ffd8b0","#ffca98","#c98a5a"),fg:function(t){var gy=H*DG,tq=sq12(t);flat("spzq",150,gy-40,1,0,-150,-150,280,180,function(){for(var i=0;i<4;i++)drawChar(["boet","auntie","uncle","gogo"][i],-90+i*40,-i*6,110,"calm",i*0.37,{ph:i})});drawChar("tannie",250,gy+10,190,"sad",t,{pop:popK(t)});
  stk("list",310,gy-160+Math.sin(tq*3)*20,1,0.3+t*0.3,-24,-30,48,60,function(){part(RR(-18,-24,36,48,2),"#fffdf5",function(){for(var k=0;k<4;k++)inkLine([-12,-14+k*10,12,-14+k*10],1.5,"rgba(43,27,51,.5)")})});bubble("NEXT!",120,gy-210,90,-0.08)}}},function(sp){
 var n=Math.min(4,2+Math.floor(sp*0.7)),order=[],pool=[0,1,2,3,4,5];for(var i=0;i<n;i++){var j=Math.floor(RNG()*pool.length);order.push(pool.splice(j,1)[0])}
 var g={order:order,i:0,T:actor("tannie"),wr:0,its:[]},slots=[[70,0.5],[180,0.5],[290,0.5],[70,0.66],[180,0.66],[290,0.66]];var all=[0,1,2,3,4,5].sort(function(){return RNG()-0.5});all.forEach(function(k,ix){g.its.push({k:k,x:slots[ix][0],y:slots[ix][1],got:0})});
 g.update=function(dt){g.t+=dt;g.T.mt+=dt;g.wr=Math.max(0,g.wr-dt);ptr.taps.forEach(function(p){g.its.forEach(function(it){if(it.got||Math.abs(p.x-it.x)>52||Math.abs(p.y-it.y*H)>52)return;if(it.k===g.order[g.i]){it.got=1;g.i++;sfx("coin",g.i);vib(6);burst(it.x,it.y*H,"#f2c230",5);if(g.i>=n&&!g.done){g.done=true;setM(g.T,"happy");sfx("bell")}}else{g.wr=0.4;g.err=(g.err||0)+1;sfx("fail");if(g.err>=2){g.fail=true;g.ix=it.x;g.iy=it.y*H}}})})};
 g.draw=function(){scene("spaza",function(){paper("#f3e3c4");tornRect(-10,-10,W+20,H*0.16,"#e86a4a",5,0);sceneLabel("SISI'S SPAZA",120,H*0.07,-0.03,"#fffaf0");ctx.fillStyle="#2e8a4a";for(var x=0;x<W;x+=40)ctx.fillRect(x,H*0.15,20,8);tornRect(-10,H*0.42,W+20,H*0.34,"#a8743a",6,0);ctx.fillStyle="rgba(43,27,51,.15)";ctx.fillRect(0,H*0.58,W,4);tornRect(-10,H*0.76,W+20,H*0.3,"#7a8290",4,0)});
  stk("note",200,H*0.27,1,0.04,-74,-62,148,124,function(){part(RR(-66,-54,132,108,3),"#fffdf5");inkLine([-66,-34,66,-34],1.2,"rgba(229,57,53,.5)")});g.order.forEach(function(k,ix){ctx.save();ctx.globalAlpha=ix<g.i?0.4:1;txtM((ix+1)+". "+SPZ[k][0],200,H*0.27-28+ix*21,17,ix===g.i?"#e53935":INK);if(ix<g.i)inkLine([150,H*0.27-28+ix*21,250,H*0.27-30+ix*21],2.4,"#2e8a4a");ctx.restore()});
  g.its.forEach(function(it){if(!it.got)spzP(it.k,it.x,it.y*H,1.1+(g.wr?0.05*Math.sin(g.t*40):0))});drawChar("tannie",60,H*0.37,120,"calm",g.t,{actor:g.T});if(g.wr)marker("not that!",180,H*0.4,20,"#e53935",-0.05);if(g.t<1.6){var f=g.its.find(function(q){return q.k===g.order[0]});if(f&&!f.got)hand(f.x+20,f.y*H+30,g.t,"tap")}counter(g.i,n)};
 g.bot=function(B){if(g.t%0.25<0.02&&g.i<n){var f=g.its.find(function(q){return q.k===g.order[g.i]});if(f)B.tap(f.x,f.y*H)}};
 return g});
function txtM(s,x,y,size,col){ctx.font=size+"px "+FM;ctx.fillStyle=col;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(s,x,y)}
// ---------- v1.0 meta: runner, input, bots, screens ----------
var LIST=Object.keys(DEF),S=null,bag=[],Q=new URLSearchParams(location.search),BOT=Q.get("bot")==="1";
var DPRMAX=Math.min(2,window.devicePixelRatio||1),DPRC=clamp(LS.get("q",DPRMAX),1,DPRMAX),FEMA=16,FBAD=0,FGOOD=0;
function adapt(ms){if(ms>250)return;FEMA+=(ms-FEMA)*0.15;if(FEMA>20&&DPRC>1.01){FGOOD=0;if(++FBAD>10){DPRC=Math.max(1,DPRC-(DPRC>1.5?0.5:0.25));FBAD=0;FEMA=16;resize();LS.set("q",DPRC)}}else{FBAD=0;if(FEMA<14&&DPRC<DPRMAX){if(++FGOOD>240){DPRC=Math.min(DPRMAX,DPRC+0.25);FGOOD=0;resize();LS.set("q",DPRC)}}else FGOOD=0}}
ptr.down=false;ptr.swipes=[];
var BOTI={tap:function(x,y){ptr.x=x;ptr.y=y;ptr.taps.push({x:x,y:y})},move:function(x,y){ptr.x=x;ptr.y=y},hold:function(on,x,y){ptr.down=!!on;if(x!=null){ptr.x=x;ptr.y=y}},swipe:function(x,y,dx,dy){ptr.swipes.push({x:x,y:y,dx:dx,dy:dy})}};
function frame(now){raf=requestAnimationFrame(frame);if(last)adapt(now-last);var dt=Math.min(0.05,(now-(last||now))/1000);last=now;if(!run)return;CLK+=dt;step(dt);if(run)draw();ptr.taps.length=0;ptr.swipes.length=0}
function step(dt){var r=run;HIT=Math.max(0,HIT-dt);popT=Math.max(0,popT-dt);shake=SET.rm?0:Math.max(0,shake-dt);flashT=Math.max(0,flashT-dt);stepParts(dt);
 // hit-stop: freeze gameplay clocks briefly so impacts read
 var pdt=(r.phase==="play"&&HIT>0)?dt*0.08:dt;r.pt+=pdt;
 if(r.phase==="intro"){if(r.pt>=r.introT){r.phase="play";r.pt=0;ptr.taps.length=0;ptr.swipes.length=0;RNG=r.rng}return}
 if(r.phase==="play"){if(BOT&&r.g.bot&&r.pt>0.05)r.g.bot(BOTI);r.g.update(pdt);var dur=r.g.dur/Math.pow(r.sp,0.5);r.left=Math.max(0,dur-r.pt);if(r.g.fail)end(false);else if(r.g.done)end(true);else if(r.pt>=dur)end(!!r.g.timeoutWin);return}
 if(r.phase==="res"){r.pt+=dt-pdt;if(r.pt>=r.resT){r.phase="wait";if(BOT)ptr.down=false;r.cb(r.win)}}}
function end(win){var r=run;r.win=win;r.phase="res";r.pt=0;RNG=Math.random;HIT=0;
 if(win){r.resT=0.85;flashT=SET.rm?0:0.22;popT=SET.rm?0:0.2;confetti(180,H*0.4,26);sfx(pick(["win","fanfare","coin"]),3);vib(14);hitStop(0.05)}
 else{r.resT=2.5;shake=SET.rm?0:0.42;hitStop(0.1);sfx("fail");vib([40,30,90]);
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
 drawParts();if(flashT>0){ctx.fillStyle="rgba(255,250,240,"+(flashT*1.1)+")";ctx.fillRect(0,0,W,H)}if(popT>0){ctx.save();ctx.globalAlpha=popT*2;ctx.strokeStyle="#f2c230";ctx.lineWidth=6;ctx.beginPath();ctx.arc(180,H*0.42,30+(1-popT)*80,0,7);ctx.stroke();ctx.restore()}if(r.phase!=="intro")hud(r)}
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
