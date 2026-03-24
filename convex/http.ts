
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SARVAM_KEY = process.env.SARVAM_API_KEY!;

const userStates = new Map<number, any>();

async function sendMessage(chatId: number, text: string, extra?: any) {
  await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        ...extra
      })
    }
  );
}

async function generateWithSarvam(name: string, state: string, category: string) {
  try {
    const res = await fetch(
      'https://api.sarvam.ai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_KEY
        },
        body: JSON.stringify({
          model: 'saaras-v1',
          messages: [
            {
              role: 'system',
              content: 'You are an expert Indian chef. Respond ONLY with valid JSON. No extra text. No backticks.'
            },
            {
              role: 'user',
              content: `Create complete recipe for ${name} from ${state} category ${category}. Return ONLY JSON:
{
  "name_english": "${name}",
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
  "state": "${state}",
  "region": "North",
  "category": "${category}",
  "type": "veg",
  "cook_time": 30,
  "prep_time": 15,
  "difficulty": "Easy",
  "servings": 4,
  "calories": 300,
  "ingredients_english": ["2 cups flour", "1 tsp salt"],
  "ingredients_hindi": ["2 कप आटा", "1 छोटा चम्मच नमक"],
  "steps_english": [{"step":1,"description":"Step description","flame":"medium","time":"5 min"}],
  "steps_hindi": [{"step":1,"description":"स्टेप विवरण","flame":"medium","time":"5 min"}],
  "chef_tips": ["Tip 1", "Tip 2"],
  "serve_with": "Curd, Pickle",
  "nutrition": {"calories":300,"protein":"8g","carbs":"40g","fat":"10g","fiber":"4g"}
}`
            }
          ],
          temperature: 0.3,
          max_tokens: 3000
        })
      }
    );

    const data = await res.json();
    let text = data.choices[0].message.content;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }
    return null;
  } catch(e) {
    return null;
  }
}

http.route({
  path: "/telegram",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const update = await request.json();
    const msg = update.message;
    const callback = update.callback_query;

    if (callback) {
      const chatId = callback.message.chat.id;
      const data = callback.data;
      const state = userStates.get(chatId);

      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: callback.id })
        }
      );

      if (data === 'add_ai') {
        userStates.set(chatId, { step: 'ai_input' });
        await sendMessage(chatId,
          '🤖 *AI Recipe Generator*\n\nBas itna bhejo:\n*Recipe Name, State, Category*\n\nExample:\n`Dal Makhani, Punjab, Dinner`\n`Dosa, Tamil Nadu, Breakfast`'
        );
      }

      if (data === 'add_manual') {
        userStates.set(chatId, { step: 'name', data: {} });
        await sendMessage(chatId, '📝 *Recipe ka naam kya hai?*');
      }

      if (data === 'view_recipes') {
        const recipes = await ctx.runQuery(api.recipes.getAllRecipes);
        if (!recipes.length) {
          await sendMessage(chatId, '📭 Koi recipe nahi hai!\n\n/add se add karo!');
        } else {
          const list = recipes.slice(0, 10).map((r: any, i: number) =>
            `${i+1}. *${r.name_english || r.name}* — ${r.stateName || r.state}`
          ).join('\n');
          await sendMessage(chatId, `📋 *Recipes (${recipes.length} total)*\n\n${list}`);
        }
      }

      if (data === 'confirm_yes') {
        if (state && state.recipe) {
          await sendMessage(chatId,
            '📸 *Photo Bhejo!*\n\nRecipe photo app mein dikhegi!\n\nSkip karne ke liye *skip* likho.'
          );
          userStates.set(chatId, { ...state, step: 'photo' });
        }
      }

      if (data === 'confirm_no') {
        userStates.delete(chatId);
        await sendMessage(chatId, '❌ Cancel ho gaya!\n\n/start se dobara shuru karo.');
      }

      return new Response('OK');
    }

    if (!msg) return new Response('OK');

    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const name = msg.from?.first_name || 'Dost';
    const photo = msg.photo;
    const state = userStates.get(chatId);

    if (text === '/start' || text === '/help') {
      userStates.delete(chatId);
      await sendMessage(chatId,
        `━━━━━━━━━━━━━━━━\n🍛 *BHARAT KA ZAIKA*\n_India ka #1 Recipe App_\n━━━━━━━━━━━━━━━━\n\nNameste ${name}! 🙏\n\n*29 States • 1000+ Recipes*\n*22 Languages • AI Powered*\n\nApni state ki authentic recipe\nshare karo! 🌟`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🤖 AI Se Recipe Add Karo', callback_data: 'add_ai' }],
              [{ text: '📝 Manual Recipe Add Karo', callback_data: 'add_manual' }],
              [{ text: '📚 Recipes Dekho', callback_data: 'view_recipes' }]
            ]
          }
        }
      );
      return new Response('OK');
    }

    if (text === '/add') {
      userStates.set(chatId, { step: 'ai_input' });
      await sendMessage(chatId,
        '🤖 *AI Recipe Generator*\n\nBas itna bhejo:\n*Recipe Name, State, Category*\n\nExample:\n`Dal Makhani, Punjab, Dinner`\n`Dosa, Tamil Nadu, Breakfast`\n`Vada Pav, Maharashtra, Snacks`'
      );
      return new Response('OK');
    }

    if (text === '/cancel') {
      userStates.delete(chatId);
      await sendMessage(chatId, '❌ Cancel!\n\n/start se dobara shuru karo.');
      return new Response('OK');
    }

    if (!state) return new Response('OK');

    if (state.step === 'ai_input') {
      const parts = text.split(',').map((p: string) => p.trim());
      const recipeName = parts[0] || text;
      const recipeState = parts[1] || 'India';
      const recipeCategory = parts[2] || 'dinner';

      await sendMessage(chatId,
        `⏳ *AI Recipe Generate Ho Rahi Hai...*\n\n🍛 ${recipeName}\n📍 ${recipeState}\n\nThoda wait karo...`
      );

      const recipe = await generateWithSarvam(recipeName, recipeState, recipeCategory);

      if (recipe) {
        userStates.set(chatId, { step: 'confirm_ai', recipe });
        await sendMessage(chatId,
          `━━━━━━━━━━━━━━━━\n✅ *Recipe Ready!*\n━━━━━━━━━━━━━━━━\n\n📛 *${recipe.name_english}*\n📍 ${recipe.state} | 🍽️ ${recipe.category}\n⏱️ Prep: ${recipe.prep_time} min | Cook: ${recipe.cook_time} min\n👥 Serves: ${recipe.servings} | 🔥 ${recipe.difficulty}\n🥗 ${recipe.calories} calories\n\n🥘 Ingredients: ${recipe.ingredients_english?.length || 0} items\n👨‍🍳 Steps: ${recipe.steps_english?.length || 0} steps\n💡 Tips: ${recipe.chef_tips?.length || 0} tips\n\n*Sahi hai?*`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '✅ Haan Photo Bhejo', callback_data: 'confirm_yes' }],
                [{ text: '❌ Cancel', callback_data: 'confirm_no' }]
              ]
            }
          }
        );
      } else {
        userStates.set(chatId, { step: 'name', data: {} });
        await sendMessage(chatId,
          '⚠️ *AI busy hai!*\n\nManual mode mein switch ho rahe hain.\n\nRecipe ka naam kya hai?'
        );
      }
      return new Response('OK');
    }

    if (state.step === 'photo' || (text === 'skip' && state.step === 'photo')) {
      let imageUrl = '';

      if (photo) {
        const fileId = photo[photo.length - 1].file_id;
        const fileRes = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
        );
        const fileData = await fileRes.json();
        const filePath = fileData.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

        const imgRes = await fetch(fileUrl);
        const imgBlob = await imgRes.blob();

        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', imgBlob, 'recipe.jpg');

        const uploadRes = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: form
        });
        imageUrl = await uploadRes.text();
        await sendMessage(chatId, '✅ Photo upload ho gayi!');
      }

      const recipe = {
        ...state.recipe,
        imageUrl: imageUrl || '',
        createdBy: name,
        createdAt: Date.now(),
        is_active: true
      };

      try {
        await ctx.runMutation(api.recipes.addRecipe, { recipe });
        userStates.delete(chatId);
        await sendMessage(chatId,
          `━━━━━━━━━━━━━━━━\n🎉 *Recipe Live Ho Gayi!*\n━━━━━━━━━━━━━━━━\n\n*${recipe.name_english}* ab app mein hai!\n\n🌐 22 languages mein available\n📍 ${recipe.state} section mein milegi\n${imageUrl ? '📸 Photo ke saath!' : ''}\n\n*Shukriya!* 🙏`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '➕ Aur Recipe Add Karo', callback_data: 'add_ai' }],
                [{ text: '📚 Recipes Dekho', callback_data: 'view_recipes' }]
              ]
            }
          }
        );
      } catch(e) {
        await sendMessage(chatId, '❌ Save nahi ho paaya. Phir try karo.');
      }
    }

    return new Response('OK');
  })
});

export default http;

