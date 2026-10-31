---
name: python-builtin-name-shadowing
description: Python kodda list, str, id, type, sum kabi built-in nomlar o'zgaruvchi sifatida ishlatilgan — keyin built-in chaqirishda TypeError yoki noto'g'ri xatti-harakat.
---

# Built-in nomni o'zgaruvchi sifatida ishlatish (shadowing)

## Nima uchun bu skill kerak
Python built-in funksiyalari (`list`, `str`, `int`, `id`, `type`, `sum`, `min`, `max`, `len` va hokazo) global nomlar. Ularni o'zgaruvchi yoki funksiya nomi sifatida qayta ishlatish keyingi chaqiruvlarni buzadi va tushunish qiyin xatolarga olib keladi. Bu odatda "qisqa nom" istagidan kelib chiqadi, lekin ildiz sababi nomlash qoidalariga rioya qilmaslik.

## Simptom (aynan shu)
- `list = []` yoki `id = get_id()` kabi yozuvlar.
- Keyin `list(...)` yoki `id(...)` chaqirishda `TypeError: 'list' object is not callable` yoki shunga o'xshash.
- Funksiya ichida `sum = 0` dan keyin `sum(...)` ishlamaydi.
- Kod bir joyda ishlaydi, boshqa joyda (yoki keyinroq) ishlamaydi.

## Sabab (100%)
O'zgaruvchi nomi built-in nom bilan bir xil tanlangan. Python nom qidiruvi (LEGB) avval lokal/global o'zgaruvchini topadi, built-in ni emas. Natijada built-in funksiya "yashirinadi" (shadowed).

## Tasdiqlash
1. O'zgaruvchi yoki parametr nomi `list`, `dict`, `str`, `int`, `id`, `type`, `sum`, `min`, `max`, `file`, `input` kabi built-in bilan mos keladimi?
2. Shu nomdan keyin xuddi shu nomdagi built-in chaqirilayaptimi va xato chiqyaptimi?
3. Agar ha — bu holat. Nomni o'zgartir.

## Tuzatish (aynan shu)
Built-in nomlarni o'zgaruvchi sifatida ishlatma. Ma'noli, aniq nom tanla.

Noto'g'ri:
```python
list = [1, 2, 3]
new = list(list)          # TypeError
id = user.id
print(id(user))           # ishlamaydi
sum = 0
total = sum(numbers)      # TypeError
```

To'g'ri:
```python
items = [1, 2, 3]
new_items = list(items)   # built-in list() saqlanadi
user_id = user.id
print(id(user))           # ishlaydi
total = 0
result = sum(numbers)     # built-in sum() saqlanadi
```

Umumiy qoida: o'zgaruvchi nomlari qisqa bo'lishi mumkin, lekin built-in bilan to'qnashmasin. Zarurat bo'lsa `items_list`, `user_id`, `total_sum` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python built-in nomlarini (`list`, `id`, `sum` va boshqalar) o'zgaruvchi sifatida ishlatma — ularni shadow qiladi va keyingi chaqiruvlarni buzadi. Doim ma'noli, to'qnashmaydigan nom tanla.
