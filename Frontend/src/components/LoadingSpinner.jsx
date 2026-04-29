export function LoadingSpinner({ darkMode }) {
  return (
    <div className={`rounded-xl border p-8 shadow-sm ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className={`absolute inset-0 rounded-full border-4 ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`} />
          <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className={`text-sm font-medium ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Analyzing customer data...
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Running churn prediction model
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className={`h-4 rounded animate-pulse w-3/4 ${
          darkMode ? 'bg-slate-700' : 'bg-slate-100'
        }`} />
        <div className={`h-4 rounded animate-pulse w-1/2 ${
          darkMode ? 'bg-slate-700' : 'bg-slate-100'
        }`} />
        <div className={`h-4 rounded animate-pulse w-2/3 ${
          darkMode ? 'bg-slate-700' : 'bg-slate-100'
        }`} />
      </div>

      <div className="mt-6 grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-20 rounded-lg animate-pulse ${
            darkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`} />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-10 rounded-lg animate-pulse ${
            darkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`} />
        ))}
      </div>
    </div>
  );
}
