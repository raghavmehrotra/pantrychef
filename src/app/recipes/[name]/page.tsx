"use client";

import { use } from "react";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/RecipeCard";

export default function IngredientPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const ingredientName = decodeURIComponent(name);
  const { pantryNames, allRecipes, addToPantry, removeFromPantry } = useApp();

  const isInPantry = pantryNames.includes(ingredientName);

  const matchingRecipes = allRecipes.filter((recipe) =>
    recipe.ingredients.some((ing) => ing.name === ingredientName)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">
          Recipes with{" "}
          <span className="text-olive">{ingredientName}</span>
        </h1>
        <p className="text-ink-muted mt-1">
          {matchingRecipes.length} recipe{matchingRecipes.length !== 1 && "s"}{" "}
          use this ingredient.
        </p>
      </div>

      <button
        onClick={() =>
          isInPantry
            ? removeFromPantry(ingredientName)
            : addToPantry(ingredientName, 1, "unit")
        }
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isInPantry
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-olive/10 text-olive-dark hover:bg-olive/20"
        }`}
      >
        {isInPantry
          ? "Remove from Pantry"
          : "Add to Pantry"}
      </button>

      {matchingRecipes.length === 0 ? (
        <p className="text-ink-muted text-sm py-8 text-center">
          No recipes found with this ingredient.
        </p>
      ) : (
        <div className="space-y-4">
          {matchingRecipes.map((recipe) => {
            const matchedCount = recipe.ingredients.filter((ing) =>
              pantryNames.includes(ing.name)
            ).length;
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchedCount={matchedCount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
