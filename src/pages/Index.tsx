
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FilterPanel from '../components/FilterPanel';
import StockTable from '../components/StockTable';
import StockDetails from '../components/StockDetails';
import { FilterState, SortState, SortField, Stock, StockWithHistory } from '../types/stock';
import { filterStocks, sortStocks } from '../utils/stockUtils';
import { useStockUpdates } from '../hooks/useStockUpdates';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { stocks: supabaseStocks, isLoading, error } = useStockUpdates();
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
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockWithHistory | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Update stocks when Supabase data changes
  useEffect(() => {
    if (supabaseStocks) {
      setStocks(supabaseStocks);
    }
  }, [supabaseStocks]);

  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading stocks",
        description: "Failed to load stock data. Please try again later."
      });
    }
  }, [error, toast]);

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

  const viewStockDetails = async (stockId: string) => {
    const stock = stocks.find(s => s.id === stockId);
    if (stock) {
      // In a real app, you would fetch the stock history from Supabase here
      // For now, we'll just set the basic stock info
      const stockWithHistory: StockWithHistory = {
        ...stock,
        history: [] // You would fetch this from Supabase in a real implementation
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
