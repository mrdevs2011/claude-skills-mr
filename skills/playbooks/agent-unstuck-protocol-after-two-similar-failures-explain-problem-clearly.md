---
name: agent-unstuck-protocol-after-two-similar-failures-explain-problem-clearly
description: Agent same error yoki yondashuvni 2 marta sinab muvaffaqiyatsiz bo'lsa, loopdan chiqish uchun strategiyani o'zgartir, to'liq xatoni qayta o'qi, search_skills qil, muammoni aniq tushuntir (boshqa AI yoki user uchun).
id: agent-unstuck-protocol-after-two-similar-failures-explain-problem-clearly
type: playbook
stack: any agent workflow (bash tool, search_skills, error analysis)
confirmed_on: 2026-11-12
confidence: high (based on instruction.md + sandbox repro)
triggers:
  - same error again
  - failed twice
  - stuck in loop
  - after 2 failures
  - unstuck protocol
  - explain the problem to another AI
  - ZeroDivisionError again
  - same traceback twice
  - keep retrying same command
  - loop of failures
related:
  - agent-workflows/AgentContinuedWorkflowAfterToolErrorWithoutAnalyzingFullErrorOutputFirst.md
  - agent-workflows/AgentAnsweredCodingErrorOrPatternQuestionFromMemoryWithoutCallingSearchSkillsFirst.md
---

# Agent 2 marta bir xil xato qilsa unstuck protokoli — strategiyani o'zgartir va muammoni aniq tushuntir

## TL;DR
Simptom: xuddi shu buyruq yoki yondashuv 2 marta bir xil xato (masalan ZeroDivisionError) berdi, agent qayta-qayta sinayapti.
Sabab: birinchi xatodan keyin ildizni tushunmasdan bir xil yo'lni qaytarish.
Birinchi buyruq: to'liq xato matnini o'qi (truncated emas), keyin search_skills("exact error text").
Done: yangi strategiya sinandi yoki muammo qisqa, aniq tushuntirildi (symptom + tried + exact error + expected).

## Qachon ishlatish / ishlatmaslik
Ishlat: bir xil error message yoki traceback 2+ marta chiqdi, progress yo'q.
Ishlatma: birinchi urinish (oddiy tuzat), turli xatolar, yoki xato vaqtinchalik (network flaky).

## Mental model (nima uchun)
[REPO:instruction.md] "Xato bo'lsa, odamdek harakat qil: sababini tushun, soddalashtir, boshqa ruxsat etilgan yo'lni sina, qayta urin. Birinchi xatodayoq taslim bo'lma."
2 marta bir xil = joriy yondashuv noto'g'ri. Reframe qil: xatoni to'liq o'qi, skill qidir, minimal repro yoz, boshqa AI/user ga aniq tushuntir. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato sonini hisobla: oxirgi 2 tool/buyruq chiqishini solishtir.
   EXPECTED: agar bir xil traceback 2 marta — 2-qadam. Agar boshqa — oddiy tuzat.
   [SANDBOX] python3 -c "print(1/0)" ikki marta: ZeroDivisionError: division by zero

2. To'liq xato matnini qayta o'qi (limit/offset yoki full output).
   EXPECTED: to'liq traceback, "truncated" yo'q.
   Agar truncated bo'lsa — offset bilan qayta o'qi.

3. search_skills(query="exact error text yoki symptom").
   EXPECTED: mos skill topilsa get_skill bilan o'qi va qo'lla.
   Topilmasa — 4-qadam.

4. Muammoni soddalashtir: minimal repro yoz va alohida sinab ko'r.
   EXPECTED: xato saqlansa — ildiz shu; yo'qolsa — atrof-muhit muammosi.

5. Aniq tushuntirish yoz (boshqa AI yoki user uchun):
   - Symptom: nima bo'ldi
   - Tried: nima sinadim (aniq buyruqlar)
   - Exact error: to'liq matn
   - Expected: nima kutgan edim
   EXPECTED: tushuntirish 5-10 qator, aniq.

6. Yangi yondashuv sinab ko'r yoki foydalanuvchiga ber.
   EXPECTED: progress yoki aniq savol.

## Fix per cause
- Bir xil qayta urinish: to'xtat, xatoni tahlil qil.
- Truncated output: toolni limit/offset yoki pattern bilan qayta chaqir.
- Skill qidirilmagan: search_skills ishlat.
- Vag tushuntirish: yuqoridagi 4 nuqta bilan yoz.

Copy-paste tushuntirish shabloni:
```
Symptom: python script ZeroDivisionError berdi.
Tried: python3 -c "print(1/0)" (2 marta).
Exact error: ZeroDivisionError: division by zero
Expected: 0 yoki boshqa natija.
```

## Where agents go wrong (>=3)
1. 2+ marta bir xil buyruqni qayta ishga tushiradi, xatoni o'qimaydi.
2. Truncated outputni to'liq deb hisoblaydi, offset so'ramaydi.
3. search_skills ni xato matni bilan chaqirmaydi, xotiradan taxmin qiladi.
4. Tushuntirishda "xato bo'ldi" deb qoldiradi, exact error va tried ni yozmaydi.

## Edge cases (>=2)
1. Xato vaqtinchalik (timeout, network) — 2 marta ham bo'lishi mumkin, lekin qayta sinashdan oldin kut.
2. Permission yoki secret kerak — tushuntirishda userdan so'ra, o'zing urinma.
3. Bir nechta turli xato — har birini alohida, bir xil bo'lganini tanla.

## Done criteria (proving commands)
- search_skills chaqirildi va natija ko'rib chiqildi.
- Tushuntirish yozildi yoki yangi buyruq muvaffaqiyatli (exit 0).
- Bir xil xato 3-marta chiqmadi.
Proving: git status yoki tool outputda progress ko'rinadi; yoki tushuntirish matni aniq.

## If still failing
- 3-marta ham bir xil: muammoni userga to'liq tushuntir, yangi yondashuv so'ra.
- search_skills bo'sh: minimal repro ni alohida sandboxda sinab, natijani yoz.
- Context to'ldi: faqat eng so'nggi xato va tushuntirishni saqla, eski loglarni tashla.

## Sources + confidence
[REPO:instruction.md ~line 28: Xato bo'lsa, odamdek harakat qil...]
[SANDBOX] Reproduced: ikki marta python3 -c "print(1/0)" → ZeroDivisionError: division by zero (identical).
Confidence: high — protocol instruction.md dan, repro real.
