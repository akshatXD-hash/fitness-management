import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 border border-slate-700/50 rounded-sm p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-6">
          <div className="bg-lime-accent p-2 rounded-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]">
            <Activity className="h-8 w-8 text-dark-slate" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">About Fitness<span className="text-lime-accent">Core</span></h1>
        </div>

        <div className="prose prose-invert prose-slate max-w-none prose-headings:text-lime-accent prose-a:text-lime-accent hover:prose-a:text-white">
          <p className="text-lg leading-relaxed text-slate-300 font-medium mb-6">
            Welcome to FitnessCore, your personal AI-driven biometric analytics and performance engine. 
            We built this platform to decode the complexity of human physiology and make peak performance accessible to everyone.
          </p>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4">Our Mission</h2>
          <p className="text-slate-400 mb-6">
            We believe that generalized fitness advice is fundamentally flawed. Every body is an entirely unique ecosystem with dynamic constraints. 
            By leveraging advanced Large Language Models, we parse your raw biometric data—from Body Mass Index physics to sleep recovery cycles—to generate hyper-personalized, dynamically adapting protocols.
          </p>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4">Technology Architecture</h2>
          <p className="text-slate-400 mb-6">
            FitnessCore interfaces with state-of-the-art neural engines to synthesize your training data in real time. 
            We use zero-latency processing to restructure your data into actionable vectors. 
            Whether you are logging hours in the Sleep Tracker or drafting a 6-day split in the AI Workout Engine, our backend computes physiological recovery timelines instantly.
          </p>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4">Commitment to Data</h2>
          <p className="text-slate-400 mb-6">
            Your physiological data belongs to you. We strictly use your inputs locally per session to generate algorithms. 
            We maintain rigid encryption over your data and do not syndicate your proprietary biometric logs to third-party ad networks. 
            For more details, review our <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
