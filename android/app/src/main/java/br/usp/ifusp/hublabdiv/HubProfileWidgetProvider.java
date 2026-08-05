package br.usp.ifusp.hublabdiv;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class HubProfileWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.hub_profile_widget);

            // Click opens Lab Pessoal / Profile
            Intent intentProfile = new Intent(Intent.ACTION_VIEW, Uri.parse("hublabdiv://lab-pessoal"));
            intentProfile.setPackage(context.getPackageName());
            PendingIntent piProfile = PendingIntent.getActivity(context, 20, intentProfile, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.btn_profile, piProfile);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
