
import React from 'react';
import { Star, Eye, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Stock } from "../types/stock";
import { formatPrice, calculateFundamentalScore, calculateValuationScore } from "../utils/stockUtils";

interface WatchlistProps {
  stocks: Stock[];
  onRemoveFromWatchlist: (stockId: string) => void;
  onViewDetails: (stockId: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({
  stocks,
  onRemoveFromWatchlist,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-accent fill-accent mr-2" />
            <CardTitle>Watchlist</CardTitle>
          </div>
          <Badge variant="outline">{stocks.length}</Badge>
        </div>
        <CardDescription>Track your top picks</CardDescription>
      </CardHeader>
      <CardContent>
        {stocks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No stocks in your watchlist yet.
            <br />
            Click the star icon to add stocks.
          </div>
        ) : (
          <div className="space-y-3">
            {stocks.map(stock => {
              const fundamentalScore = calculateFundamentalScore(stock);
              const valuationScore = calculateValuationScore(stock);
              const isUndervalued = stock.fairValue !== null && stock.price < stock.fairValue;
              
              return (
                <div key={stock.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stock.ticker}</span>
                      <Badge variant="outline" className="text-xs">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {stock.name}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center">
                        <span className="font-medium">{formatPrice(stock.price)}</span>
                        <span className={`ml-1.5 text-xs ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {stock.change >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 inline" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 inline" />
                          )}
                          {Math.abs(stock.change)}%
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onViewDetails(stock.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemoveFromWatchlist(stock.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-primary/20 hover:bg-primary/30 text-primary text-xs">
                        F: {fundamentalScore}
                      </Badge>
                      <Badge className="bg-secondary/20 hover:bg-secondary/30 text-secondary text-xs">
                        V: {valuationScore}
                      </Badge>
                      {isUndervalued && (
                        <Badge className="bg-success/20 hover:bg-success/30 text-success text-xs">
                          Undervalued
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Watchlist;
