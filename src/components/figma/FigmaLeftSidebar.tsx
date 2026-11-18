import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Component,
  Frame,
  Image as ImageIcon,
  MousePointerClick,
  Type,
  Layers,
  Box,
} from 'lucide-react';
import { FIGMA_FRAMES } from '../../data/mockData';
import { FigmaLayerNode, FrameId, LayerKind } from '../../types/swaraj';

interface FigmaLeftSidebarProps {
  activeFrameId: FrameId;
  onSelectFrame: (id: FrameId) => void;
}

const LayerKindIcon: React.FC<{ kind: LayerKind }> = ({ kind }) => {
  switch (kind) {
    case 'FRAME':
      return <Frame className="w-3.5 h-3.5 text-[#64748B] shrink-0" />;
    case 'COMPONENT':
      return <Component className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />;
    case 'IMAGE':
      return <ImageIcon className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />;
    case 'BUTTON':
      return <MousePointerClick className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />;
    case 'TEXT':
      return <Type className="w-3.5 h-3.5 text-[#64748B] shrink-0" />;
  }
};

export const FigmaLeftSidebar: React.FC<FigmaLeftSidebarProps> = ({
  activeFrameId,
  onSelectFrame,
}) => {
  const [sidebarTab, setSidebarTab] = useState<'layers' | 'components'>('layers');
  const [expandedFrames, setExpandedFrames] = useState<Record<string, boolean>>({
    '01': true,
    '05': true,
  });

  const toggleExpand = (id: FrameId) => {
    setExpandedFrames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: FigmaLayerNode, depth = 0) => (
    <div key={node.id}>
      <div
        style={{ paddingLeft: `${26 + depth * 12}px` }}
        className="py-1.5 pr-3 flex items-center gap-2 text-[11px] text-[#475569] hover:bg-slate-100/80 rounded-md"
      >
        <LayerKindIcon kind={node.kind} />
        <span className="truncate">{node.name}</span>
      </div>
      {node.children?.map((child) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none overflow-hidden">
      {/* Tabs: Layers | Components */}
      <div className="p-2.5 border-b border-slate-200">
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSidebarTab('layers')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              sidebarTab === 'layers'
                ? 'bg-white text-[#14213D] shadow-xs'
                : 'text-[#64748B] hover:text-[#14213D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('components')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              sidebarTab === 'components'
                ? 'bg-white text-[#14213D] shadow-xs'
                : 'text-[#64748B] hover:text-[#14213D]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Assets</span>
          </button>
        </div>
      </div>

      {sidebarTab === 'layers' ? (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <p className="px-2 py-1 text-[11px] font-semibold text-[#64748B]">
            Mobile Frames (390 × 844)
          </p>

          {FIGMA_FRAMES.map((frame) => {
            const isSelected = activeFrameId === frame.id;
            const isExpanded = Boolean(expandedFrames[frame.id]);
            return (
              <div key={frame.id} className="space-y-0.5">
                <div
                  className={`flex items-center gap-1 rounded-lg px-1.5 py-1.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-[#2563EB]'
                      : 'text-[#14213D] hover:bg-slate-50'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Toggle layers for ${frame.frameTitle}`}
                    onClick={() => toggleExpand(frame.id)}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectFrame(frame.id)}
                    className="flex-1 flex items-center gap-2 min-w-0 text-left"
                  >
                    <Frame className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs font-semibold truncate">
                      {frame.frameTitle}
                    </span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="pb-1">
                    {frame.layers.map((node) => renderNode(node))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <p className="text-[11px] font-semibold text-[#64748B]">
            Reusable UI Components
          </p>

          {[
            {
              name: 'Button / Primary',
              desc: 'H: 48px · Radius: 12px · #2563EB',
              target: '01' as FrameId,
              preview: (
                <div className="w-full h-8 rounded-lg bg-[#2563EB] text-white text-[11px] font-semibold flex items-center justify-center">
                  Upload &amp; Print
                </div>
              ),
            },
            {
              name: 'TopBar / Mobile',
              desc: 'H: 56px · Sticky · Pad: 16px',
              target: '02' as FrameId,
              preview: (
                <div className="w-full h-8 px-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-[11px] font-semibold text-[#14213D]">
                  <span>←</span>
                  <span>Swaraj Print</span>
                  <span>•••</span>
                </div>
              ),
            },
            {
              name: 'Card / PrintShop',
              desc: 'Auto Layout Vertical · Gap: 10px',
              target: '02' as FrameId,
              preview: (
                <div className="w-full p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-[#14213D]">
                    Sharma Print Hub
                  </div>
                  <div className="text-[10px] text-[#64748B] tabular">
                    0.3 km · ₹2/pg B&amp;W
                  </div>
                </div>
              ),
            },
            {
              name: 'Card / AIMistake',
              desc: 'Spelling, Grammar & Margin fix',
              target: '05' as FrameId,
              preview: (
                <div className="w-full p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="text-[10px] font-semibold text-[#2563EB]">
                    Spelling · Page 1
                  </div>
                  <div className="text-[10px] text-[#16A34A] font-medium">
                    recieve → receive
                  </div>
                </div>
              ),
            },
            {
              name: 'Stepper / OrderProgress',
              desc: '7 Vertical Status Milestones',
              target: '08' as FrameId,
              preview: (
                <div className="w-full p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-[10px] font-semibold text-[#14213D]">
                  <span className="w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                  <span>Printing · Est. 4:18 PM</span>
                </div>
              ),
            },
          ].map((comp) => (
            <button
              key={comp.name}
              type="button"
              onClick={() => onSelectFrame(comp.target)}
              className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 hover:border-[#2563EB]/50 text-left space-y-2 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Component className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#14213D]">
                  {comp.name}
                </span>
              </div>
              {comp.preview}
              <p className="text-[10px] text-[#64748B] font-mono-spec">
                {comp.desc}
              </p>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};
