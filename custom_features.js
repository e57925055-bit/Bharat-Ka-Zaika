// Custom Features for Bharat Ka Zaika

// 1. Map Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Correct bottom nav clicks
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.dataset.target;
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
            if (target === 'home') document.getElementById('homeScreen').classList.remove('hidden');
            if (target === 'search') document.getElementById('searchScreen').classList.remove('hidden');
            if (target === 'fav') document.getElementById('favScreen').classList.remove('hidden');
            if (target === 'meal') document.getElementById('mealScreen').classList.remove('hidden');
            if (target === 'map') {
                document.getElementById('mapScreen').classList.remove('hidden');
                loadIndiaMap();
            }
        });
    });
});

let isMapLoaded = false;
async function loadIndiaMap() {
    if (isMapLoaded) return;
    try {
        const svgText = window.INDIA_MAP_SVG;
        document.getElementById('indiaMapContainer').innerHTML = svgText;
        
        // Add names and click events
        document.querySelectorAll('#indiaMapContainer path').forEach(path => {
            // Append name if desired
            const name = path.getAttribute('name');
            const stateId = path.getAttribute('id');
            
            // Just displaying the title as tooltip for now
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = name;
            path.appendChild(title);
            
            path.addEventListener('click', () => {
                showStateLanguagePrompt(name, stateId);
            });
        });
        isMapLoaded = true;
    } catch(e) {
        console.error("Map loading failed", e);
    }
}

// 2. Language Prompt
function showStateLanguagePrompt(stateName, stateId) {
    const regionalLangs = {
        'br':'hi', 'rj':'hi', 'mz':'en', 'nl':'en', 'mh':'mr', 'gj':'gu', 'pa':'pa', 'ta':'ta', 'kl':'ml',
        'kn':'kn', 'te':'te', 'wb':'bn', 'or':'or', 'as':'as', 'ap':'te' 
    };
    
    // Mapping SVG state id to recipe.js state name or ID
    const stateMap = {
        'ap': 'Andhra Pradesh', 'ar': 'Arunachal Pradesh', 'as': 'Assam', 'br': 'Bihar', 'ct': 'Chhattisgarh',
        'go': 'Goa', 'gj': 'Gujarat', 'hr': 'Haryana', 'hp': 'Himachal Pradesh', 'jh': 'Jharkhand',
        'ka': 'Karnataka', 'kl': 'Kerala', 'mp': 'Madhya Pradesh', 'mh': 'Maharashtra', 'mn': 'Manipur',
        'ml': 'Meghalaya', 'mz': 'Mizoram', 'nl': 'Nagaland', 'or': 'Odisha', 'pb': 'Punjab',
        'rj': 'Rajasthan', 'sk': 'Sikkim', 'tn': 'Tamil Nadu', 'te': 'Telangana', 'tr': 'Tripura',
        'up': 'Uttar Pradesh', 'ut': 'Uttarakhand', 'wb': 'West Bengal'
    };
    
    const regLangCode = regionalLangs[stateId] || 'hi';
    const customStateName = stateMap[stateId] || stateName;
    
    const overlay = document.createElement('div');
    overlay.className = 'map-lang-overlay';
    overlay.innerHTML = `
        <div class="map-lang-card">
            <h2 style="margin-bottom:10px;color:var(--primary)">${customStateName}</h2>
            <p style="margin-bottom:20px;">Choose your preferred language</p>
            <button class="lang-btn-map" onclick="continueToState('${customStateName}', 'hi', this.parentNode.parentNode)">Continue in Hindi</button>
            <button class="lang-btn-map" onclick="continueToState('${customStateName}', '${regLangCode}', this.parentNode.parentNode)">Continue in Regional Language</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function continueToState(stateName, langCode, overlayNode) {
    if(overlayNode) overlayNode.remove();
    localStorage.setItem('selectedLanguage', langCode);
    localStorage.setItem('selectedState', stateName);
    window.currentLang = langCode; // from app.js
    
    // Globally filter allRecipes to be ONLY from this state
    if(window.originalAllRecipes === undefined) window.originalAllRecipes = [...window.allRecipes];
    window.allRecipes = window.originalAllRecipes.filter(r => (r.stateName || r.state || '').toLowerCase() === stateName.toLowerCase());
    
    // Initialize standard app state
    if(window.initApp) window.initApp();
    
    // Switch to Home screen and filter by exactly this state
    document.querySelector('[data-target="home"]').click();
    
    // Render the grid with swipable cards
    renderRecipeGrid(window.allRecipes);
    const subtitle = document.getElementById('stateSubtitle');
    if(subtitle) subtitle.innerText = `Viewing authentic recipes from ${stateName}`;
    const bTitle = document.getElementById('bannerTitle');
    if(bTitle) bTitle.innerText = `📍 ${stateName} Recipes`;
}

// 3. Ad Simulation before recipe open
const originalOpenRecipeModal = window.openRecipeModal; // Backup
window.openRecipeModal = function(recipe) {
    showAdThenOpen(recipe);
};

function showAdThenOpen(recipe) {
    const adOverlay = document.createElement('div');
    adOverlay.className = 'ad-overlay';
    adOverlay.id = 'currentAdOverlay';
    adOverlay.innerHTML = `
        <button class="ad-skip-btn" id="skipAdBtn" style="display:none;" onclick="this.parentNode.remove(); performOpenRecipe('${recipe.name.replace(/'/g, "\\'")}')">Skip Ad ⏭</button>
        <video src="https://www.w3schools.com/html/mov_bbb.mp4" autoplay muted playsinline></video>
        <div style="margin-top:15px; font-weight:bold; font-size:1.2rem;">Ad will skip in <span id="adTimer">3</span>s</div>
    `;
    document.body.appendChild(adOverlay);
    
    let time = 3;
    const intv = setInterval(() => {
        time--;
        const tSpan = document.getElementById('adTimer');
        if(tSpan) tSpan.innerText = time;
        if(time <= 0) {
            clearInterval(intv);
            const btn = document.getElementById('skipAdBtn');
            if(btn) {
                btn.style.display = 'block';
                btn.innerText = 'Close Ad ✕';
                btn.click();
            }
        }
    }, 1000);
}

window.performOpenRecipe = function(recipeName) {
    const rec = allRecipes.find(r => r.name === recipeName);
    if(rec) {
        originalOpenRecipeModal(rec);
        addTelegramButton(rec); // Add Telegram button to the open modal
    }
}

// 4. Telegram Bot Integration
function addTelegramButton(recipe) {
    setTimeout(() => {
        const modalBody = document.querySelector('#recipeDetail .template-body') || document.querySelector('#recipeDetail > div:nth-child(2)');
        if(!modalBody) return;
        
        // Remove existing if any
        const existing = document.getElementById('tgBtnWrap');
        if(existing) existing.remove();
        
        const cleanName = recipe.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        
        const btnWrap = document.createElement('div');
        btnWrap.id = 'tgBtnWrap';
        btnWrap.style.margin = '20px 0';
        btnWrap.innerHTML = `
            <a href="https://t.me/Bharatkazaika_bot?start=${cleanName}" target="_blank" style="display:flex; align-items:center; justify-content:center; background:#0088cc; color:white; padding:12px 20px; border-radius:12px; text-decoration:none; font-weight:bold; font-size:1.1rem; gap:10px; box-shadow:0 4px 10px rgba(0,136,204,0.3);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                Send Recipe & Image to Telegram
            </a>
        `;
        modalBody.appendChild(btnWrap);
    }, 500);
}

// 5. Ad on Close Modal
const originalCloseModal = window.closeModal;
window.closeModal = function() {
    originalCloseModal();
    // Show quick ad
    const adOverlay = document.createElement('div');
    adOverlay.className = 'ad-overlay';
    adOverlay.innerHTML = `
        <button class="ad-skip-btn" onclick="this.parentNode.remove();">Close ✕</button>
        <h2>Advertisement</h2>
        <video src="https://www.w3schools.com/html/mov_bbb.mp4" autoplay muted playsinline style="max-height:300px; margin-top:20px;"></video>
        <p style="margin-top:20px;font-size:1.2rem;">Returning to ${window.currentLang} recipes...</p>
    `;
    document.body.appendChild(adOverlay);
    setTimeout(() => { if(adOverlay.parentNode) adOverlay.remove(); }, 3000);
};

// 6. Init State change UI hook
document.getElementById('stateBanner').addEventListener('click', () => {
    document.querySelector('[data-target="map"]').click();
});
