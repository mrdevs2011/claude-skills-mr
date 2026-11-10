---
name: agent-did-not-extract-commit-hash-with-git-rev-parse-after-push
description: Skill yaratib push qilgandan keyin hisobot uchun aniq commit hashni olishda git log o'rniga yoki qo'shimcha ravishda git rev-parse HEAD ishlatilmadi — natijada noto'g'ri yoki to'liq bo'lmagan hash hisobotga kiritildi.
---

# Pushdan keyin aniq commit hashni git rev-parse HEAD bilan olmaslik

## Nima uchun bu skill kerak
Agentlar yangi skill qo'shib push qilgandan so'ng oxirgi hisobotda commit hashni ko'rsatishi kerak. Ko'pincha `git log -1 --oneline` ishlatiladi, lekin bu qisqa hash yoki format o'zgarishi mumkin. `git rev-parse HEAD` har doim to'liq 40-belgili hashni beradi va ishonchliroq.

## Simptom (aynan shu)
- Push muvaffaqiyatli bo'ldi, lekin hisobotda hash yo'q yoki qisqa (7 belgi) hash berilgan.
- `git log` chiqishidan qo'lda hash kesib olingan.
- `git rev-parse HEAD` chaqirilmagan.
- Hisobotda "commit hash" deb yozilgan lekin to'liq emas yoki noto'g'ri.

## Sabab (100%)
Agent pushdan keyin `git log -1` yoki `git status` bilan kifoyalanib, to'liq hashni olishning eng ishonchli usuli bo'lgan `git rev-parse HEAD` ni e'tiborsiz qoldirdi. Qisqa hash ba'zan yetarli bo'lsa-da, to'liq hash aniqroq va kerakli formatga mos.

## Tasdiqlash
- `git push` muvaffaqiyatli tugadimi?
- Oxirgi commitning to'liq hashini olish uchun `git rev-parse HEAD` ishlatildimi?
- Hisobotda to'liq 40-belgili hash ko'rsatildimi?
- `git log -1 --format=%H` yoki `rev-parse` natijasi mos keladimi?

## Tuzatish (aynan shu)
Pushdan so'ng **darhol**:

```bash
cd /tmp/skills-repo
git rev-parse HEAD
```

Bu to'liq hashni chiqaradi. Uni hisobotga qo'y:

**Hisobot:**
- Skill nomi: ...
- O'qilgan qo'llanmalar: architecture.md, instruction.md, style.md
- Commit hash: <git rev-parse HEAD natijasi>
- Push: muvaffaqiyatli

Agar qisqa hash kerak bo'lsa: `git rev-parse --short HEAD`

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Pushdan keyin hisobot uchun commit hashni olishda `git rev-parse HEAD` eng ishonchli va to'liq usul. Uni doim ishlatib, to'liq hashni hisobotga kiritish kerak. Bu format xatolarini oldini oladi va aniq hisobot beradi.
