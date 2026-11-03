---
name: javascript-mutable-default-parameter-shared-state
description: JavaScript da funksiya default parametri sifatida object yoki array ishlatish barcha chaqiruvlar orasida shared mutable state yaratadi — undefined tekshir va ichida yarat.
---

# JavaScript da mutable default parametr shared state ga olib keladi

## Nima uchun bu skill kerak
JS da default parameterlar funksiya define qilinganda bir marta baholanadi. Object yoki array default sifatida berilsa, u bitta instance bo'lib, barcha chaqiruvlar shu objectni mutate qiladi. AI modellar Python dagi mutable default kabi xatoni JS da ham qiladilar.

## Simptom (aynan shu)
Funksiya `function f(opts = {})` yoki `function f(arr = [])` ko'rinishida, va ichida opts.property = ... yoki arr.push() qilinadi. Keyingi chaqiruvlarda oldingi o'zgarishlar saqlanib qoladi, kutilmagan shared state.

## Sabab (100%)
Default parameter qiymatlari funksiya object yaratilganda (ya'ni script yuklanganda) bir marta hisoblanadi va saqlanadi. Mutable qiymat (object, array) shu bitta referensni barcha chaqiruvlarga beradi.

## Tasdiqlash
- `function f(a = {}) { a.x = (a.x || 0) + 1; return a; } f(); f();` — ikkinchi chaqiruvda x=2 bo'ladi.
- Kodda default param sifatida `{}` yoki `[]` yozilgan va ichida mutate qilinganini qidir.

## Tuzatish (aynan shu)
Default ni undefined qoldir va funksiya ichida yangi object/array yarat.

```javascript
// Noto'g'ri
function addItem(item, list = []) {
  list.push(item);
  return list;
}
addItem(1); // [1]
addItem(2); // [1, 2]  — shared!

// To'g'ri
function addItem(item, list) {
  if (list === undefined) list = [];
  list.push(item);
  return list;
}

// Yoki
function addItem(item, list = undefined) {
  const arr = list ?? [];
  arr.push(item);
  return arr;
}
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JS default parametr sifatida object yoki array ishlatma — u shared bo'ladi. Ichida yangi yarat yoki undefined tekshir. Bu kutilmagan state buglarini oldini oladi.
