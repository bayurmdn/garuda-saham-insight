
import React from 'react';
import { Link } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-4 px-6 mt-10 border-t border-border">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground mb-3 sm:mb-0">
            &copy; {new Date().getFullYear()} Garuda Saham Insight. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Link className="h-3.5 w-3.5 mr-1" />
              <span>Data courtesy of IDX</span>
            </div>
            <span>•</span>
            <div>Disclaimer: Not financial advice</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
