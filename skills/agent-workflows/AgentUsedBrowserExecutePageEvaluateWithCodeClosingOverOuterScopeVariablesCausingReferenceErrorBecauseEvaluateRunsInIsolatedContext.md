---
name: agent-browser-evaluate-closure-referenceerror
description: page.evaluate ichida tashqi o'zgaruvchilarni yopib olishga urinish ReferenceError beradi — evaluate izolyatsiya qilingan kontekstda ishlaydi.
---

# AgentUsedBrowserExecutePageEvaluateWithCodeClosingOverOuterScopeVariablesCausingReferenceErrorBecauseEvaluateRunsInIsolatedContext

## Nima uchun bu skill kerak
browser_execute toolida `page.evaluate(fn)` chaqiruvi browser kontekstida ishlaydi. Funksiya ichida tashqi (Node) o'zgaruvchilarni ishlatishga urinish ReferenceError beradi, chunki evaluate izolyatsiya qilingan.

## Simptom (aynan shu)
browser_execute ichida shunga o'xshash kod:
```js
const userId = "123";
await page.evaluate(() => {
  document.querySelector("#result").textContent = userId; // ReferenceError: userId is not defined
});
```
Yoki har qanday tashqi o'zgaruvchi (const, let, argument) evaluate callback ichida ishlatilganda "X is not defined" xatosi.

## Sabab (100%)
`page.evaluate` berilgan funksiyani browserning V8 kontekstiga serializatsiya qilib yuboradi. Tashqi scope (closure) o'tkazilmaydi. Faqat JSON-serializable argumentlar `page.evaluate(fn, arg)` orqali o'tadi.

## Tasdiqlash
1. Xato matnida "is not defined" va evaluate ichida ishlatilgan o'zgaruvchi nomi borligini tekshir.
2. O'zgaruvchi `page.evaluate` chaqiruvining tashqarisida e'lon qilinganini tasdiqla.
3. Hech qanday argument sifatida o'tkazilmaganini ko'r.

## Tuzatish (aynan shu)
Ma'lumotni ikkinchi argument sifatida o'tkaz:
```js
const userId = "123";
await page.evaluate((id) => {
  document.querySelector("#result").textContent = id;
}, userId);
```
Yoki murakkabroq obyekt uchun ham xuddi shunday — faqat JSON-compatible bo'lishi kerak.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`page.evaluate` izolyatsiya qilingan. Tashqi o'zgaruvchilarni to'g'ridan-to'g'ri ishlatma — har doim argument orqali o'tkaz. Bu ReferenceError'ni oldini oladi va kodni ishonchli qiladi.
