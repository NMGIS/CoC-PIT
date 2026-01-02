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
    table: "sheltered_th_homeless",
    totalField: "a0085"
  },
  individuals: {
    table: "sheltered_th_homeless_individuals",
    totalField: "a0331"
  },
  families: {
    table: "sheltered_th_homeless_people_in_families",
    totalField: "a0577"
  },
  veterans: {
    table: "sheltered_th_homeless_veterans",
    totalField: "a0785"
  },
  unaccompanied_youth: {
    table: "sheltered_th_homeless_unaccompanied_youth_under_25",
    totalField: "a0983"
  },
  parenting_youth: {
    table: "sheltered_th_homeless_parenting_youth_under_25",
    totalField: "a1193"
  }
};

// --- LABELS ---
const populationLabels = {
  all: "Sheltered TH Homeless (Total)",
  individuals: "Sheltered TH Homeless Individuals",
  families: "Sheltered TH Homeless People in Families",
  veterans: "Sheltered TH Homeless Veterans",
  unaccompanied_youth: "Sheltered TH Homeless Unaccompanied Youth (Under 25)",
  parenting_youth: "Sheltered TH Homeless Parenting Youth (Under 25)"
};
// --- TH OVERALL ---
// --- GENDER FIELDS (Sheltered TH Homeless) ---
const TH_GENDER_OVERALL = [
  { field: "a0094", label: "Woman" },
  { field: "a0095", label: "Man" },
  { field: "a0096", label: "Transgender" },
  { field: "a0097", label: "Gender Questioning" },
  { field: "a0098", label: "Culturally Specific Identity" },
  { field: "a0099", label: "Different Identity" },
  { field: "a0100", label: "Non-Binary" },
  { field: "a0101", label: "More Than One Gender" }
];

// --- AGE FIELDS (Sheltered TH Homeless) ---
const TH_AGE_OVERALL = [
  { field: "a0086", label: "Under 18" },
  { field: "a0087", label: "Age 18–24" },
  { field: "a0089", label: "Age 25–34" },
  { field: "a0090", label: "Age 35–44" },
  { field: "a0091", label: "Age 45–54" },
  { field: "a0092", label: "Age 55–64" },
  { field: "a0093", label: "Over 64" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const TH_ETHNICITY_FIELDS = [
  { field: "a0103", label: "Hispanic / Latina/e/o" },
  { field: "a0102", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Sheltered TH Homeless — Race Only) ---
const TH_RACE_OVERALL = [
  { field: "a0112", label: "American Indian / Alaska Native" },
  { field: "a0114", label: "Asian" },
  { field: "a0116", label: "Black / African American" },
  { field: "a0118", label: "Middle Eastern / North African" },
  { field: "a0120", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0122", label: "White" },
  { field: "a0124", label: "Multi-Racial" },
  { field: "a0125", label: "Hispanic / Latina / e / o Only" }
];

// --- RACE × ETHNICITY (Sheltered TH Homeless — Hispanic / Latina / e / o Subset) ---
const TH_HISPANIC_FIELDS = [
  { field: "a0111", label: "American Indian / Alaska Native" },
  { field: "a0113", label: "Asian" },
  { field: "a0115", label: "Black / African American" },
  { field: "a0117", label: "Middle Eastern / North African" },
  { field: "a0119", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0121", label: "White" },
  { field: "a0123", label: "Multi-Racial" }
];

// --- TH Idividuals Group -- //
// --- GENDER FIELDS (Sheltered TH Homeless — Individuals) ---
const GENDER_FIELDS_INDIVIDUALS = [
  { field: "a0340", label: "Woman" },
  { field: "a0341", label: "Man" },
  { field: "a0342", label: "Transgender" },
  { field: "a0343", label: "Gender Questioning" },
  { field: "a0344", label: "Culturally Specific Identity" },
  { field: "a0345", label: "Different Identity" },
  { field: "a0346", label: "Non-Binary" },
  { field: "a0347", label: "More Than One Gender" }
];

// --- AGE FIELDS (Sheltered TH Homeless — Individuals) ---
const AGE_FIELDS_INDIVIDUALS = [
  { field: "a0332", label: "Under 18" },
  { field: "a0333", label: "Age 18–24" },
  { field: "a0335", label: "Age 25–34" },
  { field: "a0336", label: "Age 35–44" },
  { field: "a0337", label: "Age 45–54" },
  { field: "a0338", label: "Age 55–64" },
  { field: "a0339", label: "Over 64" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE) — INDIVIDUALS
const ETHNICITY_FIELDS_INDIVIDUALS = [
  { field: "a0349", label: "Hispanic / Latina/e/o" },
  { field: "a0348", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Sheltered TH Homeless — Individuals — Race Only) ---
const RACE_ONLY_FIELDS_INDIVIDUALS = [
  { field: "a0358", label: "American Indian / Alaska Native" },
  { field: "a0360", label: "Asian" },
  { field: "a0362", label: "Black / African American" },
  { field: "a0364", label: "Middle Eastern / North African" },
  { field: "a0366", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0368", label: "White" },
  { field: "a0370", label: "Multi-Racial" },
  { field: "a0371", label: "Hispanic / Latina / e / o Only" }
];

// --- RACE × ETHNICITY (Sheltered TH Homeless — Individuals — Hispanic / Latina / e / o Subset) ---
const HISPANIC_RACE_FIELDS_INDIVIDUALS = [
  { field: "a0357", label: "American Indian / Alaska Native" },
  { field: "a0359", label: "Asian" },
  { field: "a0361", label: "Black / African American" },
  { field: "a0363", label: "Middle Eastern / North African" },
  { field: "a0365", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0367", label: "White" },
  { field: "a0369", label: "Multi-Racial" }
];

// --- TH PEOPLE IN FAMILIES --- //
// --- GENDER FIELDS (Sheltered TH Homeless — People in Families) ---
const GENDER_FIELDS_FAMILIES = [
  { field: "a0586", label: "Woman" },
  { field: "a0587", label: "Man" },
  { field: "a0588", label: "Transgender" },
  { field: "a0589", label: "Gender Questioning" },
  { field: "a0590", label: "Culturally Specific Identity" },
  { field: "a0591", label: "Different Identity" },
  { field: "a0592", label: "Non-Binary" },
  { field: "a0593", label: "More Than One Gender" }
];

// --- AGE FIELDS (Sheltered TH Homeless — People in Families) ---
const AGE_FIELDS_FAMILIES = [
  { field: "a0578", label: "Under 18" },
  { field: "a0579", label: "Age 18–24" },
  { field: "a0581", label: "Age 25–34" },
  { field: "a0582", label: "Age 35–44" },
  { field: "a0583", label: "Age 45–54" },
  { field: "a0584", label: "Age 55–64" },
  { field: "a0585", label: "Over 64" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE) — PEOPLE IN FAMILIES
const ETHNICITY_FIELDS_FAMILIES = [
  { field: "a0595", label: "Hispanic / Latina/e/o" },
  { field: "a0594", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Sheltered TH Homeless — People in Families — Single Reported Identity) ---
const RACE_ONLY_FIELDS_FAMILIES = [
  { field: "a0604", label: "American Indian / Alaska Native" },
  { field: "a0606", label: "Asian" },
  { field: "a0608", label: "Black or African American" },
  { field: "a0610", label: "Middle Eastern or North African" },
  { field: "a0612", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0614", label: "White" },
  { field: "a0616", label: "Multi-Racial" },
  { field: "a0617", label: "Hispanic / Latina / e / o" }
];


// --- RACE × ETHNICITY (Sheltered TH Homeless — People in Families — Hispanic Subset) ---
const HISPANIC_RACE_FIELDS_FAMILIES = [
  { field: "a0603", label: "American Indian / Alaska Native" },
  { field: "a0605", label: "Asian" },
  { field: "a0607", label: "Black or African American" },
  { field: "a0609", label: "Middle Eastern or North African" },
  { field: "a0611", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0613", label: "White" },
  { field: "a0615", label: "Multi-Racial" }
];

// --- Veterans --- //
// --- GENDER FIELDS (Sheltered TH Homeless — Veterans) ---
const GENDER_FIELDS_VETERANS = [
  { field: "a0786", label: "Women" },
  { field: "a0787", label: "Men" },
  { field: "a0788", label: "Transgender" },
  { field: "a0789", label: "Gender Questioning" },
  { field: "a0790", label: "Culturally Specific Identity" },
  { field: "a0791", label: "Different Identity" },
  { field: "a0792", label: "Non-Binary" },
  { field: "a0793", label: "More Than One Gender" }
];


// --- ETHNICITY (PRIMARY, EXCLUSIVE — Sheltered TH Homeless — Veterans) ---
const ETHNICITY_FIELDS_VETERANS = [
  { field: "a0795", label: "Hispanic / Latina/e/o" },
  { field: "a0794", label: "Non-Hispanic / Latina/e/o" }
];


// --- RACE FIELDS (Sheltered TH Homeless — Veterans — Single Reported Identity) ---
const RACE_ONLY_FIELDS_VETERANS = [
  { field: "a0804", label: "American Indian / Alaska Native" },
  { field: "a0806", label: "Asian" },
  { field: "a0808", label: "Black or African American" },
  { field: "a0810", label: "Middle Eastern or North African" },
  { field: "a0812", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0814", label: "White" },
  { field: "a0816", label: "Multi-Racial" },
  { field: "a0817", label: "Hispanic / Latina / e / o" }
];


// --- RACE × ETHNICITY (Sheltered TH Homeless — Veterans — Hispanic Subset) ---
const HISPANIC_RACE_FIELDS_VETERANS = [
  { field: "a0803", label: "American Indian / Alaska Native" },
  { field: "a0805", label: "Asian" },
  { field: "a0807", label: "Black or African American" },
  { field: "a0809", label: "Middle Eastern or North African" },
  { field: "a0811", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0813", label: "White" },
  { field: "a0815", label: "Multi-Racial" }
];

// -- Unaccompanied Youth Overall -- //
// --- GENDER FIELDS (Sheltered TH Homeless — Unaccompanied Youth, Under 25) ---
const GENDER_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a0984", label: "Women" },
  { field: "a0985", label: "Men" },
  { field: "a0986", label: "Transgender" },
  { field: "a0987", label: "Gender Questioning" },
  { field: "a0988", label: "Culturally Specific Identity" },
  { field: "a0989", label: "Different Identity" },
  { field: "a0990", label: "Non-Binary" },
  { field: "a0991", label: "More Than One Gender" }
];


// --- ETHNICITY (EXCLUSIVE — Sheltered TH Homeless — Unaccompanied Youth, Under 25) ---
const ETHNICITY_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a0993", label: "Hispanic / Latina/e/o" },
  { field: "a0992", label: "Non-Hispanic / Latina/e/o" }
];


// --- RACE FIELDS (Sheltered TH Homeless — Unaccompanied Youth — Single Reported Identity) ---
const RACE_ONLY_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a1002", label: "American Indian / Alaska Native" },
  { field: "a1004", label: "Asian" },
  { field: "a1006", label: "Black or African American" },
  { field: "a1008", label: "Middle Eastern or North African" },
  { field: "a1010", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1012", label: "White" },
  { field: "a1014", label: "Multi-Racial" },
  { field: "a1015", label: "Hispanic / Latina / e / o" }
];


// --- RACE × ETHNICITY (Sheltered TH Homeless — Unaccompanied Youth — Hispanic Subset) ---
const HISPANIC_RACE_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a1001", label: "American Indian / Alaska Native" },
  { field: "a1003", label: "Asian" },
  { field: "a1005", label: "Black or African American" },
  { field: "a1007", label: "Middle Eastern or North African" },
  { field: "a1009", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1011", label: "White" },
  { field: "a1013", label: "Multi-Racial" }
];

// -- Parenting Youth -- //
// --- GENDER FIELDS (Sheltered TH Homeless — Parenting Youth, Under 25) ---
const GENDER_FIELDS_PARENTING_YOUTH = [
  { field: "a1194", label: "Women" },
  { field: "a1195", label: "Men" },
  { field: "a1196", label: "Transgender" },
  { field: "a1197", label: "Gender Questioning" },
  { field: "a1198", label: "Culturally Specific Identity" },
  { field: "a1199", label: "Different Identity" },
  { field: "a1200", label: "Non-Binary" },
  { field: "a1201", label: "More Than One Gender" }
];


// --- ETHNICITY (EXCLUSIVE — Sheltered TH Homeless — Parenting Youth, Under 25) ---
const ETHNICITY_FIELDS_PARENTING_YOUTH = [
  { field: "a1203", label: "Hispanic / Latina/e/o" },
  { field: "a1202", label: "Non-Hispanic / Latina/e/o" }
];


// --- RACE FIELDS (Sheltered TH Homeless — Parenting Youth — Single Reported Identity) ---
const RACE_ONLY_FIELDS_PARENTING_YOUTH = [
  { field: "a1212", label: "American Indian / Alaska Native" },
  { field: "a1214", label: "Asian" },
  { field: "a1216", label: "Black or African American" },
  { field: "a1218", label: "Middle Eastern or North African" },
  { field: "a1220", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1222", label: "White" },
  { field: "a1224", label: "Multi-Racial" },
  { field: "a1225", label: "Hispanic / Latina / e / o" }
];


// --- RACE × ETHNICITY (Sheltered TH Homeless — Parenting Youth — Hispanic Subset) ---
const HISPANIC_RACE_FIELDS_PARENTING_YOUTH = [
  { field: "a1211", label: "American Indian / Alaska Native" },
  { field: "a1213", label: "Asian" },
  { field: "a1215", label: "Black or African American" },
  { field: "a1217", label: "Middle Eastern or North African" },
  { field: "a1219", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1221", label: "White" },
  { field: "a1223", label: "Multi-Racial" }
];


export default function ShelteredTHDashboard({
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
            ? `cocnum, ${totalField}, a0103`
            : populationGroup === "individuals"
              ? `cocnum, ${totalField}, a0349`
              : populationGroup === "families"
                ? `cocnum, ${totalField}, a0595`
                : populationGroup === "veterans"
                  ? `cocnum, ${totalField}, a0795`
                  : populationGroup === "unaccompanied_youth"
                    ? `cocnum, ${totalField}, a0993`
                    : populationGroup === "parenting_youth"
                      ? `cocnum, ${totalField}, a1203`
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
          ? data.reduce((sum, r) => sum + (r.a0349 || 0), 0)
          : populationGroup === "families"
            ? data.reduce((sum, r) => sum + (r.a0595 || 0), 0)
            : populationGroup === "veterans"
              ? data.reduce((sum, r) => sum + (r.a0795 || 0), 0)
              : populationGroup === "unaccompanied_youth"
                ? data.reduce((sum, r) => sum + (r.a0993 || 0), 0)
                : populationGroup === "parenting_youth"
                  ? data.reduce((sum, r) => sum + (r.a1203 || 0), 0)
                  : data.reduce((sum, r) => sum + (r.a0103 || 0), 0);



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
        await buildDistribution(TH_ETHNICITY_FIELDS, total, setEthnicityData, table);
        await buildDistribution(TH_GENDER_OVERALL, total, setGenderData, table);
        await buildDistribution(TH_AGE_OVERALL, total, setAgeData, table);
        await buildDistribution(TH_RACE_OVERALL, total, setRaceData, table);
        await buildDistribution(
          TH_HISPANIC_FIELDS,
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
