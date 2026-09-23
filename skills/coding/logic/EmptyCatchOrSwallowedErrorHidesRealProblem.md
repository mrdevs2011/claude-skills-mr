---
name: empty-catch-swallows-error
description: try/catch yozilgan, lekin catch bo'sh yoki faqat console.log — xato yutiladi, asl muammo yashirin qoladi, keyinroq boshqa joyda chiqadi.
---

# Bo'sh catch: xatoni yutib yuborish

## Nima uchun bu skill kerak
AI "xato bo'lmasin" deb `try/catch` qo'yadi, lekin `catch` ichida hech narsa qilmaydi yoki faqat `console.log(e)` yozadi. Xato yo'qoladi, lekin asl muammo (noto'g'ri ma'lumot, tarmoq xatosi, ruxsat yo'qligi) qoladi. Foydalanuvchi "ishlamayapti" deb qoladi, log esa jim.

## Simptom (aynan shu)
- Kod "xatosiz" ishlaydi, lekin natija bo'sh / default / kutilmagan.
- `catch (e) {}` yoki `catch (e) { console.log(e) }` bor.
- Yoki `catch` da faqat `return null` / `return []` — sababsiz.
- Haqiqiy xato faqat chuqurroq log qilinsa ko'rinadi.

## Sabab (100%)
AI xato chiqmasligi uchun eng oson yo'lni tanlaydi — yutib yuborish. "Baribir ishlasin" deb o'ylaydi va xatoni qayta tashlash, foydalanuvchiga aytish yoki to'g'ri fallback qilishni o'tkazib yuboradi. Bu `FixedSymptomInsteadOfRootCause` ning aniqroq ko'rinishi.

## Tasdiqlash
1. `try/catch` joylarini toping.
2. `catch` ichida nima bor?
   - Bo'shmi?
   - Faqat logmi?
   - Faqat default qiymat qaytarmami?
3. Agar ha — xato yutilayotgan bo'lishi mumkin.

## Tuzatish (aynan shu)
Xatoni yashirmang — qayta tashlang, to'g'ri fallback qiling yoki foydalanuvchiga aniq ayt:

```js
// XATO:
try {
  const data = await fetchUser(id);
} catch (e) {
  // bo'sh — xato yo'qoldi
}

// XATO:
try {
  const data = await fetchUser(id);
} catch (e) {
  console.log(e);
  return null;  // sababsiz null
}

// TO'G'RI — qayta tashlash (yuqoriga uzatish):
try {
  const data = await fetchUser(id);
} catch (e) {
  throw new Error(`User ${id} yuklanmadi: ${e.message}`);
}

// TO'G'RI — aniq fallback + log:
try {
  const data = await fetchUser(id);
} catch (e) {
  logger.error('fetchUser failed', { id, error: e.message });
  return { id, name: 'Noma\'lum', isFallback: true };
}
```

Qoida: `catch` da kamida bittasi bo'lishi kerak — log + qayta tashlash, yoki log + aniq fallback. Bo'sh catch deyarli hech qachon to'g'ri emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Bo'sh `catch` = xatoni yashirish, tuzatish emas.
- Xato chiqmasligi uchun yutib yuborish — AI eng ko'p qiladigan yomon amaliyot.
- `catch` da: log qil, keyin qayta tashla yoki aniq fallback ber.