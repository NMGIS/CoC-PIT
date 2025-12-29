import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PopulationGroupSelector from "../PopulationGroupSelector";

const populationConfig = {
  all: {
    table: "sheltered_es_homeless",
    totalField: "a0044"
  },
  individuals: {
    table: "sheltered_es_homeless_individuals",
    totalField: "a0290"
  },
  families: {
    table: "sheltered_es_homeless_people_in_families",
    totalField: "a0536"
  },
  veterans: {
    table: "sheltered_es_homeless_veterans",
    totalField: "a0752"
  },
  unaccompanied_youth: {
    table: "sheltered_es_homeless_unaccompanied_youth_under_25",
    totalField: "a0950"
  },
  parenting_youth: {
    table: "sheltered_es_homeless_parenting_youth_under_25",
    totalField: "a1160"
  }
};

// --- LABELS (SHELTERED TOTAL) ---
const populationLabels = {
  all: "Emergency Sheltered Homeless (Total)",
  individuals: "Emergency Sheltered Homeless Individuals",
  families: "Emergency Sheltered Homeless People in Families",
  veterans: "Emergency Sheltered Homeless Veterans",
  unaccompanied_youth: "Emergency Sheltered Homeless Unaccompanied Youth (Under 25)",
  parenting_youth: "Emergency Sheltered Homeless Parenting Youth (Under 25)"
};

//--Overall ES--//
// --- GENDER FIELDS (SHELTERED ES - TOTAL) ---
const shelteredESGenderFields = [
  { label: "Woman", field: "a0053" },
  { label: "Man", field: "a0054" },
  { label: "Transgender", field: "a0055" },
  { label: "Gender Questioning", field: "a0056" },
  { label: "Culturally Specific Identity", field: "a0057" },
  { label: "Different Identity", field: "a0058" },
  { label: "Non-Binary", field: "a0059" },
  { label: "More Than One Gender", field: "a0060" }
];

// --- AGE FIELDS (SHELTERED ES - TOTAL) ---
const shelteredESAgeFields = [
  { label: "Under 18", field: "a0045" },
  { label: "18–24", field: "a0046" },
  { label: "25–34", field: "a0048" },
  { label: "35–44", field: "a0049" },
  { label: "45–54", field: "a0050" },
  { label: "55–64", field: "a0051" },
  { label: "65+", field: "a0052" }
];

const ETHNICITY_FIELDS_SHELTERED_ES = [
  { field: "a0062", label: "Hispanic / Latina/e/o" },
  { field: "a0061", label: "Non-Hispanic / Latina/e/o" }
];

const RACE_ONLY_FIELDS_SHELTERED_ES = [
  { field: "a0071", label: "American Indian / Alaska Native" },
  { field: "a0073", label: "Asian" },
  { field: "a0075", label: "Black / African American" },
  { field: "a0077", label: "Middle Eastern / North African" },
  { field: "a0079", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0081", label: "White" },
  { field: "a0083", label: "Multi-Racial" },
  { field: "a0084", label: "Hispanic / Latina / e / o Only" }
];

const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_SHELTERED_ES = [
  { field: "a0070", label: "American Indian / Alaska Native" },
  { field: "a0072", label: "Asian" },
  { field: "a0074", label: "Black / African American" },
  { field: "a0076", label: "Middle Eastern / North African" },
  { field: "a0078", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0080", label: "White" },
  { field: "a0082", label: "Multi-Racial" }
];

// -- ES Individuals -- //
const ESIndividualsGenderFields = [
  { label: "Woman", field: "a0299" },
  { label: "Man", field: "a0300" },
  { label: "Transgender", field: "a0301" },
  { label: "Gender Questioning", field: "a0302" },
  { label: "Culturally Specific Identity", field: "a0303" },
  { label: "Different Identity", field: "a0304" },
  { label: "Non-Binary", field: "a0305" },
  { label: "More Than One Gender", field: "a0306" }
];

const ESIndividualsAgeFields = [
  { label: "Under 18", field: "a0291" },
  { label: "18–24", field: "a0292" },
  { label: "25–34", field: "a0294" },
  { label: "35–44", field: "a0295" },
  { label: "45–54", field: "a0296" },
  { label: "55–64", field: "a0297" },
  { label: "65+", field: "a0298" }
];

const ETHNICITY_FIELDS_ES_INDIVIDUALS = [
  { field: "a0308", label: "Hispanic / Latina/e/o" },
  { field: "a0307", label: "Non-Hispanic / Latina/e/o" }
];

const RACE_ONLY_FIELDS_ES_INDIVIDUALS = [
  { field: "a0317", label: "American Indian / Alaska Native" },
  { field: "a0319", label: "Asian" },
  { field: "a0321", label: "Black / African American" },
  { field: "a0323", label: "Middle Eastern / North African" },
  { field: "a0325", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0327", label: "White" },
  { field: "a0329", label: "Multi-Racial" },
  { field: "a0330", label: "Hispanic / Latina / e / o Only" }
];

const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_INDIVIDUALS = [
  { field: "a0316", label: "American Indian / Alaska Native" },
  { field: "a0318", label: "Asian" },
  { field: "a0320", label: "Black / African American" },
  { field: "a0322", label: "Middle Eastern / North African" },
  { field: "a0324", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0326", label: "White" },
  { field: "a0328", label: "Multi-Racial" }
];

//--ES Families--//
const ESFamiliesGenderFields = [
  { label: "Woman", field: "a0545" },
  { label: "Man", field: "a0546" },
  { label: "Transgender", field: "a0547" },
  { label: "Gender Questioning", field: "a0548" },
  { label: "Culturally Specific Identity", field: "a0549" },
  { label: "Different Identity", field: "a0550" },
  { label: "Non-Binary", field: "a0551" },
  { label: "More Than One Gender", field: "a0552" }
];

const ESFamiliesAgeFields = [
  { label: "Under 18", field: "a0537" },
  { label: "18–24", field: "a0538" },
  { label: "25–34", field: "a0540" },
  { label: "35–44", field: "a0541" },
  { label: "45–54", field: "a0542" },
  { label: "55–64", field: "a0543" },
  { label: "65+", field: "a0544" }
];

const ETHNICITY_FIELDS_ES_FAMILIES = [
  { field: "a0554", label: "Hispanic / Latina/e/o" },
  { field: "a0553", label: "Non-Hispanic / Latina/e/o" }
];

const RACE_ONLY_FIELDS_ES_FAMILIES = [
  { field: "a0563", label: "American Indian / Alaska Native" },
  { field: "a0565", label: "Asian" },
  { field: "a0567", label: "Black / African American" },
  { field: "a0569", label: "Middle Eastern / North African" },
  { field: "a0571", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0573", label: "White" },
  { field: "a0575", label: "Multi-Racial" },
  { field: "a0576", label: "Hispanic / Latina / e / o Only" }
];

const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_FAMILIES = [
  { field: "a0562", label: "American Indian / Alaska Native" },
  { field: "a0564", label: "Asian" },
  { field: "a0566", label: "Black / African American" },
  { field: "a0568", label: "Middle Eastern / North African" },
  { field: "a0570", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0572", label: "White" },
  { field: "a0574", label: "Multi-Racial" }
];

// -- ES Veterans -- //
const ESVeteransGenderFields = [
  { label: "Woman", field: "a0753" },
  { label: "Man", field: "a0754" },
  { label: "Transgender", field: "a0755" },
  { label: "Gender Questioning", field: "a0756" },
  { label: "Culturally Specific Identity", field: "a0757" },
  { label: "Different Identity", field: "a0758" },
  { label: "Non-Binary", field: "a0759" },
  { label: "More Than One Gender", field: "a0760" }
];

const ETHNICITY_FIELDS_ES_VETERANS = [
  { field: "a0762", label: "Hispanic / Latina/e/o" },
  { field: "a0761", label: "Non-Hispanic / Latina/e/o" }
];

const RACE_ONLY_FIELDS_ES_VETERANS = [
  { field: "a0771", label: "American Indian / Alaska Native" },
  { field: "a0773", label: "Asian" },
  { field: "a0775", label: "Black / African American" },
  { field: "a0777", label: "Middle Eastern / North African" },
  { field: "a0779", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0781", label: "White" },
  { field: "a0783", label: "Multi-Racial" },
  { field: "a0784", label: "Hispanic / Latina / e / o Only" }
];

const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_VETERANS = [
  { field: "a0770", label: "American Indian / Alaska Native" },
  { field: "a0772", label: "Asian" },
  { field: "a0774", label: "Black / African American" },
  { field: "a0776", label: "Middle Eastern / North African" },
  { field: "a0778", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0780", label: "White" },
  { field: "a0782", label: "Multi-Racial" }
];

// -- ES Unaccompanied Youth (Under 25) -- //
const ESUnaccompaniedYouthGenderFields = [
  { label: "Woman", field: "a0951" },
  { label: "Man", field: "a0952" },
  { label: "Transgender", field: "a0953" },
  { label: "Gender Questioning", field: "a0954" },
  { label: "Culturally Specific Identity", field: "a0955" },
  { label: "Different Identity", field: "a0956" },
  { label: "Non-Binary", field: "a0957" },
  { label: "More Than One Gender", field: "a0958" }
];

const ETHNICITY_FIELDS_ES_UNACCOMPANIED_YOUTH = [
  { field: "a0960", label: "Hispanic / Latina/e/o" },
  { field: "a0959", label: "Non-Hispanic / Latina/e/o" }
];

const RACE_ONLY_FIELDS_ES_UNACCOMPANIED_YOUTH = [
  { field: "a0969", label: "American Indian / Alaska Native" },
  { field: "a0971", label: "Asian" },
  { field: "a0973", label: "Black / African American" },
  { field: "a0975", label: "Middle Eastern / North African" },
  { field: "a0977", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0979", label: "White" },
  { field: "a0981", label: "Multi-Racial" },
  { field: "a0982", label: "Hispanic / Latina / e / o Only" }
];

const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_UNACCOMPANIED_YOUTH = [
  { field: "a0968", label: "American Indian / Alaska Native" },
  { field: "a0970", label: "Asian" },
  { field: "a0972", label: "Black / African American" },
  { field: "a0974", label: "Middle Eastern / North African" },
  { field: "a0976", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0978", label: "White" },
  { field: "a0980", label: "Multi-Racial" }
];

// -- ES Parenting Youth (Under 25) -- //
const ESParentingYouthGenderFields = [
  { label: "Woman", field: "a1161" },
  { label: "Man", field: "a1162" },
  { label: "Transgender", field: "a1163" },
  { label: "Gender Questioning", field: "a1164" },
  { label: "Culturally Specific Identity", field: "a1165" },
  { label: "Different Identity", field: "a1166" },
  { label: "Non-Binary", field: "a1167" },
  { label: "More Than One Gender", field: "a1168" }
];

const ETHNICITY_FIELDS_ES_PARENTING_YOUTH = [
  { field: "a1170", label: "Hispanic / Latina/e/o" },
  { field: "a1169", label: "Non-Hispanic / Latina/e/o" }
];

const RACE_ONLY_FIELDS_ES_PARENTING_YOUTH = [
  { field: "a1179", label: "American Indian / Alaska Native" },
  { field: "a1181", label: "Asian" },
  { field: "a1183", label: "Black / African American" },
  { field: "a1185", label: "Middle Eastern / North African" },
  { field: "a1187", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a1189", label: "White" },
  { field: "a1191", label: "Multi-Racial" },
  { field: "a1192", label: "Hispanic / Latina / e / o Only" }
];

const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_PARENTING_YOUTH = [
  { field: "a1178", label: "American Indian / Alaska Native" },
  { field: "a1180", label: "Asian" },
  { field: "a1182", label: "Black / African American" },
  { field: "a1184", label: "Middle Eastern / North African" },
  { field: "a1186", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a1188", label: "White" },
  { field: "a1190", label: "Multi-Racial" }
];

export default function ShelteredESDashboard({
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
            ? `cocnum, ${totalField}, a0062`
            : populationGroup === "individuals"
              ? `cocnum, ${totalField}, a0308`
              : populationGroup === "families"
                ? `cocnum, ${totalField}, a0554`
                : populationGroup === "veterans"
                  ? `cocnum, ${totalField}, a0762`
                  : populationGroup === "unaccompanied_youth"
                    ? `cocnum, ${totalField}, a0960`
                    : populationGroup === "parenting_youth"
                      ? `cocnum, ${totalField}, a1170`
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
          ? data.reduce((sum, r) => sum + (r.a0308 || 0), 0)
          : populationGroup === "families"
            ? data.reduce((sum, r) => sum + (r.a0554 || 0), 0)
            : populationGroup === "veterans"
              ? data.reduce((sum, r) => sum + (r.a0762 || 0), 0)
              : populationGroup === "unaccompanied_youth"
                ? data.reduce((sum, r) => sum + (r.a0960 || 0), 0)
                : populationGroup === "parenting_youth"
                  ? data.reduce((sum, r) => sum + (r.a1170 || 0), 0)
                  : data.reduce((sum, r) => sum + (r.a0062 || 0), 0);



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
        await buildDistribution(ETHNICITY_FIELDS_SHELTERED_ES, total, setEthnicityData, table);
        await buildDistribution(shelteredESGenderFields, total, setGenderData, table);
        await buildDistribution(shelteredESGenderFields, total, setAgeData, table);
        await buildDistribution(RACE_ONLY_FIELDS_SHELTERED_ES, total, setRaceData, table);
        await buildDistribution(
          RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_SHELTERED_ES,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Individuals distribution -- //
      if (populationGroup === "individuals") {
        await buildDistribution(
          ETHNICITY_FIELDS_ES_INDIVIDUALS,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          ESIndividualsGenderFields,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          ESIndividualsAgeFields,
          total,
          setAgeData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_ES_INDIVIDUALS,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_INDIVIDUALS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- People in Families distribution -- //
      if (populationGroup === "families") {
        await buildDistribution(
          ETHNICITY_FIELDS_ES_FAMILIES,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          ESFamiliesGenderFields,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          ESFamiliesAgeFields,
          total,
          setAgeData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_ES_FAMILIES,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_FAMILIES,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Veterans distribution -- //
      if (populationGroup === "veterans") {
        await buildDistribution(
          ETHNICITY_FIELDS_ES_VETERANS,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          ESVeteransGenderFields,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_ES_VETERANS,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_VETERANS,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Unaccompanied Youth distribution -- //
      if (populationGroup === "unaccompanied_youth") {
        await buildDistribution(
          ETHNICITY_FIELDS_ES_UNACCOMPANIED_YOUTH,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          ESUnaccompaniedYouthGenderFields,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_ES_UNACCOMPANIED_YOUTH,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_UNACCOMPANIED_YOUTH,
          hispanicTotal,
          setHispanicRaceData,
          table
        );
      }

      // -- Parenting Youth distribution -- //
      if (populationGroup === "parenting_youth") {
        await buildDistribution(
          ETHNICITY_FIELDS_ES_PARENTING_YOUTH,
          total,
          setEthnicityData,
          table
        );

        await buildDistribution(
          ESParentingYouthGenderFields,
          total,
          setGenderData,
          table
        );

        await buildDistribution(
          RACE_ONLY_FIELDS_ES_PARENTING_YOUTH,
          total,
          setRaceData,
          table
        );

        await buildDistribution(
          RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_ES_PARENTING_YOUTH,
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

