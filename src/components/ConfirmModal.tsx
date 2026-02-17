import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  buttonColor?: string; // hex color like #f97316
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  buttonColor = "#2563eb", // default blue
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-[1000] p-4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-[calc(100vw-2rem)] max-w-sm border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-gray-700 dark:text-gray-300 text-base">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                backgroundColor: buttonColor,
                opacity: isLoading ? 0.6 : 1,
              }}
              className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? "Loading..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
