import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FilterPanel from '../components/FilterPanel';
import StockTable from '../components/StockTable';
import StockDetails from '../components/StockDetails';
import { FilterState, SortState, SortField, Stock, StockWithHistory } from '../types/stock';
import { mockStocks, detailedStock } from '../data/mockStocks';
import { filterStocks, sortStocks } from '../utils/stockUtils';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sectors: [],
    minRoe: null,
    maxDebtToEquity: null,
    minEpsGrowth: null,
    maxPe: null,
    maxPbv: null,
    minDividendYield: null,
    onlyUndervalued: false
  });
  const [sortState, setSortState] = useState<SortState>({
    field: 'ticker',
    direction: 'asc'
  });
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [selectedStock, setSelectedStock] = useState<StockWithHistory | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Check URL params for direct stock view
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stockId = params.get('stockId');
    
    if (stockId) {
      viewStockDetails(stockId);
    }
  }, [location]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      search: '',
      sectors: [],
      minRoe: null,
      maxDebtToEquity: null,
      minEpsGrowth: null,
      maxPe: null,
      maxPbv: null,
      minDividendYield: null,
      onlyUndervalued: false
    });
  };

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const viewStockDetails = (stockId: string) => {
    const stock = stocks.find(s => s.id === stockId);
    if (stock) {
      const stockWithHistory: StockWithHistory = {
        ...stock,
        history: detailedStock.history
      };
      setSelectedStock(stockWithHistory);
      setDetailDialogOpen(true);
      
      // Update URL without page reload
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('stockId', stockId);
      navigate(`?${currentParams.toString()}`, { replace: true });
    }
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    const currentParams = new URLSearchParams(location.search);
    currentParams.delete('stockId');
    navigate(`?${currentParams.toString()}`, { replace: true });
  };

  // Apply filters and sorting
  const filteredStocks = filterStocks(stocks, filters);
  const sortedStocks = sortStocks(filteredStocks, sortState);

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      <main className="flex-1 container max-w-7xl py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Stock Screener</h1>
          <p className="text-muted-foreground">
            Filter and analyze IDX stocks based on fundamental criteria
          </p>
        </div>
        
        <div className="space-y-6">
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            isOpen={filterPanelOpen}
            onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
          />
          
          <StockTable 
            stocks={sortedStocks}
            sortState={sortState}
            onSort={handleSort}
            onViewDetails={viewStockDetails}
          />
        </div>
      </main>
      
      <Footer />
      
      <StockDetails
        stock={selectedStock}
        open={detailDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Index;
