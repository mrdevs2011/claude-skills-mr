---
name: browser-execute-undocumented-api-or-app-js
description: Agent browser_execute ichida page.evaluate orqali undocumented HTTP API'ga fetch qiladi yoki app JS yuklab oladi — bu bloklanadi, noaniq va ruxsat etilmagan; faqat page.snapshot, click, evaluate on visible content ishlatilishi kerak.
---

# Browser execute ichida undocumented API yoki app JS ishlatish

## Nima uchun bu skill kerak
browser_execute tool'i aniq qoida beradi: "Do not fetch undocumented HTTP APIs or download app JS." AI ba'zan tezkor yechim sifatida page.evaluate ichida fetch('/api/...') yoki JS fayllarni o'qib ma'lumot olishga urinadi. Bu sayt siyosatiga zid, tez-tez bloklanadi, o'zgaruvchan va skill arxitekturasiga mos emas. Natijada scraping ishlamaydi yoki xato beradi.

## Simptom (aynan shu)
- browser_execute kodida `fetch`, `XMLHttpRequest`, `page.evaluate` ichida tarmoq so'rovi yoki script src yuklash ko'rinadi.
- Natija bo'sh, CORS xato, 403/429, yoki "access denied" qaytadi.
- Tool chaqiruvi muvaffaqiyatli, lekin ma'lumot noto'g'ri yoki to'liq emas.
- Kod "tezroq" deb yozilgan, lekin barqaror emas.

## Sabab (100%)
Agent browser_execute qoidalarini e'tiborsiz qoldirdi yoki "tezkor" deb hisoblab undocumented endpoint yoki app bundle'ni to'g'ridan-to'g'ri o'qishga qaror qildi. page.snapshot / clickNode / evaluate faqat visible text va DOM bilan ishlashi kerakligi unutilgan.

## Tasdiqlash
1. browser_execute ga yuborilgan `code` matnini o'qi.
2. Ichida `fetch(`, `axios`, `XMLHttpRequest`, `.js` yuklash, yoki `/api/` kabi path'lar bormi tekshir.
3. Tool natijasida tarmoq xatosi, bo'sh data yoki blok xabari bormi.
4. Agar bor bo'lsa — bu aynan shu xato.

## Tuzatish (aynan shu)
Faqat ruxsat etilgan usullarni ishlat: page.goto, page.snapshot, page.clickNode, page.fillNode, page.evaluate faqat visible content uchun.

```js
// XATO:
await page.evaluate(async () => {
  const res = await fetch('/api/internal/data');
  return await res.json();
});

// TO'G'RI:
await page.goto('https://example.com/data-page');
const snap = await page.snapshot();
// snapshot nodes dan kerakli matnni o'qi yoki click orqali och
const data = await page.evaluate(() => document.querySelector('.visible-data').innerText);
```

Agar sahifa JS bilan render bo'lsa — snapshot + wait ishlat, API'ni o'zing chaqirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- browser_execute ichida undocumented API yoki app JS yuklash taqiqlangan va barqarorsiz.
- Har doim page.snapshot, click, visible evaluate ishlat.
- Bu qoida tool description'da aniq yozilgan — o'qib amal qil.
