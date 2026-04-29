import { useState, useRef } from 'react';
import { Upload, FileText, X, Zap } from 'lucide-react';

export function FileUploadArea({ onRunAnalysis, loading, darkMode }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const ALLOWED_EXTS = ['.csv', '.xlsx', '.xls'];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && ALLOWED_EXTS.some((ext) => dropped.name.toLowerCase().endsWith(ext))) {
      setFile(dropped);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`rounded-xl border p-6 shadow-sm ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <h2 className={`text-base font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        Upload Customer Data
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-teal-400 bg-teal-50'
            : darkMode
            ? 'border-slate-600 hover:border-slate-500 bg-slate-700'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload
          className={`w-10 h-10 mx-auto mb-3 ${
            dragOver ? 'text-teal-500' : darkMode ? 'text-slate-500' : 'text-slate-400'
          }`}
        />
        <p className={`text-sm font-medium ${
          darkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {dragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
        </p>
        <p className={`text-xs mt-1 ${
          darkMode ? 'text-slate-500' : 'text-slate-500'
        }`}>
          or click to browse — .csv, .xlsx, .xls supported
        </p>
      </div>

      {file && (
        <div className={`mt-4 flex items-center gap-3 rounded-lg px-4 py-3 border ${
          darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
        }`}>
          <FileText className="w-5 h-5 text-teal-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              darkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {file.name}
            </p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className={`p-1 rounded-md transition-colors ${
              darkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-200'
            }`}
            aria-label="Remove file"
          >
            <X className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </button>
        </div>
      )}

      <button
        onClick={() => onRunAnalysis(file || undefined)}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-wait"
      >
        <Zap className="w-4 h-4" />
        {loading ? 'Running AI Analysis...' : 'Run AI Analysis'}
      </button>
    </div>
  );
}
