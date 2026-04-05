import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { calculateBMI, getBMIHistory } from "../services/api";
import { Calculator, Zap, Activity, Info } from "lucide-react";

export const BMICalculator = () => {
  const [formData, setFormData] = useState({ age: "", gender: "Male", height: "", weight: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getBMIHistory();
        if (history && history.bmi && history.bmi.length > 0) {
          setResult({ bmi: history.bmi[history.bmi.length - 1] });
        }
      } catch (err) {
      }
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await calculateBMI(
        Number(formData.age), 
        formData.gender, 
        Number(formData.height), 
        Number(formData.weight)
      );
      setResult(res); 
    } catch (err) {
      setError(err.response?.data?.message || "Error calculating BMI");
    } finally {
      setLoading(false);
    }
  };

  const renderInsights = (text) => {
    if (!text) return <p className="text-slate-400">No intelligent insights generated for this combination.</p>;
    
    const lines = text.split('\n').filter(line => {
      const lower = line.toLowerCase();
      // Exclude workflow-specific lines that belong in the Workout Planner page
      if (lower.includes("workout") || lower.includes("training") || lower.includes("exercise routine")) return false;
      return line.trim().length > 0;
    });
    
    return (
      <div className="space-y-3 mt-4">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[\*\-\.\d]+\s*/, '').replace(/\*\*/g, '').trim();
          if (!cleanLine) return null;
          
          const colonIdx = cleanLine.indexOf(':');
          
          if (colonIdx > -1 && colonIdx < 40) {
            const label = cleanLine.substring(0, colonIdx).trim();
            const value = cleanLine.substring(colonIdx + 1).trim();
            return (
              <div key={idx} className="bg-slate-900/60 p-4 rounded-sm border border-slate-700/50 flex gap-4 hover:border-lime-accent/50 transition-colors group shadow-sm inline-flex w-full items-start">
                 <div className="mt-0.5"><Zap className="h-4 w-4 text-lime-accent group-hover:scale-110 transition-transform" /></div>
                 <div className="w-full">
                    <span className="font-black text-white tracking-widest uppercase text-[10px] block mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
                    <span className="text-sm text-slate-300 font-medium leading-relaxed">{value}</span>
                 </div>
              </div>
            );
          }
          
          return (
            <div key={idx} className="bg-slate-900/30 p-4 rounded-sm border-l-2 border-lime-accent/30 text-sm text-slate-300 flex gap-3 items-start">
              <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{cleanLine}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const BMIGauge = ({ bmi }) => {
    const value = parseFloat(bmi);
    if (isNaN(value)) return null;

    const min = 13;
    const max = 40;
    const range = max - min;
    const clampedValue = Math.max(min, Math.min(max, value));
    
    // Calculate rotation angle matching the 180-degree spectrum
    const angle = ((clampedValue - min) / range) * 180;

    return (
      <div className="mt-8 mb-4 flex flex-col items-center relative">
        <div className="relative w-[300px] h-[150px] overflow-hidden drop-shadow-xl">
           {/* Conic Gradient Semi-Circle (thick stroke via masking background) */}
           <div 
              className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full"
              style={{
                background: `conic-gradient(from 270deg, 
                  #3b82f6 0deg 36.6deg, 
                  #b1de00 36.6deg 80deg, 
                  #eab308 80deg 113.3deg, 
                  #ef4444 113.3deg 180deg, 
                  transparent 180deg 360deg
                )`
              }}
           ></div>
           
           {/* Inner cutout to make it a thick donut */}
           <div className="absolute top-[35px] left-[35px] w-[230px] h-[230px] bg-slate-800 rounded-full shadow-inner border border-slate-700/30"></div>
           
           {/* Marker Needle */}
           <div 
             className="absolute bottom-0 left-1/2 w-1 h-[120px] origin-bottom transition-all duration-1000 ease-out z-20"
             style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}
           >
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[20px] border-l-transparent border-r-transparent border-b-white mx-auto -mt-2 drop-shadow-md"></div>
              <div className="w-1 h-[100px] bg-white mx-auto shadow-md"></div>
           </div>
           
           {/* Needle anchor pin */}
           <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full z-30 shadow-lg border-4 border-slate-800"></div>
        </div>

        {/* Legend */}
        <div className="flex justify-between w-[320px] text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">
          <span className="text-blue-400">Under</span>
          <span className="text-lime-accent">Normal</span>
          <span className="text-yellow-500">Over</span>
          <span className="text-red-500">Obese</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-lime-accent p-2 rounded-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]">
            <Calculator className="h-6 w-6 text-dark-slate" /> 
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">BMI Predictor</h2>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-900/30 text-red-400 text-sm font-bold border-l-4 border-red-500">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Age (Years)" 
              type="number" 
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required 
            />
            <div className="mb-4 w-full">
              <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">Gender</label>
              <select 
                className="input-minimal appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="Male" className="bg-slate-800 text-white">Male</option>
                <option value="Female" className="bg-slate-800 text-white">Female</option>
                <option value="Other" className="bg-slate-800 text-white">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Height (cm)" 
              type="number" 
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              required 
            />
            <Input 
              label="Weight (kg)" 
              type="number" 
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              required 
            />
          </div>
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Processing Algorithm..." : "Analyze Body Metrics"}
          </Button>
        </form>
      </Card>

      {result && result.bmi ? (
        <Card className="bg-slate-800 border-lime-accent/50 shadow-[0_0_30px_rgba(198,255,50,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent rounded-full blur-[80px] opacity-20 pointer-events-none z-0"></div>
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Calculated State</h2>
              <div className="text-6xl font-black text-white drop-shadow-md">
                {result.bmi.bmiValue}
              </div>
            </div>
            <div className="bg-lime-accent/20 border border-lime-accent/50 px-4 py-2 flex items-center gap-2 rounded-sm mt-3">
               <Activity className="h-4 w-4 text-lime-accent" />
               <span className="text-lime-accent font-black tracking-widest uppercase text-xs">V2 Analysis</span>
            </div>
          </div>
          
          {/* New Horizontal Gauge Graph */}
          <BMIGauge bmi={result.bmi.bmiValue} />
          
          <div className="border-t border-slate-700 pt-6 relative z-10 mt-6">
            <h3 className="font-black text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-accent inline-block animate-pulse"></span>
              AI Insight Engine
            </h3>
            
            {renderInsights(result.bmi.aiInsights)}
          </div>
        </Card>
      ) : (
        <div className="h-full min-h-[300px] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-8 text-center bg-slate-800/30 rounded-sm">
           <div className="w-16 h-16 bg-slate-800 flex items-center justify-center rounded-sm mb-6 border border-slate-700 shadow-inner">
             <span className="text-2xl font-black text-slate-500">?</span>
           </div>
           <p className="text-slate-400 font-medium max-w-sm">Input your physiological metrics to fire the AI engine and receive your custom body mass breakdown.</p>
        </div>
      )}
    </div>
  );
};
