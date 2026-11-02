---
name: agent-used-x-keyword-search-to-find-user-instead-of-x-user-search
description: Agent X'da ma'lum bir foydalanuvchi akkauntini topish uchun x_keyword_search yoki x_semantic_search ishlatdi, x_user_search tool'i o'rniga — natijada noto'g'ri yoki to'liq bo'lmagan profil ma'lumoti oldi.
---

# Agent X user akkauntini topish uchun keyword/semantic search ishlatdi

## Nima uchun bu skill kerak
X (Twitter) da ma'lum bir odam yoki akkauntni topish kerak bo'lganda maxsus `x_user_search` tool bor. Keyword yoki semantic search postlarni qidiradi, user profilini emas. Noto'g'ri tool ishlatilsa, agent haqiqiy user ma'lumotini (bio, follower soni, verification) ololmaydi yoki noto'g'ri odamni topadi.

## Simptom (aynan shu)
- Foydalanuvchi "Elon Musk'ning X akkauntini top" yoki "@username profilini ko'r" deydi.
- Agent `x_keyword_search` yoki `x_semantic_search` chaqiradi (query'da ism yoki @).
- Natijada postlar keladi, lekin to'liq user profili, verified status, follower count yoki to'g'ri username yo'q.
- Ba'zan noto'g'ri akkaunt yoki eski/parodiya akkaunt chiqadi.

## Sabab (100%)
Agent user qidiruvi uchun maxsus `x_user_search` tool'i borligini bilmadi yoki "X search" umumiy deb o'ylab keyword/semantic ishlatdi. Tool katalogida `x_user_search` alohida: name yoki account bo'yicha user qidiradi.

## Tasdiqlash
1. So'rovda aniq user/akkaunt nomi yoki @handle borligini tekshir.
2. Agent qaysi tool'ni chaqirganini ko'r: `x_keyword_search` / `x_semantic_search` vs `x_user_search`.
3. Natija postlar ro'yxati ekanini, user object emasligini tasdiqla.
4. Tool schema'da `x_user_search` parametri `query` (name or account) ekanini o'qi.

## Tuzatish (aynan shu)
User akkauntini topish uchun doim `x_user_search` ishlat:

```
x_user_search(query="Elon Musk", count=3)
```

yoki

```
x_user_search(query="@elonmusk", count=1)
```

Keyin kerak bo'lsa `x_thread_fetch` yoki `x_keyword_search from:username` bilan postlarni ol. Hech qachon user topish uchun post search ishlatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- X'da user/akkaunt qidiruvi uchun alohida `x_user_search` tool bor.
- Keyword va semantic search faqat postlar uchun.
- Noto'g'ri tool = noto'g'ri yoki to'liq bo'lmagan natija.
