---
name: agent-claimed-success-on-git-failure-without-exact-error
description: Git clone yoki push xato bilan tugadi, lekin agent "muvaffaqiyatli" deb hisobot berdi va aniq xato matnini (exit code + stdout/stderr) ko'rsatmadi.
---

# Agent git xatosini yashirib success deb yozdi

## Nima uchun bu skill kerak
Foydalanuvchi "agar clone yoki push xato bersa, success deb yozma, aniq xatoni ayt" deb buyuradi. Agent tool chiqishini to'liq o'qimay, yoki xatoni umumiy qilib "xato bo'ldi" deb, yoki hatto muvaffaqiyatli deb hisobot qiladi. Bu keyingi qadamlarni noto'g'ri qilishga olib keladi.

## Simptom (aynan shu)
- `git clone` yoki `git push` non-zero exit code bilan tugagan.
- Chiqishda "fatal:", "rejected", "Permission denied", "non-fast-forward", authentication xatosi yoki boshqa aniq xabar bor.
- Agent javobida "push muvaffaqiyatli", "repo yangilandi" yoki shunga o'xshash ijobiy hisobot yozilgan.
- Aniq xato matni, exit code yoki to'liq tool output hisobotda yo'q.

## Sabab (100%)
Agent tool natijasini (exit code + to'liq stdout/stderr) tekshirmagan yoki faqat qisman o'qigan. "Buyruq ishga tushdi" degani muvaffaqiyat degani emas. Non-zero exit yoki xato kalit so'zlarini e'tiborsiz qoldirgan.

## Tasdiqlash
1. Oxirgi `git clone` yoki `git push` tool chaqiruvining to'liq natijasini och.
2. Exit code 0 emasmi?
3. Chiqish matnida "fatal", "error", "rejected", "denied" yoki boshqa xato so'zlari bormi?
4. Agentning foydalanuvchiga bergan hisobotida shu aniq matn bor-yo'qligini solishtir.
5. Agar xato bor-u, hisobotda success yoki noaniq xabar bo'lsa — bu skill.

## Tuzatish (aynan shu)
Har doim git operatsiyasidan keyin exit code va to'liq chiqishni tekshir. Xato bo'lsa, hech qachon success deb yozma. Aniq xatoni qisqa va to'g'ridan-to'g'ri ayt:

```bash
# Misoldagi noto'g'ri:
# "Push qilindi."

# To'g'ri hisobot (xato holatda):
# Clone/push xato bilan tugadi.
# Exit code: 1
# Xato: fatal: Authentication failed for 'https://github.com/...'
# (to'liq tool outputdan olingan qisqa parcha)
```

Qoida: tool chiqishini o'qib, non-zero yoki xato so'zlarini ko'rsang, darhol aniq xabarni hisobotga qo'y. Token yoki secretni hech qachon chiqarma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Git buyrug'i ishga tushgani muvaffaqiyat emas — exit code va chiqish matnini tekshir.
- Xato bo'lsa, success deb yozma, aniq xato matnini (exit + xabar) hisobotga qo'sh.
- Foydalanuvchi "aniq xatoni ayt" degan bo'lsa, shuni bajaring.
