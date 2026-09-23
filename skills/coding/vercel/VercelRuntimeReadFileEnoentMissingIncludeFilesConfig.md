---
name: vercel-includeFiles-missing
description: Vercel'dagi /api funksiya 200 bilan javob beradi (route ishlayapti), lekin runtime'da readFile/readdir bilan o'qiladigan fayl (masalan instruction.md, skills/*.md) topilmayapti, ENOENT xatosi beryapti — sabab aynan bitta, includeFiles yo'q.
---

# Vercel: funksiya ishlaydi, lekin runtime fayl(lar)ni topolmaydi

## Nima uchun bu skill kerak
Bu — route to'g'ri ishlab turgan (demak `.listen()` ham, `rewrites` ham
muammo emas) holatda, faqat runtime'da fayl o'qishda chiqadigan xatoga
qaratilgan. Ko'pincha "hammasi to'g'ri yozilgan-ku" deb boshqa joydan
qidirib vaqt yo'qotiladi — bu skill to'g'ridan-to'g'ri sababga olib boradi.

## Simptom (aynan shu)
- Route to'g'ri ishlayapti (masalan `/health` 200 qaytaradi) — demak `.listen()` va `rewrites` muammosi emas.
- Lekin funksiya ichida `readFile(path.join(process.cwd(), "x.md"))` yoki `readdir(...)` chaqirilganda `ENOENT: no such file or directory` xatosi qaytadi — lokalda esa xuddi shu kod ishlagan.

## Sabab (100%)
Vercel funksiyani deploy qilganda faqat **kodda `import`/`require` qilingan**
fayllarni bundle'ga qo'shadi. `x.md` kabi fayl faqat runtime'da
`readFile` bilan o'qilsa (importsiz), Vercel uni "kerak emas" deb
bundle'dan tashlab ketadi — fayl serverda jismonan yo'q bo'lib chiqadi.

## Tasdiqlash
Route ishlayaptimi (masalan `/health` 200)? Ha bo'lsa va aynan
`readFile`/`readdir` chaqirilgan joyda xato bo'lsa — bu aynan shu sabab,
boshqa joyni qidirma.

## Tuzatish (aynan shu)
`vercel.json`da o'sha funksiya uchun `includeFiles` qo'sh (glob pattern
bo'lishi mumkin):

```json
{
  "functions": {
    "api/index.js": {
      "includeFiles": "{instruction.md,skills/**}"
    }
  }
}
```

Yo'l `vercel.json` joylashgan ildizga nisbatan yoziladi. Yangi runtime
fayl (yangi skill papka/fayl) qo'shilsa, shu glob pattern uni allaqachon
qamrab olyaptimi — tekshir, aks holda uni ham `includeFiles`ga qo'sh.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: fayl kodda `import` qilinmagan, faqat runtime'da o'qiladi —
  Vercel uni bundle'ga qo'shmagan.
- Tuzatish: `vercel.json`dagi `includeFiles` glob pattern'iga shu faylni
  (yoki uni qamrab oladigan papkani) qo'shish.
