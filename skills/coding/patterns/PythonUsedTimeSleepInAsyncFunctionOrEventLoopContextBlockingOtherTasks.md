---
name: python-used-time-sleep-in-async-context-blocking-event-loop
description: Async kodda time.sleep() ishlatilgan — event loop bloklanadi, boshqa tasklar to'xtaydi, performance yomonlashadi. Qachon: asyncio yoki async funksiya ichida kechikish kerak bo'lganda.
---

# Async kontekstda time.sleep ishlatish event loopni bloklaydi

## Nima uchun bu skill kerak
Python asyncio dasturlarida `time.sleep()` sinxron kechikish beradi va butun event loopni bloklaydi. Bu boshqa concurrent tasklarning ishlashini to'xtatadi, timeoutlar va responsivenessni buzadi. To'g'ri yo'l `await asyncio.sleep()`.

## Simptom (aynan shu)
- `async def` funksiya yoki `asyncio.run` ichida `time.sleep(n)` chaqirilgan.
- Dasturni ishga tushirganda boshqa async tasklar kechikadi yoki umuman ishlamaydi.
- High-concurrency muhitda (web server, bot) latency oshadi yoki "event loop is blocked" ogohlantirishlari.
- Kod ishlaydi, lekin kutilgan parallel bajarilish yo'q.

## Sabab (100%)
Dasturchi oddiy `time.sleep` ni async muhitda ham ishlatish mumkin deb o'ylagan yoki import qilishni unutgan. `time.sleep` OS darajasida threadni bloklaydi, asyncio esa cooperative multitasking ishlatadi — bloklovchi chaqiruv butun loopni to'xtatadi.

## Tasdiqlash
1. Faylda `async def` yoki `asyncio` ishlatilganmi?
2. Shu funksiya ichida `time.sleep(` bormi ( `await` siz)?
3. Agar ha — bu holat. `asyncio.sleep` kerak.

## Tuzatish (aynan shu)
`time.sleep` ni `await asyncio.sleep` ga almashtir. `import asyncio` qo'sh.

Noto'g'ri:
```python
import time
import asyncio

async def fetch_data():
    time.sleep(2)  # event loop bloklanadi
    return "data"
```

To'g'ri:
```python
import asyncio

async def fetch_data():
    await asyncio.sleep(2)  # boshqa tasklarga imkon beradi
    return "data"
```

Agar sinxron kodda kechikish kerak bo'lsa, `time.sleep` saqlanadi, lekin async funksiya ichida emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Async funksiya yoki asyncio event loop ichida hech qachon `time.sleep` ishlatma — u butun loopni bloklaydi. Doim `await asyncio.sleep` ishlat. Bu concurrent ishlashni saqlaydi va performance muammolarini oldini oladi.
