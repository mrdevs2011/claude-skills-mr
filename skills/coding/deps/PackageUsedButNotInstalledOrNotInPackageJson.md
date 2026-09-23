---
name: package-not-installed
description: "Cannot find module 'xxx'" yoki "Module not found" chiqadi — kodda import bor, lekin package.json'da yo'q yoki npm/yarn install qilinmagan.
---

# Package ishlatilgan, lekin o'rnatilmagan

## Nima uchun bu skill kerak
AI kod yozganda kutubxonani ishlatadi (`import lodash from 'lodash'`, `import { z } from 'zod'`), lekin `package.json`ga qo'shishni yoki `npm install` qilishni unutadi. Bu eng oddiy va eng ko'p uchraydigan "kod yozildi, lekin ishlamaydi" holatlaridan biri.

## Simptom (aynan shu)
- Xato: `Error: Cannot find module 'xxx'` yoki `Module not found: Can't resolve 'xxx'`
- Yoki TypeScript: `Cannot find module 'xxx' or its corresponding type declarations`
- Lokalda ba'zan ishlaydi (agar global o'rnatilgan bo'lsa), lekin boshqa muhitda yoki CI'da yiqiladi.

## Sabab (100%)
1. `package.json` → `dependencies` yoki `devDependencies` ichida paket umuman yo'q.
2. Paket qo'shilgan, lekin `npm install` / `yarn` / `pnpm install` ishga tushirilmagan (`node_modules` yangilanmagan).
3. AI faqat kod yozgan, `package.json`ni yangilashni unutgan.

## Tasdiqlash
1. Xato xabaridagi paket nomini oling.
2. `package.json`ni ochib, `dependencies` va `devDependencies`da bor-yo'qligini tekshiring.
3. Agar bor bo'lsa — `node_modules/xxx` papkasi mavjudligini tekshiring.
4. Agar yo'q bo'lsa — bu aynan shu sabab.

## Tuzatish (aynan shu)
```bash
# Paketni qo'shish + o'rnatish:
npm install xxx
# yoki
yarn add xxx
# yoki
pnpm add xxx

# Dev dependency bo'lsa:
npm install -D xxx
```

Kodda import to'g'ri yozilganligini ham tekshiring (named vs default). Agar paket nomi noto'g'ri bo'lsa (AI hallucinate qilgan bo'lsa) — avval haqiqiy paket nomini aniqlang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- "Cannot find module" degani odatda paket `package.json`da yo'q yoki install qilinmagan.
- AI kod yozganda `package.json`ni yangilashni unutishi eng ko'p uchraydigan sabab.
- Har doim yangi import qo'shgach `package.json` va `node_modules`ni tekshir.