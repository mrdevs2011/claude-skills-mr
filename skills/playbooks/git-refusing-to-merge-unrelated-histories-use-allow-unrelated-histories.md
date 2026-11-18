---
id: git-refusing-to-merge-unrelated-histories-use-allow-unrelated-histories
type: playbook
stack: git 2.39.5 (Linux sandbox)
confirmed_on: 2026-11-18
confidence: high (reproduced in sandbox + official docs)
triggers:
  - fatal: refusing to merge unrelated histories
  - git pull refusing to merge unrelated histories
  - refusing to merge unrelated histories
  - git merge unrelated histories error
  - cannot merge two repos no common ancestor
  - git pull --allow-unrelated-histories
  - unrelated histories when adding remote
  - init local then pull existing remote fails
  - fatal refusing to merge unrelated
  - git histories do not share common ancestor
related:
  - git-push-rejected-remote-contains-work-you-do-not-have-locally-pull-rebase-then-push
  - git-commit-fails-author-identity-unknown-please-tell-me-who-you-are-set-user-email-name
  - git-rebase-or-merge-conflict-markers-left-resolve-with-edit-add-continue-not-manual-commit
---

# git "fatal: refusing to merge unrelated histories" — --allow-unrelated-histories ishlat

## TL;DR
Simptom: `git pull` yoki `git merge` chiqaradi `fatal: refusing to merge unrelated histories`.
Sabab: ikki tarixda umumiy ancestor yo'q (odatda local `git init` + commit, keyin mavjud remote'ni pull).
Birinchi buyruq: `git pull origin main --allow-unrelated-histories` (yoki master).
Done: merge commit yaratiladi, `git log --oneline` ikkala tarixni ko'rsatadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: local repo'ni (init + commit qilingan) mavjud remote (masalan README bilan) ga ulashda, yoki ikki mustaqil loyihani birlashtirishda.
Ishlatma: oddiy divergent branch'larda (u yerda rebase/pull yetarli). Yoki noto'g'ri remote URL bo'lsa — avval tekshir. Force push qilish o'rniga emas.

## Mental model (nima uchun)
[SRC:https://git-scm.com/docs/git-merge @ 2.39, 2026-11] Git 2.9 dan boshlab default ravishda umumiy ancestor yo'q bo'lgan tarixlarni merge qilishni rad etadi. Bu parallel history'ni tasodifan qo'shishni oldini oladi. `--allow-unrelated-histories` bu xavfsizlikni o'chiradi va merge commit yaratadi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini tekshir: `git pull origin main 2>&1 | head -5`  
   EXPECTED: `fatal: refusing to merge unrelated histories`. Agar boshqa xato (non-fast-forward, conflict) → boshqa skill.  
   Agar shu xato → 2-ga o't.

2. Remote va branch'ni tekshir: `git remote -v; git branch -a; git log --oneline -3`  
   EXPECTED: remote to'g'ri, localda commit bor, remoteda ham. Agar remote noto'g'ri → URL'ni to'g'rila, qayta urin.  
   Agar to'g'ri → 3-ga o't.

3. Umumiy ancestor yo'qligini tasdiqla: `git merge-base HEAD origin/main || echo "no common ancestor"`  
   EXPECTED: "no common ancestor" yoki bo'sh. Agar bor → boshqa muammo.  
   [SANDBOX: haqiqiy chiqish "fatal: refusing..."]

4. Allow flag bilan sinab ko'r: `git pull origin main --allow-unrelated-histories`  
   EXPECTED: Merge made by the 'ort' strategy. yoki conflict bo'lsa markerlar.  

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): local init + remote'da alohida history.  
Fix:  
```bash
git pull origin main --allow-unrelated-histories
# yoki
git fetch origin
git merge origin/main --allow-unrelated-histories -m "merge unrelated histories"
```
Tekshir: `git log --oneline --graph | head -10` ikkala root'ni ko'rsatadi.

Agar conflict bo'lsa: markerlarni olib tashla, `git add`, `git commit` (rebase --continue emas, chunki merge).

## Agentlar qayerda xato qiladi
1. `--allow-unrelated-histories` o'rniga `git push --force` qilish — remote'dagi ishni yo'qotadi.
2. Xatoni "remote not found" yoki auth deb o'ylab, URL'ni o'zgartiradi.
3. `git rebase` bilan urinadi, lekin unrelated'da rebase ham ishlamaydi yoki murakkab.
4. Faqat `git pull` ni qayta ishga tushiradi, flag qo'shmaydi.

## Edge cases
1. Branch nomi main vs master — `git branch -r` bilan tekshir. [SANDBOX]
2. Conflict chiqsa, oddiy merge conflict kabi hal qil (markers). [SANDBOX]
3. Submodule yoki sparse-checkout da boshqacha bo'lishi mumkin. [GUESS]
4. Windows/macOS da bir xil. [not verified]

## Done criteria
```bash
# Merge muvaffaqiyatli
git log --oneline --graph | head -5
# Ikkala tarix ko'rinishi kerak, merge commit bor
git status
# clean working tree
```
Agar `fatal: refusing...` qaytmasa va log'da ikkala root bo'lsa — done.

## Agar hali ham ishlamasa
- Remote URL'ni `git remote -v` bilan qayta tekshir.
- `git fetch` alohida, keyin merge.
- Agar "Please tell me who you are" chiqsa — user.name/email sozla (boshqa skill).
- Boshqa agentga muammoni aniq xato matni bilan tushuntir.

## Sources + confidence
- [SRC:https://git-scm.com/docs/git-merge] --allow-unrelated-histories section, git 2.39 docs.
- [SANDBOX] git 2.39.5 da repro: local init + remote pull → fatal: refusing to merge unrelated histories; --allow-unrelated-histories bilan merge muvaffaqiyatli.
- Confidence: high.
