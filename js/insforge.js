// KAATYA WEB DEVELOPER - Insforge Backend Integration
// Project: desginers | URL: https://pnhxxd37.us-east.insforge.app | Key: ik_8f0ac0...

const INSFORGE_URL = 'https://pnhxxd37.us-east.insforge.app';
const INSFORGE_KEY = 'ik_8f0ac0caf6fe706207467ed8a31a3162';

const headers = {
  'Authorization': `Bearer ${INSFORGE_KEY}`,
  'Content-Type': 'application/json'
};

// Generic fetch wrapper
async function insforgeGet(table, query='') {
  try {
    const url = `${INSFORGE_URL}/api/database/records/${table}${query ? '?' + query : ''}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${INSFORGE_KEY}` } });
    if(!res.ok) throw new Error(`GET ${table} failed ${res.status}`);
    return await res.json();
  } catch(e) {
    console.warn(`Insforge GET ${table} error:`, e);
    return null;
  }
}

async function insforgePost(table, records) {
  try {
    const url = `${INSFORGE_URL}/api/database/records/${table}`;
    const body = Array.isArray(records) ? records : [records];
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify(body)
    });
    if(!res.ok) {
      const txt = await res.text();
      throw new Error(`POST ${table} ${res.status}: ${txt}`);
    }
    return await res.json();
  } catch(e) {
    console.warn(`Insforge POST ${table} error:`, e);
    return null;
  }
}

async function insforgePatch(table, filter, updates) {
  try {
    const url = `${INSFORGE_URL}/api/database/records/${table}?${filter}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify(updates)
    });
    if(!res.ok) throw new Error(`PATCH ${table} ${res.status}`);
    return await res.json();
  } catch(e) {
    console.warn(`Insforge PATCH ${table} error:`, e);
    return null;
  }
}

// Public API
window.KaatyaBackend = {
  url: INSFORGE_URL,
  key: INSFORGE_KEY,

  async getFeaturedWebsites() {
    const data = await insforgeGet('featured_websites', 'order=display_order.asc&limit=100');
    return data || null;
  },

  async getTemplates() {
    const data = await insforgeGet('templates', 'limit=100');
    return data || null;
  },

  async getTestimonials() {
    const data = await insforgeGet('testimonials', 'featured=eq.true&order=created_at.desc&limit=20');
    return data || null;
  },

  async getPromos() {
    const data = await insforgeGet('promos', 'live=eq.true&limit=100');
    return data || null;
  },

  async createOrder(order) {
    // Map frontend order to backend schema (ref_links instead of references reserved word)
    const payload = {
      id: order.id,
      name: order.name,
      email: order.email,
      company: order.company || '',
      website_type: order.websiteType || order.website_type || '',
      package: order.package || '',
      styles: order.styles || [],
      ref_links: order.references || order.ref_links || '',
      vision: order.vision || '',
      budget: order.budget || '',
      timeline: order.timeline || '',
      total: order.total || '',
      status: order.status || 'needs_action',
      payment_status: order.paymentStatus || order.payment_status || 'pending',
      payment_proof: order.paymentProof || '',
      offer_code: order.offerCode || order.offer_code || '',
      track_link: order.trackLink || order.track_link || '',
      studio: order.studio || 'KAATYA WEB DEVELOPER - Near Ganesh Hotel, Raebareli'
    };
    const result = await insforgePost('orders', payload);
    return result ? result[0] : null;
  },

  async getOrders() {
    return await insforgeGet('orders', 'order=created_at.desc&limit=200');
  },

  async updateOrderStatus(id, updates) {
    // filter by id=eq.XXX
    return await insforgePatch('orders', `id=eq.${id}`, updates);
  },

  async createInquiry(inquiry) {
    return await insforgePost('inquiries', inquiry);
  },

  async uploadPaymentProof(file, orderId) {
    try {
      // Step 1: get upload strategy
      const strategyRes = await fetch(`${INSFORGE_URL}/api/storage/buckets/payment-proofs/upload-strategy`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filename: `${orderId}-${Date.now()}-${file.name}`,
          contentType: file.type,
          size: file.size
        })
      });
      if(!strategyRes.ok) throw new Error('strategy failed');
      const strategy = await strategyRes.json();
      
      // Step 2: upload
      const form = new FormData();
      form.append('file', file);
      
      const uploadRes = await fetch(`${INSFORGE_URL}${strategy.uploadUrl}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${INSFORGE_KEY}` },
        body: form
      });
      if(!uploadRes.ok) throw new Error('upload failed');
      const result = await uploadRes.json();
      return result.url || `${INSFORGE_URL}${result.url}` || result;
    } catch(e) {
      console.warn('Upload proof failed', e);
      return null;
    }
  }
};

console.log('✅ Kaatya Backend connected:', INSFORGE_URL, 'Project: desginers');
