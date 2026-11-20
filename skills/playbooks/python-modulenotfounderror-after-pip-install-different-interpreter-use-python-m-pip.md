---
name: python-modulenotfounderror-after-pip-install-different-interpreter-use-python-m-pip
description: ModuleNotFoundError: No module named XXX after pip install Successfully installed. pip va python different interpreter. Use python -m pip. sys.executable vs pip Location mismatch.
id: python-modulenotfounderror-after-pip-install-different-interpreter-use-python-m-pip
type: playbook
stack: Python 3.10+ (any, multiple interpreters / venv)
confirmed_on: 2026-11-20
confidence: high (reproduced in sandbox [SANDBOX]; official docs [SRC:https://docs.python.org/3/installing/index.html @2026-11])
triggers:
  - ModuleNotFoundError: No module named cowsay
  - Successfully installed but ModuleNotFoundError
  - pip show finds it but import fails
  - different interpreter pip python
  - ModuleNotFoundError: No module named
  - pip install success but import fails
  - No module named after pip install
  - python cannot find package that pip installed
  - ModuleNotFoundError despite Successfully installed
  - different python and pip
  - sys.executable not matching pip Location
  - use python -m pip instead of pip
  - paketlarni o'rnatdim lekin import ishlamayapti
  - pip va python boshqa-boshqa
related:
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
  - python-pip-externally-managed-environment-error-use-venv-or-pipx-or-apt
  - linux-case-sensitive-fs-modulenotfounderror-or-cannot-find-module-wrong-case-import-require
---

# ModuleNotFoundError after pip install — different interpreter; use python -m pip

## TL;DR
Simptom: `pip install cowsay` "Successfully installed" deyapti, lekin `python -c "import cowsay"` ModuleNotFoundError: No module named 'cowsay'.
Sabab: `pip` boshqa Python'ga o'rnatgan (venv yoki boshqa versiya), `python` esa boshqasini ishlatayapti.
Birinchi buyruq: `python -c "import sys; print(sys.executable)"` va `python -m pip show cowsay` (yoki `which python` vs `which pip`).
Done: `python -m pip install cowsay` dan keyin import ishlaydi, Location sys.executable ning site-packages ichida.

## Qachon ishlatish / ishlatmaslik
Ishlat: Agent `pip install foo` qiladi, keyin `python` yoki `python3` bilan import qilganda ModuleNotFoundError chiqsa, ayniqsa bir nechta Python/venv bor bo'lsa yoki tool chaqiruvlarida path farq qilsa.
Ishlatma: Paket umuman o'rnatilmagan (pip show ham topmaydi), yoki case mismatch (linux-case skill), yoki relative import / circular (boshqa skilllar), yoki faqat venv activation persist qilmasa (related skill). Agar `python -m pip show` ham topmasa — oddiy o'rnatish.

## Mental model (nima uchun)
[SANDBOX] Har bir Python interpreter o'zining site-packages papkasiga ega. `pip` shell'da birinchi topilgan pip (PATH bo'yicha), u o'z Python'iga o'rnatadi. `python` esa boshqasini ishga tushirishi mumkin. [SRC:https://docs.python.org/3/installing/index.html] Rasmiy tavsiya: doim `python -m pip install` (yoki `python3 -m pip`) — bu shu interpreter'ning pip'ini ishlatadi, paket to'g'ri joyga tushadi. sys.executable ishlayotgan interpreter'ning to'liq yo'lini ko'rsatadi; pip show Location esa o'rnatilgan joyni. Ular mos kelmasa — mismatch.

## Diagnosis tree (arzonidan qimmatiga)
1. Qaysi python ishlayapti:
   ```
   python3 -c "import sys; print(sys.executable)"
   ```
   EXPECTED: /usr/local/bin/python3 yoki /tmp/testvenv/bin/python kabi. Yozib ol. [SANDBOX]
2. Shu python bilan paket bormi:
   ```
   python3 -m pip show cowsay
   ```
   EXPECTED: agar "WARNING: Package(s) not found" yoki bo'sh — shu interpreter'da yo'q. Agar Location chiqsa — mos kelishini tekshir (site-packages executable bilan bir xil prefix).
3. Qaysi pip ishlayapti (solishtirish):
   ```
   which python3; which pip; pip --version
   ```
   EXPECTED: agar which pip boshqa yo'lda bo'lsa yoki version boshqa python ko'rsatsa — mismatch. Agar bir xil — 4 ga.
4. Venv ichidami (agar shubha):
   ```
   python3 -c "import sys; print(sys.prefix != sys.base_prefix)"
   ```
   EXPECTED: False (system) yoki True (venv). Agar venv bo'lsa lekin activation yo'qolgan — related skill.
5. Importni to'g'ridan-to'g'ri sinab:
   ```
   python3 -c "import cowsay"
   ```
   EXPECTED: ModuleNotFoundError. Agar ishlasa — boshqa sabab.

## Fix per cause
**Cause: pip va python turli interpreter**
Copy-paste (shu python bilan o'rnat):
```
python3 -m pip install cowsay
python3 -c "import cowsay; print('ok')"
```
Yoki to'liq path bilan: `/tmp/testvenv/bin/python -m pip install cowsay`
Re-check: `python3 -m pip show cowsay` Location ko'rsatadi va import ishlaydi. [SANDBOX]

**Cause: venv activation persist qilmagan (tool chaqiruvlar orasida)**
Related skillni o'qi: to'liq path ishlat yoki bitta buyruqda zanjirla `source venv/bin/activate && python -m pip install ... && python -c "import ..."`.

**Cause: paket nomi farq qiladi (import vs install name)**
`python3 -m pip show` bilan tekshir, yoki `pip index` / PyPI. Masalan ba'zi paketlar import nomi boshqacha.

## Where agents go wrong
1. `pip install` qiladi, keyin darhol `python` deb o'ylaydi bir xil — lekin PATH yoki venv tufayli emas.
2. `sudo pip install` qiladi (systemga tushadi, lekin user python boshqa).
3. Faqat `pip show` qiladi, `python -m pip show` emas — shuning uchun "bor" deyapti, lekin import yo'q.
4. Venv ichida o'rnatgan, keyin system python bilan ishga tushiradi (yoki teskarisi).

## Edge cases
1. Bir nechta python3.10, python3.11 — versioned: `python3.10 -m pip install`.
2. Windows da `py -3 -m pip` yoki `py -m pip`. Linux/macOS da `python3 -m`.
3. `externally-managed-environment` chiqsa — related skill (venv yoki --break-system-packages ehtiyotkorlik bilan).
4. Cache: ba'zan `python3 -m pip install --no-cache-dir`.

## Done criteria (proving commands)
```
python3 -c "import sys; print(sys.executable)"
python3 -m pip show cowsay   # Location executable ning site-packages ichida
python3 -c "import cowsay; print('import ok')"
```
Hammasi muvaffaqiyatli, xato yo'q.

## If still failing
- `python3 -m pip list | grep -i cowsay`
- `python3 -c "import sys; print(sys.path)"` — site-packages borligini tekshir.
- Yangi venv yarat: `python3 -m venv /tmp/freshvenv && /tmp/freshvenv/bin/python -m pip install cowsay && /tmp/freshvenv/bin/python -c "import cowsay"`
- Agar boshqa xato (SyntaxError, Permission) — alohida skill qidir.

## Sources + confidence
- [SANDBOX] Repro: venv'da cowsay o'rnatildi, system python ModuleNotFoundError; system python -m pip install dan keyin ishladi. 2026-11-20.
- [SRC:https://docs.python.org/3/installing/index.html] "python -m pip install SomePackage" rasmiy usul. O'qilgan 2026-11-20.
- Confidence: high — aniq xato matni, real output, rasmiy tavsiya.
