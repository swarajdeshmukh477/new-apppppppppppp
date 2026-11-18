import React, { useRef, useState } from 'react';
import {
  LayoutGrid,
  Play,
  PanelLeft,
  PanelRight,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  FIGMA_FRAMES,
  INITIAL_DOCUMENTS,
  PRINT_SHOPS,
} from './data/mockData';
import {
  FrameId,
  PrintSettingsState,
  PrintShop,
  UploadedDoc,
} from './types/swaraj';
import { SwarajLogo } from './components/frames/MobileShell';
import { Frame01Landing } from './components/frames/Frame01Landing';
import { Frame02ShopDiscovery } from './components/frames/Frame02ShopDiscovery';
import { Frame03QrShop } from './components/frames/Frame03QrShop';
import { Frame04Upload } from './components/frames/Frame04Upload';
import { Frame05PdfEditor } from './components/frames/Frame05PdfEditor';
import {
  Frame06PrintSettings,
  calculateOrderTotal,
} from './components/frames/Frame06PrintSettings';
import { Frame07Payment } from './components/frames/Frame07Payment';
import { Frame08OrderTracking } from './components/frames/Frame08OrderTracking';
import { FigmaLeftSidebar } from './components/figma/FigmaLeftSidebar';
import { FigmaRightInspector } from './components/figma/FigmaRightInspector';

export default function App() {
  const [viewMode, setViewMode] = useState<'canvas' | 'prototype'>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
      ? 'prototype'
      : 'canvas'
  );
  const [activeFrameId, setActiveFrameId] = useState<FrameId>('01');
  const [zoom, setZoom] = useState<number>(0.78);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Shared live interactive state across all 8 Swaraj Print mobile frames
  const [selectedShop, setSelectedShop] = useState<PrintShop>(PRINT_SHOPS[0]);
  const [documents, setDocuments] =
    useState<UploadedDoc[]>(INITIAL_DOCUMENTS);
  const [printSettings, setPrintSettings] = useState<PrintSettingsState>({
    colorMode: 'bw',
    paperSize: 'A4',
    copies: 2,
    pageRangeMode: 'all',
    customRange: '1-12',
    sides: 'double',
    orientation: 'portrait',
  });

  const orderId = '#SP-48291';
  const { total } = calculateOrderTotal(selectedShop, documents, printSettings);

  const frameRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSelectAndFocusFrame = (id: FrameId) => {
    setActiveFrameId(id);
    if (viewMode === 'canvas') {
      const el = frameRefs.current[id];
      el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  const renderFrameContent = (frameId: FrameId) => {
    switch (frameId) {
      case '01':
        return (
          <Frame01Landing
            onNavigate={handleSelectAndFocusFrame}
            onSelectShop={setSelectedShop}
          />
        );
      case '02':
        return (
          <Frame02ShopDiscovery
            selectedShop={selectedShop}
            onSelectShop={setSelectedShop}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
      case '03':
        return (
          <Frame03QrShop
            shop={selectedShop}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
      case '04':
        return (
          <Frame04Upload
            shop={selectedShop}
            documents={documents}
            onChangeDocuments={setDocuments}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
      case '05':
        return (
          <Frame05PdfEditor
            documents={documents}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
      case '06':
        return (
          <Frame06PrintSettings
            shop={selectedShop}
            documents={documents}
            settings={printSettings}
            onChangeSettings={setPrintSettings}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
      case '07':
        return (
          <Frame07Payment
            orderId={orderId}
            totalAmount={total}
            shopName={selectedShop.name}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
      case '08':
        return (
          <Frame08OrderTracking
            orderId={orderId}
            shop={selectedShop}
            documents={documents}
            settings={printSettings}
            totalAmount={total}
            onNavigate={handleSelectAndFocusFrame}
          />
        );
    }
  };

  const activeIndex = FIGMA_FRAMES.findIndex((f) => f.id === activeFrameId);
  const activeMeta = FIGMA_FRAMES[activeIndex] ?? FIGMA_FRAMES[0];

  return (
    <div className="h-screen w-screen flex flex-col bg-[#E8ECF2] text-[#14213D] overflow-hidden">
      {/* Top Figma Workspace Header (Clean 3-Zone Bar) */}
      <header className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0 z-30">
        {/* Zone 1: File Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowLeftPanel((v) => !v)}
              aria-label="Toggle layers panel"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                showLeftPanel
                  ? 'bg-slate-100 text-[#14213D]'
                  : 'text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
          <SwarajLogo size="sm" />
          <span className="hidden sm:inline text-xs text-[#64748B] truncate">
            Mobile UI/UX · 8 Frames (390×844)
          </span>
        </div>

        {/* Zone 2: View Switcher & Zoom Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                viewMode === 'canvas'
                  ? 'bg-white text-[#14213D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Canvas (8 Frames)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('prototype')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                viewMode === 'prototype'
                  ? 'bg-white text-[#14213D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Prototype</span>
            </button>
          </div>

          {viewMode === 'canvas' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.55, Number((z - 0.1).toFixed(2))))}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-[#64748B]"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-11 text-center text-xs font-semibold tabular text-[#14213D]">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.05, Number((z + 0.1).toFixed(2))))}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-[#64748B]"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Zone 3: Primary Action & Inspector Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setViewMode((m) => (m === 'canvas' ? 'prototype' : 'canvas'));
            }}
            className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{viewMode === 'canvas' ? 'Present' : 'All Frames'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRightPanel((v) => !v)}
            aria-label="Toggle design inspector"
            className={`hidden xl:flex w-8 h-8 rounded-lg items-center justify-center transition-colors ${
              showRightPanel
                ? 'bg-slate-100 text-[#14213D]'
                : 'text-[#64748B] hover:bg-slate-50'
            }`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Layers Sidebar (Desktop) */}
        {showLeftPanel && (
          <div className="hidden md:flex">
            <FigmaLeftSidebar
              activeFrameId={activeFrameId}
              onSelectFrame={handleSelectAndFocusFrame}
            />
          </div>
        )}

        {/* Center Figma Artboard / Interactive Prototype */}
        <main className="flex-1 overflow-auto figma-canvas-grid relative">
          {viewMode === 'canvas' ? (
            <div className="p-8 md:p-10 min-w-max">
              {/* Section Banner */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#14213D]">
                    Swaraj Print — Complete Mobile UI/UX Flow
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    8 interactive 390 × 844 px mobile frames · Click inside any
                    frame to scroll or navigate
                  </p>
                </div>
              </div>

              {/* 8 Separate Mobile Frames Grid (4 Columns × 2 Rows on Canvas) */}
              <div className="grid grid-cols-4 gap-x-10 gap-y-12 items-start">
                {FIGMA_FRAMES.map((frame) => {
                  const isActive = activeFrameId === frame.id;
                  const scaledWidth = Math.round(390 * zoom);
                  const scaledHeight = Math.round(844 * zoom);
                  return (
                    <div
                      key={frame.id}
                      ref={(el) => {
                        frameRefs.current[frame.id] = el;
                      }}
                      onClick={() => setActiveFrameId(frame.id)}
                      className="flex flex-col items-start"
                    >
                      {/* Figma Artboard Frame Header */}
                      <div className="mb-2.5 flex items-center justify-between w-full px-1">
                        <button
                          type="button"
                          onClick={() => setActiveFrameId(frame.id)}
                          className={`text-xs font-semibold flex items-center gap-2 transition-colors ${
                            isActive ? 'text-[#2563EB]' : 'text-[#475569]'
                          }`}
                        >
                          <span>{frame.frameTitle}</span>
                        </button>
                        <span className="font-mono-spec text-[11px] text-[#64748B] tabular">
                          390×844
                        </span>
                      </div>

                      {/* Scaled 390×844 Frame Wrapper */}
                      <div
                        style={{
                          width: `${scaledWidth}px`,
                          height: `${scaledHeight}px`,
                        }}
                        className={`relative rounded-[28px] transition-shadow ${
                          isActive
                            ? 'ring-2 ring-[#2563EB] ring-offset-4 ring-offset-[#E8ECF2]'
                            : ''
                        }`}
                      >
                        <div
                          style={{
                            width: '390px',
                            height: '844px',
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top left',
                          }}
                        >
                          {renderFrameContent(frame.id)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Prototype Play Mode: Centered Interactive 390x844 Screen */
            <div className="min-h-full flex flex-col items-center justify-center py-6 px-4 gap-5">
              {/* Frame Switcher Strip */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl">
                {FIGMA_FRAMES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFrameId(f.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeFrameId === f.id
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-white/90 text-[#64748B] hover:text-[#14213D] border border-slate-200'
                    }`}
                  >
                    {f.id}. {f.shortName}
                  </button>
                ))}
              </div>

              {/* Active Mobile Screen (390×844) */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Previous screen"
                  disabled={activeIndex <= 0}
                  onClick={() =>
                    setActiveFrameId(FIGMA_FRAMES[activeIndex - 1].id)
                  }
                  className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-[#14213D] disabled:opacity-35 hover:bg-slate-50 shadow-xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="max-w-full overflow-x-auto">
                  {renderFrameContent(activeFrameId)}
                </div>

                <button
                  type="button"
                  aria-label="Next screen"
                  disabled={activeIndex >= FIGMA_FRAMES.length - 1}
                  onClick={() =>
                    setActiveFrameId(FIGMA_FRAMES[activeIndex + 1].id)
                  }
                  className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-[#14213D] disabled:opacity-35 hover:bg-slate-50 shadow-xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#64748B] tabular">
                {activeMeta.frameTitle} · {activeMeta.width} × {activeMeta.height}{' '}
                px
              </p>
            </div>
          )}
        </main>

        {/* Right Design System & Frame Inspector (Desktop XL) */}
        {showRightPanel && (
          <div className="hidden xl:flex">
            <FigmaRightInspector
              activeFrameId={activeFrameId}
              onSelectFrame={handleSelectAndFocusFrame}
            />
          </div>
        )}
      </div>
    </div>
  );
}
