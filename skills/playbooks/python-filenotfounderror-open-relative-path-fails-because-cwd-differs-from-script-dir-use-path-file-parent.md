---
name: python-filenotfounderror-open-relative-path-fails-because-cwd-differs-from-script-dir-use-path-file-parent
description: open("file.txt") yoki relative Path FileNotFoundError beradi chunki cwd script papkasidan farq qiladi (bash tool, python /path/script.py). Path(__file__).parent ishlat.
id: python-filenotfounderror-open-relative-path-fails-because-cwd-differs-from-script-dir-use-path-file-parent
type: playbook
stack: Python 3.10.21 (pathlib + os)
confirmed_on: 2026-11-15
confidence: high (reproduced in sandbox + official docs)
triggers:
  - FileNotFoundError No such file or directory data.txt
  - open("file.txt") fails relative path
  - FileNotFoundError when running python script from different directory
  - cwd is not script directory FileNotFoundError
  - relative path open fails in bash tool
  - python script cannot find file next to it
  - [Errno 2] No such file or directory: 'config.json'
  - open relative path wrong cwd
  - script works when cd to dir but not from elsewhere
  - FileNotFoundError __file__ not used
related:
  - coding/patterns/HardcodedFilePathsInsteadOfUsingPathlibOrOsPathJoinForPortability.md
  - coding/patterns/PythonUsedOsPathJoinOrStringConcatenationForPathsInsteadOfPathlibPathReducingReadabilityAndSafety.md
---

# FileNotFoundError: relative open() ishlamaydi chunki cwd script papkasidan farq qiladi — Path(__file__).parent ishlat

## TL;DR
Simptom: `open("data.txt")` yoki `Path("data.txt")` FileNotFoundError beradi, fayl script bilan bir papkada bo'lsa ham. Sabab: current working directory (cwd) script joylashgan papka emas (bash tool, `python /path/script.py`, cron va h.k.). Birinchi buyruq: `python3 -c "import os; print(os.getcwd()); print(__file__ if '__file__' in dir() else 'N/A')"` yoki script ichida. Done: `Path(__file__).parent / "data.txt"` bilan o'qiladi, cwd qayerda bo'lsa ham.

## Qachon ishlatish / ishlatmaslik
Ishlat: script yoki modul ichida relative `open()`, `Path("rel")`, `os.path.join("data", "file")` ishlatilganda FileNotFoundError chiqsa, va fayl haqiqatan script yonida yoki nisbiy joyda bo'lsa. Ayniqsa bash tool, CI, scheduled job, boshqa papkadan `python script.py` chaqirilganda.
Ishlatma: fayl haqiqatan yo'q, absolute path ishlatilayotgan, yoki user input path bo'lsa. Yoki cwd ni ataylab o'zgartirgan bo'lsang va shuni kutayotgan bo'lsang.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/pathlib.html @ 3.15, 2026-11] Relative path (string yoki Path("foo")) har doim `os.getcwd()` ga nisbatan hisoblanadi, script joyiga emas. `__file__` — bu scriptning o'z absolute (yoki relative) pathi. `Path(__file__).parent` — script papkasi. Bash tool har chaqiruvda yangi shell, cwd odatda session/work papkasi. Agentlar "fayl script yonida" deb `open("data.txt")` yozadi, lekin tool boshqa papkadan ishga tushiradi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: `FileNotFoundError: [Errno 2] No such file or directory: 'data.txt'` — relative ekanligini ko'r. EXPECTED: path relative (slash yo'q yoki ./ bilan). Absolute bo'lsa → boshqa sabab (haqiqatan yo'q).

2. cwd va script joyini solishtir:
   ```bash
   python3 -c "import os; print('cwd:', os.getcwd())"
   # script ichida yoki:
   python3 -c "import os; print(os.path.abspath('data.txt')); print(os.path.exists('data.txt'))"
   ```
   EXPECTED: cwd script papkasidan farq qilsa va exists False → 3-ga o't. [SANDBOX: /tmp dan /tmp/test_script_dir/script.py ishga tushirganda False]

3. Fayl haqiqatan script yonida bormi:
   ```bash
   ls -la /path/to/script_dir/data.txt
   # yoki
   python3 -c "from pathlib import Path; print((Path('/path/to/script.py').parent / 'data.txt').exists())"
   ```
   EXPECTED: True. Agar False → fayl yo'q yoki noto'g'ri nom.

4. `__file__` mavjudmi (interactive REPL da yo'q): script ichida `print(__file__)` . EXPECTED: script path. Agar NameError → bu REPL yoki -c, `__file__` yo'q.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): relative path cwd ga bog'liq.  
Fix (copy-paste):
```python
from pathlib import Path

script_dir = Path(__file__).resolve().parent   # resolve() symlink va .. uchun
data_path = script_dir / "data.txt"
content = data_path.read_text(encoding="utf-8")
# yoki open(data_path)
```
Tekshir: `python3 /boshqa/papka/script.py` ishlashi kerak.

Agar os.path:
```python
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(script_dir, "data.txt")
```

Sabab 2: fayl boshqa joyda (subdir). `script_dir / "subdir" / "data.txt"` qil.

Sabab 3: user bergan path yoki absolute. `Path(user_path).expanduser().resolve()` yoki cwd ga nisbatan qoldir.

## Agentlar qayerda xato qiladi
1. Har doim `open("file.txt")` yozib, "script yonida" deb o'ylash — cwd ni tekshirmaydi.
2. `os.chdir(os.path.dirname(__file__))` qilib keyin relative ishlatish — ishlaydi, lekin keyingi kodga ta'sir qiladi, va bash tool da chdir persist qilmaydi.
3. `__file__` ni ishlatmasdan `Path.cwd() / "file"` — bu ham cwd.
4. Faqat `ls` qilib "fayl bor" deb, lekin qaysi papkadan ekanini ko'rmaydi.

## Edge cases
1. Script `python -m package.module` bilan ishga tushirilsa, `__file__` baribir ishlaydi, lekin package ichida bo'lishi mumkin. [SANDBOX tested with direct path]
2. Frozen app (PyInstaller) da `__file__` boshqacha bo'lishi mumkin — `sys._MEIPASS` ishlat. [not verified]
3. Symlink orqali ishga tushirilsa, `Path(__file__).resolve().parent` to'g'ri real papkani beradi.
4. Interactive `python` da `__file__` yo'q — faqat scriptlar uchun.

## Done criteria
```bash
# Scriptni boshqa papkadan ishga tushirib tekshir
cd /tmp
python3 /path/to/script.py
# FileNotFoundError yo'q, fayl o'qilgan bo'lishi kerak
# Va:
python3 -c "
from pathlib import Path
p = Path('/path/to/script.py').parent / 'data.txt'
print(p.exists(), p.is_file())
"
# True True
```
Agar xato qaytsa (mutation: `open("data.txt")` qaytarib qo'y) — done criteria uni ushlashi kerak.

## Agar hali ham ishlamasa
- Fayl permission: `ls -l data.txt`, `chmod` kerakmi?
- Encoding: `read_text(encoding="utf-8")` yoki `errors="replace"`.
- Bu skill emas, boshqa sabab (haqiqatan yo'q fayl, noto'g'ri nom, case-sensitive).
- search_skills("FileNotFoundError") qayta qil.

## Manbalar + ishonch
- [SRC:https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.parent @ current docs, 2026-11-15] Path.parent, / operator
- [SRC:https://docs.python.org/3/library/os.html#os.getcwd @ 3.10+] cwd
- [SANDBOX] Python 3.10.21: /tmp dan /tmp/test_script_dir/script.py da open("data.txt") FileNotFoundError; Path(__file__).parent / "data.txt" ishladi.
- Ishonch: high (o'lchangan, docs mos)
