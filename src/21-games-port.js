// ===== 1. Pothole Dash =====
def("pothole",{name:"Pothole Dash",word:"DODGE!",who:"boet",cap:"Tried to fix the pothole with a spade and positive thinking",dur:4,timeoutWin:true,how:"drag",hint:"Drag to steer round the potholes",
 dv:{title:"POTHOLED!",col:"#f2c230",sub:"positive thinking!",bg:function(){burstBg("#ffd56b","#ffc94a");band(H*DG-14,H*0.5,"#5d5866",7);pholeP(180,H*DG+10,2.8)},
  fg:function(t){var gy=H*DG,k=easeOutBack(t/0.35);ctx.save();ctx.beginPath();ctx.rect(0,0,W,gy+12);ctx.clip();drawChar("boet",180,gy+100-72*k,170,"dizzy",t,{ground:false});ctx.restore();spadeP(262,gy-24,1.3,0.45+0.06*Math.sin(sq12(t)*6));coneP(64,gy-4,1.3,-0.1);
   for(var i=0;i<3;i++){var a=sq12(t)*4+i*2.09;star(180+Math.cos(a)*44,gy-150+Math.sin(a)*10,10,a)}}}},function(sp){
 var g={cx:180,obs:[],sp0:0.35,road:0,tilt:0};
 g.update=function(dt){g.t+=dt;g.road=(g.road+dt*(300+120*sp))%80;var nx=clamp(g.cx+(ptr.x-g.cx)*Math.min(1,dt*14),60,300);g.tilt=clamp((nx-g.cx)/(dt*900+0.001),-0.35,0.35);g.cx=nx;g.sp0-=dt;
  if(g.sp0<=0){g.sp0=Math.max(0.36,0.66/sp);g.obs.push({x:RNG()<0.4?clamp(g.cx+rnd(-25,25),60,300):rnd(60,300),y:-40,k:pick(["hole","hole","cone","goat"])})}
  g.obs.forEach(function(o){o.y+=dt*(300+120*sp);if(!o.hit&&Math.abs(o.y-(H-150))<44&&Math.abs(o.x-g.cx)<40){g.fail=true;g.ix=o.x;g.iy=o.y;sfx("thud")}});g.obs=g.obs.filter(function(o){return o.y<H+60})};
 g.draw=function(){scene("pothole",function(){paper("#86b84a");ctx.fillStyle="rgba(60,110,40,.5)";for(var i=0;i<40;i++){var x=(i*53)%30,y=(i*97)%H;ctx.fillRect(i%2?x:W-30+x%26,y,3,8)}tornRect(28,-20,304,H+40,"#5d5866",4,0);for(var y=0;y<H;y+=28){ctx.fillStyle=(y/28)%2?"#e53935":"#fffaf0";ctx.fillRect(30,y,6,28);ctx.fillRect(324,y,6,28)}ctx.fillStyle="rgba(255,255,255,.06)";for(var k=0;k<60;k++)ctx.fillRect(40+(k*67)%280,(k*131)%H,3,3);sceneLabel("SLOW: POTHOLES",70,90,-1.57,"#fffaf0")});
  ctx.fillStyle="#fffaf0";for(var y=-80+g.road;y<H;y+=80)ctx.fillRect(177,y,6,40);
  g.obs.forEach(function(o){if(o.k==="hole")pholeP(o.x,o.y,1);else if(o.k==="cone")coneP(o.x,o.y,1);else goatP(o.x,o.y,0.8,o.x>180,Math.floor(g.t*6)%2)});
  bakkieTop(g.cx,H-150,1,g.tilt,"boet")};
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
