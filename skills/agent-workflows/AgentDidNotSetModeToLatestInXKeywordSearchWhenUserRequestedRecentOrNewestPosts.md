---
name: agent-did-not-set-mode-to-latest-in-x-keyword-search-when-user-requested-recent-or-newest-posts
description: When the user asks for recent, latest, or newest X posts, the agent calls x_keyword_search without mode="Latest", returning Top-ranked instead of chronologically newest results.
---

# Agent Did Not Set Mode To Latest In X Keyword Search When User Requested Recent Or Newest Posts

## Nima uchun bu skill kerak
X (Twitter) so'rovlarida foydalanuvchi "oxirgi", "eng yangi", "recent posts" deb so'rasa, default "Top" rejimi eski lekin mashhur postlarni qaytaradi. Bu noto'g'ri vaqtdagi ma'lumot beradi.

## Simptom (aynan shu)
Foydalanuvchi "oxirgi 5 ta post", "eng yangi yangiliklar", "latest tweets about X" deb so'raydi. Agent `x_keyword_search` chaqiradi, lekin `mode` parametrini o'tkazmaydi yoki "Top" qoldiradi. Natija: eng so'nggi postlar o'rniga eng ko'p like olganlar keladi.

## Sabab (100%)
`x_keyword_search` toolining default `mode` qiymati "Top" (mashhur). "Latest" faqat aniq berilganda ishlaydi. Agent foydalanuvchi so'zini ("recent", "yangilar") mode ga bog'lamaydi.

## Tasdiqlash
1. Tool chaqiruv logida `mode` yo'q yoki `"Top"` ekanini tekshiring.
2. Qaytgan postlarning vaqtlarini solishtiring — eng yangisi bir necha kun oldin bo'lishi mumkin.
3. Foydalanuvchi so'rovida "oxirgi", "latest", "newest", "so'nggi" so'zlari borligini tasdiqlang.

## Tuzatish (aynan shu)
Foydalanuvchi eng yangi postlarni so'rasa, har doim `mode: "Latest"` qo'shing.

```python
# Noto'g'ri
x_keyword_search(query="AI news", limit=5)

# To'g'ri
x_keyword_search(query="AI news", limit=5, mode="Latest")
```

Agar so'rovda vaqt oralig'i ham bo'lsa (`since:`, `until:`), ularni ham qo'shing.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
X postlarini qidirganda default Top emas, foydalanuvchi "eng yangi" desа `mode="Latest"` majburiy. Bu so'nggi ma'lumotni to'g'ri olishning yagona yo'li.
