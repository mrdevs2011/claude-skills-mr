---
name: pushed-without-pulling-latest
description: Remote main (yoki boshqa branch) ga push qilishdan oldin pull/rebase qilmaslik — rejected push, non-fast-forward, yoki conflictlarga olib keladi.
---

# Remote'ga push qilishdan oldin pull yoki rebase qilmaslik

## Nima uchun bu skill kerak
Agentlar (yoki avtomatlashtirish) mahalliy o'zgarishlarni to'g'ridan-to'g'ri `git push origin main` qilishadi, remote'da yangi commitlar bo'lishi mumkinligini tekshirmasdan. Natijada push rad etiladi ("rejected", "non-fast-forward"), yoki force push qilib boshqalarning ishini o'chirib yuborish xavfi paydo bo'ladi.

## Simptom (aynan shu)
- `git push origin main` (yoki boshqa branch) chaqiriladi.
- Remote "Updates were rejected because the remote contains work that you do not have locally" yoki "non-fast-forward" xatosi chiqadi.
- Agent darhol force push (`--force`) qilishni taklif qiladi yoki qiladi.
- Yoki push muvaffaqiyatsiz bo'lib, agent "push bo'ldi" deb noto'g'ri hisobot beradi.

## Sabab (100%)
Agent local repo holatini "eng so'nggi" deb taxmin qiladi va remote'ni tekshirmaydi. `git status`, `git fetch`, yoki `git pull --rebase` qilmasdan to'g'ridan-to'g'ri push qiladi. Parallel ishlayotgan boshqa agentlar yoki odamlar remote'ga yangi commit qo'shgan bo'lishi mumkinligini e'tiborsiz qoldiradi.

## Tasdiqlash
- Pushdan oldin `git fetch origin` yoki `git status` qilinganmi? Remote ahead/behind ko'rsatilganmi?
- Push xato berganmi: "rejected" / "non-fast-forward" / "fetch first"?
- Force push ishlatilganmi yoki taklif qilinganmi?

## Tuzatish (aynan shu)
Pushdan **oldin** har doim remote holatini yangila va integratsiya qil:

1. `git fetch origin` qil.
2. `git status` bilan ahead/behind ni tekshir.
3. Agar remote'da yangi commitlar bo'lsa: `git pull --rebase origin main` (yoki mos branch).
4. Conflict chiqsa, ularni hal qil, keyin davom et.
5. Faqat shundan keyin `git push origin main`.
6. Force push faqat aniq, xavfsiz holatda (va foydalanuvchi ruxsati bilan) ishlatilsin — default emas.

Misol (to'g'ri ketma-ketlik):
```bash
git fetch origin
git status                    # "Your branch is behind" yoki "ahead" ni ko'r
git pull --rebase origin main # yangi o'zgarishlarni integratsiya qil
# agar conflict bo'lsa — hal qil, git add, git rebase --continue
git push origin main
```

Agar push rad etilsa — force qilma, avval pull/rebase qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Pushdan oldin doim `fetch` + `pull --rebase` qil.
- Remote'da yangi ish bo'lishi mumkinligini hisobga ol.
- Force pushni default qilma — faqat aniq zarurat va ruxsat bilan.
- Bu oddiy qadam rejected push va yo'qolgan commitlarning oldini oladi.
