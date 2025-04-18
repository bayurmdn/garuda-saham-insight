
import React from 'react';
import { Activity, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border w-full px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Activity className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Garuda Saham Insight</span>
        </div>
        
        <div className="flex-1 mx-4 md:mx-8 max-w-md relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks by ticker or name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Last updated: {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
