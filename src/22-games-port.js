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
