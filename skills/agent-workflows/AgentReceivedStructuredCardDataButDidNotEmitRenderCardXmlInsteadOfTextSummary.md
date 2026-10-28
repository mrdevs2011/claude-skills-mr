---
name: agent-received-structured-card-data-but-did-not-emit-render-card-xml
description: weather_forecast, sports_search yoki boshqa card qaytaruvchi tool natijasini olgan, lekin render_card XML chiqarmasdan oddiy matn bilan qisqacha aytib qo'ygan — foydalanuvchi boy card ko'rmaydi.
---

# Agent structured card ma'lumotini oldi, lekin render_card XML chiqarmadi

## Nima uchun bu skill kerak
Ba'zi toollar (weather_forecast, sports_search) boy, formatlangan card qaytaradi. Cardni ko'rsatish uchun final javobda `<grok type="render_card" card_id="..."/>` XML elementini chiqarish majburiy. Agent ba'zan faqat matn bilan qisqacha aytadi, shu bois foydalanuvchi to'liq, chiroyli cardni ko'rmaydi.

## Simptom (aynan shu)
- Tool natijasida `card_id` bor (masalan weather yoki sports card).
- Final javobda faqat matnli qisqacha ma'lumot (harorat, hisob, jadval matni) yozilgan.
- `<grok type="render_card" card_id="..."/>` elementi yo'q.
- Foydalanuvchi "card ko'rinmadi" yoki "faqat matn" deb aytadi.

## Sabab (100%)
Agent card_id ni e'tiborsiz qoldirdi yoki "matn yetarli" deb hisobladi. Tool natijasidagi ko'rsatmaga (cardni render qilish kerak) amal qilmadi. XML elementini chiqarish o'rniga oddiy markdown yoki matn yozdi.

## Tasdiqlash
1. Tool chaqiruvi natijasida `card_id` qaytganmi?
2. Final javob matnida `render_card` XML elementi bormi?
3. Agar tool "render the card" deb aytgan bo'lsa va card_id bor bo'lsa — chiqarilmagan.

## Tuzatish (aynan shu)
Tool natijasida `card_id` bo'lsa, final javobda darhol uni chiqar:

```xml
<grok type="render_card" card_id="RETURNED_CARD_ID" />
```

Qoidalar:
- Card ma'lumotini qayta matn yoki jadval sifatida yozma — card o'zi ko'rsatadi.
- Qisqa bir-ikki jumlalik xulosa + card + faqat cardda yo'q qo'shimcha faktlar.
- Bir nechta card bo'lsa, eng relevantini tanla (foydalanuvchi aniq so'ramasa).

Misollar:
- Ob-havo so'ralganda: qisqa "Bugun Toshkentda 22°C, quyoshli" + render_card.
- O'yin hisobi: "Chiefs yutdi" + render_card.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Card qaytaruvchi toollar uchun doim `render_card` XML elementini final javobga qo'sh. Matn bilan qisqartirish yetarli emas — foydalanuvchi boy cardni ko'rishi kerak.
