import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PopulationGroupSelector from "../PopulationGroupSelector";

const populationConfig = {
  all: {
    table: "sheltered_total_homeless",
    totalField: "a0167"
  },
  individuals: {
    table: "sheltered_total_homeless_individuals",
    totalField: "a0413"
  },
  families: {
    table: "sheltered_total_homeless_people_in_families",
    totalField: "a0618"
  },
  veterans: {
    table: "sheltered_total_homeless_veterans",
    totalField: "a0851"
  },
  unaccompanied_youth: {
    table: "sheltered_total_homeless_unaccompanied_youth_under_25",
    totalField: "a1049"
  },
  parenting_youth: {
    table: "sheltered_total_homeless_parenting_youth_under_25",
    totalField: "a1226"
  }
};

// --- LABELS (SHELTERED TOTAL) ---
const populationLabels = {
  all: "Sheltered Homeless (Total)",
  individuals: "Sheltered Homeless Individuals",
  families: "Sheltered Homeless People in Families",
  veterans: "Sheltered Homeless Veterans",
  unaccompanied_youth: "Sheltered Homeless Unaccompanied Youth (Under 25)",
  parenting_youth: "Sheltered Homeless Parenting Youth (Under 25)"
};

// --- Overall Sheltered -- //
// --- GENDER FIELDS (SHELTERED TOTAL - ALL) ---
const shelteredGenderFields = [
  { label: "Woman", field: "a0176" },
  { label: "Man", field: "a0177" },
  { label: "Transgender", field: "a0178" },
  { label: "Gender Questioning", field: "a0179" },
  { label: "Culturally Specific Identity", field: "a0180" },
  { label: "Different Identity", field: "a0181" },
  { label: "Non-Binary", field: "a0182" },
  { label: "More Than One Gender", field: "a0183" }
];

// --- AGE FIELDS (SHELTERED TOTAL - ALL) ---
const shelteredAgeFields = [
  { label: "Under 18", field: "a0168" },
  { label: "18–24", field: "a0169" },
  { label: "25–34", field: "a0171" },
  { label: "35–44", field: "a0172" },
  { label: "45–54", field: "a0173" },
  { label: "55–64", field: "a0174" },
  { label: "65+", field: "a0175" }
];

// Chart — ETHNICITY (EXCLUSIVE)
const ETHNICITY_FIELDS_SHELTERED = [
  { field: "a0185", label: "Hispanic / Latina/e/o" },
  { field: "a0184", label: "Non-Hispanic / Latina/e/o" }
];

// Chart — RACE (ONE IDENTITY ONLY)  ✅ ONLY-suffix fields + Hispanic Only
const RACE_ONLY_FIELDS_SHELTERED = [
  { field: "a0194", label: "American Indian / Alaska Native" },
  { field: "a0196", label: "Asian" },
  { field: "a0198", label: "Black / African American" },
  { field: "a0200", label: "Middle Eastern / North African" },
  { field: "a0202", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0204", label: "White" },
  { field: "a0206", label: "Multi-Racial" },
  { field: "a0207", label: "Hispanic / Latina / e / o Only" }
];

// Chart — RACE × ETHNICITY (HISPANIC/LATINA SUFFIX FIELDS)
const RACE_X_ETHNICITY_HISPANIC_SUFFIX_FIELDS_SHELTERED = [
  { field: "a0193", label: "American Indian / Alaska Native" },
  { field: "a0195", label: "Asian" },
  { field: "a0197", label: "Black / African American" },
  { field: "a0199", label: "Middle Eastern / North African" },
  { field: "a0201", label: "Native Hawaiian / Other Pacific Islander" },
  { field: "a0203", label: "White" },
  { field: "a0205", label: "Multi-Racial" },
];

// --- Overall Individuals Sheltered -- //
// --- SHELTERED INDIVIDUALS — GENDER ---
const GENDER_FIELDS_SHELTERED_INDIVIDUALS = [
  { field: "a0422", label: "Women" },
  { field: "a0423", label: "Men" },
  { field: "a0424", label: "Transgender" },
  { field: "a0425", label: "Gender Questioning" },
  { field: "a0426", label: "Culturally Specific Identity" },
  { field: "a0427", label: "Different Identity" },
  { field: "a0428", label: "Non-Binary" },
  { field: "a0429", label: "More Than One Gender" }
];

// --- SHELTERED INDIVIDUALS — AGE ---
const AGE_FIELDS_SHELTERED_INDIVIDUALS = [
  { field: "a0414", label: "Under 18" },
  { field: "a0415", label: "18–24" },
  { field: "a0417", label: "25–34" },
  { field: "a0418", label: "35–44" },
  { field: "a0419", label: "45–54" },
  { field: "a0420", label: "55–64" },
  { field: "a0421", label: "65+" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const ETHNICITY_FIELDS_SHELTERED_INDIVIDUALS = [
  { field: "a0431", label: "Hispanic" },
  { field: "a0430", label: "Non-Hispanic" }
];

// Chart 2 — RACE (SINGLE REPORTED IDENTITY)
const RACE_ONLY_FIELDS_SHELTERED_INDIVIDUALS = [
  { field: "a0440", label: "American Indian / Alaska Native" },
  { field: "a0442", label: "Asian" },
  { field: "a0444", label: "Black or African American" },
  { field: "a0446", label: "Middle Eastern or North African" },
  { field: "a0448", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0450", label: "White" },
  { field: "a0452", label: "Multi-Racial" },
  { field: "a0453", label: "Hispanic" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS_SHELTERED_INDIVIDUALS = [
  { field: "a0439", label: "American Indian / Alaska Native" },
  { field: "a0441", label: "Asian" },
  { field: "a0443", label: "Black" },
  { field: "a0445", label: "Middle Eastern or North African" },
  { field: "a0447", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0449", label: "White" },
  { field: "a0451", label: "Multi-Racial" }
];

// -- Sheltered Families -- //
// --- SHELTERED FAMILIES — GENDER ---
const GENDER_FIELDS_SHELTERED_FAMILIES = [
  { field: "a0627", label: "Women" },
  { field: "a0628", label: "Men" },
  { field: "a0629", label: "Transgender" },
  { field: "a0630", label: "Gender Questioning" },
  { field: "a0631", label: "Culturally Specific Identity" },
  { field: "a0632", label: "Different Identity" },
  { field: "a0633", label: "Non-Binary" },
  { field: "a0634", label: "More Than One Gender" }
];

// --- SHELTERED FAMILIES — AGE ---
const AGE_FIELDS_SHELTERED_FAMILIES = [
  { field: "a0619", label: "Under 18" },
  { field: "a0620", label: "18–24" },
  { field: "a0622", label: "25–34" },
  { field: "a0623", label: "35–44" },
  { field: "a0624", label: "45–54" },
  { field: "a0625", label: "55–64" },
  { field: "a0626", label: "65+" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const ETHNICITY_FIELDS_SHELTERED_FAMILIES = [
  { field: "a0636", label: "Hispanic" },
  { field: "a0635", label: "Non-Hispanic" }
];

// Chart 2 — RACE (SINGLE REPORTED IDENTITY)
const RACE_ONLY_FIELDS_SHELTERED_FAMILIES = [
  { field: "a0645", label: "American Indian / Alaska Native" },
  { field: "a0647", label: "Asian" },
  { field: "a0649", label: "Black or African American" },
  { field: "a0651", label: "Middle Eastern or North African" },
  { field: "a0653", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0655", label: "White" },
  { field: "a0657", label: "Multi-Racial" },
  { field: "a0658", label: "Hispanic" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS_SHELTERED_FAMILIES = [
  { field: "a0644", label: "American Indian / Alaska Native" },
  { field: "a0646", label: "Asian" },
  { field: "a0648", label: "Black" },
  { field: "a0650", label: "Middle Eastern or North African" },
  { field: "a0652", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0654", label: "White" },
  { field: "a0656", label: "Multi-Racial" }
];

// -- Sheltered Vets -- //
// --- SHELTERED VETERANS — GENDER ---
const GENDER_FIELDS_SHELTERED_VETERANS = [
  { field: "a0852", label: "Women" },
  { field: "a0853", label: "Men" },
  { field: "a0854", label: "Transgender" },
  { field: "a0855", label: "Gender Questioning" },
  { field: "a0856", label: "Culturally Specific Identity" },
  { field: "a0857", label: "Different Identity" },
  { field: "a0858", label: "Non-Binary" },
  { field: "a0859", label: "More Than One Gender" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const ETHNICITY_FIELDS_SHELTERED_VETERANS = [
  { field: "a0861", label: "Hispanic" },
  { field: "a0860", label: "Non-Hispanic" }
];

// Chart 2 — RACE (SINGLE REPORTED IDENTITY)
const RACE_ONLY_FIELDS_SHELTERED_VETERANS = [
  { field: "a0870", label: "American Indian / Alaska Native" },
  { field: "a0872", label: "Asian" },
  { field: "a0874", label: "Black or African American" },
  { field: "a0876", label: "Middle Eastern or North African" },
  { field: "a0878", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0880", label: "White" },
  { field: "a0882", label: "Multi-Racial" },
  { field: "a0883", label: "Hispanic" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS_SHELTERED_VETERANS = [
  { field: "a0869", label: "American Indian / Alaska Native" },
  { field: "a0871", label: "Asian" },
  { field: "a0873", label: "Black" },
  { field: "a0875", label: "Middle Eastern or North African" },
  { field: "a0877", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a0879", label: "White" },
  { field: "a0881", label: "Multi-Racial" }
];

// -- Unaccompanied Youth -- //
// --- SHELTERED UNACCOMPANIED YOUTH — GENDER ---
const GENDER_FIELDS_SHELTERED_UNACCOMPANIED_YOUTH = [
  { field: "a1050", label: "Women" },
  { field: "a1051", label: "Men" },
  { field: "a1052", label: "Transgender" },
  { field: "a1053", label: "Gender Questioning" },
  { field: "a1054", label: "Culturally Specific Identity" },
  { field: "a1055", label: "Different Identity" },
  { field: "a1056", label: "Non-Binary" },
  { field: "a1057", label: "More Than One Gender" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const ETHNICITY_FIELDS_SHELTERED_UNACCOMPANIED_YOUTH = [
  { field: "a1059", label: "Hispanic" },
  { field: "a1058", label: "Non-Hispanic" }
];

// Chart 2 — RACE (SINGLE REPORTED IDENTITY)
const RACE_ONLY_FIELDS_SHELTERED_UNACCOMPANIED_YOUTH = [
  { field: "a1068", label: "American Indian / Alaska Native" },
  { field: "a1070", label: "Asian" },
  { field: "a1072", label: "Black or African American" },
  { field: "a1074", label: "Middle Eastern or North African" },
  { field: "a1076", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1078", label: "White" },
  { field: "a1080", label: "Multi-Racial" },
  { field: "a1081", label: "Hispanic" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS_SHELTERED_UNACCOMPANIED_YOUTH = [
  { field: "a1067", label: "American Indian / Alaska Native" },
  { field: "a1069", label: "Asian" },
  { field: "a1071", label: "Black" },
  { field: "a1073", label: "Middle Eastern or North African" },
  { field: "a1075", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1077", label: "White" },
  { field: "a1079", label: "Multi-Racial" }
];

// -- Parenting Youth -- //
// --- SHELTERED PARENTING YOUTH — GENDER ---
const GENDER_FIELDS_SHELTERED_PARENTING_YOUTH = [
  { field: "a1227", label: "Women" },
  { field: "a1228", label: "Men" },
  { field: "a1229", label: "Transgender" },
  { field: "a1230", label: "Gender Questioning" },
  { field: "a1231", label: "Culturally Specific Identity" },
  { field: "a1232", label: "Different Identity" },
  { field: "a1233", label: "Non-Binary" },
  { field: "a1234", label: "More Than One Gender" }
];

// Chart 1 — ETHNICITY (PRIMARY, EXCLUSIVE)
const ETHNICITY_FIELDS_SHELTERED_PARENTING_YOUTH = [
  { field: "a1236", label: "Hispanic" },
  { field: "a1235", label: "Non-Hispanic" }
];

// Chart 2 — RACE (SINGLE REPORTED IDENTITY)
const RACE_ONLY_FIELDS_SHELTERED_PARENTING_YOUTH = [
  { field: "a1245", label: "American Indian / Alaska Native" },
  { field: "a1247", label: "Asian" },
  { field: "a1249", label: "Black or African American" },
  { field: "a1251", label: "Middle Eastern or North African" },
  { field: "a1253", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1255", label: "White" },
  { field: "a1257", label: "Multi-Racial" },
  { field: "a1258", label: "Hispanic" }
];

// Chart 3 — RACE × ETHNICITY (HISPANIC SUBSET)
const HISPANIC_RACE_FIELDS_SHELTERED_PARENTING_YOUTH = [
  { field: "a1244", label: "American Indian / Alaska Native" },
  { field: "a1246", label: "Asian" },
  { field: "a1248", label: "Black" },
  { field: "a1250", label: "Middle Eastern or North African" },
  { field: "a1252", label: "Native Hawaiian or Other Pacific Islander" },
  { field: "a1254", label: "White" },
  { field: "a1256", label: "Multi-Racial" }
];
