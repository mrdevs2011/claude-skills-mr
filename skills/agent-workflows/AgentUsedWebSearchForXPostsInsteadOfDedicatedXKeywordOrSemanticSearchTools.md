---
name: agent-used-web-search-for-x-posts-instead-of-dedicated-x-tools
description: Foydalanuvchi X (Twitter) postlari, trendlar yoki foydalanuvchi haqida so'raganda agent web_search ishlatadi, maxsus x_keyword_search yoki x_semantic_search tool'larini emas — natijada past sifatli yoki to'liq bo'lmagan ma'lumot keladi.
---

# X postlari uchun web_search o'rniga maxsus X tool'larini ishlatmaslik

## Nima uchun bu skill kerak
X platformasidagi postlar, foydalanuvchilar, keyword qidiruv yoki semantic mos postlar uchun maxsus tool'lar mavjud: x_keyword_search (advanced operators bilan), x_semantic_search, x_user_search, x_thread_fetch. web_search umumiy veb qidiruv, X natijalarini to'liq yoki to'g'ri bermaydi, filtrlar va engagement o'lchovlarini qo'llab-quvvatlamaydi.

## Simptom (aynan shu)
- So'rovda "X da", "Twitter", "post", "tweet", "from:user", "min_faves", trend, foydalanuvchi faoliyati haqida gap bor.
- Agent `web_search` chaqiradi (query ichida "site:x.com" yoki "twitter" bilan).
- Natijada oddiy veb sahifalar, eski postlar yoki umuman X ga tegishli bo'lmagan kontent chiqadi.
- Advanced operatorlar (filter:images, min_replies, since:) ishlamaydi yoki qo'llanilmaydi.

## Sabab (100%)
Agent X uchun maxsus tool'lar borligini biladi, lekin oddiy veb qidiruv yetarli yoki osonroq deb o'ylaydi. X tool'larining parametrlari (query operators, mode=Top/Latest, limit) to'g'ri ishlatilmasa yoki umuman chaqirilmasa.

## Tasdiqlash
1. Foydalanuvchi so'rovida X/Twitter, post, foydalanuvchi, keyword, trend so'zlari bormi?
2. Tool chaqiruv tarixida `x_keyword_search`, `x_semantic_search` yoki `x_user_search` ishlatilganmi?
3. Agar faqat `web_search` bo'lsa — bu aynan shu xato.
4. Natijada X postlarining to'liq matni, media, engagement yoki aniq filterlangan ro'yxat bormi?

## Tuzatish (aynan shu)
X kontenti so'ralganda maxsus tool'ni tanla:

- Keyword, operators, filters (from:, min_faves:, filter:media, since:): `x_keyword_search(query=..., limit=..., mode="Latest" yoki "Top")`
- Ma'no bo'yicha mos postlar: `x_semantic_search(query=..., limit=..., from_date=...)`
- Foydalanuvchi topish: `x_user_search(query=..., count=...)`
- Aniq post/thread: `x_thread_fetch(post_id=...)`

Misol:
```
x_keyword_search(query="(AI OR Grok) (min_faves:10) filter:images", limit=5, mode="Latest")
```
`web_search` ni faqat X dan tashqari umumiy veb ma'lumot uchun ishlat. X uchun almashtirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- X postlari, qidiruv yoki foydalanuvchi so'rovlari uchun har doim maxsus X tool'larini (x_keyword_search, x_semantic_search va h.k.) ishlat.
- web_search X natijalarini to'liq, filterlangan yoki real-time bermaydi.
- Operators va mode parametrlarini to'g'ri qo'llash natija sifatini keskin oshiradi.
