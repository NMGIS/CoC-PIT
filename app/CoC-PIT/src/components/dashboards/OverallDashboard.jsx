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

// --- GENDER FIELDS (overall_homeless only) ---
const GENDER_FIELDS_OVERALL = [
  { field: "a0012", label: "Women" },
  { field: "a0013", label: "Men" },
  { field: "a0014", label: "Transgender" },
  { field: "a0015", label: "Gender Questioning" },
  { field: "a0016", label: "Culturally Specific Identity" },
  { field: "a0017", label: "Different Identity" },
  { field: "a0018", label: "Non-Binary" },
  { field: "a0019", label: "More Than One Gender" }
];

export default function OverallDashboard({
  year,
  state,
  currentCocnums,
  legacyCocnums
}) {
  // --- STATE ---
  const [populationGroup, setPopulationGroup] = useState("all");
  const [totalValue, setTotalValue] = useState(null);
  const [hasData, setHasData] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [genderData, setGenderData] = useState([]);

  useEffect(() => {
    async function fetchMetric() {
      setTotalValue(null);
      setHasData(null);
      setBreakdown([]);
      setExpanded(false);
      setGenderData([]);

      const { table, totalField } = populationConfig[populationGroup];

      // --- BUILD COCNUM UNION ONCE ---
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

      // --- TOTAL QUERY ---
      let query = supabase
        .from(table)
        .select(`cocnum, ${totalField}`)
        .eq("year", year);

      if (state && state !== "") {
        query = query.eq("state_name", state);
      }

      if (cocnums.length > 0) {
        query = query.in("cocnum", cocnums);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
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

      const total = data.reduce(
        (acc, row) => acc + (row[totalField] ?? 0),
        0
      );

      const grouped = data.reduce((acc, row) => {
        if (!row.cocnum) return acc;
        acc[row.cocnum] =
          (acc[row.cocnum] || 0) + (row[totalField] ?? 0);
        return acc;
      }, {});

      setHasData(true);
      setTotalValue(total);
      setBreakdown(
        Object.entries(grouped)
          .map(([cocnum, value]) => ({ cocnum, value }))
          .sort((a, b) => b.value - a.value)
      );

      // --- GENDER DISTRIBUTION (ONLY FOR ALL PEOPLE) ---
      if (populationGroup === "all") {
        const genderFields = GENDER_FIELDS_OVERALL.map(g => g.field).join(",");

        let genderQuery = supabase
          .from("overall_homeless")
          .select(genderFields)
          .eq("year", year);

        if (state && state !== "") {
          genderQuery = genderQuery.eq("state_name", state);
        }

        if (cocnums.length > 0) {
          genderQuery = genderQuery.in("cocnum", cocnums);
        }

        const { data: genderRows, error: genderError } = await genderQuery;

        if (!genderError && genderRows?.length) {
          const totals = {};
          GENDER_FIELDS_OVERALL.forEach(({ field }) => {
            totals[field] = 0;
          });

          genderRows.forEach(row => {
            GENDER_FIELDS_OVERALL.forEach(({ field }) => {
              totals[field] += row[field] ?? 0;
            });
          });

          const formatted = GENDER_FIELDS_OVERALL
            .map(({ field, label }) => ({
              label,
              value: totals[field],
              percent:
                total > 0
                  ? Math.round((totals[field] / total) * 100)
                  : 0
            }))
            .filter(d => d.value > 0 && d.percent > 0)
            .sort((a, b) => b.value - a.value);

          setGenderData(formatted);

        }
      }
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
      <PopulationGroupSelector
        value={populationGroup}
        onChange={setPopulationGroup}
      />

      {/* HEADER */}
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

        {hasData && <span>{expanded ? "▾" : "▸"}</span>}
      </div>

      {/* BREAKDOWN */}
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

      {/* GENDER CHART */}
      {populationGroup === "all" && genderData.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            maxWidth: "100%",
            overflow: "hidden"
          }}
        >

          <strong>Gender Distribution</strong>

          {genderData.map(row => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(90px, 140px) 1fr minmax(70px, 90px)",
                gap: "8px",
                alignItems: "center",
                marginTop: "6px",
                fontSize: "0.85rem"
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {row.label}
              </span>

              <div style={{ background: "#333", height: "10px", borderRadius: "4px" }}>
                <div
                  style={{
                    width: `${row.percent}%`,
                    height: "100%",
                    background: "#cbb98b",
                    borderRadius: "4px"
                  }}
                />
              </div>
              <span style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                {row.percent}% ({row.value.toLocaleString()})
              </span>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
