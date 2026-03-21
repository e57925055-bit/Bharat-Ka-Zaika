// telegram_bot/bot.js - Complete Telegram Bot
// Usage: npm start

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { ConvexHttpClient } = require('convex/browser');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CONVEX_URL = process.env.CONVEX_URL;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;

// Initialize
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const convex = new ConvexHttpClient(CONVEX_URL);

// Cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// User states for recipe submission
const userStates = new Map();

// States data
const STATES = [
  { id: "andhrapradesh", name: "Andhra Pradesh", language: "Telugu", langCode: "te" },
  { id: "arunachalpradesh", name: "Arunachal Pradesh", language: "English", langCode: "en" },
  { id: "assam", name: "Assam", language: "Assamese", langCode: "as" },
  { id: "bihar", name: "Bihar", language: "Hindi", langCode: "hi" },
  { id: "chhattisgarh", name: "Chhattisgarh", language: "Hindi", langCode: "hi" },
  { id: "goa", name: "Goa", language: "Konkani", langCode: "kok" },
  { id: "gujarat", name: "Gujarat", language: "Gujarati", langCode: "gu" },
  { id: "haryana", name: "Haryana", language: "Hindi", langCode: "hi" },
  { id: "himachalpradesh", name: "Himachal Pradesh", language: "Hindi", langCode: "hi" },
  { id: "jharkhand", name: "Jharkhand", language: "Hindi", langCode: "hi" },
  { id: "karnataka", name: "Karnataka", language: "Kannada", langCode: "kn" },
  { id: "kerala", name: "Kerala", language: "Malayalam", langCode: "ml" },
  { id: "madhyapradesh", name: "Madhya Pradesh", language: "Hindi", langCode: "hi" },
  { id: "maharashtra", name: "Maharashtra", language: "Marathi", langCode: "mr" },
  { id: "manipur", name: "Manipur", language: "Manipuri", langCode: "mni" },
  { id: "meghalaya", name: "Meghalaya", language: "English", langCode: "en" },
  { id: "mizoram", name: "Mizoram", language: "English", langCode: "en" },
  { id: "nagaland", name: "Nagaland", language: "English", langCode: "en" },
  { id: "odisha", name: "Odisha", language: "Odia", langCode: "or" },
  { id: "punjab", name: "Punjab", language: "Punjabi", langCode: "pa" },
  { id: "rajasthan", name: "Rajasthan", language: "Hindi", langCode: "hi" },
  { id: "sikkim", name: "Sikkim", language: "English", langCode: "en" },
  { id: "tamilnadu", name: "Tamil Nadu", language: "Tamil", langCode: "ta" },
  { id: "telangana", name: "Telangana", language: "Telugu", langCode: "te" },
  { id: "tripura", name: "Tripura", language: "Bengali", langCode: "bn" },
  { id: "uttarpradesh", name: "Uttar Pradesh", language: "Hindi", langCode: "hi" },
  { id: "uttarakhand", name: "Uttarakhand", language: "Hindi", langCode: "hi" },
  { id: "westbengal", name: "West Bengal", language: "Bengali", langCode: "bn" },
  { id: "delhi", name: "Delhi", language: "Hindi", langCode: "hi" }
];

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];
const TYPES = ['Vegetarian', 'Non-Vegetarian'];
const FLAME_LEVELS = ['high', 'medium', 'low', 'simmer', 'none'];

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  
  // Save user to Convex
  try {
    await convex.mutation("telegramUsers:register", {
      telegramId: String(chatId),
      username: msg.from.username,
      firstName: userName
    });
  } catch (e) {
    console.log("User registration error:", e);
  }
  
  const welcomeMessage = `
🍛 *भारत का जायका - Bharat Ka Zayka*

Welcome ${userName}! 🙏

Share your authentic Indian recipes with the world!

*Available Commands:*

/addrecipe - Submit a new recipe 🆕
/myrecipes - View your submitted recipes 📖
/search - Search recipes 🔍
/states - Browse by state 🗺️
/help - Get help 📚

*For Admins:*
/admin - Admin panel (authorized users only)
  `;
  
  const keyboard = {
    inline_keyboard: [
      [{ text: "➕ Add Recipe", callback_data: "add_recipe" }],
      [{ text: "📖 My Recipes", callback_data: "my_recipes" }],
      [{ text: "🔍 Search", callback_data: "search" }],
      [{ text: "🗺️ Browse States", callback_data: "browse_states" }]
    ]
  };
  
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown", reply_markup: keyboard });
});

// Add Recipe command
bot.onText(/\/addrecipe/, (msg) => {
  const chatId = msg.chat.id;
  startRecipeSubmission(chatId);
});

// Add recipe callback
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  if (data === "add_recipe") {
    await bot.answerCallbackQuery(query.id);
    startRecipeSubmission(chatId);
  }
  else if (data === "my_recipes") {
    await bot.answerCallbackQuery(query.id);
    await showMyRecipes(chatId, query.from.id);
  }
  else if (data === "search") {
    await bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, "🔍 *Search Recipes*\n\nSend me a recipe name or ingredient to search!", { parse_mode: "Markdown" });
    userStates.set(chatId, { step: "search" });
  }
  else if (data === "browse_states") {
    await bot.answerCallbackQuery(query.id);
    await showStatesList(chatId);
  }
  else if (data.startsWith("state_")) {
    await bot.answerCallbackQuery(query.id);
    const stateId = data.replace("state_", "");
    await showStateRecipes(chatId, stateId);
  }
  else if (data.startsWith("recipe_")) {
    await bot.answerCallbackQuery(query.id);
    const recipeId = data.replace("recipe_", "");
    await showRecipeDetail(chatId, recipeId);
  }
  else if (data === "add_name") {
    await bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, "📝 *Recipe Name*\n\nWhat is the name of your recipe?\n\nExample: *Maa ke Haath ka Pulao*", { parse_mode: "Markdown" });
    const state = userStates.get(chatId) || { step: "name" };
    state.step = "name";
    userStates.set(chatId, state);
  }
});

// Handle messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const photo = msg.photo;
  
  if (!text || text.startsWith("/")) return;
  
  const state = userStates.get(chatId);
  if (!state) return;
  
  // Handle photo for recipe
  if (photo && state.step === "photo") {
    await handlePhoto(chatId, msg, state);
    return;
  }
  
  switch (state.step) {
    case "name":
      state.data.name = text;
      state.step = "state";
      userStates.set(chatId, state);
      await showStateSelector(chatId);
      break;
      
    case "state":
      const stateInfo = STATES.find(s => s.name.toLowerCase() === text.toLowerCase());
      if (stateInfo) {
        state.data.stateId = stateInfo.id;
        state.data.stateName = stateInfo.name;
        state.step = "type";
        userStates.set(chatId, state);
        await showTypeSelector(chatId);
      } else {
        bot.sendMessage(chatId, "❌ State not found. Please try again or type /cancel to exit.");
      }
      break;
      
    case "type":
      const type = TYPES.find(t => t.toLowerCase() === text.toLowerCase());
      if (type) {
        state.data.type = type;
        state.step = "category";
        userStates.set(chatId, state);
        await showCategorySelector(chatId);
      } else {
        bot.sendMessage(chatId, "❌ Invalid type. Please choose Vegetarian or Non-Vegetarian.");
      }
      break;
      
    case "category":
      const category = CATEGORIES.find(c => c.toLowerCase() === text.toLowerCase());
      if (category) {
        state.data.category = category;
        state.step = "prepTime";
        userStates.set(chatId, state);
        bot.sendMessage(chatId, "⏱️ *Prep Time*\n\nHow long does it take to prepare?\n\nExample: *15 mins*, *30 mins*, *1 hour*", { parse_mode: "Markdown" });
      } else {
        bot.sendMessage(chatId, "❌ Invalid category. Choose: breakfast, lunch, dinner, snacks, or sweets");
      }
      break;
      
    case "prepTime":
      state.data.prepTime = text;
      state.step = "cookTime";
      userStates.set(chatId, state);
      bot.sendMessage(chatId, "🍳 *Cook Time*\n\nHow long does it take to cook?\n\nExample: *30 mins*, *45 mins*, *1 hour*", { parse_mode: "Markdown" });
      break;
      
    case "cookTime":
      state.data.cookTime = text;
      state.step = "servings";
      userStates.set(chatId, state);
      bot.sendMessage(chatId, "👥 *Servings*\n\nHow many people does this serve?\n\nExample: *4*, *6*", { parse_mode: "Markdown" });
      break;
      
    case "servings":
      state.data.servings = parseInt(text);
      state.step = "difficulty";
      userStates.set(chatId, state);
      bot.sendMessage(chatId, "📊 *Difficulty*\n\nHow difficult is this recipe?\n\n*Easy* - Simple steps, beginner friendly\n*Medium* - Some skill required\n*Hard* - Expert level", { parse_mode: "Markdown" });
      break;
      
    case "difficulty":
      if (['easy', 'medium', 'hard'].includes(text.toLowerCase())) {
        state.data.difficulty = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        state.step = "ingredients";
        state.data.ingredients = [];
        userStates.set(chatId, state);
        bot.sendMessage(chatId, "🥘 *Ingredients*\n\nSend your ingredients one by one.\n\n*Format:* Quantity + Item\n\nExample:\n2 cups basmati rice\n1.5 tsp cumin seeds\n3 tbsp fresh ghee\n1 medium onion finely chopped\n\n*Important:* Give exact measurements!\n\nSend *done* when finished.", { parse_mode: "Markdown" });
      } else {
        bot.sendMessage(chatId, "❌ Choose: Easy, Medium, or Hard");
      }
      break;
      
    case "ingredients":
      if (text.toLowerCase() === "done") {
        if (state.data.ingredients.length >= 3) {
          state.step = "steps";
          state.data.steps = [];
          userStates.set(chatId, state);
          bot.sendMessage(chatId, "👨‍🍳 *Cooking Steps*\n\nSend your steps one by one.\n\n*Format:* Step description with flame level\n\nExample:\n1. Heat ghee in a pan on high flame\n2. Add cumin seeds, let splutter\n3. Add onions, fry for 10 minutes medium flame\n\n*Flame options:* 🔴 high, 🟡 medium, 🟢 low, ⚫ simmer\n\nSend *done* when finished.", { parse_mode: "Markdown" });
        } else {
          bot.sendMessage(chatId, "❌ Please add at least 3 ingredients!");
        }
      } else {
        state.data.ingredients.push(text);
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ Added (${state.data.ingredients.length}): ${text}\n\nSend next ingredient or *done* when finished.`);
      }
      break;
      
    case "steps":
      if (text.toLowerCase() === "done") {
        if (state.data.steps.length >= 3) {
          state.step = "tips";
          state.data.tips = [];
          userStates.set(chatId, state);
          bot.sendMessage(chatId, "💡 *Chef Tips*\n\nShare any tips for this recipe!\n\nExample:\n- Always use room temperature paneer\n- Rest dough for 20 minutes\n- Fry on medium flame for crispy texture\n\nSend *done* when finished (or skip).", { parse_mode: "Markdown" });
        } else {
          bot.sendMessage(chatId, "❌ Please add at least 3 cooking steps!");
        }
      } else {
        // Parse flame level from text
        let flame = "none";
        if (text.toLowerCase().includes("high flame")) flame = "high";
        else if (text.toLowerCase().includes("medium flame")) flame = "medium";
        else if (text.toLowerCase().includes("low flame")) flame = "low";
        else if (text.toLowerCase().includes("simmer")) flame = "simmer";
        
        state.data.steps.push({ text, flame });
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ Step ${state.data.steps.length} added!\n\nSend next step or *done* when finished.`);
      }
      break;
      
    case "tips":
      if (text.toLowerCase() === "done" || text.toLowerCase() === "skip") {
        state.step = "photo";
        userStates.set(chatId, state);
        bot.sendMessage(chatId, "📷 *Food Photo*\n\nSend a photo of your dish!\n\nThis will be uploaded to Cloudinary and added to your recipe.", { parse_mode: "Markdown" });
      } else {
        state.data.tips.push(text);
        userStates.set(chatId, state);
        bot.sendMessage(chatId, `✅ Tip added! (${state.data.tips.length})\n\nSend next tip or *done* when finished.`);
      }
      break;
      
    case "search":
      await searchRecipes(chatId, text);
      userStates.delete(chatId);
      break;
  }
});

// Helper functions
async function startRecipeSubmission(chatId) {
  const state = {
    step: "name",
    data: {
      ingredients: [],
      steps: [],
      tips: [],
      names: { en: "", hi: "" }
    },
    telegramId: String(chatId),
    telegramUsername: bot.bot.players?.[chatId]?.username || ""
  };
  userStates.set(chatId, state);
  
  bot.sendMessage(chatId, `
📝 *Submit Your Recipe*

Let's create your recipe step by step!

*Step 1: Recipe Name*

What is your recipe called?

Example: *Aamras*, *Maa ke Haath ka Dal*, *Punjabi Chole*
  `, { parse_mode: "Markdown" });
}

async function showStateSelector(chatId) {
  const keyboard = {
    inline_keyboard: STATES.slice(0, 8).map(s => [{
      text: `${s.emoji || '🏛️'} ${s.name}`,
      callback_data: `state_${s.id}`
    }])
  };
  
  const message = `📍 *Select State*\n\nWhich Indian state is your recipe from?\n\nOr type the state name manually.`;
  
  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
}

async function showTypeSelector(chatId) {
  const keyboard = {
    inline_keyboard: [
      [{ text: "🥬 Vegetarian", callback_data: "type_veg" }],
      [{ text: "🍖 Non-Vegetarian", callback_data: "type_nonveg" }]
    ]
  };
  
  bot.sendMessage(chatId, "🍽️ *Veg or Non-Veg?*\n\nIs this recipe Vegetarian or Non-Vegetarian?", { parse_mode: "Markdown", reply_markup: keyboard });
}

async function showCategorySelector(chatId) {
  const keyboard = {
    inline_keyboard: CATEGORIES.map(c => [{
      text: c.charAt(0).toUpperCase() + c.slice(1),
      callback_data: `cat_${c}`
    }])
  };
  
  bot.sendMessage(chatId, "📂 *Category*\n\nWhat type of meal is this?", { parse_mode: "Markdown", reply_markup: keyboard });
}

async function handlePhoto(chatId, msg, state) {
  try {
    bot.sendMessage(chatId, "📤 Uploading photo...");
    
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;
    
    // Download file
    const response = await axios({
      method: 'GET',
      url: `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`,
      responseType: 'arraybuffer'
    });
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`,
      { folder: "bharat-ka-zaika" }
    );
    
    state.data.imageUrl = result.secure_url;
    state.step = "confirm";
    userStates.set(chatId, state);
    
    // Show confirmation
    const recipePreview = formatRecipePreview(state.data);
    bot.sendMessage(chatId, recipePreview, { parse_mode: "Markdown" });
    bot.sendMessage(chatId, "✅ Photo uploaded!\n\nDoes this look correct? Send *yes* to submit or *no* to cancel.");
    
  } catch (error) {
    console.error("Photo upload error:", error);
    bot.sendMessage(chatId, "❌ Failed to upload photo. Please try again or send *skip* to continue without photo.");
  }
}

function formatRecipePreview(data) {
  return `
📋 *Recipe Preview*

*Name:* ${data.name}
*State:* ${data.stateName}
*Type:* ${data.type}
*Category:* ${data.category}

⏱️ *Prep Time:* ${data.prepTime}
🍳 *Cook Time:* ${data.cookTime}
👥 *Servings:* ${data.servings}
📊 *Difficulty:* ${data.difficulty}

🥘 *Ingredients:* ${data.ingredients.length} items
👨‍🍳 *Steps:* ${data.steps.length} steps
💡 *Tips:* ${data.tips.length} items
  `;
}

async function showMyRecipes(chatId, odUserId) {
  try {
    const recipes = await convex.query("pendingRecipes:getByUser", { odUserId: String(odUserId) });
    
    if (!recipes || recipes.length === 0) {
      bot.sendMessage(chatId, "📖 *My Recipes*\n\nYou haven't submitted any recipes yet!\n\nUse /addrecipe to submit your first recipe.", { parse_mode: "Markdown" });
      return;
    }
    
    const message = `📖 *My Recipes* (${recipes.length})\n\n`;
    
    recipes.forEach((r, i) => {
      const status = r.status === "approved" ? "✅" : r.status === "pending" ? "⏳" : "❌";
      message += `${i + 1}. ${status} *${r.name}*\n   📍 ${r.stateName}\n   📅 ${new Date(r.submittedAt).toLocaleDateString()}\n\n`;
    });
    
    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    bot.sendMessage(chatId, "❌ Error loading your recipes. Please try again later.");
  }
}

async function searchRecipes(chatId, query) {
  try {
    const results = await convex.query("recipes:search", { searchQuery: query });
    
    if (!results || results.length === 0) {
      bot.sendMessage(chatId, `🔍 *No results for "${query}"*\n\nTry a different search term!`);
      return;
    }
    
    const message = `🔍 *Results for "${query}"* (${results.length})\n\n`;
    
    results.slice(0, 5).forEach((r, i) => {
      message += `${i + 1}. *${r.name}*\n   📍 ${r.stateName}\n   ⏱️ ${r.prepTime} + ${r.cookTime}\n\n`;
    });
    
    const keyboard = {
      inline_keyboard: results.slice(0, 5).map(r => [{
        text: r.name.substring(0, 30),
        callback_data: `recipe_${r._id}`
      }])
    };
    
    bot.sendMessage(chatId, message, { parse_mode: "Markdown", reply_markup: keyboard });
  } catch (error) {
    console.error("Search error:", error);
    bot.sendMessage(chatId, "❌ Error searching. Please try again.");
  }
}

async function showStatesList(chatId) {
  const keyboard = {
    inline_keyboard: STATES.slice(0, 29).map(s => [{
      text: `${s.name} (${s.language})`,
      callback_data: `state_${s.id}`
    }])
  };
  
  bot.sendMessage(chatId, "🗺️ *Browse by State*\n\nSelect a state to see its recipes:", { parse_mode: "Markdown", reply_markup: keyboard });
}

async function showStateRecipes(chatId, stateId) {
  try {
    const recipes = await convex.query("recipes:getByState", { stateId });
    
    if (!recipes || recipes.length === 0) {
      bot.sendMessage(chatId, "No recipes found for this state yet!");
      return;
    }
    
    const message = `📍 *${recipes[0].stateName} Recipes* (${recipes.length})\n\n`;
    
    const keyboard = {
      inline_keyboard: recipes.slice(0, 8).map(r => [{
        text: `🍛 ${r.name.substring(0, 25)}`,
        callback_data: `recipe_${r._id}`
      }])
    };
    
    bot.sendMessage(chatId, message, { parse_mode: "Markdown", reply_markup: keyboard });
  } catch (error) {
    console.error("Error fetching state recipes:", error);
    bot.sendMessage(chatId, "❌ Error loading recipes. Please try again.");
  }
}

async function showRecipeDetail(chatId, recipeId) {
  try {
    const recipe = await convex.query("recipes:getById", { id: recipeId });
    
    if (!recipe) {
      bot.sendMessage(chatId, "Recipe not found!");
      return;
    }
    
    // Increment view count
    await convex.mutation("recipes:incrementView", { recipeId });
    
    let message = `🍛 *${recipe.name}*\n\n`;
    message += `📍 ${recipe.stateName}\n`;
    message += `${recipe.type === "Vegetarian" ? "🥬" : "🍖"} ${recipe.type}\n`;
    message += `📂 ${recipe.category}\n\n`;
    message += `⏱️ Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime}\n`;
    message += `👥 Serves: ${recipe.servings}\n`;
    message += `📊 Difficulty: ${recipe.difficulty}\n\n`;
    message += `🔥 *Ingredients:*\n`;
    recipe.ingredients.forEach(i => message += `• ${i}\n`);
    
    if (recipe.imageUrl) {
      bot.sendPhoto(chatId, recipe.imageUrl, { caption: message, parse_mode: "Markdown" });
    } else {
      bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    }
    
  } catch (error) {
    console.error("Error showing recipe:", error);
    bot.sendMessage(chatId, "❌ Error loading recipe. Please try again.");
  }
}

// Cancel command
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  userStates.delete(chatId);
  bot.sendMessage(chatId, "❌ Cancelled! Use /addrecipe to start again.");
});

// My recipes command
bot.onText(/\/myrecipes/, async (msg) => {
  await showMyRecipes(msg.chat.id, msg.from.id);
});

// Help command
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
📚 *Help*

*Commands:*
/start - Welcome message
/addrecipe - Submit a new recipe
/myrecipes - View your submissions
/search - Search recipes
/cancel - Cancel current action

*Tips:*
• Use exact measurements for ingredients
• Include flame levels in steps
• Add a photo for better visibility

Happy cooking! 🍛
  `, { parse_mode: "Markdown" });
});

// Admin commands
bot.onText(/\/admin/, async (msg) => {
  const chatId = msg.chat.id;
  if (String(chatId) !== ADMIN_TELEGRAM_ID) {
    bot.sendMessage(chatId, "❌ Unauthorized!");
    return;
  }
  
  try {
    const pending = await convex.query("pendingRecipes:getPending", {});
    
    const message = `🔧 *Admin Panel*\n\nPending recipes: ${pending.length}\n\n`;
    
    const keyboard = {
      inline_keyboard: pending.slice(0, 10).map(r => [
        { text: `✅ Approve ${r.name.substring(0, 20)}`, callback_data: `approve_${r._id}` },
        { text: `❌ Reject`, callback_data: `reject_${r._id}` }
      ])
    };
    
    bot.sendMessage(chatId, message, { parse_mode: "Markdown", reply_markup: keyboard });
  } catch (error) {
    bot.sendMessage(chatId, "❌ Error loading admin panel.");
  }
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

console.log("🤖 Bharat Ka Zaika Telegram Bot Started!");
console.log(`Admin ID: ${ADMIN_TELEGRAM_ID}`);
