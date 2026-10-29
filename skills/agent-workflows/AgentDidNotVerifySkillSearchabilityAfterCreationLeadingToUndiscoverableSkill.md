---
name: agent-did-not-verify-skill-searchability-after-creation
description: Yangi skill yaratilgandan keyin search_skills orqali topilishini tekshirmaslik — skill mavjud bo'lsa-da qidiruvda ko'rinmaslikka olib keladi.
---

# Skill yaratilgandan keyin qidiruvda topilishini tekshirmaslik

## Nima uchun bu skill kerak
Agent yangi skill yozib, commit va push qilgandan keyin uni search_skills yordamida haqiqatan topilishini tekshirmaydi. Natijada frontmatter, fayl nomi yoki kategoriya xatosi tufayli skill qidiruvda topilmaydi, foydalanuvchi uni ishlata olmaydi.

## Simptom (aynan shu)
- Skill fayli yaratildi, git commit va push muvaffaqiyatli, lekin `search_skills` yoki `python skill_search.py "kalit so'z"` bilan topilmadi.
- Frontmatter description da simptom kalit so'zlari yo'q, shuning uchun mos kelmadi.
- Fayl noto'g'ri papkada yoki nom qidiruvga mos emas.
- Agent "push qildim, tayyor" deb hisobot berdi, lekin discoverability ni tasdiqlamadi.

## Sabab (100%)
Agent skill yaratish va push qilishni oxirgi qadam deb hisoblab, architecture.md dagi "search_skills avtomatik ko'radi" va "sinash" bo'limini e'tiborsiz qoldirdi. Yaratilgan skillning haqiqiy topilishini lokalda tekshirmadi.

## Tasdiqlash
- Skill yaratilgandan keyin `python skill_search.py <simptom kalit so'zi>` ishlatildimi?
- Natija yangi skillni qaytardimi?
- Frontmatter description da aniq simptom so'zlari bormi?
- Fayl nomi uzun va aniqmi (architecture.md nomlash qoidasi)?

## Tuzatish (aynan shu)
1. Skill yozib, skills/ tegishli papkasiga qo'ygandan keyin, commitdan oldin yoki keyin lokalda tekshir:
   ```bash
   python skill_search.py "simptom kalit so'z" 
   ```
   yoki to'g'ridan-to'g'ri search_skills tool bilan.
2. Agar topilmasa — frontmatter description ni aniqroq qil, simptom so'zlarini qo'sh, fayl nomini uzunroq qil.
3. Faqat topilgandan keyin commit va push qil.
4. Hisobotda "search_skills orqali tasdiqlandi" deb yoz.

```python
# Tekshirish misoli
# python skill_search.py "qidiruvda topilmaslik"
# Natija yangi skillni ko'rsatishi kerak
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skillni push qilish yetarli emas — search_skills orqali topilishini majburiy tekshir.
- Bu architecture.md dagi sinash va discoverability qoidasiga amal qilishdir.
- Aks holda skill mavjud bo'lsa ham ishlatilmaydi.
