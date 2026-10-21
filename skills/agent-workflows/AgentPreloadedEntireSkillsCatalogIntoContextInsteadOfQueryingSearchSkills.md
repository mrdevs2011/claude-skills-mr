---
name: preloaded-full-skills-catalog-skipped-search
description: Agent barcha skill'larni oldindan context'ga yuklab, search_skills toolini chaqirmasdan ishlaydi — token isrofi va context to'lib ketishi.
---

# Agent barcha skill katalogini oldindan context'ga yukladi, search_skills ni ishlatmadi

## Nima uchun bu skill kerak

Skill bazasi o'sib borgan sari (yuzlab tor skill) ularning hammasini har suhbat boshida context'ga solish token va kontekst oynasini tezda to'ldiradi. Architecture qoidasiga ko'ra faqat kerakli skill `search_skills` orqali topilishi kerak.

## Simptom (aynan shu)

- Agent ish boshida yoki tool katalogini ko'rganda barcha skill fayllarini o'qib, ularning to'liq matnini context'ga qo'yadi.
- `search_skills` yoki `get_skill` chaqirilmaydi, lekin agent "men skill'larni bilaman" deb harakat qiladi.
- Context token ishlatilishi juda yuqori, keyingi qadamlar uchun joy kam qoladi.
- Yangi skill qo'shilganda uni avtomatik ko'rmaydi, chunki to'liq ro'yxatni bir marta yuklagan.

## Sabab (100%)

Agent "list emas, qidiruv" prinsipini e'tiborsiz qoldirdi. U skill katalogini oddiy hujjatlar to'plami deb o'ylab, barcha `.md` fayllarni ketma-ket `read` / `cat` qilib context'ga oldi. Architecture.md da aniq yozilgan: model hech qachon to'liq ro'yxatni ko'rmaydi — faqat so'rovga mos natijani.

## Tasdiqlash

1. Suhbat logida yoki tool call tarixida ko'p sonli skill fayllarining to'liq o'qilgani bor-yo'qligini tekshir.
2. `search_skills` chaqiruvi yo'qligini tasdiqla.
3. Token/context usage juda baland bo'lsa va skill-related ish bo'lsa — shu sabab.

## Tuzatish (aynan shu)

Hech qachon butun `skills/` papkasini o'qima. Kerakli skill uchun faqat qidiruv toolidan foydalan:

```text
# Noto'g'ri (to'liq katalogni yuklash)
for f in skills/**/*.md; do cat "$f"; done   # yoki ko'p read_file

# To'g'ri
search_skills("vercel env undefined")
# yoki
get_skill("vercel-env-var-undefined-at-runtime")
```

Agar skill nomi noma'lum bo'lsa:

1. Qisqa kalit so'z yoki xato matni bilan `search_skills` chaqir.
2. Qaytgan id bilan `get_skill` qil.
3. Faqat o'sha bitta skill matnini context'ga ol.

Yangi skill qo'shilganda ham shu tartib — oldindan yuklamasdan, qidiruvga tayan.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Skill katalogini to'liq context'ga yuklash taqiqlangan va isrofdor. Har doim `search_skills` → `get_skill` zanjirini ishlat; shunda faqat kerakli bitta skill tushadi, token tejaladi va yangi skill'lar avtomatik ko'rinadi.
