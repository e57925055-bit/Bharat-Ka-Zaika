import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getUserFavorites = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
  }
});

export const getFavoriteRecipes = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    
    const recipes = await Promise.all(
      favorites.map((fav) => ctx.db.get(fav.recipeId as any))
    );
    
    return recipes.filter(Boolean);
  }
});

export const isRecipeFavorited = query({
  args: { deviceId: v.string(), recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    
    return favorites.some((fav) => fav.recipeId === args.recipeId);
  }
});

export const getFavoriteCount = query({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    return favorites.length;
  }
});

export const addToFavorites = mutation({
  args: { deviceId: v.string(), recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    
    const alreadyFavorited = existing.some((fav) => fav.recipeId === args.recipeId);
    
    if (alreadyFavorited) {
      return { success: false, message: "Already in favorites" };
    }
    
    const id = await ctx.db.insert("favorites", {
      deviceId: args.deviceId,
      recipeId: args.recipeId,
      createdAt: Date.now()
    });
    
    const recipe = await ctx.db.get(args.recipeId);
    if (recipe) {
      await ctx.db.patch(args.recipeId, {
        favoriteCount: recipe.favoriteCount + 1
      });
    }
    
    return { success: true, favoriteId: id };
  }
});

export const removeFromFavorites = mutation({
  args: { deviceId: v.string(), recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    
    const favorite = favorites.find((fav) => fav.recipeId === args.recipeId);
    
    if (!favorite) {
      return { success: false, message: "Not in favorites" };
    }
    
    await ctx.db.delete(favorite._id);
    
    const recipe = await ctx.db.get(args.recipeId);
    if (recipe && recipe.favoriteCount > 0) {
      await ctx.db.patch(args.recipeId, {
        favoriteCount: recipe.favoriteCount - 1
      });
    }
    
    return { success: true };
  }
});

export const toggleFavorite = mutation({
  args: { deviceId: v.string(), recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    
    const existing = favorites.find((fav) => fav.recipeId === args.recipeId);
    
    if (existing) {
      await ctx.db.delete(existing._id);
      const recipe = await ctx.db.get(args.recipeId);
      if (recipe && recipe.favoriteCount > 0) {
        await ctx.db.patch(args.recipeId, {
          favoriteCount: recipe.favoriteCount - 1
        });
      }
      return { isFavorited: false };
    } else {
      await ctx.db.insert("favorites", {
        deviceId: args.deviceId,
        recipeId: args.recipeId,
        createdAt: Date.now()
      });
      const recipe = await ctx.db.get(args.recipeId);
      if (recipe) {
        await ctx.db.patch(args.recipeId, {
          favoriteCount: recipe.favoriteCount + 1
        });
      }
      return { isFavorited: true };
    }
  }
});

export const clearAllFavorites = mutation({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    
    for (const fav of favorites) {
      await ctx.db.delete(fav._id);
    }
    
    return { success: true, deletedCount: favorites.length };
  }
});
