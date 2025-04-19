import React, { useState } from 'react';
import { 
  Filter, ChevronDown, ChevronUp, X, ChevronsUpDown,
  Building2, BarChart3, Percent
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  const [sectorPopoverOpen, setSectorPopoverOpen] = useState(false);

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

  const handleSelectAllSectors = () => {
    if (filters.sectors.length === sectors.length) {
      handleChange('sectors', []);
    } else {
      handleChange('sectors', [...sectors]);
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-md shadow-lg border border-border/50 rounded-xl overflow-hidden transition-all duration-300 mb-6 hover:shadow-xl">
      <div className="p-4 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-medium">Filter Stocks</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-xs hover:bg-background/50"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggle}
            className="text-xs hover:bg-background/50"
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
          <div className="mb-4">
            <Label htmlFor="sector-filter" className="flex items-center gap-2 mb-2 font-medium">
              <Building2 className="h-4 w-4" />
              Sectors
            </Label>
            <div className="flex flex-wrap gap-2">
              <Popover open={sectorPopoverOpen} onOpenChange={setSectorPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 border-dashed flex justify-between gap-1">
                    <Building2 className="mr-2 h-4 w-4" />
                    {filters.sectors.length > 0 ? (
                      <>
                        <span>
                          {filters.sectors.length} selected
                        </span>
                      </>
                    ) : (
                      <span>Select sectors</span>
                    )}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search sectors..." />
                    <CommandList>
                      <CommandEmpty>No sector found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem 
                          onSelect={handleSelectAllSectors}
                          className="flex items-center gap-2"
                        >
                          <Checkbox 
                            checked={filters.sectors.length === sectors.length && sectors.length > 0}
                            onCheckedChange={handleSelectAllSectors}
                          />
                          <span>{filters.sectors.length === sectors.length && sectors.length > 0 ? 'Deselect All' : 'Select All'}</span>
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup>
                        <ScrollArea className="h-[260px]">
                          {sectors.map((sector) => (
                            <CommandItem
                              key={sector}
                              onSelect={() => handleSectorToggle(sector)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id={`sector-${sector}`}
                                  checked={filters.sectors.includes(sector)}
                                  onCheckedChange={() => handleSectorToggle(sector)}
                                />
                                <Label htmlFor={`sector-${sector}`}>{sector}</Label>
                              </div>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {filters.sectors.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {filters.sectors.map(sector => (
                    <Badge key={sector} variant="outline" className="text-xs bg-background/50 backdrop-blur-sm">
                      {sector}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleSectorToggle(sector)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["fundamentals", "valuation"]}>
            <AccordionItem value="fundamentals" className="border-border/50">
              <AccordionTrigger className="hover:bg-background/20">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Fundamental Filters</span>
                </div>
              </AccordionTrigger>
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
                      className="backdrop-blur-sm bg-background/50"
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
                      className="backdrop-blur-sm bg-background/50"
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
                      className="backdrop-blur-sm bg-background/50"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="valuation" className="border-border/50">
              <AccordionTrigger className="hover:bg-background/20">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  <span>Valuation Filters</span>
                </div>
              </AccordionTrigger>
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
                      className="backdrop-blur-sm bg-background/50"
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
                      className="backdrop-blur-sm bg-background/50"
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
                      className="backdrop-blur-sm bg-background/50"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyUndervalued" 
                checked={filters.onlyUndervalued}
                onCheckedChange={(checked) => handleChange('onlyUndervalued', Boolean(checked))}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
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
