---
name: agent-provided-excessively-long-response-for-straightforward-query
description: Oddiy, to'g'ridan-to'g'ri so'rovga agent uzun, ortiqcha tushuntirish, fon ma'lumot va takroriy qismlar bilan javob beradi. Qisqa, aniq javob kerak bo'lganda.
---

# Agent oddiy so'rovga haddan tashqari uzun javob berdi

## Nima uchun bu skill kerak
MR qisqa va to'g'ridan-to'g'ri gaplashishni xohlaydi (style.md). Oddiy savolga ("bu nima?", "qanday ishlaydi?", "xato nima?") uzoq kirish, umumiy ma'lumot, takroriy misollar va xulosa yozish vaqtni isrof qiladi, kontekstni to'ldiradi va asosiy javobni yashiradi. Agent "to'liq" bo'lishga urinadi, lekin foydali qisqa bo'ladi.

## Simptom (aynan shu)
- So'rov bitta aniq fakt, qisqa tushuntirish yoki bitta kod parchasini so'raydi.
- Javob 300+ so'z, bir necha bo'lim, "avval tushunish kerakki...", "umuman olganda...", takroriy misollar bilan keladi.
- Asosiy javob oxirida yoki o'rtada yashiringan. Foydalanuvchi scroll qilishi kerak.
- style.md dagi "qisqa va to'g'ridan-to'g'ri" qoidasiga zid.

## Sabab (100%)
Agent "yaxshi assistant" bo'lish uchun to'liqlikni ortiqcha qo'shadi: fon, alternativalar, "ehtiyot chorasi", takroriy formulalar. Qisqalikni "to'liq emas" deb hisoblaydi. Style.md va instruction.md dagi qisqa javob talabi e'tiborga olinmaydi.

## Tasdiqlash
1. So'rovni o'qi — u oddiymi (bitta fakt, bitta qadam, bitta xato tushuntirish)?
2. Javob uzunligini hisobla yoki sez: 200+ so'z, 3+ bo'lim, kirish + asosiy + xulosa bormi?
3. Asosiy kerakli ma'lumotni ajratib olish osonmi, yoki uzoq matn ichida yo'qolganmi?
4. style.md o'qilganmi va "qisqa" qoidasi buzilganmi?

## Tuzatish (aynan shu)
Oddiy so'rovga qisqa javob ber:

- Birinchi gapda to'g'ridan-to'g'ri javob.
- Faqat kerakli kod/misol (agar so'ralsa).
- Ortiqcha "umuman", "e'tibor bering", takroriy xulosa yo'q.
- Agar murakkab bo'lsa — avval qisqa javob, keyin "batafsil kerak bo'lsa ayt" (lekin odatda shart emas).

Misol:

```
# XATO (uzun):
"Bu juda yaxshi savol. Avval tushunishimiz kerakki, JavaScript'da async/await qanday ishlaydi... [500 so'z] ... shuning uchun sizning holatingizda shunday qiling: [kod]"

# TO'G'RI (qisqa):
"Xato sababi: map ichida await qilinmagan. To'g'ri:

```js
const results = await Promise.all(items.map(async item => process(item)));
```

Bu parallel ishlaydi."
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Oddiy so'rov = qisqa javob. To'liqlik kerakli ma'lumotni berish, uzun matn emas.
- Birinchi gapda javob, ortiqcha kirish yo'q.
- style.md ga amal qil: do'stona, qisqa, to'g'ridan-to'g'ri.
