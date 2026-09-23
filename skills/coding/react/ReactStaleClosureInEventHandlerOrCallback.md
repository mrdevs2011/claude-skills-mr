---
name: react-stale-closure-handler
description: Event handler yoki callback ichida eski state/props qiymati ishlatiladi — component yangilangan, lekin handler eski qiymatni "eslab" qolgan (stale closure).
---

# React: stale closure (eski qiymat handler'da)

## Nima uchun bu skill kerak
AI onClick, onChange, setTimeout, yoki child'ga uzatilgan callback ichida state/props ishlatadi, lekin dependency yoki functional update qo'llamaydi. Component qayta render bo'ladi, state yangilanadi, lekin handler hali eski qiymatni ushlab turadi. Natija noto'g'ri, xato chiqmaydi.

## Simptom (aynan shu)
- Tugma bosilganda / event kelganda eski qiymat ishlatiladi.
- `console.log` da state yangi, lekin handler ichida eski.
- setTimeout / interval ichida eski state.
- Child component'ga uzatilgan callback eski props bilan ishlaydi.
- Ko'pincha `useEffect` deps skilliga o'xshash, lekin event handler / callback uchun.

## Sabab (100%)
Closure yaratilgan paytdagi qiymat "muzlatiladi". AI handler'ni bir marta yaratib, state o'zgarganda qayta yaratilishini ta'minlamaydi (yoki functional update ishlatmaydi).

## Tasdiqlash
1. Handler/callback ichida qaysi state/props ishlatilganini toping.
2. Handler qachon yaratilgan (render paytida)?
3. State keyin o'zgarganmi, lekin handler eski referensda qolganmi?
4. `console.log` ni handler ichiga qo'yib, bosilganda qaysi qiymat chiqishini ko'ring.

## Tuzatish (aynan shu)
Functional update yoki to'g'ri dependency bilan qayta yaratish:

```jsx
// XATO — stale count:
const [count, setCount] = useState(0);
const handleClick = () => {
  setCount(count + 1);  // har doim eski count
  setTimeout(() => {
    console.log(count); // eski
  }, 1000);
};

// TO'G'RI — functional update:
const handleClick = () => {
  setCount(c => c + 1);
  setTimeout(() => {
    setCount(c => {
      console.log(c); // yangi
      return c;
    });
  }, 1000);
};

// Yoki useCallback + deps (agar child'ga uzatilsa):
const handleClick = useCallback(() => {
  doSomething(count);
}, [count]);
```

Qoida: state'ni handler ichida o'qisangiz — functional update (`setX(prev => ...)`) afzal. Yoki handler'ni `useCallback` bilan deps ga bog'lang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Handler yaratilgan paytdagi state "muzlaydi".
- Functional update stale closure'ni oldini oladi.
- AI event handler'da to'g'ridan-to'g'ri state o'qib, yangilanishni unutadi.