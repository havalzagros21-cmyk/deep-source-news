"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white">

      <div className="bg-[#111827] p-8 rounded-xl border border-gray-800 w-[350px]">

        <h1 className="text-2xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}