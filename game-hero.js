// ============================================================
// CyberQuest — Game 6: CyberHero HQ (Final Challenge Quiz)
// ============================================================
const HeroGame = {
  qIdx: 0,
  score: 0,
  correct: 0,
  timerInterval: null,
  timeLeft: 30,
  answered: false,

  QUESTIONS: [
    { cat:'Passwords', q:'Which of these is the STRONGEST password?',
      opts:['Password@123','MyN4me1sAl3x!','Tr$9kP#mL2@vQ','ilovecricket2006'],
      correct:2, exp:'Tr$9kP#mL2@vQ is random, long, and has all character types — virtually impossible to crack. Avoid personal info like names or birth years.' },
    { cat:'Passwords', q:'You use the same password for Gmail and Zomato. Zomato gets hacked. What happens?',
      opts:['Only Zomato is affected','Hackers can now access your Gmail too','Nothing, passwords are hashed'],
      correct:1, exp:'Credential stuffing attacks automatically try stolen passwords on popular sites. One breach = all accounts at risk. Use unique passwords everywhere.' },
    { cat:'Phishing', q:'You receive: "Your SBI account is suspended! Verify NOW at sbi-verify-alert.com". What do you do?',
      opts:['Click the link and verify quickly','Call SBI directly using their official number','Reply to the email asking for details'],
      correct:1, exp:'Always verify alerts by calling the company directly using a number from their OFFICIAL website — not the one in the suspicious message.' },
    { cat:'Phishing', q:'Which email domain is DEFINITELY fake if you\'re expecting a message from Amazon?',
      opts:['amazon.in','amazon-support-help.com','amazon.co.uk'],
      correct:1, exp:'Amazon-support-help.com is NOT an Amazon domain. Real Amazon emails come from @amazon.in, @amazon.com, etc. Watch for hyphens and extra words in domains.' },
    { cat:'Public WiFi', q:'You\'re at a café with free WiFi. What should you AVOID doing?',
      opts:['Reading news articles','Checking your bank account','Watching YouTube'],
      correct:1, exp:'Banking on public WiFi exposes your credentials to man-in-the-middle attacks. Hackers can intercept unencrypted traffic. Use mobile data or a VPN for banking.' },
    { cat:'Public WiFi', q:'What is a VPN used for?',
      opts:['Making your internet faster','Encrypting your connection to protect data on public networks','Blocking ads on websites'],
      correct:1, exp:'A VPN (Virtual Private Network) encrypts all your internet traffic, making it unreadable to anyone intercepting it on public WiFi.' },
    { cat:'Social Media', q:'Your Instagram bio shows: your school, city, birthday, and phone number. What\'s the risk?',
      opts:['No risk — it helps people find you','This is a complete identity theft package for criminals','Only the phone number is risky'],
      correct:1, exp:'Combined, this info lets criminals: impersonate you, recover your accounts, target you for scams, and even physically locate you. Remove personal details from public bios.' },
    { cat:'Social Media', q:'A stranger on Facebook says they\'re from a company offering you ₹50,000/month work-from-home. They ask for your Aadhaar. What do you do?',
      opts:['Share it — it\'s a great opportunity!','Refuse and report — this is a job scam','Ask for more money before sharing'],
      correct:1, exp:'Legitimate employers never ask for Aadhaar via social media DMs. This is a classic data harvesting scam. Always verify companies through official channels.' },
    { cat:'Malware', q:'You download a "free PDF converter" and it asks to install "SearchHelper toolbar." What should you do?',
      opts:['Accept — it\'s part of the software','Decline and uncheck it — this is a PUP (Potentially Unwanted Program)','Accept and delete it later'],
      correct:1, exp:'Bundled toolbars and programs are often adware or browser hijackers. Always choose "Custom Install" and uncheck anything extra.' },
    { cat:'Malware', q:'A pop-up says: "VIRUS DETECTED! Call Microsoft Support: 1800-XXX-XXXX immediately!"',
      opts:['Call the number right away','Close the browser tab — this is a scam','Download the software they offer'],
      correct:1, exp:'Microsoft NEVER contacts users through browser pop-ups. "Tech support scams" trick people into calling fake numbers and paying for fake services. Close the tab with Task Manager if needed.' },
    { cat:'Two-Factor Auth', q:'What is Two-Factor Authentication (2FA)?',
      opts:['Using two different passwords','A second verification step (OTP, app code) after your password','Logging in from two devices'],
      correct:1, exp:'2FA adds a second layer of security — even if someone steals your password, they can\'t login without the second factor (OTP, authenticator app code, biometric).' },
    { cat:'Two-Factor Auth', q:'Someone calls claiming to be from your bank and asks for the OTP you just received. What do you do?',
      opts:['Share it — they need to verify your account','NEVER share OTPs with anyone — hang up immediately','Share it only if they know your name'],
      correct:1, exp:'OTPs are single-use codes that must NEVER be shared — not with "bank employees," "support staff," or anyone. Your bank will never ask for an OTP over a call.' },
    { cat:'Data Protection', q:'Which of these is SAFEST to do online?',
      opts:['Using the same email and password everywhere','Enabling 2FA and using a password manager','Sharing account details with trusted friends'],
      correct:1, exp:'2FA + password manager is the gold standard. A manager generates and stores unique strong passwords so you never have to remember or reuse them.' },
    { cat:'Cybercrime', q:'Someone threatens to share your private photos unless you pay them. This is called:',
      opts:['Phishing','Sextortion / Blackmail','Ransomware'],
      correct:1, exp:'Sextortion is a serious cybercrime. Never pay — paying encourages more demands. Report immediately to the Cybercrime portal: cybercrime.gov.in or call 1930.' },
    { cat:'Cybercrime', q:'You become a victim of an online scam in India. What should you do FIRST?',
      opts:['Post about it on social media','Report to cybercrime.gov.in or call helpline 1930','Wait and hope the money comes back'],
      correct:1, exp:'India\'s National Cyber Crime Reporting Portal (cybercrime.gov.in) and helpline 1930 handle online fraud. Report immediately — fast action can help freeze accounts and recover money.' },
  ],

  init() {
    this.qIdx = 0;
    this.score = 0;
    this.correct = 0;
    this.answered = false;
    clearInterval(this.timerInterval);
    this.renderQuestion();
  },

  renderQuestion() {
    const q = this.QUESTIONS[this.qIdx];
    this.answered = false;
    clearInterval(this.timerInterval);
    this.timeLeft = 30;
    document.getElementById('quiz-num-display').textContent = `${this.qIdx+1}/${this.QUESTIONS.length}`;
    document.getElementById('quiz-score-display').textContent = this.score;

    const container = document.getElementById('hero-content');
    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-progress">
          <div class="quiz-num">${q.cat}</div>
          <div class="quiz-dots">
            ${this.QUESTIONS.map((_,i)=>`<div class="quiz-dot ${i<this.qIdx?'done':i===this.qIdx?'current':''}"></div>`).join('')}
          </div>
        </div>
        <div class="quiz-question-card">
          <div class="quiz-category">${q.cat.toUpperCase()}</div>
          <div class="quiz-question">${q.q}</div>
          <div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-family:var(--font-game);color:var(--text-muted);margin-bottom:4px">
              <span>Time remaining</span><span id="q-timer-lbl">${this.timeLeft}s</span>
            </div>
            <div style="height:4px;background:rgba(0,0,0,0.4);border-radius:2px;overflow:hidden">
              <div id="q-timer-bar" style="height:100%;background:var(--cyan);width:100%;transition:width 1s linear;border-radius:2px"></div>
            </div>
          </div>
          <div class="quiz-options">
            ${q.opts.map((o,i)=>`
              <button class="quiz-option" id="hopt-${i}" onclick="HeroGame.answer(${i})">
                <div class="quiz-option-letter">${'ABCD'[i]}</div>
                ${o}
              </button>`).join('')}
          </div>
          <div class="quiz-explanation" id="h-exp"></div>
          <div id="h-next" style="margin-top:16px;text-align:right;display:none"></div>
        </div>
      </div>`;

    // Start timer
    this.timerInterval = setInterval(()=>{
      this.timeLeft--;
      const lbl=document.getElementById('q-timer-lbl');
      const bar=document.getElementById('q-timer-bar');
      if(lbl) lbl.textContent=this.timeLeft+'s';
      if(bar) bar.style.width=(this.timeLeft/30*100)+'%';
      if(this.timeLeft<=10&&bar) bar.style.background='var(--magenta)';
      if(this.timeLeft<=0){ clearInterval(this.timerInterval); if(!this.answered) this.answer(-1); }
    },1000);
  },

  answer(idx) {
    if(this.answered) return;
    this.answered = true;
    clearInterval(this.timerInterval);
    const q = this.QUESTIONS[this.qIdx];
    const correct = idx === q.correct;

    document.querySelectorAll('[id^="hopt-"]').forEach((b,i)=>{
      b.disabled=true;
      if(i===q.correct) b.classList.add('correct');
      else if(i===idx&&!correct) b.classList.add('wrong');
    });

    if(correct){
      const timeBonus = Math.max(0, this.timeLeft * 2);
      const pts = 100 + timeBonus;
      this.score += pts;
      this.correct++;
      Utils.showToast(`+${pts} points! (includes ${timeBonus} speed bonus)`, 'success');
    } else if(idx===-1){
      Utils.showToast('⏰ Time\'s up!', 'warning');
    } else {
      Utils.showToast('Wrong answer — learn from the explanation!', 'error');
    }

    document.getElementById('quiz-score-display').textContent = this.score;

    // Update dot
    const dots = document.querySelectorAll('.quiz-dot');
    if(dots[this.qIdx]) dots[this.qIdx].className = `quiz-dot ${correct?'done':'wrong-d'}`;

    const exp = document.getElementById('h-exp');
    exp.classList.add('show'); exp.textContent = q.exp;

    const nxt = document.getElementById('h-next');
    nxt.style.display='block';
    const isLast = this.qIdx >= this.QUESTIONS.length-1;
    nxt.innerHTML=`<button class="btn btn-primary" onclick="HeroGame.${isLast?'complete':'nextQ'}()">${isLast?'🏆 See Results!':'Next →'}</button>`;
  },

  nextQ(){ this.qIdx++; this.renderQuestion(); },

  complete() {
    clearInterval(this.timerInterval);
    Rewards.completeModule('hero_hq');
    const pct = Math.round((this.correct/this.QUESTIONS.length)*100);
    const grade = pct>=90?{t:'🦸 CYBERHERO',c:'var(--gold)'}:pct>=70?{t:'⭐ DEFENDER',c:'var(--cyan)'}:pct>=50?{t:'🛡️ GUARDIAN',c:'var(--green)'}:{t:'📚 LEARNER',c:'var(--text-muted)'};
    const container = document.getElementById('hero-content');
    container.innerHTML = `
      <div class="results-screen" style="max-width:600px">
        <span class="results-emoji" style="font-size:6rem">🦸</span>
        <h2 class="results-title gradient-text">CyberHero HQ Complete!</h2>
        <div style="font-family:var(--font-game);font-size:1.4rem;color:${grade.c};margin-bottom:16px">${grade.t}</div>
        <div class="results-stats">
          <div class="results-stat"><span class="results-stat-value text-gold">${this.score}</span><div class="results-stat-label">Final Score</div></div>
          <div class="results-stat"><span class="results-stat-value text-green">${this.correct}/${this.QUESTIONS.length}</span><div class="results-stat-label">Correct</div></div>
          <div class="results-stat"><span class="results-stat-value">+150</span><div class="results-stat-label">XP Earned</div></div>
        </div>
        ${pct>=70?`
        <div style="background:rgba(255,215,0,0.1);border:1px solid var(--gold);border-radius:16px;padding:24px;margin-bottom:24px;text-align:center">
          <div style="font-size:3rem;margin-bottom:8px">🏅</div>
          <div style="font-family:var(--font-game);font-size:1rem;color:var(--gold)">CYBERHERО CERTIFICATE EARNED!</div>
          <div style="color:var(--text-muted);font-size:0.82rem;margin-top:6px">You have demonstrated cybersecurity awareness and are now equipped to protect yourself and others online.</div>
        </div>`:''}
        <div class="story-lesson-box" style="text-align:left;margin-bottom:24px;">
          <div class="lesson-label">🎓 YOUR CYBERSECURITY OATH</div>
          <p>
          🔐 I will use unique, strong passwords for every account<br>
          🎣 I will think before I click on any link or attachment<br>
          📵 I will protect my personal information online<br>
          📶 I will use a VPN on public WiFi networks<br>
          🔔 I will enable 2FA on all important accounts<br>
          📢 I will spread cybersecurity awareness to others
          </p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="closeGame('game-hero');Utils.confetti(200)">🌟 RETURN AS A CYBERHERO</button>
      </div>`;
    Utils.confetti(200);
  }
};
