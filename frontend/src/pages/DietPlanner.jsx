import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Leaf, Flame, Coffee, Utensils, Moon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const DietPlanner = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    goal: 'muscle_gain',
    dietType: 'high_protein',
    calories: 2500
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setPlan(null);
    
    // Simulate API call to AI or backend to generate a personalized diet plan
    setTimeout(() => {
      setIsGenerating(false);
      generateMockPlan(formData);
    }, 1500);
  };

  const generateMockPlan = (data) => {
    // A simple mock generator based on user input to make it feel realistic
    let pRatio, cRatio, fRatio;
    
    if (data.dietType === 'keto') { pRatio = 0.25; cRatio = 0.05; fRatio = 0.70; }
    else if (data.dietType === 'high_protein') { pRatio = 0.40; cRatio = 0.35; fRatio = 0.25; }
    else { pRatio = 0.30; cRatio = 0.45; fRatio = 0.25; } // balanced/veg/vegan

    const totalCals = data.calories;
    const totalP = (totalCals * pRatio) / 4;
    const totalC = (totalCals * cRatio) / 4;
    const totalF = (totalCals * fRatio) / 9;

    setPlan({
      summary: {
        calories: totalCals,
        protein: Math.round(totalP),
        carbs: Math.round(totalC),
        fat: Math.round(totalF),
        type: data.dietType.replace('_', ' ').toUpperCase(),
        goal: data.goal.replace('_', ' ').toUpperCase()
      },
      meals: [
        {
          name: 'Breakfast',
          icon: <Coffee size={24} className="text-amber-500" />,
          time: '08:00 AM',
          food: data.dietType === 'vegan' ? 'Tofu Scramble with Spinach & Avocado Toast' : '3 Whole Eggs, 2 Egg Whites, Oatmeal with Berries',
          cals: Math.round(totalCals * 0.25),
          p: Math.round(totalP * 0.25),
          c: Math.round(totalC * 0.30),
          f: Math.round(totalF * 0.20)
        },
        {
          name: 'Lunch',
          icon: <Utensils size={24} className="text-orange-500" />,
          time: '01:00 PM',
          food: data.dietType === 'vegan' ? 'Quinoa Bowl with Roasted Chickpeas & Tahini' : 'Grilled Chicken Breast, Sweet Potato, Steamed Broccoli',
          cals: Math.round(totalCals * 0.35),
          p: Math.round(totalP * 0.35),
          c: Math.round(totalC * 0.35),
          f: Math.round(totalF * 0.35)
        },
        {
          name: 'Pre-Workout Snack',
          icon: <Flame size={24} className="text-red-500" />,
          time: '04:30 PM',
          food: data.dietType === 'keto' ? 'Handful of Almonds and Macadamia Nuts' : 'Greek Yogurt with Honey & Banana',
          cals: Math.round(totalCals * 0.15),
          p: Math.round(totalP * 0.10),
          c: Math.round(totalC * 0.25),
          f: Math.round(totalF * 0.10)
        },
        {
          name: 'Dinner',
          icon: <Moon size={24} className="text-indigo-500" />,
          time: '08:00 PM',
          food: data.dietType === 'vegetarian' || data.dietType === 'vegan' ? 'Lentil Pasta with Marinara & Plant-based Meatballs' : 'Baked Salmon, Quinoa, Asparagus',
          cals: Math.round(totalCals * 0.25),
          p: Math.round(totalP * 0.30),
          c: Math.round(totalC * 0.10),
          f: Math.round(totalF * 0.35)
        }
      ]
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif text-primary mb-3 flex items-center justify-center gap-3">
          <Leaf size={36} /> Smart Diet Planner
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate a personalized daily meal plan tailored to your body goals, dietary preferences, and calorie targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Target size={20} className="text-primary"/> Plan Generator
          </h3>
          
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Primary Goal</label>
              <select 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              >
                <option value="weight_loss">Weight Loss (Cut)</option>
                <option value="maintenance">Maintenance</option>
                <option value="muscle_gain">Muscle Gain (Bulk)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Dietary Preference</label>
              <select 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.dietType}
                onChange={(e) => setFormData({...formData, dietType: e.target.value})}
              >
                <option value="balanced">Standard Balanced</option>
                <option value="high_protein">High Protein</option>
                <option value="keto">Ketogenic (Low Carb)</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan / Plant-Based</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 flex justify-between">
                <span>Daily Calorie Target</span>
                <span className="text-primary">{formData.calories} kcal</span>
              </label>
              <input 
                type="range" 
                min="1200" max="4000" step="50"
                className="w-full accent-primary"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1200</span>
                <span>2500</span>
                <span>4000</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isGenerating ? 'Curating Plan...' : 'Generate My Plan'}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Plan */}
        <div className="lg:col-span-8">
          
          {!plan && !isGenerating && (
            <div className="h-full bg-card/50 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Plan Generated Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Configure your goals and preferences on the left, and we will construct a personalized daily meal blueprint for you.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="h-full bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <h3 className="text-xl font-bold text-foreground mb-2 animate-pulse">Designing your custom diet...</h3>
              <p className="text-muted-foreground">Calculating precise macros and selecting the best ingredients.</p>
            </div>
          )}

          <AnimatePresence>
            {plan && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Macro Summary Header */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{plan.summary.type} Plan</h2>
                      <p className="text-primary font-medium">Goal: {plan.summary.goal}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xl flex items-center gap-2">
                      <Flame size={20} /> {plan.summary.calories} kcal
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-background rounded-xl p-4 border border-border text-center">
                      <span className="text-sm font-bold text-muted-foreground block mb-1 uppercase tracking-wider">Protein</span>
                      <span className="text-2xl font-black text-foreground">{plan.summary.protein}g</span>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border text-center">
                      <span className="text-sm font-bold text-muted-foreground block mb-1 uppercase tracking-wider">Carbs</span>
                      <span className="text-2xl font-black text-foreground">{plan.summary.carbs}g</span>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border text-center">
                      <span className="text-sm font-bold text-muted-foreground block mb-1 uppercase tracking-wider">Fat</span>
                      <span className="text-2xl font-black text-foreground">{plan.summary.fat}g</span>
                    </div>
                  </div>
                </div>

                {/* Meals List */}
                <div className="space-y-4">
                  {plan.meals.map((meal, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center"
                    >
                      <div className="bg-background p-4 rounded-full border border-border">
                        {meal.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-lg font-bold text-foreground">{meal.name}</h4>
                          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">{meal.time}</span>
                        </div>
                        <p className="text-foreground font-medium mb-3">{meal.food}</p>
                        
                        <div className="flex flex-wrap gap-3 text-xs font-bold">
                          <span className="text-primary bg-primary/10 px-2 py-1 rounded-md flex items-center gap-1">
                            <Flame size={12}/> {meal.cals} kcal
                          </span>
                          <span className="text-muted-foreground bg-background border border-border px-2 py-1 rounded-md">
                            P: {meal.p}g
                          </span>
                          <span className="text-muted-foreground bg-background border border-border px-2 py-1 rounded-md">
                            C: {meal.c}g
                          </span>
                          <span className="text-muted-foreground bg-background border border-border px-2 py-1 rounded-md">
                            F: {meal.f}g
                          </span>
                        </div>
                      </div>
                      
                      <button className="hidden md:flex w-10 h-10 rounded-full border border-border items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors">
                        <CheckCircle2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button className="bg-foreground text-background px-6 py-3 rounded-xl font-bold shadow-md hover:bg-foreground/90 transition-colors">
                    Save to My Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
