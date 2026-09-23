---
name: null-cannot-read-property
description: Xato aynan "Cannot read properties of undefined (reading 'x')" yoki "Cannot read properties of null (reading 'x')" ko'rinishida — bitta aniq tashxis yo'li, taxmin qilish shart emas.
---

# "Cannot read properties of undefined/null (reading 'x')"

## Nima uchun bu skill kerak
Bu — JS/TS'dagi eng ko'p uchraydigan TypeError. Xato matni o'zi to'liq
javobni bermaydi (faqat maydon nomini ko'rsatadi), shuning uchun aniq
tashxis bosqichlari kerak — taxmin bilan tuzatish ko'pincha noto'g'ri
joyni "tuzatib" qo'yadi.

## Simptom (aynan shu)
Xato xabari aynan shu shaklda: `Cannot read properties of undefined
(reading 'someProp')` (yoki `null` bilan). Bu — TypeError, obyekt kutilgan
joyda `undefined`/`null` chiqqanini bildiradi.

## Sabab
Xato xabaridagi `'someProp'` o'zi emas — undan OLDIN turgan obyekt
(`something.someProp` dagi `something`) `undefined`/`null` bo'lib
chiqqan. Sabab har doim bitta: shu obyektni "har doim mavjud" deb
taxmin qilingan, lekin u kelmagan/topilmagan holat bo'lgan.

## Tasdiqlash — bosqichma-bosqich (taxminsiz)
1. Stack trace'dagi aniq fayl:qator raqamini top.
2. Shu qatordagi kodni ochib, `.someProp` dan oldingi ifodani (masalan
   `user.profile.someProp` bo'lsa — `user.profile`) top.
3. Shu qiymat qayerdan kelayotganini (funksiya argumenti, API javobi,
   massiv indeksi, obyekt kaliti) top va aynan shu joyda vaqtinchalik
   `console.log(JSON.stringify(user))` qo'yib, haqiqatan `undefined`
   ekanini tasdiqla — bu qadamni o'tkazib yubormaslik kerak.
4. Nega `undefined` ekanini top: odatda quyidagilardan biri —
   - API/DB javobida bu maydon yo'q edi (nomi o'zgargan yoki xato holat qaytgan).
   - Funksiyaga argument berilmagan yoki noto'g'ri tartibda berilgan.
   - Massiv bo'sh edi yoki indeks chegaradan tashqarida edi.
   - Natija hali `await` qilinmagan (agar shunday bo'lsa — `AsyncFunctionReturnsPendingPromiseInsteadOfValueMissingAwait` skiliga o't).

## Tuzatish
- Agar bu holat **normal/kutilgan** bo'lsa (masalan maydon optional): `user?.profile?.someProp` yoki `user.profile?.someProp ?? defaultQiymat`.
- Agar bu holat **normal EMAS**, ya'ni qiymat asli har doim bo'lishi
  SHART bo'lsa: `?.` bilan yashirma — 3-qadamda topilgan asl manbani
  (noto'g'ri API chaqiruvi, yo'q argument) tuzat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Xato matnidagi property nomi emas, undan OLDINGI obyekt aslida sabab.
- To'g'ri tashxis: obyekt qayerdan kelgani va nega bo'sh ekanini
  aniqlash, shundan keyingina `?.` yoki asl manbani tuzatish.
