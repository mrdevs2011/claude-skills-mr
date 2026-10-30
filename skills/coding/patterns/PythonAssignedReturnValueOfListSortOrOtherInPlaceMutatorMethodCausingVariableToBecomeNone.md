---
name: python-assigned-return-of-inplace-method-none
description: "list.sort() yoki dict.update() kabi in-place metodning qaytgan None qiymatini o'zgaruvchiga qayta tayinlash. list.sort() ishlatilganda natija None bo'lib qolganda."
---

# Python: In-place metod natijasini o'zgaruvchiga qayta tayinlash None beradi

## Nima uchun bu skill kerak
Python'da ko'p mutatsiya qiluvchi metodlar (sort, update, extend, append ba'zida) hech narsa qaytarmaydi (None). Ularni `x = x.sort()` tarzida ishlatish o'zgaruvchini None qilib qo'yadi va keyingi ishlatishda TypeError yoki noto'g'ri natija beradi.

## Simptom (aynan shu)
- `my_list = my_list.sort()` dan keyin `my_list` None bo'ladi
- Keyingi `for item in my_list` yoki `my_list.append` da `TypeError: 'NoneType' object is not iterable` yoki shunga o'xshash
- `sorted_data = data.sort()` keyin sorted_data None
- Xuddi shunday `d = d.update({...})` yoki `s = s.extend([...])`

## Sabab (100%)
`list.sort()`, `list.reverse()`, `dict.update()`, `set.update()`, `list.extend()`, `list.append()` va boshqa ko'p mutator metodlar **None** qaytaradi. Ular ob'ektni o'z joyida o'zgartiradi va yangi qiymat qaytarmaydi. Qaytgan qiymatni qayta tayinlash o'zgaruvchini None bilan almashtiradi.

## Tasdiqlash
1. Xato matnida `'NoneType'` va `iterable` yoki `subscriptable` ko'rinadi.
2. Kodda `var = var.sort()`, `var = var.update(...)`, `var = var.extend(...)` yoki `var = var.append(...)` kabi qator bor.
3. `print(var)` yoki debuggerda var `None`.

## Tuzatish (aynan shu)
In-place metodni chaqir, qaytgan qiymatni tayinlama. Yoki yangi tartiblangan ro'yxat kerak bo'lsa `sorted()`.

**Noto'g'ri:**
```python
numbers = [3, 1, 2]
numbers = numbers.sort()  # numbers endi None
print(numbers)  # None
```

**To'g'ri:**
```python
numbers = [3, 1, 2]
numbers.sort()  # in-place, numbers o'zgardi
print(numbers)  # [1, 2, 3]

# Yoki yangi ro'yxat kerak bo'lsa:
sorted_numbers = sorted(numbers)  # original o'zgarmaydi
```

**Dict uchun:**
```python
# Noto'g'ri
config = config.update({"key": "value"})  # config = None

# To'g'ri
config.update({"key": "value"})
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`list.sort()`, `dict.update()` va shunga o'xshash metodlar None qaytaradi. Ularni `x = x.method()` qilib ishlatmang. Metodni chaqiring yoki `sorted()` / yangi ob'ekt yarating. Bu NoneType xatolarining 100% sababi shu.
