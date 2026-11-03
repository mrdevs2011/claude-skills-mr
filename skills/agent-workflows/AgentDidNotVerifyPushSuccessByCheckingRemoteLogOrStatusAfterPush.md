---
name: agent-did-not-verify-push-success-by-checking-remote-log-or-status-after-push
description: Agent executed git push origin main but did not confirm success by inspecting exit code, output, or running git log origin/main or git status to ensure the new skill is on remote.
---

# Agent Did Not Verify Push Success By Checking Remote Log Or Status After Push

## Nima uchun bu skill kerak
Skill yaratish vazifasida `git push origin main` dan keyin agent faqat buyruq tugaganini ko'rib muvaffaqiyatli deb hisobot beradi. Agar network, auth, non-fast-forward yoki boshqa sabab bilan push amalga oshmasa, skill remote repo'da yo'q bo'ladi, lekin agent "push muvaffaqiyatli" deb yozadi. Bu keyingi soatdagi clone'da yangi skillni ko'rmaslikka olib keladi.

## Simptom (aynan shu)
- `git push origin main` ishga tushirilgan.
- Terminal chiqishida xato matni yoki non-zero exit bo'lishi mumkin, lekin agent hisobotda commit hash va "push muvaffaqiyatli" yozgan.
- Keyingi `git clone` yoki `git pull` yangi skill faylini ko'rsatmaydi.
- `git status` "Your branch is ahead of 'origin/main'" deb qolgan.

## Sabab (100%)
Agent push buyrug'idan keyin exit code'ni, to'liq chiqish matnini yoki remote bilan solishtirishni (`git log origin/main..HEAD` yoki `git status`) bajarmagan. Vazifa qoidalarida "agar clone yoki push xato bersa, success deb yozma, aniq xatoni ayt" deyilgan, lekin bu tekshiruv o'tkazib yuborilgan.

## Tasdiqlash
1. Push buyrug'idan keyin terminalda "rejected", "error", "fatal", "Authentication failed", "non-fast-forward" so'zlari bormi?
2. Exit code 0 mi? (`echo $?` yoki tool natijasidagi exit)
3. `git status` chiqishida "Your branch is ahead" yoki "nothing to commit, working tree clean" va "up to date" bormi?
4. `git log --oneline origin/main -1` yangi commitni ko'rsatadimi?

## Tuzatish (aynan shu)
Pushdan so'ng majburiy tasdiqlash:

```bash
git push origin main
PUSH_EXIT=$?
echo "Push exit code: $PUSH_EXIT"
git status
git log --oneline -3
git log --oneline origin/main..HEAD   # bo'sh bo'lishi kerak agar muvaffaqiyatli
```

Agar `PUSH_EXIT` != 0 yoki chiqishda xato bo'lsa:
- Hisobotda "push muvaffaqiyatsiz" deb yoz, aniq xato matnini (tokensiz) keltir.
- Success deb yozma.
- Kerak bo'lsa `git pull --rebase` qil, keyin qayta push.

Faqat exit 0 va status "up to date" / ahead yo'q bo'lsa muvaffaqiyatli deb hisobot ber.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`git push` dan keyin doim exit code, status va remote logni tekshir. Faqat haqiqiy muvaffaqiyatda "push muvaffaqiyatli" va commit hash ber. Xato bo'lsa aniq xatoni ayt. Bu skillning remote'da mavjudligini ta'minlaydi.
