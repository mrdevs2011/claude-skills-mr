---
name: agent-read-entire-large-file-without-offset-and-limit
description: Agent katta faylni to'liq o'qidi (read_file limit=2000 yoki undan ko'p) keraksiz context sarflab, qachon offset va limit bilan faqat kerakli qismni o'qish yetarli edi.
---

# Katta faylni to'liq o'qish, offset/limit ishlatmaslik

## Nima uchun bu skill kerak
Agentlar ba'zan README.md, architecture.md yoki katta log fayllarni butunlay o'qiydi. Bu context window'ni tez to'ldiradi, token sarflaydi va muhim ma'lumotni "yo'qotadi". `read_file` tool'ida `offset` va `limit` parametrlari bor — faqat kerakli qismni o'qish uchun. To'liq o'qish faqat fayl kichik va hammasi kerak bo'lganda ishlatilishi kerak.

## Simptom (aynan shu)
- Tool call'da `read_file` `limit` katta (default 2000 yoki undan yuqori) yoki `offset` yo'q.
- Fayl 100+ qator, lekin agent faqat boshi yoki oxirini kerak qiladi.
- Keyingi tool call'larda context to'lib qolgani seziladi yoki javob qisqaradi.
- Agent "faylni to'liq o'qidim" deydi, lekin faqat bir bo'lim kerak edi.

## Sabab (100%)
Agent fayl hajmini tekshirmaydi va "hammasini o'qib, keyin qidiraman" deb o'ylaydi. `offset`/`limit` ni ishlatishni unutadi yoki "to'liq kontekst yaxshiroq" deb noto'g'ri taxmin qiladi. Eng arzon ishonchli yo'l (faqat kerakli qatorlar) o'rniga to'liq o'qishni tanlaydi.

## Tasdiqlash
1. Fayl hajmini bil: `wc -l file.md` yoki `ls -lh`.
2. Tool call'dagi `limit` va `offset` ni ko'r — limit >100 va offset=1 bo'lsa, keraksizmi?
3. Haqiqatan ham butun fayl kerakmi? (masalan, butun formatni o'qish uchun ha, lekin bitta bo'lim uchun yo'q).
4. Keyingi javobda context limiti ogohlantirishi bormi?

## Tuzatish (aynan shu)
Har doim avval fayl o'lchamini tekshir yoki qisman o'qi.

```python
# Noto'g'ri: to'liq o'qish
read_file(file_path="architecture.md", limit=2000)

# To'g'ri: faqat kerakli qism
read_file(file_path="architecture.md", offset=50, limit=80)
```

Agar qidirish kerak bo'lsa:
```bash
# Avval grep yoki head/tail
grep -n "Fayl formati" architecture.md
# Keyin aniq offset bilan o'qi
read_file(file_path="architecture.md", offset=57, limit=30)
```

Faqat fayl <100 qator va hammasi kerak bo'lganda to'liq o'qi. Aks holda offset + limit.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Katta fayllarni to'liq o'qima — offset va limit ishlat.
- Bu context va tokenni tejaydi, eng arzon yo'l.
- Avval hajmni bil, kerakli qismni aniqlа, keyin o'qi.
