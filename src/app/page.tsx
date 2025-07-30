"use client";

import Image from "next/image";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Define the interface for the beforeinstallprompt event (for type safety)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

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

const features = [
  {
    icon: "🔍",
    title: "Comprehensive Food Database",
    description: "Access the world's largest nutrition dataset with detailed information for thousands of food items"
  },
  {
    icon: "📝",
    title: "Smart Food Logging",
    description: "Simply type any food item and instantly get nutritional information to add to your daily log"
  },
  {
    icon: "📊",
    title: "Progress Visualization",
    description: "Beautiful charts and analytics to track your nutrition journey over time"
  },
  {
    icon: "🎯",
    title: "Personalized Goals",
    description: "Set custom calorie and macro targets tailored to your fitness objectives"
  }
];

export default function Home() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User installed the app");
    } else {
      console.log("User dismissed the prompt");
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-50 dark:from-slate-950 dark:via-stone-950 dark:to-neutral-950 text-slate-800 dark:text-slate-200">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-stone-100/40 to-slate-100/40 dark:from-stone-900/20 dark:to-slate-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Background charts with subtle styling */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none select-none hidden lg:block">
        <div className="absolute top-20 left-10 w-1/3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <Line type="monotone" dataKey="weight" stroke="#64748b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute bottom-20 right-10 w-2/5 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={proteinData}>
              <Area type="monotone" dataKey="protein" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Install Button */}
      {showInstallBtn && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-6 right-6 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-slate-50 dark:text-slate-800 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          Install App
        </button>
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="w-full px-6 py-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Image src="/app_icon.png" alt="Fitness 24 Logo" width={20} height={20} className="dark:invert" />
              </div>
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Fitness 24
              </span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-sm font-medium text-slate-600 dark:text-slate-300 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Nutrition tracking made simple
            </div>

            {/* Hero Title */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-slate-900 dark:text-slate-100">
                Your Complete
                <br />
                <span className="font-medium bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Nutrition Companion
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Track your daily nutrition with the world&apos;s most comprehensive food database. 
                Simply search, log, and monitor your progress.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                disabled
                className="px-8 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700"
              >
                Sign In (Coming Soon)
              </button>
              
              <button
                disabled
                className="px-8 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700"
              >
                Create Account (Coming Soon)
              </button>
            </div>

            {/* Guest Access */}
            <div className="pt-6">
              <button
                className="px-8 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-slate-50 dark:text-slate-800 font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                onClick={() => setShowPreview(true)}
              >
                Try Fitness 24 Free
              </button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="mt-12 mx-auto max-w-sm">
                <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Get Started Instantly
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Set up your profile and start tracking
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-left text-sm">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">Create your profile</span>
                      <span className="text-slate-400">→</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">Set your goals</span>
                      <span className="text-slate-400">→</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">Start logging food</span>
                      <span className="text-slate-400">→</span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full mt-6 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-slate-50 dark:text-slate-800 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => router.push("/dashboard")}
                  >
                    Start Your Journey
                  </button>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="pt-20">
              <h2 className="text-2xl font-light text-center mb-12 text-slate-800 dark:text-slate-200">
                Everything you need for nutrition tracking
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Charts */}
            <div className="pt-20">
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-2xl font-light text-center mb-8 text-slate-800 dark:text-slate-200">
                  Beautiful progress tracking
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-slate-600 dark:text-slate-400">
                      Weight Progress
                    </h4>
                    <div className="h-32 bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-800 dark:to-stone-800 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData}>
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#059669" 
                            strokeWidth={2} 
                            dot={{ fill: '#059669', strokeWidth: 0, r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-slate-600 dark:text-slate-400">
                      Nutrition Trends
                    </h4>
                    <div className="h-32 bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-800 dark:to-stone-800 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={proteinData}>
                          <Area 
                            type="monotone" 
                            dataKey="protein" 
                            stroke="#2563eb" 
                            fill="#2563eb" 
                            fillOpacity={0.1}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-6 py-8 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-md flex items-center justify-center">
                <Image src="/app_icon.png" alt="Fitness 24 Logo" width={14} height={14} className="dark:invert" />
              </div>
              <span className="text-base font-medium text-slate-700 dark:text-slate-300">
                Fitness 24
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Fitness 24. Simple nutrition tracking for everyone.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
