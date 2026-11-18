import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  toastMessage?: string | null;
  onDismissToast?: () => void;
}

export const SwarajLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div
        className={`${dim} rounded-lg bg-[#2563EB] flex items-center justify-center shadow-xs`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9V3h12v6" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="7" rx="1" />
        </svg>
      </div>
      <span className="text-[15px] font-bold tracking-tight text-[#14213D] whitespace-nowrap">
        Swaraj Print
      </span>
    </div>
  );
};

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  toastMessage,
  onDismissToast,
}) => {
  return (
    <div className="relative w-[390px] h-[844px] bg-[#F8FAFC] text-[#14213D] flex flex-col overflow-hidden rounded-[36px] border border-[#CBD5E1] shadow-[0_18px_50px_-15px_rgba(20,33,61,0.18)] select-none">
      {/* iOS Mobile Status Bar (32px height) */}
      <div className="h-8 px-6 bg-white flex items-center justify-between text-[12px] font-semibold text-[#14213D] shrink-0 border-b border-slate-100">
        <span className="tabular tracking-tight">9:41</span>
        <div className="w-20 h-4 bg-[#14213D] rounded-full" aria-hidden="true" />
        <div className="flex items-center gap-1.5 text-[#14213D]" aria-hidden="true">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Vertically Scrollable Frame Body */}
      <div className="flex-1 flex flex-col overflow-y-auto mobile-scroll relative bg-[#F8FAFC]">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="h-5 bg-white/95 border-t border-slate-100 flex items-center justify-center shrink-0">
        <div className="w-28 h-1 rounded-full bg-slate-300" />
      </div>

      {/* Optional In-Frame Toast */}
      {toastMessage && (
        <div
          role="status"
          className="absolute bottom-8 left-4 right-4 z-50 bg-[#14213D] text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-3"
        >
          <span className="leading-snug">{toastMessage}</span>
          {onDismissToast && (
            <button
              type="button"
              onClick={onDismissToast}
              className="text-slate-300 hover:text-white text-[11px] font-semibold shrink-0"
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
};
