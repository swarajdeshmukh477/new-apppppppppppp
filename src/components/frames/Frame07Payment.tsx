import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Share2,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import {
  FrameId,
  PaymentMethodMode,
  PaymentVisualState,
  UpiAppId,
} from '../../types/swaraj';
import { MobileShell } from './MobileShell';

interface Frame07Props {
  orderId: string;
  totalAmount: number;
  shopName: string;
  onNavigate: (frame: FrameId) => void;
}

export const Frame07Payment: React.FC<Frame07Props> = ({
  orderId,
  totalAmount,
  shopName,
  onNavigate,
}) => {
  const [payMode, setPayMode] = useState<PaymentMethodMode>('self');
  const [selectedUpi, setSelectedUpi] = useState<UpiAppId>('gpay');
  const [statusState, setStatusState] =
    useState<PaymentVisualState>('waiting');
  const [toast, setToast] = useState<string | null>(null);

  const upiApps: { id: UpiAppId; name: string; tag: string }[] = [
    { id: 'gpay', name: 'Google Pay', tag: 'GP' },
    { id: 'phonepe', name: 'PhonePe', tag: 'PP' },
    { id: 'paytm', name: 'Paytm UPI', tag: 'PT' },
    { id: 'bhim', name: 'BHIM UPI', tag: 'BH' },
  ];

  const handleConfirm = () => {
    setStatusState('success');
    setToast('UPI Payment confirmed');
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <MobileShell toastMessage={toast} onDismissToast={() => setToast(null)}>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('06')}
          aria-label="Back to Print Settings"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#14213D]">Payment</h1>
        <span className="font-mono-spec text-xs font-medium text-[#64748B]">
          {orderId}
        </span>
      </header>

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Order & Amount Header */}
        <section className="bg-[#14213D] text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-300">
              Order {orderId} · {shopName}
            </p>
            <p className="text-2xl font-bold tabular mt-1">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-blue-300" />
          </div>
        </section>

        {/* Payment Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/60 rounded-xl">
          <button
            type="button"
            onClick={() => setPayMode('self')}
            className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
              payMode === 'self'
                ? 'bg-white text-[#14213D] shadow-xs'
                : 'text-[#64748B]'
            }`}
          >
            Pay Yourself
          </button>
          <button
            type="button"
            onClick={() => setPayMode('other')}
            className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
              payMode === 'other'
                ? 'bg-white text-[#14213D] shadow-xs'
                : 'text-[#64748B]'
            }`}
          >
            Someone Else Will Pay
          </button>
        </div>

        {/* Pay Yourself: UPI Apps */}
        {payMode === 'self' ? (
          <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <h2 className="text-xs font-semibold text-[#14213D]">
              Select UPI App
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {upiApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedUpi(app.id)}
                  className={`min-h-[52px] px-3 rounded-xl border flex items-center gap-2.5 text-left transition-colors ${
                    selectedUpi === app.id
                      ? 'bg-blue-50 border-[#2563EB] text-[#14213D]'
                      : 'bg-[#F8FAFC] border-slate-200 text-[#14213D]'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      selectedUpi === app.id
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white border border-slate-200 text-[#14213D]'
                    }`}
                  >
                    {app.tag}
                  </span>
                  <span className="text-xs font-semibold truncate">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          /* Someone Else Will Pay: Payment QR Illustration */
          <section className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center space-y-3">
            <p className="text-xs font-semibold text-[#14213D]">
              Scan QR to Pay for Order {orderId}
            </p>
            <div className="w-40 h-40 mx-auto rounded-2xl bg-[#F8FAFC] border border-slate-200 p-3 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#14213D]"
                aria-label="UPI Payment QR Code"
              >
                <rect x="6" y="6" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="14" y="14" width="10" height="10" fill="currentColor" />
                <rect x="68" y="6" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="76" y="14" width="10" height="10" fill="currentColor" />
                <rect x="6" y="68" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="14" y="76" width="10" height="10" fill="currentColor" />
                <rect x="40" y="10" width="8" height="8" fill="currentColor" />
                <rect x="52" y="14" width="8" height="14" fill="currentColor" />
                <rect x="40" y="34" width="20" height="20" rx="3" fill="#2563EB" />
                <rect x="10" y="42" width="12" height="8" fill="currentColor" />
                <rect x="68" y="42" width="10" height="16" fill="currentColor" />
                <rect x="44" y="66" width="12" height="10" fill="currentColor" />
                <rect x="68" y="68" width="22" height="8" fill="currentColor" />
                <rect x="74" y="82" width="16" height="10" fill="currentColor" />
                <rect x="44" y="84" width="14" height="8" fill="currentColor" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => {
                setToast('Payment link copied to share');
                setTimeout(() => setToast(null), 2000);
              }}
              className="min-h-[40px] px-4 rounded-xl bg-blue-50 text-[#2563EB] text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Payment Link</span>
            </button>
          </section>
        )}

        {/* Payment Visual States Preview (Waiting, Successful, Failed) */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#14213D]">
              Payment Status State
            </span>
            <div className="flex items-center gap-1">
              {(['waiting', 'success', 'failed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusState(st)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                    statusState === st
                      ? 'bg-[#14213D] text-white'
                      : 'bg-slate-100 text-[#64748B]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {statusState === 'waiting' && (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-900">
                  Awaiting UPI Confirmation
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Approve ₹{totalAmount.toFixed(2)} in your UPI app or tap Confirm
                  Payment below.
                </p>
              </div>
            </div>
          )}

          {statusState === 'success' && (
            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">
                  Payment Successful
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  ₹{totalAmount.toFixed(2)} received. Your order is sent to the
                  print queue.
                </p>
              </div>
            </div>
          )}

          {statusState === 'failed' && (
            <div className="rounded-xl bg-red-50/80 border border-red-200/80 p-3 flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-900">
                  Payment Failed or Timed Out
                </p>
                <p className="text-[11px] text-red-700 mt-0.5">
                  No amount was deducted. Retry with another UPI app or QR.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Secure Payment Indicator */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Secure Payment · 256-bit Encrypted UPI</span>
        </div>
      </div>

      {/* Sticky Bottom Confirm CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shrink-0">
        {statusState === 'success' ? (
          <button
            type="button"
            onClick={() => onNavigate('08')}
            className="w-full min-h-[48px] rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Track Print Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full min-h-[48px] rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>
              {statusState === 'failed' ? 'Retry Payment' : 'Confirm Payment'}
            </span>
          </button>
        )}
      </div>
    </MobileShell>
  );
};
