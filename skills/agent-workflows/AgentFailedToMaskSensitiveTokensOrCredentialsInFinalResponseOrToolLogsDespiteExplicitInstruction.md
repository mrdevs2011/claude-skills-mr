---
name: agent-failed-to-mask-sensitive-tokens-or-credentials-in-final-response-or-tool-logs-despite-explicit-instruction
description: Agent maxfiy token, API kalit yoki credential ni final javob, hisobot yoki tool chiqish logida mask qilmasdan ko'rsatadi, garchi "hech qachon chiqarma" buyrug'i bo'lsa ham.
---

# Maxfiy token yoki credential ni final javobda mask qilmaslik

## Nima uchun bu skill kerak
Agentlar git clone, push yoki boshqa buyruqlarda token ishlatganda, yoki tool natijasida maxfiy ma'lumot chiqganda, uni final hisobot, xato xabari yoki javobda to'liq ko'rsatadi. Bu xavfsizlik buzilishi, token o'g'irlanishi xavfini tug'diradi. Foydalanuvchi "tokenni hech qachon chiqarishda yoki logda ko'rsatma" desa ham, agent e'tiborsiz qoldiradi.

## Simptom (aynan shu)
- Foydalanuvchi aniq ko'rsatma bergan: tokenni chiqarma, mask qil, logda ko'rsatma.
- Agent git clone yoki push buyrug'ida token ishlatgan.
- Final javob, hisobot yoki tool outputda to'liq token (masalan github_pat_...) ko'rinadi.
- Sed yoki boshqa mask qilish ishlatilmagan, yoki qisman ishlatilgan lekin to'liq yashirilmagan.

## Sabab (100%)
Agent maxfiy ma'lumotlarni chiqish matnidan avtomatik ravishda tozalashni unutadi yoki tool natijasini to'g'ridan-to'g'ri foydalanuvchiga uzatadi. Xavfsizlik ko'rsatmasini faqat o'qigan, lekin amalga oshirishni e'tiborsiz qoldirgan.

## Tasdiqlash
- Foydalanuvchi so'rovida "tokenni chiqarma", "logda ko'rsatma", "mask" kabi so'zlar bormi?
- Tool chiqishi yoki bash natijasida token borligini tekshirdingmi?
- Final javobda tokenning biror qismi ko'rinadimi?
- Clone/push buyrug'i tokenni o'z ichiga olganmi va u logga tushganmi?

## Tuzatish (aynan shu)
1. Token ishlatilgan har qanday buyruqdan oldin, chiqishni mask qilish rejasini tuz.
2. Bash buyrug'ida tokenni ishlatish shart bo'lsa, outputni sed yoki shunga o'xshash bilan filtrlash:
   ```bash
   git clone https://x-access-token:TOKEN@github.com/... 2>&1 | sed 's/github_pat_[^@]*@/github_pat_***@/g'
   ```
3. Final hisobot yoki javobda hech qachon tokenni, hatto qisman ham, yozma. "token mask qilindi" deb ayt, lekin qiymatni ko'rsatma.
4. Xato chiqsa ham, xato matnini to'liq ko'rsatishdan oldin maxfiy qismlarni olib tashla.
5. Hech qachon tool natijasini to'g'ridan-to'g'ri qaytarma — avval maxfiy ma'lumotlarni tekshir va tozala.

Misol:
- Noto'g'ri: clone muvaffaqiyatli, token github_pat_11CDW... ko'rindi.
- To'g'ri: clone muvaffaqiyatli bo'ldi. Token mask qilindi, chiqishda ko'rinmadi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Maxfiy token va credential larni hech qachon final javob, hisobot yoki logda ko'rsatma — hatto xato bo'lsa ham.
- Bash buyruqlarida outputni sed bilan avtomatik mask qil.
- Foydalanuvchi ko'rsatmasiga 100% amal qil: "chiqarma" degani chiqarma.
