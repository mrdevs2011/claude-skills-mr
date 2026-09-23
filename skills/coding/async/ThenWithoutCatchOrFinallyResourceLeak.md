---
name: then-without-catch-resource-leak
description: .then() zanjiri bor, lekin .catch() yo'q — xato unhandled. Yoki loading/resource finally da tozalanmagan (spinner aylanib qoladi).
---

# .then bor, .catch yo'q (yoki finally da tozalanmagan)

## Nima uchun bu skill kerak
AI Promise zanjirini `.then` bilan yozadi va xato yo'lini qoldiradi. Yoki loading state ni `true` qilib, xato/success da `false` qilishni unutadi — spinner aylanib qoladi. Bu floating promise va ignored error'ning Promise zanjiri shakli.

## Simptom (aynan shu)
- UnhandledPromiseRejection.
- Loading indicator hech qachon o'chmaydi (xato bo'lganda).
- `.then(...).then(...)` — oxirida `.catch` yo'q.
- `setLoading(true)` bor, lekin `setLoading(false)` faqat success da.

## Sabab (100%)
Happy path `.then` da yozilgan, xato va cleanup unutilgan. Yoki `finally` ishlatilmagan.

## Tasdiqlash
1. `.then` zanjirlarini toping.
2. Oxirida `.catch` bormi?
3. Loading/resource ochilgan joyda — yopish success va error ikkalasida ham bormi? (`finally`)
4. Agar yo'q — shu.

## Tuzatish (aynan shu)
catch va finally qo'shing:

```js
// XATO:
setLoading(true);
fetch('/api')
  .then(r => r.json())
  .then(data => {
    setData(data);
    setLoading(false);  // faqat success
  });
// xato bo'lsa — loading true qoladi, unhandled rejection

// TO'G'RI:
setLoading(true);
fetch('/api')
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(data => setData(data))
  .catch(e => {
    logger.error(e);
    setError(e.message);
  })
  .finally(() => setLoading(false));

// Yoki async/await:
setLoading(true);
try {
  const data = await fetchJson('/api');
  setData(data);
} catch (e) {
  setError(e.message);
} finally {
  setLoading(false);
}
```

Qoida: har bir `.then` zanjirida `.catch` bo'lsin. Loading/resource — `finally` da yoping.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `.then` = `.catch` ham kerak.
- Loading ni faqat success da o'chirish — xato da aylanib qoladi.
- AI happy path yozib, cleanup va xato yo'lini unutadi.
