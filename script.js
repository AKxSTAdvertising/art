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


/* Six-second zig-zag sketch reveal of the uploaded artwork. */
(function initSketchIntro(){
  const intro=document.getElementById('paint-intro');
  if(!intro)return;
  const brand=intro.querySelector('.paint-intro-brand');
  const skip=intro.querySelector('.paint-intro-skip');
  const oldNodes=intro.querySelectorAll('.paint-intro-landscape,.paint-intro-brush');
  oldNodes.forEach(n=>n.remove());
  intro.classList.add('sketch-intro');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ended=false, frame=0, startTime=0, raf=0;
  const canvas=intro.querySelector('.paint-intro-canvas');
  if(!canvas||!brand){intro.remove();return;}
  const ctx=canvas.getContext('2d');
  const art=new Image();
  art.src='https://raw.githubusercontent.com/AKxSTAdvertising/art/main/images/WhatsApp%20Image%202026-10-12%20at%202.15.12%20PM.jpeg';
  let box={x:0,y:0,w:0,h:0};
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);
    canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const maxW=Math.min(innerWidth*.94,1500), maxH=innerHeight*.78;
    const scale=Math.min(maxW/art.naturalWidth,maxH/art.naturalHeight);
    box={w:art.naturalWidth*scale,h:art.naturalHeight*scale};
    box.x=(innerWidth-box.w)/2;box.y=Math.max(22,(innerHeight-box.h-100)/2);
    if(ended)draw(1);
  }
  function draw(progress){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    if(!art.complete||!art.naturalWidth)return;
    const p=Math.max(0,Math.min(1,progress));
    const step=Math.max(7,Math.min(13,box.h/58));
    /* Reveal in hand-drawn, side-to-side zig-zag passes rather than a flat wipe. */
    const edge=box.y+box.h*p;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(box.x-3,box.y-3);
    for(let x=box.x;x<=box.x+box.w+step;x+=step){
      const yy=edge+Math.sin(x*.075)*Math.min(8,box.w*.008)+(Math.round((x-box.x)/step)%2? -step*.58:step*.58);
      ctx.lineTo(x,Math.max(box.y-3,Math.min(box.y+box.h+3,yy)));
    }
    ctx.lineTo(box.x+box.w+3,box.y-3);ctx.closePath();ctx.clip();
    ctx.drawImage(art,box.x,box.y,box.w,box.h);
    ctx.restore();
    /* Fine graphite hatching at the active edge makes the reveal feel drawn by hand. */
    if(p<.995){
      ctx.save();
      for(let x=box.x-12;x<box.x+box.w+12;x+=7){
        const yy=edge+Math.sin(x*.075)*Math.min(8,box.w*.008);
        ctx.beginPath();
        ctx.moveTo(x,yy-8);ctx.lineTo(x+((Math.floor(x)%2)?-9:9),yy+7);
        ctx.strokeStyle='rgba(48,43,40,.58)';ctx.lineWidth=.8;ctx.stroke();
      }
      ctx.restore();
    }
  }
  function finish(){
    if(ended)return;ended=true;
    if(raf)cancelAnimationFrame(raf);
    draw(1);
    brand.classList.add('is-visible');
    intro.classList.add('sketch-complete');
    window.setTimeout(()=>{intro.classList.add('is-finished');window.setTimeout(()=>intro.remove(),850);},950);
  }
  function animate(now){
    if(!startTime)startTime=now;
    const p=Math.min(1,(now-startTime)/6000);
    draw(p);
    if(p<1){raf=requestAnimationFrame(animate);}
    else finish();
    if(p>.78)brand.classList.add('is-visible');
  }
  skip?.addEventListener('click',finish);
  window.addEventListener('resize',resize);
  art.onload=()=>{
    resize();
    if(reduce){draw(1);brand.classList.add('is-visible');window.setTimeout(finish,1000);return;}
    raf=requestAnimationFrame(animate);
  };
  art.onerror=()=>{
    /* If the hosted image is temporarily unavailable, keep the intro usable. */
    brand.classList.add('is-visible');
    window.setTimeout(finish,1200);
  };
})();