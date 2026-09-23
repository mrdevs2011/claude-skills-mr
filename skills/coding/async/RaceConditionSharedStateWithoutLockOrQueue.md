---
name: race-condition-shared-state
description: Bir nechta async operatsiya bir xil o'zgaruvchi/state'ni parallel o'zgartiradi — natija tartibsiz, yo'qolgan yozuv yoki noto'g'ri qiymat. Promise.all yoki parallel chaqiruvlarda ko'p uchraydi.
---

# Race condition: umumiy state parallel o'zgaradi

## Nima uchun bu skill kerak
AI bir nechta async vazifani parallel ishga tushiradi (`Promise.all`, parallel `fetch`, bir vaqtda bir nechta `setState`) va ular bir xil o'zgaruvchi yoki state'ni o'qiydi/yozadi. Tartib kafolatlanmagani uchun ba'zan to'g'ri, ba'zan noto'g'ri natija chiqadi. Bu intermittent (ba'zan chiqadigan) bug — topish qiyin.

## Simptom (aynan shu)
- Kod ba'zan to'g'ri, ba'zan noto'g'ri ishlaydi (ayniqsa sekin tarmoqda yoki ko'p ma'lumotda).
- Bir xil input bilan turli natija.
- State/yozuv "yo'qoladi" yoki eski qiymat qayta yoziladi.
- `Promise.all` yoki parallel chaqiruvlar atrofida uchraydi.

## Sabab (100%)
Bir nechta async operatsiya bir xil shared state'ni sinxronsiz o'zgartiradi. AI parallel qilishni yaxshi deb biladi, lekin ular orasidagi bog'liqlikni (biri ikkinchisining natijasiga bog'liq, yoki bir xil joyga yozish) hisobga olmaydi. Mavjud `AsyncRaceConditionDependentTasksStartedInParallelWithPromiseAll` skilliga o'xshash, lekin umumiyroq — nafaqat dependent tasks, balki shared mutable state ham.

## Tasdiqlash
1. Parallel ishga tushirilgan joylarni toping (`Promise.all`, bir nechta `await`siz chaqiruv).
2. Ular bir xil o'zgaruvchi, massiv, obyekt yoki state'ni o'qiydimi/yozadimi?
3. Tartib muhimmi? (biri tugamasdan ikkinchisi boshlansa muammo)
4. Agar ha — race mumkin.

## Tuzatish (aynan shu)
Yoki ketma-ket qiling, yoki shared state'ni bo'ling, yoki natijalarni oxirida birlashtiring:

```js
// XATO — parallel, shared state:
let total = 0;
await Promise.all(items.map(async item => {
  const n = await getCount(item);
  total += n;  // race: total parallel o'zgaradi
}));

// TO'G'RI — avval parallel ol, keyin birlashtir:
const counts = await Promise.all(items.map(item => getCount(item)));
const total = counts.reduce((a, b) => a + b, 0);

// XATO — bog'liq vazifalar parallel:
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(user.id),  // user hali yo'q!
]);

// TO'G'RI — ketma-ket:
const user = await getUser(id);
const posts = await getPosts(user.id);
```

Qoida: parallel qilish faqat **mustaqil** operatsiyalar uchun. Shared state yoki bog'liqlik bo'lsa — ketma-ket yoki natijani oxirida birlashtirish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Parallel + shared mutable state = race condition.
- Avval mustaqil ekanini tekshir, keyin `Promise.all`.
- Intermittent bug ko'pincha shu yerdan chiqadi.
