---
name: agent-described-card-as-plain-text
description: Tool (weather, sports va boshqalar) card_id qaytarganda agent uni matn yoki jadval shaklida qayta yozadi — render_card ishlatmasdan. Natijada boy UI card yo'qoladi.
---

# Structured tool natijasini oddiy matn bilan tasvirlash

## Nima uchun bu skill kerak
Weather, sports va boshqa structured data toollari boy kartochka (card) qaytaradi va `card_id` beradi. Agent ba'zan shu ma'lumotni o'zi qayta yozib, jadval yoki ro'yxat qilib beradi. Bu foydalanuvchi tajribasini yomonlashtiradi — vizual, interaktiv card o'rniga oddiy matn chiqadi. Skill shu xatoni to'xtatadi.

## Simptom (aynan shu)
- Tool chaqiruvidan keyin javobda `card_id` borligi ko'rinadi.
- Agent javobida shu ma'lumotni qayta yozadi: "Hozir 22°C, yomg'ir yog'ishi mumkin..." yoki jadval shaklida.
- `<grok type="render_card" card_id="..."/>` elementi javobda yo'q.
- Foydalanuvchi boy card o'rniga oddiy matn ko'radi.

## Sabab (100%)
Agent tool natijasini "o'zim yaxshiroq tushuntiraman" yoki "card shart emas" deb hisoblaydi. Render qoidasini (card_id bor bo'lsa doim render_card ishlatish) o'qimagan yoki e'tiborsiz qoldirgan. Structured data uchun maxsus UI component'ni matnga aylantiradi.

## Tasdiqlash
1. Oxirgi tool natijasida `card_id` bormi?
2. Javobda `render_card` XML elementi ishlatilganmi?
3. Ma'lumot matn/jadval shaklida qayta yozilganmi?
4. Agar 1 ha, 2 yo'q, 3 ha — bu shu.

## Tuzatish (aynan shu)
Tool `card_id` qaytargan zahoti:

1. Javobni 1-2 qisqa jumla bilan boshla (asosiy xulosa).
2. Darhol render qil:

```
<grok type="render_card" card_id="OLINGAN_CARD_ID"/>
```

3. Card'da yo'q qo'shimcha faktlar bo'lsa, faqat shularni keyin yoz.
4. Hech qachon card ma'lumotini to'liq qayta yozma — card o'zi ko'rsatadi.

To'g'ri misol:
```
Bugun Toshkentda 18–24°C, kechqurun yomg'ir ehtimoli bor.

<grok type="render_card" card_id="weather_12345"/>

Eslatma: shamol 15 km/soat atrofida.
```

Noto'g'ri:
```
Hozirgi ob-havo: harorat 21°C, namlik 60%, yomg'ir...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Structured tool `card_id` bersa — doim `render_card` ishlat.
- Ma'lumotni o'zing qayta yozma, card UI'ni ishlat.
- Bu foydalanuvchiga boyroq, to'g'riroq ko'rinish beradi va token tejaydi.
