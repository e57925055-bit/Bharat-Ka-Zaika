package com.example.recipes.activities;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.recipes.R;
import com.bharatkazaika.app.HomeActivity;

import java.util.Locale;

public class IndiaMapActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;
    private ScaleGestureDetector scaleGestureDetector;
    private float mScaleFactor = 1.0f;
    private MediaPlayer mediaPlayer;
    private String currentStateName = "";
    private String currentStateLanguage = "";
    private ImageButton btnZoomIn, btnZoomOut;
    private SharedPreferences prefs;
    private String currentStateHindi = "";
    private String currentLangCode = "hi";

    private static final String[] STATE_LANGUAGES = {
        "Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil",
        "Urdu", "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi",
        "Assamese", "Maithili", "Nepali", "Santali", "Kashmiri", "Konkani",
        "Manipuri", "Bodo", "Sindhi", "Dogri", "Khasi", "Garo", "Mizo", "Arabic",
        "English", "Hindi", "English", "Hindi"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_india_map);

        prefs = getSharedPreferences("bharat_ka_zaika", MODE_PRIVATE);
        
        initViews();
        setupWebView();
        setupScaleGestureDetector();
        playFluteSound();
    }

    private void initViews() {
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        btnZoomIn = findViewById(R.id.btnZoomIn);
        btnZoomOut = findViewById(R.id.btnZoomOut);
        
        btnZoomIn.setOnClickListener(v -> {
            mScaleFactor = Math.min(mScaleFactor + 0.25f, 5.0f);
            webView.setScaleX(mScaleFactor);
            webView.setScaleY(mScaleFactor);
            webView.loadUrl("javascript:zoomIn()");
        });
        
        btnZoomOut.setOnClickListener(v -> {
            mScaleFactor = Math.max(mScaleFactor - 0.25f, 0.5f);
            webView.setScaleX(mScaleFactor);
            webView.setScaleY(mScaleFactor);
            webView.loadUrl("javascript:zoomOut()");
        });
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setSupportZoom(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }
        });

        webView.setWebChromeClient(new WebChromeClient());

        webView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                scaleGestureDetector.onTouchEvent(event);
                return false;
            }
        });

        webView.loadUrl("file:///android_asset/india_map.html");

        webView.addJavascriptInterface(new WebAppInterface(), "Android");
    }

    private void setupScaleGestureDetector() {
        scaleGestureDetector = new ScaleGestureDetector(this, new ScaleGestureDetector.SimpleOnScaleGestureListener() {
            @Override
            public boolean onScale(ScaleGestureDetector detector) {
                mScaleFactor *= detector.getScaleFactor();
                mScaleFactor = Math.max(0.5f, Math.min(mScaleFactor, 5.0f));
                webView.setScaleX(mScaleFactor);
                webView.setScaleY(mScaleFactor);
                return true;
            }
        });
    }

    private void playFluteSound() {
        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.flute);
            if (mediaPlayer != null) {
                mediaPlayer.setOnCompletionListener(mp -> {
                    mp.release();
                });
                mediaPlayer.start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public class WebAppInterface {
        @android.webkit.JavascriptInterface
        public void onStateClicked(String stateName, String stateLanguage, String stateHindi, String stateBengali,
                                   String stateTamil, String stateTelugu, String stateMarathi, String stateKannada,
                                   String stateMalayalam, String stateGujarati, String statePunjabi, String stateUrdu) {
            runOnUiThread(() -> {
                currentStateName = stateName;
                currentStateLanguage = stateLanguage;
                currentStateHindi = stateHindi;
                currentLangCode = getLanguageCode(stateLanguage);

                showLanguageChangeDialog(stateLanguage, stateHindi);
            });
        }

        private String getLanguageCode(String language) {
            switch (language) {
                case "Hindi": return "hi";
                case "English": return "en";
                case "Bengali": return "bn";
                case "Telugu": return "te";
                case "Marathi": return "mr";
                case "Tamil": return "ta";
                case "Urdu": return "ur";
                case "Gujarati": return "gu";
                case "Kannada": return "kn";
                case "Malayalam": return "ml";
                case "Punjabi": return "pa";
                case "Odia": return "or";
                case "Assamese": return "as";
                case "Nepali": return "ne";
                case "Konkani": return "kok";
                case "Meitei": return "mni";
                case "Mizo": return "lus";
                default: return "hi";
            }
        }

        private void showLanguageChangeDialog(String language, String stateNameNative) {
            String message = "Change language to " + language + "?";
            new AlertDialog.Builder(IndiaMapActivity.this)
                .setTitle(stateNameNative)
                .setMessage(message)
                .setPositiveButton("Yes", (dialog, which) -> {
                    prefs.edit()
                        .putString("selected_language", currentLangCode)
                        .putString("selected_state", getStateId(currentStateName))
                        .putString("selected_state_name", currentStateName)
                        .apply();
                    navigateToHome();
                })
                .setNegativeButton("No", (dialog, which) -> {
                    prefs.edit()
                        .putString("selected_language", "hi")
                        .putString("selected_state", getStateId(currentStateName))
                        .putString("selected_state_name", currentStateName)
                        .apply();
                    navigateToHome();
                })
                .setCancelable(true)
                .show();
        }

        private String getStateId(String stateName) {
            return stateName.toLowerCase().replace(" ", "_").replace("&", "").replace("&", "");
        }

        private void navigateToHome() {
            if (mediaPlayer != null) {
                mediaPlayer.stop();
                mediaPlayer.release();
            }
            Intent intent = new Intent(IndiaMapActivity.this, HomeActivity.class);
            intent.putExtra("state_id", prefs.getString("selected_state", "all"));
            intent.putExtra("state_name", prefs.getString("selected_state_name", "All Recipes"));
            intent.putExtra("language", prefs.getString("selected_language", "hi"));
            startActivity(intent);
            finish();
        }

        @android.webkit.JavascriptInterface
        public void showToast(String message) {
            runOnUiThread(() -> Toast.makeText(IndiaMapActivity.this, message, Toast.LENGTH_SHORT).show());
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
        if (webView != null) {
            webView.destroy();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            new AlertDialog.Builder(this)
                .setTitle("Exit Map")
                .setMessage("Do you want to exit?")
                .setPositiveButton("Yes", (dialog, which) -> {
                    if (mediaPlayer != null) {
                        mediaPlayer.stop();
                        mediaPlayer.release();
                    }
                    finish();
                })
                .setNegativeButton("No", null)
                .show();
        }
    }
}
