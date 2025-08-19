import React, { useEffect, useMemo, useState } from "react";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Safely load from localStorage and normalize to an array
function safeLoadMedicines() {
  try {
    const raw = localStorage.getItem("medicines");
    if (!raw) return [];
    const data = JSON.parse(raw);

    // If it's already an array, good.
    if (Array.isArray(data)) return data;

    // If it's an object from older code like { medicines: [...] }
    if (data && Array.isArray(data.medicines)) return data.medicines;

    // Anything else -> treat as empty (prevents .map errors)
    return [];
  } catch {
    return [];
  }
}

export default function AddMedicine() {
  const [medicines, setMedicines] = useState(() => safeLoadMedicines());
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Keep localStorage in sync; always store an array
  useEffect(() => {
    localStorage.setItem("medicines", JSON.stringify(medicines));
  }, [medicines]);

  const years = useMemo(() => {
    const start = new Date().getFullYear();
    return Array.from({ length: 15 }, (_, i) => start + i);
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !month || !year) {
      alert("Please fill name, month, and year");
      return;
    }

    const shortYear = String(year).slice(-2); // 2024 -> 24
    const expiry = `EXP.${month}.${shortYear}`;
    //checking
    const newMed = {
      id: Date.now(),
      name: name.trim(),
      expiry,
    };

    setMedicines((prev) => [...prev, newMed]);
    setName("");
    setMonth("");
    setYear("");
  };

  const clearBrokenStorage = () => {
    // One-click fix if localStorage ever gets corrupted
    localStorage.removeItem("medicines");
    setMedicines([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <a href="/">{`<Home`}</a>
      <h2>Add Medicine</h2>

      <p>Enter medicine details below:</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Medicine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={handleAdd}>Add</button>
        <button type="button" onClick={clearBrokenStorage}>Reset List (fix)</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Saved Medicines</h3>
      {Array.isArray(medicines) && medicines.length > 0 ? (
        <ul>
          {medicines.map((m) => (
            <li key={m.id}>
              {m.name} — {m.expiry}
            </li>
          ))}
        </ul>
      ) : (
        <p>No medicines yet.</p>
      )}
    </div>
  );
}
