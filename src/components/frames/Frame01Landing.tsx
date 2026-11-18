import React, { useState } from 'react';
import {
  Menu,
  X,
  Upload,
  Sparkles,
  FileEdit,
  ScanText,
  Layers,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Clock,
  IndianRupee,
  Printer,
} from 'lucide-react';
import { FrameId, PrintShop } from '../../types/swaraj';
import { HERO_ILLUSTRATION_PATH, PRINT_SHOPS } from '../../data/mockData';
import { MobileShell, SwarajLogo } from './MobileShell';

interface Frame01Props {
  onNavigate: (frame: FrameId) => void;
  onSelectShop: (shop: PrintShop) => void;
}

export const Frame01Landing: React.FC<Frame01Props> = ({
  onNavigate,
  onSelectShop,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerModal, setFooterModal] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const footerContent: Record<string, { title: string; body: string }> = {
    About: {
      title: 'About Swaraj Print',
      body: 'Swaraj Print connects students, professionals, and households with verified neighbourhood print studios through a unified document editor and live pickup queue.',
    },
    Contact: {
      title: 'Contact Support',
      body: 'Email support@swarajprint.in or call our Pune & Bengaluru partner desk at +91 20 6712 4900 (Mon–Sat, 8 AM – 10 PM).',
    },
    Help: {
      title: 'Help & Print Guide',
      body: 'Upload PDF, DOCX, JPG, or PNG files up to 50 MB. Run AI Mistake Check before checkout to fix formatting or spelling errors automatically.',
    },
    Privacy: {
      title: 'Document Privacy',
      body: 'All uploaded documents are encrypted in transit and permanently purged from shop print queues within 2 hours after order completion.',
    },
  };

  return (
    <MobileShell>
      {/* Top Bar (56px) */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <SwarajLogo />
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="w-11 h-11 -mr-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100 transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Slide-down Mobile Navigation Drawer */}
      {menuOpen && (
        <nav className="bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {[
            { label: 'Discover Nearby Shops', frame: '02' as FrameId },
            { label: 'Upload Documents', frame: '04' as FrameId },
            { label: 'PDF Editor & AI Tools', frame: '05' as FrameId },
            { label: 'Print Settings', frame: '06' as FrameId },
            { label: 'Track Active Order', frame: '08' as FrameId },
          ].map((item) => (
            <button
              key={item.frame}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onNavigate(item.frame);
              }}
              className="w-full min-h-[44px] px-3 rounded-xl text-left text-sm font-medium text-[#14213D] hover:bg-slate-50 flex items-center justify-between"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-4 h-4 text-[#64748B]" />
            </button>
          ))}
        </nav>
      )}

      {/* Main Content */}
      <div className="px-4 pt-5 pb-6 space-y-6">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-[#2563EB]">
              Edit · Verify · Print Locally
            </p>
            <h1 className="text-[26px] leading-[1.2] font-bold tracking-tight text-[#14213D] [text-wrap:balance]">
              Your Documents. Your Printing. All in One Place.
            </h1>
            <p className="text-[14px] leading-[1.55] text-[#64748B]">
              Edit PDFs, catch typos with AI, customize every page setting, and
              pick up crisp prints from trusted shops nearby without waiting in
              line.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('02')}
              className="min-h-[46px] px-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors whitespace-nowrap"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>Upload & Print</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('05')}
              className="min-h-[46px] px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#14213D] text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <FileEdit className="w-4 h-4 shrink-0 text-[#2563EB]" />
              <span>Explore Tools</span>
            </button>
          </div>

          {/* Document & Printer Illustration */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs">
            {!heroImgFailed ? (
              <img
                src={HERO_ILLUSTRATION_PATH}
                alt="Swaraj Print smart document editing and printer illustration"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center gap-2 p-4">
                <Printer className="w-10 h-10 text-[#2563EB]" />
                <span className="text-xs font-medium text-[#64748B]">
                  Smart Document & Cloud Print Workflow
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-3">
          <h2 className="text-[17px] font-semibold text-[#14213D]">
            Why Swaraj Print
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100">
            {[
              {
                icon: Clock,
                title: 'Zero Counter Waiting',
                desc: 'See live queue position and collect when ready.',
              },
              {
                icon: CheckCircle2,
                title: 'Error-Free Prints',
                desc: 'AI Mistake Detector checks spelling & margins first.',
              },
              {
                icon: IndianRupee,
                title: 'Transparent Shop Rates',
                desc: 'Compare ₹/page B&W and colour pricing upfront.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-3.5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#14213D]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Document Tools Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#14213D]">
              Document Tools
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('05')}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Open Editor
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                icon: FileEdit,
                title: 'PDF Editor',
                desc: 'Annotate, highlight & rotate pages',
              },
              {
                icon: Sparkles,
                title: 'AI Mistake Check',
                desc: 'Grammar & print margin fixes',
              },
              {
                icon: Layers,
                title: 'Merge & Compress',
                desc: 'Combine files & shrink size',
              },
              {
                icon: ScanText,
                title: 'Smart OCR',
                desc: 'Extract editable text from scans',
              },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.title}
                  type="button"
                  onClick={() => onNavigate('05')}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#2563EB]/50 text-left transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#2563EB] mb-2" />
                  <p className="text-sm font-semibold text-[#14213D]">
                    {tool.title}
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                    {tool.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* How It Works: Upload -> Customize -> Print */}
        <section className="space-y-3">
          <h2 className="text-[17px] font-semibold text-[#14213D]">
            How It Works
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 grid grid-cols-3 gap-2 text-center">
            {[
              { step: '1', label: 'Upload', sub: 'PDF, DOCX, Img' },
              { step: '2', label: 'Customize', sub: 'Edit & Settings' },
              { step: '3', label: 'Print', sub: 'Pay & Collect' },
            ].map((item, idx) => (
              <div key={item.step} className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#14213D] text-white text-xs font-bold flex items-center justify-center tabular">
                  {item.step}
                </div>
                <p className="text-xs font-semibold text-[#14213D] mt-2">
                  {item.label}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{item.sub}</p>
                {idx < 2 && (
                  <ArrowRight
                    className="w-3.5 h-3.5 text-slate-300 absolute top-2 -right-2.5"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Printing Shops Preview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#14213D]">
              Nearby Printing Shops
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('02')}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-2.5">
            {PRINT_SHOPS.slice(0, 2).map((shop) => (
              <button
                key={shop.id}
                type="button"
                onClick={() => {
                  onSelectShop(shop);
                  onNavigate('03');
                }}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-[#2563EB]/50 flex items-center gap-3 text-left transition-colors"
              >
                <img
                  src={shop.image}
                  alt={shop.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#14213D] truncate">
                    {shop.name}
                  </p>
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="tabular">
                      {shop.distanceKm} km · ₹{shop.bwPrice}/pg B&amp;W
                    </span>
                  </p>
                  <p className="text-xs font-medium text-[#16A34A] mt-1">
                    {shop.availability} · {shop.printersActive} printers ready
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl bg-[#14213D] p-5 text-white space-y-3">
          <h2 className="text-lg font-bold leading-snug">
            Ready to print without the queue?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Choose a nearby print studio, review your pages, and pay securely in
            under a minute.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('02')}
            className="w-full min-h-[46px] rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Start Printing Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Footer */}
        <footer className="pt-2 pb-3 border-t border-slate-200 space-y-2.5 text-center">
          <div className="flex items-center justify-center gap-5 text-xs font-medium text-[#64748B]">
            {['About', 'Contact', 'Help', 'Privacy'].map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => setFooterModal(link)}
                className="hover:text-[#14213D] py-1 transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#64748B]">
            © 2026 Swaraj Print · Document &amp; Local Print Network
          </p>
        </footer>
      </div>

      {/* Footer Info Sheet */}
      {footerModal && footerContent[footerModal] && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-3 shadow-xl">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#14213D]">
                {footerContent[footerModal].title}
              </h3>
              <button
                type="button"
                onClick={() => setFooterModal(null)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {footerContent[footerModal].body}
            </p>
            <button
              type="button"
              onClick={() => setFooterModal(null)}
              className="w-full min-h-[44px] rounded-xl bg-[#14213D] text-white text-sm font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
};
