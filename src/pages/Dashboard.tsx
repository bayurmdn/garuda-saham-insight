
import React from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, CheckCircle, 
  PieChart, ArrowRight, LineChart 
} from "lucide-react";

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { mockStocks } from '../data/mockStocks';
import { sectors } from '../data/mockStocks';
import { 
  formatNumber, formatPercentage, formatPrice,
  calculateFundamentalScore, calculateValuationScore, getScoreCategory
} from "../utils/stockUtils";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Find good fundamental stocks (score >= 8)
  const goodFundamentalStocks = [...mockStocks]
    .sort((a, b) => calculateFundamentalScore(b) - calculateFundamentalScore(a))
    .filter(stock => calculateFundamentalScore(stock) >= 8)
    .slice(0, 5);
  
  // Find undervalued stocks
  const undervaluedStocks = [...mockStocks]
    .filter(stock => stock.fairValue !== null && stock.fairValue > stock.price)
    .sort((a, b) => {
      const aDiscount = a.fairValue! / a.price - 1;
      const bDiscount = b.fairValue! / b.price - 1;
      return bDiscount - aDiscount;
    })
    .slice(0, 5);
  
  // Calculate sector performance
  const sectorPerformance = sectors.map(sector => {
    const sectorStocks = mockStocks.filter(stock => stock.sector === sector);
    const avgRoe = sectorStocks.reduce((sum, stock) => sum + (stock.roe || 0), 0) / sectorStocks.length;
    const avgGrowth = sectorStocks.reduce((sum, stock) => sum + (stock.epsGrowth || 0), 0) / sectorStocks.length;
    
    return {
      sector,
      avgRoe,
      avgGrowth,
      stockCount: sectorStocks.length
    };
  }).sort((a, b) => b.avgRoe - a.avgRoe);

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <main className="flex-1 container max-w-7xl py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">IDX Stock Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze Indonesia-listed stocks with customizable fundamental and valuation parameters
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Quality Stocks */}
          <Card className="card-glass lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Top Quality Stocks
              </CardTitle>
              <CardDescription>
                Fundamentally strong stocks with the highest quality scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goodFundamentalStocks.map((stock) => {
                  const fundamentalScore = calculateFundamentalScore(stock);
                  const fundamentalCategory = getScoreCategory(fundamentalScore);
                  
                  return (
                    <div key={stock.id} className="flex items-center justify-between p-2 rounded-lg bg-background/40 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <Badge className={`bg-${fundamentalCategory.color} hover:bg-${fundamentalCategory.color}/80 w-10 justify-center`}>
                          {fundamentalScore}
                        </Badge>
                        <div>
                          <div className="font-medium">{stock.ticker}</div>
                          <div className="text-xs text-muted-foreground">{stock.sector}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">{stock.name}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>ROE: <span className="text-success">{formatPercentage(stock.roe || 0)}</span></span>
                          <span>D/E: <span className={stock.debtToEquity && stock.debtToEquity < 1 ? "text-success" : "text-danger"}>
                            {formatNumber(stock.debtToEquity)}
                          </span></span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/?stockId=${stock.id}`}>Details</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Summary Stats */}
          <Card className="card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Market Statistics
              </CardTitle>
              <CardDescription>
                Overview of IDX stock market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-semibold">{goodFundamentalStocks.length}</div>
                  <div className="text-xs text-muted-foreground">Quality Stocks</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-semibold">{undervaluedStocks.length}</div>
                  <div className="text-xs text-muted-foreground">Undervalued</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg P/E (Market)</span>
                  <span className="font-medium">
                    {formatNumber(mockStocks.reduce((sum, stock) => sum + (stock.pe || 0), 0) / mockStocks.length)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg ROE (Market)</span>
                  <span className="font-medium">
                    {formatPercentage(mockStocks.reduce((sum, stock) => sum + (stock.roe || 0), 0) / mockStocks.length)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Div Yield</span>
                  <span className="font-medium">
                    {formatPercentage(mockStocks.reduce((sum, stock) => sum + (stock.dividendYield || 0), 0) / mockStocks.length)}
                  </span>
                </div>
              </div>
              
              <div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Go to Stock Screener</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Undervalued Stocks */}
          <Card className="card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Most Undervalued
              </CardTitle>
              <CardDescription>
                Stocks with highest discount to fair value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {undervaluedStocks.map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between p-2 rounded-lg bg-background/40 backdrop-blur-sm">
                    <div>
                      <div className="font-medium">{stock.ticker}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</div>
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
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/?stockId=${stock.id}`}>Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Sector Performance */}
          <Card className="card-glass lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sector Performance
              </CardTitle>
              <CardDescription>
                Performance metrics across different industry sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {sectorPerformance.map((item) => (
                    <div key={item.sector} className="flex items-center justify-between p-2 rounded-lg bg-background/40 backdrop-blur-sm">
                      <div className="w-1/3">
                        <div className="font-medium">{item.sector}</div>
                        <div className="text-xs text-muted-foreground">{item.stockCount} stocks</div>
                      </div>
                      <div className="flex gap-6">
                        <div>
                          <div className="text-xs text-muted-foreground">Avg ROE</div>
                          <div className={`font-medium ${item.avgRoe > 15 ? "text-success" : ""}`}>
                            {formatPercentage(item.avgRoe)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Growth</div>
                          <div className={`font-medium ${item.avgGrowth > 10 ? "text-success" : ""}`}>
                            {formatPercentage(item.avgGrowth)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/sectors?sector=${encodeURIComponent(item.sector)}`}>
                          View Sector
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card className="card-glass">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Recent Market Activity
              </CardTitle>
              <CardDescription>
                Latest changes in the market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  This panel will show latest market movements, news, and top gainers/losers once integrated with live market data.
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/sectors">View All Sectors</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
