package com.anguleris.android.bimsmith;

import android.app.Activity;
import android.app.IntentService;
import android.app.Service;
import android.content.Intent;
import android.os.Handler;

public class BimService extends IntentService {

    public BimService() {
        super("Bimsmith");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
            final BimService instance = this;
            Utility.callPhone(instance, "0619844525");

            /*
            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                public void run() {
                    Utility.callPhone(instance, "0619844525");
                }
            }, 10000);   //5 seconds
            */

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
