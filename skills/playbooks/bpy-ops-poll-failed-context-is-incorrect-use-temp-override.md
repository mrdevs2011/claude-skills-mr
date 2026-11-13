---
name: bpy-ops-poll-failed-context-is-incorrect-use-temp-override
description: RuntimeError Operator bpy.ops.poll() failed, context is incorrect — use bpy.context.temp_override (Blender 3.2+) to set area/object/mode. Dict override deprecated/removed in 4.0.
id: bpy-ops-poll-failed-context-is-incorrect-use-temp-override
type: playbook
stack: Blender Python API 4.x (temp_override since 3.2, dict override removed in 4.0)
confirmed_on: 2026-11-13
confidence: high (official docs)
triggers:
  - RuntimeError: Operator bpy.ops.*.poll() failed, context is incorrect
  - bpy.ops poll failed context incorrect
  - blender python operator context error
  - temp_override blender
  - bpy.context.temp_override
  - poll() failed, context is incorrect
  - blender script operator needs area override
  - DeprecationWarning passing context overrides is deprecated
  - how to call bpy.ops from script without UI context
  - blender background mode operator fails
related:
  - playbooks/python-runtimeerror-event-loop-is-closed-after-loop-close-use-asyncio-run.md
---

# bpy.ops poll() failed, context is incorrect — temp_override ishlat

## TL;DR
Simptom: `RuntimeError: Operator bpy.ops.xxx.poll() failed, context is incorrect`
Sabab: operator poll funksiyasi hozirgi context (area, active object, mode) ga mos kelmaydi.
Birinchi buyruq: `import bpy; print(bpy.context.area.type if bpy.context.area else "no area")`
Done: operator `with bpy.context.temp_override(...):` ichida xatosiz ishlaydi.

## Qachon ishlatish / ishlatmaslik
Ishlat: bpy.ops.xxx chaqirganda "poll() failed, context is incorrect" chiqsa, yoki background/script rejimida operator ishlamasa.
Ishlatma: oddiy data API (bpy.data, bmesh) ishlayotganida — operatorlar o'rniga data API afzal. Yoki Blender < 3.2 da (temp_override yo'q).

## Mental model (nima uchun)
[SRC:https://docs.blender.org/api/current/info_gotchas_operators.html @ current, 2026-11] Operatorlar UI kontekstiga bog'langan: area type, active object, mode, selection. Script/background da context bo'sh yoki noto'g'ri. Poll muvaffaqiyatsiz bo'lsa RuntimeError. [SRC:https://docs.blender.org/api/current/bpy.types.Context.html#bpy.types.Context.temp_override @ current] 3.2+ dan `temp_override` context manager bilan vaqtincha override qilinadi. Eski dict override 3.2 da deprecated, 4.0 da olib tashlangan. [not verified sandbox]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini tekshir: `RuntimeError: Operator bpy.ops.XXX.poll() failed, context is incorrect`  
   EXPECTED: aynan shu. Agar boshqa xato → boshqa skill.  
   Agar ha → 2.

2. Hozirgi contextni ko'r:  
   ```python
   import bpy
   print("area:", bpy.context.area.type if bpy.context.area else None)
   print("mode:", bpy.context.mode)
   print("active:", bpy.context.active_object)
   ```  
   EXPECTED: area None yoki noto'g'ri type, yoki object yo'q.  
   Agar area VIEW_3D va object bor → 3.  
   Agar yo'q → override kerak.

3. Blender versiyasini tekshir: `print(bpy.app.version)`  
   EXPECTED: (3, 2, 0) yoki yuqori. Agar < 3.2 → eski usul (dict), lekin 4.0+ da ishlamaydi. [SRC: release notes 3.2]

4. Operator docsini o'qi: `help(bpy.ops.XXX)` yoki API saytida poll shartlarini top.  
   EXPECTED: qaysi context member kerakligi (area, object, mode).

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): area/object/mode noto'g'ri.  
Fix (3.2+):  
```python
import bpy
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        with bpy.context.temp_override(area=area):
            bpy.ops.mesh.primitive_cube_add()
        break
```
Yoki active object:  
```python
obj = bpy.data.objects['Cube']
with bpy.context.temp_override(active_object=obj, selected_objects=[obj]):
    bpy.ops.object.delete()
```
Tekshir: xato yo'q, operator return {'FINISHED'}.

Sabab 2: eski dict usuli (4.0 da ishlamaydi).  
Yangi: `with context.temp_override(**override):`  
Eski: `bpy.ops.xxx(override_dict)` — deprecated. [SRC: https://docs.blender.org/api/3.5/bpy.ops.html]

## Agentlar qayerda xato qiladi
1. Har doim `bpy.ops` chaqirib, contextni tekshirmaydi — data API ishlatish o'rniga.
2. Eski `bpy.ops.xxx({"active_object": obj})` usulini 4.x da ishlatadi, deprecation yoki xato.
3. Faqat area ni override qiladi, lekin region yoki object ham kerak bo'lsa.
4. Background mode da window/area yo'qligini hisobga olmaydi.
5. Poll message ni o'qimaydi (ba'zida "No active object" kabi aniqroq).

## Edge cases
1. Blender 3.2 dan oldin: temp_override yo'q, dict override ishlat. [SRC: 3.2 release notes]
2. Ba'zi operatorlar override qilinmaydi (masalan ba'zi modifier). [SRC: gotchas]
3. Nested temp_override ishlaydi, lekin window/area consistency kerak.
4. Background (`blender -b`) da area yo'q — ba'zi operatorlar umuman ishlamaydi, data API ishlat. [not verified]

## Done criteria
```python
# Operator xatosiz ishlashi
with bpy.context.temp_override(area=view3d_area):
    result = bpy.ops.mesh.primitive_cube_add()
assert result == {'FINISHED'}
# Yoki active object o'zgarganini tekshir
```

## If still failing
- Operator source kodida poll funksiyasini o'qi (Python operators uchun oson).
- Data API ga o't: bmesh, bpy.data o'rniga ops.
- Log: `bpy.context.temp_override(...).logging_set(True)`
- Blender bug tracker ga xabar ber agar operator script dan ishlashi kerak bo'lsa.

## Sources + confidence
- [SRC:https://docs.blender.org/api/current/info_gotchas_operators.html @ current 2026-11] high
- [SRC:https://docs.blender.org/api/current/bpy.types.Context.html#bpy.types.Context.temp_override @ current] high
- [SRC:https://developer.blender.org/docs/release_notes/3.2/python_api/ @ 3.2] high
- [SRC:https://docs.blender.org/api/3.5/bpy.ops.html @ 3.5] high
- Sandbox repro: [not verified] — blender o'rnatilmagan.
