---
name: unpinned-dependency-versions-non-reproducible-builds
description: requirements.txt yoki package.json da dependency versiyalari pin qilinmagan (faqat nom yoki >= ishlatilgan). Natijada yangi install yoki CI da boshqa versiya o'rnatilib, silent breakage yoki test fail.
---

# Unpinned dependency versiyalari non-reproducible build qiladi

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar tez-tez `pip install requests` yoki `npm install axios` qilib, requirements.txt / package.json ga faqat paket nomini yozib qo'yadi. Bu "hozir ishlaydi" holatini yaratadi, lekin ertaga yoki boshqa mashinada yangi major versiya chiqib, API o'zgargani uchun kod sinadi.

## Simptom (aynan shu)
- `requirements.txt` da `requests` yoki `requests>=2.0` kabi yozuv.
- `package.json` da `"axios": "^1.0.0"` yoki `"axios": "*"` yoki faqat nom.
- CI/CD yoki yangi `pip install -r` / `npm install` da testlar yiqiladi yoki runtime xato chiqadi, lekin lokalda (eski cache) ishlaydi.
- `pip freeze` yoki `package-lock.json` / `poetry.lock` commit qilinmagan.

## Sabab (100%)
Versiya pin qilinmagani uchun package manager eng so'nggi mos versiyani o'rnatadi. Major update'da breaking change bo'lsa, kod o'zgarmasdan sinadi. Lock file yo'qligi sababli har safar boshqacha resolution.

## Tasdiqlash
1. `requirements.txt` yoki `pyproject.toml` da `==` yo'qmi?
2. `package.json` da `^` yoki `~` yoki range bormi, va lock file commit qilinganmi?
3. `pip freeze > requirements.txt` yoki `npm install` dan keyin lock file `git status`da ko'rinadimi?
4. CI logida boshqa versiya o'rnatilgani haqida xabar bormi?

## Tuzatish (aynan shu)
Aniq versiyani pin qil va lock file ishlat:

```txt
# requirements.txt — noto'g'ri
requests
flask>=2.0

# To'g'ri (hozirgi ishlayotgan versiyani freeze qil)
requests==2.31.0
flask==2.3.3
```

Yoki Poetry/Pipenv bilan:

```bash
pip install requests
pip freeze > requirements.txt
# yoki
poetry add requests
# poetry.lock commit qilinsin
```

Node uchun:

```json
// package.json — noto'g'ri
"dependencies": {
  "axios": "^1.6.0"
}

// To'g'ri: aniq versiya yoki npm ci + package-lock.json commit
"dependencies": {
  "axios": "1.6.2"
}
```

`package-lock.json` yoki `yarn.lock` / `poetry.lock` ni git ga qo'sh. CI da `npm ci` yoki `pip install -r requirements.txt` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Dependency larni aniq `==` bilan pin qil.
- Lock file ni commit qil — reproducible build uchun.
- Range (`>=`, `^`) faqat keng kutubxona uchun, production app uchun emas.
