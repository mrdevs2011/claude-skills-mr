---
name: python-used-file-object-after-with-block-exit-causing-iooperation-on-closed-file
description: Python code stores a file handle from a with-open block and attempts to read or write it after the block exits, raising ValueError: I/O operation on closed file.
---

# PythonUsedFileObjectAfterWithBlockExitCausingIOoperationOnClosedFile

## Nima uchun bu skill kerak
`with open(...) as f:` bloki tugagach fayl avtomatik yopiladi. Agent yoki dasturchi `f` ni blok tashqarisida ishlatishga urinadi (masalan, keyinroq `f.read()` yoki `f.write()`). Bu `ValueError: I/O operation on closed file` beradi. Skill aynan shu xato holatini va to'g'ri yechimini beradi.

## Simptom (aynan shu)
- Xato matni: `ValueError: I/O operation on closed file`
- Stack trace `f.read()`, `f.readline()`, `f.write()` yoki shunga o'xshash chaqiruvda
- Fayl `with open(...) as f:` ichida ochilgan, lekin `f` o'zgaruvchisi `with` blokidan tashqarida ishlatilgan
- Ba'zan `f` boshqa funksiyaga uzatilgan va u yerda ishlatilgan

## Sabab (100%)
`with` statement context manager `__exit__` chaqirilganda faylni yopadi. `f` o'zgaruvchisi hali ham mavjud, lekin uning ichki holati "closed". Keyingi I/O operatsiyasi shuning uchun xato beradi. Agent "with ichida ochildi, keyin ishlataman" deb o'ylagan.

## Tasdiqlash
1. Xato matni aynan "I/O operation on closed file" mi?
2. Fayl ochish `with open(...) as f:` bilan bajarilganmi?
3. `f` ga murojaat `with` blokining indentatsiyasidan tashqarida (yoki boshqa funksiyada) mi?
4. Agar ha — bu holat.

## Tuzatish (aynan shu)
Barcha fayl operatsiyalarini `with` bloki ichida bajar. Yoki kontentni ichida o'qib, tashqarida faqat ma'lumot bilan ishla.

Noto'g'ri:
```python
with open("data.txt") as f:
    pass  # yoki qisman ishlatish

content = f.read()  # ValueError: I/O operation on closed file
```

To'g'ri:
```python
with open("data.txt") as f:
    content = f.read()

# endi content bilan ishla, f emas
print(content)
```

Yoki butun ishni ichida:
```python
with open("data.txt") as f:
    for line in f:
        process(line)
```

Agar faylni keyinroq qayta ochish kerak bo'lsa — yangi `with` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`with` blokidan chiqilganda fayl yopiladi. `f` ni blok tashqarisida hech qachon ishlatma. Kontentni ichida o'qi yoki yoz, tashqarida faqat natija bilan ishla. Bu xato 100% shu sababdan kelib chiqadi.
