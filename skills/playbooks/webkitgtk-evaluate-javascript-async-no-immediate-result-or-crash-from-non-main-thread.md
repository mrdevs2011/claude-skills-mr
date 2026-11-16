---
name: webkitgtk-evaluate-javascript-async-no-immediate-result-or-crash-from-non-main-thread
description: WebKitGTK evaluate_javascript is asynchronous (returns None immediately), requires callback + evaluate_javascript_finish, and must run on the GTK main thread (else segfault or silent fail). run_javascript is deprecated since 2.40.
id: webkitgtk-evaluate-javascript-async-no-immediate-result-or-crash-from-non-main-thread
type: playbook
stack: WebKitGTK 2.40+ (evaluate_javascript), PyGObject (gi.repository.WebKit2 or WebKit), GTK 3.x/4.x
confirmed_on: 2026-11-16
confidence: medium (official docs; runtime not verified in sandbox — no gi/WebKit installed)
triggers:
  - evaluate_javascript returns None or no result
  - webkit evaluate_javascript callback never called
  - TypeError or missing finish on evaluate_javascript
  - run_javascript is deprecated use evaluate_javascript
  - segfault or crash when calling evaluate_javascript from thread
  - WebKitGTK javascript not executing from background thread
  - GLib.idle_add for webview evaluate_javascript
  - webkit_web_view_evaluate_javascript_finish needed
  - JavaScript not running in WebView until main loop
  - enable-javascript false silences evaluate_javascript
related:
  - playbooks/python-pty-fork-child-reports-wrong-terminal-size-unless-tiocswinsz-on-master-fd.md
  - playbooks/bpy-ops-poll-failed-context-is-incorrect-use-temp-override.md
---

# WebKitGTK evaluate_javascript asinxron, darhol natija yo'q yoki non-main thread'da crash

## TL;DR
Simptom: `webview.evaluate_javascript(script)` chaqirilganda hech narsa qaytarmaydi (None), yoki JS ishlamaydi; yoki boshqa thread'dan chaqirilsa segfault/crash. Eski `run_javascript` deprecation ogohlantirish beradi.
Sabab: API asinxron (callback + finish kerak); GTK/WebKit faqat main thread'da xavfsiz; enable-javascript=False bo'lsa jim ishlamaydi.
Birinchi buyruq: `print(webview.get_settings().get_enable_javascript())`
Done: callback ichida `evaluate_javascript_finish` natija qaytaradi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: WebKit2/WebKit WebView'da JS ishga tushirishda natija olinmasa, yoki thread'dan crash bo'lsa, yoki run_javascript deprecated desang.
Ishlatma: oddiy web content o'z JS'ini ishlatayotganida (bu API inject/eval uchun). Yoki WebKit < 2.40 da (evaluate_javascript yo'q, eski run_javascript ishlat).

## Mental model (nima uchun)
[SRC:https://webkitgtk.org/reference/webkit2gtk/2.42.3/method.WebView.evaluate_javascript.html @ 2.42.3, 2023-12] `evaluate_javascript` asinxron: darhol qaytadi, natija callback orqali keladi. Keyin `evaluate_javascript_finish` chaqiriladi. world_name=None default world. source_uri exception'larda ko'rinadi. [SRC:https://webkitgtk.org/reference/webkit2gtk/stable/method.WebView.run_javascript.html] run_javascript 2.40 dan deprecated, evaluate_javascript ishlat. [SRC:https://bugs.webkit.org/show_bug.cgi?id=175855] GTK/WebKit thread-unsafe: faqat main thread'da (gtk.main() ishga tushirgan). Boshqa thread'dan GLib.idle_add orqali main'ga yubor. [not verified sandbox]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato/simptomni tekshir: None qaytishi, "callback never called", "deprecated: run_javascript", yoki segfault (non-main thread).  
   EXPECTED: yuqoridagilar. Agar boshqa xato (import, version) → boshqa skill.  
   Agar ha → 2.

2. enable-javascript tekshir:  
   ```python
   settings = webview.get_settings()
   print(settings.get_enable_javascript())
   ```  
   EXPECTED: True. Agar False → settings.set_enable_javascript(True); qayta sinov. Agar True → 3.

3. Main threadmi? (agar thread ishlatayotgan bo'lsang):  
   ```python
   import threading
   print(threading.current_thread() is threading.main_thread())
   ```  
   EXPECTED: True. Agar False → GLib.idle_add(wrapper_func) ishlat. Agar True → 4.

4. To'g'ri async pattern ishlatilganmi? Callback berilganmi?  
   Kodni ko'r: `evaluate_javascript(..., callback=my_callback)`.  
   EXPECTED: callback bor va ichida finish chaqiriladi. Agar yo'q → fix. 

## Fix per cause
**Cause 1: asinxron noto'g'ri ishlatilgan (darhol natija kutish)**  
```python
def on_js_done(webview, result, user_data):
    try:
        value = webview.evaluate_javascript_finish(result)
        if value is None:
            print("JS error or no result")
            return
        # jsc_value_to_string etc.
        print("Result:", value)
    except Exception as e:
        print("Finish error:", e)

webview.evaluate_javascript(
    script="document.title",
    length=-1,
    world_name=None,
    source_uri=None,
    cancellable=None,
    callback=on_js_done,
    user_data=None
)
# Main loop ishlashi kerak (Gtk.main() yoki GLib.MainLoop)
```
Re-check: callback chaqiriladi va finish natija beradi.

**Cause 2: non-main thread**  
```python
from gi.repository import GLib
def do_eval():
    webview.evaluate_javascript("alert('ok')", -1, None, None, None, on_js_done, None)
    return GLib.SOURCE_REMOVE
GLib.idle_add(do_eval)
```
Re-check: crash yo'q, JS ishlaydi.

**Cause 3: enable-javascript=False**  
```python
webview.get_settings().set_enable_javascript(True)
```
Re-check: JS ishlaydi.

## Where agents go wrong
1. `evaluate_javascript` ni sync deb o'ylab, return value'ni kutish (None).
2. Callback berish, lekin finish chaqirmaslik — natija yo'q.
3. Boshqa thread'dan to'g'ridan-to'g'ri chaqirish (segfault), idle_add ishlatmaslik.
4. run_javascript ishlatib deprecation e'tiborsiz qoldirish yoki eski API.

## Edge cases
1. JS exception: finish value bo'lishi mumkin, lekin context'da exception bor — jsc_context_get_exception tekshir.
2. world_name berilsa, alohida isolated world — default bilan aralashma.
3. enable-javascript-markup False bo'lsa ham bu API ishlaydi (content o'z JS'i emas).

## Done criteria
- Callback chaqiriladi va `evaluate_javascript_finish` xatosiz JSCValue (yoki None + error) qaytaradi.
- Main thread'da yoki idle_add orqali chaqiriladi, crash yo'q.
- `print(webview.get_settings().get_enable_javascript())` True.

## If still failing
- Versiyani tekshir: WebKit2 2.40+ yoki WebKit 6.0+. Eski run_javascript ishlat.
- Load finished bo'lmagan sahifada JS ishlamasligi mumkin — load-changed signal kut.
- Log: GLib warning'lar yoki console.

## Sources + confidence
[SRC:https://webkitgtk.org/reference/webkit2gtk/2.42.3/method.WebView.evaluate_javascript.html @ 2.42.3] async API, callback+finish.
[SRC:https://webkitgtk.org/reference/webkit2gtk/stable/method.WebView.run_javascript.html] deprecated 2.40.
[SRC:https://bugs.webkit.org/show_bug.cgi?id=175855] main thread only, GLib.idle_add.
Confidence: medium (docs clear, sandbox'da gi yo'q — not verified).
