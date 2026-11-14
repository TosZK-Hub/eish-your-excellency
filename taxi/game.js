var _s={menu:"music_menu.mp3",gameplay:"music_gameplay.mp3",rushhour:"music_rushhour.mp3"},ds=.6,$d=.45,cc=.4,hc=.72,Tt=null,on=null,si=null,zr=null,xs=!1,oi=!0,cn=!1,gs="menu",uc="",ps=null,sn=0,fs={},ms={};function Qd(e){return new URL(`../assets/audio/${_s[e]}`,import.meta.url)}function ln(e){return _s[e]?(fs[e]||(fs[e]=fetch(Qd(e)).then(t=>{if(!t.ok)throw new Error(`missing ${e}`);return t.arrayBuffer()})),fs[e]):Promise.reject(new Error("unknown track"))}function dc(){ln("menu").then(()=>{setTimeout(()=>{ln("gameplay"),ln("rushhour")},700)}).catch(()=>{})}function ys(){let e=globalThis.AudioContext||globalThis.webkitAudioContext;return e?(Tt||(Tt=new e,on=Tt.createGain(),on.gain.value=1,on.connect(Tt.destination),zr=Tt.createGain(),zr.gain.value=1,si=Tt.createGain(),si.gain.value=0,si.connect(zr),zr.connect(Tt.destination)),Tt.state==="suspended"&&Tt.resume(),Tt):null}function Ms(e){xs=!!e}function Ma(){return xs}function Ss(e){if(oi=!!e,!Tt||!si)return;let t=Tt.currentTime;ya(si.gain,oi?hc:8e-4,.25),oi&&cn&&ws()}function Es(){return oi}function bs(e){gs=_s[e]?e:"menu",cn&&oi&&ws()}function Ts(){ys()&&(cn=!0,oi&&ws())}function ep(e){return ms[e]?Promise.resolve(ms[e]):ln(e).then(t=>{let r=ys();if(!r)throw new Error("no audio");return r.decodeAudioData(t.slice(0))}).then(t=>(ms[e]=t,t))}function tp(e,t){let r=Tt,i=Math.min($d,e.duration*.08),a=!0,n=[],s=[];function o(l,c){if(!a)return;let u=Math.max(l,r.currentTime+.01),h=r.createBufferSource();h.buffer=e;let d=r.createGain();h.connect(d),d.connect(t);let p=u+e.duration,v=c?i:.03;d.gain.setValueAtTime(8e-4,u),d.gain.exponentialRampToValueAtTime(1,u+v),d.gain.setValueAtTime(1,Math.max(u+v+.02,p-i)),d.gain.exponentialRampToValueAtTime(8e-4,p),h.start(u),h.stop(p+.03),s.push(h);let g=p-i,m=(g-r.currentTime)*1e3-180;n.push(setTimeout(()=>o(g,!0),Math.max(0,m)))}return o(r.currentTime+.02,!1),()=>{a=!1;for(let l of n)clearTimeout(l);for(let l of s)try{l.stop()}catch{}}}function ya(e,t,r){let i=Tt.currentTime,a=Math.max(8e-4,e.value||8e-4),n=Math.max(8e-4,t);e.cancelScheduledValues(i),e.setValueAtTime(a,i),e.exponentialRampToValueAtTime(n,i+Math.max(.02,r))}function rp(e,t){if(uc===e&&ps)return;let r=Tt.createGain();r.gain.setValueAtTime(8e-4,Tt.currentTime),r.connect(si),ya(r.gain,1,ds);let i=tp(t,r),a=ps;ps={scene:e,slot:r,stop:i},uc=e,ya(si.gain,hc,.08),a&&(ya(a.slot.gain,8e-4,ds),setTimeout(()=>a.stop(),ds*1e3+60))}function ws(){let e=gs;ep(e).then(t=>{!cn||!oi||gs!==e||rp(e,t)}).catch(t=>console.error(t))}function Sa(e){if(!Tt||!zr)return;let r=Tt.currentTime+Math.max(.08,e);sn=Math.max(sn,r),ya(zr.gain,cc,.04),zr.gain.setValueAtTime(Math.max(8e-4,cc),sn),zr.gain.exponentialRampToValueAtTime(1,sn+.3)}function Ht(e,t,r,i,a){if(xs)return;let n=ys();if(!n)return;Sa(t+.05);let s=n.currentTime,o=n.createOscillator(),l=n.createGain();o.type=r,o.frequency.setValueAtTime(e,s),a&&o.frequency.exponentialRampToValueAtTime(Math.max(40,a),s+t),l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(i,s+.012),l.gain.exponentialRampToValueAtTime(1e-4,s+t),o.connect(l),l.connect(on),o.start(s),o.stop(s+t+.02)}function st(){Ht(640,.05,"sine",.05)}var vs={hoot:[540,360],sharp:[760,520],low:[280,180],bell:[880,660]},pc="hoot";function fc(e){vs[e]&&(pc=e)}function Ea(){let e=vs[pc]||vs.hoot;Ht(e[0],.09,"square",.07,e[0]),Ht(e[1],.16,"square",.06)}function mc(e){let t=Math.min(4,Math.max(1,e||1));Ht(420+t*70,.12,"square",.07),Ht(560+t*80,.16,"square",.06)}function gc(){Ht(220,.26,"sawtooth",.045,80)}function vc(){Ht(880,.08,"sine",.07,1320)}function ba(){Ht(660,.08,"triangle",.06),setTimeout(()=>Ht(880,.1,"triangle",.06),70)}function _c(){Sa(.55),Ht(523,.12,"triangle",.06),setTimeout(()=>Ht(659,.12,"triangle",.06),90),setTimeout(()=>Ht(784,.18,"triangle",.07),180)}function xc(){Sa(.5),Ht(330,.14,"triangle",.06,180),setTimeout(()=>Ht(196,.22,"triangle",.05),120)}var li={id:"taxi-rank",title:"Taxi Rank Rush",short:"Rank Rush",subtitle:"Pull the minibuses out. Match the queue.",vehicle:"taxi",vehiclePlural:"taxis",place:"rank",bay:"loading bay",vip:"Gaartjie",coin:"coin",dailyName:"Rush Hour",footnote:"A fictional rank. No real companies, no real routes."};var Ta=[{id:"red",name:"Red",hex:"#E23D3D",emoji:"\u{1F7E5}"},{id:"blue",name:"Blue",hex:"#2F6FED",emoji:"\u{1F7E6}"},{id:"yellow",name:"Yellow",hex:"#F2C14E",emoji:"\u{1F7E8}"},{id:"green",name:"Green",hex:"#3E9B4F",emoji:"\u{1F7E9}"},{id:"purple",name:"Purple",hex:"#7A4E9A",emoji:"\u{1F7EA}"},{id:"orange",name:"Orange",hex:"#F07A2A",emoji:"\u{1F7E7}"},{id:"teal",name:"Teal",hex:"#1F8A84",emoji:"\u{1FA75}"},{id:"pink",name:"Pink",hex:"#E56AA8",emoji:"\u{1FA77}"}];var As=[{id:"plain",name:"Rank plain",price:0,blurb:"White combi, one stripe."},{id:"stripes",name:"Extra stripes",price:20,blurb:"Another band on the side."},{id:"chequers",name:"Chequers",price:50,blurb:"A checked belt."},{id:"stars",name:"Stars",price:90,blurb:"Little stars on the panel."},{id:"zigzag",name:"Zigzag",price:140,blurb:"A lightning stripe."},{id:"flowers",name:"Flowers",price:180,blurb:"Blooms along the roof."},{id:"flames",name:"Flames",price:220,blurb:"Hot rods for the rank."}],Ne={play:"Play",levels:"Levels",daily:"Rush Hour",shop:"Liveries",back:"Back",next:"Next",retry:"Try again",map:"Level map",share:"Share",copied:"Copied",watch:"Watch",notNow:"Not now",equip:"Equip",equipped:"Equipped",buy:"Buy",locked:"Locked",hoot:"Hoot!",brake:"Brake off",win:"Rank cleared!",winDaily:"Rush Hour cleared!",loseFull:"The bays are full",loseJam:"The rank is jammed",loseHint:"No stress. Line them up another way.",adTitle:"Watch a short ad?",adBody:"A short thanks. Then the booster is yours.",adWatching:"Watching\u2026",extraBay:"Extra bay",undo:"Undo",shuffle:"Shuffle",queue:"Queue",moves:"Moves",par:"Par",coins:"Coins",youHave:"You have",streak:"Streak",dailyLead:"One puzzle for everyone, seeded by today's date.",dailyDone:"You already cleared today. Share the grid, or play it again for fun.",spareIntro:"A spare combi has no queue. Park one and it sits in the bay.",gaartjieIntro:"The gaartjie jumps the queue onto the first taxi of their colour.",hiddenIntro:"A tarp hides the colour until a neighbour leaves, or you tap it.",lockIntro:"Hand brake on. Tap once to release, again to drive.",how1:"Tap a taxi. If the lane to the edge is clear, it pulls into a bay.",how2:"Passengers board a matching colour. Full taxis leave. Wrong lane? It hoots."};var Rx={1:Ne.how1,2:Ne.how2,4:Ne.hiddenIntro,8:Ne.lockIntro,12:Ne.gaartjieIntro,18:Ne.spareIntro};var yc=["#0072B2","#E69F00","#F0E442","#009E73","#56B4E9","#D55E00","#111111","#CC79A7"];function Mc(e,t){let r=t?yc[e]||yc[0]:(Ta[e]||Ta[0]).hex;return Number.parseInt(r.slice(1),16)}var Cs=[{id:"durban",name:"Durban",sky:"#B7DEF2",ground:"#4E5968",grass:"#7DBE6A"},{id:"joburg",name:"Joburg",sky:"#F0D7A0",ground:"#5A5348",grass:"#C2A15A"},{id:"cape",name:"Cape Town",sky:"#8EC6E6",ground:"#3D4A55",grass:"#3E9B6A"},{id:"gqeberha",name:"Gqeberha",sky:"#C5DFF0",ground:"#4A5560",grass:"#6AAA78"},{id:"bloem",name:"Bloemfontein",sky:"#F6E2B8",ground:"#6A5A48",grass:"#D2B56A"}],Sc=[{id:"dirt",name:"Dirt lot",cost:0},{id:"shelter",name:"Shelter",cost:40},{id:"stall",name:"Food stall",cost:90},{id:"mural",name:"Mural wall",cost:150},{id:"sound",name:"Sound system",cost:230},{id:"solar",name:"Solar lights",cost:330},{id:"roof",name:"Roof",cost:460}];var Rs=["Sharp!","Yebo!","Hau!","Lekker!"];var kr=[{x:0,y:-1,name:"up"},{x:1,y:0,name:"right"},{x:0,y:1,name:"down"},{x:-1,y:0,name:"left"}],Br=150,fr={hiace:{len:2,seats:6,name:"Hiace"},quantum:{len:3,seats:9,name:"Quantum"},sprinter:{len:4,seats:12,name:"Sprinter"}},Ec={1:"basics",4:"size",8:"luggage",12:"twotone",16:"tarp",20:"lock",24:"gaartjie",28:"robot",32:"cone",36:"officer",40:"queues",44:"tow",48:"rain"},ap={basics:"Tap a combi. If the lane ahead is clear, it drives into a bay.",size:"A Hiace is short, a Quantum is the usual combi, a Sprinter is the long one.",luggage:"A bag or bucket needs two free seats.",twotone:"A split roof takes either colour.",tarp:"A tarp hides the colour until you tap it, or a neighbour leaves.",lock:"The padlock number is how many other combis must leave first.",gaartjie:"The gaartjie fills that combi the moment they step in.",robot:"A green robot lets them out. Red means wait. It flips every two taps.",cone:"Cones and potholes are solid. Drive around them.",officer:"The officer steps one cell every three taps.",queues:"Two queues. Tap a head to send that passenger first.",tow:"Chained combis leave together. Both lanes must be clear.",rain:"Wet road, same rules. Take it slow in your head, not in the taps."};function mn(e){let t=e>>>0;return function(){t=t+1831565813|0;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}function Ds(e){let t=2166136261;for(let r=0;r<e.length;r+=1)t^=e.charCodeAt(r),t=Math.imul(t,16777619);return t>>>0}function Us(e,t){let r=e.slice();for(let i=r.length-1;i>0;i-=1){let a=t()*(i+1)|0,n=r[i];r[i]=r[a],r[a]=n}return r}function Hr(e=new Date){let t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${t}-${r}-${i}`}function Ns(e){let t=(e-1)%10+1;return t===10?"super":t===5?"hard":t===3||t===4||t===8||t===9?"medium":"easy"}function np(e){return e>=121?"bloem":e>=91?"gqeberha":e>=61?"cape":e>=31?"joburg":"durban"}function Aa(e){let t=kr[e.dir],r=[];for(let i=0;i<e.len;i+=1)r.push({c:e.c-t.x*i,r:e.r-t.y*i});return r}function Ci(e,t,r){return t>=0&&r>=0&&t<e.cols&&r<e.rows}function mr(e){let t=new Int16Array(e.cols*e.rows);t.fill(-1);for(let r of e.taxis)for(let i of Aa(r))Ci(e,i.c,i.r)&&(t[i.r*e.cols+i.c]=r.id);return e.grid=t,e.cones=e.cones||[],e.robots=e.robots||[],e.queues=e.queues||[[]],e}function Is(e){return{exited:new Uint8Array(e.taxis.length),bayTaxi:new Int16Array(e.bays).fill(-1),bayFilled:new Uint8Array(e.bays),boarded:e.queues.map(t=>new Uint8Array(t.length)),queues:e.queues.map(t=>t.map(r=>({...r}))),moves:0,departed:0,combo:0,squeezeUsed:0,revealed:Uint8Array.from(e.taxis.map(t=>t.hidden?0:1))}}function wi(e){return{exited:e.exited.slice(),bayTaxi:e.bayTaxi.slice(),bayFilled:e.bayFilled.slice(),boarded:e.boarded.map(t=>t.slice()),queues:e.queues.map(t=>t.map(r=>({...r}))),moves:e.moves,departed:e.departed,combo:e.combo,squeezeUsed:e.squeezeUsed,revealed:e.revealed.slice()}}function sp(e,t){if(!e.officer||!e.officer.path.length)return null;let r=Math.floor(t.moves/3)%e.officer.path.length;return e.officer.path[r]}function op(e,t,r,i){if(!Ci(e,r,i))return null;for(let s of e.cones)if(s.c===r&&s.r===i)return-2;let a=sp(e,t);if(a&&a.c===r&&a.r===i)return-3;let n=e.grid[i*e.cols+r];return n>=0&&!t.exited[n]?n:null}function Ca(e,t,r){return wa(e,t,r)===null}function wa(e,t,r){let i=e.taxis[r],a=kr[i.dir],n=i.c+a.x,s=i.r+a.y;for(;Ci(e,n,s);){let o=op(e,t,n,s);if(o!==null&&o!==r)return o;n+=a.x,s+=a.y}return null}function lp(e){return Math.floor(e.moves/2)%2===0}function un(e,t,r){let i=r.dir%2===0?r.c:r.r;for(let a of e.robots)if(a.dir===r.dir&&a.lane===i&&!lp(t))return!1;return!0}function hn(e,t){return(e.lockAfter||0)>t.departed}function Os(e){let t=0;for(let r=0;r<e.bayTaxi.length;r+=1)e.bayTaxi[r]<0&&(t+=1);return t}function cp(e){for(let t=0;t<e.bayTaxi.length;t+=1)if(e.bayTaxi[t]<0)return t;return-1}function up(e,t){return e.colors.includes(t)}function Ra(e,t,r){for(let i=0;i<e.bayTaxi.length;i+=1){let a=e.bayTaxi[i];if(a<0)continue;let n=t.taxis[a];if(!up(n,r.color))continue;let s=n.seats-e.bayFilled[i];if(r.vip||s>=(r.seats||1))return i}return-1}function hp(e,t,r){let i=e.bayTaxi[t];e.combo=Math.min(5,(e.combo||0)+1),r.push({t:"depart",bay:t,taxiId:i,combo:e.combo}),e.bayTaxi[t]=-1,e.bayFilled[t]=0,e.departed+=1}function wc(e,t,r,i,a){let n=e.queues[r][i],s=Ra(e,t,n);if(s<0)return!1;e.boarded[r][i]=1;let o=e.bayTaxi[s],l=t.taxis[o];return n.vip?e.bayFilled[s]=l.seats:e.bayFilled[s]+=n.seats||1,a.push({t:"board",bay:s,taxiId:o,queue:r,pIndex:i,filled:e.bayFilled[s],seats:l.seats,vip:!!n.vip,luggage:!!n.luggage}),e.bayFilled[s]>=l.seats&&hp(e,s,a),!0}function Ai(e,t){let r=e.boarded[t];for(let i=0;i<r.length;i+=1)if(!r[i])return i;return-1}function dn(e,t,r){if(e.queues.length!==1)return;let i=e.queues[0].length+2;for(let a=0;a<i;a+=1){let n=Ai(e,0);if(n<0||!wc(e,t,0,n,r))return}}function dp(e,t,r){let i=Aa(t.taxis[r]);for(let a of t.taxis){if(!a.hidden||e.revealed[a.id])continue;let n=Aa(a),s=!1;for(let o of i)for(let l of n)Math.abs(o.c-l.c)+Math.abs(o.r-l.r)===1&&(s=!0);s&&(e.revealed[a.id]=1)}}function Ps(e,t,r,i){e.combo=0;let a=cp(e);return e.exited[r]=1,e.revealed[r]=1,e.bayTaxi[a]=r,e.bayFilled[a]=0,i.push({t:"exit",id:r,bay:a}),dp(e,t,r),a}function pn(e,t,r){if(t.exited[r])return!1;let i=e.taxis[r];return i.tow>=0||hn(i,t)||!Ca(e,t,r)||!un(e,t,i)?!1:Os(t)>=1}function Pa(e,t,r){let i=e.taxis[r];if(i.tow<0)return!1;let a=i.tow,n=Math.min(r,a);return r!==n||t.exited[r]||t.exited[a]||hn(i,t)||hn(e.taxis[a],t)||!Ca(e,t,r)||!Ca(e,t,a)||!un(e,t,i)||!un(e,t,e.taxis[a])?!1:Os(t)>=2}function Ac(e,t,r){if(r<0||r>=t.taxis.length||e.exited[r])return{t:"none"};let i=t.taxis[r];if(i.hidden&&!e.revealed[r]&&!Ca(t,e,r))return{t:"bump",id:r,blocker:wa(t,e,r),reveal:!0};if(hn(i,e))return{t:"locked",id:r};if(i.tow>=0){let a=Math.min(r,i.tow);return Pa(t,e,a)?{t:"tow",id:a}:{t:"bump",id:r,blocker:wa(t,e,r)??wa(t,e,i.tow)}}return Ca(t,e,r)?un(t,e,i)?Os(e)<1?{t:"nobay",id:r}:{t:"exit",id:r}:{t:"red",id:r,reveal:i.hidden&&!e.revealed[r]}:{t:"bump",id:r,blocker:wa(t,e,r),reveal:i.hidden&&!e.revealed[r]}}function Cc(e,t,r){if(!e.queues[r])return{t:"none"};let i=Ai(e,r);if(i<0)return{t:"none"};let a=e.queues[r][i];return Ra(e,t,a)<0?{t:"wait",queue:r}:{t:"send",queue:r}}function fn(e,t,r){if(!r)return null;if(r.t==="reveal"){if(!t.taxis[r.id]||e.revealed[r.id])return null;let i=wi(e);return i.revealed[r.id]=1,{state:i,events:[{t:"reveal",id:r.id}]}}if(r.t==="send"){if(e.queues.length<2)return null;let i=Ai(e,r.queue);if(i<0)return null;let a=wi(e),n=[];return wc(a,t,r.queue,i,n)?(a.moves+=1,{state:a,events:n}):null}if(r.t==="exit"){if(!pn(t,e,r.id))return null;let i=wi(e),a=[];return Ps(i,t,r.id,a),i.moves+=1,i.queues.length===1&&dn(i,t,a),{state:i,events:a}}if(r.t==="tow"){if(!Pa(t,e,r.id))return null;let i=wi(e),a=[],n=t.taxis[r.id].tow;return Ps(i,t,r.id,a),Ps(i,t,n,a),i.moves+=1,i.queues.length===1&&dn(i,t,a),{state:i,events:a}}return null}function Da(e){let t=!1;for(let r of e.boarded)if(r.length){t=!0;for(let i=0;i<r.length;i+=1)if(!r[i])return!1}return t}function bc(e,t){if(e.queues.length===1){let r=Ai(e,0);return r<0?!1:Ra(e,t,e.queues[0][r])>=0}for(let r=0;r<e.queues.length;r+=1){let i=Ai(e,r);if(!(i<0)&&Ra(e,t,e.queues[r][i])>=0)return!0}return!1}function pp(e,t){for(let r=0;r<t.taxis.length;r+=1)if(pn(t,e,r)||Pa(t,e,r))return!0;return!!(e.queues.length>1&&bc(e,t)||e.queues.length===1&&bc(e,t))}function ci(e,t){return Da(e)?!1:!pp(e,t)}function Ua(e){for(let t=0;t<e.bayTaxi.length;t+=1)if(e.bayTaxi[t]<0)return"jam";return"full"}function Rc(e,t){if(t.guide){for(let r of t.guide)if(r.t==="exit"&&pn(t,e,r.id)||r.t==="tow"&&Pa(t,e,r.id))return r.id}for(let r=0;r<t.taxis.length;r+=1)if(pn(t,e,r)||Pa(t,e,r))return r;return-1}function gn(e,t){let r=wi(e),i=new Int16Array(e.bayTaxi.length+1);i.set(e.bayTaxi),i[i.length-1]=-1;let a=new Uint8Array(e.bayFilled.length+1);a.set(e.bayFilled),r.bayTaxi=i,r.bayFilled=a,r.squeezeUsed=1;let n=[{t:"bay"}];return r.queues.length===1&&dn(r,t,n),{state:r,events:n}}function Pc(e,t,r){let i=wi(e);for(let n=0;n<i.queues.length;n+=1){let s=[];for(let c=0;c<i.boarded[n].length;c+=1)i.boarded[n][c]||s.push(i.queues[n][c]);let o=Us(s,r),l=0;for(let c=0;c<i.boarded[n].length;c+=1)i.boarded[n][c]||(i.queues[n][c]=o[l],l+=1)}i.moves+=1;let a=[{t:"shuffle"}];return i.queues.length===1&&dn(i,t,a),{state:i,events:a}}function Lc(e,t,r){let i=r.par||e;if(r.daily){let a=r.parTime||90;return e<=i&&t<=a?3:e<=i+3&&t<=a*2?2:1}return e<=i?3:e<=i+3?2:1}function Fs(e,t,r){let i=[];i.push(t.daily?"Taxi Rank Rush \xB7 Rush Hour":`Taxi Rank Rush \xB7 ${e.name||"Level"}`),r&&i.push(r);let a=t.stars||0;i.push(`${"\u2605".repeat(a)}${"\u2606".repeat(Math.max(0,3-a))}  ${t.moves} taps`);let n=[];for(let s=0;s<e.rows;s+=1)n.push(Array.from({length:e.cols},()=>"\u2B1B"));for(let s of e.taxis){let o=s.hidden?"\u2753":Ta[s.colors[0]]?Ta[s.colors[0]].emoji:"\u{1F690}",l=["\u2B06\uFE0F","\u27A1\uFE0F","\u2B07\uFE0F","\u2B05\uFE0F"][s.dir]||"";Ci(e,s.c,s.r)&&(n[s.r][s.c]=o+l)}for(let s of n)i.push(s.join(""));return i.push("Sort the rank."),i.join(`
`)}function fp(e){return{cols:e.cols,rows:e.rows,bays:e.bays,taxis:[],queues:e.queues>1?[[],[]]:[[]],cones:[],robots:[],officer:null,rain:!!e.rain}}function Dc(e,t){let r=kr[t.dir],i=[],a=t.c+r.x,n=t.r+r.y;for(;Ci(e,a,n);)i.push({c:a,r:n}),a+=r.x,n+=r.y;return i}function Ls(e,t){return`${e},${t}`}function mp(e){let t=new Set;for(let r of e.taxis){for(let i of Aa(r))t.add(Ls(i.c,i.r));for(let i of Dc(e,r))t.add(Ls(i.c,i.r))}return t}function gp(e,t){for(let r of Aa(t))if(!Ci(e,r.c,r.r)||(e.grid?e.grid[r.r*e.cols+r.c]:-1)>=0)return!1;for(let r of Dc(e,t)){let i=e.grid[r.r*e.cols+r.c];if(t.needsClear&&i>=0||i>=0&&i>t.id)return!1;if(i<0){for(let a of e.cones)if(a.c===r.c&&a.r===r.r)return!1}}return!0}function vp(e,t,r){let i=[];for(let n=0;n<e.rows;n+=1)for(let s=0;s<e.cols;s+=1)t.c=s,t.r=n,gp(e,t)&&i.push({c:s,r:n});if(!i.length)return!1;let a=i[r()*i.length|0];return t.c=a.c,t.r=a.r,mr(e),!0}function _p(e,t,r,i){if(r.gaartjie&&t.gaartjie){e.push({color:t.colors[0],seats:1,vip:!0,luggage:!1});return}let a=t.seats,n=t.colors,s=0;for(;a>0;){let o=n[s%n.length];s+=1,r.luggage&&a>=2&&i()<.45?(e.push({color:o,seats:2,vip:!1,luggage:!0}),a-=2):(e.push({color:o,seats:1,vip:!1,luggage:!1}),a-=1)}}function xp(e,t,r){let i=e.taxis.map(()=>[]);for(let a of e.taxis)_p(i[a.id],a,t,r);if(t.queues>1){let a=[],n=[];i.forEach((s,o)=>{(o%2===0?a:n).push(...s)}),e.queues=[a,n.length?n:[{color:e.taxis[0].colors[0],seats:1,vip:!1,luggage:!1}]],n.length||(e.queues=[a])}else e.queues=[i.flat()]}function yp(e,t,r){mr(e);let i=mp(e),a=[];for(let n=0;n<e.rows;n+=1)for(let s=0;s<e.cols;s+=1)i.has(Ls(s,n))||a.push({c:s,r:n});if(t.cone){let n=Math.min(2,a.length);for(let s=0;s<n;s+=1){let o=r()*a.length|0;e.cones.push(a.splice(o,1)[0])}}if(t.officer&&a.length>=3){let n=a.slice(0,3);e.officer={path:n}}}function Mp(e){mr(e);let t=Is(e),r=[],i=()=>{if(t.queues.length<2)return!0;for(let a=0;a<40;a+=1){let n=!1;for(let s=0;s<t.queues.length;s+=1){let o=Ai(t,s);if(o<0||Ra(t,e,t.queues[s][o])<0)continue;let l=fn(t,e,{t:"send",queue:s});if(!l)return!1;r.push({t:"send",queue:s}),t=l.state,n=!0;break}if(!n)return!0}return!0};for(let a of e.taxis){if(!i())return null;if(a.tow>=0&&a.tow<a.id)continue;let n=a.tow>=0?{t:"tow",id:Math.min(a.id,a.tow)}:{t:"exit",id:a.id},s=fn(t,e,n);if(!s||(r.push(n),t=s.state,ci(t,e)))return null}return!i()||!Da(t)?null:r}function zs(e,t){let r=t?"easy":Ns(e),i=Ec[e]||null,a=new Set;i&&i!=="basics"&&a.add(i);let n=mn(e*97+(t||0)*13),s=Object.entries(Ec).filter(([h,d])=>Number(h)<e&&d!=="basics"&&d!=="rain").map(([,h])=>h),o=t?0:r==="super"||r==="hard"?2:r==="medium"?1:0,l=Us(s,n);for(let h=0;h<l.length&&a.size<o;h+=1)a.add(l[h]);(i==="rain"||e>=48&&e%9===0)&&!t&&a.add("rain");let c=a.has("size")||e>=4,u=r==="easy"?3:r==="medium"?4:5;return t&&(u=Math.max(2,u-1)),i==="basics"&&(u=2),(i==="gaartjie"||i==="luggage"||i==="twotone")&&(u=1),i==="tow"&&(u=4),i==="robot"&&(u=4),{cols:r==="easy"?5:6,rows:r==="super"?6:5,bays:t?6:5,count:u,colours:Math.max(2,(r==="super"?4:r==="hard"?3:2)-(t?1:0)),sizes:c,mechs:a,rain:a.has("rain"),queues:a.has("queues")?2:1,intro:i}}function Sp(e,t,r){if(!e.sizes)return fr.quantum;if(e.intro==="size")return[fr.hiace,fr.quantum,fr.sprinter][t]||fr.quantum;if(e.queues>1)return r()<.5?fr.hiace:fr.quantum;let i=r();return i<.34?fr.hiace:i<.75?fr.quantum:fr.sprinter}function ks(e,t,r){let i=fp(t);i.grid=new Int16Array(i.cols*i.rows).fill(-1);for(let n=0;n<t.count;n+=1){let s=Sp(t,n,r),o=[n%t.colours];t.mechs.has("twotone")&&n===0&&o.push((n+1)%t.colours);let l={id:n,c:0,r:0,dir:[0,1,2,3][r()*4|0],len:s.len,seats:s.seats,colors:o,hidden:t.mechs.has("tarp")&&n===t.count-1,lockAfter:t.mechs.has("lock")&&n>=2?1:0,tow:-1,needsClear:t.mechs.has("tow")&&n<2,gaartjie:t.mechs.has("gaartjie")&&n===0},c=!1,u=Us([0,1,2,3],r);for(let h of u)if(l.dir=h,vp(i,l,r)){c=!0;break}if(!c)return null;if(i.taxis.push(l),mr(i),t.mechs.has("robot")&&Math.floor(n/2)%2===0){let h=l.dir%2===0?l.c:l.r;i.robots.some(d=>d.dir===l.dir&&d.lane===h)||i.robots.push({dir:l.dir,lane:h})}}if(t.mechs.has("tow")&&i.taxis.length>=2&&(i.taxis[0].tow=1,i.taxis[1].tow=0),t.mechs.has("robot")&&!i.robots.length||(yp(i,{cone:t.mechs.has("cone"),officer:t.mechs.has("officer")},r),t.mechs.has("cone")&&!i.cones.length)||t.mechs.has("officer")&&!i.officer)return null;xp(i,t,r),mr(i);let a=Mp(i);return a?(i.guide=a,i.par=a.length,i.id=e,i.difficulty=(t.intro&&e,void 0),i):null}var Tc=["First in line","After you","Side step","Long nose","Bay lesson","Colour mix","Morning rank","Short hold","Last light","Tight bay","Deep row","Quiet corner","Second wave","Full load","Home stretch","Early bird","Queue hop","Big yard","Nearly home","Final hoot"];function La(e,t,r){e.id=t,e.difficulty=r.intro==="basics"?"easy":r.difficulty||Ns(t),e.reward=e.difficulty==="hard"||e.difficulty==="super"?2:1,e.region=np(t),e.rain=!!r.rain;let i={size:"Three sizes",luggage:"Bags and buckets",twotone:"Split roof",tarp:"Under the tarp",lock:"Padlock",gaartjie:"Gaartjie",robot:"Robot",cone:"Cones",officer:"Officer",queues:"Two queues",tow:"Tow chain",rain:"Wet road"};return e.name=i[r.intro]||Tc[(t-1)%Tc.length],e.tutorial=r.intro?{mech:r.intro,text:ap[r.intro],focus:0}:null,e.parTime=70,e}function Bs(e){return La({id:e,cols:4,rows:4,bays:5,cones:[],robots:[],officer:null,rain:!1,queues:[[{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1},{color:0,seats:1,vip:!1,luggage:!1}]],taxis:[{id:0,c:1,r:2,dir:2,len:3,seats:6,colors:[0],hidden:!1,lockAfter:0,tow:-1,gaartjie:!1}],guide:[{t:"exit",id:0}],par:1},e,{rain:!1,intro:null,difficulty:"easy"})}function Hs(e,t={}){let r=t.easier||0,i=zs(e,r);i.difficulty=r?"easy":Ns(e);let a=mn(e*2654435769+r*2246822507>>>0);for(let n=0;n<80;n+=1){let s=ks(e,i,a);if(s)return La(s,e,i),s}return La(Bs(e),e,i)}function Vs(e=new Date){let t=Hr(e),r=Ds(`taxi-rank-rush:${t}`),i=zs(20+r%15,0);i.queues=1,i.mechs=new Set(["tarp"]),i.rain=!1,i.intro=null,i.count=3,i.colours=2;let a=mn(r),n=null;for(let s=0;s<40&&!n;s+=1)n=ks(0,i,a);return n||(n=Bs(0)),La(n,0,i),n.daily=t,n.name="Rush Hour",n.parTime=80,n.tutorial=null,n.reward=1,n}function Uc(e,t){let r=zs(30,0);r.count=3,r.queues=1,r.intro=null,r.mechs=new Set(e%2===0?["size"]:["luggage"]),r.rain=!1;let i=mn(t+e*131>>>0),a=null;for(let n=0;n<30&&!a;n+=1)a=ks(e+1,r,i);return a||(a=Bs(e+1)),La(a,e+1,r),a.name=`Month-end ${e+1}`,a.tutorial=null,a}var Ws="trr_save_v1";function Gs(){return{unlocked:1,stars:{},coins:0,livery:"plain",owned:["plain"],sound:!0,music:!0,colorblind:!1,rank:0,horn:"hoot",tokens:{bay:1,undo:3,shuffle:1},fails:{},seen:[],missionsDate:"",missionProgress:[0,0,0],missionClaimed:[!1,!1,!1],eventWeek:"",eventStep:0,eventDone:!1,arrows:!1,dailyDate:"",dailyStreak:0,dailyStars:0}}function Oe(){try{let e=localStorage.getItem(Ws);if(!e)return Gs();let t={...Gs(),...JSON.parse(e)};return(!Array.isArray(t.owned)||!t.owned.includes("plain"))&&(t.owned=["plain",...(t.owned||[]).filter(r=>r!=="plain")]),(!t.stars||typeof t.stars!="object")&&(t.stars={}),(!t.tokens||typeof t.tokens!="object")&&(t.tokens={bay:1,undo:3,shuffle:1}),t.tokens={bay:1,undo:3,shuffle:1,...t.tokens},(!t.fails||typeof t.fails!="object")&&(t.fails={}),Array.isArray(t.seen)||(t.seen=[]),Array.isArray(t.missionProgress)||(t.missionProgress=[0,0,0]),Array.isArray(t.missionClaimed)||(t.missionClaimed=[!1,!1,!1]),t.rank=t.rank|0,t}catch{return Gs()}}function Vt(e){try{localStorage.setItem(Ws,JSON.stringify(e))}catch{}}function Ic(){try{localStorage.removeItem(Ws)}catch{}}function Xs(e,t){return e.stars[String(t)]||0}function Oc(e,t){let r=Oe(),i=Xs(r,e),a=0;return i?t>i?a=(t-i)*6:a=2:a=8+t*6,r.coins+=a,r.stars[String(e)]=Math.max(i,t),e>=r.unlocked&&e<150&&(r.unlocked=e+1),Vt(r),{gain:a,save:r}}function Nc(e){let[t,r,i]=e.split("-").map(Number);return new Date(t,r-1,i)}function Fc(e,t){let r=Oe(),i=r.dailyDate!==e,a=0;if(i){if(r.dailyDate){let n=Nc(r.dailyDate),s=Nc(e),o=Math.round((s-n)/864e5);r.dailyStreak=o===1?(r.dailyStreak||0)+1:1}else r.dailyStreak=1;a=12+t*4,r.coins+=a,r.dailyDate=e,r.dailyStars=t}else t>(r.dailyStars||0)&&(r.dailyStars=t);return Vt(r),{gain:a,save:r,first:i}}function zc(e,t){let r=Oe();return r.owned.includes(e)?{ok:!0,save:r,already:!0}:r.coins<t?{ok:!1,reason:"coins",save:r}:(r.coins-=t,r.owned.push(e),r.livery=e,Vt(r),{ok:!0,save:r})}function kc(e){let t=Oe();return t.owned.includes(e)&&(t.livery=e,Vt(t)),t}function Bc(e){let t=Oe();return t.sound=!!e,Vt(t),t}function vn(e){let t=Oe();return t.coins=Math.max(0,t.coins+e),Vt(t),t}function js(e){let t=Oe();return t.coins=Math.max(0,e|0),Vt(t),t}function Hc(e){let t=Oe();return t.tokens[e]?(t.tokens[e]-=1,Vt(t),{ok:!0,save:t}):{ok:!1,save:t}}function Vc(e){let t=Oe(),r=String(e);return t.fails[r]=(t.fails[r]||0)+1,Vt(t),t}function Gc(e){let t=Oe();return delete t.fails[String(e)],Vt(t),t}function Wc(e){let t=Oe();return t.seen.includes(e)||t.seen.push(e),Vt(t),t}function Xc(e){let t=Oe();return t.rank=e,Vt(t),t}function jc(e){let t=Oe();return t.colorblind=!!e,Vt(t),t}function qc(e){let t=Oe();return t.music=!!e,Vt(t),t}var Ml="170",bp=0,Yc=1,Tp=2,ah=1,wp=2,Cr=3,Kr=0,Gt=1,Rr=2,Yr=0,Ki=1,Zc=2,Jc=3,Kc=4,Ap=5,_i=100,Cp=101,Rp=102,Pp=103,Lp=104,Dp=200,Up=201,Np=202,Ip=203,Po=204,Lo=205,Op=206,Fp=207,zp=208,kp=209,Bp=210,Hp=211,Vp=212,Gp=213,Wp=214,Do=0,Uo=1,No=2,ea=3,Io=4,Oo=5,Fo=6,zo=7,nh=0,Xp=1,jp=2,Zr=0,qp=1,Yp=2,Zp=3,Jp=4,Kp=5,$p=6,Qp=7,sh=300,ta=301,ra=302,ko=303,Bo=304,ts=306,Ho=1e3,yi=1001,Vo=1002,Wt=1003,ef=1004,_n=1005,xr=1006,qs=1007,Mi=1008,Ur=1009,oh=1010,lh=1011,Xa=1012,Sl=1013,Si=1014,Pr=1015,ja=1016,El=1017,bl=1018,ia=1020,ch=35902,uh=1021,hh=1022,lr=1023,dh=1024,ph=1025,$i=1026,aa=1027,fh=1028,Tl=1029,mh=1030,wl=1031,Al=1033,Wn=33776,Xn=33777,jn=33778,qn=33779,Go=35840,Wo=35841,Xo=35842,jo=35843,qo=36196,Yo=37492,Zo=37496,Jo=37808,Ko=37809,$o=37810,Qo=37811,el=37812,tl=37813,rl=37814,il=37815,al=37816,nl=37817,sl=37818,ol=37819,ll=37820,cl=37821,Yn=36492,ul=36494,hl=36495,gh=36283,dl=36284,pl=36285,fl=36286,$n=2300,ml=2301,Ys=2302,$c=2400,Qc=2401,eu=2402,tf=3200,rf=3201,vh=0,af=1,vr="",Mt="srgb",sa="srgb-linear",rs="linear",it="srgb",Ri=7680,tu=519,nf=512,sf=513,of=514,_h=515,lf=516,cf=517,uf=518,hf=519,gl=35044,ru="300 es",Lr=2e3,Qn=2001,oa=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let r=this._listeners[e];if(r!==void 0){let i=r.indexOf(t);i!==-1&&r.splice(i,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let r=t.slice(0);for(let i=0,a=r.length;i<a;i++)r[i].call(this,e);e.target=null}}},Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zs=Math.PI/180,vl=180/Math.PI;function Jr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Lt[e&255]+Lt[e>>8&255]+Lt[e>>16&255]+Lt[e>>24&255]+"-"+Lt[t&255]+Lt[t>>8&255]+"-"+Lt[t>>16&15|64]+Lt[t>>24&255]+"-"+Lt[r&63|128]+Lt[r>>8&255]+"-"+Lt[r>>16&255]+Lt[r>>24&255]+Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]).toLowerCase()}function Ct(e,t,r){return Math.max(t,Math.min(r,e))}function df(e,t){return(e%t+t)%t}function Js(e,t,r){return(1-r)*e+r*t}function _r(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function at(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}var ve=class xh{constructor(t=0,r=0){xh.prototype.isVector2=!0,this.x=t,this.y=r}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,r){return this.x=t,this.y=r,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,r){switch(t){case 0:this.x=r;break;case 1:this.y=r;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,r){return this.x=t.x+r.x,this.y=t.y+r.y,this}addScaledVector(t,r){return this.x+=t.x*r,this.y+=t.y*r,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,r){return this.x=t.x-r.x,this.y=t.y-r.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let r=this.x,i=this.y,a=t.elements;return this.x=a[0]*r+a[3]*i+a[6],this.y=a[1]*r+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,r){return this.x=Math.max(t.x,Math.min(r.x,this.x)),this.y=Math.max(t.y,Math.min(r.y,this.y)),this}clampScalar(t,r){return this.x=Math.max(t,Math.min(r,this.x)),this.y=Math.max(t,Math.min(r,this.y)),this}clampLength(t,r){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(r,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let r=Math.sqrt(this.lengthSq()*t.lengthSq());if(r===0)return Math.PI/2;let i=this.dot(t)/r;return Math.acos(Ct(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let r=this.x-t.x,i=this.y-t.y;return r*r+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,r){return this.x+=(t.x-this.x)*r,this.y+=(t.y-this.y)*r,this}lerpVectors(t,r,i){return this.x=t.x+(r.x-t.x)*i,this.y=t.y+(r.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,r=0){return this.x=t[r],this.y=t[r+1],this}toArray(t=[],r=0){return t[r]=this.x,t[r+1]=this.y,t}fromBufferAttribute(t,r){return this.x=t.getX(r),this.y=t.getY(r),this}rotateAround(t,r){let i=Math.cos(r),a=Math.sin(r),n=this.x-t.x,s=this.y-t.y;return this.x=n*i-s*a+t.x,this.y=n*a+s*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},We=class yh{constructor(t,r,i,a,n,s,o,l,c){yh.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,r,i,a,n,s,o,l,c)}set(t,r,i,a,n,s,o,l,c){let u=this.elements;return u[0]=t,u[1]=a,u[2]=o,u[3]=r,u[4]=n,u[5]=l,u[6]=i,u[7]=s,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let r=this.elements,i=t.elements;return r[0]=i[0],r[1]=i[1],r[2]=i[2],r[3]=i[3],r[4]=i[4],r[5]=i[5],r[6]=i[6],r[7]=i[7],r[8]=i[8],this}extractBasis(t,r,i){return t.setFromMatrix3Column(this,0),r.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let r=t.elements;return this.set(r[0],r[4],r[8],r[1],r[5],r[9],r[2],r[6],r[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,r){let i=t.elements,a=r.elements,n=this.elements,s=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],v=i[8],g=a[0],m=a[3],f=a[6],b=a[1],M=a[4],C=a[7],G=a[2],E=a[5],A=a[8];return n[0]=s*g+o*b+l*G,n[3]=s*m+o*M+l*E,n[6]=s*f+o*C+l*A,n[1]=c*g+u*b+h*G,n[4]=c*m+u*M+h*E,n[7]=c*f+u*C+h*A,n[2]=d*g+p*b+v*G,n[5]=d*m+p*M+v*E,n[8]=d*f+p*C+v*A,this}multiplyScalar(t){let r=this.elements;return r[0]*=t,r[3]*=t,r[6]*=t,r[1]*=t,r[4]*=t,r[7]*=t,r[2]*=t,r[5]*=t,r[8]*=t,this}determinant(){let t=this.elements,r=t[0],i=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return r*s*u-r*o*c-i*n*u+i*o*l+a*n*c-a*s*l}invert(){let t=this.elements,r=t[0],i=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*s-o*c,d=o*l-u*n,p=c*n-s*l,v=r*h+i*d+a*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/v;return t[0]=h*g,t[1]=(a*c-u*i)*g,t[2]=(o*i-a*s)*g,t[3]=d*g,t[4]=(u*r-a*l)*g,t[5]=(a*n-o*r)*g,t[6]=p*g,t[7]=(i*l-c*r)*g,t[8]=(s*r-i*n)*g,this}transpose(){let t,r=this.elements;return t=r[1],r[1]=r[3],r[3]=t,t=r[2],r[2]=r[6],r[6]=t,t=r[5],r[5]=r[7],r[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let r=this.elements;return t[0]=r[0],t[1]=r[3],t[2]=r[6],t[3]=r[1],t[4]=r[4],t[5]=r[7],t[6]=r[2],t[7]=r[5],t[8]=r[8],this}setUvTransform(t,r,i,a,n,s,o){let l=Math.cos(n),c=Math.sin(n);return this.set(i*l,i*c,-i*(l*s+c*o)+s+t,-a*c,a*l,-a*(-c*s+l*o)+o+r,0,0,1),this}scale(t,r){return this.premultiply(Ks.makeScale(t,r)),this}rotate(t){return this.premultiply(Ks.makeRotation(-t)),this}translate(t,r){return this.premultiply(Ks.makeTranslation(t,r)),this}makeTranslation(t,r){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,r,0,0,1),this}makeRotation(t){let r=Math.cos(t),i=Math.sin(t);return this.set(r,-i,0,i,r,0,0,0,1),this}makeScale(t,r){return this.set(t,0,0,0,r,0,0,0,1),this}equals(t){let r=this.elements,i=t.elements;for(let a=0;a<9;a++)if(r[a]!==i[a])return!1;return!0}fromArray(t,r=0){for(let i=0;i<9;i++)this.elements[i]=t[i+r];return this}toArray(t=[],r=0){let i=this.elements;return t[r]=i[0],t[r+1]=i[1],t[r+2]=i[2],t[r+3]=i[3],t[r+4]=i[4],t[r+5]=i[5],t[r+6]=i[6],t[r+7]=i[7],t[r+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ks=new We;function Mh(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function es(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function pf(){let e=es("canvas");return e.style.display="block",e}var iu={};function Ha(e){e in iu||(iu[e]=!0,console.warn(e))}function ff(e,t,r){return new Promise(function(i,a){function n(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:a();break;case e.TIMEOUT_EXPIRED:setTimeout(n,r);break;default:i()}}setTimeout(n,r)})}function mf(e){let t=e.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function gf(e){let t=e.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var Ke={enabled:!0,workingColorSpace:sa,spaces:{},convert:function(e,t,r){return this.enabled===!1||t===r||!t||!r||(this.spaces[t].transfer===it&&(e.r=Dr(e.r),e.g=Dr(e.g),e.b=Dr(e.b)),this.spaces[t].primaries!==this.spaces[r].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===it&&(e.r=Qi(e.r),e.g=Qi(e.g),e.b=Qi(e.b))),e},fromWorkingColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},toWorkingColorSpace:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===vr?rs:this.spaces[e].transfer},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,r){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}};function Dr(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function Qi(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var au=[.64,.33,.3,.6,.15,.06],nu=[.2126,.7152,.0722],su=[.3127,.329],ou=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lu=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ke.define({[sa]:{primaries:au,whitePoint:su,transfer:rs,toXYZ:ou,fromXYZ:lu,luminanceCoefficients:nu,workingColorSpaceConfig:{unpackColorSpace:Mt},outputColorSpaceConfig:{drawingBufferColorSpace:Mt}},[Mt]:{primaries:au,whitePoint:su,transfer:it,toXYZ:ou,fromXYZ:lu,luminanceCoefficients:nu,outputColorSpaceConfig:{drawingBufferColorSpace:Mt}}});var Pi,vf=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Pi===void 0&&(Pi=es("canvas")),Pi.width=e.width,Pi.height=e.height;let r=Pi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=Pi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=es("canvas");t.width=e.width,t.height=e.height;let r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);let i=r.getImageData(0,0,e.width,e.height),a=i.data;for(let n=0;n<a.length;n++)a[n]=Dr(a[n]/255)*255;return r.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Dr(t[r]/255)*255):t[r]=Dr(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},_f=0,Sh=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Jr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let r={uuid:this.uuid,url:""},i=this.data;if(i!==null){let a;if(Array.isArray(i)){a=[];for(let n=0,s=i.length;n<s;n++)i[n].isDataTexture?a.push($s(i[n].image)):a.push($s(i[n]))}else a=$s(i);r.url=a}return t||(e.images[this.uuid]=r),r}};function $s(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?vf.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var xf=0,cr=class Zn extends oa{constructor(t=Zn.DEFAULT_IMAGE,r=Zn.DEFAULT_MAPPING,i=yi,a=yi,n=xr,s=Mi,o=lr,l=Ur,c=Zn.DEFAULT_ANISOTROPY,u=vr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=Jr(),this.name="",this.source=new Sh(t),this.mipmaps=[],this.mapping=r,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=n,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ve(0,0),this.repeat=new ve(1,1),this.center=new ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let r=t===void 0||typeof t=="string";if(!r&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),r||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==sh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ho:t.x=t.x-Math.floor(t.x);break;case yi:t.x=t.x<0?0:1;break;case Vo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ho:t.y=t.y-Math.floor(t.y);break;case yi:t.y=t.y<0?0:1;break;case Vo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};cr.DEFAULT_IMAGE=null;cr.DEFAULT_MAPPING=sh;cr.DEFAULT_ANISOTROPY=1;var yt=class Eh{constructor(t=0,r=0,i=0,a=1){Eh.prototype.isVector4=!0,this.x=t,this.y=r,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,r,i,a){return this.x=t,this.y=r,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,r){switch(t){case 0:this.x=r;break;case 1:this.y=r;break;case 2:this.z=r;break;case 3:this.w=r;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,r){return this.x=t.x+r.x,this.y=t.y+r.y,this.z=t.z+r.z,this.w=t.w+r.w,this}addScaledVector(t,r){return this.x+=t.x*r,this.y+=t.y*r,this.z+=t.z*r,this.w+=t.w*r,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,r){return this.x=t.x-r.x,this.y=t.y-r.y,this.z=t.z-r.z,this.w=t.w-r.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let r=this.x,i=this.y,a=this.z,n=this.w,s=t.elements;return this.x=s[0]*r+s[4]*i+s[8]*a+s[12]*n,this.y=s[1]*r+s[5]*i+s[9]*a+s[13]*n,this.z=s[2]*r+s[6]*i+s[10]*a+s[14]*n,this.w=s[3]*r+s[7]*i+s[11]*a+s[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let r=Math.sqrt(1-t.w*t.w);return r<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/r,this.y=t.y/r,this.z=t.z/r),this}setAxisAngleFromRotationMatrix(t){let r,i,a,n,s=t.elements,o=s[0],l=s[4],c=s[8],u=s[1],h=s[5],d=s[9],p=s[2],v=s[6],g=s[10];if(Math.abs(l-u)<.01&&Math.abs(c-p)<.01&&Math.abs(d-v)<.01){if(Math.abs(l+u)<.1&&Math.abs(c+p)<.1&&Math.abs(d+v)<.1&&Math.abs(o+h+g-3)<.1)return this.set(1,0,0,0),this;r=Math.PI;let f=(o+1)/2,b=(h+1)/2,M=(g+1)/2,C=(l+u)/4,G=(c+p)/4,E=(d+v)/4;return f>b&&f>M?f<.01?(i=0,a=.707106781,n=.707106781):(i=Math.sqrt(f),a=C/i,n=G/i):b>M?b<.01?(i=.707106781,a=0,n=.707106781):(a=Math.sqrt(b),i=C/a,n=E/a):M<.01?(i=.707106781,a=.707106781,n=0):(n=Math.sqrt(M),i=G/n,a=E/n),this.set(i,a,n,r),this}let m=Math.sqrt((v-d)*(v-d)+(c-p)*(c-p)+(u-l)*(u-l));return Math.abs(m)<.001&&(m=1),this.x=(v-d)/m,this.y=(c-p)/m,this.z=(u-l)/m,this.w=Math.acos((o+h+g-1)/2),this}setFromMatrixPosition(t){let r=t.elements;return this.x=r[12],this.y=r[13],this.z=r[14],this.w=r[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,r){return this.x=Math.max(t.x,Math.min(r.x,this.x)),this.y=Math.max(t.y,Math.min(r.y,this.y)),this.z=Math.max(t.z,Math.min(r.z,this.z)),this.w=Math.max(t.w,Math.min(r.w,this.w)),this}clampScalar(t,r){return this.x=Math.max(t,Math.min(r,this.x)),this.y=Math.max(t,Math.min(r,this.y)),this.z=Math.max(t,Math.min(r,this.z)),this.w=Math.max(t,Math.min(r,this.w)),this}clampLength(t,r){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(r,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,r){return this.x+=(t.x-this.x)*r,this.y+=(t.y-this.y)*r,this.z+=(t.z-this.z)*r,this.w+=(t.w-this.w)*r,this}lerpVectors(t,r,i){return this.x=t.x+(r.x-t.x)*i,this.y=t.y+(r.y-t.y)*i,this.z=t.z+(r.z-t.z)*i,this.w=t.w+(r.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,r=0){return this.x=t[r],this.y=t[r+1],this.z=t[r+2],this.w=t[r+3],this}toArray(t=[],r=0){return t[r]=this.x,t[r+1]=this.y,t[r+2]=this.z,t[r+3]=this.w,t}fromBufferAttribute(t,r){return this.x=t.getX(r),this.y=t.getY(r),this.z=t.getZ(r),this.w=t.getW(r),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},yf=class extends oa{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);let i={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xr,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);let a=new cr(i,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);a.flipY=!1,a.generateMipmaps=r.generateMipmaps,a.internalFormat=r.internalFormat,this.textures=[];let n=r.count;for(let s=0;s<n;s++)this.textures[s]=a.clone(),this.textures[s].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let i=0,a=this.textures.length;i<a;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,i=e.textures.length;r<i;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Sh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ei=class extends yf{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}},bh=class extends cr{constructor(e=null,t=1,r=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:i},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Mf=class extends cr{constructor(e=null,t=1,r=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:i},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},la=class{constructor(e=0,t=0,r=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=i}static slerpFlat(e,t,r,i,a,n,s){let o=r[i+0],l=r[i+1],c=r[i+2],u=r[i+3],h=a[n+0],d=a[n+1],p=a[n+2],v=a[n+3];if(s===0){e[t+0]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u;return}if(s===1){e[t+0]=h,e[t+1]=d,e[t+2]=p,e[t+3]=v;return}if(u!==v||o!==h||l!==d||c!==p){let g=1-s,m=o*h+l*d+c*p+u*v,f=m>=0?1:-1,b=1-m*m;if(b>Number.EPSILON){let C=Math.sqrt(b),G=Math.atan2(C,m*f);g=Math.sin(g*G)/C,s=Math.sin(s*G)/C}let M=s*f;if(o=o*g+h*M,l=l*g+d*M,c=c*g+p*M,u=u*g+v*M,g===1-s){let C=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=C,l*=C,c*=C,u*=C}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,r,i,a,n){let s=r[i],o=r[i+1],l=r[i+2],c=r[i+3],u=a[n],h=a[n+1],d=a[n+2],p=a[n+3];return e[t]=s*p+c*u+o*d-l*h,e[t+1]=o*p+c*h+l*u-s*d,e[t+2]=l*p+c*d+s*h-o*u,e[t+3]=c*p-s*u-o*h-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,i){return this._x=e,this._y=t,this._z=r,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let r=e._x,i=e._y,a=e._z,n=e._order,s=Math.cos,o=Math.sin,l=s(r/2),c=s(i/2),u=s(a/2),h=o(r/2),d=o(i/2),p=o(a/2);switch(n){case"XYZ":this._x=h*c*u+l*d*p,this._y=l*d*u-h*c*p,this._z=l*c*p+h*d*u,this._w=l*c*u-h*d*p;break;case"YXZ":this._x=h*c*u+l*d*p,this._y=l*d*u-h*c*p,this._z=l*c*p-h*d*u,this._w=l*c*u+h*d*p;break;case"ZXY":this._x=h*c*u-l*d*p,this._y=l*d*u+h*c*p,this._z=l*c*p+h*d*u,this._w=l*c*u-h*d*p;break;case"ZYX":this._x=h*c*u-l*d*p,this._y=l*d*u+h*c*p,this._z=l*c*p-h*d*u,this._w=l*c*u+h*d*p;break;case"YZX":this._x=h*c*u+l*d*p,this._y=l*d*u+h*c*p,this._z=l*c*p-h*d*u,this._w=l*c*u-h*d*p;break;case"XZY":this._x=h*c*u-l*d*p,this._y=l*d*u-h*c*p,this._z=l*c*p+h*d*u,this._w=l*c*u+h*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+n)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let r=t/2,i=Math.sin(r);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,r=t[0],i=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],c=t[6],u=t[10],h=r+s+u;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(c-o)*d,this._y=(a-l)*d,this._z=(n-i)*d}else if(r>s&&r>u){let d=2*Math.sqrt(1+r-s-u);this._w=(c-o)/d,this._x=.25*d,this._y=(i+n)/d,this._z=(a+l)/d}else if(s>u){let d=2*Math.sqrt(1+s-r-u);this._w=(a-l)/d,this._x=(i+n)/d,this._y=.25*d,this._z=(o+c)/d}else{let d=2*Math.sqrt(1+u-r-s);this._w=(n-i)/d,this._x=(a+l)/d,this._y=(o+c)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){let r=this.angleTo(e);if(r===0)return this;let i=Math.min(1,t/r);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let r=e._x,i=e._y,a=e._z,n=e._w,s=t._x,o=t._y,l=t._z,c=t._w;return this._x=r*c+n*s+i*l-a*o,this._y=i*c+n*o+a*s-r*l,this._z=a*c+n*l+r*o-i*s,this._w=n*c-r*s-i*o-a*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let r=this._x,i=this._y,a=this._z,n=this._w,s=n*e._w+r*e._x+i*e._y+a*e._z;if(s<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,s=-s):this.copy(e),s>=1)return this._w=n,this._x=r,this._y=i,this._z=a,this;let o=1-s*s;if(o<=Number.EPSILON){let d=1-t;return this._w=d*n+t*this._w,this._x=d*r+t*this._x,this._y=d*i+t*this._y,this._z=d*a+t*this._z,this.normalize(),this}let l=Math.sqrt(o),c=Math.atan2(l,s),u=Math.sin((1-t)*c)/l,h=Math.sin(t*c)/l;return this._w=n*u+this._w*h,this._x=r*u+this._x*h,this._y=i*u+this._y*h,this._z=a*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),i=Math.sqrt(1-r),a=Math.sqrt(r);return this.set(i*Math.sin(e),i*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class Th{constructor(t=0,r=0,i=0){Th.prototype.isVector3=!0,this.x=t,this.y=r,this.z=i}set(t,r,i){return i===void 0&&(i=this.z),this.x=t,this.y=r,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,r){switch(t){case 0:this.x=r;break;case 1:this.y=r;break;case 2:this.z=r;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,r){return this.x=t.x+r.x,this.y=t.y+r.y,this.z=t.z+r.z,this}addScaledVector(t,r){return this.x+=t.x*r,this.y+=t.y*r,this.z+=t.z*r,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,r){return this.x=t.x-r.x,this.y=t.y-r.y,this.z=t.z-r.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,r){return this.x=t.x*r.x,this.y=t.y*r.y,this.z=t.z*r.z,this}applyEuler(t){return this.applyQuaternion(cu.setFromEuler(t))}applyAxisAngle(t,r){return this.applyQuaternion(cu.setFromAxisAngle(t,r))}applyMatrix3(t){let r=this.x,i=this.y,a=this.z,n=t.elements;return this.x=n[0]*r+n[3]*i+n[6]*a,this.y=n[1]*r+n[4]*i+n[7]*a,this.z=n[2]*r+n[5]*i+n[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let r=this.x,i=this.y,a=this.z,n=t.elements,s=1/(n[3]*r+n[7]*i+n[11]*a+n[15]);return this.x=(n[0]*r+n[4]*i+n[8]*a+n[12])*s,this.y=(n[1]*r+n[5]*i+n[9]*a+n[13])*s,this.z=(n[2]*r+n[6]*i+n[10]*a+n[14])*s,this}applyQuaternion(t){let r=this.x,i=this.y,a=this.z,n=t.x,s=t.y,o=t.z,l=t.w,c=2*(s*a-o*i),u=2*(o*r-n*a),h=2*(n*i-s*r);return this.x=r+l*c+s*h-o*u,this.y=i+l*u+o*c-n*h,this.z=a+l*h+n*u-s*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let r=this.x,i=this.y,a=this.z,n=t.elements;return this.x=n[0]*r+n[4]*i+n[8]*a,this.y=n[1]*r+n[5]*i+n[9]*a,this.z=n[2]*r+n[6]*i+n[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,r){return this.x=Math.max(t.x,Math.min(r.x,this.x)),this.y=Math.max(t.y,Math.min(r.y,this.y)),this.z=Math.max(t.z,Math.min(r.z,this.z)),this}clampScalar(t,r){return this.x=Math.max(t,Math.min(r,this.x)),this.y=Math.max(t,Math.min(r,this.y)),this.z=Math.max(t,Math.min(r,this.z)),this}clampLength(t,r){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(r,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,r){return this.x+=(t.x-this.x)*r,this.y+=(t.y-this.y)*r,this.z+=(t.z-this.z)*r,this}lerpVectors(t,r,i){return this.x=t.x+(r.x-t.x)*i,this.y=t.y+(r.y-t.y)*i,this.z=t.z+(r.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,r){let i=t.x,a=t.y,n=t.z,s=r.x,o=r.y,l=r.z;return this.x=a*l-n*o,this.y=n*s-i*l,this.z=i*o-a*s,this}projectOnVector(t){let r=t.lengthSq();if(r===0)return this.set(0,0,0);let i=t.dot(this)/r;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Qs.copy(this).projectOnVector(t),this.sub(Qs)}reflect(t){return this.sub(Qs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let r=Math.sqrt(this.lengthSq()*t.lengthSq());if(r===0)return Math.PI/2;let i=this.dot(t)/r;return Math.acos(Ct(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let r=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return r*r+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,r,i){let a=Math.sin(r)*t;return this.x=a*Math.sin(i),this.y=Math.cos(r)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,r,i){return this.x=t*Math.sin(r),this.y=i,this.z=t*Math.cos(r),this}setFromMatrixPosition(t){let r=t.elements;return this.x=r[12],this.y=r[13],this.z=r[14],this}setFromMatrixScale(t){let r=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=r,this.y=i,this.z=a,this}setFromMatrixColumn(t,r){return this.fromArray(t.elements,r*4)}setFromMatrix3Column(t,r){return this.fromArray(t.elements,r*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,r=0){return this.x=t[r],this.y=t[r+1],this.z=t[r+2],this}toArray(t=[],r=0){return t[r]=this.x,t[r+1]=this.y,t[r+2]=this.z,t}fromBufferAttribute(t,r){return this.x=t.getX(r),this.y=t.getY(r),this.z=t.getZ(r),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,r=Math.random()*2-1,i=Math.sqrt(1-r*r);return this.x=i*Math.cos(t),this.y=r,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Qs=new N,cu=new la,qa=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(ar.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(ar.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let r=ar.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let r=e.geometry;if(r!==void 0){let a=r.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let n=0,s=a.count;n<s;n++)e.isMesh===!0?e.getVertexPosition(n,ar):ar.fromBufferAttribute(a,n),ar.applyMatrix4(e.matrixWorld),this.expandByPoint(ar);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xn.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),xn.copy(r.boundingBox)),xn.applyMatrix4(e.matrixWorld),this.union(xn)}let i=e.children;for(let a=0,n=i.length;a<n;a++)this.expandByObject(i[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ar),ar.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Na),yn.subVectors(this.max,Na),Li.subVectors(e.a,Na),Di.subVectors(e.b,Na),Ui.subVectors(e.c,Na),Vr.subVectors(Di,Li),Gr.subVectors(Ui,Di),ui.subVectors(Li,Ui);let t=[0,-Vr.z,Vr.y,0,-Gr.z,Gr.y,0,-ui.z,ui.y,Vr.z,0,-Vr.x,Gr.z,0,-Gr.x,ui.z,0,-ui.x,-Vr.y,Vr.x,0,-Gr.y,Gr.x,0,-ui.y,ui.x,0];return!eo(t,Li,Di,Ui,yn)||(t=[1,0,0,0,1,0,0,0,1],!eo(t,Li,Di,Ui,yn))?!1:(Mn.crossVectors(Vr,Gr),t=[Mn.x,Mn.y,Mn.z],eo(t,Li,Di,Ui,yn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ar).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ar).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Er[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Er[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Er[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Er[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Er[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Er[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Er[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Er[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Er),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Er=[new N,new N,new N,new N,new N,new N,new N,new N],ar=new N,xn=new qa,Li=new N,Di=new N,Ui=new N,Vr=new N,Gr=new N,ui=new N,Na=new N,yn=new N,Mn=new N,hi=new N;function eo(e,t,r,i,a){for(let n=0,s=e.length-3;n<=s;n+=3){hi.fromArray(e,n);let o=a.x*Math.abs(hi.x)+a.y*Math.abs(hi.y)+a.z*Math.abs(hi.z),l=t.dot(hi),c=r.dot(hi),u=i.dot(hi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Sf=new qa,Ia=new N,to=new N,Cl=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let r=this.center;t!==void 0?r.copy(t):Sf.setFromPoints(e).getCenter(r);let i=0;for(let a=0,n=e.length;a<n;a++)i=Math.max(i,r.distanceToSquared(e[a]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ia.subVectors(e,this.center);let t=Ia.lengthSq();if(t>this.radius*this.radius){let r=Math.sqrt(t),i=(r-this.radius)*.5;this.center.addScaledVector(Ia,i/r),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(to.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ia.copy(e.center).add(to)),this.expandByPoint(Ia.copy(e.center).sub(to))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},br=new N,ro=new N,Sn=new N,Wr=new N,io=new N,En=new N,ao=new N,wh=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,br)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=br.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(br.copy(this.origin).addScaledVector(this.direction,t),br.distanceToSquared(e))}distanceSqToSegment(e,t,r,i){ro.copy(e).add(t).multiplyScalar(.5),Sn.copy(t).sub(e).normalize(),Wr.copy(this.origin).sub(ro);let a=e.distanceTo(t)*.5,n=-this.direction.dot(Sn),s=Wr.dot(this.direction),o=-Wr.dot(Sn),l=Wr.lengthSq(),c=Math.abs(1-n*n),u,h,d,p;if(c>0)if(u=n*o-s,h=n*s-o,p=a*c,u>=0)if(h>=-p)if(h<=p){let v=1/c;u*=v,h*=v,d=u*(u+n*h+2*s)+h*(n*u+h+2*o)+l}else h=a,u=Math.max(0,-(n*h+s)),d=-u*u+h*(h+2*o)+l;else h=-a,u=Math.max(0,-(n*h+s)),d=-u*u+h*(h+2*o)+l;else h<=-p?(u=Math.max(0,-(-n*a+s)),h=u>0?-a:Math.min(Math.max(-a,-o),a),d=-u*u+h*(h+2*o)+l):h<=p?(u=0,h=Math.min(Math.max(-a,-o),a),d=h*(h+2*o)+l):(u=Math.max(0,-(n*a+s)),h=u>0?a:Math.min(Math.max(-a,-o),a),d=-u*u+h*(h+2*o)+l);else h=n>0?-a:a,u=Math.max(0,-(n*h+s)),d=-u*u+h*(h+2*o)+l;return r&&r.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ro).addScaledVector(Sn,h),d}intersectSphere(e,t){br.subVectors(e.center,this.origin);let r=br.dot(this.direction),i=br.dot(br)-r*r,a=e.radius*e.radius;if(i>a)return null;let n=Math.sqrt(a-i),s=r-n,o=r+n;return o<0?null:s<0?this.at(o,t):this.at(s,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){let r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,i,a,n,s,o,l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(r=(e.min.x-h.x)*l,i=(e.max.x-h.x)*l):(r=(e.max.x-h.x)*l,i=(e.min.x-h.x)*l),c>=0?(a=(e.min.y-h.y)*c,n=(e.max.y-h.y)*c):(a=(e.max.y-h.y)*c,n=(e.min.y-h.y)*c),r>n||a>i||((a>r||isNaN(r))&&(r=a),(n<i||isNaN(i))&&(i=n),u>=0?(s=(e.min.z-h.z)*u,o=(e.max.z-h.z)*u):(s=(e.max.z-h.z)*u,o=(e.min.z-h.z)*u),r>o||s>i)||((s>r||r!==r)&&(r=s),(o<i||i!==i)&&(i=o),i<0)?null:this.at(r>=0?r:i,t)}intersectsBox(e){return this.intersectBox(e,br)!==null}intersectTriangle(e,t,r,i,a){io.subVectors(t,e),En.subVectors(r,e),ao.crossVectors(io,En);let n=this.direction.dot(ao),s;if(n>0){if(i)return null;s=1}else if(n<0)s=-1,n=-n;else return null;Wr.subVectors(this.origin,e);let o=s*this.direction.dot(En.crossVectors(Wr,En));if(o<0)return null;let l=s*this.direction.dot(io.cross(Wr));if(l<0||o+l>n)return null;let c=-s*Wr.dot(ao);return c<0?null:this.at(c/n,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},lt=class _l{constructor(t,r,i,a,n,s,o,l,c,u,h,d,p,v,g,m){_l.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,r,i,a,n,s,o,l,c,u,h,d,p,v,g,m)}set(t,r,i,a,n,s,o,l,c,u,h,d,p,v,g,m){let f=this.elements;return f[0]=t,f[4]=r,f[8]=i,f[12]=a,f[1]=n,f[5]=s,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=v,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _l().fromArray(this.elements)}copy(t){let r=this.elements,i=t.elements;return r[0]=i[0],r[1]=i[1],r[2]=i[2],r[3]=i[3],r[4]=i[4],r[5]=i[5],r[6]=i[6],r[7]=i[7],r[8]=i[8],r[9]=i[9],r[10]=i[10],r[11]=i[11],r[12]=i[12],r[13]=i[13],r[14]=i[14],r[15]=i[15],this}copyPosition(t){let r=this.elements,i=t.elements;return r[12]=i[12],r[13]=i[13],r[14]=i[14],this}setFromMatrix3(t){let r=t.elements;return this.set(r[0],r[3],r[6],0,r[1],r[4],r[7],0,r[2],r[5],r[8],0,0,0,0,1),this}extractBasis(t,r,i){return t.setFromMatrixColumn(this,0),r.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,r,i){return this.set(t.x,r.x,i.x,0,t.y,r.y,i.y,0,t.z,r.z,i.z,0,0,0,0,1),this}extractRotation(t){let r=this.elements,i=t.elements,a=1/Ni.setFromMatrixColumn(t,0).length(),n=1/Ni.setFromMatrixColumn(t,1).length(),s=1/Ni.setFromMatrixColumn(t,2).length();return r[0]=i[0]*a,r[1]=i[1]*a,r[2]=i[2]*a,r[3]=0,r[4]=i[4]*n,r[5]=i[5]*n,r[6]=i[6]*n,r[7]=0,r[8]=i[8]*s,r[9]=i[9]*s,r[10]=i[10]*s,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,this}makeRotationFromEuler(t){let r=this.elements,i=t.x,a=t.y,n=t.z,s=Math.cos(i),o=Math.sin(i),l=Math.cos(a),c=Math.sin(a),u=Math.cos(n),h=Math.sin(n);if(t.order==="XYZ"){let d=s*u,p=s*h,v=o*u,g=o*h;r[0]=l*u,r[4]=-l*h,r[8]=c,r[1]=p+v*c,r[5]=d-g*c,r[9]=-o*l,r[2]=g-d*c,r[6]=v+p*c,r[10]=s*l}else if(t.order==="YXZ"){let d=l*u,p=l*h,v=c*u,g=c*h;r[0]=d+g*o,r[4]=v*o-p,r[8]=s*c,r[1]=s*h,r[5]=s*u,r[9]=-o,r[2]=p*o-v,r[6]=g+d*o,r[10]=s*l}else if(t.order==="ZXY"){let d=l*u,p=l*h,v=c*u,g=c*h;r[0]=d-g*o,r[4]=-s*h,r[8]=v+p*o,r[1]=p+v*o,r[5]=s*u,r[9]=g-d*o,r[2]=-s*c,r[6]=o,r[10]=s*l}else if(t.order==="ZYX"){let d=s*u,p=s*h,v=o*u,g=o*h;r[0]=l*u,r[4]=v*c-p,r[8]=d*c+g,r[1]=l*h,r[5]=g*c+d,r[9]=p*c-v,r[2]=-c,r[6]=o*l,r[10]=s*l}else if(t.order==="YZX"){let d=s*l,p=s*c,v=o*l,g=o*c;r[0]=l*u,r[4]=g-d*h,r[8]=v*h+p,r[1]=h,r[5]=s*u,r[9]=-o*u,r[2]=-c*u,r[6]=p*h+v,r[10]=d-g*h}else if(t.order==="XZY"){let d=s*l,p=s*c,v=o*l,g=o*c;r[0]=l*u,r[4]=-h,r[8]=c*u,r[1]=d*h+g,r[5]=s*u,r[9]=p*h-v,r[2]=v*h-p,r[6]=o*u,r[10]=g*h+d}return r[3]=0,r[7]=0,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ef,t,bf)}lookAt(t,r,i){let a=this.elements;return Zt.subVectors(t,r),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),Xr.crossVectors(i,Zt),Xr.lengthSq()===0&&(Math.abs(i.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),Xr.crossVectors(i,Zt)),Xr.normalize(),bn.crossVectors(Zt,Xr),a[0]=Xr.x,a[4]=bn.x,a[8]=Zt.x,a[1]=Xr.y,a[5]=bn.y,a[9]=Zt.y,a[2]=Xr.z,a[6]=bn.z,a[10]=Zt.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,r){let i=t.elements,a=r.elements,n=this.elements,s=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],v=i[2],g=i[6],m=i[10],f=i[14],b=i[3],M=i[7],C=i[11],G=i[15],E=a[0],A=a[4],k=a[8],y=a[12],S=a[1],U=a[5],H=a[9],q=a[13],Y=a[2],re=a[6],Q=a[10],oe=a[14],ee=a[3],ue=a[7],_e=a[11],Be=a[15];return n[0]=s*E+o*S+l*Y+c*ee,n[4]=s*A+o*U+l*re+c*ue,n[8]=s*k+o*H+l*Q+c*_e,n[12]=s*y+o*q+l*oe+c*Be,n[1]=u*E+h*S+d*Y+p*ee,n[5]=u*A+h*U+d*re+p*ue,n[9]=u*k+h*H+d*Q+p*_e,n[13]=u*y+h*q+d*oe+p*Be,n[2]=v*E+g*S+m*Y+f*ee,n[6]=v*A+g*U+m*re+f*ue,n[10]=v*k+g*H+m*Q+f*_e,n[14]=v*y+g*q+m*oe+f*Be,n[3]=b*E+M*S+C*Y+G*ee,n[7]=b*A+M*U+C*re+G*ue,n[11]=b*k+M*H+C*Q+G*_e,n[15]=b*y+M*q+C*oe+G*Be,this}multiplyScalar(t){let r=this.elements;return r[0]*=t,r[4]*=t,r[8]*=t,r[12]*=t,r[1]*=t,r[5]*=t,r[9]*=t,r[13]*=t,r[2]*=t,r[6]*=t,r[10]*=t,r[14]*=t,r[3]*=t,r[7]*=t,r[11]*=t,r[15]*=t,this}determinant(){let t=this.elements,r=t[0],i=t[4],a=t[8],n=t[12],s=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],p=t[14],v=t[3],g=t[7],m=t[11],f=t[15];return v*(+n*l*h-a*c*h-n*o*d+i*c*d+a*o*p-i*l*p)+g*(+r*l*p-r*c*d+n*s*d-a*s*p+a*c*u-n*l*u)+m*(+r*c*h-r*o*p-n*s*h+i*s*p+n*o*u-i*c*u)+f*(-a*o*u-r*l*h+r*o*d+a*s*h-i*s*d+i*l*u)}transpose(){let t=this.elements,r;return r=t[1],t[1]=t[4],t[4]=r,r=t[2],t[2]=t[8],t[8]=r,r=t[6],t[6]=t[9],t[9]=r,r=t[3],t[3]=t[12],t[12]=r,r=t[7],t[7]=t[13],t[13]=r,r=t[11],t[11]=t[14],t[14]=r,this}setPosition(t,r,i){let a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=r,a[14]=i),this}invert(){let t=this.elements,r=t[0],i=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],p=t[11],v=t[12],g=t[13],m=t[14],f=t[15],b=h*m*c-g*d*c+g*l*p-o*m*p-h*l*f+o*d*f,M=v*d*c-u*m*c-v*l*p+s*m*p+u*l*f-s*d*f,C=u*g*c-v*h*c+v*o*p-s*g*p-u*o*f+s*h*f,G=v*h*l-u*g*l-v*o*d+s*g*d+u*o*m-s*h*m,E=r*b+i*M+a*C+n*G;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/E;return t[0]=b*A,t[1]=(g*d*n-h*m*n-g*a*p+i*m*p+h*a*f-i*d*f)*A,t[2]=(o*m*n-g*l*n+g*a*c-i*m*c-o*a*f+i*l*f)*A,t[3]=(h*l*n-o*d*n-h*a*c+i*d*c+o*a*p-i*l*p)*A,t[4]=M*A,t[5]=(u*m*n-v*d*n+v*a*p-r*m*p-u*a*f+r*d*f)*A,t[6]=(v*l*n-s*m*n-v*a*c+r*m*c+s*a*f-r*l*f)*A,t[7]=(s*d*n-u*l*n+u*a*c-r*d*c-s*a*p+r*l*p)*A,t[8]=C*A,t[9]=(v*h*n-u*g*n-v*i*p+r*g*p+u*i*f-r*h*f)*A,t[10]=(s*g*n-v*o*n+v*i*c-r*g*c-s*i*f+r*o*f)*A,t[11]=(u*o*n-s*h*n-u*i*c+r*h*c+s*i*p-r*o*p)*A,t[12]=G*A,t[13]=(u*g*a-v*h*a+v*i*d-r*g*d-u*i*m+r*h*m)*A,t[14]=(v*o*a-s*g*a-v*i*l+r*g*l+s*i*m-r*o*m)*A,t[15]=(s*h*a-u*o*a+u*i*l-r*h*l-s*i*d+r*o*d)*A,this}scale(t){let r=this.elements,i=t.x,a=t.y,n=t.z;return r[0]*=i,r[4]*=a,r[8]*=n,r[1]*=i,r[5]*=a,r[9]*=n,r[2]*=i,r[6]*=a,r[10]*=n,r[3]*=i,r[7]*=a,r[11]*=n,this}getMaxScaleOnAxis(){let t=this.elements,r=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(r,i,a))}makeTranslation(t,r,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,r,0,0,1,i,0,0,0,1),this}makeRotationX(t){let r=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,r,-i,0,0,i,r,0,0,0,0,1),this}makeRotationY(t){let r=Math.cos(t),i=Math.sin(t);return this.set(r,0,i,0,0,1,0,0,-i,0,r,0,0,0,0,1),this}makeRotationZ(t){let r=Math.cos(t),i=Math.sin(t);return this.set(r,-i,0,0,i,r,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,r){let i=Math.cos(r),a=Math.sin(r),n=1-i,s=t.x,o=t.y,l=t.z,c=n*s,u=n*o;return this.set(c*s+i,c*o-a*l,c*l+a*o,0,c*o+a*l,u*o+i,u*l-a*s,0,c*l-a*o,u*l+a*s,n*l*l+i,0,0,0,0,1),this}makeScale(t,r,i){return this.set(t,0,0,0,0,r,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,r,i,a,n,s){return this.set(1,i,n,0,t,1,s,0,r,a,1,0,0,0,0,1),this}compose(t,r,i){let a=this.elements,n=r._x,s=r._y,o=r._z,l=r._w,c=n+n,u=s+s,h=o+o,d=n*c,p=n*u,v=n*h,g=s*u,m=s*h,f=o*h,b=l*c,M=l*u,C=l*h,G=i.x,E=i.y,A=i.z;return a[0]=(1-(g+f))*G,a[1]=(p+C)*G,a[2]=(v-M)*G,a[3]=0,a[4]=(p-C)*E,a[5]=(1-(d+f))*E,a[6]=(m+b)*E,a[7]=0,a[8]=(v+M)*A,a[9]=(m-b)*A,a[10]=(1-(d+g))*A,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,r,i){let a=this.elements,n=Ni.set(a[0],a[1],a[2]).length(),s=Ni.set(a[4],a[5],a[6]).length(),o=Ni.set(a[8],a[9],a[10]).length();this.determinant()<0&&(n=-n),t.x=a[12],t.y=a[13],t.z=a[14],nr.copy(this);let l=1/n,c=1/s,u=1/o;return nr.elements[0]*=l,nr.elements[1]*=l,nr.elements[2]*=l,nr.elements[4]*=c,nr.elements[5]*=c,nr.elements[6]*=c,nr.elements[8]*=u,nr.elements[9]*=u,nr.elements[10]*=u,r.setFromRotationMatrix(nr),i.x=n,i.y=s,i.z=o,this}makePerspective(t,r,i,a,n,s,o=Lr){let l=this.elements,c=2*n/(r-t),u=2*n/(i-a),h=(r+t)/(r-t),d=(i+a)/(i-a),p,v;if(o===Lr)p=-(s+n)/(s-n),v=-2*s*n/(s-n);else if(o===Qn)p=-s/(s-n),v=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,r,i,a,n,s,o=Lr){let l=this.elements,c=1/(r-t),u=1/(i-a),h=1/(s-n),d=(r+t)*c,p=(i+a)*u,v,g;if(o===Lr)v=(s+n)*h,g=-2*h;else if(o===Qn)v=n*h,g=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let r=this.elements,i=t.elements;for(let a=0;a<16;a++)if(r[a]!==i[a])return!1;return!0}fromArray(t,r=0){for(let i=0;i<16;i++)this.elements[i]=t[i+r];return this}toArray(t=[],r=0){let i=this.elements;return t[r]=i[0],t[r+1]=i[1],t[r+2]=i[2],t[r+3]=i[3],t[r+4]=i[4],t[r+5]=i[5],t[r+6]=i[6],t[r+7]=i[7],t[r+8]=i[8],t[r+9]=i[9],t[r+10]=i[10],t[r+11]=i[11],t[r+12]=i[12],t[r+13]=i[13],t[r+14]=i[14],t[r+15]=i[15],t}},Ni=new N,nr=new lt,Ef=new N(0,0,0),bf=new N(1,1,1),Xr=new N,bn=new N,Zt=new N,uu=new lt,hu=new la,bi=class Ah{constructor(t=0,r=0,i=0,a=Ah.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=r,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,r,i,a=this._order){return this._x=t,this._y=r,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,r=this._order,i=!0){let a=t.elements,n=a[0],s=a[4],o=a[8],l=a[1],c=a[5],u=a[9],h=a[2],d=a[6],p=a[10];switch(r){case"XYZ":this._y=Math.asin(Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,n),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,n)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ct(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+r)}return this._order=r,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,r,i){return uu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(uu,r,i)}setFromVector3(t,r=this._order){return this.set(t.x,t.y,t.z,r)}reorder(t){return hu.setFromEuler(this),this.setFromQuaternion(hu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],r=0){return t[r]=this._x,t[r+1]=this._y,t[r+2]=this._z,t[r+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};bi.DEFAULT_ORDER="XYZ";var Rl=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Tf=0,du=new N,Ii=new la,Tr=new lt,Tn=new N,Oa=new N,wf=new N,Af=new la,pu=new N(1,0,0),fu=new N(0,1,0),mu=new N(0,0,1),gu={type:"added"},Cf={type:"removed"},Oi={type:"childadded",child:null},no={type:"childremoved",child:null},Xt=class Jn extends oa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=Jr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Jn.DEFAULT_UP.clone();let t=new N,r=new bi,i=new la,a=new N(1,1,1);function n(){i.setFromEuler(r,!1)}function s(){r.setFromQuaternion(i,void 0,!1)}r._onChange(n),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:r},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new lt},normalMatrix:{value:new We}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=Jn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Jn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,r){this.quaternion.setFromAxisAngle(t,r)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,r){return Ii.setFromAxisAngle(t,r),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(t,r){return Ii.setFromAxisAngle(t,r),this.quaternion.premultiply(Ii),this}rotateX(t){return this.rotateOnAxis(pu,t)}rotateY(t){return this.rotateOnAxis(fu,t)}rotateZ(t){return this.rotateOnAxis(mu,t)}translateOnAxis(t,r){return du.copy(t).applyQuaternion(this.quaternion),this.position.add(du.multiplyScalar(r)),this}translateX(t){return this.translateOnAxis(pu,t)}translateY(t){return this.translateOnAxis(fu,t)}translateZ(t){return this.translateOnAxis(mu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tr.copy(this.matrixWorld).invert())}lookAt(t,r,i){t.isVector3?Tn.copy(t):Tn.set(t,r,i);let a=this.parent;this.updateWorldMatrix(!0,!1),Oa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tr.lookAt(Oa,Tn,this.up):Tr.lookAt(Tn,Oa,this.up),this.quaternion.setFromRotationMatrix(Tr),a&&(Tr.extractRotation(a.matrixWorld),Ii.setFromRotationMatrix(Tr),this.quaternion.premultiply(Ii.invert()))}add(t){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.add(arguments[r]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gu),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let r=this.children.indexOf(t);return r!==-1&&(t.parent=null,this.children.splice(r,1),t.dispatchEvent(Cf),no.child=t,this.dispatchEvent(no),no.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tr.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tr),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gu),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,r){if(this[t]===r)return this;for(let i=0,a=this.children.length;i<a;i++){let n=this.children[i].getObjectByProperty(t,r);if(n!==void 0)return n}}getObjectsByProperty(t,r,i=[]){this[t]===r&&i.push(this);let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].getObjectsByProperty(t,r,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Oa,t,wf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Oa,Af,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let r=this.matrixWorld.elements;return t.set(r[8],r[9],r[10]).normalize()}raycast(){}traverse(t){t(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].traverseVisible(t)}traverseAncestors(t){let r=this.parent;r!==null&&(t(r),r.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].updateMatrixWorld(t)}updateWorldMatrix(t,r){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),r===!0){let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].updateWorldMatrix(!1,!0)}}toJSON(t){let r=t===void 0||typeof t=="string",i={};r&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];n(t.shapes,h)}else n(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(n(t.materials,this.material[l]));a.material=o}else a.material=n(t.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];a.animations.push(n(t.animations,l))}}if(r){let o=s(t.geometries),l=s(t.materials),c=s(t.textures),u=s(t.images),h=s(t.shapes),d=s(t.skeletons),p=s(t.animations),v=s(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=a,i;function s(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,r=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),r===!0)for(let i=0;i<t.children.length;i++){let a=t.children[i];this.add(a.clone())}return this}};Xt.DEFAULT_UP=new N(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var sr=new N,wr=new N,so=new N,Ar=new N,Fi=new N,zi=new N,vu=new N,oo=new N,lo=new N,co=new N,uo=new yt,ho=new yt,po=new yt,qi=class Yi{constructor(t=new N,r=new N,i=new N){this.a=t,this.b=r,this.c=i}static getNormal(t,r,i,a){a.subVectors(i,r),sr.subVectors(t,r),a.cross(sr);let n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(t,r,i,a,n){sr.subVectors(a,r),wr.subVectors(i,r),so.subVectors(t,r);let s=sr.dot(sr),o=sr.dot(wr),l=sr.dot(so),c=wr.dot(wr),u=wr.dot(so),h=s*c-o*o;if(h===0)return n.set(0,0,0),null;let d=1/h,p=(c*l-o*u)*d,v=(s*u-o*l)*d;return n.set(1-p-v,v,p)}static containsPoint(t,r,i,a){return this.getBarycoord(t,r,i,a,Ar)===null?!1:Ar.x>=0&&Ar.y>=0&&Ar.x+Ar.y<=1}static getInterpolation(t,r,i,a,n,s,o,l){return this.getBarycoord(t,r,i,a,Ar)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Ar.x),l.addScaledVector(s,Ar.y),l.addScaledVector(o,Ar.z),l)}static getInterpolatedAttribute(t,r,i,a,n,s){return uo.setScalar(0),ho.setScalar(0),po.setScalar(0),uo.fromBufferAttribute(t,r),ho.fromBufferAttribute(t,i),po.fromBufferAttribute(t,a),s.setScalar(0),s.addScaledVector(uo,n.x),s.addScaledVector(ho,n.y),s.addScaledVector(po,n.z),s}static isFrontFacing(t,r,i,a){return sr.subVectors(i,r),wr.subVectors(t,r),sr.cross(wr).dot(a)<0}set(t,r,i){return this.a.copy(t),this.b.copy(r),this.c.copy(i),this}setFromPointsAndIndices(t,r,i,a){return this.a.copy(t[r]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,r,i,a){return this.a.fromBufferAttribute(t,r),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return sr.subVectors(this.c,this.b),wr.subVectors(this.a,this.b),sr.cross(wr).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Yi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,r){return Yi.getBarycoord(t,this.a,this.b,this.c,r)}getInterpolation(t,r,i,a,n){return Yi.getInterpolation(t,this.a,this.b,this.c,r,i,a,n)}containsPoint(t){return Yi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Yi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,r){let i=this.a,a=this.b,n=this.c,s,o;Fi.subVectors(a,i),zi.subVectors(n,i),oo.subVectors(t,i);let l=Fi.dot(oo),c=zi.dot(oo);if(l<=0&&c<=0)return r.copy(i);lo.subVectors(t,a);let u=Fi.dot(lo),h=zi.dot(lo);if(u>=0&&h<=u)return r.copy(a);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return s=l/(l-u),r.copy(i).addScaledVector(Fi,s);co.subVectors(t,n);let p=Fi.dot(co),v=zi.dot(co);if(v>=0&&p<=v)return r.copy(n);let g=p*c-l*v;if(g<=0&&c>=0&&v<=0)return o=c/(c-v),r.copy(i).addScaledVector(zi,o);let m=u*v-p*h;if(m<=0&&h-u>=0&&p-v>=0)return vu.subVectors(n,a),o=(h-u)/(h-u+(p-v)),r.copy(a).addScaledVector(vu,o);let f=1/(m+g+d);return s=g*f,o=d*f,r.copy(i).addScaledVector(Fi,s).addScaledVector(zi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jr={h:0,s:0,l:0},wn={h:0,s:0,l:0};function fo(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+(t-e)*6*r:r<1/2?t:r<2/3?e+(t-e)*6*(2/3-r):e}var je=class{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.toWorkingColorSpace(this,t),this}setRGB(e,t,r,i=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=r,Ke.toWorkingColorSpace(this,i),this}setHSL(e,t,r,i=Ke.workingColorSpace){if(e=df(e,1),t=Ct(t,0,1),r=Ct(r,0,1),t===0)this.r=this.g=this.b=r;else{let a=r<=.5?r*(1+t):r+t-r*t,n=2*r-a;this.r=fo(n,a,e+1/3),this.g=fo(n,a,e),this.b=fo(n,a,e-1/3)}return Ke.toWorkingColorSpace(this,i),this}setStyle(e,t=Mt){function r(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,n=i[1],s=i[2];switch(n){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let a=i[1],n=a.length;if(n===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(n===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){let r=Ch[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Dr(e.r),this.g=Dr(e.g),this.b=Dr(e.b),this}copyLinearToSRGB(e){return this.r=Qi(e.r),this.g=Qi(e.g),this.b=Qi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return Ke.fromWorkingColorSpace(Dt.copy(this),e),Math.round(Ct(Dt.r*255,0,255))*65536+Math.round(Ct(Dt.g*255,0,255))*256+Math.round(Ct(Dt.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.fromWorkingColorSpace(Dt.copy(this),t);let r=Dt.r,i=Dt.g,a=Dt.b,n=Math.max(r,i,a),s=Math.min(r,i,a),o,l,c=(s+n)/2;if(s===n)o=0,l=0;else{let u=n-s;switch(l=c<=.5?u/(n+s):u/(2-n-s),n){case r:o=(i-a)/u+(i<a?6:0);break;case i:o=(a-r)/u+2;break;case a:o=(r-i)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=Ke.workingColorSpace){return Ke.fromWorkingColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=Mt){Ke.fromWorkingColorSpace(Dt.copy(this),e);let t=Dt.r,r=Dt.g,i=Dt.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(i*255)})`}offsetHSL(e,t,r){return this.getHSL(jr),this.setHSL(jr.h+e,jr.s+t,jr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(jr),e.getHSL(wn);let r=Js(jr.h,wn.h,t),i=Js(jr.s,wn.s,t),a=Js(jr.l,wn.l,t);return this.setHSL(r,i,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,r=this.g,i=this.b,a=e.elements;return this.r=a[0]*t+a[3]*r+a[6]*i,this.g=a[1]*t+a[4]*r+a[7]*i,this.b=a[2]*t+a[5]*r+a[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Dt=new je;je.NAMES=Ch;var Rf=0,ca=class extends oa{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rf++}),this.uuid=Jr(),this.name="",this.blending=Ki,this.side=Kr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Po,this.blendDst=Lo,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=ea,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(r):i&&i.isVector3&&r&&r.isVector3?i.copy(r):this[t]=r}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(r.blending=this.blending),this.side!==Kr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Po&&(r.blendSrc=this.blendSrc),this.blendDst!==Lo&&(r.blendDst=this.blendDst),this.blendEquation!==_i&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==ea&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tu&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function i(a){let n=[];for(let s in a){let o=a[s];delete o.metadata,n.push(o)}return n}if(t){let a=i(e.textures),n=i(e.images);a.length>0&&(r.textures=a),n.length>0&&(r.images=n)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,r=null;if(t!==null){let i=t.length;r=new Array(i);for(let a=0;a!==i;++a)r[a]=t[a].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},zt=class extends ca{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=nh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},xt=new N,An=new ve,Rt=class{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=gl,this.updateRanges=[],this.gpuType=Pr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let i=0,a=this.itemSize;i<a;i++)this.array[e+i]=t.array[r+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)An.fromBufferAttribute(this,t),An.applyMatrix3(e),this.setXY(t,An.x,An.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix3(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix4(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.applyNormalMatrix(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.transformDirection(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=_r(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=at(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_r(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_r(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_r(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),r=at(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,i){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),r=at(r,this.array),i=at(i,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=i,this}setXYZW(e,t,r,i,a){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),r=at(r,this.array),i=at(i,this.array),a=at(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=i,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gl&&(e.usage=this.usage),e}},Rh=class extends Rt{constructor(e,t,r){super(new Uint16Array(e),t,r)}},Ph=class extends Rt{constructor(e,t,r){super(new Uint32Array(e),t,r)}},gt=class extends Rt{constructor(e,t,r){super(new Float32Array(e),t,r)}},Pf=0,Qt=new lt,mo=new Xt,ki=new N,Jt=new qa,Fa=new qa,wt=new N,Kt=class Lh extends oa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=Jr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Mh(t)?Ph:Rh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,r){return this.attributes[t]=r,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,r,i=0){this.groups.push({start:t,count:r,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,r){this.drawRange.start=t,this.drawRange.count=r}applyMatrix4(t){let r=this.attributes.position;r!==void 0&&(r.applyMatrix4(t),r.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let n=new We().getNormalMatrix(t);i.applyNormalMatrix(n),i.needsUpdate=!0}let a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Qt.makeRotationFromQuaternion(t),this.applyMatrix4(Qt),this}rotateX(t){return Qt.makeRotationX(t),this.applyMatrix4(Qt),this}rotateY(t){return Qt.makeRotationY(t),this.applyMatrix4(Qt),this}rotateZ(t){return Qt.makeRotationZ(t),this.applyMatrix4(Qt),this}translate(t,r,i){return Qt.makeTranslation(t,r,i),this.applyMatrix4(Qt),this}scale(t,r,i){return Qt.makeScale(t,r,i),this.applyMatrix4(Qt),this}lookAt(t){return mo.lookAt(t),mo.updateMatrix(),this.applyMatrix4(mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){let r=this.getAttribute("position");if(r===void 0){let i=[];for(let a=0,n=t.length;a<n;a++){let s=t[a];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new gt(i,3))}else{for(let i=0,a=r.count;i<a;i++){let n=t[i];r.setXYZ(i,n.x,n.y,n.z||0)}t.length>r.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),r.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qa);let t=this.attributes.position,r=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),r)for(let i=0,a=r.length;i<a;i++){let n=r[i];Jt.setFromBufferAttribute(n),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Jt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Jt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Jt.min),this.boundingBox.expandByPoint(Jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cl);let t=this.attributes.position,r=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){let i=this.boundingSphere.center;if(Jt.setFromBufferAttribute(t),r)for(let n=0,s=r.length;n<s;n++){let o=r[n];Fa.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Jt.min,Fa.min),Jt.expandByPoint(wt),wt.addVectors(Jt.max,Fa.max),Jt.expandByPoint(wt)):(Jt.expandByPoint(Fa.min),Jt.expandByPoint(Fa.max))}Jt.getCenter(i);let a=0;for(let n=0,s=t.count;n<s;n++)wt.fromBufferAttribute(t,n),a=Math.max(a,i.distanceToSquared(wt));if(r)for(let n=0,s=r.length;n<s;n++){let o=r[n],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)wt.fromBufferAttribute(o,c),l&&(ki.fromBufferAttribute(t,c),wt.add(ki)),a=Math.max(a,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,r=this.attributes;if(t===null||r.position===void 0||r.normal===void 0||r.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=r.position,a=r.normal,n=r.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Rt(new Float32Array(4*i.count),4));let s=this.getAttribute("tangent"),o=[],l=[];for(let k=0;k<i.count;k++)o[k]=new N,l[k]=new N;let c=new N,u=new N,h=new N,d=new ve,p=new ve,v=new ve,g=new N,m=new N;function f(k,y,S){c.fromBufferAttribute(i,k),u.fromBufferAttribute(i,y),h.fromBufferAttribute(i,S),d.fromBufferAttribute(n,k),p.fromBufferAttribute(n,y),v.fromBufferAttribute(n,S),u.sub(c),h.sub(c),p.sub(d),v.sub(d);let U=1/(p.x*v.y-v.x*p.y);isFinite(U)&&(g.copy(u).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(U),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(U),o[k].add(g),o[y].add(g),o[S].add(g),l[k].add(m),l[y].add(m),l[S].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let k=0,y=b.length;k<y;++k){let S=b[k],U=S.start,H=S.count;for(let q=U,Y=U+H;q<Y;q+=3)f(t.getX(q+0),t.getX(q+1),t.getX(q+2))}let M=new N,C=new N,G=new N,E=new N;function A(k){G.fromBufferAttribute(a,k),E.copy(G);let y=o[k];M.copy(y),M.sub(G.multiplyScalar(G.dot(y))).normalize(),C.crossVectors(E,y);let S=C.dot(l[k])<0?-1:1;s.setXYZW(k,M.x,M.y,M.z,S)}for(let k=0,y=b.length;k<y;++k){let S=b[k],U=S.start,H=S.count;for(let q=U,Y=U+H;q<Y;q+=3)A(t.getX(q+0)),A(t.getX(q+1)),A(t.getX(q+2))}}computeVertexNormals(){let t=this.index,r=this.getAttribute("position");if(r!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Rt(new Float32Array(r.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let a=new N,n=new N,s=new N,o=new N,l=new N,c=new N,u=new N,h=new N;if(t)for(let d=0,p=t.count;d<p;d+=3){let v=t.getX(d+0),g=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(r,v),n.fromBufferAttribute(r,g),s.fromBufferAttribute(r,m),u.subVectors(s,n),h.subVectors(a,n),u.cross(h),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=r.count;d<p;d+=3)a.fromBufferAttribute(r,d+0),n.fromBufferAttribute(r,d+1),s.fromBufferAttribute(r,d+2),u.subVectors(s,n),h.subVectors(a,n),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let r=0,i=t.count;r<i;r++)wt.fromBufferAttribute(t,r),wt.normalize(),t.setXYZ(r,wt.x,wt.y,wt.z)}toNonIndexed(){function t(o,l){let c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u),p=0,v=0;for(let g=0,m=l.length;g<m;g++){o.isInterleavedBufferAttribute?p=l[g]*o.data.stride+o.offset:p=l[g]*u;for(let f=0;f<u;f++)d[v++]=c[p++]}return new Rt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let r=new Lh,i=this.index.array,a=this.attributes;for(let o in a){let l=a[o],c=t(l,i);r.setAttribute(o,c)}let n=this.morphAttributes;for(let o in n){let l=[],c=n[o];for(let u=0,h=c.length;u<h;u++){let d=c[u],p=t(d,i);l.push(p)}r.morphAttributes[o]=l}r.morphTargetsRelative=this.morphTargetsRelative;let s=this.groups;for(let o=0,l=s.length;o<l;o++){let c=s[o];r.addGroup(c.start,c.count,c.materialIndex)}return r}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let r=this.index;r!==null&&(t.data.index={type:r.array.constructor.name,array:Array.prototype.slice.call(r.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let a={},n=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(a[l]=u,n=!0)}n&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);let s=this.groups;s.length>0&&(t.data.groups=JSON.parse(JSON.stringify(s)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let r={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(r));let a=t.attributes;for(let c in a){let u=a[c];this.setAttribute(c,u.clone(r))}let n=t.morphAttributes;for(let c in n){let u=[],h=n[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(r));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let s=t.groups;for(let c=0,u=s.length;c<u;c++){let h=s[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},_u=new lt,di=new wh,Cn=new Cl,xu=new N,Rn=new N,Pn=new N,Ln=new N,go=new N,Dn=new N,yu=new N,Un=new N,mt=class extends Xt{constructor(e=new Kt,t=new zt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let r=e[t[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,a=r.length;i<a;i++){let n=r[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=i}}}}getVertexPosition(e,t){let r=this.geometry,i=r.attributes.position,a=r.morphAttributes.position,n=r.morphTargetsRelative;t.fromBufferAttribute(i,e);let s=this.morphTargetInfluences;if(a&&s){Dn.set(0,0,0);for(let o=0,l=a.length;o<l;o++){let c=s[o],u=a[o];c!==0&&(go.fromBufferAttribute(u,e),n?Dn.addScaledVector(go,c):Dn.addScaledVector(go.sub(t),c))}t.add(Dn)}return t}raycast(e,t){let r=this.geometry,i=this.material,a=this.matrixWorld;i!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Cn.copy(r.boundingSphere),Cn.applyMatrix4(a),di.copy(e.ray).recast(e.near),!(Cn.containsPoint(di.origin)===!1&&(di.intersectSphere(Cn,xu)===null||di.origin.distanceToSquared(xu)>(e.far-e.near)**2))&&(_u.copy(a).invert(),di.copy(e.ray).applyMatrix4(_u),!(r.boundingBox!==null&&di.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,r){let i,a=this.geometry,n=this.material,s=a.index,o=a.attributes.position,l=a.attributes.uv,c=a.attributes.uv1,u=a.attributes.normal,h=a.groups,d=a.drawRange;if(s!==null)if(Array.isArray(n))for(let p=0,v=h.length;p<v;p++){let g=h[p],m=n[g.materialIndex],f=Math.max(g.start,d.start),b=Math.min(s.count,Math.min(g.start+g.count,d.start+d.count));for(let M=f,C=b;M<C;M+=3){let G=s.getX(M),E=s.getX(M+1),A=s.getX(M+2);i=Nn(this,m,e,r,l,c,u,G,E,A),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),v=Math.min(s.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){let f=s.getX(g),b=s.getX(g+1),M=s.getX(g+2);i=Nn(this,n,e,r,l,c,u,f,b,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(n))for(let p=0,v=h.length;p<v;p++){let g=h[p],m=n[g.materialIndex],f=Math.max(g.start,d.start),b=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let M=f,C=b;M<C;M+=3){let G=M,E=M+1,A=M+2;i=Nn(this,m,e,r,l,c,u,G,E,A),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){let f=g,b=g+1,M=g+2;i=Nn(this,n,e,r,l,c,u,f,b,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function Lf(e,t,r,i,a,n,s,o){let l;if(t.side===Gt?l=i.intersectTriangle(s,n,a,!0,o):l=i.intersectTriangle(a,n,s,t.side===Kr,o),l===null)return null;Un.copy(o),Un.applyMatrix4(e.matrixWorld);let c=r.ray.origin.distanceTo(Un);return c<r.near||c>r.far?null:{distance:c,point:Un.clone(),object:e}}function Nn(e,t,r,i,a,n,s,o,l,c){e.getVertexPosition(o,Rn),e.getVertexPosition(l,Pn),e.getVertexPosition(c,Ln);let u=Lf(e,t,r,i,Rn,Pn,Ln,yu);if(u){let h=new N;qi.getBarycoord(yu,Rn,Pn,Ln,h),a&&(u.uv=qi.getInterpolatedAttribute(a,o,l,c,h,new ve)),n&&(u.uv1=qi.getInterpolatedAttribute(n,o,l,c,h,new ve)),s&&(u.normal=qi.getInterpolatedAttribute(s,o,l,c,h,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new N,materialIndex:0};qi.getNormal(Rn,Pn,Ln,d.normal),u.face=d,u.barycoord=h}return u}var Ya=class Dh extends Kt{constructor(t=1,r=1,i=1,a=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:r,depth:i,widthSegments:a,heightSegments:n,depthSegments:s};let o=this;a=Math.floor(a),n=Math.floor(n),s=Math.floor(s);let l=[],c=[],u=[],h=[],d=0,p=0;v("z","y","x",-1,-1,i,r,t,s,n,0),v("z","y","x",1,-1,i,r,-t,s,n,1),v("x","z","y",1,1,t,i,r,a,s,2),v("x","z","y",1,-1,t,i,-r,a,s,3),v("x","y","z",1,-1,t,r,i,a,n,4),v("x","y","z",-1,-1,t,r,-i,a,n,5),this.setIndex(l),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(h,2));function v(g,m,f,b,M,C,G,E,A,k,y){let S=C/A,U=G/k,H=C/2,q=G/2,Y=E/2,re=A+1,Q=k+1,oe=0,ee=0,ue=new N;for(let _e=0;_e<Q;_e++){let Be=_e*U-q;for(let De=0;De<re;De++){let $=De*S-H;ue[g]=$*b,ue[m]=Be*M,ue[f]=Y,c.push(ue.x,ue.y,ue.z),ue[g]=0,ue[m]=0,ue[f]=E>0?1:-1,u.push(ue.x,ue.y,ue.z),h.push(De/A),h.push(1-_e/k),oe+=1}}for(let _e=0;_e<k;_e++)for(let Be=0;Be<A;Be++){let De=d+Be+re*_e,$=d+Be+re*(_e+1),de=d+(Be+1)+re*(_e+1),Te=d+(Be+1)+re*_e;l.push(De,$,Te),l.push($,de,Te),ee+=6}o.addGroup(p,ee,y),p+=ee,d+=oe}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dh(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function na(e){let t={};for(let r in e){t[r]={};for(let i in e[r]){let a=e[r][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[r][i]=null):t[r][i]=a.clone():Array.isArray(a)?t[r][i]=a.slice():t[r][i]=a}}return t}function Ft(e){let t={};for(let r=0;r<e.length;r++){let i=na(e[r]);for(let a in i)t[a]=i[a]}return t}function Df(e){let t=[];for(let r=0;r<e.length;r++)t.push(e[r].clone());return t}function Uh(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ke.workingColorSpace}var Uf={clone:na,merge:Ft},Nf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,If=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,$r=class extends ca{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nf,this.fragmentShader=If,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=na(e.uniforms),this.uniformsGroups=Df(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let r={};for(let i in this.extensions)this.extensions[i]===!0&&(r[i]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}},Nh=class extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=Lr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},qr=new N,Mu=new ve,Su=new ve,or=class extends Nh{constructor(e=50,t=1,r=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=vl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vl*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){qr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qr.x,qr.y).multiplyScalar(-e/qr.z),qr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(qr.x,qr.y).multiplyScalar(-e/qr.z)}getViewSize(e,t){return this.getViewBounds(e,Mu,Su),t.subVectors(Su,Mu)}setViewOffset(e,t,r,i,a,n){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=i,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Zs*.5*this.fov)/this.zoom,r=2*t,i=this.aspect*r,a=-.5*i,n=this.view;if(this.view!==null&&this.view.enabled){let o=n.fullWidth,l=n.fullHeight;a+=n.offsetX*i/o,t-=n.offsetY*r/l,i*=n.width/o,r*=n.height/l}let s=this.filmOffset;s!==0&&(a+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+i,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Bi=-90,Hi=1,Of=class extends Xt{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new or(Bi,Hi,e,t);i.layers=this.layers,this.add(i);let a=new or(Bi,Hi,e,t);a.layers=this.layers,this.add(a);let n=new or(Bi,Hi,e,t);n.layers=this.layers,this.add(n);let s=new or(Bi,Hi,e,t);s.layers=this.layers,this.add(s);let o=new or(Bi,Hi,e,t);o.layers=this.layers,this.add(o);let l=new or(Bi,Hi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[r,i,a,n,s,o]=t;for(let l of t)this.remove(l);if(e===Lr)r.up.set(0,1,0),r.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),n.up.set(0,0,1),n.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===Qn)r.up.set(0,-1,0),r.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),n.up.set(0,0,-1),n.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:r,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,n,s,o,l,c]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let v=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,i),e.render(t,a),e.setRenderTarget(r,1,i),e.render(t,n),e.setRenderTarget(r,2,i),e.render(t,s),e.setRenderTarget(r,3,i),e.render(t,o),e.setRenderTarget(r,4,i),e.render(t,l),r.texture.generateMipmaps=v,e.setRenderTarget(r,5,i),e.render(t,c),e.setRenderTarget(u,h,d),e.xr.enabled=p,r.texture.needsPMREMUpdate=!0}},Ih=class extends cr{constructor(e,t,r,i,a,n,s,o,l,c){e=e!==void 0?e:[],t=t!==void 0?t:ta,super(e,t,r,i,a,n,s,o,l,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ff=class extends Ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let r={width:e,height:e,depth:1},i=[r,r,r,r,r,r];this.texture=new Ih(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:xr}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ya(5,5,5),a=new $r({name:"CubemapFromEquirect",uniforms:na(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Gt,blending:Yr});a.uniforms.tEquirect.value=t;let n=new mt(i,a),s=t.minFilter;return t.minFilter===Mi&&(t.minFilter=xr),new Of(1,10,this).update(e,n),t.minFilter=s,n.geometry.dispose(),n.material.dispose(),this}clear(e,t,r,i){let a=e.getRenderTarget();for(let n=0;n<6;n++)e.setRenderTarget(this,n),e.clear(t,r,i);e.setRenderTarget(a)}},vo=new N,zf=new N,kf=new We,gi=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,i){return this.normal.set(e,t,r),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){let i=vo.subVectors(r,t).cross(zf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let r=e.delta(vo),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return a<0||a>1?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let r=t||kf.getNormalMatrix(e),i=this.coplanarPoint(vo).applyMatrix4(e),a=this.normal.applyMatrix3(r).normalize();return this.constant=-i.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},pi=new Cl,In=new N,Pl=class{constructor(e=new gi,t=new gi,r=new gi,i=new gi,a=new gi,n=new gi){this.planes=[e,t,r,i,a,n]}set(e,t,r,i,a,n){let s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(r),s[3].copy(i),s[4].copy(a),s[5].copy(n),this}copy(e){let t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=Lr){let r=this.planes,i=e.elements,a=i[0],n=i[1],s=i[2],o=i[3],l=i[4],c=i[5],u=i[6],h=i[7],d=i[8],p=i[9],v=i[10],g=i[11],m=i[12],f=i[13],b=i[14],M=i[15];if(r[0].setComponents(o-a,h-l,g-d,M-m).normalize(),r[1].setComponents(o+a,h+l,g+d,M+m).normalize(),r[2].setComponents(o+n,h+c,g+p,M+f).normalize(),r[3].setComponents(o-n,h-c,g-p,M-f).normalize(),r[4].setComponents(o-s,h-u,g-v,M-b).normalize(),t===Lr)r[5].setComponents(o+s,h+u,g+v,M+b).normalize();else if(t===Qn)r[5].setComponents(s,u,v,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(e){return pi.center.set(0,0,0),pi.radius=.7071067811865476,pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(e){let t=this.planes,r=e.center,i=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(r)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let r=0;r<6;r++){let i=t[r];if(In.x=i.normal.x>0?e.max.x:e.min.x,In.y=i.normal.y>0?e.max.y:e.min.y,In.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(In)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Oh(){let e=null,t=!1,r=null,i=null;function a(n,s){r(n,s),i=e.requestAnimationFrame(a)}return{start:function(){t!==!0&&r!==null&&(i=e.requestAnimationFrame(a),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(n){r=n},setContext:function(n){e=n}}}function Bf(e){let t=new WeakMap;function r(o,l){let c=o.array,u=o.usage,h=c.byteLength,d=e.createBuffer();e.bindBuffer(l,d),e.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=e.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=e.HALF_FLOAT:p=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=e.SHORT;else if(c instanceof Uint32Array)p=e.UNSIGNED_INT;else if(c instanceof Int32Array)p=e.INT;else if(c instanceof Int8Array)p=e.BYTE;else if(c instanceof Uint8Array)p=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){let u=l.array,h=l.updateRanges;if(e.bindBuffer(c,o),h.length===0)e.bufferSubData(c,0,u);else{h.sort((p,v)=>p.start-v.start);let d=0;for(let p=1;p<h.length;p++){let v=h[d],g=h[p];g.start<=v.start+v.count+1?v.count=Math.max(v.count,g.start+g.count-v.start):(++d,h[d]=g)}h.length=d+1;for(let p=0,v=h.length;p<v;p++){let g=h[p];e.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,r(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:a,remove:n,update:s}}var Za=class Fh extends Kt{constructor(t=1,r=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:r,widthSegments:i,heightSegments:a};let n=t/2,s=r/2,o=Math.floor(i),l=Math.floor(a),c=o+1,u=l+1,h=t/o,d=r/l,p=[],v=[],g=[],m=[];for(let f=0;f<u;f++){let b=f*d-s;for(let M=0;M<c;M++){let C=M*h-n;v.push(C,-b,0),g.push(0,0,1),m.push(M/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<o;b++){let M=b+c*f,C=b+c*(f+1),G=b+1+c*(f+1),E=b+1+c*f;p.push(M,C,E),p.push(C,G,E)}this.setIndex(p),this.setAttribute("position",new gt(v,3)),this.setAttribute("normal",new gt(g,3)),this.setAttribute("uv",new gt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fh(t.width,t.height,t.widthSegments,t.heightSegments)}},Hf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vf=`#ifdef USE_ALPHAHASH
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
#endif`,Gf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qf=`#ifdef USE_AOMAP
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
#endif`,Yf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zf=`#ifdef USE_BATCHING
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
#endif`,Jf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Kf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$f=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Qf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,em=`#ifdef USE_IRIDESCENCE
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
#endif`,tm=`#ifdef USE_BUMPMAP
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
#endif`,rm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,im=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,om=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,lm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,cm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,um=`#define PI 3.141592653589793
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
} // validated`,hm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,dm=`vec3 transformedNormal = objectNormal;
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
#endif`,pm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vm="gl_FragColor = linearToOutputTexel( gl_FragColor );",_m=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xm=`#ifdef USE_ENVMAP
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
#endif`,ym=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Mm=`#ifdef USE_ENVMAP
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
#endif`,Sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Em=`#ifdef USE_ENVMAP
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
#endif`,bm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cm=`#ifdef USE_GRADIENTMAP
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
}`,Rm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dm=`uniform bool receiveShadow;
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
#endif`,Um=`#ifdef USE_ENVMAP
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
#endif`,Nm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Om=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zm=`PhysicalMaterial material;
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
#endif`,km=`struct PhysicalMaterial {
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
}`,Bm=`
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
#endif`,Hm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Vm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Gm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ym=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jm=`#if defined( USE_POINTS_UV )
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
#endif`,Km=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Qm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,eg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,tg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rg=`#ifdef USE_MORPHTARGETS
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
#endif`,ig=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ag=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ng=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,og=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,cg=`#ifdef USE_NORMALMAP
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
#endif`,ug=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,dg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,mg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,gg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_g=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Sg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Eg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,bg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Tg=`float getShadowMask() {
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
}`,wg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ag=`#ifdef USE_SKINNING
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
#endif`,Cg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Rg=`#ifdef USE_SKINNING
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
#endif`,Pg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ug=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ng=`#ifdef USE_TRANSMISSION
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
#endif`,Ig=`#ifdef USE_TRANSMISSION
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
#endif`,Og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hg=`uniform sampler2D t2D;
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
}`,Vg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jg=`#include <common>
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
}`,qg=`#if DEPTH_PACKING == 3200
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
}`,Yg=`#define DISTANCE
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
}`,Zg=`#define DISTANCE
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
}`,Jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Kg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$g=`uniform float scale;
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
}`,Qg=`uniform vec3 diffuse;
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
}`,e0=`#include <common>
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
}`,t0=`uniform vec3 diffuse;
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
}`,r0=`#define LAMBERT
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
}`,i0=`#define LAMBERT
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
}`,a0=`#define MATCAP
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
}`,n0=`#define MATCAP
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
}`,s0=`#define NORMAL
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
}`,o0=`#define NORMAL
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
}`,l0=`#define PHONG
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
}`,c0=`#define PHONG
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
}`,u0=`#define STANDARD
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
}`,h0=`#define STANDARD
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
}`,d0=`#define TOON
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
}`,p0=`#define TOON
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
}`,f0=`uniform float size;
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
}`,m0=`uniform vec3 diffuse;
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
}`,g0=`#include <common>
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
}`,v0=`uniform vec3 color;
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
}`,_0=`uniform float rotation;
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
}`,x0=`uniform vec3 diffuse;
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
}`,Ve={alphahash_fragment:Hf,alphahash_pars_fragment:Vf,alphamap_fragment:Gf,alphamap_pars_fragment:Wf,alphatest_fragment:Xf,alphatest_pars_fragment:jf,aomap_fragment:qf,aomap_pars_fragment:Yf,batching_pars_vertex:Zf,batching_vertex:Jf,begin_vertex:Kf,beginnormal_vertex:$f,bsdfs:Qf,iridescence_fragment:em,bumpmap_pars_fragment:tm,clipping_planes_fragment:rm,clipping_planes_pars_fragment:im,clipping_planes_pars_vertex:am,clipping_planes_vertex:nm,color_fragment:sm,color_pars_fragment:om,color_pars_vertex:lm,color_vertex:cm,common:um,cube_uv_reflection_fragment:hm,defaultnormal_vertex:dm,displacementmap_pars_vertex:pm,displacementmap_vertex:fm,emissivemap_fragment:mm,emissivemap_pars_fragment:gm,colorspace_fragment:vm,colorspace_pars_fragment:_m,envmap_fragment:xm,envmap_common_pars_fragment:ym,envmap_pars_fragment:Mm,envmap_pars_vertex:Sm,envmap_physical_pars_fragment:Um,envmap_vertex:Em,fog_vertex:bm,fog_pars_vertex:Tm,fog_fragment:wm,fog_pars_fragment:Am,gradientmap_pars_fragment:Cm,lightmap_pars_fragment:Rm,lights_lambert_fragment:Pm,lights_lambert_pars_fragment:Lm,lights_pars_begin:Dm,lights_toon_fragment:Nm,lights_toon_pars_fragment:Im,lights_phong_fragment:Om,lights_phong_pars_fragment:Fm,lights_physical_fragment:zm,lights_physical_pars_fragment:km,lights_fragment_begin:Bm,lights_fragment_maps:Hm,lights_fragment_end:Vm,logdepthbuf_fragment:Gm,logdepthbuf_pars_fragment:Wm,logdepthbuf_pars_vertex:Xm,logdepthbuf_vertex:jm,map_fragment:qm,map_pars_fragment:Ym,map_particle_fragment:Zm,map_particle_pars_fragment:Jm,metalnessmap_fragment:Km,metalnessmap_pars_fragment:$m,morphinstance_vertex:Qm,morphcolor_vertex:eg,morphnormal_vertex:tg,morphtarget_pars_vertex:rg,morphtarget_vertex:ig,normal_fragment_begin:ag,normal_fragment_maps:ng,normal_pars_fragment:sg,normal_pars_vertex:og,normal_vertex:lg,normalmap_pars_fragment:cg,clearcoat_normal_fragment_begin:ug,clearcoat_normal_fragment_maps:hg,clearcoat_pars_fragment:dg,iridescence_pars_fragment:pg,opaque_fragment:fg,packing:mg,premultiplied_alpha_fragment:gg,project_vertex:vg,dithering_fragment:_g,dithering_pars_fragment:xg,roughnessmap_fragment:yg,roughnessmap_pars_fragment:Mg,shadowmap_pars_fragment:Sg,shadowmap_pars_vertex:Eg,shadowmap_vertex:bg,shadowmask_pars_fragment:Tg,skinbase_vertex:wg,skinning_pars_vertex:Ag,skinning_vertex:Cg,skinnormal_vertex:Rg,specularmap_fragment:Pg,specularmap_pars_fragment:Lg,tonemapping_fragment:Dg,tonemapping_pars_fragment:Ug,transmission_fragment:Ng,transmission_pars_fragment:Ig,uv_pars_fragment:Og,uv_pars_vertex:Fg,uv_vertex:zg,worldpos_vertex:kg,background_vert:Bg,background_frag:Hg,backgroundCube_vert:Vg,backgroundCube_frag:Gg,cube_vert:Wg,cube_frag:Xg,depth_vert:jg,depth_frag:qg,distanceRGBA_vert:Yg,distanceRGBA_frag:Zg,equirect_vert:Jg,equirect_frag:Kg,linedashed_vert:$g,linedashed_frag:Qg,meshbasic_vert:e0,meshbasic_frag:t0,meshlambert_vert:r0,meshlambert_frag:i0,meshmatcap_vert:a0,meshmatcap_frag:n0,meshnormal_vert:s0,meshnormal_frag:o0,meshphong_vert:l0,meshphong_frag:c0,meshphysical_vert:u0,meshphysical_frag:h0,meshtoon_vert:d0,meshtoon_frag:p0,points_vert:f0,points_frag:m0,shadow_vert:g0,shadow_frag:v0,sprite_vert:_0,sprite_frag:x0},fe={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},gr={basic:{uniforms:Ft([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Ft([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new je(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Ft([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Ft([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Ft([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new je(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Ft([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Ft([fe.points,fe.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Ft([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Ft([fe.common,fe.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Ft([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Ft([fe.sprite,fe.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:Ft([fe.common,fe.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:Ft([fe.lights,fe.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};gr.physical={uniforms:Ft([gr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};var On={r:0,b:0,g:0},fi=new bi,y0=new lt;function M0(e,t,r,i,a,n,s){let o=new je(0),l=n===!0?0:1,c,u,h=null,d=0,p=null;function v(b){let M=b.isScene===!0?b.background:null;return M&&M.isTexture&&(M=(b.backgroundBlurriness>0?r:t).get(M)),M}function g(b){let M=!1,C=v(b);C===null?f(o,l):C&&C.isColor&&(f(C,1),M=!0);let G=e.xr.getEnvironmentBlendMode();G==="additive"?i.buffers.color.setClear(0,0,0,1,s):G==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(e.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function m(b,M){let C=v(M);C&&(C.isCubeTexture||C.mapping===ts)?(u===void 0&&(u=new mt(new Ya(1,1,1),new $r({name:"BackgroundCubeMaterial",uniforms:na(gr.backgroundCube.uniforms),vertexShader:gr.backgroundCube.vertexShader,fragmentShader:gr.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(G,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(u)),fi.copy(M.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(y0.makeRotationFromEuler(fi)),u.material.toneMapped=Ke.getTransfer(C.colorSpace)!==it,(h!==C||d!==C.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,p=e.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new mt(new Za(2,2),new $r({name:"BackgroundMaterial",uniforms:na(gr.background.uniforms),vertexShader:gr.background.vertexShader,fragmentShader:gr.background.fragmentShader,side:Kr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Ke.getTransfer(C.colorSpace)!==it,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||p!==e.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,p=e.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,M){b.getRGB(On,Uh(e)),i.buffers.color.setClear(On.r,On.g,On.b,M,s)}return{getClearColor:function(){return o},setClearColor:function(b,M=1){o.set(b),l=M,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(o,l)},render:g,addToRenderList:m}}function S0(e,t){let r=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},a=d(null),n=a,s=!1;function o(S,U,H,q,Y){let re=!1,Q=h(q,H,U);n!==Q&&(n=Q,c(n.object)),re=p(S,q,H,Y),re&&v(S,q,H,Y),Y!==null&&t.update(Y,e.ELEMENT_ARRAY_BUFFER),(re||s)&&(s=!1,C(S,U,H,q),Y!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function l(){return e.createVertexArray()}function c(S){return e.bindVertexArray(S)}function u(S){return e.deleteVertexArray(S)}function h(S,U,H){let q=H.wireframe===!0,Y=i[S.id];Y===void 0&&(Y={},i[S.id]=Y);let re=Y[U.id];re===void 0&&(re={},Y[U.id]=re);let Q=re[q];return Q===void 0&&(Q=d(l()),re[q]=Q),Q}function d(S){let U=[],H=[],q=[];for(let Y=0;Y<r;Y++)U[Y]=0,H[Y]=0,q[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:H,attributeDivisors:q,object:S,attributes:{},index:null}}function p(S,U,H,q){let Y=n.attributes,re=U.attributes,Q=0,oe=H.getAttributes();for(let ee in oe)if(oe[ee].location>=0){let ue=Y[ee],_e=re[ee];if(_e===void 0&&(ee==="instanceMatrix"&&S.instanceMatrix&&(_e=S.instanceMatrix),ee==="instanceColor"&&S.instanceColor&&(_e=S.instanceColor)),ue===void 0||ue.attribute!==_e||_e&&ue.data!==_e.data)return!0;Q++}return n.attributesNum!==Q||n.index!==q}function v(S,U,H,q){let Y={},re=U.attributes,Q=0,oe=H.getAttributes();for(let ee in oe)if(oe[ee].location>=0){let ue=re[ee];ue===void 0&&(ee==="instanceMatrix"&&S.instanceMatrix&&(ue=S.instanceMatrix),ee==="instanceColor"&&S.instanceColor&&(ue=S.instanceColor));let _e={};_e.attribute=ue,ue&&ue.data&&(_e.data=ue.data),Y[ee]=_e,Q++}n.attributes=Y,n.attributesNum=Q,n.index=q}function g(){let S=n.newAttributes;for(let U=0,H=S.length;U<H;U++)S[U]=0}function m(S){f(S,0)}function f(S,U){let H=n.newAttributes,q=n.enabledAttributes,Y=n.attributeDivisors;H[S]=1,q[S]===0&&(e.enableVertexAttribArray(S),q[S]=1),Y[S]!==U&&(e.vertexAttribDivisor(S,U),Y[S]=U)}function b(){let S=n.newAttributes,U=n.enabledAttributes;for(let H=0,q=U.length;H<q;H++)U[H]!==S[H]&&(e.disableVertexAttribArray(H),U[H]=0)}function M(S,U,H,q,Y,re,Q){Q===!0?e.vertexAttribIPointer(S,U,H,Y,re):e.vertexAttribPointer(S,U,H,q,Y,re)}function C(S,U,H,q){g();let Y=q.attributes,re=H.getAttributes(),Q=U.defaultAttributeValues;for(let oe in re){let ee=re[oe];if(ee.location>=0){let ue=Y[oe];if(ue===void 0&&(oe==="instanceMatrix"&&S.instanceMatrix&&(ue=S.instanceMatrix),oe==="instanceColor"&&S.instanceColor&&(ue=S.instanceColor)),ue!==void 0){let _e=ue.normalized,Be=ue.itemSize,De=t.get(ue);if(De===void 0)continue;let $=De.buffer,de=De.type,Te=De.bytesPerElement,Re=de===e.INT||de===e.UNSIGNED_INT||ue.gpuType===Sl;if(ue.isInterleavedBufferAttribute){let me=ue.data,Ie=me.stride,rt=ue.offset;if(me.isInstancedInterleavedBuffer){for(let Xe=0;Xe<ee.locationSize;Xe++)f(ee.location+Xe,me.meshPerAttribute);S.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Xe=0;Xe<ee.locationSize;Xe++)m(ee.location+Xe);e.bindBuffer(e.ARRAY_BUFFER,$);for(let Xe=0;Xe<ee.locationSize;Xe++)M(ee.location+Xe,Be/ee.locationSize,de,_e,Ie*Te,(rt+Be/ee.locationSize*Xe)*Te,Re)}else{if(ue.isInstancedBufferAttribute){for(let me=0;me<ee.locationSize;me++)f(ee.location+me,ue.meshPerAttribute);S.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let me=0;me<ee.locationSize;me++)m(ee.location+me);e.bindBuffer(e.ARRAY_BUFFER,$);for(let me=0;me<ee.locationSize;me++)M(ee.location+me,Be/ee.locationSize,de,_e,Be*Te,Be/ee.locationSize*me*Te,Re)}}else if(Q!==void 0){let _e=Q[oe];if(_e!==void 0)switch(_e.length){case 2:e.vertexAttrib2fv(ee.location,_e);break;case 3:e.vertexAttrib3fv(ee.location,_e);break;case 4:e.vertexAttrib4fv(ee.location,_e);break;default:e.vertexAttrib1fv(ee.location,_e)}}}}b()}function G(){k();for(let S in i){let U=i[S];for(let H in U){let q=U[H];for(let Y in q)u(q[Y].object),delete q[Y];delete U[H]}delete i[S]}}function E(S){if(i[S.id]===void 0)return;let U=i[S.id];for(let H in U){let q=U[H];for(let Y in q)u(q[Y].object),delete q[Y];delete U[H]}delete i[S.id]}function A(S){for(let U in i){let H=i[U];if(H[S.id]===void 0)continue;let q=H[S.id];for(let Y in q)u(q[Y].object),delete q[Y];delete H[S.id]}}function k(){y(),s=!0,n!==a&&(n=a,c(n.object))}function y(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:k,resetDefaultState:y,dispose:G,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:g,enableAttribute:m,disableUnusedAttributes:b}}function E0(e,t,r){let i;function a(c){i=c}function n(c,u){e.drawArrays(i,c,u),r.update(u,i,1)}function s(c,u,h){h!==0&&(e.drawArraysInstanced(i,c,u,h),r.update(u,i,h))}function o(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let d=0;for(let p=0;p<h;p++)d+=u[p];r.update(d,i,1)}function l(c,u,h,d){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)s(c[v],u[v],d[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let v=0;for(let g=0;g<h;g++)v+=u[g]*d[g];r.update(v,i,1)}}this.setMode=a,this.render=n,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function b0(e,t,r,i){let a;function n(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");a=e.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(A){return!(A!==lr&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let k=A===ja&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Ur&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Pr&&!k)}function l(A){if(A==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=r.precision!==void 0?r.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=r.logarithmicDepthBuffer===!0,d=r.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),v=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),f=e.getParameter(e.MAX_VERTEX_ATTRIBS),b=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),C=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),G=v>0,E=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:v,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:C,vertexTextures:G,maxSamples:E}}function T0(e){let t=this,r=null,i=0,a=!1,n=!1,s=new gi,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||i!==0||a;return a=d,i=h.length,p},this.beginShadows=function(){n=!0,u(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(h,d){r=u(h,d,0)},this.setState=function(h,d,p){let v=h.clippingPlanes,g=h.clipIntersection,m=h.clipShadows,f=e.get(h);if(!a||v===null||v.length===0||n&&!m)n?u(null):c();else{let b=n?0:i,M=b*4,C=f.clippingState||null;l.value=C,C=u(v,d,M,p);for(let G=0;G!==M;++G)C[G]=r[G];f.clippingState=C,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==r&&(l.value=r,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,d,p,v){let g=h!==null?h.length:0,m=null;if(g!==0){if(m=l.value,v!==!0||m===null){let f=p+g*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,C=p;M!==g;++M,C+=4)s.copy(h[M]).applyMatrix4(b,o),s.normal.toArray(m,C),m[C+3]=s.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function w0(e){let t=new WeakMap;function r(s,o){return o===ko?s.mapping=ta:o===Bo&&(s.mapping=ra),s}function i(s){if(s&&s.isTexture){let o=s.mapping;if(o===ko||o===Bo)if(t.has(s)){let l=t.get(s).texture;return r(l,s.mapping)}else{let l=s.image;if(l&&l.height>0){let c=new Ff(l.height);return c.fromEquirectangularTexture(e,s),t.set(s,c),s.addEventListener("dispose",a),r(c.texture,s.mapping)}else return null}}return s}function a(s){let o=s.target;o.removeEventListener("dispose",a);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function n(){t=new WeakMap}return{get:i,dispose:n}}var ua=class extends Nh{constructor(e=-1,t=1,r=1,i=-1,a=.1,n=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=i,this.near=a,this.far=n,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,i,a,n){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=i,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,i=(this.top+this.bottom)/2,a=r-e,n=r+e,s=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,n=a+l*this.view.width,s-=c*this.view.offsetY,o=s-c*this.view.height}this.projectionMatrix.makeOrthographic(a,n,s,o,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ji=4,Eu=[.125,.215,.35,.446,.526,.582],xi=20,_o=new ua,bu=new je,xo=null,yo=0,Mo=0,So=!1,vi=(1+Math.sqrt(5))/2,Vi=1/vi,Tu=[new N(-vi,Vi,0),new N(vi,Vi,0),new N(-Vi,0,vi),new N(Vi,0,vi),new N(0,vi,-Vi),new N(0,vi,Vi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],wu=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,i=100){xo=this._renderer.getRenderTarget(),yo=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),So=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,r,i,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ru(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(xo,yo,Mo),this._renderer.xr.enabled=So,e.scissorTest=!1,Fn(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ta||e.mapping===ra?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xo=this._renderer.getRenderTarget(),yo=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),So=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:xr,minFilter:xr,generateMipmaps:!1,type:ja,format:lr,colorSpace:sa,depthBuffer:!1},i=Au(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Au(e,t,r);let{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=A0(a)),this._blurMaterial=C0(a,e,t)}return i}_compileMaterial(e){let t=new mt(this._lodPlanes[0],e);this._renderer.compile(t,_o)}_sceneToCubeUV(e,t,r,i){let a=new or(90,1,t,r),n=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],o=this._renderer,l=o.autoClear,c=o.toneMapping;o.getClearColor(bu),o.toneMapping=Zr,o.autoClear=!1;let u=new zt({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),h=new mt(new Ya,u),d=!1,p=e.background;p?p.isColor&&(u.color.copy(p),e.background=null,d=!0):(u.color.copy(bu),d=!0);for(let v=0;v<6;v++){let g=v%3;g===0?(a.up.set(0,n[v],0),a.lookAt(s[v],0,0)):g===1?(a.up.set(0,0,n[v]),a.lookAt(0,s[v],0)):(a.up.set(0,n[v],0),a.lookAt(0,0,s[v]));let m=this._cubeSize;Fn(i,g*m,v>2?m:0,m,m),o.setRenderTarget(i),d&&o.render(h,a),o.render(e,a)}h.geometry.dispose(),h.material.dispose(),o.toneMapping=c,o.autoClear=l,e.background=p}_textureToCubeUV(e,t){let r=this._renderer,i=e.mapping===ta||e.mapping===ra;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ru()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cu());let a=i?this._cubemapMaterial:this._equirectMaterial,n=new mt(this._lodPlanes[0],a),s=a.uniforms;s.envMap.value=e;let o=this._cubeSize;Fn(t,0,0,3*o,2*o),r.setRenderTarget(t),r.render(n,_o)}_applyPMREM(e){let t=this._renderer,r=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let a=1;a<i;a++){let n=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),s=Tu[(i-a-1)%Tu.length];this._blur(e,a-1,a,n,s)}t.autoClear=r}_blur(e,t,r,i,a){let n=this._pingPongRenderTarget;this._halfBlur(e,n,t,r,i,"latitudinal",a),this._halfBlur(n,e,r,r,i,"longitudinal",a)}_halfBlur(e,t,r,i,a,n,s){let o=this._renderer,l=this._blurMaterial;n!=="latitudinal"&&n!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let c=3,u=new mt(this._lodPlanes[i],l),h=l.uniforms,d=this._sizeLods[r]-1,p=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*xi-1),v=a/p,g=isFinite(a)?1+Math.floor(c*v):xi;g>xi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${xi}`);let m=[],f=0;for(let E=0;E<xi;++E){let A=E/v,k=Math.exp(-A*A/2);m.push(k),E===0?f+=k:E<g&&(f+=2*k)}for(let E=0;E<m.length;E++)m[E]=m[E]/f;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=m,h.latitudinal.value=n==="latitudinal",s&&(h.poleAxis.value=s);let{_lodMax:b}=this;h.dTheta.value=p,h.mipInt.value=b-r;let M=this._sizeLods[i],C=3*M*(i>b-Ji?i-b+Ji:0),G=4*(this._cubeSize-M);Fn(t,C,G,3*M,2*M),o.setRenderTarget(t),o.render(u,_o)}};function A0(e){let t=[],r=[],i=[],a=e,n=e-Ji+1+Eu.length;for(let s=0;s<n;s++){let o=Math.pow(2,a);r.push(o);let l=1/o;s>e-Ji?l=Eu[s-e+Ji-1]:s===0&&(l=0),i.push(l);let c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,v=6,g=3,m=2,f=1,b=new Float32Array(g*v*p),M=new Float32Array(m*v*p),C=new Float32Array(f*v*p);for(let E=0;E<p;E++){let A=E%3*2/3-1,k=E>2?0:-1,y=[A,k,0,A+2/3,k,0,A+2/3,k+1,0,A,k,0,A+2/3,k+1,0,A,k+1,0];b.set(y,g*v*E),M.set(d,m*v*E);let S=[E,E,E,E,E,E];C.set(S,f*v*E)}let G=new Kt;G.setAttribute("position",new Rt(b,g)),G.setAttribute("uv",new Rt(M,m)),G.setAttribute("faceIndex",new Rt(C,f)),t.push(G),a>Ji&&a--}return{lodPlanes:t,sizeLods:r,sigmas:i}}function Au(e,t,r){let i=new Ei(e,t,r);return i.texture.mapping=ts,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fn(e,t,r,i,a){e.viewport.set(t,r,i,a),e.scissor.set(t,r,i,a)}function C0(e,t,r){let i=new Float32Array(xi),a=new N(0,1,0);return new $r({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/r,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Yr,depthTest:!1,depthWrite:!1})}function Cu(){return new $r({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Yr,depthTest:!1,depthWrite:!1})}function Ru(){return new $r({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yr,depthTest:!1,depthWrite:!1})}function Ll(){return`

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
	`}function R0(e){let t=new WeakMap,r=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===ko||l===Bo,u=l===ta||l===ra;if(c||u){let h=t.get(o),d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return r===null&&(r=new wu(e)),h=c?r.fromEquirectangular(o,h):r.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{let p=o.image;return c&&p&&p.height>0||u&&p&&a(p)?(r===null&&(r=new wu(e)),h=c?r.fromEquirectangular(o):r.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",n),h.texture):null}}}return o}function a(o){let l=0,c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function n(o){let l=o.target;l.removeEventListener("dispose",n);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function s(){t=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:s}}function P0(e){let t={};function r(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=e.getExtension(i)}return t[i]=a,a}return{has:function(i){return r(i)!==null},init:function(){r("EXT_color_buffer_float"),r("WEBGL_clip_cull_distance"),r("OES_texture_float_linear"),r("EXT_color_buffer_half_float"),r("WEBGL_multisampled_render_to_texture"),r("WEBGL_render_shared_exponent")},get:function(i){let a=r(i);return a===null&&Ha("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function L0(e,t,r,i){let a={},n=new WeakMap;function s(h){let d=h.target;d.index!==null&&t.remove(d.index);for(let v in d.attributes)t.remove(d.attributes[v]);for(let v in d.morphAttributes){let g=d.morphAttributes[v];for(let m=0,f=g.length;m<f;m++)t.remove(g[m])}d.removeEventListener("dispose",s),delete a[d.id];let p=n.get(d);p&&(t.remove(p),n.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,r.memory.geometries--}function o(h,d){return a[d.id]===!0||(d.addEventListener("dispose",s),a[d.id]=!0,r.memory.geometries++),d}function l(h){let d=h.attributes;for(let v in d)t.update(d[v],e.ARRAY_BUFFER);let p=h.morphAttributes;for(let v in p){let g=p[v];for(let m=0,f=g.length;m<f;m++)t.update(g[m],e.ARRAY_BUFFER)}}function c(h){let d=[],p=h.index,v=h.attributes.position,g=0;if(p!==null){let b=p.array;g=p.version;for(let M=0,C=b.length;M<C;M+=3){let G=b[M+0],E=b[M+1],A=b[M+2];d.push(G,E,E,A,A,G)}}else if(v!==void 0){let b=v.array;g=v.version;for(let M=0,C=b.length/3-1;M<C;M+=3){let G=M+0,E=M+1,A=M+2;d.push(G,E,E,A,A,G)}}else return;let m=new(Mh(d)?Ph:Rh)(d,1);m.version=g;let f=n.get(h);f&&t.remove(f),n.set(h,m)}function u(h){let d=n.get(h);if(d){let p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return n.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function D0(e,t,r){let i;function a(d){i=d}let n,s;function o(d){n=d.type,s=d.bytesPerElement}function l(d,p){e.drawElements(i,p,n,d*s),r.update(p,i,1)}function c(d,p,v){v!==0&&(e.drawElementsInstanced(i,p,n,d*s,v),r.update(p,i,v))}function u(d,p,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,n,d,0,v);let g=0;for(let m=0;m<v;m++)g+=p[m];r.update(g,i,1)}function h(d,p,v,g){if(v===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/s,p[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,n,d,0,g,0,v);let f=0;for(let b=0;b<v;b++)f+=p[b]*g[b];r.update(f,i,1)}}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function U0(e){let t={geometries:0,textures:0},r={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,s,o){switch(r.calls++,s){case e.TRIANGLES:r.triangles+=o*(n/3);break;case e.LINES:r.lines+=o*(n/2);break;case e.LINE_STRIP:r.lines+=o*(n-1);break;case e.LINE_LOOP:r.lines+=o*n;break;case e.POINTS:r.points+=o*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function a(){r.calls=0,r.triangles=0,r.points=0,r.lines=0}return{memory:t,render:r,programs:null,autoReset:!0,reset:a,update:i}}function N0(e,t,r){let i=new WeakMap,a=new yt;function n(s,o,l){let c=s.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,d=i.get(o);if(d===void 0||d.count!==h){let p=function(){k.dispose(),i.delete(o),o.removeEventListener("dispose",p)};d!==void 0&&d.texture.dispose();let v=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],C=0;v===!0&&(C=1),g===!0&&(C=2),m===!0&&(C=3);let G=o.attributes.position.count*C,E=1;G>t.maxTextureSize&&(E=Math.ceil(G/t.maxTextureSize),G=t.maxTextureSize);let A=new Float32Array(G*E*4*h),k=new bh(A,G,E,h);k.type=Pr,k.needsUpdate=!0;let y=C*4;for(let S=0;S<h;S++){let U=f[S],H=b[S],q=M[S],Y=G*E*4*S;for(let re=0;re<U.count;re++){let Q=re*y;v===!0&&(a.fromBufferAttribute(U,re),A[Y+Q+0]=a.x,A[Y+Q+1]=a.y,A[Y+Q+2]=a.z,A[Y+Q+3]=0),g===!0&&(a.fromBufferAttribute(H,re),A[Y+Q+4]=a.x,A[Y+Q+5]=a.y,A[Y+Q+6]=a.z,A[Y+Q+7]=0),m===!0&&(a.fromBufferAttribute(q,re),A[Y+Q+8]=a.x,A[Y+Q+9]=a.y,A[Y+Q+10]=a.z,A[Y+Q+11]=q.itemSize===4?a.w:1)}}d={count:h,texture:k,size:new ve(G,E)},i.set(o,d),o.addEventListener("dispose",p)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",s.morphTexture,r);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];let v=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(e,"morphTargetBaseInfluence",v),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",d.texture,r),l.getUniforms().setValue(e,"morphTargetsTextureSize",d.size)}return{update:n}}function I0(e,t,r,i){let a=new WeakMap;function n(l){let c=i.render.frame,u=l.geometry,h=t.get(l,u);if(a.get(h)!==c&&(t.update(h),a.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),a.get(l)!==c&&(r.update(l.instanceMatrix,e.ARRAY_BUFFER),l.instanceColor!==null&&r.update(l.instanceColor,e.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return h}function s(){a=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),r.remove(c.instanceMatrix),c.instanceColor!==null&&r.remove(c.instanceColor)}return{update:n,dispose:s}}var zh=class extends cr{constructor(e,t,r,i,a,n,s,o,l,c=$i){if(c!==$i&&c!==aa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&c===$i&&(r=Si),r===void 0&&c===aa&&(r=ia),super(null,i,a,n,s,o,c,r,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=s!==void 0?s:Wt,this.minFilter=o!==void 0?o:Wt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},kh=new cr,Pu=new zh(1,1),Bh=new bh,Hh=new Mf,Vh=new Ih,Lu=[],Du=[],Uu=new Float32Array(16),Nu=new Float32Array(9),Iu=new Float32Array(4);function ha(e,t,r){let i=e[0];if(i<=0||i>0)return e;let a=t*r,n=Lu[a];if(n===void 0&&(n=new Float32Array(a),Lu[a]=n),t!==0){i.toArray(n,0);for(let s=1,o=0;s!==t;++s)o+=r,e[s].toArray(n,o)}return n}function St(e,t){if(e.length!==t.length)return!1;for(let r=0,i=e.length;r<i;r++)if(e[r]!==t[r])return!1;return!0}function Et(e,t){for(let r=0,i=t.length;r<i;r++)e[r]=t[r]}function is(e,t){let r=Du[t];r===void 0&&(r=new Int32Array(t),Du[t]=r);for(let i=0;i!==t;++i)r[i]=e.allocateTextureUnit();return r}function O0(e,t){let r=this.cache;r[0]!==t&&(e.uniform1f(this.addr,t),r[0]=t)}function F0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),r[0]=t.x,r[1]=t.y);else{if(St(r,t))return;e.uniform2fv(this.addr,t),Et(r,t)}}function z0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),r[0]=t.x,r[1]=t.y,r[2]=t.z);else if(t.r!==void 0)(r[0]!==t.r||r[1]!==t.g||r[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),r[0]=t.r,r[1]=t.g,r[2]=t.b);else{if(St(r,t))return;e.uniform3fv(this.addr,t),Et(r,t)}}function k0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z||r[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=t.w);else{if(St(r,t))return;e.uniform4fv(this.addr,t),Et(r,t)}}function B0(e,t){let r=this.cache,i=t.elements;if(i===void 0){if(St(r,t))return;e.uniformMatrix2fv(this.addr,!1,t),Et(r,t)}else{if(St(r,i))return;Iu.set(i),e.uniformMatrix2fv(this.addr,!1,Iu),Et(r,i)}}function H0(e,t){let r=this.cache,i=t.elements;if(i===void 0){if(St(r,t))return;e.uniformMatrix3fv(this.addr,!1,t),Et(r,t)}else{if(St(r,i))return;Nu.set(i),e.uniformMatrix3fv(this.addr,!1,Nu),Et(r,i)}}function V0(e,t){let r=this.cache,i=t.elements;if(i===void 0){if(St(r,t))return;e.uniformMatrix4fv(this.addr,!1,t),Et(r,t)}else{if(St(r,i))return;Uu.set(i),e.uniformMatrix4fv(this.addr,!1,Uu),Et(r,i)}}function G0(e,t){let r=this.cache;r[0]!==t&&(e.uniform1i(this.addr,t),r[0]=t)}function W0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),r[0]=t.x,r[1]=t.y);else{if(St(r,t))return;e.uniform2iv(this.addr,t),Et(r,t)}}function X0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),r[0]=t.x,r[1]=t.y,r[2]=t.z);else{if(St(r,t))return;e.uniform3iv(this.addr,t),Et(r,t)}}function j0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z||r[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=t.w);else{if(St(r,t))return;e.uniform4iv(this.addr,t),Et(r,t)}}function q0(e,t){let r=this.cache;r[0]!==t&&(e.uniform1ui(this.addr,t),r[0]=t)}function Y0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),r[0]=t.x,r[1]=t.y);else{if(St(r,t))return;e.uniform2uiv(this.addr,t),Et(r,t)}}function Z0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),r[0]=t.x,r[1]=t.y,r[2]=t.z);else{if(St(r,t))return;e.uniform3uiv(this.addr,t),Et(r,t)}}function J0(e,t){let r=this.cache;if(t.x!==void 0)(r[0]!==t.x||r[1]!==t.y||r[2]!==t.z||r[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=t.w);else{if(St(r,t))return;e.uniform4uiv(this.addr,t),Et(r,t)}}function K0(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a);let n;this.type===e.SAMPLER_2D_SHADOW?(Pu.compareFunction=_h,n=Pu):n=kh,r.setTexture2D(t||n,a)}function $0(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),r.setTexture3D(t||Hh,a)}function Q0(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),r.setTextureCube(t||Vh,a)}function ev(e,t,r){let i=this.cache,a=r.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),r.setTexture2DArray(t||Bh,a)}function tv(e){switch(e){case 5126:return O0;case 35664:return F0;case 35665:return z0;case 35666:return k0;case 35674:return B0;case 35675:return H0;case 35676:return V0;case 5124:case 35670:return G0;case 35667:case 35671:return W0;case 35668:case 35672:return X0;case 35669:case 35673:return j0;case 5125:return q0;case 36294:return Y0;case 36295:return Z0;case 36296:return J0;case 35678:case 36198:case 36298:case 36306:case 35682:return K0;case 35679:case 36299:case 36307:return $0;case 35680:case 36300:case 36308:case 36293:return Q0;case 36289:case 36303:case 36311:case 36292:return ev}}function rv(e,t){e.uniform1fv(this.addr,t)}function iv(e,t){let r=ha(t,this.size,2);e.uniform2fv(this.addr,r)}function av(e,t){let r=ha(t,this.size,3);e.uniform3fv(this.addr,r)}function nv(e,t){let r=ha(t,this.size,4);e.uniform4fv(this.addr,r)}function sv(e,t){let r=ha(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,r)}function ov(e,t){let r=ha(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,r)}function lv(e,t){let r=ha(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,r)}function cv(e,t){e.uniform1iv(this.addr,t)}function uv(e,t){e.uniform2iv(this.addr,t)}function hv(e,t){e.uniform3iv(this.addr,t)}function dv(e,t){e.uniform4iv(this.addr,t)}function pv(e,t){e.uniform1uiv(this.addr,t)}function fv(e,t){e.uniform2uiv(this.addr,t)}function mv(e,t){e.uniform3uiv(this.addr,t)}function gv(e,t){e.uniform4uiv(this.addr,t)}function vv(e,t,r){let i=this.cache,a=t.length,n=is(r,a);St(i,n)||(e.uniform1iv(this.addr,n),Et(i,n));for(let s=0;s!==a;++s)r.setTexture2D(t[s]||kh,n[s])}function _v(e,t,r){let i=this.cache,a=t.length,n=is(r,a);St(i,n)||(e.uniform1iv(this.addr,n),Et(i,n));for(let s=0;s!==a;++s)r.setTexture3D(t[s]||Hh,n[s])}function xv(e,t,r){let i=this.cache,a=t.length,n=is(r,a);St(i,n)||(e.uniform1iv(this.addr,n),Et(i,n));for(let s=0;s!==a;++s)r.setTextureCube(t[s]||Vh,n[s])}function yv(e,t,r){let i=this.cache,a=t.length,n=is(r,a);St(i,n)||(e.uniform1iv(this.addr,n),Et(i,n));for(let s=0;s!==a;++s)r.setTexture2DArray(t[s]||Bh,n[s])}function Mv(e){switch(e){case 5126:return rv;case 35664:return iv;case 35665:return av;case 35666:return nv;case 35674:return sv;case 35675:return ov;case 35676:return lv;case 5124:case 35670:return cv;case 35667:case 35671:return uv;case 35668:case 35672:return hv;case 35669:case 35673:return dv;case 5125:return pv;case 36294:return fv;case 36295:return mv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return vv;case 35679:case 36299:case 36307:return _v;case 35680:case 36300:case 36308:case 36293:return xv;case 36289:case 36303:case 36311:case 36292:return yv}}var Sv=class{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=tv(t.type)}},Ev=class{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Mv(t.type)}},bv=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){let i=this.seq;for(let a=0,n=i.length;a!==n;++a){let s=i[a];s.setValue(e,t[s.id],r)}}},Eo=/(\w+)(\])?(\[|\.)?/g;function Ou(e,t){e.seq.push(t),e.map[t.id]=t}function Tv(e,t,r){let i=e.name,a=i.length;for(Eo.lastIndex=0;;){let n=Eo.exec(i),s=Eo.lastIndex,o=n[1],l=n[2]==="]",c=n[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===a){Ou(r,c===void 0?new Sv(o,e,t):new Ev(o,e,t));break}else{let u=r.map[o];u===void 0&&(u=new bv(o),Ou(r,u)),r=u}}}var Kn=class{constructor(e,t){this.seq=[],this.map={};let r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<r;++i){let a=e.getActiveUniform(t,i),n=e.getUniformLocation(t,a.name);Tv(a,n,this)}}setValue(e,t,r,i){let a=this.map[t];a!==void 0&&a.setValue(e,r,i)}setOptional(e,t,r){let i=t[r];i!==void 0&&this.setValue(e,r,i)}static upload(e,t,r,i){for(let a=0,n=t.length;a!==n;++a){let s=t[a],o=r[s.id];o.needsUpdate!==!1&&s.setValue(e,o.value,i)}}static seqWithValue(e,t){let r=[];for(let i=0,a=e.length;i!==a;++i){let n=e[i];n.id in t&&r.push(n)}return r}};function Fu(e,t,r){let i=e.createShader(t);return e.shaderSource(i,r),e.compileShader(i),i}var wv=37297,Av=0;function Cv(e,t){let r=e.split(`
`),i=[],a=Math.max(t-6,0),n=Math.min(t+6,r.length);for(let s=a;s<n;s++){let o=s+1;i.push(`${o===t?">":" "} ${o}: ${r[s]}`)}return i.join(`
`)}var zu=new We;function Rv(e){Ke._getMatrix(zu,Ke.workingColorSpace,e);let t=`mat3( ${zu.elements.map(r=>r.toFixed(4))} )`;switch(Ke.getTransfer(e)){case rs:return[t,"LinearTransferOETF"];case it:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function ku(e,t,r){let i=e.getShaderParameter(t,e.COMPILE_STATUS),a=e.getShaderInfoLog(t).trim();if(i&&a==="")return"";let n=/ERROR: 0:(\d+)/.exec(a);if(n){let s=parseInt(n[1]);return r.toUpperCase()+`

`+a+`

`+Cv(e.getShaderSource(t),s)}else return a}function Pv(e,t){let r=Rv(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${r[1]}( vec4( value.rgb * ${r[0]}, value.a ) );`,"}"].join(`
`)}function Lv(e,t){let r;switch(t){case qp:r="Linear";break;case Yp:r="Reinhard";break;case Zp:r="Cineon";break;case Jp:r="ACESFilmic";break;case $p:r="AgX";break;case Qp:r="Neutral";break;case Kp:r="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),r="Linear"}return"vec3 "+e+"( vec3 color ) { return "+r+"ToneMapping( color ); }"}var zn=new N;function Dv(){Ke.getLuminanceCoefficients(zn);let e=zn.x.toFixed(4),t=zn.y.toFixed(4),r=zn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${r} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Uv(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Va).join(`
`)}function Nv(e){let t=[];for(let r in e){let i=e[r];i!==!1&&t.push("#define "+r+" "+i)}return t.join(`
`)}function Iv(e,t){let r={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){let n=e.getActiveAttrib(t,a),s=n.name,o=1;n.type===e.FLOAT_MAT2&&(o=2),n.type===e.FLOAT_MAT3&&(o=3),n.type===e.FLOAT_MAT4&&(o=4),r[s]={type:n.type,location:e.getAttribLocation(t,s),locationSize:o}}return r}function Va(e){return e!==""}function Bu(e,t){let r=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,r).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Hu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ov=/^[ \t]*#include +<([\w\d./]+)>/gm;function xl(e){return e.replace(Ov,zv)}var Fv=new Map;function zv(e,t){let r=Ve[t];if(r===void 0){let i=Fv.get(t);if(i!==void 0)r=Ve[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return xl(r)}var kv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vu(e){return e.replace(kv,Bv)}function Bv(e,t,r,i){let a="";for(let n=parseInt(t);n<parseInt(r);n++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function Gu(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}function Hv(e){let t="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===ah?t="SHADOWMAP_TYPE_PCF":e.shadowMapType===wp?t="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===Cr&&(t="SHADOWMAP_TYPE_VSM"),t}function Vv(e){let t="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case ta:case ra:t="ENVMAP_TYPE_CUBE";break;case ts:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Gv(e){let t="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case ra:t="ENVMAP_MODE_REFRACTION";break}return t}function Wv(e){let t="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case nh:t="ENVMAP_BLENDING_MULTIPLY";break;case Xp:t="ENVMAP_BLENDING_MIX";break;case jp:t="ENVMAP_BLENDING_ADD";break}return t}function Xv(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let r=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,r),7*16)),texelHeight:i,maxMip:r}}function jv(e,t,r,i){let a=e.getContext(),n=r.defines,s=r.vertexShader,o=r.fragmentShader,l=Hv(r),c=Vv(r),u=Gv(r),h=Wv(r),d=Xv(r),p=Uv(r),v=Nv(n),g=a.createProgram(),m,f,b=r.glslVersion?"#version "+r.glslVersion+`
`:"";r.isRawShaderMaterial?(m=["#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v].filter(Va).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v].filter(Va).join(`
`),f.length>0&&(f+=`
`)):(m=[Gu(r),"#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v,r.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",r.batching?"#define USE_BATCHING":"",r.batchingColor?"#define USE_BATCHING_COLOR":"",r.instancing?"#define USE_INSTANCING":"",r.instancingColor?"#define USE_INSTANCING_COLOR":"",r.instancingMorph?"#define USE_INSTANCING_MORPH":"",r.useFog&&r.fog?"#define USE_FOG":"",r.useFog&&r.fogExp2?"#define FOG_EXP2":"",r.map?"#define USE_MAP":"",r.envMap?"#define USE_ENVMAP":"",r.envMap?"#define "+u:"",r.lightMap?"#define USE_LIGHTMAP":"",r.aoMap?"#define USE_AOMAP":"",r.bumpMap?"#define USE_BUMPMAP":"",r.normalMap?"#define USE_NORMALMAP":"",r.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",r.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",r.displacementMap?"#define USE_DISPLACEMENTMAP":"",r.emissiveMap?"#define USE_EMISSIVEMAP":"",r.anisotropy?"#define USE_ANISOTROPY":"",r.anisotropyMap?"#define USE_ANISOTROPYMAP":"",r.clearcoatMap?"#define USE_CLEARCOATMAP":"",r.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",r.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",r.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",r.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",r.specularMap?"#define USE_SPECULARMAP":"",r.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",r.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",r.roughnessMap?"#define USE_ROUGHNESSMAP":"",r.metalnessMap?"#define USE_METALNESSMAP":"",r.alphaMap?"#define USE_ALPHAMAP":"",r.alphaHash?"#define USE_ALPHAHASH":"",r.transmission?"#define USE_TRANSMISSION":"",r.transmissionMap?"#define USE_TRANSMISSIONMAP":"",r.thicknessMap?"#define USE_THICKNESSMAP":"",r.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",r.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",r.mapUv?"#define MAP_UV "+r.mapUv:"",r.alphaMapUv?"#define ALPHAMAP_UV "+r.alphaMapUv:"",r.lightMapUv?"#define LIGHTMAP_UV "+r.lightMapUv:"",r.aoMapUv?"#define AOMAP_UV "+r.aoMapUv:"",r.emissiveMapUv?"#define EMISSIVEMAP_UV "+r.emissiveMapUv:"",r.bumpMapUv?"#define BUMPMAP_UV "+r.bumpMapUv:"",r.normalMapUv?"#define NORMALMAP_UV "+r.normalMapUv:"",r.displacementMapUv?"#define DISPLACEMENTMAP_UV "+r.displacementMapUv:"",r.metalnessMapUv?"#define METALNESSMAP_UV "+r.metalnessMapUv:"",r.roughnessMapUv?"#define ROUGHNESSMAP_UV "+r.roughnessMapUv:"",r.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+r.anisotropyMapUv:"",r.clearcoatMapUv?"#define CLEARCOATMAP_UV "+r.clearcoatMapUv:"",r.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+r.clearcoatNormalMapUv:"",r.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+r.clearcoatRoughnessMapUv:"",r.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+r.iridescenceMapUv:"",r.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+r.iridescenceThicknessMapUv:"",r.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+r.sheenColorMapUv:"",r.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+r.sheenRoughnessMapUv:"",r.specularMapUv?"#define SPECULARMAP_UV "+r.specularMapUv:"",r.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+r.specularColorMapUv:"",r.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+r.specularIntensityMapUv:"",r.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+r.transmissionMapUv:"",r.thicknessMapUv?"#define THICKNESSMAP_UV "+r.thicknessMapUv:"",r.vertexTangents&&r.flatShading===!1?"#define USE_TANGENT":"",r.vertexColors?"#define USE_COLOR":"",r.vertexAlphas?"#define USE_COLOR_ALPHA":"",r.vertexUv1s?"#define USE_UV1":"",r.vertexUv2s?"#define USE_UV2":"",r.vertexUv3s?"#define USE_UV3":"",r.pointsUvs?"#define USE_POINTS_UV":"",r.flatShading?"#define FLAT_SHADED":"",r.skinning?"#define USE_SKINNING":"",r.morphTargets?"#define USE_MORPHTARGETS":"",r.morphNormals&&r.flatShading===!1?"#define USE_MORPHNORMALS":"",r.morphColors?"#define USE_MORPHCOLORS":"",r.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+r.morphTextureStride:"",r.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+r.morphTargetsCount:"",r.doubleSided?"#define DOUBLE_SIDED":"",r.flipSided?"#define FLIP_SIDED":"",r.shadowMapEnabled?"#define USE_SHADOWMAP":"",r.shadowMapEnabled?"#define "+l:"",r.sizeAttenuation?"#define USE_SIZEATTENUATION":"",r.numLightProbes>0?"#define USE_LIGHT_PROBES":"",r.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",r.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Va).join(`
`),f=[Gu(r),"#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,v,r.useFog&&r.fog?"#define USE_FOG":"",r.useFog&&r.fogExp2?"#define FOG_EXP2":"",r.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",r.map?"#define USE_MAP":"",r.matcap?"#define USE_MATCAP":"",r.envMap?"#define USE_ENVMAP":"",r.envMap?"#define "+c:"",r.envMap?"#define "+u:"",r.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",r.lightMap?"#define USE_LIGHTMAP":"",r.aoMap?"#define USE_AOMAP":"",r.bumpMap?"#define USE_BUMPMAP":"",r.normalMap?"#define USE_NORMALMAP":"",r.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",r.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",r.emissiveMap?"#define USE_EMISSIVEMAP":"",r.anisotropy?"#define USE_ANISOTROPY":"",r.anisotropyMap?"#define USE_ANISOTROPYMAP":"",r.clearcoat?"#define USE_CLEARCOAT":"",r.clearcoatMap?"#define USE_CLEARCOATMAP":"",r.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",r.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",r.dispersion?"#define USE_DISPERSION":"",r.iridescence?"#define USE_IRIDESCENCE":"",r.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",r.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",r.specularMap?"#define USE_SPECULARMAP":"",r.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",r.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",r.roughnessMap?"#define USE_ROUGHNESSMAP":"",r.metalnessMap?"#define USE_METALNESSMAP":"",r.alphaMap?"#define USE_ALPHAMAP":"",r.alphaTest?"#define USE_ALPHATEST":"",r.alphaHash?"#define USE_ALPHAHASH":"",r.sheen?"#define USE_SHEEN":"",r.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",r.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",r.transmission?"#define USE_TRANSMISSION":"",r.transmissionMap?"#define USE_TRANSMISSIONMAP":"",r.thicknessMap?"#define USE_THICKNESSMAP":"",r.vertexTangents&&r.flatShading===!1?"#define USE_TANGENT":"",r.vertexColors||r.instancingColor||r.batchingColor?"#define USE_COLOR":"",r.vertexAlphas?"#define USE_COLOR_ALPHA":"",r.vertexUv1s?"#define USE_UV1":"",r.vertexUv2s?"#define USE_UV2":"",r.vertexUv3s?"#define USE_UV3":"",r.pointsUvs?"#define USE_POINTS_UV":"",r.gradientMap?"#define USE_GRADIENTMAP":"",r.flatShading?"#define FLAT_SHADED":"",r.doubleSided?"#define DOUBLE_SIDED":"",r.flipSided?"#define FLIP_SIDED":"",r.shadowMapEnabled?"#define USE_SHADOWMAP":"",r.shadowMapEnabled?"#define "+l:"",r.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",r.numLightProbes>0?"#define USE_LIGHT_PROBES":"",r.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",r.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",r.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",r.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",r.toneMapping!==Zr?"#define TONE_MAPPING":"",r.toneMapping!==Zr?Ve.tonemapping_pars_fragment:"",r.toneMapping!==Zr?Lv("toneMapping",r.toneMapping):"",r.dithering?"#define DITHERING":"",r.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Pv("linearToOutputTexel",r.outputColorSpace),Dv(),r.useDepthPacking?"#define DEPTH_PACKING "+r.depthPacking:"",`
`].filter(Va).join(`
`)),s=xl(s),s=Bu(s,r),s=Hu(s,r),o=xl(o),o=Bu(o,r),o=Hu(o,r),s=Vu(s),o=Vu(o),r.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",r.glslVersion===ru?"":"layout(location = 0) out highp vec4 pc_fragColor;",r.glslVersion===ru?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let M=b+m+s,C=b+f+o,G=Fu(a,a.VERTEX_SHADER,M),E=Fu(a,a.FRAGMENT_SHADER,C);a.attachShader(g,G),a.attachShader(g,E),r.index0AttributeName!==void 0?a.bindAttribLocation(g,0,r.index0AttributeName):r.morphTargets===!0&&a.bindAttribLocation(g,0,"position"),a.linkProgram(g);function A(U){if(e.debug.checkShaderErrors){let H=a.getProgramInfoLog(g).trim(),q=a.getShaderInfoLog(G).trim(),Y=a.getShaderInfoLog(E).trim(),re=!0,Q=!0;if(a.getProgramParameter(g,a.LINK_STATUS)===!1)if(re=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(a,g,G,E);else{let oe=ku(a,G,"vertex"),ee=ku(a,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(g,a.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+H+`
`+oe+`
`+ee)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(q===""||Y==="")&&(Q=!1);Q&&(U.diagnostics={runnable:re,programLog:H,vertexShader:{log:q,prefix:m},fragmentShader:{log:Y,prefix:f}})}a.deleteShader(G),a.deleteShader(E),k=new Kn(a,g),y=Iv(a,g)}let k;this.getUniforms=function(){return k===void 0&&A(this),k};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let S=r.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=a.getProgramParameter(g,wv)),S},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(g),this.program=void 0},this.type=r.shaderType,this.name=r.shaderName,this.id=Av++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=G,this.fragmentShader=E,this}var qv=0,Yv=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,r=e.fragmentShader,i=this._getShaderStage(t),a=this._getShaderStage(r),n=this._getShaderCacheForMaterial(e);return n.has(i)===!1&&(n.add(i),i.usedTimes++),n.has(a)===!1&&(n.add(a),a.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){let t=this.shaderCache,r=t.get(e);return r===void 0&&(r=new Zv(e),t.set(e,r)),r}},Zv=class{constructor(e){this.id=qv++,this.code=e,this.usedTimes=0}};function Jv(e,t,r,i,a,n,s){let o=new Rl,l=new Yv,c=new Set,u=[],h=a.logarithmicDepthBuffer,d=a.vertexTextures,p=a.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,S,U,H,q){let Y=H.fog,re=q.geometry,Q=y.isMeshStandardMaterial?H.environment:null,oe=(y.isMeshStandardMaterial?r:t).get(y.envMap||Q),ee=oe&&oe.mapping===ts?oe.image.height:null,ue=v[y.type];y.precision!==null&&(p=a.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let _e=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,Be=_e!==void 0?_e.length:0,De=0;re.morphAttributes.position!==void 0&&(De=1),re.morphAttributes.normal!==void 0&&(De=2),re.morphAttributes.color!==void 0&&(De=3);let $,de,Te,Re;if(ue){let Ge=gr[ue];$=Ge.vertexShader,de=Ge.fragmentShader}else $=y.vertexShader,de=y.fragmentShader,l.update(y),Te=l.getVertexShaderID(y),Re=l.getFragmentShaderID(y);let me=e.getRenderTarget(),Ie=e.state.buffers.depth.getReversed(),rt=q.isInstancedMesh===!0,Xe=q.isBatchedMesh===!0,qe=!!y.map,vt=!!y.matcap,O=!!oe,dt=!!y.aoMap,$e=!!y.lightMap,et=!!y.bumpMap,ye=!!y.normalMap,tt=!!y.displacementMap,Pe=!!y.emissiveMap,Fe=!!y.metalnessMap,T=!!y.roughnessMap,_=y.anisotropy>0,B=y.clearcoat>0,ie=y.dispersion>0,se=y.iridescence>0,te=y.sheen>0,Le=y.transmission>0,ge=_&&!!y.anisotropyMap,Me=B&&!!y.clearcoatMap,ze=B&&!!y.clearcoatNormalMap,he=B&&!!y.clearcoatRoughnessMap,w=se&&!!y.iridescenceMap,L=se&&!!y.iridescenceThicknessMap,D=te&&!!y.sheenColorMap,z=te&&!!y.sheenRoughnessMap,J=!!y.specularMap,K=!!y.specularColorMap,pe=!!y.specularIntensityMap,R=Le&&!!y.transmissionMap,Z=Le&&!!y.thicknessMap,V=!!y.gradientMap,j=!!y.alphaMap,le=y.alphaTest>0,ae=!!y.alphaHash,Se=!!y.extensions,Ye=Zr;y.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(Ye=e.toneMapping);let Je={shaderID:ue,shaderType:y.type,shaderName:y.name,vertexShader:$,fragmentShader:de,defines:y.defines,customVertexShaderID:Te,customFragmentShaderID:Re,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Xe,batchingColor:Xe&&q._colorsTexture!==null,instancing:rt,instancingColor:rt&&q.instanceColor!==null,instancingMorph:rt&&q.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:me===null?e.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:sa,alphaToCoverage:!!y.alphaToCoverage,map:qe,matcap:vt,envMap:O,envMapMode:O&&oe.mapping,envMapCubeUVHeight:ee,aoMap:dt,lightMap:$e,bumpMap:et,normalMap:ye,displacementMap:d&&tt,emissiveMap:Pe,normalMapObjectSpace:ye&&y.normalMapType===af,normalMapTangentSpace:ye&&y.normalMapType===vh,metalnessMap:Fe,roughnessMap:T,anisotropy:_,anisotropyMap:ge,clearcoat:B,clearcoatMap:Me,clearcoatNormalMap:ze,clearcoatRoughnessMap:he,dispersion:ie,iridescence:se,iridescenceMap:w,iridescenceThicknessMap:L,sheen:te,sheenColorMap:D,sheenRoughnessMap:z,specularMap:J,specularColorMap:K,specularIntensityMap:pe,transmission:Le,transmissionMap:R,thicknessMap:Z,gradientMap:V,opaque:y.transparent===!1&&y.blending===Ki&&y.alphaToCoverage===!1,alphaMap:j,alphaTest:le,alphaHash:ae,combine:y.combine,mapUv:qe&&g(y.map.channel),aoMapUv:dt&&g(y.aoMap.channel),lightMapUv:$e&&g(y.lightMap.channel),bumpMapUv:et&&g(y.bumpMap.channel),normalMapUv:ye&&g(y.normalMap.channel),displacementMapUv:tt&&g(y.displacementMap.channel),emissiveMapUv:Pe&&g(y.emissiveMap.channel),metalnessMapUv:Fe&&g(y.metalnessMap.channel),roughnessMapUv:T&&g(y.roughnessMap.channel),anisotropyMapUv:ge&&g(y.anisotropyMap.channel),clearcoatMapUv:Me&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:ze&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:w&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:L&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:D&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:z&&g(y.sheenRoughnessMap.channel),specularMapUv:J&&g(y.specularMap.channel),specularColorMapUv:K&&g(y.specularColorMap.channel),specularIntensityMapUv:pe&&g(y.specularIntensityMap.channel),transmissionMapUv:R&&g(y.transmissionMap.channel),thicknessMapUv:Z&&g(y.thicknessMap.channel),alphaMapUv:j&&g(y.alphaMap.channel),vertexTangents:!!re.attributes.tangent&&(ye||_),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!re.attributes.uv&&(qe||j),fog:!!Y,useFog:y.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ie,skinning:q.isSkinnedMesh===!0,morphTargets:re.morphAttributes.position!==void 0,morphNormals:re.morphAttributes.normal!==void 0,morphColors:re.morphAttributes.color!==void 0,morphTargetsCount:Be,morphTextureStride:De,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:e.shadowMap.enabled&&U.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ye,decodeVideoTexture:qe&&y.map.isVideoTexture===!0&&Ke.getTransfer(y.map.colorSpace)===it,decodeVideoTextureEmissive:Pe&&y.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(y.emissiveMap.colorSpace)===it,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Rr,flipSided:y.side===Gt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Se&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&y.extensions.multiDraw===!0||Xe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Je.vertexUv1s=c.has(1),Je.vertexUv2s=c.has(2),Je.vertexUv3s=c.has(3),c.clear(),Je}function f(y){let S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(let U in y.defines)S.push(U),S.push(y.defines[U]);return y.isRawShaderMaterial===!1&&(b(S,y),M(S,y),S.push(e.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function b(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function M(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),y.push(o.mask)}function C(y){let S=v[y.type],U;if(S){let H=gr[S];U=Uf.clone(H.uniforms)}else U=y.uniforms;return U}function G(y,S){let U;for(let H=0,q=u.length;H<q;H++){let Y=u[H];if(Y.cacheKey===S){U=Y,++U.usedTimes;break}}return U===void 0&&(U=new jv(e,S,y,n),u.push(U)),U}function E(y){if(--y.usedTimes===0){let S=u.indexOf(y);u[S]=u[u.length-1],u.pop(),y.destroy()}}function A(y){l.remove(y)}function k(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:C,acquireProgram:G,releaseProgram:E,releaseShaderCache:A,programs:u,dispose:k}}function Kv(){let e=new WeakMap;function t(s){return e.has(s)}function r(s){let o=e.get(s);return o===void 0&&(o={},e.set(s,o)),o}function i(s){e.delete(s)}function a(s,o,l){e.get(s)[o]=l}function n(){e=new WeakMap}return{has:t,get:r,remove:i,update:a,dispose:n}}function $v(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function Wu(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Xu(){let e=[],t=0,r=[],i=[],a=[];function n(){t=0,r.length=0,i.length=0,a.length=0}function s(h,d,p,v,g,m){let f=e[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:v,renderOrder:h.renderOrder,z:g,group:m},e[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=v,f.renderOrder=h.renderOrder,f.z=g,f.group=m),t++,f}function o(h,d,p,v,g,m){let f=s(h,d,p,v,g,m);p.transmission>0?i.push(f):p.transparent===!0?a.push(f):r.push(f)}function l(h,d,p,v,g,m){let f=s(h,d,p,v,g,m);p.transmission>0?i.unshift(f):p.transparent===!0?a.unshift(f):r.unshift(f)}function c(h,d){r.length>1&&r.sort(h||$v),i.length>1&&i.sort(d||Wu),a.length>1&&a.sort(d||Wu)}function u(){for(let h=t,d=e.length;h<d;h++){let p=e[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:r,transmissive:i,transparent:a,init:n,push:o,unshift:l,finish:u,sort:c}}function Qv(){let e=new WeakMap;function t(i,a){let n=e.get(i),s;return n===void 0?(s=new Xu,e.set(i,[s])):a>=n.length?(s=new Xu,n.push(s)):s=n[a],s}function r(){e=new WeakMap}return{get:t,dispose:r}}function e_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let r;switch(t.type){case"DirectionalLight":r={direction:new N,color:new je};break;case"SpotLight":r={position:new N,direction:new N,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":r={position:new N,color:new je,distance:0,decay:0};break;case"HemisphereLight":r={direction:new N,skyColor:new je,groundColor:new je};break;case"RectAreaLight":r={color:new je,position:new N,halfWidth:new N,halfHeight:new N};break}return e[t.id]=r,r}}}function t_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let r;switch(t.type){case"DirectionalLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"SpotLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"PointLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=r,r}}}var r_=0;function i_(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function a_(e){let t=new e_,r=t_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);let a=new N,n=new lt,s=new lt;function o(c){let u=0,h=0,d=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let p=0,v=0,g=0,m=0,f=0,b=0,M=0,C=0,G=0,E=0,A=0;c.sort(i_);for(let y=0,S=c.length;y<S;y++){let U=c[y],H=U.color,q=U.intensity,Y=U.distance,re=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)u+=H.r*q,h+=H.g*q,d+=H.b*q;else if(U.isLightProbe){for(let Q=0;Q<9;Q++)i.probe[Q].addScaledVector(U.sh.coefficients[Q],q);A++}else if(U.isDirectionalLight){let Q=t.get(U);if(Q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let oe=U.shadow,ee=r.get(U);ee.shadowIntensity=oe.intensity,ee.shadowBias=oe.bias,ee.shadowNormalBias=oe.normalBias,ee.shadowRadius=oe.radius,ee.shadowMapSize=oe.mapSize,i.directionalShadow[p]=ee,i.directionalShadowMap[p]=re,i.directionalShadowMatrix[p]=U.shadow.matrix,b++}i.directional[p]=Q,p++}else if(U.isSpotLight){let Q=t.get(U);Q.position.setFromMatrixPosition(U.matrixWorld),Q.color.copy(H).multiplyScalar(q),Q.distance=Y,Q.coneCos=Math.cos(U.angle),Q.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),Q.decay=U.decay,i.spot[g]=Q;let oe=U.shadow;if(U.map&&(i.spotLightMap[G]=U.map,G++,oe.updateMatrices(U),U.castShadow&&E++),i.spotLightMatrix[g]=oe.matrix,U.castShadow){let ee=r.get(U);ee.shadowIntensity=oe.intensity,ee.shadowBias=oe.bias,ee.shadowNormalBias=oe.normalBias,ee.shadowRadius=oe.radius,ee.shadowMapSize=oe.mapSize,i.spotShadow[g]=ee,i.spotShadowMap[g]=re,C++}g++}else if(U.isRectAreaLight){let Q=t.get(U);Q.color.copy(H).multiplyScalar(q),Q.halfWidth.set(U.width*.5,0,0),Q.halfHeight.set(0,U.height*.5,0),i.rectArea[m]=Q,m++}else if(U.isPointLight){let Q=t.get(U);if(Q.color.copy(U.color).multiplyScalar(U.intensity),Q.distance=U.distance,Q.decay=U.decay,U.castShadow){let oe=U.shadow,ee=r.get(U);ee.shadowIntensity=oe.intensity,ee.shadowBias=oe.bias,ee.shadowNormalBias=oe.normalBias,ee.shadowRadius=oe.radius,ee.shadowMapSize=oe.mapSize,ee.shadowCameraNear=oe.camera.near,ee.shadowCameraFar=oe.camera.far,i.pointShadow[v]=ee,i.pointShadowMap[v]=re,i.pointShadowMatrix[v]=U.shadow.matrix,M++}i.point[v]=Q,v++}else if(U.isHemisphereLight){let Q=t.get(U);Q.skyColor.copy(U.color).multiplyScalar(q),Q.groundColor.copy(U.groundColor).multiplyScalar(q),i.hemi[f]=Q,f++}}m>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=fe.LTC_FLOAT_1,i.rectAreaLTC2=fe.LTC_FLOAT_2):(i.rectAreaLTC1=fe.LTC_HALF_1,i.rectAreaLTC2=fe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;let k=i.hash;(k.directionalLength!==p||k.pointLength!==v||k.spotLength!==g||k.rectAreaLength!==m||k.hemiLength!==f||k.numDirectionalShadows!==b||k.numPointShadows!==M||k.numSpotShadows!==C||k.numSpotMaps!==G||k.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=g,i.rectArea.length=m,i.point.length=v,i.hemi.length=f,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=C,i.spotShadowMap.length=C,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=C+G-E,i.spotLightMap.length=G,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,k.directionalLength=p,k.pointLength=v,k.spotLength=g,k.rectAreaLength=m,k.hemiLength=f,k.numDirectionalShadows=b,k.numPointShadows=M,k.numSpotShadows=C,k.numSpotMaps=G,k.numLightProbes=A,i.version=r_++)}function l(c,u){let h=0,d=0,p=0,v=0,g=0,m=u.matrixWorldInverse;for(let f=0,b=c.length;f<b;f++){let M=c[f];if(M.isDirectionalLight){let C=i.directional[h];C.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(m),h++}else if(M.isSpotLight){let C=i.spot[p];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),C.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(m),p++}else if(M.isRectAreaLight){let C=i.rectArea[v];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),s.identity(),n.copy(M.matrixWorld),n.premultiply(m),s.extractRotation(n),C.halfWidth.set(M.width*.5,0,0),C.halfHeight.set(0,M.height*.5,0),C.halfWidth.applyMatrix4(s),C.halfHeight.applyMatrix4(s),v++}else if(M.isPointLight){let C=i.point[d];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){let C=i.hemi[g];C.direction.setFromMatrixPosition(M.matrixWorld),C.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:i}}function ju(e){let t=new a_(e),r=[],i=[];function a(u){c.camera=u,r.length=0,i.length=0}function n(u){r.push(u)}function s(u){i.push(u)}function o(){t.setup(r)}function l(u){t.setupView(r,u)}let c={lightsArray:r,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:o,setupLightsView:l,pushLight:n,pushShadow:s}}function n_(e){let t=new WeakMap;function r(a,n=0){let s=t.get(a),o;return s===void 0?(o=new ju(e),t.set(a,[o])):n>=s.length?(o=new ju(e),s.push(o)):o=s[n],o}function i(){t=new WeakMap}return{get:r,dispose:i}}var s_=class extends ca{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=tf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},o_=class extends ca{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},l_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,c_=`uniform sampler2D shadow_pass;
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
}`;function u_(e,t,r){let i=new Pl,a=new ve,n=new ve,s=new yt,o=new s_({depthPacking:rf}),l=new o_,c={},u=r.maxTextureSize,h={[Kr]:Gt,[Gt]:Kr,[Rr]:Rr},d=new $r({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ve},radius:{value:4}},vertexShader:l_,fragmentShader:c_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let v=new Kt;v.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new mt(v,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ah;let f=this.type;this.render=function(E,A,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let y=e.getRenderTarget(),S=e.getActiveCubeFace(),U=e.getActiveMipmapLevel(),H=e.state;H.setBlending(Yr),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);let q=f!==Cr&&this.type===Cr,Y=f===Cr&&this.type!==Cr;for(let re=0,Q=E.length;re<Q;re++){let oe=E[re],ee=oe.shadow;if(ee===void 0){console.warn("THREE.WebGLShadowMap:",oe,"has no shadow.");continue}if(ee.autoUpdate===!1&&ee.needsUpdate===!1)continue;a.copy(ee.mapSize);let ue=ee.getFrameExtents();if(a.multiply(ue),n.copy(ee.mapSize),(a.x>u||a.y>u)&&(a.x>u&&(n.x=Math.floor(u/ue.x),a.x=n.x*ue.x,ee.mapSize.x=n.x),a.y>u&&(n.y=Math.floor(u/ue.y),a.y=n.y*ue.y,ee.mapSize.y=n.y)),ee.map===null||q===!0||Y===!0){let Be=this.type!==Cr?{minFilter:Wt,magFilter:Wt}:{};ee.map!==null&&ee.map.dispose(),ee.map=new Ei(a.x,a.y,Be),ee.map.texture.name=oe.name+".shadowMap",ee.camera.updateProjectionMatrix()}e.setRenderTarget(ee.map),e.clear();let _e=ee.getViewportCount();for(let Be=0;Be<_e;Be++){let De=ee.getViewport(Be);s.set(n.x*De.x,n.y*De.y,n.x*De.z,n.y*De.w),H.viewport(s),ee.updateMatrices(oe,Be),i=ee.getFrustum(),C(A,k,ee.camera,oe,this.type)}ee.isPointLightShadow!==!0&&this.type===Cr&&b(ee,k),ee.needsUpdate=!1}f=this.type,m.needsUpdate=!1,e.setRenderTarget(y,S,U)};function b(E,A){let k=t.update(g);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ei(a.x,a.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,e.setRenderTarget(E.mapPass),e.clear(),e.renderBufferDirect(A,null,k,d,g,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,e.setRenderTarget(E.map),e.clear(),e.renderBufferDirect(A,null,k,p,g,null)}function M(E,A,k,y){let S=null,U=k.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(U!==void 0)S=U;else if(S=k.isPointLight===!0?l:o,e.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let H=S.uuid,q=A.uuid,Y=c[H];Y===void 0&&(Y={},c[H]=Y);let re=Y[q];re===void 0&&(re=S.clone(),Y[q]=re,A.addEventListener("dispose",G)),S=re}if(S.visible=A.visible,S.wireframe=A.wireframe,y===Cr?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:h[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,k.isPointLight===!0&&S.isMeshDistanceMaterial===!0){let H=e.properties.get(S);H.light=k}return S}function C(E,A,k,y,S){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===Cr)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld);let H=t.update(E),q=E.material;if(Array.isArray(q)){let Y=H.groups;for(let re=0,Q=Y.length;re<Q;re++){let oe=Y[re],ee=q[oe.materialIndex];if(ee&&ee.visible){let ue=M(E,ee,y,S);E.onBeforeShadow(e,E,A,k,H,ue,oe),e.renderBufferDirect(k,null,H,ue,E,oe),E.onAfterShadow(e,E,A,k,H,ue,oe)}}}else if(q.visible){let Y=M(E,q,y,S);E.onBeforeShadow(e,E,A,k,H,Y,null),e.renderBufferDirect(k,null,H,Y,E,null),E.onAfterShadow(e,E,A,k,H,Y,null)}}let U=E.children;for(let H=0,q=U.length;H<q;H++)C(U[H],A,k,y,S)}function G(E){E.target.removeEventListener("dispose",G);for(let A in c){let k=c[A],y=E.target.uuid;y in k&&(k[y].dispose(),delete k[y])}}}var h_={[Do]:Uo,[No]:Fo,[Io]:zo,[ea]:Oo,[Uo]:Do,[Fo]:No,[zo]:Io,[Oo]:ea};function d_(e,t){function r(){let R=!1,Z=new yt,V=null,j=new yt(0,0,0,0);return{setMask:function(le){V!==le&&!R&&(e.colorMask(le,le,le,le),V=le)},setLocked:function(le){R=le},setClear:function(le,ae,Se,Ye,Je){Je===!0&&(le*=Ye,ae*=Ye,Se*=Ye),Z.set(le,ae,Se,Ye),j.equals(Z)===!1&&(e.clearColor(le,ae,Se,Ye),j.copy(Z))},reset:function(){R=!1,V=null,j.set(-1,0,0,0)}}}function i(){let R=!1,Z=!1,V=null,j=null,le=null;return{setReversed:function(ae){if(Z!==ae){let Se=t.get("EXT_clip_control");Z?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT);let Ye=le;le=null,this.setClear(Ye)}Z=ae},getReversed:function(){return Z},setTest:function(ae){ae?me(e.DEPTH_TEST):Ie(e.DEPTH_TEST)},setMask:function(ae){V!==ae&&!R&&(e.depthMask(ae),V=ae)},setFunc:function(ae){if(Z&&(ae=h_[ae]),j!==ae){switch(ae){case Do:e.depthFunc(e.NEVER);break;case Uo:e.depthFunc(e.ALWAYS);break;case No:e.depthFunc(e.LESS);break;case ea:e.depthFunc(e.LEQUAL);break;case Io:e.depthFunc(e.EQUAL);break;case Oo:e.depthFunc(e.GEQUAL);break;case Fo:e.depthFunc(e.GREATER);break;case zo:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}j=ae}},setLocked:function(ae){R=ae},setClear:function(ae){le!==ae&&(Z&&(ae=1-ae),e.clearDepth(ae),le=ae)},reset:function(){R=!1,V=null,j=null,le=null,Z=!1}}}function a(){let R=!1,Z=null,V=null,j=null,le=null,ae=null,Se=null,Ye=null,Je=null;return{setTest:function(Ge){R||(Ge?me(e.STENCIL_TEST):Ie(e.STENCIL_TEST))},setMask:function(Ge){Z!==Ge&&!R&&(e.stencilMask(Ge),Z=Ge)},setFunc:function(Ge,qt,At){(V!==Ge||j!==qt||le!==At)&&(e.stencilFunc(Ge,qt,At),V=Ge,j=qt,le=At)},setOp:function(Ge,qt,At){(ae!==Ge||Se!==qt||Ye!==At)&&(e.stencilOp(Ge,qt,At),ae=Ge,Se=qt,Ye=At)},setLocked:function(Ge){R=Ge},setClear:function(Ge){Je!==Ge&&(e.clearStencil(Ge),Je=Ge)},reset:function(){R=!1,Z=null,V=null,j=null,le=null,ae=null,Se=null,Ye=null,Je=null}}}let n=new r,s=new i,o=new a,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,p=[],v=null,g=!1,m=null,f=null,b=null,M=null,C=null,G=null,E=null,A=new je(0,0,0),k=0,y=!1,S=null,U=null,H=null,q=null,Y=null,re=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Q=!1,oe=0,ee=e.getParameter(e.VERSION);ee.indexOf("WebGL")!==-1?(oe=parseFloat(/^WebGL (\d)/.exec(ee)[1]),Q=oe>=1):ee.indexOf("OpenGL ES")!==-1&&(oe=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),Q=oe>=2);let ue=null,_e={},Be=e.getParameter(e.SCISSOR_BOX),De=e.getParameter(e.VIEWPORT),$=new yt().fromArray(Be),de=new yt().fromArray(De);function Te(R,Z,V,j){let le=new Uint8Array(4),ae=e.createTexture();e.bindTexture(R,ae),e.texParameteri(R,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(R,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Se=0;Se<V;Se++)R===e.TEXTURE_3D||R===e.TEXTURE_2D_ARRAY?e.texImage3D(Z,0,e.RGBA,1,1,j,0,e.RGBA,e.UNSIGNED_BYTE,le):e.texImage2D(Z+Se,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,le);return ae}let Re={};Re[e.TEXTURE_2D]=Te(e.TEXTURE_2D,e.TEXTURE_2D,1),Re[e.TEXTURE_CUBE_MAP]=Te(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Re[e.TEXTURE_2D_ARRAY]=Te(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Re[e.TEXTURE_3D]=Te(e.TEXTURE_3D,e.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),me(e.DEPTH_TEST),s.setFunc(ea),et(!1),ye(Yc),me(e.CULL_FACE),dt(Yr);function me(R){u[R]!==!0&&(e.enable(R),u[R]=!0)}function Ie(R){u[R]!==!1&&(e.disable(R),u[R]=!1)}function rt(R,Z){return h[R]!==Z?(e.bindFramebuffer(R,Z),h[R]=Z,R===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=Z),R===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=Z),!0):!1}function Xe(R,Z){let V=p,j=!1;if(R){V=d.get(Z),V===void 0&&(V=[],d.set(Z,V));let le=R.textures;if(V.length!==le.length||V[0]!==e.COLOR_ATTACHMENT0){for(let ae=0,Se=le.length;ae<Se;ae++)V[ae]=e.COLOR_ATTACHMENT0+ae;V.length=le.length,j=!0}}else V[0]!==e.BACK&&(V[0]=e.BACK,j=!0);j&&e.drawBuffers(V)}function qe(R){return v!==R?(e.useProgram(R),v=R,!0):!1}let vt={[_i]:e.FUNC_ADD,[Cp]:e.FUNC_SUBTRACT,[Rp]:e.FUNC_REVERSE_SUBTRACT};vt[Pp]=e.MIN,vt[Lp]=e.MAX;let O={[Dp]:e.ZERO,[Up]:e.ONE,[Np]:e.SRC_COLOR,[Po]:e.SRC_ALPHA,[Bp]:e.SRC_ALPHA_SATURATE,[zp]:e.DST_COLOR,[Op]:e.DST_ALPHA,[Ip]:e.ONE_MINUS_SRC_COLOR,[Lo]:e.ONE_MINUS_SRC_ALPHA,[kp]:e.ONE_MINUS_DST_COLOR,[Fp]:e.ONE_MINUS_DST_ALPHA,[Hp]:e.CONSTANT_COLOR,[Vp]:e.ONE_MINUS_CONSTANT_COLOR,[Gp]:e.CONSTANT_ALPHA,[Wp]:e.ONE_MINUS_CONSTANT_ALPHA};function dt(R,Z,V,j,le,ae,Se,Ye,Je,Ge){if(R===Yr){g===!0&&(Ie(e.BLEND),g=!1);return}if(g===!1&&(me(e.BLEND),g=!0),R!==Ap){if(R!==m||Ge!==y){if((f!==_i||C!==_i)&&(e.blendEquation(e.FUNC_ADD),f=_i,C=_i),Ge)switch(R){case Ki:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Zc:e.blendFunc(e.ONE,e.ONE);break;case Jc:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Kc:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}else switch(R){case Ki:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Zc:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case Jc:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Kc:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}b=null,M=null,G=null,E=null,A.set(0,0,0),k=0,m=R,y=Ge}return}le=le||Z,ae=ae||V,Se=Se||j,(Z!==f||le!==C)&&(e.blendEquationSeparate(vt[Z],vt[le]),f=Z,C=le),(V!==b||j!==M||ae!==G||Se!==E)&&(e.blendFuncSeparate(O[V],O[j],O[ae],O[Se]),b=V,M=j,G=ae,E=Se),(Ye.equals(A)===!1||Je!==k)&&(e.blendColor(Ye.r,Ye.g,Ye.b,Je),A.copy(Ye),k=Je),m=R,y=!1}function $e(R,Z){R.side===Rr?Ie(e.CULL_FACE):me(e.CULL_FACE);let V=R.side===Gt;Z&&(V=!V),et(V),R.blending===Ki&&R.transparent===!1?dt(Yr):dt(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),s.setFunc(R.depthFunc),s.setTest(R.depthTest),s.setMask(R.depthWrite),n.setMask(R.colorWrite);let j=R.stencilWrite;o.setTest(j),j&&(o.setMask(R.stencilWriteMask),o.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),o.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),Pe(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?me(e.SAMPLE_ALPHA_TO_COVERAGE):Ie(e.SAMPLE_ALPHA_TO_COVERAGE)}function et(R){S!==R&&(R?e.frontFace(e.CW):e.frontFace(e.CCW),S=R)}function ye(R){R!==bp?(me(e.CULL_FACE),R!==U&&(R===Yc?e.cullFace(e.BACK):R===Tp?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Ie(e.CULL_FACE),U=R}function tt(R){R!==H&&(Q&&e.lineWidth(R),H=R)}function Pe(R,Z,V){R?(me(e.POLYGON_OFFSET_FILL),(q!==Z||Y!==V)&&(e.polygonOffset(Z,V),q=Z,Y=V)):Ie(e.POLYGON_OFFSET_FILL)}function Fe(R){R?me(e.SCISSOR_TEST):Ie(e.SCISSOR_TEST)}function T(R){R===void 0&&(R=e.TEXTURE0+re-1),ue!==R&&(e.activeTexture(R),ue=R)}function _(R,Z,V){V===void 0&&(ue===null?V=e.TEXTURE0+re-1:V=ue);let j=_e[V];j===void 0&&(j={type:void 0,texture:void 0},_e[V]=j),(j.type!==R||j.texture!==Z)&&(ue!==V&&(e.activeTexture(V),ue=V),e.bindTexture(R,Z||Re[R]),j.type=R,j.texture=Z)}function B(){let R=_e[ue];R!==void 0&&R.type!==void 0&&(e.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function ie(){try{e.compressedTexImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function se(){try{e.compressedTexImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function te(){try{e.texSubImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function Le(){try{e.texSubImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ge(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function Me(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ze(){try{e.texStorage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function he(){try{e.texStorage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function w(){try{e.texImage2D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function L(){try{e.texImage3D.apply(e,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function D(R){$.equals(R)===!1&&(e.scissor(R.x,R.y,R.z,R.w),$.copy(R))}function z(R){de.equals(R)===!1&&(e.viewport(R.x,R.y,R.z,R.w),de.copy(R))}function J(R,Z){let V=c.get(Z);V===void 0&&(V=new WeakMap,c.set(Z,V));let j=V.get(R);j===void 0&&(j=e.getUniformBlockIndex(Z,R.name),V.set(R,j))}function K(R,Z){let V=c.get(Z).get(R);l.get(Z)!==V&&(e.uniformBlockBinding(Z,V,R.__bindingPointIndex),l.set(Z,V))}function pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),s.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},ue=null,_e={},h={},d=new WeakMap,p=[],v=null,g=!1,m=null,f=null,b=null,M=null,C=null,G=null,E=null,A=new je(0,0,0),k=0,y=!1,S=null,U=null,H=null,q=null,Y=null,$.set(0,0,e.canvas.width,e.canvas.height),de.set(0,0,e.canvas.width,e.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:me,disable:Ie,bindFramebuffer:rt,drawBuffers:Xe,useProgram:qe,setBlending:dt,setMaterial:$e,setFlipSided:et,setCullFace:ye,setLineWidth:tt,setPolygonOffset:Pe,setScissorTest:Fe,activeTexture:T,bindTexture:_,unbindTexture:B,compressedTexImage2D:ie,compressedTexImage3D:se,texImage2D:w,texImage3D:L,updateUBOMapping:J,uniformBlockBinding:K,texStorage2D:ze,texStorage3D:he,texSubImage2D:te,texSubImage3D:Le,compressedTexSubImage2D:ge,compressedTexSubImage3D:Me,scissor:D,viewport:z,reset:pe}}function qu(e,t,r,i){let a=p_(i);switch(r){case uh:return e*t;case dh:return e*t;case ph:return e*t*2;case fh:return e*t/a.components*a.byteLength;case Tl:return e*t/a.components*a.byteLength;case mh:return e*t*2/a.components*a.byteLength;case wl:return e*t*2/a.components*a.byteLength;case hh:return e*t*3/a.components*a.byteLength;case lr:return e*t*4/a.components*a.byteLength;case Al:return e*t*4/a.components*a.byteLength;case Wn:case Xn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case jn:case qn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Wo:case jo:return Math.max(e,16)*Math.max(t,8)/4;case Go:case Xo:return Math.max(e,8)*Math.max(t,8)/2;case qo:case Yo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Zo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Jo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ko:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case $o:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Qo:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case el:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case tl:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case rl:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case il:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case al:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case nl:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case sl:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case ol:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case ll:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case cl:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Yn:case ul:case hl:return Math.ceil(e/4)*Math.ceil(t/4)*16;case gh:case dl:return Math.ceil(e/4)*Math.ceil(t/4)*8;case pl:case fl:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${r} format.`)}function p_(e){switch(e){case Ur:case oh:return{byteLength:1,components:1};case Xa:case lh:case ja:return{byteLength:2,components:1};case El:case bl:return{byteLength:2,components:4};case Si:case Sl:case Pr:return{byteLength:4,components:1};case ch:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}function f_(e,t,r,i,a,n,s){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ve,u=new WeakMap,h,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,_){return p?new OffscreenCanvas(T,_):es("canvas")}function g(T,_,B){let ie=1,se=Fe(T);if((se.width>B||se.height>B)&&(ie=B/Math.max(se.width,se.height)),ie<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let te=Math.floor(ie*se.width),Le=Math.floor(ie*se.height);h===void 0&&(h=v(te,Le));let ge=_?v(te,Le):h;return ge.width=te,ge.height=Le,ge.getContext("2d").drawImage(T,0,0,te,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+te+"x"+Le+")."),ge}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){e.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?e.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function M(T,_,B,ie,se=!1){if(T!==null){if(e[T]!==void 0)return e[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let te=_;if(_===e.RED&&(B===e.FLOAT&&(te=e.R32F),B===e.HALF_FLOAT&&(te=e.R16F),B===e.UNSIGNED_BYTE&&(te=e.R8)),_===e.RED_INTEGER&&(B===e.UNSIGNED_BYTE&&(te=e.R8UI),B===e.UNSIGNED_SHORT&&(te=e.R16UI),B===e.UNSIGNED_INT&&(te=e.R32UI),B===e.BYTE&&(te=e.R8I),B===e.SHORT&&(te=e.R16I),B===e.INT&&(te=e.R32I)),_===e.RG&&(B===e.FLOAT&&(te=e.RG32F),B===e.HALF_FLOAT&&(te=e.RG16F),B===e.UNSIGNED_BYTE&&(te=e.RG8)),_===e.RG_INTEGER&&(B===e.UNSIGNED_BYTE&&(te=e.RG8UI),B===e.UNSIGNED_SHORT&&(te=e.RG16UI),B===e.UNSIGNED_INT&&(te=e.RG32UI),B===e.BYTE&&(te=e.RG8I),B===e.SHORT&&(te=e.RG16I),B===e.INT&&(te=e.RG32I)),_===e.RGB_INTEGER&&(B===e.UNSIGNED_BYTE&&(te=e.RGB8UI),B===e.UNSIGNED_SHORT&&(te=e.RGB16UI),B===e.UNSIGNED_INT&&(te=e.RGB32UI),B===e.BYTE&&(te=e.RGB8I),B===e.SHORT&&(te=e.RGB16I),B===e.INT&&(te=e.RGB32I)),_===e.RGBA_INTEGER&&(B===e.UNSIGNED_BYTE&&(te=e.RGBA8UI),B===e.UNSIGNED_SHORT&&(te=e.RGBA16UI),B===e.UNSIGNED_INT&&(te=e.RGBA32UI),B===e.BYTE&&(te=e.RGBA8I),B===e.SHORT&&(te=e.RGBA16I),B===e.INT&&(te=e.RGBA32I)),_===e.RGB&&B===e.UNSIGNED_INT_5_9_9_9_REV&&(te=e.RGB9_E5),_===e.RGBA){let Le=se?rs:Ke.getTransfer(ie);B===e.FLOAT&&(te=e.RGBA32F),B===e.HALF_FLOAT&&(te=e.RGBA16F),B===e.UNSIGNED_BYTE&&(te=Le===it?e.SRGB8_ALPHA8:e.RGBA8),B===e.UNSIGNED_SHORT_4_4_4_4&&(te=e.RGBA4),B===e.UNSIGNED_SHORT_5_5_5_1&&(te=e.RGB5_A1)}return(te===e.R16F||te===e.R32F||te===e.RG16F||te===e.RG32F||te===e.RGBA16F||te===e.RGBA32F)&&t.get("EXT_color_buffer_float"),te}function C(T,_){let B;return T?_===null||_===Si||_===ia?B=e.DEPTH24_STENCIL8:_===Pr?B=e.DEPTH32F_STENCIL8:_===Xa&&(B=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Si||_===ia?B=e.DEPTH_COMPONENT24:_===Pr?B=e.DEPTH_COMPONENT32F:_===Xa&&(B=e.DEPTH_COMPONENT16),B}function G(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Wt&&T.minFilter!==xr?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function E(T){let _=T.target;_.removeEventListener("dispose",E),k(_),_.isVideoTexture&&u.delete(_)}function A(T){let _=T.target;_.removeEventListener("dispose",A),S(_)}function k(T){let _=i.get(T);if(_.__webglInit===void 0)return;let B=T.source,ie=d.get(B);if(ie){let se=ie[_.__cacheKey];se.usedTimes--,se.usedTimes===0&&y(T),Object.keys(ie).length===0&&d.delete(B)}i.remove(T)}function y(T){let _=i.get(T);e.deleteTexture(_.__webglTexture);let B=T.source,ie=d.get(B);delete ie[_.__cacheKey],s.memory.textures--}function S(T){let _=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray(_.__webglFramebuffer[ie]))for(let se=0;se<_.__webglFramebuffer[ie].length;se++)e.deleteFramebuffer(_.__webglFramebuffer[ie][se]);else e.deleteFramebuffer(_.__webglFramebuffer[ie]);_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer[ie])}else{if(Array.isArray(_.__webglFramebuffer))for(let ie=0;ie<_.__webglFramebuffer.length;ie++)e.deleteFramebuffer(_.__webglFramebuffer[ie]);else e.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&e.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let ie=0;ie<_.__webglColorRenderbuffer.length;ie++)_.__webglColorRenderbuffer[ie]&&e.deleteRenderbuffer(_.__webglColorRenderbuffer[ie]);_.__webglDepthRenderbuffer&&e.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let B=T.textures;for(let ie=0,se=B.length;ie<se;ie++){let te=i.get(B[ie]);te.__webglTexture&&(e.deleteTexture(te.__webglTexture),s.memory.textures--),i.remove(B[ie])}i.remove(T)}let U=0;function H(){U=0}function q(){let T=U;return T>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+a.maxTextures),U+=1,T}function Y(T){let _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function re(T,_){let B=i.get(T);if(T.isVideoTexture&&tt(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){let ie=T.image;if(ie===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{de(B,T,_);return}}r.bindTexture(e.TEXTURE_2D,B.__webglTexture,e.TEXTURE0+_)}function Q(T,_){let B=i.get(T);if(T.version>0&&B.__version!==T.version){de(B,T,_);return}r.bindTexture(e.TEXTURE_2D_ARRAY,B.__webglTexture,e.TEXTURE0+_)}function oe(T,_){let B=i.get(T);if(T.version>0&&B.__version!==T.version){de(B,T,_);return}r.bindTexture(e.TEXTURE_3D,B.__webglTexture,e.TEXTURE0+_)}function ee(T,_){let B=i.get(T);if(T.version>0&&B.__version!==T.version){Te(B,T,_);return}r.bindTexture(e.TEXTURE_CUBE_MAP,B.__webglTexture,e.TEXTURE0+_)}let ue={[Ho]:e.REPEAT,[yi]:e.CLAMP_TO_EDGE,[Vo]:e.MIRRORED_REPEAT},_e={[Wt]:e.NEAREST,[ef]:e.NEAREST_MIPMAP_NEAREST,[_n]:e.NEAREST_MIPMAP_LINEAR,[xr]:e.LINEAR,[qs]:e.LINEAR_MIPMAP_NEAREST,[Mi]:e.LINEAR_MIPMAP_LINEAR},Be={[nf]:e.NEVER,[hf]:e.ALWAYS,[sf]:e.LESS,[_h]:e.LEQUAL,[of]:e.EQUAL,[uf]:e.GEQUAL,[lf]:e.GREATER,[cf]:e.NOTEQUAL};function De(T,_){if(_.type===Pr&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===xr||_.magFilter===qs||_.magFilter===_n||_.magFilter===Mi||_.minFilter===xr||_.minFilter===qs||_.minFilter===_n||_.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(T,e.TEXTURE_WRAP_S,ue[_.wrapS]),e.texParameteri(T,e.TEXTURE_WRAP_T,ue[_.wrapT]),(T===e.TEXTURE_3D||T===e.TEXTURE_2D_ARRAY)&&e.texParameteri(T,e.TEXTURE_WRAP_R,ue[_.wrapR]),e.texParameteri(T,e.TEXTURE_MAG_FILTER,_e[_.magFilter]),e.texParameteri(T,e.TEXTURE_MIN_FILTER,_e[_.minFilter]),_.compareFunction&&(e.texParameteri(T,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(T,e.TEXTURE_COMPARE_FUNC,Be[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Wt||_.minFilter!==_n&&_.minFilter!==Mi||_.type===Pr&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");e.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,a.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function $(T,_){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",E));let ie=_.source,se=d.get(ie);se===void 0&&(se={},d.set(ie,se));let te=Y(_);if(te!==T.__cacheKey){se[te]===void 0&&(se[te]={texture:e.createTexture(),usedTimes:0},s.memory.textures++,B=!0),se[te].usedTimes++;let Le=se[T.__cacheKey];Le!==void 0&&(se[T.__cacheKey].usedTimes--,Le.usedTimes===0&&y(_)),T.__cacheKey=te,T.__webglTexture=se[te].texture}return B}function de(T,_,B){let ie=e.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(ie=e.TEXTURE_2D_ARRAY),_.isData3DTexture&&(ie=e.TEXTURE_3D);let se=$(T,_),te=_.source;r.bindTexture(ie,T.__webglTexture,e.TEXTURE0+B);let Le=i.get(te);if(te.version!==Le.__version||se===!0){r.activeTexture(e.TEXTURE0+B);let ge=Ke.getPrimaries(Ke.workingColorSpace),Me=_.colorSpace===vr?null:Ke.getPrimaries(_.colorSpace),ze=_.colorSpace===vr||ge===Me?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);let he=g(_.image,!1,a.maxTextureSize);he=Pe(_,he);let w=n.convert(_.format,_.colorSpace),L=n.convert(_.type),D=M(_.internalFormat,w,L,_.colorSpace,_.isVideoTexture);De(ie,_);let z,J=_.mipmaps,K=_.isVideoTexture!==!0,pe=Le.__version===void 0||se===!0,R=te.dataReady,Z=G(_,he);if(_.isDepthTexture)D=C(_.format===aa,_.type),pe&&(K?r.texStorage2D(e.TEXTURE_2D,1,D,he.width,he.height):r.texImage2D(e.TEXTURE_2D,0,D,he.width,he.height,0,w,L,null));else if(_.isDataTexture)if(J.length>0){K&&pe&&r.texStorage2D(e.TEXTURE_2D,Z,D,J[0].width,J[0].height);for(let V=0,j=J.length;V<j;V++)z=J[V],K?R&&r.texSubImage2D(e.TEXTURE_2D,V,0,0,z.width,z.height,w,L,z.data):r.texImage2D(e.TEXTURE_2D,V,D,z.width,z.height,0,w,L,z.data);_.generateMipmaps=!1}else K?(pe&&r.texStorage2D(e.TEXTURE_2D,Z,D,he.width,he.height),R&&r.texSubImage2D(e.TEXTURE_2D,0,0,0,he.width,he.height,w,L,he.data)):r.texImage2D(e.TEXTURE_2D,0,D,he.width,he.height,0,w,L,he.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){K&&pe&&r.texStorage3D(e.TEXTURE_2D_ARRAY,Z,D,J[0].width,J[0].height,he.depth);for(let V=0,j=J.length;V<j;V++)if(z=J[V],_.format!==lr)if(w!==null)if(K){if(R)if(_.layerUpdates.size>0){let le=qu(z.width,z.height,_.format,_.type);for(let ae of _.layerUpdates){let Se=z.data.subarray(ae*le/z.data.BYTES_PER_ELEMENT,(ae+1)*le/z.data.BYTES_PER_ELEMENT);r.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,V,0,0,ae,z.width,z.height,1,w,Se)}_.clearLayerUpdates()}else r.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,V,0,0,0,z.width,z.height,he.depth,w,z.data)}else r.compressedTexImage3D(e.TEXTURE_2D_ARRAY,V,D,z.width,z.height,he.depth,0,z.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else K?R&&r.texSubImage3D(e.TEXTURE_2D_ARRAY,V,0,0,0,z.width,z.height,he.depth,w,L,z.data):r.texImage3D(e.TEXTURE_2D_ARRAY,V,D,z.width,z.height,he.depth,0,w,L,z.data)}else{K&&pe&&r.texStorage2D(e.TEXTURE_2D,Z,D,J[0].width,J[0].height);for(let V=0,j=J.length;V<j;V++)z=J[V],_.format!==lr?w!==null?K?R&&r.compressedTexSubImage2D(e.TEXTURE_2D,V,0,0,z.width,z.height,w,z.data):r.compressedTexImage2D(e.TEXTURE_2D,V,D,z.width,z.height,0,z.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):K?R&&r.texSubImage2D(e.TEXTURE_2D,V,0,0,z.width,z.height,w,L,z.data):r.texImage2D(e.TEXTURE_2D,V,D,z.width,z.height,0,w,L,z.data)}else if(_.isDataArrayTexture)if(K){if(pe&&r.texStorage3D(e.TEXTURE_2D_ARRAY,Z,D,he.width,he.height,he.depth),R)if(_.layerUpdates.size>0){let V=qu(he.width,he.height,_.format,_.type);for(let j of _.layerUpdates){let le=he.data.subarray(j*V/he.data.BYTES_PER_ELEMENT,(j+1)*V/he.data.BYTES_PER_ELEMENT);r.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,j,he.width,he.height,1,w,L,le)}_.clearLayerUpdates()}else r.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,w,L,he.data)}else r.texImage3D(e.TEXTURE_2D_ARRAY,0,D,he.width,he.height,he.depth,0,w,L,he.data);else if(_.isData3DTexture)K?(pe&&r.texStorage3D(e.TEXTURE_3D,Z,D,he.width,he.height,he.depth),R&&r.texSubImage3D(e.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,w,L,he.data)):r.texImage3D(e.TEXTURE_3D,0,D,he.width,he.height,he.depth,0,w,L,he.data);else if(_.isFramebufferTexture){if(pe)if(K)r.texStorage2D(e.TEXTURE_2D,Z,D,he.width,he.height);else{let V=he.width,j=he.height;for(let le=0;le<Z;le++)r.texImage2D(e.TEXTURE_2D,le,D,V,j,0,w,L,null),V>>=1,j>>=1}}else if(J.length>0){if(K&&pe){let V=Fe(J[0]);r.texStorage2D(e.TEXTURE_2D,Z,D,V.width,V.height)}for(let V=0,j=J.length;V<j;V++)z=J[V],K?R&&r.texSubImage2D(e.TEXTURE_2D,V,0,0,w,L,z):r.texImage2D(e.TEXTURE_2D,V,D,w,L,z);_.generateMipmaps=!1}else if(K){if(pe){let V=Fe(he);r.texStorage2D(e.TEXTURE_2D,Z,D,V.width,V.height)}R&&r.texSubImage2D(e.TEXTURE_2D,0,0,0,w,L,he)}else r.texImage2D(e.TEXTURE_2D,0,D,w,L,he);m(_)&&f(ie),Le.__version=te.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Te(T,_,B){if(_.image.length!==6)return;let ie=$(T,_),se=_.source;r.bindTexture(e.TEXTURE_CUBE_MAP,T.__webglTexture,e.TEXTURE0+B);let te=i.get(se);if(se.version!==te.__version||ie===!0){r.activeTexture(e.TEXTURE0+B);let Le=Ke.getPrimaries(Ke.workingColorSpace),ge=_.colorSpace===vr?null:Ke.getPrimaries(_.colorSpace),Me=_.colorSpace===vr||Le===ge?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let ze=_.isCompressedTexture||_.image[0].isCompressedTexture,he=_.image[0]&&_.image[0].isDataTexture,w=[];for(let j=0;j<6;j++)!ze&&!he?w[j]=g(_.image[j],!0,a.maxCubemapSize):w[j]=he?_.image[j].image:_.image[j],w[j]=Pe(_,w[j]);let L=w[0],D=n.convert(_.format,_.colorSpace),z=n.convert(_.type),J=M(_.internalFormat,D,z,_.colorSpace),K=_.isVideoTexture!==!0,pe=te.__version===void 0||ie===!0,R=se.dataReady,Z=G(_,L);De(e.TEXTURE_CUBE_MAP,_);let V;if(ze){K&&pe&&r.texStorage2D(e.TEXTURE_CUBE_MAP,Z,J,L.width,L.height);for(let j=0;j<6;j++){V=w[j].mipmaps;for(let le=0;le<V.length;le++){let ae=V[le];_.format!==lr?D!==null?K?R&&r.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le,0,0,ae.width,ae.height,D,ae.data):r.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le,J,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):K?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le,0,0,ae.width,ae.height,D,z,ae.data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le,J,ae.width,ae.height,0,D,z,ae.data)}}}else{if(V=_.mipmaps,K&&pe){V.length>0&&Z++;let j=Fe(w[0]);r.texStorage2D(e.TEXTURE_CUBE_MAP,Z,J,j.width,j.height)}for(let j=0;j<6;j++)if(he){K?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,w[j].width,w[j].height,D,z,w[j].data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,J,w[j].width,w[j].height,0,D,z,w[j].data);for(let le=0;le<V.length;le++){let ae=V[le].image[j].image;K?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le+1,0,0,ae.width,ae.height,D,z,ae.data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le+1,J,ae.width,ae.height,0,D,z,ae.data)}}else{K?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,D,z,w[j]):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,J,D,z,w[j]);for(let le=0;le<V.length;le++){let ae=V[le];K?R&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le+1,0,0,D,z,ae.image[j]):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,le+1,J,D,z,ae.image[j])}}}m(_)&&f(e.TEXTURE_CUBE_MAP),te.__version=se.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Re(T,_,B,ie,se,te){let Le=n.convert(B.format,B.colorSpace),ge=n.convert(B.type),Me=M(B.internalFormat,Le,ge,B.colorSpace),ze=i.get(_),he=i.get(B);if(he.__renderTarget=_,!ze.__hasExternalTextures){let w=Math.max(1,_.width>>te),L=Math.max(1,_.height>>te);se===e.TEXTURE_3D||se===e.TEXTURE_2D_ARRAY?r.texImage3D(se,te,Me,w,L,_.depth,0,Le,ge,null):r.texImage2D(se,te,Me,w,L,0,Le,ge,null)}r.bindFramebuffer(e.FRAMEBUFFER,T),ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,ie,se,he.__webglTexture,0,et(_)):(se===e.TEXTURE_2D||se>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,ie,se,he.__webglTexture,te),r.bindFramebuffer(e.FRAMEBUFFER,null)}function me(T,_,B){if(e.bindRenderbuffer(e.RENDERBUFFER,T),_.depthBuffer){let ie=_.depthTexture,se=ie&&ie.isDepthTexture?ie.type:null,te=C(_.stencilBuffer,se),Le=_.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ge=et(_);ye(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ge,te,_.width,_.height):B?e.renderbufferStorageMultisample(e.RENDERBUFFER,ge,te,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,te,_.width,_.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Le,e.RENDERBUFFER,T)}else{let ie=_.textures;for(let se=0;se<ie.length;se++){let te=ie[se],Le=n.convert(te.format,te.colorSpace),ge=n.convert(te.type),Me=M(te.internalFormat,Le,ge,te.colorSpace),ze=et(_);B&&ye(_)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,ze,Me,_.width,_.height):ye(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ze,Me,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,Me,_.width,_.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ie(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(r.bindFramebuffer(e.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let B=i.get(_.depthTexture);B.__renderTarget=_,(!B.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),re(_.depthTexture,0);let ie=B.__webglTexture,se=et(_);if(_.depthTexture.format===$i)ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,ie,0,se):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,ie,0);else if(_.depthTexture.format===aa)ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,ie,0,se):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function rt(T){let _=i.get(T),B=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){let ie=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),ie){let se=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,ie.removeEventListener("dispose",se)};ie.addEventListener("dispose",se),_.__depthDisposeCallback=se}_.__boundDepthTexture=ie}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Ie(_.__webglFramebuffer,T)}else if(B){_.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)if(r.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[ie]),_.__webglDepthbuffer[ie]===void 0)_.__webglDepthbuffer[ie]=e.createRenderbuffer(),me(_.__webglDepthbuffer[ie],T,!1);else{let se=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=_.__webglDepthbuffer[ie];e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,se,e.RENDERBUFFER,te)}}else if(r.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=e.createRenderbuffer(),me(_.__webglDepthbuffer,T,!1);else{let ie=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,se=_.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,se),e.framebufferRenderbuffer(e.FRAMEBUFFER,ie,e.RENDERBUFFER,se)}r.bindFramebuffer(e.FRAMEBUFFER,null)}function Xe(T,_,B){let ie=i.get(T);_!==void 0&&Re(ie.__webglFramebuffer,T,T.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),B!==void 0&&rt(T)}function qe(T){let _=T.texture,B=i.get(T),ie=i.get(_);T.addEventListener("dispose",A);let se=T.textures,te=T.isWebGLCubeRenderTarget===!0,Le=se.length>1;if(Le||(ie.__webglTexture===void 0&&(ie.__webglTexture=e.createTexture()),ie.__version=_.version,s.memory.textures++),te){B.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[ge]=[];for(let Me=0;Me<_.mipmaps.length;Me++)B.__webglFramebuffer[ge][Me]=e.createFramebuffer()}else B.__webglFramebuffer[ge]=e.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let ge=0;ge<_.mipmaps.length;ge++)B.__webglFramebuffer[ge]=e.createFramebuffer()}else B.__webglFramebuffer=e.createFramebuffer();if(Le)for(let ge=0,Me=se.length;ge<Me;ge++){let ze=i.get(se[ge]);ze.__webglTexture===void 0&&(ze.__webglTexture=e.createTexture(),s.memory.textures++)}if(T.samples>0&&ye(T)===!1){B.__webglMultisampledFramebuffer=e.createFramebuffer(),B.__webglColorRenderbuffer=[],r.bindFramebuffer(e.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ge=0;ge<se.length;ge++){let Me=se[ge];B.__webglColorRenderbuffer[ge]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,B.__webglColorRenderbuffer[ge]);let ze=n.convert(Me.format,Me.colorSpace),he=n.convert(Me.type),w=M(Me.internalFormat,ze,he,Me.colorSpace,T.isXRRenderTarget===!0),L=et(T);e.renderbufferStorageMultisample(e.RENDERBUFFER,L,w,T.width,T.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ge,e.RENDERBUFFER,B.__webglColorRenderbuffer[ge])}e.bindRenderbuffer(e.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=e.createRenderbuffer(),me(B.__webglDepthRenderbuffer,T,!0)),r.bindFramebuffer(e.FRAMEBUFFER,null)}}if(te){r.bindTexture(e.TEXTURE_CUBE_MAP,ie.__webglTexture),De(e.TEXTURE_CUBE_MAP,_);for(let ge=0;ge<6;ge++)if(_.mipmaps&&_.mipmaps.length>0)for(let Me=0;Me<_.mipmaps.length;Me++)Re(B.__webglFramebuffer[ge][Me],T,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Me);else Re(B.__webglFramebuffer[ge],T,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);m(_)&&f(e.TEXTURE_CUBE_MAP),r.unbindTexture()}else if(Le){for(let ge=0,Me=se.length;ge<Me;ge++){let ze=se[ge],he=i.get(ze);r.bindTexture(e.TEXTURE_2D,he.__webglTexture),De(e.TEXTURE_2D,ze),Re(B.__webglFramebuffer,T,ze,e.COLOR_ATTACHMENT0+ge,e.TEXTURE_2D,0),m(ze)&&f(e.TEXTURE_2D)}r.unbindTexture()}else{let ge=e.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ge=T.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),r.bindTexture(ge,ie.__webglTexture),De(ge,_),_.mipmaps&&_.mipmaps.length>0)for(let Me=0;Me<_.mipmaps.length;Me++)Re(B.__webglFramebuffer[Me],T,_,e.COLOR_ATTACHMENT0,ge,Me);else Re(B.__webglFramebuffer,T,_,e.COLOR_ATTACHMENT0,ge,0);m(_)&&f(ge),r.unbindTexture()}T.depthBuffer&&rt(T)}function vt(T){let _=T.textures;for(let B=0,ie=_.length;B<ie;B++){let se=_[B];if(m(se)){let te=b(T),Le=i.get(se).__webglTexture;r.bindTexture(te,Le),f(te),r.unbindTexture()}}}let O=[],dt=[];function $e(T){if(T.samples>0){if(ye(T)===!1){let _=T.textures,B=T.width,ie=T.height,se=e.COLOR_BUFFER_BIT,te=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Le=i.get(T),ge=_.length>1;if(ge)for(let Me=0;Me<_.length;Me++)r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.RENDERBUFFER,null),r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.TEXTURE_2D,null,0);r.bindFramebuffer(e.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer),r.bindFramebuffer(e.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let Me=0;Me<_.length;Me++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(se|=e.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(se|=e.STENCIL_BUFFER_BIT)),ge){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Le.__webglColorRenderbuffer[Me]);let ze=i.get(_[Me]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,ze,0)}e.blitFramebuffer(0,0,B,ie,0,0,B,ie,se,e.NEAREST),l===!0&&(O.length=0,dt.length=0,O.push(e.COLOR_ATTACHMENT0+Me),T.depthBuffer&&T.resolveDepthBuffer===!1&&(O.push(te),dt.push(te),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,dt)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,O))}if(r.bindFramebuffer(e.READ_FRAMEBUFFER,null),r.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ge)for(let Me=0;Me<_.length;Me++){r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.RENDERBUFFER,Le.__webglColorRenderbuffer[Me]);let ze=i.get(_[Me]).__webglTexture;r.bindFramebuffer(e.FRAMEBUFFER,Le.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Me,e.TEXTURE_2D,ze,0)}r.bindFramebuffer(e.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let _=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[_])}}}function et(T){return Math.min(a.maxSamples,T.samples)}function ye(T){let _=i.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function tt(T){let _=s.render.frame;u.get(T)!==_&&(u.set(T,_),T.update())}function Pe(T,_){let B=T.colorSpace,ie=T.format,se=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==sa&&B!==vr&&(Ke.getTransfer(B)===it?(ie!==lr||se!==Ur)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),_}function Fe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=H,this.setTexture2D=re,this.setTexture2DArray=Q,this.setTexture3D=oe,this.setTextureCube=ee,this.rebindTextures=Xe,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=$e,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=ye}function m_(e,t){function r(i,a=vr){let n,s=Ke.getTransfer(a);if(i===Ur)return e.UNSIGNED_BYTE;if(i===El)return e.UNSIGNED_SHORT_4_4_4_4;if(i===bl)return e.UNSIGNED_SHORT_5_5_5_1;if(i===ch)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===oh)return e.BYTE;if(i===lh)return e.SHORT;if(i===Xa)return e.UNSIGNED_SHORT;if(i===Sl)return e.INT;if(i===Si)return e.UNSIGNED_INT;if(i===Pr)return e.FLOAT;if(i===ja)return e.HALF_FLOAT;if(i===uh)return e.ALPHA;if(i===hh)return e.RGB;if(i===lr)return e.RGBA;if(i===dh)return e.LUMINANCE;if(i===ph)return e.LUMINANCE_ALPHA;if(i===$i)return e.DEPTH_COMPONENT;if(i===aa)return e.DEPTH_STENCIL;if(i===fh)return e.RED;if(i===Tl)return e.RED_INTEGER;if(i===mh)return e.RG;if(i===wl)return e.RG_INTEGER;if(i===Al)return e.RGBA_INTEGER;if(i===Wn||i===Xn||i===jn||i===qn)if(s===it)if(n=t.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===Wn)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Xn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===jn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===qn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=t.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===Wn)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Xn)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===jn)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===qn)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Go||i===Wo||i===Xo||i===jo)if(n=t.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===Go)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Wo)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Xo)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===jo)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===qo||i===Yo||i===Zo)if(n=t.get("WEBGL_compressed_texture_etc"),n!==null){if(i===qo||i===Yo)return s===it?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===Zo)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Jo||i===Ko||i===$o||i===Qo||i===el||i===tl||i===rl||i===il||i===al||i===nl||i===sl||i===ol||i===ll||i===cl)if(n=t.get("WEBGL_compressed_texture_astc"),n!==null){if(i===Jo)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ko)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$o)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Qo)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===el)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===tl)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===rl)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===il)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===al)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===nl)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===sl)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ol)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ll)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===cl)return s===it?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Yn||i===ul||i===hl)if(n=t.get("EXT_texture_compression_bptc"),n!==null){if(i===Yn)return s===it?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ul)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===hl)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===gh||i===dl||i===pl||i===fl)if(n=t.get("EXT_texture_compression_rgtc"),n!==null){if(i===Yn)return n.COMPRESSED_RED_RGTC1_EXT;if(i===dl)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===pl)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===fl)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ia?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:r}}var g_=class extends or{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Ut=class extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},v_={type:"move"},bo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ut,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ut,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ut,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let i=null,a=null,n=null,s=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){n=!0;for(let v of e.hand.values()){let g=t.getJointPose(v,r),m=this._getHandJoint(l,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=c.position.distanceTo(u.position),d=.02,p=.005;l.inputState.pinching&&h>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,r),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1));s!==null&&(i=t.getPose(e.targetRaySpace,r),i===null&&a!==null&&(i=a),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(v_)))}return s!==null&&(s.visible=i!==null),o!==null&&(o.visible=a!==null),l!==null&&(l.visible=n!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let r=new Ut;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}},__=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,x_=`
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

}`,y_=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){let i=new cr,a=e.properties.get(i);a.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,r=new $r({vertexShader:__,fragmentShader:x_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mt(new Za(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},M_=class extends oa{constructor(e,t){super();let r=this,i=null,a=1,n=null,s="local-floor",o=1,l=null,c=null,u=null,h=null,d=null,p=null,v=new y_,g=t.getContextAttributes(),m=null,f=null,b=[],M=[],C=new ve,G=null,E=new or;E.viewport=new yt;let A=new or;A.viewport=new yt;let k=[E,A],y=new g_,S=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let de=b[$];return de===void 0&&(de=new bo,b[$]=de),de.getTargetRaySpace()},this.getControllerGrip=function($){let de=b[$];return de===void 0&&(de=new bo,b[$]=de),de.getGripSpace()},this.getHand=function($){let de=b[$];return de===void 0&&(de=new bo,b[$]=de),de.getHandSpace()};function H($){let de=M.indexOf($.inputSource);if(de===-1)return;let Te=b[de];Te!==void 0&&(Te.update($.inputSource,$.frame,l||n),Te.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",Y);for(let $=0;$<b.length;$++){let de=M[$];de!==null&&(M[$]=null,b[$].disconnect(de))}S=null,U=null,v.reset(),e.setRenderTarget(m),d=null,h=null,u=null,i=null,f=null,De.stop(),r.isPresenting=!1,e.setPixelRatio(G),e.setSize(C.width,C.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){s=$,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||n},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",q),i.addEventListener("inputsourceschange",Y),g.xrCompatible!==!0&&await t.makeXRCompatible(),G=e.getPixelRatio(),e.getSize(C),i.renderState.layers===void 0){let de={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(i,t,de),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),f=new Ei(d.framebufferWidth,d.framebufferHeight,{format:lr,type:Ur,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let de=null,Te=null,Re=null;g.depth&&(Re=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=g.stencil?aa:$i,Te=g.stencil?ia:Si);let me={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:a};u=new XRWebGLBinding(i,t),h=u.createProjectionLayer(me),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),f=new Ei(h.textureWidth,h.textureHeight,{format:lr,type:Ur,depthTexture:new zh(h.textureWidth,h.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}f.isXRRenderTarget=!0,this.setFoveation(o),l=null,n=await i.requestReferenceSpace(s),De.setContext(i),De.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function Y($){for(let de=0;de<$.removed.length;de++){let Te=$.removed[de],Re=M.indexOf(Te);Re>=0&&(M[Re]=null,b[Re].disconnect(Te))}for(let de=0;de<$.added.length;de++){let Te=$.added[de],Re=M.indexOf(Te);if(Re===-1){for(let Ie=0;Ie<b.length;Ie++)if(Ie>=M.length){M.push(Te),Re=Ie;break}else if(M[Ie]===null){M[Ie]=Te,Re=Ie;break}if(Re===-1)break}let me=b[Re];me&&me.connect(Te)}}let re=new N,Q=new N;function oe($,de,Te){re.setFromMatrixPosition(de.matrixWorld),Q.setFromMatrixPosition(Te.matrixWorld);let Re=re.distanceTo(Q),me=de.projectionMatrix.elements,Ie=Te.projectionMatrix.elements,rt=me[14]/(me[10]-1),Xe=me[14]/(me[10]+1),qe=(me[9]+1)/me[5],vt=(me[9]-1)/me[5],O=(me[8]-1)/me[0],dt=(Ie[8]+1)/Ie[0],$e=rt*O,et=rt*dt,ye=Re/(-O+dt),tt=ye*-O;if(de.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(tt),$.translateZ(ye),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),me[10]===-1)$.projectionMatrix.copy(de.projectionMatrix),$.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{let Pe=rt+ye,Fe=Xe+ye,T=$e-tt,_=et+(Re-tt),B=qe*Xe/Fe*Pe,ie=vt*Xe/Fe*Pe;$.projectionMatrix.makePerspective(T,_,B,ie,Pe,Fe),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ee($,de){de===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(de.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let de=$.near,Te=$.far;v.texture!==null&&(v.depthNear>0&&(de=v.depthNear),v.depthFar>0&&(Te=v.depthFar)),y.near=A.near=E.near=de,y.far=A.far=E.far=Te,(S!==y.near||U!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),S=y.near,U=y.far),E.layers.mask=$.layers.mask|2,A.layers.mask=$.layers.mask|4,y.layers.mask=E.layers.mask|A.layers.mask;let Re=$.parent,me=y.cameras;ee(y,Re);for(let Ie=0;Ie<me.length;Ie++)ee(me[Ie],Re);me.length===2?oe(y,E,A):y.projectionMatrix.copy(E.projectionMatrix),ue($,y,Re)};function ue($,de,Te){Te===null?$.matrix.copy(de.matrixWorld):($.matrix.copy(Te.matrixWorld),$.matrix.invert(),$.matrix.multiply(de.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(de.projectionMatrix),$.projectionMatrixInverse.copy(de.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=vl*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&d===null))return o},this.setFoveation=function($){o=$,h!==null&&(h.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let _e=null;function Be($,de){if(c=de.getViewerPose(l||n),p=de,c!==null){let Te=c.views;d!==null&&(e.setRenderTargetFramebuffer(f,d.framebuffer),e.setRenderTarget(f));let Re=!1;Te.length!==y.cameras.length&&(y.cameras.length=0,Re=!0);for(let Ie=0;Ie<Te.length;Ie++){let rt=Te[Ie],Xe=null;if(d!==null)Xe=d.getViewport(rt);else{let vt=u.getViewSubImage(h,rt);Xe=vt.viewport,Ie===0&&(e.setRenderTargetTextures(f,vt.colorTexture,h.ignoreDepthValues?void 0:vt.depthStencilTexture),e.setRenderTarget(f))}let qe=k[Ie];qe===void 0&&(qe=new or,qe.layers.enable(Ie),qe.viewport=new yt,k[Ie]=qe),qe.matrix.fromArray(rt.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(rt.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),Ie===0&&(y.matrix.copy(qe.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Re===!0&&y.cameras.push(qe)}let me=i.enabledFeatures;if(me&&me.includes("depth-sensing")){let Ie=u.getDepthInformation(Te[0]);Ie&&Ie.isValid&&Ie.texture&&v.init(e,Ie,i.renderState)}}for(let Te=0;Te<b.length;Te++){let Re=M[Te],me=b[Te];Re!==null&&me!==void 0&&me.update(Re,de,l||n)}_e&&_e($,de),de.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:de}),p=null}let De=new Oh;De.setAnimationLoop(Be),this.setAnimationLoop=function($){_e=$},this.dispose=function(){}}},mi=new bi,S_=new lt;function E_(e,t){function r(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Uh(e)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function a(m,f,b,M,C){f.isMeshBasicMaterial||f.isMeshLambertMaterial?n(m,f):f.isMeshToonMaterial?(n(m,f),h(m,f)):f.isMeshPhongMaterial?(n(m,f),u(m,f)):f.isMeshStandardMaterial?(n(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,C)):f.isMeshMatcapMaterial?(n(m,f),v(m,f)):f.isMeshDepthMaterial?n(m,f):f.isMeshDistanceMaterial?(n(m,f),g(m,f)):f.isMeshNormalMaterial?n(m,f):f.isLineBasicMaterial?(s(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,b,M):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function n(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,r(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,r(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,r(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Gt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,r(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Gt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,r(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,r(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,r(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let b=t.get(f),M=b.envMap,C=b.envMapRotation;M&&(m.envMap.value=M,mi.copy(C),mi.x*=-1,mi.y*=-1,mi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),m.envMapRotation.value.setFromMatrix4(S_.makeRotationFromEuler(mi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,r(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,r(f.aoMap,m.aoMapTransform))}function s(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,r(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,b,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=M*.5,f.map&&(m.map.value=f.map,r(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,r(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,r(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,r(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,r(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,r(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,r(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,r(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,r(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,r(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,r(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Gt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,r(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,r(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,r(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,r(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,r(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,r(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,r(f.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){let b=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function b_(e,t,r,i){let a={},n={},s=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,M){let C=M.program;i.uniformBlockBinding(b,C)}function c(b,M){let C=a[b.id];C===void 0&&(v(b),C=u(b),a[b.id]=C,b.addEventListener("dispose",m));let G=M.program;i.updateUBOMapping(b,G);let E=t.render.frame;n[b.id]!==E&&(d(b),n[b.id]=E)}function u(b){let M=h();b.__bindingPointIndex=M;let C=e.createBuffer(),G=b.__size,E=b.usage;return e.bindBuffer(e.UNIFORM_BUFFER,C),e.bufferData(e.UNIFORM_BUFFER,G,E),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,M,C),C}function h(){for(let b=0;b<o;b++)if(s.indexOf(b)===-1)return s.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let M=a[b.id],C=b.uniforms,G=b.__cache;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let E=0,A=C.length;E<A;E++){let k=Array.isArray(C[E])?C[E]:[C[E]];for(let y=0,S=k.length;y<S;y++){let U=k[y];if(p(U,E,y,G)===!0){let H=U.__offset,q=Array.isArray(U.value)?U.value:[U.value],Y=0;for(let re=0;re<q.length;re++){let Q=q[re],oe=g(Q);typeof Q=="number"||typeof Q=="boolean"?(U.__data[0]=Q,e.bufferSubData(e.UNIFORM_BUFFER,H+Y,U.__data)):Q.isMatrix3?(U.__data[0]=Q.elements[0],U.__data[1]=Q.elements[1],U.__data[2]=Q.elements[2],U.__data[3]=0,U.__data[4]=Q.elements[3],U.__data[5]=Q.elements[4],U.__data[6]=Q.elements[5],U.__data[7]=0,U.__data[8]=Q.elements[6],U.__data[9]=Q.elements[7],U.__data[10]=Q.elements[8],U.__data[11]=0):(Q.toArray(U.__data,Y),Y+=oe.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,H,U.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(b,M,C,G){let E=b.value,A=M+"_"+C;if(G[A]===void 0)return typeof E=="number"||typeof E=="boolean"?G[A]=E:G[A]=E.clone(),!0;{let k=G[A];if(typeof E=="number"||typeof E=="boolean"){if(k!==E)return G[A]=E,!0}else if(k.equals(E)===!1)return k.copy(E),!0}return!1}function v(b){let M=b.uniforms,C=0,G=16;for(let A=0,k=M.length;A<k;A++){let y=Array.isArray(M[A])?M[A]:[M[A]];for(let S=0,U=y.length;S<U;S++){let H=y[S],q=Array.isArray(H.value)?H.value:[H.value];for(let Y=0,re=q.length;Y<re;Y++){let Q=q[Y],oe=g(Q),ee=C%G,ue=ee%oe.boundary,_e=ee+ue;C+=ue,_e!==0&&G-_e<oe.storage&&(C+=G-_e),H.__data=new Float32Array(oe.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=C,C+=oe.storage}}}let E=C%G;return E>0&&(C+=G-E),b.__size=C,b.__cache={},this}function g(b){let M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function m(b){let M=b.target;M.removeEventListener("dispose",m);let C=s.indexOf(M.__bindingPointIndex);s.splice(C,1),e.deleteBuffer(a[M.id]),delete a[M.id],delete n[M.id]}function f(){for(let b in a)e.deleteBuffer(a[b]);s=[],a={},n={}}return{bind:l,update:c,dispose:f}}var Dl=class{constructor(e={}){let{canvas:t=pf(),context:r=null,depth:i=!0,stencil:a=!1,alpha:n=!1,antialias:s=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let d;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=r.getContextAttributes().alpha}else d=n;let p=new Uint32Array(4),v=new Int32Array(4),g=null,m=null,f=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mt,this.toneMapping=Zr,this.toneMappingExposure=1;let M=this,C=!1,G=0,E=0,A=null,k=-1,y=null,S=new yt,U=new yt,H=null,q=new je(0),Y=0,re=t.width,Q=t.height,oe=1,ee=null,ue=null,_e=new yt(0,0,re,Q),Be=new yt(0,0,re,Q),De=!1,$=new Pl,de=!1,Te=!1,Re=new lt,me=new lt,Ie=new N,rt=new yt,Xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qe=!1;function vt(){return A===null?oe:1}let O=r;function dt(x,F){return t.getContext(x,F)}try{let x={alpha:!0,depth:i,stencil:a,antialias:s,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ml}`),t.addEventListener("webglcontextlost",V,!1),t.addEventListener("webglcontextrestored",j,!1),t.addEventListener("webglcontextcreationerror",le,!1),O===null){let F="webgl2";if(O=dt(F,x),O===null)throw dt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let $e,et,ye,tt,Pe,Fe,T,_,B,ie,se,te,Le,ge,Me,ze,he,w,L,D,z,J,K,pe;function R(){$e=new P0(O),$e.init(),J=new m_(O,$e),et=new b0(O,$e,e,J),ye=new d_(O,$e),et.reverseDepthBuffer&&h&&ye.buffers.depth.setReversed(!0),tt=new U0(O),Pe=new Kv,Fe=new f_(O,$e,ye,Pe,et,J,tt),T=new w0(M),_=new R0(M),B=new Bf(O),K=new S0(O,B),ie=new L0(O,B,tt,K),se=new I0(O,ie,B,tt),L=new N0(O,et,Fe),ze=new T0(Pe),te=new Jv(M,T,_,$e,et,K,ze),Le=new E_(M,Pe),ge=new Qv,Me=new n_($e),w=new M0(M,T,_,ye,se,d,o),he=new u_(M,se,et),pe=new b_(O,tt,et,ye),D=new E0(O,$e,tt),z=new D0(O,$e,tt),tt.programs=te.programs,M.capabilities=et,M.extensions=$e,M.properties=Pe,M.renderLists=ge,M.shadowMap=he,M.state=ye,M.info=tt}R();let Z=new M_(M,O);this.xr=Z,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let x=$e.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=$e.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(x){x!==void 0&&(oe=x,this.setSize(re,Q,!1))},this.getSize=function(x){return x.set(re,Q)},this.setSize=function(x,F,W=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}re=x,Q=F,t.width=Math.floor(x*oe),t.height=Math.floor(F*oe),W===!0&&(t.style.width=x+"px",t.style.height=F+"px"),this.setViewport(0,0,x,F)},this.getDrawingBufferSize=function(x){return x.set(re*oe,Q*oe).floor()},this.setDrawingBufferSize=function(x,F,W){re=x,Q=F,oe=W,t.width=Math.floor(x*W),t.height=Math.floor(F*W),this.setViewport(0,0,x,F)},this.getCurrentViewport=function(x){return x.copy(S)},this.getViewport=function(x){return x.copy(_e)},this.setViewport=function(x,F,W,X){x.isVector4?_e.set(x.x,x.y,x.z,x.w):_e.set(x,F,W,X),ye.viewport(S.copy(_e).multiplyScalar(oe).round())},this.getScissor=function(x){return x.copy(Be)},this.setScissor=function(x,F,W,X){x.isVector4?Be.set(x.x,x.y,x.z,x.w):Be.set(x,F,W,X),ye.scissor(U.copy(Be).multiplyScalar(oe).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(x){ye.setScissorTest(De=x)},this.setOpaqueSort=function(x){ee=x},this.setTransparentSort=function(x){ue=x},this.getClearColor=function(x){return x.copy(w.getClearColor())},this.setClearColor=function(){w.setClearColor.apply(w,arguments)},this.getClearAlpha=function(){return w.getClearAlpha()},this.setClearAlpha=function(){w.setClearAlpha.apply(w,arguments)},this.clear=function(x=!0,F=!0,W=!0){let X=0;if(x){let I=!1;if(A!==null){let ce=A.texture.format;I=ce===Al||ce===wl||ce===Tl}if(I){let ce=A.texture.type,xe=ce===Ur||ce===Si||ce===Xa||ce===ia||ce===El||ce===bl,Ee=w.getClearColor(),we=w.getClearAlpha(),ke=Ee.r,He=Ee.g,Ue=Ee.b;xe?(p[0]=ke,p[1]=He,p[2]=Ue,p[3]=we,O.clearBufferuiv(O.COLOR,0,p)):(v[0]=ke,v[1]=He,v[2]=Ue,v[3]=we,O.clearBufferiv(O.COLOR,0,v))}else X|=O.COLOR_BUFFER_BIT}F&&(X|=O.DEPTH_BUFFER_BIT),W&&(X|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",V,!1),t.removeEventListener("webglcontextrestored",j,!1),t.removeEventListener("webglcontextcreationerror",le,!1),ge.dispose(),Me.dispose(),Pe.dispose(),T.dispose(),_.dispose(),se.dispose(),K.dispose(),pe.dispose(),te.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",At),Z.removeEventListener("sessionend",ma),rr.stop()};function V(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function j(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let x=tt.autoReset,F=he.enabled,W=he.autoUpdate,X=he.needsUpdate,I=he.type;R(),tt.autoReset=x,he.enabled=F,he.autoUpdate=W,he.needsUpdate=X,he.type=I}function le(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function ae(x){let F=x.target;F.removeEventListener("dispose",ae),Se(F)}function Se(x){Ye(x),Pe.remove(x)}function Ye(x){let F=Pe.get(x).programs;F!==void 0&&(F.forEach(function(W){te.releaseProgram(W)}),x.isShaderMaterial&&te.releaseShaderCache(x))}this.renderBufferDirect=function(x,F,W,X,I,ce){F===null&&(F=Xe);let xe=I.isMesh&&I.matrixWorld.determinant()<0,Ee=Zd(x,F,W,X,I);ye.setMaterial(X,xe);let we=W.index,ke=1;if(X.wireframe===!0){if(we=ie.getWireframeAttribute(W),we===void 0)return;ke=2}let He=W.drawRange,Ue=W.attributes.position,Qe=He.start*ke,ct=(He.start+He.count)*ke;ce!==null&&(Qe=Math.max(Qe,ce.start*ke),ct=Math.min(ct,(ce.start+ce.count)*ke)),we!==null?(Qe=Math.max(Qe,0),ct=Math.min(ct,we.count)):Ue!=null&&(Qe=Math.max(Qe,0),ct=Math.min(ct,Ue.count));let ut=ct-Qe;if(ut<0||ut===1/0)return;K.setup(I,X,Ee,W,we);let _t,ht=D;if(we!==null&&(_t=B.get(we),ht=z,ht.setIndex(_t)),I.isMesh)X.wireframe===!0?(ye.setLineWidth(X.wireframeLinewidth*vt()),ht.setMode(O.LINES)):ht.setMode(O.TRIANGLES);else if(I.isLine){let Ae=X.linewidth;Ae===void 0&&(Ae=1),ye.setLineWidth(Ae*vt()),I.isLineSegments?ht.setMode(O.LINES):I.isLineLoop?ht.setMode(O.LINE_LOOP):ht.setMode(O.LINE_STRIP)}else I.isPoints?ht.setMode(O.POINTS):I.isSprite&&ht.setMode(O.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)ht.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if($e.get("WEBGL_multi_draw"))ht.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{let Ae=I._multiDrawStarts,ai=I._multiDrawCounts,ni=I._multiDrawCount,ir=we?B.get(we).bytesPerElement:1,Ti=Pe.get(X).currentProgram.getUniforms();for(let Yt=0;Yt<ni;Yt++)Ti.setValue(O,"_gl_DrawID",Yt),ht.render(Ae[Yt]/ir,ai[Yt])}else if(I.isInstancedMesh)ht.renderInstances(Qe,ut,I.count);else if(W.isInstancedBufferGeometry){let Ae=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ai=Math.min(W.instanceCount,Ae);ht.renderInstances(Qe,ut,ai)}else ht.render(Qe,ut)};function Je(x,F,W){x.transparent===!0&&x.side===Rr&&x.forceSinglePass===!1?(x.side=Gt,x.needsUpdate=!0,nn(x,F,W),x.side=Kr,x.needsUpdate=!0,nn(x,F,W),x.side=Rr):nn(x,F,W)}this.compile=function(x,F,W=null){W===null&&(W=x),m=Me.get(W),m.init(F),b.push(m),W.traverseVisible(function(I){I.isLight&&I.layers.test(F.layers)&&(m.pushLight(I),I.castShadow&&m.pushShadow(I))}),x!==W&&x.traverseVisible(function(I){I.isLight&&I.layers.test(F.layers)&&(m.pushLight(I),I.castShadow&&m.pushShadow(I))}),m.setupLights();let X=new Set;return x.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;let ce=I.material;if(ce)if(Array.isArray(ce))for(let xe=0;xe<ce.length;xe++){let Ee=ce[xe];Je(Ee,W,I),X.add(Ee)}else Je(ce,W,I),X.add(ce)}),b.pop(),m=null,X},this.compileAsync=function(x,F,W=null){let X=this.compile(x,F,W);return new Promise(I=>{function ce(){if(X.forEach(function(xe){Pe.get(xe).currentProgram.isReady()&&X.delete(xe)}),X.size===0){I(x);return}setTimeout(ce,10)}$e.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Ge=null;function qt(x){Ge&&Ge(x)}function At(){rr.stop()}function ma(){rr.start()}let rr=new Oh;rr.setAnimationLoop(qt),typeof self<"u"&&rr.setContext(self),this.setAnimationLoop=function(x){Ge=x,Z.setAnimationLoop(x),x===null?rr.stop():rr.start()},Z.addEventListener("sessionstart",At),Z.addEventListener("sessionend",ma),this.render=function(x,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(F),F=Z.getCamera()),x.isScene===!0&&x.onBeforeRender(M,x,F,A),m=Me.get(x,b.length),m.init(F),b.push(m),me.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(me),Te=this.localClippingEnabled,de=ze.init(this.clippingPlanes,Te),g=ge.get(x,f.length),g.init(),f.push(g),Z.enabled===!0&&Z.isPresenting===!0){let ce=M.xr.getDepthSensingMesh();ce!==null&&ga(ce,F,-1/0,M.sortObjects)}ga(x,F,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(ee,ue),qe=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,qe&&w.addToRenderList(g,x),this.info.render.frame++,de===!0&&ze.beginShadows();let W=m.state.shadowsArray;he.render(W,x,F),de===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=g.opaque,I=g.transmissive;if(m.setupLights(),F.isArrayCamera){let ce=F.cameras;if(I.length>0)for(let xe=0,Ee=ce.length;xe<Ee;xe++){let we=ce[xe];pt(X,I,x,we)}qe&&w.render(x);for(let xe=0,Ee=ce.length;xe<Ee;xe++){let we=ce[xe];bt(g,x,we,we.viewport)}}else I.length>0&&pt(X,I,x,F),qe&&w.render(x),bt(g,x,F);A!==null&&(Fe.updateMultisampleRenderTarget(A),Fe.updateRenderTargetMipmap(A)),x.isScene===!0&&x.onAfterRender(M,x,F),K.resetDefaultState(),k=-1,y=null,b.pop(),b.length>0?(m=b[b.length-1],de===!0&&ze.setGlobalState(M.clippingPlanes,m.state.camera)):m=null,f.pop(),f.length>0?g=f[f.length-1]:g=null};function ga(x,F,W,X){if(x.visible===!1)return;if(x.layers.test(F.layers)){if(x.isGroup)W=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(F);else if(x.isLight)m.pushLight(x),x.castShadow&&m.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||$.intersectsSprite(x)){X&&rt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(me);let ce=se.update(x),xe=x.material;xe.visible&&g.push(x,ce,xe,W,rt.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||$.intersectsObject(x))){let ce=se.update(x),xe=x.material;if(X&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),rt.copy(x.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),rt.copy(ce.boundingSphere.center)),rt.applyMatrix4(x.matrixWorld).applyMatrix4(me)),Array.isArray(xe)){let Ee=ce.groups;for(let we=0,ke=Ee.length;we<ke;we++){let He=Ee[we],Ue=xe[He.materialIndex];Ue&&Ue.visible&&g.push(x,ce,Ue,W,rt.z,He)}}else xe.visible&&g.push(x,ce,xe,W,rt.z,null)}}let I=x.children;for(let ce=0,xe=I.length;ce<xe;ce++)ga(I[ce],F,W,X)}function bt(x,F,W,X){let I=x.opaque,ce=x.transmissive,xe=x.transparent;m.setupLightsView(W),de===!0&&ze.setGlobalState(M.clippingPlanes,W),X&&ye.viewport(S.copy(X)),I.length>0&&Nt(I,F,W),ce.length>0&&Nt(ce,F,W),xe.length>0&&Nt(xe,F,W),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function pt(x,F,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[X.id]===void 0&&(m.state.transmissionRenderTarget[X.id]=new Ei(1,1,{generateMipmaps:!0,type:$e.has("EXT_color_buffer_half_float")||$e.has("EXT_color_buffer_float")?ja:Ur,minFilter:Mi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));let I=m.state.transmissionRenderTarget[X.id],ce=X.viewport||S;I.setSize(ce.z,ce.w);let xe=M.getRenderTarget();M.setRenderTarget(I),M.getClearColor(q),Y=M.getClearAlpha(),Y<1&&M.setClearColor(16777215,.5),M.clear(),qe&&w.render(W);let Ee=M.toneMapping;M.toneMapping=Zr;let we=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),m.setupLightsView(X),de===!0&&ze.setGlobalState(M.clippingPlanes,X),Nt(x,W,X),Fe.updateMultisampleRenderTarget(I),Fe.updateRenderTargetMipmap(I),$e.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let He=0,Ue=F.length;He<Ue;He++){let Qe=F[He],ct=Qe.object,ut=Qe.geometry,_t=Qe.material,ht=Qe.group;if(_t.side===Rr&&ct.layers.test(X.layers)){let Ae=_t.side;_t.side=Gt,_t.needsUpdate=!0,It(ct,W,X,ut,_t,ht),_t.side=Ae,_t.needsUpdate=!0,ke=!0}}ke===!0&&(Fe.updateMultisampleRenderTarget(I),Fe.updateRenderTargetMipmap(I))}M.setRenderTarget(xe),M.setClearColor(q,Y),we!==void 0&&(X.viewport=we),M.toneMapping=Ee}function Nt(x,F,W){let X=F.isScene===!0?F.overrideMaterial:null;for(let I=0,ce=x.length;I<ce;I++){let xe=x[I],Ee=xe.object,we=xe.geometry,ke=X===null?xe.material:X,He=xe.group;Ee.layers.test(W.layers)&&It(Ee,F,W,we,ke,He)}}function It(x,F,W,X,I,ce){x.onBeforeRender(M,F,W,X,I,ce),x.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),I.onBeforeRender(M,F,W,X,x,ce),I.transparent===!0&&I.side===Rr&&I.forceSinglePass===!1?(I.side=Gt,I.needsUpdate=!0,M.renderBufferDirect(W,F,X,I,x,ce),I.side=Kr,I.needsUpdate=!0,M.renderBufferDirect(W,F,X,I,x,ce),I.side=Rr):M.renderBufferDirect(W,F,X,I,x,ce),x.onAfterRender(M,F,W,X,I,ce)}function nn(x,F,W){F.isScene!==!0&&(F=Xe);let X=Pe.get(x),I=m.state.lights,ce=m.state.shadowsArray,xe=I.state.version,Ee=te.getParameters(x,I.state,ce,F,W),we=te.getProgramCacheKey(Ee),ke=X.programs;X.environment=x.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(x.isMeshStandardMaterial?_:T).get(x.envMap||X.environment),X.envMapRotation=X.environment!==null&&x.envMap===null?F.environmentRotation:x.envMapRotation,ke===void 0&&(x.addEventListener("dispose",ae),ke=new Map,X.programs=ke);let He=ke.get(we);if(He!==void 0){if(X.currentProgram===He&&X.lightsStateVersion===xe)return oc(x,Ee),He}else Ee.uniforms=te.getUniforms(x),x.onBeforeCompile(Ee,M),He=te.acquireProgram(Ee,we),ke.set(we,He),X.uniforms=Ee.uniforms;let Ue=X.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ue.clippingPlanes=ze.uniform),oc(x,Ee),X.needsLights=Kd(x),X.lightsStateVersion=xe,X.needsLights&&(Ue.ambientLightColor.value=I.state.ambient,Ue.lightProbe.value=I.state.probe,Ue.directionalLights.value=I.state.directional,Ue.directionalLightShadows.value=I.state.directionalShadow,Ue.spotLights.value=I.state.spot,Ue.spotLightShadows.value=I.state.spotShadow,Ue.rectAreaLights.value=I.state.rectArea,Ue.ltc_1.value=I.state.rectAreaLTC1,Ue.ltc_2.value=I.state.rectAreaLTC2,Ue.pointLights.value=I.state.point,Ue.pointLightShadows.value=I.state.pointShadow,Ue.hemisphereLights.value=I.state.hemi,Ue.directionalShadowMap.value=I.state.directionalShadowMap,Ue.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Ue.spotShadowMap.value=I.state.spotShadowMap,Ue.spotLightMatrix.value=I.state.spotLightMatrix,Ue.spotLightMap.value=I.state.spotLightMap,Ue.pointShadowMap.value=I.state.pointShadowMap,Ue.pointShadowMatrix.value=I.state.pointShadowMatrix),X.currentProgram=He,X.uniformsList=null,He}function sc(x){if(x.uniformsList===null){let F=x.currentProgram.getUniforms();x.uniformsList=Kn.seqWithValue(F.seq,x.uniforms)}return x.uniformsList}function oc(x,F){let W=Pe.get(x);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function Zd(x,F,W,X,I){F.isScene!==!0&&(F=Xe),Fe.resetTextureUnits();let ce=F.fog,xe=X.isMeshStandardMaterial?F.environment:null,Ee=A===null?M.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:sa,we=(X.isMeshStandardMaterial?_:T).get(X.envMap||xe),ke=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,He=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ue=!!W.morphAttributes.position,Qe=!!W.morphAttributes.normal,ct=!!W.morphAttributes.color,ut=Zr;X.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ut=M.toneMapping);let _t=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ht=_t!==void 0?_t.length:0,Ae=Pe.get(X),ai=m.state.lights;if(de===!0&&(Te===!0||x!==y)){let Bt=x===y&&X.id===k;ze.setState(X,x,Bt)}let ni=!1;X.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ai.state.version||Ae.outputColorSpace!==Ee||I.isBatchedMesh&&Ae.batching===!1||!I.isBatchedMesh&&Ae.batching===!0||I.isBatchedMesh&&Ae.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&Ae.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&Ae.instancing===!1||!I.isInstancedMesh&&Ae.instancing===!0||I.isSkinnedMesh&&Ae.skinning===!1||!I.isSkinnedMesh&&Ae.skinning===!0||I.isInstancedMesh&&Ae.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Ae.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&Ae.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&Ae.instancingMorph===!1&&I.morphTexture!==null||Ae.envMap!==we||X.fog===!0&&Ae.fog!==ce||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==ze.numPlanes||Ae.numIntersection!==ze.numIntersection)||Ae.vertexAlphas!==ke||Ae.vertexTangents!==He||Ae.morphTargets!==Ue||Ae.morphNormals!==Qe||Ae.morphColors!==ct||Ae.toneMapping!==ut||Ae.morphTargetsCount!==ht)&&(ni=!0):(ni=!0,Ae.__version=X.version);let ir=Ae.currentProgram;ni===!0&&(ir=nn(X,F,I));let Ti=!1,Yt=!1,va=!1,ot=ir.getUniforms(),pr=Ae.uniforms;if(ye.useProgram(ir.program)&&(Ti=!0,Yt=!0,va=!0),X.id!==k&&(k=X.id,Yt=!0),Ti||y!==x){ye.buffers.depth.getReversed()?(Re.copy(x.projectionMatrix),mf(Re),gf(Re),ot.setValue(O,"projectionMatrix",Re)):ot.setValue(O,"projectionMatrix",x.projectionMatrix),ot.setValue(O,"viewMatrix",x.matrixWorldInverse);let Bt=ot.map.cameraPosition;Bt!==void 0&&Bt.setValue(O,Ie.setFromMatrixPosition(x.matrixWorld)),et.logarithmicDepthBuffer&&ot.setValue(O,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ot.setValue(O,"isOrthographic",x.isOrthographicCamera===!0),y!==x&&(y=x,Yt=!0,va=!0)}if(I.isSkinnedMesh){ot.setOptional(O,I,"bindMatrix"),ot.setOptional(O,I,"bindMatrixInverse");let Bt=I.skeleton;Bt&&(Bt.boneTexture===null&&Bt.computeBoneTexture(),ot.setValue(O,"boneTexture",Bt.boneTexture,Fe))}I.isBatchedMesh&&(ot.setOptional(O,I,"batchingTexture"),ot.setValue(O,"batchingTexture",I._matricesTexture,Fe),ot.setOptional(O,I,"batchingIdTexture"),ot.setValue(O,"batchingIdTexture",I._indirectTexture,Fe),ot.setOptional(O,I,"batchingColorTexture"),I._colorsTexture!==null&&ot.setValue(O,"batchingColorTexture",I._colorsTexture,Fe));let _a=W.morphAttributes;if((_a.position!==void 0||_a.normal!==void 0||_a.color!==void 0)&&L.update(I,W,ir),(Yt||Ae.receiveShadow!==I.receiveShadow)&&(Ae.receiveShadow=I.receiveShadow,ot.setValue(O,"receiveShadow",I.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(pr.envMap.value=we,pr.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(pr.envMapIntensity.value=F.environmentIntensity),Yt&&(ot.setValue(O,"toneMappingExposure",M.toneMappingExposure),Ae.needsLights&&Jd(pr,va),ce&&X.fog===!0&&Le.refreshFogUniforms(pr,ce),Le.refreshMaterialUniforms(pr,X,oe,Q,m.state.transmissionRenderTarget[x.id]),Kn.upload(O,sc(Ae),pr,Fe)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Kn.upload(O,sc(Ae),pr,Fe),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ot.setValue(O,"center",I.center),ot.setValue(O,"modelViewMatrix",I.modelViewMatrix),ot.setValue(O,"normalMatrix",I.normalMatrix),ot.setValue(O,"modelMatrix",I.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let Bt=X.uniformsGroups;for(let xa=0,Fr=Bt.length;xa<Fr;xa++){let lc=Bt[xa];pe.update(lc,ir),pe.bind(lc,ir)}}return ir}function Jd(x,F){x.ambientLightColor.needsUpdate=F,x.lightProbe.needsUpdate=F,x.directionalLights.needsUpdate=F,x.directionalLightShadows.needsUpdate=F,x.pointLights.needsUpdate=F,x.pointLightShadows.needsUpdate=F,x.spotLights.needsUpdate=F,x.spotLightShadows.needsUpdate=F,x.rectAreaLights.needsUpdate=F,x.hemisphereLights.needsUpdate=F}function Kd(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(x,F,W){Pe.get(x.texture).__webglTexture=F,Pe.get(x.depthTexture).__webglTexture=W;let X=Pe.get(x);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||$e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,F){let W=Pe.get(x);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(x,F=0,W=0){A=x,G=F,E=W;let X=!0,I=null,ce=!1,xe=!1;if(x){let Ee=Pe.get(x);if(Ee.__useDefaultFramebuffer!==void 0)ye.bindFramebuffer(O.FRAMEBUFFER,null),X=!1;else if(Ee.__webglFramebuffer===void 0)Fe.setupRenderTarget(x);else if(Ee.__hasExternalTextures)Fe.rebindTextures(x,Pe.get(x.texture).__webglTexture,Pe.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let He=x.depthTexture;if(Ee.__boundDepthTexture!==He){if(He!==null&&Pe.has(He)&&(x.width!==He.image.width||x.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(x)}}let we=x.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(xe=!0);let ke=Pe.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(ke[F])?I=ke[F][W]:I=ke[F],ce=!0):x.samples>0&&Fe.useMultisampledRTT(x)===!1?I=Pe.get(x).__webglMultisampledFramebuffer:Array.isArray(ke)?I=ke[W]:I=ke,S.copy(x.viewport),U.copy(x.scissor),H=x.scissorTest}else S.copy(_e).multiplyScalar(oe).floor(),U.copy(Be).multiplyScalar(oe).floor(),H=De;if(ye.bindFramebuffer(O.FRAMEBUFFER,I)&&X&&ye.drawBuffers(x,I),ye.viewport(S),ye.scissor(U),ye.setScissorTest(H),ce){let Ee=Pe.get(x.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ee.__webglTexture,W)}else if(xe){let Ee=Pe.get(x.texture),we=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ee.__webglTexture,W||0,we)}k=-1},this.readRenderTargetPixels=function(x,F,W,X,I,ce,xe){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Pe.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&xe!==void 0&&(Ee=Ee[xe]),Ee){ye.bindFramebuffer(O.FRAMEBUFFER,Ee);try{let we=x.texture,ke=we.format,He=we.type;if(!et.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=x.width-X&&W>=0&&W<=x.height-I&&O.readPixels(F,W,X,I,J.convert(ke),J.convert(He),ce)}finally{let we=A!==null?Pe.get(A).__webglFramebuffer:null;ye.bindFramebuffer(O.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(x,F,W,X,I,ce,xe){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Pe.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&xe!==void 0&&(Ee=Ee[xe]),Ee){let we=x.texture,ke=we.format,He=we.type;if(!et.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=x.width-X&&W>=0&&W<=x.height-I){ye.bindFramebuffer(O.FRAMEBUFFER,Ee);let Ue=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ue),O.bufferData(O.PIXEL_PACK_BUFFER,ce.byteLength,O.STREAM_READ),O.readPixels(F,W,X,I,J.convert(ke),J.convert(He),0);let Qe=A!==null?Pe.get(A).__webglFramebuffer:null;ye.bindFramebuffer(O.FRAMEBUFFER,Qe);let ct=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await ff(O,ct,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ue),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ce),O.deleteBuffer(Ue),O.deleteSync(ct),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,F=null,W=0){x.isTexture!==!0&&(Ha("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,x=arguments[1]);let X=Math.pow(2,-W),I=Math.floor(x.image.width*X),ce=Math.floor(x.image.height*X),xe=F!==null?F.x:0,Ee=F!==null?F.y:0;Fe.setTexture2D(x,0),O.copyTexSubImage2D(O.TEXTURE_2D,W,0,0,xe,Ee,I,ce),ye.unbindTexture()},this.copyTextureToTexture=function(x,F,W=null,X=null,I=0){x.isTexture!==!0&&(Ha("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,x=arguments[1],F=arguments[2],I=arguments[3]||0,W=null);let ce,xe,Ee,we,ke,He,Ue,Qe,ct,ut=x.isCompressedTexture?x.mipmaps[I]:x.image;W!==null?(ce=W.max.x-W.min.x,xe=W.max.y-W.min.y,Ee=W.isBox3?W.max.z-W.min.z:1,we=W.min.x,ke=W.min.y,He=W.isBox3?W.min.z:0):(ce=ut.width,xe=ut.height,Ee=ut.depth||1,we=0,ke=0,He=0),X!==null?(Ue=X.x,Qe=X.y,ct=X.z):(Ue=0,Qe=0,ct=0);let _t=J.convert(F.format),ht=J.convert(F.type),Ae;F.isData3DTexture?(Fe.setTexture3D(F,0),Ae=O.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Fe.setTexture2DArray(F,0),Ae=O.TEXTURE_2D_ARRAY):(Fe.setTexture2D(F,0),Ae=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,F.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,F.unpackAlignment);let ai=O.getParameter(O.UNPACK_ROW_LENGTH),ni=O.getParameter(O.UNPACK_IMAGE_HEIGHT),ir=O.getParameter(O.UNPACK_SKIP_PIXELS),Ti=O.getParameter(O.UNPACK_SKIP_ROWS),Yt=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,ut.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ut.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,we),O.pixelStorei(O.UNPACK_SKIP_ROWS,ke),O.pixelStorei(O.UNPACK_SKIP_IMAGES,He);let va=x.isDataArrayTexture||x.isData3DTexture,ot=F.isDataArrayTexture||F.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){let pr=Pe.get(x),_a=Pe.get(F),Bt=Pe.get(pr.__renderTarget),xa=Pe.get(_a.__renderTarget);ye.bindFramebuffer(O.READ_FRAMEBUFFER,Bt.__webglFramebuffer),ye.bindFramebuffer(O.DRAW_FRAMEBUFFER,xa.__webglFramebuffer);for(let Fr=0;Fr<Ee;Fr++)va&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pe.get(x).__webglTexture,I,He+Fr),x.isDepthTexture?(ot&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pe.get(F).__webglTexture,I,ct+Fr),O.blitFramebuffer(we,ke,ce,xe,Ue,Qe,ce,xe,O.DEPTH_BUFFER_BIT,O.NEAREST)):ot?O.copyTexSubImage3D(Ae,I,Ue,Qe,ct+Fr,we,ke,ce,xe):O.copyTexSubImage2D(Ae,I,Ue,Qe,ct+Fr,we,ke,ce,xe);ye.bindFramebuffer(O.READ_FRAMEBUFFER,null),ye.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ot?x.isDataTexture||x.isData3DTexture?O.texSubImage3D(Ae,I,Ue,Qe,ct,ce,xe,Ee,_t,ht,ut.data):F.isCompressedArrayTexture?O.compressedTexSubImage3D(Ae,I,Ue,Qe,ct,ce,xe,Ee,_t,ut.data):O.texSubImage3D(Ae,I,Ue,Qe,ct,ce,xe,Ee,_t,ht,ut):x.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,I,Ue,Qe,ce,xe,_t,ht,ut.data):x.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,I,Ue,Qe,ut.width,ut.height,_t,ut.data):O.texSubImage2D(O.TEXTURE_2D,I,Ue,Qe,ce,xe,_t,ht,ut);O.pixelStorei(O.UNPACK_ROW_LENGTH,ai),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ni),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ir),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ti),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Yt),I===0&&F.generateMipmaps&&O.generateMipmap(Ae),ye.unbindTexture()},this.copyTextureToTexture3D=function(x,F,W=null,X=null,I=0){return x.isTexture!==!0&&(Ha("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,x=arguments[2],F=arguments[3],I=arguments[4]||0),Ha('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,F,W,X,I)},this.initRenderTarget=function(x){Pe.get(x).__webglFramebuffer===void 0&&Fe.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?Fe.setTextureCube(x,0):x.isData3DTexture?Fe.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?Fe.setTexture2DArray(x,0):Fe.setTexture2D(x,0),ye.unbindTexture()},this.resetState=function(){G=0,E=0,A=null,ye.reset(),K.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Lr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}},as=class extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},T_=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=gl,this.updateRanges=[],this.version=0,this.uuid=Jr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,r){e*=this.stride,r*=t.stride;for(let i=0,a=this.stride;i<a;i++)this.array[e+i]=t.array[r+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(t,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ot=new N,Yu=class Gh{constructor(t,r,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=r,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let r=0,i=this.data.count;r<i;r++)Ot.fromBufferAttribute(this,r),Ot.applyMatrix4(t),this.setXYZ(r,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(t){for(let r=0,i=this.count;r<i;r++)Ot.fromBufferAttribute(this,r),Ot.applyNormalMatrix(t),this.setXYZ(r,Ot.x,Ot.y,Ot.z);return this}transformDirection(t){for(let r=0,i=this.count;r<i;r++)Ot.fromBufferAttribute(this,r),Ot.transformDirection(t),this.setXYZ(r,Ot.x,Ot.y,Ot.z);return this}getComponent(t,r){let i=this.array[t*this.data.stride+this.offset+r];return this.normalized&&(i=_r(i,this.array)),i}setComponent(t,r,i){return this.normalized&&(i=at(i,this.array)),this.data.array[t*this.data.stride+this.offset+r]=i,this}setX(t,r){return this.normalized&&(r=at(r,this.array)),this.data.array[t*this.data.stride+this.offset]=r,this}setY(t,r){return this.normalized&&(r=at(r,this.array)),this.data.array[t*this.data.stride+this.offset+1]=r,this}setZ(t,r){return this.normalized&&(r=at(r,this.array)),this.data.array[t*this.data.stride+this.offset+2]=r,this}setW(t,r){return this.normalized&&(r=at(r,this.array)),this.data.array[t*this.data.stride+this.offset+3]=r,this}getX(t){let r=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(r=_r(r,this.array)),r}getY(t){let r=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(r=_r(r,this.array)),r}getZ(t){let r=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(r=_r(r,this.array)),r}getW(t){let r=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(r=_r(r,this.array)),r}setXY(t,r,i){return t=t*this.data.stride+this.offset,this.normalized&&(r=at(r,this.array),i=at(i,this.array)),this.data.array[t+0]=r,this.data.array[t+1]=i,this}setXYZ(t,r,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(r=at(r,this.array),i=at(i,this.array),a=at(a,this.array)),this.data.array[t+0]=r,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,r,i,a,n){return t=t*this.data.stride+this.offset,this.normalized&&(r=at(r,this.array),i=at(i,this.array),a=at(a,this.array),n=at(n,this.array)),this.data.array[t+0]=r,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=n,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let r=[];for(let i=0;i<this.count;i++){let a=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)r.push(this.data.array[a+n])}return new Rt(new this.array.constructor(r),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Gh(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let r=[];for(let i=0;i<this.count;i++){let a=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)r.push(this.data.array[a+n])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:r,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},da=class extends ca{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Gi,za=new N,Wi=new N,Xi=new N,ji=new ve,ka=new ve,Wh=new lt,kn=new N,Ba=new N,Bn=new N,Zu=new ve,To=new ve,Ju=new ve,Ja=class extends Xt{constructor(e=new da){if(super(),this.isSprite=!0,this.type="Sprite",Gi===void 0){Gi=new Kt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),r=new T_(t,5);Gi.setIndex([0,1,2,0,2,3]),Gi.setAttribute("position",new Yu(r,3,0,!1)),Gi.setAttribute("uv",new Yu(r,2,3,!1))}this.geometry=Gi,this.material=e,this.center=new ve(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Wi.setFromMatrixScale(this.matrixWorld),Wh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Xi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Wi.multiplyScalar(-Xi.z);let r=this.material.rotation,i,a;r!==0&&(a=Math.cos(r),i=Math.sin(r));let n=this.center;Hn(kn.set(-.5,-.5,0),Xi,n,Wi,i,a),Hn(Ba.set(.5,-.5,0),Xi,n,Wi,i,a),Hn(Bn.set(.5,.5,0),Xi,n,Wi,i,a),Zu.set(0,0),To.set(1,0),Ju.set(1,1);let s=e.ray.intersectTriangle(kn,Ba,Bn,!1,za);if(s===null&&(Hn(Ba.set(-.5,.5,0),Xi,n,Wi,i,a),To.set(0,1),s=e.ray.intersectTriangle(kn,Bn,Ba,!1,za),s===null))return;let o=e.ray.origin.distanceTo(za);o<e.near||o>e.far||t.push({distance:o,point:za.clone(),uv:qi.getInterpolation(za,kn,Ba,Bn,Zu,To,Ju,new ve),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Hn(e,t,r,i,a,n){ji.subVectors(e,r).addScalar(.5).multiply(i),a!==void 0?(ka.x=n*ji.x-a*ji.y,ka.y=a*ji.x+n*ji.y):ka.copy(ji),e.copy(t),e.x+=ka.x,e.y+=ka.y,e.applyMatrix4(Wh)}var pa=class extends cr{constructor(e,t,r,i,a,n,s,o,l){super(e,t,r,i,a,n,s,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},yr=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let r=this.getUtoTmapping(e);return this.getPoint(r,t)}getPoints(e=5){let t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return t}getSpacedPoints(e=5){let t=[];for(let r=0;r<=e;r++)t.push(this.getPointAt(r/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],r,i=this.getPoint(0),a=0;t.push(0);for(let n=1;n<=e;n++)r=this.getPoint(n/e),a+=r.distanceTo(i),t.push(a),i=r;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let r=this.getLengths(),i=0,a=r.length,n;t?n=t:n=e*r[a-1];let s=0,o=a-1,l;for(;s<=o;)if(i=Math.floor(s+(o-s)/2),l=r[i]-n,l<0)s=i+1;else if(l>0)o=i-1;else{o=i;break}if(i=o,r[i]===n)return i/(a-1);let c=r[i],u=r[i+1]-c,h=(n-c)/u;return(i+h)/(a-1)}getTangent(e,t){let r=e-1e-4,i=e+1e-4;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),n=this.getPoint(i),s=t||(a.isVector2?new ve:new N);return s.copy(n).sub(a).normalize(),s}getTangentAt(e,t){let r=this.getUtoTmapping(e);return this.getTangent(r,t)}computeFrenetFrames(e,t){let r=new N,i=[],a=[],n=[],s=new N,o=new lt;for(let d=0;d<=e;d++){let p=d/e;i[d]=this.getTangentAt(p,new N)}a[0]=new N,n[0]=new N;let l=Number.MAX_VALUE,c=Math.abs(i[0].x),u=Math.abs(i[0].y),h=Math.abs(i[0].z);c<=l&&(l=c,r.set(1,0,0)),u<=l&&(l=u,r.set(0,1,0)),h<=l&&r.set(0,0,1),s.crossVectors(i[0],r).normalize(),a[0].crossVectors(i[0],s),n[0].crossVectors(i[0],a[0]);for(let d=1;d<=e;d++){if(a[d]=a[d-1].clone(),n[d]=n[d-1].clone(),s.crossVectors(i[d-1],i[d]),s.length()>Number.EPSILON){s.normalize();let p=Math.acos(Ct(i[d-1].dot(i[d]),-1,1));a[d].applyMatrix4(o.makeRotationAxis(s,p))}n[d].crossVectors(i[d],a[d])}if(t===!0){let d=Math.acos(Ct(a[0].dot(a[e]),-1,1));d/=e,i[0].dot(s.crossVectors(a[0],a[e]))>0&&(d=-d);for(let p=1;p<=e;p++)a[p].applyMatrix4(o.makeRotationAxis(i[p],d*p)),n[p].crossVectors(i[p],a[p])}return{tangents:i,normals:a,binormals:n}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ul=class extends yr{constructor(e=0,t=0,r=1,i=1,a=0,n=Math.PI*2,s=!1,o=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=r,this.yRadius=i,this.aStartAngle=a,this.aEndAngle=n,this.aClockwise=s,this.aRotation=o}getPoint(e,t=new ve){let r=t,i=Math.PI*2,a=this.aEndAngle-this.aStartAngle,n=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=i;for(;a>i;)a-=i;a<Number.EPSILON&&(n?a=0:a=i),this.aClockwise===!0&&!n&&(a===i?a=-i:a=a-i);let s=this.aStartAngle+e*a,o=this.aX+this.xRadius*Math.cos(s),l=this.aY+this.yRadius*Math.sin(s);if(this.aRotation!==0){let c=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=o-this.aX,d=l-this.aY;o=h*c-d*u+this.aX,l=h*u+d*c+this.aY}return r.set(o,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},w_=class extends Ul{constructor(e,t,r,i,a,n){super(e,t,r,r,i,a,n),this.isArcCurve=!0,this.type="ArcCurve"}};function Nl(){let e=0,t=0,r=0,i=0;function a(n,s,o,l){e=n,t=o,r=-3*n+3*s-2*o-l,i=2*n-2*s+o+l}return{initCatmullRom:function(n,s,o,l,c){a(s,o,c*(o-n),c*(l-s))},initNonuniformCatmullRom:function(n,s,o,l,c,u,h){let d=(s-n)/c-(o-n)/(c+u)+(o-s)/u,p=(o-s)/u-(l-s)/(u+h)+(l-o)/h;d*=u,p*=u,a(s,o,d,p)},calc:function(n){let s=n*n,o=s*n;return e+t*n+r*s+i*o}}}var Vn=new N,wo=new Nl,Ao=new Nl,Co=new Nl,A_=class extends yr{constructor(e=[],t=!1,r="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=r,this.tension=i}getPoint(e,t=new N){let r=t,i=this.points,a=i.length,n=(a-(this.closed?0:1))*e,s=Math.floor(n),o=n-s;this.closed?s+=s>0?0:(Math.floor(Math.abs(s)/a)+1)*a:o===0&&s===a-1&&(s=a-2,o=1);let l,c;this.closed||s>0?l=i[(s-1)%a]:(Vn.subVectors(i[0],i[1]).add(i[0]),l=Vn);let u=i[s%a],h=i[(s+1)%a];if(this.closed||s+2<a?c=i[(s+2)%a]:(Vn.subVectors(i[a-1],i[a-2]).add(i[a-1]),c=Vn),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(h),d),g=Math.pow(h.distanceToSquared(c),d);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),wo.initNonuniformCatmullRom(l.x,u.x,h.x,c.x,p,v,g),Ao.initNonuniformCatmullRom(l.y,u.y,h.y,c.y,p,v,g),Co.initNonuniformCatmullRom(l.z,u.z,h.z,c.z,p,v,g)}else this.curveType==="catmullrom"&&(wo.initCatmullRom(l.x,u.x,h.x,c.x,this.tension),Ao.initCatmullRom(l.y,u.y,h.y,c.y,this.tension),Co.initCatmullRom(l.z,u.z,h.z,c.z,this.tension));return r.set(wo.calc(o),Ao.calc(o),Co.calc(o)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(new N().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ku(e,t,r,i,a){let n=(i-t)*.5,s=(a-r)*.5,o=e*e,l=e*o;return(2*r-2*i+n+s)*l+(-3*r+3*i-2*n-s)*o+n*e+r}function C_(e,t){let r=1-e;return r*r*t}function R_(e,t){return 2*(1-e)*e*t}function P_(e,t){return e*e*t}function Ga(e,t,r,i){return C_(e,t)+R_(e,r)+P_(e,i)}function L_(e,t){let r=1-e;return r*r*r*t}function D_(e,t){let r=1-e;return 3*r*r*e*t}function U_(e,t){return 3*(1-e)*e*e*t}function N_(e,t){return e*e*e*t}function Wa(e,t,r,i,a){return L_(e,t)+D_(e,r)+U_(e,i)+N_(e,a)}var Xh=class extends yr{constructor(e=new ve,t=new ve,r=new ve,i=new ve){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=r,this.v3=i}getPoint(e,t=new ve){let r=t,i=this.v0,a=this.v1,n=this.v2,s=this.v3;return r.set(Wa(e,i.x,a.x,n.x,s.x),Wa(e,i.y,a.y,n.y,s.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},I_=class extends yr{constructor(e=new N,t=new N,r=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=r,this.v3=i}getPoint(e,t=new N){let r=t,i=this.v0,a=this.v1,n=this.v2,s=this.v3;return r.set(Wa(e,i.x,a.x,n.x,s.x),Wa(e,i.y,a.y,n.y,s.y),Wa(e,i.z,a.z,n.z,s.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},jh=class extends yr{constructor(e=new ve,t=new ve){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ve){let r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ve){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},O_=class extends yr{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){let r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qh=class extends yr{constructor(e=new ve,t=new ve,r=new ve){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new ve){let r=t,i=this.v0,a=this.v1,n=this.v2;return r.set(Ga(e,i.x,a.x,n.x),Ga(e,i.y,a.y,n.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},F_=class extends yr{constructor(e=new N,t=new N,r=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new N){let r=t,i=this.v0,a=this.v1,n=this.v2;return r.set(Ga(e,i.x,a.x,n.x),Ga(e,i.y,a.y,n.y),Ga(e,i.z,a.z,n.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yh=class extends yr{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ve){let r=t,i=this.points,a=(i.length-1)*e,n=Math.floor(a),s=a-n,o=i[n===0?n:n-1],l=i[n],c=i[n>i.length-2?i.length-1:n+1],u=i[n>i.length-3?i.length-1:n+2];return r.set(Ku(s,o.x,l.x,c.x,u.x),Ku(s,o.y,l.y,c.y,u.y)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){let i=e.points[t];this.points.push(new ve().fromArray(i))}return this}},$u=Object.freeze({__proto__:null,ArcCurve:w_,CatmullRomCurve3:A_,CubicBezierCurve:Xh,CubicBezierCurve3:I_,EllipseCurve:Ul,LineCurve:jh,LineCurve3:O_,QuadraticBezierCurve:qh,QuadraticBezierCurve3:F_,SplineCurve:Yh}),z_=class extends yr{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let r=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $u[r](t,e))}return this}getPoint(e,t){let r=e*this.getLength(),i=this.getCurveLengths(),a=0;for(;a<i.length;){if(i[a]>=r){let n=i[a]-r,s=this.curves[a],o=s.getLength(),l=o===0?0:1-n/o;return s.getPointAt(l,t)}a++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let r=0,i=this.curves.length;r<i;r++)t+=this.curves[r].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],r;for(let i=0,a=this.curves;i<a.length;i++){let n=a[i],s=n.isEllipseCurve?e*2:n.isLineCurve||n.isLineCurve3?1:n.isSplineCurve?e*n.points.length:e,o=n.getPoints(s);for(let l=0;l<o.length;l++){let c=o[l];r&&r.equals(c)||(t.push(c),r=c)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,r=this.curves.length;t<r;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){let i=e.curves[t];this.curves.push(new $u[i.type]().fromJSON(i))}return this}},k_=class extends z_{constructor(e){super(),this.type="Path",this.currentPoint=new ve,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,r=e.length;t<r;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let r=new jh(this.currentPoint.clone(),new ve(e,t));return this.curves.push(r),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,r,i){let a=new qh(this.currentPoint.clone(),new ve(e,t),new ve(r,i));return this.curves.push(a),this.currentPoint.set(r,i),this}bezierCurveTo(e,t,r,i,a,n){let s=new Xh(this.currentPoint.clone(),new ve(e,t),new ve(r,i),new ve(a,n));return this.curves.push(s),this.currentPoint.set(a,n),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),r=new Yh(t);return this.curves.push(r),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,r,i,a,n){let s=this.currentPoint.x,o=this.currentPoint.y;return this.absarc(e+s,t+o,r,i,a,n),this}absarc(e,t,r,i,a,n){return this.absellipse(e,t,r,r,i,a,n),this}ellipse(e,t,r,i,a,n,s,o){let l=this.currentPoint.x,c=this.currentPoint.y;return this.absellipse(e+l,t+c,r,i,a,n,s,o),this}absellipse(e,t,r,i,a,n,s,o){let l=new Ul(e,t,r,i,a,n,s,o);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let c=l.getPoint(1);return this.currentPoint.copy(c),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},B_=class Zh extends Kt{constructor(t=[new ve(0,-.5),new ve(.5,0),new ve(0,.5)],r=12,i=0,a=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:r,phiStart:i,phiLength:a},r=Math.floor(r),a=Ct(a,0,Math.PI*2);let n=[],s=[],o=[],l=[],c=[],u=1/r,h=new N,d=new ve,p=new N,v=new N,g=new N,m=0,f=0;for(let b=0;b<=t.length-1;b++)switch(b){case 0:m=t[b+1].x-t[b].x,f=t[b+1].y-t[b].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(g.x,g.y,g.z);break;default:m=t[b+1].x-t[b].x,f=t[b+1].y-t[b].y,p.x=f*1,p.y=-m,p.z=f*0,v.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),l.push(p.x,p.y,p.z),g.copy(v)}for(let b=0;b<=r;b++){let M=i+b*u*a,C=Math.sin(M),G=Math.cos(M);for(let E=0;E<=t.length-1;E++){h.x=t[E].x*C,h.y=t[E].y,h.z=t[E].x*G,s.push(h.x,h.y,h.z),d.x=b/r,d.y=E/(t.length-1),o.push(d.x,d.y);let A=l[3*E+0]*C,k=l[3*E+1],y=l[3*E+0]*G;c.push(A,k,y)}}for(let b=0;b<r;b++)for(let M=0;M<t.length-1;M++){let C=M+b*t.length,G=C,E=C+t.length,A=C+t.length+1,k=C+1;n.push(G,E,k),n.push(A,k,E)}this.setIndex(n),this.setAttribute("position",new gt(s,3)),this.setAttribute("uv",new gt(o,2)),this.setAttribute("normal",new gt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zh(t.points,t.segments,t.phiStart,t.phiLength)}},Jh=class Kh extends B_{constructor(t=1,r=1,i=4,a=8){let n=new k_;n.absarc(0,-r/2,t,Math.PI*1.5,0),n.absarc(0,r/2,t,0,Math.PI*.5),super(n.getPoints(i),a),this.type="CapsuleGeometry",this.parameters={radius:t,length:r,capSegments:i,radialSegments:a}}static fromJSON(t){return new Kh(t.radius,t.length,t.capSegments,t.radialSegments)}},Il=class $h extends Kt{constructor(t=1,r=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:r,thetaStart:i,thetaLength:a},r=Math.max(3,r);let n=[],s=[],o=[],l=[],c=new N,u=new ve;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=r;h++,d+=3){let p=i+h/r*a;c.x=t*Math.cos(p),c.y=t*Math.sin(p),s.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(s[d]/t+1)/2,u.y=(s[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=r;h++)n.push(h,h+1,0);this.setIndex(n),this.setAttribute("position",new gt(s,3)),this.setAttribute("normal",new gt(o,3)),this.setAttribute("uv",new gt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $h(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ol=class Qh extends Kt{constructor(t=1,r=1,i=1,a=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:r,height:i,radialSegments:a,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};let c=this;a=Math.floor(a),n=Math.floor(n);let u=[],h=[],d=[],p=[],v=0,g=[],m=i/2,f=0;b(),s===!1&&(t>0&&M(!0),r>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new gt(h,3)),this.setAttribute("normal",new gt(d,3)),this.setAttribute("uv",new gt(p,2));function b(){let C=new N,G=new N,E=0,A=(r-t)/i;for(let k=0;k<=n;k++){let y=[],S=k/n,U=S*(r-t)+t;for(let H=0;H<=a;H++){let q=H/a,Y=q*l+o,re=Math.sin(Y),Q=Math.cos(Y);G.x=U*re,G.y=-S*i+m,G.z=U*Q,h.push(G.x,G.y,G.z),C.set(re,A,Q).normalize(),d.push(C.x,C.y,C.z),p.push(q,1-S),y.push(v++)}g.push(y)}for(let k=0;k<a;k++)for(let y=0;y<n;y++){let S=g[y][k],U=g[y+1][k],H=g[y+1][k+1],q=g[y][k+1];(t>0||y!==0)&&(u.push(S,U,q),E+=3),(r>0||y!==n-1)&&(u.push(U,H,q),E+=3)}c.addGroup(f,E,0),f+=E}function M(C){let G=v,E=new ve,A=new N,k=0,y=C===!0?t:r,S=C===!0?1:-1;for(let H=1;H<=a;H++)h.push(0,m*S,0),d.push(0,S,0),p.push(.5,.5),v++;let U=v;for(let H=0;H<=a;H++){let q=H/a*l+o,Y=Math.cos(q),re=Math.sin(q);A.x=y*re,A.y=m*S,A.z=y*Y,h.push(A.x,A.y,A.z),d.push(0,S,0),E.x=Y*.5+.5,E.y=re*.5*S+.5,p.push(E.x,E.y),v++}for(let H=0;H<a;H++){let q=G+H,Y=U+H;C===!0?u.push(Y,Y+1,q):u.push(Y+1,Y,q),k+=3}c.addGroup(f,k,C===!0?1:2),f+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qh(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ka=class ed extends Ol{constructor(t=1,r=1,i=32,a=1,n=!1,s=0,o=Math.PI*2){super(0,t,r,i,a,n,s,o),this.type="ConeGeometry",this.parameters={radius:t,height:r,radialSegments:i,heightSegments:a,openEnded:n,thetaStart:s,thetaLength:o}}static fromJSON(t){return new ed(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},td=class rd extends Kt{constructor(t=1,r=32,i=16,a=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:r,heightSegments:i,phiStart:a,phiLength:n,thetaStart:s,thetaLength:o},r=Math.max(3,Math.floor(r)),i=Math.max(2,Math.floor(i));let l=Math.min(s+o,Math.PI),c=0,u=[],h=new N,d=new N,p=[],v=[],g=[],m=[];for(let f=0;f<=i;f++){let b=[],M=f/i,C=0;f===0&&s===0?C=.5/r:f===i&&l===Math.PI&&(C=-.5/r);for(let G=0;G<=r;G++){let E=G/r;h.x=-t*Math.cos(a+E*n)*Math.sin(s+M*o),h.y=t*Math.cos(s+M*o),h.z=t*Math.sin(a+E*n)*Math.sin(s+M*o),v.push(h.x,h.y,h.z),d.copy(h).normalize(),g.push(d.x,d.y,d.z),m.push(E+C,1-M),b.push(c++)}u.push(b)}for(let f=0;f<i;f++)for(let b=0;b<r;b++){let M=u[f][b+1],C=u[f][b],G=u[f+1][b],E=u[f+1][b+1];(f!==0||s>0)&&p.push(M,C,E),(f!==i-1||l<Math.PI)&&p.push(C,G,E)}this.setIndex(p),this.setAttribute("position",new gt(v,3)),this.setAttribute("normal",new gt(g,3)),this.setAttribute("uv",new gt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rd(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},id=class ad extends Kt{constructor(t=1,r=.4,i=12,a=48,n=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:r,radialSegments:i,tubularSegments:a,arc:n},i=Math.floor(i),a=Math.floor(a);let s=[],o=[],l=[],c=[],u=new N,h=new N,d=new N;for(let p=0;p<=i;p++)for(let v=0;v<=a;v++){let g=v/a*n,m=p/i*Math.PI*2;h.x=(t+r*Math.cos(m))*Math.cos(g),h.y=(t+r*Math.cos(m))*Math.sin(g),h.z=r*Math.sin(m),o.push(h.x,h.y,h.z),u.x=t*Math.cos(g),u.y=t*Math.sin(g),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(v/a),c.push(p/i)}for(let p=1;p<=i;p++)for(let v=1;v<=a;v++){let g=(a+1)*p+v-1,m=(a+1)*(p-1)+v-1,f=(a+1)*(p-1)+v,b=(a+1)*p+v;s.push(g,m,b),s.push(m,f,b)}this.setIndex(s),this.setAttribute("position",new gt(o,3)),this.setAttribute("normal",new gt(l,3)),this.setAttribute("uv",new gt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ad(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},Fl=class extends ca{static get type(){return"MeshToonMaterial"}constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.color=new je(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vh,this.normalScale=new ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};function Gn(e,t,r){return!e||!r&&e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function H_(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}var ns=class{constructor(e,t,r,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(r),this.sampleValues=t,this.valueSize=r,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,r=this._cachedIndex,i=t[r],a=t[r-1];r:{e:{let n;t:{i:if(!(e<i)){for(let s=r+2;;){if(i===void 0){if(e<a)break i;return r=t.length,this._cachedIndex=r,this.copySampleValue_(r-1)}if(r===s)break;if(a=i,i=t[++r],e<i)break e}n=t.length;break t}if(!(e>=a)){let s=t[1];e<s&&(r=2,a=s);for(let o=r-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===o)break;if(i=a,a=t[--r-1],e>=a)break e}n=r,r=0;break t}break r}for(;r<n;){let s=r+n>>>1;e<t[s]?n=s:r=s+1}if(i=t[r],a=t[r-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return r=t.length,this._cachedIndex=r,this.copySampleValue_(r-1)}this._cachedIndex=r,this.intervalChanged_(r,a,i)}return this.interpolate_(r,a,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,r=this.sampleValues,i=this.valueSize,a=e*i;for(let n=0;n!==i;++n)t[n]=r[a+n];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},V_=class extends ns{constructor(e,t,r,i){super(e,t,r,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:$c,endingEnd:$c}}intervalChanged_(e,t,r){let i=this.parameterPositions,a=e-2,n=e+1,s=i[a],o=i[n];if(s===void 0)switch(this.getSettings_().endingStart){case Qc:a=e,s=2*t-r;break;case eu:a=i.length-2,s=t+i[a]-i[a+1];break;default:a=e,s=r}if(o===void 0)switch(this.getSettings_().endingEnd){case Qc:n=e,o=2*r-t;break;case eu:n=1,o=r+i[1]-i[0];break;default:n=e-1,o=t}let l=(r-t)*.5,c=this.valueSize;this._weightPrev=l/(t-s),this._weightNext=l/(o-r),this._offsetPrev=a*c,this._offsetNext=n*c}interpolate_(e,t,r,i){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,c=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,d=this._weightNext,p=(r-t)/(i-t),v=p*p,g=v*p,m=-h*g+2*h*v-h*p,f=(1+h)*g+(-1.5-2*h)*v+(-.5+h)*p+1,b=(-1-d)*g+(1.5+d)*v+.5*p,M=d*g-d*v;for(let C=0;C!==s;++C)a[C]=m*n[c+C]+f*n[l+C]+b*n[o+C]+M*n[u+C];return a}},G_=class extends ns{constructor(e,t,r,i){super(e,t,r,i)}interpolate_(e,t,r,i){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,c=(r-t)/(i-t),u=1-c;for(let h=0;h!==s;++h)a[h]=n[l+h]*u+n[o+h]*c;return a}},W_=class extends ns{constructor(e,t,r,i){super(e,t,r,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Nr=class{constructor(e,t,r,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Gn(t,this.TimeBufferType),this.values=Gn(r,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,r;if(t.toJSON!==this.toJSON)r=t.toJSON(e);else{r={name:e.name,times:Gn(e.times,Array),values:Gn(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(r.interpolation=i)}return r.type=e.ValueTypeName,r}InterpolantFactoryMethodDiscrete(e){return new W_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new G_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new V_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case $n:t=this.InterpolantFactoryMethodDiscrete;break;case ml:t=this.InterpolantFactoryMethodLinear;break;case Ys:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let r="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(r);return console.warn("THREE.KeyframeTrack:",r),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return $n;case this.InterpolantFactoryMethodLinear:return ml;case this.InterpolantFactoryMethodSmooth:return Ys}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let r=0,i=t.length;r!==i;++r)t[r]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let r=0,i=t.length;r!==i;++r)t[r]*=e}return this}trim(e,t){let r=this.times,i=r.length,a=0,n=i-1;for(;a!==i&&r[a]<e;)++a;for(;n!==-1&&r[n]>t;)--n;if(++n,a!==0||n!==i){a>=n&&(n=Math.max(n,1),a=n-1);let s=this.getValueSize();this.times=r.slice(a,n),this.values=this.values.slice(a*s,n*s)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let r=this.times,i=this.values,a=r.length;a===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let n=null;for(let s=0;s!==a;s++){let o=r[s];if(typeof o=="number"&&isNaN(o)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,s,o),e=!1;break}if(n!==null&&n>o){console.error("THREE.KeyframeTrack: Out of order keys.",this,s,o,n),e=!1;break}n=o}if(i!==void 0&&H_(i))for(let s=0,o=i.length;s!==o;++s){let l=i[s];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,s,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),r=this.getValueSize(),i=this.getInterpolation()===Ys,a=e.length-1,n=1;for(let s=1;s<a;++s){let o=!1,l=e[s],c=e[s+1];if(l!==c&&(s!==1||l!==e[0]))if(i)o=!0;else{let u=s*r,h=u-r,d=u+r;for(let p=0;p!==r;++p){let v=t[u+p];if(v!==t[h+p]||v!==t[d+p]){o=!0;break}}}if(o){if(s!==n){e[n]=e[s];let u=s*r,h=n*r;for(let d=0;d!==r;++d)t[h+d]=t[u+d]}++n}}if(a>0){e[n]=e[a];for(let s=a*r,o=n*r,l=0;l!==r;++l)t[o+l]=t[s+l];++n}return n!==e.length?(this.times=e.slice(0,n),this.values=t.slice(0,n*r)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),r=this.constructor,i=new r(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Nr.prototype.TimeBufferType=Float32Array;Nr.prototype.ValueBufferType=Float32Array;Nr.prototype.DefaultInterpolation=ml;var $a=class extends Nr{constructor(e,t,r){super(e,t,r)}};$a.prototype.ValueTypeName="bool";$a.prototype.ValueBufferType=Array;$a.prototype.DefaultInterpolation=$n;$a.prototype.InterpolantFactoryMethodLinear=void 0;$a.prototype.InterpolantFactoryMethodSmooth=void 0;var X_=class extends Nr{};X_.prototype.ValueTypeName="color";var j_=class extends Nr{};j_.prototype.ValueTypeName="number";var q_=class extends ns{constructor(e,t,r,i){super(e,t,r,i)}interpolate_(e,t,r,i){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=(r-t)/(i-t),l=e*s;for(let c=l+s;l!==c;l+=4)la.slerpFlat(a,0,n,l-s,n,l,o);return a}},nd=class extends Nr{InterpolantFactoryMethodLinear(e){return new q_(this.times,this.values,this.getValueSize(),e)}};nd.prototype.ValueTypeName="quaternion";nd.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends Nr{constructor(e,t,r){super(e,t,r)}};Qa.prototype.ValueTypeName="string";Qa.prototype.ValueBufferType=Array;Qa.prototype.DefaultInterpolation=$n;Qa.prototype.InterpolantFactoryMethodLinear=void 0;Qa.prototype.InterpolantFactoryMethodSmooth=void 0;var Y_=class extends Nr{};Y_.prototype.ValueTypeName="vector";var Z_=class{constructor(e,t,r){let i=this,a=!1,n=0,s=0,o,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=r,this.itemStart=function(c){s++,a===!1&&i.onStart!==void 0&&i.onStart(c,n,s),a=!0},this.itemEnd=function(c){n++,i.onProgress!==void 0&&i.onProgress(c,n,s),n===s&&(a=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(c){i.onError!==void 0&&i.onError(c)},this.resolveURL=function(c){return o?o(c):c},this.setURLModifier=function(c){return o=c,this},this.addHandler=function(c,u){return l.push(c,u),this},this.removeHandler=function(c){let u=l.indexOf(c);return u!==-1&&l.splice(u,2),this},this.getHandler=function(c){for(let u=0,h=l.length;u<h;u+=2){let d=l[u],p=l[u+1];if(d.global&&(d.lastIndex=0),d.test(c))return p}return null}}},J_=new Z_,K_=class{constructor(e){this.manager=e!==void 0?e:J_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let r=this;return new Promise(function(i,a){r.load(e,i,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};K_.DEFAULT_MATERIAL_NAME="__DEFAULT";var zl=class extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},sd=class extends zl{constructor(e,t,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Ro=new lt,Qu=new N,eh=new N,$_=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ve(512,512),this.map=null,this.mapPass=null,this.matrix=new lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pl,this._frameExtents=new ve(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,r=this.matrix;Qu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Qu),eh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(eh),t.updateMatrixWorld(),Ro.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ro),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Ro)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Q_=class extends $_{constructor(){super(new ua(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},od=class extends zl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new Q_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},ld=class extends zl{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}},kl=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=th(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=th();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function th(){return performance.now()}var Bl="\\[\\]\\.:\\/",ex=new RegExp("["+Bl+"]","g"),Hl="[^"+Bl+"]",tx="[^"+Bl.replace("\\.","")+"]",rx=/((?:WC+[\/:])*)/.source.replace("WC",Hl),ix=/(WCOD+)?/.source.replace("WCOD",tx),ax=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Hl),nx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Hl),sx=new RegExp("^"+rx+ix+ax+nx+"$"),ox=["material","materials","bones","map"],lx=class{constructor(e,t,r){let i=r||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let r=this._targetGroup.nCachedObjects_,i=this._bindings[r];i!==void 0&&i.getValue(e,t)}setValue(e,t){let r=this._bindings;for(let i=this._targetGroup.nCachedObjects_,a=r.length;i!==a;++i)r[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,r=e.length;t!==r;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,r=e.length;t!==r;++t)e[t].unbind()}},ft=class Zi{constructor(t,r,i){this.path=r,this.parsedPath=i||Zi.parseTrackName(r),this.node=Zi.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,r,i){return t&&t.isAnimationObjectGroup?new Zi.Composite(t,r,i):new Zi(t,r,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(ex,"")}static parseTrackName(t){let r=sx.exec(t);if(r===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:r[2],objectName:r[3],objectIndex:r[4],propertyName:r[5],propertyIndex:r[6]},a=i.nodeName&&i.nodeName.lastIndexOf(".");if(a!==void 0&&a!==-1){let n=i.nodeName.substring(a+1);ox.indexOf(n)!==-1&&(i.nodeName=i.nodeName.substring(0,a),i.objectName=n)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,r){if(r===void 0||r===""||r==="."||r===-1||r===t.name||r===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(r);if(i!==void 0)return i}if(t.children){let i=function(n){for(let s=0;s<n.length;s++){let o=n[s];if(o.name===r||o.uuid===r)return o;let l=i(o.children);if(l)return l}return null},a=i(t.children);if(a)return a}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,r){t[r]=this.targetObject[this.propertyName]}_getValue_array(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)t[r++]=i[a]}_getValue_arrayElement(t,r){t[r]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,r){this.resolvedProperty.toArray(t,r)}_setValue_direct(t,r){this.targetObject[this.propertyName]=t[r]}_setValue_direct_setNeedsUpdate(t,r){this.targetObject[this.propertyName]=t[r],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,r){this.targetObject[this.propertyName]=t[r],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)i[a]=t[r++]}_setValue_array_setNeedsUpdate(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)i[a]=t[r++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,r){let i=this.resolvedProperty;for(let a=0,n=i.length;a!==n;++a)i[a]=t[r++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,r){this.resolvedProperty[this.propertyIndex]=t[r]}_setValue_arrayElement_setNeedsUpdate(t,r){this.resolvedProperty[this.propertyIndex]=t[r],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,r){this.resolvedProperty[this.propertyIndex]=t[r],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,r){this.resolvedProperty.fromArray(t,r)}_setValue_fromArray_setNeedsUpdate(t,r){this.resolvedProperty.fromArray(t,r),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,r){this.resolvedProperty.fromArray(t,r),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,r){this.bind(),this.getValue(t,r)}_setValue_unbound(t,r){this.bind(),this.setValue(t,r)}bind(){let t=this.node,r=this.parsedPath,i=r.objectName,a=r.propertyName,n=r.propertyIndex;if(t||(t=Zi.findNode(this.rootNode,r.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=r.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let s=t[a];if(s===void 0){let c=r.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+a+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(a==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[n]!==void 0&&(n=t.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=n}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=a;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ft.Composite=lx;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ux=new Float32Array(1),rh=new lt,cd=class{constructor(e,t,r=0,i=1/0){this.ray=new wh(e,t),this.near=r,this.far=i,this.camera=null,this.layers=new Rl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rh),this}intersectObject(e,t=!0,r=[]){return yl(e,this,r,t),r.sort(ih),r}intersectObjects(e,t=!0,r=[]){for(let i=0,a=e.length;i<a;i++)yl(e[i],this,r,t);return r.sort(ih),r}};function ih(e,t){return e.distance-t.distance}function yl(e,t,r,i){let a=!0;if(e.layers.test(t.layers)&&e.raycast(t,r)===!1&&(a=!1),a===!0&&i===!0){let n=e.children;for(let s=0,o=n.length;s<o;s++)yl(n[s],t,r,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ml}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ml);var Mr=1.16,Vl=52*Math.PI/180,ud=18*Math.PI/180,fa=new Map;function kt(e,t,r){let i=`b${e}_${t}_${r}`,a=fa.get(i);return a||(a=new Ya(e,t,r),fa.set(i,a)),a}function vd(e,t,r){let i=`c${e}_${t}_${r}`,a=fa.get(i);return a||(a=new Ol(e,e,t,r),fa.set(i,a)),a}function Sr(e,t,r){let i=`s${e}_${t}_${r}`,a=fa.get(i);return a||(a=new td(e,t,r),fa.set(i,a)),a}var Qr;function _d(){if(Qr)return Qr;let e=document.createElement("canvas");e.width=4,e.height=1;let t=e.getContext("2d");return["#6a6a6a","#9d9d9d","#d2d2d2","#ffffff"].forEach((r,i)=>{t.fillStyle=r,t.fillRect(i,0,1,1)}),Qr=new pa(e),Qr.magFilter=Wt,Qr.minFilter=Wt,Qr.generateMipmaps=!1,Qr.colorSpace=vr,Qr}var hd=new Map;function Ce(e){let t=typeof e=="number"?e:String(e),r=hd.get(t);return r||(r=new Fl({color:e,gradientMap:_d()}),hd.set(t,r)),r}var dd=new zt({color:2371652}),pd=new zt({color:16769162}),fd=new zt({color:12924474}),md=new zt({color:16774084}),cx=new zt({transparent:!0,opacity:0,depthWrite:!1,colorWrite:!1}),Gl,Wl;function ux(e){return e==="toon"?(Gl||(Gl=new Fl({color:16777215,vertexColors:!0,gradientMap:_d()})),Gl):(Wl||(Wl=new zt({color:16777215,vertexColors:!0})),Wl)}function hx(e,t){let r=e.getAttribute("position").count,i=new Float32Array(r*3);for(let a=0;a<r;a+=1)i[a*3]=t.r,i[a*3+1]=t.g,i[a*3+2]=t.b;e.setAttribute("color",new Rt(i,3))}function dx(e){let t=0,r=0;for(let u of e){let h=u.getAttribute("position").count;t+=h,r+=u.index?u.index.count:h}let i=new Float32Array(t*3),a=new Float32Array(t*3),n=new Float32Array(t*3),s=new Uint32Array(r),o=0,l=0;for(let u of e){let h=u.getAttribute("position"),d=u.getAttribute("normal"),p=u.getAttribute("color");if(i.set(h.array,o*3),d&&a.set(d.array,o*3),p&&n.set(p.array,o*3),u.index)for(let v=0;v<u.index.count;v+=1)s[l++]=u.index.getX(v)+o;else for(let v=0;v<h.count;v+=1)s[l++]=o+v;o+=h.count}let c=new Kt;return c.setAttribute("position",new Rt(i,3)),c.setAttribute("normal",new Rt(a,3)),c.setAttribute("color",new Rt(n,3)),c.setIndex(new Rt(s,1)),c}function ql(e){e.updateMatrixWorld(!0);let t=new lt().copy(e.matrixWorld).invert(),r=new Map,i=[];e.traverse(a=>{if(!a.isMesh||a.material.transparent)return;let n=a;for(;n;){if(n.userData&&n.userData.keep)return;n=n.parent}let s=a.geometry.clone();s.applyMatrix4(new lt().multiplyMatrices(t,a.matrixWorld)),hx(s,a.material.color);let o=a.material.type==="MeshToonMaterial"?"toon":"basic",l=r.get(o);l||(l={kind:o,cast:!1,geos:[]},r.set(o,l)),l.cast=l.cast||a.castShadow,l.geos.push(s),i.push(a)});for(let a of i)a.removeFromParent();for(let a of r.values()){let n=new mt(dx(a.geos),ux(a.kind));n.castShadow=a.cast,n.receiveShadow=!0,e.add(n)}}function nt(e,t,r,i,a,n=!1){let s=new mt(e,t);return s.position.set(r,i,a),s.castShadow=n,s.receiveShadow=!1,s}function be(e,t,r,i,a,n,s,o=!1){return nt(kt(e,t,r),i,a,n,s,o)}function Yl(e){let t=new Ut,r=new Ut;t.add(r);let i=Ce(16054267),a=Ce(e),n=Ce(1842982),s=Ce(2237998),o=Ce(14015459),l=Ce(12963542);r.add(be(.64,.26,1.02,i,0,.36,.04,!0)),r.add(be(.62,.42,.74,i,0,.66,.14,!0)),r.add(be(.66,.07,.78,i,0,.9,.14,!0)),r.add(be(.5,.03,.74,a,0,.945,.14));let c=be(.58,.08,.3,i,0,.4,-.42,!0);c.rotation.x=-.45,r.add(c),r.add(be(.66,.07,.06,n,0,.22,-.52)),r.add(be(.66,.07,.06,n,0,.22,.56)),r.add(be(.035,.12,.92,a,.328,.4,.05)),r.add(be(.035,.12,.92,a,-.328,.4,.05));let u=be(.5,.24,.02,dd,0,.64,-.22);u.rotation.x=-.42,r.add(u);for(let p of[-1,1])for(let v=0;v<3;v+=1)r.add(be(.02,.16,.16,dd,p*.318,.66,.02+v*.2));r.add(be(.02,.3,.018,n,-.322,.5,-.02)),r.add(be(.16,.035,.2,l,0,.99,.08)),r.add(be(.1,.02,.14,o,0,1.02,.08)),r.add(be(.025,.03,.62,Ce(9279395),.24,1,.16)),r.add(be(.025,.03,.62,Ce(9279395),-.24,1,.16)),r.add(be(.5,.02,.03,Ce(9279395),0,1,0)),r.add(be(.5,.02,.03,Ce(9279395),0,1,.36)),r.add(be(.1,.045,.04,n,.36,.56,-.26)),r.add(be(.1,.045,.04,n,-.36,.56,-.26)),r.add(be(.07,.05,.02,pd,-.18,.32,-.54)),r.add(be(.07,.05,.02,pd,.18,.32,-.54)),r.add(be(.07,.045,.02,fd,-.18,.34,.58)),r.add(be(.07,.045,.02,fd,.18,.34,.58));let h=[];for(let[p,v]of[[-.28,-.32],[.28,-.32],[-.28,.4],[.28,.4]]){let g=new Ut;g.position.set(p,.135,v);let m=nt(vd(.135,.08,10),s,0,0,0,!1);m.rotation.z=Math.PI/2,g.userData.keep=!0,g.add(m),r.add(g),h.push(g)}let d=[];for(let p=0;p<4;p+=1){let v=nt(Sr(.045,6,5),a,.3,.58,-.02+p*.16);v.visible=!1,v.userData.keep=!0,r.add(v),d.push(v)}return t.userData.body=r,t.userData.wheels=h,t.userData.seats=d,t.userData.color=e,t}function Zl(e,t){if(!t||t==="plain")return;let r=e.userData.body,i=e.userData.color,a=Ce(i);if(t==="stripes")r.add(be(.025,.045,.88,a,.335,.52,.06)),r.add(be(.025,.045,.88,a,-.335,.52,.06)),r.add(be(.1,.03,.7,a,0,.985,.14));else if(t==="chequers"){let n=Ce(1844272);for(let s=0;s<7;s+=1){let o=s%2?a:n;r.add(be(.028,.08,.09,o,.335,.48,-.34+s*.12)),r.add(be(.028,.08,.09,o,-.335,.48,-.34+s*.12))}}else if(t==="stars"){let n=Ce(15909198);for(let s of[-.12,.12,.36])r.add(nt(Sr(.045,6,5),n,.34,.56,s)),r.add(nt(Sr(.045,6,5),n,-.34,.56,s))}else if(t==="zigzag")for(let n=0;n<4;n+=1)for(let s of[-1,1]){let o=be(.028,.05,.18,a,s*.335,.5,-.22+n*.2);o.rotation.x=n%2?.7:-.7,r.add(o)}else if(t==="flowers"){let n=Ce(15035048),s=Ce(15909198);for(let o of[-.02,.22,.46])for(let l of[-1,1])r.add(nt(Sr(.05,6,5),n,l*.22,1,o)),r.add(nt(Sr(.025,5,4),s,l*.22,1.04,o))}else if(t==="flames"){let n=Ce(15759914),s=Ce(15909198);for(let o of[-1,1]){let l=be(.04,.12,.24,n,o*.33,.44,.34);l.rotation.y=o*.15;let c=be(.03,.07,.14,s,o*.34,.44,.38);r.add(l,c)}}}function px(){let e=new Ut,t=Ce(13022346),r=Ce(11573874);e.add(be(.78,.5,1.1,t,0,.46,.04,!0)),e.add(be(.62,.18,.62,t,.04,.76,.08,!0));let i=be(.58,.22,.32,t,0,.36,-.46);return i.rotation.x=-.5,e.add(i),e.add(be(.8,.06,1.14,r,0,.24,.04)),e}var Xl;function fx(){if(!Xl){let t=document.createElement("canvas");t.width=128,t.height=128;let r=t.getContext("2d");r.fillStyle="#ffffff",r.beginPath(),r.arc(64,64,56,0,Math.PI*2),r.fill(),r.lineWidth=8,r.strokeStyle="#1c2430",r.stroke(),r.fillStyle="#1c2430",r.font="700 78px Nunito, sans-serif",r.textAlign="center",r.textBaseline="middle",r.fillText("?",64,70);let i=new pa(t);i.colorSpace=Mt,Xl=new da({map:i,transparent:!0,depthWrite:!1}),document.fonts&&document.fonts.ready&&document.fonts.ready.then(()=>{r.clearRect(0,0,128,128),r.fillStyle="#ffffff",r.beginPath(),r.arc(64,64,56,0,Math.PI*2),r.fill(),r.lineWidth=8,r.strokeStyle="#1c2430",r.stroke(),r.fillStyle="#1c2430",r.font="700 78px Nunito, sans-serif",r.textAlign="center",r.textBaseline="middle",r.fillText("?",64,70),i.needsUpdate=!0}).catch(()=>{})}let e=new Ja(Xl);return e.scale.set(.46,.46,1),e.position.y=1.32,e}function mx(){let e=new Ut,t=nt(kt(.2,.035,.06),md,-.07,1.08,-.02);t.rotation.y=.55;let r=nt(kt(.2,.035,.06),md,.07,1.08,-.02);return r.rotation.y=-.55,e.add(t,r),e}function xd(e){let t=document.createElement("canvas");t.width=64,t.height=64;let r=t.getContext("2d");r.fillStyle="#ffffff",r.beginPath(),r.arc(32,32,28,0,Math.PI*2),r.fill(),r.strokeStyle="#1c2430",r.lineWidth=6,r.lineCap="round";let i=e%8;i===0?(r.beginPath(),r.moveTo(32,14),r.lineTo(32,50),r.stroke()):i===1?(r.beginPath(),r.moveTo(14,32),r.lineTo(50,32),r.stroke()):i===2?(r.beginPath(),r.arc(32,32,12,0,Math.PI*2),r.stroke()):i===3?(r.strokeRect(22,16,8,28),r.strokeRect(22,36,20,8)):i===4?(r.beginPath(),r.moveTo(18,44),r.lineTo(32,16),r.lineTo(46,44),r.stroke()):i===5?(r.fillStyle="#1c2430",r.fillRect(20,20,24,24)):i===6?(r.beginPath(),r.moveTo(32,16),r.lineTo(32,46),r.moveTo(22,36),r.lineTo(32,48),r.lineTo(42,36),r.stroke()):(r.beginPath(),r.arc(32,34,12,Math.PI*.2,Math.PI*1.4),r.stroke());let a=new pa(t);a.colorSpace=Mt;let n=new Ja(new da({map:a,transparent:!0,depthWrite:!1}));return n.scale.set(.28,.28,1),n}function gx(){let e=document.createElement("canvas");e.width=128,e.height=128;let t=e.getContext("2d"),r=new pa(e);r.colorSpace=Mt;let i=new Ja(new da({map:r,transparent:!0,depthWrite:!1}));return i.scale.set(.42,.42,1),i.userData.paint=a=>{t.clearRect(0,0,128,128),t.fillStyle="#ffffff",t.beginPath(),t.arc(64,64,56,0,Math.PI*2),t.fill(),t.strokeStyle="#1c2430",t.lineWidth=8,t.stroke(),t.fillStyle="#1c2430",t.font="700 64px Nunito, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(String(a),64,70),r.needsUpdate=!0},i.userData.paint(1),i}function gd(e,t,r,i,a){let n=new Ut,s=Ce(e),o=Ce(15779746),l=nt(new Jh(.11,.16,2,8),s,0,.32,0,!1),c=nt(Sr(.105,8,6),o,0,.56,0,!1);if(n.add(l,c),a!=null){let h=xd(a);h.position.set(0,.78,0),h.scale.set(.22,.22,1),n.add(h)}if(i&&n.add(nt(kt(.16,.12,.12),Ce(13206570),.16,.2,.02)),r){let h=be(.18,.14,.12,Ce(15909198),0,.32,.02),d=nt(vd(.09,.045,8),Ce(2371652),0,.66,0),p=be(.14,.02,.08,Ce(2371652),0,.64,.06);n.add(h,d,p)}else if(t!==2){let h=nt(Sr(.11,8,6),Ce(t===0?2761760:5913128),0,.62,-.01);h.scale.y=.55,n.add(h)}!r&&t===1&&n.add(be(.08,.09,.05,Ce(1844272),.12,.3,0));let u=t===2?1.06:t===0?.94:1;return n.scale.setScalar(u),ql(n),n}function vx(e){return[0,-Math.PI/2,Math.PI,Math.PI/2][e]||0}function _x(e,t,r){let i=t-e;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return e+i*r}function yd(e,t){let r=Math.min(globalThis.devicePixelRatio||1,2),i=new Dl({canvas:e,antialias:r<1.5,alpha:t,powerPreference:"high-performance"});return i.setPixelRatio(r),i.outputColorSpace=Mt,i.shadowMap.enabled=!0,i.shadowMap.type=1,t||i.setClearColor(12050162,1),i}function Jl(e,t){e.add(new sd(14151423,9085050,.7)),e.add(new ld(16777215,.28));let r=new od(16774890,1.35);if(r.position.set(-5,11,6),t){r.castShadow=!0,r.shadow.mapSize.set(256,256),r.shadow.autoUpdate=!1,r.shadow.needsUpdate=!0,r.shadow.bias=-4e-4,r.shadow.normalBias=.04;let i=r.shadow.camera;i.near=1,i.far=32,i.left=-10,i.right=10,i.top=10,i.bottom=-10}return e.add(r),e.add(r.target),r}function Md(e){let t=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,r;try{r=yd(e,!1)}catch(w){return{ok:!1,error:w}}let i=new as;i.background=new je(12050162);let a=new ua(-1,1,1,-1,.1,80),n=Jl(i,!0),s=new kl,o=new cd,l=new ve,c=[],u=3,h=[],d=Sr(.045,5,4),p=null,v=!1,g=0,m=0,f=new N,b=null,M=null,C=[],G=!1,E=null,A=[],k=[],y=[],S=null,U=null,H=[],q=null,Y=null,re=null,Q=null,oe=null,ee=new Set,ue=new N,_e=new N,Be=new N;function De(w){return t?Math.min(.045,w/1e3):w/1e3}function $(w,L,D){return new Promise(z=>{c.push({t:0,duration:Math.max(.016,w),ease:L,update:D,resolve:z})})}function de(w){for(let L=c.length-1;L>=0;L-=1){let D=c[L];D.t+=w;let z=Math.min(1,D.t/D.duration);D.ease==="in"?z=z*z*z:D.ease==="out"&&(z=1-(1-z)*(1-z));try{D.update(z)}catch(J){console.error(J),D.t=D.duration}if(D.t>=D.duration){try{D.update(1)}catch(J){console.error(J)}D.resolve(),c.splice(L,1)}}}function Te(){for(let w of c)w.resolve();c.length=0}function Re(w,L){let D=h.pop();if(!D){let z=new zt({color:15199986,transparent:!0,opacity:.75,depthWrite:!1});D=new mt(d,z)}D.visible=!0,D.position.set(w,.06,L),D.scale.setScalar(.6),D.material.opacity=.7,i.add(D),$(De(280),"out",z=>{D.position.y=.06+z*.22,D.material.opacity=.7*(1-z),D.scale.setScalar(.6+z*.8)}).then(()=>{D.visible=!1,i.remove(D),h.push(D)})}function me(w,L){let D=w.cols,z=w.rows,J=D*Mr,K=Math.max(.98,J/L),pe=K*L,R=Math.max(J,pe),Z=0,V=1.55,j=2.7;return{cols:D,rows:z,gridW:J,bayPitch:K,rowW:pe,span:R,queueZ:Z,bayZ:V,gridZ0:j,cell(le,ae){return{x:-J/2+(le+.5)*Mr,z:j+ae*Mr}},bay(le){return{x:-pe/2+(le+.5)*K,z:V}},inside(le,ae){return le>=0&&ae>=0&&le<D&&ae<z},minX:-R/2-.55,maxX:R/2+.55,minZ:Z-.7,maxZ:j+(z-1)*Mr+.55}}function Ie(){let w=xx(b&&b.region);i.background=new je(w.sky);let L=new mt(new Za(E.span+8,E.maxZ-E.minZ+8),Ce(w.grass));L.rotation.x=-Math.PI/2,L.position.set(0,-.02,(E.minZ+E.maxZ)/2),L.receiveShadow=!0,p.add(L);let D=E.queueZ+.45,z=E.maxZ-.2,J=new mt(new Za(E.span+1.15,z-D),Ce(w.ground));J.rotation.x=-Math.PI/2,J.position.set(0,0,(D+z)/2),J.receiveShadow=!0,p.add(J);let K=new Ut,pe=Ce(14999768),R=E.span+1.35,Z=E.maxZ-E.minZ-.2,V=(E.minZ+E.maxZ)/2;K.add(be(R,.08,.12,pe,0,.04,E.minZ+.15)),K.add(be(R,.08,.12,pe,0,.04,E.maxZ-.15)),K.add(be(.12,.08,Z,pe,-R/2,.04,V)),K.add(be(.12,.08,Z,pe,R/2,.04,V));let j=Ce(16250094);for(let bt=0;bt<E.rows;bt+=1)for(let pt=0;pt<E.cols;pt+=1){let Nt=E.cell(pt,bt),It=Mr*.86;K.add(be(It,.012,.035,j,Nt.x,.02,Nt.z-It/2)),K.add(be(It,.012,.035,j,Nt.x,.02,Nt.z+It/2)),K.add(be(.035,.012,It,j,Nt.x-It/2,.02,Nt.z)),K.add(be(.035,.012,It,j,Nt.x+It/2,.02,Nt.z))}let le=Ce(14015974),ae=Ce(16747039);for(let bt=0;bt<M.bayTaxi.length;bt+=1){let pt=E.bay(bt);K.add(be(E.bayPitch*.82,.025,1.05,le,pt.x,.02,pt.z)),K.add(be(E.bayPitch*.82,.02,.06,ae,pt.x,.035,pt.z-.5)),K.add(be(.05,.02,1.05,j,pt.x-E.bayPitch*.41,.035,pt.z)),K.add(be(.05,.02,1.05,j,pt.x+E.bayPitch*.41,.035,pt.z))}ql(K),p.add(K);let Se=Math.min(E.span+.4,Math.max(E.rowW,2.4)),Ye=Ce(14015459),Je=Ce(16251903),Ge=Ce(16747039);p.add(be(Se,.07,.85,Je,0,1.18,E.queueZ-.15,!0)),p.add(be(Se,.045,.08,Ge,0,1.16,E.queueZ+.24));for(let bt of[-Se*.38,Se*.38])p.add(be(.06,1.12,.06,Ye,bt,.56,E.queueZ-.35,!0));p.add(be(Se*.7,.08,.28,Ce(12963542),0,.18,E.queueZ-.35));let qt=Ce(4102991),At=Ce(9067058);[[E.minX+.35,E.maxZ-.15],[E.maxX-.35,E.maxZ-.15],[E.minX+.55,E.minZ+.2],[E.maxX-.55,(E.minZ+E.maxZ)*.55]].forEach(([bt,pt],Nt)=>{p.add(be(.1,.35,.1,At,bt,.18,pt,!0));let It=new mt(new Ka(.28+Nt%2*.06,.55,6),qt);It.position.set(bt,.62,pt),It.castShadow=!1,p.add(It)});let rr=Ce(15759914),ga=Ce(16250094);for(let bt of[E.minX+.85,E.maxX-.85]){let pt=new mt(new Ka(.09,.22,7),rr);pt.position.set(bt,.12,E.maxZ-.45),pt.castShadow=!0,p.add(pt),p.add(be(.1,.04,.1,ga,bt,.12,E.maxZ-.45))}}function rt(w){re&&(re.clearRect(0,0,128,64),re.fillStyle="#1c2430",re.font="700 36px Nunito, sans-serif",re.textAlign="center",re.textBaseline="middle",re.fillText(`+${w}`,64,34),Q.needsUpdate=!0)}function Xe(){S=new Ut,p.add(S);for(let w of b.cones||[]){let L=E.cell(w.c,w.r),D=new mt(new Ka(.16,.32,7),Ce(15759914));D.position.set(L.x,.16,L.z),D.castShadow=!0,S.add(D)}b.officer&&b.officer.path&&(U=gd(15909198,0,!1,!1,1),U.scale.setScalar(.85),S.add(U),qe()),H=[];for(let w of b.robots||[]){let L=w.dir===0?0:w.dir===2?b.rows-1:w.lane,D=w.dir%2===0?w.lane:w.dir===1?b.cols-1:0,z=w.dir%2===0?w.lane:D,J=w.dir%2===0?w.dir===2?b.rows-1:0:w.lane,K=E.cell(Math.max(0,Math.min(b.cols-1,z)),Math.max(0,Math.min(b.rows-1,J))),pe=nt(kt(.06,.7,.06),Ce(2371652),K.x,.35,K.z,!0),R=new zt({color:4102991}),Z=nt(Sr(.1,8,6),R,K.x,.78,K.z);Z.userData.robot=w,Z.userData.mat=R,S.add(pe,Z),H.push(Z)}if(vt(),b.region==="cape"){let w=new mt(new Ka(.7,.9,5),Ce(9085112));w.position.set(E.maxX+.2,.4,E.minZ),S.add(w)}else if(b.region==="joburg"){let w=nt(kt(.18,1.1,.18),Ce(14147046),E.minX-.1,.55,E.maxZ,!0);S.add(w)}else if(b.region==="gqeberha"){let w=nt(kt(.9,.08,.08),Ce(12963542),0,.7,E.maxZ+.2);S.add(w)}else if(b.region==="bloem"){let w=nt(kt(.16,.9,.16),Ce(15194032),E.maxX,.45,E.maxZ,!0);S.add(w)}else{let w=new mt(new id(.28,.05,6,10),Ce(16054267));w.position.set(E.minX,.35,E.minZ),S.add(w)}}function qe(){if(!U||!b.officer)return;let w=Math.floor((M.moves||0)/3)%b.officer.path.length,L=b.officer.path[w],D=E.cell(L.c,L.r);U.position.set(D.x,0,D.z)}function vt(){let w=Math.floor((M.moves||0)/2)%2===0;for(let L of H||[])L.userData.mat.color.set(w?4102991:14826813)}function O(){q.clear(),k=[],y=[];let w=M.queues||[M.queue||[]],L=M.boarded||[];w.forEach((D,z)=>{let J=L[z]||[],K=0;D.forEach((pe,R)=>{if(J[R]||K>=5)return;let Z=gd(jl(pe.color),R%3,!!pe.vip,!!pe.luggage,pe.color);Z.userData.queue=z,Z.userData.index=R,Z.userData.phase=R+z,Z.userData.head=K===0,Z.userData.slot=K,q.add(Z),k.push(Z),K===0&&y.push(Z),K+=1})}),dt()}function dt(){let w=[[],[]];for(let L of k)L.userData.leaving||(w[L.userData.queue]=w[L.userData.queue]||[],w[L.userData.queue].push(L));w.forEach((L,D)=>{let J=-((Math.max(L.length,1)-1)*.46)/2,K=E.queueZ-D*.62;L.forEach((pe,R)=>{pe.visible=!0,pe.position.set(J+R*.46,0,K)}),D===0&&L[0]&&oe.position.set(L[0].position.x,.025,K)}),oe.visible=!!(w[0]&&w[0][0]),Y.visible=!1}function $e(w){let L=kr[w.dir],D=w.len||1,z=w.c-L.x*(D-1),J=w.r-L.y*(D-1);return E.cell((w.c+z)/2,(w.r+J)/2)}function et(w){return(w.len||3)*Mr*.86/1.05}function ye(w,L){let D=!!(L.hidden&&M.revealed&&!M.revealed[L.id]);w.body.visible=!D,w.tarp.visible=D,w.question.visible=D;let z=Math.max(0,(L.lockAfter||0)-(M.departed||0));w.lock.visible=z>0,z>0&&w.lock.userData.paint&&w.lock.userData.paint(z),w.arrow.visible=!0,w.question.position.y=1.32,w.lock.position.set(D?.28:0,1.28,0)}function tt(w,L){let D=A[w]&&A[w].group.userData.seats;D&&D.forEach((z,J)=>{z.visible=J<L})}function Pe(w){let L=A[w.id];if(M.exited[w.id]){let D=-1;for(let J=0;J<M.bayTaxi.length;J+=1)M.bayTaxi[J]===w.id&&(D=J);if(L.pick.visible=!1,D<0){L.group.visible=!1;return}let z=E.bay(D);L.group.visible=!0,L.group.position.set(z.x,0,z.z),L.group.rotation.y=0,L.group.scale.set(.38,.38,.38),tt(w.id,M.bayFilled[D])}else{let D=$e(w);L.group.visible=!0,L.group.position.set(D.x,0,D.z),L.group.rotation.y=vx(w.dir),L.group.scale.set(1,1,et(w)),L.pick.visible=!0,tt(w.id,0)}L.body.rotation.set(0,0,0),L.body.scale.set(1,1,1),ye(L,w)}function Fe(){let w=(e.clientWidth||1)/(e.clientHeight||1);a.left=-w,a.right=w,a.top=1,a.bottom=-1,a.zoom=1,a.updateProjectionMatrix(),ue.set(0,.35,(E.minZ+E.maxZ)/2);let L=26;f.set(ue.x+Math.sin(ud)*Math.cos(Vl)*L,ue.y+Math.sin(Vl)*L,ue.z+Math.cos(ud)*Math.cos(Vl)*L),a.position.copy(f),a.lookAt(ue),a.updateMatrixWorld(!0);let D=.001,z=.001;for(let pe of[E.minX,E.maxX])for(let R of[0,1.25])for(let Z of[E.minZ,E.maxZ]){let V=Be.set(pe,R,Z).project(a);D=Math.max(D,Math.abs(V.x)),z=Math.max(z,Math.abs(V.y))}a.zoom=.9/Math.max(D,z),a.updateProjectionMatrix();let J=n.shadow.camera,K=Math.max(7,(E.maxX-E.minX)*.62);J.left=-K,J.right=K,J.top=K,J.bottom=-K,J.updateProjectionMatrix(),n.position.set(ue.x-5,12,ue.z+5),n.target.position.copy(ue),n.target.updateMatrixWorld()}function T(w,L,D,z){Te(),b=w,M=L,C=D,G=!0,Sd=!!(z&&z.colorblind);let J=z&&z.livery||"plain";E=me(b,M.bayTaxi.length),p&&i.remove(p),p=new Ut,i.add(p),A=[],Ie(),q=new Ut,p.add(q),oe=new mt(new Il(.2,18),new zt({color:16747039,transparent:!0,opacity:.95,depthWrite:!1})),oe.rotation.x=-Math.PI/2,p.add(oe);let K=document.createElement("canvas");K.width=128,K.height=64,re=K.getContext("2d"),Q=new pa(K),Q.colorSpace=Mt,Y=new Ja(new da({map:Q,transparent:!0,depthWrite:!1})),Y.scale.set(.55,.28,1),p.add(Y),Xe();for(let pe of b.taxis){let R=pe.colors||[pe.color||0],Z=Yl(jl(R[0]));if(Zl(Z,J),R[1]!=null){let Ge=be(.04,.07,.9,Ce(jl(R[1])),-.34,.52,.04);Z.userData.body.add(Ge)}let V=xd(R[0]);V.position.set(0,1.08,-.2),Z.userData.body.add(V),ql(Z.userData.body);let j=px(),le=fx(),ae=gx(),Se=mx(),Ye=nt(kt(.8,.5,1.1),new zt({color:16722474,transparent:!0,opacity:0,depthWrite:!1}),0,.5,0);Ye.visible=!1;let Je=nt(kt(Mr*.92,1.3,1.05),cx,0,.65,0);Je.userData.id=pe.id,Je.layers.set(1),Je.castShadow=!1,Je.receiveShadow=!1,Z.add(j,le,ae,Se,Je,Ye),p.add(Z),A[pe.id]={group:Z,body:Z.userData.body,tarp:j,question:le,lock:ae,arrow:Se,pick:Je,flash:Ye},Pe(pe)}O([]),_()}function _(){let w=e.clientWidth,L=e.clientHeight;!w||!L||!E||(r.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2)),r.setSize(w,L,!1),Fe())}function B(){if(!v)return;g=requestAnimationFrame(B);let w=Math.min(.05,s.getDelta()),L=s.elapsedTime;if(de(w),!t){for(let D of k)!D.visible||D.userData.hopping||(D.position.y=Math.sin(L*2.5+D.userData.phase)*.03);for(let D of A)D&&D.question.visible&&(D.question.position.y=1.32+Math.sin(L*2.2+D.pick.userData.id)*.04)}a.position.copy(f),m>.001&&(a.position.x+=(Math.random()-.5)*m,a.position.y+=(Math.random()-.5)*m*.45,m*=.86),n.shadow.needsUpdate=u>0||c.length>0||m>.001,u>0&&(u-=1),r.render(i,a)}function ie(){v||(v=!0,s.getDelta(),B())}function se(){v=!1,cancelAnimationFrame(g)}function te(w,L){let D=e.getBoundingClientRect();if(!D.width||!D.height)return-1;l.x=(w-D.left)/D.width*2-1,l.y=-((L-D.top)/D.height)*2+1,o.layers.enable(1),o.setFromCamera(l,a);let z=[];for(let pe of y)z.push(pe);for(let pe of A)pe&&pe.pick.visible&&z.push(pe.pick);let J=o.intersectObjects(z,!0);if(!J.length)return null;let K=J[0].object;for(;K&&K.userData.queue==null&&K.userData.id==null&&K.parent;)K=K.parent;return K&&K.userData.queue!=null?{kind:"queue",queue:K.userData.queue}:K&&K.userData.id!=null?{kind:"taxi",id:K.userData.id}:null}function Le(w){let L=A[w];if(!L)return null;let D=_e;D.set(L.group.position.x,1.2,L.group.position.z),D.project(a);let z=e.getBoundingClientRect();return{x:z.left+(D.x*.5+.5)*z.width,y:z.top+(-D.y*.5+.5)*z.height}}function ge(w){let L=[w[0]];for(let D=1;D<w.length-1;D+=1){let z=w[D-1],J=w[D],K=w[D+1],pe=Math.hypot(J.x-z.x,J.z-z.z)||1,R=Math.hypot(K.x-J.x,K.z-J.z)||1,Z=Math.min(.55,pe*.45,R*.45),V={x:J.x-(J.x-z.x)/pe*Z,z:J.z-(J.z-z.z)/pe*Z},j={x:J.x+(K.x-J.x)/R*Z,z:J.z+(K.z-J.z)/R*Z};L.push(V);for(let le=1;le<=4;le+=1){let ae=le/5,Se=1-ae;L.push({x:Se*Se*V.x+2*Se*ae*J.x+ae*ae*j.x,z:Se*Se*V.z+2*Se*ae*J.z+ae*ae*j.z})}L.push(j)}L.push(w[w.length-1]),w.length=0;for(let D of L)w.push(D)}function Me(w){let L=b.taxis[w],D=kr[L.dir],z=[$e(L)],J=L.c+D.x,K=L.r+D.y;for(;E.inside(J,K);)z.push(E.cell(J,K)),J+=D.x,K+=D.y;let pe=z[z.length-1];return z.push({x:pe.x+D.x*Mr,z:pe.z+D.y*Mr}),z}async function ze(w,L,D){let z=w.userData.body,J=w.userData.wheels,K=[],pe=0;for(let V=1;V<L.length;V+=1){let j=Math.hypot(L[V].x-L[V-1].x,L[V].z-L[V-1].z);K.push(j),pe+=j}if(pe<.001)return;let R=0,Z=0;await $(De(160+pe*130),"out",V=>{let j=V*pe,le=0,ae=0;for(;ae<K.length-1&&le+K[ae]<j;)le+=K[ae],ae+=1;let Se=K[ae]||1,Ye=Math.min(1,(j-le)/Se),Je=L[ae],Ge=L[ae+1];w.position.x=Je.x+(Ge.x-Je.x)*Ye,w.position.z=Je.z+(Ge.z-Je.z)*Ye,w.rotation.y=Math.atan2(-(Ge.x-Je.x),-(Ge.z-Je.z)),z.rotation.x=.045,z.rotation.z=Math.sin(V*Math.PI*2)*.02;let qt=(j-R)/.135;R=j;for(let At of J)At.rotation.x+=qt;if(D&&!t){let At=performance.now();if(At-Z>48){Z=At;let ma=Math.sin(w.rotation.y)*.35,rr=Math.cos(w.rotation.y)*.35;Re(w.position.x+ma,w.position.z+rr)}}}),z.rotation.x=0,z.rotation.z=0}async function he(w,L,D){let z=w.rotation.y;await $(De(D),"out",J=>{w.rotation.y=_x(z,L,J)}),w.rotation.y=L}return{ok:!0,resize:_,start:ie,stop:se,load:T,pick:te,project:Le,setState(w){M=w},reveal(w){let L=b.taxis[w];L&&ye(A[w],L)},async bump(w){let L=A[w],D=kr[b.taxis[w].dir],z=L.group.position.x,J=L.group.position.z;m=Math.max(m,t?0:.12),await $(De(80),"out",K=>{L.group.position.x=z+D.x*.2*K,L.group.position.z=J+D.y*.2*K,L.body.rotation.x=.08*K}),await $(De(120),"out",K=>{L.group.position.x=z+D.x*.2*(1-K),L.group.position.z=J+D.y*.2*(1-K),L.body.rotation.x=.08*(1-K)}),L.body.rotation.x=0},async unlock(w,L){let D=A[w],z=D.lock,J=z.position.y;await $(De(160),"out",K=>{z.position.y=J+K*.4,z.scale.setScalar(1+K*.35)}),z.visible=L>0,z.position.y=J,z.scale.setScalar(1),await $(De(140),"out",K=>{let pe=Math.sin(K*Math.PI);D.body.scale.set(1+pe*.05,1-pe*.07,1)}),D.body.scale.set(1,1,1)},async exit(w,L){let D=A[w];D.pick.visible=!1;let z=Me(w),J=E.bay(L),K=b.taxis[w],pe=kr[K.dir],R=z[z.length-1],Z=((K.len||2)-1)*Mr+.6,V={x:R.x+pe.x*Z,z:R.z+pe.y*Z};z.push(V);let j=E.bayZ-1.7,le=V.x>=0?E.maxX+1.8:E.minX-1.8;if(pe.y<0){let Se=Math.min(V.z,j);V.z>Se+.05&&z.push({x:V.x,z:Se}),z.push({x:J.x,z:Se})}else pe.y>0?(z.push({x:le,z:V.z}),z.push({x:le,z:j}),z.push({x:J.x,z:j})):(z.push({x:V.x,z:j}),z.push({x:J.x,z:j}));z.push(J),ge(z);let ae=D.group.scale.z;await ze(D.group,z,!0),await $(De(200),"out",Se=>{let Ye=1+-.6*Se;D.group.scale.set(Ye,Ye,ae+(.4-ae)*Se)}),await he(D.group,0,160),tt(w,0)},async board(w){let L=k.find(J=>J.userData.queue===(w.queue||0)&&J.userData.index===w.pIndex);if(w.filled>4){L&&(L.visible=!1),tt(w.taxiId,w.filled),dt();return}if(!L){tt(w.taxiId,w.filled);return}L.visible||(L.position.set(Y.position.x,0,Y.position.z),L.visible=!0);let D=L.position.clone();L.userData.leaving=!0,L.userData.hopping=!0,dt();let z=E.bay(w.bay);await $(De(220),"out",J=>{L.position.x=D.x+(z.x-D.x)*J,L.position.z=D.z+(z.z-D.z)*J,L.position.y=Math.sin(J*Math.PI)*.55}),L.visible=!1,L.userData.leaving=!1,L.userData.hopping=!1,L.position.y=0,ee.delete(w.pIndex),tt(w.taxiId,w.filled),dt()},async depart(w){let L=A[w];if(!L||!L.group.visible)return;let D=L.group.position.clone(),z=L.group.rotation.y,J=-Math.sin(z),K=-Math.cos(z);await ze(L.group,[{x:D.x,z:D.z},{x:D.x+J*3.2,z:D.z+K*3.2}],!0),L.group.visible=!1,tt(w,0)},syncPeople(w){M=w,O(),qe(),vt();for(let L of b.taxis)A[L.id]&&ye(A[L.id],L)},flash(w){let L=A[w];!L||!L.flash||(L.flash.visible=!0,$(De(180),"out",D=>{L.flash.material.opacity=D<.5?D*1.2:(1-D)*1.2,D>.98&&(L.flash.visible=!1)}))},pulse(w){let L=A[w];if(!L)return;let D=L.arrow.scale.x||1;$(De(500),"out",z=>{let J=1+Math.sin(z*Math.PI)*.35;L.arrow.scale.set(D*J,D*J,D*J)})},shake(){m=Math.max(m,t?0:.1)}}}var Sd=!1;function jl(e){return Mc(e,Sd)}function xx(e){return Cs.find(t=>t.id===e)||Cs[0]}function Ed(e){let t=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,r;try{r=yd(e,!0)}catch(g){return{ok:!1,error:g}}let i=new as,a=new ua(-1,1,1,-1,.1,40);Jl(i,!0);let n=new kl,s=null,o=!1,l=0,c=new mt(new Il(1.15,28),new zt({color:16777215,transparent:!0,opacity:.55,depthWrite:!1}));c.rotation.x=-Math.PI/2,c.position.y=.01,c.receiveShadow=!0,i.add(c);function u(){let g=e.clientWidth||1,m=e.clientHeight||1;r.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2)),r.setSize(g,m,!1);let f=g/m;a.left=-f*1.15,a.right=f*1.15,a.top=1.15,a.bottom=-1.15,a.zoom=1.15,a.updateProjectionMatrix();let b=28*Math.PI/180;a.position.set(Math.sin(.5)*Math.cos(b)*8,Math.sin(b)*8+.4,Math.cos(.5)*Math.cos(b)*8),a.lookAt(0,.4,0)}function h(g){s&&i.remove(s),s=Yl(14826813),Zl(s,g),s.rotation.y=.4,i.add(s)}function d(){if(!o)return;l=requestAnimationFrame(d);let g=Math.min(.05,n.getDelta());s&&!t&&(s.rotation.y+=g*.45),r.render(i,a)}let p=null;function v(g){p&&i.remove(p),p=new Ut,g>=1&&p.add(nt(kt(1.6,.08,.7),Ce(16251903),0,.9,-.8)),g>=2&&p.add(nt(kt(.4,.35,.3),Ce(14711357),1.1,.2,.2)),g>=3&&p.add(nt(kt(.08,.7,1.1),Ce(3108845),-1.2,.4,0)),g>=4&&p.add(nt(kt(.22,.28,.16),Ce(1844272),.8,.2,-.6)),g>=5&&p.add(nt(Sr(.08,8,6),new zt({color:16769162}),-.7,.85,-.5)),g>=6&&p.add(nt(kt(2.2,.08,1.6),Ce(14147046),0,1.25,0)),i.add(p)}return{ok:!0,resize:u,setLook:h,setStage:v,start(){o||(o=!0,n.getDelta(),d())},stop(){o=!1,cancelAnimationFrame(l)}}}var jt=null;function bd(e,t){if(!jt){let i=document.createElement("canvas");i.width=192,i.height=120;let a=new Dl({canvas:i,antialias:!0,alpha:!1,preserveDrawingBuffer:!0});a.setSize(192,120,!1),a.outputColorSpace=Mt;let n=new as;n.background=new je(15660024);let s=new ua(-1.15,1.15,.78,-.78,.1,20);Jl(n,!1),s.position.set(-2.2,1.45,-2),s.lookAt(0,.42,0),jt={renderer:a,scene:n,camera:s,canvas:i,group:null}}jt.group&&jt.scene.remove(jt.group),jt.group=Yl(14826813),Zl(jt.group,t),jt.group.rotation.y=-.55,jt.scene.add(jt.group),jt.renderer.render(jt.scene,jt.camera);let r=e.getContext("2d");r.clearRect(0,0,e.width,e.height),r.drawImage(jt.canvas,0,0,e.width,e.height)}var cs=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,hr=new URLSearchParams(location.search);hr.has("reset")&&Ic();var Td=Number(hr.get("level")),ti={level:Number.isFinite(Td)?Td:0,daily:hr.has("daily"),bot:hr.has("bot"),mute:hr.has("mute"),lose:hr.has("lose")};globalThis.TRR_FLAGS=ti;var ic=Oe();Ms(ti.mute||ic.sound===!1);Ss(ic.music!==!1);fc(ic.horn||"hoot");dc();var ne=e=>document.getElementById(e),Ql=null,Ze=null,Pt=null,P=null,wd=0,Kl=0,Ad=performance.now(),ur={back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',restart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2-4.9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M19 4.5V9h-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',sound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" fill="currentColor"/><path d="M15.2 9.2a3.6 3.6 0 0 1 0 5.6M17.4 7a6.2 6.2 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',mute:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" fill="currentColor"/><path d="m16 10 4 4m0-4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',music:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="13.5" r="2.5" fill="currentColor"/></svg>',musicOff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m15 15 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',arrows:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M12 4l-3.2 3.2M12 4l3.2 3.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',coin:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="#F2C14E"/><circle cx="12" cy="12" r="5.2" fill="none" stroke="#C9842A" stroke-width="1.6"/></svg>',bay:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v6M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',undo:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8H5.5V5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M6 12a6 6 0 1 0 1.6-4.1L5.5 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',shuffle:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4.2l2.2 3.2L13 7h7M16.5 4.5 20 7l-3.5 2.5M4 17h4.2l2.2-3.2L13 17h7M16.5 14.5 20 17l-3.5 2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};function tr(e,t=""){document.body.dataset.screen=e;let r=ne("live");r&&(r.textContent=t||e)}function Ud(e){return new Promise(t=>{setTimeout(t,cs?Math.min(24,e):e)})}function Nd(e){if(!cs)try{navigator.vibrate?.(e)}catch{}}function ss(e){let[t,r,i]=e.split("-").map(Number);return`${i} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][r-1]} ${t}`}async function Id(e){if(navigator.share)try{return await navigator.share({text:e}),"shared"}catch(t){if(t&&t.name==="AbortError")return"abort"}try{return await navigator.clipboard.writeText(e),"copied"}catch{let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.left="-999px",document.body.appendChild(t),t.select();let r=!1;try{r=document.execCommand("copy")}catch{r=!1}return t.remove(),r?"copied":"failed"}}function $t(e,t,r){let i=ne("toast"),a=ne("app").getBoundingClientRect();i.hidden=!1,i.textContent=e;let n=t??a.left+a.width/2,s=r??a.top+a.height*.4;i.style.left=`${n-a.left}px`,i.style.top=`${s-a.top}px`,clearTimeout(wd),wd=setTimeout(()=>{i.hidden=!0},1e3)}function an(){let e=Oe().coins;for(let t of["t-coins","m-coins","s-coins","d-coins","g-coins"]){let r=ne(t);if(!r)continue;let i=r.querySelector("span")||r;r.querySelector("span")?r.querySelector("span").textContent=String(e):i.textContent=String(e)}}function yx(){return Ma()?ur.mute:ur.sound}function us(){for(let t of["t-mute","g-mute"]){let r=ne(t);r&&(r.innerHTML=yx(),r.setAttribute("aria-label",Ma()?"Unmute":"Mute"),r.setAttribute("aria-pressed",Ma()?"true":"false"))}for(let t of["t-music","g-music"]){let r=ne(t);if(!r)continue;let i=Es();r.innerHTML=i?ur.music:ur.musicOff,r.classList.toggle("off",!i),r.setAttribute("aria-label",i?"Turn music off":"Turn music on"),r.setAttribute("aria-pressed",i?"true":"false")}let e=ne("t-arrows");e&&(e.innerHTML=ur.arrows,e.classList.toggle("on",!!Oe().arrows),e.setAttribute("aria-pressed",Oe().arrows?"true":"false"))}function Cd(){let e=Ma();Ms(!e),Bc(e),st(),us()}function Rd(){let e=!Es();Ss(e),qc(e),Ts(),e&&st(),us()}function Mx(e,t){return t==="daily"||e&&e.id&&e.id%10===0?"rushhour":"gameplay"}function ii(e){let t=ne(`screen-${e}`);for(let r of document.querySelectorAll(".screen"))r!==t&&(r.classList.remove("is-on"),r.hidden=!0);t.hidden=!1,t.classList.remove("is-on"),requestAnimationFrame(()=>t.classList.add("is-on")),tr(e),e!=="game"&&Ze&&Ze.stop&&Ze.stop(),e==="title"?Pt&&(Pt.setLook(Oe().livery),Pt.resize(),Pt.start()):Pt&&Pt.stop(),e!=="game"&&bs("menu")}function ei(){let e=Oe(),t=Math.min(Br,Math.max(1,e.unlocked));ne("t-play").textContent=e.unlocked>1?`Play ${t}`:Ne.play,an(),us();let r=[0,6].includes(new Date().getDay())||hr.has("event");ne("t-event").hidden=!r,ii("title"),Pt&&Pt.setStage&&Pt.setStage(Oe().rank||0),tr("title",li.title)}var ri=0;function ec(){let e=Oe();return{livery:e.livery,colorblind:!!e.colorblind,showArrows:!0}}function ls(){let e=Oe();ri=Math.floor((Math.min(Br,e.unlocked)-1)/12),an(),tc(),ii("map"),tr("map","Level map")}function tc(){let e=Oe();ne("m-range").textContent=`${ri*12+1}\u2013${ri*12+12}`;let t=ne("m-grid");t.replaceChildren();for(let r=0;r<12;r+=1){let i=ri*12+r+1,a=i<=e.unlocked,n=Xs(e,i),s=Hs(i),l=[s.difficulty==="super"?"S":s.difficulty==="hard"?"H":"",s.tutorial?s.tutorial.mech.slice(0,1).toUpperCase():""].filter(Boolean).join(" "),c=document.createElement("button");c.type="button",c.className=`level${a?"":" locked"}${i===e.unlocked?" current":""}`,c.innerHTML=`<small>${l}</small><strong>${i}</strong><em>${"\u2605\u2605\u2605".slice(0,n)}${"\u2606\u2606\u2606".slice(n)}</em>`,c.addEventListener("click",()=>{if(!a){let u=c.getBoundingClientRect();$t("Locked",u.left+u.width/2,u.top);return}st(),dr({mode:"level",id:i})}),t.append(c)}}function Od(){let e=ne("s-list");e.replaceChildren();let t=Oe();an();for(let r of As){let i=t.owned.includes(r.id),a=t.livery===r.id,n=document.createElement("article");n.className="shop-row";let s=document.createElement("canvas");s.width=192,s.height=120,s.className="thumb";try{bd(s,r.id)}catch(h){console.error(h)}let o=document.createElement("div"),l=document.createElement("strong");l.textContent=r.name;let c=document.createElement("p");c.textContent=r.blurb,o.append(l,c);let u=document.createElement("button");u.type="button",u.className=`btn small${a?"":" primary"}`,u.textContent=a?Ne.equipped:i?Ne.equip:String(r.price),u.addEventListener("click",()=>{if(st(),!a){if(i)kc(r.id);else{if(!zc(r.id,r.price).ok){let d=u.getBoundingClientRect();$t("Need coins",d.left+d.width/2,d.top);return}ba()}Od()}}),n.append(s,o,u),e.append(n)}ii("shop"),tr("shop","Liveries")}function tn(){let e=Hr(new Date),t=null;try{t=Vs(new Date),mr(t),Ql=t}catch(n){console.error(n)}let r=Oe();ne("d-date").textContent=ss(e),ne("d-lead").textContent=Ne.dailyLead;let i=r.dailyDate===e||r.dailyStreak?`Streak ${r.dailyStreak||0}`:"Streak 0";ne("d-streak").textContent=i;let a=r.dailyDate===e;ne("d-done").hidden=!a,ne("d-done").textContent=Ne.dailyDone,ne("d-stars").hidden=!a,ne("d-stars").textContent=`${"\u2605\u2605\u2605".slice(0,r.dailyStars||0)}${"\u2606\u2606\u2606".slice(r.dailyStars||0)}`,ne("d-play").textContent=a?"Play again":Ne.play,ne("d-share").hidden=!a,ne("d-play").onclick=()=>{t&&(st(),dr({mode:"daily"}))},ne("d-share").onclick=async()=>{if(!t)return;let n=Fs(t,{daily:!0,stars:r.dailyStars||1,moves:t.par,time:0},ss(e));await Id(n)==="copied"&&$t(Ne.copied)},an(),ii("daily"),tr("daily",`Rush Hour ${ss(e)}`)}function Sx(){if(Ze)return!!Ze.stop;let e=Md(ne("board"));if(!e.ok)return console.error(e.error),!1;Ze=e;let t=ne("board-wrap");return new ResizeObserver(()=>Ze.resize()).observe(t),ne("board").addEventListener("pointerdown",i=>{if(!P||P.busy||P.over||P.adOpen)return;let a=Ze.pick(i.clientX,i.clientY);a&&(a.kind==="queue"?Vd(a.queue):a.kind==="taxi"&&Hd(a.id))}),!0}function Or(){if(!P)return;ne("g-moves").textContent=`Moves ${P.state.moves}`,ne("g-time").textContent=`${Math.floor(P.elapsed/1e3)}s`;let e=ne("g-coins"),t=String(Oe().coins),r=e.querySelector("span");r&&(r.textContent=t),ne("g-bay").disabled=!!P.state.extraUsed||P.over||P.busy,ne("g-undo").disabled=P.undo.length===0||P.over||P.busy,ne("g-shuffle").disabled=P.over||P.busy}function Ir(){let e=ne("modal");e.hidden=!0,e.replaceChildren(),P&&!P.over&&tr("game",P.level.name||"Level")}function rn(){let e=ne("modal");e.hidden=!1,e.replaceChildren();let t=document.createElement("div");return t.className="card",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),e.append(t),t}function er(e,t,r){let i=document.createElement("button");return i.type="button",i.className=t,i.textContent=e,i.addEventListener("click",r),i}function dr(e){if(!Sx()){ne("boot").hidden=!1,ne("boot-note").textContent="This browser cannot start the 3D rank.";return}let t=Oe(),r,i=e;if(e.mode==="event"&&e.level)r=e.level,mr(r);else if(e.mode==="daily")r=Ql||Vs(new Date),mr(r),r.intro=r.intro||"Rush Hour. One shared rank for today.",Ql=r;else{let l=Math.min(Br,Math.max(1,e.id|0)),c=Oe().fails[String(l)]||0;r=Hs(l,{easier:c>=2?1:0}),mr(r),i={mode:"level",id:l}}let a=As.some(l=>l.id===t.livery)?t.livery:"plain";P={launch:i,level:r,state:Is(r),hidden:r.taxis.map(l=>!!l.hidden),squeezeUsed:!1,adBayUsed:!1,lastInput:performance.now(),hinted:!1,livery:a,showArrows:!!t.arrows||i.mode!=="daily"&&r.id>=1&&r.id<=3,elapsed:0,shown:-1,timing:!1,busy:!1,over:!1,adOpen:!1,paid:!1,undo:[],botAt:0,botting:!!(ti.bot&&r.guide)},ne("g-title").textContent=r.name||`Level ${r.id}`,ne("g-par").textContent=`Par ${r.par}`;let n=ne("g-intro");n.hidden=!r.intro,n.textContent=r.intro||"",Ir(),ii("game"),bs(Mx(r,i.mode)),tr("game",r.name||`Level ${r.id}`),Ze.load(r,P.state,P.hidden,ec());let s=ne("g-diff");s&&(s.textContent=r.difficulty==="super"?"Super Hard":r.difficulty==="hard"?"Hard":"",s.hidden=!s.textContent,s.className=`badge ${r.difficulty||""}`);let o=ne("g-time");o&&(o.hidden=i.mode!=="daily"),ne("screen-game").classList.toggle("rain",!!r.rain),Ax(),Ze.start(),requestAnimationFrame(()=>Ze.resize()),us(),Or(),ti.lose&&setTimeout(()=>en("full"),350),P.botting&&setTimeout(()=>Gd(),450)}function ac(){P.undo.push({state:{exited:Array.from(P.state.exited),bayTaxi:Array.from(P.state.bayTaxi),bayFilled:Array.from(P.state.bayFilled),boarded:P.state.boarded.map(e=>Array.from(e)),queues:P.state.queues.map(e=>e.map(t=>({...t}))),moves:P.state.moves,departed:P.state.departed,combo:P.state.combo,squeezeUsed:P.state.squeezeUsed,revealed:Array.from(P.state.revealed)},coins:Oe().coins,elapsed:P.elapsed}),P.undo.length>40&&P.undo.shift()}function Ex(e){let t=e.state;P.state={exited:Uint8Array.from(t.exited),bayTaxi:Int16Array.from(t.bayTaxi),bayFilled:Uint8Array.from(t.bayFilled),boarded:t.boarded.map(r=>Uint8Array.from(r)),queues:t.queues.map(r=>r.map(i=>({...i}))),moves:t.moves,departed:t.departed,combo:t.combo,squeezeUsed:t.squeezeUsed,revealed:Uint8Array.from(t.revealed)},js(e.coins),P.elapsed=e.elapsed,P.shown=-1}async function Fd(e){for(let t of e)if(t.t==="exit")gc(),await Ze.exit(t.id,t.bay);else if(t.t==="board")vc(),await Ze.board(t);else if(t.t==="depart"){let r=t.combo>=2;r?mc(t.combo):Ea();let i=(2+(t.combo>=2?t.combo:0))*(P.level.reward||1);vn(i),rc("depart"),t.combo>=3&&rc("combo",t.combo),r&&$t(`${Rs[t.combo%Rs.length]} x${t.combo}`),await Ze.depart(t.taxiId),Or()}Ze.syncPeople(P.state)}function rc(e,t){let r=Hr(new Date),i=Oe();i.missionsDate!==r&&(i.missionsDate=r,i.missionProgress=[0,0,0],i.missionClaimed=[!1,!1,!1],js(i.coins));let a=Oe();a.missionsDate===r&&(e==="depart"&&(a.missionProgress[0]+=1),e==="combo"&&(a.missionProgress[1]=Math.max(a.missionProgress[1]||0,t||0)),e==="clear"&&(a.missionProgress[2]+=1),localStorage.setItem("trr_save_v1",JSON.stringify(a)))}function nc(){if(!P.squeezeUsed){P.adOpen=!0;let e=rn(),t=document.createElement("h2");t.textContent="Gaartjie squeeze";let r=document.createElement("p");r.textContent="One free bay for this try. No advert.",e.append(t,r,er("Take the bay","btn primary",()=>{P.squeezeUsed=!0,P.adOpen=!1,Ir();let i=gn(P.state,P.level);P.state=i.state,Ze.load(P.level,P.state,null,ec()),ci(P.state,P.level)&&nc()}));return}if(!P.adBayUsed){P.adOpen=!0;let e=rn(),t=document.createElement("h2");t.textContent=Ne.adTitle;let r=document.createElement("p");r.textContent="A short thanks opens one more bay for this try.",e.append(t,r,er(Ne.watch,"btn primary",()=>{P.adBayUsed=!0,P.adOpen=!1,Ir();let i=gn(P.state,P.level);P.state=i.state,Ze.load(P.level,P.state,null,ec()),ci(P.state,P.level)&&en(Ua(P.state))}),er(Ne.notNow,"btn",()=>{P.adBayUsed=!0,P.adOpen=!1,Ir(),en(Ua(P.state))}));return}en(Ua(P.state))}function zd(){Da(P.state)?Wd():ci(P.state,P.level)&&nc()}async function hs(e){P.busy=!0,Or();try{await e}catch(t){console.error(t)}P&&(P.busy=!1,Or(),P.botting&&!P.over&&!P.adOpen&&(await Ud(200),Gd()))}function bx(e){return Ze.project(e)||null}function kd(){P.lastInput=performance.now(),P.hinted=!1}function $l(e,t,r){let i=bx(e);hs((async()=>{Ea(),Nd(14),i?$t(t,i.x,i.y):$t(t),await Ze.bump(e),r>=0&&Ze.flash(r)})())}function Bd(e){ac();let t=fn(P.state,P.level,e);if(!t){P.undo.pop();return}P.state=t.state,Ze.setState(P.state),hs((async()=>{await Fd(t.events),zd()})())}function Hd(e){if(!P||P.busy||P.over||P.adOpen)return;kd();let t=Ac(P.state,P.level,e);if(t.t!=="none"){if(!P.timing&&P.launch.mode==="daily"&&(P.timing=!0),t.reveal&&(P.state.revealed[e]=1),t.t==="bump"){$l(e,Ne.hoot,t.blocker),Ze.syncPeople(P.state);return}if(t.t==="locked"){let r=Math.max(0,(P.level.taxis[e].lockAfter||0)-P.state.departed);$l(e,`Lock ${r}`,null);return}if(t.t==="red"){$l(e,"Red robot",null);return}if(t.t==="nobay"){hs((async()=>{Ea(),Ze.shake(),$t("Bays full"),await Ud(180),ci(P.state,P.level)&&nc()})());return}Bd({t:t.t,id:t.id})}}function Vd(e){if(!P||P.busy||P.over||P.adOpen)return;kd();let t=Cc(P.state,P.level,e);if(t.t==="wait"){$t("No seat yet"),Ea();return}t.t==="send"&&Bd(t)}function Gd(){if(!P||P.over||P.busy)return;let e=P.level.guide[P.botAt];P.botAt+=1,e&&(e.t==="send"?Vd(e.queue):Hd(e.id))}function os(e){if(!P||P.busy||P.adOpen)return;let t=e==="bay"?"bay":e;if((Oe().tokens[t]||0)>0){Hc(t),e==="bay"?Ld():e==="undo"?Pd():Dd(),Or();return}if(e==="undo"&&!P.undo.length){$t("Nothing to undo");return}if(e==="bay"&&P.state.extraUsed)return;if(e==="shuffle"){let h=0;for(let d of P.state.boarded)for(let p of d)p||(h+=1);if(h<2){$t("Queue is short");return}}P.adOpen=!0;let r=++Kl;tr("ad",Ne.adTitle);let i=rn(),a=document.createElement("h2");a.textContent=Ne.adTitle;let n=document.createElement("p");n.className="lead",n.textContent=e==="bay"?Ne.extraBay:e==="undo"?Ne.undo:Ne.shuffle;let s=document.createElement("p");s.textContent=Ne.adBody;let o=document.createElement("div");o.className="bar";let l=document.createElement("span");o.append(l);let c=er(Ne.watch,"btn primary",()=>{st(),c.disabled=!0;let h=performance.now(),d=cs?200:1100,p=v=>{if(r!==Kl)return;let g=Math.min(1,(v-h)/d);l.style.width=`${g*100}%`,g<1?requestAnimationFrame(p):(P.adOpen=!1,Ir(),e==="bay"?Ld():e==="undo"?Pd():Dd())};requestAnimationFrame(p)}),u=er(Ne.notNow,"btn",()=>{st(),Kl+=1,P.adOpen=!1,Ir()});i.append(a,n,s,o,c,u)}function Pd(){let e=P.undo.pop();e&&(Ex(e),P.over=!1,P.paid=!1,Ir(),Ze.load(P.level,P.state,P.hidden,{livery:P.livery,showArrows:P.showArrows}),Or())}function Ld(){ac();let e=gn(P.state,P.level);if(!e){P.undo.pop();return}P.state=e.state,P.over=!1,Ir(),Ze.load(P.level,P.state,P.hidden,{livery:P.livery,showArrows:P.showArrows}),Or(),Da(P.state)?Wd():ci(P.state,P.level)&&en(Ua(P.state))}function Dd(){ac();let e=(Date.now()^P.state.moves*997)>>>0,t=()=>{e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296},r=Pc(P.state,P.level,t);P.state=r.state,Ze.setState(P.state);let i=r.events.filter(a=>a.t==="board").map(a=>a.pIndex);Ze.syncPeople(P.state,i),hs((async()=>{await Fd(r.events.filter(a=>a.t==="board"||a.t==="depart")),zd()})())}function Tx(){let e=ne("modal"),t=document.createElement("div");t.className="confetti";let r=["#E23D3D","#2F6FED","#F2C14E","#3E9B4F","#F07A2A","#7A4E9A","#E56AA8"],i=cs?8:24;for(let a=0;a<i;a+=1){let n=document.createElement("i");n.style.background=r[a%r.length],n.style.left=`${a%2?10:78}%`,n.style.top=`${18+a%6*8}%`,n.style.animationDelay=`${a*.02}s`,t.append(n)}e.append(t)}function Wd(){if(!P||P.paid)return;P.paid=!0,P.over=!0,P.timing=!1;let e=Math.max(0,Math.floor(P.elapsed/1e3)),t=Lc(P.state.moves,e,P.level),r=P.launch.mode==="daily",i=r?Fc(P.level.daily||Hr(new Date),t):Oc(P.level.id,t);_c(),ba(),Sa(1.3),r||Gc(P.level.id),rc("clear");let a=!r&&(P.level.reward||1)>1?i.gain:0;a&&vn(a),Nd(20),tr("win",`Win ${t} stars ${P.state.moves} moves`);let n=rn();Tx();let s=document.createElement("h2");s.textContent=r?Ne.winDaily:Ne.win;let o=document.createElement("p");o.className="stars";for(let u=0;u<3;u+=1){let h=document.createElement("span");h.textContent="\u2605",h.className=u<t?"pop":"pop off",h.style.animationDelay=`${u*120}ms`,o.append(h)}let l=document.createElement("p");l.textContent=`${P.state.moves} moves \xB7 ${e}s \xB7 par ${P.level.par}`;let c=document.createElement("p");if(c.className="lead",c.textContent=`+${i.gain+a} coins`,n.append(s,o,l,c),an(),Or(),r){let u=Fs(P.level,{daily:!0,stars:t,moves:P.state.moves,time:e},ss(P.level.daily||Hr(new Date))),h=document.createElement("pre");h.className="share",h.textContent=u;let d=er(Ne.share,"btn primary",async()=>{await Id(u)==="copied"&&$t(Ne.copied)});n.append(h,d)}!r&&P.level.id<Br&&n.append(er(Ne.next,"btn primary",()=>{st(),dr({mode:"level",id:P.level.id+1})})),n.append(er(Ne.retry,"btn",()=>{st(),dr(P.launch)})),n.append(er(r?"Lobby":Ne.map,"btn",()=>{st(),r?tn():ls()}))}function en(e){if(!P||P.over)return;P.over=!0,P.timing=!1,xc(),P.launch.mode!=="daily"&&Vc(P.level.id),tr("lose",e==="full"?Ne.loseFull:Ne.loseJam);let t=rn(),r=document.createElement("h2");r.textContent=e==="full"?Ne.loseFull:Ne.loseJam;let i=document.createElement("p");i.textContent=Ne.loseHint,t.append(r,i),t.append(er(Ne.retry,"btn primary",()=>{st(),dr(P.launch)})),e==="full"&&!P.state.extraUsed&&t.append(er(Ne.extraBay,"btn",()=>{P.over=!1,Ir(),os("bay")})),t.append(er(Ne.map,"btn",()=>{st(),P.launch.mode==="daily"?tn():ls()})),Or()}function Xd(e){let t=e-Ad;if(Ad=e,P&&!P.over&&!P.busy&&Ze&&Ze.pulse&&e-(P.lastInput||e)>1e4&&!P.hinted){let r=Rc(P.state,P.level);r>=0&&(P.hinted=!0,Ze.pulse(r))}if(P&&P.timing&&!P.over&&!document.hidden){P.elapsed+=Math.min(t,1e3);let r=Math.floor(P.elapsed/1e3);r!==P.shown&&(P.shown=r,ne("g-time").textContent=`${r}s`)}requestAnimationFrame(Xd)}function wx(){ne("t-title").textContent=li.title,ne("t-sub").textContent=li.subtitle,ne("t-foot").textContent=li.footnote,document.title=li.title,ne("t-levels").textContent=Ne.levels,ne("t-daily").textContent=Ne.daily,ne("t-shop").textContent=Ne.shop,ne("m-title").textContent=Ne.levels,ne("s-title").textContent=Ne.shop,ne("d-title").textContent=li.dailyName,ne("g-bay").innerHTML=`${ur.bay}<span>${Ne.extraBay}</span>`,ne("g-undo").innerHTML=`${ur.undo}<span>${Ne.undo}</span>`,ne("g-shuffle").innerHTML=`${ur.shuffle}<span>${Ne.shuffle}</span>`;for(let e of["m-back","s-back","d-back","g-back","r-back","n-back","set-back"])ne(e).innerHTML=ur.back;ne("g-restart").innerHTML=ur.restart;for(let e of["t-coins","m-coins","s-coins","g-coins"]){let t=ne(e);t.innerHTML=`${ur.coin}<span>0</span>`}ne("t-play").addEventListener("click",()=>{st();let e=Math.min(Br,Math.max(1,Oe().unlocked));dr({mode:"level",id:e})}),ne("t-levels").addEventListener("click",()=>{st(),ls()}),ne("t-daily").addEventListener("click",()=>{st(),tn()}),ne("t-shop").addEventListener("click",()=>{st(),Od()}),ne("t-rank").addEventListener("click",()=>{st(),jd()}),ne("t-missions").addEventListener("click",()=>{st(),qd()}),ne("t-event").addEventListener("click",()=>{st(),Yd()}),ne("t-settings").addEventListener("click",()=>{st(),ii("settings"),ne("set-cb").textContent=Oe().colorblind?"Colour-blind palette: on":"Colour-blind palette: off"}),ne("set-back").addEventListener("click",()=>ei()),ne("set-cb").addEventListener("click",()=>{jc(!Oe().colorblind),ne("set-cb").textContent=Oe().colorblind?"Colour-blind palette: on":"Colour-blind palette: off"}),ne("r-back").addEventListener("click",()=>ei()),ne("n-back").addEventListener("click",()=>ei()),ne("t-mute").addEventListener("click",Cd),ne("g-mute").addEventListener("click",Cd),ne("t-music").addEventListener("click",Rd),ne("g-music").addEventListener("click",Rd),ne("m-back").addEventListener("click",()=>{st(),ei()}),ne("s-back").addEventListener("click",()=>{st(),ei()}),ne("d-back").addEventListener("click",()=>{st(),ei()}),ne("g-back").addEventListener("click",()=>{!P||P.busy||(st(),P.launch.mode==="daily"?tn():ls())}),ne("g-restart").addEventListener("click",()=>{!P||P.busy||(st(),dr(P.launch))}),ne("m-prev").addEventListener("click",()=>{ri>0&&(ri-=1,tc())}),ne("m-next").addEventListener("click",()=>{ri<Math.ceil(Br/12)-1&&(ri+=1,tc())}),ne("g-bay").addEventListener("click",()=>os("bay")),ne("g-undo").addEventListener("click",()=>os("undo")),ne("g-shuffle").addEventListener("click",()=>os("shuffle")),document.body.addEventListener("pointerdown",e=>{e.target.closest("[data-music]")||Ts()}),requestAnimationFrame(Xd)}function Ax(){let e=ne("coach");if(!e)return;let t=P&&P.level&&P.level.tutorial;if(!t||Oe().seen.includes(t.mech)){e.hidden=!0;return}e.hidden=!1,ne("coach-text").textContent=t.text,ne("coach-go").onclick=()=>{Wc(t.mech),e.hidden=!0;let r=Ze.project(t.focus||0),i=ne("coach-hand");if(r&&i){let a=ne("app").getBoundingClientRect();i.hidden=!1,i.style.left=`${r.x-a.left}px`,i.style.top=`${r.y-a.top}px`,setTimeout(()=>{i.hidden=!0},1800)}}}function jd(){let e=ne("rank-list");e.replaceChildren();let t=Oe();Sc.forEach((r,i)=>{let a=document.createElement("article");a.className="shop-row";let n=document.createElement("div"),s=document.createElement("strong");s.textContent=r.name;let o=document.createElement("p");o.textContent=i<t.rank?"Built":i===t.rank?"Yours now":`${r.cost} coins`,n.append(s,o);let l=document.createElement("button");l.type="button",l.className="btn small primary",l.textContent=i<t.rank?"Built":i===t.rank?"Yours":i===t.rank+1?"Build":"Locked",l.disabled=i!==t.rank+1,l.addEventListener("click",()=>{if(t.coins<r.cost){$t("Need coins");return}vn(-r.cost),Xc(i),ba(),jd()}),a.append(n,l),e.append(a)}),ii("rank"),Pt&&(Pt.setStage(Oe().rank),Pt.resize(),Pt.start()),tr("rank","Your rank")}function qd(){let e=ne("mission-list");e.replaceChildren();let t=Hr(new Date),r=Oe();r.missionsDate!==t&&(r.missionsDate=t,r.missionProgress=[0,0,0],r.missionClaimed=[!1,!1,!1],localStorage.setItem("trr_save_v1",JSON.stringify(r))),[["Depart 8 combis",8,15,null],["Reach a x3 combo",3,10,"undo"],["Clear 2 levels",2,12,"shuffle"]].forEach((a,n)=>{let s=document.createElement("article");s.className="shop-row";let o=document.createElement("div"),l=document.createElement("strong");l.textContent=a[0];let c=document.createElement("p"),u=Oe().missionProgress[n]||0;c.textContent=`${Math.min(u,a[1])} / ${a[1]}`,o.append(l,c);let h=document.createElement("button");h.type="button",h.className="btn small primary";let d=Oe().missionClaimed[n];h.textContent=d?"Done":"Claim",h.disabled=d||u<a[1],h.addEventListener("click",()=>{let p=Oe();p.missionClaimed[n]=!0,p.coins+=a[2],a[3]&&(p.tokens[a[3]]=(p.tokens[a[3]]||0)+1),localStorage.setItem("trr_save_v1",JSON.stringify(p)),ba(),qd()}),s.append(o,h),e.append(s)}),ii("missions"),tr("missions","Missions")}function Yd(){let e=Oe(),t=Hr(new Date).slice(0,7);e.eventWeek!==t&&(e.eventWeek=t,e.eventStep=0,e.eventDone=!1,localStorage.setItem("trr_save_v1",JSON.stringify(e)));let r=Oe();if(r.eventDone){$t("Ladder cleared"),ei();return}let i=Uc(r.eventStep||0,Ds(`month-end:${t}`));dr({mode:"event",id:(r.eventStep||0)+1,level:i})}async function Cx(){wx();let e=ne("turntable"),t=Ed(e);t.ok&&(Pt=t,new ResizeObserver(()=>Pt.resize()).observe(e),Pt.setLook(Oe().livery),Pt.resize());let r=ne("boot-fill");r&&(r.style.width="100%"),ne("boot").hidden=!0;let i={size:4,luggage:8,twotone:12,tarp:16,lock:20,gaartjie:24,robot:28,cone:32,officer:36,queues:40,tow:44,rain:48}[hr.get("mech")],a={durban:1,joburg:31,cape:61,gqeberha:91,bloem:121}[hr.get("region")];ti.level>=1&&ti.level<=Br?dr({mode:"level",id:ti.level|0}):i?dr({mode:"level",id:i}):a?dr({mode:"level",id:a}):hr.has("event")?Yd():ti.daily?tn():ei(),globalThis.TRR={get screen(){return document.body.dataset.screen},get game(){return P},project(n){return Ze&&Ze.project?Ze.project(n):null}}}Cx().catch(e=>{console.error(e),ne("boot").hidden=!1,ne("boot-note").textContent="The rank did not load."});setTimeout(()=>{!hr.has("nosw")&&"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js",{scope:"./"}).catch(()=>{})},2500);
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
