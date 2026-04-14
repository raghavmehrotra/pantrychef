"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Home" },
  { href: "/pantry", label: "Pantry" },
  { href: "/recipes", label: "Recipes" },
  { href: "/grocerylist", label: "Grocery List" },
  { href: "/tracker", label: "Tracker" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-olive text-cream shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chef hat body */}
            <path
              d="M10 20h12v3a2 2 0 01-2 2h-8a2 2 0 01-2-2v-3z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Chef hat top */}
            <path
              d="M10 20c-2.5 0-4-2-4-4.5 0-2 1.2-3.5 3-4 .5-2.5 2.5-4.5 5-4.5 1.5 0 2.8.6 3.8 1.5a5 5 0 014.2-1.5c2.5 0 4.5 2 5 4.5 1.8.5 3 2 3 4 0 2.5-1.5 4.5-4 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* PC initials */}
            <text
              x="16"
              y="18.5"
              textAnchor="middle"
              fontFamily="serif"
              fontWeight="bold"
              fontSize="9"
              fill="currentColor"
            >PC</text>
          </svg>
          PantryChef
        </Link>
        <div className="flex items-center gap-1">
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
                    ? "bg-olive-dark text-cream"
                    : "text-cream-dark hover:bg-olive-light"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="ml-3">
            <SignedOut>
              <SignInButton>
                <button className="px-3 py-1.5 rounded-md text-sm font-medium text-cream-dark hover:bg-olive-light transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
