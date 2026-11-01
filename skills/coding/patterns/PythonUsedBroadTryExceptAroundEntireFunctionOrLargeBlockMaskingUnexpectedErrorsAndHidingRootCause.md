---
name: python-broad-try-except-masks-errors
description: Python funksiya yoki katta kod bloki butunlay try-except ichiga olingan — kutilmagan xatolar yutiladi, ildiz sabab yashirinadi, debug qiyinlashadi.
---

# Keng try-except butun funksiyani yoki katta blokni o'rab oladi

## Nima uchun bu skill kerak
AI yoki dasturchi xatolarni "ushlab" qolish uchun butun funksiya tanasini yoki katta mantiq blokini bitta `try:` ... `except Exception:` ichiga qo'yadi. Bu kutilgan xatolarni ham, kutilmaganlarni ham yutadi. Natijada: dastur "ishlayotgandek" ko'rinadi, lekin noto'g'ri natija qaytaradi yoki jim o'tib ketadi. Keyinroq debug qilish juda qiyin bo'ladi, chunki asl xato stack trace'i yo'qolgan.

## Simptom (aynan shu)
- Funksiya yoki katta kod qismi shunday yozilgan:
  ```python
  def process(data):
      try:
          # 20-50 qator mantiq
          result = complex_operation(data)
          return result
      except Exception as e:
          print(e)  # yoki log, yoki pass, yoki default qaytarish
          return None
  ```
- Dastur yiqilmaydi, lekin noto'g'ri yoki bo'sh natija beradi.
- Logda faqat umumiy xato bor, qaysi qatorda va nima uchun ekanligi aniq emas.
- Unit testlar o'tadi, lekin production'da "g'alati" holatlar yuzaga keladi.

## Sabab (100%)
Xato ushlash oralig'i (scope) juda keng. Faqat aniq, kutilgan xato turlari (masalan `ValueError`, `KeyError`) va faqat xavfli qatorlar atrofida bo'lishi kerak edi. Butun blokni o'rash esa:
- Kutilmagan `TypeError`, `AttributeError`, `IndexError` kabilarni yutadi.
- Asl sababni (qaysi o'zgaruvchi noto'g'ri, qaysi qator) yashiradi.
- "Pass" yoki umumiy log qilish bilan muammoni hal qilmaydi, faqat kechiktiradi.

## Tasdiqlash
1. Funksiya ichidagi `try:` dan `except:` gacha bo'lgan qatorlar sonini hisobla. Agar 10+ qator yoki butun mantiq bo'lsa — bu keng.
2. `except Exception` yoki bare `except:` ishlatilganmi? (aniq tip emas)
3. Except ichida faqat log yoki default qaytarish bormi, re-raise yo'qmi?
4. Stack trace'da asl xato ko'rinmaydimi yoki "yutilgan"mi?

## Tuzatish (aynan shu)
Faqat aniq xavfli qatorlarni va aniq xato turlarini ushla. Qolganini tashqariga chiqar.

```python
# XATO (keng try-except):
def process(data):
    try:
        validated = validate(data)          # bu xato berishi mumkin
        transformed = transform(validated)  # bu ham
        saved = save(transformed)           # bu ham
        return saved
    except Exception as e:
        logger.error(e)
        return None

# TO'G'RI (tor, aniq):
def process(data):
    validated = validate(data)  # agar xato bersa, yuqoriga chiqsin
    try:
        transformed = transform(validated)
    except ValueError as e:     # faqat kutilgan tip
        logger.warning("Transform failed: %s", e)
        transformed = fallback_transform(validated)
    saved = save(transformed)
    return saved
```

Agar butun funksiyani himoya qilish kerak bo'lsa — tashqarida (chaqiruvchi tomonda) qil, ichkarida emas. Yoki aniq exception'larni re-raise qil:

```python
except ValueError:
    raise  # asl stack trace saqlanadi
except Exception:
    logger.exception("Unexpected error")
    raise
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Keng `try-except` "xavfsiz" ko'rinadi, lekin aslida xatolarni yashiradi va debugni qiyinlashtiradi. Har doim eng tor oralig'ni va eng aniq exception tipini ushla. Kutilmagan xatolar yuqoriga chiqishi kerak — shunda ildiz sabab tez topiladi.
