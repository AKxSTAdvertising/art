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


/* Home intro + transient custom brush cursor. No permanent paint trail is left. */
(function(){
  const intro=document.getElementById('art-intro');
  const brush=document.querySelector('.art-brush-cursor');
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(intro){
    document.documentElement.classList.add('intro-running');
    const finish=()=>{if(!intro.classList.contains('is-leaving'))intro.classList.add('is-leaving');document.documentElement.classList.remove('intro-running');};
    window.setTimeout(finish,reduced?1500:5200);
    intro.addEventListener('click',finish,{once:true});
    intro.addEventListener('animationend',(event)=>{if(event.animationName==='artLandscapeReveal')window.setTimeout(finish,1900);});
    window.addEventListener('pageshow',()=>{if(performance&&performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]?.type==='back_forward')finish();},{once:true});
  }
  if(!brush||reduced||!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  let targetX=-100,targetY=-100,currentX=-100,currentY=-100,frame=0,hideTimer;
  const move=(event)=>{
    targetX=event.clientX;targetY=event.clientY;
    brush.classList.add('is-visible');
    brush.classList.toggle('is-active',!!event.buttons);
    window.clearTimeout(hideTimer);
    if(!frame)frame=requestAnimationFrame(draw);
    if(event.buttons){brush.classList.add('is-active');}
  };
  const draw=()=>{
    currentX+=(targetX-currentX)*.34;currentY+=(targetY-currentY)*.34;
    brush.style.transform='translate3d('+(currentX-15)+'px,'+(currentY-30)+'px,0) rotate(-16deg)';
    if(Math.abs(targetX-currentX)>.25||Math.abs(targetY-currentY)>.25){frame=requestAnimationFrame(draw);}
    else frame=0;
  };
  document.addEventListener('pointermove',move,{passive:true});
  document.addEventListener('pointerdown',()=>brush.classList.add('is-active'));
  document.addEventListener('pointerup',()=>brush.classList.remove('is-active'));
  document.addEventListener('pointerleave',()=>{brush.classList.remove('is-visible','is-active');});
})();
