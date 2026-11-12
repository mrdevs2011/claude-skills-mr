---
id: chrome-mv3-wasm-compile-fails-csp-missing-wasm-unsafe-eval
name: chrome-mv3-wasm-compile-fails-csp-missing-wasm-unsafe-eval
description: Chrome MV3 extensionda WebAssembly.compile yoki instantiate CSP sababli muvaffaqiyatsiz bo'ladi, chunki extension_pages da 'wasm-unsafe-eval' yo'q. Manifestga qo'shib tuzat.
type: playbook
stack: Chrome 120+ Manifest V3 + WebAssembly
confirmed_on: 2026-11-12
confidence: high (reproduced in sandbox + official docs)
triggers:
  - WebAssembly.compile(): Compiling or instantiating WebAssembly module violates the following Content Security policy directive
  - wasm-unsafe-eval missing
  - CSP script-src self blocks WASM
  - Chrome extension WASM EvalError
  - Refused to evaluate WebAssembly
  - MV3 content_security_policy wasm
  - extension_pages script-src needs wasm-unsafe-eval
  - WebAssembly.instantiate fails CSP
  - how to load wasm in chrome mv3 extension
  - WASM compile blocked by Content Security Policy
related:
  - chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms
  - chrome-mv3-getusermedia-microphone-fails-in-service-worker-use-offscreen-document-with-user-media
---

# Chrome MV3 da WASM compile CSP sababli muvaffaqiyatsiz — 'wasm-unsafe-eval' yo'q

## TL;DR
Simptom: `WebAssembly.compile` yoki `instantiate` da "Compiling or instantiating WebAssembly module violates the following Content Security policy directive because 'unsafe-eval' is not an allowed source..." xatosi.
Sabab: MV3 default `extension_pages` CSP da `'wasm-unsafe-eval'` yo'q, WASM taqiqlangan.
Birinchi buyruq: manifest.json da `"content_security_policy": {"extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"}` qo'sh.
Done: console da WASM_OK yoki module.exports ishlaydi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: Chrome/Edge MV3 extension (yoki qat'iy CSP li sahifa) da WASM yuklash/compile qilganda yuqoridagi EvalError chiqsa.
Ishlatma: oddiy web sahifa (CSP yo'q), yoki MV2 (boshqa qoidalar), yoki WASM allaqachon ishlayotgan bo'lsa. Firefox boshqa, lekin o'xshash.

## Mental model (nima uchun)
[SRC:https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/ @ current, 2026-11] MV3 da extension_pages uchun minimum CSP `script-src 'self'; object-src 'self';` — bu `'unsafe-eval'` ni taqiqlaydi, WASM esa ichki eval ga o'xshash kompilyatsiya qiladi. Shuning uchun aniq `'wasm-unsafe-eval'` tokenini qo'shish kerak (bu remote code emas, faqat lokal WASM). Default da yo'q, shuning uchun bloklanadi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: console yoki service worker inspect da "WebAssembly.compile(): ... violates ... Content Security policy ... 'unsafe-eval'" borligini tekshir.  
   EXPECTED: aynan shu matn. Agar boshqa xato (network, file not found) → boshqa skill.  
   Agar shu → 2-ga o't.

2. manifest.json ni och: `cat manifest.json | jq .content_security_policy`  
   EXPECTED: `"extension_pages": "script-src 'self' 'wasm-unsafe-eval'; ..."` yoki o'xshash. Agar yo'q yoki `'wasm-unsafe-eval'` yo'q → sabab shu.  
   Agar bor lekin ishlamayapti → 3-ga.

3. WASM fayl lokalmi tekshir: `ls -l *.wasm` va `chrome.runtime.getURL('module.wasm')` ishlatilganmi.  
   EXPECTED: fayl extension ichida, remote URL yo'q. Agar remote → CSP remote ni ham taqiqlaydi.  
   [SANDBOX: file:// da lokal script + CSP bilan repro qilindi]

4. Service worker da: background type: "module" ekanligini tekshir (agar ES import).  
   EXPECTED: `"background": {"service_worker": "...", "type": "module"}` agar kerak.

## Fix per cause
**Sabab: CSP da 'wasm-unsafe-eval' yo'q**  
manifest.json:
```json
{
  "manifest_version": 3,
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
  }
}
```
Keyin extension ni reload qil.  
Re-check: service worker console da compile qil, xato yo'qolishi kerak. [SANDBOX: 'wasm-unsafe-eval' qo'shilganda WASM_OK]

**Sabab: WASM remote URL dan**  
Faylni extension ga qo'sh, `fetch(chrome.runtime.getURL('mod.wasm'))` ishlat.

## Where agents go wrong
1. Default CSP da WASM ishlaydi deb o'ylash — ishlamaydi, aniq token kerak.
2. `'unsafe-eval'` qo'shishga urinish — MV3 da taqiqlangan, faqat `'wasm-unsafe-eval'`.
3. Sandbox page ga qo'shish — extension_pages uchun alohida.
4. Reload qilmasdan test qilish — CSP o'zgarishi uchun extension reload kerak.

## Edge cases
1. Unpacked extension da localhost ruxsat etiladi, lekin production da yo'q.  
2. Firefox da ham `'wasm-unsafe-eval'` tavsiya etiladi, lekin default boshqacha. [SRC: MDN]
3. Agar WASM ichida `new Function` ishlatilsa, yana bloklanadi — bindings ni tekshir.

## Done criteria
- `jq '.content_security_policy.extension_pages' manifest.json` da `'wasm-unsafe-eval'` bor.
- Extension reload dan keyin service worker console da WASM compile/instantiate xatosiz o'tadi.
- `WebAssembly.compileStreaming(fetch(...))` yoki oddiy compile ishlaydi.

## If still failing
- Xato matnini to'liq copy qil, boshqa CSP direktiva bormi qara.
- WASM faylni `xxd` yoki `file` bilan tekshir (to'g'ri magic `\0asm`).
- Chrome version: 103+ kerak. `chrome://version`

## Sources + confidence
- [SRC:https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/] official, WASM disabled by default without token.
- [SANDBOX] headless chromium: CSP `script-src 'self'` → WASM_ERR with exact message; `'wasm-unsafe-eval'` → WASM_OK.
- Confidence: high, measured.
