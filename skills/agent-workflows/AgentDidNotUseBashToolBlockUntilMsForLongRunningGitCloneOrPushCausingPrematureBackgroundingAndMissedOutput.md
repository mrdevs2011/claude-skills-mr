---
name: agent-did-not-use-bash-tool-block-until-ms-for-long-running-git-clone-or-push
description: Agent git clone yoki push kabi uzoq davom etadigan buyruqlarni bash tool bilan chaqirganda block_until_ms ni yetarli qilib o'rnatmagan, natijada buyruq backgroundga o'tib, to'liq output yoki exit code ko'rilmagan.
---

# Agent long-running git buyruqlarida block_until_ms ni yetarli o'rnatmagan

## Nima uchun bu skill kerak
Git clone, push yoki boshqa tarmoqqa bog'liq uzoq buyruqlar ba'zan bir necha soniya davom etadi. Agar bash tool'da block_until_ms default (30s) yoki past bo'lsa, buyruq backgroundga o'tadi va agent to'liq natija, exit code yoki xatoni ko'rmay, muvaffaqiyat deb taxmin qilishi mumkin.

## Simptom (aynan shu)
- `git clone` yoki `git push` chaqiruvidan keyin tool natijasi "backgrounded" yoki partial output ko'rsatadi.
- Agent exit code 0 ni tasdiqlamasdan "push muvaffaqiyatli" deb hisobot yozadi.
- To'liq clone yoki push logi (masalan "Enumerating objects", "Writing objects") ko'rilmagan.
- Keyinchalik remote'da o'zgarish yo'qligi aniqlanadi.

## Sabab (100%)
Agent bash tool'ning block_until_ms parametrini uzoq buyruqlar uchun oshirmaydi yoki get_terminal_command_output bilan background taskni kutmaydi. Natijada to'liq natija olinmaydi.

## Tasdiqlash
- Bash tool chaqiruvida block_until_ms qiymati buyruq uchun yetarlimi (clone/push uchun 60s+)?
- Agar background bo'lsa, get_terminal_command_output bilan to'liq output va exit code tekshirilganmi?
- Hisobotda aniq "push muvaffaqiyatli" deyilganmi, lekin exit code ko'rilmaganmi?

## Tuzatish (aynan shu)
Uzoq davom etishi mumkin bo'lgan buyruqlar uchun block_until_ms ni oshiring yoki background bo'lsa, to'liq natijani kuting.

Misol:
```python
# Noto'g'ri (default 30s yetmasligi mumkin):
# bash command="git push origin main" 

# To'g'ri:
# bash command="git push origin main" block_until_ms=120000
# yoki agar background bo'lsa:
# get_terminal_command_output task_ids=["..."] timeout_ms=60000
```

Har doim exit code 0 va kutilgan output ("Everything up-to-date" yoki "branch main -> main") ni tasdiqlang. Agar xato bo'lsa, aniq xato matnini hisobotda yozing, success deb yozmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Uzoq git buyruqlarida bash tool'ni to'liq natija olish uchun block_until_ms oshirish yoki background taskni alohida kutish kerak; aks holda noto'g'ri muvaffaqiyat hisoboti beriladi.
