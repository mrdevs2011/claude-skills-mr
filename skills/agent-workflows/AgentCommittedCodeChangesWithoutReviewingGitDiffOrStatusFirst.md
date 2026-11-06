---
name: agent-committed-without-diff-review
description: When an agent stages and commits changes without first inspecting git status and git diff, risking unintended files, secrets, or incomplete changes in the commit.
---

# Agent Committed Changes Without Reviewing Diff or Status First

## Nima uchun bu skill kerak
Agentlar tez-tez "git add . && git commit" qilib yuboradi, lekin o'zgarishlarning mazmunini tekshirmaydi. Bu kutilmagan fayllar (token, .env, debug log), yarim tugallanmagan kod yoki noto'g'ri o'zgarishlar commit bo'lishiga olib keladi. Bitta aniq holat: commitdan oldin status va diff ko'rilmagan.

## Simptom (aynan shu)
- `git commit` muvaffaqiyatli o'tdi, lekin keyinroq "nima commit bo'ldi" degan savolga aniq javob yo'q.
- Commitda .env, token, temporary file, yoki so'ralmagan o'zgarishlar bor.
- `git log -1 --stat` yoki `git show` da kutilmagan fayllar ko'rinadi.
- Agent "commit qildim" deydi, lekin diffni ko'rmagan.

## Sabab (100%)
Agent workflowda "git add . && git commit -m ..." ni bitta qadam sifatida ko'radi va tekshirish bosqichini o'tkazib yuboradi. Diff va statusni o'qish "keraksiz" deb hisoblanadi, chunki "add . hammasi to'g'ri" deb taxmin qilinadi.

## Tasdiqlash
1. Commitdan oldin `git status` va `git diff --cached` (yoki `git diff`) chiqishini tool loglarida yoki agent javobida qidir.
2. Agar faqat `git add` va `git commit` bor, status/diff yo'q — bu holat.
3. `git show HEAD --stat` yoki `git log -1 --name-only` da kutilmagan fayllar bo'lsa — tasdiqlangan.

## Tuzatish (aynan shu)
Commitdan oldin har doim quyidagi ketma-ketlikni bajar:

```bash
git status
git diff
git diff --cached   # agar staged bo'lsa
# Kerak bo'lsa: git add <specific-files>   # "git add ." o'rniga aniq fayllar
git commit -m "..."
```

Agar `git status` da kutilmagan fayl (masalan `.env`, `*.log`, token) ko'rinsa — uni `.gitignore` ga qo'sh yoki `git restore` / `git rm --cached` qil. Faqat so'ralgan o'zgarishlarni stage qil.

Misol:

```bash
# Noto'g'ri:
git add . && git commit -m "update"

# To'g'ri:
git status
# Output ko'rib, faqat kerakli fayllarni:
git add skills/agent-workflows/NewSkill.md
git diff --cached
git commit -m "Add new skill: ... - ..."
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Commit qilishdan oldin `git status` va `git diff` (yoki `--cached`) ni albatta ko'rish kerak. Bu kutilmagan fayllar, sirlar yoki noto'g'ri o'zgarishlar commit bo'lishining oldini oladi. "add ." ni ko'r-ko'rona ishlatma — aniq fayllarni stage qil.
