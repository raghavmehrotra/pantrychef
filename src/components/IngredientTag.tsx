"use client";

import Link from "next/link";

interface IngredientTagProps {
  name: string;
  onRemove?: () => void;
  linked?: boolean;
}

export default function IngredientTag({ name, onRemove, linked = false }: IngredientTagProps) {
  const tag = (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="ml-1 text-emerald-600 hover:text-emerald-900 font-bold"
        >
          x
        </button>
      )}
    </span>
  );

  if (linked) {
    return (
      <Link href={`/recipes/${encodeURIComponent(name)}`} className="hover:opacity-80">
        {tag}
      </Link>
    );
  }

  return tag;
}
