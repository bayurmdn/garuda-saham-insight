
import { FilterState, SortState, Stock } from "../types/stock";

export const formatNumber = (value: number | null): string => {
  if (value === null) return "N/A";
  
  // For large numbers (market cap, revenue)
  if (value > 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)} T`;
  } else if (value > 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} B`;
  } else if (value > 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} M`;
  }
  
  // For percentages or ratios
  if (value < 100 && value !== 0) {
    return value.toFixed(2);
  }
  
  // Default formatting
  return value.toLocaleString('id-ID');
};

export const formatPercentage = (value: number | null): string => {
  if (value === null) return "N/A";
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatPrice = (value: number): string => {
  return value.toLocaleString('id-ID');
};

export const getValueIndicator = (
  value: number | null, 
  benchmark: number, 
  isHigherBetter: boolean
): string => {
  if (value === null) return "neutral";
  if (isHigherBetter) {
    if (value >= benchmark * 1.2) return "success";
    if (value >= benchmark) return "warning";
    return "danger";
  } else {
    if (value <= benchmark * 0.8) return "success";
    if (value <= benchmark) return "warning";
    return "danger";
  }
};

export const filterStocks = (stocks: Stock[], filters: FilterState): Stock[] => {
  return stocks.filter(stock => {
    // Text search
    if (filters.search && 
       !stock.ticker.toLowerCase().includes(filters.search.toLowerCase()) &&
       !stock.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Sector filter
    if (filters.sectors.length > 0 && !filters.sectors.includes(stock.sector)) {
      return false;
    }
    
    // Numeric filters
    if (filters.minRoe !== null && (stock.roe === null || stock.roe < filters.minRoe)) {
      return false;
    }
    
    if (filters.maxDebtToEquity !== null && 
        (stock.debtToEquity === null || stock.debtToEquity > filters.maxDebtToEquity)) {
      return false;
    }
    
    if (filters.minEpsGrowth !== null && 
        (stock.epsGrowth === null || stock.epsGrowth < filters.minEpsGrowth)) {
      return false;
    }
    
    if (filters.maxPe !== null && (stock.pe === null || stock.pe > filters.maxPe)) {
      return false;
    }
    
    if (filters.maxPbv !== null && (stock.pbv === null || stock.pbv > filters.maxPbv)) {
      return false;
    }
    
    if (filters.minDividendYield !== null && 
        (stock.dividendYield === null || stock.dividendYield < filters.minDividendYield)) {
      return false;
    }
    
    // Watchlist filter
    if (filters.onlyWatchlist && !stock.inWatchlist) {
      return false;
    }
    
    // Undervalued filter
    if (filters.onlyUndervalued && 
        (stock.fairValue === null || stock.price >= stock.fairValue)) {
      return false;
    }
    
    return true;
  });
};

export const sortStocks = (stocks: Stock[], sortState: SortState): Stock[] => {
  return [...stocks].sort((a, b) => {
    const aValue = a[sortState.field];
    const bValue = b[sortState.field];
    
    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    // Sort based on direction
    const direction = sortState.direction === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });
};

export const calculateFundamentalScore = (stock: Stock): number => {
  let score = 0;
  let metrics = 0;
  
  // ROE score (0-25 points)
  if (stock.roe !== null) {
    score += Math.min(stock.roe, 25);
    metrics++;
  }
  
  // EPS Growth score (0-20 points)
  if (stock.epsGrowth !== null) {
    score += Math.min(stock.epsGrowth * 2, 20);
    metrics++;
  }
  
  // Revenue Growth score (0-15 points)
  if (stock.revenueGrowth !== null) {
    score += Math.min(stock.revenueGrowth * 1.5, 15);
    metrics++;
  }
  
  // Debt-to-Equity score (0-15 points inverted)
  if (stock.debtToEquity !== null) {
    score += Math.max(15 - stock.debtToEquity * 3, 0);
    metrics++;
  }
  
  // ROA score (0-15 points)
  if (stock.roa !== null) {
    score += Math.min(stock.roa * 1.5, 15);
    metrics++;
  }
  
  // Dividend yield score (0-10 points)
  if (stock.dividendYield !== null) {
    score += Math.min(stock.dividendYield * 2, 10);
    metrics++;
  }
  
  // Return average score if we have metrics
  return metrics > 0 ? Math.round(score / metrics) : 0;
};

export const calculateValuationScore = (stock: Stock): number => {
  let score = 0;
  let metrics = 0;
  
  // P/E score (0-40 points inverted)
  if (stock.pe !== null) {
    // Lower P/E is better
    score += Math.max(40 - stock.pe, 0);
    metrics++;
  }
  
  // P/BV score (0-30 points inverted)
  if (stock.pbv !== null) {
    // Lower P/BV is better
    score += Math.max(30 - stock.pbv * 10, 0);
    metrics++;
  }
  
  // Fair value score (0-30 points)
  if (stock.fairValue !== null && stock.price !== null) {
    // Upside potential: (fairValue - price) / price * 100
    const upside = (stock.fairValue - stock.price) / stock.price * 100;
    score += Math.min(Math.max(upside, 0), 30);
    metrics++;
  }
  
  // Return average score if we have metrics
  return metrics > 0 ? Math.round(score / metrics) : 0;
};

export const getScoreCategory = (score: number): {label: string, color: string} => {
  if (score >= 80) return { label: 'Excellent', color: 'success' };
  if (score >= 60) return { label: 'Good', color: 'success' };
  if (score >= 40) return { label: 'Fair', color: 'warning' };
  if (score >= 20) return { label: 'Poor', color: 'warning' };
  return { label: 'Very Poor', color: 'danger' };
};

export const getValueColor = (
  value: number | null, 
  benchmark: number, 
  isHigherBetter: boolean
): string => {
  if (value === null) return "text-muted-foreground";
  
  if (isHigherBetter) {
    if (value >= benchmark * 1.2) return "text-success";
    if (value >= benchmark) return "text-warning";
    return "text-danger";
  } else {
    if (value <= benchmark * 0.8) return "text-success";
    if (value <= benchmark) return "text-warning";
    return "text-danger";
  }
};

// Helper to create downloadable Excel file
export const exportToExcel = (stocks: Stock[]): void => {
  // Generate CSV content
  const headers = [
    'Ticker', 'Name', 'Sector', 'Price', 'Change (%)', 
    'P/E', 'P/BV', 'EPS', 'EPS Growth (%)', 
    'ROE (%)', 'ROA (%)', 'D/E Ratio',
    'Dividend Yield (%)', 'Fair Value'
  ].join(',');
  
  const rows = stocks.map(stock => [
    stock.ticker,
    `"${stock.name}"`, // Quote company names in case they contain commas
    stock.sector,
    stock.price,
    stock.change,
    stock.pe ?? '',
    stock.pbv ?? '',
    stock.eps ?? '',
    stock.epsGrowth ?? '',
    stock.roe ?? '',
    stock.roa ?? '',
    stock.debtToEquity ?? '',
    stock.dividendYield ?? '',
    stock.fairValue ?? ''
  ].join(',')).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `stock_analysis_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
