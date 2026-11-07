// EISH! Ways to Go — illustrated cast, painted sets, one-thumb microgames.
(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var LS={get:function(k,d){try{var v=localStorage.getItem("ewg_"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem("ewg_"+k,JSON.stringify(v))}catch(e){}}};
var cv,ctx,W=360,H=640,raf=0,last=0,shake=0,flashT=0,HIT=0,CLK=0,SAT=0,SAB=0;
var parts=[],POOL=[],FT=[],LAT=[];
var ptr={x:180,y:500,taps:[],swipes:[],down:false,wasDown:false,pressed:false,released:false,stamp:0};
var RNG=Math.random;
function seeded(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rnd(a,b){return a+RNG()*(b-a)}
function pick(a){return a[Math.floor(RNG()*a.length)]}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function tempo(sp){return Math.pow(Math.max(1,sp||1),0.5)}
function lag(cur,target,dt,rate){return cur+(target-cur)*(1-Math.exp(-(rate||8)*dt))}
function easeOutBack(p){p=clamp(p,0,1);var c=1.7;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)}
function smooth(p){p=clamp(p,0,1);return p*p*(3-2*p)}

var INK="#2b1b33", PAPER="#fffaf0", GOLD="#f2c230";
var FONT="'Lucky','Arial Black',Impact,sans-serif", FM="'Marker','Comic Sans MS',cursive";
var SET={mute:LS.get("mute",false),music:LS.get("music",true),vib:LS.get("vib",true),rm:LS.get("rm",false)};
try{if(localStorage.getItem("ewg_rm")==null&&window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)SET.rm=true}catch(e){}
var muted=SET.mute;

// ---------- audio (original, no samples) ----------
var AC=null,master=null,musicOn=false,nextT=0,stepN=0,timer=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:0.45;master.connect(AC.destination)}catch(e){}}if(AC&&AC.state==="suspended")AC.resume();return AC}
function tone(f,d,type,vol,t0,slide){if(!ac()||muted)return;var t=t0||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||"square";o.frequency.setValueAtTime(Math.max(1,f),t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(1,slide),t+d);g.gain.setValueAtTime(vol||0.08,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.02)}
var noiseBuf=null;
function hat(t,v){if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*0.05,AC.sampleRate);var d=noiseBuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}var s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type="highpass";f.frequency.value=7000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.04);s.connect(f);f.connect(g);g.connect(master);s.start(t)}
var SONGS=[
 {bpm:113,mel:[69,0,72,0,74,72,0,69,76,0,74,0,72,0,69,0, 67,0,69,0,72,0,74,76,0,74,0,72,69,0,67,0],log:[1,0,0,1,0,0,1,0,0,0,1,1,0,0,1,0, 1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0],bass:[45,45,45,43,43,43,41,41,41,41,43,43,43,43,45,45, 45,45,45,43,43,43,48,48,48,48,47,47,47,47,45,45],ch:[57,60,64]},
 {bpm:110,mel:[72,0,0,74,76,0,74,0,72,0,69,0,67,0,69,0, 72,0,0,74,76,0,79,0,76,0,74,0,72,0,0,0],log:[1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0, 1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0],bass:[48,48,48,48,45,45,45,45,41,41,41,41,43,43,43,43, 48,48,48,48,45,45,45,45,41,41,43,43,43,43,43,43],ch:[60,64,67]},
 {bpm:126,mel:[76,0,76,0,74,0,72,74,0,72,69,0,72,0,74,0, 76,0,79,0,76,0,74,72,0,74,0,76,0,74,72,0],log:[1,0,1,0,0,1,0,1,1,0,1,0,0,1,1,0, 1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,1],bass:[45,45,45,45,48,48,48,48,43,43,43,43,47,47,47,47, 45,45,45,45,48,48,48,48,50,50,50,50,47,47,47,47],ch:[57,60,64]}
];
var SONG=SONGS[0];
function mtof(n){return 440*Math.pow(2,(n-69)/12)}
function sched(){if(!AC)return;var spb=60/SONG.bpm/4;while(nextT<AC.currentTime+0.12){var s=stepN%32,t=nextT;
 if(SONG.log[s])tone(mtof(SONG.bass[s]),0.28,"sine",0.2,t,mtof(SONG.bass[s])*0.55);
 hat(t,s%2?0.045:0.018);if(s%8===4)tone(180,0.12,"triangle",0.07,t,60);
 if(SONG.mel[s])tone(mtof(SONG.mel[s]),0.1,"square",0.028,t);
 if(s%16===0||s%16===10)SONG.ch.forEach(function(n){tone(mtof(n),0.32,"triangle",0.02,t)});
 nextT+=spb;stepN++}}
function music(on,v){if(v!=null)SONG=SONGS[v];if(!ac())return;if(on&&SET.music&&!muted&&!musicOn){musicOn=true;nextT=AC.currentTime+0.05;timer=setInterval(sched,25)}else if(!on&&musicOn){musicOn=false;clearInterval(timer)}}
var NB2=null;
function noise(d,f0,f1,v,type,t0){if(!ac()||muted)return;var t=t0||AC.currentTime;if(!NB2){NB2=AC.createBuffer(1,AC.sampleRate*0.6,AC.sampleRate);var q=NB2.getChannelData(0);for(var i=0;i<q.length;i++)q[i]=Math.random()*2-1}
 var s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB2;f.type=type||"bandpass";f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+d);g.gain.setValueAtTime(v||0.15,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+0.02)}
var SFX={
 pop:function(k){tone(520+(k||0)*60,0.07,"triangle",0.09,0,900+(k||0)*60)},
 coin:function(k){var t=AC&&AC.currentTime;tone(880+(k||0)*30,0.06,"square",0.05,t);tone(1320,0.12,"square",0.05,t+0.06)},
 swish:function(){noise(0.12,500,2800,0.1)},
 thud:function(){tone(130,0.16,"sine",0.22,0,48);noise(0.08,380,90,0.1,"lowpass")},
 splat:function(){noise(0.18,800,180,0.16,"lowpass")},
 zap:function(){tone(980,0.16,"sawtooth",0.04,0,160);noise(0.16,3600,700,0.07)},
 bark:function(){tone(480,0.08,"sawtooth",0.07,0,240);noise(0.07,800,400,0.08)},
 whoosh:function(){noise(0.22,180,1800,0.1)},
 puff:function(){noise(0.22,1100,280,0.1)},
 tick:function(){tone(1700,0.02,"square",0.03)},
 sizzle:function(){noise(0.25,4200,1800,0.05,"highpass")},
 fail:function(){var t=AC&&AC.currentTime;tone(392,0.14,"square",0.06,t);tone(311,0.14,"square",0.06,t+0.14);tone(247,0.32,"sawtooth",0.05,t+0.28,120)},
 win:function(){var t=AC&&AC.currentTime,b=SONG.ch[0]+12;[0,4,7,12].forEach(function(n,i){tone(mtof(b+n),0.09,"square",0.045,t+i*0.055)})},
 fanfare:function(){var t=AC&&AC.currentTime;[0,4,7,12,16].forEach(function(n,i){tone(mtof(64+n),0.12,"square",0.045,t+i*0.08)})}
};
function sfx(n,a){try{if(ac()&&!muted&&SFX[n])SFX[n](a)}catch(e){}}
function vib(p){if(!SET.vib)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function hitStop(s){if(SET.rm)return;HIT=Math.max(HIT,s||0.06)}

// ---------- art ----------
var ART={cast:{},bg:{},prop:{},bead:null}, META={};
var CASTS=["boet","auntie","uncle","tannie","gaatjie","gogo"];
var BGS=["kitchen","rank","braai","highway","road","night","stoep","car","stadium","bed"];
var PROPS=["shaker","wors","dog","taxi","door","bakkie","candle","vuvu","mozzie","paper","biltong","petrol","pot","switch","hole"];
var CAST={
 boet:{name:"Boet Bennie",line:"Rugby jersey, zero fear, even less planning."},
 auntie:{name:"Auntie Thandi",line:"Doek on point. Knows everybody's business."},
 uncle:{name:"Uncle Fanie",line:"Never without his braai tongs. Never short of a speech."},
 tannie:{name:"Tannie Sannie",line:"Pearls, hair bun, and a koeksister for every occasion."},
 gaatjie:{name:"Jabu the Gaatjie",line:"Taxi gaatjie. Counts change faster than you can blink."},
 gogo:{name:"Gogo Nomsa",line:"Sees everything through those glasses. Salts everything too."}
};
function loadBitmap(url){
 return new Promise(function(res,rej){
  var im=new Image();
  im.onload=function(){
   if(window.createImageBitmap) createImageBitmap(im).then(res).catch(function(){res(im)});
   else res(im);
  };
  im.onerror=function(){rej(new Error(url))};
  im.src=url;
 });
}
function loadArt(onp){
 return fetch("art/manifest.json").then(function(r){if(!r.ok)throw new Error("manifest");return r.json()}).then(function(m){
  META=m; var jobs=[], n=0, tot=CASTS.length*3+BGS.length+PROPS.length+1;
  function add(url,fn){n++;jobs.push(loadBitmap(url).then(function(im){fn(im);if(onp)onp(jobs.length,tot)}))}
  CASTS.forEach(function(id){ART.cast[id]={};["calm","happy","panic"].forEach(function(p){add("art/cast/"+id+"-"+p+".webp",function(im){ART.cast[id][p]=im})})});
  BGS.forEach(function(id){add("art/bg/"+id+".webp",function(im){ART.bg[id]=im})});
  PROPS.forEach(function(id){add("art/prop/"+id+".webp",function(im){ART.prop[id]=im})});
  add("art/beadband.svg",function(im){ART.bead=im});
  return Promise.all(jobs);
 });
}
function poseIm(id,pose){var c=ART.cast[id]||{};return c[pose]||c.calm||c.panic}
function metaOf(id,pose){return META["cast/"+id+"/"+(poseIm(id,pose)===ART.cast[id][pose]?pose:"calm")]||META["cast/"+id+"/calm"]||{bw:200,bh:400,fx:0.5,fy:1,hx:0.5,hy:0.05}}

// ---------- draw ----------
var BGC=null,BGX=null,BGCUR="",BGUSE=0,MAINX=null,DIRECT=0;
function backdrop(name){
 var im=ART.bg[name]; if(!im) return;
 if(BGC&&ctx===MAINX&&!DIRECT){
  BGUSE=1;
  var k=name+"|"+BGC.width+"|"+BGC.height;
  if(BGCUR!==k){BGCUR=k;var s=Math.max(BGC.width/im.width,BGC.height/im.height),w=im.width*s,h=im.height*s;
   BGX.setTransform(1,0,0,1,0,0);BGX.fillStyle="#1c140f";BGX.fillRect(0,0,BGC.width,BGC.height);BGX.drawImage(im,(BGC.width-w)/2,(BGC.height-h)/2,w,h)}
  return;
 }
 var s2=Math.max(W/im.width,H/im.height),w2=im.width*s2,h2=im.height*s2;
 ctx.drawImage(im,(W-w2)/2,(H-h2)/2,w2,h2);
}
function scrim(){
 var g=ctx.createLinearGradient(0,0,0,86+SAT);g.addColorStop(0,"rgba(18,12,16,.5)");g.addColorStop(1,"rgba(18,12,16,0)");
 ctx.fillStyle=g;ctx.fillRect(0,0,W,86+SAT);
 var y=H-78-SAB,g2=ctx.createLinearGradient(0,y,0,H);g2.addColorStop(0,"rgba(18,12,16,0)");g2.addColorStop(1,"rgba(18,12,16,.48)");
 ctx.fillStyle=g2;ctx.fillRect(0,y,W,H-y);
}
function rr(x,y,w,h,r,fill){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}}
function stxt(s,x,y,size,fill,rot){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font=size+"px "+FONT;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";ctx.lineWidth=Math.max(3,size*0.14);ctx.strokeStyle=INK;ctx.strokeText(s,0,0);ctx.fillStyle=fill||PAPER;ctx.fillText(s,0,0);ctx.restore()}
function marker(s,x,y,size,col,rot){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font=size+"px "+FM;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";ctx.lineWidth=Math.max(3,size*0.22);ctx.strokeStyle=PAPER;ctx.strokeText(s,0,0);ctx.fillStyle=col||INK;ctx.fillText(s,0,0);ctx.restore()}
function wrapInk(s,x,y,size,maxW){ctx.font=size+"px "+FM;ctx.textAlign="center";ctx.textBaseline="middle";var ws=s.split(" "),ln="",out=[];ws.forEach(function(k){var t=ln?ln+" "+k:k;if(ctx.measureText(t).width>maxW&&ln){out.push(ln);ln=k}else ln=t});out.push(ln);ctx.fillStyle=INK;out.forEach(function(l,i){ctx.fillText(l,x,y+(i-(out.length-1)/2)*size*1.25)})}
function stamp(name,x,y,w,o){o=o||{};var im=ART.prop[name];if(!im||w<1)return;var m=META["prop/"+name]||{bw:im.width,bh:im.height};var sc=w/m.bw,dw=m.bw*sc,dh=m.bh*sc;ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);ctx.scale((o.flip?-1:1)*(o.sx||1),o.sy||1);ctx.drawImage(im,-dw/2,-dh/2,dw,dh);ctx.restore();return dh}
function shadow(x,y,rx){ctx.save();ctx.fillStyle="rgba(20,12,16,.28)";ctx.beginPath();ctx.ellipse(x,y,Math.max(4,rx),Math.max(3,rx*0.22),0,0,7);ctx.fill();ctx.restore()}
function paintChar(id,pose,x,y,h,o){
 o=o||{};var im=poseIm(id,pose);if(!im||h<2)return;
 var m=META["cast/"+id+"/"+(ART.cast[id][pose]?pose:"calm")]||metaOf(id,"calm");
 var sc=h/m.bh, dw=m.bw*sc, dh=h;
 var sx=(o.sx||1), sy=(o.sy||1), flip=o.flip?-1:1;
 shadow(x+(o.x||0), y+(o.y||0), h*0.16*(sy<0.96?1.18:1));
 ctx.save();ctx.translate(x+(o.x||0), y+(o.y||0));if(o.rot)ctx.rotate(o.rot);ctx.scale(flip*sx,sy);
 ctx.drawImage(im,-m.fx*dw,-m.fy*dh,dw,dh);ctx.restore();
 var hat=o.hat!=null?o.hat:(OUT[id]||"none");
 if(hat&&hat!=="none"){
  var hm=META["cast/"+id+"/calm"]||m;
  var hx=x+(o.x||0)+(hm.hx-m.fx)*dw*flip*sx;
  var hy=y+(o.y||0)+(hm.hy-m.fy)*dh*sy - h*0.02;
  if(pose==="panic"){hy-=h*0.08;ctx.save();ctx.translate(hx,hy);ctx.rotate(-0.4);hatDraw(hat,h*0.34);ctx.restore()}
  else hatAt(hat,hx,hy,h*0.34);
 }
}
function hatAt(h,x,y,s){ctx.save();ctx.translate(x,y);hatDraw(h,s);ctx.restore()}
function hatDraw(h,s){ctx.scale(s/80,s/80);
 if(h==="beanie"){rr(-28,-36,56,40,16,"#e53935");ctx.fillStyle=GOLD;ctx.fillRect(-28,-8,56,8);ctx.fillStyle="#00838f";for(var i=-2;i<=2;i++)ctx.fillRect(i*10,-28,6,6)}
 if(h==="shades"){rr(-34,-8,30,18,4,"#241820");rr(4,-8,30,18,4,"#241820");ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-4,-2);ctx.lineTo(4,-2);ctx.stroke()}
 if(h==="sunhat"){ctx.fillStyle="#e0b15a";ctx.beginPath();ctx.ellipse(0,0,40,12,0,0,7);ctx.fill();rr(-18,-28,36,30,8,"#e0b15a");ctx.fillStyle="#e53977";ctx.fillRect(-18,-8,36,6)}
 if(h==="crown"){ctx.fillStyle=GOLD;ctx.beginPath();ctx.moveTo(-26,6);ctx.lineTo(-28,-22);ctx.lineTo(-12,-8);ctx.lineTo(0,-28);ctx.lineTo(12,-8);ctx.lineTo(28,-22);ctx.lineTo(26,6);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke()}
 if(h==="chef"){ctx.fillStyle=PAPER;ctx.beginPath();ctx.moveTo(-20,4);ctx.quadraticCurveTo(-34,-20,-16,-30);ctx.quadraticCurveTo(0,-42,16,-30);ctx.quadraticCurveTo(34,-20,20,4);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke()}
 if(h==="flowers"){["#e53977",GOLD,PAPER,"#00838f","#e53977"].forEach(function(c,i){var a=-2.4+i*0.55;ctx.fillStyle=c;ctx.beginPath();ctx.arc(Math.cos(a)*26,Math.sin(a)*10-6,7,0,7);ctx.fill()})}
 if(h==="bucket"){ctx.fillStyle="#2f6fd6";ctx.beginPath();ctx.moveTo(-32,6);ctx.lineTo(-18,-24);ctx.quadraticCurveTo(0,-32,18,-24);ctx.lineTo(32,6);ctx.closePath();ctx.fill();ctx.fillStyle=GOLD;for(var i=-2;i<=2;i++){ctx.beginPath();ctx.arc(i*10,-8,3,0,7);ctx.fill()}}
 if(h==="party"){ctx.fillStyle="#7b1fa2";ctx.beginPath();ctx.moveTo(-16,8);ctx.lineTo(0,-36);ctx.lineTo(18,8);ctx.fill();ctx.fillStyle=GOLD;ctx.fillRect(-14,-28,30,4);ctx.beginPath();ctx.arc(0,-36,5,0,7);ctx.fill()}
}
function actor(ph){return {pose:"calm",pose2:null,blend:1,clip:null,t:0,x:0,y:0,sx:1,sy:1,rot:0,flip:false,ph:ph||0}}
function sampleKeys(keys,t){
 if(t<=keys[0].t) return keys[0];
 for(var i=1;i<keys.length;i++){
  if(t<=keys[i].t){var a=keys[i-1],b=keys[i],p=smooth((t-a.t)/Math.max(0.0001,b.t-a.t)),o={};
   for(var k in b) o[k]=(typeof b[k]==="number"&&typeof a[k]==="number")?a[k]+(b[k]-a[k])*p:(p<0.55?a[k]:b[k]);
   return o}
 }
 return keys[keys.length-1];
}
function clipTo(a,keys){
 if(SET.rm){var k=keys[keys.length-1];a.pose=k.pose||a.pose;a.x=k.x||0;a.y=k.y||0;a.sx=k.sx==null?1:k.sx;a.sy=k.sy==null?1:k.sy;a.rot=k.rot||0;a.clip=null;return}
 a.clip=keys;a.t=0;
}
function playPop(a,pose){clipTo(a,[
 {t:0,sy:1,sx:1,y:0,rot:0,pose:a.pose},{t:0.09,sy:0.86,sx:1.12,y:6,rot:0,pose:a.pose},
 {t:0.2,sy:1.1,sx:0.92,y:-18,rot:0,pose:pose||"happy"},{t:0.34,sy:0.94,sx:1.06,y:0,rot:0,pose:pose||"happy"},
 {t:0.5,sy:1,sx:1,y:0,rot:0,pose:pose||"happy"}])}
function playOuch(a){clipTo(a,[
 {t:0,sy:1,sx:1,y:0,rot:0,pose:a.pose},{t:0.08,sy:1.16,sx:0.86,y:-12,rot:0,pose:"panic"},
 {t:0.18,sy:0.82,sx:1.16,y:4,rot:0,pose:"panic"},{t:0.36,sy:1,sx:1,y:0,rot:0,pose:"panic"}])}
function tick(a,dt){
 if(a.clip){a.t+=dt;var k=sampleKeys(a.clip,a.t);
  if(k.pose&&k.pose!==a.pose){a.pose2=a.pose;a.pose=k.pose;a.blend=0}
  a.x=k.x||0;a.y=k.y||0;a.sx=k.sx==null?1:k.sx;a.sy=k.sy==null?1:k.sy;a.rot=k.rot||0;
  if(a.t>=a.clip[a.clip.length-1].t)a.clip=null;
 } else if(!SET.rm&&a.pose==="calm"){var b=Math.sin(CLK*1.6+(a.ph||0));a.sy=1+b*0.012;a.sx=1-b*0.008}
 if(a.blend<1)a.blend=Math.min(1,a.blend+dt*(SET.rm?20:7));
}
function drawActor(id,a,x,y,h,o){
 o=o||{};
 if(a.blend<1&&a.pose2){ctx.save();ctx.globalAlpha=1-a.blend;paintChar(id,a.pose2,x,y,h,pack(a,o));ctx.restore();ctx.save();ctx.globalAlpha=a.blend;paintChar(id,a.pose,x,y,h,pack(a,o));ctx.restore()}
 else paintChar(id,a.pose,x,y,h,pack(a,o));
}
function pack(a,o){return {x:a.x+(o.x||0),y:a.y+(o.y||0),sx:a.sx*(o.sx||1),sy:a.sy*(o.sy||1),rot:(a.rot||0)+(o.rot||0),flip:o.flip!=null?o.flip:a.flip,hat:o.hat}}
function cameo(id,x,y,h,pose,t,o){
 o=o||{};var k=SET.rm?1:easeOutBack(clamp((t-(o.delay||0))/0.38,0,1));
 if(k<0.02)return;
 paintChar(id,pose,x,y+(1-k)*26,h*Math.max(0.2,k),{rot:o.rot||0,sx:o.sx||1,sy:(o.sy||1),flip:o.flip,y:o.y||0});
}
function boxHit(a,b){var aw=a.w||0,ah=a.h||0,bw=b.w||0,bh=b.h||0;return Math.abs(a.x-b.x)*2<(aw+bw)&&Math.abs(a.y-b.y)*2<(ah+bh)}
function segHits(x,y,dx,dy,cx,cy,r){var n=8;for(var i=0;i<=n;i++){var px=x+dx*i/n,py=y+dy*i/n;if((px-cx)*(px-cx)+(py-cy)*(py-cy)<=r*r)return true}return false}

// particles, capped
function pnew(){return POOL.pop()||{}}
function burst(x,y,col,n){n=SET.rm?Math.min(3,n||4):(n||8);for(var i=0;i<n&&parts.length<48;i++){var p=pnew();p.x=x;p.y=y;p.vx=rnd(-180,180);p.vy=rnd(-260,-20);p.l=rnd(0.35,0.6);p.c=col;p.w=rnd(4,8);p.h=rnd(3,6);p.g=700;parts.push(p)}}
function stepParts(dt){for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.l-=dt;if(p.l<=0){parts.splice(i,1);POOL.push(p)}}}
function drawParts(){for(var i=0;i<parts.length;i++){var p=parts[i];ctx.globalAlpha=clamp(p.l*3,0,1);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.w,p.h)}ctx.globalAlpha=1}
function heart(x,y,s,on){ctx.save();ctx.translate(x,y);ctx.scale(s/20,s/20);ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(-12,-6,-8,-16,0,-8);ctx.bezierCurveTo(8,-16,12,-6,0,6);ctx.fillStyle=on?"#e23b3b":"rgba(255,250,240,.35)";ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();ctx.restore()}

var G={},DEF={};
function def(id,meta,make){DEF[id]=meta;G[id]=function(sp){var g=make(sp)||{};g.t=0;g.pub=g.pub||{};for(var k in meta)if(g[k]===undefined)g[k]=meta[k];return g}}
var OUT=LS.get("out",{});
var SIM=0;
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
 if(r.phase==="intro"){r.pt+=dt;if(r.pt>=r.introT){r.phase="play";r.pt=0;ptr.down=false;ptr.wasDown=false;ptr.taps.length=0;ptr.swipes.length=0}return}
 if(r.phase==="play"){
  if(window.__freeze)return;
  if(BOT&&r.g.bot)r.g.bot(BOTI);
  ptr.pressed=ptr.down&&!ptr.wasDown;ptr.released=!ptr.down&&ptr.wasDown;
  if(ptr.pressed&&ptr.stamp){LAT.push(performance.now()-ptr.stamp);if(LAT.length>120)LAT.shift();ptr.stamp=0}
  var pdt=(HIT>0&&!SET.rm)?dt*0.08:dt;HIT=Math.max(0,HIT-dt);
  var prev=RNG;RNG=r.rng||Math.random;r.g.update(pdt);RNG=prev;
  ptr.wasDown=ptr.down;r.pt+=pdt;
  var dur=r.g.dur;r.left=Math.max(0,dur-r.pt);
  if(r.g.fail)end(false);else if(r.g.done)end(true);else if(r.pt>=dur)end(!!r.g.timeoutWin);
  ptr.taps.length=0;ptr.swipes.length=0;return}
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
// Twelve microgames. Bots read this.pub only (the same positions and meters that are drawn).
function lanesY(i){return H*0.74-i*(H*0.112)}

def("salt",{name:"Over-Salted Pap",word:"LET GO",who:"tannie",bg:"kitchen",cap:"Let Gogo season the pap 'just a little'",dur:5.4,timeoutWin:false,how:"hold",hint:"Hold, then let go in the green",win:"JUST RIGHT",title:"SNOW!",sub:"that is not 'a little'",
paintDeath:function(t){backdrop("kitchen");stamp("pot",180,H*0.48,220);ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(180,H*0.4,78,16,0,0,7);ctx.fill();cameo("gogo",100,H*0.64,190,"panic",t);cameo("tannie",246,H*0.82,250,"panic",t,{delay:0.08})}},
function(sp){
 var fill=0,pouring=false,lo=0.4,hi=0.74,rate=0.28*tempo(sp),tilt=0.08,tan=actor(1),go=actor(2);
 return {pub:{fill:0,lo:lo,hi:hi,pouring:false,shaker:{x:200,y:280}},
  update:function(dt){this.t+=dt;tick(tan,dt);tick(go,dt);
   if(ptr.pressed&&!pouring&&fill<0.02){pouring=true;sfx("pop")}
   if(pouring){fill+=rate*dt;if(Math.random()<dt*16)burst(198,H*0.36,"#fffaf0",1);if(fill>0.93){this.fail=true;playOuch(tan)}}
   if(ptr.released&&pouring){pouring=false;if(fill>=lo&&fill<=hi){this.done=true;playPop(tan,"happy");sfx("coin")}else{this.fail=true;playOuch(tan)}}
   tilt=lag(tilt,pouring?0.62:0.06,dt,9);
   this.pub={fill:fill,lo:lo,hi:hi,pouring:pouring,shaker:{x:198,y:H*0.34}}},
  draw:function(){backdrop("kitchen");stamp("pot",150,H*0.54,190);meter(16,H*0.26,34,H*0.4,fill,lo,hi);
   marker(fill<lo?"MORE":fill>hi?"EASY":"NOW",36,H*0.22,13,fill>=lo&&fill<=hi?"#146c2e":INK);
   drawActor("gogo",go,102,H*0.62,180);stamp("shaker",198,H*0.34,76,{rot:tilt});drawActor("tannie",tan,258,H*0.88,260)},
  bot:function(api){var p=this.pub;if(!p.pouring)api.hold(true,p.shaker.x,p.shaker.y);else if(p.fill>=p.lo+0.05)api.hold(false);else api.hold(true,p.shaker.x,p.shaker.y)}}});

def("quantum",{name:"Taxi Rank Crossing",word:"HOP",who:"gogo",bg:"rank",cap:"Stood in the taxi lane arguing about the fare",dur:8.4,timeoutWin:false,how:"swipe",hint:"Swipe up when the next lane glows",win:"CROSSED!",title:"FLAT!",sub:"but the fare, my child",
paintDeath:function(t){backdrop("rank");stamp("taxi",180,H*0.3,200);cameo("gogo",180,H*0.62,200,"panic",t,{rot:1.25,sy:0.55})}},
function(sp){
 var dir=RNG()<0.5?-1:1,taxis=[],lane=0,hop=0,from=0,gx=180,act=actor(3),speed=100*tempo(sp);
 var span=460,shift=230;
 function wrapX(x){var loop=span*2;x=((x%loop)+loop)%loop;return x-180}
 for(var L=0;L<4;L++)for(var i=0;i<2;i++)taxis.push({lane:L,x:wrapX(L*shift+i*span),dir:dir,hw:36});
 function threat(ln,x,pad){for(var i=0;i<taxis.length;i++){var t=taxis[i];if(t.lane===ln&&Math.abs(t.x-x)<t.hw+pad)return true}return false}
 var pub={lane:0,gx:gx,gy:lanesY(0),hop:false,nextClear:!threat(1,gx,80),taxis:[]};
 return {pub:pub,
  update:function(dt){this.t+=dt;tick(act,dt);
   for(var i=0;i<taxis.length;i++){var t=taxis[i];t.x=wrapX(t.x+180+dir*speed*dt)}
   if(hop>0){hop-=dt;if(hop<=0){hop=0;if(lane>=3){this.done=true;playPop(act,"happy")}else if(threat(lane,gx,14)){this.fail=true;playOuch(act);sfx("thud")}}}
   else{var up=false;for(var s=0;s<ptr.swipes.length;s++)if(ptr.swipes[s].dy<-32)up=true;
    if(up&&lane<3&&!threat(lane+1,gx,80)){from=lane;lane++;hop=0.12;sfx("swish");playPop(act,"calm")}
    else if(threat(lane,gx,14)){this.fail=true;playOuch(act);sfx("thud")}}
   var list=[];for(var k=0;k<taxis.length;k++)list.push({x:taxis[k].x,y:lanesY(taxis[k].lane),w:120,h:40,lane:taxis[k].lane});
   var gy=hop>0?lanesY(from)+(lanesY(lane)-lanesY(from))*(1-hop/0.12):lanesY(lane);
   this.pub={lane:lane,gx:gx,gy:gy,hop:hop>0,nextClear:lane<3&&!threat(lane+1,gx,80),taxis:list}},
  draw:function(){backdrop("rank");
   for(var i=0;i<4;i++){var y=lanesY(i);ctx.fillStyle=this.pub.nextClear&&i===lane+1?"rgba(242,194,48,.38)":"rgba(20,16,24,.32)";ctx.fillRect(0,y-26,W,52);
    ctx.strokeStyle="rgba(255,250,240,.7)";ctx.setLineDash([14,12]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(10,y);ctx.lineTo(W-10,y);ctx.stroke();ctx.setLineDash([])}
   for(var k=0;k<taxis.length;k++){var t=taxis[k];ctx.fillStyle="rgba(20,12,16,.35)";ctx.beginPath();ctx.ellipse(t.x,lanesY(t.lane)+16,36,8,0,0,7);ctx.fill();stamp("taxi",t.x,lanesY(t.lane)-8,128,{flip:dir>0})}
   drawActor("gogo",act,gx,this.pub.gy+36,150)},
  bot:function(api){var p=this.pub;if(!p.hop&&p.lane<3&&p.nextClear)api.swipe(p.gx,p.gy,0,-90)}}});

def("wors",{name:"Rescue the Wors",word:"SNATCH",who:"uncle",bg:"braai",cap:"Turned his back on the wors 'for one second'",dur:4.2,timeoutWin:false,how:"drag",hint:"Drag him onto the wors",win:"SAVED!",title:"GONE!",sub:"the dog says thanks",
paintDeath:function(t){backdrop("braai");stamp("dog",200,H*0.48,220);stamp("wors",250,H*0.4,90,{rot:-0.4});cameo("uncle",120,H*0.8,250,"panic",t)}},
function(sp){
 var wx=130+RNG()*100,wy=H*0.4,ux=180,uy=H*0.84,wind=Math.max(0.52,0.88/tempo(sp)),got=false,act=actor(1),vx=0;
 return {pub:{uncle:{x:ux,y:uy,w:80,h:100},wors:{x:wx,y:wy,w:80,h:70},dog:{x:wx+160,y:wy}},
  update:function(dt){this.t+=dt;tick(act,dt);if(got||this.fail)return;
   var px=ux,py=uy;if(ptr.down){ux=lag(ux,ptr.x,dt,11);uy=lag(uy,ptr.y,dt,11)}vx=lag(vx,(ux-px)/Math.max(dt,0.016),dt,6);
   var dogT=this.t-wind,dogX=wx+170-(dogT>0?dogT*240*tempo(sp):0);
   if(boxHit({x:ux,y:uy-40,w:70,h:80},{x:wx,y:wy,w:74,h:64})){got=true;this.done=true;playPop(act,"happy");sfx("coin");hitStop(0.06)}
   else if(dogT>0&&dogX<wx+24){this.fail=true;playOuch(act);sfx("bark")}
   this.pub={uncle:{x:ux,y:uy,w:80,h:100},wors:{x:wx,y:wy,w:80,h:70},dog:{x:dogX,y:wy},wind:dogT<0}},
  draw:function(){backdrop("braai");stamp("wors",wx,wy,100,{rot:Math.sin(this.t*3)*0.08});
   var dogT=this.t-wind,squash=dogT<0?0.82+0.18*Math.sin(this.t*14):1;
   stamp("dog",this.pub.dog.x,wy+10,150,{sx:dogT<0?1.08:1,sy:squash,flip:true});
   drawActor("uncle",act,ux,uy,230,{rot:clamp(-vx*0.004,-0.25,0.25)})},
  bot:function(api){var w=this.pub.wors;api.hold(true,w.x,w.y)}}});

def("door",{name:"Shut the Taxi Door",word:"SLAM",who:"gaatjie",bg:"highway",cap:"Left the sliding door open on the highway",dur:5.6,timeoutWin:false,how:"drag",hint:"Drag the door shut",win:"SHUT!",title:"LEFT IT!",sub:"the highway kept the door",
paintDeath:function(t){backdrop("highway");stamp("taxi",220,H*0.42,240);cameo("gaatjie",100,H*0.78,230,"panic",t)}},
function(){
 var hx=214,armed=false,grab=0,latch=0,act=actor(2),scroll=0,openX=246,shutX=56;
 return {pub:{open:1,hx:hx,hy:320,shutX:shutX,armed:false},
  update:function(dt){this.t+=dt;tick(act,dt);scroll=(scroll+dt*220)%40;var hy=H*0.46;
   if(ptr.pressed){grab=hx-ptr.x;armed=true;sfx("tick")}
   var ax=(openX-hx)*3.4;if(ptr.down&&armed)ax+=(ptr.x+grab-hx)*22;
   hx=clamp(hx+ax*dt,42,276);
   if(hx<shutX+24)latch+=dt;else latch=0;
   if(latch>0.16&&!this.done){this.done=true;playPop(act,"happy");sfx("thud");hitStop(0.07)}
   if(hx>200&&Math.sin(this.t*8)>0.9)act.pose=act.clip?act.pose:"panic";
   this.pub={open:(hx-shutX)/(openX-shutX),hx:hx,hy:hy,shutX:shutX,armed:armed}},
  draw:function(){backdrop("highway");var hy=this.pub.hy;
   ctx.save();ctx.beginPath();ctx.rect(0,hy-90,Math.max(0,hx-20),180);ctx.clip();
   ctx.fillStyle="rgba(20,24,32,.25)";ctx.fillRect(0,hy-70,W,140);
   for(var x=-40;x<W;x+=40){ctx.fillStyle=GOLD;ctx.fillRect(x+scroll,hy+30,18,6)}ctx.restore();
   stamp("door",hx+70,hy,200);ctx.strokeStyle="#e23b3b";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(hx+150,hy);ctx.quadraticCurveTo(300,hy-30,320,hy+10);ctx.stroke();
   drawActor("gaatjie",act,100,H*0.9,240)},
  bot:function(api){var p=this.pub;if(!p.armed)api.hold(true,p.hx,p.hy);else api.hold(true,32,p.hy)}}});

def("pothole",{name:"Pothole Dash",word:"STEER",who:"boet",bg:"road",cap:"Tried to fix the pothole with a spade and positive thinking",dur:6.4,timeoutWin:true,how:"drag",hint:"Drag to steer. Miss the dark middles",win:"SMOOTH!",title:"BUMP!",sub:"positive thinking lost",
paintDeath:function(t){backdrop("road");stamp("bakkie",180,H*0.62,200,{rot:0.4});stamp("hole",200,H*0.7,120);cameo("boet",250,H*0.84,210,"panic",t,{delay:0.05})}},
function(sp){
 var bx=180,obs=[],wait=0.35,seq=[-1,1,0,1,-1,0],si=0,act=actor(0),sp1=tempo(sp),wh=false;
 function proj(o){var z=o.z,y=H*0.5+z*(H*0.3),x=180+o.lane*(24+z*125),sc=0.28+z*0.95;return {x:x,y:y,z:z,w:50*sc,h:34*sc,sc:sc,lane:o.lane}}
 return {pub:{x:bx,y:H*0.8,obs:[]},
  update:function(dt){this.t+=dt;tick(act,dt);
   var target=ptr.down?clamp(ptr.x,48,312):bx;bx=lag(bx,target,dt,8);
   wait-=dt;if(wait<=0&&si<seq.length){obs.push({lane:seq[si++],z:0});wait=1.05/sp1}
   var list=[],hit=false;
   for(var i=obs.length-1;i>=0;i--){obs[i].z+=dt*0.4*sp1;var p=proj(obs[i]);list.push(p);
    if(p.z>0.9&&p.z<1.08&&Math.abs(p.x-bx)<30)hit=true;
    if(!wh&&p.z>0.9&&p.z<1.05&&Math.abs(p.x-bx)<58){wh=true;sfx("whoosh")}
    if(p.z>1.2)obs.splice(i,1)}
   if(hit){this.fail=true;playOuch(act);sfx("thud");hitStop(0.06)}
   this.pub={x:bx,y:H*0.8,obs:list}},
  draw:function(){backdrop("road");var scroll=(this.t*240)%50;
   for(var i=0;i<8;i++){var z=i/8,y=H*0.5+z*H*0.32;ctx.fillStyle="rgba(255,250,240,.8)";ctx.fillRect(180-z*8,y+(scroll*z)%40,10+z*16,4)}
   var ordered=this.pub.obs.slice().sort(function(a,b){return a.z-b.z});
   for(var k=0;k<ordered.length;k++){var p=ordered[k];stamp("hole",p.x,p.y,78*p.sc)}
   var lean=clamp((bx-180)/180, -0.18,0.18);
   stamp("bakkie",bx,H*0.8,150,{rot:lean});
   if(this.done)drawActor("boet",act,bx,H*0.78,80)},
  bot:function(api){var p=this.pub,threat=null;(p.obs||[]).forEach(function(o){if(o.z>0.42&&o.z<0.92&&(!threat||o.z>threat.z))threat=o});
   var target=p.x;if(threat&&Math.abs(threat.x-p.x)<78)target=threat.x>=p.x?64:296;api.hold(true,target,p.y)}}});

def("candle",{name:"Load-shedding Candle",word:"CUP",who:"gogo",bg:"night",cap:"Let the last candle blow out in Stage 6",dur:6.6,timeoutWin:true,how:"hold",hint:"Hold only while the wind crosses the flame",win:"STILL LIT",title:"DARK!",sub:"stage 6 wins again",
paintDeath:function(t){backdrop("night");cameo("gogo",180,H*0.72,280,"panic",t);marker("pff",180,H*0.4,28,INK)}},
function(sp){
 var gusts=[1.05,2.35,3.7,5.15],sp1=tempo(sp),smother=0,act=actor(4),alive=true;
 return {pub:{gust:false,hit:false,smother:0,flame:{x:180,y:H*0.42}},
  update:function(dt){this.t+=dt;tick(act,dt);if(!alive)return;
   var gust=false,hit=false,travel=0.78/sp1;
   for(var i=0;i<gusts.length;i++){var u=(this.t-gusts[i]);if(u>=0&&u<=travel){gust=true;var x=-40+(u/travel)*(180+40);if(Math.abs(x-180)<36)hit=true;this._gx=x}}
   if(hit&&!ptr.down){alive=false;this.fail=true;playOuch(act);sfx("puff")}
   if(ptr.down&&!gust)smother+=dt*0.95;else smother=Math.max(0,smother-dt*0.55);
   if(smother>=1){alive=false;this.fail=true;playOuch(act);sfx("puff")}
   if(alive&&this.t>gusts[gusts.length-1]+travel+0.25){this.done=true;playPop(act,"happy")}
   this.pub={gust:gust,hit:hit,smother:smother,flame:{x:180,y:H*0.42},gx:this._gx||0}},
  draw:function(){backdrop("night");
   if(this.pub.gust){ctx.strokeStyle="rgba(255,250,240,.85)";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(this.pub.gx-50,H*0.42);ctx.lineTo(this.pub.gx,H*0.42-8);ctx.lineTo(this.pub.gx-50,H*0.42-16);ctx.stroke()}
   var s=this.pub.hit&&ptr.down?0.8:1;if(this.pub.smother>0.4)s*=1-this.pub.smother*0.4;
   stamp("candle",180,H*0.5,90*s);
   if(ptr.down&&this.pub.gust){ctx.strokeStyle=PAPER;ctx.lineWidth=6;ctx.beginPath();ctx.arc(180,H*0.46,46,Math.PI*1.1,Math.PI*1.9);ctx.stroke()}
   meter(16,H*0.28,28,H*0.28,this.pub.smother,0.99,1);marker("CUP",34,H*0.24,12,INK);
   drawActor("gogo",act,180,H*0.9,270)},
  bot:function(api){var p=this.pub;if(p.gust)api.hold(true,p.flame.x,p.flame.y);else api.hold(false)}}});

def("braai",{name:"Fan the Braai",word:"FAN",who:"uncle",bg:"braai",cap:"Used petrol to 'help' the braai along",dur:6.8,timeoutWin:false,how:"circle",hint:"Circle the coals. Do not touch the can",win:"COALS!",title:"WHOOMP!",sub:"petrol is not a spice",
paintDeath:function(t){backdrop("braai");stamp("petrol",180,H*0.48,140);cameo("uncle",180,H*0.8,260,"panic",t,{delay:0.05});ctx.fillStyle="rgba(40,40,40,.35)";ctx.fillRect(0,0,W,H*0.7)}},
function(sp){
 var heat=0,lx=null,ly=null,side=RNG()<0.5?1:-1,act=actor(2),cx=180,cy=H*0.48;
 var petrol={x:180+side*120,y:cy+10,w:70,h:80};
 return {pub:{heat:0,coals:{x:cx,y:cy},petrol:petrol},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.done||this.fail)return;
   if(ptr.down){if(boxHit({x:ptr.x,y:ptr.y,w:8,h:8},petrol)){this.fail=true;playOuch(act);sfx("whoosh");return}
    var rr=Math.hypot(ptr.x-cx,ptr.y-cy);
    if(lx!=null&&rr>24&&rr<115){var moved=Math.hypot(ptr.x-lx,ptr.y-ly);if(moved>0.5&&moved<90)heat+=moved*0.62}
    lx=ptr.x;ly=ptr.y}else{lx=null;ly=null}
   if(heat>=100){this.done=true;playPop(act,"happy");sfx("sizzle");hitStop(0.05)}
   this.pub={heat:heat,coals:{x:cx,y:cy},petrol:petrol}},
  draw:function(){backdrop("braai");
   ctx.strokeStyle="rgba(255,250,240,.7)";ctx.setLineDash([6,8]);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,62,0,7);ctx.stroke();ctx.setLineDash([]);
   var fl=this.pub.heat/100;ctx.fillStyle="rgba(255,120,40,"+(0.25+fl*0.55)+")";ctx.beginPath();ctx.ellipse(cx,cy,40+fl*20,22+fl*10,0,0,7);ctx.fill();
   stamp("petrol",petrol.x,petrol.y,78);marker("NO",petrol.x,petrol.y-52,14,"#e23b3b");
   meter(16,H*0.22,30,160,fl,0.99,1);
   drawActor("uncle",act,cx,H*0.9,250)},
  bot:function(api){this.ang=(this.ang||0)+0.22;api.hold(true,cx+Math.cos(this.ang)*58,cy+Math.sin(this.ang)*46)}}});

def("vuvu",{name:"Vuvuzela Blast",word:"TOOT",who:"boet",bg:"stadium",cap:"Blew the vuvuzela right in the ref's ear",dur:6.2,timeoutWin:false,how:"tap",hint:"Tap when the note sits in the ring",win:"LOUD!",title:"TOO LOUD!",sub:"the ref heard that",
paintDeath:function(t){backdrop("stadium");stamp("vuvu",200,H*0.42,160,{rot:-0.6});cameo("boet",160,H*0.8,250,"panic",t)}},
function(sp){
 var travel=1.32/tempo(sp),notes=[],hits=0,misses=0,act=actor(0),zy=H*0.46;
 for(var i=0;i<4;i++)notes.push({t0:0.4+i*1.2,hit:false,counted:false,x:-40,y:zy});
 var zone={x:250,y:zy,r:48};
 return {pub:{notes:[],zone:zone},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   var on=false,inside=null;
   for(var i=0;i<notes.length;i++){var n=notes[i],u=(this.t-n.t0)/travel;n.u=u;
    if(u>=0&&u<=1){n.x=-30+u*410;n.y=zy;on=true;if(!n.hit&&Math.abs(n.x-zone.x)<zone.r)inside=n;if(!n.hit&&!n.counted&&u>0.84){n.counted=true;misses++}}}
   if(ptr.taps.length){if(inside){inside.hit=true;hits++;sfx("pop");burst(zone.x,zone.y,GOLD,6)}else if(on){misses++;sfx("tick")}}
   if(misses>=2){this.fail=true;playOuch(act)}
   else if(hits>=4||(hits>=3&&this.t>notes[3].t0+travel)){this.done=true;playPop(act,"happy")}
   this.pub={notes:notes.filter(function(n){return n.u>=0&&n.u<=1}).map(function(n){return {x:n.x,y:n.y,r:16,hit:n.hit}}),zone:zone}},
  draw:function(){backdrop("stadium");ctx.strokeStyle=GOLD;ctx.lineWidth=6;ctx.beginPath();ctx.arc(zone.x,zone.y,zone.r,0,7);ctx.stroke();
   for(var i=0;i<notes.length;i++)if(notes[i].u>=0&&notes[i].u<=1){ctx.fillStyle=notes[i].hit?"#b6e2a1":PAPER;ctx.beginPath();ctx.arc(notes[i].x,notes[i].y,14,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.stroke()}
   stamp("vuvu",120,H*0.62,120,{rot:-0.5});drawActor("boet",act,150,H*0.9,250);marker(hits+"/4",W-36,H*0.2,18,PAPER)},
  bot:function(api){var p=this.pub;for(var i=0;i<p.notes.length;i++){var n=p.notes[i];if(!n.hit&&Math.abs(n.x-p.zone.x)<p.zone.r){api.tap(p.zone.x,p.zone.y);return}}}}});

def("fence",{name:"Free Biltong",word:"PULL",who:"uncle",bg:"stoep",cap:"Touched the electric fence to grab free biltong",dur:5.2,timeoutWin:true,how:"drag",hint:"Drag him back into the safe patch",win:"HELD!",title:"BZZT!",sub:"the biltong was a trap",
paintDeath:function(t){backdrop("stoep");stamp("biltong",230,H*0.36,110);cameo("uncle",160,H*0.78,260,"panic",t)}},
function(sp){
 var x=100,wire=292,act=actor(1),creep=36*tempo(sp);
 return {pub:{x:x,y:H*0.78,wire:wire,safe:78},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail)return;
   var wave=Math.sin(this.t*2.4),lung=wave>0.72;
   if(wave>0.42&&wave<=0.72&&!act.clip)clipTo(act,[{t:0,sy:1,sx:1,y:0,rot:0,pose:"calm"},{t:0.16,sy:0.9,sx:1.08,y:4,rot:-0.05,pose:"panic"},{t:0.28,sy:1,sx:1,y:0,rot:0,pose:"calm"}]);
   x+=dt*(creep+(lung?110:0));creep+=dt*10*tempo(sp);
   if(ptr.down)x=lag(x,clamp(ptr.x,48,wire-16),dt,10);
   if(x>=wire){this.fail=true;playOuch(act);sfx("zap");hitStop(0.08)}
   this.pub={x:x,y:H*0.8,wire:wire,safe:72,lunge:lung}},
  draw:function(){backdrop("stoep");
   ctx.fillStyle="rgba(120,190,90,.35)";rr(28,H*0.62,120,H*0.22,16,"rgba(170,220,120,.45)");ctx.lineWidth=3;ctx.strokeStyle="#2e6b32";ctx.stroke();marker("SAFE",88,H*0.66,14,"#1b4d22");
   ctx.strokeStyle="#e23b3b";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wire,H*0.28);ctx.lineTo(wire,H*0.7);ctx.stroke();
   stamp("biltong",wire-10,H*0.4,90);if(this.pub.lunge){ctx.strokeStyle=GOLD;ctx.lineWidth=3;ctx.beginPath();ctx.arc(wire,H*0.4,36+Math.sin(CLK*20)*4,0,7);ctx.stroke()}
   drawActor("uncle",act,x,H*0.84,230)},
  bot:function(api){api.hold(true,this.pub.safe,this.pub.y)}}});

def("carseat",{name:"Hot Car Seat",word:"COVER",who:"boet",bg:"car",cap:"Sat on a vinyl car seat in January",dur:5.8,timeoutWin:false,how:"drag",hint:"Drag the paper onto the seat, then tap",win:"AHH",title:"YOW!",sub:"January vinyl",
paintDeath:function(t){backdrop("car");cameo("boet",180,H*0.72,240,"panic",t,{y:Math.sin(t*20)*6})}},
function(){
 var paper={x:70+RNG()*40,y:H*0.8,w:100,h:70},seat={x:190,y:H*0.55,w:170,h:110},grab=false,covered=false,held=false,act=actor(0);
 return {pub:{paper:paper,seat:seat,covered:false,held:false},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.done||this.fail)return;
   if(ptr.pressed&&boxHit({x:ptr.x,y:ptr.y,w:10,h:10},paper)){grab=true;held=true;sfx("tick")}
   if(!ptr.down)grab=false;
   if(grab){paper.x=lag(paper.x,ptr.x,dt,14);paper.y=lag(paper.y,ptr.y,dt,14)}
   if(!covered&&boxHit(paper,seat)){covered=true;paper.x=seat.x;paper.y=seat.y;sfx("pop");burst(seat.x,seat.y,PAPER,8)}
   var sit=false;if(ptr.pressed&&boxHit({x:ptr.x,y:ptr.y,w:12,h:12},seat))sit=true;
   for(var i=0;i<ptr.taps.length;i++)if(boxHit(ptr.taps[i],seat))sit=true;
   if(sit&&!grab){if(covered){this.done=true;playPop(act,"happy")}else{this.fail=true;playOuch(act);sfx("splat")}}
   this.pub={paper:{x:paper.x,y:paper.y,w:paper.w,h:paper.h},seat:seat,covered:covered,held:held}},
  draw:function(){backdrop("car");
   ctx.strokeStyle=covered?"#2e6b32":"#e23b3b";ctx.lineWidth=4;ctx.setLineDash([8,6]);ctx.strokeRect(seat.x-seat.w/2,seat.y-seat.h/2,seat.w,seat.h);ctx.setLineDash([]);
   if(!covered){ctx.fillStyle="rgba(255,180,60,.18)";ctx.fillRect(seat.x-seat.w/2,seat.y-seat.h/2,seat.w,seat.h)}
   stamp("paper",paper.x,paper.y,120,{rot:covered?0.04:Math.sin(this.t*2)*0.04});
   drawActor("boet",act,covered&&this.done?seat.x:70,covered&&this.done?seat.y+20:H*0.9,this.done?160:200)},
  bot:function(api){var p=this.pub;if(!p.covered){if(!p.held)api.hold(true,p.paper.x,p.paper.y);else api.hold(true,p.seat.x,p.seat.y)}else api.tap(p.seat.x,p.seat.y)}}});

def("mozzie",{name:"Swat the Mozzie",word:"SWIPE",who:"gogo",bg:"bed",cap:"Slept with the window open in December",dur:6.4,timeoutWin:false,how:"swipe",hint:"Swipe through the ring when it pops",win:"GOT IT",title:"ITCH!",sub:"December always wins",
paintDeath:function(t){backdrop("bed");stamp("mozzie",200,H*0.36,100);cameo("gogo",170,H*0.78,260,"panic",t)}},
function(sp){
 var spots=[],n=0,age=0,hits=0,act=actor(5),hotFor=Math.max(0.24,0.36/tempo(sp));
 for(var i=0;i<3;i++)spots.push({x:80+RNG()*200,y:H*0.3+RNG()*(H*0.28)});
 var ring={x:spots[0].x,y:spots[0].y,r:70,hot:false};
 return {pub:{ring:ring},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   age+=dt;var shrink=0.72,r=age<shrink?70-(age/shrink)*42:26;ring.x=spots[n].x;ring.y=spots[n].y;ring.r=r;ring.hot=age>=shrink;
   if(ring.hot){for(var s=0;s<ptr.swipes.length;s++){var sw=ptr.swipes[s];if(segHits(sw.x,sw.y,sw.dx,sw.dy,ring.x,ring.y,ring.r+8)){hits++;n++;age=0;sfx("swish");burst(ring.x,ring.y,GOLD,8);hitStop(0.04);if(hits>=3){this.done=true;playPop(act,"happy")}return}}}
   if(age>shrink+hotFor){this.fail=true;playOuch(act);sfx("puff")}
   this.pub={ring:{x:ring.x,y:ring.y,r:ring.r,hot:ring.hot}}},
  draw:function(){backdrop("bed");var ring=this.pub.ring;
   ctx.strokeStyle=ring.hot?"#e23b3b":PAPER;ctx.lineWidth=ring.hot?7:4;ctx.beginPath();ctx.arc(ring.x,ring.y,Math.max(8,ring.r),0,7);ctx.stroke();
   stamp("mozzie",ring.x,ring.y-ring.r-20,64);drawActor("gogo",act,180,H*0.9,260);marker(hits+"/3",W-30,H*0.2,18,PAPER)},
  bot:function(api){var r=this.pub.ring;if(r.hot)api.swipe(r.x-50,r.y,100,8)}}});

def("lights",{name:"The Sparking Switch",word:"FLIP",who:"auntie",bg:"night",cap:"Flipped every switch in the house when the power came back",dur:6.2,timeoutWin:false,how:"swipe",hint:"Swipe down the switch that is sparking",win:"SAFE",title:"POP!",sub:"that was the wrong one",
paintDeath:function(t){backdrop("night");cameo("auntie",180,H*0.74,270,"panic",t);burst(180,H*0.4,GOLD,4)}},
function(sp){
 var idx=Math.floor(RNG()*4),round=0,pause=0,danger=0,act=actor(1),sp1=tempo(sp);
 function ys(i){return H*0.24+i*112}
 return {pub:{switches:[]},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   if(pause>0){pause-=dt;if(pause<=0){var n=idx;while(n===idx)n=Math.floor(RNG()*4);idx=n;danger=0}}
   else{danger+=dt*sp1/1.35;if(danger>=1){this.fail=true;playOuch(act);sfx("zap");hitStop(0.08);return}
    for(var s=0;s<ptr.swipes.length&&!this.fail&&!this.done;s++){var sw=ptr.swipes[s];if(sw.dy<28)continue;
     var best=-1,bd=1e9;for(var i=0;i<4;i++){var dd=Math.abs(sw.y-ys(i));if(Math.abs(sw.x-180)<70&&dd<46&&dd<bd){bd=dd;best=i}}
     if(best<0)continue;
     if(best===idx){round++;sfx("pop");burst(180,ys(best),GOLD,6);if(round>=2){this.done=true;playPop(act,"happy")}else pause=0.42}
     else {this.fail=true;playOuch(act);sfx("zap")}}}
   var sws=[];for(var i=0;i<4;i++)sws.push({x:180,y:ys(i),w:130,h:84,hot:pause<=0&&i===idx,danger:pause<=0&&i===idx?danger:0});
   this.pub={switches:sws}},
  draw:function(){backdrop("night");var sws=this.pub.switches;
   for(var i=0;i<sws.length;i++){var s=sws[i];if(s.hot){ctx.strokeStyle="rgba(242,194,48,"+(0.4+s.danger*0.6)+")";ctx.lineWidth=6;ctx.beginPath();ctx.arc(s.x,s.y,58,0,7);ctx.stroke();
    if(Math.sin(CLK*10)>0){ctx.fillStyle=GOLD;ctx.fillRect(s.x+30,s.y-20,6,10);ctx.fillRect(s.x-36,s.y+8,8,5)}}
    stamp("switch",s.x,s.y,92)}
   drawActor("auntie",act,64,H*0.9,230)},
  bot:function(api){var sws=this.pub.switches||[];for(var i=0;i<sws.length;i++)if(sws[i].hot&&sws[i].danger<0.85){api.swipe(sws[i].x,sws[i].y-16,0,74);return}}}});
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
 window.__ewg={ready:true,list:LIST,run:function(){return run},sim:sim,def:DEF,perf:function(){return {ft:FT.slice(),lat:LAT.slice(),dpr:DPRC}},resetPerf:function(){FT.length=0;LAT.length=0}};
 if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0&&!BOT)navigator.serviceWorker.register("sw.js").catch(function(){});
}
function init(){
 cv=$("mgc");ctx=cv.getContext("2d");MAINX=ctx;BGC=$("bgc");if(BGC)BGX=BGC.getContext("2d",{alpha:false});
 var anc=null;
 cv.addEventListener("pointerdown",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;ptr.down=true;ptr.taps.push(p);ptr.stamp=performance.now();anc={x:p.x,y:p.y,t:ptr.stamp};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
 cv.addEventListener("pointermove",function(e){var p=toL(e);ptr.x=p.x;ptr.y=p.y;if(ptr.down&&anc){var dx=p.x-anc.x,dy=p.y-anc.y,now=performance.now();if(Math.hypot(dx,dy)>36&&now-anc.t<420){ptr.swipes.push({x:anc.x,y:anc.y,dx:dx,dy:dy});anc={x:p.x,y:p.y,t:now}}}});
 ["pointerup","pointercancel","lostpointercapture"].forEach(function(ev){cv.addEventListener(ev,function(){ptr.down=false;anc=null})});
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
