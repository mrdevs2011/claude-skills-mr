---
name: agent-did-not-include-required-xulosa-section-with-clear-learning-takeaway-in-skill-file
description: "Agent skill fayl yaratganda oxirgi Xulosa bo'limini qo'shmadi yoki u noaniq bo'ldi, natijada o'qigan agent nima o'rganganini aniq bilmaydi. Architecture.md dagi majburiy formatni buzadi."
---

# AgentDidNotIncludeRequiredXulosaSectionWithClearLearningTakeawayInSkillFile

## Nima uchun bu skill kerak
Architecture.md skill formatini qat'iy belgilaydi. Oxirgi bo'lim "Xulosa — bu skillni o'qib nimani bilib oldingiz" bo'lishi shart. Bu bo'lim agentning o'qishdan keyin nima o'rganganini mustahkamlaydi va skillning qiymatini oshiradi. Yo'qligi yoki noaniqligi skillni kamroq foydali qiladi.

## Simptom (aynan shu)
Skill.md fayli yaratilgan, lekin oxirida "## Xulosa — bu skillni o'qib nimani bilib oldingiz" bo'limi yo'q, yoki bo'lim bor lekin "skill o'qildi" kabi umumiy gap, aniq takeaway yo'q.

## Sabab (100%)
Agent architecture.md dagi majburiy bo'limlar ro'yxatini to'liq o'qimadi yoki oxirgi bo'limni ixtiyoriy deb hisobladi. Formatni to'liq amal qilish o'rniga qisqa yozdi.

## Tasdiqlash
1. Skill faylini och.
2. Oxirgi bo'limni tekshir: "## Xulosa — bu skillni o'qib nimani bilib oldingiz" aniq shu sarlavha bilan bormi.
3. Matn aniq, o'qigan agent nima qilmasligi/qilishi kerakligini qisqa va amaliy aytadimi.

## Tuzatish (aynan shu)
Har doim skill oxiriga quyidagi aniq bo'limni qo'sh:

```markdown
## Xulosa — bu skillni o'qib nimani bilib oldingiz
Architecture.md majburiy formatiga ko'ra har bir skill oxirida aniq "Xulosa" bo'limi bo'lishi kerak. Bu bo'lim agentga o'qishdan keyin nima o'rganganini (masalan: "Skill yaratganda har doim Xulosa bo'limini aniq takeaway bilan qo'sh") qisqa va amaliy eslatadi. Yo'qligi skillning ta'sirini kamaytiradi.
```

Misol to'liq oxirgi qism:

```markdown
## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill faylini yozayotganda oxirida "## Xulosa — bu skillni o'qib nimani bilib oldingiz" bo'limini qo'shish majburiy. Bu bo'limda o'qigan agent nima qilmasligi kerakligini (Xulosa'siz skill yozmaslik) aniq bilib oladi.
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill yaratishda architecture.md formatiga 100% amal qil: oxirida aniq "Xulosa — bu skillni o'qib nimani bilib oldingiz" bo'limi bo'lishi shart. Bu bo'lim o'qigan agentga aniq takeaway beradi va skillni to'liq qiladi. Bo'limni tashlab ketmaslik.
