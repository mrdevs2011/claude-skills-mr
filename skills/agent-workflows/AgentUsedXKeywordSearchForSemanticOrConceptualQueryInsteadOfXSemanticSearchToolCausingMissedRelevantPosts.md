---
name: agent-used-x-keyword-search-for-semantic-query
description: Agent x_keyword_search tool ishlatdi semantik/konseptual so'rov uchun, x_semantic_search o'rniga, natijada relevant postlar o'tkazib yuborildi yoki past sifatli natijalar keldi.
---

# AgentUsedXKeywordSearchForSemanticOrConceptualQueryInsteadOfXSemanticSearchToolCausingMissedRelevantPosts

## Nima uchun bu skill kerak
X (Twitter) postlarini qidirishda ikki xil tool bor: `x_keyword_search` aniq kalit so'z, operatorlar, filterlar bilan ishlaydi; `x_semantic_search` esa ma'no, konsept, fikr, "nima haqida gapirishyapti" tipidagi so'rovlar uchun optimallashtirilgan. Noto'g'ri tool tanlash relevant natijalarni o'tkazib yuboradi yoki shovqin ko'p bo'ladi.

## Simptom (aynan shu)
Foydalanuvchi "X da odamlar [mavzu] haqida nima deb o'ylayapti?", "so'nggi fikrlar [mavzu] bo'yicha", "agentlar qanday [muammo] haqida gaplashyapti" kabi konseptual/semantik so'rov berdi.
Agent `x_keyword_search` chaqirdi aniq phrase yoki oddiy keyword bilan.
Natija: kam post, past relevansiya, yoki umuman mos kelmaydigan postlar; semantic qidiruvda topilishi mumkin bo'lgan postlar yo'q.

## Sabab (100%)
Agent so'rovni "keyword matching" deb noto'g'ri tasnifladi va `x_keyword_search` ni default deb oldi. `x_semantic_search` toolining mavjudligini yoki uning maqsadini (semantic/conceptual retrieval) e'tibordan chetda qoldirdi. Tool description'ni o'qimasdan yoki avvalgi natijalarni tahlil qilmasdan ishlatdi.

## Tasdiqlash
1. Foydalanuvchi so'rovi aniq phrase, user, date, filter talab qilmaydi, balki "nima deyilayapti", "fikrlar", "trend", "odamlar qanday gaplashyapti" kabi ma'no asosida.
2. Tool call logida `x_keyword_search` ishlatilgan, `x_semantic_search` yo'q.
3. Qaytgan postlar so'rovga to'liq mos kelmaydi yoki soni kam.
4. `x_semantic_search` bilan sinab ko'rilsa, yaxshiroq mos postlar keladi.

## Tuzatish (aynan shu)
So'rov semantik/konseptual ekanini aniqlagach, darhol `x_semantic_search` ishlat:

```python
# Noto'g'ri
x_keyword_search(query="agent skills debugging", limit=5, mode="Latest")

# To'g'ri
x_semantic_search(
    query="agents struggling with skill creation or debugging workflows",
    limit=5,
    from_date="2026-10-01",  # agar vaqt chegarasi kerak bo'lsa
    min_score_threshold=0.2
)
```

Agar aniq operatorlar (from:user, since:date, filter:images) kerak bo'lsa — `x_keyword_search`. Aks holda semantic.

Parallel ikkalasini ham chaqirish mumkin, keyin eng yaxshi natijalarni tanlash.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
X postlarini qidirishda so'rov turini ajrat: aniq keyword/operator → `x_keyword_search`; ma'no, fikr, konsept → `x_semantic_search`. Noto'g'ri tanlash relevant postlarni o'tkazib yuboradi. Tool description'ni o'qib, so'rovga mosini tanla.
