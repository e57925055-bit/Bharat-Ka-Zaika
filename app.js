// ============================================
// भारत का जायका - Complete App Logic
// ============================================

// State
let currentLang = localStorage.getItem('selectedLanguage') || 'hi';
let currentTab = 'recipes';
let currentCategory = 'all';
let currentState = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
let allRecipes = [];

// Language Names in Native Scripts
const languageNames = {
    'hi': 'हिंदी', 'en': 'English', 'hi-Latn': 'Hinglish', 'bn': 'বাংলা',
    'ta': 'தமிழ்', 'te': 'తెలుగు', 'mr': 'मराठी', 'gu': 'ગુજરાતી',
    'pa': 'ਪੰਜਾਬੀ', 'ml': 'മലയാളം', 'kn': 'ಕನ್ನಡ', 'or': 'ଓଡ଼ିଆ',
    'as': 'অসমীয়া', 'ur': 'اردو', 'mai': 'मैथिली', 'sat': 'Santali',
    'ks': 'कॉशुर', 'kok': 'कोंकणी', 'sd': 'Sindhi', 'doi': 'डोगरी',
    'mni': 'মৈতৈলোন্', 'brx': 'बड़ो'
};

// UI Translations
const translations = {
    'hi': {
        'appTitle': 'भारत का जायका', 'appSubtitle': '29 राज्य • 435+ व्यंजन',
        'searchPlaceholder': 'रेसिपी, राज्य खोजें...', 'popularRecipes': 'लोकप्रिय व्यंजन',
        'allStates': 'सभी 29 राज्य', 'footer': '❤️ से बनाया भारत की पाक विविधता का जश्न'
    },
    'en': {
        'appTitle': "Bharat Ka Zayka", 'appSubtitle': '29 States • 435+ Recipes',
        'searchPlaceholder': 'Search recipes, states...', 'popularRecipes': 'Popular Recipes',
        'allStates': 'All 29 States', 'footer': 'Made with ❤️ celebrating India\'s culinary heritage'
    },
    'hi-Latn': {
        'appTitle': 'Bharat Ka Zayka', 'appSubtitle': '29 Rajya • 435+ Vyanjaan',
        'searchPlaceholder': 'Recipes, rajya khojo...', 'popularRecipes': 'Lokpriya Vyanjaan',
        'allStates': 'Sabhi 29 Rajya', 'footer': '❤️ se banaya Bharat ki pak vivakshata ka jashn'
    },
    'bn': {
        'appTitle': 'ভারতের জায়িকা', 'appSubtitle': '29টি রাজ্য • 435+ রেসিপি',
        'searchPlaceholder': 'রেসিপি, রাজ্য খুঁজুন...', 'popularRecipes': 'জনপ্রিয় রেসিপি',
        'allStates': 'সমস্ত ২৯টি রাজ্য', 'footer': '❤️ দিয়ে তৈরি ভারতের রন্ধন ঐতিহ্য উদযাপন'
    },
    'ta': {
        'appTitle': 'பாரதத்தின் சுவை', 'appSubtitle': '29 மாநிலங்கள் • 435+ சமையல்',
        'searchPlaceholder': 'சமையல், மாநிலம் தேடு...', 'popularRecipes': 'பிரபலமான சமையல்',
        'allStates': 'அனைத்து 29 மாநிலங்கள்', 'footer': '❤️ உடன் உருவாக்கப்பட்டது'
    },
    'te': {
        'appTitle': 'భారత జాయకా', 'appSubtitle': '29 రాష్ట్రాలు • 435+ వంటకాలు',
        'searchPlaceholder': 'వంటకాలు, రాష్ట్రాలు వెతుకు...', 'popularRecipes': 'జనప్రియ వంటకాలు',
        'allStates': 'మొత్తం 29 రాష్ట్రాలు', 'footer': '❤️తో తయారు చేయబడింది'
    },
    'mr': {
        'appTitle': 'भारताची चव', 'appSubtitle': '29 राज्य • 435+ पदार्थ',
        'searchPlaceholder': 'पदार्थ, राज्य शोधा...', 'popularRecipes': 'लोकप्रिय पदार्थ',
        'allStates': 'सर्व 29 राज्य', 'footer': '❤️ ने बनवले'
    },
    'gu': {
        'appTitle': 'ભારતનો સ્વાદ', 'appSubtitle': '29 રાજ્યો • 435+ વાનગીઓ',
        'searchPlaceholder': 'વાનગીઓ, રાજ્યો શોધો...', 'popularRecipes': 'લોકપ્રિય વાનગીઓ',
        'allStates': 'બધા 29 રાજ્યો', 'footer': '❤️ થી બનાવ્યું'
    },
    'pa': {
        'appTitle': 'ਭਾਰਤ ਦਾ ਸੁਆਦ', 'appSubtitle': '29 ਸੂਬੇ • 435+ ਵਿਅੰਜਨ',
        'searchPlaceholder': 'ਵਿਅੰਜਨ, ਸੂਬੇ ਲੱਭੋ...', 'popularRecipes': 'ਮਸ਼ਹੂਰ ਵਿਅੰਜਨ',
        'allStates': 'ਸਾਰੇ 29 ਸੂਬੇ', 'footer': '❤️ ਨਾਲ ਬਣਾਇਆ'
    },
    'ml': {
        'appTitle': 'ഭാരതത്തിൻറെ സ്വാദ്', 'appSubtitle': '29 സംസ്ഥാനം • 435+ വിഭവങ്ങൾ',
        'searchPlaceholder': 'വിഭവങ്ങൾ, സംസ്ഥാനം തിരയൂ...', 'popularRecipes': 'പ്രശസ്ത വിഭവങ്ങൾ',
        'allStates': 'എല്ലാ 29 സംസ്ഥാനങ്ങളും', 'footer': '❤️ കൊണ്ട് ഉണ്ടാക്കിയത്'
    },
    'kn': {
        'appTitle': 'ಭಾರತದ ಸ್ವಾದ', 'appSubtitle': '29 ರಾಜ್ಯ • 435+ ಅಡುಗೆ',
        'searchPlaceholder': 'ಅಡುಗೆ, ರಾಜ್ಯ ಹುಡುಕಿ...', 'popularRecipes': 'ಜನಪ್ರಿಯ ಅಡುಗೆ',
        'allStates': 'ಎಲ್ಲಾ 29 ರಾಜ್ಯಗಳು', 'footer': '❤️ ರಿಂದ ಮಾಡಲಾಗಿದೆ'
    },
    'or': {
        'appTitle': 'ଭାରତର ସ୍ବାଦ', 'appSubtitle': '29ଟି ରାଜ୍ୟ • 435+ ପାକ',
        'searchPlaceholder': 'ପାକ, ରାଜ୍ୟ ଖୋଜିବା...', 'popularRecipes': 'ଲୋକପ୍ରିୟ ପାକ',
        'allStates': 'ସମସ୍ତ 29ଟି ରାଜ୍ୟ', 'footer': '❤️ ରୁ ତିଆରି'
    },
    'as': {
        'appTitle': 'ভাৰতৰ স্বাদ', 'appSubtitle': '29খন ৰাজ্য • 435+ ৰান্ধনি',
        'searchPlaceholder': 'ৰান্ধনি, ৰাজ্য সন্ধান...', 'popularRecipes': 'জনপ্রিয় ৰান্ধনি',
        'allStates': 'সকলো 29খন ৰাজ্য', 'footer': '❤️ৰে তৈয়াৰ'
    },
    'ur': {
        'appTitle': 'بھارت کا ذائقہ', 'appSubtitle': '29 ریاستیں • 435+ ترکیبیں',
        'searchPlaceholder': 'ترکیبیں، ریاستیں تلاش کریں...', 'popularRecipes': 'مقبول ترکیبیں',
        'allStates': 'تمام 29 ریاستیں', 'footer': '❤️ سے بنایا گیا'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // ─── Splash Screen: fade out after 2s ───
    const splash = document.getElementById('splashScreen');
    const appCont = document.getElementById('appContainer');
    setTimeout(() => {
        if (splash) splash.classList.add('hide');
        if (appCont) {
            appCont.style.display = 'block';
        }
    }, 2000);

    collectAllRecipes();
    
    if (!localStorage.getItem('selectedLanguage')) {
        // First boot: show Map Screen after splash
        setTimeout(() => {
            document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            let mapBtn = document.querySelector('[data-target="map"]');
            if (mapBtn) mapBtn.classList.add('active');
            let mapScreen = document.getElementById('mapScreen');
            if (mapScreen) {
                mapScreen.classList.remove('hidden');
                if (window.loadIndiaMap) window.loadIndiaMap();
            }
        }, 2200);
    } else {
        currentLang = localStorage.getItem('selectedLanguage');
        const savedState = localStorage.getItem('selectedState');
        if (savedState && window.originalAllRecipes === undefined) {
            window.originalAllRecipes = [...window.allRecipes];
            window.allRecipes = window.originalAllRecipes.filter(r => (r.stateName || r.state || '').toLowerCase() === savedState.toLowerCase());
            setTimeout(() => {
                const bTitle = document.getElementById('bannerTitle');
                if (bTitle) bTitle.innerText = `📍 ${savedState} Recipes`;
                const subtitle = document.getElementById('stateSubtitle');
                if (subtitle) subtitle.innerText = `Viewing authentic recipes from ${savedState}`;
            }, 100);
        }
        initApp();
    }
    
    setupEventListeners();
});

// Hide loading immediately after recipes load
function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Language Selection - Interactive Map
function showLangSelection() {
    document.getElementById('langOverlay').classList.remove('hidden');
}

function setupMapLanguageSelection() {
    const stateBtns = document.querySelectorAll('.state-btn');
    const englishBtn = document.getElementById('englishBtn');
    const selectedDisplay = document.getElementById('selectedStateDisplay');
    const tapHint = document.getElementById('tapHint');
    
    let selectedLang = null;
    let enterBtn = null;
    
    function selectLanguage(lang, nativeName) {
        // Remove previous selection
        stateBtns.forEach(p => p.classList.remove('selected'));
        
        // Highlight selected state
        stateBtns.forEach(p => {
            if (p.dataset.lang === lang) {
                p.classList.add('selected');
            }
        });
        
        // Update display
        selectedDisplay.innerHTML = `
            <div class="selected-lang-text">${nativeName}</div>
            <div class="selected-lang-name">Language Selected</div>
            <button class="enter-btn" id="enterAppBtn">
                🚀 Enter App →
            </button>
        `;
        
        selectedLang = lang;
        
        // Add enter button handler
        document.getElementById('enterAppBtn').addEventListener('click', () => {
            enterApp(lang);
        });
    }
    
    // State map click handlers
    stateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            const nativeName = btn.dataset.name;
            selectLanguage(lang, nativeName);
        });
    });
    
    async function checkConvexAndInit() {
        try {
            console.log("Checking for mock backend...");
            
            // Setup Splash Screen logic
            setTimeout(() => {
                const splash = document.getElementById('splashScreen');
                const container = document.getElementById('appContainer');
                if (splash && container) {
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        splash.style.display = 'none';
                        container.style.display = 'block';
                    }, 500); // Wait for transition
                }
            }, 1500);

            if (window.MOCK_CONVEX_ENABLED) {
                // This part of the code was incomplete in the provided snippet.
                // Assuming it's meant to be part of the checkConvexAndInit function.
                // The original instruction was only about the splash screen.
            }
        } catch (error) {
            console.error("Error in checkConvexAndInit:", error);
        }
    }
    
    // English button handler
    englishBtn.addEventListener('click', () => {
        selectLanguage('en', 'English', 'English Language');
    });
}

function enterApp(lang) {
    // Save to localStorage
    localStorage.setItem('selectedLanguage', lang);
    currentLang = lang;
    
    // Hide language overlay immediately
    document.getElementById('langOverlay').classList.add('hidden');
    
    // Update UI with new language
    updateUI();
    updateLangButtons();
    renderStates();
    renderRecipes();
    
    // If app container already exists, just show it
    const appContainer = document.getElementById('appContainer');
    if (appContainer) {
        appContainer.classList.add('visible');
    } else {
        initApp();
    }
}

function setupLangSelection() {
    // Legacy function - handled by setupMapLanguageSelection now
}

function openLangSheet() {
    // Show the full language selection overlay
    document.getElementById('langOverlay').classList.remove('hidden');
    setupMapLanguageSelection();
    
    // Pre-select current language if any state matches
    const stateBtns = document.querySelectorAll('.state-btn');
    stateBtns.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.click(); // Auto-select current language
        }
    });
}

function closeLangSheet() {
    document.getElementById('langSheet').classList.remove('visible');
}

function updateLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.lang === currentLang);
    });
}

// Collect All Recipes
function collectAllRecipes() {
    allRecipes = [];
    if (typeof indianRecipes !== 'undefined' && indianRecipes.states) {
        indianRecipes.states.forEach(state => {
            state.recipes.forEach(recipe => {
                allRecipes.push({
                    ...recipe,
                    stateId: state.id,
                    stateName: state.name,
                    stateEmoji: state.emoji,
                    stateColor: state.color
                });
            });
        });
    }
}

// Initialize App
function initApp() {
    document.getElementById('appContainer').classList.add('visible');
    setupLangSelection();
    updateUI();
    renderStates();
    renderRecipes();
    renderPlanner();
}

// Update UI with current language
function updateUI() {
    const t = translations[currentLang] || translations['en'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
}

// Get Recipe Name in Current Language
function getRecipeName(recipe) {
    if (recipe.names && recipe.names[currentLang]) {
        return recipe.names[currentLang];
    }
    if (recipe.names && recipe.names['en']) {
        return recipe.names['en'];
    }
    return recipe.name;
}

// Get Recipe Image
function getRecipeImage(recipe) {
    const seed = recipe.name.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'food';
    return `https://picsum.photos/seed/${seed}/400/300`;
}

// Get State Image  
function getStateImage(state) {
    const seed = state.name.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'india';
    return `https://picsum.photos/seed/${seed}/400/300`;
}

// Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterRecipes(query);
    });
    
    // Category Chips
    document.getElementById('categoryChips').addEventListener('click', (e) => {
        if (e.target.classList.contains('category-chip')) {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderRecipes();
        }
    });
    
    // Tab Navigation
    document.getElementById('tabNav').addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentTab = e.target.dataset.tab;
            showSection(currentTab);
        }
    });
    
    // Language Grid
    setupLangSelection();
}

// Show Section
function showSection(tab) {
    document.getElementById('recipesSection').style.display = tab === 'recipes' ? 'block' : 'none';
    document.getElementById('statesSection').style.display = tab === 'states' ? 'block' : 'none';
    document.getElementById('plannerSection').style.display = tab === 'planner' ? 'block' : 'none';
    document.getElementById('homeBanner').style.display = tab === 'recipes' ? 'block' : 'none';
    document.getElementById('backBtn').classList.toggle('visible', tab === 'planner' && currentState);
}

// Render States
function renderStates() {
    const grid = document.getElementById('statesGrid');
    grid.innerHTML = '';
    
    if (typeof indianRecipes !== 'undefined' && indianRecipes.states) {
        indianRecipes.states.forEach((state, index) => {
            const card = document.createElement('div');
            card.className = 'state-card';
            card.style.animationDelay = `${index * 50}ms`;
            card.innerHTML = `
                <div class="state-emoji">${state.emoji}</div>
                <div class="state-info">
                    <h4>${state.name}</h4>
                    <p>${state.recipes.length} recipes</p>
                </div>
            `;
            card.addEventListener('click', () => showStateRecipes(state));
            grid.appendChild(card);
        });
    }
}

// Show State Recipes
function showStateRecipes(state) {
    currentState = state;
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="recipes"]').classList.add('active');
    currentTab = 'recipes';
    showSection('recipes');
    
    const filtered = state.recipes.map(r => ({
        ...r,
        stateId: state.id,
        stateName: state.name,
        stateEmoji: state.emoji
    }));
    
    renderRecipeGrid(filtered);
}

// Render Recipes
function renderRecipes() {
    let filtered = [...allRecipes];
    
    // Category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => {
            const name = r.name.toLowerCase();
            switch(currentCategory) {
                case 'breakfast': return name.includes('poha') || name.includes('idli') || name.includes('dosa') || name.includes('paratha') || name.includes('puri') || name.includes('upma');
                case 'lunch': return name.includes('biryani') || name.includes('pulav') || name.includes('rice') || name.includes('curry');
                case 'dinner': return name.includes('roti') || name.includes('naan') || name.includes('dal') || name.includes('sabzi');
                case 'snacks': return name.includes('samosa') || name.includes('vada') || name.includes('pakora') || name.includes('chaat') || name.includes('kebab');
                case 'sweets': return name.includes('halwa') || name.includes('laddu') || name.includes('barfi') || name.includes('payasam') || name.includes('kheer') || name.includes('mithai');
                case 'veg': return r.type === 'Vegetarian';
                case 'nonveg': return r.type === 'Non-Vegetarian';
                default: return true;
            }
        });
    }
    
    renderRecipeGrid(filtered);
}

function renderRecipeGrid(recipes) {
    const grid = document.getElementById('recipesGrid');
    grid.innerHTML = '';
    
    if (recipes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🍽️</div>
                <h3>No recipes found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
        return;
    }
    
    recipes.forEach((recipe, index) => {
        const isFav = favorites.includes(recipe.name);
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.animationDelay = `${index * 50}ms`;
        
        card.innerHTML = `
            <div class="recipe-card-image">
                <img src="${getRecipeImage(recipe)}" alt="${getRecipeName(recipe)}" 
                     onerror="this.src='https://picsum.photos/400/300'">
                <div class="recipe-card-veg ${recipe.type === 'Non-Vegetarian' ? 'non-veg' : ''}">
                    <span>●</span> ${recipe.type === 'Vegetarian' ? 'Veg' : 'Non-Veg'}
                </div>
                <button class="recipe-card-heart ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(event, '${recipe.name}')">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="recipe-card-content">
                <div class="recipe-card-state">${recipe.stateEmoji} ${recipe.stateName || recipe.stateName}</div>
                <h3 class="recipe-card-title">${getRecipeName(recipe)}</h3>
                <div class="recipe-card-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>📊 ${recipe.difficulty}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openRecipeModal(recipe));
        grid.appendChild(card);
    });
}

// Filter Recipes
function filterRecipes(query) {
    let filtered = allRecipes;
    
    if (query) {
        filtered = allRecipes.filter(r => 
            getRecipeName(r).toLowerCase().includes(query) ||
            r.name.toLowerCase().includes(query) ||
            (r.stateName || '').toLowerCase().includes(query)
        );
    }
    
    if (currentCategory !== 'all') {
        // Apply category filter
        filtered = filtered.filter(r => {
            const name = r.name.toLowerCase();
            switch(currentCategory) {
                case 'breakfast': return name.includes('poha') || name.includes('idli') || name.includes('dosa') || name.includes('paratha') || name.includes('upma') || name.includes('uttapam');
                case 'lunch': return name.includes('biryani') || name.includes('pulav') || name.includes('rice') || name.includes('khichdi') || name.includes('pulao');
                case 'dinner': return name.includes('roti') || name.includes('naan') || name.includes('dal') || name.includes('sabzi') || name.includes('curry');
                case 'snacks': return name.includes('samosa') || name.includes('vada') || name.includes('chaat') || name.includes('pakora') || name.includes('bhaji');
                case 'sweets': return name.includes('halwa') || name.includes('kheer') || name.includes('mithai') || name.includes('ladoo') || name.includes('barfi');
                case 'veg': return r.type === 'Vegetarian';
                case 'nonveg': return r.type === 'Non-Vegetarian';
                case 'home': return name.includes('dal') || name.includes('roti') || name.includes('sabzi') || name.includes('rice') || name.includes('khichdi') || name.includes('poha') || name.includes('parantha') || name.includes('pulao') || name.includes('curry') || name.includes('sambar') || name.includes('rasam');
                default: return true;
            }
        });
    }
    
    renderRecipeGrid(filtered);
}

// Google Auth-free Translation Helper for 22+ Languages
async function translateText(text, targetLang) {
    if (!text || targetLang === 'en' || targetLang === 'hi' && text.match(/[अ-ह]/)) return text;
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const json = await res.json();
        return json[0].map(x => x[0]).join('');
    } catch (e) {
        return text;
    }
}

// Recipe Modal
async function openRecipeModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const detail = document.getElementById('recipeDetail');
    const isFav = favorites.includes(recipe.name);
    
    // Parse steps - handle both old format (array of strings) and new format (array of objects)
    const renderSteps = (steps) => {
        return steps.map((step, i) => {
            const stepText = typeof step === 'string' ? step : step.text || '';
            const flame = typeof step === 'object' ? step.flame : null;
            const flameIcon = flame === 'high' ? '🔴' : flame === 'medium' ? '🟡' : flame === 'low' ? '🟢' : flame === 'simmer' ? '⚫' : '';
            const flameText = flame ? `<span class="flame-chip flame-${flame}">${flameIcon} ${flame}</span>` : '';
            return `
                <div class="step-item">
                    <div class="step-number">${i + 1}</div>
                    <div class="step-text">
                        <span class="step-text-content">${stepText}</span>
                        ${flameText}
                    </div>
                </div>
            `;
        }).join('');
    };
    
    // Render tips
    const renderTips = (tips) => {
        if (!tips || tips.length === 0) {
            return '<p class="no-tips">No chef tips available for this recipe</p>';
        }
        return tips.map((tip, i) => `
            <div class="tip-item">
                <span class="tip-icon">💡</span>
                <span>${tip}</span>
            </div>
        `).join('');
    };
    
    document.getElementById('recipeModal').classList.add('active');
    
    // Show a beautiful translating UI paper background
    detail.innerHTML = `
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="template-body" style="text-align: center; min-height: 50vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h2 style="color: #D81B60; font-family: 'Poppins', sans-serif; font-size: 2rem;">Translating... 🌍</h2>
            <p style="color: #555; font-size: 1.2rem; margin-top: 15px;">Loading your authentic local recipe experience</p>
            <div style="margin-top: 30px; border: 4px solid #f3f3f3; border-top: 4px solid #D81B60; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;

    const lang = window.currentLang || 'en';
    
    // Base English/Format texts
    let tName = getRecipeName(recipe);
    let tDesc = recipe.description || 'A delicious and authentic recipe from ' + recipe.stateName + '. Perfect for starting your day or enjoying with family.';
    let tIngredients = recipe.ingredients.map(ing => typeof ing === 'string' ? ing : ing.text || ing);
    let tSteps = (recipe.steps || []).map(step => typeof step === 'string' ? step : step.text || step);
    let categoryText = (recipe.category || 'Special') + ' Recipes';
    let headers = { ing: "Ingredients:", dir: "Directions:", nut: "Nutritional Value (Amount per Serving):" };

    // Dynamically translate all recipe parts to the native language!
    if (lang !== 'en') {
        try {
            const [name, desc, cat, hIng, hDir, hNut] = await Promise.all([
                translateText(tName, lang),
                translateText(tDesc, lang),
                translateText(categoryText, lang),
                translateText(headers.ing, lang),
                translateText(headers.dir, lang),
                translateText(headers.nut, lang)
            ]);
            tName = name; tDesc = desc; categoryText = cat;
            headers.ing = hIng; headers.dir = hDir; headers.nut = hNut;

            tIngredients = await Promise.all(tIngredients.map(i => translateText(i, lang)));
            tSteps = await Promise.all(tSteps.map(s => translateText(s, lang)));
        } catch(e) { console.error("Translation limited", e); }
    }

    const nutrition = recipe.nutrition || { calories: '250', protein: '10', carbs: '35', fat: '8', fiber: '3' };
    
    // Inject the final perfectly formatted recipe
    detail.innerHTML = `
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="template-body">
            <div class="template-category" style="display: flex; justify-content: space-between; align-items: center;">
                <span>${categoryText}</span>
                <div style="font-size: 0.9rem; font-weight: normal; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 5px 12px; border-radius: 20px;">
                    🏠 घर पे कैसे बनाएं
                </div>
            </div>
            <h1 class="template-title">${tName}</h1>
            <img class="template-image" src="${getRecipeImage(recipe)}" alt="${tName}" onerror="this.src='https://picsum.photos/800/400'">
            
            <p class="template-intro">${tDesc}</p>
            
            <div class="template-meta">
                Preparation Time: <strong>${recipe.prepTime || recipe.time || '15 mins'}</strong><br>
                Cooking Time: <strong>${recipe.cookTime || '30 mins'}</strong><br>
                Servings: <strong>${recipe.servings || '4'}</strong>
            </div>

            <div class="template-section">
                <h3 class="template-heading">${headers.ing}</h3>
                <ul class="template-ingredients">
                    ${tIngredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>

            <div class="template-section">
                <h3 class="template-heading">${headers.dir}</h3>
                <ol class="template-directions">
                    ${tSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>

            <div class="template-nutrition">
                <div class="template-nutrition-title">${headers.nut}</div>
                <div class="template-nutrition-text">
                    Calories: ${nutrition.calories || 250}, Protein: ${nutrition.protein || 10}g, Carbohydrate: ${nutrition.carbs || 35}g, Fiber: ${nutrition.fiber || 3}g, Fat: ${nutrition.fat || 12}g
                </div>
            </div>
        </div>
    `;
    
    // Tab switching
    detail.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            detail.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            detail.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            detail.querySelector(`#${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    modal.classList.add('visible');
}

// Helper to get timeline width
function getTimeWidth(timeStr) {
    const mins = parseInt(timeStr) || 30;
    return Math.min((mins / 120) * 100, 100) + '%';
}

function closeModal() {
    document.getElementById('recipeModal').classList.remove('visible');
}

// Favorites
function toggleFavorite(event, recipeName) {
    event.stopPropagation();
    
    const index = favorites.indexOf(recipeName);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeName);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update UI
    document.querySelectorAll('.recipe-card-heart').forEach(btn => {
        const isFav = favorites.includes(recipeName);
        btn.innerHTML = isFav ? '❤️' : '🤍';
        btn.classList.toggle('favorited', isFav);
    });
    
}


// Meal Planner
function togglePlanner() {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="planner"]').classList.add('active');
    currentTab = 'planner';
    showSection('planner');
}

function renderPlanner() {
    const grid = document.getElementById('plannerGrid');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayEmojis = ['📅', '📆', '📅', '📆', '📅', '📆', '📅'];
    const meals = ['breakfast', 'lunch', 'dinner'];
    const mealLabels = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner' };
    
    grid.innerHTML = days.map((day, di) => `
        <div class="planner-day">
            <div class="planner-day-header">${dayEmojis[di]} ${day}</div>
            <div class="planner-day-content">
                ${meals.map(meal => {
                    const planKey = `${day.toLowerCase()}_${meal}`;
                    const planned = mealPlan[planKey];
                    return `
                        <div class="planner-slot">
                            <span class="planner-slot-icon">${meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}</span>
                            <span class="planner-slot-label">${mealLabels[meal]}</span>
                            ${planned ? `
                                <span class="planner-slot-recipe">${planned.recipeName}</span>
                                <button class="planner-slot-add" onclick="removeFromPlanner('${planKey}')" style="background: #f44336;">✕</button>
                            ` : `
                                <button class="planner-slot-add" onclick="openPlannerSelector('${day}', '${meal}')">+ Add</button>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function openPlannerSelector(day, meal) {
    const recipes = allRecipes;
    
    const modal = document.getElementById('recipeModal');
    const detail = document.getElementById('recipeDetail');
    
    detail.innerHTML = `
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="modal-body" style="padding-top: 20px;">
            <h3 style="margin-bottom: 15px;">📅 Add to ${day} ${meal}</h3>
            <div class="search-container" style="margin-bottom: 15px;">
                <span class="search-icon">🔍</span>
                <input type="text" class="search-input" id="plannerSearch" placeholder="Search recipes...">
            </div>
            <div class="recipes-grid" id="plannerRecipeGrid" style="max-height: 400px; overflow-y: auto;">
                ${recipes.map(recipe => `
                    <div class="recipe-card" onclick="addToPlannerSlot('${day}', '${meal}', '${recipe.name.replace(/'/g, "\\'")}')">
                        <div class="recipe-card-image" style="height: 120px;">
<img src="${getRecipeImage(recipe)}" alt="${getRecipeName(recipe)}"
                             onerror="this.src='https://picsum.photos/400/300'">
                        </div>
                        <div class="recipe-card-content" style="padding: 10px;">
                            <h4 class="recipe-card-title" style="font-size: 0.9rem;">${getRecipeName(recipe)}</h4>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('visible');
    
    // Search in planner
    document.getElementById('plannerSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = recipes.filter(r => getRecipeName(r).toLowerCase().includes(query));
        document.getElementById('plannerRecipeGrid').innerHTML = filtered.map(recipe => `
            <div class="recipe-card" onclick="addToPlannerSlot('${day}', '${meal}', '${recipe.name.replace(/'/g, "\\'")}')">
                <div class="recipe-card-image" style="height: 120px;">
<img src="${getRecipeImage(recipe)}" alt="${getRecipeName(recipe)}"
                          onerror="this.src='https://picsum.photos/400/300'">
                </div>
                <div class="recipe-card-content" style="padding: 10px;">
                    <h4 class="recipe-card-title" style="font-size: 0.9rem;">${getRecipeName(recipe)}</h4>
                </div>
            </div>
        `).join('');
    });
}

function addToPlannerSlot(day, meal, recipeName) {
    const planKey = `${day.toLowerCase()}_${meal}`;
    mealPlan[planKey] = {
        recipeName: recipeName,
        recipe: allRecipes.find(r => r.name === recipeName)
    };
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    closeModal();
    renderPlanner();
}

function removeFromPlanner(planKey) {
    delete mealPlan[planKey];
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    renderPlanner();
}

function addToPlanner(recipeName) {
    // Open day selector
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals = ['breakfast', 'lunch', 'dinner'];
    
    const modal = document.getElementById('recipeModal');
    const detail = document.getElementById('recipeDetail');
    
    detail.innerHTML = `
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="modal-body" style="padding-top: 20px;">
            <h3 style="margin-bottom: 15px;">📅 Add to Planner</h3>
            ${days.map(day => `
                <div style="margin-bottom: 15px;">
                    <strong>${day}</strong>
                    <div style="display: flex; gap: 10px; margin-top: 8px;">
                        ${meals.map(meal => `
                            <button class="category-chip" onclick="addToPlannerSlot('${day}', '${meal}', '${recipeName.replace(/'/g, "\\'")}')">
                                ${meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Shopping List
function generateShoppingList() {
    const ingredients = [];
    
    Object.values(mealPlan).forEach(plan => {
        if (plan.recipe && plan.recipe.ingredients) {
            ingredients.push(...plan.recipe.ingredients);
        }
    });
    
    // Remove duplicates and sort
    const unique = [...new Set(ingredients)].sort();
    
    const modal = document.getElementById('recipeModal');
    const detail = document.getElementById('recipeDetail');
    
    detail.innerHTML = `
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="modal-body" style="padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3>🛒 Shopping List (${unique.length} items)</h3>
                <div>
                    <button class="icon-btn" onclick="copyShoppingList()" title="Copy">📋</button>
                    <button class="icon-btn" onclick="shareShoppingList()" title="Share">📤</button>
                </div>
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
                ${unique.map(ing => `
                    <div class="ingredient-item">
                        <div class="ingredient-checkbox" onclick="this.classList.toggle('checked')">✓</div>
                        <span>${ing}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('visible');
}

function copyShoppingList() {
    const items = Array.from(document.querySelectorAll('#recipeDetail .ingredient-item span'))
        .map(el => el.textContent)
        .join('\n');
    navigator.clipboard.writeText(items);
    alert('Shopping list copied!');
}

function shareShoppingList() {
    const items = Array.from(document.querySelectorAll('#recipeDetail .ingredient-item span'))
        .map(el => el.textContent)
        .join('\n');
    
    if (navigator.share) {
        navigator.share({
            title: 'Shopping List',
            text: items
        });
    } else {
        copyShoppingList();
    }
}

// Back Navigation
function goBack() {
    currentState = null;
    document.getElementById('backBtn').classList.remove('visible');
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="recipes"]').classList.add('active');
    currentTab = 'recipes';
    showSection('recipes');
    renderRecipes();
}

// Close modal on overlay click
document.getElementById('recipeModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

document.getElementById('langSheet').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeLangSheet();
    }
});

// ========== RECIPE MODAL ==========
function openRecipeModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const detail = document.getElementById('recipeDetail');
    
    const recipeName = recipe.names 
        ? (recipe.names[currentLang] || recipe.names.en || recipe.names.hi || recipe.name) 
        : recipe.name;
    
    // Smart image: use imageUrl from Convex/bot, else Telegraph, else food photo
    const imageUrl = recipe.imageUrl || recipe.image_url || recipe.image || 
        `https://source.unsplash.com/600x400/?indian,food,${encodeURIComponent(recipeName)}`;
    
    const flameIcon = { high: '🔴', medium: '🟡', low: '🟢', simmer: '⚫' };
    
    const ingredientsHTML = (recipe.ingredients || [])
        .map(i => `<li>${i}</li>`).join('');
    
    const stepsHTML = (recipe.steps || []).map((s, idx) => {
        const step = typeof s === 'string' ? { text: s, flame: null } : s;
        const flame = step.flame ? `<span class="flame-badge">${flameIcon[step.flame] || ''} ${step.flame} flame</span>` : '';
        return `
            <div class="step-item">
                <div class="step-num">${idx + 1}</div>
                <div class="step-content">
                    <p>${step.text}</p>
                    ${flame}
                    ${step.time ? `<span class="step-time">⏱ ${step.time}</span>` : ''}
                </div>
            </div>`;
    }).join('');
    
    const tipsHTML = (recipe.tips || []).map(t => `<li>💡 ${t}</li>`).join('');
    
    detail.innerHTML = `
        <div style="position:relative;">
            <button onclick="closeModal()" style="position:absolute;top:12px;right:12px;z-index:10;background:rgba(0,0,0,0.5);border:none;color:white;border-radius:50%;width:36px;height:36px;font-size:1.2rem;cursor:pointer;">✕</button>
            <img src="${imageUrl}" 
                 onerror="this.src='https://picsum.photos/seed/${encodeURIComponent(recipeName)}/600/400'"
                 style="width:100%;height:220px;object-fit:cover;border-radius:16px 16px 0 0;" 
                 alt="${recipeName}">
        </div>
        <div style="padding:20px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <span style="background:${recipe.type==='Vegetarian'?'#4CAF50':'#f44336'};color:white;padding:4px 12px;border-radius:20px;font-size:0.8rem;">
                    ${recipe.type === 'Vegetarian' ? '🥬 Veg' : '🍖 Non-Veg'}
                </span>
                <span style="background:#FF6D00;color:white;padding:4px 12px;border-radius:20px;font-size:0.8rem;">
                    📊 ${recipe.difficulty}
                </span>
                <span style="background:#1565C0;color:white;padding:4px 12px;border-radius:20px;font-size:0.8rem;">
                    📂 ${recipe.category}
                </span>
            </div>
            <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:6px;">${recipeName}</h2>
            <p style="color:#FF6D00;font-weight:600;margin-bottom:12px;">📍 ${recipe.stateName || recipe.state}</p>
            <div style="display:flex;gap:20px;background:#f5f5f5;border-radius:12px;padding:12px;margin-bottom:20px;">
                <div style="text-align:center;">⏱ <strong>${recipe.prepTime}</strong><br><small>Prep</small></div>
                <div style="text-align:center;">🍳 <strong>${recipe.cookTime}</strong><br><small>Cook</small></div>
                <div style="text-align:center;">👥 <strong>${recipe.servings || 2}</strong><br><small>Serves</small></div>
            </div>
            
            <h3 style="font-size:1.1rem;font-weight:700;color:#FF6D00;margin-bottom:10px;">🥘 Ingredients</h3>
            <ul style="padding-left:18px;margin-bottom:20px;line-height:2;">${ingredientsHTML}</ul>
            
            <h3 style="font-size:1.1rem;font-weight:700;color:#FF6D00;margin-bottom:10px;">👨‍🍳 Steps</h3>
            <div style="margin-bottom:20px;">
                <style>
                    .step-item{display:flex;gap:12px;margin-bottom:14px;}
                    .step-num{min-width:28px;height:28px;background:#FF6D00;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;}
                    .step-content p{margin:0 0 4px;}
                    .flame-badge{font-size:0.75rem;color:#666;}
                    .step-time{font-size:0.75rem;color:#999;}
                </style>
                ${stepsHTML || '<p style="color:#999;">No steps added yet.</p>'}
            </div>
            
            ${tipsHTML ? `
            <h3 style="font-size:1.1rem;font-weight:700;color:#FF6D00;margin-bottom:10px;">💡 Tips</h3>
            <ul style="padding-left:18px;margin-bottom:20px;line-height:2;">${tipsHTML}</ul>
            ` : ''}
            
            ${recipe.nutrition ? `
            <div style="background:linear-gradient(135deg,#FF6D00,#FF9800);color:white;border-radius:12px;padding:16px;">
                <h3 style="margin:0 0 10px;font-size:1rem;">🔬 Nutrition (per serving)</h3>
                <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:0.85rem;">
                    <span>🔥 ${recipe.nutrition.calories} kcal</span>
                    <span>💪 ${recipe.nutrition.protein} protein</span>
                    <span>🌾 ${recipe.nutrition.carbs} carbs</span>
                    <span>🧈 ${recipe.nutrition.fat} fat</span>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
}
