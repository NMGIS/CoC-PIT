import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function OverallDashboard({ year, state, currentCocnums, legacyCocnums }) {
  const [totalA0003, setTotalA0003] = useState(null);

  useEffect(() => {
    async function fetchMetric() {
      let query = supabase
        .from("overall_homeless")
        .select("a0003")
        .eq("year", year);

      // --- FILTER BY STATE ---
      if (state && state !== "") {
        query = query.eq("state_name", state);  // <-- confirm your column name
      }

      // --- FILTER BY COCNUM (LEGACY > CURRENT) ---
      // --- FILTER BY COCNUM (LEGACY + CURRENT UNION) ---
      const cocnums = [];

      // Legacy (ignore NONE)
      if (
        legacyCocnums &&
        legacyCocnums.length > 0 &&
        !legacyCocnums.includes("NONE")
      ) {
        cocnums.push(...legacyCocnums);
      }

      // Current
      if (currentCocnums && currentCocnums.length > 0) {
        cocnums.push(...currentCocnums);
      }

      if (cocnums.length > 0) {
        query = query.in("cocnum", cocnums);
      }



      const { data, error } = await query;
      if (error) {
        console.error("Error fetching a0003:", error);
        return;
      }

      const sum = data.reduce((acc, row) => acc + (row.a0003 || 0), 0);
      setTotalA0003(sum);
    }

    console.log("OverallDashboard filters:", {
      year,
      state,
      currentCocnums,
      legacyCocnums
    });


    fetchMetric();
  }, [year, state, currentCocnums, legacyCocnums]);

  return (
    <div style={{ color: "white", fontSize: "1.2rem" }}>
      Overall Homeless:{" "}
      {totalA0003 === null ? "Loading…" : totalA0003.toLocaleString()}
    </div>
  );
}
