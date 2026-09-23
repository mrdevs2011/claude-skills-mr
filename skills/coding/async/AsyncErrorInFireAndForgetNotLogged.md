---
name: async-fire-and-forget-error-not-logged
description: void asyncFn() yoki fire-and-forget chaqiruvda xato ushlanmagan va log qilinmagan — xato butunlay jim yo'qoladi, debugging qiyin.
---

# Fire-and-forget: xato log qilinmagan

## Nima uchun bu skill kerak
AI fon vazifasini `void saveLog()` yoki `saveLog()` (await siz) qilib chaqiradi va xato yo'lini yozmaydi. Asosiy oqim davom etadi, lekin fon xatosi hech qayerda ko'rinmaydi. Keyin "nima uchun saqlanmadi?" deb qolinadi. Bu ignored error'ning aniq fire-and-forget shakli.

## Simptom (aynan shu)
- `void someAsync()` yoki `someAsync()` (bog'lanmagan).
- Fon ish ba'zan bajarilmaydi, lekin hech qanday log/xato yo'q.
- UnhandledRejection ogohlantirishi (yoki umuman jim).
- Analytics, log, email, cache update kabi "ikkinchi darajali" vazifalar.

## Sabab (100%)
"Asosiy javobni kutmayman" deb fire-and-forget qilinadi, lekin `.catch` yoki try/catch log bilan yozilmaydi. Xato yutiladi.

## Tasdiqlash
1. await/return qilinmagan async chaqiruvlarni toping.
2. Ularda `.catch` yoki ichki try/catch + log bormi?
3. Agar yo'q — xato jim yo'qolishi mumkin.

## Tuzatish (aynan shu)
Fire-and-forget bo'lsa ham xatoni log qiling:

```js
// XATO — xato yo'qoladi:
void saveAnalytics(event);
sendEmail(user); // await yo'q, catch yo'q

// TO'G'RI — kamida log:
void saveAnalytics(event).catch(e => logger.error('analytics failed', e));

// TO'G'RI — yoki ichida:
async function saveAnalytics(event) {
  try {
    await db.insert(event);
  } catch (e) {
    logger.error('analytics failed', e);
    // asosiy oqimni buzmaslik uchun qayta tashlamaslik mumkin
  }
}
void saveAnalytics(event);
```

Qoida: fire-and-forget = baribir `.catch` yoki ichki try/catch + log. Xatoni butunlay yashirmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- await qilmaslik = xatoni e'tiborsiz qoldirish emas.
- Fon vazifada ham log bo'lishi kerak.
- AI void qilib, catch yozmasdan xatoni yo'qotadi.
