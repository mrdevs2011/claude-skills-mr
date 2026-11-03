---
name: python-used-sys-exit-in-library-or-reusable-function-instead-of-raising-exception-causing-hard-to-handle-in-callers
description: Kutubxona yoki qayta ishlatiladigan funksiyada sys.exit() chaqirilganda dasturni butunlay to'xtatadi va chaqiruvchi kod xatoni ushlab, tozalash yoki qayta urinish imkoniyatini yo'qotadi. Exception ko'tarish kerak.
---

# Kutubxona kodida sys.exit() o'rniga exception ko'tarish

## Nima uchun bu skill kerak
sys.exit() butun Python interpretatorini to'xtatadi. Bu skriptning asosiy kirish nuqtasi (if __name__ == "__main__") uchun mos, lekin import qilinadigan modul yoki qayta ishlatiladigan funksiya ichida ishlatilsa, chaqiruvchi kod xatoni boshqara olmaydi, resurslarni tozalay olmaydi va testlash qiyinlashadi.

## Simptom (aynan shu)
Funksiya yoki modul ichida xato holatida sys.exit(1) yoki sys.exit("xabar") chaqiriladi. Natijada butun dastur to'xtaydi, hatto chaqiruvchi try/except bilan o'rab qo'ygan bo'lsa ham (SystemExit maxsus exception). Loglar yo'qolishi, ochiq fayllar yopilmasligi, yoki testlar kutilmagan tarzda o'tmasligi mumkin.

## Sabab (100%)
sys.exit() aslida SystemExit exception ko'taradi, lekin u odatda yuqori darajada ushlanmaydi va interpretatorni chiqish kod bilan to'xtatadi. Kutubxona kodida bu "xato" deb hisoblanadi, chunki u chaqiruvchiga nazoratni qaytarmaydi. To'g'ri yondashuv: aniq exception (ValueError, RuntimeError, custom) ko'tarish, chaqiruvchi esa qaror qilsin.

## Tasdiqlash
Kodni qidir: sys.exit yoki SystemExit. Agar if __name__ == "__main__" blokidan tashqarida yoki import qilinadigan funksiyada bo'lsa — xato. Test:

```python
import sys
def bad_func():
    sys.exit(1)  # butun dastur to'xtaydi

try:
    bad_func()
except SystemExit:
    print("ushlandi, lekin bu tavsiya etilmaydi")
```

Yaxshiroq: exception ko'tarib, chaqiruvchi boshqarsin.

## Tuzatish (aynan shu)
sys.exit() ni faqat asosiy skript kirish nuqtasida ishlat. Qolgan joylarda exception ko'tar:

```python
import sys

def process_data(data):
    if not data:
        raise ValueError("Data bo'sh bo'lmasligi kerak")
    # ... ish
    return result

def main():
    try:
        result = process_data(get_input())
        print(result)
    except ValueError as e:
        print(f"Xato: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

Custom exception kerak bo'lsa:

```python
class ConfigError(Exception):
    pass

def load_config():
    if missing:
        raise ConfigError("Config fayl topilmadi")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
sys.exit() faqat dastur kirish nuqtasi uchun. Kutubxona, modul yoki qayta ishlatiladigan funksiyada exception ko'tar — chaqiruvchi xatoni ushlab, log qilib, tozalash yoki boshqa yo'l tanlashi mumkin bo'lsin. Bu kodni testlash, qayta ishlatish va xato boshqarishni yaxshilaydi.
