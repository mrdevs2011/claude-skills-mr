---
name: used-manual-index-counter-instead-of-enumerate
description: Loop ichida indeks kerak bo'lganda qo'lda counter o'zgaruvchi (i = 0; i += 1) ishlatilgan, enumerate() o'rniga — xato ehtimoli yuqori, kod noaniq.
---

# Loopda indeks uchun qo'lda counter o'rniga enumerate ishlatmaslik

## Nima uchun bu skill kerak
Agentlar (va dasturchilar) ro'yxatni aylanayotganda indeks kerak bo'lsa, alohida `i = 0` deb boshlab, har iteratsiyada `i += 1` qilishadi. Bu xato qilish oson (unutish, noto'g'ri joyda oshirish) va kodni o'qishni qiyinlashtiradi. Python'da `enumerate()` aynan shu uchun bor — indeks va qiymatni birga beradi, xavfsizroq.

## Simptom (aynan shu)
- `for item in items:` loopi ichida alohida `i = 0` yoki `index = 0` e'lon qilingan va `i += 1` bor.
- Indeks faqat loop ichida ishlatiladi, lekin `enumerate` yo'q.
- Ba'zan `range(len(items))` ishlatilgan, keyin `items[i]` olingan.
- Kod ishlaydi, lekin off-by-one yoki unutish xatosi ehtimoli bor. Yangi shart qo'shilganda counter oson buziladi.

## Sabab (100%)
Agent `enumerate` mavjudligini yoki uning afzalligini eslamaydi. Oddiy `for` yozib, keyin "indeks kerak ekan" deb qo'lda counter qo'shadi. Yoki boshqa tildan kelgan odat (C-style for loop).

## Tasdiqlash
1. Loop kodini ochib, `i = 0` yoki shunga o'xshash counter bormi tekshir.
2. `for ... in enumerate(...)` yo'qmi?
3. Agar `range(len())` + index access bo'lsa, enumerate bilan almashtirish mumkinmi?
4. Counter faqat indeks uchunmi yoki boshqa mantiqqa aralashganmi?

## Tuzatish (aynan shu)
`enumerate()` ishlatib, counterdan voz kech:

```python
# Noto'g'ri (qo'lda counter):
def process_items(items):
    i = 0
    for item in items:
        print(f"{i}: {item}")
        if i % 2 == 0:
            do_something(item)
        i += 1  # unutish oson

# To'g'ri (enumerate):
def process_items(items):
    for i, item in enumerate(items):
        print(f"{i}: {item}")
        if i % 2 == 0:
            do_something(item)
```

Yoki start=1 kerak bo'lsa: `enumerate(items, start=1)`.

Qoidalar:
- Indeks kerak bo'lsa doim `enumerate` ishlat.
- Qo'lda `i += 1` faqat murakkab holatlarda (masalan, shartli oshirish) qoldir.
- `range(len(list))` o'rniga ham enumerate afzal.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Loopda indeks uchun qo'lda counter o'rniga `enumerate()` ishlat.
- Bu xato ehtimolini kamaytiradi va kodni tozaroq qiladi.
- Python idiomatic usuli shu.