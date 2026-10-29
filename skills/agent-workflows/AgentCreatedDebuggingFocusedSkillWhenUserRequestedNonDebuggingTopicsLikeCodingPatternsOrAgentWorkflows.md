---
name: agent-created-debugging-focused-skill-when-user-requested-non-debugging-topics
description: New skill was created about debugging or error fixing even though the request explicitly asked for non-debugging topics such as coding patterns, tool usage, productivity, or agent workflows.
---

# Agent Created Debugging Focused Skill When User Requested Non-Debugging Topics

## Nima uchun bu skill kerak
Har soatlik skill generator vazifasida foydalanuvchi "debugging dan tashqari" (coding patterns, tool usage, productivity, agent workflows) mavzusini so'ragan. Debuggingga oid skill yaratish so'rovni buzadi va takrorlanishni oshiradi.

## Simptom (aynan shu)
Yangi yaratilgan skill fayli nomi yoki mazmuni "error", "bug", "TypeError", "crash", "fix", "debug" kabi debugging simptomlariga qaratilgan. Yoki kategoriya coding/ ichida xato tuzatish haqida, lekin so'rov non-debugging edi.

## Sabab (100%)
Agent mavjud ko'p debugging skill'laridan ta'sirlanib yoki "coding" so'zini debugging deb tushunib, so'rovda aniq "debugging dan tashqari" deyilganini e'tiborsiz qoldirdi. Mavzu tanlashda qat'iy cheklovni tekshirmadi.

## Tasdiqlash
- Foydalanuvchi xabari "debugging dan tashqari" yoki "coding patterns, tool usage, productivity, agent workflows" iboralarini o'z ichiga oladi.
- Yangi skill `skills/coding/` ostida xato simptomi haqida yoki nomi "Error", "Bug", "Exception" bilan boshlanadi.
- Skill mazmunida "Simptom (aynan shu)" xato matni, "Tuzatish" esa bug fix bo'lsa.

## Tuzatish (aynan shu)
So'rovni o'qib, non-debugging mavzuni tanla:

1. Mavjud skill'larni `find skills -type f -name "*.md"` bilan tekshir, takrorlanmasin.
2. Mavzu tanla: masalan tool usage (qanday tool chaqirish), productivity (context tejash), agent workflows (qadamlar tartibi), coding patterns (best practice, lekin xato emas).
3. Kategoriyani to'g'ri qo'y: `skills/agent-workflows/` yoki `skills/productivity/` yoki `skills/coding/patterns/` (agar pattern bo'lsa).
4. Formatni architecture.md dagi majburiy bo'limlarga rioya qil.

Misol non-debugging skill nomi: `AgentDidNotUseParallelToolCallsForIndependentGuideReads.md`

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi "debugging dan tashqari" deb so'rasa, skill mavzusi xato tuzatish emas, balki pattern, tool, productivity yoki workflow haqida bo'lishi shart. Mavjud skill'larni qidirib takrorlanmasini ta'minla.
