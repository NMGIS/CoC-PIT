import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PopulationGroupSelector from "../PopulationGroupSelector";

const populationConfig = {
  all: {
    table: "sheltered_sh_homeless",
    totalField: "a0126" // Sheltered SH Homeless
  },
  veterans: {
    table: "sheltered_sh_homeless_veterans",
    totalField: "a0818" // Sheltered SH Homeless Veterans
  },
  unaccompanied_youth: {
    table: "sheltered_sh_homeless_unaccompanied_youth_under_25",
    totalField: "a1016" // Sheltered SH Homeless Unaccompanied Youth (Under 25)
  }
};

// --- LABELS (SHELTERED TOTAL) ---
const populationLabels = {
  all: "Sheltered SH Homeless (Total)",
  veterans: "Sheltered SH Homeless Veterans",
  unaccompanied_youth: "Sheltered SH Homeless Unaccompanied Youth (Under 25)"
};

//--Overall SH--//
// --- GENDER ---
const shOverallGender = [
  { label: "Woman", field: "a0135" },
  { label: "Man", field: "a0136" },
  { label: "Transgender", field: "a0137" },
  { label: "Gender Questioning", field: "a0138" },
  { label: "Culturally Specific Identity", field: "a0139" },
  { label: "Different Identity", field: "a0140" },
  { label: "Non-Binary", field: "a0141" },
  { label: "More Than One Gender", field: "a0142" }
];

// --- AGE ---
const shOverallAge = [
  { label: "Under 18", field: "a0127" },
  { label: "18–24", field: "a0128" },
  { label: "25–34", field: "a0130" },
  { label: "35–44", field: "a0131" },
  { label: "45–54", field: "a0132" },
  { label: "55–64", field: "a0133" },
  { label: "65+", field: "a0134" }
];

// --- ETHNICITY ---
const shOverallEthnicity = [
  { field: "a0144", label: "Hispanic / Latina/e/o" },
  { field: "a0143", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE (INCLUSIVE) ---
const shOverallRace = [
  { field: "a0153", label: "American Indian / Alaska Native" },
  { field: "a0155", label: "Asian" },
  { field: "a0157", label: "Black / African American" },
  { field: "a0159", label: "Middle Eastern / North African" },
  { field: "a0161", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0163", label: "White" },
  { field: "a0165", label: "Multi-Racial" },
  { field: "a0166", label: "Hispanic / Latina/e/o" }
];

// --- RACE × HISPANIC ---
const shOverallRaceHispanic = [
  { field: "a0152", label: "American Indian / Alaska Native" },
  { field: "a0154", label: "Asian" },
  { field: "a0156", label: "Black / African American" },
  { field: "a0158", label: "Middle Eastern / North African" },
  { field: "a0160", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0162", label: "White" },
  { field: "a0164", label: "Multi-Racial" }
];

// -- SH Veterans -- //
// --- GENDER ---
const shVeteranGender = [
  { label: "Woman", field: "a0819" },
  { label: "Man", field: "a0820" },
  { label: "Transgender", field: "a0821" },
  { label: "Gender Questioning", field: "a0822" },
  { label: "Culturally Specific Identity", field: "a0823" },
  { label: "Different Identity", field: "a0824" },
  { label: "Non-Binary", field: "a0825" },
  { label: "More Than One Gender", field: "a0826" }
];

// --- ETHNICITY ---
const shVeteranEthnicity = [
  { field: "a0828", label: "Hispanic / Latina/e/o" },
  { field: "a0827", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE (INCLUSIVE) ---
const shVeteranRace = [
  { field: "a0837", label: "American Indian / Alaska Native" },
  { field: "a0839", label: "Asian" },
  { field: "a0841", label: "Black / African American" },
  { field: "a0843", label: "Middle Eastern / North African" },
  { field: "a0845", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0847", label: "White" },
  { field: "a0849", label: "Multi-Racial" },
  { field: "a0850", label: "Hispanic / Latina/e/o" }
];

// --- RACE × HISPANIC ---
const shVeteranRaceHispanic = [
  { field: "a0836", label: "American Indian / Alaska Native" },
  { field: "a0838", label: "Asian" },
  { field: "a0840", label: "Black / African American" },
  { field: "a0842", label: "Middle Eastern / North African" },
  { field: "a0844", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0846", label: "White" },
  { field: "a0848", label: "Multi-Racial" }
];

// -- SH Unaccompanied Youth (Under 25) -- //
// --- GENDER ---
const shUnaccompaniedYouthGender = [
  { label: "Woman", field: "a1017" },
  { label: "Man", field: "a1018" },
  { label: "Transgender", field: "a1019" },
  { label: "Gender Questioning", field: "a1020" },
  { label: "Culturally Specific Identity", field: "a1021" },
  { label: "Different Identity", field: "a1022" },
  { label: "Non-Binary", field: "a1023" },
  { label: "More Than One Gender", field: "a1024" }
];

// --- ETHNICITY ---
const shUnaccompaniedYouthEthnicity = [
  { field: "a1026", label: "Hispanic / Latina/e/o" },
  { field: "a1025", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE (INCLUSIVE) ---
const shUnaccompaniedYouthRace = [
  { field: "a1035", label: "American Indian / Alaska Native" },
  { field: "a1037", label: "Asian" },
  { field: "a1039", label: "Black / African American" },
  { field: "a1041", label: "Middle Eastern / North African" },
  { field: "a1043", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a1045", label: "White" },
  { field: "a1047", label: "Multi-Racial" },
  { field: "a1048", label: "Hispanic / Latina/e/o" }
];

// --- RACE × HISPANIC ---
const shUnaccompaniedYouthRaceHispanic = [
  { field: "a1034", label: "American Indian / Alaska Native" },
  { field: "a1036", label: "Asian" },
  { field: "a1038", label: "Black / African American" },
  { field: "a1040", label: "Middle Eastern / North African" },
  { field: "a1042", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a1044", label: "White" },
  { field: "a1046", label: "Multi-Racial" }
];

export default function ShelteredSHDashboard({
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
  const [ethnicityData, setEthnicityData] = useState([]);
  const [hispanicRaceData, setHispanicRaceData] = useState([]);

  // --- GUARD: force valid SH population groups ---
  useEffect(() => {
    const allowed = ["all", "veterans", "unaccompanied_youth"];
    if (!allowed.includes(populationGroup)) {
      setPopulationGroup("all");
    }
  }, [populationGroup]);


  useEffect(() => {
    async function fetchMetric() {
      setTotalValue(null);
      setHasData(null);
      setBreakdown([]);
      setExpanded(false);
      setGenderData([]);
      setAgeData([]);
      setRaceData([]);
      setEthnicityData([]);
      setHispanicRaceData([]);


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

      // --- TOTAL QUERY (Hispanic / Latina/e/o totals) ---
      let query = supabase
        .from(table)
        .select(
          populationGroup === "all"
            ? `cocnum, ${totalField}, a0144`
            : populationGroup === "veterans"
              ? `cocnum, ${totalField}, a0828`
              : populationGroup === "unaccompanied_youth"
                ? `cocnum, ${totalField}, a1026`
                : `cocnum, ${totalField}`
        )
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

      const hispanicTotal =
        populationGroup === "veterans"
          ? data.reduce((sum, r) => sum + (r.a0828 || 0), 0)
          : populationGroup === "unaccompanied_youth"
            ? data.reduce((sum, r) => sum + (r.a1026 || 0), 0)
            : data.reduce((sum, r) => sum + (r.a0144 || 0), 0);


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

      // --- Overall Homeless DISTRIBUTIONS (ALL PEOPLE ONLY) ---
      if (populationGroup === "all") {
        await buildDistribution(shOverallEthnicity, total, setEthnicityData, table);
        await buildDistribution(shOverallGender, total, setGenderData, table);
        await buildDistribution(shOverallAge, total, setAgeData, table);
        await buildDistribution(shOverallRace, total, setRaceData, table);
        await buildDistribution(
          shOverallRaceHispanic,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Veterans distribution -- //
      if (populationGroup === "veterans") {
        await buildDistribution(
          shVeteranEthnicity,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          shVeteranGender,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          shVeteranRace,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          shVeteranRaceHispanic,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Unaccompanied Youth distribution -- //
      if (populationGroup === "unaccompanied_youth") {
        await buildDistribution(
          shUnaccompaniedYouthEthnicity,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          shUnaccompaniedYouthGender,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          shUnaccompaniedYouthRace,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          shUnaccompaniedYouthRaceHispanic,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }


      async function buildDistribution(fields, total, setter, tableName) {
        if (!tableName) return; // optional guard


        const selectFields = fields.map(f => f.field).join(",");

        let q = supabase
          .from(tableName)
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
              percent: total > 0
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

  const renderChart = (title, data, subtitle) =>
    data.length > 0 && (
      <div style={{ marginTop: "1.25rem", maxWidth: "100%" }}>
        <strong>{title}</strong>
        {subtitle && (
          <div style={{ fontSize: "0.8rem", opacity: 0.85, marginTop: "4px" }}>
            {subtitle}
          </div>
        )}
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
        allowedGroups={[
          "all",
          "veterans",
          "unaccompanied_youth"
        ]}
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
          {renderChart("Ethnicity (Exclusive)", ethnicityData)}
          {renderChart("Race (One Race Only)", raceData,
            "People who reported exactly one race or Hispanic / Latina / e / o identity only."
          )}
          {renderChart(
            "Race × Ethnicity (Hispanic Subset)",
            hispanicRaceData,
            "Subset of the Hispanic / Latina / e / o population, broken down by race."
          )}
        </>
      )}

      {populationGroup === "veterans" && (
        <>
          {renderChart("Gender Distribution", genderData)}
          {renderChart("Ethnicity (Exclusive)", ethnicityData)}
          {renderChart(
            "Race (One Race Only)",
            raceData,
            "People who reported exactly one race or Hispanic / Latina / e / o identity only."
          )}
          {renderChart(
            "Race × Ethnicity (Hispanic Subset)",
            hispanicRaceData,
            "Subset of the Hispanic / Latina / e / o population, broken down by race."
          )}
        </>
      )}

      {populationGroup === "unaccompanied_youth" && (
        <>
          {renderChart("Gender Distribution", genderData)}
          {renderChart("Ethnicity (Exclusive)", ethnicityData)}
          {renderChart(
            "Race (One Race Only)",
            raceData,
            "People who reported exactly one race or Hispanic / Latina / e / o identity only."
          )}
          {renderChart(
            "Race × Ethnicity (Hispanic Subset)",
            hispanicRaceData,
            "Subset of the Hispanic / Latina / e / o population, broken down by race."
          )}
        </>
      )}

    </div>
  );
}
