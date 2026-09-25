# cmc-ishlatish

# CMC (CMComputer): MR ning kompyuterida buyruq bajarish — to'liq qo'llanma

## Nima uchun bu skill kerak
`cmc` — MR ning shaxsiy kompyuterida (Linux, foydalanuvchi `muhamad`) buyruq
bajaradigan connector. Fayl o'qish/yozish, dastur ishga tushirish, git, Blender,
tekshiruv, o'rnatish — hammasi shu orqali. Bu skill: qachon ishlatiladi, qanday
chaqiriladi, nimalardan ehtiyot bo'lish kerak, xato bo'lsa nima qilish kerak.

## 1. Toollar
Hub orqali ulangan bo'lsa nomi `cmc__run_command` (yoki `mcp__MCP_Hub__cmc__run_command`).

| Tool | Nima uchun |
|---|---|
| `run_command` | Kompyuterda buyruq bajaradi. |
| `get_recent_commands` | Oxirgi bajarilgan buyruqlar tarixi (audit). |

`run_command` parametrlari:
- `command` (majburiy): bajariladigan buyruq.
- `cwd` (ixtiyoriy): ish papkasi. Berilmasa cmc'ning o'z papkasi ishlatiladi
  (`/home/muhamad/.config/cmc-backend`), shuning uchun nisbiy yo'l ishlatma:
  yo'lni to'liq yoz yoki `cd ... &&` qil.
- `confirmed` (ixtiyoriy): xavfli buyruq uchun `true`.

Javob shakli:
```
ok: true|false
exitCode: 0
durationMs: 12
cwd: /home/muhamad/...
riskLevel: read_safe | unknown | dangerous | hard_write ...
----- stdout -----
...
----- stderr -----
...
```
`ok: true` va `exitCode: 0` bo'lsagina buyruq muvaffaqiyatli. `stderr` bo'sh
bo'lsa "(bo'sh)" deb chiqadi.

## 2. Qachon ishlatiladi
- MR kompyuterda biror narsa qilishni so'rasa (fayl, papka, dastur, git, server).
- Blender modeli so'ralsa (skill: `blender/BlenderModelAutoWorkflowViaWebblender`).
- Fayl kompyuterga tushishi kerak bo'lsa (uploads orqali, 6-bo'lim).

Qachon ishlatilmaydi:
- Oddiy suhbat, savol-javob, chatda kod yozib berish (kompyuter kerak emas).
- MR hech narsa so'ramagan bo'lsa: "shunchaki qarab qo'yay" deb kompyuterni
  kezib chiqma.

## 3. Muhim xususiyatlar (tajribadan)
- **Har chaqiruv yangi shell.** `cd`, `export`, o'zgaruvchilar keyingi chaqiruvga
  o'tmaydi. Kerakli hammasini bitta buyruqda yoz: `cd ~/loyiha && npm test`.
- **Shell `/bin/sh -c`.** Bash yoki fish'ga xos sintaksis (`[[ ]]`, massivlar,
  `set -l`) ishlamasligi mumkin. Oddiy POSIX yoz; kerak bo'lsa `bash -c '...'`.
- **30 soniya timeout.** Undan uzun ish uzilib qoladi. Uzoq ishni fonda yugurt:
  `nohup buyruq > /tmp/ish.log 2>&1 &`, keyin `tail /tmp/ish.log` bilan kuzat.
- **`~` = `/home/muhamad`.** Kerak bo'lsa `$HOME` ishlat.
- **Yashirin papkalar:** `ls` ularni ko'rsatmaydi, `ls -a` ishlat (masalan
  `~/.blender`).

## 3a. `sudo` parol so'rab qolsa (muhim, umumiy qoida)

`run_command` interaktiv emas (TTY yo'q, bitta so'rov-bitta javob). `sudo`
parol talab qilsa, u osilib qolmaydi — tezda aniq xato bilan qaytadi:
`sudo: a password is required` yoki `sudo: a terminal is required to read
the password`. Bu xabarni ko'rsang:

1. **Boshqa flag/variant bilan qayta "sinab ko'rma".** Sabab texnik xato
   emas — printsipial cheklov: parolni hech qanday yo'l bilan kirita
   olmayman va kiritishga urinmayman ham (taxmin qilish, faylдан o'qish,
   `-S` bilan bo'sh/tахmin parol yuborish va h.k. — hammasi noto'g'ri).
2. **Vazifa uchun bu buyruq haqiqatan kerak bo'lsa** (sudo'siz bajarib
   bo'lmaydigan ish): MR ga **aynan bajarilishi kerak bo'lgan buyruqni**
   to'liq, copy-paste qilsa bo'ladigan holda ber. Masalan:
   > Bu buyruq sudo so'rayapti, o'zim bajara olmayman. Terminalingda shuni
   > ishga tushir:
   > ```
   > sudo systemctl restart cmc-backend cmc-ngrok
   > ```
   > Bajargach ayt, davom etaman.
3. **MR "bajardim" / "tayyor" / "yt" deganidan keyin** — natijani o'zing
   tekshirib (masalan sudo kerak bo'lmagan `status` bilan), ishni xuddi
   shu joydan davom ettir. Boshidan boshlama, faqat sudo talab qilgan
   qadamdan keyingisiga o't.
4. Vazifaning sudo kerak bo'lmagan qismi bo'lsa, MR javobini kutmasdan
   o'sha qismni oldindan bajarib qo'y (parallel), keyin faqat sudo
   qismini kutib qol.
5. Shu xil sudo buyrug'i suhbatda tez-tez takrorlanayotganini sezsang
   (masalan `cmc restart` doim shu holatga tushsa), MR ga **bir marta**
   taklif qil: aynan shu buyruq(lar)ga (`/etc/sudoers.d/...` orqali,
   tor va aniq) `NOPASSWD` qo'shish variantini — lekin faqat taklif
   sifatida, o'zing sudoers faylga hech qachon so'ramasdan tegma.
- **Flag/parametrni taxmin qilib sinama.** Notanish skript yoki dastur uchun
  `--help`, `-h` kabi flag borligiga ishonch bo'lmasa, avval shu narsani
  chaqirib "ko'raman" deb urinma — bu ko'pincha xato bilan qaytadi (`exitCode
  != 0`) va bekorga "Failed" ko'rinishida qayd bo'ladi, xolos hech qanday
  foyda bermaydi. Buning o'rniga avval `cat SKRIPT` yoki mos `SKILL.md`/
  docstring bilan qanday chaqirilishini o'qib bil, keyin to'g'ri argument
  bilan bitta marta chaqir. Maqsad: har bir `run_command` chaqiruvi birinchi
  urinishdayoq muvaffaqiyatli bo'lishi kerak, "sinab ko'raman" rejimida
  ishlatilmaydi.
- **Kompyuter oddiy foydalanuvchi huquqida.** `/` ga yozib bo'lmaydi. "Root papka"
  deganda uy papkasini (`~`) tushun. `sudo` faqat aniq kerak bo'lsa va oldin MR dan
  so'rab.
- **Murakkab buyruqlar ba'zan connector xatosi beradi** (masalan ba'zi
  `curl -X POST ...`). Buyruqni soddalashtir yoki qismlarga bo'l.
- **Heredoc:** fayl yozayotganda terminator sifatida `PYEOF` kabi noyob so'z
  ishlat; matn ichida `<< 'EOF'` yoki backtick (`) yozma. Katta faylni bir
  chaqiruvda yozib, keyingisida tekshir.
- **`pgrep -af 'server.py'` o'zini ham topadi** (buyruq matnida shu so'z bor).
  O'zini chiqarib tashlash uchun `pgrep -af '[s]erver.py'` yoz.

## 4. Xavfsizlik: buyruq turlari
cmc har buyruqqa `riskLevel` beradi.

- **read_safe** (`ls`, `cat`, `grep`, `find`, `pgrep`, `git status` ...): erkin
  ishlat, so'rama.
- **unknown / oddiy yozish** (`mkdir`, `cp`, `mv`, `sed -i`, `python3 skript.py`):
  MR so'ragan ishning qismi bo'lsa qil; nima qilganingni qisqa ayt.
- **dangerous / hard_write** (`rm -rf`, `shutdown`, `reboot`, `git push --force`,
  `sudo`, diskni formatlash, katta ko'chirish/ustidan yozish): `confirmed:true`
  talab qiladi. Faqat MR aniq so'ragan yoki tasdiqlagandagina `true` qo'y.
  Tasdiqni o'zingdan berma.

Qoidalar:
- **O'chirish yoki ustidan yozish faqat aniq so'ralganda.** Mavjud faylni so'ramay
  o'chirma, ustidan yozma. Manzilda shu nomli fayl bor bo'lsa, nomini o'zgartir
  yoki so'ra.
- **Zaxira:** muhim faylni `sed -i` bilan o'zgartirishdan oldin nusxa ol:
  `cp fayl fayl.bak-oldin`. Oldin `grep -n` bilan nimani o'zgartirishingni ko'r.
- **Tokenni yashir.** Parol, token yoki kalit chiqishda ko'rinib qolsa:
  `... | sed 's/github_pat_[A-Za-z0-9_]*/***/g'`. Tokenni javobga, faylga, commit
  xabariga, skill yoki memory'ga yozma. Kompyuterda `git remote` yoki
  `.git/config` ga token qoldirma.
- **Faqat MR ning ishi.** MR so'ramagan papka va fayllarga tegma. Boshqa foydalanuvchi
  yoki tizim fayllarini o'zgartirma.
- **Taqiqlangan yo'lni aylanib o'tma.** cmc ishlamasa yoki buyruq rad etilsa,
  boshqa yashirin yo'l bilan bajarishga urinma; sababini ayt.

## 5. Yaxshi odat: qil → tekshir → qisqa ayt
1. Avval ko'r: `ls -la`, `cat`, `grep -n` (nima bor, qayerda).
2. Keyin qil (bitta aniq buyruq yoki bir necha `&&` bilan).
3. Natijani **o'zing tekshir**: fayl bormi, sintaksis to'g'rimi
   (`python3 -c "import ast;ast.parse(open('f.py').read())"`), server javob
   beryaptimi.
4. MR ga 2-4 jumlada ayt: nima qilding, nima o'zgardi, MR nima qilishi kerak
   (agar kerak bo'lsa). "Bajardim" deb faqat tekshirgandan keyin ayt.

Ko'p ishlatiladigan namunalar:
```bash
ls -la ~/papka                      # papka ichini ko'rish
cat ~/papka/fayl.md                 # faylni o'qish
grep -rn "kalit" ~/papka --include=*.py   # qidirish
mkdir -p ~/loyiha && cd ~/loyiha && git init   # yangi loyiha
python3 ~/.blender/push.py --status # servis holati
echo ok                             # cmc tirikmi tekshirish
```

## 6. Fayl kompyuterga o'tishi kerak bo'lsa (uploads orqali)
Sandbox (Claude bulutida) va MR kompyuteri bir-birini ko'rmaydi. Fayl
`mrdevs2011/uploads` (private) repo orqali o'tadi. **Repo doim bo'sh turadi:**
fayl kompyuterga tushib tekshirilgach repo'dan o'chiriladi.
Faqat `run_command` ishlayotgan bo'lsa va fayl kompyuterga tushishi kerak bo'lsa:

1. `get_upload_token` (connector `connectmymcpgithub`) ni chaqir.
2. Sandbox'da faylni repo rootiga qo'shib `git push origin main` qil.
3. Kompyuterda tayyor skriptni ishlat:
   ```bash
   ~/.uploads-pull.sh NOM [MANZIL_PAPKA]
   ```
   U klonlaydi, ko'chiradi, fayl soni va hajmini tekshiradi, mos kelsa repo'dan
   o'chirib push qiladi va vaqtinchalik papkani tozalaydi. Token
   `~/.gh-mrtoken.txt` dan `~/.gh-askpass.sh` orqali olinadi.
4. Kutilgan chiqish: `OK: <yo'l> (N fayl, M bayt). uploads repo'dan o'chirildi.`
   MR ga to'liq yo'lni ayt.

Skript kodlari: `3` repo'da nom yo'q, `4` manzilda shu nom bor (ustidan yozmaydi,
nomini o'zgartir yoki so'ra), `5` tekshiruv mos kelmadi (repo'dan o'chirmaydi).
Manzil aytilmasa `~`. Fayl 100 MB dan katta bo'lsa GitHub qabul qilmaydi: MR ga ayt.
`run_command` ishlamasa uploads'ga push qilma; faylni chatda ber.

GitHub API va git push uchun token yordamchilari (token chatga tushmaydi):
- `GIT_ASKPASS=~/.gh-askpass.sh GIT_TERMINAL_PROMPT=0 git push`
- `~/.gh-api.sh METHOD /yo'l [json]` (masalan `GET /user`, workflowlar, repolar).
  Repo o'chirish faqat MR repo nomini aytganda va nomni qayta tasdiqlatib.
- Tokenni `cat`/`echo` qilma, `set -x` ishlatma.
- Skript yozilganda cmc `rm -rf`/`git rm` so'zi bor buyruqni `hard_write` deb
  bloklaydi: MR aniq so'ragan bo'lsagina `confirmed:true` qo'y.

## 7. cmc ishlamasa: tashxis (taxmin bilan talab qilma)
1. **Bir nechta connector (yoki hammasi) javob bermasa** → hub uxlab qolgan (A).
   `web_fetch` bor bo'lsa `https://mcp-hub-cdnq.onrender.com/` ga kirib uyg'ot,
   30-60 soniya kutib qayta urin. Yo'q bo'lsa MR ga: "hub uxlab qolgan, shu
   sahifaga bir kirib chiqsang uyg'onadi".
2. **Faqat cmc javob bermasa:** `echo ok` yubor.
   - `echo ok` ham xato bersa va 10 soniyadan keyin qayta urinib ham o'tmasa →
     kompyuterda cmc ishga tushirilmagan (B). MR ga: "terminalda `cmc --start`
     qilib yuborsang, ulanib olaman". Kompyuter kerak bo'lmagan qismini davom
     ettir.
   - `echo ok` o'tsa, muammo yuborgan buyruqning o'zida: uni soddalashtir yoki
     qismlarga bo'l. MR dan hech narsa talab qilma.
3. **Buyruq 30 soniyada uzilsa:** fonda yugurt (3-bo'lim) yoki kichik qadamlarga bo'l.

Xato matnini aynan ayt (tokenni yashirib). Bajarilmagan ishni "bajardim" dema.
MR "ulab qo'ydim" desa, darhol qayta urin.

## 8. Tez-tez uchraydigan xatolar
| Belgi | Sabab | Nima qilish |
|---|---|---|
| `No such file or directory` | yo'l noto'g'ri, yashirin papka, `cwd` xato | `ls -a` bilan tekshir, to'liq yo'l ber |
| `Permission denied` | huquq yetmaydi | MR ga ayt; `sudo` faqat so'rab |
| Buyruq javobsiz osilib qoladi | 30 s timeout, interaktiv dastur | fonda yugurt, `-y` / `--yes` flag ber |
| `connector server error` | murakkab buyruq yoki hub uxlagan | soddalashtir, keyin 7-bo'lim |
| Eski yo'l topilmaydi (`~/blender`) | papka `~/.blender` ga ko'chirilgan | yangi yo'lni ishlat |
| Qayta yoqilgan serverda sahifa bo'sh | kod brauzer xotirasida edi | kodni qayta yubor (`push.py`) |

## 9. Bog'liq skill va fayllar
- Blender modeli: `blender/BlenderModelAutoWorkflowViaWebblender`, kompyuterda
  `~/.blender/SKILL.md` (bpy qoidalari) va `~/.blender/push.py`.
- Umumiy yo'nalish va connector qoidalari: `instruction.md`.
- cmc buyruq ishlamasa yoki xavfli bo'lsa: 4 va 7-bo'limlar.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- cmc = MR kompyuterida `run_command`. Har chaqiruv yangi `sh`, 30 soniya limit,
  yo'lni to'liq yoz.
- Avval ko'r, keyin qil, keyin tekshir, keyin qisqa ayt.
- O'chirish, ustidan yozish, `sudo`, `rm -rf` faqat MR aniq so'rasa va `confirmed:true`
  bilan. Tokenni hech qayerga yozma.
- Ishlamasa: `echo ok` bilan tashxis qil (hub uxlagan, `cmc --start`, yoki buyruq
  murakkab), xato matnini aynan ayt.
