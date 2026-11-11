---
id: chrome-mv3-getusermedia-microphone-fails-in-service-worker-use-offscreen-document-with-user-media
type: playbook
stack: Chrome/Chromium 109+ MV3 (tested docs on 153)
confirmed_on: 2026-11-11
confidence: high (official docs + multiple reports; full extension runtime not verified in headless sandbox)
triggers:
  - getUserMedia not supported in chrome extension service worker
  - microphone permission NotAllowedError in offscreen document
  - MV3 service worker cannot access navigator.mediaDevices
  - chrome.offscreen createDocument for microphone
  - USER_MEDIA reason offscreen document mic
  - Permission dismissed for getUserMedia in extension background
  - how to record microphone in Manifest V3
  - offscreen document getUserMedia fails until permission granted on visible page
  - chrome extension mic access MV3
related:
  - playbooks/chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms.md
---

# Chrome MV3: getUserMedia mikrofon service workerda ishlamaydi — offscreen document + USER_MEDIA

## TL;DR
Simptom: `navigator.mediaDevices.getUserMedia({audio: true})` service worker yoki offscreen ichida "Not supported", "NotAllowedError", "Permission dismissed" yoki DOMException beradi.
Sabab: SW da DOM/media API yo'q; offscreen da ham permission oldindan visible page (popup/options) da berilishi kerak, va reason USER_MEDIA bo'lishi shart.
Birinchi buyruq: manifestda `"offscreen"` permission borligini tekshir, keyin `chrome.offscreen.createDocument` bilan `reasons: ['USER_MEDIA']`.
Done: offscreen da getUserMedia stream olindi, MediaRecorder ishlaydi.

## Qachon ishlatish / ishlatmaslik
Ishlat: MV3 extensionda mikrofon/kamera/getUserMedia kerak bo'lganda (background yoki doimiy).
Ishlatma: oddiy webpage yoki content script ichida (u yerda to'g'ridan-to'g'ri ishlaydi, lekin page CSP va lifecycle boshqa). Yoki faqat tabCapture (DISPLAY_MEDIA).

## Mental model (nima uchun)
[SRC:https://developer.chrome.com/docs/extensions/reference/api/offscreen @ 2026-11-10] Service workerda `document`/`window`/`navigator.mediaDevices` yo'q. Offscreen document yashirin HTML bo'lib, DOM APIlarni beradi, lekin faqat `chrome.runtime` messaging. Reason `USER_MEDIA` aniq `getUserMedia()` uchun. Permission prompt offscreenning o'zida ishonchsiz; avval popup yoki options page da so'ralishi kerak, keyin offscreen ishlatadi. Bitta offscreen document per extension. [SANDBOX: Chromium 153 mavjud, lekin to'liq extension load headlessda qiyin — not verified runtime]

## Diagnosis tree (arzonidan qimmatiga)
1. Manifest tekshir: `cat manifest.json | grep -E 'offscreen|permissions'`  
   EXPECTED: `"offscreen"` bor. Agar yo'q → qo'sh.  
   Agar bor → 2.

2. createDocument chaqiruvini ko'r: kodda `reasons: ['USER_MEDIA']` va `justification` borligini tekshir.  
   EXPECTED: aniq USER_MEDIA. Agar AUDIO_PLAYBACK yoki boshqa → o'zgartir.  
   Agar to'g'ri → 3.

3. Permission holati: offscreen yoki popupda `navigator.permissions.query({name: 'microphone'})`  
   EXPECTED: `{state: 'granted'}`. Agar 'prompt' yoki 'denied' → avval visible page da getUserMedia chaqirib user ruxsat bersin.  
   Agar granted → 4.

4. Context tekshir: `chrome.runtime.getContexts({contextTypes: ['OFFSCREEN_DOCUMENT']})`  
   EXPECTED: length > 0. Agar 0 → setupOffscreenDocument() chaqir.  
   Agar bor lekin xato → loglarni chrome://extensions da ko'r.

## Fix har bir sabab uchun
Sabab 1: SW da to'g'ridan-to'g'ri getUserMedia.  
Fix: background.js da:
```js
async function setupOffscreen() {
  const existing = await chrome.runtime.getContexts({contextTypes: ['OFFSCREEN_DOCUMENT']});
  if (existing.length > 0) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'Record microphone audio'
  });
}
// keyin chrome.runtime.sendMessage to offscreen
```
offscreen.html + offscreen.js da getUserMedia chaqir.

Sabab 2: Permission yo'q.  
Fix: popup.html da bir marta:
```js
await navigator.mediaDevices.getUserMedia({audio: true});
```
User ruxsat bersin, keyin offscreen ishlaydi. Options page ham bo'ladi.

Tekshir: offscreen.js da `const stream = await navigator.mediaDevices.getUserMedia({audio: true}); console.log(stream.getAudioTracks().length);` — 1 bo'lishi kerak.

## Agentlar qayerda xato qiladi
1. SW ichida `navigator.mediaDevices` bor deb taxmin qilish — yo'q.
2. reason ni 'AUDIO_PLAYBACK' qo'yish (u playback uchun, getUserMedia uchun emas).
3. Permissionni offscreenning o'zida so'rash — prompt ishonchsiz yoki dismissed bo'ladi; visible page kerak.
4. Bitta offscreen ochiqligini tekshirmasdan qayta-qayta createDocument chaqirish — xato beradi.

## Edge cases
1. Incognito split mode: alohida offscreen. [SRC:docs]
2. Chrome 116 dan oldin getContexts yo'q — clients.matchAll ishlat. [SRC:docs]
3. Firefoxda offscreen API yo'q — alohida yo'l kerak. [not verified]
4. Permission 'denied' bo'lsa — user chrome://settings/content/microphone dan qo'lda yoqishi kerak.

## Done criteria
```js
// offscreen.js ichida
const stream = await navigator.mediaDevices.getUserMedia({audio: true});
if (stream.getAudioTracks().length > 0) {
  console.log('MIC OK');
  // MediaRecorder ishga tushirish mumkin
}
```
Yoki chrome.runtime.onMessage orqali stream id yoki blob qaytishi. Logda "MIC OK" va xato yo'q.

## Agar hali ham ishlamasa
- chrome://extensions → service worker inspect, console xatolarini o'qi.
- `chrome.offscreen.hasDocument()` (Chrome 150+) tekshir.
- Minimal: popupda ruxsat, keyin offscreen.
- Docs: https://developer.chrome.com/docs/extensions/reference/api/offscreen
- Sample: GoogleChrome/chrome-extensions-samples da offscreen-user-media (agar bor bo'lsa).

## Sources + confidence
- [SRC:https://developer.chrome.com/docs/extensions/reference/api/offscreen @ 2026-11-10]: USER_MEDIA reason, SW da DOM yo'q, setup example.
- Community reports (SO, GitHub issues 2024-2025): permission avval visible page da, offscreen da "Not supported" yoki dismissed.
- [SANDBOX] Chromium 153.0.8010.52 mavjud; to'liq extension runtime headlessda tekshirilmadi — not verified.
- Confidence: 85% (docs aniq, runtime patternlar ko'p marta tasdiqlangan, lekin bu sandboxda 100% emas).
