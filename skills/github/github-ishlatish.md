# github-ishlatish

# GitHub API orqali MR nomidan ish qilish — to'liq qo'llanma

## Nima uchun bu skill kerak
MR kompyuterida `~/.gh-api.sh` skripti bor — u GitHub Personal Access Token
(PAT, `repo` + `workflow` scope) yordamida GitHub API ga so'rov yuboradi.
Claude bu orqali MR nomidan repolarni boshqarishi, workflow'larni ko'rishi/
ishga tushirishi, fayl push qilishi mumkin — **lekin tokenning o'zini hech
qachon ko'rmaydi**, chunki skript javobdagi har qanday token-ko'rinishidagi
qatorni (`github_pat_...`, `ghp_...`, `gho_...`, `ghs_...`) avtomatik `***`
bilan almashtiradi.

## 1. Qanday chaqiriladi
`cmc` connectordagi `run_command` orqali, kompyuterda:
```bash
bash ~/.gh-api.sh METHOD /path [BODY_JSON]
```
- `METHOD`: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- `/path`: GitHub API yo'li, masalan `/user`, `/repos/mrdevs2011/X`,
  `/repos/mrdevs2011/X/contents/file.md`.
- `BODY_JSON` (ixtiyoriy, POST/PUT/PATCH uchun): JSON string, masalan
  `'{"name":"yangi-repo","private":true}'`.

Tekshirish (token ishlayaptimi): `bash ~/.gh-api.sh GET /rate_limit` —
`remaining: 5000` chiqsa autentifikatsiya to'g'ri (login qilinmagan bo'lsa
60 bo'lardi).

## 2. Ko'p ishlatiladigan endpointlar
| Vazifa | So'rov |
|---|---|
| O'z repolar ro'yxati | `GET /user/repos?per_page=100&sort=updated` |
| Bitta repo ma'lumoti | `GET /repos/mrdevs2011/NOM` |
| Repo yaratish | `POST /user/repos` + `{"name":"NOM","private":true}` |
| Repo o'chirish | `DELETE /repos/mrdevs2011/NOM` (faqat aniq so'ralganda!) |
| Fayl o'qish | `GET /repos/mrdevs2011/NOM/contents/PATH` (`content` base64) |
| Fayl yozish/yangilash | `PUT /repos/mrdevs2011/NOM/contents/PATH` + `{"message":"...","content":"BASE64","sha":"ESKI_SHA (yangilashda)"}` |
| Workflow ro'yxati | `GET /repos/mrdevs2011/NOM/actions/workflows` |
| Workflow ishga tushirish | `POST /repos/mrdevs2011/NOM/actions/workflows/ID/dispatches` + `{"ref":"main"}` |
| Workflow runlar holati | `GET /repos/mrdevs2011/NOM/actions/runs` |
| Issue/PR ro'yxati | `GET /repos/mrdevs2011/NOM/issues` yoki `/pulls` |

Fayl yozishda (`PUT contents`) content albatta **base64** bo'lishi kerak.
Ko'p qatorli yoki maxsus belgili matn uchun `.gh-api.sh` ning `$3` argumentiga
to'g'ridan-to'g'ri yozish xato beradi — bunday holda python3 bilan JSON ni
o'zi tuzib, to'g'ridan-to'g'ri xuddi shu token o'zgaruvchisidan foydalanib
alohida so'rov yuborish kerak (masalan katta faylni push qilishda).

## 3. Xavfsizlik qoidalari (o'zgarmas)
- **Tokenni hech qachon ko'rsatma.** `cat ~/.gh-mrtoken.txt`, `echo $T` qilma.
  Skript javobidagi token-ko'rinishidagi qatorlarni ham qayta chop etma.
- **Repo o'chirish (`DELETE /repos/...`) faqat MR aniq nom(lar)ni aytib
  so'raganda.** Har doim o'chirishdan oldin ro'yxatni ko'rsat va MR
  tasdiqlashini kut (agar u oldindan "hammasini o'chir" deb aniq
  tasdiqlamagan bo'lsa).
- **Force push, branch o'chirish, repo settings o'zgartirish** — bularni ham
  xavfli amal deb hisobla, aniq so'ralmasa qilma.
- **Token faqat shu skript orqali.** Boshqa joyga (`.git/config`, log,
  commit xabari, memory/skill fayllariga) yozilmasligi kerak.
- **`uploads` repo (`mrdevs2011/uploads`) alohida qoida bilan ishlaydi** —
  vaqtinchalik o'tkazma joyi, doim bo'sh turishi kerak (qarang: `instruction.md`
  "Uploads: markaziy uzatish nuqtasi" bo'limi). Bu skill boshqa barcha repolar
  uchun umumiy GitHub ish qoidalarini beradi.

## 4. Xato bo'lsa
- `401` — token noto'g'ri yoki muddati tugagan: MR ga ayt, `.gh-mrtoken.txt`
  ni yangilashni so'ra.
- `403` — huquq yetmaydi (scope kam) yoki rate limit: xabarni aynan ayt.
- `404` — repo/fayl/yo'l noto'g'ri yoki mavjud emas: nomini tekshir.
- `422` — validatsiya xatosi (masalan fayl PUT qilishda eski `sha` berilmagan):
  avval `GET contents` bilan joriy `sha` ni ol, keyin `PUT` ga qo'sh.

## Xulosa
- `bash ~/.gh-api.sh METHOD /path [BODY]` — GitHub bilan MR nomidan ishlash.
- Token hech qachon ko'rinmaydi (skript avtomatik maskalaydi).
- O'chirish/xavfli amallar faqat MR aniq so'raganda va tasdiqlagandan keyin.
- Fayl yozishda content base64, yangilashda joriy `sha` kerak.
