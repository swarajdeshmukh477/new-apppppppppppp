import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Download,
  CheckCircle2,
  Printer,
  Clock,
  Users,
} from 'lucide-react';
import {
  FrameId,
  PrintSettingsState,
  PrintShop,
  UploadedDoc,
} from '../../types/swaraj';
import { ORDER_STAGES } from '../../data/mockData';
import { MobileShell } from './MobileShell';

interface Frame08Props {
  orderId: string;
  shop: PrintShop;
  documents: UploadedDoc[];
  settings: PrintSettingsState;
  totalAmount: number;
  onNavigate: (frame: FrameId) => void;
}

export const Frame08OrderTracking: React.FC<Frame08Props> = ({
  orderId,
  shop,
  documents,
  settings,
  totalAmount,
  onNavigate,
}) => {
  const [activeStage, setActiveStage] = useState(5); // Default: Printing
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const totalPages = documents.reduce((sum, d) => sum + d.pages, 0);

  return (
    <MobileShell toastMessage={toast} onDismissToast={() => setToast(null)}>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('01')}
          aria-label="Back to Home"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-semibold text-[#14213D]">
            Order Tracking
          </h1>
          <p className="font-mono-spec text-[11px] text-[#64748B]">{orderId}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            setActiveStage((s) => (s >= 7 ? 1 : s + 1))
          }
          className="text-[11px] font-semibold text-[#2563EB] px-2 py-1 rounded-lg hover:bg-blue-50"
        >
          Next Step
        </button>
      </header>

      <div className="px-4 py-4 space-y-3.5 pb-6">
        {/* Live Queue & Pickup Metrics */}
        <section className="bg-[#14213D] text-white rounded-2xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] text-slate-300">
                Estimated Pickup Time
              </p>
              <p className="text-xl font-bold tabular mt-0.5">
                Today, 4:18 PM
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-300">Queue Position</p>
              <p className="text-xl font-bold tabular text-blue-300 mt-0.5">
                {activeStage >= 6 ? 'Ready' : '#3'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/10 text-[11px]">
            <div>
              <p className="text-slate-300 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Ahead</span>
              </p>
              <p className="font-semibold tabular mt-0.5">
                {activeStage >= 5 ? '0 orders' : '2 orders'}
              </p>
            </div>
            <div>
              <p className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Wait Time</span>
              </p>
              <p className="font-semibold tabular mt-0.5">
                {activeStage >= 6 ? '0 mins' : '~8 mins'}
              </p>
            </div>
            <div>
              <p className="text-slate-300 flex items-center gap-1">
                <Printer className="w-3 h-3" />
                <span>Printer</span>
              </p>
              <p className="font-semibold text-emerald-300 mt-0.5 truncate">
                {activeStage >= 6 ? 'Done' : 'Active'}
              </p>
            </div>
          </div>
        </section>

        {/* Shop, Document & Payment Info */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2.5 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-[#14213D] text-sm">
                {shop.name}
              </p>
              <p className="text-[#64748B] mt-0.5">{shop.address}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-[#64748B] tabular">
            <span className="font-medium text-[#14213D]">
              {documents.length} file(s) · {totalPages} pgs
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {settings.copies} copy ({settings.colorMode.toUpperCase()})
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#16A34A]">
              Paid ₹{totalAmount.toFixed(2)} (UPI)
            </span>
          </div>
        </section>

        {/* Vertical Order Progress Tracker (7 Stages) */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-[#14213D]">
            Live Order Progress
          </h2>
          <div className="space-y-0">
            {ORDER_STAGES.map((stage, idx) => {
              const isDone = stage.step < activeStage;
              const isCurrent = stage.step === activeStage;
              const isLast = idx === ORDER_STAGES.length - 1;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActiveStage(stage.step)}
                  className="w-full flex items-stretch gap-3 text-left group"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                        isDone
                          ? 'bg-[#16A34A] text-white'
                          : isCurrent
                            ? 'bg-[#2563EB] text-white ring-4 ring-blue-100'
                            : 'bg-slate-100 text-[#64748B] border border-slate-200'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        stage.step
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 min-h-[20px] my-1 ${
                          isDone ? 'bg-[#16A34A]' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>

                  <div className="pb-3.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-[#2563EB]'
                            : isDone
                              ? 'text-[#14213D]'
                              : 'text-[#64748B]'
                        }`}
                      >
                        {stage.title}
                      </p>
                      <span className="text-[11px] text-[#64748B] tabular shrink-0">
                        {stage.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {stage.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Buttons: Contact Shop, View Location, Download Receipt */}
        <section className="space-y-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => notify(`Calling ${shop.phone}`)}
              className="min-h-[44px] px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#14213D] flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Contact Shop</span>
            </button>
            <button
              type="button"
              onClick={() =>
                notify(`Directions opened: ${shop.area} (${shop.distanceKm} km)`)
              }
              className="min-h-[44px] px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#14213D] flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>View Location</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => notify(`Downloaded Receipt_${orderId}.pdf`)}
            className="w-full min-h-[46px] rounded-xl bg-[#14213D] hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
        </section>
      </div>
    </MobileShell>
  );
};
