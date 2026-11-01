---
name: python-used-manual-sys-argv-parsing-instead-of-argparse
description: Qo'lda sys.argv bilan argumentlarni parse qilish xato, noqulay va help/validation yo'q qiladi. Argparse (yoki Click) ishlatish kerak.
---

# Qo'lda sys.argv parse o'rniga argparse ishlatish

## Nima uchun bu skill kerak
sys.argv ni indekslar bilan o'qib, if/else bilan tekshirish oddiy skriptlar uchun ishlaydi, lekin tezda xato, o'qish qiyin, --help yo'q, validation yo'q va keyinchalik kengaytirish qiyin bo'ladi. Standart kutubxona argparse buni professional qiladi.

## Simptom (aynan shu)
Skript `python script.py foo 123` bilan ishlaydi, lekin noto'g'ri argumentda crash beradi yoki noto'g'ri natija, `--help` yo'q, bayroqlar (`--verbose`) qo'shish qiyin, positional va optional aralashganida tartib xato bo'ladi.

## Sabab (100%)
sys.argv oddiy stringlar ro'yxati. Indeks bilan olish (sys.argv[1]) cheklangan: tartibga bog'liq, tip konvertatsiya qo'lda, xato xabarlari yomon, subcommand yo'q. Argparse argumentlarni deklarativ tarzda e'lon qiladi, avtomatik help, type, choices, required ni boshqaradi.

## Tasdiqlash
Kodda `import sys` va `sys.argv[1]`, `len(sys.argv) < 2`, qo'lda split yoki if chain borligini qidir. Argparse yoki click yo'qligini tekshir.

```python
# Noto'g'ri misol
import sys
if len(sys.argv) < 3:
    print("Usage: ...")
    sys.exit(1)
name = sys.argv[1]
count = int(sys.argv[2])  # ValueError mumkin
```

## Tuzatish (aynan shu)
`argparse` ishlat. Minimal:

```python
import argparse

parser = argparse.ArgumentParser(description="Misol skript")
parser.add_argument("name", help="Ism")
parser.add_argument("count", type=int, help="Soni")
parser.add_argument("--verbose", action="store_true", help="Batafsil chiqish")
args = parser.parse_args()

print(args.name, args.count)
if args.verbose:
    print("Verbose mode")
```

Endi `python script.py --help` ishlaydi, noto'g'ri tipda aniq xato, optional bayroqlar qo'shish oson. Murakkab holatda `subparsers` yoki Click.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
CLI argumentlar uchun doim `argparse` (standart) yoki Click ishlat. Qo'lda sys.argv faqat juda oddiy bir martalik skriptlarda qabul qilinadi — aks holda o'qilishi, xavfsizligi va kengaytirilishi yomonlashadi.
