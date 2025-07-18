"use client";
import { JSX, useState } from "react";
import { FaChartBar, FaChartPie, FaSpinner } from "react-icons/fa"; // Icons for bar, pie, and progress (spinner for radial/progress feel)

type ChartType = 'bar' | 'pie' | 'progress';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onChange: (value: ChartType) => void;
}

const chartOptions: { value: ChartType; label: string; icon: JSX.Element }[] = [
  { value: 'bar', label: 'Bar Chart', icon: <FaChartBar className="mr-2 text-[#b6b6e5]" /> },
  { value: 'pie', label: 'Pie Chart', icon: <FaChartPie className="mr-2 text-[#b6e5d8]" /> },
  { value: 'progress', label: 'Progress Radial', icon: <FaSpinner className="mr-2 text-[#f4b6b6]" /> },
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
        className="flex items-center px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg border border-[#e5e7eb] dark:border-[#393a3d] bg-white/90 dark:bg-[#23272f]/90 font-medium focus:outline-none focus:ring-2 focus:ring-[#b6e5d8] transition-all hover:bg-[#f8fafc] dark:hover:bg-[#18181b]"
      >
        {chartOptions.find(opt => opt.value === selected)?.icon}
        {chartOptions.find(opt => opt.value === selected)?.label}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white/90 dark:bg-[#23272f]/90 border border-[#e5e7eb] dark:border-[#393a3d] rounded-lg shadow-xl max-h-40 overflow-y-auto">
          {chartOptions.map(opt => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="flex items-center px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-[#f8fafc] dark:hover:bg-[#18181b] cursor-pointer transition-colors"
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
