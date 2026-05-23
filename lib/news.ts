import { supabase } from "./supabase";

export type NewsItem = {
  id: number;
  title: string;
  desc: string;
  category: string;
  breaking: boolean;
};

// 🔥 جلب الأخبار من قاعدة البيانات
export async function getNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 🔥 إضافة خبر جديد
export async function addNews(item: Omit<NewsItem, "id">) {
  const { error } = await supabase.from("news").insert([item]);

  if (error) {
    console.error(error);
  }
}