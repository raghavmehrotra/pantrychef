"use client";

import { useState } from "react";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import NutritionLabel from "./NutritionLabel";
import Link from "next/link";

interface RecipeCardProps {
  recipe: Recipe;
  matchedCount?: number;
}

export default function RecipeCard({ recipe, matchedCount }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { logMeal } = useApp();
  const [servings, setServings] = useState(1);
  const [logged, setLogged] = useState(false);

  const totalIngredients = recipe.ingredients.length;
  const matchPercent = matchedCount !== undefined
    ? Math.round((matchedCount / totalIngredients) * 100)
    : null;

  function handleLog() {
    logMeal(recipe.id, servings);
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
  }

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        matchPercent === 100
          ? "border-olive bg-olive/5"
          : "border-amber-light/40 bg-cream-dark"
      }`}
    >
      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-ink">{recipe.name}</h3>
            <p className="text-sm text-ink-muted mt-1">{recipe.description}</p>
          </div>
          {matchPercent !== null && (
            <span
              className={`shrink-0 ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                matchPercent === 100
                  ? "bg-olive/15 text-olive-dark"
                  : matchPercent >= 50
                  ? "bg-amber-light/30 text-amber-dark"
                  : "bg-cream text-ink-muted"
              }`}
            >
              {matchedCount}/{totalIngredients} ingredients
            </span>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-ink-muted">
          <span>Prep: {recipe.prepTime}m</span>
          <span>Cook: {recipe.cookTime}m</span>
          <span>{recipe.nutrition.calories} cal/serving</span>
        </div>
        {matchPercent === 100 && (
          <div className="mt-2 text-xs font-medium text-olive">
            Ready to cook!
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-4 border-t border-amber-light/30 pt-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-ink-light mb-2">Ingredients</h4>
            <ul className="text-sm text-ink-light space-y-1">
              {recipe.ingredients.map((ing) => (
                <li key={ing.name} className="flex justify-between">
                  <Link
                    href={`/recipes/${encodeURIComponent(ing.name)}`}
                    className="text-olive hover:underline"
                  >
                    {ing.name}
                  </Link>
                  <span className="text-ink-muted">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-light mb-2">Instructions</h4>
            <ol className="text-sm text-ink-light space-y-1 list-decimal list-inside">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-light mb-2">
              Nutrition (per serving)
            </h4>
            <NutritionLabel nutrition={recipe.nutrition} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="text-sm text-ink-light">Servings:</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-20 border border-amber-light/40 rounded-md px-2 py-1 text-sm bg-cream text-ink"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLog();
              }}
              className="px-4 py-1.5 bg-olive text-cream text-sm rounded-md hover:bg-olive-dark transition-colors"
            >
              {logged ? "Logged!" : "Log This Meal"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
