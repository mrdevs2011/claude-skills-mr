---
name: bash-non-interactive-aliases-not-expanded-ll-command-not-found-use-full-command-or-shopt-expand-aliases
description: Non-interactive bash (bash -c, bash tool) does not expand aliases by default and does not source .bashrc. "bash: ll: command not found" or similar. Use full command or shopt -s expand_aliases + newline.
id: bash-non-interactive-aliases-not-expanded-ll-command-not-found-use-full-command-or-shopt-expand-aliases
type: playbook
stack: GNU bash 5.2.15 (Linux), non-interactive non-login shell (bash -c / agent bash tool)
confirmed_on: 2026-11-19
confidence: high (reproduced in sandbox + official bash manual)
triggers:
  - "bash: ll: command not found"
  - "bash: la: command not found"
  - alias not found non-interactive
  - expand_aliases
  - non-interactive shell alias
  - .bashrc not sourced in bash -c
  - command not found for common alias
  - shopt expand_aliases off
  - ll works in terminal but not in tool
  - bash tool alias fails
related:
  - bash-stale-hash-table-causes-no-such-file-or-command-not-found-after-move-or-install-use-hash-r
  - fish-shell-bash-syntax-unsupported-equals-or-array-index-0-use-set-and-1-based
  - python-input-eoferror-non-interactive-stdin-in-bash-tool-use-argv-or-file
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
---

# Non-interactive bash: alias kengaymaydi, ll "command not found" — to'liq buyruq yoki shopt -s expand_aliases

## TL;DR
Simptom: bash tool yoki `bash -c` da `ll`, `la` yoki boshqa alias "bash: ll: command not found" beradi, garchi terminalda ishlasa ham.
Sabab: non-interactive shell alias'larni kengaytirmaydi (expand_aliases off) va .bashrc ni o'qimaydi.
Birinchi buyruq: `ls -l` (to'liq) ishlat yoki `shopt -s expand_aliases` + yangi qator + alias.
Done: `ls -l` ishlaydi, yoki shopt bilan alias kengayadi, exit 0.

## Qachon ishlatish / ishlatmaslik
Ishlat: agent bash tool yoki `bash -c` da oddiy alias (`ll`, `la`, `gs` va h.k.) "command not found" bersa, yoki .bashrc dagi sozlamalar yo'q bo'lsa.
Ishlatma: haqiqiy binary yo'q (hash -r skilliga qara), yoki fish shell (alohida skill), yoki PATH muammosi.

## Mental model (nima uchun)
[SANDBOX] Agent bash tool har chaqiruvda yangi non-interactive, non-login shell ochadi (`$-` da `i` yo'q, isatty=False). Bash manual: aliases are not expanded when the shell is not interactive, unless the expand_aliases shell option is set using shopt. .bashrc faqat interactive non-login shell'lar uchun o'qiladi. Shuning uchun terminalda ishlaydigan alias tool'da ishlamaydi. Alias'lar parse vaqtida kengayadi, shuning uchun bir qatorda shopt + alias + ishlatish ishlamaydi — yangi qator kerak. [SRC:https://www.gnu.org/software/bash/manual/html_node/Aliases.html GNU bash manual Aliases section]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "command not found" va bu oddiy aliasmi (ll, la, ...)?
   EXPECTED: "bash: ll: command not found", exit 127. Agar absolute path "No such file" — hash skilliga o't. [SANDBOX]

2. Shell turini tekshir: `bash -c 'echo $-; shopt expand_aliases'`
   EXPECTED: `hBc` (i yo'q), `expand_aliases off`. Agar interactive bo'lsa — bu skill emas. [SANDBOX]

3. To'liq buyruq bilan sinab ko'r: `ls -l /tmp | head -1`
   EXPECTED: listing chiqadi, exit 0. Bu ishlasa — alias muammosi. [SANDBOX]

4. Alias ni majburiy kengaytir: 
   ```
   bash -c 'shopt -s expand_aliases
   alias ll="ls -l"
   ll /tmp | head -1'
   ```
   EXPECTED: listing chiqadi. Bir qatorda ishlamasligi mumkin (parse vaqti). [SANDBOX]

5. Agar .bashrc da maxsus alias kerak bo'lsa: `source ~/.bashrc` (lekin sandbox'da ko'p alias commented), keyin shopt. Ammo eng xavfsiz: to'liq buyruq ishlat, alias'ga tayanma.

## Fix per cause
- Default: to'liq buyruq ishlat (`ls -l` o'rniga `ll`, `ls -A` o'rniga `la`).
- Alias kerak bo'lsa: script boshida `shopt -s expand_aliases` qo'sh, alias ta'rifini alohida qatorda, keyin ishlat.
- .bashrc sozlamalari: `source ~/.bashrc` qil, lekin non-interactive da ba'zi qismlar return qilishi mumkin (Ubuntu'da `[ -z "$PS1" ] && return` bor).

Copy-paste (to'g'ri):
```
# To'liq ishlat (tavsiya)
ls -l /tmp

# Yoki majburiy
shopt -s expand_aliases
alias ll='ls -l'
ll /tmp
```

## Where agents go wrong (>=3)
1. Terminalda ishlagan `ll` ni tool'ga copy-paste qiladi — command not found.
2. Bir qatorda `shopt -s expand_aliases; alias ll=...; ll` yozadi — parse vaqti tufayli ishlamaydi.
3. .bashrc ni source qiladi deb o'ylaydi, lekin non-interactive da avtomatik emas.
4. "command not found" ni PATH yoki hash muammosi deb, hash -r qiladi — alias emas.

## Edge cases (>=2)
1. Alias ta'rifi va ishlatish bir qatorda — kengaymaydi, yangi qator kerak.
2. POSIX mode yoki `sh` chaqirilsa — alias umuman boshqacha.
3. .bashrc da `[ -z "$PS1" ] && return` bor bo'lsa — source qilsang ham alias'lar o'tkazib yuborilishi mumkin.
4. Sandbox'da .bashrc aliases commented — source qilish hech narsa bermaydi.

## Done criteria (proving commands)
- `ls -l /tmp | head -1` exit 0, listing chiqadi.
- Yoki shopt bilan alias: `bash -c 'shopt -s expand_aliases
alias ll="ls -l"
ll /tmp | head -1'` exit 0.
- `bash -c 'echo $-'` da `i` yo'qligini tasdiqla.

## If still failing
- Haqiqiy binary yo'q: `type -a ll` yoki `which ll` — hash skilliga o't.
- Boshqa shell (fish): alohida skill.
- PATH: `echo $PATH`, to'liq path ishlat.
- CRLF shebang: alohida skill.

## Sources + confidence
[SANDBOX] Reproduced 2026-11-19: `bash -c 'll /tmp'` → "bash: line 1: ll: command not found" exit 127; `bash -c 'echo $-; shopt expand_aliases'` → hBc, off; to'liq `ls -l` va shopt+newline ishladi.
[SRC:https://www.gnu.org/software/bash/manual/html_node/Aliases.html GNU bash manual (Aliases): "Aliases are not expanded when the shell is not interactive, unless the expand_aliases shell option is set using shopt."]
Confidence: high, based on actual runs + official docs.
