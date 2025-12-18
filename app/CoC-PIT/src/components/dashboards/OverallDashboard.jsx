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

// --- LABELS ---
const populationLabels = {
  all: "Overall Homeless",
  individuals: "Individuals Experiencing Homelessness",
  families: "People in Families Experiencing Homelessness",
  veterans: "Veterans Experiencing Homelessness",
  unaccompanied_youth: "Unaccompanied Youth Experiencing Homelessness",
  parenting_youth: "Parenting Youth Experiencing Homelessness"
};

// --- GENDER FIELDS ---
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

// --- AGE FIELDS (NO a0006) ---
const AGE_FIELDS_OVERALL = [
  { field: "a0004", label: "Under 18" },
  { field: "a0005", label: "Age 18–24" },
  { field: "a0007", label: "Age 25–34" },
  { field: "a0008", label: "Age 35–44" },
  { field: "a0009", label: "Age 45–54" },
  { field: "a0010", label: "Age 55–64" },
  { field: "a0011", label: "Over 64" }
];

// --- RACE FIELDS (OPTION A: MUTUALLY EXCLUSIVE) ---
const RACE_FIELDS_OVERALL = [
  { field: "a0021", label: "Hispanic / Latina/e/o (Any Race)" },
  { field: "a0040", label: "White (Non-Hispanic)" },
  { field: "a0034", label: "Black / African American (Non-Hispanic)" },
  { field: "a0032", label: "Asian (Non-Hispanic)" },
  { field: "a0030", label: "American Indian / Alaska Native (Non-Hispanic)" },
  { field: "a0038", label: "Native Hawaiian / Pacific Islander (Non-Hispanic)" },
  { field: "a0036", label: "Middle Eastern / North African (Non-Hispanic)" },
  { field: "a0042", label: "Multi-Racial (Non-Hispanic)" }
];

export default function OverallDashboard({
  year,
  state,
  currentCocnums,
  legacyCocnums
}) {
  const [populationGroup, setPopulationGroup] = useState("all");
  const [totalValue, setTotalValue] = useState(null);
  const [hasData, setHasData] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [raceData, setRaceData] = useState([]);

  useEffect(() => {
    async function fetchMetric() {
      setTotalValue(null);
      setHasData(null);
      setBreakdown([]);
      setExpanded(false);
      setGenderData([]);
      setAgeData([]);
      setRaceData([]);

      const { table, totalField } = populationConfig[populationGroup];

      // --- BUILD COCNUM UNION ---
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

      if (state) query = query.eq("state_name", state);
      if (cocnums.length) query = query.in("cocnum", cocnums);

      const { data, error } = await query;
      if (error || !data?.length) {
        setHasData(false);
        return;
      }

      const total = data.reduce(
        (acc, row) => acc + (row[totalField] ?? 0),
        0
      );

      // --- BUILD COC BREAKDOWN ---
      const grouped = data.reduce((acc, row) => {
        if (!row.cocnum) return acc;
        acc[row.cocnum] = (acc[row.cocnum] || 0) + (row[totalField] ?? 0);
        return acc;
      }, {});

      setBreakdown(
        Object.entries(grouped)
          .map(([cocnum, value]) => ({ cocnum, value }))
          .sort((a, b) => b.value - a.value)
      );

      setHasData(true);
      setTotalValue(total);

      // --- DISTRIBUTIONS (ALL PEOPLE ONLY) ---
      if (populationGroup === "all") {
        await buildDistribution(GENDER_FIELDS_OVERALL, total, setGenderData);
        await buildDistribution(AGE_FIELDS_OVERALL, total, setAgeData);
        await buildDistribution(RACE_FIELDS_OVERALL, total, setRaceData);
      }

      async function buildDistribution(fields, total, setter) {
        const selectFields = fields.map(f => f.field).join(",");

        let q = supabase
          .from("overall_homeless")
          .select(selectFields)
          .eq("year", year);

        if (state) q = q.eq("state_name", state);
        if (cocnums.length) q = q.in("cocnum", cocnums);

        const { data } = await q;
        if (!data?.length) return;

        const totals = {};
        fields.forEach(f => (totals[f.field] = 0));

        data.forEach(row => {
          fields.forEach(f => {
            totals[f.field] += row[f.field] ?? 0;
          });
        });

        setter(
          fields
            .map(f => ({
              label: f.label,
              value: totals[f.field],
              percent:
                total > 0
                  ? Math.round((totals[f.field] / total) * 100)
                  : 0
            }))
            .filter(d => d.value > 0 && d.percent > 0)
            .sort((a, b) => b.value - a.value)
        );
      }
    }

    fetchMetric();
  }, [year, state, currentCocnums, legacyCocnums, populationGroup]);

  const renderChart = (title, data) =>
    data.length > 0 && (
      <div style={{ marginTop: "1.25rem", maxWidth: "100%" }}>
        <strong>{title}</strong>
        {data.map(row => (
          <div
            key={row.label}
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(90px, 160px) 1fr minmax(90px, 110px)",
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
                textOverflow: "ellipsis",
                cursor: "help"
              }}
              title={row.label}
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
    );

  return (
    <div style={{ color: "white" }}>
      <PopulationGroupSelector
        value={populationGroup}
        onChange={setPopulationGroup}
      />

      {/* HEADER WITH EXPAND */}
      <div
        style={{
          fontSize: "1.2rem",
          marginTop: "0.5rem",
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

      {/* COC BREAKDOWN */}
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

      {/* DISTRIBUTIONS */}
      {populationGroup === "all" && (
        <>
          {renderChart("Gender Distribution", genderData)}
          {renderChart("Age Distribution", ageData)}
          {renderChart("Race / Ethnicity Distribution", raceData)}
        </>
      )}
    </div>
  );
}
