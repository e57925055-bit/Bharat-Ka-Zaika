import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recipes: defineTable({
    category: v.optional(v.string()),
    cookTime: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    emoji: v.optional(v.string()),
    favoriteCount: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    isUserSubmitted: v.optional(v.boolean()),
    name: v.string(),
    names: v.optional(v.any()),
    nutrition: v.optional(v.any()),
    prepTime: v.optional(v.string()),
    region: v.optional(v.string()),
    servings: v.optional(v.number()),
    stateEmoji: v.optional(v.string()),
    stateId: v.optional(v.string()),
    stateName: v.string(),
    steps: v.optional(v.array(v.any())),
    tips: v.optional(v.array(v.string())),
    type: v.optional(v.string()),
    viewCount: v.optional(v.number()),
    ingredients: v.array(v.string()),
    instructions: v.optional(v.string()),
  }).index("by_state", ["stateName"]),
});
