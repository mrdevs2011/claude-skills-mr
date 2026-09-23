---
name: floating-promise-not-awaited-or-returned
description: Async funksiya chaqirilgan, lekin natija await qilinmagan, return qilinmagan va catch ham yo'q — floating promise. Xato yoki natija yo'qoladi.
---

# Floating promise: chaqirilgan, lekin kutulmagan

## Nima uchun bu skill kerak
AI async funksiyani chaqiradi va davom etadi: `doSomethingAsync();` — na `await`, na `return`, na `.catch`. Promise "suzib" yuradi. Agar xato bo'lsa — unhandled. Agar natija kerak bo'lsa — umuman olinmaydi. Bu `AsyncFunctionReturnsPendingPromise` va `IgnoredError` o'rtasidagi aniq holat: chaqiruv bor, lekin umuman bog'lanmagan.

## Simptom (aynan shu)
- `someAsync()` qatori bor, lekin oldida `await` yo'q, o'zgaruvchiga ham biriktirilmagan.
- ESLint: `no-floating-promises` ogohlantirishi.
- Funksiya "ishlayotgandek", lekin ichidagi ish tugamaydi yoki xato ko'rinmaydi.
- Ayniqsa event handler, useEffect, yoki oddiy sync funksiya ichida.

## Sabab (100%)
AI async chaqiruvni yozib, uni kutishni yoki qaytarishni unutadi. Yoki "fon rejimida ishlasin" deb o'ylaydi, lekin xato yo'lini ham qoldirmaydi.

## Tasdiqlash
1. Async funksiya chaqiruvlarini toping.
2. Har biri: `await` qilinganmi, `return` qilinganmi, yoki `.then/.catch` bog'langanmi?
3. Agar hech qaysi yo'q — floating promise.

## Tuzatish (aynan shu)
Yoki kutib turing, yoki aniq fire-and-forget qiling (catch bilan):

```js
// XATO — floating:
function handleClick() {
  saveData();  // promise e'tiborsiz
}

useEffect(() => {
  loadUser();  // floating
}, []);

// TO'G'RI — await (async handler):
async function handleClick() {
  await saveData();
}

// TO'G'RI — useEffect ichida:
useEffect(() => {
  void loadUser().catch(e => logger.error(e));
  // yoki
  (async () => {
    try {
      await loadUser();
    } catch (e) {
      logger.error(e);
    }
  })();
}, []);

// TO'G'RI — natijani qaytarish:
async function process() {
  return await saveData(); // chaqiruvchi await qiladi
}
```

Qoida: async chaqiruvni har doim `await`/`return`/`.catch` bilan bog'lang. "Suzib yurgan" promise qoldirmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `asyncFn()` — floating promise. Await yoki catch majburiy.
- useEffect va event handler'da ayniqsa tez unutiladi.
- AI chaqiruvni yozib, bog'lashni unutadi — natija yoki xato yo'qoladi.
