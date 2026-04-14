"use client";

import { useState } from "react";
import { Recipe } from "@/types";
import { useApp } from "@/context/AppContext";
import RecipeCard from "./RecipeCard";

export default function DiscoverRecipes() {
  const { addRecipe, allRecipes } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/mealdb/search?q=${encodeURIComponent(query)}&type=name`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  async function handleRandom() {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/mealdb/random");
      const data = await res.json();
      if (data && !data.error) {
        setResults([data]);
      }
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  function isSaved(recipe: Recipe) {
    return allRecipes.some((r) => r.id === recipe.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-ink">Discover Recipes</h2>
        <button
          onClick={handleRandom}
          disabled={loading}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-amber/15 text-amber-dark hover:bg-amber/25 transition-colors disabled:opacity-50"
        >
          Random Recipe
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search TheMealDB (e.g. pasta, chicken)..."
          className="flex-1 border border-amber-light/40 bg-cream rounded-lg px-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-olive text-cream text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && (
        <p className="text-ink-muted text-sm text-center py-4">Loading...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-ink-muted text-sm text-center py-4">No recipes found. Try a different search.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard recipe={recipe} />
              {!isSaved(recipe) && (
                <div className="flex justify-end -mt-2 mb-2 pr-4">
                  <button
                    onClick={() => addRecipe(recipe)}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-olive/10 text-olive-dark hover:bg-olive/20 transition-colors"
                  >
                    Save to My Recipes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
