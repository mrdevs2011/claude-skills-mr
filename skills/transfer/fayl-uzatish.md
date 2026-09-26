---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: Base64 hech qachon chatda qo'lda ishlatilmaydi. Har doim GitHub uploads repo orqali. Ko'p fayl bo'lsa — zip.
---

# Fayl uzatish

## 0. Eng muhim, istisnosiz qoida

**AI hech qachon base64 matnini chatda ko'rsatib, keyin uni CMC orqali
qo'lda (`cat > fayl << EOF ... base64 ... EOF` + `base64 -d`) yozdirmaydi.**
Fayl kichik (bir necha KB) yoki katta bo'lishidan qat'i nazar — bu usul
har doim TAQIQLANGAN: xato ehtimoli yuqori, javob shishib ketadi va MR
buni xohlamaydi.

Sandbox'dan kompyuterga (yoki MRdrive'ga) fayl o'tkazishning YAGONA yo'li:

**GitHub `uploads` repo orqali** (CMMGH):
1. Sandbox bash: faylni (yoki bir nechta fayl bo'lsa — avval ularni bitta
   `.zip`ga yig'ib, o'sha zip'ni) `uploads` repo rootiga qo'sh, commit,
   `git push origin main`.
2. CMC (`run_command`): `~/.uploads-pull.sh NOM [MANZIL_PAPKA]` — repo'ni
   vaqtinchalik klonlab, `NOM`ni manzilga ko'chiradi, muvaffaqiyatli bo'lsa
   `uploads` repo'dan o'chirib push qiladi.
3. Agar tortilgan narsa `.zip` bo'lsa — CMC orqali o'sha manzilda
   `unzip NOM.zip -d MANZIL` (yoki kerakli joyga) bajarib, ichidagi har bir
   faylni to'g'ri joyga qo'y, so'ng vaqtinchalik zip/papkani tozala.

Bu yagona to'g'ri yo'l — bitta fayl bo'lsa ham, o'nlab fayl bo'lsa ham.
Ko'p fayl uchun zipsiz, birma-bir base64 orqali "qo'lda yozish" — taqiqlangan.

`CMC` yo'q/xato bo'lsa — kompyuterga umuman push qilma, `present_files`
bilan chatda ber (fayl bilan, base64 emas).

## Boshqa qoidalar

AI hech qachon `mrdrive.push` (base64 orqali to'g'ridan-to'g'ri) ni
o'ylamasin. MRdrive push FAQAT CMC orqali:
```bash
mrdrive push /to'liq/yo'l/fayl.png [papka]
```
(fayl allaqachon kompyuterda bo'lishi kerak — yuqoridagi uploads oqimi
bilan tushirilgan bo'lsa ham bo'ladi.)

CMC yo'q va foydalanuvchi push desa — yuklama. Yumshoq javob (o'zbekcha):

> bunday tool mavjud emas ekan. Lekin papka yarata olaman, MRdrive'dan fayllarni ko'ra olaman, yuklab olish linkini bera olaman, ko'chira olaman va o'chira olaman.

CMC / kompyuter / kengaytma deb tushuntirma.
Pushdan boshqa MRdrive ishlari: `list`, `list_folders`, `pull`, `create_folder`, `move_file`, `delete`.

## Fayl so'ralsa — link + outputdagi haqiqiy fayl

Kompyuterga yuklash shart emas. Suhbat outputiga chiqar.

1. `mrdrive.get(filename)`
2. `link` ni foydalanuvchiga ber
3. `download` dan faylni DARHOL yukla
4. Shu javobda haqiqiy faylni ko'rsat/biriktir (matn, rasm, fayl)

Faqat URL yetarli emas. ~/Claude/ ga yozma.

## Kompyuterdan sandbox'ga (aksincha yo'nalish)

MR ba'zan sandbox'ga (Claude ishlayotgan konteynerga) o'z kompyuteridan
fayl o'tkazishni so'rashi mumkin ("skrinshot yubor", "shu faylni o'zingga
ol", "buni sandboxga tashla" kabi). Yo'nalish teskari bo'lsa ham vosita bir
xil — `uploads` ko'prigi (`mrdevs2011/uploads`, doim bo'sh turishi kerak),
faqat endi push kompyuterdan, pull esa sandbox tomondan bo'ladi.

### 1. Kompyuter tomonida push (`cmc` `run_command`, bitta chaqiruvda)

```bash
mkdir -p /tmp/up && cd /tmp/up
cp /kerakli/fayl(lar) .          # ko'p fayl bo'lsa avval bitta .zip qil
GIT_ASKPASS="$HOME/.gh-askpass.sh" GIT_TERMINAL_PROMPT=0 \
  git clone -q https://github.com/mrdevs2011/uploads.git repo
cp fayl-yoki-zip-nomi repo/
cd repo
git -c user.name="MR" -c user.email="mrdevs2011@users.noreply.github.com" \
  add -A && git commit -q -m "to sandbox: NOM"
GIT_ASKPASS="$HOME/.gh-askpass.sh" GIT_TERMINAL_PROMPT=0 git push -q origin main
cd / && rm -rf /tmp/up
```

Xuddi shu `.gh-askpass.sh` tokeni ishlatiladi (bu token `repo` scope bilan
barcha loyiha repolariga kira oladi, `uploads` ham shular qatorida) — CMMGH
tokeni (`get_upload_token`) bu yo'nalishda kerak emas, u faqat sandbox
tomonidan foydalaniladi. `uploads` private repo, shuning uchun push
`hard_write` — MR aniq so'raganda `confirmed:true` bilan bajariladi.

### 2. Sandbox tomonida pull (Claude o'zi bajaradi)

1. `connectmymcpgithub.get_upload_token` bilan `uploads` uchun token ol.
2. `bash_tool`: bitta chaqiruvda
   `git clone https://x-access-token:$TOKEN@github.com/mrdevs2011/uploads.git`
   — token javobda hech qachon ko'rsatilmaydi, klondan keyin darhol
   ishlatilmay qo'yiladi.
3. Kerakli fayl(lar)ni `/mnt/user-data/outputs/` ga ko'chir (zip bo'lsa
   avval yech).
4. `present_files` bilan foydalanuvchiga chiqar — rasm/screenshot bo'lsa
   shu orqali chatda ko'rinadi, boshqa fayl bo'lsa yuklab olish sifatida.

### 3. Tozalash (majburiy, ikkala yo'nalish uchun ham)

Fayl muvaffaqiyatli o'qib olingach, sandbox darhol o'sha faylni `uploads`
repo'dan o'chirib push qiladi (bitta qo'shimcha chaqiruvda, token qayta
chop etilmaydi) — repo yo'nalishidan qat'i nazar doim bo'sh turishi kerak.

### 4. Xavfsizlik

Token (na kompyuter, na sandbox tomonida) hech qachon chatda/javobda
ko'rsatilmaydi. Boshqa xato/skoup holatlari — yuqoridagi asosiy
(sandbox→kompyuter) bo'limdagi qoidalar bilan bir xil.
