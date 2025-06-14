import {  Route, Routes } from "react-router-dom"
import LoginPage from "./pages/login-page"
import DashboardPage from "./pages/dashboard-page"
import ProtectedRoute from "./components/private-routes"
import "./animation.css"


function App() {

  return (
   <Routes>
    <Route path="/login" element={<LoginPage/>} />
    <Route element={<ProtectedRoute/>}>
     <Route path="/dashboard" element={<DashboardPage/>} />
    </Route>
   </Routes>
  )
}

export default App
