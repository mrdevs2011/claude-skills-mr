---
name: python-repeated-string-concatenation-in-loop-instead-of-list-join
description: Loop ichida string += yoki + bilan qayta-qayta qo'shib borish — O(n²) va sekin. Listga append qilib oxirida ''.join() ishlatish kerak edi.
---

# Loop ichida string concatenation o'rniga list + join

## Nima uchun bu skill kerak
Agentlar tez-tez natija stringini loop ichida `result += item` yoki `result = result + item` bilan yig'adi. Python'da stringlar immutable, shuning uchun har bir += yangi string yaratadi. Katta ro'yxatda bu sekinlashadi va memory ishlatadi. To'g'ri usul — listga append qilib, oxirida `''.join(parts)` qilish.

## Simptom (aynan shu)
- Kodda `result = ""` yoki `s = ""` dan keyin loop ichida `result += something` yoki `result = result + ...`.
- Katta data (minglab element) bilan ishlaganda sekinlashish yoki memory o'sishi.
- String qurish uchun oddiy loop ishlatilgan, lekin `join` yoki generator expression yo'q.
- Comment yoki logda "building string in loop" kabi narsalar.

## Sabab (100%)
Tez yozish uchun agent "stringni joyida qo'shib boraman" deb hisoblaydi. `str.join` yoki list accumulation patternini eslamaydi yoki "kichik data uchun farqi yo'q" deb o'tkazib yuboradi. Bu scalability va best practice ni buzadi.

## Tasdiqlash
1. Kodda `+=` yoki `+` bilan string yig'ilayotgan loopni qidir: `grep -nE 'result\s*\+=|s\s*\+=|.*\s*=\s*.*\s*\+' *.py`.
2. Loop ichida string o'zgaruvchi yangilanayaptimi va u keyin return/print qilinayaptimi?
3. Elementlar soni potentsial katta bo'lishi mumkinmi (user input, file, API response)?
4. `''.join` yoki list + join bormi? Yo'q bo'lsa — shu anti-pattern.

## Tuzatish (aynan shu)
Loop ichida string o'rniga listga append qil, oxirida join qil:

```python
# Noto'g'ri (O(n²) potentsial)
result = ""
for item in items:
    result += str(item) + ","
result = result.rstrip(",")

# To'g'ri
parts = []
for item in items:
    parts.append(str(item))
result = ",".join(parts)

# Yoki generator bilan (eng yaxshi)
result = ",".join(str(item) for item in items)
```

Agar separator kerak bo'lmasa yoki oddiy transform — `''.join(...)` ishlat. List comprehension ham mumkin: `",".join(str(x) for x in items)`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Loop ichida string += qilish immutable string tufayli samarasiz.
- Listga yig'ib `str.join` qilish O(n) va recommended.
- Generator expression yoki list comprehension bilan yanada toza bo'ladi.
- Kichik data uchun farqi sezilmasa ham, best practice sifatida join ishlat.
