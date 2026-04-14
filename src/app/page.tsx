"use client";

import Link from "next/link";

const cards = [
  {
    href: "/pantry",
    title: "Manage Pantry",
    description: "Add, remove, and organize your ingredients",
    accent: "border-t-olive",
    arrow: "text-olive",
  },
  {
    href: "/recipes",
    title: "Browse Recipes",
    description: "Find dishes that match what you have",
    accent: "border-t-amber",
    arrow: "text-amber-dark",
  },
  {
    href: "/grocerylist",
    title: "Grocery List",
    description: "Keep track of what you need to buy",
    accent: "border-t-violet-400",
    arrow: "text-violet-500",
  },
  {
    href: "/tracker",
    title: "Meal Diary",
    description: "Log what you ate and when",
    accent: "border-t-ink-light",
    arrow: "text-ink-light",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
      <h1
        className="animate-fade-up font-serif text-5xl md:text-6xl font-bold text-ink tracking-tight text-center"
        style={{ animationDelay: "0ms" }}
      >
        Welcome to PantryChef, R!
      </h1>
      <p
        className="animate-fade-up text-lg text-ink-muted mt-3 text-center"
        style={{ animationDelay: "150ms" }}
      >
        What are we making today?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mt-12">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className={`animate-fade-up animate-bounce-subtle group block p-8 bg-cream-dark rounded-2xl border border-cream-dark border-t-4 ${card.accent} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-center`}
            style={{ animationDelay: `${300 + i * 120}ms`, "--bounce-delay": `${i * 0.4}s` } as React.CSSProperties}
          >
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {card.title}
            </h2>
            <p className="text-base text-ink-muted mt-2">{card.description}</p>
            <span
              className={`${card.arrow} group-hover:translate-x-1 transition-transform duration-200 mt-4 inline-block text-lg`}
            >
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
