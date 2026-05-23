"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Create() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const publish = async () => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    await supabase.from("news").insert({
      title,
      description: desc,
      content,
      category,
      slug,
      image,
    });

    alert("Posted!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-gray-800 mb-2" />

      <input placeholder="Description" onChange={(e) => setDesc(e.target.value)} className="w-full p-2 bg-gray-800 mb-2" />

      <textarea placeholder="Content" onChange={(e) => setContent(e.target.value)} className="w-full p-2 bg-gray-800 mb-2" />

      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} className="w-full p-2 bg-gray-800 mb-2" />

      <input placeholder="Image URL" onChange={(e) => setImage(e.target.value)} className="w-full p-2 bg-gray-800 mb-2" />

      <button onClick={publish} className="bg-blue-600 px-4 py-2">
        Publish
      </button>

    </div>
  );
}