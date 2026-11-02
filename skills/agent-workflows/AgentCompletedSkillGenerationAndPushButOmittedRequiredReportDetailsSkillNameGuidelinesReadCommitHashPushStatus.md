---
name: agent-completed-skill-generation-push-omitted-required-report-details
description: Skill yaratish va push qilgandan keyin hisobotda skill nomi, o'qilgan qo'llanmalar, commit hash va push muvaffaqiyati ko'rsatilmagan holat. Qachon: avtomatik skill generator vazifasida oxirgi hisobot talab qilinganda.
---

# Skill generator oxirgi hisobotni to'liq bermadi

## Nima uchun bu skill kerak
Skill yaratish buyrug'ida qat'iy qadamlar va oxirida hisobot talab qilinadi: skill nomi, o'qilgan qo'llanmalar (architecture.md, instruction.md, style.md), commit hash, push muvaffaqiyatli. Agentlar ko'pincha push qilib qo'yib, qisqa "tayyor" deb javob beradi yoki ba'zi qismlarni tashlab ketadi. Bu keyingi tekshiruvni qiyinlashtiradi va buyruqqa 100% amal qilinmaganini bildiradi.

## Simptom (aynan shu)
- Skill fayl yaratildi, git commit va push bajarildi.
- Lekin yakuniy javobda skill nomi, o'qilgan qo'llanmalar ro'yxati, aniq commit hash va "push muvaffaqiyatli" tasdiqlovi yo'q yoki to'liq emas.
- Hisobot o'rniga faqat "skill qo'shildi" yoki boshqa qisqa matn.

## Sabab (100%)
Agent oxirgi hisobot talabini e'tiborsiz qoldirdi yoki qisman bajardi. Buyruq matnida "Oxirida hisobot: skill nomi, o'qilgan qo'llanmalar, commit hash, push muvaffaqiyatli." deb aniq yozilgan bo'lishiga qaramay, uni majburiy qadam deb hisoblamadi.

## Tasdiqlash
- `git log -1 --oneline` bilan oxirgi commit hashni ol.
- Push chiqishida "main -> main" yoki muvaffaqiyat matni bormi tekshir.
- Yakuniy javobda quyidagilar bormi:
  - Skill nomi (fayl nomi yoki frontmatter name)
  - O'qilgan qo'llanmalar: architecture.md, instruction.md, style.md (va boshqalar)
  - Commit hash
  - Push muvaffaqiyatli (yoki aniq xato)

## Tuzatish (aynan shu)
Pushdan keyin albatta to'liq hisobot yoz:

```
Yangi skill yaratildi va push qilindi.

- Skill nomi: AgentCompletedSkillGenerationAndPushButOmittedRequiredReportDetailsSkillNameGuidelinesReadCommitHashPushStatus
- O'qilgan qo'llanmalar: architecture.md, instruction.md, style.md
- Commit hash: <git log -1 --format=%H dan olingan hash>
- Push: muvaffaqiyatli (main branch)
```

Agar push xato bersa, hashni bermasdan aniq xatoni yoz va "muvaffaqiyatli" deb aytma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill generator vazifasida push qilish yetarli emas — buyruqda talab qilingan to'liq hisobotni (nom, qo'llanmalar, hash, push status) albatta berish kerak. Bu buyruqqa 100% amal qilishning oxirgi qismi.
