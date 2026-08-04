import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, RefreshCw } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (title, message) => addToast('success', title, message);
  const error = (title, message) => addToast('error', title, message);
  const info = (title, message) => addToast('info', title, message);
  const loading = (title, message) => addToast('loading', title, message);

  return (
    <ToastContext.Provider value={{ success, error, info, loading, addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard = ({ toast, onClose }) => {
  const { type, title, message } = toast;

  const styles = {
    success: 'border-green-500 bg-slate-900',
    error: 'border-red-500 bg-slate-900',
    info: 'border-blue-500 bg-slate-900',
    loading: 'border-yellow-500 bg-slate-900',
  };

  const icons = {
    success: <CheckCircle className="text-green-500 w-6 h-6" />,
    error: <AlertCircle className="text-red-500 w-6 h-6" />,
    info: <Info className="text-blue-500 w-6 h-6" />,
    loading: <RefreshCw className="text-yellow-500 w-6 h-6 animate-spin" />,
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg shadow-xl border-l-4 min-w-[300px] max-w-sm animate-slide-up ${styles[type]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <h4 className="text-slate-100 font-semibold text-sm">{title}</h4>
        {message && <p className="text-slate-400 text-sm mt-1">{message}</p>}
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
