---
name: skill-description-too-generic-missing-symptom-keywords
description: Skill frontmatter description umumiy yoki simptom kalit so'zlarsiz yozilgan — search_skills aniq so'rovda skillni topa olmaydi.
---

# Skill description umumiy yoki simptom kalit so'zlarsiz

## Nima uchun bu skill kerak
search_skills asosan name + description + matn ichidagi so'z mosligiga tayanadi (keyword matching, semantic emas). Description qisqa va aniq simptom/holat kalit so'zlarini o'z ichiga olmasa, agent kerakli skillni topa olmaydi, natijada noto'g'ri yoki umumiy javob beradi.

## Simptom (aynan shu)
- Yangi skill yaratilgan, lekin `search_skills` aniq xato matni yoki simptom so'zi bilan qidirilganda topilmaydi yoki past relevancy.
- Frontmatter description "yaxshi kod", "xato tuzatish", "best practice" kabi umumiy iboralar.
- Descriptionda simptomning asosiy kalit so'zlari (masalan "mutable default", "off-by-one", "await in loop") yo'q.
- Agent skill yaratgandan keyin search bilan tekshirmagan.

## Sabab (100%)
Agent descriptionni "qisqa tavsif" deb hisoblab, umumiy yozgan. Architecture.md dagi "qachon kerak bo'lishi" va qidiruv mexanizmini (oddiy so'z mosligi) e'tiborsiz qoldirgan. Simptomning aniq kalit so'zlarini descriptionga kiritmagan.

## Tasdiqlash
- Description 1-2 jumla, lekin aniq simptom yoki holatni aytadimi?
- Description ichida qidiruv uchun kerakli kalit so'zlar bormi (xato matni, tipik ibora)?
- Skill yaratilgandan keyin `search_skills` bilan simptom so'zi orqali topiladimi?
- Mavjud yaxshi description namunalari (masalan patterns/ yoki agent-workflows/) ko'rilganmi?

## Tuzatish (aynan shu)
Descriptionni yozishda:

1. Avval simptomni aniq belgilang (qanday xato matni yoki holat).
2. Descriptionga o'sha simptomning asosiy kalit so'zlarini kirit: "qachon kerak" qismini aniq qil.
3. Umumiy so'zlardan qoch: "kod sifatini yaxshilash" o'rniga "Python mutable default argument shared state".
4. Yaratgandan keyin darhol tekshir:
   ```bash
   python skill_search.py "mutable default"   # yoki simptom kalit so'zi
   ```
5. Topilmasa — descriptionni qayta yoz va kalit so'z qo'sh.

To'g'ri misol:
```md
description: Python funksiya signature'da mutable default argument ishlatilgan — chaqiruvlar o'rtasida shared state va kutilmagan mutation.
```

Noto'g'ri:
```md
description: Funksiya argumentlarida xato ishlatish.
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Description faqat "qisqa" emas, search_skills uchun kalit so'z manbai.
- Simptomning aniq iboralarini descriptionga qo'y — topilishni kafolatlaydi.
- Skill yozgandan keyin har doim search bilan o'zing tekshir, topilmasa tuzat.
