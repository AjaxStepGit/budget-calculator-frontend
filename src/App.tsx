import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/login-page";
import DashboardPage from "./pages/dashboard-page";
import ProtectedRoute from "./components/private-routes";
import "./animation.css";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  return !!token && !!username;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
