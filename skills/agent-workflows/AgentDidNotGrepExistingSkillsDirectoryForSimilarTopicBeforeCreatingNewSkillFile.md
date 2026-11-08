---
name: agent-did-not-grep-skills-dir-for-similar-before-create
description: Yangi skill yaratishdan oldin skills/ papkasida shunga o'xshash mavzu bor-yo'qligini grep yoki find bilan tekshirmaslik — takrorlanish yuzaga keladi.
---

# Skills papkasida o'xshash skill borligini tekshirmaslik

## Nima uchun bu skill kerak
Agent yangi skill yozishdan oldin mavjud skilllarni qidirib ko'rmaydi. Natijada deyarli bir xil skilllar to'planadi, qidiruv aralashadi va repoda shovqin paydo bo'ladi.

## Simptom (aynan shu)
- Yangi skill fayli yaratilgan.
- Skills/ da shunga o'xshash nom yoki mavzudagi fayl allaqachon bor.
- find yoki grep chaqirilmagan.
- Takroriy skill commit qilingan.

## Sabab (100%)
Agent "yangi mavzu" deb o'ylab, mavjud fayllarni qidirishni o'tkazib yuboradi. Search_skills yoki oddiy grep ishlatilmaydi.

## Tasdiqlash
- Skill yaratishdan oldin `find skills -name '*kalitsoz*'` yoki `grep -l "simptom" skills/**/*.md` ishga tushirilganmi?
- Natijada o'xshash skill topilganmi?
- Agar topilsa, yangi yaratilmaganmi?

## Tuzatish (aynan shu)
Yangi skill yozishdan **oldin**:

```bash
cd /tmp/skills-repo
find skills -type f -name '*.md' | xargs grep -l -i "asosiy kalit so'z" | head -10
# yoki
find skills -name '*Parallel*' -o -name '*Limit*' | head
```

Agar o'xshash topilsa, yangi yaratma yoki farqini aniq qil. Faqat haqiqatan yangi bo'lsa yoz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har doim skills/ ni grep/find bilan tekshir. Takroriy skill yaratma. Bu repo tozaligini saqlaydi.
