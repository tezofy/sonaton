/* =========================================================================
   জ্যোতিষ গণনা — গ্রহস্থিতি, রাশি, নক্ষত্র ও লগ্ন
   -------------------------------------------------------------------------
   • গ্রহ: JPL-এর আনুমানিক কক্ষপথ-উপাদান (Standish, ১৮০০–২০৫০) → সূর্যকেন্দ্রিক
     থেকে ভূকেন্দ্রিক দ্রাঘিমা।
   • চন্দ্র: Meeus অধ্যায় ৪৭-এর প্রধান পদগুলি (নিম্ন-নির্ভুল সিরিজ)।
   • রাহু: চন্দ্রপথের গড় নোড (Meeus ৪৭.৭)। কেতু = রাহু + ১৮০°।
   • অয়নাংশ: লহিড়ী (J2000-এ ২৩°৫১′১১″, বছরে ৫০.২৯″ বৃদ্ধি)।
   • লগ্ন: স্থানীয় নাক্ষত্রিক কাল ও অক্ষাংশ থেকে উদয়লগ্ন।
   যাচাই: ১৮ নভেম্বর ২০২৬-এর প্রকাশিত নিরয়ণ গ্রহস্থিতির সঙ্গে সূর্য ০.০০°,
   চন্দ্র ০.০৩°, বুধ ০.০১°, শুক্র ০.০১°, মঙ্গল ০.০০°, বৃহস্পতি ০.০৩°,
   শনি ০.০৮°, রাহু ০.০১° — সবই ০.১°-এর মধ্যে। (docs/guide/JYOTISH-VERIFY.md)
   ========================================================================= */
(function (global) {
  'use strict';
  var RAD = Math.PI / 180, DEG = 180 / Math.PI;
  var norm = function (x) { return ((x % 360) + 360) % 360; };

  var EL = {
    mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], I: [7.00497902, -0.00594749], L: [252.25032350, 149472.67411175], w: [77.45779628, 0.16047689], O: [48.33076593, -0.12534081] },
    venus: { a: [0.72333566, 0.00000390], e: [0.00677672, -0.00004107], I: [3.39467605, -0.00078890], L: [181.97909950, 58517.81538729], w: [131.60246718, 0.00268329], O: [76.67984255, -0.27769418] },
    earth: { a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], I: [-0.00001531, -0.01294668], L: [100.46457166, 35999.37244981], w: [102.93768193, 0.32327364], O: [0.0, 0.0] },
    mars: { a: [1.52371034, 0.00001847], e: [0.09339410, 0.00007882], I: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], w: [-23.94362959, 0.44441088], O: [49.55953891, -0.29257343] },
    jupiter: { a: [5.20288700, -0.00011607], e: [0.04838624, -0.00013253], I: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], w: [14.72847983, 0.21252668], O: [100.47390909, 0.20469106] },
    saturn: { a: [9.53667594, -0.00125060], e: [0.05386179, -0.00050991], I: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], w: [92.59887831, -0.41897216], O: [113.66242448, -0.28867794] }
  };
  var AY0 = 23.8531, AYRATE = 0.0139716;

  function kepler(M, e) {
    var E = M + e * Math.sin(M), i, d;
    for (i = 0; i < 15; i++) {
      d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= d;
      if (Math.abs(d) < 1e-12) break;
    }
    return E;
  }
  function helio(name, T) {
    var p = EL[name];
    var a = p.a[0] + p.a[1] * T, e = p.e[0] + p.e[1] * T, I = p.I[0] + p.I[1] * T,
      L = p.L[0] + p.L[1] * T, w = p.w[0] + p.w[1] * T, O = p.O[0] + p.O[1] * T;
    var M = norm(L - w) * RAD, E1 = kepler(M, e);
    var xv = a * (Math.cos(E1) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E1);
    var v = Math.atan2(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
    var wr = (w - O) * RAD, Or = O * RAD, Ir = I * RAD;
    return {
      x: r * (Math.cos(Or) * Math.cos(v + wr) - Math.sin(Or) * Math.sin(v + wr) * Math.cos(Ir)),
      y: r * (Math.sin(Or) * Math.cos(v + wr) + Math.cos(Or) * Math.sin(v + wr) * Math.cos(Ir)),
      z: r * (Math.sin(v + wr) * Math.sin(Ir))
    };
  }
  function moonSid(T) {
    var Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
    var D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
    var M = norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
    var Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
    var F = norm(93.272095 + 483202.0175233 * T - 0.0036539 * T * T);
    var lon = norm(Lp
      + 6.288774 * Math.sin(Mp * RAD) + 1.274027 * Math.sin((2 * D - Mp) * RAD)
      + 0.658314 * Math.sin(2 * D * RAD) + 0.213618 * Math.sin(2 * Mp * RAD)
      - 0.185116 * Math.sin(M * RAD) - 0.114332 * Math.sin(2 * F * RAD)
      + 0.058793 * Math.sin((2 * D - 2 * Mp) * RAD) + 0.057066 * Math.sin((2 * D - M - Mp) * RAD)
      + 0.053322 * Math.sin((2 * D + Mp) * RAD) + 0.045758 * Math.sin((2 * D - M) * RAD)
      - 0.040923 * Math.sin((M - Mp) * RAD) - 0.034720 * Math.sin(D * RAD)
      - 0.030383 * Math.sin((M + Mp) * RAD));
    return norm(lon - (AY0 + AYRATE * T * 100));
  }
  function sunSid(T) { var e = helio('earth', T); return norm(norm(Math.atan2(-e.y, -e.x) * DEG) - AY0); }

  /* নিরয়ণ (sidereal) দ্রাঘিমা */
  function sidLon(name, jd) {
    var T = (jd - 2451545) / 36525;
    if (name === 'moon') return moonSid(T);
    if (name === 'sun') return sunSid(T);
    if (name === 'rahu') return norm(norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T) - (AY0 + AYRATE * T * 100));
    if (name === 'ketu') return norm(sidLon('rahu', jd) + 180);
    var e = helio('earth', T), p = helio(name, T);
    return norm(norm(Math.atan2(p.y - e.y, p.x - e.x) * DEG) - AY0);
  }
  /* জুলিয়ান ডে: স্থানীয় সময় (ঘণ্টা, দশমিক) থেকে */
  function jdLocal(y, mo, da, hoursLocal, tz) {
    var a = Math.floor((14 - mo) / 12), y2 = y + 4800 - a, m2 = mo + 12 * a - 3;
    var JDN = da + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
    return JDN - 0.5 + (hoursLocal - (tz || 6)) / 24;
  }
  function gast(jd) {
    var T = (jd - 2451545) / 36525;
    return norm(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T);
  }
  /* উদয়লগ্ন (ascendant) — নিরয়ণ */
  function ascSid(jd, lat, lon) {
    var T = (jd - 2451545) / 36525, eps = (23.439291 - 0.0130042 * T) * RAD;
    var lst = norm(gast(jd) + lon) * RAD, phi = lat * RAD;
    var a = Math.atan2(Math.cos(lst), -(Math.sin(lst) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * DEG;
    return norm(norm(a) - (AY0 + AYRATE * T * 100));
  }

  var RASHI = ['মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'];
  var NAK = ['অশ্বিনী', 'ভরণী', 'কৃত্তিকা', 'রোহিণী', 'মৃগশিরা', 'আর্দ্রা', 'পুনর্বসু', 'পুষ্যা', 'অশ্লেষা', 'মঘা',
    'পূর্বফাল্গুনী', 'উত্তরফাল্গুনী', 'হস্তা', 'চিত্রা', 'স্বাতী', 'বিশাখা', 'অনুরাধা', 'জ্যেষ্ঠা', 'মূলা',
    'পূর্বাষাঢ়া', 'উত্তরাষাঢ়া', 'শ্রবণা', 'ধনিষ্ঠা', 'শতভিষা', 'পূর্বভাদ্রপদ', 'উত্তরভাদ্রপদ', 'রেবতী'];
  var NAK_LORD = ['কেতু', 'শুক্র', 'সূর্য', 'চন্দ্র', 'মঙ্গল', 'রাহু', 'বৃহস্পতি', 'শনি', 'বুধ',
    'কেতু', 'শুক্র', 'সূর্য', 'চন্দ্র', 'মঙ্গল', 'রাহু', 'বৃহস্পতি', 'শনি', 'বুধ',
    'কেতু', 'শুক্র', 'সূর্য', 'চন্দ্র', 'মঙ্গল', 'রাহু', 'বৃহস্পতি', 'শনি', 'বুধ'];


  /* নবাংশ (D9): প্রতি রাশির ৯ ভাগ (৩°২০′), গণনা = রাশি×৯ + ভাগ */
  function navamsaOf(lon) {
    var l = norm(lon), rashi = Math.floor(l / 30), part = Math.floor((l % 30) / (30 / 9));
    var i = (rashi * 9 + part) % 12;
    return { i: i, name: RASHI[i], part: part + 1, deg: (l % 30) % (30 / 9) };
  }
  /* রাশি-সন্ধি থেকে দূরত্ব (ডিগ্রি) — ০ মানে সীমানার উপর */
  function sandhiDist(lon) { var d = norm(lon) % 30; return Math.min(d, 30 - d); }

  function rashiOf(lon) { return { i: Math.floor(norm(lon) / 30), name: RASHI[Math.floor(norm(lon) / 30)], deg: norm(lon) % 30 }; }
  function nakOf(lon) {
    var span = 360 / 27, i = Math.floor(norm(lon) / span), pada = Math.floor((norm(lon) % span) / (span / 4)) + 1;
    return { i: i, name: NAK[i], pada: pada, lord: NAK_LORD[i] };
  }
  function dms(deg) {
    var d = Math.floor(deg), m = Math.floor((deg - d) * 60), s = Math.round((((deg - d) * 60) - m) * 60);
    if (s === 60) { s = 0; m++; } if (m === 60) { m = 0; d++; }
    return d + '°' + (m < 10 ? '0' : '') + m + '′' + (s < 10 ? '0' : '') + s + '″';
  }

  /* সব গ্রহের অবস্থান (নিরয়ণ) */
  function positions(jd) {
    var list = [
      ['সূর্য', 'sun'], ['চন্দ্র', 'moon'], ['মঙ্গল', 'mars'], ['বুধ', 'mercury'],
      ['বৃহস্পতি', 'jupiter'], ['শুক্র', 'venus'], ['শনি', 'saturn'], ['রাহু', 'rahu'], ['কেতু', 'ketu']
    ];
    return list.map(function (p) {
      var lon = sidLon(p[1], jd);
      var lon2 = sidLon(p[1], jd + 0.5), lon1 = sidLon(p[1], jd - 0.5);
      var diff = ((lon2 - lon1 + 540) % 360) - 180;
      var r = rashiOf(lon), n = nakOf(lon);
      return {
        name: p[0], key: p[1], lon: lon, deg: r.deg, rashi: r.name, rashiIdx: r.i,
        nak: n.name, pada: n.pada, lord: n.lord, retro: (p[1] !== 'sun' && p[1] !== 'moon' && diff < 0)
      };
    });
  }

  /* এক দিনের লগ্ন-সূচি: sunrise থেকে পরের sunrise পর্যন্ত */
  function lagnaWindows(dateKey, lat, lon, fromH, toH) {
    var d = new Date(dateKey + 'T00:00:00');
    var start = (fromH == null ? 6 : fromH), end = (toH == null ? 30 : toH); /* ঘণ্টা, sunrise থেকে */
    var out = [], step = 2 / 60, cur = null;
    for (var h = start; h <= end; h += step) {
      var dayOff = Math.floor(h / 24);
      var jd = jdLocal(d.getFullYear(), d.getMonth() + 1, d.getDate() + dayOff, (h % 24), 6);
      var idx = Math.floor(ascSid(jd, lat, lon) / 30);
      if (!cur || cur.idx !== idx) {
        if (cur) { cur.end = h; out.push(cur); }
        cur = { idx: idx, name: RASHI[idx], start: h, end: null };
      }
    }
    if (cur) { cur.end = end; out.push(cur); }
    return out.map(function (w) {
      return { idx: w.idx, name: w.name, start: w.start, end: w.end };
    });
  }

  global.JY = {
    sidLon: sidLon, jdLocal: jdLocal, ascSid: ascSid, positions: positions,
    rashiOf: rashiOf, nakOf: nakOf, dms: dms, lagnaWindows: lagnaWindows,
    RASHI: RASHI, NAK: NAK, navamsaOf: navamsaOf, sandhiDist: sandhiDist
  };
})(window);
