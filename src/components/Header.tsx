"use client";
import { useState, useEffect, SVGProps } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// Icons matching your home page theme
const Icons = {
    Home: (props: SVGProps<SVGSVGElement>) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Dashboard: (props: SVGProps<SVGSVGElement>) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
};

interface SmartHeaderProps {
    currentPage?: string;
}

export default function SmartHeader({ currentPage = 'Dashboard' }: SmartHeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isDashboard = pathname?.startsWith('/dashboard');
    useEffect(() => {
        // Check if desktop on mount and resize
        const checkDevice = () => {
            setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            // Always visible on desktop
            if (isDesktop) {
                setIsVisible(true);
                return;
            }

            // Mobile behavior
            if (currentScrollY < 10) {
                // At top - always show
                setIsVisible(true);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and past threshold - hide
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        // Only add scroll listener on mobile
        if (!isDesktop) {
            window.addEventListener('scroll', controlHeader, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [lastScrollY, isDesktop]);

    const handleHomeClick = () => {
        router.push('/');
    };

    return (
        <>
            {/* Subtle Background Elements matching home page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 via-blue-200/15 to-indigo-200/10 dark:from-emerald-900/10 dark:via-blue-900/8 dark:to-indigo-900/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-200/25 via-rose-200/15 to-orange-200/10 dark:from-violet-900/8 dark:via-rose-900/6 dark:to-orange-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <header
                className={`
          fixed top-0 left-0 right-0 z-50 
          bg-white/80 dark:bg-slate-900/80 
          backdrop-blur-xl 
          border-b border-slate-200/60 dark:border-slate-700/60
          shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20
          transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
            >
                {/* Subtle Pattern Overlay matching home page */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo/App Name - Enhanced to match home page exactly */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                                <Image
                                    src="/app_icon.png"
                                    alt="Fitness 24 Logo"
                                    width={22}
                                    height={22}
                                    className="dark:invert group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <span className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Fitness 24
                                </span>
                                {currentPage && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 -mt-1 font-medium">
                                        {currentPage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Navigation - Enhanced with premium styling */}
                        <nav className="flex items-center space-x-2">
                            {!isHome && (
                                <button
                                    onClick={handleHomeClick}
                                    className="group p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <Icons.Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                            )}

                            <button
                                onClick={() => router.push('/dashboard')}
                                aria-current={isDashboard ? 'page' : undefined}
                                className={`group p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border backdrop-blur-sm shadow-sm transition-all duration-300
                  ${isDashboard
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-700/80'
                                    }`}
                            >
                                <Icons.Dashboard className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            </button>
                            {/* Subtle Divider */}
                            {/* <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-200/60 dark:via-slate-700/60 to-transparent"></div> */}

                            {/* Settings Button */}
                            {/* <button className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group">
                <Icons.Settings className="group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
              </button> */}
                        </nav>
                    </div>
                </div>

                {/* Premium bottom glow effect */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
            </header>
        </>
    );
}