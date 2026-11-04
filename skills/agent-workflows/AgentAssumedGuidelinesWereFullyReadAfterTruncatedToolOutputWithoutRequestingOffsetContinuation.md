---
name: agent-assumed-full-read-after-truncated-output-without-offset-continuation
description: Agent receives truncated output from read_file or similar tool on large guideline files (architecture.md, instruction.md) but assumes the content is complete and proceeds without requesting the remaining lines via offset, leading to missed rules.
---

# AgentAssumedGuidelinesWereFullyReadAfterTruncatedToolOutputWithoutRequestingOffsetContinuation

## Nima uchun bu skill kerak
Katta qo'llanma fayllari (architecture.md 200+ qator, instruction.md 500+ qator) tool orqali o'qilganda ko'pincha truncated bo'ladi. Agent "o'qidim" deb hisoblab qolgan qoidalarni (format, kategoriya, commit tartibi) o'tkazib yuboradi. Natijada skill noto'g'ri formatda yoziladi yoki muhim qadamlar bajarilmaydi.

## Simptom (aynan shu)
- Tool natijasida "[truncated: showing first/last ...; full output at: ...]" yoki "file has N total lines; showing lines 1-M" xabari bor.
- Agent shu truncated qismdan keyin darhol skill yozishga o'tadi.
- Oxirgi qoidalarni (masalan, README yangilash, yangi kategoriya qo'shish tartibi, 6 ta majburiy bo'lim) bilmaydi.
- Yaratilgan skill architecture.md dagi to'liq talablarga mos kelmaydi.

## Sabab (100%)
Agent tool natijasini "to'liq fayl" deb qabul qiladi. Truncation ogohlantirishini e'tiborsiz qoldiradi va `offset` parametri bilan davom ettirishni rejalashtirmaydi. "Asosiy qismni o'qidim" deb o'ylaydi.

## Tasdiqlash
1. Tool natijasida truncation xabari bormi? (masalan, "showing lines 1-144" va "file has 212 total lines")
2. Agent keyin `read_file` ni `offset` bilan chaqirdimi?
3. Agar chaqirmagan bo'lsa — bu holat. Qolgan qismni o'qimasdan davom etgan.

## Tuzatish (aynan shu)
Truncation ko'rinsa, darhol offset bilan qolganini o'qi. Parallel yoki ketma-ket chaqir.

Noto'g'ri:
```text
# Birinchi chaqiruv truncated qaytardi
read_file architecture.md  # lines 1-144
# Agent: "yetarli, skill yozaman"
```

To'g'ri:
```text
# Birinchi
read_file architecture.md limit=200

# Agar "file has 212 total lines" desa
read_file architecture.md offset=145 limit=100
```

Yoki bir nechta parallel:
- architecture.md offset=1
- architecture.md offset=145
- instruction.md offset=1
- style.md

Qoida: "truncated" yoki "showing lines X-Y of N" ko'rsang, N ga yetguncha offset bilan o'qi. Faqat shundan keyin "100% amal qildim" de.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Katta fayl o'qilganda truncation xabarini hech qachon e'tiborsiz qoldirma. Doim offset bilan to'liq o'qi. Aks holda muhim qoidalar (skill formati, kategoriya, hisobot talablari) yo'qoladi va skill sifati tushadi.
