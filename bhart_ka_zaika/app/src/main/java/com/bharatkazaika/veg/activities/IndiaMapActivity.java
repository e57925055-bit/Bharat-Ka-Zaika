package com.bharatkazaika.veg.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import com.bharatkazaika.veg.R;

public class IndiaMapActivity extends AppCompatActivity {

    private WebView webView;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_india_map);

        webView = findViewById(R.id.webViewMap);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/india_map.html");

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.flute);
            if(mediaPlayer != null) {
                mediaPlayer.setLooping(true);
                mediaPlayer.start();
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    class AndroidBridge {

        @JavascriptInterface
        public void onStateSelected(String stateId, String stateName) {
            // State select hua
        }

        @JavascriptInterface
        public void onLanguageSelected(String stateId, String langCode) {
            SharedPreferences prefs = getSharedPreferences("BharatKaZaika", MODE_PRIVATE);
            prefs.edit()
                .putString("selected_language", langCode)
                .putString("selected_state", stateId)
                .apply();

            runOnUiThread(() -> {
                Intent intent = new Intent(IndiaMapActivity.this, HomeActivity.class);
                intent.putExtra("state", stateId);
                startActivity(intent);
                finish();
            });
        }

        @JavascriptInterface
        public void onStateConfirmed(String stateId, String langCode) {
            SharedPreferences prefs = getSharedPreferences("BharatKaZaika", MODE_PRIVATE);
            prefs.edit()
                .putString("selected_state", stateId)
                .putString("selected_language", "hindi")
                .apply();

            runOnUiThread(() -> {
                Intent intent = new Intent(IndiaMapActivity.this, HomeActivity.class);
                intent.putExtra("state", stateId);
                startActivity(intent);
                finish();
            });
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
        }
    }
}
