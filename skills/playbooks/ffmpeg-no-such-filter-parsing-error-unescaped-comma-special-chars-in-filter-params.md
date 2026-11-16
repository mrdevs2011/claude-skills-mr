---
id: ffmpeg-no-such-filter-parsing-error-unescaped-comma-special-chars-in-filter-params
name: ffmpeg-no-such-filter-parsing-error-unescaped-comma-special-chars-in-filter-params
description: ffmpeg -vf yoki -filter_complex da "No such filter: '2):ih'" yoki parsing error — expressiondagi , special char escape qilinmagan. \, ishlat.
type: playbook
stack: ffmpeg 7.0.2-static
confirmed_on: 2026-11-16
confidence: high (reproduced in sandbox + official docs)
triggers:
  - No such filter: '2):ih'
  - ffmpeg No such filter comma in crop or scale expression
  - Error parsing filterchain unescaped comma
  - ffmpeg filter "No such filter" part of expression
  - vf crop=iw-mod(iw,2) fails
  - ffmpeg special characters in filter parameters need escaping
  - No such filter after comma in -vf
  - ffmpeg filtergraph syntax error comma
  - how to escape comma in ffmpeg filter expression
  - ffmpeg "Error parsing a filter description" 
related:
  - playbooks/ffmpeg-ss-before-i-with-c-copy-cuts-to-nearest-keyframe-not-exact-time.md
  - playbooks/ffmpeg-filter-complex-loop-1-image-overlay-runs-forever-use-shortest-1.md
---

# ffmpeg "No such filter" yoki parsing error — filter parametrlaridagi , va special charlar escape qilinmagan

## TL;DR
Simptom: `ffmpeg -vf "crop=iw-mod(iw,2):ih" ...` "No such filter: '2):ih'" yoki "Error parsing filterchain" chiqaradi, output yaratilmaydi.
Sabab: filtergraph syntaxda `,` filterlarni ajratadi; expression ichidagi `,` ni `\,` qilib escape qilish kerak.
Birinchi buyruq: xato matnidagi '...' ni ko'r — agar butun filter nomi emas, qismi bo'lsa escape.
Done: xuddi shu buyruq escape bilan exit 0, output fayl yaratiladi.

## Qachon ishlatish / ishlatmaslik
Ishlat: -vf / -filter_complex da "No such filter" yoki "Error parsing a filter description/filterchain", ayniqsa expressionda `,` `:` `(` `)` bo'lsa.
Ishlatma: filter nomi haqiqatan mavjud emas (typo) — avval `ffmpeg -filters` bilan tekshir. Yoki input/codec xatosi.

## Mental model (nima uchun)
[SRC:https://ffmpeg.org/ffmpeg-filters.html @ current, 2026-11-16] Filterlar bir zanjirda `,` bilan, alohida zanjirlar `;` bilan ajratiladi. Parametr expressionlaridagi special characters (`,` `:` `[` `]` `\` etc.) escape qilinishi shart, aks holda parser ularni delimiter deb o'qiydi va qolgan qismni "filter" deb izlaydi. Leading/trailing whitespace tokenlar orasida ignore qilinadi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi.  
   `ffmpeg ... 2>&1 | grep -E "No such filter|Error parsing"`  
   EXPECTED: `No such filter: '2):ih'` yoki `Error parsing filterchain '...'`  
   Agar '...' butun filter nomi (masalan 'cropp') bo'lsa → 2-ga o't (typo). Agar qism (raqam, `):` etc.) → escape muammosi, 4-ga o't.

2. Filter mavjudligini tekshir.  
   `ffmpeg -filters 2>&1 | grep -w crop`  
   EXPECTED: `..C crop              V->V       Crop the input video.`  
   Agar yo'q → filter nomi noto'g'ri yoki buildda yo'q. `ffmpeg -filters` to'liq ro'yxat.

3. Oddiy (expression'siz) versiyani sinab ko'r.  
   `ffmpeg -f lavfi -i color=c=red:s=320x240:d=1 -vf "crop=160:120" /tmp/simple.mp4 -y`  
   EXPECTED: exit 0, fayl yaratiladi.  
   Agar ishlasa, muammo expressiondagi special char. Agar ishlamasa → boshqa sabab (input, permissions).

4. Escape qilib qayta ishga tushir.  
   `ffmpeg -f lavfi -i color=c=red:s=320x240:d=1 -vf "crop=iw-mod(iw\\,2):ih" /tmp/escaped.mp4 -y`  
   EXPECTED: exit 0, "frame=..." oxirida, fayl >0. [SANDBOX]  
   Agar shell double-escape kerak bo'lsa (bash da `\\,`).

5. Murakkab graph uchun file ishlat.  
   `echo 'crop=iw-mod(iw,2):ih' > /tmp/filter.txt`  
   `ffmpeg ... -filter_script /tmp/filter.txt ...`  
   EXPECTED: ishlaydi, escape kamroq kerak. [SRC:ffmpeg docs -filter_script]

## Fix per cause
**Unescaped comma/special in expression:**  
Copy-paste:  
```bash
ffmpeg -f lavfi -i color=c=red:s=320x240:d=1 -vf "crop=iw-mod(iw\\,2):ih" /tmp/out.mp4 -y
```  
Re-check: `ls -l /tmp/out.mp4 && ffprobe -v error /tmp/out.mp4` (exit 0).  

**Typo in filter name:** to'g'ri nomni `ffmpeg -filters` dan olib almashtir.  

**Shell split (quotes yo'q):** butun -vf "..." yoki '...' qilib o'ra.

## Where agents go wrong (>=3)
1. "No such filter" ni filter mavjud emas deb o'ylab, nomini o'zgartiradi yoki boshqa filter qidiradi — aslida parsing qismi.  
2. Escape ni faqat bir marta qiladi (`\,` o'rniga `,`) yoki shell contextini unutadi.  
3. Quotes'siz yozadi, shell `,` ni argument ajratuvchi deb biladi, ffmpeg noto'g'ri string oladi.  
4. filter_complex da bir necha daraja escape kerakligini hisobga olmaydi.

## Edge cases (>=2)
1. Windows cmd/powershell da escape boshqacha (`^` yoki boshqa); Linux/bash uchun `\,` yoki `\\,`.  
2. `[` `]` label lar bilan aralashganda, yoki nested expressionlarda ko'p escape. -filter_complex_script yoki -filter_script ishlatish yaxshiroq.  
3. Buildda filter yo'q bo'lsa (static build cheklangan) — `ffmpeg -filters` da ko'rinmaydi.

## Done criteria
- Buyruq exit code 0.  
- Output fayl mavjud va size > 0 (`ls -l out.mp4`).  
- `ffprobe -v error -show_entries format=duration out.mp4` ishlaydi, xato yo'q.  
- Qayta ishga tushirganda xuddi shu xato chiqmaydi.

## If still failing
- `ffmpeg -h filter=crop` ni o'qi, qaysi param string ekanini ko'r.  
- Minimal repro bilan sinab ko'r (lavfi color).  
- Official docs: https://ffmpeg.org/ffmpeg-filters.html (Filtergraph description) va https://ffmpeg.org/ffmpeg-utils.html#Quoting-and-escaping  
- Agar graph juda murakkab — graph2dot yoki alohida test.

## Sources + confidence
- [SRC:https://ffmpeg.org/ffmpeg-filters.html @ current 2026-11-16] Filtergraph syntax, whitespaces ignored.  
- [SRC:https://trac.ffmpeg.org/ticket/198 @ 2011, still valid] Comma in expression needs escape, "No such filter: '2):480'".  
- [SANDBOX] Wrong: unescaped → No such filter: '2):ih', exit non-zero. Right: `\\,` → exit 0, file created.  
Confidence: high (direct repro + matching docs).
