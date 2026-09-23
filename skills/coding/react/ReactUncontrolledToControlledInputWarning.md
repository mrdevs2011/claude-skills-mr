---
name: react-uncontrolled-to-controlled-input
description: input value undefined/null dan string/number ga o'tadi (yoki aksincha) — React "uncontrolled to controlled" ogohlantirishi, input xatti-harakati buziladi.
---

# React: uncontrolled → controlled input

## Nima uchun bu skill kerak
AI `<input value={user.name} />` yozadi. Boshida `user` null, `user.name` undefined — input uncontrolled. Keyin data kelib `value="Ali"` bo'ladi — controlled. React ogohlantirish beradi, cursor/state chalkashishi mumkin. Bu state/props timing muammosi.

## Simptom (aynan shu)
- Konsol: `A component is changing an uncontrolled input to be controlled`.
- Yoki aksincha: controlled → uncontrolled.
- Input `value={something}` — something ba'zan undefined/null.
- Forma birinchi renderda bo'sh, keyin data bilan to'ldiriladi.

## Sabab (100%)
`value={undefined}` yoki `value={null}` — uncontrolled. Keyin string — controlled. AI boshlang'ich state ni `''` qilib qo'ymaydi.

## Tasdiqlash
1. `<input>` / `<textarea>` / `<select>` da `value={...}` bormi?
2. O'sha ifoda birinchi renderda undefined/null bo'lishi mumkinmi?
3. Keyinroq aniq string/number bo'ladimi?
4. Agar ha — shu ogohlantirish chiqadi.

## Tuzatish (aynan shu)
Value ni har doim aniq string/number qiling:

```jsx
// XATO — boshida undefined:
const [user, setUser] = useState(null);
return <input value={user?.name} onChange={...} />;
// user null → value=undefined → uncontrolled
// keyin user keladi → controlled

// TO'G'RI — default bo'sh string:
const [user, setUser] = useState(null);
return (
  <input
    value={user?.name ?? ''}
    onChange={e => setUser(u => ({ ...u, name: e.target.value }))}
  />
);

// Yoki boshlang'ich state:
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
```

Qoida: controlled input `value` hech qachon undefined/null bo'lmasin — `?? ''` yoki boshlang'ich `''`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `value={undefined}` = uncontrolled, keyin string = controlled — warning.
- Har doim `value={x ?? ''}`.
- AI async data kelishidan oldin undefined qoldiradi.
