---
name: infinite-loop-missing-termination
description: while/for loop sharti hech qachon false bo'lmaydi yoki o'zgaruvchi yangilanmaydi — cheksiz sikl, sahifa/tab osilib qoladi.
---

# Cheksiz loop: to'xtash sharti yo'q

## Nima uchun bu skill kerak
AI `while (true)` yoki `while (x)` yozadi, lekin ichida `x` ni o'zgartirmaydi yoki `break` qo'ymaydi. Yoki `for` chegarasi noto'g'ri. Brauzer/tab muzlaydi, CPU 100%. Xato ba'zan darhol, ba'zan ma'lumotga bog'liq.

## Simptom (aynan shu)
- Sahifa/tab javob bermaydi, "Page Unresponsive".
- Terminal hang — Ctrl+C kerak.
- `while`, `for` ichida shart o'zgaruvchisi yangilanmaydi.
- `break` / `return` yo'q, shart doim true.

## Sabab (100%)
Loop sharti yozilgan, lekin iteratsiya ichida uni false qiladigan qadam unutilgan. Yoki off-by-one tufayli hech qachon tugamaydi.

## Tasdiqlash
1. `while` / `for` larni toping.
2. Har iteratsiyada shart o'zgaruvchisi o'zgaradimi?
3. `break` yoki `return` chiqish yo'li bormi?
4. Kichik misol bilan qo'lda sanab chiqing — tugaydimi?

## Tuzatish (aynan shu)
Shartni yangilang yoki aniq chiqish yozing:

```js
// XATO — x hech qachon o'zgarmaydi:
let x = 0;
while (x < 10) {
  doSomething();
  // x++ yo'q
}

// TO'G'RI:
let x = 0;
while (x < 10) {
  doSomething();
  x++;
}

// XATO — while(true) break yo'q:
while (true) {
  const item = queue.next();
  if (!item) { /* break unutilgan */ }
  process(item);
}

// TO'G'RI:
while (true) {
  const item = queue.next();
  if (!item) break;
  process(item);
}
```

Qoida: har loop da — shart qachon false bo'lishini aniq ko'ring. Shubha bo'lsa — max iteratsiya himoyasi qo'shing.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Loop = shart + o'sha shartni o'zgartiradigan qadam.
- break/return chiqish yo'li bo'lishi kerak.
- AI shartni yozib, yangilashni unutadi — hang.