---
name: agent-used-generic-web-search-for-x-posts-instead-of-dedicated-x-tools
description: Agent used web_search or open_page to find recent X (Twitter) posts or user content instead of x_keyword_search, x_semantic_search, or x_user_search, resulting in incomplete, stale, or irrelevant results.
---

# Agent Used Generic Web Search for X Posts Instead of Dedicated X Tools

## Nima uchun bu skill kerak

X (Twitter) postlarini qidirish uchun maxsus tool'lar bor: `x_keyword_search`, `x_semantic_search`, `x_user_search`, `x_thread_fetch`. Ularni ishlatmasdan oddiy `web_search` yoki brauzer ochish noaniq, kechikkan yoki to'liq bo'lmagan natija beradi. Agent to'g'ri tool'ni tanlashni bilishi kerak.

## Simptom (aynan shu)

Foydalanuvchi so'nggi X postlari, muayyan foydalanuvchi postlari, yoki semantik qidiruv so'raganda, agent `web_search` qildi yoki saytga browser orqali kirdi, lekin `x_*` tool'larini chaqirmadi. Natija: eski postlar, to'liq bo'lmagan matn, yoki "topilmadi".

## Sabab (100%)

Agent mavjud tool'larni to'liq bilmaydi yoki "web_search hamma narsani qidiradi" deb taxmin qiladi. X uchun maxsus API-ga asoslangan tool'lar borligini e'tiborsiz qoldiradi.

## Tasdiqlash

1. Foydalanuvchi so'rovida "X", "Twitter", "post", "tweet", "@username", yoki so'nggi yangiliklar bor.
2. Tool call tarixida faqat `web_search` yoki `browser_execute`/`open_page` bor, `x_keyword_search` / `x_semantic_search` / `x_user_search` yo'q.
3. Natija sifat past yoki "X dan to'g'ridan-to'g'ri ololmadi" deb aytildi.

## Tuzatish (aynan shu)

So'rov X ga tegishli bo'lsa, darhol maxsus tool ishlat:

- Kalit so'z, operatorlar (from:user, since:date, filter:images va h.k.) uchun: `x_keyword_search`
- Ma'no bo'yicha qidiruv: `x_semantic_search`
- Foydalanuvchi topish: `x_user_search`
- Bitta post + kontekst: `x_thread_fetch`

Misol:

```python
# Noto'g'ri
web_search(query="elon musk latest tweet")

# To'g'ri
x_keyword_search(query="from:elonmusk", limit=5, mode="Latest")
```

Agar tool xato bersa, xato matnini o'qi va qayta urin; web_search ga qaytma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

X postlari uchun umumiy web_search o'rniga doim maxsus `x_*` tool'larini ishlatish kerak. Bu aniqroq, to'liqroq va yangi natija beradi.
