---
name: agent-called-sports-search-with-incomplete-or-invalid-parameters
description: Agent sports_search tool'ni chaqirdi lekin majburiy parametrlar (league, request, team/player) to'liq yoki to'g'ri bermadi, natijada xato yoki bo'sh javob oldi.
---

# Agent sports_search tool'ni to'liq parametrlarsiz chaqirdi

## Nima uchun bu skill kerak
sports_search tool'i aniq league, request turi va kerakli team/player/event parametrlarini talab qiladi. Parametrlar noto'g'ri yoki yetishmasa tool xato qaytaradi yoki foydasiz natija beradi. Agent bu xatoni qayta-qayta qilmasligi uchun aniq qoida kerak.

## Simptom (aynan shu)
- sports_search chaqiruvi xato bilan tugadi yoki bo'sh/noto'g'ri card qaytardi
- league, request, team yoki player parametrlaridan biri yo'q yoki noto'g'ri qiymat
- "required" yoki "invalid" kabi xato xabarlari
- Foydalanuvchi jamoa yoki o'yin so'radi, lekin agent to'liq argument bermadi

## Sabab (100%)
Agent tool schema'sini to'liq o'qimadi yoki taxmin qildi. sports_search uchun league va request majburiy, team yoki player so'rov turiga qarab majburiy. Agent parallel yoki shoshilinch chaqiruvda argumentlarni tekshirmadi.

## Tasdiqlash
1. Oxirgi tool call'larni tekshir: sports_search argumentlarida league va request borligini ko'r.
2. Agar request="team" yoki "event" bo'lsa team parametr borligini tekshir.
3. Agar request="player" bo'lsa player (va kerak bo'lsa team) borligini tekshir.
4. Tool javobida xato yoki "missing" so'zi bormi ko'r.

## Tuzatish (aynan shu)
Har doim to'liq schema'ga amal qil. Misol:

```python
# Noto'g'ri
sports_search(league="nba")  # request va team yo'q

# To'g'ri
sports_search(
  league="nba",
  request="team",
  team="Lakers"
)

# O'yin uchun
sports_search(
  league="nfl",
  request="event",
  team="Chiefs",
  opponent="Bills",
  event="last"
)
```

Chaqirishdan oldin majburiy maydonlarni ro'yxat qilib chiq va to'ldir. Agar noaniq bo'lsa (masalan "New York" jamoasi) avval aniqlashtir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
sports_search tool'ini chaqirishdan oldin schema'dagi majburiy parametrlarni (league + request + tegishli team/player) to'liq va to'g'ri berish kerak. Yetishmasa xato chiqadi — taxmin qilma, to'liq argument bilan bitta marta to'g'ri chaqir.
