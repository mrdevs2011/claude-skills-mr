---
name: javascript-used-map-for-side-effects-instead-of-foreach
description: JavaScript'da Array.map side effect (log, mutate, network) uchun ishlatilgan — map transformatsiya uchun, forEach side effect uchun. Natijada keraksiz array yaratiladi va niyat noaniq bo'ladi.
---

# Array.map side effect uchun ishlatilgan (forEach o'rniga)

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar "map hamma narsani qila oladi" deb hisoblab, faqat transformatsiya qilish o'rniga side effect (console.log, state mutate, API chaqiruv, fayl yozish) uchun `array.map` ishlatadi. Bu keraksiz yangi array yaratadi, niyatni yashiradi, va ba'zan xato (masalan, map ichida return yo'qligi) keltirib chiqaradi. Aniq va samarali kod uchun to'g'ri metodni tanlash kerak.

## Simptom (aynan shu)
- `array.map(item => { doSomething(item); })` yoki return'siz map.
- Map natijasi ishlatilmaydi (assign qilinmaydi, ignore qilinadi).
- Faqat side effect kerak (log, mutate, dispatch), lekin map tanlangan.
- Kod o'qishda "bu transformatsiyami yoki effectmi?" degan savol tug'iladi.
- Performance: katta array'da keraksiz yangi array.

## Sabab (100%)
Map metodining maqsadi yangi array qaytarish (transformatsiya). Side effect uchun u ishlatilganda dasturchi "qulay" deb o'ylagan, lekin metodning asl niyatini e'tiborsiz qoldirgan. forEach yoki oddiy for loop aniqroq va keraksiz array yaratmaydi.

## Tasdiqlash
1. `map` chaqiruvi ichida asosan side effect bormi (log, setState, fetch, push)?
2. Map qaytargan qiymat keyin ishlatilmaydimi?
3. Har bir callback return qiladimi yoki undefined qaytaradimi?
4. forEach yoki for...of ishlatilsa kod qisqaroq va aniqroq bo'ladimi?

## Tuzatish (aynan shu)
Side effect uchun **forEach** ishlat. Transformatsiya uchun **map**.

```javascript
// Noto'g'ri — side effect + keraksiz array
users.map(user => {
  console.log(user.name);
  user.processed = true;
});

// To'g'ri — aniq side effect
users.forEach(user => {
  console.log(user.name);
  user.processed = true;
});

// To'g'ri — transformatsiya
const names = users.map(user => user.name);
```

Agar async side effect bo'lsa — forEach o'rniga oddiy for...of + await yoki Promise.all bilan map (faqat transformatsiya uchun).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `map` faqat yangi qiymat qaytarish (transformatsiya) uchun. Side effect uchun `forEach`.
- Map natijasini ignore qilish — kodni ifloslantiradi va keraksiz xotira ishlatadi.
- To'g'ri metodni tanlash niyatni aniq qiladi va kichik xatolarning oldini oladi.
