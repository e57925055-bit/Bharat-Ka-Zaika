import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAllRecipes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("recipes").collect();
  },
});

export const getRecipesByState = query({
  args: { stateName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recipes")
      .withIndex("by_state", (q) => q.eq("stateName", args.stateName))
      .collect();
  },
});
