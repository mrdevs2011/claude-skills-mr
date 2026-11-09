---
name: agent-created-generic-skill-instead-of-narrow-specific
description: Yangi skill yaratishda umumiy maslahatlar yoki bir nechta mavzuni bitta faylga yozish — architecture.md talabiga zid, bitta aniq simptom/sabab/tuzatish bo'lishi shart.
---

# Skill yaratishda umumiy yoki ko'p mavzuli maslahat yozish

## Nima uchun bu skill kerak
architecture.md aniq belgilaydi: har bir skill BITTA aniq simptom, BITTA aniq sabab (100%), BITTA aniq tuzatish bo'lishi shart. Umumiy "yaxshi amaliyotlar" yoki bir nechta xatolarni birlashtirgan skill yozilmaydi. Agentlar ba'zan bu qoidani unutib, keng tavsifli yoki multi-topic skill yaratadi. Natijada search_skills orqali topilishi qiyinlashadi va focus yo'qoladi.

## Simptom (aynan shu)
- Yangi skill .md fayli yaratilgan.
- Frontmatter va bo'limlar bor, lekin mazmun umumiy (masalan "yaxshi kod yozish", "tool'larni to'g'ri ishlatish").
- Bir nechta turli xil xato yoki holat bitta skillda yozilgan.
- Simptom bo'limi aniq bitta holatni emas, kengroq muammolarni qamrab oladi.

## Sabab (100%)
Agent architecture.md dagi "juda tor va bitta nuqtaga qaratilgan" qoidasini to'liq o'qimagan yoki e'tiborsiz qoldirgan. Umumiy foydali deb hisoblab, tor skill o'rniga kengroq yozgan.

## Tasdiqlash
- Skill fayli architecture.md formatiga mosmi (frontmatter + 6 bo'lim)?
- Simptom, Sabab, Tuzatish bo'limlari bitta aniq holatga qaratilganmi?
- Agar umumiy maslahat yoki bir nechta misol bo'lsa — shu skill qo'llaniladi.
- Mavjud skill'lar bilan solishtir: ularning hammasi tor va aniq.

## Tuzatish (aynan shu)
1. Skill yaratishdan oldin architecture.md ni o'qi va "Skill yozish qoidalari" bo'limini qayta ko'r.
2. Faqat BITTA aniq simptomni tanla (aynan shu xato matni yoki holat).
3. Sababni 100% aniq qilib yoz, bir nechta sababni aralashtirma.
4. Tuzatishda aniq kod misoli yoki qadamlar ber.
5. Agar bir nechta mavzu bo'lsa — alohida skill fayllariga ajrat.
6. Fayl nomini uzun va aniq qilib yoz (nima haqida ekanini to'liq bildirsin).

Misol:
```
# Noto'g'ri
name: good-tool-usage
description: Tool'larni to'g'ri ishlatish haqida umumiy maslahatlar
# Ko'p mavzu: parallel, schema, error handling...

# To'g'ri
name: agent-called-connected-tool-with-guessed-args
description: search_connected_tools ishlatmasdan call_connected_tool chaqirish — schema xatosi
# Faqat bitta holat, bitta tuzatish
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har bir skill faqat bitta aniq simptom, bitta sabab va bitta tuzatishga qaratilishi shart.
- Umumiy maslahatlar yozilmaydi — bu search_skills samaradorligini pasaytiradi.
- architecture.md ni har safar skill yaratishdan oldin o'qish va 100% amal qilish kerak.
