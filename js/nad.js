/* =====================================================================
   সনাতন বিদ্যাপীঠ — পূজার নাদ: শঙ্খ · উলুধ্বনি · ঢাক · কাঁসর
   ---------------------------------------------------------------------
   চারটি ধ্বনিই Web Audio দিয়ে এখানেই তৈরি হয় — কোনো বাইরের অডিও ফাইল
   নেই, তাই নেট ছাড়াও বাজে। ছবি: app/icons/nad/*.png (এআই-জেনারেটেড)।
   ===================================================================== */
(function (w) {
  'use strict';

  var NAD = {
    shankha: { n: 'শঙ্খ', t: 'পূজার সূচনা-ধ্বনি', g: 'শঙ্খ', dur: 3.0 },
    ulu: { n: 'উলুধ্বনি', t: 'মঙ্গল-ধ্বনি', g: 'উলু', dur: 1.9 },
    dhak: { n: 'ঢাক', t: 'উৎসবের বাদ্য', g: 'ঢাক', dur: 2.4 },
    kashar: { n: 'কাঁসর', t: 'তাল-বাদ্য', g: 'কাঁস', dur: 2.0 },
    ganti: { n: 'ঘণ্টা', t: 'মন্দির-ঘণ্টার ধ্বনি', g: 'ঘ', dur: 2.6 }
  };
  w.NAD = NAD;

  /* ব্যবহারকারীর দেওয়া ইউটিউব লিংক — এই ধ্বনিগুলোই লুপে বাজবে */
  var NAD_YT = {
    shankha: '7JLJPuSDuVM',   /* শঙ্খ ধ্বনি */
    ulu: 'PvzGO7b-VTM',       /* উলু ধ্বনি */
    dhak: '6eZ-3e5KbZo',      /* ঢাকের বাজনা */
    kashar: 'FXKJQakZJMs',    /* কাঁসরের ধ্বনি */
    ganti: 'FYYBqNV9res'      /* মন্দিরের ঘণ্টা */
  };
  w.NAD_YT = NAD_YT;

  var ac = null;
  function ctx() {
    var AC = w.AudioContext || w.webkitAudioContext;
    if (!AC) return null;
    try {
      ac = ac || new AC();
      if (ac.state === 'suspended' && ac.resume) ac.resume();
      return ac;
    } catch (e) { return null; }
  }

  function noise(ac, sec) {
    try {
      var n = Math.max(1, Math.floor((ac.sampleRate || 44100) * sec));
      var b = ac.createBuffer(1, n, ac.sampleRate || 44100);
      var d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1);
      return b;
    } catch (e) { return null; }
  }

  function bus(ac, vol) {
    var g = ac.createGain();
    g.gain.value = vol || 1;
    if (ac.createDynamicsCompressor) {
      var c = ac.createDynamicsCompressor();
      try { c.threshold.value = -16; c.ratio.value = 3; } catch (e) { }
      g.connect(c); c.connect(ac.destination);
    } else g.connect(ac.destination);
    return g;
  }

  /* ---- শঙ্খ: গভীর থেকে উঠে আসা দীর্ঘ নাদ, সঙ্গে শ্বাসের ফুঁ ---- */
  function shankha(ac, out, t0) {
    var dur = 2.9;
    [0, 11].forEach(function (cents, i) {
      var o = ac.createOscillator(), g = ac.createGain(), f = null;
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(178 + i * 1.5, t0);
      o.frequency.linearRampToValueAtTime(292 + i * 2, t0 + 0.55);
      o.frequency.linearRampToValueAtTime(300 + i * 2, t0 + 1.9);
      o.frequency.linearRampToValueAtTime(268, t0 + dur);
      if (o.detune) o.detune.value = cents;
      if (ac.createBiquadFilter) {
        f = ac.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 780; f.Q.value = 2.6;
        o.connect(f); f.connect(g);
      } else o.connect(g);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(i ? 0.10 : 0.24, t0 + 0.22);
      g.gain.linearRampToValueAtTime(i ? 0.08 : 0.20, t0 + 1.7);
      g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      g.connect(out);
      o.start(t0); o.stop(t0 + dur + 0.1);
    });
    var nb = noise(ac, dur), s = ac.createBufferSource(), ng = ac.createGain();
    if (nb) {
      s.buffer = nb;
      if (ac.createBiquadFilter) {
        var hp = ac.createBiquadFilter();
        hp.type = 'bandpass'; hp.frequency.value = 2400; hp.Q.value = 0.8;
        s.connect(hp); hp.connect(ng);
      } else s.connect(ng);
      ng.gain.setValueAtTime(0.0001, t0);
      ng.gain.linearRampToValueAtTime(0.05, t0 + 0.25);
      ng.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      ng.connect(out);
      s.start(t0); s.stop(t0 + dur);
    }
    /* শেষে হালকা ঘণ্টার আভাস */
    [[880, 0.07], [1318, 0.035]].forEach(function (p) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0.0001, t0 + 2.2);
      g.gain.exponentialRampToValueAtTime(p[1], t0 + 2.24);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.0);
      o.connect(g); g.connect(out);
      o.start(t0 + 2.2); o.stop(t0 + 3.05);
    });
  }

  /* ---- উলুধ্বনি: দ্রুত কম্পিত কণ্ঠস্বর (২৬ Hz ত্রিল) ---- */
  function ulu(ac, out, t0) {
    var dur = 1.85;
    [0, 7, -6].forEach(function (cents, i) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(470 + i * 9, t0);
      o.frequency.linearRampToValueAtTime(598 + i * 9, t0 + 1.5);
      if (o.detune) o.detune.value = cents;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(i ? 0.055 : 0.13, t0 + 0.1);
      g.gain.setValueAtTime(i ? 0.055 : 0.13, t0 + 1.35);
      g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(out);
      o.start(t0); o.stop(t0 + dur + 0.05);
      /* ২৬ Hz ত্রিল — কণ্ঠের কম্পন */
      try {
        var lfo = ac.createOscillator(), lg = ac.createGain();
        lfo.type = 'sine'; lfo.frequency.value = 26.5;
        lg.gain.value = 34 + i * 2;
        lfo.connect(lg); lg.connect(o.frequency);
        lfo.start(t0); lfo.stop(t0 + dur);
      } catch (e) { }
      try {
        var lfo2 = ac.createOscillator(), lg2 = ac.createGain();
        lfo2.type = 'sine'; lfo2.frequency.value = 13;
        lg2.gain.value = (i ? 0.02 : 0.05);
        lfo2.connect(lg2); lg2.connect(g.gain);
        lfo2.start(t0); lfo2.stop(t0 + dur);
      } catch (e) { }
    });
    var nb = noise(ac, dur), s = ac.createBufferSource(), ng = ac.createGain();
    if (nb) {
      s.buffer = nb;
      if (ac.createBiquadFilter) {
        var bp = ac.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 1600; bp.Q.value = 1.2;
        s.connect(bp); bp.connect(ng);
      } else s.connect(ng);
      ng.gain.setValueAtTime(0.0001, t0);
      ng.gain.linearRampToValueAtTime(0.03, t0 + 0.12);
      ng.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      ng.connect(out);
      s.start(t0); s.stop(t0 + dur);
    }
  }

  /* ---- ঢাক: গভীর চামড়ার আঘাত + কাঠির ঝাপটা, উৎসবের ছন্দে ---- */
  function dhak(ac, out, t0) {
    var pat = [0, 0.28, 0.52, 0.66, 1.04, 1.32, 1.56, 1.70];
    var nb = noise(ac, 0.12);
    pat.forEach(function (off, i) {
      var t = t0 + off, big = (i % 4 === 0);
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(big ? 128 : 176, t);
      o.frequency.exponentialRampToValueAtTime(big ? 56 : 84, t + 0.14);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(big ? 0.32 : 0.2, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 0.34 : 0.2));
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + 0.4);
      if (nb) {
        var s = ac.createBufferSource(), ng = ac.createGain();
        s.buffer = nb;
        if (ac.createBiquadFilter) {
          var bp = ac.createBiquadFilter();
          bp.type = 'bandpass'; bp.frequency.value = big ? 900 : 1400; bp.Q.value = 1.1;
          s.connect(bp); bp.connect(ng);
        } else s.connect(ng);
        ng.gain.setValueAtTime(big ? 0.07 : 0.045, t);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        ng.connect(out);
        s.start(t); s.stop(t + 0.1);
      }
    });
  }

  /* ---- কাঁসর: ধাতব অমিলস্বরের ঝংকার, দুইবার আঘাত ---- */
  function kashar(ac, out, t0) {
    var parts = [[1, 0.17, 1.5], [2.42, 0.10, 1.2], [3.91, 0.065, 0.95], [5.6, 0.045, 0.75], [7.3, 0.028, 0.55]];
    [0, 0.46].forEach(function (off, n) {
      var t = t0 + off, base = 528 * (n ? 1.012 : 1);
      parts.forEach(function (p) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'square';
        o.frequency.value = base * p[0];
        if (ac.createBiquadFilter) {
          var hp = ac.createBiquadFilter();
          hp.type = 'highpass'; hp.frequency.value = 380;
          o.connect(hp); hp.connect(g);
        } else o.connect(g);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(p[1] * (n ? 0.8 : 1), t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
        g.connect(out);
        o.start(t); o.stop(t + p[2] + 0.05);
      });
    });
  }

  /* ---- ঘণ্টা: মন্দির-ঘণ্টার ধাতব ঝংকার, তিনবার দোলা ---- */
  function ganti(ac, out, t0) {
    var parts = [[1, 0.19, 2.4], [2.76, 0.09, 1.9], [5.4, 0.055, 1.4], [8.9, 0.03, 0.9]];
    var base = 588;
    [0, 0.85, 1.7].forEach(function (off, n) {
      var t = t0 + off, v = n === 0 ? 1 : (n === 1 ? 0.72 : 0.5);
      parts.forEach(function (p) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = n === 0 ? 'sine' : 'triangle';
        o.frequency.value = base * p[0] * (1 + n * 0.002);
        try { o.frequency.exponentialRampToValueAtTime(base * p[0] * 0.995, t + p[2]); } catch (e) { }
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(p[1] * v, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
        o.connect(g); g.connect(out);
        o.start(t); o.stop(t + p[2] + 0.05);
      });
    });
  }

  var FN = { shankha: shankha, ulu: ulu, dhak: dhak, kashar: kashar, ganti: ganti };

  function play(key) {
    var f = FN[key];
    if (!f) return false;
    var a = ctx();
    if (!a) return false;
    try {
      var out = bus(a, 0.9);
      f(a, out, (a.currentTime || 0) + 0.02);
      return true;
    } catch (e) { return false; }
  }

  /* ---- লুপ: একই ধ্বনি বারবার (নেট না থাকলে এই পথেই সব একসাথে বাজে) ---- */
  var loops = {};
  function startLoop(key) {
    if (loops[key]) return true;
    if (!FN[key]) return false;
    play(key);
    loops[key] = setInterval(function () { play(key); },
      Math.round(((NAD[key] || {}).dur || 2.5) * 1000));
    return true;
  }
  function stopLoop(key) {
    if (loops[key]) { clearInterval(loops[key]); delete loops[key]; }
  }
  function stopAllLoops() {
    Object.keys(loops).forEach(stopLoop);
  }
  function isLooping(key) { return !!loops[key]; }

  function prime() {
    var a = ctx();
    if (!a) return false;
    try {
      /* iOS/Chrome-এর “unlock”: নীরব এক ঝলক */
      var b = a.createBuffer(1, 1, a.sampleRate || 44100), s2 = a.createBufferSource();
      s2.buffer = b; s2.connect(a.destination); s2.start(0);
    } catch (e) { }
    return a.state !== 'suspended';
  }

  w.NAD_ENGINE = {
    play: play, has: function (k) { return !!FN[k]; }, prime: prime,
    startLoop: startLoop, stopLoop: stopLoop, stopAllLoops: stopAllLoops,
    isLooping: isLooping, loopCount: function () { return Object.keys(loops).length; }
  };

  /* =====================================================================
     NAD_PLAYER — ল্যাচিং (একবার চালু = বাজতেই থাকবে) ইউটিউব লুপ
     • সঙ্গে সঙ্গে এক আঘাত (primed AudioContext) — চাপের প্রতিক্রিয়া তৎক্ষণাৎ
     • ইউটিউব প্রস্তুত হলে সেটিই অনবরত বাজে; না হলে নিজের ধ্বনি লুপে চলে
     • একসঙ্গে যত খুশি ধ্বনি চালু রাখা যায়
     ===================================================================== */
  /* apiState: idle | loading | ready | fail */
  var apiState = { v: 'idle' };
  var players = {}, onSet = {}, synthOnly = {}, pending = {}, blocked = {}, warmed = {};
  var onChange = null, onNote = null;
  function notify() { if (typeof onChange === 'function') { try { onChange(); } catch (e) { } } }
  function note(msg) { if (typeof onNote === 'function') { try { onNote(msg); } catch (e) { } } }

  function hostEl() {
    var h = w.document && w.document.getElementById('nadHost');
    if (!h && w.document) {
      h = w.document.createElement('div');
      h.id = 'nadHost';
      h.setAttribute('aria-hidden', 'true');
      /* অফস্ক্রিন, কিন্তু শূন্য-মাপ নয় — ০×০ হলে কিছু ব্রাউজার চালায় না */
      h.style.cssText = 'position:fixed; left:-9999px; top:0; width:240px; height:150px; pointer-events:none; opacity:0.01; overflow:hidden';
      w.document.body.appendChild(h);
    }
    return h;
  }

  function loadApi(want) {
    if (apiState.v === 'ready' || apiState.v === 'fail') return want(apiState.v === 'ready');
    if (apiState.v === 'loading') { apiState.cbs.push(want); return; }
    var Y = w.YT;
    if (Y && Y.Player) { apiState.v = 'ready'; return want(true); }
    if (!w.document) { apiState.v = 'fail'; return want(false); }
    apiState.v = 'loading'; apiState.cbs = [want];
    var done = function (ok) {
      if (apiState.v !== 'loading') return;
      apiState.v = ok ? 'ready' : 'fail';
      var cbs = apiState.cbs || []; apiState.cbs = [];
      cbs.forEach(function (f) { try { f(ok); } catch (e) { } });
    };
    w.onYouTubeIframeAPIReady = function () { done(true); };
    try {
      var sc = w.document.createElement('script');
      sc.src = 'https://www.youtube.com/iframe_api';
      sc.async = true;
      sc.onerror = function () { done(false); };
      w.document.head.appendChild(sc);
    } catch (e) { return done(false); }
    setTimeout(function () { done(false); }, 4000);
  }

  function makeYT(key, cb, warm) {
    var id = 'nadp-' + key;
    var host = hostEl();
    var old = w.document.getElementById(id);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var d = w.document.createElement('div');
    d.id = id;
    d.style.cssText = 'width:240px; height:135px';
    host.appendChild(d);
    var vid = NAD_YT[key];
    try {
      players[key] = new w.YT.Player(id, {
        width: 240, height: 135,
        videoId: vid,
        playerVars: {
          autoplay: 1, loop: 1, playlist: vid, controls: 0, disablekb: 1,
          modestbranding: 1, rel: 0, playsinline: 1, iv_load_policy: 3, fs: 0,
          /* muted অবস্থায় প্রস্তুত করা হলে অটোপ্লে-নীতিতেও চলে */
          mute: warm ? 1 : 0
        },
        events: {
          onReady: function (e) {
            try {
              if (warm) {
                /* নীরব প্রস্তুতি — চাপের আগেই বাফার হয়ে চলতে থাকে */
                if (e.target.mute) e.target.mute();
                e.target.playVideo();
                warmed[key] = true;
                return;
              }
              if (e.target.unMute) e.target.unMute();
              if (e.target.setVolume) e.target.setVolume(100);
              e.target.playVideo();
            } catch (x) { }
          },
          onStateChange: function (e) {
            if (e.data === 1) { if (onSet[key]) { pending[key] = false; notify(); } }
            /* ভিডিও শেষ হলে আবার শুরু — নিরন্তর লুপ */
            if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (x) { } }
          },
          onError: function (e) {
            var code = e && e.data;
            blocked[key] = code || 1;
            var msg = (code === 101 || code === 150 || code === 153)
              ? 'ইউটিউব এখানে এই ভিডিওটি চালাতে দিচ্ছে না — নিচের “ইউটিউবে শুনুন” লিংক থেকে শুনুন'
              : 'ইউটিউব প্লেয়ার চালু হচ্ছিল না';
            if (cb) cb(false, msg); else notify();
          }
        }
      });
    } catch (e) { if (cb) cb(false, 'ইউটিউব প্লেয়ার তৈরি হচ্ছিল না'); }
  }

  function killPlayer(key) {
    var p = players[key];
    delete players[key];
    if (p) { try { p.destroy(); } catch (e) { try { p.stopVideo(); } catch (x) { } } }
    var el = w.document && w.document.getElementById('nadp-' + key);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* ইউটিউব না পারলে নিজের ধ্বনি — চালু-অবস্থা অটুট থাকে */
  function fallback(key, why) {
    if (!onSet[key]) return;
    synthOnly[key] = true; pending[key] = false;
    killPlayer(key);
    startLoop(key);
    notify();
    if (why) note(why + ' — অ্যাপের নিজের ধ্বনি চালু হলো');
  }

  /* ৩ সেকেন্ড পরপর দেখা: সত্যিই এগোচ্ছে কি না (ইউটিউবে শুরুতে নীরব অংশও থাকে) */
  function watchdog(key, n) {
    setTimeout(function () {
      if (!onSet[key]) return;
      var p = players[key];
      if (!p) return;                              /* ইতিমধ্যেই synth-এ নেমেছে */
      var st = -1, time = 0;
      try { st = p.getPlayerState ? p.getPlayerState() : -1; } catch (e) { st = -1; }
      try { time = p.getCurrentTime ? p.getCurrentTime() : 0; } catch (e) { time = 0; }
      if (st === 1 || st === 3 || st === 5 || time > 0.25) { pending[key] = false; notify(); return; }
      if (n < 3) return watchdog(key, n + 1);
      fallback(key, 'ইউটিউব ধ্বনি শুরু হচ্ছিল না');
    }, 3000);
  }

  /* আগেই (নীরব) তৈরি প্লেয়ারকে চাপের মধ্যেই শব্দসহ চালু */
  function activate(key) {
    var p = players[key];
    if (!p) return false;
    try { if (p.unMute) p.unMute(); if (p.setVolume) p.setVolume(100); } catch (e) { }
    try { p.playVideo(); } catch (e) { }
    /* কিছু ব্রাউজারে প্রথম unmute নিঃশব্দে হারায় — ৩০০ms পরে আরেকবার */
    setTimeout(function () { try { if (onSet[key]) { if (p.unMute) p.unMute(); if (p.setVolume) p.setVolume(100); p.playVideo(); } } catch (e) { } }, 300);
    return true;
  }

  /* পাঁচটি প্লেয়ার আগেই নীরব অবস্থায় তৈরি ও চালু করে রাখি (সবচেয়ে নির্ভরযোগ্য অটোপ্লে-কৌশল) */
  function warm() {
    loadApi(function (ready) {
      if (!ready) return;
      Object.keys(NAD_YT).forEach(function (k) {
        if (players[k]) return;
        makeYT(k, null, true);
      });
    });
  }

  function start(key) {
    if (!NAD[key]) return false;
    onSet[key] = true; synthOnly[key] = false; pending[key] = true;
    /* চাপের সঙ্গে সঙ্গে শুধু অডিও-কনটেক্সট প্রাইম (নীরব) — ধ্বনি আসবে
       ব্যবহারকারীর দেওয়া ইউটিউব লিংক থেকেই; synth কেবল শেষ উপায় */
    loadApi(function (ready) {
      if (!onSet[key]) return;
      if (!ready) { fallback(key, 'নেটে ইউটিউব পাওয়া যাচ্ছে না'); return; }
      if (players[key] && players[key].unMute && !blocked[key]) {
        /* প্রস্তুত প্লেয়ার — চাপের সঙ্গে সঙ্গেই শব্দ */
        activate(key); watchdog(key, 0); return;
      }
      makeYT(key, function (ok, why) {
        if (!onSet[key]) { killPlayer(key); return; }
        if (!ok) fallback(key, why);
      }, false);
      watchdog(key, 0);
    });
    return true;
  }

  function stop(key) {
    onSet[key] = false; pending[key] = false;
    stopLoop(key);
    var p = players[key];
    if (p && warmed[key] && !synthOnly[key]) {
      /* প্রস্তুত প্লেয়ারটি রেখে দিই — পরের চাপে সঙ্গে সঙ্গে বাজবে */
      try { p.mute(); p.pauseVideo(); } catch (e) { }
    } else {
      killPlayer(key);
    }
    notify();
  }

  function stopAll() {
    Object.keys(onSet).forEach(function (k) { onSet[k] = false; pending[k] = false; });
    Object.keys(players).forEach(killPlayer);
    stopAllLoops();
    notify();
  }

  w.NAD_PLAYER = {
    toggle: function (key) {
      if (onSet[key]) { stop(key); return false; }
      start(key); return true;
    },
    start: start, stop: stop, stopAll: stopAll,
    isOn: function (k) { return !!onSet[k]; },
    active: function () { return Object.keys(onSet).filter(function (k) { return onSet[k]; }); },
    mode: function (k) { return pending[k] ? 'pending' : (synthOnly[k] ? 'synth' : 'yt'); },
    ytIds: NAD_YT,
    /* পূজা-পর্দা খোলার সঙ্গে সঙ্গে ইউটিউব API টেনে রাখি — ট্যাপে দেরি হয় না */
    preload: function () { try { loadApi(function () { }); } catch (e) { } },
    /* নীরব প্রস্তুতি — ধ্বনি নয়, শুধু প্লেয়ার তৈরি */
    warm: function () { try { warm(); } catch (e) { } },
    time: function (k) { try { return players[k].getCurrentTime(); } catch (e) { return -1; } },
    blocked: function (k) { return !!blocked[k]; },
    set onChange(f) { onChange = f; },
    set onNote(f) { onNote = f; },
    _api: function () { return apiState.v; }
  };
})(typeof window !== 'undefined' ? window : this);
