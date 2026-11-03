// EISH! Ways to Go - South African microgame chaos. Pure canvas + WebAudio, vector sticker-puppet cast + 2 WebP collage backgrounds.
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
function bean(id,x,y,r,face,squash){var FM2={"":"calm",x:"shock",spin:"dizzy",sad:"sad",shut:"calm"};drawChar(id,x,y+r*1.25,r*2.6,FM2[face||""]||"calm",CLK,{sy:squash||1,sx:1/(squash||1),ph:x*0.013});return;var c=CAST[id]||CAST.boet,sq=squash||1;ctx.save();ctx.translate(x,y);ctx.scale(1/sq,sq);ctx.translate(-x,-y);
 if(id==="gogo"){ell(x,y+r*0.45,r*0.85,r*0.5,"#5e35b1")}            // shawl behind
 ell(x,y,r*0.78,r,c.col);
 if(id==="boet"){ctx.save();ctx.beginPath();ctx.ellipse(x,y,r*0.78,r,0,0,7);ctx.clip();for(var i=0;i<3;i++){ctx.fillStyle="#ffd600";ctx.fillRect(x-r,y+r*0.25+i*r*0.28,2*r,r*0.12)}ctx.restore();ctx.beginPath();ctx.ellipse(x,y,r*0.78,r,0,0,7);ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();ell(x,y-r*0.92,r*0.5,r*0.18,"#1b5e20",3)}
 if(id==="auntie"){ctx.beginPath();ctx.moveTo(x-r*0.8,y-r*0.55);ctx.quadraticCurveTo(x,y-r*1.7,x+r*0.8,y-r*0.55);ctx.quadraticCurveTo(x,y-r*0.85,x-r*0.8,y-r*0.55);ctx.fillStyle="#ffeb3b";ctx.fill();ctx.lineWidth=4;ctx.stroke();circ(x+r*0.65,y-r*1.05,r*0.2,"#ffeb3b",3)}
 if(id==="uncle"){ell(x,y+r*0.05,r*0.34,r*0.1,"#5d4037",3);line(x+r*0.75,y+r*0.2,x+r*1.25,y-r*0.3,5,"#9e9e9e");line(x+r*0.75,y+r*0.25,x+r*1.3,y-r*0.15,5,"#9e9e9e")}
 if(id==="tannie"){circ(x,y-r*1.05,r*0.3,"#795548",3);for(var p=-3;p<=3;p++)circ(x+p*r*0.17,y+r*0.62+Math.abs(p)*-2,r*0.07,"#fff",1.5)}
 if(id==="gaatjie"){ctx.beginPath();ctx.ellipse(x,y-r*0.72,r*0.6,r*0.32,0,Math.PI,0);ctx.fillStyle="#e53935";ctx.fill();ctx.lineWidth=4;ctx.stroke();line(x-r*0.4,y-r*0.72,x-r*1.0,y-r*0.6,6,"#e53935");rr(x+r*0.7,y-r*0.05,r*0.25,r*0.4,4,"#fff",3)}
 eyes(x,y,r,face);if(id==="gogo"){[-1,1].forEach(function(s){ctx.beginPath();ctx.arc(x+s*r*0.28,y-r*0.25,r*0.23,0,7);ctx.lineWidth=3;ctx.strokeStyle="#111";ctx.stroke()});line(x-r*0.05,y-r*0.25,x+r*0.05,y-r*0.25,3)}
 mouth(x,y,r,face);ctx.restore()}

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
function inkLine(pts,w,col){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.lineWidth=(w||2.4)/_s;ctx.strokeStyle=col||INK;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke()}
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
 if(m==="calm"){P.sy=1+0.022*s(t*3+ph);P.sx=2-P.sy;P.lean=0.03*s(t*1.6+ph);P.head=0.06*s(t*1.9+ph);P.aR=0.3+0.08*s(t*2.2+ph);P.aL=0.26-0.06*s(t*2.2+ph);P.sec=s(t*1.9-0.8+ph);P.look=0.6*s(t*0.7+ph)}
 else if(m==="happy"){var j=Math.abs(s(t*8+ph));P.lift=j*9;P.sy=0.9+0.16*j;P.sx=2-P.sy;P.aL=2.55+0.25*s(t*16);P.aR=2.55-0.25*s(t*16);P.bL=P.bR=-0.5;P.lL=0.25*j;P.lR=-0.25*j;P.head=0.1*s(t*8);P.face="happy";P.sec=s(t*8-1)}
 else if(m==="panic"||m==="run"){var f=m==="run"?17:15;P.lean=m==="run"?0.16:0.06*s(t*9+ph);P.head=0.14*s(t*11+ph);P.aL=2.3+0.55*s(t*f+ph);P.aR=2.3+0.55*s(t*f+2+ph);P.bL=0.7*s(t*f+1);P.bR=0.7*s(t*f+3);
  P.lL=0.75*s(t*f+ph);P.lR=-0.75*s(t*f+ph);P.lift=Math.abs(s(t*f+ph))*4;P.sy=1+0.05*s(t*f*2);P.sx=2-P.sy;P.face="panic";P.sec=s(t*f-1.2)}
 else if(m==="reach"){P.lean=-0.12;P.aR=1.85+0.12*s(t*14);P.bR=0.1;P.aL=2.2+0.4*s(t*14);P.bL=0.6;P.lL=0.4;P.lR=-0.3;P.face="panic";P.head=-0.08+0.06*s(t*12);P.sec=s(t*12-1)}
 else if(m==="sad"){P.sy=0.95;P.sx=1.04;P.head=0.16;P.lean=0.05;P.aL=0.05;P.aR=0.08;P.bL=P.bR=0.1;P.face="sad";P.sec=0.3*s(t*2)}
 else if(m==="shock"||m==="dizzy"){P.aL=1.5+0.1*s(t*6);P.aR=1.5-0.1*s(t*6);P.bL=P.bR=0.2;P.lL=0.5;P.lR=-0.5;P.face=m==="shock"?"x":"spin";P.head=0.12*s(t*5)}
 return P}
function mixP(a,b,k){var o={};for(var key in b)o[key]=typeof b[key]==="number"?a[key]+(b[key]-a[key])*k:(k>0.35?b[key]:a[key]);return o}
// actor: smooth eased transitions between poses + anticipation impulses
function actor(id){return{id:id,m:"calm",pm:"calm",mt:9,imp:0,it:9}}
function setM(a,m){if(a.m===m)return;a.pm=a.m;a.m=m;a.mt=0}
function face(C,P,t){var bl=(P.face==="calm"&&(t%3.1)<0.1),lx=P.look*1.4;
 // eyes
 [-1,1].forEach(function(sd){var ex=sd*8.5,ey=-83;
  if(P.face==="x"){inkLine([ex-4,ey-4,ex+4,ey+4],3);inkLine([ex+4,ey-4,ex-4,ey+4],3);return}
  if(P.face==="spin"){ctx.beginPath();for(var k=0;k<16;k++){var a=k*0.8+t*9*sd,r=k*0.38;ctx.lineTo(ex+Math.cos(a)*r,ey+Math.sin(a)*r)}ctx.lineWidth=1.8/_s;ctx.strokeStyle=INK;ctx.stroke();return}
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
 if(f==="panic"||f==="x"||f==="spin"){var o=f==="panic"?1+0.18*Math.sin(t*30):0.6;ctx.beginPath();ctx.ellipse(0,-68.5,5.2*o,6*o,0,0,7);ctx.fillStyle="#5a1630";ctx.fill();ctx.stroke();if(f==="panic"){ctx.save();ctx.clip();ctx.fillStyle="#fff";ctx.fillRect(-6,-75.5,12,3);ctx.fillStyle="#ff7a9a";ctx.beginPath();ctx.ellipse(0,-64,4,2.5,0,0,7);ctx.fill();ctx.restore()}}
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
 cgspr("he|"+CID+P.face+P.bl+"|"+sq+"|"+lk+"|"+P.fn,-46,-134,96,88,function(){var Q={sec:sq/3,look:lk/2,face:P.face};hairBack(C,Q);part(E(0,-82,23.5,22),C.skin,null,[-18,-100,20,-62]);[-1,1].forEach(function(e){if(C.hair!=="doek"&&C.hair!=="white")part(E(e*23,-80,4,5),C.skin)});
 hairFront(C,Q);face(C,Q,P.bl?0.05:ft)});ctx.restore();
 arm(1,P.aR,P.bR,true);ctx.restore()}
// draw one character with feet at x,y, height h. o:{flip,pop,sx,sy,rot,ph,actor,ground}
var CID="";function drawChar(id,x,y,h,mood,t,o){o=o||{};var C=LOOK[id]||LOOK.boet,tq=sq12(t),ph=o.ph||0,P;
 var A=o.actor;if(A){var k=easeOut(A.mt/0.16);P=k<1?mixP(poseOf(A.pm,tq,ph),poseOf(A.m,tq,ph),k):poseOf(A.m,tq,ph)}else P=poseOf(mood,tq,ph);
 if(o.P)for(var key in o.P)P[key]=o.P[key];
 var s0=h/112*(o.pop==null?1:o.pop),fx=o.flip?-1:1,sxx=P.sx*(o.sx||1),syy=P.sy*(o.sy||1);if(s0<0.02)return;
 ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);
 if(o.ground!==false){ctx.fillStyle="rgba(43,27,51,.2)";ctx.beginPath();ctx.ellipse(0,0,h*0.2*(1-Math.min(0.5,P.lift/40)),h*0.035,0,0,7);ctx.fill()}
 var n=Math.floor(t*12);P.bl=(P.face==="calm"&&(tq%3.1)<0.1)?1:0;P.fn=P.face==="spin"?n%8:P.face==="panic"?n%4:0;
 _s=s0;ctx.scale(s0*fx*sxx,s0*syy);_s=s0*Math.min(sxx,syy);CID=id;
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
def("wors",{name:"Rescue the Wors",word:"GRAB!",who:"uncle",death:"dog",cap:"Turned his back on the wors 'for one second'",dur:3.5,timeoutWin:false,bg:"#e8d3a6"},function(sp){
 var g={dx:420,wx:200,wy:H*0.5,mv:0.15,jt:0,t:0,U:actor("uncle")};setM(g.U,"reach");var GY=H*0.70;
 g.update=function(dt){g.t+=dt;g.jt+=dt;g.U.mt+=dt;g.dx-=dt*90*sp;g.mv-=dt;
  if(g.mv<=0){g.mv=0.45/sp;for(var i=0;i<5;i++)parts.push({x:g.wx+rnd(-18,18),y:g.wy+rnd(-10,10),vx:rnd(-80,80),vy:rnd(-160,-40),l:0.35,c:"#d9c7a0",r:0,vr:rnd(-9,9),w:7,h:5,paper:1});g.wx=rnd(80,270);g.wy=H*rnd(0.44,0.6);g.jt=0;blip(300,0.04,"triangle")}
  ptr.taps.forEach(function(p){if(Math.hypot(p.x-g.wx,p.y-g.wy)<55){g.done=true;confetti(g.wx,g.wy,18);blip(820);setM(g.U,"happy")}});
  if(g.dx<g.wx+40){g.fail=true;g.ix=g.wx;g.iy=g.wy}};
 g.draw=function(){if(!cover("bg-braai")){ctx.fillStyle="#e8d3a6";ctx.fillRect(0,0,W,H)}
  var x=Math.min(440,g.dx),near=clamp(1-(x-g.wx-40)/180,0,1),bob=Math.sin(sq12(g.t)*10)*3,pk=popK(g.jt);
  if(near>0){ctx.fillStyle="rgba(229,57,53,"+(0.18*near*(0.6+0.4*Math.sin(g.t*20)))+")";ctx.fillRect(0,0,W,H)}
  // focal: soft paper halo + scribble ring + wors
  ctx.fillStyle="rgba(255,250,240,.55)";ctx.beginPath();ctx.ellipse(g.wx,g.wy+bob,52*pk,46*pk,0,0,7);ctx.fill();
  scribble(g.wx,g.wy+bob,56*pk,"#e53935",g.t);drawWors(g.wx,g.wy+bob,76*pk,g.t,{rot:Math.sin(sq12(g.t)*8)*0.12});
  marker("GRAB!",g.wx+(g.wx>200?-44:44),g.wy-58+bob,22,"#e53935",g.wx>200?-0.12:0.12,pk);
  // dog charging in from the right, motion dust
  if(x<420){for(var i=0;i<3;i++){ctx.fillStyle="rgba(217,199,160,"+(0.6-i*0.18)+")";ctx.beginPath();ctx.arc(x+48+i*16,GY-6-((sq12(g.t)*12+i)%2)*4,7-i*1.6,0,7);ctx.fill()}
   drawDog(x+18,GY,80,g.t,{});if(near>0.35)stxt("!",x-6,GY-92,34+Math.sin(g.t*30)*3,"#f2c230",0.1)}
  drawChar("uncle",80,H-62,176,"reach",g.t,{actor:g.U});
  tape(28,H*0.12,58,-0.6);tape(W-26,H*0.9,52,0.7)};return g});
def("mud",{name:"Bakkie in the Mud",word:"MASH!",who:"tannie",death:"mud",cap:"Took the 'shortcut' through the farm road after rain",dur:4,timeoutWin:false,bg:"#6d4c41"},function(sp){
 var g={need:Math.round(8+sp*3),got:0,w:0};g.update=function(dt){g.w+=dt;ptr.taps.forEach(function(){g.got++;shake=0.06;burst(180+rnd(-40,40),H*0.6,"#4e342e",4);blip(200+g.got*20,0.05)});if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#90caf9";ctx.fillRect(0,0,W,H*0.5);ctx.fillStyle="#6d4c41";ctx.fillRect(0,H*0.5,W,H);var p=g.got/g.need;bakkie(180,H*0.62-p*120,"tannie",Math.sin(g.w*30)*0.05);ell(180,H*0.68,150,30,"#4e342e",0);rr(40,80,280,26,13,"#fff");rr(40,80,Math.max(26,280*p),26,13,"#ffb300");txt("MASH THE SCREEN!",180,140,24,"#fff")};return g});
def("unplug",{name:"Surge Incoming",word:"UNPLUG!",who:"auntie",death:"soot",cap:"Left the kettle plugged in when the power came back",dur:3.5,timeoutWin:false,bg:"#fff3e0"},function(sp){
 var n=Math.min(5,3+Math.floor(sp-0.5)),g={p:[]},it=["TV","KETTLE","FRIDGE","PC","TOASTER"];for(var i=0;i<n;i++)g.p.push({x:70+(i%3)*110,y:H*(0.3+Math.floor(i/3)*0.25),n:it[i],off:false});
 g.update=function(dt){ptr.taps.forEach(function(q){g.p.forEach(function(p){if(!p.off&&Math.abs(q.x-p.x)<55&&Math.abs(q.y-p.y)<60){p.off=true;burst(p.x,p.y,"#ffb300",6);blip(500)}})});if(g.p.every(function(p){return p.off}))g.done=true};
 g.draw=function(){ctx.fillStyle="#fff3e0";ctx.fillRect(0,0,W,H);txt("SURGE COMING!",180,80,28,"#e53935");g.p.forEach(function(p){rr(p.x-40,p.y-40,80,60,8,"#cfd8dc");txt(p.n,p.x,p.y-10,13,"#fff");line(p.x,p.y+20,p.x,p.y+60,5);if(p.off)rr(p.x-10,p.y+70,20,14,3,"#616161");else{rr(p.x-10,p.y+56,20,14,3,"#616161");if(Math.random()<0.3)line(p.x+12,p.y+60,p.x+24,p.y+50,3,"#ffd600")}});bean("auntie",180,H-70,32,"sad")};return g});
def("quantum",{name:"Taxi Rank Crossing",word:"CROSS!",who:"gogo",death:"flat",cap:"Stood in the taxi lane arguing about the fare",dur:5,timeoutWin:false,bg:"#e8d3a6"},function(sp){
 var NL=4,g={lane:0,from:0,cars:[],hop:0,t:0,ht:9,G:actor("gogo")};for(var i=1;i<=NL;i++)g.cars.push({l:i,x:rnd(0,360),v:(i%2?1:-1)*rnd(130,185)*sp});
 var LY=[0.925,0.756,0.58,0.40,0.218,0.05];function ly(l){return H*LY[Math.min(l,NL+1)]}
 g.update=function(dt){g.t+=dt;g.ht+=dt;g.G.mt+=dt;g.hop=Math.max(0,g.hop-dt);
  if(ptr.taps.length&&g.hop<=0){g.from=g.lane;g.lane++;g.hop=0.12;g.ht=0;blip(500+g.lane*90);setM(g.G,g.lane>NL?"happy":"panic");if(g.lane>NL)confetti(180,ly(NL+1),16)}
  g.cars.forEach(function(c){c.x+=c.v*dt;if(c.x>440)c.x=-80;if(c.x<-80)c.x=440;if(c.l===g.lane&&Math.abs(c.x-180)<58){g.fail=true;g.ix=180;g.iy=ly(g.lane)}});if(g.lane>NL)g.done=true};
 g.draw=function(){if(!cover("bg-road")){ctx.fillStyle="#3a3f47";ctx.fillRect(0,0,W,H)}
  var p=clamp(g.ht/0.17,0,1),gy=ly(g.from)+(ly(g.lane)-ly(g.from))*easeOutBack(p)-Math.sin(Math.PI*p)*22,
   sy=p<1?1.14-0.1*p:1-0.2*Math.exp(-(g.ht-0.17)*18)*Math.cos((g.ht-0.17)*40);
  // next-lane telegraph
  if(g.lane<=NL){var ny=ly(g.lane+1);ctx.save();ctx.globalAlpha=0.5+0.3*Math.sin(g.t*10);[0,1].forEach(function(k){arrow(180,ny+30-k*14+16,180,ny+12-k*14+16,"#f2c230")});ctx.restore()}
  stxt("SAFE!",180,ly(NL+1)+2,26,"#86d27f",-0.04);
  g.cars.slice().sort(function(a,b){return a.l-b.l}).reverse().forEach(function(c){var y=ly(c.l)+30,dir=c.v>0?1:-1;
   ctx.strokeStyle="rgba(255,250,240,.55)";ctx.lineCap="round";ctx.lineWidth=3;for(var k=0;k<3;k++){ctx.beginPath();ctx.moveTo(c.x-dir*(62+k*6),y-12-k*10);ctx.lineTo(c.x-dir*(86+k*14),y-12-k*10);ctx.stroke()}
   drawTaxi(c.x,y,54,g.t,{flip:c.v>0,ph:c.l,spin:c.x/9})});
  drawChar("gogo",180,gy+28,92,"calm",g.t,{actor:g.G,sy:sy,sx:2-sy});
  marker("TAP TO HOP",W-78,H-62,18,INK,-0.05)};return g});
def("salt",{name:"Over-Salted Pap",word:"STOP!",who:"tannie",death:"salty",cap:"Let Gogo season the pap 'just a little'",dur:5,timeoutWin:false,bg:"#fff9c4"},function(sp){
 var g={need:Math.min(4,2+Math.floor(sp*0.6)),got:0,s:null,sp0:0.25};
 g.update=function(dt){g.sp0-=dt;if(!g.s&&g.sp0<=0)g.s={x:rnd(100,260),y:H*rnd(0.3,0.42),l:1.8/Math.sqrt(sp),L:1.8/Math.sqrt(sp)};if(g.s){g.s.l-=dt;ptr.taps.forEach(function(p){if(g.s&&Math.hypot(p.x-g.s.x,p.y-g.s.y)<85){burst(g.s.x,g.s.y,"#fff",8);blip(700+g.got*60);g.got++;g.s=null;g.sp0=0.35/Math.sqrt(sp)}});if(g.s&&g.s.l<=0)g.fail=true}if(g.got>=g.need)g.done=true};
 g.draw=function(){ctx.fillStyle="#fff9c4";ctx.fillRect(0,0,W,H);ell(180,H*0.72,120,40,"#9e9e9e");ell(180,H*0.68,100,22,"#fffde7");bean("gogo",320,H*0.55,30);if(g.s){circ(g.s.x,g.s.y,62*(0.6+0.4*g.s.l/g.s.L),"rgba(255,82,82,.25)",0);rr(g.s.x-26,g.s.y-40,52,80,12,"#eceff1");circ(g.s.x,g.s.y-36,16,"#90a4ae",3);txt("TAP",g.s.x,g.s.y+4,16,"#e53935");for(var i=0;i<3;i++)circ(g.s.x+rnd(-8,8),g.s.y+50+i*20*(1-g.s.l/g.s.L),3,"#fff",1)}txt(g.got+"/"+g.need+" stopped",180,60,24,"#ff7043");bean("tannie",60,H-80,30,"sad")};return g});
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
 else if(k==="dog"){cover("bg-braai")||sunburst("#fff59d","#ffe082",t);var tq=sq12(t),dx=Math.min(cx+150,cx+40+t*30),dy=cy+120;
  speedLines(dx,dy-40,t,"rgba(255,250,240,.7)");
  drawChar(who,cx-78,cy+130,210,"reach",t,{pop:popK(t),P:{aR:1.6+0.15*Math.sin(tq*14),bR:0.05}});
  for(var i=0;i<4;i++){ctx.fillStyle="rgba(217,199,160,"+(0.7-i*0.15)+")";ctx.beginPath();ctx.arc(dx-44-i*18,dy-8-(i%2)*6,10-i*2,0,7);ctx.fill()}
  drawDog(dx,dy,100,t,{flip:true,mouth:function(){}});drawWors(dx+52,dy-50-Math.abs(Math.sin(tq*20))*6,34,t,{rot:0.4});
  stxt("WOEF!",dx+10,dy-130,38,"#2f6fd6",0.12,popK(t-0.15));marker("my wors!!",cx-86,cy-110,24,"#e53935",-0.12,popK(t-0.3))}
 else if(k==="mud"){ctx.fillStyle="#6d4c41";ctx.fillRect(0,cy+20,W,H);bean(who,cx,cy+20,60,"x");ctx.fillStyle="#6d4c41";ctx.fillRect(0,cy+30,W,H);for(var m=0;m<6;m++)circ(cx-60+m*24,cy+28,12,"#6d4c41",0);txt("BLUB",cx+90,cy-40-((t*30)%30),24,"#fff")}
 else if(k==="soot"){bean(who,cx,cy,60,"x");ctx.globalAlpha=0.75;ell(cx,cy,48,62,"#212121",0);ctx.globalAlpha=1;eyes(cx,cy,60,"");for(var c2=0;c2<4;c2++)circ(cx-40+c2*25,cy-90-((t*40+c2*15)%50),14,"#9e9e9e",0);txt("POOF!",cx,cy-140,32,"#fff")}
 else if(k==="flat"){cover("bg-road")||sunburst("#fff59d","#ffe082",t);var tq=sq12(t),f=easeOutBack(t/0.25),fy=cy+70;
  drawTaxi(cx+60+t*260,fy-70,52,t,{flip:true,spin:t*30});
  drawChar(who,cx-78,fy+2,160,"dizzy",t,{ground:false,rot:Math.PI/2*Math.min(1,f),sx:1+0.25*Math.min(1,f),sy:1-0.18*Math.min(1,f)});
  ctx.save();ctx.globalAlpha=0.28;ctx.fillStyle="#1d1f24";ctx.fillRect(0,fy-8,W,22);ctx.fillStyle="#3a3e46";for(var x=-((t*80)%24);x<W;x+=24){ctx.beginPath();ctx.moveTo(x,fy-8);ctx.lineTo(x+12,fy+3);ctx.lineTo(x,fy+14);ctx.lineTo(x+6,fy+14);ctx.lineTo(x+18,fy+3);ctx.lineTo(x+6,fy-8);ctx.fill()}ctx.restore();
  for(var k=0;k<3;k++){var a=tq*4+k*2.09;star(cx+66+Math.cos(a)*40,fy-52+Math.sin(a)*10,11,tq*3+k)}
  stxt("FLAT!",cx,cy-120,58,"#e53935",-0.08,popK(t-0.1));marker("flat like a sticker",cx,cy-70,22,"#e53935",0.05,popK(t-0.25))}
 else if(k==="salty"){bean(who,cx,cy,60,"x",1.1);for(var q=0;q<12;q++)circ(cx+rnd(-80,80),cy-120+((t*150+q*30)%200),3,"#fff",1);txt("SALTY!",cx,cy-120,32,"#90a4ae")}
 else if(k==="soaked"){bean(who,cx,cy,60,"spin");ctx.beginPath();ctx.arc(cx+70,cy-70,40,0,Math.PI);ctx.fillStyle="#e53935";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#111";ctx.stroke();for(var r2=0;r2<10;r2++)line(cx-100+r2*22,cy-150+((t*300+r2*40)%200),cx-104+r2*22,cy-140+((t*300+r2*40)%200),3,"#29b6f6")}
 else if(k==="hotseat"){var jy=-Math.abs(Math.sin(t*6))*60;bean(who,cx,cy+jy,60,"x");for(var h2=0;h2<3;h2++)line(cx-30+h2*30,cy+70+jy,cx-26+h2*30,cy+90+jy,4,"#ff5252");txt("EINA!",cx,cy-130,40,"#ff5252")}
 else if(k==="saucy"){bean(who,cx,cy,60,"shut");for(var z=0;z<8;z++)circ(cx+Math.cos(z)*40,cy-20+Math.sin(z*2)*40,10,"#e53935",0);ell(cx,cy-60,40,20,"#e53935",0);txt("SPLAT!",cx,cy-130,36,"#e53935")}
 else{bean(who,cx,cy,60,"x");for(var y2=0;y2<5;y2++)line(cx-40+y2*20,cy-10,cx-40+y2*20,cy+30+((t*60+y2*10)%30),5,"#ffb300");ctx.save();ctx.translate(cx,cy-90);ctx.rotate(t*3);ell(-8,0,10,24,"#d4a017");ell(8,0,10,24,"#d4a017");ctx.restore();txt("SIES!",cx,cy-140,32,"#ffb300")}
}

// ---------- survival runner ----------
var S=null,bag=[];
var DPRMAX=Math.min(2,window.devicePixelRatio||1),DPRC=clamp(LS.get("q",DPRMAX),1,DPRMAX),FEMA=16,FBAD=0,FGOOD=0;
// adaptive quality: drop backing resolution fast when frames are slow, creep back up when there is headroom; remembered between sessions
function adapt(ms){if(ms>250)return;FEMA+=(ms-FEMA)*0.15;if(FEMA>20&&DPRC>1.01){FGOOD=0;if(++FBAD>10){DPRC=Math.max(1,DPRC-(DPRC>1.5?0.5:0.25));FBAD=0;FEMA=16;resize();LS.set("q",DPRC)}}else{FBAD=0;if(FEMA<14&&DPRC<DPRMAX){if(++FGOOD>240){DPRC=Math.min(DPRMAX,DPRC+0.25);FGOOD=0;resize();LS.set("q",DPRC)}}else FGOOD=0}}
function frame(now){raf=requestAnimationFrame(frame);if(last)adapt(now-last);var dt=Math.min(0.05,(now-(last||now))/1000);last=now;if(!run)return;CLK+=dt;step(dt);if(run)draw();ptr.taps.length=0}
function step(dt){var r=run;r.pt+=dt;shake=Math.max(0,shake-dt);flashT=Math.max(0,flashT-dt);parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt;if(p.paper){p.r+=p.vr*dt;p.vx*=0.985}});parts=parts.filter(function(p){return p.l>0});
 if(r.phase==="intro"){if(r.pt>=r.introT){r.phase="play";r.pt=0;ptr.taps.length=0}return}
 if(r.phase==="play"){r.g.update(dt);var dur=r.g.dur/Math.pow(r.sp,0.5);r.left=Math.max(0,dur-r.pt);if(r.g.fail)end(false);else if(r.g.done)end(true);else if(r.pt>=dur)end(r.g.timeoutWin);return}
 if(r.phase==="res"&&r.pt>=r.resT){r.phase="wait";r.cb(r.win)}}
function end(win){var r=run;r.win=win;r.phase="res";r.pt=0;
 if(win){r.resT=0.75;flashT=0.18;confetti(180,H*0.4,22);blip(880);setTimeout(function(){blip(1320,0.12)},80)}
 else{r.resT=2.3;shake=0.35;tone(400,0.5,"sawtooth",0.08,0,80);try{navigator.vibrate&&navigator.vibrate(120)}catch(e){}
  if(S){S.lives--;var col=LS.get("dead",{});if(!col[r.id]){col[r.id]=1;LS.set("dead",col);r.newDeath=true}}}}
function capOf(r){return CAST[r.g.who].name+" "+r.g.cap.charAt(0).toLowerCase()+r.g.cap.slice(1)+"."}
function hud(r){if(S){for(var i=0;i<3;i++)heart(28+i*30,34+(i===S.lives?Math.sin(CLK*20)*2:0),22,i<S.lives);stxt(String(S.score),W-34,34,30,"#fff",0.04)}}
function drawTimer(r){var dur=r.g.dur/Math.pow(r.sp,0.5),f=clamp((r.left==null?dur:r.left)/dur,0,1),y=H-30,x0=22,w=W-44,lo=f<0.3,wob=lo?Math.sin(CLK*40)*1.5:0;
 ctx.save();ctx.translate(0,wob);spr("tm|"+Math.round(H),x0-30,y-30,w+60,60,function(){tornRect(x0-4,y-11,w+8,22,"#fffaf0",3,0);tape(x0+4,y,26,-0.5)});ctx.restore();ctx.save();ctx.beginPath();ctx.rect(x0,y-6+wob,w*f,12);ctx.clip();ctx.fillStyle=lo?"#e53935":"#f2c230";ctx.fillRect(x0,y-6+wob,w,12);
 if(BEAD.complete&&BEAD.naturalWidth&&!lo){ctx.globalAlpha=0.9;ctx.translate(x0,y-6+wob);ctx.scale(0.5,0.5);ctx.fillStyle=beadPat();ctx.fillRect(0,0,w*2,24)}ctx.restore();
 ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.strokeRect(x0,y-6+wob,w,12)}
function kraft(){spr("kraft|"+Math.round(H),0,0,W,H,function(){ctx.fillStyle="#e8d3a6";ctx.fillRect(0,0,W,H);ctx.fillStyle=htPat();ctx.fillRect(0,0,W,H)})}
function intro(r){kraft();var p=r.pt;
 if(r.boss){sunburst("#d50000","#ff1744",p*4);stxt("BOSS SPEED!",180,H*0.16,34,"#f2c230",0.05,popK(p))}
 speedLines(180,H*0.42,p,"rgba(255,250,240,.6)");
 spr("card|"+Math.round(H)+"|"+(BEAD.naturalWidth?1:0),0,H*0.3-30,W,200,function(){tornRect(30,H*0.3,300,150,"#fffaf0",11,-0.035);if(BEAD.complete&&BEAD.naturalWidth){ctx.save();ctx.translate(30,H*0.3+4);ctx.rotate(-0.035);ctx.fillStyle=beadPat();ctx.scale(0.75,0.75);ctx.fillRect(0,0,400,24);ctx.restore()}
 tape(52,H*0.3+6,60,-0.5);tape(306,H*0.3-2,60,0.45)});
 stxt(r.g.word,180,H*0.3+82,r.g.word.length>7?46:66,"#f2c230",-0.06,popK(p));marker(r.g.name,180,H*0.3+136,20,INK,0.02,popK(p-0.08));
 drawChar(r.g.who,180,H*0.92,Math.min(240,H*0.32),"happy",p,{pop:popK(p-0.05)})}
function deathScreen(r,t){deathDraw(r.id,t);var y=H*0.66,cap=capOf(r);spr("cap|"+cap+"|"+Math.round(H),0,y-20,W,140,function(){tornRect(16,y,328,92,"#fffaf0",r.id.length*7,-0.025);tape(34,y+2,54,-0.5);tape(328,y+2,54,0.5);
 ctx.save();ctx.translate(180,y+46);ctx.rotate(-0.025);ctx.font="19px "+FT;ctx.fillStyle=INK;ctx.textAlign="center";ctx.textBaseline="middle";var wds=cap.split(" "),ln="",out=[];wds.forEach(function(k){var tt=ln?ln+" "+k:k;if(ctx.measureText(tt).width>296&&ln){out.push(ln);ln=k}else ln=tt});out.push(ln);out.forEach(function(l,i){ctx.fillText(l,0,(i-(out.length-1)/2)*23)});ctx.restore()});
 stxt(S&&S.lives>0?"-1 LIFE":"GAME OVER",180,H*0.86,36,"#e53935",-0.05,popK(t-0.35));if(r.newDeath)marker("NEW DEATH UNLOCKED!",180,H*0.93,19,"#7b1fa2",0.03,popK(t-0.55))}
function draw(){var r=run,sc=cv.width/W,shx=0,shy=0;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);BGUSE=0;ctx.setTransform(sc,0,0,sc,0,0);if(shake>0){shx=rnd(-1,1)*shake*20;shy=rnd(-1,1)*shake*20;ctx.translate(shx,shy)}try{draw1(r)}finally{if(BGC){var on=BGUSE?"block":"none";if(BGC.style.display!==on)BGC.style.display=on;var cs=cv.clientWidth/W;BGC.style.transform=shx||shy?"translate("+(shx*cs).toFixed(1)+"px,"+(shy*cs).toFixed(1)+"px)":""}}}
function draw1(r){
 if(r.phase==="intro")intro(r);
 else if(r.phase==="play"||r.win){r.g.draw();drawTimer(r);
  if(r.phase==="play"&&r.pt<0.24){ctx.save();tearPath(H*(1-easeInOut(r.pt/0.24))-10,5);ctx.fillStyle="#e8d3a6";ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=CUT;ctx.stroke();ctx.restore()}
  if(r.phase!=="play")stxt(r.winWord,180,H*0.38,60,"#86d27f",-0.08,popK(r.pt))}
 else{var t=r.pt;if(t<0.16){r.g.draw();ctx.fillStyle=t<0.05?"rgba(255,250,240,.85)":"rgba(43,27,51,.35)";ctx.fillRect(0,0,W,H);speedLines(r.g.ix||180,r.g.iy||H/2,t,"#fffaf0");stxt("EISH!",r.g.ix||180,(r.g.iy||H/2)-70,64,"#f2c230",-0.1,popK(t*2.5))}
  else if(t<0.46){var k=easeOut((t-0.16)/0.3);r.g.draw();ctx.save();tearPath(H*k+10,9);ctx.clip();deathScreen(r,t-0.16);ctx.restore();ctx.save();tearPath(H*k+10,9);ctx.lineWidth=6;ctx.strokeStyle=CUT;ctx.stroke();ctx.restore()}
  else deathScreen(r,t-0.16)}
 parts.forEach(function(p){ctx.globalAlpha=clamp(p.l*2.5,0,1);if(p.paper){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=CUT;ctx.fillRect(-p.w/2-1.5,-p.h/2-1.5,p.w+3,p.h+3);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()}else circ(p.x,p.y,6,p.c,2)});ctx.globalAlpha=1;
 if(flashT>0){ctx.fillStyle="rgba(255,250,240,"+flashT+")";ctx.fillRect(0,0,W,H)}
 if(r.phase!=="intro")hud(r)}
function toL(e){var b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*W/b.width}}
function resize(){var b=cv.getBoundingClientRect();if(!b.width)return;var dpr=DPRC;cv.width=Math.round(b.width*dpr);cv.height=Math.round(b.height*dpr);if(BGC){BGC.width=cv.width;BGC.height=cv.height;BGKEY=""}H=W*b.height/b.width}
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
var CR=null;function castRow(){var c=$("castc");if(!c)return;var ids=Object.keys(CAST),A=ids.map(function(k){return actor(k)}),busy=ids.map(function(){return 0}),t0=0;
 function size(){var b=c.getBoundingClientRect(),d=Math.min(DPRC,1.5);c.width=Math.round((b.width||360)*d);c.height=Math.round((b.height||150)*d)}size();window.addEventListener("resize",size);
 c.addEventListener("pointerdown",function(e){var b=c.getBoundingClientRect(),x=(e.clientX-b.left)*360/b.width,i=clamp(Math.floor((x-6)/58),0,5);setM(A[i],"panic");busy[i]=0.9;ac();blip(420+i*70,0.09,"triangle")});
 var last2=0,lastF=-1;function loop(now){CR=requestAnimationFrame(loop);var dt=Math.min(0.05,(now-(last2||now))/1000);last2=now;if(!$("title").classList.contains("active"))return;t0+=dt;
  if(Math.random()<dt*0.5){var i=Math.floor(Math.random()*6);if(busy[i]<=0){setM(A[i],"happy");busy[i]=0.7}}
  A.forEach(function(a,i){a.mt+=dt;if(busy[i]>0){busy[i]-=dt;if(busy[i]<=0)setM(a,"calm")}});var fn=Math.floor(t0*12);if(fn===lastF)return;lastF=fn;
  withCtx(c,360,c.height*360/c.width,function(){ctx.clearRect(0,0,W,H);var hh=H;A.forEach(function(a,i){var x=36+i*57.6,big=i%2===0;drawChar(a.id,x,hh-8-(big?0:10),hh*0.86,"calm",t0,{actor:a,ph:i*1.7,flip:i>=3})})})}
 CR=requestAnimationFrame(loop)}
function showColl(){var col=LS.get("dead",{}),box=$("collList");box.innerHTML="";LIST.forEach(function(id){var d=DEF[id],div=document.createElement("div");div.className="ce"+(col[id]?"":" locked");var c=document.createElement("canvas");c.width=240;c.height=200;div.appendChild(c);
 var p=document.createElement("p");p.textContent=col[id]?CAST[d.who].name+" "+d.cap.charAt(0).toLowerCase()+d.cap.slice(1):"???  ("+d.name+")";div.appendChild(p);box.appendChild(div);
 withCtx(c,360,300,function(){if(col[id])deathDraw(id,0.8);else{ctx.fillStyle="#555";ctx.fillRect(0,0,W,300);txt("?",180,150,120,"#888")}})});
 var cast="";Object.keys(CAST).forEach(function(k){cast+="<li><b>"+CAST[k].name+"</b> "+CAST[k].line+"</li>"});$("castList").innerHTML=cast;show("coll")}

function init(){cv=$("mgc");ctx=cv.getContext("2d");MAINX=ctx;BGC=$("bgc");if(BGC)BGX=BGC.getContext("2d",{alpha:false});try{Promise.all([document.fonts.load("20px Lucky"),document.fonts.load("20px Marker")]).then(function(){FOK=1})}catch(e){FOK=1}
 cv.addEventListener("pointerdown",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;ptr.taps.push(p)});cv.addEventListener("pointermove",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y});window.addEventListener("resize",resize);
 $("playBtn").onclick=function(){startSurvival()};$("againBtn").onclick=function(){startSurvival()};$("shareBtn").onclick=share;$("menuBtn").onclick=function(){show("title")};
 $("collBtn").onclick=showColl;$("overColl").onclick=showColl;$("collBack").onclick=function(){refresh();show("title")};$("muteBtn").onclick=function(){ac();setMute(!muted);if(muted)music(false)};
 setMute(muted);refresh();castRow();
 var q=new URLSearchParams(location.search),dm=q.get("mg");
 var dd=q.get("death");if(dd&&G[dd]){show("play");resize();S={lives:0,score:3};play(dd,1,false,function(){});run.phase="res";run.win=false;run.pt=0;run.resT=99;run.newDeath=true}
 if(q.get("sheet")){show("play");resize();cancelAnimationFrame(raf);(function sh(){requestAnimationFrame(sh);CLK+=1/60;var sc=cv.width/W;ctx.setTransform(sc,0,0,sc,0,0);ctx.fillStyle="#e8d3a6";ctx.fillRect(0,0,W,H);var ms=["calm","happy","panic","sad","shock"];Object.keys(CAST).forEach(function(k,i){ms.forEach(function(m,j){drawChar(k,36+j*72,90+i*(H-100)/6+40,96,m,CLK+i,{})})})})()}
 if(dm==="survival")startSurvival();else if(dm&&G[dm]){show("play");resize();S={lives:1,score:0};play(dm,+(q.get("sp")||1),false,function(win){window.__last={id:dm,win:win};over(run.g)})}
 if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)navigator.serviceWorker.register("sw.js").catch(function(){});
 window.__ewg={list:LIST,run:function(){return run},state:function(){return S}}}
init();
})();
