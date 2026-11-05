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
