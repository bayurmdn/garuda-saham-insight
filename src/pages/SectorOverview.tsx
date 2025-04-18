
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Building2, 
  ArrowRight, Star 
} from "lucide-react";

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { sectors, mockStocks } from '../data/mockStocks';
import { 
  formatNumber, formatPercentage, formatPrice,
  calculateFundamentalScore, calculateValuationScore 
} from "../utils/stockUtils";

const SectorOverview = () => {
  const [selectedSector, setSelectedSector] = useState<string>(sectors[0]);
  
  // Group stocks by sector
  const stocksBySector = sectors.reduce((acc, sector) => {
    acc[sector] = mockStocks.filter(stock => stock.sector === sector);
    return acc;
  }, {} as Record<string, typeof mockStocks>);
  
  // Calculate sector averages
  const sectorMetrics = sectors.map(sector => {
    const sectorStocks = stocksBySector[sector];
    
    const avgRoe = sectorStocks.reduce((sum, stock) => sum + (stock.roe || 0), 0) / sectorStocks.length;
    const avgPe = sectorStocks.reduce((sum, stock) => sum + (stock.pe || 0), 0) / sectorStocks.length;
    const avgPbv = sectorStocks.reduce((sum, stock) => sum + (stock.pbv || 0), 0) / sectorStocks.length;
    const avgDividendYield = sectorStocks.reduce((sum, stock) => sum + (stock.dividendYield || 0), 0) / sectorStocks.length;
    
    // Sort by fundamentals score to get top stocks
    const topFundamentalStocks = [...sectorStocks]
      .sort((a, b) => calculateFundamentalScore(b) - calculateFundamentalScore(a))
      .slice(0, 3);
    
    // Sort by valuation to get most undervalued stocks
    const mostUndervaluedStocks = [...sectorStocks]
      .filter(stock => stock.fairValue !== null && stock.fairValue > stock.price)
      .sort((a, b) => {
        const aDiscount = a.fairValue! / a.price - 1;
        const bDiscount = b.fairValue! / b.price - 1;
        return bDiscount - aDiscount;
      })
      .slice(0, 3);
    
    return {
      sector,
      stockCount: sectorStocks.length,
      avgRoe,
      avgPe,
      avgPbv,
      avgDividendYield,
      topFundamentalStocks,
      mostUndervaluedStocks
    };
  });
  
  const currentSectorData = sectorMetrics.find(s => s.sector === selectedSector)!;

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <main className="flex-1 container max-w-7xl py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sector Overview</h1>
          <p className="text-muted-foreground">
            Analyze performance and metrics across different industry sectors
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Sector Selection */}
          <Card className="card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Industry Sectors
              </CardTitle>
              <CardDescription>
                Select a sector to view detailed metrics and top performers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-2 pb-1">
                  {sectors.map((sector) => (
                    <Button
                      key={sector}
                      variant={selectedSector === sector ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSector(sector)}
                      className={selectedSector === sector ? "" : "button-glass"}
                    >
                      {sector}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Selected Sector Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average ROE</CardTitle>
                <CardDescription>Return on Equity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{formatPercentage(currentSectorData.avgRoe)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Sector Average
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average P/E</CardTitle>
                <CardDescription>Price to Earnings Ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{formatNumber(currentSectorData.avgPe)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Sector Average
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average P/BV</CardTitle>
                <CardDescription>Price to Book Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{formatNumber(currentSectorData.avgPbv)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Sector Average
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dividend Yield</CardTitle>
                <CardDescription>Average Annual Yield</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{formatPercentage(currentSectorData.avgDividendYield)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Sector Average
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Performers and Undervalued Stocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-success" />
                  Top Fundamental Performers
                </CardTitle>
                <CardDescription>
                  Stocks with the strongest fundamental metrics in {selectedSector}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentSectorData.topFundamentalStocks.map((stock) => (
                    <li key={stock.id} className="flex items-center justify-between p-2 rounded-lg bg-background/40 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{stock.ticker}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                          {stock.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-success/10">
                          ROE: {formatPercentage(stock.roe || 0)}
                        </Badge>
                        {stock.inWatchlist && <Star className="h-4 w-4 text-accent fill-accent" />}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="card-glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Most Undervalued Stocks
                </CardTitle>
                <CardDescription>
                  Stocks with the largest discount to fair value in {selectedSector}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentSectorData.mostUndervaluedStocks.length > 0 ? (
                    currentSectorData.mostUndervaluedStocks.map((stock) => (
                      <li key={stock.id} className="flex items-center justify-between p-2 rounded-lg bg-background/40 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{stock.ticker}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                            {stock.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Current: </span>
                            <span className="font-medium">{formatPrice(stock.price)}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <span className="text-muted-foreground">Fair: </span>
                            <span className="font-medium text-success">{formatPrice(stock.fairValue!)}</span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No undervalued stocks found in this sector
                    </div>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Sector Trends */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {selectedSector} Sector Trends
              </CardTitle>
              <CardDescription>
                Historical performance metrics for the {selectedSector} sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="performance">
                <TabsList>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="valuation">Valuation</TabsTrigger>
                  <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
                </TabsList>
                
                <TabsContent value="performance" className="p-4">
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center rounded-lg">
                    <p className="text-muted-foreground">Historical sector performance chart will be displayed here</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="valuation" className="p-4">
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center rounded-lg">
                    <p className="text-muted-foreground">Historical sector valuation chart will be displayed here</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="fundamentals" className="p-4">
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center rounded-lg">
                    <p className="text-muted-foreground">Historical sector fundamental metrics chart will be displayed here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SectorOverview;
