/* ==========================================================================
   সনাতন বিদ্যাপীঠ · অ্যাপ কোর
   router · state · screens · interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- utils */
  const BN = '০১২৩৪৫৬৭৮৯';
  const bn = v => String(v).replace(/\d/g, d => BN[+d]);
  const bnN = n => bn(Number(n).toLocaleString('en-US'));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const D = (y, m, d) => new Date(y, m - 1, d);
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let TODAY = new Date();
  let TODAY_KEY = key(TODAY);
  const BN_MONTH = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const BN_DAY = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const BN_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  /* -------------------------------------------------------------- storage */
  const mem = {};
  const store = {
    get(k, d) { try { const r = localStorage.getItem('svp_' + k); return r ? JSON.parse(r) : (k in mem ? mem[k] : d); } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem('svp_' + k, JSON.stringify(v)); } catch (e) { } }
  };

  function seedActivity() {
    const out = {};
    for (let i = 6; i >= 0; i--) { const d = new Date(TODAY); d.setDate(d.getDate() - i); out[key(d)] = [42, 68, 100, 55, 26, 0, 0][6 - i] || 0; }
    return out;
  }

  const S = {
    name: store.get('name', 'সৌরভ চক্রবর্তী'),
    theme: store.get('theme', 'light'),
    bg: store.get('bg', true),
    sound: store.get('sound', false),
    motion: store.get('motion', true),
    font: store.get('font', 17),
    streak: store.get('streak', 11),
    savedReels: store.get('savedReels', {}),
    audioVol: store.get('audioVol', 80),
    reelMute: store.get('reelMute', false),
    rituals: store.get('rituals', {}),
    ritualRewards: store.get('ritualRewards', {}),
    read: store.get('read', {}),
    lastVerse: store.get('lastVerse', { book: 'gita', idx: 2 }),
    bookmarks: store.get('bookmarks', []),
    attempts: store.get('attempts', []),
    lessons: store.get('lessons', { nityakarma: [0, 1, 2] }),
    puja: store.get('puja', {}),
    deva: store.get('deva', {}),
    raised: store.get('raised', {}),
    orders: store.get('orders', []),
    provider: store.get('provider', null),
    activity: store.get('activity', seedActivity()),
    chapters: store.get('chapters', [1, 2, 3, 4]),
    role: store.get('role', 'student'),
    children: store.get('children', [{ n: 'আরাধ্যা', cls: 'শ্রেণি ৫', pct: 45 }, { n: 'ঈশান', cls: 'শ্রেণি ৩', pct: 72 }]),
    userState: store.get('userState', {}),
    appState: store.get('appState', {}),
    reportState: store.get('reportState', {}),
    payoutAppr: store.get('payoutAppr', {}),
    audit: store.get('audit', []),
    japa: store.get('japa', { mantra: 'om-namah', count: 0, rounds: 0 }),
    sessions: store.get('sessions', []),
    asanaDone: store.get('asanaDone', {}),
    daily: store.get('daily', {}),
    script: store.get('script', 'bn'),
    notes: store.get('notes', []),
    socialLikes: store.get('socialLikes', {}),
    chatMsgs: store.get('chatMsgs', {}),
    notifyOn: store.get('notifyOn', false),
    notifiedKey: store.get('notifiedKey', ''),
    festSeen: store.get('festSeen', '')
  };
  const save = k => store.set(k, S[k]);

  /* ------------------------------------------------------------- UI state */
  const U = {
    libQ: '', libCat: 'সব', libSeg: 'books',
    marketQ: '', marketCat: 'সব', gitaQ: '',
    quiz: null, quizTimer: null, adminTab: 'users', adminQ: '',
    sadhanaTab: 'japa',
    med: { mins: 10, left: 600, running: false, phase: '' }, medTimer: null,
    seq: { i: 0, left: 20, running: false }, seqTimer: null,
    panjika: { y: TODAY.getFullYear(), m: TODAY.getMonth() + 1, day: TODAY_KEY, view: 'bn', by: null, bm: null, all: false },
    noteQ: '', noteTag: 'সব', noteCtx: null,
    note: { text: '', tags: [], ctx: null, edit: null },
    sheet: false,
    feedTab: 'posts', chatId: null, chatDraft: ''
  };

  /* --------------------------------------------------------------- icons  */
  const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <!-- ৩ডি মেটালিক স্ট্রোক-গ্রেডিয়েন্ট (আইকনemboss) -->
  <defs>
    <linearGradient id="icoGold" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stop-color="#fdf0cd"/><stop offset="0.42" stop-color="#e6bf74"/>
      <stop offset="0.72" stop-color="#c2953f"/><stop offset="1" stop-color="#8d6420"/>
    </linearGradient>
    <linearGradient id="icoGoldIn" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#fffaf0"/><stop offset="0.5" stop-color="#f0d49a"/><stop offset="1" stop-color="#c79a48"/>
    </linearGradient>
    <radialGradient id="coinGloss" cx="32%" cy="24%" r="78%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
    </radialGradient>
  </defs>
  <!-- ধর্মীয় ধাঁচের আইকন-সেট: প্রতিটি আইকন নিজের বাটনের ভাব অনুসারে -->
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M3.6 20.4h16.8"/><path d="M5.8 20.4V13h12.4v7.4"/><path d="M10.1 20.4v-4.1a1.9 1.9 0 0 1 3.8 0v4.1"/><path d="m7 13 5-4.2 5 4.2"/><path d="m9.1 8.8 2.9-2.4 2.9 2.4"/><path d="M12 6.4V4.2"/><path d="m12 4.2 3 1.2-3 1.2"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M3.8 6.7c2.4-1 4.6-.6 6.5.8v10.8c-1.9-1.4-4.1-1.8-6.5-.8z"/><path d="M20.2 6.7c-2.4-1-4.6-.6-6.5.8v10.8c1.9-1.4 4.1-1.8 6.5-.8z"/><path d="M12 7.5v10.8"/><circle cx="12" cy="10.4" r=".55"/><circle cx="12" cy="15.2" r=".55"/></symbol>
  <symbol id="i-exam" viewBox="0 0 24 24"><path d="M4.3 7.1h15.4a1 1 0 0 1 1 1v9.6a1 1 0 0 1-1 1H4.3a1 1 0 0 1-1-1V8.1a1 1 0 0 1 1-1z"/><path d="M6.6 10.5h6.4"/><path d="M6.6 13.6h4.2"/><path d="m14.3 14.2 1.5 1.5 2.6-2.9"/><path d="M3.3 7.1c1.4-.9 2.7-1.3 4-1.1"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4.2 8.9a3 3 0 0 1 3-3h9.6a3 3 0 0 1 3 3v4.6a3 3 0 0 1-3 3H9.6l-3.8 3v-3a3 3 0 0 1-1.6-2.6z"/><path d="M8.5 5.9C9.4 4.5 10.6 3.8 12 3.8s2.6.7 3.5 2.1"/><circle cx="9.1" cy="11.1" r=".7"/><circle cx="12" cy="11.1" r=".7"/><circle cx="14.9" cy="11.1" r=".7"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M4.7 14.2c0 1.9 1.4 3 3.1 3h8.4c1.7 0 3.1-1.1 3.1-3"/><path d="m4.7 14.2 2.1-3.4M19.3 14.2 17.2 10.8"/><path d="M12 5.6c-.9 1.1-1.4 2-1.4 2.8 0 .9.6 1.5 1.4 2 .8-.5 1.4-1.1 1.4-2 0-.8-.5-1.7-1.4-2.8z"/><path d="M9.1 8.2c.8.2 1.3.7 1.5 1.4M14.9 8.2c-.8.2-1.3.7-1.5 1.4"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="7.6" r="2.7"/><path d="M12 5.2v.7"/><path d="M6.2 19.3c.9-3.2 3.1-4.9 5.8-4.9s4.9 1.7 5.8 4.9"/><path d="M8.3 19.3c1.2.6 2.4.9 3.7.9s2.5-.3 3.7-.9"/></symbol>
  <symbol id="i-flame" viewBox="0 0 24 24"><path d="M5.2 15.4h13.6l-1.7 4.3H6.9z"/><path d="M12 3.3c1.4 1.9 2.1 3.4 2.1 4.7 0 1.6-1.2 2.7-2.1 3.5-.9-.8-2.1-1.9-2.1-3.5 0-1.3.7-2.8 2.1-4.7z"/><path d="M9.4 12.6c.8.6 1.7.9 2.6.9s1.8-.3 2.6-.9"/></symbol>
  <symbol id="i-cal" viewBox="0 0 24 24"><path d="M4.4 6.4h15.2v13.4H4.4z"/><path d="M4.4 10h15.2"/><path d="M7.2 13.2h5.2M7.2 16.4h4.2"/><circle cx="16" cy="14.9" r="1.7"/><path d="M16 12.2v.8M16 16.8v.8M13.3 14.9h.8M17.9 14.9h.8"/></symbol>
  <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.7"/><circle cx="12" cy="12" r="3.3"/><path d="M12 4.3v3.2M12 16.5v3.2M4.3 12h3.2M16.5 12h3.2"/><path d="m6.6 6.6 2.3 2.3M15.1 15.1l2.3 2.3M17.4 6.6l-2.3 2.3M8.9 15.1l-2.3 2.3"/><circle cx="12" cy="12" r=".9"/></symbol>
  <symbol id="i-bag" viewBox="0 0 24 24"><path d="M6.1 9.4h11.8l-1.2 10.4H7.3z"/><path d="M8.7 9.4c0-2.1 1.5-3.6 3.3-3.6s3.3 1.5 3.3 3.6"/><path d="M10.7 9.4v1.9M13.3 9.4v1.9"/><circle cx="12" cy="14.6" r="1.1"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.6" cy="10.6" r="5.7"/><path d="m14.9 14.9 4.2 4.2"/><circle cx="10.6" cy="10.6" r="1.2"/></symbol>
  <symbol id="i-bell" viewBox="0 0 24 24"><path d="M7.3 16.3c.9-1 1.3-2.4 1.3-4.4 0-2.6 1.5-4.5 3.4-4.5s3.4 1.9 3.4 4.5c0 2 .4 3.4 1.3 4.4z"/><path d="M12 7.4V6.1"/><circle cx="12" cy="4.9" r="1"/><path d="M10.6 16.3c0 1 .6 1.7 1.4 1.7s1.4-.7 1.4-1.7"/><path d="M12 18v1.4"/></symbol>
  <symbol id="i-back" viewBox="0 0 24 24"><path d="m14.3 6.3-6 5.5 6 5.5"/><circle cx="16.6" cy="11.8" r=".85"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M7.2 7.2l9.6 9.6M16.8 7.2l-9.6 9.6"/></symbol>
  <symbol id="i-mark" viewBox="0 0 24 24"><path d="M6.7 4.6h10.6v15.1l-5.3-3.7-5.3 3.7z"/><circle cx="12" cy="9.8" r="1"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.1"/><path d="M10.4 8.9l4.6 3.1-4.6 3.1z"/><path d="M12 2.3v1.2M12 20.5v1.2M2.3 12h1.2M20.5 12h1.2"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5.6 12.7 4.3 4.3 8.5-9.1"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4.4 12h14.2"/><path d="m14.5 7.6 4.1 4.4-4.1 4.4"/><path d="M6.4 9.6 8.8 12M6.4 14.4 8.8 12"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.6V12l3 1.9"/><path d="M12 4v1.1M12 18.9V20M4 12h1.1M18.9 12H20"/></symbol>
  <symbol id="i-wallet" viewBox="0 0 24 24"><path d="M4.5 12.4h15c0 4.1-3.3 6.9-7.5 6.9s-7.5-2.8-7.5-6.9z"/><circle cx="12" cy="8.2" r="1.7"/><circle cx="8.4" cy="9.6" r="1.1"/><circle cx="15.6" cy="9.6" r="1.1"/><path d="M6.9 12.4c1.4.8 3.1 1.2 5.1 1.2s3.7-.4 5.1-1.2"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.7"/><circle cx="12" cy="12" r=".8"/><path d="M12 2.9v2.1M12 19v2.1M2.9 12h2.1M19 12h2.1M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5"/></symbol>
  <symbol id="i-setgear" viewBox="0 0 24 24">
    <path d="M10.53 2.56 L13.47 2.56 L13.47 5.10 L15.84 6.09 L17.63 4.29 L19.71 6.37 L17.91 8.16 L18.90 10.53 L21.44 10.53 L21.44 13.47 L18.90 13.47 L17.91 15.84 L19.71 17.63 L17.63 19.71 L15.84 17.91 L13.47 18.90 L13.47 21.44 L10.53 21.44 L10.53 18.90 L8.16 17.91 L6.37 19.71 L4.29 17.63 L6.09 15.84 L5.10 13.47 L2.56 13.47 L2.56 10.53 L5.10 10.53 L6.09 8.16 L4.29 6.37 L6.37 4.29 L8.16 6.09 L10.53 5.10 Z"/>
    <circle cx="12" cy="12" r="3.05"/>
    <circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>
  </symbol>
  <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.9"/><circle cx="12" cy="12" r="2.7"/><path d="M12 5.1v1.9M12 17v1.9M5.1 12h1.9M17 12h1.9"/><path d="m7.4 7.4 1.3 1.3M15.3 15.3l1.3 1.3M16.6 7.4l-1.3 1.3M8.7 15.3l-1.3 1.3"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3.4 19 6v6c0 4.3-3 7.2-7 8.6-4-1.4-7-4.3-7-8.6V6z"/><path d="M12 8.9c-1.2 1.4-1.8 2.4-1.8 3.4 0 1 .8 1.8 1.8 2.4 1-.6 1.8-1.4 1.8-2.4 0-1-.6-2-1.8-3.4z"/></symbol>
  <symbol id="i-trophy" viewBox="0 0 24 24"><path d="M7.2 12.6h9.6c0 3.7-2.1 6-4.8 6s-4.8-2.3-4.8-6z"/><path d="M9.4 12.6c0-1.1 1.1-1.8 2.6-1.8s2.6.7 2.6 1.8"/><circle cx="12" cy="8.1" r="1.4"/><path d="M8.9 11.4c-.4-1.9.1-3.3 1.3-4.2M15.1 11.4c.4-1.9-.1-3.3-1.3-4.2"/><path d="M8.4 7.6c.9-.4 1.8-.4 2.6 0M15.6 7.6c-.9-.4-1.8-.4-2.6 0"/><path d="M7 20.4h10"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5.2v13.6M5.2 12h13.6"/><circle cx="7.1" cy="7.1" r=".62"/><circle cx="16.9" cy="7.1" r=".62"/><circle cx="7.1" cy="16.9" r=".62"/><circle cx="16.9" cy="16.9" r=".62"/></symbol>
  <symbol id="i-om" viewBox="0 0 24 24"><text x="12" y="18.1" text-anchor="middle" font-size="17.5" font-family="Noto Sans Devanagari, Nirmala UI, Mangal, serif" fill="currentColor" stroke="none">ॐ</text></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.2 8.2 0 0 1 9.5 4a8.4 8.4 0 1 0 10.5 10.5z"/><circle cx="17.2" cy="6.6" r=".7"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7.4h16M4 12h10.6M4 16.6h16"/><circle cx="18.4" cy="12" r="1"/></symbol>
  <symbol id="i-pen" viewBox="0 0 24 24"><path d="M18.1 4.7c1.3 2.5.6 5.6-1.6 7.8-1.9 1.9-4.5 2.9-6.8 2.6.3-2.3 1.3-4.9 3.2-6.8 1.9-1.9 4.1-2.4 5.2-3.6z"/><path d="m9.9 15.9-4.6 4.6"/><path d="M14.2 8.2 11.9 10.5M11.9 12.9 9.6 15.2"/></symbol>
  <symbol id="i-video" viewBox="0 0 24 24"><path d="M4.4 6.5h15.2v11H4.4z"/><path d="M9.9 9.7l4.3 2.3-4.3 2.3z"/><path d="M7 9.5v5M17 9.5v5"/></symbol>
  <symbol id="i-send" viewBox="0 0 24 24"><path d="M4 12 20 4.6 15.4 20 12 13.6z"/><path d="m12 13.6 8-9"/><circle cx="6.4" cy="15.6" r=".6"/></symbol>
  <defs><radialGradient id="gGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd79a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd79a" stop-opacity="0"/></radialGradient></defs>
</svg>`;
  /* ---- এআই-জেনারেট ব্র্যান্ড আইকন (মেরুন টাইলে সোনালি প্রতীক) ---- */
  const AI_ICON = {
    home: 'home', book: 'library', chat: 'feed', exam: 'exam', heart: 'seva', user: 'me',
    flame: 'puja', cal: 'panjika', target: 'quiz', bag: 'market',
    om: 'om', gita: 'gita', dan: 'track', lekha: 'notes',
    posts: 'posts', reels: 'reels', chats: 'chats'
  };
  const aiFile = n => `icons/ai/${AI_ICON[n]}-${S.theme === 'light' ? 'light' : 'dark'}.png`;
  const aiIco = (n, cls) => `<img class="aico ${cls || ''}" src="${aiFile(n)}" alt="" aria-hidden="true"/>`;
  const vico = (n, cls) => `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const ico = (n, cls) => (AI_ICON[n] && cls !== 'xs')
    ? aiIco(n, cls)
    : `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  /* দ্রুত-বাটনের বড় স্লট — ব্র্যান্ড আইকন থাকলে সেটিই, নইলে ভেক্টর */
  const qico = n => AI_ICON[n]
    ? `<img class="qai" src="${aiFile(n)}" alt="" aria-hidden="true"/>`
    : `<span class="qi">${ico(n)}</span>`;
  const FLAME = (w, h) => `<svg class="flame" width="${w || 30}" height="${h || 42}" viewBox="0 0 34 46" fill="none" aria-hidden="true">
    <ellipse class="glow" cx="17" cy="16" rx="14" ry="14" fill="url(#gGlow)"/>
    <path class="f2" d="M17 3c4.2 5.6 6.4 9.8 6.4 13.1 0 4-2.9 6.6-6.4 8.5-3.5-1.9-6.4-4.5-6.4-8.5C10.6 12.8 12.8 8.6 17 3Z" fill="#ffb347"/>
    <path class="f1" d="M17 8.6c2.4 3.3 3.6 5.7 3.6 7.6 0 2.3-1.6 3.9-3.6 5-2-1.1-3.6-2.7-3.6-5 0-1.9 1.2-4.3 3.6-7.6Z" fill="#fff3cd"/>
    <path d="M8.6 32h16.8l-2 9.6H10.6L8.6 32Z" fill="#8a5a2a" stroke="#d7a94f" stroke-width=".9"/>
  </svg>`;

  const themeBtn = () => `<button class="iconbtn hbtn hbtn-theme" data-act="toggleTheme" aria-label="${S.theme === 'light' ? 'ডার্ক মোডে যান' : 'লাইট (পাটা) মোডে যান'}" title="${S.theme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড'}">
      ${ico(S.theme === 'light' ? 'moon' : 'sun', 'sm')}</button>`;

  /* হেডারের গিয়ার → সেটিংস পর্দা (লাইট/ডার্ক টগল ওখানেই আছে) */
  const settingsBtn = (cls) => `<button class="iconbtn hbtn hbtn-set ${cls || ''}" data-act="setPopupOpen" aria-label="সেটিংস" title="সেটিংস">${vico('setgear', 'hsetico-v')}</button>`;

  /* সার্চ — পুরো অ্যাপের মধ্যে খোঁজে */
  const searchBtn = (cls) => `<button class="iconbtn hbtn hbtn-search ${cls || ''}" data-act="searchOpen" aria-label="সার্চ" title="সার্চ"><img class="hsearch-ai" src="icons/ai/search-maroon.png" alt="" aria-hidden="true"/></button>`;

  /* বিজ্ঞপ্তি (ঘণ্টা) আপাতত হেডার থেকে সরানো — দরকার হলে bellBtn() আবার যোগ করা যাবে */


  /* ------------------------------------------------------------ feedback  */
  let ac = null, toastT = null;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2100);
  }
  function chime(kind) {
    if (!S.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const now = ac.currentTime;
      const f = kind === 'complete' ? [880, 1320, 1760] : kind === 'soft' ? [660, 990] : [1046, 1568];
      f.forEach((hz, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = hz;
        const t0 = now + i * .045;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(.09 / (i + 1), t0 + .012);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + 1.4);
        o.connect(g); g.connect(ac.destination);
        o.start(t0); o.stop(t0 + 1.5);
      });
      if (kind === 'complete' && navigator.vibrate) navigator.vibrate([12, 40, 18]);
    } catch (e) { }
  }
  function burst(x, y, n = 14) {
    if (!S.motion) return;
    const fx = document.getElementById('fx');
    for (let i = 0; i < n; i++) {
      const sp = document.createElement('span');
      const a = (Math.PI * 2 * i) / n + Math.random() * .4, dist = 42 + Math.random() * 60;
      const size = 4 + Math.random() * 6;
      sp.className = 'spark';
      sp.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;--dx:${(Math.cos(a) * dist).toFixed(1)}px;--dy:${(Math.sin(a) * dist).toFixed(1)}px;animation-delay:${(Math.random() * .1).toFixed(2)}s`;
      fx.appendChild(sp);
      setTimeout(() => sp.remove(), 1200);
    }
  }

  /* -------------------------------------------------------------- panjika */
  const P = DB.panjika;
  const DAY_MS = 86400000;

  /* --- সূর্যোদয়/সূর্যাস্ত ও দিনের মুহূর্ত (ঢাকা: ২৩.৮১° উ, ৯০.৪১° পূ, UTC+৬) --- */
  const GEO = { lat: 23.8103, lon: 90.4125, tz: 6 };
  const RAD = Math.PI / 180;
  function sunTimes(dateKey) {
    const [y, mo, da] = dateKey.split('-').map(Number);
    const a = Math.floor((14 - mo) / 12), y2 = y + 4800 - a, m2 = mo + 12 * a - 3;
    const JDN = da + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
    const n = JDN - 2451545 + 0.0008, Jstar = n - GEO.lon / 360;
    const M = (357.5291 + 0.98560028 * Jstar) % 360;
    const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
    const lam = (M + C + 180 + 102.9372) % 360;
    const Jt = 2451545 + Jstar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lam * RAD);
    const dec = Math.asin(Math.sin(lam * RAD) * Math.sin(23.44 * RAD));
    const cosH = (Math.sin(-0.833 * RAD) - Math.sin(GEO.lat * RAD) * Math.sin(dec)) / (Math.cos(GEO.lat * RAD) * Math.cos(dec));
    const H = Math.acos(Math.max(-1, Math.min(1, cosH))) / RAD;
    const cv = j => { const ms = (j - 2440587.5) * DAY_MS + GEO.tz * 3600000; const d = new Date(ms); return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60; };
    return { rise: cv(Jt - H / 360), set: cv(Jt + H / 360), noon: cv(Jt) };
  }
  const pjHM = m => { m = Math.round(((m % 1440) + 1440) % 1440); return bn(Math.floor(m / 60)) + ':' + bn(String(m % 60).padStart(2, '0')); };
  /* অষ্টভাগ: রাহুকাল · যমগণ্ড · গুলিক (বার অনুসারে), অভিজিৎ ও পারণের কাল */
  function muhurta(dateKey) {
    const t = sunTimes(dateKey), len = t.set - t.rise, part = len / 8;
    const wd = new Date(dateKey + 'T00:00:00').getDay();
    const R = [7, 1, 6, 4, 5, 3, 2][wd], Y = [4, 3, 2, 1, 0, 6, 5][wd], G = [6, 5, 4, 3, 2, 1, 0][wd];
    const sp = i => [t.rise + i * part, t.rise + (i + 1) * part];
    const mid = t.rise + len / 2;
    const r = sp(R), yg = sp(Y), gl = sp(G);
    return {
      sunrise: pjHM(t.rise), sunset: pjHM(t.set), noon: pjHM(t.noon),
      rahu: [pjHM(r[0]), pjHM(r[1])], yama: [pjHM(yg[0]), pjHM(yg[1])], guli: [pjHM(gl[0]), pjHM(gl[1])],
      abhijit: [pjHM(mid - 24), pjHM(mid + 24)],
      parana: [pjHM(t.rise), pjHM(t.rise + len / 4)],
      len
    };
  }
  /* --- তিথি ও নক্ষত্র: সূর্য-চন্দ্রের দ্রাঘিমা থেকে (নিম্ন-নির্ভুল Meeus সিরিজ) --- */
  const norm360 = x => ((x % 360) + 360) % 360;
  function jdLocal(dateKey, hoursLocal) {
    const [y, mo, da] = dateKey.split('-').map(Number);
    const a = Math.floor((14 - mo) / 12), y2 = y + 4800 - a, m2 = mo + 12 * a - 3;
    const JDN = da + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
    return JDN - 0.5 + (hoursLocal - GEO.tz) / 24;
  }
  function sunLon(T) {
    const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * RAD) + 0.019993 * Math.sin(2 * M * RAD) + 0.000289 * Math.sin(3 * M * RAD);
    return norm360(L0 + C);
  }
  function moonLon(T) {
    const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
    const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
    const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
    const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
    const F = norm360(93.272095 + 483202.0175233 * T - 0.0036539 * T * T);
    return norm360(Lp
      + 6.288774 * Math.sin(Mp * RAD) + 1.274027 * Math.sin((2 * D - Mp) * RAD)
      + 0.658314 * Math.sin(2 * D * RAD) + 0.213618 * Math.sin(2 * Mp * RAD)
      - 0.185116 * Math.sin(M * RAD) - 0.114332 * Math.sin(2 * F * RAD)
      + 0.058793 * Math.sin((2 * D - 2 * Mp) * RAD) + 0.057066 * Math.sin((2 * D - M - Mp) * RAD)
      + 0.053322 * Math.sin((2 * D + Mp) * RAD) + 0.045758 * Math.sin((2 * D - M) * RAD)
      - 0.040923 * Math.sin((M - Mp) * RAD) - 0.034720 * Math.sin(D * RAD)
      - 0.030383 * Math.sin((M + Mp) * RAD));
  }
  function tithiIndex(dateKey, hoursLocal) {
    const T = (jdLocal(dateKey, hoursLocal) - 2451545) / 36525;
    return Math.floor(norm360(moonLon(T) - sunLon(T)) / 12) % 30;
  }
  function nakIndex(dateKey, hoursLocal) {
    const T = (jdLocal(dateKey, hoursLocal) - 2451545) / 36525;
    return Math.floor(norm360(moonLon(T)) / (360 / 27)) % 27;
  }
  function panjikaFor(dateKeyStr) {
    const mh = muhurta(dateKeyStr);
    const riseH = sunTimes(dateKeyStr).rise / 60;
    const ti = tithiIndex(dateKeyStr, riseH), ni = nakIndex(dateKeyStr, riseH);
    const shukla = ti < 15;
    const t = shukla ? P.tithi[ti] : P.tithiK[ti - 15];
    const nak = P.nakshatra[ni];
    const fest = P.festivals[dateKeyStr] || '';
    return {
      tithi: `${shukla ? 'শুক্লা' : 'কৃষ্ণ'} ${t}`, nak,
      sunrise: mh.sunrise, sunset: mh.sunset,
      shubho: `${mh.abhijit[0]}–${mh.abhijit[1]}`, rahu: `${mh.rahu[0]}–${mh.rahu[1]}`,
      mh, fest, ekadashi: t === 'একাদশী' || /একাদশী/.test(fest)
    };
  }
  /* ---------------- বাংলা ক্যালেন্ডার (বঙ্গাব্দ · বাংলাদেশ সংশোধিত) ---------------- */
  const BM_NAMES = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
  const BM_LEN = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30]; // ২০১৯ সংশোধিত: বৈশাখ–আশ্বিন ৩১, ফাল্গুন ২৯ (অধিবর্ষে ৩০)
  const BM_SEASON = ['গ্রীষ্ম', 'গ্রীষ্ম', 'বর্ষা', 'বর্ষা', 'শরৎ', 'শরৎ', 'হেমন্ত', 'হেমন্ত', 'শীত', 'শীত', 'বসন্ত', 'বসন্ত'];
  const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const bmLens = startGYear => { const a = BM_LEN.slice(); if (isLeap(startGYear + 1)) a[10] += 1; return a; };

  function bengaliDate(dateObj) {
    const dt = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    let startG = dt.getFullYear();
    if (dt < new Date(startG, 3, 14)) startG -= 1;
    const start = new Date(startG, 3, 14);
    let elapsed = Math.round((dt - start) / DAY_MS);
    const lens = bmLens(startG);
    let m = 0;
    while (m < 11 && elapsed >= lens[m]) { elapsed -= lens[m]; m++; }
    return { year: startG - 593, m, d: elapsed + 1, month: BM_NAMES[m], season: BM_SEASON[m] };
  }
  const bnDateShort = d => `${bn(d.d)} ${d.month} ${bn(d.year)} বঙ্গাব্দ`;

  function banglaMonthCells(y, m) {
    let cur = new Date(y + 593, 3, 14), guard = 0;
    while (guard++ < 420) { const b = bengaliDate(cur); if (b.year === y && b.m === m) break; cur.setDate(cur.getDate() + 1); }
    const cells = [];
    while (guard++ < 840) {
      const b = bengaliDate(cur);
      if (b.year !== y || b.m !== m) break;
      cells.push({ d: b.d, date: new Date(cur) });
      cur.setDate(cur.getDate() + 1);
    }
    return cells;
  }

  function nextFestival() {
    const keys = Object.keys(P.festivals).filter(k => k >= TODAY_KEY).sort();
    if (!keys.length) return null;
    const k = keys[0], d = new Date(k + 'T00:00:00');
    const days = Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
    return { date: d, name: P.festivals[k], days };
  }

  /* ------------------------------------------------- আজকের পালনীয় (v66)
     পঞ্জিকার ব্রত · উৎসব · তিথি · আসন্ন — হোমের হিরো কার্ডের শিরোনাম এখান থেকেই ঘোরে।
     দিনক্ষণ সূর্যোদয়/সূর্যাস্ত থেকে গণনা করা (ঐতিহ্যগত স্থানীয় সময় নয়, তাই লেবেলেও তা বলা)। */
  function todayObservances() {
    const st = sunTimes(TODAY_KEY), mh = muhurta(TODAY_KEY), p = panjikaFor(TODAY_KEY);
    const cl = n => pjHM(Math.round(((n % 1440) + 1440) % 1440));
    const win = (a, b) => `${cl(a)}–${cl(b)}`;
    const abhijit = `${mh.abhijit[0]}–${mh.abhijit[1]}`;
    const out = [];
    const todays = (P.festivals[TODAY_KEY] || '').split('·').map(x => x.trim()).filter(Boolean);

    todays.forEach(name => {
      const isKali = /কালী|লক্ষ্মী|দীপাবলি|অমাবস্যা/.test(name);
      const isPuja = /পূজা|আরাধনা|আরতি|যাত্রা/.test(name);
      const isVrat = /ব্রত|ষষ্ঠী|নবমী|চতুর্থী|একাদশী|দ্বাদশী|চতুর্দশী|অষ্টমী|পূর্ণিমা/.test(name);
      out.push({
        kind: isVrat && !isPuja ? 'ব্রত' : isPuja ? 'পূজা' : 'উৎসব',
        name, tag: 'আজ',
        note: isKali ? 'সন্ধ্যা-নিশীথে প্রদীপ, মায়ের আরাধনা ও আরতি'
          : isVrat ? 'সংকল্প নিয়ে নিরাহার বা ফলাহারে পালন, সন্ধ্যায় আরতি'
          : isPuja ? 'বিধি অনুসারে পূজা, মন্ত্র ও আরতি'
          : 'পঞ্জিকা অনুসারে আজকের পালনীয়',
        whenLab: isKali ? 'নিশীথ কাল' : isPuja ? 'সন্ধ্যাকালীন পূজা' : 'শুভ সময় (অভিজিৎ)',
        when: isKali ? win(st.noon + 696, st.noon + 744) : isPuja ? win(st.set - 48, st.set + 36) : abhijit
      });
    });

    /* তিথি-ভিত্তিক ব্রত (নামে আগে না থাকলে) */
    const tt = (p.tithi.split(' ')[1] || '').trim();
    const TV = {
      'একাদশী': ['ব্রত', 'একাদশী ব্রত', 'নিরাহার, বিষ্ণুস্মরণ ও দান', 'পারণ কাল', `${mh.parana[0]}–${mh.parana[1]}`],
      'পূর্ণিমা': ['ব্রত', 'পূর্ণিমা ব্রত', 'সন্ধ্যায় চন্দ্রদর্শন ও দীপদান', 'সন্ধ্যাকাল', win(st.set - 20, st.set + 70)],
      'অমাবস্যা': ['তিথি', 'অমাবস্যা তিথি', 'পিতৃতর্পণ ও প্রদীপদান', 'সন্ধ্যাকাল', win(st.set - 30, st.set + 30)],
      'চতুর্থী': ['ব্রত', 'বিনায়ক চতুর্থী', 'গণেশ আরাধনা, চন্দ্রদর্শন বর্জন', 'মধ্যাহ্ন পূজা', abhijit],
      'দ্বাদশী': ['তিথি', 'দ্বাদশী তিথি', 'হরিবাসরের পারণ ও পুণ্যস্নান', 'পারণ কাল', `${mh.parana[0]}–${mh.parana[1]}`],
      'ষষ্ঠী': ['ব্রত', 'ষষ্ঠী ব্রত', 'সন্তান ও পরিবারের মঙ্গল-কামনা', 'সন্ধ্যাকাল', win(st.set - 20, st.set + 40)]
    }[tt];
    if (TV && !todays.some(n => n.includes(tt))) {
      out.push({ kind: TV[0], name: TV[1], tag: 'আজ', note: TV[2], whenLab: TV[3], when: TV[4] });
    }

    /* The same bundled panjika data, covering today and the next seven days.
       Every entry on a date is included instead of silently dropping all but the first. */
    const dateLabel = d => `${BN_DAY[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())}`;
    out.forEach(o => { o.dateLabel = dateLabel(TODAY); });
    for (let days = 1; days <= 7; days++) {
      const d = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + days);
      const k = key(d);
      const names = (P.festivals[k] || '').split('·').map(x => x.trim()).filter(Boolean);
      if (!names.length) continue;
      const pk = panjikaFor(k);
      names.forEach(name => out.push({
        kind: /ব্রত|ষষ্ঠী|নবমী|একাদশী|পূর্ণিমা|চতুর্দশী/.test(name) ? 'ব্রত' : 'উৎসব',
        name, tag: `${bn(days)} দিন বাকি`,
        dateLabel: dateLabel(d), note: `তিথি: ${pk.tithi}`,
        whenLab: 'শুভ সময় (অভিজিৎ)', when: `${pk.mh.abhijit[0]}–${pk.mh.abhijit[1]}`
      }));
    }
    if (!out.length) {
      const known = Object.keys(P.festivals).sort();
      const covered = known.length && TODAY_KEY >= known[0] && TODAY_KEY <= known[known.length - 1];
      out.push({ kind: 'পঞ্জিকা', name: covered ? 'আগামী ৭ দিনে কোনো উৎসব তালিকাভুক্ত নেই' : 'এই সময়ের উৎসবের তথ্য যোগ করা হয়নি',
        tag: 'আগামী ৭ দিন', dateLabel: dateLabel(TODAY),
        note: covered ? 'বিস্তারিত জানতে পঞ্জিকা দেখুন' : 'নতুন পঞ্জিকা তথ্য প্রয়োজন',
        whenLab: 'আজকের শুভ সময় (অভিজিৎ)', when: abhijit });
    }
    return out;
  }

  /* ---------------------------------------------------------------- header */
  function appbar(title, subText, backTo, withTheme, subBelow) {
    return `<header class="appbar"><div class="row">
      ${backTo ? `<button class="iconbtn" data-act="nav" data-to="${backTo}" aria-label="ফিরে যান">${ico('back')}</button>` : ''}
      <div style="flex:1;min-width:0">
        ${subText && !subBelow ? `<div class="eyebrow">${subText}</div>` : ''}
        <h3>${title}</h3>
        ${subText && subBelow ? `<div class="sub">${subText}</div>` : ''}
      </div>
      ${withTheme ? settingsBtn() : ''}</div></header>`;
  }

  /* =====================================================================
     SCREENS
     ===================================================================== */

  /* ------------------------------------------------------------ 1. home */
  function homeScreen() {
    const p = panjikaFor(TODAY_KEY);
    const r = S.rituals[TODAY_KEY] || [false, false, false];
    const doneCount = r.filter(Boolean).length;
    const lv = S.lastVerse, book = DB.books.find(b => b.id === lv.book) || DB.books[0];
    const verseIndex = Math.max(0, Math.min(Number(lv.idx) || 0, book.texts.length - 1));
    const verse = book.texts[verseIndex] || book.texts[0];
    const fest = nextFestival();
    const camp = DB.campaigns[0];
    const raised = camp.raised + (S.raised[camp.id] || 0);
    const pct = Math.min(100, Math.round(raised / camp.goal * 100));
    const obs = todayObservances();
    const bd = bengaliDate(TODAY);
    const CHS = (typeof GITA_CHAPTERS !== 'undefined' && Array.isArray(GITA_CHAPTERS)) ? GITA_CHAPTERS : [];
    const chapInfo = CHS.find(c => c.n === verse.ch) || null;
    const chapName = book.id === 'gita' && chapInfo ? chapInfo.name : '';
    const chapSum = book.id === 'gita' && chapInfo ? chapInfo.sum : '';

    return `
    <div class="ref-home">
      <header class="ref-head">
        <button class="ref-emblem" data-act="nav" data-to="#/home" aria-label="মন্দির">ॐ</button>
        <div class="ref-brand">সনাতন বিদ্যাপীঠ</div>
        ${searchBtn()} ${settingsBtn()}
      </header>
      <div class="ref-home-search" role="search">
        <div class="ref-home-search-field">
          <img src="icons/reference/search-gold.svg" alt="" aria-hidden="true"/>
          <input id="homeSearch" type="search" autocomplete="off" placeholder="খুঁজুন বা তারিখ লিখুন…" aria-label="অ্যাপে খুঁজুন" aria-controls="homeSearchResults" aria-expanded="false"/>
          <button type="button" class="ref-search-clear" data-act="homeSearchClear" aria-label="অনুসন্ধান মুছুন" hidden>×</button>
          <button type="button" class="ref-search-voice" data-act="homeVoiceSearch" aria-label="ভয়েস দিয়ে খুঁজুন" aria-pressed="false" title="ভয়েস দিয়ে খুঁজুন"><img src="icons/reference/voice-gold.svg" alt="" aria-hidden="true"/></button>
        </div>
        <div class="ref-search-voice-status" id="homeVoiceStatus" role="status" aria-live="polite" hidden></div>
        <div id="homeSearchResults" class="ref-home-search-results search-res" aria-label="অনুসন্ধানের ফলাফল" hidden></div>
      </div>
      <div class="ref-today-dates" aria-label="আজকের ইংরেজি ও বাংলা তারিখ">
        <span class="ref-today-gregorian">${BN_DAY[TODAY.getDay()]}, ${bn(TODAY.getDate())} ${BN_MONTH[TODAY.getMonth()]} ${bn(TODAY.getFullYear())} ইং</span>
        <span class="ref-today-bangla">${bn(bd.d)} ${bd.month} ${bn(bd.year)} বঙ্গাব্দ</span>
      </div>
      <div class="ref-calendar" aria-label="আজকের পঞ্জিকা ও উৎসব">
        <div class="ref-rot" id="heroRot" aria-live="off">
          ${obs.map((o,i) => `<section class="hx-item${i === 0 ? ' on' : ''}" aria-hidden="${i === 0 ? 'false' : 'true'}">
            <div class="ref-event-copy ref-event-head"><strong class="ref-writing-title" aria-label="${esc(o.name)}"><span class="ref-writing-ink" aria-hidden="true">${esc(o.name)}</span><img class="ref-writing-feather" src="icons/reference/writing-feather.svg" alt="" aria-hidden="true"/></strong></div>
            <div class="ref-cal-main">
              <div class="ref-event"><img class="ref-event-art" src="icons/reference/${o.kind === 'ব্রত' ? 'event-vrata' : o.kind === 'উৎসব' ? 'event-festival' : 'calendar-date'}-3d.png" alt="" aria-hidden="true"/><div class="ref-event-tags"><span>${esc(o.kind)}</span><span>${esc(o.tag)}</span></div></div>
              <div class="ref-cal-note"><div class="ref-time"><img class="ref-inline-icon ref-time-icon" src="icons/reference/calendar-time-3d.png" alt="" aria-hidden="true"/> <span><b>${esc(o.whenLab)}</b><br><span class="ref-hours">${esc(o.when)}</span></span></div><div class="ref-event-note"><b>${esc(o.dateLabel || '')}</b><span>${esc(o.note)}</span></div></div>
            </div>
            <div class="ref-cal-side"><button class="ref-calendar-go" data-act="nav" data-to="#/panjika">পঞ্জিকা <span>→</span></button><div class="ref-calendar-facts"><small>আজকের পঞ্জিকা</small><div class="ref-fact"><img src="icons/reference/calendar-moon-3d.png" alt="" aria-hidden="true"/><span><em>তিথি:</em> <b>${p.tithi}</b></span></div><div class="ref-fact"><img src="icons/reference/calendar-stars-3d.png" alt="" aria-hidden="true"/><span><em>নক্ষত্র:</em> <b>${p.nak}</b></span></div><div class="ref-sun-times"><div class="ref-fact ref-sun-fact"><img src="icons/reference/calendar-sunrise.svg" alt="" aria-hidden="true"/><span><em>সূর্যোদয়</em><b>${p.sunrise}</b></span></div><div class="ref-fact ref-sun-fact"><img src="icons/reference/calendar-sunset.svg" alt="" aria-hidden="true"/><span><em>সূর্যাস্ত</em><b>${p.sunset}</b></span></div><small>ঢাকা · ২৪ ঘণ্টা</small></div></div></div>
          </section>`).join('')}
        </div>
      </div>
      <div class="ref-small-cards">
        <button class="ref-sadhana" data-act="dailyTasksOpen" aria-label="আজকের সাধনা: ${bn(doneCount)}টি কাজ সম্পন্ন, ৩টির মধ্যে। কাজের তালিকা দেখুন">
          <span class="ref-card-inner">
            <span class="ref-sadhana-title">আজকের সাধনা</span>
            <span class="ref-sadhana-summary">${bn(doneCount)}টি কাজ সম্পন্ন</span>
            <span class="ref-card-art-row"><img class="ref-sadhana-sage" src="icons/reference/cal-sage.png" alt="" aria-hidden="true"/>
              <span class="ref-progress-medallion"><img src="icons/reference/card-ring-layer.png" alt="" aria-hidden="true"/><b>${bn(doneCount)}/৩</b></span></span>
          </span>
        </button>
        <button class="ref-reading" data-act="nav" data-to="#/reader/${book.id}/${verseIndex}" aria-label="${esc(book.title)} ${bn(verse.ch)}.${bn(verse.v)} পাঠ করুন">
          <span class="ref-card-inner">
            <span class="ref-reading-title">আজকের শাস্ত্র পাঠ</span>
            <span class="ref-reading-book">${esc(book.title)} <b>${bn(verse.ch)}.${bn(verse.v)}</b></span>
            <span class="ref-reading-chapter">${chapName ? `অধ্যায় ${bn(verse.ch)} · ${esc(chapName)}` : `অধ্যায় ${bn(verse.ch)}`}</span>
            <span class="ref-card-art-row"><img class="ref-reading-feather" src="icons/reference/card-feather-layer.png" alt="" aria-hidden="true"/><span class="ref-reading-go">পাঠ →</span></span>
          </span>
        </button>
      </div>
      <div class="ref-grid">
        ${[['puja','পূজা','#/puja'],['panjika','পঞ্জিকা','#/panjika'],['quiz','কুইজ','#/exam'],['market','কাজ','#/market'],['sadhana','সাধনা','#/sadhana'],['gita','গীতা','#/gita'],['track','হিসাব','#/track'],['notes','নোট','#/notes']].map(([img, label, to]) => `<button data-act="nav" data-to="${to}"><span class="ref-menu-art"><img class="ref-menu-pedestal" src="icons/reference/menu/${img}-pedestal.png" alt=""/><img class="ref-menu-object" src="icons/reference/menu/${img}-icon.png" alt=""/></span><span class="ref-menu-label">${label}</span></button>`).join('')}
      </div>
      <div class="ref-plaque">✿ &nbsp; সনাতন ঐতিহ্য · নীতি · হিসাব · নোট &nbsp; ✿</div>
    </div>

    <div class="pad">
      <div class="sect" style="margin-top:6px"><h4>রিলস</h4><div class="line"></div>
        <button class="act" data-act="nav" data-to="#/reels">সব ›</button></div>
      ${(() => {
        const rl = bpOrdered();
        if (!rl.length) return '';
        const day = Math.floor(new Date(TODAY_KEY + 'T00:00:00') / DAY_MS);
        const show = [];
        for (let k = 0; k < 10 && k < rl.length; k++) show.push(reelAt(rl, (day * 7 + k * 37) % rl.length));
        return `<div class="reelrail">${show.map(r => bpReelCard(r)).join('')}</div>
        <div class="mini muted" style="margin:-2px 0 2px">হিন্দু ধর্মীয় ও ভক্তিমূলক চ্যানেলের ${bn(rl.length)}+ রিলস · প্রতিদিন নতুন বাছাই — অ্যাপের ভেতরেই</div>`;
      })()}

      <div class="sect"><h4>সাধনা</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/sadhana">সব ›</button></div>
      <div class="grid3">
        <div class="card pad" data-act="nav" data-to="#/sadhana/japa" role="button" tabindex="0" style="text-align:center;padding:12px 8px;cursor:pointer">
          <div style="color:var(--gold-300);display:grid;place-items:center">${ico('om')}</div>
          <div class="mini" style="margin-top:7px">জপ</div>
          <b style="font-size:12px">${bn(S.japa.count)}/১০৮</b></div>
        <div class="card pad" data-act="nav" data-to="#/sadhana/dhyana" role="button" tabindex="0" style="text-align:center;padding:12px 8px;cursor:pointer">
          <div style="color:var(--gold-300);display:grid;place-items:center">${ico('clock')}</div>
          <div class="mini" style="margin-top:7px">ধ্যান</div>
          <b style="font-size:12px">${bn(S.sessions.length ? S.sessions[S.sessions.length - 1].mins : 0)} মিনিট</b></div>
        <div class="card pad" data-act="nav" data-to="#/sadhana/yoga" role="button" tabindex="0" style="text-align:center;padding:12px 8px;cursor:pointer">
          <div style="color:var(--gold-300);display:grid;place-items:center">${ico('heart')}</div>
          <div class="mini" style="margin-top:7px">যোগা</div>
          <b style="font-size:12px">${bn(Object.keys(S.asanaDone).filter(k => S.asanaDone[k]).length)}/${bn(DB.asanas.length)}</b></div>
      </div>

      <div class="sect"><h4>চলমান পাঠ</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/library">সব ›</button></div>
      <div class="card rowcard oath" data-act="nav" data-to="#/reader/${book.id}/${verseIndex}" role="button" tabindex="0" style="cursor:pointer">
        <div class="cover ${book.cls}"><span class="sym">${book.sym}</span></div>
        <div style="flex:1;min-width:0">
          <div class="kv"><span class="ttl">${book.title}</span><span class="pill">${bn(verse.ch)}.${bn(verse.v)}</span></div>
          <div class="mini muted" style="margin:4px 0 9px">${esc(verse.sk.split('\n')[0].slice(0, 34))}…</div>
          <div class="bar thin"><i style="width:${Math.round((lv.idx + 1) / book.texts.length * 100)}%"></i></div>
          <div class="mini muted" style="margin-top:6px">${bn(lv.idx + 1)}/${bn(book.texts.length)} শ্লোক · ৩ মিনিট বাকি</div>
        </div>
      </div>

      <button class="btn ghost block mt" data-act="openNotes" style="justify-content:space-between">
        <span>${ico('pen', 'sm')} আমার নোট</span><span class="tiny muted">${bn(S.notes.length)} ›</span></button>

      <div class="sect"><h4>আজকের সাধনা</h4><div class="line"></div><span class="mini muted">${bn(doneCount)}/৩</span></div>
      <div class="card pad" style="padding:4px 14px">
        ${['সকালের নিত্যকর্ম সম্পন্ন', `গীতা ${bn(2)}.${bn(47)} পাঠ`, 'সন্ধ্যা আরতি ও কুইজ'].map((label, i) => `
          <div class="ritual ${r[i] ? 'done' : ''}" data-act="ritual" data-i="${i}" role="checkbox" aria-checked="${!!r[i]}" tabindex="0">
            <span class="tick">${ico('check', 'xs')}</span>
            <span class="lab">${label}</span>
            <span class="xp">${r[i] ? '✓' : ['+১০', '+২০', '+৩০'][i]}</span>
          </div>`).join('')}
      </div>

      <div class="sect"><h4>এখনই করার সময়</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/puja">শুরু ›</button></div>
      <div class="card oath rowcard" data-act="nav" data-to="#/puja/sandhya" style="cursor:pointer;gap:14px">
        ${FLAME(34, 46)}
        <div style="flex:1">
          <div class="kv"><span class="ttl">সন্ধ্যা আরতি</span><span class="pill">${p.sunset} সূর্যাস্ত</span></div>
          <div class="mini muted" style="margin-top:5px">প্রদীপ ও ধূপ প্রস্তুত করুন · ${bn(7)} ধাপ</div>
        </div>
        ${ico('arrow', 'sm')}
      </div>

      ${fest ? `
      <div class="sect"><h4>আসন্ন উৎসব</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/panjika">পঞ্জিকা ›</button></div>
      <div class="card rowcard">
        <div class="datebox"><b>${bn(fest.date.getDate())}</b><i>${BN_MONTH[fest.date.getMonth()].slice(0, 4)}</i></div>
        <div style="flex:1">
          <div class="kv"><span class="ttl">${esc(fest.name)}</span><span class="pill">${fest.days === 0 ? 'আজ' : bn(fest.days) + ' দিন'}</span></div>
          <div class="mini muted" style="margin-top:5px">${panjikaFor(key(fest.date)).tithi} · শুভ সময় ${panjikaFor(key(fest.date)).shubho}</div>
        </div>
      </div>` : ''}
    </div>

    <div class="sevaband" data-act="nav" data-to="#/seva" style="cursor:pointer">
      ${vico('heart')}
      <div style="flex:1"><h5>${esc(camp.title)}</h5><p>${esc(camp.sh || camp.blurb)}</p></div>
      <span class="pill ok">${bn(pct)}%</span>
    </div>
    <div style="height:24px"></div>`;
  }

  /* --------------------------------------------------------- 2. library */
  function bookCards() {
    const q = U.libQ.trim().toLowerCase();
    const list = DB.books.filter(b => {
      const okCat = U.libCat === 'সব' || b.tag === U.libCat;
      const okQ = !q || (b.title + b.author + b.desc).toLowerCase().includes(q);
      return okCat && okQ;
    });
    if (!list.length) return `<div class="card empty"><div class="illu">${ico('book')}</div><h5>কিছু পাওয়া যায়নি</h5><p>অন্য শব্দ বা বিভাগ দিয়ে খুঁজুন।</p></div>`;
    return list.map(b => {
      const lv = S.lastVerse.book === b.id ? S.lastVerse.idx : 0;
      const pct = Math.round((lv + 1) / b.texts.length * 100);
      return `<div class="card book" data-act="nav" data-to="${b.chapterMeta ? '#/gita' : '#/book/' + b.id}" role="button" tabindex="0">
        <div class="cover ${b.cls}"><span class="sym">${b.sym}</span></div>
        <div style="flex:1;min-width:0">
          <div class="kv"><span class="ttl">${esc(b.title)}</span><span class="pill ${b.tag === 'নতুন' ? 'ok' : 'flat'}">${b.tag}</span></div>
          <div class="mini muted" style="margin:4px 0 8px">${bn(b.chapters)} অধ্যায় · ${bn(b.verses)} শ্লোক${b.audio ? ' · অডিও' : ''}</div>
          <div class="bar thin"><i style="width:${pct}%"></i></div>
          <div class="kv" style="margin-top:7px"><span class="mini muted">${bn(pct)}% পড়া হয়েছে</span><span class="mini muted">${b.texts.length} শ্লোক এই ডেমোতে</span></div>
        </div></div>`;
    }).join('');
  }

  /* ============ গ্লোবাল অডিও প্লেয়ার (YouTube IFrame API) ============
     প্লেয়ার একবারই তৈরি হয় ও পর্দার বাইরে থাকে; পাতা বদলালেও গান চলতে থাকে। */
  const AP = { player: null, api: false, ready: false, pending: null, timer: null, id: null, dur: 0, rate: 1 };
  /* দুই উৎস: গীতা (সংখ্যাযুক্ত অধ্যায়) ও কথা-কীর্তন-ভাগবত (চ্যানেল-নামসহ) */
  const bhaktiAudio = () => DB.bhaktiAudio || [];
  const apItem = id => (DB.gitaAudio || []).find(x => x.id === id) || bhaktiAudio().find(x => x.id === id) || null;
  const isBhaktiIt = it => !!it && typeof it.ch !== 'number';
  const apListOf = it => isBhaktiIt(it) ? bhaktiAudio() : (DB.gitaAudio || []);
  const apHeadOf = it => isBhaktiIt(it)
    ? ((it.cat || 'কথা') + ' · ' + (it.ch || 'রিলস'))
    : ((it.ch === 0 ? 'উপসংহার' : (typeof BN_CH !== 'undefined' ? BN_CH[it.ch] : '') + ' অধ্যায়') + ' · যথার্থ গীতা');
  function apLoadApi() {
    /* হ্যান্ডলার সবসময় বসিয়ে রাখি — স্ক্রিপ্ট আগে থেকেই থাকলেও API প্রস্তুত হলে ডাক পাব */
    window.onYouTubeIframeAPIReady = () => {
      AP.api = true;
      if (AP.pending) { const p = AP.pending; AP.pending = null; apStart(p); }
    };
    if (AP.api) return;
    if (document.getElementById('ytApiScript')) return;
    const sc = document.createElement('script');
    sc.id = 'ytApiScript'; sc.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(sc);
  }
  function apStart(id) {
    const item = apItem(id);
    AP.id = id; AP.dur = 0;
    /* স্ক্রিনের কার্ড/তালিকা যেন সবসময় চলতি অডিওটাই দেখায় */
    U.audioId = id;
    if (item) U.audioSrc = isBhaktiIt(item) ? 'bhakti' : 'gita';
    apLoadApi();
    if (!AP.api) {
      AP.pending = id;
      apRender();
      toast('অডিও প্লেয়ার তৈরি হচ্ছে…');
      setTimeout(() => {
        if (!AP.api && AP.id === id) toast('প্লেয়ার লোড হয়নি — ইন্টারনেট দেখুন বা “ইউটিউবে ↗” চাপুন');
      }, 6000);
      return;
    }
    if (AP.player && AP.player.loadVideoById) { AP.player.loadVideoById(id); apRender(); apTick(); return; }
    let host = document.getElementById('ytHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'ytHost';
      host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
      document.body.appendChild(host);
    }
    host.innerHTML = '<div id="ytFrame"></div>';
    try {
      AP.player = new window.YT.Player('ytFrame', {
        videoId: id,
        playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            AP.ready = true;
            try {
              AP.player.setVolume(S.audioVol == null ? 80 : S.audioVol);
              if (AP.player.unMute) AP.player.unMute();
              if (AP.player.setPlaybackRate && (AP.rate || 1) !== 1) AP.player.setPlaybackRate(AP.rate);
            } catch (e) {}
            if (item) toast('অডিও চালু: ' + item.name);
            apRender(); apTick();
          },
          onStateChange: () => apRender(),
          onError: () => toast('এই অডিওটি চালানো যাচ্ছে না — ইন্টারনেট দেখুন')
        }
      });
    } catch (e) { toast('প্লেয়ার তৈরি করা গেল না'); }
    apRender(); apTick();
  }
  function apFillPct(el, pct) {
    if (el && el.style) el.style.setProperty('--p', Math.max(0, Math.min(100, +pct || 0)) + '%');
  }
  const AP_RATES = [1, 1.25, 1.5, 0.75];
  const AP_RATE_TXT = { '1': '১×', '1.25': '১.২৫×', '1.5': '১.৫×', '0.75': '০.৭৫×' };
  const apRateTxt = () => AP_RATE_TXT[String(AP.rate || 1)] || '১×';
  function apSpeed() {
    const i = AP_RATES.indexOf(AP.rate || 1);
    AP.rate = AP_RATES[(i + 1) % AP_RATES.length];
    if (AP.player && AP.player.setPlaybackRate) { try { AP.player.setPlaybackRate(AP.rate); } catch (e) {} }
    toast('গতি: ' + apRateTxt());
    apRender();
  }
  const apTime = t => {
    t = Math.max(0, Math.floor(t || 0));
    const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sec = t % 60;
    const p2 = n => (n < 10 ? '0' : '') + n;
    return h ? bn(h) + ':' + bn(p2(m)) + ':' + bn(p2(sec)) : bn(m) + ':' + bn(p2(sec));
  };
  function apState() {
    try { return AP.player && AP.player.getPlayerState ? AP.player.getPlayerState() : -1; } catch (e) { return -1; }
  }
  const apPlaying = () => apState() === 1;
  function apToggle() {
    if (!AP.player) return;
    if (apPlaying()) AP.player.pauseVideo(); else AP.player.playVideo();
    setTimeout(apRender, 150);
  }
  function apSeek(frac) {
    if (!AP.player || !AP.player.getDuration) return;
    const d = AP.player.getDuration() || 0;
    AP.player.seekTo(Math.max(0, Math.min(0.999, frac)) * d, true);
  }
  function apJump(sec) {
    if (!AP.player || !AP.player.getCurrentTime) return;
    AP.player.seekTo((AP.player.getCurrentTime() || 0) + sec, true);
  }
  function apStep(dir) {
    const it0 = apItem(AP.id);
    const list = apListOf(it0);
    if (!list.length) return;
    let i = list.findIndex(x => x.id === AP.id);
    if (i < 0) i = 0;
    i = (i + dir + list.length) % list.length;
    const nxt = list[i];
    U.audioId = nxt.id;
    U.audioSrc = isBhaktiIt(nxt) ? 'bhakti' : 'gita';
    apStart(nxt.id);
    /* মুখ্যস্থান: কার্ডের নাম, থাম্বনেইল, অধ্যায়-শ্রেণি নতুন অডিও অনুযায়ী আঁকা হয়
       (অন্য পর্দায় থাকলে সেটি আবার না আঁকিয়ে শুধু মিনি-বার হালনাগাদ থাকে) */
    if ((location.hash || '').indexOf('#/library') === 0) render();
    toast((dir > 0 ? 'পরের: ' : 'আগের: ') + nxt.name);
  }
  function apSetVol(v) {
    if (AP.player && AP.player.setVolume) AP.player.setVolume(v);
    if (v > 0 && AP.player && AP.player.unMute) AP.player.unMute();
    S.audioVol = v; save('audioVol');
  }
  /* মিনি-বার (সব পর্দায় দেখা যায়) */
  function apBarHTML() {
    const item = apItem(AP.id);
    if (!item) return '';
    const btn = 'width:34px;height:34px;border-radius:50%;border:1px solid rgba(215,169,79,.32);background:rgba(215,169,79,.12);color:inherit;display:grid;place-items:center;cursor:pointer;flex:0 0 auto;font-size:13px;padding:0;font-family:inherit';
    return `<div class="apseek" style="position:absolute;left:0;right:0;top:0;height:3px;background:rgba(215,169,79,.18);border-radius:3px 3px 0 0;overflow:hidden"><i id="apFill" style="display:block;height:100%;width:0%;background:#d7a94f"></i></div>
      <img src="https://i.ytimg.com/vi/${item.id}/mqdefault.jpg" alt="" style="width:38px;height:38px;border-radius:9px;object-fit:cover;flex:0 0 auto;box-shadow:0 0 0 1px rgba(215,169,79,.35)">
      <div style="flex:1 1 auto;min-width:0">
        <div class="apt" style="font-size:11.6px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(isBhaktiIt(item) ? (item.cat ? item.cat + ' · ' : '') + item.name : (item.ch === 0 ? 'উপসংহার · ' : BN_CH[item.ch] + ' অধ্যায় · ') + item.name)}</div>
        <div class="aps" style="font-size:9.6px;opacity:.72;margin-top:2px;font-variant-numeric:tabular-nums"><span id="apCur">০:০০</span> / <span id="apDur">${item.dur ? bn(item.dur) : '—'}</span></div></div>
      <button style="${btn}" data-act="apPrev" aria-label="আগের">◀</button>
      <button style="${btn};background:#d7a94f;color:#2a0b0d;border-color:transparent;box-shadow:0 8px 18px -10px rgba(215,169,79,.95)" data-act="apToggle" id="apBtn" aria-label="চালান/থামান">${apPlaying() ? '❚❚' : '▶'}</button>
      <button style="${btn}" data-act="apNext" aria-label="পরের">▶</button>
      <button style="${btn}" data-act="apStop" aria-label="বন্ধ">✕</button>`;
  }
  function apRender() {
    let bar = document.getElementById('apbar');
    const item = apItem(AP.id);
    if (!item) { if (bar) { bar.style.display = 'none'; bar.innerHTML = ''; } document.body.classList.remove('has-audio'); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'apbar'; bar.className = 'apbar';
      /* inline styles: CSS পুরোনো ক্যাশে থাকলেও লেআউট ভাঙবে না */
      bar.style.cssText = 'position:fixed;left:0;right:0;bottom:calc(78px + env(safe-area-inset-bottom));z-index:60;'
        + 'margin:0 10px;display:none;align-items:center;gap:10px;padding:11px 11px 10px;border-radius:17px;'
        + 'background:var(--surface-1,#1b1410);border:1px solid var(--card-border,rgba(215,169,79,.35));'
        + 'box-shadow:0 16px 34px -18px rgba(0,0,0,.8);color:inherit;backdrop-filter:blur(10px)';
      document.body.appendChild(bar);
    }
    bar.innerHTML = apBarHTML();
    bar.style.display = 'flex';
    bar.classList.add('on');
    document.body.classList.add('has-audio');
    const b = document.getElementById('apBtn');
    if (b) b.textContent = apPlaying() ? '❚❚' : '▶';
    const big = document.getElementById('apBigBtn');
    if (big) big.textContent = apPlaying() ? '❚❚' : '▶';
    const card = document.getElementById('apCard'); if (card) card.classList.toggle('playing', apPlaying());
    const live = document.querySelector('#apCard .apl-live'); if (live) live.style.display = apPlaying() ? 'inline' : 'none';
    const sp = document.getElementById('apSpeedBtn'); if (sp) sp.textContent = apRateTxt();
    const vol = document.getElementById('apVol'); if (vol) apFillPct(vol, S.audioVol == null ? 80 : S.audioVol);
    const durB = document.getElementById('apDurBig');
    const it = apItem(AP.id); if (durB && it && it.dur) durB.textContent = bn(it.dur);
  }
  function apTick() {
    clearInterval(AP.timer);
    const paint = () => {
      const cur = AP.player && AP.player.getCurrentTime ? (AP.player.getCurrentTime() || 0) : 0;
      const dur = AP.player && AP.player.getDuration ? (AP.player.getDuration() || 0) : 0;
      const cc = document.getElementById('apCur'); if (cc) cc.textContent = apTime(cur);
      const dd = document.getElementById('apDur'); if (dd && dur) dd.textContent = apTime(dur);
      const fill = document.getElementById('apFill'); if (fill && dur) fill.style.width = Math.min(100, cur / dur * 100) + '%';
      const seek = document.getElementById('apSeekBig');
      if (seek && dur) {
        seek.max = String(Math.floor(dur)); seek.value = String(Math.floor(cur));
        if (!seek.dataset.drag) apFillPct(seek, cur / dur * 100);
      }
      const tcur = document.getElementById('apTimeBig'); if (tcur) tcur.textContent = apTime(cur);
      const tdur = document.getElementById('apDurBig'); if (tdur && dur) tdur.textContent = apTime(dur);
      const b = document.getElementById('apBtn'); if (b) b.textContent = apPlaying() ? '❚❚' : '▶';
      const big = document.getElementById('apBigBtn'); if (big) big.textContent = apPlaying() ? '❚❚' : '▶';
      const card = document.getElementById('apCard'); if (card) card.classList.toggle('playing', apPlaying());
    };
    paint();
    AP.timer = setInterval(paint, 800);
  }
  /* অ্যাপ/ট্যাব বন্ধ বা পাতা ছাড়লে অডিও থেমে যাবে (নীরবে; UI আঁকার দরকার নেই) */
  function apHalt() {
    try { AP.player && AP.player.stopVideo && AP.player.stopVideo(); } catch (e) {}
    AP.id = null; AP.dur = 0; AP.pending = null;
    clearInterval(AP.timer); AP.timer = null;
  }
  function apStop() {
    try { AP.player && AP.player.stopVideo && AP.player.stopVideo(); } catch (e) {}
    AP.id = null; clearInterval(AP.timer); AP.timer = null;
    const bar = document.getElementById('apbar'); if (bar) { bar.classList.remove('on'); bar.style.display = 'none'; bar.innerHTML = ''; }
    document.body.classList.remove('has-audio');
    render();
  }

  /* ============ গীতার বাংলা অডিও পাঠ (যথার্থ গীতা · ১৮ অধ্যায়) ============ */
  const BN_CH = ['', 'প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম', 'ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম',
    'একাদশ', 'দ্বাদশ', 'ত্রয়োদশ', 'চতুর্দশ', 'পঞ্চদশ', 'ষোড়শ', 'সপ্তদশ', 'অষ্টাদশ'];
  const audioChLabel = x => x.ch === 0 ? 'উপসংহার' : BN_CH[x.ch] + ' অধ্যায়';
  const AUDIO_CATS = [['all', 'সব'], ['কথা', 'কথা'], ['গান', 'কীর্তন · গান'], ['শাস্ত্র', 'শাস্ত্র পাঠ'], ['ভাগবত', 'ভাগবত']];
  function gitaAudioScreen() {
    const src = U.audioSrc || 'gita';
    const list = src === 'bhakti' ? bhaktiAudio() : (DB.gitaAudio || []);
    const cat = U.audioCat || 'all';
    const inCat = x => cat === 'all' ? true
      : src === 'bhakti' ? x.cat === cat
        : cat === 'c' ? x.ch === 0
          : cat === '1' ? (x.ch >= 1 && x.ch <= 6)
            : cat === '2' ? (x.ch >= 7 && x.ch <= 12) : (x.ch >= 13 && x.ch <= 18);
    const cur = U.audioId ? apItem(U.audioId) : null;
    const playing = cur && AP.id === cur.id;
    const srcChips = `<div class="cats" style="padding:0 0 10px">
        <button class="chip ${src !== 'bhakti' ? 'on' : ''}" data-act="audioSrc" data-s="gita">গীতা · ${bn((DB.gitaAudio || []).length)}</button>
        <button class="chip ${src === 'bhakti' ? 'on' : ''}" data-act="audioSrc" data-s="bhakti">কথা · কীর্তন · ভাগবত · ${bn(bhaktiAudio().length)}</button>
      </div>`;
    const sub = cur ? (isBhaktiIt(cur)
      ? `<span>${esc(cur.ch || 'চ্যানেল')}</span><span>·</span><span>${esc(cur.cat || 'কথা')}</span>`
      : `<span>${audioChLabel(cur)}</span><span>·</span><span>⏱ ${bn(cur.dur)}</span>`) : '';
    const player = cur ? `<div class="apl" id="apCard">
        <div class="apl-glow" style="background-image:url('https://i.ytimg.com/vi/${cur.id}/mqdefault.jpg')"></div>
        <div class="apl-top">
          <div class="apl-art">
            <img src="https://i.ytimg.com/vi/${cur.id}/mqdefault.jpg" alt="">
            <span class="apl-eq"><i></i><i></i><i></i><i></i><i></i></span>
          </div>
          <div class="apl-meta">
            <div class="apl-kicker">${isBhaktiIt(cur) ? 'কথা · কীর্তন · শাস্ত্র' : 'অডিও পাঠ · যথার্থ গীতা'}</div>
            <div class="apl-title">${esc(cur.name)}</div>
            <div class="apl-sub">${sub}
              <span class="apl-dot"></span><span class="apl-live" style="display:none">চলছে</span></div>
          </div>
          <button class="apl-play" id="apBigBtn" data-act="apToggle" aria-label="চালান/থামান">${playing && apPlaying() ? '❚❚' : '▶'}</button>
        </div>
        <div class="apl-seek">
          <input class="aplrange" id="apSeekBig" type="range" min="0" max="100" value="0" step="1" aria-label="সময়">
          <div class="apl-time"><span id="apTimeBig">০:০০</span><span id="apDurBig">${cur.dur ? bn(cur.dur) : '—'}</span></div>
        </div>
        <div class="apl-ctl">
          <button class="apl-btn" data-act="apJump" data-s="-15" aria-label="১৫ সেকেন্ড পিছনে">↺<b>১৫</b></button>
          <button class="apl-btn" data-act="apPrev" aria-label="আগের">◀◀</button>
          <button class="apl-btn" data-act="apNext" aria-label="পরের">▶▶</button>
          <button class="apl-btn" data-act="apJump" data-s="15" aria-label="১৫ সেকেন্ড সামনে"><b>১৫</b>↻</button>
          <button class="apl-btn speed" id="apSpeedBtn" data-act="apSpeed" aria-label="গতির হার">${apRateTxt()}</button>
        </div>
        <div class="apl-vol">
          <span class="apl-vico">🔊</span>
          <input class="aplrange sm" id="apVol" type="range" min="0" max="100" value="${S.audioVol == null ? 80 : S.audioVol}" step="1" style="flex:1 1 auto" aria-label="ভলিউম">
          <a href="https://www.youtube.com/watch?v=${cur.id}" target="_blank" rel="noopener noreferrer">ইউটিউবে ↗</a>
        </div>
      </div>` : '';
    const rows = list.filter(inCat).map(x => {
      const on = cur && cur.id === x.id;
      const b = isBhaktiIt(x);
      return `<button class="card rowcard" data-act="audioPlay" data-id="${x.id}" style="width:100%;text-align:left;cursor:pointer;margin-bottom:7px;${on ? 'border-color:var(--gold-400)' : ''}">
        <div class="datebox" style="min-width:44px"><b style="font-size:13px">${b ? esc((x.cat || 'ক').slice(0, 2)) : (x.ch === 0 ? '॥' : bn(x.ch))}</b><i>${b ? 'শ্রেণি' : (x.ch === 0 ? 'শেষ' : 'অধ্যায়')}</i></div>
        <div style="flex:1;min-width:0">
          <div class="ttl" style="font-size:.9rem;line-height:1.5">${esc(x.name)}</div>
          <div class="mini muted" style="margin-top:3px">${b ? esc((x.ch || 'চ্যানেল') + ' · ' + (x.cat || 'কথা')) : audioChLabel(x) + ' · ' + bn(x.dur)}</div></div>
        <span class="pill ${on ? 'ok' : ''}">${on ? '▶ চলছে' : '▶'}</span></button>`;
    }).join('');
    const note = src === 'bhakti'
      ? `<b>কথা · কীর্তন · শাস্ত্র · ভাগবত পাঠ</b> — বাংলা ভক্তিমূলক চ্যানেলগুলোর দীর্ঘ অডিও (প্রবচন, কথামৃত, কীর্তন, ভাগবত-গীতা পাঠ)। ▶ চাপলেই একই অডিও প্লেয়ারে বাজবে — পাতা বদলালেও চলবে।`
      : `<b>গীতার সম্পূর্ণ বাংলা অডিও পাঠ</b> — ১৮টি অধ্যায় ও উপসংহার, স্বামী অদ্গদানন্দজীর যথার্থ গীতা থেকে। ▶ চাপলেই <b>অডিও প্লেয়ার</b> চালু হয়।`;
    return `${srcChips}
      <p class="mini muted" style="margin:0 0 10px;line-height:1.75">${note}</p>
      ${player}
      ${rows || '<p class="mini muted">এই শ্রেণিতে কিছু নেই।</p>'}
      <p class="mini muted" style="margin-top:10px;line-height:1.7">উৎস: YouTube-এর বাংলা ভক্তিমূলক চ্যানেল (oEmbed দিয়ে নাম যাচাই করা)। লিংক অ্যাপের ভেতরে সাজানো; ভিডিও/অডিও ফাইল ডাউনলোড হয় না।</p>`;
  }

  function libraryScreen() {
    const cats = ['সব', 'চলমান', 'নতুন', 'মুখস্থ', 'সংক্ষিপ্ত'];
    return `${appbar('শাস্ত্র গ্রন্থাগার', 'Digital Granthagar', undefined, true)}
    <div class="pad" style="padding-top:0">
      <div class="search">${ico('search', 'sm')}<input id="libSearch" placeholder="গ্রন্থ, শ্লোক বা শব্দ খুঁজুন…" value="${esc(U.libQ)}" aria-label="খুঁজুন"/></div>
      <div class="segment mt">
        ${[['books', 'গ্রন্থ'], ['verse', 'শ্লোক'], ['audio', 'অডিও']].map(([k, l]) =>
          `<button class="${U.libSeg === k ? 'on' : ''}" data-act="seg" data-s="${k}">${l}</button>`).join('')}
      </div>
    </div>
    <div class="cats">${U.libSeg === 'audio'
      ? ((U.audioSrc || 'gita') === 'bhakti'
          ? AUDIO_CATS.map(([k, l]) => `<button class="chip ${(U.audioCat || 'all') === k ? 'on' : ''}" data-act="audioCat" data-c="${k}">${l}${k === 'all' ? ' · ' + bn(bhaktiAudio().length) : ' · ' + bn(bhaktiAudio().filter(x => x.cat === k).length)}</button>`).join('')
          : [['all', 'সব ১৮'], ['1', 'অধ্যায় ১–৬'], ['2', 'অধ্যায় ৭–১২'], ['3', 'অধ্যায় ১৩–১৮'], ['c', 'উপসংহার']]
            .map(([k, l]) => `<button class="chip ${(U.audioCat || 'all') === k ? 'on' : ''}" data-act="audioCat" data-c="${k}">${l}</button>`).join(''))
      : cats.map(c => `<button class="chip ${U.libCat === c ? 'on' : ''}" data-act="cat" data-c="${c}">${c}</button>`).join('')}</div>
    <div class="pad" style="padding-top:12px">
      ${U.libSeg === 'audio' ? gitaAudioScreen()
        : U.libSeg === 'verse' ? `<div class="card pad"><div class="mini muted" style="margin-bottom:8px">শ্লোক অনুসন্ধান — বাংলা বা শব্দ দিয়ে</div>
            <div class="mini muted">সার্চ বক্সে লিখে গ্রন্থ খুঁজুন, তারপর গ্রন্থ খুলে শ্লোক বেছে নিন।</div></div>`
          : `<div class="card oath pad" style="margin-bottom:12px">
              <div class="kv"><div><div class="mini muted">পাঠ-অগ্রগতি</div><div class="display" style="font-size:14px;margin-top:3px">গীতা · অধ্যায় ম্যাপ</div></div>
                <span class="pill">${bn(S.chapters.length)}/১৮</span></div>
              <div class="map">${Array.from({ length: 18 }, (_, i) => {
        const n = i + 1, done = S.chapters.includes(n), cur = n === Math.max(...S.chapters) + 1;
        return `<button class="ch ${done ? 'done' : cur ? 'cur' : ''}" data-act="chapter" data-n="${n}">${bn(n)}</button>`;
      }).join('')}</div>
              <div class="mapkey"><span><i style="background:linear-gradient(180deg,#f8e3b3,#b1842e)"></i>সম্পূর্ণ</span>
                <span><i style="border:1px solid #d7a94f"></i>চলমান</span><span><i style="background:rgba(255,255,255,.1)"></i>বাকি</span></div>
            </div>
            <div id="libList">${bookCards()}</div>`}
    </div><div style="height:20px"></div>`;
  }

  /* ------------------------------------------------------------ 3. book */
  function bookScreen(id) {
    const b = DB.books.find(x => x.id === id) || DB.books[0];
    return `${appbar(b.title, esc(b.author), '#/library')}
    <div class="pad">
      <div class="card oath pad stack">
        <div style="display:flex;gap:14px;align-items:center">
          <div class="cover ${b.cls}" style="width:64px;height:84px"><span class="sym" style="font-size:24px">${b.sym}</span></div>
          <div style="flex:1">
            <div class="kv"><span class="ttl" style="font-size:14px">${esc(b.title)}</span><span class="pill">${b.tag}</span></div>
            <div class="mini muted" style="margin:5px 0 9px">${bn(b.chapters)} অধ্যায় · ${bn(b.verses)} শ্লোক</div>
            <div class="bar thin"><i style="width:${S.read[b.id + ':any'] ? 60 : 25}%"></i></div>
          </div>
        </div>
        <p class="tiny muted" style="margin:12px 0 0;line-height:1.8">${esc(b.desc)}</p>
      </div>

      ${b.chapterMeta ? `<button class="btn gold block mt" data-act="nav" data-to="#/gita">অধ্যায়ভিত্তিক সম্পূর্ণ পাঠ ▸</button>` : ''}
      <div class="sect"><h4>${b.chapterMeta ? 'অধ্যায়' : 'এই ডেমোতে পাঠ'}</h4><div class="line"></div><span class="mini muted">${b.chapterMeta ? bn(18) + ' অধ্যায়' : bn(b.texts.length) + ' শ্লোক'}</span></div>
      ${b.chapterMeta ? b.chapterMeta.map(m => `<div class="card rowcard stack" data-act="nav" data-to="#/gita/${m.n}" role="button" tabindex="0" style="cursor:pointer">
          <div class="datebox" style="width:44px;height:48px"><b>${bn(m.n)}</b><i>অধ্যায়</i></div>
          <div style="flex:1;min-width:0"><div class="kv"><span class="ttl" style="font-size:12.6px">${esc(m.name)}</span><span class="pill">${bn(m.count)}</span></div>
          <div class="mini muted" style="margin-top:5px">${esc(m.sum.slice(0, 66))}…</div></div>${ico('arrow', 'sm')}</div>`).join('') : ''}
      ${b.chapterMeta ? '' : b.texts.map((t, i) => {
        const done = !!S.read[`${b.id}:${i}`];
        const saved = S.bookmarks.includes(`${b.id}:${i}`);
        return `<div class="card rowcard stack" data-act="nav" data-to="#/reader/${b.id}/${i}" role="button" tabindex="0" style="cursor:pointer">
          <div class="datebox" style="width:44px;height:48px"><b>${bn(t.ch)}.${bn(t.v)}</b><i>শ্লোক</i></div>
          <div style="flex:1;min-width:0">
            <div class="mini muted" style="margin-bottom:4px">${esc(t.bn.slice(0, 54))}…</div>
            <div style="display:flex;gap:6px">${done ? '<span class="pill ok">পঠিত</span>' : ''}${saved ? '<span class="pill">বুকমার্ক</span>' : ''}</div>
          </div>${ico('arrow', 'sm')}</div>`;
      }).join('')}
    </div><div style="height:20px"></div>`;
  }

  /* ------------------------------------------------- 3½. গীতা: অধ্যায় সূচি */
  /* ------------------------------------------------- 3¼. কে বলছেন, কে শুনছেন */
  const SPK = {
    krishna: { name: 'শ্রীভগবান উবাচ', short: 'শ্রীভগবান', to: 'ভগবান শ্রীকৃষ্ণ অর্জুনকে বলছেন', cls: 'k' },
    arjuna: { name: 'অর্জুন উবাচ', short: 'অর্জুন', to: 'অর্জুন শ্রীকৃষ্ণের কাছে বলছেন', cls: 'a' },
    sanjaya: { name: 'সঞ্জয় উবাচ', short: 'সঞ্জয়', to: 'সঞ্জয় ধৃতরাষ্ট্রকে বলছেন', cls: 's' },
    dhritarashtra: { name: 'ধৃতরাষ্ট্র উবাচ', short: 'ধৃতরাষ্ট্র', to: 'ধৃতরাষ্ট্র সঞ্জয়কে বলছেন', cls: 'd' }
  };
  const spkOf = (ch, v) => (typeof GITA_SPEAKER !== 'undefined' && GITA_SPEAKER[ch + ':' + v]) || '';
  const spkName = (ch, v) => { const x = SPK[spkOf(ch, v)]; return x ? x.name : ''; };
  /* শ্লোকের উপরে শ্রদ্ধার সঙ্গে বক্তার নাম — “শ্রীভগবান উবাচ” ধাঁচে */
  const spkLine = (ch, v) => {
    const x = SPK[spkOf(ch, v)]; if (!x) return '';
    return `<div class="uvacha ${x.cls}">
        <div class="u-row"><span class="u-orn">॥</span><span class="u-name">${esc(x.name)}</span><span class="u-orn">॥</span></div>
        <div class="u-sub">${esc(x.to)}</div>
      </div>`;
  };
  const spkTag = (ch, v) => {
    const x = SPK[spkOf(ch, v)]; if (!x) return '';
    return `<span class="utag ${x.cls}">${esc(x.short)}</span>`;
  };

  const GITA_BOOK = () => DB.books.find(b => b.id === 'gita');
  const gitaMeta = () => { const b = GITA_BOOK(); return (b && b.chapterMeta) || []; };
  const gitaBnCount = () => { const b = GITA_BOOK(); return b ? b.texts.filter(t => t.bn).length : 0; };
  const gitaKathaCount = () => { const b = GITA_BOOK(); return b ? b.texts.filter(t => t.katha).length : 0; };

  function gitaScreen() {
    const b = GITA_BOOK();
    const meta = gitaMeta();
    const total = b ? b.texts.length : 0;
    const done = gitaBnCount();
    const kcount = gitaKathaCount();
    const pct = total ? Math.round(done / total * 100) : 0;
    const q = U.gitaQ.trim().toLowerCase();
    const hits = q && b ? b.texts.map((t, i) => ({ t, i })).filter(x =>
      (x.t.bn + ' ' + x.t.sk + ' ' + x.t.arth + ' ' + (x.t.katha || '') + ' ' + (x.t.prayog || '')).toLowerCase().includes(q)).slice(0, 30) : [];

    return `${appbar('শ্রীমদ্ভগবদ্গীতা', `${bn(18)} অধ্যায় · ${bn(total)} শ্লোক`, '#/library', true)}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad">
        <div class="reuse-gita-head"><img class="reuse-scripture" src="icons/reference/cal-scripture.png" alt="" aria-hidden="true"/><div class="reuse-gita-copy"><div class="mini muted">মূল সংস্কৃত পাঠ · সম্পূর্ণ</div>
          <div class="display" style="font-size:17px;color:var(--gold-200);margin-top:3px">৭০১ শ্লোক, ১৮ অধ্যায়</div></div>
          <span class="pill ok">${bn(pct)}%</span></div>
        <div class="bar mt"><i style="width:${pct}%"></i></div>
        <div class="kv mini muted" style="margin-top:7px"><span>বাংলা অনুবাদ হয়েছে ${bn(done)}টি শ্লোকে</span><span>বাকি ${bn(total - done)}টি</span></div>
        <div class="kv mini muted" style="margin-top:4px"><span>উদাহরণ-কথা + জীবনে প্রয়োগ</span><span>${bn(kcount)}/${bn(total)} শ্লোক</span></div>
      </div>

      <div class="search mt">${ico('search', 'sm')}<input id="gitaSearch" placeholder="শ্লোক খুঁজুন — বাংলা অর্থ বা সংস্কৃত শব্দ…" value="${esc(U.gitaQ)}" aria-label="গীতায় খুঁজুন"/></div>

      ${q ? `<div class="sect"><h4>সন্ধান: “${esc(U.gitaQ)}”</h4><div class="line"></div><span class="mini muted">${bn(hits.length)}টি ফল</span></div>
        ${hits.length ? hits.map(x => `<div class="card rowcard stack" data-act="nav" data-to="#/reader/gita/${x.i}" role="button" tabindex="0" style="cursor:pointer">
            <div class="datebox" style="width:44px;height:48px"><b>${bn(x.t.ch)}.${bn(x.t.v)}</b><i>শ্লোক</i></div>
            <div style="flex:1;min-width:0"><div class="mini" style="margin-bottom:4px">${esc((x.t.bn || x.t.sk).slice(0, 70))}${(x.t.bn || x.t.sk).length > 70 ? '…' : ''}</div>
              <div class="tiny muted">${esc(x.t.sk.split('\n').filter(l => !/উবাচ/.test(l))[0].slice(0, 42))}…</div></div>${ico('arrow', 'sm')}</div>`).join('')
          : `<div class="card empty"><div class="illu">${ico('search')}</div><h5>কিছু পাওয়া যায়নি</h5><p>অন্য শব্দে চেষ্টা করুন — যেমন “কর্ম”, “ভক্তি”, “আত্মা”।</p></div>`}`
        : `<div class="sect"><h4>১৮ অধ্যায়</h4><div class="line"></div><span class="mini muted">শ্লোক সংখ্যা</span></div>
        ${meta.map(m => {
          const doneCh = b.texts.filter(t => t.ch === m.n && t.bn).length;
          const kathCh = b.texts.filter(t => t.ch === m.n && t.katha).length;
          const all = kathCh === m.count;
          return `<div class="card rowcard stack" data-act="nav" data-to="#/gita/${m.n}" role="button" tabindex="0" style="cursor:pointer">
            <div class="datebox" style="width:44px;height:48px"><b>${bn(m.n)}</b><i>অধ্যায়</i></div>
            <div style="flex:1;min-width:0">
              <div class="kv"><span class="ttl" style="font-size:12.6px">${esc(m.name)}</span>
                <span class="pill ${all ? 'ok' : ''}">${bn(m.count)} শ্লোক</span></div>
              <div class="mini muted" style="margin-top:5px;line-height:1.6">${esc(m.sum.slice(0, 78))}…</div>
              <div class="tiny muted" style="margin-top:5px">${doneCh ? `অনুবাদ ${bn(doneCh)}/${bn(m.count)}` : ''}${kathCh ? ` · কথা ${bn(kathCh)}/${bn(m.count)}` : ''}</div>
            </div>${ico('arrow', 'sm')}</div>`;
        }).join('')}

        <p class="mini muted" style="margin-top:16px;line-height:1.75">মূল সংস্কৃত পাঠ সম্পূর্ণ ও দুই উৎস মিলিয়ে যাচাই করা (৭০১টি শ্লোকের ৬৭৮টি হুবহু মিলেছে; বাকিগুলো ভিন্ন-পাঠ)। শ্লোকগুলো <b>বাংলা লিপিতে</b> দেখা যায় — রিডারে চাইলে দেবনাগরীতেও বদলানো যায়। কোনো সংস্করণে ১৩শ অধ্যায়ে ৩৪, কোনোতে ৩৫ শ্লোক। প্রতিটি শ্লোকের সঙ্গে <b>বাংলা অনুবাদ ও সহজ অর্থ</b> সম্পূর্ণ (৭০১/৭০১)। এর সঙ্গে ধাপে ধাপে যোগ হচ্ছে <b>উদাহরণ-কথা</b> — শাস্ত্রীয় বা বাস্তব জীবনের গল্প, আর তার নীচে <b>জীবনে প্রয়োগ</b>। অনুবাদ ও গল্প সাধারণ পাঠকের জন্য সহজ ভাষায় লেখা; প্রকাশের আগে পণ্ডিত-পর্যালোচনা বাঞ্ছনীয়।</p>`}
    </div><div style="height:20px"></div>`;
  }

  function gitaChapterScreen(nStr) {
    const n = Math.max(1, Math.min(18, parseInt(nStr || '1', 10)));
    const b = GITA_BOOK(); if (!b) return gitaScreen();
    const m = gitaMeta().find(x => x.n === n) || { n, name: 'অধ্যায় ' + n, count: 0, sum: '' };
    const items = b.texts.map((t, i) => ({ t, i })).filter(x => x.t.ch === n);
    const doneCh = items.filter(x => x.t.bn).length;
    const kathCh = items.filter(x => x.t.katha).length;
    return `${appbar(`অধ্যায় ${bn(n)} · ${m.name}`, `${bn(m.count)} শ্লোক · অনুবাদ ${bn(doneCh)} · কথা ${bn(kathCh)}`, '#/gita', true)}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad">
        <div class="mini muted">${esc(m.sum)}</div>
        <div class="bar thin mt"><i style="width:${m.count ? Math.round(doneCh / m.count * 100) : 0}%"></i></div>
      </div>
      ${items.map(x => {
        const t = x.t;
        const first = t.sk.split('\n').filter(l => !/উবাচ/.test(l))[0] || t.sk.split('\n')[0];
        return `<div class="card rowcard stack" data-act="nav" data-to="#/reader/gita/${x.i}" role="button" tabindex="0" style="cursor:pointer">
          <div class="datebox" style="width:44px;height:48px"><b>${bn(t.v)}</b><i>শ্লোক</i></div>
          <div style="flex:1;min-width:0">
            <div class="mini" style="color:var(--ink-2);margin-bottom:4px">${esc(first.slice(0, 46))}…</div>
            <div class="tiny muted">${t.bn ? esc(t.bn.slice(0, 60)) + '…' : 'বাংলা অনুবাদ যুক্ত হচ্ছে'}</div>
            <div class="tiny" style="margin-top:5px;display:flex;gap:6px;align-items:center">${spkTag(t.ch, t.v)}</div>
            ${t.katha ? `<div class="tiny" style="margin-top:5px;color:var(--gold-300)">কথা · ${esc(t.ksrc || 'উদাহরণ')}</div>` : ''}
          </div>${ico('arrow', 'sm')}</div>`;
      }).join('')}
      <div style="display:flex;gap:9px;margin-top:14px">
        <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/gita/${n - 1}" ${n === 1 ? 'disabled' : ''}>আগের অধ্যায়</button>
        <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/gita/${n + 1}" ${n === 18 ? 'disabled' : ''}>পরের অধ্যায়</button>
      </div>
    </div><div style="height:20px"></div>`;
  }

  /* ---------------------------------------------------------- 4. reader */
  function readerScreen(id, idx) {
    const b = DB.books.find(x => x.id === id) || DB.books[0];
    const i = Math.max(0, Math.min(parseInt(idx || '0', 10), b.texts.length - 1));
    const t = b.texts[i];
    const k = `${b.id}:${i}`;
    const saved = S.bookmarks.includes(k);
    const hasCh = !!b.chapterMeta;
    return `${appbar(b.title, `অধ্যায় ${bn(t.ch)} · শ্লোক ${bn(t.v)}`, hasCh ? '#/gita/' + t.ch : '#/book/' + b.id, false, true)}
    <div class="pad">
      ${t.dev ? `<div class="prefbar" style="justify-content:center">
        <div class="grp"><b class="${S.script === 'bn' ? 'on' : ''}" data-act="scriptSet" data-v="bn">বাংলা লিপি</b>
          <b class="${S.script === 'dev' ? 'on' : ''}" data-act="scriptSet" data-v="dev">দেবনাগরী</b></div>
      </div>` : ''}

      <div class="card oath verse">
        <div class="vnum"><span class="l"></span><b>শ্লোক ${bn(t.ch)}.${bn(t.v)}</b><span class="l r"></span></div>
        ${spkLine(t.ch, t.v)}
        <div class="sk" style="font-size:${S.font}px">${(S.script === 'dev' && t.dev ? t.dev : t.sk).split('\n').map(esc).join('<br/>')}
          <div class="mini muted" style="text-align:right;margin-top:8px;font-size:10.5px">॥ ${bn(t.ch)}।${bn(t.v)} ॥</div></div>
        <div class="bn"><span class="lbl">বাংলা অনুবাদ</span>${esc(t.bn)}</div>
        <div class="arth"><b style="color:var(--gold-300)">সহজ অর্থ ·</b> ${esc(t.arth)}</div>
      </div>

      ${t.katha ? `<div class="card oath pad katha">
        <div class="kv" style="align-items:center">
          <div style="font-family:var(--f-dis);font-size:13.6px;color:var(--gold-200)">উদাহরণ-কথা</div>
          <span class="pill">${esc(t.ksrc || 'উদাহরণ')}</span>
        </div>
        <p class="ktext">${esc(t.katha)}</p>
        ${t.prayog ? `<div class="prayog"><b>জীবনে প্রয়োগ ·</b> ${esc(t.prayog)}</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">
          <button class="btn ghost sm" data-act="speakKatha" data-i="${i}">${vico('play', 'xs')} কথা শুনুন</button>
          <button class="btn ghost sm" data-act="speakFull" data-i="${i}">${vico('play', 'xs')} শ্লোক + কথা</button>
          <button class="btn ghost sm" data-act="speakStop">থামান</button>
        </div>
        <div class="tiny muted" style="margin-top:10px;line-height:1.7">কথাটি শ্লোকের ভাব অনুসরণ করে লেখা — শাস্ত্রীয় ঘটনা বা দৈনন্দিন জীবনের দৃষ্টান্ত; উদ্দেশ্য কেবল শিক্ষা, বিনোদন নয়।</div>
      </div>` : `<div class="card pad"><div class="mini muted">এই শ্লোকের উদাহরণ-কথা এখনো যুক্ত হয়নি — ধাপে ধাপে যোগ হচ্ছে।</div></div>`}

      <div style="display:flex;gap:9px;margin-top:14px">
        <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/reader/${b.id}/${i - 1}" ${i === 0 ? 'disabled' : ''}>আগের</button>
        <button class="btn ghost" style="width:52px;padding:0" data-act="bookmark" data-i="${i}" aria-label="বুকমার্ক">${vico('mark', 'sm')}</button>
        <button class="btn ghost" style="width:52px;padding:0" data-act="noteFromReader" data-i="${i}" aria-label="এই শ্লোকের নোট">${ico('pen', 'sm')}</button>
        <button class="btn gold" style="flex:1.3" data-act="markread" data-i="${i}">${S.read[k] ? 'পঠিত ✓' : 'পাঠ সম্পন্ন'}</button>
      </div>
      ${(() => { const c = S.notes.filter(n => n.ctx && n.ctx.book === b.id && n.ctx.idx === i).length;
        return c ? `<button class="btn ghost block mt" data-act="openNotes">${ico('pen', 'sm')} এই শ্লোকে ${bn(c)}টি নোট আছে</button>` : ''; })()}
      <button class="btn ghost block mt" data-act="nav" data-to="#/reader/${b.id}/${i + 1}" ${i === b.texts.length - 1 ? 'disabled' : ''}>পরের শ্লোক ${ico('arrow', 'sm')}</button>
      ${hasCh ? `<button class="btn ghost block mt" data-act="nav" data-to="#/gita/${t.ch}">অধ্যায় ${bn(t.ch)}-এর সব শ্লোক ▸</button>` : ''}
      ${saved ? '<p class="mini muted" style="text-align:center;margin-top:10px">বুকমার্ক করা আছে · লাইব্রেরিতে দেখুন</p>' : ''}
    </div><div style="height:20px"></div>`;
  }

  /* --------------------------------------------------------- 5. courses */
  function coursesScreen() {
    return `${appbar('কোর্স ও পাঠ্যক্রম', 'Pathshala')}
    <div class="pad" style="padding-top:0">
      ${DB.courses.map(c => {
      const done = (S.lessons[c.id] || []).length;
      const pct = Math.round(done / c.lessons.length * 100);
      return `<div class="card pad stack" data-act="nav" data-to="#/course/${c.id}" role="button" tabindex="0" style="cursor:pointer">
          <div class="kv"><span class="ttl" style="font-family:var(--f-dis);font-size:14px">${esc(c.title)}</span><span class="pill">${done ? bn(pct) + '%' : 'নতুন'}</span></div>
          <div class="mini muted" style="margin:5px 0 8px">${esc(c.level)} · ${esc(c.teacher)}</div>
          <p class="tiny muted" style="margin:0 0 10px;line-height:1.7">${esc(c.summary)}</p>
          <div class="bar thin"><i style="width:${pct}%"></i></div>
        </div>`;
    }).join('')}
    </div><div style="height:20px"></div>`;
  }
  function courseScreen(id) {
    const c = DB.courses.find(x => x.id === id) || DB.courses[0];
    const done = S.lessons[c.id] || [];
    const pct = Math.round(done.length / c.lessons.length * 100);
    return `${appbar(c.title, esc(c.level), '#/courses')}
    <div class="pad">
      <div class="card oath pad stack">
        <div class="kv"><div><div class="mini muted">কোর্স অগ্রগতি</div><div class="display" style="font-size:14px;margin-top:3px">${esc(c.teacher)}</div></div>
          <div class="ring" style="--p:${pct}%;width:48px;height:48px"><div><div class="n" style="font-size:12px">${bn(pct)}%</div></div></div></div>
        <div class="grid3 mt"><div class="stat"><div class="k">লেসন</div><div class="v">${bn(done.length)}/${bn(c.lessons.length)}</div></div>
          <div class="stat"><div class="k">সময়</div><div class="v">${bn(c.hours)} ঘণ্টা</div></div>
          <div class="stat"><div class="k">কুইজ</div><div class="v">৩</div></div></div>
      </div>
      <div class="sect"><h4>সিলেবাস</h4><div class="line"></div><span class="mini muted">ট্যাপ করে সম্পন্ন করুন</span></div>
      <div class="timeline">
        ${c.lessons.map((l, i) => `<div class="card tl ${done.includes(i) ? 'done' : ''}" data-act="lesson" data-id="${c.id}" data-i="${i}" role="button" tabindex="0">
          <div class="node">${done.includes(i) ? ico('check', 'xs') : bn(i + 1)}</div>
          <h5>${esc(l.t)} ${!done.includes(i) && done.length === i ? '<span class="pill">এখনই</span>' : ''}</h5>
          <p>${esc(l.d)} · ${bn(l.m)} মিনিট</p></div>`).join('')}
      </div>
      <button class="btn gold block" data-act="nav" data-to="#/quiz">লেসন শেষে কুইজ দিন</button>
    </div><div style="height:20px"></div>`;
  }

  /* ------------------------------------------------------------ 6. exam */
  function nextFriday() {
    const d = new Date(TODAY);
    d.setHours(20, 0, 0, 0);
    const add = (5 - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + (add === 0 && Date.now() > d.getTime() ? 7 : add));
    return d;
  }
  function examScreen() {
    const target = nextFriday();
    const diff = Math.max(0, target - Date.now());
    const hh = Math.floor(diff / 3600000), mm = Math.floor(diff % 3600000 / 60000), dd = Math.floor(hh / 24);
    const best = S.attempts.length ? Math.max(...S.attempts.map(a => a.score)) : 0;
    const rows = DB.leaderboard.concat([{ n: S.name + ' (আপনি)', c: 'ঢাকা', s: best, me: true }])
      .sort((a, b) => b.s - a.s);
    return `${appbar('পরীক্ষা ও কুইজ', 'Pariksha Kendra', undefined, true)}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad">
        <div class="kv" style="align-items:flex-start">
          <div><span class="pill">সাপ্তাহিক কুইজ · ৪৭তম</span>
            <div class="display" style="font-size:16px;margin-top:9px">${esc(DB.quizzes.weekly.topic)}</div>
            <div class="mini muted" style="margin-top:4px">${bn(DB.quizzes.weekly.questions.length)}টি প্রশ্ন · ${bn(DB.quizzes.weekly.minutes)} মিনিট · নেগেটিভ মার্কিং নেই</div></div>
          <div style="text-align:center"><div class="mini muted">পুরস্কার</div><div style="font-size:16px;margin-top:4px">🥇</div>
            <div class="mini" style="color:var(--gold-300);margin-top:2px">স্বর্ণ পদক</div></div>
        </div>
        <div class="cd"><div><b>${bn(dd)}</b><i>দিন</i></div><div><b>${bn(String(hh % 24).padStart(2, '0'))}</b><i>ঘণ্টা</i></div><div><b>${bn(String(mm).padStart(2, '0'))}</b><i>মিনিট</i></div></div>
        <button class="btn gold block mt" data-act="quizStart">এখনই অংশ নিন</button>
      </div>

      <div class="grid3 mt">
        <div class="card pad" style="text-align:center;padding:12px 6px"><div style="color:var(--gold-300);display:grid;place-items:center">${ico('cal')}</div><div class="mini" style="margin-top:7px">মাসিক</div></div>
        <div class="card pad" style="text-align:center;padding:12px 6px"><div style="color:var(--gold-300);display:grid;place-items:center">${ico('trophy')}</div><div class="mini" style="margin-top:7px">বার্ষিক</div></div>
        <div class="card pad" style="text-align:center;padding:12px 6px"><div style="color:var(--gold-300);display:grid;place-items:center">${ico('shield')}</div><div class="mini" style="margin-top:7px">সার্টিফিকেট</div></div>
      </div>

      <div class="sect"><h4>লিডারবোর্ড</h4><div class="line"></div><span class="mini muted">আপনার সেরা: ${best ? bn(best) : '—'}</span></div>
      <div class="card pad" style="padding:6px 13px">
        ${rows.slice(0, 6).map((r, i) => `
          <div class="li ${r.me ? 'me-row' : ''}">
            <span class="rankbox ${i === 0 ? 'g1' : i === 1 ? 'g2' : i === 2 ? 'g3' : ''}">${bn(i + 1)}</span>
            <div class="av round" style="width:30px;height:30px;font-size:12px">${esc(r.n.slice(0, 1))}</div>
            <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${esc(r.n)}</div><div class="mini muted">${esc(r.c)} · ${r.s ? bn(r.s) : '—'}</div></div>
            ${r.me ? '<span class="pill">আপনি</span>' : ''}
          </div>`).join('')}
      </div>

      ${S.attempts.length ? `<div class="sect"><h4>আগের ফলাফল</h4><div class="line"></div></div>
      ${S.attempts.slice(-3).reverse().map(a => `<div class="card rowcard stack">
        <div class="datebox" style="width:44px;height:48px"><b>${bn(a.score)}</b><i>নম্বর</i></div>
        <div style="flex:1"><div class="ttl">${esc(a.title)}</div><div class="mini muted" style="margin-top:4px">${bn(a.correct)}/${bn(a.total)} সঠিক · ${esc(a.when)}</div></div>
        <span class="pill ${a.score >= 50 ? 'ok' : ''}">${a.score >= 50 ? 'উত্তীর্ণ' : 'আবার চেষ্টা'}</span></div>`).join('')}` : ''}
    </div><div style="height:20px"></div>`;
  }

  /* ------------------------------------------------------------ 7. quiz */
  function quizScreen() {
    const q = U.quiz;
    if (!q) return `<div class="pad" style="padding-top:24px"><div class="card empty"><h5>কুইজ শুরু হয়নি</h5><p>পরীক্ষা পাতায় গিয়ে “এখনই অংশ নিন” চাপুন।</p><button class="btn gold sm" data-act="nav" data-to="#/exam">পরীক্ষায় যান</button></div></div>`;
    const Q = DB.quizzes.weekly.questions;
    const cur = Q[q.i];
    const left = q.left;
    return `${appbar(`প্রশ্ন ${bn(q.i + 1)} / ${bn(Q.length)}`, DB.quizzes.weekly.topic, '#/exam')}
    <div class="pad">
      <div class="kv" style="margin-top:4px"><span class="mini muted">সময় বাকি</span><span class="pill" id="quizTimer">${bn(String(Math.floor(left / 60)).padStart(2, '0'))}:${bn(String(left % 60).padStart(2, '0'))}</span></div>
      <div class="qbar">${Q.map((_, i) => `<i class="${i <= q.i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="card pad" style="margin-bottom:15px;padding:16px">
        <div class="mini muted" style="margin-bottom:9px">${esc(DB.quizzes.weekly.topic)} · প্রশ্ন ${bn(q.i + 1)}</div>
        <div style="font-size:14px;line-height:1.75">${esc(cur.q)}</div>
      </div>
      ${cur.opts.map((o, i) => `<button class="opt ${q.answers[q.i] === i ? 'sel' : ''}" data-act="pick" data-i="${i}">
        <span class="k">${['ক', 'খ', 'গ', 'ঘ'][i]}</span>${esc(o)}</button>`).join('')}
      <div style="display:flex;gap:9px;margin-top:16px">
        <button class="btn ghost" style="flex:1" data-act="quizPrev" ${q.i === 0 ? 'disabled' : ''}>আগের</button>
        ${q.i === Q.length - 1
        ? `<button class="btn gold" style="flex:1.5" data-act="quizSubmit">জমা দিন</button>`
        : `<button class="btn gold" style="flex:1.5" data-act="quizNext">পরের প্রশ্ন</button>`}
      </div>
      <p class="mini muted" style="text-align:center;margin-top:14px">উত্তর দেওয়া হয়েছে ${bn(Object.keys(q.answers).length)}/${bn(Q.length)}</p>
    </div><div style="height:20px"></div>`;
  }

  function resultScreen() {
    const r = U.result;
    if (!r) return homeScreen();
    const Q = DB.quizzes.weekly.questions;
    const pct = Math.round(r.correct / Q.length * 100);
    return `${appbar('ফলাফল', DB.quizzes.weekly.topic, '#/exam')}
    <div class="pad">
      <div class="card oath pad" style="text-align:center">
        <div class="eyebrow">আপনার স্কোর</div>
        <div class="display" style="font-size:40px;margin:8px 0 4px;color:var(--gold-200)">${bn(r.score)}</div>
        <div class="tiny muted">১০০-এর মধ্যে · ${bn(r.correct)}/${bn(Q.length)} সঠিক</div>
        <div class="bar" style="margin:14px 0 6px"><i style="width:${pct}%"></i></div>
        <div class="mini muted">${pct >= 80 ? 'অসাধারণ! শাস্ত্রজ্ঞান দৃঢ় হচ্ছে 🌸' : pct >= 50 ? 'ভালো — আরেকটু অনুশীলন করুন' : 'চিন্তা নেই, ব্যাখ্যা পড়ে আবার দিন'}</div>
      </div>
      <div class="sect"><h4>উত্তরপত্র ও ব্যাখ্যা</h4><div class="line"></div></div>
      ${Q.map((q, i) => {
        const mine = r.answers[i], ok = mine === q.ans;
        return `<div class="card pad stack">
          <div class="kv"><span class="tiny" style="flex:1;line-height:1.6">${bn(i + 1)}. ${esc(q.q)}</span>
            <span class="pill ${ok ? 'ok' : ''}">${ok ? 'সঠিক' : 'ভুল'}</span></div>
          <div class="mini" style="margin-top:8px">আপনার উত্তর: <b>${mine === undefined ? '—' : esc(q.opts[mine])}</b></div>
          ${!ok ? `<div class="mini" style="color:var(--ok);margin-top:4px">সঠিক: ${esc(q.opts[q.ans])}</div>` : ''}
          <div class="arth" style="margin-top:9px;font-size:11.5px">${esc(q.ex)}</div>
        </div>`;
      }).join('')}
      <div style="display:flex;gap:9px"><button class="btn ghost" style="flex:1" data-act="nav" data-to="#/exam">শেষ</button>
        <button class="btn gold" style="flex:1" data-act="quizStart">আবার দিন</button></div>
    </div><div style="height:20px"></div>`;
  }

  /* ------------------------------------------------------------- 8. puja */
  function pujaScreen() {
    return `${appbar('পূজা ও নিত্যকর্ম', 'Achar Guide')}
    <div class="pad" style="padding-top:0">
      ${DB.pujas.map(p => {
      const done = (S.puja[p.id + ':' + TODAY_KEY] || []).length;
      const pct = Math.round(done / p.steps.length * 100);
      return `<div class="card pad stack" data-act="nav" data-to="#/puja/${p.id}" role="button" tabindex="0" style="cursor:pointer">
          <div style="display:flex;gap:13px;align-items:center">
            <div style="width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--glass);border:1px solid var(--card-border);color:var(--gold-300)">${ico('flame')}</div>
            <div style="flex:1">
              <div class="kv"><span class="ttl" style="font-family:var(--f-dis);font-size:14px">${esc(p.title)}</span><span class="pill">${pct ? bn(pct) + '%' : bn(p.mins) + ' মিনিট'}</span></div>
              <div class="mini muted" style="margin-top:4px">${esc(p.time)} · ${bn(p.steps.length)} ধাপ</div>
            </div>
          </div>
          <p class="tiny muted" style="margin:10px 0 8px;line-height:1.7">${esc(p.summary)}</p>
          <div class="bar thin"><i style="width:${pct}%"></i></div>
        </div>`;
    }).join('')}
      <div class="sect"><h4>দেবদেবীর পূজা · ধাপে ধাপে</h4><div class="line"></div>
        <span class="mini muted">${bn(DEVA.length)} দেবতা</span></div>
      <p class="mini muted" style="line-height:1.75;margin:0 0 10px">
        ঘরে বসে ভাচুর্য়াল উপকরণে পূজা — প্রদীপ, ধূপ, অগরবাতি, ফুল, বেলপাতা, নৈবেদ্য,
        পঞ্চপ্রদীপ ও ঘণ্টা। প্রতিটি ধাপে মন্ত্র ও কী করতে হবে তা লেখা।</p>
      ${devaGrid()}
    </div><div style="height:20px"></div>`;
  }
  /* =================================================================
     পূজা দর্পণ — দেবদেবীর ভাচুর্য়াল পূজা (ধাপে ধাপে, মন্ত্র-সহ)
     ================================================================= */
  const DEVA = (typeof DARPAN_DEVAS !== 'undefined') ? DARPAN_DEVAS : [];
  const UPK = (typeof DARPAN_UPOKARAN !== 'undefined') ? DARPAN_UPOKARAN : {};
  const AAR = (typeof AARTI !== 'undefined') ? AARTI : {};
  const NADS = (typeof NAD !== 'undefined') ? NAD : {};
  const NENG = (typeof NAD_ENGINE !== 'undefined') ? NAD_ENGINE : null;
  const NPLR = (typeof NAD_PLAYER !== 'undefined') ? NAD_PLAYER : null;
  const AENG = (typeof AARTI_ENGINE !== 'undefined') ? AARTI_ENGINE : null;
  const ART_Q = '?v=86';                 /* ছবির ক্যাশ-বাস্ট */
  const artSrc = (kind, name) => `icons/${kind}/${name}.png${ART_Q}`;
  const ART_LOAD = 'this.parentNode.classList.add(\'has-art\')';
  const ART_FAIL = "this.remove()";
  const devaKey = id => id + ':' + TODAY_KEY;
  const devaDone = id => (S.deva && S.deva[devaKey(id)]) || [];
  const upkGlyph = k => ({ aasan: 'আ', jal: 'জ', ful: 'ফ', diya: 'দী', dhup: 'ধূ', agarbati: 'অ',
    chandan: 'চ', bel: 'বেল', durba: 'দূ', noi: 'নৈ', pancha: 'প', ganti: 'ঘ' }[k] || '•');

  /* ছবি লোড হলে ফলব্যাক গ্লিফ সরাও; না পেলে ফলব্যাক-ই থাকে (সৎ ফলব্যাক) */
  function hydrateArt() {
    document.querySelectorAll('img.artimg').forEach(img => {
      if (img.dataset.hyd) return;
      img.dataset.hyd = '1';
      const box = img.closest('[data-artbox]');
      const done = () => { if (box) box.classList.add('has-art'); };
      if (img.complete && img.naturalWidth > 0) return done();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', () => { img.remove(); }, { once: true });
    });
  }

  function devaGrid() {
    return `<div class="dv-grid">${DEVA.map(d => {
      const steps = darpanSteps(d);
      const done = Math.min(devaDone(d.id).length, steps.length);
      const pct = Math.round(done / steps.length * 100);
      return `<button class="dv-card" data-act="nav" data-to="#/puja/deva/${d.id}">
        <span class="dv-thumb" data-artbox>
          <img class="artimg dv-img" src="${d.id === 'ganesh' ? 'icons/reference/cal-deity.png' : artSrc('deva/card', d.id)}" alt="${esc(d.n)} দেবতার মূর্তি" loading="lazy" decoding="async" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
          <span class="dv-glyph fallback">${esc(d.murti || d.beej)}</span>
        </span>
        <span class="dv-cname">${esc(d.n)}</span>
        <span class="dv-csub">${esc(d.sub)}</span>
        <span class="dv-cbar"><i style="width:${pct}%"></i></span>
        <span class="dv-cmeta">${done ? bn(done) + '/' + bn(steps.length) + ' ধাপ · ' + bn(pct) + '%' : bn(steps.length) + ' ধাপ'}</span>
      </button>`;
    }).join('')}</div>`;
  }

  /* ---------------------------------------------------------------
     আরতি — প্রতিটি দেবতার নিজের আরতির কথা + অ্যাপের ভেতরেই তৈরি সুর
     (তানপুরা · মঞ্জীরা · ঢোল · হারমোনিয়াম; কোনো বাইরের অডিও ফাইল নেই)
     --------------------------------------------------------------- */
  /* পূজার নাদ — শঙ্খ · উলুধ্বনি · ঢাক · কাঁসর (ছবি + ধ্বনি দুটোই) */
  const nadOn = k => !!(NPLR && NPLR.isOn(k));

  function nadChip(k) {
    const o = NADS[k] || { n: k, t: '', g: '•' };
    const on = nadOn(k);
    return `<button class="nad-chip${on ? ' on' : ''}" data-act="nad" data-k="${k}" aria-pressed="${on ? 'true' : 'false'}"
        aria-label="${esc(o.n)} — ${on ? 'বন্ধ করুন' : 'চালু করুন'}" title="${esc(o.n)} · ${esc(o.t)} (চাপ দিলে চালু/বন্ধ)">
      <span class="nad-ic" data-artbox>
        <img class="artimg" src="icons/nad/${k}.png${ART_Q}" alt="" loading="lazy" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
        <span class="fallback">${esc(o.g || '•')}</span>
      </span>
      <b>${esc(o.n)}</b>
    </button>`;
  }
  /* বাঁয়ে শঙ্খ · উলু, ডানে ঢাক · কাঁসর — ঘণ্টা ও “সব বন্ধ” নিচে এক লাইনে */
  const NAD_LINKS = ['shankha', 'ulu', 'dhak', 'kashar', 'ganti'];
  const NAD_YT = (typeof window !== 'undefined' && window.NAD_YT) || {
    shankha: '7JLJPuSDuVM', ulu: 'PvzGO7b-VTM', dhak: '6eZ-3e5KbZo',
    kashar: 'FXKJQakZJMs', ganti: 'FYYBqNV9res'
  };
  const NAD_LEFT = ['shankha', 'ulu'];
  const NAD_RIGHT = ['dhak', 'kashar'];

  function nadRow(keys) {
    return `<div class="nad-row">${keys.map(nadChip).join('')}</div>`;
  }

  /* নিচের সারি — ঘণ্টা · সব বন্ধ (একই লাইনে, দুইটি ছবি সহ) */
  function nadFoot() {
    return `<div class="nad-foot">
      ${nadChip('ganti')}
      <button class="nad-chip nad-stop" data-act="nadStop" aria-label="সব নাদ বন্ধ করুন" title="সব নাদ বন্ধ — এক চাপে সব ধ্বনি থামবে">
        <span class="nad-ic" data-artbox>
          <img class="artimg" src="icons/nad/stop.png${ART_Q}" alt="" loading="lazy" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
          <span class="fallback">✕</span>
        </span>
        <b>সব বন্ধ</b>
      </button>
    </div>
    <p class="nad-note"></p>
    <p class="nad-links">ইউটিউবে শুনুন: ${NAD_LINKS.map(k => `<a href="https://youtu.be/${NAD_YT[k]}" target="_blank" rel="noopener noreferrer">${esc((NADS[k] || {}).n || k)}</a>`).join(' · ')}</p>`;
  }

  function nadNoteText() {
    const on = (NPLR && NPLR.active) ? NPLR.active() : [];
    if (!on.length) return 'নাদ বন্ধ — যেটি চালু করবেন, সেটি বাজতেই থাকবে';
    const nm = ks => ks.map(k => (NADS[k] || {}).n).join(' · ');
    const yt = on.filter(k => NPLR.mode(k) === 'yt');
    const sy = on.filter(k => NPLR.mode(k) === 'synth');
    const pd = on.filter(k => NPLR.mode(k) === 'pending');
    const parts = [];
    if (yt.length) parts.push('ইউটিউবে বাজছে: ' + nm(yt));
    if (sy.length) parts.push('অ্যাপের ধ্বনি: ' + nm(sy));
    if (pd.length) parts.push('লোড হচ্ছে: ' + nm(pd));
    const bl = on.filter(k => NPLR.blocked && NPLR.blocked(k));
    if (bl.length) parts.push('ইউটিউব আটকাচ্ছে (' + nm(bl) + ') — নিচের লিংক থেকে শুনুন');
    return parts.join(' · ');
  }

  /* সব নাদ-চিপের অবস্থা বাইরের সত্য (NAD_PLAYER) থেকে মিলিয়ে দেওয়া */
  function syncNadUI() {
    document.querySelectorAll('.nad-chip[data-k]').forEach(el => {
      const on = nadOn(el.dataset.k);
      el.classList.toggle('on', on);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      const nm = (NADS[el.dataset.k] || {}).n || '';
      el.setAttribute('aria-label', nm + ' — ' + (on ? 'বন্ধ করুন' : 'চালু করুন'));
      el.classList.toggle('synth', on && !!(NPLR && NPLR.mode(el.dataset.k) === 'synth'));
      el.classList.toggle('pending', on && !!(NPLR && NPLR.mode(el.dataset.k) === 'pending'));
    });
    document.querySelectorAll('.nad-note').forEach(n => { n.textContent = nadNoteText(); });
  }

  /* চাপ = চালু/বন্ধ; চালু থাকলে বাজতেই থাকে; একসঙ্গে সবগুলোও চলে */
  function toggleNad(el, k) {
    if (!NPLR || !NENG) { toast('এই ব্রাউজারে নাদ বাজানো যাচ্ছে না'); return; }
    /* চাপের মুহূর্তেই অডিও-কনটেক্সট চালু (iOS/Chrome-এর নিয়ম) */
    try { if (NENG.prime) NENG.prime(); } catch (e) { }
    const nowOn = NPLR.toggle(k);
    if (!S.sound) { S.sound = true; save('sound'); }
    syncNadUI();
    if (el && nowOn) { el.classList.remove('kick'); void el.offsetWidth; el.classList.add('kick'); }
    toast((NADS[k] || {}).n + (nowOn ? ' চালু — বাজছে ✓' : ' বন্ধ'));
  }

  function nadStopAll() {
    if (NPLR) NPLR.stopAll();
    syncNadUI();
    toast('সব নাদ বন্ধ হলো');
  }

  const aartiOf = id => AAR[id] || null;
  const aartiYT = t => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t + ' আরতি');

  function aartiState() {
    return AENG ? AENG.state() : { playing: false, id: null, line: 0, elapsed: 0, total: 0 };
  }

  /* চলমান আরতির সঙ্গে সব আরতি-কার্ড ও ওভারলে মিলিয়ে দেওয়া */
  function syncAartiUI() {
    const st = aartiState();
    document.querySelectorAll('[data-aarti]').forEach(box => {
      const on = st.playing && st.id === box.dataset.aarti;
      box.classList.toggle('playing', !!on);
      box.classList.toggle('paused', !on && st.id === box.dataset.aarti && st.line > 0);
      const btn = box.querySelector('[data-act="aartiPlay"]');
      if (btn) btn.innerHTML = on ? '⏸ থামান' : (st.id === box.dataset.aarti && st.elapsed > 0 ? '▶ আবার সুর' : '▶ অ্যাপের সুর');
      const bar = box.querySelector('.ar-bar > i');
      if (bar) bar.style.width = (on && st.total ? Math.round(st.elapsed / st.total * 100) : 0) + '%';
      const cur = box.querySelector('.ar-cur');
      if (cur) {
        const line = on ? ((AAR[st.id] || {}).lines || [])[st.line] : '';
        cur.textContent = line ? '“' + line + '”' : '';
      }
      box.querySelectorAll('.ar-line').forEach(el => {
        const i = +el.dataset.i;
        el.classList.toggle('on', on && i === st.line);
        el.classList.toggle('past', on && i < st.line);
      });
    });
  }

  /* পঙক্তি বদলালে চলমান লাইনটি চোখের সামনে আনা */
  function aartiFocusLine(i) {
    const box = document.querySelector('.dv-aarti');
    if (!box || !S.motion) return;
    const el = box.querySelector('.ar-line[data-i="' + i + '"]');
    if (!el) return;
    try {
      const r = el.getBoundingClientRect(), br = box.getBoundingClientRect();
      if (r.top < br.top + 30 || r.bottom > br.bottom - 30) {
        window.scrollTo({ top: window.scrollY + r.top - br.top - 60, behavior: 'smooth' });
      }
    } catch (e) { }
  }

  /* ইউটিউবে গাওয়া আরতি — চাপ দিলেই লোড হয় (আগে থেকে iframe নয়) */
  function openYt(id) {
    const a = aartiOf(id);
    if (!a || !a.yt) { if (a) window.open(aartiYT(a.t), '_blank', 'noopener'); return; }
    if (AENG && aartiState().playing) { AENG.stop(); syncAartiUI(); }
    document.querySelectorAll('.yt-slot').forEach(slot => {
      if (slot.dataset.for !== id) slot.innerHTML = '';
    });
    const slot = document.querySelector('.dv-aarti .yt-slot') || document.querySelector('.aarti .yt-slot');
    if (!slot) return;
    slot.dataset.for = id;
    slot.innerHTML = `<div class="yt-frame">
        <iframe src="https://www.youtube-nocookie.com/embed/${a.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
          title="${esc(a.t)} — ইউটিউব" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="yt-bar"><span>ইউটিউব থেকে বাজছে · ${esc(a.t)}</span>
        <button class="cbtn" data-act="ytClose">বন্ধ করুন</button></div>`;
    toast('ইউটিউবে গাওয়া আরতি চালু হলো');
  }

  function closeYt() {
    document.querySelectorAll('.yt-slot').forEach(slot => { slot.innerHTML = ''; delete slot.dataset.for; });
  }

  function startAarti(id) {
    closeYt();                         /* দুটো একসঙ্গে নয় */
    const a = aartiOf(id);
    if (!a) { toast('এই দেবতার আরতি এখনো যোগ হয়নি'); return; }
    if (!AENG) { toast('এই ব্রাউজারে সুর বাজানো যাচ্ছে না'); return; }
    if (!S.sound) { S.sound = true; save('sound'); }   /* নিজে চাপ দিলে শব্দ চালু */
    AENG.play(id, {
      onLine: i => { syncAartiUI(); aartiFocusLine(i); },
      onTick: () => syncAartiUI(),
      onEnd: () => { syncAartiUI(); bellTone(.7); toast(a.t + ' — আরতি সম্পূর্ণ 🌸'); }
    });
    syncAartiUI();
  }

  function aartiToggle(id) {
    const st = aartiState();
    if (st.playing && st.id === id) { AENG.stop(); syncAartiUI(); toast('আরতি থামানো হলো'); return; }
    startAarti(id);
  }

  /* পূজার পাতায় আরতি-কার্ড */
  function aartiCard(id) {
    const a = aartiOf(id);
    if (!a) return '';
    const st = aartiState();
    const on = st.playing && st.id === id;
    return `<div class="card pad dv-aarti${on ? ' playing' : ''}" data-aarti="${id}">
      <div class="ar-head">
        <span class="ar-ico" aria-hidden="true">${FLAME(18, 26)}</span>
        <span class="ar-htx">
          <b>আরতি · ${esc(a.t)}</b>
          <i>${esc(a.src)} · ${bn(a.lines.length)} পঙক্তি · ${bn(Math.round(a.bpm))} মাত্রা/মিনিট</i>
        </span>
        <span class="ar-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      </div>
      <div class="ar-lines">${a.lines.map((ln, i) =>
        `<p class="ar-line${on && st.line === i ? ' on' : ''}" data-i="${i}">${esc(ln)}</p>`).join('')}</div>
      <div class="ar-bar"><i style="width:${on && st.total ? Math.round(st.elapsed / st.total * 100) : 0}%"></i></div>
      <div class="ar-acts">
        <button class="btn gold sm ar-play" data-act="aartiPlay" data-id="${id}">${on ? '⏸ থামান' : '▶ অ্যাপের সুর'}</button>
        ${a.yt
          ? `<button class="btn maroon sm ar-ytb" data-act="ytPlay" data-id="${id}">▶ ইউটিউবে গান</button>`
          : `<a class="btn maroon sm ar-ytb" href="${aartiYT(a.t)}" target="_blank" rel="noopener">▶ ইউটিউবে খুঁজুন</a>`}
        <button class="cbtn cbtn-ico" data-act="bellRing"><img class="cbtn-art" src="icons/nad/ganti.png${ART_Q}" alt="" aria-hidden="true"/>ঘণ্টা</button>
        <a class="cbtn ar-yt" href="${aartiYT(a.t)}" target="_blank" rel="noopener">অন্য সংস্করণ</a>
      </div>
      <div class="yt-slot"></div>
      <p class="ar-note">${a.yt
        ? 'ইউটিউবে গাওয়া আরতি — চাপ দিলেই এখানেই বাজবে। '
        : 'এই দেবতার যাচাই করা ভিডিও এখনো যোগ করা হয়নি — সার্চ-লিংক কাজ করবে। '}
        “অ্যাপের সুর” নেট ছাড়াও বাজে (তানপুরা · মঞ্জীরা · ঢোল · হারমোনিয়াম)। ${a.own ? 'কথা প্রচলিত আরতি।' : 'কথা এই দেবের নামে রচিত নাম-আরতি।'}</p>
    </div>`;
  }

  /* ---- পুরোহিতের হাত: ঘণ্টা, আরতি, অর্পণ ---- */
  function bellTone(vol) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ac = bellTone.ac || (bellTone.ac = new AC());
      if (ac.state === 'suspended') ac.resume();
      const t0 = ac.currentTime;
      [[587.33, .22, 2.4], [880, .13, 1.9], [1318.5, .07, 1.4]].forEach(([f, g0, dur], n) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = n === 0 ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(f, t0);
        o.frequency.exponentialRampToValueAtTime(f * .996, t0 + dur);
        g.gain.setValueAtTime(.0001, t0);
        g.gain.exponentialRampToValueAtTime(g0 * (vol || 1), t0 + .012);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
        o.connect(g); g.connect(ac.destination);
        o.start(t0); o.stop(t0 + dur + .1);
      });
    } catch (e) {}
  }

  function openAarti(id) {
    const d = DEVA.find(x => x.id === id) || DEVA[0];
    if (!d) return;
    const a = aartiOf(d.id);
    let ov = document.getElementById('aarti');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'aarti'; ov.className = 'aarti';
      document.body.appendChild(ov);
    }
    ov.innerHTML = `<div class="aarti-card">
      <div class="aarti-stage" data-artbox>
        <div class="aarti-glow" aria-hidden="true"></div>
        <img class="artimg aarti-deva" src="icons/deva/${d.id}.png" alt="${esc(d.n)}"/>
        <span class="aarti-fb fallback">${esc(d.murti || d.beej)}</span>
        <div class="aarti-lamp" aria-hidden="true">
          <img class="artimg" src="icons/upakaran/diya.png" alt=""/>
          <span class="fallback">${FLAME(22, 32)}</span>
        </div>
      </div>
      <div class="aarti-ttl">${esc(d.n)} — আরতি</div>
      ${a ? `<div class="aarti-lyr" data-aarti="${d.id}">
        <div class="ar-head">
          <span class="ar-htx"><b>${esc(a.t)}</b><i>${esc(a.src)} · ${bn(a.lines.length)} পঙক্তি</i></span>
          <span class="ar-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        </div>
        <div class="ar-lines">${a.lines.map((ln, i) => `<p class="ar-line" data-i="${i}">${esc(ln)}</p>`).join('')}</div>
        <div class="ar-bar"><i style="width:0%"></i></div>
      </div>` : `<div class="aarti-note">এই দেবতার আরতির কথা এখনো যোগ হয়নি</div>`}
      <div class="aarti-note">প্রদীপ ঘুরছে — ঘণ্টা বাজিয়ে সঙ্গে গাইতে পারেন</div>
      ${a ? `<div class="yt-slot"></div>` : ''}
      <div class="aarti-acts">
        ${a ? `<button class="btn gold sm" data-act="aartiPlay" data-id="${d.id}">▶ অ্যাপের সুর</button>` : ''}
        ${a && a.yt ? `<button class="btn maroon sm" data-act="ytPlay" data-id="${d.id}">▶ ইউটিউবে গান</button>` : ''}
        ${a && !a.yt ? `<a class="btn maroon sm" href="${aartiYT(a.t)}" target="_blank" rel="noopener">▶ ইউটিউবে খুঁজুন</a>` : ''}
        <button class="btn ghost sm cbtn-ico" data-act="bellRing"><img class="cbtn-art" src="icons/nad/ganti.png${ART_Q}" alt="" aria-hidden="true"/>ঘণ্টা বাজান</button>
        <button class="btn ghost sm" data-act="aartiClose">থামান</button>
      </div>
    </div>`;
    try { hydrateArt(); } catch (e) {}
    requestAnimationFrame(() => { ov.classList.add('on'); syncAartiUI(); });
    bellTone(.9);
  }

  function closeAarti() {
    if (AENG && aartiState().playing) { AENG.stop(); syncAartiUI(); }
    closeYt();
    const ov = document.getElementById('aarti');
    if (!ov) return;
    ov.classList.remove('on');
    setTimeout(() => { if (ov && ov.parentNode) ov.remove(); }, 240);
  }

  function flyOffering(k) {
    const core = document.querySelector('.tcore');
    if (!core) return;
    const el = document.createElement('span');
    el.className = 'fly-in';
    el.innerHTML = `<img class="artimg" src="icons/upakaran/${k}.png" alt=""/><b>${FLAME(16, 24)}</b>`;
    core.appendChild(el);
    const img = el.querySelector('img');
    if (img) img.onerror = () => img.remove();
    setTimeout(() => { if (el.parentNode) el.remove(); }, 1100);
  }




  /* ---- অর্পণ: ট্যাপ কিংবা আঙুলে টেনে নিয়ে যাওয়া ---- */
  function offerStep(id, k) {
    const d = DEVA.find(x => x.id === id);
    if (!d) return false;
    const steps = darpanSteps(d);
    const done = devaDone(id).filter(i => i < steps.length);
    const i = Math.min(done.length, steps.length);
    if (!steps[i]) { toast('পূজা সম্পন্ন ✓ — এখন আরতি করুন'); return false; }
    if (steps[i].k !== k) {
      toast('এই ধাপে দরকার: ' + ((UPK[steps[i].k] || {}).n || ''));
      return false;
    }
    done.push(i);
    S.deva[devaKey(id)] = done; save('deva');
    U.keepTop = location.hash;
    bellTone(.45);
    toast(((UPK[k] || {}).n || '') + ' অর্পিত ✓');
    render();
    flyOffering(k);
    return true;
  }

  /* ৩ডি টেনে-নেওয়ার ইঞ্জিন — মাউস, আঙুল, পেন সবই (Pointer Events) */
  const DRAG = { on: false, moved: false, el: null, ghost: null, sx: 0, sy: 0, k: '', id: '', swiped: false };

  function dragTargetAt(x, y) {
    try { if (document.elementFromPoint) { const el = document.elementFromPoint(x, y); if (el) return el.closest('.tcore'); } } catch (e) {}
    const core = document.querySelector('.tcore');
    if (!core) return null;
    const r = core.getBoundingClientRect();
    const pad = 26;
    return (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) ? core : null;
  }

  function dragStart(e) {
    if (e.button !== undefined && e.button > 0) return;   /* ডান-ক্লিক/মাঝ-ক্লিক নয় */
    const card = e.target.closest && e.target.closest('.tside-it');
    if (!card || !card.dataset.k) return;
    DRAG.on = true; DRAG.moved = false; DRAG.swiped = false;
    DRAG.el = card; DRAG.k = card.dataset.k; DRAG.id = card.dataset.id;
    DRAG.sx = e.clientX; DRAG.sy = e.clientY;
  }

  function dragMove(e) {
    if (!DRAG.on) return;
    const dx = e.clientX - DRAG.sx, dy = e.clientY - DRAG.sy;
    if (!DRAG.moved) {
      /* অনুভূমিক ঝোঁকেই টানা শুরু — খাড়া টানে পৃষ্ঠা স্ক্রল হবে */
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
      DRAG.moved = true;
      const r = DRAG.el.getBoundingClientRect();
      const g = document.createElement('div');
      g.className = 'drag-ghost';
      g.innerHTML = `<img src="${artSrc('upakaran', DRAG.k)}" alt=""/><span>${esc((UPK[DRAG.k] || {}).n || '')}</span>`;
      g.style.left = (r.left + r.width / 2) + 'px';
      g.style.top = (r.top + r.height / 2) + 'px';
      document.body.appendChild(g);
      DRAG.ghost = g;
      DRAG.el.classList.add('grabbed');
      document.body.classList.add('dragging');
    }
    if (DRAG.ghost) {
      DRAG.ghost.style.left = e.clientX + 'px';
      DRAG.ghost.style.top = e.clientY + 'px';
      const over = !!dragTargetAt(e.clientX, e.clientY);
      DRAG.ghost.classList.toggle('hot', over);
      const core = document.querySelector('.tcore');
      if (core) core.classList.toggle('drop-hot', over);
    }
    if (e.cancelable) e.preventDefault();
  }

  function dragEnd(e) {
    if (!DRAG.on) return;
    const wasDrag = DRAG.moved;
    const k = DRAG.k, id = DRAG.id;
    const ghost = DRAG.ghost;
    DRAG.on = false; DRAG.moved = false; DRAG.ghost = null; DRAG.swiped = wasDrag;
    document.body.classList.remove('dragging');
    const core = document.querySelector('.tcore');
    if (core) core.classList.remove('drop-hot');
    if (DRAG.el) DRAG.el.classList.remove('grabbed');
    if (ghost) {
      const over = e.type !== 'pointercancel' && !!dragTargetAt(e.clientX, e.clientY);
      ghost.classList.add(over ? 'drop' : 'back');
      setTimeout(() => ghost.remove(), 320);
      if (over) {
        const ok = offerStep(id, k);
        if (!ok) bellTone(.25);
      }
    }
    if (wasDrag) {
      /* ড্র্যাগ শেষে যে click আসবে সেটি আর ধরা হবে না */
      U.swallowClick = true;
      setTimeout(() => { U.swallowClick = false; }, 400);
    }
    DRAG.el = null;
  }

  function initDragEngine() {
    document.addEventListener('pointerdown', dragStart, { passive: true });
    document.addEventListener('pointermove', dragMove, { passive: false });
    document.addEventListener('pointerup', dragEnd);
    document.addEventListener('pointercancel', dragEnd);
    /* ড্র্যাগের পরে ভুল করে আবার অর্পণ যেন না হয় */
    document.addEventListener('click', e => {
      if (!U.swallowClick) return;
      const onCard = e.target && e.target.closest && e.target.closest('.tside-it, .cmd-go');
      if (!onCard) return;                 /* অন্য কোথাও চাপলে বাধা নয় */
      U.swallowClick = false;
      e.stopPropagation();
      e.preventDefault();
    }, true);
  }

  /* ---------------------------------------------------------------
     মন্দির-পোস্টার: আইভরি-সোনালি ফ্রেম, কোণে ঝোলানো ঘণ্টা, মাঝে মূর্তি,
     দুই পাশে নম্বর-করা উপকরণ, নিচে শেষ ধাপের বড় বাক্স ও অর্থ-তালিকা,
     একেবারে নিচে কমান্ড-বার (ক্রম · মন্ত্র · বাটন)।
     --------------------------------------------------------------- */
  function devaPujaScreen(id) {
    const d = DEVA.find(x => x.id === id) || DEVA[0];
    if (!d) return pujaScreen();
    const steps = darpanSteps(d);
    const done = devaDone(d.id).filter(n => n < steps.length);
    const i = Math.min(done.length, steps.length);
    const cur = steps[i] || null;
    const doneKeys = done.map(n => steps[n] && steps[n].k).filter(Boolean);
    const has = k => doneKeys.includes(k);
    const pct = Math.round(done.length / steps.length * 100);
    const finished = !cur;
    const keys = [...new Set(steps.map(x => x.k))];

    const item = (st, n) => {
      const state = n < done.length ? 'done' : (n === i ? 'now' : 'todo');
      const up = UPK[st.k] || {};
      return `<button class="tside-it ${state}" data-act="devaOffer" data-id="${d.id}" data-k="${st.k}" data-n="${n}"
          aria-label="ধাপ ${bn(n + 1)} — ${esc(up.n || st.t)} (মূর্তির দিকে টেনে আনুন)" draggable="false"${state === 'todo' ? ' aria-disabled="true"' : ''}>
        <span class="tside-no">${state === 'done' ? ico('check', 'xs') : bn(n + 1)}</span>
        <span class="tside-ico" data-artbox>
          <img class="artimg tside-img" src="${artSrc('upakaran', st.k)}" alt="${esc(up.n || '')}" loading="lazy" decoding="async" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
          <span class="tside-glyph fallback">${upkGlyph(st.k)}</span>
        </span>
        <span class="tside-tx">
          <span class="tside-nm">${esc(up.n || st.t)}</span>
          <span class="tside-cap">${esc(st.t)}</span>
        </span>
      </button>`;
    };

    const last = steps.length - 1;
    const rest = last;
    const leftN = Math.ceil(rest / 2);
    const leftRows = steps.slice(0, leftN).map((st, n) => item(st, n)).join('');
    const rightRows = steps.slice(leftN, last).map((st, n) => item(st, n + leftN)).join('');
    const wideRow = item(steps[last], last);

    const legend = [
      ['aasan', 'আসন', 'শুদ্ধি ও সংকল্প'],
      ['jal', 'জল', 'পবিত্রতা'],
      ['ful', 'পুষ্প', 'ভক্তি'],
      ['dhup', 'ধূপ', 'গন্ধ-অর্পণ'],
      ['noi', 'নৈবেদ্য', 'সমর্পণ']
    ].map(([k, n, c]) => `<span class="m-leg">
        <span class="m-legic" data-artbox>
          <img class="artimg" src="${artSrc('upakaran', k)}" alt="${esc(n)}" loading="lazy" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
          <span class="fallback">${upkGlyph(k)}</span>
        </span>
        <b>${esc(n)}</b><i>${esc(c)}</i>
      </span>`).join('');

    const order = steps.map((st, n) =>
      `<span class="cmd-dot${n < done.length ? ' done' : ''}${n === i ? ' cur' : ''}" title="${esc((UPK[st.k] || {}).n || st.t)}">${n < done.length ? '✓' : bn(n + 1)}</span>`
    ).join('<span class="cmd-sep">›</span>');

    const cmd = finished ? `
      <div class="cmdbar done">
        <div class="cmd-order">${order}</div>
        <div class="cmd-now">
          <div class="cmd-h">পূজা সম্পূর্ণ 🌸 · ${bn(steps.length)} ধাপ</div>
          <div class="cmd-m">মন্ত্রহীনং ক্রিয়াহীনং ভক্তিহীনং মহেশ্বর। যৎ পূজিতং ময়া দেব পরিপূর্ণং তদস্তু মে॥</div>
        </div>
        <div class="cmd-acts">
          <button class="btn gold sm cmd-go" data-act="pujaAarti" data-id="${d.id}">আরতি করুন</button>
          <button class="cbtn" data-act="devaReset" data-id="${d.id}">আবার শুরু</button>
          <button class="cbtn" data-act="nav" data-to="#/puja">আরেক দেবতা</button>
        </div>
      </div>` : `
      <div class="cmdbar">
        <div class="cmd-order">${order}</div>
        <div class="cmd-now">
          <div class="cmd-h"><b>ধাপ ${bn(i + 1)}</b> · ${esc(cur.t)}</div>
          <div class="cmd-m">${esc(cur.m)}</div>
        </div>
        <div class="cmd-acts">
          <button class="btn gold sm cmd-go" data-act="devaOffer" data-id="${d.id}" data-k="${cur.k}">
            ${esc((UPK[cur.k] || {}).n || '')} দিন</button>
          <button class="cbtn" data-act="speak" data-text="${esc(cur.m)}">উচ্চারণ</button>
          <button class="cbtn cbtn-ico" data-act="bellRing"><img class="cbtn-art" src="icons/nad/ganti.png${ART_Q}" alt="" aria-hidden="true"/>ঘণ্টা</button>
          <button class="cbtn" data-act="pujaAarti" data-id="${d.id}">আরতি</button>
        </div>
      </div>`;

    return `${appbar(`${d.n} পূজা`, esc(d.sub), '#/puja')}
    <div class="pad mandir${has('diya') ? ' lamp-on' : ''}${finished ? ' finished' : ''}${d.id === 'saraswati' ? ' reference-puja' : ''}">
      ${d.id === 'saraswati' ? `<section class="ref-puja">
        <div class="ref-shrine" role="img" aria-label="সরস্বতী পূজার মন্দির"></div>
        <div class="ref-puja-info"><b>এক দেবতা · ${bn(steps.length)} ধাপ · ${bn(keys.length)} উপকরণ</b><span>আচমন থেকে প্রণাম — পুরোহিতের ক্রমে</span><small>${bn(pct)}% · ধাপ ${bn(Math.min(i+1, steps.length))}/${bn(steps.length)}</small></div>
        <div class="ref-scroll ref-materials">${keys.map((k,n) => `<button class="ref-material ${cur && cur.k === k ? 'current' : ''}" data-act="devaOffer" data-id="${d.id}" data-k="${k}" aria-label="${esc((UPK[k] || {}).n || k)} অর্পণ"><i>${bn(n+1)}</i><img src="${artSrc('upakaran',k)}" alt=""/><span>${esc((UPK[k] || {}).n || k)}</span></button>`).join('')}</div>
        <div class="ref-nads">${NAD_LINKS.map(nadChip).join('')}</div>
      </section>` : ''}
      <div class="m-frame">
        <i class="m-orn tl" aria-hidden="true"></i><i class="m-orn tr" aria-hidden="true"></i>
        <i class="m-orn bl" aria-hidden="true"></i><i class="m-orn br" aria-hidden="true"></i>
        <span class="m-bell lm" data-artbox>
          <img class="artimg" src="${artSrc('upakaran', 'ganti')}" alt="" onload="${ART_LOAD}" onerror="${ART_FAIL}"/><span class="fallback">ঘ</span>
        </span>
        <span class="m-bell rm" data-artbox>
          <img class="artimg" src="${artSrc('upakaran', 'ganti')}" alt="" onload="${ART_LOAD}" onerror="${ART_FAIL}"/><span class="fallback">ঘ</span>
        </span>

        <div class="m-head">
          <div class="m-eyebrow">সনাতন বিদ্যাপীঠ · পূজা দর্পণ</div>
          <h2 class="m-title"><span>॥</span> ${esc(d.n)} পূজা <span>॥</span></h2>
          <div class="m-flourish" aria-hidden="true"><i></i><b>✦</b><i></i></div>
          <p class="m-lead">এক দেবতা · ${bn(steps.length)} ধাপ · ${bn(keys.length)} উপকরণ</p>
          <p class="m-lead2">আচমন থেকে প্রণাম — পুরোহিতের ক্রমে</p>
        </div>

        <div class="tpl">
          <div class="tside left" aria-label="প্রথমার্ধের উপকরণ">${leftRows}${nadRow(NAD_LEFT)}</div>

          <div class="tcore" data-artbox>
            <div class="tc-halo" aria-hidden="true"></div>
            <div class="tc-arch" aria-hidden="true"></div>
            <img class="artimg t-figure" src="${artSrc('deva', d.id)}" alt="${esc(d.n)} দেবতার মূর্তি" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
            <span class="tc-glyph fallback">${esc(d.murti || d.beej)}</span>
            <div class="tc-pedestal" aria-hidden="true"><i></i></div>
            <div class="tc-lamps" aria-hidden="true">
              <span class="tc-di${has('diya') ? ' on' : ''}">${FLAME(13, 19)}</span>
              <span class="tc-dh${has('dhup') ? ' on' : ''}"><i></i><i></i><i></i></span>
              <span class="tc-pa${has('pancha') ? ' on' : ''}"><b></b><b></b><b></b><b></b><b></b></span>
            </div>
            <div class="tc-bar"><i style="width:${pct}%"></i></div>
            <div class="tc-pct">${finished ? 'সম্পূর্ণ 🌸' : `${bn(pct)}% · ধাপ ${bn(i + 1)}/${bn(steps.length)}`}</div>
          </div>

          <div class="tside right" aria-label="দ্বিতীয়ার্ধের উপকরণ">${rightRows}${nadRow(NAD_RIGHT)}</div>
        </div>

        ${nadFoot()}

        <div class="m-wide">${wideRow}</div>

        <div class="m-legend">
          <div class="m-legttl"><i></i><span>এই উপকরণগুলোর অর্থ কী?</span><i></i></div>
          <div class="m-legrow">${legend}</div>
        </div>

        <div class="m-foot"><span>সনাতন বিদ্যাপীঠ</span><i>যেখানে প্রতিটি আরতির একটি কারণ আছে</i></div>
      </div>

      <p class="m-hint">${d.id === 'saraswati' ? 'সোনালি আলোয় চিহ্নিত উপকরণে চাপ দিন অথবা নিচের বোতামে চাপ দিয়ে প্রতিটি ধাপ সম্পন্ন করুন। নাদ-বাটনে চাপ দিয়ে ধ্বনি চালু বা বন্ধ করা যায়।' : 'সোনালি রিং-এ যে উপকরণ, সেটি মূর্তির দিকে টেনে ছেড়ে দিন বা কার্ডে চাপ দিন। নাদ-বাটনে চাপ দিয়ে ধ্বনি চালু বা বন্ধ করা যায়।'}</p>

      ${aartiCard(d.id)}

      <div class="sect"><h4>এই পূজার মন্ত্র</h4><div class="line"></div>
        <span class="mini muted">${bn(d.mantras.length)}টি</span></div>
      <div class="card pad dv-mantras">
        <p class="mini muted" style="line-height:1.7;margin:0 0 8px">${esc(d.dhyan)}</p>
        ${d.mantras.map(([lab, m]) => `
          <div class="dv-mrow">
            <div style="flex:1;min-width:0">
              <div class="dv-mlab">${esc(lab)}</div>
              <div class="dv-mtxt">${esc(m)}</div>
            </div>
            <button class="iconbtn dv-play" data-act="speak" data-text="${esc(m)}" aria-label="শুনুন">${ico('play', 'sm')}</button>
          </div>`).join('')}
        <div class="dv-note">উপকরণ: ${esc(d.items)}</div>
      </div>

      <div class="card pad dv-disc">
        <b>সৎ নোট</b>
        <p class="mini muted">ধাপের ক্রম সাধারণ পূজা-পদ্ধতি অনুসারে; মন্ত্রগুলো প্রচলিত বীজ/নাম মন্ত্র ও সুপরিচিত ধ্যানশ্লোকের সংক্ষিপ্ত রূপ। পূর্ণ বিধি (ন্যাস, কল্প, সংস্কার) অঞ্চল ও সম্প্রদায়ভেদে ভিন্ন — গুরুর কাছে শেখাই শ্রেষ্ঠ। অসুস্থতা, বিগ্রহ-স্থাপনা বা বিশেষ ব্রতে পুরোহিতের পরামর্শ নিন।</p>
        <button class="btn ghost sm" data-act="nav" data-to="#/panjika">আজকের তিথি-নক্ষত্র দেখুন</button>
      </div>
    </div>
    <div style="height:190px"></div>
    ${cmd}`;
  }

  function pujaGuideScreen(id) {
    const p = DB.pujas.find(x => x.id === id) || DB.pujas[0];
    const k = p.id + ':' + TODAY_KEY;
    const done = S.puja[k] || [];
    return `${appbar(p.title, `${esc(p.time)} · ${bn(p.steps.length)} ধাপ`, '#/puja')}
    <div class="pad">
      <div class="card oath pad stack">
        <div class="diya" style="display:flex;gap:12px;align-items:center">
          ${FLAME(34, 46)}
          <div style="flex:1"><div class="mini muted">আজকের অগ্রগতি</div>
            <div style="font-size:12.5px;font-weight:600;margin-top:4px">${bn(done.length)}/${bn(p.steps.length)} ধাপ সম্পন্ন</div></div>
          <span class="pill ${done.length === p.steps.length ? 'ok' : ''}">${done.length === p.steps.length ? 'সম্পূর্ণ' : bn(Math.round(done.length / p.steps.length * 100)) + '%'}</span>
        </div>
        <div class="bar thin mt"><i style="width:${done.length / p.steps.length * 100}%"></i></div>
      </div>
      <div class="sect"><h4>পূজা ক্রম</h4><div class="line"></div><span class="mini muted">≈ ${bn(p.mins)} মিনিট</span></div>
      ${p.steps.map((s, i) => `
        <div class="card step ${done.includes(i) ? 'done' : ''}" data-act="pujaStep" data-id="${p.id}" data-i="${i}" role="button" tabindex="0">
          <div class="sno">${done.includes(i) ? ico('check', 'xs') : bn(i + 1)}</div>
          <div style="flex:1"><h5>${esc(s.t)}</h5><p>${esc(s.d)}</p>
            ${s.m ? `<div class="mantra">${esc(s.m)}</div>
              <button class="btn ghost sm" style="margin-top:8px" data-act="speak" data-text="${esc(s.m)}">${vico('play', 'xs')} উচ্চারণ শুনুন</button>` : ''}
          </div>
        </div>`).join('')}
      <button class="btn ghost block" data-act="nav" data-to="#/panjika">আজকের শুভ সময় দেখুন</button>
    </div><div style="height:20px"></div>`;
  }

  /* ============ ইউটিউব রিলস (বাংলা পঞ্জিকা) ============ */
  const bpList = () => {
    const p = (DB.panjika || {});
    return (p.reelsBP || []).concat(p.reelsDev || []);
  };
  const bpChans = () => (DB.panjika && DB.panjika.reelsCh) || [];
  const chOf = r => { const c = bpChans(); return (r && r[2] >= 0 && c[r[2]]) ? c[r[2]] : null; };
  /* রিলস কখনো শেষ না হয়: তালিকা পার হলে প্রাইম-স্ট্রাইডে নতুন ক্রমে ঘুরতে থাকে */
  const reelAt = (pool, i) => pool[i < pool.length ? i : (i * 7919) % pool.length];
  /* চ্যানেল-মিশ্র ক্রম: প্রতি রাউন্ডে একটি করে রিলস প্রতিটি চ্যানেল থেকে (round-robin),
     তাই প্রথম পাতাতেই সব চ্যানেলের রিলস আসে — শুধু বাংলা পঞ্জিকা নয়। ক্রমটি স্থির (seeded)। */
  let _bpOrder = null, _bpLen = 0;
  function bpOrdered() {
    const all = bpList();
    if (_bpOrder && _bpLen === all.length) return _bpOrder;
    const groups = new Map();
    all.forEach(r => {
      const k = r[2] >= 0 ? r[2] : -1;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(r);
    });
    let seed = (U.reelSeed || 20261118) % 2147483647;
    if (seed <= 0) seed = 20261118;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const keys = Array.from(groups.keys());
    for (let i = keys.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
    keys.forEach(k => {
      const a = groups.get(k);
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    });
    let maxLen = 0; keys.forEach(k => { if (groups.get(k).length > maxLen) maxLen = groups.get(k).length; });
    const out = [];
    for (let round = 0; round < maxLen; round++) keys.forEach(k => { const a = groups.get(k); if (round < a.length) out.push(a[round]); });
    _bpOrder = out; _bpLen = all.length;
    return out;
  }
  const REEL_CATS = ['কথা', 'গান', 'শাস্ত্র', 'ভাগবত'];
  const reelCat = r => (r && r[3]) || 'কথা';
  const BP_YT = id => 'https://www.youtube.com/shorts/' + id;
  const BP_THUMB = id => 'https://i.ytimg.com/vi/' + id + '/oar2.jpg';
  const bpReelCard = r => `<button class="reel" data-act="bpOpen" data-id="${r[0]}" style="--tint:#3a1b1b">
      <img class="rthumb" src="${BP_THUMB(r[0])}" alt="" loading="lazy" referrerpolicy="no-referrer"
        onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${r[0]}/hqdefault.jpg'">
      <span class="rbgtint"></span>
      <span class="rl-ico">${vico('play', 'sm')}</span>
      <span class="rl-txt"><b>${esc(r[1])}</b><i>${esc(reelCat(r))} · ${esc((chOf(r) || ['রিলস'])[0].trim())}</i></span></button>`;
  function reelsScreen() {
    const everything = bpOrdered();
    const chans = bpChans();
    const selCh = (U.reelCh == null) ? -1 : U.reelCh;
    const selCat = U.reelCat || 'all';
    const all = selCat === 'all' ? everything : everything.filter(r => reelCat(r) === selCat);
    const catChips = `<div class="cats" style="padding:0 0 8px">
        <button class="chip ${selCat === 'all' ? 'on' : ''}" data-act="reelCat" data-c="all">সব শ্রেণি · ${bn(everything.length)}</button>
        ${REEL_CATS.map(c => `<button class="chip ${selCat === c ? 'on' : ''}" data-act="reelCat" data-c="${c}">${c} · ${bn(everything.filter(r => reelCat(r) === c).length)}</button>`).join('')}
      </div>`;
    const pool = selCh >= 0 ? all.filter(r => r[2] === selCh) : all;
    const n = U.reelsN || 30;
    const shown = [];
    for (let i = 0; i < Math.min(n, selCh >= 0 ? pool.length : n); i++) shown.push(reelAt(pool, i));
    const topIdx = chans.map((c, i) => i).filter(i => chans[i][2] > 1).slice(0, 16);
    const chips = `<div class="cats" style="padding:0 0 10px">
        <button class="chip ${selCh < 0 ? 'on' : ''}" data-act="reelCh" data-i="-1">সব · ${bn(all.length)}</button>
        ${topIdx.map(i => `<button class="chip ${selCh === i ? 'on' : ''}" data-act="reelCh" data-i="${i}">${esc(chans[i][0].trim())} · ${bn(chans[i][2])}</button>`).join('')}
        <button class="chip" data-act="nav" data-to="#/reelsch">সব চ্যানেল (${bn(chans.length)}) ›</button>
        <button class="chip" data-act="reelsShuffle">🔀 অন্য ক্রমে</button>
      </div>`;
    const headNote = selCh >= 0
      ? `<b>${esc(chans[selCh][0].trim())}</b> চ্যানেলের <b>${bn(pool.length)}টি</b> রিলস${chans[selCh][1] ? ` · <a href="${chans[selCh][1]}" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">চ্যানেল দেখুন</a>` : ''}`
      : `<b>${bn(all.length)}টি রিলস</b>, <b>${bn(chans.length)}টি</b> হিন্দু ধর্মীয় ও ভক্তিমূলক চ্যানেল — <b>কথা</b> (প্রবচন, কথামৃত), <b>গান</b> (কীর্তন, ভজন, আরতি), <b>শাস্ত্র</b> (গীতা-রামায়ণ-পুরাণ পাঠ) ও <b>ভাগবত</b>। নিচে স্ক্রল করলে <b>নতুন রিলস আসতেই থাকবে</b>।`;
    return `${appbar('রিলস', 'Reels · হিন্দু ধর্মীয় ও ভক্তিমূলক', '#/home')}
    <div class="pad" style="padding-top:0">
      <p class="mini muted" style="margin:0 0 10px;line-height:1.75">${headNote}</p>
      ${catChips}
      ${chips}
      <div class="rgrid" id="reelGrid">${shown.map(r => bpReelCard(r)).join('')}</div>
      <div id="reelSentinel" style="height:8px"></div>
      <button class="btn ghost block mt" data-act="reelsMore" id="reelsMoreBtn">আরও ${bn(30)}টি দেখুন</button>
      <div style="height:16px"></div></div>`;
  }
  /* চ্যানেল-তালিকা: কে কোন চ্যানেল, কতগুলো রিলস */
  function chanListScreen() {
    const chans = bpChans();
    const rows = chans.map((c, i) => `<div class="card rowcard stack" style="margin-bottom:7px">
        <div style="flex:1;min-width:0">
          <div class="kv"><span class="ttl" style="font-size:.92rem">${esc(c[0].trim())}</span>
            <span class="pill">${bn(c[2])}টি</span></div>
          <div class="kv" style="margin-top:6px;gap:8px">
            <button class="act" data-act="reelCh" data-i="${i}">রিলস দেখুন</button>
            ${c[1] ? `<a class="act" href="${c[1]}" target="_blank" rel="noopener noreferrer">চ্যানেল ↗</a>` : ''}
          </div></div></div>`).join('');
    return `${appbar('চ্যানেল', 'Channels · '+chans.length, '#/reels')}
    <div class="pad" style="padding-top:0">
      <p class="mini muted" style="margin:0 0 12px;line-height:1.75">যেসব ইউটিউব চ্যানেল থেকে রিলসগুলো নেওয়া হয়েছে — <b>${bn(chans.length)}টি চ্যানেল</b>, সবই হিন্দু ধর্মীয় বা ভক্তিমূলক। রিলসের সংখ্যা অনুযায়ী সাজানো।</p>
      ${rows}
      <div style="height:16px"></div></div>`;
  }
  /* নিচে পৌঁছালেই স্বয়ংক্রিয়ভাবে আরও রিলস জুড়ে যায় */
  function attachReelScroll() {
    const sent = document.getElementById('reelSentinel');
    if (!sent || typeof IntersectionObserver === 'undefined') return;
    if (U.reelObs) { try { U.reelObs.disconnect(); } catch (e) {} }
    U.reelObs = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) ACTIONS.reelsMore();
    }, { root: document.getElementById('view'), rootMargin: '600px' });
    U.reelObs.observe(sent);
  }
  /* ---- রিলস ফিড: উপর-নিচ সোয়াইপ, অটো-প্লে, অনন্ত ---- */
  const reelSoundOn = () => S.reelMute !== true;
  const posterInner = id => `<img class="rthumb" src="${BP_THUMB(id)}" alt="" loading="lazy" referrerpolicy="no-referrer"
      onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'">
      <span class="rshade"></span>
      <button class="rplay" data-act="reelPlay2" data-id="${id}" aria-label="শব্দ নিয়ে চালান">${vico('play', 'sm')}</button>`;
  /* পর্দায় যে রিলসটি সবচেয়ে বেশি দেখা যাচ্ছে সেটিই নিজে থেকে চলে, বাকিগুলো থেমে যায় */
  function activateFeedSection(sec) {
    if (!sec || sec.dataset.playing === '1') return;
    const id = sec.dataset.id, box = sec.querySelector('.rvp');
    if (!box) return;
    document.querySelectorAll('#rfeed .rsec').forEach(o => {
      if (o !== sec && o.dataset.playing === '1') {
        o.dataset.playing = '0';
        const b = o.querySelector('.rvp');
        if (b) b.innerHTML = posterInner(o.dataset.id);
      }
    });
    const mute = reelSoundOn() ? 0 : 1;
    box.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=${mute}&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}"
      title="রিলস" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    sec.dataset.playing = '1';
  }
  function attachFeedPlay() {
    const box = document.getElementById('rfeed');
    if (!box || typeof IntersectionObserver === 'undefined') return;
    if (U.playObs) { try { U.playObs.disconnect(); } catch (e) {} }
    U.playObs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) activateFeedSection(e.target); });
    }, { root: box, rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    box.querySelectorAll('.rsec').forEach(sc => U.playObs.observe(sc));
  }
  const FEED_PAGE = 12;
  function feedItemHTML(r, abs) {
    const ch = chOf(r);
    const saved = !!(S.savedReels && S.savedReels[r[0]]);
    return `<section class="rsec" data-abs="${abs}" data-id="${r[0]}">
      <div class="rvp" data-id="${r[0]}">${posterInner(r[0])}</div>
      <div class="rmeta">
        <div class="rt">${esc(r[1])}</div>
        <div class="rc">${ch ? esc(ch[0].trim()) : 'রিলস'}${ch && ch[1] ? ` · <a href="${ch[1]}" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">চ্যানেল ↗</a>` : ''}</div>
        <div class="racts">
          <button class="ract ${saved ? 'on' : ''}" data-act="reelSave" data-id="${r[0]}">${saved ? '✓ সেভ হয়েছে' : '⤓ সেভ করুন'}</button>
          <button class="ract" data-act="reelThumb" data-id="${r[0]}">ছবি ডাউনলোড ⤓</button>
          <button class="ract" data-act="reelCopy" data-id="${r[0]}">লিংক কপি</button>
          <a class="ract" href="${BP_YT(r[0])}" target="_blank" rel="noopener noreferrer">ইউটিউবে ↗</a>
        </div>
      </div>
    </section>`;
  }
  function reelVideoScreen(id) {
    const pool = bpOrdered();
    const start = Math.max(0, pool.findIndex(x => x[0] === id));
    U.reelAbs = start;
    const rows = [];
    for (let k = 0; k < FEED_PAGE; k++) rows.push(feedItemHTML(reelAt(pool, start + k), start + k));
    const savedN = Object.keys(S.savedReels || {}).length;
    return `${appbar('রিলস', 'সোয়াইপ করে উপর-নিচ', '#/reels')}
    <div class="pad" style="padding-top:0">
      <div class="rhead mini muted"><span>▲ নিচে সোয়াইপ = পরের রিলস · অটো প্লে · ${bn(start + 1)}/${bn(pool.length)}</span>
        <span style="display:flex;gap:6px">
          <button class="ract" data-act="reelSound">${reelSoundOn() ? '🔊 শব্দ চালু' : '🔇 নীরব'}</button>
          <button class="ract" data-act="nav" data-to="#/reelssaved">সেভ (${bn(savedN)})</button>
        </span></div>
      <div class="rfeed" id="rfeed">${rows.join('')}<div id="rfeedEnd" style="height:1px"></div></div>
      <div class="mini muted" style="margin-top:8px;line-height:1.7">▶ <b>অটো প্লে</b> — স্ক্রল করলেই দেখানো রিলস <b>শব্দ নিয়ে</b> নিজে থেকে চলে; নীরব করতে চাইলে উপরে <b>🔊 শব্দ চালু</b> বাটনে চেপে মিউট করুন (পছন্দ মনে রাখা হয়)। ⤓ <b>সেভ করুন</b> — রিলসটি তালিকায় জমা থাকে ও ইন্টারনেট ছাড়াই তালিকা দেখা যায়। <b>ছবি ডাউনলোড</b> — থাম্বনেইল ছবি ফাইল হিসেবে সেভ হয়। ইউটিউব ভিডিও ফাইল সরাসরি ডাউনলোড করতে দেয় না, তাই ভিডিওর জন্য “ইউটিউবে ↗” বাটন।</div>
    </div>`;
  }
  function savedReelsScreen() {
    const all = bpList();
    const saved = S.savedReels || {};
    const ids = Object.keys(saved).sort((a, b) => (saved[b].ts || 0) - (saved[a].ts || 0));
    const rows = ids.map(id => {
      const r = all.find(x => x[0] === id);
      const s0 = saved[id];
      return `<div class="card rowcard stack" style="margin-bottom:8px">
        <img src="${BP_THUMB(id)}" alt="" style="width:52px;height:92px;object-fit:cover;border-radius:10px" loading="lazy" referrerpolicy="no-referrer">
        <div style="flex:1;min-width:0">
          <div class="ttl" style="font-size:.9rem;line-height:1.5">${esc(r ? r[1] : (s0.t || 'রিলস'))}</div>
          <div class="mini muted" style="margin-top:4px">${esc(s0.ch || (r && chOf(r) ? chOf(r)[0] : 'রিলস'))}</div>
          <div class="racts">
            <button class="ract" data-act="nav" data-to="#/reels/${id}">চালান</button>
            <a class="ract" href="${BP_YT(id)}" target="_blank" rel="noopener noreferrer">ইউটিউবে ↗</a>
            <button class="ract" data-act="reelUnsave" data-id="${id}">মুছুন</button>
          </div></div></div>`;
    }).join('');
    return `${appbar('সেভ করা রিলস', 'Saved · '+ids.length, '#/reels')}
    <div class="pad" style="padding-top:0">
      <p class="mini muted" style="margin:0 0 12px;line-height:1.75">সেভ করা রিলস এখানে জমা থাকে — ইন্টারনেট ছাড়াও তালিকা ও ছবি দেখা যায়। ভিডিও চালাতে ইন্টারনেট লাগবে।</p>
      ${rows || '<div class="card empty"><h5>এখনো কিছু সেভ করা হয়নি</h5><p>রিলস ফিডে “⤓ সেভ করুন” চাপলে এখানে জমা হবে।</p></div>'}
      <div style="height:16px"></div></div>`;
  }
  /* ফিডের শেষে পৌঁছালে আরও রিলস জুড়ে দেওয়া হয় (স্ক্রল থামে না) */
  function attachFeedScroll() {
    const box = document.getElementById('rfeed');
    if (!box || typeof IntersectionObserver === 'undefined') return;
    if (U.feedObs) { try { U.feedObs.disconnect(); } catch (e) {} }
    const pool = bpOrdered();
    U.feedObs = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return;
      const end = document.getElementById('rfeedEnd');
      if (!end) return;
      let html = '';
      for (let k = 0; k < 6; k++) {
        const abs = (U.reelAbs || 0) + 1 + k;
        html += feedItemHTML(reelAt(pool, abs), abs);
      }
      U.reelAbs = (U.reelAbs || 0) + 6;
      end.insertAdjacentHTML('beforebegin', html);
      U.feedObs.disconnect();
      attachFeedScroll();
      attachFeedPlay();
    }, { root: box, rootMargin: '900px' });
    const end = document.getElementById('rfeedEnd');
    if (end) U.feedObs.observe(end);
  }

  /* ---------------------------------------------------------- 9. panjika */
  function panjikaScreen() {
    const bt = bengaliDate(TODAY);
    if (U.panjika.by == null) { U.panjika.by = bt.year; U.panjika.bm = bt.m; }
    const isBn = U.panjika.view === 'bn';
    const selKey = U.panjika.day;
    const sel = panjikaFor(selKey);
    const selDate = new Date(selKey + 'T00:00:00');
    const selBn = bengaliDate(selDate);

    let head, cellsHtml, nav, note, monthStart, monthEnd;

    if (isBn) {
      const y = U.panjika.by, m = U.panjika.bm;
      const cells = banglaMonthCells(y, m);
      const lead = cells.length ? cells[0].date.getDay() : 0;
      monthStart = cells.length ? key(cells[0].date) : '0000-00-00';
      monthEnd = cells.length ? key(cells[cells.length - 1].date) : '9999-99-99';
      cellsHtml = Array.from({ length: lead }, () => '<div class="day mut"></div>').join('') +
        cells.map(c => {
          const k = key(c.date), pk = panjikaFor(k), ek = pk.ekadashi, now = k === TODAY_KEY, selected = k === selKey;
          return `<button class="day bn-day ${ek ? 'ek' : ''} ${pk.fest ? 'fest' : ''} ${now ? 'now' : ''} ${selected ? 'sel' : ''}" data-act="pday" data-k="${k}"
            title="${esc(pk.fest || '')}" aria-label="${bn(c.d)} ${BM_NAMES[m]} ${bn(y)}">
            <span class="bnn">${bn(c.d)}</span><span class="eng">${bn(c.date.getDate())}</span></button>`;
        }).join('');
      head = `${BM_NAMES[m]} ${bn(y)} বঙ্গাব্দ`;
      nav = `<button class="act" data-act="pbm" data-d="-1">◀</button><button class="act" data-act="pbm" data-d="1">▶</button>`;
      note = `ঋতু: ${BM_SEASON[m]} · ${bn(cells.length)} দিন · ইংরেজি ${bn(cells.length ? cells[0].date.getDate() : 0)} ${BN_MONTH[cells.length ? cells[0].date.getMonth() : 0]} – ${bn(cells.length ? cells[cells.length - 1].date.getDate() : 0)} ${BN_MONTH[cells.length ? cells[cells.length - 1].date.getMonth() : 0]}`;
    } else {
      const { y, m } = U.panjika;
      const first = new Date(y, m - 1, 1);
      const startDow = first.getDay();
      const daysInMonth = new Date(y, m, 0).getDate();
      const prevDays = new Date(y, m - 1, 0).getDate();
      const cells = [];
      for (let i = startDow - 1; i >= 0; i--) cells.push({ d: prevDays - i, mut: true, date: new Date(y, m - 2, prevDays - i) });
      for (let d = 1; d <= daysInMonth; d++) cells.push({ d, date: new Date(y, m - 1, d) });
      while (cells.length % 7) cells.push({ d: cells.length - startDow - daysInMonth + 1, mut: true, date: new Date(y, m - 1, daysInMonth + (cells.length - startDow - daysInMonth + 1)) });
      monthStart = key(new Date(y, m - 1, 1));
      monthEnd = key(new Date(y, m - 1, daysInMonth));
      cellsHtml = cells.map(c => {
        const k = key(c.date), pk = panjikaFor(k), ek = pk.ekadashi, now = k === TODAY_KEY, selected = k === selKey;
        const bd = bengaliDate(c.date);
        return `<button class="day bn-day ${c.mut ? 'mut' : ''} ${ek ? 'ek' : ''} ${pk.fest ? 'fest' : ''} ${now ? 'now' : ''} ${selected ? 'sel' : ''}" data-act="pday" data-k="${k}" title="${esc(pk.fest || '')}">
          <span class="bnn">${bn(c.d)}</span><span class="eng">${bn(bd.d)}</span></button>`;
      }).join('');
      head = `${BN_MONTH[m - 1]} ${bn(y)}`;
      nav = `<button class="act" data-act="pmonth" data-d="-1">◀</button><button class="act" data-act="pmonth" data-d="1">▶</button>`;
      note = `বঙ্গাব্দ ${bn(bt.year)} · ${bn(daysInMonth)} দিন`;
    }

    const festList = Object.keys(P.festivals).filter(k => k >= monthStart && k <= monthEnd).sort();

    return `${appbar('পঞ্জিকা ও একাদশী', 'Panjika · বঙ্গাব্দ ' + bn(bt.year))}
    <div class="pad" style="padding-top:0">
      <div class="segment">
        <button class="${isBn ? 'on' : ''}" data-act="pview" data-v="bn">বাংলা (বঙ্গাব্দ)</button>
        <button class="${!isBn ? 'on' : ''}" data-act="pview" data-v="en">ইংরেজি</button>
      </div>

      <div class="card pad" style="margin-bottom:12px;border:1px solid rgba(215,169,79,.45);background:linear-gradient(160deg,rgba(215,169,79,.13),rgba(215,169,79,.03))">
        <div class="kv"><div style="min-width:0"><div class="mini muted">নতুন যোগ হয়েছে — জ্যোতিষ</div>
          <div class="ttl" style="margin-top:3px;font-size:.98rem">বিয়ে-শুভদিন · মৃতদোষ · রাশি নির্ণয়</div></div>
          <span class="pill ok">নতুন</span></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px">
          <button data-act="pjsub" data-s="bibaho" style="padding:10px 6px;border-radius:12px;border:1px solid rgba(215,169,79,.35);background:rgba(215,169,79,.08);color:inherit;font-family:inherit;font-size:.82rem;font-weight:700;line-height:1.5;cursor:pointer">বিয়ে-শুভদিন<div class="mini muted" style="font-weight:400;margin-top:3px">বিবাহ লগ্ন</div></button>
          <button data-act="pjsub" data-s="mritdosh" style="padding:10px 6px;border-radius:12px;border:1px solid rgba(215,169,79,.35);background:rgba(215,169,79,.08);color:inherit;font-family:inherit;font-size:.82rem;font-weight:700;line-height:1.5;cursor:pointer">মৃতদোষ<div class="mini muted" style="font-weight:400;margin-top:3px">পাদ ও শান্তি</div></button>
          <button data-act="pjsub" data-s="rashi" style="padding:10px 6px;border-radius:12px;border:1px solid rgba(215,169,79,.35);background:rgba(215,169,79,.08);color:inherit;font-family:inherit;font-size:.82rem;font-weight:700;line-height:1.5;cursor:pointer">রাশি নির্ণয়<div class="mini muted" style="font-weight:400;margin-top:3px">জন্মলগ্ন ও গ্রহ</div></button>
        </div>
      </div>

      <div class="card oath pad mt">
        <div class="kv"><div><div class="mini muted">নির্বাচিত দিন</div>
          <div class="display" style="font-size:15px;margin-top:3px">${bn(selBn.d)} ${selBn.month}, ${BN_DAY[selDate.getDay()]}</div>
          <div class="mini muted" style="margin-top:3px">${bn(selDate.getDate())} ${BN_MONTH[selDate.getMonth()]} ${bn(selDate.getFullYear())} · ${bn(selBn.year)} বঙ্গাব্দ</div></div>
          <span class="pill">${sel.tithi}</span></div>
        ${sel.fest ? `<div class="mini" style="color:var(--gold-300);margin-top:8px">✦ ${esc(sel.fest)}</div>` : ''}
        <div class="grid2 mt">
          <div class="stat"><div class="k">শুভ সময়</div><div class="v" style="color:var(--ok)">${sel.shubho}</div></div>
          <div class="stat"><div class="k">রাহুকাল</div><div class="v" style="color:var(--danger)">${sel.rahu}</div></div>
          <div class="stat"><div class="k">সূর্যোদয়</div><div class="v">${sel.sunrise}</div></div>
          <div class="stat"><div class="k">ঋতু</div><div class="v">${selBn.season}</div></div>
        </div>
        <button class="btn ghost block mt" data-act="pjsub" data-s="daily">দিনের মুহূর্ত ও পঞ্চাঙ্গ দেখুন</button>
      </div>

      <div class="sect"><h4>${head}</h4><div class="line"></div>${nav}</div>
      <div class="card pad">
        <div class="cal">${BN_DAYS.map(d => `<div class="h">${d}</div>`).join('')}${cellsHtml}</div>
        <div class="legend"><span><i style="background:#7e2127;border:1px solid #d7a94f"></i>একাদশী</span>
          <span><i style="background:transparent;border:1px solid var(--gold-400)"></i>উৎসব</span>
          <span><i style="background:rgba(215,169,79,.5)"></i>আজ</span>
          <span class="mini muted">${note}</span></div>
      </div>

      <div class="sect"><h4>ব্রত ও উৎসব</h4><div class="line"></div></div>
      ${festList.length ? festList.map(k => {
        const d = new Date(k + 'T00:00:00'), diff = Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
        const bD = bengaliDate(d);
        return `<div class="card rowcard stack"><div class="datebox"><b>${bn(bD.d)}</b><i>${bD.month.slice(0, 4)}</i></div>
          <div style="flex:1"><div class="kv"><span class="ttl">${esc(P.festivals[k])}</span>
            <span class="pill">${diff === 0 ? 'আজ' : diff > 0 ? bn(diff) + ' দিন' : 'সম্পন্ন'}</span></div>
            <div class="mini muted" style="margin-top:5px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} · ${panjikaFor(k).tithi} · শুভ ${panjikaFor(k).shubho}</div></div></div>`;
      }).join('') : '<p class="tiny muted">এই মাসে কোনো ব্রত নেই।</p>'}

      ${(() => {
        const f = nextFestInfo();
        if (!f) return '';
        return `<div class="sect"><h4>আসন্ন উৎসব</h4><div class="line"></div><span class="mini muted">${f.days === 0 ? 'আজ' : bn(f.days) + ' দিন বাকি'}</span></div>
        <div class="card pad" style="border:1px solid rgba(215,169,79,.3)">
          <div class="kv"><div style="min-width:0"><div class="ttl" style="color:var(--gold-200)">${esc(f.name)}</div>
            <div class="mini muted" style="margin-top:5px">${bn(new Date(f.k + 'T00:00:00').getDate())} ${BN_MONTH[new Date(f.k + 'T00:00:00').getMonth()]} · ${panjikaFor(f.k).tithi}</div></div>
            <span class="pill">${f.days === 0 ? 'আজ' : bn(f.days) + ' দিন'}</span></div>
          <div style="display:flex;gap:8px;margin-top:11px">
            <button class="btn ghost sm" style="flex:1" data-act="notifyAsk">${S.notifyOn ? 'রিমাইন্ডার বন্ধ করুন' : 'রিমাইন্ডার চালু করুন'}</button>
            <button class="btn ghost sm" style="flex:1" data-act="pjsub" data-s="broto">পুরো তালিকা</button>
          </div>
        </div>`;
      })()}

      <div class="sect"><h4>পঞ্জিকার বিভাগ</h4><div class="line"></div><span class="mini muted">সবই অ্যাপের ভেতরে</span></div>
      <div class="card pad xlinks">
        <div class="xchips">${PJ_SUBS.map(([sl, lb]) => pjChip(sl, lb, '')).join('')}</div>
        <div class="mini muted" style="margin-top:10px;line-height:1.65">ব্রত, একাদশী, পূর্ণিমা, অমাবস্যা, পূজা, বিশেষ দিন, দিবস, দৈনিক পঞ্জিকা, শুভকর্মের দিন, <b>বিয়ে-শুভদিন</b>, <b>মৃতদোষ</b>, <b>রাশি নির্ণয়</b>, পঞ্চাঙ্গ, রাশিফল, গ্রহণ ও ক্যালেন্ডার — সব এখানেই খুলবে।
        তারিখ মিলিয়ে নেওয়া হয়েছে <a href="https://banglapanjika.com/" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">বাংলা পঞ্জিকা</a>-র তালিকা থেকে।</div>
      </div>

      <p class="mini muted" style="margin-top:16px;line-height:1.7">বঙ্গাব্দ গণনা: বাংলাদেশ সংশোধিত পঞ্জিকা অনুযায়ী <b>বৈশাখ ১ = ১৪ এপ্রিল</b>. উপরের ছোট সংখ্যা ইংরেজি তারিখ। কিছু ক্ষেত্রে আঞ্চলিক পঞ্জিকায় ১ দিন পার্থক্য হতে পারে। তারিখ ও ব্রতের তালিকা মিলিয়ে নেওয়া হয়েছে <a href="https://banglapanjika.com/" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">বাংলা পঞ্জিকা</a> থেকে; বিস্তারিত জানতে মূল সাইট দেখুন।</p>
    </div><div style="height:20px"></div>`;
  }

  /* ---------------- পঞ্জিকা: ভেতরের ১৬টি বিভাগ ---------------- */
  const PJ_SUBS = [
    ['broto', 'ব্রতের তালিকা'], ['ekadashi', 'একাদশী'], ['purnima', 'পূর্ণিমা'], ['amavasya', 'অমাবস্যা'],
    ['puja', 'পূজার দিন'], ['bishesh', 'বিশেষ দিন'], ['dibosh', 'দিবস'], ['daily', 'দৈনিক পঞ্জিকা'],
    ['shubho', 'শুভকর্মের দিন'], ['bibaho', 'বিয়ে-শুভদিন'], ['mritdosh', 'মৃতদোষ'], ['rashi', 'রাশি নির্ণয়'], ['panchang', 'পঞ্চাঙ্গ'], ['rashifal', 'রাশিফল'], ['grohon', 'গ্রহণ'], ['calendar', 'ক্যালেন্ডার']
  ];
  const pjChip = (slug, label, on) =>
    `<button class="xlink ${on ? 'on' : ''}" data-act="pjsub" data-s="${slug}">${label}</button>`;
  const pjChips = active =>
    `<div class="xchips">${PJ_SUBS.filter(([sl]) => sl !== 'calendar').map(([s, l]) => pjChip(s, l, s === active)).join('')}</div>`;
  const pjPairs = () => Object.keys(P.festivals).sort().map(k => [k, P.festivals[k]]);
  const pjWhen = k => {
    const d = new Date(k + 'T00:00:00'), diff = Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
    return { d, diff };
  };
  function pjRow(k, name, note) {
    const { d, diff } = pjWhen(k), bD = bengaliDate(d), pk = panjikaFor(k);
    if (!note && /একাদশী/.test(name)) note = `পারণ ${pk.mh.parana[0]}–${pk.mh.parana[1]}`;
    return `<div class="card rowcard stack"><div class="datebox"><b>${bn(bD.d)}</b><i>${bD.month.slice(0, 4)}</i></div>
      <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${esc(name)}</span>
        <span class="pill">${diff === 0 ? 'আজ' : diff > 0 ? bn(diff) + ' দিন' : 'সম্পন্ন'}</span></div>
        <div class="mini muted" style="margin-top:5px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${BN_DAY[d.getDay()]} · ${pk.tithi}${note ? ' · ' + note : ''}</div></div></div>`;
  }
  const pjShell = (title, sub, body, active) =>
    `${appbar(title, sub, '#/panjika')}
    <div class="pad" style="padding-top:0">
      ${pjChips(active)}
      <div style="height:12px"></div>${body}
    </div><div style="height:20px"></div>`;
  const pjEmpty = msg => `<p class="tiny muted" style="padding:14px 2px">${msg}</p>`;

  function pjList(title, sub, active, filter, desc) {
    const rows = pjPairs().filter(([k, n]) => filter(k, n));
    const shown = U.panjika.all ? rows : rows.filter(([k]) => k >= TODAY_KEY);
    const body = `<p class="mini muted" style="margin:0 0 12px;line-height:1.65">${desc}</p>
      <div class="kv" style="margin-bottom:10px"><span class="mini muted">মোট ${bn(rows.length)}টির মধ্যে ${bn(shown.length)}টি দেখানো হচ্ছে</span>
        <button class="act" data-act="pjall">${U.panjika.all ? 'শুধু আসন্ন' : 'সব দেখুন'}</button></div>
      ${shown.length ? shown.slice(0, 150).map(([k, n]) => pjRow(k, n)).join('') : pjEmpty('এই তালিকায় এখন কোনো দিন নেই।')}`;
    return pjShell(title, sub, body, active);
  }

  function pjDaily() {
    const k = U.panjika.day || TODAY_KEY, pk = panjikaFor(k), d = new Date(k + 'T00:00:00'), bD = bengaliDate(d);
    const body = `
      <div class="sect" style="margin-top:4px"><h4>${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${BN_DAY[d.getDay()]}</h4>
        <div class="line"></div>
        <button class="act" data-act="pjday" data-d="-1">◀</button><button class="act" data-act="pjnow">আজ</button>
        <button class="act" data-act="pjday" data-d="1">▶</button></div>
      <div class="card oath pad">
        <div class="kv"><div><div class="mini muted">বঙ্গাব্দ</div>
          <div class="display" style="font-size:15px;margin-top:3px">${bn(bD.d)} ${bD.month} ${bn(bD.year)}</div>
          <div class="mini muted" style="margin-top:3px">${bD.season} ঋতু</div></div>
          <span class="pill">${pk.tithi}</span></div>
        ${dateObservances(k).length ? `<div class="mini" style="color:var(--gold-300);margin-top:9px;line-height:1.7">${dateObservances(k).map(o => `✦ ${esc(o.label)}: ${esc(o.value)}`).join('<br/>')}</div>` : ''}
        <div class="mini muted" style="margin-top:9px;line-height:1.5">তথ্য ঢাকাভিত্তিক আনুমানিক গণনা ও অ্যাপের সীমিত তালিকা থেকে। স্থানীয় পঞ্জিকা মিলিয়ে নিন।</div>
        <div class="grid2 mt">
          <div class="stat"><div class="k">নক্ষত্র</div><div class="v">${pk.nak}</div></div>
          <div class="stat"><div class="k">তিথি</div><div class="v">${pk.tithi}</div></div>
          <div class="stat"><div class="k">সূর্যোদয়</div><div class="v">${pk.sunrise}</div></div>
          <div class="stat"><div class="k">সূর্যাস্ত</div><div class="v">${pk.sunset}</div></div>
          <div class="stat"><div class="k">শুভ সময়</div><div class="v" style="color:var(--ok)">${pk.shubho}</div></div>
          <div class="stat"><div class="k">রাহুকাল</div><div class="v" style="color:var(--danger)">${pk.rahu}</div></div>
        </div>
        ${pk.ekadashi ? `<div class="mini" style="margin-top:10px;color:var(--gold-200)">একাদশী তিথি — উপবাসের দিন।</div>` : ''}
      </div>

      <div class="sect"><h4>দিনের মুহূর্ত</h4><div class="line"></div><span class="mini muted">ঢাকা</span></div>
      <div class="card pad">
        <div class="grid2">
          <div class="stat"><div class="k">অভিজিৎ (শুভ)</div><div class="v" style="color:var(--ok)">${pk.mh.abhijit[0]}–${pk.mh.abhijit[1]}</div></div>
          <div class="stat"><div class="k">রাহুকাল</div><div class="v" style="color:var(--danger)">${pk.mh.rahu[0]}–${pk.mh.rahu[1]}</div></div>
          <div class="stat"><div class="k">যমগণ্ড</div><div class="v" style="color:var(--danger)">${pk.mh.yama[0]}–${pk.mh.yama[1]}</div></div>
          <div class="stat"><div class="k">গুলিক</div><div class="v" style="color:var(--danger)">${pk.mh.guli[0]}–${pk.mh.guli[1]}</div></div>
          <div class="stat"><div class="k">মধ্যাহ্ন</div><div class="v">${pk.mh.noon}</div></div>
          <div class="stat"><div class="k">দিনের দৈর্ঘ্য</div><div class="v">${Math.floor(pk.mh.len / 60)} ঘ ${String(Math.round(pk.mh.len % 60)).padStart(2, '0')} মি</div></div>
        </div>
        ${pk.ekadashi ? `<div class="card pad mt" style="background:rgba(215,169,79,.08);border:1px solid rgba(215,169,79,.25)">
          <div class="mini" style="color:var(--gold-200);font-weight:600">একাদশীর পারণ</div>
          <div class="mini" style="margin-top:5px;line-height:1.7">সূর্যোদয় ${pk.mh.parana[0]} থেকে ${pk.mh.parana[1]}-এর মধ্যে (দিনের প্রথম ১/৪ ভাগ)। গোস্বামী ও স্মার্ত মতে সময়ে সামান্য পার্থক্য হতে পারে — পারণের আগে স্থানীয় পঞ্জিকা মিলিয়ে নিন।</div></div>` : ''}
        <div class="mini muted" style="margin-top:10px;line-height:1.7">সূর্যোদয়-সূর্যাস্ত আট ভাগে ভাগ করে বার অনুসারে রাহু, যমগণ্ড ও গুলিকের কাল গণনা করা হয়েছে (ঢাকার অক্ষাংশ-দ্রাঘিমা)।</div>
      </div>
      <div class="sect"><h4>আগামী ৪ দিন</h4><div class="line"></div></div>
      ${[1, 2, 3, 4].map(i => {
        const kk = key(new Date(d.getTime() + i * DAY_MS));
        return pjRow(kk, P.festivals[kk] || panjikaFor(kk).tithi, '');
      }).join('')}`;
    return pjShell('দৈনিক পঞ্জিকা', 'Daily panjika', body, 'daily');
  }

  function pjPanchang() {
    const y = U.panjika.by, m = U.panjika.bm, cells = banglaMonthCells(y, m);
    const rows = cells.map(c => {
      const k = key(c.date), pk = panjikaFor(k);
      return `<div class="pgrow"><span class="pgd">${bn(c.d)}</span><span class="pgw">${BN_DAY[c.date.getDay()].slice(0, 3)}</span>
        <span class="pgt">${pk.tithi}</span><span class="pgn">${pk.nak}</span>
        <span class="pgf">${pk.fest ? esc(pk.fest) : '—'}</span></div>`;
    }).join('');
    const body = `<div class="sect" style="margin-top:4px"><h4>${BM_NAMES[m]} ${bn(y)} বঙ্গাব্দ</h4><div class="line"></div>
        <button class="act" data-act="pbm" data-d="-1">◀</button><button class="act" data-act="pbm" data-d="1">▶</button></div>
      <div class="card pad"><div class="pghead"><span class="pgd">তারিখ</span><span class="pgw">বার</span><span class="pgt">তিথি</span><span class="pgn">নক্ষত্র</span><span class="pgf">উৎসব</span></div>
        ${rows}</div>
      <p class="mini muted" style="margin-top:12px;line-height:1.7">তিথি ও নক্ষত্র সূর্যোদয়-ভিত্তিক; স্থানীয় পঞ্জিকায় সামান্য পার্থক্য হতে পারে।</p>`;
    return pjShell('পঞ্চাঙ্গ', 'Panchang · মাসিক তিথি-নক্ষত্র', body, 'panchang');
  }

  function pjRashifal() {
    const R = P.rashi, day = new Date(TODAY_KEY).getDate(), mon = TODAY.getMonth() + 1;
    const cards = R.names.map((n, i) => {
      const t = R.lines[(day + i * 7 + mon * 3) % R.lines.length];
      return `<div class="card pad" style="margin-bottom:9px">
        <div class="kv"><span class="ttl">${n} রাশি</span><span class="pill">শুভ ${R.lucky[(day + i) % R.lucky.length]} · ${R.color[(mon + i) % R.color.length]}</span></div>
        <div class="mini" style="margin-top:7px;line-height:1.75">${t}</div>
        <div class="mini muted" style="margin-top:6px">ইষ্টদেব: ${R.deity[i]}</div></div>`;
    }).join('');
    const body = `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">আজ ${bn(new Date(TODAY_KEY).getDate())} ${BN_MONTH[TODAY.getMonth()]} — ১২ রাশির দিনফল।</p>${cards}
      <p class="mini muted" style="margin-top:10px;line-height:1.7">রাশিফল সাধারণ পঞ্জিকার ধারা অনুসারে সাজানো; জীবনের বড় সিদ্ধান্তে নিজের বিচার ও গুরুজনের পরামর্শই প্রধান।</p>`;
    return pjShell('রাশিফল', 'Rashifal · আজকের দিনফল', body, 'rashifal');
  }

  function pjGrohon() {
    const rows = P.eclipse.map(e => {
      const { d, diff } = pjWhen(e.d), bD = bengaliDate(d);
      return `<div class="card rowcard stack"><div class="datebox"><b>${bn(d.getDate())}</b><i>${BN_MONTH[d.getMonth()].slice(0, 4)}</i></div>
        <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${e.t} · ${e.k}</span>
          <span class="pill ${diff < 0 ? 'flat' : ''}">${diff > 0 ? bn(diff) + ' দিন' : 'সম্পন্ন'}</span></div>
          <div class="mini muted" style="margin-top:5px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${bn(bD.d)} ${bD.month} · ${e.n}</div></div></div>`;
    }).join('');
    return pjShell('গ্রহণ', 'Grahan · ২০২৬–২০২৮',
      `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">সূর্যগ্রহণ ও চন্দ্রগ্রহণের তালিকা। কোথা থেকে কতটা দেখা যাবে তা লেখা আছে — বাংলাদেশ থেকে দৃশ্যমানতা স্থানীয় পঞ্জিকা দেখে নিন।</p>${rows}`,
      'grohon');
  }

  function pjDibosh() {
    const items = P.dibosh.map(([md, name]) => {
      const [mm, dd] = md.split('-').map(Number);
      let d = new Date(TODAY.getFullYear(), mm - 1, dd);
      if (key(d) < TODAY_KEY) d = new Date(TODAY.getFullYear() + 1, mm - 1, dd);
      return { d, name, diff: Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS) };
    }).sort((a, b) => a.diff - b.diff);
    const rows = items.map(o => `<div class="card rowcard stack"><div class="datebox"><b>${bn(o.d.getDate())}</b><i>${BN_MONTH[o.d.getMonth()].slice(0, 4)}</i></div>
      <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${o.name}</span><span class="pill ${o.diff > 30 ? 'flat' : ''}">${bn(o.diff)} দিন</span></div>
        <div class="mini muted" style="margin-top:5px">${bn(o.d.getDate())} ${BN_MONTH[o.d.getMonth()]} ${bn(o.d.getFullYear())} · ${BN_DAY[o.d.getDay()]}</div></div></div>`).join('');
    return pjShell('দিবস', 'National & international days',
      `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">জাতীয় ও আন্তর্জাতিক দিবস — আসন্ন দিনগুলো আগে দেখানো হচ্ছে।</p>${rows}`, 'dibosh');
  }

  function pjCalendar() {
    const y = U.panjika.by;
    const cards = BM_NAMES.map((nm, m) => {
      const cells = banglaMonthCells(y, m);
      if (!cells.length) return '';
      const a = cells[0].date, z = cells[cells.length - 1].date;
      const ks = key(a), kz = key(z);
      const count = Object.keys(P.festivals).filter(k => k >= ks && k <= kz).length;
      return `<button class="card pad" style="width:100%;text-align:left;border:1px solid rgba(215,169,79,.22);margin-bottom:8px;background:transparent"
        data-act="pjmonth" data-y="${y}" data-m="${m}">
        <div class="kv"><span class="ttl">${nm} ${bn(y)}</span><span class="pill">${bn(cells.length)} দিন · ${bn(count)} ব্রত</span></div>
        <div class="mini muted" style="margin-top:5px">${bn(a.getDate())} ${BN_MONTH[a.getMonth()]} – ${bn(z.getDate())} ${BN_MONTH[z.getMonth()]} ${bn(z.getFullYear())}</div></button>`;
    }).join('');
    const body = `<div class="sect" style="margin-top:4px"><h4>বঙ্গাব্দ ${bn(y)}</h4><div class="line"></div>
        <button class="act" data-act="pjyear" data-d="-1">◀</button><button class="act" data-act="pjyear" data-d="1">▶</button></div>
      ${cards}<p class="mini muted" style="margin-top:12px;line-height:1.7">মাসে ট্যাপ করলে সেই মাসের ক্যালেন্ডার খুলবে।</p>`;
    return pjShell('ক্যালেন্ডার', 'Calendar · বছরের মাস', body, 'calendar');
  }

  /* ---------------- শুভকর্মের দিন: সরল নিয়মে গণনা ---------------- */
  /* নক্ষত্রের শ্রেণি: স্থির (প্রতিষ্ঠা/গৃহ), মৃদু (সংস্কার), ক্ষিপ্র (ক্রয়-বিক্রয়), শুভ (সাধারণ) */
  const NAK_CLASS = {
    sthir: [3, 11, 20, 25],            /* রোহিণী · উত্তরফাল্গুনী · উত্তরাষাঢ়া · উত্তরভাদ্রপদ */
    mridu: [4, 13, 16, 26],            /* মৃগশিরা · চিত্রা · অনুরাধা · রেবতী */
    kshipra: [0, 7, 12, 14, 22],       /* অশ্বিনী · পুষ্যা · হস্তা · স্বাতী · ধনিষ্ঠা */
    shubha: [3, 4, 9, 11, 12, 13, 16, 17, 18, 20, 21, 22, 23, 25, 26]
  };
  function karmaDates(item, fromKey, limit) {
    const out = [], start = new Date(fromKey + 'T00:00:00');
    const keys = Array.isArray(item.nak) ? item.nak : [item.nak];
    const naks = [];
    keys.forEach(x => { if (typeof x === 'number') naks.push(x); else (NAK_CLASS[x] || []).forEach(y => { if (!naks.includes(y)) naks.push(y); }); });
    for (let i = 0; i < 420 && out.length < limit; i++) {
      const d = new Date(start.getTime() + i * DAY_MS), k = key(d);
      if (item.months && !item.months.includes(bengaliDate(d).m)) continue;
      if (!item.bar.includes(d.getDay())) continue;
      const rise = sunTimes(k).rise / 60;
      const ti = tithiIndex(k, rise);
      const tno = ti < 15 ? ti + 1 : ti - 14;
      if (tno === 11 || tno === 15) continue;                 /* একাদশী ও পূর্ণিমা বর্জিত */
      if (!item.tithi.includes(tno)) continue;
      if (!naks.includes(nakIndex(k, rise))) continue;
      if (/একাদশী|অমাবস্যা|পূর্ণিমা|সংক্রান্তি/.test(P.festivals[k] || '')) continue;
      out.push(k);
    }
    return out;
  }
  function pjShubho() {
    const today = TODAY_KEY;
    const cards = (P.shubhoKarma || []).map(it => {
      const ds = karmaDates(it, today, 3);
      const first = ds[0];
      const { diff } = first ? pjWhen(first) : { diff: 0 };
      const fd = first ? new Date(first + 'T00:00:00') : null;
      return `<div class="card pad stack" style="margin-bottom:9px">
        <div class="kv"><div style="min-width:0"><div class="ttl">${it.name}</div>
          <div class="mini muted" style="margin-top:4px">${it.sub}</div></div>
          ${first ? `<span class="pill ${diff <= 7 ? 'ok' : ''}">${diff === 0 ? 'আজ' : bn(diff) + ' দিন'}</span>` : '<span class="pill flat">—</span>'}</div>
        ${first ? `<div class="mini" style="margin-top:8px;color:var(--gold-200)">
            পরের দিন: ${BN_DAY[fd.getDay()]}, ${bn(fd.getDate())} ${BN_MONTH[fd.getMonth()]} ${bn(fd.getFullYear())}
            <span class="muted"> · ${panjikaFor(first).tithi} · ${panjikaFor(first).nak}</span></div>
          <div class="mini muted" style="margin-top:4px">${ds.slice(1).map(k => {
            const d2 = new Date(k + 'T00:00:00');
            return `${bn(d2.getDate())} ${BN_MONTH[d2.getMonth()]}`;
          }).join(' · ') || 'আরও দিন খুঁজছি…'}</div>` : `<div class="mini muted" style="margin-top:8px">আগামী ৪২০ দিনে শুভ যোগ মেলেনি — উপনয়নের ক্ষেত্রে শুভ মাসের অপেক্ষা।</div>`}
      </div>`;
    }).join('');
    const body = `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">১৭টি শুভকর্মের পরবর্তী শুভ দিন — <b>শুভ তিথি + শুভ নক্ষত্র + শুভ বার</b> মিলিয়ে সরল নিয়মে গণনা করা, আর একাদশী/অমাবস্যা/পূর্ণিমা/সংক্রান্তি বাদ দেওয়া হয়েছে।</p>
      ${cards}
      <p class="mini muted" style="margin-top:12px;line-height:1.7">⚠️ এটি নির্দেশক তালিকা। বিয়ে, প্রতিষ্ঠা বা গৃহপ্রবেশের পূর্ণাঙ্গ মুহূর্তের জন্য লগ্ন, যোগ-করণ ও স্থানীয় পঞ্জিকা মিলিয়ে <b>পণ্ডিত/পুরোহিতের পরামর্শ</b> নিন।</p>`;
    return pjShell('শুভকর্মের দিন', 'Shubho Karma · ১৭টি সংস্কার', body, 'shubho');
  }

  /* ============ বিবাহ-শুভদিন · রাশি নির্ণয় · মৃতদোষ ============ */

  /* জন্মস্থান — অক্ষাংশ ও দ্রাঘিমাংশ (ডিগ্রি) */
  const JY_CITY = [
    ['ঢাকা', 23.8103, 90.4125], ['চট্টগ্রাম', 22.3569, 91.7832], ['খুলনা', 22.8456, 89.5403],
    ['রাজশাহী', 24.3745, 88.6042], ['সিলেট', 24.8949, 91.8687], ['বরিশাল', 22.7010, 90.3535],
    ['রংপুর', 25.7439, 89.2752], ['ময়মনসিংহ', 24.7471, 90.4203], ['কুমিল্লা', 23.4607, 91.1809],
    ['নারায়ণগঞ্জ', 23.6238, 90.5000]
  ];
  /* লগ্নের প্রকৃতি: ১ = স্থির/দ্বিস্বভাব (বিবাহে শুভ), ০ = চল */
  const LAGNA_GOOD = [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1];
  const jyState = () => {
    if (!U.jyoti) U.jyoti = { date: '1995-06-15', time: '06:30', city: 0, day: TODAY_KEY, bday: TODAY_KEY };
    if (!U.jyoti.day) U.jyoti.day = TODAY_KEY;
    if (!U.jyoti.bday) U.jyoti.bday = TODAY_KEY;
    return U.jyoti;
  };
  const hhmm = h => {
    let t = Math.round((((h % 24) + 24) % 24) * 60) % 1440;
    const H = Math.floor(t / 60), M = t % 60;
    return bn((H < 10 ? '0' : '') + H) + ':' + bn((M < 10 ? '0' : '') + M);
  };
  const jyOK = () => typeof window.JY === 'object' && window.JY;

  /* ---- ১৪. বিবাহ-শুভদিন (বিবাহ লগ্ন) ---- */
  function pjBibaho() {
    const JY = jyOK();
    const st = jyState();
    const k = st.bday, d = new Date(k + 'T00:00:00');
    const st2 = sunTimes(k);
    const rise = st2.rise / 60, set = st2.set / 60;
    const pk = panjikaFor(k);
    let wins = [];
    if (JY) wins = JY.lagnaWindows(k, GEO.lat, GEO.lon, Math.max(0, rise - 0.02), set);
    const lagnaRows = wins.map(w => {
      const good = LAGNA_GOOD[w.idx];
      return `<div class="kv" style="padding:9px 0;border-bottom:1px dashed rgba(215,169,79,.16)">
        <span class="ttl" style="font-size:.95rem">${w.name} লগ্ন</span>
        <span class="mini"><b>${hhmm(w.start)} – ${hhmm(w.end)}</b>
          <span class="pill ${good ? 'ok' : 'flat'}" style="margin-left:6px">${good ? 'শুভ' : 'চল'}</span></span></div>`;
    }).join('');
    /* আসন্ন শুভ বিবাহ-দিন */
    const TITHI = [2, 3, 5, 7, 10, 11, 12, 13];
    const NAKV = [3, 4, 9, 11, 12, 13, 14, 16, 18, 20, 21, 22, 23, 25, 26];
    const BAR = [1, 3, 4, 5];
    const days = [];
    for (let i = 0; i < 400 && days.length < 6; i++) {
      const dd = new Date(new Date(TODAY_KEY + 'T00:00:00').getTime() + i * DAY_MS), kk = key(dd);
      if ([2, 8, 11].indexOf(bengaliDate(dd).m) >= 0) continue;   /* আষাঢ় · পৌষ · চৈত্র বর্জিত */
      if (BAR.indexOf(dd.getDay()) < 0) continue;
      const r0 = sunTimes(kk).rise / 60;
      const ti = tithiIndex(kk, r0), tno = ti < 15 ? ti + 1 : ti - 14;
      if (TITHI.indexOf(tno) < 0) continue;
      if (NAKV.indexOf(nakIndex(kk, r0)) < 0) continue;
      if (/একাদশী|অমাবস্যা|পূর্ণিমা|সংক্রান্তি/.test(P.festivals[kk] || '')) continue;
      days.push(kk);
    }
    const dayRows = days.map(kk => {
      const d2 = new Date(kk + 'T00:00:00'), p2 = panjikaFor(kk);
      let best = '';
      if (JY) {
        const s2 = sunTimes(kk);
        const w2 = JY.lagnaWindows(kk, GEO.lat, GEO.lon, Math.max(0, s2.rise / 60 - 0.02), s2.set / 60)
          .filter(w => LAGNA_GOOD[w.idx]);
        const w3 = w2.filter(w => (w.end - w.start) >= 0.6);
        const pick = w3[0] || w2[0];
        if (pick) best = `শুভ লগ্ন ${hhmm(pick.start)}–${hhmm(pick.end)} (${pick.name})`;
      }
      const diff = Math.round((d2 - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
      return `<div class="card rowcard stack" style="margin-bottom:8px"><div class="datebox"><b>${bn(d2.getDate())}</b><i>${BN_MONTH[d2.getMonth()].slice(0, 4)}</i></div>
        <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${BN_DAY[d2.getDay()]} · ${p2.tithi}</span>
          <span class="pill ${diff <= 30 ? 'ok' : ''}">${diff === 0 ? 'আজ' : bn(diff) + ' দিন'}</span></div>
          <div class="mini muted" style="margin-top:4px">${p2.nak}${best ? ' · ' + best : ''}</div></div></div>`;
    }).join('');
    const body = `<div class="card oath pad stack" style="margin-bottom:10px">
        <div class="kv"><div><div class="mini muted">নির্বাচিত দিনের লগ্ন</div>
          <div class="display" style="font-size:19px;margin-top:3px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())}</div>
          <div class="mini muted" style="margin-top:4px">${BN_DAY[d.getDay()]} · ${pk.tithi} · ${pk.nak}</div></div>
          <div style="text-align:right"><div class="mini muted">সূর্যোদয়–অস্ত</div>
            <div class="mini" style="margin-top:4px">${hhmm(rise)} – ${hhmm(set)}</div></div></div>
        <div class="kv" style="margin-top:8px">
          <button class="act" data-act="bbDay" data-d="-1">◀ আগের</button>
          <button class="act" data-act="bbNow">আজ</button>
          <button class="act" data-act="bbDay" data-d="1">পরের ▶</button></div></div>
      <div class="sect" style="margin-top:2px"><h4>এই দিনের লগ্ন ও শুভ সময়</h4><div class="line"></div>
        <span class="mini muted">${wins.length ? bn(wins.length) + 'টি লগ্ন' : ''}</span></div>
      ${lagnaRows || '<p class="mini muted" style="line-height:1.7">লগ্ন গণনার জন্য জ্যোতিষ মডিউল লোড হয়নি।</p>'}
      <p class="mini muted" style="margin-top:8px;line-height:1.7">স্থির (বৃষ, সিংহ, বৃশ্চিক, কুম্ভ) ও দ্বিস্বভাব (মিথুন, কন্যা, ধনু, মীন) লগ্ন বিবাহে শুভ; চল লগ্ন (মেষ, কর্কট, তুলা, মকর) সাধারণত বর্জনীয়।</p>
      <div class="sect" style="margin-top:16px"><h4>আসন্ন শুভ বিবাহ-দিন</h4><div class="line"></div>
        <span class="mini muted">শুভ তিথি + নক্ষত্র + বার</span></div>
      ${dayRows || '<p class="mini muted">আগামী ৪০০ দিনে শুভ যোগ পাওয়া যায়নি।</p>'}
      <p class="mini muted" style="margin-top:12px;line-height:1.7">নিয়ম: শুভ তিথি ${bn('২,৩,৫,৭,১০,১১,১২,১৩')} · শুভ নক্ষত্র রোহিণী, মৃগশিরা, মঘা, উত্তরফাল্গুনী, হস্তা, চিত্রা, স্বাতী, অনুরাধা, মূলা, উত্তরাষাঢ়া, শ্রবণা, ধনিষ্ঠা, শতভিষা*, উত্তরভাদ্রপদ, রেবতী · শুভ বার সোম, বুধ, বৃহস্পতি, শুক্র · বর্জিত মাস আষাঢ়, পৌষ, চৈত্র; একাদশী, অমাবস্যা, পূর্ণিমা ও সংক্রান্তি বাদ। <b>*</b> তালিকাটি নির্দেশক — লগ্ন-মুহূর্ত চূড়ান্ত করার আগে <b>পণ্ডিতের পরামর্শ</b> নিন।</p>`;
    return pjShell('বিয়ে-শুভদিন', 'Vivaha Lagna · বিবাহ লগ্ন ও শুভ দিন', body, 'bibaho');
  }

  /* ---- ১৫. মৃতদোষ ---- */
  const MRIT_INFO = {
    'একপাদ দোষ': '১ পাদ — হালকা দোষ',
    'দ্বিপাদ দোষ': '২ পাদ — মধ্যম দোষ',
    'ত্রিপাদ দোষ': '৩ পাদ — প্রবল দোষ',
    'চতুষ্পাদ দোষ': '৪ পাদ — ত্রিপুষ্কর, সর্বাধিক দোষ',
    'দোষ নাই': 'কোনো মৃতদোষ নেই'
  };
  function pjMritdosh() {
    const st = jyState();
    const k = st.day, d = new Date(k + 'T00:00:00');
    const pk = panjikaFor(k), raw = (P.mritdosh || {})[k] || '';
    const segs = raw ? raw.split('|') : [];
    const label = sl => MRIT_INFO[sl] || sl;
    const card = !raw
      ? `<div class="card pad stack"><div class="ttl">এই দিনের যাচাইকৃত তথ্য নেই</div>
          <p class="mini muted" style="margin:6px 0 0;line-height:1.7">মৃতদোষের যাচাইকৃত তালিকা ১৫ এপ্রিল ২০২৬ – ১৪ এপ্রিল ২০২৭ পর্যন্ত সংকলিত হয়েছে (বাংলা পঞ্জিকার প্রকাশিত সীমা)। এই দিনটির জন্য উৎসে তথ্য না থাকায় <b>অনুমান করা হয়নি</b>।</p></div>`
      : `<div class="card oath pad stack">
          <div class="kv"><div><div class="mini muted">সূর্যোদয়ের পর</div>
            <div class="display" style="font-size:18px;margin-top:3px;color:${segs[0] === 'দোষ নাই' ? 'var(--ok)' : 'var(--gold-200)'}">${segs[0]}</div>
            <div class="mini muted" style="margin-top:4px">${label(segs[0])}</div></div>
            ${segs[1] ? `<div style="text-align:right"><div class="mini muted">পরে</div>
              <div class="display" style="font-size:18px;margin-top:3px;color:${segs[1] === 'দোষ নাই' ? 'var(--ok)' : 'var(--gold-200)'}">${segs[1]}</div>
              <div class="mini muted" style="margin-top:4px">${label(segs[1])}</div></div>` : ''}</div></div>`;
    /* পরের ৩০ দিন */
    const rows = [];
    for (let i = 0; i <= 30; i++) {
      const dd = new Date(d.getTime() + i * DAY_MS), kk = key(dd), rr = (P.mritdosh || {})[kk];
      const p2 = panjikaFor(kk);
      rows.push(`<div class="card rowcard stack" style="margin-bottom:7px"><div class="datebox"><b>${bn(dd.getDate())}</b><i>${BN_MONTH[dd.getMonth()].slice(0, 4)}</i></div>
        <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${rr ? rr.split('|')[0] : '—'}</span>
          <span class="mini muted">${BN_DAY[dd.getDay()]}</span></div>
          <div class="mini muted" style="margin-top:4px">${p2.tithi} · ${p2.nak}${rr && rr.split('|')[1] ? ' · পরে ' + rr.split('|')[1] : ''}</div></div></div>`);
    }
    const body = `<p class="mini muted" style="margin:0 0 10px;line-height:1.7"><b>মৃতদোষ</b> — শাস্ত্রমতে যে যোগে জন্ম বা মৃত্যু হলে বিশেষ শান্তি বিধি পালন করতে হয়। বার, তিথি ও নক্ষত্রের দোষ মিলে পাদ সংখ্যা ঠিক হয় — এক পাদ (হালকা) থেকে চতুষ্পাদ (ত্রিপুষ্কর, প্রবল)।</p>
      <div class="kv" style="margin-bottom:8px">
        <button class="act" data-act="mdDay" data-d="-1">◀ আগের</button>
        <button class="act" data-act="mdNow">আজ</button>
        <button class="act" data-act="mdDay" data-d="1">পরের ▶</button></div>
      <div class="mini muted" style="text-align:center;margin-bottom:8px">${BN_DAY[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${pk.tithi} · ${pk.nak}</div>
      ${card}
      <div class="sect" style="margin-top:16px"><h4>শান্তি বিধি</h4><div class="line"></div></div>
      <div class="card pad stack">
        <p class="mini" style="margin:0;line-height:1.85">
          <b>একপাদ:</b> ১০৮টি তুলসীপত্রে বিষ্ণুর পূজা, ১০৮ দুর্গানাম ও মধুসূদন জপ, ১টি শিবপূজা, সহস্রনাম ১ পাঠ।<br>
          <b>দ্বিপাদ:</b> অষ্টোত্তরশত (১০৮) তুলসীপত্র, ১০০০ দুর্গানাম, ৪টি শিবপূজা, দেবীমাহাত্ম্য ১ পাঠ, কাঞ্চনদান।<br>
          <b>ত্রিপাদ:</b> ষোড়শোপচারে বিষ্ণুপূজা, ১০০৮ তুলসীদান; ত্রিপুষ্কর খণ্ডনে ১০,০০০ তুলসীদান।<br>
          <b>গ্রহণ-বর্জন:</b> দোষ অনুসারে ১ মাস / ৬ মাস / ১ বছর গৃহত্যাগ ও স্বস্ত্যয়ন, গোদান-পিণ্ডদান; পুষ্কর তীর্থে ব্রহ্মার মন্দিরে যজ্ঞ।</p></div>
      <p class="mini muted" style="margin-top:10px;line-height:1.7">সূত্র: বাংলা পঞ্জিকার প্রতিদিনের প্রকাশিত ‘মৃতদোষ’ ও তার প্রশ্নোত্তর-শান্তি বিধি। বিধি পালনের আগে <b>পুরোহিতের পরামর্শ</b> অবশ্যই নিন।</p>
      <div class="sect" style="margin-top:16px"><h4>আগামী ৩০ দিন</h4><div class="line"></div></div>
      ${rows}
      <p class="mini muted" style="margin-top:10px;line-height:1.7">যাচাইকৃত তালিকা: ১৫ এপ্রিল ২০২৬ – ১৪ এপ্রিল ২০২৭। এর বাইরের দিনে উৎসের তথ্য না থাকায় কিছু দেখানো হয় না।</p>`;
    return pjShell('মৃতদোষ', 'Mrita Dosha · পাদ ও শান্তি', body, 'mritdosh');
  }

  /* ---- ১৬. রাশি নির্ণয় (জন্মকুণ্ডলী) ---- */
  function pjRashi() {
    const JY = jyOK();
    const st = jyState();
    const city = JY_CITY[st.city] || JY_CITY[0];
    const [dy, dm, dd2] = st.date.split('-').map(Number);
    const [th, tm] = st.time.split(':').map(Number);
    const jd = JY ? JY.jdLocal(dy, dm, dd2, th + tm / 60, GEO.tz) : 0;
    const bD = bengaliDate(new Date(dy, dm - 1, dd2));
    let asc = null, pos = [];
    if (JY) {
      asc = JY.ascSid(jd, city[1], city[2]);
      pos = JY.positions(jd);
    }
    /* জন্মসময় ±২ মিনিটে লগ্ন কতটা স্থির — স্বচ্ছতা দেখানোর জন্য */
    let ascM = null, ascP = null;
    if (JY) {
      ascM = JY.ascSid(jd - 2 / 1440, city[1], city[2]);
      ascP = JY.ascSid(jd + 2 / 1440, city[1], city[2]);
    }
    const ascMName = JY ? JY.rashiOf(ascM).name : '', ascPName = JY ? JY.rashiOf(ascP).name : '';
    const ascUnstable = JY && (ascMName !== JY.RASHI[Math.floor(asc / 30)] || ascPName !== JY.RASHI[Math.floor(asc / 30)]);
    const ascSandhi = JY ? JY.sandhiDist(asc) : 99;
    const moon = pos[1] || null, sunP = pos[0] || null;
    const ascR = JY ? JY.rashiOf(asc) : null;
    const cards = JY ? `<div class="dualrow" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="card pad" style="text-align:center"><div class="mini muted">জন্মরাশি (চন্দ্র)</div>
          <div class="display" style="font-size:20px;margin-top:4px;color:var(--gold-200)">${moon.rashi}</div>
          <div class="mini muted" style="margin-top:3px">${moon.nak} ${bn(moon.pada)} পাদ</div></div>
        <div class="card pad" style="text-align:center"><div class="mini muted">জন্মলগ্ন</div>
          <div class="display" style="font-size:20px;margin-top:4px;color:var(--gold-200)">${ascR.name}</div>
          <div class="mini muted" style="margin-top:3px">${BN_DAY[new Date(dy, dm - 1, dd2).getDay()]} · ${hhmm(th + tm / 60)}</div></div>
      </div>
      <div class="card pad" style="text-align:center;margin-top:8px">
        <div class="mini muted">সূর্যরাশি</div>
        <div class="mini" style="margin-top:4px">${sunP.rashi} · ${sunP.nak} (${bn(sunP.pada)} পাদ)</div>
        <div class="mini muted" style="margin-top:4px">নবাংশ (D9): চন্দ্র ${JY.navamsaOf(moon.lon).name} · লগ্ন ${JY.navamsaOf(asc).name}</div></div>
      <div class="card pad" style="margin-top:8px;${ascUnstable || ascSandhi < 1 ? 'border-color:rgba(226,120,60,.45)' : ''}">
        <div class="mini muted">জন্মসময়ের নিশ্চয়তা (লগ্ন ${bn(-2)}–+${bn(2)} মিনিটে)</div>
        <div class="mini" style="margin-top:5px">${ascMName} · <b>${ascR.name}</b> · ${ascPName}</div>
        <div class="mini muted" style="margin-top:5px;line-height:1.7">${ascUnstable
          ? '⚠️ জন্মসময় ২ মিনিট এদিক-ওদিক হলে লগ্ন বদলে যাচ্ছে — জন্মসময় যতটা জানা আছে ঠিকভাবে দিন, নইলে লগ্ন-সংক্রান্ত ফল নির্ভরযোগ্য নয়।'
          : (ascSandhi < 1 ? '⚠️ লগ্ন রাশি-সন্ধির খুব কাছে (' + JY.dms(ascSandhi) + ') — ২–৩ মিনিটের পার্থক্যেও লগ্ন বদলাতে পারে।' : '✓ লগ্ন স্থির — ২ মিনিটের পার্থক্যে রাশি বদলায় না।')}</div></div>` : '';

    /* ১২ ঘর — লগ্ন থেকে */
    let houses = '';
    if (JY) {
      const rows = [];
      for (let h = 0; h < 12; h++) {
        const rIdx = (ascR.i + h) % 12;
        const inH = pos.filter(p => p.rashiIdx === rIdx).map(p => p.name).join(', ');
        rows.push(`<div class="kv" style="padding:7px 0;border-bottom:1px dashed rgba(215,169,79,.14)">
          <span class="mini" style="min-width:74px">${bn(h + 1)}ম ঘর · ${JY.RASHI[rIdx]}</span>
          <span class="mini" style="color:${inH ? 'var(--gold-200)' : 'var(--muted, #8a8378)'}">${inH || '—'}</span></div>`);
      }
      houses = rows.join('');
    }
    const grahaRows = JY ? pos.map(p => `<div class="kv" style="padding:7px 0;border-bottom:1px dashed rgba(215,169,79,.14)">
        <span class="ttl" style="font-size:.92rem;min-width:86px">${p.name}${p.retro ? ' <span class="mini muted">(বক্রী)</span>' : ''}</span>
        <span class="mini">${p.rashi} ${JY.dms(p.deg)}</span>
        <span class="mini muted" style="min-width:96px;text-align:right">${p.nak} ${bn(p.pada)}<br><span style="opacity:.7">D9 ${JY.navamsaOf(p.lon).name}</span></span></div>`).join('') : '';
    const cityOpts = JY_CITY.map((c, i) => `<option value="${i}" ${i === st.city ? 'selected' : ''}>${c[0]}</option>`).join('');
    const body = `<p class="mini muted" style="margin:0 0 10px;line-height:1.7">জন্ম তারিখ, সময় ও স্থান দিয়ে <b>চন্দ্ররাশি, জন্মলগ্ন, জন্মনক্ষত্র ও নবগ্রহের অবস্থান</b> — লহিড়ী অয়নাংশে (নিরয়ণ) প্রকৃত গণিত দিয়ে। জন্মসময় যত নিখুঁত, লগ্ন তত নিখুঁত।</p>
      <div class="card pad stack">
        <label class="mini muted" for="jyDate">জন্মতারিখ</label>
        <input id="jyDate" type="date" value="${st.date}" style="width:100%;padding:10px;border-radius:12px;border:1px solid rgba(215,169,79,.3);background:transparent;color:inherit;font-family:inherit;margin-top:4px">
        <div class="kv" style="margin-top:8px;gap:8px">
          <div style="flex:1"><label class="mini muted" for="jyTime">জন্মসময়</label>
            <input id="jyTime" type="time" value="${st.time}" style="width:100%;padding:10px;border-radius:12px;border:1px solid rgba(215,169,79,.3);background:transparent;color:inherit;font-family:inherit;margin-top:4px"></div>
          <div style="flex:1"><label class="mini muted" for="jyCity">জন্মস্থান</label>
            <select id="jyCity" style="width:100%;padding:10px;border-radius:12px;border:1px solid rgba(215,169,79,.3);background:transparent;color:inherit;font-family:inherit;margin-top:4px">${cityOpts}</select></div>
        </div>
      </div>
      <div class="mini muted" style="text-align:center;margin:8px 0 10px">বঙ্গাব্দ ${bn(bD.d)} ${bD.month} ${bn(bD.year)} · ${BN_DAY[new Date(dy, dm - 1, dd2).getDay()]} · ${city[0]}</div>
      ${cards}
      <div class="sect" style="margin-top:16px"><h4>গ্রহস্থিতি</h4><div class="line"></div>
        <span class="mini muted">নিরয়ণ · লহিড়ী</span></div>
      <div class="card pad stack">${grahaRows}</div>
      <div class="sect" style="margin-top:16px"><h4>১২ ঘর</h4><div class="line"></div></div>
      <div class="card pad stack">${houses}</div>
      <p class="mini muted" style="margin-top:10px;line-height:1.7">গণনা: গ্রহের কক্ষপথ-উপাদান (JPL), চন্দ্রের Meeus সিরিজ, লহিড়ী অয়নাংশ ২৩°৫১′১১″ (J2000) থেকে বছরে ৫০.২৯″ বৃদ্ধি, উদয়লগ্ন = স্থানীয় নাক্ষত্রিক কাল + অক্ষাংশ। যাচাই: প্রকাশিত নিরয়ণ গ্রহস্থিতির সঙ্গে সব গ্রহ ০.১°-এর মধ্যে মেলে; চন্দ্র ০.০৬°। ২৬,২৮০টি নমুনায় দেখা গেছে ৪ মিনিট জন্মসময় ভুল হলে লগ্ন-রাশি বদলায় মাত্র ৩.৩% ক্ষেত্রে, নক্ষত্র বদলায় ০.২%-এ (docs/guide/JYOTISH-VERIFY.md)।</p>`;
    return pjShell('রাশি নির্ণয়', 'Rashi · জন্মরাশি ও জন্মলগ্ন', body, 'rashi');
  }

  function panjikaSub(slug) {
    if (U.panjika.by == null) { const bt = bengaliDate(TODAY); U.panjika.by = bt.year; U.panjika.bm = bt.m; }
    switch (slug) {
      case 'broto':
        return pjList('ব্রতের তালিকা', 'Brata · ব্রত ও উৎসব', 'broto',
          () => true, 'সারা বছরের ব্রত, উপবাস ও উৎসব — একাদশী, পূর্ণিমা, অমাবস্যা, সংক্রান্তি ও পূজা-পার্বণ।');
      case 'ekadashi':
        return pjList('একাদশী', 'Ekadashi · উপবাস', 'ekadashi',
          (k, n) => n.includes('একাদশী'), 'শুক্লা ও কৃষ্ণ পক্ষের একাদশী — উপবাস ও পারণের দিন।');
      case 'purnima': {
        const rows = Object.keys(P.purnima).sort().filter(k => U.panjika.all || k >= TODAY_KEY);
        return pjShell('পূর্ণিমা', 'Purnima · পূর্ণিমার তিথি',
          `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">সারা বছরের পূর্ণিমা তিথি — স্নান, দান ও ব্রতের দিন।</p>
           ${rows.map(k => pjRow(k, P.purnima[k])).join('')}
           <div class="kv" style="margin-top:10px"><span class="mini muted">মোট ${bn(Object.keys(P.purnima).length)}টি</span>
             <button class="act" data-act="pjall">${U.panjika.all ? 'শুধু আসন্ন' : 'সব দেখুন'}</button></div>`, 'purnima');
      }
      case 'amavasya': {
        const rows = Object.keys(P.amavasya).sort().filter(k => U.panjika.all || k >= TODAY_KEY);
        return pjShell('অমাবস্যা', 'Amavasya · পিতৃতর্পণ',
          `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">সারা বছরের অমাবস্যা — পিতৃতর্পণ, দীপদান ও তর্পণের দিন।</p>
           ${rows.map(k => pjRow(k, P.amavasya[k])).join('')}
           <div class="kv" style="margin-top:10px"><span class="mini muted">মোট ${bn(Object.keys(P.amavasya).length)}টি</span>
             <button class="act" data-act="pjall">${U.panjika.all ? 'শুধু আসন্ন' : 'সব দেখুন'}</button></div>`, 'amavasya');
      }
      case 'puja':
        return pjList('পূজার দিন', 'Puja · পূজা-পার্বণ', 'puja',
          (k, n) => n.includes('পূজা') || n.includes('পূজো'), 'দেব-দেবীর পূজার দিন — দুর্গা, লক্ষ্মী, কালী, সরস্বতী, শিব, গণেশ ও বিশ্বকর্মা।');
      case 'bishesh':
        return pjList('বিশেষ দিন', 'Special days · ব্রত ও পালন', 'bishesh',
          (k, n) => !n.includes('একাদশী'), 'একাদশী ছাড়া বছরের সব বিশেষ ধর্মীয় ও পালনীয় দিন — জন্মাষ্টমী, রথ, ঝুলন, শিবরাত্রি, দোল, সংক্রান্তি।');
      case 'shubho': return pjShubho();
      case 'bibaho': return pjBibaho();
      case 'mritdosh': return pjMritdosh();
      case 'rashi': return pjRashi();
      case 'dibosh': return pjDibosh();
      case 'daily': return pjDaily();
      case 'panchang': return pjPanchang();
      case 'rashifal': return pjRashifal();
      case 'grohon': return pjGrohon();
      case 'calendar': return pjCalendar();
      default: return pjCalendar();
    }
  }

  /* ------------------------------------------------------------- 10. seva */
  function sevaScreen() {
    const totalRaised = DB.campaigns.reduce((s, c) => s + c.raised + (S.raised[c.id] || 0), 0);
    const totalSpent = Math.round(totalRaised * .93);
    return `${appbar('সেবা ও সহায়তা', 'Seva · স্বচ্ছ দান', undefined, true)}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad">
        <div class="kv"><div><div class="mini muted">এই মাসে সংগ্রহ</div>
          <div class="display" style="font-size:20px;color:var(--gold-200);margin-top:3px">৳ ${bnN(totalRaised)}</div></div>
          <div style="text-align:right"><div class="mini muted">সেবায় ব্যয়</div>
            <div class="display" style="font-size:20px;color:var(--ok);margin-top:3px">৳ ${bnN(totalSpent)}</div></div></div>
        <div class="dualbar mt"><i style="width:93%;background:linear-gradient(90deg,#3f8d68,#8fd6b0)"></i><i style="width:7%;background:rgba(215,169,79,.6)"></i></div>
        <div class="kv" style="margin-top:8px"><span class="mini muted">৯৩% সরাসরি সেবা</span><span class="mini muted">৭% অপারেশনাল (ঘোষিত)</span></div>
      </div>

      ${(() => {
        const c = DB.campaigns.find(x => x.id === 'gita');
        if (!c) return '';
        const raised = c.raised + (S.raised[c.id] || 0), pct = Math.min(100, Math.round(raised / c.goal * 100));
        const gitas = Math.round(raised / c.perUnit);
        return `<div class="sect"><h4>গীতা দান</h4><div class="line"></div><span class="mini muted">${bn(gitas)}টি গীতা</span></div>
        <div class="card oath pad stack gita-daan">
          <div class="kv"><div><div class="mini muted">শ্রীমদ্ভগবদ্গীতা · এক ঘরে এক গীতা</div>
            <h5 style="margin-top:4px">৳ ${bn(c.perUnit)} দিয়ে একটি পরিবারে গীতা পৌঁছাবে</h5></div>
            ${ico('book', 'sm')}</div>
          <p class="mini muted" style="margin:8px 0 0;line-height:1.75">${esc(c.blurb)}</p>
          <div class="kv mini muted" style="margin-top:10px"><span>৳ ${bnN(raised)} সংগ্রহ</span><span>লক্ষ্য ৳ ${bnN(c.goal)}</span></div>
          <div class="bar mt"><i style="width:${pct}%"></i></div>
          <div class="kv mini muted" style="margin-top:7px"><span>${bn(pct)}% পূর্ণ</span><span>${bn(Math.max(0, Math.round(c.goal / c.perUnit) - gitas))}টি গীতা বাকি</span></div>
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="btn gold sm" style="flex:1" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit}">১টি গীতা · ৳${bn(c.perUnit)}</button>
            <button class="btn ghost sm" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit * 5}">৫টি · ৳${bn(c.perUnit * 5)}</button>
            <button class="btn ghost sm" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit * 11}">১১টি · ৳${bn(c.perUnit * 11)}</button>
          </div>
          <div class="mini muted" style="margin-top:9px;text-align:center">প্রতিটি দানের রিসিট ও বিতরণের প্রমাণ অ্যাপে সংরক্ষিত থাকবে</div>
        </div>`;
      })()}

      <div class="sect"><h4>চলমান অভিযান</h4><div class="line"></div></div>
      ${DB.campaigns.filter(c => c.id !== 'gita').map(c => {
      const raised = c.raised + (S.raised[c.id] || 0), pct = Math.min(100, Math.round(raised / c.goal * 100));
      return `<div class="card pad campaign stack">
          <div class="kv"><h5>${esc(c.title)}</h5><span class="pill ok">${bn(pct)}%</span></div>
          <p>${esc(c.blurb)}</p>
          <div class="kv mini muted"><span>৳ ${bnN(raised)} সংগ্রহ</span><span>লক্ষ্য ৳ ${bnN(c.goal)}</span></div>
          <div class="bar mt"><i style="width:${pct}%"></i></div>
          <div style="display:flex;gap:8px;margin-top:11px">
            <button class="btn gold sm" style="flex:1" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit}">৳ ${bn(c.perUnit)} — ${esc(c.unit)}</button>
            <button class="btn ghost sm" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit * 5}">৳ ${bn(c.perUnit * 5)}</button>
          </div>
        </div>`;
    }).join('')}
      ${S.orders.filter(o => o.kind === 'donation').length ? `<div class="sect"><h4>আপনার দান</h4><div class="line"></div></div>
        <div class="card pad">${S.orders.filter(o => o.kind === 'donation').slice(-4).reverse().map(o => `
          <div class="ledger"><span>${esc(o.title)}</span><span>৳ ${bnN(o.amount)}</span></div>`).join('')}</div>` : ''}

      <div class="card pad mt" style="background:var(--glass)">
        <div class="kv"><b style="font-size:12.5px">স্বচ্ছতার প্রতিশ্রুতি</b>${ico('shield', 'sm')}</div>
        <p class="mini muted" style="margin:8px 0 0;line-height:1.7">প্রতিটি দানের রিসিট ও ব্যয়ের প্রমাণ প্রকাশ্যে থাকবে। দানের টাকা প্লাটফর্মের খরচে ব্যবহার হবে না — আলাদা ট্রাস্ট অ্যাকাউন্ট।</p>
      </div>
    </div><div style="height:20px"></div>`;
  }

  /* ----------------------------------------------------------- 11. market */
  function providerCards() {
    const q = U.marketQ.trim().toLowerCase();
    const all = (S.provider ? [{ ...S.provider, mine: true }] : []).concat(DB.providers);
    const list = all.filter(p => (U.marketCat === 'সব' || p.cat === U.marketCat) &&
      (!q || (p.name + p.role).toLowerCase().includes(q)));
    if (!list.length) return `<div class="card empty"><div class="illu">${ico('bag')}</div><h5>এই বিভাগে কেউ নেই</h5><p>অন্য বিভাগ বেছে নিন, অথবা নিজেই প্রোফাইল খুলুন।</p></div>`;
    return list.map(p => `<div class="card provider">
      <div class="av">${esc(p.ini || p.name.slice(0, 1))}</div>
      <div style="flex:1;min-width:0">
        <h5>${esc(p.name)} ${p.mine ? '<span class="pill">আপনি</span>' : '<span class="badge-v">✓</span>'}</h5>
        <div class="role">${esc(p.role)}</div>
        <div class="kv"><span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))} <span class="mini muted">${bn(p.rating)} (${bn(p.reviews || 0)})</span></span>
          <b style="font-size:12.5px;color:var(--gold-200)">৳ ${bnN(p.rate)}/${esc(p.rateLabel || 'কাজ')}</b></div>
        <button class="btn ghost sm mt" data-act="order" data-id="${p.id}">বুক করুন · এসক্রো সুরক্ষা</button>
      </div></div>`).join('');
  }
  function marketScreen() {
    const cats = ['সব', 'টিউটর', 'পুরোহিত', 'গ্রাফিক্স', 'কথক'];
    return `${appbar('সেবা ও কাজ', 'Skills · Income')}
    <div class="pad" style="padding-top:0">
      <div class="search">${ico('search', 'sm')}<input id="marketSearch" placeholder="টিউটর, পুরোহিত, ডিজাইনার…" value="${esc(U.marketQ)}" aria-label="সেবা খুঁজুন"/></div>
      <div class="tiny muted" style="margin-top:9px">ভেরিফায়েড প্রোভাইডার · ১২% প্ল্যাটফর্ম ফি · পেআউট প্রতি রবিবার</div>
    </div>
    <div class="cats">${cats.map(c => `<button class="chip ${U.marketCat === c ? 'on' : ''}" data-act="mcat" data-c="${c}">${c}</button>`).join('')}</div>
    <div class="pad" style="padding-top:12px">
      <div id="marketList">${providerCards()}</div>
      <div class="card oath pad">
        <div class="kv"><b style="font-size:12.8px">আপনার দক্ষতা দিয়ে আয় করুন</b>${ico('wallet', 'sm')}</div>
        <p class="mini muted" style="margin:7px 0 11px;line-height:1.65">শিক্ষক, ডিজাইনার, লেখক, কথক — প্রোফাইল খুলে কাজ নিন। ৮৫% আপনার শেয়ার।</p>
        ${S.provider
        ? `<div class="mini">প্রোফাইল সক্রিয়: <b>${esc(S.provider.name)}</b> · ${esc(S.provider.cat)} · ৳${bnN(S.provider.rate)}</div>
             <button class="btn ghost sm mt" data-act="myProfile">আয়ের হিসাব দেখুন</button>`
        : `<button class="btn gold block sm" data-act="providerForm">প্রোফাইল খুলুন</button>`}
      </div>
      ${S.orders.filter(o => o.kind === 'service').length ? `<div class="sect"><h4>আপনার অর্ডার</h4><div class="line"></div></div>
        <div class="card pad">${S.orders.filter(o => o.kind === 'service').slice(-4).reverse().map(o => `
          <div class="ledger"><span>${esc(o.title)}</span><span>৳ ${bnN(o.amount)} · ${o.status}</span></div>`).join('')}</div>` : ''}
    </div><div style="height:20px"></div>`;
  }

  /* --------------------------------------------------------------- 12. me */
  /* পছন্দের তালিকা — “আমি” ও “সেটিংস” দুই জায়গাতেই একই */
  function prefCard() {
    return `<div class="card pad" style="padding:4px 14px">
        <div class="setting" data-act="toggleTheme">
          <span style="color:var(--gold-300)">${ico('sun', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">লাইট মোড (পাটা-থিম)</div>
          <span class="toggle ${S.theme === 'light' ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleBg">
          <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">পটভূমি থিম (মন্দির-পত্র)</div>
          <span class="toggle ${S.bg ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleSound">
          <span style="color:var(--gold-300)">${ico('bell', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">মৃদু ঘণ্টাধ্বনি</div>
          <span class="toggle ${S.sound ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleMotion">
          <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">অ্যানিমেশন</div>
          <span class="toggle ${S.motion ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleName">
          <span style="color:var(--gold-300)">${vico('user', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">নাম পরিবর্তন</div>
          <span class="mini muted">${esc(S.name.split(' ')[0])} ›</span></div>
        <div class="setting" data-act="reset">
          <span style="color:var(--danger)">${ico('close', 'sm')}</span>
          <div style="flex:1;font-size:12.5px;color:var(--danger)">ডেমো ডেটা রিসেট</div>
          <span class="mini muted">›</span></div>
      </div>
`;
  }

  /* =========================== সার্চ ইঞ্জিন =========================== */
  const SI = { idx: null, q: '', t: null };
  /* বাংলা অঙ্ক, যতিচিহ্ন, ড্যাশ — সব সমান করে খোঁজার জন্য */
  function bangNorm(v) {
    return (v || '').toString().toLowerCase()
      .replace(/[\u09e6-\u09ef]/g, d => String(d.charCodeAt(0) - 0x09e6))
      .replace(/[\u0966-\u096f]/g, d => String(d.charCodeAt(0) - 0x0966))
      .replace(/[।॥,;:!?"'“”‘’()\[\]{}··–—-]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function buildSearchIndex() {
    const out = [];
    const add = (t, sub, r, k) => out.push({ t, s: sub || '', r, k: k || '', tt: bangNorm(t), ss: bangNorm(sub + ' ' + (k || '')) });
    [['হোম', 'আজকের পাঠ ও পঞ্জিকা', '#/home', 'পর্দা'],
     ['গ্রন্থাগার', 'শাস্ত্র, বই ও অডিও', '#/library', 'পর্দা'],
     ['পঞ্জিকা', 'তিথি · নক্ষত্র · উৎসব', '#/panjika', 'পর্দা'],
     ['উৎসব পঞ্জি', 'বছরের পার্বণ-তালিকা', '#/panjika/calendar', 'পঞ্জিকা'],
     ['শুভ সময়', 'শুভক্ষণ ও লগ্ন', '#/panjika/shubho', 'পঞ্জিকা'],
     ['রাশিফল', 'দৈনিক রাশিফল', '#/panjika/rashifal', 'পঞ্জিকা'],
     ['বিবাহ মিলন', 'কুষ্ঠি মিলন', '#/panjika/bibaho', 'পঞ্জিকা'],
     ['ফিড', 'পোস্ট ও আলোচনা', '#/feed', 'পর্দা'],
     ['রিলস', 'ভিডিও ফিড', '#/reels', 'পর্দা'],
     ['পরীক্ষা', 'সাপ্তাহিক পরীক্ষা ও কুইজ', '#/exam', 'পর্দা'],
     ['সাধনা', 'জপ · ধ্যান · যোগা', '#/sadhana', 'পর্দা'],
     ['সেবা ও দান', 'অভিযান ও সহায়তা', '#/seva', 'পর্দা'],
     ['মার্কেটপ্লেস', 'দক্ষ সেবা ও টিউটর', '#/market', 'পর্দা'],
     ['আমার অগ্রগতি', 'প্রোফাইল ও পরিসংখ্যান', '#/me', 'পর্দা'],
     ['সেটিংস', 'থিম, ধ্বনি, নাম', '#/settings', 'পর্দা'],
     ['নোট', 'ব্যক্তিগত নোট', '#/notes', 'পর্দা']
    ].forEach(x => add(x[0], x[1], x[2], x[3]));

    (DB.books || []).forEach(b => {
      add(b.title, b.author + ' · ' + (b.tag || ''), '#/book/' + b.id, 'গ্রন্থ');
      (b.texts || []).forEach((x, i) => {
        if (!x) return;
        const t = x.ch ? 'অধ্যায় ' + x.ch + ' · শ্লোক ' + (x.v || i + 1) : 'শ্লোক ' + (i + 1);
        add(t, (x.bn || x.sk || '').toString().replace(/\s+/g, ' ').slice(0, 100), '#/reader/' + b.id + '/' + i, 'শ্লোক');
      });
    });
    (DB.courses || []).forEach(c => add(c.title, c.summary || c.level || '', '#/course/' + c.id, 'কোর্স'));
    (DB.pujas || []).forEach(p => add(p.title, p.summary || p.time || '', '#/puja/' + p.id, 'পূজা'));
    (DEVA || []).forEach(d => add(d.n + ' পূজা', d.sub + ' · ' + d.items, '#/puja/deva/' + d.id, 'পূজা দর্পণ'));
    (DB.quizzes && DB.quizzes.weekly ? [DB.quizzes.weekly] : []).forEach(q => add(q.title, q.topic || '', '#/quiz', 'কুইজ'));
    (DB.asanas || []).forEach(a => add(a.name, a.benefit || a.level || '', '#/sadhana', 'যোগাসন'));
    (DB.japas || []).forEach(j => add(j.title, j.note || '', '#/sadhana', 'জপ'));
    (DB.meditations || []).forEach(m => add(m.title, m.note || (m.mins + ' মিনিট'), '#/sadhana', 'ধ্যান'));
    (DB.campaigns || []).forEach(c => add(c.title, c.blurb || c.sh || '', '#/seva', 'অভিযান'));
    (DB.providers || []).forEach(p => add(p.name, p.role || p.cat || '', '#/market', 'সেবাদাতা'));
    ((DB.feed && DB.feed.posts) || []).forEach(p => add(p.name + ' — পোস্ট', (p.text || '').slice(0, 90), '#/feed', 'ফিড'));
    ((DB.feed && DB.feed.reels) || []).forEach(r => add(r.title, r.sub || '', '#/reels/' + r.id, 'রিলস'));
    (DB.gitaAudio || []).forEach(g => add('গীতা অডিও · অধ্যায় ' + g.ch, g.name + ' · ' + g.dur, '#/gita/' + g.ch, 'অডিও'));
    (DB.bhaktiAudio || []).forEach(b => add(b.name, (b.cat || '') + ' · ' + (b.ch || ''), '#/gita', 'কীর্তন'));
    Object.entries((DB.panjika && DB.panjika.festivals) || {}).forEach(([d, n]) =>
      add(n, d, '#/panjika/calendar', 'উৎসব'));
    return out;
  }
  function searchAll(qRaw) {
    const q = bangNorm(qRaw);
    if (!q) return [];
    if (!SI.idx) SI.idx = buildSearchIndex();
    const toks = q.split(' ').filter(Boolean);
    const strict = [], loose = [];
    for (const e of SI.idx) {
      let sc = 0, hit = 0;
      for (const t of toks) {
        let s = 0;
        if (e.tt === t) s = 130;
        else if (e.tt.startsWith(t)) s = 100;
        else if (e.tt.includes(t)) s = 70;
        else if (e.ss.includes(t)) s = 32;
        if (s) { sc += s; hit++; }
      }
      if (!hit) continue;
      const KW = { 'গ্রন্থ': 30, 'পর্দা': 14, 'কোর্স': 12, 'পূজা': 10, 'অভিযান': 10, 'কুইজ': 8, 'উৎসব': 6 };
      sc += KW[e.k] || 0;
      sc += Math.min(18, hit * 6) - Math.min(14, e.t.length / 6);
      (hit === toks.length ? strict : loose).push([sc, e]);
    }
    const rank = a => a.sort((x, y) => y[0] - x[0] || x[1].t.length - y[1].t.length);
    return (strict.length ? rank(strict) : rank(loose)).slice(0, 12).map(x => x[1]);
  }
  // Numeric dates are Gregorian: day/month/year or ISO year-month-day.
  // A lone day uses the current month; two parts use the current year.
  function parseSearchDate(raw) {
    const text = String(raw || '').trim().replace(/[০-৯]/g, d => String(d.charCodeAt(0) - 0x09e6)).replace(/[०-९]/g, d => String(d.charCodeAt(0) - 0x0966));
    let day, month, year, assumed = '';
    let match = text.match(/^(\d{4})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{1,2})$/);
    if (match) { year = +match[1]; month = +match[2]; day = +match[3]; }
    else if ((match = text.match(/^(\d{1,2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{4})$/)) || (match = text.match(/^(\d{1,2})\s+(\d{1,2})\s+(\d{4})$/))) { day = +match[1]; month = +match[2]; year = +match[3]; }
    else if (/^\d{8}$/.test(text)) {
      const yFirst = +text.slice(0,4), mFirst = +text.slice(4,6), dFirst = +text.slice(6,8);
      if (yFirst >= 1900 && yFirst <= 2100 && mFirst >= 1 && mFirst <= 12 && dFirst >= 1 && dFirst <= 31) { year = yFirst; month = mFirst; day = dFirst; }
      else { day = +text.slice(0,2); month = +text.slice(2,4); year = +text.slice(4,8); }
    }
    else if ((match = text.match(/^(\d{1,2})\s*[-/]\s*(\d{1,2})$/)) && +match[2] <= 12) { day = +match[1]; month = +match[2]; year = TODAY.getFullYear(); assumed = 'বছর না থাকায় চলতি বছর ধরা হয়েছে'; }
    else if ((match = text.match(/^(\d{1,2})$/)) && +match[1] >= 1 && +match[1] <= 31) { day = +match[1]; month = TODAY.getMonth() + 1; year = TODAY.getFullYear(); assumed = 'শুধু দিন থাকায় চলতি মাস ও বছর ধরা হয়েছে'; }
    else return null;
    if (year < 1900 || year > 2100) return { invalid: true, reason: '১৯০০ থেকে ২১০০ সালের একটি তারিখ লিখুন।' };
    const date = new Date(year, month - 1, day);
    if (month < 1 || month > 12 || day < 1 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return { invalid: true, reason: 'তারিখটি সঠিক নয়। দিন/মাস/বছর লিখুন।' };
    return { date, key: key(date), assumed, lone: /^\d{1,2}$/.test(text) };
  }
  function dateObservances(k) {
    const entries = [];
    const add = (label, value) => { if (value) entries.push({label, value}); };
    const festivals = (P.festivals[k] || '').split('·').map(x => x.trim()).filter(Boolean);
    festivals.forEach(value => add('ব্রত ও উৎসব', value));
    for (const [field, label] of [['purnima','পূর্ণিমা'], ['amavasya','অমাবস্যা']]) {
      const value = P[field] && P[field][k];
      if (value && !festivals.some(f => f === value)) add(label, value);
    }
    (P.dibosh || []).filter(x => x[0] === k.slice(5)).forEach(x => add('দিবস', x[1]));
    (P.eclipse || []).filter(x => x.d === k).forEach(x => add('গ্রহণ', `${x.t} · ${x.k} — ${x.n}`));
    if (P.mritdosh && P.mritdosh[k]) add('মৃতদোষের তালিকা', P.mritdosh[k].split('|').join(' / ') + ' (সময় স্থানীয় পঞ্জিকায় যাচাই করুন)');
    return entries;
  }
  function searchDateHTML(info) {
    if (info.invalid) return `<div class="ref-date-result"><b>তারিখটি পরীক্ষা করুন</b><p>${esc(info.reason)}</p></div>`;
    const d = info.date, k = info.key, bd = bengaliDate(d), pk = panjikaFor(k), events = dateObservances(k);
    const inFestRange = k >= '2026-04-14' && k <= '2028-04-13';
    return `<div class="ref-date-result">
      <div class="ref-date-result-head"><span>তারিখের ফলাফল · আরও দেখতে নিচে স্ক্রল করুন ↓</span><strong>${BN_DAY[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())}</strong>
        <small>${bnDateShort(bd)} · ${bd.season} ঋতু</small>${info.assumed ? `<small>${esc(info.assumed)}</small>` : ''}</div>
      <div class="ref-date-facts"><span>তিথি <b>${esc(pk.tithi)}</b></span><span>নক্ষত্র <b>${esc(pk.nak)}</b></span><span>সূর্যোদয় <b>${esc(pk.sunrise)}</b></span><span>সূর্যাস্ত <b>${esc(pk.sunset)}</b></span><span>শুভ সময় <b>${esc(pk.shubho)}</b></span><span>রাহুকাল <b>${esc(pk.rahu)}</b></span></div>
      <div class="ref-date-events"><b>এই তারিখের বিষয়</b>${events.length ? events.map(o => `<div><small>${esc(o.label)}</small><span>${esc(o.value)}</span></div>`).join('') : '<p>অ্যাপের তালিকায় এই তারিখে কোনো বিষয় পাওয়া যায়নি।</p>'}</div>
      <p class="ref-date-caution">ঢাকাভিত্তিক আনুমানিক পঞ্জিকা। স্থানীয় পঞ্জিকার সঙ্গে মিলিয়ে নিন। ${inFestRange ? 'উৎসবের তালিকা সীমিত।' : 'এই তারিখ অ্যাপের মূল উৎসব-তালিকার বাইরে; সব উৎসব দেখানো সম্ভব নয়।'}</p>
      <button type="button" class="ref-date-open" data-act="searchDateGo" data-k="${k}">এই দিনের বিস্তারিত পঞ্জিকা দেখুন →</button>
    </div>`;
  }
  function searchResultsHTML(q) {
    if (!bangNorm(q)) {
      return `<div class="sres-empty">${vico('search', 'sm')}<div>কিছু লিখুন — যেমন <b>গীতা</b>, <b>ধ্যান</b>, <b>অক্ষয়</b>, <b>২:৪৭</b>, <b>যোগাসন</b></div></div>`;
    }
    const dateInfo = parseSearchDate(q);
    const dateResult = dateInfo ? searchDateHTML(dateInfo) : '';
    if (dateInfo && !dateInfo.lone) return dateResult;
    const list = searchAll(q);
    if (!list.length && dateResult) return dateResult;
    if (!list.length) {
      return `<div class="sres-empty">${vico('search', 'sm')}<div>“${esc(q)}” — কিছু পাওয়া যায়নি।<br/><span class="mini muted">অন্য শব্দ বা ছোট কীওয়ার্ড দিয়ে দেখুন।</span></div></div>`;
    }
    return dateResult + list.map(e => `<button class="sres" data-act="searchGo" data-to="${e.r}">
        <span class="sres-k">${esc(e.k || '·')}</span>
        <span class="sres-t"><b>${esc(e.t)}</b>${e.s ? `<i>${esc(e.s)}</i>` : ''}</span>
        ${vico('arrow', 'sm sr-arrow')}
      </button>`).join('') + `<div class="sres-count">${bn(list.length)}টি মিল পাওয়া গেল</div>`;
  }
  function searchPopHTML() {
    return `<div class="setpop-bg" data-act="searchClose" aria-hidden="true"></div>
      <div class="setpop-card search-card" role="dialog" aria-modal="true" aria-label="সার্চ">
        <div class="setpop-head">
          <div>
            <div class="mini muted" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700;font-size:9px">Search</div>
            <div class="display" style="font-size:16px;margin-top:2px">খুঁজুন</div>
          </div>
          <button class="iconbtn" data-act="searchClose" aria-label="বন্ধ করুন">${vico('close')}</button>
        </div>
        <div class="sbar">
          ${vico('search', 'sm')}
          <input id="sq" class="sq" type="search" inputmode="search" autocomplete="off"
            placeholder="গীতা, ধ্যান, অক্ষয় তৃতীয়া, ২:৪৭…" aria-label="যা খুঁজছেন লিখুন" />
        </div>
        <div class="search-res" id="searchRes">${searchResultsHTML('')}</div>
      </div>`;
  }
  function openSearchPop() {
    let host = document.getElementById('searchPop');
    if (!host) {
      document.body.insertAdjacentHTML('beforeend', '<div id="searchPop" class="setpop searchpop"></div>');
      host = document.getElementById('searchPop');
    }
    host.innerHTML = searchPopHTML();
    host.classList.add('on');
    document.body.classList.add('setpop-lock');
    setTimeout(() => { const q = document.getElementById('sq'); if (q) q.focus(); }, 90);
  }
  function closeSearchPop() {
    const host = document.getElementById('searchPop');
    if (host) { host.classList.remove('on'); host.innerHTML = ''; }
    document.body.classList.remove('setpop-lock');
  }
  function runSearch(val) {
    const box = document.getElementById('searchRes');
    if (box) box.innerHTML = searchResultsHTML(val);
  }

  /* Daily task tracker shares the same per-day ritual data as the home list. */
  const DAILY_TASK_LABELS = ['সকালের নিত্যকর্ম সম্পন্ন', 'গীতা ২.৪৭ পাঠ', 'সন্ধ্যা আরতি ও কুইজ'];
  function dailyTasksHTML() {
    const values = S.rituals[TODAY_KEY] || [false, false, false];
    const count = values.filter(Boolean).length;
    return `<div class="setpop-bg" data-act="dailyTasksClose" aria-hidden="true"></div>
      <div class="setpop-card daily-task-card" role="dialog" aria-modal="true" aria-labelledby="daily-task-title">
        <div class="setpop-head"><div><div class="daily-task-kicker">দৈনিক কাজ</div><h2 id="daily-task-title">আজকের সাধনা</h2></div>
          <button class="iconbtn" data-act="dailyTasksClose" aria-label="বন্ধ করুন">${vico('close')}</button></div>
        <div class="daily-task-progress"><b>${bn(count)} / ৩ সম্পন্ন</b><span>${count === 3 ? 'আজকের সব কাজ সম্পন্ন' : `আর ${bn(3-count)}টি বাকি`}</span></div>
        <div class="daily-task-bar" aria-hidden="true"><i style="width:${count / 3 * 100}%"></i></div>
        <p class="daily-task-hint">কাজ শেষ হলে নিজে চিহ্নিত করুন।</p>
        <div class="daily-task-list">${DAILY_TASK_LABELS.map((label,i) => `<button class="daily-task-row${values[i] ? ' is-done' : ''}" type="button" role="checkbox" aria-checked="${values[i] ? 'true' : 'false'}" data-act="dailyTaskToggle" data-i="${i}"><span class="daily-task-check" aria-hidden="true">${values[i] ? '✓' : ''}</span><span>${esc(label)}</span></button>`).join('')}</div>
        <button class="btn gold block daily-task-go" data-act="dailyTaskGo">সাধনা বিভাগে যান →</button>
        <div class="daily-task-foot">অগ্রগতি এই ব্রাউজারে সংরক্ষিত থাকে</div>
      </div>`;
  }
  function openDailyTasks() {
    let host = document.getElementById('dailyTaskPop');
    if (!host) { document.body.insertAdjacentHTML('beforeend', '<div id="dailyTaskPop" class="setpop daily-task-pop"></div>'); host = document.getElementById('dailyTaskPop'); }
    host.innerHTML = dailyTasksHTML(); host.classList.add('on'); document.body.classList.add('setpop-lock');
    const close = host.querySelector('button[data-act="dailyTasksClose"]'); if (close) close.focus();
  }
  function refreshDailyTasks() {
    const host = document.getElementById('dailyTaskPop');
    if (host && host.classList.contains('on')) host.innerHTML = dailyTasksHTML();
  }
  function closeDailyTasks() {
    const host = document.getElementById('dailyTaskPop');
    if (!host || !host.classList.contains('on')) return;
    host.classList.remove('on'); host.innerHTML = ''; document.body.classList.remove('setpop-lock');
    const card = document.querySelector('.ref-sadhana'); if (card) card.focus();
  }

  /* --------------------------- সেটিংস পপআপ --------------------------- */
  function setPopHTML() {
    return `<div class="setpop-bg" data-act="setPopupClose" aria-hidden="true"></div>
      <div class="setpop-card" role="dialog" aria-modal="true" aria-label="সেটিংস">
        <div class="setpop-head">
          <div>
            <div class="mini muted" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700;font-size:9px">Preferences</div>
            <div class="display" style="font-size:16px;margin-top:2px">সেটিংস</div>
          </div>
          <button class="iconbtn" data-act="setPopupClose" aria-label="বন্ধ করুন">${vico('close')}</button>
        </div>
        <div class="setpop-theme">
          <button class="segt ${S.theme === 'light' ? 'on' : ''}" data-act="themeSet" data-v="light">☀ লাইট</button>
          <button class="segt ${S.theme === 'dark' ? 'on' : ''}" data-act="themeSet" data-v="dark">🌙 ডার্ক</button>
        </div>
        ${prefCard()}
        <div class="mini muted" style="text-align:center;margin-top:10px;line-height:1.6">ডেটা শুধু এই ব্রাউজারে সংরক্ষিত</div>
      </div>`;
  }
  function openSetPop() {
    let host = document.getElementById('setPop');
    if (!host) {
      document.body.insertAdjacentHTML('beforeend', '<div id="setPop" class="setpop"></div>');
      host = document.getElementById('setPop');
    }
    host.innerHTML = setPopHTML();
    host.classList.add('on');
    document.body.classList.add('setpop-lock');
  }
  function refreshSetPop() {
    const host = document.getElementById('setPop');
    if (host && host.classList.contains('on')) host.innerHTML = setPopHTML();
  }
  function closeSetPop() {
    const host = document.getElementById('setPop');
    if (host) { host.classList.remove('on'); host.innerHTML = ''; }
    document.body.classList.remove('setpop-lock');
  }

  /* সেটিংস পর্দা — লাইট/ডার্ক টগল এখানেই */
  function settingsScreen() {
    return `${appbar('সেটিংস', 'Settings', '#/home')}
    <div class="pad settings-pop" style="padding-top:0">
      <div class="sect"><h4>প্রদর্শন</h4><div class="line"></div>
        <span class="pill">${S.theme === 'light' ? 'লাইট' : 'ডার্ক'}</span></div>
      <div class="card pad stack" style="gap:6px">
        <div class="mini muted" style="line-height:1.75">থিম বদলাতে নিচের <b>লাইট মোড</b> সারিতে ট্যাপ করুন — পুরো অ্যাপ সঙ্গে সঙ্গে বদলে যাবে।</div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn ${S.theme === 'light' ? 'gold' : 'ghost'} sm" data-act="themeSet" data-v="light">☀ লাইট</button>
          <button class="btn ${S.theme === 'dark' ? 'gold' : 'ghost'} sm" data-act="themeSet" data-v="dark">🌙 ডার্ক</button>
        </div>
      </div>
      <div class="sect"><h4>পছন্দ ও সেটিংস</h4><div class="line"></div></div>
<div class="card pad" style="padding:4px 14px">
        <div class="setting" data-act="toggleTheme">
          <span style="color:var(--gold-300)">${ico('sun', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">লাইট মোড (পাটা-থিম)</div>
          <span class="toggle ${S.theme === 'light' ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleBg">
          <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">পটভূমি থিম (মন্দির-পত্র)</div>
          <span class="toggle ${S.bg ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleSound">
          <span style="color:var(--gold-300)">${ico('bell', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">মৃদু ঘণ্টাধ্বনি</div>
          <span class="toggle ${S.sound ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleMotion">
          <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">অ্যানিমেশন</div>
          <span class="toggle ${S.motion ? 'on' : ''}"></span></div>
        <div class="setting" data-act="toggleName">
          <span style="color:var(--gold-300)">${vico('user', 'sm')}</span>
          <div style="flex:1;font-size:12.5px">নাম পরিবর্তন</div>
          <span class="mini muted">${esc(S.name.split(' ')[0])} ›</span></div>
        <div class="setting" data-act="reset">
          <span style="color:var(--danger)">${ico('close', 'sm')}</span>
          <div style="flex:1;font-size:12.5px;color:var(--danger)">ডেমো ডেটা রিসেট</div>
          <span class="mini muted">›</span></div>
      </div>
      <p class="mini muted" style="text-align:center;margin:18px 0 0;line-height:1.7">সনাতন বিদ্যাপীঠ · ডেমো সংস্করণ ১.০<br/>আপনার ডেটা শুধু এই ব্রাউজারে সংরক্ষিত</p>
      <div style="height:24px"></div>
    </div>`;
  }

  function meScreen() {
    const days = Object.keys(S.activity).sort().slice(-7);
    const max = Math.max(...days.map(d => S.activity[d]), 100);
    const weekDone = days.filter(d => S.activity[d] > 0).length;
    const avg = Math.round(days.reduce((s, d) => s + S.activity[d], 0) / days.length);
    const earnings = S.provider ? S.orders.filter(o => o.kind === 'service').reduce((s, o) => s + o.amount, 0) : 0;
    return `${appbar('আমার অগ্রগতি', 'Dashboard', undefined, true)}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad stack">
        <div style="display:flex;gap:14px;align-items:center">
          <div class="av round" style="width:56px;height:56px;font-size:19px">${esc(S.name.slice(0, 2))}</div>
          <div style="flex:1">
            <div class="display" style="font-size:15px">${esc(S.name)}</div>
            <div class="mini muted" style="margin-top:4px">শিক্ষার্থী · স্তর ${bn(2)} · যোগ দিয়েছেন জুন ২০২৬</div>
            <div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">
              <span class="pill">🔥 ${bn(S.streak)} দিন</span>
              <span class="pill">${bn(Object.keys(S.read).length)} শ্লোক</span>
              <span class="pill ok">${bn(S.attempts.length)} কুইজ</span></div>
          </div>
        </div>
      </div>

      <div class="mt">${roleSwitch()}</div>
      <div class="mt">${rolePanel()}</div>

      <div class="sect"><h4>এই সপ্তাহের সাধনা</h4><div class="line"></div><span class="mini muted">${bn(weekDone)}/৭ দিন</span></div>
      <div class="card pad">
        <div class="chart">
          ${days.map(d => {
        const v = S.activity[d] || 0;
        const h = Math.max(6, Math.round(v / max * 100));
        const dd = new Date(d + 'T00:00:00');
        return `<div class="col"><div class="bwrap"><div class="b ${v ? '' : 'empty'}" style="height:${h}%"></div></div>
              <div class="d">${BN_DAYS[dd.getDay()]}</div></div>`;
      }).join('')}
        </div>
        <div class="kv" style="margin-top:13px;padding-top:11px;border-top:1px solid var(--hairline)">
          <span class="mini muted">দৈনিক লক্ষ্য ${bn(25)} মিনিট</span>
          <span class="mini" style="color:var(--ok)">গড় ${bn(avg)} মিনিট</span></div>
      </div>

      <div class="sect"><h4>দৈনিক হিসাব</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/track/history">হিস্ট্রি ›</button></div>
      <div class="card pad" style="display:flex;align-items:center;gap:12px" data-act="nav" data-to="#/track" role="button" tabindex="0">
        <div class="ring" style="--p:${scoreOf(entryFor(TODAY_KEY), todayAuto()).total}%;width:46px;height:46px"><div><div class="n" style="font-size:12px">${bn(scoreOf(entryFor(TODAY_KEY), todayAuto()).total)}</div></div></div>
        <div style="flex:1"><div style="font-size:12.5px;font-weight:600">আজকের স্কোর</div>
          <div class="mini muted" style="margin-top:3px">গড় ${bn((() => { const ks = Object.keys(S.daily); if (!ks.length) return 0; return Math.round(ks.reduce((a, k) => a + scoreOf(S.daily[k], k === TODAY_KEY ? todayAuto() : null).total, 0) / ks.length); })())}/১০০ · ${bn(Object.keys(S.daily).length)} দিনের হিসাব</div></div>
        ${ico('arrow', 'sm')}
      </div>

      <div class="sect"><h4>আমার আয়</h4><div class="line"></div>
        <span class="pill ${S.provider ? 'ok' : ''}">${S.provider ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span></div>
      <div class="card pad">
        ${S.provider ? `
          <div class="kv"><div><div class="mini muted">মোট আয়</div>
            <div class="display" style="font-size:21px;color:var(--gold-200);margin-top:3px">৳ ${bnN(earnings)}</div></div>
            <div style="text-align:right"><div class="mini muted">পরবর্তী পেআউট</div>
              <div style="font-size:12.5px;font-weight:600;margin-top:5px">রবিবার · ৳ ${bnN(Math.round(earnings * .85))}</div></div></div>
          <div class="mt">
            <div class="ledger"><span>মোট অর্ডার (৮৫% শেয়ার)</span><span>৳ ${bnN(Math.round(earnings * .85))}</span></div>
            <div class="ledger"><span>প্লাটফর্ম ফি ১২%</span><span style="color:var(--danger)">− ৳ ${bnN(Math.round(earnings * .12))}</span></div>
          </div>`
        : `<p class="mini muted" style="margin:0 0 11px;line-height:1.7">এখনো প্রোভাইডার প্রোফাইল নেই। দক্ষতা দিয়ে আয় শুরু করতে প্রোফাইল খুলুন।</p>
             <button class="btn gold block sm" data-act="nav" data-to="#/market">মার্কেটপ্লেসে যান</button>`}
      </div>

      <div class="sect"><h4>পছন্দ ও সেটিংস</h4><div class="line"></div></div>
      ${prefCard()}
      <p class="mini muted" style="text-align:center;margin:18px 0 0;line-height:1.7">সনাতন বিদ্যাপীঠ · ডেমো সংস্করণ ১.০<br/>আপনার ডেটা শুধু এই ব্রাউজারে সংরক্ষিত</p>
    </div><div style="height:24px"></div>`;
  }

  /* =====================================================================
     12½. সাধনা — জপ · ধ্যান · যোগা
     ===================================================================== */
  const JAPA_C = 2 * Math.PI * 104;

  function sadhanaScreen() {
    const t = U.sadhanaTab;
    const tabs = [['japa', 'জপ'], ['dhyana', 'ধ্যান'], ['yoga', 'যোগা']];
    let body = t === 'dhyana' ? dhyanaView() : t === 'yoga' ? yogaView() : japaView();
    return `${appbar('সাধনা', 'Japa · Dhyana · Yoga', '#/home', true)}
    <div class="pad" style="padding-top:0">
      <div class="segment">${tabs.map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="sadhanaTab" data-t="${k}">${l}</button>`).join('')}</div>
      ${t === 'dhyana' ? `<div class="reuse-meditation"><img class="reuse-scene" src="icons/reference/calendar-devotion.png" alt="" aria-hidden="true"/><div class="reuse-meditation-copy"><b>ধ্যান ও মনসংযোগ</b><span>শান্ত মনে শ্বাসে মন ফেরান</span></div><img class="reuse-sage" src="icons/reference/cal-sage.png" alt="" aria-hidden="true"/></div>` : ''}
      <div class="mt">${body}</div>
    </div><div style="height:22px"></div>`;
  }

  function japaView() {
    const j = S.japa;
    const m = DB.japas.find(x => x.id === j.mantra) || DB.japas[0];
    const pct = j.count / 108;
    const off = (JAPA_C * (1 - pct)).toFixed(1);
    return `<div class="card oath pad">
      <div class="kv"><div><div class="mini muted">জপ চলছে</div>
        <div class="display" style="font-size:14px;margin-top:3px">${esc(m.title)}</div></div>
        <span class="pill">${bn(j.rounds)} মালা</span></div>

      <div class="japa-wrap">
        <button class="japa-btn" data-act="japaTap" aria-label="জপ গণনা">
          <svg class="japa-ring" viewBox="0 0 226 226" aria-hidden="true">
            <defs><linearGradient id="jg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f8e3b3"/><stop offset="1" stop-color="#b1842e"/></linearGradient></defs>
            <circle class="bg" cx="113" cy="113" r="104"/>
            <circle class="fg" id="japaFg" cx="113" cy="113" r="104" stroke-dasharray="${JAPA_C.toFixed(1)}" stroke-dashoffset="${off}"/>
          </svg>
          <span class="japa-core">
            <span class="c" id="japaCount">${bn(j.count)}</span>
            <span class="of">/ ১০৮</span>
            <span class="hint">ট্যাপ করুন</span>
          </span>
        </button>
      </div>

      <div class="mala-dots" id="malaDots">${Array.from({ length: 18 }, (_, i) =>
        `<i class="${j.count >= (i + 1) * 6 ? 'on' : ''}"></i>`).join('')}</div>

      <div class="kv" style="margin-top:14px">
        <span class="mini muted">মোট জপ</span>
        <b style="font-size:12.5px">${bn(j.rounds * 108 + j.count)}</b></div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn ghost sm" style="flex:1" data-act="japaReset">রিসেট</button>
        <button class="btn gold sm" style="flex:1.4" data-act="japaFinish">মালা সম্পূর্ণ</button>
      </div>
    </div>

    <div class="sect"><h4>মন্ত্র বেছে নিন</h4><div class="line"></div></div>
    ${DB.japas.map(x => `<div class="card rowcard stack" data-act="japaMantra" data-id="${x.id}" role="button" tabindex="0" style="cursor:pointer">
      <div class="datebox" style="width:42px;height:44px"><b>ॐ</b></div>
      <div style="flex:1"><div class="kv"><span class="ttl">${esc(x.title)}</span>
        ${x.id === S.japa.mantra ? '<span class="pill ok">চলছে</span>' : ''}</div>
        <div class="mini muted" style="margin-top:4px">${esc(x.note)} · ${bn(108)} জপ = ১ মালা</div></div>
    </div>`).join('')}`;
  }

  function dhyanaView() {
    const md = U.med;
    const sel = DB.meditations.find(x => x.mins === md.mins) || DB.meditations[1];
    const mm = String(Math.floor(md.left / 60)).padStart(2, '0'), ss = String(md.left % 60).padStart(2, '0');
    const total = md.mins * 60;
    const pct = (1 - md.left / total) * 100;
    return `<div class="card oath pad">
      <div class="kv"><div><div class="mini muted">ধ্যান সেশন</div>
        <div class="display" style="font-size:14px;margin-top:3px">${esc(sel.title)}</div></div>
        <span class="pill ${md.running ? 'ok' : ''}">${md.running ? 'চলছে' : 'প্রস্তুত'}</span></div>

      <div class="breath-stage">
        <div class="breath ${md.running ? 'in' : ''}" id="breathCircle">
          <div>
            <div class="ph" id="breathPhase">${md.running ? 'শ্বাস নিন' : 'প্রস্তুত'}</div>
            <div class="tm" id="medTime">${bn(mm)}:${bn(ss)}</div>
          </div>
        </div>
      </div>
      <div class="bar"><i id="medBar" style="width:${pct}%"></i></div>
      <div class="kv" style="margin-top:9px"><span class="mini muted">শ্বাস: ৪-৪-৮ ছন্দ</span>
        <span class="mini muted">${esc(sel.note)}</span></div>

      <div style="display:flex;gap:8px;margin-top:13px">
        <button class="btn ghost sm" style="flex:1" data-act="medReset">রিসেট</button>
        <button class="btn gold sm" style="flex:1.6" data-act="medToggle">${md.running ? 'বিরতি দিন' : 'ধ্যান শুরু করুন'}</button>
      </div>
    </div>

    <div class="sect"><h4>সময় বেছে নিন</h4><div class="line"></div></div>
    <div class="preset">
      ${DB.meditations.map(x => `<button class="${md.mins === x.mins ? 'on' : ''}" data-act="medPreset" data-m="${x.mins}">${bn(x.mins)} মিনিট</button>`).join('')}
    </div>

    ${S.sessions.length ? `<div class="sect"><h4>আগের সেশন</h4><div class="line"></div></div>
      <div class="card pad">${S.sessions.slice(-4).reverse().map(x => `
        <div class="ledger"><span>${esc(x.title)}</span><span>${bn(x.mins)} মিনিট · ${esc(x.when)}</span></div>`).join('')}</div>` : ''}
    <p class="mini muted" style="text-align:center;margin-top:14px;line-height:1.7">চোখ বন্ধ করে বসুন, মেরুদণ্ড সোজা রাখুন।<br/>শ্বাসে মন ফেরান — বিচার করবেন না, শুধু লক্ষ্য করুন।</p>`;
  }

  function yogaView() {
    const doneCount = Object.keys(S.asanaDone).filter(k => S.asanaDone[k]).length;
    return `<div class="card oath rowcard stack" data-act="nav" data-to="#/sadhana/seq" role="button" tabindex="0" style="cursor:pointer">
      <div class="datebox" style="width:44px;height:48px"><b>১২</b><i>ধাপ</i></div>
      <div style="flex:1"><div class="kv"><span class="ttl" style="font-family:var(--f-dis)">সূর্য নমস্কার</span><span class="pill">গাইডেড</span></div>
        <div class="mini muted" style="margin-top:4px">১২ ধাপ · ≈ ৫ মিনিট · সকালে খালি পেটে</div></div>
      ${ico('arrow', 'sm')}</div>

    <div class="sect"><h4>যোগাসন</h4><div class="line"></div><span class="mini muted">${bn(doneCount)}/${bn(DB.asanas.length)} আজ</span></div>
    ${DB.asanas.map(a => `<div class="card pad asana stack">
      <div class="kv"><h5>${esc(a.name)}</h5>
        <span class="pill ${S.asanaDone[a.id] ? 'ok' : 'flat'}">${S.asanaDone[a.id] ? 'সম্পন্ন' : a.level}</span></div>
      <div class="mini muted" style="margin-top:3px">${bn(a.time)} সেকেন্ড · ${esc(a.benefit)}</div>
      <ol class="st">${a.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn ghost sm" style="flex:1" data-act="asanaToggle" data-id="${a.id}">${S.asanaDone[a.id] ? 'আবার শুরু' : 'সম্পন্ন করুন'}</button>
      </div>
    </div>`).join('')}
    <p class="mini muted" style="text-align:center;margin-top:12px;line-height:1.7">শরীরে ব্যথা বা উচ্চ রক্তচাপ থাকলে চিকিৎসকের পরামর্শ নিন।<br/>প্রতিটি আসনে শ্বাস স্বাভাবিক রাখুন — জোর করবেন না।</p>`;
  }

  function seqScreen() {
    const st = DB.suryaNamaskar, cur = U.seq.i;
    return `${appbar('সূর্য নমস্কার', '১২ ধাপ · গাইডেড', '#/sadhana/yoga')}
    <div class="pad">
      <div class="seq-head">
        <div style="text-align:center">
          <div class="n">${esc(st[cur].n)}</div>
          <div class="d">${esc(st[cur].d)}</div>
          <div class="pill" style="margin-top:10px" id="seqTimer">${bn(st[cur].s)} সে.</div>
        </div>
      </div>
      <div class="bar" style="margin:12px 0"><i id="seqBar" style="width:${(cur / st.length) * 100}%"></i></div>
      <div class="kv"><span class="mini muted">ধাপ ${bn(cur + 1)} / ${bn(st.length)}</span>
        <span class="mini muted">${U.seq.running ? 'চলছে' : 'বিরতিতে'}</span></div>

      <div style="display:flex;gap:8px;margin:12px 0">
        <button class="btn ghost sm" style="flex:1" data-act="seqPrev" ${cur === 0 ? 'disabled' : ''}>আগের</button>
        <button class="btn gold sm" style="flex:1.5" data-act="seqToggle">${U.seq.running ? 'বিরতি' : 'শুরু করুন'}</button>
        <button class="btn ghost sm" style="flex:1" data-act="seqNext">পরের</button>
      </div>

      <div id="seqList">${st.map((x, i) => `
        <div class="card rowcard stack" data-seq-step="${i}" style="${i === cur ? 'border-color:var(--card-border-strong)' : 'opacity:' + (i < cur ? '.62' : '1') + ';background:transparent'}">
          <div class="datebox" style="width:38px;height:40px"><b>${bn(i + 1)}</b></div>
          <div style="flex:1"><div class="kv"><span class="ttl">${esc(x.n)}</span><span class="mini muted">${bn(x.s)} সে.</span></div>
            <div class="mini muted" style="margin-top:3px">${esc(x.d)}</div></div>
          ${i < cur ? `<span class="pill ok">✓</span>` : i === cur ? '<span class="pill">এখন</span>' : ''}
        </div>`).join('')}</div>
    </div><div style="height:20px"></div>`;
  }

  /* --------------------------- japa / med / seq engine --------------------------- */
  function japaUpdate() {
    const j = S.japa;
    const c = document.getElementById('japaCount'), fg = document.getElementById('japaFg'), dots = document.getElementById('malaDots');
    if (c) c.textContent = bn(j.count);
    if (fg) fg.setAttribute('stroke-dashoffset', (JAPA_C * (1 - j.count / 108)).toFixed(1));
    if (dots) [...dots.children].forEach((d, i) => d.classList.toggle('on', j.count >= (i + 1) * 6));
  }
  function japaTap() {
    const j = S.japa;
    j.count++;
    if (j.count >= 108) {
      j.count = 0; j.rounds++;
      chime('complete'); bumpActivity(6);
      setTimeout(() => burst(window.innerWidth / 2, 260, 22), 60);
      toast(`এক মালা সম্পূর্ণ 🌸 · মোট ${bn(j.rounds)} মালা`);
    } else {
      if (j.count % 9 === 0) chime('soft');
      if (navigator.vibrate) navigator.vibrate(8);
    }
    save('japa'); japaUpdate();
  }

  function medTick() {
    const md = U.med;
    md.left--;
    if (md.left <= 0) { medComplete(); return; }
    const mm = String(Math.floor(md.left / 60)).padStart(2, '0'), ss = String(md.left % 60).padStart(2, '0');
    const tEl = document.getElementById('medTime'); if (tEl) tEl.textContent = `${bn(mm)}:${bn(ss)}`;
    const bar = document.getElementById('medBar'); if (bar) bar.style.width = (1 - md.left / (md.mins * 60)) * 100 + '%';
    const el = (md.mins * 60 - md.left) % 16;
    const phase = el < 4 ? 'শ্বাস নিন' : el < 8 ? 'ধরে রাখুন' : 'শ্বাস ছাড়ুন';
    if (phase !== md.phase) {
      md.phase = phase;
      const pEl = document.getElementById('breathPhase'); if (pEl) pEl.textContent = phase;
      const circ = document.getElementById('breathCircle');
      if (circ) { circ.classList.toggle('in', phase === 'শ্বাস নিন'); circ.classList.toggle('out', phase === 'শ্বাস ছাড়ুন'); }
    }
  }
  function medStart() {
    clearInterval(U.medTimer);
    U.med.running = true;
    U.medTimer = setInterval(medTick, 1000);
  }
  function medComplete() {
    clearInterval(U.medTimer); U.medTimer = null;
    U.med.running = false;
    const mins = U.med.mins;
    S.sessions.push({ title: (DB.meditations.find(x => x.mins === mins) || {}).title || 'ধ্যান', mins, date: TODAY_KEY, when: `${bn(new Date().getDate())} ${BN_MONTH[new Date().getMonth()].slice(0, 4)}` });
    S.sessions = S.sessions.slice(-20); save('sessions');
    bumpActivity(mins);
    U.med.left = mins * 60;
    chime('complete');
    setTimeout(() => burst(window.innerWidth / 2, 300, 26), 80);
    toast(`ধ্যান সম্পূর্ণ 🌸 · ${bn(mins)} মিনিট`);
    render();
  }

  function seqTick() {
    const st = DB.suryaNamaskar;
    U.seq.left--;
    if (U.seq.left <= 0) {
      if (U.seq.i >= st.length - 1) {
        clearInterval(U.seqTimer); U.seqTimer = null; U.seq.running = false;
        bumpActivity(5); chime('complete');
        setTimeout(() => burst(window.innerWidth / 2, 250, 24), 80);
        toast('সূর্য নমস্কার সম্পূর্ণ 🌸 · ৫ মিনিট');
        render(); return;
      }
      U.seq.i++; U.seq.left = st[U.seq.i].s; render(); return;
    }
    const tEl = document.getElementById('seqTimer'); if (tEl) tEl.textContent = `${bn(U.seq.left)} সে.`;
  }
  function seqStart() {
    clearInterval(U.seqTimer);
    U.seq.running = true;
    U.seqTimer = setInterval(seqTick, 1000);
  }

  /* =====================================================================
     13. ব্যবহারকারী ব্যবস্থাপনা (User Management)
     ===================================================================== */
  const ROLES = [
    { id: 'student', label: 'শিক্ষার্থী', icon: 'user' },
    { id: 'parent', label: 'অভিভাবক', icon: 'heart' },
    { id: 'teacher', label: 'শিক্ষক', icon: 'book' },
    { id: 'reviewer', label: 'পর্যালোচক', icon: 'shield' },
    { id: 'admin', label: 'অ্যাডমিন', icon: 'gear' }
  ];
  const roleLabel = id => (ROLES.find(r => r.id === id) || ROLES[0]).label;
  const uStatus = u => S.userState[u.id] || u.status;
  const statusPill = st => st === 'active' ? '<span class="pill ok">সক্রিয়</span>'
    : st === 'pending' ? '<span class="pill">অপেক্ষমাণ</span>'
      : '<span class="pill" style="color:var(--danger);border-color:rgba(224,114,106,.45)">স্থগিত</span>';

  function logAction(text) {
    S.audit.unshift({ text, at: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) });
    S.audit = S.audit.slice(0, 12); save('audit');
  }

  function roleSwitch() {
    return `<div class="card pad" style="padding:12px">
      <div class="kv" style="margin-bottom:9px"><b style="font-size:12px">ভূমিকা (রোল) বদলে দেখুন</b>
        <span class="mini muted">ডেমো</span></div>
      <div class="cats" style="padding:0;gap:6px">
        ${ROLES.map(r => `<button class="chip ${S.role === r.id ? 'on' : ''}" data-act="setRole" data-r="${r.id}">${r.label}</button>`).join('')}
      </div>
      <div class="mini muted" style="margin-top:9px;line-height:1.6">বর্তমানে আপনি <b>${roleLabel(S.role)}</b> হিসেবে আছেন — এই ভূমিকা অনুযায়ী স্ক্রিন ও অনুমতি বদলাবে।</div>
    </div>`;
  }

  function rolePanel() {
    if (S.role === 'parent') {
      return `<div class="card oath pad">
        <div class="kv"><b style="font-size:12.8px">আমার সন্তান</b><button class="act" data-act="addChild">+ যোগ করুন</button></div>
        ${S.children.map((c, i) => `<div class="li">
          <div class="av round">${esc(c.n.slice(0, 1))}</div>
          <div style="flex:1">
            <div style="font-size:12.5px;font-weight:600">${esc(c.n)} <span class="mini muted">· ${esc(c.cls)}</span></div>
            <div class="bar thin" style="margin-top:6px"><i style="width:${c.pct}%"></i></div>
            <div class="mini muted" style="margin-top:5px">শাস্ত্র পাঠ ${bn(c.pct)}% · সাপ্তাহিক কুইজে অংশ নিয়েছে</div>
          </div>
          <button class="iconbtn" data-act="toast" data-msg="${esc(c.n)}-এর রিপোর্ট কার্ড শীঘ্রই">${ico('arrow', 'sm')}</button>
        </div>`).join('')}
        <div class="mini muted" style="margin-top:10px;line-height:1.6">অভিভাবক হিসেবে আপনি সন্তানের অগ্রগতি দেখতে পাবেন — তার পাসওয়ার্ড বা ব্যক্তিগত চ্যাট নয়।</div>
      </div>`;
    }
    if (S.role === 'teacher') {
      const earn = S.orders.filter(o => o.kind === 'service').reduce((a, o) => a + o.amount, 0);
      return `<div class="card oath pad">
        <div class="kv"><b style="font-size:12.8px">শিক্ষক প্যানেল</b><span class="pill ok">যাচাইকৃত</span></div>
        <div class="grid3 mt">
          <div class="stat"><div class="k">শিক্ষার্থী</div><div class="v">${bn(24)}</div></div>
          <div class="stat"><div class="k">চলমান কোর্স</div><div class="v">${bn(3)}</div></div>
          <div class="stat"><div class="k">এই মাসের আয়</div><div class="v">৳ ${bnN(12450)}</div></div>
        </div>
        <div class="li" style="margin-top:4px"><div class="av round">আ</div>
          <div style="flex:1"><div style="font-size:12.5px">আরাধ্যা — গীতা ২.৪৭</div><div class="mini muted">২ দিন আগে · অগ্রগতি ৪৫%</div></div>
          <span class="pill">ফিডব্যাক দিন</span></div>
        <div class="li"><div class="av round">ঈ</div>
          <div style="flex:1"><div style="font-size:12.5px">ঈশান — নিত্যকর্ম লেসন ৪</div><div class="mini muted">আজ · ৭২%</div></div>
          <span class="pill ok">সম্পূর্ণ</span></div>
        <button class="btn ghost block sm mt" data-act="nav" data-to="#/courses">আমার কোর্স দেখুন</button>
      </div>`;
    }
    if (S.role === 'reviewer') {
      return `<div class="card oath pad">
        <div class="kv"><b style="font-size:12.8px">পর্যালোচনা কিউ</b><span class="pill">${bn(DB.reports.length)} টি</span></div>
        <p class="mini muted" style="margin:8px 0 10px;line-height:1.6">শাস্ত্রীয় নির্ভুলতা ও নীতিমালা — অনুমোদনের আগে দুইজন পর্যালোচকের সম্মতি লাগবে।</p>
        <button class="btn ghost block sm" data-act="nav" data-to="#/manage">মডারেশন কিউ খুলুন</button>
      </div>`;
    }
    if (S.role === 'admin') {
      return `<div class="card oath pad">
        <div class="kv"><b style="font-size:12.8px">অ্যাডমিন সারসংক্ষেপ</b><span class="pill ok">পূর্ণ অনুমতি</span></div>
        <div class="grid3 mt">
          <div class="stat"><div class="k">ব্যবহারকারী</div><div class="v">${bn(DB.users.length)}</div></div>
          <div class="stat"><div class="k">যাচাই বাকি</div><div class="v">${bn(DB.applications.filter(a => !S.appState[a.id]).length)}</div></div>
          <div class="stat"><div class="k">রিপোর্ট</div><div class="v">${bn(DB.reports.filter(r => !S.reportState[r.id]).length)}</div></div>
        </div>
        <button class="btn gold block sm mt" data-act="nav" data-to="#/manage">ম্যানেজমেন্ট প্যানেল</button>
      </div>`;
    }
    return `<div class="card pad">
      <div class="kv"><b style="font-size:12.8px">আমার শিক্ষা-প্রোফাইল</b><span class="pill">শিক্ষার্থী</span></div>
      <p class="mini muted" style="margin:8px 0 0;line-height:1.7">পাঠ, কুইজ ও কোর্সের অগ্রগতি নিচে দেখুন। অভিভাবক লিংক বা শিক্ষক-অনুমতি দরকার হলে প্রোফাইল থেকে যোগ করুন।</p>
    </div>`;
  }

  function manageScreen() {
    if (S.role !== 'admin' && S.role !== 'reviewer') {
      return `${appbar('ম্যানেজমেন্ট', 'User Management')}
      <div class="pad"><div class="card oath empty" style="margin-top:6px">
        <div class="illu">${ico('shield')}</div>
        <h5>শুধু অনুমোদিত ভূমিকার জন্য</h5>
        <p>এই প্যানেলে পৌঁছাতে অ্যাডমিন বা পর্যালোচক হতে হবে।<br/>ডেমোতে ভূমিকা বদলে দেখতে পারেন।</p>
        <button class="btn gold sm" data-act="setRole" data-r="admin">অ্যাডমিন হিসেবে দেখুন</button>
      </div>
      <div class="mt">${roleSwitch()}</div></div>`;
    }
    const tabs = [['users', 'ব্যবহারকারী'], ['verify', 'যাচাই'], ['moderation', 'মডারেশন'], ['payouts', 'পেআউট'], ['audit', 'লগ']];
    let body = '';

    if (U.adminTab === 'users') {
      const q = U.adminQ.trim().toLowerCase();
      const list = DB.users.filter(u => !q || (u.name + u.role + u.city).toLowerCase().includes(q));
      const counts = { active: 0, pending: 0, suspended: 0 };
      DB.users.forEach(u => { counts[uStatus(u)] = (counts[uStatus(u)] || 0) + 1; });
      body = `<div class="grid3">
          <div class="stat"><div class="k">সক্রিয়</div><div class="v">${bn(counts.active)}</div></div>
          <div class="stat"><div class="k">অপেক্ষমাণ</div><div class="v">${bn(counts.pending)}</div></div>
          <div class="stat"><div class="k">স্থগিত</div><div class="v">${bn(counts.suspended)}</div></div>
        </div>
        <div class="search mt">${ico('search', 'sm')}<input id="adminSearch" placeholder="নাম, ভূমিকা বা শহর…" value="${esc(U.adminQ)}" aria-label="ব্যবহারকারী খুঁজুন"/></div>
        <div class="mt">${list.map(u => {
        const st = uStatus(u);
        return `<div class="card pad stack">
            <div style="display:flex;gap:11px;align-items:center">
              <div class="av">${esc(u.name.slice(0, 1))}</div>
              <div style="flex:1;min-width:0">
                <div class="kv"><b style="font-size:12.8px">${esc(u.name)}</b>${statusPill(st)}</div>
                <div class="mini muted" style="margin-top:3px">${esc(u.role)} · ${esc(u.city)} · যোগ ${esc(u.joined)}</div>
              </div>
            </div>
            <div style="display:flex;gap:7px;margin-top:10px">
              ${st !== 'active' ? `<button class="btn ghost sm" style="flex:1" data-act="uStatus" data-id="${u.id}" data-v="active">${st === 'pending' ? 'অনুমোদন' : 'পুনর্বহাল'}</button>` : ''}
              ${st !== 'suspended' ? `<button class="btn ghost sm" style="flex:1;color:var(--danger)" data-act="uStatus" data-id="${u.id}" data-v="suspended">স্থগিত</button>` : ''}
              <button class="btn ghost sm" data-act="toast" data-msg="${esc(u.name)}-কে বার্তা পাঠানো হবে (ডেমো)">বার্তা</button>
            </div>
          </div>`;
      }).join('')}</div>`;
    }

    if (U.adminTab === 'verify') {
      body = `<p class="mini muted" style="margin:6px 0 12px;line-height:1.7">শিক্ষক/কথক হিসেবে যোগ দিতে আবেদন — NID ও যোগ্যতার প্রমাণ যাচাই করে অনুমোদন দিন।</p>
        ${DB.applications.map(a => {
        const st = S.appState[a.id];
        return `<div class="card pad stack">
            <div class="kv"><b style="font-size:12.8px">${esc(a.name)}</b>
              ${st === 'approved' ? '<span class="pill ok">অনুমোদিত</span>' : st === 'rejected' ? '<span class="pill" style="color:var(--danger)">বাতিল</span>' : '<span class="pill">অপেক্ষমাণ</span>'}</div>
            <div class="mini muted" style="margin:4px 0 8px">${esc(a.type)} · ${esc(a.subject)} · ${esc(a.at)}</div>
            <div class="mini" style="color:var(--ok)">${esc(a.docs)}</div>
            ${!st ? `<div style="display:flex;gap:7px;margin-top:10px">
              <button class="btn gold sm" style="flex:1" data-act="appDecide" data-id="${a.id}" data-v="approved">অনুমোদন</button>
              <button class="btn ghost sm" style="flex:1" data-act="appDecide" data-id="${a.id}" data-v="rejected">বাতিল</button></div>` : ''}
          </div>`;
      }).join('')}`;
    }

    if (U.adminTab === 'moderation') {
      body = `<p class="mini muted" style="margin:6px 0 12px;line-height:1.7">নীতিমালা অনুযায়ী রিপোর্ট — ভয়/অলৌকিক প্রতিশ্রুতি, অন্য সম্প্রদায় নিয়ে অবমাননা, আর্থিক অনিয়ম।</p>
        ${DB.reports.map(r => {
        const st = S.reportState[r.id];
        return `<div class="card pad stack">
            <div class="kv"><b style="font-size:12.8px">${esc(r.kind)} · ${esc(r.target)}</b>
              ${st ? '<span class="pill ok">নিষ্পত্তি</span>' : '<span class="pill">খোলা</span>'}</div>
            <div class="tiny muted" style="margin:6px 0 8px;line-height:1.65">${esc(r.text)}</div>
            <div class="mini muted">${esc(r.by)}</div>
            ${!st ? `<div style="display:flex;gap:7px;margin-top:10px">
              <button class="btn gold sm" style="flex:1" data-act="repDecide" data-id="${r.id}" data-v="actioned">কনটেন্ট সরান</button>
              <button class="btn ghost sm" style="flex:1" data-act="repDecide" data-id="${r.id}" data-v="dismissed">রিপোর্ট খারিজ</button></div>` : ''}
          </div>`;
      }).join('')}`;
    }

    if (U.adminTab === 'payouts') {
      body = `<p class="mini muted" style="margin:6px 0 12px;line-height:1.7">দ্বৈত নিয়ন্ত্রণ: প্রতিটি পেআউটে <b>দুইজন</b> অনুমোদনকারীর সম্মতি লাগবে।</p>
        ${DB.payouts.map(p => {
        const n = S.payoutAppr[p.id] !== undefined ? S.payoutAppr[p.id] : p.approvals;
        const done = n >= 2;
        return `<div class="card pad stack">
            <div class="kv"><b style="font-size:12.8px">${esc(p.provider)}</b>
              <span class="pill ${done ? 'ok' : ''}">${done ? 'রিলিজ হয়েছে' : bn(n) + '/২ অনুমোদন'}</span></div>
            <div class="kv" style="margin-top:6px"><span class="mini muted">${esc(p.method)}</span>
              <b style="font-size:13px;color:var(--gold-200)">৳ ${bnN(p.amount)}</b></div>
            <div class="bar thin" style="margin-top:9px"><i style="width:${Math.min(100, n / 2 * 100)}%"></i></div>
            ${!done ? `<button class="btn gold block sm mt" data-act="payoutAppr" data-id="${p.id}">আমি অনুমোদন করছি</button>` : ''}
          </div>`;
      }).join('')}`;
    }

    if (U.adminTab === 'audit') {
      body = S.audit.length ? `<div class="card pad">${S.audit.map(a =>
        `<div class="ledger"><span>${esc(a.text)}</span><span class="mini muted">${esc(a.at)}</span></div>`).join('')}</div>`
        : `<div class="card empty"><div class="illu">${ico('clock')}</div><h5>এখনো কোনো লগ নেই</h5><p>যেকোনো অনুমোদন/স্থগিত করার পর এখানে অডিট লগ দেখা যাবে।</p></div>`;
    }

    return `${appbar('ব্যবহারকারী ব্যবস্থাপনা', 'User Management · ' + roleLabel(S.role), '#/me', true)}
    <div class="pad" style="padding-top:0">
      <div class="segment">${tabs.map(([k, l]) => `<button class="${U.adminTab === k ? 'on' : ''}" data-act="adminTab" data-t="${k}">${l}</button>`).join('')}</div>
      <div class="mt">${body}</div>
    </div><div style="height:22px"></div>`;
  }

  /* =====================================================================
     12¾. দৈনিক হিসাব — Daily Tracker (৪ স্তম্ভ · মাস্টারমাইন্ড)
     ===================================================================== */
  const TRAK_DEF = () => ({
    puja: 0, japaExtra: 0, dhyanaExtra: 0, pathMin: 0, daanTaka: 0, daanMin: 0,
    workMin: 0, income: 0, studyMin: 0, familyMin: 0, sleepH: 8,
    lies: 0, anger: 0,
    gratitude: '', sankalpa: '', helpToday: '', learned: '', tomorrow: '', done: false
  });
  const entryFor = k => { if (!S.daily[k]) S.daily[k] = TRAK_DEF(); return S.daily[k]; };
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const todayAuto = () => ({
    japa: S.japa.rounds * 108 + S.japa.count,
    dhyana: S.sessions.filter(x => x.date === TODAY_KEY).reduce((a, x) => a + x.mins, 0),
    path: Object.keys(S.read).length,
    yoga: Object.keys(S.asanaDone).filter(k => S.asanaDone[k]).length
  });
  function scoreOf(e, auto) {
    const japa = e.japaExtra * 108 + (auto ? auto.japa : 0);
    const dhyana = e.dhyanaExtra + (auto ? auto.dhyana : 0);
    const path = e.pathMin + (auto ? auto.path * 2 : 0);
    const sadhana = clamp(
      20 * Math.min(1, e.puja / 20) + 25 * Math.min(1, japa / 108) + 20 * Math.min(1, dhyana / 10) +
      15 * Math.min(1, path / 10) + 20 * ((e.daanTaka > 0 || e.daanMin > 0) ? 1 : 0));
    const charitra = clamp(100 - e.lies * 15 - e.anger * 10);
    const karma = clamp(60 * Math.min(1, e.workMin / 240) + 25 * Math.min(1, e.income / 500) + 15 * Math.min(1, e.studyMin / 30));
    const jibon = clamp(50 * Math.min(1, e.familyMin / 60) + 30 * (e.sleepH >= 6 && e.sleepH <= 9 ? 1 : .4) + 20 * Math.min(1, (auto ? auto.yoga : 0) / 3));
    const total = Math.round(sadhana * .4 + charitra * .25 + karma * .2 + jibon * .15);
    const engaged = (e.puja + e.japaExtra + e.dhyanaExtra + e.pathMin + e.daanTaka + e.daanMin +
      e.workMin + e.income + e.studyMin + e.familyMin + e.lies + e.anger) > 0 ||
      (auto && (auto.japa || auto.dhyana || auto.path || auto.yoga));
    if (!engaged) return { sadhana: 0, charitra: 0, karma: 0, jibon: 0, total: 0, japa: auto ? auto.japa : 0, dhyana: auto ? auto.dhyana : 0, path: auto ? auto.path : 0 };
    return { sadhana: Math.round(sadhana), charitra: Math.round(charitra), karma: Math.round(karma), jibon: Math.round(jibon), total, japa, dhyana, path };
  }

  function stepper(k, label, val, step, unit, hint) {
    return `<div class="trow">
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px">${label}</div>
        ${hint ? `<div class="mini muted" style="margin-top:2px">${hint}</div>` : ''}
      </div>
      <div class="stepr">
        <button data-act="tfield" data-k="${k}" data-d="-1" aria-label="কমান">−</button>
        <span id="tv-${k}">${bn(val)}${unit ? ' <i>' + unit + '</i>' : ''}</span>
        <button data-act="tfield" data-k="${k}" data-d="1" aria-label="বাড়ান">+</button>
      </div>
    </div>`;
  }

  function trackScreen() {
    const e = entryFor(TODAY_KEY);
    const auto = todayAuto();
    const sc = scoreOf(e, auto);
    const ringPct = sc.total;
    const _bt = bengaliDate(TODAY);
    return `${appbar('আজকের হিসাব', `${bn(_bt.d)} ${_bt.month} ${bn(_bt.year)} · ${_bt.season}`, '#/home', true)}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad">
        <div style="display:flex;gap:14px;align-items:center">
          <div class="ring" style="--p:${ringPct}%;width:64px;height:64px"><div><div class="n" style="font-size:16px">${bn(sc.total)}</div><div class="u">স্কোর</div></div></div>
          <div style="flex:1;min-width:0">
            <div class="kv"><b style="font-size:13px">আজকের ভারসাম্য</b>
              <span class="pill ${e.done ? 'ok' : ''}">${e.done ? 'হিসাব সম্পন্ন' : 'চলমান'}</span></div>
            <div class="mini muted" style="margin-top:5px">৪টি স্তম্ভের গড় — আধ্যাত্মিক ৪০%, চরিত্র ২৫%, কর্ম ২০%, জীবন ১৫%</div>
          </div>
          <img class="reuse-balance" src="icons/reference/cal-balance.png" alt="" aria-hidden="true"/>
        </div>
        <div class="grid2 mt">
          ${[['আধ্যাত্মিক', sc.sadhana], ['চরিত্র', sc.charitra], ['কর্ম', sc.karma], ['জীবন', sc.jibon]].map(([n, v]) => `
            <div class="stat"><div class="k">${n}</div><div class="v">${bn(v)}/১০০</div>
              <div class="bar thin" style="margin-top:6px"><i style="width:${v}%"></i></div></div>`).join('')}
        </div>
      </div>

      <div class="sect"><h4>১ · ভগবান ও আধ্যাত্মিক সময়</h4><div class="line"></div></div>
      <div class="card pad" style="padding:4px 14px">
        ${stepper('puja', 'নিত্য পূজা', e.puja, 5, 'মিনিট', 'আরতি, দীপ, পুষ্পাঞ্জলিসহ')}
        ${stepper('japaExtra', 'জপ (অ্যাপের বাইরে)', e.japaExtra, 1, 'মালা', `অ্যাপে গণনা: ${bn(auto.japa)} জপ`)}
        ${stepper('dhyanaExtra', 'ধ্যান (অ্যাপের বাইরে)', e.dhyanaExtra, 5, 'মিনিট', `অ্যাপে সেশন: ${bn(auto.dhyana)} মিনিট`)}
        ${stepper('pathMin', 'শাস্ত্র পাঠ', e.pathMin, 5, 'মিনিট', `অ্যাপে পঠিত শ্লোক: ${bn(auto.path)}`)}
        ${stepper('daanTaka', 'দান', e.daanTaka, 50, '৳')}
        ${stepper('daanMin', 'সেবায় সময়', e.daanMin, 5, 'মিনিট', 'সাহায্য, সেবা, স্বেচ্ছাসেবা')}
      </div>
      <div class="mini muted" style="margin:8px 4px 0">স্বয়ংক্রিয়: জপ ${bn(auto.japa)} · ধ্যান ${bn(auto.dhyana)} মিনিট · শ্লোক ${bn(auto.path)} · যোগাসন ${bn(auto.yoga)}</div>

      <div class="sect"><h4>২ · চরিত্র ও মন</h4><div class="line"></div></div>
      <div class="card pad" style="padding:4px 14px">
        ${stepper('lies', 'আজ কতবার মিথ্যা বলেছি', e.lies, 1, 'বার', 'সৎ হিসাবই সবচেয়ে বড় সাধনা — বিচার নয়, সচেতনতা')}
        ${stepper('anger', 'ক্রোধ / রাগ', e.anger, 1, 'বার')}
        <div style="padding:11px 0;border-top:1px solid var(--hairline)">
          <div class="mini muted" style="margin-bottom:6px">আজকের কৃতজ্ঞতা</div>
          <textarea class="input" data-field="gratitude" rows="2" placeholder="আজ যা পেয়েছি তার জন্য কৃতজ্ঞ…">${esc(e.gratitude)}</textarea>
        </div>
        <div style="padding:0 0 11px">
          <div class="mini muted" style="margin-bottom:6px">কালকের সংকল্প</div>
          <textarea class="input" data-field="sankalpa" rows="2" placeholder="কাল একটি ছোট ভালো কাজ করব…">${esc(e.sankalpa)}</textarea>
        </div>
      </div>

      <div class="sect"><h4>৩ · কর্ম, ইনকাম ও শেখা</h4><div class="line"></div></div>
      <div class="card pad" style="padding:4px 14px">
        ${stepper('workMin', 'নিজের কাজ / ইনকামের কাজ', e.workMin, 15, 'মিনিট')}
        ${stepper('income', 'আজকের আয়', e.income, 100, '৳')}
        ${stepper('studyMin', 'নতুন কিছু শেখা', e.studyMin, 10, 'মিনিট', 'স্কিল, পড়াশোনা, কোর্স')}
        ${stepper('familyMin', 'পরিবার ও প্রিয়জনের সাথে', e.familyMin, 15, 'মিনিট')}
        ${stepper('sleepH', 'ঘুম', e.sleepH, 1, 'ঘণ্টা', '৬–৯ ঘণ্টা স্বাস্থ্যকর')}
      </div>

      <div class="sect"><h4>৪ · আত্মপর্যালোচনা</h4><div class="line"></div></div>
      <div class="card pad">
        <div style="margin-bottom:10px"><div class="mini muted" style="margin-bottom:6px">আজ কারও উপকার করেছি?</div>
          <textarea class="input" data-field="helpToday" rows="2" placeholder="ছোট হলেও লিখে রাখুন…">${esc(e.helpToday)}</textarea></div>
        <div style="margin-bottom:10px"><div class="mini muted" style="margin-bottom:6px">আজ কী শিখলাম?</div>
          <textarea class="input" data-field="learned" rows="2" placeholder="শাস্ত্র থেকে বা জীবনের ঘটনা থেকে…">${esc(e.learned)}</textarea></div>
        <div><div class="mini muted" style="margin-bottom:6px">কাল কী আরও ভালো করতে পারি?</div>
          <textarea class="input" data-field="tomorrow" rows="2" placeholder="একটি নির্দিষ্ট পদক্ষেপ…">${esc(e.tomorrow)}</textarea></div>
      </div>

      <div style="display:flex;gap:9px;margin-top:14px">
        <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/track/history">হিস্ট্রি</button>
        <button class="btn gold" style="flex:1.5" data-act="trackDone">${e.done ? 'হিসাব আপডেট রাখুন' : 'আজকের হিসাব সম্পূর্ণ'}</button>
      </div>
      <p class="mini muted" style="text-align:center;margin-top:12px;line-height:1.7">হিসাব প্রতিটি পরিবর্তনে স্বয়ংক্রিয়ভাবে সেভ হয়।<br/>এটি বিচারের খাতা নয় — নিজেকে জানার আয়না।</p>
    </div><div style="height:24px"></div>`;
  }

  function historyScreen() {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(TODAY); d.setDate(d.getDate() - i);
      const k = key(d);
      const e = S.daily[k];
      const auto = k === TODAY_KEY ? todayAuto() : null;
      const sc = e ? scoreOf(e, auto) : { total: 0, sadhana: 0, charitra: 0, karma: 0, jibon: 0, japa: 0, dhyana: 0, path: 0 };
      days.push({ k, d, e, sc });
    }
    const real = days.filter(x => x.e);
    const avg = real.length ? Math.round(real.reduce((s, x) => s + x.sc.total, 0) / real.length) : 0;
    const best = real.slice().sort((a, b) => b.sc.total - a.sc.total)[0];
    const totals = real.reduce((acc, x) => {
      acc.japa += x.sc.japa; acc.dhyana += x.sc.dhyana; acc.daan += x.e.daanTaka;
      acc.income += x.e.income; acc.lies += x.e.lies; acc.puja += x.e.puja; acc.work += x.e.workMin;
      return acc;
    }, { japa: 0, dhyana: 0, daan: 0, income: 0, lies: 0, puja: 0, work: 0 });
    const last7 = days.slice(-7);

    // মাস্টারমাইন্ড ইনসাইট
    const insights = [];
    if (!real.length) insights.push('আজ প্রথম হিসাব শুরু করুন — ৭ দিনেই নিজের ছন্দ বোঝা যাবে।');
    else {
      if (avg >= 70) insights.push('ভারসাম্য চমৎকার — এই ছন্দ ধরে রাখলে এক মাসেই বড় পরিবর্তন।');
      else if (avg >= 45) insights.push('ভালো শুরু। সবচেয়ে দুর্বল স্তম্ভে ৫ মিনিট বাড়ালেই স্কোর লাফ দেবে।');
      else insights.push('স্কোর কম — চিন্তা নেই। শুধু প্রতিদিন হিসাব লিখতে থাকুন, প্রথমে সচেতনতাই লক্ষ্য।');
      const weakest = ['sadhana', 'charitra', 'karma', 'jibon'].map(k => ({ k, v: real.reduce((s, x) => s + x.sc[k], 0) / real.length })).sort((a, b) => a.v - b.v)[0];
      const names = { sadhana: 'আধ্যাত্মিক সময়', charitra: 'চরিত্র (সত্য-পালন)', karma: 'কর্ম ও ইনকাম', jibon: 'জীবনযাত্রা ও পরিবার' };
      insights.push(`সবচেয়ে দুর্বল স্তম্ভ: ${names[weakest.k]} (গড় ${bn(Math.round(weakest.v))}/১০০)।`);
      if (totals.lies > 0) insights.push(`এই সময়ে মোট ${bn(totals.lies)} বার মিথ্যা লিপিবদ্ধ — এটি কমাতে চেষ্টা করাই সবচেয়ে বড় পুণ্য।`);
      else insights.push('মিথ্যা শূন্য — সত্য-পালনে আপনি ঈর্ষণীয়। 🌸');
      if (totals.japa >= 108) insights.push(`মোট ${bn(Math.round(totals.japa / 108))} মালা জপ সম্পন্ন।`);
    }

    return `${appbar('হিস্ট্রি ও বিশ্লেষণ', 'সর্বশেষ ১৪ দিন', '#/track')}
    <div class="pad" style="padding-top:0">
      <div class="card oath pad">
        <div class="kv"><div><div class="mini muted">গড় স্কোর</div>
          <div class="display" style="font-size:24px;color:var(--gold-200);margin-top:3px">${bn(avg)}<span style="font-size:12px;color:var(--ink-3)">/১০০</span></div></div>
          <div style="text-align:right"><div class="mini muted">হিসাব করা দিন</div><b style="font-size:13px">${bn(real.length)}/১৪</b></div></div>
        <div class="chart" style="height:70px;margin-top:14px">
          ${last7.map(x => {
      const h = Math.max(5, Math.round(x.sc.total));
      return `<div class="col"><div class="bwrap"><div class="b ${x.e ? '' : 'empty'}" style="height:${h}%"></div></div>
              <div class="d">${BN_DAYS[x.d.getDay()]}</div></div>`;
    }).join('')}
        </div>
        <div class="kv mini muted" style="margin-top:8px"><span>শেষ ৭ দিন</span>${best ? `<span>সেরা দিন: ${bn(best.d.getDate())} ${BN_MONTH[best.d.getMonth()].slice(0, 4)} · ${bn(best.sc.total)}</span>` : ''}</div>
      </div>

      <div class="sect"><h4>মোট অর্জন (হিসাব করা দিনগুলোতে)</h4><div class="line"></div></div>
      <div class="grid2">
        <div class="stat"><div class="k">জপ</div><div class="v">${bn(totals.japa)} জপ</div></div>
        <div class="stat"><div class="k">ধ্যান</div><div class="v">${bn(totals.dhyana)} মিনিট</div></div>
        <div class="stat"><div class="k">পূজা</div><div class="v">${bn(totals.puja)} মিনিট</div></div>
        <div class="stat"><div class="k">দান</div><div class="v">৳ ${bnN(totals.daan)}</div></div>
        <div class="stat"><div class="k">ইনকাম</div><div class="v">৳ ${bnN(totals.income)}</div></div>
        <div class="stat"><div class="k">কাজ</div><div class="v">${bn(Math.round(totals.work / 60))} ঘণ্টা</div></div>
      </div>

      <div class="sect"><h4>মাস্টারমাইন্ড পর্যালোচনা</h4><div class="line"></div></div>
      <div class="card pad">${insights.map(t => `<div class="li" style="align-items:flex-start"><span style="color:var(--gold-300);margin-top:2px">${ico('target', 'xs')}</span>
        <div class="tiny" style="line-height:1.8;flex:1">${t}</div></div>`).join('')}</div>

      <div class="sect"><h4>দিন-ভিত্তিক হিসাব</h4><div class="line"></div></div>
      ${days.slice().reverse().map(x => `
        <div class="card rowcard stack" style="opacity:${x.e ? 1 : .62}">
          <div class="datebox" style="width:44px;height:48px"><b>${bn(x.d.getDate())}</b><i>${BN_MONTH[x.d.getMonth()].slice(0, 4)}</i></div>
          <div style="flex:1"><div class="kv"><span class="ttl">${BN_DAY[x.d.getDay()]}</span>
            <span class="pill ${x.sc.total >= 60 ? 'ok' : ''}">${bn(x.sc.total)}</span></div>
            <div class="mini muted" style="margin-top:4px">${x.e ? `পূজা ${bn(x.e.puja)} মি · জপ ${bn(x.sc.japa)} · ধ্যান ${bn(x.sc.dhyana)} মি · মিথ্যা ${bn(x.e.lies)}` : 'হিসাব নেই — ট্যাপ করে যোগ করুন'}</div></div>
        </div>`).join('')}
    </div><div style="height:24px"></div>`;
  }

  /* =====================================================================
     ＋ প্যানেল — দৈনন্দিন জীবনের ট্র্যাক, পয়েন্টে হিসাবে
     ===================================================================== */
  function quickSheetHTML() {
    const e = entryFor(TODAY_KEY);
    const auto = todayAuto();
    const sc = scoreOf(e, auto);
    const pillars = [['আধ্যাত্মিক', sc.sadhana], ['চরিত্র', sc.charitra], ['কর্ম', sc.karma], ['জীবন', sc.jibon]];
    const tab = U.sheetTab === 'note' ? 'note' : 'hisab';
    const notes = S.notes.slice().sort((a, b) => b.id - a.id).slice(0, 4);

    const hisabPane = `
      <div class="grid2 sp-pillars">
        ${pillars.map(([n, v]) => `<div class="stat"><div class="k">${n}</div>
          <div class="v">${bn(v)}<span class="tiny muted">/১০০</span></div>
          <div class="bar thin" style="margin-top:5px"><i style="width:${v}%"></i></div></div>`).join('')}
      </div>
      <div class="sp-scroll">
        ${stepper('puja', 'নিত্য পূজা', e.puja, 5, 'মিনিট')}
        ${stepper('japaExtra', 'জপ', e.japaExtra, 1, 'মালা', `অ্যাপে ${bn(auto.japa)} জপ`)}
        ${stepper('dhyanaExtra', 'ধ্যান', e.dhyanaExtra, 5, 'মিনিট', `অ্যাপে ${bn(auto.dhyana)} মিনিট`)}
        ${stepper('pathMin', 'শাস্ত্র পাঠ', e.pathMin, 5, 'মিনিট')}
        ${stepper('daanTaka', 'দান', e.daanTaka, 50, '৳')}
        ${stepper('daanMin', 'সেবায় সময়', e.daanMin, 5, 'মিনিট')}
        ${stepper('workMin', 'কর্ম', e.workMin, 15, 'মিনিট')}
        ${stepper('familyMin', 'পরিবারের সঙ্গে', e.familyMin, 15, 'মিনিট')}
        ${stepper('lies', 'মিথ্যা বলা', e.lies, 1, 'বার')}
      </div>`;

    const notePane = `
      <div class="sp-notes">
        ${notes.length ? notes.map(n => `<button class="sp-nrow" data-act="nav" data-to="#/notes">
            <span class="sp-nd">${bn(new Date(n.id).getDate())} ${BN_MONTH[new Date(n.id).getMonth()].slice(0, 4)}</span>
            <span class="sp-nt">${esc((n.t || '').slice(0, 58))}${(n.t || '').length > 58 ? '…' : ''}</span>
            ${(n.tags || []).length ? `<span class="sp-ntag">${esc(n.tags.slice(0, 2).join(' · '))}</span>` : ''}
          </button>`).join('')
          : `<div class="sres-empty" style="padding:14px 8px"><div class="mini muted">এখনও কোনো নোট নেই — প্রথম নোটটি লিখুন।</div></div>`}
      </div>
      <button class="btn ghost block" style="margin-top:9px" data-act="nav" data-to="#/notes">সব নোট (${bn(S.notes.length)}) ›</button>`;

    return `<div class="setpop-bg" data-act="sheetClose" aria-hidden="true"></div>
    <div class="setpop-card sheetpop" role="dialog" aria-modal="true" aria-label="আজকের হিসাব ও নোট">
      <div class="setpop-head">
        <div>
          <div class="mini muted sp-eyebrow">আজকের হিসাব ও নোট</div>
          <div class="display sp-score">${bn(sc.total)}<span class="tiny muted" style="font-family:var(--f-body)"> /১০০</span></div>
        </div>
        <button class="iconbtn" data-act="sheetClose" aria-label="বন্ধ করুন">${ico('close')}</button>
      </div>

      <div class="segment sp-seg">
        <button class="${tab === 'hisab' ? 'on' : ''}" data-act="sheetTab" data-t="hisab">হিসাব</button>
        <button class="${tab === 'note' ? 'on' : ''}" data-act="sheetTab" data-t="note">নোট · ${bn(S.notes.length)}</button>
      </div>

      ${tab === 'note' ? notePane : hisabPane}

      <div class="sp-acts">
        <button class="btn gold" style="flex:1.2" data-act="noteNew">${ico('pen', 'sm')} নোট লিখুন</button>
        <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/track">পূর্ণ হিসাব ›</button>
      </div>
      <p class="tiny muted sp-foot">প্রতিটি কাজ পয়েন্টে গোনা হয় · আধ্যাত্মিক ৪০% · চরিত্র ২৫% · কর্ম ২০% · জীবন ১৫%</p>
    </div>`;
  }
  function openSheet() {
    const host = document.getElementById('sheetHost');
    if (!host) return;
    const prev = host.querySelector('.sp-scroll');
    const keep = prev ? prev.scrollTop : 0;
    host.innerHTML = quickSheetHTML();
    host.classList.add('on');
    const scl = host.querySelector('.sp-scroll');
    if (scl && keep) scl.scrollTop = keep;
    U.sheet = true;
  }
  function refreshSheet() { if (U.sheet) openSheet(); }
  function closeSheet() {
    const host = document.getElementById('sheetHost');
    if (host) { host.classList.remove('on'); host.innerHTML = ''; }
    U.sheet = false;
  }

  /* =====================================================================
     ফিড — পোস্ট · রিলস · চ্যাট
     ===================================================================== */
  const feedLike = id => !!(S.socialLikes && S.socialLikes[id]);
  /* ------------------------------- রিলস প্লেয়ার ------------------------------- */
  function reelScreen(id) {
    const F = DB.feed || { reels: [] };
    const list = F.reels || [];
    if (!list.length) return feedScreen();
    let i = list.findIndex(r => r.id === id);
    if (i < 0) i = U.reel ? U.reel.i : 0;
    const r = list[i];
    const on = feedLike(r.id);
    return `${appbar(r.title, r.sub + ' · ' + r.views, '#/feed', false, true)}
    <div class="pad" style="padding-top:0">
      <div class="reelplayer" style="--tint:${r.tint}">
        <div class="rp-bar"><i style="animation-duration:${U.reelPaused ? '0s' : '32s'};animation-play-state:${U.reelPaused ? 'paused' : 'running'}"></i></div>
        <div class="rp-head"><span class="pill">${esc(r.ref || 'রিলস')}</span><span class="tiny">${bn(i + 1)}/${bn(list.length)}</span></div>
        <div class="rp-body">
          ${r.lines.map((l, n) => `<div class="rp-line" style="animation-delay:${n * 35}ms">${esc(l)}</div>`).join('')}
        </div>
        <div class="rp-acts">
          <button class="pact ${on ? 'on' : ''}" data-act="feedLike" data-id="${r.id}">${vico('heart', 'sm')}${on ? 'ভালো লেগেছে' : 'ভালো লাগল'}</button>
          <button class="pact" data-act="reelSpeak" data-id="${r.id}">${vico('play', 'sm')}শুনুন</button>
          <button class="pact" data-act="reelPause">${U.reelPaused ? 'চালু করুন' : 'বিরতি'}</button>
        </div>
      </div>
      <div style="display:flex;gap:9px;margin-top:12px">
        <button class="btn ghost" style="flex:1" data-act="reelStep" data-d="-1" ${i === 0 ? 'disabled' : ''}>আগের</button>
        <button class="btn gold" style="flex:1.2" data-act="reelStep" data-d="1">${i === list.length - 1 ? 'প্রথম রিল' : 'পরের রিল'}</button>
      </div>
      <div class="sect"><h4>আরও রিলস</h4><div class="line"></div></div>
      <div class="reelgrid">${list.filter((_, n) => n !== i).map(x => `
        <button class="reel" data-act="reelPlay" data-id="${x.id}" style="--tint:${x.tint}">
          <span class="rl-ico">${vico('play', 'sm')}</span><span class="rl-len">${esc(x.len)}</span>
          <span class="rl-txt"><b>${esc(x.title)}</b><i>${esc(x.sub)}</i></span></button>`).join('')}</div>
    </div><div style="height:20px"></div>`;
  }

  function feedScreen(chatId) {
    const F = DB.feed || { posts: [], reels: [], chats: [] };
    if (chatId) return chatScreen(chatId);
    const t = U.feedTab;
    const tabs = [['posts', 'পোস্ট'], ['reels', 'রিলস'], ['chats', 'চ্যাট']];
    const unread = F.chats.reduce((a, c) => a + (c.unread || 0), 0);

    let body = '';
    if (t === 'posts') {
      body = F.posts.map(p => {
        const on = feedLike(p.id);
        return `<div class="card pad postcard">
          <div style="display:flex;gap:9px;align-items:center">
            <span class="avatar">${esc(p.name.slice(0, 1))}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:12.4px;font-weight:600">${esc(p.name)}</div>
              <div class="tiny muted">${esc(p.role)} · ${esc(p.when)}</div>
            </div>
            <span class="tiny" style="color:var(--gold-300)">${esc(p.tag || '')}</span>
          </div>
          <p class="posttext">${esc(p.text)}</p>
          <div class="postacts">
            <button class="pact ${on ? 'on' : ''}" data-act="feedLike" data-id="${p.id}">${vico('heart', 'sm')}${bn(p.liked + (on ? 1 : 0))}</button>
            <button class="pact" data-act="toast" data-msg="মন্তব্য শীঘ্রই আসছে">${vico('chat', 'sm')}${bn(p.cmt)}</button>
            <button class="pact" data-act="toast" data-msg="লিংক কপি হয়েছে">${vico('send', 'sm')}শেয়ার</button>
          </div>
        </div>`;
      }).join('');
    } else if (t === 'reels') {
      body = `<div class="reelgrid">${F.reels.map(r => `
        <button class="reel" data-act="reelPlay" data-id="${r.id}" style="--tint:${r.tint}">
          <span class="rl-ico">${vico('play', 'sm')}</span>
          <span class="rl-len">${esc(r.len)}</span>
          <span class="rl-txt"><b>${esc(r.title)}</b><i>${esc(r.sub)} · ${esc(r.views)}</i></span>
        </button>`).join('')}</div>`;
    } else {
      body = F.chats.map(c => `<button class="card rowcard chatrow" data-act="chatOpen" data-id="${c.id}">
          <span class="avatar">${esc(c.name.slice(0, 1))}</span>
          <div style="flex:1;min-width:0;text-align:left">
            <div class="kv"><span style="font-size:12.4px;font-weight:600">${esc(c.name)}</span>
              <span class="tiny muted">${esc(c.when)}</span></div>
            <div class="tiny muted" style="margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.last)}</div>
          </div>
          ${c.unread ? `<span class="pill ok">${bn(c.unread)}</span>` : ''}
        </button>`).join('');
    }

    return `${appbar('সমাজ · ফিড', 'পোস্ট · রিলস · চ্যাট — সনাতন পরিবারের সঙ্গে জুড়ে থাকুন', '#/home', true, true)}
    <div class="pad" style="padding-top:0">
      <div class="segment">${tabs.map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="feedSeg" data-t="${k}">${ico(k, 'seg')}<span>${l}${k === 'chats' && unread ? ' · ' + bn(unread) : ''}</span></button>`).join('')}</div>
      <div class="mt">${body}</div>
      ${t === 'posts' ? `<button class="btn ghost block mt" data-act="toast" data-msg="নতুন পোস্ট লেখার সুবিধা শীঘ্রই আসছে">${ico('pen', 'sm')} নিজের পোস্ট লিখুন</button>` : ''}
      <p class="tiny muted" style="text-align:center;margin-top:12px;line-height:1.7">এটি ডেমো ফিড — আসল সমাজ-মঞ্চে পোস্ট, রিলস ও চ্যাট যোগ হবে যাচাই করা সদস্যদের জন্য।</p>
    </div><div style="height:20px"></div>`;
  }

  function chatScreen(id) {
    const c = (DB.feed.chats || []).find(x => x.id === id);
    if (!c) return feedScreen();
    const msgs = (S.chatMsgs || {})[id] || [];
    const all = c.msgs.concat(msgs);
    return `${appbar(c.name, 'চ্যাট · সনাতন বিদ্যাপীঠ', '#/feed', false, true)}
    <div class="pad" style="padding-top:0">
      <div class="chatbox">
        ${all.map(m => `<div class="bub ${m.me ? 'me' : ''}">
          ${!m.me && m.who ? `<div class="bubwho">${esc(m.who)}</div>` : ''}${esc(m.t)}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <input class="input" id="chatDraft" placeholder="বার্তা লিখুন…" value="${esc(U.chatDraft)}" style="flex:1"/>
        <button class="btn gold" data-act="chatSend" data-id="${c.id}" style="width:56px;padding:0">${vico('send', 'sm')}</button>
      </div>
      <button class="btn ghost block mt" data-act="nav" data-to="#/feed">‹ সব চ্যাট</button>
    </div><div style="height:20px"></div>`;
  }

  /* =====================================================================
     নোট — পড়ার পাশাপাশি লিখে রাখা, ট্যাগ ও তারিখ ধরে সাজানো
     ===================================================================== */
  const NOTE_TAGS = ['শ্লোক', 'প্রশ্ন', 'সাধনা', 'প্রার্থনা', 'পূজা', 'অনুপ্রেরণা', 'কথা'];
  const noteCtxLabel = ctx => {
    if (!ctx) return '';
    const b = DB.books.find(x => x.id === ctx.book);
    let l = b ? b.title : 'পাঠ';
    if (ctx.ch) l += ' · অধ্যায় ' + bn(ctx.ch);
    if (ctx.v) l += ' · শ্লোক ' + bn(ctx.v);
    return l;
  };
  const noteDayLabel = d => {
    const t = new Date();
    if (d === key(t)) return 'আজ';
    const y = new Date(t); y.setDate(y.getDate() - 1);
    if (d === key(y)) return 'গতকাল';
    const dd = new Date(d + 'T00:00:00');
    if (isNaN(dd.getTime())) return d;
    return `${bn(dd.getDate())} ${BN_MONTH[dd.getMonth()]} ${bn(dd.getFullYear())}`;
  };
  const noteTagList = () => {
    const set = [];
    S.notes.forEach(n => (n.tags || []).forEach(t => { if (!set.includes(t)) set.push(t); }));
    return set;
  };

  function notesScreen() {
    const q = U.noteQ.trim().toLowerCase();
    const tag = U.noteTag;
    let rows = S.notes.slice().sort((a, b) => b.id - a.id);
    if (tag !== 'সব') rows = rows.filter(n => (n.tags || []).includes(tag));
    if (q) rows = rows.filter(n => (n.t + ' ' + (n.tags || []).join(' ') + ' ' + noteCtxLabel(n.ctx)).toLowerCase().includes(q));
    const groups = [];
    rows.forEach(n => {
      const g = groups.find(x => x.d === n.d);
      if (g) g.items.push(n); else groups.push({ d: n.d, items: [n] });
    });
    const allTags = noteTagList();
    const count = t => S.notes.filter(n => (n.tags || []).includes(t)).length;

    return `${appbar('আমার নোট', `${bn(S.notes.length)}টি নোট · ${bn(allTags.length)}টি ট্যাগ`, '#/home', true, true)}
    <div class="pad" style="padding-top:0">
      <div class="search">${ico('search', 'sm')}<input id="noteSearch" placeholder="নোট, ট্যাগ বা শ্লোক খুঁজুন" value="${esc(U.noteQ)}"/></div>
      <div class="cats" style="margin-top:10px">${['সব'].concat(allTags).map(t => `<button class="chip ${tag === t ? 'on' : ''}" data-act="noteFilter" data-t="${esc(t)}">${t === 'সব' ? 'সব' : '#' + esc(t)}${t === 'সব' ? ' · ' + bn(S.notes.length) : ' · ' + bn(count(t))}</button>`).join('')}</div>

      ${S.notes.length === 0
        ? `<div class="card pad mt"><div class="mini muted" style="line-height:1.9">এখনো কোনো নোট নেই। বই পড়তে পড়তে যা মনে আসে, নিচের <b>＋</b> চিহ্ন দিয়ে লিখে রাখুন — শ্লোকের পাশ থেকেই।</div></div>`
        : (rows.length === 0
          ? `<div class="card pad mt"><div class="mini muted">এই ছাঁকনিতে কোনো নোট নেই — অন্য ট্যাগ দেখুন।</div></div>`
          : groups.map(g => `
        <div class="sect"><h4>${noteDayLabel(g.d)}</h4><div class="line"></div><span class="mini muted">${bn(g.items.length)}</span></div>
        ${g.items.map(n => `<div class="card pad">
          <div class="kv"><div class="tiny" style="color:var(--gold-300)">${esc(noteCtxLabel(n.ctx) || 'সাধারণ নোট')}</div>
            <div class="tiny muted">${(n.tags || []).map(t => '#' + esc(t)).join(' ')}</div></div>
          <p style="margin:8px 0 0;font-size:12.8px;line-height:1.85;white-space:pre-wrap">${esc(n.t)}</p>
          <div class="kv" style="margin-top:10px">
            <div class="tiny" style="display:flex;gap:10px">
              ${n.ctx && n.ctx.book ? `<button class="act" data-act="noteGo" data-b="${esc(n.ctx.book)}" data-i="${n.ctx.idx}">পাঠে ফিরুন ›</button>` : ''}
            </div>
            <div class="tiny" style="display:flex;gap:10px">
              <button class="act" data-act="noteEdit" data-id="${n.id}">সম্পাদনা</button>
              <button class="act" data-act="noteDel" data-id="${n.id}" style="color:var(--danger)">মুছুন</button>
            </div>
          </div>
        </div>`).join('')}`).join(''))}

      <button class="btn gold block mt" data-act="noteNew">${ico('plus', 'sm')} নতুন নোট</button>
      <p class="tiny muted" style="margin-top:12px;line-height:1.8;text-align:center">সব নোট আপনার এই ব্রাউজারেই থাকে — কারও সঙ্গে ভাগ হয় না।</p>
    </div><div style="height:20px"></div>`;
  }

  function noteComposerScreen() {
    const n = U.note;
    const tags = n.tags || [];
    return `${appbar(n.edit ? 'নোট সম্পাদনা' : 'নতুন নোট', 'পাঠের পাশে যা মনে আসে, লিখে রাখুন', '#/notes', false, true)}
    <div class="pad" style="padding-top:0">
      ${n.ctx ? `<div class="card pad" style="padding:10px 13px;margin-bottom:10px"><div class="kv">
          <div class="mini" style="color:var(--gold-300)">${esc(noteCtxLabel(n.ctx))}</div>
          <button class="act" data-act="noteCtxClear">লাগবে না ✕</button></div></div>` : ''}
      <textarea class="input" id="noteText" rows="7" placeholder="যেমন — এই শ্লোকটি পড়ে মনে হলো, রাগের সময় মনে রাখতে হবে…">${esc(n.text)}</textarea>
      <div class="mini muted" style="margin-top:14px">ট্যাগ দিন (একাধিক)</div>
      <div class="cats" style="margin-top:7px">${NOTE_TAGS.map(t => `<button class="chip ${tags.includes(t) ? 'on' : ''}" data-act="noteTag" data-t="${esc(t)}">#${esc(t)}</button>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:11px">
        <input class="input" id="noteTagNew" placeholder="নিজের ট্যাগ — যেমন: গীতা-১৮" style="flex:1"/>
        <button class="btn ghost sm" data-act="noteTagAdd">যোগ</button>
      </div>
      ${tags.length ? `<div class="tiny" style="margin-top:10px;color:var(--gold-300)">${tags.map(t => '#' + esc(t)).join(' ')}</div>` : ''}
      <button class="btn gold block mt" data-act="noteSave">${n.edit ? 'পরিবর্তন রাখুন' : 'নোট রাখুন'}</button>
      ${n.edit ? `<button class="btn ghost block mt" data-act="noteEditCancel">বাতিল</button>` : ''}
    </div><div style="height:20px"></div>`;
  }

  /* =====================================================================
     ROUTER
     ===================================================================== */
  const TABS = [
    { id: 'home', icon: 'home', label: 'মন্দির', target: '#/home' },
    { id: 'library', icon: 'book', label: 'লাইব্রেরি', target: '#/library' },
    { id: 'feed', icon: 'chat', label: 'ফিড', target: '#/feed' },
    { id: 'exam', icon: 'exam', label: 'পরীক্ষা', target: '#/exam' },
    { id: 'me', icon: 'user', label: 'আমি', target: '#/me' }
  ];

  /* ট্যাববার: আগের হিন্দু-ধর্মীয় AI আইকনই — শুধু রঙ নেভির কালারে (ক্রিম / মেরুন) */
  const tabIco = (n, on) => `<img class="tabai ${on ? 'on' : 'off'}" src="icons/ai/tab/${AI_ICON[n]}-${on ? 'on' : 'off'}.png" alt="" aria-hidden="true"/>`;
  function renderTabbar(active) {
    document.getElementById('tabbar').innerHTML = TABS.map(t => `
      <button class="tab ${active === t.id ? 'on' : ''}" data-act="nav" data-to="${t.target}" aria-label="${t.label}" ${active === t.id ? 'aria-current="page"' : ''}>
        <span class="tbox"><img class="tabai" src="icons/reference/nav-${t.id}${S.theme === 'dark' ? '-dark' : ''}.png?v=clean3" alt="" aria-hidden="true"/><span class="tlabel">${t.label}</span></span></button>`).join('');
  }

  function route() {
    const raw = (location.hash || '#/home').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    const name = parts[0] || 'home';
    const a = parts[1], b = parts[2];
    let html = '', tab = 'home', root = false;

    switch (name) {
      case 'home': html = homeScreen(); tab = 'home'; root = true; break;
      case 'library': html = libraryScreen(); tab = 'library'; root = true; break;
      case 'book': html = bookScreen(a); tab = 'library'; break;
      case 'gita': html = a ? gitaChapterScreen(a) : gitaScreen(); tab = 'library'; root = !a; break;
      case 'reader': html = readerScreen(a, b); tab = 'library'; break;
      case 'courses': html = coursesScreen(); tab = 'library'; break;
      case 'course': html = courseScreen(a); tab = 'library'; break;
      case 'exam': html = examScreen(); tab = 'exam'; root = true; break;
      case 'quiz': html = quizScreen(); tab = 'exam'; break;
      case 'result': html = resultScreen(); tab = 'exam'; break;
      case 'puja':
        if (a === 'deva') html = devaPujaScreen(b);
        else html = a ? pujaGuideScreen(a) : pujaScreen();
        tab = 'home'; break;
      case 'panjika': html = a ? panjikaSub(a) : panjikaScreen(); tab = 'home'; break;
      case 'feed':
        if (a === 'reel') { html = reelScreen(b); tab = 'feed'; }
        else { html = feedScreen(a === 'chat' ? b : null); tab = 'feed'; root = !a; }
        break;
      case 'reels': html = a ? reelVideoScreen(a) : reelsScreen(); tab = 'home'; root = !a; break;
      case 'reelsch': html = chanListScreen(); tab = 'home'; break;
      case 'reelssaved': html = savedReelsScreen(); tab = 'home'; break;
      case 'notes': html = notesScreen(); tab = 'home'; break;
      case 'note': html = noteComposerScreen(); tab = 'home'; break;
      case 'settings': html = settingsScreen(); tab = 'me'; break;
      case 'seva': html = sevaScreen(); tab = 'seva'; root = true; break;
      case 'market': html = marketScreen(); tab = 'seva'; break;
      case 'me': html = meScreen(); tab = 'me'; root = true; break;
      case 'manage': html = manageScreen(); tab = 'me'; break;
      case 'track': html = (a === 'history') ? historyScreen() : trackScreen(); tab = 'me'; break;
      case 'sadhana':
        if (a === 'seq') { html = seqScreen(); tab = 'home'; }
        else { if (a) U.sadhanaTab = a; html = sadhanaScreen(); tab = 'home'; }
        break;
      default: html = homeScreen(); tab = 'home'; root = true;
    }

    clearInterval(U.quizTimer); U.quizTimer = null;
    clearInterval(U.medTimer); U.medTimer = null;
    clearInterval(U.seqTimer); U.seqTimer = null;
    const view = document.getElementById('view');
    const _keep = U.keepTop === location.hash ? view.scrollTop : 0;
    U.keepTop = null;
    view.innerHTML = html;
    view.scrollTop = _keep;
    try { hydrateArt(); } catch (e) {}
    document.querySelector('.shell').classList.toggle('sub', !root);
    renderTabbar(tab);
    if (name === 'reels' && !a) attachReelScroll();
    if (name === 'reels' && a) { attachFeedScroll(); attachFeedPlay(); }
    if (name === 'quiz' && U.quiz) startQuizTimer();
    if (name === 'sadhana' && a !== 'seq' && U.sadhanaTab === 'dhyana' && U.med.running) medStart();
    if (name === 'sadhana' && a === 'seq' && U.seq.running) seqStart();
  }

  /* =====================================================================
     QUIZ ENGINE
     ===================================================================== */
  function startQuiz() {
    U.quiz = { i: 0, answers: {}, left: DB.quizzes.weekly.minutes * 60 };
    U.result = null;
    location.hash = '#/quiz';
    render();
  }
  function startQuizTimer() {
    clearInterval(U.quizTimer);
    U.quizTimer = setInterval(() => {
      if (!U.quiz) return clearInterval(U.quizTimer);
      U.quiz.left--;
      const el = document.getElementById('quizTimer');
      if (el) el.textContent = `${bn(String(Math.floor(U.quiz.left / 60)).padStart(2, '0'))}:${bn(String(U.quiz.left % 60).padStart(2, '0'))}`;
      if (U.quiz.left <= 0) { clearInterval(U.quizTimer); submitQuiz(); }
    }, 1000);
  }
  function submitQuiz() {
    const q = U.quiz; if (!q) return;
    const Qs = DB.quizzes.weekly.questions;
    let correct = 0;
    Qs.forEach((qq, i) => { if (q.answers[i] === qq.ans) correct++; });
    const score = Math.round(correct / Qs.length * 100);
    const when = `${bn(new Date().getDate())} ${BN_MONTH[new Date().getMonth()].slice(0, 4)}`;
    S.attempts.push({ title: DB.quizzes.weekly.title, score, correct, total: Qs.length, when });
    save('attempts');
    bumpActivity(12);
    U.result = { score, correct, answers: { ...q.answers } };
    U.quiz = null;
    clearInterval(U.quizTimer);
    chime(score >= 50 ? 'complete' : 'tick');
    location.hash = '#/result';
    render();
    setTimeout(() => burst(window.innerWidth / 2, 220, score >= 50 ? 22 : 10), 200);
  }

  /* =====================================================================
     ACTIONS
     ===================================================================== */
  function bumpActivity(min) {
    S.activity[TODAY_KEY] = (S.activity[TODAY_KEY] || 0) + min;
    save('activity');
  }
  function setTheme(v) {
    S.theme = v; save('theme');
    document.documentElement.dataset.theme = v;
    const bv = document.querySelector('.brandav');
    if (bv) bv.src = v === 'light' ? bv.dataset.light : bv.dataset.dark;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', v === 'light' ? '#fdf7e4' : '#180304');
  }
  function applyBg() {
    document.documentElement.dataset.bg = S.bg ? 'on' : 'off';
  }
  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) return toast('এই ব্রাউজারে উচ্চারণ সমর্থিত নয়');
      const u = new SpeechSynthesisUtterance(text.replace(/…/g, ''));
      u.lang = 'bn-IN'; u.rate = .85;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
      toast('উচ্চারণ চালু হচ্ছে…');
    } catch (e) { toast('উচ্চারণ সম্ভব হয়নি'); }
  }

  /* ---------------- উৎসবের রিমাইন্ডার ---------------- */
  function askNotify() {
    if (!('Notification' in window)) return toast('এই ব্রাউজারে নোটিফিকেশন নেই — তবু অ্যাপে রিমাইন্ডার দেখাবে');
    if (Notification.permission === 'granted') { S.notifyOn = !S.notifyOn; save('notifyOn'); toast(S.notifyOn ? 'রিমাইন্ডার চালু' : 'রিমাইন্ডার বন্ধ'); render(); return; }
    Notification.requestPermission().then(p => {
      S.notifyOn = p === 'granted'; save('notifyOn');
      toast(S.notifyOn ? 'রিমাইন্ডার চালু — উৎসবের আগের দিন জানানো হবে' : 'অনুমতি দেওয়া হয়নি — অ্যাপের ভেতরে রিমাইন্ডার দেখাবে');
      render();
    }).catch(() => { S.notifyOn = true; save('notifyOn'); render(); });
  }
  function nextFestInfo() {
    const keys = Object.keys(P.festivals).filter(k => k >= TODAY_KEY).sort();
    if (!keys.length) return null;
    const k = keys[0], d = new Date(k + 'T00:00:00');
    return { k, name: P.festivals[k], days: Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS) };
  }
  function maybeNotify() {
    if (!S.notifyOn) return;
    const f = nextFestInfo();
    if (!f || f.days > 1) return;
    if (S.notifiedKey === f.k) return;
    S.notifiedKey = f.k; save('notifiedKey');
    const body = f.days === 0 ? `আজ ${f.name}` : `কাল ${f.name}`;
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('সনাতন বিদ্যাপীঠ · পঞ্জিকা', { body, icon: 'icons/icon-light-192.png' });
      } else toast(body);
    } catch (e) { toast(body); }
  }

  const ACTIONS = {
    nav: el => { closeSheet(); location.hash = el.dataset.to; },
    feedSeg: el => { U.feedTab = el.dataset.t; U.chatId = null; render(); },
    feedLike: el => {
      S.socialLikes = S.socialLikes || {};
      const id = el.dataset.id;
      S.socialLikes[id] = !S.socialLikes[id];
      save('socialLikes'); chime('soft'); render();
    },
    reelPlay: el => { U.reelPaused = false; location.hash = '#/feed/reel/' + el.dataset.id; render(); },
    reelPause: el => { U.reelPaused = !U.reelPaused; render(); },
    reelStep: el => {
      const list = (DB.feed && DB.feed.reels) || [];
      const cur = (location.hash.split('/')[3] || '');
      let i = list.findIndex(r => r.id === cur);
      if (i < 0) i = 0;
      const n = (i + (+el.dataset.d) + list.length) % list.length;
      U.reelPaused = false;
      location.hash = '#/feed/reel/' + list[n].id; render();
    },
    reelSpeak: el => {
      const r = ((DB.feed && DB.feed.reels) || []).find(x => x.id === el.dataset.id);
      if (r) speak(r.title + '। ' + r.lines.join(' '));
    },
    speakStop: () => { try { speechSynthesis.cancel(); toast('উচ্চারণ থামানো হলো'); } catch (e) {} },
    notifyAsk: () => askNotify(),
    markFestSeen: () => { S.festSeen = TODAY_KEY; save('festSeen'); render(); },
    chatOpen: el => { U.chatId = el.dataset.id; location.hash = '#/feed/chat/' + el.dataset.id; render(); },
    chatSend: el => {
      const inp = document.getElementById('chatDraft');
      const v = (inp ? inp.value : '').trim();
      if (!v) { toast('বার্তা লিখুন'); return; }
      const id = el.dataset.id;
      S.chatMsgs = S.chatMsgs || {};
      (S.chatMsgs[id] = S.chatMsgs[id] || []).push({ me: true, t: v });
      save('chatMsgs'); U.chatDraft = ''; render(); toast('বার্তা পাঠানো হলো');
    },
    bpOpen: el => { location.hash = '#/reels/' + el.dataset.id; },
    reelsMore: () => { U.reelsN = (U.reelsN || 30) + 30; render(); },
    reelSound: el => {
      S.reelMute = !S.reelMute; save('reelMute');
      el.textContent = reelSoundOn() ? '🔊 শব্দ চালু' : '🔇 নীরব';
      const sec = document.querySelector('#rfeed .rsec[data-playing="1"]');
      if (sec) { sec.dataset.playing = '0'; activateFeedSection(sec); }
      toast(reelSoundOn() ? 'শব্দ চালু হয়েছে 🔊' : 'নীরব মোড 🔇');
    },
    reelPlay2: el => {
      const id = el.dataset.id;
      const box = el.closest('.rvp');
      if (!box) return;
      const sec0 = el.closest('.rsec');
      S.reelMute = false; save('reelMute');
      if (sec0) { const b = el.closest('.rsec'); b.dataset.playing = '0'; activateFeedSection(b); }
      else {
        box.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1"
          title="রিলস" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      }
    },
    reelSave: el => {
      const id = el.dataset.id;
      const all = bpList();
      const r = all.find(x => x[0] === id) || [];
      S.savedReels = S.savedReels || {};
      const ch = chOf(r);
      S.savedReels[id] = { t: r[1] || 'রিলস', ch: ch ? ch[0].trim() : 'রিলস', ts: Date.now() };
      save('savedReels');
      el.classList.add('on'); el.textContent = '✓ সেভ হয়েছে';
      toast('রিলস সেভ হয়েছে — “সেভ করা” তালিকায় পাবেন');
    },
    reelUnsave: el => {
      const id = el.dataset.id;
      if (S.savedReels) { delete S.savedReels[id]; save('savedReels'); }
      toast('তালিকা থেকে মুছে ফেলা হলো'); render();
    },
    reelThumb: el => {
      const id = el.dataset.id;
      const a = document.createElement('a');
      a.href = 'https://i.ytimg.com/vi/' + id + '/oar2.jpg';
      a.download = 'reel-' + id + '.jpg';
      a.target = '_blank'; a.rel = 'noopener';
      fetch(a.href, { mode: 'cors' }).then(res => {
        if (!res.ok) throw new Error('x');
        return res.blob();
      }).then(blob => {
        const url = URL.createObjectURL(blob);
        a.href = url; a.target = '';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        toast('ছবি ডাউনলোড হচ্ছে ⤓');
      }).catch(() => {
        document.body.appendChild(a); a.click(); a.remove();
        toast('ছবিটি নতুন ট্যাবে খুলছে — চেপে ধরে সেভ করুন');
      });
    },
    reelCopy: el => {
      const id = el.dataset.id, url = BP_YT(id);
      const done = () => toast('লিংক কপি হয়েছে');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => toast(url));
        else { toast(url); }
      } catch (e) { toast(url); }
    },
    reelsShuffle: () => { U.reelSeed = Math.floor(Math.random() * 1e9) + 1; _bpOrder = null; _bpLen = 0; U.reelsN = 30; render(); },
    reelCh: el => {
      U.reelCh = +el.dataset.i; U.reelsN = 30;
      if (location.hash !== '#/reels') location.hash = '#/reels'; else render();
    },
    reelCat: el => {
      U.reelCat = el.dataset.c; U.reelCh = -1; U.reelsN = 30;
      if (location.hash !== '#/reels') location.hash = '#/reels'; else render();
    },
    sheetOpen: () => openSheet(),
    /* ---- পূজা দর্পণ ---- */
    devaOffer: el => offerStep(el.dataset.id, el.dataset.k),
    pujaExit: () => {
      if (location.hash !== '#/puja') location.hash = '#/puja';
      render();
      toast('পূজা তালিকায় ফেরা হলো');
    },
    bellRing: () => {
      /* বাটন নিজে নড়ে না — মন্দিরের ঝোলানো ঘণ্টা দুটোই দোলে */
      bellTone(1);
      document.querySelectorAll('.m-bell').forEach(b => {
        b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring');
      });
    },
    nad: el => toggleNad(el, el.dataset.k),
    nadStop: () => nadStopAll(),
    ytPlay: el => openYt(el.dataset.id || el.closest('[data-aarti]').dataset.aarti),
    ytClose: () => { closeYt(); toast('ইউটিউব প্লেয়ার বন্ধ'); },
    pujaAarti: el => openAarti(el.dataset.id),
    aartiPlay: el => aartiToggle(el.dataset.id || el.closest('[data-aarti]').dataset.aarti),
    aartiClose: () => { closeAarti(); toast('আরতি শেষ — জয় মা'); },
    devaReset: el => {
      S.deva[devaKey(el.dataset.id)] = []; save('deva');
      U.keepTop = location.hash;
      toast('পূজা আবার শুরু হলো');
      render();
    },
    sheetTab: el => { U.sheetTab = el.dataset.t === 'note' ? 'note' : 'hisab'; openSheet(); },
    sheetClose: () => closeSheet(),
    /* ---- নোট ---- */
    noteNew: () => {
      closeSheet();
      U.note = { text: '', tags: [], ctx: null, edit: null };
      location.hash = '#/note'; render();
    },
    noteFromReader: el => {
      const b = DB.books.find(x => x.id === 'gita') || DB.books[0];
      const i = Math.max(0, Math.min(+el.dataset.i || 0, b.texts.length - 1));
      const t = b.texts[i];
      U.note = { text: '', tags: [], ctx: { book: b.id, idx: i, ch: t.ch, v: t.v }, edit: null };
      location.hash = '#/note'; render();
    },
    openNotes: () => { U.noteTag = 'সব'; location.hash = '#/notes'; render(); },
    noteFilter: el => { U.noteTag = el.dataset.t; render(); },
    noteTag: el => {
      const t = el.dataset.t, arr = U.note.tags || (U.note.tags = []);
      const i = arr.indexOf(t);
      if (i >= 0) arr.splice(i, 1); else arr.push(t);
      render();
    },
    noteTagAdd: () => {
      const inp = document.getElementById('noteTagNew');
      const v = (inp ? inp.value : '').trim().replace(/^#/, '');
      if (!v) { toast('ট্যাগের নাম লিখুন'); return; }
      const arr = U.note.tags || (U.note.tags = []);
      if (!arr.includes(v)) arr.push(v);
      render();
    },
    noteCtxClear: () => { U.note.ctx = null; render(); },
    noteSave: () => {
      const ta = document.getElementById('noteText');
      const text = (ta ? ta.value : U.note.text || '').trim();
      if (!text) { toast('আগে কিছু লিখুন'); if (ta) ta.focus(); return; }
      const d = key(new Date());
      if (U.note.edit) {
        const i = S.notes.findIndex(n => n.id === U.note.edit);
        if (i >= 0) S.notes[i] = { ...S.notes[i], t: text, tags: U.note.tags.slice(), ctx: U.note.ctx, d };
        toast('নোট বদলানো হলো');
      } else {
        S.notes.unshift({ id: Date.now(), t: text, tags: U.note.tags.slice(), ctx: U.note.ctx || null, d });
        toast('নোট রাখা হলো ✍');
      }
      save('notes'); chime('tick');
      U.note = { text: '', tags: [], ctx: null, edit: null };
      location.hash = '#/notes'; render();
    },
    noteEdit: el => {
      const n = S.notes.find(x => String(x.id) === String(el.dataset.id));
      if (!n) return;
      U.note = { text: n.t, tags: (n.tags || []).slice(), ctx: n.ctx || null, edit: n.id };
      location.hash = '#/note'; render();
    },
    noteEditCancel: () => {
      U.note = { text: '', tags: [], ctx: null, edit: null };
      location.hash = '#/notes'; render();
    },
    noteDel: el => {
      if (!window.confirm('এই নোটটি মুছে ফেলবেন?')) return;
      S.notes = S.notes.filter(x => String(x.id) !== String(el.dataset.id));
      save('notes'); toast('নোট মুছে ফেলা হলো'); render();
    },
    noteGo: el => { location.hash = '#/reader/' + el.dataset.b + '/' + el.dataset.i; },
    toast: el => toast(el.dataset.msg || ''),
    dailyTasksOpen: () => openDailyTasks(),
    dailyTasksClose: () => closeDailyTasks(),
    dailyTaskToggle: el => { const i = el.dataset.i; ACTIONS.ritual(el); const row = document.querySelector(`#dailyTaskPop [data-i="${i}"]`); if (row) row.focus(); },
    dailyTaskGo: () => { closeDailyTasks(); location.hash = '#/sadhana'; },
    ritual: el => {
      const i = +el.dataset.i;
      if (!Number.isInteger(i) || i < 0 || i > 2) return;
      const arr = (S.rituals[TODAY_KEY] || [false, false, false]).slice();
      // Existing checked tasks predate reward bookkeeping; regard them as already rewarded.
      const rewards = S.ritualRewards[TODAY_KEY] || { tasks: arr.slice(), complete: arr.every(Boolean) };
      arr[i] = !arr[i];
      S.rituals[TODAY_KEY] = arr; save('rituals');
      if (arr[i] && !rewards.tasks[i]) { rewards.tasks[i] = true; bumpActivity(8); }
      if (arr[i]) chime('tick');
      if (arr.every(Boolean) && !rewards.complete) {
        rewards.complete = true; chime('complete'); bumpActivity(15);
        setTimeout(() => { burst(window.innerWidth / 2, 200, 22); toast('আজকের সাধনা সম্পূর্ণ 🌸'); }, 150);
      }
      S.ritualRewards[TODAY_KEY] = rewards; save('ritualRewards');
      render();
    },
    seg: el => { U.libSeg = el.dataset.s; render(); },
    audioCat: el => { U.audioCat = el.dataset.c; render(); },
    audioSrc: el => { U.audioSrc = el.dataset.s; U.audioCat = 'all'; render(); },
    audioPlay: el => { U.audioId = el.dataset.id; apStart(el.dataset.id); render(); },
    audioStop: () => { U.audioId = null; apStop(); },
    apToggle: () => { apToggle(); },
    apJump: el => { apJump(+el.dataset.s); },
    apNext: () => { apStep(1); },
    apPrev: () => { apStep(-1); },
    apStop: () => apStop(),
    apSpeed: () => apSpeed(),
    audioStep: el => {
      const list = DB.gitaAudio || [];
      if (!AP.id) { if (list[0]) { U.audioId = list[0].id; apStart(list[0].id); render(); } return; }
      let i = list.findIndex(x => x.id === AP.id);
      if (i < 0) i = 0;
      i = (i + (+el.dataset.d) + list.length) % list.length;
      U.audioId = list[i].id; apStart(list[i].id); render();
    },
    cat: el => { U.libCat = el.dataset.c; render(); },
    mcat: el => { U.marketCat = el.dataset.c; render(); },
    chapter: el => {
      const n = +el.dataset.n;
      if (S.chapters.includes(n)) toast(`অধ্যায় ${bn(n)} আবার পড়ুন`);
      else toast(`অধ্যায় ${bn(n)} এখনো খোলা হয়নি — আগে ${bn(Math.max(...S.chapters) + 1)} সম্পূর্ণ করুন`);
    },
    font: el => {
      S.font = Math.max(14, Math.min(24, S.font + (+el.dataset.d) * 1)); save('font'); render();
    },
    themeSet: el => { setTheme(el.dataset.v); render(); },
    toggleTheme: () => {
      const next = S.theme === 'light' ? 'dark' : 'light';
      setTheme(next); render();
      toast(next === 'light' ? 'লাইট মোড (পাটা-থিম) চালু ☀' : 'ডার্ক মোড চালু 🌙');
    },
    /* হেডারের সেটিংস বাটন: পপ হয়ে ছোট পপআপ খোলে */
    setPopupOpen: el => {
      const b = el.closest('.hbtn-set') || el;
      b.classList.add('popping');
      if (S.sound) chime('soft');
      setTimeout(() => { b.classList.remove('popping'); openSetPop(); }, 200);
    },
    setPopupClose: () => closeSetPop(),
    /* সার্চ পপআপ */
    searchDateGo: el => {
      const info = parseSearchDate(el.dataset.k);
      if (!info || info.invalid) return;
      U.panjika.day = info.key; U.panjika.y = info.date.getFullYear(); U.panjika.m = info.date.getMonth() + 1;
      const bd = bengaliDate(info.date); U.panjika.by = bd.year; U.panjika.bm = bd.m;
      closeSearchPop();
      if (location.hash === '#/panjika/daily') render(); else location.hash = '#/panjika/daily';
    },
    homeVoiceSearch: () => toggleHomeVoice(),
    homeSearchClear: () => { const input = document.getElementById('homeSearch'); if (input) { input.value = ''; updateHomeSearch(input); input.focus(); } },
    searchOpen: () => openSearchPop(),
    searchClose: () => closeSearchPop(),
    searchGo: el => {
      const to = el.dataset.to;
      const homeResults = document.getElementById('homeSearchResults'); if (homeResults) homeResults.hidden = true;
      closeSearchPop();
      if (to) { location.hash = to; }
    },
    toggleBg: () => { S.bg = !S.bg; save('bg'); applyBg(); render(); toast(S.bg ? 'পটভূমি থিম চালু' : 'পটভূমি থিম বন্ধ'); },
    toggleSound: () => { S.sound = !S.sound; save('sound'); if (S.sound) chime('soft'); render(); },
    toggleMotion: () => {
      S.motion = !S.motion; save('motion');
      document.documentElement.classList.toggle('no-motion', !S.motion); render();
    },
    toggleName: () => {
      const n = prompt('আপনার নাম লিখুন', S.name);
      if (n && n.trim()) { S.name = n.trim().slice(0, 40); save('name'); render(); toast('নাম সংরক্ষিত'); }
    },
    bookmark: el => {
      const i = +el.dataset.i;
      const id = (location.hash.split('/')[2]) || 'gita';
      const k = `${id}:${i}`;
      const at = S.bookmarks.indexOf(k);
      if (at >= 0) { S.bookmarks.splice(at, 1); toast('বুকমার্ক সরানো হলো'); }
      else { S.bookmarks.push(k); toast('বুকমার্কে যোগ হয়েছে'); chime('soft'); }
      save('bookmarks'); render();
    },
    markread: el => {
      const i = +el.dataset.i;
      const id = (location.hash.split('/')[2]) || 'gita';
      S.read[`${id}:${i}`] = true; save('read');
      S.lastVerse = { book: id, idx: i }; save('lastVerse');
      bumpActivity(6);
      const gita = DB.books.find(b => b.id === id);
      if (gita && gita.texts[i] && gita.texts[i].ch > Math.max(...S.chapters) && S.chapters.length < 18) {
        S.chapters.push(gita.texts[i].ch); save('chapters');
      }
      chime('tick'); toast('পাঠ সম্পন্ন ✓ · +৬ মিনিট');
      render();
    },
    lesson: el => {
      const id = el.dataset.id, i = +el.dataset.i;
      const arr = (S.lessons[id] || []).slice();
      const at = arr.indexOf(i);
      if (at >= 0) arr.splice(at, 1); else { arr.push(i); chime('tick'); bumpActivity(10); }
      S.lessons[id] = arr; save('lessons'); render();
    },
    pujaStep: el => {
      const id = el.dataset.id, i = +el.dataset.i;
      const k = id + ':' + TODAY_KEY;
      const arr = (S.puja[k] || []).slice();
      const at = arr.indexOf(i);
      if (at >= 0) arr.splice(at, 1); else { arr.push(i); chime('tick'); bumpActivity(4); }
      S.puja[k] = arr; save('puja');
      const total = (DB.pujas.find(p => p.id === id) || {}).steps.length;
      if (arr.length === total) { chime('complete'); setTimeout(() => { burst(window.innerWidth / 2, 200, 20); toast('পূজা সম্পূর্ণ 🌸'); }, 160); }
      render();
    },
    speak: el => speak(el.dataset.text || ''),
    speakKatha: el => {
      const b = DB.books.find(x => x.id === 'gita') || DB.books[0];
      const t = b.texts[+el.dataset.i];
      if (t && t.katha) speak(t.katha + (t.prayog ? ' জীবনে প্রয়োগ। ' + t.prayog : ''));
    },
    speakFull: el => {
      const b = DB.books.find(x => x.id === 'gita') || DB.books[0];
      const t = b.texts[+el.dataset.i];
      if (t) speak([t.bn, t.arth, t.katha].filter(Boolean).join('। '));
    },
    pmonth: el => {
      let { y, m } = U.panjika; m += +el.dataset.d;
      if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
      U.panjika.y = y; U.panjika.m = m; render();
    },
    pday: el => { U.panjika.day = el.dataset.k; render(); },
    pjsub: el => { location.hash = '#/panjika/' + el.dataset.s; },
    bbDay: el => {
      const st = jyState();
      const d = new Date(st.bday + 'T00:00:00'); d.setDate(d.getDate() + (+el.dataset.d));
      st.bday = key(d); render();
    },
    bbNow: () => { jyState().bday = TODAY_KEY; render(); },
    mdDay: el => {
      const st = jyState();
      const d = new Date(st.day + 'T00:00:00'); d.setDate(d.getDate() + (+el.dataset.d));
      st.day = key(d); render();
    },
    mdNow: () => { jyState().day = TODAY_KEY; render(); },
    pjall: el => { U.panjika.all = !U.panjika.all; render(); },
    pjday: el => {
      const d = new Date((U.panjika.day || TODAY_KEY) + 'T00:00:00');
      d.setDate(d.getDate() + (+el.dataset.d)); U.panjika.day = key(d); render();
    },
    pjnow: el => { U.panjika.day = TODAY_KEY; render(); },
    pjyear: el => { U.panjika.by += (+el.dataset.d); render(); },
    pjmonth: el => { U.panjika.by = +el.dataset.y; U.panjika.bm = +el.dataset.m; U.panjika.view = 'bn'; location.hash = '#/panjika'; render(); },
    scriptSet: el => { S.script = el.dataset.v; save('script'); render(); },
    pview: el => { U.panjika.view = el.dataset.v; render(); },
    pbm: el => {
      let y = U.panjika.by, m = U.panjika.bm + (+el.dataset.d);
      if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
      U.panjika.by = y; U.panjika.bm = m; render();
    },
    donate: el => {
      const id = el.dataset.id, amt = +el.dataset.amt;
      const c = DB.campaigns.find(x => x.id === id);
      const ok = confirm(`৳ ${bnN(amt)} দান নিশ্চিত করবেন?\n(${c.title})\n\nএটি ডেমো — কোনো বাস্তব পেমেন্ট হবে না।`);
      if (!ok) return;
      S.raised[id] = (S.raised[id] || 0) + amt; save('raised');
      S.orders.push({ kind: 'donation', title: c.title, amount: amt, status: 'সম্পন্ন', at: Date.now() }); save('orders');
      chime('complete'); burst(window.innerWidth / 2, window.innerHeight / 2, 18);
      const gitas = id === 'gita' ? Math.max(1, Math.round(amt / c.perUnit)) : 0;
      toast(gitas ? `গীতা দান গৃহীত 🙏 · ${bn(gitas)}টি গীতা ${bn(gitas)}টি পরিবারে পৌঁছাবে` : 'দানের জন্য ধন্যবাদ 🙏 · রিসিট সংরক্ষিত');
      render();
    },
    order: el => {
      const id = el.dataset.id;
      const p = (S.provider && S.provider.id === id) ? S.provider : DB.providers.find(x => x.id === id);
      const ok = confirm(`${p.name} — ৳ ${bnN(p.rate)} / ${p.rateLabel}\n\nবুকিং নিশ্চিত করবেন? (ডেমো — পেমেন্ট হবে না)`);
      if (!ok) return;
      S.orders.push({ kind: 'service', title: p.name + ' · ' + p.cat, amount: p.rate, status: 'এসক্রোতে', at: Date.now() });
      save('orders'); chime('soft'); toast('বুকিং তৈরি হয়েছে · এসক্রো সুরক্ষিত');
      render();
    },
    providerForm: () => {
      const name = prompt('আপনার নাম', S.name); if (!name) return;
      const cat = prompt('দক্ষতা / বিভাগ (টিউটর, পুরোহিত, গ্রাফিক্স, কথক)', 'গ্রাফিক্স'); if (!cat) return;
      const rate = parseInt(prompt('আপনার রেট (টাকায়)', '800'), 10) || 500;
      S.provider = { id: 'me', name: name.trim(), ini: name.trim().slice(0, 1), cat: cat.trim(), role: `${cat.trim()} · নিজের প্রোফাইল`, rate, rateLabel: 'কাজ', rating: 5, reviews: 0 };
      save('provider'); chime('complete'); toast('প্রোফাইল তৈরি হয়েছে ✓');
      render();
    },
    myProfile: () => {
      const e = S.orders.filter(o => o.kind === 'service').reduce((s, o) => s + o.amount, 0);
      toast(`মোট আয় ৳ ${bnN(e)} · আপনার শেয়ার ৳ ${bnN(Math.round(e * .85))}`);
    },
    quizStart: () => startQuiz(),
    pick: el => {
      U.quiz.answers[U.quiz.i] = +el.dataset.i;
      chime('soft'); render();
    },
    quizNext: () => { if (U.quiz.i < DB.quizzes.weekly.questions.length - 1) { U.quiz.i++; render(); } },
    quizPrev: () => { if (U.quiz.i > 0) { U.quiz.i--; render(); } },
    quizSubmit: () => {
      const answered = Object.keys(U.quiz.answers).length;
      if (answered < DB.quizzes.weekly.questions.length && !confirm(`আপনি ${bn(DB.quizzes.weekly.questions.length - answered)}টি প্রশ্নের উত্তর দেননি। তবুও জমা দেবেন?`)) return;
      submitQuiz();
    },
    tfield: el => {
      const k = el.dataset.k, d = +el.dataset.d;
      const e = entryFor(TODAY_KEY);
      const steps = { puja: 5, japaExtra: 1, dhyanaExtra: 5, pathMin: 5, daanTaka: 50, daanMin: 5,
        workMin: 15, income: 100, studyMin: 10, familyMin: 15, sleepH: 1, lies: 1, anger: 1 };
      const step = steps[k] || 1;
      let v = (e[k] || 0) + d * step;
      if (k === 'sleepH') v = clamp(v, 3, 12);
      else v = Math.max(0, v);
      e[k] = v; save('daily');
      if (d > 0 && (k === 'japaExtra' || k === 'puja')) chime('soft');
      render(); refreshSheet();
    },
    trackDone: () => {
      const e = entryFor(TODAY_KEY);
      const sc = scoreOf(e, todayAuto());
      e.done = true; save('daily');
      if (sc.total >= 60) { chime('complete'); setTimeout(() => burst(window.innerWidth / 2, 260, 24), 80); }
      else chime('tick');
      toast(`আজকের হিসাব সংরক্ষিত ✓ · স্কোর ${bn(sc.total)}/১০০`);
      render();
    },
    sadhanaTab: el => { U.sadhanaTab = el.dataset.t; location.hash = '#/sadhana/' + U.sadhanaTab; render(); },
    japaTap: () => japaTap(),
    japaReset: () => {
      if (!confirm('আজকের জপ গণনা রিসেট করবেন?')) return;
      S.japa.count = 0; save('japa'); japaUpdate(); toast('জপ গণনা রিসেট');
    },
    japaFinish: () => {
      const done = 108 - S.japa.count;
      S.japa.rounds += 1; S.japa.count = 0; save('japa');
      chime('complete'); bumpActivity(6);
      setTimeout(() => burst(window.innerWidth / 2, 260, 22), 60);
      toast(`মালা সম্পূর্ণ 🌸${done > 0 ? ' (বাকি ' + bn(done) + ' জপ গণ্য হলো)' : ''}`);
      japaUpdate(); render();
    },
    japaMantra: el => { S.japa.mantra = el.dataset.id; save('japa'); render(); },
    medPreset: el => {
      if (U.med.running && !confirm('চলমান ধ্যান বন্ধ করে সময় বদলাবেন?')) return;
      clearInterval(U.medTimer); U.medTimer = null;
      U.med = { mins: +el.dataset.m, left: +el.dataset.m * 60, running: false, phase: '' };
      render();
    },
    medToggle: () => {
      if (U.med.running) {
        clearInterval(U.medTimer); U.medTimer = null; U.med.running = false;
        toast('ধ্যান বিরতিতে'); render();
      } else { medStart(); chime('soft'); render(); }
    },
    medReset: () => {
      clearInterval(U.medTimer); U.medTimer = null;
      U.med.left = U.med.mins * 60; U.med.running = false;
      render(); toast('ধ্যান রিসেট');
    },
    asanaToggle: el => {
      const id = el.dataset.id;
      S.asanaDone[id] = !S.asanaDone[id]; save('asanaDone');
      if (S.asanaDone[id]) { chime('tick'); bumpActivity(1); }
      render();
    },
    seqToggle: () => {
      if (U.seq.running) { clearInterval(U.seqTimer); U.seqTimer = null; U.seq.running = false; render(); }
      else { seqStart(); render(); }
    },
    seqNext: () => {
      const st = DB.suryaNamaskar;
      if (U.seq.i < st.length - 1) { U.seq.i++; U.seq.left = st[U.seq.i].s; render(); }
      else { clearInterval(U.seqTimer); U.seq.running = false; U.seq.i = 0; U.seq.left = st[0].s; toast('শেষ ধাপ — আবার শুরু হলো'); render(); }
    },
    seqPrev: () => {
      const st = DB.suryaNamaskar;
      if (U.seq.i > 0) { U.seq.i--; U.seq.left = st[U.seq.i].s; render(); }
    },
    setRole: el => {
      S.role = el.dataset.r; save('role');
      logAction('ভূমিকা পরিবর্তন → ' + roleLabel(S.role));
      toast('এখন আপনি ' + roleLabel(S.role));
      render();
    },
    adminTab: el => { U.adminTab = el.dataset.t; render(); },
    uStatus: el => {
      S.userState[el.dataset.id] = el.dataset.v; save('userState');
      const u = DB.users.find(x => x.id === el.dataset.id);
      logAction((el.dataset.v === 'suspended' ? 'স্থগিত: ' : 'অনুমোদন: ') + (u ? u.name : ''));
      chime(el.dataset.v === 'active' ? 'complete' : 'tick');
      toast(el.dataset.v === 'suspended' ? 'ব্যবহারকারী স্থগিত করা হলো' : 'ব্যবহারকারী অনুমোদিত');
      render();
    },
    appDecide: el => {
      S.appState[el.dataset.id] = el.dataset.v; save('appState');
      const a = DB.applications.find(x => x.id === el.dataset.id);
      logAction((el.dataset.v === 'approved' ? 'আবেদন অনুমোদিত: ' : 'আবেদন বাতিল: ') + (a ? a.name : ''));
      chime(el.dataset.v === 'approved' ? 'complete' : 'tick');
      toast(el.dataset.v === 'approved' ? 'অনুমোদিত ✓ — প্রোফাইল প্রকাশ্যে এল' : 'আবেদন বাতিল হয়েছে');
      render();
    },
    repDecide: el => {
      S.reportState[el.dataset.id] = el.dataset.v; save('reportState');
      logAction((el.dataset.v === 'actioned' ? 'কনটেন্ট সরানো: ' : 'রিপোর্ট খারিজ: ') + el.dataset.id);
      toast(el.dataset.v === 'actioned' ? 'কনটেন্ট সরানো হয়েছে' : 'রিপোর্ট খারিজ');
      render();
    },
    payoutAppr: el => {
      const id = el.dataset.id;
      const base = DB.payouts.find(p => p.id === id).approvals;
      const cur = S.payoutAppr[id] !== undefined ? S.payoutAppr[id] : base;
      S.payoutAppr[id] = Math.min(2, cur + 1); save('payoutAppr');
      logAction('পেআউট অনুমোদন (' + S.payoutAppr[id] + '/২): ' + id);
      S.payoutAppr[id] >= 2 ? chime('complete') : chime('soft');
      toast(S.payoutAppr[id] >= 2 ? 'পেআউট রিলিজ হয়েছে ✓' : 'প্রথম অনুমোদন সম্পন্ন — আরও একজন দরকার');
      render();
    },
    addChild: () => {
      const n = prompt('সন্তানের নাম', ''); if (!n) return;
      const cls = prompt('শ্রেণি', 'শ্রেণি ৪') || '—';
      S.children.push({ n: n.trim(), cls: cls.trim(), pct: 0 });
      save('children'); toast('সন্তান যোগ হয়েছে'); render();
    },
    reset: () => {
      if (!confirm('সব ডেমো ডেটা (পাঠ, কুইজ, দান) রিসেট করবেন?')) return;
      try { Object.keys(localStorage).filter(k => k.startsWith('svp_')).forEach(k => localStorage.removeItem(k)); } catch (e) { }
      location.reload();
    }
  };

  /* =====================================================================
     BINDINGS
     ===================================================================== */
  /* পাতা বন্ধ / অ্যাপ থেকে বেরিয়ে যাওয়া / ট্যাব হাইবার্ন — সব ক্ষেত্রেই থামাও */
  window.addEventListener('pagehide', apHalt);
  window.addEventListener('beforeunload', apHalt);
  document.addEventListener('freeze', apHalt);
  document.addEventListener('visibilitychange', () => {
    /* অ্যাপ পিছনে গেলেই অডিও থামে (তাই অ্যাপ বন্ধ করলে শব্দ থাকবে না);
       ফিরে এলে আগে চলছিল এমন হলে নিজেই আবার চালু হয় */
    if (!AP.player) return;
    if (document.visibilityState === 'hidden') {
      if (apPlaying()) { AP.resumeOnShow = true; try { AP.player.pauseVideo(); } catch (e) {} }
    } else if (AP.resumeOnShow) {
      AP.resumeOnShow = false;
      try { AP.player.playVideo(); } catch (e) {}
      apRender();
    }
  });

  // The browser handles microphone permission and speech recognition.
  let homeRecognition = null;
  function homeVoiceStatus(message, listening) {
    const status = document.getElementById('homeVoiceStatus');
    const button = document.querySelector('.ref-search-voice');
    if (status) { status.textContent = message; status.hidden = !message; }
    if (button) { button.classList.toggle('is-listening', !!listening); button.setAttribute('aria-pressed', listening ? 'true' : 'false'); button.setAttribute('aria-label', listening ? 'ভয়েস শোনা বন্ধ করুন' : 'ভয়েস দিয়ে খুঁজুন'); }
  }
  function toggleHomeVoice() {
    if (homeRecognition) { homeRecognition.stop(); homeRecognition = null; homeVoiceStatus('', false); return; }
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) { homeVoiceStatus('এই ব্রাউজারে ভয়েস অনুসন্ধান সমর্থিত নয়। লিখে খুঁজুন।', false); return; }
    const recognition = new Speech(); homeRecognition = recognition;
    recognition.lang = 'bn-BD'; recognition.interimResults = false; recognition.maxAlternatives = 1;
    let reportedError = false;
    recognition.onresult = event => {
      const input = document.getElementById('homeSearch');
      const transcript = event.results && event.results[0] && event.results[0][0] && event.results[0][0].transcript;
      if (input && transcript) { input.value = transcript; updateHomeSearch(input); }
      homeVoiceStatus(transcript ? 'শোনা শব্দ দিয়ে খোঁজা হয়েছে।' : 'কথা শোনা যায়নি। আবার চেষ্টা করুন।', false);
    };
    recognition.onerror = event => {
      reportedError = true;
      const message = event.error === 'not-allowed' || event.error === 'service-not-allowed' ? 'মাইক্রোফোনের অনুমতি দিন, অথবা লিখে খুঁজুন।' : event.error === 'no-speech' ? 'কথা শোনা যায়নি। আবার চেষ্টা করুন।' : 'ভয়েস অনুসন্ধান করা যায়নি। লিখে খুঁজুন।';
      homeVoiceStatus(message, false);
    };
    recognition.onend = () => { if (homeRecognition === recognition) { homeRecognition = null; const button = document.querySelector('.ref-search-voice'); if (button) { button.classList.remove('is-listening'); button.setAttribute('aria-pressed','false'); button.setAttribute('aria-label','ভয়েস দিয়ে খুঁজুন'); } if (!reportedError && document.getElementById('homeVoiceStatus')?.textContent === 'শুনছি… এখন বলুন।') homeVoiceStatus('কথা শোনা যায়নি। আবার চেষ্টা করুন।', false); } };
    try { recognition.start(); homeVoiceStatus('শুনছি… এখন বলুন।', true); }
    catch (e) { homeRecognition = null; homeVoiceStatus('ভয়েস অনুসন্ধান করা যায়নি। লিখে খুঁজুন।', false); }
  }
  function updateHomeSearch(input) {
    const box = document.getElementById('homeSearchResults');
    const clear = document.querySelector('.ref-search-clear');
    if (!box || !input) return;
    const query = input.value.trim();
    if (clear) clear.hidden = !query;
    box.hidden = !query;
    input.setAttribute('aria-expanded', query ? 'true' : 'false');
    box.innerHTML = query ? searchResultsHTML(query) : '';
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.ref-home-search')) {
      const input = document.getElementById('homeSearch'), box = document.getElementById('homeSearchResults');
      if (box) box.hidden = true;
      if (input) input.setAttribute('aria-expanded', 'false');
    }
    const move = e.target.closest('[data-hero-move]');
    if (move) { _hxUserAt = Date.now(); heroShow(_hxIdx + Number(move.dataset.heroMove)); return; }
    const hd = e.target.closest('.hx-d');
    if (hd) { heroShow(+hd.dataset.hd); return; }
    if (e.target.closest('.hx-rot')) { heroShow(_hxIdx + 1); return; }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = ACTIONS[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('keydown', e => {
    const taskPop = document.getElementById('dailyTaskPop');
    if (e.key === 'Tab' && taskPop && taskPop.classList.contains('on')) {
      const controls = [...taskPop.querySelectorAll('.daily-task-card button:not([disabled])')];
      if (controls.length) {
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || !taskPop.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !taskPop.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    }
    if (e.key === 'Escape' && e.target.id === 'homeSearch') { const box = document.getElementById('homeSearchResults'); if (box) box.hidden = true; e.target.setAttribute('aria-expanded','false'); return; }
    if (e.key === 'Enter' && e.target.id === 'homeSearch') { const result = document.querySelector('#homeSearchResults .ref-date-open, #homeSearchResults .sres'); if (result) { e.preventDefault(); result.click(); } return; }
    if (e.key === 'Escape') { closeDailyTasks(); closeSetPop(); closeSearchPop(); return; }
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest('[data-act][role="button"],[data-act][role="checkbox"]');
    if (el) { e.preventDefault(); el.click(); }
  });
  document.addEventListener('focusin', e => { if (e.target.id === 'homeSearch' && e.target.value.trim()) updateHomeSearch(e.target); });
  document.addEventListener('input', e => {
    if (e.target && e.target.id === 'homeSearch') { updateHomeSearch(e.target); return; }
    if (e.target && e.target.id === 'sq') {
      SI.q = e.target.value;
      clearTimeout(SI.t); SI.t = setTimeout(() => runSearch(SI.q), 110);
      return;
    }
    if (e.target.id === 'chatDraft') { U.chatDraft = e.target.value; return; }
    if (e.target.id === 'noteText') { U.note.text = e.target.value; return; }
    if (e.target.id === 'noteSearch') {
      U.noteQ = e.target.value; render();
      const ni = document.getElementById('noteSearch');
      if (ni) { ni.focus(); ni.setSelectionRange(ni.value.length, ni.value.length); }
      return;
    }
    if (e.target.id === 'libSearch') {
      U.libQ = e.target.value;
      const list = document.getElementById('libList');
      if (list) list.innerHTML = bookCards();
    }
    if (e.target.dataset && e.target.dataset.field) {
      const f = e.target.dataset.field;
      const entry = entryFor(TODAY_KEY);
      entry[f] = e.target.value;
      save('daily');
      return;
    }
    if (e.target.id === 'apSeekBig') {
      const v = +e.target.value, d = (AP.player && AP.player.getDuration) ? AP.player.getDuration() : 0;
      if (d) { AP.player.seekTo(v, true); apFillPct(e.target, v / d * 100); }
      const t = document.getElementById('apTimeBig'); if (t) t.textContent = apTime(v);
      return;
    }
    if (e.target.id === 'apVol') { apSetVol(+e.target.value); apFillPct(e.target, +e.target.value); return; }
    if (e.target.id === 'jyDate' || e.target.id === 'jyTime' || e.target.id === 'jyCity') {
      const st = jyState();
      if (e.target.id === 'jyDate') st.date = e.target.value;
      else if (e.target.id === 'jyTime') st.time = e.target.value;
      else st.city = +e.target.value;
      render();
      return;
    }
    if (e.target.id === 'gitaSearch') {
      U.gitaQ = e.target.value; render();
      const gi = document.getElementById('gitaSearch');
      if (gi) { gi.focus(); gi.setSelectionRange(gi.value.length, gi.value.length); }
      return;
    }
    if (e.target.id === 'adminSearch') {
      U.adminQ = e.target.value; render();
      const inp = document.getElementById('adminSearch');
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    }
    if (e.target.id === 'marketSearch') {
      U.marketQ = e.target.value;
      const list = document.getElementById('marketList');
      if (list) list.innerHTML = providerCards();
    }
  });
  window.addEventListener('hashchange', render);
  initDragEngine();
  /* প্রতি রেন্ডারের পরে কমান্ড-বার ঠিক মাপে বসাই (ছোট ফোনে সরু) */
  const _renderOld = render;
  render = function () {
    const r = _renderOld.apply(this, arguments);
    try { if (window.__cmdSlim) window.__cmdSlim(); } catch (e) { }
    /* নাদ-সারি চোখের সামনে এলে পাঁচটি প্লেয়ার নীরব অবস্থায় তৈরি করে রাখি */
    setTimeout(function () {
      try {
        if (!document.querySelector('.nad-foot') || !NPLR || !NPLR.warm) return;
        if (window.__nadWarmed) return;
        window.__nadWarmed = true;
        NPLR.warm();
      } catch (e) { }
    }, 500);
    return r;
  };

  /* =====================================================================
     INIT
     ===================================================================== */
  /* ---- ব্র্যান্ড বার্তা-টিকার: প্রতি ৩ সেকেন্ডে এক লাইন, মাঝে মাঝে শিশু-শিক্ষার দুই-ভাগ বার্তা (৫+৫ = ১০ সেকেন্ড) ---- */
  const BL_LINES = [
    '॥ ধর্মো রক্ষতি রক্ষিতঃ ॥',
    'প্রতিদিন এক শ্লোক · প্রতিদিন এক ধাপ',
    'গীতা · উপনিষদ · পুরাণ — সব এক জায়গায়',
    '৮০৫ চ্যানেলের কথা, কীর্তন ও শাস্ত্রপাঠ',
    'নিয়মিত জপে মন স্থির হয়, পূজায় ঘর পবিত্র'
  ];
  const BL_PROMO = ['আপনার শিশুকে প্রাতিষ্ঠানিক শিক্ষার', 'পাশাপাশি ধর্মীয় শিক্ষায় শিক্ষিত করুন।'];
  let _blTimer = null, _blCount = 0, _blSince = 0, _blPhase = 'line';
  function brandLineSet(text) {
    const el = document.getElementById('brandline');
    if (!el || el.dataset.txt === text) return;
    el.dataset.txt = text;
    el.classList.add('out');
    setTimeout(() => {
      el.textContent = text;
      el.classList.remove('out');
      el.classList.add('in');
      setTimeout(() => el.classList.remove('in'), 460);
    }, 220);
  }
  function brandTicker() {
    clearTimeout(_blTimer);
    const tick = () => {
      const el = document.getElementById('brandline');
      if (!el) { _blTimer = null; return; }
      if (_blPhase === 'promo1') {
        brandLineSet(BL_PROMO[0]); el.classList.add('promo');
        _blPhase = 'promo2'; _blTimer = setTimeout(tick, 5000); return;
      }
      if (_blPhase === 'promo2') {
        brandLineSet(BL_PROMO[1]);
        _blPhase = 'line'; _blSince = 0; _blTimer = setTimeout(tick, 5000); return;
      }
      el.classList.remove('promo');
      brandLineSet(BL_LINES[_blCount % BL_LINES.length]);
      _blCount++; _blSince++;
      _blPhase = (_blSince >= 4) ? 'promo1' : 'line';
      _blTimer = setTimeout(tick, 3000);
    };
    tick();
  }

  /* ---------------------------------------------- হেডার: স্ক্রলে ছোট (v70)
     স্ক্রল >৫২px হলে .home-head-এ hdr-min — শুধু লোগো · নাম · সার্চ আইকন থাকে। */
  let _hdrRaf = null;
  function hdrUpdate() {
    const v = document.getElementById('view');
    const h = document.querySelector('.home-head');
    if (!h) return;
    const on = !!v && v.scrollTop > 52;
    if (on !== h.classList.contains('hdr-min')) h.classList.toggle('hdr-min', on);
  }
  function hdrInit() {
    const v = document.getElementById('view');
    if (!v || v.dataset.hdrBound) return;
    v.dataset.hdrBound = '1';
    v.addEventListener('scroll', () => {
      if (_hdrRaf) return;
      _hdrRaf = (window.requestAnimationFrame || (f => setTimeout(f, 16)))(() => { _hdrRaf = null; hdrUpdate(); });
    }, { passive: true });
  }

  /* ------------------------------------- অ্যাপবারের শিরোনাম: মাঝে মাঝে ব্র্যান্ড নাম (v72)
     প্রতিটি পর্দার নিজের শিরোনাম থাকলেও প্রতি তিন ধাপে একবার “সনাতন বিদ্যাপীঠ” আসে। */
  let _abTimer = null, _abCount = 0;
  function appbarTicker() {
    clearInterval(_abTimer); _abTimer = null;
    const h0 = document.querySelector('.appbar h3');
    if (!h0) return;
    if (h0.dataset.orig === undefined) h0.dataset.orig = h0.innerHTML;
    const orig = h0.dataset.orig, alt = 'সনাতন বিদ্যাপীঠ';
    _abCount = 0;
    const swap = (txt) => {
      const el = document.querySelector('.appbar h3');
      if (!el) return;
      el.classList.toggle('ab-brand', txt === alt);
      el.classList.add('ab-out');
      setTimeout(() => {
        const e2 = document.querySelector('.appbar h3');
        if (!e2) return;
        e2.innerHTML = txt;
        e2.classList.toggle('ab-brand', txt === alt);
        e2.classList.remove('ab-out');
        e2.classList.add('ab-in');
        setTimeout(() => { const e3 = document.querySelector('.appbar h3'); if (e3) e3.classList.remove('ab-in'); }, 430);
      }, 180);
    };
    _abTimer = setInterval(() => {
      const el = document.querySelector('.appbar h3');
      if (!el) { clearInterval(_abTimer); _abTimer = null; return; }
      if (document.hidden) return;
      _abCount++;
      swap(_abCount % 3 === 0 ? alt : orig);
    }, 3600);
  }

  /* হিরো কার্ডের শিরোনাম-রোটেশন (পঞ্জিকার ব্রত/উৎসব/আসন্ন) */
  let _hxTimer = null, _hxIdx = 0, _hxUserAt = 0, _writeTimer = null;
  function writeHeroTitle(slide) {
    clearTimeout(_writeTimer); _writeTimer = null;
    if (!slide) return;
    const ink = slide.querySelector('.ref-writing-ink');
    const quill = slide.querySelector('.ref-writing-feather');
    const title = slide.querySelector('.ref-writing-title');
    if (!ink || !quill || !title) return;
    const text = title.getAttribute('aria-label') || ink.textContent;
    ink.textContent = text;
    quill.classList.remove('is-writing');
    if (document.documentElement.classList.contains('no-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const parts = typeof Intl.Segmenter === 'function' ? Array.from(new Intl.Segmenter('bn', { granularity: 'grapheme' }).segment(text), x => x.segment) : Array.from(text);
    ink.textContent = '';
    const fragment = document.createDocumentFragment();
    const letters = parts.map(part => { const node = document.createElement('span'); node.className = 'ref-writing-letter'; node.textContent = part; fragment.appendChild(node); return node; });
    ink.appendChild(fragment);
    let index = 0; const delay = Math.max(55, Math.min(260, 2700 / Math.max(1, letters.length)));
    function step() {
      if (!slide.isConnected || !slide.classList.contains('on')) return;
      if (index >= letters.length) { _writeTimer = setTimeout(() => quill.classList.remove('is-writing'), 250); return; }
      const letter = letters[index++]; letter.classList.add('written');
      const rect = letter.getBoundingClientRect(), area = title.getBoundingClientRect();
      quill.style.left = (rect.right - area.left - 27) + 'px';
      quill.style.top = (rect.bottom - area.top - 30) + 'px';
      quill.classList.add('is-writing');
      _writeTimer = setTimeout(step, delay);
    }
    _writeTimer = setTimeout(step, 120);
  }

  function heroItems() { const r = document.getElementById('heroRot'); return r ? Array.from(r.children) : []; }
  function heroShow(i) {
    const items = heroItems(); if (!items.length) return;
    _hxIdx = ((i % items.length) + items.length) % items.length;
    items.forEach((el, k) => { el.classList.toggle('on', k === _hxIdx); el.setAttribute('aria-hidden', k === _hxIdx ? 'false' : 'true'); });
    writeHeroTitle(items[_hxIdx]);
    const count = document.getElementById('heroCount');
    if (count) count.textContent = `${bn(_hxIdx + 1)} / ${bn(items.length)}`;
    document.querySelectorAll('.hx-d').forEach((d, k) => d.classList.toggle('on', k === _hxIdx));
  }
  function heroTicker() {
    clearInterval(_hxTimer); _hxTimer = null;
    if (!heroItems().length) return;
    heroShow(0);
    if (heroItems().length < 2) return;
    const slow = document.documentElement.classList.contains('no-motion')
      || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    _hxTimer = setInterval(() => {
      if (!document.getElementById('heroRot')) { clearInterval(_hxTimer); _hxTimer = null; return; }
      if (document.hidden || Date.now() - _hxUserAt < 6500) return;
      heroShow(_hxIdx + 1);
    }, slow ? 14000 : 6500);
  }

  function render() {
    /* অন্য পাতায় চলে গেলে আরতি থেমে যাবে */
    const ast = aartiState();
    if (ast.playing && location.hash.indexOf('#/puja/deva/' + ast.id) !== 0) {
      AENG.stop(); setTimeout(syncAartiUI, 0);
    }
    route(); hdrInit(); hdrUpdate(); appbarTicker(); if (document.getElementById('brandline')) brandTicker();
    if (document.getElementById('heroRot')) heroTicker();
    refreshSetPop(); refreshDailyTasks();
    setTimeout(syncAartiUI, 0);
    setTimeout(syncNadUI, 0); }

  function init() {
    /* ডিফল্ট থিম এখন লাইট — পুরনো সেভ করা 'dark' একবার বদলে দেওয়া হয় */
    if (!store.get('themeLight2', false)) { store.set('themeLight2', true); S.theme = 'light'; save('theme'); }
    document.body.insertAdjacentHTML('afterbegin', SPRITE);
    /* নেভিগেশন-বারের বাইরে, ডান পাশে ভাসমান নোট-বাটন */
    document.body.insertAdjacentHTML('beforeend',
      `<div id="sheetHost"></div><button class="notefab" data-act="sheetOpen" aria-label="আজকের হিসাব ও নোট" title="আজকের হিসাব ও নোট">${ico('plus')}</button>`);
    document.documentElement.dataset.theme = S.theme;
    applyBg();
    document.documentElement.classList.toggle('no-motion', !S.motion);
    /* নিচের কমান্ড-বার ছোট হয়ে যায় — পোস্টারের নিচের বাটনগুলো ঢাকা না পড়ে */
    let _cmdMin = null;
    const cmdSlim = () => {
      const bar = document.querySelector('.cmdbar');
      if (!bar) { _cmdMin = null; return; }
      /* স্ক্রল হয় ভেতরের .view-তে, window-এ নয় */
      const view = document.querySelector('.view');
      const sy = Math.max(window.scrollY || 0, view ? view.scrollTop : 0);
      const min = sy > 60 || window.innerHeight < 700;
      if (min !== _cmdMin) { _cmdMin = min; bar.classList.toggle('min', min); }
    };
    window.__cmdSlim = cmdSlim;
    window.addEventListener('scroll', cmdSlim, { passive: true });
    document.addEventListener('scroll', cmdSlim, { passive: true, capture: true });
    setTimeout(cmdSlim, 0); setTimeout(cmdSlim, 300);
    try { if (NPLR && NPLR.preload) NPLR.preload(); } catch (e) { }
    document.addEventListener('click', function () { try { if (NPLR && NPLR.preload) NPLR.preload(); } catch (e) { } }, { once: true, capture: true });
    window.addEventListener('resize', cmdSlim, { passive: true });
    if (NPLR) NPLR.onChange = () => { try { syncNadUI(); } catch (e) { } };
    if (NPLR) NPLR.onNote = msg => { try { toast(msg); } catch (e) { } };
    if (!location.hash) location.hash = '#/home';
    render();
    /* Refresh the date after local midnight even when the app remains open. */
    const refreshCalendarDate = () => {
      const now = new Date(), nextKey = key(now);
      if (nextKey === TODAY_KEY) return;
      const oldKey = TODAY_KEY; TODAY = now; TODAY_KEY = nextKey;
      if (U.panjika && U.panjika.day === oldKey) U.panjika.day = nextKey;
      render();
    };
    setInterval(refreshCalendarDate, 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshCalendarDate(); });
    setTimeout(maybeNotify, 2500);
    setTimeout(() => {
      if (!store.get('seen', false)) {
        store.set('seen', true);
        toast('স্বাগতম 🙏 ডেমো মোড — সব ডেটা আপনার ব্রাউজারেই থাকে');
      }
    }, 900);
  }
  init();
})();
