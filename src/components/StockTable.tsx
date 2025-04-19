import React from 'react';
import { 
  ArrowUp, ArrowDown, Eye, TrendingUp, TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SortField, Stock, SortState } from "../types/stock";
import {
  formatNumber,
  formatPercentage,
  formatPrice,
  calculateFundamentalScore,
  calculateValuationScore,
  getScoreCategory,
  getValueColor,
  exportToExcel
} from "../utils/stockUtils";

interface StockTableProps {
  stocks: Stock[];
  sortState: SortState;
  onSort: (field: SortField) => void;
  onViewDetails: (stockId: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  sortState,
  onSort,
  onViewDetails
}) => {
  const renderHeader = (field: SortField, label: string) => {
    const isActive = sortState.field === field;
    return (
      <div 
        className="flex items-center cursor-pointer hover:text-primary transition-colors"
        onClick={() => onSort(field)}
      >
        <span>{label}</span>
        {isActive && (
          <span className="ml-1">
            {sortState.direction === 'asc' ? 
              <ArrowUp className="h-3 w-3" /> : 
              <ArrowDown className="h-3 w-3" />}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h3 className="font-medium">Stock Analysis</h3>
        <div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportToExcel(stocks)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{renderHeader('ticker', 'Ticker')}</TableHead>
              <TableHead>{renderHeader('name', 'Company')}</TableHead>
              <TableHead>{renderHeader('sector', 'Sector')}</TableHead>
              <TableHead className="text-right">{renderHeader('price', 'Price')}</TableHead>
              <TableHead className="text-right">{renderHeader('change', 'Change')}</TableHead>
              <TableHead className="text-right">{renderHeader('pe', 'P/E')}</TableHead>
              <TableHead className="text-right">{renderHeader('pbv', 'P/BV')}</TableHead>
              <TableHead className="text-right">{renderHeader('roe', 'ROE')}</TableHead>
              <TableHead className="text-right">{renderHeader('debtToEquity', 'D/E')}</TableHead>
              <TableHead className="text-center">Fundamental</TableHead>
              <TableHead className="text-center">Valuation</TableHead>
              <TableHead className="text-right">{renderHeader('fairValue', 'Fair Value')}</TableHead>
              <TableHead className="w-[50px]">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                  No stocks match your filters
                </TableCell>
              </TableRow>
            ) : (
              stocks.map(stock => {
                const fundamentalScore = calculateFundamentalScore(stock);
                const valuationScore = calculateValuationScore(stock);
                const fundamentalCategory = getScoreCategory(fundamentalScore);
                const valuationCategory = getScoreCategory(valuationScore);
                
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.ticker}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span>{stock.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stock.sector}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(stock.price)}
                    </TableCell>
                    <TableCell className={`text-right ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercentage(stock.change)}
                    </TableCell>
                    <TableCell className={`text-right ${getValueColor(stock.pe, 20, false)}`}>
                      {formatNumber(stock.pe)}
                    </TableCell>
                    <TableCell className={`text-right ${getValueColor(stock.pbv, 3, false)}`}>
                      {formatNumber(stock.pbv)}
                    </TableCell>
                    <TableCell className={`text-right ${getValueColor(stock.roe, 15, true)}`}>
                      {stock.roe !== null ? `${stock.roe.toFixed(1)}%` : 'N/A'}
                    </TableCell>
                    <TableCell className={`text-right ${getValueColor(stock.debtToEquity, 1, false)}`}>
                      {formatNumber(stock.debtToEquity)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center">
                              <Badge className={`bg-${fundamentalCategory.color} hover:bg-${fundamentalCategory.color}/80 w-16 justify-center`}>
                                {fundamentalScore}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">
                              Fundamental Rating: {fundamentalCategory.label}
                              <br />
                              Based on ROE, growth, and debt metrics
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center">
                              <Badge className={`bg-${valuationCategory.color} hover:bg-${valuationCategory.color}/80 w-16 justify-center`}>
                                {valuationScore}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">
                              Valuation Rating: {valuationCategory.label}
                              <br />
                              Based on P/E, P/BV, and fair value
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {stock.price < (stock.fairValue ?? 0) ? (
                          <TrendingUp className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-danger" />
                        )}
                        <span className={stock.price < (stock.fairValue ?? 0) ? 'text-success' : 'text-danger'}>
                          {formatPrice(stock.fairValue ?? 0)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onViewDetails(stock.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border text-sm text-muted-foreground">
        Showing {stocks.length} stocks
      </div>
    </div>
  );
};

export default StockTable;
