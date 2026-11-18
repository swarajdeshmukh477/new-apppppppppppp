import React, { useState } from 'react';
import { Check, Copy, ArrowRight, LayoutGrid } from 'lucide-react';
import { DESIGN_SYSTEM_TOKENS, FIGMA_FRAMES } from '../../data/mockData';
import { FrameId } from '../../types/swaraj';

interface FigmaRightInspectorProps {
  activeFrameId: FrameId;
  onSelectFrame: (id: FrameId) => void;
}

export const FigmaRightInspector: React.FC<FigmaRightInspectorProps> = ({
  activeFrameId,
  onSelectFrame,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const frame =
    FIGMA_FRAMES.find((f) => f.id === activeFrameId) ?? FIGMA_FRAMES[0];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto select-none">
      {/* Frame Properties */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#14213D]">
            Frame Inspector
          </span>
          <span className="font-mono-spec text-[11px] text-[#2563EB] font-medium">
            {frame.id} / 08
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#14213D]">
            {frame.frameTitle}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
            {frame.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="px-2.5 py-2 rounded-lg bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-[#64748B]">W</span>
            <span className="font-mono-spec font-medium text-[#14213D] tabular">
              {frame.width}
            </span>
          </div>
          <div className="px-2.5 py-2 rounded-lg bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-[#64748B]">H</span>
            <span className="font-mono-spec font-medium text-[#14213D] tabular">
              {frame.height}
            </span>
          </div>
        </div>

        {/* Auto Layout Spec */}
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#14213D]">
            <LayoutGrid className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Auto Layout · Vertical Scroll</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#64748B] tabular">
            <span>Padding: {frame.padding}</span>
            <span>Gap: {frame.autoLayoutGap}</span>
          </div>
        </div>

        {/* Prototype Flow Connection */}
        {frame.nextFrameId && (
          <button
            type="button"
            onClick={() => onSelectFrame(frame.nextFrameId!)}
            className="w-full px-3 py-2 rounded-xl bg-blue-50/70 hover:bg-blue-50 border border-blue-200/80 flex items-center justify-between text-xs font-semibold text-[#2563EB] transition-colors"
          >
            <span className="truncate">{frame.flowLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        )}
      </div>

      {/* Design System: Colors */}
      <div className="p-4 border-b border-slate-200 space-y-2.5">
        <p className="text-xs font-bold text-[#14213D]">Color Tokens</p>
        <div className="space-y-1.5">
          {DESIGN_SYSTEM_TOKENS.colors.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => handleCopyHex(c.hex)}
              className="w-full p-2 rounded-lg hover:bg-[#F8FAFC] flex items-center gap-2.5 text-left transition-colors group"
            >
              <span
                className="w-6 h-6 rounded-md border border-slate-300/80 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#14213D] truncate">
                  {c.name}
                </p>
                <p className="font-mono-spec text-[10px] text-[#64748B]">
                  {c.hex}
                </p>
              </div>
              {copiedHex === c.hex ? (
                <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#64748B] shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Typography & Spacing Tokens */}
      <div className="p-4 space-y-3">
        <p className="text-xs font-bold text-[#14213D]">
          Typography (Inter)
        </p>
        <div className="space-y-2">
          {DESIGN_SYSTEM_TOKENS.typography.map((t) => (
            <div key={t.token} className="text-[11px]">
              <p className="font-semibold text-[#14213D]">{t.token}</p>
              <p className="text-[#64748B] font-mono-spec text-[10px]">
                {t.spec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
