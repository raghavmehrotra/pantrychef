"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/pantry", label: "Pantry" },
  { href: "/recipes", label: "Recipes" },
  { href: "/tracker", label: "Tracker" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="text-lg font-bold tracking-tight">
          PantryChef
        </Link>
        <div className="flex gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-900 text-white"
                    : "text-emerald-100 hover:bg-emerald-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
