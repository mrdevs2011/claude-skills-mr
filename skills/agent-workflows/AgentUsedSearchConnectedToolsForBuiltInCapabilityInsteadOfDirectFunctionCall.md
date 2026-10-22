---
name: agent-used-search-connected-for-builtin
description: Built-in tool (weather_forecast, web_search, sports_search va h.k.) uchun search_connected_tools + call_connected_tool ishlatish — to'g'ridan-to'g'ri function call yetarli bo'lganda.
---

# Built-in tool uchun connected tools qidiruvini ishlatish

## Nima uchun bu skill kerak
Agentlar ba'zan foydalanuvchi ulangan xizmatlar (MCP Hub, Excalidraw, Voice) uchun mo'ljallangan search_connected_tools va call_connected_tool'ni built-in tool'lar (to'g'ridan-to'g'ri chaqiriladigan) uchun ishlatadi. Bu keraksiz qadam, token sarfi va xato ehtimolini oshiradi. Built-in tool'lar to'g'ridan-to'g'ri function call orqali chaqiriladi.

## Simptom (aynan shu)
- So'rov oddiy built-in capability (ob-havo, web qidiruv, sport, fayl o'qish va h.k.) haqida.
- Agent avval search_connected_tools("weather" yoki shunga o'xshash) chaqiradi.
- Keyin call_connected_tool bilan natijani ishlatishga urinadi.
- Lekin system prompt'da bu tool'lar to'g'ridan-to'g'ri mavjud (weather_forecast, web_search va h.k.).
- Natija sekinroq yoki xato bo'ladi, yoki "tool topilmadi" deydi.

## Sabab (100%)
Agent built-in tool'lar (prompt'da to'liq schema bilan berilgan, to'g'ridan-to'g'ri function call) va connected service tool'lar (faqat search_connected_tools orqali topiladigan) o'rtasidagi farqni unutadi yoki aralashtiradi. "Har qanday tool uchun avval qidirish kerak" deb hisoblaydi.

## Tasdiqlash
- So'rov qaysi tool turiga tegishli? Built-in ro'yxatda bormi (web_search, weather_forecast, sports_search, read_file, bash va h.k.)?
- search_connected_tools faqat user connected services (MCP Hub, Excalidraw, Voice) uchun ishlatilganmi?
- Built-in tool to'g'ridan-to'g'ri chaqirilganmi?
- Keraksiz qidiruv qadami bormi?

## Tuzatish (aynan shu)
1. System prompt'dagi "Available Tools" ro'yxatini tekshir — built-in tool'lar to'g'ridan-to'g'ri chaqiriladi.
2. Agar tool built-in bo'lsa (masalan weather_forecast, web_search, open_page, browser_execute) — to'g'ridan-to'g'ri function call qil.
3. Faqat user'ning connected services uchun search_connected_tools(query) ishlat, keyin call_connected_tool.
4. Hech qachon built-in tool nomini search_connected_tools'ga berma.
5. Agar shubha bo'lsa, avval built-in to'g'ridan-to'g'ri sinab ko'r — u ishlasa, qidiruv kerak emas.

Misol:
- Noto'g'ri: search_connected_tools("weather") → call_connected_tool
- To'g'ri: weather_forecast(location="Tashkent") to'g'ridan-to'g'ri.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Built-in tool'lar (prompt'da berilgan) doim to'g'ridan-to'g'ri function call orqali chaqiriladi.
- search_connected_tools va call_connected_tool faqat user ulangan tashqi xizmatlar uchun.
- Bu farqni bilish token tejaydi, tezlikni oshiradi va xatolarni kamaytiradi.
