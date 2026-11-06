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
