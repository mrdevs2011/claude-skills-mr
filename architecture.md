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
  -> search_skills()        oddiy so'z mosligi (name + description + matn)
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

## Skill yozish qoidalari

Skillar **juda tor va bitta nuqtaga qaratilgan** bo'lishi shart:

- Har biri faqat **BITTA aniq simptom** (aynan shu xato matni yoki holat)
- **BITTA aniq sabab** (100%)
- **BITTA aniq tuzatish**

Umumiy "yaxshi kod yozish" maslahatlari yozilmaydi. Maqsad: model
biror xatoga duch kelganda `search_skills` orqali mos skillni topib,
bir o'qishda sababni va tuzatishni tushunib olishi.

### Nima uchun bunday tor?

AI'lar (hatto kuchli modelllar) syntaxda kam adashadi. Ular asosan:

- e'tiborini yo'qotadi (so'ralmagan narsani qiladi, tekshirmaydi)
- mantiqda chalg'iydi (teskari shart, noto'g'ri o'zgaruvchi, off-by-one)
- simptomni yashiradi (ildizni qoldiradi)
- hardcode qiladi, maxfiy ma'lumotni log qiladi

Shu sababli skill'lar aynan shu "chalishib ketish" nuqtalariga
qaratilgan — bitta aniq holat, bitta aniq yechim.

### Fayl formati (majburiy)

```md
---
name: qisqa-kebab-case-id
description: Qisqa tavsif — qachon kerak bo'lishi (1-2 jumla)
---

# Sarlavha

## Nima uchun bu skill kerak
...

## Simptom (aynan shu)
...

## Sabab (100%)
...

## Tasdiqlash
...

## Tuzatish (aynan shu)
... (kod misoli bilan)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

### Nomlash

Fayl nomi o'zi nima haqida ekanini to'liq bildiradi (uzun bo'lsa ham mayli):

- `VercelEnvVarUndefinedAtRuntimeLocalEnvWorks.md`
- `ReactDirectStateMutationDoesNotTriggerRerender.md`
- `HallucinatedMethodOrPropertyIsNotAFunctionTypeError.md`
- `FixedSymptomInsteadOfRootCause.md`

Qisqartma yoki noaniq nom ishlatilmaydi.

### Kategoriya (papka) qoidasi

**Har doim o'z kategoriyasiga qo'yiladi.** Yangi skill yozilganda:

1. Mavjud kategoriyaga mos kelsa — o'sha papkaga.
2. Mos kategoriya yo'q bo'lsa — yangi papka yaratiladi.
3. Umumiy meta-qoidalar (debug tartibi, vazifaga aniq qolish) — `coding/` ildizida qoladi.

### Hozirgi kategoriyalar

```
skills/coding/
  ├── (meta)
  │     GeneralDebuggingProcessWhenCodeErrorsOrBreaks.md
  │     StayScopedToRequestedTaskAvoidUnrequestedChanges.md
  │     error-handling.md
  │     focus.md
  │     HallucinatedMethodOrPropertyIsNotAFunctionTypeError.md
  │     ReferenceErrorXIsNotDefinedMissingImportOrTypo.md
  │     WrongDataShapeAssumptionSilentWrongResultOrCrash.md
  │
  ├── async/          — Promise, await, race, map/forEach ichida await
  ├── null/           — undefined/null TypeError, falsy tuzoq
  ├── vercel/         — deploy, route, env, runtime, handler
  ├── react/          — state mutate, key prop
  ├── deps/           — package.json, install, module not found
  ├── logic/          — teskari shart, noto'g'ri o'zgaruvchi, off-by-one
  ├── patterns/       — early return, guard clause, nesting kamaytirish
  ├── refactor/       — signature/tip o'zgarishi, call site'lar
  ├── attention/      — simptom vs ildiz, tekshirmasdan "tuzatildi",
  │                     so'ralmagan rewrite, hardcode, boshqa savolga javob
  └── security/       — maxfiy ma'lumotni log qilish yoki qaytarish
agent-workflows/      — agent ish oqimi, tool chaqiruv tekshiruvi, muvaffaqiyat taxmini, parallel tool chaqiruv, secret mask qilish
productivity/         — tejamkorlik, eng arzon yo'l tanlash, context boshqaruvi, vazifa samaradorligi
```

### Meta-skill vs aniq bug skill

| Turi | Vazifasi | Misol |
|------|----------|-------|
| **Aniq bug skill** | Bitta xato matni/holat → bitta sabab → bitta tuzatish | `vercel/VercelEnvVar...`, `logic/OffByOne...` |
| **Meta-skill** | Umumiy jarayon (debug tartibi, vazifaga aniq qolish) | `GeneralDebugging...`, `StayScoped...` |

Meta-skill'lar kengroq bo'lishi mumkin, lekin baribir qat'iy va qisqa.

## Fayl tuzilishi

```
architecture.md        — shu fayl
skill_search.py         — to'liq modul: index, qidiruv, fallback, tool schema
app_example.py           — Flask'ga ulash namunasi (ishga tushirish uchun emas)
skills/                  — barcha skill'lar (kategoriya papkalari bilan)
  playbooks/          — batafsil diagnosis tree skilllar (ffmpeg va boshqalar)
  coding/
    async/
    null/
    vercel/
    react/
    deps/
    logic/
    patterns/
    refactor/
    attention/
    security/
  agent-workflows/
  productivity/
  excel-tozalash/
  pdf-yaratish/
  rasm-tahrirlash/
```

`skills/` — haqiqiy skill bazasi (sinov emas).
Haqiqiy joy boshqacha bo'lsa (masalan `/mnt/skills`), `skill_search.py`
tepasidagi `SKILLS_DIR` shunga o'zgartiriladi.

Sinash:
```
python skill_search.py vercel env
python skill_search.py react key
python skill_search.py "is not a function"
python skill_search.py hardcode
python skill_search.py secret log
```

Yangi funksionallik qo'shilganda, yangi fayl emas — shu modul
ichiga funksiya sifatida qo'shiladi, toki modul 200 qatordan
oshmaguncha. Oshsa, `index.py` / `search.py` / `tools.py` ga bo'linadi.

## Kod yozish uslubi (shu loyihada davom ettirish uchun)

- Docstring va izohlar — o'zbek tilida, lotin yozuvida.
- Funksiya va o'zgaruvchi nomlari — ingliz tilida (`search_skills`,
  `skills_dir`), chunki kod bazasi ingliz nomlash konvensiyasiga mos.
- Har bir funksiya bitta narsa qiladi. Orkestratsiya alohida,
  ichki mantiq alohida (`_score`, `_expand`) — pastki chiziq bilan.
- Type hint har doim: `list[dict]`, `str`, `int` va h.k.
- Tashqi API (tool sifatida chaqiriladigan funksiya) har doim
  `handle_*` prefiksi bilan, va string qaytaradi.
- Tool schema'lar modul oxirida, alohida `*_TOOL_SCHEMA` konstantasi
  sifatida e'lon qilinadi — kod va schema bir joyda.
- Yangi qidiruv-turdagi tool qo'shilganda xuddi shu naqsh:
  `load_*_index()` → `search_*()` → `_expand()` → `handle_*_call()` → `*_TOOL_SCHEMA`.

## Kengaytirish nuqtalari

- `load_skill_index()` — hozir `skills/` ostidagi barcha `.md` fayllarni
  (kategoriya papkalari bilan) o'qiydi. Registry boshqacha formatda
  bo'lsa (JSON, DB), faqat shu funksiya almashtiriladi.
- `SYNONYMS` — vaqt o'tishi bilan to'ldirib boriladigan lug'at,
  kod emas, ma'lumot. Xohlasa alohida `synonyms.json` ga chiqarish mumkin.
- Yangi kategoriya qo'shish — faqat yangi papka yaratish + skill yozish.
  Kodga tegish shart emas; `search_skills` avtomatik ko'radi.
- Yangi skill qo'shish tartibi:
  1. Qaysi kategoriya? (mavjud yoki yangi papka)
  2. Fayl nomi uzun va aniq bo'lsin
  3. Formatga 100% rioya qil (frontmatter + 6 bo'lim)
  4. `README.md` dagi struktura ro'yxatini yangila
  5. `architecture.md` dagi kategoriya ro'yxatini yangila (agar yangi papka bo'lsa)
