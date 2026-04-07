"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { allIngredientNames } from "@/data/recipes";
import { classifyIngredient, DEFAULT_UNIT } from "@/data/categories";
import { PANTRY_CATEGORIES, PantryCategory } from "@/types";
import Link from "next/link";

const UNITS = ["unit", "oz", "lb", "g", "kg", "cup", "tbsp", "tsp", "ml", "L"];

const CATEGORY_STYLE: Record<PantryCategory, { border: string; heading: string; bg: string }> = {
  "meat":          { border: "border-t-red-400",    heading: "text-red-700",     bg: "bg-red-50" },
  "vegetables":    { border: "border-t-olive",      heading: "text-olive-dark",  bg: "bg-olive/5" },
  "grains":        { border: "border-t-amber",      heading: "text-amber-dark",  bg: "bg-amber-light/15" },
  "spices, oils & sauces": { border: "border-t-ink-light",  heading: "text-ink-light",   bg: "bg-ink/5" },
  "fruits":        { border: "border-t-orange-400",  heading: "text-orange-700",  bg: "bg-orange-50" },
  "snacks":        { border: "border-t-violet-400", heading: "text-violet-700",  bg: "bg-violet-50" },
};

export default function PantryPage() {
  const { pantry, pantryNames, addToPantry, updatePantryItem, updatePantryCategory, removeFromPantry, clearPantry } = useApp();
  const [input, setInput] = useState("");
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("unit");
  const [category, setCategory] = useState<PantryCategory>("vegetables");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<PantryCategory | null>(null);

  const suggestions = allIngredientNames.filter(
    (name) => !pantryNames.includes(name)
  );

  const grouped = PANTRY_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = pantry.filter((item) => item.category === cat);
    return acc;
  }, {} as Record<PantryCategory, typeof pantry>);


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
    addToPantry(trimmed, qty, unit, category);
    setInput("");
    setQty(1);
    setCategory("vegetables");
    setUnit(DEFAULT_UNIT["vegetables"]);
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
            const val = e.target.value;
            setInput(val);
            const cat = classifyIngredient(val);
            setCategory(cat);
            setUnit(DEFAULT_UNIT[cat]);
            setError("");
          }}
          placeholder="Ingredient name..."
          className="flex-1 border border-amber-light/40 bg-cream rounded-lg px-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive"
        />
        <div className="flex flex-wrap gap-2">
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
          <select
            value={category}
            onChange={(e) => {
              const cat = e.target.value as PantryCategory;
              setCategory(cat);
              setUnit(DEFAULT_UNIT[cat]);
            }}
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
                onClick={() => { const cat = classifyIngredient(name); addToPantry(name, 1, DEFAULT_UNIT[cat], cat); }}
                className="px-3 py-1 rounded-full bg-cream-dark text-ink-light text-sm hover:bg-olive/10 hover:text-olive-dark transition-colors"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PANTRY_CATEGORIES.map((cat) => {
              const style = CATEGORY_STYLE[cat];
              const items = grouped[cat];
              const isDropTarget = dragOver === cat;
              return (
                <div
                  key={cat}
                  className={`rounded-xl border border-amber-light/30 border-t-4 ${style.border} overflow-hidden transition-all ${
                    isDropTarget ? "ring-2 ring-olive scale-[1.01]" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(cat);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const itemName = e.dataTransfer.getData("text/plain");
                    if (itemName) updatePantryCategory(itemName, cat);
                    setDragOver(null);
                    setDragging(null);
                  }}
                >
                  <div className={`px-4 py-2 ${style.bg}`}>
                    <h3 className={`font-serif text-sm font-semibold capitalize ${style.heading}`}>
                      {cat}
                      {items.length > 0 && (
                        <span className="text-ink-muted font-normal ml-2 text-xs">
                          {items.length}
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className={items.length === 0 ? "px-4 py-3" : ""}>
                    {items.length === 0 ? (
                      <p className="text-ink-muted text-xs italic">
                        {dragging ? "Drop here" : "Empty"}
                      </p>
                    ) : (
                      items.map((item, i) => (
                        <div
                          key={item.name}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", item.name);
                            setDragging(item.name);
                          }}
                          onDragEnd={() => {
                            setDragging(null);
                            setDragOver(null);
                          }}
                          className={`flex items-center justify-between px-4 py-2.5 ${
                            i !== items.length - 1 ? "border-b border-amber-light/20" : ""
                          } bg-cream-dark hover:bg-amber-light/10 transition-colors cursor-grab active:cursor-grabbing ${
                            dragging === item.name ? "opacity-40" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-ink-muted shrink-0">
                              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                            </svg>
                            <Link
                              href={`/recipes/${encodeURIComponent(item.name)}`}
                              className="text-sm text-ink font-medium hover:text-olive transition-colors capitalize"
                              onClick={(e) => { if (dragging) e.preventDefault(); }}
                            >
                              {item.name}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0.25}
                              step={0.25}
                              value={item.qty}
                              onChange={(e) =>
                                updatePantryItem(item.name, Number(e.target.value), item.unit)
                              }
                              className="w-14 border border-amber-light/40 bg-cream rounded px-1.5 py-0.5 text-xs text-ink text-center focus:outline-none focus:ring-1 focus:ring-olive"
                            />
                            <select
                              value={item.unit}
                              onChange={(e) =>
                                updatePantryItem(item.name, item.qty, e.target.value)
                              }
                              className="border border-amber-light/40 bg-cream rounded px-1.5 py-0.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-olive"
                            >
                              {UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => removeFromPantry(item.name)}
                              className="text-ink-muted hover:text-red-600 transition-colors p-0.5"
                              aria-label={`Remove ${item.name}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
