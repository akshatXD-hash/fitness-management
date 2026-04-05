import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { loginUser, registerUser } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
      } else {
        await registerUser(formData.name, formData.email, formData.password);
      }
      await login(); // Updates global state
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-dark-slate absolute top-0 left-0 z-[100]">
      {/* Left Side - Graphic Premium Display */}
      <div className="hidden md:flex md:w-1/2 bg-lime-accent flex-col justify-between p-12 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.2]"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-dark-slate rounded-full blur-[150px] opacity-20 transform translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
         
         <div className="relative z-10 flex items-center gap-2">
            <div className="bg-dark-slate p-1.5 rounded-sm">
               <Activity className="h-6 w-6 text-lime-accent" strokeWidth={3} />
            </div>
            <span className="text-xl font-black text-dark-slate tracking-tighter uppercase mb-0">Fitness<span className="text-white drop-shadow-sm">Core</span></span>
         </div>

         <div className="relative z-10 max-w-md">
            <h2 className="text-5xl font-black text-dark-slate tracking-tighter leading-tight mb-8">
               Unlock your<br/>
               <span className="text-white drop-shadow-sm">Peak State.</span>
            </h2>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-dark-slate shrink-0 mt-1" />
                  <div>
                    <h4 className="text-dark-slate font-bold mb-1">Algorithmic Training</h4>
                    <p className="text-dark-slate/70 text-sm font-medium">Custom AI generation means you hit your specific fitness goals 5x faster than generic routines.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-dark-slate shrink-0 mt-1" />
                  <div>
                    <h4 className="text-dark-slate font-bold mb-1">Deep Recovery Tracking</h4>
                    <p className="text-dark-slate/70 text-sm font-medium">Scale your sleep habits to match the intensity of your workouts.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="relative z-10 text-dark-slate/60 text-sm font-bold">
            © {new Date().getFullYear()} FitnessCore AI.
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative bg-dark-slate text-white border-l border-slate-800">
         <Link to="/" className="absolute top-8 right-8 text-sm font-bold text-slate-400 hover:text-lime-accent transition-colors flex items-center gap-1">
           Back to home
         </Link>

         <div className="w-full max-w-md">
           <AnimatePresence mode="wait">
             <motion.div
               key={isLogin ? 'login' : 'register'}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
               <div className="mb-10">
                 <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                   {isLogin ? "Welcome Back" : "Start your journey"}
                 </h3>
                 <p className="text-slate-400 font-medium">
                   {isLogin ? "Enter your credentials to access your dashboard." : "Create a free account to generate AI workouts."}
                 </p>
               </div>

               {error && (
                 <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-200 text-sm font-bold tracking-wide shadow-sm rounded-r-sm">
                   {error}
                 </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-5">
                 {!isLogin && (
                   <div className="w-full">
                     <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                     <input 
                       className="w-full bg-transparent border-b-2 border-slate-700 py-3 text-white focus:outline-none focus:border-lime-accent transition-colors font-medium placeholder-slate-600"
                       type="text" 
                       placeholder="Jason Bourne" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       required={!isLogin}
                     />
                   </div>
                 )}
                 <div className="w-full">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                    <input 
                       className="w-full bg-transparent border-b-2 border-slate-700 py-3 text-white focus:outline-none focus:border-lime-accent transition-colors font-medium placeholder-slate-600"
                       type="email" 
                       placeholder="you@company.com" 
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       required
                    />
                 </div>
                 <div className="w-full">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex justify-between">
                       Password
                       {isLogin && <a href="#" className="normal-case text-lime-400 hover:text-lime-accent">Forgot?</a>}
                    </label>
                    <input 
                       className="w-full bg-transparent border-b-2 border-slate-700 py-3 text-white focus:outline-none focus:border-lime-accent transition-colors font-medium placeholder-slate-600"
                       type="password" 
                       placeholder="••••••••••" 
                       value={formData.password}
                       onChange={(e) => setFormData({...formData, password: e.target.value})}
                       required
                    />
                 </div>
                 
                 <Button type="submit" className="w-full mt-8 group text-lg py-4" disabled={loading}>
                   {loading ? "Authenticating..." : (isLogin ? "Sign In" : "Create Account")} 
                   {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                 </Button>
               </form>

               <div className="mt-10 text-center border-t border-slate-800 pt-8">
                 <p className="text-slate-400 font-medium">
                   {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                   <button 
                     onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                     }} 
                     className="text-white font-bold hover:text-lime-accent transition-colors"
                   >
                     {isLogin ? "Sign up" : "Sign in"}
                   </button>
                 </p>
               </div>
             </motion.div>
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
};
