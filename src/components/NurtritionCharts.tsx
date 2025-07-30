"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import type { TooltipProps } from 'recharts';

interface NutritionChartsProps {
  chartData: Array<{ name: string; Calories: number; Protein: number; Fat: number }>;
  totalCalories: number;
  calorieTarget: number;
  totalProtein: number;
  proteinTarget: number;
  totalFat: number;
  type: 'bar' | 'pie' | 'progress';
}

const COLORS = ['#2563eb', '#059669', '#d97706']; // Updated to match Home's blue, emerald, and a complementary orange for fat

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 p-3 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-lg text-slate-800 dark:text-slate-200 text-sm backdrop-blur-sm">
        <p className="font-medium mb-2">{`Food: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="mb-1 flex items-center">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="font-medium">{entry.name}:</span>
            <span className="ml-1 font-medium">
              {Math.round(entry.value || 0)} {entry.name === 'Calories' ? 'cal' : 'g'}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { name, value, payload: { unit } } = payload[0];
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 p-3 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-lg backdrop-blur-sm text-slate-800 dark:text-slate-200">
        <p className="font-medium">{name}</p>
        <p className="text-sm">Value: {Math.round(value ?? 0)} {unit}</p>
      </div>
    );
  }
  return null;
};

interface CustomRadialTooltipProps extends TooltipProps<number, string> {
  calorieTarget: number;
  proteinTarget: number;
}

// Custom tooltip for radial chart
const CustomRadialTooltip = ({ active, payload, calorieTarget, proteinTarget }: CustomRadialTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const truncatedValue = Number(item.value).toFixed(1);

    let absoluteText = '';
    if (item.name === 'Calories') {
      absoluteText = `${Math.round((item.value / 100) * calorieTarget)} cal of ${calorieTarget} cal target`;
    } else {
      const target = item.name === 'Protein' ? proteinTarget : (calorieTarget * 0.3 / 9);
      absoluteText = `${Math.round((item.value / 100) * target)} g of ${Math.round(target)} g target`;
    }

    return (
      <div className="bg-white/60 dark:bg-slate-800/60 p-3 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-lg backdrop-blur-sm text-slate-800 dark:text-slate-200">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm">Progress: {truncatedValue}% ({absoluteText})</p>
      </div>
    );
  }
  return null;
};

// Custom label formatter for X-axis to handle long names
const formatXAxisLabel = (value: string) => {
  if (value.length > 12) {
    return value.substring(0, 12) + '...';
  }
  return value;
};

export default function NutritionCharts({ chartData, totalCalories, calorieTarget, totalProtein, proteinTarget, totalFat, type }: NutritionChartsProps) {
  // Progress data for radial charts
  const progressData = [
    { name: 'Calories', value: Math.min((totalCalories / calorieTarget) * 100, 100), fill: COLORS[0] },
    { name: 'Protein', value: Math.min((totalProtein / proteinTarget) * 100, 100), fill: COLORS[1] },
    { name: 'Fat', value: (totalFat / (calorieTarget * 0.3 / 9)) * 100, fill: COLORS[2] },
  ];

  // Pie data with raw values and units
  const pieData = [
    { name: 'Calories', value: totalCalories, unit: 'cal' },
    { name: 'Protein', value: totalProtein, unit: 'g' },
    { name: 'Fat', value: totalFat, unit: 'g' },
  ];

  if (type === 'bar') {
    return (
      <div className="w-full h-80 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm p-4 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ 
              top: 20, 
              right: 10, 
              left: 0, 
              bottom: 80 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb/50" className="dark:stroke-slate-700/50" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
              interval={0}
              tickFormatter={formatXAxisLabel}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
              label={{ 
                value: 'Amount (cal/g)', 
                angle: -90, 
                position: 'insideLeft',
                style: { 
                  textAnchor: 'middle', 
                  fill: '#64748b',
                  fontSize: '12px'
                }
              }} 
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: '12px', 
                color: '#64748b' 
              }} 
            />
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
      <div className="w-full h-64 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm p-4">
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
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'progress') {
    return (
      <div className="w-full h-64 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm p-4 grid grid-cols-3 gap-4">
        {progressData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" barSize={10} data={[item]}>
                <RadialBar background={{ fill: '#e5e7eb/50' }} dataKey="value" cornerRadius={10} fill={item.fill} />
                <Tooltip content={<CustomRadialTooltip calorieTarget={calorieTarget} proteinTarget={proteinTarget} />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <span className="mt-2 text-xs sm:text-sm font-medium text-center text-slate-800 dark:text-slate-200">
              {item.name}: {Math.round(item.value)}% of target
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
