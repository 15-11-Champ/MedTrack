// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("medicines")) || [];
    setMedicines(saved);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">My Medicines</h1>
      <Link to="/add" className="bg-blue-500 text-white px-3 py-1 rounded">+ Add Medicine</Link>
      <ul>
        {medicines.map((m, i) => (
          <li key={i} className="border p-2 my-2 rounded">
            {m.name} — Expiry: {m.expiryDate}
          </li>
        ))}
      </ul>
    </div>
  );
}
