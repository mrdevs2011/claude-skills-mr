---
name: created-duplicate-skill-without-searching-existing
description: Yangi skill yaratishdan oldin mavjud skilllarni search_skills orqali qidirib ko'rmaslik — bir xil yoki juda o'xshash skill takrorlanadi, katalog ifloslanadi.
---

# Yangi skillni mavjudlarni qidirmasdan yaratish (duplicate)

## Nima uchun bu skill kerak
Agentlar "yangi skill kerak" deb o'ylab, darhol yangi fayl yozadi. Ammo `search_skills` yoki `find skills` bilan oldindan tekshirmaydi. Natijada bir xil simptom/sabab/tuzatish haqida ikkinchi skill paydo bo'ladi. Katalog kattalashadi, qidiruvda chalkashlik, token isrof, foydalanuvchi ikkita deyarli bir xil natija oladi.

## Simptom (aynan shu)
- Yangi skill fayli yaratilgan, lekin mavjud skilllar orasida deyarli bir xil yoki juda yaqin mavzu bor.
- `search_skills "kalit so'z"` chaqirilganda eski skill ham, yangi skill ham chiqadi yoki yangi skill eskiining qayta yozilishi.
- README va architecture yangilangan, lekin asl skill allaqachon bor edi.
- Ikki faylning description, simptom yoki tuzatish qismi 70%+ o'xshash.

## Sabab (100%)
Agent "bu holat haqida skill yo'q" deb taxmin qiladi va mavjud skill bazasini (search_skills yoki `find skills -name` + grep) tekshirmaydi. Yoki faqat nom bo'yicha qarab, mazmun o'xshashligini e'tiborsiz qoldiradi.

## Tasdiqlash
1. Yangi skill yozishdan oldin kamida 2-3 ta kalit so'z bilan `python skill_search.py "so'rov"` ishga tushirilganmi?
2. `find skills -type f -name "*.md" | xargs grep -l "asosiy simptom so'zi"` qilinganmi?
3. Topilgan skilllarning frontmatter description va "Simptom" bo'limi yangi reja bilan solishtirilganmi?
4. Agar o'xshash skill bor — uni yangilash yoki kengaytirish o'rniga yangi yaratilganmi?

## Tuzatish (aynan shu)
**Har doim avval qidir:**

```bash
# 1. Qidiruv
python skill_search.py "duplicate skill" 
python skill_search.py "search existing before create"

# 2. Fayl nomlari
find skills -type f -name "*.md" | sort

# 3. Mazmun bo'yicha
grep -r -l "CreatedDuplicate\|search.*existing\|takror" skills/ || true
```

Agar o'xshash skill topilsa:
- Uni yangila (kerakli qismni qo'sh), yangi fayl yaratma.
- Yoki aniq farq bo'lsa — yangi skillda "bu skill X skill'dan farq qiladi: ..." deb yoz.

Faqat hech qanday mos keladigan skill topilmasa yangi fayl yarat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skill yaratishdan oldin albatta search_skills va find/grep bilan mavjudlarni tekshir.
- Duplicate skill katalogni ifloslantiradi va qidiruvni yomonlashtiradi.
- O'xshash bo'lsa yangila, yangi yaratma.
