# KAATYA WEB DEVELOPER - Multi-User Support Guide 👥

## Backend: desginers
- URL: https://pnhxxd37.us-east.insforge.app/
- API Key: ik_8f0ac0caf6fe706207467ed8a31a3162
- Auth: Enabled, Email verification DISABLED for easy setup

## New Tables
- **user_profiles**: id UUID, user_id TEXT UNIQUE, email, display_name, role (owner/admin/editor/viewer), is_active BOOL, created_at, last_login, avatar_url, bio
- **audit_logs**: id UUID, user_id, action, target_table, target_id, details JSONB, created_at

## Roles & Powers

### 👑 OWNER - Full Power (First user auto becomes owner)
- Can do everything:
  - View all orders, approve payments, advance status, delete orders
  - Manage featured websites (13 sites), add/edit/delete
  - Manage promos, reviews, settings, UPI QR
  - **Manage users**: Promote/demote anyone, change roles, activate/deactivate
  - Delete anything, including other admins
  - Cannot be deactivated by non-owners
  - Audit logs view

### 🛡️ ADMIN - Studio Manager
- Orders: View, approve, advance, WhatsApp, invoice
- Featured: Add/edit/delete
- Promos: Add/edit/delete, toggle live
- Reviews: Approve/delete
- Settings: View (cannot change UPI? - can if owner allows)
- Users: Can promote viewer/editor to admin/editor/viewer, but cannot touch owner or change owner role
- Cannot delete owner

### ✏️ EDITOR - Content Only
- Featured sites: Add/edit/delete
- Reviews: Approve/delete
- Cannot see orders/payments
- Cannot manage users or settings

### 👁️ VIEWER - Read Only
- Can view orders, featured, promos, reviews
- No edit, no approve, no delete
- Needs owner to promote to higher role

## How It Works After Deployment

### Step 1: First Deployment - You Become Owner
1. Deploy site to Vercel/Netlify/anywhere
2. Go to `https://yourdomain.com/admin-login.html`
3. Click **SIGN UP — CREATE ID**
4. Fill: Display Name (KAATYA), Email (your email), Password (min 6 chars)
5. Submit → Backend checks if user_profiles empty → If empty, you get OWNER role automatically 👑
6. Redirect to `admin.html` with full power

### Step 2: Create More Users
- Share `admin-login.html` link with your team
- They sign up → They become VIEWER by default
- You (owner) go to admin.html → Users tab → Find them → Change role to ADMIN/EDITOR
- They logout/login again to get new power

### Step 3: Daily Use
- Go to `admin-login.html` → Sign In with email/password
- Access token stored in localStorage: kaatya_access_token
- Admin.html checks auth on load:
  - If no token → Redirect to login
  - If token expired → Clear and redirect to login
  - If profile inactive → Deactivated message
  - If role viewer → Read-only UI (action buttons disabled via JS)

### Step 4: User Management (Owner/Admin)
- Admin.html → Users tab → See all users from backend
- Dropdown to change role: viewer/editor/admin/owner (owner option only visible to owner)
- Activate/Deactivate button
- Audit log: Every role change logged to audit_logs table

## Files Created/Updated

### New Files:
- `admin-login.html` - Login/Signup page with branding, role explanation, backend status
- `js/auth.js` - KaatyaAuth class: signup, signin, getCurrentUser, profiles, role checks, logout
- `MULTI_USER_GUIDE.md` - This guide

### Updated Files:
- `admin.html`:
  - Added <script src="js/auth.js"> + <script src="js/insforge.js">
  - Auth guard: checkAuth() on load, redirect if not logged in
  - User card in sidebar: avatar, name, email, role badge, logout, users button
  - New tab: Users — Multi User with role power explanation
  - Functions: loadUsers(), changeUserRole(), toggleUserActive(), audit logging
  - Mobile tab includes Users
  - Backend sync still works

- `track.html`:
  - Now tries backend if not found locally
  - Uses KaatyaBackend.getOrders() to find order

- `index.html`:
  - Added backend LIVE badge
  - Already uses backend for featured/templates/promos

## API Endpoints Used

### Auth:
- POST /api/auth/users - Signup (needs Authorization: Bearer API_KEY)
- POST /api/auth/sessions - Signin
- GET /api/auth/sessions/current - Get current user (Bearer accessToken)
- POST /api/auth/logout - Logout

### Database:
- POST /api/database/records/user_profiles - Create profile
- GET /api/database/records/user_profiles?user_id=eq.xxx - Get profile
- GET /api/database/records/user_profiles?order=created_at.desc - All profiles
- PATCH /api/database/records/user_profiles?id=eq.xxx - Update role/active
- POST /api/database/records/audit_logs - Log actions

## Security Notes
- Email verification disabled for easy setup (can enable later in auth config)
- API key is public anon key - tables have no RLS yet
- For production, add RLS policies:
  - user_profiles: Only owner can update roles, users can read own profile
  - orders: Only admin/owner can read all, users can read own if needed
  - etc.
- UPI QR still only shown at payment step as required
- All passwords hashed by Insforge backend (bcrypt)

## Test Accounts
- Owner demo: kaatya.owner@raebareli.test / Kaatya@2026 (already created, role owner)
- Create your own at /admin-login.html → Sign Up

## Live Preview
- Server on port 8000: KAATYA Multi-User Live
- Go to /admin-login.html to test signup/login
- Then /admin.html will show your role and allow user management

## Next Steps (Optional)
- Enable email verification: PUT /api/auth/config {requireEmailVerification:true}
- Add OAuth: Google/GitHub login via Insforge dashboard
- Add RLS policies for production security
- Add password reset flow: POST /api/auth/email/send-reset, etc.
- Add 2FA for owner
