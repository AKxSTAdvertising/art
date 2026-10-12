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
    const maxW=Math.min(innerWidth*.88,1420), maxH=innerHeight*.76;
    const scale=Math.min(maxW/art.naturalWidth,maxH/art.naturalHeight);
    box={w:art.naturalWidth*scale,h:art.naturalHeight*scale};
    box.x=(innerWidth-box.w)/2;box.y=Math.max(28,(innerHeight-box.h-125)/2);
    if(ended)draw(1);
  }
  /* A visible pencil follows every short left-right drawing pass. */
  const pencil=document.createElement('div');
  pencil.className='sketch-pencil';
  pencil.setAttribute('aria-hidden','true');
  pencil.innerHTML='<svg viewBox="0 0 64 64" focusable="false"><defs><linearGradient id="pencilWood" x1="0" x2="1"><stop stop-color="#f7e3b7"/><stop offset=".55" stop-color="#c99a5b"/><stop offset="1" stop-color="#f0d5a0"/></linearGradient></defs><path d="M12 46 42 8 Q46 3 51 8 L56 13 Q60 17 55 22 L25 52 8 57Z" fill="url(#pencilWood)" stroke="#45403b" stroke-width="2"/><path d="M42 8 56 22M12 46 25 52" fill="none" stroke="#5b5146" stroke-width="2"/><path d="M8 57 12 46 25 52Z" fill="#e8d5b8" stroke="#45403b" stroke-width="1.5"/><path d="M8 57 13 53" stroke="#252321" stroke-width="2"/><path d="M48 6 53 2 61 10 56 15" fill="#e7a7a9" stroke="#45403b" stroke-width="1.5"/></svg>';
  intro.appendChild(pencil);
  function draw(progress){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    if(!art.complete||!art.naturalWidth)return;
    const p=Math.max(0,Math.min(1,progress));
    const rowH=Math.max(4,Math.min(7,box.h/115));
    const rows=Math.ceil(box.h/rowH);
    const total=p*rows;
    const row=Math.min(rows,Math.floor(total));
    const across=total-row;
    const y=box.y+Math.min(box.h,row*rowH);
    const leftToRight=row%2===0;
    const x=box.x+(leftToRight?across:1-across)*box.w;
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x,box.y,box.w,Math.min(box.h,row*rowH));
    if(row<rows){
      if(leftToRight)ctx.rect(box.x,y,Math.max(0,x-box.x),rowH+1);
      else ctx.rect(x,y,Math.max(0,box.x+box.w-x),rowH+1);
    }
    ctx.clip();
    ctx.drawImage(art,box.x,box.y,box.w,box.h);
    ctx.restore();
    if(p<1){
      /* Dark graphite scratch marks at the active line, plus a faint pencil trail. */
      ctx.save();
      for(let i=0;i<34;i++){
        const xx=box.x+((i*37+row*19)%(Math.max(1,box.w)));
        const yy=y+Math.sin(i*2.1+row)*4;
        ctx.beginPath();ctx.moveTo(xx,yy-4);ctx.lineTo(xx+(i%2?5:-5),yy+4);
        ctx.strokeStyle='rgba(47,43,39,'+(0.28+(i%4)*.08)+')';ctx.lineWidth=.7;ctx.stroke();
      }
      ctx.beginPath();ctx.moveTo(leftToRight?box.x:x,y+rowH*.5);ctx.lineTo(leftToRight?x:box.x+box.w,y+rowH*.5);
      ctx.strokeStyle='rgba(35,32,29,.8)';ctx.lineWidth=1.1;ctx.stroke();ctx.restore();
      pencil.style.display='block';
      pencil.style.left=Math.max(0,Math.min(innerWidth-52,x-24))+'px';
      pencil.style.top=Math.max(0,Math.min(innerHeight-52,y-34))+'px';
      pencil.style.transform='rotate('+(leftToRight?35:-145)+'deg)';
    }else{pencil.style.display='none';}
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