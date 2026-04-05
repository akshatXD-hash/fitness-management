import { Shield } from "lucide-react";

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 border border-slate-700/50 rounded-sm p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-6">
          <div className="bg-lime-accent p-2 rounded-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]">
            <Shield className="h-8 w-8 text-dark-slate" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert prose-slate max-w-none prose-headings:text-lime-accent text-slate-400">
          <p className="mb-6 font-bold text-white tracking-widest text-xs uppercase">Last Updated: April 5, 2026</p>
          
          <p className="mb-6">
            At FitnessCore, protecting your physiological data is our primary directive. Your metrics are highly personal, 
            and we treat your database footprint with absolute security. This policy outlines how we handle your biometrics.
          </p>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4 border-l-2 border-lime-accent pl-4">1. Data We Collect</h2>
          <p className="mb-4">
            We store necessary registration data (Name, Email) to establish your secure node. During active operations, we capture and encrypt variables such as:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Physical metrics (Age, Weight, Height)</li>
            <li>Sleep cycles and subjective mood tagging</li>
            <li>Workout frequency and fitness categorization</li>
          </ul>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4 border-l-2 border-lime-accent pl-4">2. AI Processing Transparency</h2>
          <p className="mb-6">
            To generate personalized recovery and training matrices, we temporarily process your physiological variables through our integrated Large Language Models (LLMs). 
            This transmission strips personally identifiable hooks (your name/email) during the handshake to guarantee anonymity. Your data is not stored by third-party cognitive engines for training purposes.
          </p>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4 border-l-2 border-lime-accent pl-4">3. Security Matrices</h2>
          <p className="mb-6">
            We deploy multiple tiers of security—including JSON Web Token (JWT) session persistence via encrypted httpOnly cookies—to prevent unauthorized node access.
            We strongly advise utilizing a secure passkey lock on your end to prevent localized endpoint exposure.
          </p>

          <h2 className="text-xl font-bold tracking-widest uppercase mt-8 mb-4 border-l-2 border-lime-accent pl-4">4. Deletion Rights</h2>
          <p className="mb-6">
            You hold total control over your matrix footprint. If you wish to wipe your historical health records from our cluster, please execute a deletion request via your local dashboard or contact our terminal operations team.
          </p>
        </div>
      </div>
    </div>
  );
};
