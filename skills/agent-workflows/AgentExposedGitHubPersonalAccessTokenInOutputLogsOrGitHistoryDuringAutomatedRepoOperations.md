---
name: agent-exposed-github-pat-in-output-or-history
description: Agent cloned or pushed to a private skills repository using a GitHub personal access token but printed the token in console output, logs, commit messages, or files, risking credential exposure.
---

# Agent exposed GitHub PAT in output, logs, or git history

## Nima uchun bu skill kerak
Avtomatik skill generator vazifalarida GitHub PAT (personal access token) clone va push uchun ishlatiladi. Token hech qachon chiqishda, logda, commit message'da yoki fayllarda ko'rsatilmasligi kerak. Agar agent tokenni echo qilsa yoki git history'ga tushsa, secret oshkor bo'ladi va repo xavfsizligi buziladi.

## Simptom (aynan shu)
- Clone yoki push buyrug'i bajarilganda terminal chiqishida to'liq `github_pat_...` token ko'rinadi.
- Agent javobida yoki hisobotda tokenning bir qismi yoki to'liq matni bor.
- `git log` yoki commit message ichida token paydo bo'ladi.
- Token `.env` yoki boshqa commit qilingan faylga yozilgan.
- Keyinchalik GitHub xavfsizlik ogohlantirishlari yoki token revoke bo'ladi.

## Sabab (100%)
Agent user ko'rsatmasidagi "Tokenni hech qachon chiqarishda yoki logda ko'rsatma" qoidasini e'tiborsiz qoldirdi. Clone URL'ni to'liq echo qildi, debug uchun buyruqni chiqardi, yoki tokenni .env ga yozib commit qildi. Git credential'ni yashirish uchun `x-access-token:` formatini ishlatgan bo'lsa ham, chiqishni filtrlashni unutdi.

## Tasdiqlash
1. Terminal chiqishi va agent javobida `github_pat_` yoki `x-access-token:` qidir.
2. `git log -p --all | grep -i pat` yoki shunga o'xshash bilan history'ni tekshir.
3. `git status` va staged fayllarda secret yo'qligini tasdiqla.
4. Clone buyrug'i bajarilganda token faqat URL ichida qolgan, lekin stdout'ga tushmaganini ko'r.

## Tuzatish (aynan shu)
- Clone va push buyruqlarini bajarishda tokenni hech qachon echo yoki print qilma.
- Bash chaqiruvlarida URL'ni to'g'ridan-to'g'ri ishlat, lekin chiqishni keraksiz qismlarini kesib tashla yoki silent rejimda ishlat.
- Tokenni hech qachon faylga (hatto .env ga) yozib commit qilma — .env ignore'da bo'lsin va bo'sh yoki misol bilan yaratilsin.
- Hisobotda faqat "push muvaffaqiyatli" deb yoz, token haqida hech narsa aytma.
- Agar token tasodifan chiqsa, darhol yangi token generatsiya qilishni tavsiya qil (lekin o'zing chiqarma).

```bash
# Noto'g'ri — token chiqadi
echo "Cloning with token: github_pat_xxxx"
git clone https://x-access-token:${TOKEN}@github.com/user/repo.git

# To'g'ri — token yashirin
git clone "https://x-access-token:${TOKEN}@github.com/user/repo.git" /tmp/repo 2>&1 | grep -v "github_pat" || true
# yoki chiqishni umuman log qilmasdan ishlat
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- GitHub PAT hech qachon chiqishda, logda, history'da yoki commit qilingan fayllarda ko'rsatilmasligi kerak.
- Avtomatik operatsiyalarda secret'larni yashirish majburiy — user qoidasiga 100% amal qil.
- Token oshkor bo'lsa, darhol revoke va yangilash kerak, lekin agent o'zi tokenni qayta chiqarmasligi kerak.
