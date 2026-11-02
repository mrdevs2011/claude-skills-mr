---
name: agent-created-skill-without-concrete-code-example-in-tuzatish
description: Yangi skill yaratayotganda "Tuzatish" bo'limida aniq kod misoli qo'yilmagan — faqat matnli tavsif qolgan. Bu holatda skill kamroq amaliy va qidiruvda foydali bo'lmaydi.
---

# AgentCreatedSkillWithoutConcreteCodeExampleInTuzatishSectionReducingActionability

## Nima uchun bu skill kerak
Skill'lar bitta aniq simptom → bitta sabab → bitta tuzatish shaklida yoziladi. "Tuzatish" bo'limi faqat so'z bilan bo'lsa, model uni o'qib darhol qo'llay olmaydi. Kod misoli bo'lmasa skill "abstract" qoladi va search_skills orqali topilganda ham kam foyda beradi.

## Simptom (aynan shu)
Yangi yaratilgan skill faylida `## Tuzatish (aynan shu)` bo'limi mavjud, lekin ichida hech qanday kod bloki (` ```python `, ` ```js `, ` ```bash ` yoki boshqa) yo'q. Faqat "shunday qiling" degan matn bor, aniq before/after misol yo'q.

## Sabab (100%)
Skill yozuvchi (agent) "Tuzatish"ni tushuntirish deb o'ylab, faqat so'zli tavsif yozgan. Architecture.md dagi formatda "kod misoli bilan" deb yozilganini e'tiborsiz qoldirgan yoki "yetarli" deb hisoblagan.

## Tasdiqlash
1. Skill faylini oching.
2. `## Tuzatish` bo'limini toping.
3. Ichida hech qanday fenced code block (` ``` `) bor-yo'qligini tekshiring.
4. Agar faqat matn bo'lsa — bu skill muammosi.

## Tuzatish (aynan shu)
"Tuzatish" bo'limiga doim aniq, qisqa, ishlaydigan kod misoli qo'shing. Before (noto'g'ri) va after (to'g'ri) ko'rsating.

Noto'g'ri:
```md
## Tuzatish (aynan shu)
Faylni to'g'ri yozing va kod qo'shing.
```

To'g'ri:
```md
## Tuzatish (aynan shu)
Skill yaratishda "Tuzatish" bo'limiga doim kod misoli qo'shing:

```python
# Noto'g'ri: faqat matn
# "Listni to'g'ri qiling"

# To'g'ri: aniq misol
items = [1, 2, 3]
result = [x * 2 for x in items]  # list comprehension
print(result)  # [2, 4, 6]
```
```

Har doim tilga mos (Python, JS, bash, markdown) fenced code block ishlating. Misol 5-15 qator bo'lsin, ortiqcha emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill'ning "Tuzatish" bo'limi matnli tavsif emas, aniq kod misoli bo'lishi shart. Bu skill'ni search_skills topganda model darhol qo'llay olishi uchun kerak. Aks holda skill kam foydali bo'lib qoladi.
