---
name: agent-did-not-use-device-lat-long-for-current-location-weather
description: Foydalanuvchi hozirgi joylashuvi haqida ob-havo so'raganda, weather_forecast tooliga latitude/longitude o'tkazmasdan shahar taxmin qilish yoki location parametrini noto'g'ri ishlatish.
---

# Agent device latitude/longitude ishlatmasdan current location weather so'rovi

## Nima uchun bu skill kerak
weather_forecast tooli foydalanuvchi joylashuvi uchun latitude va longitude qabul qiladi (device Location yoki get_device_location dan). Agar agent buni ishlatmasa va shahar nomini taxmin qilsa yoki location bo'sh qoldirsa, noto'g'ri joy uchun ob-havo chiqishi mumkin. Bu aynan "hozir qayerdaman" yoki "shu yerda yomg'ir yog'adimi" kabi so'rovlar uchun muhim.

## Simptom (aynan shu)
- Foydalanuvchi "hozir qanday ob-havo", "shu yerda yomg'ir yog'adimi", "mening joyimda" deb so'radi, aniq shahar aytmadi.
- Agent weather_forecast ni location="Toshkent" yoki boshqa taxminiy shahar bilan chaqirdi, yoki latitude/longitude o'tkazmadi.
- Natija foydalanuvchining haqiqiy joylashuviga mos kelmaydi.
- Device Location ma'lumoti mavjud yoki get_device_location chaqirish mumkin edi, lekin ishlatilmadi.

## Sabab (100%)
Agent tool schema'sidagi latitude/longitude parametrlarini e'tiborsiz qoldirdi yoki "location" yetarli deb o'yladi. Current location so'rovi uchun maxsus yo'l borligini bilmadi: device koordinatalarini o'tkazish.

## Tasdiqlash
1. So'rovda aniq shahar/joy nomi yo'qmi? ("hozir", "shu yerda", "mening joyimda" kabi).
2. weather_forecast chaqiruvida latitude va longitude berilganmi?
3. User Info yoki oldingi tool natijasida device Location koordinatalari bormi?
4. Agar koordinata o'tkazilsa, natija o'zgaradimi?

## Tuzatish (aynan shu)
Current location so'rovi bo'lsa:

- Agar User Info da device Location (latitude, longitude) bo'lsa, ularni weather_forecast ga o'tkaz.
- Bo'lmasa, get_device_location chaqir (agar mavjud bo'lsa), keyin koordinatalarni o'tkaz.
- location parametrini ishlatma yoki bo'sh qoldir, faqat lat/long ber.

```python
# Noto'g'ri:
weather_forecast(location="Toshkent")  # taxmin

# To'g'ri (device koordinata bor bo'lsa):
weather_forecast(latitude=41.2995, longitude=69.2401)

# Yoki:
loc = get_device_location()
weather_forecast(latitude=loc.lat, longitude=loc.lon)
```

Keyin natijani card sifatida render qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Current location weather uchun shahar taxmin qilma, device latitude/longitude ishlat.
- Tool schema'da maxsus parametrlar bor — ularni o'qi va ishlat.
- Bu foydalanuvchi joylashuvini aniqroq qiladi va noto'g'ri taxminlardan saqlaydi.
