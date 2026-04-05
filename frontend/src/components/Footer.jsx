import { Activity, Globe, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-dark-slate text-white pt-20 pb-10 border-t-4 border-lime-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
               <div className="bg-lime-accent p-1.5 rounded-sm">
                 <Activity className="h-6 w-6 text-dark-slate" strokeWidth={3} />
               </div>
               <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Fitness<span className="text-lime-accent">Core</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
              We leverage cutting-edge AI to provide personalized workout schedules, sleep metrics, and body insights for optimal peak performance.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-lime-accent transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-lime-accent transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-lime-accent transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/bmi" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">BMI Calculator</Link></li>
              <li><Link to="/workout" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">AI Workouts</Link></li>
              <li><Link to="/sleep" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">Sleep Tracker</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-widest uppercase text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">About</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-lime-accent transition-colors font-medium">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-sm">
            © {new Date().getFullYear()} FitnessCore AI. All rights reserved.
          </p>
          <div className="bg-slate-800 px-4 py-2 rounded-sm select-none">
             <span className="text-lime-accent font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse"></span>
                 Systems Operational
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
