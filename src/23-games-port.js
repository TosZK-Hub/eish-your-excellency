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
 g.update=function(dt){g.t+=dt;g.U.mt+=dt;var ny=clamp(ptr.y,H*0.2,H*0.55);var dy=ny-g.by;g.by=ny;if(Math.abs(dy)>2){var d=dy>0?1:-1;if(g.dir&&d!==g.dir){g.got++;sfx("slurp");vib(5);if(g.got>=g.need&&!g.done){g.done=true;drops(180,H*0.7,"#e23b3b",8,true);setM(g.U,"happy")}}g.dir=d}};
 g.draw=function(){scene("sauce",function(){kitchen();tornRect(40,H*0.7,280,30,"#fbf6ea",3,0)});rollP(180,H*0.7,1.4,g.done);sauceP(180,g.by,1.5,Math.PI,0);
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
