---
name: python-used-or-for-default-value-assignment-on-potentially-falsy-values-instead-of-explicit-is-none-check
description: `value = user_input or default` uslubi 0, "", False, [] kabi falsy qiymatlarni ham default bilan almashtiradi; faqat None uchun default qo'yish kerak bo'lsa `if value is None` yoki `value if value is not None else default` ishlat.
---

# Falsy qiymatlarda `or` bilan default qo'yish xatosi

## Nima uchun bu skill kerak
Python da `or` operatori har qanday falsy qiymatni (None, False, 0, "", [], {}) o'tkazib yuboradi. Konfiguratsiya, foydalanuvchi inputi yoki API javobida 0 yoki bo'sh string to'g'ri qiymat bo'lishi mumkin, lekin `or` uni default bilan almashtirib yuboradi va yashirin mantiq xatosi chiqadi.

## Simptom (aynan shu)
Kod ba'zi inputlarda kutilmagan default qiymat ishlatadi: foydalanuvchi 0 kiritsa yoki bo'sh ro'yxat yuborsa, kod uni e'tiborsiz qoldirib defaultni oladi. Masalan, `count = request.args.get("count") or 10` da count=0 bo'lsa ham 10 chiqadi. Loglarda yoki natijada "default ishlatildi" deb yoziladi, garchi explicit 0 berilgan bo'lsa ham.

## Sabab (100%)
`a or b` ifodasi `a` truthy bo'lsa `a` ni, aks holda `b` ni qaytaradi. Truthy/falsy tekshiruvi `bool(a)` ga asoslanadi, `is None` emas. Shuning uchun 0, "", False, bo'sh konteynerlar ham "yo'q" deb hisoblanadi.

## Tasdiqlash
Kodda `or` bilan default berilgan joylarni qidir (ayniqsa config, args, env, dict.get or). Test:

```python
def get_timeout(value=None):
    return value or 30

print(get_timeout(0))    # 30 (noto'g'ri, 0 kutilgan)
print(get_timeout(""))   # 30
print(get_timeout(None)) # 30 (to'g'ri)
```

Agar 0 yoki bo'sh string mantiqan mumkin bo'lsa, muammo bor.

## Tuzatish (aynan shu)
Faqat None ni default bilan almashtir:

```python
# Noto'g'ri
timeout = config.get("timeout") or 30
items = user_list or ["default"]

# To'g'ri
timeout = config.get("timeout")
if timeout is None:
    timeout = 30

# yoki bir qatorda
timeout = 30 if config.get("timeout") is None else config.get("timeout")

# yoki
raw = config.get("timeout")
timeout = raw if raw is not None else 30
```

Agar haqiqatan ham barcha falsy larni default qilish kerak bo'lsa (kam hollarda), aniq komment qo'y: `# intentional: treat 0 and "" as missing`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`or` bilan default berish faqat None emas, barcha falsy qiymatlarni (0, "", False, []) ham defaultga almashtiradi. Aniq "None bo'lsa default" kerak bo'lsa doim `is None` tekshiruvini ishlat — yashirin mantiq xatolarini oldini oladi.
