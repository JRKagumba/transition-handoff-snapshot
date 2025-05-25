import { Link } from "wouter";
import { ReactNode } from "react";
import { Repeat, User } from "lucide-react";

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-100 backdrop-blur-sm sticky top-0 z-10 w-full">
      <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-primary/10 p-1 sm:p-1.5 rounded-md mr-2 sm:mr-3">
            <Repeat className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h1 className="text-base sm:text-xl font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Link href="/">Care Companion</Link>
          </h1>
        </div>
        {children ? (
          children
        ) : (
          <div className="flex items-center">
            <div className="bg-secondary/30 p-1 rounded-full mr-1 sm:mr-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground" />
            </div>
            <span className="text-xs sm:text-sm truncate">Dr. Sarah Johnson</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
