// app/page.tsx
"use client";
import { useState } from "react";
import StatsCard from "@/components/StatsCard";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const fetchUserStats = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leetcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserData(data);
    } catch (err) {
      console.log("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">
          LeetCode Stats Generator
        </h1>

        <form onSubmit={fetchUserStats} className="flex gap-4 justify-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode username"
            className="px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Generate Stats
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {userData && <StatsCard data={userData} />}
      </div>
    </main>
  );
}
