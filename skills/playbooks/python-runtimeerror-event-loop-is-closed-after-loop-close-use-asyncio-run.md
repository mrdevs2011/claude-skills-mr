---
name: python-runtimeerror-event-loop-is-closed-after-loop-close-use-asyncio-run
description: RuntimeError: Event loop is closed — loop.close() dan keyin run_until_complete yoki boshqa metod chaqirilganda. asyncio.run() ishlat, u loop lifecycle ni boshqaradi.
id: python-runtimeerror-event-loop-is-closed-after-loop-close-use-asyncio-run
type: playbook
stack: Python 3.10.21 asyncio (official docs 3.10/3.11)
confirmed_on: 2026-11-12
confidence: high (reproduced in sandbox + official docs)
triggers:
  - RuntimeError: Event loop is closed
  - Event loop is closed
  - loop.is_closed() True
  - cannot schedule after close
  - asyncio loop closed after close()
  - RuntimeError Event loop is closed run_until_complete
  - event loop already closed
  - loop.close() then error
  - Python asyncio closed loop
related:
  - coding/async/PythonCalledAsyncioRunFromInsideRunningEventLoopCausingRuntimeError.md
---

# RuntimeError: Event loop is closed — loop.close() dan keyin metod chaqirish

## TL;DR
Simptom: RuntimeError: Event loop is closed (yoki is_closed() == True).
Sabab: loop.close() chaqirilgan, keyin run_until_complete, call_soon yoki boshqa metod.
Birinchi buyruq: loop.is_closed() tekshir yoki traceback da close() ko'r.
Done: asyncio.run(main()) ishlaydi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: manual loop yaratib close() qilgandan keyin xato, eski style kod, shutdown vaqtida.
Ishlatma: "cannot be called from a running event loop" xatosi uchun (boshqa skill), yoki Jupyter da (u yerda await to'g'ridan-to'g'ri).

## Mental model (nima uchun)
[SANDBOX][SRC:https://docs.python.org/3.10/library/asyncio-eventloop.html] loop.close() irreversible: queues clear, executor shutdown. Keyin hech qanday metod chaqirish mumkin emas — _check_closed() RuntimeError raises. asyncio.run() (3.7+) loop yaratadi, ishlatadi, yopadi — manual close kerak emas. [SRC:https://docs.python.org/3.10/library/asyncio-runner.html]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "Event loop is closed" aniqmi?
   EXPECTED: RuntimeError: Event loop is closed. Agar "already running" — boshqa skill.

2. is_closed tekshir:
   ```
   python3 -c 'import asyncio; l=asyncio.new_event_loop(); print(l.is_closed()); l.close(); print(l.is_closed())'
   ```
   EXPECTED: False then True. [SANDBOX]

3. Traceback: close() yoki shutdown dan keyinmi?
   EXPECTED: close() chaqirilgan qator bor.

4. Repro wrong:
   ```
   python3 -c '
   import asyncio
   loop = asyncio.new_event_loop()
   asyncio.set_event_loop(loop)
   loop.close()
   loop.run_until_complete(asyncio.sleep(0.01))
   '
   ```
   EXPECTED: RuntimeError: Event loop is closed + RuntimeWarning coroutine never awaited. [SANDBOX]

5. Agar ha — fix ga o't.

## Fix per cause
- Manual close dan keyin: yangi loop yarat yoki (yaxshiroq) asyncio.run ishlat.
Copy-paste right:
```
python3 -c '
import asyncio
async def main():
    await asyncio.sleep(0.01)
    return "ok"
print(asyncio.run(main()))
'
```
EXPECTED: ok [SANDBOX]

- Agar loop ni qayta ishlatish kerak: close() dan oldin hamma ish tugaganini kut (run_until_complete pending), keyin yangi loop.
- Shutdown da: asyncio.run() ishlat, u auto-close qiladi.

Re-check: yuqoridagi right buyruq xato bermasligi.

## Where agents go wrong (>=3)
1. loop.close() dan keyin qayta get_event_loop() deb o'ylaydi — u yopiq loop qaytaradi.
2. try/except da xatoni yutib, loop ni ignore qiladi.
3. asyncio.run() o'rniga manual new_event_loop + close qiladi, keyin xato.
4. Jupyter/async kontekstda asyncio.run chaqiradi (boshqa xato).

## Edge cases (>=2)
1. Secondary thread da loop close — main shutdown da "Event loop is closed".
2. run_in_executor pending bo'lganda close — future callback xato berishi mumkin.
3. Python <3.7 da asyncio.run yo'q — manual boshqarish kerak (lekin 3.10+ tavsiya asyncio.run).

## Done criteria (proving commands)
- Wrong repro xato beradi: RuntimeError: Event loop is closed.
- Right: asyncio.run(main()) "ok" yoki expected result, exit 0.
- is_closed() True bo'lgan loop da metod xato beradi.

## If still failing
- Versiya: python3 --version (3.7+ kerak asyncio.run uchun).
- Boshqa loop policy: get_event_loop_policy().
- Context: Jupyter da nest_asyncio yoki to'g'ridan-to'g'ri await.

## Sources + confidence
[SANDBOX] Wrong: loop.close() then run_until_complete → RuntimeError('Event loop is closed'). Right: asyncio.run → "ok".
[SRC:https://docs.python.org/3.10/library/asyncio-eventloop.html#asyncio.loop.close] close irreversible, no methods after.
[SRC:https://docs.python.org/3.10/library/asyncio-runner.html#asyncio.run] manages loop, closes at end. Version 3.10 confirmed.
Confidence: high, measured in sandbox Python 3.10.21.
