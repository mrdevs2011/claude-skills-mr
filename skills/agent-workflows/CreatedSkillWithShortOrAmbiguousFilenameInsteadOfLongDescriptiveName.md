---
name: created-skill-with-short-or-ambiguous-filename
description: Yangi skill yaratilganda fayl nomi qisqa yoki noaniq bo'lsa, search_skills orqali topish qiyinlashadi — uzun va aniq nom ishlatilishi kerak.
---

# Skill yaratishda qisqa yoki noaniq fayl nomi ishlatilgan

## Nima uchun bu skill kerak
Architecture.md qoidasiga ko'ra, skill fayl nomi o'zi nima haqida ekanini to'liq bildirishi kerak (uzun bo'lsa ham). Qisqa nomlar (masalan `mutable.md`, `bugfix.md`, `skill1.md`) search_skills da past relevancy beradi yoki umuman topilmaydi, chunki qidiruv name + description + matnga tayanadi. Agentlar ko'pincha "qisqa qulay" deb qisqartirishadi.

## Simptom (aynan shu)
- Yangi skill fayli qisqa yoki umumiy nom bilan yaratilgan: `fix.md`, `error.md`, `python-bug.md`, `agent-mistake.md`.
- Nom simptom yoki sababni to'liq ifodalamaydi.
- `search_skills` da shu skillni topish uchun aniq kalit so'zlar kerak bo'ladi, yoki topilmaydi.
- Boshqa skilllar uzun nomlar bilan: `PythonMutableDefaultArgumentInFunctionSignatureCausesSharedStateAcrossCalls.md`.

## Sabab (100%)
Agent architecture.md dagi "Fayl nomi o'zi nima haqida ekanini to'liq bildiradi (uzun bo'lsa ham mayli)" qoidasini e'tiborsiz qoldirdi. Qisqartma yoki noaniq nom ishlatish taqiqlangan, chunki search mexanizmi nomdagi so'zlarga tayanadi.

## Tasdiqlash
1. Yangi skill fayl nomini o'qi — u simptomni, sababni yoki tuzatishni to'liq ifodalayaptimi?
2. Nom 5-10 so'zdan kammi yoki faqat umumiy so'zlarmi (`bug`, `fix`, `error`, `skill`)?
3. `python skill_search.py "mutable default"` kabi qidiruvda topiladimi (agar shu mavzu bo'lsa)?
4. Architecture.md dagi misollar bilan solishtir.

## Tuzatish (aynan shu)
Fayl nomini uzun va aniq qilib qayta nomla. Nom quyidagilarni o'z ichiga olsin:
- Til/texnologiya (Python, React, Agent)
- Aniq simptom yoki xato holati
- Sabab yoki oqibat

Misol:
- Noto'g'ri: `mutable-default.md` yoki `shared-state.md`
- To'g'ri: `PythonMutableDefaultArgumentInFunctionSignatureCausesSharedStateAcrossCalls.md`

Keyin:
```bash
cd /tmp/skills-repo
git mv skills/agent-workflows/qisqa-nom.md skills/agent-workflows/YangilanganUzunAniqNom.md
# README.md strukturasini ham yangila
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill fayl nomi qisqa bo'lishi mumkin emas — u o'zi dokumentatsiya bo'lishi kerak. Uzun, aniq, simptomni ifodalovchi nom search_skills da topilishini ta'minlaydi va boshqa agentlar uchun tushunarli bo'ladi.
