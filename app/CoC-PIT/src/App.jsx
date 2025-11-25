import { useEffect } from "react";
import PitMapView from "./components/MapView";
import Layout from "./components/Layout";
import { supabase } from "./supabaseClient";

export default function App() {

  return (
    <Layout
      top={<div style={{ color: "white" }}>Filters go here</div>}
      left={<div style={{ color: "white" }}>Charts + Big Numbers</div>}
      map={<PitMapView />}
    />
  );
}
