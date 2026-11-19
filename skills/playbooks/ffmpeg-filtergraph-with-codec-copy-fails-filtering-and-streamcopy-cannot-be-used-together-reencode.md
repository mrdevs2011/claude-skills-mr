---
name: ffmpeg-filtergraph-with-codec-copy-fails-filtering-and-streamcopy-cannot-be-used-together-reencode
description: ffmpeg -vf/-af/-filter_complex with -c copy (or -c:v copy) fails: "Filtergraph 'X' was specified, but codec copy was selected. Filtering and streamcopy cannot be used together." Filters need decode+encode; reencode the filtered stream, copy others. Triggers on exact error, "cannot be used together", hflip/scale with copy.
id: ffmpeg-filtergraph-with-codec-copy-fails-filtering-and-streamcopy-cannot-be-used-together-reencode
type: playbook
stack: ffmpeg 7.0.2-static (libavfilter)
confirmed_on: 2026-11-19
confidence: high (reproduced in sandbox + official docs)
triggers:
  - Filtergraph 'hflip' was specified, but codec copy was selected. Filtering and streamcopy cannot be used together
  - Filtering and streamcopy cannot be used together
  - Streamcopy requested for output stream which is fed from a complex filtergraph
  - ffmpeg -vf scale -c copy fails
  - cannot use filter with -c copy
  - Filtergraph was specified but codec copy selected
  - ffmpeg hflip or scale with stream copy error
  - filtering and streamcopy cannot be used
  - -filter_complex with -c copy error
  - ffmpeg filter requires reencode not copy
related:
  - playbooks/ffmpeg-ss-before-i-with-c-copy-cuts-to-nearest-keyframe-not-exact-time.md
  - playbooks/ffmpeg-no-such-filter-parsing-error-unescaped-comma-special-chars-in-filter-params.md
  - playbooks/ffmpeg-filter-complex-loop-1-image-overlay-runs-forever-use-shortest-1.md
---

# ffmpeg filtergraph + -c copy xato: Filtering and streamcopy cannot be used together — reencode qil

## TL;DR
Simptom: `ffmpeg -i in.mp4 -vf hflip -c copy out.mp4` (yoki -af, -filter_complex) "Filtergraph 'hflip' was specified, but codec copy was selected. Filtering and streamcopy cannot be used together." yoki "Error opening output files: Function not implemented / Invalid argument".
Sabab: filterlar decoded raw frame'larda ishlaydi; -c copy decoding/encoding o'tkazib yuboradi (faqat demux/mux).
Birinchi buyruq: `ffmpeg -i in.mp4 -vf hflip -c:v libx264 -pix_fmt yuv420p -c:a copy out.mp4` (video filter uchun).
Done: fayl yoziladi, exit 0, o'lcham >0, ffprobe yoki ls bilan tekshirildi.

## Qachon ishlatish / ishlatmaslik
Ishlat: -vf/-af/-filter/-filter_complex bilan -c copy / -c:v copy / -vcodec copy ishlatilganda xato chiqsa; scale, crop, hflip, overlay, drawtext, volume va h.k. bilan lossless copy urinish.
Ishlatma: oddiy container o'zgartirish yoki metadata (haqiqiy -c copy mumkin); yoki filter yo'q, faqat -ss -c copy (boshqa skill).

## Mental model (nima uchun)
[SANDBOX] Filterlar libavfilter orqali raw (decoded) audio/video frame'larni o'zgartiradi. Streamcopy (-c copy) faqat encoded packet'larni demuxer'dan muxer'ga ko'chiradi, decode/encode yo'q — shuning uchun filter qo'llab bo'lmaydi. [SRC:https://ffmpeg.org/ffmpeg.html#Filtering @docs, stream copy section; filters work on uncompressed data] Bitta stream'ni filter + copy qilib bo'lmaydi; boshqa stream'larni (masalan audio) copy qilish mumkin.

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: `ffmpeg ... 2>&1 | grep -E 'Filtergraph|streamcopy|cannot be used'`  
   EXPECTED: "Filtergraph '...' was specified, but codec copy was selected. Filtering and streamcopy cannot be used together." yoki "Streamcopy requested for output stream ... fed from a complex filtergraph". Agar bu bor — 2-qadam. Agar boshqa xato (No such filter) — boshqa skill.

2. Buyruqda filter va copy birga ekanini tekshir: `echo "$CMD" | grep -E '(-vf|-af|-filter|-filter_complex).*(-c copy|-c:v copy|-vcodec copy)'`  
   EXPECTED: ikkalasi ham bor. Agar filter yo'q — bu skill emas.

3. Qaysi stream filterlanayotganini aniqlа: video (-vf) yoki audio (-af) yoki complex.  
   EXPECTED: odatda video. Audio uchun ham xuddi shunday.

4. Reencode bilan sinab ko'r (qadam 5).  
   EXPECTED: exit 0, fayl yaratiladi.

## Fix per cause
- Video filter + -c copy: video'ni reencode qil, audio'ni copy.  
  ```bash
  ffmpeg -i input.mp4 -vf hflip -c:v libx264 -pix_fmt yuv420p -c:a copy output.mp4
  ```
  (yoki scale=1280:720, crop va h.k.)

- Audio filter + -c copy: audio'ni reencode, video'ni copy.  
  ```bash
  ffmpeg -i input.mp4 -af volume=2 -c:v copy -c:a aac output.mp4
  ```

- Complex filtergraph: map bilan aniq, filtered stream'ni encode, qolganini copy.  
  ```bash
  ffmpeg -i input.mp4 -filter_complex "[0:v]scale=iw/2:-1[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy output.mp4
  ```

- Hech qanday filter kerak emas, faqat copy: filter'ni olib tashla, -c copy qoldir.

Copy-paste (sandbox'da ishlagan):  
```bash
ffmpeg -f lavfi -i color=c=red:s=320x240:d=1 -vf hflip -c:v libx264 -pix_fmt yuv420p /tmp/right.mp4
# exit 0, fayl 2325 bayt
```

## Where agents go wrong (>=3)
1. "Lossless kerak" deb -c copy ni qoldirib, filter qo'shadi — xato chiqadi, keyin filter'ni olib tashlaydi (noto'g'ri).
2. Faqat -c:v libx264 qo'shadi, lekin -pix_fmt yuv420p ni unutadi — ba'zi player'larda muammo.
3. Complex da -map ni noto'g'ri qo'yib, copy ni filterlangan stream'ga qo'llaydi.
4. Xato "Function not implemented" ni codec yo'q deb o'ylaydi, aslida streamcopy + filter.

## Edge cases (>=2)
1. Faqat audio stream filterlanadi, video copy: -af + -c:v copy -c:a aac ishlaydi.
2. Bir nechta output: ba'zi output'larda copy, ba'zilarida encode — map va -c:v:0 copy -c:v:1 libx264 bilan aniq belgilash kerak.
3. -filter_complex script yoki uzun graph: xuddi shu qoida, filtered pad'ni encode qil.

## Done criteria (proving commands)
- `ls -l output.mp4` — fayl mavjud, size > 0.
- `ffprobe -v error -show_entries format=duration output.mp4` — duration bor (yoki exit 0).
- Qayta xato buyrug'i ishlamaydi, to'g'ri buyruq ishlaydi.
- [SANDBOX] Mutatsiya: -c:v libx264 ni -c copy ga qaytarsang, yana xuddi shu xato chiqadi.

## If still failing
- Codec yo'q (libx264): `ffmpeg -encoders | grep 264` tekshir, yoki libx265 / mpeg4 ishlat.
- Input format: `ffprobe input.mp4` bilan stream'larni ko'r.
- Complex map xato: -map ni soddalashtir, birinchi oddiy -vf bilan sinab ko'r.
- Juda katta fayl: -t 5 bilan qisqa test.

## Sources + confidence
[SANDBOX] Wrong: lavfi color + -vf hflip -c copy → "Filtergraph 'hflip' was specified, but codec copy was selected. Filtering and streamcopy cannot be used together. Error opening output files: Function not implemented". Right: -c:v libx264 -pix_fmt yuv420p → exit 0, 2325 byte mp4.  
[SRC:https://stackoverflow.com/questions/53518589/how-to-use-filtering-and-stream-copy-together-with-ffmpeg @2018, explains decode needed]  
[SRC:https://ffmpeg.org/ffmpeg.html#Stream-copy @docs: stream copy omits decoding/encoding, filters impossible on same stream]  
Confidence: high (sandbox repro + docs).
