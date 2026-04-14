import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAuthenticatedClient();
  const { data, error } = await supabase
    .from("meal_logs")
    .select("id, recipe_id, recipe_name, servings, date")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const logs = data.map((row: { id: string; recipe_id: string; recipe_name: string; servings: number; date: string }) => ({
    id: row.id,
    recipeId: row.recipe_id,
    recipeName: row.recipe_name,
    servings: row.servings,
    date: row.date,
  }));

  return Response.json(logs);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAuthenticatedClient();
  const log = await request.json();

  const { error } = await supabase.from("meal_logs").insert({
    user_id: userId,
    recipe_id: log.recipeId,
    recipe_name: log.recipeName,
    servings: log.servings,
    date: log.date,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAuthenticatedClient();
  const { id } = await request.json();

  const { error } = await supabase
    .from("meal_logs")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
