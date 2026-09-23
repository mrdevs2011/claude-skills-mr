---
name: loop-variable-closure-capture
description: Loop ichida yaratilgan callback/closure loop o'zgaruvchisini ushlaydi — barcha callback'lar oxirgi qiymatni ko'radi (var yoki noto'g'ri let ishlatilganda).
---

# Loop o'zgaruvchisi closure'da noto'g'ri ushlanadi

## Nima uchun bu skill kerak
AI `for` loop ichida `setTimeout`, event handler yoki async callback yozadi va loop o'zgaruvchisini (`i`, `item`) to'g'ridan-to'g'ri ishlatadi. `var` bilan yoki ba'zi holatlarda barcha callback'lar oxirgi qiymatni ko'radi. Xato chiqmaydi, lekin natija noto'g'ri.

## Simptom (aynan shu)
- 5 ta tugma, hammasi oxirgi elementni ko'rsatadi.
- `setTimeout` lar hammasi bir xil (oxirgi) indeks bilan ishlaydi.
- Loop'da yaratilgan async vazifalar bir xil qiymat bilan tugaydi.
- `var i` ishlatilgan, yoki IIFE/let bilan o'ralmagan.

## Sabab (100%)
Closure o'zgaruvchi referensini ushlaydi, qiymat nusxasini emas. Loop tugagach `i` oxirgi qiymatda qoladi — barcha kechikkan callback'lar shuni ko'radi. `let` blok scope beradi (har iteratsiyada yangi), `var` funksiya scope (bitta).

## Tasdiqlash
1. Loop ichida callback/async/setTimeout bormi?
2. Unda loop o'zgaruvchisi (`i`, `item`) to'g'ridan-to'g'ri ishlatilganmi?
3. `var` yoki `let`? Callback kechikkanmi (async)?
4. Agar ha — classic closure bug.

## Tuzatish (aynan shu)
`let` ishlating yoki qiymatni mahalliy o'zgaruvchiga oling:

```js
// XATO (var yoki umumiy muammo):
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// TO'G'RI — let (har iteratsiyada yangi binding):
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// TO'G'RI — forEach (har bir item o'z scope):
items.forEach((item, i) => {
  setTimeout(() => console.log(item, i), 100);
});

// TO'G'RI — qiymatni ushlab qolish:
for (var i = 0; i < 3; i++) {
  const current = i;
  setTimeout(() => console.log(current), 100);
}
```

Qoida: loop + kechikkan callback = `let` yoki mahalliy const. `var` dan saqlaning.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Closure qiymat emas, referens ushlaydi.
- Loop + async callback = oxirgi qiymat xavfi.
- `let` yoki forEach — xavfsizroq.