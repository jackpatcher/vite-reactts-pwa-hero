import { createContext, useContext, useState } from "react";
import type { ReactNode, ReactElement } from "react";
import { CheckCircle } from "flowbite-react-icons/solid";

export type ToastType = "success" | "danger" | "info" | "warning";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  icon?: ReactElement;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = (options: ToastOptions) => {
    setToast(options);
    setVisible(true);
    setTimeout(() => setVisible(false), options.duration || 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && visible && (
        <div
          className={`fixed z-50 bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${toast.type === "success" ? "text-green-600" : toast.type === "danger" ? "text-red-600" : toast.type === "warning" ? "text-yellow-600" : "text-blue-600"}`}
        >
          {toast.icon || <CheckCircle className="text-green-500 mr-2" size={18} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};
