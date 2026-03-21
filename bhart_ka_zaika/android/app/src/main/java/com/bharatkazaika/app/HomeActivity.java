// HomeActivity.java - Main Home Screen with Bottom Navigation
package com.bharatkazaika.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.bharatkazaika.app.fragments.RecipesFragment;
import com.bharatkazaika.app.fragments.MapFragment;
import com.bharatkazaika.app.fragments.SearchFragment;
import com.bharatkazaika.app.fragments.FavouritesFragment;
import com.bharatkazaika.app.fragments.MealPlanFragment;
import com.bharatkazaika.app.fragments.SettingsFragment;

public class HomeActivity extends AppCompatActivity {
    
    private BottomNavigationView bottomNav;
    private SharedPreferences prefs;
    private String selectedState = "all";
    private String selectedLanguage = "hi";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        
        prefs = getSharedPreferences("bharat_ka_zaika", MODE_PRIVATE);
        
        // Get data from intent
        selectedState = getIntent().getStringExtra("state_id");
        selectedLanguage = getIntent().getStringExtra("language");
        
        initBottomNavigation();
        
        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(new RecipesFragment());
        }
    }
    
    private void initBottomNavigation() {
        bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment fragment = null;
                int itemId = item.getItemId();
                
                if (itemId == R.id.nav_map) {
                    fragment = new MapFragment();
                } else if (itemId == R.id.nav_search) {
                    fragment = new SearchFragment();
                } else if (itemId == R.id.nav_favorites) {
                    fragment = new FavouritesFragment();
                } else if (itemId == R.id.nav_meal_plan) {
                    fragment = new MealPlanFragment();
                } else if (itemId == R.id.nav_settings) {
                    fragment = new SettingsFragment();
                } else {
                    fragment = new RecipesFragment();
                }
                
                loadFragment(fragment);
                return true;
            }
        });
    }
    
    private void loadFragment(Fragment fragment) {
        Bundle args = new Bundle();
        args.putString("state_id", selectedState);
        args.putString("language", selectedLanguage);
        fragment.setArguments(args);
        
        getSupportFragmentManager()
            .beginTransaction()
            .setCustomAnimations(
                R.anim.slide_in_right,
                R.anim.slide_out_left,
                R.anim.slide_in_left,
                R.anim.slide_out_right
            )
            .replace(R.id.fragmentContainer, fragment)
            .commit();
    }
    
    public void navigateToRecipeDetail(String recipeId) {
        Intent intent = new Intent(this, RecipeDetailActivity.class);
        intent.putExtra("recipe_id", recipeId);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }
    
    public void navigateToStateRecipes(String stateId, String stateName) {
        Intent intent = new Intent(this, RecipeListActivity.class);
        intent.putExtra("state_id", stateId);
        intent.putExtra("state_name", stateName);
        startActivity(intent);
    }
}
