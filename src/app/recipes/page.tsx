"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import RecipeCard from "@/components/RecipeCard";
import DiscoverRecipes from "@/components/DiscoverRecipes";
import { Recipe } from "@/types";

const EMPTY_INGREDIENT = { name: "", amount: "" };

export default function RecipesPage() {
  const { pantryNames, allRecipes, addRecipe } = useApp();
  const [showForm, setShowForm] = useState(false);

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
      nutrition: (calories || protein || carbs || fat || fiber)
        ? { calories, protein, carbs, fat, fiber }
        : undefined,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      source: "user",
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
          Discover new recipes and manage your collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: My Recipes */}
        <div>
          <div className="flex items-center justify-between mb-4 h-10">
            <h2 className="font-serif text-lg font-semibold text-ink">
              My Recipes {allRecipes.length > 0 && `(${allRecipes.length})`}
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-olive text-cream hover:bg-olive-dark transition-colors"
            >
              {showForm ? "Cancel" : "+ New"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="border border-amber-light/40 rounded-xl bg-cream-dark p-4 space-y-4 mb-4"
            >
              <h3 className="font-serif text-base font-semibold text-ink">Create a Recipe</h3>

              <div className="space-y-3">
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
                      <input type="text" value={ing.name} onChange={(e) => { const u = [...ingredients]; u[i] = { ...u[i], name: e.target.value }; setIngredients(u); }} placeholder="Ingredient" className={smallInputClass} />
                      <input type="text" value={ing.amount} onChange={(e) => { const u = [...ingredients]; u[i] = { ...u[i], amount: e.target.value }; setIngredients(u); }} placeholder="Amount" className={smallInputClass} />
                      {ingredients.length > 1 && (
                        <button type="button" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))} className="text-ink-muted hover:text-red-600 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setIngredients([...ingredients, { ...EMPTY_INGREDIENT }])} className="mt-1 text-xs text-olive hover:text-olive-dark font-medium">+ Add ingredient</button>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-light mb-2">Instructions</label>
                <div className="space-y-2">
                  {instructions.map((step, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs text-ink-muted w-5 shrink-0">{i + 1}.</span>
                      <input type="text" value={step} onChange={(e) => { const u = [...instructions]; u[i] = e.target.value; setInstructions(u); }} placeholder="Step description" className={smallInputClass} />
                      {instructions.length > 1 && (
                        <button type="button" onClick={() => setInstructions(instructions.filter((_, j) => j !== i))} className="text-ink-muted hover:text-red-600 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setInstructions([...instructions, ""])} className="mt-1 text-xs text-olive hover:text-olive-dark font-medium">+ Add step</button>
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                <label className="block text-xs font-medium text-ink-light mb-1">Tags (comma-separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. quick, vegetarian" className={inputClass} />
              </div>

              <button type="submit" className="px-4 py-2 bg-olive text-cream text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors">
                Save Recipe
              </button>
            </form>
          )}

          {recipesWithMatch.length === 0 ? (
            <p className="text-ink-muted text-sm py-4 text-center">
              No saved recipes yet. Discover recipes on the right or create your own.
            </p>
          ) : (
            <div className="space-y-4">
              {recipesWithMatch.map(({ recipe, matchedCount }) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  matchedCount={matchedCount}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Discover */}
        <div>
          <DiscoverRecipes />
        </div>
      </div>
    </div>
  );
}
