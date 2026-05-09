// ============================================================
// CyberQuest - Authentication (localStorage-based)
// ============================================================

const Auth = {
  USERS_KEY: 'cq_users',
  SESSION_KEY: 'cq_session',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser() {
    const id = localStorage.getItem(this.SESSION_KEY);
    if (!id) return null;
    const users = this.getUsers();
    return users[id] || null;
  },

  register(username, password, avatar = 'hero') {
    if (!username || username.length < 3) return { ok: false, msg: 'Username must be at least 3 characters.' };
    if (!password || password.length < 6) return { ok: false, msg: 'Password must be at least 6 characters.' };

    const users = this.getUsers();
    const id = username.toLowerCase().trim();

    if (users[id]) return { ok: false, msg: 'Username already taken. Try another one!' };

    users[id] = {
      id,
      username: username.trim(),
      password: btoa(password),
      avatar,
      createdAt: Date.now(),
      xp: 0,
      level: 1,
      badges: [],
      completedModules: [],
      streak: 0,
      lastLoginDate: null,
      totalScore: 0,
      achievements: [],
      dailyTipSeen: false
    };

    this.saveUsers(users);
    localStorage.setItem(this.SESSION_KEY, id);
    Rewards.updateStreak(id);
    return { ok: true, user: users[id] };
  },

  login(username, password) {
    if (!username || !password) return { ok: false, msg: 'Please fill in all fields.' };

    const users = this.getUsers();
    const id = username.toLowerCase().trim();
    const user = users[id];

    if (!user) return { ok: false, msg: 'Account not found. Please register first.' };
    if (user.password !== btoa(password)) return { ok: false, msg: 'Incorrect password. Try again!' };

    localStorage.setItem(this.SESSION_KEY, id);
    Rewards.updateStreak(id);
    return { ok: true, user };
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'index.html';
  },

  updateUser(updates) {
    const users = this.getUsers();
    const id = localStorage.getItem(this.SESSION_KEY);
    if (!id || !users[id]) return;
    users[id] = { ...users[id], ...updates };
    this.saveUsers(users);
    return users[id];
  },

  getAllUsers() {
    const users = this.getUsers();
    return Object.values(users).map(u => ({
      username: u.username,
      xp: u.xp,
      level: u.level,
      streak: u.streak,
      badges: u.badges.length
    })).sort((a, b) => b.xp - a.xp);
  }
};
