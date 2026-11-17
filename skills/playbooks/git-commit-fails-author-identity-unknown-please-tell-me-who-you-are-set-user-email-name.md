---
name: git-commit-fails-author-identity-unknown-please-tell-me-who-you-are-set-user-email-name
description: git commit "Author identity unknown" / "*** Please tell me who you are." / "fatal: unable to auto-detect email address". Set user.name and user.email (local preferred).
id: git-commit-fails-author-identity-unknown-please-tell-me-who-you-are-set-user-email-name
type: playbook
stack: git 2.39.5 (Linux sandbox)
confirmed_on: 2026-11-17
confidence: high (reproduced in sandbox + official docs)
triggers:
  - Author identity unknown
  - Please tell me who you are
  - fatal: unable to auto-detect email address
  - git commit no email configured
  - Please tell me who you are. Run git config
  - unable to auto-detect email address (got 'root@
  - git config user.email not set
  - commit fails identity unknown
  - set git user.name user.email
  - git commit fatal no name or email
related:
  - git-push-rejected-remote-contains-work-you-do-not-have-locally-pull-rebase-then-push
---

# git commit Author identity unknown — user.name va user.email ni o'rnat

## TL;DR
Simptom: `git commit` "Author identity unknown" / "*** Please tell me who you are." / "fatal: unable to auto-detect email address" chiqaradi.
Sabab: `user.name` va/yoki `user.email` sozlanmagan (local yoki global).
Birinchi buyruq: `git config user.email "you@example.com"; git config user.name "Your Name"`
Done: `git commit` muvaffaqiyatli, `git log -1` author to'g'ri.

## Qachon ishlatish / ishlatmaslik
Ishlat: yangi clone, yangi repo, sandbox/CI, `git commit` identity xatosi bersa.
Ishlatma: identity allaqachon to'g'ri, xato boshqa (hook, empty commit, permission, remote reject). Yoki faqat `git status` qilayotgan bo'lsang.

## Mental model (nima uchun)
[SRC:https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup @ 2026-11] Har commit author/committer sifatida `user.name` + `user.email` ni ishlatadi. Ular system → global (~/.gitconfig) → local (.git/config) tartibida o'qiladi. Hech biri yo'q bo'lsa Git auto-detect qilishga urinadi va muvaffaqiyatsiz bo'lsa xato beradi. [SANDBOX] Local sozlash globalni override qiladi va boshqa repolarga ta'sir qilmaydi.

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "Author identity unknown" yoki "Please tell me who you are" yoki "unable to auto-detect email address" bormi?
   EXPECTED: ha. Agar boshqa xato (e.g. "nothing to commit", "rejected") → boshqa skill.

2. Hozirgi configni tekshir:
   ```bash
   git config user.email || echo "email yo'q"
   git config user.name || echo "name yo'q"
   git config --show-origin --get user.email
   ```
   EXPECTED: bo'sh yoki "yo'q". Agar qiymat bor — boshqa muammo (masalan useConfigOnly). [SANDBOX]

3. Scope'ni aniqlash (ixtiyoriy):
   ```bash
   git config --list --show-origin | grep -E 'user\.(name|email)'
   ```
   EXPECTED: hech narsa yoki faqat system. Local yo'q.

4. Agar xato "no email was given and auto-detection is disabled" — `user.useConfigOnly=true` bo'lishi mumkin. `git config --get user.useConfigOnly`.

## Fix har bir sabab uchun
Sabab 1: local identity yo'q (eng keng tarqalgan).
Fix (local, tavsiya etiladi):
```bash
git config user.email "automation@local"
git config user.name "Skill Generator"
```
Tekshir:
```bash
git config user.email
git config user.name
git commit --allow-empty -m "identity test" && echo OK
```
EXPECTED: email/name chiqadi, commit muvaffaqiyatli. [SANDBOX]

Sabab 2: global sozlash kerak (barcha repolar uchun).
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```
(Local hali ham override qiladi.)

Sabab 3: faqat shu commit uchun (config o'zgartirmasdan):
```bash
git -c user.email="you@example.com" -c user.name="Your Name" commit -m "msg"
```

## Agentlar qayerda xato qiladi
1. `--global` ni doim ishlatadi — sandbox/shared muhitda boshqa userlarga ta'sir qiladi yoki permission xato.
2. Faqat `user.email` ni o'rnatadi, `user.name` ni unutadi (yoki aksincha).
3. Config o'rnatgach `git commit` ni qayta ishga tushirmaydi yoki boshqa terminalda.
4. `GIT_AUTHOR_EMAIL` env ni o'ylaydi, lekin u doim ishlamaydi agar config yo'q.
5. Xato matnini o'qimasdan "git init" yoki "remote add" qiladi.

## Edge cases
1. `user.useConfigOnly=true` globalda — auto-detect o'chadi, aniq config talab qilinadi. [SRC:git-config docs]
2. Local va global ikkalasi ham bor — local g'alaba qiladi. `git config --show-origin` bilan tekshir.
3. Empty commit yoki `--allow-empty` kerak bo'lishi mumkin test uchun.
4. Windows/macOS da path farq qilishi mumkin, lekin buyruq bir xil. [not verified]

## Done criteria
```bash
git config user.email >/dev/null && git config user.name >/dev/null && \
git commit --allow-empty -m "done criteria test" && \
git log -1 --format='%an <%ae>' | grep -q . && echo "OK"
```
Exit 0 va "OK". Author maydoni bo'sh emas.

## Agar hali ham ishlamasa
- `git config --list --show-origin` to'liq chiqar.
- `git var GIT_AUTHOR_IDENT` (identity unknown qaytarishi mumkin).
- Hook (`pre-commit`) bormi? `ls .git/hooks/`.
- Docs: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup

## Sources + confidence
- [SRC:https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup @ 2026-11] Identity sozlash majburiy.
- [SRC:https://git-scm.com/docs/git-config @ 2.39 docs] user.name, user.email, scopes, useConfigOnly.
- [SANDBOX] 2026-11-17: yangi repo `git commit` → "Author identity unknown" / "unable to auto-detect email address"; config set → commit muvaffaqiyatli.
- Confidence: 95% (official + measured repro).
