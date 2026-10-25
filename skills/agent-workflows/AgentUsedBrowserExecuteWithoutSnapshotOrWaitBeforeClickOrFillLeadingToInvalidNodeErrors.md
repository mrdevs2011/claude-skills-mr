---
name: agent-used-browser-execute-without-snapshot-or-wait
description: browser_execute ichida page.goto dan keyin snapshot yoki wait qilmasdan clickNode/fillNode ishlatilgan — node id topilmaydi, stale element yoki timeout xatosi.
---

# Browser execute: snapshot/wait siz click yoki fill

## Nima uchun bu skill kerak
Agent brauzer tool'ini ishlatganda `page.goto(url)` dan keyin darhol `page.clickNode(id)` yoki `page.fillNode` chaqiradi. Sahifa to'liq yuklanmagan, DOM o'zgarmagan yoki snapshot olinmagan bo'lsa, node id'lar yaroqsiz bo'ladi. Natijada "node not found", stale element yoki timeout.

## Simptom (aynan shu)
- `browser_execute` code ichida `page.goto(...)` dan keyin to'g'ridan-to'g'ri `page.clickNode` / `page.fillNode` / `page.clickAt`.
- `page.snapshot()` chaqirilmagan yoki natija ishlatilmagan.
- `page.waitFor` yoki `page.waitForTimeout` yo'q.
- Tool natijasida "Node with id X not found", "element is not attached", yoki timeout.
- Sahifa dinamik (React/SPA) bo'lib, keyin elementlar paydo bo'ladi.

## Sabab (100%)
Agent tool schema'ni o'qib, "page.goto keyin snapshot kerak" deb o'ylamaydi. Yoki tezroq bo'lishi uchun wait va snapshot'ni o'tkazib yuboradi. Dinamik sahifalarda elementlar darhol mavjud emasligini hisobga olmaydi.

## Tasdiqlash
1. `browser_execute` code'ni o'qi: `page.goto` dan keyin `snapshot()` bormi?
2. `clickNode` yoki `fillNode` ishlatilganmi? Ularning id'lari oldingi `snapshot().nodes` dan olinganmi?
3. Tool chiqishida node not found yoki timeout bormi?
4. Agar ha — sabab shu.

## Tuzatish (aynan shu)
Har doim goto dan keyin snapshot ol, kerak bo'lsa kut, keyin id ishlat:

```js
// XATO:
await page.goto('https://example.com/login');
await page.clickNode(123); // id taxmin, hali snapshot yo'q

// TO'G'RI:
await page.goto('https://example.com/login');
await page.waitForTimeout(1500); // yoki aniq selector kutish mumkin bo'lsa
const snap = await page.snapshot();
// snap.nodes dan kerakli element id sini top (role, name bo'yicha)
const loginBtn = snap.nodes.find(n => n.name && n.name.includes('Login') && n.role === 'button');
if (loginBtn) {
  await page.clickNode(loginBtn.id);
} else {
  // boshqa yo'l yoki xato
}
```

Qoida:
- `page.goto` → (ixtiyoriy wait) → `page.snapshot()` → nodes dan id ol → `clickNode`/`fillNode`.
- Id'larni hech qachon taxmin qilma — snapshot natijasidan ol.
- Dinamik sahifa bo'lsa waitForTimeout yoki qayta snapshot qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- browser_execute da har doim snapshot olgandan keyin node id ishlat.
- Goto dan keyin darhol click qilma — sahifa yuklanishini kut va DOM ni o'qi.
- Taxminiy id yoki oldingi snapshot id'lari yaroqsiz bo'lishi mumkin.
