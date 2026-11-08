---
name: python-asyncio-create-task-no-reference-gc
description: Python asyncio.create_task chaqiruvi natijasini o'zgaruvchiga saqlamagan — task garbage collection tufayli tugamadan yo'qolishi mumkin, ayniqsa background tasklarda.
---

# asyncio.create_task natijasini saqlamaslik

## Nima uchun bu skill kerak
asyncio.create_task taskni event loop'ga qo'shadi, lekin agar reference saqlanmasa, Python garbage collector taskni tugatishdan oldin o'chirib yuborishi mumkin. Bu background ishlarni (masalan, log yuborish, notification) yo'qotishga olib keladi — xato ko'rinmaydi, shunchaki ish bajarilmaydi.

## Simptom (aynan shu)
- `asyncio.create_task(some_coro())` chaqiruvi natijasi o'zgaruvchiga yoki set/list'ga saqlanmagan.
- Background task ba'zan ishlaydi, ba'zan yo'qoladi (non-deterministic).
- Task tugashi kutilgan log yoki side-effect ko'rinmaydi, lekin hech qanday exception chiqmaydi.
- Ayniqsa long-running event loop'da yoki high-load ostida namoyon bo'ladi.

## Sabab (100%)
asyncio.create_task faqat taskni schedule qiladi. Task object'ining reference'i faqat local variable yoki container'da bo'lsa, funksiya qaytgandan keyin reference yo'qoladi. GC taskni "unreachable" deb hisoblab, tugatishdan oldin o'chirishi mumkin (CPython'da weak reference semantics tufayli).

## Tasdiqlash
1. create_task chaqiruvi natijasi `_ =` yoki umuman saqlanmaganmi?
2. Task'ni keyinchalik await yoki done callback bilan kuzatish yo'qmi?
3. Background ish (print, write, request) ba'zan yo'qoladimi?
4. Agar ha — bu holat.

## Tuzatish (aynan shu)
Task reference'ini saqlab qo'y. Eng oddiy yo'l — set yoki list'da ushlab turish va tugaganda olib tashlash.

Noto'g'ri:
```python
async def handler():
    asyncio.create_task(background_work())  # reference yo'q
    return "ok"
```

To'g'ri:
```python
background_tasks = set()

async def handler():
    task = asyncio.create_task(background_work())
    background_tasks.add(task)
    task.add_done_callback(background_tasks.discard)
    return "ok"
```

Yoki TaskGroup (Python 3.11+) ishlatish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
asyncio.create_task natijasini doim reference'da saqlash kerak (set + done_callback eng xavfsiz). Aks holda GC taskni tugatishdan oldin o'chirib yuborishi mumkin — background ishlar non-deterministic yo'qoladi.
