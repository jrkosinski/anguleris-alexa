package com.android.anguleris.bimsmith;

import android.content.ActivityNotFoundException;
import android.content.ContextWrapper;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

/**
 * Created by Home on 9/3/2561.
 */
public class Utility {
    public static void callPhone(ContextWrapper context, String number) {
        try {
            Intent callIntent = new Intent(Intent.ACTION_CALL);
            callIntent.setData(Uri.parse("tel:" + number));
            context.startActivity(callIntent);

        } catch (ActivityNotFoundException e) {
            Log.e("Calling a Phone Number", "Call failed", e);
        } catch(SecurityException e) {
            Log.e("No permission", "No permission", e);
        }
    }
}