---
name: python-called-async-function-without-await-causing-coroutine-never-executed
description: Async funksiya chaqirilganda await qilinmasa coroutine obyekti yaratiladi lekin hech qachon ishga tushmaydi; RuntimeWarning chiqadi va kutilgan ish bajarilmaydi. Har doim await yoki asyncio.run ishlatish kerak.
---

# Async funksiyani await qilmasdan chaqirish

## Nima uchun bu skill kerak
Python'da `async def` funksiya chaqirilganda u darhol ishlamaydi — faqat coroutine obyektini qaytaradi. Uni `await` qilmasangiz yoki event loop'ga topshirmasangiz, ichidagi kod hech qachon bajarilmaydi. Bu ko'pincha e'tiborsizlikdan yuzaga keladi va jiddiy buglarga olib keladi (ma'lumot saqlanmaydi, so'rov yuborilmaydi va hokazo).

## Simptom (aynan shu)
Kod "ishladi" deb ko'rinadi, lekin async funksiya ichidagi amallar bajarilmaydi. Terminalda yoki logda quyidagi RuntimeWarning chiqadi:
```
RuntimeWarning: coroutine 'my_async_func' was never awaited
```
Yoki funksiya qaytargan natija kutilgan qiymat o'rniga `<coroutine object ...>` bo'ladi.

## Sabab (100%)
`async def` funksiyani oddiy chaqirish (`result = my_async_func()`) uni bajarishni boshlamaydi. Python faqat coroutine obyektini yaratadi va qaytaradi. Coroutine faqat `await` qilinganda yoki `asyncio.run()` / event loop orqali ishga tushganda bajariladi. Bu Python async modelining asosiy qoidasi.

## Tasdiqlash
1. Kodda `async def` funksiya chaqiruvi oldida `await` yo'qligini tekshir.
2. Ishga tushirib RuntimeWarning chiqishini kuzat.
3. Qaytgan qiymatni `print(type(result))` qilib ko'r — agar `<class 'coroutine'>` bo'lsa, await qilinmagan.

```python
async def fetch_data():
    return "ok"

# Noto'g'ri chaqiruv
result = fetch_data()
print(result)  # <coroutine object fetch_data at 0x...>
```

## Tuzatish (aynan shu)
Har doim async funksiyani `await` qil yoki to'g'ri event loop ishlat:

```python
import asyncio

async def fetch_data():
    # ... haqiqiy ish
    return "ok"

# To'g'ri: async funksiya ichida
async def main():
    result = await fetch_data()
    print(result)  # "ok"

# Yoki skriptning eng yuqori darajasida
asyncio.run(main())
```

Agar oddiy (sync) funksiyadan chaqirmoqchi bo'lsang, `asyncio.run()` yoki mavjud loop ishlat. Hech qachon coroutine'ni e'tiborsiz qoldirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`async def` funksiya chaqirilganda avtomatik ishlamaydi — faqat coroutine yaratadi. Uni doim `await` qilish yoki `asyncio.run` orqali ishga tushirish shart, aks holda ichidagi kod bajarilmaydi va RuntimeWarning chiqadi.
