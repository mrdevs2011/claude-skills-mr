---
name: string-index-or-slice-out-of-bounds
description: String/array indeks yoki slice uzunlikdan tashqari — undefined, bo'sh string, yoki ba'zi tillarda exception. Off-by-one ga yaqin, lekin indeks/slice uchun.
---

# Indeks yoki slice chegaradan tashqari

## Nima uchun bu skill kerak
AI `str[i]`, `arr.slice(a, b)`, `str.substring(0, n)` yozadi. `i` yoki `n` uzunlikdan katta yoki manfiy bo'lishi mumkin. JS da ko'pincha `undefined`/bo'sh, boshqa tillarda crash. Input uzunligi o'zgaruvchan bo'lganda chiqadi.

## Simptom (aynan shu)
- `str[i]` → `undefined` (kutilgan belgi).
- `slice` kutilganidan qisqa yoki bo'sh.
- Input qisqa bo'lganda xato yoki noto'g'ri natija.
- `charAt`, `substring`, indeks loop da chegarasiz.

## Sabab (100%)
Uzunlik tekshirilmagan. AI "yetarli uzun" deb o'ylaydi yoki off-by-one qiladi.

## Tasdiqlash
1. Indeks/slice ishlatilgan joylarni toping.
2. Indeks/uzunlik inputga bog'liqmi?
3. `length` tekshiruvi yoki Math.min bormi?
4. Agar yo'q — xavf bor.

## Tuzatish (aynan shu)
Chegarani tekshiring:

```js
// XATO:
const first = str[0];           // str "" bo'lsa undefined
const part = str.slice(0, 10);  // qisqa string da qisqa natija (OK), lekin
const c = str[index];           // index >= length → undefined

// TO'G'RI:
const first = str.length > 0 ? str[0] : '';
const part = str.slice(0, Math.min(10, str.length));
const c = index >= 0 && index < str.length ? str[index] : '';

// Yoki:
if (index < 0 || index >= str.length) {
  throw new Error('Index out of bounds');
}
```

Qoida: indeks/slice dan oldin — `length` bilan solishtiring.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Indeks uzunlikdan katta = undefined yoki crash.
- Input uzunligi o'zgaruvchan — guard kerak.
- AI chegarani tekshirmasdan indeks ishlatadi.