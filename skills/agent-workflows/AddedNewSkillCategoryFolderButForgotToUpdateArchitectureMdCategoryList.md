---
name: added-new-category-forgot-architecture-update
description: Yangi skill kategoriya papkasi yaratilganda architecture.md dagi kategoriya ro'yxatini yangilamaslik — kelajakdagi skill'lar noto'g'ri joylashadi va hujjat eskiradi.
---

# Yangi kategoriya papkasi yaratilganda architecture.md ni yangilamaslik

## Nima uchun bu skill kerak
Agentlar yangi skill uchun mos kategoriya topilmasa yangi papka yaratadi, lekin architecture.md dagi "Hozirgi kategoriyalar" ro'yxatini yangilamaydi. Natijada hujjat eskiradi, keyingi agentlar noto'g'ri papkaga qo'yadi yoki takroriy kategoriya yaratadi.

## Simptom (aynan shu)
- `skills/` ostida yangi papka (masalan `excel-tozalash/` yoki `pdf-yaratish/`) paydo bo'lgan.
- `architecture.md` dagi kategoriya ro'yxati hali eski holatda, yangi papka yo'q.
- README.md yangilangan bo'lishi mumkin, lekin architecture.md qolgan.
- Keyingi skill yaratishda agent eski ro'yxatga qarab noto'g'ri joy tanlaydi.

## Sabab (100%)
Agent yangi skill faylini to'g'ri papkaga qo'yadi va README ni yangilaydi, lekin architecture.md ni "faqat yuqori darajali" deb hisoblab o'tkazib yuboradi. architecture.md dagi qoida "yangi papka bo'lsa ro'yxatni yangila" e'tiborsiz qoldiriladi.

## Tasdiqlash
- Yangi kategoriya papkasi yaratildimi?
- `architecture.md` dagi "Hozirgi kategoriyalar" bo'limi yangi papkani o'z ichiga oladimi?
- README.md strukturasi yangilanganmi (u alohida skillda)?
- Mavjud kategoriyalar ro'yxati bilan solishtirilganmi?

## Tuzatish (aynan shu)
Yangi kategoriya papkasi yaratilganda **majburiy**:

1. `architecture.md` ni och.
2. "Hozirgi kategoriyalar" bo'limidagi ro'yxatga yangi papkani qo'sh:
   ```
   skills/
     coding/
       ...
     agent-workflows/
     productivity/
     yangi-kategoriya/   — qisqa izoh nima uchun
   ```
3. Agar yuqori darajali ro'yxat bo'lsa, u yerda ham qisqa qator qo'sh.
4. README.md dagi to'liq struktura ro'yxatini ham yangila (alohida skill).
5. Keyin commit qil.

Misol:
```md
agent-workflows/      — agent ish oqimi...
productivity/         — tejamkorlik...
excel-tozalash/       — Excel fayllarni tozalash va formatlash
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi kategoriya papkasi yaratilganda faqat skill fayl va README yetarli emas — architecture.md ni ham yangila.
- Eskirgan kategoriya ro'yxati keyingi agentlarni chalg'itadi va takroriy papkalar yaratilishiga olib keladi.
- Bu oddiy yangilash hujjatni sinxron saqlaydi va skill joylashuvini izchil qiladi.
