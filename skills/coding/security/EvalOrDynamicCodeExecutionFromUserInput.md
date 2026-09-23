---
name: eval-or-dynamic-code-from-user-input
description: eval, new Function, yoki dynamic script user input bilan ishlatilgan — code injection xavfi, XSS yoki remote code execution.
---

# eval / dynamic code: user input dan

## Nima uchun bu skill kerak
AI "qulay" deb `eval(userCode)`, `new Function(userInput)`, yoki `innerHTML` ga user matnini qo'yadi. Foydalanuvchi (yoki hujumchi) istalgan kodni ishga tushira oladi. Bu eng xavfli pattern lardan biri.

## Simptom (aynan shu)
- `eval(...)`, `new Function(...)`, `setTimeout(string)`, `document.write(userInput)`.
- User/input qiymati to'g'ridan-to'g'ri kod sifatida bajariladi.
- Template engine da unescaped HTML.
- "Kalkulyator" yoki "dynamic formula" uchun eval.

## Sabab (100%)
AI tez yechim uchun eval ga murojaat qiladi. Xavfni hisobga olmaydi yoki "ichki ishlatiladi" deb o'ylaydi.

## Tasdiqlash
1. `eval`, `Function(`, `setTimeout('`, `setInterval('` qidiriladi.
2. Argument user/input/URL dan keladimi?
3. Agar ha — kritik xavf.

## Tuzatish (aynan shu)
eval dan voz keching, xavfsiz alternativ:

```js
// XATO:
const result = eval(userFormula);
const fn = new Function('x', userCode);
element.innerHTML = userComment;

// TO'G'RI — kalkulyator: aniq parser yoki math kutubxonasi
import { evaluate } from 'mathjs'; // yoki o'z parser
const result = evaluate(userFormula); // ruxsat etilgan operatsiyalar bilan

// TO'G'RI — matn:
element.textContent = userComment; // HTML emas

// TO'G'RI — agar HTML kerak: DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userHtml);
```

Qoida: hech qachon user input ni `eval`/`Function`/unescaped HTML ga bermang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- eval + user input = code injection.
- Alternativ: parser, textContent, sanitize.
- AI "qulay" deb eng xavfli API ni tanlashi mumkin.
