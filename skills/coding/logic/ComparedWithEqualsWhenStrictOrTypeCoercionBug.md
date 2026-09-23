---
name: equals-vs-strict-equals-coercion
description: == yoki != ishlatilgan, tip majburlash (coercion) tufayli kutilmagan tenglik chiqadi — "0" == 0, null == undefined, "" == false kabi tuzoqlar.
---

# == vs === : tip majburlash tuzog'i

## Nima uchun bu skill kerak
AI ba'zan `==` yozadi (yoki mavjud kodda qoldiradi). JavaScript tip majburlash qiladi: `"0" == 0` true, `null == undefined` true, `"" == false` true. Natijada shart kutilganidan boshqacha ishlaydi. Xato chiqmaydi, lekin mantiq buziladi. Bu jim va xavfli.

## Simptom (aynan shu)
- Shart ba'zan to'g'ri, ba'zan "nima uchun true/false bo'lyapti?" deb qolinadi.
- `"0"`, `0`, `""`, `false`, `null`, `undefined` aralashgan joylarda.
- Kod `==` yoki `!=` ishlatadi.
- TypeScript bo'lsa ham, `any` yoki oddiy JS joylarida uchraydi.

## Sabab (100%)
`==` tip majburlash qiladi. AI yoki eski kod `===` o'rniga `==` yozgan. Eng xavfli juftliklar:
- `null == undefined` → true
- `"" == false` → true
- `"0" == 0` → true
- `[] == false` → true

## Tasdiqlash
1. Shart ifodasida `==` yoki `!=` bormi?
2. Solishtirilayotgan qiymatlar turli tipda bo'lishi mumkinmi? (string/number, null/undefined)
3. Agar ha — coercion xavfi bor.

## Tuzatish (aynan shu)
Har doim `===` va `!==` ishlating:

```js
// XATO:
if (value == null) { ... }      // null va undefined ikkalasini ham oladi (ba'zan kerak, ba'zan yo'q)
if (count == 0) { ... }         // "0" ham true bo'ladi
if (input == false) { ... }     // "" ham true

// TO'G'RI:
if (value === null) { ... }
if (value === undefined) { ... }
// yoki ikkalasi kerak bo'lsa:
if (value == null) { ... }      // bu maxsus holat — qabul qilinadi, lekin ataylab

if (count === 0) { ... }
if (input === false) { ... }
if (input === '') { ... }
```

Qoida: default `===`. Faqat `null` va `undefined` ni birga tekshirish kerak bo'lsa — `== null` ataylab ishlatiladi (va izoh yoziladi).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `==` tip majburlash qiladi — kutilmagan true/false.
- Default sifatida `===` / `!==` ishlating.
- AI yoki eski kod `==` qoldirishi jim mantiq xatosiga olib keladi.
