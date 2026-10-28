---
name: javascript-array-sort-without-numeric-comparator
description: JavaScript'da Array.sort() raqamlar massiviga compare funksiyasiz chaqirilganda leksikografik (string) tartiblab, noto'g'ri tartib beradi.
---

# JavaScript Array.sort() raqamlarga compare funksiyasiz chaqirilganda leksikografik tartib

## Nima uchun bu skill kerak
Agentlar va dasturchilar ko'pincha `[3, 10, 1].sort()` deb yozishadi, chunki boshqa tillarda sort() odatda raqamli tartiblaydi. JavaScript'da esa default sort UTF-16 string taqqoslash qiladi, natijada 10 1 dan oldin keladi. Bu silent bug — xato chiqmaydi, lekin tartib noto'g'ri bo'ladi.

## Simptom (aynan shu)
- Raqamlar massivi `.sort()` bilan tartiblangan, lekin natija [1, 10, 2, 3] o'rniga [1, 10, 2, 3] yoki [10, 1, 2, 3] kabi leksikografik.
- Masalan: `[10, 5, 40, 25, 1000].sort()` → `[10, 1000, 25, 40, 5]` (string sifatida).
- Hech qanday TypeError yoki exception yo'q — faqat noto'g'ri tartib.
- Kod "ishlaydi", lekin UI'da, hisobotda yoki qidiruvda tartib buzilgan.

## Sabab (100%)
ECMAScript spetsifikatsiyasiga ko'ra, `Array.prototype.sort` compareFn berilmasa, elementlarni stringga aylantirib (`ToString`) va code point bo'yicha taqqoslaydi. Raqamlar uchun `a - b` kabi numeric comparator berilmasa, har doim string tartib ishlaydi. Agent "sort() raqamlarni tartiblaydi" deb taxmin qiladi yoki boshqa tildagi odatini ko'chiradi.

## Tasdiqlash
1. Massiv faqat raqamlardan iboratmi (yoki Number tipida)?
2. `.sort()` chaqirilgan, lekin hech qanday argument (compare funksiya) berilmaganmi?
3. Natijani console.log yoki assert bilan tekshir: kichik raqamlar katta raqamlardan oldin kelishi kerakmi, lekin kelmayaptimi?
4. `sort((a, b) => a - b)` qo'shilsa, to'g'ri tartib chiqadimi?

## Tuzatish (aynan shu)
Har doim raqamli tartib uchun aniq comparator ber:

```js
// Noto'g'ri (leksikografik):
const nums = [10, 5, 40, 25, 1000];
nums.sort();
console.log(nums); // [10, 1000, 25, 40, 5]

// To'g'ri (raqamli o'sish):
nums.sort((a, b) => a - b);
console.log(nums); // [5, 10, 25, 40, 1000]

// Kamayish uchun:
nums.sort((a, b) => b - a);

// Barqaror va aniq (NaN oldini olish uchun):
nums.sort((a, b) => {
  if (Number.isNaN(a)) return 1;
  if (Number.isNaN(b)) return -1;
  return a - b;
});
```

Qoidalar:
- Raqamlar uchun har doim `(a, b) => a - b` yoki ekvivalenti ishlat.
- String tartib kerak bo'lsa, aniq `localeCompare` yoki defaultni qoldir, lekin hujjatlashtir.
- TypeScript'da ham xuddi shu, chunki runtime JS.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- JavaScript `.sort()` default string taqqoslash qiladi, raqamli emas.
- Raqam massivini tartiblashda har doim numeric comparator ber.
- Bu silent bug — test qilmasdan ishonma.
