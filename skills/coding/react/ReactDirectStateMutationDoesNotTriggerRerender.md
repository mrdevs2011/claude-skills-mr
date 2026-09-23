---
name: react-direct-state-mutation
description: React'da state o'zgargandek ko'rinadi, lekin UI yangilanmaydi yoki kutilmagan xatti-harakat — sabab state'ni to'g'ridan-to'g'ri mutate qilish (setState o'rniga).
---

# React: state'ni to'g'ridan-to'g'ri mutate qilish

## Nima uchun bu skill kerak
AI React kod yozganda eng ko'p qiladigan xatolardan biri — `state.push(...)`, `state.obj.field = ...`, `state[index] = ...` kabi to'g'ridan-to'g'ri o'zgartirish. React o'zgarishni sezmaydi, re-render bo'lmaydi yoki eski qiymat qoladi. Bu "kod to'g'ri ko'rinadi, lekin ishlamaydi" holatining klassik namunasi.

## Simptom (aynan shu)
- `setState` chaqirilmagan yoki chaqirilgan, lekin state ichidagi massiv/obyekt to'g'ridan-to'g'ri o'zgartirilgan.
- UI yangilanmaydi, yoki ba'zi qismlar eski qiymatni ko'rsatadi.
- Console'da xato yo'q (yoki faqat "Cannot update a component while rendering" kabi ogohlantirish).
- `useEffect` yoki boshqa joyda state o'zgarganini sezmaydi.

## Sabab (100%)
React state'ni **immutable** deb hisoblaydi. Agar siz mavjud massiv/obyektni o'zgartirsangiz (mutate), referens o'zgarmaydi — React "o'zgarish yo'q" deb o'tkazib yuboradi. AI ko'pincha oddiy JS uslubida yozadi va `setState`ni unutadi yoki eski referensni uzatadi.

## Tasdiqlash
1. `setXxx` chaqirilgan joyni top.
2. Undan oldin `state.push`, `state.xxx =`, `state[i] =`, `Object.assign(state, ...)` yoki shunga o'xshash mutate bormi?
3. Yangi massiv/obyekt yaratilganmi (`[...state]`, `{...state}`, `state.map(...)`) yoki eski referens uzatilganmi?

## Tuzatish (aynan shu)
Har doim **yangi** massiv/obyekt yarating:

```js
// XATO (mutate):
state.items.push(newItem);
setItems(state.items);          // referens o'zgarmagan

// yoki
state.user.name = 'Ali';
setUser(state.user);

// TO'G'RI:
setItems(prev => [...prev, newItem]);

setUser(prev => ({ ...prev, name: 'Ali' }));

// massiv ichidagi elementni o'zgartirish:
setItems(prev => prev.map((item, i) =>
  i === index ? { ...item, done: true } : item
));
```

`useState` qaytargan qiymatni hech qachon to'g'ridan-to'g'ri o'zgartirmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- React state'ni mutate qilish = re-render bo'lmaydi.
- Har doim yangi referens yarating (`...`, `map`, `filter`).
- AI oddiy JS mutate uslubini React'ga ko'chirib yuborishi eng ko'p uchraydigan sabab.