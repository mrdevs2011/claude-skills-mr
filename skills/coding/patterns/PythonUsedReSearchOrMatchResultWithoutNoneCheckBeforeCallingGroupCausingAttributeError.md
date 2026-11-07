---
name: python-re-result-none-check-before-group
description: re.search yoki re.match natijasini None ekanligini tekshirmasdan .group() chaqirish AttributeError beradi — pattern mos kelmasa.
---

# re.search/match natijasini None tekshirmasdan .group() chaqirish

## Nima uchun bu skill kerak
Python `re` moduli `search` va `match` mos kelmasa `None` qaytaradi. Agentlar ko'pincha natija har doim Match object bo'ladi deb taxmin qilib, darhol `.group()` chaqiradi. Bu runtime AttributeError ga olib keladi, ayniqsa user input yoki tashqi ma'lumotlarda.

## Simptom (aynan shu)
- `AttributeError: 'NoneType' object has no attribute 'group'`
- Kod ishlaydi faqat pattern har doim mos kelsa; boshqa holatlarda crash.
- `match = re.search(pattern, text); result = match.group(1)` kabi kod.
- Xato faqat ba'zi inputlarda chiqadi, boshqalarida yo'q.

## Sabab (100%)
Agent `re.search`/`re.match` har doim Match qaytaradi deb o'ylaydi yoki "agar mos kelmasa keyin tekshiraman" deb qoldiradi. None holatini oldindan handle qilmaydi.

## Tasdiqlash
1. `re.search` yoki `re.match` chaqiruvi bormi?
2. Natija o'zgaruvchisi darhol `.group()` yoki `.groups()` bilan ishlatilganmi?
3. `if match is None` yoki `if match:` tekshiruvi yo'qmi?
4. Xato logida AttributeError 'NoneType' .group bo'lsa — bu skill.

## Tuzatish (aynan shu)
Har doim None tekshiruvini qo'sh:

```python
# Noto'g'ri:
match = re.search(r'(\d+)', user_input)
number = match.group(1)  # crash agar mos kelmasa

# To'g'ri:
match = re.search(r'(\d+)', user_input)
if match is None:
    number = None  # yoki default, yoki exception
else:
    number = match.group(1)

# Yoki walrus + guard:
if match := re.search(r'(\d+)', user_input):
    number = match.group(1)
else:
    number = None
```

Agar optional bo'lsa, `re.fullmatch` yoki boshqa usullarni ham ko'rib chiq. Patternni raw string qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`re.search` va `re.match` mos kelmasa `None` qaytaradi. `.group()` chaqirishdan oldin har doim `if match is not None` (yoki equivalent) tekshiruvi qo'y. Bu oddiy AttributeError'larni oldini oladi.
