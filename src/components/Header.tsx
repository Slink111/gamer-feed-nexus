import { Search, Menu, GamepadIcon, Bell, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header = ({ onSearch, searchQuery }: HeaderProps) => {
  return (
    <header className="gaming-border border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gaming-gradient">
              <GamepadIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">GameZone</h1>
              <p className="text-xs text-muted-foreground">Gaming News Hub</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gaming news..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 gaming-border hover-glow focus:shadow-glow bg-card/80"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hover-glow">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover-glow">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;