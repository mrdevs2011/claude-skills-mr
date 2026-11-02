---
name: agent-used-bash-for-simple-file-ops-instead-of-dedicated-tools
description: Agent oddiy fayl o'qish, yozish yoki tahrirlash uchun bash (cat, echo, tee) ishlatdi — read_file, write_file yoki edit_file tool'lari aniqroq, xavfsizroq va loglarda tushunarliroq edi.
---

# Oddiy fayl operatsiyalari uchun bash ishlatish

## Nima uchun bu skill kerak
Bash orqali fayl bilan ishlash (cat, echo > file, sed) xato chiqishida yoki loglarda chalkashlik keltiradi, escape muammolari bor, va maxsus tool'lar (read_file, write_file, edit_file) avtomatik limit, offset va xavfsizlikni ta'minlaydi. Agent to'g'ri tool'ni tanlamasa, ish sekinlashadi va natija ishonchsiz bo'ladi.

## Simptom (aynan shu)
- Fayl mazmunini olish uchun `bash` + `cat` yoki `head` ishlatilgan.
- Yangi fayl yozish uchun `echo '...' > file` yoki `tee` ishlatilgan.
- Mavjud faylni o'zgartirish uchun `sed` yoki `bash` orqali qayta yozilgan.
- read_file / write_file / edit_file tool'lari mavjud edi, lekin ishlatilmagan.
- Natijada escape muammosi, truncated output yoki noaniq log chiqgan.

## Sabab (100%)
Agent "bash hamma narsani qila oladi" deb taxmin qildi va maxsus fayl tool'larining afzalliklarini (structured output, automatic truncation handling, safer edits) hisobga olmadi. Oddiy operatsiya uchun eng yengil va aniq tool'ni tanlamadi.

## Tasdiqlash
1. Vazifa faqat fayl o'qish/yozish/tahrirlashmi?
2. read_file, write_file yoki edit_file tool'lari mavjudmi?
3. Agar ha — bash ishlatilgan bo'lsa, noto'g'ri tanlov. Maxsus tool ishlatilishi kerak edi.

## Tuzatish (aynan shu)
Oddiy fayl operatsiyalari uchun doim maxsus tool'larni ishlat:

- O'qish: `read_file` (limit, offset bilan)
- Yozish (yangi yoki overwrite): `write_file`
- Aniq o'zgartirish: `edit_file` (old_string / new_string)

Noto'g'ri:
```bash
cat /tmp/skills-repo/architecture.md
echo "content" > newfile.md
```

To'g'ri:
```python
# read_file tool
read_file(file_path="/tmp/skills-repo/architecture.md", limit=100)

# write_file tool
write_file(file_path="skills/new-skill.md", content="...")
```

Bash faqat murakkab shell pipeline, git, yoki tool'da yo'q operatsiyalar uchun qoldiriladi. Har doim `description` parametrini to'ldir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy fayl o'qish, yozish va tahrirlash uchun read_file, write_file va edit_file ishlat. Bash faqat ular yetarli bo'lmaganda. Bu aniqroq, xavfsizroq va loglarda tushunarliroq ish oqimini beradi.
