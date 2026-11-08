---
name: agent-executed-independent-tool-calls-sequentially
description: Agent independent tool chaqiruvlarni alohida javoblarda ketma-ket bajargan, parallel chaqirish o'rniga, bu umumiy latency'ni oshirgan.
---

# Agent independent tool chaqiruvlarni ketma-ket bajardi

## Nima uchun bu skill kerak
Agent bir nechta mustaqil tool chaqiruvini bitta javobda parallel qilishi mumkin bo'lsa-da, ularni alohida turn'larda ketma-ket yuboradi. Bu umumiy kutish vaqtini orttiradi va foydalanuvchi javobini sekinlashtiradi.

## Simptom (aynan shu)
- Bir nechta tool natijasi kerak (masalan, bir nechta fayl o'qish, bir nechta qidiruv).
- Tool'lar bir-biriga bog'liq emas (ikkinchisi birinchisining natijasiga qaramaydi).
- Agent avval bitta tool chaqiradi, natijasini kutadi, keyin ikkinchisini chaqiradi.
- Jami vaqt = sum(har bir tool vaqti) o'rniga max(tool vaqtlari) bo'lishi mumkin edi.

## Sabab (100%)
Agent parallel function calling imkoniyatini ishlatmadi — barcha mustaqil chaqiruvlarni bitta assistant message ichida birga chiqarmadi.

## Tasdiqlash
- Suhbat tarixida tool chaqiruvlar alohida message'larda ketma-ket.
- Har bir keyingi chaqiruv oldingi natijaga qaramaydi.
- Parallel qilish mumkin edi (tool'lar concurrent ishlay oladi).

## Tuzatish (aynan shu)
Mustaqil tool chaqiruvlarni bitta javobda parallel qil:

```python
# Noto'g'ri (ketma-ket)
# Turn 1: call read_file("a.md")
# Turn 2: call read_file("b.md")

# To'g'ri (parallel)
# Bitta turn da:
# function_calls: [
#   {"name": "read_file", "parameters": {"file_path": "a.md"}},
#   {"name": "read_file", "parameters": {"file_path": "b.md"}}
# ]
```

Agar tool'lar o'zaro bog'liq bo'lsa (ikkinchisi birinchisining outputiga qaram), u holda ketma-ket to'g'ri.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Mustaqil tool'larni parallel chaqirish latency'ni kamaytiradi. Agent faqat bog'liq bo'lgan chaqiruvlarni ketma-ket qilishi kerak.
