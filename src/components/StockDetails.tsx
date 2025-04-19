
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StockChart from './StockChart';
import StockMetricsCard from './StockMetricsCard';
import { StockWithHistory } from '../types/stock';

interface StockDetailsProps {
  stock: StockWithHistory | null;
  open: boolean;
  onClose: () => void;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock, open, onClose }) => {
  const [selectedMetric, setSelectedMetric] = React.useState<'eps' | 'revenue' | 'roe' | 'debtToEquity'>('eps');

  if (!stock) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{stock.ticker} - {stock.name}</DialogTitle>
          <DialogDescription>
            {stock.sector} | Market Cap: {(stock.marketCap / 1_000_000_000_000).toFixed(2)} T IDR
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
                  history={stock.history}
                  title="Financial History"
                  description="Historical performance trends"
                />
              </div>
              
              <StockMetricsCard stock={stock} />
            </div>
          </TabsContent>
          
          <TabsContent value="fundamentals" className="pt-4">
            <StockChart
              history={stock.history}
              title="Fundamental Analysis"
              description="Key fundamental metrics over time"
            />
          </TabsContent>
          
          <TabsContent value="valuation" className="pt-4">
            <StockChart
              history={stock.history}
              title="Valuation Analysis"
              description="Historical valuation metrics"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StockDetails;
