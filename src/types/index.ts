export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  nutrition: NutritionInfo;
  tags: string[];
}

export interface PantryItem {
  name: string;
  qty: number;
  unit: string;
}

export interface MealLog {
  id: string;
  recipeId: string;
  recipeName: string;
  servings: number;
  nutrition: NutritionInfo;
  date: string;
}
