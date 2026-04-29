import { Users, DollarSign, TrendingUp, PiggyBank, Target, SlidersHorizontal } from 'lucide-react';

function formatCurrency(value) {
  if (value >= 10000000) return `\u20B9${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `\u20B9${(value / 100000).toFixed(1)}L`;
  return `\u20B9${value.toLocaleString('en-IN')}`;
}

const CARDS = [
  {
    key: 'users_called',
    label: 'Customers Targeted',
    icon: Users,
    iconBg: 'bg-blue-100',
    darkIconBg: 'bg-blue-900',
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    key: 'campaign_cost',
    label: 'Campaign Cost',
    icon: DollarSign,
    iconBg: 'bg-amber-100',
    darkIconBg: 'bg-amber-900',
    format: formatCurrency,
  },
  {
    key: 'users_saved',
    label: 'Projected Saves',
    icon: Target,
    iconBg: 'bg-teal-100',
    darkIconBg: 'bg-teal-900',
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    key: 'revenue_saved',
    label: 'Revenue Saved',
    icon: TrendingUp,
    iconBg: 'bg-emerald-100',
    darkIconBg: 'bg-emerald-900',
    format: formatCurrency,
  },
  {
    key: 'net_roi',
    label: 'Net ROI',
    icon: PiggyBank,
    highlight: true,
    iconBg: 'bg-teal-500',
    darkIconBg: 'bg-teal-500',
    format: formatCurrency,
  },
];

function AssumptionsPanel({ successRate, costPerCall, onSuccessRateChange, onCostPerCallChange, darkMode }) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className={`w-4 h-4 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Assumptions
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Target Success Rate
            </label>
            <span className={`text-xs font-bold tabular-nums ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
              {successRate}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={successRate}
            onChange={(e) => onSuccessRateChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-600"
            style={{
              background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${successRate}%, ${darkMode ? '#334155' : '#e2e8f0'} ${successRate}%, ${darkMode ? '#334155' : '#e2e8f0'} 100%)`,
            }}
          />
          <div className={`flex justify-between mt-1 text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>1%</span>
            <span>100%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Cost Per Call
            </label>
            <span className={`text-xs font-bold tabular-nums ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
              {'\u20B9'}{costPerCall}
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={costPerCall}
            onChange={(e) => onCostPerCallChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-600"
            style={{
              background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${((costPerCall - 50) / 450) * 100}%, ${darkMode ? '#334155' : '#e2e8f0'} ${((costPerCall - 50) / 450) * 100}%, ${darkMode ? '#334155' : '#e2e8f0'} 100%)`,
            }}
          />
          <div className={`flex justify-between mt-1 text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>{'\u20B9'}50</span>
            <span>{'\u20B9'}500</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ROIMetricCards({ metrics, darkMode, successRate, costPerCall, onSuccessRateChange, onCostPerCallChange }) {
  return (
    <div className="space-y-4">
      <AssumptionsPanel
        successRate={successRate}
        costPerCall={costPerCall}
        onSuccessRateChange={onSuccessRateChange}
        onCostPerCallChange={onCostPerCallChange}
        darkMode={darkMode}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const value = metrics[card.key];
          const isHighlight = card.highlight;
          const isNegativeROI = card.key === 'net_roi' && value < 0;
          const iconBg = darkMode ? card.darkIconBg : card.iconBg;

          return (
            <div
              key={card.key}
              className={`rounded-xl p-4 border transition-all ${
                isHighlight
                  ? isNegativeROI
                    ? 'bg-red-600 border-red-700 shadow-lg shadow-red-600/20'
                    : 'bg-teal-600 border-teal-700 shadow-lg shadow-teal-600/20'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 shadow-sm hover:shadow-md'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <Icon className={`w-5 h-5 ${isHighlight ? 'text-white' : darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                </div>
                <span className={`text-xs font-medium ${
                  isHighlight ? 'text-teal-100' : darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {card.label}
                </span>
              </div>
              <p className={`text-xl font-bold ${
                isHighlight ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {isNegativeROI && !isHighlight ? '-' : ''}{card.format(Math.abs(value))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
