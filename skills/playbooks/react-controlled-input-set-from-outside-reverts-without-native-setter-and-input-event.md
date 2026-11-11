---
name: react-controlled-input-set-from-outside-reverts-without-native-setter-and-input-event
description: React controlled input.value = x dan keyin re-render'da eski qiymatga qaytadi yoki state yangilanmaydi. Chrome extension content script fill form input reverts. Sabab: React value setter'ni override qiladi va input event'ni kutadi. Fix: native setter + dispatch input event.
id: react-controlled-input-set-from-outside-reverts-without-native-setter-and-input-event
type: playbook
stack: React 18.3.1 (unpkg UMD), Chrome content script / external JS
confirmed_on: 2026-11-11
confidence: high (reproduced in sandbox browser + React docs)
triggers:
  - set input value but it reverts on re-render
  - react controlled input value not updating from extension
  - document.querySelector('input').value = 'x' does nothing in react
  - chrome extension fill form input reverts
  - fill react form from content script value reverts
  - input.value set but state stays old
  - react input ignore programmatic set
  - controlled component value set from outside fails
  - native setter react input
  - dispatchEvent input not updating react state
related:
  - coding/react/ReactUncontrolledToControlledInputWarning.md
  - playbooks/chrome-mv3-service-worker-terminates-after-30s-idle-losing-in-memory-state-use-storage-alarms.md
---

# React controlled input tashqaridan .value = set qilinsa re-render'da qaytadi

## TL;DR
Simptom: `input.value = 'new'` yoziladi, vizual o'zgaradi, lekin keyingi React re-render'da eski qiymatga qaytadi, state yangilanmaydi.
Sabab: React controlled input'da value property setter'ni o'ziningiga almashtiradi; oddiy set DOM'ni o'zgartiradi lekin onChange/state'ni yangilamaydi.
Birinchi buyruq (browser console yoki content script):
```js
const el = document.querySelector('input');
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
setter.call(el, 'new value');
el.dispatchEvent(new Event('input', { bubbles: true }));
```
Done: re-render'dan keyin ham qiymat saqlanadi, state yangilanadi.

## Qachon ishlatish / ishlatmaslik
Ishlat: Chrome extension content script, bookmarklet, yoki tashqi JS orqali React (yoki shunga o'xshash framework) controlled <input>/<textarea> to'ldirishda.
Ishlatma: oddiy HTML input (uncontrolled); React ichidan setState qilayotganda; form submit uchun; non-React saytlarda.

## Mental model (nima uchun)
[SRC:https://react.dev/reference/react-dom/components/input @ 2026-11] Controlled input: `value={state}` va `onChange` beriladi. React har renderda DOM value'ni state'ga majburan moslashtiradi. React 16+ da `HTMLInputElement.prototype.value` setter'ni override qiladi, shuning uchun `el.value = x` React'ning ichki holatini to'g'ri yangilamaydi. Tashqi o'zgartirish uchun original (native) setter'ni chaqirish va `input` event dispatch qilish kerak — shunda onChange ishlaydi, setState chaqiriladi. [SANDBOX: React 18.3.1, re-render button bilan tasdiqlangan]

## Diagnosis tree (arzonidan qimmatiga)
1. Input controlledmi? `document.querySelector('input').value` va React DevTools yoki sahifa matnida state ko'rinishi.  
   EXPECTED: oddiy setdan keyin vizual o'zgaradi, lekin state matni eski.  
   Agar state ham o'zgarsa → bu muammo emas, boshqa joyda xato.

2. Oddiy set + re-render:  
   ```js
   const el = document.getElementById('test-input');
   el.value = 'WRONG';
   // trigger re-render (button click yoki boshqa state)
   ```
   EXPECTED: re-render'dan keyin el.value eski qiymatga qaytadi. [SANDBOX]

3. Native setter + event:  
   ```js
   const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
   setter.call(el, 'CORRECT');
   el.dispatchEvent(new Event('input', { bubbles: true }));
   ```
   EXPECTED: state yangilanadi, re-render'dan keyin saqlanadi. [SANDBOX]

4. InputEvent sinab ko'r (ba'zi React versiyalarida kerak):  
   `el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'CORRECT' }));`

## Fix har bir sabab uchun
Sabab 1 (asosiy): native setter yo'q + event yo'q.  
Fix (copy-paste):
```js
function setReactInput(el, value) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  ).set;
  nativeSetter.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}
setReactInput(document.querySelector('input[name="title"]'), 'My Title');
```
Tekshir: re-render yoki form submit'da qiymat to'g'ri.

Agar textarea: `HTMLTextAreaElement.prototype`.

## Agentlar qayerda xato qiladi
1. Faqat `el.value = x` yozib "ishladi" deb o'ylash — re-render'ni tekshirmaydi.
2. `setAttribute('value', x)` ishlatish — controlled input'da ishlamaydi.
3. Event'ni bubbles: true qilmaslik — React document'da tinglaydi.
4. Faqat 'change' event, 'input' emas — onChange 'input' ni kutadi.
5. React 16+ da InputEvent kerak bo'lishi mumkinligini bilmaslik.

## Edge cases
1. Uncontrolled input (`defaultValue` yoki value prop yo'q) — oddiy .value yetarli. [SANDBOX]
2. React 15 va undan oldin — ba'zan oddiy set + event yetadi, native setter shart emas. [GUESS, eski versiyalar]
3. Shadow DOM yoki iframe ichida — to'g'ri document/context kerak.
4. Content script isolated world — page world'ga inject qilish kerak bo'lishi mumkin (chrome.scripting.executeScript).

## Done criteria
```js
// Re-render'dan keyin
const el = document.querySelector('input');
console.log(el.value); // yangi qiymat
// Sahifa matnida yoki DevTools state'da yangi qiymat
```
Yoki form submit'da to'g'ri data ketishi.

## Agar hali ham ishlamasa
- React versiyasini tekshir (`React.version`).
- InputEvent bilan sinab ko'r.
- Content script'da page context'ga inject qil (isolated world muammosi).
- React DevTools bilan state haqiqatan yangilanayotganini ko'r.
- Boshqa framework (Vue, Svelte) — o'xshash lekin boshqa event.

## Sources + confidence
- [SRC:https://react.dev/reference/react-dom/components/input @ current, 2026-11] controlled input behavior.
- StackOverflow va DEV.to postlar (native setter + input event).
- [SANDBOX] 2026-11-11: React 18.3.1 UMD, localhost page, wrong set reverts on re-render, correct set updates state and persists.
- Confidence: high for React 16-18; medium for older/newer without retest.
