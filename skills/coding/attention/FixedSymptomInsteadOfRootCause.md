---
name: fixed-symptom-not-root-cause
description: Xato "tuzatilgandek" ko'rinadi, lekin asl sabab joyida qolgan — AI faqat simptomni yashirgan (try/catch, optional chaining, default qiymat) yoki noto'g'ri joyni o'zgartirgan.
---

# Simptomni tuzatish, ildizni qoldirish

## Nima uchun bu skill kerak
AI xatoni ko'rib, eng yaqin joyni "yamab" qo'yadi: `?.` qo'shadi, `try/catch` bilan yutib yuboradi, default qiymat beradi, yoki umuman boshqa faylni o'zgartiradi. Xato yo'qoladi, lekin asl sabab (noto'g'ri API chaqiruvi, yo'q argument, race, noto'g'ri ma'lumot) joyida qoladi. Keyinroq boshqa joyda yana chiqadi. Bu e'tiborsizlikning eng xavfli shakli.

## Simptom (aynan shu)
- Xato endi chiqmayapti.
- Lekin:
  - Natija bo'sh / default / "skip" bo'lib qoladi.
  - Boshqa o'xshash joyda xato yana paydo bo'ladi.
  - Logda asl muammo hali ham ko'rinadi (masalan API 404 qaytaryapti).
- Foydalanuvchi "tuzatildi" deb o'ylaydi, lekin aslida muammo yashirilgan.

## Sabab (100%)
AI stack trace yoki xato xabaridagi **birinchi** joyni tuzatishga shoshiladi, sababni qidirishni to'xtatadi. Tipik "yamash"lar:
- `user.profile.name` → `user?.profile?.name ?? ''` (aslida `user` umuman kelmayapti)
- `await fetch(...)` xatosini `try/catch` bilan yutib, bo'sh massiv qaytarish
- Noto'g'ri faylda "tuzatish" (masalan UI'da default qo'yish, backend'dagi bug'ni qoldirish)

## Tasdiqlash
1. Xato yo'qolgach, **asl manbani** tekshiring: API javobi, funksiya argumenti, DB so'rovi.
2. `?.` yoki `try/catch` yoki default qiymat qo'shilgan joyni toping.
3. O'sha qiymat **nima uchun** `null`/`undefined`/xato bo'layotganini so'rang.
4. Agar javob "bilmayman, shuning uchun yashirdim" bo'lsa — bu aynan simptomni tuzatish.

## Tuzatish (aynan shu)
Yamashni olib tashlang va ildizni tuzating:

```js
// XATO (simptom yashirilgan):
const name = user?.profile?.name ?? 'Noma\'lum';
// aslida user hech qachon to'g'ri yuklanmayapti

// TO'G'RI (ildiz tuzatilgan):
// 1. Nega user null ekanini top (API, auth, id noto'g'ri...)
// 2. O'sha joyni tuzat
// 3. Faqat haqiqatan optional bo'lsa ?. qoldir
const name = user.profile.name; // endi user kafolatlangan
```

Qoida: `?.`, bo'sh `catch`, default qiymat — faqat holat **normal va kutilgan** bo'lsa ishlatiladi. Aks holda asl sababni topib tuzating.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Xato yo'qolishi = tuzatilgani emas. Asl manbani tekshirmasdan yashirish — eng ko'p AI chalg'ishi.
- Avval "nima uchun null/xato" deb so'rang, keyin kod yozing.
- `?.` va `try/catch` ni "tez tuzatish" vositasi sifatida ishlatmang.
