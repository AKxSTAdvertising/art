const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#site-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);toggle.firstChild.textContent=open?'Close ':'Menu ';});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');toggle.firstChild.textContent='Menu ';}));}const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
/* Small scroll reveals: motion stays subtle and respects accessibility preferences. */
const motionTargets=document.querySelectorAll('.section-heading,.path-card,.feature-artwork,.feature-copy,.gallery-tile,.artist-copy,.process-grid article,.faq-intro,.faq-list details,.closing-inner');
const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(motionTargets.length){
  if(!reduceMotion&&'IntersectionObserver' in window){
    motionTargets.forEach((el)=>el.classList.add('art-reveal'));
    const revealObserver=new IntersectionObserver((entries,observer)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:0.12,rootMargin:'0px 0px -36px 0px'});
    motionTargets.forEach((el)=>revealObserver.observe(el));
  }else{
    motionTargets.forEach((el)=>el.classList.add('is-visible'));
  }
}


/* Four-second white-canvas liquid paint throw and bold dimensional brand reveal. */
(function initColourIntro(){
  const intro=document.getElementById('paint-intro');
  if(!intro)return;
  const brand=intro.querySelector('.paint-intro-brand');
  const skip=intro.querySelector('.paint-intro-skip');
  ['.paint-intro-landscape','.paint-intro-canvas','.paint-intro-brush'].forEach(s=>intro.querySelector(s)?.remove());
  intro.classList.add('colour-intro');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finished=false,timers=[];
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id;};
  function finish(){
    if(finished)return;finished=true;timers.forEach(clearTimeout);
    intro.classList.add('is-finished');
    later(()=>intro.remove(),850);
  }
  if(reduce){intro.remove();return;}
  const palette=[
    ['#ff3b30','#ffb21c','#f72585'],['#00c2d1','#2364ff','#8a2be2'],
    ['#ff6a00','#ff1744','#ffd400'],['#00b879','#00a6fb','#d000ff'],
    ['#ffcc00','#ff4d6d','#4361ee'],['#ff1493','#7b2cff','#00d4ff']
  ];
  function makeDrop(parent,x,y,size,colour,delay,angle){
    const d=document.createElement('i');
    d.className='liquid-drop';
    d.style.left=x+'%';d.style.top=y+'%';d.style.width=size+'px';
    d.style.setProperty('--drop-colour',colour);d.style.setProperty('--drop-delay',delay+'ms');d.style.setProperty('--drop-angle',angle+'deg');
    parent.appendChild(d);later(()=>d.remove(),6200+delay);
  }
  function splash(i){
    const el=document.createElement('div');el.className='colour-splash splash-'+(i%6);
    /* Fixed, screen-wide coverage prevents bursts clustering in one area. */
    const positions=[
      [8,18],[30,42],[53,15],[78,34],
      [94,57],[17,68],[61,61],[84,12]
    ];
    const [baseX,baseY]=positions[i%positions.length];
    const x=Math.max(5,Math.min(95,baseX+(Math.random()-.5)*8));
    const y=Math.max(8,Math.min(78,baseY+(Math.random()-.5)*8));
    el.style.left=x+'%';el.style.top=y+'%';
    const c=palette[i%palette.length];
    el.style.setProperty('--c1',c[0]);el.style.setProperty('--c2',c[1]);el.style.setProperty('--c3',c[2]);
    el.style.setProperty('--turn',(Math.random()*40-20)+'deg');
    el.style.setProperty('--splash-delay',(i*70)+'ms');
    intro.insertBefore(el,brand);
    /* Fine satellite droplets make the burst read like thrown liquid paint. */
    for(let d=0;d<11;d++){
      const dx=(Math.random()-.5)*38,dy=(Math.random()-.5)*38;
      makeDrop(intro,Math.max(1,Math.min(99,x+dx)),Math.max(1,Math.min(85,y+dy)),3+Math.random()*12,c[d%3],i*65+Math.random()*180,Math.random()*80-40);
    }
    later(()=>el.remove(),6200);
  }
  async function run(){
    await new Promise(resolve=>later(resolve,120));
    /* Eight evenly spaced paint throws, then hold the full composition for a six-second intro. */
    for(let i=0;i<8;i++){splash(i);await new Promise(resolve=>later(resolve,360));}
    await new Promise(resolve=>later(resolve,260));
    brand.classList.add('is-visible','is-3d');
    await new Promise(resolve=>later(resolve,2900));
    finish();
  }
  if(skip)skip.addEventListener('click',finish);
  run().catch(finish);
})();
