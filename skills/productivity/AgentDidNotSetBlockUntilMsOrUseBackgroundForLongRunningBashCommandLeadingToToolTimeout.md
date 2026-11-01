---
name: long-running-bash-without-background-or-block-until
description: Uzun davom etadigan bash buyrug'i (clone, build, test, download) chaqirilganda block_until_ms o'rnatilmagan yoki background=true ishlatilmagan — tool timeout bo'lib, natija yo'qolgan yoki process osilib qolgan.
---

# Uzun bash buyrug'ida timeout yoki background sozlamasini unutish

## Nima uchun bu skill kerak
Bash tool default 30 soniya (30000ms) kutadi. Git clone, npm install, pytest, ffmpeg, katta download kabi buyruqlar undan uzoqroq davom etishi mumkin. block_until_ms oshirilmasa yoki background=true + get_terminal_command_output ishlatilmasa, tool timeout qiladi, agent natijani ko'rmaydi, process esa fonida qolishi mumkin.

## Simptom (aynan shu)
- `bash` tool chaqiruvi 30 soniyadan uzoq ishlashi kutilgan buyruq uchun (git clone katta repo, pip install, docker build, long test).
- block_until_ms parametri berilmagan yoki default qoldirilgan.
- background=true ishlatilmagan, keyin get_terminal_command_output bilan kuzatilmagan.
- Tool "timeout" yoki no output bilan qaytgan, agent "xato" deb hisoblagan.
- Process hali ishlayotgan, lekin agent davom etmagan.

## Sabab (100%)
Agent bash tool'ning default timeout cheklovini va background rejimini e'tiborsiz qoldirgan. "Oddiy buyruq" deb qisqa block_until_ms yoki umuman sozlamasiz chaqirgan. Uzun ishlar uchun background + polling yoki yuqori block_until_ms kerakligini tekshirmagan.

## Tasdiqlash
- Buyruq 30 soniyadan uzoq ishlashi mumkinmi? (clone, install, build, test suite)
- Tool call da `block_until_ms` 30000 dan katta yoki `background` true mi?
- Agar background bo'lsa, keyin `get_terminal_command_output` chaqirilganmi?
- Timeout xabari yoki incomplete output bormi?

## Tuzatish (aynan shu)
1. Buyruq qancha vaqt olishi mumkinligini taxmin qil.
2. Qisqa ( <30s ) bo'lsa — oddiy chaqiruv yetarli.
3. Uzoq bo'lsa:
   - `block_until_ms` ni yetarli qiymatga o'rnat (masalan 120000 yoki 300000).
   - Yoki `background: true` bilan ishga tushir, task_id ol, keyin `get_terminal_command_output` bilan kuzat, kerak bo'lsa `kill_terminal_command`.
4. Har doim description parametrini to'ldir (nima uchun bu buyruq).
5. Outputni to'liq o'qi, exit code ni tekshir.

```javascript
// Noto'g'ri (default timeout)
bash({ command: "git clone https://... large-repo", description: "clone" })

// To'g'ri 1: block_until_ms
bash({ command: "git clone ...", description: "clone large repo", block_until_ms: 120000 })

// To'g'ri 2: background
bash({ command: "npm install", description: "install deps", background: true })
// keyin
get_terminal_command_output({ task_ids: [taskId], timeout_ms: 60000 })
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Bash tool default 30s kutadi — uzun buyruqlar uchun block_until_ms oshir yoki background + get_terminal_command_output ishlat.
- Bu timeout, yo'qolgan natija va osilgan processlarning oldini oladi.
- Har doim description yoz va output/exit code ni tekshir.
