---
name: agent-created-debugging-skill-despite-non-debugging-request
description: Agent yaratilgan skill debugging mavzusida bo'lgan, ammo foydalanuvchi debuggingdan tashqari (coding patterns, tool usage, productivity, agent workflows) so'ragan. Qachon: yangi skill yaratishda mavzu cheklovi buzilganda.
---

# Agent Debugging Skill Yaratdi, Non-Debugging Mavzu So'ralgan

## Nima uchun bu skill kerak
Foydalanuvchi aniq "debugging dan tashqari" deb ko'rsatma berganida (coding patterns, tool usage, productivity, agent workflows va hokazo) skill yaratish jarayonida agent baribir debugging-focused skill yaratadi. Bu search_skills orqali topilishi qiyin bo'lgan yoki noto'g'ri kategoriyadagi skillga olib keladi, va takrorlanishni oshiradi.

## Simptom (aynan shu)
Skill yaratish so'rovida "debugging dan tashqari" yoki "coding patterns / tool usage / productivity / agent workflows" deb yozilgan. Natijada yaratilgan skill faqat xato tuzatish, exception, TypeError, debug jarayoni haqida. Kategoriya `coding/` ostida, agent-workflows yoki productivity emas.

## Sabab (100%)
Agent architecture.md va instruction.md dagi kategoriya qoidalarini va foydalanuvchi so'rovidagi mavzu cheklovini e'tiborsiz qoldirdi. Mavjud debugging skilllar ko'p bo'lgani uchun o'xshash namuna asosida yangi skill yozdi, so'rov matnini to'liq o'qimadi yoki filtrlashni unutdi.

## Tasdiqlash
1. Foydalanuvchi so'rovini o'qi: "debugging dan tashqari" yoki explicit non-debug mavzular bor-yo'qligini tekshir.
2. Yaratilgan skill fayl nomini va mazmunini ko'r: faqat xato/simptom/sabab/tuzatish (debug) haqidami?
3. Papka: `skills/coding/` da, `agent-workflows/` yoki `productivity/` da emas.

## Tuzatish (aynan shu)
So'rovni qayta o'qi. Non-debug mavzu tanla (masalan: tool parallel chaqiruv, skill frontmatter aniqligi, deliverable render, context boshqaruvi, git workflow, yoki coding pattern - string join, early return va hokazo, lekin pure debug emas).

Skillni to'g'ri kategoriya papkasiga yoz:
- Process/tool ishlatish xatosi → `skills/agent-workflows/`
- Tejamkorlik, context, qisqa javob → `skills/productivity/`
- Kod pattern (join, guard, type) → `skills/coding/patterns/`

Misol frontmatter:
```yaml
---
name: agent-used-sequential-independent-tool-calls
description: Agent mustaqil tool chaqiruvlarini ketma-ket qildi, parallel mumkin bo'lganda. Qachon: bir nechta mustaqil read/search bir vaqtda kerak bo'lganda.
---
```

Fayl nomi uzun va aniq bo'lsin: `AgentUsedSequentialToolCallsForIndependentOperationsInsteadOfParallelBatch.md`

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi "debugging dan tashqari" desа, skill mavzusini shu cheklovga moslashtir. Kategoriyani architecture.md bo'yicha to'g'ri tanla va takrorlanmaydigan non-debug skill yarat.
