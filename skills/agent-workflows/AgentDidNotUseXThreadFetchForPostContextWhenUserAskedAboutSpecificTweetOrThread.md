---
name: agent-did-not-use-x-thread-fetch-for-post-context
description: Foydalanuvchi aniq X post ID yoki thread haqida so'raganda (javoblar, parent postlar) x_thread_fetch ishlatilmasa, faqat asosiy post yoki umuman to'liq kontekst olinmaydi.
---

# Aniq X post/thread uchun x_thread_fetch ishlatmaslik

## Nima uchun bu skill kerak
X postlari ko'pincha conversation_id yoki thread ichida bo'ladi. Faqat asosiy postni ko'rish yetarli emas — parent, reply va atrofidagi kontekst kerak bo'ladi. x_thread_fetch shu uchun maxsus yaratilgan. Uni ishlatmaslik to'liq rasmni bermaydi.

## Simptom (aynan shu)
- Foydalanuvchi "bu postga javoblar nima", "thread to'liq o'qi", "parent post nima edi", aniq status ID yoki URL berganida agent x_keyword_search yoki web_search ishlatadi.
- Natijada faqat bitta post yoki umuman X ga tegishli bo'lmagan sahifalar chiqadi.
- conversation_id, in_reply_to yoki to'liq thread yo'q.

## Sabab (100%)
Agent X tool'larini biladi, lekin x_thread_fetch ni aniq post ID berilganda ishlatishni unutadi yoki umumiy qidiruv yetarli deb o'ylaydi. post_id parametri bilan chaqirish o'rniga boshqa tool tanlanadi.

## Tasdiqlash
- So'rovda aniq post ID, status URL (x.com/user/status/123) yoki "thread", "javoblar", "parent" so'zlari bormi?
- Tool chaqiruvda x_thread_fetch(post_id=...) ishlatilganmi yoki boshqa tool?
- Natija faqat bitta postmi yoki atrofidagi kontekst bormi?

## Tuzatish (aynan shu)
Aniq post yoki thread so'ralganda:

1. URL yoki ID dan post_id ni ajrat (raqamli qism).
2. `x_thread_fetch` ni post_id bilan chaqir.
3. Natijada parent posts va replies bilan to'liq kontekst keladi.
4. Agar bir nechta post bo'lsa, kerakli qismini tahlil qil.

Misol:
```
x_thread_fetch(post_id="1234567890123456789")
```
Bu asosiy post + atrofidagi threadni qaytaradi. Boshqa tool'lar bilan almashtirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Aniq X post ID yoki thread so'ralganda har doim x_thread_fetch ishlat.
- Bu parent, replies va to'liq conversation kontekstini beradi.
- Umumiy qidiruv tool'lari aniq post uchun yetarli emas.
