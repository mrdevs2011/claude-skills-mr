---
name: async-missing-async-keyword
description: Funksiya ichida await ishlatilgan, lekin funksiya o'zi async deb e'lon qilinmagan — SyntaxError yoki kutilmagan xato.
---

# await bor, lekin async yo'q

## Nima uchun bu skill kerak
AI funksiya ichiga `await` yozadi, lekin funksiya e'lonida `async` ni unutadi. Bu oddiy, lekin tez-tez uchraydigan xato — ayniqsa mavjud funksiyaga `await` qo'shganda yoki callback'ni async qilganda. SyntaxError chiqadi yoki kod umuman ishlamaydi.

## Simptom (aynan shu)
- Xato: `SyntaxError: await is only valid in async functions` (yoki shunga o'xshash).
- Yoki TypeScript: `'await' expressions are only allowed within async functions`.
- Funksiya ichida `await` bor, lekin `async function` / `async () =>` yo'q.

## Sabab (100%)
`await` faqat `async` funksiya ichida ishlaydi. AI:
- Mavjud sync funksiyaga `await` qo'shgan, `async` ni qo'shmagan.
- Arrow function yoki method'da `async` ni unutgan.
- Ichki funksiyani async qilgan, tashqarisini emas (yoki aksincha).

## Tasdiqlash
1. Xato chiqqan qatordagi `await` ni toping.
2. U joylashgan funksiya e'loniga qarang.
3. `async` kalit so'zi bormi?
4. Agar yo'q — shu.

## Tuzatish (aynan shu)
Funksiyani `async` qiling:

```js
// XATO:
function loadUser(id) {
  const user = await fetchUser(id);  // SyntaxError
  return user;
}

// TO'G'RI:
async function loadUser(id) {
  const user = await fetchUser(id);
  return user;
}

// XATO (arrow):
const load = (id) => {
  return await fetchUser(id);
};

// TO'G'RI:
const load = async (id) => {
  return await fetchUser(id);
};

// XATO (method):
const obj = {
  async load() { ... },  // bu to'g'ri
  process() {
    await this.load();   // XATO — process async emas
  }
};

// TO'G'RI:
const obj = {
  async load() { ... },
  async process() {
    await this.load();
  }
};
```

Eslatma: funksiyani `async` qilsangiz — uni chaqirgan joyda ham `await` kerak bo'lishi mumkin (`AsyncFunctionReturnsPendingPromise...` skilliga qarang).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `await` ishlatilsa — funksiya `async` bo'lishi shart.
- Mavjud funksiyaga `await` qo'shganda `async` ni ham qo'shing.
- Chaqiruvchi joyni ham tekshiring.