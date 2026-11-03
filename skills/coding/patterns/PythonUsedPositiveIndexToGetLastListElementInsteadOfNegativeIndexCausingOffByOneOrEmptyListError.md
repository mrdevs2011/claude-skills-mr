---
name: positive-index-for-last-element
description: List yoki arrayning oxirgi elementini olish uchun `len(items)-1` yoki hardcoded katta index ishlatiladi — Python/JS da `items[-1]` negative index o'rniga. Bo'sh list yoki dinamik uzunlikda IndexError yoki noto'g'ri element olinadi.
---

# List oxirgi elementini positive index bilan olish

## Nima uchun bu skill kerak
AI kod yozganda listning oxirgi elementini olish uchun ko'pincha `items[len(items)-1]` yoki `items[n-1]` deb yozadi. Bu ishlaydi, lekin Python va JS da idiomatik va xavfsizroq yo'l `items[-1]` (negative indexing). Positive usul bo'sh listda xato beradi, uzunlik o'zgarganda off-by-one riski yuqori, va kodni o'qish qiyinroq.

## Simptom (aynan shu)
- Kodda `items[len(items) - 1]`, `arr[arr.length - 1]` yoki `data[n - 1]` ko'rinishi.
- Bo'sh list/array da `IndexError: list index out of range` yoki `undefined` qaytadi.
- List o'lchami o'zgaradigan joyda noto'g'ri element olinadi yoki exception.
- Kod "ishlaydi" deb ko'rinadi, lekin edge case (bo'sh, 1 element) da yiqiladi.

## Sabab (100%)
1. Negative indexing (`-1`) ni bilmaslik yoki esdan chiqarish.
2. Boshqa tillardan (C, Java eski usul) kelgan odat: har doim `length-1`.
3. AI "xavfsiz" deb hisoblab explicit length hisoblaydi, lekin aslida xavfsiz emas (bo'sh holatni tekshirmaydi).

## Tasdiqlash
1. Oxirgi element olinayotgan joylarni qidir: `len(...) - 1`, `.length - 1`, yoki hardcoded katta index.
2. Shu list bo'sh bo'lishi mumkinligini tekshir.
3. Negative index ishlatilganmi? (`[-1]`, `at(-1)`).
4. Agar positive va length hisoblash bor — bu skill mos.

## Tuzatish (aynan shu)
Negative index ishlat:

```python
# Noto'g'ri:
last = items[len(items) - 1]   # bo'sh bo'lsa IndexError

# To'g'ri:
if items:                      # bo'sh tekshiruv kerak bo'lsa
    last = items[-1]
else:
    last = None                # yoki default

# Yoki:
last = items[-1] if items else None
```

```javascript
// Noto'g'ri:
const last = arr[arr.length - 1];

// To'g'ri:
const last = arr.at(-1);       // yoki arr[arr.length - 1] lekin .at(-1) modern
// yoki
const last = arr.length ? arr[arr.length - 1] : undefined;
```

Agar list doim kamida 1 element ekanligi kafolatlangan bo'lsa ham, `-1` o'qilishi osonroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- List oxirgi elementini olishda `len()-1` o'rniga `[-1]` ishlat.
- Bu qisqaroq, idiomatik va ba'zi edge case larda aniqroq.
- Bo'sh list ehtimoli bo'lsa har doim tekshiruv qo'sh.
