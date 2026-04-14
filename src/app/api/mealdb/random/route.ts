import { getRandomMeal } from "@/lib/mealdb";

export async function GET() {
  const recipe = await getRandomMeal();
  if (!recipe) {
    return Response.json({ error: "No recipe found" }, { status: 404 });
  }
  return Response.json(recipe);
}
