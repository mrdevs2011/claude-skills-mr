---
name: agent-wrote-intermediate-scripts-into-artifacts-instead-of-tmp
description: Agent places intermediate generation scripts, temp helpers, or build files directly into the user-visible /workspace/artifacts (or working dir) instead of /tmp, so the user sees unwanted junk files alongside real deliverables.
---

# AgentWroteIntermediateGenerationScriptsIntoArtifactsFolderInsteadOfTmpCausingUserVisibleJunk

## Nima uchun bu skill kerak
Ish papkasi (/workspace/artifacts) foydalanuvchi ko'radigan joy — faqat yakuniy deliverable (docx, pdf, image, report va h.k.) qolishi kerak. Oraliq skriptlar, generate.py, temp data, build artefactlar u yerda qolsa, foydalanuvchi keraksiz fayllarni ko'radi, tartib buziladi va keyingi ishlarda chalkashlik paydo bo'ladi. Environment qoidasi: "Put intermediate generation scripts in /tmp."

## Simptom (aynan shu)
- /workspace/artifacts ichida generate_*.py, temp_*, build_*, helper_*.sh, .tmp yoki boshqa oraliq fayllar paydo bo'lgan.
- Foydalanuvchi "nima bu fayllar?" deb so'raydi yoki render_file da keraksiz narsalar chiqadi.
- Hisobotda faqat yakuniy fayl haqida gapirilgan, lekin artifacts da boshqa fayllar ham bor.
- Skript yozilgan va ishlatilgan, lekin /tmp ga emas, working dir ga yozilgan.

## Sabab (100%)
Agent "hammasi bir joyda bo'lsin" yoki "qulay" deb oraliq narsalarni to'g'ridan-to'g'ri artifacts ga yozadi. U environment info dagi "intermediate generation scripts in /tmp" qoidasini e'tiborsiz qoldiradi va yakuniy holatni tekshirmaydi.

## Tasdiqlash
1. `ls -la /workspace/artifacts` — faqat kerakli deliverable bormi?
2. Oraliq skriptlar /tmp da bormi (`ls /tmp/*.py /tmp/gen_*`)?
3. Hisobotda "artifacts da faqat yakuniy fayl qoldirildi" deyilganmi?

## Tuzatish (aynan shu)
1. Har qanday oraliq skript, generator, temp data yoki build faylini **faqat /tmp** ga yoz:
   ```bash
   # To'g'ri
   cat > /tmp/generate_report.py << 'PY'
   # ... kod ...
   PY
   python /tmp/generate_report.py
   # Natijani artifacts ga ko'chir
   mv /tmp/output.docx /workspace/artifacts/final-report.docx
   ```
2. Ish tugagandan keyin /tmp dagi keraksiz narsalarni tozala (yoki keyingi ishda tozalanadi).
3. /workspace/artifacts da **faqat** foydalanuvchiga beriladigan yakuniy fayl(lar) qoldir.
4. Agar bir nechta yakuniy fayl bo'lsa, ularni aniq nom bilan va kerak bo'lsa papka tuzib qoldir, lekin skriptlarni emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oraliq generation skriptlari va temp fayllar doim /tmp ga yoziladi. /workspace/artifacts faqat yakuniy, foydalanuvchi ko'radigan deliverable uchun. Bu tartibni saqlaydi va "junk" fayllardan qochadi.
