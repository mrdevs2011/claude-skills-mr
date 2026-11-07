---
name: sequential-awaits-independent-ops
description: Independent async operations awaited one-by-one in sequence instead of Promise.all, causing unnecessary latency and longer total execution time.
---

# Sequential awaits for independent async work

## Nima uchun bu skill kerak
Agent yoki kod yozuvchi bir nechta bir-biriga bog'liq bo'lmagan async operatsiyalarni (masalan, bir nechta API chaqiruvi, fayl o'qish, database so'rovi) ketma-ket `await` qiladi. Bu barcha operatsiyalar parallel ishlashi mumkin bo'lsa-da, umumiy vaqtni sekinlashtiradi.

## Simptom (aynan shu)
- Bir nechta mustaqil `await fetch(...)`, `await db.query(...)` yoki `await someAsyncFn()` ketma-ket yozilgan.
- Umumiy bajarilish vaqti eng sekin operatsiya vaqti o'rniga barcha vaqtlarning yig'indisi bo'ladi.
- Network yoki I/O bound ishlar sekinroq tugaydi, loglarda sequential timing ko'rinadi.

## Sabab (100%)
Har bir `await` keyingi qator bajarilishini to'xtatadi. Operatsiyalar bir-birining natijasiga bog'liq bo'lmasa, ular parallel ishga tushirilishi mumkin edi, lekin kod sequential yozilgan.

## Tasdiqlash
1. Kodda ketma-ket `await` qatorlarini toping.
2. Har bir operatsiya oldingisining natijasiga bog'liq emasligini tekshiring (o'zgaruvchilar almashmaydi, mustaqil).
3. Agar mustaqil bo'lsa — bu aynan shu holat.

## Tuzatish (aynan shu)
```javascript
// Noto'g'ri (sequential):
const user = await fetchUser(id);
const posts = await fetchPosts(id);
const comments = await fetchComments(id);

// To'g'ri (parallel):
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id)
]);
```

Agar ba'zi operatsiyalar xato bersa ham davom etish kerak bo'lsa, `Promise.allSettled` ishlating.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mustaqil async ishlarni ketma-ket `await` qilish umumiy vaqtni keraksiz oshiradi.
- Tuzatish: ularni `Promise.all([...])` ichiga olib parallel ishga tushirish.
- Natijaga bog'liq bo'lgan operatsiyalar uchun sequential qoldirish to'g'ri.
