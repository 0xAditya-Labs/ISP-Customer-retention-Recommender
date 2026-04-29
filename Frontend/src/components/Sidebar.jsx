import { LayoutDashboard, Moon, Sun, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

export function Sidebar({ collapsed, onToggle, darkMode, onToggleDarkMode, onSignOut }) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-56'
      } flex flex-col transition-all duration-300 shrink-0 hidden lg:flex ${
        darkMode ? 'bg-slate-950' : 'bg-slate-900'
      } text-white`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-slate-300">
            Navigation
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-slate-700 transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              active
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </a>
        ))}
      </nav>

      <div className="px-2 pb-2">
        <button
          onClick={onToggleDarkMode}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full ${
            darkMode
              ? 'text-yellow-400 hover:bg-slate-800'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && (
            <span className="text-sm font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>

      <div className="px-2 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            onSignOut();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
