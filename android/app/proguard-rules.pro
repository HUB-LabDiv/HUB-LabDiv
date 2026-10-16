# Add project specific ProGuard / R8 rules here.

# 1. Preservar Interfaces JavaScript e WebKit para o WebView do Capacitor
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 2. Preservar Classes e Plugins do Capacitor
-keep public class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }
-keep public class * extends com.getcapacitor.BridgeActivity { *; }

-dontwarn com.getcapacitor.**

# 3. Stacktraces e depuração em produção
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes EnclosingMethod
