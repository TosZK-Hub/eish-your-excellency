// Twelve microgames. Collision rects are the same rects stored on pub.dbg.
function rankFit(){
 var im=ART.bg.rank; if(!im) return {x:0,y:0,w:W,h:H};
 var lane0=ground()-52, frac=0.925;
 var s=Math.max(W/im.width, lane0/(frac*im.height));
 var w=im.width*s, h=im.height*s;
 return {x:(W-w)/2, y:lane0-frac*h, w:w, h:h};
}
function lanesY(i){var f=rankFit();return f.y+[0.925,0.764,0.610,0.460][i]*f.h}
function laneBand(){return rankFit().h*0.115}
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
   var pot=propBox("pot",168,H*0.5,150,0), sh=propBox("shaker",200,H*0.3,64,8);
   this.pub={fill:fill,lo:lo,hi:hi,pouring:pouring,shaker:sh,pot:pot,dbg:[sh,pot]}},
  draw:function(){backdrop("kitchen");var p=this.pub;stamp("pot",p.pot.x,p.pot.y,150);meter(16,SAT+78,34,Math.min(H*0.36,220),p.fill,p.lo,p.hi);
   marker(p.fill<p.lo?"MORE":p.fill>p.hi?"EASY":"NOW",36,SAT+64,13,p.fill>=p.lo&&p.fill<=p.hi?"#146c2e":INK);
   drawActor("gogo",go,108,H*0.58,150);stamp("shaker",p.shaker.x,p.shaker.y,64,{rot:tilt});drawActor("tannie",tan,268,ground(),190)},
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
 var wx=150+RNG()*50,wy=H*0.4,ux=180,uy=ground(),wind=Math.max(0.9,1.2/tempo(sp)),got=false,act=actor(1);
 var hand=null;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);
   var wors=propBox("wors",wx,wy,96,10), dogW=150;
   if(!got&&!this.fail){
    if(ptr.down){ux=ptr.x;uy=Math.min(ground(),ptr.y+70);setPose(act,"reach")}
    hand={x:ptr.down?ptr.x:ux,y:ptr.down?ptr.y:uy-70,w:88,h:72};
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

def("door",{name:"Shut the Taxi Door",word:"SLAM",who:"gaatjie",bg:"highway",cap:"Left the sliding door open on the highway",dur:6.2,timeoutWin:false,how:"drag",hint:"Drag the door to the line",win:"SHUT!",title:"LEFT IT!",sub:"the highway kept the door",
paintDeath:function(t){backdrop("highway");stamp("taxi",190,H*0.42,240);cameo("gaatjie",80,ground(),180,"panic",t)}},
function(){
 var vx=188,vy=0,drag=false,grab=0,act=actor(2),shut=false;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);vy=H*0.4;
   var van=propBox("taxi",vx,vy,268,0);
   var openX=vx+van.w*0.28, shutX=vx-van.w*0.06, hy=vy-6;
   if(this.hx==null)this.hx=openX;
   var panel={x:this.hx,y:hy,w:78,h:van.h*0.72};
   if(!this.done){
    if(ptr.pressed&&boxHit({x:ptr.x,y:ptr.y,w:28,h:28},panel)){drag=true;grab=this.hx-ptr.x;sfx("tick")}
    if(!ptr.down)drag=false;
    if(drag){this.hx=clamp(ptr.x+grab,shutX,openX);setPose(act,"shove")}
    if(this.hx<=shutX+10){this.done=true;shut=true;playClip(act,CLIP.slam);sfx("thud")}
   }
   panel.x=this.hx;
   this.pub={open:(this.hx-shutX)/Math.max(1,openX-shutX),hx:this.hx,hy:hy,shutX:shutX,armed:drag,van:van,panel:panel,dbg:[panel,{x:shutX,y:hy,w:8,h:van.h*0.8}]}},
  draw:function(){backdrop("highway");var p=this.pub,hy=p.hy;
   if(shut)stamp("taxi-closed",p.van.x,p.van.y,268);
   else{stamp("taxi",p.van.x,p.van.y,268);ctx.strokeStyle="#e23b3b";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.shutX,hy-70);ctx.lineTo(p.shutX,hy+70);ctx.stroke();stamp("taxi-panel",p.panel.x,p.panel.y,86)}
   drawActor("gaatjie",act,72,ground(),170)},
  bot:function(api){var p=this.pub;if(!p.panel)return;if(!p.armed)api.hold(true,p.panel.x,p.panel.y);else api.hold(true,p.shutX-4,p.panel.y)}}});

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
   var car=this.pub.car;stamp("bakkie",car.x,car.y,118);
   drawActor("boet",act,car.x,ground(),120)},
  bot:function(api){var p=this.pub,threat=null;(p.obs||[]).forEach(function(o){if(o.z>0.28&&o.z<1.18&&(!threat||o.z>threat.z))threat=o});
   var target=p.x;if(threat)target=threat.x>=p.x?42:W-42;api.hold(true,target,p.y)}}});

def("candle",{name:"Load-shedding Candle",word:"CUP",who:"gogo",bg:"night",cap:"Let the last candle blow out in Stage 6",dur:6.8,timeoutWin:true,how:"hold",hint:"Hold only while the wind touches the flame",win:"STILL LIT",title:"DARK!",sub:"stage 6 wins again",
paintDeath:function(t){backdrop("night");cameo("gogo",180,ground(),200,"panic",t);marker("pff",180,H*0.36,28,INK)}},
function(sp){
 var gusts=[1.15,2.55,3.95,5.4],sp1=tempo(sp),smother=0,act=actor(4),alive=true,fx=180;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(!alive)return;
   var fy=H*0.4,flame=propBox("candle",fx,fy,46,4);
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
  draw:function(){backdrop("night");var f=this.pub.flame,fy=f.y;
   if(this.pub.gust){ctx.strokeStyle="rgba(255,250,240,.9)";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(this.pub.gx-70,fy);ctx.lineTo(this.pub.gx,fy);ctx.stroke()}
   stamp("candle",f.x,f.y,46);
   if(ptr.down&&this.pub.gust){ctx.strokeStyle=PAPER;ctx.lineWidth=5;ctx.beginPath();ctx.arc(f.x,fy,f.w*0.7,Math.PI*1.15,Math.PI*1.85);ctx.stroke()}
   meter(16,SAT+70,28,Math.min(160,H*0.24),this.pub.smother,0.99,1);marker("CUP",34,SAT+56,12,INK);
   drawActor("gogo",act,180,ground(),Math.min(200,H*0.32))},
  bot:function(api){var p=this.pub;if(p.gust)api.hold(true,180,400);else api.hold(false)}}});

def("braai",{name:"Fan the Braai",word:"FAN",who:"uncle",bg:"braai",cap:"Used petrol to 'help' the braai along",dur:7.2,timeoutWin:false,how:"circle",hint:"Circle the ring. Do not touch the can",win:"COALS!",title:"WHOOMP!",sub:"petrol is not a spice",
paintDeath:function(t){backdrop("braai");stamp("petrol",180,H*0.46,90);cameo("uncle",80,ground(),190,"panic",t)}},
function(sp){
 var heat=0,lx=null,ly=null,side=RNG()<0.5?1:-1,act=actor(2);
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.done||this.fail)return;
   var cx=180,cy=Math.min(H*0.46,ground()-210),ring=72;
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
   drawActor("uncle",act,p.side>0?58:W-58,ground(),170)},
  bot:function(api){var c=this.pub.coals,r=(this.pub.ring||72)-6;if(!c)return;this.ang=(this.ang||0)+0.28;api.hold(true,c.x+Math.cos(this.ang)*r,c.y+Math.sin(this.ang)*(r*0.72))}}});

def("vuvu",{name:"Vuvuzela Blast",word:"TOOT",who:"boet",bg:"stadium",cap:"Blew the vuvuzela right in the ref's ear",dur:6.6,timeoutWin:false,how:"tap",hint:"Tap when the note is inside the ring",win:"LOUD!",title:"TOO LOUD!",sub:"the ref heard that",
paintDeath:function(t){backdrop("stadium");stamp("vuvu",120,H*0.5,100);cameo("boet",220,ground(),180,"panic",t)}},
function(sp){
 var travel=1.45/tempo(sp),notes=[],hits=0,misses=0,act=actor(0);
 var zone={x:248,y:0,r:58};
 for(var i=0;i<4;i++)notes.push({t0:0.45+i*1.35,hit:false,counted:false});
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   zone.y=Math.min(H*0.34,ground()-240);
   var on=false,inside=null;
   for(var i=0;i<notes.length;i++){var n=notes[i],u=(this.t-n.t0)/travel;n.u=u;
    if(u>=0&&u<=1.05){n.x=-20+Math.min(u,1)*400;n.y=zone.y;on=true;if(!n.hit&&Math.abs(n.x-zone.x)<zone.r)inside=n;if(!n.hit&&!n.counted&&u>1){n.counted=true;misses++}}}
   if(ptr.taps.length){if(inside){inside.hit=true;inside.counted=true;hits++;sfx("pop");playClip(act,CLIP.toot)}else if(on){misses++}}
   if(misses>=2){this.fail=true;playOuch(act)}
   else if(hits>=4){this.done=true}
   var noteDbg=notes.filter(function(n){return n.u>=0&&n.u<=1}).map(function(n){return {x:n.x,y:n.y,w:28,h:28}});
   this.pub={notes:noteDbg,zone:{x:zone.x,y:zone.y,r:zone.r},dbg:[{x:zone.x,y:zone.y,w:zone.r*2,h:zone.r*2}].concat(noteDbg)}},
  draw:function(){backdrop("stadium");var z=this.pub.zone;ctx.strokeStyle=GOLD;ctx.lineWidth=6;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,7);ctx.stroke();
   var ns=this.pub.notes;for(var i=0;i<ns.length;i++){ctx.fillStyle=PAPER;ctx.beginPath();ctx.arc(ns[i].x,ns[i].y,14,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.stroke()}
   stamp("vuvu",78,z.y+30,90,{rot:-0.4});drawActor("boet",act,130,ground(),Math.min(180,H*0.28));marker(hits+"/4",W-36,SAT+40,18,PAPER)},
  bot:function(api){var p=this.pub;if(!p.notes||!p.zone)return;if(this._lt&&this.t-this._lt<0.45)return;for(var i=0;i<p.notes.length;i++){var n=p.notes[i];if(Math.abs(n.x-p.zone.x)<p.zone.r*0.45){this._lt=this.t;api.tap(p.zone.x,p.zone.y);return}}}}});

def("fence",{name:"Free Biltong",word:"PULL",who:"uncle",bg:"stoep",cap:"Touched the electric fence to grab free biltong",dur:5.4,timeoutWin:true,how:"drag",hint:"Hold him inside the green patch",win:"HELD!",title:"BZZT!",sub:"the biltong was a trap",
paintDeath:function(t){backdrop("stoep");stamp("biltong",250,H*0.36,90);cameo("uncle",140,ground(),200,"panic",t)}},
function(sp){
 var x=92,wire=292,act=actor(1),creep=28*tempo(sp),half=52;
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail)return;
   var wave=Math.sin(this.t*2.2),lung=wave>0.78;
   if(!ptr.down){x+=dt*(creep+(lung?90:0));creep+=dt*7*tempo(sp)}
   else{x=clamp(ptr.x,40,wire-half-6);setPose(act,"pull")}
   var body={x:x,y:ground()-80,w:half*2,h:150};
   var fence={x:wire,y:(H*0.22+ground())/2,w:16,h:ground()-H*0.22};
   if(body.x+body.w/2>=wire){this.fail=true;playOuch(act);sfx("zap")}
   var safe={x:86,y:ground()-70,w:150,h:160};
   this.pub={x:x,y:body.y,wire:wire,safe:safe.x,safeRect:safe,lunge:lung,body:body,dbg:[body,fence,safe]}},
  draw:function(){backdrop("stoep");var s=this.pub.safeRect,wire=this.pub.wire;if(!s)return;
   ctx.fillStyle="rgba(120,190,90,.4)";ctx.fillRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h);ctx.strokeStyle="#1b4d22";ctx.lineWidth=3;ctx.strokeRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h);marker("SAFE",s.x,s.y-s.h/2+16,14,"#1b4d22");
   ctx.strokeStyle="#e23b3b";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(wire,H*0.18);ctx.lineTo(wire,ground());ctx.stroke();
   stamp("biltong",wire-16,H*0.32,80);
   drawActor("uncle",act,this.pub.x,ground(),190)},
  bot:function(api){api.hold(true,this.pub.safe||90,this.pub.y||400)}}});

def("carseat",{name:"Hot Car Seat",word:"COVER",who:"boet",bg:"car",cap:"Sat on a vinyl car seat in January",dur:6.2,timeoutWin:false,how:"drag",hint:"Drag the paper onto the seat, then tap the seat",win:"AHH",title:"YOW!",sub:"January vinyl",
paintDeath:function(t){backdrop("car");cameo("boet",180,ground(),190,"panic",t)}},
function(){
 var paper=null,seat=null,grab=false,covered=false,act=actor(0);
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.done||this.fail)return;
   seat={x:168,y:Math.min(H*0.48,ground()-200),w:168,h:108};
   if(!paper)paper={x:W-78,y:ground()-70,w:0,h:0};
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
  draw:function(){backdrop("car");var s=this.pub.seat,p=this.pub.paper;
   ctx.strokeStyle=this.pub.covered?"#2e6b32":"#e23b3b";ctx.lineWidth=4;ctx.setLineDash([8,6]);ctx.strokeRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h);ctx.setLineDash([]);
   if(!this.pub.covered){ctx.fillStyle="rgba(255,180,60,.2)";ctx.fillRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h)}
   stamp("paper",p.x,p.y,104);
   drawActor("boet",act,this.pub.covered&&this.done?s.x:64,this.done?s.y+30:ground(),this.done?140:150)},
  bot:function(api){var p=this.pub;if(!p.paper)return;if(!p.covered){if(!p.held)api.hold(true,p.paper.x,p.paper.y);else api.hold(true,p.seat.x,p.seat.y)}else api.tap(p.seat.x,p.seat.y)}}});

def("mozzie",{name:"Swat the Mozzie",word:"SWIPE",who:"gogo",bg:"bed",cap:"Slept with the window open in December",dur:6.8,timeoutWin:false,how:"swipe",hint:"Swipe through the mozzie when the ring turns red",win:"GOT IT",title:"ITCH!",sub:"December always wins",
paintDeath:function(t){backdrop("bed");stamp("mozzie",180,H*0.36,70);cameo("gogo",180,ground(),190,"panic",t)}},
function(sp){
 var spots=[],n=0,age=0,hits=0,act=actor(5),hotFor=Math.max(0.85,1.05/tempo(sp));
 for(var i=0;i<3;i++)spots.push({x:90+RNG()*180,y:0});
 var ring={x:spots[0].x,y:0,r:64,hot:false};
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   var yTop=SAT+90,yBot=Math.min(H*0.46,ground()-200);
   if(!spots[0].y)for(var i=0;i<spots.length;i++)spots[i].y=yTop+RNG()*Math.max(20,yBot-yTop);
   age+=dt;var shrink=0.7,r=age<shrink?68-(age/shrink)*30:36;ring.x=spots[n].x;ring.y=spots[n].y;ring.r=r;ring.hot=age>=shrink;
   if(ring.hot){var gs=gesture(16);for(var s=0;s<gs.length;s++){var sw=gs[s];if(!fresh(this,sw))continue;if(segHits(sw.x,sw.y,sw.dx,sw.dy,ring.x,ring.y,ring.r+28)){claim(this,sw);hits++;n++;age=0;sfx("swish");if(hits>=3)this.done=true;break}}}
   if(age>shrink+hotFor){this.fail=true;playOuch(act);sfx("puff")}
   var bug=propBox("mozzie",ring.x,ring.y,52,0);
   this.pub={ring:{x:ring.x,y:ring.y,r:ring.r,hot:ring.hot},dbg:[bug,{x:ring.x,y:ring.y,w:(ring.r+10)*2,h:(ring.r+10)*2}]}},
  draw:function(){backdrop("bed");var ring=this.pub.ring;
   ctx.strokeStyle=ring.hot?"#e23b3b":PAPER;ctx.lineWidth=ring.hot?7:4;ctx.beginPath();ctx.arc(ring.x,ring.y,Math.max(12,ring.r),0,7);ctx.stroke();
   stamp("mozzie",ring.x,ring.y,52);drawActor("gogo",act,180,ground(),Math.min(190,H*0.3));marker(hits+"/3",W-30,SAT+40,18,PAPER)},
  bot:function(api){var r=this.pub.ring;if(r&&r.hot)api.swipe(r.x-r.r-10,r.y,r.r*2+24,6)}}});

def("lights",{name:"The Sparking Switch",word:"FLIP",who:"auntie",bg:"night",cap:"Flipped every switch in the house when the power came back",dur:6.6,timeoutWin:false,how:"swipe",hint:"Swipe down the switch that is sparking",win:"SAFE",title:"POP!",sub:"that was the wrong one",
paintDeath:function(t){backdrop("night");cameo("auntie",250,ground(),180,"panic",t)}},
function(sp){
 var idx=Math.floor(RNG()*4),round=0,pause=0,danger=0,act=actor(1),sp1=tempo(sp);
 return {pub:{},
  update:function(dt){this.t+=dt;tick(act,dt);if(this.fail||this.done)return;
   var top=SAT+78,bot=Math.min(H*0.58,ground()-170),gap=(bot-top)/3,swH=Math.min(78,gap-8);
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
  draw:function(){backdrop("night");var sws=this.pub.switches;
   for(var i=0;i<sws.length;i++){var s=sws[i];
    if(s.hot){ctx.strokeStyle="rgba(242,194,48,"+(0.45+s.danger*0.55)+")";ctx.lineWidth=6;ctx.strokeRect(s.x-s.w/2,s.y-s.h/2,s.w,s.h)}
    stamp("switch",s.x,s.y,Math.min(70,s.h*0.7))}
   drawActor("auntie",act,286,ground(),Math.min(170,H*0.26))},
  bot:function(api){var sws=this.pub.switches||[];for(var i=0;i<sws.length;i++)if(sws[i].hot&&sws[i].danger<0.8){api.swipe(sws[i].x,sws[i].y-20,0,sws[i].h);return}}}});
