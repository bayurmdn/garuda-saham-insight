
import React from 'react';
import { 
  HelpCircle, Info, BookOpen, CheckCircle, HeartHandshake
} from "lucide-react";

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

const HelpPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <main className="flex-1 container max-w-7xl py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Help & Resources</h1>
          <p className="text-muted-foreground">
            Learn about fundamental stock analysis and how to use this platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Fundamental Analysis Explained
                </CardTitle>
                <CardDescription>
                  Understanding the key metrics used in stock analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="pe-ratio">
                    <AccordionTrigger>P/E Ratio (Price to Earnings)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          The price-to-earnings ratio (P/E ratio) is the ratio for valuing a company that measures its current share price relative to its earnings per share (EPS).
                        </p>
                        <div className="text-sm">
                          <p className="font-medium">How to interpret:</p>
                          <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                            <li>High P/E ({'>'}25): Could indicate an overvalued stock or high growth expectations</li>
                            <li>Moderate P/E (15-25): Generally considered reasonable valuation</li>
                            <li>Low P/E ({'<'}15): Might indicate an undervalued stock or issues with the company</li>
                          </ul>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The P/E ratio alone is not enough for stock evaluation. It should be compared with industry averages and the company's growth rate.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pbv-ratio">
                    <AccordionTrigger>P/BV Ratio (Price to Book Value)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          The price-to-book ratio (P/BV) compares a company's market value to its book value. It's calculated by dividing the current closing price of the stock by the latest quarter's book value per share.
                        </p>
                        <div className="text-sm">
                          <p className="font-medium">How to interpret:</p>
                          <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                            <li>P/BV {'<'} 1: Stock could be undervalued (selling for less than the value of its assets)</li>
                            <li>P/BV {'>'} 3: Often considered expensive (except for high-growth companies)</li>
                            <li>Different industries have different typical P/BV ranges</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="roe">
                    <AccordionTrigger>ROE (Return on Equity)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          Return on Equity (ROE) measures a company's profitability by revealing how much profit it generates with the money shareholders have invested.
                        </p>
                        <div className="text-sm">
                          <p className="font-medium">How to interpret:</p>
                          <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                            <li>ROE {'>'} 15%: Generally considered good</li>
                            <li>ROE {'>'} 20%: Excellent (but verify it's sustainable)</li>
                            <li>Consistent or improving ROE over time is a positive signal</li>
                            <li>Compare with industry averages (some industries naturally have higher ROE)</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="debt-to-equity">
                    <AccordionTrigger>Debt to Equity Ratio</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          The debt-to-equity (D/E) ratio compares a company's total liabilities to its shareholder equity and is used to evaluate a company's financial leverage.
                        </p>
                        <div className="text-sm">
                          <p className="font-medium">How to interpret:</p>
                          <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                            <li>D/E {'<'} 1: Company has more equity than debt (generally safer)</li>
                            <li>D/E {'>'} 2: Company has significant leverage (higher risk)</li>
                            <li>Some industries (like banking or utilities) normally operate with higher D/E ratios</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="dividend-yield">
                    <AccordionTrigger>Dividend Yield</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          Dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative to its stock price.
                        </p>
                        <div className="text-sm">
                          <p className="font-medium">How to interpret:</p>
                          <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
                            <li>High yield ({'>'}4%): Might be attractive for income investors, but check if sustainable</li>
                            <li>Low yield ({'<'}2%): Common for growth companies that reinvest profits</li>
                            <li>Dividend consistency over time is often more important than a high yield</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card className="card-glass mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Financial Glossary
                </CardTitle>
                <CardDescription>
                  Common terms used in financial analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Fundamental Analysis</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">EPS (Earnings Per Share)</dt>
                        <dd className="text-sm text-muted-foreground">The portion of a company's profit allocated to each outstanding share of common stock.</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Market Capitalization</dt>
                        <dd className="text-sm text-muted-foreground">The total market value of a company's outstanding shares.</dd>
                      </div>
                      <div>
                        <dt className="font-medium">EBITDA</dt>
                        <dd className="text-sm text-muted-foreground">Earnings Before Interest, Taxes, Depreciation, and Amortization - a measure of a company's overall financial performance.</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Gross Margin</dt>
                        <dd className="text-sm text-muted-foreground">The difference between revenue and cost of goods sold, divided by revenue.</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Valuation Metrics</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">Intrinsic Value</dt>
                        <dd className="text-sm text-muted-foreground">The actual value of a company or asset based on underlying perception of its true value.</dd>
                      </div>
                      <div>
                        <dt className="font-medium">DCF (Discounted Cash Flow)</dt>
                        <dd className="text-sm text-muted-foreground">A valuation method used to estimate the value of an investment based on its expected future cash flows.</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Fair Value</dt>
                        <dd className="text-sm text-muted-foreground">An estimate of the potential market price of an asset or company.</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Margin of Safety</dt>
                        <dd className="text-sm text-muted-foreground">The difference between the intrinsic value of a stock and its market price.</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  How to Use This Platform
                </CardTitle>
                <CardDescription>
                  Step by step guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">1. Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Get a quick overview of market conditions, best fundamental stocks, and sector performance.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-1">2. Stock Screener</h3>
                    <p className="text-sm text-muted-foreground">Filter stocks using customizable parameters to find those that match your investment criteria.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-1">3. Stock Details</h3>
                    <p className="text-sm text-muted-foreground">Click on any stock to see detailed metrics, historical data, and valuation analysis.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-1">4. Sector Analysis</h3>
                    <p className="text-sm text-muted-foreground">Compare performance across sectors and find the best opportunities within each industry.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-1">5. Watchlist</h3>
                    <p className="text-sm text-muted-foreground">Save stocks of interest to track their performance over time.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-glass mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5" />
                  Contact Us
                </CardTitle>
                <CardDescription>
                  Feedback and support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p>
                    We're constantly working to improve this platform. If you have any feedback, suggestions, or need support, please reach out to us.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Email:</p>
                    <p className="text-muted-foreground">support@idxanalyzer.com</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Social Media:</p>
                    <div className="flex gap-4">
                      <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
                      <a href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
                      <a href="#" className="text-muted-foreground hover:text-foreground">Telegram</a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpPage;
