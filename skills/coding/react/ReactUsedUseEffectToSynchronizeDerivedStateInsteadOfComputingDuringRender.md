---
name: react-useeffect-derived-state
description: React'da derived state'ni useEffect bilan sinxronlash o'rniga render paytida hisoblash kerak bo'lgan holatda.
---

# React'da useEffect orqali derived state sinxronlash

## Nima uchun bu skill kerak
AI'lar ba'zan derived (hisoblangan) qiymatlarni alohida state sifatida saqlab, ularni useEffect orqali yangilashga urinadi. Bu keraksiz re-render, race condition va murakkablik yaratadi. To'g'ri yo'l — derived qiymatni render vaqtida to'g'ridan-to'g'ri hisoblash.

## Simptom (aynan shu)
Kodda `const [derived, setDerived] = useState(...)` bor va `useEffect(() => { setDerived(calculateFrom(propsOrState)); }, [deps])` bilan yangilanadi. Component qo'shimcha re-render qiladi yoki vaqtincha noto'g'ri qiymat ko'rsatadi.

## Sabab (100%)
Derived state aslida state emas — u boshqa state/prop'lardan hisoblanadi. Uni alohida saqlash va effect bilan sinxronlash React'ning asosiy modeliga zid. Effect render'dan keyin ishlaydi, shuning uchun bir frame noto'g'ri qiymat chiqishi yoki qo'shimcha render bo'lishi mumkin.

## Tasdiqlash
- useState va useEffect juftligi derived qiymat uchun ishlatilganini tekshir.
- Qiymat faqat boshqa state/prop'lardan hisoblanadimi?
- Effect faqat setState qilish uchun ishlatilganmi?

## Tuzatish (aynan shu)
useState va useEffect'ni olib tashla. Qiymatni render paytida hisobla:

```jsx
// Noto'g'ri
const [items, setItems] = useState([]);
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(i => i.active));
}, [items]);

// To'g'ri
const [items, setItems] = useState([]);
const filtered = items.filter(i => i.active);
```

Agar hisoblash qimmat bo'lsa, `useMemo` ishlat:

```jsx
const filtered = useMemo(() => items.filter(i => i.active), [items]);
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Derived state'ni alohida state + useEffect bilan saqlama. Uni render vaqtida (yoki useMemo bilan) to'g'ridan-to'g'ri hisobla. Bu qo'shimcha render va sinxronlash muammolarini oldini oladi.
