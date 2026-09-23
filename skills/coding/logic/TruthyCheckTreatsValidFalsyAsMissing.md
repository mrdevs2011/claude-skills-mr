---
name: truthy-check-treats-valid-falsy-as-missing
description: if (value) yoki value || default ishlatilgan — 0, "" yoki false haqiqiy qiymat bo'lsa ham "yo'q" deb hisoblanadi. Mavjud FalsyZero skilliga o'xshash, lekin umumiyroq if/|| holatlari uchun.
---

# Truthy tekshiruv: 0 / "" / false ni "yo'q" deb olish

## Nima uchun bu skill kerak
AI `if (value)`, `value || default`, `value && doSomething()` yozadi. JavaScript'da `0`, `""`, `false` falsy. Agar ular haqiqiy, ruxsat etilgan qiymat bo'lsa (masalan miqdor 0, bo'sh izoh, o'chirilgan flag) — kod noto'g'ri yo'lga kiradi. Bu `FalsyZeroOrEmptyStringWronglyTreatedAsMissingValueBug` ning kengaytmasi — nafaqat nullish, balki umumiy truthy tekshiruvlar.

## Simptom (aynan shu)
- `0` kiritilganda "qiymat yo'q" deb hisoblanadi.
- Bo'sh string `""` default bilan almashtiriladi.
- `false` flag `true` defaultiga aylanadi.
- Kodda `if (x)`, `x || default`, `x && ...` ishlatilgan.

## Sabab (100%)
Truthy/falsy tekshiruv null/undefined bilan birga 0, "", false ni ham "yo'q" deb oladi. AI "qiymat bormi?" deb `if (value)` yozadi, lekin 0/""/false ham valid ekanini hisobga olmaydi.

## Tasdiqlash
1. `if (value)`, `value ||`, `value &&` joylarini toping.
2. `value` 0, "", yoki false bo'lishi mumkinmi? (miqdor, matn, boolean flag)
3. Agar ha — truthy tekshiruv noto'g'ri.

## Tuzatish (aynan shu)
Nullish tekshiruv ishlating (`??`, `!= null`, `!== undefined`):

```js
// XATO — 0 ni "yo'q" deb oladi:
const count = input || 10;
if (count) { show(count); }

// TO'G'RI:
const count = input ?? 10;           // faqat null/undefined da 10
if (count != null) { show(count); }  // 0 ham o'tadi

// XATO — "" ni default qiladi:
const name = userName || 'Mehmon';

// TO'G'RI (bo'sh string ruxsat etilsa):
const name = userName ?? 'Mehmon';

// XATO — false ni true qiladi:
const enabled = settings.enabled || true;

// TO'G'RI:
const enabled = settings.enabled ?? true;
```

Qoida: "bormi?" deb so'rasangiz va 0/""/false valid bo'lsa — `??` yoki `!= null` ishlating, `||` yoki `if (value)` emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `if (value)` va `||` 0, "", false ni ham "yo'q" deb oladi.
- Valid falsy qiymat bo'lsa — `??` yoki aniq null tekshiruv ishlating.
- AI "qulay" deb truthy yozib, 0/""/false ni yo'qotib qo'yadi.
