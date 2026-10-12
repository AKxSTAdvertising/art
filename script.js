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


/* White-canvas colour burst intro: no brush, liquid colour, dimensional brand reveal. */
(function initColourIntro(){
  const intro=document.getElementById('paint-intro');
  if(!intro)return;
  const brand=intro.querySelector('.paint-intro-brand');
  const skip=intro.querySelector('.paint-intro-skip');
  const landscape=intro.querySelector('.paint-intro-landscape');
  const canvas=intro.querySelector('.paint-intro-canvas');
  const brush=intro.querySelector('.paint-intro-brush');
  if(landscape)landscape.remove();
  if(canvas)canvas.remove();
  if(brush)brush.remove();
  intro.classList.add('colour-intro');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finished=false, timers=[];
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id;};
  function finish(){
    if(finished)return;finished=true;timers.forEach(clearTimeout);
    intro.classList.add('is-finished');
    try{sessionStorage.setItem('artPaintIntroSeen','1')}catch(e){}
    later(()=>intro.remove(),950);
  }
  if(reduce){intro.remove();return;}
  try{if(sessionStorage.getItem('artPaintIntroSeen')==='1'){intro.remove();return;}}catch(e){}
  const colours=[
    ['#ff4b45','#ffb52e','#ff4bba'],['#22c9d6','#5d67ff','#a75bff'],
    ['#ff7a22','#f12d73','#ffd447'],['#3ad69a','#00a9ff','#e65aff'],
    ['#ffd43b','#ff5b5b','#5a7cff'],['#fb4ca4','#8d4bff','#35d6d0']
  ];
  function splash(i){
    const el=document.createElement('div');
    el.className='colour-splash splash-'+(i%6);
    const x=8+Math.random()*84,y=4+Math.random()*52;
    el.style.left=x+'%';el.style.top=y+'%';
    el.style.setProperty('--splash-delay',(i*90)+'ms');
    const c=colours[i%colours.length];
    el.style.setProperty('--c1',c[0]);el.style.setProperty('--c2',c[1]);el.style.setProperty('--c3',c[2]);
    el.style.setProperty('--turn',(Math.random()*70-35)+'deg');
    intro.insertBefore(el,brand);
    later(()=>el.remove(),3100);
  }
  async function run(){
    await new Promise(resolve=>later(resolve,220));
    for(let i=0;i<6;i++){splash(i);await new Promise(resolve=>later(resolve,430));}
    await new Promise(resolve=>later(resolve,180));
    brand.classList.add('is-visible','is-3d');
    await new Promise(resolve=>later(resolve,1450));
    finish();
  }
  if(skip)skip.addEventListener('click',finish);
  run().catch(finish);
})();
