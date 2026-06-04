import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { BMICalculator } from "./pages/BMICalculator";
import { WorkoutPlanner } from "./pages/WorkoutPlanner";
import { SleepTracker } from "./pages/SleepTracker";
import { Auth } from "./pages/Auth";
import { About } from "./pages/About";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { NutritionTracker } from "./pages/NutritionTracker";
import { DietPlanner } from "./pages/DietPlanner";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-emerald-primary font-black text-2xl animate-pulse">Initializing Data...</div>;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-emerald-primary font-black text-2xl animate-pulse">System Check...</div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Standard Unrestricted Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Public Routes (Only visible when logged out) */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            
            {/* Protected Routes (Only visible when logged in) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bmi" element={<ProtectedRoute><BMICalculator /></ProtectedRoute>} />
            <Route path="/workout" element={<ProtectedRoute><WorkoutPlanner /></ProtectedRoute>} />
            <Route path="/sleep" element={<ProtectedRoute><SleepTracker /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><NutritionTracker /></ProtectedRoute>} />
            <Route path="/diet" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
