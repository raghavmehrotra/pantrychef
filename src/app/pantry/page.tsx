"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { allIngredientNames } from "@/data/recipes";
import IngredientTag from "@/components/IngredientTag";

export default function PantryPage() {
  const { pantry, addToPantry, removeFromPantry, clearPantry } = useApp();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const suggestions = allIngredientNames.filter(
    (name) => !pantry.includes(name)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.toLowerCase().trim();
    if (!trimmed) {
      setError("Please enter an ingredient.");
      return;
    }
    if (pantry.includes(trimmed)) {
      setError("Already in your pantry.");
      return;
    }
    addToPantry(trimmed);
    setInput("");
    setError("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Pantry</h1>
        <p className="text-gray-500 mt-1">
          Add ingredients you have on hand to find matching recipes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Add an ingredient..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-500 text-sm -mt-6">{error}</p>}

      {suggestions.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Quick add from recipes
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => addToPantry(name)}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Pantry ({pantry.length} items)
          </h2>
          {pantry.length > 0 && (
            <button
              onClick={clearPantry}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
        {pantry.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No ingredients yet. Add some above to get started!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pantry.map((item) => (
              <IngredientTag
                key={item}
                name={item}
                linked
                onRemove={() => removeFromPantry(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
