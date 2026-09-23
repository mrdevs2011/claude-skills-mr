---
name: told-user-to-run-without-explaining
description: AI foydalanuvchiga buyruq yoki qadam beradi, lekin nima uchun va nima qilishini tushuntirmaydi — foydalanuvchi ko'r-ko'rona bajaradi yoki ishonchsiz qoladi.
---

# Buyruq berish, lekin tushuntirmaslik

## Nima uchun bu skill kerak
AI "quyidagini ishga tushiring" deb yozadi va to'xtaydi. Nima uchun kerak, nima o'zgaradi, xavfli tomoni bormi — aytilmaydi. Foydalanuvchi ko'r-ko'rona bajaradi yoki bajarishdan qo'rqadi. Bu e'tibor chalg'ishi: yechimga e'tibor, foydalanuvchi tushunchasiga emas.

## Simptom (aynan shu)
- Javobda faqat buyruq: `npm install`, `rm -rf node_modules`, `git push --force`.
- Oldida yoki keyin "nima uchun" va "nima bo'ladi" yo'q.
- Xavfli buyruq (delete, force, migrate) ogohlantirishsiz.
- Foydalanuvchi "nima qiladi bu?" deb so'raydi.

## Sabab (100%)
AI yechimni biladi va darhol buyruq beradi. Foydalanuvchi nuqtai nazarini (tushunish, ishonch, xavf) hisobga olmaydi.

## Tasdiqlash
1. Javobda terminal/buyruq/qadam bormi?
2. Har birining oldida qisqa "nima uchun" va "nima qiladi" bormi?
3. Xavfli bo'lsa — ogohlantirish bormi?
4. Agar yo'q — shu.

## Tuzatish (aynan shu)
Har doim qisqa izoh bilan bering:

```
// XATO:
npm install
rm -rf node_modules
git push --force

// TO'G'RI:
# node_modules buzilgan bo'lishi mumkin — qayta o'rnatamiz:
rm -rf node_modules
npm install

# Diqqat: --force remote tarixni o'zgartiradi. Faqat o'zingizning branch'ingizda ishlating:
git push --force
```

Qoida: buyruq = izoh (nima uchun + nima bo'ladi). Xavfli bo'lsa — aniq ogohlantirish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Buyruq berish yetarli emas — tushuntirish kerak.
- Xavfli buyruq — majburiy ogohlantirish.
- AI yechimga shoshilib, foydalanuvchini e'tiborsiz qoldiradi.