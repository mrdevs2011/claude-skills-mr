---
name: agent-did-not-pass-specific-date-to-weather-forecast-tool
description: User asked for weather on a specific day (tomorrow, Friday, a date) but agent called weather_forecast without specific_date or with "none", missing hourly details. Use when weather response lacks day-specific hourly data.
---

# Agent did not pass specific_date to weather_forecast tool when user named a particular day

## Nima uchun bu skill kerak
Weather tool specific_date berilsa, o'sha kun uchun soatlik prognoz qaytaradi. Berilmasa, faqat umumiy multi-day overview beradi. User aniq kun so'raganda soatlik ma'lumot kerak bo'ladi.

## Simptom (aynan shu)
User "ertaga ob-havo", "juma kuni yomg'ir yog'adimi", "2026-10-27" deb so'radi, lekin tool call'da specific_date yo'q yoki "none". Javobda soatlik detallar yo'q, faqat kunlik umumiy.

## Sabab (100%)
Agent specific_date parametrini tool schema'dan o'qimasdan yoki user so'rovini map qilmasdan chaqirdi. "today"/"tomorrow"/weekday/date formatini ishlatmadi.

## Tasdiqlash
1. User so'rovida aniq kun bormi? (tomorrow, friday, next monday, 2026-10-27)
2. weather_forecast tool call'da specific_date argumenti yo'qmi yoki "none"mi?
3. Agar ha, bu skill qo'llanadi.

## Tuzatish (aynan shu)
User so'rovini map qil:

- "ertaga" / "tomorrow" -> specific_date="tomorrow"
- "juma" / "friday" -> specific_date="friday"
- aniq sana -> "YYYY-MM-DD"
- "bugun" / "tonight" -> "today"

Misol tool call:

weather_forecast(location="Tashkent", specific_date="tomorrow", focus="precipitation")

Keyin natijani card bilan render qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Aniq kun so'ralganda har doim specific_date ni to'g'ri qiymat bilan yubor. Shunda soatlik prognoz keladi va javob to'liq bo'ladi.
