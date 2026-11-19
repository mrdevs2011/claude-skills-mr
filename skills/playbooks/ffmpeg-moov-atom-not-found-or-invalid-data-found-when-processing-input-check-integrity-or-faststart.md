---
name: ffmpeg-moov-atom-not-found-or-invalid-data-found-when-processing-input-check-integrity-or-faststart
description: ffmpeg "moov atom not found" yoki "Invalid data found when processing input" — fayl bo'sh, noto'g'ri format, kesilgan (truncated) yoki moov oxirida. Avval ffprobe va header tekshir, keyin -movflags +faststart yoki qayta yuklash.
id: ffmpeg-moov-atom-not-found-or-invalid-data-found-when-processing-input-check-integrity-or-faststart
type: playbook
stack: ffmpeg 7.0.2-static (Linux sandbox)
confirmed_on: 2026-11-19
confidence: high (reproduced in sandbox + official docs)
triggers:
  - moov atom not found
  - Invalid data found when processing input
  - ffmpeg moov atom not found
  - [mov,mp4,m4a,3gp,3g2,mj2] moov atom not found
  - Error opening input: Invalid data found when processing input
  - mp4 moov atom missing truncated file
  - ffmpeg cannot open mp4 invalid data
  - moov atom not found after interrupted download or encode
  - Invalid data found when processing input empty or fake mp4
  - how to fix moov atom not found ffmpeg
related:
  - ffmpeg-ss-before-i-with-c-copy-cuts-to-nearest-keyframe-not-exact-time
  - ffmpeg-filtergraph-with-codec-copy-fails-filtering-and-streamcopy-cannot-be-used-together-reencode
---

# ffmpeg moov atom not found / Invalid data found — fayl butunligini tekshir

## TL;DR
Simptom: `ffmpeg -i file.mp4` yoki `ffprobe` "moov atom not found" va "Invalid data found when processing input" chiqaradi.
Sabab: fayl 0-bayt, noto'g'ri kontent (HTML/text .mp4 deb saqlangan), kesilgan (moov yozilmagan), yoki moov oxirida va seek qilinmaydi.
Birinchi buyruq: `ffprobe -v error -show_entries format=format_name,duration -of default=nw=1 file.mp4` va `ls -l file.mp4`
Done: ffprobe duration qaytaradi yoki siz noto'g'ri/kesilgan faylni rad etgansiz va to'g'ri manbadan qayta olgansiz.

## Qachon ishlatish / ishlatmaslik
Ishlat: video processing, download, encode jarayonida MP4/MOV ochilmaydi, aynan shu xato matni chiqsa.
Ishlatma: boshqa xatolar (codec not found, no such filter, -ss keyframe) — boshqa skilllarga qara. Yoki fayl butun va ochiladi, lekin sifat past.

## Mental model (nima uchun)
MP4/MOV "atom"lardan iborat. `mdat` — media baytlari, `moov` — indeks (vaqt, joylashuv, codec param). Moov odatda oxirida yoziladi. Agar encode/download uzilsa, moov yo'q → demuxer ocholmaydi. 0-bayt yoki noto'g'ri baytlar ham xuddi shu xatoni beradi. `-movflags +faststart` moovni boshiga ko'chiradi (ikkinchi pass), lekin yo'q moovni yaratmaydi. [SRC:http://ffmpeg.org/ffmpeg-formats.html#mov_002c-mp4_002c-ismv @ current, 2026-11] [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Fayl hajmini tekshir: `ls -l file.mp4`
   EXPECTED: hajm > 0. Agar 0 → bo'sh fayl, rad et, qayta yukla/yarat. [SANDBOX: empty.mp4 0 bayt]

2. Header tekshir (ftyp bormi): `python3 -c "print(open('file.mp4','rb').read(16).hex())"`
   EXPECTED: `00000020 66747970...` (ftypisom yoki o'xshash). Agar "not a video" yoki HTML/JSON boshlansa → noto'g'ri fayl, rad et. [SANDBOX: good.mp4 da ftyp, fake.mp4 da "not a video"]

3. ffprobe sinab ko'r: `ffprobe -v error -show_entries format=format_name,duration -of default=nw=1 file.mp4`
   EXPECTED: `format_name=mov,mp4,...` va duration raqam. Agar "moov atom not found" + "Invalid data found..." → 4-ga o't. [SANDBOX: good da duration=1.000000; empty/partial/fake da xato]

4. Agar hajm katta va ftyp bor, lekin moov yo'q: kesilgan. Qayta yuklash yoki manbadan qayta encode qilish kerak. `-movflags +faststart` ishlamaydi (moov yo'q). [SANDBOX: partial.mp4 (head -c 100) xato beradi]

5. Agar ffprobe ishlasa lekin streaming uchun kerak: `ffmpeg -i file.mp4 -c copy -movflags +faststart fixed.mp4`
   EXPECTED: "Starting second pass: moving the moov atom to the beginning" va yangi fayl ochiladi. [SANDBOX]

## Fix per cause
- **0-bayt / bo'sh:** manbadan qayta ol, `rm file.mp4` va qayta download/encode. Tekshir: `ls -l` >0 va ffprobe ishlaydi.
- **Noto'g'ri kontent (HTML, text, JSON .mp4 deb):** URL/API ni tekshir, content-type, faylni o'chir va to'g'ri video ol. Header da ftyp bo'lishi shart.
- **Kesilgan (truncated, interrupted encode/download):** qayta yukla yoki to'liq encode qil. Untrunc kabi tool kerak bo'lishi mumkin (bu sandboxda yo'q, [not verified] tashqarida). Faststart yordam bermaydi.
- **Butun fayl, lekin moov oxirida (progressive playback kerak):** `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4`. Keyin `ffprobe out.mp4` ishlashi va duration borligi.

## Where agents go wrong
1. Darhol `-movflags +faststart` ni sinaydi, lekin moov yo'q faylda ishlamaydi — avval ffprobe bilan ochilishini tekshirish kerak.
2. 0-bayt yoki noto'g'ri faylni "corrupt video" deb re-encode qilishga urinadi — vaqt yo'qotadi, natija yo'q.
3. Xato matnini o'qimay, umumiy "ffmpeg failed" deb boshqa flaglarni sinaydi (-err_detect, -fflags) — asosiy sababni o'tkazib yuboradi.
4. Sandbox va user kompyuteri farqini unutib, katta faylni base64 qilib ko'chiradi (boshqa skillga qara).

## Edge cases
1. Fragmented MP4 (`-movflags frag_keyframe+empty_moov`) — moov bo'lmasligi mumkin, lekin fragmentlar bilan ochiladi. `ffprobe` ishlashi kerak.
2. Pipe orqali (`pipe:0`) — seek qilinmaydi, moov oxirida bo'lsa ochilmaydi. Faylga yozib, keyin ishlat.
3. Boshqa konteyner (mkv, webm) — bu xato odatda MP4/MOV uchun. `ffprobe` format_name ni ko'rsatadi.

## Done criteria
- `ffprobe -v error -show_entries format=duration -of default=nw=1 file.mp4` duration raqam qaytaradi (xato yo'q).
- Yoki siz noto'g'ri/kesilgan faylni aniq rad etdingiz va yangi to'g'ri fayl bilan ishlayapsiz (`ls -l` hajm mantiqiy, header ftyp).
- Fixed fayl uchun: `ffmpeg -i fixed.mp4 -f null - 2>&1 | head -5` xato bermaydi.

## If still failing
- Manba faylni qayta yukla/yarat (download uzilgan yoki encode SIGKILL bo'lgan).
- `ffmpeg -v verbose -i file.mp4 -f null -` to'liq logni o'qi (boshqa xato bo'lishi mumkin).
- Boshqa skill: agar filter yoki -c copy bilan bog'liq bo'lsa, related skilllarga qara.
- Untrunc yoki professional repair kerak bo'lsa (bu yerda yo'q), foydalanuvchiga ayt.

## Sources + confidence
- [SANDBOX] empty.mp4, fake.mp4, partial.mp4 (head -c 100 good.mp4), good.mp4 da real xato va muvaffaqiyatli faststart.
- [SRC:http://ffmpeg.org/ffmpeg-formats.html#mov_002c-mp4_002c-ismv] movflags faststart: second pass moves moov to beginning.
- Confidence: high — aniq xato matnlari sandboxda qayta ishlab chiqarildi, official docs tasdiqlaydi. Kesilgan faylni to'liq tiklash untrunc bilan [not verified] bu muhitda.
