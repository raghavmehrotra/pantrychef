"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types";

type Filter = "all" | "ready" | "almost";

const EMPTY_INGREDIENT = { name: "", amount: "" };

export default function RecipesPage() {
  const { pantryNames, allRecipes, addRecipe } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ ...EMPTY_INGREDIENT }]);
  const [instructions, setInstructions] = useState([""]);
  const [servings, setServings] = useState(1);
  const [prepTime, setPrepTime] = useState(10);
  const [cookTime, setCookTime] = useState(15);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [fiber, setFiber] = useState(0);
  const [tags, setTags] = useState("");

  const recipesWithMatch = allRecipes
    .map((recipe) => {
      const matchedCount = recipe.ingredients.filter((ing) =>
        pantryNames.includes(ing.name)
      ).length;
      return { recipe, matchedCount };
    })
    .sort((a, b) => {
      const aPct = a.matchedCount / a.recipe.ingredients.length;
      const bPct = b.matchedCount / b.recipe.ingredients.length;
      return bPct - aPct;
    });

  const filtered = recipesWithMatch.filter(({ recipe, matchedCount }) => {
    const pct = matchedCount / recipe.ingredients.length;
    if (filter === "ready") return pct === 1;
    if (filter === "almost") return pct >= 0.5;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Recipes" },
    { key: "ready", label: "Can Cook Now" },
    { key: "almost", label: "Almost There" },
  ];

  function resetForm() {
    setName("");
    setDescription("");
    setIngredients([{ ...EMPTY_INGREDIENT }]);
    setInstructions([""]);
    setServings(1);
    setPrepTime(10);
    setCookTime(15);
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
    setFiber(0);
    setTags("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validIngredients = ingredients.filter((i) => i.name.trim() && i.amount.trim());
    const validInstructions = instructions.filter((s) => s.trim());
    if (!name.trim() || validIngredients.length === 0 || validInstructions.length === 0) return;

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      ingredients: validIngredients.map((i) => ({ name: i.name.trim().toLowerCase(), amount: i.amount.trim() })),
      instructions: validInstructions.map((s) => s.trim()),
      servings,
      prepTime,
      cookTime,
      nutrition: { calories, protein, carbs, fat, fiber },
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    };

    addRecipe(recipe);
    resetForm();
    setShowForm(false);
  }

  const inputClass = "w-full border border-amber-light/40 bg-cream rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive";
  const smallInputClass = "w-full border border-amber-light/40 bg-cream rounded px-2 py-1.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-olive";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Recipes</h1>
        <p className="text-ink-muted mt-1">
          {pantryNames.length > 0
            ? "Sorted by how many ingredients you already have."
            : "Add ingredients to your pantry to see matching recipes."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = search.trim();
          if (trimmed) router.push(`/recipes/${encodeURIComponent(trimmed.toLowerCase())}`);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes by ingredient..."
          className="flex-1 border border-amber-light/40 bg-cream rounded-lg px-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-olive text-cream text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-olive text-cream"
                  : "bg-cream-dark text-ink-light hover:bg-amber-light/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-olive text-cream hover:bg-olive-dark transition-colors"
        >
          {showForm ? "Cancel" : "+ New Recipe"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-amber-light/40 rounded-xl bg-cream-dark p-6 space-y-5"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">Create a Recipe</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Recipe name" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-2">Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[i] = { ...updated[i], name: e.target.value };
                      setIngredients(updated);
                    }}
                    placeholder="Ingredient"
                    className={smallInputClass}
                  />
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[i] = { ...updated[i], amount: e.target.value };
                      setIngredients(updated);
                    }}
                    placeholder="Amount (e.g. 1 cup)"
                    className={smallInputClass}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}
                      className="text-ink-muted hover:text-red-600 transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIngredients([...ingredients, { ...EMPTY_INGREDIENT }])}
              className="mt-2 text-xs text-olive hover:text-olive-dark font-medium"
            >
              + Add ingredient
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-2">Instructions</label>
            <div className="space-y-2">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-ink-muted w-5 shrink-0">{i + 1}.</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => {
                      const updated = [...instructions];
                      updated[i] = e.target.value;
                      setInstructions(updated);
                    }}
                    placeholder="Step description"
                    className={smallInputClass}
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setInstructions(instructions.filter((_, j) => j !== i))}
                      className="text-ink-muted hover:text-red-600 transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInstructions([...instructions, ""])}
              className="mt-2 text-xs text-olive hover:text-olive-dark font-medium"
            >
              + Add step
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1">Servings</label>
              <input type="number" min={1} value={servings} onChange={(e) => setServings(Number(e.target.value))} className={smallInputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1">Prep (min)</label>
              <input type="number" min={0} value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} className={smallInputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1">Cook (min)</label>
              <input type="number" min={0} value={cookTime} onChange={(e) => setCookTime(Number(e.target.value))} className={smallInputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-2">Nutrition (per serving)</label>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Calories</label>
                <input type="number" min={0} value={calories} onChange={(e) => setCalories(Number(e.target.value))} className={smallInputClass} />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Protein (g)</label>
                <input type="number" min={0} value={protein} onChange={(e) => setProtein(Number(e.target.value))} className={smallInputClass} />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Carbs (g)</label>
                <input type="number" min={0} value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} className={smallInputClass} />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Fat (g)</label>
                <input type="number" min={0} value={fat} onChange={(e) => setFat(Number(e.target.value))} className={smallInputClass} />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Fiber (g)</label>
                <input type="number" min={0} value={fiber} onChange={(e) => setFiber(Number(e.target.value))} className={smallInputClass} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-1">Tags (comma-separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. quick, vegetarian, high-protein" className={inputClass} />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-olive text-cream text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors"
          >
            Save Recipe
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <p className="text-ink-muted text-sm py-8 text-center">
          No recipes match this filter. Try adding more ingredients to your pantry.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ recipe, matchedCount }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              matchedCount={matchedCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
