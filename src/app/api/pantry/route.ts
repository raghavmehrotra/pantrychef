import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("pantry_items")
    .select("name, qty, unit, category")
    .eq("user_id", userId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const items = await request.json();

  await supabase.from("pantry_items").delete().eq("user_id", userId);

  if (items.length > 0) {
    const rows = items.map((item: { name: string; qty: number; unit: string; category: string }) => ({
      user_id: userId,
      name: item.name,
      qty: item.qty,
      unit: item.unit,
      category: item.category,
    }));

    const { error } = await supabase.from("pantry_items").insert(rows);
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
