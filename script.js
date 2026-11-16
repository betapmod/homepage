(() => {
  const canvas = document.querySelector('#stars');
  const ctx = canvas.getContext('2d');
  let width, height, stars = [], pointer = {x: -1000, y: -1000};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){ width=canvas.width=innerWidth*devicePixelRatio; height=canvas.height=innerHeight*devicePixelRatio; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); stars=Array.from({length:Math.min(95,Math.floor(innerWidth/14))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.35,a:Math.random()*.7+.2,p:Math.random()*6.28,s:Math.random()*.012+.003})); }
  function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){if(!reduced)s.p+=s.s;const twinkle=.55+.45*Math.sin(s.p);ctx.beginPath();ctx.fillStyle=`rgba(210,194,255,${s.a*twinkle})`;ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();const dx=s.x-pointer.x,dy=s.y-pointer.y,d=Math.hypot(dx,dy);if(d<95&&d>0){ctx.beginPath();ctx.strokeStyle=`rgba(205,151,238,${(1-d/95)*.18})`;ctx.moveTo(s.x,s.y);ctx.lineTo(s.x+dx/d*8,s.y+dy/d*8);ctx.stroke();}}if(!reduced)requestAnimationFrame(draw);}
  resize();draw();addEventListener('resize',resize);addEventListener('pointermove',e=>pointer={x:e.clientX,y:e.clientY},{passive:true});
  const hero=document.querySelector('.hero');
  const moteLayer=document.querySelector('.hero-motes');
  if(!reduced&&moteLayer){
    const symbols=['✦','✧','•','✧'];
    for(let i=0;i<28;i++){
      const mote=document.createElement('span');
      mote.className=`hero-mote${Math.random()>.58?' petal':''}`;
      mote.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      mote.style.left=`${Math.random()*100}%`;
      mote.style.setProperty('--duration',`${9+Math.random()*12}s`);
      mote.style.setProperty('--delay',`${-Math.random()*20}s`);
      mote.style.setProperty('--drift',`${Math.random()*140-70}px`);
      mote.style.fontSize=`${7+Math.random()*10}px`;
      moteLayer.appendChild(mote);
    }
  }
  if(hero&&!reduced&&!matchMedia('(pointer: coarse)').matches){
    const move=(e)=>{
      const r=hero.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)/r.width;
      const y=(e.clientY-r.top-r.height/2)/r.height;
      hero.style.setProperty('--scene-x',`${x*-13}px`);
      hero.style.setProperty('--scene-y',`${y*-9}px`);
      hero.style.setProperty('--haze-x',`${x*28}px`);
      hero.style.setProperty('--haze-y',`${y*18}px`);
      hero.style.setProperty('--student-x',`${x*-17}px`);
      hero.style.setProperty('--student-y',`${y*-9}px`);
    };
    hero.addEventListener('pointermove',move,{passive:true});
    hero.addEventListener('pointerleave',()=>{
      for(const key of ['--scene-x','--scene-y','--haze-x','--haze-y','--student-x','--student-y'])hero.style.removeProperty(key);
    },{passive:true});
  }else if(hero&&!reduced){
    let ticking=false;
    addEventListener('scroll',()=>{
      if(ticking)return;ticking=true;
      requestAnimationFrame(()=>{
        const rect=hero.getBoundingClientRect();
        hero.style.setProperty('--scene-y',`${Math.max(-18,Math.min(0,rect.top*.035))}px`);
        ticking=false;
      });
    },{passive:true});
  }
  const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav');
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  const characterMessage=document.querySelector('.character-message');
  if(characterMessage){
    const lines=['Một ngày mới, một ý tưởng mới! ✦','Chào mừng bạn ghé vào góc nhỏ của Điền!','Mình đang lưu một chút nắng vào kho lưu trữ đây.','Cứ thong thả khám phá nhé!'];
    let lastLine=-1;
    characterMessage.addEventListener('click',()=>{
      let next=Math.floor(Math.random()*lines.length);
      if(lines.length>1&&next===lastLine)next=(next+1)%lines.length;
      lastLine=next;characterMessage.innerHTML=`${lines[next]} <span>✦</span>`;
      characterMessage.classList.remove('say-line');void characterMessage.offsetWidth;characterMessage.classList.add('say-line');
    });
  }
  const fullscreen=document.querySelector('.fullscreen-toggle');
  fullscreen?.addEventListener('click',async()=>{
    try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}
    catch{showToast('Trình duyệt chưa cho phép toàn màn hình');}
  });
  document.addEventListener('fullscreenchange',()=>{
    if(!fullscreen)return;
    const active=Boolean(document.fullscreenElement);
    fullscreen.textContent=active?'⛶':'⛶';
    fullscreen.setAttribute('aria-label',active?'Thoát toàn màn hình':'Bật toàn màn hình');
  });
  const top=document.querySelector('.to-top');addEventListener('scroll',()=>top.classList.toggle('visible',scrollY>500),{passive:true});top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.section-index,.about-layout,.about-stats,.work-heading,.project-card,.project-footnote,.contact-copy,.contact-button,.social-links').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  const toast=document.querySelector('.toast');let toastTimer;function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);}
  // Browser audio starts only after a deliberate click; generated tones keep the page dependency-free.
  let audio=null,osc=null,gain=null,soundOn=false;document.querySelector('.sound-toggle').addEventListener('click',()=>{try{if(!audio){audio=new AudioContext();osc=audio.createOscillator();gain=audio.createGain();osc.type='sine';osc.frequency.value=174.61;gain.gain.value=0;osc.connect(gain).connect(audio.destination);osc.start();}soundOn=!soundOn;if(soundOn){audio.resume();gain.gain.setTargetAtTime(.012,audio.currentTime,.25);osc.frequency.setTargetAtTime(196,audio.currentTime,.8);}else gain.gain.setTargetAtTime(0,audio.currentTime,.15);document.querySelector('.sound-toggle').innerHTML=`♫ <span>${soundOn?'ĐANG BẬT':'ÂM THANH'}</span>`;showToast(soundOn?'Âm thanh nền đã bật':'Đã tắt âm thanh');}catch{showToast('Trình duyệt chưa hỗ trợ âm thanh');}});
  document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('click',()=>showToast('Một ý tưởng nhỏ đang chờ được hoàn thiện ✦')));
  document.querySelectorAll('.button').forEach(el=>el.classList.add('magnetic'));
  if(!matchMedia('(pointer: coarse)').matches){document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`;}));document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));}
})();
