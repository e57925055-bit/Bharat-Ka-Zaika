package com.bharatkazaika.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

/**
 * SplashActivity — Bharat Ka Zaika
 * Shows the logo with pulse animation, then transitions to IndiaMapActivity.
 */
public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION_MS = 2500;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Fullscreen splash
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_splash);

        // Logo fade-in animation
        ImageView logo = findViewById(R.id.splashLogo);
        if (logo != null) {
            AlphaAnimation fadeIn = new AlphaAnimation(0f, 1f);
            fadeIn.setDuration(700);
            fadeIn.setFillAfter(true);
            logo.startAnimation(fadeIn);
        }

        // Tagline fade-in (delayed)
        TextView tagline = findViewById(R.id.splashTagline);
        if (tagline != null) {
            AlphaAnimation taglineAnim = new AlphaAnimation(0f, 1f);
            taglineAnim.setDuration(600);
            taglineAnim.setStartOffset(800);
            taglineAnim.setFillAfter(true);
            tagline.startAnimation(taglineAnim);
        }

        // Navigate after delay
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, IndiaMapActivity.class);
            startActivity(intent);
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
            finish();
        }, SPLASH_DURATION_MS);
    }
}
