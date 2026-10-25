---
name: regex-missing-raw-string-or-escaping
description: Regex pattern ishlatilganda backslash yoki maxsus belgilarni to'g'ri escape qilmaslik yoki raw string ishlatmaslik sababli PatternSyntaxError, noto'g'ri match yoki umuman ishlamaslik.
---

# Regex: raw string yoki to'g'ri escaping yo'q

## Nima uchun bu skill kerak
AI yoki dasturchi regex yozganda oddiy string ichida `\d`, `\s`, `.` kabi belgilarni qo'yadi. Python/JS'da backslash string escape sifatida talqin qilinadi, natijada pattern buziladi yoki kutilmagan match beradi. Bu debugging emas — pattern yozishdagi e'tiborsizlik.

## Simptom (aynan shu)
- `re.error: bad escape` / `SyntaxError` / `Invalid regular expression`
- Pattern "ishlayapti" lekin noto'g'ri natija (masalan `\d` o'rniga `d` yoki literal backslash kutilyapti)
- Kodda `re.compile("\\d+")` yoki `"\d+"` ko'rinadi, raw string (`r"..."`) yo'q
- JS'da `/pattern/` o'rniga string ichida noto'g'ri escape

## Sabab (100%)
String literal ichida `\` escape character sifatida ishlaydi. Regex engine'ga yetib borishdan oldin string parser `\` ni yutib yuboradi yoki noto'g'ri talqin qiladi. Raw string (`r"\d+"`) yoki ikki marta escape (`"\\d+"`) ishlatilmagan.

## Tasdiqlash
1. Regex yaratilayotgan qatorni top (`re.compile`, `new RegExp`, `.match`, `.replace`).
2. Pattern string raw (`r"..."`) yoki to'g'ri double-escapedmi?
3. Agar oddiy `"..."` va ichida `\d`, `\s`, `\w`, `.`, `+` va h.k. bo'lsa — bu aynan shu xato.
4. `print(repr(pattern))` yoki console.log bilan patternning haqiqiy qiymatini ko'r — kutilganidan farq qiladimi?

## Tuzatish (aynan shu)
Python'da raw string, JS'da literal regex yoki to'g'ri escape ishlat:

```python
# XATO:
pattern = "\\d+"          # yoki "\d+" — string parser buzadi
re.findall(pattern, text)

# TO'G'RI:
pattern = r"\d+"          # raw string
re.findall(pattern, text)
# yoki
pattern = "\\d+"          # double escape (kamroq tavsiya)
```

```js
// XATO:
const re = new RegExp("\\d+");  // ba'zan ishlaydi, lekin chalkash
const bad = new RegExp("\d+");   // noto'g'ri

// TO'G'RI:
const re = /\d+/;                 // literal (eng yaxshi)
const re2 = new RegExp("\\d+");   // string bo'lsa double escape
```

Maxsus belgilarni (`.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`, `}`, `|`, `^`, `$`, `\`) literal qidirish kerak bo'lsa — ularni ham escape qil (`\.`, `\*` va h.k.).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Regex pattern string ichida yozilsa, backslash'lar string escape bilan to'qnashadi.
- Tuzatish: Python'da doim `r"pattern"`, JS'da imkon qadar `/pattern/` literal ishlat.
- Pattern yozishdan oldin `repr()` yoki log bilan haqiqiy qiymatni tekshir — kutilgan pattern chiqayotganini tasdiqla.
