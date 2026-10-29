---
name: fix-android
description: Diagnostica erros de build do Gradle/Android, sincroniza o Capacitor e valida Splash Screen, ícones e temas nativos (DayNight).
---

# WORKFLOW: DIAGNÓSTICO E BUILD ANDROID / CAPACITOR (/fix-android)

Execute o diagnóstico da camada mobile nativa (`capacitor.config.ts` e pasta `android/`):

1. **Diagnóstico do Gradle Build Error:**
   - Inspecione `android/build.gradle`, `android/app/build.gradle`, `android/gradle/wrapper/gradle-wrapper.properties` e a versão do JDK/Java ativa no terminal Linux (`java -version`).
   - Identifique a causa raiz de qualquer falha de sincronização ou compilação do Gradle e proponha a correção exata.
2. **Tema Nativo DayNight & Splash Screen:**
   - Verifique `android/app/src/main/res/values/styles.xml` e `values-night/styles.xml` para garantir que a Splash Screen e a barra de status do Android respeitem o tema Claro/Escuro do sistema operacional sem *flash* visual.
3. **Sincronização Segura:**
   - Valide as configurações de build web/export e teste a sincronização com `npx cap sync android`.