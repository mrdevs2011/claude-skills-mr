---
name: javascript-foreach-return-does-not-exit-loop
description: forEach ichida return ishlatilgan — loop'dan chiqish kutilgan, lekin return faqat callback'ni tugatadi, qolgan elementlar baribir ishlanadi.
---

# forEach with return: loop continues

## Nima uchun bu skill kerak
JavaScript'da array.forEach callback ichida `return` yozilganda, developer odatda `break` kabi loop'dan chiqishni kutadi. Lekin `return` faqat o'sha callback funksiyasidan chiqadi — forEach o'zi davom etadi. Natijada "early exit" ishlamaydi, qo'shimcha ish bajariladi, yoki noto'g'ri holatda keyingi elementlar ishlanadi.

## Simptom (aynan shu)
- `array.forEach(item => { if (condition) return; ... })` yoki shunga o'xshash.
- Loop erta to'xtashi kerak edi (masalan, topilgan item'dan keyin), lekin barcha elementlar ishlanadi.
- Performance muammosi yoki side-effect'lar qayta-qayta bajariladi.
- `break` yozib bo'lmaydi (forEach da yo'q), shuning uchun return ishlatilgan.

## Sabab (100%)
`Array.prototype.forEach` har bir element uchun alohida callback chaqiradi. Callback ichidagi `return` faqat o'sha funksiyani tugatadi; forEach'ning o'zi return qiymatini e'tiborsiz qoldiradi va keyingi elementga o'tadi. `break`/`continue` faqat for/for-of/while da ishlaydi.

## Tasdiqlash
1. Kodda `.forEach(` qidiring.
2. Callback ichida `return` borligini tekshiring (ayniqsa if shartida).
3. Maqsad early exit yoki skip bo'lganini kontekstidan aniqlang.
4. Agar for-of yoki for loop ishlatilishi mumkin bo'lsa — bu skill.

## Tuzatish (aynan shu)
for-of yoki oddiy for ishlating, `break`/`continue` bilan:

```javascript
// XATO:
items.forEach(item => {
  if (item.id === targetId) {
    console.log("Topildi:", item);
    return; // faqat shu callback tugaydi, qolganlari davom etadi
  }
  process(item);
});

// TO'G'RI:
for (const item of items) {
  if (item.id === targetId) {
    console.log("Topildi:", item);
    break; // loop to'liq to'xtaydi
  }
  process(item);
}

// Yoki faqat skip kerak bo'lsa:
for (const item of items) {
  if (item.skip) continue;
  process(item);
}
```

Agar functional style saqlash kerak bo'lsa, `find`/`some`/`every` yoki filter ishlating, lekin side-effect'li early exit uchun for-of yaxshiroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `forEach` callback'dagi `return` loop'ni to'xtatmaydi — faqat o'sha iteratsiyani.
- Early exit yoki continue uchun `for`/`for-of` + `break`/`continue` ishlating.
- forEach side-effect'lar uchun mos, lekin control flow uchun emas.
