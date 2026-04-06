"use client";

import { useState } from "react";
import { recipes } from "@/data/recipes";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/RecipeCard";

type Filter = "all" | "ready" | "almost";

export default function RecipesPage() {
  const { pantry } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  const recipesWithMatch = recipes
    .map((recipe) => {
      const matchedCount = recipe.ingredients.filter((ing) =>
        pantry.includes(ing.name)
      ).length;
      return { recipe, matchedCount };
    })
    .sort((a, b) => {
      const aPct = a.matchedCount / a.recipe.ingredients.length;
      const bPct = b.matchedCount / b.recipe.ingredients.length;
      return bPct - aPct;
    });

  const filtered = recipesWithMatch.filter(({ recipe, matchedCount }) => {
    const pct = matchedCount / recipe.ingredients.length;
    if (filter === "ready") return pct === 1;
    if (filter === "almost") return pct >= 0.5;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Recipes" },
    { key: "ready", label: "Can Cook Now" },
    { key: "almost", label: "Almost There" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
        <p className="text-gray-500 mt-1">
          {pantry.length > 0
            ? "Sorted by how many ingredients you already have."
            : "Add ingredients to your pantry to see matching recipes."}
        </p>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          No recipes match this filter. Try adding more ingredients to your pantry.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ recipe, matchedCount }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              matchedCount={matchedCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
