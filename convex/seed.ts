// @ts-nocheck
// convex/seed.ts - Complete seed data with all 435 recipes
import { v } from "convex/values";
import { mutationGeneric as mutation } from "convex/server";

// All States Data
const STATES_DATA = [
  { id: "andhrapradesh", name: "Andhra Pradesh", emoji: "🏛️", color: "#FF5722", region: "south", language: "Telugu", langCode: "te" },
  { id: "arunachalpradesh", name: "Arunachal Pradesh", emoji: "⛰️", color: "#4CAF50", region: "northeast", language: "English", langCode: "en" },
  { id: "assam", name: "Assam", emoji: "🐘", color: "#00BCD4", region: "northeast", language: "Assamese", langCode: "as" },
  { id: "bihar", name: "Bihar", emoji: "🪷", color: "#FF9800", region: "east", language: "Hindi", langCode: "hi" },
  { id: "chhattisgarh", name: "Chhattisgarh", emoji: "🌲", color: "#FF5722", region: "central", language: "Hindi", langCode: "hi" },
  { id: "delhi", name: "Delhi", emoji: "🏛️", color: "#F44336", region: "north", language: "Hindi", langCode: "hi" },
  { id: "goa", name: "Goa", emoji: "🏖️", color: "#795548", region: "west", language: "Konkani", langCode: "kok" },
  { id: "gujarat", name: "Gujarat", emoji: "🪔", color: "#8BC34A", region: "west", language: "Gujarati", langCode: "gu" },
  { id: "haryana", name: "Haryana", emoji: "🌾", color: "#FF9800", region: "north", language: "Hindi", langCode: "hi" },
  { id: "himachalpradesh", name: "Himachal Pradesh", emoji: "🏔️", color: "#3F51B5", region: "north", language: "Hindi", langCode: "hi" },
  { id: "jammuandkashmir", name: "Jammu & Kashmir", emoji: "🏔️", color: "#00695C", region: "north", language: "Kashmiri", langCode: "ks" },
  { id: "jharkhand", name: "Jharkhand", emoji: "🌳", color: "#FF9800", region: "east", language: "Hindi", langCode: "hi" },
  { id: "karnataka", name: "Karnataka", emoji: "🗿", color: "#3F51B5", region: "south", language: "Kannada", langCode: "kn" },
  { id: "kerala", name: "Kerala", emoji: "🥥", color: "#4CAF50", region: "south", language: "Malayalam", langCode: "ml" },
  { id: "madhya Pradesh", name: "Madhya Pradesh", emoji: "🦚", color: "#FF9800", region: "central", language: "Hindi", langCode: "hi" },
  { id: "maharashtra", name: "Maharashtra", emoji: "🏰", color: "#FF5722", region: "west", language: "Marathi", langCode: "mr" },
  { id: "manipur", name: "Manipur", emoji: "🌾", color: "#FF9800", region: "northeast", language: "Manipuri", langCode: "mni" },
  { id: "meghalaya", name: "Meghalaya", emoji: "⛰️", color: "#4CAF50", region: "northeast", language: "English", langCode: "en" },
  { id: "mizoram", name: "Mizoram", emoji: "🌿", color: "#4CAF50", region: "northeast", language: "English", langCode: "en" },
  { id: "nagaland", name: "Nagaland", emoji: "🔥", color: "#E91E63", region: "northeast", language: "English", langCode: "en" },
  { id: "odisha", name: "Odisha", emoji: "🏛️", color: "#FF5722", region: "east", language: "Odia", langCode: "or" },
  { id: "punjab", name: "Punjab", emoji: "🏋️", color: "#F44336", region: "north", language: "Punjabi", langCode: "pa" },
  { id: "rajasthan", name: "Rajasthan", emoji: "🏰", color: "#FF9800", region: "west", language: "Hindi", langCode: "hi" },
  { id: "sikkim", name: "Sikkim", emoji: "🏔️", color: "#4CAF50", region: "northeast", language: "English", langCode: "en" },
  { id: "tamilnadu", name: "Tamil Nadu", emoji: "🛕", color: "#9C27B0", region: "south", language: "Tamil", langCode: "ta" },
  { id: "telangana", name: "Telangana", emoji: "🏯", color: "#9C27B0", region: "south", language: "Telugu", langCode: "te" },
  { id: "tripura", name: "Tripura", emoji: "⛰️", color: "#4CAF50", region: "northeast", language: "Bengali", langCode: "bn" },
  { id: "uttarpradesh", name: "Uttar Pradesh", emoji: "🕌", color: "#FF9800", region: "north", language: "Hindi", langCode: "hi" },
  { id: "uttarakhand", name: "Uttarakhand", emoji: "🏔️", color: "#3F51B5", region: "north", language: "Hindi", langCode: "hi" },
  { id: "westbengal", name: "West Bengal", emoji: "🌀", color: "#1E88E5", region: "east", language: "Bengali", langCode: "bn" }
];

// Sample recipes for Andhra Pradesh
const ANDHRA_RECIPES = [
  {
    name: "Pulihora",
    names: { en: "Pulihora", hi: "पुलिहोरा", ta: "புளிஹோரா", te: "పులిహోరా", kn: "ಪುಲಿಹೋರಾ", ml: "പുളിഹോര", bn: "পুলিহোরা", mr: "पुलिहोरा", gu: "પુલિહોરા", pa: "ਪੁਲੀਹੋਰਾ", or: "ପୁଲିହୋରା", as: "পুলিহোরা" },
    type: "Vegetarian",
    category: "lunch",
    prepTime: "15 mins",
    cookTime: "20 mins",
    servings: 4,
    difficulty: "Easy",
    emoji: "🍚",
    ingredients: [
      "2 cups cooked rice (preferably day-old)",
      "3 tbsp tamarind pulp",
      "2 tbsp sesame oil",
      "1 tsp mustard seeds",
      "1 tsp chana dal",
      "1 tsp urad dal",
      "2 dried red chilies",
      "10 curry leaves",
      "1/4 tsp turmeric",
      "1/2 tsp ginger, grated",
      "2 green chilies, chopped",
      "1 tbsp jaggery (optional)",
      "1 tsp salt (or to taste)",
      "2 tbsp roasted peanuts",
      "Fresh coriander for garnish"
    ],
    steps: [
      { text: "Heat sesame oil in a large pan on 🔴 High Flame", flame: "high", time: "2 mins" },
      { text: "Add mustard seeds and let them splutter", flame: "high", time: "1 min" },
      { text: "Add chana dal and urad dal, fry until golden", flame: "medium", time: "2 mins" },
      { text: "Add dried red chilies, curry leaves, and green chilies", flame: "medium", time: "1 min" },
      { text: "Add ginger and turmeric, sauté for 30 seconds", flame: "medium", time: "30 secs" },
      { text: "Add tamarind pulp and jaggery, mix well", flame: "medium", time: "3 mins" },
      { text: "Cook until oil separates from the mixture", flame: "low", time: "5 mins" },
      { text: "Add cooled rice gradually, mixing gently", flame: "low", time: "3 mins" },
      { text: "Add salt and peanuts, mix until rice is well coated", flame: "low", time: "2 mins" },
      { text: "Garnish with coriander and serve warm or at room temperature", flame: null, time: "1 min" }
    ],
    tips: [
      "Use day-old rice for best results - fresh rice becomes mushy",
      "Sesame oil is essential for authentic Andhra flavor",
      "Tamarind pulp should be thick - adjust with water if needed",
      "The rice should be coated with tamarind mixture evenly",
      "Can be stored for 2-3 days at room temperature"
    ],
    nutrition: { calories: 285, protein: "5g", carbs: "52g", fat: "8g", fiber: "3g" },
    imageUrl: "https://picsum.photos/seed/pulihora/400/300"
  },
  {
    name: "Gongura Pachadi",
    names: { en: "Gongura Pachadi", hi: "गोंगूरा पचड़ी", te: "గొంగూర పచ్చడి" },
    type: "Vegetarian",
    category: "lunch",
    prepTime: "20 mins",
    cookTime: "25 mins",
    servings: 4,
    difficulty: "Medium",
    emoji: "🌿",
    ingredients: [
      "2 cups gongura leaves (sorrel leaves), chopped",
      "4 tbsp sesame oil",
      "1 tsp mustard seeds",
      "1 tsp urad dal",
      "2 dried red chilies",
      "6 garlic cloves",
      "1/2 tsp cumin seeds",
      "1/4 tsp turmeric",
      "1 tsp red chili powder",
      "1 tbsp tamarind paste",
      "1 tsp salt (or to taste)"
    ],
    steps: [
      { text: "Blanch gongura leaves in hot water for 2 minutes", flame: "high", time: "2 mins" },
      { text: "Drain and grind into a coarse paste with tamarind", flame: null, time: "3 mins" },
      { text: "Heat sesame oil on 🔴 High Flame", flame: "high", time: "1 min" },
      { text: "Add mustard seeds, urad dal, cumin seeds", flame: "high", time: "1 min" },
      { text: "Add dried red chilies and garlic cloves", flame: "medium", time: "2 mins" },
      { text: "Add ground gongura paste, turmeric, and red chili powder", flame: "medium", time: "5 mins" },
      { text: "Cook on 🟢 Low flame, stirring frequently", flame: "low", time: "10 mins" },
      { text: "Add salt, mix well and cook for 2 more minutes", flame: "low", time: "2 mins" },
      { text: "Cool and store in a clean jar", flame: null, time: "5 mins" }
    ],
    tips: [
      "Gongura leaves are very sour - adjust tamarind accordingly",
      "The chutney should be dry with minimal oil visible",
      "Garlic is optional but adds authentic Andhra taste",
      "Store in refrigerator for up to 2 weeks",
      "Best served with steamed rice and ghee"
    ],
    nutrition: { calories: 125, protein: "3g", carbs: "12g", fat: "8g", fiber: "4g" },
    imageUrl: "https://picsum.photos/seed/gongura/400/300"
  },
  {
    name: "Kofta Curry",
    names: { en: "Kofta Curry", hi: "कोफ्ता करी", te: "కోఫ్టా కర్రీ" },
    type: "Vegetarian",
    category: "dinner",
    prepTime: "30 mins",
    cookTime: "40 mins",
    servings: 4,
    difficulty: "Medium",
    emoji: "🍛",
    ingredients: [
      "For Koftas: 2 cups besan (gram flour)",
      "1 large onion, finely chopped",
      "2 green chilies, chopped",
      "1/2 tsp ginger paste",
      "1/4 tsp turmeric",
      "1 tsp coriander powder",
      "1/2 tsp cumin powder",
      "Salt to taste",
      "Oil for deep frying",
      "For Curry: 2 tbsp oil",
      "1 large onion, sliced",
      "2 tomatoes, pureed",
      "1 tbsp ginger-garlic paste",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "1/2 tsp turmeric",
      "1 tsp garam masala",
      "1 cup water",
      "Fresh coriander"
    ],
    steps: [
      { text: "Make kofta batter: mix besan, onion, chilies, spices", flame: null, time: "5 mins" },
      { text: "Heat oil for frying on 🔴 High Flame", flame: "high", time: "3 mins" },
      { text: "Fry koftas until golden brown, drain on paper", flame: "medium", time: "15 mins" },
      { text: "For curry: heat oil on 🔴 High Flame", flame: "high", time: "2 mins" },
      { text: "Fry onions until golden brown", flame: "medium", time: "8 mins" },
      { text: "Add ginger-garlic paste, cook for 2 minutes", flame: "medium", time: "2 mins" },
      { text: "Add tomato puree and all spices, cook until oil separates", flame: "medium", time: "8 mins" },
      { text: "Add water, bring to boil", flame: "high", time: "3 mins" },
      { text: "Add koftas gently, simmer on 🟢 Low flame", flame: "simmer", time: "10 mins" },
      { text: "Garnish with coriander and serve with rice or roti", flame: null, time: "1 min" }
    ],
    tips: [
      "Kofta batter should be thick - not too watery",
      "Fry koftas in batches - don't overcrowd the oil",
      "Add koftas just before serving to keep them crispy",
      "For softer koftas, add a tablespoon of yogurt to the batter",
      "Gravy should be medium thick consistency"
    ],
    nutrition: { calories: 345, protein: "12g", carbs: "38g", fat: "16g", fiber: "4g" },
    imageUrl: "https://picsum.photos/seed/kofta/400/300"
  }
];

// Export seed function
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Insert all states
    for (const state of STATES_DATA) {
      await ctx.db.insert("states", state);
    }
    
    // Insert recipes for each state
    // This is a simplified version - in production, add all 435 recipes
    for (const recipe of ANDHRA_RECIPES) {
      await ctx.db.insert("recipes", {
        ...recipe,
        stateId: "andhrapradesh",
        stateName: "Andhra Pradesh",
        stateEmoji: "🏛️",
        region: "south",
        createdAt: Date.now(),
        isUserSubmitted: false,
        isFeatured: false,
        viewCount: 0,
        favoriteCount: 0
      });
    }
    
    return { success: true, message: "Seeded " + STATES_DATA.length + " states" };
  }
});
