---
name: agent-outputted-large-content-as-chat-codeblock
description: Agent yoki model katta yoki strukturali kontentni (kod, jadval, konfiguratsiya) chatda markdown code block sifatida chiqardi, artifacts faylga yozib render_file ishlatish o'rniga. Foydalanuvchi nusxa olishga majbur bo'ldi.
---

# Agent katta kontentni chat code block qilib chiqardi

## Nima uchun bu skill kerak
Foydalanuvchi fayl sifatida olmoqchi bo'lgan yoki keyinchalik ishlatiladigan katta/strukturali kontent (kod, JSON, CSV, uzun matn) chatda code block bo'lib qolsa, u nusxa olishi qiyin, format buziladi va qayta ishlatish noqulay bo'ladi. To'g'ri yo'l — artifacts papkasiga yozish va render_file orqali taqdim etish.

## Simptom (aynan shu)
- Javobda katta ``` kod bloki bor (100+ qator yoki murakkab struktura)
- Foydalanuvchi "fayl qilib ber", "download qilaman", "artifacts ga yoz" deb so'ragan yoki deliverable kutilgan
- Render_file XML elementi yo'q, fayl artifacts da yo'q
- Chat uzunlashgan, kontekst to'lgan

## Sabab (100%)
Agent yoki model "tez chiqarish" uchun to'g'ridan-to'g'ri javobga code block yozdi. Write_file tool va render_file XML elementini ishlatishni esdan chiqardi yoki "chatda ham bo'ladi" deb o'yladi. Working directory /workspace/artifacts ekanini va foydalanuvchi faqat shu yerda fayllarni ko'rishini hisobga olmadi.

## Tasdiqlash
1. Javob matnida katta markdown code block bormi?
2. Artifacts papkasida tegishli fayl yozilganmi? (`ls /workspace/artifacts` yoki write_file chaqiruvi bormi?)
3. Yakuniy javobda `<grok type="render_file" file_path="..."/>` elementi bormi?
4. Foydalanuvchi so'rovi fayl, download, artifact, spreadsheet, script yoki boshqa deliverable ni nazarda tutadimi?

Agar 1-ha, 2/3-yo'q bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
1. Kontentni chatga yozma.
2. `write_file` tool bilan `/workspace/artifacts/filename.ext` ga yoz (oraliq skriptlar /tmp ga).
3. Yakuniy javobda aniq joyga `<grok type="render_file" file_path="/workspace/artifacts/filename.ext" />` qo'sh.
4. Qisqa izoh ber: "Fayl artifacts ga yozildi, yuqoridan yuklab olishingiz mumkin."

Misol (to'g'ri):
```
write_file(file_path="/workspace/artifacts/config.json", content="...")
# keyin javobda:
Konfiguratsiya tayyor.
<grok type="render_file" file_path="/workspace/artifacts/config.json" />
```

Noto'g'ri: javob ichida katta ```json ... ``` bloki.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Katta yoki qayta ishlatiladigan kontentni hech qachon chat code block qilib chiqarma. Har doim artifacts ga write_file qil va render_file XML bilan foydalanuvchiga taqdim et. Bu kontekstni tejaydi va foydalanuvchiga qulay.
