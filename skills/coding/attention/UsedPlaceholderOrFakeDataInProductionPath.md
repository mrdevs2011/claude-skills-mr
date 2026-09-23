---
name: placeholder-or-fake-data-in-production
description: AI test/placeholder qiymat (lorem, test@test.com, 12345, mock data) ni asosiy kod yo'lida qoldirgan — production'da yoki real foydalanuvchida chiqadi.
---

# Placeholder / fake data production yo'lida

## Nima uchun bu skill kerak
AI demo yoki test uchun `John Doe`, `test@example.com`, `password123`, hardcode qilingan massiv yozadi va asosiy oqimda qoldiradi. Real API/state ulashni unutadi. Foydalanuvchi "nima uchun test ma'lumot?" deb qoladi yoki production'da chalkash ma'lumot chiqadi.

## Simptom (aynan shu)
- Kodda: `const user = { name: 'Test User', email: 'test@test.com' }`.
- `// TODO: replace with real API` izohi bor, lekin real chaqiruv yo'q.
- UI da doim bir xil mock ro'yxat.
- Env/API o'rniga hardcode qilingan ma'lumot.

## Sabab (100%)
AI "ishlayotgan ko'rinish" uchun mock yozadi va keyin real ulashni yakunlamaydi. Yoki misol sifatida yozganini asosiy yechim deb qoldiradi.

## Tasdiqlash
1. Hardcode qilingan ism, email, id, massiv bormi?
2. Ular faqat test/storybook da emas, asosiy component/page da ishlatilayaptimi?
3. Real fetch/API/state o'rniga shu mock turibdimi?
4. Agar ha — placeholder qolgan.

## Tuzatish (aynan shu)
Mock ni olib tashlang, real manbaga ulang:

```js
// XATO:
const users = [
  { id: 1, name: 'John Doe', email: 'john@test.com' },
];
return <UserList users={users} />;

// TO'G'RI:
const { data: users, isLoading, error } = useUsers();
if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <UserList users={users ?? []} />;
```

Qoida: placeholder faqat aniq test/story/dev flag ostida. Production path da real ma'lumot.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mock/demo data asosiy yo'lda qolmasligi kerak.
- AI "ko'rinish uchun" yozib, real ulashni unutadi.
- Yakuniy kodda hardcode test qiymat — red flag.