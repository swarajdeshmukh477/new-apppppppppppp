import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  CloudUpload,
  FileText,
  CheckCircle2,
  Eye,
  Trash2,
  RefreshCw,
  Plus,
  ArrowRight,
  MapPin,
  X,
} from 'lucide-react';
import { FrameId, PrintShop, UploadedDoc } from '../../types/swaraj';
import { SAMPLE_EXTRA_DOCS } from '../../data/mockData';
import { MobileShell } from './MobileShell';

interface Frame04Props {
  shop: PrintShop;
  documents: UploadedDoc[];
  onChangeDocuments: React.Dispatch<React.SetStateAction<UploadedDoc[]>>;
  onNavigate: (frame: FrameId) => void;
}

export const Frame04Upload: React.FC<Frame04Props> = ({
  shop,
  documents,
  onChangeDocuments,
  onNavigate,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added: UploadedDoc[] = Array.from(files).map((f, idx) => {
      const ext = f.name.split('.').pop()?.toUpperCase();
      const format: UploadedDoc['format'] =
        ext === 'DOCX' || ext === 'JPG' || ext === 'PNG' ? ext : 'PDF';
      const kb = Math.max(120, Math.round(f.size / 1024));
      return {
        id: `doc-${Date.now()}-${idx}`,
        name: f.name,
        format,
        sizeLabel: kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`,
        pages: format === 'JPG' || format === 'PNG' ? 1 : 4,
        status: 'Uploaded',
      };
    });
    onChangeDocuments((prev) => [...prev, ...added]);
    showToast(`${added.length} file added to print queue`);
    e.target.value = '';
  };

  const handleAddSample = () => {
    const sample = SAMPLE_EXTRA_DOCS[sampleIdx % SAMPLE_EXTRA_DOCS.length];
    setSampleIdx((i) => i + 1);
    onChangeDocuments((prev) => [
      ...prev,
      { ...sample, id: `doc-${Date.now()}` },
    ]);
    showToast(`Added ${sample.name}`);
  };

  const handleReplace = (docId: string) => {
    const replacement = SAMPLE_EXTRA_DOCS[sampleIdx % SAMPLE_EXTRA_DOCS.length];
    setSampleIdx((i) => i + 1);
    onChangeDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...replacement, id: d.id } : d))
    );
    showToast(`Replaced with ${replacement.name}`);
  };

  const handleRemove = (docId: string) => {
    onChangeDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast('Document removed');
  };

  const totalPages = documents.reduce((sum, d) => sum + d.pages, 0);

  return (
    <MobileShell toastMessage={toast} onDismissToast={() => setToast(null)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.jpg,.jpeg,.png"
        onChange={handleRealFileSelect}
        className="hidden"
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('03')}
          aria-label="Back to Shop Details"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#14213D]">
          Upload Documents
        </h1>
        <span className="text-xs font-medium text-[#64748B] tabular">
          {documents.length} files
        </span>
      </header>

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Selected Shop Details Strip */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={shop.image}
              alt={shop.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-100"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#14213D] truncate">
                {shop.name}
              </p>
              <p className="text-[11px] text-[#64748B] flex items-center gap-1 truncate tabular">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>
                  {shop.distanceKm} km · B&amp;W ₹{shop.bwPrice}/pg
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('02')}
            className="text-xs font-semibold text-[#2563EB] shrink-0 px-2 py-1"
          >
            Change
          </button>
        </div>

        {/* Cloud Upload Dropzone */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <CloudUpload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#14213D]">
              Upload your files to print
            </p>
            <p className="text-xs text-[#64748B]">
              Supported formats: PDF, DOCX, JPG and PNG
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
          >
            Choose Files
          </button>
        </div>

        {/* Uploaded Documents List */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#14213D]">
              Uploaded Files ({documents.length})
            </span>
            <span className="text-[#64748B] tabular">
              {totalPages} total pages
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center text-xs text-[#64748B]">
              No documents added yet. Choose files above or add a sample file.
            </div>
          ) : (
            <div className="space-y-2.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#14213D] truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] tabular mt-0.5">
                        <span>{doc.format}</span>
                        <span aria-hidden="true">·</span>
                        <span>{doc.sizeLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{doc.pages} pages</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-[#16A34A] mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{doc.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview, Replace, Remove Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="flex-1 min-h-[38px] rounded-lg bg-[#F8FAFC] hover:bg-slate-100 text-xs font-medium text-[#14213D] flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReplace(doc.id)}
                      className="flex-1 min-h-[38px] rounded-lg bg-[#F8FAFC] hover:bg-slate-100 text-xs font-medium text-[#14213D] flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      className="flex-1 min-h-[38px] rounded-lg bg-[#F8FAFC] hover:bg-red-50 text-xs font-medium text-red-600 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Another Document */}
          <button
            type="button"
            onClick={handleAddSample}
            className="w-full min-h-[44px] rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-[#14213D] flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <span>Add Another Document</span>
          </button>
        </section>
      </div>

      {/* Sticky Bottom Continue CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shrink-0">
        <button
          type="button"
          disabled={documents.length === 0}
          onClick={() => onNavigate('05')}
          className="w-full min-h-[48px] rounded-xl bg-[#2563EB] disabled:bg-slate-300 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Continue to Editor &amp; AI Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Document Preview Sheet */}
      {previewDoc && (
        <div className="absolute inset-0 z-40 bg-black/45 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-[#64748B]">Quick Page Preview</p>
                <h3 className="text-sm font-bold text-[#14213D] truncate">
                  {previewDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
            <div className="h-56 rounded-2xl bg-[#F8FAFC] border border-slate-200 p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-3 w-2/3 bg-[#14213D]/15 rounded" />
                <div className="h-2 w-full bg-slate-200 rounded" />
                <div className="h-2 w-5/6 bg-slate-200 rounded" />
                <div className="h-2 w-4/5 bg-slate-200 rounded" />
              </div>
              <p className="text-[11px] text-[#64748B] tabular">
                Page 1 of {previewDoc.pages} · Ready for print layout
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="w-full min-h-[44px] rounded-xl bg-[#14213D] text-white text-sm font-semibold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
};
