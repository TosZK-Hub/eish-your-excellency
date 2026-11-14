var Ss={menu:"music_menu.mp3",gameplay:"music_gameplay.mp3",rushhour:"music_rushhour.mp3"},gs=.6,ep=.45,dc=.4,fc=.72,wt=null,cn=null,oi=null,kr=null,Es=!1,li=!0,hn=!1,ys="menu",pc="",vs=null,ln=0,_s={},xs={};function tp(e){return new URL(`../assets/audio/${Ss[e]}`,import.meta.url)}function un(e){return Ss[e]?(_s[e]||(_s[e]=fetch(tp(e)).then(t=>{if(!t.ok)throw new Error(`missing ${e}`);return t.arrayBuffer()})),_s[e]):Promise.reject(new Error("unknown track"))}function mc(){un("menu").then(()=>{setTimeout(()=>{un("gameplay"),un("rushhour")},700)}).catch(()=>{})}function bs(){let e=globalThis.AudioContext||globalThis.webkitAudioContext;return e?(wt||(wt=new e,cn=wt.createGain(),cn.gain.value=1,cn.connect(wt.destination),kr=wt.createGain(),kr.gain.value=1,oi=wt.createGain(),oi.gain.value=0,oi.connect(kr),kr.connect(wt.destination)),wt.state==="suspended"&&wt.resume(),wt):null}function Ts(e){Es=!!e}function ba(){return Es}function ws(e){if(li=!!e,!wt||!oi)return;let t=wt.currentTime;Ea(oi.gain,li?fc:8e-4,.25),li&&hn&&Ps()}function As(){return li}function Cs(e){ys=Ss[e]?e:"menu",hn&&li&&Ps()}function Rs(){bs()&&(hn=!0,li&&Ps())}function rp(e){return xs[e]?Promise.resolve(xs[e]):un(e).then(t=>{let r=bs();if(!r)throw new Error("no audio");return r.decodeAudioData(t.slice(0))}).then(t=>(xs[e]=t,t))}function ip(e,t){let r=wt,i=Math.min(ep,e.duration*.08),a=!0,n=[],s=[];function o(l,c){if(!a)return;let u=Math.max(l,r.currentTime+.01),h=r.createBufferSource();h.buffer=e;let d=r.createGain();h.connect(d),d.connect(t);let p=u+e.duration,v=c?i:.03;d.gain.setValueAtTime(8e-4,u),d.gain.exponentialRampToValueAtTime(1,u+v),d.gain.setValueAtTime(1,Math.max(u+v+.02,p-i)),d.gain.exponentialRampToValueAtTime(8e-4,p),h.start(u),h.stop(p+.03),s.push(h);let g=p-i,m=(g-r.currentTime)*1e3-180;n.push(setTimeout(()=>o(g,!0),Math.max(0,m)))}return o(r.currentTime+.02,!1),()=>{a=!1;for(let l of n)clearTimeout(l);for(let l of s)try{l.stop()}catch{}}}function Ea(e,t,r){let i=wt.currentTime,a=Math.max(8e-4,e.value||8e-4),n=Math.max(8e-4,t);e.cancelScheduledValues(i),e.setValueAtTime(a,i),e.exponentialRampToValueAtTime(n,i+Math.max(.02,r))}function ap(e,t){if(pc===e&&vs)return;let r=wt.createGain();r.gain.setValueAtTime(8e-4,wt.currentTime),r.connect(oi),Ea(r.gain,1,gs);let i=ip(t,r),a=vs;vs={scene:e,slot:r,stop:i},pc=e,Ea(oi.gain,fc,.08),a&&(Ea(a.slot.gain,8e-4,gs),setTimeout(()=>a.stop(),gs*1e3+60))}function Ps(){let e=ys;rp(e).then(t=>{!hn||!li||ys!==e||ap(e,t)}).catch(t=>console.error(t))}function Ta(e){if(!wt||!kr)return;let r=wt.currentTime+Math.max(.08,e);ln=Math.max(ln,r),Ea(kr.gain,dc,.04),kr.gain.setValueAtTime(Math.max(8e-4,dc),ln),kr.gain.exponentialRampToValueAtTime(1,ln+.3)}function Bt(e,t,r,i,a){if(Es)return;let n=bs();if(!n)return;Ta(t+.05);let s=n.currentTime,o=n.createOscillator(),l=n.createGain();o.type=r,o.frequency.setValueAtTime(e,s),a&&o.frequency.exponentialRampToValueAtTime(Math.max(40,a),s+t),l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(i,s+.012),l.gain.exponentialRampToValueAtTime(1e-4,s+t),o.connect(l),l.connect(cn),o.start(s),o.stop(s+t+.02)}function st(){Bt(640,.05,"sine",.05)}var Ms={hoot:[540,360],sharp:[760,520],low:[280,180],bell:[880,660]},gc="hoot";function vc(e){Ms[e]&&(gc=e)}function wa(){let e=Ms[gc]||Ms.hoot;Bt(e[0],.09,"square",.07,e[0]),Bt(e[1],.16,"square",.06)}function _c(e){let t=Math.min(4,Math.max(1,e||1));Bt(420+t*70,.12,"square",.07),Bt(560+t*80,.16,"square",.06)}function xc(){Bt(220,.26,"sawtooth",.045,80)}function yc(){Bt(880,.08,"sine",.07,1320)}function Aa(){Bt(660,.08,"triangle",.06),setTimeout(()=>Bt(880,.1,"triangle",.06),70)}function Mc(){Ta(.55),Bt(523,.12,"triangle",.06),setTimeout(()=>Bt(659,.12,"triangle",.06),90),setTimeout(()=>Bt(784,.18,"triangle",.07),180)}function Sc(){Ta(.5),Bt(330,.14,"triangle",.06,180),setTimeout(()=>Bt(196,.22,"triangle",.05),120)}var Ci={id:"taxi-rank",title:"Taxi Rank Rush",short:"Rank Rush",subtitle:"Pull the minibuses out. Match the queue.",vehicle:"taxi",vehiclePlural:"taxis",place:"rank",bay:"loading bay",vip:"Gaartjie",coin:"coin",dailyName:"Rush Hour",footnote:"A fictional rank. No real companies, no real routes."};var Ca=[{id:"red",name:"Red",hex:"#E23D3D",emoji:"\u{1F7E5}"},{id:"blue",name:"Blue",hex:"#2F6FED",emoji:"\u{1F7E6}"},{id:"yellow",name:"Yellow",hex:"#F2C14E",emoji:"\u{1F7E8}"},{id:"green",name:"Green",hex:"#3E9B4F",emoji:"\u{1F7E9}"},{id:"purple",name:"Purple",hex:"#7A4E9A",emoji:"\u{1F7EA}"},{id:"orange",name:"Orange",hex:"#F07A2A",emoji:"\u{1F7E7}"},{id:"teal",name:"Teal",hex:"#1F8A84",emoji:"\u{1FA75}"},{id:"pink",name:"Pink",hex:"#E56AA8",emoji:"\u{1FA77}"}];var Ls=[{id:"plain",name:"Rank plain",price:0,blurb:"White combi, one stripe."},{id:"stripes",name:"Extra stripes",price:20,blurb:"Another band on the side."},{id:"chequers",name:"Chequers",price:50,blurb:"A checked belt."},{id:"stars",name:"Stars",price:90,blurb:"Little stars on the panel."},{id:"zigzag",name:"Zigzag",price:140,blurb:"A lightning stripe."},{id:"flowers",name:"Flowers",price:180,blurb:"Blooms along the roof."},{id:"flames",name:"Flames",price:220,blurb:"Hot rods for the rank."}],Oe={play:"Play",levels:"Levels",daily:"Rush Hour",shop:"Liveries",back:"Back",next:"Next",retry:"Try again",map:"Level map",share:"Share",copied:"Copied",watch:"Watch",notNow:"Not now",equip:"Equip",equipped:"Equipped",buy:"Buy",locked:"Locked",hoot:"Hoot!",brake:"Brake off",win:"Rank cleared!",winDaily:"Rush Hour cleared!",loseFull:"The bays are full",loseJam:"The rank is jammed",loseHint:"No stress. Line them up another way.",adTitle:"Watch a short ad?",adBody:"A short thanks. Then the booster is yours.",adWatching:"Watching\u2026",extraBay:"Extra bay",undo:"Undo",shuffle:"Shuffle",queue:"Queue",moves:"Moves",par:"Par",coins:"Coins",youHave:"You have",streak:"Streak",dailyLead:"One puzzle for everyone, seeded by today's date.",dailyDone:"You already cleared today. Share the grid, or play it again for fun.",spareIntro:"A spare combi has no queue. Park one and it sits in the bay.",gaartjieIntro:"The gaartjie jumps the queue onto the first taxi of their colour.",hiddenIntro:"A tarp hides the colour until a neighbour leaves, or you tap it.",lockIntro:"Hand brake on. Tap once to release, again to drive.",how1:"Tap a taxi. If the lane to the edge is clear, it pulls into a bay.",how2:"Passengers board a matching colour. Full taxis leave. Wrong lane? It hoots."};var Lx={1:Oe.how1,2:Oe.how2,4:Oe.hiddenIntro,8:Oe.lockIntro,12:Oe.gaartjieIntro,18:Oe.spareIntro};var Ec=["#0072B2","#E69F00","#F0E442","#009E73","#56B4E9","#D55E00","#111111","#CC79A7"];function bc(e,t){let r=t?Ec[e]||Ec[0]:(Ca[e]||Ca[0]).hex;return Number.parseInt(r.slice(1),16)}var Ds=[{id:"durban",name:"Durban",sky:"#B7DEF2",ground:"#4E5968",grass:"#7DBE6A"},{id:"joburg",name:"Joburg",sky:"#F0D7A0",ground:"#5A5348",grass:"#C2A15A"},{id:"cape",name:"Cape Town",sky:"#8EC6E6",ground:"#3D4A55",grass:"#3E9B6A"},{id:"gqeberha",name:"Gqeberha",sky:"#C5DFF0",ground:"#4A5560",grass:"#6AAA78"},{id:"bloem",name:"Bloemfontein",sky:"#F6E2B8",ground:"#6A5A48",grass:"#D2B56A"}],Tc=[{id:"dirt",name:"Dirt lot",cost:0},{id:"shelter",name:"Shelter",cost:40},{id:"stall",name:"Food stall",cost:90},{id:"mural",name:"Mural wall",cost:150},{id:"sound",name:"Sound system",cost:230},{id:"solar",name:"Solar lights",cost:330},{id:"roof",name:"Roof",cost:460}];var Us=["Sharp!","Yebo!","Hau!","Lekker!"];var Br=[{x:0,y:-1,name:"up"},{x:1,y:0,name:"right"},{x:0,y:1,name:"down"},{x:-1,y:0,name:"left"}],Hr=150,fr={hiace:{len:2,seats:6,name:"Hiace"},quantum:{len:3,seats:9,name:"Quantum"},sprinter:{len:4,seats:12,name:"Sprinter"}},wc={1:"basics",4:"size",8:"luggage",12:"twotone",16:"tarp",20:"lock",24:"gaartjie",28:"robot",32:"cone",36:"officer",40:"queues",44:"tow",48:"rain"},sp={basics:"Tap a combi. If the lane ahead is clear, it drives into a bay.",size:"A Hiace is short, a Quantum is the usual combi, a Sprinter is the long one.",luggage:"A bag or bucket needs two free seats.",twotone:"A split roof takes either colour.",tarp:"A tarp hides the colour until you tap it, or a neighbour leaves.",lock:"The padlock number is how many other combis must leave first.",gaartjie:"The gaartjie fills that combi the moment they step in.",robot:"A green robot lets them out. Red means wait. It flips every two taps.",cone:"Cones and potholes are solid. Drive around them.",officer:"The officer steps one cell every three taps.",queues:"Two queues. Tap a head to send that passenger first.",tow:"Chained combis leave together. Both lanes must be clear.",rain:"Wet road, same rules. Take it slow in your head, not in the taps."};function vn(e){let t=e>>>0;return function(){t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}function Os(e){let t=2166136261;for(let r=0;r<e.length;r+=1)t^=e.charCodeAt(r),t=Math.imul(t,16777619);return t>>>0}function Fs(e,t){let r=e.slice();for(let i=r.length-1;i>0;i-=1){let a=t()*(i+1)|0,n=r[i];r[i]=r[a],r[a]=n}return r}function Vr(e=new Date){let t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${t}-${r}-${i}`}function zs(e){let t=(e-1)%10+1;return t===10?"super":t===5?"hard":t===3||t===4||t===8||t===9?"medium":"easy"}function op(e){return e>=121?"bloem":e>=91?"gqeberha":e>=61?"cape":e>=31?"joburg":"durban"}function Pa(e){let t=Br[e.dir],r=[];for(let i=0;i<e.len;i+=1)r.push({c:e.c-t.x*i,r:e.r-t.y*i});return r}function Li(e,t,r){return t>=0&&r>=0&&t<e.cols&&r<e.rows}function mr(e){let t=new Int16Array(e.cols*e.rows);t.fill(-1);for(let r of e.taxis)for(let i of Pa(r))Li(e,i.c,i.r)&&(t[i.r*e.cols+i.c]=r.id);return e.grid=t,e.cones=e.cones||[],e.robots=e.robots||[],e.queues=e.queues||[[]],e}function ks(e){return{exited:new Uint8Array(e.taxis.length),bayTaxi:new Int16Array(e.bays).fill(-1),bayFilled:new Uint8Array(e.bays),boarded:e.queues.map(t=>new Uint8Array(t.length)),queues:e.queues.map(t=>t.map(r=>({...r}))),moves:0,departed:0,combo:0,squeezeUsed:0,revealed:Uint8Array.from(e.taxis.map(t=>t.hidden?0:1))}}function Ri(e){return{exited:e.exited.slice(),bayTaxi:e.bayTaxi.slice(),bayFilled:e.bayFilled.slice(),boarded:e.boarded.map(t=>t.slice()),queues:e.queues.map(t=>t.map(r=>({...r}))),moves:e.moves,departed:e.departed,combo:e.combo,squeezeUsed:e.squeezeUsed,revealed:e.revealed.slice()}}function lp(e,t){if(!e.officer||!e.officer.path.length)return null;let r=Math.floor(t.moves/3)%e.officer.path.length;return e.officer.path[r]}function cp(e,t,r,i){if(!Li(e,r,i))return null;for(let s of e.cones)if(s.c===r&&s.r===i)return-2;let a=lp(e,t);if(a&&a.c===r&&a.r===i)return-3;let n=e.grid[i*e.cols+r];return n>=0&&!t.exited[n]?n:null}function La(e,t,r){return Ra(e,t,r)===null}function Ra(e,t,r){let i=e.taxis[r],a=Br[i.dir],n=i.c+a.x,s=i.r+a.y;for(;Li(e,n,s);){let o=cp(e,t,n,s);if(o!==null&&o!==r)return o;n+=a.x,s+=a.y}return null}function up(e){return Math.floor(e.moves/2)%2===0}function dn(e,t,r){let i=r.dir%2===0?r.c:r.r;for(let a of e.robots)if(a.dir===r.dir&&a.lane===i&&!up(t))return!1;return!0}function pn(e,t){return(e.lockAfter||0)>t.departed}function Bs(e){let t=0;for(let r=0;r<e.bayTaxi.length;r+=1)e.bayTaxi[r]<0&&(t+=1);return t}function hp(e){for(let t=0;t<e.bayTaxi.length;t+=1)if(e.bayTaxi[t]<0)return t;return-1}function dp(e,t){return e.colors.includes(t)}function Da(e,t,r){for(let i=0;i<e.bayTaxi.length;i+=1){let a=e.bayTaxi[i];if(a<0)continue;let n=t.taxis[a];if(!dp(n,r.color))continue;let s=n.seats-e.bayFilled[i];if(r.vip||s>=(r.seats||1))return i}return-1}function pp(e,t,r){let i=e.bayTaxi[t];e.combo=Math.min(5,(e.combo||0)+1),r.push({t:"depart",bay:t,taxiId:i,combo:e.combo}),e.bayTaxi[t]=-1,e.bayFilled[t]=0,e.departed+=1}function Rc(e,t,r,i,a){let n=e.queues[r][i],s=Da(e,t,n);if(s<0)return!1;e.boarded[r][i]=1;let o=e.bayTaxi[s],l=t.taxis[o];return n.vip?e.bayFilled[s]=l.seats:e.bayFilled[s]+=n.seats||1,a.push({t:"board",bay:s,taxiId:o,queue:r,pIndex:i,filled:e.bayFilled[s],seats:l.seats,vip:!!n.vip,luggage:!!n.luggage}),e.bayFilled[s]>=l.seats&&pp(e,s,a),!0}function Pi(e,t){let r=e.boarded[t];for(let i=0;i<r.length;i+=1)if(!r[i])return i;return-1}function fn(e,t,r){if(e.queues.length!==1)return;let i=e.queues[0].length+2;for(let a=0;a<i;a+=1){let n=Pi(e,0);if(n<0||!Rc(e,t,0,n,r))return}}function fp(e,t,r){let i=Pa(t.taxis[r]);for(let a of t.taxis){if(!a.hidden||e.revealed[a.id])continue;let n=Pa(a),s=!1;for(let o of i)for(let l of n)Math.abs(o.c-l.c)+Math.abs(o.r-l.r)===1&&(s=!0);s&&(e.revealed[a.id]=1)}}function Ns(e,t,r,i){e.combo=0;let a=hp(e);return e.exited[r]=1,e.revealed[r]=1,e.bayTaxi[a]=r,e.bayFilled[a]=0,i.push({t:"exit",id:r,bay:a}),fp(e,t,r),a}function mn(e,t,r){if(t.exited[r])return!1;let i=e.taxis[r];return i.tow>=0||pn(i,t)||!La(e,t,r)||!dn(e,t,i)?!1:Bs(t)>=1}function Ua(e,t,r){let i=e.taxis[r];if(i.tow<0)return!1;let a=i.tow,n=Math.min(r,a);return r!==n||t.exited[r]||t.exited[a]||pn(i,t)||pn(e.taxis[a],t)||!La(e,t,r)||!La(e,t,a)||!dn(e,t,i)||!dn(e,t,e.taxis[a])?!1:Bs(t)>=2}function Pc(e,t,r){if(r<0||r>=t.taxis.length||e.exited[r])return{t:"none"};let i=t.taxis[r];if(i.hidden&&!e.revealed[r]&&!La(t,e,r))return{t:"bump",id:r,blocker:Ra(t,e,r),reveal:!0};if(pn(i,e))return{t:"locked",id:r};if(i.tow>=0){let a=Math.min(r,i.tow);return Ua(t,e,a)?{t:"tow",id:a}:{t:"bump",id:r,blocker:Ra(t,e,r)??Ra(t,e,i.tow)}}return La(t,e,r)?dn(t,e,i)?Bs(e)<1?{t:"nobay",id:r}:{t:"exit",id:r}:{t:"red",id:r,reveal:i.hidden&&!e.revealed[r]}:{t:"bump",id:r,blocker:Ra(t,e,r),reveal:i.hidden&&!e.revealed[r]}}function Lc(e,t,r){if(!e.queues[r])return{t:"none"};let i=Pi(e,r);if(i<0)return{t:"none"};let a=e.queues[r][i];return Da(e,t,a)<0?{t:"wait",queue:r}:{t:"send",queue:r}}function gn(e,t,r){if(!r)return null;if(r.t==="reveal"){if(!t.taxis[r.id]||e.revealed[r.id])return null;let i=Ri(e);return i.revealed[r.id]=1,{state:i,events:[{t:"reveal",id:r.id}]}}if(r.t==="send"){if(e.queues.length<2)return null;let i=Pi(e,r.queue);if(i<0)return null;let a=Ri(e),n=[];return Rc(a,t,r.queue,i,n)?(a.moves+=1,{state:a,events:n}):null}if(r.t==="exit"){if(!mn(t,e,r.id))return null;let i=Ri(e),a=[];return Ns(i,t,r.id,a),i.moves+=1,i.queues.length===1&&fn(i,t,a),{state:i,events:a}}if(r.t==="tow"){if(!Ua(t,e,r.id))return null;let i=Ri(e),a=[],n=t.taxis[r.id].tow;return Ns(i,t,r.id,a),Ns(i,t,n,a),i.moves+=1,i.queues.length===1&&fn(i,t,a),{state:i,events:a}}return null}function Ia(e){let t=!1;for(let r of e.boarded)if(r.length){t=!0;for(let i=0;i<r.length;i+=1)if(!r[i])return!1}return t}function Ac(e,t){if(e.queues.length===1){let r=Pi(e,0);return r<0?!1:Da(e,t,e.queues[0][r])>=0}for(let r=0;r<e.queues.length;r+=1){let i=Pi(e,r);if(!(i<0)&&Da(e,t,e.queues[r][i])>=0)return!0}return!1}function mp(e,t){for(let r=0;r<t.taxis.length;r+=1)if(mn(t,e,r)||Ua(t,e,r))return!0;return!!(e.queues.length>1&&Ac(e,t)||e.queues.length===1&&Ac(e,t))}function ci(e,t){return Ia(e)?!1:!mp(e,t)}function Oa(e){for(let t=0;t<e.bayTaxi.length;t+=1)if(e.bayTaxi[t]<0)return"jam";return"full"}function Dc(e,t){if(t.guide){for(let r of t.guide)if(r.t==="exit"&&mn(t,e,r.id)||r.t==="tow"&&Ua(t,e,r.id))return r.id}for(let r=0;r<t.taxis.length;r+=1)if(mn(t,e,r)||Ua(t,e,r))return r;return-1}function _n(e,t){let r=Ri(e),i=new Int16Array(e.bayTaxi.length+1);i.set(e.bayTaxi),i[i.length-1]=-1;let a=new Uint8Array(e.bayFilled.length+1);a.set(e.bayFilled),r.bayTaxi=i,r.bayFilled=a,r.squeezeUsed=1;let n=[{t:"bay"}];return r.queues.length===1&&fn(r,t,n),{state:r,events:n}}function Uc(e,t,r){let i=Ri(e);for(let n=0;n<i.queues.length;n+=1){let s=[];for(let c=0;c<i.boarded[n].length;c+=1)i.boarded[n][c]||s.push(i.queues[n][c]);let o=Fs(s,r),l=0;for(let c=0;c<i.boarded[n].length;c+=1)i.boarded[n][c]||(i.queues[n][c]=o[l],l+=1)}i.moves+=1;let a=[{t:"shuffle"}];return i.queues.length===1&&fn(i,t,a),{state:i,events:a}}function Nc(e,t,r){let i=r.par||e;if(r.daily){let a=r.parTime||90;return e<=i&&t<=a?3:e<=i+3&&t<=a*2?2:1}return e<=i?3:e<=i+3?2:1}function Hs(e,t,r){let i=[];i.push(t.daily?"Taxi Rank Rush \xB7 Rush Hour":`Taxi Rank Rush \xB7 ${e.name||"Level"}`),r&&i.push(r);let a=t.stars||0;i.push(`${"\u2605".repeat(a)}${"\u2606".repeat(Math.max(0,3-a))}  ${t.moves} taps`);let n=[];for(let s=0;s<e.rows;s+=1)n.push(Array.from({length:e.cols},()=>"\u2B1B"));for(let s of e.taxis){let o=s.hidden?"\u2753":Ca[s.colors[0]]?Ca[s.colors[0]].emoji:"\u{1F690}",l=["\u2B06\uFE0F","\u27A1\uFE0F","\u2B07\uFE0F","\u2B05\uFE0F"][s.dir]||"";Li(e,s.c,s.r)&&(n[s.r][s.c]=o+l)}for(let s of n)i.push(s.join(""));return i.push("Sort the rank."),i.join(`
`)}function gp(e){return{cols:e.cols,rows:e.rows,bays:e.bays,taxis:[],queues:e.queues>1?[[],[]]:[[]],cones:[],robots:[],officer:null,rain:!!e.rain}}function Ic(e,t){let r=Br[t.dir],i=[],a=t.c+r.x,n=t.r+r.y;for(;Li(e,a,n);)i.push({c:a,r:n}),a+=r.x,n+=r.y;return i}function Is(e,t){return`${e},${t}`}function vp(e){let t=new Set;for(let r of e.taxis){for(let i of Pa(r))t.add(Is(i.c,i.r));for(let i of Ic(e,r))t.add(Is(i.c,i.r))}return t}function _p(e,t){for(let r of Pa(t))if(!Li(e,r.c,r.r)||(e.grid?e.grid[r.r*e.cols+r.c]:-1)>=0)return!1;for(let r of Ic(e,t)){let i=e.grid[r.r*e.cols+r.c];if(t.needsClear&&i>=0||i>=0&&i>t.id)return!1;if(i<0){for(let a of e.cones)if(a.c===r.c&&a.r===r.r)return!1}}return!0}function xp(e,t,r){let i=[];for(let n=0;n<e.rows;n+=1)for(let s=0;s<e.cols;s+=1)t.c=s,t.r=n,_p(e,t)&&i.push({c:s,r:n});if(!i.length)return!1;let a=i[r()*i.length|0];return t.c=a.c,t.r=a.r,mr(e),!0}function yp(e,t,r,i){if(r.gaartjie&&t.gaartjie){e.push({color:t.colors[0],seats:1,vip:!0,luggage:!1});return}let a=t.seats,n=t.colors,s=0;for(;a>0;){let o=n[s%n.length];s+=1,r.luggage&&a>=2&&i()<.45?(e.push({color:o,seats:2,vip:!1,luggage:!0}),a-=2):(e.push({color:o,seats:1,vip:!1,luggage:!1}),a-=1)}}function Mp(e,t,r){let i=e.taxis.map(()=>[]);for(let a of e.taxis)yp(i[a.id],a,t,r);if(t.queues>1){let a=[],n=[];i.forEach((s,o)=>{(o%2===0?a:n).push(...s)}),e.queues=[a,n.length?n:[{color:e.taxis[0].colors[0],seats:1,vip:!1,luggage:!1}]],n.length||(e.queues=[a])}else e.queues=[i.flat()]}function Sp(e,t,r){mr(e);let i=vp(e),a=[];for(let n=0;n<e.rows;n+=1)for(let s=0;s<e.cols;s+=1)i.has(Is(s,n))||a.push({c:s,r:n});if(t.cone){let n=Math.min(2,a.length);for(let s=0;s<n;s+=1){let o=r()*a.length|0;e.cones.push(a.splice(o,1)[0])}}if(t.officer&&a.length>=3){let n=a.slice(0,3);e.officer={path:n}}}function Ep(e){mr(e);let t=ks(e),r=[],i=()=>{if(t.queues.length<2)return!0;for(let a=0;a<40;a+=1){let n=!1;for(let s=0;s<t.queues.length;s+=1){let o=Pi(t,s);if(o<0||Da(t,e,t.queues[s][o])<0)continue;let l=gn(t,e,{t:"send",queue:s});if(!l)return!1;r.push({t:"send",queue:s}),t=l.state,n=!0;break}if(!n)return!0}return!0};for(let a of e.taxis){if(!i())return null;if(a.tow>=0&&a.tow<a.id)continue;let n=a.tow>=0?{t:"tow",id:Math.min(a.id,a.tow)}:{t:"exit",id:a.id},s=gn(t,e,n);if(!s||(r.push(n),t=s.state,ci(t,e)))return null}return!i()||!Ia(t)?null:r}function Vs(e,t){let r=t?"easy":zs(e),i=wc[e]||null,a=new Set;i&&i!=="basics"&&a.add(i);let n=vn(e*97+(t||0)*13),s=Object.entries(wc).filter(([h,d])=>Number(h)<e&&d!=="basics"&&d!=="rain").map(([,h])=>h),o=t?0:r==="super"||r==="hard"?2:r==="medium"?1:0,l=Fs(s,n);for(let h=0;h<l.length&&a.size<o;h+=1)a.add(l[h]);(i==="rain"||e>=48&&e%9===0)&&!t&&a.add("rain");let c=a.has("size")||e>=4,u=r==="easy"?3:r==="medium"?4:5;return t&&(u=Math.max(2,u-1)),i==="basics"&&(u=2),(i==="gaartjie"||i==="luggage"||i==="twotone")&&(u=1),i==="tow"&&(u=4),i==="robot"&&(u=4),{cols:r==="easy"?5:6,rows:r==="super"?6:5,bays:t?6:5,count:u,colours:Math.max(2,(r==="super"?4:r==="hard"?3:2)-(t?1:0)),sizes:c,mechs:a,rain:a.has("rain"),queues:a.has("queues")?2:1,intro:i}}function bp(e,t,r){if(!e.sizes)return fr.quantum;if(e.intro==="size")return[fr.hiace,fr.quantum,fr.sprinter][t]||fr.quantum;if(e.queues>1)return r()<.5?fr.hiace:fr.quantum;let i=r();return i<.34?fr.hiace:i<.75?fr.quantum:fr.sprinter}function Gs(e,t,r){let i=gp(t);i.grid=new Int16Array(i.cols*i.rows).fill(-1);for(let n=0;n<t.count;n+=1){let s=bp(t,n,r),o=[n%t.colours];t.mechs.has("twotone")&&n===0&&o.push((n+1)%t.colours);let l={id:n,c:0,r:0,dir:[0,1,2,3][r()*4|0],len:s.len,seats:s.seats,colors:o,hidden:t.mechs.has("tarp")&&n===t.count-1,lockAfter:t.mechs.has("lock")&&n>=2?1:0,tow:-1,needsClear:t.mechs.has("tow")&&n<2,gaartjie:t.mechs.has("gaartjie")&&n===0},c=!1,u=Fs([0,1,2,3],r);for(let h of u)if(l.dir=h,xp(i,l,r)){c=!0;break}if(!c)return null;if(i.taxis.push(l),mr(i),t.mechs.has("robot")&&Math.floor(n/2)%2===0){let h=l.dir%2===0?l.c:l.r;i.robots.some(d=>d.dir===l.dir&&d.lane===h)||i.robots.push({dir:l.dir,lane:h})}}if(t.mechs.has("tow")&&i.taxis.length>=2&&(i.taxis[0].tow=1,i.taxis[1].tow=0),t.mechs.has("robot")&&!i.robots.length||(Sp(i,{cone:t.mechs.has("cone"),officer:t.mechs.has("officer")},r),t.mechs.has("cone")&&!i.cones.length)||t.mechs.has("officer")&&!i.officer)return null;Mp(i,t,r),mr(i);let a=Ep(i);return a?(i.guide=a,i.par=a.length,i.id=e,i.difficulty=(t.intro&&e,void 0),i):null}var Cc=["First in line","After you","Side step","Long nose","Busy bay","Colour mix","Morning rank","Short hold","Last light","Tight bay","Deep row","Quiet corner","Second wave","Full load","Home stretch","Early bird","Queue hop","Big yard","Nearly home","Final hoot"];function Na(e,t,r){e.id=t,e.difficulty=r.intro==="basics"?"easy":r.difficulty||zs(t),e.reward=e.difficulty==="hard"||e.difficulty==="super"?2:1,e.region=op(t),e.rain=!!r.rain;let i={size:"Three sizes",luggage:"Bags and buckets",twotone:"Split roof",tarp:"Under the tarp",lock:"Padlock",gaartjie:"Gaartjie",robot:"Robot",cone:"Cones",officer:"Officer",queues:"Two queues",tow:"Tow chain",rain:"Wet road"};return e.name=i[r.intro]||Cc[(t-1)%Cc.length],e.tutorial=r.intro?{mech:r.intro,text:sp[r.intro],focus:0}:null,e.parTime=70,e}function Ws(e){return Na({id:e,cols:4,rows:4,bays:5,cones:[],robots:[],officer:null,rain:!1,queues:[[{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1}]],taxis:[{id:0,c:1,r:2,dir:2,len:3,seats:6,colors:[0],hidden:!1,lockAfter:0,tow:-1,gaartjie:!1}],guide:[{t:"exit",id:0}],par:1},e,{rain:!1,intro:null,difficulty:"easy"})}function Xs(e,t={}){let r=t.easier||0,i=Vs(e,r);i.difficulty=r?"easy":zs(e);let a=vn(e*2654435769+r*2246822507>>>0);for(let n=0;n<80;n+=1){let s=Gs(e,i,a);if(s)return Na(s,e,i),s}return Na(Ws(e),e,i)}function js(e=new Date){let t=Vr(e),r=Os(`taxi-rank-rush:${t}`),i=Vs(20+r%15,0);i.queues=1,i.mechs=new Set(["tarp"]),i.rain=!1,i.intro=null,i.count=3,i.colours=2;let a=vn(r),n=null;for(let s=0;s<40&&!n;s+=1)n=Gs(0,i,a);return n||(n=Ws(0)),Na(n,0,i),n.daily=t,n.name="Rush Hour",n.parTime=80,n.tutorial=null,n.reward=1,n}function Oc(e,t){let r=Vs(30,0);r.count=3,r.queues=1,r.intro=null,r.mechs=new Set(e%2===0?["size"]:["luggage"]),r.rain=!1;let i=vn(t+e*131>>>0),a=null;for(let n=0;n<30&&!a;n+=1)a=Gs(e+1,r,i);return a||(a=Ws(e+1)),Na(a,e+1,r),a.name=`Month-end ${e+1}`,a.tutorial=null,a}var Ys="trr_save_v1";function qs(){return{unlocked:1,stars:{},coins:0,livery:"plain",owned:["plain"],sound:!0,music:!0,colorblind:!1,rank:0,horn:"hoot",tokens:{bay:1,undo:3,shuffle:1},fails:{},seen:[],missionsDate:"",missionProgress:[0,0,0],missionClaimed:[!1,!1,!1],eventWeek:"",eventStep:0,eventDone:!1,arrows:!1,dailyDate:"",dailyStreak:0,dailyStars:0}}function Ie(){try{let e=localStorage.getItem(Ys);if(!e)return qs();let t={...qs(),...JSON.parse(e)};return(!Array.isArray(t.owned)||!t.owned.includes("plain"))&&(t.owned=["plain",...(t.owned||[]).filter(r=>r!=="plain")]),(!t.stars||typeof t.stars!="object")&&(t.stars={}),(!t.tokens||typeof t.tokens!="object")&&(t.tokens={bay:1,undo:3,shuffle:1}),t.tokens={bay:1,undo:3,shuffle:1,...t.tokens},(!t.fails||typeof t.fails!="object")&&(t.fails={}),Array.isArray(t.seen)||(t.seen=[]),Array.isArray(t.missionProgress)||(t.missionProgress=[0,0,0]),Array.isArray(t.missionClaimed)||(t.missionClaimed=[!1,!1,!1]),t.rank=t.rank|0,t}catch{return qs()}}function Ht(e){try{localStorage.setItem(Ys,JSON.stringify(e))}catch{}}function zc(){try{localStorage.removeItem(Ys)}catch{}}function Zs(e,t){return e.stars[String(t)]||0}function kc(e,t){let r=Ie(),i=Zs(r,e),a=0;return i?t>i?a=(t-i)*6:a=2:a=8+t*6,r.coins+=a,r.stars[String(e)]=Math.max(i,t),e>=r.unlocked&&e<150&&(r.unlocked=e+1),Ht(r),{gain:a,save:r}}function Fc(e){let[t,r,i]=e.split("-").map(Number);return new Date(t,r-1,i)}function Bc(e,t){let r=Ie(),i=r.dailyDate!==e,a=0;if(i){if(r.dailyDate){let n=Fc(r.dailyDate),s=Fc(e),o=Math.round((s-n)/864e5);r.dailyStreak=o===1?(r.dailyStreak||0)+1:1}else r.dailyStreak=1;a=12+t*4,r.coins+=a,r.dailyDate=e,r.dailyStars=t}else t>(r.dailyStars||0)&&(r.dailyStars=t);return Ht(r),{gain:a,save:r,first:i}}function Hc(e,t){let r=Ie();return r.owned.includes(e)?{ok:!0,save:r,already:!0}:r.coins<t?{ok:!1,reason:"coins",save:r}:(r.coins-=t,r.owned.push(e),r.livery=e,Ht(r),{ok:!0,save:r})}function Vc(e){let t=Ie();return t.owned.includes(e)&&(t.livery=e,Ht(t)),t}function Gc(e){let t=Ie();return t.sound=!!e,Ht(t),t}function xn(e){let t=Ie();return t.coins=Math.max(0,t.coins+e),Ht(t),t}function Js(e){let t=Ie();return t.coins=Math.max(0,e|0),Ht(t),t}function Wc(e){let t=Ie();return t.tokens[e]?(t.tokens[e]-=1,Ht(t),{ok:!0,save:t}):{ok:!1,save:t}}function Xc(e){let t=Ie(),r=String(e);return t.fails[r]=(t.fails[r]||0)+1,Ht(t),t}function jc(e){let t=Ie();return delete t.fails[String(e)],Ht(t),t}function qc(e){let t=Ie();return t.seen.includes(e)||t.seen.push(e),Ht(t),t}function Yc(e){let t=Ie();return t.rank=e,Ht(t),t}function Zc(e){let t=Ie();return t.colorblind=!!e,Ht(t),t}function Jc(e){let t=Ie();return t.music=!!e,Ht(t),t}var Tl="170",wp=0,Kc=1,Ap=2,oh=1,Cp=2,Cr=3,$r=0,Vt=1,Rr=2,Zr=0,ea=1,$c=2,Qc=3,eu=4,Rp=5,_i=100,Pp=101,Lp=102,Dp=103,Up=104,Np=200,Ip=201,Op=202,Fp=203,No=204,Io=205,zp=206,kp=207,Bp=208,Hp=209,Vp=210,Gp=211,Wp=212,Xp=213,jp=214,Oo=0,Fo=1,zo=2,ia=3,ko=4,Bo=5,Ho=6,Vo=7,lh=0,qp=1,Yp=2,Jr=0,Zp=1,Jp=2,Kp=3,$p=4,Qp=5,ef=6,tf=7,ch=300,aa=301,na=302,Go=303,Wo=304,is=306,Xo=1e3,yi=1001,jo=1002,Gt=1003,rf=1004,yn=1005,xr=1006,Ks=1007,Mi=1008,Ur=1009,uh=1010,hh=1011,Ya=1012,wl=1013,Si=1014,Pr=1015,Za=1016,Al=1017,Cl=1018,sa=1020,dh=35902,ph=1021,fh=1022,lr=1023,mh=1024,gh=1025,ta=1026,oa=1027,vh=1028,Rl=1029,_h=1030,Pl=1031,Ll=1033,jn=33776,qn=33777,Yn=33778,Zn=33779,qo=35840,Yo=35841,Zo=35842,Jo=35843,Ko=36196,$o=37492,Qo=37496,el=37808,tl=37809,rl=37810,il=37811,al=37812,nl=37813,sl=37814,ol=37815,ll=37816,cl=37817,ul=37818,hl=37819,dl=37820,pl=37821,Jn=36492,fl=36494,ml=36495,xh=36283,gl=36284,vl=36285,_l=36286,es=2300,xl=2301,$s=2302,tu=2400,ru=2401,iu=2402,af=3200,nf=3201,yh=0,sf=1,vr="",St="srgb",ca="srgb-linear",as="linear",at="srgb",Di=7680,au=519,of=512,lf=513,cf=514,Mh=515,uf=516,hf=517,df=518,pf=519,yl=35044,nu="300 es",Lr=2e3,ts=2001,ua=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let r=this._listeners[e];if(r!==void 0){let i=r.indexOf(t);i!==-1&&r.splice(i,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let r=t.slice(0);for(let i=0,a=r.length;i<a;i++)r[i].call(this,e);e.target=null}}},Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qs=Math.PI/180,Ml=180/Math.PI;function Kr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[e&255]+Dt[e>>8&255]+Dt[e>>16&255]+Dt[e>>24&255]+"-"+Dt[t&255]+Dt[t>>8&255]+"-"+Dt[t>>16&15|64]+Dt[t>>24&255]+"-"+Dt[r&63|128]+Dt[r>>8&255]+"-"+Dt[r>>16&255]+Dt[r>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function Rt(e,t,r){return Math.max(t,Math.min(r,e))}function ff(e,t){return(e%t+t)%t}function eo(e,t,r){return(1-r)*e+r*t}function _r(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function nt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}var ve=class Sh{constructor(t=0,r=0){Sh.prototype.isVector2=!0,this.x=t,this.y=r}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,r){return this.x=t,this.y=r,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,r){switch(t){case 0:this.x=r;break;case 1:this.y=r;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,r){return this.x=t.x+r.x,this.y=t.y+r.y,this}addScaledVector(t,r){return this.x+=t.x*r,this.y+=t.y*r,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,r){return this.x=t.x-r.x,this.y=t.y-r.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let r=this.x,i=this.y,a=t.elements;return this.x=a[0]*r+a[3]*i+a[6],this.y=a[1]*r+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,r){return this.x=Math.max(t.x,Math.min(r.x,this.x)),this.y=Math.max(t.y,Math.min(r.y,this.y)),this}clampScalar(t,r){return this.x=Math.max(t,Math.min(r,this.x)),this.y=Math.max(t,Math.min(r,this.y)),this}clampLength(t,r){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(r,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let r=Math.sqrt(this.lengthSq()*t.lengthSq());if(r===0)return Math.PI/2;let i=this.dot(t)/r;return Math.acos(Rt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let r=this.x-t.x,i=this.y-t.y;return r*r+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,r){return this.x+=(t.x-this.x)*r,this.y+=(t.y-this.y)*r,this}lerpVectors(t,r,i){return this.x=t.x+(r.x-t.x)*i,this.y=t.y+(r.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,r=0){return this.x=t[r],this.y=t[r+1],this}toArray(t=[],r=0){return t[r]=this.x,t[r+1]=this.y,t}fromBufferAttribute(t,r){return this.x=t.getX(r),this.y=t.getY(r),this}rotateAround(t,r){let i=Math.cos(r),a=Math.sin(r),n=this.x-t.x,s=this.y-t.y;return this.x=n*i-s*a+t.x,this.y=n*a+s*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},We=class Eh{constructor(t,r,i,a,n,s,o,l,c){Eh.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,r,i,a,n,s,o,l,c)}set(t,r,i,a,n,s,o,l,c){let u=this.elements;return u[0]=t,u[1]=a,u[2]=o,u[3]=r,u[4]=n,u[5]=l,u[6]=i,u[7]=s,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let r=this.elements,i=t.elements;return r[0]=i[0],r[1]=i[1],r[2]=i[2],r[3]=i[3],r[4]=i[4],r[5]=i[5],r[6]=i[6],r[7]=i[7],r[8]=i[8],this}extractBasis(t,r,i){return t.setFromMatrix3Column(this,0),r.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let r=t.elements;return this.set(r[0],r[4],r[8],r[1],r[5],r[9],r[2],r[6],r[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,r){let i=t.elements,a=r.elements,n=this.elements,s=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],v=i[8],g=a[0],m=a[3],f=a[6],b=a[1],M=a[4],C=a[7],G=a[2],S=a[5],A=a[8];return n[0]=s*g+o*b+l*G,n[3]=s*m+o*M+l*S,n[6]=s*f+o*C+l*A,n[1]=c*g+u*b+h*G,n[4]=c*m+u*M+h*S,n[7]=c*f+u*C+h*A,n[2]=d*g+p*b+v*G,n[5]=d*m+p*M+v*S,n[8]=d*f+p*C+v*A,this}multiplyScalar(t){let r=this.elements;return r[0]*=t,r[3]*=t,r[6]*=t,r[1]*=t,r[4]*=t,r[7]*=t,r[2]*=t,r[5]*=t,r[8]*=t,this}determinant(){let t=this.elements,r=t[0],i=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return r*s*u-r*o*c-i*n*u+i*o*l+a*n*c-a*s*l}invert(){let t=this.elements,r=t[0],i=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*s-o*c,d=o*l-u*n,p=c*n-s*l,v=r*h+i*d+a*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/v;return t[0]=h*g,t[1]=(a*c-u*i)*g,t[2]=(o*i-a*s)*g,t[3]=d*g,t[4]=(u*r-a*l)*g,t[5]=(a*n-o*r)*g,t[6]=p*g,t[7]=(i*l-c*r)*g,t[8]=(s*r-i*n)*g,this}transpose(){let t,r=this.elements;return t=r[1],r[1]=r[3],r[3]=t,t=r[2],r[2]=r[6],r[6]=t,t=r[5],r[5]=r[7],r[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let r=this.elements;return t[0]=r[0],t[1]=r[3],t[2]=r[6],t[3]=r[1],t[4]=r[4],t[5]=r[7],t[6]=r[2],t[7]=r[5],t[8]=r[8],this}setUvTransform(t,r,i,a,n,s,o){let l=Math.cos(n),c=Math.sin(n);return this.set(i*l,i*c,-i*(l*s+c*o)+s+t,-a*c,a*l,-a*(-c*s+l*o)+o+r,0,0,1),this}scale(t,r){return this.premultiply(to.makeScale(t,r)),this}rotate(t){return this.premultiply(to.makeRotation(-t)),this}translate(t,r){return this.premultiply(to.makeTranslation(t,r)),this}makeTranslation(t,r){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,r,0,0,1),this}makeRotation(t){let r=Math.cos(t),i=Math.sin(t);return this.set(r,-i,0,i,r,0,0,0,1),this}makeScale(t,r){return this.set(t,0,0,0,r,0,0,0,1),this}equals(t){let r=this.elements,i=t.elements;for(let a=0;a<9;a++)if(r[a]!==i[a])return!1;return!0}fromArray(t,r=0){for(let i=0;i<9;i++)this.elements[i]=t[i+r];return this}toArray(t=[],r=0){let i=this.elements;return t[r]=i[0],t[r+1]=i[1],t[r+2]=i[2],t[r+3]=i[3],t[r+4]=i[4],t[r+5]=i[5],t[r+6]=i[6],t[r+7]=i[7],t[r+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},to=new We;function bh(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function rs(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function mf(){let e=rs("canvas");return e.style.display="block",e}var su={};function Wa(e){e in su||(su[e]=!0,console.warn(e))}function gf(e,t,r){return new Promise(function(i,a){function n(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:a();break;case e.TIMEOUT_EXPIRED:setTimeout(n,r);break;default:i()}}setTimeout(n,r)})}function vf(e){let t=e.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function _f(e){let t=e.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var Ke={enabled:!0,workingColorSpace:ca,spaces:{},convert:function(e,t,r){return this.enabled===!1||t===r||!t||!r||(this.spaces[t].transfer===at&&(e.r=Dr(e.r),e.g=Dr(e.g),e.b=Dr(e.b)),this.spaces[t].primaries!==this.spaces[r].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===at&&(e.r=ra(e.r),e.g=ra(e.g),e.b=ra(e.b))),e},fromWorkingColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},toWorkingColorSpace:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===vr?as:this.spaces[e].transfer},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,r){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}};function Dr(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function ra(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var ou=[.64,.33,.3,.6,.15,.06],lu=[.2126,.7152,.0722],cu=[.3127,.329],uu=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hu=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ke.define({[ca]:{primaries:ou,whitePoint:cu,transfer:as,toXYZ:uu,fromXYZ:hu,luminanceCoefficients:lu,workingColorSpaceConfig:{unpackColorSpace:St},outputColorSpaceConfig:{drawingBufferColorSpace:St}},[St]:{primaries:ou,whitePoint:cu,transfer:at,toXYZ:uu,fromXYZ:hu,luminanceCoefficients:lu,outputColorSpaceConfig:{drawingBufferColorSpace:St}}});var Ui,xf=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ui===void 0&&(Ui=rs("canvas")),Ui.width=e.width,Ui.height=e.height;let r=Ui.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=Ui}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=rs("canvas");t.width=e.width,t.height=e.height;let r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);let i=r.getImageData(0,0,e.width,e.height),a=i.data;for(let n=0;n<a.length;n++)a[n]=Dr(a[n]/255)*255;return r.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Dr(t[r]/255)*255):t[r]=Dr(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},yf=0,Th=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:yf++}),this.uuid=Kr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let r={uuid:this.uuid,url:""},i=this.data;if(i!==null){let a;if(Array.isArray(i)){a=[];for(let n=0,s=i.length;n<s;n++)i[n].isDataTexture?a.push(ro(i[n].image)):a.push(ro(i[n]))}else a=ro(i);r.url=a}return t||(e.images[this.uuid]=r),r}};function ro(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?xf.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Mf=0,cr=class Kn extends ua{constructor(t=Kn.DEFAULT_IMAGE,r=Kn.DEFAULT_MAPPING,i=yi,a=yi,n=xr,s=Mi,o=lr,l=Ur,c=Kn.DEFAULT_ANISOTROPY,u=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Mf++}),this.uuid=Kr(),this.name="",this.source=new Th(t),this.mipmaps=[],this.mapping=r,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=n,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ve(0,0),this.repeat=new ve(1,1),this.center=new ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let r=t===void 0||typeof t=="string";if(!r&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),r||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ch)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Xo:t.x=t.x-Math.floor(t.x);break;case yi:t.x=t.x<0?0:1;break;case jo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Xo:t.y=t.y-Math.floor(t.y);break;case yi:t.y=t.y<0?0:1;break;case jo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};cr.DEFAULT_IMAGE=null;cr.DEFAULT_MAPPING=ch;cr.DEFAULT_ANISOTROPY=1;var Mt=class wh{constructor(t=0,r=0,i=0,a=1){wh.prototype.isVector4=!0,this.x=t,this.y=r,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,r,i,a){return this.x=t,this.y=r,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,r){switch(t){case 0:this.x=r;break;case 1:this.y=r;break;case 2:this.z=r;break;case 3:this.w=r;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,r){return this.x=t.x+r.x,this.y=t.y+r.y,this.z=t.z+r.z,this.w=t.w+r.w,this}addScaledVector(t,r){return this.x+=t.x*r,this.y+=t.y*r,this.z+=t.z*r,this.w+=t.w*r,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,r){return this.x=t.x-r.x,this.y=t.y-r.y,this.z=t.z-r.z,this.w=t.w-r.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let r=this.x,i=this.y,a=this.z,n=this.w,s=t.elements;return this.x=s[0]*r+s[4]*i+s[8]*a+s[12]*n,this.y=s[1]*r+s[5]*i+s[9]*a+s[13]*n,this.z=s[2]*r+s[6]*i+s[10]*a+s[14]*n,this.w=s[3]*r+s[7]*i+s[11]*a+s[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let r=Math.sqrt(1-t.w*t.w);return r<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/r,this.y=t.y/r,this.z=t.z/r),this}setAxisAngleFromRotationMatrix(t){let r,i,a,n,s=t.elements,o=s[0],l=s[4],c=s[8],u=s[1],h=s[5],d=s[9],p=s[2],v=s[6],g=s[10];if(Math.abs(l-u)<.01&&Math.abs(c-p)<.01&&Math.abs(d-v)<.01){if(Math.abs(l+u)<.1&&Math.abs(c+p)<.1&&Math.abs(d+v)<.1&&Math.abs(o+h+g-3)<.1)return this.set(1,0,0,0),this;r=Math.PI;let f=(o+1)/2,b=(h+1)/2,M=(g+1)/2,C=(l+u)/4,G=(c+p)/4,S=(d+v)/4;return f>b&&f>M?f<.01?(i=0,a=.707106781,n=.707106781):(i=Math.sqrt(f),a=C/i,n=G/i):b>M?b<.01?(i=.707106781,a=0,n=.707106781):(a=Math.sqrt(b),i=C/a,n=S/a):M<.01?(i=.707106781,a=.707106781,n=0):(n=Math.sqrt(M),i=G/n,a=S/n),this.set(i,a,n,r),this}let m=Math.sqrt((v-d)*(v-d)+(c-p)*(c-p)+(u-l)*(u-l));return Math.abs(m)<.001&&(m=1),this.x=(v-d)/m,this.y=(c-p)/m,this.z=(u-l)/m,this.w=Math.acos((o+h+g-1)/2),this}setFromMatrixPosition(t){let r=t.elements;return this.x=r[12],this.y=r[13],this.z=r[14],this.w=r[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,r){return this.x=Math.max(t.x,Math.min(r.x,this.x)),this.y=Math.max(t.y,Math.min(r.y,this.y)),this.z=Math.max(t.z,Math.min(r.z,this.z)),this.w=Math.max(t.w,Math.min(r.w,this.w)),this}clampScalar(t,r){return this.x=Math.max(t,Math.min(r,this.x)),this.y=Math.max(t,Math.min(r,this.y)),this.z=Math.max(t,Math.min(r,this.z)),this.w=Math.max(t,Math.min(r,this.w)),this}clampLength(t,r){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(r,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,r){return this.x+=(t.x-this.x)*r,this.y+=(t.y-this.y)*r,this.z+=(t.z-this.z)*r,this.w+=(t.w-this.w)*r,this}lerpVectors(t,r,i){return this.x=t.x+(r.x-t.x)*i,this.y=t.y+(r.y-t.y)*i,this.z=t.z+(r.z-t.z)*i,this.w=t.w+(r.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,r=0){return this.x=t[r],this.y=t[r+1],this.z=t[r+2],this.w=t[r+3],this}toArray(t=[],r=0){return t[r]=this.x,t[r+1]=this.y,t[r+2]=this.z,t[r+3]=this.w,t}fromBufferAttribute(t,r){return this.x=t.getX(r),this.y=t.getY(r),this.z=t.getZ(r),this.w=t.getW(r),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Sf=class extends ua{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t);let i={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xr,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);let a=new cr(i,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);a.flipY=!1,a.generateMipmaps=r.generateMipmaps,a.internalFormat=r.internalFormat,this.textures=[];let n=r.count;for(let s=0;s<n;s++)this.textures[s]=a.clone(),this.textures[s].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let i=0,a=this.textures.length;i<a;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,i=e.textures.length;r<i;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Th(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ei=class extends Sf{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}},Ah=class extends cr{constructor(e=null,t=1,r=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:i},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Ef=class extends cr{constructor(e=null,t=1,r=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:i},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ha=class{constructor(e=0,t=0,r=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=i}static slerpFlat(e,t,r,i,a,n,s){let o=r[i+0],l=r[i+1],c=r[i+2],u=r[i+3],h=a[n+0],d=a[n+1],p=a[n+2],v=a[n+3];if(s===0){e[t+0]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u;return}if(s===1){e[t+0]=h,e[t+1]=d,e[t+2]=p,e[t+3]=v;return}if(u!==v||o!==h||l!==d||c!==p){let g=1-s,m=o*h+l*d+c*p+u*v,f=m>=0?1:-1,b=1-m*m;if(b>Number.EPSILON){let C=Math.sqrt(b),G=Math.atan2(C,m*f);g=Math.sin(g*G)/C,s=Math.sin(s*G)/C}let M=s*f;if(o=o*g+h*M,l=l*g+d*M,c=c*g+p*M,u=u*g+v*M,g===1-s){let C=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=C,l*=C,c*=C,u*=C}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,r,i,a,n){let s=r[i],o=r[i+1],l=r[i+2],c=r[i+3],u=a[n],h=a[n+1],d=a[n+2],p=a[n+3];return e[t]=s*p+c*u+o*d-l*h,e[t+1]=o*p+c*h+l*u-s*d,e[t+2]=l*p+c*d+s*h-o*u,e[t+3]=c*p-s*u-o*h-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,i){return this._x=e,this._y=t,this._z=r,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let r=e._x,i=e._y,a=e._z,n=e._order,s=Math.cos,o=Math.sin,l=s(r/2),c=s(i/2),u=s(a/2),h=o(r/2),d=o(i/2),p=o(a/2);switch(n){case"XYZ":this._x=h*c*u+l*d*p,this._y=l*d*u-h*c*p,this._z=l*c*p+h*d*u,this._w=l*c*u-h*d*p;break;case"YXZ":this._x=h*c*u+l*d*p,this._y=l*d*u-h*c*p,this._z=l*c*p-h*d*u,this._w=l*c*u+h*d*p;break;case"ZXY":this._x=h*c*u-l*d*p,this._y=l*d*u+h*c*p,this._z=l*c*p+h*d*u,this._w=l*c*u-h*d*p;break;case"ZYX":this._x=h*c*u-l*d*p,this._y=l*d*u+h*c*p,this._z=l*c*p-h*d*u,this._w=l*c*u+h*d*p;break;case"YZX":this._x=h*c*u+l*d*p,this._y=l*d*u+h*c*p,this._z=l*c*p-h*d*u,this._w=l*c*u-h*d*p;break;case"XZY":this._x=h*c*u-l*d*p,this._y=l*d*u-h*c*p,this._z=l*c*p+h*d*u,this._w=l*c*u+h*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+n)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let r=t/2,i=Math.sin(r);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,r=t[0],i=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],c=t[6],u=t[10],h=r+s+u;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(c-o)*d,this._y=(a-l)*d,this._z=(n-i)*d}else if(r>s&&r>u){let d=2*Math.sqrt(1+r-s-u);this._w=(c-o)/d,this._x=.25*d,this._y=(i+n)/d,this._z=(a+l)/d}else if(s>u){let d=2*Math.sqrt(1+s-r-u);this._w=(a-l)/d,this._x=(i+n)/d,this._y=.25*d,this._z=(o+c)/d}else{let d=2*Math.sqrt(1+u-r-s);this._w=(n-i)/d,this._x=(a+l)/d,this._y=(o+c)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rt(this.dot(e),-1,1)))}rotateTowards(e,t){let r=this.angleTo(e);if(r===0)return this;let i=Math.min(1,t/r);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let r=e._x,i=e._y,a=e._z,n=e._w,s=t._x,o=t._y,l=t._z,c=t._w;return this._x=r*c+n*s+i*l-a*o,this._y=i*c+n*o+a*s-r*l,this._z=a*c+n*l+r*o-i*s,this._w=n*c-r*s-i*o-a*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let r=this._x,i=this._y,a=this._z,n=this._w,s=n*e._w+r*e._x+i*e._y+a*e._z;if(s<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,s=-s):this.copy(e),s>=1)return this._w=n,this._x=r,this._y=i,this._z=a,this;let o=1-s*s;if(o<=Number.EPSILON){let d=1-t;return this._w=d*n+t*this._w,this._x=d*r+t*this._x,this._y=d*i+t*this._y,this._z=d*a+t*this._z,this.normalize(),this}let l=Math.sqrt(o),c=Math.atan2(l,s),u=Math.sin((1-t)*c)/l,h=Math.sin(t*c)/l;return this._w=n*u+this._w*h,this._x=r*u+this._x*h,this._y=i*u+this._y*h,this._z=a*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),i=Math.sqrt(1-r),a=Math.sqrt(r);return this.set(i*Math.sin(e),i*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class Ch{constructor(t=0,r=0,i=0){Ch.prototype.isVector3=!0,this.x=t,this.y=r,this.z=i}set(t,r,i){return i===void 0&&(i=this.z),this.x=t,this.y=r,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,r){switch(t){case 0:this.x=r;break;case 1:this.y=r;break;case 2:this.z=r;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,r){return this.x=t.x+r.x,this.y=t.y+r.y,this.z=t.z+r.z,this}addScaledVector(t,r){return this.x+=t.x*r,this.y+=t.y*r,this.z+=t.z*r,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,r){return this.x=t.x-r.x,this.y=t.y-r.y,this.z=t.z-r.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,r){return this.x=t.x*r.x,this.y=t.y*r.y,this.z=t.z*r.z,this}applyEuler(t){return this.applyQuaternion(du.setFromEuler(t))}applyAxisAngle(t,r){return this.applyQuaternion(du.setFromAxisAngle(t,r))}applyMatrix3(t){let r=this.x,i=this.y,a=this.z,n=t.elements;return this.x=n[0]*r+n[3]*i+n[6]*a,this.y=n[1]*r+n[4]*i+n[7]*a,this.z=n[2]*r+n[5]*i+n[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let r=this.x,i=this.y,a=this.z,n=t.elements,s=1/(n[3]*r+n[7]*i+n[11]*a+n[15]);return this.x=(n[0]*r+n[4]*i+n[8]*a+n[12])*s,this.y=(n[1]*r+n[5]*i+n[9]*a+n[13])*s,this.z=(n[2]*r+n[6]*i+n[10]*a+n[14])*s,this}applyQuaternion(t){let r=this.x,i=this.y,a=this.z,n=t.x,s=t.y,o=t.z,l=t.w,c=2*(s*a-o*i),u=2*(o*r-n*a),h=2*(n*i-s*r);return this.x=r+l*c+s*h-o*u,this.y=i+l*u+o*c-n*h,this.z=a+l*h+n*u-s*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let r=this.x,i=this.y,a=this.z,n=t.elements;return this.x=n[0]*r+n[4]*i+n[8]*a,this.y=n[1]*r+n[5]*i+n[9]*a,this.z=n[2]*r+n[6]*i+n[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,r){return this.x=Math.max(t.x,Math.min(r.x,this.x)),this.y=Math.max(t.y,Math.min(r.y,this.y)),this.z=Math.max(t.z,Math.min(r.z,this.z)),this}clampScalar(t,r){return this.x=Math.max(t,Math.min(r,this.x)),this.y=Math.max(t,Math.min(r,this.y)),this.z=Math.max(t,Math.min(r,this.z)),this}clampLength(t,r){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(r,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,r){return this.x+=(t.x-this.x)*r,this.y+=(t.y-this.y)*r,this.z+=(t.z-this.z)*r,this}lerpVectors(t,r,i){return this.x=t.x+(r.x-t.x)*i,this.y=t.y+(r.y-t.y)*i,this.z=t.z+(r.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,r){let i=t.x,a=t.y,n=t.z,s=r.x,o=r.y,l=r.z;return this.x=a*l-n*o,this.y=n*s-i*l,this.z=i*o-a*s,this}projectOnVector(t){let r=t.lengthSq();if(r===0)return this.set(0,0,0);let i=t.dot(this)/r;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return io.copy(this).projectOnVector(t),this.sub(io)}reflect(t){return this.sub(io.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let r=Math.sqrt(this.lengthSq()*t.lengthSq());if(r===0)return Math.PI/2;let i=this.dot(t)/r;return Math.acos(Rt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let r=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return r*r+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,r,i){let a=Math.sin(r)*t;return this.x=a*Math.sin(i),this.y=Math.cos(r)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,r,i){return this.x=t*Math.sin(r),this.y=i,this.z=t*Math.cos(r),this}setFromMatrixPosition(t){let r=t.elements;return this.x=r[12],this.y=r[13],this.z=r[14],this}setFromMatrixScale(t){let r=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=r,this.y=i,this.z=a,this}setFromMatrixColumn(t,r){return this.fromArray(t.elements,r*4)}setFromMatrix3Column(t,r){return this.fromArray(t.elements,r*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,r=0){return this.x=t[r],this.y=t[r+1],this.z=t[r+2],this}toArray(t=[],r=0){return t[r]=this.x,t[r+1]=this.y,t[r+2]=this.z,t}fromBufferAttribute(t,r){return this.x=t.getX(r),this.y=t.getY(r),this.z=t.getZ(r),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,r=Math.random()*2-1,i=Math.sqrt(1-r*r);return this.x=i*Math.cos(t),this.y=r,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},io=new N,du=new ha,Ja=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(ar.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(ar.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let r=ar.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let r=e.geometry;if(r!==void 0){let a=r.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let n=0,s=a.count;n<s;n++)e.isMesh===!0?e.getVertexPosition(n,ar):ar.fromBufferAttribute(a,n),ar.applyMatrix4(e.matrixWorld),this.expandByPoint(ar);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Mn.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Mn.copy(r.boundingBox)),Mn.applyMatrix4(e.matrixWorld),this.union(Mn)}let i=e.children;for(let a=0,n=i.length;a<n;a++)this.expandByObject(i[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ar),ar.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fa),Sn.subVectors(this.max,Fa),Ni.subVectors(e.a,Fa),Ii.subVectors(e.b,Fa),Oi.subVectors(e.c,Fa),Gr.subVectors(Ii,Ni),Wr.subVectors(Oi,Ii),ui.subVectors(Ni,Oi);let t=[0,-Gr.z,Gr.y,0,-Wr.z,Wr.y,0,-ui.z,ui.y,Gr.z,0,-Gr.x,Wr.z,0,-Wr.x,ui.z,0,-ui.x,-Gr.y,Gr.x,0,-Wr.y,Wr.x,0,-ui.y,ui.x,0];return!ao(t,Ni,Ii,Oi,Sn)||(t=[1,0,0,0,1,0,0,0,1],!ao(t,Ni,Ii,Oi,Sn))?!1:(En.crossVectors(Gr,Wr),t=[En.x,En.y,En.z],ao(t,Ni,Ii,Oi,Sn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ar).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ar).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Er[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Er[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Er[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Er[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Er[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Er[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Er[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Er[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Er),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Er=[new N,new N,new N,new N,new N,new N,new N,new N],ar=new N,Mn=new Ja,Ni=new N,Ii=new N,Oi=new N,Gr=new N,Wr=new N,ui=new N,Fa=new N,Sn=new N,En=new N,hi=new N;function ao(e,t,r,i,a){for(let n=0,s=e.length-3;n<=s;n+=3){hi.fromArray(e,n);let o=a.x*Math.abs(hi.x)+a.y*Math.abs(hi.y)+a.z*Math.abs(hi.z),l=t.dot(hi),c=r.dot(hi),u=i.dot(hi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var bf=new Ja,za=new N,no=new N,Dl=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let r=this.center;t!==void 0?r.copy(t):bf.setFromPoints(e).getCenter(r);let i=0;for(let a=0,n=e.length;a<n;a++)i=Math.max(i,r.distanceToSquared(e[a]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;za.subVectors(e,this.center);let t=za.lengthSq();if(t>this.radius*this.radius){let r=Math.sqrt(t),i=(r-this.radius)*.5;this.center.addScaledVector(za,i/r),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(no.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(za.copy(e.center).add(no)),this.expandByPoint(za.copy(e.center).sub(no))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},br=new N,so=new N,bn=new N,Xr=new N,oo=new N,Tn=new N,lo=new N,Rh=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,br)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=br.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(br.copy(this.origin).addScaledVector(this.direction,t),br.distanceToSquared(e))}distanceSqToSegment(e,t,r,i){so.copy(e).add(t).multiplyScalar(.5),bn.copy(t).sub(e).normalize(),Xr.copy(this.origin).sub(so);let a=e.distanceTo(t)*.5,n=-this.direction.dot(bn),s=Xr.dot(this.direction),o=-Xr.dot(bn),l=Xr.lengthSq(),c=Math.abs(1-n*n),u,h,d,p;if(c>0)if(u=n*o-s,h=n*s-o,p=a*c,u>=0)if(h>=-p)if(h<=p){let v=1/c;u*=v,h*=v,d=u*(u+n*h+2*s)+h*(n*u+h+2*o)+l}else h=a,u=Math.max(0,-(n*h+s)),d=-u*u+h*(h+2*o)+l;else h=-a,u=Math.max(0,-(n*h+s)),d=-u*u+h*(h+2*o)+l;else h<=-p?(u=Math.max(0,-(-n*a+s)),h=u>0?-a:Math.min(Math.max(-a,-o),a),d=-u*u+h*(h+2*o)+l):h<=p?(u=0,h=Math.min(Math.max(-a,-o),a),d=h*(h+2*o)+l):(u=Math.max(0,-(n*a+s)),h=u>0?a:Math.min(Math.max(-a,-o),a),d=-u*u+h*(h+2*o)+l);else h=n>0?-a:a,u=Math.max(0,-(n*h+s)),d=-u*u+h*(h+2*o)+l;return r&&r.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(so).addScaledVector(bn,h),d}intersectSphere(e,t){br.subVectors(e.center,this.origin);let r=br.dot(this.direction),i=br.dot(br)-r*r,a=e.radius*e.radius;if(i>a)return null;let n=Math.sqrt(a-i),s=r-n,o=r+n;return o<0?null:s<0?this.at(o,t):this.at(s,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){let r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,i,a,n,s,o,l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(r=(e.min.x-h.x)*l,i=(e.max.x-h.x)*l):(r=(e.max.x-h.x)*l,i=(e.min.x-h.x)*l),c>=0?(a=(e.min.y-h.y)*c,n=(e.max.y-h.y)*c):(a=(e.max.y-h.y)*c,n=(e.min.y-h.y)*c),r>n||a>i||((a>r||isNaN(r))&&(r=a),(n<i||isNaN(i))&&(i=n),u>=0?(s=(e.min.z-h.z)*u,o=(e.max.z-h.z)*u):(s=(e.max.z-h.z)*u,o=(e.min.z-h.z)*u),r>o||s>i)||((s>r||r!==r)&&(r=s),(o<i||i!==i)&&(i=o),i<0)?null:this.at(r>=0?r:i,t)}intersectsBox(e){return this.intersectBox(e,br)!==null}intersectTriangle(e,t,r,i,a){oo.subVectors(t,e),Tn.subVectors(r,e),lo.crossVectors(oo,Tn);let n=this.direction.dot(lo),s;if(n>0){if(i)return null;s=1}else if(n<0)s=-1,n=-n;else return null;Xr.subVectors(this.origin,e);let o=s*this.direction.dot(Tn.crossVectors(Xr,Tn));if(o<0)return null;let l=s*this.direction.dot(oo.cross(Xr));if(l<0||o+l>n)return null;let c=-s*Xr.dot(lo);return c<0?null:this.at(c/n,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ut=class Sl{constructor(t,r,i,a,n,s,o,l,c,u,h,d,p,v,g,m){Sl.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,r,i,a,n,s,o,l,c,u,h,d,p,v,g,m)}set(t,r,i,a,n,s,o,l,c,u,h,d,p,v,g,m){let f=this.elements;return f[0]=t,f[4]=r,f[8]=i,f[12]=a,f[1]=n,f[5]=s,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=v,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Sl().fromArray(this.elements)}copy(t){let r=this.elements,i=t.elements;return r[0]=i[0],r[1]=i[1],r[2]=i[2],r[3]=i[3],r[4]=i[4],r[5]=i[5],r[6]=i[6],r[7]=i[7],r[8]=i[8],r[9]=i[9],r[10]=i[10],r[11]=i[11],r[12]=i[12],r[13]=i[13],r[14]=i[14],r[15]=i[15],this}copyPosition(t){let r=this.elements,i=t.elements;return r[12]=i[12],r[13]=i[13],r[14]=i[14],this}setFromMatrix3(t){let r=t.elements;return this.set(r[0],r[3],r[6],0,r[1],r[4],r[7],0,r[2],r[5],r[8],0,0,0,0,1),this}extractBasis(t,r,i){return t.setFromMatrixColumn(this,0),r.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,r,i){return this.set(t.x,r.x,i.x,0,t.y,r.y,i.y,0,t.z,r.z,i.z,0,0,0,0,1),this}extractRotation(t){let r=this.elements,i=t.elements,a=1/Fi.setFromMatrixColumn(t,0).length(),n=1/Fi.setFromMatrixColumn(t,1).length(),s=1/Fi.setFromMatrixColumn(t,2).length();return r[0]=i[0]*a,r[1]=i[1]*a,r[2]=i[2]*a,r[3]=0,r[4]=i[4]*n,r[5]=i[5]*n,r[6]=i[6]*n,r[7]=0,r[8]=i[8]*s,r[9]=i[9]*s,r[10]=i[10]*s,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,this}makeRotationFromEuler(t){let r=this.elements,i=t.x,a=t.y,n=t.z,s=Math.cos(i),o=Math.sin(i),l=Math.cos(a),c=Math.sin(a),u=Math.cos(n),h=Math.sin(n);if(t.order==="XYZ"){let d=s*u,p=s*h,v=o*u,g=o*h;r[0]=l*u,r[4]=-l*h,r[8]=c,r[1]=p+v*c,r[5]=d-g*c,r[9]=-o*l,r[2]=g-d*c,r[6]=v+p*c,r[10]=s*l}else if(t.order==="YXZ"){let d=l*u,p=l*h,v=c*u,g=c*h;r[0]=d+g*o,r[4]=v*o-p,r[8]=s*c,r[1]=s*h,r[5]=s*u,r[9]=-o,r[2]=p*o-v,r[6]=g+d*o,r[10]=s*l}else if(t.order==="ZXY"){let d=l*u,p=l*h,v=c*u,g=c*h;r[0]=d-g*o,r[4]=-s*h,r[8]=v+p*o,r[1]=p+v*o,r[5]=s*u,r[9]=g-d*o,r[2]=-s*c,r[6]=o,r[10]=s*l}else if(t.order==="ZYX"){let d=s*u,p=s*h,v=o*u,g=o*h;r[0]=l*u,r[4]=v*c-p,r[8]=d*c+g,r[1]=l*h,r[5]=g*c+d,r[9]=p*c-v,r[2]=-c,r[6]=o*l,r[10]=s*l}else if(t.order==="YZX"){let d=s*l,p=s*c,v=o*l,g=o*c;r[0]=l*u,r[4]=g-d*h,r[8]=v*h+p,r[1]=h,r[5]=s*u,r[9]=-o*u,r[2]=-c*u,r[6]=p*h+v,r[10]=d-g*h}else if(t.order==="XZY"){let d=s*l,p=s*c,v=o*l,g=o*c;r[0]=l*u,r[4]=-h,r[8]=c*u,r[1]=d*h+g,r[5]=s*u,r[9]=p*h-v,r[2]=v*h-p,r[6]=o*u,r[10]=g*h+d}return r[3]=0,r[7]=0,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Tf,t,wf)}lookAt(t,r,i){let a=this.elements;return Jt.subVectors(t,r),Jt.lengthSq()===0&&(Jt.z=1),Jt.normalize(),jr.crossVectors(i,Jt),jr.lengthSq()===0&&(Math.abs(i.z)===1?Jt.x+=1e-4:Jt.z+=1e-4,Jt.normalize(),jr.crossVectors(i,Jt)),jr.normalize(),wn.crossVectors(Jt,jr),a[0]=jr.x,a[4]=wn.x,a[8]=Jt.x,a[1]=jr.y,a[5]=wn.y,a[9]=Jt.y,a[2]=jr.z,a[6]=wn.z,a[10]=Jt.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,r){let i=t.elements,a=r.elements,n=this.elements,s=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],v=i[2],g=i[6],m=i[10],f=i[14],b=i[3],M=i[7],C=i[11],G=i[15],S=a[0],A=a[4],k=a[8],y=a[12],E=a[1],U=a[5],H=a[9],Y=a[13],Z=a[2],re=a[6],$=a[10],oe=a[14],Q=a[3],he=a[7],_e=a[11],Be=a[15];return n[0]=s*S+o*E+l*Z+c*Q,n[4]=s*A+o*U+l*re+c*he,n[8]=s*k+o*H+l*$+c*_e,n[12]=s*y+o*Y+l*oe+c*Be,n[1]=u*S+h*E+d*Z+p*Q,n[5]=u*A+h*U+d*re+p*he,n[9]=u*k+h*H+d*$+p*_e,n[13]=u*y+h*Y+d*oe+p*Be,n[2]=v*S+g*E+m*Z+f*Q,n[6]=v*A+g*U+m*re+f*he,n[10]=v*k+g*H+m*$+f*_e,n[14]=v*y+g*Y+m*oe+f*Be,n[3]=b*S+M*E+C*Z+G*Q,n[7]=b*A+M*U+C*re+G*he,n[11]=b*k+M*H+C*$+G*_e,n[15]=b*y+M*Y+C*oe+G*Be,this}multiplyScalar(t){let r=this.elements;return r[0]*=t,r[4]*=t,r[8]*=t,r[12]*=t,r[1]*=t,r[5]*=t,r[9]*=t,r[13]*=t,r[2]*=t,r[6]*=t,r[10]*=t,r[14]*=t,r[3]*=t,r[7]*=t,r[11]*=t,r[15]*=t,this}determinant(){let t=this.elements,r=t[0],i=t[4],a=t[8],n=t[12],s=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],p=t[14],v=t[3],g=t[7],m=t[11],f=t[15];return v*(+n*l*h-a*c*h-n*o*d+i*c*d+a*o*p-i*l*p)+g*(+r*l*p-r*c*d+n*s*d-a*s*p+a*c*u-n*l*u)+m*(+r*c*h-r*o*p-n*s*h+i*s*p+n*o*u-i*c*u)+f*(-a*o*u-r*l*h+r*o*d+a*s*h-i*s*d+i*l*u)}transpose(){let t=this.elements,r;return r=t[1],t[1]=t[4],t[4]=r,r=t[2],t[2]=t[8],t[8]=r,r=t[6],t[6]=t[9],t[9]=r,r=t[3],t[3]=t[12],t[12]=r,r=t[7],t[7]=t[13],t[13]=r,r=t[11],t[11]=t[14],t[14]=r,this}setPosition(t,r,i){let a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=r,a[14]=i),this}invert(){let t=this.elements,r=t[0],i=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],p=t[11],v=t[12],g=t[13],m=t[14],f=t[15],b=h*m*c-g*d*c+g*l*p-o*m*p-h*l*f+o*d*f,M=v*d*c-u*m*c-v*l*p+s*m*p+u*l*f-s*d*f,C=u*g*c-v*h*c+v*o*p-s*g*p-u*o*f+s*h*f,G=v*h*l-u*g*l-v*o*d+s*g*d+u*o*m-s*h*m,S=r*b+i*M+a*C+n*G;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/S;return t[0]=b*A,t[1]=(g*d*n-h*m*n-g*a*p+i*m*p+h*a*f-i*d*f)*A,t[2]=(o*m*n-g*l*n+g*a*c-i*m*c-o*a*f+i*l*f)*A,t[3]=(h*l*n-o*d*n-h*a*c+i*d*c+o*a*p-i*l*p)*A,t[4]=M*A,t[5]=(u*m*n-v*d*n+v*a*p-r*m*p-u*a*f+r*d*f)*A,t[6]=(v*l*n-s*m*n-v*a*c+r*m*c+s*a*f-r*l*f)*A,t[7]=(s*d*n-u*l*n+u*a*c-r*d*c-s*a*p+r*l*p)*A,t[8]=C*A,t[9]=(v*h*n-u*g*n-v*i*p+r*g*p+u*i*f-r*h*f)*A,t[10]=(s*g*n-v*o*n+v*i*c-r*g*c-s*i*f+r*o*f)*A,t[11]=(u*o*n-s*h*n-u*i*c+r*h*c+s*i*p-r*o*p)*A,t[12]=G*A,t[13]=(u*g*a-v*h*a+v*i*d-r*g*d-u*i*m+r*h*m)*A,t[14]=(v*o*a-s*g*a-v*i*l+r*g*l+s*i*m-r*o*m)*A,t[15]=(s*h*a-u*o*a+u*i*l-r*h*l-s*i*d+r*o*d)*A,this}scale(t){let r=this.elements,i=t.x,a=t.y,n=t.z;return r[0]*=i,r[4]*=a,r[8]*=n,r[1]*=i,r[5]*=a,r[9]*=n,r[2]*=i,r[6]*=a,r[10]*=n,r[3]*=i,r[7]*=a,r[11]*=n,this}getMaxScaleOnAxis(){let t=this.elements,r=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(r,i,a))}makeTranslation(t,r,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,r,0,0,1,i,0,0,0,1),this}makeRotationX(t){let r=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,r,-i,0,0,i,r,0,0,0,0,1),this}makeRotationY(t){let r=Math.cos(t),i=Math.sin(t);return this.set(r,0,i,0,0,1,0,0,-i,0,r,0,0,0,0,1),this}makeRotationZ(t){let r=Math.cos(t),i=Math.sin(t);return this.set(r,-i,0,0,i,r,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,r){let i=Math.cos(r),a=Math.sin(r),n=1-i,s=t.x,o=t.y,l=t.z,c=n*s,u=n*o;return this.set(c*s+i,c*o-a*l,c*l+a*o,0,c*o+a*l,u*o+i,u*l-a*s,0,c*l-a*o,u*l+a*s,n*l*l+i,0,0,0,0,1),this}makeScale(t,r,i){return this.set(t,0,0,0,0,r,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,r,i,a,n,s){return this.set(1,i,n,0,t,1,s,0,r,a,1,0,0,0,0,1),this}compose(t,r,i){let a=this.elements,n=r._x,s=r._y,o=r._z,l=r._w,c=n+n,u=s+s,h=o+o,d=n*c,p=n*u,v=n*h,g=s*u,m=s*h,f=o*h,b=l*c,M=l*u,C=l*h,G=i.x,S=i.y,A=i.z;return a[0]=(1-(g+f))*G,a[1]=(p+C)*G,a[2]=(v-M)*G,a[3]=0,a[4]=(p-C)*S,a[5]=(1-(d+f))*S,a[6]=(m+b)*S,a[7]=0,a[8]=(v+M)*A,a[9]=(m-b)*A,a[10]=(1-(d+g))*A,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,r,i){let a=this.elements,n=Fi.set(a[0],a[1],a[2]).length(),s=Fi.set(a[4],a[5],a[6]).length(),o=Fi.set(a[8],a[9],a[10]).length();this.determinant()<0&&(n=-n),t.x=a[12],t.y=a[13],t.z=a[14],nr.copy(this);let l=1/n,c=1/s,u=1/o;return nr.elements[0]*=l,nr.elements[1]*=l,nr.elements[2]*=l,nr.elements[4]*=c,nr.elements[5]*=c,nr.elements[6]*=c,nr.elements[8]*=u,nr.elements[9]*=u,nr.elements[10]*=u,r.setFromRotationMatrix(nr),i.x=n,i.y=s,i.z=o,this}makePerspective(t,r,i,a,n,s,o=Lr){let l=this.elements,c=2*n/(r-t),u=2*n/(i-a),h=(r+t)/(r-t),d=(i+a)/(i-a),p,v;if(o===Lr)p=-(s+n)/(s-n),v=-2*s*n/(s-n);else if(o===ts)p=-s/(s-n),v=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,r,i,a,n,s,o=Lr){let l=this.elements,c=1/(r-t),u=1/(i-a),h=1/(s-n),d=(r+t)*c,p=(i+a)*u,v,g;if(o===Lr)v=(s+n)*h,g=-2*h;else if(o===ts)v=n*h,g=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let r=this.elements,i=t.elements;for(let a=0;a<16;a++)if(r[a]!==i[a])return!1;return!0}fromArray(t,r=0){for(let i=0;i<16;i++)this.elements[i]=t[i+r];return this}toArray(t=[],r=0){let i=this.elements;return t[r]=i[0],t[r+1]=i[1],t[r+2]=i[2],t[r+3]=i[3],t[r+4]=i[4],t[r+5]=i[5],t[r+6]=i[6],t[r+7]=i[7],t[r+8]=i[8],t[r+9]=i[9],t[r+10]=i[10],t[r+11]=i[11],t[r+12]=i[12],t[r+13]=i[13],t[r+14]=i[14],t[r+15]=i[15],t}},Fi=new N,nr=new ut,Tf=new N(0,0,0),wf=new N(1,1,1),jr=new N,wn=new N,Jt=new N,pu=new ut,fu=new ha,bi=class Ph{constructor(t=0,r=0,i=0,a=Ph.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=r,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,r,i,a=this._order){return this._x=t,this._y=r,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,r=this._order,i=!0){let a=t.elements,n=a[0],s=a[4],o=a[8],l=a[1],c=a[5],u=a[9],h=a[2],d=a[6],p=a[10];switch(r){case"XYZ":this._y=Math.asin(Rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Rt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,n),this._z=0);break;case"ZXY":this._x=Math.asin(Rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-Rt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Rt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,n)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Rt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+r)}return this._order=r,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,r,i){return pu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(pu,r,i)}setFromVector3(t,r=this._order){return this.set(t.x,t.y,t.z,r)}reorder(t){return fu.setFromEuler(this),this.setFromQuaternion(fu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],r=0){return t[r]=this._x,t[r+1]=this._y,t[r+2]=this._z,t[r+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};bi.DEFAULT_ORDER="XYZ";var Ul=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Af=0,mu=new N,zi=new ha,Tr=new ut,An=new N,ka=new N,Cf=new N,Rf=new ha,gu=new N(1,0,0),vu=new N(0,1,0),_u=new N(0,0,1),xu={type:"added"},Pf={type:"removed"},ki={type:"childadded",child:null},co={type:"childremoved",child:null},Wt=class $n extends ua{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=Kr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=$n.DEFAULT_UP.clone();let t=new N,r=new bi,i=new ha,a=new N(1,1,1);function n(){i.setFromEuler(r,!1)}function s(){r.setFromQuaternion(i,void 0,!1)}r._onChange(n),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:r},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new ut},normalMatrix:{value:new We}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=$n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=$n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,r){this.quaternion.setFromAxisAngle(t,r)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,r){return zi.setFromAxisAngle(t,r),this.quaternion.multiply(zi),this}rotateOnWorldAxis(t,r){return zi.setFromAxisAngle(t,r),this.quaternion.premultiply(zi),this}rotateX(t){return this.rotateOnAxis(gu,t)}rotateY(t){return this.rotateOnAxis(vu,t)}rotateZ(t){return this.rotateOnAxis(_u,t)}translateOnAxis(t,r){return mu.copy(t).applyQuaternion(this.quaternion),this.position.add(mu.multiplyScalar(r)),this}translateX(t){return this.translateOnAxis(gu,t)}translateY(t){return this.translateOnAxis(vu,t)}translateZ(t){return this.translateOnAxis(_u,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tr.copy(this.matrixWorld).invert())}lookAt(t,r,i){t.isVector3?An.copy(t):An.set(t,r,i);let a=this.parent;this.updateWorldMatrix(!0,!1),ka.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tr.lookAt(ka,An,this.up):Tr.lookAt(An,ka,this.up),this.quaternion.setFromRotationMatrix(Tr),a&&(Tr.extractRotation(a.matrixWorld),zi.setFromRotationMatrix(Tr),this.quaternion.premultiply(zi.invert()))}add(t){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.add(arguments[r]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xu),ki.child=t,this.dispatchEvent(ki),ki.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let r=this.children.indexOf(t);return r!==-1&&(t.parent=null,this.children.splice(r,1),t.dispatchEvent(Pf),co.child=t,this.dispatchEvent(co),co.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tr.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tr),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xu),ki.child=t,this.dispatchEvent(ki),ki.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,r){if(this[t]===r)return this;for(let i=0,a=this.children.length;i<a;i++){let n=this.children[i].getObjectByProperty(t,r);if(n!==void 0)return n}}getObjectsByProperty(t,r,i=[]){this[t]===r&&i.push(this);let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].getObjectsByProperty(t,r,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ka,t,Cf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ka,Rf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let r=this.matrixWorld.elements;return t.set(r[8],r[9],r[10]).normalize()}raycast(){}traverse(t){t(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].traverseVisible(t)}traverseAncestors(t){let r=this.parent;r!==null&&(t(r),r.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].updateMatrixWorld(t)}updateWorldMatrix(t,r){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),r===!0){let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].updateWorldMatrix(!1,!0)}}toJSON(t){let r=t===void 0||typeof t=="string",i={};r&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];n(t.shapes,h)}else n(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(n(t.materials,this.material[l]));a.material=o}else a.material=n(t.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];a.animations.push(n(t.animations,l))}}if(r){let o=s(t.geometries),l=s(t.materials),c=s(t.textures),u=s(t.images),h=s(t.shapes),d=s(t.skeletons),p=s(t.animations),v=s(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=a,i;function s(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,r=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),r===!0)for(let i=0;i<t.children.length;i++){let a=t.children[i];this.add(a.clone())}return this}};Wt.DEFAULT_UP=new N(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var sr=new N,wr=new N,uo=new N,Ar=new N,Bi=new N,Hi=new N,yu=new N,ho=new N,po=new N,fo=new N,mo=new Mt,go=new Mt,vo=new Mt,Ji=class Ki{constructor(t=new N,r=new N,i=new N){this.a=t,this.b=r,this.c=i}static getNormal(t,r,i,a){a.subVectors(i,r),sr.subVectors(t,r),a.cross(sr);let n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(t,r,i,a,n){sr.subVectors(a,r),wr.subVectors(i,r),uo.subVectors(t,r);let s=sr.dot(sr),o=sr.dot(wr),l=sr.dot(uo),c=wr.dot(wr),u=wr.dot(uo),h=s*c-o*o;if(h===0)return n.set(0,0,0),null;let d=1/h,p=(c*l-o*u)*d,v=(s*u-o*l)*d;return n.set(1-p-v,v,p)}static containsPoint(t,r,i,a){return this.getBarycoord(t,r,i,a,Ar)===null?!1:Ar.x>=0&&Ar.y>=0&&Ar.x+Ar.y<=1}static getInterpolation(t,r,i,a,n,s,o,l){return this.getBarycoord(t,r,i,a,Ar)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Ar.x),l.addScaledVector(s,Ar.y),l.addScaledVector(o,Ar.z),l)}static getInterpolatedAttribute(t,r,i,a,n,s){return mo.setScalar(0),go.setScalar(0),vo.setScalar(0),mo.fromBufferAttribute(t,r),go.fromBufferAttribute(t,i),vo.fromBufferAttribute(t,a),s.setScalar(0),s.addScaledVector(mo,n.x),s.addScaledVector(go,n.y),s.addScaledVector(vo,n.z),s}static isFrontFacing(t,r,i,a){return sr.subVectors(i,r),wr.subVectors(t,r),sr.cross(wr).dot(a)<0}set(t,r,i){return this.a.copy(t),this.b.copy(r),this.c.copy(i),this}setFromPointsAndIndices(t,r,i,a){return this.a.copy(t[r]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,r,i,a){return this.a.fromBufferAttribute(t,r),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return sr.subVectors(this.c,this.b),wr.subVectors(this.a,this.b),sr.cross(wr).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ki.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,r){return Ki.getBarycoord(t,this.a,this.b,this.c,r)}getInterpolation(t,r,i,a,n){return Ki.getInterpolation(t,this.a,this.b,this.c,r,i,a,n)}containsPoint(t){return Ki.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ki.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,r){let i=this.a,a=this.b,n=this.c,s,o;Bi.subVectors(a,i),Hi.subVectors(n,i),ho.subVectors(t,i);let l=Bi.dot(ho),c=Hi.dot(ho);if(l<=0&&c<=0)return r.copy(i);po.subVectors(t,a);let u=Bi.dot(po),h=Hi.dot(po);if(u>=0&&h<=u)return r.copy(a);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return s=l/(l-u),r.copy(i).addScaledVector(Bi,s);fo.subVectors(t,n);let p=Bi.dot(fo),v=Hi.dot(fo);if(v>=0&&p<=v)return r.copy(n);let g=p*c-l*v;if(g<=0&&c>=0&&v<=0)return o=c/(c-v),r.copy(i).addScaledVector(Hi,o);let m=u*v-p*h;if(m<=0&&h-u>=0&&p-v>=0)return yu.subVectors(n,a),o=(h-u)/(h-u+(p-v)),r.copy(a).addScaledVector(yu,o);let f=1/(m+g+d);return s=g*f,o=d*f,r.copy(i).addScaledVector(Bi,s).addScaledVector(Hi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qr={h:0,s:0,l:0},Cn={h:0,s:0,l:0};function _o(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+(t-e)*6*r:r<1/2?t:r<2/3?e+(t-e)*6*(2/3-r):e}var qe=class{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=St){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.toWorkingColorSpace(this,t),this}setRGB(e,t,r,i=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=r,Ke.toWorkingColorSpace(this,i),this}setHSL(e,t,r,i=Ke.workingColorSpace){if(e=ff(e,1),t=Rt(t,0,1),r=Rt(r,0,1),t===0)this.r=this.g=this.b=r;else{let a=r<=.5?r*(1+t):r+t-r*t,n=2*r-a;this.r=_o(n,a,e+1/3),this.g=_o(n,a,e),this.b=_o(n,a,e-1/3)}return Ke.toWorkingColorSpace(this,i),this}setStyle(e,t=St){function r(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,n=i[1],s=i[2];switch(n){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let a=i[1],n=a.length;if(n===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(n===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=St){let r=Lh[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Dr(e.r),this.g=Dr(e.g),this.b=Dr(e.b),this}copyLinearToSRGB(e){return this.r=ra(e.r),this.g=ra(e.g),this.b=ra(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=St){return Ke.fromWorkingColorSpace(Ut.copy(this),e),Math.round(Rt(Ut.r*255,0,255))*65536+Math.round(Rt(Ut.g*255,0,255))*256+Math.round(Rt(Ut.b*255,0,255))}getHexString(e=St){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.fromWorkingColorSpace(Ut.copy(this),t);let r=Ut.r,i=Ut.g,a=Ut.b,n=Math.max(r,i,a),s=Math.min(r,i,a),o,l,c=(s+n)/2;if(s===n)o=0,l=0;else{let u=n-s;switch(l=c<=.5?u/(n+s):u/(2-n-s),n){case r:o=(i-a)/u+(i<a?6:0);break;case i:o=(a-r)/u+2;break;case a:o=(r-i)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=Ke.workingColorSpace){return Ke.fromWorkingColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=St){Ke.fromWorkingColorSpace(Ut.copy(this),e);let t=Ut.r,r=Ut.g,i=Ut.b;return e!==St?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(i*255)})`}offsetHSL(e,t,r){return this.getHSL(qr),this.setHSL(qr.h+e,qr.s+t,qr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(qr),e.getHSL(Cn);let r=eo(qr.h,Cn.h,t),i=eo(qr.s,Cn.s,t),a=eo(qr.l,Cn.l,t);return this.setHSL(r,i,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,r=this.g,i=this.b,a=e.elements;return this.r=a[0]*t+a[3]*r+a[6]*i,this.g=a[1]*t+a[4]*r+a[7]*i,this.b=a[2]*t+a[5]*r+a[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ut=new qe;qe.NAMES=Lh;var Lf=0,da=class extends ua{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Kr(),this.name="",this.blending=ea,this.side=$r,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=No,this.blendDst=Io,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=ia,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=au,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Di,this.stencilZFail=Di,this.stencilZPass=Di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(r):i&&i.isVector3&&r&&r.isVector3?i.copy(r):this[t]=r}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==ea&&(r.blending=this.blending),this.side!==$r&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==No&&(r.blendSrc=this.blendSrc),this.blendDst!==Io&&(r.blendDst=this.blendDst),this.blendEquation!==_i&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==ia&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==au&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Di&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Di&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Di&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function i(a){let n=[];for(let s in a){let o=a[s];delete o.metadata,n.push(o)}return n}if(t){let a=i(e.textures),n=i(e.images);a.length>0&&(r.textures=a),n.length>0&&(r.images=n)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,r=null;if(t!==null){let i=t.length;r=new Array(i);for(let a=0;a!==i;++a)r[a]=t[a].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Nt=class extends da{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},yt=new N,Rn=new ve,Pt=class{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=yl,this.updateRanges=[],this.gpuType=Pr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let i=0,a=this.itemSize;i<a;i++)this.array[e+i]=t.array[r+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)Rn.fromBufferAttribute(this,t),Rn.applyMatrix3(e),this.setXY(t,Rn.x,Rn.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=_r(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=nt(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_r(t,this.array)),t}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_r(t,this.array)),t}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_r(t,this.array)),t}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),r=nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,i){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),r=nt(r,this.array),i=nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=i,this}setXYZW(e,t,r,i,a){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),r=nt(r,this.array),i=nt(i,this.array),a=nt(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=i,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yl&&(e.usage=this.usage),e}},Dh=class extends Pt{constructor(e,t,r){super(new Uint16Array(e),t,r)}},Uh=class extends Pt{constructor(e,t,r){super(new Uint32Array(e),t,r)}},vt=class extends Pt{constructor(e,t,r){super(new Float32Array(e),t,r)}},Df=0,er=new ut,xo=new Wt,Vi=new N,Kt=new Ja,Ba=new Ja,At=new N,$t=class Nh extends ua{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=Kr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bh(t)?Uh:Dh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,r){return this.attributes[t]=r,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,r,i=0){this.groups.push({start:t,count:r,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,r){this.drawRange.start=t,this.drawRange.count=r}applyMatrix4(t){let r=this.attributes.position;r!==void 0&&(r.applyMatrix4(t),r.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let n=new We().getNormalMatrix(t);i.applyNormalMatrix(n),i.needsUpdate=!0}let a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return er.makeRotationFromQuaternion(t),this.applyMatrix4(er),this}rotateX(t){return er.makeRotationX(t),this.applyMatrix4(er),this}rotateY(t){return er.makeRotationY(t),this.applyMatrix4(er),this}rotateZ(t){return er.makeRotationZ(t),this.applyMatrix4(er),this}translate(t,r,i){return er.makeTranslation(t,r,i),this.applyMatrix4(er),this}scale(t,r,i){return er.makeScale(t,r,i),this.applyMatrix4(er),this}lookAt(t){return xo.lookAt(t),xo.updateMatrix(),this.applyMatrix4(xo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vi).negate(),this.translate(Vi.x,Vi.y,Vi.z),this}setFromPoints(t){let r=this.getAttribute("position");if(r===void 0){let i=[];for(let a=0,n=t.length;a<n;a++){let s=t[a];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new vt(i,3))}else{for(let i=0,a=r.count;i<a;i++){let n=t[i];r.setXYZ(i,n.x,n.y,n.z||0)}t.length>r.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),r.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ja);let t=this.attributes.position,r=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),r)for(let i=0,a=r.length;i<a;i++){let n=r[i];Kt.setFromBufferAttribute(n),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dl);let t=this.attributes.position,r=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){let i=this.boundingSphere.center;if(Kt.setFromBufferAttribute(t),r)for(let n=0,s=r.length;n<s;n++){let o=r[n];Ba.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(Kt.min,Ba.min),Kt.expandByPoint(At),At.addVectors(Kt.max,Ba.max),Kt.expandByPoint(At)):(Kt.expandByPoint(Ba.min),Kt.expandByPoint(Ba.max))}Kt.getCenter(i);let a=0;for(let n=0,s=t.count;n<s;n++)At.fromBufferAttribute(t,n),a=Math.max(a,i.distanceToSquared(At));if(r)for(let n=0,s=r.length;n<s;n++){let o=r[n],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)At.fromBufferAttribute(o,c),l&&(Vi.fromBufferAttribute(t,c),At.add(Vi)),a=Math.max(a,i.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,r=this.attributes;if(t===null||r.position===void 0||r.normal===void 0||r.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=r.position,a=r.normal,n=r.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pt(new Float32Array(4*i.count),4));let s=this.getAttribute("tangent"),o=[],l=[];for(let k=0;k<i.count;k++)o[k]=new N,l[k]=new N;let c=new N,u=new N,h=new N,d=new ve,p=new ve,v=new ve,g=new N,m=new N;function f(k,y,E){c.fromBufferAttribute(i,k),u.fromBufferAttribute(i,y),h.fromBufferAttribute(i,E),d.fromBufferAttribute(n,k),p.fromBufferAttribute(n,y),v.fromBufferAttribute(n,E),u.sub(c),h.sub(c),p.sub(d),v.sub(d);let U=1/(p.x*v.y-v.x*p.y);isFinite(U)&&(g.copy(u).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(U),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(U),o[k].add(g),o[y].add(g),o[E].add(g),l[k].add(m),l[y].add(m),l[E].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let k=0,y=b.length;k<y;++k){let E=b[k],U=E.start,H=E.count;for(let Y=U,Z=U+H;Y<Z;Y+=3)f(t.getX(Y+0),t.getX(Y+1),t.getX(Y+2))}let M=new N,C=new N,G=new N,S=new N;function A(k){G.fromBufferAttribute(a,k),S.copy(G);let y=o[k];M.copy(y),M.sub(G.multiplyScalar(G.dot(y))).normalize(),C.crossVectors(S,y);let E=C.dot(l[k])<0?-1:1;s.setXYZW(k,M.x,M.y,M.z,E)}for(let k=0,y=b.length;k<y;++k){let E=b[k],U=E.start,H=E.count;for(let Y=U,Z=U+H;Y<Z;Y+=3)A(t.getX(Y+0)),A(t.getX(Y+1)),A(t.getX(Y+2))}}computeVertexNormals(){let t=this.index,r=this.getAttribute("position");if(r!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Pt(new Float32Array(r.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let a=new N,n=new N,s=new N,o=new N,l=new N,c=new N,u=new N,h=new N;if(t)for(let d=0,p=t.count;d<p;d+=3){let v=t.getX(d+0),g=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(r,v),n.fromBufferAttribute(r,g),s.fromBufferAttribute(r,m),u.subVectors(s,n),h.subVectors(a,n),u.cross(h),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=r.count;d<p;d+=3)a.fromBufferAttribute(r,d+0),n.fromBufferAttribute(r,d+1),s.fromBufferAttribute(r,d+2),u.subVectors(s,n),h.subVectors(a,n),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let r=0,i=t.count;r<i;r++)At.fromBufferAttribute(t,r),At.normalize(),t.setXYZ(r,At.x,At.y,At.z)}toNonIndexed(){function t(o,l){let c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u),p=0,v=0;for(let g=0,m=l.length;g<m;g++){o.isInterleavedBufferAttribute?p=l[g]*o.data.stride+o.offset:p=l[g]*u;for(let f=0;f<u;f++)d[v++]=c[p++]}return new Pt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let r=new Nh,i=this.index.array,a=this.attributes;for(let o in a){let l=a[o],c=t(l,i);r.setAttribute(o,c)}let n=this.morphAttributes;for(let o in n){let l=[],c=n[o];for(let u=0,h=c.length;u<h;u++){let d=c[u],p=t(d,i);l.push(p)}r.morphAttributes[o]=l}r.morphTargetsRelative=this.morphTargetsRelative;let s=this.groups;for(let o=0,l=s.length;o<l;o++){let c=s[o];r.addGroup(c.start,c.count,c.materialIndex)}return r}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let r=this.index;r!==null&&(t.data.index={type:r.array.constructor.name,array:Array.prototype.slice.call(r.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let a={},n=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(a[l]=u,n=!0)}n&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);let s=this.groups;s.length>0&&(t.data.groups=JSON.parse(JSON.stringify(s)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let r={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(r));let a=t.attributes;for(let c in a){let u=a[c];this.setAttribute(c,u.clone(r))}let n=t.morphAttributes;for(let c in n){let u=[],h=n[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(r));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let s=t.groups;for(let c=0,u=s.length;c<u;c++){let h=s[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mu=new ut,di=new Rh,Pn=new Dl,Su=new N,Ln=new N,Dn=new N,Un=new N,yo=new N,Nn=new N,Eu=new N,In=new N,ct=class extends Wt{constructor(e=new $t,t=new Nt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let r=e[t[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,a=r.length;i<a;i++){let n=r[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=i}}}}getVertexPosition(e,t){let r=this.geometry,i=r.attributes.position,a=r.morphAttributes.position,n=r.morphTargetsRelative;t.fromBufferAttribute(i,e);let s=this.morphTargetInfluences;if(a&&s){Nn.set(0,0,0);for(let o=0,l=a.length;o<l;o++){let c=s[o],u=a[o];c!==0&&(yo.fromBufferAttribute(u,e),n?Nn.addScaledVector(yo,c):Nn.addScaledVector(yo.sub(t),c))}t.add(Nn)}return t}raycast(e,t){let r=this.geometry,i=this.material,a=this.matrixWorld;i!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Pn.copy(r.boundingSphere),Pn.applyMatrix4(a),di.copy(e.ray).recast(e.near),!(Pn.containsPoint(di.origin)===!1&&(di.intersectSphere(Pn,Su)===null||di.origin.distanceToSquared(Su)>(e.far-e.near)**2))&&(Mu.copy(a).invert(),di.copy(e.ray).applyMatrix4(Mu),!(r.boundingBox!==null&&di.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,r){let i,a=this.geometry,n=this.material,s=a.index,o=a.attributes.position,l=a.attributes.uv,c=a.attributes.uv1,u=a.attributes.normal,h=a.groups,d=a.drawRange;if(s!==null)if(Array.isArray(n))for(let p=0,v=h.length;p<v;p++){let g=h[p],m=n[g.materialIndex],f=Math.max(g.start,d.start),b=Math.min(s.count,Math.min(g.start+g.count,d.start+d.count));for(let M=f,C=b;M<C;M+=3){let G=s.getX(M),S=s.getX(M+1),A=s.getX(M+2);i=On(this,m,e,r,l,c,u,G,S,A),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),v=Math.min(s.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){let f=s.getX(g),b=s.getX(g+1),M=s.getX(g+2);i=On(this,n,e,r,l,c,u,f,b,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(n))for(let p=0,v=h.length;p<v;p++){let g=h[p],m=n[g.materialIndex],f=Math.max(g.start,d.start),b=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let M=f,C=b;M<C;M+=3){let G=M,S=M+1,A=M+2;i=On(this,m,e,r,l,c,u,G,S,A),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){let f=g,b=g+1,M=g+2;i=On(this,n,e,r,l,c,u,f,b,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function Uf(e,t,r,i,a,n,s,o){let l;if(t.side===Vt?l=i.intersectTriangle(s,n,a,!0,o):l=i.intersectTriangle(a,n,s,t.side===$r,o),l===null)return null;In.copy(o),In.applyMatrix4(e.matrixWorld);let c=r.ray.origin.distanceTo(In);return c<r.near||c>r.far?null:{distance:c,point:In.clone(),object:e}}function On(e,t,r,i,a,n,s,o,l,c){e.getVertexPosition(o,Ln),e.getVertexPosition(l,Dn),e.getVertexPosition(c,Un);let u=Uf(e,t,r,i,Ln,Dn,Un,Eu);if(u){let h=new N;Ji.getBarycoord(Eu,Ln,Dn,Un,h),a&&(u.uv=Ji.getInterpolatedAttribute(a,o,l,c,h,new ve)),n&&(u.uv1=Ji.getInterpolatedAttribute(n,o,l,c,h,new ve)),s&&(u.normal=Ji.getInterpolatedAttribute(s,o,l,c,h,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new N,materialIndex:0};Ji.getNormal(Ln,Dn,Un,d.normal),u.face=d,u.barycoord=h}return u}var Ka=class Ih extends $t{constructor(t=1,r=1,i=1,a=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:r,depth:i,widthSegments:a,heightSegments:n,depthSegments:s};let o=this;a=Math.floor(a),n=Math.floor(n),s=Math.floor(s);let l=[],c=[],u=[],h=[],d=0,p=0;v("z","y","x",-1,-1,i,r,t,s,n,0),v("z","y","x",1,-1,i,r,-t,s,n,1),v("x","z","y",1,1,t,i,r,a,s,2),v("x","z","y",1,-1,t,i,-r,a,s,3),v("x","y","z",1,-1,t,r,i,a,n,4),v("x","y","z",-1,-1,t,r,-i,a,n,5),this.setIndex(l),this.setAttribute("position",new vt(c,3)),this.setAttribute("normal",new vt(u,3)),this.setAttribute("uv",new vt(h,2));function v(g,m,f,b,M,C,G,S,A,k,y){let E=C/A,U=G/k,H=C/2,Y=G/2,Z=S/2,re=A+1,$=k+1,oe=0,Q=0,he=new N;for(let _e=0;_e<$;_e++){let Be=_e*U-Y;for(let De=0;De<re;De++){let J=De*E-H;he[g]=J*b,he[m]=Be*M,he[f]=Z,c.push(he.x,he.y,he.z),he[g]=0,he[m]=0,he[f]=S>0?1:-1,u.push(he.x,he.y,he.z),h.push(De/A),h.push(1-_e/k),oe+=1}}for(let _e=0;_e<k;_e++)for(let Be=0;Be<A;Be++){let De=d+Be+re*_e,J=d+Be+re*(_e+1),pe=d+(Be+1)+re*(_e+1),Te=d+(Be+1)+re*_e;l.push(De,J,Te),l.push(J,pe,Te),Q+=6}o.addGroup(p,Q,y),p+=Q,d+=oe}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ih(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function la(e){let t={};for(let r in e){t[r]={};for(let i in e[r]){let a=e[r][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[r][i]=null):t[r][i]=a.clone():Array.isArray(a)?t[r][i]=a.slice():t[r][i]=a}}return t}function zt(e){let t={};for(let r=0;r<e.length;r++){let i=la(e[r]);for(let a in i)t[a]=i[a]}return t}function Nf(e){let t=[];for(let r=0;r<e.length;r++)t.push(e[r].clone());return t}function Oh(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ke.workingColorSpace}var If={clone:la,merge:zt},Of=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ff=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Qr=class extends da{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Of,this.fragmentShader=Ff,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=la(e.uniforms),this.uniformsGroups=Nf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let r={};for(let i in this.extensions)this.extensions[i]===!0&&(r[i]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}},Fh=class extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=Lr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Yr=new N,bu=new ve,Tu=new ve,or=class extends Fh{constructor(e=50,t=1,r=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ml*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Qs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ml*2*Math.atan(Math.tan(Qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){Yr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Yr.x,Yr.y).multiplyScalar(-e/Yr.z),Yr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(Yr.x,Yr.y).multiplyScalar(-e/Yr.z)}getViewSize(e,t){return this.getViewBounds(e,bu,Tu),t.subVectors(Tu,bu)}setViewOffset(e,t,r,i,a,n){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=i,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Qs*.5*this.fov)/this.zoom,r=2*t,i=this.aspect*r,a=-.5*i,n=this.view;if(this.view!==null&&this.view.enabled){let o=n.fullWidth,l=n.fullHeight;a+=n.offsetX*i/o,t-=n.offsetY*r/l,i*=n.width/o,r*=n.height/l}let s=this.filmOffset;s!==0&&(a+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+i,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Gi=-90,Wi=1,zf=class extends Wt{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new or(Gi,Wi,e,t);i.layers=this.layers,this.add(i);let a=new or(Gi,Wi,e,t);a.layers=this.layers,this.add(a);let n=new or(Gi,Wi,e,t);n.layers=this.layers,this.add(n);let s=new or(Gi,Wi,e,t);s.layers=this.layers,this.add(s);let o=new or(Gi,Wi,e,t);o.layers=this.layers,this.add(o);let l=new or(Gi,Wi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[r,i,a,n,s,o]=t;for(let l of t)this.remove(l);if(e===Lr)r.up.set(0,1,0),r.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),n.up.set(0,0,1),n.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===ts)r.up.set(0,-1,0),r.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),n.up.set(0,0,-1),n.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:r,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,n,s,o,l,c]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let v=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,i),e.render(t,a),e.setRenderTarget(r,1,i),e.render(t,n),e.setRenderTarget(r,2,i),e.render(t,s),e.setRenderTarget(r,3,i),e.render(t,o),e.setRenderTarget(r,4,i),e.render(t,l),r.texture.generateMipmaps=v,e.setRenderTarget(r,5,i),e.render(t,c),e.setRenderTarget(u,h,d),e.xr.enabled=p,r.texture.needsPMREMUpdate=!0}},zh=class extends cr{constructor(e,t,r,i,a,n,s,o,l,c){e=e!==void 0?e:[],t=t!==void 0?t:aa,super(e,t,r,i,a,n,s,o,l,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},kf=class extends Ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let r={width:e,height:e,depth:1},i=[r,r,r,r,r,r];this.texture=new zh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:xr}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ka(5,5,5),a=new Qr({name:"CubemapFromEquirect",uniforms:la(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Vt,blending:Zr});a.uniforms.tEquirect.value=t;let n=new ct(i,a),s=t.minFilter;return t.minFilter===Mi&&(t.minFilter=xr),new zf(1,10,this).update(e,n),t.minFilter=s,n.geometry.dispose(),n.material.dispose(),this}clear(e,t,r,i){let a=e.getRenderTarget();for(let n=0;n<6;n++)e.setRenderTarget(this,n),e.clear(t,r,i);e.setRenderTarget(a)}},Mo=new N,Bf=new N,Hf=new We,gi=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,i){return this.normal.set(e,t,r),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){let i=Mo.subVectors(r,t).cross(Bf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let r=e.delta(Mo),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return a<0||a>1?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let r=t||Hf.getNormalMatrix(e),i=this.coplanarPoint(Mo).applyMatrix4(e),a=this.normal.applyMatrix3(r).normalize();return this.constant=-i.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},pi=new Dl,Fn=new N,Nl=class{constructor(e=new gi,t=new gi,r=new gi,i=new gi,a=new gi,n=new gi){this.planes=[e,t,r,i,a,n]}set(e,t,r,i,a,n){let s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(r),s[3].copy(i),s[4].copy(a),s[5].copy(n),this}copy(e){let t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=Lr){let r=this.planes,i=e.elements,a=i[0],n=i[1],s=i[2],o=i[3],l=i[4],c=i[5],u=i[6],h=i[7],d=i[8],p=i[9],v=i[10],g=i[11],m=i[12],f=i[13],b=i[14],M=i[15];if(r[0].setComponents(o-a,h-l,g-d,M-m).normalize(),r[1].setComponents(o+a,h+l,g+d,M+m).normalize(),r[2].setComponents(o+n,h+c,g+p,M+f).normalize(),r[3].setComponents(o-n,h-c,g-p,M-f).normalize(),r[4].setComponents(o-s,h-u,g-v,M-b).normalize(),t===Lr)r[5].setComponents(o+s,h+u,g+v,M+b).normalize();else if(t===ts)r[5].setComponents(s,u,v,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(e){return pi.center.set(0,0,0),pi.radius=.7071067811865476,pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(e){let t=this.planes,r=e.center,i=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(r)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let r=0;r<6;r++){let i=t[r];if(Fn.x=i.normal.x>0?e.max.x:e.min.x,Fn.y=i.normal.y>0?e.max.y:e.min.y,Fn.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Fn)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function kh(){let e=null,t=!1,r=null,i=null;function a(n,s){r(n,s),i=e.requestAnimationFrame(a)}return{start:function(){t!==!0&&r!==null&&(i=e.requestAnimationFrame(a),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(n){r=n},setContext:function(n){e=n}}}function Vf(e){let t=new WeakMap;function r(o,l){let c=o.array,u=o.usage,h=c.byteLength,d=e.createBuffer();e.bindBuffer(l,d),e.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=e.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=e.HALF_FLOAT:p=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=e.SHORT;else if(c instanceof Uint32Array)p=e.UNSIGNED_INT;else if(c instanceof Int32Array)p=e.INT;else if(c instanceof Int8Array)p=e.BYTE;else if(c instanceof Uint8Array)p=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){let u=l.array,h=l.updateRanges;if(e.bindBuffer(c,o),h.length===0)e.bufferSubData(c,0,u);else{h.sort((p,v)=>p.start-v.start);let d=0;for(let p=1;p<h.length;p++){let v=h[d],g=h[p];g.start<=v.start+v.count+1?v.count=Math.max(v.count,g.start+g.count-v.start):(++d,h[d]=g)}h.length=d+1;for(let p=0,v=h.length;p<v;p++){let g=h[p];e.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,r(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:a,remove:n,update:s}}var Nr=class Bh extends $t{constructor(t=1,r=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:r,widthSegments:i,heightSegments:a};let n=t/2,s=r/2,o=Math.floor(i),l=Math.floor(a),c=o+1,u=l+1,h=t/o,d=r/l,p=[],v=[],g=[],m=[];for(let f=0;f<u;f++){let b=f*d-s;for(let M=0;M<c;M++){let C=M*h-n;v.push(C,-b,0),g.push(0,0,1),m.push(M/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<o;b++){let M=b+c*f,C=b+c*(f+1),G=b+1+c*(f+1),S=b+1+c*f;p.push(M,C,S),p.push(C,G,S)}this.setIndex(p),this.setAttribute("position",new vt(v,3)),this.setAttribute("normal",new vt(g,3)),this.setAttribute("uv",new vt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bh(t.width,t.height,t.widthSegments,t.heightSegments)}},Gf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$f=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,em=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,im=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,om=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,um=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_m=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xm="gl_FragColor = linearToOutputTexel( gl_FragColor );",ym=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Sm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Em=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Am=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Lm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Dm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Um=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Im=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Om=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,km=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Wm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ym=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Zm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Km=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$m=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,eg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ig=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ag=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ng=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,og=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ug=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_g=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Eg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Tg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,wg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ag=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Dg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ug=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ng=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ig=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Og=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Vg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Kg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,t0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,r0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,i0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,o0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,c0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,u0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,p0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,v0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,x0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,y0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,M0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Gf,alphahash_pars_fragment:Wf,alphamap_fragment:Xf,alphamap_pars_fragment:jf,alphatest_fragment:qf,alphatest_pars_fragment:Yf,aomap_fragment:Zf,aomap_pars_fragment:Jf,batching_pars_vertex:Kf,batching_vertex:$f,begin_vertex:Qf,beginnormal_vertex:em,bsdfs:tm,iridescence_fragment:rm,bumpmap_pars_fragment:im,clipping_planes_fragment:am,clipping_planes_pars_fragment:nm,clipping_planes_pars_vertex:sm,clipping_planes_vertex:om,color_fragment:lm,color_pars_fragment:cm,color_pars_vertex:um,color_vertex:hm,common:dm,cube_uv_reflection_fragment:pm,defaultnormal_vertex:fm,displacementmap_pars_vertex:mm,displacementmap_vertex:gm,emissivemap_fragment:vm,emissivemap_pars_fragment:_m,colorspace_fragment:xm,colorspace_pars_fragment:ym,envmap_fragment:Mm,envmap_common_pars_fragment:Sm,envmap_pars_fragment:Em,envmap_pars_vertex:bm,envmap_physical_pars_fragment:Im,envmap_vertex:Tm,fog_vertex:wm,fog_pars_vertex:Am,fog_fragment:Cm,fog_pars_fragment:Rm,gradientmap_pars_fragment:Pm,lightmap_pars_fragment:Lm,lights_lambert_fragment:Dm,lights_lambert_pars_fragment:Um,lights_pars_begin:Nm,lights_toon_fragment:Om,lights_toon_pars_fragment:Fm,lights_phong_fragment:zm,lights_phong_pars_fragment:km,lights_physical_fragment:Bm,lights_physical_pars_fragment:Hm,lights_fragment_begin:Vm,lights_fragment_maps:Gm,lights_fragment_end:Wm,logdepthbuf_fragment:Xm,logdepthbuf_pars_fragment:jm,logdepthbuf_pars_vertex:qm,logdepthbuf_vertex:Ym,map_fragment:Zm,map_pars_fragment:Jm,map_particle_fragment:Km,map_particle_pars_fragment:$m,metalnessmap_fragment:Qm,metalnessmap_pars_fragment:eg,morphinstance_vertex:tg,morphcolor_vertex:rg,morphnormal_vertex:ig,morphtarget_pars_vertex:ag,morphtarget_vertex:ng,normal_fragment_begin:sg,normal_fragment_maps:og,normal_pars_fragment:lg,normal_pars_vertex:cg,normal_vertex:ug,normalmap_pars_fragment:hg,clearcoat_normal_fragment_begin:dg,clearcoat_normal_fragment_maps:pg,clearcoat_pars_fragment:fg,iridescence_pars_fragment:mg,opaque_fragment:gg,packing:vg,premultiplied_alpha_fragment:_g,project_vertex:xg,dithering_fragment:yg,dithering_pars_fragment:Mg,roughnessmap_fragment:Sg,roughnessmap_pars_fragment:Eg,shadowmap_pars_fragment:bg,shadowmap_pars_vertex:Tg,shadowmap_vertex:wg,shadowmask_pars_fragment:Ag,skinbase_vertex:Cg,skinning_pars_vertex:Rg,skinning_vertex:Pg,skinnormal_vertex:Lg,specularmap_fragment:Dg,specularmap_pars_fragment:Ug,tonemapping_fragment:Ng,tonemapping_pars_fragment:Ig,transmission_fragment:Og,transmission_pars_fragment:Fg,uv_pars_fragment:zg,uv_pars_vertex:kg,uv_vertex:Bg,worldpos_vertex:Hg,background_vert:Vg,background_frag:Gg,backgroundCube_vert:Wg,backgroundCube_frag:Xg,cube_vert:jg,cube_frag:qg,depth_vert:Yg,depth_frag:Zg,distanceRGBA_vert:Jg,distanceRGBA_frag:Kg,equirect_vert:$g,equirect_frag:Qg,linedashed_vert:e0,linedashed_frag:t0,meshbasic_vert:r0,meshbasic_frag:i0,meshlambert_vert:a0,meshlambert_frag:n0,meshmatcap_vert:s0,meshmatcap_frag:o0,meshnormal_vert:l0,meshnormal_frag:c0,meshphong_vert:u0,meshphong_frag:h0,meshphysical_vert:d0,meshphysical_frag:p0,meshtoon_vert:f0,meshtoon_frag:m0,points_vert:g0,points_frag:v0,shadow_vert:_0,shadow_frag:x0,sprite_vert:y0,sprite_frag:M0},fe={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},gr={basic:{uniforms:zt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:zt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:zt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:zt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:zt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:zt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:zt([fe.points,fe.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:zt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:zt([fe.common,fe.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:zt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:zt([fe.sprite,fe.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:zt([fe.common,fe.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:zt([fe.lights,fe.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};gr.physical={uniforms:zt([gr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};var zn={r:0,b:0,g:0},fi=new bi,S0=new ut;function E0(e,t,r,i,a,n,s){let o=new qe(0),l=n===!0?0:1,c,u,h=null,d=0,p=null;function v(b){let M=b.isScene===!0?b.background:null;return M&&M.isTexture&&(M=(b.backgroundBlurriness>0?r:t).get(M)),M}function g(b){let M=!1,C=v(b);C===null?f(o,l):C&&C.isColor&&(f(C,1),M=!0);let G=e.xr.getEnvironmentBlendMode();G==="additive"?i.buffers.color.setClear(0,0,0,1,s):G==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(e.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function m(b,M){let C=v(M);C&&(C.isCubeTexture||C.mapping===is)?(u===void 0&&(u=new ct(new Ka(1,1,1),new Qr({name:"BackgroundCubeMaterial",uniforms:la(gr.backgroundCube.uniforms),vertexShader:gr.backgroundCube.vertexShader,fragmentShader:gr.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(G,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(u)),fi.copy(M.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(S0.makeRotationFromEuler(fi)),u.material.toneMapped=Ke.getTransfer(C.colorSpace)!==at,(h!==C||d!==C.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,p=e.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new ct(new Nr(2,2),new Qr({name:"BackgroundMaterial",uniforms:la(gr.background.uniforms),vertexShader:gr.background.vertexShader,fragmentShader:gr.background.fragmentShader,side:$r,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Ke.getTransfer(C.colorSpace)!==at,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||p!==e.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,p=e.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,M){b.getRGB(zn,Oh(e)),i.buffers.color.setClear(zn.r,zn.g,zn.b,M,s)}return{getClearColor:function(){return o},setClearColor:function(b,M=1){o.set(b),l=M,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(o,l)},render:g,addToRenderList:m}}function b0(e,t){let r=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},a=d(null),n=a,s=!1;function o(E,U,H,Y,Z){let re=!1,$=h(Y,H,U);n!==$&&(n=$,c(n.object)),re=p(E,Y,H,Z),re&&v(E,Y,H,Z),Z!==null&&t.update(Z,e.ELEMENT_ARRAY_BUFFER),(re||s)&&(s=!1,C(E,U,H,Y),Z!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(Z).buffer))}function l(){return e.createVertexArray()}function c(E){return e.bindVertexArray(E)}function u(E){return e.deleteVertexArray(E)}function h(E,U,H){let Y=H.wireframe===!0,Z=i[E.id];Z===void 0&&(Z={},i[E.id]=Z);let re=Z[U.id];re===void 0&&(re={},Z[U.id]=re);let $=re[Y];return $===void 0&&($=d(l()),re[Y]=$),$}function d(E){let U=[],H=[],Y=[];for(let Z=0;Z<r;Z++)U[Z]=0,H[Z]=0,Y[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:H,attributeDivisors:Y,object:E,attributes:{},index:null}}function p(E,U,H,Y){let Z=n.attributes,re=U.attributes,$=0,oe=H.getAttributes();for(let Q in oe)if(oe[Q].location>=0){let he=Z[Q],_e=re[Q];if(_e===void 0&&(Q==="instanceMatrix"&&E.instanceMatrix&&(_e=E.instanceMatrix),Q==="instanceColor"&&E.instanceColor&&(_e=E.instanceColor)),he===void 0||he.attribute!==_e||_e&&he.data!==_e.data)return!0;$++}return n.attributesNum!==$||n.index!==Y}function v(E,U,H,Y){let Z={},re=U.attributes,$=0,oe=H.getAttributes();for(let Q in oe)if(oe[Q].location>=0){let he=re[Q];he===void 0&&(Q==="instanceMatrix"&&E.instanceMatrix&&(he=E.instanceMatrix),Q==="instanceColor"&&E.instanceColor&&(he=E.instanceColor));let _e={};_e.attribute=he,he&&he.data&&(_e.data=he.data),Z[Q]=_e,$++}n.attributes=Z,n.attributesNum=$,n.index=Y}function g(){let E=n.newAttributes;for(let U=0,H=E.length;U<H;U++)E[U]=0}function m(E){f(E,0)}function f(E,U){let H=n.newAttributes,Y=n.enabledAttributes,Z=n.attributeDivisors;H[E]=1,Y[E]===0&&(e.enableVertexAttribArray(E),Y[E]=1),Z[E]!==U&&(e.vertexAttribDivisor(E,U),Z[E]=U)}function b(){let E=n.newAttributes,U=n.enabledAttributes;for(let H=0,Y=U.length;H<Y;H++)U[H]!==E[H]&&(e.disableVertexAttribArray(H),U[H]=0)}function M(E,U,H,Y,Z,re,$){$===!0?e.vertexAttribIPointer(E,U,H,Z,re):e.vertexAttribPointer(E,U,H,Y,Z,re)}function C(E,U,H,Y){g();let Z=Y.attributes,re=H.getAttributes(),$=U.defaultAttributeValues;for(let oe in re){let Q=re[oe];if(Q.location>=0){let he=Z[oe];if(he===void 0&&(oe==="instanceMatrix"&&E.instanceMatrix&&(he=E.instanceMatrix),oe==="instanceColor"&&E.instanceColor&&(he=E.instanceColor)),he!==void 0){let _e=he.normalized,Be=he.itemSize,De=t.get(he);if(De===void 0)continue;let J=De.buffer,pe=De.type,Te=De.bytesPerElement,Re=pe===e.INT||pe===e.UNSIGNED_INT||he.gpuType===wl;if(he.isInterleavedBufferAttribute){let me=he.data,Ne=me.stride,it=he.offset;if(me.isInstancedInterleavedBuffer){for(let je=0;je<Q.locationSize;je++)f(Q.location+je,me.meshPerAttribute);E.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let je=0;je<Q.locationSize;je++)m(Q.location+je);e.bindBuffer(e.ARRAY_BUFFER,J);for(let je=0;je<Q.locationSize;je++)M(Q.location+je,Be/Q.locationSize,pe,_e,Ne*Te,(it+Be/Q.locationSize*je)*Te,Re)}else{if(he.isInstancedBufferAttribute){for(let me=0;me<Q.locationSize;me++)f(Q.location+me,he.meshPerAttribute);E.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let me=0;me<Q.locationSize;me++)m(Q.location+me);e.bindBuffer(e.ARRAY_BUFFER,J);for(let me=0;me<Q.locationSize;me++)M(Q.location+me,Be/Q.locationSize,pe,_e,Be*Te,Be/Q.locationSize*me*Te,Re)}}else if($!==void 0){let _e=$[oe];if(_e!==void 0)switch(_e.length){case 2:e.vertexAttrib2fv(Q.location,_e);break;case 3:e.vertexAttrib3fv(Q.location,_e);break;case 4:e.vertexAttrib4fv(Q.location,_e);break;default:e.vertexAttrib1fv(Q.location,_e)}}}}b()}function G(){k();for(let E in i){let U=i[E];for(let H in U){let Y=U[H];for(let Z in Y)u(Y[Z].object),delete Y[Z];delete U[H]}delete i[E]}}function S(E){if(i[E.id]===void 0)return;let U=i[E.id];for(let H in U){let Y=U[H];for(let Z in Y)u(Y[Z].object),delete Y[Z];delete U[H]}delete i[E.id]}function A(E){for(let U in i){let H=i[U];if(H[E.id]===void 0)continue;let Y=H[E.id];for(let Z in Y)u(Y[Z].object),delete Y[Z];delete H[E.id]}}function k(){y(),s=!0,n!==a&&(n=a,c(n.object))}function y(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:k,resetDefaultState:y,dispose:G,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:g,enableAttribute:m,disableUnusedAttributes:b}}function T0(e,t,r){let i;function a(c){i=c}function n(c,u){e.drawArrays(i,c,u),r.update(u,i,1)}function s(c,u,h){h!==0&&(e.drawArraysInstanced(i,c,u,h),r.update(u,i,h))}function o(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let d=0;for(let p=0;p<h;p++)d+=u[p];r.update(d,i,1)}function l(c,u,h,d){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)s(c[v],u[v],d[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let v=0;for(let g=0;g<h;g++)v+=u[g]*d[g];r.update(v,i,1)}}this.setMode=a,this.render=n,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function w0(e,t,r,i){let a;function n(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");a=e.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(A){return!(A!==lr&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let k=A===Za&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Ur&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Pr&&!k)}function l(A){if(A==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=r.precision!==void 0?r.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=r.logarithmicDepthBuffer===!0,d=r.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),v=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),f=e.getParameter(e.MAX_VERTEX_ATTRIBS),b=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),C=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),G=v>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:v,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:C,vertexTextures:G,maxSamples:S}}function A0(e){let t=this,r=null,i=0,a=!1,n=!1,s=new gi,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||i!==0||a;return a=d,i=h.length,p},this.beginShadows=function(){n=!0,u(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(h,d){r=u(h,d,0)},this.setState=function(h,d,p){let v=h.clippingPlanes,g=h.clipIntersection,m=h.clipShadows,f=e.get(h);if(!a||v===null||v.length===0||n&&!m)n?u(null):c();else{let b=n?0:i,M=b*4,C=f.clippingState||null;l.value=C,C=u(v,d,M,p);for(let G=0;G!==M;++G)C[G]=r[G];f.clippingState=C,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==r&&(l.value=r,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,d,p,v){let g=h!==null?h.length:0,m=null;if(g!==0){if(m=l.value,v!==!0||m===null){let f=p+g*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,C=p;M!==g;++M,C+=4)s.copy(h[M]).applyMatrix4(b,o),s.normal.toArray(m,C),m[C+3]=s.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function C0(e){let t=new WeakMap;function r(s,o){return o===Go?s.mapping=aa:o===Wo&&(s.mapping=na),s}function i(s){if(s&&s.isTexture){let o=s.mapping;if(o===Go||o===Wo)if(t.has(s)){let l=t.get(s).texture;return r(l,s.mapping)}else{let l=s.image;if(l&&l.height>0){let c=new kf(l.height);return c.fromEquirectangularTexture(e,s),t.set(s,c),s.addEventListener("dispose",a),r(c.texture,s.mapping)}else return null}}return s}function a(s){let o=s.target;o.removeEventListener("dispose",a);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function n(){t=new WeakMap}return{get:i,dispose:n}}var pa=class extends Fh{constructor(e=-1,t=1,r=1,i=-1,a=.1,n=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=i,this.near=a,this.far=n,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,i,a,n){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=i,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,i=(this.top+this.bottom)/2,a=r-e,n=r+e,s=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,n=a+l*this.view.width,s-=c*this.view.offsetY,o=s-c*this.view.height}this.projectionMatrix.makeOrthographic(a,n,s,o,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Qi=4,wu=[.125,.215,.35,.446,.526,.582],xi=20,So=new pa,Au=new qe,Eo=null,bo=0,To=0,wo=!1,vi=(1+Math.sqrt(5))/2,Xi=1/vi,Cu=[new N(-vi,Xi,0),new N(vi,Xi,0),new N(-Xi,0,vi),new N(Xi,0,vi),new N(0,vi,-Xi),new N(0,vi,Xi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Ru=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,i=100){Eo=this._renderer.getRenderTarget(),bo=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,r,i,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Du(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Eo,bo,To),this._renderer.xr.enabled=wo,e.scissorTest=!1,kn(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===aa||e.mapping===na?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Eo=this._renderer.getRenderTarget(),bo=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:xr,minFilter:xr,generateMipmaps:!1,type:Za,format:lr,colorSpace:ca,depthBuffer:!1},i=Pu(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pu(e,t,r);let{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=R0(a)),this._blurMaterial=P0(a,e,t)}return i}_compileMaterial(e){let t=new ct(this._lodPlanes[0],e);this._renderer.compile(t,So)}_sceneToCubeUV(e,t,r,i){let a=new or(90,1,t,r),n=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],o=this._renderer,l=o.autoClear,c=o.toneMapping;o.getClearColor(Au),o.toneMapping=Jr,o.autoClear=!1;let u=new Nt({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),h=new ct(new Ka,u),d=!1,p=e.background;p?p.isColor&&(u.color.copy(p),e.background=null,d=!0):(u.color.copy(Au),d=!0);for(let v=0;v<6;v++){let g=v%3;g===0?(a.up.set(0,n[v],0),a.lookAt(s[v],0,0)):g===1?(a.up.set(0,0,n[v]),a.lookAt(0,s[v],0)):(a.up.set(0,n[v],0),a.lookAt(0,0,s[v]));let m=this._cubeSize;kn(i,g*m,v>2?m:0,m,m),o.setRenderTarget(i),d&&o.render(h,a),o.render(e,a)}h.geometry.dispose(),h.material.dispose(),o.toneMapping=c,o.autoClear=l,e.background=p}_textureToCubeUV(e,t){let r=this._renderer,i=e.mapping===aa||e.mapping===na;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Du()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lu());let a=i?this._cubemapMaterial:this._equirectMaterial,n=new ct(this._lodPlanes[0],a),s=a.uniforms;s.envMap.value=e;let o=this._cubeSize;kn(t,0,0,3*o,2*o),r.setRenderTarget(t),r.render(n,So)}_applyPMREM(e){let t=this._renderer,r=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let a=1;a<i;a++){let n=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),s=Cu[(i-a-1)%Cu.length];this._blur(e,a-1,a,n,s)}t.autoClear=r}_blur(e,t,r,i,a){let n=this._pingPongRenderTarget;this._halfBlur(e,n,t,r,i,"latitudinal",a),this._halfBlur(n,e,r,r,i,"longitudinal",a)}_halfBlur(e,t,r,i,a,n,s){let o=this._renderer,l=this._blurMaterial;n!=="latitudinal"&&n!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let c=3,u=new ct(this._lodPlanes[i],l),h=l.uniforms,d=this._sizeLods[r]-1,p=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*xi-1),v=a/p,g=isFinite(a)?1+Math.floor(c*v):xi;g>xi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${xi}`);let m=[],f=0;for(let S=0;S<xi;++S){let A=S/v,k=Math.exp(-A*A/2);m.push(k),S===0?f+=k:S<g&&(f+=2*k)}for(let S=0;S<m.length;S++)m[S]=m[S]/f;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=m,h.latitudinal.value=n==="latitudinal",s&&(h.poleAxis.value=s);let{_lodMax:b}=this;h.dTheta.value=p,h.mipInt.value=b-r;let M=this._sizeLods[i],C=3*M*(i>b-Qi?i-b+Qi:0),G=4*(this._cubeSize-M);kn(t,C,G,3*M,2*M),o.setRenderTarget(t),o.render(u,So)}};function R0(e){let t=[],r=[],i=[],a=e,n=e-Qi+1+wu.length;for(let s=0;s<n;s++){let o=Math.pow(2,a);r.push(o);let l=1/o;s>e-Qi?l=wu[s-e+Qi-1]:s===0&&(l=0),i.push(l);let c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,v=6,g=3,m=2,f=1,b=new Float32Array(g*v*p),M=new Float32Array(m*v*p),C=new Float32Array(f*v*p);for(let S=0;S<p;S++){let A=S%3*2/3-1,k=S>2?0:-1,y=[A,k,0,A+2/3,k,0,A+2/3,k+1,0,A,k,0,A+2/3,k+1,0,A,k+1,0];b.set(y,g*v*S),M.set(d,m*v*S);let E=[S,S,S,S,S,S];C.set(E,f*v*S)}let G=new $t;G.setAttribute("position",new Pt(b,g)),G.setAttribute("uv",new Pt(M,m)),G.setAttribute("faceIndex",new Pt(C,f)),t.push(G),a>Qi&&a--}return{lodPlanes:t,sizeLods:r,sigmas:i}}function Pu(e,t,r){let i=new Ei(e,t,r);return i.texture.mapping=is,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function kn(e,t,r,i,a){e.viewport.set(t,r,i,a),e.scissor.set(t,r,i,a)}function P0(e,t,r){let i=new Float32Array(xi),a=new N(0,1,0);return new Qr({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/r,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zr,depthTest:!1,depthWrite:!1})}function Lu(){return new Qr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zr,depthTest:!1,depthWrite:!1})}function Du(){return new Qr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zr,depthTest:!1,depthWrite:!1})}function Il(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function L0(e){let t=new WeakMap,r=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===Go||l===Wo,u=l===aa||l===na;if(c||u){let h=t.get(o),d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return r===null&&(r=new Ru(e)),h=c?r.fromEquirectangular(o,h):r.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{let p=o.image;return c&&p&&p.height>0||u&&p&&a(p)?(r===null&&(r=new Ru(e)),h=c?r.fromEquirectangular(o):r.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",n),h.texture):null}}}return o}function a(o){let l=0,c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function n(o){let l=o.target;l.removeEventListener("dispose",n);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function s(){t=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:s}}function D0(e){let t={};function r(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=e.getExtension(i)}return t[i]=a,a}return{has:function(i){return r(i)!==null},init:function(){r("EXT_color_buffer_float"),r("WEBGL_clip_cull_distance"),r("OES_texture_float_linear"),r("EXT_color_buffer_half_float"),r("WEBGL_multisampled_render_to_texture"),r("WEBGL_render_shared_exponent")},get:function(i){let a=r(i);return a===null&&Wa("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function U0(e,t,r,i){let a={},n=new WeakMap;function s(h){let d=h.target;d.index!==null&&t.remove(d.index);for(let v in d.attributes)t.remove(d.attributes[v]);for(let v in d.morphAttributes){let g=d.morphAttributes[v];for(let m=0,f=g.length;m<f;m++)t.remove(g[m])}d.removeEventListener("dispose",s),delete a[d.id];let p=n.get(d);p&&(t.remove(p),n.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,r.memory.geometries--}function o(h,d){return a[d.id]===!0||(d.addEventListener("dispose",s),a[d.id]=!0,r.memory.geometries++),d}function l(h){let d=h.attributes;for(let v in d)t.update(d[v],e.ARRAY_BUFFER);let p=h.morphAttributes;for(let v in p){let g=p[v];for(let m=0,f=g.length;m<f;m++)t.update(g[m],e.ARRAY_BUFFER)}}function c(h){let d=[],p=h.index,v=h.attributes.position,g=0;if(p!==null){let b=p.array;g=p.version;for(let M=0,C=b.length;M<C;M+=3){let G=b[M+0],S=b[M+1],A=b[M+2];d.push(G,S,S,A,A,G)}}else if(v!==void 0){let b=v.array;g=v.version;for(let M=0,C=b.length/3-1;M<C;M+=3){let G=M+0,S=M+1,A=M+2;d.push(G,S,S,A,A,G)}}else return;let m=new(bh(d)?Uh:Dh)(d,1);m.version=g;let f=n.get(h);f&&t.remove(f),n.set(h,m)}function u(h){let d=n.get(h);if(d){let p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return n.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function N0(e,t,r){let i;function a(d){i=d}let n,s;function o(d){n=d.type,s=d.bytesPerElement}function l(d,p){e.drawElements(i,p,n,d*s),r.update(p,i,1)}function c(d,p,v){v!==0&&(e.drawElementsInstanced(i,p,n,d*s,v),r.update(p,i,v))}function u(d,p,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,n,d,0,v);let g=0;for(let m=0;m<v;m++)g+=p[m];r.update(g,i,1)}function h(d,p,v,g){if(v===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/s,p[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,n,d,0,g,0,v);let f=0;for(let b=0;b<v;b++)f+=p[b]*g[b];r.update(f,i,1)}}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function I0(e){let t={geometries:0,textures:0},r={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,s,o){switch(r.calls++,s){case e.TRIANGLES:r.triangles+=o*(n/3);break;case e.LINES:r.lines+=o*(n/2);break;case e.LINE_STRIP:r.lines+=o*(n-1);break;case e.LINE_LOOP:r.lines+=o*n;break;case e.POINTS:r.points+=o*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function a(){r.calls=0,r.triangles=0,r.points=0,r.lines=0}return{memory:t,render:r,programs:null,autoReset:!0,reset:a,update:i}}function O0(e,t,r){let i=new WeakMap,a=new Mt;function n(s,o,l){let c=s.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,d=i.get(o);if(d===void 0||d.count!==h){let p=function(){k.dispose(),i.delete(o),o.removeEventListener("dispose",p)};d!==void 0&&d.texture.dispose();let v=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],C=0;v===!0&&(C=1),g===!0&&(C=2),m===!0&&(C=3);let G=o.attributes.position.count*C,S=1;G>t.maxTextureSize&&(S=Math.ceil(G/t.maxTextureSize),G=t.maxTextureSize);let A=new Float32Array(G*S*4*h),k=new Ah(A,G,S,h);k.type=Pr,k.needsUpdate=!0;let y=C*4;for(let E=0;E<h;E++){let U=f[E],H=b[E],Y=M[E],Z=G*S*4*E;for(let re=0;re<U.count;re++){let $=re*y;v===!0&&(a.fromBufferAttribute(U,re),A[Z+$+0]=a.x,A[Z+$+1]=a.y,A[Z+$+2]=a.z,A[Z+$+3]=0),g===!0&&(a.fromBufferAttribute(H,re),A[Z+$+4]=a.x,A[Z+$+5]=a.y,A[Z+$+6]=a.z,A[Z+$+7]=0),m===!0&&(a.fromBufferAttribute(Y,re),A[Z+$+8]=a.x,A[Z+$+9]=a.y,A[Z+$+10]=a.z,A[Z+$+11]=Y.itemSize===4?a.w:1)}}d={count:h,texture:k,size:new ve(G,S)},i.set(o,d),o.addEventListener("dispose",p)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",s.morphTexture,r);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];let v=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(e,"morphTargetBaseInfluence",v),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",d.texture,r),l.getUniforms().setValue(e,"morphTargetsTextureSize",d.size)}return{update:n}}function F0(e,t,r,i){let a=new WeakMap;function n(l){let c=i.render.frame,u=l.geometry,h=t.get(l,u);if(a.get(h)!==c&&(t.update(h),a.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),a.get(l)!==c&&(r.update(l.instanceMatrix,e.ARRAY_BUFFER),l.instanceColor!==null&&r.update(l.instanceColor,e.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return h}function s(){a=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),r.remove(c.instanceMatrix),c.instanceColor!==null&&r.remove(c.instanceColor)}return{update:n,dispose:s}}var Hh=class extends cr{constructor(e,t,r,i,a,n,s,o,l,c=ta){if(c!==ta&&c!==oa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&c===ta&&(r=Si),r===void 0&&c===oa&&(r=sa),super(null,i,a,n,s,o,c,r,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=s!==void 0?s:Gt,this.minFilter=o!==void 0?o:Gt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Vh=new cr,Uu=new Hh(1,1),Gh=new Ah,Wh=new Ef,Xh=new zh,Nu=[],Iu=[],Ou=new Float32Array(16),Fu=new Float32Array(9),zu=new Float32Array(4);function fa(e,t,r){let i=e[0];if(i<=0||i>0)return e;let a=t*r,n=Nu[a];if(n===void 0&&(n=new Float32Array(a),Nu[a]=n),t!==0){i.toArray(n,0);for(let s=1,o=0;s!==t;++s)o+=r,e[s].toArray(n,o)}return n}function Et(e,t){if(e.length!==t.length)return!1;for(let r=0,i=e.length;r<i;r++)if(e[r]!==t[r])return!1;return!0}function bt(e,t){for(let r=0,i=t.length;r<i;r++)e[r]=t[r]}function ns(e,t){let r=Iu[t];r===void 0&&(r=new Int32Array(t),Iu[t]=r);for(let i=0;i!==t;++i)r[i]=e.allocateTextureUnit();return r}function z0(e,t){let r=this.cache;r[0]!==t&&(e.uniform1f(this.addr,t),r[0]=t)}function k0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),r[0]=t.x,r[1]=t.y);else{if(Et(r,t))return;e.uniform2fv(this.addr,t),bt(r,t)}}function B0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),r[0]=t.x,r[1]=t.y,r[2]=t.z);else if(t.r!==void 0)(r[0]!==t.r||r[1]!==t.g||r[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),r[0]=t.r,r[1]=t.g,r[2]=t.b);else{if(Et(r,t))return;e.uniform3fv(this.addr,t),bt(r,t)}}function H0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z||r[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=t.w);else{if(Et(r,t))return;e.uniform4fv(this.addr,t),bt(r,t)}}function V0(e,t){let r=this.cache,i=t.elements;if(i===void 0){if(Et(r,t))return;e.uniformMatrix2fv(this.addr,!1,t),bt(r,t)}else{if(Et(r,i))return;zu.set(i),e.uniformMatrix2fv(this.addr,!1,zu),bt(r,i)}}function G0(e,t){let r=this.cache,i=t.elements;if(i===void 0){if(Et(r,t))return;e.uniformMatrix3fv(this.addr,!1,t),bt(r,t)}else{if(Et(r,i))return;Fu.set(i),e.uniformMatrix3fv(this.addr,!1,Fu),bt(r,i)}}function W0(e,t){let r=this.cache,i=t.elements;if(i===void 0){if(Et(r,t))return;e.uniformMatrix4fv(this.addr,!1,t),bt(r,t)}else{if(Et(r,i))return;Ou.set(i),e.uniformMatrix4fv(this.addr,!1,Ou),bt(r,i)}}function X0(e,t){let r=this.cache;r[0]!==t&&(e.uniform1i(this.addr,t),r[0]=t)}function j0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),r[0]=t.x,r[1]=t.y);else{if(Et(r,t))return;e.uniform2iv(this.addr,t),bt(r,t)}}function q0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),r[0]=t.x,r[1]=t.y,r[2]=t.z);else{if(Et(r,t))return;e.uniform3iv(this.addr,t),bt(r,t)}}function Y0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z||r[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=t.w);else{if(Et(r,t))return;e.uniform4iv(this.addr,t),bt(r,t)}}function Z0(e,t){let r=this.cache;r[0]!==t&&(e.uniform1ui(this.addr,t),r[0]=t)}function J0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),r[0]=t.x,r[1]=t.y);else{if(Et(r,t))return;e.uniform2uiv(this.addr,t),bt(r,t)}}function K0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),r[0]=t.x,r[1]=t.y,r[2]=t.z);else{if(Et(r,t))return;e.uniform3uiv(this.addr,t),bt(r,t)}}function $0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z||r[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=t.w);else{if(Et(r,t))return;e.uniform4uiv(this.addr,t),bt(r,t)}}function Q0(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a);let n;this.type===e.SAMPLER_2D_SHADOW?(Uu.compareFunction=Mh,n=Uu):n=Vh,r.setTexture2D(t||n,a)}function ev(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),r.setTexture3D(t||Wh,a)}function tv(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),r.setTextureCube(t||Xh,a)}function rv(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),r.setTexture2DArray(t||Gh,a)}function iv(e){switch(e){case 5126:return z0;case 35664:return k0;case 35665:return B0;case 35666:return H0;case 35674:return V0;case 35675:return G0;case 35676:return W0;case 5124:case 35670:return X0;case 35667:case 35671:return j0;case 35668:case 35672:return q0;case 35669:case 35673:return Y0;case 5125:return Z0;case 36294:return J0;case 36295:return K0;case 36296:return $0;case 35678:case 36198:case 36298:case 36306:case 35682:return Q0;case 35679:case 36299:case 36307:return ev;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return rv}}function av(e,t){e.uniform1fv(this.addr,t)}function nv(e,t){let r=fa(t,this.size,2);e.uniform2fv(this.addr,r)}function sv(e,t){let r=fa(t,this.size,3);e.uniform3fv(this.addr,r)}function ov(e,t){let r=fa(t,this.size,4);e.uniform4fv(this.addr,r)}function lv(e,t){let r=fa(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,r)}function cv(e,t){let r=fa(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,r)}function uv(e,t){let r=fa(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,r)}function hv(e,t){e.uniform1iv(this.addr,t)}function dv(e,t){e.uniform2iv(this.addr,t)}function pv(e,t){e.uniform3iv(this.addr,t)}function fv(e,t){e.uniform4iv(this.addr,t)}function mv(e,t){e.uniform1uiv(this.addr,t)}function gv(e,t){e.uniform2uiv(this.addr,t)}function vv(e,t){e.uniform3uiv(this.addr,t)}function _v(e,t){e.uniform4uiv(this.addr,t)}function xv(e,t,r){let i=this.cache,a=t.length,n=ns(r,a);Et(i,n)||(e.uniform1iv(this.addr,n),bt(i,n));for(let s=0;s!==a;++s)r.setTexture2D(t[s]||Vh,n[s])}function yv(e,t,r){let i=this.cache,a=t.length,n=ns(r,a);Et(i,n)||(e.uniform1iv(this.addr,n),bt(i,n));for(let s=0;s!==a;++s)r.setTexture3D(t[s]||Wh,n[s])}function Mv(e,t,r){let i=this.cache,a=t.length,n=ns(r,a);Et(i,n)||(e.uniform1iv(this.addr,n),bt(i,n));for(let s=0;s!==a;++s)r.setTextureCube(t[s]||Xh,n[s])}function Sv(e,t,r){let i=this.cache,a=t.length,n=ns(r,a);Et(i,n)||(e.uniform1iv(this.addr,n),bt(i,n));for(let s=0;s!==a;++s)r.setTexture2DArray(t[s]||Gh,n[s])}function Ev(e){switch(e){case 5126:return av;case 35664:return nv;case 35665:return sv;case 35666:return ov;case 35674:return lv;case 35675:return cv;case 35676:return uv;case 5124:case 35670:return hv;case 35667:case 35671:return dv;case 35668:case 35672:return pv;case 35669:case 35673:return fv;case 5125:return mv;case 36294:return gv;case 36295:return vv;case 36296:return _v;case 35678:case 36198:case 36298:case 36306:case 35682:return xv;case 35679:case 36299:case 36307:return yv;case 35680:case 36300:case 36308:case 36293:return Mv;case 36289:case 36303:case 36311:case 36292:return Sv}}var bv=class{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=iv(t.type)}},Tv=class{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ev(t.type)}},wv=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){let i=this.seq;for(let a=0,n=i.length;a!==n;++a){let s=i[a];s.setValue(e,t[s.id],r)}}},Ao=/(\w+)(\])?(\[|\.)?/g;function ku(e,t){e.seq.push(t),e.map[t.id]=t}function Av(e,t,r){let i=e.name,a=i.length;for(Ao.lastIndex=0;;){let n=Ao.exec(i),s=Ao.lastIndex,o=n[1],l=n[2]==="]",c=n[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===a){ku(r,c===void 0?new bv(o,e,t):new Tv(o,e,t));break}else{let u=r.map[o];u===void 0&&(u=new wv(o),ku(r,u)),r=u}}}var Qn=class{constructor(e,t){this.seq=[],this.map={};let r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<r;++i){let a=e.getActiveUniform(t,i),n=e.getUniformLocation(t,a.name);Av(a,n,this)}}setValue(e,t,r,i){let a=this.map[t];a!==void 0&&a.setValue(e,r,i)}setOptional(e,t,r){let i=t[r];i!==void 0&&this.setValue(e,r,i)}static upload(e,t,r,i){for(let a=0,n=t.length;a!==n;++a){let s=t[a],o=r[s.id];o.needsUpdate!==!1&&s.setValue(e,o.value,i)}}static seqWithValue(e,t){let r=[];for(let i=0,a=e.length;i!==a;++i){let n=e[i];n.id in t&&r.push(n)}return r}};function Bu(e,t,r){let i=e.createShader(t);return e.shaderSource(i,r),e.compileShader(i),i}var Cv=37297,Rv=0;function Pv(e,t){let r=e.split(`
`),i=[],a=Math.max(t-6,0),n=Math.min(t+6,r.length);for(let s=a;s<n;s++){let o=s+1;i.push(`${o===t?">":" "} ${o}: ${r[s]}`)}return i.join(`
`)}var Hu=new We;function Lv(e){Ke._getMatrix(Hu,Ke.workingColorSpace,e);let t=`mat3( ${Hu.elements.map(r=>r.toFixed(4))} )`;switch(Ke.getTransfer(e)){case as:return[t,"LinearTransferOETF"];case at:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Vu(e,t,r){let i=e.getShaderParameter(t,e.COMPILE_STATUS),a=e.getShaderInfoLog(t).trim();if(i&&a==="")return"";let n=/ERROR: 0:(\d+)/.exec(a);if(n){let s=parseInt(n[1]);return r.toUpperCase()+`

`+a+`

`+Pv(e.getShaderSource(t),s)}else return a}function Dv(e,t){let r=Lv(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${r[1]}( vec4( value.rgb * ${r[0]}, value.a ) );`,"}"].join(`
`)}function Uv(e,t){let r;switch(t){case Zp:r="Linear";break;case Jp:r="Reinhard";break;case Kp:r="Cineon";break;case $p:r="ACESFilmic";break;case ef:r="AgX";break;case tf:r="Neutral";break;case Qp:r="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),r="Linear"}return"vec3 "+e+"( vec3 color ) { return "+r+"ToneMapping( color ); }"}var Bn=new N;function Nv(){Ke.getLuminanceCoefficients(Bn);let e=Bn.x.toFixed(4),t=Bn.y.toFixed(4),r=Bn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${r} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Iv(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xa).join(`
`)}function Ov(e){let t=[];for(let r in e){let i=e[r];i!==!1&&t.push("#define "+r+" "+i)}return t.join(`
`)}function Fv(e,t){let r={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){let n=e.getActiveAttrib(t,a),s=n.name,o=1;n.type===e.FLOAT_MAT2&&(o=2),n.type===e.FLOAT_MAT3&&(o=3),n.type===e.FLOAT_MAT4&&(o=4),r[s]={type:n.type,location:e.getAttribLocation(t,s),locationSize:o}}return r}function Xa(e){return e!==""}function Gu(e,t){let r=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,r).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Wu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var zv=/^[ \t]*#include +<([\w\d./]+)>/gm;function El(e){return e.replace(zv,Bv)}var kv=new Map;function Bv(e,t){let r=Ve[t];if(r===void 0){let i=kv.get(t);if(i!==void 0)r=Ve[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return El(r)}var Hv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xu(e){return e.replace(Hv,Vv)}function Vv(e,t,r,i){let a="";for(let n=parseInt(t);n<parseInt(r);n++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function ju(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Gv(e){let t="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===oh?t="SHADOWMAP_TYPE_PCF":e.shadowMapType===Cp?t="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===Cr&&(t="SHADOWMAP_TYPE_VSM"),t}function Wv(e){let t="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case aa:case na:t="ENVMAP_TYPE_CUBE";break;case is:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Xv(e){let t="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case na:t="ENVMAP_MODE_REFRACTION";break}return t}function jv(e){let t="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case lh:t="ENVMAP_BLENDING_MULTIPLY";break;case qp:t="ENVMAP_BLENDING_MIX";break;case Yp:t="ENVMAP_BLENDING_ADD";break}return t}function qv(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let r=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,r),7*16)),texelHeight:i,maxMip:r}}function Yv(e,t,r,i){let a=e.getContext(),n=r.defines,s=r.vertexShader,o=r.fragmentShader,l=Gv(r),c=Wv(r),u=Xv(r),h=jv(r),d=qv(r),p=Iv(r),v=Ov(n),g=a.createProgram(),m,f,b=r.glslVersion?"#version "+r.glslVersion+`
`:"";r.isRawShaderMaterial?(m=["#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v].filter(Xa).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v].filter(Xa).join(`
`),f.length>0&&(f+=`
`)):(m=[ju(r),"#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v,r.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",r.batching?"#define USE_BATCHING":"",r.batchingColor?"#define USE_BATCHING_COLOR":"",r.instancing?"#define USE_INSTANCING":"",r.instancingColor?"#define USE_INSTANCING_COLOR":"",r.instancingMorph?"#define USE_INSTANCING_MORPH":"",r.useFog&&r.fog?"#define USE_FOG":"",r.useFog&&r.fogExp2?"#define FOG_EXP2":"",r.map?"#define USE_MAP":"",r.envMap?"#define USE_ENVMAP":"",r.envMap?"#define "+u:"",r.lightMap?"#define USE_LIGHTMAP":"",r.aoMap?"#define USE_AOMAP":"",r.bumpMap?"#define USE_BUMPMAP":"",r.normalMap?"#define USE_NORMALMAP":"",r.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",r.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",r.displacementMap?"#define USE_DISPLACEMENTMAP":"",r.emissiveMap?"#define USE_EMISSIVEMAP":"",r.anisotropy?"#define USE_ANISOTROPY":"",r.anisotropyMap?"#define USE_ANISOTROPYMAP":"",r.clearcoatMap?"#define USE_CLEARCOATMAP":"",r.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",r.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",r.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",r.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",r.specularMap?"#define USE_SPECULARMAP":"",r.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",r.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",r.roughnessMap?"#define USE_ROUGHNESSMAP":"",r.metalnessMap?"#define USE_METALNESSMAP":"",r.alphaMap?"#define USE_ALPHAMAP":"",r.alphaHash?"#define USE_ALPHAHASH":"",r.transmission?"#define USE_TRANSMISSION":"",r.transmissionMap?"#define USE_TRANSMISSIONMAP":"",r.thicknessMap?"#define USE_THICKNESSMAP":"",r.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",r.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",r.mapUv?"#define MAP_UV "+r.mapUv:"",r.alphaMapUv?"#define ALPHAMAP_UV "+r.alphaMapUv:"",r.lightMapUv?"#define LIGHTMAP_UV "+r.lightMapUv:"",r.aoMapUv?"#define AOMAP_UV "+r.aoMapUv:"",r.emissiveMapUv?"#define EMISSIVEMAP_UV "+r.emissiveMapUv:"",r.bumpMapUv?"#define BUMPMAP_UV "+r.bumpMapUv:"",r.normalMapUv?"#define NORMALMAP_UV "+r.normalMapUv:"",r.displacementMapUv?"#define DISPLACEMENTMAP_UV "+r.displacementMapUv:"",r.metalnessMapUv?"#define METALNESSMAP_UV "+r.metalnessMapUv:"",r.roughnessMapUv?"#define ROUGHNESSMAP_UV "+r.roughnessMapUv:"",r.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+r.anisotropyMapUv:"",r.clearcoatMapUv?"#define CLEARCOATMAP_UV "+r.clearcoatMapUv:"",r.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+r.clearcoatNormalMapUv:"",r.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+r.clearcoatRoughnessMapUv:"",r.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+r.iridescenceMapUv:"",r.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+r.iridescenceThicknessMapUv:"",r.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+r.sheenColorMapUv:"",r.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+r.sheenRoughnessMapUv:"",r.specularMapUv?"#define SPECULARMAP_UV "+r.specularMapUv:"",r.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+r.specularColorMapUv:"",r.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+r.specularIntensityMapUv:"",r.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+r.transmissionMapUv:"",r.thicknessMapUv?"#define THICKNESSMAP_UV "+r.thicknessMapUv:"",r.vertexTangents&&r.flatShading===!1?"#define USE_TANGENT":"",r.vertexColors?"#define USE_COLOR":"",r.vertexAlphas?"#define USE_COLOR_ALPHA":"",r.vertexUv1s?"#define USE_UV1":"",r.vertexUv2s?"#define USE_UV2":"",r.vertexUv3s?"#define USE_UV3":"",r.pointsUvs?"#define USE_POINTS_UV":"",r.flatShading?"#define FLAT_SHADED":"",r.skinning?"#define USE_SKINNING":"",r.morphTargets?"#define USE_MORPHTARGETS":"",r.morphNormals&&r.flatShading===!1?"#define USE_MORPHNORMALS":"",r.morphColors?"#define USE_MORPHCOLORS":"",r.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+r.morphTextureStride:"",r.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+r.morphTargetsCount:"",r.doubleSided?"#define DOUBLE_SIDED":"",r.flipSided?"#define FLIP_SIDED":"",r.shadowMapEnabled?"#define USE_SHADOWMAP":"",r.shadowMapEnabled?"#define "+l:"",r.sizeAttenuation?"#define USE_SIZEATTENUATION":"",r.numLightProbes>0?"#define USE_LIGHT_PROBES":"",r.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",r.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xa).join(`
`),f=[ju(r),"#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v,r.useFog&&r.fog?"#define USE_FOG":"",r.useFog&&r.fogExp2?"#define FOG_EXP2":"",r.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",r.map?"#define USE_MAP":"",r.matcap?"#define USE_MATCAP":"",r.envMap?"#define USE_ENVMAP":"",r.envMap?"#define "+c:"",r.envMap?"#define "+u:"",r.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",r.lightMap?"#define USE_LIGHTMAP":"",r.aoMap?"#define USE_AOMAP":"",r.bumpMap?"#define USE_BUMPMAP":"",r.normalMap?"#define USE_NORMALMAP":"",r.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",r.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",r.emissiveMap?"#define USE_EMISSIVEMAP":"",r.anisotropy?"#define USE_ANISOTROPY":"",r.anisotropyMap?"#define USE_ANISOTROPYMAP":"",r.clearcoat?"#define USE_CLEARCOAT":"",r.clearcoatMap?"#define USE_CLEARCOATMAP":"",r.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",r.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",r.dispersion?"#define USE_DISPERSION":"",r.iridescence?"#define USE_IRIDESCENCE":"",r.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",r.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",r.specularMap?"#define USE_SPECULARMAP":"",r.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",r.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",r.roughnessMap?"#define USE_ROUGHNESSMAP":"",r.metalnessMap?"#define USE_METALNESSMAP":"",r.alphaMap?"#define USE_ALPHAMAP":"",r.alphaTest?"#define USE_ALPHATEST":"",r.alphaHash?"#define USE_ALPHAHASH":"",r.sheen?"#define USE_SHEEN":"",r.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",r.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",r.transmission?"#define USE_TRANSMISSION":"",r.transmissionMap?"#define USE_TRANSMISSIONMAP":"",r.thicknessMap?"#define USE_THICKNESSMAP":"",r.vertexTangents&&r.flatShading===!1?"#define USE_TANGENT":"",r.vertexColors||r.instancingColor||r.batchingColor?"#define USE_COLOR":"",r.vertexAlphas?"#define USE_COLOR_ALPHA":"",r.vertexUv1s?"#define USE_UV1":"",r.vertexUv2s?"#define USE_UV2":"",r.vertexUv3s?"#define USE_UV3":"",r.pointsUvs?"#define USE_POINTS_UV":"",r.gradientMap?"#define USE_GRADIENTMAP":"",r.flatShading?"#define FLAT_SHADED":"",r.doubleSided?"#define DOUBLE_SIDED":"",r.flipSided?"#define FLIP_SIDED":"",r.shadowMapEnabled?"#define USE_SHADOWMAP":"",r.shadowMapEnabled?"#define "+l:"",r.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",r.numLightProbes>0?"#define USE_LIGHT_PROBES":"",r.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",r.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",r.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",r.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",r.toneMapping!==Jr?"#define TONE_MAPPING":"",r.toneMapping!==Jr?Ve.tonemapping_pars_fragment:"",r.toneMapping!==Jr?Uv("toneMapping",r.toneMapping):"",r.dithering?"#define DITHERING":"",r.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Dv("linearToOutputTexel",r.outputColorSpace),Nv(),r.useDepthPacking?"#define DEPTH_PACKING "+r.depthPacking:"",`
`].filter(Xa).join(`
`)),s=El(s),s=Gu(s,r),s=Wu(s,r),o=El(o),o=Gu(o,r),o=Wu(o,r),s=Xu(s),o=Xu(o),r.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",r.glslVersion===nu?"":"layout(location = 0) out highp vec4 pc_fragColor;",r.glslVersion===nu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let M=b+m+s,C=b+f+o,G=Bu(a,a.VERTEX_SHADER,M),S=Bu(a,a.FRAGMENT_SHADER,C);a.attachShader(g,G),a.attachShader(g,S),r.index0AttributeName!==void 0?a.bindAttribLocation(g,0,r.index0AttributeName):r.morphTargets===!0&&a.bindAttribLocation(g,0,"position"),a.linkProgram(g);function A(U){if(e.debug.checkShaderErrors){let H=a.getProgramInfoLog(g).trim(),Y=a.getShaderInfoLog(G).trim(),Z=a.getShaderInfoLog(S).trim(),re=!0,$=!0;if(a.getProgramParameter(g,a.LINK_STATUS)===!1)if(re=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(a,g,G,S);else{let oe=Vu(a,G,"vertex"),Q=Vu(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(g,a.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+H+`
`+oe+`
`+Q)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(Y===""||Z==="")&&($=!1);$&&(U.diagnostics={runnable:re,programLog:H,vertexShader:{log:Y,prefix:m},fragmentShader:{log:Z,prefix:f}})}a.deleteShader(G),a.deleteShader(S),k=new Qn(a,g),y=Fv(a,g)}let k;this.getUniforms=function(){return k===void 0&&A(this),k};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let E=r.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=a.getProgramParameter(g,Cv)),E},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(g),this.program=void 0},this.type=r.shaderType,this.name=r.shaderName,this.id=Rv++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=G,this.fragmentShader=S,this}var Zv=0,Jv=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,r=e.fragmentShader,i=this._getShaderStage(t),a=this._getShaderStage(r),n=this._getShaderCacheForMaterial(e);return n.has(i)===!1&&(n.add(i),i.usedTimes++),n.has(a)===!1&&(n.add(a),a.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){let t=this.shaderCache,r=t.get(e);return r===void 0&&(r=new Kv(e),t.set(e,r)),r}},Kv=class{constructor(e){this.id=Zv++,this.code=e,this.usedTimes=0}};function $v(e,t,r,i,a,n,s){let o=new Ul,l=new Jv,c=new Set,u=[],h=a.logarithmicDepthBuffer,d=a.vertexTextures,p=a.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,E,U,H,Y){let Z=H.fog,re=Y.geometry,$=y.isMeshStandardMaterial?H.environment:null,oe=(y.isMeshStandardMaterial?r:t).get(y.envMap||$),Q=oe&&oe.mapping===is?oe.image.height:null,he=v[y.type];y.precision!==null&&(p=a.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let _e=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,Be=_e!==void 0?_e.length:0,De=0;re.morphAttributes.position!==void 0&&(De=1),re.morphAttributes.normal!==void 0&&(De=2),re.morphAttributes.color!==void 0&&(De=3);let J,pe,Te,Re;if(he){let Ge=gr[he];J=Ge.vertexShader,pe=Ge.fragmentShader}else J=y.vertexShader,pe=y.fragmentShader,l.update(y),Te=l.getVertexShaderID(y),Re=l.getFragmentShaderID(y);let me=e.getRenderTarget(),Ne=e.state.buffers.depth.getReversed(),it=Y.isInstancedMesh===!0,je=Y.isBatchedMesh===!0,Ye=!!y.map,_t=!!y.matcap,O=!!oe,mt=!!y.aoMap,$e=!!y.lightMap,et=!!y.bumpMap,ye=!!y.normalMap,tt=!!y.displacementMap,Pe=!!y.emissiveMap,Fe=!!y.metalnessMap,T=!!y.roughnessMap,_=y.anisotropy>0,B=y.clearcoat>0,ie=y.dispersion>0,se=y.iridescence>0,ee=y.sheen>0,Le=y.transmission>0,ge=_&&!!y.anisotropyMap,Me=B&&!!y.clearcoatMap,ze=B&&!!y.clearcoatNormalMap,de=B&&!!y.clearcoatRoughnessMap,w=se&&!!y.iridescenceMap,D=se&&!!y.iridescenceThicknessMap,L=ee&&!!y.sheenColorMap,z=ee&&!!y.sheenRoughnessMap,K=!!y.specularMap,te=!!y.specularColorMap,ue=!!y.specularIntensityMap,R=Le&&!!y.transmissionMap,j=Le&&!!y.thicknessMap,V=!!y.gradientMap,q=!!y.alphaMap,ne=y.alphaTest>0,ae=!!y.alphaHash,Ce=!!y.extensions,Xe=Jr;y.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(Xe=e.toneMapping);let Je={shaderID:he,shaderType:y.type,shaderName:y.name,vertexShader:J,fragmentShader:pe,defines:y.defines,customVertexShaderID:Te,customFragmentShaderID:Re,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:je,batchingColor:je&&Y._colorsTexture!==null,instancing:it,instancingColor:it&&Y.instanceColor!==null,instancingMorph:it&&Y.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:me===null?e.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:ca,alphaToCoverage:!!y.alphaToCoverage,map:Ye,matcap:_t,envMap:O,envMapMode:O&&oe.mapping,envMapCubeUVHeight:Q,aoMap:mt,lightMap:$e,bumpMap:et,normalMap:ye,displacementMap:d&&tt,emissiveMap:Pe,normalMapObjectSpace:ye&&y.normalMapType===sf,normalMapTangentSpace:ye&&y.normalMapType===yh,metalnessMap:Fe,roughnessMap:T,anisotropy:_,anisotropyMap:ge,clearcoat:B,clearcoatMap:Me,clearcoatNormalMap:ze,clearcoatRoughnessMap:de,dispersion:ie,iridescence:se,iridescenceMap:w,iridescenceThicknessMap:D,sheen:ee,sheenColorMap:L,sheenRoughnessMap:z,specularMap:K,specularColorMap:te,specularIntensityMap:ue,transmission:Le,transmissionMap:R,thicknessMap:j,gradientMap:V,opaque:y.transparent===!1&&y.blending===ea&&y.alphaToCoverage===!1,alphaMap:q,alphaTest:ne,alphaHash:ae,combine:y.combine,mapUv:Ye&&g(y.map.channel),aoMapUv:mt&&g(y.aoMap.channel),lightMapUv:$e&&g(y.lightMap.channel),bumpMapUv:et&&g(y.bumpMap.channel),normalMapUv:ye&&g(y.normalMap.channel),displacementMapUv:tt&&g(y.displacementMap.channel),emissiveMapUv:Pe&&g(y.emissiveMap.channel),metalnessMapUv:Fe&&g(y.metalnessMap.channel),roughnessMapUv:T&&g(y.roughnessMap.channel),anisotropyMapUv:ge&&g(y.anisotropyMap.channel),clearcoatMapUv:Me&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:ze&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:w&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:D&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:L&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:z&&g(y.sheenRoughnessMap.channel),specularMapUv:K&&g(y.specularMap.channel),specularColorMapUv:te&&g(y.specularColorMap.channel),specularIntensityMapUv:ue&&g(y.specularIntensityMap.channel),transmissionMapUv:R&&g(y.transmissionMap.channel),thicknessMapUv:j&&g(y.thicknessMap.channel),alphaMapUv:q&&g(y.alphaMap.channel),vertexTangents:!!re.attributes.tangent&&(ye||_),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,pointsUvs:Y.isPoints===!0&&!!re.attributes.uv&&(Ye||q),fog:!!Z,useFog:y.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ne,skinning:Y.isSkinnedMesh===!0,morphTargets:re.morphAttributes.position!==void 0,morphNormals:re.morphAttributes.normal!==void 0,morphColors:re.morphAttributes.color!==void 0,morphTargetsCount:Be,morphTextureStride:De,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:e.shadowMap.enabled&&U.length>0,shadowMapType:e.shadowMap.type,toneMapping:Xe,decodeVideoTexture:Ye&&y.map.isVideoTexture===!0&&Ke.getTransfer(y.map.colorSpace)===at,decodeVideoTextureEmissive:Pe&&y.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(y.emissiveMap.colorSpace)===at,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Rr,flipSided:y.side===Vt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ce&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&y.extensions.multiDraw===!0||je)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Je.vertexUv1s=c.has(1),Je.vertexUv2s=c.has(2),Je.vertexUv3s=c.has(3),c.clear(),Je}function f(y){let E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(let U in y.defines)E.push(U),E.push(y.defines[U]);return y.isRawShaderMaterial===!1&&(b(E,y),M(E,y),E.push(e.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function b(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function M(y,E){o.disableAll(),E.supportsVertexTextures&&o.enable(0),E.instancing&&o.enable(1),E.instancingColor&&o.enable(2),E.instancingMorph&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),E.dispersion&&o.enable(20),E.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reverseDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),y.push(o.mask)}function C(y){let E=v[y.type],U;if(E){let H=gr[E];U=If.clone(H.uniforms)}else U=y.uniforms;return U}function G(y,E){let U;for(let H=0,Y=u.length;H<Y;H++){let Z=u[H];if(Z.cacheKey===E){U=Z,++U.usedTimes;break}}return U===void 0&&(U=new Yv(e,E,y,n),u.push(U)),U}function S(y){if(--y.usedTimes===0){let E=u.indexOf(y);u[E]=u[u.length-1],u.pop(),y.destroy()}}function A(y){l.remove(y)}function k(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:C,acquireProgram:G,releaseProgram:S,releaseShaderCache:A,programs:u,dispose:k}}function Qv(){let e=new WeakMap;function t(s){return e.has(s)}function r(s){let o=e.get(s);return o===void 0&&(o={},e.set(s,o)),o}function i(s){e.delete(s)}function a(s,o,l){e.get(s)[o]=l}function n(){e=new WeakMap}return{has:t,get:r,remove:i,update:a,dispose:n}}function e_(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function qu(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Yu(){let e=[],t=0,r=[],i=[],a=[];function n(){t=0,r.length=0,i.length=0,a.length=0}function s(h,d,p,v,g,m){let f=e[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:v,renderOrder:h.renderOrder,z:g,group:m},e[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=v,f.renderOrder=h.renderOrder,f.z=g,f.group=m),t++,f}function o(h,d,p,v,g,m){let f=s(h,d,p,v,g,m);p.transmission>0?i.push(f):p.transparent===!0?a.push(f):r.push(f)}function l(h,d,p,v,g,m){let f=s(h,d,p,v,g,m);p.transmission>0?i.unshift(f):p.transparent===!0?a.unshift(f):r.unshift(f)}function c(h,d){r.length>1&&r.sort(h||e_),i.length>1&&i.sort(d||qu),a.length>1&&a.sort(d||qu)}function u(){for(let h=t,d=e.length;h<d;h++){let p=e[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:r,transmissive:i,transparent:a,init:n,push:o,unshift:l,finish:u,sort:c}}function t_(){let e=new WeakMap;function t(i,a){let n=e.get(i),s;return n===void 0?(s=new Yu,e.set(i,[s])):a>=n.length?(s=new Yu,n.push(s)):s=n[a],s}function r(){e=new WeakMap}return{get:t,dispose:r}}function r_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let r;switch(t.type){case"DirectionalLight":r={direction:new N,color:new qe};break;case"SpotLight":r={position:new N,direction:new N,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":r={position:new N,color:new qe,distance:0,decay:0};break;case"HemisphereLight":r={direction:new N,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":r={color:new qe,position:new N,halfWidth:new N,halfHeight:new N};break}return e[t.id]=r,r}}}function i_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let r;switch(t.type){case"DirectionalLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"SpotLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"PointLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=r,r}}}var a_=0;function n_(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function s_(e){let t=new r_,r=i_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);let a=new N,n=new ut,s=new ut;function o(c){let u=0,h=0,d=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let p=0,v=0,g=0,m=0,f=0,b=0,M=0,C=0,G=0,S=0,A=0;c.sort(n_);for(let y=0,E=c.length;y<E;y++){let U=c[y],H=U.color,Y=U.intensity,Z=U.distance,re=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)u+=H.r*Y,h+=H.g*Y,d+=H.b*Y;else if(U.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(U.sh.coefficients[$],Y);A++}else if(U.isDirectionalLight){let $=t.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let oe=U.shadow,Q=r.get(U);Q.shadowIntensity=oe.intensity,Q.shadowBias=oe.bias,Q.shadowNormalBias=oe.normalBias,Q.shadowRadius=oe.radius,Q.shadowMapSize=oe.mapSize,i.directionalShadow[p]=Q,i.directionalShadowMap[p]=re,i.directionalShadowMatrix[p]=U.shadow.matrix,b++}i.directional[p]=$,p++}else if(U.isSpotLight){let $=t.get(U);$.position.setFromMatrixPosition(U.matrixWorld),$.color.copy(H).multiplyScalar(Y),$.distance=Z,$.coneCos=Math.cos(U.angle),$.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),$.decay=U.decay,i.spot[g]=$;let oe=U.shadow;if(U.map&&(i.spotLightMap[G]=U.map,G++,oe.updateMatrices(U),U.castShadow&&S++),i.spotLightMatrix[g]=oe.matrix,U.castShadow){let Q=r.get(U);Q.shadowIntensity=oe.intensity,Q.shadowBias=oe.bias,Q.shadowNormalBias=oe.normalBias,Q.shadowRadius=oe.radius,Q.shadowMapSize=oe.mapSize,i.spotShadow[g]=Q,i.spotShadowMap[g]=re,C++}g++}else if(U.isRectAreaLight){let $=t.get(U);$.color.copy(H).multiplyScalar(Y),$.halfWidth.set(U.width*.5,0,0),$.halfHeight.set(0,U.height*.5,0),i.rectArea[m]=$,m++}else if(U.isPointLight){let $=t.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),$.distance=U.distance,$.decay=U.decay,U.castShadow){let oe=U.shadow,Q=r.get(U);Q.shadowIntensity=oe.intensity,Q.shadowBias=oe.bias,Q.shadowNormalBias=oe.normalBias,Q.shadowRadius=oe.radius,Q.shadowMapSize=oe.mapSize,Q.shadowCameraNear=oe.camera.near,Q.shadowCameraFar=oe.camera.far,i.pointShadow[v]=Q,i.pointShadowMap[v]=re,i.pointShadowMatrix[v]=U.shadow.matrix,M++}i.point[v]=$,v++}else if(U.isHemisphereLight){let $=t.get(U);$.skyColor.copy(U.color).multiplyScalar(Y),$.groundColor.copy(U.groundColor).multiplyScalar(Y),i.hemi[f]=$,f++}}m>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=fe.LTC_FLOAT_1,i.rectAreaLTC2=fe.LTC_FLOAT_2):(i.rectAreaLTC1=fe.LTC_HALF_1,i.rectAreaLTC2=fe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;let k=i.hash;(k.directionalLength!==p||k.pointLength!==v||k.spotLength!==g||k.rectAreaLength!==m||k.hemiLength!==f||k.numDirectionalShadows!==b||k.numPointShadows!==M||k.numSpotShadows!==C||k.numSpotMaps!==G||k.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=g,i.rectArea.length=m,i.point.length=v,i.hemi.length=f,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=C,i.spotShadowMap.length=C,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=C+G-S,i.spotLightMap.length=G,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=A,k.directionalLength=p,k.pointLength=v,k.spotLength=g,k.rectAreaLength=m,k.hemiLength=f,k.numDirectionalShadows=b,k.numPointShadows=M,k.numSpotShadows=C,k.numSpotMaps=G,k.numLightProbes=A,i.version=a_++)}function l(c,u){let h=0,d=0,p=0,v=0,g=0,m=u.matrixWorldInverse;for(let f=0,b=c.length;f<b;f++){let M=c[f];if(M.isDirectionalLight){let C=i.directional[h];C.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(m),h++}else if(M.isSpotLight){let C=i.spot[p];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),C.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(m),p++}else if(M.isRectAreaLight){let C=i.rectArea[v];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),s.identity(),n.copy(M.matrixWorld),n.premultiply(m),s.extractRotation(n),C.halfWidth.set(M.width*.5,0,0),C.halfHeight.set(0,M.height*.5,0),C.halfWidth.applyMatrix4(s),C.halfHeight.applyMatrix4(s),v++}else if(M.isPointLight){let C=i.point[d];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){let C=i.hemi[g];C.direction.setFromMatrixPosition(M.matrixWorld),C.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:i}}function Zu(e){let t=new s_(e),r=[],i=[];function a(u){c.camera=u,r.length=0,i.length=0}function n(u){r.push(u)}function s(u){i.push(u)}function o(){t.setup(r)}function l(u){t.setupView(r,u)}let c={lightsArray:r,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:o,setupLightsView:l,pushLight:n,pushShadow:s}}function o_(e){let t=new WeakMap;function r(a,n=0){let s=t.get(a),o;return s===void 0?(o=new Zu(e),t.set(a,[o])):n>=s.length?(o=new Zu(e),s.push(o)):o=s[n],o}function i(){t=new WeakMap}return{get:r,dispose:i}}var l_=class extends da{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},c_=class extends da{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},u_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function d_(e,t,r){let i=new Nl,a=new ve,n=new ve,s=new Mt,o=new l_({depthPacking:nf}),l=new c_,c={},u=r.maxTextureSize,h={[$r]:Vt,[Vt]:$r,[Rr]:Rr},d=new Qr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ve},radius:{value:4}},vertexShader:u_,fragmentShader:h_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let v=new $t;v.setAttribute("position",new Pt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new ct(v,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oh;let f=this.type;this.render=function(S,A,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let y=e.getRenderTarget(),E=e.getActiveCubeFace(),U=e.getActiveMipmapLevel(),H=e.state;H.setBlending(Zr),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);let Y=f!==Cr&&this.type===Cr,Z=f===Cr&&this.type!==Cr;for(let re=0,$=S.length;re<$;re++){let oe=S[re],Q=oe.shadow;if(Q===void 0){console.warn("THREE.WebGLShadowMap:",oe,"has no shadow.");continue}if(Q.autoUpdate===!1&&Q.needsUpdate===!1)continue;a.copy(Q.mapSize);let he=Q.getFrameExtents();if(a.multiply(he),n.copy(Q.mapSize),(a.x>u||a.y>u)&&(a.x>u&&(n.x=Math.floor(u/he.x),a.x=n.x*he.x,Q.mapSize.x=n.x),a.y>u&&(n.y=Math.floor(u/he.y),a.y=n.y*he.y,Q.mapSize.y=n.y)),Q.map===null||Y===!0||Z===!0){let Be=this.type!==Cr?{minFilter:Gt,magFilter:Gt}:{};Q.map!==null&&Q.map.dispose(),Q.map=new Ei(a.x,a.y,Be),Q.map.texture.name=oe.name+".shadowMap",Q.camera.updateProjectionMatrix()}e.setRenderTarget(Q.map),e.clear();let _e=Q.getViewportCount();for(let Be=0;Be<_e;Be++){let De=Q.getViewport(Be);s.set(n.x*De.x,n.y*De.y,n.x*De.z,n.y*De.w),H.viewport(s),Q.updateMatrices(oe,Be),i=Q.getFrustum(),C(A,k,Q.camera,oe,this.type)}Q.isPointLightShadow!==!0&&this.type===Cr&&b(Q,k),Q.needsUpdate=!1}f=this.type,m.needsUpdate=!1,e.setRenderTarget(y,E,U)};function b(S,A){let k=t.update(g);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ei(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,e.setRenderTarget(S.mapPass),e.clear(),e.renderBufferDirect(A,null,k,d,g,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,e.setRenderTarget(S.map),e.clear(),e.renderBufferDirect(A,null,k,p,g,null)}function M(S,A,k,y){let E=null,U=k.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(U!==void 0)E=U;else if(E=k.isPointLight===!0?l:o,e.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let H=E.uuid,Y=A.uuid,Z=c[H];Z===void 0&&(Z={},c[H]=Z);let re=Z[Y];re===void 0&&(re=E.clone(),Z[Y]=re,A.addEventListener("dispose",G)),E=re}if(E.visible=A.visible,E.wireframe=A.wireframe,y===Cr?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:h[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,k.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let H=e.properties.get(E);H.light=k}return E}function C(S,A,k,y,E){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&E===Cr)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,S.matrixWorld);let H=t.update(S),Y=S.material;if(Array.isArray(Y)){let Z=H.groups;for(let re=0,$=Z.length;re<$;re++){let oe=Z[re],Q=Y[oe.materialIndex];if(Q&&Q.visible){let he=M(S,Q,y,E);S.onBeforeShadow(e,S,A,k,H,he,oe),e.renderBufferDirect(k,null,H,he,S,oe),S.onAfterShadow(e,S,A,k,H,he,oe)}}}else if(Y.visible){let Z=M(S,Y,y,E);S.onBeforeShadow(e,S,A,k,H,Z,null),e.renderBufferDirect(k,null,H,Z,S,null),S.onAfterShadow(e,S,A,k,H,Z,null)}}let U=S.children;for(let H=0,Y=U.length;H<Y;H++)C(U[H],A,k,y,E)}function G(S){S.target.removeEventListener("dispose",G);for(let A in c){let k=c[A],y=S.target.uuid;y in k&&(k[y].dispose(),delete k[y])}}}var p_={[Oo]:Fo,[zo]:Ho,[ko]:Vo,[ia]:Bo,[Fo]:Oo,[Ho]:zo,[Vo]:ko,[Bo]:ia};function f_(e,t){function r(){let R=!1,j=new Mt,V=null,q=new Mt(0,0,0,0);return{setMask:function(ne){V!==ne&&!R&&(e.colorMask(ne,ne,ne,ne),V=ne)},setLocked:function(ne){R=ne},setClear:function(ne,ae,Ce,Xe,Je){Je===!0&&(ne*=Xe,ae*=Xe,Ce*=Xe),j.set(ne,ae,Ce,Xe),q.equals(j)===!1&&(e.clearColor(ne,ae,Ce,Xe),q.copy(j))},reset:function(){R=!1,V=null,q.set(-1,0,0,0)}}}function i(){let R=!1,j=!1,V=null,q=null,ne=null;return{setReversed:function(ae){if(j!==ae){let Ce=t.get("EXT_clip_control");j?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT);let Xe=ne;ne=null,this.setClear(Xe)}j=ae},getReversed:function(){return j},setTest:function(ae){ae?me(e.DEPTH_TEST):Ne(e.DEPTH_TEST)},setMask:function(ae){V!==ae&&!R&&(e.depthMask(ae),V=ae)},setFunc:function(ae){if(j&&(ae=p_[ae]),q!==ae){switch(ae){case Oo:e.depthFunc(e.NEVER);break;case Fo:e.depthFunc(e.ALWAYS);break;case zo:e.depthFunc(e.LESS);break;case ia:e.depthFunc(e.LEQUAL);break;case ko:e.depthFunc(e.EQUAL);break;case Bo:e.depthFunc(e.GEQUAL);break;case Ho:e.depthFunc(e.GREATER);break;case Vo:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}q=ae}},setLocked:function(ae){R=ae},setClear:function(ae){ne!==ae&&(j&&(ae=1-ae),e.clearDepth(ae),ne=ae)},reset:function(){R=!1,V=null,q=null,ne=null,j=!1}}}function a(){let R=!1,j=null,V=null,q=null,ne=null,ae=null,Ce=null,Xe=null,Je=null;return{setTest:function(Ge){R||(Ge?me(e.STENCIL_TEST):Ne(e.STENCIL_TEST))},setMask:function(Ge){j!==Ge&&!R&&(e.stencilMask(Ge),j=Ge)},setFunc:function(Ge,jt,ot){(V!==Ge||q!==jt||ne!==ot)&&(e.stencilFunc(Ge,jt,ot),V=Ge,q=jt,ne=ot)},setOp:function(Ge,jt,ot){(ae!==Ge||Ce!==jt||Xe!==ot)&&(e.stencilOp(Ge,jt,ot),ae=Ge,Ce=jt,Xe=ot)},setLocked:function(Ge){R=Ge},setClear:function(Ge){Je!==Ge&&(e.clearStencil(Ge),Je=Ge)},reset:function(){R=!1,j=null,V=null,q=null,ne=null,ae=null,Ce=null,Xe=null,Je=null}}}let n=new r,s=new i,o=new a,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,p=[],v=null,g=!1,m=null,f=null,b=null,M=null,C=null,G=null,S=null,A=new qe(0,0,0),k=0,y=!1,E=null,U=null,H=null,Y=null,Z=null,re=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,oe=0,Q=e.getParameter(e.VERSION);Q.indexOf("WebGL")!==-1?(oe=parseFloat(/^WebGL (\d)/.exec(Q)[1]),$=oe>=1):Q.indexOf("OpenGL ES")!==-1&&(oe=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),$=oe>=2);let he=null,_e={},Be=e.getParameter(e.SCISSOR_BOX),De=e.getParameter(e.VIEWPORT),J=new Mt().fromArray(Be),pe=new Mt().fromArray(De);function Te(R,j,V,q){let ne=new Uint8Array(4),ae=e.createTexture();e.bindTexture(R,ae),e.texParameteri(R,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(R,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Ce=0;Ce<V;Ce++)R===e.TEXTURE_3D||R===e.TEXTURE_2D_ARRAY?e.texImage3D(j,0,e.RGBA,1,1,q,0,e.RGBA,e.UNSIGNED_BYTE,ne):e.texImage2D(j+Ce,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ne);return ae}let Re={};Re[e.TEXTURE_2D]=Te(e.TEXTURE_2D,e.TEXTURE_2D,1),Re[e.TEXTURE_CUBE_MAP]=Te(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Re[e.TEXTURE_2D_ARRAY]=Te(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Re[e.TEXTURE_3D]=Te(e.TEXTURE_3D,e.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),me(e.DEPTH_TEST),s.setFunc(ia),et(!1),ye(Kc),me(e.CULL_FACE),mt(Zr);function me(R){u[R]!==!0&&(e.enable(R),u[R]=!0)}function Ne(R){u[R]!==!1&&(e.disable(R),u[R]=!1)}function it(R,j){return h[R]!==j?(e.bindFramebuffer(R,j),h[R]=j,R===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=j),R===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=j),!0):!1}function je(R,j){let V=p,q=!1;if(R){V=d.get(j),V===void 0&&(V=[],d.set(j,V));let ne=R.textures;if(V.length!==ne.length||V[0]!==e.COLOR_ATTACHMENT0){for(let ae=0,Ce=ne.length;ae<Ce;ae++)V[ae]=e.COLOR_ATTACHMENT0+ae;V.length=ne.length,q=!0}}else V[0]!==e.BACK&&(V[0]=e.BACK,q=!0);q&&e.drawBuffers(V)}function Ye(R){return v!==R?(e.useProgram(R),v=R,!0):!1}let _t={[_i]:e.FUNC_ADD,[Pp]:e.FUNC_SUBTRACT,[Lp]:e.FUNC_REVERSE_SUBTRACT};_t[Dp]=e.MIN,_t[Up]=e.MAX;let O={[Np]:e.ZERO,[Ip]:e.ONE,[Op]:e.SRC_COLOR,[No]:e.SRC_ALPHA,[Vp]:e.SRC_ALPHA_SATURATE,[Bp]:e.DST_COLOR,[zp]:e.DST_ALPHA,[Fp]:e.ONE_MINUS_SRC_COLOR,[Io]:e.ONE_MINUS_SRC_ALPHA,[Hp]:e.ONE_MINUS_DST_COLOR,[kp]:e.ONE_MINUS_DST_ALPHA,[Gp]:e.CONSTANT_COLOR,[Wp]:e.ONE_MINUS_CONSTANT_COLOR,[Xp]:e.CONSTANT_ALPHA,[jp]:e.ONE_MINUS_CONSTANT_ALPHA};function mt(R,j,V,q,ne,ae,Ce,Xe,Je,Ge){if(R===Zr){g===!0&&(Ne(e.BLEND),g=!1);return}if(g===!1&&(me(e.BLEND),g=!0),R!==Rp){if(R!==m||Ge!==y){if((f!==_i||C!==_i)&&(e.blendEquation(e.FUNC_ADD),f=_i,C=_i),Ge)switch(R){case ea:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case $c:e.blendFunc(e.ONE,e.ONE);break;case Qc:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case eu:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}else switch(R){case ea:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case $c:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case Qc:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case eu:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}b=null,M=null,G=null,S=null,A.set(0,0,0),k=0,m=R,y=Ge}return}ne=ne||j,ae=ae||V,Ce=Ce||q,(j!==f||ne!==C)&&(e.blendEquationSeparate(_t[j],_t[ne]),f=j,C=ne),(V!==b||q!==M||ae!==G||Ce!==S)&&(e.blendFuncSeparate(O[V],O[q],O[ae],O[Ce]),b=V,M=q,G=ae,S=Ce),(Xe.equals(A)===!1||Je!==k)&&(e.blendColor(Xe.r,Xe.g,Xe.b,Je),A.copy(Xe),k=Je),m=R,y=!1}function $e(R,j){R.side===Rr?Ne(e.CULL_FACE):me(e.CULL_FACE);let V=R.side===Vt;j&&(V=!V),et(V),R.blending===ea&&R.transparent===!1?mt(Zr):mt(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),s.setFunc(R.depthFunc),s.setTest(R.depthTest),s.setMask(R.depthWrite),n.setMask(R.colorWrite);let q=R.stencilWrite;o.setTest(q),q&&(o.setMask(R.stencilWriteMask),o.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),o.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),Pe(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?me(e.SAMPLE_ALPHA_TO_COVERAGE):Ne(e.SAMPLE_ALPHA_TO_COVERAGE)}function et(R){E!==R&&(R?e.frontFace(e.CW):e.frontFace(e.CCW),E=R)}function ye(R){R!==wp?(me(e.CULL_FACE),R!==U&&(R===Kc?e.cullFace(e.BACK):R===Ap?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Ne(e.CULL_FACE),U=R}function tt(R){R!==H&&($&&e.lineWidth(R),H=R)}function Pe(R,j,V){R?(me(e.POLYGON_OFFSET_FILL),(Y!==j||Z!==V)&&(e.polygonOffset(j,V),Y=j,Z=V)):Ne(e.POLYGON_OFFSET_FILL)}function Fe(R){R?me(e.SCISSOR_TEST):Ne(e.SCISSOR_TEST)}function T(R){R===void 0&&(R=e.TEXTURE0+re-1),he!==R&&(e.activeTexture(R),he=R)}function _(R,j,V){V===void 0&&(he===null?V=e.TEXTURE0+re-1:V=he);let q=_e[V];q===void 0&&(q={type:void 0,texture:void 0},_e[V]=q),(q.type!==R||q.texture!==j)&&(he!==V&&(e.activeTexture(V),he=V),e.bindTexture(R,j||Re[R]),q.type=R,q.texture=j)}function B(){let R=_e[he];R!==void 0&&R.type!==void 0&&(e.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function ie(){try{e.compressedTexImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function se(){try{e.compressedTexImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ee(){try{e.texSubImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function Le(){try{e.texSubImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ge(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function Me(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ze(){try{e.texStorage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function de(){try{e.texStorage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function w(){try{e.texImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function D(){try{e.texImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function L(R){J.equals(R)===!1&&(e.scissor(R.x,R.y,R.z,R.w),J.copy(R))}function z(R){pe.equals(R)===!1&&(e.viewport(R.x,R.y,R.z,R.w),pe.copy(R))}function K(R,j){let V=c.get(j);V===void 0&&(V=new WeakMap,c.set(j,V));let q=V.get(R);q===void 0&&(q=e.getUniformBlockIndex(j,R.name),V.set(R,q))}function te(R,j){let V=c.get(j).get(R);l.get(j)!==V&&(e.uniformBlockBinding(j,V,R.__bindingPointIndex),l.set(j,V))}function ue(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),s.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},he=null,_e={},h={},d=new WeakMap,p=[],v=null,g=!1,m=null,f=null,b=null,M=null,C=null,G=null,S=null,A=new qe(0,0,0),k=0,y=!1,E=null,U=null,H=null,Y=null,Z=null,J.set(0,0,e.canvas.width,e.canvas.height),pe.set(0,0,e.canvas.width,e.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:me,disable:Ne,bindFramebuffer:it,drawBuffers:je,useProgram:Ye,setBlending:mt,setMaterial:$e,setFlipSided:et,setCullFace:ye,setLineWidth:tt,setPolygonOffset:Pe,setScissorTest:Fe,activeTexture:T,bindTexture:_,unbindTexture:B,compressedTexImage2D:ie,compressedTexImage3D:se,texImage2D:w,texImage3D:D,updateUBOMapping:K,uniformBlockBinding:te,texStorage2D:ze,texStorage3D:de,texSubImage2D:ee,texSubImage3D:Le,compressedTexSubImage2D:ge,compressedTexSubImage3D:Me,scissor:L,viewport:z,reset:ue}}function Ju(e,t,r,i){let a=m_(i);switch(r){case ph:return e*t;case mh:return e*t;case gh:return e*t*2;case vh:return e*t/a.components*a.byteLength;case Rl:return e*t/a.components*a.byteLength;case _h:return e*t*2/a.components*a.byteLength;case Pl:return e*t*2/a.components*a.byteLength;case fh:return e*t*3/a.components*a.byteLength;case lr:return e*t*4/a.components*a.byteLength;case Ll:return e*t*4/a.components*a.byteLength;case jn:case qn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Yn:case Zn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Yo:case Jo:return Math.max(e,16)*Math.max(t,8)/4;case qo:case Zo:return Math.max(e,8)*Math.max(t,8)/2;case Ko:case $o:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Qo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case el:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case tl:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case rl:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case il:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case al:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case nl:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case sl:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ol:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ll:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case cl:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case ul:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case hl:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case dl:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case pl:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Jn:case fl:case ml:return Math.ceil(e/4)*Math.ceil(t/4)*16;case xh:case gl:return Math.ceil(e/4)*Math.ceil(t/4)*8;case vl:case _l:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${r} format.`)}function m_(e){switch(e){case Ur:case uh:return{byteLength:1,components:1};case Ya:case hh:case Za:return{byteLength:2,components:1};case Al:case Cl:return{byteLength:2,components:4};case Si:case wl:case Pr:return{byteLength:4,components:1};case dh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}function g_(e,t,r,i,a,n,s){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ve,u=new WeakMap,h,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,_){return p?new OffscreenCanvas(T,_):rs("canvas")}function g(T,_,B){let ie=1,se=Fe(T);if((se.width>B||se.height>B)&&(ie=B/Math.max(se.width,se.height)),ie<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let ee=Math.floor(ie*se.width),Le=Math.floor(ie*se.height);h===void 0&&(h=v(ee,Le));let ge=_?v(ee,Le):h;return ge.width=ee,ge.height=Le,ge.getContext("2d").drawImage(T,0,0,ee,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+ee+"x"+Le+")."),ge}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){e.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?e.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function M(T,_,B,ie,se=!1){if(T!==null){if(e[T]!==void 0)return e[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ee=_;if(_===e.RED&&(B===e.FLOAT&&(ee=e.R32F),B===e.HALF_FLOAT&&(ee=e.R16F),B===e.UNSIGNED_BYTE&&(ee=e.R8)),_===e.RED_INTEGER&&(B===e.UNSIGNED_BYTE&&(ee=e.R8UI),B===e.UNSIGNED_SHORT&&(ee=e.R16UI),B===e.UNSIGNED_INT&&(ee=e.R32UI),B===e.BYTE&&(ee=e.R8I),B===e.SHORT&&(ee=e.R16I),B===e.INT&&(ee=e.R32I)),_===e.RG&&(B===e.FLOAT&&(ee=e.RG32F),B===e.HALF_FLOAT&&(ee=e.RG16F),B===e.UNSIGNED_BYTE&&(ee=e.RG8)),_===e.RG_INTEGER&&(B===e.UNSIGNED_BYTE&&(ee=e.RG8UI),B===e.UNSIGNED_SHORT&&(ee=e.RG16UI),B===e.UNSIGNED_INT&&(ee=e.RG32UI),B===e.BYTE&&(ee=e.RG8I),B===e.SHORT&&(ee=e.RG16I),B===e.INT&&(ee=e.RG32I)),_===e.RGB_INTEGER&&(B===e.UNSIGNED_BYTE&&(ee=e.RGB8UI),B===e.UNSIGNED_SHORT&&(ee=e.RGB16UI),B===e.UNSIGNED_INT&&(ee=e.RGB32UI),B===e.BYTE&&(ee=e.RGB8I),B===e.SHORT&&(ee=e.RGB16I),B===e.INT&&(ee=e.RGB32I)),_===e.RGBA_INTEGER&&(B===e.UNSIGNED_BYTE&&(ee=e.RGBA8UI),B===e.UNSIGNED_SHORT&&(ee=e.RGBA16UI),B===e.UNSIGNED_INT&&(ee=e.RGBA32UI),B===e.BYTE&&(ee=e.RGBA8I),B===e.SHORT&&(ee=e.RGBA16I),B===e.INT&&(ee=e.RGBA32I)),_===e.RGB&&B===e.UNSIGNED_INT_5_9_9_9_REV&&(ee=e.RGB9_E5),_===e.RGBA){let Le=se?as:Ke.getTransfer(ie);B===e.FLOAT&&(ee=e.RGBA32F),B===e.HALF_FLOAT&&(ee=e.RGBA16F),B===e.UNSIGNED_BYTE&&(ee=Le===at?e.SRGB8_ALPHA8:e.RGBA8),B===e.UNSIGNED_SHORT_4_4_4_4&&(ee=e.RGBA4),B===e.UNSIGNED_SHORT_5_5_5_1&&(ee=e.RGB5_A1)}return(ee===e.R16F||ee===e.R32F||ee===e.RG16F||ee===e.RG32F||ee===e.RGBA16F||ee===e.RGBA32F)&&t.get("EXT_color_buffer_float"),ee}function C(T,_){let B;return T?_===null||_===Si||_===sa?B=e.DEPTH24_STENCIL8:_===Pr?B=e.DEPTH32F_STENCIL8:_===Ya&&(B=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Si||_===sa?B=e.DEPTH_COMPONENT24:_===Pr?B=e.DEPTH_COMPONENT32F:_===Ya&&(B=e.DEPTH_COMPONENT16),B}function G(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Gt&&T.minFilter!==xr?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function S(T){let _=T.target;_.removeEventListener("dispose",S),k(_),_.isVideoTexture&&u.delete(_)}function A(T){let _=T.target;_.removeEventListener("dispose",A),E(_)}function k(T){let _=i.get(T);if(_.__webglInit===void 0)return;let B=T.source,ie=d.get(B);if(ie){let se=ie[_.__cacheKey];se.usedTimes--,se.usedTimes===0&&y(T),Object.keys(ie).length===0&&d.delete(B)}i.remove(T)}function y(T){let _=i.get(T);e.deleteTexture(_.__webglTexture);let B=T.source,ie=d.get(B);delete ie[_.__cacheKey],s.memory.textures--}function E(T){let _=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray(_.__webglFramebuffer[ie]))for(let se=0;se<_.__webglFramebuffer[ie].length;se++)e.deleteFramebuffer(_.__webglFramebuffer[ie][se]);else e.deleteFramebuffer(_.__webglFramebuffer[ie]);_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer[ie])}else{if(Array.isArray(_.__webglFramebuffer))for(let ie=0;ie<_.__webglFramebuffer.length;ie++)e.deleteFramebuffer(_.__webglFramebuffer[ie]);else e.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&e.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let ie=0;ie<_.__webglColorRenderbuffer.length;ie++)_.__webglColorRenderbuffer[ie]&&e.deleteRenderbuffer(_.__webglColorRenderbuffer[ie]);_.__webglDepthRenderbuffer&&e.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let B=T.textures;for(let ie=0,se=B.length;ie<se;ie++){let ee=i.get(B[ie]);ee.__webglTexture&&(e.deleteTexture(ee.__webglTexture),s.memory.textures--),i.remove(B[ie])}i.remove(T)}let U=0;function H(){U=0}function Y(){let T=U;return T>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+a.maxTextures),U+=1,T}function Z(T){let _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function re(T,_){let B=i.get(T);if(T.isVideoTexture&&tt(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){let ie=T.image;if(ie===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pe(B,T,_);return}}r.bindTexture(e.TEXTURE_2D,B.__webglTexture,e.TEXTURE0+_)}function $(T,_){let B=i.get(T);if(T.version>0&&B.__version!==T.version){pe(B,T,_);return}r.bindTexture(e.TEXTURE_2D_ARRAY,B.__webglTexture,e.TEXTURE0+_)}function oe(T,_){let B=i.get(T);if(T.version>0&&B.__version!==T.version){pe(B,T,_);return}r.bindTexture(e.TEXTURE_3D,B.__webglTexture,e.TEXTURE0+_)}function Q(T,_){let B=i.get(T);if(T.version>0&&B.__version!==T.version){Te(B,T,_);return}r.bindTexture(e.TEXTURE_CUBE_MAP,B.__webglTexture,e.TEXTURE0+_)}let he={[Xo]:e.REPEAT,[yi]:e.CLAMP_TO_EDGE,[jo]:e.MIRRORED_REPEAT},_e={[Gt]:e.NEAREST,[rf]:e.NEAREST_MIPMAP_NEAREST,[yn]:e.NEAREST_MIPMAP_LINEAR,[xr]:e.LINEAR,[Ks]:e.LINEAR_MIPMAP_NEAREST,[Mi]:e.LINEAR_MIPMAP_LINEAR},Be={[of]:e.NEVER,[pf]:e.ALWAYS,[lf]:e.LESS,[Mh]:e.LEQUAL,[cf]:e.EQUAL,[df]:e.GEQUAL,[uf]:e.GREATER,[hf]:e.NOTEQUAL};function De(T,_){if(_.type===Pr&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===xr||_.magFilter===Ks||_.magFilter===yn||_.magFilter===Mi||_.minFilter===xr||_.minFilter===Ks||_.minFilter===yn||_.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(T,e.TEXTURE_WRAP_S,he[_.wrapS]),e.texParameteri(T,e.TEXTURE_WRAP_T,he[_.wrapT]),(T===e.TEXTURE_3D||T===e.TEXTURE_2D_ARRAY)&&e.texParameteri(T,e.TEXTURE_WRAP_R,he[_.wrapR]),e.texParameteri(T,e.TEXTURE_MAG_FILTER,_e[_.magFilter]),e.texParameteri(T,e.TEXTURE_MIN_FILTER,_e[_.minFilter]),_.compareFunction&&(e.texParameteri(T,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(T,e.TEXTURE_COMPARE_FUNC,Be[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Gt||_.minFilter!==yn&&_.minFilter!==Mi||_.type===Pr&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");e.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,a.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function J(T,_){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",S));let ie=_.source,se=d.get(ie);se===void 0&&(se={},d.set(ie,se));let ee=Z(_);if(ee!==T.__cacheKey){se[ee]===void 0&&(se[ee]={texture:e.createTexture(),usedTimes:0},s.memory.textures++,B=!0),se[ee].usedTimes++;let Le=se[T.__cacheKey];Le!==void 0&&(se[T.__cacheKey].usedTimes--,Le.usedTimes===0&&y(_)),T.__cacheKey=ee,T.__webglTexture=se[ee].texture}return B}function pe(T,_,B){let ie=e.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(ie=e.TEXTURE_2D_ARRAY),_.isData3DTexture&&(ie=e.TEXTURE_3D);let se=J(T,_),ee=_.source;r.bindTexture(ie,T.__webglTexture,e.TEXTURE0+B);let Le=i.get(ee);if(ee.version!==Le.__version||se===!0){r.activeTexture(e.TEXTURE0+B);let ge=Ke.getPrimaries(Ke.workingColorSpace),Me=_.colorSpace===vr?null:Ke.getPrimaries(_.colorSpace),ze=_.colorSpace===vr||ge===Me?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);let de=g(_.image,!1,a.maxTextureSize);de=Pe(_,de);let w=n.convert(_.format,_.colorSpace),D=n.convert(_.type),L=M(_.internalFormat,w,D,_.colorSpace,_.isVideoTexture);De(ie,_);let z,K=_.mipmaps,te=_.isVideoTexture!==!0,ue=Le.__version===void 0||se===!0,R=ee.dataReady,j=G(_,de);if(_.isDepthTexture)L=C(_.format===oa,_.type),ue&&(te?r.texStorage2D(e.TEXTURE_2D,1,L,de.width,de.height):r.texImage2D(e.TEXTURE_2D,0,L,de.width,de.height,0,w,D,null));else if(_.isDataTexture)if(K.length>0){te&&ue&&r.texStorage2D(e.TEXTURE_2D,j,L,K[0].width,K[0].height);for(let V=0,q=K.length;V<q;V++)z=K[V],te?R&&r.texSubImage2D(e.TEXTURE_2D,V,0,0,z.width,z.height,w,D,z.data):r.texImage2D(e.TEXTURE_2D,V,L,z.width,z.height,0,w,D,z.data);_.generateMipmaps=!1}else te?(ue&&r.texStorage2D(e.TEXTURE_2D,j,L,de.width,de.height),R&&r.texSubImage2D(e.TEXTURE_2D,0,0,0,de.width,de.height,w,D,de.data)):r.texImage2D(e.TEXTURE_2D,0,L,de.width,de.height,0,w,D,de.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){te&&ue&&r.texStorage3D(e.TEXTURE_2D_ARRAY,j,L,K[0].width,K[0].height,de.depth);for(let V=0,q=K.length;V<q;V++)if(z=K[V],_.format!==lr)if(w!==null)if(te){if(R)if(_.layerUpdates.size>0){let ne=Ju(z.width,z.height,_.format,_.type);for(let ae of _.layerUpdates){let Ce=z.data.subarray(ae*ne/z.data.BYTES_PER_ELEMENT,(ae+1)*ne/z.data.BYTES_PER_ELEMENT);r.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,V,0,0,ae,z.width,z.height,1,w,Ce)}_.clearLayerUpdates()}else r.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,V,0,0,0,z.width,z.height,de.depth,w,z.data)}else r.compressedTexImage3D(e.TEXTURE_2D_ARRAY,V,L,z.width,z.height,de.depth,0,z.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else te?R&&r.texSubImage3D(e.TEXTURE_2D_ARRAY,V,0,0,0,z.width,z.height,de.depth,w,D,z.data):r.texImage3D(e.TEXTURE_2D_ARRAY,V,L,z.width,z.height,de.depth,0,w,D,z.data)}else{te&&ue&&r.texStorage2D(e.TEXTURE_2D,j,L,K[0].width,K[0].height);for(let V=0,q=K.length;V<q;V++)z=K[V],_.format!==lr?w!==null?te?R&&r.compressedTexSubImage2D(e.TEXTURE_2D,V,0,0,z.width,z.height,w,z.data):r.compressedTexImage2D(e.TEXTURE_2D,V,L,z.width,z.height,0,z.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?R&&r.texSubImage2D(e.TEXTURE_2D,V,0,0,z.width,z.height,w,D,z.data):r.texImage2D(e.TEXTURE_2D,V,L,z.width,z.height,0,w,D,z.data)}else if(_.isDataArrayTexture)if(te){if(ue&&r.texStorage3D(e.TEXTURE_2D_ARRAY,j,L,de.width,de.height,de.depth),R)if(_.layerUpdates.size>0){let V=Ju(de.width,de.height,_.format,_.type);for(let q of _.layerUpdates){let ne=de.data.subarray(q*V/de.data.BYTES_PER_ELEMENT,(q+1)*V/de.data.BYTES_PER_ELEMENT);r.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,q,de.width,de.height,1,w,D,ne)}_.clearLayerUpdates()}else r.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,de.width,de.height,de.depth,w,D,de.data)}else r.texImage3D(e.TEXTURE_2D_ARRAY,0,L,de.width,de.height,de.depth,0,w,D,de.data);else if(_.isData3DTexture)te?(ue&&r.texStorage3D(e.TEXTURE_3D,j,L,de.width,de.height,de.depth),R&&r.texSubImage3D(e.TEXTURE_3D,0,0,0,0,de.width,de.height,de.depth,w,D,de.data)):r.texImage3D(e.TEXTURE_3D,0,L,de.width,de.height,de.depth,0,w,D,de.data);else if(_.isFramebufferTexture){if(ue)if(te)r.texStorage2D(e.TEXTURE_2D,j,L,de.width,de.height);else{let V=de.width,q=de.height;for(let ne=0;ne<j;ne++)r.texImage2D(e.TEXTURE_2D,ne,L,V,q,0,w,D,null),V>>=1,q>>=1}}else if(K.length>0){if(te&&ue){let V=Fe(K[0]);r.texStorage2D(e.TEXTURE_2D,j,L,V.width,V.height)}for(let V=0,q=K.length;V<q;V++)z=K[V],te?R&&r.texSubImage2D(e.TEXTURE_2D,V,0,0,w,D,z):r.texImage2D(e.TEXTURE_2D,V,L,w,D,z);_.generateMipmaps=!1}else if(te){if(ue){let V=Fe(de);r.texStorage2D(e.TEXTURE_2D,j,L,V.width,V.height)}R&&r.texSubImage2D(e.TEXTURE_2D,0,0,0,w,D,de)}else r.texImage2D(e.TEXTURE_2D,0,L,w,D,de);m(_)&&f(ie),Le.__version=ee.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Te(T,_,B){if(_.image.length!==6)return;let ie=J(T,_),se=_.source;r.bindTexture(e.TEXTURE_CUBE_MAP,T.__webglTexture,e.TEXTURE0+B);let ee=i.get(se);if(se.version!==ee.__version||ie===!0){r.activeTexture(e.TEXTURE0+B);let Le=Ke.getPrimaries(Ke.workingColorSpace),ge=_.colorSpace===vr?null:Ke.getPrimaries(_.colorSpace),Me=_.colorSpace===vr||Le===ge?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let ze=_.isCompressedTexture||_.image[0].isCompressedTexture,de=_.image[0]&&_.image[0].isDataTexture,w=[];for(let q=0;q<6;q++)!ze&&!de?w[q]=g(_.image[q],!0,a.maxCubemapSize):w[q]=de?_.image[q].image:_.image[q],w[q]=Pe(_,w[q]);let D=w[0],L=n.convert(_.format,_.colorSpace),z=n.convert(_.type),K=M(_.internalFormat,L,z,_.colorSpace),te=_.isVideoTexture!==!0,ue=ee.__version===void 0||ie===!0,R=se.dataReady,j=G(_,D);De(e.TEXTURE_CUBE_MAP,_);let V;if(ze){te&&ue&&r.texStorage2D(e.TEXTURE_CUBE_MAP,j,K,D.width,D.height);for(let q=0;q<6;q++){V=w[q].mipmaps;for(let ne=0;ne<V.length;ne++){let ae=V[ne];_.format!==lr?L!==null?te?R&&r.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne,0,0,ae.width,ae.height,L,ae.data):r.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne,K,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):te?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne,0,0,ae.width,ae.height,L,z,ae.data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne,K,ae.width,ae.height,0,L,z,ae.data)}}}else{if(V=_.mipmaps,te&&ue){V.length>0&&j++;let q=Fe(w[0]);r.texStorage2D(e.TEXTURE_CUBE_MAP,j,K,q.width,q.height)}for(let q=0;q<6;q++)if(de){te?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,w[q].width,w[q].height,L,z,w[q].data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,K,w[q].width,w[q].height,0,L,z,w[q].data);for(let ne=0;ne<V.length;ne++){let ae=V[ne].image[q].image;te?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne+1,0,0,ae.width,ae.height,L,z,ae.data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne+1,K,ae.width,ae.height,0,L,z,ae.data)}}else{te?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,L,z,w[q]):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,K,L,z,w[q]);for(let ne=0;ne<V.length;ne++){let ae=V[ne];te?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne+1,0,0,L,z,ae.image[q]):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+q,ne+1,K,L,z,ae.image[q])}}}m(_)&&f(e.TEXTURE_CUBE_MAP),ee.__version=se.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Re(T,_,B,ie,se,ee){let Le=n.convert(B.format,B.colorSpace),ge=n.convert(B.type),Me=M(B.internalFormat,Le,ge,B.colorSpace),ze=i.get(_),de=i.get(B);if(de.__renderTarget=_,!ze.__hasExternalTextures){let w=Math.max(1,_.width>>ee),D=Math.max(1,_.height>>ee);se===e.TEXTURE_3D||se===e.TEXTURE_2D_ARRAY?r.texImage3D(se,ee,Me,w,D,_.depth,0,Le,ge,null):r.texImage2D(se,ee,Me,w,D,0,Le,ge,null)}r.bindFramebuffer(e.FRAMEBUFFER,T),ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,ie,se,de.__webglTexture,0,et(_)):(se===e.TEXTURE_2D||se>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,ie,se,de.__webglTexture,ee),r.bindFramebuffer(e.FRAMEBUFFER,null)}function me(T,_,B){if(e.bindRenderbuffer(e.RENDERBUFFER,T),_.depthBuffer){let ie=_.depthTexture,se=ie&&ie.isDepthTexture?ie.type:null,ee=C(_.stencilBuffer,se),Le=_.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ge=et(_);ye(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ge,ee,_.width,_.height):B?e.renderbufferStorageMultisample(e.RENDERBUFFER,ge,ee,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,ee,_.width,_.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Le,e.RENDERBUFFER,T)}else{let ie=_.textures;for(let se=0;se<ie.length;se++){let ee=ie[se],Le=n.convert(ee.format,ee.colorSpace),ge=n.convert(ee.type),Me=M(ee.internalFormat,Le,ge,ee.colorSpace),ze=et(_);B&&ye(_)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,ze,Me,_.width,_.height):ye(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ze,Me,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,Me,_.width,_.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ne(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(r.bindFramebuffer(e.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let B=i.get(_.depthTexture);B.__renderTarget=_,(!B.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),re(_.depthTexture,0);let ie=B.__webglTexture,se=et(_);if(_.depthTexture.format===ta)ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,ie,0,se):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,ie,0);else if(_.depthTexture.format===oa)ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,ie,0,se):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function it(T){let _=i.get(T),B=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){let ie=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),ie){let se=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,ie.removeEventListener("dispose",se)};ie.addEventListener("dispose",se),_.__depthDisposeCallback=se}_.__boundDepthTexture=ie}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Ne(_.__webglFramebuffer,T)}else if(B){_.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)if(r.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[ie]),_.__webglDepthbuffer[ie]===void 0)_.__webglDepthbuffer[ie]=e.createRenderbuffer(),me(_.__webglDepthbuffer[ie],T,!1);else{let se=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer[ie];e.bindRenderbuffer(e.RENDERBUFFER,ee),e.framebufferRenderbuffer(e.FRAMEBUFFER,se,e.RENDERBUFFER,ee)}}else if(r.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=e.createRenderbuffer(),me(_.__webglDepthbuffer,T,!1);else{let ie=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,se=_.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,se),e.framebufferRenderbuffer(e.FRAMEBUFFER,ie,e.RENDERBUFFER,se)}r.bindFramebuffer(e.FRAMEBUFFER,null)}function je(T,_,B){let ie=i.get(T);_!==void 0&&Re(ie.__webglFramebuffer,T,T.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),B!==void 0&&it(T)}function Ye(T){let _=T.texture,B=i.get(T),ie=i.get(_);T.addEventListener("dispose",A);let se=T.textures,ee=T.isWebGLCubeRenderTarget===!0,Le=se.length>1;if(Le||(ie.__webglTexture===void 0&&(ie.__webglTexture=e.createTexture()),ie.__version=_.version,s.memory.textures++),ee){B.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[ge]=[];for(let Me=0;Me<_.mipmaps.length;Me++)B.__webglFramebuffer[ge][Me]=e.createFramebuffer()}else B.__webglFramebuffer[ge]=e.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let ge=0;ge<_.mipmaps.length;ge++)B.__webglFramebuffer[ge]=e.createFramebuffer()}else B.__webglFramebuffer=e.createFramebuffer();if(Le)for(let ge=0,Me=se.length;ge<Me;ge++){let ze=i.get(se[ge]);ze.__webglTexture===void 0&&(ze.__webglTexture=e.createTexture(),s.memory.textures++)}if(T.samples>0&&ye(T)===!1){B.__webglMultisampledFramebuffer=e.createFramebuffer(),B.__webglColorRenderbuffer=[],r.bindFramebuffer(e.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ge=0;ge<se.length;ge++){let Me=se[ge];B.__webglColorRenderbuffer[ge]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,B.__webglColorRenderbuffer[ge]);let ze=n.convert(Me.format,Me.colorSpace),de=n.convert(Me.type),w=M(Me.internalFormat,ze,de,Me.colorSpace,T.isXRRenderTarget===!0),D=et(T);e.renderbufferStorageMultisample(e.RENDERBUFFER,D,w,T.width,T.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ge,e.RENDERBUFFER,B.__webglColorRenderbuffer[ge])}e.bindRenderbuffer(e.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=e.createRenderbuffer(),me(B.__webglDepthRenderbuffer,T,!0)),r.bindFramebuffer(e.FRAMEBUFFER,null)}}if(ee){r.bindTexture(e.TEXTURE_CUBE_MAP,ie.__webglTexture),De(e.TEXTURE_CUBE_MAP,_);for(let ge=0;ge<6;ge++)if(_.mipmaps&&_.mipmaps.length>0)for(let Me=0;Me<_.mipmaps.length;Me++)Re(B.__webglFramebuffer[ge][Me],T,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Me);else Re(B.__webglFramebuffer[ge],T,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);m(_)&&f(e.TEXTURE_CUBE_MAP),r.unbindTexture()}else if(Le){for(let ge=0,Me=se.length;ge<Me;ge++){let ze=se[ge],de=i.get(ze);r.bindTexture(e.TEXTURE_2D,de.__webglTexture),De(e.TEXTURE_2D,ze),Re(B.__webglFramebuffer,T,ze,e.COLOR_ATTACHMENT0+ge,e.TEXTURE_2D,0),m(ze)&&f(e.TEXTURE_2D)}r.unbindTexture()}else{let ge=e.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ge=T.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),r.bindTexture(ge,ie.__webglTexture),De(ge,_),_.mipmaps&&_.mipmaps.length>0)for(let Me=0;Me<_.mipmaps.length;Me++)Re(B.__webglFramebuffer[Me],T,_,e.COLOR_ATTACHMENT0,ge,Me);else Re(B.__webglFramebuffer,T,_,e.COLOR_ATTACHMENT0,ge,0);m(_)&&f(ge),r.unbindTexture()}T.depthBuffer&&it(T)}function _t(T){let _=T.textures;for(let B=0,ie=_.length;B<ie;B++){let se=_[B];if(m(se)){let ee=b(T),Le=i.get(se).__webglTexture;r.bindTexture(ee,Le),f(ee),r.unbindTexture()}}}let O=[],mt=[];function $e(T){if(T.samples>0){if(ye(T)===!1){let _=T.textures,B=T.width,ie=T.height,se=e.COLOR_BUFFER_BIT,ee=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Le=i.get(T),ge=_.length>1;if(ge)for(let Me=0;Me<_.length;Me++)r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.RENDERBUFFER,null),r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.TEXTURE_2D,null,0);r.bindFramebuffer(e.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer),r.bindFramebuffer(e.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let Me=0;Me<_.length;Me++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(se|=e.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(se|=e.STENCIL_BUFFER_BIT)),ge){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Le.__webglColorRenderbuffer[Me]);let ze=i.get(_[Me]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,ze,0)}e.blitFramebuffer(0,0,B,ie,0,0,B,ie,se,e.NEAREST),l===!0&&(O.length=0,mt.length=0,O.push(e.COLOR_ATTACHMENT0+Me),T.depthBuffer&&T.resolveDepthBuffer===!1&&(O.push(ee),mt.push(ee),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,mt)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,O))}if(r.bindFramebuffer(e.READ_FRAMEBUFFER,null),r.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ge)for(let Me=0;Me<_.length;Me++){r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.RENDERBUFFER,Le.__webglColorRenderbuffer[Me]);let ze=i.get(_[Me]).__webglTexture;r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.TEXTURE_2D,ze,0)}r.bindFramebuffer(e.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let _=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[_])}}}function et(T){return Math.min(a.maxSamples,T.samples)}function ye(T){let _=i.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function tt(T){let _=s.render.frame;u.get(T)!==_&&(u.set(T,_),T.update())}function Pe(T,_){let B=T.colorSpace,ie=T.format,se=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==ca&&B!==vr&&(Ke.getTransfer(B)===at?(ie!==lr||se!==Ur)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),_}function Fe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=H,this.setTexture2D=re,this.setTexture2DArray=$,this.setTexture3D=oe,this.setTextureCube=Q,this.rebindTextures=je,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=$e,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=ye}function v_(e,t){function r(i,a=vr){let n,s=Ke.getTransfer(a);if(i===Ur)return e.UNSIGNED_BYTE;if(i===Al)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Cl)return e.UNSIGNED_SHORT_5_5_5_1;if(i===dh)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===uh)return e.BYTE;if(i===hh)return e.SHORT;if(i===Ya)return e.UNSIGNED_SHORT;if(i===wl)return e.INT;if(i===Si)return e.UNSIGNED_INT;if(i===Pr)return e.FLOAT;if(i===Za)return e.HALF_FLOAT;if(i===ph)return e.ALPHA;if(i===fh)return e.RGB;if(i===lr)return e.RGBA;if(i===mh)return e.LUMINANCE;if(i===gh)return e.LUMINANCE_ALPHA;if(i===ta)return e.DEPTH_COMPONENT;if(i===oa)return e.DEPTH_STENCIL;if(i===vh)return e.RED;if(i===Rl)return e.RED_INTEGER;if(i===_h)return e.RG;if(i===Pl)return e.RG_INTEGER;if(i===Ll)return e.RGBA_INTEGER;if(i===jn||i===qn||i===Yn||i===Zn)if(s===at)if(n=t.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===jn)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===qn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Yn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Zn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=t.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===jn)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===qn)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Yn)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Zn)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===qo||i===Yo||i===Zo||i===Jo)if(n=t.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===qo)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Yo)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Zo)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Jo)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ko||i===$o||i===Qo)if(n=t.get("WEBGL_compressed_texture_etc"),n!==null){if(i===Ko||i===$o)return s===at?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===Qo)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===el||i===tl||i===rl||i===il||i===al||i===nl||i===sl||i===ol||i===ll||i===cl||i===ul||i===hl||i===dl||i===pl)if(n=t.get("WEBGL_compressed_texture_astc"),n!==null){if(i===el)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===tl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===rl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===il)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===al)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===nl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===sl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ol)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ll)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===cl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ul)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===hl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===pl)return s===at?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Jn||i===fl||i===ml)if(n=t.get("EXT_texture_compression_bptc"),n!==null){if(i===Jn)return s===at?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===fl)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ml)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===xh||i===gl||i===vl||i===_l)if(n=t.get("EXT_texture_compression_rgtc"),n!==null){if(i===Jn)return n.COMPRESSED_RED_RGTC1_EXT;if(i===gl)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===vl)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===_l)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===sa?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:r}}var __=class extends or{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Ct=class extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}},x_={type:"move"},Co=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ct,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ct,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ct,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let i=null,a=null,n=null,s=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){n=!0;for(let v of e.hand.values()){let g=t.getJointPose(v,r),m=this._getHandJoint(l,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=c.position.distanceTo(u.position),d=.02,p=.005;l.inputState.pinching&&h>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,r),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1));s!==null&&(i=t.getPose(e.targetRaySpace,r),i===null&&a!==null&&(i=a),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(x_)))}return s!==null&&(s.visible=i!==null),o!==null&&(o.visible=a!==null),l!==null&&(l.visible=n!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let r=new Ct;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}},y_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,S_=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){let i=new cr,a=e.properties.get(i);a.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,r=new Qr({vertexShader:y_,fragmentShader:M_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ct(new Nr(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},E_=class extends ua{constructor(e,t){super();let r=this,i=null,a=1,n=null,s="local-floor",o=1,l=null,c=null,u=null,h=null,d=null,p=null,v=new S_,g=t.getContextAttributes(),m=null,f=null,b=[],M=[],C=new ve,G=null,S=new or;S.viewport=new Mt;let A=new or;A.viewport=new Mt;let k=[S,A],y=new __,E=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let pe=b[J];return pe===void 0&&(pe=new Co,b[J]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(J){let pe=b[J];return pe===void 0&&(pe=new Co,b[J]=pe),pe.getGripSpace()},this.getHand=function(J){let pe=b[J];return pe===void 0&&(pe=new Co,b[J]=pe),pe.getHandSpace()};function H(J){let pe=M.indexOf(J.inputSource);if(pe===-1)return;let Te=b[pe];Te!==void 0&&(Te.update(J.inputSource,J.frame,l||n),Te.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",Y),i.removeEventListener("inputsourceschange",Z);for(let J=0;J<b.length;J++){let pe=M[J];pe!==null&&(M[J]=null,b[J].disconnect(pe))}E=null,U=null,v.reset(),e.setRenderTarget(m),d=null,h=null,u=null,i=null,f=null,De.stop(),r.isPresenting=!1,e.setPixelRatio(G),e.setSize(C.width,C.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){a=J,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){s=J,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||n},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",Y),i.addEventListener("inputsourceschange",Z),g.xrCompatible!==!0&&await t.makeXRCompatible(),G=e.getPixelRatio(),e.getSize(C),i.renderState.layers===void 0){let pe={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(i,t,pe),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),f=new Ei(d.framebufferWidth,d.framebufferHeight,{format:lr,type:Ur,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let pe=null,Te=null,Re=null;g.depth&&(Re=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=g.stencil?oa:ta,Te=g.stencil?sa:Si);let me={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:a};u=new XRWebGLBinding(i,t),h=u.createProjectionLayer(me),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),f=new Ei(h.textureWidth,h.textureHeight,{format:lr,type:Ur,depthTexture:new Hh(h.textureWidth,h.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}f.isXRRenderTarget=!0,this.setFoveation(o),l=null,n=await i.requestReferenceSpace(s),De.setContext(i),De.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function Z(J){for(let pe=0;pe<J.removed.length;pe++){let Te=J.removed[pe],Re=M.indexOf(Te);Re>=0&&(M[Re]=null,b[Re].disconnect(Te))}for(let pe=0;pe<J.added.length;pe++){let Te=J.added[pe],Re=M.indexOf(Te);if(Re===-1){for(let Ne=0;Ne<b.length;Ne++)if(Ne>=M.length){M.push(Te),Re=Ne;break}else if(M[Ne]===null){M[Ne]=Te,Re=Ne;break}if(Re===-1)break}let me=b[Re];me&&me.connect(Te)}}let re=new N,$=new N;function oe(J,pe,Te){re.setFromMatrixPosition(pe.matrixWorld),$.setFromMatrixPosition(Te.matrixWorld);let Re=re.distanceTo($),me=pe.projectionMatrix.elements,Ne=Te.projectionMatrix.elements,it=me[14]/(me[10]-1),je=me[14]/(me[10]+1),Ye=(me[9]+1)/me[5],_t=(me[9]-1)/me[5],O=(me[8]-1)/me[0],mt=(Ne[8]+1)/Ne[0],$e=it*O,et=it*mt,ye=Re/(-O+mt),tt=ye*-O;if(pe.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(tt),J.translateZ(ye),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),me[10]===-1)J.projectionMatrix.copy(pe.projectionMatrix),J.projectionMatrixInverse.copy(pe.projectionMatrixInverse);else{let Pe=it+ye,Fe=je+ye,T=$e-tt,_=et+(Re-tt),B=Ye*je/Fe*Pe,ie=_t*je/Fe*Pe;J.projectionMatrix.makePerspective(T,_,B,ie,Pe,Fe),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Q(J,pe){pe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(pe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let pe=J.near,Te=J.far;v.texture!==null&&(v.depthNear>0&&(pe=v.depthNear),v.depthFar>0&&(Te=v.depthFar)),y.near=A.near=S.near=pe,y.far=A.far=S.far=Te,(E!==y.near||U!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,U=y.far),S.layers.mask=J.layers.mask|2,A.layers.mask=J.layers.mask|4,y.layers.mask=S.layers.mask|A.layers.mask;let Re=J.parent,me=y.cameras;Q(y,Re);for(let Ne=0;Ne<me.length;Ne++)Q(me[Ne],Re);me.length===2?oe(y,S,A):y.projectionMatrix.copy(S.projectionMatrix),he(J,y,Re)};function he(J,pe,Te){Te===null?J.matrix.copy(pe.matrixWorld):(J.matrix.copy(Te.matrixWorld),J.matrix.invert(),J.matrix.multiply(pe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(pe.projectionMatrix),J.projectionMatrixInverse.copy(pe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Ml*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&d===null))return o},this.setFoveation=function(J){o=J,h!==null&&(h.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let _e=null;function Be(J,pe){if(c=pe.getViewerPose(l||n),p=pe,c!==null){let Te=c.views;d!==null&&(e.setRenderTargetFramebuffer(f,d.framebuffer),e.setRenderTarget(f));let Re=!1;Te.length!==y.cameras.length&&(y.cameras.length=0,Re=!0);for(let Ne=0;Ne<Te.length;Ne++){let it=Te[Ne],je=null;if(d!==null)je=d.getViewport(it);else{let _t=u.getViewSubImage(h,it);je=_t.viewport,Ne===0&&(e.setRenderTargetTextures(f,_t.colorTexture,h.ignoreDepthValues?void 0:_t.depthStencilTexture),e.setRenderTarget(f))}let Ye=k[Ne];Ye===void 0&&(Ye=new or,Ye.layers.enable(Ne),Ye.viewport=new Mt,k[Ne]=Ye),Ye.matrix.fromArray(it.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(it.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(je.x,je.y,je.width,je.height),Ne===0&&(y.matrix.copy(Ye.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Re===!0&&y.cameras.push(Ye)}let me=i.enabledFeatures;if(me&&me.includes("depth-sensing")){let Ne=u.getDepthInformation(Te[0]);Ne&&Ne.isValid&&Ne.texture&&v.init(e,Ne,i.renderState)}}for(let Te=0;Te<b.length;Te++){let Re=M[Te],me=b[Te];Re!==null&&me!==void 0&&me.update(Re,pe,l||n)}_e&&_e(J,pe),pe.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:pe}),p=null}let De=new kh;De.setAnimationLoop(Be),this.setAnimationLoop=function(J){_e=J},this.dispose=function(){}}},mi=new bi,b_=new ut;function T_(e,t){function r(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Oh(e)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function a(m,f,b,M,C){f.isMeshBasicMaterial||f.isMeshLambertMaterial?n(m,f):f.isMeshToonMaterial?(n(m,f),h(m,f)):f.isMeshPhongMaterial?(n(m,f),u(m,f)):f.isMeshStandardMaterial?(n(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,C)):f.isMeshMatcapMaterial?(n(m,f),v(m,f)):f.isMeshDepthMaterial?n(m,f):f.isMeshDistanceMaterial?(n(m,f),g(m,f)):f.isMeshNormalMaterial?n(m,f):f.isLineBasicMaterial?(s(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,b,M):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function n(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,r(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,r(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,r(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Vt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,r(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Vt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,r(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,r(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,r(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let b=t.get(f),M=b.envMap,C=b.envMapRotation;M&&(m.envMap.value=M,mi.copy(C),mi.x*=-1,mi.y*=-1,mi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),m.envMapRotation.value.setFromMatrix4(b_.makeRotationFromEuler(mi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,r(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,r(f.aoMap,m.aoMapTransform))}function s(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,r(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,b,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=M*.5,f.map&&(m.map.value=f.map,r(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,r(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,r(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,r(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,r(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,r(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,r(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,r(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,r(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,r(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,r(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Vt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,r(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,r(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,r(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,r(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,r(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,r(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,r(f.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){let b=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function w_(e,t,r,i){let a={},n={},s=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,M){let C=M.program;i.uniformBlockBinding(b,C)}function c(b,M){let C=a[b.id];C===void 0&&(v(b),C=u(b),a[b.id]=C,b.addEventListener("dispose",m));let G=M.program;i.updateUBOMapping(b,G);let S=t.render.frame;n[b.id]!==S&&(d(b),n[b.id]=S)}function u(b){let M=h();b.__bindingPointIndex=M;let C=e.createBuffer(),G=b.__size,S=b.usage;return e.bindBuffer(e.UNIFORM_BUFFER,C),e.bufferData(e.UNIFORM_BUFFER,G,S),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,M,C),C}function h(){for(let b=0;b<o;b++)if(s.indexOf(b)===-1)return s.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let M=a[b.id],C=b.uniforms,G=b.__cache;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let S=0,A=C.length;S<A;S++){let k=Array.isArray(C[S])?C[S]:[C[S]];for(let y=0,E=k.length;y<E;y++){let U=k[y];if(p(U,S,y,G)===!0){let H=U.__offset,Y=Array.isArray(U.value)?U.value:[U.value],Z=0;for(let re=0;re<Y.length;re++){let $=Y[re],oe=g($);typeof $=="number"||typeof $=="boolean"?(U.__data[0]=$,e.bufferSubData(e.UNIFORM_BUFFER,H+Z,U.__data)):$.isMatrix3?(U.__data[0]=$.elements[0],U.__data[1]=$.elements[1],U.__data[2]=$.elements[2],U.__data[3]=0,U.__data[4]=$.elements[3],U.__data[5]=$.elements[4],U.__data[6]=$.elements[5],U.__data[7]=0,U.__data[8]=$.elements[6],U.__data[9]=$.elements[7],U.__data[10]=$.elements[8],U.__data[11]=0):($.toArray(U.__data,Z),Z+=oe.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,H,U.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(b,M,C,G){let S=b.value,A=M+"_"+C;if(G[A]===void 0)return typeof S=="number"||typeof S=="boolean"?G[A]=S:G[A]=S.clone(),!0;{let k=G[A];if(typeof S=="number"||typeof S=="boolean"){if(k!==S)return G[A]=S,!0}else if(k.equals(S)===!1)return k.copy(S),!0}return!1}function v(b){let M=b.uniforms,C=0,G=16;for(let A=0,k=M.length;A<k;A++){let y=Array.isArray(M[A])?M[A]:[M[A]];for(let E=0,U=y.length;E<U;E++){let H=y[E],Y=Array.isArray(H.value)?H.value:[H.value];for(let Z=0,re=Y.length;Z<re;Z++){let $=Y[Z],oe=g($),Q=C%G,he=Q%oe.boundary,_e=Q+he;C+=he,_e!==0&&G-_e<oe.storage&&(C+=G-_e),H.__data=new Float32Array(oe.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=C,C+=oe.storage}}}let S=C%G;return S>0&&(C+=G-S),b.__size=C,b.__cache={},this}function g(b){let M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function m(b){let M=b.target;M.removeEventListener("dispose",m);let C=s.indexOf(M.__bindingPointIndex);s.splice(C,1),e.deleteBuffer(a[M.id]),delete a[M.id],delete n[M.id]}function f(){for(let b in a)e.deleteBuffer(a[b]);s=[],a={},n={}}return{bind:l,update:c,dispose:f}}var Ol=class{constructor(e={}){let{canvas:t=mf(),context:r=null,depth:i=!0,stencil:a=!1,alpha:n=!1,antialias:s=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let d;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=r.getContextAttributes().alpha}else d=n;let p=new Uint32Array(4),v=new Int32Array(4),g=null,m=null,f=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=St,this.toneMapping=Jr,this.toneMappingExposure=1;let M=this,C=!1,G=0,S=0,A=null,k=-1,y=null,E=new Mt,U=new Mt,H=null,Y=new qe(0),Z=0,re=t.width,$=t.height,oe=1,Q=null,he=null,_e=new Mt(0,0,re,$),Be=new Mt(0,0,re,$),De=!1,J=new Nl,pe=!1,Te=!1,Re=new ut,me=new ut,Ne=new N,it=new Mt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ye=!1;function _t(){return A===null?oe:1}let O=r;function mt(x,F){return t.getContext(x,F)}try{let x={alpha:!0,depth:i,stencil:a,antialias:s,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Tl}`),t.addEventListener("webglcontextlost",V,!1),t.addEventListener("webglcontextrestored",q,!1),t.addEventListener("webglcontextcreationerror",ne,!1),O===null){let F="webgl2";if(O=mt(F,x),O===null)throw mt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let $e,et,ye,tt,Pe,Fe,T,_,B,ie,se,ee,Le,ge,Me,ze,de,w,D,L,z,K,te,ue;function R(){$e=new D0(O),$e.init(),K=new v_(O,$e),et=new w0(O,$e,e,K),ye=new f_(O,$e),et.reverseDepthBuffer&&h&&ye.buffers.depth.setReversed(!0),tt=new I0(O),Pe=new Qv,Fe=new g_(O,$e,ye,Pe,et,K,tt),T=new C0(M),_=new L0(M),B=new Vf(O),te=new b0(O,B),ie=new U0(O,B,tt,te),se=new F0(O,ie,B,tt),D=new O0(O,et,Fe),ze=new A0(Pe),ee=new $v(M,T,_,$e,et,te,ze),Le=new T_(M,Pe),ge=new t_,Me=new o_($e),w=new E0(M,T,_,ye,se,d,o),de=new d_(M,se,et),ue=new w_(O,tt,et,ye),L=new T0(O,$e,tt),z=new N0(O,$e,tt),tt.programs=ee.programs,M.capabilities=et,M.extensions=$e,M.properties=Pe,M.renderLists=ge,M.shadowMap=de,M.state=ye,M.info=tt}R();let j=new E_(M,O);this.xr=j,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let x=$e.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=$e.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(x){x!==void 0&&(oe=x,this.setSize(re,$,!1))},this.getSize=function(x){return x.set(re,$)},this.setSize=function(x,F,W=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}re=x,$=F,t.width=Math.floor(x*oe),t.height=Math.floor(F*oe),W===!0&&(t.style.width=x+"px",t.style.height=F+"px"),this.setViewport(0,0,x,F)},this.getDrawingBufferSize=function(x){return x.set(re*oe,$*oe).floor()},this.setDrawingBufferSize=function(x,F,W){re=x,$=F,oe=W,t.width=Math.floor(x*W),t.height=Math.floor(F*W),this.setViewport(0,0,x,F)},this.getCurrentViewport=function(x){return x.copy(E)},this.getViewport=function(x){return x.copy(_e)},this.setViewport=function(x,F,W,X){x.isVector4?_e.set(x.x,x.y,x.z,x.w):_e.set(x,F,W,X),ye.viewport(E.copy(_e).multiplyScalar(oe).round())},this.getScissor=function(x){return x.copy(Be)},this.setScissor=function(x,F,W,X){x.isVector4?Be.set(x.x,x.y,x.z,x.w):Be.set(x,F,W,X),ye.scissor(U.copy(Be).multiplyScalar(oe).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(x){ye.setScissorTest(De=x)},this.setOpaqueSort=function(x){Q=x},this.setTransparentSort=function(x){he=x},this.getClearColor=function(x){return x.copy(w.getClearColor())},this.setClearColor=function(){w.setClearColor.apply(w,arguments)},this.getClearAlpha=function(){return w.getClearAlpha()},this.setClearAlpha=function(){w.setClearAlpha.apply(w,arguments)},this.clear=function(x=!0,F=!0,W=!0){let X=0;if(x){let I=!1;if(A!==null){let ce=A.texture.format;I=ce===Ll||ce===Pl||ce===Rl}if(I){let ce=A.texture.type,xe=ce===Ur||ce===Si||ce===Ya||ce===sa||ce===Al||ce===Cl,Se=w.getClearColor(),we=w.getClearAlpha(),ke=Se.r,He=Se.g,Ue=Se.b;xe?(p[0]=ke,p[1]=He,p[2]=Ue,p[3]=we,O.clearBufferuiv(O.COLOR,0,p)):(v[0]=ke,v[1]=He,v[2]=Ue,v[3]=we,O.clearBufferiv(O.COLOR,0,v))}else X|=O.COLOR_BUFFER_BIT}F&&(X|=O.DEPTH_BUFFER_BIT),W&&(X|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",V,!1),t.removeEventListener("webglcontextrestored",q,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),ge.dispose(),Me.dispose(),Pe.dispose(),T.dispose(),_.dispose(),se.dispose(),te.dispose(),ue.dispose(),ee.dispose(),j.dispose(),j.removeEventListener("sessionstart",ot),j.removeEventListener("sessionend",Ti),qt.stop()};function V(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function q(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let x=tt.autoReset,F=de.enabled,W=de.autoUpdate,X=de.needsUpdate,I=de.type;R(),tt.autoReset=x,de.enabled=F,de.autoUpdate=W,de.needsUpdate=X,de.type=I}function ne(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function ae(x){let F=x.target;F.removeEventListener("dispose",ae),Ce(F)}function Ce(x){Xe(x),Pe.remove(x)}function Xe(x){let F=Pe.get(x).programs;F!==void 0&&(F.forEach(function(W){ee.releaseProgram(W)}),x.isShaderMaterial&&ee.releaseShaderCache(x))}this.renderBufferDirect=function(x,F,W,X,I,ce){F===null&&(F=je);let xe=I.isMesh&&I.matrixWorld.determinant()<0,Se=Kd(x,F,W,X,I);ye.setMaterial(X,xe);let we=W.index,ke=1;if(X.wireframe===!0){if(we=ie.getWireframeAttribute(W),we===void 0)return;ke=2}let He=W.drawRange,Ue=W.attributes.position,Qe=He.start*ke,dt=(He.start+He.count)*ke;ce!==null&&(Qe=Math.max(Qe,ce.start*ke),dt=Math.min(dt,(ce.start+ce.count)*ke)),we!==null?(Qe=Math.max(Qe,0),dt=Math.min(dt,we.count)):Ue!=null&&(Qe=Math.max(Qe,0),dt=Math.min(dt,Ue.count));let pt=dt-Qe;if(pt<0||pt===1/0)return;te.setup(I,X,Se,W,we);let xt,ft=L;if(we!==null&&(xt=B.get(we),ft=z,ft.setIndex(xt)),I.isMesh)X.wireframe===!0?(ye.setLineWidth(X.wireframeLinewidth*_t()),ft.setMode(O.LINES)):ft.setMode(O.TRIANGLES);else if(I.isLine){let Ae=X.linewidth;Ae===void 0&&(Ae=1),ye.setLineWidth(Ae*_t()),I.isLineSegments?ft.setMode(O.LINES):I.isLineLoop?ft.setMode(O.LINE_LOOP):ft.setMode(O.LINE_STRIP)}else I.isPoints?ft.setMode(O.POINTS):I.isSprite&&ft.setMode(O.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)ft.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if($e.get("WEBGL_multi_draw"))ft.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{let Ae=I._multiDrawStarts,ni=I._multiDrawCounts,si=I._multiDrawCount,ir=we?B.get(we).bytesPerElement:1,Ai=Pe.get(X).currentProgram.getUniforms();for(let Zt=0;Zt<si;Zt++)Ai.setValue(O,"_gl_DrawID",Zt),ft.render(Ae[Zt]/ir,ni[Zt])}else if(I.isInstancedMesh)ft.renderInstances(Qe,pt,I.count);else if(W.isInstancedBufferGeometry){let Ae=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ni=Math.min(W.instanceCount,Ae);ft.renderInstances(Qe,pt,ni)}else ft.render(Qe,pt)};function Je(x,F,W){x.transparent===!0&&x.side===Rr&&x.forceSinglePass===!1?(x.side=Vt,x.needsUpdate=!0,ht(x,F,W),x.side=$r,x.needsUpdate=!0,ht(x,F,W),x.side=Rr):ht(x,F,W)}this.compile=function(x,F,W=null){W===null&&(W=x),m=Me.get(W),m.init(F),b.push(m),W.traverseVisible(function(I){I.isLight&&I.layers.test(F.layers)&&(m.pushLight(I),I.castShadow&&m.pushShadow(I))}),x!==W&&x.traverseVisible(function(I){I.isLight&&I.layers.test(F.layers)&&(m.pushLight(I),I.castShadow&&m.pushShadow(I))}),m.setupLights();let X=new Set;return x.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;let ce=I.material;if(ce)if(Array.isArray(ce))for(let xe=0;xe<ce.length;xe++){let Se=ce[xe];Je(Se,W,I),X.add(Se)}else Je(ce,W,I),X.add(ce)}),b.pop(),m=null,X},this.compileAsync=function(x,F,W=null){let X=this.compile(x,F,W);return new Promise(I=>{function ce(){if(X.forEach(function(xe){Pe.get(xe).currentProgram.isReady()&&X.delete(xe)}),X.size===0){I(x);return}setTimeout(ce,10)}$e.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Ge=null;function jt(x){Ge&&Ge(x)}function ot(){qt.stop()}function Ti(){qt.start()}let qt=new kh;qt.setAnimationLoop(jt),typeof self<"u"&&qt.setContext(self),this.setAnimationLoop=function(x){Ge=x,j.setAnimationLoop(x),x===null?qt.stop():qt.start()},j.addEventListener("sessionstart",ot),j.addEventListener("sessionend",Ti),this.render=function(x,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),x.isScene===!0&&x.onBeforeRender(M,x,F,A),m=Me.get(x,b.length),m.init(F),b.push(m),me.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),J.setFromProjectionMatrix(me),Te=this.localClippingEnabled,pe=ze.init(this.clippingPlanes,Te),g=ge.get(x,f.length),g.init(),f.push(g),j.enabled===!0&&j.isPresenting===!0){let ce=M.xr.getDepthSensingMesh();ce!==null&&xa(ce,F,-1/0,M.sortObjects)}xa(x,F,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(Q,he),Ye=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Ye&&w.addToRenderList(g,x),this.info.render.frame++,pe===!0&&ze.beginShadows();let W=m.state.shadowsArray;de.render(W,x,F),pe===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=g.opaque,I=g.transmissive;if(m.setupLights(),F.isArrayCamera){let ce=F.cameras;if(I.length>0)for(let xe=0,Se=ce.length;xe<Se;xe++){let we=ce[xe];on(X,I,x,we)}Ye&&w.render(x);for(let xe=0,Se=ce.length;xe<Se;xe++){let we=ce[xe];ms(g,x,we,we.viewport)}}else I.length>0&&on(X,I,x,F),Ye&&w.render(x),ms(g,x,F);A!==null&&(Fe.updateMultisampleRenderTarget(A),Fe.updateRenderTargetMipmap(A)),x.isScene===!0&&x.onAfterRender(M,x,F),te.resetDefaultState(),k=-1,y=null,b.pop(),b.length>0?(m=b[b.length-1],pe===!0&&ze.setGlobalState(M.clippingPlanes,m.state.camera)):m=null,f.pop(),f.length>0?g=f[f.length-1]:g=null};function xa(x,F,W,X){if(x.visible===!1)return;if(x.layers.test(F.layers)){if(x.isGroup)W=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(F);else if(x.isLight)m.pushLight(x),x.castShadow&&m.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||J.intersectsSprite(x)){X&&it.setFromMatrixPosition(x.matrixWorld).applyMatrix4(me);let ce=se.update(x),xe=x.material;xe.visible&&g.push(x,ce,xe,W,it.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||J.intersectsObject(x))){let ce=se.update(x),xe=x.material;if(X&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),it.copy(x.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),it.copy(ce.boundingSphere.center)),it.applyMatrix4(x.matrixWorld).applyMatrix4(me)),Array.isArray(xe)){let Se=ce.groups;for(let we=0,ke=Se.length;we<ke;we++){let He=Se[we],Ue=xe[He.materialIndex];Ue&&Ue.visible&&g.push(x,ce,Ue,W,it.z,He)}}else xe.visible&&g.push(x,ce,xe,W,it.z,null)}}let I=x.children;for(let ce=0,xe=I.length;ce<xe;ce++)xa(I[ce],F,W,X)}function ms(x,F,W,X){let I=x.opaque,ce=x.transmissive,xe=x.transparent;m.setupLightsView(W),pe===!0&&ze.setGlobalState(M.clippingPlanes,W),X&&ye.viewport(E.copy(X)),I.length>0&&wi(I,F,W),ce.length>0&&wi(ce,F,W),xe.length>0&&wi(xe,F,W),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function on(x,F,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[X.id]===void 0&&(m.state.transmissionRenderTarget[X.id]=new Ei(1,1,{generateMipmaps:!0,type:$e.has("EXT_color_buffer_half_float")||$e.has("EXT_color_buffer_float")?Za:Ur,minFilter:Mi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));let I=m.state.transmissionRenderTarget[X.id],ce=X.viewport||E;I.setSize(ce.z,ce.w);let xe=M.getRenderTarget();M.setRenderTarget(I),M.getClearColor(Y),Z=M.getClearAlpha(),Z<1&&M.setClearColor(16777215,.5),M.clear(),Ye&&w.render(W);let Se=M.toneMapping;M.toneMapping=Jr;let we=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),m.setupLightsView(X),pe===!0&&ze.setGlobalState(M.clippingPlanes,X),wi(x,W,X),Fe.updateMultisampleRenderTarget(I),Fe.updateRenderTargetMipmap(I),$e.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let He=0,Ue=F.length;He<Ue;He++){let Qe=F[He],dt=Qe.object,pt=Qe.geometry,xt=Qe.material,ft=Qe.group;if(xt.side===Rr&&dt.layers.test(X.layers)){let Ae=xt.side;xt.side=Vt,xt.needsUpdate=!0,Tt(dt,W,X,pt,xt,ft),xt.side=Ae,xt.needsUpdate=!0,ke=!0}}ke===!0&&(Fe.updateMultisampleRenderTarget(I),Fe.updateRenderTargetMipmap(I))}M.setRenderTarget(xe),M.setClearColor(Y,Z),we!==void 0&&(X.viewport=we),M.toneMapping=Se}function wi(x,F,W){let X=F.isScene===!0?F.overrideMaterial:null;for(let I=0,ce=x.length;I<ce;I++){let xe=x[I],Se=xe.object,we=xe.geometry,ke=X===null?xe.material:X,He=xe.group;Se.layers.test(W.layers)&&Tt(Se,F,W,we,ke,He)}}function Tt(x,F,W,X,I,ce){x.onBeforeRender(M,F,W,X,I,ce),x.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),I.onBeforeRender(M,F,W,X,x,ce),I.transparent===!0&&I.side===Rr&&I.forceSinglePass===!1?(I.side=Vt,I.needsUpdate=!0,M.renderBufferDirect(W,F,X,I,x,ce),I.side=$r,I.needsUpdate=!0,M.renderBufferDirect(W,F,X,I,x,ce),I.side=Rr):M.renderBufferDirect(W,F,X,I,x,ce),x.onAfterRender(M,F,W,X,I,ce)}function ht(x,F,W){F.isScene!==!0&&(F=je);let X=Pe.get(x),I=m.state.lights,ce=m.state.shadowsArray,xe=I.state.version,Se=ee.getParameters(x,I.state,ce,F,W),we=ee.getProgramCacheKey(Se),ke=X.programs;X.environment=x.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(x.isMeshStandardMaterial?_:T).get(x.envMap||X.environment),X.envMapRotation=X.environment!==null&&x.envMap===null?F.environmentRotation:x.envMapRotation,ke===void 0&&(x.addEventListener("dispose",ae),ke=new Map,X.programs=ke);let He=ke.get(we);if(He!==void 0){if(X.currentProgram===He&&X.lightsStateVersion===xe)return Ot(x,Se),He}else Se.uniforms=ee.getUniforms(x),x.onBeforeCompile(Se,M),He=ee.acquireProgram(Se,we),ke.set(we,He),X.uniforms=Se.uniforms;let Ue=X.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ue.clippingPlanes=ze.uniform),Ot(x,Se),X.needsLights=Qd(x),X.lightsStateVersion=xe,X.needsLights&&(Ue.ambientLightColor.value=I.state.ambient,Ue.lightProbe.value=I.state.probe,Ue.directionalLights.value=I.state.directional,Ue.directionalLightShadows.value=I.state.directionalShadow,Ue.spotLights.value=I.state.spot,Ue.spotLightShadows.value=I.state.spotShadow,Ue.rectAreaLights.value=I.state.rectArea,Ue.ltc_1.value=I.state.rectAreaLTC1,Ue.ltc_2.value=I.state.rectAreaLTC2,Ue.pointLights.value=I.state.point,Ue.pointLightShadows.value=I.state.pointShadow,Ue.hemisphereLights.value=I.state.hemi,Ue.directionalShadowMap.value=I.state.directionalShadowMap,Ue.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Ue.spotShadowMap.value=I.state.spotShadowMap,Ue.spotLightMatrix.value=I.state.spotLightMatrix,Ue.spotLightMap.value=I.state.spotLightMap,Ue.pointShadowMap.value=I.state.pointShadowMap,Ue.pointShadowMatrix.value=I.state.pointShadowMatrix),X.currentProgram=He,X.uniformsList=null,He}function Yt(x){if(x.uniformsList===null){let F=x.currentProgram.getUniforms();x.uniformsList=Qn.seqWithValue(F.seq,x.uniforms)}return x.uniformsList}function Ot(x,F){let W=Pe.get(x);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function Kd(x,F,W,X,I){F.isScene!==!0&&(F=je),Fe.resetTextureUnits();let ce=F.fog,xe=X.isMeshStandardMaterial?F.environment:null,Se=A===null?M.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ca,we=(X.isMeshStandardMaterial?_:T).get(X.envMap||xe),ke=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,He=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ue=!!W.morphAttributes.position,Qe=!!W.morphAttributes.normal,dt=!!W.morphAttributes.color,pt=Jr;X.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(pt=M.toneMapping);let xt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ft=xt!==void 0?xt.length:0,Ae=Pe.get(X),ni=m.state.lights;if(pe===!0&&(Te===!0||x!==y)){let kt=x===y&&X.id===k;ze.setState(X,x,kt)}let si=!1;X.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ni.state.version||Ae.outputColorSpace!==Se||I.isBatchedMesh&&Ae.batching===!1||!I.isBatchedMesh&&Ae.batching===!0||I.isBatchedMesh&&Ae.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&Ae.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&Ae.instancing===!1||!I.isInstancedMesh&&Ae.instancing===!0||I.isSkinnedMesh&&Ae.skinning===!1||!I.isSkinnedMesh&&Ae.skinning===!0||I.isInstancedMesh&&Ae.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Ae.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&Ae.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&Ae.instancingMorph===!1&&I.morphTexture!==null||Ae.envMap!==we||X.fog===!0&&Ae.fog!==ce||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==ze.numPlanes||Ae.numIntersection!==ze.numIntersection)||Ae.vertexAlphas!==ke||Ae.vertexTangents!==He||Ae.morphTargets!==Ue||Ae.morphNormals!==Qe||Ae.morphColors!==dt||Ae.toneMapping!==pt||Ae.morphTargetsCount!==ft)&&(si=!0):(si=!0,Ae.__version=X.version);let ir=Ae.currentProgram;si===!0&&(ir=ht(X,F,I));let Ai=!1,Zt=!1,ya=!1,lt=ir.getUniforms(),pr=Ae.uniforms;if(ye.useProgram(ir.program)&&(Ai=!0,Zt=!0,ya=!0),X.id!==k&&(k=X.id,Zt=!0),Ai||y!==x){ye.buffers.depth.getReversed()?(Re.copy(x.projectionMatrix),vf(Re),_f(Re),lt.setValue(O,"projectionMatrix",Re)):lt.setValue(O,"projectionMatrix",x.projectionMatrix),lt.setValue(O,"viewMatrix",x.matrixWorldInverse);let kt=lt.map.cameraPosition;kt!==void 0&&kt.setValue(O,Ne.setFromMatrixPosition(x.matrixWorld)),et.logarithmicDepthBuffer&&lt.setValue(O,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&lt.setValue(O,"isOrthographic",x.isOrthographicCamera===!0),y!==x&&(y=x,Zt=!0,ya=!0)}if(I.isSkinnedMesh){lt.setOptional(O,I,"bindMatrix"),lt.setOptional(O,I,"bindMatrixInverse");let kt=I.skeleton;kt&&(kt.boneTexture===null&&kt.computeBoneTexture(),lt.setValue(O,"boneTexture",kt.boneTexture,Fe))}I.isBatchedMesh&&(lt.setOptional(O,I,"batchingTexture"),lt.setValue(O,"batchingTexture",I._matricesTexture,Fe),lt.setOptional(O,I,"batchingIdTexture"),lt.setValue(O,"batchingIdTexture",I._indirectTexture,Fe),lt.setOptional(O,I,"batchingColorTexture"),I._colorsTexture!==null&&lt.setValue(O,"batchingColorTexture",I._colorsTexture,Fe));let Ma=W.morphAttributes;if((Ma.position!==void 0||Ma.normal!==void 0||Ma.color!==void 0)&&D.update(I,W,ir),(Zt||Ae.receiveShadow!==I.receiveShadow)&&(Ae.receiveShadow=I.receiveShadow,lt.setValue(O,"receiveShadow",I.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(pr.envMap.value=we,pr.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(pr.envMapIntensity.value=F.environmentIntensity),Zt&&(lt.setValue(O,"toneMappingExposure",M.toneMappingExposure),Ae.needsLights&&$d(pr,ya),ce&&X.fog===!0&&Le.refreshFogUniforms(pr,ce),Le.refreshMaterialUniforms(pr,X,oe,$,m.state.transmissionRenderTarget[x.id]),Qn.upload(O,Yt(Ae),pr,Fe)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Qn.upload(O,Yt(Ae),pr,Fe),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&lt.setValue(O,"center",I.center),lt.setValue(O,"modelViewMatrix",I.modelViewMatrix),lt.setValue(O,"normalMatrix",I.normalMatrix),lt.setValue(O,"modelMatrix",I.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let kt=X.uniformsGroups;for(let Sa=0,zr=kt.length;Sa<zr;Sa++){let hc=kt[Sa];ue.update(hc,ir),ue.bind(hc,ir)}}return ir}function $d(x,F){x.ambientLightColor.needsUpdate=F,x.lightProbe.needsUpdate=F,x.directionalLights.needsUpdate=F,x.directionalLightShadows.needsUpdate=F,x.pointLights.needsUpdate=F,x.pointLightShadows.needsUpdate=F,x.spotLights.needsUpdate=F,x.spotLightShadows.needsUpdate=F,x.rectAreaLights.needsUpdate=F,x.hemisphereLights.needsUpdate=F}function Qd(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(x,F,W){Pe.get(x.texture).__webglTexture=F,Pe.get(x.depthTexture).__webglTexture=W;let X=Pe.get(x);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||$e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,F){let W=Pe.get(x);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(x,F=0,W=0){A=x,G=F,S=W;let X=!0,I=null,ce=!1,xe=!1;if(x){let Se=Pe.get(x);if(Se.__useDefaultFramebuffer!==void 0)ye.bindFramebuffer(O.FRAMEBUFFER,null),X=!1;else if(Se.__webglFramebuffer===void 0)Fe.setupRenderTarget(x);else if(Se.__hasExternalTextures)Fe.rebindTextures(x,Pe.get(x.texture).__webglTexture,Pe.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let He=x.depthTexture;if(Se.__boundDepthTexture!==He){if(He!==null&&Pe.has(He)&&(x.width!==He.image.width||x.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(x)}}let we=x.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(xe=!0);let ke=Pe.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(ke[F])?I=ke[F][W]:I=ke[F],ce=!0):x.samples>0&&Fe.useMultisampledRTT(x)===!1?I=Pe.get(x).__webglMultisampledFramebuffer:Array.isArray(ke)?I=ke[W]:I=ke,E.copy(x.viewport),U.copy(x.scissor),H=x.scissorTest}else E.copy(_e).multiplyScalar(oe).floor(),U.copy(Be).multiplyScalar(oe).floor(),H=De;if(ye.bindFramebuffer(O.FRAMEBUFFER,I)&&X&&ye.drawBuffers(x,I),ye.viewport(E),ye.scissor(U),ye.setScissorTest(H),ce){let Se=Pe.get(x.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,Se.__webglTexture,W)}else if(xe){let Se=Pe.get(x.texture),we=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Se.__webglTexture,W||0,we)}k=-1},this.readRenderTargetPixels=function(x,F,W,X,I,ce,xe){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Pe.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){ye.bindFramebuffer(O.FRAMEBUFFER,Se);try{let we=x.texture,ke=we.format,He=we.type;if(!et.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=x.width-X&&W>=0&&W<=x.height-I&&O.readPixels(F,W,X,I,K.convert(ke),K.convert(He),ce)}finally{let we=A!==null?Pe.get(A).__webglFramebuffer:null;ye.bindFramebuffer(O.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(x,F,W,X,I,ce,xe){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Pe.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){let we=x.texture,ke=we.format,He=we.type;if(!et.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=x.width-X&&W>=0&&W<=x.height-I){ye.bindFramebuffer(O.FRAMEBUFFER,Se);let Ue=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ue),O.bufferData(O.PIXEL_PACK_BUFFER,ce.byteLength,O.STREAM_READ),O.readPixels(F,W,X,I,K.convert(ke),K.convert(He),0);let Qe=A!==null?Pe.get(A).__webglFramebuffer:null;ye.bindFramebuffer(O.FRAMEBUFFER,Qe);let dt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await gf(O,dt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ue),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ce),O.deleteBuffer(Ue),O.deleteSync(dt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,F=null,W=0){x.isTexture!==!0&&(Wa("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,x=arguments[1]);let X=Math.pow(2,-W),I=Math.floor(x.image.width*X),ce=Math.floor(x.image.height*X),xe=F!==null?F.x:0,Se=F!==null?F.y:0;Fe.setTexture2D(x,0),O.copyTexSubImage2D(O.TEXTURE_2D,W,0,0,xe,Se,I,ce),ye.unbindTexture()},this.copyTextureToTexture=function(x,F,W=null,X=null,I=0){x.isTexture!==!0&&(Wa("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,x=arguments[1],F=arguments[2],I=arguments[3]||0,W=null);let ce,xe,Se,we,ke,He,Ue,Qe,dt,pt=x.isCompressedTexture?x.mipmaps[I]:x.image;W!==null?(ce=W.max.x-W.min.x,xe=W.max.y-W.min.y,Se=W.isBox3?W.max.z-W.min.z:1,we=W.min.x,ke=W.min.y,He=W.isBox3?W.min.z:0):(ce=pt.width,xe=pt.height,Se=pt.depth||1,we=0,ke=0,He=0),X!==null?(Ue=X.x,Qe=X.y,dt=X.z):(Ue=0,Qe=0,dt=0);let xt=K.convert(F.format),ft=K.convert(F.type),Ae;F.isData3DTexture?(Fe.setTexture3D(F,0),Ae=O.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Fe.setTexture2DArray(F,0),Ae=O.TEXTURE_2D_ARRAY):(Fe.setTexture2D(F,0),Ae=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,F.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,F.unpackAlignment);let ni=O.getParameter(O.UNPACK_ROW_LENGTH),si=O.getParameter(O.UNPACK_IMAGE_HEIGHT),ir=O.getParameter(O.UNPACK_SKIP_PIXELS),Ai=O.getParameter(O.UNPACK_SKIP_ROWS),Zt=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,pt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,pt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,we),O.pixelStorei(O.UNPACK_SKIP_ROWS,ke),O.pixelStorei(O.UNPACK_SKIP_IMAGES,He);let ya=x.isDataArrayTexture||x.isData3DTexture,lt=F.isDataArrayTexture||F.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){let pr=Pe.get(x),Ma=Pe.get(F),kt=Pe.get(pr.__renderTarget),Sa=Pe.get(Ma.__renderTarget);ye.bindFramebuffer(O.READ_FRAMEBUFFER,kt.__webglFramebuffer),ye.bindFramebuffer(O.DRAW_FRAMEBUFFER,Sa.__webglFramebuffer);for(let zr=0;zr<Se;zr++)ya&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pe.get(x).__webglTexture,I,He+zr),x.isDepthTexture?(lt&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pe.get(F).__webglTexture,I,dt+zr),O.blitFramebuffer(we,ke,ce,xe,Ue,Qe,ce,xe,O.DEPTH_BUFFER_BIT,O.NEAREST)):lt?O.copyTexSubImage3D(Ae,I,Ue,Qe,dt+zr,we,ke,ce,xe):O.copyTexSubImage2D(Ae,I,Ue,Qe,dt+zr,we,ke,ce,xe);ye.bindFramebuffer(O.READ_FRAMEBUFFER,null),ye.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else lt?x.isDataTexture||x.isData3DTexture?O.texSubImage3D(Ae,I,Ue,Qe,dt,ce,xe,Se,xt,ft,pt.data):F.isCompressedArrayTexture?O.compressedTexSubImage3D(Ae,I,Ue,Qe,dt,ce,xe,Se,xt,pt.data):O.texSubImage3D(Ae,I,Ue,Qe,dt,ce,xe,Se,xt,ft,pt):x.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,I,Ue,Qe,ce,xe,xt,ft,pt.data):x.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,I,Ue,Qe,pt.width,pt.height,xt,pt.data):O.texSubImage2D(O.TEXTURE_2D,I,Ue,Qe,ce,xe,xt,ft,pt);O.pixelStorei(O.UNPACK_ROW_LENGTH,ni),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,si),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ir),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ai),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Zt),I===0&&F.generateMipmaps&&O.generateMipmap(Ae),ye.unbindTexture()},this.copyTextureToTexture3D=function(x,F,W=null,X=null,I=0){return x.isTexture!==!0&&(Wa("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,x=arguments[2],F=arguments[3],I=arguments[4]||0),Wa('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,F,W,X,I)},this.initRenderTarget=function(x){Pe.get(x).__webglFramebuffer===void 0&&Fe.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?Fe.setTextureCube(x,0):x.isData3DTexture?Fe.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?Fe.setTexture2DArray(x,0):Fe.setTexture2D(x,0),ye.unbindTexture()},this.resetState=function(){G=0,S=0,A=null,ye.reset(),te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Lr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}},ss=class extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},A_=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=yl,this.updateRanges=[],this.version=0,this.uuid=Kr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,r){e*=this.stride,r*=t.stride;for(let i=0,a=this.stride;i<a;i++)this.array[e+i]=t.array[r+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(t,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ft=new N,Ku=class jh{constructor(t,r,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=r,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let r=0,i=this.data.count;r<i;r++)Ft.fromBufferAttribute(this,r),Ft.applyMatrix4(t),this.setXYZ(r,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(t){for(let r=0,i=this.count;r<i;r++)Ft.fromBufferAttribute(this,r),Ft.applyNormalMatrix(t),this.setXYZ(r,Ft.x,Ft.y,Ft.z);return this}transformDirection(t){for(let r=0,i=this.count;r<i;r++)Ft.fromBufferAttribute(this,r),Ft.transformDirection(t),this.setXYZ(r,Ft.x,Ft.y,Ft.z);return this}getComponent(t,r){let i=this.array[t*this.data.stride+this.offset+r];return this.normalized&&(i=_r(i,this.array)),i}setComponent(t,r,i){return this.normalized&&(i=nt(i,this.array)),this.data.array[t*this.data.stride+this.offset+r]=i,this}setX(t,r){return this.normalized&&(r=nt(r,this.array)),this.data.array[t*this.data.stride+this.offset]=r,this}setY(t,r){return this.normalized&&(r=nt(r,this.array)),this.data.array[t*this.data.stride+this.offset+1]=r,this}setZ(t,r){return this.normalized&&(r=nt(r,this.array)),this.data.array[t*this.data.stride+this.offset+2]=r,this}setW(t,r){return this.normalized&&(r=nt(r,this.array)),this.data.array[t*this.data.stride+this.offset+3]=r,this}getX(t){let r=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(r=_r(r,this.array)),r}getY(t){let r=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(r=_r(r,this.array)),r}getZ(t){let r=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(r=_r(r,this.array)),r}getW(t){let r=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(r=_r(r,this.array)),r}setXY(t,r,i){return t=t*this.data.stride+this.offset,this.normalized&&(r=nt(r,this.array),i=nt(i,this.array)),this.data.array[t+0]=r,this.data.array[t+1]=i,this}setXYZ(t,r,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(r=nt(r,this.array),i=nt(i,this.array),a=nt(a,this.array)),this.data.array[t+0]=r,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,r,i,a,n){return t=t*this.data.stride+this.offset,this.normalized&&(r=nt(r,this.array),i=nt(i,this.array),a=nt(a,this.array),n=nt(n,this.array)),this.data.array[t+0]=r,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=n,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let r=[];for(let i=0;i<this.count;i++){let a=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)r.push(this.data.array[a+n])}return new Pt(new this.array.constructor(r),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new jh(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let r=[];for(let i=0;i<this.count;i++){let a=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)r.push(this.data.array[a+n])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:r,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ma=class extends da{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ji,Ha=new N,qi=new N,Yi=new N,Zi=new ve,Va=new ve,qh=new ut,Hn=new N,Ga=new N,Vn=new N,$u=new ve,Ro=new ve,Qu=new ve,$a=class extends Wt{constructor(e=new ma){if(super(),this.isSprite=!0,this.type="Sprite",ji===void 0){ji=new $t;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),r=new A_(t,5);ji.setIndex([0,1,2,0,2,3]),ji.setAttribute("position",new Ku(r,3,0,!1)),ji.setAttribute("uv",new Ku(r,2,3,!1))}this.geometry=ji,this.material=e,this.center=new ve(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qi.setFromMatrixScale(this.matrixWorld),qh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Yi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qi.multiplyScalar(-Yi.z);let r=this.material.rotation,i,a;r!==0&&(a=Math.cos(r),i=Math.sin(r));let n=this.center;Gn(Hn.set(-.5,-.5,0),Yi,n,qi,i,a),Gn(Ga.set(.5,-.5,0),Yi,n,qi,i,a),Gn(Vn.set(.5,.5,0),Yi,n,qi,i,a),$u.set(0,0),Ro.set(1,0),Qu.set(1,1);let s=e.ray.intersectTriangle(Hn,Ga,Vn,!1,Ha);if(s===null&&(Gn(Ga.set(-.5,.5,0),Yi,n,qi,i,a),Ro.set(0,1),s=e.ray.intersectTriangle(Hn,Vn,Ga,!1,Ha),s===null))return;let o=e.ray.origin.distanceTo(Ha);o<e.near||o>e.far||t.push({distance:o,point:Ha.clone(),uv:Ji.getInterpolation(Ha,Hn,Ga,Vn,$u,Ro,Qu,new ve),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Gn(e,t,r,i,a,n){Zi.subVectors(e,r).addScalar(.5).multiply(i),a!==void 0?(Va.x=n*Zi.x-a*Zi.y,Va.y=a*Zi.x+n*Zi.y):Va.copy(Zi),e.copy(t),e.x+=Va.x,e.y+=Va.y,e.applyMatrix4(qh)}var ga=class extends cr{constructor(e,t,r,i,a,n,s,o,l){super(e,t,r,i,a,n,s,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},yr=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let r=this.getUtoTmapping(e);return this.getPoint(r,t)}getPoints(e=5){let t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return t}getSpacedPoints(e=5){let t=[];for(let r=0;r<=e;r++)t.push(this.getPointAt(r/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],r,i=this.getPoint(0),a=0;t.push(0);for(let n=1;n<=e;n++)r=this.getPoint(n/e),a+=r.distanceTo(i),t.push(a),i=r;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let r=this.getLengths(),i=0,a=r.length,n;t?n=t:n=e*r[a-1];let s=0,o=a-1,l;for(;s<=o;)if(i=Math.floor(s+(o-s)/2),l=r[i]-n,l<0)s=i+1;else if(l>0)o=i-1;else{o=i;break}if(i=o,r[i]===n)return i/(a-1);let c=r[i],u=r[i+1]-c,h=(n-c)/u;return(i+h)/(a-1)}getTangent(e,t){let r=e-1e-4,i=e+1e-4;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),n=this.getPoint(i),s=t||(a.isVector2?new ve:new N);return s.copy(n).sub(a).normalize(),s}getTangentAt(e,t){let r=this.getUtoTmapping(e);return this.getTangent(r,t)}computeFrenetFrames(e,t){let r=new N,i=[],a=[],n=[],s=new N,o=new ut;for(let d=0;d<=e;d++){let p=d/e;i[d]=this.getTangentAt(p,new N)}a[0]=new N,n[0]=new N;let l=Number.MAX_VALUE,c=Math.abs(i[0].x),u=Math.abs(i[0].y),h=Math.abs(i[0].z);c<=l&&(l=c,r.set(1,0,0)),u<=l&&(l=u,r.set(0,1,0)),h<=l&&r.set(0,0,1),s.crossVectors(i[0],r).normalize(),a[0].crossVectors(i[0],s),n[0].crossVectors(i[0],a[0]);for(let d=1;d<=e;d++){if(a[d]=a[d-1].clone(),n[d]=n[d-1].clone(),s.crossVectors(i[d-1],i[d]),s.length()>Number.EPSILON){s.normalize();let p=Math.acos(Rt(i[d-1].dot(i[d]),-1,1));a[d].applyMatrix4(o.makeRotationAxis(s,p))}n[d].crossVectors(i[d],a[d])}if(t===!0){let d=Math.acos(Rt(a[0].dot(a[e]),-1,1));d/=e,i[0].dot(s.crossVectors(a[0],a[e]))>0&&(d=-d);for(let p=1;p<=e;p++)a[p].applyMatrix4(o.makeRotationAxis(i[p],d*p)),n[p].crossVectors(i[p],a[p])}return{tangents:i,normals:a,binormals:n}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Fl=class extends yr{constructor(e=0,t=0,r=1,i=1,a=0,n=Math.PI*2,s=!1,o=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=r,this.yRadius=i,this.aStartAngle=a,this.aEndAngle=n,this.aClockwise=s,this.aRotation=o}getPoint(e,t=new ve){let r=t,i=Math.PI*2,a=this.aEndAngle-this.aStartAngle,n=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=i;for(;a>i;)a-=i;a<Number.EPSILON&&(n?a=0:a=i),this.aClockwise===!0&&!n&&(a===i?a=-i:a=a-i);let s=this.aStartAngle+e*a,o=this.aX+this.xRadius*Math.cos(s),l=this.aY+this.yRadius*Math.sin(s);if(this.aRotation!==0){let c=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=o-this.aX,d=l-this.aY;o=h*c-d*u+this.aX,l=h*u+d*c+this.aY}return r.set(o,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},C_=class extends Fl{constructor(e,t,r,i,a,n){super(e,t,r,r,i,a,n),this.isArcCurve=!0,this.type="ArcCurve"}};function zl(){let e=0,t=0,r=0,i=0;function a(n,s,o,l){e=n,t=o,r=-3*n+3*s-2*o-l,i=2*n-2*s+o+l}return{initCatmullRom:function(n,s,o,l,c){a(s,o,c*(o-n),c*(l-s))},initNonuniformCatmullRom:function(n,s,o,l,c,u,h){let d=(s-n)/c-(o-n)/(c+u)+(o-s)/u,p=(o-s)/u-(l-s)/(u+h)+(l-o)/h;d*=u,p*=u,a(s,o,d,p)},calc:function(n){let s=n*n,o=s*n;return e+t*n+r*s+i*o}}}var Wn=new N,Po=new zl,Lo=new zl,Do=new zl,R_=class extends yr{constructor(e=[],t=!1,r="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=r,this.tension=i}getPoint(e,t=new N){let r=t,i=this.points,a=i.length,n=(a-(this.closed?0:1))*e,s=Math.floor(n),o=n-s;this.closed?s+=s>0?0:(Math.floor(Math.abs(s)/a)+1)*a:o===0&&s===a-1&&(s=a-2,o=1);let l,c;this.closed||s>0?l=i[(s-1)%a]:(Wn.subVectors(i[0],i[1]).add(i[0]),l=Wn);let u=i[s%a],h=i[(s+1)%a];if(this.closed||s+2<a?c=i[(s+2)%a]:(Wn.subVectors(i[a-1],i[a-2]).add(i[a-1]),c=Wn),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(h),d),g=Math.pow(h.distanceToSquared(c),d);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),Po.initNonuniformCatmullRom(l.x,u.x,h.x,c.x,p,v,g),Lo.initNonuniformCatmullRom(l.y,u.y,h.y,c.y,p,v,g),Do.initNonuniformCatmullRom(l.z,u.z,h.z,c.z,p,v,g)}else this.curveType==="catmullrom"&&(Po.initCatmullRom(l.x,u.x,h.x,c.x,this.tension),Lo.initCatmullRom(l.y,u.y,h.y,c.y,this.tension),Do.initCatmullRom(l.z,u.z,h.z,c.z,this.tension));return r.set(Po.calc(o),Lo.calc(o),Do.calc(o)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(new N().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function eh(e,t,r,i,a){let n=(i-t)*.5,s=(a-r)*.5,o=e*e,l=e*o;return(2*r-2*i+n+s)*l+(-3*r+3*i-2*n-s)*o+n*e+r}function P_(e,t){let r=1-e;return r*r*t}function L_(e,t){return 2*(1-e)*e*t}function D_(e,t){return e*e*t}function ja(e,t,r,i){return P_(e,t)+L_(e,r)+D_(e,i)}function U_(e,t){let r=1-e;return r*r*r*t}function N_(e,t){let r=1-e;return 3*r*r*e*t}function I_(e,t){return 3*(1-e)*e*e*t}function O_(e,t){return e*e*e*t}function qa(e,t,r,i,a){return U_(e,t)+N_(e,r)+I_(e,i)+O_(e,a)}var Yh=class extends yr{constructor(e=new ve,t=new ve,r=new ve,i=new ve){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=r,this.v3=i}getPoint(e,t=new ve){let r=t,i=this.v0,a=this.v1,n=this.v2,s=this.v3;return r.set(qa(e,i.x,a.x,n.x,s.x),qa(e,i.y,a.y,n.y,s.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},F_=class extends yr{constructor(e=new N,t=new N,r=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=r,this.v3=i}getPoint(e,t=new N){let r=t,i=this.v0,a=this.v1,n=this.v2,s=this.v3;return r.set(qa(e,i.x,a.x,n.x,s.x),qa(e,i.y,a.y,n.y,s.y),qa(e,i.z,a.z,n.z,s.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Zh=class extends yr{constructor(e=new ve,t=new ve){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ve){let r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ve){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},z_=class extends yr{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){let r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jh=class extends yr{constructor(e=new ve,t=new ve,r=new ve){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new ve){let r=t,i=this.v0,a=this.v1,n=this.v2;return r.set(ja(e,i.x,a.x,n.x),ja(e,i.y,a.y,n.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},k_=class extends yr{constructor(e=new N,t=new N,r=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new N){let r=t,i=this.v0,a=this.v1,n=this.v2;return r.set(ja(e,i.x,a.x,n.x),ja(e,i.y,a.y,n.y),ja(e,i.z,a.z,n.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Kh=class extends yr{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ve){let r=t,i=this.points,a=(i.length-1)*e,n=Math.floor(a),s=a-n,o=i[n===0?n:n-1],l=i[n],c=i[n>i.length-2?i.length-1:n+1],u=i[n>i.length-3?i.length-1:n+2];return r.set(eh(s,o.x,l.x,c.x,u.x),eh(s,o.y,l.y,c.y,u.y)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(new ve().fromArray(i))}return this}},th=Object.freeze({__proto__:null,ArcCurve:C_,CatmullRomCurve3:R_,CubicBezierCurve:Yh,CubicBezierCurve3:F_,EllipseCurve:Fl,LineCurve:Zh,LineCurve3:z_,QuadraticBezierCurve:Jh,QuadraticBezierCurve3:k_,SplineCurve:Kh}),B_=class extends yr{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let r=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new th[r](t,e))}return this}getPoint(e,t){let r=e*this.getLength(),i=this.getCurveLengths(),a=0;for(;a<i.length;){if(i[a]>=r){let n=i[a]-r,s=this.curves[a],o=s.getLength(),l=o===0?0:1-n/o;return s.getPointAt(l,t)}a++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let r=0,i=this.curves.length;r<i;r++)t+=this.curves[r].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],r;for(let i=0,a=this.curves;i<a.length;i++){let n=a[i],s=n.isEllipseCurve?e*2:n.isLineCurve||n.isLineCurve3?1:n.isSplineCurve?e*n.points.length:e,o=n.getPoints(s);for(let l=0;l<o.length;l++){let c=o[l];r&&r.equals(c)||(t.push(c),r=c)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,r=this.curves.length;t<r;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){let i=e.curves[t];this.curves.push(new th[i.type]().fromJSON(i))}return this}},H_=class extends B_{constructor(e){super(),this.type="Path",this.currentPoint=new ve,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,r=e.length;t<r;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let r=new Zh(this.currentPoint.clone(),new ve(e,t));return this.curves.push(r),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,r,i){let a=new Jh(this.currentPoint.clone(),new ve(e,t),new ve(r,i));return this.curves.push(a),this.currentPoint.set(r,i),this}bezierCurveTo(e,t,r,i,a,n){let s=new Yh(this.currentPoint.clone(),new ve(e,t),new ve(r,i),new ve(a,n));return this.curves.push(s),this.currentPoint.set(a,n),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),r=new Kh(t);return this.curves.push(r),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,r,i,a,n){let s=this.currentPoint.x,o=this.currentPoint.y;return this.absarc(e+s,t+o,r,i,a,n),this}absarc(e,t,r,i,a,n){return this.absellipse(e,t,r,r,i,a,n),this}ellipse(e,t,r,i,a,n,s,o){let l=this.currentPoint.x,c=this.currentPoint.y;return this.absellipse(e+l,t+c,r,i,a,n,s,o),this}absellipse(e,t,r,i,a,n,s,o){let l=new Fl(e,t,r,i,a,n,s,o);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let c=l.getPoint(1);return this.currentPoint.copy(c),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},V_=class $h extends $t{constructor(t=[new ve(0,-.5),new ve(.5,0),new ve(0,.5)],r=12,i=0,a=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:r,phiStart:i,phiLength:a},r=Math.floor(r),a=Rt(a,0,Math.PI*2);let n=[],s=[],o=[],l=[],c=[],u=1/r,h=new N,d=new ve,p=new N,v=new N,g=new N,m=0,f=0;for(let b=0;b<=t.length-1;b++)switch(b){case 0:m=t[b+1].x-t[b].x,f=t[b+1].y-t[b].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(g.x,g.y,g.z);break;default:m=t[b+1].x-t[b].x,f=t[b+1].y-t[b].y,p.x=f*1,p.y=-m,p.z=f*0,v.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),l.push(p.x,p.y,p.z),g.copy(v)}for(let b=0;b<=r;b++){let M=i+b*u*a,C=Math.sin(M),G=Math.cos(M);for(let S=0;S<=t.length-1;S++){h.x=t[S].x*C,h.y=t[S].y,h.z=t[S].x*G,s.push(h.x,h.y,h.z),d.x=b/r,d.y=S/(t.length-1),o.push(d.x,d.y);let A=l[3*S+0]*C,k=l[3*S+1],y=l[3*S+0]*G;c.push(A,k,y)}}for(let b=0;b<r;b++)for(let M=0;M<t.length-1;M++){let C=M+b*t.length,G=C,S=C+t.length,A=C+t.length+1,k=C+1;n.push(G,S,k),n.push(A,k,S)}this.setIndex(n),this.setAttribute("position",new vt(s,3)),this.setAttribute("uv",new vt(o,2)),this.setAttribute("normal",new vt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $h(t.points,t.segments,t.phiStart,t.phiLength)}},Qh=class ed extends V_{constructor(t=1,r=1,i=4,a=8){let n=new H_;n.absarc(0,-r/2,t,Math.PI*1.5,0),n.absarc(0,r/2,t,0,Math.PI*.5),super(n.getPoints(i),a),this.type="CapsuleGeometry",this.parameters={radius:t,length:r,capSegments:i,radialSegments:a}}static fromJSON(t){return new ed(t.radius,t.length,t.capSegments,t.radialSegments)}},td=class rd extends $t{constructor(t=1,r=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:r,thetaStart:i,thetaLength:a},r=Math.max(3,r);let n=[],s=[],o=[],l=[],c=new N,u=new ve;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=r;h++,d+=3){let p=i+h/r*a;c.x=t*Math.cos(p),c.y=t*Math.sin(p),s.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(s[d]/t+1)/2,u.y=(s[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=r;h++)n.push(h,h+1,0);this.setIndex(n),this.setAttribute("position",new vt(s,3)),this.setAttribute("normal",new vt(o,3)),this.setAttribute("uv",new vt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rd(t.radius,t.segments,t.thetaStart,t.thetaLength)}},kl=class id extends $t{constructor(t=1,r=1,i=1,a=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:r,height:i,radialSegments:a,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};let c=this;a=Math.floor(a),n=Math.floor(n);let u=[],h=[],d=[],p=[],v=0,g=[],m=i/2,f=0;b(),s===!1&&(t>0&&M(!0),r>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new vt(h,3)),this.setAttribute("normal",new vt(d,3)),this.setAttribute("uv",new vt(p,2));function b(){let C=new N,G=new N,S=0,A=(r-t)/i;for(let k=0;k<=n;k++){let y=[],E=k/n,U=E*(r-t)+t;for(let H=0;H<=a;H++){let Y=H/a,Z=Y*l+o,re=Math.sin(Z),$=Math.cos(Z);G.x=U*re,G.y=-E*i+m,G.z=U*$,h.push(G.x,G.y,G.z),C.set(re,A,$).normalize(),d.push(C.x,C.y,C.z),p.push(Y,1-E),y.push(v++)}g.push(y)}for(let k=0;k<a;k++)for(let y=0;y<n;y++){let E=g[y][k],U=g[y+1][k],H=g[y+1][k+1],Y=g[y][k+1];(t>0||y!==0)&&(u.push(E,U,Y),S+=3),(r>0||y!==n-1)&&(u.push(U,H,Y),S+=3)}c.addGroup(f,S,0),f+=S}function M(C){let G=v,S=new ve,A=new N,k=0,y=C===!0?t:r,E=C===!0?1:-1;for(let H=1;H<=a;H++)h.push(0,m*E,0),d.push(0,E,0),p.push(.5,.5),v++;let U=v;for(let H=0;H<=a;H++){let Y=H/a*l+o,Z=Math.cos(Y),re=Math.sin(Y);A.x=y*re,A.y=m*E,A.z=y*Z,h.push(A.x,A.y,A.z),d.push(0,E,0),S.x=Z*.5+.5,S.y=re*.5*E+.5,p.push(S.x,S.y),v++}for(let H=0;H<a;H++){let Y=G+H,Z=U+H;C===!0?u.push(Z,Z+1,Y):u.push(Z+1,Z,Y),k+=3}c.addGroup(f,k,C===!0?1:2),f+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new id(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Qa=class ad extends kl{constructor(t=1,r=1,i=32,a=1,n=!1,s=0,o=Math.PI*2){super(0,t,r,i,a,n,s,o),this.type="ConeGeometry",this.parameters={radius:t,height:r,radialSegments:i,heightSegments:a,openEnded:n,thetaStart:s,thetaLength:o}}static fromJSON(t){return new ad(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},nd=class sd extends $t{constructor(t=1,r=32,i=16,a=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:r,heightSegments:i,phiStart:a,phiLength:n,thetaStart:s,thetaLength:o},r=Math.max(3,Math.floor(r)),i=Math.max(2,Math.floor(i));let l=Math.min(s+o,Math.PI),c=0,u=[],h=new N,d=new N,p=[],v=[],g=[],m=[];for(let f=0;f<=i;f++){let b=[],M=f/i,C=0;f===0&&s===0?C=.5/r:f===i&&l===Math.PI&&(C=-.5/r);for(let G=0;G<=r;G++){let S=G/r;h.x=-t*Math.cos(a+S*n)*Math.sin(s+M*o),h.y=t*Math.cos(s+M*o),h.z=t*Math.sin(a+S*n)*Math.sin(s+M*o),v.push(h.x,h.y,h.z),d.copy(h).normalize(),g.push(d.x,d.y,d.z),m.push(S+C,1-M),b.push(c++)}u.push(b)}for(let f=0;f<i;f++)for(let b=0;b<r;b++){let M=u[f][b+1],C=u[f][b],G=u[f+1][b],S=u[f+1][b+1];(f!==0||s>0)&&p.push(M,C,S),(f!==i-1||l<Math.PI)&&p.push(C,G,S)}this.setIndex(p),this.setAttribute("position",new vt(v,3)),this.setAttribute("normal",new vt(g,3)),this.setAttribute("uv",new vt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sd(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},od=class ld extends $t{constructor(t=1,r=.4,i=12,a=48,n=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:r,radialSegments:i,tubularSegments:a,arc:n},i=Math.floor(i),a=Math.floor(a);let s=[],o=[],l=[],c=[],u=new N,h=new N,d=new N;for(let p=0;p<=i;p++)for(let v=0;v<=a;v++){let g=v/a*n,m=p/i*Math.PI*2;h.x=(t+r*Math.cos(m))*Math.cos(g),h.y=(t+r*Math.cos(m))*Math.sin(g),h.z=r*Math.sin(m),o.push(h.x,h.y,h.z),u.x=t*Math.cos(g),u.y=t*Math.sin(g),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(v/a),c.push(p/i)}for(let p=1;p<=i;p++)for(let v=1;v<=a;v++){let g=(a+1)*p+v-1,m=(a+1)*(p-1)+v-1,f=(a+1)*(p-1)+v,b=(a+1)*p+v;s.push(g,m,b),s.push(m,f,b)}this.setIndex(s),this.setAttribute("position",new vt(o,3)),this.setAttribute("normal",new vt(l,3)),this.setAttribute("uv",new vt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ld(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},Bl=class extends da{static get type(){return"MeshToonMaterial"}constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.color=new qe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yh,this.normalScale=new ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};function Xn(e,t,r){return!e||!r&&e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function G_(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}var os=class{constructor(e,t,r,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(r),this.sampleValues=t,this.valueSize=r,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,r=this._cachedIndex,i=t[r],a=t[r-1];r:{e:{let n;t:{i:if(!(e<i)){for(let s=r+2;;){if(i===void 0){if(e<a)break i;return r=t.length,this._cachedIndex=r,this.copySampleValue_(r-1)}if(r===s)break;if(a=i,i=t[++r],e<i)break e}n=t.length;break t}if(!(e>=a)){let s=t[1];e<s&&(r=2,a=s);for(let o=r-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===o)break;if(i=a,a=t[--r-1],e>=a)break e}n=r,r=0;break t}break r}for(;r<n;){let s=r+n>>>1;e<t[s]?n=s:r=s+1}if(i=t[r],a=t[r-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return r=t.length,this._cachedIndex=r,this.copySampleValue_(r-1)}this._cachedIndex=r,this.intervalChanged_(r,a,i)}return this.interpolate_(r,a,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,r=this.sampleValues,i=this.valueSize,a=e*i;for(let n=0;n!==i;++n)t[n]=r[a+n];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},W_=class extends os{constructor(e,t,r,i){super(e,t,r,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:tu,endingEnd:tu}}intervalChanged_(e,t,r){let i=this.parameterPositions,a=e-2,n=e+1,s=i[a],o=i[n];if(s===void 0)switch(this.getSettings_().endingStart){case ru:a=e,s=2*t-r;break;case iu:a=i.length-2,s=t+i[a]-i[a+1];break;default:a=e,s=r}if(o===void 0)switch(this.getSettings_().endingEnd){case ru:n=e,o=2*r-t;break;case iu:n=1,o=r+i[1]-i[0];break;default:n=e-1,o=t}let l=(r-t)*.5,c=this.valueSize;this._weightPrev=l/(t-s),this._weightNext=l/(o-r),this._offsetPrev=a*c,this._offsetNext=n*c}interpolate_(e,t,r,i){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,c=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,d=this._weightNext,p=(r-t)/(i-t),v=p*p,g=v*p,m=-h*g+2*h*v-h*p,f=(1+h)*g+(-1.5-2*h)*v+(-.5+h)*p+1,b=(-1-d)*g+(1.5+d)*v+.5*p,M=d*g-d*v;for(let C=0;C!==s;++C)a[C]=m*n[c+C]+f*n[l+C]+b*n[o+C]+M*n[u+C];return a}},X_=class extends os{constructor(e,t,r,i){super(e,t,r,i)}interpolate_(e,t,r,i){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,c=(r-t)/(i-t),u=1-c;for(let h=0;h!==s;++h)a[h]=n[l+h]*u+n[o+h]*c;return a}},j_=class extends os{constructor(e,t,r,i){super(e,t,r,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Ir=class{constructor(e,t,r,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Xn(t,this.TimeBufferType),this.values=Xn(r,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,r;if(t.toJSON!==this.toJSON)r=t.toJSON(e);else{r={name:e.name,times:Xn(e.times,Array),values:Xn(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(r.interpolation=i)}return r.type=e.ValueTypeName,r}InterpolantFactoryMethodDiscrete(e){return new j_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new X_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new W_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case es:t=this.InterpolantFactoryMethodDiscrete;break;case xl:t=this.InterpolantFactoryMethodLinear;break;case $s:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let r="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(r);return console.warn("THREE.KeyframeTrack:",r),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return es;case this.InterpolantFactoryMethodLinear:return xl;case this.InterpolantFactoryMethodSmooth:return $s}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let r=0,i=t.length;r!==i;++r)t[r]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let r=0,i=t.length;r!==i;++r)t[r]*=e}return this}trim(e,t){let r=this.times,i=r.length,a=0,n=i-1;for(;a!==i&&r[a]<e;)++a;for(;n!==-1&&r[n]>t;)--n;if(++n,a!==0||n!==i){a>=n&&(n=Math.max(n,1),a=n-1);let s=this.getValueSize();this.times=r.slice(a,n),this.values=this.values.slice(a*s,n*s)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let r=this.times,i=this.values,a=r.length;a===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let n=null;for(let s=0;s!==a;s++){let o=r[s];if(typeof o=="number"&&isNaN(o)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,s,o),e=!1;break}if(n!==null&&n>o){console.error("THREE.KeyframeTrack: Out of order keys.",this,s,o,n),e=!1;break}n=o}if(i!==void 0&&G_(i))for(let s=0,o=i.length;s!==o;++s){let l=i[s];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,s,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),r=this.getValueSize(),i=this.getInterpolation()===$s,a=e.length-1,n=1;for(let s=1;s<a;++s){let o=!1,l=e[s],c=e[s+1];if(l!==c&&(s!==1||l!==e[0]))if(i)o=!0;else{let u=s*r,h=u-r,d=u+r;for(let p=0;p!==r;++p){let v=t[u+p];if(v!==t[h+p]||v!==t[d+p]){o=!0;break}}}if(o){if(s!==n){e[n]=e[s];let u=s*r,h=n*r;for(let d=0;d!==r;++d)t[h+d]=t[u+d]}++n}}if(a>0){e[n]=e[a];for(let s=a*r,o=n*r,l=0;l!==r;++l)t[o+l]=t[s+l];++n}return n!==e.length?(this.times=e.slice(0,n),this.values=t.slice(0,n*r)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),r=this.constructor,i=new r(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Ir.prototype.TimeBufferType=Float32Array;Ir.prototype.ValueBufferType=Float32Array;Ir.prototype.DefaultInterpolation=xl;var en=class extends Ir{constructor(e,t,r){super(e,t,r)}};en.prototype.ValueTypeName="bool";en.prototype.ValueBufferType=Array;en.prototype.DefaultInterpolation=es;en.prototype.InterpolantFactoryMethodLinear=void 0;en.prototype.InterpolantFactoryMethodSmooth=void 0;var q_=class extends Ir{};q_.prototype.ValueTypeName="color";var Y_=class extends Ir{};Y_.prototype.ValueTypeName="number";var Z_=class extends os{constructor(e,t,r,i){super(e,t,r,i)}interpolate_(e,t,r,i){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=(r-t)/(i-t),l=e*s;for(let c=l+s;l!==c;l+=4)ha.slerpFlat(a,0,n,l-s,n,l,o);return a}},cd=class extends Ir{InterpolantFactoryMethodLinear(e){return new Z_(this.times,this.values,this.getValueSize(),e)}};cd.prototype.ValueTypeName="quaternion";cd.prototype.InterpolantFactoryMethodSmooth=void 0;var tn=class extends Ir{constructor(e,t,r){super(e,t,r)}};tn.prototype.ValueTypeName="string";tn.prototype.ValueBufferType=Array;tn.prototype.DefaultInterpolation=es;tn.prototype.InterpolantFactoryMethodLinear=void 0;tn.prototype.InterpolantFactoryMethodSmooth=void 0;var J_=class extends Ir{};J_.prototype.ValueTypeName="vector";var K_=class{constructor(e,t,r){let i=this,a=!1,n=0,s=0,o,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=r,this.itemStart=function(c){s++,a===!1&&i.onStart!==void 0&&i.onStart(c,n,s),a=!0},this.itemEnd=function(c){n++,i.onProgress!==void 0&&i.onProgress(c,n,s),n===s&&(a=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(c){i.onError!==void 0&&i.onError(c)},this.resolveURL=function(c){return o?o(c):c},this.setURLModifier=function(c){return o=c,this},this.addHandler=function(c,u){return l.push(c,u),this},this.removeHandler=function(c){let u=l.indexOf(c);return u!==-1&&l.splice(u,2),this},this.getHandler=function(c){for(let u=0,h=l.length;u<h;u+=2){let d=l[u],p=l[u+1];if(d.global&&(d.lastIndex=0),d.test(c))return p}return null}}},$_=new K_,Q_=class{constructor(e){this.manager=e!==void 0?e:$_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let r=this;return new Promise(function(i,a){r.load(e,i,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Q_.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hl=class extends Wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ud=class extends Hl{constructor(e,t,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Uo=new ut,rh=new N,ih=new N,ex=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ve(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Nl,this._frameExtents=new ve(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,r=this.matrix;rh.setFromMatrixPosition(e.matrixWorld),t.position.copy(rh),ih.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ih),t.updateMatrixWorld(),Uo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uo),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Uo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},tx=class extends ex{constructor(){super(new pa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},hd=class extends Hl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.target=new Wt,this.shadow=new tx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},dd=class extends Hl{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}},Vl=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ah(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=ah();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function ah(){return performance.now()}var Gl="\\[\\]\\.:\\/",rx=new RegExp("["+Gl+"]","g"),Wl="[^"+Gl+"]",ix="[^"+Gl.replace("\\.","")+"]",ax=/((?:WC+[\/:])*)/.source.replace("WC",Wl),nx=/(WCOD+)?/.source.replace("WCOD",ix),sx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Wl),ox=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Wl),lx=new RegExp("^"+ax+nx+sx+ox+"$"),cx=["material","materials","bones","map"],ux=class{constructor(e,t,r){let i=r||gt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let r=this._targetGroup.nCachedObjects_,i=this._bindings[r];i!==void 0&&i.getValue(e,t)}setValue(e,t){let r=this._bindings;for(let i=this._targetGroup.nCachedObjects_,a=r.length;i!==a;++i)r[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,r=e.length;t!==r;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,r=e.length;t!==r;++t)e[t].unbind()}},gt=class $i{constructor(t,r,i){this.path=r,this.parsedPath=i||$i.parseTrackName(r),this.node=$i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,r,i){return t&&t.isAnimationObjectGroup?new $i.Composite(t,r,i):new $i(t,r,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(rx,"")}static parseTrackName(t){let r=lx.exec(t);if(r===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:r[2],objectName:r[3],objectIndex:r[4],propertyName:r[5],propertyIndex:r[6]},a=i.nodeName&&i.nodeName.lastIndexOf(".");if(a!==void 0&&a!==-1){let n=i.nodeName.substring(a+1);cx.indexOf(n)!==-1&&(i.nodeName=i.nodeName.substring(0,a),i.objectName=n)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,r){if(r===void 0||r===""||r==="."||r===-1||r===t.name||r===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(r);if(i!==void 0)return i}if(t.children){let i=function(n){for(let s=0;s<n.length;s++){let o=n[s];if(o.name===r||o.uuid===r)return o;let l=i(o.children);if(l)return l}return null},a=i(t.children);if(a)return a}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,r){t[r]=this.targetObject[this.propertyName]}_getValue_array(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)t[r++]=i[a]}_getValue_arrayElement(t,r){t[r]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,r){this.resolvedProperty.toArray(t,r)}_setValue_direct(t,r){this.targetObject[this.propertyName]=t[r]}_setValue_direct_setNeedsUpdate(t,r){this.targetObject[this.propertyName]=t[r],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,r){this.targetObject[this.propertyName]=t[r],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)i[a]=t[r++]}_setValue_array_setNeedsUpdate(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)i[a]=t[r++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)i[a]=t[r++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,r){this.resolvedProperty[this.propertyIndex]=t[r]}_setValue_arrayElement_setNeedsUpdate(t,r){this.resolvedProperty[this.propertyIndex]=t[r],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,r){this.resolvedProperty[this.propertyIndex]=t[r],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,r){this.resolvedProperty.fromArray(t,r)}_setValue_fromArray_setNeedsUpdate(t,r){this.resolvedProperty.fromArray(t,r),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,r){this.resolvedProperty.fromArray(t,r),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,r){this.bind(),this.getValue(t,r)}_setValue_unbound(t,r){this.bind(),this.setValue(t,r)}bind(){let t=this.node,r=this.parsedPath,i=r.objectName,a=r.propertyName,n=r.propertyIndex;if(t||(t=$i.findNode(this.rootNode,r.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=r.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let s=t[a];if(s===void 0){let c=r.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+a+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(a==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[n]!==void 0&&(n=t.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=n}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=a;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};gt.Composite=ux;gt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};gt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};gt.prototype.GetterByBindingType=[gt.prototype._getValue_direct,gt.prototype._getValue_array,gt.prototype._getValue_arrayElement,gt.prototype._getValue_toArray];gt.prototype.SetterByBindingTypeAndVersioning=[[gt.prototype._setValue_direct,gt.prototype._setValue_direct_setNeedsUpdate,gt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_array,gt.prototype._setValue_array_setNeedsUpdate,gt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_arrayElement,gt.prototype._setValue_arrayElement_setNeedsUpdate,gt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_fromArray,gt.prototype._setValue_fromArray_setNeedsUpdate,gt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ix=new Float32Array(1),nh=new ut,pd=class{constructor(e,t,r=0,i=1/0){this.ray=new Rh(e,t),this.near=r,this.far=i,this.camera=null,this.layers=new Ul,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return nh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nh),this}intersectObject(e,t=!0,r=[]){return bl(e,this,r,t),r.sort(sh),r}intersectObjects(e,t=!0,r=[]){for(let i=0,a=e.length;i<a;i++)bl(e[i],this,r,t);return r.sort(sh),r}};function sh(e,t){return e.distance-t.distance}function bl(e,t,r,i){let a=!0;if(e.layers.test(t.layers)&&e.raycast(t,r)===!1&&(a=!1),a===!0&&i===!0){let n=e.children;for(let s=0,o=n.length;s<o;s++)bl(n[s],t,r,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Tl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Tl);var Mr=1.16,Xl=54*Math.PI/180,fd=0,_a=new Map;function It(e,t,r){let i=`b${e}_${t}_${r}`,a=_a.get(i);return a||(a=new Ka(e,t,r),_a.set(i,a)),a}function $l(e,t,r){let i=`c${e}_${t}_${r}`,a=_a.get(i);return a||(a=new kl(e,e,t,r),_a.set(i,a)),a}function ur(e,t,r){let i=`s${e}_${t}_${r}`,a=_a.get(i);return a||(a=new nd(e,t,r),_a.set(i,a)),a}var ei;function yd(){if(ei)return ei;let e=document.createElement("canvas");e.width=4,e.height=1;let t=e.getContext("2d");return["#4a4a4a","#8d8d8d","#cfcfcf","#ffffff"].forEach((r,i)=>{t.fillStyle=r,t.fillRect(i,0,1,1)}),ei=new ga(e),ei.magFilter=Gt,ei.minFilter=Gt,ei.generateMipmaps=!1,ei.colorSpace=vr,ei}var md=new Map;function Ee(e){let t=typeof e=="number"?e:String(e),r=md.get(t);return r||(r=new Bl({color:e,gradientMap:yd()}),md.set(t,r)),r}var jl=new Nt({color:2371652}),gd=new Nt({color:16774084}),vd=new Nt({color:14826813}),ql=new Nt({color:16777215}),_d=new Map;function ls(e){let t=_d.get(e);return t||(t=new Nt({color:e}),_d.set(e,t)),t}var hx=new Nt({transparent:!0,opacity:0,depthWrite:!1,colorWrite:!1}),Yl,Zl;function dx(e){return e==="toon"?(Yl||(Yl=new Bl({color:16777215,vertexColors:!0,gradientMap:yd()})),Yl):(Zl||(Zl=new Nt({color:16777215,vertexColors:!0})),Zl)}function px(e,t){let r=e.getAttribute("position").count,i=new Float32Array(r*3);for(let a=0;a<r;a+=1)i[a*3]=t.r,i[a*3+1]=t.g,i[a*3+2]=t.b;e.setAttribute("color",new Pt(i,3))}function fx(e){let t=0,r=0;for(let u of e){let h=u.getAttribute("position").count;t+=h,r+=u.index?u.index.count:h}let i=new Float32Array(t*3),a=new Float32Array(t*3),n=new Float32Array(t*3),s=new Uint32Array(r),o=0,l=0;for(let u of e){let h=u.getAttribute("position"),d=u.getAttribute("normal"),p=u.getAttribute("color");if(i.set(h.array,o*3),d&&a.set(d.array,o*3),p&&n.set(p.array,o*3),u.index)for(let v=0;v<u.index.count;v+=1)s[l++]=u.index.getX(v)+o;else for(let v=0;v<h.count;v+=1)s[l++]=o+v;o+=h.count}let c=new $t;return c.setAttribute("position",new Pt(i,3)),c.setAttribute("normal",new Pt(a,3)),c.setAttribute("color",new Pt(n,3)),c.setIndex(new Pt(s,1)),c}function va(e){e.updateMatrixWorld(!0);let t=new ut().copy(e.matrixWorld).invert(),r=new Map,i=[];e.traverse(a=>{if(!a.isMesh||a.material.transparent)return;let n=a;for(;n;){if(n.userData&&n.userData.keep)return;n=n.parent}let s=a.geometry.clone();s.applyMatrix4(new ut().multiplyMatrices(t,a.matrixWorld)),px(s,a.material.color);let o=a.material.type==="MeshToonMaterial"?"toon":"basic",l=r.get(o);l||(l={kind:o,cast:!1,geos:[]},r.set(o,l)),l.cast=l.cast||a.castShadow,l.geos.push(s),i.push(a)});for(let a of i)a.removeFromParent();for(let a of r.values()){let n=new ct(fx(a.geos),dx(a.kind));n.castShadow=a.cast,n.receiveShadow=!0,e.add(n)}}function rt(e,t,r,i,a,n=!1){let s=new ct(e,t);return s.position.set(r,i,a),s.castShadow=n,s.receiveShadow=!1,s}function be(e,t,r,i,a,n,s,o=!1){return rt(It(e,t,r),i,a,n,s,o)}function Ql(e){let t=new Ct,r=new Ct;t.add(r);let i=ls(16777215),a=ls(14015203),n=ls(e),s=ls(2764856);r.add(be(.66,.14,1.16,a,0,.16,.02,!0)),r.add(be(.62,.28,.78,i,0,.36,.16,!0));let o=rt($l(.2,.72,12),i,0,.62,.18,!0);o.rotation.x=Math.PI/2,r.add(o),r.add(be(.36,.045,.42,n,0,.86,.16));let l=be(.48,.08,.26,i,0,.24,-.48,!0);l.rotation.x=-.55,r.add(l),r.add(be(.07,.05,.04,gd,-.14,.22,-.6)),r.add(be(.07,.05,.04,gd,.14,.22,-.6)),r.add(be(.06,.08,.92,n,.34,.28,.08)),r.add(be(.06,.08,.92,n,-.34,.28,.08));let c=be(.46,.14,.04,jl,0,.42,-.22);c.rotation.x=-.5,r.add(c),r.add(be(.04,.12,.62,jl,.32,.42,.2)),r.add(be(.04,.12,.62,jl,-.32,.42,.2)),r.add(be(.08,.045,.03,vd,-.18,.24,.6)),r.add(be(.08,.045,.03,vd,.18,.24,.6));let u=[];for(let[d,p]of[[-.4,-.34],[.4,-.34],[-.4,.42],[.4,.42]]){let v=new Ct;v.position.set(d,.15,p);let g=rt($l(.155,.11,10),s,0,0,0,!1);g.rotation.z=Math.PI/2,v.userData.keep=!0,v.add(g),r.add(v),u.push(v)}let h=[];for(let d=0;d<4;d+=1){let p=rt(ur(.045,6,5),n,.3,.58,-.02+d*.16);p.visible=!1,p.userData.keep=!0,r.add(p),h.push(p)}return t.userData.body=r,t.userData.wheels=u,t.userData.seats=h,t.userData.color=e,t}function ec(e,t){if(!t||t==="plain")return;let r=e.userData.body,i=e.userData.color,a=Ee(i);if(t==="stripes")r.add(be(.025,.045,.88,a,.335,.52,.06)),r.add(be(.025,.045,.88,a,-.335,.52,.06)),r.add(be(.1,.03,.7,a,0,.985,.14));else if(t==="chequers"){let n=Ee(1844272);for(let s=0;s<7;s+=1){let o=s%2?a:n;r.add(be(.028,.08,.09,o,.335,.48,-.34+s*.12)),r.add(be(.028,.08,.09,o,-.335,.48,-.34+s*.12))}}else if(t==="stars"){let n=Ee(15909198);for(let s of[-.12,.12,.36])r.add(rt(ur(.045,6,5),n,.34,.56,s)),r.add(rt(ur(.045,6,5),n,-.34,.56,s))}else if(t==="zigzag")for(let n=0;n<4;n+=1)for(let s of[-1,1]){let o=be(.028,.05,.18,a,s*.335,.5,-.22+n*.2);o.rotation.x=n%2?.7:-.7,r.add(o)}else if(t==="flowers"){let n=Ee(15035048),s=Ee(15909198);for(let o of[-.02,.22,.46])for(let l of[-1,1])r.add(rt(ur(.05,6,5),n,l*.22,1,o)),r.add(rt(ur(.025,5,4),s,l*.22,1.04,o))}else if(t==="flames"){let n=Ee(15759914),s=Ee(15909198);for(let o of[-1,1]){let l=be(.04,.12,.24,n,o*.33,.44,.34);l.rotation.y=o*.15;let c=be(.03,.07,.14,s,o*.34,.44,.38);r.add(l,c)}}}function mx(){let e=new Ct,t=Ee(13022346),r=Ee(11573874);e.add(be(.78,.5,1.1,t,0,.46,.04,!0)),e.add(be(.62,.18,.62,t,.04,.76,.08,!0));let i=be(.58,.22,.32,t,0,.36,-.46);return i.rotation.x=-.5,e.add(i),e.add(be(.8,.06,1.14,r,0,.24,.04)),e}var Jl;function gx(){if(!Jl){let t=document.createElement("canvas");t.width=128,t.height=128;let r=t.getContext("2d");r.fillStyle="#ffffff",r.beginPath(),r.arc(64,64,56,0,Math.PI*2),r.fill(),r.lineWidth=8,r.strokeStyle="#1c2430",r.stroke(),r.fillStyle="#1c2430",r.font="700 78px Nunito, sans-serif",r.textAlign="center",r.textBaseline="middle",r.fillText("?",64,70);let i=new ga(t);i.colorSpace=St,Jl=new ma({map:i,transparent:!0,depthWrite:!1}),document.fonts&&document.fonts.ready&&document.fonts.ready.then(()=>{r.clearRect(0,0,128,128),r.fillStyle="#ffffff",r.beginPath(),r.arc(64,64,56,0,Math.PI*2),r.fill(),r.lineWidth=8,r.strokeStyle="#1c2430",r.stroke(),r.fillStyle="#1c2430",r.font="700 78px Nunito, sans-serif",r.textAlign="center",r.textBaseline="middle",r.fillText("?",64,70),i.needsUpdate=!0}).catch(()=>{})}let e=new $a(Jl);return e.scale.set(.46,.46,1),e.position.y=1.32,e}function vx(){let e=new Ct,t=rt(It(.1,.035,.28),ql,0,.94,.2),r=rt(It(.18,.035,.07),ql,-.07,.94,.04);r.rotation.y=.6;let i=rt(It(.18,.035,.07),ql,.07,.94,.04);return i.rotation.y=-.6,e.add(t,r,i),va(e),e}function Md(e){let t=document.createElement("canvas");t.width=64,t.height=64;let r=t.getContext("2d");r.fillStyle="#ffffff",r.beginPath(),r.arc(32,32,28,0,Math.PI*2),r.fill(),r.strokeStyle="#1c2430",r.lineWidth=6,r.lineCap="round";let i=e%8;i===0?(r.beginPath(),r.moveTo(32,14),r.lineTo(32,50),r.stroke()):i===1?(r.beginPath(),r.moveTo(14,32),r.lineTo(50,32),r.stroke()):i===2?(r.beginPath(),r.arc(32,32,12,0,Math.PI*2),r.stroke()):i===3?(r.strokeRect(22,16,8,28),r.strokeRect(22,36,20,8)):i===4?(r.beginPath(),r.moveTo(18,44),r.lineTo(32,16),r.lineTo(46,44),r.stroke()):i===5?(r.fillStyle="#1c2430",r.fillRect(20,20,24,24)):i===6?(r.beginPath(),r.moveTo(32,16),r.lineTo(32,46),r.moveTo(22,36),r.lineTo(32,48),r.lineTo(42,36),r.stroke()):(r.beginPath(),r.arc(32,34,12,Math.PI*.2,Math.PI*1.4),r.stroke());let a=new ga(t);a.colorSpace=St;let n=new $a(new ma({map:a,transparent:!0,depthWrite:!1}));return n.scale.set(.28,.28,1),n}function _x(){let e=document.createElement("canvas");e.width=128,e.height=128;let t=e.getContext("2d"),r=new ga(e);r.colorSpace=St;let i=new $a(new ma({map:r,transparent:!0,depthWrite:!1}));return i.scale.set(.42,.42,1),i.userData.paint=a=>{t.clearRect(0,0,128,128),t.fillStyle="#ffffff",t.beginPath(),t.arc(64,64,56,0,Math.PI*2),t.fill(),t.strokeStyle="#1c2430",t.lineWidth=8,t.stroke(),t.fillStyle="#1c2430",t.font="700 64px Nunito, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(String(a),64,70),r.needsUpdate=!0},i.userData.paint(1),i}function xd(e,t,r,i,a){let n=new Ct,s=Ee(e),o=Ee(15779746),l=rt(new Qh(.11,.16,2,8),s,0,.32,0,!1),c=rt(ur(.105,8,6),o,0,.56,0,!1);if(n.add(l,c),a!=null){let h=Md(a);h.position.set(0,.78,0),h.scale.set(.22,.22,1),n.add(h)}if(i&&n.add(rt(It(.16,.12,.12),Ee(13206570),.16,.2,.02)),r){let h=be(.18,.14,.12,Ee(15909198),0,.32,.02),d=rt($l(.09,.045,8),Ee(2371652),0,.66,0),p=be(.14,.02,.08,Ee(2371652),0,.64,.06);n.add(h,d,p)}else if(t!==2){let h=rt(ur(.11,8,6),Ee(t===0?2761760:5913128),0,.62,-.01);h.scale.y=.55,n.add(h)}!r&&t===1&&n.add(be(.08,.09,.05,Ee(1844272),.12,.3,0));let u=t===2?1.06:t===0?.94:1;return n.scale.setScalar(u),va(n),n}function xx(e){return[0,-Math.PI/2,Math.PI,Math.PI/2][e]||0}function yx(e,t,r){let i=t-e;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return e+i*r}function Sd(e,t){let r=Math.min(globalThis.devicePixelRatio||1,2),i=new Ol({canvas:e,antialias:r<1.5,alpha:t,powerPreference:"high-performance"});return i.setPixelRatio(r),i.outputColorSpace=St,i.shadowMap.enabled=!0,i.shadowMap.type=1,t||i.setClearColor(12050162,1),i}function tc(e,t){e.add(new ud(16773336,9070660,.55)),e.add(new dd(16775407,.55));let r=new hd(16769720,1.05);if(r.position.set(-5,11,6),t){r.castShadow=!0,r.shadow.mapSize.set(256,256),r.shadow.autoUpdate=!1,r.shadow.needsUpdate=!0,r.shadow.bias=-4e-4,r.shadow.normalBias=.04;let i=r.shadow.camera;i.near=1,i.far=32,i.left=-10,i.right=10,i.top=10,i.bottom=-10}return e.add(r),e.add(r.target),r}function Ed(e){let t=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,r;try{r=Sd(e,!1)}catch(w){return{ok:!1,error:w}}let i=new ss;i.background=new qe(12050162);let a=new pa(-1,1,1,-1,.1,80),n=tc(i,!0),s=new Vl,o=new pd,l=new ve,c=[],u=3,h=[],d=ur(.045,5,4),p=null,v=!1,g=0,m=0,f=new N,b=null,M=null,C=[],G=!1,S=null,A=[],k=[],y=[],E=null,U=null,H=[],Y=null,Z=null,re=null,$=null,oe=null,Q=new Set,he=new N,_e=new N,Be=new N;function De(w){return t?Math.min(.045,w/1e3):w/1e3}function J(w,D,L){return new Promise(z=>{c.push({t:0,duration:Math.max(.016,w),ease:D,update:L,resolve:z})})}function pe(w){for(let D=c.length-1;D>=0;D-=1){let L=c[D];L.t+=w;let z=Math.min(1,L.t/L.duration);L.ease==="in"?z=z*z*z:L.ease==="out"&&(z=1-(1-z)*(1-z));try{L.update(z)}catch(K){console.error(K),L.t=L.duration}if(L.t>=L.duration){try{L.update(1)}catch(K){console.error(K)}L.resolve(),c.splice(D,1)}}}function Te(){for(let w of c)w.resolve();c.length=0}function Re(w,D){let L=h.pop();if(!L){let z=new Nt({color:15199986,transparent:!0,opacity:.75,depthWrite:!1});L=new ct(d,z)}L.visible=!0,L.position.set(w,.06,D),L.scale.setScalar(.6),L.material.opacity=.7,i.add(L),J(De(280),"out",z=>{L.position.y=.06+z*.22,L.material.opacity=.7*(1-z),L.scale.setScalar(.6+z*.8)}).then(()=>{L.visible=!1,i.remove(L),h.push(L)})}function me(w,D){let L=w.cols,z=w.rows,K=L*Mr,te=Math.max(.98,K/D),ue=te*D,R=Math.max(K,ue),j=0,V=1.55,q=2.7;return{cols:L,rows:z,gridW:K,bayPitch:te,rowW:ue,span:R,queueZ:j,bayZ:V,gridZ0:q,cell(ne,ae){return{x:-K/2+(ne+.5)*Mr,z:q+ae*Mr}},bay(ne){return{x:-ue/2+(ne+.5)*te,z:V}},inside(ne,ae){return ne>=0&&ae>=0&&ne<L&&ae<z},minX:-R/2-.55,maxX:R/2+.55,minZ:j-.7,maxZ:q+(z-1)*Mr+.55}}function Ne(){let w=Mx(b&&b.region);i.background=new qe(16180144);let D=new ct(new Nr(48,48),Ee(15979658));D.rotation.x=-Math.PI/2,D.position.set(0,-.04,(S.minZ+S.maxZ)/2),D.receiveShadow=!0,p.add(D);let L=new ct(new Nr(S.span+6.5,S.maxZ-S.minZ+5.5),Ee(16249314));L.rotation.x=-Math.PI/2,L.position.set(0,-.02,(S.minZ+S.maxZ)/2),L.receiveShadow=!0,p.add(L);let z=S.queueZ+.45,K=S.maxZ-.2,te=new ct(new Nr(S.span+1.15,K-z),Ee(12042440));te.rotation.x=-Math.PI/2,te.position.set(0,0,(z+K)/2),te.receiveShadow=!0,p.add(te);let ue=new Ct,R=Ee(14999768),j=S.span+1.35,V=S.maxZ-S.minZ-.2,q=(S.minZ+S.maxZ)/2;ue.add(be(j,.08,.12,R,0,.04,S.minZ+.15)),ue.add(be(j,.08,.12,R,0,.04,S.maxZ-.15)),ue.add(be(.12,.08,V,R,-j/2,.04,q)),ue.add(be(.12,.08,V,R,j/2,.04,q));let ne=Ee(16777215);for(let Tt=0;Tt<S.rows;Tt+=1)for(let ht=0;ht<S.cols;ht+=1){let Yt=S.cell(ht,Tt),Ot=Mr*.86;ue.add(be(Ot,.016,.055,ne,Yt.x,.025,Yt.z-Ot/2)),ue.add(be(Ot,.016,.055,ne,Yt.x,.025,Yt.z+Ot/2)),ue.add(be(.055,.016,Ot,ne,Yt.x-Ot/2,.025,Yt.z)),ue.add(be(.055,.016,Ot,ne,Yt.x+Ot/2,.025,Yt.z))}let ae=Ee(14015974),Ce=Ee(16747039);for(let Tt=0;Tt<M.bayTaxi.length;Tt+=1){let ht=S.bay(Tt);ue.add(be(S.bayPitch*.82,.025,1.05,ae,ht.x,.02,ht.z)),ue.add(be(S.bayPitch*.82,.02,.06,Ce,ht.x,.035,ht.z-.5)),ue.add(be(.05,.02,1.05,ne,ht.x-S.bayPitch*.41,.035,ht.z)),ue.add(be(.05,.02,1.05,ne,ht.x+S.bayPitch*.41,.035,ht.z))}va(ue),p.add(ue);let Xe=Math.min(S.span+.4,Math.max(S.rowW,2.4)),Je=Ee(14015459),Ge=Ee(16251903),jt=Ee(16747039);p.add(be(Xe,.07,.85,Ge,0,1.18,S.queueZ-.15,!0)),p.add(be(Xe,.045,.08,jt,0,1.16,S.queueZ+.24));for(let Tt of[-Xe*.38,Xe*.38])p.add(be(.06,1.12,.06,Je,Tt,.56,S.queueZ-.35,!0));p.add(be(Xe*.7,.08,.28,Ee(12963542),0,.18,S.queueZ-.35));let ot=new Ct;ot.add(be(.72,.07,.28,Ee(13206570),S.minX-1.35,.28,S.queueZ+.2)),ot.add(be(.08,.26,.28,Ee(9067058),S.minX-1.62,.14,S.queueZ+.2)),ot.add(be(.26,.4,.26,Ee(3107663),S.maxX+1.25,.22,S.maxZ-.2)),ot.add(be(.07,1.15,.07,Ee(2371652),S.minX-1.15,.58,S.maxZ+.15)),ot.add(rt(ur(.11,8,6),new Nt({color:16769162}),S.minX-1.15,1.2,S.maxZ+.15)),ot.add(be(.7,.36,.4,Ee(16775407),S.maxX+1.2,.22,S.queueZ+.15)),ot.add(be(.86,.06,.55,Ee(14826813),S.maxX+1.2,.52,S.queueZ+.15)),va(ot),p.add(ot);let Ti=Ee(4102991),qt=new ct(new Nr(3.2,2.2),Ee(w.grass));qt.rotation.x=-Math.PI/2,qt.position.set(S.maxX+1.6,-.015,S.minZ+.4),p.add(qt);let xa=Ee(9067058);[[S.minX+.35,S.maxZ-.15],[S.maxX-.35,S.maxZ-.15],[S.minX+.55,S.minZ+.2],[S.maxX-.55,(S.minZ+S.maxZ)*.55]].forEach(([Tt,ht],Yt)=>{p.add(be(.1,.35,.1,xa,Tt,.18,ht,!0));let Ot=new ct(new Qa(.28+Yt%2*.06,.55,6),Ti);Ot.position.set(Tt,.62,ht),Ot.castShadow=!1,p.add(Ot)});let on=Ee(15759914),wi=Ee(16250094);for(let Tt of[S.minX+.85,S.maxX-.85]){let ht=new ct(new Qa(.09,.22,7),on);ht.position.set(Tt,.12,S.maxZ-.45),ht.castShadow=!0,p.add(ht),p.add(be(.1,.04,.1,wi,Tt,.12,S.maxZ-.45))}}function it(w){re&&(re.clearRect(0,0,128,64),re.fillStyle="#1c2430",re.font="700 36px Nunito, sans-serif",re.textAlign="center",re.textBaseline="middle",re.fillText(`+${w}`,64,34),$.needsUpdate=!0)}function je(){E=new Ct,p.add(E);for(let w of b.cones||[]){let D=S.cell(w.c,w.r),L=new ct(new Qa(.16,.32,7),Ee(15759914));L.position.set(D.x,.16,D.z),L.castShadow=!0,E.add(L)}b.officer&&b.officer.path&&(U=xd(15909198,0,!1,!1,1),U.scale.setScalar(.85),E.add(U),Ye()),H=[];for(let w of b.robots||[]){let D=w.dir===0?0:w.dir===2?b.rows-1:w.lane,L=w.dir%2===0?w.lane:w.dir===1?b.cols-1:0,z=w.dir%2===0?w.lane:L,K=w.dir%2===0?w.dir===2?b.rows-1:0:w.lane,te=S.cell(Math.max(0,Math.min(b.cols-1,z)),Math.max(0,Math.min(b.rows-1,K))),ue=rt(It(.06,.7,.06),Ee(2371652),te.x,.35,te.z,!0),R=new Nt({color:4102991}),j=rt(ur(.1,8,6),R,te.x,.78,te.z);j.userData.robot=w,j.userData.mat=R,E.add(ue,j),H.push(j)}if(_t(),b.region==="cape"){let w=new ct(new Qa(.7,.9,5),Ee(9085112));w.position.set(S.maxX+.2,.4,S.minZ),E.add(w)}else if(b.region==="joburg"){let w=rt(It(.18,1.1,.18),Ee(14147046),S.minX-.1,.55,S.maxZ,!0);E.add(w)}else if(b.region==="gqeberha"){let w=rt(It(.9,.08,.08),Ee(12963542),0,.7,S.maxZ+.2);E.add(w)}else if(b.region==="bloem"){let w=rt(It(.16,.9,.16),Ee(15194032),S.maxX,.45,S.maxZ,!0);E.add(w)}else{let w=new ct(new od(.28,.05,6,10),Ee(16054267));w.position.set(S.minX,.35,S.minZ),E.add(w)}}function Ye(){if(!U||!b.officer)return;let w=Math.floor((M.moves||0)/3)%b.officer.path.length,D=b.officer.path[w],L=S.cell(D.c,D.r);U.position.set(L.x,0,L.z)}function _t(){let w=Math.floor((M.moves||0)/2)%2===0;for(let D of H||[])D.userData.mat.color.set(w?4102991:14826813)}function O(){Y.clear(),k=[],y=[];let w=M.queues||[M.queue||[]],D=M.boarded||[];w.forEach((L,z)=>{let K=D[z]||[],te=0;L.forEach((ue,R)=>{if(K[R]||te>=5)return;let j=xd(Kl(ue.color),R%3,!!ue.vip,!!ue.luggage,ue.color);j.userData.queue=z,j.userData.index=R,j.userData.phase=R+z,j.userData.head=te===0,j.userData.slot=te,Y.add(j),k.push(j),te===0&&y.push(j),te+=1})}),mt()}function mt(){let w=[[],[]];for(let D of k)D.userData.leaving||(w[D.userData.queue]=w[D.userData.queue]||[],w[D.userData.queue].push(D));w.forEach((D,L)=>{let K=-((Math.max(D.length,1)-1)*.46)/2,te=S.queueZ-L*.62;D.forEach((ue,R)=>{ue.visible=!0,ue.position.set(K+R*.46,0,te)}),L===0&&D[0]&&oe.position.set(D[0].position.x,.025,te)}),oe.visible=!!(w[0]&&w[0][0]),Z.visible=!1}function $e(w){let D=Br[w.dir],L=w.len||1,z=w.c-D.x*(L-1),K=w.r-D.y*(L-1);return S.cell((w.c+z)/2,(w.r+K)/2)}function et(w){return(w.len||3)*Mr*.86/1.05}function ye(w,D){let L=!!(D.hidden&&M.revealed&&!M.revealed[D.id]);w.body.visible=!L,w.tarp.visible=L,w.question.visible=L;let z=Math.max(0,(D.lockAfter||0)-(M.departed||0));w.lock.visible=z>0,z>0&&w.lock.userData.paint&&w.lock.userData.paint(z),w.arrow.visible=!0,w.question.position.y=1.32,w.lock.position.set(L?.28:0,1.28,0)}function tt(w,D){let L=A[w]&&A[w].group.userData.seats;L&&L.forEach((z,K)=>{z.visible=K<D})}function Pe(w){let D=A[w.id];if(M.exited[w.id]){let L=-1;for(let K=0;K<M.bayTaxi.length;K+=1)M.bayTaxi[K]===w.id&&(L=K);if(D.pick.visible=!1,L<0){D.group.visible=!1;return}let z=S.bay(L);D.group.visible=!0,D.group.position.set(z.x,0,z.z),D.group.rotation.y=0,D.group.scale.set(.38,.38,.38),tt(w.id,M.bayFilled[L])}else{let L=$e(w);D.group.visible=!0,D.group.position.set(L.x,0,L.z),D.group.rotation.y=xx(w.dir),D.group.scale.set(1,1,et(w)),D.pick.visible=!0,tt(w.id,0)}D.body.rotation.set(0,0,0),D.body.scale.set(1,1,1),ye(D,w)}function Fe(){let w=(e.clientWidth||1)/(e.clientHeight||1);a.left=-w,a.right=w,a.top=1,a.bottom=-1,a.zoom=1,a.updateProjectionMatrix(),he.set(0,.35,(S.minZ+S.maxZ)/2);let D=26;f.set(he.x+Math.sin(fd)*Math.cos(Xl)*D,he.y+Math.sin(Xl)*D,he.z+Math.cos(fd)*Math.cos(Xl)*D),a.position.copy(f),a.lookAt(he),a.updateMatrixWorld(!0);let L=.001,z=.001;for(let j of[S.minX,S.maxX])for(let V of[0,1.25])for(let q of[S.minZ,S.maxZ]){let ne=Be.set(j,V,q).project(a);L=Math.max(L,Math.abs(ne.x)),z=Math.max(z,Math.abs(ne.y))}let K=.92/L,te=.96/z;a.zoom=Math.min(K,te),a.updateProjectionMatrix();let ue=n.shadow.camera,R=Math.max(7,(S.maxX-S.minX)*.62);ue.left=-R,ue.right=R,ue.top=R,ue.bottom=-R,ue.updateProjectionMatrix(),n.position.set(he.x-5,12,he.z+5),n.target.position.copy(he),n.target.updateMatrixWorld()}function T(w,D,L,z){Te(),b=w,M=D,C=L,G=!0,bd=!!(z&&z.colorblind);let K=z&&z.livery||"plain";S=me(b,M.bayTaxi.length),p&&i.remove(p),p=new Ct,i.add(p),A=[],Ne(),Y=new Ct,p.add(Y),oe=new ct(new td(.2,18),new Nt({color:16747039,transparent:!0,opacity:.95,depthWrite:!1})),oe.rotation.x=-Math.PI/2,p.add(oe);let te=document.createElement("canvas");te.width=128,te.height=64,re=te.getContext("2d"),$=new ga(te),$.colorSpace=St,Z=new $a(new ma({map:$,transparent:!0,depthWrite:!1})),Z.scale.set(.55,.28,1),p.add(Z),je();for(let ue of b.taxis){let R=ue.colors||[ue.color||0],j=Ql(Kl(R[0]));if(ec(j,K),R[1]!=null){let Ge=be(.04,.07,.9,Ee(Kl(R[1])),-.34,.52,.04);j.userData.body.add(Ge)}let V=Md(R[0]);V.position.set(0,.92,.42),j.userData.body.add(V),va(j.userData.body);let q=mx(),ne=gx(),ae=_x(),Ce=vx(),Xe=rt(It(.8,.5,1.1),new Nt({color:16722474,transparent:!0,opacity:0,depthWrite:!1}),0,.5,0);Xe.visible=!1;let Je=rt(It(Mr*.92,1.3,1.05),hx,0,.65,0);Je.userData.id=ue.id,Je.layers.set(1),Je.castShadow=!1,Je.receiveShadow=!1,j.add(q,ne,ae,Ce,Je,Xe),p.add(j),A[ue.id]={group:j,body:j.userData.body,tarp:q,question:ne,lock:ae,arrow:Ce,pick:Je,flash:Xe},Pe(ue)}O([]),_()}function _(){let w=e.clientWidth,D=e.clientHeight;!w||!D||!S||(r.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2)),r.setSize(w,D,!1),Fe())}function B(){if(!v)return;g=requestAnimationFrame(B);let w=Math.min(.05,s.getDelta()),D=s.elapsedTime;if(pe(w),!t){for(let L of k)!L.visible||L.userData.hopping||(L.position.y=Math.sin(D*2.5+L.userData.phase)*.03);for(let L of A)L&&L.question.visible&&(L.question.position.y=1.32+Math.sin(D*2.2+L.pick.userData.id)*.04)}a.position.copy(f),m>.001&&(a.position.x+=(Math.random()-.5)*m,a.position.y+=(Math.random()-.5)*m*.45,m*=.86),n.shadow.needsUpdate=u>0||c.length>0||m>.001,u>0&&(u-=1),r.render(i,a)}function ie(){v||(v=!0,s.getDelta(),B())}function se(){v=!1,cancelAnimationFrame(g)}function ee(w,D){let L=e.getBoundingClientRect();if(!L.width||!L.height)return-1;l.x=(w-L.left)/L.width*2-1,l.y=-((D-L.top)/L.height)*2+1,o.layers.enable(1),o.setFromCamera(l,a);let z=[];for(let ue of y)z.push(ue);for(let ue of A)ue&&ue.pick.visible&&z.push(ue.pick);let K=o.intersectObjects(z,!0);if(!K.length)return null;let te=K[0].object;for(;te&&te.userData.queue==null&&te.userData.id==null&&te.parent;)te=te.parent;return te&&te.userData.queue!=null?{kind:"queue",queue:te.userData.queue}:te&&te.userData.id!=null?{kind:"taxi",id:te.userData.id}:null}function Le(w){let D=A[w];if(!D)return null;let L=_e;L.set(D.group.position.x,1.2,D.group.position.z),L.project(a);let z=e.getBoundingClientRect();return{x:z.left+(L.x*.5+.5)*z.width,y:z.top+(-L.y*.5+.5)*z.height}}function ge(w){let D=[w[0]];for(let L=1;L<w.length-1;L+=1){let z=w[L-1],K=w[L],te=w[L+1],ue=Math.hypot(K.x-z.x,K.z-z.z)||1,R=Math.hypot(te.x-K.x,te.z-K.z)||1,j=Math.min(.55,ue*.45,R*.45),V={x:K.x-(K.x-z.x)/ue*j,z:K.z-(K.z-z.z)/ue*j},q={x:K.x+(te.x-K.x)/R*j,z:K.z+(te.z-K.z)/R*j};D.push(V);for(let ne=1;ne<=4;ne+=1){let ae=ne/5,Ce=1-ae;D.push({x:Ce*Ce*V.x+2*Ce*ae*K.x+ae*ae*q.x,z:Ce*Ce*V.z+2*Ce*ae*K.z+ae*ae*q.z})}D.push(q)}D.push(w[w.length-1]),w.length=0;for(let L of D)w.push(L)}function Me(w){let D=b.taxis[w],L=Br[D.dir],z=[$e(D)],K=D.c+L.x,te=D.r+L.y;for(;S.inside(K,te);)z.push(S.cell(K,te)),K+=L.x,te+=L.y;let ue=z[z.length-1];return z.push({x:ue.x+L.x*Mr,z:ue.z+L.y*Mr}),z}async function ze(w,D,L){let z=w.userData.body,K=w.userData.wheels,te=[],ue=0;for(let V=1;V<D.length;V+=1){let q=Math.hypot(D[V].x-D[V-1].x,D[V].z-D[V-1].z);te.push(q),ue+=q}if(ue<.001)return;let R=0,j=0;await J(De(160+ue*130),"out",V=>{let q=V*ue,ne=0,ae=0;for(;ae<te.length-1&&ne+te[ae]<q;)ne+=te[ae],ae+=1;let Ce=te[ae]||1,Xe=Math.min(1,(q-ne)/Ce),Je=D[ae],Ge=D[ae+1];w.position.x=Je.x+(Ge.x-Je.x)*Xe,w.position.z=Je.z+(Ge.z-Je.z)*Xe,w.rotation.y=Math.atan2(-(Ge.x-Je.x),-(Ge.z-Je.z)),z.rotation.x=.045,z.rotation.z=Math.sin(V*Math.PI*2)*.02;let jt=(q-R)/.135;R=q;for(let ot of K)ot.rotation.x+=jt;if(L&&!t){let ot=performance.now();if(ot-j>48){j=ot;let Ti=Math.sin(w.rotation.y)*.35,qt=Math.cos(w.rotation.y)*.35;Re(w.position.x+Ti,w.position.z+qt)}}}),z.rotation.x=0,z.rotation.z=0}async function de(w,D,L){let z=w.rotation.y;await J(De(L),"out",K=>{w.rotation.y=yx(z,D,K)}),w.rotation.y=D}return{ok:!0,resize:_,start:ie,stop:se,load:T,pick:ee,project:Le,setState(w){M=w},reveal(w){let D=b.taxis[w];D&&ye(A[w],D)},async bump(w){let D=A[w],L=Br[b.taxis[w].dir],z=D.group.position.x,K=D.group.position.z;m=Math.max(m,t?0:.12),await J(De(80),"out",te=>{D.group.position.x=z+L.x*.2*te,D.group.position.z=K+L.y*.2*te,D.body.rotation.x=.08*te}),await J(De(120),"out",te=>{D.group.position.x=z+L.x*.2*(1-te),D.group.position.z=K+L.y*.2*(1-te),D.body.rotation.x=.08*(1-te)}),D.body.rotation.x=0},async unlock(w,D){let L=A[w],z=L.lock,K=z.position.y;await J(De(160),"out",te=>{z.position.y=K+te*.4,z.scale.setScalar(1+te*.35)}),z.visible=D>0,z.position.y=K,z.scale.setScalar(1),await J(De(140),"out",te=>{let ue=Math.sin(te*Math.PI);L.body.scale.set(1+ue*.05,1-ue*.07,1)}),L.body.scale.set(1,1,1)},async exit(w,D){let L=A[w];L.pick.visible=!1;let z=Me(w),K=S.bay(D),te=b.taxis[w],ue=Br[te.dir],R=z[z.length-1],j=((te.len||2)-1)*Mr+.6,V={x:R.x+ue.x*j,z:R.z+ue.y*j};z.push(V);let q=S.bayZ-1.7,ne=V.x>=0?S.maxX+1.8:S.minX-1.8;if(ue.y<0){let Ce=Math.min(V.z,q);V.z>Ce+.05&&z.push({x:V.x,z:Ce}),z.push({x:K.x,z:Ce})}else ue.y>0?(z.push({x:ne,z:V.z}),z.push({x:ne,z:q}),z.push({x:K.x,z:q})):(z.push({x:V.x,z:q}),z.push({x:K.x,z:q}));z.push(K),ge(z);let ae=L.group.scale.z;await ze(L.group,z,!0),await J(De(200),"out",Ce=>{let Xe=1+-.6*Ce;L.group.scale.set(Xe,Xe,ae+(.4-ae)*Ce)}),await de(L.group,0,160),tt(w,0)},async board(w){let D=k.find(K=>K.userData.queue===(w.queue||0)&&K.userData.index===w.pIndex);if(w.filled>4){D&&(D.visible=!1),tt(w.taxiId,w.filled),mt();return}if(!D){tt(w.taxiId,w.filled);return}D.visible||(D.position.set(Z.position.x,0,Z.position.z),D.visible=!0);let L=D.position.clone();D.userData.leaving=!0,D.userData.hopping=!0,mt();let z=S.bay(w.bay);await J(De(220),"out",K=>{D.position.x=L.x+(z.x-L.x)*K,D.position.z=L.z+(z.z-L.z)*K,D.position.y=Math.sin(K*Math.PI)*.55}),D.visible=!1,D.userData.leaving=!1,D.userData.hopping=!1,D.position.y=0,Q.delete(w.pIndex),tt(w.taxiId,w.filled),mt()},async depart(w){let D=A[w];if(!D||!D.group.visible)return;let L=D.group.position.clone(),z=D.group.rotation.y,K=-Math.sin(z),te=-Math.cos(z);await ze(D.group,[{x:L.x,z:L.z},{x:L.x+K*3.2,z:L.z+te*3.2}],!0),D.group.visible=!1,tt(w,0)},syncPeople(w){M=w,O(),Ye(),_t();for(let D of b.taxis)A[D.id]&&ye(A[D.id],D)},flash(w){let D=A[w];!D||!D.flash||(D.flash.visible=!0,J(De(180),"out",L=>{D.flash.material.opacity=L<.5?L*1.2:(1-L)*1.2,L>.98&&(D.flash.visible=!1)}))},pulse(w){let D=A[w];if(!D)return;let L=D.arrow.scale.x||1;J(De(500),"out",z=>{let K=1+Math.sin(z*Math.PI)*.35;D.arrow.scale.set(L*K,L*K,L*K)})},shake(){m=Math.max(m,t?0:.1)}}}var bd=!1;function Kl(e){return bc(e,bd)}function Mx(e){return Ds.find(t=>t.id===e)||Ds[0]}function Td(e){let t=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,r;try{r=Sd(e,!0)}catch(f){return{ok:!1,error:f}}let i=new ss,a=new pa(-1,1,1,-1,.1,40);tc(i,!0);let n=new Vl,s=null,o=!1,l=0;r.setClearColor(16180144,1);let c=new ct(new Nr(14,10),Ee(15979658));c.rotation.x=-Math.PI/2,c.position.y=-.02,c.receiveShadow=!0,i.add(c);let u=new ct(new Nr(6.2,3.4),Ee(12042440));u.rotation.x=-Math.PI/2,u.receiveShadow=!0,i.add(u);let h=[];function d(){let f=e.clientWidth||1,b=e.clientHeight||1;r.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2)),r.setSize(f,b,!1);let M=f/b;a.left=-M*1.7,a.right=M*1.7,a.top=1.7,a.bottom=-1.7,a.zoom=1,a.updateProjectionMatrix();let C=50*Math.PI/180;a.position.set(.2,Math.sin(C)*8.5,Math.cos(C)*8.5),a.lookAt(0,.35,.1)}function p(f){s&&i.remove(s),s=new Ct;let b=Ee(16251903),M=Ee(16747039),C=Ee(14015459);s.add(be(3.6,.1,.9,b,0,1.15,-1.35)),s.add(be(3.6,.06,.1,M,0,1.12,-.92)),s.add(be(.1,1.1,.1,C,-1.5,.55,-1.45)),s.add(be(.1,1.1,.1,C,1.5,.55,-1.45)),s.add(be(.9,.08,.32,Ee(13206570),-1.7,.22,.2));let G=[14826813,3108845,15909198,4102991];h=[{x:-1.15,z:-.15,yaw:.04},{x:.05,z:.05,yaw:-.02},{x:1.2,z:-.1,yaw:.06},{x:.15,z:.95,yaw:.18}].map((A,k)=>{let y=Ql(G[k]);return k===0&&ec(y,f),va(y.userData.body),y.position.set(A.x,0,A.z),y.rotation.y=A.yaw,y.scale.setScalar(.92),s.add(y),y}),i.add(s)}function v(){if(!o)return;l=requestAnimationFrame(v);let f=Math.min(.05,n.getDelta());if(!t){let b=n.elapsedTime;h.forEach((M,C)=>{M.position.y=Math.sin(b*1.3+C)*.012,M.rotation.z=Math.sin(b*.7+C*1.4)*.01})}f&&s&&(s.position.y=0),r.render(i,a)}let g=null;function m(f){g&&i.remove(g),g=new Ct,f>=1&&g.add(rt(It(1.6,.08,.7),Ee(16251903),0,.9,-.8)),f>=2&&g.add(rt(It(.4,.35,.3),Ee(14711357),1.1,.2,.2)),f>=3&&g.add(rt(It(.08,.7,1.1),Ee(3108845),-1.2,.4,0)),f>=4&&g.add(rt(It(.22,.28,.16),Ee(1844272),.8,.2,-.6)),f>=5&&g.add(rt(ur(.08,8,6),new Nt({color:16769162}),-.7,.85,-.5)),f>=6&&g.add(rt(It(2.2,.08,1.6),Ee(14147046),0,1.25,0)),i.add(g)}return{ok:!0,resize:d,setLook:p,setStage:m,start(){o||(o=!0,n.getDelta(),v())},stop(){o=!1,cancelAnimationFrame(l)}}}var Xt=null;function wd(e,t){if(!Xt){let i=document.createElement("canvas");i.width=192,i.height=120;let a=new Ol({canvas:i,antialias:!0,alpha:!1,preserveDrawingBuffer:!0});a.setSize(192,120,!1),a.outputColorSpace=St;let n=new ss;n.background=new qe(15660024);let s=new pa(-1.15,1.15,.78,-.78,.1,20);tc(n,!1),s.position.set(-2.2,1.45,-2),s.lookAt(0,.42,0),Xt={renderer:a,scene:n,camera:s,canvas:i,group:null}}Xt.group&&Xt.scene.remove(Xt.group),Xt.group=Ql(14826813),ec(Xt.group,t),Xt.group.rotation.y=-.55,Xt.scene.add(Xt.group),Xt.renderer.render(Xt.scene,Xt.camera);let r=e.getContext("2d");r.clearRect(0,0,e.width,e.height),r.drawImage(Xt.canvas,0,0,e.width,e.height)}var ds=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,Sr=new URLSearchParams(location.search);Sr.has("reset")&&zc();var Ad=Number(Sr.get("level")),ri={level:Number.isFinite(Ad)?Ad:0,daily:Sr.has("daily"),bot:Sr.has("bot"),mute:Sr.has("mute"),lose:Sr.has("lose")};globalThis.TRR_FLAGS=ri;var lc=Ie();Ts(ri.mute||lc.sound===!1);ws(lc.music!==!1);vc(lc.horn||"hoot");mc();var le=e=>document.getElementById(e),ac=null,Ze=null,Lt=null,P=null,Cd=0,rc=0,Rd=performance.now(),hr={back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',restart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2-4.9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M19 4.5V9h-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',sound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" fill="currentColor"/><path d="M15.2 9.2a3.6 3.6 0 0 1 0 5.6M17.4 7a6.2 6.2 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',mute:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" fill="currentColor"/><path d="m16 10 4 4m0-4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',music:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="13.5" r="2.5" fill="currentColor"/></svg>',musicOff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m15 15 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',arrows:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M12 4l-3.2 3.2M12 4l3.2 3.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',coin:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="#F2C14E"/><circle cx="12" cy="12" r="5.2" fill="none" stroke="#C9842A" stroke-width="1.6"/></svg>',bay:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v6M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',undo:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8H5.5V5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M6 12a6 6 0 1 0 1.6-4.1L5.5 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',shuffle:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4.2l2.2 3.2L13 7h7M16.5 4.5 20 7l-3.5 2.5M4 17h4.2l2.2-3.2L13 17h7M16.5 14.5 20 17l-3.5 2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};function rr(e,t=""){document.body.dataset.screen=e;let r=le("live");r&&(r.textContent=t||e)}function Id(e){return new Promise(t=>{setTimeout(t,ds?Math.min(24,e):e)})}function Od(e){if(!ds)try{navigator.vibrate?.(e)}catch{}}function cs(e){let[t,r,i]=e.split("-").map(Number);return`${i} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][r-1]} ${t}`}async function Fd(e){if(navigator.share)try{return await navigator.share({text:e}),"shared"}catch(t){if(t&&t.name==="AbortError")return"abort"}try{return await navigator.clipboard.writeText(e),"copied"}catch{let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.left="-999px",document.body.appendChild(t),t.select();let r=!1;try{r=document.execCommand("copy")}catch{r=!1}return t.remove(),r?"copied":"failed"}}function Qt(e,t,r){let i=le("toast"),a=le("app").getBoundingClientRect();i.hidden=!1,i.textContent=e;let n=t??a.left+a.width/2,s=r??a.top+a.height*.4;i.style.left=`${n-a.left}px`,i.style.top=`${s-a.top}px`,clearTimeout(Cd),Cd=setTimeout(()=>{i.hidden=!0},1e3)}function sn(){let e=Ie().coins;for(let t of["t-coins","m-coins","s-coins","d-coins","g-coins"]){let r=le(t);if(!r)continue;let i=r.querySelector("span")||r;r.querySelector("span")?r.querySelector("span").textContent=String(e):i.textContent=String(e)}}function Sx(){return ba()?hr.mute:hr.sound}function ps(){for(let t of["t-mute","g-mute"]){let r=le(t);r&&(r.innerHTML=Sx(),r.setAttribute("aria-label",ba()?"Unmute":"Mute"),r.setAttribute("aria-pressed",ba()?"true":"false"))}for(let t of["t-music","g-music"]){let r=le(t);if(!r)continue;let i=As();r.innerHTML=i?hr.music:hr.musicOff,r.classList.toggle("off",!i),r.setAttribute("aria-label",i?"Turn music off":"Turn music on"),r.setAttribute("aria-pressed",i?"true":"false")}let e=le("t-arrows");e&&(e.innerHTML=hr.arrows,e.classList.toggle("on",!!Ie().arrows),e.setAttribute("aria-pressed",Ie().arrows?"true":"false"))}function Pd(){let e=ba();Ts(!e),Gc(e),st(),ps()}function Ld(){let e=!As();ws(e),Jc(e),Rs(),e&&st(),ps()}function Ex(e,t){return t==="daily"||e&&e.id&&e.id%10===0?"rushhour":"gameplay"}function ai(e){let t=le(`screen-${e}`);for(let r of document.querySelectorAll(".screen"))r!==t&&(r.classList.remove("is-on"),r.hidden=!0);t.hidden=!1,t.classList.remove("is-on"),requestAnimationFrame(()=>t.classList.add("is-on")),rr(e),e!=="game"&&Ze&&Ze.stop&&Ze.stop(),e==="title"?Lt&&(Lt.setLook(Ie().livery),Lt.resize(),Lt.start()):Lt&&Lt.stop(),e!=="game"&&Cs("menu")}function ti(){let e=Ie(),t=Math.min(Hr,Math.max(1,e.unlocked));le("t-play").textContent=e.unlocked>1?`Play ${t}`:Oe.play,sn(),ps(),ai("title"),Lt&&Lt.setStage&&Lt.setStage(Ie().rank||0),rr("title",Ci.title)}var ii=0;function nc(){let e=Ie();return{livery:e.livery,colorblind:!!e.colorblind,showArrows:!0}}function hs(){let e=Ie();ii=Math.floor((Math.min(Hr,e.unlocked)-1)/12),sn(),sc(),ai("map"),rr("map","Level map")}function sc(){let e=Ie();le("m-range").textContent=`${ii*12+1}\u2013${ii*12+12}`;let t=le("m-grid");t.replaceChildren();for(let r=0;r<12;r+=1){let i=ii*12+r+1,a=i<=e.unlocked,n=Zs(e,i),s=Xs(i),l=[s.tutorial?"":s.difficulty==="super"?"S":s.difficulty==="hard"?"H":"",s.tutorial?s.tutorial.mech.slice(0,1).toUpperCase():""].filter(Boolean).join(" "),c=document.createElement("button");c.type="button",c.className=`level${a?"":" locked"}${i===e.unlocked?" current":""}`,c.innerHTML=`<small>${l}</small><strong>${i}</strong><em>${"\u2605\u2605\u2605".slice(0,n)}${"\u2606\u2606\u2606".slice(n)}</em>`,c.addEventListener("click",()=>{if(!a){let u=c.getBoundingClientRect();Qt("Locked",u.left+u.width/2,u.top);return}st(),dr({mode:"level",id:i})}),t.append(c)}}function zd(){let e=le("s-list");e.replaceChildren();let t=Ie();sn();for(let r of Ls){let i=t.owned.includes(r.id),a=t.livery===r.id,n=document.createElement("article");n.className="shop-row";let s=document.createElement("canvas");s.width=192,s.height=120,s.className="thumb";try{wd(s,r.id)}catch(h){console.error(h)}let o=document.createElement("div"),l=document.createElement("strong");l.textContent=r.name;let c=document.createElement("p");c.textContent=r.blurb,o.append(l,c);let u=document.createElement("button");u.type="button",u.className=`btn small${a?"":" primary"}`,u.textContent=a?Oe.equipped:i?Oe.equip:String(r.price),u.addEventListener("click",()=>{if(st(),!a){if(i)Vc(r.id);else{if(!Hc(r.id,r.price).ok){let d=u.getBoundingClientRect();Qt("Need coins",d.left+d.width/2,d.top);return}Aa()}zd()}}),n.append(s,o,u),e.append(n)}ai("shop"),rr("shop","Liveries")}function an(){let e=Vr(new Date),t=null;try{t=js(new Date),mr(t),ac=t}catch(n){console.error(n)}let r=Ie();le("d-date").textContent=cs(e),le("d-lead").textContent=Oe.dailyLead;let i=r.dailyDate===e||r.dailyStreak?`Streak ${r.dailyStreak||0}`:"Streak 0";le("d-streak").textContent=i;let a=r.dailyDate===e;le("d-done").hidden=!a,le("d-done").textContent=Oe.dailyDone,le("d-stars").hidden=!a,le("d-stars").textContent=`${"\u2605\u2605\u2605".slice(0,r.dailyStars||0)}${"\u2606\u2606\u2606".slice(r.dailyStars||0)}`,le("d-play").textContent=a?"Play again":Oe.play,le("d-share").hidden=!a,le("d-play").onclick=()=>{t&&(st(),dr({mode:"daily"}))},le("d-share").onclick=async()=>{if(!t)return;let n=Hs(t,{daily:!0,stars:r.dailyStars||1,moves:t.par,time:0},cs(e));await Fd(n)==="copied"&&Qt(Oe.copied)},sn(),ai("daily"),rr("daily",`Rush Hour ${cs(e)}`)}function bx(){if(Ze)return!!Ze.stop;let e=Ed(le("board"));if(!e.ok)return console.error(e.error),!1;Ze=e;let t=le("board-wrap");return new ResizeObserver(()=>Ze.resize()).observe(t),le("board").addEventListener("pointerdown",i=>{if(!P||P.busy||P.over||P.adOpen)return;let a=Ze.pick(i.clientX,i.clientY);a&&(a.kind==="queue"?Wd(a.queue):a.kind==="taxi"&&Gd(a.id))}),!0}function Fr(){if(!P)return;le("g-moves").textContent=`Moves ${P.state.moves}`,le("g-time").textContent=`${Math.floor(P.elapsed/1e3)}s`;let e=le("g-coins"),t=String(Ie().coins),r=e.querySelector("span");r&&(r.textContent=t),le("g-bay").disabled=!!P.state.extraUsed||P.over||P.busy,le("g-undo").disabled=P.undo.length===0||P.over||P.busy,le("g-shuffle").disabled=P.over||P.busy}function Or(){let e=le("modal");e.hidden=!0,e.replaceChildren(),P&&!P.over&&rr("game",P.level.name||"Level")}function nn(){let e=le("modal");e.hidden=!1,e.replaceChildren();let t=document.createElement("div");return t.className="card",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),e.append(t),t}function tr(e,t,r){let i=document.createElement("button");return i.type="button",i.className=t,i.textContent=e,i.addEventListener("click",r),i}function dr(e){if(!bx()){le("boot").hidden=!1,le("boot-note").textContent="This browser cannot start the 3D rank.";return}let t=Ie(),r,i=e;if(e.mode==="event"&&e.level)r=e.level,mr(r);else if(e.mode==="daily")r=ac||js(new Date),mr(r),r.intro=r.intro||"Rush Hour. One shared rank for today.",ac=r;else{let l=Math.min(Hr,Math.max(1,e.id|0)),c=Ie().fails[String(l)]||0;r=Xs(l,{easier:c>=2?1:0}),mr(r),i={mode:"level",id:l}}let a=Ls.some(l=>l.id===t.livery)?t.livery:"plain";P={launch:i,level:r,state:ks(r),hidden:r.taxis.map(l=>!!l.hidden),squeezeUsed:!1,adBayUsed:!1,lastInput:performance.now(),hinted:!1,livery:a,showArrows:!!t.arrows||i.mode!=="daily"&&r.id>=1&&r.id<=3,elapsed:0,shown:-1,timing:!1,busy:!1,over:!1,adOpen:!1,paid:!1,undo:[],botAt:0,botting:!!(ri.bot&&r.guide)},le("g-title").textContent=r.name||`Level ${r.id}`,le("g-par").textContent=`Par ${r.par}`;let n=le("g-intro");n.hidden=!r.intro,n.textContent=r.intro||"",Or(),ai("game"),Cs(Ex(r,i.mode)),rr("game",r.name||`Level ${r.id}`),Ze.load(r,P.state,P.hidden,nc());let s=le("g-diff");if(s){let l=!!r.tutorial;s.textContent=l?"":r.difficulty==="super"?"Super Hard":r.difficulty==="hard"?"Hard":"",s.hidden=!s.textContent,s.className=`badge ${r.difficulty||""}`}let o=le("g-time");o&&(o.hidden=i.mode!=="daily"),le("screen-game").classList.toggle("rain",!!r.rain),Rx(),Ze.start(),requestAnimationFrame(()=>Ze.resize()),ps(),Fr(),ri.lose&&setTimeout(()=>rn("full"),350),P.botting&&setTimeout(()=>Xd(),450)}function cc(){P.undo.push({state:{exited:Array.from(P.state.exited),bayTaxi:Array.from(P.state.bayTaxi),bayFilled:Array.from(P.state.bayFilled),boarded:P.state.boarded.map(e=>Array.from(e)),queues:P.state.queues.map(e=>e.map(t=>({...t}))),moves:P.state.moves,departed:P.state.departed,combo:P.state.combo,squeezeUsed:P.state.squeezeUsed,revealed:Array.from(P.state.revealed)},coins:Ie().coins,elapsed:P.elapsed}),P.undo.length>40&&P.undo.shift()}function Tx(e){let t=e.state;P.state={exited:Uint8Array.from(t.exited),bayTaxi:Int16Array.from(t.bayTaxi),bayFilled:Uint8Array.from(t.bayFilled),boarded:t.boarded.map(r=>Uint8Array.from(r)),queues:t.queues.map(r=>r.map(i=>({...i}))),moves:t.moves,departed:t.departed,combo:t.combo,squeezeUsed:t.squeezeUsed,revealed:Uint8Array.from(t.revealed)},Js(e.coins),P.elapsed=e.elapsed,P.shown=-1}async function kd(e){for(let t of e)if(t.t==="exit")xc(),await Ze.exit(t.id,t.bay);else if(t.t==="board")yc(),await Ze.board(t);else if(t.t==="depart"){let r=t.combo>=2;r?_c(t.combo):wa();let i=(2+(t.combo>=2?t.combo:0))*(P.level.reward||1);xn(i),oc("depart"),t.combo>=3&&oc("combo",t.combo),r&&Qt(`${Us[t.combo%Us.length]} x${t.combo}`),await Ze.depart(t.taxiId),Fr()}Ze.syncPeople(P.state)}function oc(e,t){let r=Vr(new Date),i=Ie();i.missionsDate!==r&&(i.missionsDate=r,i.missionProgress=[0,0,0],i.missionClaimed=[!1,!1,!1],Js(i.coins));let a=Ie();a.missionsDate===r&&(e==="depart"&&(a.missionProgress[0]+=1),e==="combo"&&(a.missionProgress[1]=Math.max(a.missionProgress[1]||0,t||0)),e==="clear"&&(a.missionProgress[2]+=1),localStorage.setItem("trr_save_v1",JSON.stringify(a)))}function uc(){if(!P.squeezeUsed){P.adOpen=!0;let e=nn(),t=document.createElement("h2");t.textContent="Gaartjie squeeze";let r=document.createElement("p");r.textContent="One free bay for this try. No advert.",e.append(t,r,tr("Take the bay","btn primary",()=>{P.squeezeUsed=!0,P.adOpen=!1,Or();let i=_n(P.state,P.level);P.state=i.state,Ze.load(P.level,P.state,null,nc()),ci(P.state,P.level)&&uc()}));return}if(!P.adBayUsed){P.adOpen=!0;let e=nn(),t=document.createElement("h2");t.textContent=Oe.adTitle;let r=document.createElement("p");r.textContent="A short thanks opens one more bay for this try.",e.append(t,r,tr(Oe.watch,"btn primary",()=>{P.adBayUsed=!0,P.adOpen=!1,Or();let i=_n(P.state,P.level);P.state=i.state,Ze.load(P.level,P.state,null,nc()),ci(P.state,P.level)&&rn(Oa(P.state))}),tr(Oe.notNow,"btn",()=>{P.adBayUsed=!0,P.adOpen=!1,Or(),rn(Oa(P.state))}));return}rn(Oa(P.state))}function Bd(){Ia(P.state)?jd():ci(P.state,P.level)&&uc()}async function fs(e){P.busy=!0,Fr();try{await e}catch(t){console.error(t)}P&&(P.busy=!1,Fr(),P.botting&&!P.over&&!P.adOpen&&(await Id(200),Xd()))}function wx(e){return Ze.project(e)||null}function Hd(){P.lastInput=performance.now(),P.hinted=!1}function ic(e,t,r){let i=wx(e);fs((async()=>{wa(),Od(14),i?Qt(t,i.x,i.y):Qt(t),await Ze.bump(e),r>=0&&Ze.flash(r)})())}function Vd(e){cc();let t=gn(P.state,P.level,e);if(!t){P.undo.pop();return}P.state=t.state,Ze.setState(P.state),fs((async()=>{await kd(t.events),Bd()})())}function Gd(e){if(!P||P.busy||P.over||P.adOpen)return;Hd();let t=Pc(P.state,P.level,e);if(t.t!=="none"){if(!P.timing&&P.launch.mode==="daily"&&(P.timing=!0),t.reveal&&(P.state.revealed[e]=1),t.t==="bump"){ic(e,Oe.hoot,t.blocker),Ze.syncPeople(P.state);return}if(t.t==="locked"){let r=Math.max(0,(P.level.taxis[e].lockAfter||0)-P.state.departed);ic(e,`Lock ${r}`,null);return}if(t.t==="red"){ic(e,"Red robot",null);return}if(t.t==="nobay"){fs((async()=>{wa(),Ze.shake(),Qt("Bays full"),await Id(180),ci(P.state,P.level)&&uc()})());return}Vd({t:t.t,id:t.id})}}function Wd(e){if(!P||P.busy||P.over||P.adOpen)return;Hd();let t=Lc(P.state,P.level,e);if(t.t==="wait"){Qt("No seat yet"),wa();return}t.t==="send"&&Vd(t)}function Xd(){if(!P||P.over||P.busy)return;let e=P.level.guide[P.botAt];P.botAt+=1,e&&(e.t==="send"?Wd(e.queue):Gd(e.id))}function us(e){if(!P||P.busy||P.adOpen)return;let t=e==="bay"?"bay":e;if((Ie().tokens[t]||0)>0){Wc(t),e==="bay"?Ud():e==="undo"?Dd():Nd(),Fr();return}if(e==="undo"&&!P.undo.length){Qt("Nothing to undo");return}if(e==="bay"&&P.state.extraUsed)return;if(e==="shuffle"){let h=0;for(let d of P.state.boarded)for(let p of d)p||(h+=1);if(h<2){Qt("Queue is short");return}}P.adOpen=!0;let r=++rc;rr("ad",Oe.adTitle);let i=nn(),a=document.createElement("h2");a.textContent=Oe.adTitle;let n=document.createElement("p");n.className="lead",n.textContent=e==="bay"?Oe.extraBay:e==="undo"?Oe.undo:Oe.shuffle;let s=document.createElement("p");s.textContent=Oe.adBody;let o=document.createElement("div");o.className="bar";let l=document.createElement("span");o.append(l);let c=tr(Oe.watch,"btn primary",()=>{st(),c.disabled=!0;let h=performance.now(),d=ds?200:1100,p=v=>{if(r!==rc)return;let g=Math.min(1,(v-h)/d);l.style.width=`${g*100}%`,g<1?requestAnimationFrame(p):(P.adOpen=!1,Or(),e==="bay"?Ud():e==="undo"?Dd():Nd())};requestAnimationFrame(p)}),u=tr(Oe.notNow,"btn",()=>{st(),rc+=1,P.adOpen=!1,Or()});i.append(a,n,s,o,c,u)}function Dd(){let e=P.undo.pop();e&&(Tx(e),P.over=!1,P.paid=!1,Or(),Ze.load(P.level,P.state,P.hidden,{livery:P.livery,showArrows:P.showArrows}),Fr())}function Ud(){cc();let e=_n(P.state,P.level);if(!e){P.undo.pop();return}P.state=e.state,P.over=!1,Or(),Ze.load(P.level,P.state,P.hidden,{livery:P.livery,showArrows:P.showArrows}),Fr(),Ia(P.state)?jd():ci(P.state,P.level)&&rn(Oa(P.state))}function Nd(){cc();let e=(Date.now()^P.state.moves*997)>>>0,t=()=>{e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296},r=Uc(P.state,P.level,t);P.state=r.state,Ze.setState(P.state);let i=r.events.filter(a=>a.t==="board").map(a=>a.pIndex);Ze.syncPeople(P.state,i),fs((async()=>{await kd(r.events.filter(a=>a.t==="board"||a.t==="depart")),Bd()})())}function Ax(){let e=le("modal"),t=document.createElement("div");t.className="confetti";let r=["#E23D3D","#2F6FED","#F2C14E","#3E9B4F","#F07A2A","#7A4E9A","#E56AA8"],i=ds?8:24;for(let a=0;a<i;a+=1){let n=document.createElement("i");n.style.background=r[a%r.length],n.style.left=`${a%2?10:78}%`,n.style.top=`${18+a%6*8}%`,n.style.animationDelay=`${a*.02}s`,t.append(n)}e.append(t)}function jd(){if(!P||P.paid)return;P.paid=!0,P.over=!0,P.timing=!1;let e=Math.max(0,Math.floor(P.elapsed/1e3)),t=Nc(P.state.moves,e,P.level),r=P.launch.mode==="daily",i=r?Bc(P.level.daily||Vr(new Date),t):kc(P.level.id,t);Mc(),Aa(),Ta(1.3),r||jc(P.level.id),oc("clear");let a=!r&&(P.level.reward||1)>1?i.gain:0;a&&xn(a),Od(20),rr("win",`Win ${t} stars ${P.state.moves} moves`);let n=nn();Ax();let s=document.createElement("h2");s.textContent=r?Oe.winDaily:Oe.win;let o=document.createElement("p");o.className="stars";for(let u=0;u<3;u+=1){let h=document.createElement("span");h.textContent="\u2605",h.className=u<t?"pop":"pop off",h.style.animationDelay=`${u*120}ms`,o.append(h)}let l=document.createElement("p");l.textContent=`${P.state.moves} moves \xB7 ${e}s \xB7 par ${P.level.par}`;let c=document.createElement("p");if(c.className="lead",c.textContent=`+${i.gain+a} coins`,n.append(s,o,l,c),sn(),Fr(),r){let u=Hs(P.level,{daily:!0,stars:t,moves:P.state.moves,time:e},cs(P.level.daily||Vr(new Date))),h=document.createElement("pre");h.className="share",h.textContent=u;let d=tr(Oe.share,"btn primary",async()=>{await Fd(u)==="copied"&&Qt(Oe.copied)});n.append(h,d)}!r&&P.level.id<Hr&&n.append(tr(Oe.next,"btn primary",()=>{st(),dr({mode:"level",id:P.level.id+1})})),n.append(tr(Oe.retry,"btn",()=>{st(),dr(P.launch)})),n.append(tr(r?"Lobby":Oe.map,"btn",()=>{st(),r?an():hs()}))}function rn(e){if(!P||P.over)return;P.over=!0,P.timing=!1,Sc(),P.launch.mode!=="daily"&&Xc(P.level.id),rr("lose",e==="full"?Oe.loseFull:Oe.loseJam);let t=nn(),r=document.createElement("h2");r.textContent=e==="full"?Oe.loseFull:Oe.loseJam;let i=document.createElement("p");i.textContent=Oe.loseHint,t.append(r,i),t.append(tr(Oe.retry,"btn primary",()=>{st(),dr(P.launch)})),e==="full"&&!P.state.extraUsed&&t.append(tr(Oe.extraBay,"btn",()=>{P.over=!1,Or(),us("bay")})),t.append(tr(Oe.map,"btn",()=>{st(),P.launch.mode==="daily"?an():hs()})),Fr()}function qd(e){let t=e-Rd;if(Rd=e,P&&!P.over&&!P.busy&&Ze&&Ze.pulse&&e-(P.lastInput||e)>1e4&&!P.hinted){let r=Dc(P.state,P.level);r>=0&&(P.hinted=!0,Ze.pulse(r))}if(P&&P.timing&&!P.over&&!document.hidden){P.elapsed+=Math.min(t,1e3);let r=Math.floor(P.elapsed/1e3);r!==P.shown&&(P.shown=r,le("g-time").textContent=`${r}s`)}requestAnimationFrame(qd)}function Cx(){le("t-title").textContent=Ci.title,le("t-sub").textContent=Ci.subtitle,document.title=Ci.title,le("m-title").textContent=Oe.levels,le("s-title").textContent=Oe.shop,le("d-title").textContent=Ci.dailyName,le("g-bay").innerHTML=`${hr.bay}<span>${Oe.extraBay}</span>`,le("g-undo").innerHTML=`${hr.undo}<span>${Oe.undo}</span>`,le("g-shuffle").innerHTML=`${hr.shuffle}<span>${Oe.shuffle}</span>`;for(let e of["m-back","s-back","d-back","g-back","r-back","n-back","set-back"])le(e).innerHTML=hr.back;le("g-restart").innerHTML=hr.restart;for(let e of["t-coins","m-coins","s-coins","g-coins"]){let t=le(e);t.innerHTML=`${hr.coin}<span>0</span>`}le("t-play").addEventListener("click",()=>{st();let e=Math.min(Hr,Math.max(1,Ie().unlocked));dr({mode:"level",id:e})}),le("t-levels").addEventListener("click",()=>{st(),hs()}),le("t-daily").addEventListener("click",()=>{st(),an()}),le("t-shop").addEventListener("click",()=>{st(),zd()}),le("t-rank").addEventListener("click",()=>{st(),Yd()}),le("t-missions").addEventListener("click",()=>{st(),Zd()}),le("t-event").addEventListener("click",()=>{st(),Jd()}),le("t-settings").addEventListener("click",()=>{st(),ai("settings"),le("set-cb").textContent=Ie().colorblind?"Colour-blind palette: on":"Colour-blind palette: off"}),le("set-back").addEventListener("click",()=>ti()),le("set-cb").addEventListener("click",()=>{Zc(!Ie().colorblind),le("set-cb").textContent=Ie().colorblind?"Colour-blind palette: on":"Colour-blind palette: off"}),le("r-back").addEventListener("click",()=>ti()),le("n-back").addEventListener("click",()=>ti()),le("t-mute").addEventListener("click",Pd),le("g-mute").addEventListener("click",Pd),le("t-music").addEventListener("click",Ld),le("g-music").addEventListener("click",Ld),le("m-back").addEventListener("click",()=>{st(),ti()}),le("s-back").addEventListener("click",()=>{st(),ti()}),le("d-back").addEventListener("click",()=>{st(),ti()}),le("g-back").addEventListener("click",()=>{!P||P.busy||(st(),P.launch.mode==="daily"?an():hs())}),le("g-restart").addEventListener("click",()=>{!P||P.busy||(st(),dr(P.launch))}),le("m-prev").addEventListener("click",()=>{ii>0&&(ii-=1,sc())}),le("m-next").addEventListener("click",()=>{ii<Math.ceil(Hr/12)-1&&(ii+=1,sc())}),le("g-bay").addEventListener("click",()=>us("bay")),le("g-undo").addEventListener("click",()=>us("undo")),le("g-shuffle").addEventListener("click",()=>us("shuffle")),document.body.addEventListener("pointerdown",e=>{e.target.closest("[data-music]")||Rs()}),requestAnimationFrame(qd)}function Rx(){let e=le("coach");if(!e)return;let t=P&&P.level&&P.level.tutorial;if(!t||Ie().seen.includes(t.mech)){e.hidden=!0;return}e.hidden=!1,le("coach-text").textContent=t.text,le("coach-go").onclick=()=>{qc(t.mech),e.hidden=!0;let r=Ze.project(t.focus||0),i=le("coach-hand");if(r&&i){let a=le("app").getBoundingClientRect();i.hidden=!1,i.style.left=`${r.x-a.left}px`,i.style.top=`${r.y-a.top}px`,setTimeout(()=>{i.hidden=!0},1800)}}}function Yd(){let e=le("rank-list");e.replaceChildren();let t=Ie();Tc.forEach((r,i)=>{let a=document.createElement("article");a.className="shop-row";let n=document.createElement("div"),s=document.createElement("strong");s.textContent=r.name;let o=document.createElement("p");o.textContent=i<t.rank?"Built":i===t.rank?"Yours now":`${r.cost} coins`,n.append(s,o);let l=document.createElement("button");l.type="button",l.className="btn small primary",l.textContent=i<t.rank?"Built":i===t.rank?"Yours":i===t.rank+1?"Build":"Locked",l.disabled=i!==t.rank+1,l.addEventListener("click",()=>{if(t.coins<r.cost){Qt("Need coins");return}xn(-r.cost),Yc(i),Aa(),Yd()}),a.append(n,l),e.append(a)}),ai("rank"),Lt&&(Lt.setStage(Ie().rank),Lt.resize(),Lt.start()),rr("rank","Your rank")}function Zd(){let e=le("mission-list");e.replaceChildren();let t=Vr(new Date),r=Ie();r.missionsDate!==t&&(r.missionsDate=t,r.missionProgress=[0,0,0],r.missionClaimed=[!1,!1,!1],localStorage.setItem("trr_save_v1",JSON.stringify(r))),[["Depart 8 combis",8,15,null],["Reach a x3 combo",3,10,"undo"],["Clear 2 levels",2,12,"shuffle"]].forEach((a,n)=>{let s=document.createElement("article");s.className="shop-row";let o=document.createElement("div"),l=document.createElement("strong");l.textContent=a[0];let c=document.createElement("p"),u=Ie().missionProgress[n]||0;c.textContent=`${Math.min(u,a[1])} / ${a[1]}`,o.append(l,c);let h=document.createElement("button");h.type="button",h.className="btn small primary";let d=Ie().missionClaimed[n];h.textContent=d?"Done":"Claim",h.disabled=d||u<a[1],h.addEventListener("click",()=>{let p=Ie();p.missionClaimed[n]=!0,p.coins+=a[2],a[3]&&(p.tokens[a[3]]=(p.tokens[a[3]]||0)+1),localStorage.setItem("trr_save_v1",JSON.stringify(p)),Aa(),Zd()}),s.append(o,h),e.append(s)}),ai("missions"),rr("missions","Missions")}function Jd(){let e=Ie(),t=Vr(new Date).slice(0,7);e.eventWeek!==t&&(e.eventWeek=t,e.eventStep=0,e.eventDone=!1,localStorage.setItem("trr_save_v1",JSON.stringify(e)));let r=Ie();if(r.eventDone){Qt("Ladder cleared"),ti();return}let i=Oc(r.eventStep||0,Os(`month-end:${t}`));dr({mode:"event",id:(r.eventStep||0)+1,level:i})}async function Px(){Cx();let e=le("turntable"),t=Td(e);t.ok&&(Lt=t,new ResizeObserver(()=>Lt.resize()).observe(e),Lt.setLook(Ie().livery),Lt.resize());let r=le("boot-fill");r&&(r.style.width="100%"),le("boot").hidden=!0;let i={size:4,luggage:8,twotone:12,tarp:16,lock:20,gaartjie:24,robot:28,cone:32,officer:36,queues:40,tow:44,rain:48}[Sr.get("mech")],a={durban:1,joburg:31,cape:61,gqeberha:91,bloem:121}[Sr.get("region")];ri.level>=1&&ri.level<=Hr?dr({mode:"level",id:ri.level|0}):i?dr({mode:"level",id:i}):a?dr({mode:"level",id:a}):Sr.has("event")?Jd():ri.daily?an():ti(),globalThis.TRR={get screen(){return document.body.dataset.screen},get game(){return P},project(n){return Ze&&Ze.project?Ze.project(n):null}}}Px().catch(e=>{console.error(e),le("boot").hidden=!1,le("boot-note").textContent="The rank did not load."});setTimeout(()=>{!Sr.has("nosw")&&"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js",{scope:"./"}).catch(()=>{})},2500);
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
