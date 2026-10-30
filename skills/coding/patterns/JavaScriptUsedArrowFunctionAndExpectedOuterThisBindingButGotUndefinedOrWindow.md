---
name: js-arrow-function-unexpected-this
description: Arrow function ichida `this` ishlatilganda outer scope'dan lexical binding kutiladi, lekin event handler, method yoki callback sifatida ishlatilganda `this` undefined yoki window/global bo'lib qoladi.
---

# JavaScript: Arrow function'da kutilmagan `this` binding

## Nima uchun bu skill kerak
Arrow function'lar lexical `this` ishlatadi — o'zi yaratilgan scope'dan `this`ni oladi. Method, event listener yoki ba'zi callback'larda odam regular function kabi `this` = object/element kutadi, lekin arrow'da shunday bo'lmaydi. Natija: undefined, TypeError yoki noto'g'ri object.

## Simptom (aynan shu)
- `Cannot read properties of undefined (reading '...')` event handler yoki method ichida
- `this` window/global yoki undefined (strict mode)
- Class method yoki object method arrow function sifatida yozilgan va `this.prop` ishlamaydi
- Event listener: `element.addEventListener('click', () => { this... })` da `this` element emas

## Sabab (100%)
Arrow function o'zining `this`ini yaratmaydi. U outer lexical scope'dan `this`ni oladi. Regular function esa chaqirilish usuliga qarab `this`ni oladi (method call -> object, event -> element, va h.k.). Arrow ishlatilganda shu dynamic binding yo'qoladi.

## Tasdiqlash
1. Xato chiqqan funksiya arrow (`() =>`) ekanini tekshir.
2. U method, event handler, setTimeout callback yoki object literal ichidami?
3. Ichida `this.` ishlatilganmi va kutilgan object/element emasmi?
4. Agar regular function (`function() {}`) qilib o'zgartirilsa ishlaydimi? — ha bo'lsa, aynan shu.

## Tuzatish (aynan shu)
Kutilgan `this` dynamic bo'lishi kerak bo'lsa — regular function ishlat. Lexical kerak bo'lsa — arrow to'g'ri.

```js
// XATO: arrow method — this outer'dan (ko'pincha undefined)
const obj = {
  name: 'test',
  greet: () => {
    console.log(this.name); // undefined yoki window
  }
};

// TO'G'RI: regular method
const obj = {
  name: 'test',
  greet() {
    console.log(this.name); // 'test'
  }
};

// Event listener
// XATO:
button.addEventListener('click', () => {
  this.classList.add('active'); // this !== button
});

// TO'G'RI:
button.addEventListener('click', function() {
  this.classList.add('active'); // this === button
});

// Yoki explicit bind / class field arrow faqat kerak joyda
```

Class ichida arrow field ishlatish mumkin agar lexical `this` (instance) kerak bo'lsa, lekin method sifatida emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Arrow function lexical `this` oladi, o'z dynamic `this`ini yaratmaydi.
- Method, event handler, callback'da `this` object/element bo'lishi kerak bo'lsa — regular `function` ishlat.
- Arrow faqat outer `this`ni saqlash kerak bo'lganda (masalan nested callback) to'g'ri tanlov.
