---
name: inverted-condition-opposite-behavior
description: Kod xatosiz ishlaydi, lekin natija teskari yoki kutilganidan farq qiladi — sabab shart (if/ternary/filter) teskari yozilgan yoki noto'g'ri o'zgaruvchi solishtirilgan.
---

# Teskari shart: kod ishlaydi, lekin natija noto'g'ri

## Nima uchun bu skill kerak
AI hozirgi kunda syntax xatosini deyarli qilmaydi. Eng xavfli xato — kod ishlaydi, xato chiqmaydi, lekin mantiq teskari. `if (isActive)` o'rniga `if (!isActive)`, `filter(x => x.done)` o'rniga `filter(x => !x.done)`, yoki `a > b` o'rniga `a < b`. Bu "chalishib ketish"ning eng jim shakli.

## Simptom (aynan shu)
- Hech qanday TypeError / ReferenceError yo'q.
- Kod "ishlayapti", lekin:
  - Ko'rsatilishi kerak bo'lgan narsa yashirinadi (yoki aksincha).
  - Filtr teskari ishlaydi.
  - Ruxsat berilishi kerak joyda rad etiladi.
- Foydalanuvchi "teskari ishlayapti" yoki "aksincha bo'lyapti" deb aytadi.

## Sabab (100%)
Shart ifodasi teskari yozilgan yoki solishtirilayotgan o'zgaruvchi noto'g'ri tanlangan. AI odatda:
- `!` ni qo'shib yoki olib tashlab yuboradi.
- `=== true` / `=== false` ni chalkashtiradi.
- `includes` / `!includes`, `some` / `every` ni almashtirib yuboradi.
- Ikki o'xshash nomli o'zgaruvchini (`isLoading` vs `isLoaded`) chalkashtiradi.

## Tasdiqlash
1. Kutilgan xatti-harakatni aniq yozib qo'ying: "X bo'lsa Y qilishi kerak".
2. Shu qarorni qabul qilayotgan `if` / ternary / `filter` / `&&` ifodasini toping.
3. Ifodani oddiy qilib qayta yozing yoki `console.log` bilan ikkala tomonni chiqaring.
4. Haqiqiy qiymat bilan kutilgan qiymatni solishtiring — teskari ekanini ko'ring.

## Tuzatish (aynan shu)
Shartni to'g'rilang, boshqa joyga tegmang:

```js
// XATO (teskari):
if (!user.isActive) {
  showDashboard();
}

// TO'G'RI:
if (user.isActive) {
  showDashboard();
}

// XATO (filter teskari):
const active = items.filter(i => !i.active);

// TO'G'RI:
const active = items.filter(i => i.active);
```

Agar ikkita o'xshash nom chalkashgan bo'lsa — nomlarni aniqroq qiling (`isLoading` vs `hasLoaded`).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Xato chiqmasa ham mantiq teskari bo'lishi mumkin — eng xavfli AI xatosi.
- Avval kutilgan xatti-harakatni aniq yozing, keyin shartni tekshiring.
- `!`, `=== false`, `filter` shartlarini alohida e'tibor bilan qarang.