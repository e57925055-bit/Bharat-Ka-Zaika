// Convex Database Schema & Functions
// Free backend database for भारत का जायका

// This file will be used with Convex backend
// Visit https://convex.dev to set up free account

export default {
    schema: {
        recipes: {
            id: string,
            name: string,
            names: Record<string, string>, // language -> name
            stateId: string,
            stateName: string,
            type: "Vegetarian" | "Non-Vegetarian",
            prepTime: string,
            cookTime: string,
            difficulty: string,
            emoji: string,
            ingredients: string[],
            steps: { text: string, flame: string | null }[],
            tips: string[],
            nutrition: { calories: number, protein: number, carbs: number, fat: number, fiber: number },
            imageUrl: string,
            createdAt: number,
            createdBy: string,
            isVerified: boolean = false
        },
        userRecipes: {
            id: string,
            odUserId: string,
            recipes: string[], // recipe IDs
            favorites: string[],
            mealPlan: Record<string, string[]>,
            createdAt: number
        },
        userSubmissions: {
            id: string,
            odUserId: string,
            recipeData: object,
            status: "pending" | "approved" | "rejected",
            submittedAt: number
        }
    },
    
    // Functions
    queries: {
        getAllRecipes: () => {
            return db.query("recipes").collect();
        },
        
        getRecipeById: (args: { id: string }) => {
            return db.query("recipes").filter(q => q.eq(q.field("id"), args.id)).first();
        },
        
        getRecipesByState: (args: { stateId: string }) => {
            return db.query("recipes").filter(q => q.eq(q.field("stateId"), args.stateId)).collect();
        },
        
        searchRecipes: (args: { query: string }) => {
            return db.query("recipes").filter(q => 
                q.or(
                    q.contains(q.field("name"), args.query),
                    q.contains(q.field("stateName"), args.query)
                )
            ).collect();
        }
    },
    
    mutations: {
        addRecipe: (args: {
            name: string,
            names: Record<string, string>,
            stateId: string,
            stateName: string,
            type: string,
            prepTime: string,
            cookTime: string,
            difficulty: string,
            emoji: string,
            ingredients: string[],
            steps: { text: string, flame: string | null }[],
            tips: string[],
            nutrition: object,
            imageUrl: string,
            createdBy: string
        }) => {
            const id = crypto.randomUUID();
            db.insert("recipes", {
                id,
                ...args,
                createdAt: Date.now(),
                isVerified: false
            });
            return id;
        },
        
        updateRecipe: (args: { id: string, updates: object }) => {
            db.patch("recipes", args.id, args.updates);
        },
        
        submitRecipe: (args: {
            userId: string,
            recipeData: object
        }) => {
            const id = crypto.randomUUID();
            db.insert("userSubmissions", {
                id,
                userId: args.userId,
                recipeData: args.recipeData,
                status: "pending",
                submittedAt: Date.now()
            });
            return id;
        },
        
        toggleFavorite: (args: { userId: string, recipeId: string }) => {
            const user = db.query("userRecipes").filter(q => q.eq(q.field("odUserId"), args.userId)).first();
            if (user) {
                const favorites = user.favorites || [];
                const index = favorites.indexOf(args.recipeId);
                if (index > -1) {
                    favorites.splice(index, 1);
                } else {
                    favorites.push(args.recipeId);
                }
                db.patch("userRecipes", user.id, { favorites });
            }
        }
    }
};

// Telegram Bot Integration
// Use with: python-telegram-bot library
const telegramBotCode = `
# Telegram Bot for भारत का जायका
# Run with: python telegram_bot.py

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
import json
import requests

BOT_TOKEN = "YOUR_BOT_TOKEN"

# States for conversation
user_states = {}

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📖 Browse Recipes", callback_data="browse")],
        [InlineKeyboardButton("➕ Submit Recipe", callback_data="submit")],
        [InlineKeyboardButton("🔍 Search", callback_data="search")],
        [InlineKeyboardButton("📋 My Favorites", callback_data="favorites")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🍛 *भारत का जायका - India's Culinary Heritage*\\n\\n"
        "Welcome! Submit your family recipes or browse authentic dishes from all 29 states!",
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

async def submit_recipe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    user_id = str(query.from_user.id)
    user_states[user_id] = {"step": "name", "data": {}}
    
    await query.edit_message_text(
        "📝 *Submit Your Recipe*\\n\\n"
        "Step 1: Recipe Name\\n\\n"
        "Enter the name of your recipe (e.g., 'Maa ke Haath ka Pulao')"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.message.from_user.id)
    
    if user_id not in user_states:
        await update.message.reply_text("Please use /start to begin!")
        return
    
    state = user_states[user_id]
    text = update.message.text
    
    if state["step"] == "name":
        state["data"]["name"] = text
        state["step"] = "state"
        await update.message.reply_text(
            "✅ Recipe name saved!\\n\\n"
            "Step 2: State Name\\n\\n"
            "Which Indian state is this recipe from?\\n"
            "(e.g., Uttar Pradesh, Punjab, Tamil Nadu)"
        )
    
    elif state["step"] == "state":
        state["data"]["stateName"] = text
        state["step"] = "ingredients"
        await update.message.reply_text(
            "✅ State saved!\\n\\n"
            "Step 3: Ingredients\\n\\n"
            "List your ingredients, one per line:\\n"
            "(e.g.,\\n2 cups rice\\n1 cup dal\\n1 tsp salt)"
        )
    
    elif state["step"] == "ingredients":
        state["data"]["ingredients"] = text.split("\\n")
        state["step"] = "steps"
        await update.message.reply_text(
            "✅ Ingredients saved!\\n\\n"
            "Step 4: Cooking Steps\\n\\n"
            "Write the cooking steps, one per line:\\n"
            "(e.g.,\\n1. Heat oil\\n2. Add spices\\n3. Cook rice)"
        )
    
    elif state["step"] == "steps":
        state["data"]["steps"] = text.split("\\n")
        state["step"] = "tips"
        await update.message.reply_text(
            "✅ Steps saved!\\n\\n"
            "Step 5: Chef Tips (Optional)\\n\\n"
            "Share any tips for this recipe:\\n"
            "(Or type 'skip' to continue)"
        )
    
    elif state["step"] == "tips":
        if text.lower() != "skip":
            state["data"]["tips"] = text.split("\\n")
        else:
            state["data"]["tips"] = []
        
        # Save to Convex
        recipe_data = {
            "name": state["data"]["name"],
            "stateName": state["data"]["stateName"],
            "ingredients": state["data"]["ingredients"],
            "steps": state["data"]["steps"],
            "tips": state["data"].get("tips", []),
            "createdBy": user_id,
            "createdAt": datetime.now().isoformat()
        }
        
        # Send to Convex backend
        # await convex.mutations.submitRecipe({ userId: user_id, recipeData: recipe_data })
        
        del user_states[user_id]
        
        await update.message.reply_text(
            "🎉 *Recipe Submitted Successfully!*\\n\\n"
            f"📝 *{recipe_data['name']}*\\n"
            f"📍 From: {recipe_data['stateName']}\\n\\n"
            "Your recipe has been submitted for review!\\n"
            "It will be added after verification.\\n\\n"
            "Thank you for contributing to भारत का जायका! 🙏"
        )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    if query.data == "submit":
        await submit_recipe(update, context)
    elif query.data == "browse":
        await query.edit_message_text(
            "📖 *Browse Recipes*\\n\\n"
            "Visit our app to browse all recipes:\\n"
            "🌐 [भारत का जायका App](your-app-url)\\n\\n"
            "Search by state, category, or ingredients!"
        )

app = Application.builder().token(BOT_TOKEN).build()
app.add_handler(CommandHandler("start", start_command))
app.add_handler(CallbackQueryHandler(button_callback))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

print("🤖 Telegram Bot Started!")
app.run_polling(allowed_updates=Update.ALL_TYPES)
`

export { telegramBotCode };
