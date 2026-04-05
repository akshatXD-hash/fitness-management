import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity, Dumbbell, Moon, Calculator, ArrowRight, BrainCircuit, ActivitySquare, ShieldCheck, Zap } from "lucide-react";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const Landing = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <div className="bg-dark-slate text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-lime-accent rounded-full blur-[200px] opacity-[0.15] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                 <span className="inline-block py-1 px-4 rounded-full bg-slate-800/80 backdrop-blur-sm border border-lime-accent/50 text-xs font-bold tracking-widest uppercase text-lime-accent mb-8 shadow-[0_0_20px_rgba(198,255,50,0.15)]">
                    <span className="text-white font-black mr-2 animate-pulse">●</span> V2.0 System Online
                 </span>
              </motion.div>
              <motion.h1 
                 initial="hidden" animate="visible" variants={fadeIn}
                 className="text-5xl md:text-[5.5rem] font-black text-white tracking-tighter leading-[1.05] mb-8"
              >
                Dominance through <br />
                <span className="text-lime-accent drop-shadow-[0_0_15px_rgba(198,255,50,0.3)]">Algorithm.</span>
              </motion.h1>
              <motion.p 
                 initial="hidden" animate="visible" variants={fadeIn}
                 className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl"
              >
                FitnessCore analyzes your personal biometrics, dynamically generates workout regimens, and tracks sleep recovery to push you to your absolute peak.
              </motion.p>
              
              <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col sm:flex-row gap-6">
                 <Link to="/auth" className="btn-primary text-xl !py-5 !px-10 hover:shadow-[0_0_30px_rgba(198,255,50,0.4)] transition-shadow">
                   Start your journey <ArrowRight className="ml-2 h-6 w-6" />
                 </Link>
              </motion.div>
            </div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, x: 50 }} 
               animate={{ opacity: 1, scale: 1, x: 0 }} 
               transition={{ duration: 1, delay: 0.2 }} 
               className="hidden lg:block relative group"
            >
               <div className="absolute inset-0 bg-lime-accent rounded-sm translate-x-6 translate-y-6 opacity-30 blur-2xl group-hover:opacity-50 group-hover:translate-x-8 group-hover:translate-y-8 transition-all duration-700"></div>
               <img src="/hero_fitness.png" alt="High performance athletes" className="relative z-10 w-full h-[650px] object-cover rounded-sm border-2 border-lime-accent/50 shadow-2xl filter contrast-125" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Logo Ticker */}
      <section className="py-12 border-b border-slate-800 bg-slate-900/50 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-slate to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-slate to-transparent z-10 pointer-events-none"></div>
        

        <div className="flex whitespace-nowrap animate-marquee items-center opacity-50 hover:opacity-100 transition-opacity duration-500 w-[200%]">
           {[...Array(2)].map((_, index) => (
             <div key={index} className="flex gap-24 mx-12 items-center flex-shrink-0">
                <span className="flex items-center gap-2 text-2xl font-black text-slate-400 group cursor-default"><BrainCircuit className="h-8 w-8 group-hover:text-lime-accent transition-colors" /> NEURAL-FIT</span>
                <span className="flex items-center gap-2 text-2xl font-black text-slate-400 group cursor-default"><ActivitySquare className="h-8 w-8 group-hover:text-lime-accent transition-colors" /> APEX HEALTH</span>
                <span className="flex items-center gap-2 text-2xl font-black text-slate-400 group cursor-default"><ShieldCheck className="h-8 w-8 group-hover:text-lime-accent transition-colors" /> RECOVERY.OS</span>
                <span className="flex items-center gap-2 text-2xl font-black text-slate-400 group cursor-default"><Zap className="h-8 w-8 group-hover:text-lime-accent transition-colors" /> VELOCITY</span>
                <span className="flex items-center gap-2 text-2xl font-black text-slate-400 group cursor-default"><Dumbbell className="h-8 w-8 group-hover:text-lime-accent transition-colors" /> KINETIC</span>
             </div>
           ))}
        </div>
      </section>

      {/* Heavy Image Break Section */}
      <section className="bg-lime-accent text-dark-slate flex flex-col lg:flex-row relative group">
        <div className="w-full lg:w-1/2 p-16 md:p-32 flex flex-col justify-center items-start z-10">
            <motion.h2 
               initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
               className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-8"
            >
              Data Driven<br /> <span className="text-white drop-shadow-md">Physiology</span>
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-xl font-bold max-w-lg mb-8 opacity-90">
               Stop guessing in the gym. Every set, rep, and core movement is calculated based off your structural capabilities and sleep patterns.
            </motion.p>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
               <a href="#workflow" className="underline font-bold text-lg hover:text-white transition-colors">See the workflow</a>
            </motion.div>
        </div>
        <div className="w-full lg:w-1/2 h-[500px] lg:h-auto overflow-hidden">
            <motion.img 
               whileHover={{ scale: 1.05 }}
               transition={{ duration: 1 }}
               src="/tech_gym.png" alt="Tech Gym AI" 
               className="w-full h-full object-cover filter contrast-150 grayscale mix-blend-multiply" 
            />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-32 bg-dark-slate relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-24">
             <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Execution Pipeline</motion.h2>
             <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-xl text-slate-400 font-medium">Three steps to physical dominance.</motion.p>
           </div>

           <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-lime-accent before:via-slate-700 before:to-transparent">
             
             {/* Step 1 */}
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border border-lime-accent bg-dark-slate text-lime-accent group-hover:bg-lime-accent group-hover:text-dark-slate shadow-[0_0_15px_rgba(198,255,50,0.5)] transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-black z-10">
                 1
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-sm border border-slate-700 bg-slate-800 shadow-xl group-hover:border-lime-accent transition-colors">
                 <div className="flex items-center gap-4 mb-4">
                   <Calculator className="h-6 w-6 text-lime-accent" />
                   <h3 className="font-black text-2xl">Intake & BMI Analysis</h3>
                 </div>
                 <p className="text-slate-400 font-medium">We ingest your body metrics to establish a heavy baseline. The algorithm calculates your exact physical starting point to prevent injury and maximize scaling.</p>
               </div>
             </motion.div>

             {/* Step 2 */}
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border border-lime-accent bg-dark-slate text-lime-accent group-hover:bg-lime-accent group-hover:text-dark-slate shadow-[0_0_15px_rgba(198,255,50,0.5)] transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-black z-10">
                 2
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-sm border border-slate-700 bg-slate-800 shadow-xl group-hover:border-lime-accent transition-colors">
                 <div className="flex items-center gap-4 mb-4">
                   <Dumbbell className="h-6 w-6 text-lime-accent" />
                   <h3 className="font-black text-2xl">Workout Generation</h3>
                 </div>
                 <p className="text-slate-400 font-medium">The system builds a hyper-targeted routine based on your goals (hypertrophy, endurance, strength), providing exact rep ranges and movement structures.</p>
               </div>
             </motion.div>

             {/* Step 3 */}
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border border-lime-accent bg-dark-slate text-lime-accent group-hover:bg-lime-accent group-hover:text-dark-slate shadow-[0_0_15px_rgba(198,255,50,0.5)] transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-black z-10">
                 3
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-sm border border-slate-700 bg-slate-800 shadow-xl group-hover:border-lime-accent transition-colors">
                 <div className="flex items-center gap-4 mb-4">
                   <Moon className="h-6 w-6 text-lime-accent" />
                   <h3 className="font-black text-2xl">Recovery Syncing</h3>
                 </div>
                 <p className="text-slate-400 font-medium">Growth happens when you sleep. By logging your sleep quality and mood, the AI adjusts tomorrow's intensity to prevent overtraining and burnout.</p>
               </div>
             </motion.div>

           </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-lime-accent/20 bg-slate-900/50" ref={targetRef}>
        <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="pt-8 md:pt-0">
                <div className="text-6xl md:text-8xl font-black text-lime-accent tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(198,255,50,0.3)]">2.4M</div>
                <div className="text-xl font-bold text-white uppercase tracking-widest">Workouts Generated</div>
              </div>
              <div className="pt-8 md:pt-0">
                <div className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">98%</div>
                <div className="text-xl font-bold text-slate-400 uppercase tracking-widest">Goal Completion</div>
              </div>
              <div className="pt-8 md:pt-0">
                <div className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">40k</div>
                <div className="text-xl font-bold text-slate-400 uppercase tracking-widest">Active Athletes</div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-dark-slate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-24">
             <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Core Platform Tools</motion.h2>
           </div>
           
           <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="grid grid-cols-1 md:grid-cols-3 gap-8"
           >
             <motion.div variants={fadeIn} className="bg-slate-800 p-10 border border-slate-700 shadow-sm hover:shadow-[0_0_30px_rgba(198,255,50,0.15)] hover:border-lime-accent hover:-translate-y-4 transition-all duration-500 relative overflow-hidden group rounded-sm">
                <div className="w-16 h-16 bg-lime-accent rounded-sm flex items-center justify-center mb-8 border-2 border-dark-slate group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                  <Calculator className="h-8 w-8 text-dark-slate" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">Precision BMI</h3>
                <p className="text-slate-400 leading-relaxed font-medium">Input your metrics to instantly receive algorithmic health insights regarding your current body mass index.</p>
             </motion.div>

             <motion.div variants={fadeIn} className="bg-lime-accent p-10 border border-lime-accent shadow-sm hover:shadow-[0_0_40px_rgba(198,255,50,0.4)] hover:-translate-y-4 transition-all duration-500 relative overflow-hidden group rounded-sm">
                <div className="w-16 h-16 bg-dark-slate rounded-sm flex items-center justify-center mb-8 shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="h-8 w-8 text-lime-accent" />
                </div>
                <h3 className="text-2xl font-bold text-dark-slate tracking-tight mb-4">AI Workouts</h3>
                <p className="text-dark-slate/80 font-bold leading-relaxed">Stop guessing. Let our AI generate the perfect daily regimen tailored to your exact goal and fitness level.</p>
             </motion.div>

             <motion.div variants={fadeIn} className="bg-slate-800 p-10 border border-slate-700 shadow-sm hover:shadow-[0_0_30px_rgba(198,255,50,0.15)] hover:border-lime-accent hover:-translate-y-4 transition-all duration-500 relative overflow-hidden group rounded-sm">
                <div className="w-16 h-16 bg-lime-accent rounded-sm flex items-center justify-center mb-8 border-2 border-dark-slate group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                  <Moon className="h-8 w-8 text-dark-slate" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">Sleep Recovery</h3>
                <p className="text-slate-400 leading-relaxed font-medium">Track your sleep quality and waking mood to unlock deep correlations between rest and subsequent workout performance.</p>
             </motion.div>
           </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-dark-slate relative overflow-hidden flex justify-center items-center">
         <div className="absolute inset-0 bg-lime-accent/5"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent rounded-full blur-[250px] opacity-[0.07]"></div>
         
         <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
         >
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">Ready to scale your <span className="text-lime-accent">body</span>?</h2>
            <Link to="/auth" className="bg-lime-accent text-dark-slate font-black text-xl py-6 px-12 border-2 border-transparent hover:bg-transparent hover:border-lime-accent hover:text-lime-accent transition-all duration-300 inline-flex items-center shadow-[0_0_40px_rgba(198,255,50,0.3)] hover:shadow-[0_0_60px_rgba(198,255,50,0.4)] hover:-translate-y-1">
              Initialize Account <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
         </motion.div>
      </section>
    </div>
  );
};
