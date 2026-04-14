import { Recipe, RecipeIngredient } from "@/types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  [key: string]: string | null;
}

function transformMeal(meal: MealDBMeal): Recipe {
  const ingredients: RecipeIngredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim().toLowerCase(),
        amount: measure?.trim() || "to taste",
      });
    }
  }

  return {
    id: `mealdb-${meal.idMeal}`,
    name: meal.strMeal,
    description: `${meal.strArea} ${meal.strCategory}`.trim(),
    ingredients,
    instructions: meal.strInstructions
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    tags: meal.strTags?.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) ?? [],
    source: "mealdb",
    image: meal.strMealThumb,
    area: meal.strArea,
    mealCategory: meal.strCategory,
    mealdbId: meal.idMeal,
  };
}

export async function searchByName(query: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!data.meals) return [];
  return data.meals.map(transformMeal);
}

export async function searchByIngredient(ingredient: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
  const data = await res.json();
  if (!data.meals) return [];

  const meals = data.meals.slice(0, 10);
  const full = await Promise.all(
    meals.map(async (m: { idMeal: string }) => {
      const detail = await fetch(`${BASE_URL}/lookup.php?i=${m.idMeal}`);
      const d = await detail.json();
      return d.meals?.[0] ?? null;
    })
  );

  return full.filter(Boolean).map(transformMeal);
}

export async function getRandomMeal(): Promise<Recipe | null> {
  const res = await fetch(`${BASE_URL}/random.php`);
  const data = await res.json();
  if (!data.meals?.[0]) return null;
  return transformMeal(data.meals[0]);
}
