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
