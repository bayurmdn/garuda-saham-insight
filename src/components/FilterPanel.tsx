
import React from 'react';
import { 
  Filter, ChevronDown, ChevronUp, X, ChevronsUpDown, StarFilled, Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { FilterState } from "../types/stock";
import { sectors } from "../data/mockStocks";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onToggle
}) => {
  const handleChange = (field: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter(s => s !== sector)
      : [...filters.sectors, sector];
    
    handleChange('sectors', newSectors);
  };

  return (
    <div className="bg-card shadow-md border border-border rounded-lg overflow-hidden transition-all duration-300 mb-6">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-medium">Filter Stocks</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggle}
            className="text-xs"
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Hide Filters
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                Show Filters
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["fundamentals", "valuation"]}>
            <AccordionItem value="sectors">
              <AccordionTrigger>Sectors</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {sectors.map(sector => (
                    <div key={sector} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`sector-${sector}`}
                        checked={filters.sectors.includes(sector)}
                        onCheckedChange={() => handleSectorToggle(sector)}
                      />
                      <Label htmlFor={`sector-${sector}`}>{sector}</Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="fundamentals">
              <AccordionTrigger>Fundamental Filters</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minRoe">Minimum ROE (%)</Label>
                    <Input 
                      id="minRoe"
                      type="number"
                      placeholder="e.g. 15"
                      value={filters.minRoe === null ? '' : filters.minRoe}
                      onChange={e => handleChange(
                        'minRoe', 
                        e.target.value === '' ? null : Number(e.target.value)
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDebtToEquity">Maximum D/E Ratio</Label>
                    <Input 
                      id="maxDebtToEquity"
                      type="number"
                      placeholder="e.g. 1"
                      value={filters.maxDebtToEquity === null ? '' : filters.maxDebtToEquity}
                      onChange={e => handleChange(
                        'maxDebtToEquity', 
                        e.target.value === '' ? null : Number(e.target.value)
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minEpsGrowth">Minimum EPS Growth (%)</Label>
                    <Input 
                      id="minEpsGrowth"
                      type="number"
                      placeholder="e.g. 10"
                      value={filters.minEpsGrowth === null ? '' : filters.minEpsGrowth}
                      onChange={e => handleChange(
                        'minEpsGrowth', 
                        e.target.value === '' ? null : Number(e.target.value)
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="valuation">
              <AccordionTrigger>Valuation Filters</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPe">Maximum P/E</Label>
                    <Input 
                      id="maxPe"
                      type="number"
                      placeholder="e.g. 20"
                      value={filters.maxPe === null ? '' : filters.maxPe}
                      onChange={e => handleChange(
                        'maxPe', 
                        e.target.value === '' ? null : Number(e.target.value)
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxPbv">Maximum P/BV</Label>
                    <Input 
                      id="maxPbv"
                      type="number"
                      placeholder="e.g. 3"
                      value={filters.maxPbv === null ? '' : filters.maxPbv}
                      onChange={e => handleChange(
                        'maxPbv', 
                        e.target.value === '' ? null : Number(e.target.value)
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minDividendYield">Minimum Dividend Yield (%)</Label>
                    <Input 
                      id="minDividendYield"
                      type="number"
                      placeholder="e.g. 2"
                      value={filters.minDividendYield === null ? '' : filters.minDividendYield}
                      onChange={e => handleChange(
                        'minDividendYield', 
                        e.target.value === '' ? null : Number(e.target.value)
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyWatchlist" 
                checked={filters.onlyWatchlist}
                onCheckedChange={(checked) => handleChange('onlyWatchlist', Boolean(checked))}
              />
              <Label htmlFor="onlyWatchlist" className="flex items-center">
                <StarFilled className="h-3.5 w-3.5 mr-1 text-accent" />
                Watchlist only
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyUndervalued" 
                checked={filters.onlyUndervalued}
                onCheckedChange={(checked) => handleChange('onlyUndervalued', Boolean(checked))}
              />
              <Label htmlFor="onlyUndervalued" className="flex items-center">
                <Percent className="h-3.5 w-3.5 mr-1 text-success" />
                Undervalued only
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
