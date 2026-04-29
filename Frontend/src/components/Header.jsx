import { Shield, Menu } from 'lucide-react';

export function Header({ onToggleSidebar, darkMode }) {
  return (
    <header className={`h-16 border-b flex items-center px-6 gap-4 shrink-0 ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <button
        onClick={onToggleSidebar}
        className={`p-2 rounded-lg transition-colors lg:hidden ${
          darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
        }`}
        aria-label="Toggle sidebar"
      >
        <Menu className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className={`text-lg font-semibold leading-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Retention Agent Workspace
          </h1>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            AI-Powered Churn Prevention
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
          <span className="text-sm font-medium text-teal-700">A</span>
        </div>
      </div>
    </header>
  );
}
