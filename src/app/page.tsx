"use client";

import Image from "next/image";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { useRouter } from "next/navigation";
import { useState, useEffect, SVGProps } from "react";
import { Modal } from "@/components/Modal";

// Modern SVG Icons Component
// Fixed Icons Component - accepts props and forwards them to SVG
const Icons = {
  Search: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  FileText: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  Chart: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Target: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Login: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  ),
  UserPlus: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13v6m3-3h-6" />
    </svg>
  ),
  User: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  ArrowRight: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  Play: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12 11m-3-1v3a1 1 0 001 1h1m0-4h4.586a1 1 0 01.707.293L18 12" />
    </svg>
  ),
  Download: (props: SVGProps<SVGSVGElement>) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

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
    icon: <Icons.Search />,
    title: "Comprehensive Food Database",
    description: "Access the world's largest nutrition dataset with detailed information for thousands of food items"
  },
  {
    icon: <Icons.FileText />,
    title: "Smart Food Logging",
    description: "Simply type any food item and instantly get nutritional information to add to your daily log"
  },
  {
    icon: <Icons.Chart />,
    title: "Progress Visualization",
    description: "Beautiful charts and analytics to track your nutrition journey over time"
  },
  {
    icon: <Icons.Target />,
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-50 dark:from-slate-950 dark:via-stone-950 dark:to-neutral-950 text-slate-800 dark:text-slate-200 px-4 py-8 pt-20 flex flex-col items-center">

      {/* Enhanced Background Elements with Premium Gradients */}
      {/* Enhanced Background Elements with More Visible Gradients for Light Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/60 via-blue-200/50 to-indigo-200/40 dark:from-emerald-900/30 dark:via-blue-900/20 dark:to-indigo-900/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-200/70 via-rose-200/50 to-orange-200/40 dark:from-violet-900/20 dark:via-rose-900/15 dark:to-orange-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/50 to-teal-200/40 dark:from-cyan-900/15 dark:to-teal-900/10 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Additional gradient elements for more visual impact */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-bl from-purple-200/40 via-pink-200/30 to-red-200/20 dark:from-purple-900/15 dark:via-pink-900/10 dark:to-red-900/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-gradient-to-tr from-yellow-200/35 via-green-200/25 to-blue-200/30 dark:from-yellow-900/10 dark:via-green-900/8 dark:to-blue-900/12 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Background charts with premium styling */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none select-none hidden lg:block">
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

      {/* Premium Install Button with Icon */}
      {showInstallBtn && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-6 right-6 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 dark:from-slate-200 dark:to-slate-100 dark:hover:from-slate-100 dark:hover:to-white text-slate-50 dark:text-slate-800 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center gap-2 border border-slate-700/20 dark:border-slate-300/20"
        >
          <Icons.Download />
          Install App
        </button>
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Navigation */}
        {/* <nav className="w-full px-6 py-6 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image src="/app_icon.png" alt="Fitness 24 Logo" width={22} height={22} className="dark:invert" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Fitness 24
              </span>
            </div>
          </div>
        </nav> */}

        {/* Enhanced Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-12">

            {/* Premium Hero Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-sm font-medium text-slate-600 dark:text-slate-300 backdrop-blur-lg shadow-sm hover:shadow-md transition-all duration-300">
              <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></span>
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                Nutrition tracking made simple
              </span>
            </div>

            {/* Enhanced Hero Title */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-slate-100">
                Your Complete
                <br />
                <span className="font-medium bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Nutrition Companion
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                Track your daily nutrition with the world&apos;s most comprehensive food database.
                Simply search, log, and monitor your progress with precision.
              </p>
            </div>

            {/* Enhanced CTA Buttons with Icons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                disabled
                className="px-8 py-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Icons.Login />
                Sign In (Coming Soon)
              </button>

              <button
                disabled
                className="px-8 py-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Icons.UserPlus />
                Create Account (Coming Soon)
              </button>
            </div>

            {/* Premium Guest Access Button */}
            <div className="pt-8 flex justify-center">
              <button
                className="group px-4 py-2.5 rounded-lg bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 dark:hover:from-slate-100 dark:hover:via-white dark:hover:to-slate-100 text-slate-50 dark:text-slate-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 inline-flex items-center gap-2 border border-slate-700/20 dark:border-slate-300/20"
                onClick={() => setShowPreview(true)}
              >
                <Icons.User />
                Continue as Guest
                <Icons.ArrowRight />
              </button>
            </div>

            {/* Enhanced Preview Modal */}
            {showPreview && (
              <Modal onClose={() => setShowPreview(false)}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icons.Play className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Get Started Instantly
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Set up your profile and start tracking nutrition today
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700 dark:to-slate-600/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <Icons.User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Create your profile</span>
                    </div>
                    <Icons.ArrowRight className="text-slate-400 w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700 dark:to-slate-600/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icons.Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Set your goals</span>
                    </div>
                    <Icons.ArrowRight className="text-slate-400 w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700 dark:to-slate-600/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <Icons.FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Start logging food</span>
                    </div>
                    <Icons.ArrowRight className="text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <button
                  className="w-full mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => router.push("/dashboard")}
                >
                  <Icons.ArrowRight />
                  Start Your Journey
                </button>
              </Modal>
            )}

            {/* Enhanced Features Grid */}
            <div className="pt-24">
              <h2 className="text-3xl font-light text-center mb-4 text-slate-800 dark:text-slate-200">
                Everything you need for nutrition tracking
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-16 max-w-2xl mx-auto">
                Powerful tools designed to make nutrition tracking effortless and insightful
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group text-center space-y-6 p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 via-blue-50 to-indigo-100 dark:from-emerald-900/30 dark:via-blue-900/20 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Preview Charts */}
            <div className="pt-24">
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-3xl p-10 shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-light text-slate-800 dark:text-slate-200 mb-4">
                    Beautiful progress tracking
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Watch your progress unfold with stunning visualizations that make data meaningful
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <Icons.Chart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Weight Progress
                      </h4>
                    </div>
                    <div className="h-40 bg-gradient-to-br from-slate-50/80 via-white/50 to-emerald-50/30 dark:from-slate-800/80 dark:via-slate-700/50 dark:to-emerald-900/10 rounded-2xl p-6 shadow-inner border border-slate-200/40 dark:border-slate-600/40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData}>
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#059669"
                            strokeWidth={3}
                            dot={{ fill: '#059669', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#059669' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icons.Chart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Nutrition Trends
                      </h4>
                    </div>
                    <div className="h-40 bg-gradient-to-br from-slate-50/80 via-white/50 to-blue-50/30 dark:from-slate-800/80 dark:via-slate-700/50 dark:to-blue-900/10 rounded-2xl p-6 shadow-inner border border-slate-200/40 dark:border-slate-600/40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={proteinData}>
                          <Area
                            type="monotone"
                            dataKey="protein"
                            stroke="#2563eb"
                            fill="url(#blueGradient)"
                            fillOpacity={0.2}
                            strokeWidth={3}
                          />
                          <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="w-full px-6 py-12 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Image src="/app_icon.png" alt="Fitness 24 Logo" width={16} height={16} className="dark:invert" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                Fitness 24
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              &copy; {new Date().getFullYear()} Fitness 24. Empowering your nutrition journey with intelligent tracking and beautiful insights.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
