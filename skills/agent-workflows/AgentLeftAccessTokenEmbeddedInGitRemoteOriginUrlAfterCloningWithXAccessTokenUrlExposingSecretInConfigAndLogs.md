---
name: agent-left-token-in-git-remote-origin-url
description: Repo x-access-token bilan klon qilingandan keyin remote origin URL da token qolgan — git config, log, push yoki boshqa operatsiyalarda secret chiqib ketadi.
---

# Clone URL da token qoldirish — remote origin da secret saqlanadi

## Nima uchun bu skill kerak
GitHub Personal Access Token (PAT) ni clone URL ga (https://x-access-token:TOKEN@github.com/...) qo'yib klon qilish qulay, lekin keyin `git remote -v` yoki config da token ochiq qoladi. Bu loglarga, xato xabarlariga, scriptlarga yoki keyingi push/pull da secretning chiqib ketishiga olib keladi. Tokenni hech qachon chiqarmaslik qoidasi buziladi.

## Simptom (aynan shu)
- `git clone https://x-access-token:ghp_...@github.com/user/repo.git` buyrug'i ishlatilgan.
- Klon qilingandan keyin `git remote -v` yoki `.git/config` da URL da to'liq token ko'rinadi.
- Keyingi `git push`, `git fetch`, xato loglari yoki script chiqishida token matni paydo bo'ladi.
- Foydalanuvchi "tokenni hech qachon chiqarma" degan qoidani eslatadi, lekin remote da u saqlanib qolgan.

## Sabab (100%)
Git clone URL dagi credentiallarni remote.origin.url ga to'g'ridan-to'g'ri yozadi. Agent clone dan keyin remote URL ni tozalashni (tokenni olib tashlash yoki credential helper ishlatish) unutadi yoki "vaqtinchalik" deb qoldiradi.

## Tasdiqlash
1. Clone buyrug'ida `x-access-token:` yoki token borligini tekshir.
2. `git remote -v` yoki `cat .git/config | grep url` bilan URL da token qolganini ko'r.
3. Agar token URL da bo'lsa — bu holat.
4. Keyingi git operatsiyalari logida yoki outputda token chiqmasligini ta'minlash kerakmi? (ha)

## Tuzatish (aynan shu)
Clone dan darhol keyin remote URL ni token siz qilib yangila:

```bash
# Clone (token bilan)
git clone https://x-access-token:TOKEN@github.com/user/repo.git /tmp/repo

cd /tmp/repo

# Remote ni toza URL ga o'zgartir (tokenni olib tashla)
git remote set-url origin https://github.com/user/repo.git

# Tasdiqlash: token yo'qligini tekshir
git remote -v
# Natija: https://github.com/user/repo.git (token yo'q)
```

Yoki credential helper ishlat (agar mavjud bo'lsa), lekin hech qachon tokenni config yoki logda qoldirma. Har doim clone dan keyin `git remote set-url` bilan tozala.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
x-access-token bilan klon qilishdan keyin darhol `git remote set-url origin https://github.com/user/repo.git` bilan tokenni remote dan olib tashla. Aks holda secret git config, log va keyingi operatsiyalarda ochiq qoladi. Tokenni hech qachon chiqarma.
