---
name: agent-assumed-first-page-paginated-results-complete
description: Paginated qidiruv yoki ro'yxat natijalarining faqat birinchi sahifasini olish va to'liq deb taxmin qilish — keyingi sahifa yoki cursor tekshirilmagan, ma'lumot yetishmaydi.
---

# Paginated natijalarning faqat birinchi sahifasini olish va to'liq deb hisoblash

## Nima uchun bu skill kerak
Ko'p API, qidiruv tool'lari (web_search, x_keyword_search, list_skills, file listing, database query) natijalarni sahifalab qaytaradi (pagination, cursor, next_page_token, has_more). Agent faqat birinchi javobni oladi va "hammasi shu" deb davom etadi. Natijada to'liq ma'lumot yo'q, noto'g'ri xulosa, o'tkazib yuborilgan elementlar.

## Simptom (aynan shu)
- Tool javobida "next", "cursor", "has_more", "page_token", "truncated", "more results available", yoki max_results limit ko'rsatilgan.
- Agent faqat shu birinchi batchdan foydalanib javob beradi yoki qaror qiladi.
- Keyingi sahifani so'ramaydi, cursor'ni ishlatmaydi, has_more=true bo'lsa ham to'xtaydi.
- Foydalanuvchi "hammasini top", "to'liq ro'yxat" degan, lekin faqat qisman qaytarilgan.

## Sabab (100%)
Agent tool javobini "yakuniy" deb qabul qiladi. Pagination signallarini (has_more, next_cursor, total_count vs returned_count) e'tiborsiz qoldiradi yoki "birinchi sahifa yetarli" deb taxmin qiladi. Qo'shimcha chaqiruvlar uchun reja tuzmaydi.

## Tasdiqlash
- Tool javobida pagination maydoni bormi? (next_page, cursor, has_more, continuation_token, total > returned)
- Agent keyingi so'rov yubordimi?
- Agar has_more yoki next bo'lsa va to'liq natija kerak bo'lsa — faqat birinchi sahifa yetarlimi?

## Tuzatish (aynan shu)
Pagination belgisini doim tekshir va kerak bo'lsa keyingi sahifalarni ol:

1. Har bir list/search tool javobida pagination maydonlarini qara (has_more, next_cursor, page_token, total_count).
2. Agar has_more=true yoki next bor va to'liq ma'lumot kerak — darhol keyingi chaqiruvni yubor (cursor yoki page bilan).
3. Loop qil: while has_more do next call, natijalarni yig'.
4. Limit qo'y (masalan max 5 sahifa) — cheksiz loopdan qoch.
5. Foydalanuvchiga "birinchi sahifa" yoki "to'liq emas" deb ayt, agar to'xtagan bo'lsang.

Misol (pseudocode):
```
results = []
cursor = None
while True:
  resp = search_tool(query, cursor=cursor)
  results.extend(resp.items)
  if not resp.has_more or not resp.next_cursor:
    break
  cursor = resp.next_cursor
  if len(results) > MAX_SAFE: break  # safety
# endi to'liq yoki yetarli results bilan ishla
```

Agar tool max_results qaytarsa va u limitdan kam bo'lsa — bu to'liq emasligini bildiradi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Birinchi sahifa = to'liq natija emas. Pagination signalini doim tekshir.
- Kerak bo'lsa keyingi sahifa/cursor bilan davom et, aks holda to'liq ma'lumot yo'q.
- Xavfsizlik limiti qo'y, cheksiz so'rov yuborma.
