---
name: python-used-re-match-expecting-entire-string-match-but-only-matches-from-start
description: re.match() faqat satr boshidan mos kelishni tekshiradi, butun satrni emas; re.fullmatch() yoki ^...$ ishlatilmasa noto'g'ri True qaytaradi.
---

# re.match() butun satr o'rniga faqat boshidan mos kelishni tekshiradi

## Nima uchun bu skill kerak
Python `re.match(pattern, string)` faqat stringning boshidan patternni qidiradi va topilsa Match obyektini qaytaradi. Ko'p dasturchilar "butun satr shu patternga mos" deb o'ylaydi, lekin oxirida qo'shimcha matn bo'lsa ham True (Match) qaytaradi. Bu validation, parsing yoki sanitizationda silent xatolarga olib keladi — noto'g'ri ma'lumot o'tib ketadi.

## Simptom (aynan shu)
- `if re.match(r'^\d+$', user_input):` o'rniga `if re.match(r'\d+', user_input):` ishlatilgan.
- "123abc" kabi qiymat "faqat raqam" tekshiruvidan o'tib ketadi.
- Email, ID, username validationda qo'shimcha belgilar qabul qilinadi.
- Patternda `^` yoki `$` yo'q, lekin butun satr kutilgan.
- `re.match` natijasi None emas deb hisoblanadi, lekin butun satr mos emas.

## Sabab (100%)
`re.match` `re.search` ga o'xshaydi, lekin faqat boshidan boshlanadi (implicit `^`). U oxirgacha mos kelishni talab qilmaydi. Butun satrni tekshirish uchun `re.fullmatch` (Python 3.4+) yoki patternga `^...$` qo'shish kerak. Bu farq hujjatlarda bor, lekin oson unutiladi.

## Tasdiqlash
1. Kodda `re.match(` bor va natija True/False yoki if shartida ishlatilganmi?
2. Patternda `$` yoki `\Z` yo'qmi, va butun satr kutilganmi?
3. Test misolida "pattern + qo'shimcha matn" True qaytarmoqdamii?
4. `re.fullmatch` o'rniga `re.match` ishlatilganmi?

## Tuzatish (aynan shu)
Butun satrni tekshirish uchun `re.fullmatch` ishlat:

```python
import re

# noto'g'ri — "123abc" ham o'tadi
if re.match(r'\d+', user_input):
    process(user_input)

# to'g'ri
if re.fullmatch(r'\d+', user_input):
    process(user_input)

# yoki eski usul (patternga $ qo'sh)
if re.match(r'^\d+$', user_input):
    process(user_input)
```

Agar faqat boshidan boshlanishi kerak bo'lsa (prefix), `re.match` to'g'ri. Butun satr uchun doim `fullmatch` yoki `$` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`re.match` faqat boshidan mos kelishni tekshiradi, butun satrni emas. Validation uchun `re.fullmatch(pattern, string)` ishlat yoki patternni `^...$` bilan yoz. Bu silent false-positive'larni oldini oladi.
