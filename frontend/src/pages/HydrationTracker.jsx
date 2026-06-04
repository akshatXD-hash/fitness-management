import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Droplets, Plus, Minus, Trophy, Target, Activity } from 'lucide-react';

export const HydrationTracker = () => {
  const [waterAmount, setWaterAmount] = useState(0);
  const dailyGoal = 3000; // 3000ml = 3L
  
  // Confetti or celebration state
  const [celebrate, setCelebrate] = useState(false);

  // Load from local storage on mount (Mocking backend persistence)
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedData = localStorage.getItem('flexio_hydration');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.date === today) {
        setWaterAmount(parsed.amount);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem('flexio_hydration', JSON.stringify({
      date: today,
      amount: waterAmount
    }));

    if (waterAmount >= dailyGoal && waterAmount - 250 < dailyGoal) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }
  }, [waterAmount]);

  const addWater = (amount) => {
    setWaterAmount(prev => Math.min(prev + amount, dailyGoal * 1.5)); // Allow going 50% over goal
  };

  const removeWater = (amount) => {
    setWaterAmount(prev => Math.max(0, prev - amount));
  };

  const percentage = Math.min((waterAmount / dailyGoal) * 100, 100);
  const isGoalReached = waterAmount >= dailyGoal;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif text-primary mb-3 flex items-center justify-center gap-3">
          <Droplets size={36} className="text-blue-500" /> Hydration Tracker
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Log your daily water intake. Stay hydrated to improve muscle recovery, energy levels, and overall health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Column: Visual Liquid Tracker */}
        <div className="bg-card border border-border shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]">
          
          {/* Confetti overlay */}
          {celebrate && (
            <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [1, 1.5, 2], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
            </div>
          )}

          <div className="flex justify-between w-full max-w-[280px] mb-6">
            <div className="text-center">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Current</p>
              <p className="text-2xl font-black text-blue-500">{waterAmount} <span className="text-sm font-medium">ml</span></p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Goal</p>
              <p className="text-2xl font-black text-foreground">{dailyGoal} <span className="text-sm font-medium text-muted-foreground">ml</span></p>
            </div>
          </div>

          {/* The Glass / Bottle */}
          <div className="relative w-48 h-72 rounded-b-[40px] rounded-t-md border-[6px] border-border bg-background shadow-inner overflow-hidden mb-8 z-10 isolate">
            
            {/* Measurement Marks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-8 z-20 pointer-events-none opacity-30">
              <div className="w-4 h-0.5 bg-foreground"></div>
              <div className="w-2 h-0.5 bg-foreground"></div>
              <div className="w-4 h-0.5 bg-foreground"></div>
              <div className="w-2 h-0.5 bg-foreground"></div>
              <div className="w-4 h-0.5 bg-foreground"></div>
            </div>

            {/* The Liquid */}
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 ${isGoalReached ? 'bg-blue-400' : 'bg-blue-500'} origin-bottom`}
              initial={{ height: "0%" }}
              animate={{ height: `${percentage}%` }}
              transition={{ type: "spring", bounce: 0.3, duration: 1.5 }}
              style={{
                boxShadow: "inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -20px 30px rgba(0,0,0,0.1)"
              }}
            >
              {/* Fake animated wave top */}
              <motion.div 
                animate={{ x: ["-25%", "0%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-[-10px] left-0 w-[200%] h-5 bg-blue-400/50 rounded-[50%] blur-[2px]"
                style={{ borderRadius: '50% 50% 0 0' }}
              />
              <motion.div 
                animate={{ x: ["0%", "-25%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute top-[-5px] left-0 w-[200%] h-4 bg-white/20 rounded-[50%] blur-[1px]"
                style={{ borderRadius: '50% 50% 0 0' }}
              />
              
              {/* Bubbles */}
              {waterAmount > 0 && (
                <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
              )}
              {waterAmount > 500 && (
                <div className="absolute bottom-12 left-2/3 w-3 h-3 bg-white/30 rounded-full animate-[bounce_2s_infinite]"></div>
              )}
              {waterAmount > 1500 && (
                <div className="absolute bottom-24 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-[bounce_1.5s_infinite]"></div>
              )}
            </motion.div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => addWater(250)}
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 w-24 h-24 transition-colors shadow-sm group"
            >
              <Plus size={24} className="mb-1 group-hover:scale-125 transition-transform" />
              <span className="font-bold">250ml</span>
              <span className="text-[10px] opacity-70">Glass</span>
            </button>
            <button 
              onClick={() => addWater(500)}
              className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-4 w-24 h-24 transition-colors shadow-md shadow-blue-500/20 group"
            >
              <Plus size={24} className="mb-1 group-hover:scale-125 transition-transform" />
              <span className="font-bold">500ml</span>
              <span className="text-[10px] opacity-80">Bottle</span>
            </button>
            <button 
              onClick={() => removeWater(250)}
              disabled={waterAmount === 0}
              className="flex flex-col items-center justify-center bg-background border border-border text-muted-foreground hover:bg-muted rounded-2xl p-4 w-16 h-24 transition-colors disabled:opacity-50"
            >
              <Minus size={20} />
              <span className="text-xs mt-1 font-medium">Undo</span>
            </button>
          </div>
        </div>

        {/* Right Column: Stats and Insights */}
        <div className="space-y-6">
          
          <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-yellow-500" /> Daily Progress
            </h3>
            
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-bold text-muted-foreground">Hydration Status</span>
              <span className="font-black text-blue-500">{Math.round(percentage)}%</span>
            </div>
            
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
              <motion.div 
                className={`h-full ${isGoalReached ? 'bg-gradient-to-r from-blue-400 to-green-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            {isGoalReached ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex gap-3 items-start">
                <Target className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-bold">Awesome job! You've hit your daily hydration target. Your muscles and brain thank you!</p>
              </div>
            ) : (
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex gap-3 items-start">
                <Activity className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">You need <strong>{dailyGoal - waterAmount}ml</strong> more to reach your goal. Drink up!</p>
              </div>
            )}
          </div>

          <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
             <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Hydration Facts</h3>
             <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-foreground">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0 font-black">1</div>
                  <p>Drinking water boosts your metabolic rate by up to 30% for about an hour.</p>
                </li>
                <li className="flex gap-3 text-sm text-foreground">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0 font-black">2</div>
                  <p>Even mild dehydration (1-3% of body weight) can impair energy levels, mood, and brain function.</p>
                </li>
                <li className="flex gap-3 text-sm text-foreground">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0 font-black">3</div>
                  <p>Muscles are 79% water. Staying hydrated prevents cramps and improves athletic performance.</p>
                </li>
             </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
