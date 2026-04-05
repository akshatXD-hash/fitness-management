import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { Dumbbell, Moon, Calculator, ArrowRight, User, Crosshair, Globe2, ShieldCheck, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { getBMIHistory, getWorkoutHistory, getSleepHistory } from "../services/api";

export const Dashboard = () => {
  const [synergyData, setSynergyData] = useState({ bmi: null, workout: null, sleep: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSynergy = async () => {
      try {
        const [bmiRes, workoutRes, sleepRes] = await Promise.all([
          getBMIHistory().catch(() => null),
          getWorkoutHistory().catch(() => null),
          getSleepHistory().catch(() => null)
        ]);

        setSynergyData({
          bmi: bmiRes?.bmi?.[bmiRes.bmi.length - 1] || null,
          workout: workoutRes?.workouts?.[0] || null,
          sleep: sleepRes?.sleepLogs?.[0] || null
        });
      } catch (err) { } finally {
        setLoading(false);
      }
    };
    fetchSynergy();
  }, []);

  const calculateVitalityScore = () => {
    let score = 0;
    
    // BMI Scoring (Normal = +30)
    if (synergyData.bmi) {
      const val = parseFloat(synergyData.bmi.bmiValue);
      if (val >= 18.5 && val <= 24.9) score += 30; 
      else score += 15; 
    }
    
    // Workout Scoring (Lots of Consistency = +35)
    if (synergyData.workout) {
      const days = parseInt(synergyData.workout.daysPerWeek) || 0;
      if (days >= 5) score += 35;
      else if (days >= 3) score += 25;
      else if (days >= 1) score += 10;
    }
    
    // Sleep Scoring (crucial for recovery = +35)
    if (synergyData.sleep) {
      const hrs = parseFloat(synergyData.sleep.amount) || 0;
      if (hrs >= 7) score += 35;
      else if (hrs >= 5) score += 20;
      else score += 5;
    }
    
    return score;
  };

  const score = calculateVitalityScore();
  const playerLevel = Math.max(1, Math.floor(score / 10)); // Max Level 10
  
  // Fake "Global Rank" mathematical mapping just to simulate the game feel
  let globalRankPct = 99; // If 0 score, you are bottom 1%
  if (score > 10) globalRankPct = Math.max(1, 100 - score + Math.floor(Math.random() * 5)); // e.g. Score 90 = Top ~10%

  const getRankData = (val) => {
    if (val >= 85) return { tier: "S-Tier", title: "Apex Predator", color: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/30" };
    if (val >= 60) return { tier: "A-Tier", title: "Elite Athlete", color: "text-lime-accent", bg: "bg-lime-accent", border: "border-lime-accent/30" };
    if (val >= 30) return { tier: "B-Tier", title: "Active Contender", color: "text-yellow-400", bg: "bg-yellow-400", border: "border-yellow-400/30" };
    return { tier: "C-Tier", title: "Rookie", color: "text-slate-400", bg: "bg-slate-400", border: "border-slate-700" };
  };
  const rank = getRankData(score);

  // UI Animation configs
  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVars} className="space-y-12">
      <div className="bg-dark-slate text-white p-8 md:p-12 rounded-sm relative overflow-hidden shadow-xl border-l-[6px] border-lime-accent">
        <div className="absolute right-0 top-0 w-64 h-64 bg-lime-accent rounded-full blur-[120px] opacity-10 transform translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
           
           <div className="lg:pr-10">
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Welcome Back.</h1>
             <p className="text-slate-400 font-medium text-lg mb-8">Ready to level up your biological hardware?</p>
             
             <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-sm border border-slate-700 shadow-inner w-max backdrop-blur-sm">
                <div className="bg-slate-900 p-3 rounded-full border border-slate-700/50">
                  <User className="h-6 w-6 text-slate-300" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Profile Status</p>
                  <p className="font-bold text-white uppercase flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse"></span> Online
                  </p>
                </div>
             </div>
           </div>

           {/* Central GAMER Player Card Widget */}
           {!loading && (
             <div className={`flex-1 w-full lg:min-w-[400px] border ${rank.border} rounded-sm p-1 bg-slate-800/50 backdrop-blur-md relative overflow-hidden group shadow-2xl`}>
                <div className="bg-slate-900 w-full h-full p-5 flex flex-col relative overflow-hidden">
                   
                   {/* Top Header */}
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                         <Gamepad2 className={`h-5 w-5 ${rank.color}`} />
                         <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Player Card</span>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 px-3 py-1 flex items-center gap-2 rounded shadow-inner">
                         <Globe2 className="w-3 h-3 text-slate-400"/>
                         <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">Global Rank: Top {globalRankPct}%</span>
                      </div>
                   </div>

                   {/* Title & Level */}
                   <div className="mb-6 border-l-4 border-slate-700 pl-4 py-1">
                      <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">Class: {rank.tier}</div>
                      <div className={`text-3xl font-black tracking-tighter uppercase ${rank.color}`}>
                        {rank.title}
                      </div>
                   </div>

                   {/* Main XP System */}
                   <div className="mb-6 bg-slate-800/50 p-3 rounded border border-slate-700 border-dashed">
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Crosshair className="w-3 h-3 text-lime-accent" /> Base XP
                         </span>
                         <span className="text-lg font-black text-white leading-none">Lvl {playerLevel}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative shadow-inner">
                         <div 
                           className={`h-full ${rank.bg} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
                           style={{ width: `${score}%` }}
                         ></div>
                      </div>
                      <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest text-right mt-1">
                         {score} / 100 Points to next Tier
                      </div>
                   </div>

                   {/* Mission Checklist */}
                   <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Daily Biological Missions</div>
                      
                      <Link to="/bmi" className={`flex justify-between items-center p-2 rounded transition-colors ${synergyData.bmi ? 'bg-slate-800 text-white border border-slate-700 hover:border-slate-500' : 'bg-slate-800/30 text-slate-500 hover:bg-slate-800'}`}>
                         <span className="text-xs font-bold flex items-center gap-2"><Calculator className="w-4 h-4"/> BMI Calibrated</span>
                         {synergyData.bmi ? <ShieldCheck className="w-4 h-4 text-lime-accent" /> : <div className="text-[10px] border border-slate-600 px-2 py-0.5 rounded">Incomplete</div>}
                      </Link>

                      <Link to="/workout" className={`flex justify-between items-center p-2 rounded transition-colors ${synergyData.workout ? 'bg-slate-800 text-white border border-slate-700 hover:border-slate-500' : 'bg-slate-800/30 text-slate-500 hover:bg-slate-800'}`}>
                         <span className="text-xs font-bold flex items-center gap-2"><Dumbbell className="w-4 h-4"/> Workout Generated</span>
                         {synergyData.workout ? <ShieldCheck className="w-4 h-4 text-lime-accent" /> : <div className="text-[10px] border border-slate-600 px-2 py-0.5 rounded">Incomplete</div>}
                      </Link>

                      <Link to="/sleep" className={`flex justify-between items-center p-2 rounded transition-colors ${synergyData.sleep ? 'bg-slate-800 text-white border border-slate-700 hover:border-slate-500' : 'bg-slate-800/30 text-slate-500 hover:bg-slate-800'}`}>
                         <span className="text-xs font-bold flex items-center gap-2"><Moon className="w-4 h-4"/> Recovery Logged</span>
                         {synergyData.sleep ? <ShieldCheck className="w-4 h-4 text-lime-accent" /> : <div className="text-[10px] border border-slate-600 px-2 py-0.5 rounded">Incomplete</div>}
                      </Link>
                   </div>
                   
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-20">
        <motion.div variants={itemVars}>
          <Card className="h-full flex flex-col hover:border-lime-accent hover:-translate-y-1 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-lime-accent p-3 rounded-sm shadow-[2px_2px_0_0_rgba(30,41,59,1)]">
                <Calculator className="h-6 w-6 text-dark-slate" /> 
              </div>
              {synergyData.bmi ? (
                 <span className="text-xs font-black uppercase tracking-widest text-lime-accent flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-pulse"></div> Active</span>
              ) : (
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500">Unlinked</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-3">BMI Status</h2>
            <p className="text-slate-400 mb-8 font-medium flex-grow">Track your body metrics and get AI insights based on your health profile.</p>
            <Link to="/bmi">
              <Button className="w-full group">
                 {synergyData.bmi ? "Update Scan" : "Calibrate"} <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div variants={itemVars}>
          <Card className="bg-slate-800 text-white h-full flex flex-col border-lime-accent/30 hover:border-lime-accent hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(198,255,50,0.1)] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white p-3 rounded-sm shadow-[2px_2px_0_0_rgba(198,255,50,1)]">
                <Dumbbell className="h-6 w-6 text-dark-slate" /> 
              </div>
              {synergyData.workout ? (
                 <span className="text-xs font-black uppercase tracking-widest text-lime-accent flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-pulse"></div> Active</span>
              ) : (
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500">Unlinked</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-3">AI Workout</h2>
            <p className="text-slate-400 mb-8 font-medium flex-grow">Generate personalized routines tailored to your specific fitness goals.</p>
            <Link to="/workout">
              <Button className="w-full bg-lime-accent text-dark-slate hover:bg-white group border-none shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
                 Plan Routine <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div variants={itemVars}>
           <Card className="h-full flex flex-col hover:border-lime-accent hover:-translate-y-1 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-slate-700 p-3 rounded-sm shadow-[2px_2px_0_0_rgba(30,41,59,1)]">
                <Moon className="h-6 w-6 text-white" /> 
              </div>
              {synergyData.sleep ? (
                 <span className="text-xs font-black uppercase tracking-widest text-lime-accent flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-pulse"></div> Active</span>
              ) : (
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500">Unlinked</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-3">Sleep Sync</h2>
            <p className="text-slate-400 mb-8 font-medium flex-grow">Log your rest periods and ensure maximum recovery for better performance.</p>
            <Link to="/sleep">
              <Button className="w-full group">
                 Log Sleep <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
