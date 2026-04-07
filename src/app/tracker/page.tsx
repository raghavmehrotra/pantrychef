"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { recipes } from "@/data/recipes";
import NutritionLabel from "@/components/NutritionLabel";

export default function TrackerPage() {
  const { mealLogs, logMeal, removeMealLog } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]?.id ?? "");
  const [servings, setServings] = useState(1);
  const [justLogged, setJustLogged] = useState(false);

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

  function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRecipe || servings <= 0) return;
    logMeal(selectedRecipe, servings);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Nutrition Tracker</h1>
        <p className="text-ink-muted mt-1">Log meals and track your daily macros.</p>
      </div>

      <div>
        <h2 className="font-serif text-lg font-semibold text-ink mb-3">
          Today&apos;s Summary
        </h2>
        {todayLogs.length === 0 ? (
          <p className="text-ink-muted text-sm">
            No meals logged today. Use the form below to get started.
          </p>
        ) : (
          <NutritionLabel nutrition={dailyTotals} />
        )}
      </div>

      <div>
        <h2 className="font-serif text-lg font-semibold text-ink mb-3">Log a Meal</h2>
        <form onSubmit={handleLog} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-ink-light mb-1">Recipe</label>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="w-full border border-amber-light/40 bg-cream rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
            >
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm text-ink-light mb-1">Servings</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full border border-amber-light/40 bg-cream rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-olive text-cream text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors"
          >
            {justLogged ? "Logged!" : "Log Meal"}
          </button>
        </form>
      </div>

      {todayLogs.length > 0 && (
        <div>
          <h2 className="font-serif text-lg font-semibold text-ink mb-3">
            Today&apos;s Meals
          </h2>
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border border-amber-light/40 rounded-lg p-3 bg-cream-dark"
              >
                <div>
                  <span className="font-medium text-ink">
                    {log.recipeName}
                  </span>
                  <span className="text-ink-muted text-sm ml-2">
                    x{log.servings} serving{log.servings !== 1 && "s"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-ink-muted">
                    {log.nutrition.calories} cal | {log.nutrition.protein}g protein
                  </span>
                  <button
                    onClick={() => removeMealLog(log.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
