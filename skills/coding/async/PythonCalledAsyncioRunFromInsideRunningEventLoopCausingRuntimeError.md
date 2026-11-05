---
name: python-called-asyncio-run-from-inside-running-event-loop-causing-runtimeerror
description: RuntimeError: asyncio.run() cannot be called from a running event loop xatosi chiqsa — allaqachon ishlayotgan event loop ichida asyncio.run() chaqirilgan. Nested loop yoki await ishlat.
---

# PythonCalledAsyncioRunFromInsideRunningEventLoopCausingRuntimeError

## Nima uchun bu skill kerak
Python async kodda `asyncio.run()` faqat yangi event loop yaratib, uni ishga tushirish uchun mo'ljallangan. Agar allaqachon ishlayotgan loop ichida (Jupyter, FastAPI, yoki boshqa async kontekstda) chaqirilsa, RuntimeError chiqadi. Bu xato AI modellar tomonidan tez-tez yuzaga keladi, chunki ular oddiy script misolini to'g'ridan-to'g'ri async funksiya ichiga qo'yishadi.

## Simptom (aynan shu)
```
RuntimeError: asyncio.run() cannot be called from a running event loop
```
Yoki shunga o'xshash: "This event loop is already running".

Xato odatda `asyncio.run(some_coro())` chaqiruvi qatorida chiqadi, ayniqsa Jupyter notebook, IPython, yoki web framework request handler ichida.

## Sabab (100%)
`asyncio.run()` ichki qismida yangi event loop yaratadi va `loop.run_until_complete()` chaqiradi. Agar joriy thread'da allaqachon faol (running) event loop bo'lsa, Python 3.7+ da bu taqiqlangan — nested loop'ga ruxsat yo'q (default policy).

Bu holat quyidagi joylarda yuzaga keladi:
- Jupyter/IPython (o'zi event loop ishlaydi)
- FastAPI/Starlette/Quart request handler ichida
- Boshqa `asyncio.run()` yoki `loop.run_forever()` ichida chaqirilganda

## Tasdiqlash
1. Xato matnini tekshir: "cannot be called from a running event loop" yoki "This event loop is already running".
2. Stack trace'da `asyncio.run` yoki `run_until_complete` ko'rinadi.
3. Kontekstni tekshir: kod Jupyter'da yoki async def funksiya ichidami?
4. `asyncio.get_running_loop()` chaqirib ko'r — agar xato bermasa, loop allaqachon ishlayapti.

## Tuzatish (aynan shu)
`asyncio.run()` o'rniga to'g'ridan-to'g'ri `await` ishlat (agar allaqachon async kontekstda bo'lsang).

Yomon:
```python
async def handler():
    result = asyncio.run(fetch_data())  # RuntimeError
    return result
```

To'g'ri:
```python
async def handler():
    result = await fetch_data()  # to'g'ridan-to'g'ri await
    return result
```

Agar top-level script bo'lsa va loop yo'q bo'lsa, `asyncio.run()` ishlatish mumkin:
```python
async def main():
    result = await fetch_data()
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

Jupyter uchun (agar kerak bo'lsa):
```python
import nest_asyncio
nest_asyncio.apply()
asyncio.run(main())  # endi ishlaydi, lekin productionda tavsiya etilmaydi
```

Yoki `asyncio.get_event_loop().create_task()` yoki oddiy await.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`asyncio.run()` faqat yangi, bo'sh event loop uchun. Ishlayotgan loop ichida hech qachon chaqirma — `await` ishlat yoki loop'ni to'g'ri boshqar. Bu xato asosan kontekstni (Jupyter vs script vs server) hisobga olmaslikdan kelib chiqadi.
