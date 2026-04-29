import { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ChevronRight } from 'lucide-react';

export function LoginPage({ onLogin, darkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Invalid credentials');
      }

      const result = await response.json();
      if (result.status === 'success') {
        onLogin(result.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="w-full max-w-md">
        
        {/* Decorative background blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <div className={`backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border ${
          darkMode ? 'bg-slate-800/80 border-slate-700/50 shadow-black/50' : 'bg-white/80 border-white/50 shadow-slate-200'
        }`}>
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                <Lock className="w-10 h-10" />
              </div>
            </div>
            
            <h2 className={`text-2xl font-bold text-center mb-2 tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Welcome Back
            </h2>
            <p className={`text-sm text-center mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Please sign in to access the Retention Dashboard
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full mt-8 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-400 hover:to-teal-500 active:scale-[0.98] shadow-lg shadow-teal-500/30 disabled:opacity-70 disabled:cursor-wait"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
        
        <p className={`text-center mt-6 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Hint: admin / admin123
        </p>
      </div>
    </div>
  );
}
