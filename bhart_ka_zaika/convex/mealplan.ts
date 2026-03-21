import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getUserMealPlans = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => q.eq("deviceId", args.deviceId))
      .collect();
  }
});

export const getMealPlanByDate = query({
  args: { deviceId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.date)
      )
      .collect();
    return plans[0] || null;
  }
});

export const getMealPlanWithRecipes = query({
  args: { deviceId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.date)
      )
      .collect();
    
    const plan = plans[0];
    if (!plan) return null;
    
    const { breakfast, lunch, dinner } = plan.meals;
    
    const breakfastRecipe = breakfast ? await ctx.db.get(breakfast as any) : null;
    const lunchRecipe = lunch ? await ctx.db.get(lunch as any) : null;
    const dinnerRecipe = dinner ? await ctx.db.get(dinner as any) : null;
    
    return {
      ...plan,
      recipes: {
        breakfast: breakfastRecipe,
        lunch: lunchRecipe,
        dinner: dinnerRecipe
      }
    };
  }
});

export const getWeeklyMealPlan = query({
  args: { deviceId: v.string(), startDate: v.string() },
  handler: async (ctx, args) => {
    const start = new Date(args.startDate);
    const week = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const plans = await ctx.db
        .query("mealPlans")
        .withIndex("by_device_date", (q) => 
          q.eq("deviceId", args.deviceId).eq("date", dateStr)
        )
        .collect();
      
      week.push({
        date: dateStr,
        plan: plans[0] || null
      });
    }
    
    return week;
  }
});

export const setMealPlan = mutation({
  args: {
    deviceId: v.string(),
    date: v.string(),
    meals: v.object({
      breakfast: v.optional(v.id("recipes")),
      lunch: v.optional(v.id("recipes")),
      dinner: v.optional(v.id("recipes"))
    })
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.date)
      )
      .collect();
    
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, { meals: args.meals });
      return { success: true, mealPlanId: existing[0]._id, updated: true };
    }
    
    const id = await ctx.db.insert("mealPlans", {
      deviceId: args.deviceId,
      date: args.date,
      meals: args.meals
    });
    
    return { success: true, mealPlanId: id, updated: false };
  }
});

export const addMealToPlan = mutation({
  args: {
    deviceId: v.string(),
    date: v.string(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
    recipeId: v.id("recipes")
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.date)
      )
      .collect();
    
    if (existing.length > 0) {
      const currentMeals = existing[0].meals;
      const updatedMeals = {
        ...currentMeals,
        [args.mealType]: args.recipeId
      };
      await ctx.db.patch(existing[0]._id, { meals: updatedMeals });
      return { success: true, mealPlanId: existing[0]._id };
    }
    
    const meals = {
      breakfast: undefined as any,
      lunch: undefined as any,
      dinner: undefined as any,
      [args.mealType]: args.recipeId
    };
    
    const id = await ctx.db.insert("mealPlans", {
      deviceId: args.deviceId,
      date: args.date,
      meals
    });
    
    return { success: true, mealPlanId: id };
  }
});

export const removeMealFromPlan = mutation({
  args: {
    deviceId: v.string(),
    date: v.string(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    )
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.date)
      )
      .collect();
    
    if (existing.length === 0) {
      return { success: false, message: "No meal plan found" };
    }
    
    const currentMeals = existing[0].meals;
    const updatedMeals = { ...currentMeals };
    delete updatedMeals[args.mealType];
    
    await ctx.db.patch(existing[0]._id, { meals: updatedMeals });
    return { success: true };
  }
});

export const clearMealPlan = mutation({
  args: { deviceId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.date)
      )
      .collect();
    
    if (existing.length === 0) {
      return { success: false, message: "No meal plan found" };
    }
    
    await ctx.db.delete(existing[0]._id);
    return { success: true };
  }
});

export const copyMealPlan = mutation({
  args: {
    deviceId: v.string(),
    fromDate: v.string(),
    toDate: v.string()
  },
  handler: async (ctx, args) => {
    const source = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.fromDate)
      )
      .collect();
    
    if (source.length === 0) {
      return { success: false, message: "No source meal plan found" };
    }
    
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_device_date", (q) => 
        q.eq("deviceId", args.deviceId).eq("date", args.toDate)
      )
      .collect();
    
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, { meals: source[0].meals });
      return { success: true, mealPlanId: existing[0]._id };
    }
    
    const id = await ctx.db.insert("mealPlans", {
      deviceId: args.deviceId,
      date: args.toDate,
      meals: source[0].meals
    });
    
    return { success: true, mealPlanId: id };
  }
});

export const generateWeeklyPlan = mutation({
  args: {
    deviceId: v.string(),
    startDate: v.string(),
    preferences: v.optional(v.object({
      vegetarianOnly: v.optional(v.boolean()),
      maxCaloriesPerDay: v.optional(v.number()),
      avoidIngredients: v.optional(v.array(v.string()))
    }))
  },
  handler: async (ctx, args) => {
    const allRecipes = await ctx.db.query("recipes").collect();
    
    let filteredRecipes = allRecipes;
    if (args.preferences?.vegetarianOnly) {
      filteredRecipes = allRecipes.filter(r => r.type === "Vegetarian");
    }
    
    const start = new Date(args.startDate);
    const results = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const shuffled = [...filteredRecipes].sort(() => Math.random() - 0.5);
      
      const breakfast = shuffled.find(r => r.category === "breakfast");
      const lunch = shuffled.find(r => r.category === "lunch");
      const dinner = shuffled.find(r => r.category === "dinner");
      
      const existing = await ctx.db
        .query("mealPlans")
        .withIndex("by_device_date", (q) => 
          q.eq("deviceId", args.deviceId).eq("date", dateStr)
        )
        .collect();
      
      const meals = {
        breakfast: breakfast?._id,
        lunch: lunch?._id,
        dinner: dinner?._id
      };
      
      if (existing.length > 0) {
        await ctx.db.patch(existing[0]._id, { meals });
      } else {
        await ctx.db.insert("mealPlans", {
          deviceId: args.deviceId,
          date: dateStr,
          meals
        });
      }
      
      results.push({ date: dateStr, meals });
    }
    
    return { success: true, weekPlan: results };
  }
});
