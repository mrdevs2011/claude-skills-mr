---
name: android-agp9-hilt-compatibility-remove-kotlin-android-plugin
description: AGP 9 built-in Kotlin: remove org.jetbrains.kotlin.android plugin (no longer required), Hilt 2.59+ required, kotlin.sourceSets DSL not allowed, Failed to apply plugin, ComponentTreeDeps.
id: android-agp9-hilt-compatibility-remove-kotlin-android-plugin
type: playbook
stack: Android Gradle Plugin 9.x + Hilt 2.59+ + Kotlin 2.2+ (built-in)
confirmed_on: 2026-11-14
confidence: medium (official docs + sample file checks; Android build not verified in sandbox — no SDK)
triggers:
  - The 'org.jetbrains.kotlin.android' plugin is no longer required for Kotlin support since AGP 9.0
  - Failed to apply plugin 'org.jetbrains.kotlin.android'. Cannot add extension with name 'kotlin'
  - Using kotlin.sourceSets DSL to add Kotlin sources is not allowed with built-in Kotlin
  - Hilt Gradle Plugin does not work with AGP 9
  - Expected @AndroidEntryPoint to have a value. Did you forget to apply the Gradle Plugin?
  - AGP 9 Hilt version mismatch or ComponentTreeDeps missing
  - android built-in kotlin plugin conflict
  - hilt 2.58 with AGP 9 fails
  - remove kotlin-android for AGP 9
  - kotlin.sourceSets not allowed AGP 9
related:
  - none (first Android playbook)
---

# AGP 9 built-in Kotlin: kotlin-android pluginni olib tashla, Hilt 2.59+ talab qiladi

## TL;DR
Simptom: AGP 9 ga yangilaganingizdan keyin "plugin is no longer required" yoki "kotlin.sourceSets DSL not allowed" yoki Hilt plugin xatosi.
Sabab: AGP 9 Kotlinni ichki qo'llab-quvvatlaydi (built-in), eski plugin kerak emas; Hilt 2.59+ AGP 9 ni majburiy qiladi.
Birinchi buyruq: `grep -n "kotlin.android\|hilt\|agp" app/build.gradle.kts libs.versions.toml`
Done: plugin olib tashlangan, hilt >=2.59 (yoki 2.60+), build muvaffaqiyatli (Android Studio/Gradle da).

## Qachon ishlatish / ishlatmaslik
Ishlat: AGP 8.x dan 9.x ga o'tayotganda yoki yangi loyihada plugin xatosi, Hilt bilan, yoki "built-in Kotlin" xabari.
Ishlatma: AGP 8.x da (Hilt 2.58 yetarli), yoki KMP loyihalarda (alohida), yoki oddiy Java-only.

## Mental model (nima uchun)
[SRC:https://developer.android.com/build/migrate-to-built-in-kotlin @2026-09-16] AGP 9.0+ Kotlinni built-in qiladi va default yoqadi. Eski `org.jetbrains.kotlin.android` plugin conflict beradi. Hilt 2.59+ HiltGradlePlugin uchun AGP 9 ni talab qiladi (Gradle 9.1+ bilan). [SRC:https://github.com/google/dagger/releases/tag/dagger-2.59 ] [SRC:https://developer.android.com/build/releases/about-agp @2026-11-13] AGP 9.0 min Gradle 9.1.0. not verified in sandbox (Android SDK yo'q).

## Diagnosis tree (arzonidan qimmatiga)
1. Versiyalarni ko'r: `grep -E 'agp|hilt|kotlin' libs.versions.toml || cat gradle/libs.versions.toml`  
   EXPECTED: agp = "9.x", hilt >= "2.59". Agar hilt 2.58 va agp 9 → sabab. Agar agp 8 → bu skill emas.  
   Agar toml yo'q → build.gradle dan qara.

2. Pluginlarni tekshir: `grep -n "kotlin.android\|hilt.android\|built-in-kotlin" app/build.gradle.kts || true`  
   EXPECTED: agar AGP 9 da "org.jetbrains.kotlin.android" bor → olib tashlash kerak.  
   Agar "Using kotlin.sourceSets" xatosi → sourceSets ni android.sourceSets ga ko'chir.

3. Gradle versiyasi: `grep distributionUrl gradle/wrapper/gradle-wrapper.properties`  
   EXPECTED: gradle-9.1+ yoki yuqori. Agar 8.x → yangila. [SRC]

4. Xato matnini to'liq o'qi (build log). Agar "no longer required" → plugin olib tashla. Agar Hilt "AGP 9" → hilt yangila.

## Fix per cause
**Sabab 1: eski kotlin-android plugin**  
`app/build.gradle.kts` dan `id("org.jetbrains.kotlin.android")` qatorini olib tashla (yoki alias). Root build.gradle dan ham apply false ni olib tashla.  
Qayta tekshir: `grep kotlin.android app/build.gradle.kts` (bo'sh bo'lishi kerak).  
[SRC: migrate-to-built-in-kotlin]

**Sabab 2: Hilt versiya**  
libs.versions.toml da hilt = "2.60" (2.59 bugli bo'lishi mumkin). Sync qil.  
Agar AGP 8 da qolmoqchi bo'lsang → hilt 2.58.  
Qayta tekshir: versiya o'zgargan.

**Sabab 3: kotlin.sourceSets**  
Xato bo'lsa, `android.sourceSets` ishlat:  
```
android {
  sourceSets {
    named("main") { kotlin.directories.add("src/main/kotlin") }
  }
}
```  
Yoki KSP yangila (2.3+). Vaqtincha `android.disallowKotlinSourceSets=false` gradle.properties da. [SRC]

**Sabab 4: Gradle versiya**  
`./gradlew wrapper --gradle-version 9.1.0` yoki properties ni tahrirla.

## Where agents go wrong (>=3)
- Eski pluginni qoldirib, faqat versiyani oshiradi → conflict davom etadi.
- Hilt 2.59 ni tanlaydi (ComponentTreeDeps bug) o'rniga 2.60+.
- SourceSets xatosida faqat flag qo'yadi, to'g'ri DSL ga ko'chirmaydi.
- AGP 9 da Kotlin pluginni "kerak" deb o'ylaydi.

## Edge cases (>=2)
- KMP loyiha: built-in boshqacha, bu skill oddiy Android uchun.
- Opt-out: `android.builtInKotlin=false` qoldirsa, eski plugin kerak. [SRC]
- Jetifier enable=true AGP 9 da muammo (Hilt issue).
- not verified: to'liq build sandboxda ishlamaydi.

## Done criteria (proving commands)
- `grep -c "kotlin.android" app/build.gradle.kts` → 0
- `grep hilt libs.versions.toml` → 2.59 yoki yuqori
- Build logda plugin xatosi yo'q (user Android Studio da tasdiqlaydi)
- Sample: yuqoridagi grep bo'sh yoki to'g'ri versiya.

## If still failing
- To'liq build.gradle va toml ni qayta o'qi.
- Official migration: https://developer.android.com/build/migrate-to-built-in-kotlin
- Hilt setup: https://dagger.dev/hilt/gradle-setup.html
- search_skills boshqa xato matni bilan.

## Sources + confidence
- [SRC:https://developer.android.com/build/migrate-to-built-in-kotlin @2026-09-16]
- [SRC:https://developer.android.com/build/releases/about-agp @2026-11-13]
- [SRC:https://github.com/google/dagger/releases/tag/dagger-2.59 ]
- [SANDBOX: sample toml/gradle grep only; build not run]
- Confidence: medium (docs solid, no full repro)
