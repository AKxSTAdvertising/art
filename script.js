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


/* First-visit cinematic brush reveal: black canvas -> brand -> nature painting -> homepage. */
(function initPaintIntro(){
  const intro=document.getElementById('paint-intro');
  if(!intro) return;
  const canvas=intro.querySelector('.paint-intro-canvas');
  const brush=intro.querySelector('.paint-intro-brush');
  const brand=intro.querySelector('.paint-intro-brand');
  const skip=intro.querySelector('.paint-intro-skip');
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stopped=false,raf=0,timers=[];
  const later=(fn,ms)=>{const id=window.setTimeout(fn,ms);timers.push(id);return id;};
  function finish(){
    if(stopped)return;
    stopped=true;timers.forEach(clearTimeout);cancelAnimationFrame(raf);
    intro.classList.add('is-finished');
    try{sessionStorage.setItem('artPaintIntroSeen','1');}catch(e){}
    later(()=>intro.remove(),1000);
  }
  if(reduced){intro.remove();return;}
  try{if(sessionStorage.getItem('artPaintIntroSeen')==='1'){intro.remove();return;}}catch(e){}
  const ctx=canvas.getContext('2d');
  if(!ctx){finish();return;}
  let w=0,h=0,dpr=1;
  function size(){
    dpr=Math.min(window.devicePixelRatio||1,1.7);w=window.innerWidth;h=window.innerHeight;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#080908';ctx.fillRect(0,0,w,h);
  }
  size();
  window.addEventListener('resize',size,{passive:true});
  const pause=(ms)=>new Promise(resolve=>later(resolve,ms));
  const moveBrush=(x,y,angle=22)=>{brush.style.left=(x-brush.offsetWidth*.5)+'px';brush.style.top=(y-brush.offsetHeight*.18)+'px';brush.style.transform='rotate('+angle+'deg)';};
  function eraseStroke(points,width){
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=width;
    ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++){const p=points[i];ctx.quadraticCurveTo(points[i-1][0],points[i-1][1],p[0],p[1]);}
    ctx.stroke();ctx.restore();
  }
  function animateStroke(points,width,duration){
    return new Promise(resolve=>{
      const start=performance.now(),total=points.length;
      function frame(now){
        if(stopped){resolve();return;}
        const p=Math.min(1,(now-start)/duration),idx=Math.max(1,Math.ceil(p*(total-1)));
        const partial=points.slice(0,idx+1);
        if(p>0){eraseStroke(partial,width);const point=points[Math.min(idx,total-1)];moveBrush(point[0],point[1],18+(Math.sin(now/120)*7));}
        if(p<1)raf=requestAnimationFrame(frame);else resolve();
      }
      raf=requestAnimationFrame(frame);
    });
  }
  function curved(x1,y1,x2,y2,steps=22,bend=0){
    const out=[];for(let i=0;i<=steps;i++){const t=i/steps;out.push([x1+(x2-x1)*t,y1+(y2-y1)*t+Math.sin(t*Math.PI)*bend]);}return out;
  }
  async function run(){
    await pause(450);if(stopped)return;
    brand.classList.add('is-visible');brush.classList.add('is-active');
    const cy=h*.5,cx=w*.5;
    moveBrush(cx-w*.15,cy-8,18);
    await pause(350);if(stopped)return;
    /* A visible brush pass introduces the company mark. */
    for(let i=0;i<3&&!stopped;i++){
      const y=cy-27+i*26;
      await animateStroke(curved(cx-w*.17,y,cx+w*.16,y-3,24, i===1?3:-2),Math.max(5,w*.006),360);
    }
    if(stopped)return;
    await pause(300);brand.classList.add('is-lowered');
    /* Broad, irregular brush strokes uncover the nature artwork like wet paint. */
    const sw=Math.max(42,Math.min(94,w*.095));
    const strokes=[
      curved(-w*.08,h*.61,w*.66,h*.43,30,-h*.08),
      curved(w*.02,h*.73,w*1.08,h*.58,32,h*.035),
      curved(-w*.05,h*.83,w*.79,h*.72,30,-h*.025),
      curved(w*.2,h*.49,w*1.06,h*.38,28,-h*.025),
      curved(-w*.04,h*.55,w*.48,h*.5,24,h*.025),
      curved(w*.46,h*.88,w*1.08,h*.79,24,-h*.035)
    ];
    for(let i=0;i<strokes.length&&!stopped;i++){
      await animateStroke(strokes[i],sw*(i===4?.72:1),i===0?650:480);
    }
    if(stopped)return;
    /* Lift the remaining dark veil to land on the complete painting and homepage. */
    await pause(180);
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.restore();
    brush.classList.remove('is-active');
    later(finish,550);
  }
  skip.addEventListener('click',finish);
  run().catch(finish);
})();
