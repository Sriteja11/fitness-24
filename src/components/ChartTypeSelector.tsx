"use client";
import { JSX, useState } from "react";
import { FaChartBar, FaChartPie, FaSpinner } from "react-icons/fa"; // Icons for bar, pie, and progress (spinner for radial/progress feel)

type ChartType = 'bar' | 'pie' | 'progress';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onChange: (value: ChartType) => void;
}

const chartOptions: { value: ChartType; label: string; icon: JSX.Element }[] = [
  { value: 'bar', label: 'Bar Chart', icon: <FaChartBar className="mr-2 text-blue-600 dark:text-blue-400" /> },
  { value: 'pie', label: 'Pie Chart', icon: <FaChartPie className="mr-2 text-emerald-600 dark:text-emerald-400" /> },
  { value: 'progress', label: 'Progress Radial', icon: <FaSpinner className="mr-2 text-orange-600 dark:text-orange-400" /> },
];

export default function ChartTypeSelector({ selected, onChange }: ChartTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: ChartType) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 gap-2"
      >
        {chartOptions.find(opt => opt.value === selected)?.icon}
        {chartOptions.find(opt => opt.value === selected)?.label}
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-20 right-0 mt-2 w-48 bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-lg backdrop-blur-sm max-h-40 overflow-y-auto">
          {chartOptions.map(opt => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="flex items-center px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-200"
            >
              {opt.icon}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
