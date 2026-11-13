---
name: extract-relevant-part-from-huge-tool-output-or-session-log-without-loading-entire-into-context
description: Tool output yoki session log juda katta bo'lganda (truncated yoki context to'lish xavfi) butunini yuklamasdan kerakli qismni grep/sed/read_file offset+limit yoki pattern bilan ol. Context overflow oldini ol.
id: extract-relevant-part-from-huge-tool-output-or-session-log-without-loading-entire-into-context
type: playbook
stack: Grok bash tool + read_file (offset/limit) + open_page (pattern); session logs at /tmp/sessions/*/terminal/*.log
confirmed_on: 2026-11-13
confidence: high (reproduced: large python print → truncated response + full log path; grep/sed/read_file limit extracted relevant lines without full load)
triggers:
  - truncated showing first/last full output at
  - full output at: /tmp/sessions
  - tool output too large for context
  - how to extract from huge log without loading all
  - context bloat from large tool response
  - read_file offset limit for large file
  - grep pattern on session log
  - open_page pattern instead of full page
  - huge bash output truncated
  - session terminal log too big
related:
  - playbooks/bash-tool-output-truncated-full-log-at-tmp-sessions-read-file-to-get-complete.md
  - productivity/AgentLoadedFullPageWithOpenPageToolWithoutUsingPatternOrStartLineParametersCausingUnnecessaryContextBloatWhenOnlySpecificSectionNeeded.md
  - productivity/AgentReadEntireLargeFileWithReadFileToolInsteadOfUsingLimitAndOffsetParametersCausingContextBloat.md
  - agent-workflows/AgentAssumedGuidelinesWereFullyReadAfterTruncatedToolOutputWithoutRequestingOffsetContinuation.md
---

# Katta tool output yoki session logdan butunini yuklamasdan kerakli qismni ol

## TL;DR
Simptom: bash/open_page/read_file katta natija qaytaradi, "[truncated: ... full output at: PATH]" yoki context to'lish xavfi, kerakli xato/natija o'rtada yo'qolishi mumkin.
Sabab: tool response layer context uchun qisqartiradi; to'liq log yoki fayl juda katta bo'lsa to'liq yuklash token isrofi va yangi truncation.
Birinchi buyruq: truncated dan PATH olib, bash "grep -n 'ERROR\|error\|Traceback' PATH | head -20" yoki read_file(file_path=PATH, offset=100, limit=50)
Done: kerakli qatorlar/pattern mos kelgan qism olingan, butun fayl context'ga kirmagan.

## Qachon ishlatish / ishlatmaslik
Ishlat: bash/find/cat/python katta output (yuzlab KB+), open_page uzun sahifa, read_file katta fayl — truncated xabari yoki "too large" sezilganda, faqat ma'lum qism (xato, natija, oxirgi 50 qator) kerak bo'lsa.
Ishlatma: qisqa output (truncated yo'q), yoki butun natija haqiqatan kerak va kichik bo'lsa.

## Mental model (nima uchun)
[SANDBOX] Grok tool'lari (bash, open_page, read_file) katta matnni agent context'iga to'liq bermaydi — truncation yoki limit. To'liq matn session log faylida (/tmp/sessions/<uuid>/terminal/<task>.log) yoki asl manbada saqlanadi. Butunini yuklash context overflow qiladi, muhim qismni yashiradi. Shuning uchun filter (grep, sed, awk), pagination (offset/limit, start_line), yoki pattern ishlatib faqat kerakli qismni ol. Bu token tejaydi va aniq tashxis uchun yetarli.

## Diagnosis tree (arzonidan qimmatiga)
1. Tool javobini tekshir: "[truncated:" va "full output at:" bormi yoki output juda uzun seziladimi.
   EXPECTED: "full output at: /tmp/sessions/.../terminal/XXXX.log" yoki truncated belgi. [SANDBOX]
   Agar yo'q va qisqa — boshqa skill (oddiy o'qish).

2. PATH ni aniq ol (truncated xabardan).
   EXPECTED: fayl mavjud (ls PATH). Agar yo'q — yangi kichik buyruq bilan qayta urin.

3. Eng arzon filter: bash "grep -n -E 'error|Error|ERROR|Traceback|Exception|failed' PATH | head -30"
   EXPECTED: mos qatorlar (agar xato bo'lsa). Agar hech narsa — boshqa pattern (son, key, result).

4. Agar pattern noaniq: read_file(file_path=PATH, offset=1, limit=30) boshlanish, keyin offset= (wc -l / 2) o'rtasi, yoki tail.
   EXPECTED: kerakli qism ko'rinadi, butun fayl emas.

5. open_page uchun: open_page(url, pattern="relevant phrase", max_matches=10, context_lines=5) — to'liq sahifa emas.
   EXPECTED: mos qatorlar + context.

6. Agar hali katta: sed -n 'START,ENDp' PATH yoki awk.
   EXPECTED: aniq diapazon.

## Fix per cause
- Truncated + PATH bor: darhol grep yoki read_file limit/offset. To'liq cat/read_file limit=none qilma.
- Oldini olish: buyruqni | grep ... | head -20 yoki | tail -50 bilan chekla, yoki find | head.
- open_page/read_file: har doim pattern/offset/limit parametrlarini ishlat, default to'liq yuklashdan qoch.
- Log juda katta (GB): faqat kerakli pattern, yoki yangi buyruqni kichikroq output bilan.

Copy-paste misol:
```
# Truncated PATH olindi
bash command="grep -n -E 'Error|Traceback|failed' /tmp/sessions/SESSION/terminal/TASK.log | head -20"
# yoki
read_file file_path="/tmp/sessions/SESSION/terminal/TASK.log" offset=200 limit=40
# open_page uchun
open_page url="https://example.com/docs" pattern="specific error text" max_matches=5
```

## Where agents go wrong (>=3)
1. Truncated xabarini ko'rib, faqat ko'rsatilgan first/last qismdan xulosa chiqaradi — o'rtadagi asosiy xato/natija yo'qoladi.
2. PATH ni olgach to'liq read_file yoki cat qiladi — context to'ladi, yangi truncation, token isrofi.
3. open_page ni pattern/start_line siz chaqiradi — butun sahifa keladi, keraksiz.
4. Filter o'rniga qayta xuddi shu katta buyruqni chaqiradi — yana truncation.

## Edge cases (>=2)
1. Output aynan chegarada (ba'zan truncated, ba'zan yo'q) — har doim "full output at" ni tekshir, shubha bo'lsa filter.
2. Background task (30s) + katta output: avval get_terminal_command_output, keyin uning logiga filter.
3. Binary yoki non-text output: grep ishlamasligi mumkin, head -c yoki file type tekshir.
4. Log yo'qolgan yoki o'chirilgan: yangi buyruqni | head/tail bilan cheklab qayta ishga tushir.

## Done criteria
- Kerakli qatorlar/pattern mos kelgan qism olingan (masalan grep natijasi yoki read_file limit bilan).
- Butun katta fayl context'ga yuklanmagan (token hisobida sezilarli o'sish yo'q).
- Buyruq: grep ... | wc -l yoki read_file limit bilan tasdiqlangan, kutilgan ma'lumot bor.

## If still failing
- PATH noto'g'ri: yangi bash chaqiruvi bilan kichik output ( | head -10 ) qayta ishga tushir, truncation xabaridan yangi PATH ol.
- Pattern topilmadi: kengaytir (case insensitive, boshqa kalit so'z), yoki offset bilan qismlarga bo'lib o'qi.
- Context baribir to'lsa: yanada kichik limit (limit=10), yoki faqat soni (wc -l, grep -c).

## Sources + confidence
[SANDBOX] Grok bash tool truncation behavior kuzatilgan (katta stdout → "[truncated: showing first/last X KB of Y KB - full output at: /tmp/sessions/...log]"). read_file offset/limit, open_page pattern, bash grep/sed ishlashi tasdiqlangan. Rasmiy tool schema'laridan (read_file, open_page parametrlari). Confidence: high — reproduksiya qilingan, mantiq aniq.
