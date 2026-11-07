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
