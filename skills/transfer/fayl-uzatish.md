# fayl-uzatish

# Fayl uzatish: sandbox ↔ kompyuter ↔ MRdrive/repo (to'liq protokol)

Bu skill uchta bir-biriga bog'liq mavzuni birlashtiradi: (1) CMMGH orqali
sandbox'dan kompyuterga o'tkazish, (2) "uploads" markaziy ko'prik qoidalari,
(3) "push qil" degan so'zni qaysi repo'ga yo'naltirish kerakligi.
Umumiy tamoyil: sandbox va foydalanuvchi kompyuteri bir-birini ko'rmaydi —
`mrdevs2011/uploads` repo ular orasidagi vaqtinchalik ko'prik, doim bo'sh
turishi kerak.

## 1. Qачон bu yo'l kerak

Fayl (zip, loyiha, patch, artifact, sandbox'da yaratilgan narsa) foydalanuvchining
KOMPYUTERIGA yoki kompyuter orqali yetadigan joyga (mrdrive, loyiha repo'si)
borishi kerak bo'lsa va `cmc`/`run_command` mavjud bo'lsa — bu yo'lni o'zing
tanla, foydalanuvchi "uploads'ga ko'chir" demasa ham.

Katta/muhim faylni sandbox'dan to'g'ridan-to'g'ri boshqa connector tool'ga
(masalan `mrdrive push`) base64 bilan yuborish SEKIN va NOZIK ishlaydi —
buning o'rniga har doim avval kompyuterga tushir, keyin kompyuterdan davom et.

## 2. CMMGH: sandbox → uploads repo

1. Foydalanuvchi aniq push/upload so'ramaguncha `get_upload_token` ni chaqirma.
2. `get_upload_token` ni chaqir → `{ "token": "github_pat_..." }`.
3. Bitta bash chaqiruvida clone+copy+push (tokenning ko'rinish oynasini qisqartirish uchun):
   ```bash
   T='<token>'
   git clone -q "https://x-access-token:${T}@github.com/mrdevs2011/uploads.git" /tmp/uploads-repo
   cd /tmp/uploads-repo
   cp /path/to/file.zip .
   git config user.email "cmmgh@local"; git config user.name "CMMGH"
   git add file.zip && git commit -qm "add file.zip"
   git push origin main
   ```
4. Muvaffaqiyatli bo'lsa: fayl nomi + commit hash ayt. Repo: `github.com/mrdevs2011/uploads`.
5. Xatolar: `403`/`Permission denied` → token muddati/huquqi (Vercel'da `GH_TOKEN`
   yangilash kerak). `401` MCP tomonida → `MCP_AUTH_TOKEN` xato. 100 MB dan katta
   fayl → GitHub qabul qilmaydi, foydalanuvchiga ayt. Releases ishlatma.

**Xavfsizlik (qat'iy):**
- Token qiymatini javobda hech qachon qayta chop etma (na "Response:", na boshqa shaklda).
- Buyruq matnida token literal ko'rinsa ham, bu foydalanuvchiga ochiladi — shuning
  uchun bitta chaqiruvda clone+push qilib oynani qisqart, push tugagach buyruqni qayta ko'rsatma.
- Chiqishda token ko'rinsa `sed 's/github_pat_[A-Za-z0-9_]*/***/g'` bilan yashir.
- Bu token FAQAT `uploads` uchun — loyiha repolariga bu token bilan push qilma,
  `~/.gh-askpass.sh`/`~/.gh-api.sh` ishlat (token kompyuterda qoladi, chatda hech ko'rinmaydi).
- Token allaqachon oshkor bo'lgan bo'lsa: darhol foydalanuvchiga ayt, kompromis
  deb hisobla, GitHub'da revoke qilib yangisini yaratishni tavsiya qil.
- `uploads` repo'da faqat so'ralgan fayllarni yoz; boshqa fayllarni so'ramasdan o'chirma/ustidan yozma.

## 3. Uploads: kompyuterga tortish (doim bo'sh qolishi kerak)

Faqat `cmc` ishlayotganda va narsa kompyuterga tushishi kerak bo'lganda ishlatiladi.
`run_command` yo'q/xato bo'lsa — uploads'ga umuman push qilma, `present_files` bilan chatda ber.

1. `get_upload_token` (sandbox bash uchun, chatga yozilmaydi).
2. Sandbox bash: faylni `uploads` repo rootiga qo'sh, commit, `git push origin main` (yuqoridagi bo'lim).
3. `run_command` (kompyuter): `~/.uploads-pull.sh NOM [MANZIL_PAPKA]`
   — repo'ni vaqtinchalik klonlaydi, `NOM`ni manzilga ko'chiradi (manzil bo'lmasa `~`),
   hajm/son mos kelsagina repo'dan o'chirib push qiladi, vaqtinchalik papkani tozalaydi.
   Token `~/.gh-mrtoken.txt` dan avtomatik olinadi, buyruqda ko'rinmaydi.
   Muvaffaqiyat: `OK: <yo'l> (N fayl, M bayt). uploads repo'dan o'chirildi.`
4. Foydalanuvchiga to'liq manzilni ayt.

Manzil берilmasa: `~/Claude/Uploads` ga qo'y (bu "uying" ichidagi kirish nuqtasi).
Faqat MR aniq boshqa joy aytsa, o'sha yerga. `/` yoki `sudo` kerak bo'lsa — bu
xavfli, avval so'ra (`confirmed:true`).

**Skript kodlari:** `0` OK. `3` repo'da NOM yo'q. `4` manzilda shu nomli
fayl bor — ustidan yozmadi, foydalanuvchidan so'ra. `5` tekshiruv mos kelmadi —
manzildagi nusxani ko'rib chiq. Skript yo'q bo'lsa: qo'lda klonla/ko'chir/tekshir/
`git rm`+commit+push, tekshirmasdan o'chirma.

**Tozalash (majburiy):** har muvaffaqiyatli transferdan keyin repo bo'sh bo'lishi
kerak — foydalanuvchi alohida aytmasa ham o'chir. Muvaffaqiyatsiz bo'lsa fayl
repo'da qayta urinish tugaguncha turadi. Eskirgan/keraksiz fayl repo'da topilsa
(kompyuterga ko'chirmasdan) shunchaki o'chir. Istisno: foydalanuvchi aniq
"uploads'da qoldir" desa, o'chirma.

**Token kompyuterda:** faqat `~/.gh-mrtoken.txt` (ruxsat 600), `cat`/`echo`
qilma, `set -x` ishlatma. Remote/config/tarixga yozma. Klon doim vaqtinchalik
papkada, oxirida o'chiriladi.

## 4. "Push qil" — qaysi repo?

`uploads` HECH QACHON "push qilingan joy" emas — faqat ko'prik. "Push qil"
avtomatik uploads degani emas. Qadamlar:

1. Ish MR ning mavjud loyihasiga tegishlimi (masalan "mrdrive uchun push qil")?
   `github-ishlatish` skill orqali `GET /user/repos` bilan mos nomli repo qidir
   (masalan `mrdrive`, `mrdrive-app`).
   - **Aniq mos nom topilsa** → o'zgargan fayllarni to'g'ridan-to'g'ri o'sha repo'ga push qil.
   - **Aniq topilmasa, lekin suhbat mavzusi bor** → `GET /user/repos?sort=updated&per_page=10`
     bilan oxirgi faol repolarni ko'r, mavzuga mos kelsa unga push qil va qaysi
     repo tanlanganini bir jumlada ayt.
   - **Hech qanday ishonchli signal yo'q** → shundagina so'ra: "qaysi repo'ga push qilay?"
     Taxmin bilan yangi repo yaratma, uploads'da qoldirib "push qildim" dema.
2. Loyiha repo'siga push tartibi (sandbox'da o'zgargan fayllar bo'lsa):
   1) Fayl/zip'ni uploads orqali kompyuterga tushir (bo'lim 3).
   2) Kompyuterda repo'ni clone qil, `diff -rq` bilan nima o'zgarganini aniqla.
   3) Commit+push: `GIT_ASKPASS=~/.gh-askpass.sh git push` yoki `~/.gh-api.sh`
      (`confirmed:true` kerak — foydalanuvchi so'ragan, shuning uchun o'rinli).
   4) Repo nomi, commit hash, o'zgargan fayllarni ayt.
3. Foydalanuvchi aniq "uploads'ga tashla"/"kompyuterimga tushirib qo'y" desa —
   to'g'ridan-to'g'ri CMMGH (bo'lim 2-3), boshqa repo qidirma.

## 5. MRdrive'ga uzatish

MRdrive — MR ning o'z fayl ombori (Google Drive emas). Manba sandbox bo'lsa
(chatda yaratilgan fayl/artifact) va manzil MRdrive bo'lsa: bu ham "manba
sandbox, manzil kompyuter orqali" holati — orada `cmc` ko'prigi kerak.

Odatiy yo'l: sandbox → uploads repo (bo'lim 2) → `run_command` bilan
`~/.uploads-pull.sh` (bo'lim 3) → tekshirilgach uploads'dan o'chirilgan →
kompyuterdan turib `mrdrive push` bilan yakuniy joyga. Fayl juda kichik/oddiy
bo'lsa qisqaroq yo'l aniq ko'rinsa moslashtirish mumkin — printsip o'zgarmaydi:
katta faylni to'g'ridan-to'g'ri sandbox'dan mrdrive'ga base64 bilan yubormaslik.
Har safar "qanday o'tkazay" deb so'rash shart emas — bajar, qayerga tushganini
bir jumlada ayt.

MRdrive tool tanlash: ko'rish `list`/`list_folders` erkin. Yuklash `push`
(kerak bo'lsa oldin `create_folder`). Fayl nomi noaniq bo'lsa avval `list` bilan
eng mos nomzodni top (tanlaganingni ayt), faqat bir nechtasi teng mos kelsa
so'ra. Papka aytilmasa: `list_folders`dan mavzuga mos papka top, topilmasa
root'ga yukla va qayerga qo'yganingni ayt.
