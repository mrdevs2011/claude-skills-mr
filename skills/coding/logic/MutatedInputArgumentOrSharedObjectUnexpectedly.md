---
name: mutated-input-argument-or-shared-object
description: Funksiya o'ziga berilgan argument yoki shared obyektni ichida o'zgartiradi (mutate) — chaqiruvchi kutmagan side-effect, qiyin topiladigan bug.
---

# Argument yoki shared obyektni mutate qilish

## Nima uchun bu skill kerak
AI funksiya ichida `arr.push`, `obj.field =`, `array.sort()` (in-place) qiladi. Chaqiruvchi o'sha massiv/obyektni keyin ishlatganda qiymat o'zgarib qolganini ko'radi. Xato chiqmaydi, lekin mantiq buziladi. Bu React state mutate'ga o'xshash, lekin umumiy JS/TS uchun.

## Simptom (aynan shu)
- Funksiya chaqirilgach, tashqaridagi o'zgaruvchi kutilmaganda o'zgaradi.
- "Nima uchun bu massiv o'zgarib qoldi?" 
- `sort()`, `reverse()`, `splice()`, `push` to'g'ridan-to'g'ri argumentda.
- Bir nechta joy bir xil obyektga referens bergan.

## Sabab (100%)
JS'da obyekt/massiv referens bilan uzatiladi. AI "qulay" deb in-place o'zgartiradi va chaqiruvchi ta'sirlanishini o'ylamaydi. Yoki `sort()` qaytarishini biladi, lekin u asl massivni ham o'zgartirishini unutadi.

## Tasdiqlash
1. Funksiya parametrlarini va ichidagi `push`/`splice`/`sort`/`obj.x =` larni toping.
2. Shu parametr tashqarida ham ishlatiladimi?
3. Agar ha va mutate qilinayotgan bo'lsa — side-effect bor.

## Tuzatish (aynan shu)
Nusxa oling, aslini o'zgartirmang:

```js
// XATO — asl massiv o'zgaradi:
function addItem(list, item) {
  list.push(item);
  return list;
}
const original = [1, 2];
addItem(original, 3); // original ham [1,2,3] bo'lib qoldi

// TO'G'RI:
function addItem(list, item) {
  return [...list, item];
}

// XATO — sort aslini o'zgartiradi:
const sorted = items.sort((a, b) => a - b);

// TO'G'RI:
const sorted = [...items].sort((a, b) => a - b);

// XATO — obyekt mutate:
function update(user, name) {
  user.name = name;
  return user;
}

// TO'G'RI:
function update(user, name) {
  return { ...user, name };
}
```

Qoida: argumentni mutate qilmang (agar aniq hujjatlashtirilgan side-effect bo'lmasa). Yangi qiymat qaytaring.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Massiv/obyekt referens — ichida o'zgartirish tashqarini ham o'zgartiradi.
- `sort`/`reverse`/`push` in-place. Nusxa oling.
- AI qulaylik uchun mutate qilib, side-effect yaratadi.