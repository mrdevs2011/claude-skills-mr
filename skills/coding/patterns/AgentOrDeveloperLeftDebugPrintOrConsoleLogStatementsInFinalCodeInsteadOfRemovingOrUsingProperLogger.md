---
name: leftover-debug-print-statements
description: Yakuniy kodda debug uchun qoldirilgan print() yoki console.log() mavjud — productionda keraksiz chiqish, sekinlashish va maxfiy ma'lumot oqishi xavfi.
---

# Yakuniy kodda debug print yoki console.log qoldirish

## Nima uchun bu skill kerak
Debug vaqtida qo'shilgan print/console.log yakuniy kodda qolsa, production loglarini ifloslaydi, ishlashni sekinlashtiradi va ba'zan maxfiy ma'lumotlarni chiqaradi. Ularni olib tashlash yoki to'g'ri logger bilan almashtirish kerak.

## Simptom (aynan shu)
- Kodda `print(`, `console.log(`, `console.debug(` kabi chaqiruvlar bor, ular debug uchun qo'shilgan.
- Production yoki yakuniy versiyada bu chiqishlar keraksiz.
- Log fayllari yoki stdout ortiqcha ma'lumot bilan to'lib ketadi.
- Ba'zi hollarda user data yoki secret print qilinadi.

## Sabab (100%)
Dasturchi yoki agent debug qilayotganda vaqtincha print qo'shadi, lekin ish tugagach ularni olib tashlashni unutadi yoki "keyinroq" deb qoldiradi. To'g'ri yondashuv: logger yoki shartli debug ishlatish.

## Tasdiqlash
1. print() yoki console.log() debug maqsadida ishlatilganmi (masalan o'zgaruvchi qiymatini chiqarish)?
2. Ular yakuniy commit/production kodida bormi?
3. To'g'ri logging framework ishlatilmaganmi?
Agar ha — bu holat.

## Tuzatish (aynan shu)
Debug printlarni olib tashla. Kerak bo'lsa logging modulini ishlat.

Noto'g'ri:
```python
def process(data):
    print(f"Processing {data}")  # debug
    result = compute(data)
    print(result)  # debug
    return result
```

To'g'ri:
```python
import logging
logger = logging.getLogger(__name__)

def process(data):
    logger.debug("Processing %s", data)
    result = compute(data)
    logger.debug("Result: %s", result)
    return result
```

JavaScript uchun:
```javascript
// Noto'g'ri
console.log("debug:", value);

// To'g'ri
// logger.debug yoki olib tashla; productionda console.log ni minifier olib tashlasa ham, aniqroq logger yaxshi
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Debug print va console.log yakuniy kodda qolmasligi kerak. Ularni olib tashla yoki logging framework (logging, winston va h.k.) bilan almashtir — toza loglar, yaxshi nazorat va xavfsizlik.
