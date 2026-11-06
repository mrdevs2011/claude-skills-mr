---
name: javascript-used-foreach-with-async-callback-without-proper-await
description: JavaScript forEach bilan async callback ishlatilganda promise'lar kutilmaydi — operatsiyalar parallel ishga tushadi, lekin tugashi kutilmaydi. Qachon: forEach ichida await yoki async funksiya ishlatilgan bo'lsa.
---

# JavaScript forEach async callback'ni kutmaydi

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar massiv elementlarini ketma-ket yoki parallel qayta ishlash uchun `array.forEach(async (item) => { await doSomething(item); })` yozadi. Bu ishlamaydi — forEach async funksiyani kutmaydi, barcha callback'lar darhol ishga tushadi va asosiy kod davom etadi. Natijada race condition, to'liq bajarilmagan ish yoki xato tartib.

## Simptom (aynan shu)
- `forEach` ichida `async` arrow function yoki `await` ishlatilgan.
- Kutilgan ketma-ket bajarilish yoki "hammasi tugagach davom et" bo'lmaydi.
- Keyingi kod forEach tugashidan oldin ishlaydi.
- Promise'lar floating qoladi, unhandled rejection chiqishi mumkin.
- Console'da "done" oldin, keyin async log'lar chiqadi.

## Sabab (100%)
`Array.prototype.forEach` sinxron metod. U callback'ni chaqiradi va darhol keyingisiga o'tadi. Agar callback `async` bo'lsa, u Promise qaytaradi, lekin forEach bu Promise'ni e'tiborsiz qoldiradi va kutmaydi. Natijada barcha async ishlar parallel ishga tushadi (yoki hech qachon kutilmaydi).

## Tasdiqlash
- Kodda `array.forEach(async ...)` yoki `forEach` ichida `await` bormi?
- Asosiy funksiya forEach dan keyin darhol davom etadimi?
- Promise.all yoki for...of + await ishlatilmaganmi?
- Floating promise ogohlantirishi yoki tartib xatosi bormi?

## Tuzatish (aynan shu)
forEach o'rniga `for...of` + `await` (ketma-ket) yoki `Promise.all` + `map` (parallel) ishlat.

Ketma-ket (tartib muhim bo'lsa):
```javascript
async function processSequentially(items) {
  for (const item of items) {
    await doSomething(item);  // har biri tugagach keyingisi
  }
  console.log("Hammasi tugadi");
}
```

Parallel (tezlik muhim, tartib emas):
```javascript
async function processInParallel(items) {
  await Promise.all(items.map(item => doSomething(item)));
  console.log("Hammasi tugadi");
}
```

Misol (xato vs to'g'ri):
```javascript
// Xato — kutilmaydi
items.forEach(async (item) => {
  await fetchData(item);
});
console.log("Bu forEach tugashidan oldin chiqadi");

// To'g'ri
for (const item of items) {
  await fetchData(item);
}
console.log("Endi hammasi tugagan");
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `forEach` async callback'ni hech qachon kutmaydi — bu uning dizayni.
- Ketma-ketlik kerak bo'lsa `for...of` + `await`, parallel kerak bo'lsa `Promise.all(map(...))` ishlat.
- Bu oddiy almashtirish floating promise va race condition'larni bartaraf etadi.
