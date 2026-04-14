"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { PantryItem, GroceryItem, Recipe, MealLog } from "@/types";

interface SyncState {
  pantry: PantryItem[];
  groceryList: GroceryItem[];
  userRecipes: Recipe[];
  mealLogs: MealLog[];
}

interface SyncSetters {
  setPantry: (items: PantryItem[]) => void;
  setGroceryList: (items: GroceryItem[]) => void;
  setUserRecipes: (recipes: Recipe[]) => void;
  setMealLogs: (logs: MealLog[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useSupabaseSync(state: SyncState, setters: SyncSetters) {
  const { isSignedIn } = useAuth();
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Load all user data from Supabase when they sign in
  const loadData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setters.setIsLoading(true);

    try {
      const [pantryRes, groceryRes, recipesRes, mealsRes] = await Promise.all([
        fetch("/api/pantry"),
        fetch("/api/grocery"),
        fetch("/api/recipes"),
        fetch("/api/meals"),
      ]);

      if (pantryRes.ok) setters.setPantry(await pantryRes.json());
      if (groceryRes.ok) setters.setGroceryList(await groceryRes.json());
      if (recipesRes.ok) setters.setUserRecipes(await recipesRes.json());
      if (mealsRes.ok) setters.setMealLogs(await mealsRes.json());
    } catch (err) {
      console.error("Failed to load data from Supabase:", err);
    }

    setters.setIsLoading(false);
    isLoadingRef.current = false;
  }, [setters]);

  // Trigger load when user signs in
  useEffect(() => {
    if (isSignedIn && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadData();
    }
    if (!isSignedIn) {
      hasLoadedRef.current = false;
    }
  }, [isSignedIn, loadData]);

  // Debounce helper — waits 500ms after last change before saving
  const debouncedSave = useCallback(
    (key: string, saveFn: () => Promise<void>) => {
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }
      debounceTimers.current[key] = setTimeout(() => {
        saveFn().catch((err) => console.error(`Failed to save ${key}:`, err));
      }, 500);
    },
    []
  );

  // Auto-save pantry when it changes
  useEffect(() => {
    if (!isSignedIn || !hasLoadedRef.current) return;
    debouncedSave("pantry", () =>
      fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.pantry),
      }).then(() => {})
    );
  }, [state.pantry, isSignedIn, debouncedSave]);

  // Auto-save grocery list when it changes
  useEffect(() => {
    if (!isSignedIn || !hasLoadedRef.current) return;
    debouncedSave("grocery", () =>
      fetch("/api/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.groceryList),
      }).then(() => {})
    );
  }, [state.groceryList, isSignedIn, debouncedSave]);

  // Auto-save user recipes when they change
  useEffect(() => {
    if (!isSignedIn || !hasLoadedRef.current) return;
    debouncedSave("recipes", async () => {
      for (const recipe of state.userRecipes) {
        await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        });
      }
    });
  }, [state.userRecipes, isSignedIn, debouncedSave]);
}
