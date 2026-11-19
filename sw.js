/* সনাতন বিদ্যাপীঠ — অফলাইন service worker
   কৌশল: cache-first + background refresh. অ্যাপের সব ফাইল প্রথম দেখাতেই ক্যাশ হয়,
   তাই নেট না থাকলেও অ্যাপ পুরোপুরি চলে। */
const CACHE = 'sanatana-v86-sun-fixed';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* কৌশল:
   • নেভিগেশন/HTML, CSS, JS, JSON, sw — network-first (আপডেট সঙ্গে সঙ্গে দেখা যায়)
   • ছবি/ফন্ট — cache-first (দ্রুত, অফলাইনেও চলে)
   • নেট না থাকলে সব ক্ষেত্রেই ক্যাশ থেকে */
const NET_FIRST_EXT = ['/', '.html', '.htm', '.js', '.css', '.json', '.webmanifest'];

/* ক্যাশে পড়া তবেই কাজে লাগাই যখন সেটি সফল (৪০৪ ক্যাশ হয়ে ছবি আটকে থাকবে না) */
async function matchOk(cache, req) {
  for (const opt of [{}, { ignoreSearch: true }]) {
    const hit = await cache.match(req, opt);
    if (hit && hit.ok) return hit;
  }
  return null;
}

function isNetworkFirst(url) {
  if (url.pathname.endsWith('/')) return true;
  if (url.pathname.endsWith('/sw.js')) return true;
  const p = url.pathname.toLowerCase();
  return NET_FIRST_EXT.some(ext => p.endsWith(ext));
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const offline = async () => {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const shell = (await cache.match('./index.html')) || (await cache.match('./'));
      return shell || new Response('অফলাইন — ফাইলটি এখনো ক্যাশ হয়নি।', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    };

    if (!isNetworkFirst(url)) {
      const hit = await matchOk(cache, req);
      if (hit) {
        fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); }).catch(() => {});
        return hit;
      }
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) { return offline(); }
    }

    /* network-first */
    try {
      const res = await fetch(req, { cache: 'no-store' });
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (e) { return offline(); }
  })());
});

/* রিমাইন্ডার: পেজ থেকে পোস্ট করা হলে নোটিফিকেশন দেখায় */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./index.html#/panjika');
  }));
});
