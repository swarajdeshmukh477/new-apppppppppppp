import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Type,
  Highlighter,
  PenTool,
  RotateCw,
  Trash2,
  Combine,
  FileOutput,
  Minimize2,
  ScanText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { AiMistakeItem, FrameId, UploadedDoc } from '../../types/swaraj';
import { INITIAL_AI_MISTAKES } from '../../data/mockData';
import { MobileShell } from './MobileShell';

interface Frame05Props {
  documents: UploadedDoc[];
  onNavigate: (frame: FrameId) => void;
}

export const Frame05PdfEditor: React.FC<Frame05Props> = ({
  documents,
  onNavigate,
}) => {
  const activeDoc = documents[0] ?? {
    id: 'fallback',
    name: 'Final_Thesis_Report_v3.pdf',
    format: 'PDF' as const,
    sizeLabel: '2.4 MB',
    pages: 18,
    status: 'Uploaded' as const,
  };

  const [activeTab, setActiveTab] = useState<'pages' | 'editor' | 'ai'>('editor');
  const [pageCount, setPageCount] = useState(Math.max(4, Math.min(activeDoc.pages, 6)));
  const [currentPage, setCurrentPage] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showHighlight, setShowHighlight] = useState(true);
  const [showDrawStroke, setShowDrawStroke] = useState(false);
  const [addedNote, setAddedNote] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<AiMistakeItem[]>(INITIAL_AI_MISTAKES);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const unresolvedCount = mistakes.filter((m) => !m.resolved).length;

  const handleResolveMistake = (id: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, resolved: true } : m))
    );
    notify('AI fix applied to document');
  };

  const handleDeletePage = () => {
    if (pageCount <= 1) {
      notify('Document must have at least 1 page');
      return;
    }
    setPageCount((c) => c - 1);
    setCurrentPage((p) => Math.min(p, pageCount - 1));
    notify(`Removed page ${currentPage}`);
  };

  return (
    <MobileShell toastMessage={toast} onDismissToast={() => setToast(null)}>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('04')}
          aria-label="Back to Upload"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs font-semibold text-[#14213D] truncate">
            {activeDoc.name}
          </p>
          <p className="text-[11px] text-[#64748B] tabular">
            {activeDoc.sizeLabel} · {pageCount} pages
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('06')}
          className="h-9 px-3 rounded-lg bg-[#2563EB] text-white text-xs font-semibold shrink-0"
        >
          Next
        </button>
      </header>

      {/* Tabs: Pages, Editor, AI Check */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-200/80 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'pages', label: 'Pages' },
            { id: 'editor', label: 'Editor' },
            { id: 'ai', label: `AI Check (${unresolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#14213D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3.5 space-y-3.5 pb-24">
        {/* Live Document Page Preview */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#64748B] tabular">
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= pageCount}
                onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                aria-label="Next page"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* A4 Page Preview Sheet */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-center border border-slate-200/70 overflow-hidden">
            <div
              style={{ transform: `rotate(${rotation}deg)` }}
              className="w-[180px] min-h-[228px] bg-white rounded-lg border border-slate-200 shadow-xs p-3.5 flex flex-col justify-between transition-transform duration-200 relative"
            >
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#14213D] tracking-tight">
                  CHAPTER {currentPage}: SYSTEM DESIGN
                </p>
                <p className="text-[9px] leading-relaxed text-[#64748B]">
                  Before final submission, please{' '}
                  <span
                    className={
                      showHighlight
                        ? 'bg-amber-200/80 text-[#14213D] px-0.5 rounded-xs'
                        : ''
                    }
                  >
                    {mistakes[0].resolved ? 'receive' : 'recieve'} the verified
                  </span>{' '}
                  copy from the department office.
                </p>
                <div className="h-1.5 w-full bg-slate-100 rounded" />
                <div className="h-1.5 w-11/12 bg-slate-100 rounded" />
                <div className="h-1.5 w-4/5 bg-slate-100 rounded" />

                {addedNote && (
                  <p className="text-[9px] font-semibold text-[#2563EB] border border-blue-200 bg-blue-50/70 px-1.5 py-1 rounded">
                    {addedNote}
                  </p>
                )}

                {showDrawStroke && (
                  <svg
                    viewBox="0 0 120 24"
                    className="w-full h-5 text-[#2563EB]"
                    fill="none"
                  >
                    <path
                      d="M4 16 C 24 4, 48 20, 74 8 C 92 2, 106 14, 116 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[8px] text-[#64748B] tabular">
                <span>Swaraj Print Preview</span>
                <span>Pg {currentPage}</span>
              </div>
            </div>
          </div>

          {/* Page Thumbnails Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`w-12 h-14 rounded-lg border text-[11px] font-semibold tabular shrink-0 flex flex-col items-center justify-center transition-colors ${
                  currentPage === pg
                    ? 'border-[#2563EB] bg-blue-50/60 text-[#2563EB]'
                    : 'border-slate-200 bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <span className="w-6 h-0.5 bg-current opacity-30 mb-1" />
                <span className="w-5 h-0.5 bg-current opacity-20 mb-1.5" />
                <span>{pg}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Tab-Specific Panels */}
        {activeTab === 'editor' && (
          <>
            {/* Editing Tools */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2.5">
              <h2 className="text-xs font-semibold text-[#14213D]">
                Editing Tools
              </h2>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  {
                    icon: Type,
                    label: 'Add Text',
                    active: Boolean(addedNote),
                    onClick: () => {
                      setAddedNote((prev) =>
                        prev ? null : 'Approved for A4 Print'
                      );
                      notify(addedNote ? 'Text annotation removed' : 'Text note added');
                    },
                  },
                  {
                    icon: Highlighter,
                    label: 'Highlight',
                    active: showHighlight,
                    onClick: () => {
                      setShowHighlight((v) => !v);
                      notify('Toggled text highlight');
                    },
                  },
                  {
                    icon: PenTool,
                    label: 'Draw',
                    active: showDrawStroke,
                    onClick: () => {
                      setShowDrawStroke((v) => !v);
                      notify('Toggled ink annotation');
                    },
                  },
                  {
                    icon: RotateCw,
                    label: 'Rotate',
                    active: rotation !== 0,
                    onClick: () => {
                      setRotation((r) => (r + 90) % 360);
                      notify('Rotated page 90°');
                    },
                  },
                  {
                    icon: Trash2,
                    label: 'Delete',
                    active: false,
                    onClick: handleDeletePage,
                  },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={tool.onClick}
                      className={`min-h-[54px] px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors ${
                        tool.active
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-[#F8FAFC] border-slate-200/80 text-[#14213D] hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-medium whitespace-nowrap">
                        {tool.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Additional Tools: Merge, Convert, Compress, OCR */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2.5">
              <h2 className="text-xs font-semibold text-[#14213D]">
                Additional Document Tools
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: Combine, label: 'Merge', msg: 'Merged 2 files into single PDF' },
                  { icon: FileOutput, label: 'Convert', msg: 'Converted DOCX to print-ready PDF' },
                  { icon: Minimize2, label: 'Compress', msg: 'Compressed file size by 42%' },
                  { icon: ScanText, label: 'OCR', msg: 'OCR text layer extracted' },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={() => notify(tool.msg)}
                      className="min-h-[52px] rounded-xl bg-[#F8FAFC] hover:bg-blue-50 border border-slate-200/80 flex flex-col items-center justify-center gap-1 text-[#14213D] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[#2563EB]" />
                      <span className="text-[11px] font-medium">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Compact AI Mistake Detector Card */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#14213D]">
                    AI Mistake Detector
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {unresolvedCount > 0
                      ? `${unresolvedCount} spelling, grammar & margin issues found`
                      : 'All detected issues resolved'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className="h-9 px-3 rounded-lg bg-[#14213D] text-white text-xs font-semibold shrink-0"
              >
                Review
              </button>
            </section>
          </>
        )}

        {activeTab === 'pages' && (
          <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#14213D]">
                Page Organizer ({pageCount} pages)
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPageCount((c) => c + 1);
                  notify('Inserted blank A4 cover sheet');
                }}
                className="text-xs font-semibold text-[#2563EB]"
              >
                + Add Blank Page
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`p-2.5 rounded-xl border text-left space-y-2 transition-colors ${
                    currentPage === pg
                      ? 'border-[#2563EB] bg-blue-50/40'
                      : 'border-slate-200 bg-[#F8FAFC]'
                  }`}
                >
                  <div className="h-16 bg-white rounded-md border border-slate-200 p-1.5 space-y-1">
                    <div className="h-1 w-3/4 bg-slate-200 rounded" />
                    <div className="h-1 w-full bg-slate-100 rounded" />
                    <div className="h-1 w-2/3 bg-slate-100 rounded" />
                  </div>
                  <p className="text-[11px] font-semibold text-[#14213D] tabular">
                    Page {pg}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'ai' && (
          <section className="space-y-2.5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-semibold text-[#14213D]">
                  AI Mistake Detector
                </h2>
              </div>
              <span className="text-xs font-medium text-[#64748B] tabular">
                {unresolvedCount} remaining
              </span>
            </div>

            {mistakes.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#14213D] flex items-center gap-1.5">
                    {item.resolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                    )}
                    <span>{item.category}</span>
                  </span>
                  <span className="text-[#64748B] tabular">Page {item.page}</span>
                </div>

                <div className="text-xs space-y-1 bg-[#F8FAFC] rounded-xl p-2.5">
                  <p className="text-red-600 line-through">{item.original}</p>
                  <p className="text-[#16A34A] font-medium">{item.suggestion}</p>
                </div>

                <p className="text-[11px] text-[#64748B]">{item.note}</p>

                {!item.resolved && (
                  <button
                    type="button"
                    onClick={() => handleResolveMistake(item.id)}
                    className="w-full min-h-[38px] rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    Apply Fix
                  </button>
                )}
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Sticky Bottom Print Settings CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('06')}
          className="w-full min-h-[48px] rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Continue to Print Settings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </MobileShell>
  );
};
