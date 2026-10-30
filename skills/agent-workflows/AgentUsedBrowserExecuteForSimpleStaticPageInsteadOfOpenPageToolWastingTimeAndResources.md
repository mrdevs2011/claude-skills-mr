---
name: agent-used-browser-execute-for-simple-static-page
description: Agent oddiy static HTML sahifa yoki API endpoint uchun browser_execute ishlatdi — open_page yetarli edi, ortiqcha resurs va vaqt sarflandi, snapshot/click kerak emas edi.
---

# Oddiy static sahifa uchun browser_execute ishlatish

## Nima uchun bu skill kerak
browser_execute og'ir: brauzer ochadi, JS ishga tushiradi, snapshot oladi. Oddiy static matn, dokumentatsiya yoki API javobi uchun open_page tezroq va yetarli. Noto'g'ri tool tanlash sekinlashtiradi va context'ni ifloslantiradi.

## Simptom (aynan shu)
- So'rov oddiy matn, README, docs, yoki JSON API haqida.
- Agent browser_execute bilan page.goto + snapshot + evaluate qildi.
- Sahifada interaktiv element yo'q, faqat o'qish kerak edi.
- Natija open_page bilan ham olinardi, lekin sekinroq chiqdi.

## Sabab (100%)
Agent "brauzer har doim ishonchli" deb taxmin qildi yoki open_page ni esdan chiqardi. Static kontent uchun yengil tool yetarli ekanini tekshirmadi.

## Tasdiqlash
1. Sahifa asosan static HTML/matnmi yoki API javobimi?
2. Click, fill, scroll, yoki JS interaction kerakmi?
3. Agar interaction yo'q bo'lsa — open_page ishlatilishi kerak edi. browser_execute ortiqcha.

## Tuzatish (aynan shu)
Oddiy o'qish uchun open_page ishlat. Faqat interaktiv, JS-rendered, yoki click/fill kerak bo'lganda browser_execute ga o't.

Noto'g'ri (oddiy docs uchun):
```python
# browser_execute bilan
await page.goto("https://example.com/docs")
snapshot = await page.snapshot()
# keyin text chiqarish
```

To'g'ri:
```python
# open_page bilan
result = open_page(url="https://example.com/docs")
# to'g'ridan-to'g'ri matn
```

Agar sahifa JS bilan to'ldirilsa va open_page bo'sh qaytarsa — shunda browser_execute ga o't.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy static sahifa yoki matn uchun doim open_page ishlat. browser_execute faqat haqiqiy brauzer interaction (click, form, JS-rendered kontent) kerak bo'lganda. Bu vaqt va tokenni tejaydi.
