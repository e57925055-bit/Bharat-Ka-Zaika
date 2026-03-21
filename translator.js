// ============================================
// BHARAT KA ZAIKA — Translation Engine
// LibreTranslate API (Free, no API key)
// ============================================

const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

// Supported language codes for LibreTranslate
const LIBRE_LANG_MAP = {
    'hi': 'hi',   // Hindi
    'bn': 'bn',   // Bengali
    'ta': 'ta',   // Tamil
    'te': 'te',   // Telugu
    'mr': 'mr',   // Marathi
    'gu': 'gu',   // Gujarati
    'pa': 'pa',   // Punjabi (Gurmukhi)
    'ml': 'ml',   // Malayalam
    'kn': 'kn',   // Kannada
    'ur': 'ur',   // Urdu
    'en': 'en',   // English
    'or': 'or',   // Odia — may fallback
    'as': 'hi',   // Assamese → Hindi fallback
    'ks': 'ur',   // Kashmiri → Urdu fallback
    'kok':'mr',   // Konkani → Marathi fallback
    'mai':'hi',   // Maithili → Hindi fallback
    'mni':'bn',   // Meitei → Bengali fallback
};

// ===== Translation Cache (localStorage) =====
function getCachedTranslation(text, lang) {
    try {
        const key = 'trans_' + lang + '_' + text.substring(0, 80);
        return localStorage.getItem(key);
    } catch(e) { return null; }
}

function setCachedTranslation(text, lang, result) {
    try {
        const key = 'trans_' + lang + '_' + text.substring(0, 80);
        localStorage.setItem(key, result);
    } catch(e) {} // quota exceeded — silently fail
}

// ===== Core Translation Function =====
async function translateText(text, targetLang) {
    if (!text || !targetLang || targetLang === 'en') return text;

    // Map to supported LibreTranslate code
    const apiLang = LIBRE_LANG_MAP[targetLang] || 'hi';

    // Check cache first
    const cached = getCachedTranslation(text, apiLang);
    if (cached) return cached;

    try {
        const url = `${TRANSLATE_API}?client=gtx&sl=en&tl=${apiLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('API error ' + response.status);

        const data = await response.json();
        
        let result = text;
        if (data && data[0]) {
            result = data[0].map(item => item[0]).join('');
        }
        if (result && result !== text) {
            setCachedTranslation(text, apiLang, result);
            return result;
        }
        return text;
    } catch(e) {
        console.warn('Translation failed:', e.message, '— using fallback');
        return text; // English fallback (no caching on fail)
    }
}

// ===== Batch Translate (multiple texts) =====
async function translateBatch(texts, targetLang) {
    if (!targetLang || targetLang === 'en') return texts;

    const results = [];
    // Process slow and steady to not overwhelm API
    for (let i = 0; i < texts.length; i++) {
        const t = texts[i];
        if (!t || typeof t !== 'string') {
            results.push(t);
            continue;
        }
        results.push(await translateText(t, targetLang));
        // Small delay for Google API
        await new Promise(r => setTimeout(r, 50));
    }
    return results;
}

// ===== UI Text Translations =====
const UI_TEXTS = {
    'en': {
        mapTitle: '🇮🇳 Choose Your State',
        mapSubtitle: 'Tap a state on the map — authentic recipes will open!',
        sectionTitle: '🍽️ What to cook today?',
        searchPlaceholder: 'Type recipe name or state...',
        searchTitle: '🔍 Search Recipes',
        favTitle: '❤️ Favourites',
        noRecipes: 'No recipes found in this category',
        noFav: 'No favourites yet!',
        noFavSub: 'Tap ❤️ on a recipe',
        botTitle: '📝 Add Your Recipe!',
        botDesc: 'Share your recipe on Telegram Bot @Bharatkazaika_bot — with photo! Anyone can use it.',
        ingredients: '🥘 Ingredients',
        cookingSteps: '👨‍🍳 Cooking Steps',
        chefTips: '💡 Chef Tips',
        nutrition: '🔬 Nutrition (per serving)',
        servings: 'servings',
        calories: 'Calories', protein: 'Protein', carbs: 'Carbs', fat: 'Fat',
        allStates: '🗺️ All States',
        recipeCount: 'recipes',
        allRecipes: '🌟 All Recipes',
        addedToFav: 'Added to favourites!',
        removedFromFav: 'Removed from favourites',
        langChanged: '🌐 Language:',
        sendToBot: '📤 Send to @Bharatkazaika_bot',
        telegramBotSection: '✈️ Telegram Bot',
        telegramBotDesc: 'Share or add a new recipe on @Bharatkazaika_bot — with image!',
        
        botPageHeading: 'What is this Bot?',
        botPageDesc1: 'This bot is for users like you. You can add authentic recipes from your own state/district!',
        botPageDesc2: 'Just share standard text and a photo. It automatically updates in this app for everyone to see and cook.',
        botPageBtn: '📤 Open Telegram Bot'
    },
    'hi': {
        mapTitle: '🇮🇳 अपना राज्य चुनिए',
        mapSubtitle: 'मैप पर राज्य टैप करो — वहीं की ऑथेंटिक रेसिपीज़ खुलेंगी!',
        sectionTitle: '🍽️ आज क्या बनाएं?',
        searchPlaceholder: 'रेसिपी का नाम या राज्य लिखो...',
        searchTitle: '🔍 रेसिपी खोजें',
        favTitle: '❤️ पसंदीदा',
        noRecipes: 'इस कैटेगरी में कोई रेसिपी नहीं',
        noFav: 'अभी तक कोई पसंदीदा नहीं!',
        noFavSub: 'रेसिपी पे ❤️ टैप करो',
        botTitle: '📝 अपनी रेसिपी डालो!',
        botDesc: 'टेलीग्राम बॉट @Bharatkazaika_bot पर अपनी माँ के हाथ की रेसिपी शेयर करो — फोटो के साथ!',
        ingredients: '🥘 सामग्री',
        cookingSteps: '👨‍🍳 पकाने के चरण',
        chefTips: '💡 शेफ टिप्स',
        nutrition: '🔬 पोषण (प्रति सर्विंग)',
        servings: 'सर्विंग्स',
        calories: 'कैलोरीज़', protein: 'प्रोटीन', carbs: 'कार्ब्स', fat: 'फैट',
        allStates: '🗺️ सभी राज्य',
        recipeCount: 'रेसिपीज़',
        allRecipes: '🌟 सभी रेसिपीज़',
        addedToFav: '❤️ पसंदीदा में जोड़ दी!',
        removedFromFav: '💔 पसंदीदा से हटा दी',
        langChanged: '🌐 भाषा:',
        sendToBot: '📤 बॉट को भेजें',
        telegramBotSection: '✈️ टेलीग्राम बॉट',
        telegramBotDesc: '@Bharatkazaika_bot पर अपनी रेसिपी शेयर करो या नई रेसिपी डालो — इमेज के साथ!',
        
        botPageHeading: 'यह बॉट क्या है?',
        botPageDesc1: 'यह बॉट आप जैसे यूज़र्स के लिए है। आप अपने राज्य/ज़िले की ऑथेंटिक रेसिपी यहाँ डाल सकते हैं!',
        botPageDesc2: 'बस टेक्स्ट और फोटो शेयर करें। यह इस ऐप में ऑटोमैटिकली सबको दिखने लगेगी।',
        botPageBtn: '📤 टेलीग्राम बॉट खोलें'
    }
};

// Get UI text in current language
function uiText(key) {
    const lang = window._appLang || 'hi';
    if (UI_TEXTS[lang] && UI_TEXTS[lang][key]) {
        return UI_TEXTS[lang][key];
    }
    // Try Hindi fallback, then English
    return UI_TEXTS['hi'][key] || UI_TEXTS['en'][key] || key;
}

// ===== Translate recipe content for display =====
async function translateRecipeForDisplay(recipe, lang) {
    if (!lang || lang === 'en') {
        return {
            name: recipe.name,
            ingredients: recipe.ingredients || [],
            steps: (recipe.steps || []).map(s => typeof s === 'string' ? s : s.text),
            tips: recipe.tips || []
        };
    }

    // Try cache for the full recipe
    const cacheKey = 'recipe_' + lang + '_' + (recipe.name || '').substring(0, 50);
    const cachedFull = getCachedTranslation(cacheKey, lang);
    if (cachedFull) {
        try { return JSON.parse(cachedFull); } catch(e) {}
    }

    // Translate individual parts
    const translatedName = await translateText(recipe.name || '', lang);

    const rawIngs = recipe.ingredients || [];
    const translatedIngs = await translateBatch(rawIngs, lang);

    const rawSteps = (recipe.steps || []).map(s => typeof s === 'string' ? s : (s.text || ''));
    const translatedSteps = await translateBatch(rawSteps, lang);

    const rawTips = recipe.tips || [];
    const translatedTips = await translateBatch(rawTips, lang);

    const result = {
        name: translatedName,
        ingredients: translatedIngs,
        steps: translatedSteps,
        tips: translatedTips
    };

    // Cache the full recipe translation
    try {
        setCachedTranslation(cacheKey, lang, JSON.stringify(result));
    } catch(e) {}

    return result;
}

// ===== Show translation loading spinner =====
function showTranslateSpinner(container) {
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;">
            <div class="translate-spinner"></div>
            <p style="margin-top:12px;font-size:13px;color:#888;">${window._appLang === 'hi' ? '🌐 अनुवाद हो रहा है...' : '🌐 Translating...'}</p>
        </div>
    `;
}

// Expose globally
window.translateText = translateText;
window.translateBatch = translateBatch;
window.translateRecipeForDisplay = translateRecipeForDisplay;
window.uiText = uiText;
window.showTranslateSpinner = showTranslateSpinner;
window.UI_TEXTS = UI_TEXTS;
