---
name: javascript-preferred-promise-then-chain-over-async-await-for-sequential-operations
description: Sequential async operatsiyalar uchun uzoq .then() zanjiri ishlatilganda kod o'qish qiyin, xato boshqarish chalkash, va stack trace yomonlashadi. async/await ishlatish kerak.
---

# Sequential operatsiyalar uchun Promise.then zanjiri o'rniga async/await ishlatish

## Nima uchun bu skill kerak
JavaScript/TypeScript da ketma-ket (sequential) async ishlar (masalan API chaqiruv, keyin natija bilan boshqa chaqiruv) uchun `.then().then()` zanjiri "callback hell" ga o'xshash qiyin o'qiladigan kod yaratadi. Xatolarni ushlash va log qilish ham murakkablashadi. `async/await` esa oddiy sequential kodga o'xshab yoziladi va try/catch bilan aniqroq.

## Simptom (aynan shu)
Kodda ketma-ket bog'liq Promise'lar `.then()` orqali zanjirlangan, har birida return yoki yangi Promise. Masalan:

```javascript
fetch(url1)
  .then(res => res.json())
  .then(data => fetch(url2 + data.id))
  .then(res => res.json())
  .then(result => process(result))
  .catch(err => console.error(err));
```

Bu holatda kod chuqur indent, xato joyini aniqlash qiyin, va intermediate o'zgaruvchilar yo'q.

## Sabab (100%)
`.then()` chain — Promise API ning asosiy usuli, lekin sequential bog'liqlikda u funksiyalar ichida funksiyalar yaratadi. `async/await` (ES2017) shu zanjirni sintaktik shakar sifatida yashiradi, lekin agent eski uslubni tanlagan yoki o'qish qulayligini e'tiborsiz qoldirgan. Bu ayniqsa xato stack trace'ni yomonlashtiradi va debugni qiyinlashtiradi.

## Tasdiqlash
- Kodda sequential (birining natijasi keyingisiga kerak) async ishlar `.then` zanjiri bilan yozilganmi?
- `async function` va `await` ishlatilganmi yoki yo'qmi?
- Xato boshqarish faqat oxirida bitta `.catch` mi, yoki har bir qadamda aniq?
- Test: kichik misolni async/await ga o'tkazib, o'qish qulayligini solishtir.

## Tuzatish (aynan shu)
Ketma-ket bog'liq operatsiyalar uchun `async` funksiya va `await` ishlat. Parallel uchun `Promise.all` saqlab qol.

```javascript
// Noto'g'ri (then chain)
function fetchUserAndPosts(userId) {
  return fetch(`/users/${userId}`)
    .then(res => res.json())
    .then(user => fetch(`/posts?user=${user.id}`))
    .then(res => res.json())
    .then(posts => ({ user, posts }))
    .catch(err => {
      console.error('Failed:', err);
      throw err;
    });
}

// To'g'ri (async/await)
async function fetchUserAndPosts(userId) {
  try {
    const userRes = await fetch(`/users/${userId}`);
    const user = await userRes.json();
    const postsRes = await fetch(`/posts?user=${user.id}`);
    const posts = await postsRes.json();
    return { user, posts };
  } catch (err) {
    console.error('Failed:', err);
    throw err;
  }
}
```

Agar faqat parallel bo'lsa, `Promise.all` yoki `Promise.allSettled` ishlat. Then zanjirini faqat oddiy bitta transformatsiya uchun qoldir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Sequential async kod uchun doim `async/await` + try/catch ishlat — o'qish oson, xato aniq, debug yaxshi. `.then` zanjirini faqat qisqa yoki parallel holatlarda ishlat. Bu kod sifatini oshiradi va agent ishlab chiqaradigan kodni professional qiladi.
