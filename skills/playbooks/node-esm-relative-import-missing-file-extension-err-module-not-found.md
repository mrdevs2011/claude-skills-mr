---
name: node-esm-relative-import-missing-file-extension-err-module-not-found
description: Node.js ESM relative import without .js (or other) extension raises ERR_MODULE_NOT_FOUND "Did you mean to import ...js?". Add the mandatory file extension.
id: node-esm-relative-import-missing-file-extension-err-module-not-found
type: playbook
stack: Node.js v20.20.2 (ESM)
confirmed_on: 2026-11-18
confidence: high (reproduced in sandbox + official docs)
triggers:
  - Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  - ERR_MODULE_NOT_FOUND Cannot find module
  - Did you mean to import "./lib.js"?
  - Cannot find module imported from
  - Node ESM import missing .js extension
  - relative import without extension ERR_MODULE_NOT_FOUND
  - import from "./utils" fails but "./utils.js" works
  - node type module relative import no extension
  - ESM mandatory file extensions
  - Did you mean to import .js
  - Cannot find module imported from
related:
  - node-esm-cjs-mismatch-import-outside-module-or-require-not-defined
  - linux-case-sensitive-fs-modulenotfounderror-or-cannot-find-module-wrong-case-import-require
---

# Node.js ESM: relative import da .js kengaytmasi yo'q — ERR_MODULE_NOT_FOUND

## TL;DR
Simptom: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/.../lib' imported from /.../main.mjs` va odatda "Did you mean to import \"./lib.js\"?".
Sabab: ESM da relative/absolute specifierlar uchun fayl kengaytmasi majburiy (CJS dan farqli). `./lib` hech qachon `./lib.js` ga kengaytirilmaydi.
Birinchi buyruq: xato matnida "Did you mean to import" bormi va import qatorida kengaytma yo'qligini tekshir.
Done: `node yourfile.mjs` (yoki .js) xatosiz ishlaydi, kutilgan chiqish chiqadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: Node da `import` (yoki dynamic import) relative path bilan "ERR_MODULE_NOT_FOUND" bersa, ayniqsa "Did you mean to import ...js?" eslatmasi bo'lsa, yoki package.json "type": "module" / .mjs fayl.
Ishlatma: "Cannot use import statement outside a module" (ESM/CJS mismatch, alohida skill). Bare specifier (`import 'express'`) uchun — bu odatda package o'rnatilmagan. Directory import (`import './dir'`) — index.js ham to'liq yozilishi kerak, lekin asosiy sabab kengaytma. TypeScript/bundler (Vite/webpack) ichida — ular o'z resolution qoidalariga ega.

## Mental model (nima uchun)
[SRC:https://nodejs.org/api/esm.html#mandatory-file-extensions @ Node 20, 2026-11] "A file extension must be provided when using the import keyword to resolve relative or absolute specifiers. Directory indexes (e.g. './startup/index.js') must also be fully specified."
Bu browser ESM bilan mos: hech qanday guessing yo'q (CJS `require('./lib')` `.js`/`.json`/index ni sinab ko'radi). Relative specifier aynan yozilgan pathga resolve bo'ladi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi:
   ```bash
   # chiqishda qidir:
   # Error [ERR_MODULE_NOT_FOUND]: Cannot find module '...' imported from '...'
   # Did you mean to import "./something.js"?
   ```
   EXPECTED: "Did you mean to import" bor va kengaytma taklif qilingan. Agar yo'q va bare specifier — package yo'q. Agar "Cannot use import statement outside a module" — boshqa skill.

2. Import qatorini tekshir (faylni och):
   ```bash
   grep -n "from ['\"]\\./" yourfile.mjs | head -5
   # yoki
   node --input-type=module -e 'console.log("check your source")'
   ```
   EXPECTED: `from './lib'` yoki `from './utils/helper'` (kengaytmasiz). Agar `from './lib.js'` bo'lsa — fayl haqiqatan yo'q yoki case xato (Linux case-sensitive skill).

3. Fayl diskda bormi va kengaytma to'g'rimi:
   ```bash
   ls -l lib.js  # yoki xato matnidagi path
   # yoki
   ls -la /tmp/esm-test/
   ```
   EXPECTED: `lib.js` bor, lekin import `./lib` (kengaytmasiz). Agar fayl yo'q — yarat yoki path tuzat. [SANDBOX]

4. package.json type yoki kengaytma (ESM ekanligini tasdiqla):
   ```bash
   cat package.json | jq -r '.type // "no type"'
   ls *.mjs *.js 2>/dev/null | head
   ```
   EXPECTED: "module" yoki .mjs. Agar CJS bo'lsa — boshqa xato bo'lishi kerak.

## Fix har bir sabab uchun
Sabab 1 (asosiy): relative import da kengaytma yo'q.
Fix — kengaytma qo'sh (odatda .js):
```js
// noto'g'ri
import { x } from "./lib";
// to'g'ri
import { x } from "./lib.js";
```
Yoki dynamic:
```js
const mod = await import("./lib.js");
```
Re-check:
```bash
node main.mjs   # yoki sizning faylingiz
# EXPECTED: xatosiz, kutilgan console.log yoki export ishlaydi
```
[SANDBOX]

Sabab 2: directory import (index).
Fix: `import ... from "./dir/index.js"` (to'liq).
Re-check: xuddi yuqoridagi node buyrug'i.

## Agents qayerda adashadi
- Xatoni "package o'rnatilmagan" deb o'ylab `npm install` qiladi — relative path uchun ishlamaydi.
- Kengaytma qo'shish o'rniga package.json "type" ni o'zgartiradi yoki .mjs ga o'tkazadi (keraksiz).
- "Did you mean" eslatmasini e'tiborsiz qoldirib, boshqa sabab izlaydi.
- TypeScript source da kengaytma yo'qligini to'g'ri deb o'ylab, lekin node runtime da (yoki tsc outDir) ishlamaydi.

## Edge cases
- `.mjs` / `.cjs` kengaytmasi: import ham shu kengaytma bilan bo'lishi kerak (`./lib.mjs`).
- JSON import: `import data from "./data.json" with { type: "json" };` (Node 20+), kengaytma ham kerak.
- Bundler (Vite, esbuild) odatda kengaytmasiz ruxsat beradi — faqat to'g'ridan-to'g'ri `node` da xato.
- Case: Linux da `./Lib.js` vs `./lib.js` — alohida skill.

## Done criteria
```bash
# 1. To'g'ri import bilan ishlaydi
node yourfile.mjs
# EXPECTED: exit 0, kutilgan output (masalan 1)

# 2. Xato variantini buzib tekshir (mutation)
# import ni qayta kengaytmasiz qil, node ishga tushir
# EXPECTED: yana ERR_MODULE_NOT_FOUND + "Did you mean to import ...js?"
```
Agar ikkalasi ham kutilgan bo'lsa — skill ishladi.

## If still failing
- Xato matnida "Did you mean" yo'qmi? Fayl haqiqatan yo'q yoki path noto'g'ri (ls bilan tekshir).
- Bare specifier bo'lsa — `npm ls <pkg>` yoki `npm install`.
- "Cannot use import statement outside a module" — related skill.
- TypeScript: `tsc` chiqishidagi .js fayllarni tekshir, source da kengaytma kerak bo'lishi mumkin (moduleResolution).

## Sources + confidence
- [SRC:https://nodejs.org/api/esm.html#mandatory-file-extensions @ Node.js v20 docs, accessed 2026-11-18]
- [SANDBOX] Node v20.20.2: `import {x} from "./lib"` → ERR_MODULE_NOT_FOUND + "Did you mean to import \"./lib.js\"?"; `./lib.js` bilan ishlaydi.
- Confidence: high — aniq reproduced, docs to'g'ridan-to'g'ri mos.
