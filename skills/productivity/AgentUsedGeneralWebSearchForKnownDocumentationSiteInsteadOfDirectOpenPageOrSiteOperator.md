---
name: general-search-for-known-docs
description: Agent known official documentation saytining URL'i yoki site: operatori bilan aniq qidirish o'rniga umumiy web_search ishlatdi — shovqinli natijalar, ortiqcha context, sekinroq.
---

# Umumiy qidiruv o'rniga to'g'ridan-to'g'ri docs yoki site: operatori

## Nima uchun bu skill kerak
Agentlar ba'zan "react useEffect" deb umumiy web_search qiladi, holbuki rasmiy docs.react.dev yoki site:docs.react.dev bilan aniqroq, tozaroq va arzonroq natija olinadi. Bu productivity qoidasiga (eng arzon ishonchli yo'l) zid va context'ni shovqin bilan to'ldiradi.

## Simptom (aynan shu)
- Ma'lum rasmiy dokumentatsiya (React, Python, Next.js, Vercel va h.k.) haqida savol berilgan.
- Agent umumiy `web_search` chaqirgan, `site:docs.xxx.com` yoki to'g'ridan-to'g'ri `open_page` URL ishlatmagan.
- Natijalar orasida bloglar, StackOverflow, eski versiyalar aralashgan.
- Keyin yana bir nechta sahifani ochishga majbur bo'lgan.

## Sabab (100%)
Agent "avval qidirib ko'ray, keyin eng yaxshi linkni ochaman" deb hisoblagan, lekin ma'lum docs sayti uchun to'g'ridan-to'g'ri yo'l yoki site: operatori tezroq va aniqroq ekanini tekshirmagan. instruction.md dagi eng arzon yo'l qoidasini e'tiborsiz qoldirgan.

## Tasdiqlash
1. So'rov rasmiy dokumentatsiya haqidami? (masalan "Next.js middleware", "Python pathlib", "React keys")
2. Agent `web_search` ni oddiy so'zlar bilan chaqirganmi, `site:docs.xxx.com` yo'qmi?
3. To'g'ridan-to'g'ri docs URL ma'lummi yoki oson topiladimi?
4. Natijalar orasida rasmiy bo'lmagan manbalar ko'pmi?

## Tuzatish (aynan shu)
Ma'lum docs uchun avval to'g'ridan-to'g'ri yo'lni tanla:

```python
# XATO:
web_search(query="react useEffect cleanup")

# TO'G'RI 1: site: operatori
web_search(query="useEffect cleanup site:react.dev")

# TO'G'RI 2: to'g'ridan-to'g'ri ochish (URL ma'lum bo'lsa)
open_page(url="https://react.dev/reference/react/useEffect")
```

Qoidalar:
- Rasmiy docs URL'ini bilasan yoki oldingi kontekstdan aniq bo'lsa — `open_page` ishlat.
- Aniq so'zlar bilan qidirish kerak bo'lsa — `site:rasmiy-domen.com` qo'sh.
- Umumiy qidiruv faqat docs sayti noma'lum yoki bir nechta manba kerak bo'lganda.
- Natija olgach, eng rasmiy manbani tanla, bloglar o'rniga.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ma'lum rasmiy dokumentatsiya uchun umumiy web_search o'rniga `site:` yoki to'g'ridan-to'g'ri `open_page` ishlat.
- Bu shovqinni kamaytiradi, token tejaydi va aniqroq ma'lumot beradi.
- Eng arzon ishonchli yo'lni tanlash — productivity skillining asosiy tamoyili.
