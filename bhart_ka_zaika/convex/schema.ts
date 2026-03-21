// convex/schema.ts - Complete Convex Database Schema
// Visit https://convex.dev to set up free account

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // All 435 recipes from 29 states
  recipes: defineTable({
    // Basic Info
    name: v.string(),
    names: v.record(v.string(), v.string()), // 22 languages
    stateId: v.string(),
    stateName: v.string(),
    stateEmoji: v.string(),
    region: v.union(
      v.literal("north"),
      v.literal("south"),
      v.literal("east"),
      v.literal("west"),
      v.literal("northeast"),
      v.literal("central")
    ),
    
    // Recipe Details
    type: v.union(v.literal("Vegetarian"), v.literal("Non-Vegetarian")),
    category: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snacks"),
      v.literal("sweets")
    ),
    prepTime: v.string(), // "15 mins"
    cookTime: v.string(), // "30 mins"
    servings: v.number(),
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard")
    ),
    emoji: v.string(),
    
    // Ingredients with exact measurements
    ingredients: v.array(v.string()), // "2 cups basmati rice", "1.5 tsp cumin seeds"
    
    // Steps with flame levels
    steps: v.array(v.object({
      text: v.string(),
      flame: v.union(
        v.literal("high"),
        v.literal("medium"),
        v.literal("low"),
        v.literal("simmer"),
        v.null()
      ),
      time: v.optional(v.string()) // "10-12 mins"
    })),
    
    // Chef tips
    tips: v.array(v.string()),
    
    // Nutrition per serving
    nutrition: v.object({
      calories: v.number(),
      protein: v.string(),
      carbs: v.string(),
      fat: v.string(),
      fiber: v.string()
    }),
    
    // Image
    imageUrl: v.string(),
    
    // Metadata
    createdAt: v.number(),
    createdBy: v.optional(v.string()), // user ID if user submitted
    approvedBy: v.optional(v.string()), // admin ID
    isUserSubmitted: v.boolean(),
    isFeatured: v.boolean(),
    
    // Stats
    viewCount: v.number(),
    favoriteCount: v.number()
  }).index("by_state", ["stateId"])
    .index("by_category", ["category"])
    .index("by_type", ["type"]),
  
  // User favorites
  favorites: defineTable({
    deviceId: v.string(),
    recipeId: v.string(),
    createdAt: v.number()
  }).index("by_device", ["deviceId"])
    .index("by_recipe", ["recipeId"]),
  
  // Meal plans
  mealPlans: defineTable({
    deviceId: v.string(),
    date: v.string(), // "2026-03-19"
    meals: v.object({
      breakfast: v.optional(v.string()), // recipeId
      lunch: v.optional(v.string()),
      dinner: v.optional(v.string())
    })
  }).index("by_device_date", ["deviceId", "date"]),
  
  // Pending recipes from users
  pendingRecipes: defineTable({
    // User Info
    odUserId: v.string(),
    odUsername: v.optional(v.string()),
    telegramId: v.optional(v.string()),
    
    // Recipe Data (same as recipes)
    name: v.string(),
    names: v.record(v.string(), v.string()),
    stateId: v.string(),
    stateName: v.string(),
    type: v.string(),
    category: v.string(),
    prepTime: v.string(),
    cookTime: v.string(),
    servings: v.number(),
    difficulty: v.string(),
    emoji: v.string(),
    ingredients: v.array(v.string()),
    steps: v.array(v.object({
      text: v.string(),
      flame: v.union(v.string(), v.null()),
      time: v.optional(v.string())
    })),
    tips: v.array(v.string()),
    nutrition: v.object({
      calories: v.number(),
      protein: v.string(),
      carbs: v.string(),
      fat: v.string(),
      fiber: v.string()
    }),
    imageUrl: v.string(),
    
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    rejectionReason: v.optional(v.string())
  }).index("by_status", ["status"])
    .index("by_user", ["odUserId"]),
  
  // Telegram users
  telegramUsers: defineTable({
    telegramId: v.string(),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    isAdmin: v.boolean(),
    recipesCount: v.number(),
    createdAt: v.number()
  }).index("by_telegram_id", ["telegramId"]),
  
  // Shopping lists
  shoppingLists: defineTable({
    deviceId: v.string(),
    mealPlanId: v.optional(v.string()),
    items: v.array(v.object({
      ingredient: v.string(),
      quantity: v.optional(v.string()),
      checked: v.boolean()
    })),
    createdAt: v.number()
  }).index("by_device", ["deviceId"]),
  
  // All states reference
  states: defineTable({
    id: v.string(),
    name: v.string(),
    emoji: v.string(),
    color: v.string(),
    region: v.string(),
    language: v.string(),
    languageCode: v.string()
  })
});
