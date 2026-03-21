// IndiaMapActivity.java - Animated India Map Screen
package com.bharatkazaika.app;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.animation.BounceInterpolator;
import android.view.animation.ScaleAnimation;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.airbnb.lottie.LottieAnimationView;
import com.bharatkazaika.app.model.State;
import java.util.ArrayList;
import java.util.List;

public class IndiaMapActivity extends AppCompatActivity {
    
    private RelativeLayout mapContainer;
    private LottieAnimationView lottieCooking;
    private MediaPlayer fluteSound;
    
    private SharedPreferences prefs;
    private List<StateView> stateViews = new ArrayList<>();
    
    // State colors by region
    private static final String COLOR_NORTH = "#FF9800";      // Saffron
    private static final String COLOR_SOUTH = "#4CAF50";      // Green
    private static final String COLOR_EAST = "#2196F3";       // Blue
    private static final String COLOR_WEST = "#FF5722";        // Orange
    private static final String COLOR_NORTHEAST = "#9C27B0"; // Purple
    private static final String COLOR_CENTRAL = "#F44336";    // Red
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_india_map);
        
        prefs = getSharedPreferences("bharat_ka_zaika", Context.MODE_PRIVATE);
        
        initViews();
        createIndiaMap();
        playBackgroundSound();
        playLottieAnimation();
        animateMapEntrance();
    }
    
    private void initViews() {
        mapContainer = findViewById(R.id.mapContainer);
        lottieCooking = findViewById(R.id.lottieCooking);
        
        // Play Indian flute/sitar sound
        try {
            fluteSound = MediaPlayer.create(this, R.raw.indian_flute);
            fluteSound.setLooping(true);
            fluteSound.start();
        } catch (Exception e) {
            // Sound file not found - continue without sound
        }
    }
    
    private void createIndiaMap() {
        // Create state buttons positioned as India map
        addState("Jammu & Kashmir", "ks", 180, 30, 60, 40, COLOR_NORTH, "कॉशुर", "ks");
        addState("Punjab", "punjab", 150, 80, 55, 35, COLOR_NORTH, "ਪੰਜਾਬੀ", "pa");
        addState("Haryana", "haryana", 210, 75, 50, 30, COLOR_NORTH, "हिंदी", "hi");
        addState("Himachal Pradesh", "himachal", 200, 45, 45, 30, COLOR_NORTH, "हिंदी", "hi");
        addState("Uttarakhand", "uttarakhand", 240, 60, 50, 35, COLOR_NORTH, "हिंदी", "hi");
        addState("Delhi", "delhi", 225, 100, 35, 25, COLOR_NORTH, "हिंदी", "hi");
        addState("Rajasthan", "rajasthan", 120, 130, 100, 80, COLOR_WEST, "हिंदी", "hi");
        addState("Uttar Pradesh", "uttarpradesh", 260, 130, 90, 70, COLOR_NORTH, "हिंदी", "hi");
        addState("Bihar", "bihar", 310, 120, 55, 45, COLOR_NORTH, "हिंदी", "hi");
        addState("Madhya Pradesh", "madhyapradesh", 200, 180, 80, 70, COLOR_CENTRAL, "हिंदी", "hi");
        addState("Gujarat", "gujarat", 100, 220, 70, 80, COLOR_WEST, "ગુજરાતી", "gu");
        addState("Maharashtra", "maharashtra", 160, 270, 70, 90, COLOR_WEST, "मराठी", "mr");
        addState("Goa", "goa", 155, 360, 30, 25, COLOR_WEST, "कोंकणी", "kok");
        addState("Chhattisgarh", "chhattisgarh", 270, 220, 60, 50, COLOR_CENTRAL, "हिंदी", "hi");
        addState("Jharkhand", "jharkhand", 300, 190, 50, 40, COLOR_NORTH, "हिंदी", "hi");
        addState("West Bengal", "westbengal", 330, 180, 60, 55, COLOR_EAST, "বাংলা", "bn");
        addState("Odisha", "odisha", 300, 250, 55, 60, COLOR_EAST, "ଓଡ଼ିଆ", "or");
        addState("Assam", "assam", 370, 130, 50, 40, COLOR_NORTHEAST, "অসমীয়া", "as");
        addState("Telangana", "telangana", 230, 310, 55, 60, COLOR_SOUTH, "తెలుగు", "te");
        addState("Andhra Pradesh", "andhrapradesh", 230, 370, 60, 70, COLOR_SOUTH, "తెలుగు", "te");
        addState("Karnataka", "karnataka", 175, 370, 65, 75, COLOR_SOUTH, "ಕನ್ನಡ", "kn");
        addState("Tamil Nadu", "tamilnadu", 210, 450, 55, 70, COLOR_SOUTH, "தமிழ்", "ta");
        addState("Kerala", "kerala", 175, 440, 45, 60, COLOR_SOUTH, "മലയാളം", "ml");
        addState("Tripura", "tripura", 390, 210, 35, 30, COLOR_NORTHEAST, "বাংলা", "bn");
        addState("Manipur", "manipur", 385, 185, 35, 30, COLOR_NORTHEAST, "মৈতৈলোন", "mni");
    }
    
    private void addState(String name, String stateId, int x, int y, int width, int height, String color, String language, String langCode) {
        StateView stateView = new StateView(this);
        stateView.setStateId(stateId);
        stateView.setStateName(name);
        stateView.setLanguage(language);
        stateView.setLangCode(langCode);
        stateView.setBackgroundColor(Color.parseColor(color));
        stateView.setText(name);
        stateView.setLanguageText(language);
        
        // Set position
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
            dpToPx(width),
            dpToPx(height)
        );
        params.leftMargin = dpToPx(x);
        params.topMargin = dpToPx(y);
        
        stateView.setLayoutParams(params);
        stateView.setGravity(android.view.Gravity.CENTER);
        stateView.setPadding(4, 4, 4, 4);
        
        // Set drawable background
        GradientDrawable drawable = new GradientDrawable();
        drawable.setCornerRadius(12);
        drawable.setColor(Color.parseColor(color));
        drawable.setStroke(3, Color.WHITE);
        stateView.setBackground(drawable);
        
        // Click animation
        stateView.setOnClickListener(v -> onStateClicked(stateView));
        
        // Add pulsing animation
        startPulseAnimation(stateView);
        
        mapContainer.addView(stateView);
        stateViews.add(stateView);
    }
    
    private void startPulseAnimation(StateView stateView) {
        ScaleAnimation scaleAnim = new ScaleAnimation(
            1f, 1.05f, 1f, 1.05f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        );
        scaleAnim.setDuration(1500);
        scaleAnim.setRepeatCount(Animation.INFINITE);
        scaleAnim.setRepeatMode(Animation.REVERSE);
        scaleAnim.setInterpolator(new AccelerateDecelerateInterpolator());
        stateView.startAnimation(scaleAnim);
    }
    
    private void onStateClicked(StateView stateView) {
        // Stop other animations
        for (StateView sv : stateViews) {
            sv.clearAnimation();
        }
        
        // Play tap sound
        try {
            MediaPlayer tapSound = MediaPlayer.create(this, R.raw.tap);
            if (tapSound != null) {
                tapSound.start();
                tapSound.setOnCompletionListener(MediaPlayer::release);
            }
        } catch (Exception e) {}
        
        // Animate selected state
        animateStateSelection(stateView, () -> {
            showLanguageDialog(stateView);
        });
    }
    
    private void animateStateSelection(StateView stateView, Runnable onComplete) {
        // Zoom in effect
        ScaleAnimation zoomIn = new ScaleAnimation(
            1f, 1.3f, 1f, 1.3f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        );
        zoomIn.setDuration(300);
        zoomIn.setInterpolator(new BounceInterpolator());
        zoomIn.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {}
            
            @Override
            public void onAnimationEnd(Animation animation) {
                // Scale back
                ScaleAnimation zoomOut = new ScaleAnimation(
                    1.3f, 1.15f, 1.3f, 1.15f,
                    Animation.RELATIVE_TO_SELF, 0.5f,
                    Animation.RELATIVE_TO_SELF, 0.5f
                );
                zoomOut.setDuration(200);
                zoomOut.setAnimationListener(new Animation.AnimationListener() {
                    @Override
                    public void onAnimationStart(Animation animation) {}
                    @Override
                    public void onAnimationEnd(Animation animation) {
                        if (onComplete != null) onComplete.run();
                    }
                    @Override
                    public void onAnimationRepeat(Animation animation) {}
                });
                stateView.startAnimation(zoomOut);
            }
            
            @Override
            public void onAnimationRepeat(Animation animation) {}
        });
        
        stateView.startAnimation(zoomIn);
    }
    
    private void showLanguageDialog(StateView stateView) {
        String message = "Would you like to see recipes in " + stateView.getLanguage() + "?\n\n";
        message += "Select Yes to switch to " + stateView.getStateName() + " language";
        
        new AlertDialog.Builder(this)
            .setTitle("🍛 " + stateView.getStateName())
            .setMessage(message)
            .setPositiveButton("Yes - Use " + stateView.getLanguage(), (dialog, which) -> {
                // Save language
                prefs.edit()
                    .putString("selected_language", stateView.getLangCode())
                    .putString("selected_state", stateView.getStateId())
                    .putString("selected_state_name", stateView.getStateName())
                    .apply();
                
                // Stop sound
                if (fluteSound != null) {
                    fluteSound.stop();
                    fluteSound.release();
                }
                
                // Navigate to Home
                navigateToHome();
            })
            .setNegativeButton("No - Keep Hindi/English", (dialog, which) -> {
                prefs.edit()
                    .putString("selected_language", "hi")
                    .putString("selected_state", stateView.getStateId())
                    .putString("selected_state_name", stateView.getStateName())
                    .apply();
                
                if (fluteSound != null) {
                    fluteSound.stop();
                    fluteSound.release();
                }
                
                navigateToHome();
            })
            .setCancelable(false)
            .show();
    }
    
    private void navigateToHome() {
        Intent intent = new Intent(this, HomeActivity.class);
        intent.putExtra("state_id", prefs.getString("selected_state", "all"));
        intent.putExtra("state_name", prefs.getString("selected_state_name", "All Recipes"));
        intent.putExtra("language", prefs.getString("selected_language", "hi"));
        startActivity(intent);
        finish();
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }
    
    private void playBackgroundSound() {
        // Will play R.raw.indian_flute or sitar sound
    }
    
    private void playLottieAnimation() {
        if (lottieCooking != null) {
            lottieCooking.setAnimation(R.raw.cooking_animation);
            lottieCooking.playAnimation();
            lottieCooking.loop(true);
        }
    }
    
    private void animateMapEntrance() {
        // Fade in and scale up
        ObjectAnimator alpha = ObjectAnimator.ofFloat(mapContainer, "alpha", 0f, 1f);
        ObjectAnimator scaleX = ObjectAnimator.ofFloat(mapContainer, "scaleX", 0.8f, 1f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(mapContainer, "scaleY", 0.8f, 1f);
        
        AnimatorSet set = new AnimatorSet();
        set.playTogether(alpha, scaleX, scaleY);
        set.setDuration(1000);
        set.setInterpolator(new AccelerateDecelerateInterpolator());
        set.start();
    }
    
    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return (int) (dp * density);
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        if (fluteSound != null && fluteSound.isPlaying()) {
            fluteSound.pause();
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        if (fluteSound != null && !fluteSound.isPlaying()) {
            fluteSound.start();
        }
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (fluteSound != null) {
            fluteSound.release();
        }
    }
    
    // Custom State View Class
    private static class StateView extends LinearLayout {
        private String stateId;
        private String stateName;
        private String language;
        private String langCode;
        private TextView nameText;
        private TextView langText;
        
        public StateView(Context context) {
            super(context);
            init();
        }
        
        private void init() {
            setOrientation(VERTICAL);
            setGravity(Gravity.CENTER);
            
            nameText = new TextView(getContext());
            nameText.setTextSize(10);
            nameText.setTextColor(Color.WHITE);
            nameText.setGravity(Gravity.CENTER);
            
            langText = new TextView(getContext());
            langText.setTextSize(12);
            langText.setTextColor(Color.WHITE);
            langText.setTypeface(null, android.graphics.Typeface.BOLD);
            langText.setGravity(Gravity.CENTER);
            
            addView(nameText);
            addView(langText);
        }
        
        public void setStateId(String id) { this.stateId = id; }
        public void setStateName(String name) { this.stateName = name; }
        public void setLanguage(String lang) { this.language = lang; }
        public void setLangCode(String code) { this.langCode = code; }
        
        public void setText(String text) { nameText.setText(text); }
        public void setLanguageText(String text) { langText.setText(text); }
        
        public String getStateId() { return stateId; }
        public String getStateName() { return stateName; }
        public String getLanguage() { return language; }
        public String getLangCode() { return langCode; }
    }
}
