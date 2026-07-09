package br.usp.ifusp.hublabdiv;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.core.view.WindowCompat;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Desativa o edge-to-edge (faz o app respeitar a barra de status e não preencher até o topo)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
