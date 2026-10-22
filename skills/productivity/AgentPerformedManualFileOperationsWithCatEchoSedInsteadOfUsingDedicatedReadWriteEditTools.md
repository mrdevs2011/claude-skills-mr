---
name: agent-performed-manual-file-ops-with-shell-instead-of-dedicated-tools
description: Agent uses cat/echo/sed via bash for reading, writing or editing text files when dedicated read_file, write_file or edit_file tools exist and are safer.
---

# AgentPerformedManualFileOperationsWithCatEchoSedInsteadOfUsingDedicatedReadWriteEditTools

## Nima uchun bu skill kerak
Maxsus fayl tool'lari (read_file, write_file, edit_file) mavjud muhitda shell orqali oddiy fayl operatsiyalarini bajarish xatolarga, to'liq kontekst yo'qolishiga va token isrofiga olib keladi. Bu skill aynan shu holatni tuzatish uchun.

## Simptom (aynan shu)
- Fayl mazmunini ko'rish uchun `cat file.md` yoki `head`/`tail` ishlatilgan.
- Yangi fayl yaratish yoki butunlay qayta yozish uchun `echo 'content' > file` yoki `cat <<EOF > file` ishlatilgan.
- Qisman o'zgartirish uchun `sed -i` yoki `awk` ishlatilgan.
- Natijada: truncation, encoding muammolari, yoki keyingi tool chaqiruvlari eski holatni ko'rmaydi.
- read_file / write_file / edit_file tool'lari mavjud bo'lsa ham ishlatilmagan.

## Sabab (100%)
Agent shell buyruqlariga o'rganib qolgan va maxsus tool'larning mavjudligi, xavfsizligi va to'liq natija qaytarishini tekshirmagan. Shell orqali ishlash "oddiy" tuyulgan, lekin dedicated tool'lar limit, offset, aniq edit va xato xabarlarini yaxshiroq beradi.

## Tasdiqlash
1. Tool ro'yxatida `read_file`, `write_file`, `edit_file` borligini tasdiqla.
2. Bash chaqiruvida `cat`, `echo >`, `sed -i` kabi fayl o'qish/yozish buyruqlari ishlatilganini ko'r.
3. Xuddi shu vazifa dedicated tool bilan bajarilishi mumkinligini tekshir.

## Tuzatish (aynan shu)
Faqat matn fayllari uchun dedicated tool'lardan foydalan:

- O'qish: `read_file` (limit/offset bilan katta fayllar uchun).
- Yozish (yangi yoki to'liq qayta yozish): `write_file`.
- Qisman tahrir: avval `read_file`, keyin `edit_file` (old_string aniq bo'lishi shart).

Shell faqat quyidagi holatlarda:
- Binary fayllar, arxiv, process, git, network.
- Dedicated tool yetarli bo'lmaganda (masalan, murakkab pipeline).

Misoli (noto'g'ri):
```bash
cat skills/productivity/example.md
echo "new content" > skills/productivity/example.md
```

To'g'ri:
- read_file(file_path="skills/productivity/example.md")
- write_file(file_path="skills/productivity/example.md", content="new content")

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Matn fayllarini o'qish, yozish va tahrirlash uchun har doim dedicated tool'larni afzal ko'r. Shell faqat maxsus holatlarda. Bu xatolarni kamaytiradi va contextni toza saqlaydi.
