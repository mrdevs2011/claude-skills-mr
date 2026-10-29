---
name: agent-did-not-pass-scale-parameter-to-weather-forecast-when-user-specified-unit
description: Foydalanuvchi harorat birligini (celsius yoki fahrenheit) aniq aytganda weather_forecast tooliga scale parametrini yubormaslik — noto'g'ri birlikda natija chiqishiga olib keladi.
---

# Agent Did Not Pass Scale Parameter To Weather Forecast When User Specified Temperature Unit

## Nima uchun bu skill kerak
weather_forecast tooli default "auto" scale ishlatadi (foydalanuvchi locale asosida). Agar foydalanuvchi "celsiusda", "°C", "fahrenheitda" yoki "in °F" deb aniq so'rasa, lekin agent scale="celsius" yoki "fahrenheit" ni yubormasa, natija noto'g'ri birlikda keladi va foydalanuvchi adashadi.

## Simptom (aynan shu)
- Foydalanuvchi so'rovida harorat birligini aniq ko'rsatgan: "in celsius", "celsiusda", "°C", "fahrenheit", "in °F", "Fahrenheitda".
- Agent weather_forecast chaqirgan, lekin scale parametri "auto" yoki umuman yuborilmagan.
- Natijada card yoki matn noto'g'ri birlikda (masalan, so'ralgan °C o'rniga °F).
- Foydalanuvchi birlikni qayta so'raydi yoki noto'g'ri deb biladi.

## Sabab (100%)
Agent tool schema'sidagi scale parametrini (auto | celsius | fahrenheit) e'tiborsiz qoldirdi. "auto" yetarli deb hisoblab, foydalanuvchi aniq birlik so'raganini o'tkazib yubordi. Tool tavsifida "Pass \"celsius\" or \"fahrenheit\" only when the user names a unit" deyilgan.

## Tasdiqlash
- Foydalanuvchi so'rovida "celsius", "fahrenheit", "°C", "°F", "in celsius" kabi so'zlar bormi?
- weather_forecast chaqiruvida scale parametri qanday? "auto" yoki yo'qmi?
- Natijadagi harorat birligi so'ralganiga mosmi?
- Tool schema yoki tavsif o'qilganmi (scale qachon o'zgartirilishi kerakligi)?

## Tuzatish (aynan shu)
Foydalanuvchi birlikni aniq aytganda doim scale ni aniq yubor:

```python
# Foydalanuvchi "celsiusda" yoki "in celsius" desa
weather_forecast(location="Tashkent", scale="celsius", ...)

# "fahrenheit" yoki "in °F" desa
weather_forecast(location="New York", scale="fahrenheit", ...)
```

Agar birlik aytilmasa — scale="auto" (yoki tashlab ket).
Card render qilishda ham shu birlikdagi ma'lumotni ishlat.

Hech qachon foydalanuvchi birlik so'raganini e'tiborsiz qoldirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi harorat birligini aniq ko'rsatsa, weather_forecast ga scale="celsius" yoki "fahrenheit" majburiy yubor. "auto" faqat birlik aytilmaganda. Bu noto'g'ri birlikdagi javoblarning oldini oladi va foydalanuvchi kutilgan natijani oladi.
