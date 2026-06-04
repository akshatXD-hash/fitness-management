import { Link, useLocation } from "react-router-dom";
import { Activity, LogOut, LogIn, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent rendering nav if on auth page intentionally
  if (location.pathname === '/auth') return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border ${scrolled ? 'py-3 shadow-sm' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-3xl font-medium tracking-tight text-primary">Flexio.</span>
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex space-x-10 items-center">
              <Link to="/bmi" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                BMI
              </Link>
              <Link to="/workout" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                Workout
              </Link>
              <Link to="/sleep" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                Sleep
              </Link>
              <Link to="/nutrition" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                Nutrition
              </Link>
              <Link to="/diet" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                Diet Planner
              </Link>
              <Link to="/hydration" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                Hydration
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link to="/auth" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                Sign In <LogIn className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                {location.pathname !== '/dashboard' && (
                  <Link to="/dashboard" className="flex items-center gap-1 text-sm font-bold text-foreground group hover:text-primary transition-colors">
                    Dashboard <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors font-bold text-sm">
                  Logout <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
