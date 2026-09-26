# Token

Token endi kodda yozilmagan — faqat Vercel loyihasining
**Settings → Environment Variables → `TOKEN`** qiymatida saqlanadi.
Git tarixida (eski commitlarda) qolgan avvalgi statik token endi
ishlamaydi — kod uni fallback sifatida ishlatmaydi (`api/index.js`:
`const TOKEN = process.env.TOKEN;`, fallback yo'q).

## Ulash URL

```
https://claude-skills-mr.vercel.app/mcp?k=<VERCEL DASHBOARD'DAGI TOKEN>
```

Yoki header orqali:

```
Authorization: Bearer <VERCEL DASHBOARD'DAGI TOKEN>
```

## OAuth so'ralsa

Connector "OAuth" deb so'rasa ham xatolik chiqmaydi — server o'zi avtomatik
tasdiqlaydi va shu bitta statik token'ni qaytaradi. Bu haqiqiy OAuth emas,
faqat Claude'ning tekshiruvi o'tishi uchun. `/token` endi haqiqatan
`/authorize` orqali chiqqan (va bir marta ishlatiladigan) `code`ni talab
qiladi — bundan oldin har qanday so'rovga TOKEN qaytarib yuborardi.

## Token yo'qolsa / almashtirilsa

Vercel dashboard'da `TOKEN` env var qiymatini yangilang, qayta deploy qiling
(Vercel avtomatik qiladi), va Claude'dagi connector URL'idagi `?k=...`
qismini yangi qiymatga almashtiring.
