"use client";

import Image from "next/image";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { useRouter } from "next/navigation";
import { useState } from "react";

const weightData = [
  { week: "W1", weight: 80 },
  { week: "W2", weight: 79.2 },
  { week: "W3", weight: 78.5 },
  { week: "W4", weight: 77.8 },
  { week: "W5", weight: 77.0 },
];
const proteinData = [
  { day: "Mon", protein: 120 },
  { day: "Tue", protein: 130 },
  { day: "Wed", protein: 110 },
  { day: "Thu", protein: 140 },
  { day: "Fri", protein: 135 },
  { day: "Sat", protein: 125 },
  { day: "Sun", protein: 138 },
];

export default function Home() {
  const router = useRouter();
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#e8eaee] to-[#f4f4f5] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b] text-[#23272f] dark:text-[#ededed] flex flex-col items-center justify-center px-4 py-8 transition-colors duration-300" style={{ fontFamily: "var(--font-luxurious)" }}>
      {/* Background charts */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none select-none hidden sm:block">
        <div className="absolute top-10 left-0 w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis dataKey="week" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#b6b6e5" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute bottom-10 right-0 w-2/3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={proteinData}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="protein" stroke="#b6e5d8" fill="#b6e5d8" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Hero Section */}
      <main className="w-full max-w-lg flex flex-col items-center gap-8 text-center">
        <Image src="/window.svg" alt="Fitness 24 Logo" width={64} height={64} className="mb-2 dark:invert" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
          Fitness 24: Your Smart Fitness Tracker
        </h1>
        <p className="text-lg sm:text-2xl text-[#5a5a6e] dark:text-[#b6b6e5] mb-4 font-medium drop-shadow" style={{ fontFamily: "var(--font-luxurious)" }}>
          Track your nutrition, weight, and progress. Set goals, log food, and visualize your journey—all in a beautiful, intuitive, mobile-first app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
          <button
            disabled
            className="group relative inline-block px-10 py-3 rounded-full bg-white/60 dark:bg-[#23272f]/60 shadow-md border border-[#e5e7eb] dark:border-[#23272f] text-[#b6b6e5] dark:text-[#b6b6e5] font-semibold text-lg tracking-wide cursor-not-allowed opacity-60"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Log In
          </button>
          <button
            disabled
            className="group relative inline-block px-10 py-3 rounded-full bg-[#f4f4f5]/60 dark:bg-[#23272f]/60 shadow-md border border-[#e5e7eb] dark:border-[#23272f] text-[#b6b6e5] dark:text-[#b6e5d8] font-semibold text-lg tracking-wide cursor-not-allowed opacity-60"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Register
          </button>
        </div>
        <div className="mt-2 text-base text-[#b6b6e5] dark:text-[#b6e5d8] font-semibold" style={{ fontFamily: "var(--font-montserrat)" }}>
          Hold tight! Our backend squad is building the muscle behind login &amp; register.
        </div>
        <button
          className="mt-4 px-8 py-3 rounded-full bg-[#ededed] dark:bg-[#23272f] text-[#23272f] dark:text-[#ededed] font-bold text-lg shadow-md hover:shadow-lg border border-[#e5e7eb] dark:border-[#393a3d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] focus:ring-offset-2 focus:ring-offset-[#f8fafc] dark:focus:ring-offset-[#18181b]"
          style={{ fontFamily: "var(--font-montserrat)" }}
          onClick={() => setShowStats(true)}
        >
          Continue without login
        </button>
        {showStats && (
          <div className="w-full mt-8 flex flex-col items-center gap-4 bg-white/80 dark:bg-[#23272f]/80 rounded-xl p-6 shadow-lg border border-[#e5e7eb] dark:border-[#23272f]" style={{ fontFamily: "var(--font-luxurious)" }}>
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>Try Fitness 24 as Guest</h2>
            <div className="flex flex-col gap-2 text-left w-full">
              <div className="flex justify-between"><span>Mode:</span> <span>Weight Loss</span></div>
              <div className="flex justify-between"><span>Calorie Target:</span> <span>1800 kcal</span></div>
              <div className="flex justify-between"><span>Protein Target:</span> <span>120g</span></div>
              <div className="flex justify-between"><span>Today&apos;s Calories:</span> <span>0 kcal</span></div>
              <div className="flex justify-between"><span>Today&apos;s Protein:</span> <span>0g</span></div>
            </div>
            <button
              className="mt-4 px-8 py-3 rounded-full bg-[#ededed] dark:bg-[#23272f] text-[#23272f] dark:text-[#ededed] font-bold text-lg shadow-md hover:shadow-lg border border-[#e5e7eb] dark:border-[#393a3d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] focus:ring-offset-2 focus:ring-offset-[#f8fafc] dark:focus:ring-offset-[#18181b]"
              style={{ fontFamily: "var(--font-montserrat)" }}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        )}
        <div className="mt-8 w-full flex flex-col gap-6">
          <div className="bg-white/80 dark:bg-[#23272f]/80 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center gap-4 border border-[#e5e7eb] dark:border-[#23272f]" style={{ fontFamily: "var(--font-luxurious)" }}>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1 text-[#23272f] dark:text-[#ededed]" style={{ fontFamily: "var(--font-luxurious)" }}>
                See Your Progress
              </h2>
              <p className="text-[#5a5a6e] dark:text-[#b6b6e5] text-sm mb-2" style={{ fontFamily: "var(--font-luxurious)" }}>
                Visualize your weight and protein intake trends with beautiful charts.
              </p>
            </div>
            <div className="w-full sm:w-40 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <Line type="monotone" dataKey="weight" stroke="#b6b6e5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-40 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={proteinData}>
                  <Area type="monotone" dataKey="protein" stroke="#b6e5d8" fill="#b6e5d8" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-12 text-xs text-[#b6b6e5] dark:text-[#b6e5d8] text-center w-full" style={{ fontFamily: "var(--font-luxurious)" }}>
        &copy; {new Date().getFullYear()} Fitness 24. All rights reserved.
      </footer>
    </div>
  );
}
