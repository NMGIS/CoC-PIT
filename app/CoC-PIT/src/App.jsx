import { useState } from "react";
import MapViewComponent from "./components/MapView";
import Layout from "./components/Layout";
import StateFilter from "./components/Filters.jsx";

export default function App() {
  const [selectedState, setSelectedState] = useState("");

  return (
    <Layout
      top={
        <>
          <StateFilter 
            value={selectedState}
            onChange={setSelectedState}
          />
        </>
      }
      left={<div style={{ color: "white" }}>Charts + Big Numbers</div>}
      map={<MapViewComponent selectedState={selectedState} />}
    />
  );
}
