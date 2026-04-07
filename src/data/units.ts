// Conversion factors to a common base unit within each group
// Weight: base = g
// Volume: base = ml
const TO_BASE: Record<string, { group: string; factor: number }> = {
  g:    { group: "weight", factor: 1 },
  kg:   { group: "weight", factor: 1000 },
  oz:   { group: "weight", factor: 28.3495 },
  lb:   { group: "weight", factor: 453.592 },
  ml:   { group: "volume", factor: 1 },
  L:    { group: "volume", factor: 1000 },
  cup:  { group: "volume", factor: 236.588 },
  tbsp: { group: "volume", factor: 14.787 },
  tsp:  { group: "volume", factor: 4.929 },
};

/**
 * Convert a quantity from one unit to another.
 * Returns null if units are not in the same conversion group.
 */
export function convertUnits(qty: number, fromUnit: string, toUnit: string): number | null {
  if (fromUnit === toUnit) return qty;
  const from = TO_BASE[fromUnit];
  const to = TO_BASE[toUnit];
  if (!from || !to || from.group !== to.group) return null;
  return (qty * from.factor) / to.factor;
}

/**
 * Parse a recipe amount string like "1 lb", "3 tbsp", "1/2 cup", "2 cups cooked"
 * Returns { qty, unit } or null if unparseable.
 */
export function parseAmount(amount: string): { qty: number; unit: string } | null {
  const cleaned = amount.trim();

  // Match patterns like "1.5 lb", "3 tbsp", "1/2 cup", "1 can (15 oz)"
  const match = cleaned.match(/^(\d+(?:[./]\d+)?)\s*([\w]+)/);
  if (!match) return null;

  let qty: number;
  const raw = match[1];
  if (raw.includes("/")) {
    const [num, den] = raw.split("/");
    qty = Number(num) / Number(den);
  } else {
    qty = Number(raw);
  }

  if (isNaN(qty) || qty <= 0) return null;

  // Normalize unit aliases
  let unit = match[2].toLowerCase();
  const aliases: Record<string, string> = {
    cups: "cup",
    lbs: "lb",
    cloves: "unit",
    clove: "unit",
    medium: "unit",
    large: "unit",
    small: "unit",
    can: "unit",
  };
  unit = aliases[unit] ?? unit;

  return { qty, unit };
}
