---
name: nested-ternary-instead-of-clear-conditional
description: Murakkab shartlarni nested ternary (? :) bilan yozish — o'qish qiyin, xato ehtimoli yuqori, refaktor og'ir. Oddiy if-else yoki yordamchi funksiya ishlatilishi kerak.
---

# Murakkab shartlarda nested ternary o'rniga aniq if-else yoki helper ishlatmaslik

## Nima uchun bu skill kerak
Agentlar ba'zan "qisqa" kod uchun nested ternary operatorlarni ishlatadi. 2-3 darajali ternary o'qishni qiyinlashtiradi, xato qilish oson (noto'g'ri guruhlash, noto'g'ri else), va keyinroq o'zgartirish og'ir. Early return yoki oddiy if-else ancha toza.

## Simptom (aynan shu)
- Kodda `condition1 ? (condition2 ? valueA : valueB) : valueC` kabi nested ternary.
- Bir qatorda 3+ ternary yoki murakkab shart.
- Kod "ishlaydi", lekin o'qishda 10 soniyadan ko'p vaqt ketadi yoki xato tushuniladi.
- Yangi shart qo'shilganda ternary yanada chalkashadi.

## Sabab (100%)
Agent "bir qatorda yozish" yoki "qisqa expression" ni afzal ko'radi, o'qish qulayligini e'tiborsiz qoldiradi. Ternaryni faqat oddiy 1-shartli holatlar uchun ishlatish kerakligini unutadi.

## Tasdiqlash
1. Kodda `?` belgisi 2+ marta bir expression ichida bormi?
2. Shartni oddiy if-else ga o'girganda o'qish osonroq bo'ladimi?
3. Mantiq murakkab (2+ shart) bo'lsa, ternary ishlatilganmi?
4. Kod review yoki keyingi o'zgartirishda chalkashlik bo'lishi mumkinmi?

## Tuzatish (aynan shu)
Nested ternary o'rniga oddiy if-else yoki alohida helper funksiya ishlat:

```js
// Noto'g'ri (nested ternary):
const status = user ? (user.active ? (user.role === 'admin' ? 'full' : 'limited') : 'inactive') : 'none';

// To'g'ri (aniq if-else):
function getStatus(user) {
  if (!user) return 'none';
  if (!user.active) return 'inactive';
  if (user.role === 'admin') return 'full';
  return 'limited';
}
const status = getStatus(user);

// Yoki oddiy holatda:
let status;
if (!user) {
  status = 'none';
} else if (!user.active) {
  status = 'inactive';
} else if (user.role === 'admin') {
  status = 'full';
} else {
  status = 'limited';
}
```

Qoidalar:
- Ternary faqat oddiy `a ? b : c` uchun ishlat (1 daraja).
- 2+ shart yoki murakkab mantiqda if-else yoki funksiya.
- Early return bilan ham birlashtirish mumkin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Nested ternary o'qishni qiyinlashtiradi va xato ehtimolini oshiradi.
- Murakkab shartlar uchun aniq if-else yoki yordamchi funksiya ishlat.
- Qisqa kod har doim yaxshi emas — o'qiladigan kod yaxshiroq.
