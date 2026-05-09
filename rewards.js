// ============================================================
// CyberQuest - Rewards, XP, Badges & Streaks System
// ============================================================

const Rewards = {
  LEVELS: [
    { min: 0,    max: 199,   name: 'Noob',       icon: '🐣', color: '#888' },
    { min: 200,  max: 499,   name: 'Aware',      icon: '👀', color: '#3b82f6' },
    { min: 500,  max: 999,   name: 'Guardian',   icon: '🛡️', color: '#10b981' },
    { min: 1000, max: 1999,  name: 'Defender',   icon: '⚔️', color: '#f59e0b' },
    { min: 2000, max: 99999, name: 'CyberHero',  icon: '🦸', color: '#ff006e' },
  ],

  BADGES: {
    first_login:    { name: 'First Step',      icon: '👣', desc: 'Logged in for the first time', xp: 10 },
    story_complete: { name: 'Awakened',        icon: '👁️', desc: 'Completed Alex\'s Story',      xp: 50 },
    password_pro:   { name: 'Password Pro',    icon: '🔐', desc: 'Aced the Password Fortress',   xp: 75 },
    phish_detector: { name: 'Phish Detector',  icon: '🎣', desc: 'Caught all phishing emails',   xp: 75 },
    maze_runner:    { name: 'Maze Runner',     icon: '🌀', desc: 'Escaped the Malware Maze',     xp: 75 },
    privacy_guard:  { name: 'Privacy Guard',   icon: '🔒', desc: 'Secured social media profile', xp: 75 },
    cyber_hero:     { name: 'CyberHero',       icon: '🦸', desc: 'Completed all modules!',       xp: 200 },
    streak_3:       { name: 'On Fire!',        icon: '🔥', desc: '3-day login streak',           xp: 30 },
    streak_7:       { name: 'Week Warrior',    icon: '⚡', desc: '7-day login streak',           xp: 100 },
    streak_30:      { name: 'Cyber Monk',      icon: '🧘', desc: '30-day login streak',          xp: 500 },
    perfect_phish:  { name: 'Eagle Eye',       icon: '🦅', desc: 'Perfect score on phishing',    xp: 50 },
    speedster:      { name: 'Speedster',       icon: '⚡', desc: 'Completed a module in record time', xp: 30 },
  },

  MODULES: {
    alex_story:   { name: "Alex's Story",       xp: 50,  icon: '📖' },
    password:     { name: 'Password Fortress',  xp: 75,  icon: '🔐' },
    phishing:     { name: 'Phishing Lake',      xp: 75,  icon: '🎣' },
    malware:      { name: 'Malware Maze',       xp: 75,  icon: '🌀' },
    social:       { name: 'Social Shield',      xp: 75,  icon: '🔒' },
    hero_hq:      { name: 'CyberHero HQ',       xp: 150, icon: '🦸' },
  },

  getLevel(xp) {
    return this.LEVELS.find(l => xp >= l.min && xp <= l.max) || this.LEVELS[0];
  },

  getNextLevel(xp) {
    const idx = this.LEVELS.findIndex(l => xp >= l.min && xp <= l.max);
    return this.LEVELS[idx + 1] || null;
  },

  getLevelProgress(xp) {
    const current = this.getLevel(xp);
    const next = this.getNextLevel(xp);
    if (!next) return 100;
    const range = next.min - current.min;
    const progress = xp - current.min;
    return Math.min(100, Math.floor((progress / range) * 100));
  },

  awardXP(amount, reason = '') {
    const users = Auth.getUsers();
    const id = localStorage.getItem(Auth.SESSION_KEY);
    if (!id || !users[id]) return;

    const oldXP = users[id].xp;
    const oldLevel = this.getLevel(oldXP);
    users[id].xp += amount;
    const newLevel = this.getLevel(users[id].xp);

    Auth.saveUsers(users);

    if (typeof Utils !== 'undefined') {
      Utils.showToast(`+${amount} XP ${reason ? '— ' + reason : ''}`, 'xp');
      if (oldLevel.name !== newLevel.name) {
        setTimeout(() => {
          Utils.showToast(`🎉 Level Up! You're now a ${newLevel.icon} ${newLevel.name}!`, 'success', 5000);
          Utils.confetti(120);
        }, 1200);
      }
    }
    return users[id];
  },

  awardBadge(badgeKey) {
    const users = Auth.getUsers();
    const id = localStorage.getItem(Auth.SESSION_KEY);
    if (!id || !users[id]) return;

    if (users[id].badges.includes(badgeKey)) return; // already earned
    const badge = this.BADGES[badgeKey];
    if (!badge) return;

    users[id].badges.push(badgeKey);
    Auth.saveUsers(users);
    this.awardXP(badge.xp, `Badge: ${badge.name}`);

    if (typeof Utils !== 'undefined') {
      setTimeout(() => Utils.showToast(`${badge.icon} Badge Earned: "${badge.name}"!`, 'badge', 5000), 600);
    }
  },

  completeModule(moduleKey) {
    const users = Auth.getUsers();
    const id = localStorage.getItem(Auth.SESSION_KEY);
    if (!id || !users[id]) return;

    const user = users[id];
    const mod = this.MODULES[moduleKey];
    if (!mod) return;

    if (!user.completedModules.includes(moduleKey)) {
      user.completedModules.push(moduleKey);
      Auth.saveUsers(users);
      this.awardXP(mod.xp, `Completed: ${mod.name}`);

      // Module-specific badges
      const modBadgeMap = {
        alex_story: 'story_complete',
        password: 'password_pro',
        phishing: 'phish_detector',
        malware: 'maze_runner',
        social: 'privacy_guard',
      };
      if (modBadgeMap[moduleKey]) this.awardBadge(modBadgeMap[moduleKey]);

      // CyberHero badge if all done
      const allModules = Object.keys(this.MODULES);
      const updated = Auth.getUsers();
      if (allModules.every(k => updated[id]?.completedModules?.includes(k))) {
        this.awardBadge('cyber_hero');
        this.awardXP(200, 'All modules complete!');
        if (typeof Utils !== 'undefined') Utils.confetti(200);
      }
    }
    return Auth.getUsers()[id];
  },

  updateStreak(userId) {
    const users = Auth.getUsers();
    const user = users[userId];
    if (!user) return;

    const today = new Date().toDateString();
    const lastDate = user.lastLoginDate;

    if (lastDate === today) return; // Already logged streak today

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate === yesterday) {
      user.streak += 1;
    } else if (lastDate !== today) {
      user.streak = 1; // Reset streak
    }

    user.lastLoginDate = today;
    users[userId] = user;
    Auth.saveUsers(users);

    // Streak badges
    if (user.streak >= 3)  this.awardBadge('streak_3');
    if (user.streak >= 7)  this.awardBadge('streak_7');
    if (user.streak >= 30) this.awardBadge('streak_30');

    // First login badge
    if (!user.badges?.includes('first_login')) {
      setTimeout(() => this.awardBadge('first_login'), 1000);
    }
  }
};
