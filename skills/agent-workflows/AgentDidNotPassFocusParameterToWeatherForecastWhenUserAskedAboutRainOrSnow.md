---
name: agent-did-not-pass-focus-parameter-to-weather-forecast-for-rain-or-snow
description: User asked specifically about rain, precipitation, snow, or will it rain/snow, but agent called weather_forecast with focus="none" or omitted it, missing targeted precipitation/snowfall details. Use when weather answer lacks focus on the asked condition.
---

# Agent did not pass focus=precipitation or snowfall to weather_forecast when user asked about rain or snow

## Nima uchun bu skill kerak
weather_forecast tooli focus parametri bilan yomg'ir yoki qor savollariga moslashtirilgan natija qaytaradi. focus="none" (default) umumiy ob-havo beradi. User "yomg'ir yog'adimi?", "qor yog'adimi?", "tonight rain?" deb so'raganda fokuslangan ma'lumot kerak.

## Simptom (aynan shu)
- User aniq yomg'ir/qor haqida so'radi: "will it rain tonight?", "qor yog'adimi ertaga?", "precipitation forecast", "snow?".
- Agent weather_forecast chaqirdi, lekin focus="none" yoki parametr umuman yo'q.
- Javobda umumiy temperatura/shamol bor, lekin yomg'ir/qor ehtimoli yoki maxsus detallar yetishmaydi yoki umumiy.
- Tool schema'da focus: "precipitation" | "snowfall" | "none" mavjud.

## Sabab (100%)
Agent user so'rovidagi "rain"/"snow"/"yomg'ir"/"qor" ni focus parametriga map qilmadi. Default "none" ni ishlatdi yoki schema'ni to'liq o'qimadi.

## Tasdiqlash
1. User so'rovida rain, precipitation, snow, yomg'ir, qor, "will it rain", "qor yog'adimi" kabi so'zlar bormi?
2. weather_forecast tool call'da focus argumenti "precipitation" yoki "snowfall" emasmi? (yoki yo'qmi?)
3. Agar ha — bu skill qo'llanadi.

## Tuzatish (aynan shu)
focus ni aniq so'rovga mos qo'y:

```text
# XATO:
weather_forecast(location="Toshkent", specific_date="tomorrow")  # focus default none

# TO'G'RI (yomg'ir so'ralganda):
weather_forecast(location="Toshkent", specific_date="tomorrow", focus="precipitation")

# TO'G'RI (qor so'ralganda):
weather_forecast(location="Toshkent", specific_date="tomorrow", focus="snowfall")
```

Agar umumiy ob-havo so'ralgan bo'lsa — focus="none" yoki omit qilish to'g'ri. Faqat rain/snow-specific so'rovda focus o'tkaz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- weather_forecast da focus="precipitation" yoki "snowfall" rain/snow savollari uchun kerak.
- Default none umumiy prognoz beradi; aniq shart so'ralganda focus o'tkazish natijani aniqroq qiladi.
- Tool schema'ni o'qib, user intentini parametrlarga to'g'ri map qilish kerak.
