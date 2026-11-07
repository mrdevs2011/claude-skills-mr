---
name: agent-used-bash-echo-or-cat-to-write-file-content-instead-of-write-file-tool-causing-escaping-and-error-prone-creation
description: When agent needs to create a new file with multi-line content (skill markdown, config, script) and uses bash echo/cat heredoc instead of the dedicated write_file tool, leading to quoting/escaping bugs, incomplete writes, or unnecessary shell dependency.
---

# Agent Used Bash Echo Or Cat To Write File Content Instead Of Write File Tool

## Nima uchun bu skill kerak
write_file tool to'g'ridan-to'g'ri, xavfsiz va escaping muammosiz fayl yozadi. Bash orqali echo/cat ishlatish qo'shimcha qatlam, xato ehtimolini oshiradi va tool tanlash qoidasini buzadi.

## Simptom (aynan shu)
Agent yangi SKILL.md yoki boshqa fayl yaratishi kerak bo'lganda `echo 'content' > file` yoki `cat > file << EOF` ishlatadi, natijada:
- Qo'shtirnoq/escape xatolari
- Ko'p qatorli matn buziladi
- Tool chiqishida content to'liq ko'rinmaydi yoki xato beradi

## Sabab (100%)
Agent dedicated file tools (write_file, edit_file) o'rniga general bash'ni tanladi. Bu "har narsani bash bilan qilish" odatidan kelib chiqadi, lekin repo va tool qoidalari buni taqiqlaydi yoki tavsiya etmaydi.

## Tasdiqlash
- Bash komandasi `echo`, `printf` yoki `cat >` bilan fayl yozishni o'z ichiga olgan.
- write_file tool chaqirilmagan.
- Natijada fayl contentida escape artefaktlari yoki to'liq emas.

## Tuzatish (aynan shu)
1. Kontentni to'liq tayyorla (markdown, kod).
2. write_file tool chaqir:
   - file_path: to'liq yo'l
   - content: to'liq matn (escaping yo'q)
3. Keyin kerak bo'lsa read_file bilan tekshir.
4. Bash faqat git, ls, test kabi operatsiyalar uchun.

Misol:
```python
# Noto'g'ri
bash: echo -e 'line1\nline2' > skills/foo.md

# To'g'ri
write_file(file_path="skills/productivity/NewSkill.md", content="---\nname: ...\n---\n# Title\n...")
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Fayl yaratish uchun doim write_file (yoki edit_file) ishlat. Bash echo/cat faqat oxirgi chora yoki oddiy shell vazifalari uchun. Bu xatolarni kamaytiradi va qoidalarga mos.
