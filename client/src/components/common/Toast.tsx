// components/common/Toast.tsx
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'loading';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Анимация появления
    setTimeout(() => setIsVisible(true), 10);

    // Автоматическое закрытие
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-[10px]"></i>
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <i className="fas fa-times text-white text-[10px]"></i>
          </div>
        );
      case 'loading':
        return (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        );
      default:
        return (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <i className="fas fa-info text-white text-[10px]"></i>
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-out ${
        isVisible && !isLeaving
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-5'
      }`}
    >
      <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-4 py-2.5 flex items-center gap-3 min-w-[200px] max-w-[90vw]">
        {getIcon()}
        <span className="text-white text-sm font-medium tracking-wide">{message}</span>
      </div>
    </div>
  );
};

let toastContainer: HTMLDivElement | null = null;
let root: any = null;

export const showToast = (message: string, type?: ToastProps['type'], duration?: number) => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
    root = createRoot(toastContainer);
  }

  const handleClose = () => {
    if (root && toastContainer) {
      root.render(null);
      toastContainer.remove();
      toastContainer = null;
      root = null;
    }
  };

  root.render(<Toast message={message} type={type} duration={duration} onClose={handleClose} />);
};

export const toast = {
  success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
  error: (msg: string, duration?: number) => showToast(msg, 'error', duration),
  info: (msg: string, duration?: number) => showToast(msg, 'info', duration),
  loading: (msg: string, duration?: number) => showToast(msg, 'loading', duration),
};

export default toast;