---
name: agent-failed-to-extract-commit-hash-after-push
description: Skill yaratib push qilgandan keyin hisobotda commit hash ko'rsatilmagan yoki noto'g'ri (faqat "success" yozilgan), chunki git rev-parse HEAD yoki git log -1 --oneline chaqirilmagan.
---

# Pushdan keyin aniq commit hashni olish unutilgan

## Nima uchun bu skill kerak
Har soatlik skill generator vazifasida oxirida hisobotda commit hash majburiy. Agent push muvaffaqiyatli bo'lganini ko'rib, lekin hashni chiqarmay "success" deb yozadi. Bu audit va tekshirishni qiyinlashtiradi.

## Simptom (aynan shu)
- Final hisobotda skill nomi va "push muvaffaqiyatli" bor, lekin 40-belgili yoki qisqa commit hash yo'q.
- Yoki hash "unknown" / "see above" deb yozilgan.
- git push chiqishida "main -> main" ko'rinadi, lekin agent uni o'qib hash ajratmagan.

## Sabab (100%)
Pushdan keyin `git rev-parse HEAD` yoki `git log -1 --format=%H` chaqirilmagan. Agent faqat push exit code 0 ekanini tekshirgan, lekin hashni alohida olmagan.

## Tasdiqlash
1. Push buyrug'idan keyin terminal outputda `git rev-parse HEAD` yoki `git log -1` bor-yo'qligini qara.
2. Agar yo'q bo'lsa — bu skill.
3. Hisobot matnida `[0-9a-f]{7,40}` pattern hash bor-yo'qligini tekshir.

## Tuzatish (aynan shu)
Pushdan darhol keyin hashni ol:

```bash
git push origin main
COMMIT_HASH=$(git rev-parse HEAD)
echo "Commit hash: $COMMIT_HASH"
# Hisobotda aynan shu qiymatni ishlat
```

Yoki:

```bash
git log -1 --oneline
```

Hisobotda: "commit hash: abc1234..." deb aniq yoz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Push muvaffaqiyatli bo'lishi yetarli emas — hisobot uchun aniq hash kerak.
- `git rev-parse HEAD` eng ishonchli usul.
- Har safar skill qo'shishda hashni alohida chiqarib hisobotga qo'y.
