---
id: chrome-content-script-isolated-world-cannot-access-page-js-variables-use-main-world-or-inject
name: chrome-content-script-isolated-world-cannot-access-page-js-variables-use-main-world-or-inject
description: Chrome extension content scriptda page'dagi JavaScript o'zgaruvchilari (window.foo) undefined. Sabab: isolated world. Fix: world: "MAIN" yoki script inject + CustomEvent.
type: playbook
stack: Chrome extension Manifest V3, content scripts, chrome.scripting (Chrome 95+ for MAIN world)
confirmed_on: 2026-11-15
confidence: high (official docs; sandbox page context verified, full extension not in headless)
triggers:
  - content script cannot access page variable
  - window.myVar is undefined in content script
  - chrome extension isolated world
  - page JS function not defined in content script
  - ReferenceError page function in extension content
  - how to get page variables from content script
  - chrome.scripting executeScript world MAIN
  - inject script to access page context
  - content script and page JS separate worlds
  - isolated execution environment chrome extension
related:
  - playbooks/chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms.md
  - playbooks/react-controlled-input-set-from-outside-reverts-without-native-setter-and-input-event.md
---

# Chrome content script isolated world'da page JS o'zgaruvchilarini ko'rmaydi

## TL;DR
Simptom: content script'da `console.log(window.pageVar)` yoki page funksiyasi `undefined` / ReferenceError, lekin DevTools Console (page context) da bor.
Sabab: content scripts default isolated world'da ishlaydi — DOM ulashadi, lekin JS heap alohida.
Birinchi buyruq: manifest yoki executeScript'da `world: "MAIN"` qo'y yoki `<script>` inject qil.
Done: MAIN world'da yoki injected script'da `window.pageVar` qiymatini oladi.

## Qachon ishlatish / ishlatmaslik
Ishlat: MV3 content script page'ning o'z JS o'zgaruvchi/funksiyasiga (masalan SPA state, window.analytics) kira olmayapti.
Ishlatma: oddiy DOM read/write (querySelector ishlaydi); service worker muammolari; MV2; faqat o'z extension storage.

## Mental model (nima uchun)
[SRC:https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts @ 2023-ish] "Content scripts live in an isolated world... They have access to the DOM of the page they are injected into, but not to any JavaScript variables or functions created by the page."
Xavfsizlik uchun: page xavfli kod extension'ga tegmasin, va teskari. Ikki alohida JS environment, bir xil DOM.
Chrome 95+: chrome.scripting.executeScript({world: "MAIN"}); Chrome 111+: manifest content_scripts world: "MAIN".
[SANDBOX] page context'da var borligini tasdiqladi, isolated simulyatsiya qilinmadi (extension runtime yo'q).

## Diagnosis tree (arzonidan qimmatiga)
1. Content script ekanini tekshir: manifest.json da "content_scripts" bor, yoki chrome.scripting.executeScript chaqirilgan.
   EXPECTED: ha. Agar background/SW bo'lsa — bu skill emas (boshqa skillga qara).

2. DevTools'da page Console'da `window.pageVar` (yoki kerakli nom) ni tekshir.
   EXPECTED if bug: page Console'da qiymat bor, content script Console'da undefined.
   Content script Console: chrome://extensions → Inspect views yoki page Inspect + Sources'da content script.

3. Manifest yoki kodda world ko'rsatilganmi?
   `grep -A5 content_scripts manifest.json` yoki kodda world:
   EXPECTED if default bug: yo'q yoki "ISOLATED".

4. Agar executeScript ishlatilsa, world parametri.
   EXPECTED: yo'q → default ISOLATED.

## Fix per cause
### Sabab 1: default isolated, page var kerak
Manifest'da (Chrome 111+):
```json
"content_scripts": [{
  "matches": ["<all_urls>"],
  "js": ["content.js"],
  "world": "MAIN"
}]
```
Yoki programmatic (Chrome 95+):
```js
chrome.scripting.executeScript({
  target: {tabId: tab.id},
  world: "MAIN",
  func: () => window.pageVar
}).then(results => console.log(results[0].result));
```
Re-check: content.js'da yoki natijada qiymat chiqadi.

### Sabab 2: MAIN xavfsiz emas (page extension API'sini ko'rmasin), inject + message
Content script:
```js
const s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = () => s.remove();
(document.head || document.documentElement).appendChild(s);
window.addEventListener('from-page', e => console.log(e.detail));
```
injected.js (web_accessible_resources da):
```js
window.dispatchEvent(new CustomEvent('from-page', {detail: window.pageVar}));
```
Manifest: "web_accessible_resources": [{"resources": ["injected.js"], "matches": ["<all_urls>"]}]
Re-check: event detail'da qiymat keladi.

## Where agents go wrong (>=3)
1. Content script'da `window.pageVar` deb yozib, "undefined, demak page'da yo'q" deb xulosa qiladi — page Console'ni tekshirmaydi.
2. DOM'ni o'zgartirib ishlaydi deb o'ylaydi, lekin JS var uchun ham shu ishlaydi deb taxmin qiladi.
3. executeScript qiladi, lekin world: "MAIN" qo'ymaydi, natija undefined.
4. Inject qilganda src o'rniga textContent ishlatadi, lekin CSP bloklaydi (inline script).

## Edge cases (>=2)
1. MAIN world'da content script page'ning funksiyalarini override qilishi mumkin — ehtiyotkor bo'l.
2. SPA'larda pageVar keyin set bo'ladi — run_at: "document_idle" yoki MutationObserver kerak.
3. iframe'larda alohida world — all_frames: true bo'lsa ham har frame o'z.

## Done criteria (proving commands)
- Page Console: `window.pageVar` → "from-page" (yoki real qiymat).
- Content / MAIN: xuddi shu → qiymat.
- Yoki event listener detail === page qiymati.
- chrome://extensions reload, page reload, qayta tekshir.

## If still failing
- Exact error / console matnini to'liq ol.
- Manifest version, Chrome version (`chrome.runtime.getManifest()`).
- search_skills("isolated world") yoki "MAIN world content script".
- Agar CSP xato: content_security_policy ni tekshir.

## Sources + confidence
[SRC:https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts @ current] isolated world description.
[SRC:https://developer.chrome.com/docs/extensions/reference/api/scripting @ current] ExecutionWorld MAIN/ISOLATED, Chrome 95+.
[SRC:https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts @ current] world key Chrome 111+.
Confidence: high on docs; sandbox verified page context has var [SANDBOX 2026-11-15]; full MV3 extension runtime not verified here (headless no extension load).
