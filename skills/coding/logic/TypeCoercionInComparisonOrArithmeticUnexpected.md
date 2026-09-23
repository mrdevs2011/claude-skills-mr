---
name: type-coercion-comparison-or-arithmetic
description: Turli tipdagi qiymatlar solishtiriladi yoki hisoblanadi — "10" > 9 true, "10" - 1 = 9, lekin "10" + 1 = "101". Kutilmagan natija.
---

# Tip majburlash: solishtirish yoki arifmetika

## Nima uchun bu skill kerak
AI string va number ni aralashtirib solishtiradi yoki hisoblaydi. JavaScript avtomatik tip o'zgartiradi: `"10" > 9` → true, lekin tartib/lexicographic chalkashishi mumkin. `"10" + 1` concat, `"10" - 1` number. Natija kutilganidan farq qiladi, xato chiqmaydi.

## Simptom (aynan shu)
- API/input dan kelgan "raqam" string, lekin `>`, `<`, `+`, `-` ishlatilgan.
- Sort noto'g'ri: `["10","9","8"]` string sort.
- `value > 0` — value `"0"` yoki `""` bo'lganda kutilmagan.
- Hisob-kitob ba'zan string, ba'zan number.

## Sabab (100%)
Tip aniq emas. AI `Number()` yoki `parseInt` qilmasdan to'g'ridan-to'g'ri operatsiya qiladi.

## Tasdiqlash
1. Solishtirish/arifmetika joylarida operand tipi nima?
2. Input/API dan kelganmi — string bo'lishi mumkinmi?
3. `typeof` yoki aniq convert bormi?
4. Agar yo'q — coercion xavfi.

## Tuzatish (aynan shu)
Aniq tipga o'tkazing:

```js
// XATO:
if (input > 10) { ... }           // input = "9" → false (lekin "10" > 9 true)
const sum = price + tax;          // ikkalasi string bo'lsa concat
items.sort((a, b) => a.price - b.price); // price string bo'lsa chalkash

// TO'G'RI:
if (Number(input) > 10) { ... }
const sum = Number(price) + Number(tax);
items.sort((a, b) => Number(a.price) - Number(b.price));

// Yoki kirishda:
const amount = Number(rawAmount);
if (Number.isNaN(amount)) throw new Error('Invalid number');
```

Qoida: solishtirish/arifmetikadan oldin — Number()/parseInt va NaN tekshiruvi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- String va number aralashsa — natija kutilmagan bo'lishi mumkin.
- API/input ko'pincha string qaytaradi.
- AI tipni tekshirmasdan operatsiya qiladi.