package br.usp.ifusp.hublabdiv;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class HubWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.hub_widget);

            // Intent for Lab Pessoal
            Intent intentLab = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://lab-pessoal"));
            intentLab.setPackage(context.getPackageName());
            PendingIntent pendingIntentLab = PendingIntent.getActivity(context, 0, intentLab, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_lab, pendingIntentLab);

            // Intent for Trilhas
            Intent intentTrilhas = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://trilhas"));
            intentTrilhas.setPackage(context.getPackageName());
            PendingIntent pendingIntentTrilhas = PendingIntent.getActivity(context, 1, intentTrilhas, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_trilhas, pendingIntentTrilhas);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
