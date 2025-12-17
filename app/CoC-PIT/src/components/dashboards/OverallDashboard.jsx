import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PopulationGroupSelector from "../PopulationGroupSelector";

/**
 * Population configuration:
 * - which table to query
 * - which field represents the TOTAL for that cohort
 */
const populationConfig = {
  all: {
    table: "overall_homeless",
    totalField: "a0003"
  },
  individuals: {
    table: "overall_homeless_individuals",
    totalField: "a0249"
  },
  families: {
    table: "overall_homeless_people_in_families",
    totalField: "a0495"
  },
  veterans: {
    table: "overall_homeless_veterans",
    totalField: "a0719"
  },
  unaccompanied_youth: {
    table: "overall_homeless_unaccompanied_youth_under_25",
    totalField: "a0917"
  },
  parenting_youth: {
    table: "overall_homeless_parenting_youth_under_25",
    totalField: "a1127"
  }
};

// --- LABELS FOR HEADER ---
const populationLabels = {
  all: "Overall Homeless",
  individuals: "Individuals Experiencing Homelessness",
  families: "People in Families Experiencing Homelessness",
  veterans: "Veterans Experiencing Homelessness",
  unaccompanied_youth: "Unaccompanied Youth Experiencing Homelessness",
  parenting_youth: "Parenting Youth Experiencing Homelessness"
};

export default function OverallDashboard({
  year,
  state,
  currentCocnums,
  legacyCocnums
}) {
  // --- POPULATION SELECTOR STATE ---
  const [populationGroup, setPopulationGroup] = useState("all");

  // --- METRIC STATE ---
  const [totalValue, setTotalValue] = useState(null);
  const [hasData, setHasData] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchMetric() {
      setTotalValue(null);
      setHasData(null);
      setBreakdown([]);
      setExpanded(false);

      const { table, totalField } = populationConfig[populationGroup];

      let query = supabase
        .from(table)
        .select(`cocnum, ${totalField}`)
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
        console.error("Error fetching homeless metric:", error);
        setHasData(false);
        return;
      }

      // --- NO DATA CASES ---
      if (!data || data.length === 0) {
        setHasData(false);
        return;
      }

      const nonNullValues = data
        .map(row => row[totalField])
        .filter(v => v !== null && v !== undefined);

      if (nonNullValues.length === 0) {
        setHasData(false);
        return;
      }

      // --- TOTAL ---
      const sum = data.reduce(
        (acc, row) => acc + (row[totalField] ?? 0),
        0
      );

      // --- BREAKDOWN BY COCNUM ---
      const grouped = data.reduce((acc, row) => {
        if (!row.cocnum) return acc;
        acc[row.cocnum] =
          (acc[row.cocnum] || 0) + (row[totalField] ?? 0);
        return acc;
      }, {});

      const breakdownArr = Object.entries(grouped)
        .map(([cocnum, value]) => ({ cocnum, value }))
        .sort((a, b) => b.value - a.value);

      setHasData(true);
      setTotalValue(sum);
      setBreakdown(breakdownArr);
    }

    fetchMetric();
  }, [
    year,
    state,
    currentCocnums,
    legacyCocnums,
    populationGroup
  ]);

  return (
    <div style={{ color: "white" }}>
      {/* POPULATION SELECTOR */}
      <PopulationGroupSelector
        value={populationGroup}
        onChange={setPopulationGroup}
      />

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
        <strong>{populationLabels[populationGroup]}:</strong>

        {hasData === null
          ? "Loading…"
          : hasData === false
          ? "No data"
          : totalValue.toLocaleString()}

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
