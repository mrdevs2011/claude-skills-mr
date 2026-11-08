---
name: python-sys-argv-index-without-length-check
description: Python skripti sys.argv[1] yoki keyingi indexlarni tekshiruvsiz oladi va kerakli argument yo'qligida IndexError chiqadi. Argparse yoki len() tekshiruvi ishlatilmagan.
---

# sys.argv index tekshiruvsiz olinganda IndexError

## Nima uchun bu skill kerak
Oddiy CLI skriptlarida agent yoki developer `sys.argv[1]` ni to'g'ridan-to'g'ri ishlatadi, lekin foydalanuvchi argument bermasa (yoki kamroq bersa) dastur darhol IndexError bilan yiqiladi. Bu eng oddiy va tez-tez uchraydigan CLI xatolaridan biri. Argparse yoki oddiy uzunlik tekshiruvi uni oldini oladi va foydalanuvchiga aniq xabar beradi.

## Simptom (aynan shu)
- Xato: `IndexError: list index out of range`
- Stack trace `sys.argv[1]` yoki `sys.argv[2]` qatoriga ishora qiladi.
- Skript argumentlarsiz yoki kam argument bilan ishga tushirilganda yiqiladi.
- Argumentlar to'g'ri berilganda ishlaydi.

## Sabab (100%)
`sys.argv` doim kamida `[script_name]` ni o'z ichiga oladi (indeks 0). Kerakli argumentlar 1, 2, ... indekslarda. Kod `len(sys.argv)` ni tekshirmasdan to'g'ridan-to'g'ri `sys.argv[1]` ga kiradi. Python list o'zi chegarani tekshirmaydi — noto'g'ri indeks IndexError beradi.

## Tasdiqlash
1. Xato xabarida `sys.argv` yoki `IndexError: list index out of range` bormi?
2. Kodda `sys.argv[n]` (n >= 1) ishlatilganmi va undan oldin `if len(sys.argv) <= n:` yoki shunga o'xshash tekshiruv yo'qmi?
3. Skriptni argumentlarsiz ishga tushirib, xuddi shu xato chiqishini tasdiqlang.
4. Argparse ishlatilmaganini tekshiring (`import argparse` yo'q yoki parse_args chaqirilmagan).

## Tuzatish (aynan shu)
Eng yaxshi yo'l — `argparse` ishlatish (avtomatik help, validation, tip konvertatsiya):

```python
import argparse

parser = argparse.ArgumentParser(description="Misol skript")
parser.add_argument("input_file", help="Kirish fayli")
parser.add_argument("--output", default="out.txt", help="Chiqish fayli")
args = parser.parse_args()

print(args.input_file)
```

Agar oddiy tekshiruv yetarli bo'lsa:

```python
import sys

if len(sys.argv) < 2:
    print("Foydalanish: python script.py <argument>")
    sys.exit(1)

value = sys.argv[1]
# endi xavfsiz
```

Hech qachon `sys.argv[1]` ni tekshiruvsiz ishlatmang. Argparse afzal.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `sys.argv[1]` tekshiruvsiz ishlatilsa, argument yo'qligida IndexError chiqadi.
- Sabab: list chegarasini o'zi tekshirmaydi, len() yoki argparse kerak.
- Tuzatish: argparse ishlatish yoki `if len(sys.argv) < N: sys.exit(1)` qo'shish.
- CLI skriptlarida doim argument validatsiyasi qiling.
