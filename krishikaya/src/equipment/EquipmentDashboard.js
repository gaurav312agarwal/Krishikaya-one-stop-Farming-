import React from "react";
import { Link } from "react-router-dom";
import "../LandingPage.css";
import farmImg from "../assets/farm.png";

export default function EquipmentDashboard() {
  return (
    <div className="main-body fade-in-bg" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src={farmImg} alt="Farm" style={{ width: 160, marginBottom: "2vmin", animation: "pop-in 1s" }} />
      <h1 className="heading" style={{ position: "static", fontSize: "6vmin", marginBottom: "4vmin" }}>Equipment Dashboard</h1>
      <div style={{ display: "flex", gap: "4vmin" }}>
        <Link to="/equipment/login" className="but linkk animated-btn">Login</Link>
        <Link to="/equipment/register" className="but linkk animated-btn">Register</Link>
      </div>
    </div>
  );
} 