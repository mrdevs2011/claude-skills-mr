---
name: agent-did-not-verify-push-success-by-checking-remote-after-push
description: Agent git push qiladi lekin remote'da commit haqiqatan tushganini tekshirmaydi (git log origin/main yoki ls-remote bilan), natijada silent failure yoki rejection holatida muvaffaqiyat deb xato xabar beradi.
---

# Agent push qilgandan keyin remote'da commit borligini tekshirmadi

## Nima uchun bu skill kerak
Git push ba'zan authentication, non-fast-forward, protected branch yoki network xatosi tufayli rad etiladi, lekin agent faqat lokal commit hash'ni ko'rib "push muvaffaqiyatli" deb hisobot beradi. Bu foydalanuvchini chalg'itadi va skill repo'siga tushmagan bo'ladi.

## Simptom (aynan shu)
- `git push origin main` chaqirilgan.
- Exit code 0 bo'lsa ham yoki output "Everything up-to-date" yoki rejection bo'lsa ham agent to'liq output'ni o'qimaydi.
- Hisobotda "push muvaffaqiyatli" yoziladi, lekin remote'da yangi commit yo'q.
- Keyingi clone yoki GitHub'da o'zgarish ko'rinmaydi.

## Sabab (100%)
Agent push buyrug'ining chiqishini to'liq tahlil qilmaydi va remote holatini qayta tekshirmaydi. Lokal git status yoki commit hash'ni remote bilan solishtirmaydi.

## Tasdiqlash
1. Push chaqiruvi bajarilganmi?
2. Push output'ida "rejected", "error", "failed" yoki "Everything up-to-date" (agar yangi commit bo'lsa) bor-yo'qligi tekshirilganmi?
3. Pushdan keyin `git ls-remote origin main` yoki `git log origin/main -1` bilan remote hash lokal hash bilan solishtirilganmi?
4. Agar mos kelmasa — bu holat.

## Tuzatish (aynan shu)
Pushdan so'ng doim tekshir:

```bash
git push origin main
# output'ni to'liq o'qi

# Keyin remote'ni tasdiqla
git fetch origin
git log origin/main -1 --oneline
# yoki
git rev-parse HEAD origin/main
```

Agar hash'lar mos kelmasa, xatoni aniq ayt, "muvaffaqiyatli" deb yozma. Exit code va to'liq stderr/stdout'ni hisobotga kirit.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Push qilgandan keyin hech qachon taxmin qilma. Remote hash'ni lokal bilan solishtirib, haqiqiy muvaffaqiyatni tasdiqla. Aks holda foydalanuvchi skill qo'shilmaganini bilmay qoladi.
