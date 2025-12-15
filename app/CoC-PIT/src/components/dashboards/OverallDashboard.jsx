import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function OverallDashboard({
  year,
  state,
  currentCocnums,
  legacyCocnums
}) {
  const [totalA0003, setTotalA0003] = useState(null);
  const [hasData, setHasData] = useState(null);

  useEffect(() => {
    async function fetchMetric() {
      setTotalA0003(null);
      setHasData(null);

      let query = supabase
        .from("overall_homeless")
        // include cocnum for debugging / sanity (optional but helpful)
        .select("cocnum, a0003")
        .eq("year", year);

      if (state && state !== "") {
        query = query.eq("state_name", state);
      }

      // --- BUILD COCNUM UNION (LEGACY + CURRENT) ---
      const cocnums = [];

      if (
        Array.isArray(legacyCocnums) &&
        legacyCocnums.length > 0 &&
        !legacyCocnums.includes("NONE")
      ) {
        cocnums.push(...legacyCocnums);
      }

      if (Array.isArray(currentCocnums) && currentCocnums.length > 0) {
        cocnums.push(...currentCocnums);
      }

      if (cocnums.length > 0) {
        query = query.in("cocnum", cocnums);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching overall homeless metric:", error);
        setHasData(false);
        setTotalA0003(null);
        return;
      }

      // 1) No rows returned at all → No data
      if (!data || data.length === 0) {
        setHasData(false);
        setTotalA0003(null);
        return;
      }

      // 2) Rows exist, but ALL a0003 values are NULL/undefined → No data
      const nonNullValues = data
        .map((row) => row.a0003)
        .filter((v) => v !== null && v !== undefined);

      if (nonNullValues.length === 0) {
        setHasData(false);
        setTotalA0003(null);
        return;
      }

      // 3) At least one non-null value exists → sum (NULLs count as 0)
      const sum = data.reduce((acc, row) => acc + (row.a0003 ?? 0), 0);

      setHasData(true);
      setTotalA0003(sum);
    }

    fetchMetric();
  }, [year, state, currentCocnums, legacyCocnums]);

  return (
    <div style={{ color: "white", fontSize: "1.2rem" }}>
      Overall Homeless:{" "}
      {hasData === null
        ? "Loading…"
        : hasData === false
          ? "No data"
          : totalA0003.toLocaleString()}
    </div>
  );
}
