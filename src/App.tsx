import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/home/HomePage";
import FeedbackCalander from "./pages/feedbackCalander/FeedbackCalander";
import ErrorPage from "./pages/error/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SleepOptimizer from "./pages/sleepOptimizer/sleepOptimizer";

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback-calander"
        element={
          <ProtectedRoute>
            <FeedbackCalander />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sleep-optimizer"
        element={
          <ProtectedRoute>
            <SleepOptimizer />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
