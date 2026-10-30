---
name: long-if-elif-value-mapping
description: Kodda oddiy qiymat mapping yoki dispatch uchun uzun if-elif-else zanjiri ishlatilgan — o'qilishi qiyin, yangi holat qo'shish xato-prone, va performance pastroq.
---

# Oddiy qiymat mapping uchun uzun if-elif zanjiri

## Nima uchun bu skill kerak
Oddiy kalit-qiymat moslashtirish yoki funksiya dispatch uchun if-elif zanjiri ishlatish kodni cho'zadi, yangi holat qo'shishda xato qilish ehtimolini oshiradi va dict yoki structural pattern matching (Python 3.10+) ga qaraganda sekinroq va kamroq o'qiladi. To'g'ri data structure yoki match ishlatish aniqroq va kengaytirilishi oson.

## Simptom (aynan shu)
- Funksiya yoki blokda 4+ if/elif bilan bir xil o'zgaruvchini tekshirib, har birida return yoki assignment.
- Mapping oddiy (string/int -> qiymat yoki funksiya), murakkab shartlar yo'q.
- Yangi qiymat qo'shish uchun yangi elif yozish kerak, default else bor yoki yo'q.
- Kod reviewda "bu zanjirni dict qilsa bo'ladi" degan izohlar.

## Sabab (100%)
Dasturchi oddiy shartli logikani if-elif bilan yozishga odatlangan, lekin bu holat data-driven mapping ekanini sezmaydi. Dict lookup O(1) va yangi kalit qo'shish bir qator, if-elif esa O(n) va har safar yangi branch.

## Tasdiqlash
1. Bir o'zgaruvchi (masalan status, type, code) ustida ketma-ket if/elif bormi?
2. Har bir branch oddiy return/assignment qiladimi, murakkab hisob-kitob yo'qmi?
3. Agar ha — dict yoki match-case ishlatish mumkin.

## Tuzatish (aynan shu)
Dict lookup yoki Python 3.10+ match-case ishlat. Default qiymat uchun .get() yoki case _.

Noto'g'ri:
```python
def get_status_message(code: str) -> str:
    if code == "ok":
        return "Muvaffaqiyat"
    elif code == "error":
        return "Xato"
    elif code == "pending":
        return "Kutilmoqda"
    elif code == "timeout":
        return "Vaqt tugadi"
    else:
        return "Noma'lum"
```

To'g'ri (dict):
```python
STATUS_MESSAGES = {
    "ok": "Muvaffaqiyat",
    "error": "Xato",
    "pending": "Kutilmoqda",
    "timeout": "Vaqt tugadi",
}

def get_status_message(code: str) -> str:
    return STATUS_MESSAGES.get(code, "Noma'lum")
```

To'g'ri (match-case, Python 3.10+):
```python
def get_status_message(code: str) -> str:
    match code:
        case "ok":
            return "Muvaffaqiyat"
        case "error":
            return "Xato"
        case "pending":
            return "Kutilmoqda"
        case "timeout":
            return "Vaqt tugadi"
        case _:
            return "Noma'lum"
```

Funksiya dispatch uchun dict of callables:
```python
HANDLERS = {
    "create": handle_create,
    "update": handle_update,
    "delete": handle_delete,
}

def dispatch(action: str, data):
    handler = HANDLERS.get(action)
    if handler is None:
        raise ValueError(f"Noma'lum action: {action}")
    return handler(data)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy qiymat-to-qiymat yoki action-to-handler mapping uchun if-elif zanjiri o'rniga dict lookup yoki match-case ishlat. Bu qisqaroq, xatosiz kengaytiriladi, o'qilishi oson va performance yaxshiroq.
