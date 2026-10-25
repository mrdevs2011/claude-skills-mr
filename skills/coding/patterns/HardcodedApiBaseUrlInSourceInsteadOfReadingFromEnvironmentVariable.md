---
name: hardcoded-api-base-url-instead-of-env
description: API base URL yoki endpoint kod ichida hardcode qilingan, environment variable o'rniga. Deploy yoki boshqa muhitda ishlamaydi yoki noto'g'ri serverga so'rov yuboradi.
---

# Hardcoded API base URL manba kodda, environment variable o'rniga

## Nima uchun bu skill kerak
Turli muhitlarda (local, staging, production) API manzili o'zgaradi. Hardcode qilinsa, kodni o'zgartirmasdan konfiguratsiya qilish imkoni yo'qoladi, va noto'g'ri muhitga so'rov ketishi yoki deploy paytida ishlamasligi mumkin.

## Simptom (aynan shu)
Kod ichida API manzili to'g'ridan-to'g'ri yozilgan:
```js
const BASE_URL = "https://api.example.com";
fetch(`${BASE_URL}/users`);
```
yoki
```python
BASE_URL = "https://api.example.com"
requests.get(f"{BASE_URL}/users")
```
Localda ishlaydi, lekin boshqa muhitda (masalan production) noto'g'ri yoki xato qaytaradi. Yoki URL o'zgartirish uchun kodni qayta deploy qilish kerak.

## Sabab (100%)
API base URL yoki endpoint konfiguratsiya sifatida emas, manba kod ichida literal string sifatida hardcode qilingan. Environment variable (process.env, os.environ, .env) o'qilmagan.

## Tasdiqlash
- Kodda "https://" yoki "http://" bilan boshlanuvchi URL stringlarini qidirish.
- `process.env.API_URL` yoki `os.environ.get("API_BASE_URL")` kabi o'qish yo'qligini tekshirish.
- .env yoki deployment platformasi (Vercel, Docker) da shu o'zgaruvchi bor-yo'qligini ko'rish.

## Tuzatish (aynan shu)
URL ni environment variable dan o'qish.

JavaScript / Node:
```js
const BASE_URL = process.env.API_BASE_URL;
if (!BASE_URL) {
  throw new Error("API_BASE_URL environment variable is required");
}
fetch(`${BASE_URL}/users`);
```

Python:
```python
import os
BASE_URL = os.environ.get("API_BASE_URL")
if not BASE_URL:
    raise ValueError("API_BASE_URL environment variable is required")
requests.get(f"{BASE_URL}/users")
```

.env faylida:
```
API_BASE_URL=https://api.example.com
```
Va .gitignore da .env bo'lishi kerak. Deploymentda ham shu env var ni o'rnatish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
API manzillarini kodga hardcode qilmaslik kerak — ularni environment variable orqali o'qish kerak. Bu turli muhitlarda konfiguratsiyani osonlashtiradi va kodni o'zgartirmasdan ishlatishga imkon beradi. Agar URL yo'q bo'lsa, aniq xato tashlash yaxshiroq.
