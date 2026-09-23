---
name: import-path-wrong-or-case-mismatch
description: Import yo'li noto'g'ri yoki fayl nomi registri (Case) mos kelmaydi — lokalda (macOS/Windows) ishlaydi, Linux/CI da "module not found".
---

# Import yo'li yoki Case noaniqligi

## Nima uchun bu skill kerak
AI import yozadi: yo'l xato, yoki `User.js` o'rniga `user.js`. macOS/Windows fayl tizimi case-insensitive — lokalda ishlaydi. Linux (CI, Vercel, Docker) case-sensitive — "Cannot find module" chiqadi. Bu "lokalda ishlaydi, production'da yo'q" ning klassik sabablaridan.

## Simptom (aynan shu)
- Lokalda (Mac/Windows) import ishlaydi.
- CI, Vercel, Linux serverda: `Cannot find module './User'` yoki `Module not found: Can't resolve '@/components/Button'`.
- Fayl nomi `Button.tsx`, import `button` yoki `./button`.
- Yoki relative path bir daraja xato (`../` vs `../../`).

## Sabab (100%)
- Fayl nomi registri import bilan mos kelmaydi.
- Relative path noto'g'ri hisoblangan.
- Alias (`@/`) sozlamasi muhitda boshqacha.
AI lokal OS'da tekshirib, case'ni e'tiborsiz qoldiradi.

## Tasdiqlash
1. Xato matnidagi modul yo'lini oling.
2. Haqiqiy fayl nomini (aniq registr bilan) solishtiring.
3. Relative path to'g'rimi — qaysi papkadan qaysiga?
4. Linux'da yoki CI logida xato bormi?

## Tuzatish (aynan shu)
Importni fayl nomi bilan **aniq** moslashtiring:

```js
// XATO — case:
import Button from './button';      // fayl: Button.tsx
import { User } from './user';     // fayl: User.ts

// TO'G'RI:
import Button from './Button';
import { User } from './User';

// XATO — path:
import { helper } from '../utils/helper';  // aslida ../../utils

// TO'G'RI:
import { helper } from '../../utils/helper';
```

Qoida: import dagi nom fayl tizimidagi nom bilan bitta-biriga mos (case ham). Linux/CI da tekshirmasdan "ishlaydi" demang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- macOS/Windows case-insensitive, Linux — yo'q.
- Import case va path aniq mos kelishi kerak.
- AI lokalda ishlagan importni production'da sindirishi mumkin.
