---
name: agent-used-open-page-pattern-search-with-default-or-low-max-matches-missing-critical-matches-beyond-first-results
description: Agent open_page da pattern ishlatganda max_matches ni default (50) yoki past qiymatga qo'yib, uzun sahifadagi keyingi muhim mosliklarni o'tkazib yubordi. Qachon: open_page pattern + max_matches ishlatilganda natija to'liq emasdek tuyulsa yoki muhim qismlar yo'q bo'lsa.
---

# Agent open_page pattern qidiruvida past max_matches tufayli muhim mosliklarni o'tkazib yubordi

## Nima uchun bu skill kerak
Agent uzun hujjat yoki sahifada aniq matn qidirayotganda `open_page` toolining `pattern` parametridan foydalanadi, lekin `max_matches` ni sozlamaydi yoki past qo'yadi. Natijada faqat birinchi 50 (yoki kamroq) moslik qaytadi, keyingi muhim qismlar (masalan, keyinroq keladigan format qoidalari, misollar yoki xatolar) kontekstga tushmaydi va agent noto'g'ri xulosa qiladi.

## Simptom (aynan shu)
- `open_page` chaqiruvi `pattern` bilan qilingan, `max_matches` parametr yo'q yoki 50 dan past.
- Qaytgan natijada faqat boshidagi mosliklar bor, hujjatning keyingi qismlaridagi bir xil patternli muhim bo'limlar yo'q.
- Agent "topilmadi" yoki to'liq emas degan xulosa chiqaradi, garchi sahifada keyinroq bo'lsa ham.
- Tool javobida "truncated" yoki mosliklar soni cheklanganligi haqida ishora bor.

## Sabab (100%)
`open_page` toolining `max_matches` parametri default 50 ga o'rnatilgan. Agent uni ochiq ko'rsatmasa yoki past qiymat bersa, qidiruv faqat birinchi N ta moslikni qaytaradi. Uzun sahifalarda (instruction.md, architecture.md, uzun API docs) pattern bir necha marta uchrashi mumkin va keyingilari tushib qoladi.

## Tasdiqlash
1. Oxirgi `open_page` chaqiruvini ko'rib chiq: `pattern` bor-yo'qligi va `max_matches` qiymati.
2. Agar `max_matches` yo'q yoki ≤50 bo'lsa va natija to'liq tuyulmasa — shu sabab.
3. Sahifa uzunligini taxmin qil (yoki `start_line` bilan qismlarga bo'lib qayta sinash).

## Tuzatish (aynan shu)
`open_page` chaqiruvda `max_matches` ni yetarli yuqori qiymatga qo'y (masalan 200–1000, tool maksimum 1000). Agar sahifa juda uzun bo'lsa, `start_line` bilan bir necha qismga bo'lib qidir yoki patternni aniqroq qil.

Misol:
```python
# Noto'g'ri (default max_matches=50)
open_page(url="...", pattern="Skill yozish qoidalari")

# To'g'ri
open_page(url="...", pattern="Skill yozish qoidalari", max_matches=200, context_lines=5)
```

Agar natija baribir kesilsa, `start_line` ni oshib qayta chaqir yoki patternni toraytir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`open_page` pattern qidiruvida `max_matches` default 50. Uzun hujjatlarda muhim keyingi mosliklarni o'tkazib yubormaslik uchun uni ochiq va yetarli qiymatga (100+) qo'yish kerak. Aks holda agent to'liq ma'lumot ololmaydi va noto'g'ri qaror qabul qiladi.
