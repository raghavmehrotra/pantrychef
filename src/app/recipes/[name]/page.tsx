"use client";

import { use } from "react";
import { recipes } from "@/data/recipes";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/RecipeCard";

export default function IngredientPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const ingredientName = decodeURIComponent(name);
  const { pantry, addToPantry, removeFromPantry } = useApp();

  const isInPantry = pantry.includes(ingredientName);

  const matchingRecipes = recipes.filter((recipe) =>
    recipe.ingredients.some((ing) => ing.name === ingredientName)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Recipes with{" "}
          <span className="text-emerald-700">{ingredientName}</span>
        </h1>
        <p className="text-gray-500 mt-1">
          {matchingRecipes.length} recipe{matchingRecipes.length !== 1 && "s"}{" "}
          use this ingredient.
        </p>
      </div>

      <button
        onClick={() =>
          isInPantry
            ? removeFromPantry(ingredientName)
            : addToPantry(ingredientName)
        }
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isInPantry
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        }`}
      >
        {isInPantry
          ? "Remove from Pantry"
          : "Add to Pantry"}
      </button>

      {matchingRecipes.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          No recipes found with this ingredient.
        </p>
      ) : (
        <div className="space-y-4">
          {matchingRecipes.map((recipe) => {
            const matchedCount = recipe.ingredients.filter((ing) =>
              pantry.includes(ing.name)
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
