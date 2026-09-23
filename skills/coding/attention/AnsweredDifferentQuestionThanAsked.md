---
name: answered-different-question
description: Foydalanuvchi aniq narsa so'ragan, AI esa o'xshash lekin boshqa savolga javob bergan yoki butunlay boshqa yo'nalishga o'tib ketgan.
---

# So'ralgan savolga emas, boshqasiga javob berish

## Nima uchun bu skill kerak
AI ba'zan so'rovni "tushunib" o'zi bilgan o'xshash mavzuga o'tib ketadi. Foydalanuvchi A ni so'ragan, AI B ni tushuntiradi yoki C ni qiladi. Bu e'tibor chalg'ishining eng oddiy va eng ko'p uchraydigan shakli — ayniqsa uzun suhbatlarda yoki noaniq so'rovlarda.

## Simptom (aynan shu)
- Foydalanuvchi keyin "men buni so'ramagan edim" yoki "savolim boshqa edi" deb yozadi.
- AI javobi so'rovdagi kalit so'zlar bilan bog'liq, lekin asl talabni bajarmagan.
- Yoki AI "yaxshiroq tushundim" deb o'zi savolni qayta ifodalab, boshqa narsaga javob bergan.

## Sabab (100%)
AI so'rovning birinchi yoki eng tanish qismini ushlab oldi va qolganini e'tiborsiz qoldirdi. Yoki avvalgi kontekstdan "davom ettirib" ketdi. Natijada aniq so'ralgan narsa o'rniga o'xshash, lekin boshqa narsa qilindi.

## Tasdiqlash
1. Foydalanuvchi so'rovini qayta o'qing — aynan nima so'ralgan?
2. AI qilgan ishni yoki bergan javobni solishtiring.
3. So'ralgan narsa bajarilganmi, yoki "o'xshash lekin boshqa" narsa qilinganmi?
4. Agar ikkinchisi bo'lsa — bu shu.

## Tuzatish (aynan shu)
Javob yozishdan oldin so'rovni qisqa qilib qayta ifodalang va o'zingizga tekshiring:

```
// XATO:
// Foydalanuvchi: "Faqat login funksiyasidagi xatoni tuzat"
// AI: butun auth modulini qayta yozdi

// TO'G'RI:
// 1. So'rovni qayta ayt: "Faqat login funksiyasidagi X xatosini tuzatish kerak"
// 2. Faqat shuni qil
// 3. Agar noaniq bo'lsa — bitta aniq savol ber, taxmin qilib ketma
```

Noaniq so'rovda avval aniqlashtiruvchi savol berish — taxmin qilib boshqa yo'nalishga o'tishdan yaxshiroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Avval so'rovni aniq tushun, keyin javob ber.
- "O'xshash narsa" qilish = so'ralgan narsani qilmaslik.
- Shubha bo'lsa — taxmin qilma, so'ra.