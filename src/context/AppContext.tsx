"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MealLog, NutritionInfo } from "@/types";
import { recipes } from "@/data/recipes";

interface AppContextType {
  pantry: string[];
  addToPantry: (item: string) => void;
  removeFromPantry: (item: string) => void;
  clearPantry: () => void;
  mealLogs: MealLog[];
  logMeal: (recipeId: string, servings: number) => void;
  removeMealLog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pantry, setPantry] = useState<string[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  function addToPantry(item: string) {
    const normalized = item.toLowerCase().trim();
    if (normalized && !pantry.includes(normalized)) {
      setPantry((prev) => [...prev, normalized]);
    }
  }

  function removeFromPantry(item: string) {
    setPantry((prev) => prev.filter((i) => i !== item));
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
        addToPantry,
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
