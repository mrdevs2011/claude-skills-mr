---
name: agent-used-write-file-for-partial-change-instead-of-edit
description: Mavjud faylning faqat qismini o'zgartirish kerak bo'lganda write_file ishlatilgan — butun fayl ustiga yozilgan, o'zgartirilmagan qismlar yo'qolgan.
---

# Write_file bilan qisman o'zgartirish — to'liq overwrite

## Nima uchun bu skill kerak
Agentlarga ikki xil yozish tooli beriladi: `write_file` (faylni butunlay almashtiradi) va `edit_file` (aniq stringni almashtiradi). AI ko'pincha "faylni yangilayman" deb o'ylab `write_file`ga to'liq yangi matn beradi, lekin o'qigan mazmunning faqat bir qismini o'zgartirishni xohlaydi. Natijada o'zgartirilmagan bo'limlar, izohlar, importlar yoki boshqa mantiq yo'qoladi. Bu `UsedEditFileOrReplaceWithoutReadingFileContentFirst` dan farq qiladi — u yerda edit ishlatilgan, lekin o'qilmagan; bu yerda write ishlatilgan, partial edit kerak edi.

## Simptom (aynan shu)
- Mavjud fayl ochilgan yoki o'qilgan.
- Faqat bitta funksiya, bir necha qator yoki bitta bo'lim o'zgartirilishi kerak edi.
- Agent `write_file` chaqirgan va butun fayl mazmunini (yoki taxmin qilingan to'liq matnni) bergan.
- Keyin faylda oldingi o'zgarmagan qismlar yo'qolgan, sintaksis buzilgan yoki muhim kod yo'qolgan.

## Sabab (100%)
`write_file` tooli har doim faylni to'liq almashtiradi (overwrite). Partial o'zgarish uchun u ishlatilmasligi kerak. Agent "men yangi versiyani bilaman" deb o'ylab, o'qigan to'liq matnni qayta yozib, faqat kerakli qismni o'zgartirish o'rniga butun matnni qayta yaratgan. `edit_file` esa aniq `old_string` → `new_string` qiladi va qolgan hamma narsani saqlaydi.

## Tasdiqlash
1. Tool chaqiruv logida `write_file` ishlatilganligini tekshiring (fayl mavjud edi).
2. O'zgarish faqat bir qismga tegishli ekanligini tasdiqlang (masalan, bitta funksiya ichida).
3. Commit yoki diffda katta qismlar o'chirilgan/yo'qolganini ko'ring.
4. Agar `edit_file` ishlatilgan bo'lsa — bu skill emas.

## Tuzatish (aynan shu)
1. Avval `read_file` bilan faylning hozirgi holatini o'qing.
2. Kerakli o'zgarishni aniq `old_string` va `new_string` bilan ajrating.
3. `edit_file` ishlating:
```
edit_file(
  file_path="path/to/file.py",
  old_string="def old_function():\n    return 1",
  new_string="def old_function():\n    return 42"
)
```
4. Agar o'zgarish juda katta va ko'p joyda bo'lsa — faylni o'qing, to'liq yangi matnni tayyorlang, so'ng `write_file` qiling (lekin faqat shu holatda).
5. Hech qachon o'qilmagan yoki qisman eslab qolingan matnni `write_file`ga bermang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `write_file` = to'liq overwrite. Partial o'zgarish uchun ishlatmang.
- Mavjud faylda kichik o'zgarish kerak bo'lsa — `read_file` + `edit_file`.
- Bu oddiy xato katta kod yo'qolishiga olib keladi; tool tanlashini ongli qiling.
