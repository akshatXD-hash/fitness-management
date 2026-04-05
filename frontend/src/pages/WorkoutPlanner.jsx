import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { generateWorkout, getWorkoutHistory } from "../services/api";
import { Dumbbell, Activity, Calendar, Target } from "lucide-react";

export const WorkoutPlanner = () => {
  const [formData, setFormData] = useState({
    gender: "Male",
    currentWeight: "",
    targetWeight: "",
    fitnessLevel: "Beginner",
    primaryGoal: "",
    daysPerWeek: 3,
    workoutType: "Gym"
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getWorkoutHistory();
        if (history && history.workouts && history.workouts.length > 0) {
          setResult(history.workouts[0]); 
        }
      } catch (err) { }
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        currentWeight: Number(formData.currentWeight),
        targetWeight: Number(formData.targetWeight),
        daysPerWeek: Number(formData.daysPerWeek)
      };
      const res = await generateWorkout(payload);
      setResult(res.workout || res);
    } catch (err) {
      setError(err.response?.data?.message || "Error generating workout plan");
    } finally {
      setLoading(false);
    }
  };

  const WorkoutAnalyticsGraph = ({ daysPerWeek, currentWeight, targetWeight, goal }) => {
    // Distribute the days evenly across a 7-day week for the visualizer
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const activePattern = [];
    
    // Simple math to spread active days across the week
    const step = 7 / parseInt(daysPerWeek);
    for (let i = 0; i < 7; i++) {
        // if this index is closest to a step, make it active
        const isActive = Math.abs((i * (parseInt(daysPerWeek) / 7)) % 1) < (parseInt(daysPerWeek) / 7) || parseInt(daysPerWeek) === 7;
        activePattern.push(isActive);
    }

    const weightDiff = Math.abs(currentWeight - targetWeight);
    const isGain = targetWeight > currentWeight;
    
    return (
      <div className="bg-slate-900/60 p-5 rounded-sm border border-slate-700/50 mb-6 relative overflow-hidden flex flex-col md:flex-row gap-6">
         {/* Background effect */}
         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-lime-accent/10 blur-[50px] rounded-full pointer-events-none"></div>
         
         {/* Left Side: Weight Goal Visualizer */}
         <div className="flex-1 border-r border-slate-700/50 pr-6 relative z-10 flex flex-col justify-center">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2 mb-4">
              <Target className="h-3 w-3 text-lime-accent" /> Base Trajectory
            </h3>
            
            <div className="flex items-end justify-between mb-2">
               <div>
                  <div className="text-xl font-black text-white">{currentWeight}<span className="text-xs text-slate-400 ml-1">kg</span></div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Current</div>
               </div>

               <div className="flex-1 px-4 flex flex-col items-center">
                  <div className="text-lime-accent font-black text-xs mb-1">
                    {isGain ? '+' : '-'}{weightDiff} kg
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                     {/* Animated connecting line */}
                     <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-lime-accent/50 to-transparent flex">
                        <div className="w-1/2 h-full bg-lime-accent animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(198,255,50,0.8)]"></div>
                     </div>
                  </div>
               </div>

               <div className="text-right">
                  <div className="text-xl font-black text-white">{targetWeight}<span className="text-xs text-slate-400 ml-1">kg</span></div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Target</div>
               </div>
            </div>
         </div>

         {/* Right Side: Weekly Volume Graph */}
         <div className="flex-1 relative z-10">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center justify-between">
              <span>Weekly Volume</span>
              <span className="text-lime-accent bg-lime-accent/10 px-2 py-0.5 rounded-[2px]">{daysPerWeek}/7 Days</span>
            </h3>
            
            <div className="flex justify-between items-end h-16 gap-1.5">
               {weekDays.map((day, idx) => {
                 // Randomize active bar heights slightly to look dynamic, dead days are low.
                 const isRest = !activePattern[idx];
                 const height = isRest ? 'h-3' : (['h-14', 'h-12', 'h-16', 'h-10'][idx % 4]);
                 
                 return (
                   <div key={idx} className="flex flex-col items-center flex-1 gap-2 group">
                      <div className={`w-full ${height} rounded-sm transition-all duration-500 relative flex items-end justify-center pb-1 
                         ${isRest ? 'bg-slate-800 border border-slate-700/50' : 'bg-gradient-to-t from-dark-slate to-lime-accent/80 border border-lime-accent/30 shadow-[0_0_10px_rgba(198,255,50,0.1)] group-hover:to-lime-accent group-hover:shadow-[0_0_15px_rgba(198,255,50,0.3)]'}
                      `}>
                         {!isRest && <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50 mb-1"></div>}
                      </div>
                      <span className={`text-[9px] font-black uppercase ${isRest ? 'text-slate-600' : 'text-slate-300'}`}>{day}</span>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-lime-accent p-2 rounded-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]">
            <Dumbbell className="h-6 w-6 text-dark-slate" /> 
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">AI Workout Engine</h2>
        </div>
        
        {error && <div className="mb-4 p-4 bg-red-900/30 text-red-400 text-sm font-bold border-l-4 border-red-500">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Gender</label>
              <select className="input-minimal appearance-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required>
                <option value="Male" className="bg-slate-800 text-white">Male</option>
                <option value="Female" className="bg-slate-800 text-white">Female</option>
                <option value="Other" className="bg-slate-800 text-white">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Fitness Level</label>
              <select className="input-minimal appearance-none" value={formData.fitnessLevel} onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})} required>
                <option value="Beginner" className="bg-slate-800 text-white">Beginner</option>
                <option value="Intermediate" className="bg-slate-800 text-white">Intermediate</option>
                <option value="Advanced" className="bg-slate-800 text-white">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Current Weight (kg)" type="number" value={formData.currentWeight} onChange={(e) => setFormData({...formData, currentWeight: e.target.value})} required />
            <Input label="Target Weight (kg)" type="number" value={formData.targetWeight} onChange={(e) => setFormData({...formData, targetWeight: e.target.value})} required />
          </div>
          <Input label="Primary Goal (e.g., Lose Fat, Build Muscle)" type="text" value={formData.primaryGoal} onChange={(e) => setFormData({...formData, primaryGoal: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Days / Week</label>
              <select className="input-minimal appearance-none" value={formData.daysPerWeek} onChange={(e) => setFormData({...formData, daysPerWeek: e.target.value})} required>
                {[1,2,3,4,5,6,7].map(num => <option key={num} value={num} className="bg-slate-800 text-white">{num}</option>)}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Environment</label>
              <select className="input-minimal appearance-none" value={formData.workoutType} onChange={(e) => setFormData({...formData, workoutType: e.target.value})} required>
                <option value="Gym" className="bg-slate-800 text-white">Gym</option>
                <option value="Home" className="bg-slate-800 text-white">Home</option>
                <option value="Yoga" className="bg-slate-800 text-white">Yoga</option>
                <option value="Cardio" className="bg-slate-800 text-white">Cardio</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Compiling Training Matrix..." : "Generate AI Plan"}
          </Button>
        </form>
      </Card>

      {result && result.aiWorkoutPlan ? (
        <Card className="bg-slate-800 border-lime-accent/50 shadow-[0_0_30px_rgba(198,255,50,0.05)] relative overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent rounded-full blur-[80px] opacity-20 pointer-events-none z-0"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10 border-b border-slate-700 pb-4">
            <div>
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <Calendar className="h-5 w-5 text-lime-accent" />
                 Active Routine
               </h2>
               <p className="text-slate-400 text-sm mt-1">{result.primaryGoal}</p>
            </div>
            <div className="bg-lime-accent/20 border border-lime-accent/50 px-3 py-1 flex items-center gap-2 rounded-sm">
               <Activity className="h-3 w-3 text-lime-accent" />
               <span className="text-lime-accent font-black tracking-widest uppercase text-[10px]">Loaded</span>
            </div>
          </div>

          <WorkoutAnalyticsGraph 
            daysPerWeek={result.daysPerWeek} 
            currentWeight={result.currentWeight} 
            targetWeight={result.targetWeight} 
            goal={result.primaryGoal} 
          />
          
          <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar pr-2 pb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Command Terminal Sequence</h3>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 prose-headings:text-lime-accent marker:text-lime-accent prose-strong:text-white">
              <div 
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: result.aiWorkoutPlan
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white bg-slate-900/50 px-1 py-0.5 rounded-sm">$1</strong>')
                    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '<span class="mr-2 text-lg inline-block align-middle">$1</span>')
                    .replace(/\n\n/g, '<div class="my-5 border-b border-slate-700/30"></div>')
                }}
              />
            </div>
          </div>
        </Card>
      ) : (
        <div className="h-full min-h-[500px] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-8 text-center bg-slate-800/30 rounded-sm">
           <div className="w-16 h-16 bg-slate-800 flex items-center justify-center rounded-sm mb-6 border border-slate-700 shadow-inner">
             <span className="text-2xl font-black text-slate-500"><Dumbbell className="h-6 w-6"/></span>
           </div>
           <p className="text-slate-400 font-medium max-w-sm">Log your physiological metrics and fitness goals to construct your adaptive matrix regimen.</p>
        </div>
      )}
    </div>
  );
};
