import React, { useState } from 'react';
import { Settings, SlidersHorizontal, Database, PieChart, BarChart, Moon, Check } from "lucide-react";

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

const SettingsPage = () => {
  const { toast } = useToast();
  
  // Default thresholds
  const [thresholds, setThresholds] = useState({
    minRoe: 15,
    maxPe: 20,
    maxPbv: 3,
    minDividendYield: 2,
    maxDebtToEquity: 1
  });
  
  // Default preferences
  const [preferences, setPreferences] = useState({
    defaultView: "value",
    enableNotifications: true,
    autoRefresh: true,
    showDetailedMetrics: true
  });
  
  // Handle threshold changes
  const handleThresholdChange = (key: keyof typeof thresholds) => (value: number[]) => {
    setThresholds(prev => ({ ...prev, [key]: value[0] }));
  };
  
  // Handle preference changes
  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  // Save settings
  const saveSettings = () => {
    // Would normally save to backend/localStorage
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <main className="flex-1 container max-w-7xl py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize the platform to match your investment style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Analysis Thresholds
                </CardTitle>
                <CardDescription>
                  Set your preferred thresholds for stock analysis metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="min-roe">Minimum ROE (%)</Label>
                      <span className="text-sm font-medium">{thresholds.minRoe}%</span>
                    </div>
                    <Slider 
                      id="min-roe"
                      defaultValue={[thresholds.minRoe]} 
                      min={0} 
                      max={30} 
                      step={1} 
                      onValueChange={handleThresholdChange('minRoe')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values will filter for more profitable companies
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-pe">Maximum P/E Ratio</Label>
                      <span className="text-sm font-medium">{thresholds.maxPe}</span>
                    </div>
                    <Slider 
                      id="max-pe"
                      defaultValue={[thresholds.maxPe]} 
                      min={5} 
                      max={50} 
                      step={1} 
                      onValueChange={handleThresholdChange('maxPe')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values will filter for potentially undervalued companies
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-pbv">Maximum P/BV Ratio</Label>
                      <span className="text-sm font-medium">{thresholds.maxPbv}</span>
                    </div>
                    <Slider 
                      id="max-pbv"
                      defaultValue={[thresholds.maxPbv]} 
                      min={0.5} 
                      max={10} 
                      step={0.5} 
                      onValueChange={handleThresholdChange('maxPbv')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values will filter for companies trading closer to their book value
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="min-dividend">Minimum Dividend Yield (%)</Label>
                      <span className="text-sm font-medium">{thresholds.minDividendYield}%</span>
                    </div>
                    <Slider 
                      id="min-dividend"
                      defaultValue={[thresholds.minDividendYield]} 
                      min={0} 
                      max={10} 
                      step={0.5} 
                      onValueChange={handleThresholdChange('minDividendYield')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values will filter for companies that pay more dividends
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-debt">Maximum Debt to Equity Ratio</Label>
                      <span className="text-sm font-medium">{thresholds.maxDebtToEquity}</span>
                    </div>
                    <Slider 
                      id="max-debt"
                      defaultValue={[thresholds.maxDebtToEquity]} 
                      min={0} 
                      max={3} 
                      step={0.1} 
                      onValueChange={handleThresholdChange('maxDebtToEquity')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values will filter for companies with less debt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-glass mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Settings
                </CardTitle>
                <CardDescription>
                  Configure data preferences and sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-refresh">Auto-refresh Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically update stock data when available
                      </p>
                    </div>
                    <Switch 
                      id="auto-refresh" 
                      checked={preferences.autoRefresh}
                      onCheckedChange={(checked) => handlePreferenceChange('autoRefresh', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="detailed-metrics">Show Detailed Metrics</Label>
                      <p className="text-sm text-muted-foreground">
                        Display additional advanced metrics in stock analysis
                      </p>
                    </div>
                    <Switch 
                      id="detailed-metrics" 
                      checked={preferences.showDetailedMetrics}
                      onCheckedChange={(checked) => handlePreferenceChange('showDetailedMetrics', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
                <CardDescription>
                  Choose your preferred view and appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-view">Default View</Label>
                    <Select 
                      value={preferences.defaultView}
                      onValueChange={(value) => handlePreferenceChange('defaultView', value)}
                    >
                      <SelectTrigger id="default-view" className="w-full">
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">Value Investing</SelectItem>
                        <SelectItem value="growth">Growth Focus</SelectItem>
                        <SelectItem value="dividend">Dividend Focus</SelectItem>
                        <SelectItem value="quality">Quality Companies</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This will preset filters when you open the screener
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Theme Settings</Label>
                    <div className="flex items-center gap-4 pt-2">
                      <ThemeToggle />
                      <span className="text-sm text-muted-foreground">
                        Toggle between light and dark mode
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="notifications">Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable watchlist alerts and updates
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={preferences.enableNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('enableNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-glass mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Chart Settings
                </CardTitle>
                <CardDescription>
                  Configure how charts and visualizations appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-chart">Default Chart Type</Label>
                    <Select defaultValue="line">
                      <SelectTrigger id="default-chart" className="w-full">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="smooth-charts">Smooth Charts</Label>
                      <p className="text-sm text-muted-foreground">
                        Use curved lines in line charts
                      </p>
                    </div>
                    <Switch id="smooth-charts" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings}>
            <Check className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
