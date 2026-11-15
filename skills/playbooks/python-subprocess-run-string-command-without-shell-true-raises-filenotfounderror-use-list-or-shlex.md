---
name: python-subprocess-run-string-command-without-shell-true-raises-filenotfounderror-use-list-or-shlex
description: subprocess.run("echo hello") yoki string buyruq shell=False da FileNotFoundError: No such file or directory: 'echo hello' beradi. List yoki shell=True / shlex.split ishlat.
id: python-subprocess-run-string-command-without-shell-true-raises-filenotfounderror-use-list-or-shlex
type: playbook
stack: Python 3.10.21 (subprocess)
confirmed_on: 2026-11-15
confidence: high (reproduced in sandbox + official docs)
triggers:
  - FileNotFoundError No such file or directory 'echo hello'
  - subprocess.run string command FileNotFoundError
  - [Errno 2] No such file or directory: 'ls -la'
  - subprocess.run("command with args") fails
  - OSError No such file or directory when running shell command in Python
  - python subprocess string not split into args
  - subprocess.run without shell=True string error
  - command string treated as program name subprocess
  - FileNotFoundError subprocess.run "git status"
  - bash command as string in subprocess.run crashes
related:
  - python-filenotfounderror-open-relative-path-fails-because-cwd-differs-from-script-dir-use-path-file-parent
  - shell-script-cannot-execute-required-file-not-found-due-to-crlf-in-shebang
---

# subprocess.run("buyruq args") FileNotFoundError beradi — list yoki shell=True ishlat

## TL;DR
Simptom: `subprocess.run("echo hello")` yoki `subprocess.run("ls -la")` FileNotFoundError: [Errno 2] No such file or directory: 'echo hello' chiqaradi. Sabab: shell=False (default) da string butunlay program nomi deb olinadi, args bo'linmaydi. Birinchi buyruq: xato matnida quote ichidagi butun stringni ko'r. Done: `subprocess.run(["echo", "hello"])` yoki `shell=True` ishlaydi, stdout to'g'ri.

## Qachon ishlatish / ishlatmaslik
Ishlat: subprocess.run / Popen / call / check_output ga string buyruq (bo'shliq bilan) berilganda FileNotFoundError yoki OSError chiqsa, va program haqiqatan PATH da bor bo'lsa.
Ishlatma: program nomi noto'g'ri yoki o'rnatilmagan (haqiqatan yo'q), yoki list allaqachon to'g'ri ishlatilgan. Yoki Windows da boshqa sabablar.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/subprocess.html#subprocess.run @ 3.10+, 2026-11] `shell=False` (default) da `args` string bo'lsa, u butunlay executable nomi hisoblanadi (args ajratilmaydi). Shell stringni parse qiladi, Python emas. Shuning uchun "echo hello" nomli fayl qidiriladi. [SANDBOX: python3 da subprocess.run("echo hello") → FileNotFoundError 'echo hello']

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: `FileNotFoundError: [Errno 2] No such file or directory: 'ls -la'` — quote ichida bo'shliq bormi? EXPECTED: ha, string butun buyruq. Agar faqat program nomi ('ls') → program yo'q yoki PATH.

2. Qanday chaqirilganini tekshir (kodda):
   ```python
   import subprocess
   # xato variant
   print(subprocess.run("echo hello", capture_output=True))  # xato
   ```
   EXPECTED: FileNotFoundError. Agar list bo'lsa va baribir xato → boshqa sabab.

3. Program borligini tekshir:
   ```bash
   which echo
   which ls
   ```
   EXPECTED: /usr/bin/echo kabi. Yo'q bo'lsa → o'rnat.

4. shell=True yoki list bilan sinab ko'r (quyida).

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): string + shell=False.  
Fix 1 (tavsiya, xavfsizroq): list of args
```python
import subprocess
r = subprocess.run(["echo", "hello"], capture_output=True, text=True, check=True)
print(r.stdout.strip())  # hello
```
Tekshir: yuqoridagi ishlashi kerak.

Fix 2: shell=True (faqat ishonchli string uchun, injection xavfi bor)
```python
r = subprocess.run("echo hello", shell=True, capture_output=True, text=True, check=True)
print(r.stdout.strip())
```

Fix 3: murakkab string uchun shlex
```python
import shlex, subprocess
cmd = "ls -la /tmp"
r = subprocess.run(shlex.split(cmd), capture_output=True, text=True)
```

## Agentlar qayerda xato qiladi
1. Shell dan copy-paste qilib `subprocess.run("ls -la")` yozadi, shell=True unutadi.
2. `shell=True` qo'shadi lekin user input ni sanitizatsiya qilmaydi (security).
3. List qiladi lekin bo'shliqli path ni bitta element qilmaydi: `["ls", "-la", "file with space"]` to'g'ri, lekin qo'yib qo'yadi.
4. Xato "program yo'q" deb o'ylab which yoki apt qiladi, aslida string muammosi.

## Edge cases
1. Windows da string + shell=False boshqacha ishlashi mumkin (cmd). [not verified in this sandbox]
2. Args ichida quote yoki special char bo'lsa, list ishlat, shell=True da escaping qiyin.
3. `executable` argumenti bilan override qilish mumkin, lekin kamdan-kam kerak.
4. Python <3.5 da run() yo'q, Popen/call ishlat.

## Done criteria
```bash
python3 -c '
import subprocess
r = subprocess.run(["echo", "test-ok"], capture_output=True, text=True, check=True)
assert r.stdout.strip() == "test-ok"
print("OK")
'
# OK chiqishi kerak
# Mutation: string qaytarib qo'yilsa FileNotFoundError qaytadi
```

## Agar hali ham ishlamasa
- Program haqiqatan yo'q: `which` / `type` / PATH tekshir.
- Permission: executable bit.
- Bu skill emas, boshqa (cwd, env, timeout).
- search_skills("subprocess FileNotFoundError") qayta.

## Manbalar + ishonch
- [SRC:https://docs.python.org/3/library/subprocess.html#subprocess.Popen @ 3.10 docs, 2026-11-15] shell=False da string = program name only
- [SRC:https://docs.python.org/3/library/subprocess.html#subprocess.run]
- [SANDBOX] Python 3.10.21: subprocess.run("echo hello") → FileNotFoundError: [Errno 2] No such file or directory: 'echo hello'; ["echo", "hello"] va shell=True ishladi.
- Ishonch: high (o'lchangan, docs mos)
