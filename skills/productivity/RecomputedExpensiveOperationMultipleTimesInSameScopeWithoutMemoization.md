---
name: recomputed-expensive-op-without-memo
description: Bir xil qimmat hisob-kitob yoki API chaqiruvni bir scope ichida qayta-qayta bajarish — natijani saqlamaslik (memoization/cache yo'q).
---

# Qimmat operatsiyani qayta hisoblash, memoization ishlatmaslik

## Nima uchun bu skill kerak
Agent yoki kod yozishda bir xil ma'lumotni (fayl o'qish, API so'rov, og'ir hisob, skill qidiruv) bir necha marta qayta bajarish odatiy. Bu vaqt va tokenni isrof qiladi, ayniqsa loop yoki zanjirli tool chaqiruvlarda.

## Simptom (aynan shu)
- Bir xil tool chaqiruv yoki hisob-kitob (masalan `search_skills`, fayl o'qish, `git status`) qisqa vaqt ichida bir necha marta takrorlanadi.
- Natija o'zgarmagan bo'lishiga qaramay, har safar qayta so'raladi.
- Hisobot yoki keyingi qadamda oldingi natija qayta ishlatilmaydi.

## Sabab (100%)
Oldingi tool/hisob natijasini o'zgaruvchida saqlash yoki "allaqachon bor" deb e'tiborsiz qoldirish. Har safar "yangi" deb hisoblab qayta chaqirish.

## Tasdiqlash
- Suhbat yoki kodda bir xil so'rov/argument bilan bir necha chaqiruv bormi?
- Natija o'zgarmagan bo'lsa ham qayta olinganmi?
- Loop ichida doimiy qiymatni har iteratsiyada qayta hisoblayaptimi?

## Tuzatish (aynan shu)
Natijani bir marta ol, saqla, keyin qayta ishlat:

```python
# Noto'g'ri
for item in items:
    skills = search_skills("async")  # har safar qayta
    process(item, skills)

# To'g'ri
skills = search_skills("async")  # bir marta
for item in items:
    process(item, skills)
```

Tool uchun:
- Bir xil argument bilan toolni ikkinchi marta chaqirishdan oldin: oldingi javobni xotirada saqlab, undan foydalan.
- Faqat natija o'zgargan bo'lishi mumkin bo'lsa (masalan fayl tahrirlangan) qayta o'qi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Bir xil qimmat operatsiyani bir scope ichida bir marta bajar va natijani saqla.
- Memoization/cache oddiy o'zgaruvchi bilan ham ishlaydi — qayta chaqirishni to'xtat.
- Bu token, vaqt va chegara (rate limit) ni tejaydi.
