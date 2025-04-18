
export interface Stock {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  marketCap: number;
  pe: number | null;
  pbv: number | null;
  eps: number | null;
  epsGrowth: number | null;
  revenue: number | null;
  revenueGrowth: number | null;
  roe: number | null;
  roa: number | null;
  debtToEquity: number | null;
  dividendYield: number | null;
  fairValue: number | null;
  inWatchlist: boolean;
}

export interface FinancialHistory {
  year: number;
  quarter: number;
  eps: number;
  revenue: number;
  roe: number;
  roa: number;
  debtToEquity: number;
}

export interface StockWithHistory extends Stock {
  history: FinancialHistory[];
}

export type SortField = keyof Stock;
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  sectors: string[];
  minRoe: number | null;
  maxDebtToEquity: number | null;
  minEpsGrowth: number | null;
  maxPe: number | null;
  maxPbv: number | null;
  minDividendYield: number | null;
  onlyWatchlist: boolean;
  onlyUndervalued: boolean;
}
