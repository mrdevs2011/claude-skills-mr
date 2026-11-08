---
name: agent-loaded-full-page-without-pattern-or-start-line
description: OpenPage tool bilan to'liq sahifa yuklangan, pattern yoki start_line ishlatilmagan — faqat kerakli qism kerak bo'lganda context bloat va token isrofi.
---

# AgentLoadedFullPageWithOpenPageToolWithoutUsingPatternOrStartLineParametersCausingUnnecessaryContextBloatWhenOnlySpecificSectionNeeded

## Nima uchun bu skill kerak
Agent ochiq sahifadan faqat ma'lum bir qism, matn yoki qatorlarni izlayotganda `open_page` ni `pattern`, `start_line`, `max_matches` yoki `context_lines` parametrlarisiz chaqiradi. Natijada butun sahifa (yoki truncatsiya chegarasigacha) kontekstga yuklanadi va keraksiz token sarflanadi.

## Simptom (aynan shu)
`open_page` tool callida faqat `url` argumenti bor, `pattern` yoki `start_line` yo'q. Qaytgan natija juda uzun matn bo'ladi, lekin agent undan faqat bir nechta qator yoki qisqa parchani ishlatadi. Keyingi qadamlarda context to'lib ketadi.

## Sabab (100%)
`open_page` toolining ixtiyoriy parametrlari (`pattern`, `start_line`, `max_matches`, `context_lines`) mavjudligini e'tiborsiz qoldirish yoki "har doim to'liq sahifa kerak" deb noto'g'ri taxmin qilish.

## Tasdiqlash
Tool call historyda `open_page` chaqiruvi faqat `url` bilan. Qaytgan matn uzunligi katta, lekin ishlatilgan qism kichik (masalan, bir nechta mos kelgan qator).

## Tuzatish (aynan shu)
Kerakli ma'lumotni qidirish uchun `pattern` bilan chaqir:
```python
open_page(
  url="https://example.com/docs",
  pattern="specific term or regex",
  context_lines=5,
  max_matches=10
)
```
Yoki ma'lum qatorlardan boshlab:
```python
open_page(url="https://example.com/longpage", start_line=150)
```
Faqat to'liq sahifa haqiqatan zarur bo'lganda (masalan, umumiy tuzilmani ko'rish) parametersiz chaqir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`open_page` da `pattern` va `start_line` parametrlarini ishlatib, faqat kerakli qismni yuklab, contextni toza saqlash va token isrofini kamaytirish mumkin.
