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
    collectAllRecipes();
    
    if (!localStorage.getItem('selectedLanguage')) {
        document.getElementById('loadingOverlay').classList.add('hidden');
        showLangSelection();
        setupMapLanguageSelection();
    } else {
        document.getElementById('loadingOverlay').classList.add('hidden');
        document.getElementById('langOverlay').classList.add('hidden');
        currentLang = localStorage.getItem('selectedLanguage');
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

// Recipe Modal
function openRecipeModal(recipe) {
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
    
    // Render nutrition
    const nutrition = recipe.nutrition || { calories: '250', protein: '10', carbs: '35', fat: '8', fiber: '3' };
    
    detail.innerHTML = `
        <div class="modal-header">
            <img src="${getRecipeImage(recipe)}" alt="${getRecipeName(recipe)}"
                 onerror="this.src='https://picsum.photos/400/300'">
            <div class="modal-header-overlay">
                <h2>${getRecipeName(recipe)}</h2>
                <p>${recipe.stateEmoji} ${recipe.stateName}</p>
            </div>
            <button class="modal-fav" onclick="toggleFavorite(event, '${recipe.name.replace(/'/g, "\\'")}')">
                ${isFav ? '❤️' : '🤍'}
            </button>
        </div>
        <div class="modal-body">
            <div class="modal-info">
                <div class="modal-info-chip">⏱️ ${recipe.prepTime || recipe.time}</div>
                <div class="modal-info-chip">🔥 ${recipe.cookTime || '30 mins'}</div>
                <div class="modal-info-chip">📊 ${recipe.difficulty}</div>
                <div class="modal-info-chip">${recipe.type === 'Vegetarian' ? '🥬' : '🍖'} ${recipe.type}</div>
            </div>
            
            <!-- Cooking Timeline -->
            <div class="cooking-timeline">
                <div class="timeline-item">
                    <div class="timeline-label">Prep Time</div>
                    <div class="timeline-bar">
                        <div class="timeline-fill" style="width: ${getTimeWidth(recipe.prepTime || recipe.time)}"></div>
                    </div>
                    <div class="timeline-value">${recipe.prepTime || recipe.time}</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-label">Cook Time</div>
                    <div class="timeline-bar">
                        <div class="timeline-fill cook" style="width: ${getTimeWidth(recipe.cookTime || '30 mins')}"></div>
                    </div>
                    <div class="timeline-value">${recipe.cookTime || '30 mins'}</div>
                </div>
            </div>
            
            <div class="modal-tabs">
                <button class="modal-tab active" data-tab="ingredients">🥗 Ingredients</button>
                <button class="modal-tab" data-tab="steps">👨‍🍳 Steps</button>
                <button class="modal-tab" data-tab="tips">💡 Tips</button>
                <button class="modal-tab" data-tab="nutrition">📊 Nutrition</button>
            </div>
            
            <div class="modal-tab-content active" id="ingredients-tab">
                ${recipe.ingredients.map((ing, i) => `
                    <div class="ingredient-item">
                        <div class="ingredient-checkbox" onclick="this.classList.toggle('checked')">✓</div>
                        <span>${typeof ing === 'string' ? ing : ing.text || ing}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="modal-tab-content" id="steps-tab">
                ${renderSteps(recipe.steps || [])}
            </div>
            
            <div class="modal-tab-content" id="tips-tab">
                ${renderTips(recipe.tips || [])}
            </div>
            
            <div class="modal-tab-content" id="nutrition-tab">
                <div class="nutrition-header">Per Serving</div>
                <div class="nutrition-grid">
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.calories || '250'}</div>
                        <div class="nutrition-label">Calories</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.protein || '10'}g</div>
                        <div class="nutrition-label">Protein</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.carbs || '35'}g</div>
                        <div class="nutrition-label">Carbs</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.fat || '8'}g</div>
                        <div class="nutrition-label">Fat</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.fiber || '3'}g</div>
                        <div class="nutrition-label">Fiber</div>
                    </div>
                </div>
            </div>
            
            <button class="category-chip" style="margin-top: 20px; width: 100%; justify-content: center;" 
                    onclick="addToPlanner('${recipe.name.replace(/'/g, "\\'")}')">
                📅 Add to Meal Planner
            </button>
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
