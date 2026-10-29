---
name: open-page-on-js-rendered-site-incomplete
description: open_page tool'i og'ir JavaScript bilan render qilinadigan sahifada ishlatilganda bo'sh yoki to'liq bo'lmagan kontent qaytadi — browser_execute kerak.
---

# open_page og'ir JS-rendered sahifada to'liq bo'lmagan kontent beradi

## Nima uchun bu skill kerak
Agentlar tez-tez `open_page` ni har qanday URL uchun ishlatadi, lekin ba'zi zamonaviy saytlar kontentni to'liq serverda emas, mijoz tomonida JavaScript orqali render qiladi. Natijada `open_page` faqat bo'sh skeleton yoki qisman HTML qaytaradi, agent noto'g'ri xulosa chiqaradi yoki ma'lumotni o'tkazib yuboradi.

## Simptom (aynan shu)
- `open_page` chaqirilgan, lekin qaytgan matn juda qisqa, "Loading...", bo'sh divlar yoki faqat title/meta.
- Sahifa brauzerda ochilganda to'liq kontent (ro'yxatlar, ma'lumotlar, jadval) ko'rinadi.
- Agent "sahifada hech narsa yo'q" yoki "ma'lumot topilmadi" deb xulosa qiladi.
- URL SPA (Single Page Application) yoki React/Vue/Angular asosidagi sayt.

## Sabab (100%)
`open_page` oddiy HTTP fetch + HTML parsing qiladi, JavaScript'ni ishga tushirmaydi. Kontent dinamik ravishda JS orqali DOM'ga qo'shilsa, tool uni ko'rmaydi. `browser_execute` esa haqiqiy brauzer sessiyasida sahifani ochadi, JS'ni bajaradi va to'liq render qilingan kontentni beradi.

## Tasdiqlash
- `open_page` natijasi 100-200 belgidan kam va "loading" yoki bo'shmi?
- Bir xil URL `browser_execute` bilan ochilganda to'liq matn chiqadimi?
- Sahifa source'ida (yoki network) katta JS bundle'lar bormi?
- Kontent `<div id="root">` yoki shunga o'xshash bo'sh konteyner ichidami?

## Tuzatish (aynan shu)
JS-rendered yoki interaktiv sahifa uchun **darhol** `browser_execute` ishlat:

```javascript
// browser_execute ichida
await page.goto('https://example.com/data-page');
await page.waitForTimeout(2000); // yoki waitForSelector
const text = await page.evaluate(() => document.body.innerText);
console.log(text.slice(0, 5000));
```

Qoidalar:
1. Statik, server-rendered HTML uchun `open_page` (tezroq, arzonroq).
2. "Loading...", bo'sh natija, SPA belgisi bo'lsa — `browser_execute` ga o't.
3. Kerak bo'lsa `page.waitForSelector` yoki timeout bilan kut.
4. Faqat kerakli qismni `evaluate` bilan ol, butun DOM'ni emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`open_page` JS'ni bajarmaydi. Og'ir client-side render qilinadigan sahifada to'liq bo'lmagan kontent olasan. Bunday hollarda `browser_execute` ishlatib, haqiqiy brauzerda sahifani och va matnni ol.
