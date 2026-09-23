---
name: null-falsy-zero-bug
description: Qiymat 0 yoki "" (bo'sh satr) bo'lganda kod uni xuddi undefined/null kabi "yo'q" deb noto'g'ri ishlaydi (masalan default qiymat bilan almashtiradi yoki xato deb hisoblaydi) — sabab aynan bitta, if(!value) tekshiruvi.
---

# "0" yoki bo'sh satr "yo'q qiymat" deb noto'g'ri ishlanadi

## Nima uchun bu skill kerak
Bu xato crash bermaydi — dastur "ishlayapti", lekin noto'g'ri natija
beradi, shuning uchun sezilmay qolishi mumkin. Bu skill aynan shu jim
xato turini bitta qarashda tanib olish uchun.

## Simptom (aynan shu)
- Foydalanuvchi/funksiya `0` yoki `""` (yoki `false`) qiymat bergan, lekin
  dastur uni xuddi hech narsa berilmagandek ("yo'q") ko'rib, default
  qiymat bilan almashtiradi yoki xato deb belgilaydi.
- Masalan: `count = 0` berilgan, lekin natijada default `10` ishlatiladi;
  yoki `""` (bo'sh input) berilgan, lekin "input yo'q" xatosi chiqadi,
  aslida foydalanuvchi ataylab bo'sh qiymat bergan bo'lishi mumkin.

## Sabab (100%)
Kodda `if (!value)` yoki `value || defaultQiymat` ishlatilgan. JavaScript'da
`0`, `""`, `false`, `NaN`, `null`, `undefined` — hammasi falsy, shuning
uchun bu tekshiruv "qiymat umuman yo'q" bilan "qiymat 0/bo'sh/false" ni
farqlamaydi.

## Tasdiqlash
Muammoli joydagi tekshiruvni top: `if (!value)`, `value || X`, yoki
`value ? A : B` ko'rinishida bormi? Va shu `value` qonuniy ravishda `0`,
`""` yoki `false` bo'lishi mumkin bo'lgan turdami (masalan son yoki
matn maydoni)? Ikkalasi ham ha bo'lsa — aynan shu sabab.

## Tuzatish (aynan shu)
Faqat "umuman berilmagan" holatni tekshirish kerak bo'lsa, falsy emas,
aynan `null`/`undefined`ni tekshir:

```js
// XATO: 0 va "" ni ham "yo'q" deb hisoblaydi
const count = input.count || 10;
if (!input.name) throw new Error("name kerak");

// TO'G'RI: faqat null/undefined "yo'q" hisoblanadi
const count = input.count ?? 10; // ?? faqat null/undefined uchun ishlaydi
if (input.name == null) throw new Error("name kerak"); // == null: null va undefined ikkalasini ham tutadi, 0/""ni tutmaydi
```

`??` operatorini `||` o'rniga ishlat, qiymat qonuniy ravishda `0`/`""`/`false`
bo'lishi mumkin bo'lgan har bir joyda.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: `if(!value)`/`value || X` — `0`, `""`, `false`ni ham "yo'q" deb
  hisoblaydi.
- Tuzatish: `??` yoki `== null` bilan faqat aynan null/undefined'ni
  tekshirish.
