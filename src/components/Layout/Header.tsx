
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, Menu, X, BarChart3, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Stock Screener', path: '/screener' },
    { name: 'Sectors', path: '/sectors' },
    { name: 'Settings', path: '/settings' },
    { name: 'Help', path: '/help' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold">IDX Analyzer</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive(item.path) ? 'text-foreground font-bold' : 'text-foreground/60'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex-1 md:flex-initial flex items-center justify-end space-x-2">
            <div className="w-full sm:w-64 md:w-96 lg:w-96">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex md:hidden flex-1 justify-end">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="font-bold">IDX Analyzer</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mb-4">
                  <Input
                    type="search"
                    placeholder="Search stocks..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>

                <nav className="flex flex-col space-y-4 mb-8">
                  {navigationItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`text-lg ${
                        isActive(item.path) ? 'text-foreground font-bold' : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pb-8">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
