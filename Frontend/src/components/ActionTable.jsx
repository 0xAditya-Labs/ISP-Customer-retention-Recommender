import { AlertTriangle, Phone, CheckCircle2, Circle, Download } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Saved', label: 'Saved' },
  { value: 'Churned', label: 'Churned' },
  { value: 'Voicemail', label: 'Voicemail' },
];

function riskBadge(probability) {
  if (probability >= 0.85) return { label: 'Critical', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', darkBg: 'bg-red-950', darkText: 'text-red-300' };
  if (probability >= 0.7) return { label: 'High', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', darkBg: 'bg-amber-950', darkText: 'text-amber-300' };
  return { label: 'Medium', bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', darkBg: 'bg-yellow-950', darkText: 'text-yellow-300' };
}

function ActionTableRow({ item, completed, onToggle, darkMode, feedback, onFeedbackChange, status, onStatusChange }) {
  const risk = riskBadge(item.Churn_Probability);

  const inputBase = `w-full px-2 py-1.5 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500'
      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
  }`;

  const selectBase = `w-full px-2 py-1.5 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-slate-200'
      : 'bg-white border-slate-200 text-slate-800'
  }`;

  return (
    <tr className={`border-b transition-all ${
      darkMode ? 'border-slate-700' : 'border-slate-100'
    } ${completed ? 'opacity-40' : darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
      <td className={`px-4 py-3 text-sm font-mono ${
        completed ? 'line-through' : ''
      } ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
        {item.customerID}
      </td>
      <td className={`px-4 py-3 text-sm ${completed ? 'line-through' : ''} ${
        darkMode ? 'text-slate-400' : 'text-slate-700'
      }`}>
        <span className="flex items-center gap-2">
          <Phone className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          {item.phone}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm font-semibold tabular-nums ${
        completed ? 'line-through text-slate-400' : darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {'\u20B9'}{item.clv_proxy.toLocaleString('en-IN')}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`flex-1 h-1.5 rounded-full overflow-hidden max-w-[80px] ${
            darkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <div
              className={`h-full rounded-full ${
                item.Churn_Probability >= 0.85
                  ? 'bg-red-500'
                  : item.Churn_Probability >= 0.7
                  ? 'bg-amber-500'
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${item.Churn_Probability * 100}%` }}
            />
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              darkMode ? `${risk.darkBg} ${risk.darkText}` : `${risk.bg} ${risk.text}`
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
            {(item.Churn_Probability * 100).toFixed(0)}%
          </span>
        </div>
      </td>
      <td className={`px-4 py-3 text-sm ${completed ? 'line-through text-slate-400' : ''} ${
        darkMode ? 'text-slate-300' : 'text-slate-700'
      }`}>
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {item.Top_Churn_Driver}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm ${completed ? 'line-through text-slate-400' : ''} ${
        darkMode ? 'text-teal-400' : 'text-teal-700'
      } font-medium`}>
        {item.Suggested_Action}
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={feedback || ''}
          onChange={(e) => onFeedbackChange(item.customerID, e.target.value)}
          placeholder="Add notes..."
          className={inputBase}
          disabled={completed}
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={status || 'Pending'}
          onChange={(e) => onStatusChange(item.customerID, e.target.value)}
          className={selectBase}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            completed
              ? darkMode
                ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5" />
              Mark Done
            </>
          )}
        </button>
      </td>
    </tr>
  );
}

export function ActionTable({ items, completedIds, onToggleComplete, darkMode, feedbackMap, statusMap, onFeedbackChange, onStatusChange, onExportCSV }) {
  const completedCount = items.filter((i) => completedIds.has(i.customerID)).length;

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className={`px-5 py-4 border-b flex items-center justify-between ${
        darkMode ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-base font-semibold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Agent Action Plan
          </h2>
          <p className={`text-xs mt-0.5 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Prioritized list of at-risk customers to contact
          </p>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              {completedCount}/{items.length} completed
            </span>
          )}
          <button
            onClick={onExportCSV}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
              darkMode
                ? 'text-teal-400 bg-slate-700 border-slate-600 hover:bg-slate-600'
                : 'text-teal-700 bg-white border-slate-200 hover:bg-teal-50'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${
              darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              {['Customer ID', 'Phone', 'Revenue at Risk', 'Churn Risk', 'Top Driver', 'Recommended Action', 'Feedback / Notes', 'Final Status', 'Status'].map((col) => (
                <th key={col} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ActionTableRow
                key={item.customerID}
                item={item}
                completed={completedIds.has(item.customerID)}
                onToggle={() => onToggleComplete(item.customerID)}
                darkMode={darkMode}
                feedback={feedbackMap[item.customerID]}
                onFeedbackChange={onFeedbackChange}
                status={statusMap[item.customerID]}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
