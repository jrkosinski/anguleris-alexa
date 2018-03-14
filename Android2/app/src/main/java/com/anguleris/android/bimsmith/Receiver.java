package com.anguleris.android.bimsmith;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * Created by Home on 14/3/2561.
 */
public class Receiver extends BroadcastReceiver {
    final static String TAG = "Receiver";

    @Override
    public void onReceive(Context context, Intent arg1) {
        Log.w(TAG, "starting service...");
        context.getApplicationContext().startService(new Intent(context, BimService.class));
    }
}
