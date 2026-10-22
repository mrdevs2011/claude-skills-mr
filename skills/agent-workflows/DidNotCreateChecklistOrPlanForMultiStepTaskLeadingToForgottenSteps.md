---
name: multi-step-task-without-plan-checklist
description: Murakkab ko'p qadamli vazifada (bir nechta fayl, tool, o'zgarish) reja yoki checklist tuzmasdan darhol bajarishni boshlash — natijada ba'zi qadamlar unutiladi, ortiqcha ish qilinadi yoki vazifa to'liq yakunlanmaydi.
---

# Murakkab vazifada reja/checklist tuzmasdan boshlash

## Nima uchun bu skill kerak
Agentlar murakkab vazifalarda (masalan, yangi feature, refactor, bir nechta skill yaratish va push, bir nechta bog'liq o'zgarish) darhol kod yoki tool chaqirishni boshlaydilar. Natijada qadamlar tashlab ketiladi, tartib buziladi yoki yakunda "nimani unutdim" holati yuzaga keladi. Bu productivity va ishonchlilikni pasaytiradi. Faqat oddiy bitta qadamli ishlar uchun reja shart emas. Bu skill debugging emas, balki agent ish oqimi va productivity uchun.

## Simptom (aynan shu)
- Vazifa tugagach, foydalanuvchi "shu qismni ham qil", "README ni yangilamading" yoki "push qilmading" deb eslatadi.
- Agent o'z javobida "keyin buni qilaman" deb aytadi, lekin unutadi.
- Bir nechta bog'liq o'zgarishlar (skill fayl + README yangilash + git commit/push + tekshirish) dan faqat bir qismi bajariladi.
- Agent "boshqa nima qilish kerak edi?" deb so'raydi yoki qayta o'qib aniqlaydi.
- Oxirgi hisobotda barcha qadamlar to'liq emas.

## Sabab (100%)
Agent vazifani bir butun deb qabul qilib, ichki qadamlarni oldindan yozib chiqmasdan, birinchi o'yinda kelgan tool yoki edit bilan boshladi. Working memory (kontekst) cheklanganligi sababli oraliq qadamlarni eslab qolmadi. "Ishla, so'rama" qoidasini haddan tashqari qo'llab, rejalashtirishni e'tiborsiz qoldirdi.

## Tasdiqlash
- Vazifa tavsifida 3+ mustaqil yoki bog'liq qadam bor (fayl yaratish, hujjat yangilash, git operatsiya, tekshirish, hisobot).
- Agentning birinchi tool chaqiruvi reja/todo/checklist emas, darhol implementatsiya (write, edit, git).
- Oxirida biror qadam bajarilmaganligi ma'lum bo'ladi yoki foydalanuvchi eslatadi.

## Tuzatish (aynan shu)
1. Murakkab vazifani qabul qilgach (3+ qadam), avval qisqa checklist tuz va uni o'zingga yoki javobda yoz:
   - [ ] Qo'llanmalarni o'qi (architecture.md, instruction.md, style.md)
   - [ ] Mavjud skilllarni qidir (duplicate yo'qligini tekshir)
   - [ ] Yangi skill faylini yoz va skills/ ga qo'sh
   - [ ] README.md struktura ro'yxatini yangila
   - [ ] .gitignore va .env ni tekshir/yarat
   - [ ] git config, add, commit, push
   - [ ] Natijani (nom, hash, muvaffaqiyat) hisobot qil
2. Har bir qadamni belgilab, bajarilgach [x] qil yoki o'chirib tashla.
3. Agar qadamlar mustaqil bo'lsa, parallel tool chaqirish mumkin, lekin bog'liqlarni (masalan, fayl yozilgach README yangilash) saqla.
4. Oddiy bitta qadamli ishlar uchun bu shart emas — to'g'ridan-to'g'ri bajar.

Misollar: skill yaratish, multi-file refactor, deploy tayyorlash jarayonlarida shu tartibda harakat qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Murakkab (3+ qadamli) vazifalarda avval qisqa checklist tuz.
- Har qadamni aniq belgilab, unutishni oldini ol va productivity ni oshir.
- Bu "nima unutildi" holatini kamaytiradi va to'liq bajarilishni ta'minlaydi.
