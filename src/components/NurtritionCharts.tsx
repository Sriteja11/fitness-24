"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";

interface NutritionChartsProps {
  chartData: Array<{ name: string; Calories: number; Protein: number; Fat: number }>;
  totalCalories: number;
  calorieTarget: number;
  totalProtein: number;
  proteinTarget: number;
  totalFat: number;
  type: 'bar' | 'pie' | 'progress';
}

const COLORS = ['#b6b6e5', '#b6e5d8', '#f4b6b6'];

// Custom tooltip for pie chart with appropriate units
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: { unit } } = payload[0];
    return (
      <div className="bg-white/90 dark:bg-[#23272f]/90 p-3 border border-[#e5e7eb] dark:border-[#393a3d] rounded-lg shadow-md">
        <p className="font-semibold">{name}</p>
        <p>Value: {Math.round(value)} {unit}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for radial chart (unchanged from your version)
const CustomRadialTooltip = ({ active, payload, calorieTarget, proteinTarget }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const truncatedValue = Number(item.value).toFixed(1); // Truncate to 1 decimal place

    let absoluteText = '';
    if (item.name === 'Calories') {
      absoluteText = `${Math.round((item.value / 100) * calorieTarget)} cal of ${calorieTarget} cal target`;
    } else {
      const target = item.name === 'Protein' ? proteinTarget : (calorieTarget * 0.3 / 9);
      absoluteText = `${Math.round((item.value / 100) * target)} g of ${Math.round(target)} g target`;
    }

    return (
      <div className="bg-white/90 dark:bg-[#23272f]/90 p-3 border border-[#e5e7eb] dark:border-[#393a3d] rounded-lg shadow-md">
        <p className="font-semibold">{item.name}</p>
        <p>Progress: {truncatedValue}% ({absoluteText})</p>
      </div>
    );
  }
  return null;
};

export default function NutritionCharts({ chartData, totalCalories, calorieTarget, totalProtein, proteinTarget, totalFat, type }: NutritionChartsProps) {
  // Progress data for radial charts (unchanged)
  const progressData = [
    { name: 'Calories', value: Math.min((totalCalories / calorieTarget) * 100, 100), fill: '#b6b6e5' },
    { name: 'Protein', value: Math.min((totalProtein / proteinTarget) * 100, 100), fill: '#b6e5d8' },
    { name: 'Fat', value: (totalFat / (calorieTarget * 0.3 / 9)) * 100, fill: '#f4b6b6' }, // Rough fat target: 30% of calories / 9 cal per g
  ];

  // Pie data with raw values and units (no conversion)
  const pieData = [
    { name: 'Calories', value: totalCalories, unit: 'cal' },
    { name: 'Protein', value: totalProtein, unit: 'g' },
    { name: 'Fat', value: totalFat, unit: 'g' },
  ];

  if (type === 'bar') {
    return (
      <div className="w-full h-64 bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#23272f" label={{ value: 'Food Items', position: 'insideBottom', offset: 10 }} />
            <YAxis stroke="#23272f" label={{ value: 'Amount (cal/g)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `${value} cal/g`} />
            <Tooltip contentStyle={{ backgroundColor: 'black', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="Calories" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Protein" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Fat" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="w-full h-64 bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={pieData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, value, unit }) => `${name}: ${Math.round(value)} ${unit}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'progress') {
    return (
      <div className="w-full h-64 bg-white/80 dark:bg-[#23272f]/80 rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#23272f] p-4 grid grid-cols-3 gap-4">
        {progressData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" barSize={10} data={[item]}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <Tooltip content={<CustomRadialTooltip calorieTarget={calorieTarget} proteinTarget={proteinTarget} />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <span className="mt-2 text-sm font-semibold">{item.name}: {Math.round(item.value)}% of target</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
