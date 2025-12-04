import { useState } from "react";
import MapViewComponent from "./components/MapView";
import Layout from "./components/Layout";
import StateFilter from "./components/StateFilter";
import CocnumFilter from "./components/COCNUMFilter";
import "./App.css";

export default function App() {
  // ---- FILTER STATES ----
  const [selectedState, setSelectedState] = useState("");
  const [selectedCocnums, setSelectedCocnums] = useState([]);
  const cocList = ["AK-500", "AK-501", "AL-500", "AL-501", "AL-502", "AL-503", "AL-504", "AL-505", "AL-506", "AL-507", "AL-508",
    "AR-500", "AR-501", "AR-502", "AR-503", "AR-504", "AR-505", "AR-506", "AR-507", "AR-508", "AR-509", "AR-510", "AR-512", "AS-500", "AZ-500", "AZ-501", "AZ-502", "CA-500", "CA-501", "CA-502", "CA-503", "CA-504", "CA-505", "CA-506", "CA-507", "CA-508", "CA-509", "CA-510", "CA-511", "CA-512",
    "CA-513", "CA-514", "CA-515", "CA-516", "CA-517", "CA-518", "CA-519", "CA-520", "CA-521", "CA-522", "CA-523", "CA-524", "CA-525",
    "CA-526", "CA-527", "CA-528", "CA-529", "CA-530", "CA-531", "CA-600", "CA-601", "CA-602", "CA-603", "CA-604", "CA-605", "CA-606", "CA-607", "CA-608", "CA-609", "CA-610", "CA-611", "CA-612",
    "CA-613", "CA-614", "CA-615", "CO-500", "CO-503", "CO-504", "CO-505", "CT-500", "CT-501", "CT-502", "CT-503", "CT-504", "CT-505", "CT-506", "CT-507", "CT-508", "CT-509", "CT-510", "CT-512",
    "DC-500", "DE-500", "FL-500", "FL-501", "FL-502", "FL-503", "FL-504", "FL-505", "FL-506", "FL-507", "FL-508", "FL-509", "FL-510", "FL-511", "FL-512",
    "FL-513", "FL-514", "FL-515", "FL-516", "FL-517", "FL-518", "FL-519", "FL-520", "FL-600", "FL-601", "FL-602", "FL-603", "FL-604", "FL-605", "FL-606",
    "GA-500", "GA-501", "GA-502", "GA-503", "GA-504", "GA-505", "GA-506", "GA-507", "GA-508", "GU-500", "HI-500", "HI-501",
    "IA-500", "IA-501", "IA-502", "ID-500", "ID-501", "IL-500", "IL-501", "IL-502", "IL-503", "IL-504", "IL-505", "IL-506", "IL-507", "IL-508", "IL-509", "IL-510", "IL-511", "IL-512",
    "IL-513", "IL-514", "IL-515", "IL-516", "IL-517", "IL-518", "IL-519", "IL-520", "IN-500", "IN-502", "IN-503", "KS-500", "KS-501", "KS-502", "KS-503", "KS-505", "KS-507",
    "KY-500", "KY-501", "KY-502", "LA-500", "LA-501", "LA-502", "LA-503", "LA-504", "LA-505", "LA-506", "LA-507", "LA-508", "LA-509",
    "MA Shared Jurisdiction", "MA-500", "MA-501", "MA-502", "MA-503", "MA-504", "MA-505", "MA-506", "MA-507", "MA-508", "MA-509", "MA-510",
    "MA-510 and MA-516 Shared Jurisdiction", "MA-510_513_516_518_Shared_Jurisdiction", "MA-510_MA-513_MA-516_MA-518 Shared Jurisdiction",
    "MA-510_MA-513_MA-516_Shared_Jurisdiction", "MA-510_MA-516_MA-518_Shared_Jurisdiction", "MA-510_MA-516_Shared_Jurisdiction",
    "MA-510_and_MA-516_Shared_Jurisdiction", "MA-511", "MA-512", "MA-513", "MA-514", "MA-515", "MA-516", "MA-517", "MA-518", "MA-519", "MA-520",
    "MA_510_MA_516_Shared_Jurisdiction", "MD-500", "MD-501", "MD-502", "MD-503", "MD-504", "MD-505", "MD-506", "MD-507", "MD-508", "MD-509", "MD-510", "MD-511", "MD-512",
    "MD-513", "MD-514", "MD-600", "MD-601", "ME-500", "ME-501", "ME-502", "MI-500", "MI-501", "MI-502", "MI-503", "MI-504", "MI-505", "MI-506", "MI-507", "MI-508", "MI-509", "MI-510", "MI-511", "MI-512",
    "MI-513", "MI-514", "MI-515", "MI-516", "MI-517", "MI-518", "MI-519", "MI-521", "MI-522", "MI-523", "MI-524", "MN-500", "MN-501", "MN-502", "MN-503", "MN-504", "MN-505", "MN-506", "MN-507", "MN-508", "MN-509", "MN-510", "MN-511", "MN-512",
    "MO-500", "MO-501", "MO-503", "MO-600", "MO-601", "MO-602", "MO-603", "MO-604", "MO-606", "MP-500", "MS-500", "MS-501", "MS-503", "MT-500",
    "NC-500", "NC-501", "NC-502", "NC-503", "NC-504", "NC-505", "NC-506", "NC-507", "NC-508", "NC-509", "NC-511", "NC-513", "NC-516",
    "ND-500", "NE-500", "NE-501", "NE-502", "NE-503", "NE-504", "NE-505", "NE-506", "NH-500", "NH-501", "NH-502", "NJ-500", "NJ-501", "NJ-502", "NJ-503", "NJ-504", "NJ-505", "NJ-506", "NJ-507", "NJ-508", "NJ-509", "NJ-510", "NJ-511", "NJ-512",
    "NJ-513", "NJ-514", "NJ-515", "NJ-516", "NJ-517", "NJ-518", "NJ-519", "NJ-520", "NM-500", "NM-501", "NV-500", "NV-501", "NV-502",
    "NY-500", "NY-501", "NY-502", "NY-503", "NY-504", "NY-505", "NY-506", "NY-507", "NY-508", "NY-509", "NY-510", "NY-511", "NY-512",
    "NY-513", "NY-514", "NY-515", "NY-516", "NY-517", "NY-518", "NY-519", "NY-520", "NY-521", "NY-522", "NY-523", "NY-524", "NY-525",
    "NY-600", "NY-601", "NY-602", "NY-603", "NY-604", "NY-605", "NY-606", "NY-607", "NY-608", "NY-609", "OH-500", "OH-501", "OH-502", "OH-503", "OH-504", "OH-505", "OH-506", "OH-507", "OH-508",
    "OK-500", "OK-501", "OK-502", "OK-503", "OK-504", "OK-505", "OK-506", "OK-507", "OR-500", "OR-501", "OR-502", "OR-503", "OR-504", "OR-505", "OR-506", "OR-507",
    "PA-500", "PA-501", "PA-502", "PA-503", "PA-504", "PA-505", "PA-506", "PA-507", "PA-508", "PA-509", "PA-510", "PA-511", "PA-512",
    "PA-600", "PA-601", "PA-602", "PA-603", "PA-605", "PR-502", "PR-503", "RI-500", "SC-500", "SC-501", "SC-502", "SC-503", "SC-504",
    "SD-500", "TN-500", "TN-501", "TN-502", "TN-503", "TN-504", "TN-506", "TN-507", "TN-509", "TN-510", "TN-512", "TX-500", "TX-501", "TX-503", "TX-504",
    "TX-600", "TX-601", "TX-603", "TX-604", "TX-607", "TX-610", "TX-611", "TX-613", "TX-624", "TX-700", "TX-701", "TX-702", "TX-703", "TX-704",
    "UT-500", "UT-503", "UT-504", "VA-500", "VA-501", "VA-502", "VA-503", "VA-504", "VA-505", "VA-507", "VA-508", "VA-509", "VA-510", "VA-512", "VA-513", "VA-514",
    "VA-517", "VA-518", "VA-519", "VA-521", "VA-600", "VA-601", "VA-602", "VA-603", "VA-604", "VI-500", "VT-500", "VT-501", "WA-500", "WA-501", "WA-502", "WA-503", "WA-504", "WA-506", "WA-507", "WA-508",
    "WI-500", "WI-501", "WI-502", "WI-503", "WV-500", "WV-501", "WV-503", "WV-508",
    "WY-500"
  ];

  // ---- RESET ALL FILTERS ----
  const handleReset = () => {
    setSelectedState("");
    setSelectedCocnums([]);   
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

          {/* STATE FILTER */}
          <StateFilter value={selectedState} onChange={setSelectedState} />

          <CocnumFilter
            value={selectedCocnums}
            onChange={setSelectedCocnums}
            cocnums={cocList}
          />
        </div>
      }
      left={<div style={{ color: "white" }}>Charts + Big Numbers</div>}
      map={<MapViewComponent
        selectedState={selectedState}
        selectedCocnums={selectedCocnums}
      />}
    />
  );
}
