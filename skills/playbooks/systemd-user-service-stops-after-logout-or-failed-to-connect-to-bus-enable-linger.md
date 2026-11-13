---
id: systemd-user-service-stops-after-logout-or-failed-to-connect-to-bus-enable-linger
name: systemd-user-service-stops-after-logout-or-failed-to-connect-to-bus-enable-linger
description: systemctl --user "Failed to connect to bus: No medium found" yoki user service logoutdan keyin to'xtaydi — loginctl enable-linger + runtime dir
type: playbook
stack: systemd 252 (Debian 12 bookworm) + loginctl
confirmed_on: 2026-11-13
confidence: high for docs and sandbox error; medium for full linger persistence (not fully reproduced in container)
triggers:
  - Failed to connect to bus: No medium found
  - systemctl --user status bus error
  - user service stops after logout
  - loginctl enable-linger
  - systemctl --user Failed to connect to bus
  - systemd user manager stops on logout
  - /run/user uid bus missing
  - linger not enabled user service dies
  - systemctl --user No medium found
  - user@uid.service not running after logout
related:
  - playbooks/bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output.md
---

# systemctl --user "Failed to connect to bus" yoki user service logoutdan keyin to'xtaydi — enable-linger

## TL;DR
Simptom: `systemctl --user ...` "Failed to connect to bus: No medium found" beradi, yoki user service (systemctl --user) logoutdan keyin to'xtaydi.
Sabab: user manager (user@UID.service) faqat login sessiyada ishlaydi; linger yo'q, runtime dir / bus yo'q. [SRC:man loginctl]
Birinchi buyruq: `loginctl show-user $(id -u) --property=Linger`
Done: Linger=yes, systemctl --user ishlaydi, service logoutdan keyin ham active.

## Qachon ishlatish / ishlatmaslik
Ishlat: Linux systemd da user service (systemctl --user) ishlatayotganda bus xatosi yoki logoutdan keyin to'xtash.
Ishlatma: system service (systemctl without --user), non-systemd init, yoki faqat nohup/tmux yetarli bo'lsa. Sandbox/container da to'liq logind bo'lmasa [not verified].

## Mental model (nima uchun)
[SRC:https://manpages.debian.org/bookworm/systemd/loginctl.1.en.html @ systemd 252, 2026-11-13] enable-linger: user manager bootda spawn va logoutdan keyin saqlanadi, long-running user services uchun.
Default: last session tugaganda user@UID.service to'xtaydi (UserStopDelaySec ~10s), /run/user/UID va bus yo'qoladi.
Bus xatosi: XDG_RUNTIME_DIR yoki DBUS_SESSION_BUS_ADDRESS yo'q, yoki user manager ishlamayapti. [SANDBOX: systemctl --user status → "Failed to connect to bus: No medium found"]
[SRC:https://github.com/systemd/systemd/issues/8486] KillUserProcesses user session ga, user manager alohida; linger kerak.

## Diagnosis tree (arzonidan qimmatiga)
1. Bus xatosini tasdiqla: `systemctl --user status 2>&1 | head -1`  
   EXPECTED: "Failed to connect to bus: No medium found" yoki "No such file or directory". Agar shunday → 2. Agar ishlasa → linger tekshir (3).

2. Runtime dir / env: `echo $XDG_RUNTIME_DIR; ls -d /run/user/$(id -u) 2>&1`  
   EXPECTED: /run/user/UID yoki "No such file". Yo'q → linger yo'q yoki sessiyasiz. [SANDBOX: systemctl --user shu xato]

3. Linger holati: `loginctl show-user $(id -u) --property=Linger 2>&1`  
   EXPECTED: Linger=yes yoki no. no → 4 (enable). Sandboxda "System has not been booted with systemd" mumkin [SANDBOX].

4. User manager: `systemctl status user@$(id -u).service --no-pager 2>&1 | head -3`  
   EXPECTED: active yoki inactive. inactive + linger=no → enable-linger.

5. Bus socket: `ls /run/user/$(id -u)/bus 2>&1`  
   EXPECTED: socket mavjud. Yo'q → env set + manager ishga tushir.

## Fix har bir sabab uchun
Sabab 1 (asosiy): linger yo'q, user manager logoutda to'xtaydi.  
Fix (sudo kerak bo'lishi mumkin):  
```bash
sudo loginctl enable-linger $(id -un)
loginctl show-user $(id -u) --property=Linger   # EXPECTED: Linger=yes
ls /var/lib/systemd/linger/$(id -un)            # fayl mavjud
```
Keyin logout/login yoki: `sudo systemctl start user@$(id -u).service`

Sabab 2: env yo'q (sudo -u yoki headless).  
```bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
export DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus
systemctl --user status   # EXPECTED: ishlaydi
```
[SRC:man + common fixes]

Sabab 3: systemctl --user ni sudo bilan ishlatish.  
Do not: `sudo systemctl --user ...`. O'rniga sudo -u user with env, yoki oddiy user.

Tekshir: `systemctl --user is-active your.service` → active. Logoutdan keyin ham (linger bilan).

## Agentlar qayerda xato qiladi
1. `sudo systemctl --user start foo` ishlatadi → bus xatosi, sudo shart emas. [SRC:systemd#35467]
2. Linger o'rniga nohup/tmux ishlatadi, lekin systemctl --user unit uchun yetarli emas.
3. XDG_RUNTIME_DIR set qilmay, bus yo'q deb unit faylni qayta yozadi.
4. Sandbox/container da logind yo'qligini "systemd buzilgan" deb o'ylaydi.

## Edge cases
1. Root user: linger kamroq kerak, lekin /run/user/0 mumkin. [not verified]
2. KillUserProcesses=yes (logind.conf): session processes o'ladi, lekin linger user manager ni saqlaydi. [SRC:logind.conf]
3. LXC/container: PID 1 systemd emas → "System has not been booted with systemd" [SANDBOX]. Full host kerak.
4. dbus-user-session package yo'q: bus umuman ishlamasligi mumkin.

## Done criteria
```bash
loginctl show-user $(id -u) --property=Linger | grep -q yes && echo "linger ok"
systemctl --user status >/dev/null 2>&1 && echo "bus ok" || echo "bus fail"
# service uchun: systemctl --user is-active myservice.service == active
# logoutdan keyin ham (hostda) active qoladi
```
Agar Linger=no yoki bus fail → done emas.

## Agar hali ham ishlamasa
- `journalctl --user -xe` (agar bus ishlasa) yoki `journalctl -u user@$(id -u).service`
- `sudo apt install dbus-user-session libpam-systemd` (Debian)
- machinectl shell user@ yoki to'liq login sessiyasi
- System service (User= in unit) ga o'tkaz, agar root kerak bo'lsa

## Sources + confidence
- [SRC:https://manpages.debian.org/bookworm/systemd/loginctl.1.en.html @ systemd 252, 2025-08-ish] enable-linger description. Confidence high.
- [SANDBOX: Debian 12, systemd 252] systemctl --user → "Failed to connect to bus: No medium found"; loginctl → "System has not been booted with systemd". [not verified: full linger persistence]
- [SRC:https://github.com/systemd/systemd/issues/8486] linger vs KillUserProcesses.
- Common "No medium found" fixes from man and community. Confidence medium-high.
