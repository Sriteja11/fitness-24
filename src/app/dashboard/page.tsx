"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat?: number;
}

interface Mode {
  label: string;
  value: string;
  defaultCalories: number;
  defaultProtein: number;
}

const MODES: Mode[] = [
  { label: "Weight Loss", value: "loss", defaultCalories: 1800, defaultProtein: 120 },
  { label: "Weight Gain", value: "gain", defaultCalories: 2500, defaultProtein: 150 },
  { label: "Maintenance", value: "maintain", defaultCalories: 2100, defaultProtein: 130 },
];

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
  // State
  const [mode, setMode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("guest_mode") || "loss";
    }
    return "loss";
  });
  
  const [calorieTarget, setCalorieTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem("guest_calorieTarget")) || 1800;
    }
    return 1800;
  });
  
  const [proteinTarget, setProteinTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem("guest_proteinTarget")) || 120;
    }
    return 120;
  });
  
  const [foodName, setFoodName] = useState<string>("");
  const [foodCalories, setFoodCalories] = useState<string>("");
  const [foodProtein, setFoodProtein] = useState<string>("");
  const [foodFat, setFoodFat] = useState<string>("");
  
  const [foodLog, setFoodLog] = useState<FoodItem[]>(() => {
    if (typeof window !== 'undefined') {
      const today = getToday();
      const saved = localStorage.getItem("guest_foodLog");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.date === today) return parsed.items;
        } catch (e) {
          console.error("Error parsing saved food log:", e);
        }
      }
    }
    return [];
  });
  
  const [today, setToday] = useState<string>(getToday());

  // Reset food log if day changes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = getToday();
      if (now !== today) {
        setToday(now);
        setFoodLog([]);
        if (typeof window !== 'undefined') {
          localStorage.setItem("guest_foodLog", JSON.stringify({ date: now, items: [] }));
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [today]);

  // Persist mode and targets
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_mode", mode);
      localStorage.setItem("guest_calorieTarget", calorieTarget.toString());
      localStorage.setItem("guest_proteinTarget", proteinTarget.toString());
    }
  }, [mode, calorieTarget, proteinTarget]);

  // Persist food log
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_foodLog", JSON.stringify({ date: today, items: foodLog }));
    }
  }, [foodLog, today]);

  // Handle mode change
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = MODES.find(m => m.value === e.target.value);
    setMode(e.target.value);
    setCalorieTarget(selected?.defaultCalories || 1800);
    setProteinTarget(selected?.defaultProtein || 120);
  };

  // Add food item
  const handleAddFood = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!foodName.trim() || !foodCalories || !foodProtein) return;
    
    const newItem: FoodItem = {
      name: foodName.trim(),
      calories: Number(foodCalories),
      protein: Number(foodProtein),
      fat: foodFat ? Number(foodFat) : undefined,
    };
    
    setFoodLog([...foodLog, newItem]);
    setFoodName("");
    setFoodCalories("");
    setFoodProtein("");
    setFoodFat("");
  };

  // Remove food item
  const handleRemoveFood = (index: number) => {
    setFoodLog(foodLog.filter((_, i) => i !== index));
  };

  // Calculate totals
  const totalCalories = foodLog.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = foodLog.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalFat = foodLog.reduce((sum, f) => sum + (f.fat || 0), 0);
  const remainingCalories = calorieTarget - totalCalories;
  const remainingProtein = proteinTarget - totalProtein;

  // Chart data
  const chartData = foodLog.map((f, i) => ({
    name: f.name || `Item ${i + 1}`,
    Calories: f.calories,
    Protein: f.protein,
    Fat: f.fat || 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#e8eaee] to-[#f4f4f5] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b] px-4 py-8 flex flex-col items-center">
      {/* Header Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Guest Dashboard</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Mode</label>
            <select
              value={mode}
              onChange={handleModeChange}
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
            >
              {MODES.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Calorie Target</label>
            <input
              type="number"
              min="500"
              max="6000"
              value={calorieTarget}
              onChange={e => setCalorieTarget(Number(e.target.value))}
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Protein Target (g)</label>
            <input
              type="number"
              min="10"
              max="400"
              value={proteinTarget}
              onChange={e => setProteinTarget(Number(e.target.value))}
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Add Food Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Food Item</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Food Name</label>
              <input
                type="text"
                placeholder="Enter food name"
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFood(e);
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Calories</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={foodCalories}
                onChange={e => setFoodCalories(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFood(e);
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Protein (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={foodProtein}
                onChange={e => setFoodProtein(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFood(e);
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Fat (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="0 (optional)"
                value={foodFat}
                onChange={e => setFoodFat(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFood(e);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddFood}
              className="px-6 py-2 rounded-full bg-[#b6e5d8] hover:bg-[#a0d7c7] text-[#23272f] font-bold text-lg shadow-md hover:shadow-lg border border-[#b6e5d8] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] focus:ring-offset-2"
            >
              Add Food
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#f4f4f5] dark:bg-[#18181b] rounded-lg p-4 flex flex-col items-center border border-[#e5e7eb] dark:border-[#393a3d]">
            <span className="text-2xl font-bold">{totalCalories} / {calorieTarget}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
            <span className={`text-sm mt-1 ${remainingCalories >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {remainingCalories >= 0 ? `${remainingCalories} left` : `${Math.abs(remainingCalories)} over`}
            </span>
          </div>
          <div className="bg-[#f4f4f5] dark:bg-[#18181b] rounded-lg p-4 flex flex-col items-center border border-[#e5e7eb] dark:border-[#393a3d]">
            <span className="text-2xl font-bold">{totalProtein} / {proteinTarget}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Protein (g)</span>
            <span className={`text-sm mt-1 ${remainingProtein >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {remainingProtein >= 0 ? `${remainingProtein} left` : `${Math.abs(remainingProtein)} over`}
            </span>
          </div>
          <div className="bg-[#f4f4f5] dark:bg-[#18181b] rounded-lg p-4 flex flex-col items-center border border-[#e5e7eb] dark:border-[#393a3d]">
            <span className="text-2xl font-bold">{totalFat.toFixed(1)}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Fat (g)</span>
            <span className="text-sm mt-1 text-gray-500 dark:text-gray-400">Total consumed</span>
          </div>
        </div>
      </div>

      {/* Food Log Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today's Food Log</h2>
          <button
            onClick={() => {
              setFoodLog([]);
              if (typeof window !== 'undefined') {
                localStorage.setItem("guest_foodLog", JSON.stringify({ date: today, items: [] }));
              }
            }}
            className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 font-medium text-sm transition-colors"
          >
            Clear Log
          </button>
        </div>
        
        {foodLog.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No food items added yet.</p>
            <p className="text-sm mt-1">Add your first meal using the form above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {foodLog.map((food, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#f8fafc] dark:bg-[#18181b] rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g protein</span>
                    {food.fat !== undefined && <span>{food.fat}g fat</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFood(index)}
                  className="px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Card */}
      {foodLog.length > 0 && (
        <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Nutrition Breakdown</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Calories" fill="#b6b6e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Protein" fill="#b6e5d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fat" fill="#f4b6b6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}