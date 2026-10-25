---
name: agent-started-background-bash-never-checked-status
description: Background'da ishga tushirilgan bash buyrug'ining statusi yoki chiqishini get_terminal_command_output bilan tekshirmasdan vazifa tugadi deb xulosa qilish — natija noaniq yoki xato bo'lishi mumkin.
---

# Background bash buyrug'ini ishga tushirib, statusini tekshirmasdan tugatish

## Nima uchun bu skill kerak
Bash tool'da uzoq buyruqlarni `block_until_ms=0` bilan background'ga tushirish mumkin. Lekin agent ko'pincha buyruqni background'ga qo'yib, darhol "bajarildi" deb javob beradi — holbuki buyruq hali tugamagan, xato bergan yoki natija chiqmagan bo'lishi mumkin. Bu tool oqimidagi xato: background ishlatilgan, lekin monitoring yo'q.

## Simptom (aynan shu)
- `bash` tool chaqiruvida `block_until_ms=0` yoki background flag ishlatilgan.
- Keyin hech qachon `get_terminal_command_output` (yoki ekvivalent status polling) chaqirilmagan.
- Vazifa tugadi, natija tayyor yoki "muvaffaqiyatli" deb xulosa qilingan.
- Background task_id saqlangan, lekin hech qachon tekshirilmagan.
- Foydalanuvchi natijani so'raganida, agent taxminan "ishga tushdi" deydi, lekin to'liq chiqish yo'q.

## Sabab (100%)
Agent background'ni "o'tkazib yuborish" yoki "asinxron qilish" deb tushunadi, lekin tool natijasini olish majburiyatini esdan chiqaradi. Background faqat uzoq ishlashni bloklamaslik uchun, lekin yakuniy holatni bilish uchun alohida `get_terminal_command_output` chaqirish kerak. Agent "buyruq yuborildi = bajarildi" deb taxmin qiladi.

## Tasdiqlash
1. Bash chaqiruvida background (`block_until_ms=0` yoki equivalent) ishlatilganmi?
2. Qaytgan task_id yoki session bilan keyin `get_terminal_command_output` chaqirilganmi?
3. Oxirgi javobda buyruqning exit code, to'liq stdout/stderr yoki "completed" holati ko'rsatilganmi?
4. Agar buyruq hali running bo'lsa, agent buni aytganmi yoki taxminan tugagan deb yozganmi?

## Tuzatish (aynan shu)
Background ishlatganingdan keyin, yakuniy javobdan oldin statusni tekshir:

1. Bash'ni background'da ishga tushir, task_id ni eslab qol.
2. Kerak bo'lsa kut (timeout bilan) yoki darhol `get_terminal_command_output` chaqir.
3. Status "completed" yoki exit code 0 bo'lmasa, xatoni tahlil qil, qayta urin yoki foydalanuvchiga ayt.
4. Faqat to'liq natijani (stdout, exit code) olgandan keyin "tugadi" deb yoz.

```python
# Noto'g'ri oqim:
# bash(command="npm run build", block_until_ms=0)
# ... darhol "Build tugadi" deb javob berish

# To'g'ri oqim:
# 1. result = bash(command="npm run build", description="Build project", block_until_ms=0)
# 2. task_id = result.task_id
# 3. status = get_terminal_command_output(task_ids=[task_id], timeout_ms=60000)
# 4. Agar completed va exit 0 bo'lsa — natijani ishlat. Aks holda tuzat.
```

Agar buyruq tez tugasa, background o'rniga oddiy block_until_ms yetarli timeout bilan ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Background bash faqat bloklamaslik uchun — natija avtomatik kelmaydi.
- Har doim `get_terminal_command_output` bilan status va chiqishni tekshir, keyin xulosa qil.
- "Yubordim" ≠ "bajarildi". Tool oqimini to'liq yop.
