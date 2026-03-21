// Recipe.java - Recipe Model
package com.bharatkazaika.app.model;

import java.util.List;
import java.util.Map;

public class Recipe {
    private String id;
    private String name;
    private Map<String, String> names; // 22 languages
    private String stateId;
    private String stateName;
    private String stateEmoji;
    private String region;
    private String type; // Vegetarian / Non-Vegetarian
    private String category; // breakfast, lunch, dinner, snacks, sweets
    private String prepTime;
    private String cookTime;
    private int servings;
    private String difficulty;
    private String emoji;
    private List<String> ingredients;
    private List<Step> steps;
    private List<String> tips;
    private Nutrition nutrition;
    private String imageUrl;
    private long createdAt;
    private String createdBy;
    private boolean isUserSubmitted;
    private boolean isFeatured;
    private int viewCount;
    private int favoriteCount;
    
    // Constructor
    public Recipe() {}
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Map<String, String> getNames() { return names; }
    public void setNames(Map<String, String> names) { this.names = names; }
    
    public String getNameInLanguage(String langCode) {
        if (names != null && names.containsKey(langCode)) {
            return names.get(langCode);
        }
        return name;
    }
    
    public String getStateId() { return stateId; }
    public void setStateId(String stateId) { this.stateId = stateId; }
    
    public String getStateName() { return stateName; }
    public void setStateName(String stateName) { this.stateName = stateName; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public boolean isVegetarian() { return "Vegetarian".equals(type); }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getPrepTime() { return prepTime; }
    public void setPrepTime(String prepTime) { this.prepTime = prepTime; }
    
    public String getCookTime() { return cookTime; }
    public void setCookTime(String cookTime) { this.cookTime = cookTime; }
    
    public int getServings() { return servings; }
    public void setServings(int servings) { this.servings = servings; }
    
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    
    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }
    
    public List<Step> getSteps() { return steps; }
    public void setSteps(List<Step> steps) { this.steps = steps; }
    
    public List<String> getTips() { return tips; }
    public void setTips(List<String> tips) { this.tips = tips; }
    
    public Nutrition getNutrition() { return nutrition; }
    public void setNutrition(Nutrition nutrition) { this.nutrition = nutrition; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }
    
    public int getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(int favoriteCount) { this.favoriteCount = favoriteCount; }
    
    // Step class
    public static class Step {
        private String text;
        private String flame; // high, medium, low, simmer, none
        private String time;
        
        public Step() {}
        
        public Step(String text, String flame, String time) {
            this.text = text;
            this.flame = flame;
            this.time = time;
        }
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        
        public String getFlame() { return flame; }
        public void setFlame(String flame) { this.flame = flame; }
        
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        
        public String getFlameEmoji() {
            if (flame == null) return "";
            switch (flame) {
                case "high": return "🔴";
                case "medium": return "🟡";
                case "low": return "🟢";
                case "simmer": return "⚫";
                default: return "";
            }
        }
        
        public String getFlameText() {
            if (flame == null) return "";
            switch (flame) {
                case "high": return "High Flame";
                case "medium": return "Medium Flame";
                case "low": return "Low Flame";
                case "simmer": return "No Flame";
                default: return "";
            }
        }
    }
    
    // Nutrition class
    public static class Nutrition {
        private int calories;
        private String protein;
        private String carbs;
        private String fat;
        private String fiber;
        
        public Nutrition() {}
        
        public int getCalories() { return calories; }
        public void setCalories(int calories) { this.calories = calories; }
        
        public String getProtein() { return protein; }
        public void setProtein(String protein) { this.protein = protein; }
        
        public String getCarbs() { return carbs; }
        public void setCarbs(String carbs) { this.carbs = carbs; }
        
        public String getFat() { return fat; }
        public void setFat(String fat) { this.fat = fat; }
        
        public String getFiber() { return fiber; }
        public void setFiber(String fiber) { this.fiber = fiber; }
    }
}
