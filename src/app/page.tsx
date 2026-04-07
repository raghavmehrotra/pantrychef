"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { recipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import NutritionLabel from "@/components/NutritionLabel";

export default function HomePage() {
  const { pantry, pantryNames, mealLogs } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = mealLogs.filter((log) => log.date === today);

  const dailyTotals = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.nutrition.calories,
      protein: acc.protein + log.nutrition.protein,
      carbs: acc.carbs + log.nutrition.carbs,
      fat: acc.fat + log.nutrition.fat,
      fiber: acc.fiber + log.nutrition.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const topRecipes = recipes
    .map((recipe) => {
      const matchedCount = recipe.ingredients.filter((ing) =>
        pantryNames.includes(ing.name)
      ).length;
      return { recipe, matchedCount };
    })
    .sort((a, b) => {
      const aPct = a.matchedCount / a.recipe.ingredients.length;
      const bPct = b.matchedCount / b.recipe.ingredients.length;
      return bPct - aPct;
    })
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="text-center py-8">
        <h1 className="font-serif text-4xl font-bold text-ink">
          What&apos;s in your pantry?
        </h1>
        <p className="text-lg text-ink-muted mt-2">
          Let&apos;s find something to cook.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/pantry"
          className="block p-6 bg-cream-dark rounded-xl border border-amber-light/40 hover:border-amber transition-colors"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">Pantry</h2>
          <p className="text-3xl font-bold text-olive mt-2">
            {pantryNames.length}
          </p>
          <p className="text-sm text-ink-muted mt-1">
            {pantryNames.length === 0
              ? "Add ingredients to get started"
              : "ingredients on hand"}
          </p>
        </Link>

        <Link
          href="/recipes"
          className="block p-6 bg-cream-dark rounded-xl border border-amber-light/40 hover:border-amber transition-colors"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">Recipes</h2>
          <p className="text-3xl font-bold text-olive mt-2">
            {recipes.length}
          </p>
          <p className="text-sm text-ink-muted mt-1">recipes available</p>
        </Link>

        <Link
          href="/tracker"
          className="block p-6 bg-cream-dark rounded-xl border border-amber-light/40 hover:border-amber transition-colors"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">Today</h2>
          <p className="text-3xl font-bold text-olive mt-2">
            {todayLogs.length}
          </p>
          <p className="text-sm text-ink-muted mt-1">
            {todayLogs.length === 0
              ? "No meals logged yet"
              : `meals logged (${dailyTotals.calories} cal)`}
          </p>
        </Link>
      </div>

      {todayLogs.length > 0 && (
        <div>
          <h2 className="font-serif text-lg font-semibold text-ink mb-3">
            Today&apos;s Nutrition
          </h2>
          <NutritionLabel nutrition={dailyTotals} />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-ink">
            {pantryNames.length > 0 ? "Top Recipe Matches" : "Featured Recipes"}
          </h2>
          <Link
            href="/recipes"
            className="text-sm text-olive hover:text-olive-dark"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {topRecipes.map(({ recipe, matchedCount }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              matchedCount={matchedCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
