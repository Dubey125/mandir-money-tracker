import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PublicDashboard from "./pages/PublicDashboard";
import Donations from "./pages/Donations";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import { AppProvider } from "./context/AppContext";
import RecentDonations from "./pages/RecentDonations";
import MandirPoojan from "./pages/MandirPoojan";

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recent" element={<RecentDonations />} />
            <Route path="/poojan" element={<MandirPoojan />} />
            <Route path="/pd" element={<PublicDashboard />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AppProvider>
  );
}


