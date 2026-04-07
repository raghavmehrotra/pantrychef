@AGENTS.md

This is a project that helps a user track their pantry ingredients, match them to recipes
and track macros from the meals they have consumed. It is meant to ensure that the user 
stays on track to achieve their nutritional goals, and push them to avoid wasting 
ingredients from their pantry.

There are 6 distinct pages/routes in the app:
- / --> welcome page with navigation cards to the main sections.
- /pantry --> this is meant to display the current state of the user's pantry. This is editable in that the user can add and remove ingredients from the pantry too. Items are categorized into 6 groups (meat, vegetables, grains, spices & oils, fruits, snacks) and support drag-and-drop recategorization.
- /recipes --> a list of recipes that the user can try. They are ranked in the order of how many ingredients the user already
has to make the recipe
- /recipes/:item --> this shows a list of recipes that contain :item. The route is dynamic.
- /grocerylist --> a simple todo-list style page for tracking items to buy, categorized the same way as the pantry.
- /tracker --> allows the user to log their meals and track their macros.

The style is meant to be minimal, yet inviting. Make sure the layout isn't boring. The focus should
be the actual content of the app.

In its current iteration, the app does not store state. This means that details are
lost upon app refresh.

Data model (defined in src/types/index.ts):
- Recipe { id, name, description, ingredients: RecipeIngredient[], instructions: string[], servings, prepTime, cookTime, nutrition: NutritionInfo, tags: string[] }
- RecipeIngredient { name, amount (string, e.g. "1 lb") }
- NutritionInfo { calories, protein, carbs, fat, fiber }
- PantryItem { name, qty, unit, category: PantryCategory }
- GroceryItem { name, qty, unit, category: PantryCategory, checked }
- MealLog { id, recipeId, recipeName, servings, nutrition: NutritionInfo, date }
- PantryCategory = "meat" | "vegetables" | "grains" | "spices, oils & sauces" | "fruits" | "snacks"

State is managed in src/context/AppContext.tsx (React context, no persistence).
10 seed recipes are defined in src/data/recipes.ts. User-created recipes are appended at runtime.
Ingredient classification (src/data/categories.ts) auto-assigns categories with keyword fallback.
Unit conversion (src/data/units.ts) handles weight (g/kg/oz/lb) and volume (ml/L/cup/tbsp/tsp).

Tech stack:
Next.js
Tailwind CSS