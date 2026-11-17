---
name: linux-case-sensitive-fs-modulenotfounderror-or-cannot-find-module-wrong-case-import-require
description: Linux (case-sensitive FS) da Python import yoki Node require/import fayl nomi case mos kelmasa ModuleNotFoundError yoki Cannot find module beradi. Windows/macOS da ishlaydi, Linux/CI da yo'q. ls -la bilan haqiqiy nomni tekshir, importni moslashtir.
id: linux-case-sensitive-fs-modulenotfounderror-or-cannot-find-module-wrong-case-import-require
type: playbook
stack: Python 3.10.21 + Node.js v20.20.2 on Linux (ext4 case-sensitive)
confirmed_on: 2026-11-17
confidence: high (reproduced in sandbox + official docs)
triggers:
  - ModuleNotFoundError No module named 'hello' but Hello.py exists
  - Cannot find module './hello' case mismatch Linux
  - works on Windows but fails on Linux import case
  - MODULE_NOT_FOUND wrong case filename
  - import Hello fails ModuleNotFoundError case sensitive
  - require('./File') Cannot find module File.js is file.js
  - case sensitive filesystem import error
  - Python ModuleNotFoundError on Linux but not local Mac
  - Node Cannot find module case difference
  - ls shows Hello.py but import hello fails
  - import Hello fails but Hello.py exists
  - Hello.py exists ModuleNotFoundError hello
related:
  - python-filenotfounderror-open-relative-path-fails-because-cwd-differs-from-script-dir-use-path-file-parent
  - node-esm-cjs-mismatch-import-outside-module-or-require-not-defined
  - python-attempted-relative-import-with-no-known-parent-package-run-as-module
---

# Linux case-sensitive FS: import/require case mos kelmasa ModuleNotFoundError / Cannot find module

## TL;DR
Simptom: `import hello` yoki `require('./hello')` ModuleNotFoundError / Cannot find module beradi, lekin `Hello.py` / `Hello.js` mavjud (yoki aksincha).
Sabab: Linux FS case-sensitive; import nomi fayl nomi bilan harf-harf mos kelishi shart. Windows/macOS ko'pincha case-insensitive.
Birinchi buyruq: `ls -la` (yoki `ls -l`) papkada haqiqiy fayl nomini ko'r.
Done: import/require haqiqiy case bilan mos, `python3 -c "import Hello"` yoki `node -e "require('./Hello')"` muvaffaqiyatli.

## Qachon ishlatish / ishlatmaslik
Ishlat: ModuleNotFoundError yoki "Cannot find module './xxx'" Linux/CI/sandbox da, lokal (Windows/Mac) da ishlaydi, yoki fayl nomi shubhali case.
Ishlatma: fayl umuman yo'q (ls da ko'rinmaydi), package node_modules da yo'q, yoki relative path noto'g'ri (boshqa skill).

## Mental model (nima uchun)
[SANDBOX] Linux ext4 va ko'p server FS case-sensitive: `Hello.py` ≠ `hello.py`. Python import machinery va Node module resolution fayl nomini aynan qidiradi. Windows/macOS default case-insensitive, shuning uchun "works on my machine". [SRC:https://docs.python.org/3/reference/import.html @ 3.14] [SRC:https://nodejs.org/learn/manipulating-files/working-with-different-filesystems @ latest]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: ModuleNotFoundError: No module named 'xxx' yoki Error: Cannot find module './xxx'.
   EXPECTED: xato bor. Agar boshqa xato (SyntaxError, circular) — boshqa skill.

2. Papkada haqiqiy nomni ko'r: `ls -la` (yoki `ls -l *.py *.js`).
   EXPECTED: fayl ko'rinadi, lekin case farq qiladi (masalan Hello.py, import hello).
   Agar yo'q — fayl yo'q yoki noto'g'ri papka. [SANDBOX]

3. Case mosligini tekshir: `python3 -c "import sys; print([f for f in __import__('os').listdir('.') if f.lower() == 'hello.py'])"` yoki oddiy `ls`.
   EXPECTED: haqiqiy nom chiqadi.

4. To'g'ri case bilan sinab ko'r: `python3 -c "import Hello"` yoki `node -e "require('./Hello.js')"` (to'g'ri nom bilan).
   EXPECTED: "ok" yoki hech xato yo'q. Agar hali ham yo'q — boshqa sabab (cwd, path).

5. Agar package bo'lsa: `find . -iname 'hello.py'` yoki `find . -name 'Hello.py'`.
   EXPECTED: to'g'ri case topiladi.

## Fix per cause
- Noto'g'ri case import: import yoki require dagi nomni `ls` dagi haqiqiy nomga o'zgartir.
  Misol (Python):
  ```
  # Noto'g'ri (Linux da):
  # import hello  # Hello.py bo'lsa
  # To'g'ri:
  import Hello
  ```
  Node:
  ```
  // require('./hello')  # Hello.js bo'lsa
  require('./Hello')
  ```
- Fayl nomini o'zgartirish (agar xohlasang): `mv Hello.py hello.py` (lekin boshqa joylarda ham yangila).
- Tekshirish: qayta import qil, xato yo'qolishi kerak.

## Where agents go wrong (>=3)
1. "pip install" yoki "npm install" qiladi — fayl lokal, package emas.
2. Case ni e'tiborsiz qoldirib, faqat path yoki cwd ni tekshiradi.
3. Windows da ishlaganini ko'rib, Linux da "bug" deb o'ylaydi, kodni o'zgartirmaydi.
4. `find . -name` o'rniga case-sensitive qidiruv qiladi, topilmaydi.

## Edge cases (>=2)
1. Papka nomi ham case farq qiladi: `import package.module` da `Package/` papka.
2. ESM da extension majburiy: `import './Hello.js'` (case + .js).
3. PYTHONCASEOK env (Windows) Linux da ishlamaydi; doim aniq case.

## Done criteria (proving commands)
- `ls -la` haqiqiy nomni ko'rsatadi.
- To'g'ri case bilan: `python3 -c "import Hello; print('ok')"` → ok (xato yo'q).
- Noto'g'ri case bilan: `python3 -c "import hello"` → ModuleNotFoundError (tasdiqlash uchun).
- Node uchun xuddi shunday `node -e "require('./Hello'); console.log('ok')"`.

## If still failing
- cwd tekshir: `pwd` va script joyi.
- Relative path: `__file__` yoki import.meta.url.
- Circular import yoki boshqa: boshqa skillga o't.
- `python3 -c "import importlib.util; print(importlib.util.find_spec('Hello'))"` None bo'lsa — topilmadi.

## Sources + confidence
- [SANDBOX] Repro: Hello.py + `import hello` → ModuleNotFoundError; `import Hello` → ok. Node xuddi shunday.
- [SRC:https://docs.python.org/3/reference/import.html @ Python 3.14] ModuleNotFoundError if named module cannot be found (case-sensitive on POSIX).
- [SRC:https://nodejs.org/learn/manipulating-files/working-with-different-filesystems @ Node latest] Case sensitivity of filesystems; do not assume case-insensitive.
- [SRC:https://nodejs.org/docs/latest/api/modules.html @ v20] Module caching caveats on case-insensitive FS.
Confidence: high — sandbox measured, official docs match behavior.
