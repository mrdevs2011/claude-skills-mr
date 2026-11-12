---
name: bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
description: Bash tool default block_until_ms=30000; long commands move to background with task-id. Use get_terminal_command_output to poll status/output, kill_terminal_command to stop. Triggers on "timed out", "moved to the background", task-id, long running command.
id: bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
type: playbook
stack: Grok bash tool (block_until_ms default 30000ms), get_terminal_command_output, kill_terminal_command
confirmed_on: 2026-11-12
confidence: high (reproduced in sandbox)
triggers:
  - command timed out after 30s
  - has been moved to the background as task
  - get_terminal_command_output task_ids
  - long running bash command timeout
  - block_until_ms default 30000
  - background task completed
  - how to poll long command output
  - bash tool timeout background
  - command still running after tool call
  - kill_terminal_command task_id
related:
  - agent-workflows/AgentDidNotUseBashToolBlockUntilMsForLongRunningGitCloneOrPushCausingPrematureBackgroundingAndMissedOutput.md
  - agent-workflows/AgentRanLongRunningCommandInForegroundWithoutBackgroundingOrTimeout.md
---

# Bash tool uzoq buyruq 30s dan keyin backgroundga o'tadi — get_terminal_command_output bilan poll qil

## TL;DR
Simptom: bash tool chaqiruvi 30s dan keyin "is still running after 30s (block_until_ms) and has been moved to the background as task XXX" qaytaradi, to'liq output yo'q.
Sabab: default block_until_ms=30000ms, oshsa backgroundga o'tadi, task-id beradi.
Birinchi buyruq: get_terminal_command_output tool bilan task_ids=["XXX"] (timeout_ms=0 status uchun).
Done: output olindi, status completed, exit code ko'rindi, kerak bo'lsa kill qilindi.

## Qachon ishlatish / ishlatmaslik
Ishlat: git clone/push, build, sleep/test, download, long python/node script — 30s+ davom etadigan buyruq.
Ishlatma: qisqa buyruqlar (<20s), yoki block_until_ms ni yuqori qilib berib to'liq kutish mumkin bo'lsa (lekin max cheklov bo'lishi mumkin).

## Mental model (nima uchun)
[SANDBOX] Bash tool har chaqiruv yangi shell, default 30s block. Oshsa background, task-id qaytaradi. Keyin get_terminal_command_output bilan holat/output olish, kill_terminal_command bilan to'xtatish. Bu context overflow va tool timeout oldini oladi. [REPO:instruction.md agent long commands]

## Diagnosis tree (arzonidan qimmatiga)
1. Tool javobini o'qi: "moved to the background as task <id>" borligini tekshir.
   EXPECTED: task-id bor. Agar to'liq output va exit 0 — muvaffaqiyat, boshqa skill kerak emas.
   Agar "still running" — 2-qadam.

2. Status poll: get_terminal_command_output(task_ids=["<id>"], timeout_ms=0)
   EXPECTED: status "running" yoki "completed", output_file, exit_code agar tugagan. [SANDBOX]

3. Agar running va uzoq — yana poll yoki timeout_ms=5000 bilan kut.
   EXPECTED: vaqt o'tishi bilan completed.

4. Output o'qish: log faylini cat yoki tool qaytargan output.
   EXPECTED: buyruq chiqishi (masalan "done").

5. Agar kerak bo'lmasa yoki xato — kill_terminal_command(task_id="<id>")
   EXPECTED: success, process to'xtaydi.

## Fix per cause
- Default timeout: block_until_ms ni yuqori ber (masalan 60000), lekin uzoq uchun background + poll yaxshiroq.
- Output yo'q: get_terminal_command_output chaqir, output_file ni o'qi.
- Orphan process: kill_terminal_command ishlat, keyin ps bilan tekshir.

Copy-paste misol:
```
# Uzoq buyruq
sleep 40; echo done
# Tool background qiladi, task-id ol
# Keyin:
get_terminal_command_output task_ids=["01a1cd46-..."] timeout_ms=0
# Output: done, status completed
```

## Where agents go wrong (>=3)
1. Background task-id ni e'tiborsiz qoldirib, qayta xuddi shu buyruqni chaqiradi — duplicate process.
2. get_terminal_command_output o'rniga log faylini to'g'ridan-to'g'ri o'qishga urinadi (tool orqali qil).
3. Kill qilmaydi, process qoladi, keyingi ishlarga ta'sir qiladi.
4. block_until_ms=0 ni immediate background deb o'ylaydi, lekin ba'zan default ishlaydi.

## Edge cases (>=2)
1. Buyruq 30s dan biroz ko'p — background, lekin tez tugaydi; darhol poll qil.
2. Error exit code (non-zero) — status completed, lekin exit !=0, outputda xato matni.
3. Bir nechta background — task_ids array bilan bir vaqtda poll.

## Done criteria (proving commands)
- get_terminal_command_output qaytardi status=completed, exit_code=0, output expected.
- ps | grep command — process yo'q (agar kill qilingan bo'lsa).
- Qayta tool chaqiruvda duplicate yo'q.

## If still failing
- task-id noto'g'ri: tool javobidan aniq nusxa ol.
- Log fayl ruxsat: tool orqali o'qi, to'g'ridan-to'g'ri cat.
- Juda uzoq: kill, keyin block_until_ms yuqori yoki background + periodic poll.

## Sources + confidence
[SANDBOX] Reproduced: sleep 40 backgrounded after 30s, task-id, later completed with "done", exit 0. get_terminal_command_output and kill tested.
Confidence: high, based on actual tool runs in this environment.
