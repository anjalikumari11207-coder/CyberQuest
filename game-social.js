// ============================================================
// CyberQuest — Game 5: Social Media Shield
// ============================================================
const SocialGame = {
  settings: {
    phone: false, address: false, school: false, birthday: false,
    dob_full: false, location: false, email: false, online: true
  },
  quizIdx: 0,
  score: 0,

  QUIZ: [
    { q:'Your friend posts their new home address on Instagram to celebrate moving in. Is this safe?', correct:1,
      opts:['Yes, friends should know','No! Sharing home addresses publicly invites burglars and stalkers','Only if account is private'],
      exp:'Home addresses should NEVER be posted publicly. Even "private" accounts can be screenshot and shared. Stalkers, burglars, and scammers actively search for this info.' },
    { q:'Someone you\'ve never met sends a friend request with a profile that only has 3 photos, all very attractive. What do you do?', correct:2,
      opts:['Accept — more friends is better!','Accept if they have mutual friends','Decline or investigate — this is likely a fake/catfish profile'],
      exp:'Fake profiles (catfishing) are used for romance scams, data harvesting, and social engineering. Check: old photos, few posts, suspicious mutual friends, asks for money quickly.' },
    { q:'You check in at the airport on Facebook: "Flying to Goa for 2 weeks! 🌴✈️". What risk does this create?', correct:1,
      opts:['None, it\'s exciting to share','Your home is now known to be empty for 2 weeks — burglary risk!','Your flight might get cancelled'],
      exp:'Broadcasting travel plans tells thieves your home is unoccupied. Share travel photos AFTER you return. This also tells scammers your schedule and patterns.' },
    { q:'What personal information is generally SAFE to have public on social media?', correct:0,
      opts:['Your first name and general city','Your phone number and school name','Your birthday, address, and daily schedule'],
      exp:'A first name and general city (not street) is generally safe. Phone number, full birthday, school name, and location enable identity theft, spam, and physical harm.' },
    { q:'Your bio reads: "Alex Kumar, 17 👤 | DPS Rohini 🏫 | Delhi 📍 | DOB: 15 March 2007 🎂 | 9876543XXX 📞". What\'s wrong?', correct:2,
      opts:['Nothing, it\'s complete','Only the phone number is a problem','ALL of it — this is a complete identity theft package!'],
      exp:'This bio contains: full name + age + school + city + exact birthday + phone number. A scammer has everything needed to impersonate you, guess your passwords, or physically locate you.' },
    { q:'A stranger in a Facebook group offers you an amazing paid internship and asks for your Aadhaar and bank details to "process payment." What do you do?', correct:1,
      opts:['Share the details — it\'s a legitimate opportunity!','Refuse and report — this is a job scam harvesting personal data','Ask for more details first then share'],
      exp:'Job scams target students on social media. They collect Aadhaar and bank details for identity fraud. Legitimate employers use official email, interview processes, and never ask for documents via DM.' },
  ],

  PROFILE_FIELDS: [
    { key:'phone',    label:'📞 Phone Number',    value:'98765-43XXX',     risk:'HIGH - Enables spam calls, SIM swapping, and stalking',    safe:false },
    { key:'address',  label:'🏠 Home Address',    value:'B-42, Sector 15, Noida', risk:'CRITICAL - Physical security risk and stalking',     safe:false },
    { key:'school',   label:'🏫 School Name',     value:'Delhi Public School',   risk:'MEDIUM - Can be used for social engineering',          safe:false },
    { key:'birthday', label:'🎂 Birthday',        value:'March 15',        risk:'LOW - General birthday is usually OK',                      safe:true  },
    { key:'dob_full', label:'📅 Full DOB',        value:'15/03/2007',      risk:'HIGH - Used for identity verification and account recovery', safe:false },
    { key:'location', label:'📍 Live Location',   value:'Currently at: Home', risk:'CRITICAL - Real-time tracking enables physical harm',    safe:false },
    { key:'email',    label:'📧 Email Address',   value:'alex@student.com', risk:'MEDIUM - Targets you for phishing campaigns',              safe:false },
    { key:'online',   label:'🟢 Online Status',   value:'Active now',      risk:'LOW - Minor privacy concern',                              safe:true  },
  ],

  init() {
    this.score = 0;
    this.quizIdx = 0;
    Object.keys(this.settings).forEach(k => {
      this.settings[k] = this.PROFILE_FIELDS.find(f=>f.key===k)?.safe || false;
    });
    this.render();
  },

  render() {
    const container = document.getElementById('social-content');
    container.innerHTML = `
      <div class="social-game-wrap">
        <div style="text-align:center;margin-bottom:8px">
          <h2 style="font-family:var(--font-game);color:var(--cyan)">🔒 Social Media Shield</h2>
          <p style="color:var(--text-muted);font-size:0.85rem">Configure your profile privacy settings, then take the quiz</p>
        </div>

        <!-- Profile Card -->
        <div class="social-profile-card">
          <div class="profile-cover"></div>
          <div class="profile-info">
            <div class="profile-avatar">🧑‍💻</div>
            <div class="profile-name">Alex Kumar <span style="color:var(--text-dim);font-size:0.8rem;font-family:var(--font-main)">@alexk_student</span></div>
            <div style="color:var(--text-muted);font-size:0.82rem;margin-top:4px">Toggle each field — decide what should be PUBLIC vs PRIVATE</div>
            
            <div class="profile-fields" id="profile-fields">
              ${this.PROFILE_FIELDS.map(f=>`
                <div class="profile-field" id="pf-${f.key}">
                  <div class="field-label">
                    ${f.label}
                    <span class="field-value">${f.value}</span>
                  </div>
                  <div class="privacy-toggle">
                    <span style="font-size:0.72rem;color:${this.settings[f.key]?'var(--green)':'var(--magenta)'}" id="lbl-${f.key}">${this.settings[f.key]?'PUBLIC':'PRIVATE'}</span>
                    <label class="toggle-switch">
                      <input type="checkbox" id="tog-${f.key}" ${this.settings[f.key]?'checked':''} onchange="SocialGame.toggle('${f.key}')">
                      <div class="toggle-slider"></div>
                    </label>
                  </div>
                </div>`).join('')}
            </div>

            <!-- Privacy Score -->
            <div style="margin-top:16px">
              <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-family:var(--font-game);margin-bottom:6px">
                <span style="color:var(--text-muted)">Privacy Score</span>
                <span id="priv-score-label" style="color:var(--cyan)">Calculating...</span>
              </div>
              <div class="privacy-score-bar">
                <div class="privacy-score-fill" id="priv-score-fill" style="width:0%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Panel -->
        <div id="risk-panel" style="padding:16px;background:rgba(255,0,110,0.06);border:1px solid rgba(255,0,110,0.2);border-radius:12px;font-size:0.82rem;display:none">
          <div style="font-family:var(--font-game);color:var(--magenta);margin-bottom:8px">⚠️ EXPOSED RISKS</div>
          <div id="risk-list"></div>
        </div>

        <button class="btn btn-primary" style="align-self:center" onclick="SocialGame.lockIn()">🔐 Lock In Settings & Start Quiz</button>
      </div>`;
    this.updateScore();
  },

  toggle(key) {
    this.settings[key] = document.getElementById(`tog-${key}`).checked;
    const lbl = document.getElementById(`lbl-${key}`);
    if(lbl){ lbl.textContent = this.settings[key]?'PUBLIC':'PRIVATE'; lbl.style.color = this.settings[key]?'var(--green)':'var(--magenta)'; }
    this.updateScore();
  },

  updateScore() {
    const exposed = this.PROFILE_FIELDS.filter(f=>this.settings[f.key]&&!f.safe);
    const total = this.PROFILE_FIELDS.filter(f=>!f.safe).length;
    const privPct = Math.round(((total - exposed.length)/total)*100);
    const fill = document.getElementById('priv-score-fill');
    const lbl  = document.getElementById('priv-score-label');
    if(fill) fill.style.width = privPct+'%';
    if(lbl){
      lbl.textContent = privPct>=90?'🔒 Excellent':privPct>=70?'👍 Good':privPct>=50?'⚠️ Fair':'🚨 Dangerous';
      lbl.style.color = privPct>=90?'var(--green)':privPct>=70?'var(--cyan)':privPct>=50?'var(--gold)':'var(--magenta)';
    }
    const rp = document.getElementById('risk-panel');
    const rl = document.getElementById('risk-list');
    if(exposed.length>0&&rp&&rl){
      rp.style.display='block';
      rl.innerHTML = exposed.map(f=>`<div style="margin-bottom:6px">⚠️ <strong>${f.label}</strong>: ${f.risk}</div>`).join('');
    } else if(rp) rp.style.display='none';
  },

  lockIn() {
    const exposed = this.PROFILE_FIELDS.filter(f=>this.settings[f.key]&&!f.safe);
    if(exposed.length>2){
      Utils.showToast(`You have ${exposed.length} risky fields exposed! Try to make them private first.`, 'warning');
    }
    const privPct = Math.round(((this.PROFILE_FIELDS.filter(f=>!f.safe).length-exposed.length)/this.PROFILE_FIELDS.filter(f=>!f.safe).length)*100);
    this.score += Math.floor(privPct*0.5);
    this.renderQuiz();
  },

  renderQuiz() {
    const q = this.QUIZ[this.quizIdx];
    const container = document.getElementById('social-content');
    container.innerHTML = `
      <div class="quiz-container">
        <div style="text-align:center;margin-bottom:20px">
          <h2 style="font-family:var(--font-game);color:var(--cyan)">🧠 Social Media Safety Quiz</h2>
          <p style="color:var(--text-muted);font-size:0.82rem">Question ${this.quizIdx+1} of ${this.QUIZ.length}</p>
        </div>
        <div class="quiz-question-card">
          <div class="quiz-category">SOCIAL MEDIA SAFETY</div>
          <div class="quiz-question">${q.q}</div>
          <div class="quiz-options">
            ${q.opts.map((o,i)=>`
              <button class="quiz-option" id="sopt-${i}" onclick="SocialGame.answer(${i})">
                <div class="quiz-option-letter">${'ABCD'[i]}</div>
                ${o}
              </button>`).join('')}
          </div>
          <div class="quiz-explanation" id="sq-exp"></div>
          <div id="sq-next" style="margin-top:16px;text-align:right;display:none"></div>
        </div>
      </div>`;
  },

  answer(idx) {
    const q = this.QUIZ[this.quizIdx];
    document.querySelectorAll('[id^="sopt-"]').forEach((b,i)=>{
      b.disabled=true;
      if(i===q.correct) b.classList.add('correct');
      else if(i===idx&&idx!==q.correct) b.classList.add('wrong');
    });
    const exp=document.getElementById('sq-exp');
    exp.classList.add('show'); exp.textContent=q.exp;
    if(idx===q.correct){ this.score+=30; Utils.showToast('+30 points!','success'); }
    else Utils.showToast('Read the explanation!','warning');
    const nxt=document.getElementById('sq-next');
    nxt.style.display='block';
    nxt.innerHTML=`<button class="btn btn-primary" onclick="SocialGame.${this.quizIdx>=this.QUIZ.length-1?'complete':'nextQ'}()">${this.quizIdx>=this.QUIZ.length-1?'Finish 🏆':'Next →'}</button>`;
  },

  nextQ(){ this.quizIdx++; this.renderQuiz(); },

  complete() {
    Rewards.completeModule('social');
    const container = document.getElementById('social-content');
    container.innerHTML = `
      <div class="results-screen">
        <span class="results-emoji">🔒</span>
        <h2 class="results-title gradient-text">Social Shield Complete!</h2>
        <p class="results-subtitle">You've mastered social media privacy!</p>
        <div class="results-stats">
          <div class="results-stat"><span class="results-stat-value text-gold">${this.score}</span><div class="results-stat-label">Points</div></div>
          <div class="results-stat"><span class="results-stat-value">+75</span><div class="results-stat-label">XP Earned</div></div>
          <div class="results-stat"><span class="results-stat-value text-green">${this.quizIdx+1}/${this.QUIZ.length}</span><div class="results-stat-label">Quiz Done</div></div>
        </div>
        <div class="story-lesson-box" style="text-align:left;margin-bottom:24px;">
          <div class="lesson-label">🎓 SOCIAL MEDIA SAFETY RULES</div>
          <p>
          🔒 Set your profile to PRIVATE on all platforms<br>
          📵 Never share phone number, address, or school publicly<br>
          ✈️ Don't post travel plans until AFTER you return<br>
          👥 Verify friend requests — fake profiles are common<br>
          📧 Don't list email publicly — use DM instead<br>
          📍 Disable location tagging on posts
          </p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="closeGame('game-social');Utils.confetti()">🏠 BACK TO CYBERCITY</button>
      </div>`;
    Utils.confetti(100);
  }
};
