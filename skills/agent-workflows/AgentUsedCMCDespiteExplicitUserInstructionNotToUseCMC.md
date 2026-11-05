---
name: agent-used-cmc-despite-explicit-instruction-not-to
description: User explicitly said "CMC ishlatma" or similar but agent still attempted to use CommandHistory MCP, CMC tools, or local CMC repository for history lookup instead of following the restriction.
---

# Agent Used CMC Despite Explicit User Instruction Not To

## Nima uchun bu skill kerak
Ba'zi vazifalarda foydalanuvchi aniq ravishda "CMC ishlatma" yoki "CommandHistory MCP dan foydalanma" deb ko'rsatma beradi. Agent bu cheklovni e'tiborsiz qoldirib, CMC bilan bog'liq tool yoki lokal fayllarni o'qishga urinadi. Bu foydalanuvchi niyatiga zid ish qiladi va keraksiz xato yoki ruxsat etilmagan ma'lumotga kirishga olib kelishi mumkin.

## Simptom (aynan shu)
Foydalanuvchi so'rovida yoki qo'llanmada "CMC ishlatma", "CommandHistory ishlatma", "CMC orqali qidirma" kabi aniq taqiqlov bor. Shunga qaramay agent `search_connected_tools` orqali CMC/commandhistory toolini qidiradi, `call_connected_tool` bilan uni chaqiradi, yoki lokal `~/.config/commandhistory` yoki GitHub command-history repo'sini o'qiydi.

## Sabab (100%)
Agent instruction.md dagi CommandHistory bo'limini umumiy qoida deb qabul qilib, foydalanuvchining maxsus cheklovini ustun qo'ymadi. Yoki tool katalogida CMC mavjudligini ko'rib, uni avtomatik ravishda ishlatishga harakat qildi, aniq "ishlatma" buyrug'ini e'tiborsiz qoldirdi.

## Tasdiqlash
1. Foydalanuvchi xabarida "CMC ishlatma" yoki ekvivalent ibora borligini tekshiring.
2. Agentning tool chaqiruvlarida `commandhistory`, `CMC`, `search_command_history` yoki lokal CMC yo'llari ishlatilganini qidiring.
3. Agar bunday chaqiruv bo'lsa — bu skill mos keladi.

## Tuzatish (aynan shu)
Foydalanuvchi aniq "CMC ishlatma" desa:
- Hech qanday CMC/commandhistory toolini qidirmang va chaqirmang.
- Lokal `~/.config/commandhistory` yoki remote command-history repo'sini o'qimang.
- Tarix kerak bo'lsa, boshqa ruxsat etilgan usullarni (git log, mavjud conversation, boshqa tool) ishlating yoki cheklovni e'tirof etib, CMC siz ishni bajaring.
- Agar CMC haqida so'ralsa, qisqa "CMC ishlatilmaydi, foydalanuvchi taqiqlagan" deb javob bering va davom eting.

Misol:
```python
# Noto'g'ri
search_connected_tools(query="command history")
call_connected_tool(tool_name="commandhistory_search", ...)

# To'g'ri
# CMC taqiqlangan — boshqa yo'l bilan davom et
print("CMC ishlatilmaydi. Boshqa manbadan tekshiraman.")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi aniq "CMC ishlatma" desa, barcha CMC bilan bog'liq harakatlar (tool, lokal fayl, remote) taqiqlanadi. Umumiy instruction.md qoidasi maxsus foydalanuvchi buyrug'idan ustun emas. Har doim aniq cheklovni birinchi navbatda hurmat qiling.