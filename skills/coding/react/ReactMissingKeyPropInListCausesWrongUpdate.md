---
name: react-missing-key-in-list
description: React ro'yxat renderida key yo'q yoki indeks ishlatilgan — elementlar noto'g'ri yangilanadi, input qiymati "sakrab" ketadi yoki animatsiya buziladi.
---

# React: ro'yxatda key yo'q yoki indeks key

## Nima uchun bu skill kerak
AI `.map` bilan ro'yxat chizganda `key` ni unutadi yoki `key={index}` qo'yadi. Konsolda ogohlantirish chiqishi mumkin, lekin asosiy muammo jim: elementlar noto'g'ri qayta ishlatiladi, inputlar chalkashadi, o'chirish/qo'shishda noto'g'ri element yangilanadi. Bu React'dagi eng ko'p uchraydigan "chalishib ketish".

## Simptom (aynan shu)
- Konsol: `Warning: Each child in a list should have a unique "key" prop`.
- Yoki ogohlantirish yo'q, lekin:
  - Ro'yxatdan element o'chirilganda boshqa elementning input qiymati o'zgaradi.
  - Tartib o'zgarganda component state "sakrab" ketadi.
  - Animatsiya yoki focus noto'g'ri elementda qoladi.

## Sabab (100%)
React elementlarni `key` orqali identifikatsiya qiladi. `key` yo'q yoki `index` bo'lsa — tartib o'zgaganda React noto'g'ri component instance'ni qayta ishlatadi. AI tez yozish uchun `key` ni tashlab ketadi yoki "indeks ham ishlaydi" deb o'ylaydi.

## Tasdiqlash
1. `.map` ishlatilgan JSX ni toping.
2. Har bir qaytarilayotgan elementda `key={...}` bormi?
3. `key={index}` yoki `key={i}` bo'lsa — barqaror identifikator yo'q.
4. Ro'yxat o'zgaradigan (qo'shish/o'chirish/tartiblash) bo'lsa — muammo chiqadi.

## Tuzatish (aynan shu)
Barqaror, unique identifikator ishlating:

```jsx
// XATO:
{items.map((item, index) => (
  <li>{item.name}</li>
))}

// XATO (indeks):
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// TO'G'RI:
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

Agar `id` bo'lmasa — yaratish vaqtida unique qiymat bering (uuid, yoki barqaror string). Indeks faqat ro'yxat hech qachon o'zgarmasa va tartib fixed bo'lsa ishlatiladi (deyarli hech qachon).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ro'yxatda `key` majburiy va barqaror bo'lishi kerak.
- `key={index}` — ko'p hollarda yashirin bug manbai.
- AI `key` ni unutishi yoki indeks qo'yishi eng ko'p React chalg'ishi.