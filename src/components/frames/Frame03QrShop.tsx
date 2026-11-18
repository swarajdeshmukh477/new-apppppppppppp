import React from 'react';
import {
  ArrowLeft,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  Upload,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { FrameId, PrintShop } from '../../types/swaraj';
import { MobileShell } from './MobileShell';

interface Frame03Props {
  shop: PrintShop;
  onNavigate: (frame: FrameId) => void;
}

export const Frame03QrShop: React.FC<Frame03Props> = ({ shop, onNavigate }) => {
  return (
    <MobileShell>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('02')}
          aria-label="Back to Shop Discovery"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-[#14213D]">
          Studio Counter QR
        </span>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
          <QrCode className="w-4 h-4" />
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Selected Shop Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="h-44 bg-slate-100 relative">
            <img
              src={shop.image}
              alt={shop.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-[#2563EB]">
                Verified Swaraj Print Partner
              </p>
              <h1 className="text-xl font-bold text-[#14213D] mt-0.5 leading-snug">
                {shop.name}
              </h1>
            </div>

            <div className="space-y-2 text-xs text-[#64748B]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#14213D] font-medium">{shop.address}</p>
                  <p className="tabular mt-0.5">
                    {shop.distanceKm} km away · {shop.walkMinutes} min walk
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span className="font-medium text-[#16A34A]">
                  {shop.availability}
                </span>
                <span aria-hidden="true">·</span>
                <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span>Open until {shop.closingTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Printing Prices Card */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#14213D]">
              Standard Printing Prices
            </h2>
            <span className="text-xs text-[#64748B] flex items-center gap-1">
              <Printer className="w-3.5 h-3.5" />
              {shop.printersActive} active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'A4 Black & White', price: `₹${shop.bwPrice.toFixed(2)}`, unit: 'per page' },
              { label: 'A4 Full Colour', price: `₹${shop.colorPrice.toFixed(2)}`, unit: 'per page' },
              { label: 'A4 Double-Sided', price: `₹${shop.duplexBwPrice.toFixed(2)}`, unit: 'per sheet' },
              { label: 'A3 Poster / Sheet', price: `₹${shop.a3Price.toFixed(2)}`, unit: 'per page' },
            ].map((rate) => (
              <div
                key={rate.label}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70"
              >
                <p className="text-[11px] font-medium text-[#64748B]">
                  {rate.label}
                </p>
                <p className="text-base font-bold text-[#14213D] tabular mt-1">
                  {rate.price}
                </p>
                <p className="text-[11px] text-[#64748B]">{rate.unit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('04')}
            className="w-full min-h-[48px] rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('02')}
            className="w-full min-h-[44px] rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#14213D] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#64748B]" />
            <span>Change Shop</span>
          </button>
        </div>
      </div>
    </MobileShell>
  );
};
