# PantryChef

A pantry-first recipe and nutrition app. Track what ingredients you have, find recipes that match, manage a grocery list, and log meals to stay on top of your macros.

Built for the Design Build Ship course at UChicago.

## Features

- **Pantry** — Add ingredients with quantities and units. Items are auto-categorized into 6 groups (meat, vegetables, grains, spices/oils/sauces, fruits, snacks) and can be recategorized via drag-and-drop.
- **Recipes** — 10 built-in recipes ranked by how many ingredients you already have. Search by ingredient, filter by readiness, and create your own recipes.
- **Grocery List** — Todo-list style page for tracking what to buy. Click "Add ingredients to cart" on any recipe to auto-populate the list, accounting for what you already have in the pantry. Check off purchased items and move them to the pantry in one click.
- **Nutrition Tracker** — Log meals from any recipe and track daily calories, protein, carbs, fat, and fiber.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Tech Stack

- Next.js 16
- Tailwind CSS 4
- React Context for state management (no persistence — state resets on refresh)

## Project Structure

```
src/
  app/             # Pages: /, /pantry, /recipes, /recipes/[name], /grocerylist, /tracker
  components/      # Navbar, RecipeCard, NutritionLabel, IngredientTag
  context/         # AppContext (pantry, grocery list, recipes, meal logs)
  data/            # Seed recipes, ingredient categories, unit conversions
  types/           # TypeScript interfaces (Recipe, PantryItem, GroceryItem, MealLog)
```
