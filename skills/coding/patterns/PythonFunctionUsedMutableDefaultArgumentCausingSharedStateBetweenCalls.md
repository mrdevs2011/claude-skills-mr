---
name: python-mutable-default-argument-shared-state
description: Python funksiyada mutable (list, dict) default argument ishlatilganda har chaqiruvda bir xil obyekt qayta ishlatiladi, kutilmagan shared state va buglar chiqadi.
---

# Mutable default argument: chaqiruvlar orasida state ulashiladi

## Nima uchun bu skill kerak
Python'da default argumentlar funksiya define qilingan vaqtda bir marta baholanadi. Agar default `[]` yoki `{}` bo'lsa, barcha chaqiruvlar o'sha bitta obyektni ishlatadi. Bu klassik "gotcha" — AI yoki dasturchi ko'pincha e'tiborsiz qoldiradi, natijada list/dict to'planib boradi yoki noto'g'ri data chiqadi. Bu sof syntax xatosi emas, mantiqiy pattern xatosi.

## Simptom (aynan shu)
- Funksiya bir necha marta chaqirilganda oldingi chaqiruvning o'zgarishlari saqlanib qoladi.
- Masalan: `def add_item(item, lst=[]): lst.append(item); return lst` — ikkinchi chaqiruvda oldingi itemlar ham bor.
- Testlar ba'zan o'tadi, ba'zan yo'q (order bog'liq).
- Kod "toza" ko'rinadi, lekin runtime'da kutilmagan list/dict kontenti.

## Sabab (100%)
Default argument qiymati funksiya yaratilganda (def vaqtida) bir marta hisoblanadi va saqlanadi. Mutable obyekt (`list`, `dict`, `set`) o'zgartirilishi mumkin, shuning uchun har chaqiruvda yangi emas, o'sha bitta obyekt ishlatiladi. Immutable (`None`, `int`, `str`) da bu muammo yo'q.

## Tasdiqlash
1. Funksiya signature'da default `= []` yoki `= {}` bormi?
2. Ichida o'sha argumentga `.append()`, `.extend()`, `key = value` yoki boshqa mutation bormi?
3. Funksiyani ikki marta ketma-ket chaqirib, natijani solishtir — ikkinchisi birinchisining o'zgarishini o'z ichiga oladimi?
4. Agar ha — aynan shu muammo.

## Tuzatish (aynan shu)
Default'ni `None` qil, ichida yangi obyekt yarat:

```python
# XATO:
def add_item(item, lst=[]):
    lst.append(item)
    return lst

# TO'G'RI:
def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

Dict uchun ham xuddi shunday. Agar doim yangi kerak bo'lsa, hech qachon mutable default qo'yma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mutable default argumentlar funksiya define vaqtida bir marta yaratiladi va ulashiladi.
- Tuzatish: `None` default + ichida `if arg is None: arg = []` (yoki `{}`).
- Bu pattern xatosini oldini olish uchun har doim default argumentlarni immutable qil yoki None ishlat.
