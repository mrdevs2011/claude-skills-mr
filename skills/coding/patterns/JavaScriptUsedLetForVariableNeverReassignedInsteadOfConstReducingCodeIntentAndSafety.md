---
name: javascript-used-let-for-never-reassigned-variable-instead-of-const
description: JavaScript kodida o'zgaruvchi e'lon qilingan, lekin keyinchalik hech qachon qayta tayinlanmagan bo'lsa, `let` o'rniga `const` ishlatilishi kerak — aks holda niyat noaniq bo'ladi va tasodifiy qayta tayinlash xavfi oshadi.
---

# JavaScriptUsedLetForVariableNeverReassignedInsteadOfConstReducingCodeIntentAndSafety

## Nima uchun bu skill kerak
`let` va `const` farqi nafaqat sintaksis — u kodni o'qiydigan odamga (yoki agentga) "bu qiymat o'zgaradimi yoki yo'qmi" degan signal beradi. Hech qachon qayta tayinlanmaydigan o'zgaruvchi uchun `let` ishlatilsa, o'quvchi "bu yerda qayta tayinlash kutilmoqda" deb o'ylaydi. Bu kichik chalkashlik vaqt o'tishi bilan xatolarga olib keladi, ayniqsa refaktor yoki boshqa agent kodni o'zgartirganda.

## Simptom (aynan shu)
- O'zgaruvchi `let x = ...` bilan e'lon qilingan.
- Butun funksiya yoki modul bo'ylab `x = ...` hech qachon ishlatilmagan (faqat o'qish).
- Linter yoki TypeScript "prefer-const" xatosi chiqadi.
- Kodni o'qiganda "bu qiymat o'zgarishi mumkin" degan noto'g'ri taassurot paydo bo'ladi.

## Sabab (100%)
Agent yoki dasturchi odat bo'yicha `let` yozadi (eski `var` o'rniga), yoki "keyinchalik o'zgartirishim mumkin" deb o'ylaydi, lekin aslida o'zgartirmaydi. `const` ni faqat "haqiqatan o'zgarmas" deb hisoblaydi, holbuki qoida oddiy: qayta tayinlanmasa — `const`.

## Tasdiqlash
1. O'zgaruvchi e'lonini top: `let foo = ...`
2. Shu `foo` ga keyinchalik `=` bilan qiymat berilganmi? (`foo = ...` yoki `foo += ...`)
3. Agar yo'q bo'lsa — bu `const` bo'lishi kerak.
4. ESLint `prefer-const` qoidasi bilan tekshir.

## Tuzatish (aynan shu)
Faqat o'qiladigan o'zgaruvchilarni `const` qil:

```javascript
// Noto'g'ri
let userId = req.params.id;
let isAdmin = user.role === 'admin';
console.log(userId, isAdmin);

// To'g'ri
const userId = req.params.id;
const isAdmin = user.role === 'admin';
console.log(userId, isAdmin);
```

Agar keyinchalik haqiqatan qayta tayinlansa, u holda `let` to'g'ri.

Qoidalar:
- Default `const`.
- Faqat qayta tayinlash kerak bo'lganda `let`.
- `var` ishlatilmaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Hech qachon qayta tayinlanmaydigan o'zgaruvchi uchun `let` emas, `const` ishlat. Bu kod niyatini aniq qiladi, tasodifiy o'zgarishlarni oldini oladi va linter xatolarini kamaytiradi.
