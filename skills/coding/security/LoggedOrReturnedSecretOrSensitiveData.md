---
name: logged-or-returned-secret
description: Parol, token, API kalit, shaxsiy ma'lumot console.log, error message, API javobi yoki log'ga tushib qolgan — xavfsizlik va maxfiylik buzilishi.
---

# Maxfiy ma'lumotni log qilish yoki qaytarish

## Nima uchun bu skill kerak
AI debug qilish yoki "qulaylik" uchun `console.log(user)`, `console.log(req.body)`, `return { token, password }` kabi narsalarni yozib qoldiradi. Yoki xato xabariga maxfiy ma'lumotni qo'shadi. Bu ishlaydi, lekin production'da xavfsizlik va maxfiylik buziladi. AI "hozir kerak" deb o'ylaydi va keyin olib tashlashni unutadi.

## Simptom (aynan shu)
- Kodda:
  - `console.log(password)`, `console.log(apiKey)`, `console.log(req.headers.authorization)`
  - Error message ichida token yoki parol
  - API javobida `password`, `secret`, `privateKey` maydonlari
- Yoki log fayllarida / monitoring'da maxfiy ma'lumot ko'rinadi.

## Sabab (100%)
AI debug qulayligi uchun to'liq obyektni chiqaradi yoki xato matniga kontekst qo'shadi. "Bu faqat dev uchun" deb o'ylaydi, lekin kod production'ga ham tushadi. E'tibor chalg'ishi: xavfsizlik oqibatini hisobga olmaslik.

## Tasdiqlash
1. `console.log`, `logger.`, `res.json`, `throw new Error` joylarini qidiring.
2. Ichida `password`, `token`, `secret`, `apiKey`, `authorization`, `cookie` yoki to'liq `user`/`req.body` bormi?
3. Agar ha — maxfiy ma'lumot sizib chiqishi mumkin.

## Tuzatish (aynan shu)
Maxfiy maydonlarni hech qachon log/qaytarma:

```js
// XATO:
console.log('User:', user);           // password ham chiqadi
console.log(req.body);                // token/parol bo'lishi mumkin
return { ...user, token };            // parol ham ketishi mumkin
throw new Error(`Auth failed: ${token}`);

// TO'G'RI:
console.log('User id:', user.id);
console.log('Body keys:', Object.keys(req.body));
return { id: user.id, name: user.name, token }; // password yo'q
throw new Error('Auth failed');
```

Agar debug kerak bo'lsa — vaqtinchalik log qo'ying va **darhol** olib tashlang. Production kodda maxfiy ma'lumot qoldirmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `console.log(user)` yoki `req.body` — maxfiy ma'lumot sizishi mumkin.
- Error message va API javobida ham sir saqlang.
- AI debug uchun yozib, olib tashlashni unutishi eng ko'p xavfsizlik chalg'ishi.
