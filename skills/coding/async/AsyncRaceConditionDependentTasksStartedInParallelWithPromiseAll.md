---
name: async-race-condition-parallel-start
description: Xato har safar bir xil emas — ba'zan to'g'ri ishlaydi, ba'zan noto'g'ri natija yoki "B ishlatilganda A hali tayyor emas" xatosi chiqadi — sabab aynan bitta, bir-biriga bog'liq async ishlar Promise.all bilan parallel boshlangan.
---

# Async: tasodifiy chiqadigan xato (race condition)

## Nima uchun bu skill kerak
"Ba'zan ishlaydi, ba'zan ishlamaydi" — bu turdagi xatolar odatda eng ko'p
vaqt yeydi, chunki qayta ishga tushirganda ko'pincha yo'qolib ketadi. Bu
skill aynan shu "tasodifiy" xatolarning bitta aniq sababiga qaratilgan.

## Simptom (aynan shu)
- Xato **har safar emas**, ba'zan chiqadi — bir xil kodni qayta ishga
  tushirsangiz ba'zan to'g'ri, ba'zan noto'g'ri natija beradi.
- Xato matni ko'pincha "X aniqlanmagan/tayyor emas edi" yoki natija
  kutilgan tartibda emas ekanini ko'rsatadi.

## Sabab (100%)
Ikki (yoki undan ko'p) async ish bor, biri ikkinchisining natijasiga
muhtoj (B ishi A tugagach boshlanishi kerak), lekin kodda ular
`Promise.all([taskA(), taskB()])` yoki alohida `.then()`siz parallel
boshlangan — shuning uchun B ba'zan A tugashidan oldin ishga tushib
qoladi.

## Tasdiqlash
Kodda `Promise.all([...])` yoki bir nechta `async` chaqiruv ketma-ket
`await`siz, alohida boshlangan joyni top. Ulardan biri ikkinchisining
natijasidan (o'zgaruvchisidan) foydalanadimi? Ha bo'lsa — aynan shu
sabab. Tasdiqlash uchun har bir ishning boshlanish/tugash vaqtini
vaqtinchalik `console.log(Date.now())` bilan chiqarib, tartibni ko'r.

## Tuzatish (aynan shu)
```js
// XATO: B, A natijasiga muhtoj, lekin parallel boshlangan
const [a, b] = await Promise.all([taskA(), taskB(a)]); // 'a' hali yo'q!

// TO'G'RI: bog'liq ishlarni ketma-ket bajar
const a = await taskA();
const b = await taskB(a);

// Bog'liq bo'lmagan ishlarni esa parallel qoldirish mumkin:
const [c, d] = await Promise.all([taskC(), taskD()]); // bir-biriga bog'liq emas
```

Faqat **bir-biriga bog'liq bo'lmagan** ishlarni `Promise.all` bilan
parallel boshla; bog'liq ishlarni ketma-ket `await` qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: bir-biriga bog'liq async ishlar parallel (`Promise.all`) bilan
  boshlangan, natija tartibi kafolatlanmagan.
- Tuzatish: bog'liq ishlarni ketma-ket `await` qilish, faqat mustaqil
  ishlarni parallel qoldirish.
