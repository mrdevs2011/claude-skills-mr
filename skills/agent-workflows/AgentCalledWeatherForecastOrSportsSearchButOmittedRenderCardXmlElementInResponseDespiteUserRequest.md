---
name: agent-called-weather-forecast-or-sports-search-but-omitted-render-card
description: Agent called weather_forecast or sports_search tool which returned a card_id but then described the data in plain text instead of emitting the required <grok type="render_card" card_id="..."/> XML element in the final response.
---

# Agent Called Weather Forecast Or Sports Search But Omitted Render Card Xml Element In Response Despite User Request

## Nima uchun bu skill kerak
weather_forecast va sports_search toollari natijada card_id qaytaradi. User ob-havo yoki sport haqida so'raganda, tool natijasini oddiy matn sifatida yozish o'rniga, render_card XML elementi orqali boy kartani ko'rsatish kerak. Aks holda foydalanuvchi boy UI ni ko'rmaydi, faqat matn oladi.

## Simptom (aynan shu)
- weather_forecast yoki sports_search tool chaqirilgan va natijada card_id mavjud.
- User aniq ob-havo, harorat, yomg'ir, o'yin natijasi, jamoa holati kabi narsani so'ragan.
- Final javobda faqat matnli tavsif bor, <grok type="render_card" card_id="..."/> elementi yo'q.
- Kartaning ma'lumotlari qayta yozilgan yoki to'liq qayta keltirilgan.

## Sabab (100%)
Agent system prompt dagi "To place a citation, card, chart, image, or file in the final response, write an XML element" va "call render_card with it only when the user asked about the weather" qoidasini e'tiborsiz qoldirdi. Tool natijasini oddiy matn deb hisoblab, XML emit qilishni unutdi.

## Tasdiqlash
- Tool natijasida "card_id" kaliti bormi?
- User so'rovi weather, sports, score, forecast, rain, game haqida ekanini tekshir.
- Final response matnida `<grok type="render_card"` qidiring. Yo'q bo'lsa — bu skill kerak.
- Boshqa card_id larni aralashtirmaslik uchun faqat shu tool dan kelganini ishlat.

## Tuzatish (aynan shu)
Tool chaqirilgandan va card_id olingandan keyin, final javobda qisqa matn + XML:

```
Bugungi ob-havo: 22°C, qisman bulutli.<grok type="render_card" card_id="abc123xyz" />
```

Yoki sport uchun:

```
Chiefs 27-20 bilan yutdi.<grok type="render_card" card_id="sports456" />
```

Qoidalar:
- XML ni javob matnining ichiga, tegishli joyga qo'y.
- card_id ni aynan tool natijasidan ol, o'zing to'qima.
- Kartaning ichidagi ma'lumotni qayta matn sifatida to'liq yozma — faqat qisqa takeaway.
- Agar user so'ramagan bo'lsa (faqat ichki ma'lumot uchun chaqirilgan), card ni render qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
weather_forecast va sports_search dan card_id qaytsa va user shu mavzu haqida so'ragan bo'lsa, doim final javobda <grok type="render_card" card_id="..."/> XML elementini emit qil. Oddiy matn yetarli emas — boy kartani ko'rsatish majburiy.
