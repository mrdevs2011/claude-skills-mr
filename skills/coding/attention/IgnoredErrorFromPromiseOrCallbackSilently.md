---
name: ignored-promise-or-callback-error
description: Promise yoki callback xatosi ushlanmagan yoki e'tiborsiz qoldirilgan — .catch yo'q, void async, yoki callback'da err tekshirilmagan. Xato jim yo'qoladi.
---

# Promise/callback xatosini e'tiborsiz qoldirish

## Nima uchun bu skill kerak
AI async chaqiruv yozadi, lekin xato yo'lini umuman o'ylamaydi: `.catch` yo'q, `void fetch(...)`, yoki Node callback'da `if (err)` yo'q. Xato chiqadi, lekin hech kim ko'rmaydi — unhandled rejection yoki jim muvaffaqiyatsizlik. Bu `UnhandledPromiseRejection` skilliga yaqin, lekin kengroq: nafaqat crash, balki umuman e'tiborsizlik.

## Simptom (aynan shu)
- UnhandledPromiseRejection ogohlantirishi (yoki Node 15+ da crash).
- Yoki xato umuman ko'rinmaydi — funksiya "tugadi", lekin ish bajarilmagan.
- `void someAsync()` yoki `someAsync()` (await/catch yo'q).
- Callback: `fs.readFile(path, (err, data) => { use(data) })` — `err` tekshirilmagan.

## Sabab (100%)
AI "happy path" ni yozadi va xato holatini tashlab ketadi. Yoki `await` qo'shishni xohlamaydi deb `void` bilan chaqiradi. Natijada xato yutiladi yoki faqat runtime ogohlantirishida qoladi.

## Tasdiqlash
1. Async chaqiruvlarni toping: `fetch`, `fs.`, `axios`, custom async.
2. Har birida: `await` + `try/catch`, yoki `.catch()`, yoki callback'da `err` tekshiruvi bormi?
3. Agar yo'q — xato e'tiborsiz qolinishi mumkin.

## Tuzatish (aynan shu)
Xato yo'lini aniq yozing:

```js
// XATO — xato yo'qoladi:
void saveUser(user);
fetch('/api').then(r => r.json()); // catch yo'q
fs.readFile(path, (err, data) => {
  process(data); // err e'tiborsiz
});

// TO'G'RI:
try {
  await saveUser(user);
} catch (e) {
  logger.error('saveUser failed', e);
  throw e; // yoki aniq fallback
}

fetch('/api')
  .then(r => r.json())
  .catch(e => {
    logger.error('fetch failed', e);
  });

fs.readFile(path, (err, data) => {
  if (err) {
    logger.error(err);
    return;
  }
  process(data);
});
```

Qoida: har bir async chaqiruvda xato yo'li bo'lishi shart. `void` faqat chinakam "fire and forget" va xato muhim bo'lmaganda.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Happy path yozish yetarli emas — xato yo'li ham kerak.
- `void async()` va catch'siz `.then` — xatoni yashirish.
- AI xato holatini tashlab ketishi eng ko'p jim muvaffaqiyatsizlik sababi.