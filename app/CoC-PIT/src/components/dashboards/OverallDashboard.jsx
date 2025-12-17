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
  const [breakdown, setBreakdown] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchMetric() {
      setTotalA0003(null);
      setHasData(null);
      setBreakdown([]);
      setExpanded(false);

      let query = supabase
        .from("overall_homeless")
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

      // --- NO DATA CASES ---
      if (!data || data.length === 0) {
        setHasData(false);
        setTotalA0003(null);
        return;
      }

      const nonNullValues = data
        .map(row => row.a0003)
        .filter(v => v !== null && v !== undefined);

      if (nonNullValues.length === 0) {
        setHasData(false);
        setTotalA0003(null);
        return;
      }

      // --- TOTAL ---
      const sum = data.reduce((acc, row) => acc + (row.a0003 ?? 0), 0);

      // --- BREAKDOWN BY COCNUM ---
      const grouped = data.reduce((acc, row) => {
        if (!row.cocnum) return acc;
        acc[row.cocnum] = (acc[row.cocnum] || 0) + (row.a0003 ?? 0);
        return acc;
      }, {});

      const breakdownArr = Object.entries(grouped)
        .map(([cocnum, value]) => ({ cocnum, value }))
        .sort((a, b) => b.value - a.value);

      setHasData(true);
      setTotalA0003(sum);
      setBreakdown(breakdownArr);
    }

    fetchMetric();
  }, [year, state, currentCocnums, legacyCocnums]);

  return (
    <div style={{ color: "white" }}>
      {/* HEADER ROW */}
      <div
        style={{
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: hasData ? "pointer" : "default"
        }}
        onClick={() => hasData && setExpanded(v => !v)}
      >
        <strong>Overall Homeless:</strong>

        {hasData === null
          ? "Loading…"
          : hasData === false
            ? "No data"
            : totalA0003.toLocaleString()}

        {hasData && (
          <span style={{ opacity: 0.7 }}>
            {expanded ? "▾" : "▸"}
          </span>
        )}
      </div>

      {/* EXPANDABLE BREAKDOWN */}
      {expanded && breakdown.length > 0 && (
        <div
          style={{
            marginTop: "0.5rem",
            background: "#2b2b2b",
            border: "1px solid #444",
            borderRadius: "4px",
            padding: "0.5rem",
            maxHeight: "200px",
            overflowY: "auto",
            fontSize: "0.9rem"
          }}
        >
          {breakdown.map(row => (
            <div
              key={row.cocnum}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                borderBottom: "1px solid #333"
              }}
            >
              <span>{row.cocnum}</span>
              <span>{row.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
