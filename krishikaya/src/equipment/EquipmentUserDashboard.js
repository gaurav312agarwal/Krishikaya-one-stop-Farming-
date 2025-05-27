import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, query, addDoc, serverTimestamp, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { rtdb } from "../firebase";
import { push, ref as rtdbRef } from "firebase/database";
import "../LandingPage.css";
import farmImg from "../assets/farm.png";

export default function EquipmentUserDashboard() {
  const [user, setUser] = useState(null);
  const [machines, setMachines] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
    const q = query(collection(db, "equipmentMachines"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setMachines(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [db, auth]);

  const handleAddMachine = async (e) => {
    e.preventDefault();
    if (!user) return;
    const machineData = {
      ownerId: user.uid,
      ownerEmail: user.email,
      description: desc,
      price,
      date,
      createdAt: Date.now(),
      isAvailable: true,
      bookedBy: null,
    };
    await addDoc(collection(db, "equipmentMachines"), {
      ...machineData,
      createdAt: serverTimestamp(),
    });
    // Also save to Realtime Database
    await push(rtdbRef(rtdb, "equipmentMachines"), machineData);
    setShowAdd(false);
    setDesc(""); setPrice(""); setDate("");
  };

  const handleBook = async (machineId) => {
    if (!user) return;
    const machineRef = doc(db, "equipmentMachines", machineId);
    await updateDoc(machineRef, {
      isAvailable: false,
      bookedBy: user.email,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/equipment";
  };

  return (
    <div className="main-body fade-in-bg" style={{ minHeight: "80vh", padding: "4vmin" }}>
      <img src={farmImg} alt="Farm" style={{ width: 120, margin: "0 auto 2vmin auto", display: "block", animation: "pop-in 1s" }} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2vmin" }}>
        <button className="but linkk animated-btn" style={{ fontSize: "2.5vmin", borderRadius: "8px", padding: "1vmin 3vmin" }} onClick={handleLogout}>Logout</button>
      </div>
      <h2 className="heading" style={{ position: "static", fontSize: "4vmin", marginBottom: "2vmin" }}>Welcome, {user?.email}</h2>
      <div style={{ display: "flex", gap: "4vmin", marginBottom: "4vmin" }}>
        <button className="but linkk animated-btn" style={{ padding: "2vmin 6vmin", fontSize: "3vmin", borderRadius: "8px" }} onClick={() => setShowAdd(true)}>Add Machine for Rent</button>
        <a href="#machine-list" className="but linkk animated-btn" style={{ padding: "2vmin 6vmin", fontSize: "3vmin", borderRadius: "8px" }}>Buy Machine</a>
      </div>
      {showAdd && (
        <form onSubmit={handleAddMachine} style={{ background: "#fffbe6", borderRadius: 10, padding: "3vmin", marginBottom: "4vmin", boxShadow: "0 2px 8px #0002", maxWidth: 400, animation: "fadeIn 0.7s" }}>
          <h3 style={{ fontSize: "3vmin", marginBottom: "2vmin" }}>Add Machine for Rent</h3>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" required style={{ width: "100%", fontSize: "2.5vmin", marginBottom: "1vmin" }} />
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" required style={{ width: "100%", fontSize: "2.5vmin", marginBottom: "1vmin" }} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: "100%", fontSize: "2.5vmin", marginBottom: "1vmin" }} />
          <button type="submit" className="but linkk animated-btn" style={{ width: "100%", fontSize: "2.5vmin" }}>Add</button>
        </form>
      )}
      <h2 id="machine-list" style={{ fontSize: "3.5vmin", margin: "3vmin 0 2vmin 0" }}>Available Machines</h2>
      <div className="features" style={{ flexWrap: "wrap", gap: "2vmin" }}>
        {machines.length === 0 && <p>No machines available.</p>}
        {machines.map(m => (
          <div key={m.id} className="f animated-card" style={{ width: "40vmin", minHeight: "20vmin", background: "beige", position: "relative" }}>
            <img src={farmImg} alt="Machine" style={{ width: 60, position: "absolute", top: 10, right: 10, opacity: 0.15, pointerEvents: "none" }} />
            <div className="con">
              <h3 style={{ fontSize: "2.5vmin" }}>Description</h3>
              <p>{m.description}</p>
              <h3 style={{ fontSize: "2.5vmin" }}>Price</h3>
              <p>₹{m.price}</p>
              <h3 style={{ fontSize: "2.5vmin" }}>Date</h3>
              <p>{m.date}</p>
              {m.isAvailable ? (
                <button className="but linkk animated-btn" style={{ width: "100%", fontSize: "2.5vmin", marginTop: "1vmin" }} onClick={() => handleBook(m.id)} disabled={user?.uid === m.ownerId}>Book/Buy</button>
              ) : (
                <button className="but linkk animated-btn" style={{ width: "100%", fontSize: "2.5vmin", marginTop: "1vmin", background: "#aaa", cursor: "not-allowed" }} disabled>Booked</button>
              )}
              {/* If current user is owner, show who booked */}
              {m.bookedBy && user?.uid === m.ownerId && (
                <div style={{ marginTop: "1vmin", color: "#333", fontSize: "2vmin" }}>
                  <b>Booked by:</b> {m.bookedBy}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 