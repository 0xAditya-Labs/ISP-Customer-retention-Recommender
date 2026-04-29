import { useState } from 'react';
import { Layout } from './components/Layout';
import { FileUploadArea } from './components/FileUploadArea';
import { ROIMetricCards } from './components/ROIMetricCards';
import { ActionTable } from './components/ActionTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoginPage } from './components/LoginPage';
import { useChurnData } from './hooks/useChurnData';
import { AlertCircle, RotateCcw } from 'lucide-react';

function App() {
  const [token, setToken] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const {
    data, loading, error, completedIds,
    feedbackMap, statusMap,
    successRate, costPerCall, computedMetrics,
    runAnalysis, toggleCompleted,
    setFeedback, setFinalStatus,
    setSuccessRate, setCostPerCall,
    exportCSV, reset,
  } = useChurnData(token);

  const handleSignOut = () => {
    setToken(null);
    reset(); // Clear sensitive data from memory when logging out
  };

  if (!token) {
    return <LoginPage onLogin={(newToken) => setToken(newToken)} darkMode={darkMode} />;
  }

  return (
    <Layout darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} onSignOut={handleSignOut}>
      <div className="max-w-7xl mx-auto space-y-6">
        <FileUploadArea onRunAnalysis={runAnalysis} loading={loading} darkMode={darkMode} />

        {loading && <LoadingSpinner darkMode={darkMode} />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-semibold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Campaign ROI Summary
              </h2>
              <button
                onClick={reset}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                  darkMode
                    ? 'text-slate-400 bg-slate-800 border-slate-700 hover:bg-slate-700'
                    : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
            <ROIMetricCards
              metrics={computedMetrics}
              darkMode={darkMode}
              successRate={successRate}
              costPerCall={costPerCall}
              onSuccessRateChange={setSuccessRate}
              onCostPerCallChange={setCostPerCall}
            />
            <ActionTable
              items={data.action_plan}
              completedIds={completedIds}
              onToggleComplete={toggleCompleted}
              darkMode={darkMode}
              feedbackMap={feedbackMap}
              statusMap={statusMap}
              onFeedbackChange={setFeedback}
              onStatusChange={setFinalStatus}
              onExportCSV={exportCSV}
            />
          </>
        )}
      </div>
    </Layout>
  );
}

export default App;
