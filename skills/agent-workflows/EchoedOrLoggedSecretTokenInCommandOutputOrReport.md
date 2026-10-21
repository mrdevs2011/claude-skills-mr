---
name: echoed-or-logged-secret-token-in-output
description: Git clone, push yoki boshqa buyruqda token/API kalitni ochiq yozib, uni bash output, log yoki hisobotda chiqarib yuborish — maxfiy ma'lumot oshkor bo'ladi.
---

# Buyruq yoki logda maxfiy token/API kalitni ochiq chiqarib yuborish

## Nima uchun bu skill kerak
Agentlar git clone, push, curl yoki boshqa buyruqlarni token bilan ishlatganda, buyruq matnini yoki uning chiqishini to'g'ridan-to'g'ri logga, hisobotga yoki foydalanuvchiga chiqarib yuboradi. Natijada token oshkor bo'ladi, xavfsizlik buziladi, keyinchalik revoke qilish kerak bo'ladi.

## Simptom (aynan shu)
- `git clone https://x-access-token:github_pat_...@github.com/...` kabi buyruq logda yoki tool javobida to'liq ko'rinadi.
- Token bash command argumentida yoki echo/cat orqali chiqariladi.
- Hisobotda yoki commit xabarida token qoldiriladi.
- .env yoki secret fayl contenti to'g'ridan-to'g'ri ko'rsatiladi.

## Sabab (100%)
Agent buyruqni "ishlashi uchun" to'liq yozadi va outputni filtrlashni unutadi yoki "logda ko'rsatma" degan qoidani e'tiborsiz qoldiradi. Tokenni mask qilish (*** yoki sed) qadamini qo'shmaydi.

## Tasdiqlash
- Tool output yoki bash natijasida `github_pat_`, `sk-`, `AKIA`, `Bearer ` yoki shunga o'xshash token prefikslari bormi?
- Clone/push URL da token ochiq yozilganmi?
- Foydalanuvchiga yuborilgan javobda yoki commit message da secret bormi?

## Tuzatish (aynan shu)
Har doim tokenni mask qil va outputni tozalа:

1. Buyruqni yozishda tokenni o'zgaruvchida saqla yoki to'g'ridan-to'g'ri yozma.
2. Outputni chiqarishdan oldin filter qil:

```bash
# Noto'g'ri: to'g'ridan-to'g'ri
git clone https://x-access-token:REAL_TOKEN@github.com/org/repo.git

# To'g'ri: mask qilingan output
git clone "https://x-access-token:${TOKEN}@github.com/org/repo.git" 2>&1 | sed 's/github_pat_[^@]*@/github_pat_***@/g'
```

3. Hisobotda hech qachon tokenni yozma. Faqat "clone muvaffaqiyatli" yoki "push xato: [xato matni, tokensiz]".
4. .env ni commit qilma (gitignore da bo'lsin).

Agar token logga tushgan bo'lsa — darhol foydalanuvchiga ayt, revoke qilishni tavsiya qil, keyingi ishda mask ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Token yoki secret hech qachon buyruq logida, tool outputida yoki hisobotda ochiq chiqmasligi kerak.
- Har doim sed/mask yoki o'zgaruvchi orqali yashir.
- Bu oddiy qoida maxfiy ma'lumot oshkor bo'lishining oldini oladi.
