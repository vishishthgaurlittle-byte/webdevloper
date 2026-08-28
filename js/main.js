// KAATYA WEB DEVELOPER - Main Interactions
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ autoRaf: true, lerp: 0.08, smoothWheel: true });

// Loader
let loaderProgress = 0;
const loaderBar = document.getElementById('loader-bar');
const loaderPercent = document.getElementById('loader-percent');
const loaderInterval = setInterval(() => {
  loaderProgress += Math.random() * 18;
  if (loaderProgress > 100) loaderProgress = 100;
  if(loaderBar) loaderBar.style.width = loaderProgress + '%';
  if(loaderPercent) loaderPercent.textContent = Math.floor(loaderProgress) + '%';
  if (loaderProgress >= 100) {
    clearInterval(loaderInterval);
    gsap.timeline()
      .to('#loader-text-1', { y: '0%', duration: 0.8, ease: 'power4.out' })
      .to('#loader-text-2', { y: '0%', duration: 0.8, ease: 'power4.out' }, '-=0.5')
      .to('#loader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.3 })
      .fromTo('#h1-1', { y: '100%' }, { y: '0%', duration: 1, ease: 'power4.out' }, '-=0.6')
      .fromTo('#h1-2', { y: '100%' }, { y: '0%', duration: 1, ease: 'power4.out' }, '-=0.8')
      .fromTo('#h1-3', { y: '100%' }, { y: '0%', duration: 1, ease: 'power4.out' }, '-=0.8')
      .fromTo('#h1-4', { y: '100%' }, { y: '0%', duration: 1, ease: 'power4.out' }, '-=0.8')
      .fromTo('#nav', { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5');
  }
}, 80);

// THREE.JS Hero
const canvas = document.getElementById('hero-canvas');
if(canvas){
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry1 = new THREE.TorusGeometry(2, 0.4, 16, 100);
  const material1 = new THREE.MeshStandardMaterial({ color: 0xD6FF57, wireframe: true, transparent: true, opacity: 0.6 });
  const torus = new THREE.Mesh(geometry1, material1);
  torus.position.set(2, 0.5, -5);
  scene.add(torus);

  const geometry2 = new THREE.IcosahedronGeometry(1.2, 1);
  const material2 = new THREE.MeshStandardMaterial({ color: 0x8A5CFF, wireframe: true, transparent: true, opacity: 0.5 });
  const ico = new THREE.Mesh(geometry2, material2);
  ico.position.set(-2.5, -0.5, -4);
  scene.add(ico);

  const particlesGeo = new THREE.BufferGeometry();
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 20;
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.4 });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,5,5);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  camera.position.z = 5;

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateThree() {
    requestAnimationFrame(animateThree);
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.008;
    ico.rotation.x += 0.004;
    ico.rotation.y += 0.006;
    particles.rotation.y += 0.0005;
    torus.position.x += (mouseX * 0.5 - torus.position.x + 2) * 0.02;
    torus.position.y += (-mouseY * 0.5 - torus.position.y + 0.5) * 0.02;
    ico.position.x += (-mouseX * 0.3 - ico.position.x -2.5) * 0.02;
    renderer.render(scene, camera);
  }
  animateThree();

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: '+=2000',
    scrub: 1,
    onUpdate: self => {
      const p = self.progress;
      torus.rotation.z = p * Math.PI * 2;
      torus.scale.setScalar(1 + p);
      camera.position.z = 5 - p * 2;
      particlesMat.opacity = 0.4 - p * 0.3;
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Work Grid Data - With Transitions & Materials (as requested)
const demos = [
  { 
    id: 'depth-parallax', title: '3D Depth Parallax', tag: 'MOST LOVED — 3 LAYERS', 
    desc: 'Foreground, mid, background moving at different speeds with perspective origin shift.',
    color: 'bg-lime', complexity: 'Medium', price: '₹29,999', preview: 'depth',
    transition: 'Parallax Y (0.2x / 0.5x / 1.2x) + Scale 1→1.2 + Opacity 0→1 + RotateZ 0→15°',
    materials: ['GSAP 3.12.5', 'ScrollTrigger', 'Lenis Smooth 1.1.18', 'CSS 3D perspective', 'will-change: transform', 'Perspective 1000px'],
    code: 'gsap.to(layer, { y: -speed*400, scale: 1+progress*0.2, scrub: 1 })',
    performance: '60fps • 1.8s load • 0 CLS',
    useCase: 'Hero sections, storytelling, product depth'
  },
  { 
    id: 'horizontal', title: 'Horizontal Journey', tag: 'APPLE STYLE — HORIZONTAL SCROLL',
    desc: 'Vertical scroll drives horizontal track. Pin + scrub like Apple AirPods page.',
    color: 'bg-violet', complexity: 'Advanced', price: '₹39,999', preview: 'horizontal',
    transition: 'Pin section 100vh + x: -(trackWidth - viewport) + scrub 1 + anticipatePin + Snap 0.2',
    materials: ['GSAP ScrollTrigger Pin', 'Lenis', 'Horizontal Track 300vw', 'CSS Flex w-max', 'transform: translateX', 'Apple Easing [0.76,0,0.24,1]'],
    code: 'gsap.to(track, { x: -(width - win), scrollTrigger: { pin:true, scrub:1 } })',
    performance: '60fps • 2.1s • Horizontal momentum',
    useCase: 'Timelines, lookbooks, feature journeys'
  },
  { 
    id: 'stack', title: 'Sticky Stack', tag: 'HIGH CONVERTING — SAAS FAVORITE',
    desc: 'Cards stack and stick with scale + blur + brightness. Perfect for SaaS features.',
    color: 'bg-white', complexity: 'Medium', price: '₹29,999', preview: 'stack',
    transition: 'Sticky top 28→44 + Scale 0.9→1 + Blur 10px→0 + Brightness 0.8→1 + y 100→0 + stagger 0.1',
    materials: ['GSAP', 'ScrollTrigger Sticky', 'CSS backdrop-filter blur', 'Scale Transform', 'Lenis', 'Tailwind glass'],
    code: 'gsap.fromTo(card, {scale:0.9, y:100}, {scale:1, y:0, scrub:true})',
    performance: '60fps • 1.5s • High conversion +34%',
    useCase: 'SaaS features, pricing, process steps'
  },
  { 
    id: 'reveal', title: 'Image Reveal Warp', tag: 'EDITORIAL — AWWWARDS WINNER',
    desc: 'Clip-path polygon reveal + scale + RGB split + warp. Editorial magazine feel.',
    color: 'bg-paper', complexity: 'Advanced', price: '₹34,999', preview: 'reveal',
    transition: 'clip-path: polygon(0% 100% → 0% 0%) + Scale 1.3→1 + RGB split 10px + Warp skew 10°→0 + Opacity',
    materials: ['GSAP', 'clip-path CSS', 'filter: blur + contrast', 'mix-blend-mode', 'RGB Split Shader', 'Lenis + SplitText'],
    code: 'gsap.to(img, { clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)", scale:1 })',
    performance: '60fps • 2.3s • Editorial luxury feel',
    useCase: 'Fashion, luxury, hospitality, portfolios'
  },
  { 
    id: 'morph', title: 'WebGL Morph Blob', tag: 'WEBGL — SHADERS • ULTRA',
    desc: 'Liquid blob morphing driven by scroll progress. Three.js + custom shaders.',
    color: 'bg-ink', complexity: 'Ultra', price: '₹89,999', preview: 'morph', dark: true,
    transition: 'Three.js ShaderMaterial + Uniform uProgress (0→1) + Vertex displacement + Fragment RGB shift + Torus rotation',
    materials: ['Three.js r128', 'WebGLRenderer', 'ShaderMaterial', 'TorusGeometry + Icosahedron', 'GLSL vertex/fragment', 'GSAP scrub → shader uniform', 'PointsMaterial particles 800'],
    code: 'material.uniforms.uProgress.value = scrollProgress; torus.rotation.z = progress*PI*2',
    performance: '55-60fps • WebGL • 2.8s • GPU accelerated',
    useCase: 'Ultra premium, tech startups, creative agencies, award sites'
  },
  { 
    id: 'text-warp', title: 'Kinetic Text Warp', tag: 'TYPO OBSESSED — VIRAL',
    desc: 'Letters warp, stretch, pin, blur. ScrollTrigger + SplitText for viral typography.',
    color: 'bg-[#FF5A1F]', complexity: 'Medium', price: '₹27,999', preview: 'text',
    transition: 'SplitText chars + y 100%→0 + rotateX 90°→0 + scaleY 0→1 + blur 20px→0 + stagger 0.02 + Pin text 50vh',
    materials: ['GSAP SplitText', 'ScrollTrigger Pin', 'CSS transform-origin', 'filter: blur', 'Syne Font 800', 'Lenis + perspective'],
    code: 'gsap.fromTo(chars, {y:"100%", rotateX:90}, {y:"0%", rotateX:0, stagger:0.02, scrub:1})',
    performance: '60fps • 1.6s • Viral typography • 3.4x engagement',
    useCase: 'Headlines, agencies, fashion, bold statements'
  }
];

const grid = document.getElementById('work-grid');
if(grid){
  demos.forEach((demo, i) => {
    const el = document.createElement('div');
    el.className = `card-3d group relative rounded-[24px] overflow-hidden p-6 md:p-8 min-h-[680px] flex flex-col justify-between cursor-pointer border border-white/5 hover:border-white/20 transition-all ${demo.color} ${demo.dark ? 'text-paper' : 'text-ink'}`;
    el.innerHTML = `
      <div>
        <div class="flex justify-between items-start">
          <div class="px-3 py-1 rounded-full bg-black/10 font-mono text-[9px] tracking-widest">${demo.tag}</div>
          <div class="w-8 h-8 rounded-full bg-black/10 grid place-items-center group-hover:rotate-45 transition">↗</div>
        </div>
        <div class="w-full h-[160px] rounded-xl bg-black/10 overflow-hidden relative mt-6 mb-5">
          <div class="absolute inset-0 flex items-center justify-center font-syne font-800 text-6xl opacity-20">${i+1}</div>
          <div class="demo-mini-preview absolute inset-0" data-type="${demo.preview}"></div>
          <div class="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white rounded-full font-mono text-[8px]">${demo.performance}</div>
        </div>
        <h3 class="font-syne font-700 text-[26px] leading-[0.9]">${demo.title}</h3>
        <p class="font-space text-[12px] opacity-70 mt-2 leading-relaxed">${demo.desc}</p>
        
        <div class="mt-5 p-3 bg-black/10 rounded-xl">
          <div class="font-mono text-[9px] tracking-widest opacity-60 font-700">⚡ TRANSITION — Kaise move hoga</div>
          <div class="font-mono text-[10px] leading-relaxed mt-2 break-words">${demo.transition}</div>
        </div>

        <div class="mt-3">
          <div class="font-mono text-[9px] tracking-widest opacity-60 font-700">🧱 MATERIALS — Kya kya lagega (All shown)</div>
          <div class="flex flex-wrap gap-1.5 mt-2">
            ${demo.materials.map(m=>`<span class="px-2 py-1 bg-black/10 rounded-full font-mono text-[8.5px] tracking-wide border border-black/5">${m}</span>`).join('')}
          </div>
        </div>

        <div class="mt-3 p-2.5 bg-black/5 rounded-lg">
          <div class="font-mono text-[8px] opacity-50">CODE SNIPPET</div>
          <div class="font-mono text-[9px] mt-1 opacity-80 break-all">${demo.code}</div>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-black/10">
        <div class="flex justify-between items-center">
          <div><div class="font-mono text-[10px] opacity-60">${demo.complexity} • ${demo.useCase}</div><div class="font-syne font-800 text-[18px] mt-1">${demo.price}</div></div>
          <button class="px-4 py-2 bg-ink text-paper rounded-full font-mono text-[10px] font-700 group-hover:bg-black transition">TRY LIVE →</button>
        </div>
      </div>
    `;
    el.addEventListener('click', () => openDemo(demo));
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const centerX = rect.width / 2; const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 12; const rotateY = (centerX - x) / 12;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
    grid.appendChild(el);
  });

  gsap.utils.toArray('.demo-mini-preview').forEach(el => {
    if (el.dataset.type === 'depth') {
      el.innerHTML = `<div class="absolute inset-0 flex items-center justify-center gap-2"><div class="w-10 h-10 bg-black/20 rounded" data-depth="1"></div><div class="w-14 h-14 bg-black/30 rounded-xl" data-depth="2"></div><div class="w-8 h-8 bg-black/10 rounded-full" data-depth="3"></div></div>`;
      gsap.to(el.querySelectorAll('[data-depth]'), { y: (i) => (i-1)*15, repeat: -1, yoyo: true, duration: 1.5, stagger: 0.1, ease: 'power1.inOut' });
    }
  });
}

// Horizontal Scroll
const hTrack = document.getElementById('horizontal-track');
if(hTrack){
  gsap.to(hTrack, {
    x: () => -(hTrack.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '#horizontal-section',
      start: 'top top',
      end: () => '+=' + (hTrack.scrollWidth - window.innerWidth),
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });
}

// Pricing buttons
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pkg = btn.dataset.package;
    const radio = document.querySelector(`input[name="package"][value="${pkg}"]`);
    if(radio) radio.checked = true;
    updateTotal();
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    nextStep(3);
  });
});

// Order Form Logic
let currentStep = 1;
window.nextStep = (step) => {
  if (step === 2) {
    const checked = document.querySelectorAll('input[name="styles"]:checked');
    if (checked.length === 0) { alert('Select at least one animation style'); return; }
  }
  document.querySelectorAll('[id^="form-step-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(`form-step-${step}`)?.classList.remove('hidden');
  for (let i=1;i<=3;i++) {
    const dot = document.getElementById(`step-${i}-dot`);
    if(!dot) continue;
    if (i <= step) dot.className = 'w-8 h-8 rounded-full bg-ink text-paper grid place-items-center font-mono text-[12px]';
    else dot.className = 'w-8 h-8 rounded-full border border-black/20 grid place-items-center font-mono text-[12px]';
  }
  currentStep = step;
  const orderEl = document.getElementById('order');
  if(orderEl) window.scrollTo({ top: orderEl.offsetTop + 200, behavior: 'smooth' });
};

// Promos - now from Insforge backend + local fallback
let backendPromosCache = [];
async function loadPromosBackend() {
  try {
    if(window.KaatyaBackend) {
      const promos = await window.KaatyaBackend.getPromos();
      if(promos) {
        backendPromosCache = promos.map(p=>({
          code: p.code,
          discount: p.discount,
          minAmount: p.min_amount,
          live: p.live,
          used: p.used
        }));
        console.log('✅ Promos from backend:', backendPromosCache.length);
      }
    }
  } catch(e) { console.warn('Promos backend load failed', e); }
}
loadPromosBackend();

function getPromos(){ 
  const local = JSON.parse(localStorage.getItem('kaatya_promos')||'[]');
  // merge backend + local, backend priority
  const map = new Map();
  [...local, ...backendPromosCache].forEach(p=> map.set(p.code, p));
  return Array.from(map.values());
}

function updateTotal() {
  let base = 0;
  const pkg = document.querySelector('input[name="package"]:checked')?.value;
  if (pkg === 'starter') base = 29999;
  if (pkg === 'pro') base = 59999;
  if (pkg === 'ultra') base = 119999;
  const extras = document.querySelectorAll('input[name="styles"]:checked').length;
  let total = base + Math.max(0, extras-1)*3000;

  // Apply promo if any
  const offerInput = document.querySelector('input[name="offerCode"]');
  const code = offerInput?.value.trim().toUpperCase();
  if(code){
    const promo = getPromos().find(p=>p.code===code && p.live);
    if(promo && total >= (promo.minAmount||0)){
      const discount = Math.floor(total * promo.discount / 100);
      total = total - discount;
    }
  }

  const el = document.getElementById('estimatedTotal');
  if(el) el.textContent = '₹' + total.toLocaleString('en-IN');
}

document.querySelectorAll('input[name="styles"], input[name="package"]').forEach(el => {
  el.addEventListener('change', updateTotal);
});
document.querySelector('input[name="offerCode"]')?.addEventListener('input', updateTotal);

// Form submit -> Insforge Backend + localStorage fallback
const orderForm = document.getElementById('orderForm');
if(orderForm){
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = orderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if(submitBtn) { submitBtn.textContent = '⏳ SAVING TO BACKEND...'; submitBtn.disabled = true; }

    const formData = new FormData(e.target);
    const styles = [...document.querySelectorAll('input[name="styles"]:checked')].map(i=>i.value);
    const offerCode = (formData.get('offerCode')||'').toString().trim().toUpperCase();
    
    // Validate promo
    let promoApplied = null;
    if(offerCode){
      const promo = getPromos().find(p=>p.code===offerCode && p.live);
      if(!promo){ alert('Invalid offer code: '+offerCode); if(submitBtn){submitBtn.textContent=originalText; submitBtn.disabled=false;} return; }
      promoApplied = promo;
    }

    const orderId = 'KAATYA-' + Math.random().toString(36).substr(2,6).toUpperCase();
    const trackLink = `${location.origin}/track.html?id=${orderId}`;

    const order = {
      id: orderId,
      date: new Date().toISOString(),
      styles,
      websiteType: formData.get('websiteType'),
      package: formData.get('package'),
      references: formData.get('references'),
      vision: formData.get('vision'),
      budget: formData.get('budget'),
      timeline: formData.get('timeline'),
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company') || 'Raebareli',
      total: document.getElementById('estimatedTotal').textContent,
      status: 'needs_action',
      paymentStatus: 'pending',
      paymentProof: '',
      offerCode: offerCode||'',
      trackLink: trackLink,
      studio: 'KAATYA WEB DEVELOPER - Near Ganesh Hotel, Raebareli UP - vishishthgaurlittle@gmail.com - Insta @_kaatya_og_ - UPI 8957288848@fam'
    };

    // 1. Save to localStorage (fallback)
    const orders = JSON.parse(localStorage.getItem('kaatya_orders_v2') || localStorage.getItem('scrollcraft_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('kaatya_orders_v2', JSON.stringify(orders));
    localStorage.setItem('scrollcraft_orders', JSON.stringify(orders));

    // 2. Save to Insforge backend
    let backendSuccess = false;
    try {
      if(window.KaatyaBackend) {
        const result = await window.KaatyaBackend.createOrder(order);
        if(result) {
          console.log('✅ Order saved to Insforge backend:', result);
          backendSuccess = true;
        } else {
          console.warn('⚠️ Backend save returned null, using local fallback');
        }
      }
    } catch(err) {
      console.warn('⚠️ Backend save failed, using local fallback:', err);
    }

    // Increment promo used count (local + backend)
    if(promoApplied){
      const promos = getPromos();
      const idx = promos.findIndex(p=>p.code===offerCode);
      if(idx>=0){ promos[idx].used = (promos[idx].used||0)+1; localStorage.setItem('kaatya_promos', JSON.stringify(promos)); }
      // Backend increment
      try {
        if(window.KaatyaBackend && backendSuccess) {
          const allPromos = await window.KaatyaBackend.getPromos();
          const backendPromo = allPromos?.find(p=>p.code===offerCode);
          if(backendPromo) {
            await fetch(`https://pnhxxd37.us-east.insforge.app/api/database/records/promos?code=eq.${offerCode}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ik_8f0ac0caf6fe706207467ed8a31a3162`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({ used: (backendPromo.used||0)+1 })
            });
          }
        }
      } catch(e) { console.warn('Promo increment backend failed', e); }
    }

    document.getElementById('orderForm').classList.add('hidden');
    document.getElementById('order-success').classList.remove('hidden');
    document.getElementById('order-id-display').textContent = order.id;
    const trackEl = document.getElementById('track-link-display');
    if(trackEl) trackEl.textContent = trackLink;
    const trackEl2 = document.getElementById('track-link-display-2');
    if(trackEl2) trackEl2.textContent = trackLink;

    // Show backend status
    const successMsg = document.getElementById('order-success');
    if(successMsg && backendSuccess) {
      const badge = document.createElement('div');
      badge.className = 'mt-4 mx-auto max-w-[380px] p-3 bg-green-100 border border-green-300 rounded-xl font-mono text-[11px] text-green-800';
      badge.innerHTML = `✅ Saved to Insforge Backend • Project: desginers • ID: ${order.id} • ${new Date().toLocaleString()}`;
      successMsg.insertBefore(badge, successMsg.children[1]);
    }

    gsap.fromTo('#order-success', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out' });
    
    if(submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
  });
}

// Demo Modal - With Transitions & Materials
window.openDemo = (demo) => {
  const modal = document.getElementById('demo-modal');
  if(!modal) return;
  document.getElementById('demo-title').textContent = demo.title;
  document.getElementById('demo-tag').textContent = demo.tag + ' • ' + demo.performance;
  const stage = document.getElementById('demo-stage');
  
  const materialsHtml = demo.materials ? `<div class="mt-6"><div class="font-mono text-[11px] tracking-widest opacity-60">🧱 ALL MATERIALS REQUIRED</div><div class="flex flex-wrap gap-2 mt-3">${demo.materials.map(m=>`<span class="px-3 py-1.5 bg-white/10 rounded-full font-mono text-[11px] border border-white/10">${m}</span>`).join('')}</div></div>` : '';
  const transitionHtml = demo.transition ? `<div class="mt-6 p-5 bg-lime/10 border border-lime/20 rounded-2xl"><div class="font-mono text-[11px] tracking-widest font-700">⚡ TRANSITION — Full Spec</div><div class="font-mono text-[13px] mt-3 leading-relaxed">${demo.transition}</div><div class="mt-3 p-3 bg-black/20 rounded-xl font-mono text-[11px]"><span class="opacity-60">CODE:</span> ${demo.code}</div><div class="mt-2 font-mono text-[11px] opacity-60">Use case: ${demo.useCase} • ${demo.performance}</div></div>` : '';

  if (demo.id === 'depth-parallax') {
    stage.innerHTML = `
      <div class="max-w-[1000px] mx-auto">
        <div class="glass p-8 rounded-[24px] mb-10">${transitionHtml}${materialsHtml}</div>
        <div class="space-y-[60vh]">
          <div class="h-[60vh] grid place-items-center"><h2 class="font-syne text-[8vw] font-800 leading-[0.8]">SCROLL<br>TO SEE<br><span class="text-lime">DEPTH</span></h2><div class="font-mono text-[11px] opacity-60 mt-4">Transition: ${demo.transition}</div></div>
          <div class="relative h-[80vh] flex items-center justify-center"><div data-speed="0.2" class="absolute w-[300px] h-[300px] bg-lime rounded-full blur-[1px]"></div><div data-speed="0.5" class="absolute w-[500px] h-[500px] border border-white/20 rounded-full"></div><div data-speed="1.2" class="absolute w-[200px] h-[200px] bg-violet rounded-2xl rotate-12"></div><div data-speed="0.8" class="relative z-10 font-syne text-6xl font-800">DEPTH</div></div>
          <div class="h-[50vh] grid place-items-center font-mono text-[12px] tracking-widest opacity-50">END OF DEMO — KAATYA WEB DEVELOPER • Raebareli • ${demo.price}</div>
        </div>
      </div>
    `;
    gsap.utils.toArray('[data-speed]').forEach(el => {
      gsap.to(el, { y: (i, target) => -parseFloat(target.dataset.speed) * 400, scrollTrigger: { trigger: el.parentElement, scrub: 1, start: 'top bottom', end: 'bottom top' } });
    });
  } else if (demo.id === 'horizontal') {
    stage.innerHTML = `
      <div class="max-w-[1000px] mx-auto">
        <div class="glass p-8 rounded-[24px] mb-10">${transitionHtml}${materialsHtml}</div>
        <div class="w-[300vw] flex h-[60vh] gap-6"><div class="w-[80vw] bg-lime rounded-[32px] p-10 flex flex-col justify-between text-ink"><div class="font-syne text-[10vw] leading-none">01</div><div class="text-3xl font-700">Horizontal content<br>driven by vertical scroll<br><span class="font-mono text-[12px] opacity-60">${demo.transition}</span></div></div><div class="w-[80vw] bg-violet text-white rounded-[32px] p-10 flex flex-col justify-between"><div class="font-syne text-[10vw] leading-none">02</div><div class="text-3xl font-700">Pin the section,<br>scrub the track</div></div><div class="w-[80vw] bg-white text-ink rounded-[32px] p-10 flex flex-col justify-between"><div class="font-syne text-[10vw] leading-none">03</div><div class="text-3xl font-700">Feels native,<br>performs 60fps</div></div></div>
        <div class="mt-10 font-mono text-[11px]">Scroll vertically inside this modal to see horizontal move → Transition: ${demo.transition}</div>
      </div>
    `;
    const track = stage.querySelector('.w-\\[300vw\\]');
    if(track) gsap.to(track, { x: () => -(track.scrollWidth - stage.clientWidth + 40), scrollTrigger: { trigger: stage, scroller: stage, scrub: 1, start: 'top top', end: '+=1000' } });
  } else {
    stage.innerHTML = `
      <div class="max-w-[900px] mx-auto">
        <div class="glass p-8 md:p-12 rounded-[32px]">
          <h3 class="font-syne text-4xl font-700">${demo.title}</h3>
          <p class="mt-4 opacity-70">${demo.desc} — Built by Kaatya Web Developer, Raebareli.</p>
          ${transitionHtml}
          ${materialsHtml}
          <div class="mt-8 w-full h-[300px] bg-gradient-to-br from-lime to-violet rounded-2xl grid place-items-center text-ink font-syne font-800 text-4xl">${demo.title}</div>
          <div class="mt-8 p-5 bg-white/5 rounded-2xl"><div class="font-mono text-[11px] opacity-60">PERFORMANCE & USE CASE</div><div class="font-space text-[14px] mt-2">${demo.performance} • Best for: ${demo.useCase}</div></div>
          <button onclick="document.getElementById('order').scrollIntoView({behavior:'smooth'}); closeDemo();" class="mt-8 w-full py-4 bg-lime text-ink rounded-full font-mono text-[12px] font-700">ORDER THIS EFFECT → ${demo.price}</button>
        </div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lenis.stop();
};

window.closeDemo = () => {
  const modal = document.getElementById('demo-modal');
  if(modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  lenis.start();
  ScrollTrigger.getAll().forEach(t => { if (t.trigger && t.trigger.closest && t.trigger.closest('#demo-stage')) t.kill(); });
};

updateTotal();

let lastScroll = 0;
lenis.on('scroll', ({ scroll }) => {
  const nav = document.getElementById('nav');
  if(!nav) return;
  if (scroll > lastScroll && scroll > 300) gsap.to(nav, { y: -100, duration: 0.4 });
  else gsap.to(nav, { y: 0, duration: 0.4 });
  lastScroll = scroll;
  
  // scroll progress
  const prog = document.getElementById('scroll-progress');
  if(prog){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h>0 ? (scroll / h) * 100 : 0;
    prog.style.width = p + '%';
  }
  // back to top visibility
  const btt = document.getElementById('back-to-top');
  if(btt){
    if(scroll > 800){ btt.style.opacity = '1'; btt.style.pointerEvents = 'auto'; }
    else { btt.style.opacity = '0'; btt.style.pointerEvents = 'none'; }
  }
});

// CUSTOM CURSOR
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
if(dot && ring){
  let mouseX=0, mouseY=0, ringX=0, ringY=0;
  window.addEventListener('mousemove', e=>{
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX-4}px, ${mouseY-4}px)`;
  });
  function animateRing(){
    ringX += (mouseX - ringX - 20) * 0.15;
    ringY += (mouseY - ringY - 20) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .card-3d, [onclick]').forEach(el=>{
    el.addEventListener('mouseenter', ()=> ring.classList.add('hover'));
    el.addEventListener('mouseleave', ()=> ring.classList.remove('hover'));
  });
}

// MAGNETIC BUTTONS
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    btn.style.transform = `translate(${x*0.35}px, ${y*0.4}px)`;
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform = 'translate(0,0)');
});

// BACK TO TOP
document.getElementById('back-to-top')?.addEventListener('click', ()=>{
  lenis.scrollTo(0, { duration: 1.2 });
});

// FEATURED SEARCH - inject search bar if not exists
(function(){
  const featuredSec = document.getElementById('featured');
  const grid = document.getElementById('featured-grid');
  if(!featuredSec || !grid) return;
  if(document.getElementById('featured-search')) return;
  const bar = document.createElement('div');
  bar.className = 'max-w-[1600px] mx-auto mb-8 flex flex-wrap gap-3 items-center';
  bar.innerHTML = `
    <div class="flex-1 min-w-[280px] relative">
      <input id="featured-search" placeholder="Search 13 featured — otsuka, void, club, glass..." class="w-full px-5 py-3 bg-ink text-paper rounded-full font-mono text-[12px] border border-white/10 outline-none focus:border-lime" />
      <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
    </div>
    <div class="flex gap-2 flex-wrap" id="featured-filters">
      <button data-filter="all" class="filter-btn px-4 py-2 bg-ink text-paper rounded-full font-mono text-[11px] border border-white/10 bg-white text-ink">ALL 13</button>
      <button data-filter="ecom" class="filter-btn px-4 py-2 rounded-full font-mono text-[11px] border border-black/10">E-COM</button>
      <button data-filter="webgl" class="filter-btn px-4 py-2 rounded-full font-mono text-[11px] border border-black/10">WEBGL</button>
      <button data-filter="minimal" class="filter-btn px-4 py-2 rounded-full font-mono text-[11px] border border-black/10">MINIMAL</button>
      <button data-filter="saas" class="filter-btn px-4 py-2 rounded-full font-mono text-[11px] border border-black/10">SAAS</button>
    </div>
    <div class="font-mono text-[11px] opacity-60"><span id="featured-count">13</span> sites • Scroll magic</div>
  `;
  featuredSec.querySelector('.max-w-\\[1600px\\]')?.insertBefore(bar, grid);
  
  const searchInput = document.getElementById('featured-search');
  const countEl = document.getElementById('featured-count');
  let activeFilter = 'all';
  
  function filterFeatured(){
    const q = (searchInput?.value || '').toLowerCase();
    const cards = grid.children;
    let visible = 0;
    Array.from(cards).forEach(card=>{
      const txt = card.textContent.toLowerCase();
      const matchSearch = !q || txt.includes(q);
      const matchFilter = activeFilter==='all' || txt.includes(activeFilter);
      const show = matchSearch && matchFilter;
      card.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    if(countEl) countEl.textContent = visible;
  }
  
  searchInput?.addEventListener('input', filterFeatured);
  document.querySelectorAll('.filter-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      activeFilter = b.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(x=> x.classList.remove('bg-ink','text-paper','bg-white','text-ink'));
      b.classList.add('bg-ink','text-paper');
      filterFeatured();
    });
  });
})();

// TESTIMONIALS AUTO SCROLL
(function(){
  const track = document.getElementById('testimonials-track');
  if(!track) return;
  let autoScroll = setInterval(()=>{
    if(track.matches(':hover')) return;
    track.scrollBy({ left: 440, behavior: 'smooth' });
    if(track.scrollLeft + track.clientWidth >= track.scrollWidth - 10){
      setTimeout(()=> track.scrollTo({ left: 0, behavior: 'smooth' }), 800);
    }
  }, 3000);
})();

// TEMPLATES SEARCH ENHANCEMENT
(function(){
  const tGrid = document.getElementById('templates-grid');
  const tSec = document.getElementById('templates');
  if(!tGrid || !tSec) return;
  // add hover tilt to template cards
  const observer = new MutationObserver(()=>{
    tGrid.querySelectorAll('div').forEach(el=>{
      if(el._tiltAdded) return;
      el._tiltAdded = true;
      el.addEventListener('mousemove', e=>{
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `perspective(800px) rotateY(${x/20}deg) rotateX(${-y/20}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', ()=> el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)');
    });
  });
  observer.observe(tGrid, { childList: true });
})();

// Reveal animations for new sections
gsap.utils.toArray('#about, #tech, #testimonials, #faq').forEach(sec=>{
  gsap.fromTo(sec, { opacity: 0.6, y: 40 }, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: sec, start: 'top 85%', toggleActions: 'play none none reverse' }
  });
});

// Keyboard: ESC closes modal
window.addEventListener('keydown', e=>{
  if(e.key==='Escape') closeDemo();
});
