package br.usp.ifusp.hublabdiv;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class HubGestaoWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.hub_gestao_widget);

            Intent intentGestao = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://gestao"));
            intentGestao.setPackage(context.getPackageName());
            PendingIntent piGestao = PendingIntent.getActivity(
                context,
                30,
                intentGestao,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.btn_gestao, piGestao);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}

