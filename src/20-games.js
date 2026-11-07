// Twelve microgames. Bots read this.pub only (the same positions and meters that are drawn).
function lanesY(i){return H*[0.90,0.76,0.61,0.46][i]}

def("salt",{name:"Over-Salted Pap",word:"LET GO",who:"tannie",bg:"kitchen",cap:"Let Gogo season the pap 'just a little'",dur:5.4,timeoutWin:false,how:"hold",hint:"Hold, then let go in the green",win:"JUST RIGHT",title:"SNOW!",sub:"that is not 'a little'",
paintDeath:function(t){backdrop("kitchen");stamp("pot",180,H*0.48,220);ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(180,H*0.4,78,16,0,0,7);ctx.fill();cameo("gogo",100,H*0.64,190,"panic",t);cameo("tannie",246,H*0.82,250,"panic",t,{delay:0.08})}},
function(sp){
 var fill=0,pouring=false,lo=0.4,hi=0.74,rate=0.28*tempo(sp),tilt=0.08,tan=actor(1),go=actor(2);
 return {pub:{fill:0,lo:lo,hi:hi,pouring:false,shaker:{x:200,y:280}},
  update:function(dt){this.t+=dt;tick(tan,dt);tick(go,dt);
   if(ptr.pressed&&!pouring&&fill<0.02){pouring=true;sfx("pop")}
   if(pouring){setPose(tan,"pinch");fill+=rate*dt;if(Math.random()<dt*16)burst(198,H*0.36,"#fffaf0",1);if(fill>0.93){this.fail=true;playOuch(tan)}}
   else if(!this.done)setPose(tan,"calm");
   if(ptr.released&&pouring){pouring=false;if(fill>=lo&&fill<=hi){this.done=true;playClip(tan,[{t:0,pose:"pinch",x:0,y:0,sx:1,sy:1,rot:0},{t:0.16,pose:"happy",x:0,y:-6,sx:1,sy:1,rot:0},{t:0.34,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}]);sfx("coin")}else{this.fail=true;playOuch(tan)}}
   tilt=lag(tilt,pouring?0.62:0.06,dt,9);
   this.pub={fill:fill,lo:lo,hi:hi,pouring:pouring,shaker:{x:198,y:H*0.34}}},
  draw:function(){backdrop("kitchen");stamp("pot",150,H*0.54,190);meter(16,H*0.26,34,H*0.4,fill,lo,hi);
   marker(fill<lo?"MORE":fill>hi?"EASY":"NOW",36,H*0.22,13,fill>=lo&&fill<=hi?"#146c2e":INK);
   drawActor("gogo",go,102,H*0.62,180);stamp("shaker",198,H*0.34,76,{rot:tilt});drawActor("tannie",tan,258,H*0.88,260)},
  bot:function(api){var p=this.pub;if(!p.pouring)api.hold(true,p.shaker.x,p.shaker.y);else if(p.fill>=p.lo+0.05)api.hold(false);else api.hold(true,p.shaker.x,p.shaker.y)}}});

def("quantum",{name:"Taxi Rank Crossing",word:"HOP",who:"gogo",bg:"rank",cap:"Stood in the taxi lane arguing about the fare",dur:8.4,timeoutWin:false,how:"swipe",hint:"Swipe up when the next lane glows",win:"CROSSED!",title:"FLAT!",sub:"but the fare, my child",
paintDeath:function(t){backdrop("rank");stamp("taxi-closed",180,H*0.32,220);cameo("gogo",180,H*0.62,200,"panic",t,{rot:1.25,sy:0.55})}},
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
   if(hop>0){hop-=dt;if(hop<=0){hop=0;if(lane>=3){this.done=true;playClip(act,CLIP.hop)}else if(threat(lane,gx,14)){this.fail=true;playOuch(act)}}}
   else{var up=false;for(var s=0;s<ptr.swipes.length;s++)if(ptr.swipes[s].dy<-32)up=true;
    if(up&&lane<3&&!threat(lane+1,gx,80)){from=lane;lane++;hop=0.22;sfx("swish");playClip(act,CLIP.hop)}
    else if(threat(lane,gx,14)){this.fail=true;playOuch(act);sfx("thud")}}
   var list=[];for(var k=0;k<taxis.length;k++)list.push({x:taxis[k].x,y:lanesY(taxis[k].lane),w:120,h:40,lane:taxis[k].lane});
   var gy=hop>0?lanesY(from)+(lanesY(lane)-lanesY(from))*clamp(1-hop/0.22,0,1):lanesY(lane);
   this.pub={lane:lane,gx:gx,gy:gy,hop:hop>0,nextClear:lane<3&&!threat(lane+1,gx,80),taxis:list}},
  draw:function(){backdrop("rank");
   var fleet=["taxi-closed","taxi-teal","taxi-orange"];
   if(this.pub.nextClear){var y=lanesY(lane+1);ctx.fillStyle="rgba(242,194,48,.33)";ctx.fillRect(0,y-H*0.045,W,H*0.09)}
   for(var k=0;k<taxis.length;k++){var t=taxis[k];stamp(fleet[t.lane%3],t.x,lanesY(t.lane)-10,150,{flip:dir>0})}
   drawActor("gogo",act,gx,this.pub.gy,168)},
  bot:function(api){var p=this.pub;if(!p.hop&&p.lane<3&&p.nextClear)api.swipe(p.gx,p.gy,0,-90)}}});

def("wors",{name:"Rescue the Wors",word:"SNATCH",who:"uncle",bg:"braai",cap:"Turned his back on the wors 'for one second'",dur:4.2,timeoutWin:false,how:"drag",hint:"Drag him onto the wors",win:"SAVED!",title:"GONE!",sub:"the dog says thanks",
paintDeath:function(t){backdrop("braai");stamp("dog",200,H*0.48,220);stamp("wors",250,H*0.4,90,{rot:-0.4});cameo("uncle",120,H*0.8,250,"panic",t)}},
function(sp){
 var wx=130+RNG()*100,wy=H*0.4,ux=180,uy=H*0.84,wind=Math.max(0.52,0.88/tempo(sp)),got=false,act=actor(1),vx=0;
 return {pub:{uncle:{x:ux,y:uy,w:80,h:100},wors:{x:wx,y:wy,w:80,h:70},dog:{x:wx+160,y:wy}},
  update:function(dt){this.t+=dt;tick(act,dt);if(got||this.fail)return;
   var px=ux,py=uy;if(ptr.down){ux=lag(ux,ptr.x,dt,11);uy=lag(uy,ptr.y,dt,11)}vx=lag(vx,(ux-px)/Math.max(dt,0.016),dt,6);
   var dogT=this.t-wind,dogX=wx+170-(dogT>0?dogT*240*tempo(sp):0);
   if(ptr.down&&!got)setPose(act,"reach");
   if(boxHit({x:ux,y:uy-40,w:70,h:80},{x:wx,y:wy,w:74,h:64})){got=true;this.done=true;playClip(act,CLIP.snatch);sfx("coin");hitStop(0.06)}
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
   if(latch>0.16&&!this.done){this.done=true;playClip(act,CLIP.slam);sfx("thud");hitStop(0.07)}
   else if(armed&&!this.done)setPose(act,"shove");
   this.pub={open:(hx-shutX)/(openX-shutX),hx:hx,hy:hy,shutX:shutX,armed:armed}},
  draw:function(){backdrop("highway");var hy=this.pub.hy,open=this.pub.open;
   if(this.done){stamp("taxi-closed",190,hy,300)}
   else{stamp("taxi",190,hy,300);stamp("taxi-panel",190-70+open*150,hy-6,118)}
   drawActor("gaatjie",act,78,H*0.9,210)},
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
   else if(bx<155)setPose(act,"leanl");else if(bx>205)setPose(act,"leanr");else setPose(act,"calm");
   this.pub={x:bx,y:H*0.8,obs:list}},
  draw:function(){backdrop("road");var scroll=(this.t*240)%50;
   for(var i=0;i<8;i++){var z=i/8,y=H*0.5+z*H*0.32;ctx.fillStyle="rgba(255,250,240,.8)";ctx.fillRect(180-z*8,y+(scroll*z)%40,10+z*16,4)}
   var ordered=this.pub.obs.slice().sort(function(a,b){return a.z-b.z});
   for(var k=0;k<ordered.length;k++){var p=ordered[k];stamp("hole",p.x,p.y,78*p.sc)}
   var lean=clamp((bx-180)/180, -0.18,0.18);
   stamp("bakkie",bx,H*0.72,130,{rot:lean});
   drawActor("boet",act,bx,H*0.97,210)},
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
   if(ptr.down&&gust)setPose(act,"cup");else if(alive)setPose(act,"calm");
   if(hit&&!ptr.down){alive=false;this.fail=true;playOuch(act);sfx("puff")}
   if(ptr.down&&!gust)smother+=dt*0.95;else smother=Math.max(0,smother-dt*0.55);
   if(smother>=1){alive=false;this.fail=true;playOuch(act);sfx("puff")}
   if(alive&&this.t>gusts[gusts.length-1]+travel+0.25){this.done=true;playClip(act,[{t:0,pose:"cup",x:0,y:0,sx:1,sy:1,rot:0},{t:0.22,pose:"happy",x:0,y:0,sx:1,sy:1,rot:0}])}
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
   if(ptr.down){var fang=Math.atan2(ptr.y-cy,ptr.x-cx);setPose(act,Math.sin(fang)>0?"fan":"fanb")}
   if(heat>=100){this.done=true;playClip(act,[{t:0,pose:act.pose,x:0,y:0,sx:1,sy:1,rot:0},{t:0.2,pose:"happy",x:0,y:-4,sx:1,sy:1,rot:0}]);sfx("sizzle");hitStop(0.05)}
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
   if(ptr.taps.length){if(inside){inside.hit=true;hits++;sfx("pop");playClip(act,CLIP.toot)}else if(on){misses++;sfx("tick")}}
   if(misses>=2){this.fail=true;playOuch(act)}
   else if(hits>=4||(hits>=3&&this.t>notes[3].t0+travel)){this.done=true;if(!act.clip)playClip(act,CLIP.toot)}
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
   if(ptr.down){x=lag(x,clamp(ptr.x,48,wire-16),dt,10);setPose(act,"pull")}else setPose(act,"calm");
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
   if(sit&&!grab){if(covered){this.done=true;setPose(act,"sit")}else{this.fail=true;playOuch(act);sfx("splat")}}
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
   if(ring.hot){for(var s=0;s<ptr.swipes.length;s++){var sw=ptr.swipes[s];if(segHits(sw.x,sw.y,sw.dx,sw.dy,ring.x,ring.y,ring.r+8)){hits++;n++;age=0;sfx("swish");burst(ring.x,ring.y,GOLD,8);hitStop(0.04);if(hits>=3){this.done=true;playClip(act,CLIP.swat)}else playClip(act,CLIP.swat);return}}}
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
     if(best===idx){round++;sfx("pop");playClip(act,CLIP.flip);if(round>=2){this.done=true}else pause=0.42}
     else {this.fail=true;playOuch(act);sfx("zap")}}}
   var sws=[];for(var i=0;i<4;i++)sws.push({x:180,y:ys(i),w:130,h:84,hot:pause<=0&&i===idx,danger:pause<=0&&i===idx?danger:0});
   this.pub={switches:sws}},
  draw:function(){backdrop("night");var sws=this.pub.switches;
   for(var i=0;i<sws.length;i++){var s=sws[i];if(s.hot){ctx.strokeStyle="rgba(242,194,48,"+(0.4+s.danger*0.6)+")";ctx.lineWidth=6;ctx.beginPath();ctx.arc(s.x,s.y,58,0,7);ctx.stroke();
    if(Math.sin(CLK*10)>0){ctx.fillStyle=GOLD;ctx.fillRect(s.x+30,s.y-20,6,10);ctx.fillRect(s.x-36,s.y+8,8,5)}}
    stamp("switch",s.x,s.y,92)}
   drawActor("auntie",act,64,H*0.9,230)},
  bot:function(api){var sws=this.pub.switches||[];for(var i=0;i<sws.length;i++)if(sws[i].hot&&sws[i].danger<0.85){api.swipe(sws[i].x,sws[i].y-16,0,74);return}}}});
