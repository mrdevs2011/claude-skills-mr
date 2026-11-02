---
name: agent-editfile-without-replace-all
description: Agent edit_file tool'ini bir xil matn bir necha joyda bo'lganda replace_all=true o'rnatmasdan chaqirdi, natijada faqat birinchi o'rin o'zgardi va qolganlari qoldi.
---

# edit_file'da replace_all yo'q: bir nechta bir xil o'rin to'liq yangilanmadi

## Nima uchun bu skill kerak
Agent faylni o'zgartirganda `edit_file` (yoki replace) tool'ini ishlatadi. Agar bir xil `old_string` faylda bir necha marta uchrasa va `replace_all` false (default) bo'lsa, faqat birinchi topilgan o'rin almashtiriladi. Qolganlari o'zgarmaydi — agent "hammasi yangilandi" deb o'ylaydi, lekin aslida qisman.

## Simptom (aynan shu)
- `edit_file` chaqiruvi muvaffaqiyatli (exit 0), lekin keyingi `read_file` yoki test ko'rsatadiki, bir xil matnning faqat birinchi nusxasi o'zgargan.
- Masalan: config'da bir xil URL, import, yoki placeholder bir necha joyda, faqat biri yangilangan.
- Agent "replace qildim" deydi, lekin full diff yoki to'liq o'qishda qolganlari eski.

## Sabab (100%)
`edit_file` tool'ida `replace_all` parametri default `false`. Agent uni o'rnatmadi yoki true qilmadi. Tool birinchi mos kelgan `old_string`ni almashtirib to'xtadi.

## Tasdiqlash
1. `edit_file` chaqiruvi logini tekshir: `replace_all` bor-yo'q va qiymati.
2. Faylni to'liq `read_file` bilan o'qi (limit/offset ishlatib).
3. `old_string` qancha marta qolganini qidir (grep yoki o'qib).
4. Agar bir nechta qolgan bo'lsa va `replace_all` false edi — bu skill.

## Tuzatish (aynan shu)
Agar bir xil matnni hamma joyda almashtirish kerak bo'lsa, `replace_all: true` ber:

```json
{
  "file_path": "/path/to/file.py",
  "old_string": "old_placeholder",
  "new_string": "new_value",
  "replace_all": true
}
```

Agar faqat bitta aniq o'rinni (context bilan) o'zgartirish kerak bo'lsa — `old_string`ni yetarlicha uzun va unique qilib yoz (atrofdagi qatorlar bilan), `replace_all` false qoldir.

Har doim oldin `read_file` qilib, qancha marta uchrashini bil, keyin qaror qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `edit_file` default faqat birinchi mos kelganini almashtiradi.
- Bir nechta bir xil o'rinni to'liq yangilash uchun `replace_all: true` majburiy.
- Avval faylni o'qib, nechta marta uchrashini tasdiqla, keyin to'g'ri parametr bilan chaqir.
