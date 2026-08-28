// ADMIN PANEL LOGIC
let orders = JSON.parse(localStorage.getItem('scrollcraft_orders') || '[]');
let portfolio = JSON.parse(localStorage.getItem('scrollcraft_portfolio') || '[]');

function saveOrders() {
  localStorage.setItem('scrollcraft_orders', JSON.stringify(orders));
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('bg-white','text-ink','font-700');
      btn.classList.remove('hover:bg-white/10');
    } else {
      btn.classList.remove('bg-white','text-ink','font-700');
      btn.classList.add('hover:bg-white/10');
    }
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});
document.getElementById('mobile-tab')?.addEventListener('change', e => switchTab(e.target.value));

function renderDashboard() {
  document.getElementById('stat-total').textContent = orders.length;
  document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'new').length;
  const revenue = orders.reduce((sum, o) => {
    const num = parseInt((o.total || '$0').replace(/[^0-9]/g,'')) || 0;
    return sum + num;
  }, 0);
  document.getElementById('stat-revenue').textContent = '$' + revenue.toLocaleString();
  document.getElementById('order-count-badge').textContent = orders.length;

  // Recent orders
  const recent = document.getElementById('recent-orders');
  recent.innerHTML = '';
  if (orders.length === 0) {
    recent.innerHTML = '<div class="py-10 text-center opacity-40 font-mono text-[11px]">No orders yet — share your site!</div>';
  } else {
    orders.slice(0,5).forEach(o => {
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer';
      div.innerHTML = `
        <div><div class="font-mono text-[11px] opacity-60">${o.id} • ${new Date(o.date).toLocaleDateString()}</div><div class="font-600">${o.name} — ${o.websiteType}</div><div class="font-mono text-[11px] opacity-60 mt-1">${(o.styles||[]).join(', ')}</div></div>
        <div class="text-right"><div class="font-mono text-[11px] px-2 py-1 rounded-full ${o.status==='new'?'bg-lime text-ink':'bg-white/10'}">${o.status.toUpperCase()}</div><div class="font-syne font-700 mt-2">${o.total}</div></div>
      `;
      div.onclick = () => openOrder(o.id);
      recent.appendChild(div);
    });
  }

  // Top effects
  const counts = {};
  orders.forEach(o => (o.styles||[]).forEach(s => counts[s] = (counts[s]||0)+1));
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const topEl = document.getElementById('top-effects');
  topEl.innerHTML = '';
  if (top.length===0) topEl.innerHTML = '<div class="opacity-40 text-[12px]">No data yet</div>';
  top.forEach(([name, count]) => {
    topEl.innerHTML += `<div class="flex justify-between items-center"><span class="text-[14px]">${name}</span><span class="font-mono text-[11px] px-2 py-1 bg-white/10 rounded-full">${count} orders</span></div>`;
  });
}

function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  const noOrders = document.getElementById('no-orders');
  const filter = document.getElementById('filter-status').value;
  const search = document.getElementById('search-orders').value.toLowerCase();

  let filtered = orders.filter(o => {
    const matchStatus = filter==='all' || o.status===filter;
    const matchSearch = !search || (o.name?.toLowerCase().includes(search) || o.email?.toLowerCase().includes(search) || o.id?.toLowerCase().includes(search));
    return matchStatus && matchSearch;
  });

  tbody.innerHTML = '';
  if (filtered.length===0) {
    noOrders.classList.remove('hidden');
    tbody.parentElement.classList.add('hidden');
  } else {
    noOrders.classList.add('hidden');
    tbody.parentElement.classList.remove('hidden');
    filtered.forEach(o => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-white/5 hover:bg-white/5 cursor-pointer';
      tr.innerHTML = `
        <td class="p-4 font-mono text-[12px]">${o.id}</td>
        <td class="p-4"><div class="font-600">${o.name}</div><div class="font-mono text-[11px] opacity-60">${o.email}</div></td>
        <td class="p-4"><div class="px-2 py-1 bg-lime/20 text-lime rounded-full inline-block font-mono text-[10px]">${o.package?.toUpperCase()}</div><div class="font-mono text-[11px] opacity-60 mt-1 max-w-[200px] truncate">${(o.styles||[]).join(', ')}</div></td>
        <td class="p-4 font-mono">${o.budget} <div class="opacity-60 text-[11px]">${o.total}</div></td>
        <td class="p-4"><span class="px-3 py-1 rounded-full font-mono text-[10px] ${o.status==='new'?'bg-lime text-ink': o.status==='in_progress'?'bg-violet text-white':'bg-white/20'}">${o.status.replace('_',' ').toUpperCase()}</span></td>
        <td class="p-4 font-mono text-[11px] opacity-60">${new Date(o.date).toLocaleDateString()}</td>
      `;
      tr.onclick = () => openOrder(o.id);
      tbody.appendChild(tr);
    });
  }
}

function openOrder(id) {
  const o = orders.find(x => x.id===id);
  if (!o) return;
  const modal = document.getElementById('order-modal');
  const content = document.getElementById('order-modal-content');
  content.innerHTML = `
    <div class="font-mono text-[11px] tracking-widest opacity-60">ORDER DETAIL — ${o.id} • KAATYA STUDIO</div>
    <h2 class="font-syne font-800 text-3xl mt-3">${o.name}</h2>
    <div class="font-mono text-[12px] opacity-60">${o.email} • ${o.phone||''} • ${o.company||'Raebareli'} • ${new Date(o.date).toLocaleString()}</div>
    <div class="mt-2 font-mono text-[10px] px-2 py-1 bg-lime text-ink rounded-full inline-block">📍 NEAR GANESH HOTEL, RAEBARELI</div>

    <div class="mt-8 grid grid-cols-2 gap-4">
      <div class="p-4 bg-black/5 rounded-xl"><div class="font-mono text-[11px] opacity-60">PACKAGE</div><div class="font-700 mt-1">${o.package?.toUpperCase()} — ${o.total}</div></div>
      <div class="p-4 bg-black/5 rounded-xl"><div class="font-mono text-[11px] opacity-60">TIMELINE</div><div class="font-700 mt-1">${o.timeline} • ${o.budget}</div></div>
    </div>

    <div class="mt-6">
      <div class="font-mono text-[11px] tracking-widest">REQUESTED ANIMATIONS</div>
      <div class="mt-3 flex flex-wrap gap-2">${(o.styles||[]).map(s=>`<span class="px-3 py-1 bg-ink text-paper rounded-full text-[12px]">${s}</span>`).join('')}</div>
    </div>

    <div class="mt-6"><div class="font-mono text-[11px] tracking-widest">WEBSITE TYPE</div><div class="mt-2 p-3 bg-black/5 rounded-xl">${o.websiteType}</div></div>
    <div class="mt-4"><div class="font-mono text-[11px] tracking-widest">VISION</div><div class="mt-2 p-4 bg-black/5 rounded-xl leading-relaxed">${o.vision||'No description'}</div></div>
    <div class="mt-4"><div class="font-mono text-[11px] tracking-widest">REFERENCES</div><div class="mt-2 p-3 bg-black/5 rounded-xl font-mono text-[12px] break-all">${o.references||'None'}</div></div>

    <div class="mt-8 flex gap-3">
      <select id="status-change" class="flex-1 p-3 border border-black/15 rounded-xl font-mono text-[12px]"><option value="new" ${o.status==='new'?'selected':''}>NEW</option><option value="in_progress" ${o.status==='in_progress'?'selected':''}>IN PROGRESS</option><option value="delivered" ${o.status==='delivered'?'selected':''}>DELIVERED</option></select>
      <button onclick="updateStatus('${o.id}')" class="px-6 py-3 bg-ink text-paper rounded-xl font-mono text-[12px]">UPDATE STATUS</button>
    </div>
    <div class="mt-4 flex gap-2">
      <a href="mailto:${o.email}?subject=Re: Your ScrollCraft Order ${o.id}" class="flex-1 py-3 bg-lime text-ink rounded-xl text-center font-mono text-[12px] font-700">EMAIL CLIENT →</a>
      <button onclick="deleteOrder('${o.id}')" class="px-6 py-3 border border-red-200 text-red-600 rounded-xl font-mono text-[12px]">DELETE</button>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.add('hidden');
}

window.updateStatus = (id) => {
  const newStatus = document.getElementById('status-change').value;
  const idx = orders.findIndex(o=>o.id===id);
  if (idx>=0) {
    orders[idx].status = newStatus;
    saveOrders();
    renderDashboard();
    renderOrders();
    closeOrderModal();
  }
};

window.deleteOrder = (id) => {
  if (!confirm('Delete this order?')) return;
  orders = orders.filter(o=>o.id!==id);
  saveOrders();
  renderDashboard();
  renderOrders();
  closeOrderModal();
};

window.exportOrders = () => {
  const csv = ['ID,Name,Email,Package,Styles,Budget,Total,Status,Date'].concat(orders.map(o => `${o.id},${o.name},${o.email},${o.package},"${(o.styles||[]).join(';')}",${o.budget},${o.total},${o.status},${o.date}`)).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'scrollcraft_orders.csv'; a.click();
};

window.clearOrders = () => {
  if (!confirm('Clear ALL orders? This cannot be undone.')) return;
  orders = [];
  saveOrders();
  renderDashboard();
  renderOrders();
};

// Portfolio
function renderPortfolio() {
  const list = document.getElementById('portfolio-list');
  list.innerHTML = '';
  const all = [...portfolio];
  if (all.length===0) list.innerHTML = '<div class="col-span-2 py-20 text-center opacity-40 font-mono text-[11px]">No custom demos yet. Add one.</div>';
  all.forEach((p,i) => {
    const div = document.createElement('div');
    div.className = 'glass rounded-[20px] p-6';
    div.innerHTML = `<div class="flex justify-between"><div class="font-mono text-[10px] px-2 py-1 bg-lime text-ink rounded-full">${p.tag}</div><button onclick="deletePortfolio(${i})" class="font-mono text-[11px] opacity-60">DELETE</button></div><div class="font-syne font-700 text-xl mt-4">${p.title}</div><div class="text-[13px] opacity-70 mt-2">${p.desc}</div><div class="mt-4 font-mono text-[11px] opacity-60">${p.complexity} • ${p.price}</div>`;
    list.appendChild(div);
  });
}

document.getElementById('portfolio-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  portfolio.unshift({ title: fd.get('title'), tag: fd.get('tag'), desc: fd.get('desc'), complexity: fd.get('complexity'), price: fd.get('price') });
  localStorage.setItem('scrollcraft_portfolio', JSON.stringify(portfolio));
  e.target.reset();
  renderPortfolio();
});

window.deletePortfolio = (i) => {
  portfolio.splice(i,1);
  localStorage.setItem('scrollcraft_portfolio', JSON.stringify(portfolio));
  renderPortfolio();
};

document.getElementById('filter-status')?.addEventListener('change', renderOrders);
document.getElementById('search-orders')?.addEventListener('input', renderOrders);

// Init
renderDashboard();
renderOrders();
renderPortfolio();

// Seed demo orders if empty - Kaatya Raebareli context
if (orders.length===0) {
  orders = [
  {
    id: 'KAATYA-DEMO01',
    date: new Date().toISOString(),
    name: 'Rohit Gupta',
    email: 'rohit@ganeshhotel.com',
    phone: '+91 98390 11223',
    company: 'Ganesh Hotel, Raebareli',
    websiteType: 'Hotel / Restaurant (Raebareli)',
    package: 'pro',
    styles: ['3D Depth Parallax','Sticky Stack & Reveal','WebGL Morph & Distort'],
    budget: '₹40k - ₹80k',
    timeline: '1-2 Weeks',
    references: 'https://obys.agency, https://locomotive.ca',
    vision: 'Hotel near Ganesh Hotel Raebareli - need parallax rooms, scroll food menu, 3D tour like Apple. Customers should feel luxury.',
    total: '₹59,999',
    status: 'new'
  },
  {
    id: 'KAATYA-DEMO02',
    date: new Date(Date.now()-86400000).toISOString(),
    name: 'Priya Sharma',
    email: 'priya@coachingraebareli.com',
    phone: '+91 88876 54321',
    company: 'Raebareli Coaching Center',
    websiteType: 'Coaching / Education',
    package: 'starter',
    styles: ['Sticky Stack & Reveal','Text Warp & Pin'],
    budget: '₹20k - ₹40k',
    timeline: 'ASAP',
    references: 'https://linear.app',
    vision: 'Coaching center near Civil Lines - want sticky courses and results animation',
    total: '₹29,999',
    status: 'in_progress'
  }
  ];
  saveOrders();
  renderDashboard();
  renderOrders();
}
