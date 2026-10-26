---
name: generate-document-without-reading-bundled-skill
description: Docx, PDF, PPTX, XLSX yoki boshqa maxsus formatli fayl yaratish/tahrirlash so'ralganda tegishli bundled skill (docx, pdf, pptx, xlsx) SKILL.md ni o'qimasdan ishga kirishildi — natija noto'g'ri struktura, yo'qolgan funksiyalar yoki skill formatiga zid.
---

# Maxsus hujjat formatini yaratishdan oldin bundled skillni o'qimaslik

## Nima uchun bu skill kerak
Agentlar ba'zan "men bilaman qanday yoziladi" deb hisoblab, docx/pdf/pptx/xlsx kabi fayllarni to'g'ridan-to'g'ri yozishga urinadi. Lekin bu formatlar uchun maxsus bundled skill'lar mavjud bo'lib, ular to'g'ri API, cheklovlar, eng yaxshi amaliyotlar va majburiy qadamlarni o'z ichiga oladi. O'qimasdan ishlash noto'g'ri natija yoki skill talablariga zid ishlashga olib keladi.

## Simptom (aynan shu)
- Foydalanuvchi "Word hujjat", "PDF hisobot", "PowerPoint taqdimot", "Excel jadval" yaratishni so'ragan.
- Agent to'g'ridan-to'g'ri write_file, python-docx, reportlab yoki boshqa usul bilan yozishni boshlagan.
- `read_file` bilan `/usr/share/grok/bundled-skills/bundled__docx/SKILL.md` (yoki pdf/pptx/xlsx) chaqirilmagan.
- Natija ochilganda struktura buzilgan, uslublar yo'q, yoki skillda aytilgan qoidalar buzilgan (masalan, majburiy bo'limlar yo'q).

## Sabab (100%)
Agent mavjud bundled skill katalogini tekshirmagan yoki "bu oddiy fayl, skill kerak emas" deb taxmin qilgan. instruction.md va skill-creator tamoyillariga zid: maxsus formatlar uchun avval skill o'qilishi shart.

## Tasdiqlash
- So'rovda .docx, .pdf, .pptx, .xlsx yoki "Word", "PowerPoint", "spreadsheet" kabi so'zlar bormi?
- Bundled skill yo'li (`bundled__docx/SKILL.md` va h.k.) read_file bilan o'qilganmi?
- Agar o'qilmagan bo'lsa — shu skill qo'llaniladi.
- Natija skilldagi "majburiy" bo'limlarga mos keladimi?

## Tuzatish (aynan shu)
1. Hujjat turi aniqlangach darhol tegishli SKILL.md ni o'qi:
   - Word/docx → `read_file` path `/usr/share/grok/bundled-skills/bundled__docx/SKILL.md`
   - PDF → bundled__pdf/SKILL.md
   - PPTX → bundled__pptx/SKILL.md
   - XLSX/Excel → bundled__xlsx/SKILL.md
2. Skilldagi barcha qoidalarga 100% amal qil (frontmatter, bo'limlar, cheklovlar).
3. Keyin faqat skillda ko'rsatilgan usul bilan fayl yarat.
4. Yaratilgan faylni `render_file` bilan foydalanuvchiga ko'rsat.
5. Hech qachon "men bilaman" deb skillni o'tkazib yuborma.

```markdown
# Noto'g'ri
write_file bilan .docx ga oddiy markdown yozish

# To'g'ri
1. read_file("/usr/share/grok/bundled-skills/bundled__docx/SKILL.md")
2. Skilldagi yo'riqnoma asosida python-docx yoki ko'rsatilgan usul
3. render_file
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Maxsus formatli fayl (docx/pdf/pptx/xlsx) yaratishdan oldin har doim tegishli bundled skillni o'qi.
- Bu noto'g'ri struktura, yo'qolgan funksiyalar va qoidalarni buzishning oldini oladi.
- "Bilaman" taxmini o'rniga skilldagi aniq yo'riqnoma ishlatiladi.
