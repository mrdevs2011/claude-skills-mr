---
name: used-regex-for-simple-string-checks
description: Oddiy prefix, suffix, contains yoki aniq moslik tekshiruvi uchun regex ishlatish — sekinroq, o'qish qiyin va xato ehtimoli yuqori. Oddiy string metodlari yetarli bo'lganda.
---

# Oddiy string tekshiruvi uchun regex ishlatish

## Nima uchun bu skill kerak
Agentlar va dasturchilar ba'zan "hamma narsani regex bilan qilay" deb, oddiy prefix/suffix/contains tekshiruvlarini re.compile yoki re.match/search bilan yozadi. Bu kodni o'qishni qiyinlashtiradi, kichik xatolar (escaping, flag) kiritadi va oddiy holatlarda sekinroq ishlaydi. Patterns kategoriyasidagi boshqa oddiy yechimlar bilan mos.

## Simptom (aynan shu)
- Kodda `re.match(r'^prefix', text)`, `re.search(r'suffix$', text)` yoki `re.search(r'keyword', text)` ishlatilgan.
- Vazifa faqat boshlanish, tugash yoki ichida bor-yo'qligini tekshirish (oddiy string operatsiya).
- Regex flag'lar yoki guruhlar umuman kerak emas.
- O'qiyotganda "nima uchun regex?" degan savol tug'iladi.
- Kichik inputda ham sezilarli sekinlik yoki xato escaping.

## Sabab (100%)
Agent "regex kuchliroq, bir usulda hamma narsani qilaman" deb hisoblab, Python/JS ning oddiy `str.startswith`, `str.endswith`, `str.find` / `in` operatorini tekshirmagan. Yoki eski koddan nusxa olgan.

## Tasdiqlash
- Tekshiruv faqat prefix, suffix yoki oddiy substringmi?
- Regex'da guruh, lookaround, flag yoki murakkab pattern bormi? (yo'q bo'lsa oddiy metod yetarli)
- `re` import qilingan, lekin faqat shu oddiy ish uchunmi?
- Kod o'qilishi va xato ehtimoli oddiy metodga nisbatan yomonroqmi?

## Tuzatish (aynan shu)
Oddiy holatlarda **string metodlarini** ishlat:

1. Prefix: `text.startswith("prefix")` (regex `r'^prefix'` o'rniga)
2. Suffix: `text.endswith("suffix")` (regex `r'suffix$'` o'rniga)
3. Contains: `"keyword" in text` yoki `text.find("keyword") != -1` (regex `r'keyword'` o'rniga)
4. Aniq tenglik: `text == "exact"` (regex `r'^exact$'` o'rniga)
5. Faqat haqiqatan murakkab pattern (masalan, bir nechta variant, oraliq, guruh) kerak bo'lganda regex ishlat.
6. Agar regex saqlansa, raw string (`r"..."`) va to'g'ri escapingni tekshir.

```python
# Noto'g'ri
import re
if re.match(r'^https://', url):
    ...
if re.search(r'\.md$', filename):
    ...

# To'g'ri
if url.startswith("https://"):
    ...
if filename.endswith(".md"):
    ...
```

```javascript
// Noto'g'ri
if (/^https:\/\//.test(url)) { ... }

// To'g'ri
if (url.startsWith("https://")) { ... }
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Oddiy prefix/suffix/contains uchun hech qachon regex ishlatma — `startswith`, `endswith`, `in` yetarli va yaxshiroq.
- Regex faqat haqiqatan murakkab pattern kerak bo'lganda ishlatiladi.
- Bu kodni o'qilishi oson, xatosiz va biroz tezroq qiladi.
