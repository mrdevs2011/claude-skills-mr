---
name: javascript-used-settimeout-for-debouncing-without-clearing-previous-timer
description: Debounce implementatsiyasida setTimeout ishlatilganda oldingi timeout ID ni clearTimeout bilan tozalamaslik, tez-tez keladigan eventlarda bir nechta kechiktirilgan bajarilishga olib keladi.
---

# JavaScriptUsedSetTimeoutForDebouncingWithoutClearingPreviousTimerCausingMultipleRapidExecutions

## Nima uchun bu skill kerak
Debounce (kechiktirish) patternida foydalanuvchi inputi yoki scroll eventlarini cheklash uchun setTimeout ishlatiladi. Agar oldingi timer tozalanmasa, har bir event yangi timer yaratadi va ularning barchasi ishga tushadi — natijada bir marta o'rniga ko'p marta API chaqiruv yoki hisoblash bo'ladi.

## Simptom (aynan shu)
- Input fieldda tez yozilganda bir nechta search/API so'rov yuboriladi.
- Scroll yoki resize eventda funksiya bir necha marta ishga tushadi.
- Timer ID saqlanmagan yoki clearTimeout chaqirilmagan.
- "debounce" qilingan funksiya baribir bir nechta natija beradi.

## Sabab (100%)
Har safar event kelganda yangi setTimeout yaratiladi, lekin oldingi timeout ID o'zgaruvchida saqlanmaydi yoki clearTimeout(oldId) chaqirilmaydi. Shuning uchun oldingi timerlar bekor qilinmaydi va ularning hammasi belgilangan vaqtdan keyin ishga tushadi.

## Tasdiqlash
1. Kodda setTimeout ishlatilgan joyda oldingi timer ID ni saqlash va clearTimeout bor-yo'qligini tekshir.
2. Tez-tez event simulyatsiya qil (masalan, 100ms intervalda 10 marta chaqir) va funksiya necha marta ishga tushganini hisobla.
3. Console.log yoki counter bilan tekshir — debounce to'g'ri ishlasa faqat oxirgi eventdan keyin bir marta ishga tushishi kerak.

## Tuzatish (aynan shu)
Timer ID ni saqla va yangi timer yaratishdan oldin oldingisini tozala:

```javascript
let debounceTimer = null;

function debounce(fn, delay) {
  return function(...args) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);  // oldingi timer ni bekor qil
    }
    debounceTimer = setTimeout(() => {
      fn.apply(this, args);
      debounceTimer = null;
    }, delay);
  };
}

// Ishlatish:
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));
```

Qoidalar:
- Har doim oldingi timeout ID ni saqla.
- Yangi setTimeout dan oldin clearTimeout chaqir.
- Timer ishga tushgandan keyin ID ni null qil (ixtiyoriy, lekin toza).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Debounce uchun setTimeout ishlatganda oldingi timer ni albatta clearTimeout bilan tozalash kerak. Aks holda tez eventlar bir nechta kechiktirilgan bajarilishga olib keladi. Bu pattern search, resize, scroll kabi holatlarda muhim.
