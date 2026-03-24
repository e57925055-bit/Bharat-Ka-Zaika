
// ============================================
// BHARAT KA ZAIKA - Professional Telegram Bot
// With Sarvam AI Auto Recipe Generation
// ============================================

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const FormData = require('form-data');
const axios = require('axios');

// ─── Config ───
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;
const CONVEX_URL = process.env.CONVEX_URL || 'https://kindred-cobra-143.convex.cloud';
const SARVAM_KEY = process.env.SARVAM_API_KEY;

// ─── Init Bot ───
if (!BOT_TOKEN) { console.error('❌ TELEGRAM_BOT_TOKEN missing!'); process.exit(1); }
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ─── User State Store ───
const userStates = new Map();

// ─── States ───
const STATES = [
  {id:'andhra-pradesh',name:'Andhra Pradesh',emoji:'🏛️',lang:'Telugu',langCode:'te'},
  {id:'arunachal-pradesh',name:'Arunachal Pradesh',emoji:'⛰️',lang:'English',langCode:'en'},
  {id:'assam',name:'Assam',emoji:'🐘',lang:'Assamese',langCode:'as'},
  {id:'bihar',name:'Bihar',emoji:'🪷',lang:'Maithili',langCode:'mai'},
  {id:'chhattisgarh',name:'Chhattisgarh',emoji:'🌲',lang:'Hindi',langCode:'hi'},
  {id:'delhi',name:'Delhi',emoji:'🏛️',lang:'Hindi',langCode:'hi'},
  {id:'goa',name:'Goa',emoji:'🏖️',lang:'Konkani',langCode:'kok'},
  {id:'gujarat',name:'Gujarat',emoji:'🪔',lang:'Gujarati',langCode:'gu'},
  {id:'haryana',name:'Haryana',emoji:'🌾',lang:'Hindi',langCode:'hi'},
  {id:'himachal-pradesh',name:'Himachal Pradesh',emoji:'🏔️',lang:'Hindi',langCode:'hi'},
  {id:'jammu-kashmir',name:'Jammu & Kashmir',emoji:'🏔️',lang:'Kashmiri',langCode:'ks'},
  {id:'jharkhand',name:'Jharkhand',emoji:'🌳',lang:'Hindi',langCode:'hi'},
  {id:'karnataka',name:'Karnataka',emoji:'🗿',lang:'Kannada',langCode:'kn'},
  {id:'kerala',name:'Kerala',emoji:'🥥',lang:'Malayalam',langCode:'ml'},
  {id:'madhya-pradesh',name:'Madhya Pradesh',emoji:'🦚',lang:'Hindi',langCode:'hi'},
  {id:'maharashtra',name:'Maharashtra',emoji:'🏰',lang:'Marathi',langCode:'mr'},
  {id:'manipur',name:'Manipur',emoji:'🌾',lang:'Meitei',langCode:'mni'},
  {id:'meghalaya',name:'Meghalaya',emoji:'⛰️',lang:'English',langCode:'en'},
  {id:'mizoram',name:'Mizoram',emoji:'🌿',lang:'Mizo',langCode:'en'},
  {id:'nagaland',name:'Nagaland',emoji:'🔥',lang:'English',langCode:'en'},
  {id:'odisha',name:'Odisha',emoji:'🏛️',lang:'Odia',langCode:'or'},
  {id:'punjab',name:'Punjab',emoji:'🌾',lang:'Punjabi',langCode:'pa'},
  {id:'rajasthan',name:'Rajasthan',emoji:'🏰',lang:'Hindi',langCode:'hi'},
  {id:'sikkim',name:'Sikkim',emoji:'🏔️',lang:'Nepali',langCode:'en'},
  {id:'tamil-nadu',name:'Tamil Nadu',emoji:'🛕',lang:'Tamil',langCode:'ta'},
  {id:'telangana',name:'Telangana',emoji:'🏯',lang:'Telugu',langCode:'te'},
  {id:'tripura',name:'Tripura',emoji:'⛰️',lang:'Bengali',langCode:'bn'},
  {id:'uttar-pradesh',name:'Uttar Pradesh',emoji:'🕌',lang:'Hindi',langCode:'hi'},
  {id:'uttarakhand',name:'Uttarakhand',emoji:'🏔️',lang:'Hindi',langCode:'hi'},
  {id:'west-bengal',name:'West Bengal',emoji:'🐯',lang:'Bengali',langCode:'bn'}
];

const CATEGORIES = ['breakfast','lunch','dinner','snacks','sweets'];

// ─── Sarvam AI Recipe Generator ───
async function generateWithSarvam(recipeName, recipeState, recipeCategory) {
  if (!SARVAM_KEY) return null;
  try {
    const res = await axios.post(
      'https://api.sarvam.ai/v1/chat/completions',
      {
        model: 'saaras-v1',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Indian chef. Respond ONLY with valid JSON. No extra text. No backticks. No markdown.'
          },
          {
            role: 'user',
            content: `Create complete authentic Indian recipe for "${recipeName}" from ${recipeState} state, category: ${recipeCategory}.
Return ONLY this JSON structure:
{
  "name_english": "",
  "name_hindi": "",
  "name_hinglish": "",
  "name_bengali": "",
  "name_tamil": "",
  "name_telugu": "",
  "name_marathi": "",
  "name_gujarati": "",
  "name_punjabi": "",
  "name_malayalam": "",
  "name_kannada": "",
  "state": "${recipeState}",
  "region": "North",
  "category": "${recipeCategory}",
  "type": "veg",
  "cook_time": 30,
  "prep_time": 15,
  "difficulty": "Easy",
  "servings": 4,
  "calories": 300,
  "ingredients_english": ["2 cups flour", "1 tsp salt"],
  "ingredients_hindi": ["2 कप आटा", "1 छोटा चम्मच नमक"],
  "steps_english": [
    {"step": 1, "description": "Step detail here", "flame": "medium", "time": "5 min"}
  ],
  "steps_hindi": [
    {"step": 1, "description": "स्टेप विवरण", "flame": "medium", "time": "5 min"}
  ],
  "chef_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "serve_with": "Curd, Pickle",
  "nutrition": {
    "calories": 300,
    "protein": "8g",
    "carbs": "40g",
    "fat": "10g",
    "fiber": "4g"
  }
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_KEY
        }
      }
    );

    let text = res.data.choices[0].message.content;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }
    return null;
  } catch(e) {
    console.error('Sarvam error:', e.message);
    return null;
  }
}

// ─── Convex API ───
async function saveToConvex(recipe) {
  try {
    const response = await axios.post(
      `${CONVEX_URL}/api/mutation`,
      { path: 'recipes:addRecipe', args: { recipe } },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (err) {
    console.error('Convex save error:', err.message);
    throw err;
  }
}

async function getFromConvex() {
  try {
    const response = await axios.post(
      `${CONVEX_URL}/api/query`,
      { path: 'recipes:getAllRecipes', args: {} },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.value || [];
  } catch (err) {
    console.error('Convex get error:', err.message);
    return [];
  }
}

// ─── /start ───
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'Dost';
  bot.sendMessage(chatId,
    `━━━━━━━━━━━━━━━━━━\n🍛 *BHARAT KA ZAIKA*\n_India ka #1 Recipe App_\n━━━━━━━━━━━━━━━━━━\n\nNameste ${name}! 🙏\n\n*29 States • 1000+ Recipes*\n*22 Languages • AI Powered* 🤖\n\nApni state ki authentic family recipe\nshare karo poori duniya ke saath!\n\n_Abhi kya karna chahte ho?_`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🤖 AI Se Recipe Add Karo', callback_data: 'add_ai' }],
          [{ text: '📝 Manual Recipe Add Karo', callback_data: 'add_manual' }],
          [{ text: '📚 Recipes Dekho', callback_data: 'view_recipes' }],
          [{ text: '❓ Help', callback_data: 'show_help' }]
        ]
      }
    });
});

// ─── /addrecipe ───
bot.onText(/\/addrecipe/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '🍽️ *Recipe Add Karo*\n\nKaunsa method use karna hai?',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🤖 AI Auto Generate', callback_data: 'add_ai' }],
          [{ text: '📝 Manual Add', callback_data: 'add_manual' }]
        ]
      }
    });
});

// ─── /viewrecipes ───
bot.onText(/\/viewrecipes/, (msg) => viewRecipes(msg.chat.id));

// ─── /help ───
bot.onText(/\/help/, (msg) => showHelp(msg.chat.id));

// ─── /cancel ───
bot.onText(/\/cancel/, (msg) => {
  userStates.delete(msg.chat.id);
  bot.sendMessage(msg.chat.id,
    '❌ *Cancel Ho Gaya!*\n\n/start se dobara shuru karo.',
    { parse_mode: 'Markdown' });
});

// ─── Help ───
function showHelp(chatId) {
  bot.sendMessage(chatId,
    `━━━━━━━━━━━━━━━━━━\n📚 *HELP GUIDE*\n━━━━━━━━━━━━━━━━━━\n\n🤖 *AI Mode (Recommended):*\n/addrecipe → AI Se Add\nBas recipe naam bhejo\nAI sab kuch generate kar dega!\n\n📝 *Manual Mode:*\n/addrecipe → Manual Add\nStep by step recipe bharo\n\n📋 *Commands:*\n/start — Home\n/addrecipe — Recipe add karo\n/viewrecipes — Recipes dekho\n/cancel — Cancel karo\n/help — Ye message\n\n💡 *Tips:*\n• Photo zaroor bhejo\n• Exact measurements likho\n• Flame level mention karo`,
    { parse_mode: 'Markdown' });
}

// ─── Callback Handler ───
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  // ─── Show Help ───
  if (data === 'show_help') {
    showHelp(chatId);
    return;
  }

  // ─── View Recipes ───
  if (data === 'view_recipes') {
    viewRecipes(chatId);
    return;
  }

  // ─── AI Mode ───
  if (data === 'add_ai') {
    userStates.set(chatId, { step: 'ai_input' });
    bot.sendMessage(chatId,
      `━━━━━━━━━━━━━━━━━━\n🤖 *AI RECIPE GENERATOR*\n━━━━━━━━━━━━━━━━━━\n\nBas itna bhejo:\n*Recipe Name, State, Category*\n\nExamples:\n• \`Dal Makhani, Punjab, Dinner\`\n• \`Dosa, Tamil Nadu, Breakfast\`\n• \`Vada Pav, Maharashtra, Snacks\`\n• \`Modak, Maharashtra, Sweets\`\n\n_AI baaki sab generate kar dega!_ ✨`,
      { parse_mode: 'Markdown' });
    return;
  }

  // ─── Manual Mode ───
  if (data === 'add_manual' || data === 'add_recipe') {
    startManualFlow(chatId);
    return;
  }

  // ─── State Selection ───
  if (data.startsWith('state_')) {
    const stateId = data.replace('state_', '');
    const stateObj = STATES.find(s => s.id === stateId);
    const state = userStates.get(chatId);
    if (state && state.step === 'state' && stateObj) {
      state.data.stateId = stateObj.id;
      state.data.stateName = stateObj.name;
      state.data.stateEmoji = stateObj.emoji;
      state.step = 'type';
      userStates.set(chatId, state);
      askType(chatId);
    }
    return;
  }

  // ─── Type Selection ───
  if (data === 'type_veg' || data === 'type_nonveg') {
    const state = userStates.get(chatId);
    if (state && state.step === 'type') {
      state.data.type = data === 'type_veg' ? 'Vegetarian' : 'Non-Vegetarian';
      state.step = 'category';
      userStates.set(chatId, state);
      askCategory(chatId);
    }
    return;
  }

  // ─── Category Selection ───
  if (data.startsWith('cat_')) {
    const cat = data.replace('cat_', '');
    const state = userStates.get(chatId);
    if (state && state.step === 'category') {
      state.data.category = cat;
      state.step = 'difficulty';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        '📊 *Difficulty kitni hai?*\n\nReply: `Easy`, `Medium`, ya `Hard`',
        { parse_mode: 'Markdown' });
    }
    return;
  }

  // ─── AI Confirm ───
  if (data === 'ai_confirm_yes') {
    const state = userStates.get(chatId);
    if (state && state.step === 'ai_confirm') {
      state.step = 'photo';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        `📸 *Food Ka Photo Bhejo!*\n\nPhoto app mein recipe ke saath dikhegi!\nUsers zyada pasand karte hain photo wali recipes! 😍\n\nSkip karne ke liye *skip* likho.`,
        { parse_mode: 'Markdown' });
    }
    return;
  }

  // ─── AI Reject - Switch to Manual ───
  if (data === 'ai_confirm_no') {
    userStates.delete(chatId);
    bot.sendMessage(chatId,
      '❌ Cancel ho gaya!\n\n/addrecipe se dobara try karo.',
      { parse_mode: 'Markdown' });
    return;
  }

  // ─── Manual Confirm ───
  if (data === 'confirm_yes') {
    const state = userStates.get(chatId);
    if (state && state.step === 'confirm') {
      await submitRecipe(chatId, state, query.from);
    }
    return;
  }

  if (data === 'confirm_no') {
    userStates.delete(chatId);
    bot.sendMessage(chatId,
      '❌ Cancel ho gaya!\n\n/addrecipe se dobara shuru karo.',
      { parse_mode: 'Markdown' });
    return;
  }
});

// ─── Message Handler ───
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  const photo = msg.photo;

  if (text.startsWith('/')) return;

  const state = userStates.get(chatId);
  if (!state) return;

  // ─── AI Input ───
  if (state.step === 'ai_input') {
    const parts = text.split(',').map(p => p.trim());
    const recipeName = parts[0] || text;
    const recipeState = parts[1] || 'India';
    const recipeCategory = (parts[2] || 'dinner').toLowerCase();

    bot.sendMessage(chatId,
      `⏳ *AI Recipe Generate Ho Rahi Hai...*\n\n🍛 *${recipeName}*\n📍 ${recipeState} | 🍽️ ${recipeCategory}\n\nThoda wait karo... 🤖`,
      { parse_mode: 'Markdown' });

    const recipe = await generateWithSarvam(recipeName, recipeState, recipeCategory);

    if (recipe) {
      userStates.set(chatId, { step: 'ai_confirm', data: recipe });
      bot.sendMessage(chatId,
        `━━━━━━━━━━━━━━━━━━\n✅ *RECIPE READY!*\n━━━━━━━━━━━━━━━━━━\n\n📛 *${recipe.name_english}*\n📍 ${recipe.state} | 🍽️ ${recipe.category}\n⏱️ Prep: ${recipe.prep_time} min | Cook: ${recipe.cook_time} min\n👥 Serves: ${recipe.servings} | 🔥 ${recipe.difficulty}\n🥗 ${recipe.calories} calories\n\n🥘 *Ingredients:* ${recipe.ingredients_english?.length || 0} items\n👨‍🍳 *Steps:* ${recipe.steps_english?.length || 0} steps\n💡 *Tips:* ${recipe.chef_tips?.length || 0} tips\n🍽️ *Serve With:* ${recipe.serve_with || 'N/A'}\n\n_Sahi hai? Photo add karke save karo!_`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '✅ Haan! Photo Bhejo', callback_data: 'ai_confirm_yes' }],
              [{ text: '❌ Cancel', callback_data: 'ai_confirm_no' }]
            ]
          }
        });
    } else {
      // Sarvam failed - switch to manual
      userStates.set(chatId, { step: 'name', data: {} });
      bot.sendMessage(chatId,
        `⚠️ *AI abhi busy hai!*\n\nManual mode mein switch ho rahe hain.\n\n📝 *Recipe ka naam kya hai?*`,
        { parse_mode: 'Markdown' });
    }
    return;
  }

  // ─── Photo Step (AI Mode) ───
  if (state.step === 'photo' && state.data && !state.data.name) {
    if (photo) {
      await handlePhotoAI(chatId, msg, state);
    } else if (text.toLowerCase() === 'skip') {
      state.data.imageUrl = '';
      await saveAIRecipe(chatId, state, msg.from);
    }
    return;
  }

  // ─── Photo Step (Manual Mode) ───
  if (photo && state.step === 'photo') {
    await handlePhoto(chatId, msg, state);
    return;
  }

  if (state.step === 'photo' && text.toLowerCase() === 'skip') {
    state.data.imageUrl = '';
    state.step = 'confirm';
    userStates.set(chatId, state);
    return showConfirmation(chatId, state.data);
  }

  // ─── Manual Flow Steps ───
  switch (state.step) {
    case 'name':
      if (!text || text.length < 2) {
        return bot.sendMessage(chatId, '❌ Naam kam se kam 2 characters ka hona chahiye!');
      }
      state.data.name = text;
      state.step = 'state';
      userStates.set(chatId, state);
      askState(chatId);
      break;

    case 'difficulty': {
      const dMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
      const diff = dMap[text.toLowerCase()];
      if (!diff) return bot.sendMessage(chatId, '❌ Easy, Medium ya Hard likho.');
      state.data.difficulty = diff;
      state.data.ingredients = [];
      state.step = 'ingredients';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        `✅ Difficulty: *${diff}*\n\n🥘 *Ingredients*\n\nEk ek line mein likho:\n\`2 cup basmati rice\`\n\`1 tbsp ghee\`\n\nSab ek saath bhi paste kar sakte ho!\nKhatam hone par *done* likho.`,
        { parse_mode: 'Markdown' });
      break;
    }

    case 'ingredients': {
      const lines = text.split('\n').map(l => l.trim()).filter(l => l && l.toLowerCase() !== 'done');
      const isDone = text.toLowerCase().includes('done');
      state.data.ingredients.push(...lines);
      if (isDone || lines.length > 2) {
        if (state.data.ingredients.length < 1) return bot.sendMessage(chatId, '❌ Kam se kam 1 ingredient chahiye!');
        state.step = 'steps';
        state.data.steps = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ *${state.data.ingredients.length} ingredients add ho gaye!*\n\n👨‍🍳 *Cooking Steps*\n\nHar step mein flame level mention karo:\n\`Ghee garam karo high flame pe\`\n\`Pyaz bhuno medium flame pe\`\n\nSab ek saath paste kar sakte ho!\n*done* likhkar khatam karo.`,
          { parse_mode: 'Markdown' });
      } else {
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ ${lines.length} ingredient(s) add. Total: *${state.data.ingredients.length}*\n\nAur add karo ya *done* likho.`, { parse_mode: 'Markdown' });
      }
      break;
    }

    case 'steps': {
      const lines = text.split('\n').map(l => l.trim()).filter(l => l && l.toLowerCase() !== 'done');
      const isDone = text.toLowerCase().includes('done');
      lines.forEach(s => {
        let flame = 'medium';
        if (/high flame|🔴/i.test(s)) flame = 'high';
        else if (/medium flame|🟡/i.test(s)) flame = 'medium';
        else if (/low flame|🟢/i.test(s)) flame = 'low';
        else if (/simmer|⚫/i.test(s)) flame = 'simmer';
        else if (/no flame/i.test(s)) flame = 'none';
        const cleanText = s.replace(/^\d+[\.\)]\s*/, '');
        state.data.steps.push({ text: cleanText, flame });
      });
      if (isDone || lines.length > 2) {
        if (state.data.steps.length < 1) return bot.sendMessage(chatId, '❌ Kam se kam 1 step chahiye!');
        state.step = 'tips';
        state.data.tips = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ *${state.data.steps.length} steps add ho gaye!*\n\n💡 *Chef Tips* (Optional)\n\nKoi special tips hai?\nEk ek tip bhejo ya *done/skip* likhkar aage badho.`,
          { parse_mode: 'Markdown' });
      } else {
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ ${lines.length} step(s). Total: *${state.data.steps.length}*\n\nAur add karo ya *done* likho.`, { parse_mode: 'Markdown' });
      }
      break;
    }

    case 'tips':
      if (text.toLowerCase() === 'done' || text.toLowerCase() === 'skip') {
        state.step = 'preptime';
        userStates.set(chatId, state);
        bot.sendMessage(chatId, '⏱️ *Prep Time kitna hai?*\n\nExample: `15 mins`, `30 mins`', { parse_mode: 'Markdown' });
      } else {
        state.data.tips.push(text);
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ Tip add! (${state.data.tips.length})\nAur bhejo ya *done* likho.`, { parse_mode: 'Markdown' });
      }
      break;

    case 'preptime':
      state.data.prepTime = text;
      state.step = 'cooktime';
      userStates.set(chatId, state);
      bot.sendMessage(chatId, '🍳 *Cook Time kitna hai?*\n\nExample: `30 mins`, `1 hour`', { parse_mode: 'Markdown' });
      break;

    case 'cooktime':
      state.data.cookTime = text;
      state.step = 'servings';
      userStates.set(chatId, state);
      bot.sendMessage(chatId, '👥 *Kitne logon ke liye hai?*\n\nExample: `2`, `4`, `6`', { parse_mode: 'Markdown' });
      break;

    case 'servings':
      state.data.servings = parseInt(text) || 4;
      state.step = 'photo';
      userStates.set(chatId, state);
      bot.sendMessage(chatId, `📸 *Food Ka Photo Bhejo!*\n\nPhoto app mein dikhegi!\nSkip karne ke liye *skip* likho.`, { parse_mode: 'Markdown' });
      break;
  }
});

// ─── Manual Flow Starter ───
function startManualFlow(chatId) {
  userStates.set(chatId, { step: 'name', data: { tips: [], ingredients: [], steps: [] } });
  bot.sendMessage(chatId,
    `📝 *Recipe ka naam kya hai?*\n\nExample: *Dal Makhani*, *Aloo Paratha*, *Gulab Jamun*`,
    { parse_mode: 'Markdown' });
}

function askState(chatId) {
  const rows = [];
  for (let i = 0; i < STATES.length; i += 2) {
    const row = [{ text: `${STATES[i].emoji} ${STATES[i].name}`, callback_data: `state_${STATES[i].id}` }];
    if (STATES[i + 1]) row.push({ text: `${STATES[i + 1].emoji} ${STATES[i + 1].name}`, callback_data: `state_${STATES[i + 1].id}` });
    rows.push(row);
  }
  bot.sendMessage(chatId, '📍 *Kaun se State ki recipe hai?*', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
}

function askType(chatId) {
  bot.sendMessage(chatId, '🍽️ *Veg hai ya Non-Veg?*', {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [[{ text: '🟢 Vegetarian', callback_data: 'type_veg' }], [{ text: '🔴 Non-Vegetarian', callback_data: 'type_nonveg' }]] }
  });
}

function askCategory(chatId) {
  const catEmoji = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍿', sweets: '🍮' };
  bot.sendMessage(chatId, '📂 *Kaunsi Category hai?*', {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: CATEGORIES.map(c => [{ text: `${catEmoji[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`, callback_data: `cat_${c}` }]) }
  });
}

// ─── Photo Upload (Manual) ───
async function handlePhoto(chatId, msg, state) {
  try {
    bot.sendMessage(chatId, '📤 Photo upload ho rahi hai...');
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileLink = await bot.getFileLink(fileId);
    const res = await axios({ method: 'GET', url: fileLink, responseType: 'stream' });
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', res.data, 'recipe.jpg');
    const uploadRes = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
    state.data.imageUrl = uploadRes.data;
    bot.sendMessage(chatId, '✅ Photo upload ho gayi!');
  } catch (err) {
    console.error('Photo error:', err.message);
    state.data.imageUrl = '';
    bot.sendMessage(chatId, '⚠️ Photo upload nahi hua. Bina photo ke save hogi.');
  }
  state.step = 'confirm';
  userStates.set(chatId, state);
  showConfirmation(chatId, state.data);
}

// ─── Photo Upload (AI Mode) ───
async function handlePhotoAI(chatId, msg, state) {
  let imageUrl = '';
  try {
    bot.sendMessage(chatId, '📤 Photo upload ho rahi hai...');
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileLink = await bot.getFileLink(fileId);
    const res = await axios({ method: 'GET', url: fileLink, responseType: 'stream' });
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', res.data, 'recipe.jpg');
    const uploadRes = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
    imageUrl = uploadRes.data;
    bot.sendMessage(chatId, '✅ Photo upload ho gayi!');
  } catch (err) {
    bot.sendMessage(chatId, '⚠️ Photo upload nahi hua.');
  }
  state.data.imageUrl = imageUrl;
  await saveAIRecipe(chatId, state, msg.from);
}

// ─── Save AI Recipe ───
async function saveAIRecipe(chatId, state, from) {
  const d = state.data;
  try {
    const recipe = {
      name: d.name_english || d.name,
      name_english: d.name_english || d.name,
      name_hindi: d.name_hindi || d.name_english,
      name_hinglish: d.name_hinglish || d.name_english,
      name_bengali: d.name_bengali || d.name_english,
      name_tamil: d.name_tamil || d.name_english,
      name_telugu: d.name_telugu || d.name_english,
      name_marathi: d.name_marathi || d.name_english,
      name_gujarati: d.name_gujarati || d.name_english,
      name_punjabi: d.name_punjabi || d.name_english,
      name_malayalam: d.name_malayalam || d.name_english,
      name_kannada: d.name_kannada || d.name_english,
      stateId: d.state?.toLowerCase().replace(/ /g, '-'),
      stateName: d.state,
      stateEmoji: '🏛️',
      region: d.region || 'India',
      type: d.type || 'Vegetarian',
      category: d.category,
      prepTime: `${d.prep_time} mins`,
      cookTime: `${d.cook_time} mins`,
      servings: d.servings || 4,
      difficulty: d.difficulty || 'Medium',
      emoji: '🍛',
      ingredients: d.ingredients_english || [],
      ingredients_english: d.ingredients_english || [],
      ingredients_hindi: d.ingredients_hindi || [],
      steps: d.steps_english || [],
      steps_english: d.steps_english || [],
      steps_hindi: d.steps_hindi || [],
      tips: d.chef_tips || [],
      imageUrl: d.imageUrl || '',
      serve_with: d.serve_with || '',
      nutrition: d.nutrition || { calories: d.calories || 300 },
      createdBy: from?.first_name || 'User',
      createdAt: new Date().toISOString()
    };

    bot.sendMessage(chatId, '📤 *Convex Database mein save ho rahi hai...*', { parse_mode: 'Markdown' });
    await saveToConvex(recipe);
    userStates.delete(chatId);

    bot.sendMessage(chatId,
      `━━━━━━━━━━━━━━━━━━\n🎉 *RECIPE LIVE HO GAYI!*\n━━━━━━━━━━━━━━━━━━\n\n*${recipe.name}*\n📍 ${recipe.stateName}\n\n✅ App mein available hai!\n🌐 Multiple languages mein\n${recipe.imageUrl ? '📸 Photo ke saath!' : ''}\n\n*Shukriya apna recipe share karne ke liye!* 🙏`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🤖 Aur Recipe Add Karo', callback_data: 'add_ai' }],
            [{ text: '📚 Recipes Dekho', callback_data: 'view_recipes' }]
          ]
        }
      });

    if (ADMIN_ID && String(chatId) !== ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 *Naya AI Recipe!*\n*${recipe.name}*\nBy: ${recipe.createdBy}\nState: ${recipe.stateName}\nPhoto: ${recipe.imageUrl ? '✅' : '❌'}`,
        { parse_mode: 'Markdown' }).catch(() => {});
    }
  } catch (err) {
    console.error('Save error:', err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}\n\nPhir try karo.`);
  }
}

// ─── Confirmation (Manual) ───
function showConfirmation(chatId, data) {
  bot.sendMessage(chatId,
    `━━━━━━━━━━━━━━━━━━\n📋 *RECIPE PREVIEW*\n━━━━━━━━━━━━━━━━━━\n\n📛 *${data.name}*\n📍 ${data.stateEmoji || '📍'} ${data.stateName}\n🍽️ ${data.type} | ${data.category}\n⏱️ Prep: ${data.prepTime || 'N/A'} | Cook: ${data.cookTime || 'N/A'}\n👥 Serves: ${data.servings || 4} | 🔥 ${data.difficulty}\n\n🥘 Ingredients: *${data.ingredients.length}*\n👨‍🍳 Steps: *${data.steps.length}*\n💡 Tips: *${data.tips.length}*\n📸 Photo: *${data.imageUrl ? '✅ Hai' : '❌ Nahi'}*\n\n_Sahi hai? App mein add karo!_`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Haan Add Karo!', callback_data: 'confirm_yes' }],
          [{ text: '❌ Cancel', callback_data: 'confirm_no' }]
        ]
      }
    });
}

// ─── Submit Recipe (Manual) ───
async function submitRecipe(chatId, state, from) {
  const d = state.data;
  try {
    const recipe = {
      name: d.name,
      name_english: d.name,
      name_hindi: d.name,
      stateId: d.stateId,
      stateName: d.stateName,
      stateEmoji: d.stateEmoji || '🏛️',
      region: 'India',
      type: d.type,
      category: d.category,
      prepTime: d.prepTime || '20 mins',
      cookTime: d.cookTime || '30 mins',
      servings: d.servings || 4,
      difficulty: d.difficulty || 'Medium',
      emoji: '🍛',
      ingredients: d.ingredients,
      ingredients_english: d.ingredients,
      steps: d.steps,
      steps_english: d.steps,
      tips: d.tips || [],
      imageUrl: d.imageUrl || '',
      nutrition: { calories: 300, protein: '10g', carbs: '35g', fat: '12g', fiber: '4g' },
      createdBy: from.first_name || 'User',
      createdAt: new Date().toISOString()
    };

    bot.sendMessage(chatId, '📤 *Convex Database mein save ho rahi hai...*', { parse_mode: 'Markdown' });
    await saveToConvex(recipe);
    userStates.delete(chatId);

    bot.sendMessage(chatId,
      `━━━━━━━━━━━━━━━━━━\n🎉 *RECIPE LIVE HO GAYI!*\n━━━━━━━━━━━━━━━━━━\n\n*${recipe.name}* — ${recipe.stateEmoji} ${recipe.stateName}\n\nApp mein dekhne ke liye State select karo! ✅\n${recipe.imageUrl ? '📸 Photo ke saath!' : ''}\n\n*Thanks!* 🙏`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '➕ Aur Recipe Add Karo', callback_data: 'add_ai' }],
            [{ text: '📚 Recipes Dekho', callback_data: 'view_recipes' }]
          ]
        }
      });

    if (ADMIN_ID && String(chatId) !== ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 *Naya Recipe!*\n*${recipe.name}*\nBy: ${recipe.createdBy}\nState: ${recipe.stateName}`,
        { parse_mode: 'Markdown' }).catch(() => {});
    }
  } catch (err) {
    console.error('Submit error:', err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}\n\nPhir try karo.`);
  }
}

// ─── View Recipes ───
async function viewRecipes(chatId) {
  try {
    bot.sendMessage(chatId, '⏳ *Recipes load ho rahi hain...*', { parse_mode: 'Markdown' });
    const recipes = await getFromConvex();
    if (!recipes.length) {
      return bot.sendMessage(chatId,
        '📭 *Abhi koi recipe nahi hai!*\n\n/addrecipe se pehli recipe add karo! 🍛',
        { parse_mode: 'Markdown' });
    }
    const lines = recipes.slice(0, 10).map((r, i) =>
      `${i + 1}. *${r.name || r.name_english}* — ${r.stateEmoji || '📍'} ${r.stateName || r.state}\n   ${r.type || 'Veg'} | ${r.category}`
    ).join('\n\n');
    bot.sendMessage(chatId,
      `━━━━━━━━━━━━━━━━━━\n📋 *RECIPES (${recipes.length} total)*\n━━━━━━━━━━━━━━━━━━\n\n${lines}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '➕ Recipe Add Karo', callback_data: 'add_ai' }]]
        }
      });
  } catch (err) {
    bot.sendMessage(chatId, '❌ Database connect nahi hua. Phir try karo.');
  }
}

// ─── Error Handling ───
bot.on('polling_error', (err) => console.error('Polling error:', err.code));
process.on('unhandledRejection', (err) => console.error('Unhandled:', err.message));

console.log('🤖 Bharat Ka Zaika Bot started!');
console.log('👑 Admin ID:', ADMIN_ID || 'Not set');
console.log('🔗 Convex URL:', CONVEX_URL);
console.log('🤖 Sarvam AI:', SARVAM_KEY ? '✅ Connected' : '❌ Not set');

