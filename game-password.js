// ============================================================
// CyberQuest — Game 2: Password Fortress
// ============================================================
const PasswordGame = {
  challengeIdx: 0,
  score: 0,
  completed: [],

  CHALLENGES: [
    { account:'📧 Email Account',   hint:'Your email is the master key to ALL your accounts. Make it unbreakable!', minScore:3 },
    { account:'🏦 Bank / UPI App',  hint:'Financial accounts need maximum protection. Even family shouldn\'t know this!', minScore:4 },
    { account:'🎮 Gaming Account',  hint:'Your game progress and purchases need protecting too!', minScore:3 },
    { account:'📱 School Portal',   hint:'School accounts contain your grades, personal info, and classmates\' data.', minScore:3 },
  ],

  REUSE_QUIZ: [
    { q:'You use the same password for email and Instagram. Your Instagram gets hacked. What happens?', correct:1,
      opts:['Only Instagram is affected','Your email account is ALSO at risk!','Nothing, passwords are encrypted'],
      exp:'If one site is breached, attackers try the same password everywhere. This is called "credential stuffing" — it\'s automated and takes seconds.' },
    { q:'Which is the strongest password?', correct:2,
      opts:['password123','Alex2006!','T#9mK$vL2@pQ','ilovecricket'],
      exp:'T#9mK$vL2@pQ uses uppercase, lowercase, numbers, and symbols randomly — impossible to guess and extremely slow to crack.' },
    { q:'Your friend asks for your password to help you recover an account. What do you do?', correct:1,
      opts:['Give it, they\'re trustworthy','Never share passwords with ANYONE','Change it after they\'re done'],
      exp:'Legitimate helpers NEVER need your password. Use account recovery options instead. Even trusted friends can accidentally expose your credentials.' },
    { q:'How often should you change important passwords?', correct:2,
      opts:['Never, if it\'s strong','Every 5 years','Every 3–6 months or after any breach','Only when you forget it'],
      exp:'Regular rotation limits damage from undetected breaches. Use a password manager to handle many unique passwords easily.' },
  ],

  init() {
    this.challengeIdx = 0;
    this.score = 0;
    this.completed = [];
    this.renderChallenge();
  },

  renderChallenge() {
    const c = this.CHALLENGES[this.challengeIdx];
    document.getElementById('pwd-challenge-num').textContent = `${this.challengeIdx+1}/${this.CHALLENGES.length}`;
    document.getElementById('pwd-score').textContent = this.score;
    const container = document.getElementById('password-content');

    container.innerHTML = `
      <div class="password-game-wrap">
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="font-family:var(--font-game);color:var(--cyan);font-size:1.1rem">🔐 PASSWORD FORTRESS</h2>
          <p style="color:var(--text-muted);font-size:0.85rem;margin-top:6px">Create a strong password for each account</p>
        </div>
        <div class="password-challenge">
          <div class="challenge-title">${c.account}</div>
          <div class="challenge-for" style="color:var(--gold)">${c.hint}</div>
          <div class="password-input-wrap">
            <input type="password" id="pwd-input" placeholder="Type your password..." oninput="PasswordGame.analyze(this.value)" autocomplete="new-password">
            <button class="pwd-toggle" onclick="PasswordGame.toggleVis()">👁️</button>
          </div>
          <div class="strength-meter"><div class="strength-fill" id="str-fill"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div class="strength-label" id="str-label" style="color:var(--text-dim)">Start typing...</div>
            <div class="crack-time" id="crack-time"></div>
          </div>
          <div class="password-tips" id="pwd-tips">
            ${[
              ['len8',   'At least 8 characters'],
              ['upper',  'Uppercase letter (A–Z)'],
              ['lower',  'Lowercase letter (a–z)'],
              ['number', 'Number (0–9)'],
              ['symbol', 'Special character (!@#$%^&*)'],
              ['nopats', 'No common patterns (123, abc, password...)'],
            ].map(([id,label])=>`
              <div class="tip-row" id="tip-${id}">
                <div class="tip-check" id="chk-${id}"></div>
                <span>${label}</span>
              </div>`).join('')}
          </div>
          <div style="margin-top:24px;display:flex;gap:12px;justify-content:flex-end;">
            <button class="btn btn-secondary" onclick="PasswordGame.useGenerator()">⚡ Generate Strong</button>
            <button class="btn btn-primary" id="pwd-submit" onclick="PasswordGame.submitPassword()" disabled>Use This Password</button>
          </div>
        </div>
        <div id="pwd-feedback" style="display:none"></div>
      </div>`;

    this._showVis = false;
  },

  toggleVis() {
    const inp = document.getElementById('pwd-input');
    this._showVis = !this._showVis;
    inp.type = this._showVis ? 'text' : 'password';
  },

  useGenerator() {
    const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pwd='';
    // Guarantee all character types
    pwd += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)];
    pwd += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)];
    pwd += '0123456789'[Math.floor(Math.random()*10)];
    pwd += '!@#$%^&*'[Math.floor(Math.random()*8)];
    for(let i=4;i<14;i++) pwd+=chars[Math.floor(Math.random()*chars.length)];
    pwd = pwd.split('').sort(()=>Math.random()-0.5).join('');
    const inp = document.getElementById('pwd-input');
    inp.value = pwd; inp.type='text'; this._showVis=true;
    this.analyze(pwd);
    Utils.showToast('Strong password generated! Save it in a password manager.', 'success');
  },

  analyze(pwd) {
    const checks = {
      len8:   pwd.length >= 8,
      upper:  /[A-Z]/.test(pwd),
      lower:  /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      symbol: /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?]/.test(pwd),
      nopats: !/(password|123|abc|qwerty|admin|letmein|iloveyou)/i.test(pwd) && pwd.length>0,
    };
    const score = Object.values(checks).filter(Boolean).length;

    // Update tips
    Object.entries(checks).forEach(([k,v])=>{
      const row=document.getElementById(`tip-${k}`);
      const chk=document.getElementById(`chk-${k}`);
      if(row){ row.classList.toggle('met',v); }
      if(chk){ chk.textContent = v?'✓':''; }
    });

    // Strength bar
    const pct = Math.round((score/6)*100);
    const fill = document.getElementById('str-fill');
    const label= document.getElementById('str-label');
    const crack= document.getElementById('crack-time');
    const levels=[
      {p:0,  c:'#ff003c', t:'Very Weak',  cr:'Instantly'},
      {p:17, c:'#ff6600', t:'Weak',       cr:'< 1 second'},
      {p:34, c:'#ffaa00', t:'Fair',       cr:'Minutes to hours'},
      {p:50, c:'#ccff00', t:'Moderate',   cr:'Days to weeks'},
      {p:67, c:'#66ff33', t:'Strong',     cr:'Years'},
      {p:84, c:'#00ffcc', t:'Very Strong',cr:'Centuries!'},
    ];
    const lvl=levels.filter(l=>pct>=l.p).pop()||levels[0];
    if(fill){ fill.style.width=pct+'%'; fill.style.background=lvl.c; fill.style.boxShadow=`0 0 10px ${lvl.c}`; }
    if(label){ label.textContent=pwd.length?lvl.t:'Start typing...'; label.style.color=lvl.c; }
    if(crack&&pwd.length){ crack.innerHTML=`⏱️ Crack time: <span>${lvl.cr}</span>`; }

    const submit=document.getElementById('pwd-submit');
    const minScore=this.CHALLENGES[this.challengeIdx].minScore;
    if(submit) submit.disabled = score < minScore || pwd.length < 8;
    this._currentScore = score;
    this._currentPwd = pwd;
  },

  submitPassword() {
    const pwd = document.getElementById('pwd-input')?.value || '';
    const score = this._currentScore || 0;
    const pts = score >= 5 ? 25 : score >= 4 ? 15 : score >= 3 ? 8 : 0;
    this.score += pts;
    this.completed.push({pwd: pwd.replace(/./g,'•'), score});
    const fb = document.getElementById('pwd-feedback');
    fb.style.display = 'block';
    fb.innerHTML = `
      <div style="padding:20px;background:rgba(57,255,20,0.08);border:1px solid var(--green);border-radius:12px;margin-top:0;">
        <div style="font-family:var(--font-game);color:var(--green);margin-bottom:8px">✅ Password set! +${pts} points</div>
        <p style="font-size:0.83rem;color:var(--text-muted)">Remember: Use a <strong>different</strong> password for every account. A password manager like Bitwarden (free!) can remember them all.</p>
        <button class="btn btn-primary" style="margin-top:16px" onclick="PasswordGame.nextChallenge()">Next Account →</button>
      </div>`;
    Utils.showToast(`+${pts} points! Strong password set!`, 'success');
  },

  nextChallenge() {
    if(this.challengeIdx < this.CHALLENGES.length-1){
      this.challengeIdx++;
      this.renderChallenge();
    } else {
      this.showReuseQuiz();
    }
  },

  showReuseQuiz() {
    const container = document.getElementById('password-content');
    container.innerHTML = `
      <div class="password-game-wrap">
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="font-family:var(--font-game);color:var(--gold)">🧠 Password Wisdom Quiz</h2>
          <p style="color:var(--text-muted);font-size:0.85rem">Test what you've learned about password safety</p>
        </div>
        <div id="quiz-panels"></div>
      </div>`;
    this.quizIdx = 0;
    this.renderQuizQ();
  },

  renderQuizQ() {
    const q = this.REUSE_QUIZ[this.quizIdx];
    document.getElementById('quiz-panels').innerHTML = `
      <div class="password-challenge">
        <div class="challenge-title" style="color:var(--cyan)">Question ${this.quizIdx+1}/${this.REUSE_QUIZ.length}</div>
        <p style="margin:12px 0 20px;line-height:1.7">${q.q}</p>
        ${q.opts.map((o,i)=>`
          <button class="story-choice" id="qopt-${i}" onclick="PasswordGame.answerQuiz(${i})">${o}</button>
        `).join('')}
        <div id="quiz-exp" style="display:none;margin-top:14px;padding:12px 16px;background:rgba(0,245,255,0.07);border-left:3px solid var(--cyan);border-radius:0 8px 8px 0;font-size:0.83rem;line-height:1.6;"></div>
        <div id="quiz-next" style="display:none;margin-top:16px;text-align:right;"></div>
      </div>`;
  },

  answerQuiz(idx) {
    const q = this.REUSE_QUIZ[this.quizIdx];
    document.querySelectorAll('[id^="qopt-"]').forEach((b,i)=>{
      b.disabled=true;
      if(i===q.correct) b.classList.add('correct');
      else if(i===idx&&idx!==q.correct) b.classList.add('wrong');
    });
    const exp=document.getElementById('quiz-exp');
    exp.style.display='block'; exp.textContent=q.exp;
    if(idx===q.correct){ this.score+=20; Utils.showToast('+20 points! Correct!','success'); }
    else Utils.showToast('Not quite — read the explanation!','warning');
    document.getElementById('pwd-score').textContent=this.score;
    const nxt=document.getElementById('quiz-next');
    nxt.style.display='block';
    const isLast=this.quizIdx>=this.REUSE_QUIZ.length-1;
    nxt.innerHTML=`<button class="btn btn-primary" onclick="PasswordGame.${isLast?'complete':'nextQ'}()">${isLast?'Finish! 🏆':'Next Question →'}</button>`;
  },

  nextQ(){ this.quizIdx++; this.renderQuizQ(); },

  complete() {
    Rewards.completeModule('password');
    const container = document.getElementById('password-content');
    const grade = this.score>=120?'🏆 MASTER':this.score>=80?'⭐ EXPERT':this.score>=50?'👍 LEARNER':'📚 BEGINNER';
    container.innerHTML = `
      <div class="results-screen">
        <span class="results-emoji">🔐</span>
        <h2 class="results-title gradient-text">Password Fortress Complete!</h2>
        <p class="results-subtitle">You've mastered the fundamentals of password security!</p>
        <div class="results-stats">
          <div class="results-stat"><span class="results-stat-value text-gold">${this.score}</span><div class="results-stat-label">Points Scored</div></div>
          <div class="results-stat"><span class="results-stat-value">+75</span><div class="results-stat-label">XP Earned</div></div>
          <div class="results-stat"><span class="results-stat-value">${grade}</span><div class="results-stat-label">Your Rank</div></div>
        </div>
        <div class="story-lesson-box" style="text-align:left;margin-bottom:24px;">
          <div class="lesson-label">🎓 YOUR PASSWORD RULEBOOK</div>
          <p>
          ✅ Use a UNIQUE password for every account<br>
          ✅ Minimum 12 characters with mixed types<br>
          ✅ Use a password manager (Bitwarden, 1Password)<br>
          ✅ Enable 2FA (Two-Factor Authentication) everywhere<br>
          ✅ Never share passwords — not even with friends<br>
          ✅ Change passwords after any suspected breach
          </p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="closeGame('game-password');Utils.confetti()">🏰 BACK TO CYBERCITY</button>
      </div>`;
    Utils.confetti(100);
  }
};
