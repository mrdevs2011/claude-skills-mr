---
name: nullish-vs-falsy-wrong-default
description: ?? o'rniga || (yoki aksincha) ishlatilgan — 0/""/false default bilan almashtiriladi yoki null qoldiriladi. Mavjud TruthyCheck skilliga yaqin, lekin aynan ?? vs || tanlovi.
---

# ?? vs || : noto'g'ri default tanlovi

## Nima uchun bu skill kerak
AI default qiymat berishda `||` yoki `??` ni chalkashtiradi. `||` falsy (0, "", false) ni ham almashtiradi; `??` faqat null/undefined ni. Agar 0 yoki "" valid bo'lsa — `||` noto'g'ri. Agar faqat "yo'q" holatini default qilish kerak bo'lsa — `??` to'g'ri. Bu tanlov xatosi jim noto'g'ri natija beradi.

## Simptom (aynan shu)
- `count || 10` — count=0 bo'lganda 10 chiqadi (kerak emas edi).
- `name ?? 'Mehmon'` — name="" bo'lganda bo'sh qoladi (ba'zan kerak, ba'zan yo'q).
- Kodda `||` ishlatilgan, lekin 0/"" valid qiymat.
- Yoki `??` ishlatilgan, lekin "" ni ham default qilish kerak edi.

## Sabab (100%)
`||` va `??` farqini AI ba'zan e'tiborsiz qoldiradi yoki odatdagi `||` ni qo'llaydi. Context — "bu qiymat 0/"" bo'lishi mumkinmi?" — so'ralmaydi.

## Tasdiqlash
1. Default berilgan joyni toping (`x || default` yoki `x ?? default`).
2. `x` 0, "", yoki false bo'lishi mumkinmi?
3. Agar mumkin va ular valid bo'lsa — `||` noto'g'ri, `??` kerak.
4. Agar "" ni ham "yo'q" deb hisoblash kerak bo'lsa — `||` yoki aniq tekshiruv.

## Tuzatish (aynan shu)
Maqsadga qarab tanlang:

```js
// 0 valid — faqat null/undefined da default:
const pageSize = input.pageSize ?? 20;  // 0 qoladi

// 0 ni ham default qilish kerak (kamdan-kam):
const pageSize = input.pageSize || 20;

// Bo'sh string valid:
const title = data.title ?? 'Nomsiz';

// Bo'sh string ni ham default qilish:
const title = data.title || 'Nomsiz';

// Aniqroq:
const title = (data.title != null && data.title !== '')
  ? data.title
  : 'Nomsiz';
```

Qoida: "faqat umuman yo'q bo'lsa default" → `??`. "bo'sh yoki 0 ham default" → `||` yoki aniq shart.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `||` — falsy ni almashtiradi (0, "", false).
- `??` — faqat null/undefined.
- AI odatdagi `||` ni qo'yib, 0/"" ni yo'qotib qo'yadi.