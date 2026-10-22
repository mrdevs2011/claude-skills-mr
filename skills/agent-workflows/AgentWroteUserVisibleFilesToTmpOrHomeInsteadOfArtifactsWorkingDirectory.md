---
name: wrote-files-to-tmp-instead-of-artifacts
description: User-visible deliverables (reports, images, data files, generated docs) were written to /tmp, $HOME, or other non-working paths instead of the designated /workspace/artifacts directory — user cannot see or download them easily.
---

# Agent foydalanuvchiga ko'rinadigan fayllarni /tmp yoki $HOME ga yozdi, artifacts o'rniga

## Nima uchun bu skill kerak
Agent muhitida user-visible fayllar uchun maxsus working directory `/workspace/artifacts` belgilangan. Bu yerga yozilgan fayllar foydalanuvchi interfeysida ko'rinadi va yuklab olish mumkin. /tmp, $HOME yoki boshqa joylarga yozish natijada fayl "yo'qoladi" yoki foydalanuvchi topa olmaydi. Bu productivity va agent workflow qoidasiga zid — deliverable'lar to'g'ri joyda bo'lishi shart.

## Simptom (aynan shu)
- Yangi fayl (PDF, image, CSV, HTML report, generated code, etc.) `write_file`, `bash` yoki boshqa usul bilan yaratilgan, lekin path `/tmp/...`, `/home/...`, yoki `artifacts/` subfolder ichida.
- Foydalanuvchi "faylni ko'rmayapman", "yuklab ololmayapman" deydi yoki UI da fayl chiqmaydi.
- Agent "fayl yaratildi: /tmp/report.pdf" deb hisobot beradi.
- `render_file` ishlatilganda path noto'g'ri bo'ladi yoki ishlamaydi.
- Working directory `/workspace/artifacts` ekanligi e'tiborsiz qoldirilgan.

## Sabab (100%)
Agent tizim promptidagi "Working directory: /workspace/artifacts" va "Save deliverables directly in it — never under $HOME and never in a new artifacts/ subfolder" qoidasini o'qimagan yoki e'tiborsiz qoldirgan. Oddiy `os.getcwd()` yoki default path o'rniga aniq `/workspace/artifacts` yoki relative path ishlatilmagan. Ba'zan "vaqtincha" deb /tmp ga yozib, keyin ko'chirishni unutgan.

## Tasdiqlash
- `bash` yoki tool logida fayl path ni tekshir: `/tmp` yoki `$HOME` bormi?
- `ls /workspace/artifacts` da yangi fayl yo'qmi, lekin boshqa joyda bormi?
- Foydalanuvchi render_file yoki UI da faylni ko'ra olmaydimi?
- Agent javobida absolute path `/tmp/...` yoki `/home/...` ko'rsatilganmi?

## Tuzatish (aynan shu)
1. Har doim user-visible fayl yaratishdan oldin working directory ni tasdiqla:
   ```bash
   pwd  # /workspace/artifacts bo'lishi kerak
   ```
2. Faylni to'g'ridan-to'g'ri shu yerga yoz:
   - `write_file` uchun path: `report.pdf` yoki `/workspace/artifacts/report.pdf`
   - Python/bash da: `open('/workspace/artifacts/output.csv', 'w')` yoki relative.
3. Hech qachon `/tmp` ga "vaqtincha" yozib qoldirma. Agar intermediate kerak bo'lsa, oxirida `mv /tmp/temp.pdf /workspace/artifacts/final.pdf`.
4. Subfolder yaratma: `artifacts/reports/` emas, to'g'ridan-to'g'ri `reports.pdf` yoki kerak bo'lsa `mkdir -p subdir` lekin asosiy deliverable rootda.
5. Yakuniy javobda `render_file` ishlatishdan oldin path ni tekshir: absolute yoki relative to artifacts.

Misol (to'g'ri):
```python
# Correct
with open('/workspace/artifacts/summary.md', 'w') as f:
    f.write(content)
```

Noto'g'ri:
```python
# Wrong
with open('/tmp/summary.md', 'w') as f:
    f.write(content)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
User-visible fayllar faqat `/workspace/artifacts` ga yoziladi. /tmp va $HOME foydalanuvchi ko'rmaydi. Har bir deliverable uchun pathni aniq shu directory ga qo'y va `render_file` bilan ko'rsat.
