---
id: shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang
name: shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang
description: ./script.sh "cannot execute: required file not found" yoki /bin/bash^M bad interpreter — shebangdagi CRLF (\r) sabab. LF ga o'tkaz, dos2unix yoki sed.
type: playbook
stack: Linux kernel execve + bash 5.x (Debian 12 / any modern)
confirmed_on: 2026-11-12
confidence: high (reproduced in sandbox + man page + multiple sources)
triggers:
  - cannot execute: required file not found
  - ./script.sh: cannot execute: required file not found
  - /bin/bash^M: bad interpreter: No such file or directory
  - bad interpreter shebang CRLF
  - script executable but cannot execute required file not found
  - shebang with carriage return \r
  - CRLF line endings in shell script shebang fails
  - dos2unix needed for script shebang
  - bash script from Windows fails to execute
  - required file not found even though chmod +x and file exists
related:
  - playbooks/bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output.md
---

# Shell script "./script.sh: cannot execute: required file not found" — shebangda CRLF

## TL;DR
Simptom: `chmod +x script.sh` qilingan, fayl bor, lekin `./script.sh` "cannot execute: required file not found" (yoki eski bashda `/bin/bash^M: bad interpreter`) beradi. `bash script.sh` ishlaydi.
Sabab: shebang qatorida CRLF (`\r\n`) — kernel `/bin/bash\r` ni qidiradi, topilmaydi. [SRC:man7.org/linux/man-pages/man2/execve.2.html]
Birinchi buyruq: `od -c script.sh | head -2` yoki `cat -v script.sh | head -1` — `\r` yoki `^M` ko'rinsa CRLF.
Done: `sed -i 's/\r$//' script.sh` dan keyin `./script.sh` ishlaydi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: to'g'ridan-to'g'ri `./script` ishga tushirishda shebang xatosi, Windows/editor dan nusxa olingan skript, `file` "with CRLF line terminators" desa.
Ishlatma: oddiy "command not found" (PATH), permission denied (chmod), yoki shebang path butunlay noto'g'ri (masalan `/usr/bin/python` yo'q). `bash script.sh` ishlamasa, bu skill emas.

## Mental model (nima uchun)
Linux kernel `execve` shebangni literal o'qiydi: birinchi qator `#!` dan keyin bo'shliqsiz absolute path. [SRC:https://man7.org/linux/man-pages/man2/execve.2.html @ 2026-01-18]
CRLF da path oxiriga `\r` (0x0D) qo'shiladi → `/bin/bash\r` mavjud emas.
Bash 5.1+ (Debian 11+) bu xatoni "cannot execute: required file not found" deb yashiradi (eski " /bin/bash^M: bad interpreter"). [SRC:https://unix.stackexchange.com/questions/721844 @ 2022]
`bash script.sh` shebangni e'tiborsiz qoldiradi, shuning uchun ishlaydi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini tekshir: `./script.sh` chiqishi.  
   EXPECTED: "cannot execute: required file not found" yoki "...^M: bad interpreter".  
   Agar boshqa xato → 6. Agar shunday → 2.

2. Shebang baytlarini ko'r: `od -c script.sh | head -2` yoki `cat -v script.sh | head -1`.  
   EXPECTED: `# ! / b i n / b a s h \r \n` yoki `#!/bin/bash^M`.  
   `\r` yoki `^M` bor → 4 (fix). Yo'q → 3.

3. Fayl va ruxsat: `ls -l script.sh; file script.sh` (file bo'lsa).  
   EXPECTED: `-rwxr-xr-x`, "with CRLF line terminators" yoki oddiy.  
   CRLF → 4. Ruxsat yo'q → `chmod +x`. Path yo'q → shebang to'g'rilash.

4. LF ga o'tkaz: `sed -i 's/\r$//' script.sh` (yoki `dos2unix script.sh` agar bor).  
   EXPECTED: xato yo'qoladi. Keyin `od -c` da `\r` yo'q. → 5.

5. Qayta sinash: `./script.sh`.  
   EXPECTED: skript ishlaydi (echo yoki asosiy chiqish). Agar hali xato → shebang path noto'g'ri (6).

6. Boshqa sabablar: `which bash; head -1 script.sh`. Shebang path mavjud emasligi, yoki boshqa interpreter.  
   EXPECTED: path to'g'ri bo'lsa, boshqa skill (permission, syntax).

## Fix har bir sabab uchun
Sabab 1 (asosiy, 95%): CRLF shebang.  
Fix (copy-paste):  
```bash
sed -i 's/\r$//' script.sh
chmod +x script.sh
./script.sh
```
Tekshir: `od -c script.sh | head -2` da `\r` yo'q, `./script.sh` ishlaydi. [SANDBOX: reproduced, fixed]

Agar `dos2unix` bor: `dos2unix script.sh`.

Sabab 2: shebang path noto'g'ri (masalan `#!/usr/bin/bash` lekin yo'q).  
Fix: `#!/usr/bin/env bash` yoki mavjud path. `command -v bash`.

## Agentlar qayerda xato qiladi
1. Xatoni "file not found" deb PATH/chmod deb o'ylab, shebang baytlarini (`od -c`, `cat -v`) tekshirmaydi.
2. `bash script.sh` ishlaganini ko'rib, shebang muammosini e'tiborsiz qoldiradi, `./` da qoldiradi.
3. CRLF ni faqat contentda deb o'ylab, shebangni alohida tuzatmaydi; butun faylni qayta yozadi.
4. Eski xato matni (`^M`) ni kutib, yangi "required file not found" ni boshqa sababga bog'laydi.

## Edge cases
1. Python/Node shebang ham xuddi shunday: `#!/usr/bin/env python3\r` → xuddi shu xato. Fix bir xil. [SRC:unix.SE]
2. Git `core.autocrlf=true` Windows da checkout qilganda qayta kiradi — `.gitattributes` da `*.sh text eol=lf`.
3. `#!/usr/bin/env bash` ham CRLF da buziladi. `env` path ham `\r` bilan.
4. Sandbox/headless da `file` bo'lmasa, `od` yoki `cat -v` ishlat. [SANDBOX]

## Done criteria
```bash
# CRLF yo'q
! od -c script.sh | head -2 | grep -q '\\r' && echo "no CRLF"
# Ishlaydi
./script.sh >/dev/null && echo "executes OK"
# bash ham ishlaydi
bash script.sh >/dev/null && echo "bash OK"
```
Agar `./script.sh` xato bersa, done emas.

## Agar hali ham ishlamasa
- `head -1 script.sh | cat -v` — shebang to'liq ko'r.
- `ls -l $(sed -n '1s/^#!//;s/\r$//p' script.sh)` — interpreter mavjudmi.
- Boshqa skill: permission denied, syntax error, missing binary.
- Repo qoidasi yo'q; bu umumiy Linux.

## Sources + confidence
- [SANDBOX] 2026-11-12: `printf '#!/bin/bash\r\n...' > test.sh; ./test.sh` → "cannot execute: required file not found"; LF → "hello".
- [SRC:https://man7.org/linux/man-pages/man2/execve.2.html @ 2026-01-18] shebang literal path, kernel o'qiydi.
- [SRC:https://unix.stackexchange.com/questions/721844 @ 2022] exact error + CRLF explanation.
- [SRC:https://penguin-gym-linux.com/en/articles/troubleshooting/bad-interpreter-shebang @ 2026] bash version differences.
Confidence: high (reproduced + official man + multiple independent sources).
