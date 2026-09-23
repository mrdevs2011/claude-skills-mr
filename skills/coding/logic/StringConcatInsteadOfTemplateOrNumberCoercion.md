---
name: string-concat-or-number-coercion
description: + operatori string bilan ishlatilganda raqam qo'shish o'rniga birlashtirish (concatenation) bo'ladi — 1+2="12" yoki "Total: " + 5 + 3 = "Total: 53".
---

# String concat: raqam qo'shish o'rniga birlashtirish

## Nima uchun bu skill kerak
AI `+` bilan "raqam qo'shish" yoki "matn + raqam" yozadi. Agar bir tomon string bo'lsa, JavaScript hammasini string qilib birlashtiradi. Natija: `1 + 2 + "3" = "33"`, yoki hisob-kitob noto'g'ri. Xato chiqmaydi, lekin mantiq buziladi.

## Simptom (aynan shu)
- Hisob-kitob kutilganidan boshqacha (5+3=53 kabi).
- `"Total: " + a + b` da a va b alohida qo'shilmaydi.
- API'dan kelgan raqam string bo'lib qolgan (`"10"`), `+` uni yig'indi qilmaydi.
- Template literal ishlatilmagan, oddiy `+` bilan matn yig'ilgan.

## Sabab (100%)
`+` operatori: ikkala tomon number bo'lsa — qo'shadi; bittasi string bo'lsa — concat qiladi. AI tipni hisobga olmaydi yoki API javobini number deb o'ylaydi.

## Tasdiqlash
1. `+` ishlatilgan ifodalarni toping (ayniqsa matn + o'zgaruvchi).
2. Operandlar tipi nima — string yoki number?
3. Kutilgan natija yig'indi mi, matn mi?
4. Agar yig'indi kerak bo'lsa va string aralashgan bo'lsa — shu.

## Tuzatish (aynan shu)
Raqam uchun aniq number, matn uchun template:

```js
// XATO — concat:
const total = "Jami: " + a + b;  // a=5, b=3 → "Jami: 53"
const sum = value1 + value2;     // value1="10" → "105" (agar value2=5)

// TO'G'RI — matn:
const total = `Jami: ${a + b}`;  // avval yig'indi, keyin matn
// yoki
const total = "Jami: " + (a + b);

// TO'G'RI — raqam:
const sum = Number(value1) + Number(value2);
// yoki
const sum = +value1 + +value2;
```

Qoida: matn yig'ish — template literal (`` `...${}` ``). Raqam yig'ish — ikkala tomon number ekanini kafolatlang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `+` string ko'rsa — qo'shmaydi, birlashtiradi.
- API/input dan kelgan "raqam" ko'pincha string.
- AI tipni tekshirmasdan `+` ishlatadi — jim noto'g'ri natija.