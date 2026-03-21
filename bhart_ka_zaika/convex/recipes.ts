// convex/recipes.ts - Complete Queries and Mutations
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// QUERIES
export const getAllRecipes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("recipes").collect();
  }
});

export const getRecipesByState = query({
  args: { stateId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recipes")
      .withIndex("by_state", (q) => q.eq("stateId", args.stateId))
      .collect();
  }
});

export const getRecipesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recipes")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  }
});

export const getRecipesByType = query({
  args: { type: v.union(v.literal("Vegetarian"), v.literal("Non-Vegetarian")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recipes")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  }
});

export const searchRecipes = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("recipes").collect();
    const query = args.searchQuery.toLowerCase();
    return all.filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.stateName.toLowerCase().includes(query) ||
      r.ingredients.some(i => i.toLowerCase().includes(query))
    );
  }
});

export const getRecipeById = query({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const getFeaturedRecipes = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("recipes").collect();
    return all.filter(r => r.isFeatured).slice(0, 10);
  }
});

export const getPopularRecipes = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("recipes").collect();
    return all
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, args.limit || 20);
  }
});

export const getAllStates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("states").collect();
  }
});

export const getStateById = query({
  args: { stateId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("states").collect();
    return all.find(s => s.id === args.stateId);
  }
});

// MUTATIONS
export const addRecipe = mutation({
  args: {
    name: v.string(),
    names: v.record(v.string(), v.string()),
    stateId: v.string(),
    stateName: v.string(),
    stateEmoji: v.string(),
    region: v.string(),
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
    createdBy: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("recipes", {
      ...args,
      createdAt: Date.now(),
      isUserSubmitted: false,
      isFeatured: false,
      viewCount: 0,
      favoriteCount: 0
    });
    return id;
  }
});

export const incrementViewCount = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (recipe) {
      await ctx.db.patch(args.recipeId, {
        viewCount: recipe.viewCount + 1
      });
    }
  }
});

export const updateRecipe = mutation({
  args: {
    id: v.id("recipes"),
    updates: v.object({
      name: v.optional(v.string()),
      names: v.optional(v.record(v.string(), v.string())),
      ingredients: v.optional(v.array(v.string())),
      steps: v.optional(v.array(v.object({
        text: v.string(),
        flame: v.union(v.string(), v.null()),
        time: v.optional(v.string())
      }))),
      tips: v.optional(v.array(v.string())),
      imageUrl: v.optional(v.string())
    })
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  }
});

export const setFeatured = mutation({
  args: { recipeId: v.id("recipes"), featured: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.recipeId, { isFeatured: args.featured });
  }
});
