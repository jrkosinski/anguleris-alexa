package com.android.anguleris.bimsmith;

import android.content.ActivityNotFoundException;
import android.content.ContextWrapper;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import org.json.JSONObject;

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

    public static String parsePhoneNumber(String message){
        String output = null;
        try{
            JSONObject jObject = new JSONObject(message);
            JSONObject state = jObject.getJSONObject("state");
            if (state != null){
                JSONObject desired = state.getJSONObject("desired");
                if (desired != null) {
                    output = desired.getString("number");
                }
            }
        }
        catch(Exception e){
            return null;
        }
        return output;
    }
}