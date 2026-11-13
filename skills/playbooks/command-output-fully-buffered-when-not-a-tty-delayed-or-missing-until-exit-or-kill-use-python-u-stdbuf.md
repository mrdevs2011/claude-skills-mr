---
name: command-output-fully-buffered-when-not-a-tty-delayed-or-missing-until-exit-or-kill-use-python-u-stdbuf
description: Command or Python script produces no or delayed output when piped, timed out, or not a TTY because stdout is block-buffered. Use python -u / PYTHONUNBUFFERED=1 or stdbuf -o0. Triggers on silent progress, empty tool output until exit.
id: command-output-fully-buffered-when-not-a-tty-delayed-or-missing-until-exit-or-kill-use-python-u-stdbuf
type: playbook
stack: Python 3.10.21 + bash/coreutils stdbuf (Linux)
confirmed_on: 2026-11-13
confidence: high (reproduced in sandbox + official docs)
triggers:
  - command produces no output until it finishes or is killed
  - python print not showing in tool or pipe
  - stdout buffered empty when piped
  - timeout killed process but no partial output
  - "hello" never printed before sleep
  - output delayed because not a terminal
  - PYTHONUNBUFFERED or python -u needed
  - stdbuf -o0 still no output for python
  - block buffered stdout in non-tty
  - why is my script silent until exit
related:
  - playbooks/bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output.md
  - playbooks/bash-tool-output-truncated-full-log-at-tmp-sessions-read-file-to-get-complete.md
  - playbooks/python-pty-fork-child-reports-wrong-terminal-size-unless-tiocswinsz-on-master-fd.md
---

# Buyruq chiqishi to'liq buferlanadi (TTY emas) — qisman yoki hech narsa ko'rinmaydi, -u yoki stdbuf ishlat

## TL;DR
Simptom: python/bash buyruq `print("hello")` yoki echo qiladi, lekin tool/pipe/timeout da hech narsa chiqmaydi, faqat tugaganda yoki o'ldirilganda (yoki umuman yo'q).
Sabab: stdout TTY bo'lmasa block-buffered; buffer to'lmaguncha yoki exit/flush bo'lmaguncha yozilmaydi.
Birinchi buyruq: `python3 -u -c '...'` yoki `PYTHONUNBUFFERED=1 python3 ...` (python uchun); boshqa uchun `stdbuf -o0 command`.
Done: qisman chiqish (masalan "hello") timeout yoki pipe da darhol ko'rinadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: long-running script, progress print, tool chiqishi bo'sh yoki kechikkan, timeout qisqichida hech narsa yo'q.
Ishlatma: oddiy qisqa buyruq, TTY da ishlayotgan, yoki allaqachon -u/flush ishlatilgan. Veb/Android da ishlamaydi [not verified].

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/using/cmdline.html @3.10 2026-11] Python interactive (TTY) da line-buffered, aks holda block-buffered (regular file kabi). `-u` yoki `PYTHONUNBUFFERED` unbuffered qiladi. Ko'p dasturlar pipe/redirect da to'liq buferlaydi — real-time progress yo'qoladi. [SANDBOX] timeout 2 python3 (print+sleep) hech narsa chiqarmadi; -u bilan "hello" chiqdi.

## Diagnosis tree (arzonidan qimmatiga)
1. Chiqishni tekshir: buyruqni to'g'ridan-to'g'ri ishga tushir, timeout yoki | cat bilan.  
   EXPECTED: "hello" yoki progress darhol. Agar yo'q, lekin oxirida bor → bufer.  
   Agar umuman yo'q → boshqa xato (crash).

2. TTY ekanligini tekshir: `python3 -c 'import sys; print(sys.stdout.isatty())'`  
   EXPECTED: False (tool/pipe). True bo'lsa — bufer emas. [SANDBOX]

3. Python ekanligini bil: `python3 -u` yoki env bilan qayta.  
   EXPECTED: qisman chiqish paydo bo'ladi. Agar yo'q — 4.

4. Umumiy: `stdbuf -oL command` yoki `-o0`.  
   EXPECTED: line yoki unbuffered. Python uchun ishlamasligi mumkin (o'zi buferlaydi).

5. Kod ichida flush: `sys.stdout.flush()` yoki print(..., flush=True).  
   EXPECTED: darhol yoziladi.

## Fix har bir sabab uchun
Sabab 1 (Python eng ko'p): block-buffered.  
Fix:  
```bash
python3 -u script.py
# yoki
PYTHONUNBUFFERED=1 python3 script.py
# yoki kodda
print("progress", flush=True)
```
Tekshir: `timeout 2 python3 -u -c 'print("hello"); import time; time.sleep(5)'` → "hello" chiqadi.

Sabab 2 (boshqa C dastur): stdbuf.  
```bash
stdbuf -o0 mycommand | cat
# yoki -oL line-buffered
```
Tekshir: qisman output paydo bo'ladi.

Sabab 3: timeout/tool qisqich: avval unbuffered qil, keyin timeout.

## Agentlar qayerda xato qiladi
1. Chiqish yo'qligini "buyruq ishlamayapti" deb o'ylab qayta-qayta chaqiradi — buffer tufayli.
2. Faqat `print` yoki echo ishlatib, flush/-u qo'shmaslik.
3. stdbuf ni python ga qo'llab, ishlamasligini tushunmaslik (python o'z buferini o'rnatadi).
4. Tool timeout dan keyin log faylni o'qimasdan "bo'sh" deb xulosa.

## Edge cases
1. stderr odatda line-buffered — print vs sys.stderr.write farqi. [SRC]
2. Ba'zi dasturlar (dd, cat) stream ishlatmaydi, stdbuf ta'sir qilmaydi.
3. Interactive script yoki input() — -u stdin ga ta'sir qilmaydi.
4. Wayland/Android/Windows: [not verified], bufer boshqacha bo'lishi mumkin.

## Done criteria
```bash
# Python repro
timeout 2 python3 -c 'print("hello"); import time; time.sleep(5)' ; echo "no -u exit:$?"
# EXPECTED: hech narsa, exit 124
timeout 2 python3 -u -c 'print("hello"); import time; time.sleep(5)' ; echo "with -u exit:$?"
# EXPECTED: hello chiqadi, exit 124
# stdbuf test
stdbuf -o0 bash -c 'echo start; sleep 2; echo end' & sleep 1; echo "saw start?"; wait
# EXPECTED: start ko'rinadi
```
Agar qisman chiqish darhol paydo bo'lsa — done.

## Agar hali ham ishlamasa
- `strace -e write` bilan yozish vaqtini tekshir.
- `python3 -c 'import sys; print(sys.stdout.isatty(), sys.stdout.encoding)'`
- flush=True qo'sh yoki logging modulini unbuffered qil.
- Docs: https://docs.python.org/3/using/cmdline.html#-u

## Sources + confidence
- [SRC:https://docs.python.org/3/using/cmdline.html#cmdoption-u 2026-11] -u / PYTHONUNBUFFERED force unbuffered.
- [SRC:https://docs.python.org/3/library/sys.html] stdout block-buffered if not interactive.
- [SANDBOX] 2026-11-13 Python 3.10.21: timeout 2 without -u → no "hello"; with -u → "hello" printed. stdbuf works for bash but not always python.
- Confidence: 95% (docs + local repro). 100% emas, chunki har dastur o'z buferini o'rnatishi mumkin.
