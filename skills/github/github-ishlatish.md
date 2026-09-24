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

## 0. Avval hal qil: token KERAKMI? (adaptiv, muhim)

Token (`~/.gh-api.sh`) har doim ishlatilmaydi — faqat aynan kerak bo'lganda.
Claude o'zi hal qiladi, MR dan so'ramaydi:

**Token KERAK EMAS** (token'siz, oddiy `git clone`/ochiq so'rov bilan bajar):
- Ochiq (public) repo'ni clone/pull qilish, o'qish, fayl ko'rish — token
  shart emas: `git clone https://github.com/USER/REPO.git`.
- Public GitHub API so'rovlari (ochiq repo ma'lumoti, ochiq user profili,
  ochiq issue/PR ro'yxati o'qish) — token'siz oddiy so'rov yetarli.
- Natija MR ning shaxsiy hisobiga bog'liq bo'lmasa va yozish/o'zgartirish
  talab qilinmasa.

**Token KERAK** (`~/.gh-api.sh` yoki token bilan autentifikatsiya ishlat):
- So'rov aniq MR **nomidan** bajarilishi kerak bo'lsa — "mening nomimdan
  qil", "mening hisobimda", "o'zim qilganday" kabi ma'no anglashilsa.
- Yozish/o'zgartirish amali: repo yaratish/o'chirish, fayl push/yangilash,
  workflow ishga tushirish, issue/PR ochish/yopish, repo sozlamalarini
  o'zgartirish.
- MR ning **private** repo yoki private ma'lumotiga kirish kerak bo'lsa.
- Public so'rov rate-limit'ga uchrasa (60/soat) va MR autentifikatsiyalangan
  limit (5000/soat) kerak bo'lsa.

**Qoida:** ishonchli bo'lmasa — avval token'siz sinab ko'r (masalan oddiy
`git clone` yoki token'siz `curl`). Ishласа va natija public/o'qish bilan
cheklangan bo'lsa, shu bilan tugat. Faqat yuqoridagi "token kerak" holatlariga
to'g'ri kelsa yoki token'siz urinish yetarli bo'lmasa (401/403/404-private,
yoki rate limit), keyingi qadamda token'ga o't. MR ga nima uchun token
ishlatilganini (yoki ishlatilmaganini) alohida tushuntirib o'tirish shart
emas — faqat natijani ayt.

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

## 5. Git orqali ishlash (clone → tahrir → commit → push)
Bir nechta fayl yoki repo ichida ishlash uchun API emas, git qulayroq.
Hamma narsa `~/Claude/work` ichida bo'ladi (butun ish `~/Claude` ichida):
```bash
mkdir -p ~/Claude/work && cd ~/Claude/work
GIT_ASKPASS="$HOME/.gh-askpass.sh" GIT_TERMINAL_PROMPT=0 git clone -q https://github.com/mrdevs2011/REPO.git
cd REPO        # tahrirla, sinab ko'r
git add -A && git -c user.name="MR" -c user.email="mrdevs2011@users.noreply.github.com" commit -q -m "..."
GIT_ASKPASS="$HOME/.gh-askpass.sh" GIT_TERMINAL_PROMPT=0 git push -q origin HEAD:main
```
- `.gh-askpass.sh` tokenni o'zi `~/.gh-mrtoken.txt` dan oladi — buyruqda va
  chiqishda token ko'rinmaydi. Remote URL doim tokensiz (`https://github.com/...`);
  tokenni `.git/config` ga yozma.
- Private repo clone va push `hard_write` bo'ladi: `confirmed:true` kerak
  (MR so'ragan bo'lsa o'rinli).
- Branch nomini oldindan bil: `git rev-parse --abbrev-ref HEAD`.
- CMMGH tokeni (`get_upload_token`) faqat `uploads` uchun. Loyiha repo'sida
  `403 Permission denied` chiqsa, uni ishlatib ko'rma — `.gh-askpass.sh` ishlat.
- Push tekshirilgach (`git status -sb` da `main...origin/main`) ish papkasini
  `instruction.md` dagi `~/Claude` tozalash qoidasiga ko'ra tozala.

## Xulosa
- `bash ~/.gh-api.sh METHOD /path [BODY]` — GitHub bilan MR nomidan ishlash.
- Token hech qachon ko'rinmaydi (skript avtomatik maskalaydi).
- O'chirish/xavfli amallar faqat MR aniq so'raganda va tasdiqlagandan keyin.
- Fayl yozishda content base64, yangilashda joriy `sha` kerak.
