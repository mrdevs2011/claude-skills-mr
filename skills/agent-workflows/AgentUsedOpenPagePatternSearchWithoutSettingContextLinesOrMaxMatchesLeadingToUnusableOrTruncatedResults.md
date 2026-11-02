---
name: open-page-pattern-missing-context-or-max
description: open_page tool pattern rejimida ishlatilganda context_lines yoki max_matches ko'rsatilmagan — natija juda qisqa yoki haddan tashqari uzun/shovqinli bo'lib, kerakli ma'lumotni topish qiyinlashadi.
---

# open_page pattern qidiruvida context_lines va max_matches unutilgan

## Nima uchun bu skill kerak
open_page tooli to'liq sahifani yuklab, katta context'ni to'ldirishi mumkin. Pattern rejimida faqat mos qatorlarni qaytarish mumkin, lekin context_lines va max_matches ko'rsatilmasa, default qiymatlar yetarli bo'lmasligi yoki ortiqcha bo'lishi mumkin. Agent to'g'ri parametrlarni bermasa, natija foydasiz bo'ladi.

## Simptom (aynan shu)
- open_page chaqiruvi `pattern` parametri bilan qilingan.
- `context_lines` va/yoki `max_matches` ko'rsatilmagan yoki default (10 va 50) ishlatilgan.
- Qaytgan natija: juda kam context (atrof qatorlar yo'q), yoki juda ko'p mosliklar (50+), yoki kerakli qatorlar kesilgan.
- Agent keyin "ma'lumot yetarli emas" deb qayta chaqiradi yoki noto'g'ri xulosa qiladi.

## Sabab (100%)
Tool schema'dagi ixtiyoriy parametrlar (`context_lines`, `max_matches`) e'tiborsiz qoldirilgan. Agent pattern ishlatishni eslab qolgan, lekin natijani boshqarish uchun kerakli sozlamalarni bermagan. Default 10 context va 50 matches ko'p hollarda yetarli bo'lmaydi (katta hujjatlar uchun kam, keng pattern uchun ko'p).

## Tasdiqlash
1. Oxirgi tool chaqiruv logini yoki xotirani tekshir.
2. `open_page` argumentlarida `pattern` borligini, lekin `context_lines` yoki `max_matches` yo'qligini ko'r.
3. Qaytgan natijada line numbers bor, lekin atrof matn qisqa yoki ko'p mosliklar kesilgan.
4. Agar to'liq sahifa kerak bo'lsa — pattern o'rniga oddiy open_page ishlatilganmi, aksincha tekshir.

## Tuzatish (aynan shu)
Pattern ishlatilganda har doim `context_lines` va `max_matches` ni aniq belgilang:

```python
# XATO (parametrlar yo'q):
open_page(url="https://docs.example.com/api", pattern="rate limit")

# TO'G'RI:
open_page(
  url="https://docs.example.com/api",
  pattern="rate limit",
  context_lines=5,
  max_matches=10
)
```

- Kichik hujjat yoki aniq pattern: `context_lines=3`, `max_matches=5`
- Katta hujjat, keng pattern: avval kichik max_matches, keyin kerak bo'lsa oshirish yoki start_line bilan qayta.
- Agar pattern umuman mos kelmasa — to'liq sahifani pattern'siz ochib, keyin manual qidirish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- open_page pattern rejimi token tejaydi, lekin context_lines va max_matches sozlanmasa natija foydasiz bo'ladi.
- Har doim pattern bilan birga bu ikki parametrni aniq qiymat bilan bering.
- Default'larga tayanmang — vazifaga moslab sozlang.
