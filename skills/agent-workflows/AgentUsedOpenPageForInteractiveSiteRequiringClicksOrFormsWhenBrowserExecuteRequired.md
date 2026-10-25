---
name: agent-used-open-page-for-interactive-site-requiring-clicks-or-forms
description: Agent login, form to'ldirish yoki click talab qiladigan sayt uchun open_page yoki web_search ishlatadi — browser_execute bilan snapshot/click kerak bo'lganda.
---

# Agent interactive sayt uchun open_page ishlatdi, browser_execute kerak edi

## Nima uchun bu skill kerak
Ko'p saytlar JavaScript bilan ishlaydi, login formasi, tugmalar yoki dinamik content bor. open_page faqat matnni oladi, click yoki form to'ldirishni qila olmaydi. Natijada agent to'liq ma'lumot ololmaydi yoki xato qiladi.

## Simptom (aynan shu)
- Agent "saytni ochib, login qil yoki form to'ldir" so'rovida open_page(url) chaqiradi.
- Yoki web_search bilan "login page content" qidiradi.
- Tool natijasida faqat statik HTML matni keladi, lekin form elementlari yoki tugmalar ishlamaydi.
- Agent "login qila olmadim" yoki to'liq bo'lmagan javob beradi.
- browser_execute ishlatilmagan.

## Sabab (100%)
Agent open_page ni oddiy matn olish uchun mo'ljallanganini bilmaydi yoki browser_execute ning page.goto, snapshot, clickNode, fillNode imkoniyatlarini esdan chiqaradi. Interactive vazifa uchun to'g'ri tool tanlanmagan.

## Tasdiqlash
1. So'rovda "click", "form", "login", "fill", "button", "interact" so'zlari bormi?
2. Tool chaqiruvi faqat open_page yoki web_search mi?
3. browser_execute hech ishlatilmaganmi?
4. Natija to'liq emas yoki "could not interact" deb aytildimi?

Agar ha bo'lsa, shu skill.

## Tuzatish (aynan shu)
Interactive sayt uchun doim browser_execute ishlat:

```javascript
await page.goto(url);
const snap = await page.snapshot();
// kerakli node id ni top
await page.fillNode(nodeId, "username");
await page.clickNode(submitId);
await page.waitFor(2000);
const content = await page.evaluate(() => document.body.innerText);
```

open_page faqat to'liq statik matn yetarli bo'lganda ishlatiladi. Agar click/form kerak bo'lsa — browser_execute.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Interactive (login, click, form) vazifalarda open_page yetarli emas. browser_execute bilan to'g'ri snapshot va action qil. Bu agentni to'g'ri tool tanlashga majbur qiladi.
