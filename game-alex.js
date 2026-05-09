// ============================================================
// CyberQuest — Game 1: Alex's Story (Story Simulation)
// ============================================================
const AlexGame = {
  currentPanel: 0,
  panels: [
    {
      scene:'🏫', location:'Central High School — Computer Lab',
      text:`Meet <strong style="color:var(--cyan)">Alex</strong> — a confident 17-year-old student who spends hours online every day. He games, chats, shops, and browses — and he thinks he knows it all.`,
      dialogue:{speaker:'Alex (thinking)',text:'"Cybersecurity? Pfft. That\'s for old people. I\'ve been using the internet since I was 6. Nobody\'s gonna scam ME. I\'m too smart for that."'},
      lesson:null, choices:null,
      next:'Continue →'
    },
    {
      scene:'📱', location:'Alex\'s Phone — WhatsApp',
      text:`One Tuesday afternoon, Alex gets an exciting WhatsApp message from an unknown number. It reads:`,
      dialogue:{speaker:'Unknown Number',text:'"🎉 CONGRATULATIONS! You have been selected as a WINNER in the National Student Lucky Draw! Prize: ₹50,000 + iPhone 15 Pro! Click here to claim NOW before it expires in 10 minutes: bit.ly/cl4im-pr1ze-n0w"'},
      lesson:{label:'⚠️ Red Flag Spotted!',text:'Notice the urgency ("10 minutes"), unknown sender, suspicious link, and too-good-to-be-true prize. These are classic phishing tactics.'},
      choices:[
        {text:'😎 "That\'s obviously fake, I\'ll ignore it."', correct:true,  feedback:'Smart! You recognized the scam. Alex, however, was too excited about the prize...'},
        {text:'🤩 "FREE iPHONE?! Let me click this link RIGHT NOW!"', correct:false, feedback:'This is exactly what Alex did. His excitement overrode his judgment.'},
      ]
    },
    {
      scene:'💻', location:'Alex\'s Bedroom — 11:47 PM',
      text:`Alex clicked the link. A realistic-looking website appeared asking for his "verification details": Name, phone number, email, and <strong style="color:var(--magenta)">school login credentials</strong>.`,
      dialogue:{speaker:'Alex (thinking)',text:'"They just need to verify I\'m a real student. My school login is safe to share, right? I mean, it\'s just for school..."'},
      lesson:{label:'🚨 Critical Mistake!',text:'NEVER share your login credentials with any third-party website. Your school login can expose your records, classmates\' data, and personal information.'},
      choices:[
        {text:'🛑 "Stop! Don\'t enter your school password on random sites!"', correct:true,  feedback:'Absolutely right. Legitimate contests NEVER ask for your passwords.'},
        {text:'✍️ "It\'s fine, fill it in quickly before time runs out!"',        correct:false, feedback:'Alex filled in everything including his password. The clock was ticking...'},
      ]
    },
    {
      scene:'😱', location:'Next Morning — School Library',
      text:`Alex woke up to 47 notifications. His school account had sent <strong style="color:var(--magenta)">spam emails to every student and teacher</strong> in the school. His gaming accounts were emptied. His private photos were leaked in a group chat.`,
      dialogue:{speaker:'School Principal (email)',text:'"Dear Alex, your school account has been used to distribute inappropriate content school-wide. Please report to the office immediately. This is a serious disciplinary matter."'},
      lesson:{label:'💔 The Consequences',text:'One click caused: account takeover, data theft, reputation damage, disciplinary action, and emotional distress. Hackers don\'t look scary — they look like prize notifications.'},
      choices:null, next:'See what Alex does next →'
    },
    {
      scene:'📚', location:'Alex\'s Room — That Night',
      text:`Alex sat in the dark, staring at his phone. He had always thought he was too smart to be scammed. Now he realized: <strong style="color:var(--cyan)">knowledge without awareness is dangerous.</strong> He opened his browser and typed: "How to protect yourself from cyber attacks."`,
      dialogue:{speaker:'Alex (determined)',text:'"I was wrong. I didn\'t know what I didn\'t know. That stops today. I\'m going to learn everything about cybersecurity — and I\'m going to teach others too."'},
      lesson:{label:'🌟 The Turning Point',text:'Alex\'s story is based on real incidents affecting thousands of students every year. Overconfidence is the #1 reason people fall for scams.'},
      choices:null, next:'Begin the Journey →'
    },
    {
      scene:'🦸', location:'CyberCity — Present Day',
      text:`Alex spent months learning. Today, he\'s become a <strong style="color:var(--gold)">Cyber Protector</strong> — someone who not only protects himself but teaches others. Now it\'s YOUR turn. Explore CyberCity, complete the missions, and follow in Alex\'s footsteps.`,
      dialogue:{speaker:'Alex',text:'"Don\'t make the mistake I made. The internet is amazing — but only when you know how to navigate it safely. I\'ll be with you on this journey. Let\'s go!"'},
      lesson:{label:'🎯 Your Mission',text:'Complete all 5 missions in CyberCity to earn the CyberHero badge. Each mission teaches you a real-world skill that will protect you for life.'},
      choices:null, next:'🚀 START MISSION!'
    }
  ],

  init() {
    this.currentPanel = 0;
    const container = document.getElementById('alex-content');
    container.innerHTML = '';

    // Progress dots
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'story-progress';
    dotsWrap.id = 'story-dots';
    this.panels.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'story-dot' + (i===0?' current':'');
      dotsWrap.appendChild(dot);
    });
    container.appendChild(dotsWrap);

    // Panel container
    const wrap = document.createElement('div');
    wrap.className = 'story-container';
    wrap.id = 'story-wrap';
    container.appendChild(wrap);

    this.renderPanel();
  },

  renderPanel() {
    const p = this.panels[this.currentPanel];
    const wrap = document.getElementById('story-wrap');

    // Update dots
    document.querySelectorAll('.story-dot').forEach((d,i)=>{
      d.className = 'story-dot' + (i<this.currentPanel?' done':i===this.currentPanel?' current':'');
    });

    wrap.innerHTML = `
      <div class="story-panel active">
        <div class="story-location">${p.location}</div>
        <div class="story-scene">${p.scene}</div>
        <p class="story-text">${p.text}</p>
        ${p.dialogue ? `
          <div class="story-dialogue">
            <span class="speaker">${p.dialogue.speaker}</span>
            ${p.dialogue.text}
          </div>` : ''}
        ${p.lesson ? `
          <div class="story-lesson-box">
            <div class="lesson-label">${p.lesson.label}</div>
            <p>${p.lesson.text}</p>
          </div>` : ''}
        ${p.choices ? `
          <div class="story-choices" id="story-choices">
            ${p.choices.map((c,i)=>`
              <button class="story-choice" onclick="AlexGame.choose(${i})">${c.text}</button>
            `).join('')}
          </div>
          <div id="choice-feedback" style="display:none;margin-top:16px;padding:14px 18px;border-radius:10px;font-size:0.88rem;line-height:1.6;"></div>
          <div id="next-btn-wrap" style="display:none;margin-top:16px;text-align:right;"></div>
        ` : `
          <div style="text-align:right;margin-top:24px;">
            <button class="btn btn-primary" onclick="AlexGame.next()">${p.next || 'Continue →'}</button>
          </div>
        `}
      </div>`;
  },

  choose(idx) {
    const p = this.panels[this.currentPanel];
    const choice = p.choices[idx];
    const btns = document.querySelectorAll('.story-choice');
    btns.forEach((b,i) => {
      b.disabled = true;
      b.classList.add(p.choices[i].correct ? 'correct' : 'wrong');
    });
    const feedback = document.getElementById('choice-feedback');
    feedback.style.display = 'block';
    feedback.style.background = choice.correct ? 'rgba(57,255,20,0.1)' : 'rgba(255,0,110,0.1)';
    feedback.style.border = `1px solid ${choice.correct ? 'var(--green)' : 'var(--magenta)'}`;
    feedback.style.color = choice.correct ? 'var(--green)' : 'var(--magenta)';
    feedback.textContent = (choice.correct ? '✅ ' : '❌ ') + choice.feedback;
    const nextWrap = document.getElementById('next-btn-wrap');
    nextWrap.style.display = 'block';
    nextWrap.innerHTML = `<button class="btn btn-primary" onclick="AlexGame.next()">Continue →</button>`;
  },

  next() {
    if (this.currentPanel < this.panels.length - 1) {
      this.currentPanel++;
      this.renderPanel();
      document.getElementById('story-wrap').scrollIntoView({behavior:'smooth'});
    } else {
      this.complete();
    }
  },

  complete() {
    Rewards.completeModule('alex_story');
    const wrap = document.getElementById('story-wrap');
    wrap.innerHTML = `
      <div class="results-screen" style="max-width:100%">
        <span class="results-emoji">🦸</span>
        <h2 class="results-title gradient-text">Alex's Story Complete!</h2>
        <p class="results-subtitle">You've witnessed the dangers of overconfidence and learned the signs of a phishing attack.</p>
        <div class="results-stats">
          <div class="results-stat"><span class="results-stat-value text-gold">+50</span><div class="results-stat-label">XP Earned</div></div>
          <div class="results-stat"><span class="results-stat-value">👁️</span><div class="results-stat-label">Awakened Badge</div></div>
          <div class="results-stat"><span class="results-stat-value text-green">6/6</span><div class="results-stat-label">Panels Done</div></div>
        </div>
        <div class="story-lesson-box" style="text-align:left;margin-bottom:24px;">
          <div class="lesson-label">🎓 KEY LESSONS FROM ALEX'S STORY</div>
          <p>• Overconfidence is the #1 cybersecurity risk<br>
          • Urgency + unknown sender = RED FLAG<br>
          • Never share passwords with ANY website<br>
          • Suspicious links can compromise your entire digital life<br>
          • One click can affect hundreds of others</p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="closeGame('game-alex');Utils.confetti()">🌟 BACK TO CYBERCITY</button>
      </div>`;
    Utils.confetti(100);
  }
};
