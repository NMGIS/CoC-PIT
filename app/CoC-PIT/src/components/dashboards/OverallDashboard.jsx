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
// --- OVERALL HOMELESS GROUP---
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

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const ETHNICITY_FIELDS = [
  { field: "a0021", label: "Hispanic / Latina/e/o" },
  { field: "a0020", label: "Non-Hispanic / Latina/e/o" }
];

// Chart 2 — RACE (Only)
const RACE_ONLY_FIELDS_OVERALL = [
  { field: "a0030", label: "American Indian / Alaska Native" },
  { field: "a0032", label: "Asian" },
  { field: "a0034", label: "Black or African American" },
  { field: "a0036", label: "Middle Eastern or North African" },
  { field: "a0038", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0040", label: "White" },
  { field: "a0042", label: "Multi-Racial" },
  { field: "a0043", label: "Hispanic / Latina / e / o Only" }
];


// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS = [
  { field: "a0029", label: "American Indian / Alaska Native" },
  { field: "a0031", label: "Asian" },
  { field: "a0033", label: "Black" },
  { field: "a0035", label: "Middle Eastern or North African" },
  { field: "a0037", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0039", label: "White" },
  { field: "a0041", label: "Multi-Racial" }
];

// --- Overall Homeless Idividuals Group -- //
// --- GENDER FIELDS ---
const GENDER_FIELDS_INDIVIDUALS = [
  { field: "a0258", label: "Women" },
  { field: "a0259", label: "Men" },
  { field: "a0260", label: "Transgender" },
  { field: "a0261", label: "Gender Questioning" },
  { field: "a0262", label: "Culturally Specific Identity" },
  { field: "a0263", label: "Different Identity" },
  { field: "a0264", label: "Non-Binary" },
  { field: "a0265", label: "More Than One Gender" }
];

// --- AGE FIELDS (NO a0006) ---
const AGE_FIELDS_INDIVIDUALS = [
  { field: "a0250", label: "Under 18" },
  { field: "a0251", label: "Age 18–24" },
  { field: "a0253", label: "Age 25–34" },
  { field: "a0254", label: "Age 35–44" },
  { field: "a0255", label: "Age 45–54" },
  { field: "a0256", label: "Age 55–64" },
  { field: "a0257", label: "Over 64" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE) — INDIVIDUALS
const ETHNICITY_FIELDS_INDIVIDUALS = [
  { field: "a0267", label: "Hispanic / Latina/e/o" },
  { field: "a0266", label: "Non-Hispanic / Latina/e/o" }
];

// Chart 2 — SINGLE REPORTED IDENTITY (INDIVIDUALS)
const RACE_ONLY_FIELDS_INDIVIDUALS = [
  { field: "a0276", label: "American Indian / Alaska Native" },
  { field: "a0278", label: "Asian" },
  { field: "a0280", label: "Black or African American" },
  { field: "a0282", label: "Middle Eastern or North African" },
  { field: "a0284", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0286", label: "White" },
  { field: "a0288", label: "Multi-Racial" },
  { field: "a0289", label: "Hispanic / Latina / e / o Only" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET) — INDIVIDUALS
const HISPANIC_RACE_FIELDS_INDIVIDUALS = [
  { field: "a0275", label: "American Indian / Alaska Native" },
  { field: "a0277", label: "Asian" },
  { field: "a0279", label: "Black" },
  { field: "a0281", label: "Middle Eastern or North African" },
  { field: "a0283", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0285", label: "White" },
  { field: "a0287", label: "Multi-Racial" }
];

// --- PEOPLE IN FAMILIES --- //
// --- GENDER FIELDS //
const GENDER_FIELDS_FAMILIES = [
  { field: "a0504", label: "Women" },
  { field: "a0505", label: "Men" },
  { field: "a0506", label: "Transgender" },
  { field: "a0507", label: "Gender Questioning" },
  { field: "a0508", label: "Culturally Specific Identity" },
  { field: "a0509", label: "Different Identity" },
  { field: "a0510", label: "Non-Binary" },
  { field: "a0511", label: "More Than One Gender" }
];

// --- AGE FIELDS — PEOPLE IN FAMILIES (NO a0498) ---
const AGE_FIELDS_FAMILIES = [
  { field: "a0496", label: "Under 18" },
  { field: "a0497", label: "Age 18–24" },
  { field: "a0499", label: "Age 25–34" },
  { field: "a0500", label: "Age 35–44" },
  { field: "a0501", label: "Age 45–54" },
  { field: "a0502", label: "Age 55–64" },
  { field: "a0503", label: "Over 64" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE) — PEOPLE IN FAMILIES
const ETHNICITY_FIELDS_FAMILIES = [
  { field: "a0513", label: "Hispanic / Latina/e/o" },
  { field: "a0512", label: "Non-Hispanic / Latina/e/o" }
];

// Chart 2 — SINGLE REPORTED IDENTITY — PEOPLE IN FAMILIES
const RACE_ONLY_FIELDS_FAMILIES = [
  { field: "a0522", label: "American Indian / Alaska Native" },
  { field: "a0524", label: "Asian" },
  { field: "a0526", label: "Black or African American" },
  { field: "a0528", label: "Middle Eastern or North African" },
  { field: "a0530", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0532", label: "White" },
  { field: "a0534", label: "Multi-Racial" },
  { field: "a0535", label: "Hispanic / Latina / e / o Only" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET) — PEOPLE IN FAMILIES
const HISPANIC_RACE_FIELDS_FAMILIES = [
  { field: "a0521", label: "American Indian / Alaska Native" },
  { field: "a0523", label: "Asian" },
  { field: "a0525", label: "Black" },
  { field: "a0527", label: "Middle Eastern or North African" },
  { field: "a0529", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0531", label: "White" },
  { field: "a0533", label: "Multi-Racial" }
];

// --- Veterans --- //
// --- GENDER FIELDS — VETERANS ---
const GENDER_FIELDS_VETERANS = [
  { field: "a0720", label: "Women" },
  { field: "a0721", label: "Men" },
  { field: "a0722", label: "Transgender" },
  { field: "a0723", label: "Gender Questioning" },
  { field: "a0724", label: "Culturally Specific Identity" },
  { field: "a0725", label: "Different Identity" },
  { field: "a0726", label: "Non-Binary" },
  { field: "a0727", label: "More Than One Gender" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE) — VETERANS
const ETHNICITY_FIELDS_VETERANS = [
  { field: "a0729", label: "Hispanic / Latina/e/o" },
  { field: "a0728", label: "Non-Hispanic / Latina/e/o" }
];

// Chart 2 — SINGLE REPORTED IDENTITY — VETERANS
const RACE_ONLY_FIELDS_VETERANS = [
  { field: "a0738", label: "American Indian / Alaska Native" },
  { field: "a0740", label: "Asian" },
  { field: "a0742", label: "Black or African American" },
  { field: "a0744", label: "Middle Eastern or North African" },
  { field: "a0746", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0748", label: "White" },
  { field: "a0750", label: "Multi-Racial" },
  { field: "a0751", label: "Hispanic / Latina / e / o Only" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET) — VETERANS
const HISPANIC_RACE_FIELDS_VETERANS = [
  { field: "a0737", label: "American Indian / Alaska Native" },
  { field: "a0739", label: "Asian" },
  { field: "a0741", label: "Black or African American" },
  { field: "a0743", label: "Middle Eastern or North African" },
  { field: "a0745", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0747", label: "White" },
  { field: "a0749", label: "Multi-Racial" }
];

// -- Unaccompanied Youth Overall -- //
// --- GENDER FIELDS — UNACCOMPANIED YOUTH (UNDER 25) ---
const GENDER_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a0918", label: "Women" },
  { field: "a0919", label: "Men" },
  { field: "a0920", label: "Transgender" },
  { field: "a0921", label: "Gender Questioning" },
  { field: "a0922", label: "Culturally Specific Identity" },
  { field: "a0923", label: "Different Identity" },
  { field: "a0924", label: "Non-Binary" },
  { field: "a0925", label: "More Than One Gender" }
];

// Chart 1 — ETHNICITY (EXCLUSIVE) — UNACCOMPANIED YOUTH (UNDER 25)
const ETHNICITY_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a0927", label: "Hispanic / Latina/e/o" },
  { field: "a0926", label: "Non-Hispanic / Latina/e/o" }
];

// Chart 2 — SINGLE REPORTED IDENTITY — UNACCOMPANIED YOUTH (UNDER 25)
const RACE_ONLY_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a0936", label: "American Indian / Alaska Native" },
  { field: "a0938", label: "Asian" },
  { field: "a0940", label: "Black or African American" },
  { field: "a0942", label: "Middle Eastern or North African" },
  { field: "a0944", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0946", label: "White" },
  { field: "a0948", label: "Multi-Racial" },
  { field: "a0949", label: "Hispanic / Latina / e / o Only" }
];

// UNACCOMPANIED YOUTH (UNDER 25)
const HISPANIC_RACE_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a0935", label: "American Indian / Alaska Native" },
  { field: "a0937", label: "Asian" },
  { field: "a0939", label: "Black or African American" },
  { field: "a0941", label: "Middle Eastern or North African" },
  { field: "a0943", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0945", label: "White" },
  { field: "a0947", label: "Multi-Racial" }
];

// -- Parenting Youth -- //
// --- GENDER FIELDS — PARENTING YOUTH (UNDER 25) ---
const GENDER_FIELDS_PARENTING_YOUTH = [
  { field: "a1128", label: "Women" },
  { field: "a1129", label: "Men" },
  { field: "a1130", label: "Transgender" },
  { field: "a1131", label: "Gender Questioning" },
  { field: "a1132", label: "Culturally Specific Identity" },
  { field: "a1133", label: "Different Identity" },
  { field: "a1134", label: "Non-Binary" },
  { field: "a1135", label: "More Than One Gender" }
];

// Chart 1 — ETHNICITY (EXCLUSIVE) — PARENTING YOUTH (UNDER 25)
const ETHNICITY_FIELDS_PARENTING_YOUTH = [
  { field: "a1137", label: "Hispanic / Latina/e/o" },
  { field: "a1136", label: "Non-Hispanic / Latina/e/o" }
];

// Chart 2 — SINGLE REPORTED IDENTITY
// PARENTING YOUTH (UNDER 25)
const RACE_ONLY_FIELDS_PARENTING_YOUTH = [
  { field: "a1146", label: "American Indian / Alaska Native" },
  { field: "a1148", label: "Asian" },
  { field: "a1150", label: "Black or African American" },
  { field: "a1152", label: "Middle Eastern or North African" },
  { field: "a1154", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1156", label: "White" },
  { field: "a1158", label: "Multi-Racial" },
  { field: "a1159", label: "Hispanic / Latina / e / o Only" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS_PARENTING_YOUTH = [
  { field: "a1145", label: "American Indian / Alaska Native" },
  { field: "a1147", label: "Asian" },
  { field: "a1149", label: "Black or African American" },
  { field: "a1151", label: "Middle Eastern or North African" },
  { field: "a1153", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1155", label: "White" },
  { field: "a1157", label: "Multi-Racial" }
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
  const [ethnicityData, setEthnicityData] = useState([]);
  const [hispanicRaceData, setHispanicRaceData] = useState([]);


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

      // --- TOTAL QUERY ---
      let query = supabase
        .from(table)
        .select(
          populationGroup === "all"
            ? `cocnum, ${totalField}, a0021`
            : populationGroup === "individuals"
              ? `cocnum, ${totalField}, a0267`
              : populationGroup === "families"
                ? `cocnum, ${totalField}, a0513`
                : populationGroup === "veterans"
                  ? `cocnum, ${totalField}, a0729`
                  : populationGroup === "unaccompanied_youth"
                    ? `cocnum, ${totalField}, a0927`
                    : populationGroup === "parenting_youth"
                      ? `cocnum, ${totalField}, a1137`
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
        populationGroup === "individuals"
          ? data.reduce((sum, r) => sum + (r.a0267 || 0), 0)
          : populationGroup === "families"
            ? data.reduce((sum, r) => sum + (r.a0513 || 0), 0)
            : populationGroup === "veterans"
              ? data.reduce((sum, r) => sum + (r.a0729 || 0), 0)
              : populationGroup === "unaccompanied_youth"
                ? data.reduce((sum, r) => sum + (r.a0927 || 0), 0)
                : populationGroup === "parenting_youth"
                  ? data.reduce((sum, r) => sum + (r.a1137 || 0), 0)
                  : data.reduce((sum, r) => sum + (r.a0021 || 0), 0);



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
        await buildDistribution(ETHNICITY_FIELDS, total, setEthnicityData, table);
        await buildDistribution(GENDER_FIELDS_OVERALL, total, setGenderData, table);
        await buildDistribution(AGE_FIELDS_OVERALL, total, setAgeData, table);
        await buildDistribution(RACE_ONLY_FIELDS_OVERALL, total, setRaceData, table);
        await buildDistribution(
          HISPANIC_RACE_FIELDS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Individuals distribution -- //
      if (populationGroup === "individuals") {
        await buildDistribution(
          ETHNICITY_FIELDS_INDIVIDUALS,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          GENDER_FIELDS_INDIVIDUALS,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          AGE_FIELDS_INDIVIDUALS,
          total,
          setAgeData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_INDIVIDUALS,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          HISPANIC_RACE_FIELDS_INDIVIDUALS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- People in Families distribution -- //
      if (populationGroup === "families") {
        await buildDistribution(
          ETHNICITY_FIELDS_FAMILIES,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          GENDER_FIELDS_FAMILIES,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          AGE_FIELDS_FAMILIES,
          total,
          setAgeData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_FAMILIES,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          HISPANIC_RACE_FIELDS_FAMILIES,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Veterans distribution -- //
      if (populationGroup === "veterans") {
        await buildDistribution(
          ETHNICITY_FIELDS_VETERANS,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          GENDER_FIELDS_VETERANS,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_VETERANS,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          HISPANIC_RACE_FIELDS_VETERANS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Unaccompanied Youth distribution -- //
      if (populationGroup === "unaccompanied_youth") {
        await buildDistribution(
          ETHNICITY_FIELDS_UNACCOMPANIED_YOUTH,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          GENDER_FIELDS_UNACCOMPANIED_YOUTH,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_UNACCOMPANIED_YOUTH,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          HISPANIC_RACE_FIELDS_UNACCOMPANIED_YOUTH,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Parenting Youth distribution -- //
      if (populationGroup === "parenting_youth") {
        await buildDistribution(
          ETHNICITY_FIELDS_PARENTING_YOUTH,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          GENDER_FIELDS_PARENTING_YOUTH,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_PARENTING_YOUTH,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          HISPANIC_RACE_FIELDS_PARENTING_YOUTH,
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

      {populationGroup === "individuals" && (
        <>
          {renderChart("Gender Distribution", genderData)}
          {renderChart("Age Distribution", ageData)}
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

      {populationGroup === "families" && (
        <>
          {renderChart("Gender Distribution", genderData)}
          {renderChart("Age Distribution", ageData)}
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

      {populationGroup === "parenting_youth" && (
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
            "Subset of the Hispanic / Latina / e / o parenting youth population, broken down by race."
          )}
        </>
      )}


    </div>
  );
}
