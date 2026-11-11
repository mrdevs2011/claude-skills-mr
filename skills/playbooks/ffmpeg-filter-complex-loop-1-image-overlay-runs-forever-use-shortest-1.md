---
name: ffmpeg-filter-complex-loop-1-image-overlay-runs-forever-use-shortest-1
description: ffmpeg filter_complex with -loop 1 image + overlay never terminates (no error, keeps writing frames). Use overlay=shortest=1 or output -t. Triggers on "ffmpeg never stops", "ffmpeg hangs on overlay image", infinite encode.
id: ffmpeg-filter-complex-loop-1-image-overlay-runs-forever-use-shortest-1
type: playbook
stack: ffmpeg 7.0+ (libavfilter overlay)
confirmed_on: 2026-11-11
confidence: high (reproduced in sandbox + official docs)
triggers:
  - ffmpeg never stops overlay image
  - ffmpeg hangs filter_complex -loop 1
  - ffmpeg -shortest not working with image overlay
  - overlay image loop runs forever
  - ffmpeg producing frames beyond video length no error
  - ffmpeg filter_complex infinite encode image
  - "frame=" keeps increasing forever ffmpeg
  - ffmpeg -loop 1 -i png overlay no exit
  - shortest=1 overlay fix
  - ffmpeg image overlay never terminates
related:
  - playbooks/ffmpeg-ss-before-i-with-c-copy-cuts-to-nearest-keyframe-not-exact-time.md
---

# ffmpeg filter_complex + -loop 1 rasm overlay abadiy ishlaydi — shortest=1 ishlat

## TL;DR
Simptom: `ffmpeg -i video.mp4 -loop 1 -i logo.png -filter_complex "[0:v][1:v]overlay[out]" -map "[out]" out.mp4` hech qachon tugamaydi, frame soni video uzunligidan oshadi, xato yo'q.
Sabab: -loop 1 cheksiz manba, overlay default shortest=0 va eof_action=repeat, asosiy stream tugasa ham davom etadi. -shortest faqat boshqa finite stream (audio) map qilinganda ishlaydi.
Birinchi buyruq: `ffmpeg -i base.mp4 -loop 1 -i ov.png -filter_complex "[0:v][1:v]overlay=10:10:shortest=1[out]" -map "[out]" -c:v libx264 right.mp4`
Done: ffprobe duration == video duration, process normal exit (exit 0).

## Qachon ishlatish / ishlatmaslik
Ishlat: video ustiga logo/rasm/text overlay qilayotganda -loop 1 ishlatsang va process hech tugamasa yoki output video uzunligi kutilganidan katta bo'lsa.
Ishlatma: oddiy -c copy kesish, yoki loop ishlatmasang, yoki -t bilan aniq vaqt belgilasang. Yoki lavfi color/testsrc cheksiz manbalar (xuddi shu muammo).

## Mental model (nima uchun)
[SRC:https://ffmpeg.org/ffmpeg-filters.html#overlay-1 @ 7.0 docs, 2026-11] overlay filter: `shortest` (default 0) — 1 bo'lsa eng qisqa input tugasa outputni tugatadi. -loop 1 rasmni cheksiz qiladi (duration=N/A). Asosiy video EOF bo'lganda filter davom etadi, chunki ikkinchi input hali "bor". Output -shortest faqat muxer darajasida, agar map qilingan barcha streamlar finite bo'lsa ishlaydi; video-only + cheksiz rasmda ishlamaydi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Processni timeout bilan ishga tushir va frame/time ni kuzat:
   ```bash
   timeout 3 ffmpeg -y -i base.mp4 -loop 1 -i ov.png -filter_complex "[0:v][1:v]overlay=10:10[out]" -map "[out]" -c:v libx264 /tmp/hang.mp4
   ```
   EXPECTED: timeout (signal 15/9), time=00:00:xx dan katta (video 3s bo'lsa 10s+). Agar darhol exit 0 va duration to'g'ri → boshqa muammo. [SANDBOX]

2. ffprobe bilan output duration tekshir (agar yaratilgan bo'lsa):
   ```bash
   ffprobe -v error -show_entries format=duration -of default=nw=1 /tmp/hang.mp4
   ```
   EXPECTED: duration video dan katta yoki N/A. Agar teng → boshqa.

3. -shortest qo'shib sinab ko'r (video-only da ishlamasligi mumkin):
   ```bash
   ffmpeg -y -i base.mp4 -loop 1 -i ov.png -filter_complex "[0:v][1:v]overlay[out]" -map "[out]" -shortest -c:v libx264 /tmp/test.mp4
   ```
   EXPECTED: baribir hang yoki noto'g'ri duration. Agar to'xtasa → audio map qilingan bo'lishi mumkin.

4. Input larni tekshir: `ffprobe -v error -show_entries format=duration base.mp4` (finite), rasm uchun duration yo'q.

## Fix har bir sabab uchun
Sabab 1: overlay da shortest=0 default + cheksiz -loop 1.
Fix: overlay ga shortest=1 qo'sh.
```bash
ffmpeg -y -i base.mp4 -loop 1 -i ov.png \
  -filter_complex "[0:v][1:v]overlay=10:10:shortest=1[out]" \
  -map "[out]" -c:v libx264 -pix_fmt yuv420p right.mp4
```
Tekshir: `ffprobe -v error -show_entries format=duration -of default=nw=1 right.mp4` → duration=3.000000 (yoki video duration). Process exit 0. [SANDBOX]

Sabab 2: aniq uzunlik kerak bo'lsa.
Fix: output ga -t video_duration.
```bash
ffmpeg -y -i base.mp4 -loop 1 -i ov.png \
  -filter_complex "[0:v][1:v]overlay=10:10[out]" \
  -map "[out]" -c:v libx264 -t 3 right.mp4
```
Yoki input tomonda: `-loop 1 -t 3 -i ov.png`.

Sabab 3: bir nechta overlay.
Har biriga shortest=1 qo'sh.

## Agentlar qayerda xato qiladi
1. Faqat -shortest qo'shadi, video-only da ishlamasligini bilmaydi.
2. enable='between(t,0,3)' qo'yadi — u faqat ko'rinishni o'chiradi, streamni to'xtatmaydi.
3. -loop 1 ni olib tashlaydi, rasm bir marta chiqadi (kerak bo'lmasa).
4. Output duration ni tekshirmay "tugadi" deb o'ylaydi.

## Edge cases
1. Audio ham map qilingan bo'lsa: `-map "[out]" -map 0:a -c:a copy -shortest` ishlashi mumkin, lekin baribir shortest=1 ishonchliroq.
2. Bir nechta looped input (logo + watermark): har bir overlay ga shortest=1.
3. lavfi color yoki testsrc ishlatganda xuddi shu — shortest=1 yoki -t.
4. Eski ffmpeg (<4.x) da shortest xatti-harakati biroz farq qilishi mumkin — [not verified].

## Done criteria (isbotlovchi buyruqlar)
```bash
ffprobe -v error -show_entries format=duration -of default=nw=1 right.mp4 | grep -E 'duration=3\.'
# va
ls -la right.mp4  # fayl mavjud, hajmi oqilona
# process exit 0 bo'lganini logdan ko'r
```
Agar duration noto'g'ri yoki process timeout → fix ishlamagan.

## Agar hali ham ishlamasa
- `ffmpeg -h filter=overlay` bilan shortest opsiyasini tekshir.
- `ffprobe -show_streams` bilan barcha stream duration larni ko'r.
- Minimal repro ni alohida ishga tushir, timeout bilan.
- Agar xato matni boshqacha bo'lsa (moov atom, Invalid data) — boshqa skill.

## Sources + confidence
- [SRC:https://ffmpeg.org/ffmpeg-filters.html#overlay-1 @ current docs]
- SuperUser / StackOverflow multiple reports of "ffmpeg overlay never stops" with -loop 1, fix shortest=1.
- [SANDBOX] reproduced: hang without shortest=1 (frames > duration), correct duration=3.000000 with shortest=1 on ffmpeg 7.0.2.
confidence: high (measured in sandbox).
