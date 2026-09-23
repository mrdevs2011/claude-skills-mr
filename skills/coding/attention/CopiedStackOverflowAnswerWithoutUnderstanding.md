---
name: copied-stackoverflow-without-understanding
description: AI internet/training'dan topilgan yechimni tushunmasdan ko'chirgan — kontekstga mos kelmaydi, qisman ishlaydi yoki yangi xato kiritadi.
---

# StackOverflow / namuna kodni tushunmasdan ko'chirish

## Nima uchun bu skill kerak
AI o'xshash xato yoki savolga mos kodni eslaydi va deyarli o'zgartirmasdan qo'yadi. O'sha kod boshqa versiya, boshqa muhit yoki boshqa maqsad uchun yozilgan. Natija: yangi xato, ortiqcha bog'liqlik, yoki "ishlaydi lekin nima qilayotganini bilmayman". Bu CopiedCodeWithoutAdapting skillining aniqroq shakli.

## Simptom (aynan shu)
- Kod "tanish" StackOverflow uslubida, lekin loyiha bilan mos kelmaydi.
- Izohlar yoki o'zgaruvchi nomlari boshqa kontekstdan.
- Yechim qisman ishlaydi, chekka holatda yiqiladi.
- AI "bu standart yechim" deb aytadi, lekin nima uchun ishlashini tushuntira olmaydi.

## Sabab (100%)
Pattern matching: o'xshash simptom → esdalikdagi yechim. Kontekst (versiya, stack, cheklovlar) tekshirilmaydi.

## Tasdiqlash
1. Yechim loyihadagi versiya/stack ga mosmi?
2. Har bir qator nima qilishi tushuntirilganmi?
3. Loyihadagi mavjud util/pattern ishlatilganmi, yoki tashqaridan butunlay yangi yondashuvmi?
4. Agar "ko'chirilgan" va moslashtirilmagan bo'lsa — shu.

## Tuzatish (aynan shu)
Avval tushun, keyin moslashtir:

```
// XATO:
// 1. Xatoni ko'rdi
// 2. Eski/namuna kodni qo'ydi
// 3. Loyiha uslubi va versiyasiga qaramadi

// TO'G'RI:
// 1. Xato sababini tushun
// 2. Loyihada o'xshash joy qanday yechilganini ko'r
// 3. Kerakli g'oyani ol, lekin o'z kod bazangizga yoz
// 4. Versiya/API mosligini tekshir
```

Qoida: namuna = g'oya manbai, to'g'ridan-to'g'ri paste emas. Har qatorni loyihaga moslashtiring.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- O'xshash xato ≠ bir xil yechim.
- Ko'chirishdan oldin tushunish va moslashtirish majburiy.
- AI pattern bo'yicha qo'yib, kontekstni unutadi.