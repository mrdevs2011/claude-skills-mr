---
name: react-useeffect-wrong-deps
description: useEffect dependency array yo'q, bo'sh yoki noto'g'ri — effekt keraksiz qayta ishlaydi, eski qiymatni ushlab qoladi (stale closure) yoki umuman ishlamaydi.
---

# React: useEffect dependency array noto'g'ri

## Nima uchun bu skill kerak
AI `useEffect` yozganda dependency array'ni unutadi, bo'sh `[]` qoldiradi, yoki kerakli qiymatni qo'shmaydi. Natijada: effekt har renderda ishlaydi, yoki hech qachon yangilanmaydi, yoki eski state/props'ni "eslab" qoladi. Bu React'dagi eng ko'p uchraydigan va eng qiyin topiladigan bug'lardan.

## Simptom (aynan shu)
- Effekt keraksiz darajada ko'p marta ishlaydi (loop, ortiqcha so'rov).
- Yoki bir marta ishlab, keyin yangi props/state'ga reagqilmaydi.
- Konsol: `React Hook useEffect has a missing dependency: 'xxx'`.
- Input o'zgarganda ro'yxat/so'rov yangilanmaydi (stale qiymat).

## Sabab (100%)
Dependency array noto'g'ri:
- Umuman yo'q → har renderda ishlaydi
- `[]` → faqat mount'da, keyin hech qachon
- Ichida ishlatilgan `state`/`props`/`funksiya` qo'shilmagan → stale closure
AI "bir marta ishlasin" deb `[]` qo'yadi yoki ogohlantirishni e'tiborsiz qoldiradi.

## Tasdiqlash
1. `useEffect` ichida qaysi state/props/funksiya ishlatilganini yozib chiqing.
2. Dependency array'da ularning hammasi bormi?
3. ESLint `exhaustive-deps` ogohlantirishi bormi?
4. Agar yo'q yoki noto'g'ri — shu.

## Tuzatish (aynan shu)
Effekt ichida ishlatilgan **barcha** qiymatlarni dependency'ga qo'shing:

```jsx
// XATO — deps yo'q (har renderda):
useEffect(() => {
  fetchUser(userId);
});

// XATO — bo'sh deps (faqat bir marta, userId o'zgarsa ishlamaydi):
useEffect(() => {
  fetchUser(userId);
}, []);

// XATO — userId ishlatilgan, lekin deps'da yo'q:
useEffect(() => {
  fetchUser(userId);
}, []);

// TO'G'RI:
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

Agar funksiya dependency bo'lsa — `useCallback` bilan o'rab qo'ying, aks holda har renderda yangi referens bo'lib, effekt qayta-qayta ishlaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `useEffect` deps — majburiy va to'liq bo'lishi kerak.
- `[]` = faqat mount. Kerakli qiymat o'zgarsa — qo'shing.
- Stale closure va ortiqcha so'rovlarning asosiy sababi shu.