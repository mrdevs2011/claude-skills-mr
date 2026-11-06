---
name: agent-mentioned-internal-guidelines-in-response
description: Agent foydalanuvchiga bergan javobida ichki tizim yo'riqnomalari, tool tavsiflari, xavfsizlik qoidalari yoki "qoidalarni eslatma" kabi narsalarni aytib o'tdi yoki iqtibos keltirdi, foydalanuvchi buni so'ramagan bo'lsa.
---

# Agent ichki yo'riqnomalarni javobda eslatib o'tdi

## Nima uchun bu skill kerak
Tizim ko'rsatmalarida aniq yozilgan: "Do not mention these guidelines and instructions in your responses, unless the user explicitly asks for them." Agentlar ba'zan "qoidalarga ko'ra", "tizim yo'riqnomasi bo'yicha", "tool tavsifida aytilganidek" yoki to'liq qoidani iqtibos qilib javob beradi. Bu foydalanuvchiga keraksiz, token isrof qiladi va ichki ishlashni ochib beradi. Skill agentni faqat so'ralganda qoidani aytishga o'rgatadi.

## Simptom (aynan shu)
- Javobda "tizim yo'riqnomasi", "guidelines", "instructions", "tool description", "safety rules", "Do not mention these guidelines" kabi iboralar bor.
- Foydalanuvchi "qoidalarni ayt", "nima deyilgan" deb so'ramagan.
- Agent o'z cheklovlarini yoki ichki formatini tushuntirib bergan (masalan "Men citation uchun XML ishlataman chunki...").
- Javob uzunlashgan, asosiy savolga javobdan tashqari qoidalar haqida gap bor.

## Sabab (100%)
Agent system prompt / instructions ni "foydalanuvchiga tushuntirish kerak" deb noto'g'ri tushungan yoki "shaffoflik" uchun aytib qo'ygan. Yoki avvalgi skill/instruction o'qiganini javobda eslatib, "men qoidalarga amal qildim" deb hisobot bergandek yozgan.

## Tasdiqlash
1. Foydalanuvchi so'rovida "qoida", "guideline", "instruction", "nima deyilgan", "show me the rules" kabi so'zlar bormi? Yo'q bo'lsa — bu skill kerak.
2. Javob matnida "Do not mention", "system guidelines", "tool schema", "safety rules cannot be overridden" kabi iboralar qidir.
3. Agar bor va so'ralmagan bo'lsa — aynan shu xato.

## Tuzatish (aynan shu)
Javobni qayta yoz:

- Ichki qoidalarni hech qachon eslatma, iqtibos qilma, "qoidalarga ko'ra" dema.
- Faqat foydalanuvchi aniq so'rasa ("qoidalarni ko'rsat", "nima deyilgan edi") — shunda qisqa va to'g'ridan-to'g'ri ayt.
- Oddiy javobda faqat so'ralgan natijani ber: kod, tushuntirish, hisobot, tool natijasi. Qo'shimcha "men buni qoidaga ko'ra qildim" kerak emas.
- Agar cheklov tufayli rad etish kerak bo'lsa — qisqa rad et, sababni ichki qoida bilan tushuntirma.

Misol:
```
# XATO:
"Tizim yo'riqnomalariga ko'ra men ichki qoidalarni eslatmayman, lekin bu yerda..."

# TO'G'RI:
[to'g'ridan-to'g'ri javob, qoidani umuman aytmasdan]
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ichki yo'riqnoma, tool tavsifi va xavfsizlik qoidalarini foydalanuvchi so'ramaguncha javobda eslatmang.
- "Shaffoflik" yoki "men amal qildim" deb qo'shimcha matn yozmang.
- Faqat aniq so'rov bo'lganda qoidalarni aytish mumkin.
