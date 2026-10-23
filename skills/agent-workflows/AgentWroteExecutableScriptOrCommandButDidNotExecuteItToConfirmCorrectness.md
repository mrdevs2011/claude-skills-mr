---
name: agent-wrote-script-without-executing
description: Agent bash, python yoki boshqa executable skript/buyruq yozdi, lekin uni ishga tushirib natijasini tekshirmasdan "tayyor" deb hisobot berdi — xato yoki noto'g'ri chiqish bo'lishi mumkin.
---

# Agent executable skript yoki buyruq yozdi, lekin uni ishga tushirib tasdiqlamadi

## Nima uchun bu skill kerak
Agentlar ko'pincha "mana skript" yoki "shu buyruqni ishga tushiring" deb yozib, o'zlari run qilmaydi. Natijada sintaksis xatosi, noto'g'ri yo'l, missing dependency yoki mantiqiy xato ishga tushganda chiqadi. Bu ayniqsa automation, git, fayl operatsiyalari va tool wrapperlarda keng tarqalgan.

## Simptom (aynan shu)
- Agent .sh, .py, uzun bash one-liner yoki python -c yozdi.
- "Ishga tushiring" yoki "bu ishlaydi" deb yozdi, lekin o'zi terminalda run qilmadi.
- Hisobotda "skript tayyor" yoki "buyruq bajarildi" deb aytdi, lekin chiqish (stdout/stderr/exit code) ko'rsatilmagan.
- Keyinchalik foydalanuvchi ishga tushirganda xato chiqadi.

## Sabab (100%)
Agent skriptni yozishni yakuniy qadam deb hisoblaydi va "men yozdim, demak to'g'ri" degan taxmin qiladi. Tool orqali (bash, python) o'zi ishga tushirib tekshirishni unutadi yoki "kerak emas" deb o'tkazib yuboradi. Natijada runtime xatolari yashirin qoladi.

## Tasdiqlash
1. Agent yozgan skript/buyruq bormi?
2. Shu skriptni o'zi bash/python tool orqali ishga tushirganmi?
3. Tool natijasida exit code 0 va kutilgan stdout bormi?
4. Agar xato bo'lsa, agent uni tuzatib qayta run qilganmi?
5. Hisobotda "run qildim, natija: ..." degan dalil bormi?

## Tuzatish (aynan shu)
Yozilgan skript yoki buyruqni darhol ishga tushir va natijasini tekshir:

```bash
# Noto'g'ri (faqat yozish):
# echo "#!/bin/bash\necho hello" > /tmp/test.sh
# "Skript tayyor, ishga tushiring"

# To'g'ri (yozish + run + tekshirish):
cat > /tmp/test.sh << 'SCRIPT'
#!/bin/bash
echo "hello from script"
exit 0
SCRIPT
chmod +x /tmp/test.sh
bash /tmp/test.sh
# yoki
python3 -c 'print("verified")'
```

Agar xato chiqsa — tuzat, qayta run qil, keyin "tasdiqlandi" de.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har qanday yozilgan executable (bash, python, node va h.k.) ni o'zi ishga tushirib, exit code va chiqishini tekshirmasdan "tayyor" deb hisobot bermaslik. Bu yashirin runtime xatolarni oldini oladi.
