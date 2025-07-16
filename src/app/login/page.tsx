"use client";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#e8eaee] to-[#f4f4f5] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b] transition-colors duration-300 px-4" style={{ fontFamily: "var(--font-cormorant)" }}>
      <AuthForm mode="login" />
    </div>
  );
} 