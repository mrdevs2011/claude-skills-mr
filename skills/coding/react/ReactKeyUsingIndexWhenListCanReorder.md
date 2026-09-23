---
name: react-key-index-when-reorderable
description: Ro'yxat qo'shiladi/o'chiriladi/tartiblanadi, lekin key={index} — elementlar chalkashadi, input state sakraydi. Mavjud MissingKey skillining aniqroq holati.
---

# React: tartiblanadigan ro'yxatda key={index}

## Nima uchun bu skill kerak
AI `key={index}` qo'yadi. Ro'yxat o'zgarmasa — ishlaydi. Lekin qo'shish, o'chirish, sort qilinsa — React noto'g'ri component instance'ni qayta ishlatadi. Input qiymatlari sakraydi, animatsiya buziladi. Bu MissingKey skillining eng xavfli kichik holati.

## Simptom (aynan shu)
- Ro'yxatdan o'rtadagi element o'chirilganda boshqa qatorning inputi o'zgaradi.
- Sort/drag-drop dan keyin state chalkashadi.
- `key={index}` yoki `key={i}` ishlatilgan.
- Ro'yxat dinamik (CRUD, reorder).

## Sabab (100%)
Index pozitsiyaga bog'liq. Element siljiganda index o'zgaradi — React boshqa element deb o'ylaydi yoki eski state'ni yangi elementga beradi. Barqaror `id` kerak.

## Tasdiqlash
1. `.map` da `key={index}` yoki `key={i}` bormi?
2. Ro'yxat qo'shiladi/o'chiriladi/sort qilinadimi?
3. Agar ha — index key xavfli.

## Tuzatish (aynan shu)
Barqaror unique id ishlating:

```jsx
// XATO — reorder da buziladi:
{items.map((item, index) => (
  <Row key={index} item={item} />
))}

// TO'G'RI:
{items.map(item => (
  <Row key={item.id} item={item} />
))}

// id yo'q bo'lsa — yaratishda bering:
const newItem = { id: crypto.randomUUID(), ...data };
```

Qoida: dinamik ro'yxat = `key={item.id}` (yoki boshqa barqaror unique). Index faqat static, hech qachon o'zgarmaydigan ro'yxatda.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `key={index}` reorder/delete da state chalkashtiradi.
- Barqaror id majburiy.
- AI index ni "oson" deb qo'yadi — dinamik ro'yxatda xavfli.
