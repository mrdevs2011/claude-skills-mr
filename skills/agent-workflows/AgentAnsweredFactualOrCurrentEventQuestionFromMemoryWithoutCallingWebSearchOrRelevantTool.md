---
name: answered-factual-question-from-memory-without-search
description: Faktual, yangi yoki vaqtga bog'liq savolga esdan yoki eski bilimdan javob berish — web_search yoki tegishli tool chaqirilmagan, natijada noto'g'ri yoki eskirgan ma'lumot.
---

# Faktual savolga qidiruv tool'isiz esdan javob berish

## Nima uchun bu skill kerak
Agentlar ba'zan "bilaman" deb hisoblab, yangi faktlar, sanalar, yangiliklar yoki o'zgaruvchan ma'lumotlarni web_search (yoki specialized tool) chaqirmasdan o'z xotirasidan javob beradi. Bu noto'g'ri, eskirgan yoki to'liq bo'lmagan javobga olib keladi.

## Simptom (aynan shu)
- Foydalanuvchi yangi voqea, hozirgi holat, so'nggi yangilanish, aniq raqam yoki vaqtga bog'liq savol beradi.
- Javobda web_search, sports_search, weather yoki boshqa ma'lumot tool'i chaqirilmagan.
- Javob "o'ylaymanki", "odatda" yoki eski bilimga asoslangan.
- Keyinchalik foydalanuvchi noto'g'ri ekanini aytadi yoki manba yo'q.

## Sabab (100%)
Agent o'z bilimini yetarli deb hisoblaydi va "qidiruv qilish shart emas, bilaman" deb tool chaqirishni o'tkazib yuboradi. Vaqt o'tgani, model kesish sanasi yoki ma'lumot o'zgarishi hisobga olinmaydi.

## Tasdiqlash
1. Savol faktual, yangi yoki o'zgaruvchan ma'lumotmi (sana, raqam, yangilik, hozirgi holat)?
2. Javobdan oldin web_search yoki tegishli tool (sports_search, weather_forecast va hokazo) chaqirilganmi?
3. Javobda manba yoki citation bormi?
4. Agar tool chaqirilmagan bo'lsa va ma'lumot yangi bo'lishi mumkin bo'lsa — bu holat.

## Tuzatish (aynan shu)
Har doim faktual yoki vaqtga bog'liq savollarda avval tool chaqir:

1. Savolni tahlil qil: "bu bilimim yetarlimi yoki yangi ma'lumot kerakmi?"
2. Kerak bo'lsa `web_search` (yoki specialized tool) chaqir. Aniq query ishlat.
3. Natijani o'qi, citation qo'y.
4. Faqat shundan keyin javob ber.

Misol:
```text
Foydalanuvchi: "2026 yilgi eng so'nggi Python versiyasi nima?"
Noto'g'ri: to'g'ridan-to'g'ri "3.12" deb yozish.
To'g'ri: web_search("latest Python version 2026") → natijani o'qi → javob + citation.
```

Qoida: eskirishi mumkin bo'lgan har qanday fakt uchun search qil. "Bilaman" degan taxmin yetarli emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Faktual yoki yangi ma'lumot kerak bo'lgan savollarda hech qachon faqat xotiradan javob berma.
- Avval web_search yoki tegishli tool chaqir, keyin javob ber.
- Bu noto'g'ri va eskirgan ma'lumot berishning oldini oladi.
