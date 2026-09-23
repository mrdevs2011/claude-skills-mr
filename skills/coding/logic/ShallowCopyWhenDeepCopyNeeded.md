---
name: shallow-copy-when-deep-needed
description: Object.assign yoki spread {...obj} / [...arr] ishlatilgan, lekin ichki obyektlar hali shared — nested o'zgarish aslini ham o'zgartiradi.
---

# Shallow copy: deep copy kerak edi

## Nima uchun bu skill kerak
AI "nusxa olish" uchun `{...obj}` yoki `Object.assign({}, obj)` yozadi. Bu faqat birinchi daraja. Ichidagi massiv/obyekt referens bo'lib qoladi. Nested maydonni o'zgartirish asl obyektni ham o'zgartiradi. React state, config, clone da tez uchraydi.

## Simptom (aynan shu)
- "Nusxa" o'zgarganda asl ham o'zgaradi.
- Nested `user.address.city = ...` asl user ni ham o'zgartiradi.
- `{...state, nested: {...}}` to'liq qilinmagan.
- `JSON.parse(JSON.stringify())` yoki structuredClone ishlatilmagan, lekin deep kerak.

## Sabab (100%)
Spread/assign = shallow. AI "nusxa" deb hisoblaydi, nested referenslarni unutadi.

## Tasdiqlash
1. Nusxa olish joyini toping (`{...}`, `Object.assign`, `slice`).
2. Obyektda nested obyekt/massiv bormi?
3. Nested o'zgartiriladimi?
4. Agar ha va faqat shallow — muammo.

## Tuzatish (aynan shu)
Kerakli chuqurlikda nusxa oling:

```js
// XATO — shallow:
const copy = { ...user };
copy.address.city = 'Tashkent'; // user.address ham o'zgaradi!

// TO'G'RI — nested ham nusxa:
const copy = {
  ...user,
  address: { ...user.address, city: 'Tashkent' }
};

// TO'G'RI — to'liq deep (oddiy JSON-safe ma'lumot):
const copy = structuredClone(user);
// yoki
const copy = JSON.parse(JSON.stringify(user));

// Massiv ichida obyekt:
const copyList = list.map(item => ({ ...item }));
```

Qoida: nested o'zgarish bo'lsa — nested ham spread qiling yoki deep clone ishlating.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `{...obj}` = faqat birinchi daraja.
- Nested shared referens = asl ham o'zgaradi.
- AI shallow ni deep deb ishlatadi.