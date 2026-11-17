---
name: git-rebase-or-merge-conflict-markers-left-resolve-with-edit-add-continue-not-manual-commit
description: git rebase or merge stops with CONFLICT (content): Merge conflict in file, markers <<<<<<< ======= >>>>>>> left in files, or rebase --continue fails because not staged. Fix by editing out markers, git add, then rebase --continue (do not git commit manually).
id: git-rebase-or-merge-conflict-markers-left-resolve-with-edit-add-continue-not-manual-commit
type: playbook
stack: git 2.39.5 (sandbox), general git
confirmed_on: 2026-11-17
confidence: high (reproduced in sandbox with local bare remote, conflict markers exact)
triggers:
  - CONFLICT (content): Merge conflict in
  - error: could not apply
  - Resolve all conflicts manually, mark them as resolved with
  - "git add/rm <conflicted_files>", then run "git rebase --continue"
  - both modified:
  - <<<<<<< HEAD
  - =======
  - >>>>>>>
  - git rebase --continue fails No changes
  - interactive rebase in progress
  - Could not apply ... change
related:
  - git-push-rejected-remote-contains-work-you-do-not-have-locally-pull-rebase-then-push.md
  - git-commit-fails-author-identity-unknown-please-tell-me-who-you-are-set-user-email-name.md
  - agent-unstuck-protocol-after-two-similar-failures-explain-problem-clearly.md
---

# git rebase/merge CONFLICT (content) — markerlarni olib tashla, add, --continue (manual commit emas)

## TL;DR
Simptom: `git pull --rebase` yoki `git rebase`/`git merge` to'xtaydi, `CONFLICT (content): Merge conflict in file.txt`, faylda `<<<<<<< HEAD` `=======` `>>>>>>>` markerlar qolgan, status "both modified".
Sabab: ikki tomon bir xil satrni o'zgartirgan, Git qaysi versiyani tanlashni bilmaydi.
Birinchi buyruq: `git status` (unmerged paths ko'r), keyin faylni edit qilib markerlarni olib tashla, `git add file.txt`, `git rebase --continue` (yoki merge bo'lsa commit).
Done: rebase muvaffaqiyatli, `git status` "working tree clean", hech qanday marker yo'q, push o'tadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: mid-coding `git pull --rebase` yoki rebase/merge dan keyin CONFLICT chiqsa, markerlar qolgan, continue ishlamaydi.
Ishlatma: oddiy push rejected (boshqa skill), auth xato, yoki conflict yo'q (fast-forward). Manual `git commit` rebase paytida qilma.

## Mental model (nima uchun)
[SANDBOX] Rebase remote commitlarni oladi va sening commitlaringni ustiga replay qiladi. Agar bir xil joy o'zgargan bo'lsa, Git to'xtaydi va markerlar qo'yadi: HEAD (hozirgi, ya'ni rebase onto bo'lgan) va sening commit'ing. Markerlar qolsa, kod ishlamaydi. `git add` "resolved" deb belgilaydi, keyin `--continue` yangi commit yaratadi (asl author bilan). Manual `git commit` qilsang, rebase buziladi yoki ikki marta commit bo'ladi. Merge da esa odatda `git commit` bilan tugatiladi. [SRC:https://git-scm.com/docs/git-rebase.html @2.39] "If there is a merge conflict during this process, git rebase will stop... Resolve the conflict... git add... git rebase --continue"

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi.
   EXPECTED: "CONFLICT (content): Merge conflict in <file>" yoki "error: could not apply <hash>..." + "Resolve all conflicts manually... git rebase --continue".
   Agar boshqa (auth, not a repo) — bu skill emas.

2. Holat: `git status`
   EXPECTED: "interactive rebase in progress" yoki "You have unmerged paths", "both modified: file.txt".
   Agar "all conflicts fixed: run git rebase --continue" — faqat continue qil.

3. Markerlar: `grep -n '<<<<<<<' file.txt` yoki `cat file.txt`
   EXPECTED: <<<<<<< HEAD ... ======= ... >>>>>>> hash (commit)
   Yo'q bo'lsa, boshqa sabab (binary, delete/modify).

4. Tuzat: faylni edit qil (vi/nano/printf), markerlarni olib tashla, to'g'ri content qoldir (ikki tomonni birlashtir yoki tanla).
   EXPECTED: markerlar yo'q, content mantiqan to'g'ri.

5. Stage: `git add file.txt`
   EXPECTED: status da "Changes to be committed" yoki "both modified" yo'qoladi.

6. Continue: `git config user.email automation@local; git config user.name "Skill Generator"` (agar identity unknown bo'lsa), keyin `GIT_EDITOR=true git rebase --continue`
   EXPECTED: "Successfully rebased and updated refs/heads/master." yoki keyingi conflict.
   Xato "No changes" bo'lsa — o'zgarish yo'q, `git rebase --skip`.

7. Tekshir va push: `git status; git push origin master`
   EXPECTED: "up to date", push "master -> master".

## Fix per cause
- Content conflict (eng keng tarqalgan):
  ```
  # markerlarni olib tashla, masalan:
  printf 'line2 from local2\nline2 from local1\n' > file.txt
  git add file.txt
  git config user.email automation@local && git config user.name "Skill Generator"
  GIT_EDITOR=true git rebase --continue
  git push origin master
  ```
  Re-check: `grep -c '<<<<<<<' file.txt` 0, `git status` clean.

- "No changes - did you forget to use 'git add'?" : `git add` qilmagan yoki butun patch o'chirilgan. Agar hech narsa qo'shilmasa `git rebase --skip`.

- Merge (rebase emas): `git add`, keyin `git commit` (message bilan).

- Abort: `git rebase --abort` — oldingi holatga qaytadi, hech narsa yo'qolmaydi.

## Where agents go wrong (>=3)
1. Markerlarni qoldirib `git add` va continue qiladi — kodda <<<<<<< qoladi, runtime crash yoki syntax error.
2. Rebase paytida `git commit` qiladi (merge kabi) — "could not commit" yoki tarix buziladi, continue ishlamaydi.
3. Faqat bir tomonni tanlab, ikkinchisini yo'qotadi — data yo'qoladi (ours/theirs chalkash: rebase da HEAD = onto branch).
4. Identity sozlamasdan continue — "Committer identity unknown", continue fail.
5. Qayta-qayta `git pull` urinadi — bir xil conflict.

## Edge cases (>=2)
1. Bir nechta fayl: har birini tuzat, add, keyin continue. Status da barcha "resolved" bo'lishi kerak.
2. Binary conflict yoki delete/modify: `git checkout --ours` yoki `--theirs` (rebase da diqqat), yoki `git rm`, keyin add.
3. Interactive rebase ( -i ): xuddi shunday, lekin to-do list bor.
4. Uncommitted changes bor edi: avval stash, rebase tugagach pop. Conflict paytida stash ishlatma.

## Done criteria (proving commands)
- `git status` : "On branch master\nYour branch is up to date with 'origin/master'.\n\nnothing to commit, working tree clean"
- `grep -c '<<<<<<<\|=======\|>>>>>>>' *.txt` yoki faylda 0
- `git log --oneline -3` linear, ikkala o'zgarish bor
- `git push origin master` exit 0, no rejected
- Rebase in progress yo'q: `ls .git/rebase-merge` yo'q yoki status clean

## If still failing
- Yana conflict: xuddi shu tartibni takrorla (keyingi commit).
- Abort qil, `git diff` bilan nima farq qilayotganini ko'r, keyin qayta.
- Murakkab: `git mergetool` (agar sozlangan), lekin asosan qo'lda tuzat.
- Identity: doim `git config user.email ...` qil (global emas, local).

## Sources + confidence
[SANDBOX] Reproduced exact: `git pull --rebase` chiqardi "CONFLICT (content): Merge conflict in file.txt\nerror: could not apply 3dba4fe... local1 change\nhint: Resolve all conflicts manually... git rebase --continue". Faylda <<<<<<< HEAD\nline2 from local2\n=======\nline2 from local1\n>>>>>>> . Edit + add + config + continue muvaffaqiyatli, push o'tdi, status clean. Git 2.39.5.
[SRC:https://git-scm.com/docs/git-rebase.html] "Resolve the conflict. You can use git diff to find the markers (<<<<<<) ... git add <filename> ... git rebase --continue"
[SRC:https://help.github.com/articles/resolving-merge-conflicts-after-a-git-rebase/] exact "could not apply" + continue/skip/abort.
Confidence: high, based on actual sandbox runs with conflicting commits on bare remote.
