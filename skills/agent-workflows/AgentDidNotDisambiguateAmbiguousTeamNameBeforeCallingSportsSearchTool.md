---
name: agent-did-not-disambiguate-ambiguous-team-name-before-sports-search
description: Agent sports_search tooliga "New York", "LA" kabi noaniq jamoa nomini uzatdi, natijada noto'g'ri jamoa, bo'sh natija yoki xato qaytdi.
---

# Agent Did Not Disambiguate Ambiguous Team Name Before Calling Sports Search Tool

## Nima uchun bu skill kerak
sports_search tooli aniq jamoa nomini talab qiladi. "New York" (Yankees yoki Mets, Giants yoki Jets) yoki "LA" kabi noaniq nomlar toolga uzatilsa, noto'g'ri ma'lumot yoki xato qaytadi. Agent foydalanuvchidan aniqlashtirish so'ramasdan yoki oqilona taxmin qilmasdan chaqirsa, javob noto'g'ri bo'ladi.

## Simptom (aynan shu)
- User "New York o'yini" yoki "LA natijasi" deb so'radi.
- Agent sports_search ni team="New York" yoki team="LA" bilan chaqirdi.
- Tool xato, bo'sh, yoki noto'g'ri jamoa (masalan, NYY o'rniga NYM) qaytardi.
- Agent javobda noto'g'ri jamoa ma'lumotini berdi yoki "topilmadi" dedi.

## Sabab (100%)
Agent system prompt'dagi "Exactly one team; \"New York\" is ambiguous" ogohlantirishini e'tiborsiz qoldirdi. Noaniq nomni to'g'ridan-to'g'ri uzatdi, aniqlashtirmadi va oqilona to'liq nom tanlamadi.

## Tasdiqlash
- sports_search chaqiruvida team parametri qisqa yoki noaniqmi ("New York", "LA", "NY", "Chicago")?
- Tool javobida xato yoki kutilmagan jamoa bormi?
- User so'rovida to'liq jamoa nomi yo'qmi?
- Agent oldindan "qaysi biri" deb so'ramaganmi?

## Tuzatish (aynan shu)
Noaniq jamoa nomi bo'lsa:
1. Agar kontekstdan aniq bo'lsa (oxirgi suhbat, liga), to'liq nomni tanla va taxminingni ayt.
2. Aks holda qisqa savol ber: "New York Yankees yoki Mets?"
3. Aniq nom bilan chaqir:
   ```
   sports_search(league="mlb", request="team", team="New York Yankees")
   ```
4. Hech qachon "New York" kabi noaniq stringni to'g'ridan-to'g'ri uzatma.
5. Natijada card_id bo'lsa va user sport haqida so'ragan bo'lsa — render_card qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
sports_search da jamoa nomi aniq va to'liq bo'lishi shart. Noaniq ("New York", "LA") bo'lsa avval disambiguate qil yoki kontekstdan to'liq nom tanla. Noto'g'ri chaqiruv noto'g'ri javobga olib keladi.
