// ============================================================
// CyberQuest — Game 3: Phishing Lake
// ============================================================
const PhishingGame = {
  current: 0,
  score: 0,
  correct: 0,
  judged: [],

  EMAILS: [
    {
      id:'e1', isPhishing:false,
      sender:'notifications@google.com', from:'Google Security',
      subject:'Your Google Account security checkup reminder',
      time:'10:24 AM',
      preview:'A regular reminder to review your security settings.',
      body:`Hi there,<br><br>We wanted to remind you to complete your monthly security checkup for your Google Account.<br><br>Visit <span class="email-link">myaccount.google.com/security-checkup</span> to review your settings.<br><br>If you didn't request this, you can safely ignore it.<br><br>— The Google Team`,
      clues:'✅ Legitimate: Real Google domain, no urgency, no personal info requested, official link to myaccount.google.com',
      verdict:false
    },
    {
      id:'e2', isPhishing:true,
      sender:'noreply@g00gle-security-alert.net', from:'Google® Security Team',
      subject:'🚨 URGENT: Your account will be DELETED in 24 hours!',
      time:'2:17 AM',
      preview:'Immediate action required or your account will be deleted!',
      body:`Dear Valued Customer,<br><br>⚠️ <strong>CRITICAL SECURITY ALERT</strong> ⚠️<br><br>Our systems detected unauthorized access to your account. Your account will be <strong style="color:red">PERMANENTLY DELETED</strong> in 24 hours unless you verify immediately.<br><br>Click here to SAVE YOUR ACCOUNT NOW:<br><span class="email-link" style="color:var(--magenta)">http://g00gle-verify-account.xyz/secure/login</span><br><br>Do NOT share this link. Act NOW!`,
      clues:'🚨 PHISHING: Misspelled domain (g00gle), .net not google.com, extreme urgency, threats, suspicious .xyz link, sent at 2 AM, poor grammar',
      verdict:true
    },
    {
      id:'e3', isPhishing:true,
      sender:'hr.payroll@nationalbankk.com', from:'National Bank HR',
      subject:'Salary transfer failed - verify bank details',
      time:'11:45 AM',
      preview:'Your salary could not be processed. Update your details.',
      body:`Dear Employee,<br><br>We regret to inform you that your salary transfer for this month has <strong>FAILED</strong> due to outdated bank information in our system.<br><br>To receive your salary, please update your bank account details within 48 hours:<br><br><span class="email-link" style="color:var(--magenta)">http://payroll-update.nationalbankk-verify.com</span><br><br>You will need to provide: Account Number, IFSC Code, Aadhaar Number, and Online Banking Password.<br><br>HR Department`,
      clues:'🚨 PHISHING: Domain typo (bankk), asks for banking password (BANKS NEVER DO THIS), external link not from bank domain, asking for Aadhaar + password = identity theft setup',
      verdict:true
    },
    {
      id:'e4', isPhishing:false,
      sender:'orders@amazon.in', from:'Amazon.in',
      subject:'Your order #408-2947162 has shipped',
      time:'3:52 PM',
      preview:'Great news! Your order is on its way.',
      body:`Hello,<br><br>Great news — your order has shipped!<br><br>Order: Wireless Headphones<br>Estimated delivery: Tomorrow by 8 PM<br>Tracking: <span class="email-link">amzn.to/track/408-2947162</span><br><br>You can view your order at <span class="email-link">amazon.in/your-orders</span><br><br>Thank you for shopping with us!`,
      clues:'✅ Legitimate: Real Amazon.in domain, specific order number, no personal info requested, official tracking link, normal tone',
      verdict:false
    },
    {
      id:'e5', isPhishing:true,
      sender:'winner@luckydraw-2024.win', from:'National Lottery Commission',
      subject:'🎉 YOU WON ₹25,00,000! Claim within 72 hours!',
      time:'4:06 AM',
      preview:'Congratulations! Your number was selected!',
      body:`CONGRATULATIONS!!!<br><br>Your phone number has been SELECTED in the National Digital Lottery 2024!<br><br><strong style="color:gold">PRIZE: ₹25,00,000 (25 LAKH RUPEES)</strong><br><br>To claim your prize:<br>1. Reply with your Full Name, Address, Aadhaar<br>2. Pay ₹500 processing fee to UPI: prizeclaim@paytm<br>3. Collect your prize within 72 hours<br><br>Contact: +91-9876543210<br>This offer expires soon!`,
      clues:'🚨 PHISHING: Classic advance-fee scam. You never entered a lottery. Asking for Aadhaar = identity theft. Paying a "fee" to receive a prize = 100% scam. No legitimate lottery works this way.',
      verdict:true
    },
    {
      id:'e6', isPhishing:false,
      sender:'noreply@udemy.com', from:'Udemy',
      subject:'Your course certificate is ready to download',
      time:'9:12 AM',
      preview:'Congratulations on completing your course!',
      body:`Hi there!<br><br>Congratulations! You've completed <strong>Python for Beginners</strong>.<br><br>Your certificate of completion is ready.<br><br><span class="email-link">View Certificate on Udemy.com</span><br><br>Share your achievement on LinkedIn to impress employers!<br><br>Keep learning,<br>The Udemy Team`,
      clues:'✅ Legitimate: Real Udemy domain, no personal info requested, references a real course action, no urgency or threats',
      verdict:false
    },
    {
      id:'e7', isPhishing:true,
      sender:'support@paytm-kyc-verify.com', from:'Paytm KYC Team',
      subject:'⚠️ Your Paytm wallet will be BLOCKED in 24 hours',
      time:'7:33 PM',
      preview:'Complete your KYC to avoid account suspension.',
      body:`Dear Paytm User,<br><br>Your Paytm account is scheduled to be <strong style="color:red">BLOCKED</strong> due to incomplete KYC verification.<br><br>To avoid blocking, click below and complete your KYC NOW:<br><span class="email-link" style="color:var(--magenta)">http://paytm-kyc-verify.com/complete</span><br><br>You must provide: Aadhaar, PAN Card, Selfie, Bank Account number and OTP received on your phone.<br><br>The Paytm Verification Team`,
      clues:'🚨 PHISHING: Domain is NOT paytm.com. Real KYC is done IN the app. Never share OTP with anyone. Asking for Aadhaar + PAN + OTP = complete identity theft kit.',
      verdict:true
    },
    {
      id:'e8', isPhishing:true,
      sender:'admin@school-update-portal.info', from:'Your School Administration',
      subject:'IMPORTANT: Update your student records immediately',
      time:'1:15 PM',
      preview:'Required: Update your login credentials for new portal.',
      body:`Dear Student,<br><br>We have migrated to a new student management portal. All students must update their credentials to maintain access to grades, attendance and exam results.<br><br>You have 48 hours. Use your CURRENT username and password to login at:<br><br><span class="email-link" style="color:var(--magenta)">http://school-update-portal.info/student-login</span><br><br>Failure to update will result in grade access being revoked.<br><br>IT Department`,
      clues:'🚨 PHISHING: School portals use official school domains (.edu or school website), not generic .info domains. Real migrations never ask for current passwords. Threatening grade access = pressure tactic.',
      verdict:true
    },
  ],

  init() {
    this.current = 0;
    this.score = 0;
    this.correct = 0;
    this.judged = new Array(this.EMAILS.length).fill(null);
    this.render();
  },

  render() {
    const container = document.getElementById('phishing-content');
    container.style.padding = '0';
    container.style.width = '100%';
    container.style.maxWidth = '900px';
    container.innerHTML = `
      <div class="phishing-inbox">
        <div class="inbox-list">
          <div class="inbox-header">📥 INBOX (${this.EMAILS.length} messages)</div>
          ${this.EMAILS.map((e,i)=>`
            <div class="inbox-item ${i===this.current?'active':''} ${this.judged[i]!==null?(this.judged[i]?'judged-fake':'judged-real'):''}" 
                 id="inbox-${i}" onclick="PhishingGame.select(${i})">
              <div class="inbox-sender">${e.from}</div>
              <div class="inbox-preview">${e.subject}</div>
              <div class="inbox-time">${e.time}</div>
            </div>`).join('')}
        </div>
        <div class="email-viewer" id="email-view"></div>
      </div>`;
    this.renderEmail();
    this.updateStats();
  },

  select(idx) {
    this.current = idx;
    document.querySelectorAll('.inbox-item').forEach((el,i)=>el.classList.toggle('active',i===idx));
    this.renderEmail();
  },

  renderEmail() {
    const e = this.EMAILS[this.current];
    const judged = this.judged[this.current];
    const view = document.getElementById('email-view');
    if(!view) return;
    view.innerHTML = `
      <div class="email-meta">
        <div class="email-subject">${e.subject}</div>
        <div class="email-from">From: <span class="email-from-addr">${e.sender}</span></div>
        <div class="email-from" style="margin-top:4px;font-size:0.78rem;color:var(--text-dim)">${e.time} · To: you</div>
      </div>
      <div class="email-body">${e.body}</div>
      ${judged !== null ? `
        <div class="email-verdict ${judged===e.isPhishing?'correct-verdict':'wrong-verdict'} show">
          ${judged===e.isPhishing
            ? `✅ Correct! ${e.isPhishing?'That WAS a phishing email!':'That was a legitimate email!'}`
            : `❌ Wrong! ${e.isPhishing?'That WAS a phishing email — don\'t click!':'That was actually a real email.'}`
          }<br><small style="opacity:0.8;margin-top:6px;display:block">${e.clues}</small>
        </div>` : ''}
      ${judged === null ? `
        <div class="email-actions">
          <span style="font-family:var(--font-game);font-size:0.78rem;color:var(--text-muted);margin-right:auto">Is this email real or phishing?</span>
          <button class="btn btn-secondary" onclick="PhishingGame.judge(false)">✅ Looks Real</button>
          <button class="btn btn-danger"    onclick="PhishingGame.judge(true)">🎣 It's Phishing!</button>
        </div>` : `
        <div class="email-actions">
          <button class="btn btn-primary" onclick="PhishingGame.nextEmail()">Next Email →</button>
        </div>`}`;
  },

  judge(isPhishing) {
    const e = this.EMAILS[this.current];
    const correct = isPhishing === e.isPhishing;
    this.judged[this.current] = isPhishing;
    if(correct){ this.score += 20; this.correct++; Utils.showToast('+20 points! Correct!','success'); }
    else Utils.showToast('Wrong! Read the clues carefully.','warning');
    // Update inbox item style
    const item = document.getElementById(`inbox-${this.current}`);
    if(item) item.className = `inbox-item ${isPhishing?'judged-fake':'judged-real'}`;
    this.updateStats();
    this.renderEmail();
  },

  nextEmail() {
    const nextUnjudged = this.judged.findIndex(j=>j===null);
    if(nextUnjudged >= 0){ this.select(nextUnjudged); }
    else { this.complete(); }
  },

  updateStats() {
    const remaining = this.judged.filter(j=>j===null).length;
    document.getElementById('phish-score').textContent = this.score;
    document.getElementById('phish-correct').textContent = this.correct;
    document.getElementById('phish-remaining').textContent = remaining;
    if(remaining === 0) setTimeout(()=>this.complete(), 500);
  },

  complete() {
    Rewards.completeModule('phishing');
    if(this.correct === this.EMAILS.length) Rewards.awardBadge('perfect_phish');
    const pct = Math.round((this.correct/this.EMAILS.length)*100);
    const grade = pct>=100?'🦅 Eagle Eye!':pct>=80?'🔍 Sharp Detective':pct>=60?'👀 Getting There':'📚 Keep Practicing';
    const container = document.getElementById('phishing-content');
    container.style.padding='32px';
    container.innerHTML = `
      <div class="results-screen">
        <span class="results-emoji">🎣</span>
        <h2 class="results-title gradient-text">Phishing Lake Complete!</h2>
        <p class="results-subtitle">${grade} — ${this.correct}/${this.EMAILS.length} phishing attempts identified correctly</p>
        <div class="results-stats">
          <div class="results-stat"><span class="results-stat-value text-gold">${this.score}</span><div class="results-stat-label">Points</div></div>
          <div class="results-stat"><span class="results-stat-value text-green">${this.correct}/${this.EMAILS.length}</span><div class="results-stat-label">Correct</div></div>
          <div class="results-stat"><span class="results-stat-value">+75</span><div class="results-stat-label">XP Earned</div></div>
        </div>
        <div class="story-lesson-box" style="text-align:left;margin-bottom:24px;">
          <div class="lesson-label">🎓 HOW TO SPOT PHISHING</div>
          <p>
          🔍 Check the sender's email domain carefully<br>
          ⚠️ Urgency + threats = manipulation tactic<br>
          🔗 Hover over links before clicking<br>
          💰 Real contests don't ask for fees to claim prizes<br>
          🔑 Legitimate services NEVER ask for your password via email<br>
          📞 When in doubt — call the company directly
          </p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="closeGame('game-phishing');Utils.confetti()">🏠 BACK TO CYBERCITY</button>
      </div>`;
    Utils.confetti(100);
  }
};
