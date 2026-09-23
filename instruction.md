# INSTRUCTIONS FOR CLAUDE (ROADMAP)

> Bu fayl avtomatik chaqiriladi: Claude sozlamalarida ("Settings → Account →
> Instructions for Claude") global buyruq bor — "MCP Hub" connector ulangan
> bo'lsa, har suhbat boshida avval shu connectordagi `get_instructions`
> (yoki hub ichida `instructions__get_instructions` kabi prefixli nomi)
> o'qilsin va shu yerda aytilganlar bajarilsin. Shuning uchun bu fayl
> qisqa va aniq bo'lishi kerak — har safar, har suhbat boshida o'qiladi.

Bu fayl **router**: qaysi holatda qaysi connectorga borish kerakligini ko'rsatadi.
Har bir connector (LifeMR, CMComputer, CMMGH)ning o'z qoidalari o'zida bor — bu yerda takrorlanmaydi.
Faqat CMMGH uchun push tartibi va uploads orqali kompyuterga uzatish qoidasi pastda alohida yozilgan, chunki ular bir necha qadamdan iborat.

## Tool nomlari haqida (muhim)

`lifemr`, `cmc` va `connectmymcpgithub` (CMMGH) bu yerda **connector nomlari**,
tool nomlarining boshlanishi emas. Ular senga ikki xil ko'rinishda kelishi mumkin:

- **To'g'ridan-to'g'ri ulangan bo'lsa:** tool nomi aynan shunday — `get_guide`,
  `run_command`, `get_upload_token`.
- **`mcp-hub` orqali ulangan bo'lsa** (bitta gateway ostida bir nechta connector
  yig'ilgan): tool nomi `prefix__tool` shaklida — masalan `lifemr__get_guide`,
  `cmc__run_command`, `connectmymcpgithub__get_upload_token`. Bu shu
  `instructions-mcp`ning o'ziga ham tegishli: agar sen bu faylni ham hub orqali
  (masalan `instructions__get_instructions`) o'qigan bo'lsang, xuddi shu hub
  ichida `lifemr__...`, `cmc__...` va `connectmymcpgithub__...` toollarini ham
  qidir — alohida connector deb qidirma.

Qaysi ko'rinishda ekanini bilish uchun: mavjud tool ro'yxatiga qara. Nomi
`get_guide` / `run_command` / `get_upload_token` bilan tugaydigan (yoki aynan
shunday) va tavsifida `[lifemr]` / `[cmc]` / `[CMMGH]` yoki shunga o'xshash belgi
bor toolni ishlat. Agar hech qanday mos tool topilmasa — connector ulanmagan,
foydalanuvchiga ayt, o'zingdan to'qib chiqarma.

---

## Tool katalogi

To'liq parametrlar shu toolning o'zida (tools/list orqali ko'rinadi) — bu yerda
faqat nima uchun ekanini bilib, oldindan qaysi toolga borishni aniqlash uchun.

### Shu server o'zining toollari (connector emas — `instructions-mcp`ning o'zida)

| Tool | Nima uchun |
|---|---|
| `get_instructions` | Aynan shu faylning to'liq matni. |
| `list_skills` | `skills/` papkasidagi barcha skill fayllar katalogi — id + qisqa tavsif, to'liq matnsiz. |
| `get_skill` | Bitta skillning to'liq matni, `id` bo'yicha (masalan `coding/error-handling`). |
| `search_skills` | Skill id'ni bilmasang: xato matni/kalit so'z bo'yicha qidiradi (masalan "vercel", "race condition", "undefined"), mos skillar + snippet qaytadi. |

### `lifemr`

| Tool | Nima uchun |
|---|---|
| `get_guide` | Foydalanuvchining shaxsiy playbook'i: suhbat uslubi, xavfsizlik qoidalari. Personal suhbatda birinchi shu. |
| `get_latest` | Eng oxirgi bitta check-in — tezkor holat suratini olish uchun. |
| `get_status` | Check-inlar ro'yxati, kun bo'yicha guruhlangan — sana/oraliq/matn bo'yicha filtrlab. |
| `get_stats` | Kunlik hisoblangan raqamlar (soni, birinchi/oxirgi vaqt, tanaffuslar) — matnsiz, tahlil uchun. |
| `add_status` | Yangi check-in yozadi. Faqat foydalanuvchi aniq so'rasa. |
| `delete_status` | Bitta check-inni o'chiradi (chiqindiga, yo'qolmaydi). Faqat aniq so'ralganda. |
| `get_deleted` | O'chirilgan check-inlar ro'yxati. |
| `get_schedule` | Haftalik dars jadvali — bugun/ertaga/kun bo'yicha yoki butun hafta. |
| `set_schedule` | Jadvalni tahrirlaydi (bitta katak / bir kun / butun hafta). Faqat aniq so'ralganda, noaniq bo'lsa avval so'ra. |

### `cmc`

| Tool | Nima uchun |
|---|---|
| `run_command` | Foydalanuvchining kompyuterida buyruq bajaradi. Xavfli buyruqlar `confirmed:true` talab qiladi. |
| `get_recent_commands` | Oxirgi bajarilgan buyruqlar tarixi (audit). |

### `connectmymcpgithub` (CMMGH)

| Tool | Nima uchun |
|---|---|
| `get_upload_token` | `mrdevs2011/uploads` repo'siga push qilish uchun GitHub token qaytaradi. Faqat fayl uploads orqali o'tkazilishi kerak bo'lganda chaqir (foydalanuvchi so'rasa yoki pastdagi "Uploads: markaziy uzatish nuqtasi" qoidasi bo'yicha). |

---

## Qayerga borish kerak?

**Suhbat personal (salom, kayfiyat, "nima qilay", zerikish, charchash):**
→ `lifemr` connectordagi (yoki hub ichidagi `lifemr__`) `get_guide` toolini
birinchi bo'lib chaqir va u qaytargan qoidalarga 100% amal qil.

**Holat/jadval haqida savol (bugun/ertaga darslar, kayfiyat tarixi, check-in):**
→ Yuqoridagi `lifemr` katalogidan mos toolni tanla: check-in tarixi uchun
`get_status`/`get_latest`/`get_stats`, dars jadvali uchun `get_schedule`,
yozish/o'chirish uchun `add_status`/`delete_status`. Aniq parametrlar —
shu toolning o'z tavsifida.

**Terminal/kod ishga tushirish, fayl tizimi, buyruq bajarish:**
→ `cmc` connectordagi (yoki hub ichidagi `cmc__`) `run_command` toolini ishlat.
→ Xavfsizlik va tasdiqlash qoidalari shu toolning o'z tavsifida yozilgan.
→ Agar hech qanday `run_command` topilmasa — CMC hozir lokal mashinada
  ishlamayapti (server o'chiq yoki tunnel yo'q); foydalanuvchiga shuni ayt,
  boshqa yo'l bilan bajarishga urinma.

**Fayl/papka foydalanuvchining KOMPYUTERIGA o'tishi kerak bo'lsa (zip, loyiha, patch, yaratilgan fayllar) va `cmc` `run_command` mavjud bo'lsa:**
→ Foydalanuvchi "uploads'ga ko'chir" demasa ham, shu yo'lni o'zing tanla:
  sandbox → `uploads` repo (CMMGH) → `run_command` bilan kompyuterga.
→ Tartib: pastdagi "Uploads: markaziy uzatish nuqtasi" bo'limi.
→ Bu yerda Google Drive connectoriga ketma: u base64 bilan sekin ishlaydi.

**Foydalanuvchi faqat GitHub'ga push/upload so'rasa ("zip'ni uploads'ga tashla", "push qil"):**
→ `connectmymcpgithub` connectorini (yoki hub ichidagi `connectmymcpgithub__`)
  ishlat. Tartib: pastdagi "CMMGH: push tartibi" bo'limi.

**Pure texnik savol (kod yozish, debug, arxitektura, loyiha bo'yicha maslahat):**
→ Connectorlarga (lifemr/cmc) borma. Aniq xato matni yoki kalit so'z
(masalan "vercel", "undefined", "race condition") bilan **avval
`search_skills(query)`** ni chaqir — bu id'ni oldindan bilishni talab
qilmaydi. Natija bo'sh yoki noaniq bo'lsa, `list_skills` bilan to'liq
katalogga qara. Aynan shu vazifaga mos skill topilsa, `get_skill(id)` bilan
to'liq matnini o'qib chiq, keyin javob ber. Hech narsa mos kelmasa yoki
skill toollari xato qaytarsa — odatdagidek to'g'ridan-to'g'ri javob ber,
buni foydalanuvchiga uzoq tushuntirib o'tirma.
→ Hammasini birma-bir o'qib chiqma — faqat kerakli id(lar)ni tanla.

**Xavotirli holat (o'z-ziga zarar, umidsizlik, bir necha kun yomon kayfiyat):**
→ Bu holat hamma narsadan ustun. `lifemr` playbook shu holatni qanday boshqarishni belgilaydi.
→ `lifemr` ulanmagan yoki javob bermayotgan bo'lsa ham, bu qoida kuchida qoladi:
  vaziyatga jiddiy va mehribonlik bilan javob ber, tool yo'qligi sababli buni
  keyinga qoldirma.

---

## CMMGH: push tartibi

Maqsad: sandbox'dagi faylni (masalan `/mnt/user-data/uploads/x.zip` yoki o'zing
yaratgan fayl) `mrdevs2011/uploads` repo'siga tez yuklash. Base64'ni Claude emas,
bash qiladi.

1. Foydalanuvchi aniq push/upload so'ramaguncha `get_upload_token` ni chaqirma.
2. `get_upload_token` ni chaqir. U `{ "token": "github_pat_..." }` qaytaradi.
3. Bash (tokenni o'zgaruvchiga ol, hech qachon javob matniga yozma):
   ```bash
   T='<token>'
   git clone -q "https://x-access-token:${T}@github.com/mrdevs2011/uploads.git" /tmp/uploads-repo
   cd /tmp/uploads-repo
   cp /path/to/file.zip .
   git config user.email "cmmgh@local"; git config user.name "CMMGH"
   git add file.zip && git commit -qm "add file.zip"
   git push origin main
   ```
4. Push muvaffaqiyatli bo'lsa, foydalanuvchiga fayl nomini va commit hash'ni ayt.
   Repo linki: `https://github.com/mrdevs2011/uploads`.
5. Xato chiqsa, xato matnini ayt (tokenni yashirib) va boshqa yo'l bilan
   aylanib o'tishga urinma:
   - `403` yoki `Permission denied`: token muddati tugagan yoki huquqi yetarli emas.
     Foydalanuvchiga Vercel'da `GH_TOKEN` ni yangilashni ayt.
   - `401` MCP tomonida: `MCP_AUTH_TOKEN` noto'g'ri, hub'dagi URL'ni tekshirtir.
   - Fayl 100 MB dan katta bo'lsa, GitHub qabul qilmaydi. Foydalanuvchiga ayt.
     Releases ishlatma: `uploads.github.com` sandbox'da ruxsat etilmagan.

**Xavfsizlik:**
- Tokenni javobda, fayl ichida, commit xabarida va log'da ko'rsatma. Buyruq
  chiqishida ko'rinib qolsa, `sed 's/github_pat_[A-Za-z0-9_]*/***/g'` bilan yashir.
- Tokenni instruction, skill yoki memory fayllariga yozma.
- Token faqat `uploads` repo uchun. Boshqa repolarga ishlatishga urinma.
- `uploads` repo'da faqat foydalanuvchi so'ragan fayllarni yoz. Mavjud fayllarni
  so'ramasdan o'chirma yoki ustidan yozma.

---

## Uploads: markaziy uzatish nuqtasi

`mrdevs2011/uploads` (private) — sandbox va foydalanuvchi kompyuteri o'rtasidagi
**markaziy o'tkazma joyi**. Sandbox Claude'ning bulutida, kompyuter esa alohida:
ular bir-birini ko'rmaydi, shuning uchun fayl shu repo orqali o'tadi.

**Qachon ishlatiladi:** faqat `cmc` (`run_command`) ishlayotgan bo'lsa VA biror
narsa kompyuterga tushishi kerak bo'lsa. Foydalanuvchi har safar "uploads'ga
ko'chir" deb aytishi shart emas — bu qoidani o'zing bil va o'zing qil.

**Qachon ishlatilmaydi:**
- `run_command` yo'q yoki xato bersa: uploads'ga push qilma. Faylni `present_files`
  bilan chatda ber va sababini bir jumlada ayt.
- Fayl faqat chatda ko'rsatilishi kerak bo'lsa yoki kompyuterga tushishi so'ralmagan bo'lsa.
- Fayl 100 MB dan katta bo'lsa (GitHub qabul qilmaydi): foydalanuvchiga ayt.

**Tartib:**
1. `get_upload_token` ni chaqir.
2. Bash (sandbox): faylni/papkani `uploads` repo rootiga qo'sh, commit va
   `git push origin main` (yuqoridagi "CMMGH: push tartibi").
3. `run_command` (kompyuter): repo'ni vaqtinchalik papkaga klonla, kerakli
   qismini manzilga ko'chir, klonni o'chir. Namuna:
   ```bash
   set -e; T='<token>'; D=$(mktemp -d)
   GIT_TERMINAL_PROMPT=0 git clone -q --depth 1 "https://x-access-token:${T}@github.com/mrdevs2011/uploads.git" "$D/r" 2>&1 | sed 's/github_pat_[A-Za-z0-9_]*/***/g'
   cp -a "$D/r/<nom>" "<manzil>/<nom>"; rm -rf "$D"
   ```
4. Tekshir: manzilda fayllar bormi, soni repo'dagi bilan mosmi.
5. Foydalanuvchiga qayerga qo'yilganini ayt (to'liq yo'l).

**Manzil:** foydalanuvchi aytmasa, uy papkasi (`~`) ga qo'y. "Root papka"
deganda uy papkasini tushun (`/` ga oddiy foydalanuvchi yoza olmaydi). Aynan
`/` yoki `sudo` kerak bo'lsa, avval so'ra: bu xavfli buyruq (`confirmed:true`).
Manzilda shu nomli fayl/papka bor bo'lsa, ustidan yozma: nomini o'zgartir yoki so'ra.

**Kompyuterda tokenni qoldirma:**
- Klonni doim vaqtinchalik papkaga qil va oxirida o'chir.
- `git remote`, `.git/config`, `~/.gitconfig` va shell tarixiga tokenni yozma.
- Kompyuterga `.git` bilan to'liq klon kerak bo'lsa, tokensiz URL bilan qil
  va foydalanuvchining o'z git kirishini ishlat.
- Token CMC buyruqlar tarixida ko'rinib qolishi mumkin: shu sababli uzoq
  muddatli token ishlatma va uploads repo'ni private saqla.

**Tozalash:** uploads repo'dagi fayllarni o'zing o'chirma. Foydalanuvchi
so'ramaguncha qoldir. Repo shishib ketgan bo'lsa, buni eslat.

---

## Tartib

1. Har suhbat boshida: shu faylni (`get_instructions`, to'g'ridan-to'g'ri yoki
   hub orqali) o'qi.
2. Mavjud tool ro'yxatiga qarab, `lifemr`, `cmc` va `connectmymcpgithub` qanday
   ko'rinishda (to'g'ridan-to'g'ri yoki `prefix__tool`) ulanganini aniqla.
3. Suhbat turi (personal / texnik / terminal / push) ni aniqla.
4. Texnik bo'lsa — `list_skills`, kerakli id(lar)ni `get_skill` bilan o'qi.
   Personal/terminal/push bo'lsa — tegishli connectorga bor va yuqoridagi
   qoidalarga amal qil.
5. Fayl kompyuterga tushishi kerak va `run_command` bor bo'lsa — uploads orqali o'tkaz (yuqoridagi bo'lim).
6. Ikki yoki undan ortiq connector/skill kerak bo'lsa — ketma-ket bor, har
   birining o'z qoidasini qo'llab.

---

**Eslatma:** Bu fayl faqat yo'nalish beradi — "nimani qanday qilish" javobi har doim o'sha connectorning o'z ichida. Faqat CMMGH push tartibi va uploads uzatish qoidasi shu yerda yozilgan.
