---
name: created-skill-without-verifying-searchability
description: Yangi skill yaratib, uni search_skills orqali topilishini tekshirmasdan commit/push qilish — skill qidiruvda ko'rinmay qoladi va foydasiz bo'ladi.
---

# Yangi skillni search_skills bilan topilishini tekshirmasdan commit qilish

## Nima uchun bu skill kerak
Agentlar yangi skill faylini yozib, formatga amal qilganini o'ylab, uni darhol git add/commit/push qiladi. Ammo skill_search.py dagi qidiruv (name + description + matn mosligi, sinonimlar) uni topa olmaydi — description juda umumiy, kalit so'zlar yo'q yoki fayl nomi qidiruvga mos emas. Natijada foydalanuvchi kerakli vaqtda skillni topa olmaydi.

## Simptom (aynan shu)
- Skill fayli yaratilgan va commit qilingan.
- search_skills("skill mavzusi kalit so'z") chaqirilganda yangi skill natijada chiqmaydi.
- Description juda qisqa yoki umumiy ("yaxshi skill", "productivity tip").
- Fayl nomi yoki frontmatter name qidiruv so'zlarini o'z ichiga olmaydi.
- Sinonimlar (SYNONYMS) yangilanmagan bo'lsa ham, asosiy moslik yo'q.

## Sabab (100%)
Agent "fayl yaratdim, format to'g'ri, shunday qilib push qilaman" deb o'ylab, yaratilgan skillni haqiqiy search_skills orqali sinab ko'rmaydi. Qidiruv mexanizmi (oddiy so'z mosligi + _expand) qanday ishlashini e'tiborsiz qoldiradi.

## Tasdiqlash
- Yangi skill uchun kamida 2-3 ta real qidiruv so'rovi bilan `python skill_search.py "so'rov"` ishga tushirilganmi?
- Natijada aynan shu skill (name yoki path) chiqdimi?
- Description ichida qidiruvda ishlatiladigan kalit so'zlar (simptom, sabab, holat) bormi?
- Agar topilmasa — description yoki matnni boyitish kerakmi?

## Tuzatish (aynan shu)
Skill yaratgandan so'ng, commitdan **oldin** majburiy tekshir:

1. Skill faylini to'liq yoz (frontmatter + 6 bo'lim).
2. Lokalda skill_search.py ni ishga tushir:
   ```bash
   python skill_search.py "simptom kalit so'z"
   python skill_search.py "sabab yoki holat"
   ```
3. Natijada yangi skill chiqishini tasdiqla. Agar chiqmasa:
   - description ni aniqroq qil (qachon kerak bo'lishi + kalit so'zlar).
   - SKILL.md matniga qidiruv uchun muhim iboralarni qo'sh.
   - Kerak bo'lsa SYNONYMS ga variant qo'sh (skill_search.py ichida).
4. Faqat topilganidan keyin git add/commit/push qil.
5. Hisobotda qidiruv natijasini qisqacha ayt (tokenni hech qachon ko'rsatma).

Misol:
```bash
# To'g'ri tekshiruv
python skill_search.py "search skills topilmaydi"
# Natija: created-skill-without-verifying-searchability chiqishi kerak
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Skill yaratish — faqat fayl yozish emas, uni qidiruvda topiladigan qilish.
- Commitdan oldin search_skills bilan real so'rovlar orqali tekshir.
- Bu oddiy qadam skillning foydali bo'lishini kafolatlaydi va bo'sh skill'larning oldini oladi.
