---
name: python-iterated-over-dict-and-modified-it-during-loop-causing-runtimeerror-or-skipped-keys
description: Dict ustida for loop bilan iteratsiya qilayotganda kalit qo'shish yoki o'chirish RuntimeError yoki ba'zi elementlarni o'tkazib yuborishga olib keladi. Oldindan list(dict) yoki yangi dict yaratib tuzatish kerak.
---

# Dict iteratsiyasi paytida o'zgartirish xatosi

## Nima uchun bu skill kerak
Python dict'i for loop ichida o'zgartirilganda (keys add/delete) iterator yaroqsiz bo'ladi. Bu RuntimeError chiqaradi yoki ba'zi kalitlarni o'tkazib yuboradi, natija noaniq bo'ladi. Ko'p hollarda bu xato faqat ma'lum sharoitlarda paydo bo'ladi.

## Simptom (aynan shu)
Kod ba'zan ishlaydi, ba'zan `RuntimeError: dictionary changed size during iteration` chiqaradi. Yoki loop barcha kalitlarni qayta ishlamaydi — ba'zilari o'tkazib yuboriladi. Masalan, filterlash yoki tozalash paytida.

## Sabab (100%)
Dict iterator'i ichki holatni saqlaydi. Loop ichida `del d[key]` yoki `d[new] = val` qilinsa, o'lcham o'zgaradi va iterator yaroqsizlanadi. Python 3 da bu RuntimeError beradi. List yoki set da ham shunga o'xshash, lekin dict'da eng keng tarqalgan.

## Tasdiqlash
Kodda `for key in d:` yoki `for k, v in d.items():` ichida `del`, `pop`, yoki yangi kalit qo'shish borligini qidir. Test:

```python
d = {'a': 1, 'b': 2, 'c': 3}
for k in d:
    if d[k] > 1:
        del d[k]  # RuntimeError yoki o'tkazib yuborish
```

## Tuzatish (aynan shu)
Iteratsiya uchun oldindan kalitlar ro'yxatini ol yoki yangi dict yarat:

```python
# Noto'g'ri
for k in d:
    if should_remove(k):
        del d[k]

# To'g'ri: list(d) bilan
for k in list(d):
    if should_remove(k):
        del d[k]

# Yoki yangi dict
d = {k: v for k, v in d.items() if not should_remove(k)}

# Yoki items() view o'rniga list
for k, v in list(d.items()):
    if condition:
        del d[k]
```

Agar faqat o'qish kerak bo'lsa, hech narsa o'zgartirma. Katta dict'larda `list(d)` xotira iste'mol qiladi — shunda comprehension yaxshiroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Dict (va boshqa mutable container) ni for loop ichida o'zgartirma. Oldindan `list(keys)` ol yoki yangi struktura yarat. Aks holda RuntimeError yoki noaniq o'tkazib yuborish bo'ladi.
