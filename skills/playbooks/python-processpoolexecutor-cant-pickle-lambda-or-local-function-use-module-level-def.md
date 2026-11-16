---
name: python-processpoolexecutor-cant-pickle-lambda-or-local-function-use-module-level-def
description: ProcessPoolExecutor map/submit fails with Can't pickle lambda or local function. Use top-level module function. Triggers on PicklingError Can't pickle <lambda> or AttributeError Can't pickle local object.
id: python-processpoolexecutor-cant-pickle-lambda-or-local-function-use-module-level-def
type: playbook
stack: Python 3.10+ (concurrent.futures, multiprocessing)
confirmed_on: 2026-11-16
confidence: high (reproduced in sandbox + official docs)
triggers:
  - Can't pickle <function <lambda>
  - PicklingError: Can't pickle <function <lambda>
  - AttributeError: Can't pickle local object
  - ProcessPoolExecutor lambda fails
  - concurrent.futures ProcessPoolExecutor can't pickle
  - map lambda ProcessPoolExecutor error
  - submit nested function ProcessPoolExecutor
  - multiprocessing pickle error lambda
  - ProcessPoolExecutor only works with top level functions
  - Can't pickle local object 'func.<locals>.inner'
related:
  - python-subprocess-partial-env-dict-causes-filenotfounderror-or-missing-vars-use-os-environ-copy.md
  - coding/patterns/PythonUsedPickleLoadOnUntrustedExternalDataCausingArbitraryCodeExecutionRisk.md
---

# ProcessPoolExecutor lambda yoki local function ni pickle qila olmaydi — module-level def ishlat

## TL;DR
Simptom: `ProcessPoolExecutor().map(lambda x: x*2, data)` yoki nested `def` bilan `PicklingError: Can't pickle <function <lambda>...` yoki `AttributeError: Can't pickle local object`.
Sabab: worker processlar funksiyani pickle orqali oladi; lambda va local/nested funksiyalar pickle qilinmaydi.
Birinchi buyruq: `python3 -c "from concurrent.futures import ProcessPoolExecutor; print(list(ProcessPoolExecutor().map(lambda x: x, [1])))"`
Done: xato yo'qoladi, top-level `def` bilan natija qaytadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: ProcessPoolExecutor (yoki multiprocessing.Pool) da lambda, nested def, yoki REPL da yozilgan funksiya ishlatayotganda pickle xatosi chiqsa.
Ishlatma: ThreadPoolExecutor (u pickle talab qilmaydi). Yoki faqat top-level funksiya ishlatayotgan bo'lsang.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor @ 3.15, 2026-11] ProcessPoolExecutor multiprocessing ishlatadi, shuning uchun faqat picklable obyektlar. "A function defined in a REPL or a lambda should not be expected to work." Worker child process `__main__` ni import qiladi va funksiyani topishi kerak. Lambda `<lambda>` nomi bilan, local object esa `<locals>` bilan pickle qilinmaydi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: `PicklingError` yoki `AttributeError: Can't pickle local object` bor-yo'qligini tekshir.
   EXPECTED: "Can't pickle <function <lambda>" yoki "Can't pickle local object 'outer.<locals>.inner'". Agar shu → bu skill. Agar boshqa pickle xato (custom class) → boshqa sabab.

2. Lambda sinab ko'r (wrong variant):
   ```bash
   python3 -c "
   from concurrent.futures import ProcessPoolExecutor
   with ProcessPoolExecutor() as e:
       print(list(e.map(lambda x: x*2, [1,2])))
   "
   ```
   EXPECTED: PicklingError: Can't pickle <function <lambda>... [SANDBOX]

3. Nested def sinab ko'r:
   ```bash
   python3 -c "
   from concurrent.futures import ProcessPoolExecutor
   def outer():
       def inner(x): return x*2
       with ProcessPoolExecutor() as e:
           print(list(e.map(inner, [1,2])))
   outer()
   "
   ```
   EXPECTED: AttributeError: Can't pickle local object 'outer.<locals>.inner' [SANDBOX]

4. Top-level ishlaydimi:
   ```bash
   python3 -c "
   from concurrent.futures import ProcessPoolExecutor
   def double(x): return x*2
   with ProcessPoolExecutor() as e:
       print(list(e.map(double, [1,2])))
   "
   ```
   EXPECTED: [2, 4] [SANDBOX]

## Fix har bir sabab uchun
Sabab 1: lambda yoki nested/local funksiya.
Fix: funksiyani module top-level da yoz.
```python
# wrong.py
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor() as e:
    print(list(e.map(lambda x: x * 2, [1, 2])))  # fails
```
Right:
```python
# right.py
from concurrent.futures import ProcessPoolExecutor

def double(x):
    return x * 2

if __name__ == "__main__":
    with ProcessPoolExecutor() as e:
        print(list(e.map(double, [1, 2])))
```
Yoki script da:
```bash
python3 -c "
from concurrent.futures import ProcessPoolExecutor
def double(x): return x*2
with ProcessPoolExecutor() as e:
    print(list(e.map(double, [1,2])))
"
# [2, 4]
```
Tekshir: exit 0, [2, 4] chiqadi. [SANDBOX]

Agar class method kerak bo'lsa — staticmethod yoki top-level wrapper.

## Agentlar qayerda xato qiladi
1. ThreadPoolExecutor ga o'tib qoladi — pickle muammosi yo'qoladi lekin GIL tufayli parallel bo'lmaydi (CPU-bound uchun).
2. `if __name__ == "__main__":` qo'yishni unutadi — boshqa xato (Recursive spawn).
3. cloudpickle yoki dill o'rnatib "hal qiladi" deb o'ylaydi — stdlib uchun keraksiz, va har doim ishlamaydi.
4. Funksiyani string orqali exec qilishga urinadi.

## Edge cases
1. `if __name__ == "__main__":` bo'lmasa, ba'zi start methodlarda recursive spawn xatosi chiqishi mumkin. Doim qo'y.
2. Custom class argument ham pickle qilinishi kerak ( __reduce__ yoki top-level).
3. Closure bilan nonlocal — baribir local object, ishlamaydi.
4. Windows/spawn default da qattiqroq; Linux fork da ba'zan o'tib ketadi lekin ishonchli emas.

## Done criteria
```bash
python3 -c "
from concurrent.futures import ProcessPoolExecutor
def double(x): return x * 2
with ProcessPoolExecutor() as e:
    result = list(e.map(double, [1, 2, 3]))
assert result == [2, 4, 6]
print('OK', result)
"
# Exit 0, OK [2, 4, 6]
```
Lambda bilan qayta ishga tushirsa PicklingError qaytadi (mutation tekshiruvi).

## Agar hali ham ishlamasa
- Xato matnini to'liq ko'chir (PicklingError vs AttributeError).
- Funksiya top-level ekanligini `inspect.getsource` yoki `def` qayerda ekanligini tekshir.
- `if __name__ == "__main__":` bor-yo'qligini.
- Docs: https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor

## Sources + confidence
- [SRC:https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor] "only picklable objects... A function defined in a REPL or a lambda should not be expected to work." (Python 3.15 docs, 2026-11)
- [SANDBOX] 2026-11-16: lambda → PicklingError Can't pickle <function <lambda>; nested → AttributeError Can't pickle local object; top-level → [2, 4]
- Confidence: 95% (official docs + local repro on Python 3.10.21).
