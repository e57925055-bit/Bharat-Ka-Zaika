import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS Headers for external website access (Vercel etc)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

http.route({
  path: "/recipes",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { headers: corsHeaders });
  })
});

http.route({
  path: "/addRecipe",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { headers: corsHeaders });
  })
});

http.route({
  path: "/recipes",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const recipes = await ctx.runQuery(api.recipes.getAllRecipes);
    return new Response(JSON.stringify(recipes), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  })
});

http.route({
  path: "/addRecipe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.recipes.addRecipe, body);
    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  })
});

export default http;
