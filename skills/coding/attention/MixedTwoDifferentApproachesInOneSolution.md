---
name: mixed-two-different-approaches
description: AI bitta yechimda ikki xil yondashuvni aralashtirgan — masalan class va hooks, callback va async/await, yoki ikki xil state boshqaruvi. Kod chalkash, birini tanlash kerak edi.
---

# Ikki xil yondashuvni bir yechimda aralashtirish

## Nima uchun bu skill kerak
AI bir muammoni yechayotganda yarim yo'lda yondashuvni o'zgartiradi yoki ikkala usulni birga yozadi: class component + hooks, `.then` + `await`, Redux + useState bir joyda, yoki fetch + axios aralash. Natija ishlashi mumkin, lekin o'qish qiyin, keyingi o'zgarish chalkash. Bu e'tibor chalg'ishi: "hammasini qo'shay" deb, bitta aniq yo'lni tanlamaslik.

## Simptom (aynan shu)
- Bir faylda/yoki bir funksiyada ikki xil stil: `async/await` va `.then` aralash.
- Class lifecycle va hooks birga.
- Bir state uchun ikki manba (props + local state, yoki context + redux).
- Foydalanuvchi "nima uchun ikkala usul?" deb so'raydi.

## Sabab (100%)
AI birinchi yondashuvni boshlaydi, keyin boshqa esdalikdagi pattern ni qo'shadi. Yoki "to'liqroq" deb ikkalasini ham yozadi. Bir xil vazifa uchun bitta aniq usul tanlanmaydi.

## Tasdiqlash
1. Yechimda qancha asosiy yondashuv bor (async usuli, state usuli, component turi)?
2. Ular bir-birini takrorlayaptimi yoki chalkashtirayaptimi?
3. Bitta yondashuv bilan xuddi shu natija olinadimi?
4. Agar ha — aralashgan.

## Tuzatish (aynan shu)
Bitta yondashuvni tanlang va unga sodiq qoling:

```js
// XATO — aralash:
async function load() {
  const a = await fetchA();
  return fetchB().then(b => ({ a, b })); // await va then aralash
}

// TO'G'RI — faqat await:
async function load() {
  const a = await fetchA();
  const b = await fetchB();
  return { a, b };
}

// XATO — state ikki joyda:
const [local, setLocal] = useState(props.value);
// va bir vaqtda props.value ni ham to'g'ridan-to'g'ri ishlatish

// TO'G'RI — bitta manba:
const value = props.value; // yoki faqat local, sync bilan
```

Qoida: bitta muammo = bitta asosiy yondashuv. Aralashtirmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ikki yondashuv birga = chalkashlik va texnik qarz.
- Tanlang va sodiq qoling.
- AI "ko'proq" deb aralashtirib yuboradi.