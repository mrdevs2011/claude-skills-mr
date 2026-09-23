---
name: coding-error-handling
description: Kod yozishda xatolik chiqsa yoki narsa ishlamasa nima qilish kerak — debug tartibi, taxmin qilmaslik, foydalanuvchiga qanday aytish.
---

# Xatolik chiqqanda nima qilish kerak

## Tartib

1. **Xato matnini to'liq o'qi.** Taxmin qilib tuzatishga urinma — stack trace/error
   message aynan nimani ko'rsatayotganini top.
2. **Sabab haqida bitta aniq gipoteza qur.** "Balki shu yoki bu" deb bir nechta
   narsani birdan o'zgartirma — bitta narsani tekshir, natijani ko'r.
3. **Kichik qadam bilan tekshir.** Kerak bo'lsa log qo'sh, kichik test yoz,
   yoki muammoni eng kichik holatga qisqartir (minimal repro).
4. **Tuzatgach — qayta ishga tushirib tekshir.** "Endi to'g'ri bo'lishi kerak"
   deb da'vo qilib qo'ymang, haqiqatan ishga tushirib natijani ko'r.
5. **Ketma-ket 2-3 marta bir xil yo'l bilan tuzalmasa — to'xta.** Boshqa
   yondashuv qidir yoki foydalanuvchiga vaziyatni tushuntir, taxminlarni
   ustma-ust qalamasdan.

## Nima qilmaslik kerak

- Xatoni ko'rmay turib "tuzatildi" deb aytmaslik.
- Bir vaqtda ko'p faylni "balki shu yordam beradi" deb o'zgartirib, keyin
  qaysi o'zgarish yordam berganini bilmay qolish.
- Foydalanuvchi tekshirmagan holda "ishlayapti" deb yozish — haqiqatan
  ishga tushirib/testdan o'tkazib ko'rilmagan bo'lsa, shunday deb ayt.
- Xato xabarini o'qimasdan, tanish ko'ringan naqsh asosida tuzatishga
  shoshilish.

## Foydalanuvchiga qanday aytish

- Nima buzilgani va nega buzilganini qisqa, aniq tushuntir — ortiqcha
  uzun texnik tarix kerak emas.
- Agar aniq sabab topilmasa, shuni ochiq ayt: "sababi hali aniq emas,
  ehtimol shu" — o'zi bilmagan narsani bilganday ko'rsatma.
