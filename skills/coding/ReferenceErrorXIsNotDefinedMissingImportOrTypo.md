---
name: reference-error-is-not-defined
description: ReferenceError "X is not defined" chiqadi — o'zgaruvchi yoki funksiya ishlatilgan, lekin import qilinmagan, e'lon qilinmagan yoki nomda oddiy typo bor.
---

# ReferenceError: X is not defined

## Nima uchun bu skill kerak
AI kod yozganda yoki tuzatayotganda juda tez-tez uchraydigan xato: funksiya/o'zgaruvchini ishlatadi, lekin uni import qilishni unutadi yoki nomni noto'g'ri yozadi. Bu "Cannot read properties of undefined"dan farqli — bu yerda o'zgaruvchi umuman scope'da yo'q.

## Simptom (aynan shu)
- Xato matni aynan: `ReferenceError: SomeName is not defined`
- Stack trace birinchi qatorda shu nom ishlatilgan joyni ko'rsatadi.
- Ba'zan faqat ma'lum bir faylda yoki ma'lum bir funksiya ichida chiqadi (boshqa joyda ishlayotgandek ko'rinadi).

## Sabab (100%)
Uchta mumkin bo'lgan holatdan biri:
1. `import` / `require` qatorida umuman yo'q (yoki noto'g'ri yo'l bilan import qilingan).
2. O'zgaruvchi/funksiya e'lon qilinmagan (yoki boshqa blok/scope ichida e'lon qilingan).
3. Oddiy typo: `getUser` o'rniga `getuser`, `fetchData` o'rniga `fetchdata` va h.k.

## Tasdiqlash
1. Xato xabaridagi aniq nomni (`SomeName`) ko'chirib ol.
2. Faylda `grep` yoki qidiruv qil: shu nom qayerda e'lon qilingan yoki import qilingan?
3. Agar import bor deb o'ylasa — import qatori to'g'ri yozilganmi (`import { SomeName } from '...'` yoki `import SomeName from '...'`)? Default vs named farqini tekshir.
4. Agar e'lon bor — qaysi scope'da (funksiya ichida, modul darajasida, boshqa faylda)?
5. Typo ehtimolini tekshir: o'xshash nomlar (`SomeName`, `someName`, `Some_Name`) bor-yo'qligini qarab chiq.

## Tuzatish (aynan shu)
```js
// XATO:
const data = await fetchUser(id);   // fetchUser hech qayerda yo'q

// TO'G'RI — import qo'shish:
import { fetchUser } from './api/users.js';
// yoki
import fetchUser from './api/users.js';   // agar default export bo'lsa

const data = await fetchUser(id);
```

Agar typo bo'lsa — nomni to'g'rilash. Agar boshqa fayldan kerak bo'lsa — o'sha fayldan to'g'ri export qilinganini ham tekshir (`export function` / `export default`).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- "is not defined" degani — scope'da umuman yo'q, null/undefined emas.
- Avval import va e'lonni, keyin typo'ni tekshir.
- AI yangi funksiya ishlatganda importni unutishi eng oddiy va eng ko'p uchraydigan sabab.