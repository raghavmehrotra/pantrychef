"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { classifyIngredient, DEFAULT_UNIT } from "@/data/categories";
import { PANTRY_CATEGORIES, PantryCategory } from "@/types";

const UNITS = ["unit", "oz", "lb", "g", "kg", "cup", "tbsp", "tsp", "ml", "L"];

const CATEGORY_STYLE: Record<PantryCategory, { dot: string }> = {
  "meat":          { dot: "bg-red-400" },
  "vegetables":    { dot: "bg-olive" },
  "grains":        { dot: "bg-amber" },
  "spices & oils": { dot: "bg-ink-light" },
  "fruits":        { dot: "bg-orange-400" },
  "snacks":        { dot: "bg-violet-400" },
};

export default function GroceryListPage() {
  const { groceryList, addToGroceryList, updateGroceryItem, updateGroceryCategory, toggleGroceryItem, removeGroceryItem, clearGroceryList, movePurchasedToPantry } = useApp();
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<PantryCategory>("vegetables");
  const [movedCount, setMovedCount] = useState<number | null>(null);

  const grouped = PANTRY_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = groceryList.filter((item) => item.category === cat);
    return acc;
  }, {} as Record<PantryCategory, typeof groceryList>);

  const nonEmptyCategories = PANTRY_CATEGORIES.filter((cat) => grouped[cat].length > 0);
  const checkedCount = groceryList.filter((i) => i.checked).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.toLowerCase().trim();
    if (!trimmed) return;
    addToGroceryList(trimmed, 1, DEFAULT_UNIT[category], category);
    setInput("");
    setCategory("vegetables");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Grocery List</h1>
        {groceryList.length > 0 && (
          <p className="text-ink-muted text-sm mt-1">
            {checkedCount}/{groceryList.length} picked up
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCategory(classifyIngredient(e.target.value));
          }}
          placeholder="Add item..."
          className="flex-1 border border-amber-light/40 bg-cream rounded-lg px-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive"
        />
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PantryCategory)}
            className="border border-amber-light/40 bg-cream rounded-lg px-3 py-2 text-sm text-ink capitalize focus:outline-none focus:ring-2 focus:ring-olive"
          >
            {PANTRY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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

      {groceryList.length === 0 ? (
        <p className="text-ink-muted text-sm py-4">
          Your grocery list is empty. Add items above.
        </p>
      ) : (
        <>
          <div className="space-y-5">
            {nonEmptyCategories.map((cat) => {
              const items = grouped[cat];
              const style = CATEGORY_STYLE[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
                      {cat}
                    </h2>
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between group"
                      >
                        <label className="flex items-center gap-3 cursor-pointer py-1.5 flex-1">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleGroceryItem(item.name)}
                            className="w-4 h-4 rounded border-amber-light/60 text-olive focus:ring-olive accent-olive"
                          />
                          <span
                            className={`text-sm capitalize transition-colors ${
                              item.checked
                                ? "line-through text-ink-muted"
                                : "text-ink"
                            }`}
                          >
                            {item.name}
                          </span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0.25}
                            step={0.25}
                            value={item.qty}
                            onChange={(e) => updateGroceryItem(item.name, Number(e.target.value), item.unit)}
                            className="w-16 border border-amber-light/50 bg-cream rounded-md px-2 py-1 text-sm font-medium text-ink text-center focus:outline-none focus:ring-2 focus:ring-olive"
                          />
                          <select
                            value={item.unit}
                            onChange={(e) => updateGroceryItem(item.name, item.qty, e.target.value)}
                            className="border border-amber-light/50 bg-cream rounded-md px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
                          >
                            {UNITS.map((u) => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                          <select
                            value={item.category}
                            onChange={(e) => updateGroceryCategory(item.name, e.target.value as PantryCategory)}
                            className="border border-amber-light/50 bg-cream rounded-md px-1.5 py-1 text-xs text-ink-muted capitalize focus:outline-none focus:ring-2 focus:ring-olive"
                          >
                            {PANTRY_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => removeGroceryItem(item.name)}
                          className="text-ink-muted hover:text-red-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {checkedCount > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const count = movePurchasedToPantry();
                    setMovedCount(count);
                    setTimeout(() => setMovedCount(null), 2500);
                  }}
                  className="px-4 py-2 bg-amber text-cream text-sm font-medium rounded-lg hover:bg-amber-dark transition-colors"
                >
                  Add purchased items to pantry
                </button>
                {movedCount !== null && (
                  <span className="text-sm text-olive font-medium">
                    {movedCount} {movedCount === 1 ? "item" : "items"} added!
                  </span>
                )}
              </div>
            )}
            <button
              onClick={clearGroceryList}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear list
            </button>
          </div>
        </>
      )}
    </div>
  );
}
