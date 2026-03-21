// ============================================
// INDIA SVG MAP - Interactive 3D Map
// Click sound + 3D hover + State labels
// ============================================

// Map state SVG IDs to our app state IDs
const SVG_TO_APP_ID = {
    'ap': 'andhra-pradesh',
    'ar': 'arunachal-pradesh',
    'as': 'assam',
    'br': 'bihar',
    'ct': 'chhattisgarh',
    'dl': 'delhi',
    'ga': 'goa',
    'gj': 'gujarat',
    'hr': 'haryana',
    'hp': 'himachal-pradesh',
    'jk': 'jammu-kashmir',
    'jh': 'jharkhand',
    'ka': 'karnataka',
    'kl': 'kerala',
    'mp': 'madhya-pradesh',
    'mh': 'maharashtra',
    'mn': 'manipur',
    'ml': 'meghalaya',
    'mz': 'mizoram',
    'nl': 'nagaland',
    'or': 'odisha',
    'pb': 'punjab',
    'rj': 'rajasthan',
    'sk': 'sikkim',
    'tn': 'tamil-nadu',
    'tg': 'telangana',
    'tr': 'tripura',
    'up': 'uttar-pradesh',
    'ut': 'uttarakhand',
    'wb': 'west-bengal'
};

// Skip these small UTs from the map (no recipes)
const SKIP_IDS = ['an','ch','dn','dd','ld','py'];

// State colors for the map (like the reference image)
const STATE_COLORS = {
    'jk':'#e06666','hp':'#93c47d','pb':'#f6b26b','ut':'#b6d7a8','hr':'#e6b8af',
    'rj':'#ffd966','up':'#ffe599','br':'#b4a7d6','sk':'#a4c2f4','ar':'#76a5af',
    'nl':'#e69138','mn':'#cc4125','mz':'#45818e','tr':'#f1c232','ml':'#6aa84f',
    'as':'#e6b8af','wb':'#f9cb9c','jh':'#b6d7a8','or':'#ea9999','ct':'#b6d7a8',
    'mp':'#d5a6bd','mh':'#a64d79','gj':'#ffd966','gj':'#93c47d','goa':'#ff6d00',
    'ga':'#ff6d00','ka':'#f1c232','kl':'#6aa84f','tn':'#e6b8af','ap':'#ea9999',
    'tg':'#b4a7d6','dl':'#76a5af','br':'#f9cb9c'
};

// Click sound using Web Audio API
function playClickSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}

function playHoverSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    } catch(e) {}
}

// Build the SVG India Map
async function buildIndiaMap(containerId, onStateClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Load map data
    let mapData;
    try {
        const res = await fetch('india_map_data.json');
        mapData = await res.json();
    } catch(e) {
        console.error('Failed to load india_map_data.json', e);
        container.innerHTML = '<p style="color:#fff;text-align:center;padding:40px;">Map load nahi ho saka</p>';
        return;
    }

    // Create SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', mapData.viewBox);
    svg.setAttribute('class', 'india-svg-map');
    svg.setAttribute('id', 'indiaSvgMap');

    // Defs for filters and gradients
    const defs = document.createElementNS(svgNS, 'defs');
    // 3D shadow filter
    defs.innerHTML = `
        <filter id="mapShadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
        <filter id="mapGlow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF6D00" flood-opacity="0.7"/>
        </filter>
    `;
    svg.appendChild(defs);

    // Add each state path
    mapData.locations.forEach(loc => {
        if (SKIP_IDS.includes(loc.id)) return;

        const g = document.createElementNS(svgNS, 'g');
        g.setAttribute('class', 'map-state-group');
        g.setAttribute('data-state-id', loc.id);

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', loc.path);
        path.setAttribute('class', 'map-state-path');
        path.setAttribute('id', 'state-' + loc.id);
        path.setAttribute('data-name', loc.name);
        
        // Set fill color
        const color = STATE_COLORS[loc.id] || '#ccc';
        path.style.fill = color;
        path.style.stroke = '#fff';
        path.style.strokeWidth = '1';
        path.style.cursor = 'pointer';

        // Hover effects
        path.addEventListener('mouseenter', () => {
            path.style.filter = 'url(#mapGlow)';
            path.style.transform = 'translateY(-2px)';
            path.style.strokeWidth = '2';
            path.style.stroke = '#FF6D00';
            playHoverSound();
            // Show tooltip
            showMapTooltip(loc.name, path);
        });

        path.addEventListener('mouseleave', () => {
            path.style.filter = '';
            path.style.transform = '';
            path.style.strokeWidth = '1';
            path.style.stroke = '#fff';
            hideMapTooltip();
        });

        // Click
        path.addEventListener('click', (e) => {
            e.preventDefault();
            playClickSound();

            // Flash animation
            path.style.transition = 'none';
            path.style.fill = '#FF6D00';
            setTimeout(() => {
                path.style.transition = 'fill 0.3s';
                path.style.fill = color;
            }, 200);

            const appId = SVG_TO_APP_ID[loc.id];
            if (appId && onStateClick) {
                onStateClick(appId, loc.name);
            }
        });

        g.appendChild(path);
        svg.appendChild(g);
    });

    container.innerHTML = '';
    container.appendChild(svg);

    // Add tooltip div
    const tooltip = document.createElement('div');
    tooltip.id = 'mapTooltip';
    tooltip.className = 'map-tooltip';
    container.appendChild(tooltip);
}

function showMapTooltip(name, pathEl) {
    const tooltip = document.getElementById('mapTooltip');
    if (!tooltip) return;
    tooltip.textContent = name;
    tooltip.classList.add('visible');
}

function hideMapTooltip() {
    const tooltip = document.getElementById('mapTooltip');
    if (tooltip) tooltip.classList.remove('visible');
}
