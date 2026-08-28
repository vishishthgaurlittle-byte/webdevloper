# KAATYA WEB DEVELOPER - Backend Connected ✅

## Insforge Backend Details
- **Project URL**: https://pnhxxd37.us-east.insforge.app/
- **Project Name**: desginers
- **API Key**: ik_8f0ac0caf6fe706207467ed8a31a3162
- **Status**: LIVE & CONNECTED

## Tables Created (6)
1. **orders** - All customer orders
   - id (TEXT PK, e.g., KAATYA-XXXXXX)
   - name, email, company, website_type, package
   - styles (JSONB array)
   - ref_links (TEXT, reference links)
   - vision, budget, timeline, total
   - status, payment_status, payment_proof, offer_code, track_link, studio
   - created_at

2. **promos** - Offer codes
   - id UUID, code UNIQUE, discount INT, min_amount, live BOOL, used INT

3. **featured_websites** - 13 real 3D sites
   - id TEXT PK, title, url, category, price, description, image, preview, color, display_order, live

4. **templates** - 8 premium templates
   - id, name, category, price, color, live_url, features JSONB, description

5. **testimonials** - Client reviews
   - id UUID, name, role, rating, comment, avatar_initial, bg_color, featured

6. **inquiries** - Contact messages
   - id UUID, name, email, message, type, status

## Storage Buckets Created (2)
- **payment-proofs** - Public bucket for UPI payment screenshots
- **previews** - Public bucket for website preview images

## Seeded Data
- ✅ 13 featured websites (otsuka-air, void.sbs, clubathletic, evebcn, drinksom, framer.ai, lightweight, cominvi, ajbury, infinity, layr, peregrine, quality-glass)
- ✅ 8 templates (OBYS, LOCOMOTIVE, BRUNO SIMON, APPLE, LINEAR, FASHION, OTSUKA, GLASS)
- ✅ 4 testimonials (Ganesh Hotel, Coaching, SaaS, Factory)
- ✅ 3 promos (DIWALI20 20%, RAEBARELI10 10%, KAATYA50 50% inactive)

## Frontend Integration
### New File: js/insforge.js
- Wrapper for Insforge REST API
- Endpoints: /api/database/records/{table}
- Headers: Authorization: Bearer ik_8f0...
- Functions:
  - getFeaturedWebsites()
  - getTemplates()
  - getTestimonials()
  - getPromos()
  - createOrder(order)
  - getOrders()
  - updateOrderStatus()
  - createInquiry()
  - uploadPaymentProof(file, orderId)

### Updated Files
- **index.html**: 
  - Added <script src="js/insforge.js">
  - Featured websites now try backend first, fallback to local
  - Templates now try backend first
  - Added backend LIVE badge in hero
  - Order form shows backend save status

- **js/main.js**:
  - Promos load from backend + local merge
  - Order submit now async, saves to both localStorage AND Insforge backend
  - Shows green badge "Saved to Insforge Backend" on success
  - Promo used count increments in backend too

- **admin.html**:
  - Added backend sync on load (1s delay)
  - Merges backend orders into localStorage
  - Shows backend count in pending badge tooltip
  - Featured, promos, testimonials sync if local empty

## How to Test
1. Go to #order section, fill form, place order
2. Check console: "✅ Order saved to Insforge backend"
3. Check backend: curl -H "Authorization: Bearer ik_8f0..." https://pnhxxd37.us-east.insforge.app/api/database/records/orders
4. Admin panel: Orders tab should show backend orders after sync

## API Examples
```bash
# Get all orders
curl -H "Authorization: Bearer ik_8f0ac0caf6fe706207467ed8a31a3162" https://pnhxxd37.us-east.insforge.app/api/database/records/orders

# Get featured
curl -H "Authorization: Bearer ik_8f0ac0caf6fe706207467ed8a31a3162" https://pnhxxd37.us-east.insforge.app/api/database/records/featured_websites?order=display_order.asc

# Create order (array body required)
curl -X POST https://pnhxxd37.us-east.insforge.app/api/database/records/orders -H "Authorization: Bearer ik_8f0..." -H "Content-Type: application/json" -H "Prefer: return=representation" -d '[{"id":"TEST-123","name":"Test","email":"test@test.com"}]'
```

## Security Notes
- API key is anon key with public access - tables have no RLS yet
- For production, enable RLS policies to restrict writes
- UPI QR still only shown at payment step as required
- Contact: vishishthgaurlittle@gmail.com, Insta @_kaatya_og_, Near Ganesh Hotel Raebareli

## Live Preview
Server running on port 8000 - check LIVE PREVIEW tab
