---
name: agent-used-general-web-search-for-live-weather-sports-or-structured-data
description: Foydalanuvchi ob-havo, sport natijalari yoki boshqa strukturali real-vaqt ma'lumot so'raganda umumiy web_search ishlatiladi, maxsus tool (weather_forecast, sports_search) o'rniga.
---

# Umumiy web_search o'rniga maxsus tool ishlatilmasligi

## Nima uchun bu skill kerak
Agentlar ba'zan ob-havo, sport skorlari, jamoa statistikasi kabi real-vaqt va strukturali ma'lumotlar uchun umumiy `web_search` chaqiradi. Bu noaniq natijalar, eskirgan sahifalar yoki keraksiz matn qaytaradi. Maxsus toollar (`weather_forecast`, `sports_search`) aniq, yangi va kartada ko'rsatishga tayyor ma'lumot beradi.

## Simptom (aynan shu)
- Foydalanuvchi "bugun Toshkentda ob-havo qanday?", "Lakers keyingi o'yin", "Premier League jadvali" deb so'raydi.
- Agent `web_search` yoki `open_page` ishlatadi.
- Natija umumiy maqola yoki eski sahifa bo'ladi, strukturali karta yo'q.
- Maxsus tool (`weather_forecast` yoki `sports_search`) mavjud bo'lsa ham ishlatilmagan.

## Sabab (100%)
Agent mavjud maxsus toollarni (tool schema yoki instructions dan) e'tibordan chetda qoldiradi va default "hamma narsa web_search" yondashuvini tanlaydi. Tool katalogini tekshirmaydi.

## Tasdiqlash
1. So'rov ob-havo, sport ligasi (NFL, NBA, EPL va h.k.), jamoa, o'yin, jadval yoki liderlar haqidami?
2. `weather_forecast` yoki `sports_search` tool mavjudmi?
3. Chaqirilgan tool umumiy qidiruvmi (`web_search`, `browser_execute`)?
4. Agar maxsus tool ishlatilsa, aniq parameterlar (location, league, team, request type) bilan chaqirilishi kerak va `render_card` bilan ko'rsatilishi mumkin.

## Tuzatish (aynan shu)
Maxsus toolni to'g'ri argumentlar bilan chaqir:

```
// Noto'g'ri:
web_search(query="Tashkent weather today")

// To'g'ri:
weather_forecast(location="Tashkent", specific_date="today")
// keyin card_id ni render_card bilan chiqar

// Sport uchun:
sports_search(league="nba", request="team", team="Lakers")
// yoki request="standings", "schedule" va h.k.
```

Qoidalar:
- Ob-havo → `weather_forecast` (location, latitude/longitude, specific_date, focus).
- Sport (NFL/NBA/MLB/NHL/EPL/LaLiga/SerieA/Bundesliga/Ligue1) → `sports_search`.
- Natija card_id bersa, foydalanuvchiga `render_card` bilan ko'rsat.
- Umumiy qidiruv faqat maxsus tool yo'q bo'lganda.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Real-vaqt strukturali ma'lumotlar uchun umumiy web_search o'rniga maxsus tool ishlat.
- Bu aniqroq, yangiroq va kartada ko'rsatiladigan natija beradi.
- Tool katalogini doim tekshirib, eng mos tooldan foydalan.
