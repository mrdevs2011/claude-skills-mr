---
name: used-time-sleep-in-async-blocking-event-loop
description: Async funksiya ichida time.sleep() ishlatilgan — event loop bloklanadi, boshqa concurrent tasklar to'xtaydi. asyncio.sleep() ishlatilishi kerak.
---

# Async kodda time.sleep() ishlatib event loopni bloklash

## Nima uchun bu skill kerak
Python async kodida (FastAPI, asyncio, aiohttp va h.k.) `time.sleep()` chaqirish event loopni to'liq bloklaydi. Bu paytda boshqa await qilayotgan tasklar, requestlar yoki concurrent ishlar to'xtab qoladi. Natijada server "muzlab" qoladi yoki timeoutlar ko'payadi. To'g'ri yo'l — `await asyncio.sleep()`.

## Simptom (aynan shu)
- Async funksiya ichida `time.sleep(n)` bor (import time).
- Kod "ishlaydi", lekin concurrent requestlar sekinlashadi yoki qotadi.
- Event loop warning yoki "Task was destroyed but it is pending" kabi xatolar.
- Profilingda sleep paytida CPU 0%, lekin boshqa tasklar kutadi.
- `asyncio.get_event_loop().is_running()` true bo'lsa ham sleep ishlaydi va bloklaydi.

## Sabab (100%)
Agent (yoki dasturchi) oddiy sinxron koddan `time.sleep`ni ko'chirib, async kontekstga moslashtirmagan. `asyncio.sleep` ni bilmaydi yoki "sleep sleep-ku" deb farqni e'tiborsiz qoldiradi. Natijada blocking I/O event loop ichida bajariladi.

## Tasdiqlash
1. Async def funksiya ichida `time.sleep` yoki `sleep(` borligini qidir.
2. `import time` va `import asyncio` ikkalasi ham bormi? Faqat time ishlatilganmi?
3. Funksiya `await` ishlatadimi yoki async task sifatida chaqiriladimi?
4. Agar `asyncio.sleep` ga almashtirilsa, concurrent tasklar parallel ishlaydimi (masalan ikkita task bir vaqtda sleep qilsa)?

## Tuzatish (aynan shu)
`time.sleep` ni `await asyncio.sleep` ga almashtir. Importni ham to'g'rila.

```python
# Noto'g'ri (event loop bloklanadi):
import time

async def fetch_with_delay():
    print("boshladim")
    time.sleep(2)          # <-- bloklaydi!
    print("tugadi")
    return "ok"

# To'g'ri:
import asyncio

async def fetch_with_delay():
    print("boshladim")
    await asyncio.sleep(2)  # <-- non-blocking, boshqa tasklar ishlaydi
    print("tugadi")
    return "ok"
```

Qoidalar:
- Async funksiya ichida hech qachon `time.sleep` ishlatma.
- Kichik kechikish uchun doim `await asyncio.sleep(seconds)`.
- Agar sinxron kutish kerak bo'lsa (masalan thread ichida), `time.sleep` ishlat, lekin event loop ichida emas.
- Blocking operatsiyalar uchun `asyncio.to_thread` yoki executor ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `time.sleep` async kodda event loopni bloklaydi — concurrentlikni yo'qotadi.
- Doim `await asyncio.sleep` ishlat.
- Bu kichik o'zgarish serverning responsivligini keskin yaxshilaydi.
