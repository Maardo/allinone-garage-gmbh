
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Customers from "./pages/Customers";
import LoanerCars from "./pages/LoanerCars";
import ServiceTypes from "./pages/ServiceTypes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { currentUser, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes - redirect to login if not authenticated */}
      <Route path="/overview" element={currentUser ? <Overview /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/calendar" element={currentUser ? <Calendar /> : <Navigate to="/login" />} />
      <Route path="/customers" element={currentUser ? <Customers /> : <Navigate to="/login" />} />
      <Route path="/loaner-cars" element={currentUser ? <LoanerCars /> : <Navigate to="/login" />} />
      <Route path="/service-types" element={currentUser ? <ServiceTypes /> : <Navigate to="/login" />} />
      <Route path="/settings" element={currentUser ? <Settings /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
