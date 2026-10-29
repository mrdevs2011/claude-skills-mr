---
name: agent-included-raw-token-in-response
description: Agent foydalanuvchi xabarida yoki tool natijasida kelgan GitHub PAT, API key yoki boshqa maxfiy tokenni javob, hisobot yoki logda ochiq ko'rsatdi — xavfsizlik buzilishi.
---

# Agent maxfiy tokenni javobda ochiq ko'rsatdi

## Nima uchun bu skill kerak
Foydalanuvchi ba'zan clone URL ichida yoki so'rovda token beradi. Uni hech qachon chiqarish, loglash yoki hisobotda qaytarish mumkin emas. Bu credential leak va xavfsizlik xatosi.

## Simptom (aynan shu)
- Javobda yoki yakuniy hisobotda `github_pat_...` yoki boshqa token matni ochiq ko'rinadi.
- Tool chaqiruv logida yoki echo/print orqali token chiqadi.
- "Tokenni hech qachon chiqarishda yoki logda ko'rsatma" degan ko'rsatma buzilgan.
- Git clone URL to'liq token bilan javobda qaytarilgan.

## Sabab (100%)
Agent tokenni oddiy matn sifatida ko'rib, uni hisobot yoki debug uchun qaytarishni xavfsiz deb o'yladi. Yoki tool outputni tozalamasdan foydalanuvchiga uzatdi. Xavfsizlik qoidasi e'tibordan chetda qoldi.

## Tasdiqlash
1. Foydalanuvchi xabarida yoki so'rovda token bormi?
2. Javob, commit message, hisobot yoki tool natijasida token ochiq ko'rinadimi?
3. Agar ha — bu holat. Tokenni hech qachon chiqarish kerak emas.

## Tuzatish (aynan shu)
Tokenni hech qachon javob, log, hisobot yoki faylga yozma. Clone qilishda URL ichida ishlat, lekin chiqishda mask qil yoki umuman ko'rsatma.

Noto'g'ri:
```
Clone qilindi: https://x-access-token:github_pat_11CDW...@github.com/...
Push muvaffaqiyatli, token ishlatildi.
```

To'g'ri:
```
Repo clone qilindi.
Commit hash: abc1234
Push muvaffaqiyatli.
(Token hech qayerda ko'rsatilmadi)
```

Agar tool outputda token chiqsa, uni filter qilib, faqat kerakli qismini ol.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Maxfiy tokenlar (PAT, API key) hech qachon javob, log yoki hisobotda ochiq ko'rsatilmasligi kerak. Ularni faqat kerakli joyda (masalan git clone URL) ishlatib, keyin darhol yashirish yoki umuman chiqarmaslik lozim.
