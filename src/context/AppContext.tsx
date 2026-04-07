"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MealLog, NutritionInfo, PantryItem } from "@/types";
import { recipes } from "@/data/recipes";

interface AppContextType {
  pantry: PantryItem[];
  pantryNames: string[];
  addToPantry: (name: string, qty: number, unit: string) => void;
  updatePantryItem: (name: string, qty: number, unit: string) => void;
  removeFromPantry: (name: string) => void;
  clearPantry: () => void;
  mealLogs: MealLog[];
  logMeal: (recipeId: string, servings: number) => void;
  removeMealLog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  const pantryNames = pantry.map((item) => item.name);

  function addToPantry(name: string, qty: number = 1, unit: string = "unit") {
    const normalized = name.toLowerCase().trim();
    if (!normalized) return;
    const existing = pantry.find((i) => i.name === normalized);
    if (existing) {
      setPantry((prev) =>
        prev.map((i) =>
          i.name === normalized ? { ...i, qty: i.qty + qty } : i
        )
      );
    } else {
      setPantry((prev) => [...prev, { name: normalized, qty, unit }]);
    }
  }

  function updatePantryItem(name: string, qty: number, unit: string) {
    setPantry((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty, unit } : i))
    );
  }

  function removeFromPantry(name: string) {
    setPantry((prev) => prev.filter((i) => i.name !== name));
  }

  function clearPantry() {
    setPantry([]);
  }

  function logMeal(recipeId: string, servings: number) {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const nutrition: NutritionInfo = {
      calories: Math.round(recipe.nutrition.calories * servings),
      protein: Math.round(recipe.nutrition.protein * servings),
      carbs: Math.round(recipe.nutrition.carbs * servings),
      fat: Math.round(recipe.nutrition.fat * servings),
      fiber: Math.round(recipe.nutrition.fiber * servings),
    };

    const log: MealLog = {
      id: Date.now().toString(),
      recipeId,
      recipeName: recipe.name,
      servings,
      nutrition,
      date: new Date().toISOString().split("T")[0],
    };

    setMealLogs((prev) => [...prev, log]);
  }

  function removeMealLog(id: string) {
    setMealLogs((prev) => prev.filter((log) => log.id !== id));
  }

  return (
    <AppContext.Provider
      value={{
        pantry,
        pantryNames,
        addToPantry,
        updatePantryItem,
        removeFromPantry,
        clearPantry,
        mealLogs,
        logMeal,
        removeMealLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
