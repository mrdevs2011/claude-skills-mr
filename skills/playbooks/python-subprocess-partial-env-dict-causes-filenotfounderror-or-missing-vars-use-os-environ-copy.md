---
name: python-subprocess-partial-env-dict-causes-filenotfounderror-or-missing-vars-use-os-environ-copy
description: subprocess.run/Popen with env={partial dict} replaces entire environment, missing PATH causes FileNotFoundError on relative commands; use os.environ.copy() then update. Triggers on FileNotFoundError when adding one env var.
id: python-subprocess-partial-env-dict-causes-filenotfounderror-or-missing-vars-use-os-environ-copy
type: playbook
stack: Python 3.10.21 subprocess (Linux)
confirmed_on: 2026-11-16
confidence: high (reproduced in sandbox)
triggers:
  - FileNotFoundError: [Errno 2] No such file or directory
  - subprocess.run env partial dict
  - missing PATH in subprocess env
  - os.environ.copy() for subprocess
  - env={'VAR': 'value'} causes command not found
  - child process missing environment variables
  - subprocess FileNotFoundError when setting env
  - how to pass extra env var without losing PATH
  - subprocess env replaces all variables
  - FileNotFoundError mycmd.sh with env
related:
  - python-subprocess-run-string-command-without-shell-true-raises-filenotfounderror-use-list-or-shlex
---

# subprocess partial env dict FileNotFoundError yoki missing vars — os.environ.copy ishlat

## TL;DR
Simptom: subprocess.run(['cmd'], env={'MYVAR':'1'}) da FileNotFoundError: [Errno 2] No such file or directory: 'cmd' yoki child da PATH/HOME yo'q. Sabab: env berilsa butun environment o'rnini bosadi, PATH yo'qoladi. Birinchi buyruq: env = os.environ.copy(); env['MYVAR']='1'; subprocess.run(..., env=env). Done: buyruq topiladi, MYVAR child da bor.

## Qachon ishlatish / ishlatmaslik
Ishlat: subprocess.run/Popen da bitta yoki bir nechta env var qo'shish/o'zgartirish kerak bo'lganda, relative command (mycmd, python3, ls) FileNotFoundError bersa yoki child os.environ.get('PATH') None bo'lsa.
Ishlatma: env=None (default inherit), yoki absolute path ishlatayotgan bo'lsang va boshqa var kerak bo'lmasa, yoki shell=True bilan string (lekin xavfli).

## Mental model (nima uchun)
[SANDBOX] subprocess.run(env=dict) berilsa, child faqat shu dict ni oladi, parent os.environ ni inherit qilmaydi. PATH yo'q bo'lsa, relative executable qidirilmaydi → FileNotFoundError. Docs: "these are used instead of the default behavior of inheriting the current process’ environment." [SRC:https://docs.python.org/3/library/subprocess.html 2026-11-16]. Windows da SystemRoot ham kerak. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: FileNotFoundError: [Errno 2] No such file or directory: 'commandname' (relative). EXPECTED: ha. Agar absolute path bo'lsa yoki boshqa xato — boshqa skill.
   Agar "No such file" — 2.

2. Kodni tekshir: env= berilganmi? Agar env={'ONLY':'this'} yoki partial — sabab shu. EXPECTED: partial dict.

3. Child env ni tekshir: python3 -c "import os; print(os.environ.get('PATH'))" env bilan. EXPECTED: None yoki yo'q.

4. Right variant: os.environ.copy() ishlat, keyin update. EXPECTED: PATH bor, command ishlaydi.

## Fix per cause
- Partial env: har doim os.environ.copy() dan boshla.
Copy-paste:
```python
import os, subprocess
env = os.environ.copy()
env['MYVAR'] = 'hello'
r = subprocess.run(['mycmd.sh'], env=env, capture_output=True, text=True, cwd='/tmp')
print(r.stdout, r.returncode)  # ishlaydi
```
Re-check: r.returncode == 0, stdout expected.

- Absolute path ishlatish (ixtiyoriy): subprocess.run(['/usr/bin/python3', ...], env=partial) ba'zan ishlaydi, lekin boshqa vars (HOME, LANG) yo'qolishi mumkin.

## Where agents go wrong (>=3)
1. env={'MYVAR': '1'} ni to'g'ridan-to'g'ri berib, PATH yo'qolishini e'tiborsiz qoldiradi — FileNotFoundError.
2. os.environ['MYVAR'] = '1' ni parent da o'zgartirib, child ga ta'sir qiladi deb o'ylaydi (lekin env= berilmasa inherit, berilsa almashtiradi).
3. shell=True bilan string ishlatib, env expansion ni kutadi — lekin partial env da $PATH ham yo'q.
4. Faqat yangi var qo'shish uchun copy qilmaslik.

## Edge cases (>=2)
1. Absolute path + partial env: command topiladi, lekin child da HOME/LANG yo'q — ba'zi programlar crash.
2. Windows: SystemRoot yo'q bo'lsa side-by-side assembly ishlamaydi (docs note). Linux da PATH asosiy.
3. env=None (default): inherit to'liq, o'zgartirish yo'q.
4. Bytes env (os.environb) POSIX da.

## Done criteria (proving commands)
```bash
cd /tmp
echo '#!/bin/bash
echo "hello from script"' > mycmd.sh
chmod +x mycmd.sh
python3 - << 'PY'
import os, subprocess
# wrong
try:
    subprocess.run(['mycmd.sh'], env={'FOO':'bar'}, cwd='/tmp')
    print("WRONG: should have failed")
except FileNotFoundError:
    print("WRONG: FileNotFoundError as expected")
# right
env = os.environ.copy()
env['FOO'] = 'bar'
r = subprocess.run(['/tmp/mycmd.sh'], env=env, capture_output=True, text=True)
assert r.returncode == 0 and 'hello from script' in r.stdout
print("RIGHT: PASS")
PY
```
RIGHT: PASS chiqishi kerak.

## If still failing
- Absolute path ishlat: which mycmd; /full/path.
- env dict da string bo'lishi shart (int emas).
- shell=True faqat ishonchli input uchun.
- [SRC:https://docs.python.org/3/library/subprocess.html] env must provide required vars.

## Sources + confidence
[SRC:https://docs.python.org/3/library/subprocess.html@3.15 2026-11-16] env replaces inheritance; note on required vars.
[SANDBOX] Python 3.10.21: partial env → FileNotFoundError on 'mycmd.sh'; os.environ.copy() → success, stdout "hello from script". High confidence.
