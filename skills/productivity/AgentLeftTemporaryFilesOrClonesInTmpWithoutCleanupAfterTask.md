---
name: agent-left-temporary-files-or-clones-in-tmp-without-cleanup
description: Agent creates temporary directories, clones, or files in /tmp (or working dir) for a task but does not clean them up after successful completion, leading to disk waste and potential stale state on next run.
---

# AgentLeftTemporaryFilesOrClonesInTmpWithoutCleanupAfterTask

## Nima uchun bu skill kerak
Vaqtinchalik fayllar, clone'lar va ishchi papkalar (/tmp/skills-repo kabi) vazifa tugagandan keyin tozalanmasa, keyingi ishga kirishda eski holat aralashadi, disk to'ladi va agent noto'g'ri ma'lumot bilan ishlaydi. Bu ayniqsa takroriy avtomatlashtirish (har soatda skill yaratish) da muhim.

## Simptom (aynan shu)
- Vazifa muvaffaqiyatli tugaganidan keyin /tmp/skills-repo yoki boshqa vaqtinchalik papka o'chirilmagan.
- Keyingi clone yoki ishda "already exists" yoki eski fayllar aralashadi.
- Disk foydalanishi o'sib boradi.
- Hisobotda cleanup qadami yo'q.
- rm -rf /tmp/skills-repo buyrug'i faqat boshida ishlatilgan, oxirida yo'q.

## Sabab (100%)
Agent "vazifa bajarildi" deb hisobot yozadi va tozalashni unutadi. U faqat boshlanishdagi cleanup'ga e'tibor beradi, tugashdagi holatni saqlash yoki tozalashni rejalashtirmaydi. "Ishladi" degani "tozalash shart emas" deb o'ylaydi.

## Tasdiqlash
1. Vazifa oxirida `ls /tmp/skills-repo` yoki `du -sh /tmp/*` bilan tekshir.
2. Hisobotda cleanup qadami bor-yo'qligini ko'r.
3. Keyingi ishga kirishdan oldin eski papka mavjudligini tekshir.

## Tuzatish (aynan shu)
Har bir vaqtinchalik ish (clone, generate, test) oxirida majburiy tozalash qo'sh:

```bash
# Ish boshida (allaqachon bor)
rm -rf /tmp/skills-repo

# ... ishni bajar ...

# Ish oxirida, hisobotdan oldin
rm -rf /tmp/skills-repo
# Yoki faqat kerakli bo'lsa: rm -rf /tmp/skills-repo/.git /tmp/temp-*
```

Agar papka keyingi qadam uchun kerak bo'lsa (masalan, push qilgandan keyin), uni hisobotda ayt va keyingi ishda albatta tozala.

Qoidalar:
- /tmp dagi narsalar "ephemeral" — vazifa tugasa o'chir.
- Working dir (/workspace/artifacts) da faqat foydalanuvchiga kerakli deliverable qoldir.
- Hisobotda "cleanup qilindi" deb yoz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Vaqtinchalik papka va fayllarni vazifa tugagandan keyin albatta tozala. Bu stale state va disk isrofiga yo'l qo'ymaydi. Har soatlik yoki takroriy agent ishlarida ayniqsa muhim.
