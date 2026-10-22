---
name: created-skill-with-malformed-frontmatter
description: Yangi skill yozilganda frontmatter (name/description) noto'g'ri yoki majburiy bo'limlar yetishmaydi — search_skills topa olmaydi yoki format buziladi.
---

# Skill frontmatter noto'g'ri yoki majburiy bo'limlar yetishmaydi

## Nima uchun bu skill kerak
Skill bazasi `search_skills` va `get_skill` orqali ishlaydi. Frontmatter va 6 ta majburiy bo'lim bo'lmasa, skill qidiruvda ko'rinmaydi, indeks noto'g'ri bo'ladi yoki agent o'qiganda to'liq ma'lumot ololmaydi. Architecture.md aniq formatni talab qiladi.

## Simptom (aynan shu)
- Yangi `.md` skill fayli yaratildi, lekin `search_skills` so'rovida chiqmaydi.
- Frontmatter yo'q, `name` yoki `description` maydoni yo'q yoki noto'g'ri formatda (YAML buzilgan).
- 6 ta majburiy bo'limdan biri yoki bir nechtasi yo'q: "Nima uchun bu skill kerak", "Simptom", "Sabab", "Tasdiqlash", "Tuzatish", "Xulosa".
- Skill o'qilganda agent to'liq yo'l-yo'riq ololmaydi, qisqa yoki chala matn.

## Sabab (100%)
Skill yozuvchi architecture.md dagi "Fayl formati (majburiy)" bo'limini o'qimasdan yoki qisman amal qilib, o'z formatini ishlatgan. Frontmatter YAML sifatida to'g'ri yopilmagan yoki majburiy bo'limlar qisqartirilgan/umumiy qilib qoldirilgan.

## Tasdiqlash
1. Skill faylining boshida `---` bilan ochilgan frontmatter bormi?
2. `name:` va `description:` maydonlari bor va kebab-case / qisqa tavsif shaklida?
3. Quyidagi 6 bo'lim barchasi mavjudmi?
   - ## Nima uchun bu skill kerak
   - ## Simptom (aynan shu)
   - ## Sabab (100%)
   - ## Tasdiqlash
   - ## Tuzatish (aynan shu)
   - ## Xulosa — bu skillni o'qib nimani bilib oldingiz
4. `search_skills` bilan fayl nomining qisqa qismi yoki description kalit so'zi bilan qidirilganda topiladimi?

## Tuzatish (aynan shu)
Har doim quyidagi shablonni 100% nusxa qilib yoz:

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
... (kod misoli bilan, agar kerak)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

1. Avval architecture.md dagi format bo'limini o'qi.
2. Frontmatter ni to'g'ri YAML qilib yoz (`---` bilan ochib-yop).
3. 6 ta bo'limni to'liq yoz, qisqartirma.
4. Faylni to'g'ri kategoriyaga qo'y (`skills/agent-workflows/` va h.k.).
5. Saqlagandan keyin `search_skills` bilan tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill har doim to'g'ri frontmatter va 6 ta majburiy bo'lim bilan yozilishi shart. Aks holda u qidiruvda ko'rinmaydi va foydasiz bo'ladi. Formatga 100% amal qil.
