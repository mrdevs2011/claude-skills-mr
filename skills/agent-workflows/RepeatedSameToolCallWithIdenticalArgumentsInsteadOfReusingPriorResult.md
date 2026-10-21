---
name: repeated-identical-tool-call-instead-of-reusing-result
description: Agent bir xil argumentlar bilan toolni qayta-qayta chaqiradi, oldingi natijani ishlatmasdan — token va vaqt isrofi.
---

# Bir xil tool chaqiruvini takrorlash, oldingi natijani ishlatmaslik

## Nima uchun bu skill kerak

Agentlar ko'pincha bir xil ma'lumotni (fayl o'qish, qidiruv, status) bir suhbat ichida bir necha marta so'rashadi. Instruction qoidasiga ko'ra bir marta olingan natijani qayta so'ramasdan ishlatish kerak. Bu token, vaqt va kontekstni tejaydi.

## Simptom (aynan shu)

- Agent bir xil toolni (masalan, `read_file` bir xil path bilan, yoki `web_search` bir xil query bilan, yoki `bash` bir xil `ls`/`git status` bilan) suhbatning turli qadamlarida qayta chaqiradi.
- Oldingi tool javobi hali kontekstda bor, lekin agent uni e'tiborsiz qoldirib, yangidan so'raydi.
- Hech qanday o'zgarish bo'lmagan (fayl o'zgarmagan, yangi ma'lumot yo'q), lekin qayta chaqirilgan.
- Umumiy tool chaqiruvlar soni keraksiz oshadi, foydalanuvchi sekin javob oladi.

## Sabab (100%)

Agent "har safar yangi natija olaman" yoki "ehtiyotkor bo'lay" deb, kontekstda allaqachon mavjud bo'lgan tool natijasini ishlatishni unutadi. Reja yozishda oldingi javoblarni "yangi" deb hisoblamaydi, yoki parallel/ketma-ket reja ichida takrorini sezmaydi.

## Tasdiqlash

- Tool chaqiruv tarixini ko'r: bir xil tool + bir xil argumentlar 2+ marta chiqdimi?
- Oldingi javob hali context'da bormi (qisqartirilmagan)?
- Orada hech narsa o'zgarmaganmi (fayl write qilinmagan, yangi push yo'q)?
- Agar shu shartlar to'g'ri bo'lsa — bu skill mos.

## Tuzatish (aynan shu)

Oldingi tool natijasini to'g'ridan-to'g'ri ishlat. Qayta chaqirma.

Misol (noto'g'ri):
```
1. read_file("architecture.md") → matn olindi
2. ... boshqa ishlar ...
3. read_file("architecture.md") → yana chaqirildi
```

To'g'ri:
```
1. read_file("architecture.md") → matn olindi, keyingi qadamlarda shu matndan foydalan
```

Agar fayl o'zgargan bo'lishi mumkin bo'lsa (o'zing write qilding), faqat shunda qayta o'qi. Aks holda — ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Bir suhbat ichida bir xil tool + bir xil argument bilan qayta chaqirish keraksiz. Oldingi natija kontekstda bo'lsa, uni ishlat. Bu token va vaqtni tejaydi, instruction.md dagi "qayta izlama/o'qima" qoidasiga mos.
