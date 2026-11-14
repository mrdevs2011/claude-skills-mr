---
name: fish-shell-bash-syntax-unsupported-equals-or-array-index-0-use-set-and-1-based
description: Fish shell da bash uslubidagi name=value, arr=(..), arr[0], [[ ]], $? ishlatilganda "Unsupported use of '='", "array indices start at 1", "Missing end", "$? is not the exit status" xatolari. set, 1-based index, test, $status ishlat.
id: fish-shell-bash-syntax-unsupported-equals-or-array-index-0-use-set-and-1-based
type: playbook
stack: fish 4.9.3 (standalone binary) on Linux x86_64 (sandbox 2026-11)
confirmed_on: 2026-11-14
confidence: high (reproduced in sandbox with official fish 4.9.3 binary)
triggers:
  - Unsupported use of '='. In fish, please use 'set
  - fish: Unsupported use of '='
  - array indices start at 1, not 0
  - fish array indices start at 1
  - $? is not the exit status. In fish, please use $status
  - Missing end to balance this if statement
  - fish syntax error assignment
  - fish bash compatibility
  - set name value instead of name=value
  - fish 1-based array
related:
  - playbooks/sh-syntax-error-open-parenthesis-unexpected-bash-array-or-feature-use-bash-shebang.md
  - playbooks/shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang.md
---

# Fish shell: bash syntax "Unsupported use of '='" yoki array[0] — set va 1-based ishlat

## TL;DR
Simptom: fish da "Unsupported use of '='. In fish, please use 'set name value'." yoki "array indices start at 1, not 0." yoki "$? is not the exit status" chiqadi.
Sabab: fish POSIX/bash emas; o'zgaruvchi set bilan, ro'yxatlar 1-based, status $status, if end bilan.
Birinchi buyruq: fish --version; keyin xato qatoridagi = ni set ga, [0] ni [1] ga o'zgartir.
Done: fish -c 'set arr a b; echo $arr[1]' "a" chiqaradi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: fish shell (yoki fish -c, #!/usr/bin/env fish) da bash-style kod ishlatilganda yuqoridagi xatolar chiqsa.
Ishlatma: /bin/sh yoki dash da "Syntax error: "(" unexpected" (boshqa skill), yoki haqiqiy fish syntax xato (qavs yopilmagan), yoki bash bilan ishlayotgan bo'lsa.

## Mental model (nima uchun)
[SANDBOX] [SRC:https://fishshell.com/docs/current/fish_for_bash_users.html@4.9.3] Fish ataylab POSIX-mos emas. O'zgaruvchi: set name value (name=value faqat env override uchun). Ro'yxatlar 1-indexed ($arr[1] birinchi). Command substitution (cmd) yoki $(cmd), backticks emas. $? → $status. if ... end (fi emas). [[ ]] yo'q, test yoki [ ishlat. Agent bash deb taxmin qilib kod yozadi, fish da parse xato beradi. [REPO:instruction.md Linux tools]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "Unsupported use of '='", "array indices start at 1", "$? is not the exit status", "Missing end" borligini tekshir.
   EXPECTED: shu xatolardan biri. Agar "command not found" — PATH. Agar bash da ham — boshqa. [SANDBOX: fish -c 'name=value' → Unsupported use of '=']

2. Qaysi shell ekanini tekshir: echo $SHELL; fish --version; yoki head -1 script.fish
   EXPECTED: /usr/bin/fish yoki fish 4.x. Agar bash — bu skill emas. [SANDBOX: ./fish --version → fish, version 4.9.3]

3. Xato qatorini bash ga o'xshash qilib fish to'g'ri uslubiga o'zgartirib sinab ko'r.
   EXPECTED: set arr a b c; echo $arr[1] → a. [SANDBOX]

4. Agar script bo'lsa, shebang tekshir va fish bilan ishga tushir: fish script.fish
   EXPECTED: to'g'ri yozilgan ishlaydi. [SANDBOX: #!/tmp/fish + set → value]

5. Agar hali xato — fish -n script.fish (syntax check) yoki xato qatorini alohida fish -c bilan.
   EXPECTED: aniq qator. [SANDBOX]

## Fix per cause
- name=value: set name value; yoki env uchun set -x name value. Tekshir: fish -c 'set name value; echo $name' → value
- arr=(a b c); echo $arr[0]: set arr a b c; echo $arr[1]. Tekshir: fish -c 'set arr a b c; echo $arr[1]' → a
- echo $?: echo $status. Tekshir: fish -c 'false; echo $status' → 1
- if [[ -f f ]]; then ... fi: if test -f f; echo yes; end. Tekshir: fish -c 'if test -f /tmp/fish; echo yes; end' → yes
- `date`: (date) yoki $(date). Tekshir: fish -c 'echo (date)' → sana

Har bir tuzatishdan keyin xuddi shu buyruqni qayta ishga tushirib xato yo'qligini tasdiqla.

## Where agents go wrong
1. Bash syntaxini to'g'ridan-to'g'ri fish ga paste qiladi, shebang yoki $SHELL tekshirmaydi.
2. Array index 0 deb qoldiradi, fish "start at 1" deganini o'qimaydi.
3. set o'rniga export name=value yozadi (export ham set -x).
4. if ni fi bilan yopadi, end kerakligini bilmaydi.
5. Backticks ishlatadi, ular literal qoladi.

## Edge cases
1. Inline env: name=value cmd fish da ishlaydi (faqat shu buyruq uchun), lekin name=value; keyingi qator emas. [SANDBOX: fish -c 'FOO=bar echo $FOO' ishlaydi?]
2. Fish 3.x vs 4.x: $() 3.4+ da bor, lekin (cmd) har doim. Array 1-based barqaror.
3. Script #!/bin/sh lekin fish sifatida chaqirilsa — fish o'z tilida parse qiladi, bash emas.
4. Global vs local: set -l local uchun.

## Done criteria
fish -c 'set arr a b c; echo $arr[1]; set name value; echo $name; false; echo $status' → a\nvalue\n1
va hech qanday "Unsupported" yoki "indices start at 1" xatosi yo'q.
Script bo'lsa: fish script.fish exit 0 va kutilgan chiqish.

## If still failing
- fish --version bilan versiyani tasdiqla (4.x tavsiya).
- Rasmiy hujjat: https://fishshell.com/docs/current/fish_for_bash_users.html
- Agar bash kerak bo'lsa, bash -c '...' yoki shebang #!/bin/bash qil, fish ga o'tkazma.
- Syntax: fish -n script.fish

## Sources + confidence
[SRC:https://fishshell.com/docs/current/fish_for_bash_users.html@fish 4.9.3 2026-09] Variables: set instead of VAR=VAL; arrays 1-based; $status instead of $?; if ... end.
[SRC:https://fishshell.com/docs/current/index.html@4.9.3] Shebang and non-POSIX.
[SANDBOX] Real outputs: fish -c 'name=value' → "Unsupported use of '='. In fish, please use 'set name value'."; fish -c 'set arr a b; echo $arr[0]' → "array indices start at 1, not 0."; fish -c 'echo $?' → "$? is not the exit status. In fish, please use $status."
Confidence: high — sandboxda rasmiy 4.9.3 binary bilan takrorlandi, hujjatlar mos.
