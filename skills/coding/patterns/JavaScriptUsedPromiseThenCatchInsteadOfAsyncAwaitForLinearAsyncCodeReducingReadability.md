---
name: javascript-used-promise-then-catch-instead-of-async-await-for-linear-async-code-reducing-readability
description: Ketma-ket async ishlarni `.then().catch()` zanjiri bilan yozganda o'qilishi qiyin va xato boshqaruvi murakkab; `async/await` + try/catch ishlatish kerak.
---

# Promise .then/.catch o'rniga async/await ishlatish

## Nima uchun bu skill kerak
`.then()` zanjirlari chuqur nesting yoki uzun zanjir yaratadi, xato boshqaruvi tarqoq bo'ladi. `async/await` chiziqli koddek o'qiladi, try/catch bilan xatolarni aniq ushlaydi.

## Simptom (aynan shu)
Kod uzun `.then(result => ...).then(...).catch(...)` zanjirlaridan iborat, ichki callback'lar, o'qish qiyin. Xato bir joyda ushlanadi, lekin oraliq natijalar yo'qolishi mumkin. Modern kodda async/await ustun.

## Sabab (100%)
Promise chaining callback hell'ga o'xshash, har bir then yangi scope. async/await sintaktik shakar — await to'xtatadi, try/catch oddiy exception kabi ishlaydi.

## Tasdiqlash
Kodda ketma-ket `.then(` ishlatilganini qidir, ayniqsa 2+ daraja. Misol:

```javascript
// Noto'g'ri
fetch(url)
  .then(res => res.json())
  .then(data => process(data))
  .catch(err => console.error(err));
```

## Tuzatish (aynan shu)
Funksiyani `async` qil, `await` ishlat, try/catch:

```javascript
// To'g'ri
async function loadAndProcess(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return process(data);
  } catch (err) {
    console.error(err);
    throw err;  // yoki handle
  }
}
```

Parallel kerak bo'lsa `Promise.all` saqlab qol, lekin chiziqli oqim uchun await.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Ketma-ket async ishlar uchun `.then/.catch` o'rniga `async/await` + try/catch ishlat. Kod chiziqli, o'qilishi oson, xato boshqaruvi aniq. Promise.all parallel uchun qoladi.
