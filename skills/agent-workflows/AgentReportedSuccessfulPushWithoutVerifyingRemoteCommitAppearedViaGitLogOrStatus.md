---
name: reported-push-success-without-verifying-remote
description: git push dan keyin remote'da commit ko'rinishini tekshirmasdan "push muvaffaqiyatli" deb hisobot berish — aslida push xato bo'lgan yoki remote yangilanmagan holatlarda noto'g'ri xabar.
---

# Pushdan keyin remote tekshirmasdan muvaffaqiyatli deb hisobot berish

## Nima uchun bu skill kerak
Agentlar `git push origin main` buyrug'ini ishga tushirib, exit code 0 deb o'ylab, darhol "push muvaffaqiyatli" deb hisobot beradi. Ammo tarmoq muammosi, auth, non-fast-forward yoki boshqa sabablar bilan push amalga oshmagan bo'lishi mumkin. Remote'da yangi commit ko'rinishini tasdiqlamasdan xabar berish foydalanuvchini chalg'itadi va keyingi ishlarni buzadi.

## Simptom (aynan shu)
- `git push` chaqirilgan va agent "push muvaffaqiyatli" yoki "commit hash ... pushed" deb yozgan.
- Remote (GitHub) da yangi commit yo'q yoki eski holatda qolgan.
- Hisobotda commit hash bor, lekin `git log origin/main` yoki remote tekshiruvi qilinmagan.
- Keyin foydalanuvchi yoki keyingi run "o'zgarishlar yo'q" deb topadi.

## Sabab (100%)
Agent tool chiqishini (exit code va stdout) to'liq o'qimasdan yoki remote holatini tekshirmasdan, "buyruq ishga tushdi" degani "muvaffaqiyatli" degani deb taxmin qiladi. instruction.md dagi "Xato bo'lsa... chiqish matnini o'qi" va "AssumedToolCallSucceededWithoutChecking..." qoidalariga zid.

## Tasdiqlash
- Pushdan keyin `git status` yoki `git log origin/main -1` ishlatilganmi?
- Remote commit hash lokal bilan mos keladimi?
- Tool output'da "rejected", "error", "fatal" yoki non-zero exit bormi?
- Hisobotda faqat lokal commit hash emas, remote tasdiq bor mi?

## Tuzatish (aynan shu)
Pushdan **keyin majburiy tekshir**:

1. `git push origin main` ni chaqir.
2. Chiqish matnini to'liq o'qi: "Everything up-to-date", "rejected", xato yo'qmi?
3. Darhol tekshir:
   ```bash
   git fetch origin
   git log origin/main -1 --oneline
   git status
   ```
4. Remote'dagi oxirgi commit lokal yangi commit bilan mos kelishini tasdiqla.
5. Faqat shundan keyin hisobotda "push muvaffaqiyatli, commit hash: ..." deb yoz. Agar mos kelmasa — xatoni aniq ayt, success dema.

Misol to'g'ri ketma-ketlik:
```bash
git push origin main
# output ni o'qi
git log origin/main -1
# hash mos kelganini ko'r
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Push buyrug'i ishga tushishi — remote yangilangan degani emas.
- Har doim pushdan keyin remote holatini (`git log origin/main` yoki status) tekshir.
- Hisobotda faqat tasdiqlangan muvaffaqiyatni yoz — taxmin emas.
