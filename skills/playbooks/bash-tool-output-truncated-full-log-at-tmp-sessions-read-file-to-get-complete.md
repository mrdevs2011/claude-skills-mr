---
name: bash-tool-output-truncated-full-log-at-tmp-sessions-read-file-to-get-complete
description: Bash tool katta output qaytarganda "[truncated: ... full output at: /tmp/sessions/.../terminal/XXXX.log]" xabari chiqadi. To'liq natijani olish uchun shu log faylini read_file bilan o'qi. Limit bilan oldini ol.
id: bash-tool-output-truncated-full-log-at-tmp-sessions-read-file-to-get-complete
type: playbook
stack: Grok bash tool (large stdout/stderr truncated in response, full at session log)
confirmed_on: 2026-11-12
confidence: high (reproduced in sandbox: cat large file → truncated + log path; read_file on log gave full 10000 lines)
triggers:
  - truncated showing first/last full output at
  - full output at: /tmp/sessions
  - tool output truncated
  - bash output too large truncated
  - how to get full tool output
  - terminal log file for truncated
  - [truncated: showing first/last
  - complete output after truncation
  - read full log from sessions path
  - output truncated showing
related:
  - productivity/AgentUsedUnrestrictedFindOrLsOnLargeDirectoryCausingContextBloatFromExcessiveFileListings.md
  - agent-workflows/AgentAssumedGuidelinesWereFullyReadAfterTruncatedToolOutputWithoutRequestingOffsetContinuation.md
  - playbooks/bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output.md
---

# Bash tool output truncated — full log at /tmp/sessions/.../terminal/XXXX.log ni o'qi

## TL;DR
Simptom: bash tool javobida "[truncated: showing first/last X KB of Y KB - full output at: /tmp/sessions/.../terminal/TASKID.log]" ko'rinadi, oxiri yoki o'rtasi yo'q.
Sabab: tool response layer katta stdout ni context uchun qisqartiradi, to'liqini session log fayliga yozadi.
Birinchi buyruq: read_file(file_path="/tmp/sessions/.../terminal/TASKID.log")
Done: log fayldan to'liq output o'qildi (wc -l yoki head/tail mos), truncated qismdan tashqari ma'lumot bor.

## Qachon ishlatish / ishlatmaslik
Ishlat: bash/find/cat/ls/python -c katta output (yuzlab KB+) qaytarganda truncated xabari paydo bo'lsa.
Ishlatma: qisqa output (truncated xabari yo'q), yoki read_file/open_page truncation (ularning o'z offset/pattern i bor).

## Mental model (nima uchun)
[SANDBOX] Grok bash tool buyruq chiqishini agent context'iga beradi. Juda katta bo'lsa (taxminan 10KB+), javobni birinchi/oxirgi qism bilan qisqartiradi va "full output at: PATH" deb session terminal logini ko'rsatadi. PATH odatda /tmp/sessions/<session>/terminal/<task-id>.log. To'liq matn shu faylda, uni read_file yoki cat bilan olish mumkin. Bu context overflow oldini oladi, lekin agent to'liqni o'qimasdan xulosa qilmasligi kerak.

## Diagnosis tree (arzonidan qimmatiga)
1. Tool javobini tekshir: "[truncated:" va "full output at:" borligini qara.
   EXPECTED: "full output at: /tmp/sessions/.../terminal/XXXX.log" qatori. [SANDBOX]
   Agar yo'q — oddiy output, boshqa skill.

2. PATH ni aniq nusxa ol (to'liq yo'l).
   EXPECTED: mavjud fayl. Agar yo'q — task-id noto'g'ri.

3. read_file(file_path="PATH", limit=100) yoki bash cat PATH | head -20
   EXPECTED: to'liq output boshlanishi (truncated dagi birinchi qatorlar bilan mos).

4. To'liqligini tasdiqla: bash wc -l PATH yoki tail -5 PATH
   EXPECTED: kutilgan qator soni yoki oxirgi ma'lumot.

5. Agar hali kerak bo'lsa, limit/offset bilan qismlarga o'qi (context to'lmasligi uchun).
   EXPECTED: kerakli qismlar olingan.

## Fix per cause
- Truncated ko'rildi: darhol PATH ni read_file bilan o'qi. To'liqni context'ga yuklama, faqat kerakli qismni (head/tail/grep).
- Oldini olish: buyruqni | head -50 yoki | wc -l bilan chekla, yoki find ... -name ... | head.
- Log yo'qolgan: yangi buyruqni kichikroq output bilan qayta ishga tushir.

Copy-paste:
```
# Truncated javobdan PATH olindi
read_file file_path="/tmp/sessions/794b37de-dd67-446b-b0b4-6ba47c96eba3/terminal/01a1cf02-12cc-76c0-afd4-45c3cda66820.log" limit=50
# yoki
bash command="wc -l /tmp/sessions/.../terminal/XXXX.log && tail -10 /tmp/sessions/.../terminal/XXXX.log"
```

## Where agents go wrong (>=3)
1. Truncated xabarini e'tiborsiz qoldirib, faqat ko'rsatilgan birinchi/oxirgi qismdan xulosa chiqaradi — o'rtadagi muhim xato/natija yo'qoladi.
2. PATH ni o'qimasdan "output to'liq emas" deb qayta xuddi shu katta buyruqni chaqiradi — yana truncation.
3. Log faylni cat qilib to'liqini context'ga yuklaydi — token isrofi va yangi truncation.
4. PATH ni taxmin qiladi yoki noto'g'ri task-id ishlatadi.

## Edge cases (>=2)
1. Output aynan truncation chegarasida — ba'zan truncated, ba'zan yo'q; har doim "full output at" ni tekshir.
2. Background task (30s timeout) + katta output: avval get_terminal_command_output, keyin uning logi yoki truncation logi.
3. Error stderr ham katta bo'lishi mumkin — logda ikkalasi bor.

## Done criteria (proving commands)
- read_file yoki cat PATH | wc -l kutilgan to'liq sonni qaytardi (masalan 10000).
- head/tail truncated qism bilan mos keladi, lekin qo'shimcha qatorlar bor.
- Kerakli ma'lumot (masalan xato matni yoki fayl nomi) logdan topildi, truncated da yo'q edi.

## If still failing
- PATH ruxsat yo'q: ls -l PATH, yoki yangi buyruqni | head bilan qayta.
- Session log tozalangan: kichik output bilan qayta ishga tushir, yoki buyruqni o'zgartir.
- Juda katta: logni grep yoki sed bilan filtrla, to'liq o'qima.

## Sources + confidence
[SANDBOX] Reproduced 2026-11-12: `cat /tmp/largeout.txt` (10000 lines) → truncated first/last 4.9KB of 448KB + full at /tmp/sessions/.../terminal/01a1cf02-....log. `wc -l` on log = 10000, head/tail to'liq. read_file on log worked.
Confidence: high, based on actual tool response and log file content in this sandbox.
