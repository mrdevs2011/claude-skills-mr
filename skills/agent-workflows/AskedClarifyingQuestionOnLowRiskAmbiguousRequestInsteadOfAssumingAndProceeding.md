---
name: asked-clarifying-question-low-risk-ambiguous
description: Past xavfli noaniq so'rovda foydalanuvchidan qo'shimcha savol so'rash, oqilona taxmin qilib darhol bajarish mumkin bo'lganda — vaqt isrofi va foydalanuvchi bezovtaligi.
---

# Past xavfli noaniq so'rovda savol so'rash o'rniga taxmin qilib bajarish

## Nima uchun bu skill kerak
Agentlar noaniq yoki yarim gapli so'rovlarda darhol "aniqlashtiring" deb savol beradi. Ammo ko'p hollarda suhbat tarixi, odatlar yoki eng oqilona ma'no asosida taxmin qilib ishni bajarish mumkin. Natijada foydalanuvchi qo'shimcha javob yozishga majbur bo'ladi, ish sekinlashadi, ohang rasmiy bo'lib qoladi. instruction.md da aniq: "Ishla, so'rama — oddiy narsa uchun savol berma, taxmin qil, bajar".

## Simptom (aynan shu)
- Foydalanuvchi qisqa yoki yarim gapli so'rov beradi (masalan "o'shani qil", "push qilib qo'y", "faylni yangila", "skill yarat").
- Xavf past: noto'g'ri taxmin qaytarib bo'ladigan yoki kichik ish (fayl o'qish, oddiy commit, skill qo'shish, qidiruv).
- Agent "qaysi fayl?", "qaysi branch?", "aniq qanday formatda?" kabi savol beradi, taxmin qilmaydi.
- Hech qanday qaytarib bo'lmas yoki xavfli harakat (o'chirish, force push, maxfiy ma'lumot chiqarish) yo'q, lekin baribir savol so'ralgan.
- Foydalanuvchi "h" yoki qisqa javob bilan davom etishi kerak bo'lib qoladi.

## Sabab (100%)
Agent "aniqlik ustun" degan qoidani haddan tashqari qo'llaydi va instruction.md dagi "Ishla, so'rama" + "faqat natijani qaytarib bo'lmas xavfli ish yoki umuman tushunmasang so'ra" qoidasini e'tiborsiz qoldiradi. Kontekst, oldingi suhbat, odatlarni tahlil qilmasdan darhol savol beradi.

## Tasdiqlash
- So'rov noaniqmi, lekin bir nechta juda farqli va xavfli ma'no chiqmayaptimi?
- Noto'g'ri taxmin qilish qaytarib bo'lmas zarar keltiradimi? (agar yo'q — taxmin qilish kerak)
- Suhbat tarixi yoki foydalanuvchi odatlari (qisqa buyruqlar, shorthand) bor-yu, ulardan foydalanilmaganmi?
- Agent "aniqlashtirib bering" deb yozgan, lekin oqilona default (oxirgi loyiha, main branch, mavjud format) mavjudmi?

## Tuzatish (aynan shu)
Past xavfli holatlarda **taxmin qil va bajar**, savol so'rama:

1. Kontekstni tahlil qil: oxirgi loyiha, suhbat, foydalanuvchi odatlari (qisqa "push qil", "skill yarat" kabi).
2. Eng oqilona ma'noni tanla (masalan: oxirgi papka, main branch, architecture formatiga mos).
3. Ishni bajar.
4. Javobda bir jumlada taxminni ayt: "Oxirgi skill formatiga mos qilib yaratdim va push qildim."
5. Faqat quyidagi hollarda so'ra:
   - Umuman tushunmasang (bir nechta teng ehtimolli, butunlay boshqa narsa).
   - Noto'g'ri qilish qaytarib bo'lmas xavf (o'chirish, force, secret chiqarish, katta o'zgartirish).

Misol:
```
# Noto'g'ri:
Foydalanuvchi: "yangi skill qo'sh va push qil"
Agent: "Qaysi mavzuda? Qaysi papkaga? Commit xabari qanday bo'lsin?"

# To'g'ri:
Foydalanuvchi: "yangi skill qo'sh va push qil"
Agent: (architecture o'qib, mavjudlarni tekshirib, agent-workflows ga yangi skill qo'shib) "Agent workflow bo'yicha yangi skill qo'shdim va main'ga push qildim."
```

Qisqa buyruqlarni ("h", "davom et") to'liq javob deb qabul qil va darhol davom et.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Past xavfli noaniq so'rovlarda savol so'rama — oqilona taxmin qil va bajar.
- Faqat qaytarib bo'lmas xavf yoki umuman tushunmaslik holatida so'ra.
- Taxminingni bir jumlada aytib, ishni tugat. Bu tezroq va foydalanuvchiga qulayroq.
