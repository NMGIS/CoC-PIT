import { useState } from "react";
import { useEffect } from "react";
import MapViewComponent from "./components/MapView";
import Layout from "./components/Layout";
import StateFilter from "./components/StateFilter";
import CocnumFilter from "./components/COCNUMFilter";
import YearFilter from "./components/YearFilter";
import HomelessGroupFilter from "./components/HomelessGroupFilter";
import "./App.css";
import OverallDashboard from "./components/dashboards/OverallDashboard";
import ShelteredESDashboard from "./components/dashboards/ShelteredESDashboard";
import ShelteredSHDashboard from "./components/dashboards/ShelteredSHDashboard";
import ShelteredTHDashboard from "./components/dashboards/ShelteredTHDashboard";
import ShelteredTotalDashboard from "./components/dashboards/ShelteredTotalDashboard";
import UnshelteredDashboard from "./components/dashboards/UnshelteredDashboard";


export default function App() {
  // ---- FILTER STATES ----
  const [selectedState, setSelectedState] = useState("");
  const cocList = [
    "AK-500", "AK-501",
    "AL-500", "AL-501", "AL-502", "AL-503", "AL-504", "AL-505", "AL-506", "AL-507", "AL-508",
    "AR-500", "AR-501", "AR-503", "AR-505", "AR-508",
    "AS-500",
    "AZ-500", "AZ-501", "AZ-502",
    "CA-500", "CA-501", "CA-502", "CA-503", "CA-504", "CA-505", "CA-506", "CA-507", "CA-508",
    "CA-509", "CA-510", "CA-511", "CA-512", "CA-513", "CA-514", "CA-515", "CA-516", "CA-517",
    "CA-518", "CA-519", "CA-520", "CA-521", "CA-522", "CA-523", "CA-524", "CA-525", "CA-526",
    "CA-527", "CA-529", "CA-530", "CA-531",
    "CA-600", "CA-601", "CA-602", "CA-603", "CA-604",
    "CA-606", "CA-607", "CA-608", "CA-609", "CA-611", "CA-612", "CA-613", "CA-614",
    "CO-500", "CO-503", "CO-504", "CO-505",
    "CT-503", "CT-505",
    "DC-500",
    "DE-500",
    "FL-500", "FL-501", "FL-502", "FL-503", "FL-504", "FL-505", "FL-506", "FL-507", "FL-508",
    "FL-509", "FL-510", "FL-511", "FL-512", "FL-513", "FL-514", "FL-515", "FL-517", "FL-518",
    "FL-519", "FL-520",
    "FL-600", "FL-601", "FL-602", "FL-603", "FL-604", "FL-605", "FL-606",
    "GA-500", "GA-501", "GA-502", "GA-503", "GA-504", "GA-505", "GA-506", "GA-507", "GA-508",
    "GU-500",
    "HI-500", "HI-501",
    "IA-500", "IA-501", "IA-502",
    "ID-500", "ID-501",
    "IL-500", "IL-501", "IL-502", "IL-503", "IL-504",
    "IL-506", "IL-507", "IL-508", "IL-510", "IL-511", "IL-512",
    "IL-513", "IL-514", "IL-515", "IL-516", "IL-517", "IL-518", "IL-519", "IL-520",
    "IN-502", "IN-503",
    "KS-502", "KS-503", "KS-505", "KS-507",
    "KY-500", "KY-501", "KY-502",
    "LA-500", "LA-502", "LA-503", "LA-505", "LA-506", "LA-507", "LA-509",
    "MA-500", "MA-502", "MA-503", "MA-504", "MA-505", "MA-506", "MA-507", "MA-509",
    "MA-511", "MA-515", "MA-516",
    "MD-501", "MD-503", "MD-504", "MD-505", "MD-506",
    "MD-511", "MD-513", "MD-514",
    "MD-600", "MD-601",
    "ME-500",
    "MI-500", "MI-501", "MI-502", "MI-503", "MI-504", "MI-505", "MI-506", "MI-507", "MI-508",
    "MI-509", "MI-510", "MI-511", "MI-512", "MI-514", "MI-515", "MI-516", "MI-517", "MI-518",
    "MI-519", "MI-523",
    "MN-500", "MN-501", "MN-502", "MN-503", "MN-504", "MN-505", "MN-506", "MN-508",
    "MN-509", "MN-511",
    "MO-500", "MO-501", "MO-503", "MO-600", "MO-602", "MO-603", "MO-604", "MO-606",
    "MP-500",
    "MS-500", "MS-501", "MS-503",
    "MT-500",
    "NC-500", "NC-501", "NC-502", "NC-503", "NC-504", "NC-505", "NC-506", "NC-507",
    "NC-509", "NC-511", "NC-513", "NC-516",
    "ND-500",
    "NE-500", "NE-501", "NE-502",
    "NH-500", "NH-501", "NH-502",
    "NJ-500", "NJ-501", "NJ-502", "NJ-503", "NJ-504",
    "NJ-506", "NJ-507", "NJ-508", "NJ-509", "NJ-510", "NJ-511", "NJ-512",
    "NJ-513", "NJ-514", "NJ-515", "NJ-516",
    "NM-500", "NM-501",
    "NV-500", "NV-501", "NV-502",
    "NY-500", "NY-501", "NY-503", "NY-505", "NY-507", "NY-508", "NY-510", "NY-511",
    "NY-512", "NY-513", "NY-514",
    "NY-518", "NY-519", "NY-520", "NY-522", "NY-523", "NY-525",
    "NY-600", "NY-601", "NY-602", "NY-603", "NY-604",
    "NY-606", "NY-608",
    "OH-500", "OH-501", "OH-502", "OH-503", "OH-504", "OH-505", "OH-506", "OH-507", "OH-508",
    "OK-500", "OK-501", "OK-502", "OK-503", "OK-504", "OK-505", "OK-506", "OK-507",
    "OR-500", "OR-501", "OR-502", "OR-503", "OR-504", "OR-505", "OR-506", "OR-507",
    "PA-500", "PA-501", "PA-502", "PA-503", "PA-504", "PA-505", "PA-506",
    "PA-508", "PA-509", "PA-510", "PA-511", "PA-512",
    "PA-600", "PA-601", "PA-603", "PA-605",
    "PR-502", "PR-503",
    "RI-500",
    "SC-500", "SC-501", "SC-502", "SC-503",
    "SD-500",
    "TN-500", "TN-501", "TN-502", "TN-503", "TN-504",
    "TN-506", "TN-507", "TN-509", "TN-510", "TN-512",
    "TX-500", "TX-503",
    "TX-600", "TX-601", "TX-603", "TX-604", "TX-607",
    "TX-611", "TX-624",
    "TX-700", "TX-701",
    "UT-500", "UT-503", "UT-504",
    "VA-500", "VA-501", "VA-502", "VA-503", "VA-504", "VA-505",
    "VA-507", "VA-508",
    "VA-513", "VA-514",
    "VA-521",
    "VA-600", "VA-601", "VA-602", "VA-603", "VA-604",
    "VI-500",
    "VT-500", "VT-501",
    "WA-500", "WA-501", "WA-502", "WA-503", "WA-504", "WA-508",
    "WI-500", "WI-501", "WI-502", "WI-503",
    "WV-500", "WV-501", "WV-503", "WV-508",
    "WY-500"
  ];
  const legacyList = [
    "AR-502", "AR-504", "AR-506", "AR-507", "AR-509", "AR-510", "AR-512",
    "CA-528", "CA-605", "CA-610", "CA-615",
    "CT-500", "CT-501", "CT-502", "CT-504", "CT-506", "CT-507",
    "CT-508", "CT-509", "CT-510", "CT-512",
    "FL-516",
    "IL-505", "IL-509",
    "IN-500",
    "KS-500", "KS-501",
    "LA-501", "LA-504", "LA-508",
    "MA Shared Jurisdiction",
    "MA-501", "MA-508", "MA-510",
    "MA-510 and MA-516 Shared Jurisdiction",
    "MA-510_513_516_518_Shared_Jurisdiction",
    "MA-510_MA-513_MA-516_MA-518 Shared Jurisdiction",
    "MA-510_MA-513_MA-516_Shared_Jurisdiction",
    "MA-510_MA-516_MA-518_Shared_Jurisdiction",
    "MA-510_MA-516_Shared_Jurisdiction",
    "MA-510_and_MA-516_Shared_Jurisdiction",
    "MA-512", "MA-513", "MA-514", "MA-517", "MA-518", "MA-519", "MA-520",
    "MA_510_MA_516_Shared_Jurisdiction",
    "MD-500", "MD-502", "MD-507", "MD-508", "MD-509", "MD-510", "MD-512",
    "ME-501", "ME-502",
    "MI-513", "MI-521", "MI-522", "MI-524",
    "MN-507", "MN-510", "MN-512",
    "MO-601",
    "NC-508",
    "NE-503", "NE-504", "NE-505", "NE-506",
    "NJ-505", "NJ-517", "NJ-518", "NJ-519", "NJ-520",
    "NY-502", "NY-504", "NY-506", "NY-509", "NY-515", "NY-516",
    "NY-517", "NY-521", "NY-524",
    "NY-605", "NY-607", "NY-609",
    "PA-507", "PA-602",
    "SC-504",
    "TX-501", "TX-504",
    "TX-610", "TX-613",
    "TX-702", "TX-703", "TX-704",
    "VA-509", "VA-510", "VA-512",
    "VA-517", "VA-518", "VA-519",
    "WA-506", "WA-507"
  ];

  const legacyYearMap = {
    "AR-502": 2009,
    "AR-504": 2019,
    "AR-506": 2009,
    "AR-507": 2011,
    "AR-509": 2007,
    "AR-510": 2007,
    "AR-512": 2017,
    "CA-528": 2011,
    "CA-605": 2012,
    "CA-610": 2010,
    "CA-615": 2015,
    "CT-500": 2010,
    "CT-501": 2012,
    "CT-502": 2015,
    "CT-504": 2009,
    "CT-506": 2014,
    "CT-507": 2009,
    "CT-508": 2014,
    "CT-509": 2010,
    "CT-510": 2010,
    "CT-512": 2014,
    "FL-516": 2014,
    "IL-505": 2010,
    "IL-509": 2018,
    "IN-500": 2016,
    "KS-500": 2007,
    "KS-501": 2015,
    "LA-501": 2014,
    "LA-504": 2016,
    "LA-508": 2017,
    "MA Shared Jurisdiction": 2008,
    "MA-501": 2011,
    "MA-508": 2019,
    "MA-510": 2020,
    "MA-510 and MA-516 Shared Jurisdiction": 2019,
    "MA-510_513_516_518_Shared_Jurisdiction": 2014,
    "MA-510_MA-513_MA-516_MA-518 Shared Jurisdiction": 2011,
    "MA-510_MA-513_MA-516_Shared_Jurisdiction": 2012,
    "MA-510_MA-516_MA-518_Shared_Jurisdiction": 2016,
    "MA-510_MA-516_Shared_Jurisdiction": 2017,
    "MA-510_and_MA-516_Shared_Jurisdiction": 2020,
    "MA-512": 2011,
    "MA-513": 2014,
    "MA-514": 2008,
    "MA-517": 2019,
    "MA-518": 2016,
    "MA-519": 2023,
    "MA-520": 2014,
    "MA_510_MA_516_Shared_Jurisdiction": 2018,
    "MD-500": 2019,
    "MD-502": 2021,
    "MD-507": 2019,
    "MD-508": 2019,
    "MD-509": 2022,
    "MD-510": 2019,
    "MD-512": 2019,
    "ME-501": 2011,
    "ME-502": 2016,
    "MI-513": 2019,
    "MI-521": 2007,
    "MI-522": 2009,
    "MI-524": 2007,
    "MN-507": 2007,
    "MN-510": 2010,
    "MN-512": 2007,
    "MO-601": 2007,
    "NC-508": 2008,
    "NE-503": 2009,
    "NE-504": 2010,
    "NE-505": 2010,
    "NE-506": 2010,
    "NJ-505": 2012,
    "NJ-517": 2007,
    "NJ-518": 2014,
    "NJ-519": 2010,
    "NJ-520": 2012,
    "NY-502": 2015,
    "NY-504": 2019,
    "NY-506": 2012,
    "NY-509": 2014,
    "NY-515": 2007,
    "NY-516": 2019,
    "NY-517": 2014,
    "NY-521": 2007,
    "NY-524": 2012,
    "NY-605": 2011,
    "NY-607": 2019,
    "NY-609": 2007,
    "PA-507": 2014,
    "PA-602": 2014,
    "SC-504": 2009,
    "TX-501": 2012,
    "TX-504": 2012,
    "TX-610": 2011,
    "TX-613": 2009,
    "TX-702": 2011,
    "TX-703": 2014,
    "TX-704": 2010,
    "VA-509": 2012,
    "VA-510": 2012,
    "VA-512": 2010,
    "VA-517": 2012,
    "VA-518": 2011,
    "VA-519": 2010,
    "WA-506": 2007,
    "WA-507": 2017,
  };

  const stateToPrefix = {
    "Alabama": "AL",
    "Alaska": "AK",
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District of Columbia": "DC",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",   // special handling below
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Marianas": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virgin Islands": "VI",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
  };

  const groupToTables = {
    "Overall Homeless": [
      "overall_homeless",
      "overall_homeless_individuals",
      "overall_homeless_parenting_youth_under_25",
      "overall_homeless_people_in_families",
      "overall_homeless_unaccompanied_youth_under_25",
      "overall_homeless_veterans",
      "various_totals",
      "Youth_Totals_Under_Less_than_18_or_18_to_24",
      "Parenting_Youth_Totals_Under_Less_than_18_or_18_to_24"
    ],
    "Sheltered ES Homeless": [
      "sheltered_es_homeless",
      "sheltered_es_homeless_individuals",
      "sheltered_es_homeless_parenting_youth_under_25",
      "sheltered_es_homeless_people_in_families",
      "sheltered_es_homeless_unaccompanied_youth_under_25",
      "sheltered_es_homeless_veterans"
    ],
    "Sheltered SH Homeless": [
      "sheltered_sh_homeless",
      "sheltered_sh_homeless_individuals",
      "sheltered_sh_homeless_people_in_families",
      "sheltered_sh_homeless_unaccompanied_youth_under_25",
      "sheltered_sh_homeless_veterans"
    ],
    "Sheltered TH Homeless": [
      "sheltered_th_homeless",
      "sheltered_th_homeless_individuals",
      "sheltered_th_homeless_parenting_youth_under_25",
      "sheltered_th_homeless_people_in_families",
      "sheltered_th_homeless_unaccompanied_youth_under_25",
      "sheltered_th_homeless_veterans"
    ],
    "Sheltered Total Homeless": [
      "sheltered_total_homeless",
      "sheltered_total_homeless_individuals",
      "sheltered_total_homeless_parenting_youth_under_25",
      "sheltered_total_homeless_people_in_families",
      "sheltered_total_homeless_unaccompanied_youth_under_25",
      "sheltered_total_homeless_veterans"
    ],
    "Unsheltered Homeless": [
      "unsheltered_homeless",
      "unsheltered_homeless_individuals",
      "unsheltered_homeless_parenting_youth_under_25",
      "unsheltered_homeless_people_in_families",
      "unsheltered_homeless_unaccompanied_youth_under_25",
      "unsheltered_homeless_veterans"
    ]

  };


  function renderDashboard() {
    switch (selectedGroup) {
      case "Overall Homeless":
        return (
          <OverallDashboard
            year={selectedYear}
            state={selectedState}
            currentCocnums={selectedCurrentCocnums}
            legacyCocnums={selectedLegacyCocnums}
            populationGroup={populationGroup}
          />
        );
      case "Sheltered ES Homeless":
        return (
          <ShelteredESDashboard
            year={selectedYear}
            state={selectedState}
            currentCocnums={selectedCurrentCocnums}
            legacyCocnums={selectedLegacyCocnums}
          />
        );
      case "Sheltered SH Homeless":
        return (
          <ShelteredSHDashboard
            year={selectedYear}
            state={selectedState}
            currentCocnums={selectedCurrentCocnums}
            legacyCocnums={selectedLegacyCocnums}
          />
        );
      case "Sheltered TH Homeless":
        return (
          <ShelteredTHDashboard
            year={selectedYear}
            state={selectedState}
            currentCocnums={selectedCurrentCocnums}
            legacyCocnums={selectedLegacyCocnums}
          />
        );
      case "Sheltered Total Homeless":
        return (
          <ShelteredTotalDashboard
            year={selectedYear}
            state={selectedState}
            currentCocnums={selectedCurrentCocnums}
            legacyCocnums={selectedLegacyCocnums}
          />
        );


      case "Unsheltered Homeless":
        return (
          <UnshelteredDashboard
            year={selectedYear}
            state={selectedState}
            currentCocnums={selectedCurrentCocnums}
            legacyCocnums={selectedLegacyCocnums}
          />
        );
    }
  }


  const legacyLabelMap = legacyList.reduce((acc, id) => {
    const year = legacyYearMap[id];
    acc[id] = year ? `${id} (${year})` : id;
    return acc;
  }, {});


  const [selectedCurrentCocnums, setSelectedCurrentCocnums] = useState([]);
  const [selectedLegacyCocnums, setSelectedLegacyCocnums] = useState(["NONE"]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedGroup, setSelectedGroup] = useState("Overall Homeless");
  const [populationGroup, setPopulationGroup] = useState("all");


  useEffect(() => {
    setSelectedLegacyCocnums(["NONE"]);
  }, [selectedYear]);


  const filteredCurrentList = selectedState
    ? cocList.filter(c => {
      const prefix = stateToPrefix[selectedState];
      if (prefix === "MA") return c.startsWith("MA");
      return c.startsWith(prefix + "-");
    })
    : cocList;

  const filteredLegacyList = legacyList.filter(c => {
    // --- FILTER BY YEAR ---
    if (legacyYearMap[c] !== Number(selectedYear)) {
      return false;
    }

    // --- FILTER BY STATE (if selected) ---
    if (selectedState) {
      const prefix = stateToPrefix[selectedState];
      if (prefix === "MA") return c.startsWith("MA");
      return c.startsWith(prefix + "-");
    }

    return true;
  });


  // ---- RESET ALL FILTERS ----
  const handleReset = () => {
    setSelectedState("");
    setSelectedCurrentCocnums([]);
    setSelectedLegacyCocnums(["NONE"]);
    setSelectedYear("2024");
  };


  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCurrentCocnums([]);
    setSelectedLegacyCocnums(["NONE"]);
  };



  return (
    <Layout
      top={
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* RESET BUTTON */}
          <button
            onClick={handleReset}
            style={{
              padding: "6px 10px",
              background: "#444",
              color: "white",
              border: "1px solid #666",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>

          <HomelessGroupFilter
            value={selectedGroup}
            onChange={setSelectedGroup}
          />


          <YearFilter
            value={selectedYear}
            onChange={setSelectedYear}
          />


          {/* STATE FILTER */}
          <StateFilter
            value={selectedState}
            onChange={(state) => handleStateChange(state)}
          />

          {/* CURRENT COCNUMS */}
          <CocnumFilter
            type="current"
            value={selectedCurrentCocnums}
            onChange={setSelectedCurrentCocnums}
            cocnums={filteredCurrentList}
          />

          <CocnumFilter
            type="legacy"
            label="Legacy COCNUM"
            value={selectedLegacyCocnums}
            onChange={setSelectedLegacyCocnums}
            cocnums={filteredLegacyList}
            labelMap={legacyLabelMap}
            includeNoneOption={true}
          />




        </div>
      }
      left={renderDashboard()}
      map={<MapViewComponent
        selectedState={selectedState}
        selectedCurrent={selectedCurrentCocnums}
        selectedLegacy={selectedLegacyCocnums}
      />
      }
    />
  );
}
