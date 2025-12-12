import React, { useMemo } from 'react';

// --- 1. Dummy Data for Charts and Stats ---

// NOTE: Percentages must add up to 100
const PIE_DATA = [
  { name: 'Mobile Users', value: 45, color: 'hsl(140, 60%, 50%)' }, // Emerald-like
  { name: 'Desktop Users', value: 35, color: 'hsl(40, 80%, 60%)' }, // Amber-like
  { name: 'Tablet Users', value: 20, color: 'hsl(210, 70%, 50%)' }, // Blue-like
];

const statsData = [
    // ... (Stats data remains the same)
    {
      title: 'Total Users',
      value: '25,400',
      change: '+5.2%',
      type: 'increase',
      iconClass: 'fa-solid fa-users',
    },
    {
      title: 'Monthly Revenue',
      value: '$12,500',
      change: '+1.8%',
      type: 'increase',
      iconClass: 'fa-solid fa-dollar-sign',
    },
    {
      title: 'Page Views (24h)',
      value: '189,012',
      change: '-2.5%',
      type: 'decrease',
      iconClass: 'fa-solid fa-chart-line',
    },
    {
      title: 'Avg. Session Time',
      value: '3:45 min',
      change: '-12%',
      type: 'decrease',
      iconClass: 'fa-solid fa-clock',
    },
];

// --- 2. Custom Component for Reusable Stat Card ---

const StatCard = ({ title, value, change, type, iconClass }) => {
  const changeColor = type === 'increase' ? 'text-emerald-400' : 'text-red-400';
  const arrow = type === 'increase' ? '▲' : '▼';

  return (
    <div className="p-5 bg-gray-800 rounded-lg shadow-xl flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <i className={`${iconClass} text-xl text-indigo-400`}></i> 
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="flex items-center">
        <span className={`text-sm font-semibold ${changeColor}`}>
          {arrow} {change}
        </span>
        <span className="text-xs text-gray-500 ml-2">since last month</span>
      </div>
    </div>
  );
};

// --- 3. CSS-Only Pie Chart Component ---

const CssPieChart = ({ data }) => {
  // 1. Generate the conic-gradient string
  const conicGradient = useMemo(() => {
    let start = 0;
    const segments = data.map((item, index) => {
      const end = start + item.value;
      const segment = `${item.color} ${start}% ${end}%`;
      start = end;
      return segment;
    }).join(', ');
    
    // Add the final segment to ensure it closes the circle completely
    return `conic-gradient(${segments})`;
  }, [data]);

  // 2. Map the data to the legend items
  const legendItems = data.map((item, index) => (
    <div key={index} className="flex items-center text-sm text-gray-300">
      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
      {item.name}: <span className="font-semibold ml-1">{item.value}%</span>
    </div>
  ));

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-48 h-48 rounded-full shadow-lg relative mb-6">
        <div 
          className="w-full h-full rounded-full" 
          // Apply the calculated conic gradient directly as a style property
          style={{ backgroundImage: conicGradient }}
        />
        {/* Optional: Central label for a Donut effect */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 border-gray-800">
                <span className="text-white text-lg font-bold">100%</span>
            </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-auto">
        {legendItems}
      </div>
    </div>
  );
};


// --- 4. Main Dashboard Component ---

const AnalyticsDashboardTailwind = () => {
  // Removed loading state for simplicity, as no external dependency is being loaded

  return (
    // Outer container with black background (bg-gray-900) and dark mode active
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
        Analytics Dashboard Overview
      </h1>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Data Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Distribution Pie Chart (CSS Only) */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-xl h-96 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-white mb-6">
            User Device Distribution
          </h2>
          {/* Render the CSS-Only Pie Chart */}
          <CssPieChart data={PIE_DATA} />
        </div>

        {/* Activity Log / Table Placeholder (Remains the same) */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-xl h-96">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent System Activity
          </h2>
          <div className="h-[calc(100%-40px)] overflow-y-auto">
            <ul className="space-y-3">
              <li className="p-3 bg-gray-700 rounded-md text-gray-200 text-sm">
                <span className="text-emerald-400">[SUCCESS]</span> User `alice@corp.com` logged in. (1 min ago)
              </li>
              <li className="p-3 bg-gray-700 rounded-md text-gray-200 text-sm">
                <span className="text-blue-400">[INFO]</span> New report `Q4_Sales_2025` generated. (15 min ago)
              </li>
              <li className="p-3 bg-gray-700 rounded-md text-gray-200 text-sm">
                <span className="text-red-400">[ERROR]</span> Database connection failed on server B. (1 hour ago)
              </li>
               <li className="p-3 bg-gray-700 rounded-md text-gray-200 text-sm">
                <span className="text-amber-400">[WARNING]</span> Disk space low on primary application server. (3 hours ago)
              </li>
               <li className="p-3 bg-gray-700 rounded-md text-gray-200 text-sm">
                <span className="text-blue-400">[INFO]</span> Scheduled backup completed successfully. (5 hours ago)
              </li>
              <li className="p-3 bg-gray-700 rounded-md text-gray-200 text-sm">
                <span className="text-emerald-400">[SUCCESS]</span> User `bob@corp.com` updated profile. (8 hours ago)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardTailwind;