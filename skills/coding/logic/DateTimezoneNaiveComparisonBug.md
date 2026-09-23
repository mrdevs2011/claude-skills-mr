---
name: date-timezone-naive-comparison
description: Sana/vaqt solishtirish yoki formatlashda timezone e'tiborsiz — kun siljishi, "kecha/bugun" chalkash, UTC vs local farqi.
---

# Sana: timezone e'tiborsiz solishtirish

## Nima uchun bu skill kerak
AI `new Date()`, `toISOString()`, `getDate()` ni aralashtiradi. Server UTC, brauzer local — bir kun farq chiqadi. "Bugun" filtri kechagi yoki ertangi yozuvlarni oladi. Xato jim, lekin biznes mantiq buziladi.

## Simptom (aynan shu)
- Ro'yxatda "bugun" deb belgilangan yozuv aslida kecha/ertaga.
- `date1 < date2` kutilganidan boshqacha.
- ISO string va local Date aralashgan.
- Faqat ba'zi timezone'larda (yoki faqat production'da) xato.

## Sabab (100%)
Date obyektlari timezone bilan ishlaydi, lekin AI "kun" ni oddiy string/number deb hisoblaydi. UTC midnight local'da oldingi kun bo'lishi mumkin.

## Tasdiqlash
1. Sana solishtirish/format joylarini toping.
2. Qiymatlar UTC mi, local mi, string mi?
3. Kun chegarasi (00:00) ishlatiladimi?
4. Turli timezone'da bir xil natija beradimi?

## Tuzatish (aynan shu)
Bir xil asosda (UTC yoki aniq timezone) ishlang:

```js
// XATO — local vs UTC chalkash:
const today = new Date();
const created = new Date(item.createdAt); // ISO UTC
if (created.getDate() === today.getDate()) { ... } // timezone da xato

// TO'G'RI — kunni UTC da solishtirish:
function toUTCDateString(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
if (toUTCDateString(created) === toUTCDateString(new Date())) { ... }

// Yoki kutubxona (date-fns, dayjs) bilan timezone aniq:
import { formatInTimeZone } from 'date-fns-tz';
```

Qoida: sana "kun" sifatida solishtirilsa — ikkala tomon bir xil timezone (odatda UTC date string).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Date = timezone sezgir. "Bugun" local va UTC da farq qilishi mumkin.
- Kun solishtirish — YYYY-MM-DD yoki aniq timezone.
- AI timezone ni e'tiborsiz qoldiradi — jim biznes xatosi.