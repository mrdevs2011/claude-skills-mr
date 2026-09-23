---
name: regex-catastrophic-backtracking-or-wrong
description: Regex noto'g'ri yozilgan yoki catastrophic backtracking ga moyil — sekin ishlaydi, hang qiladi, yoki kutilgan matnni mos kelmaydi.
---

# Regex: noto'g'ri pattern yoki catastrophic backtracking

## Nima uchun bu skill kerak
AI murakkab regex yozadi: nested quantifier (`(a+)+`), noaniq chegaralar. Ba'zi inputlarda CPU 100%, tab osiladi (ReDoS). Yoki oddiy xato — pattern kutilgan matnni umuman ushlamaydi. Validatsiya, parse, search da uchraydi.

## Simptom (aynan shu)
- Muayyan input da sahifa/process hang.
- Regex "ishlamayapti" — kutilgan match yo'q.
- `.match` / `.test` / `replace` kutilmagan natija.
- Pattern da `(.+)+`, `(.*)*`, yoki juda ochiq quantifier.

## Sabab (100%)
Nested/yoriq quantifier catastrophic backtracking chaqiradi. Yoki pattern mantiqan noto'g'ri (belgi sinfi, anchor, group). AI "ishlaydi" deb murakkab ifoda yozadi, edge case'ni sinamaydi.

## Tasdiqlash
1. Regex ishlatilgan joyni toping.
2. Pattern da nested `+`/`*` bormi? (`(a+)+`, `(.*)*`)
3. Kichik va "yomon" input (uzun takror) bilan sinab ko'ring — sekinlashadimi?
4. Oddiy misollarda to'g'ri match qiladimi?

## Tuzatish (aynan shu)
Soddalashtiring yoki xavfsiz alternativ:

```js
// XATO — catastrophic:
const re = /^(a+)+$/;  // "aaaaaaaaaaaaaaaaaaaaX" — hang

// TO'G'RI — oddiy:
const re = /^a+$/;

// XATO — haddan tashqari ochiq:
const email = /.*@.*/;  // deyarli hammasi o'tadi

// TO'G'RI — aniqroq (yoki kutubxona):
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// yoki maxsus validatsiya kutubxonasi
```

Qoida: nested quantifier dan saqlaning. Murakkab parse uchun regex o'rniga parser/kutubxona. Har doim "yomon" input bilan sinang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Nested `+`/`*` = ReDoS xavfi.
- Regex ni murakkablashtirish o'rniga soddalashtiring.
- AI "kuchli" pattern yozib, hang yoki noto'g'ri match qiladi.