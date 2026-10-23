---
name: agent-reported-skill-push-without-verifying-commit-and-push
description: Agent yangi skill yaratib push qilgandan so'ng, commit hash va git push chiqishini tekshirmasdan "muvaffaqiyatli" deb hisobot beradi — haqiqatda push xato bo'lgan yoki commit bo'lmagan bo'lishi mumkin.
---

# Skill push qilingandan so'ng commit hash va push natijasini tekshirmasdan success deb hisobot berish

## Nima uchun bu skill kerak
Skill generator vazifasida oxirgi qadam — aniq commit hash va push muvaffaqiyatli ekanini hisobot qilish. Agent ba'zan `git commit` va `git push` ni chaqiradi, lekin chiqishni o'qimaydi yoki exit code ni e'tiborsiz qoldiradi. Natijada foydalanuvchiga "success" deyiladi, lekin remote da o'zgarish yo'q yoki commit bo'lmagan.

## Simptom (aynan shu)
- Hisobotda "push muvaffaqiyatli" yoki "skill qo'shildi" deyilgan.
- Aniq commit hash (masalan `a1b2c3d`) ko'rsatilmagan yoki noto'g'ri.
- `git push` chiqishida xato (rejected, authentication failed, conflict) bo'lgan, lekin e'tiborsiz qoldirilgan.
- Local commit bor, lekin `origin/main` da ko'rinmaydi.
- Tool chiqishi o'qilmagan, faqat "exit 0" deb taxmin qilingan.

## Sabab (100%)
Agent tool chaqiruvini "chidirildi" deb hisoblaydi va natija matnini to'liq tahlil qilmaydi. `git push` muvaffaqiyatli bo'lsa ham hash ni `git rev-parse HEAD` yoki commit chiqishidan olishni unutadi. Yoki background/timeout holatida to'liq chiqishni kutmaydi.

## Tasdiqlash
1. `git log -1 --oneline` yoki `git rev-parse --short HEAD` chiqishi hisobotdagi hash bilan mos keladimi?
2. `git push` tool chiqishida "main -> main" yoki shunga o'xshash muvaffaqiyat matni bormi? Xato matni yo'qmi?
3. `git status` "Your branch is up to date with 'origin/main'" deb ko'rsatadimi?
4. Hisobotda aniq hash va "push muvaffaqiyatli" so'zlari bormi?

## Tuzatish (aynan shu)
Har doim quyidagi ketma-ketlikni bajaring:

1. `git add . && git commit -m "Add new skill: [name] - [description]"` ni chaqir va chiqishni o'qi.
2. Darhol `git push origin main` ni chaqir. Chiqishni to'liq o'qi — xato bo'lsa, aniq xato matnini hisobotga yoz, "success" dema.
3. Muvaffaqiyatli bo'lsa, hash olish uchun:
   ```bash
   git rev-parse --short HEAD
   ```
   yoki commit chiqishidan olingan hashni ishlat.
4. Oxirgi hisobotda **majburiy**:
   - Skill nomi
   - O'qilgan qo'llanmalar (architecture.md, instruction.md, style.md)
   - Commit hash
   - Push muvaffaqiyatli (yoki aniq xato)

Hech qachon tool chiqishini o'qimasdan success deb yozma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Skill push hisobotida aniq commit hash va push chiqishini tekshirish majburiy.
- Tool exit code yoki chiqish matnini e'tiborsiz qoldirish — noto'g'ri success hisobotiga olib keladi.
- Remote holatini tasdiqlamasdan "qo'shildi" demang.
