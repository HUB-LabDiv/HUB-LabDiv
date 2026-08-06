package br.usp.ifusp.hublabdiv;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class HubPillWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.hub_pill_widget);

            // 1. Comunidade
            Intent intentComunidade = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://comunidade"));
            intentComunidade.setPackage(context.getPackageName());
            PendingIntent piComunidade = PendingIntent.getActivity(context, 10, intentComunidade, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_comunidade, piComunidade);

            // 2. GCIF
            Intent intentGcif = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://gcif"));
            intentGcif.setPackage(context.getPackageName());
            PendingIntent piGcif = PendingIntent.getActivity(context, 11, intentGcif, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_gcif, piGcif);

            // 3. Lançar à Órbita (Enviar)
            Intent intentEnviar = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://enviar"));
            intentEnviar.setPackage(context.getPackageName());
            PendingIntent piEnviar = PendingIntent.getActivity(context, 12, intentEnviar, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_enviar, piEnviar);

            // 4. Ferramentas
            Intent intentFerramentas = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://ferramentas"));
            intentFerramentas.setPackage(context.getPackageName());
            PendingIntent piFerramentas = PendingIntent.getActivity(context, 13, intentFerramentas, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_ferramentas, piFerramentas);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
