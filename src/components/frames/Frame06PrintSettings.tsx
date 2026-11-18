import React from 'react';
import {
  ArrowLeft,
  Minus,
  Plus,
  FileText,
  ArrowRight,
} from 'lucide-react';
import {
  FrameId,
  PrintSettingsState,
  PrintShop,
  UploadedDoc,
} from '../../types/swaraj';
import { MobileShell } from './MobileShell';

interface Frame06Props {
  shop: PrintShop;
  documents: UploadedDoc[];
  settings: PrintSettingsState;
  onChangeSettings: React.Dispatch<React.SetStateAction<PrintSettingsState>>;
  onNavigate: (frame: FrameId) => void;
}

export function calculateOrderTotal(
  shop: PrintShop,
  documents: UploadedDoc[],
  settings: PrintSettingsState
) {
  const docPages = Math.max(
    1,
    documents.reduce((acc, d) => acc + d.pages, 0)
  );
  const effectivePages =
    settings.pageRangeMode === 'custom' ? Math.min(docPages, 12) : docPages;

  let perPageRate =
    settings.colorMode === 'color' ? shop.colorPrice : shop.bwPrice;
  if (settings.paperSize === 'A3') perPageRate = shop.a3Price;
  if (settings.paperSize === 'A5') perPageRate = Math.max(1, perPageRate - 0.5);

  const sideMultiplier = settings.sides === 'double' ? 0.9 : 1;
  const total =
    effectivePages * settings.copies * perPageRate * sideMultiplier;

  return {
    effectivePages,
    perPageRate,
    total: Number(total.toFixed(2)),
  };
}

export const Frame06PrintSettings: React.FC<Frame06Props> = ({
  shop,
  documents,
  settings,
  onChangeSettings,
  onNavigate,
}) => {
  const primaryDoc = documents[0]?.name ?? 'Final_Thesis_Report_v3.pdf';
  const { effectivePages, perPageRate, total } = calculateOrderTotal(
    shop,
    documents,
    settings
  );

  const update = <K extends keyof PrintSettingsState>(
    key: K,
    val: PrintSettingsState[K]
  ) => {
    onChangeSettings((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <MobileShell>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('05')}
          aria-label="Back to PDF Editor"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#14213D]">
          Print Customization
        </h1>
        <span className="text-xs font-medium text-[#64748B] tabular">
          {settings.paperSize}
        </span>
      </header>

      <div className="px-4 py-4 space-y-3.5 pb-24">
        {/* Selected Document Preview */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center gap-3.5">
          <div
            className={`shrink-0 rounded-lg border border-slate-200 bg-[#F8FAFC] flex flex-col items-center justify-center p-2 transition-all ${
              settings.orientation === 'landscape' ? 'w-20 h-14' : 'w-14 h-20'
            }`}
          >
            <FileText
              className={`w-5 h-5 ${
                settings.colorMode === 'color'
                  ? 'text-[#2563EB]'
                  : 'text-[#14213D]'
              }`}
            />
            <span className="text-[9px] font-semibold text-[#64748B] mt-1">
              {settings.colorMode === 'color' ? 'RGB' : 'B&W'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#14213D] truncate">
              {primaryDoc}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5 tabular">
              {documents.length} file(s) · {effectivePages} pages selected
            </p>
            <p className="text-[11px] font-medium text-[#2563EB] mt-1">
              {shop.name}
            </p>
          </div>
        </section>

        {/* Colour Selection & Paper Size */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#14213D] block">
              Colour Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bw', label: `B&W (₹${shop.bwPrice}/pg)` },
                { id: 'color', label: `Colour (₹${shop.colorPrice}/pg)` },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update('colorMode', opt.id as 'bw' | 'color')}
                  className={`min-h-[44px] px-3 rounded-xl border text-xs font-semibold transition-colors ${
                    settings.colorMode === opt.id
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-[#F8FAFC] border-slate-200 text-[#14213D]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#14213D] block">
              Paper Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['A4', 'A3', 'A5'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => update('paperSize', sz)}
                  className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors ${
                    settings.paperSize === sz
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-[#F8FAFC] border-slate-200 text-[#14213D]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Copies Selector */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-semibold text-[#14213D]">
                Number of Copies
              </p>
              <p className="text-[11px] text-[#64748B]">
                Collated &amp; stapled per set
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease copies"
                onClick={() =>
                  update('copies', Math.max(1, settings.copies - 1))
                }
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#14213D] tabular">
                {settings.copies}
              </span>
              <button
                type="button"
                aria-label="Increase copies"
                onClick={() => update('copies', settings.copies + 1)}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Pages, Sides & Orientation */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#14213D] block">
              Page Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Pages' },
                { id: 'custom', label: 'Custom Pages' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    update('pageRangeMode', opt.id as 'all' | 'custom')
                  }
                  className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors ${
                    settings.pageRangeMode === opt.id
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-[#F8FAFC] border-slate-200 text-[#14213D]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {settings.pageRangeMode === 'custom' && (
              <input
                type="text"
                value={settings.customRange}
                onChange={(e) => update('customRange', e.target.value)}
                placeholder="e.g. 1-10, 12"
                className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#14213D] focus:outline-none focus:border-[#2563EB]"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#14213D] block">
              Print Sides
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'single', label: 'Single-sided' },
                { id: 'double', label: 'Double-sided' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update('sides', opt.id as 'single' | 'double')}
                  className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors ${
                    settings.sides === opt.id
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-[#F8FAFC] border-slate-200 text-[#14213D]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#14213D] block">
              Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'portrait', label: 'Portrait' },
                { id: 'landscape', label: 'Landscape' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    update(
                      'orientation',
                      opt.id as 'portrait' | 'landscape'
                    )
                  }
                  className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors ${
                    settings.orientation === opt.id
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-[#F8FAFC] border-slate-200 text-[#14213D]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <h2 className="text-sm font-semibold text-[#14213D]">Order Summary</h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Print Studio</span>
              <span className="font-medium text-[#14213D]">{shop.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Pages × Copies</span>
              <span className="font-medium text-[#14213D] tabular">
                {effectivePages} pgs × {settings.copies}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Printing Rate</span>
              <span className="font-medium text-[#14213D] tabular">
                ₹{perPageRate.toFixed(2)}/pg ({settings.sides})
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-[#14213D]">
              <span>Total Payable</span>
              <span className="text-[#2563EB] tabular">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('07')}
          className="w-full min-h-[48px] rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Continue to Payment · ₹{total.toFixed(2)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </MobileShell>
  );
};
