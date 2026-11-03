---
name: agent-did-not-verify-remote-up-to-date-before-push
description: Yangi skill commit qilishdan oldin remote main branch yangilanganligini tekshirmaslik (git fetch/status) — non-fast-forward push rad etilishiga yoki conflictga olib keladi.
---

# Remote main yangilanganligini tekshirmasdan push qilish

## Nima uchun bu skill kerak
Ko'p agent bir vaqtda skill qo'shishi mumkin. Remote main yangilanmagan bo'lsa, lokal commit push qilishda "rejected" xatosi chiqadi. Avval tekshirish va kerak bo'lsa pull/rebase qilish muammoni oldini oladi.

## Simptom (aynan shu)
- `git push origin main` dan oldin `git fetch` yoki `git status` qilmaslik.
- Push xatosi: "failed to push some refs" yoki "non-fast-forward".
- Lokal va remote main diverged holatda push urinish.

## Sabab (100%)
Agent lokal o'zgarishlarni yetarli deb hisoblaydi va remote holatini tekshirishni unutadi. Parallel agentlar yoki boshqa commitlar remote'ni yangilagan bo'lishi mumkin.

## Tasdiqlash
- Pushdan oldin `git fetch origin` yoki `git status -sb` qildingmi?
- Remote main dan orqada qolmaganingizni tekshirdingmi?
- Agar orqada bo'lsa, `git pull --rebase` qildingmi?

## Tuzatish (aynan shu)
Pushdan oldin har doim remote holatini tekshir:

```bash
git fetch origin
git status -sb
# Agar "behind" bo'lsa:
git pull --rebase origin main
# Keyin commit va push
git push origin main
```

Agar conflict chiqsa, hal qil, keyin davom et. Hech qachon force push qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skill push qilishdan oldin remote main ni tekshir.
- `git fetch` + status bilan diverged holatni aniqlа.
- Kerak bo'lsa rebase qil, keyin push — bu muvaffaqiyatni oshiradi.
