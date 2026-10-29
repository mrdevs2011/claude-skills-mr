---
name: agent-rendered-card-or-citation-with-id-not-returned-by-any-prior-tool-call
description: Agent emits <grok type="render_card" card_id="..."/> or render_inline_citation with a citation_id/card_id that was never returned by any tool in the current conversation, causing broken UI components or silent failures.
---

# AgentRenderedCardOrCitationWithIdNotReturnedByAnyPriorToolCallInConversation

## Nima uchun bu skill kerak
Card va citation komponentlari faqat avvalgi tool natijalaridan kelgan haqiqiy id'lar bilan ishlaydi. Agar agent o'zi o'ylab topgan yoki eski suhbatdagi id'ni ishlatsa, foydalanuvchi buzuq yoki bo'sh komponent ko'radi. Bu ayniqsa weather, sports, search natijalaridan keyin muhim.

## Simptom (aynan shu)
- Javobda `<grok type="render_card" card_id="some-random-or-invented-id" />` yoki `<grok type="render_inline_citation" citation_id="99999" />` chiqadi.
- card_id yoki citation_id hech qanday oldingi tool javobida (web_search, weather_forecast, sports_search, x_keyword_search va hokazo) ko'rinmagan.
- Foydalanuvchi tomonda karta yoki sitata render bo'lmaydi yoki xato beradi.
- Agent "men card qo'shdim" deb hisoblaydi, lekin id haqiqiy emas.

## Sabab (100%)
Agent tool natijasini o'qib, undagi `card_id` yoki `citation_id` ni to'g'ridan-to'g'ri nusxalamaydi. O'rniga taxminan id o'ylab topadi, oldingi suhbatdan eslab qoladi yoki "misol uchun" deb yozadi. Tool javobidagi aniq qiymatni (masalan `"card_id": "abc123"`) e'tiborsiz qoldiradi.

## Tasdiqlash
1. Javobdagi har bir card_id / citation_id ni qidir.
2. Shu id shu suhbatdagi oldingi tool natijalarida bor-yo'qligini tekshir (web_search, weather_forecast, sports_search, x_... natijalari).
3. Agar id tool javobida ko'rinmasa — bu xato.

## Tuzatish (aynan shu)
Faqat tool javobida aniq qaytarilgan id'ni ishlat:

```xml
<!-- TO'G'RI: weather_forecast tool javobidan kelgan card_id -->
<grok type="render_card" card_id="weather_card_7f3a2b" />

<!-- TO'G'RI: web_search natijasidagi citation_id -->
Matn. <grok type="render_inline_citation" citation_id="42" />

<!-- NOTO'G'RI: o'ylab topilgan -->
<grok type="render_card" card_id="my-card-1" />
```

Qoidalar:
- Tool chaqirilgandan keyin uning javobini o'qi.
- Faqat o'sha javobdagi `card_id` yoki `[web:citation_id]` / `[post:citation_id]` formatidagi id'ni ol.
- Hech qachon o'zing id ixtiro qilma.
- Bir nechta tool natijasi bo'lsa, eng mosini tanla va faqat o'shanikini render qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Card va citation faqat avvalgi tool natijasida qaytarilgan haqiqiy id bilan ishlaydi. O'ylab topilgan yoki eski id ishlatish komponentni buzadi. Har doim tool javobidan aniq nusxa ol.
