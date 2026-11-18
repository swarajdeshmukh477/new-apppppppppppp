import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Search,
  LocateFixed,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { FrameId, PrintShop } from '../../types/swaraj';
import { PRINT_SHOPS } from '../../data/mockData';
import { MobileShell } from './MobileShell';

interface Frame02Props {
  selectedShop: PrintShop;
  onSelectShop: (shop: PrintShop) => void;
  onNavigate: (frame: FrameId) => void;
}

export const Frame02ShopDiscovery: React.FC<Frame02Props> = ({
  selectedShop,
  onSelectShop,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'low_price'>('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'price'>('nearest');
  const [locationLabel, setLocationLabel] = useState('Shivajinagar, Pune');
  const [toast, setToast] = useState<string | null>(null);

  const filteredShops = useMemo(() => {
    let list = PRINT_SHOPS.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (filter === 'open') return s.availability === 'Open Now';
      if (filter === 'low_price') return s.bwPrice <= 2;
      return true;
    });

    list = [...list].sort((a, b) =>
      sortBy === 'nearest' ? a.distanceKm - b.distanceKm : a.bwPrice - b.bwPrice
    );
    return list;
  }, [query, filter, sortBy]);

  const handleUseLocation = () => {
    setLocationLabel('FC Road, Shivajinagar · GPS');
    setSortBy('nearest');
    setToast('Updated nearby shops around FC Road');
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <MobileShell toastMessage={toast} onDismissToast={() => setToast(null)}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('01')}
          aria-label="Back to Landing Page"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#14213D] hover:bg-slate-100 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-[#64748B]">
            Printing near
          </p>
          <p className="text-sm font-semibold text-[#14213D] flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="truncate">{locationLabel}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setSortBy((prev) => (prev === 'nearest' ? 'price' : 'nearest'))
          }
          className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-[#14213D] flex items-center gap-1.5 hover:bg-slate-50 shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{sortBy === 'nearest' ? 'Nearest' : 'Price'}</span>
        </button>
      </header>

      <div className="px-4 py-4 space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shops, areas or landmarks"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-[#14213D] placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Use My Location */}
        <button
          type="button"
          onClick={handleUseLocation}
          className="w-full min-h-[44px] px-3.5 rounded-xl bg-blue-50/80 border border-blue-200/70 hover:bg-blue-50 text-[#2563EB] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <LocateFixed className="w-4 h-4" />
          <span>Use My Location</span>
        </button>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Shops' },
            { id: 'open', label: 'Open Now' },
            { id: 'low_price', label: 'Under ₹2/pg' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-[#14213D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-0.5">
          <span className="tabular font-medium">
            {filteredShops.length} printing studios available
          </span>
          <span>Sorted by {sortBy === 'nearest' ? 'distance' : 'B&W rate'}</span>
        </div>

        {/* Shop Cards */}
        <div className="space-y-3 pb-4">
          {filteredShops.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-[#14213D]">
                No shops match "{query}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                }}
                className="text-xs font-semibold text-[#2563EB]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredShops.map((shop) => {
              const isSelected = selectedShop.id === shop.id;
              return (
                <article
                  key={shop.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-colors ${
                    isSelected
                      ? 'border-[#2563EB] shadow-sm'
                      : 'border-slate-200/80'
                  }`}
                >
                  <div className="relative h-32 bg-slate-100">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-semibold text-[#14213D] leading-snug">
                          {shop.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#14213D] tabular shrink-0">
                          ★ {shop.rating}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                        {shop.address}
                      </p>
                    </div>

                    {/* Clean Unboxed Metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748B] tabular">
                      <span className="font-medium text-[#14213D]">
                        {shop.distanceKm} km away
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>B&amp;W ₹{shop.bwPrice}/pg</span>
                      <span aria-hidden="true">·</span>
                      <span>Colour ₹{shop.colorPrice}/pg</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {shop.availability === 'Open Now' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span className="text-[#16A34A]">
                              Open · {shop.printersActive} printers
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-amber-700">
                              {shop.availability}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectShop(shop);
                          onNavigate('03');
                        }}
                        className="min-h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        Select Shop
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </MobileShell>
  );
};
