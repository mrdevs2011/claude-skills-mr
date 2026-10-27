---
name: agent-assumed-git-push-succeeded-without-inspecting-exit-code-and-output
description: Agent ran git push but reported success without checking exit code and full output for remote rejection, non-fast-forward, auth failure, or other errors.
---

# Agent Assumed Git Push Succeeded Without Inspecting Exit Code And Output For Rejection Or Non-Fast-Forward

## Nima uchun bu skill kerak
Skill generator yoki agent `/tmp/skills-repo` ga commit qilgandan keyin `git push origin main` bajaradi. Agar push xato bersa (auth, non-fast-forward, protected branch, network), lekin agent faqat buyruqni ishga tushirganini ko'rib "muvaffaqiyatli" deb hisobot bersa, skill remote'da yo'q bo'ladi va keyingi ishlar buziladi.

## Simptom (aynan shu)
- `git push origin main` buyrug'i ishga tushirilgan.
- Chiqishda "rejected", "failed to push", "non-fast-forward", "Authentication failed", "remote: error", yoki exit code != 0 mavjud.
- Agent hisobotda "push muvaffaqiyatli" yoki "success" deb yozgan, commit hash bergan, lekin remote'da yangilanish yo'q.
- Keyingi clone yangi skillni ko'rsatmaydi.

## Sabab (100%)
Agent push buyrug'ining exit code'ini va to'liq stdout/stderr ni tekshirmagan. Faqat "buyruq tugadi" deb taxmin qilgan. instruction.md va vazifa qoidalarida "agar clone yoki push xato bersa, success deb yozma, aniq xatoni ayt" deyilgan, lekin bu tekshiruv o'tkazib yuborilgan.

## Tasdiqlash
- Push buyrug'idan keyin terminal chiqishida "Everything up-to-date", "rejected", "error", "fatal" kabi so'zlar bormi?
- Exit code 0 mi? Agar yo'q bo'lsa — muvaffaqiyatsiz.
- `git status` yoki `git log origin/main..HEAD` da push qilinmagan commitlar qolganmi?
- Remote URL va token to'g'ri ekanligi tekshirilganmi (lekin token chiqarilmasin)?

## Tuzatish (aynan shu)
Pushdan keyin majburiy tekshiruv:

```bash
git push origin main
echo "EXIT_CODE=$?"
# Chiqishni to'liq o'qi: "rejected", "failed", "error", "Authentication" qidiring
git status
git log --oneline -1
```

Agar exit code != 0 yoki chiqishda xato matni bo'lsa:
- Hisobotda "push muvaffaqiyatsiz" deb yoz.
- Aniq xato matnini (tokenlarsiz) keltir.
- Success deb yozma.
- Kerak bo'lsa `git pull --rebase origin main` yoki boshqa tuzatish qil, keyin qayta push.

Tokenni hech qachon echo, cat, yoki logga chiqarma. Faqat buyruqda ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`git push` dan keyin doim exit code va to'liq chiqishni tekshir. Faqat 0 exit va "success"/"up-to-date" matni bo'lsa muvaffaqiyatli deb hisobot ber. Xato bo'lsa aniq xatoni ayt, success deb yozma. Bu skill remote'da haqiqatan mavjud bo'lishini ta'minlaydi.
