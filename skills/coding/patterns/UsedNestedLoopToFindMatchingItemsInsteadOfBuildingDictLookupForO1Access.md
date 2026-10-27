---
name: nested-loop-instead-of-dict-lookup
description: Ikki ro'yxatni moslashtirish uchun ichki sikl ishlatilganda (har bir element uchun to'liq qidiruv) — O(n*m) sekin ishlash, katta ma'lumotda sekinlik yoki timeout. Dict lookup bilan O(n+m) bo'lishi kerak edi.
---

# Ichki sikl bilan moslashtirish o'rniga dict lookup ishlatmaslik

## Nima uchun bu skill kerak
AI ba'zan ikki ro'yxat yoki jadvalni birlashtirish (join) kerak bo'lganda oddiy ichki for sikl yozadi. Kichik ma'lumotda ishlaydi, lekin ro'yxatlar kattalashganda kvadratik vaqt sarflaydi, sekinlashadi yoki ish vaqti tugaydi. Bu "patterns" kategoriyasidagi tipik e'tiborsizlik.

## Simptom (aynan shu)
- Kodda ikki ro'yxat ustida ichki sikl: `for a in list_a: for b in list_b: if a.id == b.id: ...`
- Natija to'g'ri, lekin katta inputda sekin (bir necha soniya yoki timeout).
- Profiling yoki logda "nested loop" yoki uzoq ishlash ko'rinadi.
- "Optimallashtir" yoki "tezlashtir" so'ralganda bu holat chiqadi.

## Sabab (100%)
Har bir tashqi element uchun ichki ro'yxatni to'liq skanerlash. Python'da list ichida `in` yoki sikl — O(n). Katta n va m uchun O(n*m). Dict (hash map) ishlatilsa O(1) qidiruv, umumiy O(n+m).

## Tasdiqlash
1. Kodda ikki for sikl yoki list comprehension ichida boshqa list qidiruvi bormi?
2. Moslashtirish sharti oddiy tenglik (id, key, name)mi?
3. Ro'yxatlar 100+ element bo'lishi mumkinmi?
4. Agar ha va dict ishlatilmagan bo'lsa — bu holat.

## Tuzatish (aynan shu)
Birinchi ro'yxatni dict'ga o'girib, keyin O(1) lookup qil:

```python
# Noto'g'ri — O(n*m)
results = []
for user in users:
    for profile in profiles:
        if user.id == profile.user_id:
            results.append({**user, **profile})
            break

# To'g'ri — O(n + m)
profile_by_user_id = {p.user_id: p for p in profiles}
results = []
for user in users:
    profile = profile_by_user_id.get(user.id)
    if profile:
        results.append({**user, **profile})
```

Agar bir nechta match bo'lishi mumkin bo'lsa, `defaultdict(list)` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ikki ro'yxatni moslashtirishda ichki sikl o'rniga dict lookup ishlatiladi.
- Bu O(n*m) dan O(n+m) ga o'tkazadi va katta ma'lumotda sekinlikni oldini oladi.
- Oddiy tenglik sharti bo'lsa, har doim dict'ga o'girishni o'ylab ko'r.
