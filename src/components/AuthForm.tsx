import React, { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation (register only)
    if (mode === "register") {
      if (!form.name.trim()) {
        newErrors.name = "Name is required";
      } else if (form.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      // Height validation
      if (!form.height) {
        newErrors.height = "Height is required";
      } else {
        const height = parseFloat(form.height);
        if (isNaN(height) || height <= 0 || height > 300) {
          newErrors.height = "Please enter a valid height (1-300 cm)";
        }
      }

      // Weight validation
      if (!form.weight) {
        newErrors.weight = "Weight is required";
      } else {
        const weightPattern = /^\d+(\.\d{1,2})?$/;
        if (!weightPattern.test(form.weight)) {
          newErrors.weight = "Please enter a valid weight (e.g. 72.5)";
        } else {
          const weight = parseFloat(form.weight);
          if (weight <= 0 || weight > 500) {
            newErrors.weight = "Please enter a valid weight (1-500 kg)";
          }
        }
      }
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (mode === "register" && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log form data
      console.log(`${mode} form submitted:`, {
        mode,
        ...form,
        ...(mode === "login" && { height: undefined, weight: undefined, name: undefined })
      });
      
      // Here you would typically make an API call
      // const response = await fetch('/api/auth', { method: 'POST', body: JSON.stringify(form) });
      
      alert(`${mode === "login" ? "Login" : "Registration"} successful!`);
      
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "rounded-lg border bg-white/90 dark:bg-[#23272f]/90 px-4 py-2 text-base focus:outline-none focus:ring-2 transition-all";
    const errorClasses = errors[fieldName] 
      ? "border-red-500 dark:border-red-400 focus:ring-red-200 dark:focus:ring-red-800" 
      : "border-[#e5e7eb] dark:border-[#393a3d] focus:ring-[#b6e5d8]";
    
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <div
      className="w-full max-w-md bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] px-8 py-10 flex flex-col gap-6"
      style={{ fontFamily: "var(--font-luxurious)" }}
    >
      <h2
        className="text-2xl sm:text-3xl font-bold mb-2 text-center tracking-tight"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {mode === "login" ? "Log In" : "Register"}
      </h2>
      
      {mode === "register" && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-base font-semibold mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              className={getInputClassName("name")}
              style={{ fontFamily: "var(--font-luxurious)" }}
            />
            {errors.name && (
              <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</span>
            )}
          </div>
          
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="height" className="text-base font-semibold mb-1">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                min="1"
                max="300"
                step="0.1"
                required
                value={form.height}
                onChange={handleChange}
                className={getInputClassName("height")}
                style={{ fontFamily: "var(--font-luxurious)" }}
                placeholder="e.g. 175"
              />
              {errors.height && (
                <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.height}</span>
              )}
            </div>
            
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="weight" className="text-base font-semibold mb-1">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="text"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,2})?$"
                required
                value={form.weight}
                onChange={handleChange}
                className={getInputClassName("weight")}
                style={{ fontFamily: "var(--font-luxurious)" }}
                placeholder="e.g. 72.5"
                title="Please enter a valid weight (e.g. 72.5)"
              />
              {errors.weight && (
                <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.weight}</span>
              )}
            </div>
          </div>
        </>
      )}
      
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-base font-semibold mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          className={getInputClassName("email")}
          style={{ fontFamily: "var(--font-luxurious)" }}
          placeholder="your@email.com"
        />
        {errors.email && (
          <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</span>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-base font-semibold mb-1">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          value={form.password}
          onChange={handleChange}
          className={getInputClassName("password")}
          style={{ fontFamily: "var(--font-luxurious)" }}
          placeholder={mode === "register" ? "Min 6 chars, mix of letters & numbers" : "Enter your password"}
        />
        {errors.password && (
          <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password}</span>
        )}
      </div>
      
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-2 w-full py-3 rounded-full bg-[#ededed] dark:bg-[#23272f] text-[#23272f] dark:text-[#ededed] font-bold text-lg shadow-md hover:shadow-lg border border-[#e5e7eb] dark:border-[#393a3d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] focus:ring-offset-2 focus:ring-offset-[#f8fafc] dark:focus:ring-offset-[#18181b] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {isSubmitting ? "Please wait..." : (mode === "login" ? "Log In" : "Register")}
      </button>
    </div>
  );
}