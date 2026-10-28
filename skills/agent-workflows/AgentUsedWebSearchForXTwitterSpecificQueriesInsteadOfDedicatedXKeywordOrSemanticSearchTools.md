---
name: agent-used-web-search-for-x-twitter-specific-queries-instead-of-dedicated-x-tools
description: Foydalanuvchi X (Twitter) postlari, foydalanuvchilari yoki so'nggi trendlar haqida so'raganda oddiy web_search ishlatilsa, natijalar to'liq emas yoki eskirgan bo'ladi; x_keyword_search yoki x_semantic_search ishlatish kerak.
---

# X/Twitter so'rovlarida maxsus X tool'larini ishlatish

## Nima uchun bu skill kerak
X (avvalgi Twitter) postlari real-vaqtda va maxsus API orqali yaxshiroq olinadi. Oddiy web_search umumiy veb sahifalarni qaytaradi, lekin X ichidagi so'nggi postlar, foydalanuvchi faoliyati yoki aniq kalit so'zlar bo'yicha natijalarni to'liq bermaydi.

## Simptom (aynan shu)
Foydalanuvchi "X da so'nggi postlar", "@user nima yozdi", "trendlar", "x_keyword_search" ga o'xshash so'rov berganda agent web_search chaqiradi va umumiy yangilik saytlari yoki eski sahifalar qaytadi. To'g'ridan-to'g'ri X postlari yo'q yoki to'liq emas.

## Sabab (100%)
web_search umumiy veb qidiruv. X uchun alohida tool'lar bor: x_keyword_search (advanced operators bilan), x_semantic_search (ma'no bo'yicha), x_user_search, x_thread_fetch. Ular ishlatilmasa, X-ga xos ma'lumot olinmaydi.

## Tasdiqlash
So'rovda "X", "Twitter", "post", "tweet", "from:user", "trend" kabi so'zlar borligini tekshir. Tool chaqiruv tarixida web_search ishlatilgan, lekin x_* tool'lari yo'qligini ko'r.

## Tuzatish (aynan shu)
X ga tegishli so'rovlar uchun maxsus tool'larni ishlat:

- Aniq kalit so'z, operatorlar (from:user, since:, filter:images) uchun `x_keyword_search`
- Ma'no bo'yicha, semantik qidiruv uchun `x_semantic_search`
- Foydalanuvchi topish uchun `x_user_search`
- Post va javoblar uchun `x_thread_fetch`

Misol:

```
# Noto'g'ri
web_search(query="latest posts from elonmusk")

# To'g'ri
x_keyword_search(query="from:elonmusk", limit=5, mode="Latest")
```

Yoki semantik:

```
x_semantic_search(query="AI developments on X", limit=5)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
X/Twitter ma'lumotlari uchun web_search o'rniga x_keyword_search yoki x_semantic_search ishlat. Bu to'g'ri, yangi va to'liq natija beradi.
