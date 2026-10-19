package br.usp.ifusp.hublabdiv;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.content.Context;
import com.getcapacitor.BridgeActivity;
import androidx.activity.EdgeToEdge;
import androidx.core.splashscreen.SplashScreen;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Transição limpa da Splash Screen nativa (Theme.SplashScreen) para AppTheme.NoActionBar
        SplashScreen.installSplashScreen(this);

        // Habilita Edge-to-Edge nativo para compatibilidade com Android 15+ (SDK 35/36)
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);

        // Otimização de Cache e Resiliência Offline para o WebView do Capacitor
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);

                // Se estiver sem conexão, força o uso do cache HTTP local do WebView
                if (!isNetworkConnected()) {
                    settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
                } else {
                    settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                }
            }
        } catch (Exception ignored) {
            // Garante inicialização contínua mesmo se personalização do webView falhar
        }
    }

    private boolean isNetworkConnected() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
                return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
            }
        } catch (Exception ignored) {}
        return false;
    }
}
