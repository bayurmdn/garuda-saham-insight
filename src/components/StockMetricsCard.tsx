
import React from 'react';
import { Stock } from '../types/stock';

interface StockMetricsCardProps {
  stock: Stock;
}

const StockMetricsCard: React.FC<StockMetricsCardProps> = ({ stock }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Current Price</div>
          <div className="text-2xl font-bold">{stock.price.toLocaleString('id-ID')}</div>
          <div className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change}%
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Fair Value</div>
          <div className="text-2xl font-bold">{stock.fairValue?.toLocaleString('id-ID') || 'N/A'}</div>
          {stock.fairValue && (
            <div className={`text-sm ${stock.price < stock.fairValue ? 'text-success' : 'text-danger'}`}>
              {stock.price < stock.fairValue ? 'Undervalued' : 'Overvalued'}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-2">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>P/E Ratio:</div>
          <div className="text-right">{stock.pe?.toFixed(2) || 'N/A'}</div>
          <div>P/B Ratio:</div>
          <div className="text-right">{stock.pbv?.toFixed(2) || 'N/A'}</div>
          <div>ROE:</div>
          <div className="text-right">{stock.roe?.toFixed(2)}%</div>
          <div>Debt to Equity:</div>
          <div className="text-right">{stock.debtToEquity?.toFixed(2) || 'N/A'}</div>
          <div>Dividend Yield:</div>
          <div className="text-right">{stock.dividendYield?.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default StockMetricsCard;
