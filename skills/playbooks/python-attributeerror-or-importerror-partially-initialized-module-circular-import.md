---
name: python-attributeerror-or-importerror-partially-initialized-module-circular-import
description: AttributeError/ImportError "partially initialized module ... most likely due to a circular import" — module A imports B while B is still initializing. Fix by moving import inside function or restructure to break cycle.
id: python-attributeerror-or-importerror-partially-initialized-module-circular-import
type: playbook
stack: Python 3.10.21 (official FAQ)
confirmed_on: 2026-11-14
confidence: high (reproduced in sandbox + official docs)
triggers:
  - partially initialized module
  - most likely due to a circular import
  - AttributeError: partially initialized module
  - ImportError: cannot import name from partially initialized module
  - circular import AttributeError
  - partially initialized module has no attribute
  - ImportError cannot import name from partially initialized
  - circular dependency python module
  - module not fully initialized import
  - AttributeError circular import python
related:
  - coding/deps
  - python-venv-activation-does-not-persist-across-separate-bash-tool-calls-use-full-path-or-chain
---

# AttributeError/ImportError: partially initialized module (circular import)

## TL;DR
Simptom: AttributeError: partially initialized module 'X' has no attribute 'Y' (most likely due to a circular import) yoki ImportError: cannot import name 'Y' from partially initialized module 'X' (most likely due to a circular import).
Sabab: A moduli B ni import qiladi, B esa A ni (yoki A ning nomini) A hali to'liq yuklanmagan paytda import qiladi.
Birinchi buyruq: traceback'da import zanjirini ko'r, keyin import ni funksiya ichiga ko'chir.
Done: python a.py "a" yoki kutilgan qiymatni chop etadi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: aniq "partially initialized module" + "circular import" xato matni chiqsa, yoki ikki modul bir-birini top-level import qilsa.
Ishlatma: oddiy ModuleNotFoundError, yoki NameError, yoki circular import bo'lmasa ham AttributeError (masalan typo).

## Mental model (nima uchun)
[SANDBOX][SRC:https://docs.python.org/3/faq/programming.html#what-are-the-best-practices-for-using-import-in-a-module 2026-11-14] Python modulni sys.modules ga qo'yadi, keyin bajarishni boshlaydi. Agar bajarish paytida boshqa modul shu modulni import qilsa, u qisman yuklangan holatda qaytadi. Top-level kod (funksiya tashqarisida) ishlatilsa, atribut hali yo'q. "from X import Y" yanada qattiqroq, chunki Y nomi mavjud bo'lishi shart. Yechim: import ni ishlatiladigan funksiya ichiga ko'chirish (lazy), yoki tsiklni uzish (umumiy qismni alohida modulga).

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi.
   EXPECTED: "partially initialized module" va "circular import" so'zlari bor. Agar yo'q — bu skill emas.

2. Traceback import zanjirini ko'r.
   EXPECTED: a.py import b → b.py import a → a.py ichida b.something. [SANDBOX]

3. Top-level import bormi?
   ```
   grep -n "^import \|^from " a.py b.py
   ```
   EXPECTED: ikkala faylda ham top-level import. Agar funksiya ichida bo'lsa — boshqa sabab.

4. Repro wrong (sandbox da ishlat):
   ```
   python3 a.py
   ```
   EXPECTED: AttributeError: partially initialized module 'b' has no attribute 'fb' (most likely due to a circular import) [SANDBOX]

5. Agar ha — fix ga o't.

## Fix per cause
- Top-level mutual import: import ni funksiya ichiga ko'chir (lazy import).
Copy-paste right:
```python
# a.py
def fa():
    return "a"
def main():
    import b          # ichida
    print(b.fb())
if __name__ == "__main__":
    main()

# b.py
def fb():
    import a          # ichida
    return a.fa()
```
EXPECTED: a.py ishga tushsa "a" chiqadi. [SANDBOX]

- from X import Y tsikli: o'rniga import X ishlat, keyin X.Y, yoki funksiya ichiga.
- Umumiy kodni alohida modulga chiqar (c.py), A va B ikkalasi ham c ni import qilsin.
- Agar kerak bo'lsa: importlib.import_module ni funksiya ichida ishlat.

Re-check:
```
python3 a.py
```
EXPECTED: xato yo'q, kutilgan output.

## Where agents go wrong
1. Import ni topda qoldirib, faqat nom o'zgartiradi — tsikl saqlanadi.
2. from import ni import ga o'zgartiradi, lekin top-levelda qoldiradi — ba'zi hollarda ishlamaydi.
3. Circular deb o'ylamay, "attribute yo'q" deb yangi funksiya yozadi.
4. sys.modules dan o'chirib qayta import qilishga urinadi — vaqtincha, ildiz qoladi.

## Edge cases
1. Package ichida relative import (from . import) — xuddi shu, lekin __package__ to'g'ri bo'lishi kerak. [SANDBOX not fully tested for packages]
2. if __name__ == "__main__" ichida import — asosiy skript uchun ishlaydi, lekin import qilinganda emas.
3. Type hints (from __future__ import annotations yoki quotes) — circular ni yashirishi mumkin, lekin runtime da xato chiqadi.

## Done criteria
```
python3 a.py
```
xato bermaydi va kutilgan qiymatni (masalan "a") chiqaradi.
```
python3 -c "import a; print('ok')"
```
ham ishlashi kerak (agar a.py side-effect siz bo'lsa).

## If still failing
- Traceback to'liq o'qi, uchinchi modul bormi?
- importlib.reload sinama (yordam bermaydi).
- Kodni bitta faylga yig'ib sinab ko'r.
- Agar package: python -m package.a ishlat.

## Sources + confidence
- [SANDBOX] reproduced wrong AttributeError and ImportError, right lazy import works on Python 3.10.21
- [SRC:https://docs.python.org/3/faq/programming.html#what-are-the-best-practices-for-using-import-in-a-module @3.x 2026-11-14] circular imports explained, recommend avoid from-import at top, put code in functions
- [SRC:https://github.com/python/cpython/commit related to bpo-33237 message improvement]
confidence: high
