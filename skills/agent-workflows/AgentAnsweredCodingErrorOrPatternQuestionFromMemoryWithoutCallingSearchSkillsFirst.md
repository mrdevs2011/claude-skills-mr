---
name: agent-answered-coding-error-or-pattern-from-memory-without-search-skills
description: Kod xatosi, pattern yoki arxitektura savoliga ichki bilimdan javob berish — avval search_skills chaqirilmagan, aniq skill o'tkazib yuborilgan.
---

# Kod savoliga search_skills chaqirmasdan ichki bilimdan javob berish

## Nima uchun bu skill kerak
Repo'da aniq simptom-sabab-tuzatish skill'lari bor (coding/patterns, async, null va h.k.). Agent "men bilaman" deb search_skills ni chaqirmaydi, umumiy yoki eskirgan javob beradi. Natijada foydalanuvchi eng aniq, tekshirilgan tuzatishni olmaydi, skill bazasi ishlatilmaydi.

## Simptom (aynan shu)
- Foydalanuvchi kod xatosi matni, "is not a function", "undefined", pattern ("mutable default", "await in loop") yoki "qanday to'g'ri yozish" deb so'radi.
- Agent to'g'ridan-to'g'ri javob yozdi, search_skills yoki get_skill chaqiruvi yo'q.
- Javob umumiy, "umuman yaxshi amaliyot" uslubida, aniq skill formatidagi simptom/sabab/tuzatish yo'q.
- Xato matni yoki kalit so'z bilan skill topilishi mumkin edi, lekin qidirilmadi.

## Sabab (100%)
Agent ichki trening bilimiga ishonadi va "bu oddiy" deb tool chaqirishni o'tkazib yuboradi. Instruction.md dagi "Pure texnik savol -> avval search_skills" qoidasini e'tiborsiz qoldiradi. Skill bazasi har safar to'liq yuklanmasligi uchun qidiruv kerakligini unutadi.

## Tasdiqlash
- Savol kod, xato, pattern, refactor yoki "qanday qilish" haqida edi?
- Tool chaqiruvlar ro'yxatida search_skills (yoki ekvivalenti) bormi?
- Agar skill topilgan bo'lsa, u o'qilganmi (get_skill yoki to'liq matn)?
- Javob skill formatiga (simptom, 100% sabab, aniq tuzatish) mosmi yoki umumiy?

## Tuzatish (aynan shu)
Har qanday kod/xato/pattern savolida avval qidir:

1. Xato matni, kalit so'z yoki simptomni ol (masalan "TypeError is not a function", "mutable default", "vercel 404").
2. Darhol `search_skills(query)` chaqir (yoki mavjud tool).
3. Natija bo'lsa — to'liq skill matnini o'qi, shu bo'yicha javob ber (skilldagi tuzatishni asos qilib ol).
4. Natija bo'sh bo'lsa — "skill topilmadi" deb ayt, keyin o'z bilimingdan javob ber.
5. Hech qachon "men bilaman" deb qidiruvni o'tkazib yuborma — skill aniqroq va tekshirilgan.

Misol:
```
# noto'g'ri
User: "Python mutable default argument xatosi"
Agent: "Bu oddiy, default=[] ishlatma, None qil..."  # search yo'q

# to'g'ri
User: "Python mutable default argument xatosi"
Agent: search_skills("mutable default argument")
# skill topildi -> o'qi -> shu skilldagi aniq tuzatishni ber
```

Agar search tool yo'q bo'lsa — instruction.md dagi yo'nalishni kuzat va skill katalogini qidir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Kod savoliga avval search_skills. Ichki bilim ikkinchi.
- Skill topilsa — uning aniq tuzatishini ishlat, umumiy maslahat emas.
- Bu token tejaydi, aniqlikni oshiradi, skill bazasini ishlatadi.
