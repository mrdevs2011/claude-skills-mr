---
name: agent-did-not-read-full-architecture-before-skill-creation
description: Agent yangi skill yaratishdan oldin architecture.md ni to'liq o'qimadi yoki truncated outputdan keyin davom ettirmadi — natijada noto'g'ri fayl formati, joylashuvi yoki bo'limlar ishlatildi, skill qidiruv tizimida ishlamaydi.
---

# Skill yaratishdan oldin architecture.md ni to'liq o'qish

## Nima uchun bu skill kerak
Bu repo'da skill'lar qat'iy formatga ega (frontmatter + aniq 6 bo'lim) va faqat bitta uzun tavsifli .md fayl sifatida to'g'ri kategoriya papkasiga qo'yiladi. architecture.md buni batafsil belgilaydi. Uni to'liq o'qmasdan skill yaratish qidiruvni (skill_search.py) buzadi va keyingi agentlar uchun foydasiz bo'ladi.

## Simptom (aynan shu)
- Yangi skill `SKILL.md` nomli fayl yoki papka ichida yaratilgan.
- Frontmatter yo'q yoki noto'g'ri.
- Bo'limlar architecture.md dagi majburiy 6 tadan farq qiladi (masalan, "How to use", "Examples" kabi qo'shimcha yoki yetishmaydi).
- Fayl `skills/` ildizida yoki noto'g'ri kategoriyada.
- README.md yoki architecture.md dagi struktura ro'yxati yangilanmagan (agar yangi kategoriya bo'lsa).

## Sabab (100%)
Agent architecture.md ni o'qishda default limit tufayli truncated oldi yoki faqat bosh qismini o'qib, "Fayl formati (majburiy)" bo'limini o'tkazib yubordi. Yoki oldingi sessiyadagi bilimga tayandi, joriy vazifada qayta o'qimadi. "SKILL.md + kerakli fayllar" iborasini boshqa tizim qoidasi sifatida qo'lladi.

## Tasdiqlash
1. Skill fayli `skills/<kategoriya>/<UzunAniqTavsif>.md` shaklidami?
2. Frontmatterda `name` va `description` bormi?
3. Ichida aynan: Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa bo'limlari bormi?
4. architecture.md ni joriy sessiyada to'liq (offset bilan kerak bo'lsa) o'qilganmi?

## Tuzatish (aynan shu)
Avval architecture.md ni to'liq o'qi (agar truncated bo'lsa, offset bilan davom et). Keyin skillni bitta .md fayl sifatida to'g'ri joyga yoz, formatga 100% amal qil. Agar yangi kategoriya ochsang, architecture.md va README.md dagi ro'yxatlarni yangila.

To'g'ri misol:
```md
---
name: qisqa-kebab-case
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
... (kod misoli bilan)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill yaratishdan oldin architecture.md ni to'liq o'qish majburiy. Truncated outputda to'xtab qolma, format va joylashuv qoidalariga 100% rioya qil. Aks holda skill foydasiz bo'ladi.
