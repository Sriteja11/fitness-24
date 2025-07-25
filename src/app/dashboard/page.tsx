"use client";
import { useEffect, useState } from "react";
import foodData from '../../config/FoodNutrionalInfo.json';
import { FoodItem, FoodNutritionalInfo, UserProfile, Mode } from '@/types/dashboard/dashboard';
import NutritionCharts from "@/components/NurtritionCharts";
import ChartTypeSelector from "@/components/ChartTypeSelector";

const MODES: Mode[] = [
  { label: "Weight Loss", value: "loss", multiplier: 0.8 },
  { label: "Weight Gain", value: "gain", multiplier: 1.2 },
  { label: "Maintenance", value: "maintain", multiplier: 1.0 },
];

const ACTIVITY_LEVELS = [
  { label: "Sedentary (little or no exercise)", value: "sedentary", multiplier: 1.2 },
  { label: "Lightly active (light exercise 1-3 days/week)", value: "lightly active", multiplier: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/week)", value: "moderately active", multiplier: 1.55 },
  { label: "Very active (hard exercise 6-7 days/week)", value: "very active", multiplier: 1.725 },
  { label: "Super active (very hard exercise & physical job)", value: "super active", multiplier: 1.9 },
];

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calculate daily calorie needs based on activity level and mode
function calculateDailyCalories(profile: UserProfile, mode: string): number {
  const bmr = calculateBMR(profile);
  const activityMultiplier = ACTIVITY_LEVELS.find(a => a.value === profile.activity)?.multiplier || 1.55;
  const modeMultiplier = MODES.find(m => m.value === mode)?.multiplier || 1.0;
  return Math.round(bmr * activityMultiplier * modeMultiplier);
}

// Calculate protein needs (adjusted for mode)
function calculateProteinNeeds(profile: UserProfile, mode: string): number {
  let gramsPerKg: number;
  switch (mode) {
    case "loss":
      gramsPerKg = 2.0; // Higher for muscle preservation in deficit
      break;
    case "gain":
      gramsPerKg = 1.8; // Sufficient for muscle building in surplus
      break;
    case "maintain":
    default:
      gramsPerKg = 1.6; // Baseline for maintenance
      break;
  }
  return Math.round(profile.weight * gramsPerKg);
}

export default function DashboardPage() {
  // Food database state
  const foodDatabase = foodData;

  const [filteredFoods, setFilteredFoods] = useState<FoodNutritionalInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("guest_profile");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [isProfileCollapsed, setIsProfileCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("guest_profileCollapsed") === "true";
    }
    return false;
  });

  // Add Goals & Settings collapse state
  const [isGoalsCollapsed, setIsGoalsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("guest_goalsCollapsed") === "true";
    }
    return false;
  });

  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: "",
    height: 170,
    weight: 70,
    gender: 'male',
    age: 25,
    activity: 'moderate' // Default to moderate
  });

  // Mode state
  const [mode, setMode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("guest_mode") || "loss";
    }
    return "loss";
  });

  const [chartType, setChartType] = useState<'bar' | 'pie' | 'progress'>('bar');

  // Updated target state with localStorage persistence
  const [calorieTarget, setCalorieTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("guest_calorieTarget");
      return saved ? Number(saved) : 1800;
    }
    return 1800;
  });

  const [proteinTarget, setProteinTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("guest_proteinTarget");
      return saved ? Number(saved) : 120;
    }
    return 120;
  });

  // Add a flag to track if targets were manually set
  const [targetsManuallySet, setTargetsManuallySet] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("guest_targetsManuallySet") === "true";
    }
    return false;
  });

  // Updated food form state
  const [foodName, setFoodName] = useState<string>("");
  const [foodQuantity, setFoodQuantity] = useState<string>("100");
  const [foodCalories, setFoodCalories] = useState<string>("");
  const [foodProtein, setFoodProtein] = useState<string>("");
  const [foodFat, setFoodFat] = useState<string>("");
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodNutritionalInfo | null>(null);

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

  // Target input handlers
  const handleCalorieTargetChange = (value: number) => {
    setCalorieTarget(value);
    setTargetsManuallySet(true);
  };

  const handleProteinTargetChange = (value: number) => {
    setProteinTarget(value);
    setTargetsManuallySet(true);
  };

  // Goals & Settings handlers
  const handleGoalsSave = () => {
    setTargetsManuallySet(true); // Mark as manually set
    setIsGoalsCollapsed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_goalsCollapsed", "true");
      localStorage.setItem("guest_calorieTarget", calorieTarget.toString());
      localStorage.setItem("guest_proteinTarget", proteinTarget.toString());
      localStorage.setItem("guest_targetsManuallySet", "true");
    }
  };

  const handleGoalsEdit = () => {
    setIsGoalsCollapsed(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_goalsCollapsed", "false");
    }
  };

  // Handle food search
  const handleFoodSearch = (searchTerm: string) => {
    setFoodName(searchTerm);

    if (searchTerm.length > 0) {
      const filtered = foodDatabase.filter(food =>
        food.foodItemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoods(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredFoods([]);
      setShowSuggestions(false);
    }
  };

  // Handle food selection
  const handleFoodSelect = (foodItem: FoodNutritionalInfo) => {
    setSelectedFoodItem(foodItem);
    setFoodName(foodItem.foodItemName);

    // Calculate values based on quantity
    const quantity = Number(foodQuantity) || 100;
    const multiplier = quantity / 100;

    setFoodCalories(Math.round(foodItem.foodItemCalories * multiplier).toString());
    setFoodProtein((foodItem.foodItemProtein * multiplier).toFixed(1));
    setFoodFat((foodItem.foodItemFat * multiplier).toFixed(1));

    setShowSuggestions(false);
  };

  // Handle quantity change
  const handleQuantityChange = (quantity: string) => {
    setFoodQuantity(quantity);

    if (selectedFoodItem && quantity) {
      const multiplier = Number(quantity) / 100;
      setFoodCalories(Math.round(selectedFoodItem.foodItemCalories * multiplier).toString());
      setFoodProtein((selectedFoodItem.foodItemProtein * multiplier).toFixed(1));
      setFoodFat((selectedFoodItem.foodItemFat * multiplier).toFixed(1));
    }
  };

  // Update targets when profile or mode changes (only if not manually set)
  useEffect(() => {
    if (userProfile && !targetsManuallySet) {
      const newCalorieTarget = calculateDailyCalories(userProfile, mode);
      const newProteinTarget = calculateProteinNeeds(userProfile, mode);
      setCalorieTarget(newCalorieTarget);
      setProteinTarget(newProteinTarget);
    }
  }, [userProfile, mode, targetsManuallySet]);

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

  // Persist profile
  useEffect(() => {
    if (typeof window !== 'undefined' && userProfile) {
      localStorage.setItem("guest_profile", JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Persist other data including goals collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_mode", mode);
      localStorage.setItem("guest_profileCollapsed", isProfileCollapsed.toString());
      localStorage.setItem("guest_goalsCollapsed", isGoalsCollapsed.toString());
    }
  }, [mode, isProfileCollapsed, isGoalsCollapsed]);

  // Add persistence for targets
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_calorieTarget", calorieTarget.toString());
      localStorage.setItem("guest_proteinTarget", proteinTarget.toString());
      localStorage.setItem("guest_targetsManuallySet", targetsManuallySet.toString());
    }
  }, [calorieTarget, proteinTarget, targetsManuallySet]);

  // Persist food log
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("guest_foodLog", JSON.stringify({ date: today, items: foodLog }));
    }
  }, [foodLog, today]);

  // Handle profile save
  const handleProfileSave = () => {
    if (!profileForm.name.trim()) return;
    setUserProfile(profileForm);
    setIsProfileCollapsed(true);
  };

  // Handle profile edit
  const handleProfileEdit = () => {
    if (userProfile) {
      setProfileForm(userProfile);
    }
    setIsProfileCollapsed(false);
  };

  // Handle mode change
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
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
      quantity: Number(foodQuantity)
    };

    setFoodLog([...foodLog, newItem]);
    setFoodName("");
    setFoodQuantity("100");
    setFoodCalories("");
    setFoodProtein("");
    setFoodFat("");
    setSelectedFoodItem(null);
    setShowSuggestions(false);
  };

  // Remove food item
  const handleRemoveFood = (index: number) => {
    setFoodLog(foodLog.filter((_, i) => i !== index));
  };

  // Reset targets to calculated values
  const handleResetTargets = () => {
    if (userProfile) {
      const newCalorieTarget = calculateDailyCalories(userProfile, mode);
      const newProteinTarget = calculateProteinNeeds(userProfile, mode);
      setCalorieTarget(newCalorieTarget);
      setProteinTarget(newProteinTarget);
      setTargetsManuallySet(false);
    }
  };

  // Calculate totals
  const totalCalories = foodLog.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = foodLog.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalFat = foodLog.reduce((sum, f) => sum + (f.fat || 0), 0);

  // Chart data
  const chartData = foodLog.map((f, i) => ({
    name: f.name || `Item ${i + 1}`,
    Calories: f.calories,
    Protein: f.protein,
    Fat: f.fat || 0,
  }));

  // Show only profile card if no profile exists
  if (!userProfile || !isProfileCollapsed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#e8eaee] to-[#f4f4f5] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b] px-4 py-8 flex flex-col items-center">
        {/* Profile Setup Card */}
        <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Your Nutrition Dashboard</h1>
          <h2 className="text-xl font-semibold mb-4">Set Up Your Profile</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Age</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={profileForm.age}
                  onChange={e => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Gender</label>
                <select
                  value={profileForm.gender}
                  onChange={e => setProfileForm({ ...profileForm, gender: e.target.value as 'male' | 'female' })}
                  className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={profileForm.height}
                  onChange={e => setProfileForm({ ...profileForm, height: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={profileForm.weight}
                  onChange={e => setProfileForm({ ...profileForm, weight: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Activity Level</label>
              <select
                value={profileForm.activity}
                onChange={e => setProfileForm({ ...profileForm, activity: e.target.value })}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
              >
                {ACTIVITY_LEVELS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleProfileSave}
                disabled={!profileForm.name.trim()}
                className="px-8 py-3 rounded-full bg-[#b6e5d8] hover:bg-[#a0d7c7] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#23272f] font-bold text-lg shadow-md hover:shadow-lg border border-[#b6e5d8] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] focus:ring-offset-2"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#e8eaee] to-[#f4f4f5] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b] px-4 py-8 flex flex-col items-center">
      {/* Collapsed Profile Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Welcome back, {userProfile.name}!</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userProfile.height}cm • {userProfile.weight}kg • {userProfile.gender} • {userProfile.age}y • {userProfile.activity}
            </span>
          </div>
          <button
            onClick={handleProfileEdit}
            className="p-2 rounded-lg bg-[#b6e5d8] hover:bg-[#a0d7c7] text-[#23272f] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Goals & Settings Card - Collapsible */}
      {!isGoalsCollapsed ? (
        <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Goals & Settings</h2>
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
              <label className="block mb-1 font-semibold">Calorie Target {!targetsManuallySet && '(Calculated)'}</label>
              <input
                type="number"
                min="500"
                max="6000"
                value={calorieTarget}
                onChange={e => handleCalorieTargetChange(Number(e.target.value))}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Protein Target (g) {!targetsManuallySet && '(Calculated)'}</label>
              <input
                type="number"
                min="10"
                max="400"
                value={proteinTarget}
                onChange={e => handleProteinTargetChange(Number(e.target.value))}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
              />
            </div>
          </div>
          {userProfile && (
            <div className="flex justify-end mt-4 space-x-2">
              {/* Show Reset button only if targets can actually be reset */}
              {(targetsManuallySet || calorieTarget !== calculateDailyCalories(userProfile, mode) || proteinTarget !== calculateProteinNeeds(userProfile, mode)) && (
                <button
                  onClick={handleResetTargets}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                >
                  Reset to Calculated Values
                </button>
              )}
              <button
                onClick={handleGoalsSave}
                className="px-4 py-2 rounded-lg bg-[#b6e5d8] hover:bg-[#a0d7c7] text-[#23272f] font-medium text-sm transition-colors"
              >
                Save Goals
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Goals & Settings</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {mode === 'loss' ? 'Weight Loss' : mode === 'gain' ? 'Weight Gain' : 'Maintenance'} •
                {calorieTarget} cal • {proteinTarget}g protein
              </div>
            </div>
            <button
              onClick={handleGoalsEdit}
              className="p-2 rounded-lg bg-[#b6e5d8] hover:bg-[#a0d7c7] text-[#23272f] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add Food Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Food Item</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block mb-1 font-semibold">Food Name</label>
              <input
                type="text"
                placeholder="Search food items..."
                value={foodName}
                onChange={e => handleFoodSearch(e.target.value)}
                onFocus={() => foodName.length > 0 && setShowSuggestions(true)}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !showSuggestions) {
                    handleAddFood(e);
                  }
                }}
              />
              {showSuggestions && filteredFoods.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#23272f] border border-[#e5e7eb] dark:border-[#393a3d] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredFoods.slice(0, 10).map((food, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-[#f8fafc] dark:hover:bg-[#18181b] cursor-pointer border-b border-[#e5e7eb] dark:border-[#393a3d] last:border-b-0"
                      onClick={() => handleFoodSelect(food)}
                    >
                      <div className="font-medium">{food.foodItemName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {food.foodItemCalories} cal • {food.foodItemProtein}g protein • {food.foodItemFat}g fat
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-semibold">Quantity (g/ml)</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="100"
                value={foodQuantity}
                onChange={e => handleQuantityChange(e.target.value)}
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all"
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
                placeholder="0"
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

      {/* Summary Card with Progress Charts and Detailed Stats */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Summary</h2>

        {foodLog.length > 0 && (
          <>
            <NutritionCharts
              chartData={chartData}
              totalCalories={totalCalories}
              calorieTarget={calorieTarget}
              totalProtein={totalProtein}
              proteinTarget={proteinTarget}
              totalFat={totalFat}
              type="progress"
            />

            {/* Detailed Nutrition Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-[#e5e7eb] dark:border-[#393a3d]">
              {/* Calories Stats */}
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">Calories</h3>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current:</span> {totalCalories} cal
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Target:</span> {calorieTarget} cal
                  </div>
                  <div className={`text-sm font-medium ${totalCalories > calorieTarget
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'}`}>
                    {totalCalories > calorieTarget
                      ? `Exceeded by: ${totalCalories - calorieTarget} cal`
                      : `Remaining: ${calorieTarget - totalCalories} cal`}
                  </div>
                </div>
              </div>

              {/* Protein Stats */}
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">Protein</h3>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current:</span> {Math.round(totalProtein * 10) / 10}g
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Target:</span> {proteinTarget}g
                  </div>
                  <div className={`text-sm font-medium ${totalProtein > proteinTarget
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400'}`}>
                    {totalProtein > proteinTarget
                      ? `Exceeded by: ${Math.round((totalProtein - proteinTarget) * 10) / 10}g`
                      : `Remaining: ${Math.round((proteinTarget - totalProtein) * 10) / 10}g`}
                  </div>
                </div>
              </div>

              {/* Fat Stats */}
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-orange-600 dark:text-orange-400">Fat Intake</h3>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current:</span> {Math.round(totalFat * 10) / 10}g
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Calories from fat:</span> {Math.round(totalFat * 9)} cal
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    ({totalCalories > 0 ? Math.round((totalFat * 9 / totalCalories) * 100) : 0}% of total calories)
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {foodLog.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No food items logged yet.</p>
            <p className="text-sm mt-1">Add some food items to see your nutrition summary!</p>
          </div>
        )}
      </div>

      {/* Food Log Card */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today&apos;s Food Log</h2>
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
            <p className="text-sm mt-1">Search and add your first meal using the form above!</p>
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
                    {food.quantity && <span>{food.quantity}g</span>}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Nutrition Breakdown</h2>
            <ChartTypeSelector selected={chartType} onChange={setChartType} />
          </div>

          {/* Mobile-friendly chart container */}
          {chartType === 'bar' ? (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0"> {/* Minimum width only on mobile */}
                <NutritionCharts
                  chartData={chartData}
                  totalCalories={totalCalories}
                  calorieTarget={calorieTarget}
                  totalProtein={totalProtein}
                  proteinTarget={proteinTarget}
                  totalFat={totalFat}
                  type={chartType}
                />
              </div>
            </div>
          ) : (
            <NutritionCharts
              chartData={chartData}
              totalCalories={totalCalories}
              calorieTarget={calorieTarget}
              totalProtein={totalProtein}
              proteinTarget={proteinTarget}
              totalFat={totalFat}
              type={chartType}
            />
          )}
        </div>
      )}
    </div>
  );
}
