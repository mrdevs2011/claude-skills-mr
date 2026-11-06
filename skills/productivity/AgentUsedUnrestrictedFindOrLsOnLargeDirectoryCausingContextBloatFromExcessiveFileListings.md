---
name: agent-used-unrestricted-find-or-ls
description: Agent katta papkada find yoki ls ni limit siz chaqirib, context'ni minglab fayl nomlari bilan to'ldiradi — token isrofi va muhim ma'lumotning yo'qolishi.
---

# Agent katta papkada find/ls ni limitsiz ishlatishi

## Nima uchun bu skill kerak
Agentlar skills/ yoki boshqa katta papkalarni ko'rishda `find . -type f` yoki `ls -R` ni to'liq chiqaradi. Natijada tool output minglab qator bo'lib, context to'lib ketadi, keyingi qadamlar uchun joy qolmaydi va muhim qismlar kesiladi.

## Simptom (aynan shu)
- Tool output juda uzun (yuzlab yoki minglab qator) va "truncated" yozuvi bilan tugaydi.
- Agent keyin "barcha skill'larni ko'rdim" deb hisoblaydi, lekin aslida faqat bosh qismini ko'rgan.
- Context token limiti yaqinlashadi yoki oshadi.
- Muhim fayl nomlari output oxirida qolib ketadi.

## Sabab (100%)
Agent `find` yoki `ls` buyrug'ini hech qanday `| head`, `| wc -l` yoki count limit bilan cheklamasdan chaqiradi. Katta katalog (masalan 400+ skill) borligini oldindan hisobga olmaydi.

## Tasdiqlash
- `find` yoki `ls` chaqiruvi `| head -N`, `| tail`, yoki `wc -l` bilan cheklanganmi?
- Output hajmi context'ni to'ldiradigan darajada katta bo'ldimi?
- Keyingi qadamda kerakli fayl haqiqatan ko'rilganmi yoki taxmin qilinganmi?

## Tuzatish (aynan shu)
Katta papka ro'yxatini olishda har doim limit qo'y:

```bash
# Noto'g'ri (context bloat)
find skills -type f -name "*.md"

# To'g'ri — soni va namunalar
find skills -type f -name "*.md" | wc -l
find skills/productivity -type f -name "*.md" | head -20

# Yoki aniq qidiruv
find skills -name "*Git*" -type f | head -10
```

Agar to'liq ro'yxat kerak bo'lsa, avval sonini ol, keyin kerakli subpapka yoki pattern bilan toraytir. Read_file yoki grep ishlat, to'liq dump qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Katta kataloglarni ko'rishda har doim `find`/`ls` ni `| head`, `| wc -l` yoki aniq pattern bilan chekla. To'liq dump context'ni buzadi va muhim ma'lumotni yashiradi. Tor qidiruv yoki count + namunalar yetarli.
