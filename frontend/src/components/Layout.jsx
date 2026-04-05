import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-dark-slate">
      <Navbar />
      <main className={`flex-grow w-full ${isLanding ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
