// MyApplication.java
package com.bharatkazaika.app;

import android.app.Application;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MyApplication extends Application {
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // Initialize Admob
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                // TODO: Replace YOUR_BANNER_ID, YOUR_INTERSTITIAL_ID, YOUR_REWARDED_ID
                // Admob IDs will be loaded from strings.xml
            }
        });
    }
}
