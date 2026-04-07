"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { allIngredientNames } from "@/data/recipes";
import Link from "next/link";

const UNITS = ["unit", "oz", "lb", "g", "kg", "cup", "tbsp", "tsp", "ml", "L"];

export default function PantryPage() {
  const { pantry, pantryNames, addToPantry, updatePantryItem, removeFromPantry, clearPantry } = useApp();
  const [input, setInput] = useState("");
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("unit");
  const [error, setError] = useState("");

  const suggestions = allIngredientNames.filter(
    (name) => !pantryNames.includes(name)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.toLowerCase().trim();
    if (!trimmed) {
      setError("Please enter an ingredient.");
      return;
    }
    if (qty <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    addToPantry(trimmed, qty, unit);
    setInput("");
    setQty(1);
    setUnit("unit");
    setError("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">My Pantry</h1>
        <p className="text-ink-muted mt-1">
          Add ingredients you have on hand to find matching recipes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Ingredient name..."
          className="flex-1 border border-amber-light/40 bg-cream rounded-lg px-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive"
        />
        <div className="flex gap-2">
          <input
            type="number"
            min={0.25}
            step={0.25}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 border border-amber-light/40 bg-cream rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-amber-light/40 bg-cream rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2 bg-olive text-cream text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors"
          >
            Add
          </button>
        </div>
      </form>
      {error && <p className="text-red-600 text-sm -mt-6">{error}</p>}

      {suggestions.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-ink-muted mb-2">
            Quick add from recipes
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => addToPantry(name, 1, "unit")}
                className="px-3 py-1 rounded-full bg-cream-dark text-ink-light text-sm hover:bg-olive/10 hover:text-olive-dark transition-colors"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Your Pantry ({pantry.length} {pantry.length === 1 ? "item" : "items"})
          </h2>
          {pantry.length > 0 && (
            <button
              onClick={clearPantry}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          )}
        </div>
        {pantry.length === 0 ? (
          <p className="text-ink-muted text-sm">
            No ingredients yet. Add some above to get started!
          </p>
        ) : (
          <div className="border border-amber-light/40 rounded-xl overflow-hidden">
            {pantry.map((item, i) => (
              <div
                key={item.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== pantry.length - 1 ? "border-b border-amber-light/30" : ""
                } bg-cream-dark hover:bg-amber-light/10 transition-colors`}
              >
                <Link
                  href={`/recipes/${encodeURIComponent(item.name)}`}
                  className="text-ink font-medium hover:text-olive transition-colors capitalize"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0.25}
                      step={0.25}
                      value={item.qty}
                      onChange={(e) =>
                        updatePantryItem(item.name, Number(e.target.value), item.unit)
                      }
                      className="w-16 border border-amber-light/40 bg-cream rounded px-2 py-1 text-sm text-ink text-center focus:outline-none focus:ring-1 focus:ring-olive"
                    />
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        updatePantryItem(item.name, item.qty, e.target.value)
                      }
                      className="border border-amber-light/40 bg-cream rounded px-2 py-1 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-olive"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeFromPantry(item.name)}
                    className="text-ink-muted hover:text-red-600 transition-colors p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
