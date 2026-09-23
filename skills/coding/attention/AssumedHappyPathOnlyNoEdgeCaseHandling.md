---
name: assumed-happy-path-only
description: AI faqat muvaffaqiyatli holatni yozadi — bo'sh massiv, null, xato javob, chegaraviy qiymatlar uchun hech narsa yo'q. Edge case'da yiqiladi yoki noto'g'ri ishlaydi.
---

# Faqat happy path: edge case yo'q

## Nima uchun bu skill kerak
AI asosiy muvaffaqiyatli senariyni yozadi va to'xtaydi. Bo'sh ro'yxat, null javob, 0 element, tarmoq xatosi, noto'g'ri format — bular uchun kod yo'q. Ishlab chiqishda "ishlaydi", real ma'lumotda yiqiladi. Bu e'tibor chalg'ishi: "asosiysi ishlasin" deb, chegaralarni unutish.

## Simptom (aynan shu)
- Bo'sh massiv/obyekt kelganda crash yoki bo'sh ekran.
- API xato qaytarganda hech narsa ko'rsatilmaydi yoki TypeError.
- `data.map` — data null/undefined bo'lganda yiqiladi.
- Foydalanuvchi "ba'zan ishlamayapti" deb aytadi (ayniqsa bo'sh yoki xato holatda).

## Sabab (100%)
AI training va misollarda asosan happy path ko'radi. Edge case'larni (null, [], error, 0) ataylab yozishni unutadi yoki "keyin qo'shaman" deb qoldiradi.

## Tasdiqlash
1. Asosiy oqimni o'qing — muvaffaqiyatli holat yozilganmi?
2. Quyidagilar uchun kod bormi:
   - null / undefined javob
   - bo'sh massiv / bo'sh string
   - xato status (4xx, 5xx)
   - 0 yoki manfiy qiymat (agar relevant)
3. Agar yo'q — faqat happy path.

## Tuzatish (aynan shu)
Edge case'larni aniq yozing:

```js
// XATO — faqat happy path:
const names = data.map(u => u.name);
return <List items={names} />;

// TO'G'RI:
if (!data) {
  return <Error message="Ma'lumot yuklanmadi" />;
}
if (data.length === 0) {
  return <EmptyState />;
}
const names = data.map(u => u.name);
return <List items={names} />;

// XATO:
const res = await fetch('/api/user');
const user = await res.json();
return user.name;

// TO'G'RI:
const res = await fetch('/api/user');
if (!res.ok) {
  throw new Error(`User yuklanmadi: ${res.status}`);
}
const user = await res.json();
if (!user?.name) {
  return 'Noma\'lum';
}
return user.name;
```

Qoida: asosiy oqimdan keyin darhol so'rang — "null bo'lsa?", "bo'sh bo'lsa?", "xato bo'lsa?" va shu holatlarni yozing.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Happy path yetarli emas — edge case'siz kod realda yiqiladi.
- null, [], xato javob — eng ko'p unutiladigan holatlar.
- AI asosiy senariyni yozib, chegaralarni tashlab ketadi.