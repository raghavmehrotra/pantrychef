"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function TrackerPage() {
  const { allRecipes, mealLogs, logMeal, removeMealLog } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState(allRecipes[0]?.id ?? "");
  const [servings, setServings] = useState(1);
  const [justLogged, setJustLogged] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = mealLogs.filter((log) => log.date === today);
  const olderLogs = mealLogs.filter((log) => log.date !== today);

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
        <h1 className="font-serif text-2xl font-bold text-ink">Meal Diary</h1>
        <p className="text-ink-muted mt-1">Log what you ate and when.</p>
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
              {allRecipes.map((r) => (
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
          <h2 className="font-serif text-lg font-semibold text-ink mb-3">Today</h2>
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border border-amber-light/40 rounded-lg p-3 bg-cream-dark"
              >
                <div>
                  <span className="font-medium text-ink">{log.recipeName}</span>
                  <span className="text-ink-muted text-sm ml-2">
                    x{log.servings} serving{log.servings !== 1 && "s"}
                  </span>
                </div>
                <button
                  onClick={() => removeMealLog(log.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {olderLogs.length > 0 && (
        <div>
          <h2 className="font-serif text-lg font-semibold text-ink mb-3">Earlier</h2>
          <div className="space-y-2">
            {olderLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border border-amber-light/40 rounded-lg p-3 bg-cream-dark"
              >
                <div>
                  <span className="font-medium text-ink">{log.recipeName}</span>
                  <span className="text-ink-muted text-sm ml-2">
                    x{log.servings} serving{log.servings !== 1 && "s"}
                  </span>
                  <span className="text-ink-muted text-xs ml-2">{log.date}</span>
                </div>
                <button
                  onClick={() => removeMealLog(log.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mealLogs.length === 0 && (
        <p className="text-ink-muted text-sm">No meals logged yet. Use the form above to get started.</p>
      )}
    </div>
  );
}
