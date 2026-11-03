---
name: javascript-fetch-without-response-ok-check
description: JavaScript kodda fetch() chaqirilgandan so'ng response.ok yoki status tekshirilmasdan .json() yoki .text() chaqiriladi — HTTP xato statuslarda (4xx/5xx) parse xatosi yoki noto'g'ri data.
---

# Fetch API da response.ok yoki status tekshirmasdan body parse qilish

## Nima uchun bu skill kerak
`fetch()` HTTP xato statuslarida (404, 500 va h.k.) throw qilmaydi — u faqat tarmoq xatolarida throw qiladi. Xato statusda body ko'pincha HTML xato sahifasi yoki bo'sh bo'ladi, shuning uchun to'g'ridan-to'g'ri `.json()` chaqirish JSON parse xatosiga olib keladi yoki kutilmagan data qaytaradi. Har doim statusni tekshirish kerak.

## Simptom (aynan shu)
- `const data = await (await fetch(url)).json();` yoki shunga o'xshash, `response.ok` yoki `response.status` tekshiruvi yo'q.
- HTTP 4xx/5xx da `SyntaxError: Unexpected token < in JSON at position 0` yoki shunga o'xshash parse xatosi.
- Xato javobda kutilgan obyekt o'rniga HTML matn yoki undefined olish.
- Server xato qaytarganda client jim davom etadi yoki crash qiladi.

## Sabab (100%)
Dasturchi `fetch` ni `axios` yoki boshqa kutubxona kabi xato statusda avtomatik throw qiladi deb o'ylaydi. Lekin native Fetch API faqat tarmoq muammolarida reject qiladi, HTTP status xatolarida resolve qiladi.

## Tasdiqlash
1. `fetch()` chaqiruvi bormi?
2. Natija `.json()`, `.text()` yoki boshqa body metodidan oldin `response.ok`, `response.status >= 200 && response.status < 300` yoki shunga o'xshash tekshiruv yo'qmi?
3. Agar shunday bo'lsa — bu holat. Status tekshiruvi va aniq xato handling kerak.

## Tuzatish (aynan shu)
Har doim statusni tekshir, keyin body ni parse qil. Xato bo'lsa aniq xato tashla yoki handle qil.

Noto'g'ri:
```javascript
async function getData(url) {
  const response = await fetch(url);
  const data = await response.json(); // xato statusda HTML parse qilishga urinadi
  return data;
}
```

To'g'ri:
```javascript
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    // yoki: const errorText = await response.text(); throw new Error(errorText);
  }
  const data = await response.json();
  return data;
}
```

Yoki qisqaroq:
```javascript
const response = await fetch(url);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
return await response.json();
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`fetch()` HTTP xato statuslarida throw qilmaydi. Body ni parse qilishdan oldin har doim `response.ok` yoki statusni tekshirish kerak, aks holda parse xatosi yoki noto'g'ri data olish mumkin.
