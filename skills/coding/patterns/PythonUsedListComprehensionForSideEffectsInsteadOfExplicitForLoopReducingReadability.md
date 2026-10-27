---
name: python-list-comprehension-side-effects
description: Python kodda list comprehension ichida print, append, yoki boshqa side-effect ishlatilgan — natija o'qilishi qiyin, debug qilish murakkab, va kutilmagan tartib yoki yo'qolgan natijalar.
---

# List comprehension ichida side-effect ishlatish

## Nima uchun bu skill kerak
List comprehension asosan yangi list yaratish uchun mo'ljallangan. Uni print, log, append yoki boshqa side-effect uchun ishlatish o'qilishni yomonlashtiradi, xatolarni yashiradi va kengaytirishni qiyinlashtiradi. Aniq for loop aniqroq va xavfsizroq.

## Simptom (aynan shu)
- Kodda `[print(x) for x in items]` yoki `[lst.append(process(x)) for x in items]` kabi yozuvlar.
- Natija list ishlatilmaydi, faqat side-effect kerak.
- Debug qilishda qaysi elementda xato bo'lganini aniqlash qiyin.
- Kod reviewda "bu nima qilayotganini tushunish qiyin" degan izohlar.

## Sabab (100%)
Dasturchi "qisqa yozish" uchun list comprehension ni for loop o'rniga ishlatadi, lekin uning asosiy maqsadi expression bo'lib, statement (side-effect) emasligini hisobga olmaydi. Python stil qo'llanmalari (PEP 8) buni tavsiya qilmaydi.

## Tasdiqlash
1. List comprehension ichida print, append, setattr yoki boshqa side-effect bormi?
2. Yaratilgan list keyin ishlatilmaydimi (faqat side-effect uchun)?
3. Agar shunday bo'lsa — bu holat. Aniq for loop kerak.

## Tuzatish (aynan shu)
Side-effect uchun oddiy for loop ishlat. List kerak bo'lsa alohida yarat.

Noto'g'ri:
```python
results = []
[results.append(process(item)) for item in items]
# yoki
[print(item) for item in items]
```

To'g'ri:
```python
results = []
for item in items:
    results.append(process(item))

# yoki faqat print uchun
for item in items:
    print(item)
```

Agar yangi list kerak bo'lsa va side-effect yo'q bo'lsa, comprehension saqlanadi:
```python
processed = [process(item) for item in items]
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
List comprehension faqat yangi list expression uchun. Side-effect (print, append, o'zgartirish) uchun doim aniq for loop ishlat — o'qilishi, debug qilinishi va kengaytirilishi osonroq.
