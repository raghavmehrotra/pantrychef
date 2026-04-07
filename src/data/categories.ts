import { PantryCategory } from "@/types";

export const DEFAULT_UNIT: Record<PantryCategory, string> = {
  "meat": "lb",
  "vegetables": "unit",
  "grains": "cup",
  "spices, oils & sauces": "oz",
  "fruits": "unit",
  "snacks": "unit",
};

const INGREDIENT_CATEGORIES: Record<string, PantryCategory> = {
  // Meat
  "chicken breast": "meat",
  "ground beef": "meat",
  "chicken thigh": "meat",
  "pork": "meat",
  "bacon": "meat",
  "sausage": "meat",
  "turkey": "meat",
  "steak": "meat",
  "shrimp": "meat",
  "salmon": "meat",
  "tuna": "meat",
  "fish": "meat",

  // Vegetables
  "broccoli": "vegetables",
  "bell pepper": "vegetables",
  "onion": "vegetables",
  "spinach": "vegetables",
  "tomato": "vegetables",
  "potato": "vegetables",
  "carrot": "vegetables",
  "celery": "vegetables",
  "mushroom": "vegetables",
  "zucchini": "vegetables",
  "corn": "vegetables",
  "lettuce": "vegetables",
  "cucumber": "vegetables",
  "cabbage": "vegetables",
  "kale": "vegetables",
  "cauliflower": "vegetables",
  "green beans": "vegetables",
  "peas": "vegetables",
  "asparagus": "vegetables",
  "sweet potato": "vegetables",

  // Grains
  "rice": "grains",
  "pasta": "grains",
  "tortilla": "grains",
  "black beans": "grains",
  "bread": "grains",
  "oats": "grains",
  "flour": "grains",
  "quinoa": "grains",
  "noodles": "grains",
  "couscous": "grains",
  "lentils": "grains",
  "chickpeas": "grains",

  // Spices & Oils
  "soy sauce": "spices, oils & sauces",
  "garlic": "spices, oils & sauces",
  "olive oil": "spices, oils & sauces",
  "butter": "spices, oils & sauces",
  "salt": "spices, oils & sauces",
  "pepper": "spices, oils & sauces",
  "cumin": "spices, oils & sauces",
  "paprika": "spices, oils & sauces",
  "chili powder": "spices, oils & sauces",
  "oregano": "spices, oils & sauces",
  "basil": "spices, oils & sauces",
  "thyme": "spices, oils & sauces",
  "cinnamon": "spices, oils & sauces",
  "ginger": "spices, oils & sauces",
  "vinegar": "spices, oils & sauces",
  "honey": "spices, oils & sauces",
  "hot sauce": "spices, oils & sauces",
  "sesame oil": "spices, oils & sauces",
  "vegetable oil": "spices, oils & sauces",

  // Fruits
  "lemon": "fruits",
  "avocado": "fruits",
  "lime": "fruits",
  "banana": "fruits",
  "apple": "fruits",
  "orange": "fruits",
  "berries": "fruits",
  "strawberry": "fruits",
  "blueberry": "fruits",
  "mango": "fruits",
  "pineapple": "fruits",
  "grape": "fruits",
  "peach": "fruits",

  // Snacks & Dairy
  "cheese": "snacks",
  "eggs": "snacks",
  "milk": "snacks",
  "yogurt": "snacks",
  "cream cheese": "snacks",
  "sour cream": "snacks",
  "cream": "snacks",
  "nuts": "snacks",
  "peanut butter": "snacks",
  "chips": "snacks",
  "crackers": "snacks",
  "granola": "snacks",
  "chocolate": "snacks",
};

export function classifyIngredient(name: string): PantryCategory {
  const normalized = name.toLowerCase().trim();
  if (INGREDIENT_CATEGORIES[normalized]) {
    return INGREDIENT_CATEGORIES[normalized];
  }
  // Simple keyword fallback
  if (["chicken", "beef", "pork", "lamb", "fish", "shrimp", "turkey", "salmon", "tuna"].some(k => normalized.includes(k))) return "meat";
  if (["berry", "fruit", "apple", "lemon", "lime", "orange", "mango", "banana"].some(k => normalized.includes(k))) return "fruits";
  if (["oil", "sauce", "spice", "herb", "powder", "seed"].some(k => normalized.includes(k))) return "spices, oils & sauces";
  if (["bean", "rice", "pasta", "bread", "flour", "grain", "oat", "wheat", "tortilla"].some(k => normalized.includes(k))) return "grains";
  if (["milk", "cheese", "yogurt", "cream", "egg", "nut", "chip", "cracker"].some(k => normalized.includes(k))) return "snacks";
  return "vegetables"; // default fallback
}
