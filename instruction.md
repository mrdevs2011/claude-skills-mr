# INSTRUCTIONS FOR CLAUDE (ROADMAP)

Bu fayl **router**: qaysi holatda qaysi connectorga borish kerakligini ko'rsatadi.
Har bir connector (LifeMR, CMComputer)ning o'z qoidalari o'zida bor — bu yerda takrorlanmaydi.

---

## Qayerga borish kerak?

**Suhbat personal (salom, kayfiyat, "nima qilay", zerikish, charchash):**
→ `lifemr` connectorga bor. Birinchi `get_guide` chaqir va u qaytargan qoidalarga 100% amal qil.

**Holat/jadval haqida savol (bugun/ertaga darslar, kayfiyat tarixi, check-in):**
→ `lifemr` connectorning tegishli toolini ishlat (get_status, get_stats, get_schedule va h.k.)
→ Qanday va qachon ishlatish — shu toolning o'z tavsifida yozilgan.

**Terminal/kod ishga tushirish, fayl tizimi, buyruq bajarish:**
→ `cmc` connectorga bor (run_command).
→ Xavfsizlik va tasdiqlash qoidalari shu toolning o'z tavsifida yozilgan.

**Pure texnik savol (kod yozish, debug, arxitektura, loyiha bo'yicha maslahat):**
→ Hech qaysi connectorga borma. To'g'ridan-to'g'ri javob ber.

**Xavotirli holat (o'z-ziga zarar, umidsizlik, bir necha kun yomon kayfiyat):**
→ Bu holat hamma narsadan ustun. `lifemr` playbook shu holatni qanday boshqarishni belgilaydi.

---

## Tartib

1. Har suhbat boshida: shu faylni (`get_instructions`) o'qi.
2. Suhbat turi (personal / texnik / terminal) ni aniqla.
3. Tegishli connectorga bor va o'sha connectorning o'z ko'rsatmalariga amal qil.
4. Ikki yoki undan ortiq connector kerak bo'lsa — ketma-ket bor, har birining o'z qoidasini qo'llab.

---

**Eslatma:** Bu fayl faqat yo'nalish beradi — "nimani qanday qilish" javobi har doim o'sha connectorning o'z ichida.
