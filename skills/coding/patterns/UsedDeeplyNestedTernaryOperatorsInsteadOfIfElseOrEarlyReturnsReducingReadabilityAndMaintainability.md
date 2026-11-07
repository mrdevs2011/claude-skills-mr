---
name: nested-ternary-operators-reduce-readability
description: Kodda chuqur o'rnatilgan ternary operatorlar (a ? b : c ? d : e) ishlatilgan — o'qilishi qiyin, xato qilish oson, debug qilish murakkab.
---

# Chuqur o'rnatilgan ternary operatorlar o'qilishni yomonlashtiradi

## Nima uchun bu skill kerak
Ternary operator qisqa shartli ifoda uchun foydali, lekin 2-3 darajadan chuqur o'rnatilganda kodni tushunish qiyinlashadi. Xatolar yashirinadi, review qilish va o'zgartirish vaqti oshadi. Aniq if/else yoki early return yaxshiroq.

## Simptom (aynan shu)
- Kodda `condition1 ? value1 : condition2 ? value2 : condition3 ? value3 : default` kabi yozuvlar.
- Bir qatorda yoki bir necha qatorda ko'p ? : belgilar.
- O'qiyotganda "qaysi shart qaysi qiymatga mos" degan savol tug'iladi.
- Bug paydo bo'lganda qaysi tarmoq ishlaganini aniqlash qiyin.

## Sabab (100%)
Dasturchi "qisqa kod" yozishni maqsad qiladi va ternary ni if/else o'rniga ishlatadi, lekin murakkablik oshganda o'qilish va xavfsizlikni hisobga olmaydi. Ko'p tillarda (JS, Python, TS) bu anti-pattern hisoblanadi.

## Tasdiqlash
1. Ternary operatorlar 2 yoki undan ko'p darajada o'rnatilganmi?
2. Shartlar yoki qiymatlar murakkabmi?
3. Agar ha — if/else yoki early return ga o'zgartirish kerak.

## Tuzatish (aynan shu)
Chuqur ternary ni aniq if/else yoki early return ga almashtir.

Noto'g'ri:
```javascript
const result = user ? user.admin ? 'admin' : user.active ? 'user' : 'inactive' : 'guest';
```

To'g'ri:
```javascript
function getRole(user) {
  if (!user) return 'guest';
  if (user.admin) return 'admin';
  if (user.active) return 'user';
  return 'inactive';
}
const result = getRole(user);
```

Yoki Python:
```python
# Noto'g'ri
result = 'admin' if user and user.admin else 'user' if user and user.active else 'guest'

# To'g'ri
def get_role(user):
    if not user:
        return 'guest'
    if user.admin:
        return 'admin'
    if user.active:
        return 'user'
    return 'inactive'
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Chuqur ternary operatorlar o'qilishni va maintainability ni yomonlashtiradi. Murakkab shartlar uchun doim aniq if/else, early return yoki alohida funksiya ishlat — xatolar kamayadi, kod tushunarli bo'ladi.
