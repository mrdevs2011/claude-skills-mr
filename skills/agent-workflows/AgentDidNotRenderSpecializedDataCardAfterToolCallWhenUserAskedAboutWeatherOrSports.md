---
name: agent-did-not-render-specialized-data-card
description: User weather or sports savoliga ixtisoslashgan tool chaqirilgandan keyin qaytgan card_id bilan render_card qilinmasligi — foydalanuvchi boy kartani ko'rmaydi, faqat matn oladi.
---

# Ixtisoslashgan ma'lumot tool'idan keyin card render qilmaslik

## Nima uchun bu skill kerak
Weather va sports tool'lari nafaqat matn, balki boy, interaktiv kartani ko'rsatish uchun card_id qaytaradi. Agent faqat matn bilan javob berib, kartani render qilmasa, foydalanuvchi to'liq tajribani yo'qotadi va ma'lumot kamroq foydali bo'ladi.

## Simptom (aynan shu)
- User "ob-havo qanday?" yoki "o'yin natijasi" deb so'radi.
- Agent weather_forecast yoki sports_search ni chaqirdi, tool card_id qaytardi.
- Lekin yakuniy javobda <grok type="render_card" card_id="..." /> yo'q.
- Faqat matnli qisqa xulosa bor, karta ko'rinmaydi.

## Sabab (100%)
Agent tool natijasini oddiy matn deb hisoblab, system prompt'dagi "when the user asked about the weather... render the card" qoidasini o'tkazib yuboradi. Yoki card_id ni e'tiborsiz qoldiradi.

## Tasdiqlash
- User so'rovi ob-havo yoki sportga oidmi?
- Tool chaqiruvi weather_forecast / sports_search qilinganmi va card_id qaytganmi?
- Yakuniy javobda render_card elementi bormi va card_id to'g'rimi?
- Agar faqat matn bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
1. Tool natijasidan card_id ni ol.
2. Javobda qisqa takeaway (1-2 jumla) yoz.
3. Darhol undan keyin cardni render qil:
   ```
   <grok type="render_card" card_id="actual-id-from-tool" />
   ```
4. Kartada bo'lmagan qo'shimcha faktlar bo'lsa, undan keyin yoz.
5. Hech qachon card_id ni e'tiborsiz qoldirma agar user shu mavzuda so'ragan bo'lsa.

Misol:
```
Bugun havo ochiq, harorat 22°C atrofida.
<grok type="render_card" card_id="weather-abc123" />
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Weather va sports tool'lari card_id qaytaradi — uni doim render qil.
- Faqat matn yetarli emas; karta foydalanuvchiga to'liq ma'lumot beradi.
- System qoidasiga 100% amal qil: so'ralgan mavzuda cardni ko'rsat.
