---
id: ffmpeg-libx264-height-or-width-not-divisible-by-2-yuv420p-even-dimensions
type: playbook
stack: ffmpeg 7.0.2-static + libx264 (yuv420p)
confirmed_on: 2026-11-19
confidence: high (sandbox repro + chroma 4:2:0 reason)
triggers:
  - height not divisible by 2
  - width not divisible by 2
  - [libx264 @ ] height not divisible by 2
  - Error while opening encoder - maybe incorrect parameters such as bit_rate, rate, width or height
  - yuv420p odd height or width
  - scale to odd dimensions fails libx264
  - ffmpeg Invalid argument after scale or crop
  - height must be even for h.264 yuv420p
  - 100x101 height not divisible
  - libx264 refuses non-even size
related:
  - ffmpeg-ss-before-i-with-c-copy-cuts-to-nearest-keyframe-not-exact-time.md
  - ffmpeg-filtergraph-with-codec-copy-fails-filtering-and-streamcopy-cannot-be-used-together-reencode.md
---

# libx264 yuv420p da height/width juft bo'lishi shart — odd dimension xatosi

## TL;DR
Simptom: ffmpeg `libx264` bilan encode qilganda `[libx264] height not divisible by 2 (WxH)` yoki width, keyin "Error while opening encoder", "Invalid argument", hech narsa yozilmaydi.
Sabab: yuv420p (4:2:0) chroma 2x2 bloklarda, shuning uchun width va height juft bo'lishi kerak.
Birinchi buyruq: `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,pix_fmt -of csv=p=0 input` yoki scale filter qo'sh `scale=trunc(iw/2)*2:trunc(ih/2)*2`.
Done: buyruq muvaffaqiyatli, output.mp4 yaratildi, `ffprobe` da width/height juft.

## Qachon ishlatish / ishlatmaslik
Ishlat: libx264 + `-pix_fmt yuv420p` (yoki default), scale/crop/pad dan keyin odd width yoki height chiqsa, yoki source odd bo'lsa.
Ishlatma: yuv444p, yuv422p (height odd bo'lishi mumkin), yoki boshqa encoder (masalan libvpx-vp9 ba'zi formatlarda), yoki allaqachon juft dimension.

## Mental model (nima uchun)
[SANDBOX] yuv420p da chroma U/V luma'ning yarmi (2x2 blok). Odd o'lchamda yarim piksel qoladi, libx264 rad etadi. H.264 compatibility uchun yuv420p standart. [SRC:https://stackoverflow.com/questions/20847674/ffmpeg-libx264-height-not-divisible-by-2 2013-2023, chroma subsampling] [SRC:https://ffmpeg-cookbook.com/en/articles/fix-height-not-divisible-by-2/ 2026] 

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: "height not divisible by 2" yoki "width not divisible by 2" + o'lcham (masalan 100x101). EXPECTED: shu matn. Agar boshqa xato — boshqa skill.
   [SANDBOX] `ffmpeg -y -f lavfi -i color=c=red:s=100x100:d=1 -vf scale=100:101 -c:v libx264 -pix_fmt yuv420p /tmp/odd.mp4` → `[libx264] height not divisible by 2 (100x101)` va Conversion failed!

2. O'lchamni tekshir: `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 file` yoki filter oxirida. EXPECTED: odd son. Agar juft — boshqa sabab (codec copy, filter).

3. pix_fmt ni tekshir: `-pix_fmt yuv420p` yoki default. yuv444p bo'lsa odd mumkin.

4. Scale/crop ifodasini tekshir: `scale=100:101` yoki `scale=-1:720` ( -1 odd berishi mumkin). -2 juft qiladi.

## Fix per cause (copy-paste + re-check)
- Scale da juft qilish (eng keng tarqalgan):
  ```bash
  ffmpeg -y -i input.mp4 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p output.mp4
  ```
  Yoki aspect saqlash: `scale=-2:720` (-2 = juftga yumaloq).

- Yo'qotmaslik uchun pad:
  ```bash
  ffmpeg -y -i input.mp4 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" -c:v libx264 -pix_fmt yuv420p output.mp4
  ```

- Crop bilan:
  ```bash
  ffmpeg -y -i input.mp4 -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p output.mp4
  ```

- Agar aniq odd o'lcham kerak va player qabul qilsa: `-pix_fmt yuv444p` (lekin ko'pchilik playerda ishlamaydi).

Re-check: buyruqni qayta ishga tushir, `ls -l output.mp4` va `ffprobe ... width,height` juft ekanini tasdiqla.

[SANDBOX] To'g'ri: `ffmpeg -y -f lavfi -i color=c=red:s=100x100:d=1 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p /tmp/even.mp4` → muvaffaqiyat, fayl yaratildi.

## Where agents go wrong (>=3)
- Scale=100:101 yoki -1 ishlatib, keyin xato chiqsa "codec muammosi" deb o'ylab qayta encode qilish.
- `-c copy` bilan scale ishlatish (boshqa xato), yoki pix_fmt ni o'zgartirmasdan.
- Pad/crop o'rniga faqat o'lchamni hardcode qilib, aspect buzish.
- yuv444p ga o'tib, keyin playerda ishlamasligini tekshirmaslik.

## Edge cases (>=2)
- Source allaqachon odd: scale/pad/crop qo'shish kerak, copy ishlamaydi.
- Filter zanjirida oxirgi scale odd chiqarishi: zanjir oxiriga trunc yoki -2 qo'sh.
- Hardware encoder (nvenc) ham yuv420p da xuddi shunday talab qiladi.

## Done criteria (proving commands)
```bash
ffmpeg -y ... -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ... output.mp4 && \
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 output.mp4
```
EXPECTED: juft,juft (masalan 100,100), exit 0, fayl mavjud.

## If still failing
- To'liq ffmpeg stderr ni o'qi (truncated emas).
- `ffmpeg -h encoder=libx264` Supported pixel formats tekshir.
- Boshqa encoder yoki pix_fmt sinab ko'r.
- search_skills("ffmpeg") boshqa playbooklar.

## Sources + confidence
[SANDBOX] Repro va fix 2026-11-19, ffmpeg 7.0.2-static. [SRC:https://stackoverflow.com/questions/20847674/ffmpeg-libx264-height-not-divisible-by-2 ] [SRC:https://ffmpeg-cookbook.com/en/articles/fix-height-not-divisible-by-2/ ] Confidence high: measured + documented reason.
