---
id: ffmpeg-ss-before-i-with-c-copy-cuts-to-nearest-keyframe-not-exact-time
type: playbook
stack: ffmpeg 7.0.2-static
confirmed_on: 2026-11-11
confidence: high (reproduced in sandbox + official docs)
triggers:
  - ffmpeg -ss -c copy starts too early
  - video cut with stream copy has black frames or starts at previous keyframe
  - ffmpeg seeking inaccurate with -c copy
  - cut video starts a few seconds before requested time
  - -ss before -i with copy not frame accurate
  - ffmpeg keyframe seek problem
  - video trim -c copy wrong start timestamp
  - how to accurately cut video with ffmpeg without reencode
  - ffmpeg output starts at wrong time with copy
related:
  - productivity/AgentAttemptedToProcessMediaWithFfmpegWithoutReadingBundledFfmpegSkillMdLeadingToIncorrectCommandsOrMissingFeatures.md
---

# ffmpeg -ss -i dan oldin + -c copy keyframe'ga kesadi, aniq vaqtga emas

## TL;DR
Simptom: `ffmpeg -ss 00:01:23 -i video.mp4 -t 10 -c copy out.mp4` natija so'ralgan vaqtdan oldinroq (oldingi keyframe) boshlanadi, qora kadr yoki noto'g'ri content.
Sabab: stream copy da ffmpeg faqat keyframe'ga seek qiladi, oraliqni saqlaydi.
Birinchi buyruq: `ffprobe -v error -select_streams v -show_entries frame=pts_time,key_frame -of csv input.mp4 | grep ',1$'`
Done: chiqish birinchi kadrining pts_time so'ralganga yaqin, yoki re-encode qilingan versiya aniq.

## Qachon ishlatish / ishlatmaslik
Ishlat: video/audio kesishda `-c copy` (tez, re-encode yo'q) ishlatganingizda boshlanish noto'g'ri bo'lsa.
Ishlatma: oddiy transcode (re-encode) da — u aniq. Yoki faqat audio, yoki keyframe intervali juda kichik bo'lsa.

## Mental model (nima uchun)
[SRC:https://ffmpeg.org/ffmpeg.html @ current, 2026-11] `-ss` input option sifatida ( -i dan oldin) eng yaqin seek point (odatda keyframe) ga sakraydi. Transcode da ortiqcha segment decode qilinib tashlanadi (-accurate_seek default). Lekin `-c copy` (stream copy) da bu segment saqlanadi — shuning uchun chiqish oldingi keyframe'dan boshlanadi. Keyframe'lar odatda 1-5 soniya oraliqda. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Chiqishni tekshir: `ffprobe -v error -show_entries format=start_time -of default=nw=1 out.mp4`  
   EXPECTED: 0 yoki so'ralgan vaqt. Agar farq katta → keyframe muammosi.  
   Agar start_time manfiy yoki 0, lekin content noto'g'ri → 2-ga o't.

2. Originaldagi keyframe'larni ko'r: `ffprobe -v error -select_streams v -show_entries frame=pts_time,key_frame -of csv input.mp4 | grep ',1$' | head -20`  
   EXPECTED: pts_time ro'yxati (masalan 0, 2.0, 4.0...). Agar so'ralgan vaqt (masalan 5) orasida keyframe yo'q → shu sabab.  
   Agar keyframe aniq o'sha vaqtda → boshqa muammo (timestamp, container).

3. Copy vs re-encode solishtir:  
   `ffmpeg -ss 5 -i test.mp4 -t 2 -c copy out_copy.mp4 -y`  
   `ffmpeg -ss 5 -i test.mp4 -t 2 -c:v libx264 -crf 23 out_re.mp4 -y`  
   EXPECTED: out_copy birinchi packet pts oldingi keyframe, out_re aniqroq. [SANDBOX: packet pts manfiy yoki oldinroq]

4. -ss joyini o'zgartirib sinab ko'r: `ffmpeg -i input.mp4 -ss 5 -t 2 -c copy out_after.mp4`  
   EXPECTED: ba'zan yaxshiroq, lekin sekinroq va baribir keyframe cheklovi bor.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): keyframe'ga tushish.  
Fix: re-encode qil (aniq, lekin sekinroq):  
```bash
ffmpeg -ss 00:01:23 -i input.mp4 -t 10 -c:v libx264 -crf 23 -preset medium -c:a aac out.mp4
```
Tekshir: `ffprobe -v error -show_entries frame=pts_time -of csv out.mp4 | head -1` yaqin bo'lishi kerak.

Agar tezlik muhim va taxminiy yetarli: keyframe'ni topib o'sha vaqtga -ss qo'y, keyin -c copy.  
Yoki `-avoid_negative_ts make_zero` qo'sh.

## Agentlar qayerda xato qiladi
1. Har doim `-ss` ni -i dan oldin qo'yib, `-c copy` bilan "tez" deb o'ylash — aniqligini tekshirmaydi.
2. Chiqish start_time 0 bo'lsa "to'g'ri" deb o'ylash, contentni (birinchi kadr) ko'rmaydi.
3. Faqat wiki yoki eski postlarga ishonib, rasmiy docs o'qimaydi.
4. Re-encode qilishni "sifat yo'qoladi" deb rad etish, lekin CRF 18-23 yetarli.

## Edge cases
1. Keyframe intervali 0.5s dan kam (high GOP yo'q) — farq sezilmasligi mumkin. [GUESS]
2. Ba'zi containerlar (TS, MKV) da timestamp offset boshqacha. -seek_timestamp sinab ko'r.
3. Audio-only da keyframe tushunchasi boshqacha, odatda aniqroq.
4. Wayland/Android da ishlamaydi — faqat ffmpeg CLI. [not verified]

## Done criteria
```bash
# Aniq kesish isboti
ffprobe -v error -select_streams v -show_entries frame=pts_time -of csv=p=0 out.mp4 | head -1
# Chiqish birinchi pts so'ralgan vaqtga ±0.1s yaqin bo'lishi kerak (re-encode dan keyin)
# Yoki: ffmpeg -i out.mp4 -vframes 1 -f image2 check.png && file check.png
```
Agar content vizual to'g'ri va vaqt mos — done.

## Agar hali ham ishlamasa
- `ffmpeg -h full | grep -A5 -i ss` bilan optionsni tekshir.
- Inputni `ffprobe -show_streams input.mp4` bilan kodek/GOP ko'r.
- Minimal repro: `ffmpeg -f lavfi -i testsrc=duration=10:size=320x240:rate=30 -c:v libx264 -g 60 test.mp4` keyin kes.
- Docs: https://ffmpeg.org/ffmpeg.html#toc-Main-options

## Sources + confidence
- [SRC:https://ffmpeg.org/ffmpeg.html] -ss section, 2026-11 o'qildi: "When doing stream copy ... it will be preserved."
- [SANDBOX] 2026-11-11: test.mp4 (GOP 60) da -ss 5 -c copy packet pts manfiy/oldingi, re-encode 0 dan boshladi.
- Confidence: 90% (docs + local repro). 100% emas, chunki har container boshqacha bo'lishi mumkin.
