---
name: off-by-one-loop-or-slice
description: Loop, slice, substring yoki massiv indeksi bir birlikka noto'g'ri (bir ortiq yoki bir kam) — natija bo'sh, oxirgi element tushib qoladi yoki chegaradan chiqadi.
---

# Off-by-one: bir ortiq yoki bir kam

## Nima uchun bu skill kerak
AI loop chegarasi, `slice`, `substring`, `range` yoki indeks hisobida bir birlikka adashadi. Syntax xato chiqmaydi, lekin oxirgi element tushib qoladi, bo'sh massiv qaytadi yoki `index out of range` bo'ladi. Bu mantiqiy xatolarning eng klassik va eng ko'p uchraydigan turi.

## Simptom (aynan shu)
- Oxirgi element ishlov berilmaydi yoki aksincha qo'shimcha (mavjud bo'lmagan) element olinadi.
- `slice(0, n)` o'rniga `slice(0, n-1)` yoki aksincha.
- Loop `i < length` o'rniga `i <= length` (yoki aksincha) yozilgan.
- Xato ba'zan chiqadi (`index out of bounds`), ba'zan jim noto'g'ri natija beradi.

## Sabab (100%)
Chegara sharti noto'g'ri tanlangan:
- `i < arr.length` vs `i <= arr.length`
- `slice(start, end)` da `end` kiritilmaydi — buni unutish
- `0`-based indeks bilan `1`-based o'ylash
- `length - 1` kerak joyda `length` yozish (yoki aksincha)

## Tasdiqlash
1. Kutilgan natijani aniq yozing (masalan: "3 elementli massivdan oxirgi 2 tasini olish").
2. Loop/slice ifodasini oling.
3. Kichik misol bilan qo'lda hisoblang: `arr = [a,b,c]`, `length = 3`.
4. Haqiqiy indekslar va kutilgan indekslarni solishtiring.

## Tuzatish (aynan shu)
Chegarani aniq qilib yozing va kichik misol bilan tekshiring:

```js
// XATO (oxirgi element tushib qoladi):
for (let i = 0; i < arr.length - 1; i++) { ... }

// TO'G'RI:
for (let i = 0; i < arr.length; i++) { ... }

// XATO (slice end kiritilmaydi — unutilgan):
const lastThree = arr.slice(-3, -1); // oxirgi tushib qoladi

// TO'G'RI:
const lastThree = arr.slice(-3);     // yoki slice(arr.length - 3)

// XATO:
const firstN = arr.slice(0, n - 1);

// TO'G'RI:
const firstN = arr.slice(0, n);
```

Har doim 2-3 elementli massiv bilan qo'lda tekshirib chiqing.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Off-by-one — xato chiqarmaydigan, lekin natijani buzadigan eng ko'p mantiq xatosi.
- Loop/slice yozgach — kichik misol bilan qo'lda hisoblang.
- `length` vs `length - 1`, `slice` end qoidasini alohida eslab qoling.