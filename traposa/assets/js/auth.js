// TRAPOSA Authentication Module

class AuthManager {
  constructor() {
    this.user = null;
    this.isAdmin = false;
    this.init();
  }

  async init() {
    // Check for existing session
    if (typeof supabase !== 'undefined' && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.user = session.user;
        await this.checkAdminStatus();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        this.user = session?.user || null;
        if (this.user) {
          await this.checkAdminStatus();
        } else {
          this.isAdmin = false;
        }
        this.updateUI();
      });
    }

    this.updateUI();
  }

  async checkAdminStatus() {
    if (!this.user) {
      this.isAdmin = false;
      return;
    }

    try {
      const { data, error } = await supabase
        .from('traposa_admins')
        .select('id')
        .eq('email', this.user.email)
        .single();

      this.isAdmin = !!data && !error;
    } catch (error) {
      this.isAdmin = false;
    }
  }

  updateUI() {
    // Update auth button visibility
    const authBtn = document.querySelector('.auth-btn');
    if (authBtn) {
      authBtn.style.display = this.user ? 'none' : 'flex';
    }

    // Show admin button for admins
    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) {
      adminBtn.classList.toggle('visible', this.isAdmin);
    }

    // Update user avatar if present
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && this.user) {
      userAvatar.textContent = this.getInitials(this.user.email);
    }
  }

  getInitials(email) {
    if (!email) return '?';
    return email.split('@')[0].slice(0, 2).toUpperCase();
  }

  async signUp(email, password, userData = {}) {
    if (!supabase) throw new Error('Supabase not initialized');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    return { data, error };
  }

  async signIn(email, password) {
    if (!supabase) throw new Error('Supabase not initialized');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  }

  async signOut() {
    if (!supabase) throw new Error('Supabase not initialized');

    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async resetPassword(email) {
    if (!supabase) throw new Error('Supabase not initialized');

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/pages/reset-password.html`
    });

    return { data, error };
  }

  async updatePassword(newPassword) {
    if (!supabase) throw new Error('Supabase not initialized');

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { data, error };
  }

  get isAuthenticated() {
    return !!this.user;
  }

  get userEmail() {
    return this.user?.email;
  }
}

// Initialize auth manager
const auth = new AuthManager();

// Protect routes that require authentication
function requireAuth() {
  if (!auth.isAuthenticated) {
    window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

// Protect admin routes
function requireAdmin() {
  if (!auth.isAuthenticated || !auth.isAdmin) {
    window.location.href = '/pages/login.html?error=unauthorized';
    return false;
  }
  return true;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthManager, auth, requireAuth, requireAdmin };
}
