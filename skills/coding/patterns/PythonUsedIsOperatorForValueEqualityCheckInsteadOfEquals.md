---
name: python-used-is-operator-for-value-equality-check-instead-of-equals
description: Qiymatni solishtirishda `is` (identity) operatori ishlatilganda noto'g'ri True/False chiqadi; string, son, list va boshqa obyektlar uchun `==` ishlatish kerak. Faqat None/True/False uchun `is` to'g'ri.
---

# Qiymat solishtirishda `is` o'rniga `==` ishlatish

## Nima uchun bu skill kerak
`is` operatori obyektlarning bir xil ekanligini (identity, id() bir xil) tekshiradi, qiymatini emas. Kichik integer yoki interned stringlarda tasodifan ishlaydi, lekin umumiy holatda xato natija beradi va kod noaniq bo'ladi.

## Simptom (aynan shu)
Kod ba'zan to'g'ri, ba'zan noto'g'ri ishlaydi: bir xil qiymatli string yoki raqamlar `is` bilan False qaytaradi. Masalan, `a = "hello"; b = "hello"; a is b` True bo'lishi mumkin (interning), lekin `a = "hello world"; b = "hello world"` da False. Yoki foydalanuvchi inputi bilan solishtirganda muvaffaqiyatsiz.

## Sabab (100%)
`is` va `is not` identity operatorlari — ular `id(a) == id(b)` ga teng. `==` esa `__eq__` orqali qiymat solishtiradi. Python kichik integerlar (-5..256) va ba'zi stringlarni intern qiladi, shuning uchun tasodifan ishlaydi, lekin bu kafolat emas va kod portativ emas.

## Tasdiqlash
Kodda `==` o'rniga `is` ishlatilganligini qidir. None, True, False dan tashqari joylarda. Test qil:

```python
a = "test" * 2
b = "test" * 2
print(a is b)   # odatda False
print(a == b)   # True
```

Yoki katta raqam: `1000 is 1000` False bo'lishi mumkin.

## Tuzatish (aynan shu)
Qiymat solishtirish uchun doim `==` yoki `!=` ishlat. Identity faqat singletonlar (None, True, False) uchun:

```python
# Noto'g'ri
if user_input is "yes":
    proceed()

# To'g'ri
if user_input == "yes":
    proceed()

# None uchun to'g'ri (va tavsiya etiladi)
if value is None:
    handle_missing()
```

Agar identity kerak bo'lsa (bir xil obyekt), `is` ni saqlab, lekin aniq komment qo'y.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python da qiymat solishtirish uchun `==` ishlatish kerak; `is` faqat identity (asosan None) uchun. Tasodifan ishlashi (interning) ga ishonma — portativ va to'g'ri kod uchun `==` tanla.
