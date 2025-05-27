import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../LandingPage.css";
import farmImg from "../assets/farm.png";

export default function EquipmentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/equipment/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fade-in-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src={farmImg} alt="Farm" style={{ width: 120, marginBottom: "2vmin", animation: "pop-in 1s" }} />
      <form onSubmit={handleLogin} className="main-body" style={{ maxWidth: 400, margin: "0 auto", padding: "4vmin", background: "antiquewhite", borderRadius: 12, boxShadow: "0 2px 8px #0002" }}>
        <h2 className="heading" style={{ position: "static", fontSize: "4vmin", marginBottom: "2vmin" }}>Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ fontSize: "2.5vmin", margin: "1vmin 0", width: "100%", padding: "1vmin" }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ fontSize: "2.5vmin", margin: "1vmin 0", width: "100%", padding: "1vmin" }} />
        <button type="submit" className="but linkk animated-btn" style={{ width: "100%", fontSize: "3vmin", marginTop: "2vmin" }}>Login</button>
      </form>
    </div>
  );
} 