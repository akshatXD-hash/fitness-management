import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { logSleep, getSleepHistory } from "../services/api";
import { Moon, Activity, CalendarClock } from "lucide-react";

export const SleepTracker = () => {
  const [formData, setFormData] = useState({
    amount: "",
    qualityLevel: "Good",
    wakingMood: "Neutral",
    text: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getSleepHistory();
        if (res && res.sleepLogs && res.sleepLogs.length > 0) {
          setHistory(res.sleepLogs);
        }
      } catch (err) {
        // Silently fail if no history
      }
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
        amount: Number(formData.amount)
      };
      const res = await logSleep(payload);
      // Backend returns { sleep: {...} }
      const newSleep = res.sleep || res;
      setHistory([newSleep, ...history]);
      
      // Reset form text but keep date updated to today
      setFormData(prev => ({ ...prev, amount: "", text: "", date: new Date().toISOString().split('T')[0] }));
    } catch (err) {
      setError(err.response?.data?.message || "Error logging sleep regimen");
    } finally {
      setLoading(false);
    }
  };

  // Determine latest sleep for AI insight display
  const latestSleep = history.length > 0 ? history[0] : null;

  const SleepHistoryChart = ({ logs }) => {
    if (!logs || logs.length === 0) return null;
    
    // Explicitly parse and sort logs purely by their raw Date object to guarantee mathematically ascending left-to-right order
    const sortedLogs = [...logs].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt).getTime();
        const dateB = new Date(b.date || b.createdAt).getTime();
        return dateA - dateB;
    });

    // Grab the 7 most recent chronological logs 
    const chartLogs = sortedLogs.slice(-7);
    
    // Baseline the UI to a minimum of 10 hours so poor sleep looks appropriately small
    const maxVal = Math.max(10, ...chartLogs.map(log => log.amount));
    
    return (
      <div className="bg-slate-900/60 p-6 rounded-sm border border-slate-700/50 mb-6 relative">
         <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex justify-between items-center mb-8">
            <span>Volume Log (Chronological)</span>
            <span className="text-lime-accent bg-lime-accent/10 px-2 py-0.5 rounded-[2px] shadow-sm">Last {chartLogs.length} Days</span>
         </h3>
         
         {/* Background Y-Axis scale framework */}
         <div className="absolute top-16 bottom-12 left-6 right-6 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-t border-slate-500 border-dashed w-full relative"><span className="absolute -left-6 -top-2 text-[8px]">10h</span></div>
            <div className="border-t border-slate-500 border-dashed w-full relative"><span className="absolute -left-4 -top-2 text-[8px]">5h</span></div>
            <div className="border-t border-slate-500 w-full"></div>
         </div>

         {/* Chart Activity Pillars */}
         <div className="h-32 flex items-end justify-between items-stretch gap-3 mx-4 relative z-10">
            {chartLogs.map((log, idx) => {
               const heightPct = Math.min((log.amount / maxVal) * 100, 100);
               
               let gradient = "from-red-600 to-red-400";
               if (log.amount >= 7) gradient = "from-lime-600 to-lime-accent";
               else if (log.amount >= 5) gradient = "from-yellow-600 to-yellow-400";

               const dateVal = log.date || log.createdAt;
               const label = dateVal ? new Date(dateVal).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }) : `Log ${idx+1}`;

               return (
                 <div key={idx} className="flex-1 flex flex-col items-center justify-end relative group">
                    {/* Hover Target Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-800 text-white text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded shadow-xl transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:-translate-y-1 border border-lime-accent/50 z-20 whitespace-nowrap pointer-events-none">
                       {log.amount} hrs
                    </div>
                    
                    {/* Dynamic Bar Pillar */}
                    <div 
                      className={`w-6 md:w-8 rounded-t-sm transition-all duration-700 ease-bounce bg-gradient-to-t ${gradient} relative shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-white/20`} 
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-t-sm"></div>
                    </div>
                    
                    {/* Date Tag */}
                    <span className="text-[10px] font-bold uppercase text-slate-500 mt-3 truncate max-w-full group-hover:text-slate-300 transition-colors">{label}</span>
                 </div>
               )
            })}
         </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-lime-accent p-2 rounded-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]">
            <Moon className="h-6 w-6 text-dark-slate" /> 
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Recovery Console</h2>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-900/30 text-red-400 text-sm font-bold border-l-4 border-red-500">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="w-full">
                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Date</label>
                <input 
                  type="date"
                  className="input-minimal appearance-none pb-2 h-[42px]"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required 
                />
             </div>
             <Input 
                label="Hours Slept" 
                type="number" 
                step="0.5"
                min="0"
                max="24"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required 
             />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Quality Level</label>
              <select className="input-minimal appearance-none" value={formData.qualityLevel} onChange={(e) => setFormData({...formData, qualityLevel: e.target.value})} required>
                <option value="Poor" className="bg-slate-800 text-white">Poor</option>
                <option value="Fair" className="bg-slate-800 text-white">Fair</option>
                <option value="Good" className="bg-slate-800 text-white">Good</option>
                <option value="Excellent" className="bg-slate-800 text-white">Excellent</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Waking Mood</label>
              <select className="input-minimal appearance-none" value={formData.wakingMood} onChange={(e) => setFormData({...formData, wakingMood: e.target.value})} required>
                <option value="Exhausted" className="bg-slate-800 text-white">Exhausted</option>
                <option value="Neutral" className="bg-slate-800 text-white">Neutral</option>
                <option value="Refreshed" className="bg-slate-800 text-white">Refreshed</option>
                <option value="Energetic" className="bg-slate-800 text-white">Energetic</option>
              </select>
            </div>
          </div>
          <div className="w-full mb-4">
             <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Notes (Optional)</label>
             <textarea 
                className="input-minimal min-h-[100px] resize-y placeholder:text-slate-600"
                placeholder="Disrupted by noise, deep vivid dreams, etc."
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
             />
          </div>
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Transmitting Log..." : "Log Recovery Data"}
          </Button>
        </form>
      </Card>

      {latestSleep ? (
        <Card className="bg-slate-800 border-lime-accent/50 shadow-[0_0_30px_rgba(198,255,50,0.05)] relative overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent rounded-full blur-[80px] opacity-20 pointer-events-none z-0"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10 border-b border-slate-700 pb-4">
            <div>
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <CalendarClock className="h-5 w-5 text-lime-accent" />
                 Sleep Analysis
               </h2>
               <p className="text-slate-400 text-sm mt-1">Latest Log: {latestSleep.date || latestSleep.createdAt ? new Date(latestSleep.date || latestSleep.createdAt).toLocaleDateString() : 'Active'}</p>
            </div>
            <div className="bg-lime-accent/20 border border-lime-accent/50 px-3 py-1 flex flex-col items-end rounded-sm">
               <div className="flex items-center gap-2">
                 <Activity className="h-3 w-3 text-lime-accent" />
                 <span className="text-lime-accent font-black tracking-widest uppercase text-[10px]">Volume</span>
               </div>
               <span className="text-white font-black text-lg mt-0.5">{latestSleep.amount}<span className="text-xs text-lime-accent ml-1">hrs</span></span>
            </div>
          </div>

          <SleepHistoryChart logs={history} />
          
          <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar pr-2 pb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-lime-accent rounded-full animate-pulse inline-block"></span>
              AI Diagnostics Engine
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 prose-headings:text-lime-accent marker:text-lime-accent prose-strong:text-white">
              <div 
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: latestSleep.aiInsights
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
             <span className="text-2xl font-black text-slate-500"><Moon className="h-6 w-6"/></span>
           </div>
           <p className="text-slate-400 font-medium max-w-sm">Log your sleep hours to generate long-term history charts and comprehensive neural AI recovery insights.</p>
        </div>
      )}
    </div>
  );
};
