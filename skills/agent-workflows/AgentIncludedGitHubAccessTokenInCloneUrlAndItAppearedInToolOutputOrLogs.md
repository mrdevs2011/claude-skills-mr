---
name: agent-included-github-access-token-in-clone-url-and-it-appeared-in-tool-output-or-logs
description: Agent GitHub PAT yoki access token bilan clone qilganda to'liq URL ni tool output, log yoki javobda ko'rsatib yubordi — token sizib chiqdi.
---

# GitHub access token clone URL ichida tool output yoki javobda ko'rinishi

## Nima uchun bu skill kerak
Agentlar ba'zan `git clone https://x-access-token:TOKEN@github.com/...` buyrug'ini ishlatadi. Agar tool natijasi, terminal logi yoki yakuniy javobda to'liq URL (token bilan) chiqsa, maxfiy token ochiq bo'ladi. Bu xavfsizlik buzilishi. Token hech qachon log, output yoki javobda ko'rinmasligi shart.

## Simptom (aynan shu)
- `git clone` yoki `git push` buyrug'ida `x-access-token:ghp_...` yoki `github_pat_...` bor.
- Tool response, bash output yoki agentning yakuniy matnida token yoki to'liq autentifikatsiyali URL paydo bo'ladi.
- Foydalanuvchi "tokenni chiqarma" deb ogohlantirgan, lekin baribir ko'rindi.

## Sabab (100%)
Agent tokenni URL ichiga qo'yib, buyruqni ishga tushirdi, lekin tool output'ini filtrlash yoki yashirishni unutdi. Yoki tokenni javobda "qilgan ish" sifatida yozib qo'ydi. Git va bash tool'lari odatda buyruqni va uning stdout/stderr'ini qaytaradi.

## Tasdiqlash
1. Oxirgi bash tool chaqiruvlarini ko'r — clone/push URL'ida token bormi?
2. Tool result matnida `github_pat_`, `ghp_`, `x-access-token:` qidir.
3. Yakuniy javobda token yoki to'liq URL bor-yo'qligini tekshir.
4. Agar bor bo'lsa — bu aynan shu xato.

## Tuzatish (aynan shu)
1. Tokenni hech qachon tool call argumentida yoki javobda yozma.
2. Agar kerak bo'lsa, environment variable yoki git credential helper ishlat (yoki foydalanuvchi oldindan sozlagan).
3. Clone qilgandan keyin output'ni tekshir: agar token chiqgan bo'lsa, uni yashirib, faqat "clone muvaffaqiyatli" deb ayt.
4. Hisobotda faqat skill nomi, commit hash, muvaffaqiyat — tokenni umuman tilga olma.
5. .gitignore va .env ni tekshir, lekin tokenni ularga yozma.

```bash
# XATO — token output'da ko'rinadi:
git clone https://x-access-token:github_pat_XXXX@github.com/user/repo.git /tmp/repo

# TO'G'RI — tokenni yashirish:
# (amalda tokenni oldindan env ga qo'y yoki credential ishlat)
GIT_TERMINAL_PROMPT=0 git clone "https://x-access-token:${TOKEN}@github.com/user/repo.git" /tmp/repo
# Keyin output'ni agent o'zi filter qiladi, tokenni javobga chiqarmaydi.
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Autentifikatsiyali git URL'dagi token hech qachon tool output yoki javobda qolmasligi kerak.
- Buyruqni ishga tushirishdan oldin "bu logda token chiqadimi?" deb o'ylab ko'r.
- Hisobotda faqat kerakli ma'lumot (skill nomi, hash) bo'lsin, maxfiy narsa yo'q.
