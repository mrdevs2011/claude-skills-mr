---
name: did-not-check-return-value-or-status
description: fetch/API chaqiruvi yoki funksiya natijasi tekshirilmagan — res.ok, status code, yoki null qaytish e'tiborsiz. Xato javob "muvaffaqiyatli" deb qabul qilinadi.
---

# Qaytish qiymati yoki status tekshirilmagan

## Nima uchun bu skill kerak
AI `fetch` yoki boshqa chaqiruv yozadi va darhol `.json()` qiladi yoki natijani ishlatadi. `res.ok`, status 4xx/5xx, yoki funksiya `null` qaytargani tekshirilmaydi. Server xato qaytarsa ham kod "ishlagandek" davom etadi — keyin TypeError yoki bo'sh ma'lumot. Bu happy path'ning aniq ko'rinishi.

## Simptom (aynan shu)
- API 401/404/500 qaytarganda ham kod xatosiz "davom etadi".
- `const data = await res.json()` — res.ok tekshirilmagan.
- Funksiya `null`/`undefined` qaytarishi mumkin, lekin chaqiruvchi tekshirmaydi.
- Foydalanuvchi "ba'zan ma'lumot yo'q" yoki "xato ko'rinmayapti" deb aytadi.

## Sabab (100%)
AI muvaffaqiyatli javobni kutadi va status/return tekshiruvini yozmaydi. `fetch` network xatosida throw qiladi, lekin HTTP xato statusida throw qilmaydi — shuni unutadi.

## Tasdiqlash
1. `fetch` / `axios` / custom request joylarini toping.
2. `res.ok` yoki `status` tekshiruvi bormi?
3. Natija ishlatilishidan oldin null/error tekshiruvi bormi?
4. Agar yo'q — shu.

## Tuzatish (aynan shu)
Har doim status va return ni tekshiring:

```js
// XATO:
const res = await fetch('/api/user');
const user = await res.json();
return user.name;

// TO'G'RI:
const res = await fetch('/api/user');
if (!res.ok) {
  throw new Error(`User yuklanmadi: ${res.status}`);
}
const user = await res.json();
if (!user) {
  throw new Error('User topilmadi');
}
return user.name;

// Yoki helper:
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

Qoida: tashqi chaqiruvdan keyin — status/ok tekshir, keyin ma'lumotni ishlat. Return null bo'lishi mumkin bo'lsa — tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `fetch` HTTP xatoda throw qilmaydi — o'zingiz tekshiring.
- Return qiymatini ishlatishdan oldin null/error holatini yozing.
- AI status tekshiruvini tashlab, faqat happy path yozadi.