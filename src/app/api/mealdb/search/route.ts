import { NextRequest } from "next/server";
import { searchByName, searchByIngredient } from "@/lib/mealdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const type = request.nextUrl.searchParams.get("type") ?? "name";

  if (!q.trim()) {
    return Response.json([]);
  }

  const results = type === "ingredient"
    ? await searchByIngredient(q)
    : await searchByName(q);

  return Response.json(results);
}
