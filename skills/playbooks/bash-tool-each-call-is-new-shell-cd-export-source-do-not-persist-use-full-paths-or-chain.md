---
name: bash-tool-each-call-is-new-shell-cd-export-source-do-not-persist-use-full-paths-or-chain
description: Har bir bash tool chaqiruvi yangi shell. Working directory reset, cd not persist, bash tool doesn't remember cd or export. File not found after previous cd. Use full paths or chain with &&.
id: bash-tool-each-call-is-new-shell-cd-export-source-do-not-persist-use-full-paths-or-chain
type: playbook
stack: bash tool (fresh non-interactive shell per call, Python 3.10.21 sandbox)
confirmed_on: 2026-11-19
confidence: high (reproduced in sandbox [SANDBOX])
triggers:
  - cd in previous bash call but file not found next
  - ls: cannot access 'file': No such file or directory after cd
  - export var then next command empty
  - bash tool does not remember cd or export
  - bash tool doesn't remember cd
  - working directory reset between tool calls
  - source script then next call not set
  - pwd shows different dir after cd
  - chain commands with && for state
  - use absolute paths because shell is stateless
  - No such file or directory after changing directory in previous tool
  - working directory reset between tool calls
  - cd not persist across bash calls
  - shell is stateless
related:
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
  - python-filenotfounderror-open-relative-path-fails-because-cwd-differs-from-script-dir-use-path-file-parent
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
---

# Bash tool har chaqiruvi yangi shell — cd/export/source saqlanmaydi, to'liq path yoki zanjir ishlat

## TL;DR
Simptom: Oldingi bash chaqiruvda `cd /tmp/dir` yoki `export VAR=1` qilding, keyingi chaqiruvda `ls file` → "No such file or directory" yoki `echo $VAR` bo'sh. `pwd` boshqa joy.
Sabab: Har bash tool yangi, xotirasiz shell. Holat saqlanmaydi.
Birinchi buyruq: `pwd` va `ls` yoki `echo $VAR` bilan joriy holatni tekshir, keyin `cd /full/path && command` yoki absolute path.
Done: Buyruq to'liq path yoki `cd && ...` bilan ishlaydi, fayl topiladi.

## Qachon ishlatish / ishlatmaslik
Ishlat: Agent bir necha alohida bash tool chaqiruvi qiladi, `cd`, `export`, `source` dan keyin keyingi chaqiruvda file not found, empty var, wrong python/pip.
Ishlatma: Bitta chaqiruvda hammasi `&&` yoki `;` bilan zanjirlangan, yoki persistent shell (tmux/psession) ishlatilsa, yoki doim absolute path.

## Mental model (nima uchun)
[SANDBOX] Bash tool har chaqiruv yangi non-interactive shell boshlaydi. `cd` faqat joriy process cwd ni o'zgartiradi, keyingi chaqiruvda default (odatda /workspace/artifacts yoki session dir) ga qaytadi. `export` va `source` ham faqat o'sha shell uchun. Bu context isolation va xavfsizlik uchun. Agentlar "men cd qildim" deb keyingi chaqiruvda relative ishlataveradi. [REPO:instruction.md run_command yangi sh]

## Diagnosis tree (arzonidan qimmatiga)
1. Joriy cwd va holatni tekshir:
   ```
   pwd
   ls -la
   echo "VAR=$MYVAR"
   ```
   EXPECTED: pwd /workspace/artifacts yoki boshqa, ls da kerakli fayl yo'q, VAR bo'sh. Agar fayl bor va var set — boshqa muammo. [SANDBOX]

2. Oldingi chaqiruvda cd/export qilinganligini esla (chat tarixi). EXPECTED: ha, alohida tool edi.

3. Fayl haqiqatan bormi (absolute):
   ```
   ls /tmp/test_stateless/testfile.txt
   ```
   EXPECTED: fayl ko'rinadi. Agar yo'q — yo'l noto'g'ri. [SANDBOX]

4. Zanjir bilan sinab ko'r:
   ```
   cd /tmp/test_stateless && ls testfile.txt && cat testfile.txt
   ```
   EXPECTED: testfile.txt\nhello. [SANDBOX]

## Fix per cause
- **cd saqlanmadi**: Har safar `cd /absolute/path && your-command` yoki `your-command /absolute/path/to/file`.
- **export saqlanmadi**: `export VAR=value && command-that-uses-$VAR` bitta chaqiruvda, yoki `VAR=value command`.
- **source saqlanmadi**: `source /path/to/script.sh && next-command` yoki to'liq path (venv uchun alohida skill).
- **Persistent kerak**: Agar uzoq ish — tmux yoki psession.sh ishlat (agar mavjud).

Copy-paste to'g'ri misol:
```
cd /tmp/test_stateless && ls testfile.txt && echo "file found"
```
EXPECTED: file found. [SANDBOX]

Absolute:
```
cat /tmp/test_stateless/testfile.txt
```
EXPECTED: hello

## Where agents go wrong
1. `cd dir` qilib, keyingi alohida bash tool da `python script.py` yoki `ls` deb o'ylash — cwd reset.
2. `export PATH=...` yoki `source activate` keyin keyingi chaqiruvda kutish.
3. Relative path ishlatish "men papkada edim" deb.
4. Bir necha chaqiruv o'rniga bitta uzun zanjir qilmaslik (timeout ehtimoli bor, lekin 30s ichida).

## Edge cases
1. `cd -` yoki pushd/popd ham saqlanmaydi. [SANDBOX]
2. Background task (block_until_ms oshsa) alohida, lekin har biri yangi. [not verified for all]
3. Agar tool chaqiruvi ichida `cd` qilsang va u yerda ishlasa — ok, lekin keyingisida yo'q.
4. Fish yoki boshqa shell: bash tool odatda bash. [not verified]

## Done criteria
```
pwd  # default ni ko'r
cd /tmp/test_stateless && pwd && ls testfile.txt  # zanjir ishlaydi
ls /tmp/test_stateless/testfile.txt  # absolute ishlaydi
```
EXPECTED: zanjirda /tmp/test_stateless va fayl, absolute ham. Keyingi alohida chaqiruvda pwd default, ls relative fail.

## If still failing
- `find / -name testfile.txt 2>/dev/null | head` bilan haqiqiy joyini top (sekin).
- Barcha buyruqlarni bitta `bash -c 'cd ... && ...'` da yoz.
- Persistent session kerak bo'lsa instruction.md dagi psession.sh ga qara.

## Sources + confidence
- [SANDBOX] Reproduced 2026-11-19: cd in one bash, next pwd=/workspace/artifacts, ls relative fail; chain and absolute succeed. Export same.
- [SRC:https://www.gnu.org/software/bash/manual/bash.html @ Bash 5.x, 2026-11] Shell state is per process; new invocation starts fresh.
- Confidence: high for bash tool. [GUESS] exact default cwd may vary by session.
