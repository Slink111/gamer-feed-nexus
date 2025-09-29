import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { GamepadIcon, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="p-4 rounded-full gaming-gradient w-fit mx-auto mb-6">
            <GamepadIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Game Over</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Looks like this page respawned in a different dimension. Let's get you back to the gaming hub!
          </p>
        </div>
        
        <Button 
          onClick={() => navigate("/")} 
          className="gaming-gradient text-white hover:scale-105 transition-transform shadow-glow"
          size="lg"
        >
          <Home className="mr-2 h-4 w-4" />
          Return to GameZone
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
