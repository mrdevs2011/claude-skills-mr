---
name: git-push-rejected-remote-contains-work-you-do-not-have-locally-pull-rebase-then-push
description: git push rejected with "Updates were rejected because the remote contains work that you do not have locally" or non-fast-forward / fetch first. Fix by git pull --rebase then push. Do not force unless intentional.
id: git-push-rejected-remote-contains-work-you-do-not-have-locally-pull-rebase-then-push
type: playbook
stack: git 2.39.5 (sandbox), general git
confirmed_on: 2026-11-17
confidence: high (reproduced in sandbox with local bare remote)
triggers:
  - Updates were rejected because the remote contains work that you do
  - not have locally
  - ! [rejected] master -> master (fetch first)
  - failed to push some refs
  - non-fast-forward
  - git push rejected
  - remote contains work you do not have locally
  - You may want to first integrate the remote changes
  - git pull before push
  - branch tip is behind its remote counterpart
related:
  - agent-unstuck-protocol-after-two-similar-failures-explain-problem-clearly.md
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output.md
---

# git push "remote contains work you do not have locally" yoki non-fast-forward — pull --rebase keyin push

## TL;DR
Simptom: `git push` chiqadi `! [rejected] ... (fetch first)` yoki `Updates were rejected because the remote contains work that you do not have locally`.
Sabab: remote'da sening local commit'laringda yo'q yangi commit bor (boshqa joydan push qilingan).
Birinchi buyruq: `git pull --rebase origin <branch>` (odatda master yoki main).
Done: rebase muvaffaqiyatli, keyin `git push` o'tadi, `git status` "Your branch is up to date".

## Qachon ishlatish / ishlatmaslik
Ishlat: mid-coding git push qilayotganda rejected, remote ahead.
Ishlatma: force push kerak bo'lsa (tarixni yo'qotish xavfi), yoki local o'zgarishlar commit qilinmagan (avval commit/stash), yoki yangi branch yaratish.

## Mental model (nima uchun)
[SANDBOX] Git push faqat fast-forward qabul qiladi — remote tip sening commit'ingning ajdodi bo'lishi kerak. Aks holda tarix yo'qolishi mumkin, shuning uchun rad etadi. `git pull --rebase` remote o'zgarishlarini oladi va sening commit'laringni ustiga qo'yadi, so'ngra push fast-forward bo'ladi. Merge o'rniga rebase linear tarix beradi. [SRC:https://git-scm.com/docs/git-push @2.39] [SRC:https://git-scm.com/docs/git-pull]

## Diagnosis tree (arzonidan qimmatiga)
1. Push xato matnini o'qi.
   EXPECTED: "Updates were rejected because the remote contains work that you do not have locally" yoki "! [rejected] ... (fetch first)" yoki "non-fast-forward".
   Agar boshqa xato (auth, permission) — bu skill emas.

2. Holatni tekshir: `git status` va `git log --oneline -3 --all`
   EXPECTED: "Your branch is ahead of 'origin/...' by N commits" yoki diverged. Remote'da yangi commit bor.

3. Remote o'zgarishlarni ol: `git fetch origin`
   EXPECTED: " * branch master -> FETCH_HEAD" yoki yangi commitlar ko'rinadi. Xato bo'lsa auth/remote URL tekshir.

4. Rebase qil: `git pull --rebase origin master` (yoki main/branch nomi)
   EXPECTED: "Successfully rebased and updated refs/heads/master." yoki conflict bo'lsa "CONFLICT" chiqadi.
   Agar conflict: fayllarni tuzat, `git add`, `git rebase --continue`. Abort uchun `git rebase --abort`.

5. Push: `git push origin master`
   EXPECTED: "master -> master" muvaffaqiyat, hech qanday rejected yo'q.

## Fix per cause
- Remote ahead, local commits bor: 
  ```
  git pull --rebase origin master
  # agar conflict yo'q
  git push origin master
  ```
  Re-check: `git status` "up to date with 'origin/master'".

- Conflict: tuzatgandan keyin continue, keyin push.

- Force kerak emas: `--force` ishlatma, tarixni yo'qotadi.

## Where agents go wrong (>=3)
1. `--force` yoki `-f` bilan push qiladi — remote tarixni yo'qotadi, boshqalar ishini buzadi.
2. `git pull` (merge) qiladi, merge commit yaratadi, keyin yana muammo.
3. Fetch qilmay, qayta-qayta push urinadi — bir xil xato.
4. Conflictni e'tiborsiz qoldirib continue qiladi — broken code push.

## Edge cases (>=2)
1. Conflict chiqsa: `git status` da "both modified", tuzat, add, rebase --continue. Abort qilsa oldingi holatga qaytadi.
2. Branch nomi master emas main: `git branch` bilan tekshir, mos nom ishlat.
3. Uncommitted changes: avval `git stash` yoki commit, rebase keyin stash pop.
4. Detached HEAD: `git checkout master` qil, keyin.

## Done criteria (proving commands)
- `git push origin master` exit 0, "-> master" chiqadi.
- `git status` : "Your branch is up to date with 'origin/master'."
- `git log --oneline origin/master -1` local bilan mos.
- Hech qanday "rejected" yoki "non-fast-forward" yo'q.

## If still failing
- Auth xato: remote URL `git remote -v` tekshir, token yoki SSH.
- Rebase aborted: `git rebase --abort`, holatni qayta tekshir.
- Juda murakkab conflict: merge o'rniga yoki yordam so'ra, lekin force faqat aniq kerak bo'lsa va xavfsiz.

## Sources + confidence
[SANDBOX] Reproduced: local1 push rejected with exact "remote contains work... (fetch first)", then `git pull --rebase` succeeded, push went through, log shows linear history. Git 2.39.5.
[SRC:https://git-scm.com/docs/git-push] NOTE ABOUT FAST-FORWARDS, rejected non-fast-forward.
[SRC:https://git-scm.com/docs/git-pull] --rebase option.
Confidence: high, based on actual runs in sandbox with bare remote.
