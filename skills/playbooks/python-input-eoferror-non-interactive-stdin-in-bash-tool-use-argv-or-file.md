---
name: python-input-eoferror-non-interactive-stdin-in-bash-tool-use-argv-or-file
description: Python input() yoki sys.stdin.readline() bash tool (non-TTY) da EOFError beradi chunki stdin closed. Argv, fayl yoki pipe ishlat. Triggers on EOFError when reading a line, input() fails in tool.
id: python-input-eoferror-non-interactive-stdin-in-bash-tool-use-argv-or-file
type: playbook
stack: Python 3.10.21 + bash tool (non-interactive, isatty=False)
confirmed_on: 2026-11-13
confidence: high (reproduced in sandbox, official docs)
triggers:
  - EOFError: EOF when reading a line
  - input() fails in bash tool
  - non-interactive stdin
  - sys.stdin.isatty() False
  - sys.stdin.isatty False
  - script hangs or EOF on input()
  - python input() in tool call
  - cannot read user input from terminal in agent
  - EOF when reading a line in python -c
  - interactive script fails in sandbox
  - bash tool no stdin for input()
related:
  - command-output-fully-buffered-when-not-a-tty-delayed-or-missing-until-exit-or-kill-use-python-u-stdbuf
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
---

# Python input() non-interactive bash tool da EOFError — argv/fayl/pipe ishlat

## TL;DR
Simptom: python script yoki -c da input() yoki readline() "EOFError: EOF when reading a line" beradi, yoki kutadi.
Sabab: bash tool shell non-interactive, stdin TTY emas (isatty=False), EOF darhol.
Birinchi buyruq: `python3 -c 'import sys; print(sys.stdin.isatty())'` — False chiqadi.
Done: input o'rniga sys.argv yoki open(fayl) ishlatilganda xato yo'q, natija to'g'ri.

## Qachon ishlatish / ishlatmaslik
Ishlat: agent yozgan Python script input()/raw_input()/sys.stdin.read() ishlatadi va bash/tool chaqiruvida EOFError yoki hang.
Ishlatma: haqiqiy interactive terminalda (user o'zi ishga tushirsa), yoki allaqachon argv/fayldan o'qiyotgan bo'lsa, yoki Node/boshqa til.

## Mental model (nima uchun)
[SANDBOX] Bash tool har safar yangi non-interactive shell ishga tushiradi, stdin pipe yoki closed, isatty()=False. input() EOF o'qisa EOFError ko'taradi. [SRC:https://docs.python.org/3/library/functions.html#input @3.15] "When EOF is read, EOFError is raised." Interactive dasturlar tool muhitida ishlamaydi; argument yoki fayl orqali berish kerak. [REPO:instruction.md tool non-interactive]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini tekshir: "EOFError: EOF when reading a line" yoki "EOF when reading a line".
   EXPECTED: aynan shu. Agar boshqa xato — boshqa skill.
   Agar yo'q, lekin script to'xtamaydi — 2.

2. stdin TTY ekanligini tekshir:
   ```
   python3 -c 'import sys; print("isatty:", sys.stdin.isatty())'
   ```
   EXPECTED: isatty: False [SANDBOX]
   Agar True — boshqa muammo (haqiqiy terminal).

3. Oddiy input() sinov:
   ```
   python3 -c 'print(input("test: "))'
   ```
   EXPECTED: Traceback ... EOFError: EOF when reading a line [SANDBOX]
   Agar chiqsa — tasdiqlandi.

4. Argv alternativ sinov (ishlaydi):
   ```
   python3 -c 'import sys; print(sys.argv[1] if len(sys.argv)>1 else "missing")' "hello"
   ```
   EXPECTED: hello

5. Fayl alternativ:
   ```
   echo "fromfile" > /tmp/in.txt && python3 -c 'print(open("/tmp/in.txt").read().strip())'
   ```
   EXPECTED: fromfile

## Fix per cause
- input() o'rniga sys.argv ishlat:
  ```python
  import sys
  value = sys.argv[1] if len(sys.argv) > 1 else "default"
  print(value)
  ```
  Re-check: yuqoridagi 4-qadam.

- Ko'p qatorli yoki katta input uchun fayl:
  ```python
  with open("input.txt") as f:
      data = f.read()
  ```
  Yoki bash: `python3 script.py < input.txt` (lekin tool da heredoc mumkin).

- Pipe: `echo "data" | python3 -c 'import sys; print(sys.stdin.read())'`
  EXPECTED: data

- Agar haqiqiy interactive kerak bo'lsa — tool emas, user kompyuterida (cmc) ishlat, lekin bu skill doirasida emas.

## Where agents go wrong (>=3)
1. input() ni tool ichida ishlatib, "user kiritadi" deb o'ylaydi — hech kim kiritmaydi, EOF.
2. try/except EOFError qilib bo'sh string oladi, lekin ildizni tuzatmaydi — script noto'g'ri ishlaydi.
3. Heredoc yozadi lekin python -c da noto'g'ri quote qiladi, xato.
4. sys.stdin.isatty() tekshirmaydi, taxmin qiladi.

## Edge cases (>=2)
1. Heredoc bilan ishlaydi: `python3 -c 'print(input())' <<EOF\nhello\nEOF` — "hello" chiqadi [SANDBOX]. Lekin agent odatda yozmaydi.
2. Ko'p input() chaqiruvi — birinchi EOF, keyingilari ham. Argv yoki bir fayldan o'qish yaxshiroq.
3. Binary yoki encoding muammo — ochiq text mode ishlat.

## Done criteria (proving commands)
- `python3 -c 'import sys; assert not sys.stdin.isatty(); print("ok")'` → ok
- Script yoki -c argv bilan ishlaydi, EOFError yo'q, kutilgan output.
- Asl input() versiyasi xato beradi, tuzatilgani yo'q.

## If still failing
- Scriptni faylga yoz, `python3 script.py arg1 arg2` chaqir.
- Katta data uchun /tmp/ fayl ishlat, open() bilan o'qi.
- Boshqa xato (ImportError va h.k.) — alohida skill.
- Hali hang bo'lsa — timeout bilan tekshir, yoki buffered skill ga qara.

## Sources + confidence
- [SANDBOX] reproductions: isatty False, input() EOFError, argv/file success.
- [SRC:https://docs.python.org/3/library/functions.html#input] "When EOF is read, EOFError is raised." (docs.python.org, version ~3.15, 2026)
- [SRC:https://docs.python.org/3/library/sys.html#sys.stdin] stdin for interactive input.
- Confidence: high — measured in this sandbox + official docs. Untested on real TTY user terminal (mark not verified there).
