---
name: python-asyncio-run-cannot-be-called-from-running-event-loop-use-await
description: RuntimeError: asyncio.run() cannot be called from a running event loop — already running loop ichida asyncio.run chaqirilgan. Await yoki create_task ishlat.
id: python-asyncio-run-cannot-be-called-from-running-event-loop-use-await
type: playbook
stack: Python 3.10.21 asyncio (docs 3.10/3.11/3.14)
confirmed_on: 2026-11-15
confidence: high (reproduced in sandbox + official docs)
triggers:
  - RuntimeError: asyncio.run() cannot be called from a running event loop
  - asyncio.run() cannot be called from a running event loop
  - This event loop is already running
  - asyncio.run inside async function or Jupyter
  - nested event loop RuntimeError asyncio.run
  - cannot call asyncio.run from running loop
  - asyncio.run from inside running event loop error
  - RuntimeError running event loop asyncio.run
  - Jupyter asyncio.run error
  - FastAPI handler asyncio.run fails
related:
  - python-runtimeerror-event-loop-is-closed-after-loop-close-use-asyncio-run
  - coding/async/PythonCalledAsyncioRunFromInsideRunningEventLoopCausingRuntimeError
---

# asyncio.run() running event loop ichida chaqirilsa RuntimeError

## TL;DR
Simptom: RuntimeError: asyncio.run() cannot be called from a running event loop
Sabab: joriy thread'da allaqachon faol event loop bor (async def ichida, Jupyter, server handler), asyncio.run yangi loop yaratolmaydi.
Birinchi buyruq: traceback'da asyncio.run chaqiruvi qayerda ekanini ko'r; agar async def ichida bo'lsa — await ga almashtir.
Done: asyncio.run faqat top-level da, ichida await yoki create_task ishlaydi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: aniq "cannot be called from a running event loop" xatosi, yoki "already running".
Ishlatma: "Event loop is closed" uchun (boshqa playbook), yoki loop yo'q bo'lsa (oddiy top-level asyncio.run to'g'ri).

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/asyncio-runner.html @3.10+ 2026-11-15] asyncio.run() yangi event loop yaratadi, ishlatadi va yopadi; "This function cannot be called when another asyncio event loop is running in the same thread." Nested loop default taqiqlangan. Jupyter/IPython o'zi loop ishlatadi, FastAPI/Starlette request async context. Ichida faqat await (yoki create_task) kerak.

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi.
   EXPECTED: RuntimeError: asyncio.run() cannot be called from a running event loop
   Agar "Event loop is closed" → boshqa skill. Agar boshqa → davom.

2. Traceback'da chaqiruv joyini ko'r: async def ichidami, yoki top-level?
   EXPECTED: odatda async funksiya yoki callback ichida. Agar top-level va loop yo'q → boshqa sabab (policy?).

3. Loop ishlayotganini tasdiqla (agar kodda mumkin):
   ```
   python3 -c 'import asyncio; print(asyncio.get_running_loop())'  # outside
   ```
   EXPECTED: RuntimeError: no running event loop (normal script).
   Ichida: try: asyncio.get_running_loop() except RuntimeError: ...

4. Repro wrong (sandbox):
   ```
   python3 - << 'PY'
   import asyncio
   async def foo(): return 1
   async def bar(): return asyncio.run(foo())
   try:
       asyncio.run(bar())
   except RuntimeError as e:
       print(type(e).__name__, str(e))
   PY
   ```
   EXPECTED: RuntimeError asyncio.run() cannot be called from a running event loop [SANDBOX]

5. Agar ha — fix ga o't. Agar Jupyter da — await to'g'ridan-to'g'ri yoki nest_asyncio (tavsiya etilmaydi production).

## Fix per cause
**Sabab: async kontekstda asyncio.run**
Copy-paste right:
```python
import asyncio
async def foo():
    print("foo")
    return 42
async def bar():
    return await foo()  # await, run emas
print(asyncio.run(bar()))
```
EXPECTED: foo\n42 [SANDBOX]

Yoki create_task agar parallel:
```python
async def bar():
    task = asyncio.create_task(foo())
    return await task
```

Re-check: yuqoridagi buyruq xato bermasligi, result qaytishi.

**Sabab: Jupyter/IPython**
await main() to'g'ridan-to'g'ri (top-level await). nest_asyncio.apply() vaqtinchalik, lekin productionda yo'q.

**Sabab: top-level da lekin loop bor**
Loop'ni to'xtat yoki yangi thread ishlat (kamdan-kam).

## Where agents go wrong (>=3)
1. Ichida asyncio.run qoldirib, faqat try/except qo'shadi — xato davom etadi.
2. get_event_loop().run_until_complete ishlatadi — eski, va running da ham muammo.
3. nest_asyncio ni hamma joyda qo'yadi — productionda tavsiya etilmaydi, murakkablik.
4. create_task qilib await qilmaydi — task garbage collect bo'lishi mumkin (boshqa skill).

## Edge cases (>=2)
1. Secondary thread da loop ishlaydi — run_coroutine_threadsafe ishlat.
2. Python <3.7 da asyncio.run yo'q — manual new_event_loop.
3. Custom event loop policy — get_running_loop baribir ishlaydi.
4. Debug mode: asyncio.run(..., debug=True) faqat top-level.

## Done criteria (proving commands)
```bash
# Wrong beradi
python3 - << 'PY'
import asyncio
async def f(): return 1
async def g(): return asyncio.run(f())
try: asyncio.run(g())
except RuntimeError as e: print("caught:", "running event loop" in str(e))
PY
# Right ishlaydi
python3 - << 'PY'
import asyncio
async def f(): return 1
async def g(): return await f()
print(asyncio.run(g()) == 1)
PY
```
EXPECTED: caught: True va True [SANDBOX]

## If still failing
- python3 --version (3.7+).
- get_running_loop() qayerda chaqirilayotganini tekshir.
- Boshqa skill: event loop closed.
- Docs: https://docs.python.org/3/library/asyncio-runner.html

## Sources + confidence
- [SRC:https://docs.python.org/3/library/asyncio-runner.html @ Python 3.10+ 2026-11-15]: "cannot be called when another asyncio event loop is running in the same thread."
- [SANDBOX]: Python 3.10.21, wrong → RuntimeError(...running event loop), right await → 42. High.
- [REPO:skills/coding/async/PythonCalledAsyncioRunFromInsideRunningEventLoopCausingRuntimeError.md] related short version.
Confidence: high (measured + docs).
