---
name: wrong-package-version-or-peer-conflict
description: Paket o'rnatilgan, lekin versiya noto'g'ri yoki peer dependency mos kelmaydi — runtime xato, warning yoki "invalid hook call" kabi chalkash xabarlar.
---

# Noto'g'ri paket versiyasi yoki peer conflict

## Nima uchun bu skill kerak
AI `npm install xxx` qiladi yoki package.json'ga yozadi, lekin versiyani tekshirmaydi. Yoki bir paket boshqa paketning aniq versiyasini talab qiladi (peer dependency). Natijada: ishlamaydi, ogohlantirish chiqadi, yoki "Invalid hook call" kabi chalkash xatolar paydo bo'ladi. Bu `PackageUsedButNotInstalled` dan keyingi bosqich — o'rnatilgan, lekin noto'g'ri.

## Simptom (aynan shu)
- `npm install` paytida peer dependency warning.
- Runtime: `Invalid hook call`, `module not found` (ichki yo'l), yoki kutilmagan xato.
- Ikki xil versiyadagi bir xil paket (masalan React 17 va 18 birga).
- Kod "to'g'ri", lekin muhitda ishlamaydi.

## Sabab (100%)
- Noto'g'ri major versiya o'rnatilgan (API o'zgargan).
- Peer dependency qondirilmagan (masalan `react-router` React versiyasini talab qiladi).
- AI eng so'nggi versiyani qo'yadi, lekin loyiha eski stack'da.
- Yoki aksincha — eski versiya, yangi API ishlatilgan.

## Tasdiqlash
1. `package.json` dagi versiyani va `node_modules` dagi haqiqiy versiyani solishtiring.
2. `npm ls xxx` yoki `npm why xxx` — conflict bormi?
3. Install logida peer dependency warning bormi?
4. Xato matnida versiya yoki "peer" so'zi bormi?

## Tuzatish (aynan shu)
Versiyani moslashtiring yoki peer'ni qondiring:

```bash
# Conflict'ni ko'rish:
npm ls react
npm why react-router-dom

# Mos versiya o'rnatish:
npm install react@18.2.0 react-dom@18.2.0

# Yoki package.json'da aniq versiya:
"react": "^18.2.0",
"react-dom": "^18.2.0"

# Peer warning'ni jiddiy qabul qiling — ko'pincha runtime xatoga olib keladi
```

Qoida: yangi paket qo'shganda peer dependency'larni o'qing. Loyihadagi asosiy paketlar (React, Vue, Next) versiyasiga mos kelishini tekshiring.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- O'rnatilgan ≠ to'g'ri versiya.
- Peer dependency warning'ni e'tiborsiz qoldirmang.
- AI eng yangi versiyani qo'yib, loyiha stack'iga mos kelmasligini unutadi.
