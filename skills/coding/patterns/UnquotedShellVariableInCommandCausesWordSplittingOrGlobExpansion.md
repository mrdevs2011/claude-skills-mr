---
name: unquoted-shell-variable-word-splitting
description: Shell buyruqida o'zgaruvchini qo'shtirnoqsiz ishlatish word splitting yoki glob expansion'ga olib keladi — argumentlar noto'g'ri bo'linadi yoki kutilmagan fayllar mos keladi.
---

# Shell o'zgaruvchisini qo'shtirnoqsiz ishlatish word splitting yoki glob'ga sabab bo'ladi

## Nima uchun bu skill kerak
AI shell buyruqlarini yozganda o'zgaruvchilarni qo'shtirnoqsiz qo'yadi (masalan `echo $FILE` yoki `rm $PATTERN`). Bash (va boshqa shell'lar) qo'shtirnoqsiz o'zgaruvchini so'z bo'linishi (IFS bo'yicha) va glob kengayishiga beradi. Natijada: bir nechta argumentga bo'linadi, fayl nomidagi bo'shliq yoki maxsus belgilar buziladi, yoki kutilmagan fayllar o'chiriladi/yoziladi. Bu ayniqsa fayl yo'llari, foydalanuvchi kiritgan qiymatlar yoki dinamik buyruqlarda xavfli.

## Simptom (aynan shu)
- Fayl nomida bo'shliq bo'lsa buyruq ishlamaydi yoki noto'g'ri faylga ta'sir qiladi (`rm $file` → `rm file with space.txt` bo'lib ikki argument).
- Glob belgilari (`*`, `?`, `[`) o'zgaruvchi ichida bo'lsa kutilmagan kengayish.
- `echo $VAR` yoki `command $ARGS` chiqishi kutilganidan farq qiladi.
- Xato: "too many arguments", "No such file", yoki xavfli o'chirish/yozish.
- `set -x` yoki debug'da o'zgaruvchi bo'linib ketgani ko'rinadi.

## Sabab (100%)
Shell'da qo'shtirnoqsiz `$VAR` yoki `${VAR}` IFS (odatda bo'shliq, tab, yangi qator) bo'yicha so'zlarga bo'linadi, keyin har bir so'zda glob expansion amalga oshadi. AI "o'zgaruvchi shunchaki qiymat" deb o'ylaydi, lekin shell qoidalari boshqacha. Qo'shtirnoq ichida (`"$VAR"`) bu bo'linish va glob o'chiriladi.

## Tasdiqlash
1. Buyruqda `$VAR` yoki `${VAR}` qo'shtirnoqsiz ishlatilganmi?
2. O'zgaruvchi qiymatida bo'shliq, tab, yangi qator yoki `* ? [` bormi?
3. `bash -x script.sh` yoki `set -x` bilan kengayishni ko'ring — bitta o'zgaruvchi bir nechta so'z bo'ldimi?
4. Qo'shtirnoq qo'yib qayta sinab ko'ring — muammo yo'qoldimi?

## Tuzatish (aynan shu)
Har doim o'zgaruvchini qo'yib qo'ying, agar ataylab word splitting/glob kerak bo'lmasa:

```bash
# Noto'g'ri (bo'linadi):
file="my file.txt"
rm $file          # rm my file.txt  → ikki argument
echo $PATH        # bo'shliqlar bo'yicha bo'linadi

# To'g'ri:
rm "$file"        # bitta argument, bo'shliq saqlanadi
echo "$PATH"

# Agar ataylab bo'lish kerak bo'lsa (kamdan-kam):
# IFS ni vaqtincha o'zgartiring yoki array ishlating
args=(one two "three four")
command "${args[@]}"
```

Qoida: fayl yo'llari, foydalanuvchi kiritgan qiymat, har qanday dinamik string — doim `"$var"`. Faqat aniq word splitting kerak bo'lganda (va xavfsiz bo'lsa) qo'shtirnoqsiz qoldiring.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Qo'shtirnoqsiz `$var` shell'da so'z bo'linishi + glob qiladi.
- Fayl nomlari va argumentlar uchun doim `"$var"` ishlating.
- AI buni ko'pincha unutadi — ayniqsa oddiy `echo $x` yoki `cat $file` da.
