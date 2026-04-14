import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("user_recipes")
    .select("recipe_id, data")
    .eq("user_id", userId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const recipes = data.map((row: { recipe_id: string; data: Recipe }) => row.data);
  return Response.json(recipes);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const recipe: Recipe = await request.json();

  const { error } = await supabase.from("user_recipes").upsert(
    { user_id: userId, recipe_id: recipe.id, data: recipe },
    { onConflict: "user_id,recipe_id" }
  );

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeId } = await request.json();

  const { error } = await supabase
    .from("user_recipes")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_id", recipeId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
