// ============================================
// BHARAT KA ZAIKA - Complete Telegram Bot
// ============================================

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const FormData = require('form-data');
const axios = require('axios');

// ─── Config ───
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;
const CONVEX_URL = process.env.CONVEX_URL || 'https://kindred-cobra-143.convex.cloud';

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

// ─── Convex API ───
async function saveToConvex(recipe) {
  try {
    const response = await axios.post(
      `${CONVEX_URL}/api/mutation`,
      {
        path: 'recipes:addRecipe',
        args: { recipe }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
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
      {
        path: 'recipes:getAllRecipes',
        args: {}
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
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
  bot.sendMessage(chatId, `
🍛 *Bharat Ka Zaika Bot*
नमस्ते ${name}! 🙏

Apni state ki authentic recipe add karo!
Image ke saath submit karo — app mein live ho jayegi!

*Commands:*
/addrecipe — Naya recipe add karo 📝
/viewrecipes — Recipes dekhein 👀
/help — Help 📚
/cancel — Cancel karo ❌
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ Recipe Add Karo', callback_data: 'add_recipe' }],
        [{ text: '👀 Recipes Dekhein', callback_data: 'view_recipes' }]
      ]
    }
  });
});

// ─── /addrecipe ───
bot.onText(/\/addrecipe/, (msg) => startFlow(msg.chat.id));

// ─── /viewrecipes ───
bot.onText(/\/viewrecipes/, (msg) => viewRecipes(msg.chat.id));

// ─── /help ───
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
📚 *Help Guide*

*Recipe kaise add karein:*
1️⃣ /addrecipe — start karo
2️⃣ Recipe ka naam likho
3️⃣ State select karo
4️⃣ Veg/Non-Veg select karo
5️⃣ Category select karo
6️⃣ Difficulty batao
7️⃣ Ingredients likho (done likhkar finish)
8️⃣ Steps likho (done likhkar finish)
9️⃣ Tips likho (optional)
🔟 Photo bhejo 📸
✅ Confirm karo — App mein live!
  `, { parse_mode: 'Markdown' });
});

// ─── /cancel ───
bot.onText(/\/cancel/, (msg) => {
  userStates.delete(msg.chat.id);
  bot.sendMessage(msg.chat.id, '❌ Cancel ho gaya.\n\n/addrecipe se naya start karo.');
});

// ─── Callback Handler ───
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  if (data === 'add_recipe') return startFlow(chatId);
  if (data === 'view_recipes') return viewRecipes(chatId);

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

  if (data === 'confirm_yes') {
    const state = userStates.get(chatId);
    if (state && state.step === 'confirm') {
      await submitRecipe(chatId, state, query.from);
    }
    return;
  }

  if (data === 'confirm_no') {
    userStates.delete(chatId);
    bot.sendMessage(chatId, '❌ Cancel ho gaya.\n\n/addrecipe se dobara start karo.');
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

    case 'difficulty':
      const dMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
      const diff = dMap[text.toLowerCase()];
      if (!diff) return bot.sendMessage(chatId, '❌ Easy, Medium ya Hard likho.');
      state.data.difficulty = diff;
      state.data.ingredients = [];
      state.step = 'ingredients';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        `✅ Difficulty: *${diff}*\n\n🥘 *Ingredients*\n\nEk ek line mein likho:\n\`2 cup basmati rice\`\n\`1 tbsp ghee\`\n\nSab likhkar *done* likho.`,
        { parse_mode: 'Markdown' });
      break;

    case 'ingredients': {
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l && l.toLowerCase() !== 'done');
      const isDone = text.toLowerCase().includes('done');
      state.data.ingredients.push(...lines);

      if (isDone || lines.length > 2) {
        if (state.data.ingredients.length < 1) {
          return bot.sendMessage(chatId, '❌ Kam se kam 1 ingredient chahiye!');
        }
        state.step = 'steps';
        state.data.steps = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${state.data.ingredients.length} ingredients!\n\n👨‍🍳 *Cooking Steps*\n\nFlame level mention karo:\n\`Heat ghee on high flame\`\n\`Add onions medium flame\`\n\nDone likhkar finish karo.`,
          { parse_mode: 'Markdown' });
      } else {
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${lines.length} ingredient(s) add. Total: ${state.data.ingredients.length}\n\nAur add karo ya *done* likho.`);
      }
      break;
    }

    case 'steps': {
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l && l.toLowerCase() !== 'done');
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
        if (state.data.steps.length < 1) {
          return bot.sendMessage(chatId, '❌ Kam se kam 1 step chahiye!');
        }
        state.step = 'tips';
        state.data.tips = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${state.data.steps.length} steps!\n\n💡 *Chef Tips* (Optional)\n\nTips likho ya *done* likhkar skip karo.`,
          { parse_mode: 'Markdown' });
      } else {
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${lines.length} step(s). Total: ${state.data.steps.length}\n\nAur add karo ya *done* likho.`);
      }
      break;
    }

    case 'tips':
      if (text.toLowerCase() === 'done' || text.toLowerCase() === 'skip') {
        state.step = 'preptime';
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          '⏱️ *Prep Time*\n\nExample: `15 mins`, `30 mins`',
          { parse_mode: 'Markdown' });
      } else {
        state.data.tips.push(text);
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ Tip add! (${state.data.tips.length})\nAur ya *done* likho.`);
      }
      break;

    case 'preptime':
      state.data.prepTime = text;
      state.step = 'cooktime';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        '🍳 *Cook Time*\n\nExample: `30 mins`, `1 hour`',
        { parse_mode: 'Markdown' });
      break;

    case 'cooktime':
      state.data.cookTime = text;
      state.step = 'servings';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        '👥 *Servings*\n\nExample: `2`, `4`, `6`',
        { parse_mode: 'Markdown' });
      break;

    case 'servings':
      state.data.servings = parseInt(text) || 4;
      state.step = 'photo';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        `📸 *Food Ka Photo Bhejo!*\n\nPhoto app mein dikhegi!\nAgar nahi hai to *skip* likho.`);
      break;
  }
});

// ─── Flow Starters ───
function startFlow(chatId) {
  userStates.set(chatId, {
    step: 'name',
    data: { tips: [], ingredients: [], steps: [] }
  });
  bot.sendMessage(chatId,
    `📝 *Recipe ka naam kya hai?*\n\nExample: *Dal Makhani*, *Aloo Paratha*`,
    { parse_mode: 'Markdown' });
}

function askState(chatId) {
  const rows = [];
  for (let i = 0; i < STATES.length; i += 2) {
    const row = [{
      text: `${STATES[i].emoji} ${STATES[i].name}`,
      callback_data: `state_${STATES[i].id}`
    }];
    if (STATES[i + 1]) {
      row.push({
        text: `${STATES[i + 1].emoji} ${STATES[i + 1].name}`,
        callback_data: `state_${STATES[i + 1].id}`
      });
    }
    rows.push(row);
  }
  bot.sendMessage(chatId, '📍 *Kaun se State ki recipe hai?*', {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: rows }
  });
}

function askType(chatId) {
  bot.sendMessage(chatId, '🍽️ *Veg hai ya Non-Veg?*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🟢 Vegetarian', callback_data: 'type_veg' }],
        [{ text: '🔴 Non-Vegetarian', callback_data: 'type_nonveg' }]
      ]
    }
  });
}

function askCategory(chatId) {
  const catEmoji = {
    breakfast: '🌅', lunch: '☀️',
    dinner: '🌙', snacks: '🍿', sweets: '🍮'
  };
  bot.sendMessage(chatId, '📂 *Kaunsi Category hai?*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: CATEGORIES.map(c => [{
        text: `${catEmoji[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`,
        callback_data: `cat_${c}`
      }])
    }
  });
}

// ─── Photo Upload ───
async function handlePhoto(chatId, msg, state) {
  try {
    bot.sendMessage(chatId, '📤 Photo upload ho rahi hai...');
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileLink = await bot.getFileLink(fileId);

    const res = await axios({
      method: 'GET',
      url: fileLink,
      responseType: 'stream'
    });

    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', res.data, 'recipe.jpg');

    const uploadRes = await axios.post(
      'https://catbox.moe/user/api.php',
      form,
      { headers: form.getHeaders() }
    );

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

// ─── Confirmation ───
function showConfirmation(chatId, data) {
  const preview = `
📋 *Recipe Preview*

*Naam:* ${data.name}
*State:* ${data.stateEmoji || '📍'} ${data.stateName}
*Type:* ${data.type}
*Category:* ${data.category}
*Prep:* ${data.prepTime || 'N/A'} | *Cook:* ${data.cookTime || 'N/A'}
*Servings:* ${data.servings || 4}
*Difficulty:* ${data.difficulty}

🥘 Ingredients: *${data.ingredients.length}*
👨‍🍳 Steps: *${data.steps.length}*
💡 Tips: *${data.tips.length}*
📸 Photo: *${data.imageUrl ? '✅ Hai' : '❌ Nahi'}*

_Sahi hai? Add karo!_
  `;
  bot.sendMessage(chatId, preview, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Haan Add Karo!', callback_data: 'confirm_yes' }],
        [{ text: '❌ Cancel', callback_data: 'confirm_no' }]
      ]
    }
  });
}

// ─── Submit Recipe ───
async function submitRecipe(chatId, state, from) {
  const d = state.data;
  try {
    const recipe = {
      name: d.name,
      names: { en: d.name, hi: d.name },
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
      steps: d.steps,
      tips: d.tips || [],
      imageUrl: d.imageUrl || '',
      nutrition: {
        calories: 300,
        protein: '10g',
        carbs: '35g',
        fat: '12g',
        fiber: '4g'
      },
      createdBy: from.first_name || 'User',
      createdAt: new Date().toISOString()
    };

    bot.sendMessage(chatId, '📤 Convex Database mein save ho rahi hai...');

    await saveToConvex(recipe);

    userStates.delete(chatId);

    bot.sendMessage(chatId, `
🎉 *Recipe Live Ho Gayi!*

*${recipe.name}* — ${recipe.stateEmoji} ${recipe.stateName}

App mein dekhne ke liye:
State *${recipe.stateName}* select karo ✅

${recipe.imageUrl ? '📸 Photo ke saath!' : '(Bina photo ke add hui)'}

Thanks! 🙏
    `, { parse_mode: 'Markdown' });

    if (ADMIN_ID && String(chatId) !== ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 *Naya Recipe!*\n*${recipe.name}*\nBy: ${recipe.createdBy}\nState: ${recipe.stateName}\nPhoto: ${recipe.imageUrl ? '✅' : '❌'}`,
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
    bot.sendMessage(chatId, '⏳ Recipes load ho rahi hain...');
    const recipes = await getFromConvex();
    if (!recipes.length) {
      return bot.sendMessage(chatId,
        '📭 Koi recipe nahi hai.\n\n/addrecipe se add karo!');
    }
    const lines = recipes.slice(0, 10).map((r, i) =>
      `${i + 1}. *${r.name}* — ${r.stateEmoji || '📍'} ${r.stateName}\n   ${r.type} | ${r.category}`
    ).join('\n\n');
    bot.sendMessage(chatId,
      `📋 *Recipes* (${recipes.length} total)\n\n${lines}`,
      { parse_mode: 'Markdown' });
  } catch (err) {
    bot.sendMessage(chatId, '❌ Database connect nahi hua.');
  }
}

// ─── Error Handling ───
bot.on('polling_error', (err) => console.error('Polling error:', err.code));
process.on('unhandledRejection', (err) => console.error('Unhandled:', err.message));

console.log('🤖 Bharat Ka Zaika Bot started!');
console.log('👑 Admin ID:', ADMIN_ID || 'Not set');
console.log('🔗 Convex URL:', CONVEX_URL);// ============================================
// BHARAT KA ZAIKA - Complete Telegram Bot
// ============================================

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const FormData = require('form-data');
const axios = require('axios');

// ─── Config ───
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;
const CONVEX_URL = process.env.CONVEX_URL || 'https://kindred-cobra-143.convex.cloud';

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

// ─── Convex API ───
async function saveToConvex(recipe) {
  try {
    const response = await axios.post(
      `${CONVEX_URL}/api/mutation`,
      {
        path: 'recipes:addRecipe',
        args: { recipe }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
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
      {
        path: 'recipes:getAllRecipes',
        args: {}
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
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
  bot.sendMessage(chatId, `
🍛 *Bharat Ka Zaika Bot*
नमस्ते ${name}! 🙏

Apni state ki authentic recipe add karo!
Image ke saath submit karo — app mein live ho jayegi!

*Commands:*
/addrecipe — Naya recipe add karo 📝
/viewrecipes — Recipes dekhein 👀
/help — Help 📚
/cancel — Cancel karo ❌
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ Recipe Add Karo', callback_data: 'add_recipe' }],
        [{ text: '👀 Recipes Dekhein', callback_data: 'view_recipes' }]
      ]
    }
  });
});

// ─── /addrecipe ───
bot.onText(/\/addrecipe/, (msg) => startFlow(msg.chat.id));

// ─── /viewrecipes ───
bot.onText(/\/viewrecipes/, (msg) => viewRecipes(msg.chat.id));

// ─── /help ───
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
📚 *Help Guide*

*Recipe kaise add karein:*
1️⃣ /addrecipe — start karo
2️⃣ Recipe ka naam likho
3️⃣ State select karo
4️⃣ Veg/Non-Veg select karo
5️⃣ Category select karo
6️⃣ Difficulty batao
7️⃣ Ingredients likho (done likhkar finish)
8️⃣ Steps likho (done likhkar finish)
9️⃣ Tips likho (optional)
🔟 Photo bhejo 📸
✅ Confirm karo — App mein live!
  `, { parse_mode: 'Markdown' });
});

// ─── /cancel ───
bot.onText(/\/cancel/, (msg) => {
  userStates.delete(msg.chat.id);
  bot.sendMessage(msg.chat.id, '❌ Cancel ho gaya.\n\n/addrecipe se naya start karo.');
});

// ─── Callback Handler ───
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  if (data === 'add_recipe') return startFlow(chatId);
  if (data === 'view_recipes') return viewRecipes(chatId);

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

  if (data === 'confirm_yes') {
    const state = userStates.get(chatId);
    if (state && state.step === 'confirm') {
      await submitRecipe(chatId, state, query.from);
    }
    return;
  }

  if (data === 'confirm_no') {
    userStates.delete(chatId);
    bot.sendMessage(chatId, '❌ Cancel ho gaya.\n\n/addrecipe se dobara start karo.');
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

    case 'difficulty':
      const dMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
      const diff = dMap[text.toLowerCase()];
      if (!diff) return bot.sendMessage(chatId, '❌ Easy, Medium ya Hard likho.');
      state.data.difficulty = diff;
      state.data.ingredients = [];
      state.step = 'ingredients';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        `✅ Difficulty: *${diff}*\n\n🥘 *Ingredients*\n\nEk ek line mein likho:\n\`2 cup basmati rice\`\n\`1 tbsp ghee\`\n\nSab likhkar *done* likho.`,
        { parse_mode: 'Markdown' });
      break;

    case 'ingredients': {
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l && l.toLowerCase() !== 'done');
      const isDone = text.toLowerCase().includes('done');
      state.data.ingredients.push(...lines);

      if (isDone || lines.length > 2) {
        if (state.data.ingredients.length < 1) {
          return bot.sendMessage(chatId, '❌ Kam se kam 1 ingredient chahiye!');
        }
        state.step = 'steps';
        state.data.steps = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${state.data.ingredients.length} ingredients!\n\n👨‍🍳 *Cooking Steps*\n\nFlame level mention karo:\n\`Heat ghee on high flame\`\n\`Add onions medium flame\`\n\nDone likhkar finish karo.`,
          { parse_mode: 'Markdown' });
      } else {
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${lines.length} ingredient(s) add. Total: ${state.data.ingredients.length}\n\nAur add karo ya *done* likho.`);
      }
      break;
    }

    case 'steps': {
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l && l.toLowerCase() !== 'done');
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
        if (state.data.steps.length < 1) {
          return bot.sendMessage(chatId, '❌ Kam se kam 1 step chahiye!');
        }
        state.step = 'tips';
        state.data.tips = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${state.data.steps.length} steps!\n\n💡 *Chef Tips* (Optional)\n\nTips likho ya *done* likhkar skip karo.`,
          { parse_mode: 'Markdown' });
      } else {
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          `✅ ${lines.length} step(s). Total: ${state.data.steps.length}\n\nAur add karo ya *done* likho.`);
      }
      break;
    }

    case 'tips':
      if (text.toLowerCase() === 'done' || text.toLowerCase() === 'skip') {
        state.step = 'preptime';
        userStates.set(chatId, state);
        bot.sendMessage(chatId,
          '⏱️ *Prep Time*\n\nExample: `15 mins`, `30 mins`',
          { parse_mode: 'Markdown' });
      } else {
        state.data.tips.push(text);
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ Tip add! (${state.data.tips.length})\nAur ya *done* likho.`);
      }
      break;

    case 'preptime':
      state.data.prepTime = text;
      state.step = 'cooktime';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        '🍳 *Cook Time*\n\nExample: `30 mins`, `1 hour`',
        { parse_mode: 'Markdown' });
      break;

    case 'cooktime':
      state.data.cookTime = text;
      state.step = 'servings';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        '👥 *Servings*\n\nExample: `2`, `4`, `6`',
        { parse_mode: 'Markdown' });
      break;

    case 'servings':
      state.data.servings = parseInt(text) || 4;
      state.step = 'photo';
      userStates.set(chatId, state);
      bot.sendMessage(chatId,
        `📸 *Food Ka Photo Bhejo!*\n\nPhoto app mein dikhegi!\nAgar nahi hai to *skip* likho.`);
      break;
  }
});

// ─── Flow Starters ───
function startFlow(chatId) {
  userStates.set(chatId, {
    step: 'name',
    data: { tips: [], ingredients: [], steps: [] }
  });
  bot.sendMessage(chatId,
    `📝 *Recipe ka naam kya hai?*\n\nExample: *Dal Makhani*, *Aloo Paratha*`,
    { parse_mode: 'Markdown' });
}

function askState(chatId) {
  const rows = [];
  for (let i = 0; i < STATES.length; i += 2) {
    const row = [{
      text: `${STATES[i].emoji} ${STATES[i].name}`,
      callback_data: `state_${STATES[i].id}`
    }];
    if (STATES[i + 1]) {
      row.push({
        text: `${STATES[i + 1].emoji} ${STATES[i + 1].name}`,
        callback_data: `state_${STATES[i + 1].id}`
      });
    }
    rows.push(row);
  }
  bot.sendMessage(chatId, '📍 *Kaun se State ki recipe hai?*', {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: rows }
  });
}

function askType(chatId) {
  bot.sendMessage(chatId, '🍽️ *Veg hai ya Non-Veg?*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🟢 Vegetarian', callback_data: 'type_veg' }],
        [{ text: '🔴 Non-Vegetarian', callback_data: 'type_nonveg' }]
      ]
    }
  });
}

function askCategory(chatId) {
  const catEmoji = {
    breakfast: '🌅', lunch: '☀️',
    dinner: '🌙', snacks: '🍿', sweets: '🍮'
  };
  bot.sendMessage(chatId, '📂 *Kaunsi Category hai?*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: CATEGORIES.map(c => [{
        text: `${catEmoji[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`,
        callback_data: `cat_${c}`
      }])
    }
  });
}

// ─── Photo Upload ───
async function handlePhoto(chatId, msg, state) {
  try {
    bot.sendMessage(chatId, '📤 Photo upload ho rahi hai...');
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileLink = await bot.getFileLink(fileId);

    const res = await axios({
      method: 'GET',
      url: fileLink,
      responseType: 'stream'
    });

    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', res.data, 'recipe.jpg');

    const uploadRes = await axios.post(
      'https://catbox.moe/user/api.php',
      form,
      { headers: form.getHeaders() }
    );

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

// ─── Confirmation ───
function showConfirmation(chatId, data) {
  const preview = `
📋 *Recipe Preview*

*Naam:* ${data.name}
*State:* ${data.stateEmoji || '📍'} ${data.stateName}
*Type:* ${data.type}
*Category:* ${data.category}
*Prep:* ${data.prepTime || 'N/A'} | *Cook:* ${data.cookTime || 'N/A'}
*Servings:* ${data.servings || 4}
*Difficulty:* ${data.difficulty}

🥘 Ingredients: *${data.ingredients.length}*
👨‍🍳 Steps: *${data.steps.length}*
💡 Tips: *${data.tips.length}*
📸 Photo: *${data.imageUrl ? '✅ Hai' : '❌ Nahi'}*

_Sahi hai? Add karo!_
  `;
  bot.sendMessage(chatId, preview, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Haan Add Karo!', callback_data: 'confirm_yes' }],
        [{ text: '❌ Cancel', callback_data: 'confirm_no' }]
      ]
    }
  });
}

// ─── Submit Recipe ───
async function submitRecipe(chatId, state, from) {
  const d = state.data;
  try {
    const recipe = {
      name: d.name,
      names: { en: d.name, hi: d.name },
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
      steps: d.steps,
      tips: d.tips || [],
      imageUrl: d.imageUrl || '',
      nutrition: {
        calories: 300,
        protein: '10g',
        carbs: '35g',
        fat: '12g',
        fiber: '4g'
      },
      createdBy: from.first_name || 'User',
      createdAt: new Date().toISOString()
    };

    bot.sendMessage(chatId, '📤 Convex Database mein save ho rahi hai...');

    await saveToConvex(recipe);

    userStates.delete(chatId);

    bot.sendMessage(chatId, `
🎉 *Recipe Live Ho Gayi!*

*${recipe.name}* — ${recipe.stateEmoji} ${recipe.stateName}

App mein dekhne ke liye:
State *${recipe.stateName}* select karo ✅

${recipe.imageUrl ? '📸 Photo ke saath!' : '(Bina photo ke add hui)'}

Thanks! 🙏
    `, { parse_mode: 'Markdown' });

    if (ADMIN_ID && String(chatId) !== ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 *Naya Recipe!*\n*${recipe.name}*\nBy: ${recipe.createdBy}\nState: ${recipe.stateName}\nPhoto: ${recipe.imageUrl ? '✅' : '❌'}`,
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
    bot.sendMessage(chatId, '⏳ Recipes load ho rahi hain...');
    const recipes = await getFromConvex();
    if (!recipes.length) {
      return bot.sendMessage(chatId,
        '📭 Koi recipe nahi hai.\n\n/addrecipe se add karo!');
    }
    const lines = recipes.slice(0, 10).map((r, i) =>
      `${i + 1}. *${r.name}* — ${r.stateEmoji || '📍'} ${r.stateName}\n   ${r.type} | ${r.category}`
    ).join('\n\n');
    bot.sendMessage(chatId,
      `📋 *Recipes* (${recipes.length} total)\n\n${lines}`,
      { parse_mode: 'Markdown' });
  } catch (err) {
    bot.sendMessage(chatId, '❌ Database connect nahi hua.');
  }
}

// ─── Error Handling ───
bot.on('polling_error', (err) => console.error('Polling error:', err.code));
process.on('unhandledRejection', (err) => console.error('Unhandled:', err.message));

console.log('🤖 Bharat Ka Zaika Bot started!');
console.log('👑 Admin ID:', ADMIN_ID || 'Not set');
console.log('🔗 Convex URL:', CONVEX_URL);
