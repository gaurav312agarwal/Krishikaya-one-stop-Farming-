import "./App.css";
import LandingPage from "./LandingPage";
import WeatherForcast from "./Weather Forecast/WeatherForcast";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ChatBot from "./chatbot/ChatBot";
import EquipmentDashboard from "./equipment/EquipmentDashboard";
import EquipmentLogin from "./equipment/EquipmentLogin";
import EquipmentRegister from "./equipment/EquipmentRegister";
import EquipmentUserDashboard from "./equipment/EquipmentUserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/weatherforecast" element={<WeatherForcast />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/equipment" element={<EquipmentDashboard />} />
        <Route path="/equipment/login" element={<EquipmentLogin />} />
        <Route path="/equipment/register" element={<EquipmentRegister />} />
        <Route path="/equipment/dashboard" element={<EquipmentUserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
