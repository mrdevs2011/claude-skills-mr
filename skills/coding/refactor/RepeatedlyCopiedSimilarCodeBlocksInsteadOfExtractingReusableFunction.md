---
name: repeatedly-copied-similar-code-blocks-instead-of-extracting-reusable-function
description: Bir xil yoki o'xshash kod bloklari bir necha joyda qayta-qayta yozilgan — DRY buzilgan, o'zgarishlar sinxronlashmaydi, xatolarni tuzatish qiyinlashadi.
---

# Takrorlangan kod bloklari: reusable funksiya ajratilmagan

## Nima uchun bu skill kerak
AI yoki dasturchi bir xil mantiqni (validatsiya, formatlash, API chaqiruv, data transform) bir necha fayl/funksiyada copy-paste qiladi. Keyin bitta joyda tuzatish boshqa joylarda qoladi, xatolar tarqaladi, kod hajmi o'sadi. Bu productivity va maintainability muammosi, sof debugging emas.

## Simptom (aynan shu)
- 5-15 qatorlik o'xshash kod bloklari 2+ joyda (turli funksiya, fayl yoki componentda) deyarli bir xil.
- Faqat o'zgaruvchi nomi yoki 1-2 qiymat farq qiladi.
- O'zgarish kerak bo'lganda bir nechta joyda qo'lda tuzatish kerak bo'ladi.
- Code review yoki search_skills da "copy-paste" yoki "duplicate logic" belgisi.

## Sabab (100%)
Tezlik uchun copy-paste qilindi, "keyin refactor qilaman" deb qoldirildi yoki AI kontekstda mavjud helperni ko'rmadi / yangi funksiya ajratishni o'ylamadi. Kichik farqlar bor deb o'ylagan, lekin aslida umumiy funksiya qilsa bo'ladi.

## Tasdiqlash
1. Kodda o'xshash qatorlarni qidir (`grep` yoki visual).
2. 2+ joyda deyarli bir xil blok bormi?
3. Farqlar faqat parametr (qiymat, nom) darajasidami, mantiq bir xilmi?
4. Agar ha — ajratish mumkin.

## Tuzatish (aynan shu)
Umumiy mantiqni bitta named funksiya/komponentga ajrat, parametrlar bilan chaqir:

```js
// XATO (takrorlangan):
function processUserA(user) {
  if (!user || !user.email) return null;
  const cleaned = user.email.trim().toLowerCase();
  return { ...user, email: cleaned, validated: true };
}
function processUserB(data) {
  if (!data || !data.email) return null;
  const cleaned = data.email.trim().toLowerCase();
  return { ...data, email: cleaned, validated: true };
}

// TO'G'RI (ajratilgan):
function validateAndCleanEmail(item) {
  if (!item || !item.email) return null;
  const cleaned = item.email.trim().toLowerCase();
  return { ...item, email: cleaned, validated: true };
}
// chaqirish: validateAndCleanEmail(user) / validateAndCleanEmail(data)
```

Agar React/UI bo'lsa — shared component yoki hook. Agar utils papkasi bor bo'lsa, o'sha yerga qo'y. Test ham yozib qo'y.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Bir xil mantiqni qayta yozish o'rniga bitta reusable funksiya ajratish kerak.
- Tuzatish: copy-paste blokni o'chirish, parametrli helper yaratish, barcha joylarni shu helperga yo'naltirish.
- Bu xatolarni kamaytiradi va kelajakdagi o'zgarishlarni bitta joyda qilish imkonini beradi.
