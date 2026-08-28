// KAATYA WEB DEVELOPER - Multi-User Auth System
// Backend: https://pnhxxd37.us-east.insforge.app Project: desginers

const AUTH_URL = 'https://pnhxxd37.us-east.insforge.app';
const AUTH_KEY = 'ik_8f0ac0caf6fe706207467ed8a31a3162';

class KaatyaAuth {
  constructor() {
    this.accessToken = localStorage.getItem('kaatya_access_token') || null;
    this.refreshToken = localStorage.getItem('kaatya_refresh_token') || null;
    this.user = JSON.parse(localStorage.getItem('kaatya_user') || 'null');
    this.profile = JSON.parse(localStorage.getItem('kaatya_profile') || 'null');
  }

  // Save session
  saveSession(data) {
    if(data.accessToken) {
      this.accessToken = data.accessToken;
      localStorage.setItem('kaatya_access_token', data.accessToken);
    }
    if(data.refreshToken) {
      this.refreshToken = data.refreshToken;
      localStorage.setItem('kaatya_refresh_token', data.refreshToken);
    }
    if(data.user) {
      this.user = data.user;
      localStorage.setItem('kaatya_user', JSON.stringify(data.user));
    }
  }

  clearSession() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.profile = null;
    localStorage.removeItem('kaatya_access_token');
    localStorage.removeItem('kaatya_refresh_token');
    localStorage.removeItem('kaatya_user');
    localStorage.removeItem('kaatya_profile');
  }

  // Sign Up — use mobile client_type to get refreshToken directly (fix Vercel cross-origin cookie issue)
  async signUp(email, password, displayName) {
    try {
      const res = await fetch(`${AUTH_URL}/api/auth/users?client_type=mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_KEY}`
        },
        body: JSON.stringify({
          email,
          password,
          name: displayName
        })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Signup failed');
      
      this.saveSession(data);
      
      // Create user profile - check if first user
      const isFirstUser = await this.isFirstUser();
      const role = isFirstUser ? 'owner' : 'viewer';
      
      await this.createUserProfile(data.user.id, email, displayName, role);
      
      return { success: true, user: data.user, role };
    } catch(e) {
      console.error('Signup error', e);
      return { success: false, error: e.message };
    }
  }

  // Sign In — use mobile client_type to get refreshToken directly
  async signIn(email, password) {
    try {
      const res = await fetch(`${AUTH_URL}/api/auth/sessions?client_type=mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_KEY}`
        },
        body: JSON.stringify({
          method: 'password',
          email,
          password
        })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Signin failed');
      
      this.saveSession(data);
      
      // Load profile
      const profile = await this.getUserProfile(data.user.id);
      if(profile) {
        this.profile = profile;
        localStorage.setItem('kaatya_profile', JSON.stringify(profile));
      } else {
        // Create profile if not exists (for users created before profile system)
        const isFirst = await this.isFirstUser();
        const role = isFirst ? 'owner' : 'viewer';
        await this.createUserProfile(data.user.id, email, data.user.profile?.name || email.split('@')[0], role);
        const newProfile = await this.getUserProfile(data.user.id);
        if(newProfile) {
          this.profile = newProfile;
          localStorage.setItem('kaatya_profile', JSON.stringify(newProfile));
        }
      }
      
      // Update last login
      if(this.profile) {
        await this.updateLastLogin(this.profile.id);
      }
      
      return { success: true, user: data.user, profile: this.profile };
    } catch(e) {
      console.error('Signin error', e);
      return { success: false, error: e.message };
    }
  }

  // Get current user from token — with refresh retry
  async getCurrentUser() {
    if(!this.accessToken) return null;
    try {
      const res = await fetch(`${AUTH_URL}/api/auth/sessions/current`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      if(!res.ok) {
        // Try refresh if 401
        if(res.status === 401 && this.refreshToken){
          console.log('Access token expired, trying refresh...');
          const refreshed = await this.refreshSession();
          if(refreshed){
            const retry = await fetch(`${AUTH_URL}/api/auth/sessions/current`, {
              headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            if(retry.ok){
              const data = await retry.json();
              return data.user || data;
            }
          }
        }
        throw new Error('Not authenticated');
      }
      const data = await res.json();
      return data.user || data;
    } catch(e) {
      console.warn('getCurrentUser failed', e);
      return null;
    }
  }

  async refreshSession(){
    if(!this.refreshToken) return false;
    try{
      const res = await fetch(`${AUTH_URL}/api/auth/refresh?client_type=mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });
      if(!res.ok) return false;
      const data = await res.json();
      this.saveSession(data);
      return true;
    }catch(e){ return false; }
  }

  // Check if this is first user (no profiles)
  async isFirstUser() {
    try {
      const res = await fetch(`${AUTH_URL}/api/database/records/user_profiles?limit=1`, {
        headers: { 'Authorization': `Bearer ${AUTH_KEY}` }
      });
      const data = await res.json();
      return !data || data.length === 0;
    } catch(e) {
      return true;
    }
  }

  // Create user profile
  async createUserProfile(userId, email, displayName, role='viewer') {
    try {
      const res = await fetch(`${AUTH_URL}/api/database/records/user_profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify([{
          user_id: userId,
          email,
          display_name: displayName,
          role,
          is_active: true,
          bio: role === 'owner' ? 'Founder - KAATYA WEB DEVELOPER' : ''
        }])
      });
      if(!res.ok) {
        const txt = await res.text();
        console.warn('Create profile failed', txt);
        return null;
      }
      const data = await res.json();
      return data[0] || null;
    } catch(e) {
      console.warn('createUserProfile error', e);
      return null;
    }
  }

  // Get user profile by user_id
  async getUserProfile(userId) {
    try {
      const res = await fetch(`${AUTH_URL}/api/database/records/user_profiles?user_id=eq.${userId}&limit=1`, {
        headers: { 'Authorization': `Bearer ${AUTH_KEY}` }
      });
      if(!res.ok) return null;
      const data = await res.json();
      return data && data.length > 0 ? data[0] : null;
    } catch(e) {
      console.warn('getUserProfile error', e);
      return null;
    }
  }

  // Get all profiles (admin only)
  async getAllProfiles() {
    try {
      const res = await fetch(`${AUTH_URL}/api/database/records/user_profiles?order=created_at.desc&limit=100`, {
        headers: { 'Authorization': `Bearer ${AUTH_KEY}` }
      });
      if(!res.ok) throw new Error('Failed to fetch profiles');
      return await res.json();
    } catch(e) {
      console.warn('getAllProfiles error', e);
      return [];
    }
  }

  // Update profile role
  async updateProfileRole(profileId, newRole) {
    try {
      const res = await fetch(`${AUTH_URL}/api/database/records/user_profiles?id=eq.${profileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AUTH_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ role: newRole })
      });
      if(!res.ok) throw new Error('Update failed');
      return await res.json();
    } catch(e) {
      console.warn('updateProfileRole error', e);
      return null;
    }
  }

  // Update last login
  async updateLastLogin(profileId) {
    try {
      await fetch(`${AUTH_URL}/api/database/records/user_profiles?id=eq.${profileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AUTH_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ last_login: new Date().toISOString() })
      });
    } catch(e) {}
  }

  // Deactivate user
  async toggleUserActive(profileId, isActive) {
    try {
      const res = await fetch(`${AUTH_URL}/api/database/records/user_profiles?id=eq.${profileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AUTH_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ is_active: isActive })
      });
      return res.ok;
    } catch(e) {
      return false;
    }
  }

  // Logout
  async signOut() {
    try {
      if(this.accessToken) {
        await fetch(`${AUTH_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        });
      }
    } catch(e) {}
    this.clearSession();
    window.location.href = 'admin-login.html';
  }

  // Check if user has admin power
  hasAdminPower() {
    if(!this.profile) return false;
    return ['owner', 'admin'].includes(this.profile.role) && this.profile.is_active;
  }

  hasOwnerPower() {
    if(!this.profile) return false;
    return this.profile.role === 'owner' && this.profile.is_active;
  }

  isLoggedIn() {
    return !!this.accessToken && !!this.user;
  }
}

// Global instance
window.KaatyaAuth = new KaatyaAuth();
console.log('🔐 KaatyaAuth loaded - Backend:', AUTH_URL, 'User:', window.KaatyaAuth.user?.email || 'Not logged in');
