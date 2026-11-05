---
name: agent-created-skill-as-directory-instead-of-single-md
description: Agent yangi skillni skills/kategoriya/skill-name/SKILL.md papka shaklida yoki qo'shimcha fayllar (CHANGELOG, evals va hokazo) bilan yaratdi — bu architecture.md dagi majburiy bitta uzun tavsifli .md fayl va aniq 6 bo'lim formatiga zid, qidiruvni buzadi.
---

# Skillni papka va SKILL.md shaklida yaratish

## Nima uchun bu skill kerak
Bu repo'dagi skill bazasi `skill_search.py` orqali ishlaydi va har bir skill bitta `.md` fayl sifatida `skills/<kategoriya>/` ichida saqlanadi. Papka + SKILL.md + qo'shimcha fayllar yondashuvi (boshqa tizimlar uchun mo'ljallangan) bu yerda ishlamaydi, qidiruvni, indeksni va formatni buzadi. architecture.md qat'iy qoidalarni belgilaydi.

## Simptom (aynan shu)
- Yangi skill `skills/coding/patterns/my-skill/SKILL.md` yoki shunga o'xshash papka ichida yaratilgan.
- SKILL.md dan tashqari CHANGELOG.md, evals/, scripts/ kabi fayllar qo'shilgan.
- Frontmatter va tuzilma architecture.md dagi majburiy formatga mos kelmaydi (6 bo'lim: Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa).
- `search_skills` yangi skillni topmaydi yoki noto'g'ri indeks oladi.

## Sabab (100%)
Agent boshqa skill tizimi (masalan, Grok yoki Claude Code skill-creator) qoidalarini qo'lladi va shu repo'ning architecture.md, instruction.md dagi aniq format va fayl tuzilishini o'qimadi yoki e'tiborsiz qoldirdi. "SKILL.md + kerakli fayllar" iborasi boshqa kontekstda ishlatilgan bo'lishi mumkin, lekin bu yerda majburiy emas.

## Tasdiqlash
1. Yangi skill fayli `skills/<kategoriya>/<UzunTavsifliNom>.md` shaklida bittagina faylmi?
2. Ichida faqat architecture.md dagi frontmatter + 6 bo'lim bormi?
3. Qo'shimcha papkalar yoki SKILL.md nomi ishlatilmaganmi?
4. Agar yo'q bo'lsa — bu holat.

## Tuzatish (aynan shu)
Skillni bitta uzun, aniq tavsifli `.md` fayl sifatida to'g'ri kategoriyaga yoz. Qo'shimcha fayllarni o'chir.

Noto'g'ri:
```
skills/agent-workflows/my-skill/
├── SKILL.md
├── CHANGELOG.md
└── evals/evals.json
```

To'g'ri:
```
skills/agent-workflows/AgentCreatedSkillAsDirectoryWithSkillMdInsteadOfSingleLongDescriptiveMarkdownFilePerArchitecture.md
```

Fayl ichida:
```md
---
name: qisqa-kebab-case-id
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
... (kod yoki aniq misol bilan)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

Nom uzun va o'zini tushuntiradigan bo'lsin. README.md dagi struktura ro'yxatini yangila.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bu repo'da har bir skill bitta `.md` fayl, aniq 6 bo'limli formatda, uzun tavsifli nom bilan. architecture.md qoidalariga 100% amal qil — boshqa tizim formatlarini aralashtirma.
