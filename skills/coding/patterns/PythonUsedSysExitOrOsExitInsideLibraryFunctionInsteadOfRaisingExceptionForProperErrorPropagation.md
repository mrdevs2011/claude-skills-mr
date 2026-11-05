---
name: python-used-sys-exit-or-os-exit-inside-library-function-instead-of-raising-exception
description: Library yoki helper funksiya ichida sys.exit() yoki os._exit() ishlatilganda dastur butunlay to'xtaydi, chaqiruvchi kod xatoni ushlab, tozalash yoki qayta urinish imkoniyatidan mahrum bo'ladi.
---

# Python library funksiyasida sys.exit yoki os._exit ishlatish

## Nima uchun bu skill kerak
Kutubxona yoki qayta ishlatiladigan funksiya ichida to'g'ridan-to'g'ri chiqish (sys.exit / os._exit) butun jarayonni to'xtatadi. Bu test, CLI wrapper, web handler yoki agent oqimida xatoni ushlash, loglash yoki graceful degradation imkonini yo'qotadi.

## Simptom (aynan shu)
Funksiya chaqirilganda (masalan, validatsiya xatosi yoki missing config) dastur to'satdan 0 yoki 1 exit kod bilan tugaydi. Traceback yo'q yoki to'liq emas, chaqiruvchi try/except ishlamaydi, cleanup (fayl yopish, connection) bajarilmaydi. Test runner yoki parent process kutmagan holda o'ladi.

## Sabab (100%)
`sys.exit()` `SystemExit` exception ko'taradi, lekin ko'p hollarda u ushlanmaydi yoki kutubxona kontekstida noto'g'ri ishlatiladi. `os._exit()` esa darhol jarayonni o'ldiradi, hech qanday exception, atexit, yoki finally ishlamaydi. Library funksiyasi dastur oqimini boshqarmasligi kerak — u faqat xato signal berishi kerak.

## Tasdiqlash
1. Funksiya ichida `sys.exit(`, `os._exit(`, `exit(` qidir.
2. Bu funksiya library/module sifatida import qilinib boshqa joydan chaqiriladimi (main guard ostida emas).
3. Chaqiruvchi kodda try/except SystemExit yoki Exception bor-yo'qligini tekshir — ko'pincha yo'q.
4. `python -c "from module import func; func()"` bilan chaqirib, jarayon to'xtayotganini kuzat.

## Tuzatish (aynan shu)
Library funksiyasida chiqish o'rniga aniq exception ko'tar. Chaqiruvchi (CLI main, handler) uni ushlab, kerakli exit kod bilan chiqsin.

```python
# Noto'g'ri
def load_config(path: str) -> dict:
    if not path.exists():
        sys.exit(1)  # yoki os._exit(1)
    return json.loads(path.read_text())

# To'g'ri
class ConfigError(Exception):
    pass

def load_config(path: Path) -> dict:
    if not path.exists():
        raise ConfigError(f"Config not found: {path}")
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid JSON in {path}") from e

# Chaqiruvchi (masalan CLI)
def main() -> None:
    try:
        cfg = load_config(Path("config.json"))
        # ishlat
    except ConfigError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
```

Agar faqat CLI script bo'lsa va library emas — `if __name__ == "__main__":` ostida qoldir, lekin public funksiyalarda emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Library yoki helper funksiya hech qachon `sys.exit` / `os._exit` chaqirmasligi kerak. Xatoni exception orqali signal ber, chiqish qarorini eng yuqori darajadagi chaqiruvchi (main, handler, agent) qabul qilsin. Bu test qilinish, error handling va composabilityni saqlaydi.
