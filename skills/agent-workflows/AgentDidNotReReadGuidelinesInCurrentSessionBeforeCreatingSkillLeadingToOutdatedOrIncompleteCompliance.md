---
name: agent-did-not-reread-guidelines-in-current-session-before-creating-skill
description: Yangi skill yaratishdan oldin architecture.md, instruction.md, style.md ni qayta o'qimasdan eski xotiraga suyanish. Qachon: skill yozish vazifasida qo'llanmalar o'qilmagan.
---

# Agent joriy sessiyada qo'llanmalarni qayta o'qimadi

## Nima uchun bu skill kerak
architecture.md, instruction.md va style.md doimiy yangilanadi. Avvalgi sessiyadan eslab qolgan qoidalar eskirgan bo'lishi mumkin. Yangi skill yaratishda 100% amal qilish uchun joriy holatni o'qish shart. Aks holda format buziladi, kategoriya noto'g'ri tanlanadi yoki takrorlanadi.

## Simptom (aynan shu)
- Skill yaratishdan oldin architecture.md, instruction.md, style.md o'qilmagan.
- "Xotirada bor" deb o'tkazib yuborilgan.
- Natijada frontmatter, bo'limlar yoki nomlash qoidalari buzilgan.
- Yangi kategoriya qo'shilganda architecture.md yangilanmagan.

## Sabab (100%)
Agent token tejash yoki tezlik uchun qo'llanmalarni qayta o'qishni o'tkazib yubordi. Qoidalar "barqaror" deb taxmin qilindi, lekin ular o'zgarishi mumkin va joriy vazifa uchun aniq talablar bor.

## Tasdiqlash
1. Tool chaqiruv tarixida architecture.md, instruction.md, style.md o'qilganmi?
2. Skill fayli 6 ta majburiy bo'limga ega (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa)?
3. Fayl nomi uzun va aniq simptomni bildiradimi?

## Tuzatish (aynan shu)
Har bir yangi skill yaratish vazifasida avval quyidagilarni o'qi:

```bash
cat architecture.md
# instruction.md ning tegishli qismlari
# style.md
```

Keyin formatga qat'iy rioya qil. Agar yangi kategoriya bo'lsa, architecture.md dagi ro'yxatni yangila.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill yaratishdan oldin doim joriy architecture.md, instruction.md va style.md ni o'qib, 100% amal qilish kerak. Eski xotiraga suyanish format buzilishiga olib keladi.
