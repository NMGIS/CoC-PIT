import { useState } from "react";
import MapViewComponent from "./components/MapView";
import Layout from "./components/Layout";
import StateFilter from "./components/StateFilter";
import "./App.css";

export default function App() {
  // ---- FILTER STATES ----
  const [selectedState, setSelectedState] = useState("");

  // ---- RESET ALL FILTERS ----
  const handleReset = () => {
    setSelectedState("");
  };

  return (
    <Layout
      top={
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* RESET BUTTON */}
          <button
            onClick={handleReset}
            style={{
              padding: "6px 10px",
              background: "#444",
              color: "white",
              border: "1px solid #666",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>

          {/* STATE FILTER */}
          <StateFilter value={selectedState} onChange={setSelectedState} />
        </div>
      }
      left={<div style={{ color: "white" }}>Charts + Big Numbers</div>}
      map={<MapViewComponent selectedState={selectedState} />}
    />
  );
}
