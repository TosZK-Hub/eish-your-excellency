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
function hitStop(s){if(SET.rm)return;HIT=Math.max(HIT,Math.min(0.045,s||0.04))}
function bgFit(name){var im=ART.bg[name];if(!im)return{x:0,y:0,w:W,h:H};var s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;return{x:(W-w)/2,y:(H-h)/2,w:w,h:h}}
function propBox(name,x,y,w,pad){var im=ART.prop[name];var bh=im?im.height*(w/im.width):w;pad=pad||0;return{x:x,y:y,w:w+pad*2,h:bh+pad*2}}
function ground(){return H-8-SAB}

// ---------- art ----------
var ART={cast:{},bg:{},prop:{},bead:null}, META={};
var CASTS=["boet","auntie","uncle","tannie","gaatjie","gogo"];
var EXTRA={gogo:["crouch","air","land","cup","swat"],uncle:["reach","fan","fanb","pull"],boet:["leanl","leanr","toot","sit"],gaatjie:["shove","slam"],auntie:["flip"],tannie:["pinch"]};
var BGS=["kitchen","rank","braai","highway","road","night","stoep","car","stadium","bed"];
var PROPS=["shaker","wors","dog","taxi","taxi-closed","taxi-teal","taxi-orange","taxi-panel","taxi-shell","taxi-slab","taxi-inside","door","bakkie","candle","vuvu","mozzie","paper","biltong","petrol","pot","switch","hole"];
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
 var got=window.ART_MANIFEST?Promise.resolve(window.ART_MANIFEST):fetch("art/manifest.json").then(function(r){if(!r.ok)throw new Error("manifest");return r.json()});
 return got.then(function(m){
  META=m; var jobs=[], n=0, tot=CASTS.length*3+BGS.length+PROPS.length+1;
  function add(url,fn){n++;jobs.push(loadBitmap(url).then(function(im){fn(im);if(onp)onp(jobs.length,tot)}))}
  CASTS.forEach(function(id){ART.cast[id]={};["calm","happy","panic"].concat(EXTRA[id]||[]).forEach(function(p){add("art/cast/"+id+"-"+p+".webp",function(im){ART.cast[id][p]=im})})});
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
  var hx=x+(o.x||0)+(m.hx-m.fx)*dw*flip*sx;
  var hy=y+(o.y||0)+(m.hy-m.fy)*dh*sy;
  hatAt(hat,hx,hy,h*0.26);
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
 {t:0,sy:1,sx:1,y:0,rot:0,x:0,pose:a.pose||"calm"},
 {t:0.07,sy:1,sx:1,y:-6,rot:0,x:0,pose:"panic"},
 {t:0.18,sy:1,sx:1,y:2,rot:0,x:0,pose:"panic"},
 {t:0.34,sy:1,sx:1,y:0,rot:0,x:0,pose:"panic"}])}
function setPose(a,p){if(!p||a.clip||a.pose===p)return;a.pose2=a.pose;a.pose=p;a.blend=SET.rm?1:0}
function playClip(a,keys){clipTo(a,keys)}
var CLIP={
 hop:[{t:0,pose:"crouch",x:0,y:2,sx:1,sy:1,rot:0},{t:0.08,pose:"crouch",x:0,y:4,sx:1,sy:1,rot:0},{t:0.12,pose:"air",x:0,y:-14,sx:1,sy:1,rot:0},{t:0.22,pose:"air",x:0,y:-4,sx:1,sy:1,rot:0},{t:0.28,pose:"land",x:0,y:0,sx:1,sy:1,rot:0},{t:0.44,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0}],
 snatch:[{t:0,pose:"reach",x:0,y:0,sx:1,sy:1,rot:0},{t:0.1,pose:"happy",x:0,y:-8,sx:1,sy:1,rot:0},{t:0.28,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}],
 slam:[{t:0,pose:"shove",x:0,y:0,sx:1,sy:1,rot:0},{t:0.08,pose:"slam",x:0,y:3,sx:1,sy:1,rot:0},{t:0.26,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}],
 toot:[{t:0,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0},{t:0.05,pose:"toot",x:0,y:-3,sx:1,sy:1,rot:0},{t:0.26,pose:"toot",x:0,y:0,sx:1,sy:1,rot:0},{t:0.4,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0}],
 swat:[{t:0,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0},{t:0.05,pose:"swat",x:8,y:0,sx:1,sy:1,rot:0},{t:0.2,pose:"swat",x:0,y:0,sx:1,sy:1,rot:0},{t:0.34,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0}],
 flip:[{t:0,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0},{t:0.07,pose:"flip",x:0,y:2,sx:1,sy:1,rot:0},{t:0.22,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}]
};
function tick(a,dt){
 if(a.clip){a.t+=dt;var k=sampleKeys(a.clip,a.t);
  if(k.pose&&k.pose!==a.pose){a.pose2=a.pose;a.pose=k.pose;a.blend=0}
  a.x=k.x||0;a.y=k.y||0;a.sx=k.sx==null?1:k.sx;a.sy=k.sy==null?1:k.sy;a.rot=k.rot||0;
  if(a.t>=a.clip[a.clip.length-1].t)a.clip=null;
 } else if(!SET.rm&&a.pose==="calm"){var b=Math.sin(CLK*1.6+(a.ph||0));a.sy=1+b*0.012;a.sx=1-b*0.008}
 if(a.blend<1)a.blend=Math.min(1,a.blend+dt*(SET.rm?24:14));
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
// Twelve microgames. Collision rects are the same rects stored on pub.dbg.
function rankFit(){
 var im=ART.bg.rank; if(!im) return {x:0,y:0,w:W,h:H};
 var lane0=ground()-78, frac=0.925;
 var s=Math.max(W/im.width, lane0/(frac*im.height));
 var w=im.width*s, h=im.height*s;
 return {x:(W-w)/2, y:lane0-frac*h, w:w, h:h};
}
function lanesY(i){var f=rankFit();return f.y+[0.925,0.764,0.610,0.460][i]*f.h}
function laneBand(){return rankFit().h*0.115}
function bgY(name,frac){var f=bgFit(name);return f.y+frac*f.h}
function stand(name){return Math.min(bgY(name,0.9), ground()-4)}
var VAND={w:691,h:420,dx:256,dy:74,dw:118,dh:254,slide:108};
function shoulderFeet(){return Math.max(SAT+210, Math.min(H*0.66, ground()-18))}
function drawShoulder(){
 var feet=shoulderFeet();
 var im=ART.bg.highway, sky=feet-Math.max(130, Math.min(H*0.3, 240));
 if(im) ctx.drawImage(im, 0, 0, im.width, im.height*0.48, 0, 0, W, sky);
 else {ctx.fillStyle="#8ec6ea";ctx.fillRect(0,0,W,sky)}
 ctx.fillStyle="#2f6e2a";ctx.fillRect(0, sky-1, W, H-sky);
 ctx.fillStyle="#2b3034";ctx.fillRect(0, feet-6, W, 48);
 ctx.fillStyle="#e0b23a";ctx.fillRect(0, feet-1, W, 4);
 ctx.fillStyle="#347a2e";ctx.fillRect(0, feet+42, W, H);
 return feet;
}
function paintVan(cx, feet, width, slide){
 var sc=width/VAND.w, h=VAND.h*sc, left=cx-width/2, top=feet-h;
 ctx.save();ctx.fillStyle="rgba(20,16,12,.3)";ctx.beginPath();ctx.ellipse(cx, feet+3, width*0.4, 6, 0, 0, 7);ctx.fill();ctx.restore();
 var ins=ART.prop["taxi-inside"], sh=ART.prop["taxi-shell"], sl=ART.prop["taxi-slab"];
 if(ins) ctx.drawImage(ins, left, top, width, h);
 if(sh) ctx.drawImage(sh, left, top, width, h);
 var pw=VAND.dw*sc, ph=VAND.dh*sc, px=left+VAND.dx*sc+slide, py=top+VAND.dy*sc;
 if(sl) ctx.drawImage(sl, px, py, pw, ph);
 return {left:left,top:top,w:width,h:h,feet:feet,panel:{x:px+pw/2,y:py+ph/2,w:pw,h:ph},slideMax:VAND.slide*sc};
}
function gesture(min){var out=ptr.swipes.slice(),s=ptr.stroke;if(s&&Math.hypot(s.dx||0,s.dy||0)>=(min||22))out.push(s);return out}
function fresh(g,sw){if(!sw)return false;if(sw.gid==null)return true;return g._gid!==sw.gid}
function claim(g,sw){if(sw&&sw.gid!=null)g._gid=sw.gid}

def("salt",{name:"Over-Salted Pap",word:"LET GO",who:"tannie",bg:"kitchen",cap:"Let Gogo season the pap 'just a little'",dur:5.4,timeoutWin:false,how:"hold",hint:"Hold, then let go in the green",win:"JUST RIGHT",title:"SNOW!",sub:"that is not 'a little'",
paintDeath:function(t){backdrop("kitchen");stamp("pot",180,H*0.48,180);cameo("gogo",110,H*0.72,170,"panic",t);cameo("tannie",250,ground(),200,"panic",t,{delay:0.08})}},
function(sp){
 var fill=0,pouring=false,lo=0.4,hi=0.74,rate=0.26*tempo(sp),tilt=0.08,tan=actor(1),go=actor(2);
 return {pub:{fill:0,lo:lo,hi:hi,pouring:false},
  update:function(dt){this.t+=dt;tick(tan,dt);tick(go,dt);
   if(ptr.pressed&&!pouring&&fill<0.02){pouring=true;sfx("pop")}
   if(pouring){setPose(tan,"pinch");fill+=rate*dt;if(fill>0.96){this.fail=true;playOuch(tan)}}
   else if(!this.done&&!this.fail)setPose(tan,"calm");
   if(ptr.released&&pouring){pouring=false;if(fill>=lo&&fill<=hi){this.done=true;playClip(tan,[{t:0,pose:"pinch",x:0,y:0,sx:1,sy:1,rot:0},{t:0.16,pose:"happy",x:0,y:-4,sx:1,sy:1,rot:0},{t:0.3,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}]);sfx("coin")}else{this.fail=true;playOuch(tan)}}
   tilt=lag(tilt,pouring?0.55:0.06,dt,14);
   var feet=stand("kitchen");
   var pot=propBox("pot",168,feet-70,140,0), sh=propBox("shaker",250,feet-120,58,6);
   this.pub={fill:fill,lo:lo,hi:hi,pouring:pouring,shaker:sh,pot:pot,dbg:[sh,pot]}},
  draw:function(){backdrop("kitchen");var p=this.pub,feet=stand("kitchen");if(!p.pot)return;stamp("pot",p.pot.x,p.pot.y,140);meter(16,SAT+78,34,Math.min(H*0.32,200),p.fill,p.lo,p.hi);
   marker(p.fill<p.lo?"MORE":p.fill>p.hi?"EASY":"NOW",36,SAT+64,13,p.fill>=p.lo&&p.fill<=p.hi?"#146c2e":INK);
   drawActor("gogo",go,108,feet,Math.min(170,H*0.28));stamp("shaker",p.shaker.x,p.shaker.y,58,{rot:tilt});drawActor("tannie",tan,262,feet,Math.min(190,H*0.32))},
  bot:function(api){var p=this.pub;if(!p.pouring)api.hold(true,180,400);else if(p.fill>=p.lo+0.06)api.hold(false);else api.hold(true,180,400)}}});

def("quantum",{name:"Taxi Rank Crossing",word:"HOP",who:"gogo",bg:"rank",cap:"Stood in the taxi lane arguing about the fare",dur:9.2,timeoutWin:false,how:"swipe",hint:"Swipe up when the next lane glows",win:"CROSSED!",title:"FLAT!",sub:"but the fare, my child",
paintDeath:function(t){backdrop("rank");stamp("taxi-closed",180,H*0.4,160);cameo("gogo",180,H*0.72,160,"panic",t)}},
function(sp){
 var dir=RNG()<0.5?-1:1,taxis=[],lane=0,hop=0,from=0,gx=180,act=actor(3),speed=72*tempo(sp),want=0;
 function taxiSize(){var h=laneBand()*0.82;return {w:h*(691/420),h:h}}
 var ts0=taxiSize();
 for(var L=0;L<4;L++)for(var i=0;i<2;i++){var gap=ts0.w+W*0.72;var lead=ts0.w*0.5+speed*1.7+50;var x=gx+(dir<0?1:-1)*(lead+i*gap+L*24);taxis.push({lane:L,x:x})}
 function hitVan(ln,pad){var s=taxiSize();for(var i=0;i<taxis.length;i++){var t=taxis[i];if(t.lane===ln&&Math.abs(t.x-gx)<s.w*0.5+pad)return t}return null}
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);   var s=taxiSize(),ahead=Math.max(36,speed*0.75);
   for(var i=0;i<taxis.length;i++){var t=taxis[i];t.x+=dir*speed*dt;if(dir>0&&t.x>W+s.w+8)t.x=-s.w-16;if(dir<0&&t.x<-s.w-8)t.x=W+s.w+16}
   var body={x:gx,y:lanesY(Math.min(lane,3))+s.h*0.15,w:36,h:s.h*0.55};
   if(hop>0){hop-=dt;if(hop<=0){hop=0;if(lane>=3){this.done=true;playClip(act,CLIP.hop)}else if(hitVan(lane,2)){this.fail=true;playOuch(act);sfx("thud")}}}
   else{var gs=gesture(18);for(var k=0;k<gs.length;k++)if(gs[k].dy<-22&&fresh(this,gs[k])){claim(this,gs[k]);want=0.5}
    if(want>0){want-=dt;if(lane<3&&!hitVan(lane+1,ahead)){from=lane;lane++;hop=0.18;want=0;sfx("swish");playClip(act,CLIP.hop)}}
    else if(hitVan(lane,0)){this.fail=true;playOuch(act);sfx("thud")}}
   var dbg=[],list=[];
   for(var n=0;n<taxis.length;n++){var r={x:taxis[n].x,y:lanesY(taxis[n].lane),w:s.w,h:s.h*0.86,lane:taxis[n].lane};list.push(r);dbg.push(r)}
   dbg.push(body);
   var gy=hop>0?lanesY(from)+(lanesY(lane)-lanesY(from))*clamp(1-hop/0.2,0,1):lanesY(lane);
   this.pub={lane:lane,gx:gx,gy:gy,hop:hop>0,nextClear:lane<3&&!hop&&!hitVan(lane+1,ahead),taxis:list,dbg:dbg,body:body}},
  draw:function(){var f=rankFit(),im=ART.bg.rank;if(im){ctx.fillStyle="#8ec6ea";ctx.fillRect(0,0,W,H);ctx.drawImage(im,f.x,f.y,f.w,f.h)}else backdrop("rank");var s=taxiSize(),fleet=["taxi-closed","taxi-teal","taxi-orange"],p=this.pub;if(!p.taxis)return;
   if(p.nextClear){var y=lanesY(p.lane+1),b=laneBand();ctx.fillStyle="rgba(242,194,48,.40)";ctx.fillRect(0,y-b*0.5,W,b)}
   for(var k=0;k<p.taxis.length;k++){var t=p.taxis[k];stamp(fleet[t.lane%3],t.x,t.y,s.w,{flip:dir>0})}
   drawActor("gogo",act,gx,p.gy+s.h*0.42,Math.max(90,s.h*1.15))},
  bot:function(api){var p=this.pub;if(!p.hop&&p.lane<3&&p.nextClear)api.swipe(180,400,0,-80)}}});

def("wors",{name:"Rescue the Wors",word:"SNATCH",who:"uncle",bg:"braai",cap:"Turned his back on the wors 'for one second'",dur:4.6,timeoutWin:false,how:"drag",hint:"Drag his hands onto the wors",win:"SAVED!",title:"GONE!",sub:"the dog says thanks",
paintDeath:function(t){backdrop("braai");stamp("dog",220,H*0.48,180);stamp("wors",140,H*0.42,90);cameo("uncle",120,ground(),200,"panic",t)}},
function(sp){
 var wx=210,wy=0,ux=90,uy=0,wind=Math.max(0.9,1.2/tempo(sp)),got=false,act=actor(1);
 var hand=null;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);
   var feet=stand("braai"); wy=bgY("braai",0.51); uy=uy||feet;
   var wors=propBox("wors",wx,wy,88,8), dogW=140;
   if(!got&&!this.fail){
    if(ptr.down){ux=ptr.x;uy=Math.min(feet,ptr.y+80);setPose(act,"reach")}
    hand={x:ptr.down?ptr.x:ux,y:ptr.down?ptr.y:uy-90,w:80,h:64};
    var dogT=this.t-wind,dogX=wx+280-(dogT>0?dogT*100*tempo(sp):0);
    var dog=propBox("dog",dogX,wy,dogW,0);
    if(boxHit(hand,wors)){got=true;this.done=true;playClip(act,CLIP.snatch);sfx("coin")}
    else if(dogT>0&&boxHit(dog,wors)){this.fail=true;playOuch(act);sfx("bark")}
    this._dog=dog;this._wors=wors;this._hand=hand;
   }
   this.pub={uncle:{x:ux,y:uy,w:70,h:120},wors:this._wors,dog:this._dog,hand:this._hand,dbg:[this._wors,this._dog,this._hand].filter(Boolean)}},
  draw:function(){backdrop("braai");var w=this.pub.wors,d=this.pub.dog;
   if(w)stamp("wors",w.x,w.y,96);
   if(d)stamp("dog",d.x,d.y,150,{flip:true});
   if(this.pub.uncle)drawActor("uncle",act,this.pub.uncle.x,this.pub.uncle.y,200)},
  bot:function(api){var w=this.pub.wors;if(w)api.hold(true,w.x,w.y)}}});

def("door",{name:"Shut the Taxi Door",word:"SLAM",who:"gaatjie",bg:"highway",cap:"Left the sliding door open on the highway",dur:6.2,timeoutWin:false,how:"drag",hint:"Drag the door shut along the van",win:"SHUT!",title:"LEFT IT!",sub:"the highway kept the door",
paintDeath:function(t){var feet=drawShoulder();var lay=paintVan(W*0.58, feet, Math.min(250,W*0.66), 100);cameo("gaatjie", lay.left+lay.w*0.16, feet, lay.h*0.58, "panic", t, {flip:true})}},
function(){
 var slide=null, drag=false, grab=0, act=actor(2), shut=false;
 function layout(){var feet=shoulderFeet();var width=Math.min(250, W*0.66);var sc=width/VAND.w;return {feet:feet,width:width,max:VAND.slide*sc,cx:W*0.6,sc:sc}}
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);var L=layout();if(slide==null)slide=L.max;
   var left=L.cx-L.width/2, pw=VAND.dw*L.sc, ph=VAND.dh*L.sc, doorLeft=left+VAND.dx*L.sc;
   var panel={x:doorLeft+slide+pw/2,y:(L.feet-VAND.h*L.sc)+VAND.dy*L.sc+ph/2,w:pw,h:ph};
   if(!this.done){
    if(ptr.pressed&&boxHit({x:ptr.x,y:ptr.y,w:32,h:32},panel)){drag=true;grab=slide-(ptr.x-doorLeft);sfx("tick")}
    if(!ptr.down)drag=false;
    if(drag){slide=clamp(ptr.x+grab-doorLeft, 0, L.max);setPose(act,"shove")}
    if(slide<=8){this.done=true;shut=true;slide=0;playClip(act,CLIP.slam);sfx("thud")}
   }
   this.pub={panel:panel,slide:slide,max:L.max,feet:L.feet,width:L.width,cx:L.cx,armed:drag,dbg:[panel]}},
  draw:function(){var p=this.pub;if(!p.feet)return;drawShoulder();
   paintVan(p.cx, p.feet, p.width, p.slide||0);
   drawActor("gaatjie",act, p.cx-p.width*0.2, p.feet, p.width*0.44, {flip:true})},
  bot:function(api){var p=this.pub;if(!p.panel)return;if(!p.armed)api.hold(true,p.panel.x,p.panel.y);else api.hold(true,p.panel.x-p.max-8,p.panel.y)}}});

def("pothole",{name:"Pothole Dash",word:"STEER",who:"boet",bg:"road",cap:"Tried to fix the pothole with a spade and positive thinking",dur:6.6,timeoutWin:true,how:"drag",hint:"Drag to steer the bakkie around the holes",win:"SMOOTH!",title:"BUMP!",sub:"positive thinking lost",
paintDeath:function(t){backdrop("road");stamp("bakkie",180,H*0.7,160);stamp("hole",180,H*0.7,90);cameo("boet",270,ground(),150,"panic",t)}},
function(sp){
 var bx=180,obs=[],wait=0.4,seq=[-1,1,0,1,-1,0],si=0,act=actor(0),sp1=tempo(sp);
 function carY(){return Math.min(H*0.7, ground()-150)}
 function proj(o){var z=o.z,y=H*0.42+z*(carY()-H*0.42),x=180+o.lane*(56+z*16),sc=0.42+z*0.7;var hb=propBox("hole",x,y,62*sc,0);return {x:x,y:y,z:z,w:hb.w*0.62,h:36,draw:62*sc}}
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);
   if(ptr.down)bx=clamp(ptr.x,28,W-28);
   wait-=dt;if(wait<=0&&si<seq.length){obs.push({lane:seq[si++],z:0});wait=1.75/sp1}
   var list=[],hit=false,car={x:bx,y:carY(),w:70,h:28};
   for(var i=obs.length-1;i>=0;i--){obs[i].z+=dt*0.32*sp1;var p=proj(obs[i]);list.push(p);
    if(Math.abs(p.y-car.y)<20&&Math.abs(p.x-car.x)<(p.w+car.w)*0.5)hit=true;
    if(p.z>1.3)obs.splice(i,1)}
   if(hit&&!this.fail){this.fail=true;playOuch(act);sfx("thud")}
   else if(bx<150)setPose(act,"leanl");else if(bx>210)setPose(act,"leanr");else setPose(act,"calm");
   var dbg=[car];for(var k=0;k<list.length;k++)if(list[k].z>0.35)dbg.push(list[k]);
   this.pub={x:bx,y:car.y,car:car,obs:list,dbg:dbg}},
  draw:function(){backdrop("road");var ordered=(this.pub.obs||[]).slice().sort(function(a,b){return a.z-b.z});if(!this.pub.car)return;
   for(var k=0;k<ordered.length;k++){var p=ordered[k];stamp("hole",p.x,p.y,p.draw)}
   var car=this.pub.car;stamp("bakkie",car.x,car.y,128);
   drawActor("boet",act,car.x-6,car.y+8,58)},
  bot:function(api){var p=this.pub,threat=null;(p.obs||[]).forEach(function(o){if(o.z>0.28&&o.z<1.18&&(!threat||o.z>threat.z))threat=o});
   var target=p.x;if(threat)target=threat.x>=p.x?42:W-42;api.hold(true,target,p.y)}}});

def("candle",{name:"Load-shedding Candle",word:"CUP",who:"gogo",bg:"night",cap:"Let the last candle blow out in Stage 6",dur:6.8,timeoutWin:true,how:"hold",hint:"Hold only while the wind touches the flame",win:"STILL LIT",title:"DARK!",sub:"stage 6 wins again",
paintDeath:function(t){backdrop("night");cameo("gogo",180,ground(),200,"panic",t);marker("pff",180,H*0.36,28,INK)}},
function(sp){
 var gusts=[1.15,2.55,3.95,5.4],sp1=tempo(sp),smother=0,act=actor(4),alive=true,fx=180;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(!alive)return;
   var fy=stand("night")-110, fx=118, flame=propBox("candle",fx,fy,40,4);
   var gust=false,hit=false,travel=0.95/sp1,gx=this._gx||-40;
   for(var i=0;i<gusts.length;i++){var u=(this.t-gusts[i]);if(u>=0&&u<=travel){gust=true;gx=-60+(u/travel)*(fx+80);if(Math.abs(gx-fx)<flame.w*0.55)hit=true}}
   this._gx=gx;
   if(ptr.down&&gust)setPose(act,"cup");else if(alive&&!this.done)setPose(act,"calm");
   if(hit&&!ptr.down){alive=false;this.fail=true;playOuch(act);sfx("puff")}
   if(ptr.down&&!gust)smother+=dt*0.7;else smother=Math.max(0,smother-dt*0.8);
   if(smother>=1){alive=false;this.fail=true;playOuch(act);sfx("puff")}
   if(alive&&this.t>gusts[gusts.length-1]+travel+0.3){this.done=true;playClip(act,[{t:0,pose:"calm",x:0,y:0,sx:1,sy:1,rot:0},{t:0.2,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}])}
   var wind={x:gx,y:fy,w:36,h:flame.h*0.45};
   this.pub={gust:gust,hit:hit,smother:smother,flame:flame,gx:gx,dbg:[flame].concat(gust?[wind]:[])}},
  draw:function(){backdrop("night");var f=this.pub.flame;if(!f)return;var fy=f.y;
   if(this.pub.gust){ctx.strokeStyle="rgba(255,250,240,.9)";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(this.pub.gx-70,fy);ctx.lineTo(this.pub.gx,fy);ctx.stroke()}
   stamp("candle",f.x,f.y,46);
   if(ptr.down&&this.pub.gust){ctx.strokeStyle=PAPER;ctx.lineWidth=5;ctx.beginPath();ctx.arc(f.x,fy,f.w*0.7,Math.PI*1.15,Math.PI*1.85);ctx.stroke()}
   meter(16,SAT+70,28,Math.min(160,H*0.24),this.pub.smother,0.99,1);marker("CUP",34,SAT+56,12,INK);
   drawActor("gogo",act,200,stand("night"),Math.min(210,H*0.34))},
  bot:function(api){var p=this.pub;if(p.gust)api.hold(true,180,400);else api.hold(false)}}});

def("braai",{name:"Fan the Braai",word:"FAN",who:"uncle",bg:"braai",cap:"Used petrol to 'help' the braai along",dur:7.2,timeoutWin:false,how:"circle",hint:"Circle the ring. Do not touch the can",win:"COALS!",title:"WHOOMP!",sub:"petrol is not a spice",
paintDeath:function(t){backdrop("braai");stamp("petrol",180,H*0.46,90);cameo("uncle",80,ground(),190,"panic",t)}},
function(sp){
 var heat=0,lx=null,ly=null,side=RNG()<0.5?1:-1,act=actor(2);
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.done||this.fail)return;
   var cx=198,cy=bgY("braai",0.52),ring=64;
   var petrol=propBox("petrol",side>0?W-46:46,ground()-56,56,4);
   var finger={x:ptr.x,y:ptr.y,w:22,h:22};
   if(ptr.down){if(boxHit(finger,petrol)){this.fail=true;playOuch(act);sfx("whoosh");return}
    var rr=Math.hypot(ptr.x-cx,ptr.y-cy);
    if(lx!=null&&rr>ring-28&&rr<ring+28){var moved=Math.hypot(ptr.x-lx,ptr.y-ly);if(moved>0.4&&moved<80)heat+=moved*0.7}
    lx=ptr.x;ly=ptr.y;setPose(act,Math.sin(Math.atan2(ptr.y-cy,ptr.x-cx))>0?"fan":"fanb")}else{lx=null;ly=null}
   if(heat>=100){this.done=true;sfx("sizzle")}
   var coals={x:cx,y:cy,w:ring*2,h:ring*2};
   this.pub={heat:heat/100,coals:coals,petrol:petrol,ring:ring,side:side,dbg:[petrol,ptr.down?finger:null].filter(Boolean)}},
  draw:function(){backdrop("braai");var p=this.pub,cx=p.coals.x,cy=p.coals.y,ring=p.ring;
   ctx.strokeStyle="rgba(255,250,240,.85)";ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,ring,0,7);ctx.stroke();
   ctx.fillStyle="rgba(255,120,40,"+(0.25+p.heat*0.5)+")";ctx.beginPath();ctx.ellipse(cx,cy,36,18,0,0,7);ctx.fill();
   stamp("petrol",p.petrol.x,p.petrol.y,64);marker("NO",p.petrol.x,p.petrol.y-p.petrol.h*0.5-14,14,"#e23b3b");
   meter(16,SAT+56,28,140,p.heat,0.99,1);
   drawActor("uncle",act,p.side>0?64:W-64,stand("braai"),Math.min(170,H*0.28))},
  bot:function(api){var c=this.pub.coals,r=(this.pub.ring||72)-6;if(!c)return;this.ang=(this.ang||0)+0.28;api.hold(true,c.x+Math.cos(this.ang)*r,c.y+Math.sin(this.ang)*(r*0.72))}}});

def("vuvu",{name:"Vuvuzela Blast",word:"TOOT",who:"boet",bg:"stadium",cap:"Blew the vuvuzela right in the ref's ear",dur:6.6,timeoutWin:false,how:"tap",hint:"Tap when the note is inside the ring",win:"LOUD!",title:"TOO LOUD!",sub:"the ref heard that",
paintDeath:function(t){backdrop("stadium");stamp("vuvu",120,H*0.5,100);cameo("boet",220,ground(),180,"panic",t)}},
function(sp){
 var travel=1.45/tempo(sp),notes=[],hits=0,misses=0,act=actor(0);
 var zone={x:210,y:0,r:54};
 for(var i=0;i<4;i++)notes.push({t0:0.45+i*1.35,hit:false,counted:false});
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   var bh=Math.min(190,H*0.3); zone.y=stand("stadium")-bh*0.58;
   var on=false,inside=null;
   for(var i=0;i<notes.length;i++){var n=notes[i],u=(this.t-n.t0)/travel;n.u=u;
    if(u>=0&&u<=1.05){n.x=-20+Math.min(u,1)*400;n.y=zone.y;on=true;if(!n.hit&&Math.abs(n.x-zone.x)<zone.r)inside=n;if(!n.hit&&!n.counted&&u>1){n.counted=true;misses++}}}
   if(ptr.taps.length){if(inside){inside.hit=true;inside.counted=true;hits++;sfx("pop");playClip(act,CLIP.toot)}else if(on){misses++}}
   if(misses>=2){this.fail=true;playOuch(act)}
   else if(hits>=4){this.done=true}
   var noteDbg=notes.filter(function(n){return n.u>=0&&n.u<=1}).map(function(n){return {x:n.x,y:n.y,w:28,h:28}});
   this.pub={notes:noteDbg,zone:{x:zone.x,y:zone.y,r:zone.r},dbg:[{x:zone.x,y:zone.y,w:zone.r*2,h:zone.r*2}].concat(noteDbg)}},
  draw:function(){backdrop("stadium");var z=this.pub.zone;if(!z)return;ctx.strokeStyle=GOLD;ctx.lineWidth=6;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,7);ctx.stroke();
   var ns=this.pub.notes;for(var i=0;i<ns.length;i++){ctx.fillStyle=PAPER;ctx.beginPath();ctx.arc(ns[i].x,ns[i].y,14,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.stroke()}
   var feet=stand("stadium"), tall=Math.min(190,H*0.3);
   drawActor("boet",act,118,feet,tall);stamp("vuvu",168,feet-tall*0.58,64,{rot:-0.6});marker(hits+"/4",W-36,SAT+40,18,PAPER)},
  bot:function(api){var p=this.pub;if(!p.notes||!p.zone)return;if(this._lt&&this.t-this._lt<0.45)return;for(var i=0;i<p.notes.length;i++){var n=p.notes[i];if(Math.abs(n.x-p.zone.x)<p.zone.r*0.45){this._lt=this.t;api.tap(p.zone.x,p.zone.y);return}}}}});

def("fence",{name:"Free Biltong",word:"PULL",who:"uncle",bg:"stoep",cap:"Touched the electric fence to grab free biltong",dur:5.4,timeoutWin:true,how:"drag",hint:"Hold him inside the green patch",win:"HELD!",title:"BZZT!",sub:"the biltong was a trap",
paintDeath:function(t){backdrop("stoep");stamp("biltong",250,H*0.36,90);cameo("uncle",140,ground(),200,"panic",t)}},
function(sp){
 var x=92,wire=292,act=actor(1),creep=28*tempo(sp),half=52;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail)return;
   var wave=Math.sin(this.t*2.2),lung=wave>0.78;
   var feet=stand("stoep"), bh=Math.min(200,H*0.32);
   if(!ptr.down){x+=dt*(creep+(lung?90:0));creep+=dt*7*tempo(sp)}
   else{x=clamp(ptr.x,40,wire-half-6);setPose(act,"pull")}
   var body={x:x,y:feet-bh*0.42,w:half*2,h:bh*0.75};
   var fence={x:wire,y:(SAT+40+feet)/2,w:22,h:feet-(SAT+40)};
   if(body.x+body.w/2>=wire-8){this.fail=true;playOuch(act);sfx("zap")}
   var safe={x:96,y:feet-bh*0.35,w:150,h:bh*0.8};
   this.pub={x:x,y:body.y,wire:wire,safe:safe.x,safeRect:safe,lunge:lung,body:body,dbg:[body,fence,safe]}},
  draw:function(){backdrop("stoep");var s=this.pub.safeRect,wire=this.pub.wire,feet=stand("stoep");if(!s)return;
   ctx.fillStyle="rgba(86,160,70,.35)";ctx.fillRect(s.x-s.w/2, feet-s.h, s.w, s.h);
   ctx.strokeStyle="#1b4d22";ctx.lineWidth=3;ctx.strokeRect(s.x-s.w/2, feet-s.h, s.w, s.h);marker("SAFE",s.x,feet-s.h+16,14,"#1b4d22");
   ctx.fillStyle="#5c3b22";ctx.fillRect(wire-7, SAT+36, 14, feet-(SAT+36));
   ctx.strokeStyle="#ff2a2a";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(wire, SAT+48);ctx.lineTo(wire, feet);ctx.stroke();
   ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wire-16, SAT+78);ctx.lineTo(wire-16, feet);ctx.stroke();
   stamp("biltong",wire+22, SAT+120, 70);
   drawActor("uncle",act,this.pub.x,feet,Math.min(200,H*0.32))},
  bot:function(api){api.hold(true,this.pub.safe||90,this.pub.y||400)}}});

def("carseat",{name:"Hot Car Seat",word:"COVER",who:"boet",bg:"car",cap:"Sat on a vinyl car seat in January",dur:6.2,timeoutWin:false,how:"drag",hint:"Drag the paper onto the seat, then tap the seat",win:"AHH",title:"YOW!",sub:"January vinyl",
paintDeath:function(t){backdrop("car");cameo("boet",180,ground(),190,"panic",t)}},
function(){
 var paper=null,seat=null,grab=false,covered=false,act=actor(0);
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.done||this.fail)return;
   var feet=stand("car");
   seat={x:210,y:feet-110,w:160,h:90};
   if(!paper)paper={x:70,y:feet-24,w:0,h:0};
   var vis=propBox("paper",paper.x,paper.y,104,8);paper.w=vis.w;paper.h=vis.h;
   var finger={x:ptr.x,y:ptr.y,w:26,h:26};
   if(ptr.pressed&&boxHit(finger,paper)){grab=true;sfx("tick")}
   if(!ptr.down)grab=false;
   if(grab){paper.x=ptr.x;paper.y=Math.min(ptr.y,ground()-40)}
   if(!covered&&boxHit(paper,seat)){covered=true;paper.x=seat.x;paper.y=seat.y;sfx("pop")}
   var sit=false;
   if(!grab){if(ptr.pressed&&boxHit(finger,seat))sit=true;for(var ti=0;ti<ptr.taps.length;ti++)if(boxHit({x:ptr.taps[ti].x,y:ptr.taps[ti].y,w:24,h:24},seat))sit=true}
   if(sit){if(covered){this.done=true;setPose(act,"sit")}else{this.fail=true;playOuch(act);sfx("splat")}}
   this.pub={paper:paper,seat:seat,covered:covered,held:grab,dbg:[paper,seat]}},
  draw:function(){backdrop("car");var s=this.pub.seat,p=this.pub.paper;if(!s||!p)return;
   ctx.strokeStyle=this.pub.covered?"#2e6b32":"#e23b3b";ctx.lineWidth=4;ctx.setLineDash([8,6]);ctx.strokeRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h);ctx.setLineDash([]);
   if(!this.pub.covered){ctx.fillStyle="rgba(255,180,60,.2)";ctx.fillRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h)}
   stamp("paper",p.x,p.y,104);
   drawActor("boet",act,this.pub.covered&&this.done?s.x:78,this.done?s.y+24:stand("car"),this.done?130:Math.min(160,H*0.26))},
  bot:function(api){var p=this.pub;if(!p.paper)return;if(!p.covered){if(!p.held)api.hold(true,p.paper.x,p.paper.y);else api.hold(true,p.seat.x,p.seat.y)}else api.tap(p.seat.x,p.seat.y)}}});

def("mozzie",{name:"Swat the Mozzie",word:"SWIPE",who:"gogo",bg:"bed",cap:"Slept with the window open in December",dur:6.8,timeoutWin:false,how:"swipe",hint:"Swipe through the mozzie when the ring turns red",win:"GOT IT",title:"ITCH!",sub:"December always wins",
paintDeath:function(t){backdrop("bed");stamp("mozzie",180,H*0.36,70);cameo("gogo",180,ground(),190,"panic",t)}},
function(sp){
 var spots=[],n=0,age=0,hits=0,act=actor(5),hotFor=Math.max(0.85,1.05/tempo(sp));
 for(var i=0;i<3;i++)spots.push({x:90+RNG()*180,y:0});
 var ring={x:spots[0].x,y:0,r:64,hot:false};
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   var yTop=stand("bed")-Math.min(220,H*0.34), yBot=stand("bed")-90;
   if(!spots[0].y)for(var i=0;i<spots.length;i++)spots[i].y=yTop+RNG()*Math.max(20,yBot-yTop);
   age+=dt;var shrink=0.7,r=age<shrink?68-(age/shrink)*30:36;ring.x=spots[n].x;ring.y=spots[n].y;ring.r=r;ring.hot=age>=shrink;
   if(ring.hot){var gs=gesture(16);for(var s=0;s<gs.length;s++){var sw=gs[s];if(!fresh(this,sw))continue;if(segHits(sw.x,sw.y,sw.dx,sw.dy,ring.x,ring.y,ring.r+28)){claim(this,sw);hits++;n++;age=0;sfx("swish");if(hits>=3)this.done=true;break}}}
   if(age>shrink+hotFor){this.fail=true;playOuch(act);sfx("puff")}
   var bug=propBox("mozzie",ring.x,ring.y,52,0);
   this.pub={ring:{x:ring.x,y:ring.y,r:ring.r,hot:ring.hot},dbg:[bug,{x:ring.x,y:ring.y,w:(ring.r+10)*2,h:(ring.r+10)*2}]}},
  draw:function(){backdrop("bed");var ring=this.pub.ring;
   ctx.strokeStyle=ring.hot?"#e23b3b":PAPER;ctx.lineWidth=ring.hot?7:4;ctx.beginPath();ctx.arc(ring.x,ring.y,Math.max(12,ring.r),0,7);ctx.stroke();
   stamp("mozzie",ring.x,ring.y,48);drawActor("gogo",act,200,stand("bed"),Math.min(180,H*0.28));marker(hits+"/3",W-30,SAT+40,18,PAPER)},
  bot:function(api){var r=this.pub.ring;if(r&&r.hot)api.swipe(r.x-r.r-10,r.y,r.r*2+24,6)}}});

def("lights",{name:"The Sparking Switch",word:"FLIP",who:"auntie",bg:"night",cap:"Flipped every switch in the house when the power came back",dur:6.6,timeoutWin:false,how:"swipe",hint:"Swipe down the switch that is sparking",win:"SAFE",title:"POP!",sub:"that was the wrong one",
paintDeath:function(t){backdrop("night");cameo("auntie",250,ground(),180,"panic",t)}},
function(sp){
 var idx=Math.floor(RNG()*4),round=0,pause=0,danger=0,act=actor(1),sp1=tempo(sp);
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   var feet=stand("night"), top=feet-Math.min(250,H*0.38), bot=feet-70, gap=(bot-top)/3, swH=Math.min(72,gap-6);
   function sy(i){return top+i*gap}
   if(pause>0){pause-=dt;if(pause<=0){var n=idx;while(n===idx)n=Math.floor(RNG()*4);idx=n;danger=0}}
   else{danger+=dt*sp1/1.55;if(danger>=1){this.fail=true;playOuch(act);sfx("zap");return}
    var gs=gesture(18);
    for(var s=0;s<gs.length&&!this.fail&&!this.done;s++){var sw=gs[s];if(sw.dy<22||!fresh(this,sw))continue;
     var hitHot=false,hitOther=false;
     for(var i=0;i<4;i++){var crossed=false;for(var k=0;k<=6;k++){var px=sw.x+sw.dx*k/6,py=sw.y+sw.dy*k/6;if(Math.abs(px-118)<86&&Math.abs(py-sy(i))<swH*0.9)crossed=true}
      if(!crossed)continue;if(i===idx)hitHot=true;else hitOther=true}
     if(!hitHot&&!hitOther)continue;
     claim(this,sw);
     if(hitHot){round++;sfx("pop");playClip(act,CLIP.flip);if(round>=2)this.done=true;else pause=0.45}
     else {this.fail=true;playOuch(act);sfx("zap")}}}
   var sws=[],dbg=[];
   for(var i=0;i<4;i++){var box={x:118,y:sy(i),w:110,h:swH,hot:pause<=0&&i===idx,danger:pause<=0&&i===idx?danger:0};sws.push(box);dbg.push(box)}
   this.pub={switches:sws,dbg:dbg}},
  draw:function(){backdrop("night");var sws=this.pub.switches;if(!sws)return;
   for(var i=0;i<sws.length;i++){var s=sws[i];
    if(s.hot){ctx.strokeStyle="rgba(242,194,48,"+(0.45+s.danger*0.55)+")";ctx.lineWidth=6;ctx.strokeRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h)}
    stamp("switch",s.x,s.y,Math.min(70,s.h*0.7))}
   drawActor("auntie",act,268,stand("night"),Math.min(200,H*0.32))},
  bot:function(api){var sws=this.pub.switches||[];for(var i=0;i<sws.length;i++)if(sws[i].hot&&sws[i].danger<0.8){api.swipe(sws[i].x,sws[i].y-20,0,sws[i].h);return}}}});
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
