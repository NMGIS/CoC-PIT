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
    table: "unsheltered_homeless",
    totalField: "a0208"
  },
  individuals: {
    table: "unsheltered_homeless_individuals",
    totalField: "a0454"
  },
  families: {
    table: "unsheltered_homeless_people_in_families",
    totalField: "a0659"
  },
  veterans: {
    table: "unsheltered_homeless_veterans",
    totalField: "a0884"
  },
  unaccompanied_youth: {
    table: "sunsheltered_homeless_unaccompanied_youth_under_25",
    totalField: "a1082"
  },
  parenting_youth: {
    table: "unsheltered_homeless_parenting_youth_under_25",
    totalField: "a1259"
  }
};

// --- LABELS ---
const populationLabels = {
  all: "Unsheltered Homeless (Total)",
  individuals: "Unsheltered Homeless Individuals",
  families: "Unsheltered Homeless People in Families",
  veterans: "Unsheltered Homeless Veterans",
  unaccompanied_youth: "Unsheltered Homeless Unaccompanied Youth (Under 25)",
  parenting_youth: "Unsheltered Homeless Parenting Youth (Under 25)"
};
// --- Unsheltered OVERALL ---
// --- GENDER FIELDS (Unsheltered Homeless) ---
const UNSHELTERED_GENDER_OVERALL = [
  { field: "a0217", label: "Woman" },
  { field: "a0218", label: "Man" },
  { field: "a0219", label: "Transgender" },
  { field: "a0220", label: "Gender Questioning" },
  { field: "a0221", label: "Culturally Specific Identity" },
  { field: "a0222", label: "Different Identity" },
  { field: "a0223", label: "Non-Binary" },
  { field: "a0224", label: "More Than One Gender" }
];

// --- AGE FIELDS (Unsheltered Homeless) ---
const UNSHELTERED_AGE_OVERALL = [
  { field: "a0209", label: "Under 18" },
  { field: "a0210", label: "Age 18–24" },
  { field: "a0212", label: "Age 25–34" },
  { field: "a0213", label: "Age 35–44" },
  { field: "a0214", label: "Age 45–54" },
  { field: "a0215", label: "Age 55–64" },
  { field: "a0216", label: "Over 64" }
];

// --- ETHNICITY (PRIMARY, EXCLUSIVE — Unsheltered Homeless) ---
const UNSHELTERED_ETHNICITY_FIELDS = [
  { field: "a0226", label: "Hispanic / Latina/e/o" },
  { field: "a0225", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Unsheltered Homeless — Single Reported Identity) ---
const UNSHELTERED_RACE_OVERALL = [
  { field: "a0235", label: "American Indian / Alaska Native" },
  { field: "a0237", label: "Asian" },
  { field: "a0239", label: "Black / African American" },
  { field: "a0241", label: "Middle Eastern / North African" },
  { field: "a0243", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0245", label: "White" },
  { field: "a0247", label: "Multi-Racial" },
  { field: "a0248", label: "Hispanic / Latina / e / o" }
];

// --- RACE × ETHNICITY (Unsheltered Homeless — Hispanic / Latina / e / o Subset) ---
const UNSHELTERED_HISPANIC_FIELDS = [
  { field: "a0234", label: "American Indian / Alaska Native" },
  { field: "a0236", label: "Asian" },
  { field: "a0238", label: "Black / African American" },
  { field: "a0240", label: "Middle Eastern / North African" },
  { field: "a0242", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0244", label: "White" },
  { field: "a0246", label: "Multi-Racial" }
];

// --- TH Idividuals Group -- //
// --- GENDER FIELDS (Unsheltered Homeless — Individuals) ---
const UNSHELTERED_GENDER_FIELDS_INDIVIDUALS = [
  { field: "a0463", label: "Woman" },
  { field: "a0464", label: "Man" },
  { field: "a0465", label: "Transgender" },
  { field: "a0466", label: "Gender Questioning" },
  { field: "a0467", label: "Culturally Specific Identity" },
  { field: "a0468", label: "Different Identity" },
  { field: "a0469", label: "Non-Binary" },
  { field: "a0470", label: "More Than One Gender" }
];

// --- AGE FIELDS (Unsheltered Homeless — Individuals) ---
const UNSHELTERED_AGE_FIELDS_INDIVIDUALS = [
  { field: "a0455", label: "Under 18" },
  { field: "a0456", label: "Age 18–24" },
  { field: "a0458", label: "Age 25–34" },
  { field: "a0459", label: "Age 35–44" },
  { field: "a0460", label: "Age 45–54" },
  { field: "a0461", label: "Age 55–64" },
  { field: "a0462", label: "Over 64" }
];

// --- ETHNICITY (PRIMARY, EXCLUSIVE — Unsheltered Homeless — Individuals) ---
const UNSHELTERED_ETHNICITY_FIELDS_INDIVIDUALS = [
  { field: "a0472", label: "Hispanic / Latina/e/o" },
  { field: "a0471", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Unsheltered Homeless — Individuals — Single Reported Identity) ---
const UNSHELTERED_RACE_ONLY_FIELDS_INDIVIDUALS = [
  { field: "a0481", label: "American Indian / Alaska Native" },
  { field: "a0483", label: "Asian" },
  { field: "a0485", label: "Black / African American" },
  { field: "a0487", label: "Middle Eastern / North African" },
  { field: "a0489", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0491", label: "White" },
  { field: "a0493", label: "Multi-Racial" },
  { field: "a0494", label: "Hispanic / Latina / e / o" }
];

// --- RACE × ETHNICITY (Unsheltered Homeless — Individuals — Hispanic / Latina / e / o Subset) ---
const UNSHELTERED_HISPANIC_RACE_FIELDS_INDIVIDUALS = [
  { field: "a0480", label: "American Indian / Alaska Native" },
  { field: "a0482", label: "Asian" },
  { field: "a0484", label: "Black / African American" },
  { field: "a0486", label: "Middle Eastern / North African" },
  { field: "a0488", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0490", label: "White" },
  { field: "a0492", label: "Multi-Racial" }
];

// --- TH PEOPLE IN FAMILIES --- //
// --- GENDER FIELDS (Unsheltered Homeless — People in Families) ---
const UNSHELTERED_GENDER_FIELDS_FAMILIES = [
  { field: "a0668", label: "Woman" },
  { field: "a0669", label: "Man" },
  { field: "a0670", label: "Transgender" },
  { field: "a0671", label: "Gender Questioning" },
  { field: "a0672", label: "Culturally Specific Identity" },
  { field: "a0673", label: "Different Identity" },
  { field: "a0674", label: "Non-Binary" },
  { field: "a0675", label: "More Than One Gender" }
];

// --- AGE FIELDS (Unsheltered Homeless — People in Families) ---
const UNSHELTERED_AGE_FIELDS_FAMILIES = [
  { field: "a0660", label: "Under 18" },
  { field: "a0661", label: "Age 18–24" },
  { field: "a0663", label: "Age 25–34" },
  { field: "a0664", label: "Age 35–44" },
  { field: "a0665", label: "Age 45–54" },
  { field: "a0666", label: "Age 55–64" },
  { field: "a0667", label: "Over 64" }
];

// --- ETHNICITY (PRIMARY, EXCLUSIVE — Unsheltered Homeless — People in Families) ---
const UNSHELTERED_ETHNICITY_FIELDS_FAMILIES = [
  { field: "a0677", label: "Hispanic / Latina/e/o" },
  { field: "a0676", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Unsheltered Homeless — People in Families — Single Reported Identity) ---
const UNSHELTERED_RACE_ONLY_FIELDS_FAMILIES = [
  { field: "a0686", label: "American Indian / Alaska Native" },
  { field: "a0688", label: "Asian" },
  { field: "a0690", label: "Black or African American" },
  { field: "a0692", label: "Middle Eastern or North African" },
  { field: "a0694", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0696", label: "White" },
  { field: "a0698", label: "Multi-Racial" },
  { field: "a0699", label: "Hispanic / Latina / e / o" }
];

// --- RACE × ETHNICITY (Unsheltered Homeless — People in Families — Hispanic Subset) ---
const UNSHELTERED_HISPANIC_RACE_FIELDS_FAMILIES = [
  { field: "a0685", label: "American Indian / Alaska Native" },
  { field: "a0687", label: "Asian" },
  { field: "a0689", label: "Black or African American" },
  { field: "a0691", label: "Middle Eastern or North African" },
  { field: "a0693", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0695", label: "White" },
  { field: "a0697", label: "Multi-Racial" }
];

// --- Veterans --- //
// --- GENDER FIELDS (Unsheltered Homeless — Veterans) ---
const UNSHELTERED_GENDER_FIELDS_VETERANS = [
  { field: "a0885", label: "Women" },
  { field: "a0886", label: "Men" },
  { field: "a0887", label: "Transgender" },
  { field: "a0888", label: "Gender Questioning" },
  { field: "a0889", label: "Culturally Specific Identity" },
  { field: "a0890", label: "Different Identity" },
  { field: "a0891", label: "Non-Binary" },
  { field: "a0892", label: "More Than One Gender" }
];

// --- ETHNICITY (PRIMARY, EXCLUSIVE — Unsheltered Homeless — Veterans) ---
const UNSHELTERED_ETHNICITY_FIELDS_VETERANS = [
  { field: "a0894", label: "Hispanic / Latina/e/o" },
  { field: "a0893", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Unsheltered Homeless — Veterans — Single Reported Identity) ---
const UNSHELTERED_RACE_ONLY_FIELDS_VETERANS = [
  { field: "a0903", label: "American Indian / Alaska Native" },
  { field: "a0905", label: "Asian" },
  { field: "a0907", label: "Black or African American" },
  { field: "a0909", label: "Middle Eastern or North African" },
  { field: "a0911", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0913", label: "White" },
  { field: "a0915", label: "Multi-Racial" },
  { field: "a0916", label: "Hispanic / Latina / e / o" }
];

// --- RACE × ETHNICITY (Unsheltered Homeless — Veterans — Hispanic Subset) ---
const UNSHELTERED_HISPANIC_RACE_FIELDS_VETERANS = [
  { field: "a0902", label: "American Indian / Alaska Native" },
  { field: "a0904", label: "Asian" },
  { field: "a0906", label: "Black or African American" },
  { field: "a0908", label: "Middle Eastern or North African" },
  { field: "a0910", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0912", label: "White" },
  { field: "a0914", label: "Multi-Racial" }
];

// -- Unaccompanied Youth Overall -- //
// --- GENDER FIELDS (Unsheltered Homeless — Unaccompanied Youth, Under 25) ---
const UNSHELTERED_GENDER_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a1083", label: "Women" },
  { field: "a1084", label: "Men" },
  { field: "a1085", label: "Transgender" },
  { field: "a1086", label: "Gender Questioning" },
  { field: "a1087", label: "Culturally Specific Identity" },
  { field: "a1088", label: "Different Identity" },
  { field: "a1089", label: "Non-Binary" },
  { field: "a1090", label: "More Than One Gender" }
];

// --- ETHNICITY (EXCLUSIVE — Unsheltered Homeless — Unaccompanied Youth, Under 25) ---
const UNSHELTERED_ETHNICITY_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a1092", label: "Hispanic / Latina/e/o" },
  { field: "a1091", label: "Non-Hispanic / Latina/e/o" }
];

// --- RACE FIELDS (Unsheltered Homeless — Unaccompanied Youth — Single Reported Identity) ---
const UNSHELTERED_RACE_ONLY_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a1101", label: "American Indian / Alaska Native" },
  { field: "a1103", label: "Asian" },
  { field: "a1105", label: "Black or African American" },
  { field: "a1107", label: "Middle Eastern or North African" },
  { field: "a1109", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1111", label: "White" },
  { field: "a1113", label: "Multi-Racial" },
  { field: "a1114", label: "Hispanic / Latina / e / o" }
];

// --- RACE × ETHNICITY (Unsheltered Homeless — Unaccompanied Youth — Hispanic Subset) ---
const UNSHELTERED_HISPANIC_RACE_FIELDS_UNACCOMPANIED_YOUTH = [
  { field: "a1100", label: "American Indian / Alaska Native" },
  { field: "a1102", label: "Asian" },
  { field: "a1104", label: "Black or African American" },
  { field: "a1106", label: "Middle Eastern or North African" },
  { field: "a1108", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1110", label: "White" },
  { field: "a1112", label: "Multi-Racial" }
];

// -- Parenting Youth -- //
// --- GENDER FIELDS (Unsheltered Homeless — Parenting Youth, Under 25) ---
const UNSHELTERED_GENDER_FIELDS_PARENTING_YOUTH = [
  { field: "a1260", label: "Women" },
  { field: "a1261", label: "Men" },
  { field: "a1262", label: "Transgender" },
  { field: "a1263", label: "Gender Questioning" },
  { field: "a1264", label: "Culturally Specific Identity" },
  { field: "a1265", label: "Different Identity" },
  { field: "a1266", label: "Non-Binary" },
  { field: "a1267", label: "More Than One Gender" }
];


// --- ETHNICITY (EXCLUSIVE — Unsheltered Homeless — Parenting Youth, Under 25) ---
const UNSHELTERED_ETHNICITY_FIELDS_PARENTING_YOUTH = [
  { field: "a1269", label: "Hispanic / Latina/e/o" },
  { field: "a1268", label: "Non-Hispanic / Latina/e/o" }
];


// --- RACE FIELDS (Unsheltered Homeless — Parenting Youth — Single Reported Identity) ---
const UNSHELTERED_RACE_ONLY_FIELDS_PARENTING_YOUTH = [
  { field: "a1278", label: "American Indian / Alaska Native" },
  { field: "a1280", label: "Asian" },
  { field: "a1282", label: "Black or African American" },
  { field: "a1284", label: "Middle Eastern or North African" },
  { field: "a1286", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1288", label: "White" },
  { field: "a1290", label: "Multi-Racial" },
  { field: "a1291", label: "Hispanic / Latina / e / o" }
];


// --- RACE × ETHNICITY (Unsheltered Homeless — Parenting Youth — Hispanic Subset) ---
const UNSHELTERED_HISPANIC_RACE_FIELDS_PARENTING_YOUTH = [
  { field: "a1277", label: "American Indian / Alaska Native" },
  { field: "a1279", label: "Asian" },
  { field: "a1281", label: "Black or African American" },
  { field: "a1283", label: "Middle Eastern or North African" },
  { field: "a1285", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1287", label: "White" },
  { field: "a1289", label: "Multi-Racial" }
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

      // --- TOTAL QUERY (UNSHELTERED) ---
      let query = supabase
        .from(table)
        .select(
          populationGroup === "all"
            ? `cocnum, ${totalField}, a0226`
            : populationGroup === "individuals"
              ? `cocnum, ${totalField}, a0472`
              : populationGroup === "families"
                ? `cocnum, ${totalField}, a0677`
                : populationGroup === "veterans"
                  ? `cocnum, ${totalField}, a0894`
                  : populationGroup === "unaccompanied_youth"
                    ? `cocnum, ${totalField}, a1092`
                    : populationGroup === "parenting_youth"
                      ? `cocnum, ${totalField}, a1269`
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
          ? data.reduce((sum, r) => sum + (r.a0472 || 0), 0)
          : populationGroup === "families"
            ? data.reduce((sum, r) => sum + (r.a0677 || 0), 0)
            : populationGroup === "veterans"
              ? data.reduce((sum, r) => sum + (r.a0894 || 0), 0)
              : populationGroup === "unaccompanied_youth"
                ? data.reduce((sum, r) => sum + (r.a1092 || 0), 0)
                : populationGroup === "parenting_youth"
                  ? data.reduce((sum, r) => sum + (r.a1269 || 0), 0)
                  : data.reduce((sum, r) => sum + (r.a0226 || 0), 0);


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
        await buildDistribution(UNSHELTERED_ETHNICITY_FIELDS, total, setEthnicityData, table);
        await buildDistribution(UNSHELTERED_GENDER_OVERALL, total, setGenderData, table);
        await buildDistribution(UNSHELTERED_AGE_OVERALL, total, setAgeData, table);
        await buildDistribution(UNSHELTERED_RACE_OVERALL, total, setRaceData, table);
        await buildDistribution(
          UNSHELTERED_HISPANIC_FIELDS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Individuals distribution -- //
      if (populationGroup === "individuals") {
        await buildDistribution(
          UNSHELTERED_ETHNICITY_FIELDS_INDIVIDUALS,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          UNSHELTERED_GENDER_FIELDS_INDIVIDUALS,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          UNSHELTERED_AGE_FIELDS_INDIVIDUALS,
          total,
          setAgeData,
          table
        );

        await buildDistribution(
          UNSHELTERED_RACE_ONLY_FIELDS_INDIVIDUALS,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          UNSHELTERED_HISPANIC_RACE_FIELDS_INDIVIDUALS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- People in Families distribution -- //
      if (populationGroup === "families") {
        await buildDistribution(
          UNSHELTERED_ETHNICITY_FIELDS_FAMILIES,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          UNSHELTERED_GENDER_FIELDS_FAMILIES,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          UNSHELTERED_AGE_FIELDS_FAMILIES,
          total,
          setAgeData,
          table
        );

        await buildDistribution(
          UNSHELTERED_RACE_ONLY_FIELDS_FAMILIES,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          UNSHELTERED_HISPANIC_RACE_FIELDS_FAMILIES,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Veterans distribution -- //
      if (populationGroup === "veterans") {
        await buildDistribution(
          UNSHELTERED_ETHNICITY_FIELDS_VETERANS,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          UNSHELTERED_GENDER_FIELDS_VETERANS,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          UNSHELTERED_RACE_ONLY_FIELDS_VETERANS,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          UNSHELTERED_HISPANIC_RACE_FIELDS_VETERANS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Unaccompanied Youth distribution -- //
      if (populationGroup === "unaccompanied_youth") {
        await buildDistribution(
          UNSHELTERED_ETHNICITY_FIELDS_UNACCOMPANIED_YOUTH,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          UNSHELTERED_GENDER_FIELDS_UNACCOMPANIED_YOUTH,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          UNSHELTERED_RACE_ONLY_FIELDS_UNACCOMPANIED_YOUTH,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          UNSHELTERED_HISPANIC_RACE_FIELDS_UNACCOMPANIED_YOUTH,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Parenting Youth distribution -- //
      if (populationGroup === "parenting_youth") {
        await buildDistribution(
          UNSHELTERED_ETHNICITY_FIELDS_PARENTING_YOUTH,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          UNSHELTERED_GENDER_FIELDS_PARENTING_YOUTH,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          UNSHELTERED_RACE_ONLY_FIELDS_PARENTING_YOUTH,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          UNSHELTERED_HISPANIC_RACE_FIELDS_PARENTING_YOUTH,
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
