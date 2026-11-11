---
name: chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms
description: Chrome Manifest V3 extension service worker terminates after ~30s inactivity, losing all in-memory/global state and clearing setTimeout/setInterval. Cause: MV3 design (ephemeral SW, not persistent background page). Fix: persist with chrome.storage, schedule with chrome.alarms.
id: chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms
type: playbook
stack: Chrome extension Manifest V3, service worker, chrome.storage, chrome.alarms (Chrome 110+)
confirmed_on: 2026-11-11
confidence: high (official docs; sandbox simulation of state loss)
triggers:
  - chrome extension service worker dies after 30 seconds
  - MV3 background script state lost on idle
  - setInterval not firing in chrome extension background
  - chrome.runtime.sendMessage fails because SW terminated
  - in-memory variable resets in service worker
  - manifest v3 service worker terminated idle
  - chrome alarms instead of setTimeout
  - SW dies and loses data chrome extension
  - service worker not persistent MV3
  - chrome.storage.local.get after idle works but global no
related:
  - none close
---

# Chrome MV3 service worker 30s idle'da o'ladi, in-memory holat yo'qoladi

## TL;DR
Simptom: extension ishlaydi, keyin 30s hech narsa bo'lmasa SW o'ladi; global o'zgaruvchilar, setTimeout/setInterval yo'qoladi; keyingi event yangi SW'da boshlanadi, eski state yo'q.
Sabab: MV3'da background — ephemeral service worker (MV2 persistent page emas). Chrome 30s inactivity'dan keyin terminate qiladi.
Birinchi buyruq (chrome://extensions → Inspect service worker, Console):
`chrome.storage.local.get(null, console.log)`
Done: state chrome.storage'da saqlanadi, alarms ishlaydi, idle'dan keyin ham to'g'ri.

## Qachon ishlatish / ishlatmaslik
Ishlat: MV3 extension'da background SW'da state/timer yo'qoladi, 30s+ idle'dan keyin.
Ishlatma: MV2 (persistent background page); content script / popup / offscreen document ichidagi state (ularning o'z hayot tsikli); fetch() 30s+ javob (alohida timeout); 5min+ single request.

## Mental model (nima uchun)
[SRC:https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle @ 2023-05-02] "After 30 seconds of inactivity. Receiving an event or calling an extension API resets this timer."
MV3 resource tejash uchun SW ephemeral. Global/let/var — faqat shu SW instance hayotida. Terminate → hammasi yo'q. Event kelganda yangi SW start qiladi. chrome.storage (local/session/sync) va chrome.alarms — tashqarida yashaydi, SW'ni uyg'otadi. [SANDBOX simulation 2026-11-11]

## Diagnosis tree (arzonidan qimmatiga)
1. Manifest tekshir: `cat manifest.json | grep -E 'manifest_version|background'`
   EXPECTED: "manifest_version": 3 va "service_worker". Agar 2 yoki persistent:true → bu skill emas.

2. chrome://extensions → "Inspect views: service worker" → Console.
   `typeof chrome.storage` — "object". `chrome.runtime.getManifest().manifest_version` — 3.
   Idle 40s kut, Console'da "Service worker terminated" yoki Inspect yo'qoladi.

3. State qayerda: background.js'da `let count = 0;` kabi global bormi?
   EXPECTED if bug: ha. Idle'dan keyin event → count 0.

4. Timer: `setInterval`/`setTimeout` bormi?
   EXPECTED: ha, ular SW o'lganda to'xtaydi. chrome.alarms ishlatilmagan.

5. Permissions: manifest'da "storage", "alarms" bormi?
   EXPECTED if fix kerak: yo'q bo'lishi mumkin → qo'sh.

6. (qimmat) Offscreen document yoki WebSocket ishlatilganmi? Ular keepalive beradi (Chrome 109+/116+).

## Fix har bir sabab uchun
Sabab 1 (asosiy): in-memory state.
Fix (background.js):
```js
// ❌
let count = 0;
chrome.webNavigation.onCompleted.addListener(() => { count++; });

// ✅
chrome.webNavigation.onCompleted.addListener(async () => {
  const data = await chrome.storage.local.get({ count: 0 });
  data.count++;
  await chrome.storage.local.set({ count: data.count });
  // badge yoki boshqa ish
});
```
Tekshir: idle 40s, keyin event → count o'sadi.

Sabab 2: periodic timer.
Fix:
```js
// manifest: "permissions": ["alarms", "storage"]
chrome.alarms.create('check', { periodInMinutes: 1 }); // min 0.5 = 30s Chrome 120+
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'check') { /* ish */ }
});
```
Tekshir: `chrome.alarms.getAll(console.log)` — alarm bor.

Sabab 3: ephemeral session state (browser restart'gacha).
`chrome.storage.session.set/get` ishlat.

## Agentlar qayerda xato qiladi
1. Global o'zgaruvchiga yozib "ishladi" deb o'ylash (faqat SW hayotida).
2. setInterval ishlatish (SW o'lganda to'xtaydi).
3. chrome.storage o'rniga IndexedDB/localStorage (content script'da localStorage bor, SW'da yo'q).
4. Keepalive uchun cheksiz setInterval yoki heartbeat (Chrome taqiqlaydi, resource).
5. MV2 odatlarini ko'chirish (persistent page).

## Edge cases
1. Chrome 110+: extension API call timer reset qiladi. Oldingi versiyalarda faqat event handler.
2. WebSocket active — idle timer reset (Chrome 116+).
3. Native messaging / long-lived port — keepalive.
4. Alarms min period: Chrome 120+ 30s (0.5 min), oldin 1 min.
5. [not verified] To'liq Chrome instance bu sandboxda yo'q — faqat docs + simulation.

## Done criteria
```js
// background.js oxirida
chrome.storage.local.set({ test: Date.now() });
// 40s idle, keyin:
chrome.storage.local.get('test', console.log); // value bor
chrome.alarms.getAll(alarms => console.log(alarms.length > 0));
```
chrome://extensions Inspect SW ochiq, terminate bo'lgandan keyin ham storage ishlaydi.

## Agar hali ham ishlamasa
- chrome://serviceworker-internals/ — status.
- Minimum Chrome version manifest'da ko'rsat.
- Offscreen document (chrome.offscreen) uzoq ish uchun.
- Docs: https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle
- Alarms: https://developer.chrome.com/docs/extensions/reference/api/alarms

## Sources + confidence
- [SRC:https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle @ 2023-05-02] 30s inactivity, persist with storage, not globals.
- [SRC:https://developer.chrome.com/blog/longer-esw-lifetimes] Chrome 110+ API calls reset timer.
- [SANDBOX] 2026-11-11: node simulation — inMemory count resets after "terminate", storage.count continues.
- Confidence: 90% (docs aniq, simulation mos). Runtime Chrome'da [not verified].
