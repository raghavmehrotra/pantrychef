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
        <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
        <p className="text-gray-500 mt-1">Log meals and track your daily macros.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Today&apos;s Summary
        </h2>
        {todayLogs.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No meals logged today. Use the form below to get started.
          </p>
        ) : (
          <NutritionLabel nutrition={dailyTotals} />
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Log a Meal</h2>
        <form onSubmit={handleLog} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Recipe</label>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm text-gray-600 mb-1">Servings</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {justLogged ? "Logged!" : "Log Meal"}
          </button>
        </form>
      </div>

      {todayLogs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Today&apos;s Meals
          </h2>
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border rounded-lg p-3 bg-white"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {log.recipeName}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    x{log.servings} serving{log.servings !== 1 && "s"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {log.nutrition.calories} cal | {log.nutrition.protein}g protein
                  </span>
                  <button
                    onClick={() => removeMealLog(log.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
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
