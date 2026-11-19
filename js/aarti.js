/* =====================================================================
   সনাতন বিদ্যাপীঠ — প্রতিটি দেবতার আরতি (কথা + সুর)
   ---------------------------------------------------------------------
   • AARTI[id] = { t, own, src, yt, bpm, root, scale, mel, mel2, lines[] }
       yt: ইউটিউব ভিডিও-আইডি (যাচাই করা); খালি হলে শুধু সার্চ-লিংক দেখানো হয়
       own:true  → দেবতার নিজের প্রচলিত আরতি (লোক-পরম্পরা)
       own:false → দেবতার নামে রচিত ছয় পঙক্তির নাম-আরতি
                   (সর্বত্র একই প্রচলিত পাঠ পাওয়া যায় না, তাই সৎভাবে আলাদা করা)
   • AARTI_ENGINE = Web Audio দিয়ে তানপুরা · মঞ্জীরা · ঢোল · হারমোনিয়ামের
     ধ্বনি অ্যাপের ভেতরেই তৈরি করে। কোনো বাইরের অডিও ফাইল ডাউনলোড হয় না।
   ===================================================================== */
(function (w) {
  'use strict';

  /* সুর-পরিবার (রাগ-ধাঁচ) — সপ্তকের অর্ধস্বর (semitone) দূরত্ব */
  var SC = {
    bilawal: [0, 2, 4, 5, 7, 9, 11],
    bhairav: [0, 1, 4, 5, 7, 8, 11],
    bhairavi: [0, 1, 3, 5, 7, 8, 10],
    kafi: [0, 2, 3, 5, 7, 9, 10],
    yaman: [0, 2, 4, 6, 7, 9, 11],
    asavari: [0, 2, 3, 5, 7, 8, 10]
  };
  /* সুরের নকশা — ৮ মাত্রার একটি পঙক্তি */
  var M1 = [3, 4, 5, 4, 3, 2, 1, 0];
  var M2 = [4, 5, 6, 5, 4, 3, 2, 1];
  var M3 = [2, 3, 4, 3, 5, 4, 3, 2];
  var M4 = [0, 2, 4, 5, 4, 2, 1, 0];
  var M5 = [5, 4, 3, 4, 5, 6, 4, 3];
  var M6 = [1, 2, 4, 3, 2, 0, 1, 2];

  var A = {
    ganesh: {
      yt: 'mI83z5Se86s',
      t: 'জয় গণেশ জয় গণেশ', own: true, src: 'প্রচলিত গণেশ আরতি',
      bpm: 80, root: 261.63, scale: SC.bilawal, mel: M1, mel2: M4,
      lines: [
        'জয় গণেশ জয় গণেশ, জয় গণেশ দেবা',
        'মাতা জগজ্জননী, পিতা মহাদেবা',
        'একদন্ত দয়াবন্ত, চারভুজধারী',
        'মাথায় সিঁদুর সোহে, মুষিক-সওয়ারী',
        'রিদ্ধি-সিদ্ধি দায়িনী, তুমিই জানো সবে',
        'প্রথমে তোমায় পূজি, তবে পূজি দেবে'
      ]
    },
    shiva: {
      yt: 'Nez2MeZB7rk',
      t: 'ওঁ জয় শিব ওঙ্কার', own: true, src: 'প্রচলিত শিব আরতি',
      bpm: 68, root: 220.00, scale: SC.bhairav, mel: M3, mel2: M6,
      lines: [
        'ওঁ জয় শিব ওঙ্কার, স্বামী জয় শিব ওঙ্কার',
        'ব্রহ্মা বিষ্ণু সদাশিব, অর্ধাঙ্গী-সঙ্গে',
        'একানন চতুরানন, পঞ্চানন রাজে',
        'গণেশ-কার্তিক-গণ, নন্দী-গণ সাজে',
        'গঙ্গাধর শশিধর, চন্দ্রকলা-ধারী',
        'জটাজুটে সর্পমালা, ডমরু-ত্রিশূলধারী'
      ]
    },
    durga: {
      yt: 's-JQAj9GyzU',
      t: 'জয় জয় দুর্গা মাতা', own: false, src: 'নাম-আরতি (দুর্গার নামে রচিত)',
      bpm: 76, root: 246.94, scale: SC.bhairavi, mel: M2, mel2: M5,
      lines: [
        'জয় জয় দুর্গা মাতা, জগতের তারিণী',
        'চণ্ডী মহিষমর্দিনী, শুম্ভ-নাশিনী',
        'শৈলসুতা নবদুর্গা, নবরূপে সতী',
        'ত্রিশূল-খড়্গধারিণী, সিংহে আরোহিণী',
        'দুঃখ হরো মা, শরণাগত-তারিণী',
        'ভক্তজনে রাখো মা, জয় জগদম্বে'
      ]
    },
    kali: {
      yt: 'uTW81YtFaMY',
      t: 'জয় কালী মাতা', own: false, src: 'নাম-আরতি (কালীর নামে রচিত)',
      bpm: 66, root: 207.65, scale: SC.bhairav, mel: M3, mel2: M1,
      lines: [
        'জয় জয় কালী মাতা, কালরাত্রি রূপা',
        'শ্যামবর্ণা মুক্তকেশী, মুণ্ডমালাধরা',
        'ডাকিনী-যোগিনী-সঙ্গে, শ্মশানে বিহারিণী',
        'ভয় হরো মা শ্যামা, সদা করুণাময়ী',
        'সন্তানে রাখো মা, সদা জগদম্বে',
        'জয় কালী জয় শ্যামা, জয় তারা মাতা'
      ]
    },
    lakshmi: {
      yt: 'LUO2nYyyRzU',
      t: 'জয় লক্ষ্মী মাতা', own: false, src: 'নাম-আরতি (লক্ষ্মীর নামে রচিত)',
      bpm: 78, root: 293.66, scale: SC.kafi, mel: M1, mel2: M4,
      lines: [
        'জয় লক্ষ্মী মাতা, শুভফলদাত্রী',
        'কমলাসনা কমলহস্তা, কাঞ্চনবর্ণা',
        'ক্ষীর-শরীরা হেমবরণা, পদ্মে বিভূষিতা',
        'চন্দ্রা-সহস্রধরা, সুর-নর-বন্দিতা',
        'রিদ্ধি-সিদ্ধি দায়িনী, দারিদ্র্যনাশিনী',
        'জয় জয় মহালক্ষ্মী, শরণে রাখো মা'
      ]
    },
    saraswati: {
      yt: 'S7-C4Vu7Mks',
      t: 'জয় সরস্বতী মাতা', own: false, src: 'নাম-আরতি (সরস্বতীর নামে রচিত)',
      bpm: 74, root: 329.63, scale: SC.yaman, mel: M5, mel2: M2,
      lines: [
        'জয় সরস্বতী মাতা, বিদ্যাদায়িনী',
        'শ্বেতপদ্মাসনা, শ্বেতবর্ণা সুরনন্দিনী',
        'বীণা-পুস্তকধারিণী, মণিমুকুট শোভে',
        'হংসবাহনা দেবী, বাগ্দেবী জ্ঞানদায়িনী',
        'অবিদ্যার আঁধার হরো, জ্ঞানের দীপ জ্বেলো',
        'জয় জয় সরস্বতী, বন্দে জগন্মাতা'
      ]
    },
    krishna: {
      yt: '-Y7PfnTcORQ',
      t: 'জয় জয় রাধাকৃষ্ণ', own: false, src: 'নাম-আরতি (কৃষ্ণের নামে রচিত)',
      bpm: 72, root: 261.63, scale: SC.kafi, mel: M4, mel2: M6,
      lines: [
        'জয় জয় রাধাকৃষ্ণ, যুগল-কিশোর',
        'যমুনার তীরে বাঁশি, ডাকে ব্রজভূমি',
        'গিরিধর মুরলীধর, গোপাল প্রেমসিন্ধু',
        'আরতির প্রদীপ ঘুরে, ব্রজের হৃদয়ে',
        'গীতার জ্ঞানে তুমি, ধর্মের পথ দেখালে',
        'জয় জয় নন্দনন্দন, শরণে রাখো হরি'
      ]
    },
    ram: {
      yt: 'Yq56F5gD7Uw',
      t: 'জয় জয় রঘুকুলেশ', own: false, src: 'নাম-আরতি (রামের নামে রচিত)',
      bpm: 74, root: 246.94, scale: SC.bilawal, mel: M1, mel2: M3,
      lines: [
        'জয় জয় রঘুকুলেশ, মর্যাদাপুরুষ',
        'সীতানাথ ধর্মরক্ষী, সত্যব্রতধারী',
        'দশরথের নন্দন, ধনুর্ধর বীর',
        'বনবাসী ঋষিপালক, দীনজনপ্রিয়',
        'রাবণ-সংহারী, লক্ষ্মণ-সঙ্গী',
        'জয় শ্রীরাম জয়রাম, স্মরণে মঙ্গল'
      ]
    },
    hanuman: {
      yt: '4wL-g-DkUiE',
      t: 'জয় জয় হনুমান', own: false, src: 'নাম-আরতি (হনুমানের নামে রচিত)',
      bpm: 84, root: 246.94, scale: SC.bhairav, mel: M2, mel2: M5,
      lines: [
        'জয় জয় হনুমান, সংকটমোচন',
        'রামদূত বীর, রামনামে মগ্ন',
        'অঞ্জনী-নন্দন, মহাবল-ধারী',
        'সঞ্জীবনী লতা আনি, প্রাণ বাঁচালে',
        'রুদ্ররূপে দুরাচার, দলন করিয়া',
        'জয় বজরঙ্গবলী, শরণে রাখো'
      ]
    },
    surya: {
      yt: '-75z0RvJ9RM',
      t: 'ওঁ জয় সূর্য দেব', own: false, src: 'নাম-আরতি (সূর্যের নামে রচিত)',
      bpm: 76, root: 293.66, scale: SC.yaman, mel: M3, mel2: M1,
      lines: [
        'ওঁ জয় সূর্য দেব, তেজের দেবতা',
        'সাত ঘোড়ার রথে, প্রতি প্রভাতে',
        'প্রভাকর দিবাকর, আঁধার-নাশন',
        'আরোগ্যের দাতা, নয়নের আলো',
        'গায়ত্রীর দেবতা, ঋষি-মুনি-বন্দিত',
        'জয় জয় সূর্য নারায়ণ, স্মরণে শান্তি'
      ]
    },
    ganga: {
      yt: '6Pw670G6ogQ',
      t: 'জয় জয় গঙ্গা মাতা', own: false, src: 'নাম-আরতি (গঙ্গার নামে রচিত)',
      bpm: 70, root: 220.00, scale: SC.asavari, mel: M4, mel2: M2,
      lines: [
        'জয় জয় গঙ্গা মাতা, মোক্ষপ্রদায়িনী',
        'শিবের জটা হতে, ধারায় নেমে আসো',
        'ভগীরথের তপে, ধরায় নামিলে',
        'পাপ হরো মা, স্নানে পুণ্য দাও',
        'ত্রিবেণী-সঙ্গমে, শান্তি-সুধা বরষো',
        'জয় জয় ভাগীরথী, শরণে রাখো মা'
      ]
    },
    satyanarayan: {
      yt: 'P94mKqVI9IM',
      t: 'জয় জয় সত্যনারায়ণ', own: false, src: 'নাম-আরতি (সত্যনারায়ণের নামে রচিত)',
      bpm: 72, root: 261.63, scale: SC.bilawal, mel: M1, mel2: M6,
      lines: [
        'জয় জয় সত্যনারায়ণ, কল্যাণব্রত-দেব',
        'সত্যের পূজা যেথা, সেথা তুমি হাসো',
        'পঞ্চতীর্থে পূজা, কথায় মধুর',
        'ভক্তের সংকল্প, সফল করিয়া',
        'শান্তি-সমৃদ্ধি দাও, ঘরে ঘরে প্রভু',
        'জয় জয় নারায়ণ, স্মরণে মুক্তি'
      ]
    },
    manasa: {
      yt: 'sp31XSNla24',
      t: 'জয় জয় মনসা মাতা', own: false, src: 'নাম-আরতি (মনসার নামে রচিত)',
      bpm: 72, root: 233.08, scale: SC.asavari, mel: M3, mel2: M5,
      lines: [
        'জয় জয় মনসা মাতা, সর্পদেবী',
        'পদ্ম-আসনে বিরাজো, নাগগণ-সঙ্গে',
        'বিষ-ভয় হরো মা, রক্ষা করো ঘরে',
        'শান্তি-সম্পদ দাও, সন্তানে মঙ্গল',
        'ভাদ্রের সংক্রান্তি, তোমার পূজা',
        'জয় জয় পদ্মাবতী, শরণে রাখো মা'
      ]
    },
    shasti: {
      yt: '',            /* যাচাই করা ভিডিও পাওয়া যায়নি — শুধু সার্চ-লিংক */
      t: 'জয় ষষ্ঠী মাতা', own: false, src: 'নাম-আরতি (ষষ্ঠীর নামে রচিত)',
      bpm: 76, root: 277.18, scale: SC.kafi, mel: M5, mel2: M4,
      lines: [
        'জয় ষষ্ঠী মাতা, সন্তান-রক্ষিণী',
        'কচি মুখে হাসি, দাও মা স্নেহে',
        'গর্ভিণী-পালিনী, শুভলগ্ন-দাত্রী',
        'আয়ু-স্বাস্থ্য দাও, কুমার-কুমারী',
        'চাঁদের স্নিগ্ধ আলো, তব অনুগ্রহ',
        'জয় জয় মহাষষ্ঠী, শরণে রাখো'
      ]
    },
    shitala: {
      yt: '',            /* যাচাই করা ভিডিও পাওয়া যায়নি — শুধু সার্চ-লিংক */
      t: 'জয় শীতলা মাতা', own: false, src: 'নাম-আরতি (শীতলার নামে রচিত)',
      bpm: 70, root: 246.94, scale: SC.asavari, mel: M6, mel2: M3,
      lines: [
        'জয় শীতলা মাতা, রোগমোচনী',
        'শীতল-জল লয়ে, শান্তি বরষো',
        'গুটিকা-হস্তে, ভক্তের রক্ষা',
        'জ্বর-ব্যাধি হরো, ঘরে সুস্থতা',
        'আশ্বিনে পূজি আমি, নিষ্ঠা-ভরে',
        'জয় জয় ঠাকুরানি, শরণে রাখো মা'
      ]
    },
    annapurna: {
      yt: 'CIOnxeEck9s',
      t: 'জয় অন্নপূর্ণা মাতা', own: false, src: 'নাম-আরতি (অন্নপূর্ণার নামে রচিত)',
      bpm: 74, root: 261.63, scale: SC.kafi, mel: M1, mel2: M5,
      lines: [
        'জয় অন্নপূর্ণা মাতা, অন্নদাত্রী',
        'ভিক্ষার পাত্র ভরে, তব কৃপায়',
        'কাশীর ঘাটে, দান-পুণ্য যেথা',
        'ক্ষুধা হরো মা, শরণাগত-তারিণী',
        'হেমবর্ণা হরিহস্তা, ভব-মাতা',
        'জয় জয় জগদম্বে, শরণে রাখো'
      ]
    },
    bishwakarma: {
      yt: 'dj-cVZm6ZSo',
      t: 'জয় বিশ্বকর্মা দেব', own: false, src: 'নাম-আরতি (বিশ্বকর্মার নামে রচিত)',
      bpm: 80, root: 293.66, scale: SC.bilawal, mel: M2, mel2: M6,
      lines: [
        'জয় বিশ্বকর্মা দেব, শিল্প-স্রষ্টা',
        'ঋষি-দিব্য-দৃষ্টি, তব কৃপায়',
        'রথ-নগর-মন্দির, তব হাতে গড়া',
        'কর্মে সিদ্ধি দাও, দক্ষতা বাড়াও',
        'ভাদ্র-সংক্রান্তিতে, পূজি তোমায়',
        'জয় জয় দেবশিল্পী, শরণে রাখো'
      ]
    },
    bhairav: {
      yt: 'bOFMYCNcagw',
      t: 'জয় বটুক ভৈরব', own: false, src: 'নাম-আরতি (ভৈরবের নামে রচিত)',
      bpm: 68, root: 196.00, scale: SC.bhairav, mel: M3, mel2: M1,
      lines: [
        'জয় বটুক ভৈরব, শিবের রক্ষক',
        'শ্বান-সঙ্গী দণ্ডপাণি, ভয়-নাশন',
        'কাশীর দ্বার-রক্ষী, দেব-রক্ষক',
        'ভক্তের বিপদ, দূর করিয়া',
        'অশুভ-দৃষ্টি হরো, শান্তি দাও',
        'জয় জয় ভৈরবনাথ, শরণে রাখো'
      ]
    },
    kartik: {
      yt: 'sOsQIB21wS0',
      t: 'জয় কার্তিক দেব', own: false, src: 'নাম-আরতি (কার্তিকের নামে রচিত)',
      bpm: 78, root: 261.63, scale: SC.yaman, mel: M4, mel2: M2,
      lines: [
        'জয় কার্তিক দেব, দেব-সেনাপতি',
        'ময়ূর-বাহনে, শক্তি-ধারী',
        'তারকাসুর-নাশী, দেব-সেনানী',
        'ভক্তের গৃহে, জ্যোতি জ্বেলো',
        'কার্তিক-পূর্ণিমায়, দীপ 함께',
        'জয় জয় ষড়ানন, শরণে রাখো'
      ]
    },
    tulsi: {
      yt: 'o0wNmCYzj-c',
      t: 'জয় তুলসী মাতা', own: false, src: 'নাম-আরতি (তুলসীর নামে রচিত)',
      bpm: 72, root: 329.63, scale: SC.bilawal, mel: M1, mel2: M3,
      lines: [
        'জয় তুলসী মাতা, পুণ্য-বৃক্ষা',
        'বিষ্ণুর প্রিয়া, ভক্তির প্রতিমা',
        'প্রতিদিন সেবিলে, পাপ হরো',
        'জল আর প্রদীপ, তোমায় অর্পি',
        'তুলসী-দল দিলে, হরির প্রীতি',
        'জয় জয় বৃন্দা-দেবী, শরণে রাখো'
      ]
    }
  };

  /* দেবতার আরতি না থাকলে গণেশের আরতি নয় — সৎভাবে বন্ধ থাকবে */
  function get(id) { return A[id] || null; }

  w.AARTI = A;
  w.aartiGet = get;

  /* =================================================================
     সুর-ইঞ্জিন — সব ধ্বনি এখানেই তৈরি হয় (তানপুরা, মঞ্জীরা, ঢোল, সুর)
     ================================================================= */
  var ST = {
    ac: null, master: null, playing: false, id: null, line: 0,
    elapsed: 0, total: 0, timers: [], tickT: null, hooks: {}, err: ''
  };

  function nowMs() { return (w.performance && w.performance.now) ? w.performance.now() : Date.now(); }

  function state() {
    return { playing: ST.playing, id: ST.id, line: ST.line, elapsed: ST.elapsed, total: ST.total, err: ST.err || '' };
  }

  function killTimers() {
    ST.timers.forEach(function (t) { clearTimeout(t); });
    ST.timers = [];
    if (ST.tickT) { clearInterval(ST.tickT); ST.tickT = null; }
  }

  function stop() {
    killTimers();
    var ac = ST.ac, m = ST.master;
    if (m && ac) {
      try {
        m.gain.cancelScheduledValues(ac.currentTime);
        m.gain.setValueAtTime(m.gain.value || 0.0001, ac.currentTime);
        m.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.18);
      } catch (e) { }
    }
    if (ac) ST.timers.push(setTimeout(function () {
      try { if (ac.close && ac.state !== 'closed') ac.close(); } catch (e) { }
    }, 240));
    ST.ac = null; ST.master = null;
    ST.playing = false; ST.line = 0; ST.elapsed = 0;
    ST.hooks = {};
  }

  function freq(root, semi) { return root * Math.pow(2, semi / 12); }

  /* একটানা তানপুরা-ঝংকার + হালকা কম্পন */
  function drone(ac, out, root, t0, dur) {
    [[-12, 0.030], [0, 0.045], [7, 0.030]].forEach(function (pair, i) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle';
      o.frequency.value = freq(root, pair[0]);
      if (o.detune) o.detune.value = (i - 1) * 4;
      g.gain.value = pair[1];
      if (ac.createBiquadFilter) {
        var lp = ac.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 1200; lp.Q.value = 0.7;
        o.connect(lp); lp.connect(g);
      } else o.connect(g);
      g.connect(out);
      o.start(t0); o.stop(t0 + dur + 0.4);
      /* ধীরে শ্বাস নেওয়ার মতো ওঠা-নামা */
      try {
        var lfo = ac.createOscillator(), lg = ac.createGain();
        lfo.type = 'sine'; lfo.frequency.value = 4.6 + i * 0.3;
        lg.gain.value = pair[1] * 0.45;
        lfo.connect(lg); lg.connect(g.gain);
        lfo.start(t0); lfo.stop(t0 + dur + 0.4);
      } catch (e) { }
    });
  }

  /* তানপুরার ঝংকৃত তার */
  function pluck(ac, out, f, t, vol) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 1.6);
  }

  /* মঞ্জীরা — ঝিরঝিরে ধাতব ঝংকার */
  function manjira(ac, out, buf, t, vol) {
    if (!buf) return;
    var s = ac.createBufferSource(), g = ac.createGain();
    s.buffer = buf;
    if (ac.createBiquadFilter) {
      var hp = ac.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 4200;
      s.connect(hp); hp.connect(g);
    } else s.connect(g);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    g.connect(out);
    s.start(t); s.stop(t + 0.12);
  }

  /* ঢোল/খোল — মাত্রার প্রথমে গভীর আঘাত */
  function dhol(ac, out, t, vol) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(96, t);
    o.frequency.exponentialRampToValueAtTime(58, t + 0.16);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 0.34);
  }

  /* হারমোনিয়ামের সুর — নরম আঘাত, সামান্য কম্পন */
  function note(ac, out, f, t, dur, vol) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.035);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out);
    try {
      var v = ac.createOscillator(), vg = ac.createGain();
      v.type = 'sine'; v.frequency.value = 5.2; vg.gain.value = f * 0.004;
      v.connect(vg); vg.connect(o.frequency);
      v.start(t); v.stop(t + dur + 0.05);
    } catch (e) { }
    /* সঙ্গে পঞ্চমের হালকা সমর্থন */
    var o2 = ac.createOscillator(), g2 = ac.createGain();
    o2.type = 'sine'; o2.frequency.value = f * 1.5;
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(vol * 0.32, t + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o2.connect(g2); g2.connect(out);
    o2.start(t); o2.stop(t + dur + 0.05);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function bell(ac, out, t, vol) {
    [[587.33, 0.20, 2.2], [880, 0.12, 1.8], [1318.5, 0.06, 1.3]].forEach(function (p, i) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.setValueAtTime(p[0], t);
      try { o.frequency.exponentialRampToValueAtTime(p[0] * 0.996, t + p[2]); } catch (e) { }
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(p[1] * (vol || 1), t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + p[2] + 0.1);
    });
  }

  function noiseBuffer(ac, sec) {
    try {
      var n = Math.max(1, Math.floor((ac.sampleRate || 44100) * sec));
      var b = ac.createBuffer(1, n, ac.sampleRate || 44100);
      var d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      return b;
    } catch (e) { return null; }
  }

  /* সুর বাজানো — পঙক্তি ধরে ধরে, সব সময়সূচি আগেই বসানো হয় */
  function build(ac, a, beat, lineDur) {
    var master = ac.createGain();
    master.gain.value = 0.85;
    if (ac.createDynamicsCompressor && ac.createDynamicsCompressor) {
      var comp = ac.createDynamicsCompressor();
      try {
        comp.threshold.value = -18; comp.knee.value = 24; comp.ratio.value = 3.2;
        comp.attack.value = 0.006; comp.release.value = 0.24;
      } catch (e) { }
      master.connect(comp); comp.connect(ac.destination);
    } else master.connect(ac.destination);
    ST.master = master;

    var t0 = (ac.currentTime || 0) + 0.09;
    var dur = lineDur * a.lines.length;
    var root = a.root || 261.63;
    var scale = a.scale || SC.bilawal;
    var nb = noiseBuffer(ac, 0.14);

    drone(ac, master, root, t0, dur);
    bell(ac, master, t0, 0.55);

    a.lines.forEach(function (ln, L) {
      var tL = t0 + L * lineDur;
      var pattern = (L % 2 ? (a.mel2 || M4) : (a.mel || M1));
      var oct = (L % 4 >= 2) ? 12 : 0;
      for (var b = 0; b < 8; b++) {
        var tb = tL + b * beat;
        var mi = pattern[b % pattern.length];
        var f = freq(root, scale[mi % scale.length] + oct);
        note(ac, master, f, tb, beat * 0.95, 0.075);
        manjira(ac, master, nb, tb, 0.035);
        if (b === 0 || b === 4) dhol(ac, master, tb, 0.10);
        if (b === 0) pluck(ac, master, freq(root, -12), tb, 0.045);
        if (b === 3) pluck(ac, master, freq(root, 0), tb, 0.030);
        if (b === 6) pluck(ac, master, freq(root, 7), tb, 0.026);
      }
    });
    bell(ac, master, t0 + dur - beat, 0.5);
  }

  function play(id, hooks) {
    var a = A[id];
    if (!a) return false;
    stop();
    ST.hooks = hooks || {}; ST.err = '';
    ST.id = id; ST.playing = true; ST.line = 0; ST.elapsed = 0;
    var beat = 60 / (a.bpm || 72);
    var lineDur = beat * 8;
    ST.total = Math.round(lineDur * a.lines.length * 1000);

    var AC = w.AudioContext || w.webkitAudioContext;
    if (AC) {
      try {
        var ac = new AC();
        ST.ac = ac;
        if (ac.state === 'suspended' && ac.resume) ac.resume();
        build(ac, a, beat, lineDur);
      } catch (e) { ST.ac = null; ST.err = (e && e.message) || String(e); }
    }

    a.lines.forEach(function (ln, i) {
      ST.timers.push(setTimeout(function () {
        ST.line = i;
        if (ST.hooks.onLine) ST.hooks.onLine(i, ln);
      }, Math.round(i * lineDur * 1000)));
    });

    ST.tickT = setInterval(function () {
      if (!ST.playing) return;
      ST.elapsed = Math.min(ST.total, ST.elapsed + 200);
      if (ST.hooks.onTick) ST.hooks.onTick(ST.elapsed, ST.total);
    }, 200);

    ST.timers.push(setTimeout(function () {
      var h = ST.hooks;
      ST.playing = false;
      ST.line = a.lines.length;
      ST.elapsed = ST.total;
      var ac2 = ST.ac;
      if (h.onTick) h.onTick(ST.total, ST.total);
      if (ac2) ST.timers.push(setTimeout(function () {
        try { if (ac2.close && ac2.state !== 'closed') ac2.close(); } catch (e) { }
      }, 2200));
      ST.ac = null; ST.master = null;
      if (h.onEnd) h.onEnd();
    }, ST.total + 400));

    return true;
  }

  w.AARTI_ENGINE = {
    play: play, stop: stop, state: state, has: function (id) { return !!A[id]; }
  };
})(typeof window !== 'undefined' ? window : this);
