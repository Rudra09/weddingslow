/* Wedding Helper Chatbot — lightweight, no server, no API key.
   Answers common guest questions from the details already on the invitation.
   Loads after the page is idle, uses only transform/opacity animation. */
(function () {
  // ====== EDIT THESE ======
  const CONFIG = {
    coupleNames: 'Abhishek & Priya',
    whatsappNumber: '8094073911',          // e.g. '919876543210' (country code + number, no + or spaces). Leave '' to hide.
          // e.g. '919876543210' (country code + number, no + or spaces). Leave '' to hide.
    phoneNumber: '7014457411',             // e.g. '+919876543210'. Leave '' to hide.
    weddingDate: new Date('November 25, 2026 20:00:00'),
    mapSangeetHaldi: 'https://www.google.com/maps/search/?api=1&query=Vinay+Vaatika+Bhatta+Colony+Hanumangarh+Rajasthan+335512',
    mapWedding: 'https://www.google.com/maps/place/?q=place_id:ChIJL5n6b1DzFjkRBq65AoYZm3I'
  };

  const A = {
    events: {
      text: 'Here is the wedding schedule 🎉\n\n🎵 Sangeet — 7:00 PM, 23 Nov 2026\n💛 Haldi — 3:00 PM, 24 Nov 2026\n💍 Wedding Ceremony — 8:00 PM, 25 Nov 2026',
      links: [['Sangeet & Haldi map', CONFIG.mapSangeetHaldi], ['Wedding venue map', CONFIG.mapWedding]]
    },
    venue: {
      text: 'The wedding ceremony is at GM Resort on 25 November 2026 at 8:00 PM 💍\n\nSangeet and Haldi are at Vinay Vaatika, Bhatta Colony, Hanumangarh, Rajasthan.',
      links: [['Wedding venue map', CONFIG.mapWedding], ['Sangeet & Haldi map', CONFIG.mapSangeetHaldi]]
    },
    family: {
      text: "👑 Groom's side — Garg Family\nFather: Mr. Hardeep Kumar Garg\nMother: Mrs. Meenu Garg\n\n👑 Bride's side — Bansal Family\nFather: Mr. Raj Kumar Bansal\nMother: Mrs. Manju Bansal",
      scroll: '#hosts', scrollLabel: 'See Family & Friends'
    },
    photo: {
      text: 'Try our Royal Photo Booth 📸 — turn on your camera or upload a photo, then snap & download your memory from the wedding!',
      scroll: '#selfie', scrollLabel: 'Open Photo Booth'
    },
    gallery: { text: 'Our precious memories are in the gallery ✨', scroll: '#gallery', scrollLabel: 'Open Gallery' },
    vows: { text: 'Walk through the 7 sacred vows (Saptapadi) with Abhishek & Priya step by step 🔥', scroll: '#seven-pheras', scrollLabel: 'Start Sacred Vows' },
    music: { text: 'Tap the golden "🎵 Play Music" button at the bottom-right corner to play the wedding song 🎶' },
    thanks: { text: 'You are most welcome! 😊 We eagerly await your blessings and gracious presence 🙏' },
    hi: { text: 'Namaste 🙏 I am the wedding helper for ' + CONFIG.coupleNames + '. Ask me about the schedule, venue, family, photo booth, or tap a button below.' }
  };

  function countdownAnswer() {
    const ms = CONFIG.weddingDate - new Date();
    if (ms <= 0) return { text: 'The wedding celebrations have begun! 🎊 Thank you for being part of our special days.' };
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24;
    return { text: '⏳ ' + d + ' days and ' + h + ' hours to go until the wedding ceremony on 25 November 2026!', scroll: '#countdown', scrollLabel: 'See Countdown' };
  }

  function contactAnswer() {
    const links = [];
    if (CONFIG.whatsappNumber) links.push(['Chat on WhatsApp', 'https://wa.me/' + CONFIG.whatsappNumber]);
    if (CONFIG.phoneNumber) links.push(['Call the family', 'tel:' + CONFIG.phoneNumber]);
    return {
      text: links.length ? 'For anything else, please reach the family directly 🙏' : 'For anything else, please contact the family directly. We will be delighted to help 🙏',
      links: links
    };
  }

  // keyword -> answer (English + Hinglish)
  const RULES = [
    [/\b(hi|hello|hey|namaste|namaskar|pranam|good|Jai KahtuShyam Ki (morning|evening))\b/, () => A.hi],
    [/(thank|thanks|shukriya|dhanyavad|dhanyawad)/, () => A.thanks],
    [/(countdown|days left|kitne din|kitna time|how long|how many days|baki)/, countdownAnswer],
    [/(schedule|event|function|program|ceremony|sangeet|haldi|time|kab|kitne baje|timing|date|tarikh|when)/, () => A.events],
    [/(venue|where|location|map|address|kaha|kahan|resort|direction|route|how to reach|pata)/, () => A.venue],
    [/(family|parents|father|mother|groom|bride|garg|bansal|mummy|papa|parivar)/, () => A.family],
    [/(photo|selfie|camera|booth|picture)/, () => A.photo],
    [/(gallery|memories|pictures|album)/, () => A.gallery],
    [/(vow|phera|pheras|saptapadi|varmala|mandap)/, () => A.vows],
    [/(music|song|audio|gana|sound)/, () => A.music],
    [/(contact|call|phone|number|whatsapp|rsvp|help|invite|baat)/, contactAnswer]
  ];

  const CHIPS = [
    ['📅 Schedule', 'schedule'], ['📍 Venue', 'venue'], ['⏳ Countdown', 'countdown'],
    ['👨‍👩‍👧 Family', 'family'], ['📸 Photo booth', 'photo'], ['📞 Contact', 'contact']
  ];

  function reply(q) {
    const s = q.toLowerCase();
    for (const [re, fn] of RULES) if (re.test(s)) return fn();
    return { text: "I'm not sure about that 🙏 Try one of the buttons below, or ask about the schedule, venue, family, countdown or photo booth." };
  }

  // ---------- UI ----------
  function build() {
    const css = document.createElement('style');
    css.textContent = `
#wbot-fab{position:fixed;left:18px;bottom:22px;z-index:9998;width:56px;height:56px;border-radius:50%;border:2px solid #fff;cursor:pointer;
background:linear-gradient(135deg,#d4af37,#ffd700);color:#58181f;font-size:26px;line-height:1;box-shadow:0 6px 18px rgba(88,24,31,.4);
display:flex;align-items:center;justify-content:center;transition:transform .25s ease;will-change:transform}
#wbot-fab:active{transform:scale(.92)}
#wbot-panel{position:fixed;left:18px;bottom:90px;z-index:9998;width:330px;max-width:calc(100vw - 36px);height:430px;max-height:calc(100vh - 130px);
background:#fffdf9;border:1.5px solid #d4af37;border-radius:16px;box-shadow:0 12px 36px rgba(88,24,31,.35);display:flex;flex-direction:column;overflow:hidden;
opacity:0;transform:translateY(14px) scale(.97);pointer-events:none;transition:opacity .22s ease,transform .22s ease;font-family:'Lato',Arial,sans-serif}
#wbot-panel.open{opacity:1;transform:none;pointer-events:auto}
#wbot-head{background:linear-gradient(135deg,#58181f,#7a2630);color:#ffd700;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;font-family:'Playfair Display',serif;font-weight:700;font-size:15px}
#wbot-head button{background:none;border:0;color:#ffd700;font-size:20px;cursor:pointer;line-height:1}
#wbot-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.wbot-m{max-width:86%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
.wbot-bot{background:#f6efe0;color:#3b1d20;align-self:flex-start;border-bottom-left-radius:4px}
.wbot-user{background:#58181f;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.wbot-link{display:inline-block;margin:6px 6px 0 0;padding:6px 11px;border-radius:14px;background:#d4af37;color:#58181f;font-weight:700;font-size:12.5px;text-decoration:none;border:0;cursor:pointer;font-family:inherit}
#wbot-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;max-height:96px;overflow-y:auto;border-top:1px solid #eadfc2}
#wbot-chips button{flex:none;border:1px solid #d4af37;background:#fff;color:#58181f;border-radius:14px;padding:6px 11px;font-size:12.5px;cursor:pointer;font-family:inherit}
#wbot-form{display:flex;gap:6px;padding:8px 10px;border-top:1px solid #eadfc2}
#wbot-input{flex:1;border:1px solid #d9c98f;border-radius:18px;padding:8px 12px;font-size:16px;outline:none;font-family:inherit;min-width:0}
#wbot-send{border:0;border-radius:18px;background:#58181f;color:#ffd700;padding:0 14px;font-weight:700;cursor:pointer;font-family:inherit}
@media (max-width:480px){#wbot-fab{width:50px;height:50px;font-size:23px;bottom:18px;left:14px}#wbot-panel{left:10px;bottom:78px;width:calc(100vw - 20px);max-width:none}}`;
    document.head.appendChild(css);

    const fab = document.createElement('button');
    fab.id = 'wbot-fab'; fab.setAttribute('aria-label', 'Open wedding helper chat'); fab.textContent = '💬';

    const panel = document.createElement('div');
    panel.id = 'wbot-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Wedding helper');
    panel.innerHTML = '<div id="wbot-head"><span>💍 Wedding Helper</span><button type="button" aria-label="Close chat">×</button></div>' +
      '<div id="wbot-msgs"></div><div id="wbot-chips"></div>' +
      '<div id="wbot-form"><input id="wbot-input" type="text" placeholder="Ask about the wedding…" autocomplete="off" aria-label="Your question"><button id="wbot-send" type="button">Send</button></div>';
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    const msgs = panel.querySelector('#wbot-msgs');
    const input = panel.querySelector('#wbot-input');
    const chips = panel.querySelector('#wbot-chips');
    let greeted = false;

    function add(who, text) {
      const d = document.createElement('div');
      d.className = 'wbot-m wbot-' + who;
      d.textContent = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      return d;
    }
    function botSay(ans) {
      const d = add('bot', ans.text);
      (ans.links || []).forEach(([label, href]) => {
        const a = document.createElement('a');
        a.className = 'wbot-link'; a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener';
        d.appendChild(document.createElement('br')); d.appendChild(a);
      });
      if (ans.scroll) {
        const b = document.createElement('button');
        b.className = 'wbot-link'; b.type = 'button'; b.textContent = ans.scrollLabel || 'Go there';
        b.onclick = () => { const el = document.querySelector(ans.scroll); if (el) { el.scrollIntoView({ behavior: 'smooth' }); if (innerWidth < 600) toggle(false); } };
        d.appendChild(document.createElement('br')); d.appendChild(b);
      }
      msgs.scrollTop = msgs.scrollHeight;
    }
    function ask(q) {
      q = q.trim(); if (!q) return;
      add('user', q);
      setTimeout(() => botSay(reply(q)), 250);
    }
    function toggle(open) {
      const willOpen = open === undefined ? !panel.classList.contains('open') : open;
      panel.classList.toggle('open', willOpen);
      fab.textContent = willOpen ? '×' : '💬';
      if (willOpen && !greeted) { greeted = true; botSay(A.hi); }
    }

    CHIPS.forEach(([label, q]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.onclick = () => ask(q); chips.appendChild(b);
    });
    fab.onclick = () => toggle();
    panel.querySelector('#wbot-head button').onclick = () => toggle(false);
    panel.querySelector('#wbot-send').onclick = () => { ask(input.value); input.value = ''; };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { ask(input.value); input.value = ''; } });
  }

  // start only after the page has loaded and the browser is idle
  function start() { (window.requestIdleCallback || (f => setTimeout(f, 800)))(build, { timeout: 3000 }); }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
})();
