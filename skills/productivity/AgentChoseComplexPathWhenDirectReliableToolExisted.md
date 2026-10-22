---
name: chose-complex-path-when-direct-tool-existed
description: Bir necha yo'l bo'lganda eng arzon/to'g'ridan-to'g'ri tool yoki buyruq o'rniga murakkab brauzer/UI qadamlari tanlandi — sekin, context og'ir, xato ehtimoli yuqori.
---

# To'g'ridan-to'g'ri yo'l o'rniga murakkab qadam tanlash

## Nima uchun bu skill kerak
Agentlar ba'zan "to'liqroq" yoki odat bo'yicha brauzer, skrinshot, UI bosish yo'llarini tanlaydi, holbuki bitta to'g'ridan-to'g'ri tool, API, URL yoki buyruq yetarli. Bu token, vaqt va xato ehtimolini oshiradi. instruction.md dagi "Eng arzon ishonchli yo'lni tanla" qoidasiga zid.

## Simptom (aynan shu)
- Oddiy ma'lumot olish uchun browser_execute yoki ko'p qadamli UI ishlatilgan.
- To'g'ridan-to'g'ri `open_page`, `web_search`, `bash` yoki maxsus tool (weather, sports) bor ekan, lekin ishlatilmagan.
- Natija bir xil, lekin 5-10 qadam o'rniga 1 qadam yetarli bo'lardi.
- Foydalanuvchi "tezroq", "oddiy" deb aytgan yoki shubha qilgan.

## Sabab (100%)
Agent "har doim brauzer ochib ko'ray" yoki "to'liq jarayonni ko'rsatay" deb hisoblab, eng qisqa ishonchli yo'lni tekshirmagan. Mavjud tool katalogini yoki instruction.md dagi tejamkorlik qoidasini e'tiborsiz qoldirgan.

## Tasdiqlash
- Vazifa uchun to'g'ridan-to'g'ri tool/buyruq/URL bormi? (masalan open_page, weather_forecast, bash curl)
- Tanlangan yo'l qancha qadam? 1 dan ko'pmi?
- Natija ishonchli va xavfsizmi? (agar ha, qisqaroq yo'lni tanlash kerak edi)
- instruction.md "Eng arzon ishonchli yo'lni tanla" bo'limi o'qilganmi?

## Tuzatish (aynan shu)
1. Har qanday ishda avval: "Bu natijaga eng kam tool chaqiruv bilan qanday yetaman?" deb o'ylab ko'r.
2. To'g'ridan-to'g'ri yo'l bor bo'lsa (API, CLI, maxsus tool, to'g'ri URL) — shuni ishlat. Brauzer/UI faqat boshqa yo'l yo'q yoki interaktiv bo'lsa.
3. Misollar:
   - Ob-havo: `weather_forecast` tool, brauzer emas.
   - Oddiy sahifa matni: `open_page` + pattern, browser_execute emas.
   - Vaqt/sana: tizim tool yoki oddiy buyruq.
4. Agar ikki yo'l bo'lsa, qisqaroqini tanla, lekin ishonchlilikni yo'qotma.
5. Keyin qilgan tanlovingni qisqa ayt (agar kerak bo'lsa).

```markdown
# Noto'g'ri
browser_execute bilan google ochib "weather tashkent" qidirib skrinshot

# To'g'ri
weather_forecast(location="Tashkent")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har doim eng arzon ishonchli yo'lni tanla — to'g'ridan-to'g'ri tool > murakkab UI.
- Bu tejamkorlik ishonchlilik hisobiga bo'lmasin, lekin keraksiz qadamlarni qisqartir.
- instruction.md dagi bu qoidaga amal qilish javobni tezroq va toza qiladi.
