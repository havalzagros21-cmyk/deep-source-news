import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) return Response.json([]);

  const { data } = await supabase
    .from("news")
    .select("id,title,slug")
    .ilike("title", `%${q}%`)
    .limit(10);

  return Response.json(data || []);
}