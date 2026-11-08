---
name: agent-created-skill-markdown-missing-exact-required-sections-from-architecture
description: Agent yozgan yangi skill .md faylida architecture.md da belgilangan aniq 6 ta bo'lim (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) yo'q yoki sarlavhalar mos kelmaydi.
---

# Agent Created Skill Markdown Missing Exact Required Sections From Architecture

## Nima uchun bu skill kerak
architecture.md skill fayl formatini qat'iy belgilaydi: frontmatter + aniq 6 ta bo'lim. Agar agent yangi skill yaratganda bo'limlarni o'tkazib yuborsa, sarlavhalarni o'zgartirsa yoki qo'shimcha bo'limlar qo'shsa, skill search va o'qish jarayoni buziladi, model to'g'ri tuzatishni topa olmaydi.

## Simptom (aynan shu)
- Yangi skill .md fayli skills/ papkasiga qo'shilgan.
- Frontmatter bor, lekin quyidagi aniq sarlavhalar yo'q yoki boshqacha yozilgan:
  - ## Nima uchun bu skill kerak
  - ## Simptom (aynan shu)
  - ## Sabab (100%)
  - ## Tasdiqlash
  - ## Tuzatish (aynan shu)
  - ## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yoki qo'shimcha "Examples", "Notes", "Related" kabi bo'limlar bor.
- Skill o'qilganda struktura aralashib ketgan.

## Sabab (100%)
Agent architecture.md dagi "Fayl formati (majburiy)" bo'limini to'liq o'qimagan yoki e'tiborsiz qoldirgan. Formatni "taxminan" deb o'ylab, o'z variantini yozgan. instruction.md va architecture 100% amal qilishni talab qiladi.

## Tasdiqlash
- Skill faylini ochib, frontmatter dan keyin aniq 6 ta ## sarlavha borligini tekshir.
- Sarlavha matnlari architecture.md dagi namunaga 100% mos keladimi (qavslar, "aynan shu", "100%" va hokazo).
- Qo'shimcha bo'lim yo'qmi?
- `grep -E '^## ' skill-fayl.md` natijasini solishtir.

## Tuzatish (aynan shu)
Skill yaratishdan oldin architecture.md ni o'qi va formatni nusxa ko'chir:

```md
---
name: kebab-case-id
description: Qisqa tavsif — qachon kerak bo'lishi (1-2 jumla)
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

Fayl yozgandan keyin ushbu 6 ta sarlavhani tekshir. Agar yo'q bo'lsa, tahrir qil. Qo'shimcha bo'lim qo'shma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Yangi skill faylida faqat architecture.md belgilagan aniq 6 ta bo'lim bo'lishi shart. Sarlavhalarni o'zgartirma, qo'shimcha bo'lim qo'shma. Bu skillning qidiruv va o'qishda to'g'ri ishlashini ta'minlaydi.
