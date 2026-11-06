---
name: agent-did-not-verify-clone-success-before-continuing
description: Agent git clone muvaffaqiyatli bo'lganini exit code yoki papka mazmunini tekshirmasdan keyingi qadamlarga o'tadi, natijada bo'sh yoki xato holatda ishlaydi.
---

# Clone muvaffaqiyatini tekshirmasdan davom etish

## Nima uchun bu skill kerak
Git clone buyrug'i ba'zan tarmoq, token yoki disk muammolari tufayli to'liq bajarilmaydi. Agent faqat "Cloning into..." matnini ko'rib muvaffaqiyat deb hisoblaydi va darhol `cd` + `ls` yoki fayl o'qishga o'tadi. Bu keyingi barcha qadamlarni noto'g'ri holatda bajarishga olib keladi.

## Simptom (aynan shu)
- `git clone` chaqiruvi qilingan.
- Tool outputida "Cloning into" bor, lekin exit code 0 ekanligi yoki yakuniy "done" xabari aniq tasdiqlanmagan.
- Agent darhol `cd /tmp/skills-repo && ls` yoki `cat architecture.md` qiladi.
- Agar clone yarim qolgan bo'lsa — "No such file", bo'sh papka yoki .git yo'q xatolari chiqadi.
- Hisobotda "clone muvaffaqiyatli" deb yoziladi, lekin keyingi xatolar bor.

## Sabab (100%)
Agent tool chaqiruvi output matniga qarab muvaffaqiyatni taxmin qiladi va exit code / katalog mavjudligini alohida tekshirmaydi. "Cloning into..." faqat boshlanganini bildiradi, tugaganini emas.

## Tasdiqlash
1. Oxirgi tool call `git clone ...` bormi?
2. Shu callning exit code yoki to'liq outputi o'qilganmi (xato yo'qmi)?
3. Keyingi buyruqdan oldin `ls /tmp/skills-repo` yoki `test -d /tmp/skills-repo/.git` qilinganmi?
4. Agar clone xato bersa, agent baribir "muvaffaqiyatli" deb davom etganmi?

## Tuzatish (aynan shu)
Clone dan keyin **majburiy** tekshir:

```bash
# Clone (tokenni hech qachon logga chiqarma)
git clone https://x-access-token:${TOKEN}@github.com/mrdevs2011/claude-skills-mr.git /tmp/skills-repo
echo "Exit code: $?"

# Muvaffaqiyatni tasdiqla
if [ ! -d /tmp/skills-repo/.git ]; then
  echo "CLONE FAILED: .git yo'q"
  exit 1
fi
ls -la /tmp/skills-repo | head -20
```

Faqat shu tekshiruvdan o'tgandan keyin `cd` va guideline o'qishga o't. Exit code 0 va `.git` papka mavjud bo'lmasa — aniq xatoni hisobotga yoz va to'xta.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- "Cloning into..." matni muvaffaqiyat emas.
- Har doim exit code va maqsadli papka (`.git` mavjudligi) tekshiriladi.
- Tekshiruvsiz davom etish keyingi barcha qadamlarni isrof qiladi.
