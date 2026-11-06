---
name: agent-used-inexact-old-string-in-edit-file
description: edit_file yoki replace tool old_string aniq mos kelmasa o'zgartirish bo'lmaydi yoki xato beradi. Faylni to'liq o'qib aniq matnni nusxa olish kerak.
---

# Agent edit_file da noaniq old_string ishlatib o'zgartirish amalga oshmagan

## Nima uchun bu skill kerak
Agentlar ko'pincha fayl mazmunini xotiradan yoki qisman o'qishdan taxmin qilib old_string yozadi. Bu holatda tool "no match" yoki hech narsa o'zgarmaydi, vaqt yo'qotiladi va xato holat yuzaga keladi. Aniq moslik majburiy.

## Simptom (aynan shu)
- `edit_file` yoki shunga o'xshash replace tool chaqiriladi.
- Natija: "old_string not found", "no changes made", yoki fayl o'zgarmagan.
- old_string da bo'shliq, yangi qator, yoki qisman matn farqi bor (masalan, indent yoki comment yo'qolgan).

## Sabab (100%)
Faylni `read_file` bilan to'liq (yoki kerakli qismni limit/offset bilan) o'qimasdan, old_string ni xotiradan yoki qisman ko'rinishdan yozish. Tool aniq string match talab qiladi — bir belgi farqi yetarli.

## Tasdiqlash
1. Tool chaqiruv logida old_string ni ko'r.
2. `read_file` bilan shu faylni ochib, aynan shu matn bor-yo'qligini solishtir.
3. Agar bo'shliq yoki qator farqi bo'lsa — sabab tasdiqlanadi.

## Tuzatish (aynan shu)
Har doim avval `read_file` bilan faylni o'qi (kerakli qism uchun offset/limit ishlat). Keyin old_string ni o'qilgan chiqishdan aniq nusxa ol (whitespace, newlines saqlab).

Misol (to'g'ri tartib):

```python
# 1. Avval o'qi
read_file(file_path="example.py", offset=10, limit=20)

# 2. Chiqishdan aniq matnni ol (masalan):
#     def process(data):
#         return data * 2

# 3. edit_file da shu aniq matnni ishlat
edit_file(
    file_path="example.py",
    old_string="    def process(data):\n        return data * 2",
    new_string="    def process(data):\n        return data * 2  # optimized"
)
```

Noto'g'ri: xotiradan "def process(data): return data * 2" yozish (indent yo'q).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
edit_file ishlashi uchun old_string fayldagi matn bilan 100% mos bo'lishi shart. Doim avval read_file qilib aniq nusxa ol, taxmin qilma. Bu oddiy xatolarni oldini oladi va tool ishonchliligini oshiradi.
