---
name: python-bare-except-catches-everything
description: Python'da bare except: ishlatilganda SystemExit, KeyboardInterrupt va barcha exception'lar yutiladi — dastur to'xtamaydi yoki xato yashirinadi.
---

# Python bare except: barcha exception'larni (SystemExit, KeyboardInterrupt ham) ushlab qoladi

## Nima uchun bu skill kerak
Python'da `except:` (tip yozilmasdan) barcha exception'larni tutadi, jumladan `SystemExit` (sys.exit()), `KeyboardInterrupt` (Ctrl+C) va hatto `GeneratorExit`. Agentlar ko'pincha "xatoni yutib qo'yay" deb bare except yozishadi, natijada dastur to'xtamaydi, foydalanuvchi interrupt qila olmaydi, yoki haqiqiy xato jim yashirinadi.

## Simptom (aynan shu)
- Kodda `try: ... except: ...` yoki `except:` (Exception yozilmagan) bor.
- `sys.exit(1)` yoki `raise SystemExit` ishlamaydi — dastur davom etadi.
- Ctrl+C (KeyboardInterrupt) ushlanib, dastur to'xtamaydi.
- Haqiqiy xato (masalan, TypeError, ValueError) log qilinmaydi yoki yashirinadi, faqat "xato bo'ldi" deyiladi yoki hech narsa chiqmaydi.
- Exception zanjiri (traceback) yo'qoladi.

## Sabab (100%)
Bare `except:` `BaseException` dan meros olgan hamma narsani tutadi. Python'da `Exception` odatdagi xatolar uchun, lekin `SystemExit`, `KeyboardInterrupt`, `GeneratorExit` `BaseException` ning to'g'ridan-to'g'ri vorislari. Shuning uchun bare except ularni ham yutadi. Bu qasddan to'xtatish yoki interrupt'ni bekor qiladi.

## Tasdiqlash
1. `try` blokida `sys.exit()` yoki `raise SystemExit` borligini tekshir — agar except: bo'lsa, exit ishlamaydi.
2. Kodni ishga tushirib Ctrl+C bosing — agar to'xtamasa, bare except sabab.
3. Aniq xato (masalan, `1 / 0`) chiqarishga harakat qiling — agar traceback chiqmasa yoki jim o'tib ketsa, tasdiqlanadi.
4. `except Exception:` ga o'zgartirsang, SystemExit va KeyboardInterrupt o'tib ketadimi?

## Tuzatish (aynan shu)
Hech qachon bare `except:` ishlatma. Aniq tip yoz yoki kamida `Exception` (SystemExit/KeyboardInterrupt o'tadi):

```python
import sys

# Noto'g'ri (bare except — hamma narsani yutadi):
try:
    result = 1 / 0
    sys.exit(0)
except:
    print("Xato bo'ldi")  # SystemExit ham yutiladi, Ctrl+C ham

# To'g'ri — aniq tip:
try:
    result = 1 / 0
except ZeroDivisionError:
    print("Nolga bo'lish")
    # traceback saqlanadi yoki log qilinadi

# Yoki kamida Exception (interrupt va exit o'tadi):
try:
    do_work()
except Exception as e:
    print(f"Xato: {e}")
    # SystemExit va KeyboardInterrupt ushlanmaydi — to'g'ri
```

Agar haqiqatan hamma narsani tutish kerak bo'lsa (juda kam holat), `except BaseException:` deb aniq yoz va nima uchun ekanini izohla. Odatda shart emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Bare `except:` SystemExit, KeyboardInterrupt va barcha exception'larni yutadi.
- Har doim aniq exception tipi yoki kamida `except Exception as e:` ishlat.
- Bu dastur to'xtamasligi va xato yashirinishining klassik sababi.
