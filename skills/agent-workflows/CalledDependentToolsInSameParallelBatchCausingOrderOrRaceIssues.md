---
name: called-dependent-tools-in-parallel-batch
description: Mustaqil ko'rinadigan lekin aslida bog'liq tool chaqiruvlarni bir parallel batchda qilish — tartib buzilishi, race yoki noto'g'ri natija beradi.
---

# Bog'liq tool'larni parallel batchda chaqirish

## Nima uchun bu skill kerak
Agentlar mustaqil operatsiyalarni parallel qilishni biladi, lekin ba'zan aslida bir-biriga bog'liq tool'larni (birining natijasi ikkinchisiga kerak) bitta parallel chaqiruvda yuboradi. Natijada tartib saqlanmaydi, keyingi tool oldingi natijani ko'rmaydi yoki race yuzaga keladi.

## Simptom (aynan shu)
- Bir nechta tool bitta javobda (parallel) chaqirilgan, lekin keyingisi oldingisining output'iga bog'liq edi.
- Keyingi tool noto'g'ri yoki bo'sh ma'lumot bilan ishladi.
- Tartib muhim bo'lgan operatsiyalar (masalan, avval o'qi, keyin tahrirla; avval clone, keyin commit) aralashdi.
- Natija kutilganidek chiqmadi, lekin har bir tool alohida "muvaffaqiyatli" ko'rindi.

## Sabab (100%)
Agent "parallel qilsa tezroq" deb o'ylab, bog'liqlikni tekshirmasdan bir vaqtda bir nechta tool chaqiruvini yubordi. Tool'larning input'lari bir-biriga bog'liq ekanini hisobga olmadi.

## Tasdiqlash
- Parallel chaqirilgan tool'lardan biri boshqasining natijasini ishlatadimi?
- Keyingi tool oldingi tool tugaguncha kutishi kerakmi?
- Tartib muhim bo'lgan ketma-ketlik buzilganmi?
- Tool natijalari keyingi qadam uchun ishlatilganmi, lekin parallel bo'lgani uchun mavjud emasmi?

## Tuzatish (aynan shu)
Bog'liq tool'larni **hech qachon parallel qilma**. Faqat mustaqil bo'lganlarni parallel chaqir.

1. Tool chaqirishdan oldin bog'liqlikni tekshir: "Bu tool oldingi tool'ning output'iga muhtojmi?"
2. Agar ha — ketma-ket chaqir: birinchisini yubor, natijasini kut, keyin ikkinchisini.
3. Agar yo'q (to'liq mustaqil) — parallel qilish mumkin.
4. Parallel batchda faqat bir-biriga ta'sir qilmaydigan operatsiyalarni qo'y.

Misol (noto'g'ri):
```
# Bitta javobda:
bash: git clone ...
bash: cd repo && git commit ...   # clone tugamasdan ishlamaydi
```

Misol (to'g'ri):
```
# Avval:
bash: git clone ...
# Natija kelgandan keyin:
bash: cd repo && git add . && git commit ...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Parallel tool chaqiruv faqat mustaqil operatsiyalar uchun.
- Agar bir tool ikkinchisining natijasiga bog'liq bo'lsa — doim ketma-ket.
- Bog'liqlikni tekshirmasdan parallel qilish tartib buzilishi va noto'g'ri natijaga olib keladi.
- Bu oddiy tekshiruv ko'p race va mantiq xatolarining oldini oladi.
