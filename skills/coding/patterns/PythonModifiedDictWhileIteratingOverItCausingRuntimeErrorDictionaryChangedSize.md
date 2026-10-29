---
name: python-modified-dict-while-iterating-runtimeerror
description: for loop bilan dict ustida (keys/items/values) iteratsiya qilayotganda dictga yangi element qo'shish yoki o'chirish RuntimeError: dictionary changed size during iteration chiqaradi.
---

# Python: dictni iteratsiya paytida o'zgartirish — RuntimeError: dictionary changed size during iteration

## Nima uchun bu skill kerak
AI kod yozayotganda dictni filtrlash, elementlarni o'chirish yoki yangi key qo'shish kerak bo'lganda to'g'ridan-to'g'ri for loop ichida `del d[key]` yoki `d[new_key] = value` qiladi. Bu Python'da klassik xato: dict iteratori hajm o'zgarishini sezadi va darhol RuntimeError beradi. List bilan farqi — list ba'zan silent skip qiladi, dict doim xato chiqaradi. Skill boshqa dict xatolaridan (masalan KeyError yoki shallow copy) farq qiladi — aynan size mutation paytida.

## Simptom (aynan shu)
- for key in my_dict: yoki for key, val in my_dict.items(): ichida del my_dict[key] yoki my_dict[new] = ...
- Darhol RuntimeError: dictionary changed size during iteration
- Loop to'liq ishlamaydi, qisman o'zgarishlar qolishi mumkin
- values() yoki keys() view ustida ham xuddi shunday

## Sabab (100%)
Python dict iteratori (keys/items/values view) ichki hajmni kuzatadi. Loop davomida dict.size o'zgarsa (qo'shish yoki o'chirish), iterator darhol RuntimeError chiqaradi. Bu xavfsizlik mexanizmi — noaniq holatni oldini olish uchun. List iteratoridan farqli, dict hech qachon silent o'tkazib yubormaydi.

## Tasdiqlash
1. Kodda for ... in dict / .keys() / .items() ichida shu dictga del yoki assignment borligini tekshiring.
2. Xato matni aynan "dictionary changed size during iteration" ekanini tasdiqlang.
3. Kichik misol: d = {'a':1, 'b':2}; for k in d: del d[k] — darhol RuntimeError.

## Tuzatish (aynan shu)
Dictni o'zgartirmang — avval kalitlar ro'yxatini oling yoki yangi dict yarating.

```python
# Noto'g'ri:
data = {"a": 1, "b": 2, "c": 3}
for key in data:
    if data[key] % 2 == 0:
        del data[key]  # RuntimeError: dictionary changed size during iteration

# To'g'ri 1 — keys ni listga aylantirib, keyin o'chirish:
data = {"a": 1, "b": 2, "c": 3}
for key in list(data.keys()):
    if data[key] % 2 == 0:
        del data[key]

# To'g'ri 2 — yangi dict (eng xavfsiz, comprehension):
data = {"a": 1, "b": 2, "c": 3}
data = {k: v for k, v in data.items() if v % 2 != 0}

# To'g'ri 3 — qo'shish kerak bo'lsa, avval yangi dict:
data = {"a": 1, "b": 2}
new_items = {}
for key, val in data.items():
    if val > 1:
        new_items[key + "_copy"] = val
data.update(new_items)  # loopdan keyin
```

Qoida: iteratsiya qilinayotgan dictning hajmini loop ichida o'zgartirmang. Avval list(keys) oling yoki yangi dict yarating.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- for key in dict: ichida dictga del yoki yangi key qo'shish RuntimeError: dictionary changed size during iteration beradi.
- Dict iteratori size o'zgarishini kuzatadi, list kabi silent skip qilmaydi.
- Tuzatish: list(data.keys()) bilan o'chirish yoki dict comprehension bilan yangi dict yaratish.
