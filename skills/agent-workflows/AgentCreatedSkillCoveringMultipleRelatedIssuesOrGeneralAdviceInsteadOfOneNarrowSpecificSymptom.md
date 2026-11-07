---
name: agent-created-skill-covering-multiple-related-issues-or-general-advice-instead-of-one-narrow-specific-symptom
description: Agent yangi skill yaratayotganda bir nechta simptom, umumiy "yaxshi amaliyot" maslahati yoki keng mavzuni bitta faylga yig'adi — bu search_skills orqali topilishni qiyinlashtiradi va arxitektura qoidasini buzadi.
---

# Agent bitta skillga bir nechta simptom yoki umumiy maslahat yig'ishi

## Nima uchun bu skill kerak
Arxitektura qoidasiga ko'ra har bir skill **juda tor** bo'lishi shart: bitta aniq simptom (aynan shu xato matni yoki holat), bitta 100% sabab, bitta aniq tuzatish. Agent "coding patterns" yoki "agent workflows" kabi keng mavzuda skill yaratayotganda bir nechta o'xshash xatoni yoki umumiy tavsiyani bitta faylga yig'ib qo'ysa, skill qidiruvda aniq mos kelmaydi, foydalanuvchi (yoki keyingi agent) kerakli tuzatishni tez topa olmaydi, va skill qoidalari buziladi.

## Simptom (aynan shu)
- Yangi skill fayli bir nechta alohida xato holatini yoki "umumiy maslahatlar" ro'yxatini o'z ichiga oladi.
- Frontmatter description da "bir nechta holat", "yaxshi amaliyotlar", "qanday qilish kerak" kabi keng iboralar bor.
- Faylda "Simptom" bo'limi bitta aniq holat o'rniga bir nechta nuqtani sanaydi.
- Natijada search_skills so'rovi aniq xato matniga mos kelmaydi yoki skill juda uzun va fokus yo'qolgan bo'ladi.

## Sabab (100%)
Agent arxitekturadagi "bitta aniq simptom — bitta sabab — bitta tuzatish" qoidasini e'tiborsiz qoldirdi yoki "yuqori sifatli" deb keng qamrovli skill yozishni afzal ko'rdi. U search_skills mexanizmi tor, aniq mos keladigan skill'larni topishga mo'ljallanganini hisobga olmadi.

## Tasdiqlash
1. Skill faylini ochib, "Simptom (aynan shu)" bo'limida bitta aniq holatmi yoki bir nechtami?
2. Frontmatter description 1-2 jumla va aniq simptomni aytadimi?
3. "Tuzatish" bo'limi bitta aniq kod yoki qadammi, yoki umumiy ro'yxatmi?
4. Agar bir nechta alohida simptom bo'lsa — ular alohida skill fayllariga ajratilishi kerakmi?

## Tuzatish (aynan shu)
Har bir skill faqat **bitta** simptomga qaratilgan bo'lishi kerak:

1. Birinchi simptomni tanla va faqat unga skill yoz.
2. Frontmatter:
   ```yaml
   ---
   name: qisqa-kebab-case-id
   description: Aniq simptom — qachon kerak (1-2 jumla)
   ---
   ```
3. Bo'limlar: Nima uchun, Simptom (aynan shu), Sabab (100%), Tasdiqlash, Tuzatish (aynan shu, kod misoli bilan), Xulosa.
4. Agar boshqa o'xshash holat bo'lsa — alohida yangi .md fayl yarat.
5. Fayl nomini uzun va tavsiflovchi qil: `AgentCreatedSkillCoveringMultipleRelatedIssuesOrGeneralAdviceInsteadOfOneNarrowSpecificSymptom.md`

Misol (noto'g'ri): bitta skillda "mutable default" va "list multiplication" ikkalasini yozish.
To'g'ri: har biri alohida fayl.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill'lar tor va bitta nuqtaga qaratilgan bo'lishi shart. Bir nechta simptom yoki umumiy maslahatni bitta faylga yig'ma — har birini alohida skill qil. Bu search_skills orqali tez va aniq topilishini ta'minlaydi.
