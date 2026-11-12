---
id: ydotool-mousemove-absolute-mode-crashes-immediately-use-relative-or-click-at
name: ydotool-mousemove-absolute-mode-crashes-immediately-use-relative-or-click-at
description: ydotool mousemove -a yoki --absolute bu tizimda darhol crash beradi — ishlatma, relative yoki click-at.sh ishlat
type: playbook
stack: ydotool (any) + this system (Niri/Wayland)
confirmed_on: 2026-11-12
confidence: high for the prohibition (repo rule); medium for crash mechanism (not reproduced here)
triggers:
  - ydotool mousemove -a crash
  - ydotool absolute mode crashes the system
  - ydotool mousemove --absolute darhol crash
  - absolute mouse move with ydotool fails or freezes
  - ydotool -a mousemove system crash
  - do not use ydotool absolute
  - ydotool mousemove absolute mode crash beradi
  - click coordinate with ydotool absolute
  - ydotool mousemove -a ISHLATMA
  - absolute positioning ydotool Wayland crash
related:
  - productivity/AgentDidNotUseKaTeXForSymbolicTechnicalContentInResponseLeadingToPlainTextFormulas.md
---

# ydotool mousemove -a (absolute) bu tizimda darhol crash beradi — ishlatma

## TL;DR
Simptom: `ydotool mousemove -a X Y` yoki `--absolute` chaqirilsa tizim (yoki ydotoold) darhol crash qiladi, UI avtomatlashtirish to'xtaydi.
Sabab: bu tizimda absolute mode ishonchsiz/crashli (Wayland/Niri + uinput + hot-corner/accel muammolari). [REPO:instruction.md]
Birinchi buyruq: `grep -n 'ydotool mousemove -a' ~/Claude/.skills/my-computer/../instruction.md` yoki repo `instruction.md` ni o'qi — "ISHLATMA -- bu tizimda darhol crash beradi".
Done: absolute ishlatilmaydi, o'rniga relative yoki `~/Claude/.bin/click-at/click-at.sh` ishlatiladi, crash yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: koordinataga bosish, UI elementga click, mouse move so'ralganda ydotool absolute sinashga urinilsa.
Ishlatma: oddiy keyboard shortcut (`ydotool key`), type, yoki to'g'ridan-to'g'ri buyruq/URL yetarli bo'lsa. X11 da ishlashi mumkin, lekin bu tizimda taqiqlangan.

## Mental model (nima uchun)
[REPO:instruction.md L469] "ydotool mousemove -a (absolute mode) ISHLATMA -- bu tizimda darhol crash beradi. To'g'ri yo'l: ... click-at.sh".
[SRC:https://github.com/ReimuNotMoe/ydotool/issues/250 @ 2024-07, 2026-11] Absolute mode ko'pincha (0,0) ga olib boradi, hot-corner, mouse accel, multi-monitor, Wayland da noto'g'ri ishlaydi. Ba'zi setuplarda crash yoki freeze.
[SRC:https://manpages.debian.org/unstable/ydotool/ydotool.1.en.html @ 2026-01-18] Man page `-a/--absolute` ni hujjatlashtiradi, lekin tizim-spetsifik cheklovlar bor. [not verified: crash o'zi sandboxda qayta ishlab chiqarilmadi, ydotool yo'q]

## Diagnosis tree (arzonidan qimmatiga)
1. Repo qoidasini tekshir: `grep -A2 -B2 'ydotool mousemove -a' /tmp/skills-repo/instruction.md` (yoki clone'da)  
   EXPECTED: "ISHLATMA -- bu tizimda darhol crash beradi". Agar shunday → absolute taqiqlangan, 4-ga o't.  
   Agar topilmasa → 2.

2. Man page / help: `ydotool mousemove --help` (agar o'rnatilgan bo'lsa)  
   EXPECTED: `-a, --absolute` ko'rsatadi. Lekin tizim qoidasi ustun. [not verified]

3. Crashni qayta ishlab chiqarishga urinma (xavfli). O'rniga: `ydotool mousemove -x 10 -y 10` (relative) sinab ko'r.  
   EXPECTED: relative ishlaydi, absolute crash. Agar relative ham ishlamasa → ydotoold ishlamayapti, socket tekshir.

4. Alternativni ishlat: `ls ~/Claude/.bin/click-at/click-at.sh` (kompyuterda)  
   EXPECTED: skript mavjud. Uni ishlat, absolute emas.

## Fix har bir sabab uchun
Sabab 1 (asosiy): absolute mode crash.  
Fix: hech qachon `-a` / `--absolute` ishlatma.  
Relative:  
```bash
ydotool mousemove -x 100 -y 50
```
Yoki tayyor skript (repo qoidasi):  
```bash
# kompyuterda
~/Claude/.bin/click-at/click-at.sh X Y
```
Tekshir: crash yo'q, mouse/click ishlaydi. [SANDBOX: ydotool yo'q, faqat qoida tasdiqlandi]

Agar man page'ga ishonib absolute yozgan bo'lsang: o'chir, relative yoki click-at ga almashtir.

## Agentlar qayerda xato qiladi
1. Man page yoki GitHub README dagi `ydotool mousemove --absolute 100 100` ni ko'rib, tizim qoidasini tekshirmay ishlatadi → crash.
2. Absolute ishlamayotganda qayta-qayta urinadi, relative yoki click-at.sh ni o'qimaydi.
3. Crashni "bug" deb hisoblab, ydotool ni qayta o'rnatishga urinadi, o'rniga taqiqlangan flag ni tashlab yuboradi.
4. Sandbox va user computer farqini unutib, sandboxda absolute sinaydi.

## Edge cases
1. X11 sessiyada absolute ishlashi mumkin (ba'zi issues), lekin bu tizim (Niri/Wayland) da crash. [SRC:issues] [not verified]
2. ydotoold ishlamayotgan bo'lsa, absolute ham relative ham xato beradi — avval daemon. Socket: `YDOTOOL_SOCKET`.
3. Multi-monitor da absolute noto'g'ri ekranga boradi. [SRC:issue #164]
4. Mouse acceleration yoqilgan bo'lsa, absolute/relative buziladi — flat profile. [SRC:issues]

## Done criteria
```bash
# Qoida o'qilgani isboti
grep -q 'ydotool mousemove -a' instruction.md && echo "rule found"
# Kodda absolute yo'q
! grep -q 'mousemove.*-a\|--absolute' your_script.sh && echo "no absolute"
# click-at ishlatilgan (agar koordinata kerak)
# crash yo'q, UI amal bajarildi
```
Agar absolute ishlatilsa, done emas.

## Agar hali ham ishlamasa
- `cat ~/Claude/.skills/my-computer/koordinataga-bosish.md` (LOKAL) o'qi.
- Relative + key bilan almashtir.
- To'g'ridan-to'g'ri buyruq/URL yetarli bo'lsa, mouse umuman ishlatma.
- ydotoold status: `pgrep ydotoold`.

## Sources + confidence
- [REPO:instruction.md] qoida, 2026-11-12 clone. Confidence high.
- [SRC:https://github.com/ReimuNotMoe/ydotool/issues/250] absolute muammolari.
- [SRC:https://manpages.debian.org/unstable/ydotool/ydotool.1.en.html] man page.
- Crash o'zi [not verified] sandboxda (ydotool yo'q, headless).
Confidence: high for "do not use -a", medium overall.
