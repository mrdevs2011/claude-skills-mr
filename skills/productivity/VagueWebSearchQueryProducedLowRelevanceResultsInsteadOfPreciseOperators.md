---
name: vague-web-search-query-low-relevance
description: Agent web_search yoki o'xshash qidiruvni umumiy, noaniq so'zlar bilan chaqiradi ("error", "help", "how to"), natijada kam foydali yoki noto'g'ri sahifalar keladi va vaqt ketadi.
---

# Noaniq qidiruv so'rovi past relevantlik beradi

## Nima uchun bu skill kerak
Tool usage da eng tez xato — qidiruv so'rovini "odamdek" yozish. AI agentlar ba'zan foydalanuvchi so'zini to'g'ridan-to'g'ri yoki juda umumiy qilib yuboradi. Natijada birinchi 5-10 natija keraksiz bo'ladi, agent yana qidiradi yoki noto'g'ri manbaga ishonadi. Aniq operatorlar va kalit so'zlar bilan bitta yaxshi qidiruv yetarli.

## Simptom (aynan shu)
- `web_search` (yoki o'xshash) chaqiruvi qisqa va umumiy: "react error", "python bug", "how to fix", "latest news".
- Natijalar keng mavzuda, aniq yechim yo'q yoki eski maqolalar.
- Agent keyin yana 2-3 marta qidiradi yoki "topilmadi" deydi.
- So'rovda site:, quotes, filetype: yoki aniq error matni yo'q.

## Sabab (100%)
Agent "tabiiy til" so'rov yetarli deb o'ylaydi va qidiruv tizimining operatorlarini (quotes, site:, -exclude, filetype:) ishlatmaydi. Yoki foydalanuvchi so'zini o'zgartirmasdan yuboradi. Bu search engine rankingni isrof qiladi.

## Tasdiqlash
1. Tool call logida `web_search` yoki `open_page` bormi?
2. Query 3-5 so'zdan kam yoki umumiy ("error", "help", "best way")mi?
3. Natija matnida kerakli aniq javob yoki manba yo'qmi?
4. Agent keyin so'rovni o'zgartirib qayta qidirganmi?

## Tuzatish (aynan shu)
Qidiruvni **aynan shu** tarzda tuz:

1. Foydalanuvchi so'rovidan **aniq kalit so'zlar** ajrat (error matni, framework nomi, versiya).
2. Operatorlar qo'sh:
   - `"exact phrase"` — aniq ibora
   - `site:docs.python.org` yoki `site:stackoverflow.com`
   - `-reddit` yoki boshqa exclude
   - `filetype:md` yoki `2024` yil uchun
3. Bitta chaqiruvda 1-2 aniq variant yubor (parallel mumkin bo'lsa).
4. Natijani o'qib, kerak bo'lsa `open_page` bilan chuqurroq kir.

Misol (xato):
```
web_search(query="react useeffect error")
```

To'g'ri:
```
web_search(query='"useEffect" "missing dependency" site:react.dev OR site:stackoverflow.com 2024')
```

Yoki:
```
web_search(query="TypeError: Cannot read properties of undefined" site:github.com/issues)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Qidiruv so'rovi tabiiy til emas, maxsus kalit so'z + operator bo'lishi kerak.
- Umumiy so'zlar past relevantlik beradi; aniq error matni yoki site: tezroq to'g'ri natija beradi.
- Bitta yaxshi qidiruv > uchta noaniq qidiruv.
