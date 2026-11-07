---
name: agent-did-not-mask-github-token-in-outputs
description: Agent GitHub personal access tokenni git clone yoki push buyruqlarida ishlatganda, uni tool output, log yoki final hisobotda ochiq qoldirdi, maxfiy ma'lumotni oshkor qildi.
---

# Agent GitHub tokenni mask qilmadi

## Nima uchun bu skill kerak
Tokenlar maxfiy. Ular log, process list yoki javobda ko'rinsa, xavfsizlik buziladi. Ko'rsatmalar tokenni hech qachon chiqarmaslikni talab qiladi.

## Simptom (aynan shu)
Clone yoki push buyrug'i bajarilganda tool natijasida to'liq URL token bilan ko'rsatildi. Yoki final hisobotda token qisman yoki to'liq paydo bo'ldi.

## Sabab (100%)
Agent tokenni URL da ishlatdi va tool outputini to'liq ko'rsatdi yoki log qildi, masklash yoki chiqarishni oldini olish choralarini ko'rmadi.

## Tasdiqlash
Tool outputida token qismi (github_pat_...) ko'rinishini tekshiring. Final javobda token haqida so'z bor-yo'qligini qarang. Buyruq tarixida token qolganini tekshiring.

## Tuzatish (aynan shu)
Tokenni hech qachon outputga chiqarmang. Buyruqni ishga tushiring, lekin natijani qisqartiring yoki tokenni yashiring. Final hisobotda token haqida gapirmang.

Misol: clone muvaffaqiyatli bo'lsa, faqat "Cloning into '/tmp/skills-repo'... " kabi xavfsiz qismni aytib, to'liq URL ni ko'rsatmang.

Agar xato bo'lsa, xato matnini tokenni olib tashlab ayting.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
GitHub tokenni hech qanday output, log yoki hisobotda ochiq qoldirmaslik shart. Buyruqni ishga tushirish mumkin, lekin natijani masklab yoki qisqartirib bering.
