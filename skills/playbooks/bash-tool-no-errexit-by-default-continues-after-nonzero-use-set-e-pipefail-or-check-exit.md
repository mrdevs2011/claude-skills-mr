---
name: bash-tool-no-errexit-by-default-continues-after-nonzero-use-set-e-pipefail-or-check-exit
description: Bash tool (fresh shell) da set -e yo'q, shuning uchun buyruq non-zero bilan chiqsa ham keyingi buyruqlar davom etadi, "success" deb hisoblanadi. false; echo still here davom etadi. tool exit 0 but previous failed. set -e missing default. silent failure chained commands. set -euo pipefail yoki har biridan keyin $? tekshir.
id: bash-tool-no-errexit-by-default-continues-after-nonzero-use-set-e-pipefail-or-check-exit
type: playbook
stack: GNU bash 5.2.15 (fresh shell per tool call)
confirmed_on: 2026-11-19
confidence: high (reproduced in sandbox [SANDBOX]; docs [SRC:https://linuxize.com/post/bash-set-command/ @2026-05] [SRC:https://ss64.com/bash/set.html])
triggers:
  - false; echo still here
  - bash continues after nonzero
  - set -e missing default
  - silent failure chained commands
  - tool exit 0 but previous failed
  - command failed but script continued
  - false; echo still ran
  - bash tool continues after error
  - non-zero exit ignored next command runs
  - set -e not set by default
  - how to stop on first error in bash tool
  - silent failure in chained commands
  - echo $? is 0 even after previous failed
  - bash continues after command not found or fail
  - need set -e in tool call
related:
  - bash-pipeline-exit-status-is-last-command-unless-set-o-pipefail
  - python-subprocess-run-without-check-true-silently-continues-on-non-zero-exit-use-check-or-returncode
  - bash-tool-each-call-is-new-shell-cd-export-source-do-not-persist-use-full-paths-or-chain
---

# Bash tool default no errexit — non-zero dan keyin davom etadi; set -e / pipefail yoki $? tekshir

## TL;DR
Simptom: `false; echo still here` yoki `cmd-that-fails; next-cmd` keyingi buyruq ishlaydi, tool exit 0 (oxirgi buyruq 0 bo'lsa), xato "yutildi".
Sabab: Bash tool yangi shell, `set -e` (errexit) o'chiq by default. Non-zero ignore qilinadi.
Birinchi buyruq: `set -euo pipefail` qo'y yoki har bir muhim buyruqdan keyin `|| exit 1`.
Done: `bash -c 'set -e; false; echo survived'` hech narsa chiqarmaydi (to'xtadi), exit non-zero.

## Qachon ishlatish / ishlatmaslik
Ishlat: Agent bir nechta buyruqni `;` yoki yangi qator bilan zanjirlaganda, birinchisi fail bo'lsa ham keyingilari ishlasa, yoki "hammasi o'tdi" deb noto'g'ri xulosa qilsa. Ayniqsa install/build/test zanjirlarida.
Ishlatma: Ataylab xatoni yutish kerak bo'lsa (`cmd || true`), yoki faqat pipeline (o'sha skillni ishlat), yoki persistent shell (tmux) da allaqachon set -e qo'yilgan bo'lsa. POSIX `sh` da ba'zi narsalar farq qiladi.

## Mental model (nima uchun)
[SANDBOX] Har bash tool chaqiruvi yangi, xotirasiz shell. Default `set -o` da errexit off. Shuning uchun `cmd1; cmd2` da cmd1 1 chiqsa ham cmd2 ishlaydi, va agar cmd2 0 bo'lsa butun chaqiruv exit 0. [SRC:https://ss64.com/bash/set.html] `-e` / `errexit`: Exit immediately if a simple command exits with a non-zero status (istisnolar: if/while/||/&& ichida). pipefail alohida: pipeline oxirgi statusini o'zgartiradi. [SRC:https://linuxize.com/post/bash-set-command/] set -euo pipefail "strict mode" deb ataladi — silent failure'larni ushlaydi. Tool chaqiruvi bitta string bo'lgani uchun ichiga `set -e` qo'yish kerak; tashqaridan persist qilmaydi.

## Diagnosis tree (arzonidan qimmatiga)
1. Joriy shell options tekshir:
   ```
   set -o | grep -E 'errexit|pipefail'
   ```
   EXPECTED: `errexit off` / `pipefail off`. Agar off — 2 ga o't. [SANDBOX]
2. Silent continue'ni qayta ishga tushir:
   ```
   bash -c 'false; echo still here; echo exit:$?'
   ```
   EXPECTED: `still here` va `exit:0`. Agar shunday — sabab tasdiqlandi. Agar to'xtasa, boshqa shell yoki set -e allaqachon bor.
3. set -e bilan solishtir:
   ```
   bash -c 'set -e; false; echo survived'
   ```
   EXPECTED: hech narsa chiqmaydi (echo ishlamadi), va `echo $?` dan keyin 1. Agar ishlasa — set -e qo'yilmagan yoki istisno holat (&&/||).
4. Pipeline alohida tekshir (agar | bor bo'lsa):
   ```
   bash -c 'false | true; echo pipe:$?'
   ```
   EXPECTED: `pipe:0`. Keyin `set -o pipefail` bilan 1. Agar pipe bo'lsa — related skillni ham o'qi. [SANDBOX]

## Fix per cause
**Cause: default no set -e**
Copy-paste:
```
set -euo pipefail
# keyin buyruqlaring
cmd1
cmd2
```
Yoki bitta chaqiruvda: `bash -c 'set -euo pipefail; cmd1; cmd2'`
Re-check: yuqoridagi 3-qadamda "survived" chiqmasligi kerak.

**Cause: faqat oxirgi buyruq statusiga qarab xulosa**
Har biridan keyin tekshir:
```
cmd1 || { echo "cmd1 failed"; exit 1; }
cmd2 || exit 1
```
Yoki `set -e` ishlat.

**Cause: pipeline ichida**
`set -o pipefail` qo'sh (yoki set -eo pipefail). Re-check: `false | true` endi 1.

## Where agents go wrong (>=3)
1. "Tool exit 0 demak hammasi o'tdi" deb o'ylash — oxirgi buyruq 0 bo'lsa, oldingilari fail bo'lgan bo'lishi mumkin.
2. `set -e` ni alohida chaqiruvda qo'yish, keyingi tool chaqiruvida yo'qolishi (har chaqiruv yangi shell).
3. Pipeline'da set -e yetarli deb o'ylash — pipefail ham kerak, aks holda oldingi fail yutiladi.
4. `|| true` yoki `2>/dev/null` bilan xatoni ataylab yashirish, keyin "ishladi" deb xulosa.

## Edge cases (>=2)
1. `set -e` istisnolari: `if cmd; then`, `cmd || fallback`, `while cmd; do` ichida non-zero to'xtatmaydi. [SRC:ss64]
2. Subshell `(cmd)` yoki `$(cmd)` da set -e inheritance farq qilishi mumkin (inherit_errexit shopt). [SRC:linuxize]
3. `set -u` (nounset) unset variable'ni xato qiladi — foydali, lekin ba'zi skriptlarni buzishi mumkin.
4. Background `&` buyruqlar set -e ga ta'sir qilmasligi mumkin; wait kerak.

## Done criteria (proving commands)
```
bash -c 'set -e; false; echo should-not-print' ; echo tool-exit:$?
```
EXPECTED: "should-not-print" yo'q, tool-exit:1 yoki shunga o'xshash non-zero.
```
bash -c 'set -o pipefail; false | true; echo $?'
```
EXPECTED: 1

## If still failing
- `set -x` qo'yib qaysi buyruq fail qilganini ko'r.
- Har bir buyruqni alohida chaqiruvda ishga tushir, exit code'ni alohida tekshir (`echo $?`).
- Persistent shell (tmux/psession) ishlatib, bir marta `set -euo pipefail` qo'y.
- Related: pipeline skill, python subprocess check skill.

## Sources + confidence
- [SANDBOX] reproduced: default continues after false; set -e stops; pipefail changes pipeline status. bash 5.2.15
- [SRC:https://linuxize.com/post/bash-set-command/ @2026-05] set -e exits on error, pipefail for pipelines
- [SRC:https://ss64.com/bash/set.html] exact description of -e / errexit exceptions and pipefail
- [SRC:https://linuxize.com/post/bash-strict-mode/] set -euo pipefail as strict mode
Confidence: high — measured in sandbox, matches official behavior descriptions. Not 100% for every edge (subshell inheritance varies).
