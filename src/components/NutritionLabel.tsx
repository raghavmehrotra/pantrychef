import { NutritionInfo } from "@/types";

interface NutritionLabelProps {
  nutrition: NutritionInfo;
  servings?: number;
}

export default function NutritionLabel({ nutrition, servings = 1 }: NutritionLabelProps) {
  const items = [
    { label: "Calories", value: nutrition.calories * servings, unit: "" },
    { label: "Protein", value: nutrition.protein * servings, unit: "g" },
    { label: "Carbs", value: nutrition.carbs * servings, unit: "g" },
    { label: "Fat", value: nutrition.fat * servings, unit: "g" },
    { label: "Fiber", value: nutrition.fiber * servings, unit: "g" },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 text-center">
      {items.map((item) => (
        <div key={item.label} className="bg-cream-dark rounded-lg p-2">
          <div className="text-lg font-bold text-olive">
            {Math.round(item.value)}{item.unit}
          </div>
          <div className="text-xs text-ink-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
