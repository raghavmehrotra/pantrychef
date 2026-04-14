"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GroceryItem, MealLog, PantryCategory, PantryItem } from "@/types";
import { recipes } from "@/data/recipes";
import { classifyIngredient } from "@/data/categories";
import { convertUnits, parseAmount } from "@/data/units";
import { Recipe } from "@/types";

interface AppContextType {
  pantry: PantryItem[];
  pantryNames: string[];
  addToPantry: (name: string, qty: number, unit: string, category?: PantryCategory) => void;
  updatePantryItem: (name: string, qty: number, unit: string) => void;
  updatePantryCategory: (name: string, category: PantryCategory) => void;
  removeFromPantry: (name: string) => void;
  clearPantry: () => void;
  groceryList: GroceryItem[];
  addToGroceryList: (name: string, qty?: number, unit?: string, category?: PantryCategory) => void;
  addRecipeToGroceryList: (recipe: Recipe) => number;
  updateGroceryItem: (name: string, qty: number, unit: string) => void;
  updateGroceryCategory: (name: string, category: PantryCategory) => void;
  toggleGroceryItem: (name: string) => void;
  removeGroceryItem: (name: string) => void;
  clearGroceryList: () => void;
  movePurchasedToPantry: () => number;
  allRecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  mealLogs: MealLog[];
  logMeal: (recipeId: string, servings: number) => void;
  removeMealLog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(recipes);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  const pantryNames = pantry.map((item) => item.name);

  function addToPantry(name: string, qty: number = 1, unit: string = "unit", category?: PantryCategory) {
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
      setPantry((prev) => [...prev, { name: normalized, qty, unit, category: category ?? classifyIngredient(normalized) }]);
    }
  }

  function updatePantryItem(name: string, qty: number, unit: string) {
    setPantry((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty, unit } : i))
    );
  }

  function updatePantryCategory(name: string, category: PantryCategory) {
    setPantry((prev) =>
      prev.map((i) => (i.name === name ? { ...i, category } : i))
    );
  }

  function removeFromPantry(name: string) {
    setPantry((prev) => prev.filter((i) => i.name !== name));
  }

  function clearPantry() {
    setPantry([]);
  }

  function addToGroceryList(name: string, qty: number = 1, unit: string = "unit", category?: PantryCategory) {
    const normalized = name.toLowerCase().trim();
    if (!normalized) return;
    const existing = groceryList.find((i) => i.name === normalized);
    if (existing) {
      setGroceryList((prev) =>
        prev.map((i) =>
          i.name === normalized ? { ...i, qty: i.qty + qty, checked: false } : i
        )
      );
    } else {
      setGroceryList((prev) => [...prev, { name: normalized, qty, unit, category: category ?? classifyIngredient(normalized), checked: false }]);
    }
  }

  function addRecipeToGroceryList(recipe: Recipe): number {
    let added = 0;
    for (const ing of recipe.ingredients) {
      const name = ing.name.toLowerCase().trim();
      const parsed = parseAmount(ing.amount);
      const neededQty = parsed?.qty ?? 1;
      const neededUnit = parsed?.unit ?? "unit";

      // Check if pantry already has this ingredient
      const pantryItem = pantry.find((p) => p.name === name);
      if (pantryItem) {
        // Try to convert pantry qty to the recipe's unit
        const converted = convertUnits(pantryItem.qty, pantryItem.unit, neededUnit);
        const pantryQtyInRecipeUnit = converted !== null ? converted : (pantryItem.unit === neededUnit ? pantryItem.qty : 0);
        const deficit = neededQty - pantryQtyInRecipeUnit;
        if (deficit <= 0) continue; // pantry has enough
        addToGroceryList(name, Math.round(deficit * 100) / 100, neededUnit);
      } else {
        addToGroceryList(name, neededQty, neededUnit);
      }
      added++;
    }
    return added;
  }

  function updateGroceryItem(name: string, qty: number, unit: string) {
    setGroceryList((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty, unit } : i))
    );
  }

  function updateGroceryCategory(name: string, category: PantryCategory) {
    setGroceryList((prev) =>
      prev.map((i) => (i.name === name ? { ...i, category } : i))
    );
  }

  function toggleGroceryItem(name: string) {
    setGroceryList((prev) =>
      prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i))
    );
  }

  function removeGroceryItem(name: string) {
    setGroceryList((prev) => prev.filter((i) => i.name !== name));
  }

  function clearGroceryList() {
    setGroceryList([]);
  }

  function movePurchasedToPantry(): number {
    const checked = groceryList.filter((i) => i.checked);
    if (checked.length === 0) return 0;
    for (const item of checked) {
      addToPantry(item.name, item.qty, item.unit, item.category);
    }
    setGroceryList((prev) => prev.filter((i) => !i.checked));
    return checked.length;
  }

  function addRecipe(recipe: Recipe) {
    setAllRecipes((prev) => [...prev, recipe]);
  }

  function logMeal(recipeId: string, servings: number) {
    const recipe = allRecipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const log: MealLog = {
      id: Date.now().toString(),
      recipeId,
      recipeName: recipe.name,
      servings,
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
        updatePantryCategory,
        removeFromPantry,
        clearPantry,
        groceryList,
        addToGroceryList,
        addRecipeToGroceryList,
        updateGroceryItem,
        updateGroceryCategory,
        toggleGroceryItem,
        removeGroceryItem,
        clearGroceryList,
        movePurchasedToPantry,
        allRecipes,
        addRecipe,
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
