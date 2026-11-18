export type FrameId =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08';

export type LayerKind = 'FRAME' | 'COMPONENT' | 'TEXT' | 'IMAGE' | 'BUTTON';

export interface FigmaLayerNode {
  id: string;
  name: string;
  kind: LayerKind;
  autoLayout?: string;
  children?: FigmaLayerNode[];
}

export interface FigmaFrameMeta {
  id: FrameId;
  frameTitle: string;
  shortName: string;
  subtitle: string;
  width: number;
  height: number;
  autoLayoutGap: string;
  padding: string;
  nextFrameId?: FrameId;
  prevFrameId?: FrameId;
  flowLabel?: string;
  layers: FigmaLayerNode[];
}

export interface PrintShop {
  id: string;
  name: string;
  address: string;
  area: string;
  distanceKm: number;
  walkMinutes: number;
  bwPrice: number;
  colorPrice: number;
  a3Price: number;
  duplexBwPrice: number;
  availability: 'Open Now' | 'Busy · 10m wait';
  isOpen: boolean;
  supportsColor: boolean;
  printersActive: number;
  closingTime: string;
  rating: string;
  phone: string;
  image: string;
  fallbackGradient: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  format: 'PDF' | 'DOCX' | 'JPG' | 'PNG';
  sizeLabel: string;
  pages: number;
  status: 'Uploaded' | 'Uploading';
}

export interface AiMistakeItem {
  id: string;
  category: 'Spelling' | 'Grammar' | 'Formatting';
  page: number;
  original: string;
  suggestion: string;
  note: string;
  resolved: boolean;
}

export interface PrintSettingsState {
  colorMode: 'bw' | 'color';
  paperSize: 'A4' | 'A3' | 'A5';
  copies: number;
  pageRangeMode: 'all' | 'custom';
  customRange: string;
  sides: 'single' | 'double';
  orientation: 'portrait' | 'landscape';
}

export type PaymentMethodMode = 'self' | 'other';
export type PaymentVisualState = 'waiting' | 'success' | 'failed';
export type UpiAppId = 'gpay' | 'phonepe' | 'paytm' | 'bhim';
