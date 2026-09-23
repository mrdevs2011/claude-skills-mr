---
name: react-state-update-during-render
description: Render paytida setState chaqirilgan yoki side-effect to'g'ridan-to'g'ri component tanasida — "Too many re-renders" yoki kutilmagan xatti-harakat.
---

# React: render paytida setState / side-effect

## Nima uchun bu skill kerak
AI component funksiyasi ichida (return dan oldin, hech qanday useEffect/handler siz) `setState` chaqiradi yoki `fetch` qiladi. Har renderda state o'zgaradi → yana render → cheksiz sikl. Yoki "Cannot update during render" ogohlantirishi. Bu React qoidalarini buzishning klassik shakli.

## Simptom (aynan shu)
- Xato: `Too many re-renders. React limits the number of renders to prevent an infinite loop`.
- Yoki: `Cannot update a component while rendering a different component`.
- Component tanasida (if ichida ham) to'g'ridan-to'g'ri `setX(...)`.
- Yoki render paytida `fetch` / `localStorage.setItem` kabi side-effect.

## Sabab (100%)
React component tanasi — pure bo'lishi kerak: faqat hisoblash va JSX qaytarish. State o'zgartirish va side-effect faqat:
- event handler
- useEffect
- useLayoutEffect
ichida bo'lishi kerak. AI "agar X bo'lsa state'ni yangila" deb to'g'ridan-to'g'ri tanaga yozadi.

## Tasdiqlash
1. Component funksiyasi tanasini o'qing (return gacha).
2. `setState` / `dispatch` / `fetch` / `navigate` bormi — handler yoki useEffect siz?
3. Agar ha — render paytida yangilanish.

## Tuzatish (aynan shu)
State yangilashni useEffect yoki handler'ga ko'chiring:

```jsx
// XATO — render paytida setState:
function User({ id }) {
  const [user, setUser] = useState(null);
  if (id && !user) {
    setUser(loadUser(id)); // Too many re-renders
  }
  return <div>{user?.name}</div>;
}

// TO'G'RI — useEffect:
function User({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (id) {
      loadUser(id).then(setUser);
    }
  }, [id]);
  return <div>{user?.name}</div>;
}

// XATO — render paytida hisoblash + set:
const [total, setTotal] = useState(0);
setTotal(items.reduce((a, b) => a + b, 0)); // har renderda

// TO'G'RI — to'g'ridan-to'g'ri hisoblash (state kerak emas):
const total = items.reduce((a, b) => a + b, 0);
```

Qoida: render = pure. Side-effect va setState — faqat effect yoki event ichida.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Component tanasida setState = cheksiz render xavfi.
- Side-effect va state yangilash — useEffect / handler da.
- AI "shart bajarilsa yangila" deb to'g'ridan-to'g'ri tanaga yozadi.
