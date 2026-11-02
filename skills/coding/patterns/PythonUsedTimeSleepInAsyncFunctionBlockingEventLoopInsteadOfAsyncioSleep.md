---
name: python-time-sleep-in-async-blocks-event-loop
description: Async Python function uses time.sleep which blocks the event loop; use asyncio.sleep instead for non-blocking delay.
---

# Python async funksiyada time.sleep ishlatilgani event loopni bloklaydi

## Nima uchun bu skill kerak
Async kod yozayotganda kutish (delay) kerak bo'lganda odamlar odatdagi time.sleep ni ishlatadi, lekin bu butun event loopni to'xtatadi va boshqa concurrent vazifalarni bajarishga to'sqinlik qiladi.

## Simptom (aynan shu)
Async def funksiya ichida time.sleep(...) chaqirilgan, va boshqa async vazifalar (masalan, bir nechta parallel request yoki task) sekinlashadi yoki navbatda turib qoladi. Event loop "bloklangan" holatda.

## Sabab (100%)
time.sleep — blocking (bloklovchi) funksiya. U joriy threadni to'liq to'xtatadi. Asyncio event loop bitta threadda ishlaydi, shuning uchun time.sleep uni butunlay muzlatadi. To'g'ri yo'l — asyncio.sleep, u coroutine sifatida yield qiladi va loopga boshqa ishlarni bajarishga imkon beradi.

## Tasdiqlash
1. Kodda async def ...: ichida time.sleep yoki from time import sleep; sleep(...) borligini tekshiring.
2. asyncio.run yoki await bilan ishlatilayotgan funksiya ekanligini tasdiqlang.
3. Boshqa concurrent tasklar (asyncio.gather, create_task) ishlamayotganini yoki sekinligini kuzating.

## Tuzatish (aynan shu)
time.sleep ni olib tashlang, asyncio.sleep ga almashtiring. await qiling.

```python
# Noto'g'ri
import time
async def fetch_data():
    time.sleep(2)  # event loopni bloklaydi
    return "data"

# To'g'ri
import asyncio
async def fetch_data():
    await asyncio.sleep(2)  # non-blocking
    return "data"
```

Agar sinxron kod ichida bo'lsa va async emas — time.sleep to'g'ri, lekin async kontekstda hech qachon ishlatmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Async funksiyada har qanday blocking call (time.sleep, requests.get va hokazo) event loopni to'xtatadi. Kutish uchun doim await asyncio.sleep ishlating. Bu concurrentlikni saqlaydi.
