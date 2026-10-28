---
name: python-raw-input-without-strip-or-conversion
description: input() natijasi to'g'ridan-to'g'ri ishlatilgan — strip() yoki int()/float() qilinmagan, shuning uchun bo'sh joy yoki string turi sababli TypeError yoki solishtirish muvaffaqiyatsiz.
---

# input() natijasini tozalash va tipga o'tkazmasdan ishlatish

## Nima uchun bu skill kerak
AI yoki dasturchi foydalanuvchi kiritmasini `input()` orqali oladi va darhol arifmetik amal yoki solishtirishda ishlatadi. `input()` har doim `str` qaytaradi va oxirida `\n` yoki bo'sh joylar bo'lishi mumkin. Natijada: `TypeError` (string + int), yoki `"5" == 5` False, yoki `" 5 "` solishtirishda muvaffaqiyatsiz. Bu oddiy, lekin keng tarqalgan xato — ayniqsa interaktiv skriptlar va CLI tool'larda.

## Simptom (aynan shu)
- `TypeError: unsupported operand type(s) for +: 'str' and 'int'` yoki shunga o'xshash.
- Foydalanuvchi "5" kiritgan, lekin shart `"5" == 5` ishlamaydi.
- Kiritilgan qiymatda bo'sh joy borligi sababli `"5 " != "5"`.
- Kod to'g'ri ko'rinadi, lekin runtime'da kutilmagan natija yoki xato.
- `input()` chaqirilgan, keyin darhol `if user_input == "yes":` yoki `total += user_input` ishlatilgan.

## Sabab (100%)
`input()` funksiyasi doim string qaytaradi. U avtomatik ravishda strip qilmaydi va tipga o'tkazmaydi. AI ko'pincha "foydalanuvchi raqam kiritadi" deb taxmin qiladi va `int(input())` yoki `.strip()` ni unutadi. Yoki faqat `input()` ni o'zgaruvchiga saqlab, keyin arifmetikada ishlatadi.

## Tasdiqlash
1. Kodda `input()` chaqiruvini toping.
2. Natija `.strip()` bilan tozalanganmi?
3. Agar raqam kutilayotgan bo'lsa, `int()` yoki `float()` qilinganmi?
4. Xato xabarida `str` va boshqa tip aralashuvi bormi?
5. Kiritilgan qiymatda trailing space borligini tekshirish uchun `repr(user_input)` qiling.

## Tuzatish (aynan shu)
Har doim strip qiling va kerakli tipga o'tkazing:

```python
# Noto'g'ri:
user_input = input("Son kiriting: ")
total = total + user_input  # TypeError

# To'g'ri:
user_input = input("Son kiriting: ").strip()
try:
    number = int(user_input)
    total = total + number
except ValueError:
    print("Iltimos, butun son kiriting")

# Ha/Yo'q uchun:
answer = input("Davom etasizmi? (ha/yo'q): ").strip().lower()
if answer == "ha":
    # ...
```

Agar bir necha marta so'ralayotgan bo'lsa, alohida funksiya yozing:

```python
def get_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt).strip())
        except ValueError:
            print("Iltimos, butun son kiriting")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`input()` doim string qaytaradi va bo'sh joylar bo'lishi mumkin. Uni ishlatishdan oldin `.strip()` qiling va agar raqam bo'lsa `int()`/`float()` bilan o'tkazing. Aks holda TypeError yoki muvaffaqiyatsiz solishtirishlar yuz beradi. Bu oddiy qoida, lekin uni unutish keng tarqalgan.
