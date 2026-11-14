---
name: bash-pipeline-exit-status-is-last-command-unless-set-o-pipefail
description: Pipeline (cmd1 | cmd2) exit status is only last command by default, so earlier failure is ignored even with set -e. Fix with set -o pipefail. Triggers on script continues after pipe error, false | true exits 0, set -e not catching pipe.
id: bash-pipeline-exit-status-is-last-command-unless-set-o-pipefail
type: playbook
stack: GNU bash 5.2.15 (Linux)
confirmed_on: 2026-11-14
confidence: high (measured in sandbox + official docs)
triggers:
  - false | true exits 0
  - set -e not catching pipe failure
  - pipeline exit status last command only
  - pipefail not set script continues after error
  - curl | tee succeeds even if curl fails
  - PIPESTATUS vs pipefail
  - bash pipeline silent failure
  - set -o pipefail needed for set -e
  - pipeline returns 0 but earlier command failed
  - bash set -e ignores | pipe error
related:
  - sh-syntax-error-open-parenthesis-unexpected-bash-array-or-feature-use-bash-shebang
  - shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
---

# TL;DR
Simptom: bash skript `false | true` dan keyin davom etadi, `echo $?` 0, `set -e` pipe xatosini ushlamaydi, curl | tee "muvaffaqiyatli" deb hisoblaydi lekin curl 404/connection error.
Sabab: default pipeline exit status oxirgi buyruqniki (true/tee), oldingi xato e'tiborsiz. `pipefail` o'chiq.
Birinchi buyruq: `set -o pipefail` (yoki `set -eo pipefail`).
Done: `bash -c 'set -o pipefail; false | true; echo $?'` 1 chiqaradi va set -e bilan script to'xtaydi.

## Qachon ishlatish / ishlatmaslik
Ishlat: bash skript yoki bir martalik `bash -c` da pipeline (`|`) ishlatilganda, oldingi buyruq xato bersa ham script davom etsa, yoki `set -e` qo'yilgan lekin pipe xatosi ushlanmasa. Ayniqsa `curl | tee`, `grep | cut`, `cmd | head` kabi holatlarda silent failure.
Ishlatma: oddiy buyruq (pipe yo'q), yoki siz ataylab oxirgi buyruq statusini xohlaysiz (masalan `cmd | true` xatoni yutish uchun). POSIX sh da pipefail yo'q — bash shebang ishlat. Zsh/ksh boshqacha bo'lishi mumkin.

## Mental model (nima uchun)
[SRC:https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html @ Bash 5.2 2026-11-14] pipefail o'chiq bo'lsa pipeline return value oxirgi (rightmost) buyruq statusi. Oldingi buyruq non-zero bo'lsa ham oxirgi 0 bo'lsa butun pipeline 0. `set -e` faqat pipeline'ning yakuniy statusiga qaraydi, shuning uchun pipe ichidagi xato ushlanmaydi. pipefail yoqilsa: "the return value of a pipeline is the value of the last (rightmost) command to exit with a non-zero status, or zero if all commands in the pipeline exit successfully." [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Muammoni qayta ishga tushir: `bash -c 'false | true; echo exit:$?'`. EXPECTED: `exit:0`. Agar 0 bo'lsa → 2 ga o't. Agar 1 bo'lsa, boshqa sabab.
2. pipefail holatini tekshir: `bash -c 'set -o | grep pipefail'`. EXPECTED: `pipefail        off`. Agar off → sabab shu.
3. set -e bilan tekshir: `bash -c 'set -e; false | true; echo reached'`. EXPECTED: `reached` chiqadi (to'xtamaydi). Agar to'xtasa, pipefail allaqachon yoqilgan.
4. Haqiqiy buyruq bilan: `bash -c 'false | cat; echo $?'`. EXPECTED 0. Keyin `PIPESTATUS` ni ko'r: `bash -c 'false | true; echo ${PIPESTATUS[@]}'`. EXPECTED `1 0` — birinchi failed.

## Fix per cause
**Sabab: pipefail o'chiq**
Copy-paste:
```bash
set -o pipefail
# yoki birga:
set -eo pipefail
# yoki shebang dan keyin:
#!/usr/bin/env bash
set -euo pipefail
```
Re-check: `bash -c 'set -o pipefail; false | true; echo exit:$?'` → `exit:1`
set -e bilan: `bash -c 'set -eo pipefail; false | true; echo reached' || echo stopped` → `stopped`

Agar ataylab xatoni yutish kerak bo'lsa: `(false || true) | true` yoki `false | true || true`.

## Where agents go wrong (>=3)
1. Faqat `set -e` qo'yib, pipefailni unutadi — pipeline xatosi ushlanmaydi.
2. `$?` ni pipeline'dan keyin darhol o'qimasdan boshqa buyruq ishga tushiradi, PIPESTATUS o'chib ketadi.
3. POSIX sh (`#!/bin/sh`) da `set -o pipefail` ishlatadi — "Illegal option" yoki ishlamaydi. Bash shebang kerak.
4. `head` yoki `sed q` kabi early exit qiladigan buyruq bilan pipefail SIGPIPE (141) ni xato deb hisoblaydi — kerak bo'lsa `(cmd || true) | head`.

## Edge cases (>=2)
1. SIGPIPE (exit 141): `yes | head -n1` pipefail bilan non-zero bo'lishi mumkin, chunki yes SIGPIPE oladi. Fix: `(yes || true) | head -n1` yoki pipefailni vaqtincha o'chir.
2. Subshell: `(set -o pipefail; false | true)` faqat o'sha subshell'da ishlaydi, tashqarida yo'q.
3. `!` inverts: `! false | true` pipefail bilan boshqacha bo'lishi mumkin.

## Done criteria (proving commands)
```bash
bash -c 'set -o pipefail; false | true; echo $?'   # must print 1
bash -c 'set -eo pipefail; false | true; echo reached' || echo "correctly stopped"
bash -c 'false | true; echo $?'                     # must print 0 (without pipefail)
```
Agar birinchi 1, ikkinchi stopped, uchinchi 0 — to'g'ri.

## If still failing
- `set -o | grep pipefail` on ekanini tasdiqla.
- `echo ${PIPESTATUS[@]}` ni pipeline'dan keyin darhol ishlat.
- Shebang `#!/usr/bin/env bash` ekanini tekshir, `sh` emas.
- `bash --version` 4.0+ (pipefail 3.0 dan bor, lekin 5.x ishonchli).

## Sources + confidence
- [SRC:https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html @ Bash 5.2, 2026-11-14]: pipefail definition.
- [SANDBOX]: real outputs above (wrong exit:0, right exit:1, set -e reaches vs stops).
- confidence: high (docs + measured).
