---
name: agent-responded-in-wrong-language-instead-of-matching-user
description: Foydalanuvchi tilida (til, dialekt, alifbo) javob bermaslik — system prompt qoidasiga zid. Javob noto'g'ri tilda chiqadi.
---

# Agent Responded In Wrong Language Instead Of Matching User Language Dialect And Alphabet

## Nima uchun bu skill kerak
System prompt'da aniq qoida bor: "Respond in the same language, regional/hybrid dialect, and alphabet as the user unless asked not to." Agentlar ko'pincha ingliz tilida yoki default tilda javob beradi, hatto foydalanuvchi o'zbek, rus yoki boshqa tilda so'rasa ham. Bu foydalanuvchi tajribasini yomonlashtiradi va qoidani buzadi.

## Simptom (aynan shu)
- Foydalanuvchi so'rovi o'zbek (lotin yoki kirill), rus, yoki boshqa tilda yozilgan.
- Agent javobi ingliz tilida yoki foydalanuvchi tiliga mos kelmaydigan tilda chiqadi.
- Dialekt, regional xususiyatlar yoki alifbo (masalan, o'zbek lotin) hisobga olinmagan.
- Foydalanuvchi "o'zbekcha javob ber" deb so'ramagan, lekin agent o'zicha inglizcha yozgan.

## Sabab (100%)
Agent system prompt'dagi til moslashuv qoidasini e'tiborsiz qoldiradi. "Default English" yoki "technical English is better" deb taxmin qiladi. Foydalanuvchi tilini aniqlash va unga moslashishni unutadi yoki "so'ralmasa ham inglizcha yaxshi" deb hisoblaydi.

## Tasdiqlash
- Foydalanuvchi so'rovi qaysi tilda yozilgan?
- Agent javobi shu tilda (va alifboda) mi?
- System prompt'dagi "same language, regional/hybrid dialect, and alphabet" qoidasi buzilganmi?
- Foydalanuvchi maxsus boshqa tilni so'raganmi? (agar so'ramagan bo'lsa, moslashish shart)

## Tuzatish (aynan shu)
1. Har doim foydalanuvchi so'rovi tilini aniqlang (lotin/kirill o'zbek, rus, ingliz va h.k.).
2. Javobni **aynan shu tilda, dialektda va alifboda** yozing, agar foydalanuvchi boshqacha so'ramagan bo'lsa.
3. Texnik atamalar uchun ham asosiy matn foydalanuvchi tilida bo'lsin (kerak bo'lsa atamani qavs ichida inglizcha qoldiring).
4. Misollar:
   - Noto'g'ri: User "bugun ob-havo qanday?" deb so'rasa, agent "The weather is sunny today." deb javob beradi.
   - To'g'ri: "Bugun ob-havo quyoshli, harorat 22°C atrofida."
5. Agar foydalanuvchi aralash til ishlatsa (hybrid), shu uslubda javob bering.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
System prompt foydalanuvchi tiliga moslashishni majburiy qiladi. Agent default ingliz tiliga o'tmasligi, balki so'rov tilini aniqlab, shu tilda (dialekt va alifbo bilan) javob berishi kerak. Bu qoidani buzish foydalanuvchi tajribasini yomonlashtiradi va e'tiborsizlik belgisidir.
