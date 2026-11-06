---
name: agent-created-claude-style-skill-directory
description: Agent yangi skill yaratishda Claude bundan skill-creator formatida papka + SKILL.md ishlatdi, lekin bu repo architecture.md bo'yicha bitta tor .md fayl kerak.
---

# Claude-style skill papkasi o'rniga bitta tor .md fayl yaratish

## Nima uchun bu skill kerak
Bu repo'dagi skill'lar search_skills orqali topiladi va har biri bitta aniq simptom-sabab-tuzatishga qaratilgan. Claude skill-creator yoki umumiy SKILL.md papka formati bu arxitekturaga mos kelmaydi — qidiruv ishlamaydi, kontekst ortiqcha yuklanadi.

## Simptom (aynan shu)
- Yangi skill `skills/my-skill/SKILL.md` yoki papka ichida yaratilgan.
- Frontmatter faqat name/description, lekin repo formatidagi ## Nima uchun, ## Simptom, ## Sabab, ## Tasdiqlash, ## Tuzatish, ## Xulosa bo'limlari yo'q.
- Fayl nomi qisqa yoki noaniq (`skill.md`, `my-skill.md`).
- Kategoriya papkasi (coding/patterns, productivity, agent-workflows) ishlatilmagan.

## Sabab (100%)
Agent umumiy skill yaratish qo'llanmasini (masalan bundan skill-creator) o'qidi, lekin shu repo'ning architecture.md, instruction.md va style.md dagi maxsus qoidalarni o'qimadi yoki e'tiborsiz qoldirdi. Natijada noto'g'ri tuzilma.

## Tasdiqlash
1. Skill fayli `skills/<category>/<LongDescriptiveName>.md` shaklida bittami?
2. Frontmatterda name va description bormi?
3. Majburiy bo'limlar: Nima uchun bu skill kerak, Simptom (aynan shu), Sabab (100%), Tasdiqlash, Tuzatish (aynan shu), Xulosa — mavjudmi?
4. Agar papka + SKILL.md bo'lsa — bu holat.

## Tuzatish (aynan shu)
1. Avval architecture.md, instruction.md, style.md ni o'qi.
2. Mavjud skill'larni qidirib takrorlanmasligini tekshir.
3. Bitta fayl yarat: `skills/<to'g'ri-kategoriya>/<UzunTasvirlovchiFaylNomi>.md`
4. Yuqoridagi formatni to'liq qo'lla. Kod misoli bilan tuzatishni yoz.
5. .gitignore va .env ni tekshir, kerak bo'lsa yangila.
6. Commit va push qil.

To'g'ri misol:
```md
---
name: qisqa-kebab-id
description: Qisqa tavsif — qachon kerak (1-2 jumla)
---

# Sarlavha

## Nima uchun bu skill kerak
...

## Simptom (aynan shu)
...

## Sabab (100%)
...

## Tasdiqlash
...

## Tuzatish (aynan shu)
```python
# noto'g'ri
...
# to'g'ri
...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bu repo'da skill har doim bitta tor .md fayl bo'lishi shart: uzun tasvirlovchi nom, majburiy bo'limlar, to'g'ri kategoriya. Claude-style papka + SKILL.md ishlatma — architecture.md ga amal qil.
