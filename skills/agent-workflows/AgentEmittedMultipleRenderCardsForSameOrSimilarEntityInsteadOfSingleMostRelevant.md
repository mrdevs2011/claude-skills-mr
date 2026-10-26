---
name: agent-emitted-multiple-render-cards-for-same-or-similar-entity
description: Bir xil yoki o'xshash entity uchun bir nechta tool chaqiruvlaridan card_id'lar qaytganda, faqat eng mos birini emas, barcha yoki bir nechtasini render_card qilish. Natijada foydalanuvchiga ortiqcha takroriy kartalar ko'rsatiladi.
---

# Bir xil entity uchun bir nechta card render qilish

## Nima uchun bu skill kerak
Weather, sports, finance kabi structured data tool'lari har chaqiruvda card_id qaytaradi. Agar bir nechta o'xshash so'rov (masalan bir jamoa uchun last va next o'yin) yuborilsa, bir nechta card paydo bo'ladi. System qoidasi: "If multiple tool calls returned cards for the same or similar entity, pick the ONE most relevant card and render it. Only render multiple cards if the user explicitly asked for different entities." Bir nechtasini chiqarish foydalanuvchini chalg'itadi va interfeysni to'ldiradi.

## Simptom (aynan shu)
- User bitta jamoa, bitta o'yinchi, bitta shahar ob-havosi haqida so'radi.
- Agent bir nechta sports_search yoki weather_forecast chaqirdi (masalan team + standings, yoki last + next).
- Yakuniy javobda ikki yoki undan ortiq <grok type="render_card" card_id="..."/> elementlari bor.
- Kartalar bir xil entityga tegishli (masalan ikkalasi ham "Chiefs" haqida).
- User "boshqa jamoalar" deb so'ramagan.

## Sabab (100%)
Agent har tool natijasidagi card_id ni avtomatik ravishda render qiladi, "eng mos birini tanla" qoidasini o'tkazib yuboradi. Yoki bir nechta card'ni "to'liqroq ma'lumot" deb o'ylab, barchasini chiqaradi. Tanlov qilish o'rniga hammasi ishlatiladi.

## Tasdiqlash
1. Yakuniy javob matnida nechta render_card XML elementi bor?
2. Ularning card_id'lari bir xil yoki o'xshash entity (bir jamoa, bir shahar, bir o'yinchi) ga tegishlimi?
3. User so'rovi bir nechta turli entity so'raganmi (masalan "Chiefs va Bills")?
4. Tool call'lar soni va render qilingan card soni mos keladimi yoki ortiqchami?
5. Eng relevant card (masalan live/next o'yin) tanlanganmi?

## Tuzatish (aynan shu)
1. Bir nechta tool chaqiruvlaridan card_id kelganini ko'r.
2. User so'roviga eng mos keladigan BITTA cardni tanla (masalan "next game" so'ralgan bo'lsa next event card, "standings" bo'lsa standings card).
3. Faqat shu bitta cardni emit qil:

```xml
<grok type="render_card" card_id="THE_MOST_RELEVANT_CARD_ID" />
```

4. Qolgan card_id'larni e'tiborsiz qoldir. Matnda qisqa takeaway ber, karta o'zi to'liq ma'lumotni ko'rsatadi.
5. Faqat user aniq "boshqa jamoalar/shaharlar" deb so'raganda bir nechta card ruxsat etiladi.

Misol:
- User: "Chiefs keyingi o'yini qachon?"
- Tool'lar: event=next (card_A), standings (card_B)
- To'g'ri: faqat card_A ni render qil.
- Noto'g'ri: ikkalasini ham.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bir xil yoki o'xshash entity uchun bir nechta card qaytsa, faqat eng mos bitta cardni tanlab render qil. Barcha card'larni chiqarish qoidaga zid. Faqat user turli entitylar so'raganda bir nechta ruxsat etiladi. Bu javobni toza va foydali saqlaydi.
