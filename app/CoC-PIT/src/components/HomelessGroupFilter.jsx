export default function HomelessGroupFilter({ value, onChange }) {

  const groups = [
    "Overall Homeless",
    "Sheltered Total Homeless",
    "Sheltered ES Homeless",
    "Sheltered SH Homeless",
    "Sheltered TH Homeless",
    "Unsheltered Homeless"
  ];

  return (
    <select
      className="dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "220px" }}
    >
      {groups.map(g => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  );
}
