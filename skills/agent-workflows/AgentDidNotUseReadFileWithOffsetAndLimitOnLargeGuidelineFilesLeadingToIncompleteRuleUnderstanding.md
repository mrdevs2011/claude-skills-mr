---
name: incomplete-guideline-read-due-to-truncation
description: Agent architecture.md yoki instruction.md kabi katta qo'llanma fayllarini read_file bilan to'liq o'qimadi, truncated outputdan keyin offset bilan davom etmadi — natijada skill formati yoki qoidalar to'liq tushunilmay qoldi.
---

# Katta qo'llanma fayllarini to'liq o'qimasdan skill yaratish

## Nima uchun bu skill kerak
architecture.md, instruction.md kabi fayllar uzun bo'lishi mumkin. Tool output truncated bo'lsa, agent qolgan qismini offset bilan o'qimasa, muhim qoidalar (fayl formati, kategoriya, nomlash) o'tkazib yuboriladi. Bu noto'g'ri skill strukturasiga olib keladi.

## Simptom (aynan shu)
- Skill faylida architecture.md dagi majburiy bo'limlar (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) to'liq yo'q yoki tartib buzilgan.
- Agent "read_file chaqirdim" deb yozadi, lekin tool natijasida truncation belgisi bor va keyingi offset chaqiruvi yo'q.
- Nomlash qoidasi (uzun, to'liq tavsiflovchi fayl nomi) buzilgan.
- Kategoriya noto'g'ri tanlangan.

## Sabab (100%)
read_file default limit bilan chaqirilgan, output truncated deb ogohlantirilgan, lekin agent qolgan qatorlarni (offset=...) bilan qayta o'qishni o'tkazib yuborgan. "Yetarli o'qidim" deb taxmin qilgan.

## Tasdiqlash
1. Tool chaqiruv tarixida architecture.md yoki instruction.md uchun read_file limit to'liq faylni qamrab oldimi yoki truncation bo'lganmi?
2. Truncation bo'lgan bo'lsa, keyingi offset bilan davom ettirilganmi?
3. Yaratilgan skill fayli to'liq formatga mosmi?

## Tuzatish (aynan shu)
Katta fayllar uchun:

```python
# Avval to'liq o'qishni ta'minla:
# read_file file_path=architecture.md limit=500
# Agar truncated bo'lsa:
# read_file file_path=architecture.md offset=501 limit=500
# Davom et, to fayl oxirigacha.
```

Yoki bash orqali `wc -l` bilan qatorlar sonini bil, keyin to'liq qamrab ol.

Hech qachon truncated outputdan keyin "o'qib bo'ldim" deb skill yozma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Katta qo'llanma fayllarida truncation bo'lsa, offset bilan davom etish majburiy.
- To'liq o'qilmagan qoidalar skill formatini buzadi.
- Har safar to'liq kontekstni ta'minlab, keyin skill yarat.
