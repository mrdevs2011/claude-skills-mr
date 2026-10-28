---
name: agent-started-background-bash-without-kill
description: Agent backgrounded a long-running bash command but never called kill_terminal_command after finishing or on error, leaving an orphan process that continues consuming resources.
---

# Background bash buyrug'ini tugatgandan keyin kill qilmaslik

## Nima uchun bu skill kerak
Uzoq ishlaydigan buyruqlar uchun `bash` tooliga `block_until_ms: 0` berib background'ga olinadi. Agent keyin `get_terminal_command_output` bilan holatni tekshiradi, lekin ish tugagach yoki xato bo'lgach `kill_terminal_command` chaqirmaydi. Natijada process orqada qoladi, CPU/RAM ishlatadi, keyingi buyruqlarga xalaqit beradi yoki portni band qiladi.

## Simptom (aynan shu)
- Background task ishga tushirilgan (`block_until_ms: 0`).
- Agent task_id olgan va holatni tekshirgan.
- Lekin oxirida `kill_terminal_command` chaqirilmagan.
- Keyingi sessiyada yoki parallel ishlarda eski process hali yurib turadi.
- `ps` yoki terminal output'da eski command ko'rinadi.

## Sabab (100%)
Agent background buyruqni faqat ishga tushirish va holatini ko'rishni biladi, lekin uni aniq to'xtatish (kill) qadamini unutadi. Tool schema'sida `kill_terminal_command` borligini e'tibordan qochiradi yoki "o'zi tugaydi" deb taxmin qiladi.

## Tasdiqlash
1. Bash tool chaqiruvi `block_until_ms: 0` bilan bormi?
2. `get_terminal_command_output` chaqirilganmi?
3. Sessiyaning oxirida yoki task tugagach `kill_terminal_command(task_id=...)` chaqirilganmi?
4. Agar yo'q — bu aynan shu holat.

## Tuzatish (aynan shu)
Background buyruqni ishga tushirgandan so'ng, ish tugagach (yoki xato/timeout bo'lganda) darhol to'xtating:

```javascript
// 1. Background'ga olish
const result = await bash({
  command: "long-running-command",
  block_until_ms: 0,
  description: "Start long task in background"
});
const taskId = result.task_id;  // yoki tool javobidan oling

// 2. Holatni tekshirish (kerak bo'lsa)
await get_terminal_command_output({ task_ids: [taskId] });

// 3. Tugatgandan keyin majburiy kill
await kill_terminal_command({ task_id: taskId });
```

Qoidasi: har bir `block_until_ms: 0` chaqiruviga mos `kill_terminal_command` bo'lishi shart. Orphan process qoldirmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Background bash buyruqni ishga tushirish yetarli emas — ish tugagach uni aniq `kill_terminal_command` bilan to'xtatish kerak. Aks holda orphan process qoladi. Har doim task_id'ni saqlang va oxirida kill qiling.
