import { supabase } from "@/lib/supabase";

export default async function Dashboard() {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {data?.map((n) => (
          <div key={n.id} className="bg-[#111827] p-4 rounded-xl">
            <img src={n.image} className="h-32 w-full object-cover rounded" />
            <h2 className="font-bold mt-2">{n.title}</h2>
          </div>
        ))}
      </div>

    </div>
  );
}