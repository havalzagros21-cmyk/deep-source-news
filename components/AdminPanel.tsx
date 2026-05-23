"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  async function publishNews() {

    const slug = title.toLowerCase().replaceAll(" ", "-");

    await supabase.from("news").insert([
      {
        title,
        description,
        content,
        image,
        category,
        slug,
      },
    ]);

    location.reload();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 left-8 w-20 h-20 rounded-full bg-red-700 text-4xl font-black"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <div className="bg-[#111827] p-8 rounded-3xl w-[800px]">

            <h1 className="text-3xl font-black mb-6">نشر خبر</h1>

            <input className="w-full p-3 mb-3 bg-black" placeholder="العنوان" onChange={(e)=>setTitle(e.target.value)} />
            <input className="w-full p-3 mb-3 bg-black" placeholder="الوصف" onChange={(e)=>setDescription(e.target.value)} />
            <input className="w-full p-3 mb-3 bg-black" placeholder="الصورة" onChange={(e)=>setImage(e.target.value)} />
            <input className="w-full p-3 mb-3 bg-black" placeholder="التصنيف" onChange={(e)=>setCategory(e.target.value)} />
            <textarea className="w-full p-3 mb-3 h-[200px] bg-black" placeholder="المحتوى" onChange={(e)=>setContent(e.target.value)} />

            <button onClick={publishNews} className="w-full bg-red-700 py-3 font-black">
              نشر
            </button>

          </div>

        </div>
      )}
    </>
  );
}