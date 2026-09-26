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
