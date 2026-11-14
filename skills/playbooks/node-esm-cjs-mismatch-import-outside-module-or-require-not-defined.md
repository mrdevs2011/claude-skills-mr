---
name: node-esm-cjs-mismatch-import-outside-module-or-require-not-defined
description: Node.js "Cannot use import statement outside a module" yoki "require is not defined in ES module scope" — package.json "type" yoki fayl kengaytmasi (.mjs/.cjs) noto'g'ri. Triggers on exact error texts.
id: node-esm-cjs-mismatch-import-outside-module-or-require-not-defined
type: playbook
stack: Node.js v20.20.2 (ESM/CJS)
confirmed_on: 2026-11-14
confidence: high (reproduced in sandbox + official docs)
triggers:
  - Cannot use import statement outside a module
  - SyntaxError: Cannot use import statement outside a module
  - require is not defined in ES module scope
  - ReferenceError: require is not defined in ES module scope, you can use import instead
  - To load an ES module, set "type": "module" in the package.json or use the .mjs extension
  - node import statement fails package.json
  - type module require not defined
  - ESM vs CommonJS mismatch node
  - node .js file import vs require
  - "type": "module" but require fails
related:
  - coding/deps/
---

# Node.js ESM/CJS mismatch: import outside module yoki require is not defined

## TL;DR
Simptom: `import` da SyntaxError "Cannot use import statement outside a module" yoki `require` da ReferenceError "require is not defined in ES module scope".
Sabab: Node faylni CJS deb parse qilayapti (import uchun) yoki ESM deb (require uchun). package.json "type" yoki .js/.mjs/.cjs kengaytmasi qaror qiladi.
Birinchi buyruq: `cat package.json | jq .type` yoki `node --version` + fayl kengaytmasini tekshir.
Done: `node yourfile.js` xatosiz ishlaydi, chiqish kutilgan.

## Qachon ishlatish / ishlatmaslik
Ishlat: Node da import/require xatosi chiqsa, yangi skript yoki mavjud loyihada ESM/CJS aralashganda.
Ishlatma: Browserda `<script>` da import xatosi (u type="module" talab qiladi), yoki TypeScript/tsconfig/module sozlamasi (avval tsc chiqishini tekshir). Yoki bundler (webpack/vite) ichida.

## Mental model (nima uchun)
[SRC:https://nodejs.org/api/packages.html#type @ Node 20, 2026-11] Node .js faylni eng yaqin package.json dagi "type" bo'yicha qaror qiladi: "module" → ESM (import/export), "commonjs" yoki yo'q → CJS (require). .mjs doim ESM, .cjs doim CJS. Import ESM-only syntax, CJS da SyntaxError. require CJS-only, ESM da ReferenceError. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "Cannot use import..." → fayl CJS sifatida parse qilingan. "require is not defined in ES module scope" → fayl ESM sifatida parse qilingan.
   EXPECTED: xato matnida package.json yo'li yoki kengaytma eslatiladi.

2. package.json ni tekshir:
   ```bash
   cat package.json | jq .type || echo "no type or no package.json"
   ```
   EXPECTED: "module" yoki "commonjs" yoki null. Agar import xato va type yo'q/"commonjs" → sabab 1. Agar require xato va type "module" → sabab 2.

3. Fayl kengaytmasini tekshir: `ls -l *.js *.mjs *.cjs`
   EXPECTED: .mjs doim ESM, .cjs doim CJS. .js package.json ga bog'liq.

4. Node versiyasini tekshir: `node --version`
   EXPECTED: v20+ da ba'zi hollarda syntax detection bor, lekin "type": "commonjs" majburiy CJS qiladi. [SANDBOX]

## Fix har bir sabab uchun
Sabab 1: import ishlatilgan, lekin CJS.
Fix A (butun loyiha ESM): package.json ga `"type": "module"` qo'sh.
```bash
# package.json ichida
# "type": "module"
node app.js   # endi import ishlaydi
```
Fix B (bitta fayl): `mv app.js app.mjs && node app.mjs`
Tekshir: `node app.mjs` "ok" chiqaradi, xato yo'q. [SANDBOX]

Sabab 2: require ishlatilgan, lekin ESM ("type": "module").
Fix A: require ni import ga o'zgartir: `import fs from "node:fs";`
Fix B (bitta fayl CJS qilish): `mv app.js app.cjs && node app.cjs` (package.json o'zgarmaydi)
Tekshir: xato yo'qoladi. [SANDBOX]

## Agentlar qayerda xato qiladi
1. Faqat package.json ga type qo'shadi, lekin boshqa fayllardagi require ni o'zgartirmaydi — ular sinadi.
2. .mjs ni bilmay, faqat type o'zgartiradi yoki node --experimental-modules (eski) ishlatadi.
3. Relative import da kengaytmasiz yozadi (`./util` o'rniga `./util.js`) — keyin ERR_MODULE_NOT_FOUND.
4. createRequire ni eshitib, lekin import.meta.url ni noto'g'ri beradi.

## Edge cases
1. Nested package.json: ichki papkada boshqa type bo'lsa, u ustun. `find . -name package.json`
2. Node 22+ da require() ba'zi ESM ni qabul qilishi mumkin, lekin baribir "type" qoidasi asosiy. [GUESS from docs]
3. Dynamic import() CJS da ishlaydi: `const m = await import('./mod.js');`

## Done criteria
```bash
# import holat
printf 'import fs from "node:fs";\nconsole.log("ok");\n' > test.js
# type module yoki .mjs dan keyin
node test.js   # chiqish: ok, exit 0
# require holat
printf 'const fs = require("node:fs");\nconsole.log("ok");\n' > test.cjs
node test.cjs  # chiqish: ok
```
Agar xato qaytsa — fix to'liq emas.

## Agar hali ham ishlamasa
- Relative import kengaytmasini tekshir (./file.js).
- __dirname/__filename ESM da yo'q: `import { fileURLToPath } from 'url'; const __dirname = path.dirname(fileURLToPath(import.meta.url));`
- package.json yo'q bo'lsa: `npm init -y` keyin type qo'sh yoki .mjs ishlat.
- Vercel/serverless: runtime Node versiyasini tekshir.

## Sources + confidence
[SRC:https://nodejs.org/api/esm.html @ Node 20 docs, 2026-11] [SRC:https://nodejs.org/api/packages.html#type @ Node 20]
[SANDBOX] Node v20.20.2 da: type commonjs + import → SyntaxError "Cannot use import statement outside a module"; type module + require → ReferenceError "require is not defined in ES module scope..."; .mjs ishlaydi.
Confidence: high. 100% emas, chunki Node 22+ o'zgarishlari va nested package.json edge case'lari to'liq sinovdan o'tmagan.
