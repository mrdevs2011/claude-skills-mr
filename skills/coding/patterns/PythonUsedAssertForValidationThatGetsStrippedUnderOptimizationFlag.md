---
name: python-assert-stripped-under-optimization
description: Python kodida assert input tekshiruvi yoki muhim runtime shart uchun ishlatilgan. python -O yoki -OO bilan ishga tushirilganda assert o'chiriladi, shuning uchun tekshiruv ishlamaydi va xato yashirinadi yoki noto'g'ri davom etadi.
---

# Python assert optimizatsiya ostida o'chiriladi

## Nima uchun bu skill kerak
AI ko'pincha assert ni "tez tekshiruv" sifatida qo'yadi (masalan `assert user_id > 0` yoki `assert result is not None`). Lekin Python da assert debug vositasi, production da o'chirilishi mumkin. Natijada muhim tekshiruv yo'qoladi, xato keyinroq yoki jimlikda chiqadi.

## Simptom (aynan shu)
- Kod lokalda (oddiy `python script.py`) to'g'ri ishlaydi, assert xato bersa darhol to'xtaydi.
- Xuddi shu kod `python -O script.py`, `python -OO`, yoki production optimizatsiya bilan ishga tushirilganda assert o'tkazib yuboriladi.
- Keyinroq `AssertionError` o'rniga boshqa xato (TypeError, AttributeError, noto'g'ri natija) chiqadi yoki hech narsa aytmay noto'g'ri davom etadi.
- Stack trace da assert qatori yo'q, lekin logika buzilgan.

## Sabab (100%)
Python `assert` bayonoti `python -O` (optimize) yoki `-OO` rejimida butunlay olib tashlanadi (kompilyatsiya vaqtida). Bu ataylab shunday: assert faqat development/debug uchun. Input validatsiyasi, biznes qoidasi yoki "hech qachon bo'lmasligi kerak" shartlar uchun ishlatish xato — ular production da ham ishlashi shart.

## Tasdiqlash
1. Xato yoki noto'g'ri xatti-harakat chiqqan qatorni top.
2. O'sha joyda `assert shart` bor-yo'qligini tekshir.
3. Qanday ishga tushirilganini bil (`python -O`, gunicorn/uwsgi optimizatsiya, yoki `__debug__ == False`).
4. `python -O` bilan qayta ishga tushirib, assert endi ishlamasligini ko'r.
5. Agar assert olib tashlangach xato yo'qolsa yoki boshqa joyga siljisa — aynan shu sabab.

## Tuzatish (aynan shu)
Assert o'rniga aniq `if` + `raise` ishlat. Bu hech qachon o'chirilmaydi:

```python
# XATO (assert o'chirilishi mumkin):
def process_user(user_id: int, data: dict) -> None:
    assert user_id > 0, "user_id musbat bo'lishi kerak"
    assert "name" in data
    # ...

# TO'G'RI:
def process_user(user_id: int, data: dict) -> None:
    if user_id <= 0:
        raise ValueError("user_id musbat bo'lishi kerak")
    if "name" not in data:
        raise ValueError("data ichida 'name' kaliti yo'q")
    # ...
```

Agar haqiqatan debug-only tekshiruv bo'lsa (masalan ichki invariant), `if __debug__:` bilan o'rab qo'y yoki log qil, lekin input/API chegarasida hech qachon assert ishlatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `assert` production da (`-O`) yo'qoladi — uni validatsiya uchun ishlatma.
- Muhim shartlar uchun doim `if ...: raise ValueError(...)` (yoki mos exception) yoz.
- Assert faqat "bu hech qachon bo'lmasligi kerak, agar bo'lsa men xato qilganman" degan ichki debug tekshiruvlar uchun.
