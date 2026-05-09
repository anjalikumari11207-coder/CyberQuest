// ============================================================
// CyberQuest - Utility Functions
// ============================================================

const Utils = {
  // Navigate to a page
  navigate(page) {
    window.location.href = page;
  },

  // Show a toast notification
  showToast(message, type = 'info', duration = 3500) {
    const existing = document.querySelector('.cq-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cq-toast cq-toast--${type}`;
    const icons = { info: '💡', success: '✅', warning: '⚠️', error: '❌', xp: '⚡', badge: '🏅' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '💡'}</span><span class="toast-msg">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  // Show a modal overlay
  showModal(title, htmlContent, buttons = []) {
    const overlay = document.createElement('div');
    overlay.className = 'cq-modal-overlay';
    const btnsHtml = buttons.map(b =>
      `<button class="btn ${b.cls || 'btn-primary'}" onclick="${b.action}">${b.label}</button>`
    ).join('');
    overlay.innerHTML = `
      <div class="cq-modal">
        <div class="cq-modal-header">
          <h2>${title}</h2>
          <button class="modal-close" onclick="Utils.closeModal()">✕</button>
        </div>
        <div class="cq-modal-body">${htmlContent}</div>
        ${btnsHtml ? `<div class="cq-modal-footer">${btnsHtml}</div>` : ''}
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
    return overlay;
  },

  closeModal() {
    const overlay = document.querySelector('.cq-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  },

  // Typewriter effect
  typeWriter(element, text, speed = 30, callback) {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
      element.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
    return timer;
  },

  // Animate a number counting up
  animateCounter(element, from, to, duration = 1000) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  // Shuffle array
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Format a number with commas
  formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Confetti burst
  confetti(count = 80) {
    const colors = ['#00f5ff', '#ff006e', '#ffd700', '#39ff14', '#bf5af2'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        position:fixed; top:-10px; left:${Math.random()*100}vw;
        width:${6+Math.random()*8}px; height:${6+Math.random()*8}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>0.5?'50%':'2px'};
        animation: confettiFall ${2+Math.random()*2}s ease-out forwards;
        transform: rotate(${Math.random()*360}deg);
        z-index:9999; pointer-events:none;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  },

  // Check if user is logged in, redirect if not
  requireAuth() {
    const user = Auth.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },

  // Get a random item from an array
  random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};

// Inject confetti keyframes once
if (!document.getElementById('cq-confetti-style')) {
  const s = document.createElement('style');
  s.id = 'cq-confetti-style';
  s.textContent = `@keyframes confettiFall {
    0%{transform:translateY(0) rotate(0deg); opacity:1}
    100%{transform:translateY(100vh) rotate(720deg); opacity:0}
  }`;
  document.head.appendChild(s);
}
