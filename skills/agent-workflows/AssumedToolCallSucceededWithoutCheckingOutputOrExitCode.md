---
name: assumed-tool-success-without-check
description: Tool chaqiruvdan keyin natijani yoki exit code ni tekshirmasdan keyingi qadamga o'tish — bu xato holatga olib keladi. Tool qaytargan xatoni e'tiborsiz qoldirish.
---

# Tool muvaffaqiyatli deb taxmin qilish, natijasini tekshirmaslik

## Nima uchun bu skill kerak
Agentlar (va dasturchilar) tool yoki buyruq chaqirgandan so'ng, uning muvaffaqiyatli o'tganini avtomatik deb hisoblab, darhol keyingi ishga o'tishadi. Natijada tool xato qaytargan bo'lsa ham, noto'g'ri holatda davom etiladi va muammo chuqurlashadi.

## Simptom (aynan shu)
- Tool yoki bash buyrug'i chaqirilgandan keyin, uning chiqish matni (output) yoki exit code ko'rilmasdan keyingi amal bajariladi.
- Keyinroq "fayl yo'q", "push bo'lmadi", "clone xato" kabi holatlar yuzaga keladi, lekin agent "qildim" deb hisobot beradi.
- Xato xabari logda bor, lekin agent uni o'qimagan.

## Sabab (100%)
Agent tool javobini o'qishni "shart emas" deb hisoblaydi yoki faqat o'z rejasiga e'tibor qaratib, qaytgan natijani e'tiborsiz qoldiradi. Muvaffaqiyatni taxmin qiladi, tekshirmaydi.

## Tasdiqlash
- Tool chaqiruvdan keyin javob matnida "error", "failed", "exit code: 1" yoki bo'sh/noto'g'ri natija bormi?
- Keyingi qadam shu toolning natijasiga tayanadimi, lekin natija tekshirilmaganmi?
- Hisobotda "muvaffaqiyatli" deb yozilgan, lekin aslida xato bo'lganmi?

## Tuzatish (aynan shu)
Har bir tool chaqiruvidan keyin **majburiy** ravishda javobni o'qi va muvaffaqiyatni tasdiqla:

1. Bash/command uchun: exit code ni tekshir (0 bo'lishi kerak). Xato bo'lsa, to'xtab, xatoni foydalanuvchiga ayt.
2. Boshqa toollar uchun: qaytgan matnda xato belgilari bormi, kerakli ma'lumot keldimi — tekshir.
3. Faqat muvaffaqiyat tasdiqlangandan keyin keyingi qadamga o't.

Misol (bash):
```bash
# Noto'g'ri: chaqirib, darhol keyingisiga o'tish
git push origin main
# keyin hisobot yozish

# To'g'ri: natijani tekshirish
git push origin main
if [ $? -ne 0 ]; then
  echo "Push xato berdi, to'xtadim"
  exit 1
fi
# faqat shundan keyin davom et
```

Tool javobini o'qish:
- Agar tool "error" yoki "failed" qaytarsa — darhol to'xtab, xatoni ayt.
- Agar kutilgan fayl/ma'lumot yo'q bo'lsa — qayta urinib ko'r yoki xato deb hisobot ber.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Hech qachon tool yoki buyruq muvaffaqiyatli o'tdi deb taxmin qilma — har doim natija va exit code ni tekshir.
- Xato bo'lsa, "qildim" dema, aniq xatoni ayt va to'xtа.
- Bu oddiy qoida ko'p zanjirli xatolarning oldini oladi.
