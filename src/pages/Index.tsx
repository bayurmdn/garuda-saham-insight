
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FilterPanel from '../components/FilterPanel';
import StockTable from '../components/StockTable';
import StockChart from '../components/StockChart';
import Watchlist from '../components/Watchlist';

import { FilterState, SortState, SortField, Stock, StockWithHistory } from '../types/stock';
import { mockStocks, detailedStock } from '../data/mockStocks';
import { filterStocks, sortStocks } from '../utils/stockUtils';

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'eps' | 'revenue' | 'roe' | 'debtToEquity'>('eps');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sectors: [],
    minRoe: null,
    maxDebtToEquity: null,
    minEpsGrowth: null,
    maxPe: null,
    maxPbv: null,
    minDividendYield: null,
    onlyWatchlist: false,
    onlyUndervalued: false
  });
  const [sortState, setSortState] = useState<SortState>({
    field: 'ticker',
    direction: 'asc'
  });
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [selectedStock, setSelectedStock] = useState<StockWithHistory | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Apply filters and sorting
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
      onlyWatchlist: false,
      onlyUndervalued: false
    });
  };

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Watchlist management
  const toggleWatchlist = (stockId: string) => {
    const updatedStocks = stocks.map(stock => {
      if (stock.id === stockId) {
        const newWatchlistStatus = !stock.inWatchlist;
        toast({
          title: newWatchlistStatus ? "Added to watchlist" : "Removed from watchlist",
          description: `${stock.ticker} - ${stock.name} has been ${newWatchlistStatus ? 'added to' : 'removed from'} your watchlist.`,
          duration: 3000
        });
        return { ...stock, inWatchlist: newWatchlistStatus };
      }
      return stock;
    });
    setStocks(updatedStocks);
  };

  const removeFromWatchlist = (stockId: string) => {
    toggleWatchlist(stockId);
  };

  // Stock details view
  const viewStockDetails = (stockId: string) => {
    // Find the stock in our data and cast it to StockWithHistory by merging with detailedStock
    const stock = stocks.find(s => s.id === stockId);
    if (stock) {
      // Create a StockWithHistory by adding history from detailedStock
      const stockWithHistory: StockWithHistory = {
        ...stock,
        history: detailedStock.history
      };
      setSelectedStock(stockWithHistory);
      setDetailDialogOpen(true);
    }
  };

  // Apply filters and sorting
  const filteredStocks = filterStocks(stocks, filters);
  const sortedStocks = sortStocks(filteredStocks, sortState);
  const watchlistStocks = stocks.filter(stock => stock.inWatchlist);

  // Create watchlist stocks with history for the chart
  const watchlistStocksWithHistory: StockWithHistory[] = watchlistStocks.map(stock => ({
    ...stock,
    history: detailedStock.history
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      <main className="flex-1 container max-w-7xl py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Garuda Saham Insight</h1>
          <p className="text-muted-foreground">
            Analyze IDX stocks with fundamental analysis to find quality companies at attractive prices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
              onToggleWatchlist={toggleWatchlist}
              onViewDetails={viewStockDetails}
            />
          </div>
          
          <div>
            <Watchlist 
              stocks={watchlistStocks}
              onRemoveFromWatchlist={removeFromWatchlist}
              onViewDetails={viewStockDetails}
            />
            
            {watchlistStocks.length > 0 && (
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Historical Performance</h3>
                    <Select
                      value={selectedMetric}
                      onValueChange={(value) => setSelectedMetric(value as typeof selectedMetric)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eps">EPS</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="roe">ROE</SelectItem>
                        <SelectItem value="debtToEquity">Debt/Equity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <StockChart 
                    history={selectedStock?.history || watchlistStocksWithHistory[0]?.history || detailedStock.history}
                    title="Historical Performance"
                    description="Historical trends of key metrics"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Stock Detail Dialog */}
      {selectedStock && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedStock.ticker} - {selectedStock.name}</DialogTitle>
              <DialogDescription>
                {selectedStock.sector} | Market Cap: {(selectedStock.marketCap / 1_000_000_000_000).toFixed(2)} T IDR
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
                <TabsTrigger value="valuation">Valuation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Select
                      value={selectedMetric}
                      onValueChange={(value) => setSelectedMetric(value as typeof selectedMetric)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eps">EPS</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="roe">ROE</SelectItem>
                        <SelectItem value="debtToEquity">Debt/Equity</SelectItem>
                      </SelectContent>
                    </Select>
                    <StockChart
                      history={selectedStock.history}
                      title="Financial History"
                      description="Historical performance trends"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Current Price</div>
                        <div className="text-2xl font-bold">{selectedStock.price.toLocaleString('id-ID')}</div>
                        <div className={`text-sm ${selectedStock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Fair Value</div>
                        <div className="text-2xl font-bold">{selectedStock.fairValue?.toLocaleString('id-ID') || 'N/A'}</div>
                        {selectedStock.fairValue && (
                          <div className={`text-sm ${selectedStock.price < selectedStock.fairValue ? 'text-success' : 'text-danger'}`}>
                            {selectedStock.price < selectedStock.fairValue ? 'Undervalued' : 'Overvalued'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Key Metrics</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div>P/E Ratio:</div>
                        <div className="text-right">{selectedStock.pe?.toFixed(2) || 'N/A'}</div>
                        <div>P/B Ratio:</div>
                        <div className="text-right">{selectedStock.pbv?.toFixed(2) || 'N/A'}</div>
                        <div>ROE:</div>
                        <div className="text-right">{selectedStock.roe?.toFixed(2)}%</div>
                        <div>Debt to Equity:</div>
                        <div className="text-right">{selectedStock.debtToEquity?.toFixed(2) || 'N/A'}</div>
                        <div>Dividend Yield:</div>
                        <div className="text-right">{selectedStock.dividendYield?.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="fundamentals" className="pt-4">
                <StockChart
                  history={selectedStock.history}
                  title="Fundamental Analysis"
                  description="Key fundamental metrics over time"
                />
              </TabsContent>
              
              <TabsContent value="valuation" className="pt-4">
                <StockChart
                  history={selectedStock.history}
                  title="Valuation Analysis"
                  description="Historical valuation metrics"
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
