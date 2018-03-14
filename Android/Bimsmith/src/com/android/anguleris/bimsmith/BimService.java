package com.android.anguleris.bimsmith;

import android.app.Activity;
import android.app.IntentService;
import android.app.Service;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttClientStatusCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttManager;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttNewMessageCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttQos;
import com.amazonaws.regions.Regions;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

public class BimService extends IntentService {

    static final String LOG_TAG = BimService.class.getCanonicalName();

    // Customer specific IoT endpoint
    // AWS Iot CLI describe-endpoint call returns: XXXXXXXXXX.iot.<region>.amazonaws.com,
    private static final String IOT_ENDPOINT = "a21jd7gud1swyd.iot.us-east-1.amazonaws.com";

    // Cognito pool ID. For this app, pool needs to be unauthenticated pool with
    // AWS IoT permissions.
    private static final String COGNITO_POOL_ID = "us-east-1:bbbf152a-680f-4fbd-922c-f117f03e0773";

    // Region of AWS IoT
    private static final Regions REGION = Regions.US_EAST_1;

    private static AWSIotMqttManager mqttManager;
    private static CognitoCachingCredentialsProvider credentialsProvider;


    public BimService() {
        super("Bimsmith");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
            final BimService instance = this;
            Utility.callPhone(instance, "0619844525");

            String clientId = UUID.randomUUID().toString();

            // Initialize the AWS Cognito credentials provider
            credentialsProvider = new CognitoCachingCredentialsProvider(
                    getApplicationContext(), // context
                    COGNITO_POOL_ID, // Identity Pool ID
                    REGION // Region
            );

            // MQTT Client
            mqttManager = new AWSIotMqttManager(clientId, IOT_ENDPOINT);

            //connect
            try {
                mqttManager.connect(credentialsProvider, new AWSIotMqttClientStatusCallback() {
                    @Override
                    public void onStatusChanged(final AWSIotMqttClientStatus status,
                                                final Throwable throwable) {
                        Log.d(LOG_TAG, "Status = " + String.valueOf(status));

                        if (status == AWSIotMqttClientStatus.Connecting) {
                            Log.i(LOG_TAG, "Connecting...");

                        } else if (status == AWSIotMqttClientStatus.Connected) {
                            Log.i(LOG_TAG, "...Connected");
                            subscribe();

                        } else if (status == AWSIotMqttClientStatus.Reconnecting) {
                            if (throwable != null) {
                                Log.e(LOG_TAG, "Connection error.");
                            }
                            Log.i(LOG_TAG, "...Reconnecting...");
                        } else if (status == AWSIotMqttClientStatus.ConnectionLost) {
                            if (throwable != null) {
                                Log.e(LOG_TAG, "Connection error.", throwable);
                                throwable.printStackTrace();
                            }
                            Log.i(LOG_TAG, "...Disconnected");
                        } else {
                            Log.i(LOG_TAG, "...Disconnected");
                        }
                    }
                });
            } catch (final Exception e) {
                Log.e(LOG_TAG, "Connection error.", e);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void subscribe(){
        final String topic = "$aws/things/bimsmith-thing/shadow/update/accepted";


        Log.d(LOG_TAG, "topic = " + topic);

        try {
            mqttManager.subscribeToTopic(topic, AWSIotMqttQos.QOS0,
                    new AWSIotMqttNewMessageCallback() {
                        @Override
                        public void onMessageArrived(final String topic, final byte[] data) {
                            try {
                                String message = new String(data, "UTF-8");
                                Log.d(LOG_TAG, "Message arrived:");
                                Log.d(LOG_TAG, "   Topic: " + topic);
                                Log.d(LOG_TAG, " Message: " + message);

                                handleMessage(message);

                            } catch (UnsupportedEncodingException e) {
                                Log.e(LOG_TAG, "Message encoding error.", e);
                            }
                        }
                    });
        } catch (Exception e) {
            Log.e(LOG_TAG, "Subscription error.", e);
        }
    }

    protected void handleMessage(String message) {
        try {
            final BimService instance = this;
            Utility.callPhone(instance, "0619844525");

        } catch (Exception e) {
            Log.e(LOG_TAG, "Handle message error.", e);
        }
    }
}