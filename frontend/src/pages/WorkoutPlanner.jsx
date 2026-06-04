import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { generateWorkout, getWorkoutHistory } from "../services/api";
import { Dumbbell, Activity, Calendar, Target } from "lucide-react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

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
      <div className="bg-card/60 p-5 rounded-sm border border-border/50 mb-6 relative overflow-hidden flex flex-col md:flex-row gap-6">
        {/* Background effect */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-primary/10 blur-[50px] rounded-full pointer-events-none"></div>

        {/* Left Side: Weight Goal Visualizer */}
        <div className="flex-1 border-r border-border/50 pr-6 relative z-10 flex flex-col justify-center">
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2 mb-4">
            <Target className="h-3 w-3 text-emerald-primary" /> Base Trajectory
          </h3>

          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-xl font-black text-foreground">{currentWeight}<span className="text-xs text-muted-foreground ml-1">kg</span></div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Current</div>
            </div>

            <div className="flex-1 px-4 flex flex-col items-center">
              <div className="text-emerald-primary font-black text-xs mb-1">
                {isGain ? '+' : '-'}{weightDiff} kg
              </div>
              <div className="w-full h-1 bg-card rounded-full overflow-hidden relative">
                {/* Animated connecting line */}
                <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-emerald-primary/50 to-transparent flex">
                  <div className="w-1/2 h-full bg-emerald-primary animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-foreground">{targetWeight}<span className="text-xs text-muted-foreground ml-1">kg</span></div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Target</div>
            </div>
          </div>
        </div>

        {/* Right Side: Weekly Volume Graph */}
        <div className="flex-1 relative z-10">
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 flex items-center justify-between">
            <span>Weekly Volume</span>
            <span className="text-emerald-primary bg-emerald-primary/10 px-2 py-0.5 rounded-[2px]">{daysPerWeek}/7 Days</span>
          </h3>

          <div className="flex justify-between items-end h-16 gap-1.5">
            {weekDays.map((day, idx) => {
              // Randomize active bar heights slightly to look dynamic, dead days are low.
              const isRest = !activePattern[idx];
              const height = isRest ? 'h-3' : (['h-14', 'h-12', 'h-16', 'h-10'][idx % 4]);

              return (
                <div key={idx} className="flex flex-col items-center flex-1 gap-2 group">
                  <div className={`w-full ${height} rounded-sm transition-all duration-500 relative flex items-end justify-center pb-1 
                         ${isRest ? 'bg-card border border-border/50' : 'bg-gradient-to-t from-white to-emerald-primary/20 border border-emerald-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] group-hover:to-emerald-primary group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'}
                      `}>
                    {!isRest && <div className="w-1.5 h-1.5 bg-card rounded-full opacity-50 mb-1"></div>}
                  </div>
                  <span className={`text-[9px] font-black uppercase ${isRest ? 'text-slate-600' : 'text-muted-foreground'}`}>{day}</span>
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
          <div className="bg-emerald-primary p-2 rounded-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]">
            <Dumbbell className="h-6 w-6 text-foreground" />
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">AI Workout Engine</h2>
        </div>

        {error && <div className="mb-4 p-4 bg-red-900/30 text-red-400 text-sm font-bold border-l-4 border-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Gender</label>
              <select className="input-minimal appearance-none" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                <option value="Male" className="bg-card text-foreground">Male</option>
                <option value="Female" className="bg-card text-foreground">Female</option>
                <option value="Other" className="bg-card text-foreground">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Fitness Level</label>
              <select className="input-minimal appearance-none" value={formData.fitnessLevel} onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })} required>
                <option value="Beginner" className="bg-card text-foreground">Beginner</option>
                <option value="Intermediate" className="bg-card text-foreground">Intermediate</option>
                <option value="Advanced" className="bg-card text-foreground">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Current Weight (kg)" type="number" value={formData.currentWeight} onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })} required />
            <Input label="Target Weight (kg)" type="number" value={formData.targetWeight} onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })} required />
          </div>
          <Input label="Primary Goal (e.g., Lose Fat, Build Muscle)" type="text" value={formData.primaryGoal} onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Days / Week</label>
              <select className="input-minimal appearance-none" value={formData.daysPerWeek} onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })} required>
                {[1, 2, 3, 4, 5, 6, 7].map(num => <option key={num} value={num} className="bg-card text-foreground">{num}</option>)}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Environment</label>
              <select className="input-minimal appearance-none" value={formData.workoutType} onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })} required>
                <option value="Gym" className="bg-card text-foreground">Gym</option>
                <option value="Home" className="bg-card text-foreground">Home</option>
                <option value="Yoga" className="bg-card text-foreground">Yoga</option>
                <option value="Cardio" className="bg-card text-foreground">Cardio</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Compiling Training Matrix..." : "Generate AI Plan"}
          </Button>
        </form>
      </Card>

      {result && result.aiWorkoutPlan ? (
        <Card className="bg-card border-emerald-primary/50 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-primary rounded-full blur-[80px] opacity-20 pointer-events-none z-0"></div>

          <div className="flex justify-between items-start mb-6 relative z-10 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold text-emerald-text flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-primary" />
                Active Routine
              </h2>
              <p className="text-muted-foreground text-sm mt-1">{result.primaryGoal}</p>
            </div>
            <div className="bg-emerald-primary/20 border border-emerald-primary/50 px-3 py-1 flex items-center gap-2 rounded-sm">
              <Activity className="h-3 w-3 text-emerald-primary" />
              <span className="text-emerald-primary font-black tracking-widest uppercase text-[10px]">Loaded</span>
            </div>
          </div>

          <WorkoutAnalyticsGraph
            daysPerWeek={result.daysPerWeek}
            currentWeight={result.currentWeight}
            targetWeight={result.targetWeight}
            goal={result.primaryGoal}
          />

          <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar pr-2 pb-4 mt-6">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Compiled Routine Details</h3>
            <div className="bg-card border border-border shadow-sm rounded-xl p-6">
              <MarkdownRenderer content={result.aiWorkoutPlan} />
            </div>
          </div>
        </Card>
      ) : (
        <div className="h-full min-h-[500px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center bg-card/30 rounded-sm">
          <div className="w-16 h-16 bg-card flex items-center justify-center rounded-sm mb-6 border border-border shadow-inner">
            <span className="text-2xl font-black text-muted-foreground"><Dumbbell className="h-6 w-6" /></span>
          </div>
          <p className="text-muted-foreground font-medium max-w-sm">Log your physiological metrics and fitness goals to construct your adaptive matrix regimen.</p>
        </div>
      )}
    </div>
  );
};
