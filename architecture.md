# Skill Search — Architecture

## Maqsad

mragent barcha skill'larni har safar to'liq context'ga yuklamaydi.
Buning o'rniga bitta `search_skills` tool orqali faqat kerakli
skill'ni topadi. Bu token tejaydi va context'ni toza saqlaydi.

## Asosiy prinsip

**List emas, qidiruv.** Har qanday "hamma X ro'yxati" tool o'rniga
"X'ni topib ber" tool yoziladi. Model hech qachon to'liq ro'yxatni
ko'rmaydi — faqat so'rovga mos natijani.

## Oqim

```
query
  -> search_skills()        oddiy so'z mosligi (name + description)
     -> topildi?  qaytar
     -> topilmadi -> _expand()   sinonim/variantlarga kengaytirish
        -> har bir variant bilan qayta qidirish (max 5 urinish)
        -> birinchi mos kelgani qaytariladi
     -> baribir topilmasa -> bo'sh natija, "topilmadi" deb aytiladi
```

Fallback hech qachon LLM chaqirmaydi (token sarflamaydi) — oddiy
qo'lda tuzilgan `SYNONYMS` lug'atidan ishlaydi. Agar kelajakda
aqlliroq kengaytirish kerak bo'lsa, `_expand()` ichiga kichik model
chaqiruvi qo'shiladi, qolgan qism o'zgarmaydi.

## Fayl tuzilishi

```
architecture.md        — shu fayl
skill_search.py         — to'liq modul: index, qidiruv, fallback, tool schema
app_example.py           — Flask'ga ulash namunasi (ishga tushirish uchun emas)
skills/                  — sinov uchun 3 ta namunaviy skill (pdf-yaratish,
                           excel-tozalash, rasm-tahrirlash)
```

`skills/` papkasi faqat sinov uchun. Haqiqiy skill'laring qayerda
bo'lsa (masalan `/mnt/skills` yoki boshqa joy), `skill_search.py`
tepasidagi `SKILLS_DIR` shunga o'zgartiriladi.

Sinash:
```
python skill_search.py pdf
python skill_search.py jadval tozalash
```

Yangi funksionallik qo'shilganda, yangi fayl emas — shu modul
ichiga funksiya sifatida qo'shiladi, toki modul 200 qatordan
oshmaguncha. Oshsa, `index.py` / `search.py` / `tools.py` ga bo'linadi.

## Kod yozish uslubi (shu loyihada davom ettirish uchun)

- Docstring va izohlar — o'zbek tilida, lotin yozuvida.
- Funksiya va o'zgaruvchi nomlari — ingliz tilida (`search_skills`,
  `skills_dir`), chunki kod bazasi ingliz nomlash konvensiyasiga
  mos.
- Har bir funksiya bitta narsa qiladi. `search_skills_with_fallback`
  kabi orkestratsiya funksiyalari alohida, ichki mantiq alohida
  (`_score`, `_expand`) — pastki chiziq bilan boshlanadi.
- Type hint har doim: `list[dict]`, `str`, `int` va h.k.
- Tashqi API (tool sifatida chaqiriladigan funksiya) har doim
  `handle_*` prefiksi bilan, va string qaytaradi (modelga to'g'ridan-
  to'g'ri ko'rsatish uchun tayyor matn).
- Tool schema'lar modul oxirida, alohida `*_TOOL_SCHEMA` konstantasi
  sifatida e'lon qilinadi — kod va schema bir joyda, sinxrondan
  chiqib qolmaydi.
- Yangi qidiruv-turdagi tool qo'shilganda, xuddi shu naqsh
  takrorlanadi: `load_*_index()` -> `search_*()` -> `_expand()` bilan
  fallback -> `handle_*_call()` -> `*_TOOL_SCHEMA`.

## Kengaytirish nuqtalari

- `load_skill_index()` — hozir `/skills/*/SKILL.md` fayllarini
  o'qiydi. Agar registry boshqacha formatda bo'lsa (JSON, DB),
  faqat shu funksiya almashtiriladi.
- `SYNONYMS` — vaqt o'tishi bilan to'ldirib boriladigan lug'at,
  kod emas, ma'lumot. Xohlasa alohida `synonyms.json` ga chiqarish
  mumkin.
